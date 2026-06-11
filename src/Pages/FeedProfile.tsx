import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Seo from "../components/Seo";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import feedService, {
  type FeedPost,
  type FeedUserProfile,
} from "../api/services/feed";
import { BouncyLoader } from "../components/agent/ui";
import {
  useFeedInteractions,
  ConnectedPost,
  ComposerModal,
  ROLE_LABEL,
  ROLE_PILL,
  initials,
} from "../components/feed/FeedUI";
import {
  ArrowLeft,
  Share2,
  BadgeCheck,
  MapPin,
  Building2,
  Clock,
  Link as LinkIcon,
  ShieldCheck,
  MessageCircle,
  Plus,
  Check,
  Star,
} from "lucide-react";

const FeedProfile = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<FeedUserProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const feed = useFeedInteractions(setPosts);

  // profile
  useEffect(() => {
    setProfileLoading(true);
    setNotFound(false);
    feedService
      .userProfile(id)
      .then((p) => {
        setProfile(p);
        setFollowing(p.viewer.following);
      })
      .catch(() => setNotFound(true))
      .finally(() => setProfileLoading(false));
  }, [id]);

  // posts
  const loadPosts = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await feedService.userPosts(id, { page: p, limit: 8 });
        setPosts((prev) => (p <= 1 ? res.items : [...prev, ...res.items]));
        setPage(res.page);
        setPages(res.pages);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
      setLoading(false);
    },
    [id],
  );

  useEffect(() => {
    setPosts([]);
    loadPosts(1);
  }, [id, loadPosts]);

  const hasMore = !!page && !!pages && page < pages;
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadPosts(page + 1);
      },
      { rootMargin: "500px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, page, loadPosts, posts.length]);

  const onFollow = async () => {
    if (!profile) return;
    const res = await feed.handleFollow(profile.id);
    if (res !== undefined) {
      setFollowing(res);
      setProfile((p) =>
        p
          ? {
              ...p,
              counts: {
                ...p.counts,
                followers: p.counts.followers + (res ? 1 : -1),
              },
            }
          : p,
      );
    }
  };

  const shareProfile = () => {
    navigator.clipboard
      ?.writeText(`${window.location.origin}/feed/u/${id}`)
      .then(() => feed.showToast("Profile link copied"))
      .catch(() => feed.showToast("Couldn't copy the link"));
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] font-heading">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-32 px-6">
          <p className="font-display text-2xl text-ink">User not found</p>
          <p className="text-sm text-ink-3 mt-2">
            This profile may have been removed.
          </p>
          <Link
            to="/feed"
            className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm"
          >
            Back to the feed
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isSelf = profile?.viewer.isSelf ?? false;
  const roleLabel = profile ? ROLE_LABEL[profile.role] : "";
  const handle = profile
    ? `@${profile.name.toLowerCase().replace(/\s+/g, ".")}`
    : "";
  const joined = profile
    ? new Date(profile.createdAt).toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-[#f5f0eb] font-heading">
      <Seo
        title={profile ? `${profile.name} · Feed` : "Profile"}
        description={
          profile?.bio ||
          "Community profile on PropertyLoop — posts, insights and listings."
        }
        path={`/feed/u/${id}`}
      />
      <Navbar />

      {/* cover */}
      <div className="relative h-[200px] sm:h-[240px] bg-gradient-to-br from-[#1c4a30] to-[#10301d] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/35" />
        <button
          onClick={() => navigate("/feed")}
          className="absolute top-5 left-5 w-[42px] h-[42px] rounded-full bg-white/90 grid place-items-center shadow-[0_4px_14px_rgba(0,0,0,0.18)] z-10 hover:bg-white transition-colors"
          aria-label="Back to feed"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-ink" />
        </button>
        <button
          onClick={shareProfile}
          className="absolute top-5 right-5 w-[42px] h-[42px] rounded-full bg-white/90 grid place-items-center shadow-[0_4px_14px_rgba(0,0,0,0.18)] z-10 hover:bg-white transition-colors"
          aria-label="Share profile"
        >
          <Share2 className="w-[17px] h-[17px] text-ink" />
        </button>
      </div>

      <div className="max-w-[1040px] mx-auto px-5 sm:px-8 pb-20">
        {/* header */}
        <div className="flex items-end gap-5 -mt-[58px] relative z-[3] flex-wrap">
          <div className="w-[120px] h-[120px] sm:w-[138px] sm:h-[138px] rounded-full border-[5px] border-[#f5f0eb] bg-primary-soft overflow-hidden shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.12)] grid place-items-center text-2xl font-bold text-primary-ink">
            {profileLoading ? (
              ""
            ) : profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials(profile?.name || "")
            )}
          </div>
          <div className="flex-1 min-w-0 pb-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[24px] sm:text-[28px] font-extrabold tracking-[-0.02em] text-ink">
                {profile?.name || "…"}
              </h1>
              {profile?.verified && (
                <BadgeCheck className="w-5 h-5 text-primary" />
              )}
              {profile && (
                <span
                  className={`text-xs font-extrabold tracking-[0.04em] uppercase px-2.5 py-0.5 rounded-full ${ROLE_PILL[profile.role] || ROLE_PILL.ADMIN}`}
                >
                  {roleLabel}
                </span>
              )}
            </div>
            <div className="text-sm text-ink-3 mt-1 truncate">
              {handle}
              {profile?.agency ? ` · ${profile.agency}` : ""}
              {profile?.serviceCategory ? ` · ${profile.serviceCategory}` : ""}
            </div>
          </div>
          {profile && !isSelf && (
            <div className="flex gap-2.5 pb-1.5">
              <button
                onClick={() => {
                  if (!feed.requireAuth()) return;
                  navigate(
                    profile.role === "AGENT"
                      ? `/agent/${profile.id}`
                      : profile.role === "VENDOR"
                        ? `/vendor/${profile.id}`
                        : "/messages",
                  );
                }}
                className="border border-line bg-white px-5 py-3 rounded-full font-bold text-[14.5px] inline-flex items-center gap-2 hover:border-primary hover:text-primary-ink transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button
                onClick={onFollow}
                className={`px-6 py-3 rounded-full font-bold text-[14.5px] inline-flex items-center gap-2 transition-colors ${
                  following
                    ? "bg-surface-2 text-ink border border-line"
                    : "bg-primary text-white hover:bg-primary-light"
                }`}
              >
                {following ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {following ? "Following" : "Follow"}
              </button>
            </div>
          )}
          {isSelf && (
            <div className="flex gap-2.5 pb-1.5">
              <button
                onClick={() => setComposerOpen(true)}
                className="bg-primary text-white px-6 py-3 rounded-full font-bold text-[14.5px] inline-flex items-center gap-2 hover:bg-primary-light transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create a post
              </button>
            </div>
          )}
        </div>

        {/* body grid */}
        <div className="grid md:grid-cols-[330px_1fr] gap-7 mt-7 items-start">
          {/* left info column */}
          <aside className="flex flex-col gap-4 md:sticky md:top-8">
            {/* stats */}
            <div className="bg-white rounded-[18px] p-5 shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
              <div className="flex text-center">
                {[
                  { n: profile?.counts.posts ?? 0, l: "Posts" },
                  { n: profile?.counts.followers ?? 0, l: "Followers" },
                  { n: profile?.counts.following ?? 0, l: "Following" },
                ].map((s, i) => (
                  <div
                    key={s.l}
                    className={`flex-1 py-1 ${i > 0 ? "border-l border-line-2" : ""}`}
                  >
                    <div className="font-display font-bold text-[23px] tracking-[-0.02em] text-ink">
                      {s.n.toLocaleString()}
                    </div>
                    <div className="text-xs text-ink-3 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* bio + details */}
            {(profile?.bio ||
              profile?.location ||
              profile?.agency ||
              profile?.website) && (
              <div className="bg-white rounded-[18px] p-5 shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
                {profile?.bio && (
                  <p className="text-[14.5px] text-ink-2 leading-relaxed mb-4">
                    {profile.bio}
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  {profile?.location && (
                    <Detail icon={<MapPin className="w-4 h-4" />}>
                      {profile.location}
                    </Detail>
                  )}
                  {profile?.agency && (
                    <Detail icon={<Building2 className="w-4 h-4" />}>
                      {profile.agency}
                    </Detail>
                  )}
                  {profile?.serviceArea && (
                    <Detail icon={<MapPin className="w-4 h-4" />}>
                      Serves {profile.serviceArea}
                    </Detail>
                  )}
                  {joined && (
                    <Detail icon={<Clock className="w-4 h-4" />}>
                      Joined {joined}
                    </Detail>
                  )}
                  {profile?.website && (
                    <Detail icon={<LinkIcon className="w-4 h-4" />}>
                      <a
                        href={
                          profile.website.startsWith("http")
                            ? profile.website
                            : `https://${profile.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-ink font-bold hover:underline"
                      >
                        {profile.website.replace(/^https?:\/\//, "")}
                      </a>
                    </Detail>
                  )}
                </div>
              </div>
            )}

            {/* KYC trust card */}
            {profile?.verified && (
              <div className="bg-white rounded-[18px] p-5 shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 bg-primary-soft rounded-[14px] px-4 py-3.5">
                  <div className="w-[38px] h-[38px] rounded-[11px] bg-primary text-white grid place-items-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <b className="text-[13.5px] font-extrabold text-primary-ink block">
                      KYC Verified {roleLabel}
                    </b>
                    <span className="text-[11.5px] text-primary-ink/80">
                      Identity {profile.role === "AGENT" ? "& licence" : ""}{" "}
                      confirmed
                    </span>
                  </div>
                </div>
                {(profile.rating != null ||
                  profile.soldRentedCount != null ||
                  profile.jobsCount != null) && (
                  <div className="flex text-center mt-4">
                    {profile.rating != null && (
                      <Stat
                        border={false}
                        n={
                          <span className="inline-flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-current text-accent" />
                            {profile.rating.toFixed(1)}
                          </span>
                        }
                        l="Rating"
                      />
                    )}
                    {profile.role === "AGENT" &&
                      profile.soldRentedCount != null && (
                        <Stat
                          border
                          n={profile.soldRentedCount}
                          l="Deals closed"
                        />
                      )}
                    {profile.role === "VENDOR" &&
                      profile.jobsCount != null && (
                        <Stat border n={profile.jobsCount} l="Jobs done" />
                      )}
                    {profile.role === "AGENT" &&
                      profile.listingsCount != null && (
                        <Stat border n={profile.listingsCount} l="Listings" />
                      )}
                  </div>
                )}
              </div>
            )}

            {/* specialties */}
            {profile && profile.specialty.length > 0 && (
              <div className="bg-white rounded-[18px] p-5 shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
                <div className="text-xs font-extrabold tracking-[0.06em] uppercase text-ink-3 mb-3.5">
                  Specialties
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.specialty.map((s) => (
                    <span
                      key={s}
                      className="text-[13px] font-bold text-ink-2 bg-surface-2 px-3.5 py-2 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* main posts column */}
          <main className="min-w-0">
            <div className="flex items-center gap-2 mb-4 px-1">
              <h2 className="text-[15px] font-extrabold text-ink">Posts</h2>
              <span className="text-ink-3 text-sm">
                {profile?.counts.posts ?? 0}
              </span>
            </div>

            {loading && posts.length === 0 ? (
              <div className="flex flex-col gap-5">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[20px] p-5 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-2" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-36 bg-surface-2 rounded-full" />
                        <div className="h-3 w-24 bg-surface-2 rounded-full" />
                      </div>
                    </div>
                    <div className="h-3.5 w-full bg-surface-2 rounded-full mt-4" />
                    <div className="h-3.5 w-2/3 bg-surface-2 rounded-full mt-2" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-[20px] p-10 text-center">
                <p className="font-display text-xl text-ink">No posts yet</p>
                <p className="text-sm text-ink-3 mt-2">
                  {isSelf
                    ? "Share your first update with the community."
                    : `${profile?.name || "This user"} hasn't posted yet.`}
                </p>
                {isSelf && (
                  <button
                    onClick={() => setComposerOpen(true)}
                    className="mt-5 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-light transition-colors"
                  >
                    Create a post
                  </button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <ConnectedPost key={post.id} post={post} feed={feed} />
              ))
            )}

            {posts.length > 0 && (
              <div ref={loadMoreRef} className="py-8">
                {loading && page > 1 ? (
                  <BouncyLoader label="Loading more…" />
                ) : !hasMore ? (
                  <p className="text-center text-sm text-ink-3">
                    End of posts
                  </p>
                ) : null}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {composerOpen && (
        <ComposerModal
          initialType="Photos"
          userName={user?.name || "You"}
          userRole={user?.role || "BUYER"}
          userAvatar={user?.avatarUrl || null}
          isAgent={user?.role === "AGENT"}
          onClose={() => setComposerOpen(false)}
          onPosted={(post) => {
            setComposerOpen(false);
            setPosts((prev) => [post, ...prev]);
            setProfile((p) =>
              p
                ? { ...p, counts: { ...p.counts, posts: p.counts.posts + 1 } }
                : p,
            );
            feed.showToast("Posted to the feed");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onError={(msg) => feed.showToast(msg)}
        />
      )}

      {feed.overlays}
    </div>
  );
};

const Detail = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 text-[13.5px] text-ink-2 font-semibold">
    <span className="text-ink-3 shrink-0">{icon}</span>
    {children}
  </div>
);

const Stat = ({
  n,
  l,
  border,
}: {
  n: React.ReactNode;
  l: string;
  border: boolean;
}) => (
  <div className={`flex-1 py-1 ${border ? "border-l border-line-2" : ""}`}>
    <div className="font-display font-bold text-[20px] tracking-[-0.02em] text-ink">
      {n}
    </div>
    <div className="text-[11px] text-ink-3 mt-0.5">{l}</div>
  </div>
);

export default FeedProfile;

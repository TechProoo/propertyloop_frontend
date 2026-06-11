import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Seo from "../components/Seo";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import feedService, {
  type FeedPost,
  type FeedMeta,
  type FeedAuthor,
} from "../api/services/feed";
import { BouncyLoader } from "../components/agent/ui";
import {
  useFeedInteractions,
  ConnectedPost,
  ComposerModal,
  Avatar,
  ROLE_LABEL,
} from "../components/feed/FeedUI";
import {
  Home,
  TrendingUp,
  MessageCircle,
  Bookmark,
  User as UserIcon,
  Search,
  Image as ImageIcon,
  Building2,
  BarChart3,
  BadgeCheck,
  UserPlus,
  X,
} from "lucide-react";

const FILTERS: { key: string; label: string }[] = [
  { key: "for-you", label: "For you" },
  { key: "following", label: "Following" },
  { key: "INSIGHT", label: "Market insights" },
  { key: "PROJECT", label: "Completed projects" },
  { key: "TIP", label: "Property tips" },
  { key: "NEWS", label: "Industry news" },
];

const Feed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [filter, setFilter] = useState("for-you");
  const [hashtag, setHashtag] = useState<string | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<FeedMeta | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<string>("Photos");

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const feed = useFeedInteractions(setPosts, {
    onFollowChange: (userId, following) =>
      setMeta((m) =>
        m
          ? {
              ...m,
              suggestions: m.suggestions.map((s) =>
                s.id === userId
                  ? {
                      ...s,
                      followersCount: s.followersCount + (following ? 1 : -1),
                    }
                  : s,
              ),
            }
          : m,
      ),
  });

  const loadPosts = useCallback(
    async (p: number, f: string, h: string | null) => {
      setLoading(true);
      try {
        const res = await feedService.list({
          filter: h ? undefined : f,
          hashtag: h || undefined,
          page: p,
          limit: 10,
        });
        setPosts((prev) => (p <= 1 ? res.items : [...prev, ...res.items]));
        setPage(res.page);
        setPages(res.pages);
      } catch (err) {
        console.error("Failed to load feed:", err);
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    setPosts([]);
    loadPosts(1, filter, hashtag);
  }, [filter, hashtag, loadPosts]);

  // Pick a feed filter and clear any active hashtag.
  const selectFilter = useCallback((key: string) => {
    setHashtag(null);
    setFilter(key);
  }, []);

  const selectHashtag = useCallback((tag: string) => {
    setHashtag(tag.replace(/^#/, ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    feedService
      .meta()
      .then(setMeta)
      .catch((err) => console.error("Failed to load feed meta:", err));
  }, []);

  const hasMore = !!page && !!pages && page < pages;
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadPosts(page + 1, filter, hashtag);
      },
      { rootMargin: "500px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, page, filter, hashtag, loadPosts, posts.length]);

  const openComposer = (type: string) => {
    if (!feed.requireAuth()) return;
    setComposerType(type);
    setComposerOpen(true);
  };

  const roleCount = (role: string) =>
    meta?.roles.find((r) => r.role === role)?.count ?? 0;

  return (
    <div className="min-h-screen bg-[#f5f0eb] font-heading">
      <Seo
        title="Community Feed"
        description="Updates, market insights, completed projects and property tips from verified agents, vendors, buyers and developers across Nigeria."
        path="/feed"
        keywords="property community Nigeria, real estate feed, market insights Lagos, PropertyLoop feed"
      />
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-6 md:px-10 pt-8 pb-20 grid lg:grid-cols-[248px_1fr_320px] gap-8 items-start">
        {/* ── LEFT RAIL ── */}
        <aside className="hidden lg:block sticky top-8">
          <h2 className="font-display font-semibold text-[1.875rem] tracking-[-0.02em] text-ink">
            Community
          </h2>
          <p className="text-[13.5px] text-ink-3 leading-relaxed mt-1 mb-5">
            Where everyone in property talks shop.
          </p>
          <nav className="flex flex-col gap-1">
            {[
              { icon: <Home className="w-5 h-5" />, label: "Home feed", key: "for-you" },
              { icon: <Search className="w-5 h-5" />, label: "Explore", key: "explore", ct: "Trending" },
              { icon: <TrendingUp className="w-5 h-5" />, label: "Market insights", key: "INSIGHT" },
              { icon: <MessageCircle className="w-5 h-5" />, label: "Discussions", key: "POLL" },
              { icon: <Bookmark className="w-5 h-5" />, label: "Saved", key: "saved", ct: meta?.savedCount ? String(meta.savedCount) : undefined },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.key === "saved" && !feed.requireAuth()) return;
                  selectFilter(item.key);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-[13px] text-[15px] font-semibold transition-colors text-left ${
                  filter === item.key && !hashtag
                    ? "bg-primary text-white"
                    : "text-ink-2 hover:bg-surface-2"
                }`}
              >
                {item.icon}
                {item.label}
                {item.ct && (
                  <span
                    className={`ml-auto text-xs font-bold ${filter === item.key && !hashtag ? "text-white/80" : "text-ink-3"}`}
                  >
                    {item.ct}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => {
                if (!feed.requireAuth()) return;
                navigate(`/feed/u/${user!.id}`);
              }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-[13px] text-[15px] font-semibold text-ink-2 hover:bg-surface-2 transition-colors text-left"
            >
              <UserIcon className="w-5 h-5" />
              My profile
            </button>
          </nav>

          <div className="mt-6 bg-white rounded-[18px] p-4.5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <h4 className="text-xs font-extrabold tracking-[0.1em] uppercase text-ink-3 mb-3.5 px-0.5">
              Who's here
            </h4>
            {[
              { dot: "bg-primary", label: "Agents", count: roleCount("AGENT") },
              { dot: "bg-[#d98a2b]", label: "Vendors", count: roleCount("VENDOR") },
              { dot: "bg-[#3b82c4]", label: "Buyers & Renters", count: roleCount("BUYER") },
            ].map((r) => (
              <div
                key={r.label}
                className="flex items-center gap-2.5 py-1.5 text-sm font-semibold text-ink"
              >
                <span className={`w-[9px] h-[9px] rounded-full shrink-0 ${r.dot}`} />
                {r.label}
                <span className="ml-auto text-xs text-ink-3 font-semibold">
                  {r.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── CENTER FEED ── */}
        <main className="min-w-0">
          {/* composer */}
          <div className="bg-white rounded-[20px] p-4.5 shadow-[0_1px_10px_rgba(0,0,0,0.05)] mb-5">
            <div className="flex items-center gap-3.5">
              <Avatar
                author={{ name: user?.name || "You", avatarUrl: user?.avatarUrl || null }}
                size={46}
              />
              <button
                onClick={() => openComposer("Photos")}
                className="flex-1 bg-surface-2 rounded-full px-5 py-3.5 text-[15px] text-ink-3 text-left hover:bg-line-2 transition-colors"
              >
                Share an update, insight, or project…
              </button>
            </div>
            <div className="flex gap-1.5 mt-3.5 pt-3.5 border-t border-line-2">
              {[
                { label: "Photo", type: "Photos", icon: <ImageIcon className="w-[19px] h-[19px]" />, color: "text-primary" },
                { label: "Insight", type: "Insight", icon: <TrendingUp className="w-[19px] h-[19px]" />, color: "text-accent" },
                { label: "Project", type: "Project", icon: <Building2 className="w-[19px] h-[19px]" />, color: "text-[#2a6f9e]" },
                { label: "Poll", type: "Poll", icon: <BarChart3 className="w-[19px] h-[19px]" />, color: "text-[#9e2a6f]" },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => openComposer(b.type)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13.5px] font-bold text-ink-2 hover:bg-surface-2 transition-colors"
                >
                  <span className={b.color}>{b.icon}</span>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* active hashtag banner */}
          {hashtag ? (
            <div className="flex items-center gap-3 bg-white border border-line rounded-full pl-5 pr-2 py-2 mb-4">
              <span className="text-[15px] font-extrabold text-primary">
                #{hashtag}
              </span>
              <span className="text-[13px] text-ink-3">Tagged posts</span>
              <button
                onClick={() => selectFilter("for-you")}
                className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-ink-2 bg-surface-2 hover:bg-line-2 px-3.5 py-1.5 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          ) : (
            /* filter chips */
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    if (f.key === "following" && !feed.requireAuth()) return;
                    selectFilter(f.key);
                  }}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13.5px] font-bold border transition-colors ${
                    filter === f.key
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-ink-2 border-line hover:border-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* posts */}
          {loading && posts.length === 0 ? (
            <div className="flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[20px] p-5 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-2" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-36 bg-surface-2 rounded-full" />
                      <div className="h-3 w-24 bg-surface-2 rounded-full" />
                    </div>
                  </div>
                  <div className="h-3.5 w-full bg-surface-2 rounded-full mt-4" />
                  <div className="h-3.5 w-2/3 bg-surface-2 rounded-full mt-2" />
                  <div className="h-40 w-full bg-surface-2 rounded-2xl mt-4" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-[20px] p-10 text-center">
              <p className="font-display text-xl text-ink">Nothing here yet</p>
              <p className="text-sm text-ink-3 mt-2 max-w-xs mx-auto">
                {hashtag
                  ? `No posts tagged #${hashtag} yet — be the first.`
                  : filter === "following"
                    ? "Follow agents, vendors and developers to fill this feed."
                    : filter === "saved"
                      ? "Posts you save will appear here."
                      : "Be the first to share an update with the community."}
              </p>
              <button
                onClick={() => openComposer("Photos")}
                className="mt-5 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-light transition-colors"
              >
                Create a post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <ConnectedPost key={post.id} post={post} feed={feed} />
            ))
          )}

          {posts.length > 0 && (
            <div ref={loadMoreRef} className="py-8">
              {loading && page > 1 ? (
                <BouncyLoader label="Loading more posts…" />
              ) : !hasMore ? (
                <p className="text-center text-sm text-ink-3">
                  You're all caught up
                </p>
              ) : null}
            </div>
          )}
        </main>

        {/* ── RIGHT RAIL ── */}
        <aside className="hidden lg:flex flex-col gap-5 sticky top-8">
          <div className="bg-white rounded-[18px] p-4.5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <h4 className="flex items-center gap-2 text-[13px] font-extrabold tracking-[0.04em] uppercase text-ink-3 mb-2">
              <TrendingUp className="w-[15px] h-[15px]" /> Trending now
            </h4>
            {meta && meta.trending.length > 0 ? (
              meta.trending.map((t, i) => (
                <button
                  key={t.tag}
                  onClick={() => selectHashtag(t.tag)}
                  className={`w-full text-left py-2.5 px-1 -mx-1 rounded-lg hover:bg-surface-2 transition-colors ${i > 0 ? "border-t border-line-2" : ""} ${hashtag && `#${hashtag}`.toLowerCase() === t.tag.toLowerCase() ? "bg-surface-2" : ""}`}
                >
                  <div className="text-[14.5px] font-extrabold text-primary">
                    {t.tag}
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5">
                    {t.count} {t.count === 1 ? "post" : "posts"} this month
                  </div>
                </button>
              ))
            ) : (
              <p className="text-[13px] text-ink-3 py-2">
                Hashtags trend here as the community posts.
              </p>
            )}
          </div>

          <div className="bg-white rounded-[18px] p-4.5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <h4 className="flex items-center gap-2 text-[13px] font-extrabold tracking-[0.04em] uppercase text-ink-3 mb-2">
              <UserPlus className="w-[15px] h-[15px]" /> People to follow
            </h4>
            {meta && meta.suggestions.length > 0 ? (
              meta.suggestions.map((s, i) => (
                <SuggestionRow
                  key={s.id}
                  person={s}
                  border={i > 0}
                  onOpen={() => navigate(`/feed/u/${s.id}`)}
                  onFollow={() => feed.handleFollow(s.id)}
                />
              ))
            ) : (
              <p className="text-[13px] text-ink-3 py-2">
                Suggestions appear as agents and vendors join.
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#1c4a30] to-[#10301d] rounded-[18px] p-5.5 text-white">
            <h3 className="font-display font-semibold text-[22px] tracking-[-0.01em] mb-2">
              Grow your name in property
            </h3>
            <p className="text-[13.5px] text-white/70 leading-relaxed mb-4">
              Post insights, showcase work, and get discovered by buyers,
              sellers and pros across Nigeria.
            </p>
            <button
              onClick={() => openComposer("Photos")}
              className="w-full bg-white text-ink py-3 rounded-full font-bold text-[14.5px] hover:bg-white/90 transition-colors"
            >
              Create your first post
            </button>
          </div>
        </aside>
      </div>

      <Footer />

      {composerOpen && (
        <ComposerModal
          initialType={composerType}
          userName={user?.name || "You"}
          userRole={user?.role || "BUYER"}
          userAvatar={user?.avatarUrl || null}
          isAgent={user?.role === "AGENT"}
          onClose={() => setComposerOpen(false)}
          onPosted={(post) => {
            setComposerOpen(false);
            setPosts((prev) => [post, ...prev]);
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

/* ── right-rail suggestion row ───────────────────────────────────────── */

const SuggestionRow = ({
  person,
  border,
  onOpen,
  onFollow,
}: {
  person: FeedAuthor & { followersCount: number };
  border: boolean;
  onOpen: () => void;
  onFollow: () => Promise<boolean | undefined>;
}) => {
  const [following, setFollowing] = useState(false);
  return (
    <div className={`flex items-center gap-2.5 py-2.5 ${border ? "border-t border-line-2" : ""}`}>
      <Avatar author={person} size={42} onClick={onOpen} />
      <div className="min-w-0 cursor-pointer" onClick={onOpen}>
        <div className="flex items-center gap-1 text-sm font-extrabold text-ink truncate">
          {person.name}
          {person.verified && (
            <BadgeCheck className="w-[13px] h-[13px] text-primary shrink-0" />
          )}
        </div>
        <div className="text-[11.5px] text-ink-3 truncate">
          {ROLE_LABEL[person.role]}
          {person.serviceCategory
            ? ` · ${person.serviceCategory}`
            : person.location
              ? ` · ${person.location}`
              : ""}
        </div>
      </div>
      <button
        onClick={async () => {
          const res = await onFollow();
          if (res !== undefined) setFollowing(res);
        }}
        className={`ml-auto shrink-0 text-[12.5px] font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
          following
            ? "bg-primary text-white border-primary"
            : "border-primary text-primary-ink hover:bg-primary hover:text-white"
        }`}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default Feed;

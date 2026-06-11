// Shared building blocks for the Social Feed — used by both the main feed
// page and the per-user feed profile page so post cards, overlays and the
// like/save/comment/share/follow interaction logic stay in one place.
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import feedService, {
  type FeedPost,
  type FeedComment,
  type FeedAuthor,
  type FeedPostType,
  type CreateFeedPostPayload,
} from "../../api/services/feed";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import { BouncyLoader } from "../agent/ui";
import {
  Home,
  TrendingUp,
  MessageCircle,
  Bookmark,
  Image as ImageIcon,
  Building2,
  BarChart3,
  X,
  Heart,
  Share2,
  MoreHorizontal,
  BadgeCheck,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Send,
  Check,
  Link2,
  Flag,
  Trash2,
  Mail,
  Plus,
  Camera,
} from "lucide-react";

/* ── tokens / helpers ────────────────────────────────────────────────── */

export const ROLE_PILL: Record<string, string> = {
  AGENT: "bg-primary-soft text-primary-ink",
  VENDOR: "bg-[#fdeede] text-[#9a5a16]",
  BUYER: "bg-[#e4eef7] text-[#245a82]",
  ADMIN: "bg-surface-2 text-ink-2",
};

export const ROLE_LABEL: Record<string, string> = {
  AGENT: "Agent",
  VENDOR: "Vendor",
  BUYER: "Buyer",
  ADMIN: "PropertyLoop",
};

export const TYPE_TAG: Partial<
  Record<FeedPostType, { label: string; className: string }>
> = {
  INSIGHT: { label: "Market insight", className: "text-accent" },
  PROJECT: { label: "Completed project", className: "text-primary" },
  TIP: { label: "Property tip", className: "text-[#8b54a8]" },
  NEWS: { label: "Industry news", className: "text-[#245a82]" },
};

export const timeAgo = (iso: string) => {
  const s = Math.max(1, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
};

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const HashBody = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => (
  <p
    className={`text-[15.5px] leading-relaxed text-ink whitespace-pre-wrap break-words ${className}`}
  >
    {text.split(/(#[A-Za-z]\w*)/g).map((part, i) =>
      part.startsWith("#") ? (
        <span key={i} className="text-primary font-bold">
          {part}
        </span>
      ) : (
        part
      ),
    )}
  </p>
);

export const Avatar = ({
  author,
  size = 48,
  onClick,
}: {
  author: { name: string; avatarUrl: string | null };
  size?: number;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    style={{ width: size, height: size }}
    className={`rounded-full bg-surface-2 overflow-hidden shrink-0 grid place-items-center text-[11px] font-bold text-primary-ink ${onClick ? "cursor-pointer" : ""}`}
  >
    {author.avatarUrl ? (
      <img
        src={author.avatarUrl}
        alt={author.name}
        className="w-full h-full object-cover"
      />
    ) : (
      initials(author.name)
    )}
  </div>
);

export const RolePill = ({ role }: { role: string }) => (
  <span
    className={`text-[10.5px] font-extrabold tracking-[0.04em] uppercase px-2.5 py-0.5 rounded-full ${ROLE_PILL[role] || ROLE_PILL.ADMIN}`}
  >
    {ROLE_LABEL[role] || role}
  </span>
);

/* ── interactions hook ───────────────────────────────────────────────── */

/**
 * Bundles all post-mutation logic + overlay state for a list of feed posts.
 * Both the feed page and the profile page drive their own `setPosts` through
 * this hook, then render the returned `<overlays>` element once.
 */
export function useFeedInteractions(
  setPosts: React.Dispatch<React.SetStateAction<FeedPost[]>>,
  opts?: { onFollowChange?: (userId: string, following: boolean) => void },
) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [toast, setToast] = useState<string | null>(null);
  const [commentsPost, setCommentsPost] = useState<FeedPost | null>(null);
  const [sharePost, setSharePost] = useState<FeedPost | null>(null);
  const [menuPost, setMenuPost] = useState<{
    post: FeedPost;
    x: number;
    y: number;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const requireAuth = useCallback((): boolean => {
    if (!isLoggedIn) {
      navigate("/onboarding");
      return false;
    }
    return true;
  }, [isLoggedIn, navigate]);

  const patchPost = useCallback(
    (id: string, patch: Partial<FeedPost>) =>
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      ),
    [setPosts],
  );

  const handleLike = useCallback(
    async (post: FeedPost) => {
      if (!requireAuth()) return;
      patchPost(post.id, {
        likesCount: post.viewer.liked
          ? post.likesCount - 1
          : post.likesCount + 1,
        viewer: { ...post.viewer, liked: !post.viewer.liked },
      });
      try {
        const res = await feedService.toggleLike(post.id);
        patchPost(post.id, {
          likesCount: res.count,
          viewer: { ...post.viewer, liked: res.liked },
        });
      } catch {
        patchPost(post.id, post);
      }
    },
    [patchPost, requireAuth],
  );

  const handleSave = useCallback(
    async (post: FeedPost) => {
      if (!requireAuth()) return;
      try {
        const res = await feedService.toggleSave(post.id);
        patchPost(post.id, { viewer: { ...post.viewer, saved: res.saved } });
        showToast(
          res.saved ? "Saved to your collection" : "Removed from saved",
        );
      } catch {
        showToast("Something went wrong");
      }
    },
    [patchPost, requireAuth, showToast],
  );

  const handleVote = useCallback(
    async (post: FeedPost, optionId: string) => {
      if (!requireAuth()) return;
      try {
        const res = await feedService.vote(post.id, optionId);
        patchPost(post.id, {
          poll: post.poll
            ? { ...post.poll, totalVotes: res.totalVotes, options: res.options }
            : post.poll,
          viewer: { ...post.viewer, votedOptionId: res.votedOptionId },
        });
      } catch (err: any) {
        showToast(err?.response?.data?.message || "Couldn't record your vote");
      }
    },
    [patchPost, requireAuth, showToast],
  );

  const handleFollow = useCallback(
    async (userId: string): Promise<boolean | undefined> => {
      if (!requireAuth()) return;
      try {
        const res = await feedService.toggleFollow(userId);
        setPosts((prev) =>
          prev.map((p) =>
            p.author.id === userId
              ? { ...p, viewer: { ...p.viewer, followingAuthor: res.following } }
              : p,
          ),
        );
        opts?.onFollowChange?.(userId, res.following);
        showToast(res.following ? "Following" : "Unfollowed");
        return res.following;
      } catch {
        showToast("Something went wrong");
      }
    },
    [requireAuth, setPosts, showToast, opts],
  );

  const handleDelete = useCallback(
    async (post: FeedPost) => {
      try {
        await feedService.remove(post.id);
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        showToast("Post deleted");
      } catch {
        showToast("Couldn't delete the post");
      }
    },
    [setPosts, showToast],
  );

  const openProfile = useCallback(
    (author: { id: string }) => navigate(`/feed/u/${author.id}`),
    [navigate],
  );

  const copyLink = useCallback(
    (post: FeedPost) => {
      navigator.clipboard
        ?.writeText(`${window.location.origin}/feed?post=${post.id}`)
        .then(() => showToast("Link copied"))
        .catch(() => showToast("Couldn't copy the link"));
    },
    [showToast],
  );

  const openMore = useCallback((post: FeedPost, e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPost({
      post,
      x: Math.min(r.left - 208, window.innerWidth - 270),
      y: r.bottom + 6,
    });
  }, []);

  // Esc closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCommentsPost(null);
        setSharePost(null);
        setMenuPost(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const overlays = (
    <>
      {commentsPost && (
        <CommentsDrawer
          post={commentsPost}
          canComment={isLoggedIn}
          onNeedAuth={() => navigate("/onboarding")}
          onClose={() => setCommentsPost(null)}
          onCountChange={(n) => patchPost(commentsPost.id, { commentsCount: n })}
          onProfile={(a) => openProfile(a)}
        />
      )}
      {sharePost && (
        <ShareSheet
          post={sharePost}
          onClose={() => setSharePost(null)}
          onCopy={() => {
            copyLink(sharePost);
            setSharePost(null);
          }}
        />
      )}
      {menuPost && (
        <PostMenu
          post={menuPost.post}
          x={menuPost.x}
          y={menuPost.y}
          onClose={() => setMenuPost(null)}
          onSave={() => {
            handleSave(menuPost.post);
            setMenuPost(null);
          }}
          onCopy={() => {
            copyLink(menuPost.post);
            setMenuPost(null);
          }}
          onReport={async () => {
            const post = menuPost.post;
            setMenuPost(null);
            if (!requireAuth()) return;
            try {
              await feedService.report(post.id);
              showToast("Thanks — we'll review this post");
            } catch {
              showToast("Couldn't submit the report");
            }
          }}
          onDelete={() => {
            handleDelete(menuPost.post);
            setMenuPost(null);
          }}
        />
      )}
      <FeedToast message={toast} />
    </>
  );

  return {
    isLoggedIn,
    requireAuth,
    showToast,
    patchPost,
    handleLike,
    handleSave,
    handleVote,
    handleFollow,
    handleDelete,
    openProfile,
    openMore,
    setCommentsPost,
    setSharePost,
    overlays,
  };
}

export const FeedToast = ({ message }: { message: string | null }) => (
  <div
    className={`fixed left-1/2 bottom-8 -translate-x-1/2 bg-ink text-white px-5.5 py-3.5 rounded-full text-sm font-bold flex items-center gap-2.5 z-[200] shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-all duration-250 ${
      message
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-5 pointer-events-none"
    }`}
  >
    <Check className="w-[18px] h-[18px] text-[#7ad296]" />
    {message}
  </div>
);

/* ── post card ───────────────────────────────────────────────────────── */

export const PostCard = ({
  post,
  onLike,
  onSave,
  onShare,
  onComments,
  onVote,
  onProfile,
  onMore,
}: {
  post: FeedPost;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onComments: () => void;
  onVote: (optionId: string) => void;
  onProfile: () => void;
  onMore: (e: React.MouseEvent) => void;
}) => {
  const tag = TYPE_TAG[post.type];
  const pollEnded =
    post.poll?.endsAt != null && new Date(post.poll.endsAt) < new Date();

  return (
    <article className="bg-white rounded-[20px] p-5 sm:p-5.5 shadow-[0_1px_10px_rgba(0,0,0,0.05)] mb-5">
      {/* head */}
      <div className="flex items-center gap-3">
        <Avatar author={post.author} size={48} onClick={onProfile} />
        <div className="min-w-0">
          <div
            className="flex items-center gap-1.5 text-[15.5px] font-extrabold tracking-[-0.01em] text-ink cursor-pointer hover:text-primary-ink"
            onClick={onProfile}
          >
            <span className="truncate">{post.author.name}</span>
            {post.author.verified && (
              <BadgeCheck className="w-[15px] h-[15px] text-primary shrink-0" />
            )}
            <RolePill role={post.author.role} />
          </div>
          <div className="text-[12.5px] text-ink-3 mt-0.5 truncate">
            {[
              post.author.agency || post.author.serviceCategory,
              post.author.location,
            ]
              .filter(Boolean)
              .join(" · ")}
            {(post.author.agency ||
              post.author.serviceCategory ||
              post.author.location) &&
              " · "}
            {timeAgo(post.createdAt)}
          </div>
        </div>
        <button
          onClick={onMore}
          aria-label="Post options"
          className="ml-auto w-[34px] h-[34px] rounded-full grid place-items-center text-ink-3 hover:bg-surface-2 transition-colors shrink-0"
        >
          <MoreHorizontal className="w-[18px] h-[18px]" />
        </button>
      </div>

      {tag && (
        <div
          className={`inline-flex items-center gap-1.5 mt-3.5 text-xs font-extrabold tracking-[0.04em] uppercase ${tag.className}`}
        >
          {post.type === "PROJECT" ? (
            <Building2 className="w-3.5 h-3.5" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          {tag.label}
        </div>
      )}

      <HashBody text={post.body} className="mt-3" />

      {post.project && (
        <div className="mt-3 text-[13px] font-semibold text-ink-2 bg-surface-2 inline-flex items-center gap-2 px-3.5 py-2 rounded-full">
          <Building2 className="w-3.5 h-3.5 text-ink-3" />
          {[post.project.name, post.project.location, post.project.units]
            .filter(Boolean)
            .join(" · ")}
        </div>
      )}

      {post.images.length > 0 && (
        <div
          className={`mt-4 rounded-2xl overflow-hidden grid gap-1 ${
            post.images.length === 1
              ? "grid-cols-1"
              : post.images.length === 2
                ? "grid-cols-2"
                : "grid-cols-[2fr_1fr] grid-rows-2"
          }`}
        >
          {post.images.slice(0, 3).map((src, i) => (
            <div
              key={i}
              className={`relative bg-[#16321f] overflow-hidden ${
                post.images.length === 1
                  ? "h-[340px]"
                  : post.images.length >= 3 && i === 0
                    ? "row-span-2 h-full min-h-[300px]"
                    : "h-[150px] sm:h-[170px]"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              {i === 2 && post.images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 grid place-items-center text-white font-bold text-lg">
                  +{post.images.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {post.insight && (
        <div className="mt-4 border border-line rounded-2xl overflow-hidden">
          <div className="bg-primary-soft px-4.5 py-3.5 flex items-center gap-2.5">
            <TrendingUp className="w-[18px] h-[18px] text-primary" />
            <b className="text-sm font-extrabold text-ink">
              {post.insight.metric}
              {post.insight.period ? ` · ${post.insight.period}` : ""}
            </b>
            {post.insight.delta && (
              <span className="ml-auto text-[13px] font-extrabold text-primary">
                {post.insight.delta}
              </span>
            )}
          </div>
          {post.insight.bars.length > 0 && (
            <div className="px-4.5 py-4 flex items-end gap-1.5 h-[120px]">
              {post.insight.bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[5px] bg-gradient-to-b from-primary to-[#3d8a5e] min-h-[14px]"
                  style={{ height: `${Math.max(10, h)}%` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {post.listing && (
        <a
          href={`/property/${post.listing.id}`}
          className="mt-4 border border-line rounded-2xl overflow-hidden flex hover:border-primary transition-colors"
        >
          <div className="w-[120px] sm:w-[150px] shrink-0 bg-[#16321f]">
            <img
              src={post.listing.coverImage}
              alt={post.listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 sm:px-4.5 flex-1 min-w-0">
            <div className="font-display font-bold text-[21px] tracking-[-0.02em] text-ink">
              {post.listing.priceLabel}
              {post.listing.period && (
                <span className="text-xs text-ink-3 font-heading font-semibold">
                  {" "}
                  {post.listing.period}
                </span>
              )}
            </div>
            <h4 className="text-[15px] font-extrabold text-ink mt-1 truncate">
              {post.listing.title}
            </h4>
            <div className="flex items-center gap-1 text-[12.5px] text-ink-3 mt-0.5 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {post.listing.address}
            </div>
            <div className="flex gap-3.5 mt-2.5 text-[12.5px] text-ink-2 font-semibold">
              {post.listing.beds > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-ink-3" /> {post.listing.beds}
                </span>
              )}
              {post.listing.baths > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-ink-3" />{" "}
                  {post.listing.baths}
                </span>
              )}
              {post.listing.sqft && (
                <span className="inline-flex items-center gap-1">
                  <Maximize className="w-3.5 h-3.5 text-ink-3" />
                  {post.listing.sqft} m²
                </span>
              )}
            </div>
          </div>
        </a>
      )}

      {post.poll && (
        <div className="mt-4 flex flex-col gap-2">
          {post.poll.options.map((opt) => {
            const pct =
              post.poll!.totalVotes > 0
                ? Math.round((opt.votes / post.poll!.totalVotes) * 100)
                : 0;
            const lead =
              post.poll!.totalVotes > 0 &&
              opt.votes === Math.max(...post.poll!.options.map((o) => o.votes));
            const mine = post.viewer.votedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                disabled={pollEnded}
                onClick={() => onVote(opt.id)}
                className={`relative text-left border rounded-xl px-4 py-3 text-sm font-bold text-ink overflow-hidden transition-colors disabled:cursor-default ${
                  lead || mine
                    ? "border-primary"
                    : "border-line hover:border-primary"
                }`}
              >
                <span
                  className="absolute left-0 top-0 bottom-0 bg-primary-soft -z-0 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
                <span className="relative z-10 flex items-center">
                  {opt.text}
                  {mine && <Check className="w-3.5 h-3.5 text-primary ml-1.5" />}
                  <span className="ml-auto text-primary-ink">{pct}%</span>
                </span>
              </button>
            );
          })}
          <div className="text-xs text-ink-3 mt-0.5">
            {post.poll.totalVotes}{" "}
            {post.poll.totalVotes === 1 ? "vote" : "votes"}
            {pollEnded
              ? " · Final results"
              : post.poll.endsAt
                ? ` · Ends ${new Date(post.poll.endsAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}`
                : ""}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-4 pt-3.5 border-t border-line-2">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[13.5px] font-bold transition-colors hover:bg-surface-2 ${
            post.viewer.liked ? "text-primary" : "text-ink-2"
          }`}
        >
          <Heart
            className="w-[18px] h-[18px]"
            fill={post.viewer.liked ? "currentColor" : "none"}
          />
          {post.likesCount > 0 ? post.likesCount : "Like"}
        </button>
        <button
          onClick={onComments}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-[13.5px] font-bold text-ink-2 hover:bg-surface-2 transition-colors"
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          {post.commentsCount > 0 ? post.commentsCount : "Comment"}
        </button>
        <button
          onClick={onSave}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[13.5px] font-bold transition-colors hover:bg-surface-2 ${
            post.viewer.saved ? "text-primary" : "text-ink-2"
          }`}
        >
          <Bookmark
            className="w-[18px] h-[18px]"
            fill={post.viewer.saved ? "currentColor" : "none"}
          />
          {post.viewer.saved ? "Saved" : "Save"}
        </button>
        <button
          onClick={onShare}
          className="ml-auto flex items-center gap-2 px-3.5 py-2 rounded-full text-[13.5px] font-bold text-ink-2 hover:bg-surface-2 transition-colors"
        >
          <Share2 className="w-[18px] h-[18px]" />
          Share
        </button>
      </div>
    </article>
  );
};

/* ── composer modal ──────────────────────────────────────────────────── */

const COMPOSER_TYPES = ["Photos", "Insight", "Project", "Listing", "Poll"];

export const ComposerModal = ({
  initialType,
  userName,
  userRole,
  userAvatar,
  isAgent,
  onClose,
  onPosted,
  onError,
}: {
  initialType: string;
  userName: string;
  userRole: string;
  userAvatar: string | null;
  isAgent: boolean;
  onClose: () => void;
  onPosted: (post: FeedPost) => void;
  onError: (msg: string) => void;
}) => {
  const [type, setType] = useState(initialType);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [insightMetric, setInsightMetric] = useState("");
  const [insightPeriod, setInsightPeriod] = useState("");
  const [insightDelta, setInsightDelta] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectUnits, setProjectUnits] = useState("");

  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [listingId, setListingId] = useState<string | null>(null);

  useEffect(() => {
    if (type === "Listing" && isAgent && myListings.length === 0) {
      listingsService
        .listMine({ limit: 20 })
        .then((res) => {
          setMyListings(res.items);
          if (res.items[0]) setListingId(res.items[0].id);
        })
        .catch(() => onError("Couldn't load your listings"));
    }
  }, [type, isAgent, myListings.length, onError]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const remaining = 4 - images.length;
      const uploads = [...files]
        .slice(0, remaining)
        .map((f) => feedService.uploadImage(f));
      const results = await Promise.all(uploads);
      setImages((prev) => [...prev, ...results.map((r) => r.url)]);
    } catch {
      onError("Image upload failed");
    }
    setUploading(false);
  };

  const submit = async () => {
    if (!body.trim()) {
      onError("Write something first");
      return;
    }
    const payload: CreateFeedPostPayload = { body: body.trim() };

    if (type === "Photos") {
      payload.type = "UPDATE";
      payload.images = images;
    } else if (type === "Insight") {
      payload.type = "INSIGHT";
      if (insightMetric.trim()) {
        payload.insightMetric = insightMetric.trim();
        payload.insightPeriod = insightPeriod.trim() || undefined;
        payload.insightDelta = insightDelta.trim() || undefined;
        payload.insightBars = [34, 46, 58, 72, 88, 100];
      }
    } else if (type === "Project") {
      payload.type = "PROJECT";
      payload.images = images;
      if (projectName.trim()) {
        payload.projectName = projectName.trim();
        payload.projectLocation = projectLocation.trim() || undefined;
        payload.projectUnits = projectUnits.trim() || undefined;
      }
    } else if (type === "Listing") {
      payload.type = "LISTING";
      if (!listingId) {
        onError("Pick a listing to attach");
        return;
      }
      payload.listingId = listingId;
    } else if (type === "Poll") {
      payload.type = "POLL";
      const opts = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (opts.length < 2) {
        onError("A poll needs at least 2 options");
        return;
      }
      payload.pollOptions = opts;
    }

    setPosting(true);
    try {
      const post = await feedService.create(payload);
      onPosted(post);
    } catch (err: any) {
      onError(err?.response?.data?.message || "Couldn't publish your post");
    }
    setPosting(false);
  };

  const fieldCls =
    "flex-1 border border-line rounded-[10px] px-3.5 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-3 focus:outline-none focus:border-primary bg-white min-w-0";

  return (
    <div
      className="fixed inset-0 bg-[rgba(20,18,14,0.5)] backdrop-blur-sm z-[100] flex items-start justify-center px-5 py-10 overflow-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-[600px] shadow-[0_40px_90px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="flex items-center justify-between px-5.5 py-4 border-b border-line-2">
          <h3 className="text-lg font-extrabold text-ink">Create a post</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 grid place-items-center text-ink-2 hover:bg-line-2 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="px-5.5 py-5 max-h-[65vh] overflow-auto">
          <div className="flex items-center gap-3 mb-3.5">
            <Avatar author={{ name: userName, avatarUrl: userAvatar }} size={46} />
            <div>
              <b className="text-[15px] font-extrabold text-ink">{userName}</b>
              <div className="inline-flex items-center gap-1.5 text-xs text-ink-3 font-semibold bg-surface-2 px-2.5 py-1 rounded-full mt-1 w-fit">
                <BadgeCheck className="w-3 h-3" />
                {ROLE_LABEL[userRole] || userRole} · Public
              </div>
            </div>
          </div>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share an update, market insight, completed project, or property tip…"
            className="w-full min-h-[110px] resize-none text-[17px] leading-normal text-ink placeholder:text-ink-3 focus:outline-none bg-transparent"
          />

          <div className="flex gap-2 flex-wrap mt-2 mb-4">
            {COMPOSER_TYPES.filter((t) => t !== "Listing" || isAgent).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold border transition-colors ${
                  type === t
                    ? "bg-primary-soft border-primary text-primary-ink"
                    : "bg-white border-line text-ink-2 hover:border-primary"
                }`}
              >
                {t === "Photos" && <ImageIcon className="w-[15px] h-[15px]" />}
                {t === "Insight" && <TrendingUp className="w-[15px] h-[15px]" />}
                {t === "Project" && <Building2 className="w-[15px] h-[15px]" />}
                {t === "Listing" && <Home className="w-[15px] h-[15px]" />}
                {t === "Poll" && <BarChart3 className="w-[15px] h-[15px]" />}
                {t}
              </button>
            ))}
          </div>

          {(type === "Photos" || type === "Project") && (
            <div>
              {type === "Project" && (
                <div className="border border-line rounded-[14px] p-4 mb-3">
                  <div className="text-xs font-extrabold tracking-[0.05em] uppercase text-ink-3 mb-2.5">
                    Showcase a completed project
                  </div>
                  <div className="flex gap-2.5 mb-2.5">
                    <input
                      className={fieldCls}
                      placeholder="Project name · e.g. The Quay Residences"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2.5">
                    <input
                      className={fieldCls}
                      placeholder="Location · e.g. Ikoyi"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                    />
                    <input
                      className={fieldCls}
                      placeholder="Units · e.g. 18 · Sold out"
                      value={projectUnits}
                      onChange={(e) => setProjectUnits(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative h-20 rounded-xl overflow-hidden bg-surface-2"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() =>
                          setImages((prev) => prev.filter((_, x) => x !== i))
                        }
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white grid place-items-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 4 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-[1.5px] border-dashed border-line rounded-2xl p-7 text-center text-ink-3 hover:border-primary transition-colors disabled:opacity-60"
                >
                  <Camera className="w-7 h-7 mx-auto mb-2" />
                  {uploading
                    ? "Uploading…"
                    : type === "Project"
                      ? "Add before / after photos"
                      : "Click to upload photos (up to 4)"}
                </button>
              )}
            </div>
          )}

          {type === "Insight" && (
            <div className="border border-line rounded-[14px] p-4">
              <div className="text-xs font-extrabold tracking-[0.05em] uppercase text-ink-3 mb-2.5">
                Add a market insight
              </div>
              <div className="flex gap-2.5 mb-2.5">
                <input
                  className={fieldCls}
                  placeholder="Metric · e.g. Avg ₦/m² in Lekki"
                  value={insightMetric}
                  onChange={(e) => setInsightMetric(e.target.value)}
                />
              </div>
              <div className="flex gap-2.5 mb-3">
                <input
                  className={fieldCls}
                  placeholder="Period · e.g. 6 months"
                  value={insightPeriod}
                  onChange={(e) => setInsightPeriod(e.target.value)}
                />
                <input
                  className={fieldCls}
                  placeholder="Change · e.g. ▲ 18%"
                  value={insightDelta}
                  onChange={(e) => setInsightDelta(e.target.value)}
                />
              </div>
              {insightMetric.trim() && (
                <div className="border border-line rounded-2xl overflow-hidden">
                  <div className="bg-primary-soft px-4 py-3 flex items-center gap-2.5">
                    <TrendingUp className="w-[18px] h-[18px] text-primary" />
                    <b className="text-sm font-extrabold text-ink truncate">
                      {insightMetric}
                      {insightPeriod ? ` · ${insightPeriod}` : ""}
                    </b>
                    {insightDelta && (
                      <span className="ml-auto text-[13px] font-extrabold text-primary shrink-0">
                        {insightDelta}
                      </span>
                    )}
                  </div>
                  <div className="px-4 py-3.5 flex items-end gap-1.5 h-[100px]">
                    {[34, 46, 58, 72, 88, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-[5px] bg-gradient-to-b from-primary to-[#3d8a5e]"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {type === "Listing" && (
            <div className="border border-line rounded-[14px] p-4">
              <div className="text-xs font-extrabold tracking-[0.05em] uppercase text-ink-3 mb-2.5">
                Attach one of your listings
              </div>
              {myListings.length === 0 ? (
                <p className="text-sm text-ink-3 py-2">
                  No listings yet — publish one first from your dashboard.
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-h-[220px] overflow-auto">
                  {myListings.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setListingId(l.id)}
                      className={`flex gap-3 border rounded-[14px] p-2.5 text-left transition-colors ${
                        listingId === l.id
                          ? "border-primary bg-primary-soft/40"
                          : "border-line hover:border-primary"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-[10px] overflow-hidden bg-surface-2 shrink-0">
                        <img
                          src={l.coverImage}
                          alt={l.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-base text-ink">
                          {l.priceLabel}
                        </div>
                        <div className="text-[13px] font-bold text-ink truncate">
                          {l.title}
                        </div>
                        <div className="text-xs text-ink-3 truncate">
                          {l.location} · {l.beds} bd · {l.baths} ba
                        </div>
                      </div>
                      {listingId === l.id && (
                        <Check className="w-4 h-4 text-primary ml-auto shrink-0 mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {type === "Poll" && (
            <div className="border border-line rounded-[14px] p-4">
              <div className="text-xs font-extrabold tracking-[0.05em] uppercase text-ink-3 mb-2.5">
                Create a poll
              </div>
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2.5 mb-2.5">
                  <input
                    className={fieldCls}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) =>
                      setPollOptions((prev) =>
                        prev.map((o, x) => (x === i ? e.target.value : o)),
                      )
                    }
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() =>
                        setPollOptions((prev) => prev.filter((_, x) => x !== i))
                      }
                      className="text-ink-3 hover:text-ink"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 6 && (
                <button
                  onClick={() => setPollOptions((prev) => [...prev, ""])}
                  className="text-primary font-bold text-[13.5px] inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add option
                </button>
              )}
              <div className="text-[12.5px] text-ink-3 mt-2">
                Poll runs for 3 days
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-5.5 py-4 border-t border-line-2">
          <span className="text-xs text-ink-3">
            Visible to everyone on PropertyLoop
          </span>
          <button
            onClick={submit}
            disabled={posting || uploading}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold text-[15px] hover:bg-primary-light transition-colors disabled:opacity-60"
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── comments drawer ─────────────────────────────────────────────────── */

const CommentsDrawer = ({
  post,
  canComment,
  onNeedAuth,
  onClose,
  onCountChange,
  onProfile,
}: {
  post: FeedPost;
  canComment: boolean;
  onNeedAuth: () => void;
  onClose: () => void;
  onCountChange: (n: number) => void;
  onProfile: (a: FeedAuthor) => void;
}) => {
  const [comments, setComments] = useState<FeedComment[] | null>(null);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<FeedComment | null>(null);
  const [sending, setSending] = useState(false);

  const total = comments
    ? comments.reduce((a, c) => a + 1 + (c.replies?.length ?? 0), 0)
    : post.commentsCount;

  useEffect(() => {
    feedService
      .comments(post.id)
      .then(setComments)
      .catch(() => setComments([]));
  }, [post.id]);

  const send = async () => {
    if (!canComment) {
      onNeedAuth();
      return;
    }
    if (!draft.trim() || sending) return;
    setSending(true);
    try {
      const c = await feedService.addComment(post.id, draft.trim(), replyTo?.id);
      setComments((prev) => {
        if (!prev) return prev;
        if (c.parentId) {
          return prev.map((top) =>
            top.id === c.parentId
              ? { ...top, replies: [...(top.replies ?? []), c] }
              : top,
          );
        }
        return [...prev, { ...c, replies: [] }];
      });
      onCountChange(total + 1);
      setDraft("");
      setReplyTo(null);
    } catch {
      /* keep draft */
    }
    setSending(false);
  };

  const CommentRow = ({ c, reply }: { c: FeedComment; reply?: boolean }) => (
    <div className={`flex gap-2.5 mb-4 ${reply ? "ml-12" : ""}`}>
      <Avatar author={c.author} size={38} onClick={() => onProfile(c.author)} />
      <div className="min-w-0 flex-1">
        <div className="bg-surface-2 rounded-[6px_16px_16px_16px] px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-ink">
            {c.author.name}
            {c.author.verified && <BadgeCheck className="w-3 h-3 text-primary" />}
            <RolePill role={c.author.role} />
          </div>
          <div className="text-sm leading-normal text-ink mt-0.5 break-words">
            {c.body}
          </div>
        </div>
        <div className="flex gap-4 mt-1.5 pl-1 text-xs font-bold text-ink-3">
          {!reply && (
            <button className="hover:text-primary" onClick={() => setReplyTo(c)}>
              Reply
            </button>
          )}
          <span>{timeAgo(c.createdAt)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-[rgba(20,18,14,0.5)] backdrop-blur-sm z-[100] flex justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-[480px] h-full flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between px-5.5 py-4 border-b border-line-2 shrink-0">
          <h3 className="text-[17px] font-extrabold text-ink">
            Comments · {total}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 grid place-items-center text-ink-2 hover:bg-line-2 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-5.5 py-4">
          <div className="pb-4 border-b border-line-2 mb-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              <Avatar author={post.author} size={40} />
              <div>
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-ink">
                  {post.author.name}
                  {post.author.verified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <div className="text-xs text-ink-3">
                  {ROLE_LABEL[post.author.role]} · {timeAgo(post.createdAt)}
                </div>
              </div>
            </div>
            <HashBody text={post.body} className="text-[14.5px]" />
          </div>

          {comments === null ? (
            <div className="py-8">
              <BouncyLoader />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-ink-3 text-center py-8">
              No comments yet — start the conversation.
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id}>
                <CommentRow c={c} />
                {c.replies?.map((r) => <CommentRow key={r.id} c={r} reply />)}
              </div>
            ))
          )}
        </div>

        <div className="shrink-0 border-t border-line-2 px-4.5 py-3.5">
          {replyTo && (
            <div className="flex items-center gap-2 text-xs text-ink-3 mb-2 px-1">
              Replying to <b className="text-ink">{replyTo.author.name}</b>
              <button onClick={() => setReplyTo(null)} className="hover:text-ink">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={canComment ? "Add a comment…" : "Log in to comment"}
              className="flex-1 bg-surface-2 rounded-full px-4.5 py-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none min-w-0"
            />
            <button
              onClick={send}
              disabled={sending}
              className="w-11 h-11 rounded-full bg-primary text-white grid place-items-center shrink-0 hover:bg-primary-light transition-colors disabled:opacity-60"
            >
              <Send className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── share sheet ─────────────────────────────────────────────────────── */

const ShareSheet = ({
  post,
  onClose,
  onCopy,
}: {
  post: FeedPost;
  onClose: () => void;
  onCopy: () => void;
}) => {
  const url = `${window.location.origin}/feed?post=${post.id}`;
  const text = encodeURIComponent(
    `${post.body.slice(0, 120)}${post.body.length > 120 ? "…" : ""} — via PropertyLoop`,
  );
  const targets = [
    {
      label: "WhatsApp",
      bg: "bg-[#25D366]",
      href: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      icon: <MessageCircle className="w-[22px] h-[22px]" />,
    },
    {
      label: "X",
      bg: "bg-[#111]",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      icon: <X className="w-5 h-5" />,
    },
    {
      label: "LinkedIn",
      bg: "bg-[#0A66C2]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: <Share2 className="w-5 h-5" />,
    },
    {
      label: "Email",
      bg: "bg-accent",
      href: `mailto:?subject=${encodeURIComponent("Seen this on PropertyLoop?")}&body=${text}%0A%0A${encodeURIComponent(url)}`,
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-[rgba(20,18,14,0.5)] backdrop-blur-sm z-[100] grid place-items-center px-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[22px] w-full max-w-[440px] shadow-[0_40px_90px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="flex items-center justify-between px-5.5 py-4 border-b border-line-2">
          <h3 className="text-[17px] font-extrabold text-ink">
            Share this post
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 grid place-items-center text-ink-2 hover:bg-line-2 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 px-5.5 py-5">
          {targets.map((t) => (
            <a
              key={t.label}
              href={t.href}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex flex-col items-center gap-2 py-3 px-1 rounded-[14px] text-xs font-semibold text-ink-2 hover:bg-surface-2 transition-colors"
            >
              <span
                className={`w-[50px] h-[50px] rounded-full grid place-items-center text-white ${t.bg}`}
              >
                {t.icon}
              </span>
              {t.label}
            </a>
          ))}
        </div>
        <div className="mx-5.5 mb-5.5 flex items-center gap-2.5 border border-line rounded-full p-2 pl-4">
          <span className="flex-1 text-[13px] text-ink-3 truncate">{url}</span>
          <button
            onClick={onCopy}
            className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-[13.5px] hover:bg-primary-light transition-colors shrink-0"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── 3-dot menu ──────────────────────────────────────────────────────── */

const PostMenu = ({
  post,
  x,
  y,
  onClose,
  onSave,
  onCopy,
  onReport,
  onDelete,
}: {
  post: FeedPost;
  x: number;
  y: number;
  onClose: () => void;
  onSave: () => void;
  onCopy: () => void;
  onReport: () => void;
  onDelete: () => void;
}) => (
  <div className="fixed inset-0 z-[120]" onClick={onClose}>
    <div
      className="absolute bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.22)] w-[248px] p-2"
      style={{ top: y, left: Math.max(10, x) }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onSave}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-sm font-semibold text-ink hover:bg-surface-2 transition-colors text-left"
      >
        <Bookmark className="w-[18px] h-[18px] text-ink-3" />
        {post.viewer.saved ? "Remove from saved" : "Save post"}
      </button>
      <button
        onClick={onCopy}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-sm font-semibold text-ink hover:bg-surface-2 transition-colors text-left"
      >
        <Link2 className="w-[18px] h-[18px] text-ink-3" />
        Copy link
      </button>
      <div className="h-px bg-line-2 my-1.5 mx-1" />
      {post.viewer.isAuthor ? (
        <button
          onClick={onDelete}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-sm font-semibold text-[#c0492b] hover:bg-surface-2 transition-colors text-left"
        >
          <Trash2 className="w-[18px] h-[18px]" />
          Delete post
        </button>
      ) : (
        <button
          onClick={onReport}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-sm font-semibold text-[#c0492b] hover:bg-surface-2 transition-colors text-left"
        >
          <Flag className="w-[18px] h-[18px]" />
          Report post
        </button>
      )}
    </div>
  </div>
);

/** Convenience: render a PostCard fully wired to a useFeedInteractions bag. */
export const ConnectedPost = ({
  post,
  feed,
}: {
  post: FeedPost;
  feed: ReturnType<typeof useFeedInteractions>;
}) => (
  <PostCard
    post={post}
    onLike={() => feed.handleLike(post)}
    onSave={() => feed.handleSave(post)}
    onShare={() => feed.setSharePost(post)}
    onComments={() => feed.setCommentsPost(post)}
    onVote={(optId) => feed.handleVote(post, optId)}
    onProfile={() => feed.openProfile(post.author)}
    onMore={(e) => feed.openMore(post, e)}
  />
);

export type FeedInteractions = ReturnType<typeof useFeedInteractions>;
export type { ReactNode };

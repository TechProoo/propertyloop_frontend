// Shared source of truth for the agent dashboard's notifications. Both the
// bell dropdown (Overview header) and the dedicated Notifications page derive
// their items from here so the two never drift apart.
//
// Every notification is built from real account state (profile completeness,
// verification, leads, viewings, listings) — nothing here is fabricated. The
// "Finish your profile" nudge always leads the list while the profile is bare.
import { useState } from "react";
import type { ReactNode } from "react";
import {
  UserCircle2,
  ShieldCheck,
  Home,
  Users,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import type { AgentStats } from "../../api/types";

export type AgentNotification = {
  id: string;
  icon: ReactNode;
  title: string;
  desc: string;
  to: string;
  tone: "action" | "info";
};

type AgentProfileLike = {
  verified?: boolean | null;
  agencyName?: string | null;
} | null;

type UserLike =
  | {
      avatarUrl?: string | null;
      bio?: string | null;
      agentProfile?: AgentProfileLike;
    }
  | null
  | undefined;

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/** Derive the agent's notification list from auth + stats data. */
export function buildAgentNotifications(
  user: UserLike,
  stats: AgentStats | null,
): AgentNotification[] {
  const list: AgentNotification[] = [];
  const ap = user?.agentProfile ?? null;

  // 1. Profile completion — always leads the list while incomplete.
  if (!user?.avatarUrl || !ap?.agencyName || !user?.bio) {
    list.push({
      id: "finish-profile",
      icon: <UserCircle2 className="w-[18px] h-[18px]" />,
      title: "Finish your profile",
      desc: "Add your photo, agency and bio so buyers can trust you.",
      to: "/agent-dashboard/settings",
      tone: "action",
    });
  }

  // 2. Verification badge.
  if (!ap?.verified) {
    list.push({
      id: "get-verified",
      icon: <ShieldCheck className="w-[18px] h-[18px]" />,
      title: "Get verified",
      desc: "Complete KYC to earn your verified agent badge.",
      to: "/agent-dashboard/settings",
      tone: "action",
    });
  }

  // 3. New leads waiting.
  if ((stats?.leads.new ?? 0) > 0) {
    const n = stats!.leads.new;
    list.push({
      id: `new-leads-${n}`,
      icon: <Users className="w-[18px] h-[18px]" />,
      title: `${plural(n, "new lead", "new leads")} waiting`,
      desc: "Follow up quickly — fresh leads convert best.",
      to: "/agent-dashboard/messages",
      tone: "info",
    });
  }

  // 4. Upcoming viewings.
  if ((stats?.viewings.upcoming ?? 0) > 0) {
    const n = stats!.viewings.upcoming;
    list.push({
      id: `upcoming-viewings-${n}`,
      icon: <CalendarDays className="w-[18px] h-[18px]" />,
      title: `${plural(n, "upcoming viewing", "upcoming viewings")}`,
      desc: "Review your schedule and confirm attendance.",
      to: "/agent-dashboard/viewings",
      tone: "info",
    });
  }

  // 5. Listings still in review.
  if ((stats?.listings.pendingReview ?? 0) > 0) {
    const n = stats!.listings.pendingReview;
    list.push({
      id: `pending-review-${n}`,
      icon: <ClipboardCheck className="w-[18px] h-[18px]" />,
      title: `${plural(n, "listing", "listings")} pending review`,
      desc: "We'll notify buyers as soon as they're approved.",
      to: "/agent-dashboard/listings",
      tone: "info",
    });
  }

  // 6. First listing nudge (only before any listing exists).
  if ((stats?.listings.total ?? 0) === 0) {
    list.push({
      id: "first-listing",
      icon: <Home className="w-[18px] h-[18px]" />,
      title: "Publish your first listing",
      desc: "Add a property to start receiving enquiries.",
      to: "/add-property",
      tone: "action",
    });
  }

  // 7. Evergreen welcome / explore.
  list.push({
    id: "welcome",
    icon: <Sparkles className="w-[18px] h-[18px]" />,
    title: "Welcome to PropertyLoop",
    desc: "Explore your analytics to see how your listings perform.",
    to: "/agent-dashboard/analytics",
    tone: "info",
  });

  return list;
}

// ─── Read-state, persisted per browser ─────────────────────────────────────
const READ_KEY = "agent_notif_read";

function loadReads(): string[] {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Tracks which notifications have been read; persists to localStorage. */
export function useNotifReads() {
  const [reads, setReads] = useState<string[]>(loadReads);

  const persist = (ids: string[]) => {
    setReads(ids);
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  };

  const isUnread = (id: string) => !reads.includes(id);

  const markRead = (id: string) => {
    if (reads.includes(id)) return;
    persist([...reads, id]);
  };

  const markAllRead = (ids: string[]) => {
    persist(Array.from(new Set([...reads, ...ids])));
  };

  const unreadCount = (notifications: AgentNotification[]) =>
    notifications.filter((n) => !reads.includes(n.id)).length;

  return { reads, isUnread, markRead, markAllRead, unreadCount };
}

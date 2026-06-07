// Dedicated agent notifications page — the full list behind the bell
// dropdown's "View all". Shares its data + read-state with the dropdown via
// agentNotifications so the two stay in sync.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCheck, BellOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import agentsService from "../../api/services/agents";
import type { AgentStats } from "../../api/types";
import {
  C,
  PageHeader,
  GhostButton,
  BouncyLoader,
  EmptyState,
} from "../../components/agent/ui";
import {
  buildAgentNotifications,
  useNotifReads,
} from "./agentNotifications";

export default function AgentNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    agentsService
      .getStats()
      .then((s) => active && setStats(s))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const notifications = buildAgentNotifications(user, stats);
  const { isUnread, markRead, markAllRead, unreadCount } = useNotifReads();
  const unread = unreadCount(notifications);

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={
          unread > 0
            ? `You have ${unread} unread notification${unread === 1 ? "" : "s"}.`
            : "You're all caught up."
        }
        actions={
          unread > 0 ? (
            <GhostButton onClick={() => markAllRead(notifications.map((n) => n.id))}>
              <CheckCheck className="w-[17px] h-[17px]" /> Mark all read
            </GhostButton>
          ) : undefined
        }
      />

      <div className="mt-[22px]">
        {loading ? (
          <div className="py-20">
            <BouncyLoader />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<BellOff className="w-6 h-6" />}
            title="No notifications"
            body="You're all caught up — new activity will show up here."
          />
        ) : (
          <div
            className="rounded-[20px] border overflow-hidden"
            style={{ background: C.card, borderColor: C.line }}
          >
            {notifications.map((n, i) => {
              const fresh = isUnread(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    markRead(n.id);
                    navigate(n.to);
                  }}
                  className="w-full flex items-start gap-3.5 px-5 py-4 text-left transition-colors"
                  style={{
                    borderTop: i === 0 ? "none" : `1px solid ${C.line2}`,
                    background: fresh ? C.primarySoft : "transparent",
                  }}
                >
                  <span
                    className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                    style={{
                      background: n.tone === "action" ? C.primarySoft : C.surface2,
                      color: n.tone === "action" ? C.primary : C.ink2,
                    }}
                  >
                    {n.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <b className="text-sm font-bold" style={{ color: C.ink }}>
                        {n.title}
                      </b>
                      {fresh && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: C.primary }}
                        />
                      )}
                    </div>
                    <span
                      className="block text-[12.5px] mt-0.5 leading-snug"
                      style={{ color: C.ink2 }}
                    >
                      {n.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Shared presentational primitives + tokens for the redesigned agent
// dashboard. Colours mirror the Claude Design bundle (emerald #1f6f43 +
// warm cream) so the multi-page dashboard stays visually consistent
// without touching the global theme.
import type { ReactNode } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const C = {
  primary: "#1f6f43",
  primaryPress: "#175534",
  primarySoft: "#e3efe7",
  primaryInk: "#134a2d",
  accent: "#b9842c",
  accentSoft: "#f5ead4",
  accentInk: "#7a5418",
  surface: "#f6f4ef",
  surface2: "#ece6df",
  surface3: "#ddd5c9",
  card: "#ffffff",
  ink: "#1a2120",
  ink2: "#4d524f",
  ink3: "#7f857f",
  line: "#e1dcd3",
  line2: "#ece6df",
  danger: "#b4632a",
};

/** ₦ formatter — whole naira with thousands separators. */
// eslint-disable-next-line react-refresh/only-export-components
export function naira(n?: number | null): string {
  if (n == null || Number.isNaN(n)) return "₦0";
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

// eslint-disable-next-line react-refresh/only-export-components
export function initials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[20px] border p-5 ${className}`}
      style={{ background: C.card, borderColor: C.line, ...style }}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-5 flex-wrap">
      <div>
        <h1
          className="m-0 font-heading font-extrabold tracking-tight"
          style={{ fontSize: 30, color: C.ink, letterSpacing: "-0.025em" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 mb-0 text-sm" style={{ color: C.ink2 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60 ${className}`}
      style={{ background: C.primary }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = C.primaryPress)}
      onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = "",
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 px-3.5 h-9 rounded-full text-[12.5px] font-bold transition-colors ${className}`}
      style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink, ...style }}
    >
      {children}
    </button>
  );
}

/** A 4-up stat tile. `hero` paints the emerald gradient variant. */
export function StatCard({
  icon,
  value,
  label,
  delta,
  deltaTone = "up",
  hero = false,
  iconBg,
  iconColor,
}: {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
  delta?: ReactNode;
  deltaTone?: "up" | "flat" | "down";
  hero?: boolean;
  iconBg?: string;
  iconColor?: string;
}) {
  const deltaColor = hero
    ? "#9fe3bb"
    : deltaTone === "up"
      ? C.primary
      : deltaTone === "down"
        ? C.danger
        : C.ink3;
  return (
    <div
      className="rounded-[18px] p-[18px]"
      style={
        hero
          ? { background: "linear-gradient(150deg,#1f6f43,#14512f)", color: "#fff" }
          : { background: C.card, border: `1px solid ${C.line}` }
      }
    >
      {icon && (
        <div
          className="w-[38px] h-[38px] rounded-[11px] grid place-items-center"
          style={{
            background: hero ? "rgba(255,255,255,0.16)" : (iconBg ?? C.primarySoft),
            color: hero ? "#fff" : (iconColor ?? C.primary),
          }}
        >
          {icon}
        </div>
      )}
      <div
        className="font-heading font-extrabold mt-3.5"
        style={{ fontSize: 30, letterSpacing: "-0.03em", color: hero ? "#fff" : C.ink }}
      >
        {value}
      </div>
      <div
        className="text-[13px] font-semibold mt-0.5"
        style={{ color: hero ? "rgba(255,255,255,0.75)" : C.ink2 }}
      >
        {label}
      </div>
      {delta != null && (
        <div className="text-xs font-bold mt-2 inline-flex items-center gap-1" style={{ color: deltaColor }}>
          {delta}
        </div>
      )}
    </div>
  );
}

/** Coloured status pill text for listings/viewings. */
// eslint-disable-next-line react-refresh/only-export-components
export function statusMeta(status: string): { label: string; color: string; dot: boolean } {
  switch (status) {
    case "ACTIVE":
    case "CONFIRMED":
      return { label: status === "ACTIVE" ? "Active" : "Confirmed", color: C.primary, dot: true };
    case "PENDING_REVIEW":
      return { label: "Pending review", color: C.danger, dot: true };
    case "PENDING":
      return { label: "Pending", color: C.danger, dot: true };
    case "PAUSED":
      return { label: "Paused", color: C.ink3, dot: true };
    case "SOLD":
      return { label: "Sold", color: C.ink3, dot: true };
    case "RENTED":
      return { label: "Rented", color: C.ink3, dot: true };
    case "ARCHIVED":
      return { label: "Archived", color: C.ink3, dot: true };
    case "COMPLETED":
      return { label: "Completed", color: C.ink3, dot: true };
    case "CANCELLED":
      return { label: "Cancelled", color: C.danger, dot: true };
    case "NO_SHOW":
      return { label: "No-show", color: C.danger, dot: true };
    default:
      return { label: status, color: C.ink3, dot: true };
  }
}

export function StatusPill({ status }: { status: string }) {
  const m = statusMeta(status);
  return (
    <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: m.color }}>
      {m.dot && "● "}
      {m.label}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ border: `1.5px dashed ${C.line}` }}
    >
      <div
        className="w-[54px] h-[54px] rounded-[15px] grid place-items-center mx-auto mb-3"
        style={{ background: C.primarySoft, color: C.primary }}
      >
        {icon}
      </div>
      <b className="text-[15px] font-extrabold" style={{ color: C.ink }}>
        {title}
      </b>
      {body && (
        <p className="mt-1 mb-3.5 text-[13px]" style={{ color: C.ink2 }}>
          {body}
        </p>
      )}
      {action}
    </div>
  );
}

import { useState } from "react";
import { User } from "lucide-react";

/**
 * Avatar for a conversation participant.
 *
 * If `src` resolves to a real image, that image is shown.
 * Otherwise we render a coloured circle with the participant's first
 * initial. The colour is picked deterministically from the name's
 * char codes so the same person always gets the same colour.
 */
const PALETTE = [
  { bg: "bg-emerald-500", text: "text-white" },
  { bg: "bg-blue-500", text: "text-white" },
  { bg: "bg-violet-500", text: "text-white" },
  { bg: "bg-fuchsia-500", text: "text-white" },
  { bg: "bg-rose-500", text: "text-white" },
  { bg: "bg-orange-500", text: "text-white" },
  { bg: "bg-amber-500", text: "text-white" },
  { bg: "bg-teal-500", text: "text-white" },
  { bg: "bg-cyan-500", text: "text-white" },
  { bg: "bg-indigo-500", text: "text-white" },
  { bg: "bg-pink-500", text: "text-white" },
  { bg: "bg-lime-600", text: "text-white" },
];

const colourFor = (name: string) => {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

interface Props {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "w-9 h-9 text-sm",
  md: "w-11 h-11 text-base",
  lg: "w-14 h-14 text-lg",
} as const;

const ConversationAvatar = ({
  name,
  src,
  size = "md",
  className = "",
}: Props) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = !!src && !imgFailed;
  const initial = (name?.trim()?.[0] || "?").toUpperCase();
  const palette = colourFor(name || "?");
  const sizeCls = SIZE_MAP[size];

  if (showImage) {
    return (
      <img
        src={src!}
        alt={name}
        onError={() => setImgFailed(true)}
        className={`${sizeCls} rounded-full object-cover border-2 border-white shadow-sm shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeCls} rounded-full flex items-center justify-center border-2 border-white shadow-sm shrink-0 font-heading font-bold ${palette.bg} ${palette.text} ${className}`}
      aria-label={name}
      title={name}
    >
      {initial !== "?" ? (
        initial
      ) : (
        <User className="w-1/2 h-1/2 opacity-80" />
      )}
    </div>
  );
};

export default ConversationAvatar;

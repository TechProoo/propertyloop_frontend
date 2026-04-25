/**
 * Skeleton placeholder for the chat panel (messages area).
 * Renders a few alternating you/them bubbles in a pulsing animation
 * so the user has a sense of the layout before real data arrives.
 */
const MessagesSkeleton = ({ count = 6 }: { count?: number }) => {
  // Pseudo-random pattern of widths and sides so the skeleton doesn't
  // look mechanical, but stable across renders (no Math.random).
  const widths = ["55%", "70%", "40%", "60%", "75%", "45%", "65%", "50%"];
  const sides = [
    "them", "you", "them", "them", "you", "them", "you", "them",
  ] as const;

  return (
    <div className="flex flex-col gap-3 p-5">
      {Array.from({ length: count }).map((_, i) => {
        const isYou = sides[i % sides.length] === "you";
        const width = widths[i % widths.length];
        return (
          <div
            key={i}
            className={`flex ${isYou ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl animate-pulse ${
                isYou
                  ? "bg-primary/30 rounded-br-md"
                  : "bg-border-light/70 rounded-bl-md"
              }`}
              style={{ width }}
            >
              <div
                className={`h-2 rounded-full ${
                  isYou ? "bg-primary/40" : "bg-border-light"
                }`}
              />
              <div
                className={`h-2 rounded-full mt-2 w-3/4 ${
                  isYou ? "bg-primary/40" : "bg-border-light"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Skeleton for the conversation list rail.
 */
export const ConversationsSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="flex flex-col">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex items-start gap-3 px-4 py-3.5 border-b border-border-light/40 animate-pulse"
      >
        <div className="w-11 h-11 rounded-full bg-border-light/60 shrink-0" />
        <div className="flex-1 min-w-0 space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2">
            <div className="h-3 bg-border-light/60 rounded-full w-1/2" />
            <div className="h-2 bg-border-light/60 rounded-full w-8" />
          </div>
          <div className="h-2.5 bg-border-light/60 rounded-full w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

export default MessagesSkeleton;

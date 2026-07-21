import { FileText } from "lucide-react";

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i.test(url);
}

/**
 * Renders a message's attachments - images inline (tap to open full size),
 * other files as a labelled download chip. Themed by sender so it reads on
 * both the emerald "you" bubble and the light "them" bubble.
 */
export default function MessageAttachments({
  urls,
  isYou,
}: {
  urls: string[];
  isYou: boolean;
}) {
  if (!urls?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {urls.map((url, i) =>
        isImageUrl(url) ? (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
            <img
              src={url}
              alt="attachment"
              className="max-w-[180px] max-h-[180px] rounded-xl object-cover border border-black/10 hover:opacity-90 transition-opacity"
            />
          </a>
        ) : (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isYou
                ? "bg-white/20 border-white/30 text-white hover:bg-white/30"
                : "bg-black/[0.04] border-black/10 text-primary-dark hover:bg-black/[0.07]"
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[120px]">
              {url.split("/").pop()?.split("?")[0] || "Attachment"}
            </span>
          </a>
        ),
      )}
    </div>
  );
}

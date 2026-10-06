/**
 * Share a page via the Web Share API (mobile) or copy-to-clipboard (desktop).
 * Returns "shared" | "copied" | "failed".
 */
export async function sharePage(opts: {
  title: string;
  text?: string;
  url?: string;
}): Promise<"shared" | "copied" | "failed"> {
  const shareUrl = opts.url ?? window.location.href;

  // Prefer native share sheet on mobile / supported browsers
  if (navigator.share) {
    try {
      await navigator.share({ title: opts.title, text: opts.text, url: shareUrl });
      return "shared";
    } catch {
      // User cancelled or API threw — fall through to clipboard
    }
  }

  // Fallback: copy link to clipboard
  try {
    await navigator.clipboard.writeText(shareUrl);
    return "copied";
  } catch {
    return "failed";
  }
}

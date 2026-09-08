/**
 * Requests a rendered width from the media proxy.
 *
 * Listing photos are stored at whatever the agent's phone produced — commonly
 * 2268x4032 at 1-2.6MB — and the proxy used to serve that untouched for every
 * card in a grid. Asking for the width actually rendered takes a card image
 * from roughly 740KB to 67KB.
 *
 * Only URLs pointing at our own proxy are touched; anything else (an R2 URL
 * from before the proxy, or a remote image) is returned unchanged, so this is
 * always safe to wrap around a src.
 */

/**
 * Widths the backend will render. Anything else is ignored server-side and
 * serves the original, so keep this in step with ALLOWED_WIDTHS in
 * media.controller.ts.
 */
const ALLOWED_WIDTHS = [320, 480, 640, 960, 1280, 1600, 2048] as const;

/** Rounds up to the nearest supported width so images are never upscaled. */
function nearestWidth(want: number): number {
  return (
    ALLOWED_WIDTHS.find((w) => w >= want) ??
    ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1]
  );
}

export function sizedImage<T extends string | null | undefined>(
  url: T,
  width: number,
): T {
  if (!url || !url.includes("/api/media/img")) return url;
  if (/[?&]w=/.test(url)) return url; // already sized
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${nearestWidth(width)}` as T;
}

/**
 * Common slots, named rather than numeric so call sites read as intent and the
 * numbers can be retuned in one place. Values are roughly 2x the CSS size so
 * they stay sharp on the high-DPI screens most people browse on.
 */
export const IMG = {
  /** Grid and carousel cards. */
  card: 640,
  /** Wide hero and featured panels. */
  hero: 1280,
  /** Full-bleed detail gallery. */
  gallery: 1600,
  /** Small avatars and thumbnails. */
  thumb: 320,
} as const;

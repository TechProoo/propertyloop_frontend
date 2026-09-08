/**
 * Store links for the PropertyLoop mobile app. Kept here rather than in a
 * component so anything can link to the stores without pulling a section's
 * animation deps along with it.
 */
export const APP_STORE_URL =
  "https://apps.apple.com/mx/app/propertyloop/id6790199019?l=en-GB";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=ng.propertyloop.app&pcampaignid=web_share";

export type MobilePlatform = "ios" | "android" | null;

/**
 * Best-effort guess at the visitor's mobile platform so the download CTA can
 * point straight at their store. Returns null on desktop and anywhere the UA
 * is unreadable, in which case callers should offer both stores.
 */
export const detectMobilePlatform = (): MobilePlatform => {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  // iPadOS 13+ reports itself as a Mac, so pair the Mac check with touch.
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return null;
};

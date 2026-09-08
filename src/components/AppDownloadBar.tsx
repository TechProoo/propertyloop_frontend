import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  detectMobilePlatform,
} from "../lib/appLinks";

/**
 * Signed-in app shells (dashboards, inbox, admin) run their own sticky
 * chrome — sidebars pinned to top-0 and full-height panels — so the bar is a
 * marketing surface for the public site only. Matched as path prefixes.
 */
const HIDDEN_PREFIXES = [
  "/dashboard",
  "/agent-dashboard",
  "/vendor-dashboard",
  "/messages",
  "/settings",
  "/disputes",
  "/admin",
  "/partners",
];

const AppleMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 384 512" aria-hidden="true" className={className} fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C61.5 141.2 12 184.5 12 272.6c0 26 4.8 52.9 14.3 80.6 12.7 36.4 58.6 125.7 106.5 124.2 25-.6 42.7-17.8 75.3-17.8 31.6 0 48 17.8 75.8 17.8 48.3-.7 89.8-81.9 101.9-118.4-64.8-30.5-67.1-89.4-67.1-90.3zm-56.5-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const PlayMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 512 512" aria-hidden="true" className={className} fill="currentColor">
    <path d="M47.6 19.5C40.2 25.1 36 33.9 36 44.2v423.6c0 10.3 4.2 19.1 11.6 24.7l231.3-236.5L47.6 19.5zM325.6 209.3l-63.9-65.3L84.4 12.2 325.6 209.3zM325.6 302.7L84.4 499.8l177.3-131.8 63.9-65.3zM459.4 227.5l-89.1-51.1-70.9 79.6 70.9 79.6 89.1-51.1c22.3-12.8 22.3-44.2 0-57z" />
  </svg>
);

const pillClass =
  "inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold leading-none text-primary-dark transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Slim bar pinned to the top of every public page pointing at the App Store
 * and Google Play. It sits in normal flow (position: sticky) so it takes up
 * its own space instead of covering the navbar, and it publishes its height
 * as --dl-bar-h on <html> so pages with sticky sidebars can offset by it —
 * see the :root rules in index.css.
 */
const AppDownloadBar = () => {
  const { pathname } = useLocation();
  const [platform, setPlatform] = useState<ReturnType<typeof detectMobilePlatform>>(null);

  useEffect(() => setPlatform(detectMobilePlatform()), []);

  const hidden = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    if (hidden) return;
    const root = document.documentElement;
    root.setAttribute("data-dl-bar", "");
    return () => root.removeAttribute("data-dl-bar");
  }, [hidden]);

  if (hidden) return null;

  const soleStore =
    platform === "ios"
      ? { href: APP_STORE_URL, label: "App Store" }
      : platform === "android"
        ? { href: PLAY_STORE_URL, label: "Google Play" }
        : null;

  return (
    <div className="sticky top-0 z-60 w-full bg-primary-dark text-white shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 sm:h-11 sm:px-6 md:px-12 lg:px-20">
        <p className="flex min-w-0 items-center gap-2 text-[11px] font-medium sm:text-xs">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="truncate">
            <span className="font-extrabold">PropertyLoop app</span>
            <span className="hidden text-white/75 sm:inline">
              {" "}
              — search, book and track your property on the go
            </span>
            <span className="text-white/75 sm:hidden"> is out now</span>
          </span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          {/* On a phone we know the store, so one button beats two. */}
          {soleStore ? (
            <a
              href={soleStore.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Download PropertyLoop on the ${soleStore.label}`}
              className={pillClass}
            >
              {platform === "ios" ? (
                <AppleMark className="h-3 w-3" />
              ) : (
                <PlayMark className="h-3 w-3" />
              )}
              Get the app
            </a>
          ) : (
            <>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download PropertyLoop on the App Store"
                className={pillClass}
              >
                <AppleMark className="h-3 w-3" />
                App Store
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get PropertyLoop on Google Play"
                className={pillClass}
              >
                <PlayMark className="h-3 w-3" />
                Google Play
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDownloadBar;

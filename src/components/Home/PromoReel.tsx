// The PropertyLoop brand film — a full-bleed cinematic band on the home page.
//
// Two cuts of the same 68s spot ship in /public/ads: a 16:9 landscape for
// desktop and a 9:16 portrait for phones. Whichever the viewport calls for is
// the only one fetched, so a phone never pulls the 8MB desktop file.
//
// Playback is deliberately polite: nothing downloads until the section scrolls
// into view, it starts muted (the only way browsers allow autoplay), and it
// pauses the moment it leaves the screen. Sound is one tap away.
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LANDSCAPE = "/ads/propertyloop-ad-landscape.mp4";
const PORTRAIT = "/ads/propertyloop-ad-portrait.mp4";

/** Portrait cut below the `md` breakpoint, landscape at or above it. */
function useReelSource() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setSrc(mq.matches ? LANDSCAPE : PORTRAIT);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return src;
}

export default function PromoReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = useReelSource();

  // `armed` gates the <video> src entirely — before the section is near the
  // viewport there is no network request at all.
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Arm on approach, then autoplay/pause strictly on visibility.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const arm = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          arm.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    arm.observe(el);

    const toggle = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) {
          // A rejected autoplay just leaves the first frame + play button up.
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.35 },
    );
    toggle.observe(el);

    return () => {
      arm.disconnect();
      toggle.disconnect();
    };
  }, []);

  // Scroll reveal, matching the cadence of the sibling home sections.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 78%", once: true },
    });

    const eyebrow = el.querySelector("[data-reel-eyebrow]");
    const heading = el.querySelector("[data-reel-heading]");
    const copy = el.querySelector("[data-reel-copy]");
    const frame = el.querySelector("[data-reel-frame]");

    if (eyebrow)
      tl.fromTo(eyebrow, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    if (heading)
      tl.fromTo(
        heading,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.9, ease: "power4.out" },
        "-=0.25",
      );
    if (copy)
      tl.fromTo(copy, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.5");
    if (frame)
      tl.fromTo(
        frame,
        { y: 60, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" },
        "-=0.45",
      );

    return () => {
      tl.kill();
    };
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  // Unmuting is the one action that needs a real user gesture, so it also
  // guarantees playback has started.
  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  }, []);

  const goFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // iOS Safari exposes only the proprietary form.
    const anyV = v as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else anyV.webkitEnterFullscreen?.();
  }, []);

  // A missing or blocked file should read as "no section", never as a broken one.
  if (failed) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0d2419] py-16 sm:py-20 lg:py-28"
    >
      {/* Ambient brand wash — a green bloom and a gold bloom, well blurred. */}
      <div className="pointer-events-none absolute -left-32 top-[-10%] h-[28rem] w-[28rem] rounded-full bg-[#1f6f43]/35 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-[-20%] h-[26rem] w-[26rem] rounded-full bg-[#b9842c]/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <div
            data-reel-eyebrow
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#bfe6cb]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6ee7b7] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6ee7b7]" />
            </span>
            The PropertyLoop film
          </div>

          <h2
            data-reel-heading
            className="mt-5 font-serif text-[2.1rem] leading-[1.08] text-white sm:text-[2.75rem] lg:text-[3.25rem]"
          >
            Every move you make on property,{" "}
            <em className="text-[#f0d69f]">in one loop.</em>
          </h2>

          <p
            data-reel-copy
            className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base"
          >
            Buy, rent, shortlet, and hire verified vendors — with escrow holding
            the money until the job is done. Take a minute and watch how it works.
          </p>
        </div>

        {/* Film frame */}
        <div
          data-reel-frame
          className="group relative mx-auto mt-10 w-full max-w-[16rem] sm:max-w-[19rem] md:max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-[0_40px_100px_rgba(0,0,0,0.55)] md:rounded-[2rem]">
            <div className="relative aspect-[9/16] w-full md:aspect-video">
              {armed && src && (
                <video
                  ref={videoRef}
                  key={src}
                  src={src}
                  className="h-full w-full object-cover"
                  muted={muted}
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setReady(true)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onError={() => setFailed(true)}
                  onClick={togglePlay}
                />
              )}

              {/* Loading veil — holds the frame's shape while metadata lands. */}
              {!ready && (
                <div className="absolute inset-0 grid place-items-center bg-[#0d2419]">
                  <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-[#6ee7b7]" />
                </div>
              )}

              {/* Legibility wash under the controls only. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Centre play affordance — only while paused. */}
              {ready && !playing && (
                <button
                  onClick={togglePlay}
                  aria-label="Play the PropertyLoop film"
                  className="absolute inset-0 grid place-items-center"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-2xl transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20">
                    <Play className="ml-1 h-6 w-6 fill-[#0d2419] text-[#0d2419] sm:h-7 sm:w-7" />
                  </span>
                </button>
              )}

              {/* Control bar */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 sm:p-5">
                <button
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                >
                  {playing ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="ml-0.5 h-4 w-4 fill-current" />
                  )}
                </button>

                <div className="flex items-center gap-2.5">
                  {/* The muted state is the one worth nudging, so it gets words. */}
                  <button
                    onClick={toggleSound}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-bold backdrop-blur-md transition-colors ${
                      muted
                        ? "bg-[#f0d69f] text-[#392609] hover:bg-white"
                        : "bg-white/10 text-white hover:bg-white/25"
                    }`}
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    {muted ? "Tap for sound" : "Sound on"}
                  </button>

                  <button
                    onClick={goFullscreen}
                    aria-label="Watch fullscreen"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Seated glow under the frame. */}
          <div className="pointer-events-none absolute inset-x-8 -bottom-6 h-12 rounded-full bg-[#1f6f43]/40 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

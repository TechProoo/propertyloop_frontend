"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ImageData {
  title: string;
  url: string;
}

export interface ImageGalleryHandle {
  next: () => void;
  prev: () => void;
}

interface ImageGalleryProps {
  images?: ImageData[];
  autoplayInterval?: number;
  className?: string;
  onSlideChange?: (index: number) => void;
  hideNavButtons?: boolean;
}

const defaultImages: ImageData[] = [
  {
    title: "Modern Villa",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=600&fit=crop",
  },
  {
    title: "Luxury Interior",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=600&fit=crop",
  },
  {
    title: "Contemporary Home",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop",
  },
  {
    title: "Elegant Living",
    url: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=600&fit=crop",
  },
  {
    title: "Urban Residence",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=600&fit=crop",
  },
  {
    title: "Tropical Estate",
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=600&fit=crop",
  },
];

export const ImageGallery = forwardRef<ImageGalleryHandle, ImageGalleryProps>(
  function ImageGallery(
    {
      images = defaultImages,
      autoplayInterval = 4500,
      className = "",
      onSlideChange,
      hideNavButtons = false,
    },
    ref,
  ) {
    const [opened, setOpened] = useState(0);
    const [inPlace, setInPlace] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [gsapReady, setGsapReady] = useState(false);
    const autoplayTimer = useRef<number | null>(null);

    useEffect(() => {
      const w = window as Window & {
        gsap?: GsapInstance;
        MotionPathPlugin?: unknown;
      };
      if (w.gsap && w.MotionPathPlugin) {
        w.gsap.registerPlugin(w.MotionPathPlugin);
        setGsapReady(true);
        return;
      }

      const gsapScript = document.createElement("script");
      gsapScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
      gsapScript.onload = () => {
        const motionPathScript = document.createElement("script");
        motionPathScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js";
        motionPathScript.onload = () => {
          const w2 = window as Window & {
            gsap?: GsapInstance;
            MotionPathPlugin?: unknown;
          };
          if (w2.gsap && w2.MotionPathPlugin) {
            w2.gsap.registerPlugin(w2.MotionPathPlugin);
            setGsapReady(true);
          }
        };
        document.body.appendChild(motionPathScript);
      };
      document.body.appendChild(gsapScript);
    }, []);

    const onClick = (index: number) => {
      if (!disabled) setOpened(index);
    };

    const onInPlace = (index: number) => setInPlace(index);

    const next = useCallback(() => {
      setOpened((c) => (c + 1 >= images.length ? 0 : c + 1));
    }, [images.length]);

    const prev = useCallback(() => {
      setOpened((c) => (c - 1 < 0 ? images.length - 1 : c - 1));
    }, [images.length]);

    // Expose next/prev to parent
    useImperativeHandle(ref, () => ({ next, prev }), [next, prev]);

    // Notify parent of slide changes
    useEffect(() => {
      onSlideChange?.(opened);
    }, [opened, onSlideChange]);

    useEffect(() => setDisabled(true), [opened]);
    useEffect(() => setDisabled(false), [inPlace]);

    useEffect(() => {
      if (!gsapReady) return;
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      autoplayTimer.current = window.setInterval(next, autoplayInterval);
      return () => {
        if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      };
    }, [opened, gsapReady, next, autoplayInterval]);

    return (
      <div className={`relative ${className}`}>
        {/* Gallery container */}
        <div className="relative w-full h-full overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
          {gsapReady &&
            images.map((image, i) => (
              <div
                key={image.url}
                className="absolute left-0 top-0 h-full w-full"
                style={{ zIndex: inPlace === i ? i : images.length + 1 }}
              >
                <GalleryImage
                  total={images.length}
                  id={i}
                  url={image.url}
                  title={image.title}
                  open={opened === i}
                  inPlace={inPlace === i}
                  onInPlace={onInPlace}
                />
              </div>
            ))}
          <div className="absolute left-0  z-100 h-full w-full pointer-events-none">
            <Tabs images={images} onSelect={onClick} />
          </div>
        </div>

        {/* Nav buttons */}
        {!hideNavButtons && (
          <>
            <button
              className="absolute left-2 sm:-left-5 top-1/2 z-101 flex h-11 w-11 sm:h-10 sm:w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white/70 sm:border sm:border-white/50 backdrop-blur-md bg-white/90 sm:bg-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.2)] outline-none transition-all duration-300 hover:scale-110 hover:bg-white/80 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={prev}
              disabled={disabled}
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5 text-primary-dark" />
            </button>

            <button
              className="absolute right-2 sm:-right-5 top-1/2 z-101 flex h-11 w-11 sm:h-10 sm:w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white/70 sm:border sm:border-white/50 backdrop-blur-md bg-white/90 sm:bg-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.2)] outline-none transition-all duration-300 hover:scale-110 hover:bg-white/80 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={next}
              disabled={disabled}
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5 text-primary-dark" />
            </button>
          </>
        )}
      </div>
    );
  },
);

// --- GSAP type for window ---
interface GsapInstance {
  registerPlugin: (plugin: unknown) => void;
  timeline: (opts?: Record<string, unknown>) => GsapTimeline;
}

interface GsapTimeline {
  set: (target: unknown, vars: Record<string, unknown>) => GsapTimeline;
  to: (target: unknown, vars: Record<string, unknown>) => GsapTimeline;
}

interface GalleryImageProps {
  url: string;
  title: string;
  open: boolean;
  inPlace: boolean;
  id: number;
  onInPlace: (id: number) => void;
  total: number;
}

function GalleryImage({
  url,
  open,
  inPlace,
  id,
  onInPlace,
  total,
}: GalleryImageProps) {
  const [firstLoad, setLoaded] = useState(true);
  const clip = useRef<SVGCircleElement>(null);

  const gap = 10;
  const circleRadius = 7;
  const defaults = { transformOrigin: "center center" };
  const duration = 0.4;
  const width = 400;
  const height = 400;
  const scale = 700;
  const bigSize = circleRadius * scale;
  const overlap = 0;

  const getPosSmall = () => ({
    cx:
      width / 2 -
      (total * (circleRadius * 2 + gap) - gap) / 2 +
      id * (circleRadius * 2 + gap),
    cy: height - 30,
    r: circleRadius,
  });
  const getPosSmallAbove = () => ({
    cx:
      width / 2 -
      (total * (circleRadius * 2 + gap) - gap) / 2 +
      id * (circleRadius * 2 + gap),
    cy: height / 2,
    r: circleRadius * 2,
  });
  const getPosCenter = () => ({
    cx: width / 2,
    cy: height / 2,
    r: circleRadius * 7,
  });
  const getPosEnd = () => ({
    cx: width / 2 - bigSize + overlap,
    cy: height / 2,
    r: bigSize,
  });
  const getPosStart = () => ({
    cx: width / 2 + bigSize - overlap,
    cy: height / 2,
    r: bigSize,
  });

  useEffect(() => {
    const w = window as Window & { gsap?: GsapInstance };
    const gsap = w.gsap;
    if (!gsap) return;

    setLoaded(false);
    if (clip.current) {
      const flipDuration = firstLoad ? 0 : duration;
      const upDuration = firstLoad ? 0 : 0.2;
      const bounceDuration = firstLoad ? 0.01 : 1;
      const delay = firstLoad ? 0 : flipDuration + upDuration;

      if (open) {
        gsap
          .timeline()
          .set(clip.current, { ...defaults, ...getPosSmall() })
          .to(clip.current, {
            ...defaults,
            ...getPosCenter(),
            duration: upDuration,
            ease: "power3.inOut",
          })
          .to(clip.current, {
            ...defaults,
            ...getPosEnd(),
            duration: flipDuration,
            ease: "power4.in",
            onComplete: () => onInPlace(id),
          });
      } else {
        gsap
          .timeline({ overwrite: true })
          .set(clip.current, { ...defaults, ...getPosStart() })
          .to(clip.current, {
            ...defaults,
            ...getPosCenter(),
            delay: delay,
            duration: flipDuration,
            ease: "power4.out",
          })
          .to(clip.current, {
            ...defaults,
            motionPath: {
              path: [getPosSmallAbove(), getPosSmall()],
              curviness: 1,
            },
            duration: bounceDuration,
            ease: "bounce.out",
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        <clipPath id={`${id}_circleClip`}>
          <circle className="clip" cx="0" cy="0" r={circleRadius} ref={clip} />
        </clipPath>
        <clipPath id={`${id}_squareClip`}>
          <rect className="clip" width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}${inPlace ? "_squareClip" : "_circleClip"})`}>
        <image
          width={width}
          height={height}
          href={url}
          className="pointer-events-none"
        />
      </g>
    </svg>
  );
}

interface TabsProps {
  images: ImageData[];
  onSelect: (index: number) => void;
}

function Tabs({ images, onSelect }: TabsProps) {
  const gap = 10;
  const circleRadius = 7;
  const width = 400;
  const height = 400;

  const getPosX = (i: number) =>
    width / 2 -
    (images.length * (circleRadius * 2 + gap) - gap) / 2 +
    i * (circleRadius * 2 + gap);
  const getPosY = () => height - 30;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      {images.map((image, i) => (
        <g key={image.url} className="pointer-events-auto">
          <defs>
            <clipPath id={`tab_${i}_clip`}>
              <circle cx={getPosX(i)} cy={getPosY()} r={circleRadius} />
            </clipPath>
          </defs>
          <image
            x={getPosX(i) - circleRadius}
            y={getPosY() - circleRadius}
            width={circleRadius * 2}
            height={circleRadius * 2}
            href={image.url}
            clipPath={`url(#tab_${i}_clip)`}
            className="pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
          />
          <circle
            onClick={() => onSelect(i)}
            className="cursor-pointer fill-white/0 stroke-white/70 hover:stroke-white transition-all"
            strokeWidth="2"
            cx={getPosX(i)}
            cy={getPosY()}
            r={circleRadius + 2}
          />
        </g>
      ))}
    </svg>
  );
}

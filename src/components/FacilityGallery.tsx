/**
 * <FacilityGallery /> - cinematic site-works carousel for the Facility
 * Management page.
 *
 * One image holds the stage at a time with a slow Ken Burns push and a
 * cross-fade between slides; a filmstrip along the bottom scrolls through
 * every frame and jumps the stage on click. Autoplay pauses on hover/focus
 * and is disabled outright when the viewer prefers reduced motion.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import um01 from "../assets/ultramodern/um-01.jpeg";
import um02 from "../assets/ultramodern/um-02.jpeg";
import um03 from "../assets/ultramodern/um-03.jpeg";
import um04 from "../assets/ultramodern/um-04.jpeg";
import um05 from "../assets/ultramodern/um-05.jpeg";
import um06 from "../assets/ultramodern/um-06.jpeg";
import um07 from "../assets/ultramodern/um-07.jpeg";
import um08 from "../assets/ultramodern/um-08.jpeg";
import um09 from "../assets/ultramodern/um-09.jpeg";
import um10 from "../assets/ultramodern/um-10.jpeg";
import um11 from "../assets/ultramodern/um-11.jpeg";
import um12 from "../assets/ultramodern/um-12.jpeg";
import um13 from "../assets/ultramodern/um-13.jpeg";
import um14 from "../assets/ultramodern/um-14.jpeg";
import um15 from "../assets/ultramodern/um-15.jpeg";
import um16 from "../assets/ultramodern/um-16.jpeg";
import um17 from "../assets/ultramodern/um-17.jpeg";
import um18 from "../assets/ultramodern/um-18.jpeg";
import um19 from "../assets/ultramodern/um-19.jpeg";
import um20 from "../assets/ultramodern/um-20.jpeg";
import um21 from "../assets/ultramodern/um-21.jpeg";
import um22 from "../assets/ultramodern/um-22.jpeg";
import um23 from "../assets/ultramodern/um-23.jpeg";
import um24 from "../assets/ultramodern/um-24.jpeg";
import um25 from "../assets/ultramodern/um-25.jpeg";
import um26 from "../assets/ultramodern/um-26.jpeg";
import um27 from "../assets/ultramodern/um-27.jpeg";
import um28 from "../assets/ultramodern/um-28.jpeg";
import um29 from "../assets/ultramodern/um-29.jpeg";
import um30 from "../assets/ultramodern/um-30.jpeg";
import um31 from "../assets/ultramodern/um-31.jpeg";
import um32 from "../assets/ultramodern/um-32.jpeg";
import um33 from "../assets/ultramodern/um-33.jpeg";
import um34 from "../assets/ultramodern/um-34.jpeg";
import um35 from "../assets/ultramodern/um-35.jpeg";
import um36 from "../assets/ultramodern/um-36.jpeg";
import um37 from "../assets/ultramodern/um-37.jpeg";
import um38 from "../assets/ultramodern/um-38.jpeg";
import um39 from "../assets/ultramodern/um-39.jpeg";

const PLANT = "Dangote Fertilizer · Ibeju-Lekki";
const FIELD = "Ultramodern Engineering · site works";

type Slide = {
  src: string;
  title: string;
  place: string;
  note: string;
};

/* Landscape frames lead - they hold the stage best - then the detail shots. */
const slides: Slide[] = [
  {
    src: um11,
    title: "Central Control Room",
    place: PLANT,
    note: "Air-cooled chiller bank lined up against the CCR, the building the whole plant is run from.",
  },
  {
    src: um09,
    title: "Laboratory Block",
    place: PLANT,
    note: "Chilled water plant sitting outside the laboratory, caged and serviceable from the yard.",
  },
  {
    src: um07,
    title: "The Workshop",
    place: PLANT,
    note: "A wall of split units feeding the workshop, with the team on inspection.",
  },
  {
    src: um08,
    title: "Substation 1",
    place: PLANT,
    note: "HVAC and fire systems keeping switchgear inside SS1 within temperature.",
  },
  {
    src: um17,
    title: "CCR Chiller Yard",
    place: PLANT,
    note: "Packaged chillers in the control-room yard - the plant's cooling backbone.",
  },
  {
    src: um20,
    title: "Substation 2 Rooftop",
    place: PLANT,
    note: "Rooftop air handling units at SS2, with the refinery skyline behind.",
  },
  {
    src: um15,
    title: "SS1 Air Ducts",
    place: PLANT,
    note: "Insulated supply ducting threaded through Substation 1.",
  },
  {
    src: um35,
    title: "CCR Air Ducts",
    place: PLANT,
    note: "Ductwork and diffusers feeding the central control room.",
  },
  {
    src: um28,
    title: "Chilled Water Plant",
    place: PLANT,
    note: "Pumps, expansion vessels and headers on a chilled water circuit under installation.",
  },
  {
    src: um31,
    title: "Air & Water Pump Skid",
    place: PLANT,
    note: "HVAC air and water pump system, pipework colour-coded and labelled.",
  },
  {
    src: um30,
    title: "Industrial Install",
    place: PLANT,
    note: "Chilled water pipework and ducting going in overhead.",
  },
  {
    src: um26,
    title: "Technical Building",
    place: PLANT,
    note: "The fertilizer technical building, served end to end by Ultramodern.",
  },
  {
    src: um01,
    title: "Commissioning Walk",
    place: PLANT,
    note: "HVAC safety systems commissioning and inspection, on the chiller line.",
  },
  {
    src: um02,
    title: "Mechanical Ventilation",
    place: PLANT,
    note: "Mechanical ventilation plant laid out across the roof deck.",
  },
  {
    src: um04,
    title: "Rooftop Units",
    place: PLANT,
    note: "Rooftop air handling units and ducting runs above the plant.",
  },
  {
    src: um05,
    title: "Substation 2 Plant",
    place: PLANT,
    note: "SS2 HVAC system with engineers working the access panels.",
  },
  {
    src: um12,
    title: "Technical Building HVAC",
    place: PLANT,
    note: "Caged condenser units and the service walkway around them.",
  },
  {
    src: um19,
    title: "Laboratory Chillers",
    place: PLANT,
    note: "Laboratory HVAC system under load, with the crew on site.",
  },
  {
    src: um21,
    title: "Laboratory Fire System",
    place: PLANT,
    note: "Detection and alarm devices along the laboratory escape route.",
  },
  {
    src: um22,
    title: "Laboratory Handover",
    place: PLANT,
    note: "Walking the laboratory HVAC installation room by room.",
  },
  {
    src: um27,
    title: "CCR Plant Yard",
    place: PLANT,
    note: "The control room's chiller yard seen from the access road.",
  },
  {
    src: um32,
    title: "Air Handling & Ducting",
    place: PLANT,
    note: "Coil face and ducting connection being checked on an AHU.",
  },
  {
    src: um33,
    title: "Monitoring & Maintenance",
    place: PLANT,
    note: "Routine monitoring on a running unit - the maintenance contract in practice.",
  },
  {
    src: um36,
    title: "Control Panel",
    place: PLANT,
    note: "HVAC control panel wired and terminated.",
  },
  {
    src: um16,
    title: "Bagging Area",
    place: PLANT,
    note: "HVAC system serving the bagging hall.",
  },
  {
    src: um25,
    title: "Engineered Airflow",
    place: FIELD,
    note: "Airflow solutions through a finished internal corridor.",
  },
  {
    src: um24,
    title: "Industrial HVAC",
    place: FIELD,
    note: "Industrial HVAC system installation in a plant room.",
  },
  {
    src: um23,
    title: "Ventilation Works",
    place: FIELD,
    note: "Mechanical ventilation works against the external wall.",
  },
  {
    src: um13,
    title: "CCR Unit Service",
    place: PLANT,
    note: "Servicing a control-room HVAC unit in full PPE.",
  },
  {
    src: um14,
    title: "SS2 Unit",
    place: PLANT,
    note: "Substation 2 HVAC unit, panels open for inspection.",
  },
  {
    src: um34,
    title: "SS1 Maintenance",
    place: PLANT,
    note: "Substation 1 HVAC unit maintenance visit.",
  },
  {
    src: um39,
    title: "Workshop Unit",
    place: PLANT,
    note: "Workshop HVAC unit with the crew around it.",
  },
  {
    src: um38,
    title: "Duct Riser",
    place: FIELD,
    note: "Insulated riser and air duct system on a live site.",
  },
  {
    src: um10,
    title: "Fire & Gas Panel",
    place: FIELD,
    note: "Fire and gas HVAC panel being brought into service.",
  },
  {
    src: um37,
    title: "Fire Suppression",
    place: FIELD,
    note: "Suppression cylinders and release panel, installed and charged.",
  },
  {
    src: um29,
    title: "Fire Alarm Install",
    place: FIELD,
    note: "Fire alarm and safety system installation in progress.",
  },
  {
    src: um03,
    title: "Site Inspection",
    place: FIELD,
    note: "Walking a plant room with the client's engineer.",
  },
  {
    src: um06,
    title: "Service Corridor",
    place: FIELD,
    note: "Ducted corridor run, ceiling still open for access.",
  },
  {
    src: um18,
    title: "The Team",
    place: FIELD,
    note: "Part of the Ultramodern crew on site.",
  },
];

const DURATION = 6000;

const FacilityGallery = () => {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const total = slides.length;
  const active = slides[index];
  const running = playing && !paused && visible && !reduceMotion;

  const go = useCallback(
    (next: number) => {
      setDirection(next > index || (index === total - 1 && next === 0) ? 1 : -1);
      setIndex(((next % total) + total) % total);
    },
    [index, total],
  );

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  // Autoplay
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(next, DURATION);
    return () => window.clearTimeout(t);
  }, [running, next, index]);

  // Pause while the section is off screen so it isn't churning in the background
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the active thumbnail in view
  useEffect(() => {
    const el = thumbRefs.current[index];
    const strip = stripRef.current;
    if (!el || !strip) return;
    const left = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
    strip.scrollTo({
      left,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [index, reduceMotion]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const counter = useMemo(
    () => String(index + 1).padStart(2, "0"),
    [index],
  );

  return (
    <section className="mb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
            From the field
          </p>
          <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
            The work, <span className="text-primary">as it looks</span>
          </h2>
          <p className="text-text-secondary text-sm mt-3 max-w-xl leading-relaxed">
            Plant rooms, chiller yards, risers and panels photographed on live
            sites - the same systems a facility management contract keeps
            running once the building is handed over.
          </p>
        </div>
        <p className="text-text-subtle text-xs shrink-0">
          {total} frames &middot; use &larr; &rarr; to move
        </p>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Ultramodern Engineering site works"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative h-[68vh] min-h-[480px] max-h-[760px] rounded-[2rem] overflow-hidden bg-primary-dark shadow-[0_12px_44px_rgba(0,0,0,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f0eb]"
      >
        {/* Frames */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={index}
            src={active.src}
            alt={`${active.title} - ${active.note}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.14, x: direction * 40 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, x: 0 }
            }
            exit={{ opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : {
                    opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
                    x: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: DURATION / 1000 + 1.2, ease: "linear" },
                  }
            }
          />
        </AnimatePresence>

        {/* Cinematic grade */}
        <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/35 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-primary-dark/85 via-transparent to-primary-dark/30" />

        {/* Caption */}
        <div className="absolute inset-x-0 top-0 p-6 sm:p-10 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-md"
            >
              <span className="inline-flex items-center gap-2 text-white/70 text-xs font-semibold tracking-wide uppercase">
                <span className="w-6 h-px bg-white/50" />
                {active.place}
              </span>
              <h3 className="font-heading text-white text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.02] font-bold tracking-tight mt-3">
                {active.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mt-4 max-w-sm">
                {active.note}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls + counter */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 lg:p-10">
          <div className="flex items-end justify-between gap-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous frame"
                className="w-11 h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white hover:text-primary-dark transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next frame"
                className="w-11 h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white hover:text-primary-dark transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {!reduceMotion && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  className="w-11 h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white hover:text-primary-dark transition-colors"
                >
                  {playing ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            <div className="flex items-end gap-3 text-white">
              <span className="font-heading text-[2.5rem] sm:text-[3.5rem] leading-none font-bold tracking-tight">
                {counter}
              </span>
              <span className="text-white/50 text-sm mb-1.5">/ {total}</span>
            </div>
          </div>

          {/* Progress - freezes in place when autoplay pauses */}
          {!reduceMotion && (
            <div className="mt-5 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                key={index}
                className="h-full bg-white rounded-full origin-left"
                style={{
                  animation: `pl-slide-progress ${DURATION}ms linear forwards`,
                  animationPlayState: running ? "running" : "paused",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filmstrip */}
      <div
        ref={stripRef}
        className="relative mt-5 flex gap-4 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <button
            key={s.src}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${s.title}`}
            aria-current={i === index}
            className={`relative shrink-0 w-40 sm:w-52 h-28 sm:h-36 rounded-2xl overflow-hidden transition-all duration-500 ${
              i === index
                ? "ring-2 ring-primary ring-offset-2 ring-offset-[#f5f0eb] scale-100"
                : "opacity-55 hover:opacity-100 scale-[0.94]"
            }`}
          >
            <img
              src={s.src}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary-dark/85 to-transparent" />
            <span className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-semibold leading-tight text-left">
              {s.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FacilityGallery;

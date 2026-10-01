import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import poster from "../../assets/independence-2026.jpg";

/**
 * Independence Day greeting, shown once per visitor on 1 October.
 *
 * Deliberately not a loading splash: it sits over the site after the app has
 * booted, is dismissible, and never blocks a second visit the same day. The
 * date is read in Lagos time — the greeting belongs to the Nigerian day, not
 * to wherever the visitor's browser happens to be.
 */

/** 1 October. Year-agnostic so the poster can be swapped and the gate reused. */
const DAY = { month: 10, date: 1 };

/** Bumped per year, so next year's greeting shows again to the same browser. */
const SEEN_KEY = "pl-independence-2026";

/** Today in Lagos, as { month, date, year }. */
function lagosToday(): { month: number; date: number; year: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { month: get("month"), date: get("day"), year: get("year") };
}

export function isIndependenceDay(): boolean {
  const today = lagosToday();
  return today.month === DAY.month && today.date === DAY.date;
}

const IndependenceSplash = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isIndependenceDay()) return;
    // A blocked or cleared store is not a reason to withhold a greeting, so a
    // failed read shows it; only a successful "seen" read suppresses it.
    try {
      if (localStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      /* private window — show it anyway */
    }
    setOpen(true);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* nothing to remember it with — it simply shows again */
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    // The page behind must not scroll while the greeting is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="independence"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Happy Independence Day Nigeria"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(5, 28, 17, 0.82)", backdropFilter: "blur(6px)" }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[380px] flex flex-col items-center"
          >
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute -top-2 -right-2 z-10 w-9 h-9 rounded-full bg-white/95 text-primary-dark flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <img
              src={poster}
              alt="Happy Independence Day Nigeria — Nigeria at 66, 1st October. From PropertyLoop."
              className="w-full h-auto max-h-[72vh] object-contain rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
            />

            <p className="mt-4 text-center text-white/85 text-sm leading-relaxed max-w-xs">
              From all of us at PropertyLoop — happy Independence Day. Here&apos;s
              to a home for every Nigerian.
            </p>

            <button
              onClick={dismiss}
              className="mt-4 h-11 px-7 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors"
            >
              Continue to PropertyLoop
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IndependenceSplash;

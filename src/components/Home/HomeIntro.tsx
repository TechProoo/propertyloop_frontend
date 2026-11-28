import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import avenue from "../../assets/hero_img_2.jpg";
import "./HomeIntro.css";

const seenKey = "propertyloop.home-intro";
const reducedMotion = "(prefers-reduced-motion: reduce)";
let played = false;

function shouldPlay() {
  if (played || window.matchMedia(reducedMotion).matches) return false;
  try {
    return !sessionStorage.getItem(seenKey);
  } catch {
    return true;
  }
}

export default function HomeIntro({ loading }: { loading: boolean }) {
  const [stage, setStage] = useState<"film" | "waiting" | "done">(() =>
    shouldPlay() ? "film" : "done",
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = stage !== "done" || loading;

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!visible || !element) return;
    element.showModal();
    return () => element.close();
  }, [visible]);

  useLayoutEffect(() => {
    if (stage !== "film") return;
    played = true;
    try {
      sessionStorage.setItem(seenKey, "1");
    } catch {
      // The in-memory flag also covers browsers that disable storage.
    }

    const preference = window.matchMedia(reducedMotion);
    const skip = () => setStage("done");
    preference.addEventListener("change", skip);
    const scene = gsap.context(() => {
      gsap
        .timeline({ onComplete: () => setStage("waiting") })
        .from(".intro-frame", {
          clipPath: "inset(48% 36%)",
          duration: 0.85,
          ease: "power3.inOut",
        })
        .from(
          ".intro-still",
          { scale: 1.08, duration: 1.45, ease: "power2.out" },
          0,
        )
        .from(
          ".intro-word",
          { yPercent: 108, duration: 0.65, ease: "power3.out" },
          0.28,
        )
        .from(
          ".intro-rule",
          { scaleX: 0, duration: 0.65, ease: "power2.inOut" },
          0.62,
        );
    }, dialog);
    return () => {
      preference.removeEventListener("change", skip);
      scene.revert();
    };
  }, [stage]);

  useLayoutEffect(() => {
    if (stage !== "waiting" || loading) return;
    const scene = gsap.context(() => {
      gsap.to(".intro-screen", {
        yPercent: -101,
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => setStage("done"),
      });
    }, dialog);
    return () => scene.revert();
  }, [stage, loading]);

  if (!visible) return null;
  const showingFilm = stage !== "done";
  return (
    <dialog
      ref={dialog}
      className="intro-dialog"
      aria-label="PropertyLoop homepage"
      onCancel={(event) => {
        event.preventDefault();
        setStage("done");
      }}
    >
      <div className="intro-screen">
        {showingFilm ? (
          <>
            <div className="intro-frame" aria-hidden="true">
              <img className="intro-still" src={avenue} alt="" />
            </div>
            <div className="intro-title" aria-label="PropertyLoop">
              <span className="intro-mask" aria-hidden="true">
                <span className="intro-word">
                  Property<i>Loop</i>
                </span>
              </span>
              <span className="intro-rule" aria-hidden="true" />
            </div>
            <button className="intro-skip" onClick={() => setStage("done")}>
              Skip intro <ArrowRight size={16} aria-hidden="true" />
            </button>
          </>
        ) : null}
        {loading && (
          <p role="status" className="intro-status">
            Loading PropertyLoop…
          </p>
        )}
      </div>
    </dialog>
  );
}

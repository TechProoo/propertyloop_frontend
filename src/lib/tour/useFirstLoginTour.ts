import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "./tour.css";
import { stepsByRole, type TourRole } from "./steps";

const STORAGE_KEY = (role: TourRole, userId: string) =>
  `pl_tour_done_${role}_${userId}`;

const TOUR_FORCE_KEY = "pl_force_tour";

export function isTourCompleted(role: TourRole, userId: string): boolean {
  return localStorage.getItem(STORAGE_KEY(role, userId)) === "1";
}

export function markTourCompleted(role: TourRole, userId: string) {
  localStorage.setItem(STORAGE_KEY(role, userId), "1");
}

/** Force the next mount to start the tour again — useful from a "Replay tour" button */
export function replayTour(role: TourRole, userId: string) {
  localStorage.removeItem(STORAGE_KEY(role, userId));
  localStorage.setItem(TOUR_FORCE_KEY, `${role}:${userId}`);
}

function waitForElement(selector: string, timeoutMs = 1500): Promise<Element | null> {
  return new Promise((resolve) => {
    const found = document.querySelector(selector);
    if (found) return resolve(found);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector(selector));
    }, timeoutMs);
  });
}

export interface UseFirstLoginTourOptions {
  role: TourRole | null | undefined;
  userId: string | null | undefined;
  /** Skip if false (e.g. dashboard data still loading) */
  enabled?: boolean;
}

export function useFirstLoginTour({
  role,
  userId,
  enabled = true,
}: UseFirstLoginTourOptions) {
  useEffect(() => {
    if (!enabled || !role || !userId) return;

    const forced = localStorage.getItem(TOUR_FORCE_KEY) === `${role}:${userId}`;
    if (!forced && isTourCompleted(role, userId)) return;
    if (forced) localStorage.removeItem(TOUR_FORCE_KEY);

    const steps = stepsByRole[role];
    if (!steps?.length) return;

    let cancelled = false;
    let tour: Shepherd.Tour | null = null;

    const run = async () => {
      // Give React a tick so refs/data-tour attrs are mounted
      await new Promise((r) => setTimeout(r, 350));
      if (cancelled) return;

      tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          arrow: true,
          cancelIcon: { enabled: true },
          scrollTo: { behavior: "smooth", block: "center" },
          modalOverlayOpeningRadius: 12,
          modalOverlayOpeningPadding: 6,
          classes: "shepherd-step",
          when: {
            show() {
              const step = this as Shepherd.Step;
              const target = step.getTarget?.();
              if (target instanceof HTMLElement) {
                target.classList.add("shepherd-target-highlight");
              }
            },
            hide() {
              const step = this as Shepherd.Step;
              const target = step.getTarget?.();
              if (target instanceof HTMLElement) {
                target.classList.remove("shepherd-target-highlight");
              }
            },
          },
        },
      });

      const total = steps.length;

      steps.forEach((s, idx) => {
        const isLast = idx === total - 1;
        const isFirst = idx === 0;

        const text = `<div class="shepherd-step-counter">Step ${idx + 1} of ${total}</div>${s.body}`;

        const buttons: Shepherd.Step.StepOptionsButton[] = [];

        if (!isFirst) {
          buttons.push({
            text: "Back",
            secondary: true,
            classes: "shepherd-button-secondary",
            action() {
              return this.back();
            },
          });
        } else {
          buttons.push({
            text: "Skip",
            classes: "shepherd-button-skip",
            action() {
              return this.cancel();
            },
          });
        }

        buttons.push({
          text: isLast ? "Got it" : "Next",
          classes: "shepherd-button-primary",
          action() {
            return isLast ? this.complete() : this.next();
          },
        });

        const stepOptions: Shepherd.Step.StepOptions = {
          id: s.id,
          title: s.title,
          text,
          buttons,
        };

        if (s.attachTo) {
          stepOptions.attachTo = s.attachTo;
        } else {
          // No target — render centered with extra class
          stepOptions.classes = "shepherd-centered-step";
        }

        if (s.beforeShow) {
          stepOptions.beforeShowPromise = async () => {
            s.beforeShow?.();
            await new Promise((r) => setTimeout(r, 100));
          };
        }

        // Wait for attach target to exist before showing this step
        if (s.attachTo) {
          const baseBefore = stepOptions.beforeShowPromise;
          stepOptions.beforeShowPromise = async () => {
            if (baseBefore) {
              await (typeof baseBefore === "function"
                ? baseBefore()
                : baseBefore);
            }
            await waitForElement(s.attachTo!.element);
          };
        }

        tour!.addStep(stepOptions);
      });

      const handleEnd = () => {
        if (!cancelled) markTourCompleted(role, userId);
      };
      tour.on("complete", handleEnd);
      tour.on("cancel", handleEnd);

      tour.start();
    };

    run();

    return () => {
      cancelled = true;
      try {
        tour?.cancel();
      } catch {
        // ignore
      }
    };
  }, [role, userId, enabled]);
}

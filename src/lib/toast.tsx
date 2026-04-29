import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

/**
 * Tiny in-house toast system. No dep, no library.
 *
 * Usage:
 *   import { toast } from "@/lib/toast";  // path-relative imports also fine
 *   toast.success("Saved!");
 *   toast.error("Something went wrong");
 *
 * Mount <Toaster /> once near the root of the React tree.
 */

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

type Listener = (toasts: Toast[]) => void;

let nextId = 1;
let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function notify() {
  for (const l of listeners) l(toasts);
}

function push(message: string, variant: ToastVariant, duration = 5000) {
  const id = nextId++;
  toasts = [...toasts, { id, message, variant, duration }];
  notify();
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export const toast = {
  success: (message: string, duration?: number) =>
    push(message, "success", duration),
  error: (message: string, duration = 8000) =>
    push(message, "error", duration),
  info: (message: string, duration?: number) =>
    push(message, "info", duration),
  dismiss,
};

export function Toaster() {
  const [items, setItems] = useState<Toast[]>(toasts);

  useEffect(() => {
    const listener: Listener = (next) => setItems([...next]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2 px-3 pointer-events-none sm:top-6"
    >
      {items.map((t) => {
        const styles =
          t.variant === "success"
            ? "bg-primary text-white border-primary/30"
            : t.variant === "error"
              ? "bg-red-600 text-white border-red-700"
              : "bg-primary-dark text-white border-white/15";
        const Icon =
          t.variant === "error" ? AlertCircle : CheckCircle;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto w-full max-w-md flex items-start gap-2.5 rounded-2xl border px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm animate-toast-in ${styles}`}
            role={t.variant === "error" ? "alert" : "status"}
          >
            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="flex-1 text-sm leading-relaxed break-words">
              {t.message}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="shrink-0 -mr-1 -mt-1 p-1 rounded-full hover:bg-white/15 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-toast-in {
          animation: toast-in 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
}

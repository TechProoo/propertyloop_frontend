/**
 * Paystack Inline SDK loader
 *
 * Loads js.paystack.co lazily on first use so the main bundle stays slim.
 * Callers get `PaystackPop.setup({...}).openIframe()` back once the script
 * resolves — the browser caches the second load, so repeat checkouts hit no
 * network.
 */

const SCRIPT_URL = "https://js.paystack.co/v1/inline.js";

type PaystackHandler = {
  openIframe: () => void;
};

export type PaystackSetupOptions = {
  key: string;
  email: string;
  /** Amount in kobo (1 Naira = 100 kobo). */
  amount: number;
  ref?: string;
  currency?: "NGN" | "USD" | "GHS" | "ZAR" | "KES";
  channels?: Array<"card" | "bank" | "ussd" | "qr" | "mobile_money" | "bank_transfer">;
  metadata?: Record<string, unknown>;
  callback?: (response: PaystackSuccessResponse) => void;
  onClose?: () => void;
};

export type PaystackSuccessResponse = {
  reference: string;
  trans?: string;
  status?: "success" | "failed";
  message?: string;
  transaction?: string;
};

type PaystackPopGlobal = {
  setup: (options: PaystackSetupOptions) => PaystackHandler;
};

declare global {
  interface Window {
    PaystackPop?: PaystackPopGlobal;
  }
}

let loadingPromise: Promise<PaystackPopGlobal> | null = null;

export function loadPaystack(): Promise<PaystackPopGlobal> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack can only load in the browser."));
  }
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop);
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise<PaystackPopGlobal>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_URL}"]`,
    );
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
    const onReady = () => {
      if (window.PaystackPop) resolve(window.PaystackPop);
      else reject(new Error("Paystack script loaded but PaystackPop missing."));
    };
    if ((script as any).readyState === "complete" || window.PaystackPop) {
      onReady();
    } else {
      script.addEventListener("load", onReady, { once: true });
      script.addEventListener(
        "error",
        () => {
          loadingPromise = null;
          reject(new Error("Could not load the Paystack script."));
        },
        { once: true },
      );
    }
  });

  return loadingPromise;
}

/**
 * One-line checkout: opens the Paystack iframe and returns a promise that
 * resolves on success, rejects on close or script error. Keeps callers from
 * having to juggle both callbacks.
 */
export function openPaystackCheckout(
  options: Omit<PaystackSetupOptions, "callback" | "onClose">,
): Promise<PaystackSuccessResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const sdk = await loadPaystack();
      const handler = sdk.setup({
        ...options,
        callback: (res) => resolve(res),
        onClose: () => reject(new Error("Payment window closed")),
      });
      handler.openIframe();
    } catch (err) {
      reject(err);
    }
  });
}

export function getPaystackPublicKey(): string | null {
  const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;
  if (!key || !key.trim() || key.includes("xxxxxx")) return null;
  return key.trim();
}

/**
 * Deterministic-ish reference for a marketplace order. Paystack recommends 10+
 * chars, letters and numbers, unique per transaction attempt.
 */
export function makeOrderReference(prefix = "PLM"): string {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${now}-${rand}`;
}

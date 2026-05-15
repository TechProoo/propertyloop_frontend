import { useEffect, useState } from "react";

const NETWORK_ERROR_EVENT = "pl:network-error";
const NETWORK_RECOVER_EVENT = "pl:network-recover";

/** Fire when an axios request fails with no response (network error). */
export function reportNetworkError() {
  window.dispatchEvent(new Event(NETWORK_ERROR_EVENT));
}

/** Fire when an axios request succeeds — clears any sticky offline state. */
export function reportNetworkRecover() {
  window.dispatchEvent(new Event(NETWORK_RECOVER_EVENT));
}

/**
 * Returns false when the browser reports offline OR when an axios request
 * recently failed with a network error. Auto-recovers when the browser
 * reports online again or a subsequent request succeeds.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    const handleApiError = () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setOnline(false);
      }
    };
    const handleApiRecover = () => setOnline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener(NETWORK_ERROR_EVENT, handleApiError);
    window.addEventListener(NETWORK_RECOVER_EVENT, handleApiRecover);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(NETWORK_ERROR_EVENT, handleApiError);
      window.removeEventListener(NETWORK_RECOVER_EVENT, handleApiRecover);
    };
  }, []);

  return online;
}

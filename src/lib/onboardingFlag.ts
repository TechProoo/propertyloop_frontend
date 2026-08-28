/**
 * The signup wizard authenticates the user partway through: `signup()` sets the
 * session, but the steps after it - a vendor's first service, then welcome -
 * still need to render. Without this hold, the route guard would bounce a
 * freshly created account to /verify-email-required mid-wizard.
 *
 * Onboarding takes the hold just before signing up and releases it on unmount.
 * sessionStorage (not module state) so a reload mid-flow doesn't strand anyone.
 */
const KEY = "pl_onboarding_active";

export function holdOnboardingRoute() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* private mode - the wizard still works, it just can't hold the route */
  }
}

export function releaseOnboardingRoute() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to release */
  }
}

export function isOnboardingRouteHeld(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets window scroll to (0, 0) on every pathname change so SPA navigation
 * behaves like a real page load. Without this, clicking a link at the bottom
 * of one page lands the user at the bottom of the next.
 *
 * Mount once inside <BrowserRouter>.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

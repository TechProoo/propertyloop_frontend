import type { ReactNode, MouseEvent, AnchorHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  children: ReactNode;
  href: string;
}

/**
 * Wraps a card/link so that:
 * - If logged in → navigates to href via the SPA router (no full reload, so
 *   the in-memory access token survives and the user stays signed in).
 * - If NOT logged in → redirects to /login.
 *
 * It renders a real <a href> for accessibility/SEO and modifier-clicks
 * (Cmd/Ctrl+click still opens a new tab), but intercepts a plain left-click
 * to do client-side navigation. A full-page reload here was logging users
 * out because it forced an /auth/refresh on every property click.
 */
const AuthGate = ({ children, href, className = "", onClick, ...rest }: Props) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let the browser handle new-tab / new-window intents natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    navigate(isLoggedIn ? href : "/login");
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};

export default AuthGate;

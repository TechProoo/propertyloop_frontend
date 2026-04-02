import type { ReactNode, MouseEvent } from "react";
import { useAuth } from "../../context/AuthContext";

interface Props {
  children: ReactNode;
  href: string;
  className?: string;
}

/**
 * Wraps a card/link so that:
 * - If logged in → navigates to href normally
 * - If NOT logged in → redirects to /onboarding
 */
const AuthGate = ({ children, href, className = "" }: Props) => {
  const { isLoggedIn } = useAuth();

  const handleClick = (e: MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = "/onboarding";
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default AuthGate;

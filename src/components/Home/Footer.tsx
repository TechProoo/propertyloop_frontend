import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const footerLinks = {
  Explore: [
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Shortlet", href: "/shortlet" },
    { label: "New Developments", href: "/new-developments" },
    { label: "Find Agent", href: "/find-agent" },
  ],
  Services: [
    { label: "Service Loop", href: "/services" },
    { label: "Plumbing", href: "/services" },
    { label: "Electrical", href: "/services" },
    { label: "Cleaning", href: "/services" },
    { label: "Building", href: "/services" },
    { label: "Materials", href: "/marketplace" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Escrow Policy", href: "/legal/escrow-policy" },
    { label: "Agent Agreement", href: "/legal/agent-agreement" },
  ],
};

const Footer = () => {
  return (
    <footer className="w-full px-6 md:px-12 lg:px-20 pt-16 pb-8 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Main footer card */}
        <div className="bg-white/60 backdrop-blur-sm border border-border-light rounded-3xladow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 sm:p-10 lg:p-14">
          {/* Top — logo + links grid */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Brand column */}
            <div className="lg:w-70 shrink-0">
              <img className="w-30" src={Logo} alt="PropertyLoop" />
              <p className="text-text-secondary text-sm leading-relaxed mt-4 max-w-xs">
                From first search to signed contract — and everything that
                happens after the keys are handed over.
              </p>
              {/* Social placeholder */}
              <div className="flex gap-3 mt-6">
                {["X", "IG", "LI", "FB"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-border-light flex items-center justify-center text-text-subtle text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Links grid */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([heading, links]) => (
                <div key={heading}>
                  <h4 className="font-heading font-bold text-primary-dark text-sm mb-4">
                    {heading}
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {links.map((link) => (
                      <li key={link.label}>
                        {link.href.startsWith("/") ? (
                          <Link
                            to={link.href}
                            className="text-text-secondary text-sm hover:text-primary transition-colors"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            className="text-text-secondary text-sm hover:text-primary transition-colors"
                          >
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border-light mt-10 mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-subtle text-xs">
              &copy; {new Date().getFullYear()} PropertyLoop. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6 text-text-subtle text-xs">
              <Link to="/legal/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link to="/legal/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link to="/legal/privacy" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

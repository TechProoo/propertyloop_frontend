import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const footerLinks = {
  Explore: [
    { label: "Buy", href: "#" },
    { label: "Rent", href: "#" },
    { label: "Shortlet", href: "#" },
    { label: "New Developments", href: "#" },
    { label: "Find Agent", href: "#" },
  ],
  Services: [
    { label: "Service Loop", href: "#" },
    { label: "Plumbing", href: "#" },
    { label: "Electrical", href: "#" },
    { label: "Cleaning", href: "#" },
    { label: "Building", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Escrow Policy", href: "#" },
    { label: "Agent Agreement", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="w-full px-6 md:px-12 lg:px-20 pt-16 pb-8 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Main footer card */}
        <div className="bg-white/60 backdrop-blur-sm border border-border-light rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 sm:p-10 lg:p-14">
          {/* Top — logo + links grid */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Brand column */}
            <div className="lg:w-[280px] shrink-0">
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
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

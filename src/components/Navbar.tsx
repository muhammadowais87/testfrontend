import { useState, useEffect } from "react";
import { Menu, X, LogIn, UserCheck, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Register Now", href: "/#pricing" },
  { label: "Subjects", href: "/#courses" },
  { label: "Contact Us", href: "/#query-form" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHashNavigation = (href: string, event?: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.includes("#")) {
      return;
    }

    const [path, hash] = href.split("#");
    if (path && path !== "/") {
      return;
    }

    const targetId = hash?.trim();
    if (!targetId || window.location.pathname !== "/") {
      return;
    }

    if (targetId === "pricing") {
      event?.preventDefault();
      window.dispatchEvent(new CustomEvent("open-registration-modal"));
      return;
    }

    const element = document.getElementById(targetId);
    if (!element) {
      return;
    }

    event?.preventDefault();
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return false;
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b border-gray-300 ${
      scrolled
        ? "bg-background/95 backdrop-blur-lg shadow-sm"
        : "bg-background/80 backdrop-blur-md"
    }`}>
      <div className="w-full px-4 md:px-8 py-2.5 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative">
            <img src="/images/phn.png" alt="Apex Test Solution" className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-foreground leading-tight">Apex Test</span>
            <span className="text-lg font-bold text-primary leading-tight"> Solution</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.href.includes("#") ? (
              <a
                key={link.label}
                href={link.href}
                className="relative text-xs font-semibold text-foreground/80 hover:text-primary transition-colors px-3.5 py-2 rounded-lg hover:bg-secondary/60 group"
                onClick={(event) => handleHashNavigation(link.href, event)}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-4/5" />
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`relative text-xs font-semibold transition-colors px-3.5 py-2 rounded-lg hover:bg-secondary/60 group ${
                  isActive(link.href) ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-primary rounded-full" />
                )}
                {!isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-4/5" />
                )}
              </Link>
            )
          )}

          <div className="h-5 w-px bg-border mx-2" />

          <div className="flex items-center gap-2">
            <Link
              to="/trial-account"
              className="inline-flex items-center gap-1.5 bg-yellow-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-600 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              Trial Account
            </Link>
            <Link
              to="/institute/login"
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <LogIn className="w-3.5 h-3.5" />
              Institute Login
            </Link>
            <Link
              to="/teacher/login"
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Teacher Login
            </Link>
          </div>
        </div>

        <button
          className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-primary/10 bg-background/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.href.includes("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-2.5 px-3 rounded-lg text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-secondary/60 transition-colors"
                  onClick={(event) => {
                    handleHashNavigation(link.href, event);
                    setOpen(false);
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`block py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    isActive(link.href) ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-secondary/60"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}

            <div className="h-px bg-border my-3" />

            <div className="space-y-2 pt-1">
              <Link
                to="/institute/login"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
                onClick={() => setOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Institute Login
              </Link>
              <Link
                to="/trial-account"
                className="flex items-center justify-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-yellow-600 transition-all active:scale-[0.98]"
                onClick={() => setOpen(false)}
              >
                Trial Account
              </Link>
              <Link
                to="/teacher/login"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
                onClick={() => setOpen(false)}
              >
                <UserCheck className="w-4 h-4" />
                Teacher Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>

  );
};

export default Navbar;

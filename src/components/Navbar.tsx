import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Register Now", href: "/#pricing" },
  { label: "Subjects", href: "/#courses" },
  { label: "Contact Us", href: "/#query-form" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

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

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-primary/10">
      <div className="w-full px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/images/phn.png" alt="Exam Sync" className="h-12 w-auto" />
          <span className="text-lg sm:text-xl font-bold text-foreground leading-none">Exam Sync</span>
        </Link>

        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          {navLinks.map((link) =>
            link.href.includes("#") ? (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
                onClick={(event) => handleHashNavigation(link.href, event)}
              >
                {link.label}
              </a>
            ) : link.href.startsWith("/") ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
              >
                {link.label}
              </a>
            )
          )}
          <div className="flex items-center gap-2">
            <Link
              to="/teacher/login"
              className="bg-secondary text-foreground border border-primary/15 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-colors"
            >
              Teacher Login
            </Link>
            <Link
              to="/portal-x9k7m/login"
              className="bg-secondary text-foreground border border-primary/15 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-colors"
            >
              Admin Login
            </Link>
            <Link
              to="/institute/login"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Institute Login
            </Link>
          </div>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-primary/10">
          <div className="w-full px-4 md:px-6 py-3">
            <div className="bg-card border border-primary/15 p-3">
              {navLinks.map((link) =>
                link.href.includes("#") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block py-2 px-3 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary"
                    onClick={(event) => {
                      handleHashNavigation(link.href, event);
                      setOpen(false);
                    }}
                  >
                    {link.label}
                  </a>
                ) : link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block py-2 px-3 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block py-2 px-3 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Link
                  to="/teacher/login"
                  className="inline-flex justify-center bg-secondary text-foreground border border-primary/15 px-5 py-2 rounded-lg text-sm font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Teacher Login
                </Link>
                <Link
                  to="/portal-x9k7m/login"
                  className="inline-flex justify-center bg-secondary text-foreground border border-primary/15 px-5 py-2 rounded-lg text-sm font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  to="/institute/login"
                  className="inline-flex justify-center bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Institute Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

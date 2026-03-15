import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, School, LogOut, ChevronLeft, ChevronRight, Shield, MessageSquare, UserCheck, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryStore } from "@/stores/queryStore";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/portal-x9k7m/dashboard", exact: true },
  { label: "Schools", icon: School, path: "/portal-x9k7m/dashboard", match: "/portal-x9k7m/school" },
  { label: "Individuals", icon: UserCheck, path: "/portal-x9k7m/teachers", match: "/portal-x9k7m/teacher" },
  { label: "Queries", icon: MessageSquare, path: "/portal-x9k7m/queries" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(true);
  const fetchQueries = useQueryStore((s) => s.fetchQueries);
  const unreadQueries = useQueryStore((s) => s.queries.filter((q) => !q.read).length);

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") === "true") {
      fetchQueries();
    }
  }, [fetchQueries]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    navigate("/portal-x9k7m/login");
  };

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-white leading-tight truncate">Exam Sync</p>
            <p className="text-[10px] text-white/50 truncate">Admin Portal</p>
          </div>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : (item.match ? location.pathname.startsWith(item.match) : location.pathname === item.path);
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {(!collapsed || isMobile) && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {(!collapsed || isMobile) && item.label === "Queries" && unreadQueries > 0 && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {unreadQueries}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-1 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/30 hover:text-white/60 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4 flex-shrink-0" /> : <ChevronLeft className="w-4 h-4 flex-shrink-0" />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-background flex">
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMobileOpen(false)}>
          <aside
            className="w-[260px] h-full bg-pts-dark flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <aside
          className={cn(
            "h-full bg-pts-dark flex flex-col border-r border-border/10 transition-all duration-300 z-50",
            collapsed ? "w-[68px]" : "w-[240px]"
          )}
        >
          {sidebarContent}
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 h-screen flex flex-col min-h-0 overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-14 sm:h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center px-4 sm:px-6 md:px-8 gap-3">
          {isMobile && (
            <button onClick={() => setMobileOpen(true)} className="text-foreground">
              <Menu className="w-5 h-5" />
            </button>
          )}
          {title && (
            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">{title}</h1>
              {subtitle && <p className="text-[11px] sm:text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

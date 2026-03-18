import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSavedPapers, deleteSavedPaper } from "@/lib/savedPapers";
import type { SavedPaperRecord } from "@/lib/savedPapers";
import {
  Menu, X, Home, LogOut, ClipboardList, FileText,
  GraduationCap, Building2, TrendingUp, Clock,
  BookOpen, Calendar, Sparkles, ChevronRight, ChevronLeft,
  Trash2, CreditCard, MoreVertical, Eye, Printer, Edit, Key, Settings, Save, EyeOff,
  Users, ArrowUp, ArrowRight, RotateCcw, Upload,
} from "lucide-react";
import { useTeacherSessionStore } from "@/stores/teacherSessionStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ActiveView = "dashboard" | "savedpapers" | "billing" | "settings" | "password";

type TeacherPortalProfile = {
  teacherId?: number;
  name: string;
  email?: string;
  schoolName: string | null;
  plan?: string;
  amount?: number;
  status?: string;
  subscriptionDate?: string;
  lastPaymentDate?: string;
  monthlyPayments?: Array<{
    month: string;
    monthLabel: string;
    plan: string;
    amount: number;
    status: string;
    paymentDate: string | null;
  }>;
  portalSettings?: Partial<{
    schoolName: string;
    schoolAddress: string;
    logoUrl: string;
    principalName: string;
    email: string;
    phone: string;
    monogramHeight: string;
    monogramWidth: string;
    schoolNameColor: string;
    footerColor: string;
    fontStyle: string;
    schoolNameSize: string;
    schoolNameStretch: string;
    footerSize: string;
    footerStretch: string;
    watermarkMode: string;
    watermarkHeight: string;
    watermarkWidth: string;
    watermarkOpacity: string;
    watermarkText: string;
  }>;
};

const TeacherDashboard = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [activeView, setActiveView] = useState<ActiveView>(
    (location.state as { activeView?: ActiveView } | null)?.activeView ?? "dashboard"
  );
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useTeacherSessionStore((s) => s.session);
  const logout = useTeacherSessionStore((s) => s.logout);
  const isSubUserPortal = session?.portalType === "sub-user";
  const basePath = isSubUserPortal ? "/sub-user" : "/teacher";
  const meEndpoint = isSubUserPortal ? "/teacher-auth/sub-user/me" : "/teacher-auth/me";
  const loginPath = "/teacher/login";
  const [profile, setProfile] = useState<TeacherPortalProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!session?.token) {
      navigate(loginPath);
      return;
    }

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await fetch(`${API_BASE_URL}${meEndpoint}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load teacher profile");
        }

        if (isSubUserPortal) {
          setProfile({
            teacherId: data.subUser?.subUserId,
            name: data.subUser?.name || session.name || "Sub User",
            email: data.subUser?.email || session.email || "",
            schoolName: data.subUser?.schoolName || session.schoolName,
            monthlyPayments: [],
          });
        } else {
          setProfile({
            teacherId: data.teacher?.teacherId,
            name: data.teacher?.name || session.name || "Teacher",
            email: data.teacher?.email || session.email || "",
            schoolName: session.schoolName,
            plan: data.teacher?.plan,
            amount: data.teacher?.amount,
            status: data.teacher?.status,
            subscriptionDate: data.teacher?.subscriptionDate,
            lastPaymentDate: data.teacher?.lastPaymentDate,
            monthlyPayments: Array.isArray(data.teacher?.monthlyPayments) ? data.teacher.monthlyPayments : [],
            portalSettings: data.teacher?.portalSettings || {},
          });
        }
      } catch (error) {
        toast({
          title: "Session Expired",
          description: error instanceof Error ? error.message : "Please login again",
          variant: "destructive",
        });
        logout();
        navigate(loginPath);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [session, navigate, logout, toast, loginPath, meEndpoint, isSubUserPortal]);

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    if (isMobile) setSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-4 rounded-xl bg-secondary/60 border border-border text-center">
        <div className="w-14 h-14 rounded-full bg-card mx-auto mb-2 flex items-center justify-center text-xl border border-border">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-bold text-foreground text-sm">{profile?.name || session?.name || "Teacher"}</h2>
        <p className="text-xs text-muted-foreground">{session?.schoolName || "Individual"}</p>
      </div>

      {!session?.schoolName && !isSubUserPortal && (
        <div className="mt-3 rounded-xl bg-primary text-primary-foreground p-3">
          <p className="text-[11px] uppercase tracking-wide opacity-70">Plan Status</p>
          <p className="text-lg font-extrabold">{profile?.status || "Pending"}</p>
          <p className="text-xs opacity-80">Since {profile?.subscriptionDate || "-"}</p>
        </div>
      )}

      <nav className="mt-4 space-y-0.5">
        <SidebarLink icon={<Home className="w-4 h-4" />} label="Dashboard" active={activeView === "dashboard"} onClick={() => handleNav("dashboard")} />
        <SidebarLink icon={<FileText className="w-4 h-4" />} label="Saved Papers" active={activeView === "savedpapers"} onClick={() => handleNav("savedpapers")} />
        {!session?.schoolName && !isSubUserPortal && (
          <>
            <SidebarLink icon={<CreditCard className="w-4 h-4" />} label="Billing" active={activeView === "billing"} onClick={() => handleNav("billing")} />
            <SidebarLink icon={<Settings className="w-4 h-4" />} label="Settings" active={activeView === "settings"} onClick={() => handleNav("settings")} />
            <SidebarLink icon={<Key className="w-4 h-4" />} label="Change Password" active={activeView === "password"} onClick={() => handleNav("password")} />
          </>
        )}
      </nav>

      <div className="mt-auto pt-3 border-t border-border">
        <SidebarLink icon={<LogOut className="w-4 h-4" />} label="Logout" onClick={() => { logout(); navigate(loginPath); }} />
      </div>
    </div>
  );

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background grid place-items-center">
        <p className="text-muted-foreground">Loading {isSubUserPortal ? "sub user" : "teacher"} portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="sticky top-0 z-40 bg-[hsl(var(--pts-dark))] w-full">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-primary-foreground">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <h1 className="text-base font-bold tracking-wide text-primary-foreground">EXAMSYNC</h1>
              <p className="text-xs text-primary-foreground/50">{isSubUserPortal ? "Sub User Portal" : "Teacher Portal"}</p>
            </div>
          </div>
          {session?.schoolName && (
            <div className="flex items-center gap-2 text-primary-foreground min-w-0">
              <Building2 className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold truncate">{session.schoolName}</span>
            </div>
          )}
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside className="w-[280px] h-full bg-card border-r border-border p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-3">
              <button onClick={() => setSidebarOpen(false)} className="text-foreground"><X size={20} /></button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {!isMobile && sidebarOpen && (
        <aside className="fixed left-0 top-[58px] bottom-0 z-30 w-[260px] bg-card border-r border-border overflow-y-auto p-4">
          {sidebarContent}
        </aside>
      )}

      <div className={`px-4 md:px-6 py-6 ${!isMobile && sidebarOpen ? "lg:ml-[260px]" : ""}`}>
        <main className="space-y-5 min-w-0 max-w-7xl mx-auto">
          {activeView !== "dashboard" && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveView("dashboard")}
                className="inline-flex items-center gap-1 rounded-lg bg-card border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          )}
          {activeView === "dashboard" && <DashboardHome session={profile || session} setActiveView={(v) => handleNav(v)} basePath={basePath} />}
          {activeView === "savedpapers" && <TeacherSavedPapersView />}
          {activeView === "billing" && <TeacherBillingView profile={profile} token={session?.token || ""} />}
          {activeView === "settings" && <TeacherSettingsView profile={profile} token={session?.token || ""} />}
          {activeView === "password" && <TeacherChangePasswordView token={session?.token || ""} isSubUserPortal={isSubUserPortal} />}
        </main>
      </div>
    </div>
  );
};

/* ── Dashboard Home ── */
const DashboardHome = ({
  session,
  setActiveView,
  basePath,
}: {
  session: { name: string; schoolName: string | null } | null;
  setActiveView: (v: ActiveView) => void;
  basePath: string;
}) => {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const recentPapers = useMemo(
    () => getSavedPapers().slice(0, 4).map((paper) => ({
      title: paper.title,
      class: paper.className,
      date: paper.date,
    })),
    []
  );

  return (
    <>
      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <p className="text-xs text-muted-foreground">{greeting()}</p>
        <h2 className="text-lg font-bold text-foreground mt-0.5">{session?.name || "Teacher"}</h2>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
          <Link
            to={`${basePath}/generate-paper`}
            className="flex items-center gap-4 rounded-xl bg-primary text-primary-foreground p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm">Generate Paper</h4>
              <p className="text-xs opacity-75">Select syllabus and create papers</p>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto opacity-60 shrink-0" />
          </Link>

          <button
            type="button"
            onClick={() => setActiveView("savedpapers")}
            className="w-full flex items-center gap-4 rounded-xl bg-card border border-border text-foreground p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm">Saved Papers</h4>
              <p className="text-xs text-muted-foreground">View and print saved papers</p>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground shrink-0" />
          </button>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Papers</h3>
          <div className="rounded-xl bg-card border border-border divide-y divide-border">
            {recentPapers.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 sm:p-4 hover:bg-secondary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">Class {p.class}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Calendar className="w-3.5 h-3.5 hidden sm:block" />
                  {p.date}
                </div>
              </div>
            ))}
            {recentPapers.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">No papers saved yet.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Teacher Saved Papers View ── */
const TeacherSavedPapersView = () => {
  const navigate = useNavigate();
  const teacherSession = useTeacherSessionStore((s) => s.session);
  const generatePaperPath = teacherSession?.portalType === "sub-user" ? "/sub-user/generate-paper" : "/teacher/generate-paper";
  const [search, setSearch] = useState("");
  const [teacherPapers, setTeacherPapers] = useState<SavedPaperRecord[]>([]);

  useEffect(() => {
    setTeacherPapers(getSavedPapers());
  }, []);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuPaperId, setOpenMenuPaperId] = useState<number | null>(null);
  const [menuBtnPos, setMenuBtnPos] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!openMenuPaperId) return;
    const close = () => { setOpenMenuPaperId(null); setMenuBtnPos(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenuPaperId]);

  const filtered = useMemo(
    () => teacherPapers.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase())
    ),
    [search, teacherPapers]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedPapers = filtered.slice(startIndex, startIndex + entriesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entries</span>
        </div>
        <input
          type="text"
          placeholder="Search papers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-56"
        />
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left py-3 px-3 sm:px-4 text-muted-foreground font-medium">#</th>
                <th className="text-left py-3 px-3 sm:px-4 text-muted-foreground font-medium">Paper Title</th>
                <th className="text-left py-3 px-3 sm:px-4 text-muted-foreground font-medium">Subject</th>
                <th className="text-left py-3 px-3 sm:px-4 text-muted-foreground font-medium">Class</th>
                <th className="text-left py-3 px-3 sm:px-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-3 sm:px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-3 px-3 sm:px-4 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">No papers found</td>
                </tr>
              ) : (
                paginatedPapers.map((p, i) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-3 sm:px-4 text-foreground">{startIndex + i + 1}</td>
                    <td className="py-3 px-3 sm:px-4 text-foreground font-medium">{p.title}</td>
                    <td className="py-3 px-3 sm:px-4 text-foreground">{p.subject}</td>
                    <td className="py-3 px-3 sm:px-4 text-foreground">{p.className}</td>
                    <td className="py-3 px-3 sm:px-4 text-muted-foreground">{p.date}</td>
                    <td className="py-3 px-3 sm:px-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Submitted
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (openMenuPaperId === p.id) {
                              setOpenMenuPaperId(null);
                              setMenuBtnPos(null);
                            } else {
                              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                              setOpenMenuPaperId(p.id);
                              setMenuBtnPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                            }
                          }}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuPaperId === p.id && menuBtnPos && (
                          <div
                            className="fixed min-w-44 rounded-lg border border-border bg-card shadow-md z-50 p-1"
                            style={{ top: menuBtnPos.top, right: menuBtnPos.right }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                navigate(`/teacher/saved-paper/${p.id}/view`, {
                                  state: { autoPrint: true, printMode: "single" },
                                });
                                setOpenMenuPaperId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary/70"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigate(`/teacher/saved-paper/${p.id}/view`);
                                setOpenMenuPaperId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary/70"
                            >
                              <Printer className="w-4 h-4" />
                              Single Print
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigate(`/teacher/saved-paper/${p.id}/view`, {
                                  state: { printMode: "double" },
                                });
                                setOpenMenuPaperId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary/70"
                            >
                              <Printer className="w-4 h-4" />
                              Double Print
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigate(`/teacher/saved-paper/${p.id}/view`, {
                                  state: { printMode: "half" },
                                });
                                setOpenMenuPaperId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary/70"
                            >
                              <Printer className="w-4 h-4" />
                              Half Print
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigate(generatePaperPath, {
                                  state: {
                                    editPaperId: p.id,
                                    openQuestionMenu: true,
                                  },
                                });
                                setOpenMenuPaperId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary/70"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Paper
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                deleteSavedPaper(p.id);
                                setTeacherPapers((prev) => prev.filter((item) => item.id !== p.id));
                                setOpenMenuPaperId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/70"
              >
                Prev
              </button>
              <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/70"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

type TeacherBillingHistoryItem = {
  id: number;
  month: string;
  date: string;
  amount: number;
  status: string;
};

const buildBillingHistoryFromProfile = (profile: TeacherPortalProfile | null): TeacherBillingHistoryItem[] => {
  const payments = profile?.monthlyPayments || [];
  if (!payments.length) return [];

  return payments
    .map((payment, index) => ({
      id: Number(`${payment.month.replace("-", "")}${index}`),
      month: payment.month,
      date: payment.paymentDate || payment.monthLabel,
      amount: payment.amount,
      status: payment.status,
    }))
    .reverse();
};

const TeacherBillingView = ({ profile, token }: { profile: TeacherPortalProfile | null; token: string }) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [history, setHistory] = useState<TeacherBillingHistoryItem[]>(() => buildBillingHistoryFromProfile(profile));

  useEffect(() => {
    setHistory(buildBillingHistoryFromProfile(profile));
  }, [profile]);

  const totalPaid = history.reduce((sum, item) => sum + item.amount, 0);
  const handleDeletePayment = async (item: TeacherBillingHistoryItem) => {
    if (!profile?.teacherId) {
      toast({ title: "Unavailable", description: "Teacher id missing.", variant: "destructive" });
      return;
    }

    setIsDeleting(item.id);
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${profile.teacherId}/payments/${encodeURIComponent(item.month)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete payment");
      }

      setHistory((prev) => prev.filter((entry) => entry.id !== item.id));
      toast({ title: "Payment Deleted" });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Could not delete payment",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-card border border-border p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Plan</p>
            <p className="text-xl font-bold text-foreground mt-1">{profile?.plan || "Basic"}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Valid Till</p>
            <p className="text-xl font-bold text-foreground mt-1">{profile?.subscriptionDate || "-"}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment Method</p>
            <p className="text-xl font-bold text-foreground mt-1">Direct</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Amount Paid</p>
            <p className="text-xl font-bold text-foreground mt-1">Rs. {totalPaid.toLocaleString()}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-foreground pt-2">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Amount</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">No payments found</td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="py-2 text-foreground">{item.date}</td>
                    <td className="py-2 text-foreground">Rs. {item.amount.toLocaleString()}</td>
                    <td className="py-2"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">{item.status}</span></td>
                    <td className="py-2">
                      <button
                        disabled={isDeleting === item.id}
                        type="button"
                        onClick={() => handleDeletePayment(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {isDeleting === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TeacherSettingsView = ({ profile, token }: { profile: TeacherPortalProfile | null; token: string }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSetting("logoUrl", reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const [settings, setSettings] = useState({
    schoolName: "The Hope Science Academy",
    schoolAddress: "247-E-1, (Opposite LDA School) Johar Town, Lahore. 0300-8194789, 0322-4157001",
    logoUrl: "",
    principalName: "Muhammad Ahmad",
    email: "admin@school.com",
    phone: "0300-8194789",
    monogramHeight: "50",
    monogramWidth: "50",
    schoolNameColor: "#000000",
    footerColor: "#000000",
    fontStyle: "Times New Roman",
    schoolNameSize: "20",
    schoolNameStretch: "1.4",
    footerSize: "10",
    footerStretch: "1",
    watermarkMode: "image",
    watermarkHeight: "200",
    watermarkWidth: "200",
    watermarkOpacity: "0.3",
    watermarkText: "THE HOPE SCIENCE ACADEMY",
  });

  const updateSetting = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (profile) {
      setSettings((prev) => ({
        ...prev,
        schoolName: profile.portalSettings?.schoolName || prev.schoolName,
        schoolAddress: profile.portalSettings?.schoolAddress || prev.schoolAddress,
        logoUrl: profile.portalSettings?.logoUrl || prev.logoUrl,
        principalName: profile.portalSettings?.principalName || prev.principalName,
        email: profile.portalSettings?.email || profile.email || prev.email,
        phone: profile.portalSettings?.phone || prev.phone,
        monogramHeight: profile.portalSettings?.monogramHeight || prev.monogramHeight,
        monogramWidth: profile.portalSettings?.monogramWidth || prev.monogramWidth,
        schoolNameColor: profile.portalSettings?.schoolNameColor || prev.schoolNameColor,
        footerColor: profile.portalSettings?.footerColor || prev.footerColor,
        fontStyle: profile.portalSettings?.fontStyle || prev.fontStyle,
        schoolNameSize: profile.portalSettings?.schoolNameSize || prev.schoolNameSize,
        schoolNameStretch: profile.portalSettings?.schoolNameStretch || prev.schoolNameStretch,
        footerSize: profile.portalSettings?.footerSize || prev.footerSize,
        footerStretch: profile.portalSettings?.footerStretch || prev.footerStretch,
        watermarkMode: profile.portalSettings?.watermarkMode || prev.watermarkMode,
        watermarkHeight: profile.portalSettings?.watermarkHeight || prev.watermarkHeight,
        watermarkWidth: profile.portalSettings?.watermarkWidth || prev.watermarkWidth,
        watermarkOpacity: profile.portalSettings?.watermarkOpacity || prev.watermarkOpacity,
        watermarkText: profile.portalSettings?.watermarkText || prev.watermarkText,
      }));
    }
  }, [profile]);

  const handleSaveSettings = async () => {
    if (!token) {
      toast({ title: "Session Expired", description: "Please login again.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-auth/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ portalSettings: settings }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to save settings");
      }

      toast({ title: "Settings Updated", description: "Teacher settings saved successfully." });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
  const compactInputClassName = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
        <div className="rounded-xl border-2 border-dashed border-slate-400 bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
            <div className="flex items-start justify-start">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="School monogram"
                  className="object-contain"
                  style={{ height: `${settings.monogramHeight}px`, width: `${settings.monogramWidth}px` }}
                />
              ) : (
                <div
                  className="grid place-items-center rounded-lg border border-slate-300 bg-slate-50 text-[10px] font-semibold text-slate-500"
                  style={{ height: `${settings.monogramHeight}px`, width: `${settings.monogramWidth}px` }}
                >
                  LOGO
                </div>
              )}
            </div>

            <div className="text-center pt-1">
              <div
                className="inline-block font-semibold leading-tight"
                style={{
                  color: settings.schoolNameColor,
                  fontFamily: settings.fontStyle,
                  fontSize: `${settings.schoolNameSize}px`,
                  transform: `scaleX(${settings.schoolNameStretch})`,
                  transformOrigin: "center",
                }}
              >
                {settings.schoolName}
              </div>
              <p
                className="mt-1 leading-tight"
                style={{
                  color: settings.footerColor,
                  fontFamily: settings.fontStyle,
                  fontSize: `${settings.footerSize}px`,
                  transform: `scaleX(${settings.footerStretch})`,
                  transformOrigin: "center",
                }}
              >
                {settings.schoolAddress}
              </p>
            </div>

            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Monogram Height</label>
            <div className="relative">
              <ArrowUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="number" value={settings.monogramHeight} onChange={(e) => updateSetting("monogramHeight", e.target.value)} className={`${compactInputClassName} pl-10 text-center`} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">School Name Font Color</label>
            <div className="flex gap-2">
              <input type="color" value={settings.schoolNameColor} onChange={(e) => updateSetting("schoolNameColor", e.target.value)} className="h-11 w-16 rounded-lg border border-border bg-background p-1" />
              <input type="text" value={settings.schoolNameColor} onChange={(e) => updateSetting("schoolNameColor", e.target.value)} className={compactInputClassName} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Footer Font Color</label>
            <div className="flex gap-2">
              <input type="color" value={settings.footerColor} onChange={(e) => updateSetting("footerColor", e.target.value)} className="h-11 w-16 rounded-lg border border-border bg-background p-1" />
              <input type="text" value={settings.footerColor} onChange={(e) => updateSetting("footerColor", e.target.value)} className={compactInputClassName} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Select Font Style</label>
            <select value={settings.fontStyle} onChange={(e) => updateSetting("fontStyle", e.target.value)} className={compactInputClassName}>
              <option>Times New Roman</option>
              <option>Georgia</option>
              <option>Garamond</option>
              <option>Cambria</option>
              <option>Verdana</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Monogram Width</label>
            <div className="relative">
              <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="number" value={settings.monogramWidth} onChange={(e) => updateSetting("monogramWidth", e.target.value)} className={`${compactInputClassName} pl-10 text-center`} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">School Name Font Size</label>
            <div className="relative">
              <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="number" value={settings.schoolNameSize} onChange={(e) => updateSetting("schoolNameSize", e.target.value)} className={`${compactInputClassName} pl-10`} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">School Name Font Stretch</label>
            <div className="relative">
              <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="number" step="0.1" value={settings.schoolNameStretch} onChange={(e) => updateSetting("schoolNameStretch", e.target.value)} className={`${compactInputClassName} pl-10`} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Footer Font Size</label>
            <div className="relative">
              <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="number" value={settings.footerSize} onChange={(e) => updateSetting("footerSize", e.target.value)} className={`${compactInputClassName} pl-10`} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Footer Font Stretch</label>
            <div className="relative">
              <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="number" step="0.1" value={settings.footerStretch} onChange={(e) => updateSetting("footerStretch", e.target.value)} className={`${compactInputClassName} pl-10`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2 border-t border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Institute Information</h3>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1.5">School Name</label>
              <input type="text" value={settings.schoolName} onChange={(e) => updateSetting("schoolName", e.target.value)} className={inputClassName} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1.5">School Address</label>
              <input type="text" value={settings.schoolAddress} onChange={(e) => updateSetting("schoolAddress", e.target.value)} className={inputClassName} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1.5">School Monogram / Logo URL</label>
              <div className="flex gap-2 items-center">
                <input type="text" value={settings.logoUrl} onChange={(e) => updateSetting("logoUrl", e.target.value)} placeholder="Paste logo URL here" className={inputClassName + " flex-1"} />
                <button type="button" onClick={() => logoFileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap">
                  <Upload className="w-4 h-4" /> Browse
                </button>
                <input ref={logoFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFileChange} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Contact Details</h3>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1.5">Principal Name</label>
              <input type="text" value={settings.principalName} onChange={(e) => updateSetting("principalName", e.target.value)} className={inputClassName} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1.5">Email Address</label>
              <input type="email" value={settings.email} onChange={(e) => updateSetting("email", e.target.value)} className={inputClassName} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1.5">Phone Number</label>
              <input type="text" value={settings.phone} onChange={(e) => updateSetting("phone", e.target.value)} className={inputClassName} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button disabled={isSaving} type="button" onClick={handleSaveSettings} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            <Save className="w-4 h-4" />
            {isSaving ? "Updating..." : "Update Setting"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-slate-50">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-600">WATERMARK SETTINGS</h3>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-600">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" name="watermark-mode" checked={settings.watermarkMode === "image"} onChange={() => updateSetting("watermarkMode", "image")} className="h-4 w-4 accent-primary" />
              WATERMARK AS IMAGE
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" name="watermark-mode" checked={settings.watermarkMode === "text"} onChange={() => updateSetting("watermarkMode", "text")} className="h-4 w-4 accent-primary" />
              WATERMARK AS TEXT
            </label>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.2fr] gap-8 items-center">
            <div className="min-h-[280px] rounded-xl bg-slate-50 border border-border grid place-items-center overflow-hidden">
              {settings.watermarkMode === "image" ? (
                settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Watermark preview"
                    className="object-contain"
                    style={{
                      height: `${settings.watermarkHeight}px`,
                      width: `${settings.watermarkWidth}px`,
                      opacity: Number(settings.watermarkOpacity),
                    }}
                  />
                ) : (
                  <div
                    className="grid place-items-center rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50 text-slate-500 font-bold"
                    style={{
                      height: `${settings.watermarkHeight}px`,
                      width: `${settings.watermarkWidth}px`,
                      opacity: Number(settings.watermarkOpacity),
                    }}
                  >
                    WATERMARK
                  </div>
                )
              ) : (
                <div
                  className="text-center font-extrabold text-slate-500 px-6"
                  style={{
                    fontSize: "34px",
                    letterSpacing: "0.12em",
                    opacity: Number(settings.watermarkOpacity),
                    maxWidth: `${settings.watermarkWidth}px`,
                    lineHeight: 1.15,
                  }}
                >
                  {settings.watermarkText}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Monogram Height</label>
                <div className="relative">
                  <ArrowUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="number" value={settings.watermarkHeight} onChange={(e) => updateSetting("watermarkHeight", e.target.value)} className={`${compactInputClassName} pl-10 text-center`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Monogram Width</label>
                <div className="relative">
                  <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="number" value={settings.watermarkWidth} onChange={(e) => updateSetting("watermarkWidth", e.target.value)} className={`${compactInputClassName} pl-10 text-center`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Opacity (Visibility)</label>
                <div className="relative">
                  <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="number" step="0.1" min="0" max="1" value={settings.watermarkOpacity} onChange={(e) => updateSetting("watermarkOpacity", e.target.value)} className={`${compactInputClassName} pl-10 text-center`} />
                </div>
              </div>
              {settings.watermarkMode === "text" && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Watermark Text</label>
                  <input type="text" value={settings.watermarkText} onChange={(e) => updateSetting("watermarkText", e.target.value)} className={compactInputClassName} />
                </div>
              )}
              <div className="flex justify-end pt-2">
                <button disabled={isSaving} type="button" onClick={handleSaveSettings} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  <Save className="w-4 h-4" />
                  {isSaving ? "Updating..." : "Update Setting"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherChangePasswordView = ({ token, isSubUserPortal }: { token: string; isSubUserPortal: boolean }) => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill all password fields.", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "New password and confirm password must match.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isSubUserPortal
        ? `${API_BASE_URL}/teacher-auth/sub-user/change-password`
        : `${API_BASE_URL}/teacher-auth/change-password`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update password");
      }

      toast({ title: "Password Updated", description: "Your password has been updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-card border border-border p-4 sm:p-6 max-w-md space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Current Password</label>
          <div className="relative">
            <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type={showOld ? "text" : "password"} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter current password" />
            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">New Password</label>
          <div className="relative">
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={showNew ? "text" : "password"} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter new password" />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Confirm New Password</label>
          <div className="relative">
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showConfirm ? "text" : "password"} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Confirm new password" />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button disabled={isSubmitting} type="button" onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
          <Save className="w-4 h-4" />
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${active ? "text-primary bg-secondary" : "text-foreground hover:text-primary hover:bg-secondary"}`}
  >
    {icon}
    {label}
  </button>
);

export default TeacherDashboard;

import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  FileText,
  Key,
  LogOut,
  ClipboardList,
  Users,
  Settings,
  CalendarDays,
  CreditCard,
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Upload,
  ChevronLeft,
  MoreVertical,
  Printer,
  Edit,
  ArrowUp,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { allBoardSubjectOptions, boardSubjectsMap } from "@/data/subjectData";
import { deleteSavedPaper, getSavedPapers, type SavedPaperRecord } from "@/lib/savedPapers";
import { useInstituteSessionStore } from "@/stores/instituteSessionStore";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ActiveView = "dashboard" | "billing" | "password" | "settings" | "subusers" | "savedpapers";

type InstituteProfile = {
  schoolId: number;
  name: string;
  principalName: string;
  city: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  plan: string;
  amount: number;
  status: string;
  subscriptionDate: string;
  lastPaymentDate: string;
  teachers: number;
  monthlyPayments: Array<{
    month: string;
    monthLabel: string;
    plan: string;
    amount: number;
    status: string;
    paymentDate: string | null;
  }>;
  portalSettings?: Partial<{
    logoUrl: string;
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

const Dashboard = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { toast } = useToast();
  const session = useInstituteSessionStore((s) => s.session);
  const logout = useInstituteSessionStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>(() => location.state?.activeView ?? "dashboard");
  const [profile, setProfile] = useState<InstituteProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session?.token) {
      navigate("/institute/login");
      return;
    }

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await fetch(`${API_BASE_URL}/institute-auth/me`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Failed to load institute profile");
        }

        setProfile(data.institute || null);
      } catch (error) {
        toast({
          title: "Session Expired",
          description: error instanceof Error ? error.message : "Please login again",
          variant: "destructive",
        });
        logout();
        navigate("/institute/login");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [navigate, session, toast, logout]);

  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    if (isMobile) setSidebarOpen(false);
  };

  const savedPapersCount = useMemo(() => getSavedPapers().length, []);

  const quickStats = [
    { label: "Generated Papers", value: String(savedPapersCount), icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Saved Papers", value: String(savedPapersCount), icon: <FileText className="w-5 h-5" /> },
    { label: "Teachers", value: String(profile?.teachers ?? 0), icon: <Users className="w-5 h-5" /> },
    { label: "Since", value: profile?.subscriptionDate || "-", icon: <CalendarDays className="w-5 h-5" /> },
  ];

  const actionCards = [
    { title: "Generate Paper", subtitle: "Create a new exam paper", icon: <ClipboardList className="w-7 h-7" />, onClick: () => navigate("/dashboard/generate-paper") },
    { title: "Saved Papers", subtitle: "View and print saved papers", icon: <FileText className="w-7 h-7" />, onClick: () => handleNav("savedpapers") },
    { title: "Sub Users", subtitle: "Manage sub user accounts", icon: <Users className="w-7 h-7" />, onClick: () => handleNav("subusers") },
    { title: "Settings", subtitle: "Account and app settings", icon: <Settings className="w-7 h-7" />, onClick: () => handleNav("settings") },
  ];

  const recentActivity = useMemo(() => {
    return getSavedPapers()
      .slice(0, 5)
      .map((paper) => ({
        title: paper.title,
        meta: `${paper.subject} · Class ${paper.className}`,
        time: paper.date,
      }));
  }, []);

  const sidebarContent = (
    <>
      <div className="p-4 rounded-xl bg-secondary/60 border border-border text-center">
        <div className="w-14 h-14 rounded-full bg-card mx-auto mb-2 flex items-center justify-center text-xl border border-border">👤</div>
        <h2 className="font-bold text-foreground text-sm">{session?.name || "Institute"}</h2>
        <p className="text-xs text-muted-foreground">Administrator</p>
      </div>

      <div className="mt-3 rounded-xl bg-primary text-primary-foreground p-3">
        <p className="text-[11px] uppercase tracking-wide opacity-70">Plan Status</p>
        <p className="text-lg font-extrabold">{profile?.status || "Pending"}</p>
        <p className="text-xs opacity-80">Since {profile?.subscriptionDate || "-"}</p>
      </div>

      <nav className="mt-4 space-y-0.5">
        <SidebarLink icon={<Home className="w-4 h-4" />} label="Dashboard" active={activeView === "dashboard"} onClick={() => handleNav("dashboard")} />
        <SidebarLink icon={<CreditCard className="w-4 h-4" />} label="Billing" active={activeView === "billing"} onClick={() => handleNav("billing")} />
        <SidebarLink icon={<Settings className="w-4 h-4" />} label="Settings" active={activeView === "settings"} onClick={() => handleNav("settings")} />
        <SidebarLink icon={<Key className="w-4 h-4" />} label="Change Password" active={activeView === "password"} onClick={() => handleNav("password")} />
        
      
        <SidebarLink
          icon={<LogOut className="w-4 h-4" />}
          label="Logout"
          onClick={() => {
            logout();
            navigate("/institute/login");
          }}
        />
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {isLoadingProfile && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm grid place-items-center">
          <p className="text-muted-foreground">Loading institute portal...</p>
        </div>
      )}
      <header className="sticky top-0 z-40 bg-[hsl(var(--pts-dark))] w-full">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-primary-foreground">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <h1 className="text-base font-bold tracking-wide text-primary-foreground">EXAMSYNC</h1>
              <p className="text-xs text-primary-foreground/50">Version 10.0</p>
            </div>
          </div>
          <div className="text-right min-w-0">
            <p className="text-sm font-semibold text-primary-foreground truncate">{profile?.name || session?.name || "Institute Dashboard"}</p>
            <p className="text-xs text-primary-foreground/50 truncate hidden sm:block">{profile?.email || session?.email || ""}</p>
          </div>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {activeView === "billing" ? "Billing" : activeView === "password" ? "Change Password" : activeView === "settings" ? "Settings" : activeView === "subusers" ? "Sub Users" : "Saved Papers"}
              </h2>
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
          {activeView === "dashboard" && (
            <>
              <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {quickStats.map((item) => (
                  <div key={item.label} className="rounded-xl bg-card border border-border p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <span className="text-primary">{item.icon}</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {actionCards.map((card) => {
                  const content = (
                    <>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-secondary">
                        {card.icon}
                      </div>
                      <h3 className="text-base font-bold">{card.title}</h3>
                      <p className="text-xs opacity-75 mt-1">{card.subtitle}</p>
                    </>
                  );
                  const cls = "rounded-xl p-5 text-left transition-all hover:shadow-md hover:-translate-y-0.5 block bg-card text-foreground border border-border";

                  return <button key={card.title} type="button" className={cls} onClick={card.onClick}>{content}</button>;
                })}
              </section>

              <section className="rounded-xl bg-card border border-border p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Recent Activity</h3>
                  </div>
                  <div className="space-y-2.5">
                    {recentActivity.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">No recent activity yet. Generate a paper to get started.</p>
                    ) : recentActivity.map((item) => (
                      <div key={item.title} className="rounded-lg border border-border bg-secondary/30 px-3.5 py-3 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.meta}</p>
                        </div>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

            </>
          )}

          {activeView === "billing" && <BillingView profile={profile} token={session?.token || ""} />}
          {activeView === "password" && <ChangePasswordView token={session?.token || ""} />}
          {activeView === "settings" && <SettingsView profile={profile} token={session?.token || ""} />}
          {activeView === "subusers" && <SubUsersView token={session?.token || ""} />}
          {activeView === "savedpapers" && <SavedPapersView />}
        </main>
      </div>
    </div>
  );
};

/* ── Sidebar Link ── */
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

/* ── Billing View ── */
type BillingHistoryItem = {
  id: number;
  month: string;
  date: string;
  amount: number;
  status: string;
};

const buildBillingHistory = (profile: InstituteProfile | null): BillingHistoryItem[] => {
  const payments = profile?.monthlyPayments || [];
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

const BillingView = ({ profile, token }: { profile: InstituteProfile | null; token: string }) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [history, setHistory] = useState<BillingHistoryItem[]>(() => buildBillingHistory(profile));

  useEffect(() => {
    setHistory(buildBillingHistory(profile));
  }, [profile]);

  const totalPaid = history.reduce((sum, item) => sum + item.amount, 0);

  const handleDeletePayment = async (item: BillingHistoryItem) => {
    if (!profile?.schoolId) {
      toast({ title: "Unavailable", description: "School id missing.", variant: "destructive" });
      return;
    }

    setIsDeleting(item.id);
    try {
      const response = await fetch(`${API_BASE_URL}/schools/${profile.schoolId}/payments/${encodeURIComponent(item.month)}`, {
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
            <p className="text-xl font-bold text-foreground mt-1">Bank Transfer</p>
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

/* ── Change Password View ── */
const ChangePasswordView = ({ token }: { token: string }) => {
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
      const response = await fetch(`${API_BASE_URL}/institute-auth/change-password`, {
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

/* ── Settings View ── */
const SettingsView = ({ profile, token }: { profile: InstituteProfile | null; token: string }) => {
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
    schoolAddress: "247-E-1, (Opposite LDA School) Johar Town, Lahore",
    logoUrl: "",
    principalName: "Muhammad Ahmad",
    email: "admin@school.com",
    phonePrimary: "0300-8194789",
    phoneSecondary: "0322-4157001",
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
        schoolName: profile.name || prev.schoolName,
        schoolAddress: profile.address || prev.schoolAddress,
        principalName: profile.principalName || prev.principalName,
        email: profile.email || prev.email,
        phonePrimary: profile.phonePrimary || prev.phonePrimary,
        phoneSecondary: profile.phoneSecondary || prev.phoneSecondary,
        logoUrl: profile.portalSettings?.logoUrl ?? prev.logoUrl,
        monogramHeight: profile.portalSettings?.monogramHeight ?? prev.monogramHeight,
        monogramWidth: profile.portalSettings?.monogramWidth ?? prev.monogramWidth,
        schoolNameColor: profile.portalSettings?.schoolNameColor ?? prev.schoolNameColor,
        footerColor: profile.portalSettings?.footerColor ?? prev.footerColor,
        fontStyle: profile.portalSettings?.fontStyle ?? prev.fontStyle,
        schoolNameSize: profile.portalSettings?.schoolNameSize ?? prev.schoolNameSize,
        schoolNameStretch: profile.portalSettings?.schoolNameStretch ?? prev.schoolNameStretch,
        footerSize: profile.portalSettings?.footerSize ?? prev.footerSize,
        footerStretch: profile.portalSettings?.footerStretch ?? prev.footerStretch,
        watermarkMode: profile.portalSettings?.watermarkMode ?? prev.watermarkMode,
        watermarkHeight: profile.portalSettings?.watermarkHeight ?? prev.watermarkHeight,
        watermarkWidth: profile.portalSettings?.watermarkWidth ?? prev.watermarkWidth,
        watermarkOpacity: profile.portalSettings?.watermarkOpacity ?? prev.watermarkOpacity,
        watermarkText: profile.portalSettings?.watermarkText ?? prev.watermarkText,
      }));
    }
  }, [profile]);

  const previewAddressLine = [
    settings.schoolAddress,
    [settings.phonePrimary, settings.phoneSecondary].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(". ");

  const previewPrincipalLine = settings.principalName
    ? `Principal: ${settings.principalName}`
    : "";

  const handleSaveSettings = async () => {
    if (!token) {
      toast({ title: "Session Expired", description: "Please login again.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/institute-auth/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schoolName: settings.schoolName,
          schoolAddress: settings.schoolAddress,
          principalName: settings.principalName,
          email: settings.email,
          phonePrimary: settings.phonePrimary,
          phoneSecondary: settings.phoneSecondary,
          portalSettings: {
            logoUrl: settings.logoUrl,
            monogramHeight: settings.monogramHeight,
            monogramWidth: settings.monogramWidth,
            schoolNameColor: settings.schoolNameColor,
            footerColor: settings.footerColor,
            fontStyle: settings.fontStyle,
            schoolNameSize: settings.schoolNameSize,
            schoolNameStretch: settings.schoolNameStretch,
            footerSize: settings.footerSize,
            footerStretch: settings.footerStretch,
            watermarkMode: settings.watermarkMode,
            watermarkHeight: settings.watermarkHeight,
            watermarkWidth: settings.watermarkWidth,
            watermarkOpacity: settings.watermarkOpacity,
            watermarkText: settings.watermarkText,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to save settings");
      }

      toast({ title: "Settings Updated", description: "Institute settings saved successfully." });
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
                {previewAddressLine}
              </p>
              {previewPrincipalLine && (
                <p
                  className="mt-1 leading-tight"
                  style={{
                    color: settings.footerColor,
                    fontFamily: settings.fontStyle,
                    fontSize: `${Math.max(Number(settings.footerSize) - 1, 9)}px`,
                    transform: `scaleX(${settings.footerStretch})`,
                    transformOrigin: "center",
                  }}
                >
                  {previewPrincipalLine}
                </p>
              )}
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
              <input type="text" value={settings.phonePrimary} onChange={(e) => updateSetting("phonePrimary", e.target.value)} className={inputClassName} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1.5">Phone Number 2</label>
              <input type="text" value={settings.phoneSecondary} onChange={(e) => updateSetting("phoneSecondary", e.target.value)} className={inputClassName} />
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
/* ── Saved Papers View ── */
type SavedPaper = {
  id: number;
  title: string;
  subject: string;
  class: string;
  board: string;
  teacherName: string;
  date: string;
};



const mapSavedPaperRecordToTablePaper = (paper: SavedPaperRecord): SavedPaper => ({
  id: paper.id,
  title: paper.title,
  subject: paper.subject,
  class: paper.className,
  board: paper.board,
  teacherName: paper.teacherName,
  date: paper.date,
});

const SavedPapersView = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>(() =>
    getSavedPapers().map(mapSavedPaperRecordToTablePaper)
  );
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuPaperId, setOpenMenuPaperId] = useState<number | null>(null);
  const [menuBtnPos, setMenuBtnPos] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    setSavedPapers(getSavedPapers().map(mapSavedPaperRecordToTablePaper));
  }, []);

  useEffect(() => {
    if (!openMenuPaperId) return;
    const close = () => { setOpenMenuPaperId(null); setMenuBtnPos(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenuPaperId]);

  const filtered = useMemo(
    () => savedPapers.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase())
    ),
    [search, savedPapers]
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
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">#</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Paper Title</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Class</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Board</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Teacher</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">No papers found</td>
                </tr>
              ) : (
                paginatedPapers.map((p, i) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-foreground">{startIndex + i + 1}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{p.title}</td>
                    <td className="py-3 px-4 text-foreground">{p.subject}</td>
                    <td className="py-3 px-4 text-foreground">{p.class}</td>
                    <td className="py-3 px-4 text-foreground">{p.board}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.teacherName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.date}</td>
                    <td className="py-3 px-4">
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
                                navigate(`/dashboard/saved-paper/${p.id}/view`);
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
                                setSavedPapers((prev) => prev.filter((item) => item.id !== p.id));
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

/* ── Sub Users View ── */
type SubUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  assignedSubjects: string[];
  isActive: boolean;
};

const SubUsersView = ({ token }: { token: string }) => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [openMenuSubUserId, setOpenMenuSubUserId] = useState<number | null>(null);
  const [subUserMenuBtnPos, setSubUserMenuBtnPos] = useState<{ top: number; right: number } | null>(null);
  const [assignSubUserId, setAssignSubUserId] = useState<number | null>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [modalSubjectSearch, setModalSubjectSearch] = useState("");
  const [editingSubUserId, setEditingSubUserId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", password: "" });
  const [formAssignedSubjects, setFormAssignedSubjects] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadSubUsers = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/institute-auth/sub-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to load sub users");
      }
      setSubUsers(Array.isArray(data?.subUsers) ? data.subUsers : []);
    } catch (error) {
      toast({
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Could not load sub users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubUsers();
  }, [token]);

  const filtered = useMemo(
    () => subUsers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())),
    [search, subUsers]
  );

  useEffect(() => {
    if (!openMenuSubUserId) return;
    const close = () => { setOpenMenuSubUserId(null); setSubUserMenuBtnPos(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenuSubUserId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedSubUsers = filtered.slice(startIndex, startIndex + entriesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const assignSubUser = useMemo(
    () => subUsers.find((t) => t.id === assignSubUserId) || null,
    [assignSubUserId, subUsers]
  );

  const classSubjectGroups = useMemo(
    () => Object.entries(boardSubjectsMap).flatMap(([board, classMap]) =>
      Object.entries(classMap).map(([className, groups]) => {
        const subjects = Array.from(new Set(groups.flatMap((group) => group.map((item) => item.title))));
        return { board, className, subjects };
      })
    ),
    []
  );

  const visibleClassSubjectGroups = useMemo(
    () => classSubjectGroups.map((group) => ({
      ...group,
      subjects: group.subjects.filter((subject) => subject.toLowerCase().includes(subjectSearch.toLowerCase())),
    })).filter((group) => group.subjects.length > 0),
    [classSubjectGroups, subjectSearch]
  );

  const visibleModalSubjectOptions = useMemo(
    () => allBoardSubjectOptions.filter((opt) => opt.label.toLowerCase().includes(modalSubjectSearch.toLowerCase())),
    [modalSubjectSearch]
  );

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    else if (subUsers.some((t) => t.email.toLowerCase() === form.email.trim().toLowerCase() && t.id !== editingSubUserId)) errs.email = "Email already exists";
    if (!form.subject.trim() && formAssignedSubjects.length === 0) errs.subject = "Subject is required";
    if (editingSubUserId === null && !form.password.trim()) errs.password = "Password is required";
    else if (form.password.trim() && form.password.length < 6) errs.password = "Min 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetModalState = () => {
    setForm({ name: "", email: "", phone: "", subject: "", password: "" });
    setFormAssignedSubjects([]);
    setModalSubjectSearch("");
    setErrors({});
    setEditingSubUserId(null);
    setModalOpen(false);
  };

  const handleOpenAdd = () => {
    setEditingSubUserId(null);
    setForm({ name: "", email: "", phone: "", subject: "", password: "" });
    setFormAssignedSubjects([]);
    setModalSubjectSearch("");
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (subUser: SubUser) => {
    setEditingSubUserId(subUser.id);
    setForm({
      name: subUser.name,
      email: subUser.email,
      phone: subUser.phone,
      subject: subUser.subject,
      password: "",
    });
    setFormAssignedSubjects(subUser.assignedSubjects?.length ? subUser.assignedSubjects : (subUser.subject ? [subUser.subject] : []));
    setModalSubjectSearch("");
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenAssignSubjects = (subUserId: number) => {
    setOpenMenuSubUserId(null);
    setAssignSubUserId(subUserId);
    setSubjectSearch("");
  };

  const toggleSubUserSubject = async (subUserId: number, subject: string) => {
    const target = subUsers.find((item) => item.id === subUserId);
    if (!target) {
      return;
    }

    const exists = target.assignedSubjects.includes(subject);
    const nextSubjects = exists
      ? target.assignedSubjects.filter((s) => s !== subject)
      : [...target.assignedSubjects, subject];

    const normalized = nextSubjects.length ? nextSubjects : [target.subject];

    try {
      const response = await fetch(`${API_BASE_URL}/institute-auth/sub-users/${subUserId}/subjects`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjects: normalized }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to assign subjects");
      }

      if (data?.subUser) {
        setSubUsers((prev) => prev.map((item) => (item.id === subUserId ? data.subUser : item)));
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not assign subjects",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (subUser: SubUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/institute-auth/sub-users/${subUser.id}/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !subUser.isActive }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update account status");
      }

      if (data?.subUser) {
        setSubUsers((prev) => prev.map((item) => (item.id === subUser.id ? data.subUser : item)));
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update status",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSaving(true);

    const normalizedAssignedSubjects = formAssignedSubjects.length
      ? formAssignedSubjects
      : (form.subject.trim() ? [form.subject.trim()] : []);
    const primarySubject = form.subject.trim() || normalizedAssignedSubjects[0] || "";

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: primarySubject,
      assignedSubjects: normalizedAssignedSubjects,
      ...(form.password.trim() ? { password: form.password } : {}),
    };

    try {
      if (editingSubUserId !== null) {
        const response = await fetch(`${API_BASE_URL}/institute-auth/sub-users/${editingSubUserId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Failed to update sub user");
        }

        if (data?.subUser) {
          setSubUsers((prev) => prev.map((item) => (item.id === editingSubUserId ? data.subUser : item)));
        }

        toast({ title: "Sub User Updated" });
      } else {
        const response = await fetch(`${API_BASE_URL}/institute-auth/sub-users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Failed to create sub user");
        }

        if (data?.subUser) {
          setSubUsers((prev) => [data.subUser, ...prev]);
        }

        toast({ title: "Sub User Added" });
      }

      resetModalState();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Could not save sub user",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (assignSubUser) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setAssignSubUserId(null);
                setSubjectSearch("");
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Sub Users
            </button>
            <h3 className="text-xl font-bold text-foreground">Assign Subjects: {assignSubUser.name}</h3>
            <p className="text-sm text-muted-foreground">Selected: {assignSubUser.assignedSubjects.length}</p>
          </div>

          <input
            type="text"
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
            placeholder="Search subjects..."
          />
        </div>

        {visibleClassSubjectGroups.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-8 text-center text-muted-foreground">No subjects found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleClassSubjectGroups.map((group) => (
              <div key={`${group.board}-${group.className}`} className="rounded-xl bg-card border border-border p-4">
                <h4 className="text-base font-bold text-destructive mb-2">{group.className} ({group.board})</h4>
                <ul className="space-y-1.5">
                  {group.subjects.map((subject) => {
                    const checked = assignSubUser.assignedSubjects.includes(subject);
                    return (
                      <li key={subject} className="text-sm text-foreground flex items-center gap-2">
                        <span className="text-muted-foreground">•</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSubUserSubject(assignSubUser.id, subject)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>{subject}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="rounded-xl bg-card border border-border p-6 text-center text-muted-foreground">Loading sub users...</div>
      )}

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
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search sub users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex-1 sm:w-56"
          />
          <button
            type="button"
            onClick={handleOpenAdd}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 sm:px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Add Sub User</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">#</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Account</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">No sub users found</td>
                </tr>
              ) : (
                paginatedSubUsers.map((t, i) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-foreground">{startIndex + i + 1}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{t.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{t.email}</td>
                    <td className="py-3 px-4 text-muted-foreground">{t.phone}</td>
                    <td className="py-3 px-4 text-foreground">{t.subject}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={t.isActive ?? true}
                          onCheckedChange={() => handleToggleActive(t)}
                          aria-label={`Toggle ${t.name} status`}
                        />
                        <span className={`text-xs font-medium ${(t.isActive ?? true) ? "text-primary" : "text-muted-foreground"}`}>
                          {(t.isActive ?? true) ? "Active" : "Non-Active"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (openMenuSubUserId === t.id) {
                              setOpenMenuSubUserId(null);
                              setSubUserMenuBtnPos(null);
                            } else {
                              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                              setOpenMenuSubUserId(t.id);
                              setSubUserMenuBtnPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                            }
                          }}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuSubUserId === t.id && subUserMenuBtnPos && (
                          <div
                            className="fixed min-w-40 rounded-lg border border-border bg-card shadow-md z-50 p-1"
                            style={{ top: subUserMenuBtnPos.top, right: subUserMenuBtnPos.right }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenEdit(t);
                                setOpenMenuSubUserId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary/70"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenAssignSubjects(t.id)}
                              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary/70"
                            >
                              Assign Subjects
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`${API_BASE_URL}/institute-auth/sub-users/${t.id}`, {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  });
                                  const data = await response.json();
                                  if (!response.ok) {
                                    throw new Error(data?.message || "Failed to delete sub user");
                                  }

                                  setSubUsers((prev) => prev.filter((x) => x.id !== t.id));
                                  setOpenMenuSubUserId(null);
                                  toast({ title: "Sub User Deleted" });
                                } catch (error) {
                                  toast({
                                    title: "Delete Failed",
                                    description: error instanceof Error ? error.message : "Could not delete sub user",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10"
                            >
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

      {/* Add Teacher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={resetModalState}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-primary px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-foreground">{editingSubUserId !== null ? "Update Sub User" : "Add New Sub User"}</h3>
              <button type="button" onClick={resetModalState} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Ahmad Ali"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. ahmad@school.com"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 03XX-XXXXXXX"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Primary subject (e.g. Mathematics)"
                />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Assign Subjects</label>
                <input
                  type="text"
                  value={modalSubjectSearch}
                  onChange={(e) => setModalSubjectSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                  placeholder="Search subjects..."
                />
                <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-background px-3 py-2.5 space-y-2">
                  {visibleModalSubjectOptions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No subjects found</p>
                  ) : (
                    visibleModalSubjectOptions.map((opt) => {
                      const checked = formAssignedSubjects.includes(opt.value);
                      return (
                        <label key={opt.value} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setFormAssignedSubjects((prev) => (
                                checked
                                  ? prev.filter((item) => item !== opt.value)
                                  : [...prev, opt.value]
                              ));
                            }}
                            className="h-4 w-4 accent-primary"
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Selected: {formAssignedSubjects.length}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={editingSubUserId !== null ? "Leave blank to keep current" : "Min 6 characters"}
                />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>
              <button
                disabled={isSaving}
                type="button"
                onClick={handleSubmit}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : editingSubUserId !== null ? "Update Sub User" : "Add Sub User"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;

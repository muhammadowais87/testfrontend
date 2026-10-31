import { Suspense, lazy, useState, useEffect } from "react";
import PageLoader from "@/components/PageLoader";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTeacherSessionStore } from "./stores/teacherSessionStore";
import { useInstituteSessionStore } from "./stores/instituteSessionStore";
import { loadAdminRoute } from "@/lib/adminRoute";

const Index = lazy(() => import("./pages/Index"));
const TrialAccount = lazy(() => import("./pages/TrialAccount"));
const InstituteLogin = lazy(() => import("./pages/InstituteLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const GeneratePaper = lazy(() => import("./pages/GeneratePaper"));
const TeacherLogin = lazy(() => import("./pages/TeacherLogin"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const TeacherGeneratePaper = lazy(() => import("./pages/TeacherGeneratePaper"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const SchoolDetail = lazy(() => import("./pages/SchoolDetail"));
const AddSchool = lazy(() => import("./pages/SchoolForm").then((m) => ({ default: m.AddSchool })));
const EditSchool = lazy(() => import("./pages/SchoolForm").then((m) => ({ default: m.EditSchool })));
const AdminQueries = lazy(() => import("./pages/AdminQueries"));
const AdminTeachers = lazy(() => import("./pages/AdminTeachers"));
const TeacherDetailAdmin = lazy(() => import("./pages/TeacherDetailAdmin"));
const AddTeacher = lazy(() => import("./pages/TeacherFormAdmin").then((m) => ({ default: m.AddTeacher })));
const EditTeacher = lazy(() => import("./pages/TeacherFormAdmin").then((m) => ({ default: m.EditTeacher })));
const QueryPage = lazy(() => import("./pages/QueryPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SavedPaperViewer = lazy(() => import("./pages/SavedPaperViewer"));

const queryClient = new QueryClient();

const PageFallback = () => <PageLoader />;

const TeacherProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const session = useTeacherSessionStore((s) => s.session);
  if (!session?.token || session.portalType !== "teacher") {
    return <Navigate to="/teacher/login" replace />;
  }
  return children;
};

const SubUserProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const session = useTeacherSessionStore((s) => s.session);
  if (!session?.token || session.portalType !== "sub-user") {
    return <Navigate to="/teacher/login" replace />;
  }
  return children;
};

const TeacherGuestRoute = ({ children }: { children: JSX.Element }) => {
  const session = useTeacherSessionStore((s) => s.session);
  if (session?.token) {
    return <Navigate to={session.portalType === "sub-user" ? "/sub-user/dashboard" : "/teacher/dashboard"} replace />;
  }
  return children;
};

const InstituteProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const session = useInstituteSessionStore((s) => s.session);
  if (!session?.token) {
    return <Navigate to="/institute/login" replace />;
  }
  return children;
};

const InstituteGuestRoute = ({ children }: { children: JSX.Element }) => {
  const session = useInstituteSessionStore((s) => s.session);
  if (session?.token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Background-load admin route — doesn't block rendering
void loadAdminRoute();

const AppContent = () => {
  const [adminRoute, setAdminRoute] = useState<string | null>(null);

  useEffect(() => {
    loadAdminRoute().then(() => {
      import("@/lib/adminRoute").then((m) => setAdminRoute(m.getAdminRoute()));
    });
  }, []);

  const p = (path: string) => `/${adminRoute ?? "admin"}${path}`;

  return (
    <Routes>
      <Route path="/" element={<Suspense fallback={<PageFallback />}><Index /></Suspense>} />
      <Route path="/query" element={<Suspense fallback={<PageFallback />}><QueryPage /></Suspense>} />
      <Route path="/trial-account" element={<Suspense fallback={<PageFallback />}><TrialAccount /></Suspense>} />
      <Route path="/institute/login" element={<InstituteGuestRoute><Suspense fallback={<PageFallback />}><InstituteLogin /></Suspense></InstituteGuestRoute>} />
      <Route path="/dashboard" element={<InstituteProtectedRoute><Suspense fallback={<PageFallback />}><Dashboard /></Suspense></InstituteProtectedRoute>} />
      <Route path="/dashboard/generate-paper" element={<InstituteProtectedRoute><Suspense fallback={<PageFallback />}><GeneratePaper /></Suspense></InstituteProtectedRoute>} />
      <Route path="/dashboard/saved-paper/:id/view" element={<Suspense fallback={<PageFallback />}><SavedPaperViewer /></Suspense>} />
      <Route path="/teacher/saved-paper/:id/view" element={<Suspense fallback={<PageFallback />}><SavedPaperViewer /></Suspense>} />
      <Route path="/teacher/login" element={<TeacherGuestRoute><Suspense fallback={<PageFallback />}><TeacherLogin /></Suspense></TeacherGuestRoute>} />
      <Route path="/teacher/dashboard" element={<TeacherProtectedRoute><Suspense fallback={<PageFallback />}><TeacherDashboard /></Suspense></TeacherProtectedRoute>} />
      <Route path="/teacher/generate-paper" element={<TeacherProtectedRoute><Suspense fallback={<PageFallback />}><TeacherGeneratePaper /></Suspense></TeacherProtectedRoute>} />
      <Route path="/sub-user/dashboard" element={<SubUserProtectedRoute><Suspense fallback={<PageFallback />}><TeacherDashboard /></Suspense></SubUserProtectedRoute>} />
      <Route path="/sub-user/generate-paper" element={<SubUserProtectedRoute><Suspense fallback={<PageFallback />}><TeacherGeneratePaper /></Suspense></SubUserProtectedRoute>} />
      <Route path={p("/login")} element={<Suspense fallback={<PageFallback />}><AdminLogin /></Suspense>} />
      <Route path={p("/dashboard")} element={<Suspense fallback={<PageFallback />}><AdminDashboard /></Suspense>} />
      <Route path={p("/school/add")} element={<Suspense fallback={<PageFallback />}><AddSchool /></Suspense>} />
      <Route path={p("/school/:id")} element={<Suspense fallback={<PageFallback />}><SchoolDetail /></Suspense>} />
      <Route path={p("/school/:id/edit")} element={<Suspense fallback={<PageFallback />}><EditSchool /></Suspense>} />
      <Route path={p("/queries")} element={<Suspense fallback={<PageFallback />}><AdminQueries /></Suspense>} />
      <Route path={p("/teachers")} element={<Suspense fallback={<PageFallback />}><AdminTeachers /></Suspense>} />
      <Route path={p("/teacher/add")} element={<Suspense fallback={<PageFallback />}><AddTeacher /></Suspense>} />
      <Route path={p("/teacher/:id")} element={<Suspense fallback={<PageFallback />}><TeacherDetailAdmin /></Suspense>} />
      <Route path={p("/teacher/:id/edit")} element={<Suspense fallback={<PageFallback />}><EditTeacher /></Suspense>} />
      <Route path="*" element={<Suspense fallback={<PageFallback />}><NotFound /></Suspense>} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

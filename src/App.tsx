import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import TrialAccount from "./pages/TrialAccount";
import InstituteLogin from "./pages/InstituteLogin";
import Dashboard from "./pages/Dashboard";
import GeneratePaper from "./pages/GeneratePaper";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherGeneratePaper from "./pages/TeacherGeneratePaper";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDetail from "./pages/SchoolDetail";
import { AddSchool, EditSchool } from "./pages/SchoolForm";
import AdminQueries from "./pages/AdminQueries";
import AdminTeachers from "./pages/AdminTeachers";
import TeacherDetailAdmin from "./pages/TeacherDetailAdmin";
import { AddTeacher, EditTeacher } from "./pages/TeacherFormAdmin";
import QueryPage from "./pages/QueryPage";
import NotFound from "./pages/NotFound";
import SavedPaperViewer from "./pages/SavedPaperViewer";
import { useTeacherSessionStore } from "./stores/teacherSessionStore";
import { useInstituteSessionStore } from "./stores/instituteSessionStore";

const queryClient = new QueryClient();

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/trial-account" element={<TrialAccount />} />
          <Route path="/institute/login" element={<InstituteGuestRoute><InstituteLogin /></InstituteGuestRoute>} />
          <Route path="/dashboard" element={<InstituteProtectedRoute><Dashboard /></InstituteProtectedRoute>} />
          <Route path="/dashboard/generate-paper" element={<InstituteProtectedRoute><GeneratePaper /></InstituteProtectedRoute>} />
          <Route path="/dashboard/saved-paper/:id/view" element={<SavedPaperViewer />} />
          <Route path="/teacher/saved-paper/:id/view" element={<SavedPaperViewer />} />
          <Route path="/teacher/login" element={<TeacherGuestRoute><TeacherLogin /></TeacherGuestRoute>} />
          <Route path="/teacher/dashboard" element={<TeacherProtectedRoute><TeacherDashboard /></TeacherProtectedRoute>} />
          <Route path="/teacher/generate-paper" element={<TeacherProtectedRoute><TeacherGeneratePaper /></TeacherProtectedRoute>} />
          <Route path="/sub-user/dashboard" element={<SubUserProtectedRoute><TeacherDashboard /></SubUserProtectedRoute>} />
          <Route path="/sub-user/generate-paper" element={<SubUserProtectedRoute><TeacherGeneratePaper /></SubUserProtectedRoute>} />
          <Route path="/portal-x9k7m/login" element={<AdminLogin />} />
          <Route path="/portal-x9k7m/dashboard" element={<AdminDashboard />} />
          <Route path="/portal-x9k7m/school/add" element={<AddSchool />} />
          <Route path="/portal-x9k7m/school/:id" element={<SchoolDetail />} />
          <Route path="/portal-x9k7m/school/:id/edit" element={<EditSchool />} />
          <Route path="/portal-x9k7m/queries" element={<AdminQueries />} />
          <Route path="/portal-x9k7m/teachers" element={<AdminTeachers />} />
          <Route path="/portal-x9k7m/teacher/add" element={<AddTeacher />} />
          <Route path="/portal-x9k7m/teacher/:id" element={<TeacherDetailAdmin />} />
          <Route path="/portal-x9k7m/teacher/:id/edit" element={<EditTeacher />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

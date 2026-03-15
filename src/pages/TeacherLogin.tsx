import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowRight, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTeacherSessionStore } from "@/stores/teacherSessionStore";
import { API_BASE_URL } from "@/lib/api";

const TeacherLogin = () => {
  const navigate = useNavigate();
  const login = useTeacherSessionStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/teacher-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Login failed");
        return;
      }

      login({
        name: data.teacher?.name || data.subUser?.name || "Teacher",
        email: data.teacher?.email || data.subUser?.email || "",
        schoolName: data.accountType === "sub-user" ? (data.subUser?.schoolName || "Institute") : null,
        token: data.token,
        portalType: data.accountType === "sub-user" ? "sub-user" : "teacher",
      });

      navigate(data.accountType === "sub-user" ? "/sub-user/dashboard" : "/teacher/dashboard");
    } catch (_err) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Login</h1>
          <p className="text-muted-foreground text-sm mb-8">Login with credentials provided by your institute</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-background px-1 text-xs text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-md px-4 py-3 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-background px-1 text-xs text-muted-foreground">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-md px-4 py-3 pr-10 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Forgot Password ?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-opacity"
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;

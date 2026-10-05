import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminRoute } from "@/lib/adminRoute";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const googlebotMeta = document.querySelector('meta[name="googlebot"]') as HTMLMetaElement | null;

    const previousRobots = robotsMeta?.getAttribute("content") ?? null;
    const previousGooglebot = googlebotMeta?.getAttribute("content") ?? null;

    const injectedRobotsMeta = !robotsMeta ? document.createElement("meta") : null;
    const injectedGooglebotMeta = !googlebotMeta ? document.createElement("meta") : null;

    const robotsTarget = robotsMeta ?? injectedRobotsMeta;
    const googlebotTarget = googlebotMeta ?? injectedGooglebotMeta;

    if (robotsTarget) {
      robotsTarget.setAttribute("name", "robots");
      robotsTarget.setAttribute("content", "noindex, nofollow, noarchive");
      if (injectedRobotsMeta) {
        document.head.appendChild(injectedRobotsMeta);
      }
    }

    if (googlebotTarget) {
      googlebotTarget.setAttribute("name", "googlebot");
      googlebotTarget.setAttribute("content", "noindex, nofollow, noarchive");
      if (injectedGooglebotMeta) {
        document.head.appendChild(injectedGooglebotMeta);
      }
    }

    return () => {
      if (injectedRobotsMeta) {
        injectedRobotsMeta.remove();
      } else if (robotsMeta && previousRobots) {
        robotsMeta.setAttribute("content", previousRobots);
      }

      if (injectedGooglebotMeta) {
        injectedGooglebotMeta.remove();
      } else if (googlebotMeta && previousGooglebot) {
        googlebotMeta.setAttribute("content", previousGooglebot);
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_name", data.admin.name);
      localStorage.setItem("admin_email", data.admin.email);
      navigate(`/${getAdminRoute()}/dashboard`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Apex Test Solution</h1>
          <p className="text-sm text-muted-foreground">Admin Portal — Sign in to continue</p>
        </div>

        {/* Card */}
        <Card className="border-border shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">Email</Label>
                <Input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@apextestsolution.com" required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-foreground">Password</Label>
                <Input
                  id="password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 gap-2 text-sm font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground">
          Protected area · Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

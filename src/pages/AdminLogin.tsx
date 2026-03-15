import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      localStorage.setItem("admin_logged_in", "true");
      navigate("/portal-x9k7m/dashboard");
    } else {
      setError("Email and password are required");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Exam Sync</h1>
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
                  placeholder="admin@examsync.com" required
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
              <Button type="submit" className="w-full h-11 gap-2 text-sm font-semibold">
                <Lock className="w-4 h-4" />
                Sign In
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

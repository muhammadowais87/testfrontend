import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowRight, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

const TrialAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-md text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground text-sm mb-8">Login form for active users</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
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

            {/* Forgot password */}
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Forgot Password ?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-pts-green hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-opacity"
            >
              LOGIN
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrialAccount;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInstituteSessionStore } from "@/stores/instituteSessionStore";

const TrialAccount = () => {
  const navigate = useNavigate();
  const login = useInstituteSessionStore((s) => s.login);

  useEffect(() => {
    login({
      name: "Trial User",
      email: "trial@apextestsolution.com",
      city: "Trial",
      address: "",
      token: "trial_" + Date.now(),
    });
    navigate("/dashboard?trial=true", { replace: true });
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Setting up trial account...</p>
    </div>
  );
};

export default TrialAccount;

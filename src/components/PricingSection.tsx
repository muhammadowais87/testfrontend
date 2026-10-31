import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Sparkles } from "lucide-react";

const packages = [
  { name: "Package-1", price: "Rs:2,000", validity: "1 month", popular: false },
  { name: "Package-2", price: "Rs:3,000", validity: "3 months", popular: false },
  { name: "Package-3", price: "Rs:6,000", validity: "6 months", popular: true },
  { name: "Package-4", price: "Rs:12,000", validity: "1 year", popular: false },
];

const features = [
  "Save Unlimited Papers",
  "All Subjects Access",
  "Unlimited Sub Accounts",
  "Download Unlimited Papers",
  "Seperate teachers portal",
  "Full Intime Support",
];

const PricingSection = () => {
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    const openModal = () => setRegistrationOpen(true);
    window.addEventListener("open-registration-modal", openModal);

    return () => {
      window.removeEventListener("open-registration-modal", openModal);
    };
  }, []);

  return (
    <>
      <section id="pricing" className="py-6 md:py-8 bg-secondary/35">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-6">
            <h2 className="pts-section-title">Simple, Transparent Pricing</h2>
            <p className="pts-section-subtitle">Choose the duration that fits your school workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {packages.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-6 transition-all duration-300 flex flex-col relative ${
                  pkg.popular
                    ? "bg-primary text-primary-foreground shadow-xl scale-[1.02] md:scale-105 z-10"
                    : "bg-card text-foreground shadow-sm border border-primary/15 hover:shadow-lg"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}

                <p className={`text-xs uppercase tracking-wide mb-1 ${pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>Plan</p>
                <h3 className={`text-xl font-bold ${pkg.popular ? "text-white" : "text-foreground"}`}>{pkg.name}</h3>
                <div className="mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-extrabold ${pkg.popular ? "text-white" : "text-foreground"}`}>{pkg.price}</span>
                    <span className={`text-lg font-medium ${pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>/{pkg.validity}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 my-6 text-left flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        pkg.popular ? "bg-white/20" : "bg-primary/10"
                      }`}>
                        <Check className={`w-3 h-3 ${pkg.popular ? "text-white" : "text-primary"}`} />
                      </div>
                      <span className={pkg.popular ? "text-primary-foreground/90" : "text-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setRegistrationOpen(true)}
                  className={`w-full px-5 py-2.5 rounded-lg font-semibold text-sm text-center transition-all ${
                    pkg.popular
                      ? "bg-white text-primary hover:bg-white/90 shadow-md"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
         <DialogContent className="max-w-4xl w-[95vw] sm:w-[92vw] p-0 gap-0 overflow-hidden bg-card border border-border rounded-2xl max-h-[90vh]">
          <DialogHeader className="bg-gradient-to-r from-primary to-emerald-600 px-4 sm:px-5 py-3 sm:py-4">
            <DialogTitle className="text-primary-foreground text-lg sm:text-2xl font-semibold">Registration Procedure</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-4 lg:px-6 lg:py-6">
              <h3 className="text-primary text-base sm:text-xl font-semibold text-center mb-3">Registration Requirements</h3>
              <ul className="space-y-1.5 text-sm sm:text-base text-foreground">
                <li>→ Institute Name</li>
                <li>→ Institute Address</li>
                <li>→ Institute Monogram</li>
                <li>→ Principal Name</li>
                <li>→ Principal Number</li>
                <li>→ Email Address</li>
              </ul>

              <div className="mt-4 space-y-1 text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                <p>Whatsapp the above info on 03127049445</p>
                <p>Account registration process will be start after transaction.</p>
                <p>2 hours will be required for account proceeding.</p>
              </div>
            </div>

            <div className="px-4 py-4 lg:px-6 lg:py-6 border-t lg:border-t-0 lg:border-l border-border">
              <h3 className="text-primary text-base sm:text-xl font-semibold text-center mb-3">Payment Methods</h3>

              <div className="space-y-1 text-sm sm:text-base text-foreground">
                <p className="font-bold">Jazzcash</p>
                <p>Account Number: 03264917496</p>
                <p>Account Title: Muhammad Awais</p>
              </div>

              <div className="h-px bg-border my-3" />

              <div className="space-y-1 text-sm sm:text-base text-foreground">
                <p className="font-bold">Nayapay</p>
                <p>Account Number: 03264917496</p>
                <p>Account Title: Muhammad Owais</p>
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PricingSection;

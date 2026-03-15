import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const packages = [
  { name: "Package-1", price: "Rs:6000", validity: "3 months" },
  { name: "Package-2", price: "Rs:10000", validity: "6 months" },
  { name: "Package-3", price: "Rs:12000", validity: "1 year" },
];

const features = [
  "Generate Unlimited Papers",
  "Save Unlimited Papers",
  // "Download PastPapers",
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
      <section id="pricing" className="py-14 md:py-16 bg-secondary/35">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 rounded-2xl bg-card border border-primary/15 p-6 shadow-sm h-fit">
            <h2 className="text-2xl font-bold text-foreground">Pricing Plans</h2>
            <p className="text-sm text-muted-foreground mt-2">Choose the duration that fits your school workflow.</p>
            <ul className="mt-5 space-y-2">
              {features.slice(0, 5).map((f) => (
                <li key={f} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {packages.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-6 transition-all duration-300 flex flex-col ${
                  i === 1
                    ? "bg-primary text-primary-foreground shadow-xl"
                    : "bg-card text-foreground shadow-sm border border-primary/15"
                }`}
              >
                <p className={`text-xs uppercase tracking-wide mb-2 ${i === 1 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>Plan</p>
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                <p className="text-3xl font-extrabold mt-3">{pkg.price}</p>
                <p className={`text-sm mt-1 ${i === 1 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{pkg.validity} validity</p>

                <ul className="space-y-2 my-6 text-left flex-1">
                  {features.slice(0, 6).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setRegistrationOpen(true)}
                  className={`inline-block px-5 py-2.5 rounded-lg font-semibold text-sm text-center transition-colors ${
                    i === 1
                      ? "bg-primary-foreground text-primary hover:opacity-90"
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
          <DialogHeader className="bg-primary px-4 sm:px-5 py-3 sm:py-4">
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
                <p>Whatsapp the above info on 03264917496</p>
                <p>Account registration process will be start after transaction.</p>
                <p>2 hours will be required for account proceeding.</p>
              </div>
            </div>

            <div className="px-4 py-4 lg:px-6 lg:py-6 border-t lg:border-t-0 lg:border-l border-border">
              <h3 className="text-primary text-base sm:text-xl font-semibold text-center mb-3">Payment Methods</h3>

              <div className="space-y-1 text-sm sm:text-base text-foreground">
                <p className="font-bold">Easypaisa</p>
                <p>Account Number: 03264917496</p>
                <p>Account Title: Muhammad Owais</p>
              </div>

              <div className="h-px bg-border my-3" />

              <div className="space-y-1 text-sm sm:text-base text-foreground">
                <p className="font-bold">Jazzcash</p>
                <p>Account Number: 03127049445</p>
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

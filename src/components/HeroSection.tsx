import { Phone } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative overflow-hidden py-12 md:py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-secondary to-transparent -z-10" />

      <div className="container mx-auto max-w-6xl">
        <div className="rounded-3xl bg-card border border-primary/15 shadow-sm p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  Smarter Papers,<br />
                  Better Results
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground">
                  Complete online paper generation system with board-wise patterns, fast output, and teacher-friendly controls.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="https://wa.me/03264917496" className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 border border-primary/10">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-primary/15">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">WhatsApp Support</p>
                    <p className="text-sm font-semibold text-foreground">0326-4917496</p>
                  </div>
                </a>
                <a href="tel:03127049445" className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 border border-primary/10">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-primary/15">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Call Direct</p>
                    <p className="text-sm font-semibold text-foreground">0312-7049445</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-secondary/70 rounded-2xl p-5 border border-primary/10">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Live Activity</p>
                <p className="text-2xl font-bold text-foreground mt-1">5000+ Teachers Visit Daily</p>
              </div>

              <div className="bg-card rounded-2xl p-4 border border-primary/15 shadow-sm">
                <img src="/images/banner-icon-1.png" alt="icon" className="w-10 h-10 mb-3" />
                <p className="font-semibold text-foreground">Learning Platform</p>
                <p className="text-xs text-muted-foreground mt-1">Largest digital test support system</p>
              </div>

              <div className="bg-primary rounded-2xl p-4 text-primary-foreground shadow-sm">
                <img src="/images/banner-icon-2.png" alt="icon" className="w-10 h-10 mb-3" />
                <p className="font-semibold">Board + Class Ready</p>
                <p className="text-xs text-primary-foreground/85 mt-1">From primary to intermediate levels</p>
              </div>

              <div className="col-span-2 bg-card rounded-2xl p-5 border border-primary/15 shadow-sm">
                <p className="font-semibold text-foreground">Instant Coverage</p>
                <p className="text-sm text-muted-foreground mt-1">PTB, AFAQ, Oxford, Gohar and more content structures in one platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

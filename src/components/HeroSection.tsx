import { Phone, MessageCircle, Users, Layers, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative overflow-hidden pt-4 pb-8 md:pt-6 md:pb-12 lg:pt-8 lg:pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-background -z-10" />
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute -bottom-20 left-0 w-[400px] h-[400px] bg-secondary/60 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto max-w-6xl">
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground">
                  Apex Test Solution:<br />
                  <span className="text-primary">Smarter Papers, Better Results</span>
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  Pakistan's digital paper generation platform for schools, academies and teachers. Complete board-wise paper generation with fast output and teacher-friendly controls.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="https://wa.me/03264917496" className="flex items-center gap-3 bg-secondary/80 hover:bg-secondary rounded-xl px-4 py-3 border border-primary/10 hover:border-primary/25 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-primary/15">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">WhatsApp Support</p>
                    <p className="text-sm font-semibold text-foreground">0326-4917496</p>
                  </div>
                </a>
                <a href="tel:03127049445" className="flex items-center gap-3 bg-secondary/80 hover:bg-secondary rounded-xl px-4 py-3 border border-primary/10 hover:border-primary/25 transition-all group">
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
              <div className="col-span-2 bg-gradient-to-r from-primary/10 via-secondary/60 to-secondary/30 rounded-2xl p-5 border border-primary/10">
                <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" /> Live Activity
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">500+ Teachers Visit Daily</p>
              </div>

              <div className="bg-card rounded-2xl p-4 border border-primary/10 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <img src="/images/banner-icon-1.png" alt="icon" className="w-6 h-6" />
                </div>
                <p className="font-semibold text-foreground">Learning Platform</p>
                <p className="text-xs text-muted-foreground mt-1">Largest digital test support system</p>
              </div>

              <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-2xl p-4 text-primary-foreground shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-6 -mt-6" />
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3 backdrop-blur-sm">
                  <img src="/images/banner-icon-2.png" alt="icon" className="w-6 h-6 brightness-0 invert" />
                </div>
                <p className="font-semibold">Board + Class Ready</p>
                <p className="text-xs text-primary-foreground/85 mt-1">From primary to intermediate levels</p>
              </div>

              <div className="col-span-2 bg-card rounded-2xl p-5 border border-primary/10 shadow-sm">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" /> Instant Coverage
                </p>
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

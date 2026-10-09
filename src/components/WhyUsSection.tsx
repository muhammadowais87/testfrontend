import { Check, Zap, Shield, Users, Clock, FileText, Layers, Headphones } from "lucide-react";

const features = [
  { icon: Zap, text: "Full automatic system", color: "from-amber-500 to-orange-600" },
  { icon: Shield, text: "According to board pattern", color: "from-green-500 to-emerald-600" },
  { icon: FileText, text: "Manual editing mode", color: "from-blue-500 to-cyan-600" },
  { icon: Clock, text: "Last 5 years pastpapers data", color: "from-purple-500 to-indigo-600" },
  { icon: Layers, text: "Topic and chapters selection", color: "from-rose-500 to-pink-600" },
  { icon: Users, text: "Seperate teachers portal", color: "from-teal-500 to-cyan-600" },
  { icon: Shield, text: "Save unlimited papers into account", color: "from-emerald-500 to-teal-600" },
  { icon: Headphones, text: "Intime telephonic support", color: "from-indigo-500 to-purple-600" },
];

const WhyUsSection = () => {
  return (
    <section className="py-14 md:py-16 bg-gradient-to-b from-secondary to-secondary/65">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Apex Test Solution works better</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Built for teachers who need speed, control and board accuracy.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-primary to-emerald-700 text-primary-foreground p-6 md:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-6 -mb-6" />
            <img src="/images/WhyUs.png" alt="Why Apex Test Solution" className="w-full max-w-[200px] mx-auto mb-5 relative" />
            <p className="text-sm text-primary-foreground/90 leading-relaxed relative">Complete automation with manual flexibility so teachers can generate papers exactly the way they want.</p>
            <div className="mt-5 pt-4 border-t border-white/20 relative">
              <p className="text-xs text-primary-foreground/70">Trusted by 500+ teachers daily</p>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.text} className="rounded-2xl bg-card border border-primary/15 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-3 group">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground text-sm font-medium group-hover:text-primary transition-colors">{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;

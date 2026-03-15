import { Check } from "lucide-react";

const features = [
  "Full automatic system",
  "According to board pattern",
  "Manual editing mode",
  "Last 5 years pastpapers data",
  "Topic and chapters selection",
  "Seperate teachers portal",
  "Generate unlimited papers",
  "Save unlimited papers into account",
  "Intime telephonic support",
];

const WhyUsSection = () => {
  return (
    <section className="py-14 md:py-16 bg-gradient-to-b from-secondary to-secondary/65">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Exam Sync works better</h2>
          <p className="text-muted-foreground">Built for teachers who need speed, control and board accuracy.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 rounded-2xl bg-primary text-primary-foreground p-6 shadow-lg">
            <img src="/images/WhyUs.png" alt="Why Exam Sync" className="w-full max-w-[220px] mx-auto mb-4" />
            <p className="text-sm text-primary-foreground/90">Complete automation with manual flexibility so teachers can generate papers exactly the way they want.</p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f} className="rounded-2xl bg-card border border-primary/15 p-4 shadow-sm flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;

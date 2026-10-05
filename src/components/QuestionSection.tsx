import { BookOpen, FileText, Brain, RefreshCw, Lightbulb, Languages } from "lucide-react";

const mediums = [
  { name: "Urdu Medium", icon: Languages, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { name: "English Medium", icon: Languages, color: "bg-blue-50 border-blue-200 text-blue-700" },
  { name: "Dual Medium", icon: Languages, color: "bg-purple-50 border-purple-200 text-purple-700" },
];

const types = [
  { name: "Exercise Questions", icon: BookOpen, color: "from-blue-500 to-blue-600" },
  { name: "Past Papers Questions", icon: FileText, color: "from-amber-500 to-orange-600" },
  { name: "Conceptual Questions", icon: Brain, color: "from-purple-500 to-indigo-600" },
  { name: "Review Questions", icon: RefreshCw, color: "from-teal-500 to-emerald-600" },
  { name: "Examples Questions", icon: Lightbulb, color: "from-rose-500 to-pink-600" },
];

const QuestionSection = () => {
  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-5">
          <h2 className="pts-section-title">Question Configuration</h2>
          <p className="pts-section-subtitle">Choose mediums and question types for your papers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-card rounded-2xl border border-primary/15 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Languages className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Question Mediums</h2>
            </div>
            <div className="space-y-3">
              {mediums.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.name} className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${m.color}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{m.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-card rounded-2xl border border-primary/15 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Question Types</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {types.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <div key={t.name} className="rounded-xl border border-primary/10 px-4 py-3 flex items-center gap-3 hover:border-primary/25 hover:bg-secondary/30 transition-all group">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center shadow-sm shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">Type {idx + 1}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionSection;

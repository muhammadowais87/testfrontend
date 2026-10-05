import { GraduationCap, Microscope, Monitor, Calculator, Globe } from "lucide-react";

const classes = [
  { name: "9th , 10th", icon: GraduationCap, desc: "Matric level", color: "from-emerald-500 to-teal-600" },
  { name: "FSc", icon: Microscope, desc: "Intermediate science", color: "from-blue-500 to-cyan-600" },
  { name: "ICS", icon: Monitor, desc: "Computer science", color: "from-purple-500 to-indigo-600" },
  { name: "I.COM", icon: Calculator, desc: "Commerce group", color: "from-orange-500 to-amber-600" },
  { name: "F.A", icon: Globe, desc: "Arts & humanities", color: "from-rose-500 to-pink-600" },
];

const ClassesSection = () => {
  return (
    <section className="py-6 md:py-8 bg-secondary/35">
      <div className="container mx-auto max-w-6xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1">
          <div>
            <h2 className="pts-section-title">Recommended Classes</h2>
            <p className="text-sm text-muted-foreground mt-1">Structured for secondary to intermediate levels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {classes.map((cls, idx) => {
            const Icon = cls.icon;
            return (
              <div key={cls.name} className="bg-card rounded-2xl border border-primary/15 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cls.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-lg text-foreground mt-4 group-hover:text-primary transition-colors">{cls.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{cls.desc}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-2">Board aligned syllabus support</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;

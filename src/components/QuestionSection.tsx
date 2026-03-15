const mediums = ["Urdu Medium", "English Medium", "Dual Medium"];
const types = ["Exercise Questions", "PastPapers Questions", "Conceptual Questions", "Review Questions", "Examples Questions"];

const QuestionSection = () => {
  return (
    <section className="py-14 md:py-16 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-card rounded-2xl border border-primary/15 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">Question Mediums</h2>
            <div className="space-y-3">
              {mediums.map((m) => (
                <div key={m} className="rounded-xl bg-secondary/80 border border-primary/10 px-4 py-3 text-sm font-semibold text-foreground">
                  {m}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-card rounded-2xl border border-primary/15 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">Question Types</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {types.map((t, idx) => (
                <div key={t} className="rounded-xl border border-primary/10 px-4 py-3 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-secondary text-primary text-xs font-bold grid place-items-center">{idx + 1}</span>
                  <p className="font-medium text-foreground text-sm">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionSection;

const classes = ["9th , 10th", "FSc", "ICS", "I.COM", "F.A"];

const ClassesSection = () => {
  return (
    <section className="py-14 md:py-16 bg-secondary/35">
      <div className="container mx-auto max-w-6xl space-y-7">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <h2 className="pts-section-title">Recommended Classes</h2>
          <p className="text-sm text-muted-foreground">Structured for secondary to intermediate levels</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {classes.map((cls, idx) => (
            <div key={cls} className="bg-card rounded-2xl border border-primary/15 p-5 shadow-sm">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-secondary text-primary font-bold text-sm">
                {idx + 1}
              </span>
              <p className="font-bold text-lg text-foreground mt-4">{cls}</p>
              <p className="text-xs text-muted-foreground mt-1">Board aligned syllabus support</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;

const SchoolSoftwareSection = () => {
  return (
    <section id="software" className="py-14 md:py-16 bg-gradient-to-b from-secondary/70 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="rounded-3xl bg-card border border-primary/15 p-6 md:p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Advanced School Management Software
            </h2>
            <p className="text-muted-foreground mb-5 max-w-2xl">
              Exam Sync also offers smart school software for attendance, fee, student records and reporting in one clean dashboard.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary">Attendance</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary">Fee Management</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary">Result Reports</span>
            </div>
          </div>

          <div className="bg-secondary/70 rounded-2xl p-6 border border-primary/15 text-center">
            <p className="text-sm text-muted-foreground">Price starting from</p>
            <p className="text-3xl font-extrabold text-primary mt-1">Rs:2000</p>
            <p className="text-sm text-muted-foreground">per month</p>
            <a href="#" className="inline-block mt-4 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold">
              Get Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolSoftwareSection;

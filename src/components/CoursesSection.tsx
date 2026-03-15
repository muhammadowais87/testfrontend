const courses = [
  { name: "PTB", range: "1st - 12th", logo: "/images/PTBLogo.png" },
  { name: "AFAQ", range: "1st - 7th", logo: "/images/AfaqLogo.png" },
  { name: "OXFORD", range: "1st - 5th", logo: "/images/OxfordLogo.png" },
  { name: "GOHAR", range: "1st - 5th", logo: "/images/GoharLogo.png" },
  { name: "FEDERAL", range: "comming soon", logo: "/images/FederalLogo.png" },
  { name: "B.A", range: "PU", logo: "/images/PULogo.png" },
];

const CoursesSection = () => {
  const featuredCourse = courses[0];
  const otherCourses = courses.slice(1);

  return (
    <section id="courses" className="py-14 md:py-16 bg-background">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="pts-section-title">Course Boards</h2>
          <p className="text-muted-foreground text-sm md:text-base">Pick your board and start paper generation in seconds.</p>
        </div>

        <div className="rounded-2xl bg-secondary/70 border border-primary/15 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={featuredCourse.logo} alt={featuredCourse.name} className="w-16 h-16 object-contain" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Most used board</p>
              <h3 className="text-2xl font-bold text-foreground">{featuredCourse.name}</h3>
              <p className="text-sm text-muted-foreground">Classes {featuredCourse.range}</p>
            </div>
          </div>
          <span className="inline-flex rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold w-fit">Top Choice</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {otherCourses.map((course) => (
            <div key={course.name} className="bg-card rounded-2xl border border-primary/10 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <img src={course.logo} alt={course.name} className="w-14 h-14 mx-auto mb-3 object-contain" />
              <h3 className="font-bold text-base text-foreground">{course.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{course.range}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;

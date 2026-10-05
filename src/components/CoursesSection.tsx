import { Star, BookOpen } from "lucide-react";

const courses = [
  { name: "PTB", range: "1st - 12th", logo: "/images/PTBLogo.png" },
  { name: "AFAQ", range: "1st - 7th", logo: "/images/AfaqLogo.png" },
  { name: "OXFORD", range: "1st - 5th", logo: "/images/OxfordLogo.png" },
  { name: "FEDERAL", range: "Coming Soon", logo: "/images/FederalLogo.png" },
  { name: "B.A", range: "PU", logo: "/images/PULogo.png" },
];

const CoursesSection = () => {
  const featuredCourse = courses[0];
  const otherCourses = courses.slice(1);

  return (
    <section id="courses" className="pt-2 pb-6 md:pt-4 md:pb-8 bg-background">
      <div className="container mx-auto max-w-6xl space-y-4">
        <div className="text-center">
          <h2 className="pts-section-title">Course Boards</h2>
          <p className="pts-section-subtitle">Pick your board and start paper generation in seconds.</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-secondary/80 to-secondary/40 border border-primary/15 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pts-card-hover">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <img src={featuredCourse.logo} alt={featuredCourse.name} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Most used board</p>
              <h3 className="text-2xl font-bold text-foreground">{featuredCourse.name}</h3>
              <p className="text-sm text-muted-foreground">Classes {featuredCourse.range}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold w-fit shadow-sm">
            <Star className="w-3 h-3" /> Top Choice
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {otherCourses.map((course) => (
            <div key={course.name} className="bg-card rounded-2xl border border-primary/10 p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                <img src={course.logo} alt={course.name} className="w-10 h-10 object-contain" />
              </div>
              <h3 className="font-bold text-base text-foreground">{course.name}</h3>
              <p className={`text-xs mt-1 ${course.range === "Coming Soon" ? "text-amber-500 font-medium" : "text-muted-foreground"}`}>
                {course.range === "Coming Soon" ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {course.range}
                  </span>
                ) : (
                  course.range
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;

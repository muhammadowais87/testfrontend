import { ArrowRight } from "lucide-react";
import type { SubjectCard } from "@/data/subjectData";

const isUrdu = (text: string) => /[\u0600-\u06FF]/.test(text);

const SubjectButton = ({ subject }: { subject: SubjectCard }) => (
  <button
    type="button"
    className="bg-card border border-border h-[120px] w-full flex items-center justify-between overflow-hidden hover:shadow-sm transition-shadow rounded-lg"
  >
    <img src={subject.image} alt={subject.title} className="w-24 h-full object-contain shrink-0 p-1" />
    <div className={`flex-1 text-center px-3 ${isUrdu(subject.title) ? "font-urdu" : ""}`} dir={isUrdu(subject.title) ? "rtl" : "ltr"}>
      <p className="text-xl font-bold text-foreground leading-tight">{subject.title}</p>
      <p className="text-base text-muted-foreground mt-1">{subject.subtitle}</p>
    </div>
    <div className="w-10 flex justify-center">
      {subject.showArrow ? <ArrowRight className="w-6 h-6 text-muted-foreground" /> : null}
    </div>
  </button>
);

export default SubjectButton;

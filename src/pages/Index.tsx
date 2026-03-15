import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import ClassesSection from "@/components/ClassesSection";
import QuestionSection from "@/components/QuestionSection";
import WhyUsSection from "@/components/WhyUsSection";
import PricingSection from "@/components/PricingSection";
import QueryForm from "@/components/QueryForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      <Navbar />
      <HeroSection />
      <CoursesSection />
      <ClassesSection />
      <QuestionSection />
      <WhyUsSection />
      <PricingSection />
      <QueryForm />
      <Footer />
    </div>
  );
};

export default Index;

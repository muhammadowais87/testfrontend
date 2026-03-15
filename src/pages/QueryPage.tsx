import Navbar from "@/components/Navbar";
import QueryForm from "@/components/QueryForm";
import Footer from "@/components/Footer";

const QueryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      <Navbar />
      <QueryForm />
      <Footer />
    </div>
  );
};

export default QueryPage;

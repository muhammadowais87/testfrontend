import { Phone, Mail, MapPin, MessageCircle, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="bg-pts-dark text-background py-12 relative">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="rounded-2xl border border-primary/25 bg-background/5 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3">
              Apex Test <span className="text-primary">Solution</span>
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Pakistan's digital paper generation platform for schools, academies and teachers.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm opacity-75">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Lahore, Pakistan</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li><a href="/" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary/50" /> Home</a></li>
              <li><a href="/#pricing" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary/50" /> Register Now</a></li>
              <li><a href="/#query-form" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary/50" /> Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] opacity-60">WhatsApp</p>
                  <span className="opacity-90">0326-4917496</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] opacity-60">Phone</p>
                  <span className="opacity-90">0312-7049445</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] opacity-60">Email</p>
                  <span className="opacity-90">mo733025@gmail.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-60">
          <p>© 2026 Apex Test Solution. All Rights Reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

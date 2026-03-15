import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-pts-dark text-background py-10">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-primary/25 bg-background/5 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-3">
              Exam <span className="text-primary">Sync</span>
            </h3>
            <p className="text-sm opacity-85">
              Pakistan's digital paper generation platform for schools, academies and teachers.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm opacity-80">
              <MapPin className="w-4 h-4" />
              <span>Lahore, Pakistan</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-85">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/#pricing" className="hover:text-primary transition-colors">Register Now</a></li>
              {/* <li><a href="/institute/login" className="hover:text-primary transition-colors">Past Papers</a></li> */}
              <li><a href="/#contact" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-3 text-sm opacity-85">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0326-4917496</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0312-7049445</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>mo733025@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm opacity-60">
          © 2026 Exam Sync. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

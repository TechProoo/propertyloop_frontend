import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-3xl mx-auto text-center py-24">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl font-heading font-bold text-primary">
              404
            </span>
          </div>
          <h1 className="font-heading font-bold text-primary-dark text-3xl sm:text-4xl mb-4">
            Page Not Found
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="h-11 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <Link
              to="/"
              className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

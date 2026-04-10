import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Briefcase, Bell } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ease = [0.23, 1, 0.32, 1] as const;

const JobDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/careers" className="hover:text-primary transition-colors">
              Careers
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Role</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-12 mb-20"
          >
            <button
              onClick={() => navigate("/careers")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Careers
            </button>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-9 h-9 text-primary" />
              </div>

              <h1 className="font-heading text-[1.8rem] sm:text-[2.4rem] font-bold text-primary-dark leading-tight tracking-tight">
                This role isn't open right now
              </h1>
              <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
                PropertyLoop has no jobs available at the moment. The role you
                were trying to view has either been filled or hasn't been
                posted yet. Check back soon — we're growing fast.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 text-left">
                <div className="bg-bg-accent rounded-2xl border border-border-light p-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    Get notified
                  </h3>
                  <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">
                    Drop us a note and we'll reach out the moment the next
                    role opens up.
                  </p>
                </div>
                <div className="bg-bg-accent rounded-2xl border border-border-light p-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    Explore PropertyLoop
                  </h3>
                  <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">
                    Learn about our mission, our team and what we're building
                    in Lagos.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
                <Link
                  to="/contact"
                  className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                >
                  Get in touch <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/careers"
                  className="h-11 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  Back to Careers
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;

import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Bell,
  MapPin,
  Clock,
  Banknote,
  Mail,
  Target,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { findJob } from "../data/jobs";

const ease = [0.23, 1, 0.32, 1] as const;

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const job = id ? findJob(id) : undefined;

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                to="/careers"
                className="hover:text-primary transition-colors"
              >
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
                  The role you were trying to view has either been filled or
                  hasn't been posted yet. Check back soon — we're growing fast.
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
  }

  const applyEmail = job.applyEmail || "careers@propertyloop.ng";
  const mailto = `mailto:${applyEmail}?subject=${encodeURIComponent(
    `Application — ${job.title}`,
  )}`;

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
            <span className="text-primary-dark font-medium">{job.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-12 mb-20"
          >
            <button
              onClick={() => navigate("/careers")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Careers
            </button>

            {/* Header */}
            <div className="mb-8">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                {job.dept}
              </p>
              <h1 className="font-heading text-[1.8rem] sm:text-[2.4rem] font-bold text-primary-dark leading-tight tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-3 mt-5 text-text-secondary text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-border-light">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-border-light">
                  <Briefcase className="w-3.5 h-3.5" />
                  {job.type}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-border-light">
                  <Clock className="w-3.5 h-3.5" />
                  {job.posted}
                </span>
                {job.salary && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    <Banknote className="w-3.5 h-3.5" />
                    {job.salary}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <p className="text-text-secondary text-sm sm:text-[15px] leading-relaxed mb-8">
                {job.description}
              </p>
            )}

            {/* Sections */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Section
                icon={<Target className="w-4 h-4" />}
                title="Key Responsibilities"
                items={job.responsibilities}
              />
            )}

            {job.successLooks && job.successLooks.length > 0 && (
              <Section
                icon={<Sparkles className="w-4 h-4" />}
                title="What Success Looks Like"
                items={job.successLooks}
              />
            )}

            {job.requirements && job.requirements.length > 0 && (
              <Section
                icon={<CheckCircle2 className="w-4 h-4" />}
                title="Requirements"
                items={job.requirements}
              />
            )}

            {job.whoWeWant && job.whoWeWant.length > 0 && (
              <Section
                icon={<Sparkles className="w-4 h-4" />}
                title="What We're Looking For"
                items={job.whoWeWant}
              />
            )}

            {/* Notes */}
            {job.notes && job.notes.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="text-amber-900 text-sm leading-relaxed">
                  {job.notes.map((n, i) => (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>
                      {n}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Apply card */}
            <div className="border-t border-border-light pt-8">
              <h3 className="font-heading font-bold text-primary-dark text-lg mb-2">
                How to Apply
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                Send your CV and a short note about why you're a great fit to{" "}
                <a
                  href={mailto}
                  className="text-primary font-medium hover:underline"
                >
                  {applyEmail}
                </a>
                .
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={mailto}
                  className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                >
                  <Mail className="w-4 h-4" />
                  Apply via email
                </a>
                <Link
                  to="/careers"
                  className="h-11 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center"
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

const Section = ({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h2 className="font-heading font-bold text-primary-dark text-lg">
        {title}
      </h2>
    </div>
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.25 shrink-0" />
          <span className="text-text-secondary text-sm sm:text-[15px] leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default JobDetail;

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Clock,
  Briefcase,
  Code,
  Palette,
  Megaphone,
  Settings,
  LayoutGrid,
  Heart,
  Globe,
  TrendingUp,
  Users,
  Lightbulb,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ease = [0.23, 1, 0.32, 1] as const;

const departments = ["All", "Engineering", "Product", "Marketing", "Operations", "Design"];

const jobs: { id: string; title: string; dept: string; location: string; type: string; posted: string }[] = [];

const deptIcons: Record<string, React.ReactNode> = {
  Engineering: <Code className="w-4 h-4" />,
  Product: <Lightbulb className="w-4 h-4" />,
  Marketing: <Megaphone className="w-4 h-4" />,
  Operations: <Settings className="w-4 h-4" />,
  Design: <Palette className="w-4 h-4" />,
};

const values = [
  { icon: <Heart className="w-5 h-5" />, title: "Mission-Driven", desc: "We're transforming Nigerian real estate — every role contributes directly to that mission." },
  { icon: <Globe className="w-5 h-5" />, title: "Remote-Friendly", desc: "Work from Lagos, Abuja, or anywhere. We care about output, not office hours." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Equity & Ownership", desc: "Early employees receive equity. When PropertyLoop wins, you win." },
  { icon: <Users className="w-5 h-5" />, title: "Growth Culture", desc: "Learning budgets, conference access, and mentorship from senior leadership." },
];

const Careers = () => {
  const [activeDept, setActiveDept] = useState("All");
  const filtered = activeDept === "All" ? jobs : jobs.filter((j) => j.dept === activeDept);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Careers</span>
          </div>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&h=600&fit=crop)" }} />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Join the <span className="text-white/70">Team</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">Help us build the platform that's transforming how Nigerians buy, rent, and manage property.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                {[{ value: "0", label: "Open Roles" }, { value: "5", label: "Departments" }, { value: "Remote", label: "Friendly" }].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm">
                    <span className="font-heading font-bold text-white">{s.value}</span>
                    <span className="text-white/50">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {departments.map((d) => (
              <button key={d} onClick={() => setActiveDept(d)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeDept === d ? "bg-primary text-white border-primary" : "bg-white/80 text-primary-dark border-border-light hover:border-primary hover:text-primary"}`}>
                {d === "All" ? <LayoutGrid className="w-4 h-4 inline mr-1.5 -mt-0.5" /> : null}
                {d}
              </button>
            ))}
          </div>

          {/* Job listings */}
          <div className="flex flex-col gap-4 mb-20">
            {filtered.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease }} className="group bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {deptIcons[job.dept] || <Briefcase className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-primary-dark text-[15px]">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-text-secondary text-xs mt-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.type}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted}</span>
                  </div>
                </div>
                <Link to={`/careers/${job.id}`} className="shrink-0 h-10 px-5 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                  View Role <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-10 sm:p-14 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-5">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-primary-dark text-xl sm:text-2xl">
                  No jobs available right now
                </h3>
                <p className="text-text-secondary text-sm mt-3 max-w-md mx-auto leading-relaxed">
                  We're not actively hiring at the moment, but PropertyLoop is growing fast and that won't last long. Drop us a note and we'll keep you in mind when the next role opens.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <Link to="/contact" className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]">
                    Get in touch <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link to="/about" className="h-11 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all">
                    Learn about us
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Why PropertyLoop */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">Why PropertyLoop?</p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">More than a <span className="text-primary">job</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-6">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">{v.icon}</div>
                  <h3 className="font-heading font-bold text-primary-dark text-[15px] mb-2">{v.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;

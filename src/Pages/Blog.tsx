import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock,
  TrendingUp,
  BookOpen,
  Zap,
  Users,
  LayoutGrid,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { blogPosts as posts } from "../data/blogPosts";

const ease = [0.23, 1, 0.32, 1] as const;

const categories = ["All", "Market Insights", "Guides", "Product Updates", "Agent Tips"];

const catIcons: Record<string, React.ReactNode> = {
  "Market Insights": <TrendingUp className="w-3 h-3" />,
  Guides: <BookOpen className="w-3 h-3" />,
  "Product Updates": <Zap className="w-3 h-3" />,
  "Agent Tips": <Users className="w-3 h-3" />,
};

const Blog = () => {
  const [activeCat, setActiveCat] = useState("All");
  const filtered = activeCat === "All" ? posts : posts.filter((p) => p.category === activeCat);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Blog</span>
          </div>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=1400&h=600&fit=crop)" }} />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                PropertyLoop <span className="text-white/70">Blog</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">Market insights, property guides, product updates, and expert tips from Nigeria's next-generation real estate platform.</p>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all inline-flex items-center gap-1.5 ${activeCat === c ? "bg-primary text-white border-primary" : "bg-white/80 text-primary-dark border-border-light hover:border-primary hover:text-primary"}`}>
                {c === "All" ? <LayoutGrid className="w-3.5 h-3.5" /> : catIcons[c]}
                {c}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
            {filtered.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease }} onClick={() => (window.location.href = `/blog/${post.slug}`)} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                {/* Image */}
                <div className="h-48 overflow-hidden rounded-t-[20px] relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium">
                    {catIcons[post.category]}
                    {post.category}
                  </span>
                </div>

                {/* Glass content */}
                <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-text-secondary text-xs mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="h-px bg-border-light mt-3 mb-3" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={post.avatar} alt={post.author} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-text-secondary text-xs">{post.author}</span>
                    </div>
                    <span className="flex items-center gap-1 text-text-subtle text-xs"><Clock className="w-3 h-3" /> {post.date}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

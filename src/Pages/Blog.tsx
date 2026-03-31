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

const ease = [0.23, 1, 0.32, 1] as const;

const categories = ["All", "Market Insights", "Guides", "Product Updates", "Agent Tips"];

const posts = [
  {
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    category: "Market Insights",
    title: "Lagos Property Market Q1 2026: What the Numbers Tell Us",
    excerpt: "Lekki leads with 18% price growth, Victoria Island stabilises, and Ajah emerges as the new value corridor for first-time buyers.",
    author: "Adebayo Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    date: "Mar 28, 2026",
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    category: "Guides",
    title: "First-Time Buyer's Guide: Everything You Need to Know in Nigeria",
    excerpt: "From C of O verification to escrow payments — a complete walkthrough of buying your first property on PropertyLoop.",
    author: "Chioma Okafor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
    date: "Mar 22, 2026",
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    category: "Product Updates",
    title: "Introducing the Property Logbook: Every Repair, Every Record",
    excerpt: "We've launched the Property Logbook — a permanent digital maintenance history attached to every property on the platform.",
    author: "PropertyLoop Team",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
    date: "Mar 15, 2026",
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    category: "Agent Tips",
    title: "How Top Agents Close 50+ Deals a Year on PropertyLoop",
    excerpt: "We interviewed our highest-performing agents to learn their strategies for lead conversion, client retention, and portfolio growth.",
    author: "Emeka Nwosu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    date: "Mar 10, 2026",
  },
  {
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    category: "Market Insights",
    title: "Shortlet Market Boom: Why Lagos Is Africa's Airbnb Capital",
    excerpt: "Short-term rentals in Lagos grew 42% in 2025. Here's where the demand is, what guests want, and how to capitalise.",
    author: "Aisha Mohammed",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
    date: "Mar 5, 2026",
  },
  {
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    category: "Guides",
    title: "How Service Escrow Protects You When Hiring a Vendor",
    excerpt: "Understanding how Paystack escrow works, what happens during disputes, and why you should never pay vendors directly again.",
    author: "PropertyLoop Team",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
    date: "Feb 28, 2026",
  },
];

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
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease }} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
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
                <div className="w-20 h-20 bg-[#1a1a1a] rounded-full absolute -right-5 -bottom-5 z-20 group-hover:bg-primary transition-colors duration-300">
                  <ArrowUpRight className="absolute top-4 left-5 w-5 h-5 text-white" />
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

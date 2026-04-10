import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Calendar,
  TrendingUp,
  BookOpen,
  Zap,
  Users,
  Share2,
  Bookmark,
  Send,
  Link2,
  Globe,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { getBlogPost, getRelatedPosts } from "../data/blogPosts";

const ease = [0.23, 1, 0.32, 1] as const;

const catIcons: Record<string, React.ReactNode> = {
  "Market Insights": <TrendingUp className="w-3 h-3" />,
  Guides: <BookOpen className="w-3 h-3" />,
  "Product Updates": <Zap className="w-3 h-3" />,
  "Agent Tips": <Users className="w-3 h-3" />,
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getBlogPost(slug) : undefined;
  const related = slug ? getRelatedPosts(slug) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-20">
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-text-subtle" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-2xl">
              Article not found
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <button
              onClick={() => navigate("/blog")}
              className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium truncate max-w-60">
              {post.title}
            </span>
          </div>

          {/* Article header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {catIcons[post.category]}
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-text-secondary text-xs">
                <Calendar className="w-3 h-3" /> {post.date}
              </span>
              <span className="flex items-center gap-1 text-text-secondary text-xs">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
            </div>

            <h1 className="font-heading text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight mb-6">
              {post.title}
            </h1>

            <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Author + actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-border-light">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-11 h-11 rounded-full object-cover border border-border-light"
                />
                <div>
                  <p className="font-heading font-bold text-primary-dark text-sm">
                    {post.author}
                  </p>
                  <p className="text-text-secondary text-xs">
                    PropertyLoop Editorial
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-white/80 border border-border-light flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/80 border border-border-light flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="my-10 overflow-hidden rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[280px] sm:h-[400px] lg:h-[480px] object-cover"
            />
          </motion.div>

          {/* Article body */}
          <article className="max-w-3xl mx-auto">
            {post.content.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
                className="text-primary-dark text-base sm:text-[17px] leading-[1.8] mb-6 font-body"
              >
                {para}
              </motion.p>
            ))}

            {/* Share strip */}
            <div className="mt-12 mb-16 py-6 border-y border-border-light flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="font-heading font-bold text-primary-dark text-sm">
                Share this article
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: <Send className="w-4 h-4" />, label: "Twitter" },
                  { icon: <Globe className="w-4 h-4" />, label: "Facebook" },
                  { icon: <Link2 className="w-4 h-4" />, label: "Copy link" },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="h-10 px-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center gap-2"
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </article>

          {/* Related posts */}
          {related.length > 0 && (
            <section className="mb-20">
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-heading font-bold text-primary-dark text-xl sm:text-2xl">
                  Continue reading
                </h2>
                <Link
                  to="/blog"
                  className="text-primary text-sm font-medium hover:underline hidden sm:inline"
                >
                  View all articles
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r, i) => (
                  <motion.div
                    key={r.slug}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease }}
                    onClick={() => navigate(`/blog/${r.slug}`)}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-40 overflow-hidden rounded-t-[20px] relative">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium">
                        {catIcons[r.category]}
                        {r.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-primary-dark text-[14px] leading-snug line-clamp-2">
                        {r.title}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-text-secondary text-xs">
                          {r.date}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

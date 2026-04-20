import { Link } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Blog</span>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-12 text-center">
            <h1 className="font-heading font-bold text-primary-dark text-3xl mb-4">
              Blog Coming Soon
            </h1>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              We're working on bringing you valuable content about real estate and home services.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

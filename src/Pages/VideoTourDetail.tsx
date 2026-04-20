import { Link } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const VideoTourDetail = () => {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/video-tours" className="hover:text-primary transition-colors">
              Video Tours
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Tour Details</span>
          </div>

          {/* Coming Soon State */}
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Play className="w-8 h-8 text-primary/50" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">
              Video Tour Details Coming Soon
            </h1>
            <p className="text-text-secondary text-sm mb-6 max-w-md">
              Detailed property information and video tours will be available here.
              Explore all available video tours in the meantime.
            </p>
            <Link
              to="/video-tours"
              className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Video Tours
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoTourDetail;

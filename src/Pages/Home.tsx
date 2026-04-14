import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import TrustedSection from "../components/Home/TrustedSection";
import FeaturedHomes from "../components/Home/FeaturedHomes";
import VideoListings from "../components/Home/VideoListings";
import ServiceLoop from "../components/Home/ServiceLoop";
import PropertyLogbook from "../components/Home/PropertyLogbook";
import AgentSpotlight from "../components/Home/AgentSpotlight";
import ShortletSpotlight from "../components/Home/ShortletSpotlight";
import Partners from "../components/Home/Partners";
import VideoTestimonials from "../components/Home/VideoTestimonials";
import CtaBanner from "../components/Home/CtaBanner";
import Footer from "../components/Home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <Hero />
      <TrustedSection />
      <FeaturedHomes />
      <VideoListings />
      <ServiceLoop />
      <PropertyLogbook />
      <AgentSpotlight />
      <ShortletSpotlight />
      <VideoTestimonials />
      <Partners />
      <CtaBanner />
      <Footer />
    </div>
  );
};

export default Home;

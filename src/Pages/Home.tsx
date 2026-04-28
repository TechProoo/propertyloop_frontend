import Seo from "../components/Seo";
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
      <Seo
        title="PropertyLoop — Buy, Rent & Sell Property in Nigeria"
        titleSuffix=""
        description="Nigeria's all-in-one real estate platform. Verified agents, secure escrow, shortlets, and a service vendor marketplace — all in one place."
        path="/"
        keywords="real estate Nigeria, property Lagos, buy property Nigeria, rent Lagos, shortlet Nigeria, verified agents, escrow"
      />
      <Navbar />
      <Hero />
      <TrustedSection />
      <FeaturedHomes />
      <ServiceLoop />
      <ShortletSpotlight />
      <VideoListings />
      <AgentSpotlight />
      <PropertyLogbook />
      <VideoTestimonials />
      <Partners />
      <CtaBanner />
      <Footer />
    </div>
  );
};

export default Home;

import Seo from "../components/Seo";
import Navbar from "../components/Home/Navbar";
import StockHero from "../components/Home/StockHero";
import AgentListings from "../components/Home/AgentListings";
import FeaturedRail from "../components/Home/FeaturedRail";
// import TrustedSection from "../components/Home/TrustedSection";
import FeaturedHomes from "../components/Home/FeaturedHomes";
import VideoListings from "../components/Home/VideoListings";
// // Artisan Corner is hidden (src/config/features.ts). Nothing is deleted.
// import ServiceLoop from "../components/Home/ServiceLoop";
// MarketplaceSpotlight is now integrated into StockHero.
// import MarketplaceSpotlight from "../components/Home/MarketplaceSpotlight";
import MarketplaceShowcase from "../components/Home/MarketplaceShowcase";
import PropertyLogbook from "../components/Home/PropertyLogbook";
import AgentSpotlight from "../components/Home/AgentSpotlight";
import ShortletSpotlight from "../components/Home/ShortletSpotlight";
// import Partners from "../components/Home/Partners";
// import VideoTestimonials from "../components/Home/VideoTestimonials";
import CtaBanner from "../components/Home/CtaBanner";
import Footer from "../components/Home/Footer";
import Partners from "@/components/Home/Partners";
import AdSlot from "../components/ui/AdSlot";
import AdvertiseSpotlight from "../components/Home/AdvertiseSpotlight";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="PropertyLoop - Find a Home, Make It Yours"
        titleSuffix=""
        description="Find verified homes to buy, rent or book as a shortlet, then shop furniture, lighting and building materials from trusted Nigerian stores on PropertyLoop."
        path="/"
        keywords="real estate Nigeria, property Lagos, buy property Nigeria, rent Lagos, shortlet Nigeria, verified agents, home furniture marketplace, building materials Nigeria"
      />
      <Navbar />
      {/* PropertyLoop's own stock leads; agents' listings follow. */}
      <StockHero />
      {/* Paid placements, which used to be the hero carousel. */}
      <FeaturedRail />
      <AgentListings />
      {/* The retail half of the home — shop the marketplace (carousel). */}
      <MarketplaceShowcase />
      {/* Paid brand placement - renders nothing when no campaign is live */}
      <div className="mx-auto max-w-360 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <AdSlot placement="HOME_BANNER" />
      </div>
      <AdvertiseSpotlight />
      {/* <TrustedSection /> */}
      <FeaturedHomes />
      {/* <ServiceLoop /> — Artisan Corner is hidden */}
      {/* MarketplaceSpotlight is now integrated into StockHero */}
      <ShortletSpotlight />
      <VideoListings />
      <AgentSpotlight />
      <PropertyLogbook />
      {/* <VideoTestimonials /> */}
      <Partners />
      <CtaBanner />
      <Footer />
    </div>
  );
};

export default Home;

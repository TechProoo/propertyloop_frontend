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
import MarketplaceSpotlight from "../components/Home/MarketplaceSpotlight";
import { PRODUCT_MARKETPLACE } from "../config/features";
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
        title="PropertyLoop - Buy, Rent & Sell Property in Nigeria"
        titleSuffix=""
        description="Nigeria's all-in-one real estate platform. Verified agents, secure escrow, shortlets, and a service vendor marketplace - all in one place."
        path="/"
        keywords="real estate Nigeria, property Lagos, buy property Nigeria, rent Lagos, shortlet Nigeria, verified agents, escrow"
      />
      <Navbar />
      {/* PropertyLoop's own stock leads; agents' listings follow. */}
      <StockHero />
      {/* Paid placements, which used to be the hero carousel. */}
      <FeaturedRail />
      <AgentListings />
      {/* Paid brand placement - renders nothing when no campaign is live */}
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 my-20">
        <AdSlot placement="HOME_BANNER" className="mt-8 sm:mt-10" />
      </div>
      <AdvertiseSpotlight />
      {/* <TrustedSection /> */}
      <FeaturedHomes />
      {/* <ServiceLoop /> — Artisan Corner is hidden */}
      {PRODUCT_MARKETPLACE && <MarketplaceSpotlight />}
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

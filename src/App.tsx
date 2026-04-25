import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { AnimatePresence } from "framer-motion";
import SplashLoader from "./components/ui/SplashLoader";
import Home from "./Pages/Home";
import HowItWorks from "./Pages/HowItWorks";
import Buy from "./Pages/Buy";
import Rent from "./Pages/Rent";
import Sell from "./Pages/Sell";
import Onboarding from "./Pages/Onboarding";
import FindAgent from "./Pages/FindAgent";
import AgentProfile from "./Pages/AgentProfile";
import AddProperty from "./Pages/AddProperty";
import About from "./Pages/About";
import Shortlet from "./Pages/Shortlet";
import NewDevelopments from "./Pages/NewDevelopments";
import Services from "./Pages/Services";
import PropertyDetail from "./Pages/PropertyDetail";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import AgentDashboard from "./Pages/AgentDashboard";
import ServiceEscrow from "./Pages/ServiceEscrow";
import ShortletBooking from "./Pages/ShortletBooking";
import RentalEscrow from "./Pages/RentalEscrow";
import Contact from "./Pages/Contact";
import Legal from "./Pages/Legal";
import Careers from "./Pages/Careers";
import Blog from "./Pages/Blog";
import VideoTours from "./Pages/VideoTours";
import VideoTourDetail from "./Pages/VideoTourDetail";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import BookService from "./Pages/BookService";
import VendorDashboard from "./Pages/VendorDashboard";
import VendorProfile from "./Pages/VendorProfile";
import BlogPost from "./Pages/BlogPost";
import JobDetail from "./Pages/JobDetail";
import Settings from "./Pages/Settings";
import ForgotPassword from "./Pages/ForgotPassword";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Messages from "./Pages/Messages";
import DisputeCenter from "./Pages/DisputeCenter";
import AdminPanel from "./Pages/AdminPanel";
import PartnersAdmin from "./Pages/PartnersAdmin";
import VerifyEmail from "./Pages/VerifyEmail";
import VerifyEmailRequired from "./Pages/VerifyEmailRequired";
import SearchResults from "./Pages/SearchResults";
import LogbookInfo from "./Pages/LogbookInfo";
import NotFound from "./Pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const roleDashboard: Record<string, string> = {
  BUYER: "/dashboard",
  AGENT: "/agent-dashboard",
  VENDOR: "/vendor-dashboard",
};

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isLoggedIn, loading } = useAuth();
  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/onboarding" replace />;
  if (user && !user.emailVerifiedAt) {
    return <Navigate to="/verify-email-required" replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleDashboard[user.role] || "/dashboard"} replace />;
  }
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, loading } = useAuth();
  if (loading) return null;
  if (isLoggedIn && user) {
    if (!user.emailVerifiedAt) {
      return <Navigate to="/verify-email-required" replace />;
    }
    return <Navigate to={roleDashboard[user.role] || "/dashboard"} replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const { loading } = useAuth();

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <SplashLoader key="splash-loader" />}
      </AnimatePresence>
      {!loading && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/logbook" element={<LogbookInfo />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/shortlet" element={<Shortlet />} />
          <Route path="/new-developments" element={<NewDevelopments />} />
          <Route path="/onboarding" element={<PublicOnlyRoute><Onboarding /></PublicOnlyRoute>} />
          <Route path="/find-agent" element={<FindAgent />} />
          <Route path="/agent/:id" element={<AgentProfile />} />
          <Route path="/vendor/:id" element={<VendorProfile />} />
          <Route
            path="/add-property"
            element={
              <ProtectedRoute allowedRoles={["AGENT"]}>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email-required" element={<VerifyEmailRequired />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["BUYER"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent-dashboard"
            element={
              <ProtectedRoute allowedRoles={["AGENT"]}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["VENDOR"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/escrow" element={<ServiceEscrow />} />
          <Route path="/shortlet-booking" element={<ShortletBooking />} />
          <Route path="/rental-escrow" element={<RentalEscrow />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/careers/:id" element={<JobDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/order-confirmation/:id"
            element={<OrderConfirmation />}
          />
          <Route path="/legal/:slug" element={<Legal />} />
          <Route path="/video-tours" element={<VideoTours />} />
          <Route path="/video-tour/:id" element={<VideoTourDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/book-service/:id" element={<BookService />} />
          <Route
            path="/disputes"
            element={
              <ProtectedRoute>
                <DisputeCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partners"
            element={
              <ProtectedRoute allowedRoles={["AGENT"]}>
                <PartnersAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <AuthProvider>
        <BookmarkProvider>
          <AppContent />
        </BookmarkProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

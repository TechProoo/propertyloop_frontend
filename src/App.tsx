import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookmarkProvider } from "./context/BookmarkContext";
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
import Reductions from "./Pages/Reductions";
import Marketplace from "./Pages/Marketplace";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import BookService from "./Pages/BookService";
import VendorDashboard from "./Pages/VendorDashboard";
import BlogPost from "./Pages/BlogPost";
import JobDetail from "./Pages/JobDetail";
import Settings from "./Pages/Settings";
import ForgotPassword from "./Pages/ForgotPassword";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Messages from "./Pages/Messages";
import NotFound from "./Pages/NotFound";

const roleDashboard: Record<string, string> = {
  buyer: "/dashboard",
  agent: "/agent-dashboard",
  vendor: "/vendor-dashboard",
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
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleDashboard[user.role] || "/dashboard"} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookmarkProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/shortlet" element={<Shortlet />} />
            <Route path="/new-developments" element={<NewDevelopments />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/find-agent" element={<FindAgent />} />
            <Route path="/agent/:id" element={<AgentProfile />} />
            <Route
              path="/add-property"
              element={
                <ProtectedRoute allowedRoles={["agent"]}>
                  <AddProperty />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent-dashboard"
              element={
                <ProtectedRoute allowedRoles={["agent"]}>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
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
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
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
            <Route path="/reductions" element={<Reductions />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/book-service/:id" element={<BookService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BookmarkProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import HowItWorks from './Pages/HowItWorks'
import Buy from './Pages/Buy'
import Rent from './Pages/Rent'
import Sell from './Pages/Sell'
import Onboarding from './Pages/Onboarding'
import FindAgent from './Pages/FindAgent'
import AgentProfile from './Pages/AgentProfile'
import AddProperty from './Pages/AddProperty'
import About from './Pages/About'
import Shortlet from './Pages/Shortlet'
import NewDevelopments from './Pages/NewDevelopments'
import Services from './Pages/Services'
import PropertyDetail from './Pages/PropertyDetail'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import AgentDashboard from './Pages/AgentDashboard'
import ServiceEscrow from './Pages/ServiceEscrow'
import ShortletBooking from './Pages/ShortletBooking'
import RentalEscrow from './Pages/RentalEscrow'
import Contact from './Pages/Contact'
import Legal from './Pages/Legal'
import Careers from './Pages/Careers'
import Blog from './Pages/Blog'

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/escrow" element={<ServiceEscrow />} />
        <Route path="/shortlet-booking" element={<ShortletBooking />} />
        <Route path="/rental-escrow" element={<RentalEscrow />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/legal/:slug" element={<Legal />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

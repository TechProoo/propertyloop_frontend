export interface VideoListing {
  id: string;
  video: string;
  thumbnail: string;
  price: string;
  title: string;
  address: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  duration: string;
  agent: string;
  agentId: string;
  description: string;
  features: string[];
  yearBuilt: string;
  propertyType: string;
  rating: number;
  views: number;
}

export const videoListings: VideoListing[] = [
  {
    id: "luxury-smart-lekki",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
    price: "₦250,000,000",
    title: "Luxury Smart Home with Rooftop Terrace",
    address: "15 Admiralty Way, Lekki Phase 1",
    location: "Lekki, Lagos",
    beds: 5, baths: 4, sqft: "7,500", duration: "2:34",
    agent: "Prime Realty Lagos", agentId: "adebayo-johnson",
    description: "Step inside this stunning 5-bedroom smart home featuring an expansive rooftop terrace with panoramic views of the Lekki skyline. Every room is equipped with smart home technology — voice-controlled lighting, automated blinds, and a whole-house audio system. The property includes a private cinema, wine cellar, and a fully landscaped garden with an outdoor kitchen.",
    features: ["Smart Home", "Rooftop Terrace", "Private Cinema", "Wine Cellar", "Outdoor Kitchen", "24hr Power", "Pool", "Gym"],
    yearBuilt: "2025", propertyType: "House", rating: 4.9, views: 12400,
  },
  {
    id: "waterfront-penthouse-ikoyi",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
    price: "₦380,000,000",
    title: "Waterfront Penthouse with Infinity Pool",
    address: "7 Bourdillon Road, Ikoyi",
    location: "Ikoyi, Lagos",
    beds: 4, baths: 3, sqft: "6,200", duration: "3:12",
    agent: "Prestige Homes", agentId: "emeka-nwosu",
    description: "An exclusive waterfront penthouse in the heart of Ikoyi, offering breathtaking lagoon views from every room. The infinity pool on the private terrace creates a seamless visual connection with the water. Features include imported Italian marble, a Bulthaup kitchen, floor-to-ceiling windows, and a private elevator entrance.",
    features: ["Infinity Pool", "Waterfront", "Private Elevator", "Italian Marble", "Bulthaup Kitchen", "Concierge", "Parking (3)", "Smart Home"],
    yearBuilt: "2024", propertyType: "Flat / Apartment", rating: 4.9, views: 18700,
  },
  {
    id: "contemporary-villa-vi",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop",
    price: "₦150,000,000",
    title: "Contemporary Villa in Gated Community",
    address: "23 Adeola Odeku Street, Victoria Island",
    location: "Victoria Island, Lagos",
    beds: 4, baths: 3, sqft: "5,800", duration: "1:58",
    agent: "Island Properties", agentId: "chioma-okafor",
    description: "A beautifully designed contemporary villa within a secure gated community on Victoria Island. The open-plan living area flows seamlessly into a private garden, perfect for entertaining. The property features high ceilings, natural stone finishes, and a chef's kitchen with top-of-the-line appliances.",
    features: ["Gated Community", "Private Garden", "Chef's Kitchen", "High Ceilings", "CCTV", "24hr Security", "BQ", "Parking (2)"],
    yearBuilt: "2023", propertyType: "House", rating: 4.8, views: 9200,
  },
  {
    id: "beachfront-banana-island",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&h=400&fit=crop",
    price: "₦520,000,000",
    title: "Beachfront Estate with Private Garden",
    address: "1 Banana Island Road",
    location: "Banana Island, Lagos",
    beds: 6, baths: 5, sqft: "10,400", duration: "4:05",
    agent: "Royal Estate Advisors", agentId: "tunde-bakare",
    description: "The ultimate Lagos luxury residence — a 6-bedroom beachfront estate on Banana Island with direct water access, a private jetty, and over 10,000 sqft of living space. This architectural masterpiece features a double-height living room, home cinema, gym, staff quarters, and meticulously landscaped tropical gardens.",
    features: ["Beachfront", "Private Jetty", "Home Cinema", "Gym", "Staff Quarters", "Generator", "Borehole", "Smart Home"],
    yearBuilt: "2022", propertyType: "House", rating: 4.9, views: 24300,
  },
  {
    id: "modern-duplex-ajah",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop",
    price: "₦88,000,000",
    title: "Modern Duplex with Landscaped Yard",
    address: "Block 5, Abraham Adesanya Estate",
    location: "Ajah, Lagos",
    beds: 3, baths: 3, sqft: "4,600", duration: "2:15",
    agent: "Metro Living Realty", agentId: "aisha-mohammed",
    description: "A beautifully finished modern duplex in one of Ajah's most sought-after estates. The property features a spacious living area with double-height ceilings, a fully fitted kitchen, and a landscaped front and back yard. The master bedroom includes a walk-in closet and en-suite with rain shower.",
    features: ["Landscaped Yard", "Walk-in Closet", "Rain Shower", "Fitted Kitchen", "24hr Security", "Parking (2)", "Borehole", "Inverter"],
    yearBuilt: "2024", propertyType: "House", rating: 4.7, views: 6800,
  },
  {
    id: "minimalist-townhouse-gbagada",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop",
    price: "₦195,000,000",
    title: "Minimalist Townhouse with Smart Features",
    address: "12 Diya Street, Gbagada Estate",
    location: "Gbagada, Lagos",
    beds: 4, baths: 4, sqft: "5,200", duration: "3:40",
    agent: "Cityscape Properties", agentId: "femi-adeyemi",
    description: "A stunning minimalist townhouse that combines clean architectural lines with cutting-edge smart home technology. Every aspect of this home can be controlled via your phone — from lighting and climate to security cameras and the automated garage. The interior features polished concrete floors, floor-to-ceiling glass, and custom joinery throughout.",
    features: ["Smart Home", "Automated Garage", "Polished Concrete", "Custom Joinery", "Solar Panels", "24hr Power", "CCTV", "Fibre Internet"],
    yearBuilt: "2025", propertyType: "House", rating: 4.8, views: 11500,
  },
];

export const getVideoById = (id: string): VideoListing | undefined => {
  return videoListings.find((v) => v.id === id);
};

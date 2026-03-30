export interface Listing {
  id: string;
  image: string;
  images: string[];
  price: string;
  period?: string;
  title: string;
  address: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  rating: number;
  agent: string;
  agentId: string;
  type: "sale" | "rent" | "shortlet";
  propertyType: string;
  description: string;
  features: string[];
  yearBuilt: string;
  verified: boolean;
}

export const listings: Listing[] = [
  {
    id: "luxury-3bed-lekki",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    ],
    price: "₦65,000,000",
    title: "Luxury 3-Bed Flat in Lekki",
    address: "12 Admiralty Way, Lekki Phase 1",
    location: "Lekki, Lagos",
    beds: 3,
    baths: 3,
    sqft: "2,400",
    rating: 4.8,
    agent: "Prime Realty Lagos",
    agentId: "adebayo-johnson",
    type: "sale",
    propertyType: "Flat / Apartment",
    description: "A stunning 3-bedroom luxury flat located in the heart of Lekki Phase 1. This property features floor-to-ceiling windows with panoramic views, a modern open-plan kitchen with imported fittings, marble flooring throughout, and a spacious living area perfect for entertaining. The master bedroom comes with an en-suite bathroom and walk-in closet. The estate offers 24-hour security, swimming pool, gym, and reliable power supply.",
    features: ["24hr Power", "Swimming Pool", "Gym", "CCTV", "Elevator", "Parking (2 spots)", "Smart Home", "Marble Floors"],
    yearBuilt: "2023",
    verified: true,
  },
  {
    id: "penthouse-ocean-vi",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    ],
    price: "₦120,000,000",
    title: "Penthouse with Ocean View",
    address: "5 Ozumba Mbadiwe Avenue, Victoria Island",
    location: "Victoria Island, Lagos",
    beds: 4,
    baths: 3,
    sqft: "3,800",
    rating: 4.9,
    agent: "Island Properties",
    agentId: "chioma-okafor",
    type: "sale",
    propertyType: "Flat / Apartment",
    description: "Breathtaking penthouse on Victoria Island with unobstructed ocean views. This 4-bedroom masterpiece features a private rooftop terrace, designer kitchen, home cinema, and floor-to-ceiling glass walls. Located in one of Lagos's most prestigious addresses with direct access to the waterfront promenade.",
    features: ["Ocean View", "Rooftop Terrace", "Home Cinema", "Wine Cellar", "Smart Home", "Concierge", "Parking (3 spots)", "24hr Power"],
    yearBuilt: "2024",
    verified: true,
  },
  {
    id: "villa-garden-lekki",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
    ],
    price: "₦185,000,000",
    title: "Contemporary Villa with Garden",
    address: "Plot 8, Chevron Drive, Lekki",
    location: "Lekki, Lagos",
    beds: 4,
    baths: 3,
    sqft: "6,800",
    rating: 4.9,
    agent: "Prime Realty Lagos",
    agentId: "adebayo-johnson",
    type: "sale",
    propertyType: "House",
    description: "An exquisite contemporary villa set on a generous plot with beautifully landscaped gardens. Features include 4 ensuite bedrooms, a detached BQ, private swimming pool, outdoor BBQ area, fully fitted kitchen, and a double-car garage. Located in a quiet, secure estate with excellent road access.",
    features: ["Private Pool", "Garden", "BQ", "Double Garage", "BBQ Area", "CCTV", "Borehole", "24hr Power"],
    yearBuilt: "2022",
    verified: true,
  },
  {
    id: "waterfront-mansion-bi",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    ],
    price: "₦450,000,000",
    title: "Waterfront Mansion with Pool",
    address: "3 Close, Banana Island Road",
    location: "Banana Island, Lagos",
    beds: 6,
    baths: 5,
    sqft: "12,000",
    rating: 4.9,
    agent: "Royal Estate Advisors",
    agentId: "tunde-bakare",
    type: "sale",
    propertyType: "House",
    description: "A magnificent 6-bedroom waterfront mansion on Banana Island — Lagos's most exclusive address. This estate features a private jetty, infinity pool overlooking the lagoon, home cinema, gym, staff quarters, and lush tropical gardens. Every room is finished to the highest international standards.",
    features: ["Waterfront", "Private Jetty", "Infinity Pool", "Home Cinema", "Gym", "Staff Quarters", "Generator", "Smart Home"],
    yearBuilt: "2021",
    verified: true,
  },
  {
    id: "serviced-3bed-rent",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    ],
    price: "₦3,500,000",
    period: "year",
    title: "Serviced 3-Bed Flat with Pool",
    address: "15 Freedom Way, Lekki Phase 1",
    location: "Lekki, Lagos",
    beds: 3,
    baths: 3,
    sqft: "2,400",
    rating: 4.8,
    agent: "Prime Realty Lagos",
    agentId: "adebayo-johnson",
    type: "rent",
    propertyType: "Flat / Apartment",
    description: "A beautifully serviced 3-bedroom flat in a gated estate on Lekki Phase 1. Fully furnished with modern appliances, the apartment comes with dedicated parking, 24-hour power, and access to the estate pool and gym. Perfect for professionals and young families.",
    features: ["Furnished", "Swimming Pool", "Gym", "24hr Power", "Parking", "CCTV", "Serviced"],
    yearBuilt: "2023",
    verified: true,
  },
  {
    id: "duplex-bq-gbagada",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
    ],
    price: "₦95,000,000",
    title: "Semi-Detached Duplex with BQ",
    address: "22 Diya Street, Gbagada Estate",
    location: "Gbagada, Lagos",
    beds: 4,
    baths: 3,
    sqft: "5,200",
    rating: 4.7,
    agent: "Cityscape Properties",
    agentId: "femi-adeyemi",
    type: "sale",
    propertyType: "House",
    description: "Spacious semi-detached duplex in a quiet, family-friendly estate in Gbagada. Features 4 ensuite bedrooms, a self-contained BQ, ample parking, and a well-maintained garden. The estate has 24-hour security, good road network, and reliable power supply.",
    features: ["BQ", "Garden", "Parking (3 spots)", "24hr Security", "Borehole", "All Rooms Ensuite"],
    yearBuilt: "2020",
    verified: true,
  },
];

export const getListingById = (id: string): Listing | undefined => {
  return listings.find((l) => l.id === id);
};

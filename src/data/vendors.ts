export interface Vendor {
  id: string;
  image: string;
  avatar: string;
  name: string;
  category: string;
  rating: number;
  jobs: number;
  location: string;
  price: string;
  priceNum: number;
  verified: boolean;
  phone: string;
  bio: string;
}

export const vendors: Vendor[] = [
  {
    id: "chinedu-okonkwo",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    name: "Chinedu Okonkwo", category: "Plumbing", rating: 4.9, jobs: 234,
    location: "Lekki, Lagos", price: "From ₦15,000", priceNum: 15000, verified: true, phone: "2348012345678",
    bio: "Expert plumber with 12 years of experience across Lekki and Victoria Island. Specialises in kitchen and bathroom installations, pipe repairs, and water heater systems.",
  },
  {
    id: "babatunde-akinola",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    name: "Babatunde Akinola", category: "Electrical", rating: 4.8, jobs: 198,
    location: "Victoria Island, Lagos", price: "From ₦20,000", priceNum: 20000, verified: true, phone: "2348023456789",
    bio: "Licensed electrician handling residential and commercial wiring, panel upgrades, and generator installations. NEMSA certified.",
  },
  {
    id: "emeka-uchenna",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    name: "Emeka Uchenna", category: "Building", rating: 4.9, jobs: 312,
    location: "Ikoyi, Lagos", price: "From ₦50,000", priceNum: 50000, verified: true, phone: "2348034567890",
    bio: "General contractor with 15 years of experience in residential construction, renovations, and structural repairs across Lagos Island.",
  },
  {
    id: "amina-yusuf",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    name: "Amina Yusuf", category: "Cleaning", rating: 4.7, jobs: 456,
    location: "Ajah, Lagos", price: "From ₦8,000", priceNum: 8000, verified: true, phone: "2348045678901",
    bio: "Professional cleaning services for homes, offices, and post-construction sites. Deep cleaning, fumigation, and regular maintenance packages available.",
  },
  {
    id: "segun-adeleke",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    name: "Segun Adeleke", category: "Painting", rating: 4.8, jobs: 189,
    location: "Gbagada, Lagos", price: "From ₦12,000", priceNum: 12000, verified: true, phone: "2348056789012",
    bio: "Interior and exterior painting specialist. Expert in texture finishes, wallpaper installation, and colour consultation. Uses premium Dulux and Berger paints.",
  },
  {
    id: "olu-fashola",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    name: "Olu Fashola", category: "Plaster", rating: 4.6, jobs: 145,
    location: "Surulere, Lagos", price: "From ₦18,000", priceNum: 18000, verified: true, phone: "2348067890123",
    bio: "Plastering and screeding specialist with 10 years of experience. Handles POP ceilings, wall plastering, and decorative mouldings.",
  },
  {
    id: "ngozi-amadi",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face",
    name: "Ngozi Amadi", category: "Cleaning", rating: 4.9, jobs: 523,
    location: "Ikeja, Lagos", price: "From ₦10,000", priceNum: 10000, verified: true, phone: "2348078901234",
    bio: "Premium home and office cleaning with eco-friendly products. Specialises in move-in/move-out cleaning and regular maintenance contracts.",
  },
  {
    id: "yemi-ogundimu",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    name: "Yemi Ogundimu", category: "Electrical", rating: 4.7, jobs: 167,
    location: "Maryland, Lagos", price: "From ₦18,000", priceNum: 18000, verified: true, phone: "2348089012345",
    bio: "Electrical installations and repairs for homes and small businesses. Solar panel installation, inverter setup, and smart home wiring.",
  },
  {
    id: "ifeanyi-nwachukwu",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=80&h=80&fit=crop&crop=face",
    name: "Ifeanyi Nwachukwu", category: "Building", rating: 4.8, jobs: 276,
    location: "Magodo, Lagos", price: "From ₦45,000", priceNum: 45000, verified: true, phone: "2348090123456",
    bio: "Experienced builder specialising in extensions, loft conversions, and full property renovations. Project management from foundation to finishing.",
  },
  {
    id: "funmi-olatunde",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    name: "Funmi Olatunde", category: "Plumbing", rating: 4.8, jobs: 201,
    location: "Yaba, Lagos", price: "From ₦12,000", priceNum: 12000, verified: true, phone: "2348001234567",
    bio: "Plumbing solutions for residential properties. Water pump installation, drainage systems, and bathroom fitting specialist.",
  },
  {
    id: "halima-ibrahim",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    name: "Halima Ibrahim", category: "Carpentry", rating: 4.7, jobs: 132,
    location: "Ojodu, Lagos", price: "From ₦25,000", priceNum: 25000, verified: true, phone: "2348011234567",
    bio: "Custom furniture maker and carpentry specialist. Kitchen cabinets, wardrobes, doors, and wood flooring installation.",
  },
  {
    id: "kemi-adeyemi-painter",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    name: "Kemi Adeyemi", category: "Painting", rating: 4.9, jobs: 215,
    location: "Lekki, Lagos", price: "From ₦15,000", priceNum: 15000, verified: true, phone: "2348021234567",
    bio: "Creative painter offering modern finishes, accent walls, and complete interior/exterior repaints. Free colour consultation included.",
  },
];

export const getVendorById = (id: string): Vendor | undefined => {
  return vendors.find((v) => v.id === id);
};

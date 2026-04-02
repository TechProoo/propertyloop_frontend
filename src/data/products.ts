export interface Product {
  id: string;
  image: string;
  images: string[];
  name: string;
  supplier: string;
  category: string;
  price: number;
  priceLabel: string;
  unit: string;
  minOrder: string;
  location: string;
  rating: number;
  reviews: number;
  verified: boolean;
  phone: string;
  description: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "dangote-cement-50kg",
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
    ],
    name: "Dangote Cement (50kg Bag)",
    supplier: "BuildRight Supplies",
    category: "Cement & Concrete",
    price: 5500,
    priceLabel: "₦5,500",
    unit: "bag",
    minOrder: "Min. 20 bags",
    location: "Lekki, Lagos",
    rating: 4.9, reviews: 342, verified: true,
    phone: "2348012345678",
    description: "Premium Portland cement from Dangote, Nigeria's most trusted cement brand. Ideal for all construction projects — foundations, columns, beams, slabs, and plastering. 50kg bags, factory-sealed.",
    specs: [
      { label: "Brand", value: "Dangote" },
      { label: "Weight", value: "50kg" },
      { label: "Type", value: "Portland Limestone" },
      { label: "Strength", value: "42.5N" },
    ],
    inStock: true,
  },
  {
    id: "aluminium-roofing-055",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
    ],
    name: "Long Span Aluminium Roofing (0.55mm)",
    supplier: "NaijaRoof Ltd",
    category: "Roofing",
    price: 4200,
    priceLabel: "₦4,200",
    unit: "sheet",
    minOrder: "Min. 50 sheets",
    location: "Ikeja, Lagos",
    rating: 4.8, reviews: 218, verified: true,
    phone: "2348023456789",
    description: "High-quality long span aluminium roofing sheets, 0.55mm gauge. Corrosion-resistant, lightweight, and available in multiple colours. Custom lengths available on request.",
    specs: [
      { label: "Gauge", value: "0.55mm" },
      { label: "Material", value: "Aluminium" },
      { label: "Length", value: "Custom (up to 12m)" },
      { label: "Colours", value: "Wine, Green, Blue, Brown" },
    ],
    inStock: true,
  },
  {
    id: "porcelain-tiles-60x60",
    image: "https://images.unsplash.com/photo-1615529328519-3251a50af9ad?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615529328519-3251a50af9ad?w=1200&h=800&fit=crop",
    ],
    name: "Porcelain Floor Tiles (60x60cm)",
    supplier: "TileHub Nigeria",
    category: "Tiles & Flooring",
    price: 3800,
    priceLabel: "₦3,800",
    unit: "sqm",
    minOrder: "Min. 10 sqm",
    location: "Victoria Island, Lagos",
    rating: 4.7, reviews: 156, verified: true,
    phone: "2348034567890",
    description: "Premium polished porcelain floor tiles, 60x60cm. Scratch-resistant, easy to clean, and suitable for living rooms, bedrooms, and commercial spaces. Available in marble-look and solid finishes.",
    specs: [
      { label: "Size", value: "60 x 60 cm" },
      { label: "Finish", value: "Polished" },
      { label: "Material", value: "Porcelain" },
      { label: "Thickness", value: "10mm" },
    ],
    inStock: true,
  },
  {
    id: "ppr-pipes-1inch",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop",
    ],
    name: "PPR Hot Water Pipes (1 inch)",
    supplier: "PipeMasters",
    category: "Plumbing Materials",
    price: 1200,
    priceLabel: "₦1,200",
    unit: "meter",
    minOrder: "Min. 50 meters",
    location: "Ajah, Lagos",
    rating: 4.6, reviews: 98, verified: true,
    phone: "2348045678901",
    description: "High-grade PPR pipes suitable for hot and cold water supply. Corrosion-free, long-lasting, and easy to install. Meets Nigerian Industrial Standards (NIS).",
    specs: [
      { label: "Diameter", value: '1 inch (25mm)' },
      { label: "Material", value: "PPR" },
      { label: "Pressure Rating", value: "PN20" },
      { label: "Temp. Range", value: "0–95°C" },
    ],
    inStock: true,
  },
  {
    id: "armoured-cable-16mm",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=800&fit=crop",
    ],
    name: "Armoured Cable (16mm, 3-Core)",
    supplier: "WireConnect Ng",
    category: "Electrical Materials",
    price: 8500,
    priceLabel: "₦8,500",
    unit: "meter",
    minOrder: "Min. 100 meters",
    location: "Gbagada, Lagos",
    rating: 4.8, reviews: 187, verified: true,
    phone: "2348056789012",
    description: "Heavy-duty 3-core armoured cable, 16mm². Suitable for underground and outdoor installations. Steel wire armoured (SWA) for maximum protection. LSZH sheath available.",
    specs: [
      { label: "Size", value: "16mm² x 3-core" },
      { label: "Type", value: "SWA (Steel Wire Armoured)" },
      { label: "Voltage", value: "0.6/1kV" },
      { label: "Standard", value: "BS 5467" },
    ],
    inStock: true,
  },
  {
    id: "dulux-weathershield-20l",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&h=800&fit=crop",
    ],
    name: "Dulux Weathershield Paint (20L)",
    supplier: "ColourWorld",
    category: "Paint & Finishes",
    price: 28000,
    priceLabel: "₦28,000",
    unit: "bucket",
    minOrder: "Min. 5 buckets",
    location: "Surulere, Lagos",
    rating: 4.9, reviews: 265, verified: true,
    phone: "2348067890123",
    description: "Dulux Weathershield exterior emulsion paint, 20 litres. Superior weather protection with anti-fungal properties. Covers up to 12sqm per litre. Available in over 1,000 colours.",
    specs: [
      { label: "Volume", value: "20 Litres" },
      { label: "Coverage", value: "12 sqm/litre" },
      { label: "Finish", value: "Matt / Silk" },
      { label: "Dry Time", value: "2–4 hours" },
    ],
    inStock: true,
  },
  {
    id: "iron-rod-12mm",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
    ],
    name: "Iron Rod (12mm, High Yield)",
    supplier: "SteelForge Nigeria",
    category: "Steel & Iron",
    price: 385000,
    priceLabel: "₦385,000",
    unit: "ton",
    minOrder: "Min. 1 ton",
    location: "Ikoyi, Lagos",
    rating: 4.7, reviews: 142, verified: true,
    phone: "2348078901234",
    description: "High yield steel reinforcement bars (rebar), 12mm diameter. Manufactured to BS 4449 standards. Ideal for reinforced concrete structures — foundations, columns, beams, and slabs.",
    specs: [
      { label: "Diameter", value: "12mm" },
      { label: "Grade", value: "BS 4449 B500B" },
      { label: "Length", value: "12 meters" },
      { label: "Yield Strength", value: "500 N/mm²" },
    ],
    inStock: true,
  },
  {
    id: "hardwood-planks-2x6",
    image: "https://images.unsplash.com/photo-1616486029429-6afd57afc063?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1616486029429-6afd57afc063?w=1200&h=800&fit=crop",
    ],
    name: "Treated Hardwood Planks (2x6)",
    supplier: "TimberKing Lagos",
    category: "Wood & Timber",
    price: 2800,
    priceLabel: "₦2,800",
    unit: "plank",
    minOrder: "Min. 30 planks",
    location: "Maryland, Lagos",
    rating: 4.6, reviews: 89, verified: true,
    phone: "2348089012345",
    description: "Pressure-treated hardwood planks, 2x6 inches. Termite and rot resistant. Suitable for roofing, decking, and structural frameworks. Kiln-dried for dimensional stability.",
    specs: [
      { label: "Size", value: '2" x 6" (50 x 150mm)' },
      { label: "Length", value: "12 feet (3.6m)" },
      { label: "Treatment", value: "CCA Pressure Treated" },
      { label: "Species", value: "Iroko / Mahogany" },
    ],
    inStock: true,
  },
  {
    id: "turkish-security-door",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
    ],
    name: "Turkish Security Door (Steel)",
    supplier: "DoorMart Ng",
    category: "Doors & Windows",
    price: 185000,
    priceLabel: "₦185,000",
    unit: "unit",
    minOrder: "Min. 1 unit",
    location: "Yaba, Lagos",
    rating: 4.8, reviews: 204, verified: true,
    phone: "2348090123456",
    description: "Premium Turkish-made steel security door with multi-point locking system. Fire-rated, sound-insulated, and available in multiple finishes. Includes frame, lock set, and handles.",
    specs: [
      { label: "Material", value: "Cold-rolled Steel" },
      { label: "Lock", value: "Multi-point (5 bolts)" },
      { label: "Size", value: '2100 x 960mm (standard)' },
      { label: "Fire Rating", value: "60 minutes" },
    ],
    inStock: true,
  },
  {
    id: "executive-wc-set",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop",
    ],
    name: "Executive WC Set (Close-Coupled)",
    supplier: "SaniPro Nigeria",
    category: "Sanitary Ware",
    price: 65000,
    priceLabel: "₦65,000",
    unit: "set",
    minOrder: "Min. 1 set",
    location: "Magodo, Lagos",
    rating: 4.7, reviews: 118, verified: true,
    phone: "2348001234567",
    description: "Complete close-coupled WC set with soft-close seat, cistern, and fittings. Dual-flush mechanism (3L/6L) for water efficiency. Ceramic body with glaze finish for easy cleaning.",
    specs: [
      { label: "Type", value: "Close-Coupled" },
      { label: "Flush", value: "Dual (3L / 6L)" },
      { label: "Material", value: "Vitreous China" },
      { label: "Includes", value: "Seat, Cistern, Fittings" },
    ],
    inStock: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export interface BlogPost {
  slug: string;
  image: string;
  category: "Market Insights" | "Guides" | "Product Updates" | "Agent Tips";
  title: string;
  excerpt: string;
  author: string;
  avatar: string;
  date: string;
  readTime: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "lagos-property-market-q1-2026",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=800&fit=crop",
    category: "Market Insights",
    title: "Lagos Property Market Q1 2026: What the Numbers Tell Us",
    excerpt:
      "Lekki leads with 18% price growth, Victoria Island stabilises, and Ajah emerges as the new value corridor for first-time buyers.",
    author: "Adebayo Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    date: "Mar 28, 2026",
    readTime: "8 min read",
    content: [
      "The first quarter of 2026 has been one of the most active periods on record for the Lagos property market. Across the platform, we've tracked over 12,400 verified listings, 3,100 closed transactions and a clear shift in where Nigerian buyers — especially diaspora investors — are putting their money.",
      "Lekki Phase 1 continues its multi-year run as the city's strongest performer, recording an 18% year-on-year price increase on serviced apartments. The story isn't just about prestige anymore: improved road access along the coastal expressway and the maturing schools and retail ecosystem have made Lekki a genuinely livable choice for young families, not just a flipping ground for speculators.",
      "Victoria Island, by contrast, has stabilised. After two years of double-digit growth, prices on prime VI listings rose just 4% in Q1 — a healthy correction that's actually helped close more deals. Sellers are negotiating again, and buyers who were priced out in 2024 are returning.",
      "The most interesting story of the quarter, however, is Ajah. Once dismissed as 'too far,' Ajah is now the fastest-growing search term on PropertyLoop. With 3-bedroom terraces still available under ₦85M and rental yields north of 9%, it's become the go-to value corridor for first-time buyers and small landlords alike.",
      "Looking ahead to Q2, we expect rental demand to outpace sales as the academic year approaches. Agents on the platform should prepare for a surge in shortlet enquiries, particularly along the Lekki–Ajah axis, and sellers in VI may want to lock in deals before the seasonal slowdown in late June.",
    ],
  },
  {
    slug: "first-time-buyers-guide-nigeria",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=800&fit=crop",
    category: "Guides",
    title: "First-Time Buyer's Guide: Everything You Need to Know in Nigeria",
    excerpt:
      "From C of O verification to escrow payments — a complete walkthrough of buying your first property on PropertyLoop.",
    author: "Chioma Okafor",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    date: "Mar 22, 2026",
    readTime: "12 min read",
    content: [
      "Buying your first property in Nigeria can feel overwhelming. Between conflicting advice from family, the maze of legal documents, and the very real risk of falling victim to a scam, it's no wonder so many would-be homeowners delay the decision for years. This guide is designed to give you a clear, end-to-end view of the process.",
      "Step one is always budget. Beyond the asking price, plan for at least 12–15% in transaction costs: agency fees, legal fees, stamp duty, governor's consent and survey costs all add up quickly. If you're financing through a mortgage, factor in an additional 5–10% for the lender's processing and insurance fees.",
      "Step two is verification. Every legitimate property in Nigeria should have either a Certificate of Occupancy (C of O), a Governor's Consent, or a registered Deed of Assignment. PropertyLoop's verified-listing badge means we've checked these documents against the Land Registry — but you should always have your own lawyer do an independent title search before any money changes hands.",
      "Step three is escrow. This is where PropertyLoop's biggest protection kicks in. Instead of paying the seller or agent directly, your funds sit with our Paystack-backed escrow until the property is legally transferred into your name. If something goes wrong, your money comes back. We cannot stress enough how important this is — direct payments are how nearly every property scam in Nigeria works.",
      "Step four is closing. Once title transfers, governor's consent is obtained and the deed is registered, you receive the keys and the listing is closed in your dashboard. Your Property Logbook becomes your permanent record of ownership, repairs and any future maintenance — invaluable when you eventually sell.",
    ],
  },
  {
    slug: "introducing-property-logbook",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=800&fit=crop",
    category: "Product Updates",
    title: "Introducing the Property Logbook: Every Repair, Every Record",
    excerpt:
      "We've launched the Property Logbook — a permanent digital maintenance history attached to every property on the platform.",
    author: "PropertyLoop Team",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    date: "Mar 15, 2026",
    readTime: "5 min read",
    content: [
      "Today we're launching one of the most requested features in PropertyLoop's history: the Property Logbook. From now on, every property listed on the platform carries a permanent, tamper-evident maintenance record that follows it from owner to owner.",
      "The idea is simple. When a vendor completes a job through PropertyLoop's escrow — whether that's a plumbing repair, an electrical inspection or a full renovation — the work is logged against the property automatically. Future buyers can see exactly what's been done, when, and by whom. No more taking the seller's word for it.",
      "For owners, the logbook becomes a quiet asset. We've already seen early users command 4–7% higher resale prices on properties with a complete logbook, simply because buyers trust what they're getting. For agents, it's an honesty tool — and an excellent reason for clients to keep using PropertyLoop vendors instead of going off-platform.",
      "The logbook is live now for all properties. If you've completed work through our service escrow in the last 12 months, those records have been backfilled automatically. Have a look at your dashboard to see your property's history.",
    ],
  },
  {
    slug: "top-agents-50-deals-a-year",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&h=800&fit=crop",
    category: "Agent Tips",
    title: "How Top Agents Close 50+ Deals a Year on PropertyLoop",
    excerpt:
      "We interviewed our highest-performing agents to learn their strategies for lead conversion, client retention, and portfolio growth.",
    author: "Emeka Nwosu",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    date: "Mar 10, 2026",
    readTime: "10 min read",
    content: [
      "Closing 50 deals a year is the kind of number most agents only fantasise about. On PropertyLoop, a small group of agents do it every year — and their playbooks are surprisingly consistent. We sat down with five of our top performers to find out how.",
      "The first lesson: respond fast. Every agent we spoke to had alerts on, replied to enquiries within 10 minutes, and treated speed as a competitive moat. Buyers contact 4–6 agents on average. Whoever calls back first usually gets the booking.",
      "The second lesson: video, video, video. Top agents shoot a short walkthrough of every listing within 24 hours of taking it on. PropertyLoop's video-listing feature has become their best lead generator, far outperforming static photos for both qualified enquiries and time-on-page.",
      "The third lesson: invest in the relationship after the close. The agents who hit 50+ deals don't just collect commissions — they follow up, refer vendors through escrow, and check in months later. About 35% of their deals each year come from past clients or word-of-mouth referrals.",
      "None of this is glamorous, and none of it is a secret. But consistency over a 12-month period, combined with PropertyLoop's tools, is what separates a 10-deal year from a 50-deal year.",
    ],
  },
  {
    slug: "shortlet-market-boom-lagos",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&h=800&fit=crop",
    category: "Market Insights",
    title: "Shortlet Market Boom: Why Lagos Is Africa's Airbnb Capital",
    excerpt:
      "Short-term rentals in Lagos grew 42% in 2025. Here's where the demand is, what guests want, and how to capitalise.",
    author: "Aisha Mohammed",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    date: "Mar 5, 2026",
    readTime: "7 min read",
    content: [
      "Lagos has quietly become the busiest short-let market on the African continent. Bookings on PropertyLoop's shortlet inventory grew 42% in 2025, with average nightly rates up 19%. For owners with the right property in the right location, returns now comfortably exceed long-term rentals.",
      "Demand is concentrated in three corridors: Lekki Phase 1 for business travellers, Victoria Island for diplomatic and corporate stays, and Ikoyi for premium leisure. In all three, occupancy averages above 70% — well ahead of comparable cities like Nairobi and Accra.",
      "What guests want has also shifted. Reliable power, fast Wi-Fi, secure parking and a working backup generator now matter more than swimming pools or designer furniture. The properties with the highest repeat-booking rate aren't the most expensive ones — they're the most consistent.",
      "If you're considering converting a long-let into a shortlet, start with one unit, list it through PropertyLoop's verified shortlet flow, and track the numbers for three months. The market is hot, but the operational discipline matters as much as the location.",
    ],
  },
  {
    slug: "service-escrow-vendor-protection",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&h=800&fit=crop",
    category: "Guides",
    title: "How Service Escrow Protects You When Hiring a Vendor",
    excerpt:
      "Understanding how Paystack escrow works, what happens during disputes, and why you should never pay vendors directly again.",
    author: "PropertyLoop Team",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    date: "Feb 28, 2026",
    readTime: "6 min read",
    content: [
      "Hiring a vendor in Nigeria — a plumber, an electrician, a tiler, a painter — has always carried the same risk: pay upfront and hope for the best, or refuse to pay and watch the vendor walk away. PropertyLoop's service escrow, powered by Paystack, breaks that stalemate.",
      "Here's how it works. When you book a service through PropertyLoop, your payment is held in a secure escrow account. The vendor knows the money is real and committed; you know they don't get it until the job is done to your satisfaction. Both sides have skin in the game.",
      "Once the work is complete, you have 48 hours to confirm satisfaction in your dashboard. If you confirm, funds release to the vendor immediately. If you don't, you can raise a dispute and PropertyLoop's mediation team reviews evidence from both sides — including the vendor's photos, your description, and any prior chat messages — before making a fair determination.",
      "In 2025, fewer than 3% of escrow jobs went to dispute, and the vast majority of those were resolved within 72 hours. Compare that to the horror stories everyone has about vendors who took half-payment and disappeared, and the value of escrow becomes obvious.",
      "Our recommendation is simple: never pay a vendor directly again. If they won't accept escrow, they're telling you something important about how they do business.",
    ],
  },
];

export const getBlogPost = (slug: string): BlogPost | undefined =>
  blogPosts.find((p) => p.slug === slug);

export const getRelatedPosts = (slug: string, limit = 3): BlogPost[] => {
  const current = getBlogPost(slug);
  if (!current) return blogPosts.slice(0, limit);
  return blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a) => (a.category === current.category ? -1 : 1))
    .slice(0, limit);
};

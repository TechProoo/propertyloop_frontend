import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, ScrollText, Handshake } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ease = [0.23, 1, 0.32, 1] as const;

interface Section { id: string; title: string; content: string[] }

const legalContent: Record<string, { title: string; icon: React.ReactNode; updated: string; sections: Section[] }> = {
  privacy: {
    title: "Privacy Policy",
    icon: <ShieldCheck className="w-6 h-6" />,
    updated: "March 1, 2026",
    sections: [
      { id: "collection", title: "1. Information We Collect", content: [
        "We collect information you provide directly: name, email, phone number, and address when you create an account. For agents and vendors, we also collect business details and KYC verification data through Smile Identity.",
        "We automatically collect usage data including IP address, browser type, pages visited, search queries, and property interactions to improve our platform and personalise your experience.",
      ]},
      { id: "usage", title: "2. How We Use Your Information", content: [
        "We use your information to provide and improve PropertyLoop services, process transactions through Paystack, match you with verified agents and vendors, send relevant property alerts, and comply with legal obligations.",
        "Your KYC verification data is used solely for identity verification purposes and is processed by our partner, Smile Identity, under their own privacy policy.",
      ]},
      { id: "sharing", title: "3. Information Sharing", content: [
        "We share your contact information with agents when you enquire about a listing, with vendors when you book a service, and with Paystack for payment processing. We never sell your personal data to third parties.",
        "We may disclose information when required by Nigerian law, to protect PropertyLoop's rights, or to prevent fraud and abuse on the platform.",
      ]},
      { id: "cookies", title: "4. Cookies & Tracking", content: [
        "We use cookies and similar technologies to remember your preferences, analyse platform usage via PostHog, and deliver relevant content. You can manage cookie preferences in your browser settings.",
      ]},
      { id: "rights", title: "5. Your Rights", content: [
        "You have the right to access, correct, or delete your personal data. You can update your information in your dashboard settings or contact us at privacy@propertyloop.ng. Account deletion requests are processed within 30 days.",
      ]},
      { id: "security", title: "6. Data Security", content: [
        "We implement industry-standard security measures including encryption in transit (TLS), secure storage, and regular security audits. Payment data is handled entirely by Paystack and never stored on our servers.",
      ]},
    ],
  },
  terms: {
    title: "Terms of Service",
    icon: <FileText className="w-6 h-6" />,
    updated: "March 1, 2026",
    sections: [
      { id: "acceptance", title: "1. Acceptance of Terms", content: [
        "By accessing or using PropertyLoop, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform. These terms apply to all users: buyers, renters, agents, and vendors.",
      ]},
      { id: "accounts", title: "2. User Accounts", content: [
        "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. PropertyLoop reserves the right to suspend accounts that violate these terms.",
        "Agent and vendor accounts require KYC verification through Smile Identity before they can list properties or accept jobs. Providing false verification information will result in permanent account suspension.",
      ]},
      { id: "listings", title: "3. Property Listings", content: [
        "All property listings must be submitted by KYC-verified agents. Individual landlord listings are not permitted. Agents are responsible for the accuracy of listing information, pricing, and property images.",
        "PropertyLoop reserves the right to remove listings that contain misleading information, inflated pricing, or violate Nigerian property law.",
      ]},
      { id: "payments", title: "4. Payments & Escrow", content: [
        "All payments are processed through Paystack. Escrow payments are held securely until the relevant conditions are met (job completion for services, check-in for shortlets, lease signing for rentals).",
        "PropertyLoop charges a service fee on transactions. Fee rates are displayed before payment confirmation. Refund policies vary by transaction type and are detailed in our Escrow Policy.",
      ]},
      { id: "liability", title: "5. Limitation of Liability", content: [
        "PropertyLoop provides a marketplace platform. We do not own, manage, or inspect properties. While we verify agent and vendor identities, we are not liable for the condition of properties, quality of services, or disputes between users.",
        "Our maximum liability is limited to the service fees collected on the relevant transaction.",
      ]},
      { id: "termination", title: "6. Termination", content: [
        "Either party may terminate the relationship at any time. Upon termination, your data will be handled according to our Privacy Policy. Active escrow transactions will be completed before account closure.",
      ]},
    ],
  },
  "escrow-policy": {
    title: "Escrow Policy",
    icon: <ScrollText className="w-6 h-6" />,
    updated: "March 1, 2026",
    sections: [
      { id: "overview", title: "1. How Escrow Works", content: [
        "PropertyLoop uses Paystack escrow to protect both parties in every transaction. When a payment is initiated, funds are held securely by Paystack — the recipient (vendor, agent, or landlord) cannot access them until the agreed conditions are met.",
      ]},
      { id: "service", title: "2. Service Escrow (Vendors)", content: [
        "When you hire a vendor through the Service Loop, your payment is held in escrow. The vendor completes the work and submits a completion request. You review the work and either confirm completion (releasing funds) or raise a dispute.",
        "Service fees: PropertyLoop retains 10% as a service fee. The vendor receives the remaining 90% upon job confirmation. Completed jobs are auto-logged to the Property Logbook.",
      ]},
      { id: "rental", title: "3. Rental Deposit Escrow", content: [
        "Rental deposits are held in Paystack escrow until the tenancy agreement is signed via DocuSeal. The deposit breakdown (rent, agency fee, legal fee, service fee) is displayed transparently before payment.",
        "If the deal falls through before lease signing, the tenant receives a full refund of the deposit within 5 business days.",
      ]},
      { id: "shortlet", title: "4. Shortlet Booking Escrow", content: [
        "Shortlet payments are held in escrow until check-in is confirmed. Cancellations made 48+ hours before check-in receive a full refund. Cancellations within 48 hours are subject to a 50% charge.",
      ]},
      { id: "disputes", title: "5. Dispute Resolution", content: [
        "If you're unsatisfied with a service or there's a disagreement, you can raise a dispute within 72 hours of job completion. PropertyLoop's dispute team will review evidence from both parties and make a binding decision within 5 business days.",
        "During disputes, funds remain in escrow. Resolution options include: full release to vendor, full refund to client, or a negotiated split.",
      ]},
      { id: "timeline", title: "6. Payment Timeline", content: [
        "Funds are released to vendors within 24 hours of client confirmation. Refunds are processed within 3-5 business days. All transactions are tracked and can be viewed in your dashboard.",
      ]},
    ],
  },
  "agent-agreement": {
    title: "Agent Agreement",
    icon: <Handshake className="w-6 h-6" />,
    updated: "March 1, 2026",
    sections: [
      { id: "eligibility", title: "1. Eligibility & KYC", content: [
        "To list properties on PropertyLoop, you must be a registered real estate agent or work for a registered agency. All agents must complete KYC verification through Smile Identity, providing a valid government-issued ID, proof of address, and agency registration documents.",
        "Verification typically takes 24-48 hours. Your agent badge will be activated once verification is complete. You must update your KYC annually.",
      ]},
      { id: "standards", title: "2. Listing Standards", content: [
        "All listings must include accurate pricing, genuine property photographs (no stock photos), correct address and specifications, and valid property documents (C of O, survey plan, etc.).",
        "Agents must not inflate prices, misrepresent property conditions, or list properties they are not authorised to sell or rent. Violations result in listing removal and potential account suspension.",
      ]},
      { id: "commission", title: "3. Commission & Fees", content: [
        "PropertyLoop does not charge agents to list properties. We earn through service fees on completed transactions (5% on sales, 5% on rental deposits). Agents set their own agency fees separately.",
        "Commission from Paystack-processed transactions is automatically split. Agents receive their share within 24 hours of transaction completion.",
      ]},
      { id: "crm", title: "4. Agent CRM & Tools", content: [
        "Verified agents get access to the Agent Dashboard with CRM tools, lead management, listing analytics, and performance tracking. These tools are provided free as part of the platform.",
      ]},
      { id: "conduct", title: "5. Professional Conduct", content: [
        "Agents must respond to enquiries within 24 hours, maintain accurate availability, conduct viewings professionally, and comply with all Nigerian real estate regulations.",
        "PropertyLoop monitors agent response rates and client reviews. Agents with consistently low ratings or slow response times may have their visibility reduced.",
      ]},
      { id: "termination", title: "6. Termination", content: [
        "Either party may terminate this agreement with 30 days notice. Active listings will remain until their natural expiry. Outstanding escrow transactions will be completed before account closure.",
        "PropertyLoop may immediately suspend agents who engage in fraud, misrepresentation, or illegal activity.",
      ]},
    ],
  },
};

const Legal = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = legalContent[slug || ""];

  if (!page) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">Page not found</h1>
          <Link to="/" className="mt-4 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">{page.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Sidebar TOC */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="lg:w-65 shrink-0 lg:sticky lg:top-8 lg:self-start">
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">{page.icon}</div>
                  <div>
                    <h2 className="font-heading font-bold text-primary-dark text-sm">{page.title}</h2>
                    <p className="text-text-subtle text-[11px]">Updated {page.updated}</p>
                  </div>
                </div>
                <div className="h-px bg-border-light mb-3" />
                <nav className="flex flex-col gap-1.5">
                  {page.sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="text-text-secondary text-xs hover:text-primary transition-colors py-1 truncate">{s.title}</a>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease }} className="flex-1">
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 lg:p-10">
                <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">{page.title}</h1>
                <p className="text-text-subtle text-xs mb-8">Last updated: {page.updated} · PropertyLoop Ltd.</p>

                <div className="flex flex-col gap-8">
                  {page.sections.map((section) => (
                    <div key={section.id} id={section.id}>
                      <h2 className="font-heading font-bold text-primary-dark text-base mb-3">{section.title}</h2>
                      {section.content.map((para, i) => (
                        <p key={i} className="text-text-secondary text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border-light my-8" />
                <p className="text-text-subtle text-xs">
                  If you have questions about this policy, contact us at{" "}
                  <Link to="/contact" className="text-primary hover:underline">hello@propertyloop.ng</Link>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;

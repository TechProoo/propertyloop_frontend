export interface JobListing {
  id: string;
  title: string;
  dept: string;
  location: string;
  type: string;
  posted: string;
  salary?: string;
  applyEmail?: string;
  description?: string;
  responsibilities?: string[];
  successLooks?: string[];
  requirements?: string[];
  whoWeWant?: string[];
  notes?: string[];
}

export const jobs: JobListing[] = [
  {
    id: "business-development-manager",
    title: "Business Development Manager",
    dept: "Marketing",
    location: "Lagos / Remote",
    type: "Full-time",
    posted: "Just posted",
    salary: "₦180,000 – ₦200,000 / month",
    applyEmail: "oyindamola@propertyloop.ng",
    description:
      "PropertyLoop is hiring a Business Development Manager to drive partner onboarding, user acquisition, and platform growth across Nigeria. You'll own the full top-of-funnel — from prospecting strategic partners to closing deals and reporting on results.",
    responsibilities: [
      "Identify and onboard strategic partners (real estate firms, mortgage providers, furniture vendors, home service providers, etc.)",
      "Drive user acquisition through creative, low-cost marketing strategies",
      "Execute daily outreach via WhatsApp, calls, social media, and physical visits",
      "Build and manage relationships with partners to ensure long-term value",
      "Develop and implement marketing campaigns to attract tenants and landlords",
      "Track performance metrics (KPIs) including outreach, conversions, and partnerships closed",
      "Maintain a structured pipeline of leads, follow-ups, and closed deals",
      "Provide weekly reports on growth activities and results",
    ],
    successLooks: [
      "Consistently onboarding new partners",
      "Meeting outreach and conversion targets",
      "Increasing active users on the platform",
      "Building a strong network of business relationships",
    ],
    requirements: [
      "Background in sales, marketing, business development, or related field",
      "Strong communication and persuasion skills",
      "Ability to work independently and take initiative",
      "Comfortable with direct outreach and relationship building",
      "Organized and able to track leads, follow-ups, and performance",
      "Results-oriented mindset with willingness to meet targets",
      "Familiarity with social media and basic digital tools is a plus",
    ],
    whoWeWant: [
      "Someone proactive, resourceful, and execution-focused",
      "Comfortable working in a fast-paced, startup environment",
      "Not afraid to speak to people, pitch ideas, and close deals",
      "Willing to learn and grow into a high-impact role",
    ],
    notes: [
      "This is a performance-driven role. Candidates should be comfortable working with targets and measurable outcomes.",
    ],
  },
];

export function findJob(id: string): JobListing | undefined {
  return jobs.find((j) => j.id === id);
}

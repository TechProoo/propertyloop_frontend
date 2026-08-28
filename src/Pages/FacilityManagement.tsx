import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Wind,
  Droplets,
  Flame,
  Zap,
  ShieldCheck,
  ClipboardList,
  CalendarClock,
  Gauge,
  Building2,
  HardHat,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  BadgeCheck,
  Activity,
  Users,
  FileCheck,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";

import umLogo from "../assets/ultramodern/logo.jpeg";
import umTower from "../assets/ultramodern/site-3.jpg";
import umHvac from "../assets/ultramodern/hvac.jpg";
import umHvacDuct from "../assets/ultramodern/hvac-duct.jpg";
import umPlumbing from "../assets/ultramodern/plumbing.jpg";
import umFire from "../assets/ultramodern/fire.jpg";
import umElectrical from "../assets/ultramodern/electrical.png";
import umTeam from "../assets/ultramodern/site-works.jpg";
import umProjRadisson from "../assets/ultramodern/p1-radisson.jpeg";
import umProjChelsea from "../assets/ultramodern/p2-chelsea.jpeg";
import umProjIbis from "../assets/ultramodern/p3-ibis.jpeg";
import umProjFourPoints from "../assets/ultramodern/p4-fourpoints.jpg";
import umProjDPodium from "../assets/ultramodern/p5-dpodium.jpeg";
import umProjCbn from "../assets/ultramodern/p6-cbn.jpg";
import umProjMoorehouse from "../assets/ultramodern/p7-moorehouse.jpeg";
import umProjGreystone from "../assets/ultramodern/p8-greystone.jpg";
import umProjAhmadu from "../assets/ultramodern/p9-ahmadubello.jpeg";
import umProjKelloggs from "../assets/ultramodern/p10-kelloggs.jpeg";

/* ─── Ultramodern contact details ─── */

const UM_WEBSITE = "https://www.ultramoderneng.com";
const UM_EMAIL_PRIMARY = "oyewo@ultramoderneng.com";
const UM_EMAIL_ALT = "oyewoyinusa@yahoo.com";
const UM_PHONE = "+234 803 354 5484";
const UM_PHONE_TEL = "+2348033545484";
const UM_ADDRESS = "No 33, Fatai Irawo Street, Ajao Estate, Lagos, Nigeria.";

/* ─── Data ─── */

const heroStats = [
  { value: "10+", label: "Landmark projects delivered" },
  { value: "4", label: "MEP disciplines in-house" },
  { value: "6", label: "Sectors served" },
];

/* Discipline blurbs are Ultramodern's own service copy, kept verbatim. */
const disciplines = [
  {
    name: "HVAC",
    tagline: "Heating, ventilation & air conditioning",
    icon: <Wind className="w-5 h-5" />,
    image: umHvac,
    blurb:
      "HVAC system solutions tailored to your needs, maximizing energy efficiency and minimizing costs.",
    scope: [
      "Chilled water systems",
      "Constant & variable air volume",
      "G.I ducting systems",
      "Fabric duct work application",
    ],
  },
  {
    name: "Plumbing",
    tagline: "Indoor & outdoor piping services",
    icon: <Droplets className="w-5 h-5" />,
    image: umPlumbing,
    blurb:
      "Our specialty plumbing solutions are designed with efficiency, functionality, and longevity in mind.",
    scope: [
      "Pump stations & pump rooms",
      "Drainage systems",
      "Portable & domestic water supply",
      "Water treatment plant",
      "LPG central gas systems",
      "Swimming pool / boiler",
    ],
  },
  {
    name: "Fire Safety",
    tagline: "Fire prevention & fighting",
    icon: <Flame className="w-5 h-5" />,
    image: umFire,
    blurb:
      "Our Fire Fighting solutions stop flames at the source, decreasing risk of the fire spreading.",
    scope: [
      "Fire and smoke detectors",
      "Sprinkler systems",
      "Fire hydrants",
      "Pump house",
    ],
  },
  {
    name: "Electrical",
    tagline: "Power, electronics & extra low voltage",
    icon: <Zap className="w-5 h-5" />,
    image: umElectrical,
    blurb:
      "We are safety conscious and fully strap our engineers with state of the art safety gears on field duty.",
    scope: [
      "High & medium voltage",
      "Low voltage",
      "Extra low voltage systems",
      "Electronics & building systems",
    ],
  },
];

const included = [
  {
    title: "Planned preventive maintenance",
    description:
      "A dated service calendar per asset - chillers, pumps, panels, generators, sprinklers - so equipment is serviced before it fails, not after.",
    icon: <CalendarClock className="w-5 h-5" />,
  },
  {
    title: "Reactive callout & repairs",
    description:
      "One number for every breakdown on the property. Ultramodern's engineers attend, diagnose and repair across all four MEP disciplines.",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    title: "Fire & safety compliance",
    description:
      "Detection, sprinkler, hydrant and pump-house checks carried out to international standard, with documentation you can hand to insurers.",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    title: "Energy & running-cost reviews",
    description:
      "HVAC and power loads assessed for efficiency, so the building costs less to run each month rather than quietly more.",
    icon: <Gauge className="w-5 h-5" />,
  },
  {
    title: "Logged to the Property Logbook",
    description:
      "Every visit, part and repair is written into the property's PropertyLoop Logbook - a permanent maintenance history attached to the property ID.",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    title: "Vendor & site supervision",
    description:
      "Cleaners, security and specialist contractors coordinated under one engineering supervisor, with a single monthly report to you.",
    icon: <Users className="w-5 h-5" />,
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us about the building",
    description:
      "Send the property type, size and the systems installed. Residential block, office tower, hotel, hospital or factory - all are in scope.",
  },
  {
    step: "02",
    title: "Site survey & asset register",
    description:
      "Ultramodern's engineers visit, inspect every mechanical and electrical asset, and produce a register with current condition and risk.",
  },
  {
    step: "03",
    title: "Scope, schedule and quote",
    description:
      "You get a written maintenance scope, a visit calendar and a cost. Nothing starts until you approve it.",
  },
  {
    step: "04",
    title: "Managed, logged, reported",
    description:
      "Scheduled visits run to the calendar, callouts are attended as they come, and everything lands in your Property Logbook and monthly report.",
  },
];

const sectors = [
  "Federal & State Governments",
  "Banking",
  "Hospitals",
  "Hotels & Leisure",
  "Real Estate",
  "Oil & Gas",
];

/* Projects as published on ultramoderneng.com/projects */
const projects = [
  {
    name: "Radisson Collection Hotel",
    location: "Ikoyi, Lagos",
    image: umProjRad,
  },
  { name: "Chelsea Hotel", location: "Abuja", image: umProjChelsea },
  { name: "Ibis Hotel", location: "Ajao Estate, Lagos", image: umProjIbis },
  {
    name: "Greystone Tower",
    location: "Victoria Island, Lagos",
    image: umProjGreystone,
  },
  { name: "Ahmadu Bello Way", location: "Lagos", image: umProjAhmadu },
  { name: "D'Podium", location: "Ikeja, Lagos", image: umProjCityHall },
  { name: "CBN Office", location: "Ado-Ekiti Branch", image: umSite1 },
  { name: "Kellogg's Factory", location: "Ibeju-Lekki, Lagos", image: umSite2 },
];

const otherProjects = [
  "Four Points by Sheraton, VI, Lagos",
  "Moorehouse Hotel, Ikoyi, Lagos",
];

const serviceOptions = [
  "Full facility management",
  "HVAC",
  "Plumbing & piping",
  "Fire prevention & fighting",
  "Electrical",
  "Site survey / condition report",
  "Something else",
];

/* ─── Component ─── */

const FacilityManagement = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    property: "",
    location: "",
    service: serviceOptions[0],
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Facility management enquiry - ${form.property || "PropertyLoop"}`;
    const body = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Property / facility: ${form.property}`,
      `Location: ${form.location}`,
      `Service needed: ${form.service}`,
      "",
      form.message,
      "",
      "- Sent from the PropertyLoop Facility Management page",
    ].join("\n");
    window.location.href = `mailto:${UM_EMAIL_PRIMARY}?cc=${UM_EMAIL_ALT}&subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const input =
    "w-full text-sm border border-border-light rounded-xl px-3.5 py-2.5 bg-white/80 text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-subtle";

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="Facility Management"
        description="Facility management for Nigerian buildings - HVAC, plumbing, fire safety and electrical under one contract, delivered on PropertyLoop by Ultramodern Engineering Limited."
        path="/facility-management"
        keywords="facility management Nigeria, building maintenance Lagos, HVAC maintenance, MEP contractor Nigeria, Ultramodern Engineering"
      />
      <Navbar />

      <main
        id="main-content"
        className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0"
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">
              Facility Management
            </span>
          </div>

          {/* ─── Hero ─── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20">
            {/* Left - headline */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border-light text-primary-dark text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Facility Management
                </span>

                <h1 className="font-heading text-[2.25rem] sm:text-[3rem] lg:text-[3.4rem] leading-[1.05] font-bold text-primary-dark tracking-tight mt-6">
                  Buildings That
                  <br />
                  <span className="text-primary">Run Properly.</span>
                  <br />
                  Year Round.
                </h1>

                {/* Discipline chips */}
                <div className="flex items-center gap-3 mt-8">
                  {[
                    { icon: <Wind className="w-4 h-4" />, label: "HVAC" },
                    {
                      icon: <Droplets className="w-4 h-4" />,
                      label: "Plumbing",
                    },
                    {
                      icon: <Flame className="w-4 h-4" />,
                      label: "Fire safety",
                    },
                    { icon: <Zap className="w-4 h-4" />, label: "Electrical" },
                  ].map((c) => (
                    <span
                      key={c.label}
                      title={c.label}
                      aria-label={c.label}
                      className="w-11 h-11 rounded-full bg-white border border-border-light flex items-center justify-center text-primary shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                    >
                      {c.icon}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <div className="flex items-start gap-3">
                  <span className="mt-2.5 w-10 h-px bg-border shrink-0" />
                  <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                    PropertyLoop's facility management is delivered by{" "}
                    <strong className="text-primary-dark font-semibold">
                      Ultramodern Engineering Limited
                    </strong>{" "}
                    - an incorporated electromechanical company covering HVAC,
                    plumbing, fire safety and electrical under one contract.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-7">
                  <a
                    href="#enquiry"
                    className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors duration-300 shadow-[0_4px_16px_rgba(31,111,67,0.25)]"
                  >
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#disciplines"
                    className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white border border-border-light text-primary-dark text-sm font-bold hover:bg-primary/5 transition-colors duration-300"
                  >
                    Explore
                  </a>
                </div>
              </div>
            </div>

            {/* Centre - hero image */}
            <div className="lg:col-span-5">
              <div className="relative h-[420px] lg:h-full lg:min-h-[520px] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
                <img
                  src={umTower}
                  alt="High-rise tower with mechanical services maintained by Ultramodern Engineering"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary-dark/70 via-transparent to-primary-dark/20" />

                {/* Floating labels */}
                <span className="absolute top-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Preventive maintenance
                </span>
                <span className="absolute top-20 right-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Callout & repairs
                </span>

                {/* Stat card */}
                <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] bg-white/15 backdrop-blur-md border border-white/25 p-5">
                  <p className="font-heading text-white text-[2.25rem] leading-none font-bold">
                    10+
                  </p>
                  <p className="text-white/75 text-xs mt-1.5 leading-relaxed">
                    Hotels, banks, factories and towers already delivered across
                    Lagos, Abuja and Ekiti
                  </p>
                </div>
              </div>
            </div>

            {/* Right - offerings */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <div>
                <h2 className="font-heading text-[1.75rem] lg:text-[2rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                  Explore Our Offerings
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mt-3">
                  Whether you manage a single block of flats or a full
                  commercial tower, one contract covers the mechanical,
                  electrical and plumbing systems that keep it running - and
                  every visit is logged against the property.
                </p>
              </div>

              <div className="relative flex-1 min-h-[240px] rounded-[1.75rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <img
                  src={umTeam}
                  alt="Ultramodern Engineering works in progress on site"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary-dark/85 to-primary-dark/10" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  On site
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-heading text-white text-[1.75rem] leading-none font-bold">
                    4
                  </p>
                  <p className="text-white/75 text-[11px] mt-1 leading-relaxed">
                    MEP disciplines under a single supervisor - no juggling
                    separate contractors
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Ultramodern band ─── */}
          <section className="mb-20">
            <div className="bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-8 sm:p-10 lg:p-12">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    PropertyLoop partner
                  </span>

                  <img
                    src={umLogo}
                    alt="Ultramodern Engineering Limited"
                    className="h-12 w-auto object-contain mt-6 mb-6 mix-blend-multiply"
                  />

                  <h2 className="font-heading text-[1.5rem] sm:text-[2rem] leading-[1.15] font-bold text-primary-dark tracking-tight">
                    Managed by Ultramodern Engineering Limited
                  </h2>
                  <p className="text-primary text-sm font-medium mt-2">
                    "Where We Build Your Visions"
                  </p>

                  <div className="mt-5 space-y-4 max-w-2xl">
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Ultramodern Engineering Limited is an incorporated
                      electromechanical company in Nigeria, providing
                      high-quality MEP (Mechanical, Electrical and Plumbing)
                      solutions to Federal and State Governments, the banking
                      industry, hospitals, hotels and leisure, real estate and
                      the oil &amp; gas sector.
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      "The company hold both engineering and construction
                      capabilities and utilizes it to provide personalized,
                      professional, cost effective solutions to our clients
                      without compromising the quality."
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-7">
                    <a
                      href={`tel:${UM_PHONE_TEL}`}
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {UM_PHONE}
                    </a>
                    <a
                      href={UM_WEBSITE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white border border-border-light text-primary-dark text-sm font-semibold hover:bg-primary/5 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      ultramoderneng.com
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-border-light p-8 sm:p-10 lg:p-8 bg-primary/[0.03]">
                  <p className="font-heading font-bold text-primary-dark text-sm mb-5">
                    Sectors served
                  </p>
                  <ul className="flex flex-col gap-3">
                    {sectors.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2.5 text-text-secondary text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="h-px bg-border-light my-6" />

                  <p className="flex items-start gap-2.5 text-text-secondary text-xs leading-relaxed">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {UM_ADDRESS}
                  </p>
                  <p className="flex items-start gap-2.5 text-text-secondary text-xs leading-relaxed mt-3">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    Mon-Fri: 8AM-5PM &middot; Sat: 10AM-2PM
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Disciplines ─── */}
          <section id="disciplines" className="mb-20 scroll-mt-24">
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                Core disciplines
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                Four systems, <span className="text-primary">one contract</span>
              </h2>
              <p className="text-text-secondary text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                The systems that actually take a building out of service -
                cooling, water, fire and power - maintained by the same
                engineering team rather than four separate contractors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {disciplines.map((d) => (
                <article
                  key={d.name}
                  className="bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary-dark/75 to-transparent" />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-semibold">
                      <span className="text-primary">{d.icon}</span>
                      {d.name}
                    </span>
                    <p className="absolute bottom-4 left-4 right-4 text-white/85 text-xs">
                      {d.tagline}
                    </p>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {d.blurb}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-5">
                      {d.scope.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-primary-dark text-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ─── What a contract covers ─── */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                What a contract covers
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                Maintenance you can <span className="text-primary">prove</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {included.map((i) => (
                <div
                  key={i.title}
                  className="bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-7 hover:border-primary/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                    {i.icon}
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-base mb-2">
                    {i.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {i.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-primary-dark rounded-3xl p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">
                    Every visit lands in the Property Logbook
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mt-1 max-w-xl">
                    Maintenance history follows the property, not the manager -
                    so when it is time to sell or re-let, the service record is
                    already there.
                  </p>
                </div>
              </div>
              <Link
                to="/logbook/about"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors shrink-0"
              >
                About the Logbook
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ─── How it works ─── */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                How it works
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                From first call to{" "}
                <span className="text-primary">running contract</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className="bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-7"
                >
                  <span className="font-heading text-primary/25 text-[2.5rem] leading-none font-bold">
                    {s.step}
                  </span>
                  <h3 className="font-heading font-bold text-primary-dark text-base mt-3 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Track record ─── */}
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                  Track record
                </p>
                <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                  Buildings already{" "}
                  <span className="text-primary">in their hands</span>
                </h2>
              </div>
              <a
                href={`${UM_WEBSITE}/projects`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all"
              >
                View all projects
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {projects.map((p) => (
                <div
                  key={p.name}
                  className="relative h-52 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] group"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary-dark/85 via-primary-dark/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-heading font-bold text-white text-sm leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-white/60 text-xs mt-0.5">{p.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="text-text-subtle text-xs">Also delivered:</span>
              {otherProjects.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border-light text-primary-dark text-xs font-medium"
                >
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  {p}
                </span>
              ))}
            </div>
          </section>

          {/* ─── Enquiry ─── */}
          <section id="enquiry" className="mb-20 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form */}
              <div className="lg:col-span-7 bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 sm:p-10">
                <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                  Request a survey
                </p>
                <h2 className="font-heading text-[1.5rem] sm:text-[2rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                  Tell us about your building
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mt-3">
                  Send the details and Ultramodern's team will come back with a
                  survey date and a scope. This opens your mail app, addressed
                  to the facility management desk.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div>
                    <label
                      htmlFor="fm-name"
                      className="block text-primary-dark text-xs font-semibold mb-1.5"
                    >
                      Your name
                    </label>
                    <input
                      id="fm-name"
                      required
                      className={input}
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fm-phone"
                      className="block text-primary-dark text-xs font-semibold mb-1.5"
                    >
                      Phone
                    </label>
                    <input
                      id="fm-phone"
                      required
                      className={input}
                      placeholder="080..."
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fm-property"
                      className="block text-primary-dark text-xs font-semibold mb-1.5"
                    >
                      Property / facility
                    </label>
                    <input
                      id="fm-property"
                      required
                      className={input}
                      placeholder="e.g. 12-unit block, office tower"
                      value={form.property}
                      onChange={(e) =>
                        setForm({ ...form, property: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fm-location"
                      className="block text-primary-dark text-xs font-semibold mb-1.5"
                    >
                      Location
                    </label>
                    <input
                      id="fm-location"
                      required
                      className={input}
                      placeholder="e.g. Lekki, Lagos"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fm-service"
                      className="block text-primary-dark text-xs font-semibold mb-1.5"
                    >
                      What do you need?
                    </label>
                    <select
                      id="fm-service"
                      className={input}
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                    >
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fm-message"
                      className="block text-primary-dark text-xs font-semibold mb-1.5"
                    >
                      Anything else
                    </label>
                    <textarea
                      id="fm-message"
                      rows={4}
                      className={`${input} resize-none`}
                      placeholder="Systems installed, current problems, preferred survey date..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors duration-300 shadow-[0_4px_16px_rgba(31,111,67,0.25)]"
                    >
                      Send enquiry
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Direct contact */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-primary-dark rounded-3xl p-8 sm:p-9">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
                    <HardHat className="w-3.5 h-3.5" />
                    Facility management desk
                  </span>
                  <h3 className="font-heading font-bold text-white text-xl mt-5">
                    Ultramodern Engineering Limited
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed mt-2">
                    Reach the team directly - by phone during working hours, or
                    by email any time.
                  </p>

                  <div className="flex flex-col gap-3 mt-7">
                    {[
                      {
                        label: "Phone",
                        value: UM_PHONE,
                        href: `tel:${UM_PHONE_TEL}`,
                        icon: <Phone className="w-4 h-4" />,
                        external: false,
                      },
                      {
                        label: "Email",
                        value: UM_EMAIL_PRIMARY,
                        href: `mailto:${UM_EMAIL_PRIMARY}`,
                        icon: <Mail className="w-4 h-4" />,
                        external: false,
                      },
                      {
                        label: "Alternate email",
                        value: UM_EMAIL_ALT,
                        href: `mailto:${UM_EMAIL_ALT}`,
                        icon: <Mail className="w-4 h-4" />,
                        external: false,
                      },
                      {
                        label: "Website",
                        value: "www.ultramoderneng.com",
                        href: UM_WEBSITE,
                        icon: <Globe className="w-4 h-4" />,
                        external: true,
                      },
                    ].map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        {...(c.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="flex items-center gap-3 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/12 px-4 py-3.5 transition-colors"
                      >
                        <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                          {c.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-white/45 text-[11px]">
                            {c.label}
                          </span>
                          <span className="block text-white text-sm font-semibold truncate">
                            {c.value}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="relative flex-1 min-h-[180px] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <img
                    src={umHvacDuct}
                    alt="Commercial HVAC ductwork installation"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary-dark/85 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <p className="text-white/85 text-xs leading-relaxed">
                      Already listed on PropertyLoop? Mention your property ID
                      and the contract links straight to its Logbook.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Closing stats ─── */}
          <section className="mb-20">
            <div className="bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {heroStats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-heading text-primary text-[2.5rem] leading-none font-bold">
                      {s.value}
                    </p>
                    <p className="text-text-secondary text-sm mt-2">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacilityManagement;

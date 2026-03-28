import { useState } from "react";
import heroImg from "../../assets/hero_img_2.jpg";

const tabs = ["Buy", "Rent", "Sell"] as const;

const Hero = () => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Buy");

  return (
    <section className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* Decorative shape — upper area, green-tinted glass */}
      <div
        className="absolute hidden lg:block"
        style={{
          top: 0,
          left: "15%",
          width: "80%",
          height: "55%",
          background: "rgba(31, 111, 67, 0.06)",
          borderRadius: "0 0 50px 50px",
          zIndex: 0,
        }}
      />

      {/* Hero image — right side */}
      <div
        className="absolute hidden lg:block"
        style={{
          top: "8%",
          left: "40%",
          right: 0,
          bottom: 0,
          zIndex: 2,
        }}
      >
        <img
          src={heroImg}
          alt="Modern luxury home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
      </div>

      {/* Mobile hero image */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src={heroImg}
          alt="Modern luxury home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-bg/90 via-bg/70 to-bg/30" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-20 pb-8 pt-4 lg:pt-8">
        {/* Top content */}
        <div>
          {/* Heading */}
          <h1 className="font-heading text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] xl:text-[3.8rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
            Connecting you{" "}
            <span className="text-primary">to the</span>
            <br />
            home{" "}
            <span className="italic font-normal text-primary-dark">
              you love
            </span>
          </h1>

          {/* Search Box — glassmorphism */}
          <div className="flex flex-col gap-3 max-w-[320px] mt-8 lg:mt-10">
            {/* Pill Tabs — glass */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 text-sm font-medium rounded-full border transition-all ${
                    activeTab === tab
                      ? "backdrop-blur-md bg-white/70 text-primary-dark border-white/50 shadow-sm"
                      : "backdrop-blur-sm bg-white/30 text-text-secondary border-white/30 hover:bg-white/50 hover:text-primary-dark"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input — glass card */}
            <div className="flex items-center backdrop-blur-md bg-white/70 rounded-full border border-white/50 shadow-lg shadow-glow/10 pl-4 pr-1.5 py-1">
              <input
                type="text"
                placeholder="Address, School, City or Market"
                className="flex-1 text-sm text-primary-dark placeholder-text-subtle outline-none bg-transparent py-2"
              />
              <button className="w-9 h-9 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors shrink-0 shadow-lg shadow-glow/40">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row — quote left, property card right */}
        <div className="flex items-end justify-between gap-6">
          {/* Quote */}
          <div className="hidden sm:block max-w-[240px] relative">
            <span className="text-primary/15 text-6xl font-heading leading-none absolute -top-7 -left-3 select-none">
              &ldquo;
            </span>
            <p className="text-text-secondary text-[13px] leading-relaxed italic pl-3 pt-3">
              "Turning your dreams into reality, one home at a time. Let us
              guide you to your perfect place."
            </p>
          </div>

          {/* Property Card — glassmorphism */}
          <div className="backdrop-blur-xl bg-white/65 rounded-2xl shadow-lg shadow-glow/10 border border-white/40 px-5 py-4 flex items-center gap-4 ml-auto max-w-[380px]">
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-primary-dark text-[15px]">
                Bismillah House
              </h3>
              <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">
                Contemporary home featuring exceptional
                <br />
                interior design.
              </p>
              <div className="mt-2.5 inline-block border border-primary-dark rounded-full px-4 py-1.5 text-xs font-semibold text-primary-dark">
                USD 560,000
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-2 shrink-0">
              <button className="w-10 h-10 rounded-full border border-white/50 backdrop-blur-sm bg-white/40 flex items-center justify-center hover:bg-white/70 transition-colors">
                <svg
                  className="w-4 h-4 text-primary-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition-colors shadow-lg shadow-glow/40">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

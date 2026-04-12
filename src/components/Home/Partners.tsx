import { motion } from "framer-motion";

const partners = [
  {
    name: "Access Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Access_Bank_Plc_logo.svg/2560px-Access_Bank_Plc_logo.svg.png",
  },
  {
    name: "GTBank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Guaranty_Trust_Holding_Company_logo.svg/2560px-Guaranty_Trust_Holding_Company_logo.svg.png",
  },
  {
    name: "FIRS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Coat_of_arms_of_Nigeria.svg/200px-Coat_of_arms_of_Nigeria.svg.png",
  },
  {
    name: "Paystack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Paystack_Logo.png/1200px-Paystack_Logo.png",
  },
  {
    name: "Dangote Group",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Dangote-Group-Logo.svg/1200px-Dangote-Group-Logo.svg.png",
  },
  {
    name: "First Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/First_Bank_of_Nigeria_logo.svg/2560px-First_Bank_of_Nigeria_logo.svg.png",
  },
];

const Partners = () => {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-16 lg:py-20 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-medium tracking-wide uppercase mb-3">
            Our Partners
          </p>
          <h2 className="font-heading text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
            Trusted by <span className="text-primary">industry leaders</span>
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mt-4 max-w-lg mx-auto">
            We partner with top financial institutions, payment providers, and
            organisations to deliver a seamless property experience.
          </p>
        </div>

        {/* Logo grid */}
        <div className="bg-white/60 backdrop-blur-sm border border-border-light rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3">
          <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-[22px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] px-8 py-10 sm:px-12 sm:py-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10 items-center">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-8 sm:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;

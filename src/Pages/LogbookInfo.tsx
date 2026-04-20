import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, CheckCircle, Users } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const LogbookInfo = () => {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-8 pb-0">
        {/* Hero */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-text-secondary hover:text-primary transition-colors text-sm font-medium mb-6"
            >
              ← Back to home
            </Link>
          </div>

          <div className="mb-8">
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-3">
              Property Logbook
            </p>
            <h1 className="font-heading text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight mb-4">
              Every Repair. Every Record.
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              A permanent digital history of every maintenance, repair, and service record for your property. Building trust through transparency.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-text-secondary mb-2">Total Properties</p>
                <p className="font-heading text-3xl font-bold text-primary-dark">500+</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">Service Records</p>
                <p className="font-heading text-3xl font-bold text-primary-dark">2,400+</p>
              </div>
            </div>
            <p className="text-text-secondary">
              PropertyLoop properties are automatically assigned digital logbooks that track every service, repair, and maintenance activity. Each entry is verified and timestamped for complete transparency.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="font-heading text-3xl font-bold text-primary-dark mb-12 text-center">
            Why Property Logbooks Matter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Build Trust",
                description:
                  "Verified service records prove property maintenance and condition. Buyers and tenants feel confident knowing the complete history.",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Save Time",
                description:
                  "No more searching through receipts and documents. All maintenance records are organized and accessible in one place.",
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Increase Value",
                description:
                  "Well-maintained properties with documented service history command higher prices and rent faster.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Transparency",
                description:
                  "Share relevant logbook entries with buyers, tenants, and contractors. Full control over what information is visible.",
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 hover:shadow-[0_8px_24px_rgba(31,111,67,0.15)] transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-heading font-bold text-primary-dark text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="font-heading text-3xl font-bold text-primary-dark mb-12 text-center">
            How It Works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Property Listed",
                description:
                  "When you list a property on PropertyLoop, it automatically receives a unique digital logbook.",
              },
              {
                step: "2",
                title: "Service Recorded",
                description:
                  "Any maintenance, repair, or service is recorded with photos, dates, vendor details, and costs.",
              },
              {
                step: "3",
                title: "Verified Entry",
                description:
                  "Each logbook entry is timestamped and verified for authenticity and accuracy.",
              },
              {
                step: "4",
                title: "Shared Securely",
                description:
                  "Share relevant entries with buyers, tenants, or contractors while maintaining privacy.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="font-heading font-bold text-primary-dark text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-12 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-dark mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Create your account and start building property logbooks for your listings today.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LogbookInfo;

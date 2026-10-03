import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import heroImg1 from "../../assets/hero_img_1.jpg";
import heroImg2 from "../../assets/hero_img_2.jpg";
import hs1 from "../../assets/hs1.avif";
import lek from "../../assets/lek.jpg";

const HERO_CARDS = [
  {
    title: "Find your dream home",
    cta: "Browse homes",
    href: "/buy",
    bg: "#e3efe7",
    image: heroImg1,
  },
  {
    title: "Rent with confidence",
    cta: "Browse rentals",
    href: "/rent",
    bg: "#f5ead4",
    image: heroImg2,
  },
  {
    title: "Book a shortlet",
    cta: "Browse shortlets",
    href: "/shortlet",
    bg: "#dae8f5",
    image: hs1,
  },
  {
    title: "Find a verified agent",
    cta: "Browse agents",
    href: "/find-agent",
    bg: "#ecdaf7",
    image: lek,
  },
];

export default function StockHero() {
  return (
    <section className="relative bg-[#f5f0eb]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-[#0f2e1b] via-[#0f2e1b]/50 to-transparent" />

      <div className="relative mx-auto max-w-360 px-4 pt-5 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_CARDS.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group flex flex-col rounded-sm p-5 pb-3 shadow-sm transition-shadow hover:shadow-md"
              style={{ backgroundColor: card.bg }}
            >
              <h2 className="text-xl font-bold leading-tight text-[#0f1111]">
                {card.title}
              </h2>
              <div className="mt-3 aspect-4/3 overflow-hidden rounded-sm">
                <img
                  src={card.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-3 inline-flex items-center gap-0.5 text-[13px] font-medium text-primary hover:text-primary-dark hover:underline">
                {card.cta}
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

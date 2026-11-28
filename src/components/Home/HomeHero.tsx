import { useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ArrowUpRight, MapPin, Search, ShoppingBag } from "lucide-react";
import type { Listing } from "../../api/types";
import { IMG, sizedImage } from "../../lib/imageSize";
import avenue from "../../assets/hero_img_2.jpg";
import { PRODUCT_MARKETPLACE } from "../../config/features";
import "./landing.css";

const modes = [
  {
    label: "Buy",
    path: "/buy",
    prompt: "City or area",
    popular: ["Lekki", "Ikoyi", "Ajah"],
  },
  {
    label: "Rent",
    path: "/rent",
    prompt: "City or area",
    popular: ["Yaba", "Surulere", "Gbagada"],
  },
  {
    label: "Shortlet",
    path: "/shortlet",
    prompt: "City or area",
    popular: ["Victoria Island", "Ikoyi", "Lekki"],
  },
  ...(PRODUCT_MARKETPLACE
    ? [
        {
          label: "Shop",
          path: "/marketplace/products",
          prompt: "Product name",
          popular: ["Sofas", "Tiles", "Lighting"],
        },
      ]
    : []),
];

export default function HomeHero({ stock }: { stock: Listing[] }) {
  const [failedPhotos, setFailedPhotos] = useState<string[]>([]);
  const featured = stock.find(
    (home) => home.coverImage && !failedPhotos.includes(home.coverImage),
  );
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState(modes[0]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const shopping = mode.label === "Shop";

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
        entrance
          .from(".landing-photo img", { scale: 1.055, duration: 1.35 })
          .from(
            ".landing-intro [data-enter]",
            { y: 16, opacity: 0, stagger: 0.09, duration: 0.68 },
            0,
          )
          .from(".landing-finder", { y: 12, opacity: 0, duration: 0.55 }, 0.18);
      },
      root,
    );
    return () => media.revert();
  }, []);

  function destination(term: string) {
    return term.trim()
      ? mode.path + "?q=" + encodeURIComponent(term.trim())
      : mode.path;
  }

  return (
    <section
      className="landing-cover"
      ref={root}
      aria-labelledby="landing-title"
    >
      <div className="landing-spread">
        <div className="landing-intro">
          <p className="landing-kicker" data-enter>
            Property search / Nigeria
          </p>
          <h1 id="landing-title" data-enter>
            Nigerian homes,
            <br />
            <em>in focus.</em>
          </h1>
          <p className="landing-deck" data-enter>
            Find a home to buy, a place to rent or a short stay across Nigeria.
          </p>
        </div>
        <div className="landing-finder">
          <form
            aria-label="Find a home or product"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(destination(query));
            }}
          >
            <div
              className="landing-modes"
              role="group"
              aria-label="Search category"
            >
              {modes.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  aria-pressed={mode === item}
                  onClick={() => {
                    setMode(item);
                    setQuery("");
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="landing-field">
              {shopping ? <ShoppingBag size={20} /> : <MapPin size={20} />}
              <span>
                <b>{shopping ? "Product" : "Location"}</b>
                <input
                  aria-label={
                    shopping ? "Product to search for" : "City, area or estate"
                  }
                  placeholder={mode.prompt}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </span>
            </label>
            <button className="landing-submit">
              <Search size={17} /> Search
            </button>
          </form>
          <div className="landing-popular">
            <span>Popular {shopping ? "searches" : "areas"}</span>
            {mode.popular.map((term) => (
              <Link key={term} to={destination(term)}>
                {term}
                <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
        <Link
          className="landing-photo"
          to={featured ? "/property/" + featured.id : "/buy"}
        >
          <img
            key={featured?.coverImage ?? avenue}
            src={featured ? sizedImage(featured.coverImage, IMG.hero) : avenue}
            alt={featured ? "" : "Palm-lined avenue of contemporary townhouses"}
            fetchPriority="high"
            onError={
              featured
                ? () =>
                    setFailedPhotos((current) => [
                      ...current,
                      featured.coverImage,
                    ])
                : undefined
            }
          />
          <div className="landing-caption">
            <div>
              <span>
                {featured ? featured.location : "Explore the collection"}
              </span>
              <strong>{featured ? featured.title : "Homes for sale"}</strong>
              {featured && (
                <small>
                  {featured.priceLabel}{" "}
                  {featured.period && "/ " + featured.period.toLowerCase()}
                </small>
              )}
            </div>
            <span className="landing-photo-arrow">
              <ArrowUpRight aria-hidden="true" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

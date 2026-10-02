import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Bath, Bed, Maximize } from "lucide-react";
import { sizedImage } from "../../lib/imageSize";
import type { TileData } from "./tileData";

/**
 * One property, as a card — the only property card the home page uses.
 *
 * Two shapes:
 *   panel  the row at the top, where the name leads and the photo is tall
 *   tile   the grids below, where the photo leads
 *
 * It takes a plain shape rather than a Listing, because the same card has to
 * carry a paid featured placement too, and those are a different record. The
 * sections used to each own a card, and drifted apart every time one was
 * touched.
 */

function Meta({ data }: { data: TileData }) {
  const bits: { icon: typeof Bed; text: string }[] = [];
  if (data.beds > 0) bits.push({ icon: Bed, text: `${data.beds} bed` });
  if (data.baths > 0) bits.push({ icon: Bath, text: `${data.baths} bath` });
  if (data.sqft) bits.push({ icon: Maximize, text: `${data.sqft} m²` });
  if (bits.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-subtle">
      {bits.map(({ icon: Icon, text }) => (
        <span key={text} className="inline-flex items-center gap-1">
          <Icon className="h-3.5 w-3.5" />
          {text}
        </span>
      ))}
    </div>
  );
}

/** The photo, with the state of the listing written on it. */
function Photo({
  data,
  className,
  width,
  badge,
}: {
  data: TileData;
  className: string;
  width: number;
  badge?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-primary/5 ${className}`}>
      {data.coverImage ? (
        <img
          src={sizedImage(data.coverImage, width)}
          alt={data.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        // Stock is often filed before its photographs arrive. Saying so beats
        // a broken frame or an empty grey box.
        <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs font-medium text-primary/50">
          Photos coming
        </div>
      )}

      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        {badge && (
          <span className="rounded-full bg-primary px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white">
            {badge}
          </span>
        )}
        <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-primary-dark backdrop-blur-sm">
          {data.typeLabel}
        </span>
      </div>

      {data.verified && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold text-primary-dark backdrop-blur-sm">
          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
          Verified
        </span>
      )}
    </div>
  );
}

export default function PropertyTile({
  data,
  variant = "tile",
  badge,
}: {
  data: TileData;
  variant?: "panel" | "tile";
  badge?: string;
}) {
  const price = (
    <p className="font-heading truncate text-[17px] font-bold leading-none text-primary-dark sm:text-[19px]">
      {data.priceLabel}
      {data.period && (
        <span className="ml-1 text-[12px] font-semibold text-text-subtle">
          /{data.period.toLowerCase()}
        </span>
      )}
    </p>
  );

  const shell =
    "group flex h-full flex-col rounded-3xl bg-white shadow-[0_2px_14px_rgba(16,36,25,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(16,36,25,0.12)]";

  if (variant === "panel") {
    return (
      <Link to={data.href} className={`${shell} p-4`}>
        <h3 className="font-heading line-clamp-2 text-[20px] font-bold leading-[1.15] tracking-tight text-primary-dark sm:text-[22px]">
          {data.title}
        </h3>
        <p className="mt-1.5 line-clamp-1 text-[13px] text-text-secondary">
          {data.location}
        </p>

        <Photo data={data} badge={badge} width={640} className="mt-3 aspect-[4/5] w-full" />

        <div className="mt-3.5 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            {price}
            <Meta data={data} />
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold text-primary transition-transform duration-300 group-hover:translate-x-0.5">
            See details
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={data.href} className={`${shell} p-3`}>
      <Photo data={data} badge={badge} width={640} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        <h3 className="font-heading line-clamp-2 text-[15px] font-bold leading-snug text-primary-dark">
          {data.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[12.5px] text-text-subtle">
          {data.location}
        </p>
        <Meta data={data} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="min-w-0 flex-1">{price}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-bold text-primary transition-transform duration-300 group-hover:translate-x-0.5">
            View
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

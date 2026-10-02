import type { Listing } from "../../api/types";
import type { FeaturedProperty } from "../../api/services/featuredProperties";

/**
 * The shape every property card is drawn from.
 *
 * Separate from the card itself so one card can carry both an ordinary
 * listing and a paid featured placement, which are different records.
 */

export interface TileData {
  id: string;
  href: string;
  title: string;
  location: string;
  priceLabel: string;
  period?: string | null;
  coverImage: string;
  beds: number;
  baths: number;
  sqft?: string | null;
  verified?: boolean;
  typeLabel: string;
}

const TYPE_LABEL: Record<string, string> = {
  SALE: "For sale",
  RENT: "For rent",
  SHORTLET: "Shortlet",
};

export function listingToTile(listing: Listing): TileData {
  return {
    id: listing.id,
    href: `/property/${listing.id}`,
    title: listing.title,
    location: listing.location,
    priceLabel: listing.priceLabel,
    period: listing.period,
    coverImage: listing.coverImage,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft,
    verified: listing.verified,
    typeLabel: TYPE_LABEL[listing.type] ?? listing.type,
  };
}

/** A paid placement. Its own route, because it is not an ordinary listing. */
export function featuredToTile(featured: FeaturedProperty): TileData {
  return {
    id: featured.id,
    href: `/featured-property/${featured.id}`,
    title: featured.title,
    location: featured.location,
    priceLabel: featured.priceLabel,
    coverImage: featured.imageUrls[0] ?? "",
    beds: featured.beds,
    baths: featured.baths,
    sqft: featured.sqft,
    typeLabel: TYPE_LABEL[featured.type] ?? featured.type,
  };
}

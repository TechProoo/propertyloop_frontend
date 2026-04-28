/**
 * <Seo /> — page-level metadata using React 19's native head hoisting.
 *
 * React 19 hoists <title>, <meta>, and <link> rendered anywhere in the tree
 * straight into <head>, so we don't need react-helmet-async.
 *
 * Usage:
 *   <Seo title="Buy Property" description="..." path="/buy" />
 *   <Seo title="Listing — Lekki" image="https://..." type="article" />
 */
import { useMemo } from "react";

const SITE_NAME = "PropertyLoop";
const SITE_URL = "https://www.propertyloop.ng";
const DEFAULT_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;
const DEFAULT_DESCRIPTION =
  "Nigeria's all-in-one real estate platform. Buy, rent and sell properties, find verified agents, book shortlets, and hire trusted service vendors with secure escrow.";

export interface SeoProps {
  /** Page title — gets " — PropertyLoop" appended unless titleSuffix is overridden */
  title: string;
  /** Description (≤ 160 chars ideally) */
  description?: string;
  /** Site-relative path for canonical + og:url, e.g. "/buy" */
  path?: string;
  /** Absolute image URL for og:image */
  image?: string;
  /** og:type — "website" by default, use "article" for property/agent/vendor pages */
  type?: "website" | "article" | "profile";
  /** Comma-separated keywords */
  keywords?: string;
  /** Pass false to discourage indexing on this page */
  noIndex?: boolean;
  /** Override the default " — PropertyLoop" suffix */
  titleSuffix?: string;
  /** Optional JSON-LD structured data object */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  keywords,
  noIndex = false,
  titleSuffix = ` — ${SITE_NAME}`,
  jsonLd,
}: SeoProps) {
  const fullTitle = title.endsWith(SITE_NAME) ? title : `${title}${titleSuffix}`;
  const url = path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;

  // Stable JSON string for jsonLd so React doesn't unnecessarily re-mount it
  const jsonLdString = useMemo(
    () => (jsonLd ? JSON.stringify(jsonLd) : null),
    [jsonLd],
  );

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_NG" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLdString && (
        <script
          type="application/ld+json"
          // React 19 hoists this; using dangerouslySetInnerHTML to avoid quote issues
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      )}
    </>
  );
}

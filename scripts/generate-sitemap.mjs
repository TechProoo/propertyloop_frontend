// Builds public/sitemap.xml from the static route table plus whatever the API
// currently exposes (listings, featured properties, agents, vendors).
//
// Runs as `prebuild`, so every deploy ships a sitemap matching that deploy's
// content. If the API is unreachable the static routes are still written and
// the build carries on — a slightly stale sitemap beats a failed deploy.
//
// URLs use the apex host deliberately: www.propertyloop.ng 301s to it, and a
// sitemap should list final URLs, never redirects.
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://propertyloop.ng";
const configuredApi =
  process.env.VITE_API_URL ||
  "https://propertyloopbackend-production.up.railway.app/api";
const API = configuredApi.replace(
  /^https:\/\/propertyloop-backend\.up\.railway\.app(?=\/|$)/,
  "https://propertyloopbackend-production.up.railway.app",
);

const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/sitemap.xml",
);

// Public, indexable pages. Anything behind auth (dashboards, checkout, admin,
// settings, messages) is intentionally absent — robots.txt disallows those.
const STATIC_ROUTES = [
  ["/", "daily", "1.0"],
  ["/buy", "daily", "0.9"],
  ["/rent", "daily", "0.9"],
  ["/shortlet", "daily", "0.8"],
  ["/featured", "daily", "0.8"],
  ["/sell", "weekly", "0.8"],
  ["/services", "weekly", "0.8"],
  ["/facility-management", "monthly", "0.7"],
  ["/new-developments", "weekly", "0.7"],
  ["/find-agent", "weekly", "0.7"],
  // Agent Partner Programme — the recruitment page realtors are sent to.
  ["/realtors/partners", "monthly", "0.8"],
  ["/video-tours", "weekly", "0.7"],
  ["/how-it-works", "monthly", "0.6"],
  ["/pricing", "monthly", "0.6"],
  ["/advertise", "monthly", "0.6"],
  ["/about", "monthly", "0.6"],
  ["/feed", "daily", "0.5"],
  ["/logbook", "weekly", "0.5"],
  ["/logbook/about", "monthly", "0.5"],
  ["/contact", "monthly", "0.5"],
  ["/careers", "monthly", "0.5"],
  ["/blog", "weekly", "0.4"],
  ["/legal/terms", "yearly", "0.3"],
  ["/legal/privacy", "yearly", "0.3"],
];

const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** W3C date (YYYY-MM-DD), or null when the record carries no usable date. */
function lastmod(record) {
  const raw = record?.updatedAt || record?.createdAt;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

async function getJson(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}

/**
 * Walks a paginated collection. Capped so a runaway `pages` value from the API
 * can never spin the build forever.
 */
async function getAllPaginated(path, { limit = 100, maxPages = 50 } = {}) {
  const out = [];
  for (let page = 1; page <= maxPages; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const data = await getJson(`${path}${sep}limit=${limit}&page=${page}`);
    const items = Array.isArray(data) ? data : (data.items ?? []);
    out.push(...items);
    const pages = Array.isArray(data) ? 1 : (data.pages ?? 1);
    if (page >= pages || items.length === 0) break;
  }
  return out;
}

/**
 * Each source is fetched independently: one failing collection costs only its
 * own URLs rather than the whole sitemap.
 */
async function collect(label, fn) {
  try {
    const urls = await fn();
    console.log(`  ${label}: ${urls.length}`);
    return urls;
  } catch (err) {
    console.warn(`  ${label}: skipped (${err.message})`);
    return [];
  }
}

async function main() {
  console.log(`Generating sitemap from ${API}`);

  const dynamic = (
    await Promise.all([
      collect("listings", async () =>
        (await getAllPaginated("/listings"))
          .filter((l) => l.id && l.status !== "SOLD" && l.status !== "RENTED")
          .map((l) => ({
            loc: `/property/${l.id}`,
            changefreq: "daily",
            priority: "0.8",
            lastmod: lastmod(l),
          })),
      ),
      collect("featured properties", async () =>
        (await getAllPaginated("/featured-properties"))
          .filter((p) => p.id)
          .map((p) => ({
            loc: `/featured-property/${p.id}`,
            changefreq: "weekly",
            priority: "0.7",
            lastmod: lastmod(p),
          })),
      ),
      collect("agents", async () =>
        (await getAllPaginated("/agents"))
          .filter((a) => a.id)
          .map((a) => ({
            loc: `/agent/${a.id}`,
            changefreq: "weekly",
            priority: "0.6",
            lastmod: lastmod(a),
          })),
      ),
      collect("vendors", async () =>
        (await getAllPaginated("/vendors"))
          .filter((v) => v.id)
          .map((v) => ({
            loc: `/vendor/${v.id}`,
            changefreq: "weekly",
            priority: "0.6",
            lastmod: lastmod(v),
          })),
      ),
    ])
  ).flat();

  const entries = [
    ...STATIC_ROUTES.map(([loc, changefreq, priority]) => ({
      loc,
      changefreq,
      priority,
      lastmod: null,
    })),
    ...dynamic,
  ];

  // Guard against an API that returns the same record twice across pages.
  const seen = new Set();
  const unique = entries.filter((e) =>
    seen.has(e.loc) ? false : (seen.add(e.loc), true),
  );

  const body = unique
    .map((e) => {
      const lines = [
        `    <loc>${xmlEscape(SITE + e.loc)}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
      ].filter(Boolean);
      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/generate-sitemap.mjs — do not edit by hand. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, xml, "utf8");
  console.log(
    `Wrote ${unique.length} URLs (${STATIC_ROUTES.length} static, ${unique.length - STATIC_ROUTES.length} dynamic) to public/sitemap.xml`,
  );
}

main().catch((err) => {
  // Never break the build over a sitemap.
  console.error(`Sitemap generation failed: ${err.message}`);
  process.exit(0);
});

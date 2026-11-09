import "server-only";

/**
 * NASA Astronomy Picture of the Day.
 *
 * APOD now lives on science.nasa.gov (https://science.nasa.gov/apod). The old
 * api.nasa.gov/planetary/apod endpoint returns placeholder data since that move,
 * so we read the public WordPress JSON API of science.nasa.gov instead.
 * Every APOD is an "image-article" post in category 22766 ("APOD").
 * No API key is needed.
 */

export type Apod = {
  date: string; // YYYY-MM-DD
  title: string;
  explanation: string;
  imageUrl: string | null; // sized for display
  hdImageUrl: string | null; // full resolution
  credit: string | null;
  link: string; // the APOD page on science.nasa.gov
};

/** The first day APOD was published. */
export const APOD_FIRST_DATE = "1995-06-16";

export const APOD_HOME = "https://science.nasa.gov/apod/";

const ENDPOINT = "https://science.nasa.gov/wp-json/wp/v2/image-article";
const APOD_CATEGORY = "22766";

type WpPost = {
  date: string;
  link: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  featured_image_url?: string | null;
};

/**
 * Fetch the APOD for a given date (YYYY-MM-DD), or the latest one when no date is given.
 * Returns null when there is no entry for that date or the request fails,
 * so pages can show a friendly message instead of crashing.
 */
export async function getApod(date?: string): Promise<Apod | null> {
  const params = new URLSearchParams({
    categories: APOD_CATEGORY,
    per_page: "1",
    _fields: "date,link,title,content,featured_image_url",
  });
  if (date) {
    // Posts are dated at local midnight of their day, so take everything published on `date`.
    params.set("after", `${shiftDay(date, -1)}T23:59:59`);
    params.set("before", `${date}T23:59:59`);
  }

  try {
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "CosmicDiscover/1.0 (+https://cosmic-discover.vercel.app)",
      },
      // Past days never change; "latest" changes once a day.
      next: { revalidate: date ? 60 * 60 * 24 * 7 : 60 * 30 },
    });
    if (!res.ok) {
      console.error(`APOD request failed (${res.status}) for date=${date ?? "latest"}`);
      return null;
    }
    const posts = (await res.json()) as WpPost[];
    return Array.isArray(posts) && posts.length > 0 ? toApod(posts[0]) : null;
  } catch (error) {
    console.error("APOD request error:", error);
    return null;
  }
}

function toApod(post: WpPost): Apod {
  const html = post.content?.rendered ?? "";
  const image = cleanImageUrl(post.featured_image_url);

  return {
    date: post.date.slice(0, 10),
    title: cleanTitle(decodeEntities(stripTags(post.title?.rendered ?? "Untitled"))),
    explanation: extractExplanation(html),
    imageUrl: image ? displaySize(image) : null,
    hdImageUrl: image,
    credit: extractCredit(html),
    link: post.link || APOD_HOME,
  };
}

/** "APOD: 2026 November 9 – Rigel and the Witch Head Nebula" → "Rigel and the Witch Head Nebula" */
function cleanTitle(title: string): string {
  return title.replace(/^APOD:\s*\d{4}\s+\w+\s+\d{1,2}\s*[–—-]\s*/u, "").trim() || title;
}

function extractExplanation(html: string): string {
  const match = html.match(/<strong>\s*Explanation:?\s*<\/strong>([\s\S]*?)<\/p>/i);
  return match ? normalize(decodeEntities(stripTags(match[1]))) : "";
}

function extractCredit(html: string): string | null {
  const text = normalize(decodeEntities(stripTags(html)));
  const match = text.match(/(?:Image\s+)?Credit(?:\s*(?:&|and)\s*Copyright)?\s*:\s*(.+?)\s+(?:Authors|Explanation|Tomorrow)/i);
  const credit = match?.[1]?.trim();
  return credit && credit.length < 200 ? credit : null;
}

/** Drops the size query string; returns null for NASA's generic placeholder thumbnail. */
function cleanImageUrl(url: string | null | undefined): string | null {
  if (!url || url.includes("news-thumbnail")) return null;
  return url.split("?")[0];
}

/**
 * NASA's dynamicimage service resizes on the fly; ask for a web-friendly size
 * (some originals are 7000px+). /content/dam/science/ paths map onto the same service.
 */
function displaySize(url: string): string {
  const dynamic = url.replace("assets.science.nasa.gov/content/dam/science/", "assets.science.nasa.gov/dynamicimage/assets/science/");
  return dynamic.includes("/dynamicimage/") ? `${dynamic}?w=1600&h=1600&fit=clip` : url;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ");
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\s+([.,;:!?)])/g, "$1").trim();
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  deg: "°",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? whole;
  });
}

function shiftDay(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

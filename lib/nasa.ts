import "server-only";

/**
 * NASA Astronomy Picture of the Day.
 * Docs: https://github.com/nasa/apod-api
 *
 * The API key is read from the NASA_API_KEY environment variable and is only
 * ever used on the server, so it never reaches the browser.
 */

export type Apod = {
  date: string;
  title: string;
  explanation: string;
  media_type: "image" | "video" | "other" | string;
  url?: string;
  hdurl?: string;
  thumbnail_url?: string;
  copyright?: string;
};

/** The first day APOD was published. */
export const APOD_FIRST_DATE = "1995-06-16";

const APOD_ENDPOINT = "https://api.nasa.gov/planetary/apod";

/**
 * Fetch the APOD for a given date (YYYY-MM-DD), or the latest one when no date is given.
 * Returns null when NASA has no entry for that date or the request fails,
 * so pages can show a friendly message instead of crashing.
 */
export async function getApod(date?: string): Promise<Apod | null> {
  const params = new URLSearchParams({
    api_key: process.env.NASA_API_KEY || "DEMO_KEY",
    thumbs: "true",
  });
  if (date) params.set("date", date);

  try {
    const res = await fetch(`${APOD_ENDPOINT}?${params.toString()}`, {
      // Past days never change; "latest" changes once a day.
      next: { revalidate: date ? 60 * 60 * 24 * 7 : 60 * 60 },
    });
    if (!res.ok) {
      console.error(`APOD request failed (${res.status}) for date=${date ?? "latest"}`);
      return null;
    }
    return (await res.json()) as Apod;
  } catch (error) {
    console.error("APOD request error:", error);
    return null;
  }
}

/** Link to the original APOD page on apod.nasa.gov, e.g. ap241202.html */
export function apodPageUrl(date: string): string {
  return `https://apod.nasa.gov/apod/ap${date.slice(2).replaceAll("-", "")}.html`;
}

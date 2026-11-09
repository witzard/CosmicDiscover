import type { Metadata } from "next";
import Link from "next/link";
import { APOD_FIRST_DATE, apodPageUrl, getApod } from "@/lib/nasa";
import { formatDate, isIsoDate, shiftDate, todayUtc } from "@/lib/dates";
import ApodMedia from "@/components/features/apod-media";

export const metadata: Metadata = {
  title: "Astronomy Picture of the Day",
};

type Props = {
  searchParams: Promise<{ date?: string | string[] }>;
};

export default async function ApodPage({ searchParams }: Props) {
  const { date: rawDate } = await searchParams;
  const today = todayUtc();

  // Only accept a real date inside the range NASA has published.
  const requested =
    typeof rawDate === "string" && isIsoDate(rawDate) && rawDate >= APOD_FIRST_DATE && rawDate <= today
      ? rawDate
      : undefined;
  const invalidInput = rawDate !== undefined && requested === undefined;

  const apod = await getApod(requested);
  const shownDate = apod?.date ?? requested ?? today;
  const prev = shiftDate(shownDate, -1);
  const next = shiftDate(shownDate, 1);

  return (
    <div className="container section">
      <div className="page-head">
        <h1>Astronomy Picture of the Day</h1>
        <form action="/apod" method="get" className="date-form">
          <label htmlFor="date">Pick a date</label>
          <input
            type="date"
            id="date"
            name="date"
            min={APOD_FIRST_DATE}
            max={today}
            defaultValue={shownDate}
            required
          />
          <button type="submit" className="button">
            Go
          </button>
        </form>
      </div>

      {invalidInput && (
        <p className="notice">
          Please pick a date between {formatDate(APOD_FIRST_DATE)} and today. Showing the latest picture
          instead.
        </p>
      )}

      {apod ? (
        <article className="apod-full">
          <ApodMedia apod={apod} />
          <div className="apod-text">
            <p className="meta">{formatDate(apod.date)}</p>
            <h2>{apod.title}</h2>
            {apod.copyright && <p className="meta">Image credit: {apod.copyright.trim()}</p>}
            <p className="explanation">{apod.explanation}</p>
            <a href={apodPageUrl(apod.date)} target="_blank" rel="noreferrer">
              View on apod.nasa.gov →
            </a>
          </div>
        </article>
      ) : (
        <p className="notice">
          There&apos;s no picture for {formatDate(shownDate)} yet, or NASA&apos;s service is busy. Try another
          date.
        </p>
      )}

      <nav aria-label="Previous and next day" className="pagination">
        {prev >= APOD_FIRST_DATE ? (
          <Link href={`/apod?date=${prev}`} className="button">
            ← Previous day
          </Link>
        ) : (
          <span className="button disabled">← Previous day</span>
        )}
        <Link href="/apod" className="page-info">
          Latest
        </Link>
        {next <= today ? (
          <Link href={`/apod?date=${next}`} className="button">
            Next day →
          </Link>
        ) : (
          <span className="button disabled">Next day →</span>
        )}
      </nav>
    </div>
  );
}

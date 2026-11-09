import Link from "next/link";
import { getApod } from "@/lib/nasa";
import { getArticles } from "@/lib/news";
import { formatDate } from "@/lib/dates";
import ApodMedia from "@/components/features/apod-media";
import NewsCard from "@/components/features/news-card";

// Rebuild the page in the background at most once an hour.
export const revalidate = 3600;

export default async function HomePage() {
  const [apod, news] = await Promise.all([getApod(), getArticles(1, 3)]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            Every star has a story,
            <span> and the universe is an endless library.</span>
          </h1>
          <p className="lead">
            Explore space through NASA&apos;s Astronomy Picture of the Day and the latest news on
            missions, launches and discoveries.
          </p>
          <div className="actions">
            <Link href="/apod" className="button primary">
              Today&apos;s picture
            </Link>
            <Link href="/news" className="button">
              Latest news
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Astronomy Picture of the Day</h2>
          <Link href="/apod">See more →</Link>
        </div>
        {apod ? (
          <div className="card apod-preview">
            <ApodMedia apod={apod} compact />
            <div className="card-body">
              <p className="meta">{formatDate(apod.date)}</p>
              <h3>
                <Link href={`/apod?date=${apod.date}`}>{apod.title}</Link>
              </h3>
              <p className="summary clamp-4">{apod.explanation}</p>
            </div>
          </div>
        ) : (
          <p className="notice">NASA&apos;s picture isn&apos;t available right now. Please try again later.</p>
        )}
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Latest spaceflight news</h2>
          <Link href="/news">All news →</Link>
        </div>
        {news && news.articles.length > 0 ? (
          <div className="grid">
            {news.articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="notice">News isn&apos;t available right now. Please try again later.</p>
        )}
      </section>
    </>
  );
}

import type { Article } from "@/lib/news";
import { formatDate } from "@/lib/dates";

export default function NewsCard({ article }: { article: Article }) {
  return (
    <article className="card news-card">
      {article.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.image_url} alt="" loading="lazy" className="news-image" />
      )}
      <div className="card-body">
        <p className="meta">
          {article.news_site} · {formatDate(article.published_at)}
        </p>
        <h3>
          <a href={article.url} target="_blank" rel="noreferrer" className="stretched-link">
            {article.title}
          </a>
        </h3>
        <p className="summary">{article.summary}</p>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import { getArticles } from "@/lib/news";
import NewsCard from "@/components/features/news-card";
import Pagination from "@/components/features/pagination";

export const metadata: Metadata = {
  title: "Spaceflight News",
};

type Props = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const { page: rawPage } = await searchParams;
  const parsed = Number(typeof rawPage === "string" ? rawPage : 1);
  const page = Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;

  const data = await getArticles(page);

  return (
    <div className="container section">
      <div className="page-head">
        <h1>Spaceflight News</h1>
        <p className="lead">The latest on launches, missions and discoveries from around the web.</p>
      </div>

      {data && data.articles.length > 0 ? (
        <>
          <div className="grid">
            {data.articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.totalPages} basePath="/news" />
        </>
      ) : (
        <>
          <p className="notice">
            {data ? "There are no articles on this page." : "News isn't available right now. Please try again later."}
          </p>
          {page > 1 && <Pagination page={page} totalPages={Math.max(page, data?.totalPages ?? 1)} basePath="/news" />}
        </>
      )}
    </div>
  );
}

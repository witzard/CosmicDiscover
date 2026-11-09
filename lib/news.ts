import "server-only";

/**
 * Spaceflight News API (free, no key needed).
 * Docs: https://api.spaceflightnewsapi.net/v4/docs/
 */

export type Article = {
  id: number;
  title: string;
  url: string;
  image_url: string | null;
  news_site: string;
  summary: string;
  published_at: string;
};

export type ArticlePage = {
  articles: Article[];
  total: number;
  totalPages: number;
};

const NEWS_ENDPOINT = "https://api.spaceflightnewsapi.net/v4/articles/";

export const NEWS_PAGE_SIZE = 12;

export async function getArticles(page = 1, pageSize = NEWS_PAGE_SIZE): Promise<ArticlePage | null> {
  const params = new URLSearchParams({
    limit: String(pageSize),
    offset: String((page - 1) * pageSize),
    ordering: "-published_at",
  });

  try {
    const res = await fetch(`${NEWS_ENDPOINT}?${params.toString()}`, {
      next: { revalidate: 60 * 15 },
    });
    if (!res.ok) {
      console.error(`News request failed (${res.status}) for page=${page}`);
      return null;
    }
    const data = (await res.json()) as { count: number; results: Article[] };
    return {
      articles: data.results ?? [],
      total: data.count ?? 0,
      totalPages: Math.max(1, Math.ceil((data.count ?? 0) / pageSize)),
    };
  } catch (error) {
    console.error("News request error:", error);
    return null;
  }
}

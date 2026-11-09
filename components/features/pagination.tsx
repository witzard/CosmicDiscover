import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  const href = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav aria-label="Pagination" className="pagination">
      {page > 1 ? (
        <Link href={href(page - 1)} className="button">
          ← Newer
        </Link>
      ) : (
        <span className="button disabled">← Newer</span>
      )}
      <span className="page-info">
        Page {page} of {totalPages.toLocaleString("en-US")}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className="button">
          Older →
        </Link>
      ) : (
        <span className="button disabled">Older →</span>
      )}
    </nav>
  );
}

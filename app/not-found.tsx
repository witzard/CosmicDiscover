import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section center">
      <h1>Lost in space</h1>
      <p className="lead">We couldn&apos;t find that page.</p>
      <Link href="/" className="button primary">
        Back to home
      </Link>
    </div>
  );
}

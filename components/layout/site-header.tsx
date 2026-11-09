import Link from "next/link";
import NavLinks from "./nav-links";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={32} height={32} />
          <span>Cosmic Discover</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}

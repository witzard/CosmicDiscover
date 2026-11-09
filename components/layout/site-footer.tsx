export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>Cosmic Discover · Every star has a story.</p>
        <p>
          Data from{" "}
          <a href="https://api.nasa.gov" target="_blank" rel="noreferrer">
            NASA Open APIs
          </a>{" "}
          and{" "}
          <a href="https://spaceflightnewsapi.net" target="_blank" rel="noreferrer">
            Spaceflight News API
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

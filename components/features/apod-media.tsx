import type { Apod } from "@/lib/nasa";

/** Renders the picture for one APOD entry, or a link to the original when there is no image. */
export default function ApodMedia({ apod, compact = false }: { apod: Apod; compact?: boolean }) {
  if (apod.imageUrl) {
    return (
      <a href={apod.hdImageUrl ?? apod.imageUrl} target="_blank" rel="noreferrer" className="apod-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={apod.imageUrl} alt={apod.title} loading={compact ? "lazy" : "eager"} />
      </a>
    );
  }

  return (
    <div className="apod-media apod-fallback">
      <p>This day&apos;s entry can&apos;t be shown here.</p>
      <a href={apod.link} target="_blank" rel="noreferrer" className="button">
        View it on science.nasa.gov
      </a>
    </div>
  );
}

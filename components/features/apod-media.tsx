import type { Apod } from "@/lib/nasa";
import { apodPageUrl } from "@/lib/nasa";

/** Renders the picture, video or a fallback link for one APOD entry. */
export default function ApodMedia({ apod, compact = false }: { apod: Apod; compact?: boolean }) {
  if (apod.media_type === "image" && apod.url) {
    return (
      <a href={apod.hdurl ?? apod.url} target="_blank" rel="noreferrer" className="apod-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={apod.url} alt={apod.title} loading={compact ? "lazy" : "eager"} />
      </a>
    );
  }

  if (apod.media_type === "video" && apod.url) {
    if (compact && apod.thumbnail_url) {
      return (
        <div className="apod-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={apod.thumbnail_url} alt={apod.title} loading="lazy" />
        </div>
      );
    }
    return (
      <div className="apod-media apod-video">
        <iframe
          src={apod.url}
          title={apod.title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="apod-media apod-fallback">
      <p>This day&apos;s entry can&apos;t be shown here.</p>
      <a href={apodPageUrl(apod.date)} target="_blank" rel="noreferrer" className="button">
        View it on apod.nasa.gov
      </a>
    </div>
  );
}

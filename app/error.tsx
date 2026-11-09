"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container section center">
      <h1>Something went wrong</h1>
      <p className="lead">A signal got lost on the way. Please try again.</p>
      <button type="button" className="button primary" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

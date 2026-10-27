import { useState } from "react";
import type { PublicRecord } from "../../types";
export function Camera({
  record,
  city,
}: {
  record: PublicRecord;
  city: string;
}) {
  const [url, setUrl] = useState(""),
    [error, setError] = useState(false);
  return (
    <details className="review-details">
      <summary>
        Camera {record.id} · {record.name}
      </summary>
      <button
        onClick={() => {
          setError(false);
          setUrl(
            `/api/cameras/${encodeURIComponent(record.id)}?city=${city}&t=${Date.now()}`,
          );
        }}
      >
        {url ? "Refresh snapshot" : "Load camera snapshot"}
      </button>
      {error ? (
        <p role="status">Camera image unavailable.</p>
      ) : (
        url && (
          <img
            className="camera-image"
            alt={`${city} traffic camera snapshot`}
            src={url}
            onError={() => setError(true)}
          />
        )
      )}
    </details>
  );
}

export async function api<T>(
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("city", window.ARC_CITY.id);
  const response = await fetch(url, {
    signal,
    ...(body === undefined
      ? {}
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Service unavailable");
  return data as T;
}
export const storageKey = (key: string) =>
  window.ARC_CITY.id === "toronto" ? key : `${key}.${window.ARC_CITY.id}`;

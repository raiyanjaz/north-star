const paths: Record<string, string> = {
  close: "m6 6 12 12M6 18 18 6",
  chevron: "m6 14 6-6 6 6",
  inbox: "M4 4h16v16H4zM4 14h5l1 3h4l1-3h5",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  focus: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 12h8m-4-4v8",
  overview: "M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16",
  settings: "M4 7h16M4 17h16M8 4v6m8 4v6",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  unit: "M3 6h11v12H3zM14 10h4l3 4v4h-7M6 9v6m-3-3h6M5 20h2m10 0h2",
  hospital: "M4 21V3h16v18M9 21v-5h6v5M9 8h6m-3-3v6",
  pin: "M12 21s7-7 7-12A7 7 0 0 0 5 9c0 5 7 12 7 12Zm0-15v6m-3-3h6",
  arrow: "m5 19 14-14M5 5h14v14",
  pause: "M8 5v14M16 5v14",
  play: "m8 4 12 8-12 8V4Z",
  back: "m14 5-7 7 7 7",
  info: "M12 11v6m0-10v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
};
export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.info} />
    </svg>
  );
}

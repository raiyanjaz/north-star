import type { ReactNode } from "react";
import type { CaseSections } from "./types";
// A render helper, not an inline component: disclosure state stays with its case.
export function caseSections({ details, onDetail }: CaseSections) {
  return (id: string, title: string, children: ReactNode) => (
    <details
      className="review-details"
      open={details.has(id)}
      onToggle={(event) => onDetail(id, event.currentTarget.open)}
    >
      <summary>{title}</summary>
      {children}
    </details>
  );
}

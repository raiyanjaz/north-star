import { useId, type ReactNode } from "react";
import { Icon } from "./Icon";
export function FloatingPanel({
  title,
  eyebrow,
  children,
  className = "",
  collapsed = false,
  onCollapse,
  onClose,
  tools,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  collapsed?: boolean;
  onCollapse?: () => void;
  onClose: () => void;
  tools?: ReactNode;
}) {
  const id = useId();
  return (
    <section
      className={`floating-panel ${className} ${collapsed ? "is-collapsed" : ""}`}
      aria-labelledby={id}
    >
      <div className="panel-header">
        <div className="panel-title">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 id={id}>{title}</h2>
        </div>
        <div className="panel-actions">
          {onCollapse && (
            <button
              className="icon-button"
              aria-label={`${collapsed ? "Expand" : "Collapse"} ${title}`}
              aria-expanded={!collapsed}
              onClick={onCollapse}
            >
              <span className={collapsed ? "rotate" : ""}>
                <Icon name="chevron" />
              </span>
            </button>
          )}
          <button
            className="icon-button"
            aria-label={`Close ${title}`}
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
      </div>
      <div className="panel-content" hidden={collapsed}>
        {tools && <div className="panel-toolbar">{tools}</div>}
        <div className="panel-body">{children}</div>
      </div>
    </section>
  );
}

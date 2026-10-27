import { Icon } from "../../components/Icon";
import { localTime } from "../../policy";

import type { Workspace } from "../../useWorkspace";
import type { WorkspaceLayout } from "./useWorkspaceLayout";
export function WorkspaceHeader({
  workspace: w,
  layout,
}: {
  workspace: Workspace;
  layout: WorkspaceLayout;
}) {
  const {
    s,
    mobile,
    inboxOpen,
    setInboxOpen,
    panel,
    setPanel,
    setFeature,
    open,
    counts,
  } = layout;
  return (
    <>
      <header className="workspace-header">
        <a
          className="brand"
          href={"/?city=" + window.ARC_CITY.id}
          aria-label="ARC home"
        >
          <span className="logo">
            <Icon name="arrow" size={23} />
          </span>
          <span>ARC</span>
        </a>
        <span className="header-divider" />
        <label className="city-choice">
          <span className="sr-only">City workspace</span>
          <select
            aria-label="City workspace"
            value={window.ARC_CITY.id}
            onChange={(e) => {
              window.location.href =
                "/?city=" + encodeURIComponent(e.target.value);
            }}
          >
            <option value="toronto">Toronto dispatch</option>
            <option value="seattle">Seattle dispatch</option>
          </select>
        </label>
      </header>
      <div className="workspace-utilities">
        <span
          className={`connection ${w.connected ? "" : "offline"}`}
          role="status"
        >
          <i />
          {w.connected
            ? "Workspace connected"
            : s
              ? "Connection lost"
              : "Connecting…"}
        </span>
        <time>{localTime(w.now)}</time>
        <button
          aria-label="Workspace controls"
          title="Workspace controls"
          onClick={() => open(panel === "controls" ? null : "controls")}
          aria-pressed={panel === "controls"}
        >
          <Icon name="settings" />
          <span>Workspace controls</span>
        </button>
        <button
          className="icon-button"
          aria-label="System details"
          title="System details"
          onClick={() => open(panel === "evidence" ? null : "evidence")}
        >
          <Icon name="more" />
        </button>
      </div>
      <nav className="workspace-nav" aria-label="Workspace panels">
        <button
          aria-expanded={inboxOpen}
          onClick={() => {
            setInboxOpen(!inboxOpen);
            if (mobile && !inboxOpen) setPanel(null);
          }}
        >
          <Icon name="inbox" />
          <span>Inbox</span>
          {!!counts && counts.approval + counts.input > 0 && (
            <b>{counts.approval + counts.input}</b>
          )}
        </button>
        <button
          id="show-selected"
          onClick={() => {
            setFeature(
              w.selected ? { kind: "incident", id: w.selected } : null,
            );
            open("feature");
          }}
        >
          <Icon name="pin" />
          <span>Selected case</span>
        </button>
        <button
          aria-pressed={panel === "resources"}
          onClick={() => open(panel === "resources" ? null : "resources")}
        >
          <Icon name="unit" />
          <span>Resources</span>
        </button>
        <button
          aria-pressed={panel === "context"}
          onClick={() => open(panel === "context" ? null : "context")}
        >
          <Icon name="layers" />
          <span>Layers</span>
        </button>
      </nav>
      {!w.connected && s && (
        <div className="connection-warning" role="alert">
          Connection lost. The displayed picture may be out of date; approvals
          are unavailable.
        </div>
      )}
    </>
  );
}

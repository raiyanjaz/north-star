import { Component, type ReactNode } from "react";
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="fatal-error">
        <h1>ARC couldn’t display this workspace</h1>
        <p>Reload to reconnect to the current workspace.</p>
        <button onClick={() => window.location.reload()}>Reload ARC</button>
      </div>
    ) : (
      this.props.children
    );
  }
}

import React from "react";

interface State {
  hasError: boolean;
}

interface Props {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export class SceneErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    // eslint-disable-next-line no-console
    console.error("[Scene] failed to render", error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

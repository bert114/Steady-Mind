function LoadingState() {
  return (
    <div className="dashboard-loading-card" aria-live="polite">
      <div className="dashboard-loading-header">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line skeleton-line--medium" />
      </div>
      <div className="dashboard-loading-body">
        <div className="skeleton-ring" />
        <div className="dashboard-loading-stack">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      </div>
    </div>
  );
}

export default LoadingState;

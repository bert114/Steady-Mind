function EmptyState() {
  return (
    <article className="dashboard-empty-state" role="status">
      <div className="empty-state-icon">✦</div>
      <h3>No check-ins yet</h3>
      <p>
        Your notes are still waiting. Once you add a few moments of energy, Aura
        will turn them into a clear picture of your day.
      </p>
      <button type="button" className="empty-state-button">
        Start a check-in
      </button>
    </article>
  );
}

export default EmptyState;

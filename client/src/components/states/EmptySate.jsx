function EmptyState({
  title = "No check-ins yet",
  message = "Your notes are still waiting. Once you add a few moments of energy, Steady Mind will turn them into a clear picture of your day.",
  error = false,
}) {
  return (
    <article
      className={`dashboard-empty-state ${error ? "dashboard-empty-state--error" : ""}`}
      role={error ? "alert" : "status"}
    >
      <div className="empty-state-icon">✦</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {!error && (
        <button type="button" className="empty-state-button">
          Start a check-in
        </button>
      )}
    </article>
  );
}

export default EmptyState;

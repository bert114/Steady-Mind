function WeeklySummaryHeader({ weekStart, isLoading, onRefresh }) {
  return (
    <header className="summary-header">
      <div>
        <p className="summary-kicker">Steady Mind week note</p>
        <h1>How I felt → what drained me</h1>
        <p>
          A plain read of the week starting {weekStart || "this week"}: your
          energy and mood, and what pulled on them.
        </p>
      </div>
      <button
        type="button"
        className="summary-refresh"
        onClick={onRefresh}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Refresh"}
      </button>
    </header>
  );
}

export default WeeklySummaryHeader;

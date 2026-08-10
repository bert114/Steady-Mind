function StateTrigger({ viewState, setViewState }) {
  return (
    <>
      <div className="dashboard-state-switcher">
        <button
          type="button"
          className={`dashboard-state-button ${viewState === "ready" ? "is-active" : ""}`}
          onClick={() => setViewState("ready")}
        >
          Live view
        </button>
        <button
          type="button"
          className={`dashboard-state-button ${viewState === "loading" ? "is-active" : ""}`}
          onClick={() => setViewState("loading")}
        >
          Loading
        </button>
        <button
          type="button"
          className={`dashboard-state-button ${viewState === "empty" ? "is-active" : ""}`}
          onClick={() => setViewState("empty")}
        >
          Empty state
        </button>
      </div>
    </>
  );
}

export default StateTrigger;

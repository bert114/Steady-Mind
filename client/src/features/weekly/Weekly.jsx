import { useEffect } from "react";
import EmptyState from "../../components/states/EmptySate.jsx";
import "./weekly.css";
import { useWeekly } from "./useWeekly.js";

const formatNumber = (value, suffix = "") =>
  value === null || value === undefined ? "--" : `${value}${suffix}`;

function Weekly() {
  const { data, isLoading, error, refetch } = useWeekly();

  useEffect(() => {
    if (!data) return;
    console.group("🗓️ Weekly Insight");
    console.log("Week:", data.week_start);
    console.log("Metrics:", data.metrics);
    console.log("Observations:", data.observations);
    console.groupEnd();
  }, [data]);

  if (isLoading && !data)
    return (
      <section className="weekly-shell">
        <p className="weekly-loading">Writing your week...</p>
      </section>
    );
  if (error && !data)
    return <EmptyState title="Weekly summary unavailable" message={error} error />;
  if (!data)
    return (
      <EmptyState
        title="Your week is waiting"
        message="Log a few check-ins and interactions to get your weekly summary."
      />
    );

  const {
    week_start: weekStart,
    metrics,
    observations,
  } = data;
  const {
    averageEnergy,
    averageMood,
    moodLabel: moodLabelText,
    interactionCount,
    averageDrain,
    burnout,
    highestDrain,
    recovery,
  } = metrics;
  const hasLogs =
    averageEnergy !== null ||
    averageMood !== null ||
    interactionCount > 0;
  const riskModifier =
    burnout?.riskLevel === "RED" ? "is-urgent" : burnout?.riskLevel === "YELLOW" ? "is-warning" : "is-steady";

  return (
    <section className="weekly-shell">
      <header className="weekly-header">
        <div>
          <p className="weekly-kicker">Steady Mind week note</p>
          <h1>Your week</h1>
          <p>
            A simple read of the {weekStart ? `week starting ${weekStart}` : "current week"}: energy,
            mood, and what shaped your capacity.
          </p>
        </div>
        <button
          type="button"
          className="weekly-refresh"
          onClick={refetch}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Refresh"}
        </button>
      </header>

      {!hasLogs ? (
        <p className="weekly-note">
          Your first energy check-in will give this summary something to follow.
        </p>
      ) : null}

      <section className="weekly-metrics" aria-label="This week's summary">
        <Metric label="Average energy" value={formatNumber(averageEnergy)} suffix=" / 100" />
        <Metric
          label="Average mood"
          value={moodLabelText || "--"}
          detail={averageMood ? `${averageMood}/5` : ""}
        />
        <Metric label="Interactions" value={formatNumber(interactionCount)} />
        <Metric
          label="Average drain"
          value={formatNumber(averageDrain)}
          detail="-5 draining, +5 energizing"
        />
      </section>

      <section className="weekly-observations" aria-label="What your week says">
        <p className="weekly-observations__kicker">In plain words</p>
        {observations.length ? (
          <ul className="weekly-observations__list">
            {observations.map((observation) => (
              <li key={observation.key}>{observation.text}</li>
            ))}
          </ul>
        ) : (
          <p className="weekly-muted">
            Not enough data yet to describe the week. Keep logging.
          </p>
        )}
      </section>

      <div className="weekly-grid">
        <section
          className={`weekly-panel weekly-panel--burnout ${riskModifier}`}
          aria-label="Burnout pattern"
        >
          <header>
            <h2>Burnout pattern</h2>
            <p>Signals from this week&apos;s energy and interactions</p>
          </header>
          <div className="weekly-burnout">
            <span className="weekly-burnout__level">{burnout?.title || "--"}</span>
            <ul className="weekly-burnout__reasons">
              {(burnout?.reasons || []).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="weekly-panel" aria-label="Highest-drain pattern">
          <header>
            <h2>Biggest draw on energy</h2>
            <p>Your most draining connection or activity this week</p>
          </header>
          {highestDrain ? (
            <div className="weekly-highlight-row">
              <span>{highestDrain.name}</span>
              <strong>{formatNumber(highestDrain.averageDrain)}</strong>
              <small>{highestDrain.interactionCount} logs</small>
            </div>
          ) : (
            <p className="weekly-muted">
              Log two interactions with the same person or category to spot a drain pattern.
            </p>
          )}
        </section>

        <section className="weekly-panel" aria-label="Most effective recovery">
          <header>
            <h2>What helped most</h2>
            <p>Recovery activities that regained your energy this week</p>
          </header>
          {recovery ? (
            <div className="weekly-highlight-row">
              <span>{recovery.name}</span>
              <strong>{formatNumber(recovery.averageRating)}/5</strong>
              <small>{recovery.attemptCount} ratings</small>
            </div>
          ) : (
            <p className="weekly-muted">
              Rate a recovery activity twice to find what restores you most.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}

function Metric({ label, value, suffix = "", detail = "" }) {
  return (
    <article className="weekly-metric">
      <span>{label}</span>
      <strong>
        {value}
        {suffix}
      </strong>
      <small>{detail}</small>
    </article>
  );
}

export default Weekly;
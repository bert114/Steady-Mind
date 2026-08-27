import EmptyState from "../../components/states/EmptySate.jsx";
import "./analytics.css";
import TrendChart from "./TrendChart.jsx";
import { useAnalytics } from "./useAnalytics.js";

const formatNumber = (value, suffix = "") =>
  value === null || value === undefined ? "--" : `${value}${suffix}`;

function Analytics() {
  const { data, isLoading, error, refetch } = useAnalytics();

  if (isLoading && !data)
    return (
      <section className="analytics-shell">
        <p className="analytics-loading">Reading your patterns...</p>
      </section>
    );
  if (error && !data)
    return <EmptyState title="Analytics unavailable" message={error} error />;
  if (!data)
    return (
      <EmptyState
        title="Your patterns are waiting"
        message="Log a few energy check-ins and interactions to see what shapes your capacity."
      />
    );

  const {
    energy,
    mood,
    interactions,
    relationships,
    highDrainImpact,
    recovery,
    patterns,
  } = data;
  const hasData = energy["30d"]?.some((item) => item.energy !== null);

  return (
    <section className="analytics-shell">
      <header className="analytics-header">
        <div>
          <p className="analytics-kicker">Your patterns</p>
          <h1>See what shapes your energy</h1>
          <p>
            Simple reflections from your last 30 days of check-ins,
            conversations, and recovery.
          </p>
        </div>
        <button
          type="button"
          className="analytics-refresh"
          onClick={refetch}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Refresh"}
        </button>
      </header>

      {!hasData ? (
        <p className="analytics-note">
          Your first energy check-in will give these charts something to follow.
        </p>
      ) : null}

      <section className="analytics-metrics" aria-label="30-day summary">
        <Metric
          label="Average energy"
          value={formatNumber(energy.average)}
          suffix=" / 100"
        />
        <Metric
          label="Average mood"
          value={mood.averageLabel || "--"}
          detail={mood.average ? `${mood.average}/5` : ""}
        />
        <Metric
          label="Social interactions"
          value={formatNumber(interactions.total)}
          detail="last 30 days"
        />
        <Metric
          label="Average interaction drain"
          value={formatNumber(interactions.averageDrain)}
          detail="-5 draining, +5 energizing"
        />
        <Metric
          label="High-drain interactions"
          value={formatNumber(interactions.highDrainCount)}
          detail="score -3 or lower"
        />
      </section>

      <div className="analytics-grid">
        <AnalyticsPanel
          title="Energy this week"
          detail="A closer look at your last seven days"
        >
          <TrendChart
            data={energy["7d"]}
            valueKey="energy"
            label="Seven-day energy"
            formatValue={(value) => `${value}/100`}
          />
        </AnalyticsPanel>
        <AnalyticsPanel
          title="Energy over 30 days"
          detail="Gaps mean no check-in, not zero energy"
        >
          <TrendChart
            data={energy["30d"]}
            valueKey="energy"
            label="Thirty-day energy"
            formatValue={(value) => `${value}/100`}
          />
        </AnalyticsPanel>
        <AnalyticsPanel title="Mood over 30 days" detail="Very Low to Great">
          <TrendChart
            data={mood["30d"]}
            valueKey="mood"
            label="Thirty-day mood"
            color="#a76a53"
            formatValue={(value) => `${value}/5`}
          />
        </AnalyticsPanel>
        <AnalyticsPanel
          title="Your patterns"
          detail="Three useful signals from the data"
        >
          <ul className="pattern-list">
            {patterns.map((pattern) => (
              <li key={pattern.key}>{pattern.text}</li>
            ))}
          </ul>
        </AnalyticsPanel>
        <AnalyticsPanel
          title="Relationships"
          detail="Classified after two interactions"
        >
          <RelationshipList
            title="Life-giving"
            items={relationships.lifeGiving}
            empty="No life-giving pattern yet."
          />
          <RelationshipList
            title="High-drain"
            items={relationships.highDrain}
            empty="No high-drain relationship pattern yet."
          />
        </AnalyticsPanel>
        <AnalyticsPanel
          title="After high-drain interactions"
          detail="Next energy check-in minus the previous one"
        >
          <strong className="impact-value">
            {highDrainImpact.averageChange === null
              ? "--"
              : `${highDrainImpact.averageChange > 0 ? "+" : ""}${highDrainImpact.averageChange} points`}
          </strong>
          <p className="analytics-muted">
            {highDrainImpact.sampleCount
              ? `Based on ${highDrainImpact.sampleCount} comparison${highDrainImpact.sampleCount === 1 ? "" : "s"}.`
              : "Log energy before and after a high-drain interaction to compare."}
          </p>
        </AnalyticsPanel>
        <AnalyticsPanel
          title="Recovery that helps"
          detail="Activities with at least two ratings"
        >
          {recovery.mostEffective.length ? (
            <ol className="recovery-list">
              {recovery.mostEffective.map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <strong>{item.averageRating}/5</strong>
                  <small>{item.attemptCount} ratings</small>
                </li>
              ))}
            </ol>
          ) : (
            <p className="analytics-muted">
              Rate a recovery activity twice to rank it here.
            </p>
          )}
        </AnalyticsPanel>
      </div>
    </section>
  );
}

function Metric({ label, value, suffix = "", detail = "" }) {
  return (
    <article className="analytics-metric">
      <span>{label}</span>
      <strong>
        {value}
        {suffix}
      </strong>
      <small>{detail}</small>
    </article>
  );
}
function AnalyticsPanel({ title, detail, children }) {
  return (
    <section className="analytics-panel">
      <header>
        <h2>{title}</h2>
        <p>{detail}</p>
      </header>
      {children}
    </section>
  );
}
function RelationshipList({ title, items, empty }) {
  return (
    <div className="relationship-list">
      <h3>{title}</h3>
      {items.length ? (
        items.slice(0, 3).map((item) => (
          <div className="relationship-row" key={item.name}>
            <span>{item.name}</span>
            <strong>{item.averageDrain}</strong>
            <small>{item.interactionCount} logs</small>
          </div>
        ))
      ) : (
        <p className="analytics-muted">{empty}</p>
      )}
    </div>
  );
}

export default Analytics;

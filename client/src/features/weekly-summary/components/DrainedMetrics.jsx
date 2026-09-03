import { formatNumber } from "../weeklySummary.utils.js";

function HighestDrain({ drain }) {
  return (
    <div className="summary-drain">
      <p className="summary-drain__label">Biggest draw on your energy</p>
      <div className="summary-drain__row">
        <strong>{drain.relationship}</strong>
        <span className="summary-drain__type">{drain.relationshipType}</span>
        <span className="summary-drain__score">
          {formatNumber(drain.average)}
        </span>
      </div>
      <small className="summary-drain__meta">
        {drain.count} logged interaction{drain.count === 1 ? "" : "s"}
      </small>
    </div>
  );
}

function DrainedMetrics({ drainAverage, interactionCount, highestDrain }) {
  return (
    <section className="summary-block" aria-label="What drained me this week">
      <p className="summary-block__kicker">What drained me</p>
      <div className="summary-metrics">
        <article className="summary-metric">
          <span>Avg. social drain</span>
          <strong>{formatNumber(drainAverage)}</strong>
          <small>-5 draining, +5 energizing</small>
        </article>
        <article className="summary-metric">
          <span>Interactions</span>
          <strong>{interactionCount}</strong>
          <small>logged this week</small>
        </article>
      </div>

      {highestDrain ? (
        <HighestDrain drain={highestDrain} />
      ) : (
        <p className="summary-muted">
          Log two interactions with the same person or category to spot a drain
          pattern.
        </p>
      )}
    </section>
  );
}

export default DrainedMetrics;

function Metric({ label, value, detail }) {
  return (
    <article className="summary-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function FeltMetrics({ metrics }) {
  return (
    <section className="summary-block" aria-label="How I felt this week">
      <p className="summary-block__kicker">How I felt</p>
      <div className="summary-metrics">
        {metrics.map((metric) => (
          <Metric key={metric.label} {...metric} />
        ))}
      </div>
    </section>
  );
}

export default FeltMetrics;

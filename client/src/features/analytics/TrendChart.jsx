function TrendChart({
  data = [],
  valueKey,
  label,
  color = "#172522",
  formatValue,
}) {
  const points = data.filter(
    (item) => item[valueKey] !== null && item[valueKey] !== undefined,
  );
  const width = 720;
  const height = 220;
  const padding = 24;
  const values = points.map((item) => Number(item[valueKey]));
  const min = Math.min(...values, valueKey === "energy" ? 0 : 1);
  const max = Math.max(...values, valueKey === "energy" ? 100 : 5);
  const range = max - min || 1;
  const coordinates = points.map((item) => {
    const sourceIndex = data.indexOf(item);
    const x =
      padding +
      (sourceIndex / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((Number(item[valueKey]) - min) / range) * (height - padding * 2);
    return { ...item, x, y };
  });

  return (
    <div className="analytics-chart" role="img" aria-label={`${label} trend`}>
      {points.length < 2 ? (
        <p className="analytics-muted">
          Log this value on at least two days to see a trend.
        </p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <line
              x1={padding}
              x2={width - padding}
              y1={height - padding}
              y2={height - padding}
              className="chart-axis"
            />
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={coordinates
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
            />
            {coordinates.map((point) => (
              <circle
                key={point.date}
                cx={point.x}
                cy={point.y}
                r="5"
                fill="white"
                stroke={color}
                strokeWidth="3"
              >
                <title>{`${point.date}: ${formatValue ? formatValue(point[valueKey]) : point[valueKey]}`}</title>
              </circle>
            ))}
          </svg>
          <div className="analytics-chart-labels">
            {data
              .filter(
                (_, index) =>
                  index === 0 ||
                  index === data.length - 1 ||
                  index === Math.floor(data.length / 2),
              )
              .map((item) => (
                <span key={item.date}>{item.date.slice(5)}</span>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TrendChart;

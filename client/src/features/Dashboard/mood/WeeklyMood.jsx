import { useEffect } from "react";

const WeeklyMood = ({ weeklyMood = [] }) => {
  const moodStabilityData = weeklyMood;

  useEffect(() => {
    console.log(weeklyMood);
  }, [weeklyMood]);

  const todayData = moodStabilityData.find((item) => item.isToday);
  const mainScore = todayData ? todayData.moodScore : 8;

  const width = 300;
  const height = 120;
  const padding = 14;

  const getY = (score) => {
    const minY = padding;
    const maxY = height - padding;
    const normalizedScore = Math.max(1, Math.min(10, score));
    return maxY - ((normalizedScore - 1) / 9) * (maxY - minY);
  };

  const points = moodStabilityData.map((data, index) => {
    const x =
      padding +
      (index / (moodStabilityData.length - 1)) * (width - 2 * padding);
    const y = getY(data.moodScore);
    return { x, y, ...data };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="widget-card">
      <div className="widget-header">
        <span className="widget-title">Mood trend</span>
      </div>

      <div className="widget-data-row">
        <div className="widget-main-value">{mainScore}</div>
        <span className="widget-unit">/10</span>
      </div>

      <div className="chart-container">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#617a5f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={point.isToday ? 5.5 : 4}
              className="chart-node"
            />
          ))}
        </svg>
      </div>

      <div className="chart-days">
        {moodStabilityData.map((item, index) => (
          <span
            key={index}
            className={`day-label ${item.isToday ? "is-today" : ""}`}
          >
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WeeklyMood;

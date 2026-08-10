import React from "react";
import { useState } from "react";

const DailyMood = () => {
  const moodStabilityData = [
    { day: "MON", moodScore: 5, isToday: false },
    { day: "TUE", moodScore: 4, isToday: false },
    { day: "WED", moodScore: 6, isToday: false },
    { day: "THU", moodScore: 7, isToday: false },
    { day: "FRI", moodScore: 6, isToday: false },
    { day: "SAT", moodScore: 8, isToday: false },
    { day: "TODAY", moodScore: 8, isToday: true },
  ];

  const [activeTooltip, setActiveTooltip] = useState(null);

  // Find today's data to display the main number by default
  const todayData = moodStabilityData.find((item) => item.isToday);
  const mainScore = todayData ? todayData.moodScore : 8;

  // --- SVG Chart Generation ---
  const width = 280;
  const height = 90;
  const padding = 15;

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
        <span className="widget-icon">☁️</span>
        <span className="widget-title">Mood steadiness</span>
      </div>

      <div className="widget-data-row">
        <div className="widget-main-value">
          {activeTooltip ? activeTooltip.moodScore : mainScore}
        </div>
        <span className="widget-unit">
          / 10 {activeTooltip ? `(${activeTooltip.day})` : ""}
        </span>
      </div>

      <div className="chart-container">
        {/* Floating Tooltip Box */}
        {activeTooltip && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(activeTooltip.x / width) * 100}%`,
              top: `${activeTooltip.y - 12}px`,
            }}
          >
            {activeTooltip.moodScore}
          </div>
        )}

        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="lightMoodGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#lightMoodGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />
          {/* Interactive hover circles */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="6"
              className="chart-node"
              onMouseEnter={() => setActiveTooltip(point)}
              onMouseLeave={() => setActiveTooltip(null)}
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

export default DailyMood;

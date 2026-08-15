import React, { useEffect } from "react";
import "./battery.scss";
import { useBatteryStore } from "./useBatteryStore.js";

export default function Battery({ level }) {
  const { percentage, caption, label, setPercentage } = useBatteryStore();

  useEffect(() => {
    if (level !== undefined && level !== null) {
      setPercentage(level);
    }
  }, [level, setPercentage]);

  const radius = 94;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-container">
      <div className="progress-card">
        <svg
          className="progress-ring"
          width="260"
          height="260"
          viewBox="0 0 260 260"
        >
          <circle
            className="progress-ring-background"
            strokeWidth="12"
            fill="transparent"
            r={radius}
            cx="130"
            cy="130"
          />
          <circle
            className="progress-ring-circle"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="130"
            cy="130"
          />
        </svg>

        <div className="progress-content">
          <span className="progress-label">{label}</span>
          <span className="progress-percentage">{percentage}</span>
          <span className="progress-scale">/100</span>
          <span className="progress-caption">{caption}</span>
        </div>
      </div>
    </div>
  );
}

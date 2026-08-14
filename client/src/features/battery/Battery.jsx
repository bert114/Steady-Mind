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

  useEffect(() => {
    console.log(
      `Battery state updated: ${percentage}%, Status: "${caption}", Label: "${label}"`,
    );
  }, [percentage, caption, label]);

  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-container">
      <div className="progress-card">
        <svg className="progress-ring" width="220" height="220">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a9553d" />
              <stop offset="50%" stopColor="#8d5a3a" />
              <stop offset="100%" stopColor="#5d6b4e" />
            </linearGradient>
          </defs>
          <circle
            className="progress-ring-background"
            strokeWidth="16"
            fill="transparent"
            r={radius}
            cx="110"
            cy="110"
          />
          <circle
            className="progress-ring-circle"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="110"
            cy="110"
          />
        </svg>
        <div className="progress-content">
          <span className="progress-label">{label}</span>
          <span className="progress-percentage">{percentage}%</span>
          <span className="progress-caption">{caption}</span>
          <svg
            className="lightning-icon"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="currentColor" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

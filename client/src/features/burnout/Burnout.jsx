import React, { useEffect } from "react";
import { useBurnoutStore } from "./useBurnoutStore.js";
import "./burnout.css";

const DEFAULT_STATUS_TEXT = {
  GREEN: "Stable",
  YELLOW: "Strained / Warning",
  RED: "High Burnout Risk",
};

export const BurnoutRiskSkeleton = () => (
  <div
    className="skeleton-card"
    aria-busy="true"
    aria-label="Loading burnout status"
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}
    >
      <div
        className="skeleton-box"
        style={{ width: "140px", height: "24px" }}
      />
      <div
        className="skeleton-box"
        style={{ width: "100px", height: "24px", borderRadius: "12px" }}
      />
    </div>
    <div
      className="skeleton-box"
      style={{ width: "100%", height: "60px", marginBottom: "16px" }}
    />
    <div className="skeleton-box" style={{ width: "80%", height: "16px" }} />
  </div>
);
const Burnout = ({
  burnoutRisk,
  cardTitle = "Burnout Status",
  showSignalsBreakdown = true,
}) => {
  if (!burnoutRisk) {
    return (
      <div className="error-card" role="alert">
        <p style={{ margin: 0, fontWeight: 600 }}>No status data available.</p>
      </div>
    );
  }

  const { riskLevel, title, reasons, signals, evaluatedAt } = burnoutRisk;
  const statusBadgeText = title || DEFAULT_STATUS_TEXT[riskLevel];
  const formattedDate = evaluatedAt
    ? new Date(evaluatedAt).toLocaleTimeString()
    : null;

  return (
    <section
      className={`card theme-${riskLevel?.toLowerCase()}`}
      aria-labelledby="burnout-card-heading"
    >
      <header className="header">
        <h2 id="burnout-card-heading" className="title">
          {cardTitle}
        </h2>
        <span
          className={`badge badge-${riskLevel?.toLowerCase()}`}
          role="status"
          aria-label={`Status: ${statusBadgeText}`}
        >
          {statusBadgeText}
        </span>
      </header>

      {showSignalsBreakdown && signals && (
        <div className="signals-grid" aria-label="Key signals breakdown">
          <div className="metric-box">
            <span className="metric-value">{signals.currentBattery}%</span>
            <span className="metric-label">Battery Level</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">{signals.lowBatteryStreak}d</span>
            <span className="metric-label">Low Battery Streak</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">{signals.highDrainStreak}</span>
            <span className="metric-label">High Drain Hits</span>
          </div>
        </div>
      )}

      {reasons && reasons.length > 0 && (
        <div className="reasons-section">
          <h3 className="reasons-header">Triggers & Insights</h3>
          <ul className="reasons-list">
            {reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {formattedDate && (
        <footer
          style={{ marginTop: "12px", fontSize: "0.75rem", color: "#94a3b8" }}
        >
          Evaluated at: {formattedDate}
        </footer>
      )}
    </section>
  );
};

export default Burnout;

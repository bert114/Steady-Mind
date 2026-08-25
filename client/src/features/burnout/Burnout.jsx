import { useEffect } from "react";
import { useRecoveryHook } from "../recovery-f/useRecoveryHook";
import "./burnout.css";

const DEFAULT_STATUS_TEXT = {
  GREEN: "Steady",
  YELLOW: "Needs attention",
  RED: "High burnout risk",
};

const Burnout = ({
  userId,
  burnoutRisk,
  cardTitle = "Current state",
  showSignalsBreakdown = true,
}) => {
  const { addObject } = useRecoveryHook();

  useEffect(() => {
    if (!burnoutRisk) {
      return;
    }

    addObject({ interact_id: burnoutRisk?.latestInteraction?.id });
  }, [addObject, burnoutRisk]);

  if (!burnoutRisk) {
    return (
      <div className="error-card" role="alert">
        <p style={{ margin: 0, fontWeight: 600 }}>No data yet.</p>
      </div>
    );
  }

  const { riskLevel, title, reasons, signals } = burnoutRisk;
  const statusBadgeText = title || DEFAULT_STATUS_TEXT[riskLevel];
  const isHighRisk = riskLevel === "RED";
  const isWatchRisk = riskLevel === "YELLOW";

  return (
    <section
      className={`card theme-${riskLevel?.toLowerCase()}`}
      aria-labelledby="burnout-card-heading"
    >
      <header className="header">
        <div>
          <p className="burnout-kicker">Burnout status</p>
          <h2 id="burnout-card-heading" className="title">
            {cardTitle}
          </h2>
        </div>
        <span
          className={`badge badge-${riskLevel?.toLowerCase()}`}
          role="status"
          aria-label={`Status: ${statusBadgeText}`}
        >
          {statusBadgeText}
        </span>
      </header>

      <div className="burnout-guidance">
        <strong>
          {isHighRisk
            ? "Your recent pattern suggests your capacity needs a pause."
            : isWatchRisk
              ? "Your recent pattern suggests it may help to slow down."
              : "Your recent pattern looks steady right now."}
        </strong>
        <p>
          {isHighRisk
            ? "Choose one low-effort recovery activity before taking on more."
            : isWatchRisk
              ? "Consider a medium-effort recovery activity and check in again later."
              : "Keep noticing which interactions support or use your energy."}
        </p>
        <small>This is a reflection aid, not a medical diagnosis.</small>
      </div>

      {showSignalsBreakdown && signals && (
        <div className="signals-grid" aria-label="Key signals breakdown">
          <div className="metric-box">
            <span className="metric-value">{signals.currentBattery}%</span>
            <span className="metric-label">Energy</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">{signals.lowBatteryStreak}d</span>
            <span className="metric-label">Low streak</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">{signals.highDrainStreak}</span>
            <span className="metric-label">Drain hits</span>
          </div>
        </div>
      )}

      {reasons && reasons.length > 0 && (
        <div className="reasons-section">
          <h3>What shaped this status</h3>
          <ul className="reasons-list">
            {reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Burnout;

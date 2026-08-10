import React, { useState } from "react";

const MOODS = [
  "Focused",
  "Stable",
  "Restless",
  "Depleted",
  "Driven",
  "At ease",
];

const EnergyMoodModal = ({ isOpen, onClose, currentUserId }) => {
  const [energy, setEnergy] = useState(65);
  const [selectedMood, setSelectedMood] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleEnergyChange = (e) => {
    const value = Number(e.target.value);
    setEnergy(value);
    if (value >= 0 && value <= 100) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (energy < 0 || energy > 100) {
      setError("Value must fall strictly within 0 and 100.");
      return;
    }
    if (!selectedMood) {
      setError("Select a baseline mood descriptor.");
      return;
    }

    const entryData = {
      userId: currentUserId || "primary_user",
      timestamp: new Date().toISOString(),
      energyLevel: energy,
      mood: selectedMood,
    };

    console.log("Committed telemetry:", entryData);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setEnergy(65);
    setSelectedMood("");
    setError("");
    onClose();
  };

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true">
      <div className="modal-panel">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <header className="panel-header">
              <span className="panel-kicker">Telemetry log</span>
              <h2>State capture</h2>
              <button
                type="button"
                className="close-trigger"
                onClick={onClose}
                aria-label="Dismiss window"
              >
                &times;
              </button>
            </header>

            <div className="control-section">
              <div className="metric-row">
                <label htmlFor="energy-range">Energy reserve</label>
                <span className="metric-readout">
                  {energy}
                  <small>/100</small>
                </span>
              </div>

              <div className="gauge-track" aria-hidden="true">
                <div
                  className="gauge-indicator"
                  style={{ width: `${energy}%` }}
                />
              </div>

              <input
                id="energy-range"
                type="range"
                min="0"
                max="100"
                value={energy}
                onChange={handleEnergyChange}
                className="native-slider"
              />
            </div>

            <div className="control-section">
              <span className="section-label">Primary disposition</span>
              <div className="disposition-matrix">
                {MOODS.map((mood) => (
                  <button
                    type="button"
                    key={mood}
                    className={`matrix-node ${selectedMood === mood ? "active" : ""}`}
                    onClick={() => {
                      setSelectedMood(mood);
                      setError("");
                    }}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="error-notice" role="alert">
                {error}
              </p>
            )}

            <footer className="panel-actions">
              <button type="button" className="action-subtle" onClick={onClose}>
                Dismiss
              </button>
              <button type="submit" className="action-solid">
                Commit entry
              </button>
            </footer>
          </form>
        ) : (
          <div className="confirmation-state">
            <span className="status-indicator-dot" />
            <h3>Recorded</h3>
            <p>Data successfully bound to the current timeline.</p>
            <button
              type="button"
              className="action-solid"
              onClick={handleResetAndClose}
            >
              Acknowledge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyMoodModal;

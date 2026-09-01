import { useModalStore } from "../useModalStore";
import { DURATIONS, RELATIONSHIPS } from "./Interaction.constant";
import "./InteractionModal.css";
import { useInteractionHook } from "./useInteractionHook";

const InteractionModal = ({ currentUserId }) => {
  const { isOpen, closeModal } = useModalStore();

  const {
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleDismiss,
  } = useInteractionHook(currentUserId, closeModal);

  if (!isOpen) return null;

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <form onSubmit={handleSubmit}>
          <header className="panel-header">
            <span className="panel-kicker">A quick energy note</span>
            <h2>Log an interaction</h2>
            <button
              type="button"
              className="close-trigger"
              onClick={handleDismiss}
              aria-label="Dismiss window"
            >
              &times;
            </button>
          </header>

          <div className="modal-form-grid">
            {/* 1. Relationship */}
            <div
              className={`control-section ${error?.relationship_type ? "error" : ""}`}
            >
              <label htmlFor="relationship-select" className="section-label">
                Relationship
              </label>

              <select
                id="relationship-select"
                className="native-select"
                value={formData.relationship}
                onChange={(e) => handleChange("relationship", e.target.value)}
              >
                <option value="" disabled>
                  Select category...
                </option>
                {RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Person Name */}
            <div
              className={`control-section ${error?.custom_name ? "error" : ""}`}
            >
              <label htmlFor="person-name" className="section-label">
                Person name <small>(optional)</small>
              </label>
              <input
                id="person-name"
                type="text"
                className="native-input"
                placeholder="e.g., Alex"
                value={formData.personName}
                onChange={(e) => handleChange("personName", e.target.value)}
              />
            </div>

            {/* 3. Duration */}
            <div
              className={`control-section ${error?.duration_minutes ? "error" : ""}`}
            >
              <label className="section-label">Duration</label>
              <div className="disposition-matrix">
                {DURATIONS.map((d) => (
                  <button
                    type="button"
                    key={d.value}
                    className={`btn-chip ${formData.duration === d.value ? "active" : ""}`}
                    onClick={() => handleChange("duration", d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Energy Impact */}
            <div className="control-section">
              <div className="metric-row">
                <label
                  htmlFor="drain-slider"
                  className="section-label"
                  style={{ marginBottom: 0 }}
                >
                  Energy Effect
                </label>
                <span className="metric-readout">
                  {formData.drainScore}
                  <small> {getEnergyEffectLabel(formData.drainScore)}</small>
                </span>
              </div>
              <div
                className="slider-labels"
                aria-hidden="true"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking)",
                  margin: "12px 0 6px 0",
                }}
              >
                <span>Draining</span>
                <span>Neutral</span>
                <span>Energizing</span>
              </div>
              <div className="gauge-track" aria-hidden="true">
                <div
                  className="gauge-indicator"
                  style={{
                    width: `${((Number(formData.drainScore) + 5) / 10) * 100}%`,
                  }}
                />
              </div>
              <input
                id="drain-slider"
                type="range"
                min="-5"
                max="5"
                step="1"
                value={formData.drainScore}
                onChange={(e) => handleChange("drainScore", e.target.value)}
                className="native-slider"
              />
            </div>

            {error && (
              <p className="error-notice" role="alert">
                {error.relationship_type ||
                  error.custom_name ||
                  error.duration_minutes ||
                  "invalid log entry"}
              </p>
            )}

            <footer className="panel-actions">
              <button type="button" className="btn" onClick={handleDismiss}>
                Dismiss
              </button>
              <button
                type="submit"
                className="btn btn-primary action-solid"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && (
                  <span className="loading-spinner" aria-hidden="true" />
                )}
                {isSubmitting ? "Saving..." : "Save interaction"}
              </button>
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
};

function getEnergyEffectLabel(value) {
  const score = Number(value);
  if (score <= -4) return "Very draining";
  if (score <= -1) return "Somewhat draining";
  if (score === 0) return "Neutral";
  if (score <= 3) return "Somewhat energizing";
  return "Very energizing";
}

export default InteractionModal;

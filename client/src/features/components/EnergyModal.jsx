import { useHook } from "../Logger/energy-mood/useHook";
import { useModalStore } from "../Logger/useModalStore";

const MOODS = ["Happy", "Calm", "Neutral", "Restless", "Anxious", "Exhausted"];

const EnergyMoodModal = ({ currentUserId }) => {
  const {
    energy,
    selectedMood,
    error,
    isSubmitting,
    isSubmitted,
    handleEnergyChange,
    handleSelectMood,
    handleSubmit,
    resetForm,
  } = useHook();

  const { isOpen, modalType, openModal, closeModal } = useModalStore();

  if (!isOpen) return null;

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
                onClick={closeModal}
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
                      handleSelectMood(mood);
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
              <button
                type="button"
                className="action-subtle"
                onClick={closeModal}
              >
                Dismiss
              </button>
              <button
                type="submit"
                className="action-solid"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && (
                  <span className="loading-spinner" aria-hidden="true" />
                )}
                {isSubmitting ? "Saving..." : "Commit entry"}
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
              onClick={() => {
                resetForm();
                closeModal(); // Hides the modal after acknowledgment
              }}
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

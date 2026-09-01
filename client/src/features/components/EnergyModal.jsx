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

  const { isOpen, closeModal } = useModalStore();

  const handleDismiss = () => {
    resetForm();
    closeModal();
  };

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
                className="close-trigger btn btn-subtle"
                onClick={handleDismiss}
                aria-label="Dismiss window"
              >
                &times;
              </button>
            </header>

            <fieldset
              className="control-section"
              aria-describedby={error ? "energy-mood-error" : undefined}
            >
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
                aria-valuetext={`${energy} out of 100`}
              />
            </fieldset>

            <fieldset
              className="control-section"
              aria-describedby={error ? "energy-mood-error" : undefined}
            >
              <legend className="section-label">How are you feeling?</legend>
              <div className="disposition-matrix">
                {MOODS.map((mood) => (
                  <button
                    type="button"
                    key={mood}
                    className={`btn btn-chip ${selectedMood === mood ? "active" : ""}`}
                    onClick={() => {
                      handleSelectMood(mood);
                    }}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </fieldset>

            {error && (
              <p id="energy-mood-error" className="error-notice" role="alert">
                {error?.moodScore}
              </p>
            )}

            <footer className="panel-actions">
              <button
                type="button"
                className="btn btn-subtle"
                onClick={handleDismiss}
              >
                Dismiss
              </button>
              <button
                type="submit"
                className="btn btn-primary"
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
              className="btn btn-primary"
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

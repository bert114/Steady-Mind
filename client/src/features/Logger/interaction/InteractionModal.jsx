import React, { useState } from "react";
import "./InteractionModal.css";
import { useSocialModalStore } from "./useInteractionStore";
import { useToastStore } from "../../toast/useToastStore";
import { handleToast } from "../../toast/toast.util";
import { useModalStore } from "../useModalStore";
import { DURATIONS, RELATIONSHIPS } from "./Interaction.constant";
import { useInteractionHook } from "./useInteractionHook";

const InteractionModal = ({ currentUserId }) => {
  const { isOpen, closeModal } = useModalStore();

  const { formData, error, handleChange, handleSubmit, handleDismiss } =
    useInteractionHook(currentUserId, closeModal);

  if (!isOpen) return null;

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <form onSubmit={handleSubmit}>
          <header className="panel-header">
            <span className="panel-kicker">Social telemetry</span>
            <h2>Log interaction</h2>
            <button
              type="button"
              className="close-trigger"
              onClick={handleDismiss}
              aria-label="Dismiss window"
            >
              &times;
            </button>
          </header>

          <div className="control-section">
            <label htmlFor="relationship-select">Relationship</label>
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

          <div className="control-section">
            <label htmlFor="person-name">
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

          <div className="control-section">
            <label>Duration</label>
            <div className="chip-grid">
              {DURATIONS.map((d) => (
                <button
                  type="button"
                  key={d}
                  className={`matrix-node ${formData.duration === d ? "active" : ""}`}
                  onClick={() => handleChange("duration", d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <div className="metric-row">
              <label htmlFor="drain-slider">Drain score</label>
              <span className="metric-readout">
                {formData.drainScore}
                <small>/10</small>
              </span>
            </div>
            <div className="gauge-track" aria-hidden="true">
              <div
                className="gauge-indicator"
                style={{ width: `${(formData.drainScore / 10) * 100}%` }}
              />
            </div>
            <input
              id="drain-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={formData.drainScore}
              onChange={(e) => handleChange("drainScore", e.target.value)}
              className="native-slider"
            />
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
              onClick={handleDismiss}
            >
              Dismiss
            </button>
            <button type="submit" className="action-solid">
              Commit entry
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default InteractionModal;

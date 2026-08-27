import React, { useState } from "react";
import { apiClient } from "../api/axiosClient";
import { generate } from "./boundary.service";

import "./boundary.css";

export default function BoundaryGenerator() {
  const [situation, setSituation] = useState("");
  const [boundaryMessage, setBoundaryMessage] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateBoundary = async (e) => {
    if (e) e.preventDefault();
    if (!situation.trim()) return;

    setLoading(true);
    setError("");

    try {
      const { message, source } = await generate(situation);

      setBoundaryMessage(message);
      setSource(source);
    } catch (err) {
      const message =
        err.response?.data.errors.situation || err.message || "invalid";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="heading">Aura — Boundary Helper</h2>
      <p className="subtext">
        Enter your current situation or context, and Aura will write a boundary
        message for you.
      </p>

      <form onSubmit={generateBoundary}>
        <textarea
          className="textarea"
          rows="4"
          placeholder="e.g., My friend keeps asking me to hang out, but I'm exhausted."
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button
          type="submit"
          disabled={loading || !situation.trim()}
          className="primary-button"
        >
          {loading ? "Generating..." : "Generate Message"}
        </button>
      </form>

      {boundaryMessage && (
        <div className="result-box">
          <div className="result-header">
            <span className="result-title">Suggested Boundary</span>
            <span className="badge">{source.toUpperCase()}</span>
          </div>

          <p className="message-text">“{boundaryMessage}”</p>

          <button
            type="button"
            onClick={generateBoundary}
            disabled={loading}
            className="secondary-button"
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
      )}
    </div>
  );
}

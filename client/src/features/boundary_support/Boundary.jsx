import React, { useState } from "react";
import { apiClient } from "../api/axiosClient";
import { generate } from "./boundary.service";

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
    <div style={styles.card}>
      <h2 style={styles.heading}>Aura — Boundary Helper</h2>
      <p style={styles.subtext}>
        Enter your current situation or context, and Aura will write a boundary
        message for you.
      </p>

      <form onSubmit={generateBoundary}>
        <textarea
          style={styles.textarea}
          rows="4"
          placeholder="e.g., My friend keeps asking me to hang out, but I'm exhausted."
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          required
        />

        {error && <div style={styles.error}>{error}</div>}

        <button
          type="submit"
          disabled={loading || !situation.trim()}
          style={styles.primaryButton}
        >
          {loading ? "Generating..." : "Generate Message"}
        </button>
      </form>

      {boundaryMessage && (
        <div style={styles.resultBox}>
          <div style={styles.resultHeader}>
            <span style={styles.resultTitle}>Suggested Boundary</span>
            <span style={styles.badge}>{source.toUpperCase()}</span>
          </div>

          <p style={styles.messageText}>“{boundaryMessage}”</p>

          <button
            type="button"
            onClick={generateBoundary}
            disabled={loading}
            style={styles.secondaryButton}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
      )}
    </div>
  );
}

// Inline styles for rapid setup (or map to Tailwind / CSS Modules)
const styles = {
  card: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    backgroundColor: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  heading: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px",
  },
  subtext: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "16px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    marginBottom: "12px",
    resize: "vertical",
  },
  primaryButton: {
    width: "100%",
    padding: "10px 16px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "8px 14px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    fontSize: "0.875rem",
    marginBottom: "12px",
  },
  resultBox: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  resultTitle: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
  },
  badge: {
    fontSize: "0.7rem",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "12px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
  },
  messageText: {
    fontSize: "1rem",
    color: "#1f2937",
    fontStyle: "italic",
    marginBottom: "14px",
    lineHeight: "1.4",
  },
};

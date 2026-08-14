import React from "react";
import { Briefcase, Users, Smile, Heart, MessageSquare } from "lucide-react";

const DailyInteractionsCard = ({ interactions = [] }) => {
  const getTagInfo = (score) => {
    if (score > 0) {
      return { tag: "Life-Giving", color: "#10b981" }; // Green for positive energy
    } else if (score <= -5) {
      return { tag: "High Drain", color: "#f97316" }; // Orange for high drain
    } else if (score < 0) {
      return { tag: "Moderate Drain", color: "#eab308" }; // Yellow for mild drain
    }
    return { tag: "Neutral", color: "#64748b" }; // Slate Grey for 0
  };

  const getIcon = (type = "") => {
    const normalized = type.toLowerCase();
    if (normalized.includes("work") || normalized.includes("meeting")) {
      return <Briefcase size={20} />;
    }
    if (normalized.includes("friend")) {
      return <Users size={20} />;
    }
    if (normalized.includes("family")) {
      return <Smile size={20} />;
    }
    if (normalized.includes("partner")) {
      return <Heart size={20} />;
    }
    return <MessageSquare size={20} />;
  };

  return (
    <div className="summary-card">
      <div className="summary-header">
        <span className="summary-icon-wrapper">↗</span>
        <h3 className="summary-title">Connection Balance</h3>
        <span className="summary-date">Today</span>
      </div>

      <div className="summary-grid">
        {interactions && interactions.length > 0 ? (
          interactions.map((item) => {
            const name =
              item.relationship_type_name || item.custom_name || "Interaction";
            const score = item.drain_score ?? 0;
            const { tag, color } = getTagInfo(score);

            return (
              <div key={item.id} className="summary-item">
                <div className="item-label">
                  <span className="item-icon" style={{ color }}>
                    {getIcon(name)}
                  </span>
                  <span>{name}</span>
                </div>

                <div className="item-data-row">
                  <span className="item-score">
                    {score > 0 ? `+${score}` : score}
                  </span>

                  {/* Visual indicator bar based on score max scale (e.g., 15) */}
                  <div className="item-bar-container">
                    <div
                      className="item-bar-fill"
                      style={{
                        width: `${Math.min(100, (Math.abs(score) / 15) * 100)}%`,
                        backgroundColor: color,
                        marginLeft:
                          score < 0
                            ? `${100 - (Math.abs(score) / 15) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="item-footer-meta"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    marginTop: "4px",
                  }}
                >
                  <span className="item-tag" style={{ color }}>
                    {tag}
                  </span>
                  {item.duration_minutes && (
                    <span
                      className="item-duration"
                      style={{ color: "#94a3b8" }}
                    >
                      {item.duration_minutes}m
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p
            className="empty-text"
            style={{
              color: "#94a3b8",
              fontSize: "0.875rem",
              padding: "12px 0",
            }}
          >
            No interactions logged for today.
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyInteractionsCard;

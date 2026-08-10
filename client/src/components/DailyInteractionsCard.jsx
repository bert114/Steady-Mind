import React from "react";
import { Briefcase, Users, Heart, Smile } from "lucide-react";

const DailyInteractionsCard = () => {
  const dailySummary = {
    workMeetings: { score: -12, tag: "High Drain" },
    friends: { score: 8, tag: "Life-Giving" },
    family: { score: -4, tag: "Neutral" },
    partner: { score: 9, tag: "Life-Giving" },
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case "Life-Giving":
        return "#10b981"; // Green
      case "High Drain":
        return "#f97316"; // Orange
      case "Neutral":
        return "#64748b"; // Slate Grey
      default:
        return "#64748b";
    }
  };

  const metricIcons = {
    workMeetings: <Briefcase size={20} />,
    friends: <Users size={20} />,
    family: <Smile size={20} />,
    partner: <Heart size={20} />,
  };

  return (
    <div className="summary-card">
      <div className="summary-header">
        <span className="summary-icon-wrapper">↗</span>
        <h3 className="summary-title">Connection balance</h3>
        <span className="summary-date">Today</span>
      </div>

      <div className="summary-grid">
        {Object.entries(dailySummary).map(([key, data]) => (
          <div key={key} className="summary-item">
            <div className="item-label">
              <span
                className="item-icon"
                style={{ color: getTagColor(data.tag) }}
              >
                {metricIcons[key]}
              </span>
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
            </div>

            <div className="item-data-row">
              <span className="item-score">
                {data.score > 0 ? `+${data.score}` : data.score}
              </span>
              {/* A simple visual indicator bar. Full scale could be -15 to +15. */}
              <div className="item-bar-container">
                <div
                  className="item-bar-fill"
                  style={{
                    width: `${Math.min(100, (Math.abs(data.score) / 15) * 100)}%`,
                    backgroundColor: getTagColor(data.tag),
                    // If score is negative, shift bar to the left visually
                    marginLeft:
                      data.score < 0
                        ? `${100 - (Math.abs(data.score) / 15) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
            <span className="item-tag" style={{ color: getTagColor(data.tag) }}>
              {data.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyInteractionsCard;

import React from "react";
import { useRecoveryStore } from "./useRecoveryStore";
import { useRecovery } from "./useRecoveryHook";
import "./recovery.css";
import { useState } from "react";

function RecoveryActivity({ riskLevel }) {
  const { isElevated, recommendations, loading, completeActivity } =
    useRecovery(riskLevel);

  const [activeFeedbackId, setActiveFeedbackId] = useState(null);

  const handleRatingSelect = (activityId, ratingScore) => {
    completeActivity(activityId, ratingScore);
    setActiveFeedbackId(null);
  };

  if (!isElevated) return null;

  return (
    <div className="recovery-card">
      <div className="recovery-header">
        <h4 className="recovery-title">Pending Recovery Actions</h4>
        {recommendations.length > 0 && (
          <span className="pending-badge">
            {recommendations.length} Pending
          </span>
        )}
      </div>

      {loading && recommendations.length === 0 ? (
        <p className="recovery-loading">Loading suggestions...</p>
      ) : (
        <div className="recovery-list">
          {recommendations.map((activity) => (
            <div key={activity.id} className="recovery-item">
              <div className="recovery-item-header">
                <div className="activity-info">
                  <p className="activity-name">{activity.name}</p>
                  <span className="activity-effort">
                    Effort: {activity.effort}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setActiveFeedbackId(
                      activeFeedbackId === activity.id ? null : activity.id,
                    )
                  }
                  className="task-complete-btn"
                >
                  {activeFeedbackId === activity.id ? "Cancel" : "Mark Done"}
                </button>
              </div>

              {activeFeedbackId === activity.id && (
                <div className="feedback-inline">
                  <p className="feedback-question">
                    Did this activity help you feel better?
                  </p>
                  <div className="rating-options">
                    <button
                      onClick={() => handleRatingSelect(activity.id, 5)}
                      className="rating-btn"
                    >
                      Yes, a lot!
                    </button>
                    <button
                      onClick={() => handleRatingSelect(activity.id, 3)}
                      className="rating-btn"
                    >
                      A little
                    </button>
                    <button
                      onClick={() => handleRatingSelect(activity.id, 1)}
                      className="rating-btn"
                    >
                      Not really
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecoveryActivity;

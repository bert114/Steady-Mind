import React from "react";
import { useRecoveryStore } from "./useRecoveryStore";
import { useRecovery } from "./useRecoveryHook";
import "./recovery.css";
import { useState } from "react";
import { useEffect } from "react";

function RecoveryActivity({ riskLevel, interactionCauseId }) {
  const { isElevated, recommendations, loading, completeActivity } =
    useRecovery(riskLevel);
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);

  const handleRatingSelect = async (activityId, ratingScore) => {
    await completeActivity(activityId, ratingScore, interactionCauseId, true);
    setActiveFeedbackId(null);
  };

  if (!isElevated) return null;

  const pendingCount = recommendations.filter((act) => !act.isCompleted).length;

  return (
    <div className="recovery-card">
      <div className="recovery-header">
        <h4 className="recovery-title">Recovery</h4>
        {recommendations.length > 0 && (
          <span className="pending-badge">{pendingCount} to do</span>
        )}
      </div>

      {loading && recommendations.length === 0 ? (
        <p className="recovery-loading">Loading recovery ideas...</p>
      ) : (
        <div className="recovery-list">
          {recommendations.map((activity) => (
            <div
              key={activity.id}
              className={`recovery-item ${activity.isCompleted ? "completed" : ""}`}
            >
              <div className="recovery-item-header">
                <div className="activity-info">
                  <p className="activity-name">{activity.name}</p>
                  <span className="activity-effort">
                    Effort: {activity.effort}
                  </span>
                  {activity.isCompleted && activity.lastRating && (
                    <span className="activity-rating-saved text-sm text-gray-500 ml-2">
                      Saved rating: {activity.lastRating}/5
                    </span>
                  )}
                </div>

                {!activity.isCompleted && (
                  <button
                    onClick={() => setActiveFeedbackId(activity.id)}
                    className="recovery-action-button"
                  >
                    Track it
                  </button>
                )}

                {activity.isCompleted && (
                  <span className="completed-badge">Done</span>
                )}
              </div>

              {activeFeedbackId === activity.id && !activity.isCompleted && (
                <div className="feedback-inline">
                  <p className="feedback-question">Did this help?</p>
                  <div className="rating-options">
                    <button
                      onClick={() => handleRatingSelect(activity.id, 5)}
                      className="rating-btn"
                    >
                      Yes, a lot
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

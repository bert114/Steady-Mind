import React from "react";
import { useRecoveryStore } from "./useRecoveryStore";
import { useRecovery } from "./useRecoveryHook";
import "./recovery.css";
import { useState } from "react";
import { useEffect } from "react";

function RecoveryActivity({ riskLevel, interactionCauseId, data }) {
  const { isElevated, recommendations, loading, completeActivity } =
    useRecovery(riskLevel);

  useEffect(() => console.log(data), [data]);

  const [activeFeedbackId, setActiveFeedbackId] = useState(null);

  const handleRatingSelect = async (activityId, ratingScore) => {
    await completeActivity(activityId, ratingScore);
    setActiveFeedbackId(null);
  };

  if (!isElevated) return null;

  const pendingCount = recommendations.filter((act) => !act.isCompleted).length;

  return (
    <div className="recovery-card">
      <div className="recovery-header">
        <h4 className="recovery-title">Recovery Actions</h4>
        {recommendations.length > 0 && (
          <span className="pending-badge">{pendingCount} Pending</span>
        )}
      </div>

      {loading && recommendations.length === 0 ? (
        <p className="recovery-loading">Loading suggestions...</p>
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
                </div>

                <button
                  onClick={() =>
                    completeActivity(activity.id, 5, interactionCauseId, true)
                  }
                  disabled={activity.isCompleted}
                  className={`px-4 py-2 rounded-md ${
                    activity.isCompleted
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {activity.isCompleted ? "Completed ✓" : "Mark Done"}
                </button>
              </div>

              {activeFeedbackId === activity.id && !activity.isCompleted && (
                <div className="feedback-inline">
                  <p className="feedback-question">
                    Did this activity help you feel better?
                  </p>
                  <div className="rating-options">
                    <button
                      onClick={() => handleRatingSelect(activity.id, 5)}
                      className="rating-btn"
                    >
                      Yes, a lot! 🙌
                    </button>
                    <button
                      onClick={() => handleRatingSelect(activity.id, 3)}
                      className="rating-btn"
                    >
                      A little 🙂
                    </button>
                    <button
                      onClick={() => handleRatingSelect(activity.id, 1)}
                      className="rating-btn"
                    >
                      Not really 🙁
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

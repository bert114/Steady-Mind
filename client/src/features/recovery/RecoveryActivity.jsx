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
                  {/* INLINE DISPLAY: Show the saved rating once completed */}
                  {activity.isCompleted && activity.lastRating && (
                    <span className="activity-rating-saved text-sm text-gray-500 ml-2">
                      Rated: {activity.lastRating}/5
                    </span>
                  )}
                </div>

                {!activity.isCompleted && (
                  <button
                    onClick={() => setActiveFeedbackId(activity.id)} // Open rating options
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Mark Done
                  </button>
                )}

                {activity.isCompleted && (
                  <span className="px-4 py-2 rounded-md bg-green-100 text-green-700">
                    Completed ✓
                  </span>
                )}
              </div>

              {activeFeedbackId === activity.id && !activity.isCompleted && (
                <div className="feedback-inline mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="feedback-question text-sm font-medium mb-2">
                    Did this activity help you feel better?
                  </p>
                  <div className="rating-options flex gap-2">
                    <button
                      onClick={() => handleRatingSelect(activity.id, 5)}
                      className="rating-btn px-3 py-1 bg-white border rounded hover:bg-gray-100"
                    >
                      Yes, a lot! 🙌
                    </button>
                    <button
                      onClick={() => handleRatingSelect(activity.id, 3)}
                      className="rating-btn px-3 py-1 bg-white border rounded hover:bg-gray-100"
                    >
                      A little 🙂
                    </button>
                    <button
                      onClick={() => handleRatingSelect(activity.id, 1)}
                      className="rating-btn px-3 py-1 bg-white border rounded hover:bg-gray-100"
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

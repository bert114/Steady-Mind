import React, { useState } from "react";
import { useRecoveryStore } from "./useRecoveryStore";

export default function ActiveActivityTracker() {
  const [rating, setRating] = useState(5);
  const activeActivityId = useRecoveryStore((s) => s.activeActivityId);
  const activities = useRecoveryStore((s) => s.activities);
  const completeActivity = useRecoveryStore((s) => s.completeActivity);

  const activeActivity = activities.find((a) => a.id === activeActivityId);
  if (!activeActivity) return null;

  const handleSubmit = () => {
    completeActivity(activeActivity.id, Number(rating));
  };

  return (
    <section className="active-tracker">
      <h2>Currently Doing: {activeActivity.name}</h2>
      <p>Take your time. Rate how effective this was when finished.</p>

      <div className="active-tracker__control-group">
        <label htmlFor="rating-slider" className="active-tracker__label">
          Effectiveness Rating: {rating} / 10
        </label>
        <input
          id="rating-slider"
          type="range"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="active-tracker__slider"
        />
      </div>

      <button onClick={handleSubmit} className="btn btn-success">
        Mark as Completed
      </button>
    </section>
  );
}

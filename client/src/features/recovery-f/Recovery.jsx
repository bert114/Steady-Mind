import React, { useEffect, useState } from "react";
import "./recovery.css";
import { useRecoveryHook } from "./useRecoveryHook";

export default function Recovery({ option = [] }) {
  const { setRecovery, addObject, payload } = useRecoveryHook();

  useEffect(() => {
    if (!option) return;
    setRecovery(option);
  }, [option, setRecovery]);

  const [sessions, setSessions] = useState([
    { id: 1, activity_id: 101, completed: true, rating: 5, date: "2026-08-10" },
    { id: 2, activity_id: 102, completed: true, rating: 4, date: "2026-08-11" },
  ]);

  const [selectedId, setSelectedId] = useState("");
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState(3);

  const getStats = (id) => {
    const logs = sessions.filter((s) => s.activity_id === id && s.rating);
    if (!logs.length) return { avg: 0, count: 0 };
    const sum = logs.reduce((acc, curr) => acc + curr.rating, 0);
    return { avg: (sum / logs.length).toFixed(1), count: logs.length };
  };

  const activityList = Array.isArray(option) ? option : [];

  const sortedActivities = [...activityList].sort(
    (a, b) => getStats(b.id).avg - getStats(a.id).avg,
  );

  const topPerformers = sortedActivities.filter(
    (a) => getStats(a.id).avg >= 4.0,
  );

  const handleSave = (e) => {
    e.preventDefault();

    setSessions([payload, ...sessions]);

    setSelectedId("");
    setCompleted(false);
    setRating(3);
  };

  return (
    <div className="recovery">
      <h2>Recovery Tracker</h2>

      {/* Top Performers Banner */}
      <div className="box top">
        <strong>Best-Performing Activities</strong>
        {topPerformers.length === 0 ? (
          <p>No top performers yet.</p>
        ) : (
          <ul>
            {topPerformers.map((a) => (
              <li key={a.id}>
                {a.name} — Rating: {getStats(a.id).avg}/5 (
                {getStats(a.id).count} completed)
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Log Form */}
      <form className="box" onSubmit={handleSave}>
        <div className="field">
          <label>Activity (Recommended First)</label>
          <select
            value={payload.id}
            onChange={(e) => addObject({ id: e.target.value })}
            required
          >
            <option value="">Select activity...</option>
            {sortedActivities.map((a) => {
              const { avg } = getStats(a.id);
              return (
                <option key={a.id} value={a.id}>
                  {a.name} {avg > 0 ? `(Avg: ${avg}/5)` : ""}
                </option>
              );
            })}
          </select>
        </div>

        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={payload.isComplete}
              onChange={(e) => addObject({ isComplete: e.target.checked })}
            />{" "}
            Mark as Completed
          </label>
        </div>

        {payload.isComplete && (
          <div className="field">
            <label>Effectiveness (1-5)</label>
            <select
              value={payload.rating}
              onChange={(e) => addObject({ rating: e.target.value })}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit">Save Activity</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => {
            const act = activityList.find((a) => a.id === s.activity_id);
            return (
              <tr key={s.id}>
                <td>{act ? act.name : "Unknown"}</td>
                <td>{s.completed ? "Completed" : "Pending"}</td>
                <td>{s.rating ? `${s.rating} / 5` : "N/A"}</td>
                <td>{s.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

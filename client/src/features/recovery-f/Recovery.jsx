import { useEffect } from "react";
import ActivityPerformance from "./component/ActivityPerformance";
import "./recovery.css";
import "./recoveryActivity.css";
import { useRecoveryHook } from "./useRecoveryHook";

export default function Recovery({ option = [], topPerformance }) {
  const { setRecovery, addObject, payload, saveRecovery, error, isSubmitting } =
    useRecoveryHook();
  useEffect(() => {
    if (!option) return;

    //console.log("performance", topPerformance);
  }, [option, topPerformance]);

  if (!option || option.length === 0) {
    return (
      <section className="recovery recovery-empty-state" role="status">
        <h2>Recovery activities unavailable</h2>
        <p>There are no recovery activities to choose from right now.</p>
      </section>
    );
  }

  return (
    <div className="recovery">
      <h2>Recovery Tracker</h2>

      <ActivityPerformance performance={topPerformance} />
      {error && (
        <p className="recovery-error" role="alert">
          We could not save this recovery activity. Please try again.
        </p>
      )}
      <form
        className="box"
        onSubmit={(e) => saveRecovery(e, { name: "idsjisjisji" })}
      >
        <div className="field">
          <label>Activity (Recommended First)</label>
          <select
            value={payload.id}
            onChange={(e) =>
              addObject({
                id: e.target.value,
              })
            }
            required
          >
            <option value="">Select activity...</option>
            {option.map((a, index) => {
              return (
                <option key={`${a.id}-${index}`} value={a.id}>
                  {a.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={payload?.is_complete ?? false}
              onChange={(e) => addObject({ is_complete: e.target.checked })}
            />{" "}
            Mark as Completed
          </label>
          <div className="err">{error?.is_complete || ""}</div>
        </div>

        {payload.is_complete && (
          <div className="field">
            <label>Effectiveness (1-5)</label>
            <select
              value={payload.rating || 1}
              onChange={(e) => addObject({ rating: e.target.value })}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {/* <div className="error">{error.rating}</div> */}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting && (
            <span className="loading-spinner" aria-hidden="true" />
          )}
          {isSubmitting ? "Saving..." : "Save Activity"}
        </button>
      </form>

      {/* <table>
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
      </table> */}
    </div>
  );
}

import { useEffect } from "react";
import ActivityPerformance from "./component/ActivityPerformance";
import "./recovery.css";
import "./recoveryActivity.css";
import { useRecoveryHook } from "./useRecoveryHook";

export default function Recovery({
  option = [],
  topPerformance,
  guidance,
  riskLevel = "YELLOW",
}) {
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
      <div className="recovery-heading">
        <div>
          <p className="recovery-kicker">Your next useful step</p>
          <h2>Recovery choices</h2>
        </div>
        <span className="recovery-effort">
          {riskLevel === "RED" ? "Low effort first" : "Medium effort options"}
        </span>
      </div>
      <p className="recovery-guidance">
        {guidance ||
          (riskLevel === "RED"
            ? "Your current state calls for something restorative and easy to begin."
            : "Choose something manageable that gives your energy room to return.")}
      </p>

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
          <span className="field-label">Pick one to try</span>
          <div
            className="recovery-options"
            role="radiogroup"
            aria-label="Recovery activities"
          >
            {option.map((a, index) => (
              <label
                className={`recovery-option ${payload.id === a.id ? "selected" : ""}`}
                key={`${a.id}-${index}`}
              >
                <input
                  type="radio"
                  name="recovery-activity"
                  value={a.id}
                  checked={payload.id === a.id}
                  onChange={() => addObject({ id: a.id })}
                  required
                />
                <span>
                  <strong>{a.name}</strong>
                  <small>
                    {a.effort_level
                      ? `${a.effort_level.toLowerCase()} effort`
                      : "A manageable reset"}
                    {a.duration ? ` · ${a.duration}` : ""}
                  </small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="completion-toggle">
            <input
              type="checkbox"
              checked={payload?.is_complete ?? false}
              onChange={(e) => addObject({ is_complete: e.target.checked })}
            />
            I tried this activity
          </label>
          <div className="err">{error?.is_complete || ""}</div>
        </div>

        {payload.is_complete && (
          <div className="field">
            <label htmlFor="recovery-rating">How did it help?</label>
            <select
              id="recovery-rating"
              value={payload.rating || ""}
              onChange={(e) => addObject({ rating: e.target.value })}
              required
            >
              <option value="" disabled>
                Select how it helped...
              </option>
              <option value="1">Did not help (1/5)</option>
              <option value="2">Helped a little (2/5)</option>
              <option value="3">Helped somewhat (3/5)</option>
              <option value="4">Helped a lot (4/5)</option>
              <option value="5">Helped a great deal (5/5)</option>
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

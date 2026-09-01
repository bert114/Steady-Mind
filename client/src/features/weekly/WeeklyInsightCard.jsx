import { Link } from "react-router-dom";
import "./weeklyInsightCard.css";

function WeeklyInsightCard({ insight }) {
  if (!insight) {
    return (
      <article className="week-card week-card--empty">
        <p className="week-card__kicker">Your week</p>
        <h3 className="week-card__title">No summary yet</h3>
        <p className="week-card__body">
          Open the weekly view to turn this week&apos;s check-ins and
          interactions into one simple summary.
        </p>
        <Link to="/weekly" className="week-card__link">
          View your week
        </Link>
      </article>
    );
  }

  const { metrics, observations } = insight;

  return (
    <article className="week-card">
      <div className="week-card__heading">
        <div>
          <p className="week-card__kicker">Your week</p>
          <h3 className="week-card__title">A quick read</h3>
        </div>
        <Link to="/weekly" className="week-card__link">
          Full summary
        </Link>
      </div>

      <ul className="week-card__observations">
        {(observations || []).map((observation) => (
          <li key={observation.key}>{observation.text}</li>
        ))}
      </ul>

      <div className="week-card__metrics">
        <span>
          Energy <strong>{metrics?.averageEnergy ?? "--"}</strong>
        </span>
        <span>
          Mood <strong>{metrics?.moodLabel ?? "--"}</strong>
        </span>
        <span>
          Interactions <strong>{metrics?.interactionCount ?? "--"}</strong>
        </span>
      </div>
    </article>
  );
}

export default WeeklyInsightCard;
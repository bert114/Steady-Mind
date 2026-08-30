import { useEffect } from "react";

const DailyInteractionsCard = ({ interactions = [] }) => {
  const getTone = (score) => {
    if (score > 0) return "positive";
    if (score < 0) return "negative";
    return "neutral";
  };

  useEffect(() => {
    //console.log(interactions);
  }, [interactions]);

  return (
    <div className="summary-card ">
      <div className="summary-header">
        <h3 className="summary-title">What’s pulling my energy down</h3>
      </div>

      <div className="summary-list">
        {interactions && interactions.length > 0 ? (
          interactions.map((item) => {
            const name =
              item.relationship_type_name || item.custom_name || "Interaction";
            const score = item.drain_score ?? 0;
            const tone = getTone(score);

            return (
              <div
                key={item.id}
                className={`summary-item summary-item--${tone}`}
              >
                <div className="item-label">
                  <span className="item-name">{name}</span>
                  <span className="item-duration">
                    {item.duration_minutes
                      ? `${item.duration_minutes} min`
                      : ""}
                  </span>
                </div>

                <span className={`item-score item-score--${tone}`}>
                  {score > 0 ? `+${score}` : score}
                </span>
              </div>
            );
          })
        ) : (
          <p className="empty-text">No interactions logged for today.</p>
        )}
      </div>
    </div>
  );
};

export default DailyInteractionsCard;

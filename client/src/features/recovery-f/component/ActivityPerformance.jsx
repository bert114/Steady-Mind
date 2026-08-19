const ActivityPerformance = ({ performance = [] }) => {
  if (!performance.length) {
    return (
      <div className="empty-state">
        No activity performance data available yet.
      </div>
    );
  }

  return (
    <div className="performance-container">
      <div className="performance-header">
        <h2 className="performance-title">Activity Effectiveness</h2>
        <span className="performance-subtitle">Ranked by Rating</span>
      </div>

      <div className="performance-list">
        {performance.map((item) => {
          const ratingNum = parseFloat(item.average_rating) || 0;
          const percentage = (ratingNum / 5) * 100;
          const attempts = parseInt(item.total_completed_attempts, 10);

          return (
            <div key={item.activity_id} className="activity-card">
              <div className="activity-info">
                <h3 className="activity-name">{item.activity_name}</h3>
                <span className="activity-attempts">
                  {attempts} {attempts === 1 ? "attempt" : "attempts"} completed
                </span>
              </div>

              <div className="activity-metrics">
                <div className="rating-header">
                  <span className="rating-label">Score</span>
                  <div>
                    <span className="rating-value">{ratingNum.toFixed(1)}</span>
                    <span className="rating-max"> / 5</span>
                  </div>
                </div>

                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityPerformance;

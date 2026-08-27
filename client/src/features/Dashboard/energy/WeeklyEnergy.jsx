import { useState } from "react";
import "./energy.css";

const MOODS = ["1", "2", "3", "4", "5"];

export function WeeklyEnergy({
  weeklyEnergy = [],
  isLoading = false,
  onSelectDay,
}) {
  const [selectedDay, setSelectedDay] = useState(null);

  if (isLoading) {
    return <div className="dashboard-state">Loading weeklyEnergy...</div>;
  }

  if (!weeklyEnergy.length) {
    return (
      <div className="dashboard-state">
        <strong>Your weekly view is waiting for data.</strong>
        <span>Log your energy on more days to see patterns here.</span>
      </div>
    );
  }

  const active =
    selectedDay ??
    (weeklyEnergy.find((m) => m.isToday) ||
      weeklyEnergy[weeklyEnergy.length - 1]);

  return (
    <div className="dashboard-card">
      {/* Active Day Header */}
      <div className="dashboard-header">
        <div>
          <div className="header-label">
            {active.isToday ? "Today" : active.day}
          </div>
          <div className="header-value">
            <span>{MOODS[active.moodScore] || "😐"}</span>
            <span>Mood {active.moodScore}/4</span>
          </div>
        </div>

        <div className="header-right">
          <div className="header-label">Battery</div>
          <div className="header-value">{active.batteryLevel}%</div>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid-container">
        {weeklyEnergy.map((item) => {
          const isSelected = active.day === item.day;
          const batteryClass =
            item.batteryLevel >= 70
              ? "battery-healthy"
              : item.batteryLevel >= 30
                ? "battery-neutral"
                : "battery-low";

          return (
            <button
              key={item.day}
              type="button"
              onClick={() => {
                setSelectedDay(item);
                if (onSelectDay) onSelectDay(item);
              }}
              className={`day-card ${isSelected ? "selected" : ""}`}
            >
              {/* Day */}
              <span className={`day-label ${item.isToday ? "today" : ""}`}>
                {item.isToday ? "TODAY" : item.day}
              </span>

              {/* Mood Emoji */}
              <span className="mood-emoji">
                {MOODS[item.moodScore] || "😐"}
              </span>

              {/* Battery Bar */}
              <div className="battery-container">
                <div
                  className={`battery-fill ${batteryClass}`}
                  style={{ height: `${Math.max(item.batteryLevel, 5)}%` }}
                />
              </div>

              {/* Percentage */}
              <span className="battery-percent">{item.batteryLevel}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyEnergy;

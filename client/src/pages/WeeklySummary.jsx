import { useEffect } from "react";

function WeeklySummary({ data }) {
  useEffect(() => {
    console.log(data);
  }, [data]);

  return <h1>Weekly Summary</h1>;
  const battery = data?.battery;
  const mood = data?.mood;
  const drain = data?.drain_score;

  return (
    <section className="weekly-metrics" aria-label="This week's summary">
      <h1 className="weekly-summary__title">Weekly Summary</h1>

      <ul>
        <li>
          Average Energy: {battery?.label ?? "--"} ({battery?.value ?? 0})
        </li>
        <li>
          Average Mood: {mood?.label ?? "--"} ({mood?.value ?? 0})
        </li>
        <li>
          Avg. Social Drain: {drain?.label ?? "--"} ({drain?.value ?? 0})
        </li>

        <li>Avg. Social Interaction: {data?.interactionCount?.value ?? 0}</li>
      </ul>
    </section>
  );
}

export default WeeklySummary;

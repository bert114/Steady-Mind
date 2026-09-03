import EmptyState from "../components/states/EmptySate.jsx";
import LoadingState from "../components/states/LoadingState.jsx";
import { useWeeklySummary } from "../features/weekly-summary/useWeeklySummary.js";
import {
  buildFeltMetrics,
  hasSummaryData,
} from "../features/weekly-summary/weeklySummary.utils.js";
import DrainedMetrics from "../features/weekly-summary/components/DrainedMetrics.jsx";
import FeltMetrics from "../features/weekly-summary/components/FeltMetrics.jsx";
import WeeklySummaryHeader from "../features/weekly-summary/components/WeeklySummaryHeader.jsx";
import "../features/weekly-summary/weeklySummary.css";

function WeeklySummary() {
  const { data, isLoading, error, refetch } = useWeeklySummary();

  if (isLoading && !data) {
    return (
      <section className="summary-shell" aria-busy="true">
        <LoadingState />
      </section>
    );
  }

  if (error && !data) {
    return <EmptyState title="Weekly summary unavailable" message={error} error />;
  }

  if (!hasSummaryData(data)) {
    return (
      <section className="summary-shell">
        <EmptyState
          title="Your week is waiting"
          message="Log a few check-ins and interactions to get your weekly summary."
        />
      </section>
    );
  }

  return (
    <section className="summary-shell">
      <WeeklySummaryHeader
        weekStart={data.weekStart}
        isLoading={isLoading}
        onRefresh={refetch}
      />

      <FeltMetrics metrics={buildFeltMetrics(data)} />

      <DrainedMetrics
        drainAverage={data.drain?.average}
        interactionCount={data.interactions?.length ?? 0}
        highestDrain={data.highestDrainingRelationship}
      />
    </section>
  );
}

export default WeeklySummary;

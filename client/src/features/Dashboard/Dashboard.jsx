import DailyInteractionsCard from "../../components/DailyInteractionsCard";
import "../../components/scss/Main.scss";
import EmptyState from "../../components/states/EmptySate";
import LoadingState from "../../components/states/LoadingState";
import Battery from "../battery/Battery.jsx";
import Burnout from "../burnout/Burnout.jsx";
import Modal from "../Logger/Modal";
import { useModalStore } from "../Logger/useModalStore.js";
import Recovery from "../recovery-f/Recovery.jsx";
import WeeklyEnergy from "./energy/WeeklyEnergy.jsx";
import { useDashboard } from "./useDashboard.jsx";

function Dashboard({ userId = "user_clerk_123" }) {
  const { openModal } = useModalStore();
  const { dashboardData, isLoading, error } = useDashboard(userId);

  if (isLoading) return <LoadingState />;
  if (error) return <EmptyState message={error} />;
  if (!dashboardData) return <EmptyState />;

  const { metrics, recentInteractions, weeklyMood } = dashboardData;

  const {
    moodAndBattery,
    weeklyInteraction,
    burnoutRisk,
    batteryLevel,
    recoveryData,
  } = dashboardData;

  return (
    <section className="dashboard-shell">
      <header className="dashboard-topbar">
        <div className="dashboard-intro">
          <p className="dashboard-kicker">Today</p>
          <h2 className="dashboard-title">Your energy snapshot</h2>
        </div>

        <div className="dashboard-actions-bar">
          <button
            type="button"
            className="action-solid"
            onClick={() => openModal("energy")}
          >
            Log energy
          </button>

          <button
            type="button"
            className="action-solid"
            onClick={() => openModal("interaction")}
          >
            Log interaction
          </button>
        </div>
      </header>

      <article className="energy-spotlight">
        <div className="energy-spotlight__copy">
          <p className="energy-spotlight__eyebrow">Current energy</p>
          <div className="energy-spotlight__value-wrap">
            <span className="energy-spotlight__value">{batteryLevel}</span>
            <span className="energy-spotlight__scale">/100</span>
          </div>
          <p className="energy-spotlight__context">
            {burnoutRisk?.title || "How today feels"}
          </p>
        </div>

        <div className="energy-spotlight__visual">
          <Battery level={batteryLevel || 0} />
        </div>
      </article>

      <div className="editorial-layout">
        <section className="editorial-section editorial-section--status">
          <Burnout burnoutRisk={burnoutRisk} userId={userId} />
        </section>
      </div>

      <section className="editorial-section editorial-section--interaction">
        <DailyInteractionsCard interactions={weeklyInteraction} />
      </section>

      {/* <RecoveryActivity
        data={burnoutRisk}
        riskLevel={burnoutRisk?.riskLevel}
        interactionCauseId={burnoutRisk?.latestInteraction?.id}
      /> */}

      <section className="editorial-section editorial-section--mood">
        {/* <DailyMood score={metrics?.moodScore} /> */}

        <WeeklyEnergy weeklyEnergy={moodAndBattery} />
      </section>

      <Modal />

      {recoveryData.isActionRequired ? (
        <Recovery
          option={recoveryData?.test}
          topPerformance={recoveryData?.performance}
        />
      ) : null}
    </section>
  );
}

export default Dashboard;

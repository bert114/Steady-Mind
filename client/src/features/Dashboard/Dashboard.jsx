import "../../components/scss/Main.scss";
import DailyInteractionsCard from "../../components/DailyInteractionsCard";
import DailyMood from "../../components/DailyMood";
import EmptyState from "../../components/states/EmptySate";
import LoadingState from "../../components/states/LoadingState";
import Modal from "../Logger/Modal";
import Battery from "../battery/Battery.jsx";
import { useModalStore } from "../Logger/useModalStore.js";
import { useDashboard } from "./useDashboard.jsx";
import Burnout from "../burnout/Burnout.jsx";
import RecoveryActivity from "../recovery/RecoveryActivity.jsx";

function Dashboard({ userId = "user_clerk_123" }) {
  const { openModal } = useModalStore();
  const { dashboardData, isLoading, error } = useDashboard(userId);

  if (isLoading) return <LoadingState />;
  if (error) return <EmptyState message={error} />;
  if (!dashboardData) return <EmptyState />;

  const { metrics, burnoutRisk, recentInteractions } = dashboardData;

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
            <span className="energy-spotlight__value">
              {metrics?.batteryLevel ?? 0}
            </span>
            <span className="energy-spotlight__scale">/100</span>
          </div>
          <p className="energy-spotlight__context">
            {burnoutRisk?.title || "How today feels"}
          </p>
        </div>

        <div className="energy-spotlight__visual">
          <Battery level={metrics?.batteryLevel ?? 0} />
        </div>
      </article>

      <div className="editorial-layout">
        <section className="editorial-section editorial-section--status">
          <Burnout burnoutRisk={burnoutRisk} />
        </section>

        <section className="editorial-section editorial-section--mood">
          <DailyMood score={metrics?.moodScore} />
        </section>
      </div>

      <section className="editorial-section editorial-section--interaction">
        <DailyInteractionsCard interactions={recentInteractions} />
      </section>

      <RecoveryActivity
        data={burnoutRisk}
        riskLevel={burnoutRisk.riskLevel}
        interactionCauseId={burnoutRisk.latestInteraction?.id}
      />

      <Modal />
    </section>
  );
}

export default Dashboard;

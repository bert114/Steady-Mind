import { useEffect } from "react";
import "../../components/scss/Main.scss";
import DailyInteractionsCard from "../../components/DailyInteractionsCard";
import DailyMood from "../../components/DailyMood";
import StateTrigger from "../../components/SatesTrigger";
import EmptyState from "../../components/states/EmptySate";
import LoadingState from "../../components/states/LoadingState";
import Modal from "../Logger/Modal";
import EnergyMoodModal from "../components/EnergyModal";
import Battery from "../battery/Battery.jsx";
import { useModalStore } from "../Logger/useModalStore.js";
import { useDashboard } from "./useDashboard.jsx";
import Burnout from "../burnout/Burnout.jsx";

function Dashboard({ userId = "user_clerk_123" }) {
  const { openModal } = useModalStore();
  const { dashboardData, isLoading, error, refetch } = useDashboard(userId);

  if (isLoading) return <LoadingState />;
  if (error) return <EmptyState message={error} />;
  if (!dashboardData) return <EmptyState />;

  const { metrics, burnoutRisk, recentInteractions } = dashboardData;

  return (
    <section className="dashboard-shell">
      <Burnout burnoutRisk={burnoutRisk} />
      <div
        className="dashboard-actions-bar"
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <button
          type="button"
          className="action-solid"
          onClick={() => openModal("energy")}
        >
          + Log Energy
        </button>

        <button
          type="button"
          className="action-solid"
          onClick={() => openModal("interaction")}
        >
          + Log interaction
        </button>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card dashboard-card--primary">
          <div className="card-heading">
            <div>
              <p className="card-kicker">Energy Reserve</p>
              <h3>{burnoutRisk?.title || "How the day is holding up"}</h3>
            </div>
            <span
              className={`card-pill card-pill--${burnoutRisk?.riskLevel?.toLowerCase() || "green"}`}
            >
              {burnoutRisk?.riskLevel || "STEADY"}
            </span>
          </div>
          <Battery level={metrics?.batteryLevel ?? 0} />
        </article>

        <article className="dashboard-card">
          <DailyInteractionsCard interactions={recentInteractions} />
        </article>
      </div>

      <article className="dashboard-card dashboard-card--wide">
        <DailyMood score={metrics?.moodScore} />
      </article>

      <Modal />
    </section>
  );
}

export default Dashboard;

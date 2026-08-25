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
  if (error) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        message={error || "We could not load your dashboard right now."}
        error
      />
    );
  }
  if (!dashboardData) return <EmptyState />;

  const {
    moodAndBattery,
    weeklyInteraction,
    burnoutRisk,
    batteryLevel,
    recoveryData,
  } = dashboardData;

  const todayMood =
    moodAndBattery?.find((item) => item.isToday) ||
    moodAndBattery?.[moodAndBattery.length - 1];
  const moodSummary = todayMood
    ? `Mood ${todayMood.moodScore}/4`
    : "Not logged";
  const burnoutSummary =
    burnoutRisk?.title ||
    (burnoutRisk?.riskLevel === "RED"
      ? "High risk"
      : burnoutRisk?.riskLevel === "YELLOW"
        ? "Needs attention"
        : "Steady");
  const recoverySummary = recoveryData?.isActionRequired
    ? "Action needed"
    : "Recovery ready";

  return (
    <section className="dashboard-shell">
      <header className="dashboard-topbar">
        <div className="dashboard-intro">
          <p className="dashboard-kicker">Daily check-in</p>
          <h1 className="dashboard-title">Understand your capacity</h1>
          <p className="dashboard-description">
            See what is shaping your energy today and choose the next useful
            step.
          </p>
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

      <section className="dashboard-glance" aria-label="Today's summary">
        <article className="glance-item glance-item--energy">
          <span className="glance-label">Energy</span>
          <strong className="glance-value">{batteryLevel ?? "--"}</strong>
          <span className="glance-context">out of 100</span>
        </article>

        <article className="glance-item glance-item--mood">
          <span className="glance-label">Mood</span>
          <strong className="glance-value">{moodSummary}</strong>
          <span className="glance-context">today</span>
        </article>

        <article className="glance-item glance-item--burnout">
          <span className="glance-label">Burnout risk</span>
          <strong className="glance-value">{burnoutSummary}</strong>
          <span className="glance-context">current state</span>
        </article>

        <article className="glance-item glance-item--recovery">
          <span className="glance-label">Recovery</span>
          <strong className="glance-value">{recoverySummary}</strong>
          <span className="glance-context">next step</span>
        </article>
      </section>

      <div className="dashboard-content">
        <section
          className="dashboard-primary-region"
          aria-label="Current status"
        >
          <Burnout burnoutRisk={burnoutRisk} userId={userId} />

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
        </section>

        <section
          className="dashboard-trend-region"
          aria-label="Weekly trends and daily influences"
        >
          <div className="dashboard-section dashboard-section--trend">
            <div className="dashboard-section__heading">
              <div>
                <p className="dashboard-section__label">Pattern over time</p>
                <h2 id="weekly-energy-heading">Energy and mood this week</h2>
              </div>
            </div>
            <WeeklyEnergy weeklyEnergy={moodAndBattery} />
          </div>

          <div
            className="dashboard-secondary-region"
            aria-label="Daily influences"
          >
            <DailyInteractionsCard interactions={weeklyInteraction} />
          </div>
        </section>

        <section
          className="dashboard-section dashboard-section--recovery"
          aria-label="Recovery action"
        >
          {recoveryData.isActionRequired ? (
            <Recovery
              option={recoveryData?.test}
              topPerformance={recoveryData?.performance}
            />
          ) : null}
        </section>
      </div>

      {/* <RecoveryActivity
        data={burnoutRisk}
        riskLevel={burnoutRisk?.riskLevel}
        interactionCauseId={burnoutRisk?.latestInteraction?.id}
      /> */}

      <Modal />
    </section>
  );
}

export default Dashboard;

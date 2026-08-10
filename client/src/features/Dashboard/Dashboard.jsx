import { useEffect, useState } from "react";
import "../../components/scss/Main.scss";
import DailyInteractionsCard from "../../components/DailyInteractionsCard";
import DailyMood from "../../components/DailyMood";
import StateTrigger from "../../components/SatesTrigger";
import EmptyState from "../../components/states/EmptySate";
import LoadingState from "../../components/states/LoadingState";
import Modal from "../Logger/Modal";
import EnergyMoodModal from "../components/EnergyModal";
import Battery from "../battery/Battery.jsx";

function Dashboard({ set }) {
  const [viewState, setViewState] = useState("loading");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setViewState("ready");
    }, 900);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="dashboard-shell">
      {viewState === "loading" ? <LoadingState /> : null}

      {viewState === "empty" ? <EmptyState /> : null}

      {viewState === "ready" ? (
        <>
          <div
            className="dashboard-actions-bar"
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              className="action-solid"
              onClick={() => setIsModalOpen(true)}
            >
              + Log state
            </button>
          </div>

          <div className="dashboard-grid">
            <article className="dashboard-card dashboard-card--primary">
              <div className="card-heading">
                <div>
                  <p className="card-kicker">Energy reserve</p>
                  <h3>How the day is holding up</h3>
                </div>
                <span className="card-pill">steady</span>
              </div>
              <Battery />
            </article>

            <article className="dashboard-card">
              <DailyInteractionsCard />
            </article>
          </div>

          <article className="dashboard-card dashboard-card--wide">
            <DailyMood />
          </article>
        </>
      ) : null}

      {/* <EnergyMoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUserId="primary_user"
      /> */}

      <Modal
        type={"energy-mood"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

export default Dashboard;

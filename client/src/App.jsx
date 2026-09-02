import { useEffect, useLayoutEffect } from "react";
import "./App.css";
import Nav from "./components/nav/Nav.jsx";
import Analytics from "./features/analytics/Analytics.jsx";
import injectAuthTokenProvider from "./features/api/axiosClient.js";
import BoundaryGenerator from "./features/boundary_support/Boundary.jsx";
import Burnout from "./features/burnout/Burnout.jsx";
import Dashboard from "./features/Dashboard/Dashboard.jsx";
import Recovery from "./features/recovery-f/Recovery.jsx";
import Toast from "./features/toast/Toast.jsx";
import Weekly from "./features/weekly/Weekly.jsx";
import "./scss/main.scss";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useWeekyHook } from "./features/weekly-summary/useWeekyHook.jsx";
import WeeklySummary from "./pages/WeeklySummary.jsx";

function App() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const { data } = useWeekyHook();

  useLayoutEffect(() => {
    injectAuthTokenProvider(getToken);
  }, [getToken]);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  if (!user)
    return (
      <main className="auth-gate">
        <SignedOut>
          <div className="auth-gate__rule" aria-hidden="true" />
          <p className="auth-gate__kicker">FIELD NOTE / STEADY MIND</p>
          <h1>Return to your capacity.</h1>
          <p className="auth-gate__description">
            Sign in to read today&apos;s energy, mood, and recovery trace.
          </p>
          <SignInButton
            mode="modal"
            forceRedirectUrl="/Steady-Mind/"
            fallbackRedirectUrl="/Steady-Mind/"
          >
            <button type="button" className="auth-gate__button">
              Open your field notes
            </button>
          </SignInButton>
        </SignedOut>
      </main>
    );

  return (
    <Router basename="/Steady-Mind/">
      <div className="app-shell">
        <Toast />

        <SignedIn>
          {/* //data */}
          <Nav />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard userId={user.id} />} />
              <Route path="/boundary" element={<BoundaryGenerator />} />
              <Route path="/burnout" element={<Burnout />} />
              <Route path="/recovery" element={<Recovery />} />
              <Route path="/weekly" element={<Weekly />} />
              <Route
                path="/weekly-summary"
                element={<WeeklySummary data={data} />}
              />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<h2>Page Not Found</h2>} />
            </Routes>
          </main>
        </SignedIn>
      </div>
    </Router>
  );
}

export default App;

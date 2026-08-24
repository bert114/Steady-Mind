import { useEffect } from "react";
import "./App.css";
import Nav from "./components/nav/Nav.jsx";
import injectAuthTokenProvider from "./features/api/axiosClient.js";
import BoundaryGenerator from "./features/boundary_support/Boundary.jsx";
import Burnout from "./features/burnout/Burnout.jsx";
import Dashboard from "./features/Dashboard/Dashboard.jsx";
import Recovery from "./features/recovery-f/Recovery.jsx";
import Toast from "./features/toast/Toast.jsx";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    injectAuthTokenProvider(getToken);
  }, [getToken]);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  if (!user)
    return (
      <SignedOut>
        <p>Please sign in to access your dashboard.</p>
        <SignInButton mode="modal" />
      </SignedOut>
    );

  return (
    <Router>
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
              <Route path="*" element={<h2>Page Not Found</h2>} />
            </Routes>
          </main>
        </SignedIn>
      </div>
    </Router>
  );
}

export default App;

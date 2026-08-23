import "./App.css";
import Nav from "./components/nav/Nav.jsx";
import BoundaryGenerator from "./features/boundary_support/Boundary.jsx";
import Burnout from "./features/burnout/Burnout.jsx";
import Dashboard from "./features/Dashboard/Dashboard.jsx";
import Recovery from "./features/recovery-f/Recovery.jsx";
import Toast from "./features/toast/Toast.jsx";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Toast />
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/boundary" element={<BoundaryGenerator />} />
            <Route path="/burnout" element={<Burnout />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

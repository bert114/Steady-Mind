import "./App.css";
import BoundaryGenerator from "./features/boundary_support/Boundary.jsx";
import Burnout from "./features/burnout/Burnout.jsx";
import Dashboard from "./features/Dashboard/Dashboard.jsx";
import Recovery from "./features/recovery-f/Recovery.jsx";
import Toast from "./features/toast/Toast.jsx";

function App() {
  return (
    <div className="app-shell">
      <Toast />

      <main className="main-content">
        {/* <Dashboard /> */}

        <BoundaryGenerator />
      </main>
    </div>
  );
}

export default App;

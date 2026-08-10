import "./App.css";
import Dashboard from "./features/Dashboard/Dashboard.jsx";
import Toast from "./features/toast/Toast.jsx";

function App() {
  return (
    <div className="app-shell">
      <Toast />
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;

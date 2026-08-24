import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import "./nav.css";
import { UserButton } from "@clerk/clerk-react";

function Nav() {
  return (
    <nav className="top-nav">
      <div className="nav-logo">WellnessApp</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/boundary">Boundaries</NavLink>
        </li>
        <li>
          <NavLink to="/burnout">Burnout</NavLink>
        </li>
        <li>
          <NavLink to="/recovery">Recovery</NavLink>
        </li>

        <li>
          <UserButton />
        </li>
      </ul>
    </nav>
  );
}

export default Nav;

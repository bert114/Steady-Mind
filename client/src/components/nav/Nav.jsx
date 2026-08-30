import { UserButton } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import "./nav.css";

function Nav() {
  return (
    <nav className="top-nav">
      <div className="nav-logo">Aura</div>
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
          <NavLink to="/analytics">Analytics</NavLink>
        </li>

        <li>
          <UserButton />
        </li>
      </ul>
    </nav>
  );
}

export default Nav;

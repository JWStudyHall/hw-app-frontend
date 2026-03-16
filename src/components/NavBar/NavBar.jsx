import { useContext, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";
import "./NavBar.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className={`navbar ${isOpen ? "nav-open" : ""}`}>
      <div className="nav-container">
        <button
          className="nav-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span className={`hamburger-icon ${isOpen ? "is-open" : ""}`}>
            {isOpen ? "✕" : "☰"}
          </span>
        </button>
        <NavLink to="/" className="nav-logo">
          Health<span>Wealth</span>
        </NavLink>

        {user ? (
          <ul className="nav-list">
            <span className="user-greeting">
              Hi, <strong>{user.username}</strong>
            </span>
            <li>
              <NavLink to="/exercises" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Exercises
              </NavLink>
            </li>
            <li>
              <NavLink to="/workouts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Workouts
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Explore
              </NavLink>
            </li>

            <div className="user-section">
              <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Profile
              </NavLink>
              <button onClick={handleSignOut} className="btn-signout">
                Sign Out
              </button>
            </div>
          </ul>
        ) : (
          <div className="auth-links">
            <NavLink to="/" className="nav-link" style={{ alignSelf: "center" }}>
              Home
            </NavLink>
            <NavLink
              to="/sign-in"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              style={{ alignSelf: "center" }}
            >
              Sign In
            </NavLink>
            <NavLink to="/sign-up" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            style={{ alignSelf: "center" }}
            >

              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

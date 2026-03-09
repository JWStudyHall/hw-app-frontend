import { useContext } from "react";
import { NavLink } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";
import "./NavBar.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          Health<span>Wealth</span>
        </NavLink>

        {user ? (
          <ul className="nav-list">
            <li>
              <NavLink to="/exercises" className="nav-link">
                Exercises
              </NavLink>
            </li>
            <li>
              <NavLink to="/workouts" className="nav-link">
                Workouts
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className="nav-link">
                Explore
              </NavLink>
            </li>

            <div className="user-section">
              <span className="user-greeting">
                Hi, <strong>{user.username}</strong>
              </span>
              <NavLink to="/profile" className="nav-link">
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
              className="nav-link"
              style={{ alignSelf: "center" }}
            >
              Sign In
            </NavLink>
            <NavLink to="/sign-up" className="nav-link btn-signup-nav">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

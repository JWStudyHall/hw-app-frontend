import { useContext } from "react";
import { Link } from "react-router";
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
        <Link to="/" className="nav-logo">
          Health<span>Wealth</span>
        </Link>

        {user ? (
          <ul className="nav-list">
            <li>
              <Link to="/exercises" className="nav-link">
                Exercises
              </Link>
            </li>
            <li>
              <Link to="/workouts" className="nav-link">
                Workouts
              </Link>
            </li>
            <li>
              <Link to="/explore" className="nav-link">
                Explore
              </Link>
            </li>

            <div className="user-section">
              <span className="user-greeting">
                Hi, <strong>{user.username}</strong>
              </span>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <button onClick={handleSignOut} className="btn-signout">
                Sign Out
              </button>
            </div>
          </ul>
        ) : (
          <div className="auth-links">
            <Link to="/" className="nav-link" style={{ alignSelf: "center" }}>
              Home
            </Link>
            <Link
              to="/sign-in"
              className="nav-link"
              style={{ alignSelf: "center" }}
            >
              Sign In
            </Link>
            <Link to="/sign-up" className="nav-link btn-signup-nav">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

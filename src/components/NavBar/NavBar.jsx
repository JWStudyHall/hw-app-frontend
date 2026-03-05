import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      {user ? (
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <li style={{ fontWeight: "bold" }}>Hi, {user.username}</li>

          <li>
            <Link to="/exercises">Exercises</Link>
          </li>
          <li>
            <Link to="/templates">Templates</Link>
          </li>
          <li>
            <Link to="/plans">Plans</Link>
          </li>
          <li>
            <Link to="/calendar">Calendar</Link>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>

          <li style={{ marginLeft: "auto" }}>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <button onClick={handleSignOut} style={{ cursor: "pointer" }}>
              Sign Out
            </button>
          </li>
        </ul>
      ) : (
        <ul style={{ listStyle: "none", display: "flex", gap: "15px" }}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;

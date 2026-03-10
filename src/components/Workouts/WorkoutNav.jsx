import { NavLink, useLocation } from "react-router";
import "./WorkoutNav.css";

const WorkoutNav = () => {
  const location = useLocation();
  
  // Show tabs only on relevant pages
  const showTabs = location.pathname.startsWith("/plans") || 
                   location.pathname.startsWith("/templates") || 
                   location.pathname.startsWith("/workouts");
  
  if (!showTabs) return null;

  return (
    <div className="workout-nav-tabs">
      <NavLink 
        to="/plans?scope=user" 
        className={({ isActive }) => 
          `workout-tab ${isActive ? "active" : ""}`
        }
      >
        Plans
      </NavLink>
      <NavLink 
        to="/templates?scope=user" 
        className={({ isActive }) => 
          `workout-tab ${isActive ? "active" : ""}`
        }
      >
        Templates
      </NavLink>
      <NavLink 
        to="/workouts" 
        className={({ isActive }) => 
          `workout-tab ${isActive ? "active" : ""}`
        }
      >
        Calendar
      </NavLink>
    </div>
  );
};

export default WorkoutNav;
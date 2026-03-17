import { NavLink, useLocation } from "react-router";
import "./WorkoutNav.css";

const WorkoutNav = () => {
  const location = useLocation();
  
  // Show tabs only on relevant pages
  const showTabs = location.pathname.startsWith("/app/plans") || 
                   location.pathname.startsWith("/app/templates") || 
                   location.pathname.startsWith("/app/workouts");
  
  if (!showTabs) return null;

  return (
    <div className="workout-nav-tabs">
      <NavLink 
        to="/app/plans?scope=user" 
        className={({ isActive }) => 
          `workout-tab ${isActive ? "active" : ""}`
        }
      >
        Plans
      </NavLink>
      <NavLink 
        to="/app/templates?scope=user" 
        className={({ isActive }) => 
          `workout-tab ${isActive ? "active" : ""}`
        }
      >
        Templates
      </NavLink>
      <NavLink 
        to="/app/workouts" 
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
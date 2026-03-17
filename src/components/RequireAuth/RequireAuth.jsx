import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { useLocation } from "react-router";
import { Navigate } from "react-router";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner.jsx";

export default function RequireAuth({ children }) {
    const { user, loading } = useContext(UserContext);
    const location = useLocation();
    if (loading) {
      return <LoadingSpinner />;
    }
    if (!user) {
      const expired = sessionStorage.getItem("sessionExpired") === "true";
  
      if (expired) {
        console.log("RequireAuth → Navigate", {
            to: "/sign-in",
            state: {
                from: location,
                sessionExpiredMessage: 'Your session has expired. Please sign in again.',
            },
        });

        return (
          <Navigate
            to="/sign-in"
            replace
            state={{
              from: location,
              sessionExpiredMessage: 'Your session has expired. Please sign in again.',
            }}
          />
        );
      }
  
      // Not authenticated but no explicit expiry -> normal redirect with no message
      return <Navigate to="/sign-in" replace state={{ from: location}} />;
    }
  
    return children;
  }
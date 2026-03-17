import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getWorkouts } from "../../services/workoutService.js";
import Calendar from "../Calendar/Calendar.jsx";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner.jsx";
const MyWorkouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const data = await getWorkouts("user");
                setWorkouts(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts();
    }, []);

    if (loading) return <LoadingSpinner />;

  return (
    <div style={{  margin: "0 1rem", padding: "1rem" }}>
      <h1>My Workouts</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/app/workouts/new" className="btn-primary">+ New Workout</Link>
      </div>
      <Calendar />
    </div>
  )
}

export default MyWorkouts
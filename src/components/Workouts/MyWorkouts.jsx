import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getWorkouts } from "../../services/workoutService.js";
import Calendar from "../Calendar/Calendar.jsx";

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

    if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "100vw", margin: "0 1rem", padding: "1rem" }}>
      <h1>My Workouts</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/workouts/new">+ New Workout</Link>
        <Link to="/plans?scope=user">My Plans</Link>
        <Link to="/templates?scope=user">My Templates</Link>
        <Link to="/exercises?scope=user">My Exercises</Link>
      </div>
      <Calendar />
    </div>
  )
}

export default MyWorkouts
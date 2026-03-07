import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getWorkouts } from "../../services/workoutService.js";

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
    <div style={{ maxWidth: "50vw", margin: "0 1rem", padding: "1rem" }}>
      <h1>My Workouts</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/workouts/new">+ New Workout</Link>
        <Link to="/plans?scope=user">My Plans</Link>
        <Link to="/templates?scope=user">My Templates</Link>
        <Link to="/exercises?scope=user">My Exercises</Link>
      </div>
      <section>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div key={workout.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <h3>{workout.title}</h3>
              <p>Status: {workout.status}</p>
              <Link to={`/workouts/${workout.id}`}>View Details</Link>
            </div>
          ))
        ) : (
          <p>No workouts found.</p>
        )}
      </section>
    </div>
  )
}

export default MyWorkouts
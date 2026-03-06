import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getWorkouts } from "../../services/workoutService.js";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
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
    <main>
      <h1>Workouts</h1>
      <Link to="/workouts/new">+ New Workout</Link>
      <section>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div
              key={workout.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h3>{workout.title}</h3>
              <p>Status: {workout.status}</p>
              <Link to={`/workouts/${workout.id}`}>View Details</Link>
            </div>
          ))
        ) : (
          <p>No workouts found.</p>
        )}
      </section>
    </main>
  );
};

export default WorkoutList;

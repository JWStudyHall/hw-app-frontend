import { useState, useEffect } from "react";
import { useParams } from "react-router";

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(false);
      } catch (err) {
        console.error("Error fetching workout:", err);
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [workoutId]);

  if (loading) return <p>Loading workout...</p>;
  if (!workout) return <p>Workout not found.</p>;

  return (
    <main style={{ padding: "20px" }}>
      <header>
        <h1>{workout.name || "Daily Workout"}</h1>
        <p>Status: {workout.status || "In Progress"}</p>
      </header>

      <section>
        {workout.items?.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <h3>{item.exerciseName}</h3>
            <p>
              {item.sets} sets x {item.reps} reps
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => console.log("Mark Completed")}>
                Mark Completed
              </button>
              <button onClick={() => console.log("Edit sets/reps")}>
                Edit
              </button>
              <button onClick={() => console.log("Skip")}>Skip</button>
            </div>
          </div>
        ))}
      </section>

      <footer style={{ marginTop: "20px" }}>
        <button
          style={{ backgroundColor: "green", color: "white", padding: "10px" }}
        >
          Finish Workout
        </button>
      </footer>
    </main>
  );
};

export default WorkoutDetail;

import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { getWorkout } from "../../services/workoutService.js";
import { UserContext } from "../../contexts/UserContext.jsx";
import { deleteWorkout } from "../../services/workoutService.js";

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const fetchedWorkout = await getWorkout(workoutId);
        setWorkout(fetchedWorkout);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [workoutId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this workout? This cannot be undone.",
    );
    if (!confirmed) return;
    await deleteWorkout(workoutId);
    navigate("/workouts");
  };

  if (loading) return <p>Loading...</p>;
  if (!workout) return <p>Workout not found.</p>;

  // Your serializer uses 'items' as the key because of the 'source' mapping we fixed
  const workoutItems = workout.items || [];

  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ borderBottom: "2px solid #eee", marginBottom: "20px" }}>
        <h1>{workout.title || "Untitled Workout"}</h1>
        <p>
          <strong>Status:</strong> {workout.status}
        </p>
        <p>
          <strong>Date:</strong> {new Date(workout.start_dt).toLocaleString()}
        </p>
        {workout.notes && (
          <p>
            <strong>Notes:</strong> {workout.notes}
          </p>
        )}
      </header>

      <section>
        <h2>Exercises</h2>
        {workoutItems.length > 0 ? (
          <div style={{ display: "grid", gap: "15px" }}>
            {workoutItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0" }}>
                  {item.exercise_detail?.name || "Unknown Exercise"}
                </h3>
                <div style={{ display: "flex", gap: "20px", color: "#555" }}>
                  <span>
                    <strong>Sets:</strong> {item.sets || 0}
                  </span>
                  <span>
                    <strong>Reps:</strong> {item.reps || 0}
                  </span>
                  <span>
                    <strong>Weight:</strong> {item.weight || 0}{" "}
                    {item.weight_unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No exercises added to this workout yet.</p>
        )}
      </section>

      <footer style={{ marginTop: "30px" }}>
        {user?.id === workout.user && (
          <>
            <Link to={`/workouts/${workoutId}/edit`}>
              <button>Edit Workout</button>
            </Link>
            <button onClick={handleDelete}>Delete Workout</button>
          </>
        )}
        <Link to="/workouts">
          <button>Back to Workouts</button>
        </Link>
      </footer>
    </main>
  );
};

export default WorkoutDetail;

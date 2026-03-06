import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getWorkout } from "../../services/workoutService.js";

import { getWorkout } from "../../services/workoutService.js";

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  if (!workout) return <p>Workout not found.</p>;

  return (
    <main style={{ padding: "20px" }}>
      <h1>{workout.name}</h1>
      <p>Status: {workout.status}</p>
    </main>
  );
};

export default WorkoutDetail;

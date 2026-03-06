import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getExercises } from "../../services/exerciseService";

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      setError("");

      try {
        const exerciseData = await getExercises();
        setExercises(Array.isArray(exerciseData) ? exerciseData : []);
      } catch (err) {
        setError("Could not load exercise library.");
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  if (loading) return <h3>Loading exercise library...</h3>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div>
      <h2>Exercise Library</h2>
      {exercises.length === 0 ? (
        <p>No exercises yet.</p>
      ) : (
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExerciseLibrary;
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getExerciseById } from "../../services/exerciseService";

const ExerciseDetail = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      setError("");

      try {
        const exerciseData = await getExerciseById(exerciseId);
        setExercise(exerciseData);
      } catch (err) {
        setError("Could not load exercise details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  if (loading) return <h3>Loading exercise...</h3>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!exercise) return <p>Exercise not found.</p>;

  return (
    <div>
      <p>
        <Link to="/exercises">Back to Exercise Library</Link>
      </p>

      <h2>{exercise.name}</h2>
      <p>Type: {exercise.exercise_type || "N/A"}</p>
      <p>Equipment: {exercise.equipment || "N/A"}</p>
      <p>{exercise.instructions || "No instructions provided."}</p>
      {exercise.video_url ? (
        <iframe
          width="560"
          height="315"
          src={exercise.video_url}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>No video</p>
      )}
    </div>
  );
};

export default ExerciseDetail;

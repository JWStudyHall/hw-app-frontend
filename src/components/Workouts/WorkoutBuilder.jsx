import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { createWorkout, updateWorkout, getWorkout } from "../../services/workoutService.js";
import { getExercises } from "../../services/exerciseService.js";
import { UserContext } from "../../contexts/UserContext.jsx";
import WorkoutForm from "../shared/WorkoutForm/WorkoutForm.jsx";

/**
 * WorkoutForm wrapper component
 * Handles workout-specific logic and delegates to shared WorkoutForm component
 */
const WorkoutBuilder = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isEditMode = Boolean(workoutId);
  const [exercises, setExercises] = useState([]);

  // Fetch exercises on mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data || []);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      }
    };
    fetchExercises();
  }, []);

  const handleLoadWorkout = async (workoutId) => {
    return await getWorkout(workoutId);
  };

  const handleSubmit = async (workoutData, workoutId) => {
    const submitData = {
      ...workoutData,
      user: user?.id,
    };

    if (isEditMode) {
      await updateWorkout(workoutId, submitData);
    } else {
      await createWorkout(submitData);
    }

    navigate("/workouts");
  };

  const handleCancel = () => {
    navigate("/workouts");
  };

  return (
    <WorkoutForm
      mode="workout"
      entityId={workoutId}
      isEditMode={isEditMode}
      loadEntity={handleLoadWorkout}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      title={isEditMode ? "Edit Workout" : "Create New Workout"}
      submitLabel={isEditMode ? "Update Workout" : "Create Workout"}
      exercises={exercises}
    />
  );
};

export default WorkoutBuilder;

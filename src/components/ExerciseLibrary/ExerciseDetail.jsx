import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getExerciseById } from "../../services/exerciseService";

const ExerciseDetail = () => {
  const [exercise, setExercise] = useState(null);
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const fetchExercise = async () => {
    const fetchedExercise = await getExerciseById(exerciseId);
    setExercise(fetchedExercise);
  };

  useEffect(() => {
    fetchExercise();
  }, []);
  return (
    <>
    <h1>Hello World</h1>
    </>
  )
};

export default ExerciseDetail;

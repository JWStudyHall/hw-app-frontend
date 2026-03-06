import { useState, useEffect } from "react";
import { getWorkouts } from "../../services/workoutService";
import { Link } from "react-router";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const workoutList = await getWorkouts();
      setWorkouts(workoutList);
    } catch (e) {
      console.log("Error fetching workouts: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  if (loading) return <h3>Loading...</h3>;

  return (
    <div>
      {workouts && workouts.length > 0 ? (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <div>
                <h3>
                  <Link to={`/workouts/${workout.id}`}>{workout.title}</Link>
                </h3>
                <p>{workout.description}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h3>No workouts found</h3>
      )}
    </div>
  );
};

export default WorkoutList;

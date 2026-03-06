import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { createWorkout } from "../../services/workoutService.js";
import { getExercises } from "../../services/exerciseService.js";

const WorkoutForm = () => {
  const navigate = useNavigate();
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    start_dt: "",
    end_dt: "",
    status: "planned",
    notes: "",
    items: [
      {
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        weight_unit: "lb",
        order: 0,
      },
    ],
  });

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await getExercises();
      console.log("Exercises from Django:", data);
      setExerciseLibrary(data || []);
    };
    fetchExercises();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWorkout(formData);
      navigate("/workouts");
    } catch (err) {
      console.error("Error creating workout:", err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          exercise: "",
          sets: "",
          reps: "",
          weight: "",
          weight_unit: "lb",
          order: formData.items.length,
        },
      ],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const categories = ["strength", "cardio", "mobility", "stretch", "sport"];

  return (
    <main>
      <h2>New Workout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            required
            placeholder="Workout Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div>
          <label>Start</label>
          <input
            required
            type="datetime-local"
            onChange={(e) =>
              setFormData({ ...formData, start_dt: e.target.value })
            }
          />
        </div>
        <div>
          <label>End</label>
          <input
            required
            type="datetime-local"
            onChange={(e) =>
              setFormData({ ...formData, end_dt: e.target.value })
            }
          />
        </div>

        <h3>Exercises</h3>
        {formData.items.map((item, index) => (
          <div
            key={index}
            style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
          >
            <select
              required
              value={item.exercise}
              onChange={(e) =>
                handleItemChange(index, "exercise", e.target.value)
              }
            >
              <option value="">-- Choose an Exercise --</option>

              {/* SECTION 1: Organized by Category */}
              {categories.map((cat) => {
                const exercisesInCat = exerciseLibrary.filter(
                  (ex) => ex.exercise_type?.toLowerCase() === cat.toLowerCase(),
                );

                if (exercisesInCat.length === 0) return null;

                return (
                  <optgroup key={cat} label={cat.toUpperCase()}>
                    {exercisesInCat.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}

              {/* SECTION 2: The Safety Net (Always shows everything if Section 1 fails) */}
              {exerciseLibrary.length > 0 && (
                <optgroup label="--- ALL EXERCISES ---">
                  {exerciseLibrary.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.exercise_type || "no type"})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>

            <input
              type="number"
              placeholder="Sets"
              value={item.sets}
              onChange={(e) => handleItemChange(index, "sets", e.target.value)}
            />
            <input
              type="number"
              placeholder="Reps"
              value={item.reps}
              onChange={(e) => handleItemChange(index, "reps", e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight"
              value={item.weight}
              onChange={(e) =>
                handleItemChange(index, "weight", e.target.value)
              }
            />

            {formData.items.length > 1 && (
              <button type="button" onClick={() => removeItem(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem}>
          + Add Exercise
        </button>
        <button type="submit">Save Workout</button>
      </form>
    </main>
  );
};

export default WorkoutForm;

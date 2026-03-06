import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getTemplateItem,
  updateTemplateItem,
  deleteTemplateItem,
} from "../../services/templateService.js";
import { getExercises } from "../../services/exerciseService.js";

const ExerciseSection = ({ exercises, itemId, onDelete, onMove }) => {
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await getTemplateItem(itemId);
      console.log(response);
      setItem(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [itemId]);

  const handleExerciseChange = (newExerciseId) => {
    const newExercise = exercises.find(
      (ex) => ex.id === parseInt(newExerciseId),
    );
    if (!newExercise) return;

    // Update local state immediately
    setItem({
      ...item,
      exercise_id: newExercise.id,
      exercise: newExercise,
      name: newExercise.name,
    });
  };

  const handleSave = async (updatedData) => {
    try {
      await updateTemplateItem(itemId, updatedData);
      await fetchData(); // Refetch to get latest from backend
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTemplateItem(itemId);
      onDelete();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">Loading...</div>
    );
  }

  if (!item) {
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        Item not found
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-lg">{item.name}</h4>
              {item.exercise?.description && (
                <p className="text-sm text-gray-600">
                  {item.exercise.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Sets: {item.sets}</div>
            <div>Reps: {item.reps}</div>
            <div>
              Weight: {item.weight} {item.weight_units}
            </div>
            <div>Rest: {item.rest_seconds}s</div>
            {item.distance && (
              <div className="col-span-2">
                Distance: {item.distance} {item.distance_units}
              </div>
            )}
          </div>
        </>
      ) : (
        <ExerciseSectionForm
          initialData={item}
          exercises={exercises}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          onExerciseChange={handleExerciseChange}
        />
      )}
    </div>
  );
};

const ExerciseSectionForm = ({
  initialData,
  exercises,
  onSave,
  onCancel,
  onExerciseChange,
}) => {
  const [formData, setFormData] = useState({
    exercise_id: initialData.exercise_id || initialData.exercise?.id || "",
    sets: initialData.sets || 3,
    reps: initialData.reps || 10,
    weight: initialData.weight || 0,
    weight_units: initialData.weight_units || "kg",
    distance: initialData.distance || "",
    distance_units: initialData.distance_units || "km",
    rest_seconds: initialData.rest_seconds || 60,
  });

  const handleExerciseChange = (e) => {
    const newExerciseId = e.target.value;
    setFormData({ ...formData, exercise_id: newExerciseId });
    onExerciseChange(newExerciseId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      distance: formData.distance ? Number(formData.distance) : undefined,
    };
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Exercise</label>
        <select
          value={formData.exercise_id}
          onChange={handleExerciseChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select exercise...</option>
          {exercises?.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sets</label>
          <input
            type="number"
            value={formData.sets}
            onChange={(e) =>
              setFormData({ ...formData, sets: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reps</label>
          <input
            type="number"
            value={formData.reps}
            onChange={(e) =>
              setFormData({ ...formData, reps: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight</label>
          <input
            type="number"
            step="0.5"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight Unit</label>
          <select
            value={formData.weight_units}
            onChange={(e) =>
              setFormData({ ...formData, weight_units: e.target.value })
            }
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Distance (optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.distance}
            onChange={(e) =>
              setFormData({ ...formData, distance: e.target.value })
            }
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Distance Unit
          </label>
          <select
            value={formData.distance_units}
            onChange={(e) =>
              setFormData({ ...formData, distance_units: e.target.value })
            }
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="km">km</option>
            <option value="miles">miles</option>
            <option value="m">m</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Rest (seconds)</label>
        <input
          type="number"
          value={formData.rest_seconds}
          onChange={(e) =>
            setFormData({ ...formData, rest_seconds: Number(e.target.value) })
          }
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ExerciseSection;

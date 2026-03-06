import { useState, useEffect } from "react";
import ExerciseSection from "./ExerciseSection";
import "./style.css";
import { useParams } from "react-router";
import {
  getTemplate,
  updateTemplateItem,
} from "../../services/templateService";
import { getExercises } from "../../services/exerciseService";

export default function WorkoutTemplate({ onUpdateTemplate }) {
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const [exercises, setExercises] = useState([]);

  const { templateId } = useParams();

  const fetchData = async () => {
    try {
      const fetchedTemplate = await getTemplate(templateId);
      setTemplate(fetchedTemplate);
      const fetchedExercises = await getExercises(templateId);
      setExercises(fetchedExercises);
    } catch (error) {
      console.error("Failed to fetch template:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [templateId]);

  const handleMoveItem = async (itemIndex, direction) => {
    const items = [...template.items];
    const newIndex = itemIndex + direction;

    if (newIndex < 0 || newIndex >= items.length) return;

    [items[itemIndex], items[newIndex]] = [items[newIndex], items[itemIndex]];

    try {
      await updateTemplateItem(items[itemIndex].id, {
        ...items[itemIndex],
        order: itemIndex,
      });
      await updateTemplateItem(items[newIndex].id, {
        ...items[newIndex],
        order: newIndex,
      });

      const updatedTemplate = { ...template, items };
      setTemplate(updatedTemplate);

      if (onUpdateTemplate) {
        onUpdateTemplate(updatedTemplate);
      }
    } catch (error) {
      console.error("Failed to move item:", error);
    }
  };

  const handleDeleteItem = (itemIndex) => {
    // Remove from local state after successful delete
    const items = template.items.filter((_, i) => i !== itemIndex);
    const updatedTemplate = { ...template, items };
    setTemplate(updatedTemplate);

    if (onUpdateTemplate) {
      onUpdateTemplate(updatedTemplate);
    }
  };

  if (loading) {
    return <div className="workout-template">Loading...</div>;
  }

  if (!template) {
    return <div className="workout-template">Template not found</div>;
  }

  return (
    <div className="workout-template">
      <h1>{template.name}</h1>

      {template.items?.map((item, itemIndex) => (
        <div key={item.id} className="exercise-item">
          <div className="exercise-controls">
            <button
              onClick={() => handleMoveItem(itemIndex, -1)}
              disabled={itemIndex === 0}
              type="button"
            >
              ↑
            </button>
            <button
              onClick={() => handleMoveItem(itemIndex, 1)}
              disabled={itemIndex === template.items.length - 1}
              type="button"
            >
              ↓
            </button>
          </div>

          <ExerciseSection
            itemId={item.id}
            onDelete={() => handleDeleteItem(itemIndex)}
            onMove={(direction) => handleMoveItem(itemIndex, direction)}
          />
        </div>
      ))}
    </div>
  );
}

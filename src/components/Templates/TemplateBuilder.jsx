import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import {
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplateItem,
} from "../../services/templateService";
import { getExercises } from "../../services/exerciseService";
import { UserContext } from "../../contexts/UserContext";

const INITIAL_ITEM = {
  exercise: "",
  sets: "",
  reps: "",
  weight: "",
  weight_unit: "lb",
  distance: "",
  distance_unit: "km",
  duration: "",
  notes: "",
};

const TemplateBuilder = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isEditMode = Boolean(templateId);

  const [template, setTemplate] = useState({
    title: "",
    description: "",
    duration: "",
  });
  const [items, setItems] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch exercises on mount
  useEffect(() => {
    getExercises()
      .then(setExercises)
      .catch((err) => console.error("Error fetching exercises:", err));
  }, []);

  // Fetch template in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    setLoading(true);
    getTemplate(templateId)
      .then((data) => {
        setTemplate({
          title: data.title || "",
          description: data.description || "",
          duration: data.duration || "",
        });
        setItems(
          (data.items || []).map((item, index) => ({
            ...item,
            exercise:
              typeof item.exercise === "object"
                ? item.exercise.id
                : item.exercise,
            sets: item.sets ?? "",
            reps: item.reps ?? "",
            weight: item.weight ?? "",
            weight_unit: item.weight_unit || "lb",
            distance: item.distance ?? "",
            distance_unit: item.distance_unit || "km",
            duration: item.duration ?? "",
            notes: item.notes || "",
            order: item.order ?? index,
          })),
        );
      })
      .catch((err) => setError("Error loading template"))
      .finally(() => setLoading(false));
  }, [templateId, isEditMode]);

  const handleTemplateChange = (e) => {
    setTemplate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddItem = () =>
    setItems((prev) => [...prev, { ...INITIAL_ITEM }]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleRemoveItem = async (index) => {
    const item = items[index];
    if (item.id) {
      try {
        await deleteTemplateItem(item.id);
      } catch (err) {
        console.error("Error deleting item:", err);
        return;
      }
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const parseWeight = (weightValue) => {
    if (weightValue === "" || weightValue === null || weightValue === undefined) {
      return null;
    }
    const num = parseFloat(weightValue);
    return isNaN(num) ? null : num;
  };

  const parseNumericField = (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }
    const num = parseInt(String(value).trim(), 10);
    return isNaN(num) ? null : num;
  };

  // Helper to prepare item data for API
  const prepareItemData = (item, index) => ({
    id: item.id,
    exercise: item.exercise,
    sets: parseNumericField(item.sets),
    reps: parseNumericField(item.reps),
    weight: parseWeight(item.weight),
    weight_unit: item.weight_unit || "lb",
    distance: parseNumericField(item.distance),
    distance_unit: item.distance_unit || "km",
    duration: parseNumericField(item.duration),
    notes: item.notes || "",
    order: item.order ?? index,
  });

  const handleMoveItem = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    let currentItems;
    setItems((prev) => {
      currentItems = [...prev];
      // Swap items
      [currentItems[index], currentItems[newIndex]] = [
        currentItems[newIndex],
        currentItems[index],
      ];
      // Update order fields
      currentItems[index].order = index;
      currentItems[newIndex].order = newIndex;
      return currentItems;
    });

    // Only update backend if both items are saved (have IDs)
    const item1 = currentItems[newIndex];
    const item2 = currentItems[index];
    if (item1.id && item2.id && isEditMode) {
      try {
        const updatedItems = currentItems.map((item, idx) =>
          prepareItemData(item, idx)
        );

        await updateTemplate(templateId, {
          ...template,
          user: user?.id || user?.user_id,
          items: updatedItems,
        });
      } catch (err) {
        console.error("Error updating item order:", err);
        setError("Failed to update exercise order. Please try again.");
        // Revert on error
        setItems((prev) => {
          const updated = [...prev];
          [updated[index], updated[newIndex]] = [
            updated[newIndex],
            updated[index],
          ];
          return updated;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const itemsData = items.map((item, index) => prepareItemData(item, index));

      const templateData = {
        ...template,
        user: user?.id || user?.user_id,
        items: itemsData,
      };

      const savedTemplate = isEditMode
        ? await updateTemplate(templateId, templateData)
        : await createTemplate(templateData);

      navigate(`/templates/${savedTemplate.id}`);
    } catch (err) {
      setError("Error saving template. Please try again.");
      console.error("Error saving template:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 1rem" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>
        {isEditMode ? "Edit Template" : "Create New Template"}
      </h1>

      {error && (
        <div
          style={{
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            color: "#c33",
            padding: "12px 16px",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <TemplateInfoSection
          template={template}
          onChange={handleTemplateChange}
        />

        <ExercisesSection
          items={items}
          exercises={exercises}
          onItemChange={handleItemChange}
          onRemove={handleRemoveItem}
          onMove={handleMoveItem}
          onAdd={handleAddItem}
        />

        <ActionButtons
          loading={loading}
          isEditMode={isEditMode}
          onCancel={() => navigate("/templates")}
        />
      </form>
    </div>
  );
};

const TemplateInfoSection = ({ template, onChange }) => (
  <section
    style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      border: "1px solid #ddd",
      padding: "24px",
      marginBottom: "24px",
    }}
  >
    <h2
      style={{
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "16px",
        paddingBottom: "8px",
        borderBottom: "2px solid #eee",
      }}
    >
      Template Information
    </h2>
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <InputField
        label="Template Name"
        name="title"
        value={template.title}
        onChange={onChange}
        required
      />
      <TextAreaField
        label="Description"
        name="description"
        value={template.description}
        onChange={onChange}
      />
      <InputField
        label="Duration (minutes)"
        name="duration"
        type="number"
        value={template.duration}
        onChange={onChange}
        required
        min="1"
      />
    </div>
  </section>
);

const ExercisesSection = ({
  items,
  exercises,
  onItemChange,
  onRemove,
  onMove,
  onAdd,
}) => (
  <section style={{ marginBottom: "24px" }}>
    <h2
      style={{
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "16px",
        paddingBottom: "8px",
        borderBottom: "2px solid #eee",
      }}
    >
      Exercises
    </h2>
    {items.map((item, index) => (
      <ExerciseCard
        key={item.id || `new-item-${index}`}
        item={item}
        index={index}
        exercises={exercises}
        onChange={onItemChange}
        onRemove={onRemove}
        onMove={onMove}
        isFirst={index === 0}
        isLast={index === items.length - 1}
      />
    ))}
    <button
      type="button"
      onClick={onAdd}
      style={{
        width: "100%",
        padding: "12px",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        color: "#666",
        fontSize: "16px",
        fontWeight: "500",
        cursor: "pointer",
        marginTop: "8px",
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = "#2196F3";
        e.target.style.color = "#2196F3";
        e.target.style.backgroundColor = "#e3f2fd";
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = "#ccc";
        e.target.style.color = "#666";
        e.target.style.backgroundColor = "#fafafa";
      }}
    >
      + Add Exercise
    </button>
  </section>
);

const ExerciseCard = ({
  item,
  index,
  exercises,
  onChange,
  onRemove,
  onMove,
  isFirst,
  isLast,
}) => (
  <div
    style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      border: "1px solid #ddd",
      padding: "24px",
      marginBottom: "16px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>
        Exercise {index + 1}
      </h3>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          onClick={() => onMove(index, "up")}
          disabled={isFirst}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: isFirst ? "not-allowed" : "pointer",
            opacity: isFirst ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isFirst) {
              e.target.style.backgroundColor = "#e0e0e0";
            }
          }}
          onMouseLeave={(e) => {
            if (!isFirst) {
              e.target.style.backgroundColor = "#f5f5f5";
            }
          }}
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove(index, "down")}
          disabled={isLast}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: isLast ? "not-allowed" : "pointer",
            opacity: isLast ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLast) {
              e.target.style.backgroundColor = "#e0e0e0";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLast) {
              e.target.style.backgroundColor = "#f5f5f5";
            }
          }}
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#c33",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#fdd";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#fee";
          }}
          title="Remove exercise"
        >
          Remove
        </button>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <SelectField
        label="Exercise"
        value={item.exercise}
        onChange={(e) => onChange(index, "exercise", e.target.value)}
        options={exercises}
        required
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <InputField
          label="Sets"
          type="number"
          value={item.sets}
          onChange={(e) => onChange(index, "sets", e.target.value)}
          min="0"
        />
        <InputField
          label="Reps"
          type="number"
          value={item.reps}
          onChange={(e) => onChange(index, "reps", e.target.value)}
          min="0"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
        <InputField
          label="Weight"
          type="number"
          value={item.weight}
          onChange={(e) => onChange(index, "weight", e.target.value)}
          min="0"
          step="any"
        />
        <SelectField
          label="Unit"
          value={item.weight_unit}
          onChange={(e) => onChange(index, "weight_unit", e.target.value)}
          options={[
            { id: "lb", name: "lb" },
            { id: "kg", name: "kg" },
          ]}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
        <InputField
          label="Distance"
          type="number"
          value={item.distance}
          onChange={(e) => onChange(index, "distance", e.target.value)}
          min="0"
        />
        <SelectField
          label="Unit"
          value={item.distance_unit}
          onChange={(e) => onChange(index, "distance_unit", e.target.value)}
          options={[
            { id: "km", name: "km" },
            { id: "mi", name: "mi" },
          ]}
        />

      </div>
      <InputField
          label="Duration (seconds)"
          type="number"
          value={item.duration}
          onChange={(e) => onChange(index, "duration", e.target.value)}
          min="0"
        />
      <TextAreaField
        label="Notes"
        value={item.notes}
        onChange={(e) => onChange(index, "notes", e.target.value)}
        rows="2"
      />
    </div>
  </div>
);

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  min,
  step,
}) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      htmlFor={name}
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "4px",
      }}
    >
      {label}
      {required && <span style={{ color: "#c33", marginLeft: "4px" }}>*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        fontFamily: "inherit",
      }}
      onFocus={(e) => {
        e.target.style.outline = "none";
        e.target.style.borderColor = "#2196F3";
        e.target.style.boxShadow = "0 0 0 2px rgba(33, 150, 243, 0.2)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#ddd";
        e.target.style.boxShadow = "none";
      }}
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, rows = 3 }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      htmlFor={name}
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "4px",
      }}
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        fontFamily: "inherit",
        resize: "vertical",
      }}
      onFocus={(e) => {
        e.target.style.outline = "none";
        e.target.style.borderColor = "#2196F3";
        e.target.style.boxShadow = "0 0 0 2px rgba(33, 150, 243, 0.2)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#ddd";
        e.target.style.boxShadow = "none";
      }}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, required }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "4px",
      }}
    >
      {label}
      {required && <span style={{ color: "#c33", marginLeft: "4px" }}>*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        fontFamily: "inherit",
        backgroundColor: "#fff",
      }}
      onFocus={(e) => {
        e.target.style.outline = "none";
        e.target.style.borderColor = "#2196F3";
        e.target.style.boxShadow = "0 0 0 2px rgba(33, 150, 243, 0.2)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#ddd";
        e.target.style.boxShadow = "none";
      }}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const ActionButtons = ({ loading, isEditMode, onCancel }) => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      justifyContent: "flex-end",
      paddingTop: "16px",
      borderTop: "1px solid #eee",
      marginTop: "24px",
    }}
  >
    <button
      type="button"
      onClick={onCancel}
      style={{
        padding: "10px 20px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        backgroundColor: "#fff",
        color: "#333",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#f5f5f5";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#fff";
      }}
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={loading}
      style={{
        padding: "10px 20px",
        backgroundColor: loading ? "#ccc" : "#2196F3",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.target.style.backgroundColor = "#1976D2";
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.target.style.backgroundColor = "#2196F3";
        }
      }}
    >
      {loading
        ? "Saving..."
        : isEditMode
          ? "Update Template"
          : "Create Template"}
    </button>
  </div>
);

export default TemplateBuilder;
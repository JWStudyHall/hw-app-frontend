import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { getTemplate, createTemplate, updateTemplate } from "../../services/templateService";
import { getExercises } from "../../services/exerciseService";
import { UserContext } from "../../contexts/UserContext";
import WorkoutForm from "../shared/WorkoutForm/WorkoutForm.jsx";

/**
 * TemplateBuilder wrapper component
 * Handles template-specific logic and delegates to shared WorkoutForm component
 */
const TemplateBuilder = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isEditMode = Boolean(templateId);
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

  const handleLoadTemplate = async (templateId) => {
    return await getTemplate(templateId);
  };

  const handleSubmit = async (templateData, templateId) => {
    const submitData = {
      ...templateData,
      user: user?.id || user?.user_id,
    };

    const savedTemplate = isEditMode
      ? await updateTemplate(templateId, submitData)
      : await createTemplate(submitData);

    navigate(`/templates/${savedTemplate.id}`);
  };

  const handleCancel = () => {
    navigate("/templates");
  };

  return (
    <WorkoutForm
      mode="template"
      entityId={templateId}
      isEditMode={isEditMode}
      loadEntity={handleLoadTemplate}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      title={isEditMode ? "Edit Template" : "Create New Template"}
      submitLabel={isEditMode ? "Update Template" : "Create Template"}
      exercises={exercises}
    />
  );
};

export default TemplateBuilder;
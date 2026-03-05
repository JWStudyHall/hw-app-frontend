import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getTemplate } from "../../services/templateService.js";

const TemplateDetail = () => {
  const [template, setTemplate] = useState(null);
  const { templateId } = useParams();

  const fetchTemplate = async () => {
    const fetchedTemplate = await getTemplate(templateId);
    setTemplate(fetchedTemplate);
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  if (!template) return <h3>Loading...</h3>;
  return (
    <div>
      <h3>{template.title}</h3>
      <p>{template.description}</p>
      <ol>
        {template.items.map((item) => (
          <li>
            {item.exercise_detail.name}:{" "}
            {item.sets && item.reps ? `${item.sets} x ${item.reps}` : ""}
            {item.weight && item.weight_unit
              ? `${item.weight} @ ${item.weight_unit}`
              : ""}
            {item.distance_meters && item.duration_seconds
              ? `${item.distance_meters}m @ ${item.duration_seconds}s`
              : ""}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TemplateDetail;

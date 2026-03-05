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

  function createExerciseBlurb(item) {
    let ret = "";
    if (item.sets && item.sets > 0) {
      ret += item.sets;
      if (item.reps && item.reps > 0) {
        ret += " x " + item.reps;
      }
      if (item.weight && item.weight_unit) {
        ret += " @ " + item.weight + " " + item.weight_unit;
      }
    }

    if (item.distance_meters) {
      ret += item.distance_meters + "m";
    }

    if (item.duration_seconds) {
      ret += " (" + item.duration_seconds + "s)";
    }

    return ret;
  }

  if (!template) return <h3>Loading...</h3>;
  return (
    <div>
      <h3>{template.title}</h3>
      <p>{template.description}</p>
      <ol>
        {template.items.map((item) => (
          <li>
            <h4>{item.exercise_detail.name}: </h4>
            <p>{createExerciseBlurb(item)}</p>
            {item.notes && <p>Notes: {item.notes}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TemplateDetail;

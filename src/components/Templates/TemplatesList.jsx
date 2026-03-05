import { useState, useEffect } from "react";
import { getTemplates } from "../../services/templateService";
import { Link } from "react-router";

const TemplatesList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchTemplates = async () => {
    const templateList = await getTemplates();
    setTemplates(templateList);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div>
      {templates && templates.length > 0 ? (
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <div>
                <h3>
                  <Link to={`/templates/${template.id}`}>{template.title}</Link>
                </h3>
                <p>{template.description}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
};

export default TemplatesList;

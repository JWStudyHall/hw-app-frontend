import { useState, useEffect } from "react";
import { getTemplates } from "../../services/templateService";
import { Link } from "react-router";

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const templateList = await getTemplates();
      setTemplates(templateList);
    } catch (e) {
      console.log("Error fetching templates: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  if (loading) return <h3>Loading...</h3>;

  return (
    <div>
      <Link to="/templates/new">Create Template</Link>
      {templates && templates.length > 0 ? (
        <>
          <ul>
            {templates.map((template) => (
              <li key={template.id}>
                <div>
                  <h3>
                    <Link to={`/templates/${template.id}`}>
                      {template.title}
                    </Link>
                  </h3>
                  <p>{template.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <h3>No templates found</h3>
      )}
    </div>
  );
};

export default TemplateList;

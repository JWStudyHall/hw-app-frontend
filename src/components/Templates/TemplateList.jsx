import { useState, useEffect } from "react";
import { getTemplates } from "../../services/templateService";
import { Link } from "react-router";
import "./TemplateList.css";
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
    <div className="template-list">
      {/* Header row */}
      <div className="template-list__header">
        <h2 className="template-list__title">Templates</h2>
        <Link to="/templates/new" className="template-list__create-btn">
          + Create Template
        </Link>
      </div>

      {templates && templates.length > 0 ? (
        <div className="template-list__grid">
          {templates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-card__body">
                <h3 className="template-card__title">
                  <Link
                    to={`/templates/${template.id}`}
                    className="template-card__link"
                  >
                    {template.title}
                  </Link>
                </h3>
                {template.description && (
                  <p className="template-card__description">
                    {template.description}
                  </p>
                )}
              </div>
              <div className="template-card__footer">
                <Link
                  to={`/templates/${template.id}`}
                  className="template-card__action"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="template-list__empty">
          <h3>No templates found</h3>
          <p>You haven’t created any templates yet.</p>
          <Link to="/templates/new" className="template-list__create-btn">
            Create your first template
          </Link>
        </div>
      )}
    </div>
  );
};

export default TemplateList;
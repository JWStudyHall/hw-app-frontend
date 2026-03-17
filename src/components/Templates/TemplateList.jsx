import CardList from "../shared/CardList/CardList.jsx";
import { useState, useEffect, useContext  } from "react";
import { useSearchParams } from "react-router";
import { getTemplates, deleteTemplate } from "../../services/templateService.js";
import { UserContext } from "../../contexts/UserContext.jsx";

const TemplateList = () => {
  const { user } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const scope = searchParams.get("scope") || "user";

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const templateList = await getTemplates(scope);
        setTemplates(templateList);
      } catch (e) {
        console.log("Error fetching templates: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [scope]);

  const handleAction = async (action, item) => {
    if (action === "delete") {
      const confirmed = window.confirm(
        "Delete this template? This cannot be undone."
      );
      if (!confirmed) return;
      try {
        await deleteTemplate(item.id);
        setTemplates(templates.filter(t => t.id !== item.id));
      } catch (err) {
        console.error("Failed to delete template:", err);
      }
    }
  };

  return (
    <CardList
      items={templates}
      itemType="template"
      cardFields={{
        title: { render: (item) => item.title },
        description: { 
          render: (item) => item.description,
          optional: true 
        }
      }}
      actions={{
        view: {
          label: "View details",
          path: (item) => `/app/templates/${item.id}`,
          alwaysVisible: true
        },
        edit: {
          label: "Edit",
          path: (item) => `/app/templates/${item.id}/edit`,
          requiresOwnership: true
        },
        delete: {
          label: "Delete",
          action: "delete",
          requiresOwnership: true,
          requiresConfirmation: true
        }
      }}
      onAction={handleAction}
      createPath="/app/templates/new"
      createLabel="+ Create Template"
      onScopeChange={(newScope) => setSearchParams({ scope: newScope })}
      scope={scope}
      title="Templates"
      loading={loading}
      user={user}
      layout="grid"
      emptyState={{
        title: "No templates found",
        message: "You haven't created any templates yet.",
        action: { label: "Create your first template", path: "/app/templates/new" }
      }}
    />
  );
};

export default TemplateList;
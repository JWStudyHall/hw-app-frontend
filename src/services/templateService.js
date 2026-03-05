import api from "./apiConfig.js";

export const getTemplates = async () => {
  const resp = await api.get("/workout-templates/");
  return resp.data;
};

export const getTemplate = async (templateId) => {
  const resp = await api.get(`/workout-templates/${templateId}/`);
  return resp.data;
};

export const createTemplate = async (templateData) => {
  const resp = await api.post("/workout-templates/", templateData);
  return resp.data;
};

export const updateTemplate = async (templateId, templateData) => {
  const resp = await api.patch(
    `/workout-templates/${templateId}/`,
    templateData,
  );
  return resp.data;
};

export const deleteTemplate = async (templateId) => {
  const resp = await api.delete(`/workout-templates/${templateId}/`);
  return resp.data;
};

export const addTemplateItem = async (itemData) => {
  const resp = await api.post("/workout-template-items/", itemData);
  return resp.data;
};

export const updateTemplateItem = async (itemId, itemData) => {
  const resp = await api.patch(`/workout-template-items/${itemId}/`, itemData);
};

export const deleteTemplateItem = async (itemId) => {
  const resp = await api.delete(`/workout-template-items/${itemId}/`);
  return resp.data;
};

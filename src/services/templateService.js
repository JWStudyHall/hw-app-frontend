import api from "./apiConfig.js";

export const getTemplates = async () => {
  try {
    const resp = await api.get("api/workout-templates/");
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getTemplate = async (templateId) => {
  try {
    const resp = await api.get(`api/workout-templates/${templateId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createTemplate = async (templateData) => {
  try {
    const resp = await api.post("api/workout-templates/", templateData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateTemplate = async (templateId, templateData) => {
  try {
    const resp = await api.patch(
      `api/workout-templates/${templateId}/`,
      templateData,
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const resp = await api.delete(`/workout-templates/${templateId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const addTemplateItem = async (itemData) => {
  try {
    const resp = await api.post("/workout-template-items/", itemData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateTemplateItem = async (itemId, itemData) => {
  try {
    const resp = await api.patch(
      `/workout-template-items/${itemId}/`,
      itemData,
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTemplateItem = async (itemId) => {
  try {
    const resp = await api.delete(`/workout-template-items/${itemId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

import api from "./apiConfig.js";

export const getPlans = async () => {
  const resp = await api.get("/workout=plans/");
  return resp.data;
};

export const getPlan = async (planId) => {
  const resp = await api.get(`/workout-plans/${planId}/`);
  return resp.data;
};

export const createPlan = async (planData) => {
  const resp = await api.post("/workout-plans/", planData);
  return resp.data;
};

export const updatePlan = async (planId, planData) => {
  const resp = await api.patch(`/workout-plans/${planId}/`, planData);
  return resp.data;
};

export const deletePlan = async (planId) => {
  const resp = await api.delete(`/workout-plans/${planId}`);
  return resp.data;
};

export const addTemplateToPlan = async (linkData) => {
  const resp = await api.post("/workout-template-plans/", linkData);
  return resp.data;
};

export const updatePlanTemplateLink = async (linkId, linkData) => {
  const resp = await api.patch(`/workout-template-plans/${linkId}/`, linkData);
  return resp.date;
};

export const removeTemplateFromPlan = async (linkId) => {
  const resp = await api.delete(`/workout-template-plans/${linkId}/`);
  return resp.data;
};

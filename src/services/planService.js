import api from "./apiConfig.js";

export const getPlans = async () => {
  try {
    const resp = await api.get("/workout=plans/");
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getPlan = async (planId) => {
  try {
    const resp = await api.get(`/workout-plans/${planId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createPlan = async (planData) => {
  try {
    const resp = await api.post("/workout-plans/", planData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlan = async (planId, planData) => {
  try {
    const resp = await api.patch(`/workout-plans/${planId}/`, planData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deletePlan = async (planId) => {
  try {
    const resp = await api.delete(`/workout-plans/${planId}`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const addTemplateToPlan = async (linkData) => {
  try {
    const resp = await api.post("/workout-template-plans/", linkData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlanTemplateLink = async (linkId, linkData) => {
  try {
    const resp = await api.patch(`/workout-template-plans/${linkId}/`,linkData);
    return resp.date;
  } catch (error) {
    throw error;
  }
};

export const removeTemplateFromPlan = async (linkId) => {
  try {
    const resp = await api.delete(`/workout-template-plans/${linkId}/`);
    return resp.data;
  } catch (error) {
    throw error;
    
  }
};

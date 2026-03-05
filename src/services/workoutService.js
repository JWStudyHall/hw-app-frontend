import api from "./apiConfig.js";

export const getMuscleGroups = async () => {
  const resp = await api.get("/muscle-groups/");
  return resp.data;
};

export const getExercises = async () => {
  const resp = await api.get("/exercises/");
  return resp.data;
};

export const getExerciseById = async (exerciseId) => {
  const resp = await api.get(`/exercises/${exerciseId}/`);
  return resp.data;
};

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

// WORKOUT PLANS

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

// template Links

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

export const getWorkouts = async (start, end) => {
  const resp = await api.get("/workouts/", {
    params: {
      start,
      end,
    },
  });
  return resp.data;
};


export const getWorkout = async (workoutId) ={
    
}
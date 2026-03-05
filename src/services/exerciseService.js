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

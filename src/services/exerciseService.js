import api from "./apiConfig.js";

export const getMuscleGroups = async () => {
  try {
    const resp = await api.get("/muscle-groups/");
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getExercises = async () => {
  try {
    const resp = await api.get("/exercises/");
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getExerciseById = async (exerciseId) => {
  try {
    const resp = await api.get(`/exercises/${exerciseId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

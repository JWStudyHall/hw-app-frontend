import api from "./apiConfig.js";

export const getWorkouts = async (start, end) => {
  try {
    const resp = await api.get("/workouts/", {
    params: {
      start,
      end,
    },
  });
  return resp.data;
  } catch (error) {
    throw error;
    
  }
};

export const getWorkout = async (workoutId) => {
  try {
    const resp = await api.get(`/workouts/${workoutId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createWorkout = async (workoutData) => {
  try {
    const resp = await api.post("/workouts/", workoutData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateWorkout = async (workoutId, workoutData) => {
  try {
    const resp = await api.patch(`/workouts/${workoutId}/`, workoutData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const resp = await api.delete(`/workouts/${workoutId}/`);
     return resp.data;
  } catch (error) {
    throw error;
    
  }
};

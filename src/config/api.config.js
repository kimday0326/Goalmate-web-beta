export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// export const API_BASE_URL = "http://localhost:8080"; // Do not change this

export const API_ENDPOINTS = {
  LOGIN: {
    ADMIN: "/auth/login/admin",
    MENTOR: "/auth/login/mentor",
  },
  GOALS: "/goals",
};

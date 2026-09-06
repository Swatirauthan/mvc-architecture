/**
 * API client
 * ----------
 * Every page talks to the backend through this file.
 * That keeps the React → HTTP step easy to explain:
 *
 *   Component → apiRequest() → fetch() → Express
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export async function apiRequest(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export const api = {
  getUsers: () => apiRequest("/api/users"),
  getUser: (id) => apiRequest(`/api/users/${id}`),
  createUser: (body) =>
    apiRequest("/api/users", { method: "POST", body: JSON.stringify(body) }),
  updateUser: (id, body) =>
    apiRequest(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteUser: (id) => apiRequest(`/api/users/${id}`, { method: "DELETE" }),

  getCourses: () => apiRequest("/api/courses"),
  getCourse: (id) => apiRequest(`/api/courses/${id}`),
  createCourse: (body) =>
    apiRequest("/api/courses", { method: "POST", body: JSON.stringify(body) }),
  updateCourse: (id, body) =>
    apiRequest(`/api/courses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCourse: (id) => apiRequest(`/api/courses/${id}`, { method: "DELETE" }),

  register: (body) =>
    apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => apiRequest("/api/auth/me"),
};

/**
 * api.js
 * Central axios instance for the entire app.
 *
 * Every outgoing request automatically gets the Bearer token attached via
 * the request interceptor — this is the "Attach token to API calls"
 * requirement from the assignment.
 *
 * To point at a real backend: change BASE_URL to your API root.
 * Nothing else in the codebase needs to change.
 */

import axios from "axios";
import { authService } from "../services/auth.service";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach token to every call ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: normalise errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default api;

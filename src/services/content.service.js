/**
 * content.service.js
 * All content CRUD operations go through here.
 *
 * To connect a real backend, replace getStore/saveStore calls with axios:
 *   import axios from "axios";
 *   import { authService } from "./auth.service";
 *
 *   // Attach token to every request:
 *   axios.interceptors.request.use((config) => {
 *     const token = authService.getToken();
 *     if (token) config.headers.Authorization = `Bearer ${token}`;
 *     return config;
 *   });
 */

import { getStore, saveStore } from "../utils/mockData";

export const contentService = {
  // Simulates GET /api/content?teacherId=...
  getByTeacher: async (teacherId) => {
    await new Promise((r) => setTimeout(r, 600));
    const { content } = getStore();
    return content.filter((c) => c.teacherId === teacherId);
  },

  // Simulates GET /api/content
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 600));
    const { content } = getStore();
    return content;
  },

  // Simulates GET /api/content?status=...  (used for scalable status filtering)
  getByStatus: async (status) => {
    await new Promise((r) => setTimeout(r, 600));
    const { content } = getStore();
    if (!status || status === "all") return content;
    return content.filter((c) => c.status === status);
  },

  // Simulates GET /api/content/live/:teacherId
  getLiveByTeacher: async (teacherId) => {
    await new Promise((r) => setTimeout(r, 400));
    const { content } = getStore();
    const now = new Date();
    return content.filter((c) => {
      if (c.teacherId !== teacherId || c.status !== "approved") return false;
      return now >= new Date(c.startTime) && now <= new Date(c.endTime);
    });
  },

  // Simulates POST /api/content
  create: async (payload) => {
    await new Promise((r) => setTimeout(r, 1000));
    const store = getStore();
    const newItem = {
      ...payload,
      id: `c${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    store.content = [...(store.content || []), newItem];
    saveStore(store);
    return newItem;
  },
};

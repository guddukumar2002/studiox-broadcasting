/**
 * content.service.js
 * All content CRUD operations go through here.
 *
 * Current mode: mock (localStorage).
 * To connect a real backend: set NEXT_PUBLIC_API_URL in .env.local and
 * uncomment the axios blocks — nothing else in the app needs to change.
 * The axios instance in utils/api.js automatically attaches the Bearer token.
 */

import api from "../utils/api";
import { getStore, saveStore } from "../utils/mockData";

export const contentService = {
  // Simulates GET /api/content?teacherId=:id
  // Real: const { data } = await api.get("/content", { params: { teacherId } }); return data;
  getByTeacher: async (teacherId) => {
    await new Promise((r) => setTimeout(r, 150));
    const { content } = getStore();
    return content.filter((c) => c.teacherId === teacherId);
  },

  // Simulates GET /api/content
  // Real: const { data } = await api.get("/content"); return data;
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 150));
    const { content } = getStore();
    return content;
  },

  // Simulates GET /api/content?status=:status
  // Real: const { data } = await api.get("/content", { params: { status } }); return data;
  getByStatus: async (status) => {
    await new Promise((r) => setTimeout(r, 150));
    const { content } = getStore();
    if (!status || status === "all") return content;
    return content.filter((c) => c.status === status);
  },

  // Simulates GET /api/content/live/:teacherId
  // Real: const { data } = await api.get(`/content/live/${teacherId}`); return data;
  getLiveByTeacher: async (teacherId) => {
    await new Promise((r) => setTimeout(r, 150));
    const { content } = getStore();
    const now = new Date();
    return content.filter((c) => {
      if (c.teacherId !== teacherId || c.status !== "approved") return false;
      return now >= new Date(c.startTime) && now <= new Date(c.endTime);
    });
  },

  // Simulates POST /api/content
  // Real: const { data } = await api.post("/content", payload); return data;
  create: async (payload) => {
    await new Promise((r) => setTimeout(r, 400));
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

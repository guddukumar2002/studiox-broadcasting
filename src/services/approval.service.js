/**
 * approval.service.js
 * All approval/rejection operations go through here.
 *
 * To connect a real backend, replace mock logic with axios:
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

export const approvalService = {
  // Simulates GET /api/content?status=pending
  getPending: async () => {
    await new Promise((r) => setTimeout(r, 600));
    const { content } = getStore();
    return content.filter((c) => c.status === "pending");
  },

  // Simulates PATCH /api/content/:id/approve
  approve: async (id) => {
    await new Promise((r) => setTimeout(r, 500));
    const store = getStore();
    const index = store.content.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Content not found");
    store.content[index] = { ...store.content[index], status: "approved" };
    saveStore(store);
    return store.content[index];
  },

  // Simulates PATCH /api/content/:id/reject
  reject: async (id, reason) => {
    await new Promise((r) => setTimeout(r, 500));
    if (!reason?.trim()) throw new Error("Rejection reason is required");
    const store = getStore();
    const index = store.content.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Content not found");
    store.content[index] = { ...store.content[index], status: "rejected", rejectionReason: reason };
    saveStore(store);
    return store.content[index];
  },
};

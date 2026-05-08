/**
 * approval.service.js
 * All approval/rejection operations go through here.
 *
 * Current mode: mock (localStorage).
 * To connect a real backend: set NEXT_PUBLIC_API_URL in .env.local and
 * uncomment the axios blocks — nothing else in the app needs to change.
 * The axios instance in utils/api.js automatically attaches the Bearer token.
 */

import api from "../utils/api";
import { getStore, saveStore } from "../utils/mockData";

export const approvalService = {
  // Simulates GET /api/content?status=pending
  // Real: const { data } = await api.get("/content", { params: { status: "pending" } }); return data;
  getPending: async () => {
    await new Promise((r) => setTimeout(r, 150));
    const { content } = getStore();
    return content.filter((c) => c.status === "pending");
  },

  // Simulates PATCH /api/content/:id/approve
  // Real: const { data } = await api.patch(`/content/${id}/approve`); return data;
  approve: async (id) => {
    await new Promise((r) => setTimeout(r, 200));
    const store = getStore();
    const index = store.content.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Content not found");
    store.content[index] = { ...store.content[index], status: "approved" };
    saveStore(store);
    return store.content[index];
  },

  // Simulates PATCH /api/content/:id/reject
  // Real: const { data } = await api.patch(`/content/${id}/reject`, { reason }); return data;
  reject: async (id, reason) => {
    await new Promise((r) => setTimeout(r, 200));
    if (!reason?.trim()) throw new Error("Rejection reason is required");
    const store = getStore();
    const index = store.content.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Content not found");
    store.content[index] = { ...store.content[index], status: "rejected", rejectionReason: reason };
    saveStore(store);
    return store.content[index];
  },
};

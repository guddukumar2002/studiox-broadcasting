/**
 * auth.service.js
 * All authentication operations go through here.
 * To connect a real backend: replace the mock logic with axios.post('/api/auth/login', ...)
 */

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const MOCK_USERS = {
  "teacher@school.com": { id: "t1", name: "John Teacher", email: "teacher@school.com", role: "teacher" },
  "principal@school.com": { id: "p1", name: "Sarah Principal", email: "principal@school.com", role: "principal" },
};

export const authService = {
  // Simulates POST /api/auth/login
  login: async (email, password) => {
    await new Promise((r) => setTimeout(r, 800));
    const user = MOCK_USERS[email];
    if (!user || !password) {
      throw new Error("Invalid credentials. Use teacher@school.com or principal@school.com");
    }
    const token = btoa(`${user.id}:${Date.now()}`);
    return { user, token };
  },

  saveSession: (user, token) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getSavedUser: () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};

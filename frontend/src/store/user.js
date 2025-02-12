// store/user.js
import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false, // Track if the user is an admin

  register: async (userDetails) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    });
    const data = await res.json();
    if (data.success) {
      set({
        user: { ...data.user, id: data.user._id }, // Map _id to id
        isAuthenticated: true,
        isAdmin: data.user.isAdmin,
      });
      console.log("User registered:", data.user);
    } else {
      console.log("Registration failed:", data.message);
    }
    return data;
  },

  login: async (credentials) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.success) {
      set({
        user: { ...data.user, id: data.user._id }, // Map _id to id
        isAuthenticated: true,
        isAdmin: data.user.isAdmin,
      });
      console.log("User logged in:", data.user);
    } else {
      console.log("Login failed:", data.message);
    }
    return data;
  },

  logout: () => set({ user: null, isAuthenticated: false, isAdmin: false }),
}));

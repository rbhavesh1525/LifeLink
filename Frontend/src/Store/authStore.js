import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  login: (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);  // <-- store role

    set({
      user: userData,
      token,
      role: userData.role,
      isAuthenticated: true,
    });

    console.log("✅ Login Successful:", userData.role);
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null, role: null, isAuthenticated: false });
    console.log("👋 Logout Successful");
  },
}));

export default useAuthStore;

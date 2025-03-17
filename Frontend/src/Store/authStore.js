import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  // ✅ Function to check authentication status (fixes persistence issue)
  checkAuthStatus: () => {
    const token = localStorage.getItem("token");
    set({ token, isAuthenticated: !!token });
  },

  // Login function
  login: (userData, token) => {
    localStorage.setItem("token", token);
    set({ user: userData, token, isAuthenticated: true });
    console.log("Login Successful:", token);
  },

  // Logout function
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
    console.log("Logout Successful");
  },
}));

export default useAuthStore;

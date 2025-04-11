import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  hospitalId: localStorage.getItem("hospitalId") || null,  // 🔹 Persist hospitalId
  isAuthenticated: !!localStorage.getItem("token"),

  // Login function
  login: (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("hospitalId", userData.id);  // 🔹 Store hospitalId in localStorage

    set({
      user: userData,
      token,
      hospitalId: userData.id, // 🔹 Persist ID
      isAuthenticated: true,
    });

    console.log("Login Successful:", token);
  },

  // Logout function
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("hospitalId"); // 🔹 Clear hospitalId on logout

    set({ user: null, token: null, hospitalId: null, isAuthenticated: false });
    console.log("Logout Successful");
  },
}));

export default useAuthStore;

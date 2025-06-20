import { create } from "zustand";
import API from "api/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const useAdminStore = create((set) => ({
  loading: false,

  login: async (data, navigate) => {
    set({ loading: true });

    try {
      const res = await API.post("/admin/login", data);
      const { accessToken, refreshToken } = res.data.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const user = jwtDecode(accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      const returnURL = localStorage.getItem("returnURL") || "/admin";
      navigate(returnURL, { replace: true });
      localStorage.removeItem("returnURL");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.clear();
    set({
      token: null,
      error: null,
    });
  },
}));

export default useAdminStore;

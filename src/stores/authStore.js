import { create } from "zustand";
import API from "api/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const useAuthStore = create((set) => ({
  loading: false,
  token: localStorage.getItem("token") || null,

  login: async (username, password, navigate) => {
    set({ loading: true, error: null });

    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      const { accessToken, refreshToken } = res.data.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const user = jwtDecode(accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      const returnURL = localStorage.getItem("returnURL") || "/";

      navigate(returnURL, { replace: true });

      localStorage.removeItem("returnURL");

      set({
        token: accessToken,
        loading: false,
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      set({ loading: false });
    }
  },

  signup: async (data, navigate) => {
    set({ loading: true, error: null });

    try {
      await API.post("/auth/signup", data);

      navigate("/authentication/sign-in");
      toast.success("Sign up success");
      set({
        loading: false,
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Sign up failed. Please try again.";
      toast.error(message);
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

export default useAuthStore;

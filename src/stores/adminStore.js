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

  caculateTotal: async () => {
    set({ loading: true });

    try {
      const res = await API.get("/admin/caculate-total");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error caculate total data";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  caculateService: async () => {
    set({ loadingServices: true });

    try {
      const res = await API.get("/admin/caculate-services");
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Error caculate total services";
      toast.error(message);
      return null;
    } finally {
      set({ loadingServices: false });
    }
  },

  getBills: async () => {
    set({ loadingServices: true });

    try {
      const res = await API.get("/admin/bills");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting bills";
      toast.error(message);
      return null;
    } finally {
      set({ loadingServices: false });
    }
  },

  getTransactions: async () => {
    set({ loadingServices: true });

    try {
      const res = await API.get("/admin/transactions");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting transactions";
      toast.error(message);
      return null;
    } finally {
      set({ loadingServices: false });
    }
  },

  getPackages: async () => {
    set({ loadingServices: true });

    try {
      const res = await API.get("/admin/packages");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting packages";
      toast.error(message);
      return null;
    } finally {
      set({ loadingServices: false });
    }
  },

  getUsers: async () => {
    set({ loadingServices: true });

    try {
      const res = await API.get("/admin/users");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting users";
      toast.error(message);
      return null;
    } finally {
      set({ loadingServices: false });
    }
  },
}));

export default useAdminStore;

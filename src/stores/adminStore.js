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
      navigate("/admin");
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

  getBills: async ({ fromDate, toDate, isPaid }) => {
    set({ loadingServices: true });

    try {
      const res = await API.get("/admin/bills", {
        params: { fromDate, toDate, isPaid },
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting bills";
      toast.error(message);
      return null;
    } finally {
      set({ loadingServices: false });
    }
  },

  getTransactions: async ({ fromDate, toDate }) => {
    set({ loadingServices: true });

    try {
      const res = await API.get("/admin/transactions", {
        params: { fromDate, toDate },
      });
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

  getFeedbacks: async () => {
    set({ loadingServices: true });

    try {
      const res = await API.get("/admin/feedbacks");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting feedbacks";
      toast.error(message);
      return null;
    } finally {
      set({ loadingServices: false });
    }
  },

  handleFeedback: async (feedbackId, action) => {
    set({ loadingServices: true });

    try {
      const res = await API.patch(`/admin/feedbacks/${feedbackId}/${action}`);
      toast.success(`Feedback ${action}d!`);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || `Error ${action}ing feedback`;
      toast.error(message);
      return { success: false };
    } finally {
      set({ loadingServices: false });
    }
  },

  togglePackage: async (packageId, type, enable) => {
    set({ loadingServices: true });

    try {
      const action = enable ? "enable" : "disable";
      const res = await API.patch(`/admin/packages/${type}/${packageId}/${action}`);
      toast.success(`Package ${action}d!`);
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || `Error changing status package`;
      toast.error(message);
      return { success: false };
    } finally {
      set({ loadingServices: false });
    }
  },

  addPackage: async (data) => {
    set({ loadingServices: true });

    try {
      const res = await API.post(`/admin/packages`, data);
      toast.success(`Package ${data.name} added`);
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || `Error changing status package`;
      toast.error(message);
      return { success: false };
    } finally {
      set({ loadingServices: false });
    }
  },
}));

export default useAdminStore;

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
    set({ loading: true });

    try {
      const res = await API.get("/admin/caculate-services");
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Error caculate total services";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getBills: async ({ fromDate, toDate, isPaid }) => {
    set({ loading: true });

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
      set({ loading: false });
    }
  },

  getTransactions: async ({ fromDate, toDate }) => {
    set({ loading: true });

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
      set({ loading: false });
    }
  },

  getPackages: async () => {
    set({ loading: true });

    try {
      const res = await API.get("/admin/packages");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting packages";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getUsers: async () => {
    set({ loading: true });

    try {
      const res = await API.get("/admin/users");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting users";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getFeedbacks: async () => {
    set({ loading: true });

    try {
      const res = await API.get("/admin/feedbacks");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Error getting feedbacks";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  handleFeedback: async (feedbackId, action) => {
    set({ loading: true });

    try {
      const res = await API.patch(`/admin/feedbacks/${feedbackId}/${action}`);
      toast.success(`Feedback ${action}d!`);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || `Error ${action}ing feedback`;
      toast.error(message);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  togglePackage: async (packageId, type, enable) => {
    set({ loading: true });

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
      set({ loading: false });
    }
  },

  addPackage: async (data) => {
    set({ loading: true });

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
      set({ loading: false });
    }
  },
}));

export default useAdminStore;

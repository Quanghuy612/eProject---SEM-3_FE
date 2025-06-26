import { create } from "zustand";
import API from "api/api";
import { toast } from "react-toastify";

const feedBackStore = create((set) => ({
  loading: false,

  getFeedBack: async ({ currentPage }) => {
    set({ loading: true });

    try {
      const res = await API.get("/feedback", {
        params: {
          currentPage,
        },
      });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading feedback";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  createFeedBack: async (data) => {
    set({ loading: true });

    try {
      const res = await API.post("/feedback", data);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error creating feedback";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));

export default feedBackStore;

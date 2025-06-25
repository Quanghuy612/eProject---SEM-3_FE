import { create } from "zustand";
import API from "api/api";

const feedBackStore = create((set) => ({
  loading: false,
  error: null,
  data: null,

  getFeedBack: async ({ currentPage }) => {
    set({ loading: true, error: null });

    try {
      const res = await API.get("/feedback", {
        params: {
          currentPage,
        },
      });

      set({
        loading: false,
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading feedback";
      set({ error: message, loading: false });

      return err;
    }
  },

  createFeedBack: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await API.post("/feedback", data);

      set({
        loading: false,
      });

      return res;
    } catch (err) {
      const message = err?.response?.data?.message || "Error creating feedback";
      set({ error: message, loading: false });

      return err;
    }
  },
}));

export default feedBackStore;

import { create } from "zustand";
import API from "api/api";

const billStore = create((set) => ({
  loading: false,
  error: null,
  data: null,

  getBill: async ({ fromDate, toDate, isPaid, currentPage }) => {
    set({ loading: true, error: null });

    try {
      const res = await API.get("/bill/my-bills", {
        params: {
          fromDate,
          toDate,
          isPaid,
          currentPage,
        },
      });

      set({
        loading: false,
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading bills";
      set({ error: message, loading: false });

      return err;
    }
  },

  getTransaction: async () => {
    set({ loading: true, error: null });

    try {
      const res = await API.get("/transaction/my-transactions");

      set({
        loading: false,
      });

      return res;
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading transactions";
      set({ error: message, loading: false });

      return err;
    }
  },

  completePayBill: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await API.post("/transaction/pay-bills", data);

      set({
        loading: false,
      });

      return res;
    } catch (err) {
      const message = err?.response?.data?.message || "Error vertify otp";
      set({ error: message, loading: false });

      return err;
    }
  },
}));

export default billStore;

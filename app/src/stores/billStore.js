import { create } from "zustand";
import API from "api/api";
import { toast } from "react-toastify";

const billStore = create((set) => ({
  loading: false,

  getBill: async ({ fromDate, toDate, isPaid, currentPage }) => {
    set({ loading: true });

    try {
      const res = await API.get("/bill/my-bills", {
        params: {
          fromDate,
          toDate,
          isPaid,
          currentPage,
        },
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading bills";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getTransaction: async ({ fromDate, toDate, currentPage }) => {
    set({ loading: true });
    try {
      const res = await API.get("/transaction/my-transactions", {
        params: {
          fromDate,
          toDate,
          currentPage,
        },
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading transactions";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  completePayBill: async (data) => {
    set({ loading: true });

    try {
      const res = await API.post("/transaction/pay-bills", data);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error paying bill";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));

export default billStore;

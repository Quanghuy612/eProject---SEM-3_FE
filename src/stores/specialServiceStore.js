import { create } from "zustand";
import API from "api/api";

const specialServiceStore = create((set) => ({
  loading: false,
  error: null,
  data: null,

  getSpecialService: async () => {
    set({ loading: true, error: null });
    try {
      const res = await API.get("/special-service-packages");

      set({
        loading: false,
      });

      return res;
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading services";
      set({ error: message, loading: false });

      return err;
    }
  },

  getOtp: async (Phone) => {
    set({ loading: true, error: null });

    try {
      const res = await API.post("/recharge/get-otp", { Phone });
      const otpData = res.data.data.otp;

      set({
        loading: false,
      });

      return otpData;
    } catch (err) {
      const message = err?.response?.data?.message || "Error getting otp";
      set({ error: message, loading: false });

      return null;
    }
  },

  vertifyOtp: async (Phone, otp) => {
    set({ loading: true, error: null });

    try {
      const res = await API.post("/recharge/vertify-otp", { Phone: Phone, Otp: otp });

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

  completeRecharge: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await API.post("/bill/special-service-bill", data);

      set({
        loading: false,
      });

      return res;
    } catch (err) {
      const message = err?.response?.data?.message || "Error";
      set({ error: message, loading: false });

      return err;
    }
  },
}));

export default specialServiceStore;

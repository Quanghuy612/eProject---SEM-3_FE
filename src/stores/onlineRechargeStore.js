import { create } from "zustand";
import API from "api/api";

const onlineRechargeStore = create((set) => ({
  loading: false,
  error: null,
  data: null,

  getOnlineRecharge: async () => {
    set({ loading: true, error: null });

    try {
      const res = await API.get("/recharge/online-recharge");

      set({
        data: res.data.data,
        loading: false,
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading online recharges";
      set({ error: message, loading: false });
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
      const res = await API.post("/bill/guest-pay-bills", data);

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

export default onlineRechargeStore;

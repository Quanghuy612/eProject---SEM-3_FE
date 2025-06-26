import { create } from "zustand";
import API from "api/api";
import { toast } from "react-toastify";

const onlineRechargeStore = create((set) => ({
  loading: false,
  data: null,

  getOnlineRecharge: async () => {
    set({ loading: true });

    try {
      const res = await API.get("/recharge/online-recharge");

      set({
        data: res.data.data,
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading online recharges";
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  getOtp: async (Phone) => {
    set({ loading: true });

    try {
      const res = await API.post("/recharge/get-otp", { Phone });
      const otpData = res.data.data.otp;

      set({
        loading: false,
      });

      return otpData;
    } catch (err) {
      const message = err?.response?.data?.message || "Error getting otp";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  vertifyOtp: async (Phone, otp) => {
    set({ loading: true });

    try {
      const res = await API.post("/recharge/vertify-otp", { Phone: Phone, Otp: otp });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error vertify otp";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  completeRecharge: async (data) => {
    set({ loading: true });

    try {
      const res = await API.post("/bill/guest-pay-bills", data);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error vertify otp";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));

export default onlineRechargeStore;

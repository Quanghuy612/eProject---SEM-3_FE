import { create } from "zustand";
import API from "api/api";
import { toast } from "react-toastify";

const specialRechargeStore = create((set) => ({
  loading: false,

  getSpecialRecharge: async () => {
    set({ loading: true });

    try {
      const res = await API.get("/recharge/special-recharge");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Error loading special recharges";
      toast.error(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getOtp: async (Phone) => {
    set({ loading: true });

    try {
      const res = await API.post("/recharge/get-otp", { Phone });
      const otpData = res.data.data.otp;

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
      const res = await API.post("/bill/special-recharge-bill", data);
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

export default specialRechargeStore;

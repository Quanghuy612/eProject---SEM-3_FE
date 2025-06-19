import { create } from "zustand";

interface RechargeState {
  step: number;
  mobile: string;
  selectedPlan: number | null;
  setStep: (step: number) => void;
  setMobile: (mobile: string) => void;
  setSelectedPlan: (amount: number) => void;
  reset: () => void;
}

export const useOnlineReChargeStore = create<RechargeState>((set) => ({
  step: 1,
  mobile: "",
  selectedPlan: null,

  setStep: (step) => set({ step }),
  setMobile: (mobile) => set({ mobile }),
  setSelectedPlan: (amount) => set({ selectedPlan: amount }),
  reset: () => set({ step: 1, mobile: "", selectedPlan: null }),
}));

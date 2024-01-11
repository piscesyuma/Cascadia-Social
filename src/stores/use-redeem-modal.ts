import { create } from "zustand";

interface IModal {
  isRedeemModalOpen: boolean;
  openRedeemModal: () => void;
  closeRedeemModal: () => void;
}

export const useRedeemModal = create<IModal>((set) => ({
  isRedeemModalOpen: false,
  openRedeemModal: () => set({ isRedeemModalOpen: true }),
  closeRedeemModal: () => set({ isRedeemModalOpen: false }),
}));

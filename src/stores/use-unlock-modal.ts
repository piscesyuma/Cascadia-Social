import { create } from "zustand";

interface IModal {
  isUnLockModalOpen: boolean;
  openUnLockModal: () => void;
  closeUnLockModal: () => void;
}

export const useUnLockModal = create<IModal>((set) => ({
  isUnLockModalOpen: false,
  openUnLockModal: () => set({ isUnLockModalOpen: true }),
  closeUnLockModal: () => set({ isUnLockModalOpen: false }),
}));

import { create } from "zustand";

interface IModal {
  isLockModalOpen: boolean;
  openLockModal: () => void;
  closeLockModal: () => void;
}

export const useLockModal = create<IModal>((set) => ({
  isLockModalOpen: false,
  openLockModal: () => set({ isLockModalOpen: true }),
  closeLockModal: () => set({ isLockModalOpen: false }),
}));

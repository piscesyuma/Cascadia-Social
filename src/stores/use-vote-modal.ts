import { create } from "zustand";

interface IModal {
  isVoteModalOpen: boolean;
  openVoteModal: () => void;
  closeVoteModal: () => void;
}

export const useVoteModal = create<IModal>((set) => ({
  isVoteModalOpen: false,
  openVoteModal: () => set({ isVoteModalOpen: true }),
  closeVoteModal: () => set({ isVoteModalOpen: false }),
}));

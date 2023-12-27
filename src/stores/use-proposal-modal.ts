import { create } from "zustand";

interface IModal {
  isProposalModalOpen: boolean;
  openProposalModal: () => void;
  closeProposalModal: () => void;
}

export const useProposalModal = create<IModal>((set) => ({
  isProposalModalOpen: false,
  openProposalModal: () => set({ isProposalModalOpen: true }),
  closeProposalModal: () => set({ isProposalModalOpen: false }),
}));

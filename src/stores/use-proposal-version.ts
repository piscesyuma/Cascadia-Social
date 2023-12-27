import { create } from "zustand";

interface IVersion {
  version: string;
  setVersion: (version: string) => void;
}

export const useProposalVersion = create<IVersion>((set) => ({
  version: "active",
  setVersion: (version) => set({ version }),
}));

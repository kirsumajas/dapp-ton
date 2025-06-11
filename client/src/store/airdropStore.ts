import { create } from 'zustand';

type AirdropStore = {
  airdropEnd: number;
  setAirdropEnd: (timestamp: number) => void;
};

export const useAirdropStore = create<AirdropStore>((set) => ({
  // July 1, 2025 UTC (or set from backend if needed)
  airdropEnd: new Date('2025-07-01T00:00:00Z').getTime(),
  setAirdropEnd: (timestamp) => set({ airdropEnd: timestamp }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WalletState = {
  address: string | null;
  setAddress: (address: string | null) => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
    }),
    {
      name: 'wallet-storage', // LocalStorage key
    }
  )
);

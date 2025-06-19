import { create } from 'zustand';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://your-fallback-url.com';

interface BalanceStore {
  balance: number | null;
  setBalance: (value: number) => void;
  fetchBalance: (telegramId: string) => Promise<void>;
}

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: typeof localStorage !== 'undefined'
    ? parseFloat(localStorage.getItem('chop_balance') || '0')
    : null,

  setBalance: (value: number) => {
    localStorage.setItem('chop_balance', value.toString());
    set({ balance: value });
  },

  fetchBalance: async (telegramId: string) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/balance/${telegramId}`);
    const balance = res.data.balance;
    localStorage.setItem('chop_balance', balance.toString());
    set({ balance });
  } catch (err) {
    console.error('Failed to fetch balance:', err);
  }
},
}));


// src/store/historyStore.ts
import { create } from 'zustand';

export interface HistoryItem {
  type: 'reward' | 'withdraw';
  amount: number;
  timestamp: string;
  description: string;
}

interface HistoryStore {
  history: HistoryItem[];
  setHistory: (items: HistoryItem[]) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  setHistory: (items) => set({ history: items }),
  clearHistory: () => set({ history: [] }),
}));

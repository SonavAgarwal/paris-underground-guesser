import { create } from "zustand";

interface GameState {
    score: number;
    increase: (by: number) => void;
    zero: () => void;
}

export const useGameStore = create<GameState>()((set) => ({
    score: 0,
    increase: (by) => set((state) => ({ score: state.score + by })),
    zero: () => set((_) => ({ score: 0 })),
}));

import { create } from "zustand";
import { AnswerRushGameStore } from "../types";
import { generateAnswerRushGameQuestion } from "../helpers";

export const useAnswerRushGameStore = create<AnswerRushGameStore>((set) => ({
  init: (difficulty) => {
    set({
      difficulty,
      question: generateAnswerRushGameQuestion(difficulty),
      score: 0,
      wrongs: 0,
      state: "idle",
    });
  },
  generateQuestion: () => {
    set((store) => ({
      question: generateAnswerRushGameQuestion(store.difficulty),
    }));
  },
  score: 0,
  wrongs: 0,
  setWrongs: (wrongs) => set({ wrongs }),
  setScore: (score) => set({ score }),
  difficulty: null,
  question: null,
  state: "idle",
  setState: (state) => set({ state }),
  reset: () => {
    set({
      question: null,
      difficulty: null,
      state: "idle",
      score: 0,
      wrongs: 0,
    });
  },
}));

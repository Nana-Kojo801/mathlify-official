import { create } from "zustand";
import type { CasualGameStore } from "../types";
import { generateCasualGameQuestions } from "../helpers";

const useCasualGameStore = create<CasualGameStore>((set) => ({
  state: "idle",
  setState: (state) => set({ state }),
  difficulty: null,
  questions: [],
  setQuestions: (questions) => set({ questions }),
  correctAnswer: null,
  timeUsed: 0,
  setTimeUsed: (timeUsed) => set({ timeUsed }),
  init: (difficulty) => {
    const questions = generateCasualGameQuestions(difficulty);
    const correctAnswer = questions.reduce((prev, curr) => prev + curr, 0);
    set({ difficulty, questions, correctAnswer });
  },
  reset: () => {
    set({
      state: "idle",
      difficulty: null,
      questions: [],
      correctAnswer: null,
      timeUsed: 0,
    });
  },
}));

export default useCasualGameStore;

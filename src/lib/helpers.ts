import type { AnswerRushGameStore, CasualGameStore } from "./types";

export function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export const generateCasualGameQuestions = (
  difficulty: CasualGameStore["difficulty"]
): number[] => {
  const { range, quantity } = difficulty!;
  const length =
    Math.floor(Math.random() * (quantity.max - quantity.min + 1)) +
    quantity.min;

  const questions: number[] = [];
  const possibleNumbers: number[] = [];

  for (let i = range.from; i <= range.to; i++) {
    possibleNumbers.push(i, -i);
  }

  while (questions.length < length) {
    const num =
      possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];

    if (questions.length === 0 || num !== questions[questions.length - 1]) {
      questions.push(num);
    }
  }

  return questions;
};

export const generateDifficulty = (round: number) => {
  return {
    range: {
      from: 1,
      to: Math.min(10 + round * 2, 100), // Caps at 100
    },
    quantity: {
      min: Math.min(2 + Math.floor(round / 5), 10), // Increases every 5 rounds, max 10
      max: Math.min(4 + Math.floor(round / 5), 15), // Slightly higher max limit
    },
    timeInterval: Math.max(3 - round * 0.1, 0.5), // Decreases, min 0.5s
    timer: Math.max(10 - round * 0.5, 3), // Decreases, min 3s
  };
};

export const calculateMarathonScore = (averageTime: number, round: number) => {
  if (round === 0) return 0; // Prevent division by zero

  // Base score: The higher the round, the more points
  const baseScore = round * 100;

  // Time bonus: Faster average time gives more points (scaled inversely)
  const timeBonus = 5000 / (averageTime + 1); // +1 to avoid division by zero

  // Final score is a combination of base score and time bonus
  return Math.round(baseScore + timeBonus);
};

export const generateAnswerRushGameQuestion = (
  difficulty: AnswerRushGameStore["difficulty"]
) => {
  const { range, quantity } = difficulty!;
  const operators = ["+", "-"];
  const numTerms =
    Math.floor(Math.random() * (quantity.max - quantity.min + 1)) +
    quantity.min;

  let question = "";
  let result = 0;

  for (let i = 0; i < numTerms; i++) {
    const num =
      Math.floor(Math.random() * (range.to - range.from + 1)) + range.from;
    const operator = i === 0 ? "" : operators[Math.floor(Math.random() * 2)];

    if (operator === "-") result -= num;
    else result += num;

    question += `${operator} ${num} `;
  }

  question = question.trim();

  // Generate options
  const options = new Set([result]);
  while (options.size < 4) {
    options.add(result + (Math.floor(Math.random() * 11) - 5)); // Slight variation for distractors
  }

  return {
    question,
    correctAnswer: result,
    options: [...options].sort(() => Math.random() - 0.5), // Shuffle options
  };
};

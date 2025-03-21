import { Id } from "convex/_generated/dataModel";
import { authSchema } from "./validators";
import { z } from "zod";

export type AuthContext = {
  loading: boolean;
  authenticated: boolean;
  user: User;
  updateAuthUser: (patch: Partial<User>) => Promise<void>;
  signup: (values: z.infer<typeof authSchema>) => Promise<void>;
  login: (values: z.infer<typeof authSchema>) => Promise<void>;
  logout: () => Promise<void>;
};

export type UserContext = {
  user: User | null;
};

export type User = {
  _id: Id<"users">;
  _creationTime: number;
  updatedAt: string;
  username: string;
  password: string;
  friends: User["_id"][];
  avatar: string;
  elo: {
    casual: number;
    answerRush: number;
  };
  marathon: {
    round: number;
    avgTime: number;
    score: number;
  };
  isOnline: boolean;
};

export type AnswerRushGameStore = {
  difficulty: {
    range: { from: number; to: number };
    quantity: { min: number; max: number };
    timer: number;
  } | null;
  init: (difficulty: AnswerRushGameStore["difficulty"]) => void;
  state: "idle" | "countdown" | "questioning" | "results";
  setState: (state: AnswerRushGameStore["state"]) => void;
  question: {
    question: string;
    correctAnswer: number;
    options: number[];
  } | null;
  score: number;
  setScore: (score: number) => void;
  wrongs: number;
  setWrongs: (wrongs: number) => void;
  generateQuestion: () => void;
  reset: () => void;
};

export type CasualGameStore = {
  state:
    | "idle"
    | "countdown"
    | "questioning"
    | "answer"
    | "correct"
    | "wrong"
    | "timeout";
  setState: (state: CasualGameStore["state"]) => void;
  difficulty: {
    range: { from: number; to: number };
    quantity: { min: number; max: number };
    timeInterval: number;
    timer: number;
  } | null;
  init: (difficulty: CasualGameStore["difficulty"]) => void;
  timeUsed: number;
  setTimeUsed: (timeUsed: number) => void;
  reset: () => void;
  questions: number[];
  setQuestions: (questions: number[]) => void;
  correctAnswer: number | null;
};

export type FriendMessage = {
  _id: Id<"friendMessages">;
  _creationTime: number;
  senderId: Id<"users">;
  receiverId: Id<"users">;
  text: string;
};

export type Room = {
  _id: Id<"rooms">;
  _creationTime: number;
  ownerId: User["_id"];
  owner: User;
  name: string;
  memberCount: number;
  gamesPlayed: number;
  isPublic: boolean;
  isCountdown: boolean;
  isActive: boolean;
  answerRushResults: {
    gameId: string;
    results: {
      userId: User["_id"];
      username: User["username"];
      score: number;
    }[];
  }[];
  currentGameId: string;
  members: {
    user: User;
    userId: User["_id"];
    gamesLost: number;
    gamesWon: number;
  }[];
  gameSettings: {
    type: string;
    casual: {
      range: { from: number; to: number };
      quantity: { min: number; max: number };
      timeInterval: number;
      timer: number;
    };
    answerRush: {
      range: { from: number; to: number };
      quantity: { min: number; max: number };
      timer: number;
    };
  };
};

export type GamePhase = 
  | "waiting" 
  | "countdown" 
  | "playing" 
  | "finished"
  | "error"
  | "recovering";

export type GameSettings = {
  type: string;
  casual: {
    range: { from: number; to: number };
    quantity: { min: number; max: number };
    timeInterval: number;
    timer: number;
  };
  answerRush: {
    range: { from: number; to: number };
    quantity: { min: number; max: number };
    timer: number;
  };
};

export interface GameState {
  phase: GamePhase;
  currentGameId: string | null;
  players: {
    userId: string;
    username: string;
    score: number;
    isReady: boolean;
    lastSeen: number;
    isConnected: boolean;
  }[];
  settings: GameSettings;
  startTime: number | null;
  endTime: number | null;
  error?: {
    message: string;
    code: string;
    timestamp: number;
  };
  recoveryAttempts: number;
  lastUpdate: number;
}

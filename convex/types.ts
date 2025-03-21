import { Id } from "./_generated/dataModel";

export type GamePhase = "waiting" | "countdown" | "playing" | "finished" | "error" | "recovering";

export interface GameState {
  phase: GamePhase;
  currentGameId?: string;
  players: {
    userId: string;
    username: string;
    score: number;
    isReady: boolean;
    lastSeen: number;
    isConnected: boolean;
  }[];
  settings: {
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
  startTime?: number;
  endTime?: number;
  error?: {
    message: string;
    code: string;
    timestamp: number;
  };
  recoveryAttempts: number;
  lastUpdate: number;
}

export interface Room {
  _id: Id<"rooms">;
  _creationTime: number;
  ownerId: Id<"users">;
  owner: {
    _id: Id<"users">;
    username: string;
  };
  name: string;
  memberCount: number;
  gamesPlayed: number;
  isPublic: boolean;
  isCountdown: boolean;
  isActive: boolean;
  answerRushResults: {
    gameId: string;
    results: {
      userId: Id<"users">;
      username: string;
      score: number;
    }[];
  }[];
  currentGameId: string;
  members: {
    user: {
      _id: Id<"users">;
      username: string;
    };
    userId: Id<"users">;
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
  gameState: GameState;
} 
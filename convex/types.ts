import { Id } from "./_generated/dataModel";

/**
 * Core game state types
 */

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

/**
 * Room and user types
 */

export interface Room {
  _id: Id<"rooms">;
  _creationTime: number;
  ownerId: Id<"users">;
  owner?: {
    _id: Id<"users">;
    username: string;
  };
  name: string;
  memberCount: number;
  gamesPlayed: number;
  isPublic: boolean;
  isActive: boolean;
  members: {
    userId: Id<"users">;
    gamesWon: number;
    gamesLost: number;
    user?: {
      _id: Id<"users">;
      username: string;
    };
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
  answerRushResults: {
    gameId: string;
    results: {
      userId: Id<"users">;
      username: string;
      score: number;
      rank?: number;
    }[];
  }[];
  currentGameId?: string;
  gameState: GameState;
}

export interface GameSettings {
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
} 
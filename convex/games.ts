import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { GameState, GamePhase, Room } from "./types";

const MAX_RECOVERY_ATTEMPTS = 3;
const PLAYER_TIMEOUT = 10000; // 10 seconds

export const getGameState = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    
    const gameState = (room as Room).gameState;
    
    // Check for disconnected players
    const now = Date.now();
    const updatedPlayers = gameState.players.map(player => ({
      ...player,
      isConnected: now - player.lastSeen < PLAYER_TIMEOUT
    }));

    // If any players are disconnected during an active game, mark as error
    if (gameState.phase === "playing" && updatedPlayers.some(p => !p.isConnected)) {
      const disconnectedPlayers = updatedPlayers.filter(p => !p.isConnected);
      return {
        ...gameState,
        players: updatedPlayers,
        phase: "error" as GamePhase,
        error: {
          message: `Players disconnected: ${disconnectedPlayers.map(p => p.username).join(", ")}`,
          code: "PLAYER_DISCONNECTED",
          timestamp: now
        }
      };
    }

    return {
      ...gameState,
      players: updatedPlayers
    };
  },
});

export const updateGameState = mutation({
  args: {
    roomId: v.id("rooms"),
    phase: v.optional(v.string()),
    currentGameId: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    error: v.optional(v.object({
      message: v.string(),
      code: v.string(),
      timestamp: v.number()
    })),
    playerUpdate: v.optional(v.object({
      userId: v.string(),
      lastSeen: v.number(),
      isReady: v.optional(v.boolean()),
      score: v.optional(v.number())
    }))
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const currentGameState = (room as Room).gameState;
    
    // Handle player updates
    let updatedPlayers = [...currentGameState.players];
    if (args.playerUpdate) {
      updatedPlayers = updatedPlayers.map(player => 
        player.userId === args.playerUpdate!.userId
          ? {
              ...player,
              lastSeen: args.playerUpdate!.lastSeen,
              isReady: args.playerUpdate!.isReady ?? player.isReady,
              score: args.playerUpdate!.score ?? player.score,
              isConnected: true
            }
          : player
      );
    }

    // Handle recovery attempts
    let recoveryAttempts = currentGameState.recoveryAttempts;
    if (args.phase === "recovering") {
      recoveryAttempts += 1;
      if (recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
        return {
          ...currentGameState,
          phase: "error" as GamePhase,
          error: {
            message: "Maximum recovery attempts reached",
            code: "MAX_RECOVERY_ATTEMPTS",
            timestamp: Date.now()
          }
        };
      }
    }

    const updatedGameState: GameState = {
      ...currentGameState,
      phase: (args.phase ?? currentGameState.phase) as GamePhase,
      currentGameId: args.currentGameId ?? currentGameState.currentGameId,
      startTime: args.startTime ?? currentGameState.startTime,
      endTime: args.endTime ?? currentGameState.endTime,
      error: args.error ?? currentGameState.error,
      players: updatedPlayers,
      recoveryAttempts,
      lastUpdate: Date.now()
    };

    await ctx.db.patch(args.roomId, {
      gameState: updatedGameState,
    });

    return updatedGameState;
  },
});

export const recoverGame = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const currentGameState = (room as Room).gameState;
    
    // Check if all players are back
    const now = Date.now();
    const allPlayersConnected = currentGameState.players.every(
      player => now - player.lastSeen < PLAYER_TIMEOUT
    );

    if (!allPlayersConnected) {
      return {
        ...currentGameState,
        phase: "recovering" as GamePhase,
        error: {
          message: "Waiting for all players to reconnect",
          code: "WAITING_FOR_PLAYERS",
          timestamp: now
        }
      };
    }

    // Reset game state to a safe point
    return {
      ...currentGameState,
      phase: "waiting" as GamePhase,
      error: undefined,
      recoveryAttempts: 0,
      lastUpdate: now
    };
  }
}); 
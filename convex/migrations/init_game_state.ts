import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export const initGameState = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    // Get owner details
    const owner = await ctx.db.get(room.ownerId);
    if (!owner) throw new Error("Owner not found");

    const initialGameState = {
      phase: "waiting",
      currentGameId: undefined,
      players: room.members.map(member => ({
        userId: member.userId,
        username: member.user.username,
        score: 0,
        isReady: false,
        lastSeen: Date.now(),
        isConnected: true,
      })),
      settings: room.gameSettings,
      startTime: undefined,
      endTime: undefined,
      recoveryAttempts: 0,
      lastUpdate: Date.now(),
    };

    await ctx.db.patch(args.roomId, {
      gameState: initialGameState,
    });

    return initialGameState;
  },
}); 
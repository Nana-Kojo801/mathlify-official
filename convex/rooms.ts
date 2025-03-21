import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { GameState, GamePhase } from "./types";

/**
 * Room management functionality
 */

export const createRoom = mutation({
  args: {
    ownerId: v.id("users"),
    name: v.string(),
    memberCount: v.number(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, { name, memberCount, ownerId, isPublic }) => {
    const owner = await ctx.db.get(ownerId);
    if (!owner) throw new Error("Owner not found");

    return await ctx.db.insert("rooms", {
      name,
      memberCount,
      ownerId,
      owner: {
        _id: ownerId,
        username: owner.username,
      },
      gamesPlayed: 0,
      members: [],
      isPublic,
      isActive: false,
      isCountdown: false,
      isCountingdown: false,
      gameSettings: {
        type: "Answer Rush",
        casual: {
          range: { from: 1, to: 10 },
          quantity: { min: 5, max: 7 },
          timeInterval: 1,
          timer: 10,
        },
        answerRush: {
          range: { from: 1, to: 10 },
          quantity: { min: 3, max: 5 },
          timer: 60,
        },
      },
      answerRushResults: [],
      currentGameId: undefined,
      gameState: {
        phase: "waiting",
        players: [],
        settings: {
          type: "Answer Rush",
          casual: {
            range: { from: 1, to: 10 },
            quantity: { min: 5, max: 7 },
            timeInterval: 1,
            timer: 10,
          },
          answerRush: {
            range: { from: 1, to: 10 },
            quantity: { min: 3, max: 5 },
            timer: 60,
          },
        },
        currentGameId: undefined,
        startTime: undefined,
        endTime: undefined,
        error: undefined,
        recoveryAttempts: 0,
        lastUpdate: Date.now(),
      }
    });
  },
});

export const getRoom = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, { id }) => {
    const room = await ctx.db.get(id);
    if (!room) throw new Error("Room not found");
    
    const members = await Promise.all(
      room.members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        if (!user) return null;
        const { userId, gamesWon, gamesLost } = member;
        return { user, userId, gamesWon, gamesLost };
      })
    );

    return {
      ...room,
      members: members.filter(Boolean),
    };
  },
});

export const joinRoom = mutation({
  args: { userId: v.id("users"), roomId: v.id("rooms") },
  handler: async (ctx, { userId, roomId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    
    // Check if user is already a member
    const isMember = room.members.some(member => member.userId === userId);
    if (isMember) return; // User is already a member, no action needed
    
    // Add user to members
    const newMember = {
      userId,
      gamesWon: 0,
      gamesLost: 0,
      user: {
        _id: userId,
        username: user.username,
      },
    };
    
    await ctx.db.patch(roomId, {
      members: [...room.members, newMember],
    });
  },
});

export const leaveRoom = mutation({
  args: { userId: v.id("users"), roomId: v.id("rooms") },
  handler: async (ctx, { userId, roomId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    
    const members = room.members.filter(member => member.userId !== userId);
    await ctx.db.patch(roomId, { members });
  },
});

export const searchRoom = query({
  args: { roomName: v.string() },
  handler: async (ctx, { roomName }) => {
    if (roomName === "") {
      return await ctx.db.query("rooms").collect();
    } else {
      return await ctx.db
        .query("rooms")
        .withSearchIndex("search_room", (q) => q.search("name", roomName))
        .collect();
    }
  },
});

export const deleteRoom = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    await ctx.db.delete(roomId);
  },
});

/**
 * Game settings management
 */

export const updateGameSettings = mutation({
  args: {
    roomId: v.id("rooms"),
    gameSettings: v.object({
      type: v.string(),
      casual: v.object({
        range: v.object({
          from: v.number(),
          to: v.number(),
        }),
        quantity: v.object({
          min: v.number(),
          max: v.number(),
        }),
        timeInterval: v.number(),
        timer: v.number(),
      }),
      answerRush: v.object({
        range: v.object({
          from: v.number(),
          to: v.number(),
        }),
        quantity: v.object({
          min: v.number(),
          max: v.number(),
        }),
        timer: v.number(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    await ctx.db.patch(args.roomId, {
      gameSettings: args.gameSettings,
    });
  },
});

export const updateAnswerRushGameSettings = mutation({
  args: {
    roomId: v.id("rooms"),
    settings: v.object({
      range: v.object({
        from: v.number(),
        to: v.number(),
      }),
      quantity: v.object({
        min: v.number(),
        max: v.number(),
      }),
      timer: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const gameSettings = { ...room.gameSettings };
    gameSettings.answerRush = args.settings;

    await ctx.db.patch(args.roomId, {
      gameSettings,
    });
  },
});

export const updateCasualGameSettings = mutation({
  args: {
    roomId: v.id("rooms"),
    settings: v.object({
      range: v.object({
        from: v.number(),
        to: v.number(),
      }),
      quantity: v.object({
        min: v.number(),
        max: v.number(),
      }),
      timeInterval: v.number(),
      timer: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const gameSettings = { ...room.gameSettings };
    gameSettings.casual = args.settings;

    await ctx.db.patch(args.roomId, {
      gameSettings,
    });
  },
});

export const updateRoomState = mutation({
  args: {
    roomId: v.id("rooms"),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { roomId, isActive }) => {
    const updates: Record<string, any> = {};
    if (isActive !== undefined) updates.isActive = isActive;
    
    await ctx.db.patch(roomId, updates);
  },
});

/**
 * Game management
 */

export const initializeGame = mutation({
  args: {
    roomId: v.id("rooms"),
    gameId: v.string(),
  },
  handler: async (ctx, { roomId, gameId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    
    // Check if game already exists
    const gameExists = room.answerRushResults.some(game => game.gameId === gameId);
    if (gameExists) {
      // Just update the current game ID
      await ctx.db.patch(roomId, { currentGameId: gameId });
      return;
    }
    
    // Create new game
    await ctx.db.patch(roomId, {
      currentGameId: gameId,
      answerRushResults: [
        ...room.answerRushResults,
        { gameId, results: [] }
      ],
      isActive: true,
    });
  },
});

export const updateScore = mutation({
  args: {
    roomId: v.id("rooms"),
    gameId: v.string(),
    userId: v.id("users"),
    score: v.number(),
  },
  handler: async (ctx, { roomId, gameId, userId, score }) => {
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    
    // Initialize answerRushResults if it doesn't exist
    const answerRushResults = room.answerRushResults || [];
    
    // Find the current game
    let currentGame = answerRushResults.find(game => game.gameId === gameId);
    
    // Create the game if it doesn't exist
    if (!currentGame) {
      currentGame = { gameId, results: [] };
      answerRushResults.push(currentGame);
    }
    
    // Update or add player score
    const existingResult = currentGame.results.find(result => result.userId === userId);
    if (existingResult) {
      // Update existing score
      currentGame.results = currentGame.results.map(result => 
        result.userId === userId ? { ...result, score } : result
      );
    } else {
      // Add new score
      currentGame.results.push({
        userId,
        username: user.username,
        score,
      });
    }
    
    // Recalculate ranks based on scores
    const sortedResults = [...currentGame.results]
      .sort((a, b) => b.score - a.score);
    
    // Assign ranks (players with the same score get the same rank)
    let currentRank = 1;
    let prevScore: number | null = null;
    
    currentGame.results = sortedResults.map((result, index) => {
      if (index > 0 && prevScore !== result.score) {
        currentRank = index + 1;
      }
      prevScore = result.score;
      return { ...result, rank: currentRank };
    });
    
    // Update the room
    await ctx.db.patch(roomId, {
      answerRushResults: answerRushResults.map(game => 
        game.gameId === gameId ? currentGame : game
      )
    });
  },
});

export const finalizeGame = mutation({
  args: {
    roomId: v.id("rooms"),
    gameId: v.string(),
  },
  handler: async (ctx, { roomId, gameId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    
    // Initialize answerRushResults if it doesn't exist
    const answerRushResults = room.answerRushResults || [];
    
    // Find the current game
    const currentGame = answerRushResults.find(game => game.gameId === gameId);
    if (!currentGame) throw new Error("Game not found");
    
    // Sort results by score (descending)
    const sortedResults = [...currentGame.results]
      .sort((a, b) => b.score - a.score);
    
    // Assign final ranks
    let currentRank = 1;
    let prevScore: number | null = null;
    
    const finalResults = sortedResults.map((result, index) => {
      if (index > 0 && prevScore !== result.score) {
        currentRank = index + 1;
      }
      prevScore = result.score;
      return { ...result, rank: currentRank };
    });
    
    // Update game results
    currentGame.results = finalResults;
    
    // Initialize members if it doesn't exist
    const members = room.members || [];
    
    // Update member stats
    const updatedMembers = members.map(member => {
      const playerResult = finalResults.find(result => result.userId === member.userId);
      if (!playerResult) return member;
      
      // Update wins/losses
      const isWinner = playerResult.rank === 1;
      return {
        ...member,
        gamesWon: isWinner ? member.gamesWon + 1 : member.gamesWon,
        gamesLost: !isWinner ? member.gamesLost + 1 : member.gamesLost,
      };
    });
    
    // Update room
    await ctx.db.patch(roomId, {
      answerRushResults: answerRushResults.map(game => 
        game.gameId === gameId ? currentGame : game
      ),
      members: updatedMembers,
      gamesPlayed: (room.gamesPlayed || 0) + 1,
      isActive: false,
      // Reset game state
      gameState: {
        ...room.gameState,
        phase: "waiting",
        currentGameId: undefined,
        startTime: undefined,
        endTime: undefined,
        error: undefined
      }
    });
    
    return finalResults;
  },
});

export const clearGameResults = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    await ctx.db.patch(roomId, {
      answerRushResults: [],
      currentGameId: undefined,
    });
  },
});

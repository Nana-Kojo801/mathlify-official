import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
        type: "Casual",
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
        currentGameId: undefined,
        players: [],
        settings: {
          type: "Casual",
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
        recoveryAttempts: 0,
        lastUpdate: Date.now(),
      },
    });
  },
});

export const getRoom = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, { id }) => {
    const room = (await ctx.db.get(id))!;
    const owner = (await ctx.db.get(room.ownerId))!;
    const members = await Promise.all(
      room.members.map(async (member) => {
        const user = (await ctx.db.get(member.userId))!;
        const { userId, gamesWon, gamesLost } = member;
        return { user, userId, gamesWon, gamesLost };
      })
    );

    return {
      ...room,
      owner,
      members,
    };
  },
});

export const joinRoom = mutation({
  args: { userId: v.id("users"), roomId: v.id("rooms") },
  handler: async (ctx, { userId, roomId }) => {
    const room = (await ctx.db.get(roomId))!;
    const user = (await ctx.db.get(userId))!;
    await ctx.db.patch(roomId, {
      members: Array.from(
        new Set([
          ...room.members,
          {
            gamesLost: 0,
            gamesWon: 0,
            userId,
            user: {
              _id: userId,
              username: user.username,
            },
          },
        ])
      ),
    });
  },
});

export const leaveRoom = mutation({
  args: { userId: v.id("users"), roomId: v.id("rooms") },
  handler: async (ctx, { userId, roomId }) => {
    const room = (await ctx.db.get(roomId))!;
    const members = room.members.filter((member) => member.userId !== userId);
    await ctx.db.patch(roomId, { members });
  },
});

export const searchRoom = query({
  args: { roomName: v.string() },
  handler: async (ctx, { roomName }) => {
    return roomName === ""
      ? await ctx.db.query("rooms").collect()
      : await ctx.db
          .query("rooms")
          .withSearchIndex("search_room", (q) => q.search("name", roomName))
          .collect();
  },
});

export const deleteRoom = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    await ctx.db.delete(roomId);
  },
});

export const updateCasualGameSettings = mutation({
  args: {
    roomId: v.id("rooms"),
    patch: v.object({
      range: v.object({
        from: v.number(),
        to: v.number(),
      }),
      quantity: v.object({
        min: v.number(),
        max: v.number(),
      }),
      timeInterval: v.float64(),
      timer: v.float64(),
    }),
  },
  handler: async (ctx, { roomId, patch }) => {
    const room = (await ctx.db.get(roomId))!;
    await ctx.db.patch(roomId, {
      gameSettings: {
        ...room.gameSettings,
        type: "Casual",
        casual: patch,
      },
    });
  },
});

export const updateAnswerRushGameSettings = mutation({
  args: {
    roomId: v.id("rooms"),
    patch: v.object({
      range: v.object({
        from: v.number(),
        to: v.number(),
      }),
      quantity: v.object({
        min: v.number(),
        max: v.number(),
      }),
      timer: v.float64(),
    }),
  },
  handler: async (ctx, { roomId, patch }) => {
    const room = (await ctx.db.get(roomId))!;
    await ctx.db.patch(roomId, {
      gameSettings: {
        ...room.gameSettings,
        type: "Answer Rush",
        answerRush: patch,
      },
    });
  },
});

export const makeRoomActive = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    await ctx.db.patch(roomId, { isActive: true });
  },
});

export const updateRoomCountdown = mutation({
  args: { roomId: v.id("rooms"), value: v.boolean() },
  handler: async (ctx, { roomId, value }) => {
    await ctx.db.patch(roomId, { isCountingdown: value });
  },
});

export const updateRoomIsActive = mutation({
  args: { roomId: v.id("rooms"), value: v.boolean() },
  handler: async (ctx, { roomId, value }) => {
    await ctx.db.patch(roomId, { isActive: value });
  },
});

export const setGameId = mutation({
  args: { roomId: v.id("rooms"), gameId: v.string() },
  handler: async (ctx, { roomId, gameId }) => {
    const room = (await ctx.db.get(roomId))!;
    await ctx.db.patch(roomId, {
      currentGameId: gameId,
      answerRushResults: [
        ...room.answerRushResults,
        {
          gameId,
          results: [],
        },
      ],
    });
  },
});

export const updateAnswerRushScore = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    score: v.number(),
    gameId: v.string(),
  },
  handler: async (ctx, { roomId, userId, score, gameId }) => {
    const room = (await ctx.db.get(roomId))!;
    const user = (await ctx.db.get(userId))!;
    const currentGame = room.answerRushResults.find(
      (result) => result.gameId === gameId
    )!;

    if (!currentGame.results.find((result) => result.userId === userId)) {
      currentGame.results.push({
        score,
        userId,
        username: user.username,
      });
    } else {
      currentGame.results = currentGame.results.map((result) =>
        result.userId === userId ? { ...result, score } : result
      );
    }

    // Sort results by score (highest first) and add ranks
    let currentRank = 1;
    let lastScore = -1;
    
    // Sort and calculate ranks
    const resultsWithRanks = [...currentGame.results]
      .sort((a, b) => b.score - a.score)
      .map((result, index) => {
        // Same score = same rank
        if (index > 0 && result.score < lastScore) {
          currentRank = index + 1;
        }
        lastScore = result.score;
        
        return {
          ...result,
          rank: currentRank
        };
      });
    
    // Update the results with ranks
    currentGame.results = resultsWithRanks;

    await ctx.db.patch(roomId, {
      answerRushResults: room.answerRushResults.map((game) =>
        game.gameId === gameId ? currentGame : game
      ),
    });
  },
});

export const clearAnswerRushResults = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    await ctx.db.patch(roomId, {
      answerRushResults: [],
    });
  },
});

export const increaseGamesPlayed = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const room = (await ctx.db.get(roomId))!;
    await ctx.db.patch(roomId, {
      gamesPlayed: room.gamesPlayed + 1,
    });
  },
});

export const updateMember = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    patch: v.object({
      gamesWon: v.optional(v.number()),
      gamesLost: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { roomId, patch, userId }) => {
    const room = (await ctx.db.get(roomId))!;
    await ctx.db.patch(roomId, {
      members: room.members.map((member) =>
        member.userId === userId ? { ...member, ...patch } : member
      ),
    });
  },
});

export const finalizeGame = mutation({
  args: {
    roomId: v.id("rooms"),
    gameId: v.string(),
  },
  handler: async (ctx, { roomId, gameId }) => {
    const room = (await ctx.db.get(roomId))!;
    const currentGame = room.answerRushResults.find(
      (result) => result.gameId === gameId
    );

    if (!currentGame) {
      throw new Error("Game not found");
    }

    // Sort results by score (highest first) and finalize ranks
    let currentRank = 1;
    let lastScore = -1;
    
    const finalResults = [...currentGame.results]
      .sort((a, b) => b.score - a.score)
      .map((result, index) => {
        // Same score = same rank
        if (index > 0 && result.score < lastScore) {
          currentRank = index + 1;
        }
        lastScore = result.score;
        
        return {
          ...result,
          rank: currentRank
        };
      });
    
    // Update the results with final ranks
    currentGame.results = finalResults;

    // Update members' stats
    const updatedMembers = room.members.map(member => {
      const result = finalResults.find(r => r.userId === member.userId);
      if (!result) return member;

      return {
        ...member,
        gamesWon: result.rank === 1 ? member.gamesWon + 1 : member.gamesWon,
        gamesLost: result.rank !== 1 ? member.gamesLost + 1 : member.gamesLost
      };
    });

    // Update room stats
    await ctx.db.patch(roomId, {
      answerRushResults: room.answerRushResults.map((game) =>
        game.gameId === gameId ? currentGame : game
      ),
      members: updatedMembers,
      gamesPlayed: room.gamesPlayed + 1,
      isActive: false
    });

    return finalResults;
  },
});

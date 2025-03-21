import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    password: v.string(),
    updatedAt: v.string(),
    avatar: v.string(),
    friends: v.array(v.id("users")),
    elo: v.object({
      casual: v.number(),
      answerRush: v.number(),
    }),
    marathon: v.object({
      round: v.number(),
      avgTime: v.float64(),
      score: v.number(),
    }),
    isOnline: v.boolean(),
  }).searchIndex("search_user", {
    searchField: "username",
  }),
  requests: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
  }),
  friendMessages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    text: v.string(),
  }),
  rooms: defineTable({
    ownerId: v.id("users"),
    owner: v.object({
      _id: v.id("users"),
      username: v.string(),
    }),
    name: v.string(),
    memberCount: v.number(),
    gamesPlayed: v.number(),
    isPublic: v.boolean(),
    isCountdown: v.boolean(),
    isCountingdown: v.boolean(),
    isActive: v.boolean(),
    answerRushResults: v.array(
      v.object({
        gameId: v.string(),
        results: v.array(
          v.object({
            userId: v.id("users"),
            username: v.string(),
            score: v.number(),
          })
        ),
      })
    ),
    currentGameId: v.optional(v.string()),
    members: v.array(
      v.object({
        user: v.object({
          _id: v.id("users"),
          username: v.string(),
        }),
        userId: v.id("users"),
        gamesLost: v.number(),
        gamesWon: v.number(),
      })
    ),
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
        timeInterval: v.float64(),
        timer: v.float64(),
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
        timer: v.float64(),
      }),
    }),
    gameState: v.object({
      phase: v.string(),
      currentGameId: v.optional(v.string()),
      players: v.array(
        v.object({
          userId: v.string(),
          username: v.string(),
          score: v.number(),
          isReady: v.boolean(),
          lastSeen: v.number(),
          isConnected: v.boolean(),
        })
      ),
      settings: v.object({
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
      startTime: v.optional(v.number()),
      endTime: v.optional(v.number()),
      error: v.optional(
        v.object({
          message: v.string(),
          code: v.string(),
          timestamp: v.number(),
        })
      ),
      recoveryAttempts: v.number(),
      lastUpdate: v.number(),
    }),
  }).searchIndex("search_room", {
    searchField: "name",
  }),
  roomMessages: defineTable({
    roomId: v.id("rooms"),
    senderId: v.id("users"),
    text: v.string(),
  }),
});

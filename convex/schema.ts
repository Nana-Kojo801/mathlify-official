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
    name: v.string(),
    memberCount: v.number(),
    gamesPlayed: v.number(),
    isPublic: v.boolean(),
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
        userId: v.id("users"),
        gamesWon: v.number(),
        gamesLost: v.number(),
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
  }).searchIndex("search_room", {
    searchField: "name",
  }),
  roomMessages: defineTable({
    roomId: v.id("rooms"),
    senderId: v.id("users"),
    text: v.string(),
  }),
});

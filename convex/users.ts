import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return (await ctx.db.get(args.id))!
  }
})

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), username))
      .first();
    return user;
  },
});

export const getFriends = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = (await ctx.db.get(args.userId))!
    return await Promise.all(user.friends.map(async (friendId) => {
      return (await ctx.db.get(friendId))!
    }))
  }
})

export const createUser = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("users", {
      ...args,
      elo: { casual: 0, answerRush: 0 },
      marathon: { round: 0, avgTime: 0, score: 0 },
      updatedAt: new Date().toDateString(),
      avatar: `https://ui-avatars.com/api/?name=${args.username}`,
      friends: [],
      isOnline: true
    });

    return await ctx.db.get(id);
  },
});

const updateUserArgs = {
  id: v.id("users"),
  username: v.optional(v.string()),
  password: v.optional(v.string()),
  updatedAt: v.optional(v.string()),
  avatar: v.optional(v.string()),
  friends: v.optional(v.array(v.id("users"))),
  elo: v.optional(
    v.object({
      casual: v.number(),
      answerRush: v.number(),
    })
  ),
  marathon: v.optional(
    v.object({
      round: v.number(),
      avgTime: v.float64(),
      score: v.number(),
    })
  ),
  isOnline: v.optional(v.boolean())
};

export const updateUser = mutation({
  args: v.object(updateUserArgs),
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const searchUser = query({
  args: { username: v.string(), user: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withSearchIndex("search_user", (q) =>
        q.search("username", args.username)
      )
      .filter((q) => q.neq(q.field("username"), args.user))
      .collect();
  },
});

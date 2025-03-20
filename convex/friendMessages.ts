import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getFriendMessages = query({
  args: { user1: v.id("users"), user2: v.id("users") },
  handler: async (ctx, { user1, user2 }) => {
    return await ctx.db
      .query("friendMessages")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("senderId"), user1),
            q.eq(q.field("receiverId"), user2)
          ),
          q.and(
            q.eq(q.field("senderId"), user2),
            q.eq(q.field("receiverId"), user1)
          )
        )
      )
      .order("asc")
      .collect();
  },
});

export const sendFriendMessage = mutation({
  args: {
    senderId: v.id("users"),
    receiverId: v.id("users"),
    text: v.string(),
  },
  handler: async (ctx, { senderId, receiverId, text }) => {
    const id = await ctx.db.insert("friendMessages", {
      senderId,
      receiverId,
      text,
    });
    return (await ctx.db.get(id))!;
  },
});

export const deleteFriendMessage = mutation({
  args: { messageId: v.id("friendMessages") },
  handler: async (ctx, { messageId }) => {
    await ctx.db.delete(messageId);
  },
});

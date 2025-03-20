import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createRoomMessage = mutation({
  args: { roomId: v.id("rooms"), senderId: v.id("users"), text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("roomMessages", args);
  },
});

export const getRoomMessages = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const messages = await ctx.db
      .query("roomMessages")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .collect();
    return await Promise.all(
      messages.map(async (message) => {
        const sender = (await ctx.db.get(message.senderId))!;
        return { ...message, sender };
      })
    );
  },
});

export const deleteRoomMessage = mutation({
  args: { messageId: v.id("roomMessages") },
  handler: async (ctx, { messageId }) => {
    await ctx.db.delete(messageId);
  },
});

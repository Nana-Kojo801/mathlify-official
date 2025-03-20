import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createRequest = mutation({
  args: { senderId: v.id("users"), receiverId: v.id("users") },
  handler: async (ctx, { senderId, receiverId }) => {
    await ctx.db.insert("requests", { senderId, receiverId });
  },
});

export const getReceivedRequest = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const requets = await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("receiverId"), args.userId))
      .collect();

    return await Promise.all(
      requets.map(async (request) => ({
        ...request,
        sender: (await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), request.senderId))
          .first())!,
        receiver: (await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), request.receiverId))
          .first())!,
      }))
    );
  },
});

export const getSentRequest = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const requets = await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("senderId"), args.userId))
      .collect();

    return await Promise.all(
      requets.map(async (request) => ({
        ...request,
        sender: (await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), request.senderId))
          .first())!,
        receiver: (await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), request.receiverId))
          .first())!,
      }))
    );
  },
});

export const acceptRequest = mutation({
  args: { requestId: v.id("requests") },
  handler: async (ctx, args) => {
    const request = (await ctx.db.get(args.requestId))!;
    const [sender, receiver] = await Promise.all([
      ctx.db.get(request.senderId),
      ctx.db.get(request.receiverId),
    ]);
    await Promise.all([
      ctx.db.patch(sender!._id, {
        friends: [...sender!.friends, receiver!._id],
      }),
      ctx.db.patch(receiver!._id, {
        friends: [...receiver!.friends, sender!._id],
      }),
      ctx.db.delete(args.requestId),
    ]);
  },
});

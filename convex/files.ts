import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFile = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const isAuthenticated = await ctx.auth.getUserIdentity();

    if (!isAuthenticated)
      throw new ConvexError("You must be authenticated to upload a file!");

    await ctx.db.insert("files", { name: args.name });
  },
});

export const getFiles = query({
  args: {},
  async handler(ctx) {
    const isAuthenticated = await ctx.auth.getUserIdentity();

    if (!isAuthenticated) return [];

    return ctx.db.query("files").collect();
  },
});

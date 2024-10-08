import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";

export async function getUser(ctx: MutationCtx | QueryCtx, tokenIdentifier: string) {
    const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .first();

    if (!user) throw new ConvexError("Couldnt find a user with specified token identifier");

    return user;
}

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: [],
        });
    },
});

export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.tokenIdentifier);

        if (user.orgIds.includes(args.orgId)) {
            throw new ConvexError("Organization ID already exists for this user");
        }

        await ctx.db.patch(user._id, {
            orgIds: [...user.orgIds, args.orgId],
        });

        return { success: true, message: "Organization ID added successfully" };
    },
});

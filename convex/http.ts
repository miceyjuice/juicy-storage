import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/clerk",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const payloadString = await request.text();
        const headerPayload = request.headers;

        try {
            const result = await ctx.runAction(internal.clerk.fulfill, {
                payload: payloadString,
                headers: {
                    "svix-id": headerPayload.get("svix-id")!,
                    "svix-timestamp": headerPayload.get("svix-timestamp")!,
                    "svix-signature": headerPayload.get("svix-signature")!,
                },
            });

            switch (result.type) {
                case "user.created":
                    await ctx.runMutation(internal.users.createUser, {
                        tokenIdentifier: `https://divine-doe-57.clerk.accounts.dev|${result.data.id}`,
                    });
                    break;

                case "organizationMembership.created":
                    await ctx.runMutation(internal.users.addOrgIdToUser, {
                        tokenIdentifier: `https://divine-doe-57.clerk.accounts.dev|${result.data.public_user_data.user_id}`,
                        orgId: result.data.organization.id,
                    });
                    break;
            }

            return new Response(null, {
                status: 200,
            });
        } catch (error) {
            console.error(error);
            return new Response("Webhook Error", {
                status: 400,
            });
        }
    }),
});

export default http;

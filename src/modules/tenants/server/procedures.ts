import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { Media, Tenant } from "@/payload-types";

export const tenantsRouter = createTRPCRouter({
	getOne: baseProcedure
		.input(
			z.object({
				slug: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const tenantsData = await ctx.payload.find({
				collection: "tenants",
				depth: 1, // "tenant.image" is type of Media
				limit: 1,
				pagination: false,
				where: {
					slug: {
						equals: input.slug,
					},
				},
			});

			const tenant = tenantsData.docs[0];

			if (!tenant) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
			}

			return tenant as Tenant & { image: Media | null };
		}),
});

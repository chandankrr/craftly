import z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { DEFAULT_LIMIT } from "@/lib/constants";

import { Media, Tenant } from "@/payload-types";

export const libraryRouter = createTRPCRouter({
	getMany: protectedProcedure
		.input(
			z.object({
				cursor: z.number().default(1),
				limit: z.number().default(DEFAULT_LIMIT),
			}),
		)
		.query(async ({ ctx, input }) => {
			const ordersData = await ctx.payload.find({
				collection: "orders",
				depth: 0, // We want to juste get ids, with populating
				page: input.cursor,
				limit: input.limit,
				where: {
					user: {
						equals: ctx.session.user.id,
					},
				},
			});

			const productsIds = ordersData.docs.map((doc) => doc.product);

			const productsData = await ctx.payload.find({
				collection: "products",
				pagination: false,
				where: {
					id: {
						in: productsIds,
					},
				},
			});

			return {
				...productsData,
				docs: productsData.docs.map((doc) => ({
					...doc,
					image: doc.image as Media | null,
					tenant: doc.tenant as Tenant & { image: Media | null },
				})),
			};
		}),
});

import { TRPCError } from "@trpc/server";
import z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { DEFAULT_LIMIT } from "@/lib/constants";

import { Media, Tenant } from "@/payload-types";

export const libraryRouter = createTRPCRouter({
	getOne: protectedProcedure
		.input(
			z.object({
				productId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const ordersData = await ctx.payload.find({
				collection: "orders",
				limit: 1,
				pagination: false,
				where: {
					and: [
						{ product: { equals: input.productId } },
						{
							user: {
								equals: ctx.session.user.id,
							},
						},
					],
				},
			});

			const order = ordersData.docs[0];

			if (!order) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
			}

			const product = await ctx.payload.findByID({
				collection: "products",
				id: input.productId,
			});

			if (!product) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Product not found",
				});
			}

			return product;
		}),
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

			const dataWithSummarizedReviews = await Promise.all(
				productsData.docs.map(async (doc) => {
					const reviewsData = await ctx.payload.find({
						collection: "reviews",
						pagination: false,
						where: {
							product: {
								equals: doc.id,
							},
						},
					});

					return {
						...doc,
						reviewsCount: reviewsData.totalDocs,
						reviewRating:
							reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) /
							reviewsData.totalDocs,
					};
				}),
			);

			return {
				...productsData,
				docs: dataWithSummarizedReviews.map((doc) => ({
					...doc,
					image: doc.image as Media | null,
					tenant: doc.tenant as Tenant & { image: Media | null },
				})),
			};
		}),
});

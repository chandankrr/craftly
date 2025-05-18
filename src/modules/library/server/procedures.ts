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

			let productIds = ordersData.docs.map((doc) => doc.product);

			const productsData = await ctx.payload.find({
				collection: "products",
				pagination: false,
				where: {
					id: {
						in: productIds,
					},
				},
			});

			// Again map all the productIds based on fetched products
			productIds = productsData.docs.map((doc) => doc.id);

			// Fetch all reviews for the listed products in a single query
			const allReviews = await ctx.payload.find({
				collection: "reviews",
				pagination: false,
				where: {
					product: {
						in: productIds,
					},
				},
			});

			// Aggregate reviews by productId
			const reviewsByProductId = new Map<
				string,
				{ total: number; sum: number }
			>();

			allReviews.docs.forEach((review) => {
				const productId =
					typeof review.product === "string"
						? review.product
						: review.product.id;
				if (!reviewsByProductId.has(productId)) {
					reviewsByProductId.set(productId, { total: 0, sum: 0 });
				}

				const stats = reviewsByProductId.get(productId)!;
				stats.total += 1;
				stats.sum += review.rating;
			});

			// Merge review summaries into each product
			const dataWithSummarizedReviews = productsData.docs.map((doc) => {
				const stats = reviewsByProductId.get(doc.id);
				const total = stats?.total ?? 0;
				const sum = stats?.sum ?? 0;

				return {
					...doc,
					reviewsCount: total,
					reviewRating: total > 0 ? sum / total : 0,
				};
			});

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

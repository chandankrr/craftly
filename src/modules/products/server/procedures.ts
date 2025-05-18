import { headers as getHeaders } from "next/headers";

import type { Sort, Where } from "payload";
import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { DEFAULT_LIMIT } from "@/lib/constants";

import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "../search-params";

export const productsRouter = createTRPCRouter({
	getOne: baseProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const headers = await getHeaders();
			const session = await ctx.payload.auth({ headers });

			const product = await ctx.payload.findByID({
				collection: "products",
				id: input.id,
				depth: 2, // Load the "product.image", "product.tenant" & "product.tenant.image"
			});

			let isPurchased = false;

			if (session.user) {
				const ordersData = await ctx.payload.find({
					collection: "orders",
					pagination: false,
					where: {
						and: [
							{ product: { equals: product.id } },
							{
								user: {
									equals: session.user.id,
								},
							},
						],
					},
				});

				isPurchased = ordersData.totalDocs > 0;
			}

			const reviews = await ctx.payload.find({
				collection: "reviews",
				pagination: false,
				where: {
					product: {
						equals: product.id,
					},
				},
			});

			const reviewRating =
				reviews.docs.length > 0
					? reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
						reviews.totalDocs
					: 0;

			const ratingDistribution: Record<number, number> = {
				5: 0,
				4: 0,
				3: 0,
				2: 0,
				1: 0,
			};

			if (reviews.totalDocs > 0) {
				reviews.docs.forEach((review) => {
					const rating = review.rating;

					if (rating >= 1 && rating <= 5) {
						ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
					}
				});

				Object.keys(ratingDistribution).forEach((key) => {
					const rating = Number(key);
					const count = ratingDistribution[rating] || 0;
					ratingDistribution[rating] = Math.round(
						(count / reviews.totalDocs) * 100,
					);
				});
			}

			return {
				...product,
				isPurchased,
				image: product.image as Media | null,
				tenant: product.tenant as Tenant & { image: Media | null },
				reviewRating,
				reviewCount: reviews.totalDocs,
				ratingDistribution,
			};
		}),
	getMany: baseProcedure
		.input(
			z.object({
				cursor: z.number().default(1),
				limit: z.number().default(DEFAULT_LIMIT),
				category: z.string().nullable().optional(),
				minPrice: z.string().nullable().optional(),
				maxPrice: z.string().nullable().optional(),
				tags: z.array(z.string()).nullable().optional(),
				sort: z.enum(sortValues).nullable().optional(),
				tenantSlug: z.string().nullable().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const where: Where = {};
			let sort: Sort = "-createdAt";

			// Sort filter
			if (input.sort === "curated") {
				sort = "-createdAt";
			}
			if (input.sort === "trending") {
				sort = "name";
			}
			if (input.sort === "hot_and_new") {
				sort = "+createdAt";
			}

			// Price filter
			if (input.minPrice && input.maxPrice) {
				where.price = {
					greater_than_equal: input.minPrice,
					less_than_equal: input.maxPrice,
				};
			} else if (input.minPrice) {
				where.price = {
					greater_than_equal: input.minPrice,
				};
			} else if (input.maxPrice) {
				where.price = {
					less_than_equal: input.maxPrice,
				};
			}

			// Get products by tenant
			if (input.tenantSlug) {
				where["tenant.slug"] = {
					equals: input.tenantSlug,
				};
			}

			// Category & Subcategory filter
			if (input.category) {
				const categoriesData = await ctx.payload.find({
					collection: "categories",
					depth: 1, // Populate subcategories, subcategories[0] will be a type of "Category"
					limit: 1,
					pagination: false,
					where: {
						slug: {
							equals: input.category,
						},
					},
				});

				const formatedData = categoriesData.docs.map((doc) => ({
					...doc,
					subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
						...(doc as Category),
					})),
				}));

				const subcategoriesSlugs = [];
				const parentCategory = formatedData[0];

				if (parentCategory) {
					subcategoriesSlugs.push(
						...parentCategory.subcategories.map(
							(subcategory) => subcategory.slug,
						),
					);

					where["category.slug"] = {
						in: [parentCategory.slug, ...subcategoriesSlugs],
					};
				}
			}

			// Tag filter
			if (input.tags && input.tags.length > 0) {
				where["tags.name"] = {
					in: input.tags,
				};
			}

			const data = await ctx.payload.find({
				collection: "products",
				depth: 2, // Populate "category", "image" "tenant" & "tenant image"
				where,
				sort,
				page: input.cursor,
				limit: input.limit,
			});

			const productIds = data.docs.map((doc) => doc.id);

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
			const dataWithSummarizedReviews = data.docs.map((doc) => {
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
				...data,
				docs: dataWithSummarizedReviews.map((doc) => ({
					...doc,
					image: doc.image as Media | null,
					tenant: doc.tenant as Tenant & { image: Media | null },
				})),
			};
		}),
});

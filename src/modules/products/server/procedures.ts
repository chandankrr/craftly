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
			const product = await ctx.payload.findByID({
				collection: "products",
				id: input.id,
				depth: 2, // Load the "product.image", "product.tenant" & "product.tenant.image"
			});

			return {
				...product,
				image: product.image as Media | null,
				tenant: product.tenant as Tenant & { image: Media | null },
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

			return {
				...data,
				docs: data.docs.map((doc) => ({
					...doc,
					image: doc.image as Media | null,
					tenant: doc.tenant as Tenant & { image: Media | null },
				})),
			};
		}),
});

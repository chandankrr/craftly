import type { Where } from "payload";
import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
	getMany: baseProcedure
		.input(
			z.object({
				category: z.string().nullable().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const where: Where = {};

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

			const data = await ctx.payload.find({
				collection: "products",
				depth: 1,
				where,
			});

			return data;
		}),
});

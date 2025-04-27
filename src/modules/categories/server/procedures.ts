import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
	getMany: baseProcedure.query(async ({ ctx }) => {
		const data = await ctx.payload.find({
			collection: "categories",
			depth: 1, // Populate subcategories, subcategories[0] will be a type of "Category"
			pagination: false,
			where: {
				parent: {
					exists: false,
				},
			},
			sort: "name",
		});

		const formatedData = data.docs.map((doc) => ({
			...doc,
			subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
				...(doc as Category),
				subcategories: undefined,
			})),
		}));

		return formatedData;
	}),
});

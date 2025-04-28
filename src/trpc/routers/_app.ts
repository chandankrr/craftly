import { createTRPCRouter } from "@/trpc/init";

import { authRouter } from "@/modules/auth/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;

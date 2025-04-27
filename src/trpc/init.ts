import { cache } from "react";

import configPromise from "@payload-config";
import { initTRPC } from "@trpc/server";
import { getPayload } from "payload";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
	return {};
});

const t = initTRPC.create({
	transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
	const payload = await getPayload({
		config: configPromise,
	});

	return next({ ctx: { payload } });
});

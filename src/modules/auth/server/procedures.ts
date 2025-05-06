import { headers as getHeaders } from "next/headers";

import { TRPCError } from "@trpc/server";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({
	session: baseProcedure.query(async ({ ctx }) => {
		const headers = await getHeaders();

		const session = await ctx.payload.auth({ headers });

		return session;
	}),
	register: baseProcedure
		.input(registerSchema)
		.mutation(async ({ input, ctx }) => {
			const existingData = await ctx.payload.find({
				collection: "users",
				limit: 1,
				where: {
					or: [
						{
							username: {
								equals: input.username,
							},
						},
						{
							email: {
								equals: input.email,
							},
						},
					],
				},
			});

			const existingUser = existingData.docs[0];

			if (existingUser) {
				if (existingUser.username === input.username) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Username already taken",
					});
				}
				if (existingUser.email === input.email) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Email already taken",
					});
				}
			}

			// Create tenant for newly registered user
			let tenant;
			try {
				tenant = await ctx.payload.create({
					collection: "tenants",
					data: {
						name: input.username,
						slug: input.username,
						stripeAccountId: "test",
					},
				});
			} catch {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create tenant",
				});
			}

			try {
				await ctx.payload.create({
					collection: "users",
					data: {
						email: input.email,
						username: input.username,
						password: input.password, // This will be hashed by payload
						tenants: [{ tenant: tenant.id }],
					},
				});
			} catch {
				// Rollback tenant if user creation fails
				await ctx.payload.delete({
					collection: "tenants",
					id: tenant.id,
				});

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create user",
				});
			}

			// Login after registration
			const data = await ctx.payload.login({
				collection: "users",
				data: {
					email: input.email,
					password: input.password,
				},
			});

			if (!data.token) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Failed to login",
				});
			}

			// Set cookie
			await generateAuthCookie({
				prefix: ctx.payload.config.cookiePrefix,
				value: data.token,
			});
		}),
	login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
		const data = await ctx.payload.login({
			collection: "users",
			data: {
				email: input.email,
				password: input.password,
			},
		});

		if (!data.token) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "Failed to login" });
		}

		// Set cookie
		await generateAuthCookie({
			prefix: ctx.payload.config.cookiePrefix,
			value: data.token,
		});

		return data;
	}),
});

import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "Password must be at least 6 characters"),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(63, "Username must be less than 63 characters")
		.regex(
			/^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
			"Username can only contain lowercase letters, numbers and hypens. It must start and end with a letter and number",
		)
		.refine((val) => !val.includes("--"), "Username cannot contain consecutive hypens")
		.transform((val) => val.toLowerCase()),
});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

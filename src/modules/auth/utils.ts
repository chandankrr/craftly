import { cookies as getCookies } from "next/headers";

interface AuthCookie {
	prefix: string;
	value: string;
}

export const generateAuthCookie = async ({ prefix, value }: AuthCookie) => {
	const cookies = await getCookies();
	cookies.set({
		name: `${prefix}-token`,
		value: value,
		httpOnly: true,
		path: "/",
	});
};

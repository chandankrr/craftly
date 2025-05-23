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
		// This enables the cookie auth on localhost
		// But it will not work with subdomains turned on in developement
		...(process.env.NODE_ENV !== "development" && {
			sameSite: "none",
			domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
			secure: true,
		}),
	});
};

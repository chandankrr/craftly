import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Craftly - Mutlitanant Ecommerce",
	description:
		"Craftly is a powerful multitenant eCommerce platform designed to help businesses create and manage their own online stores with ease.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${dmSans.className} antialiased`}>{children}</body>
		</html>
	);
}

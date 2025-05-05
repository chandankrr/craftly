import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TRPCReactProvider } from "@/trpc/client";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";
import "@/styles/customs.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Craftly - Multitenant Ecommerce",
	description:
		"Craftly is a powerful multitenant eCommerce platform designed to help businesses create and manage their own online stores with ease.",
};

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html lang="en">
			<body className={cn(dmSans.className, "antialiased")}>
				<NuqsAdapter>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</NuqsAdapter>
				<Toaster />
			</body>
		</html>
	);
};

export default RootLayout;

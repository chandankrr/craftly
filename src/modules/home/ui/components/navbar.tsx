"use client";

import { useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { MobileNavbar } from "./mobile-navbar";

const poppins = Poppins({
	subsets: ["latin"],
	weight: "700",
});

interface NavbarItemProps {
	href: string;
	children: React.ReactNode;
	isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
	return (
		<Button
			variant="noShadow"
			className={cn(
				"border-secondary-background hover:border-foreground h-12 rounded-full border bg-transparent px-3.5 text-lg",
				isActive &&
					"bg-foreground text-secondary-background hover:bg-foreground hover:text-secondary-background border-foreground hover:border-foreground",
			)}
			asChild
		>
			<Link href={href}>{children}</Link>
		</Button>
	);
};

const navbarItems = [
	{ href: "/", children: "Home" },
	{ href: "/about", children: "About" },
	{ href: "/features", children: "Features" },
	{ href: "/pricing", children: "Pricing" },
	{ href: "/contact", children: "Contact" },
];

export const Navbar = () => {
	const pathname = usePathname();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const trpc = useTRPC();
	const session = useQuery(trpc.auth.session.queryOptions());

	return (
		<nav className="flex h-20 justify-between border-b bg-white font-medium">
			{/* Logo */}
			<Link href="/" className="flex items-center pl-6">
				<span className={cn("text-5xl font-semibold", poppins.className)}>
					craftly
				</span>
			</Link>

			{/* Navbar Items */}
			<div className="hidden items-center gap-4 lg:flex">
				{navbarItems.map(({ href, children }) => (
					<NavbarItem key={href} href={href} isActive={pathname === href}>
						{children}
					</NavbarItem>
				))}
			</div>

			{/* CTA buttons */}
			{session.data?.user ? (
				<div className="hidden lg:flex">
					<Button
						variant="noShadow"
						className="hover:bg-main bg-foreground hover:text-main-foreground h-full rounded-none border-0 border-l px-12 text-lg text-white transition-colors"
						asChild
					>
						<Link target="_blank" href="/admin">
							Dashboard
						</Link>
					</Button>
				</div>
			) : (
				<div className="hidden lg:flex">
					<Button
						variant="noShadow"
						className="hover:bg-main bg-secondary-background h-full rounded-none border-0 border-l px-12 text-lg transition-colors"
						asChild
					>
						<Link prefetch href="/sign-in">
							Log in
						</Link>
					</Button>
					<Button
						variant="noShadow"
						className="hover:bg-main bg-foreground hover:text-main-foreground h-full rounded-none border-0 border-l px-12 text-lg text-white transition-colors"
						asChild
					>
						<Link prefetch href="/sign-up">
							Start selling
						</Link>
					</Button>
				</div>
			)}

			{/* Mobile menu button */}
			<div className="flex items-center justify-center pr-6 lg:hidden">
				<Button
					variant="noShadow"
					className="size-12"
					onClick={() => setIsSidebarOpen(true)}
				>
					<MenuIcon style={{ width: 24, height: 24 }} />
				</Button>
			</div>

			{/* Mobile navbar */}
			<MobileNavbar
				items={navbarItems}
				open={isSidebarOpen}
				onOpenChange={setIsSidebarOpen}
			/>
		</nav>
	);
};

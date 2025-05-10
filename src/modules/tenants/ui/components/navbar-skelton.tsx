import { ShoppingCartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const NavbarSkeleton = () => {
	return (
		<nav className="h-20 border-b bg-white font-medium">
			<div className="mx-auto h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
				<div className="" />
				<Button variant="noShadow" disabled className="h-12 bg-white">
					<ShoppingCartIcon className="text-black" />
				</Button>
			</div>
		</nav>
	);
};

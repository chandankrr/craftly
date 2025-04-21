import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type NavbarItem = {
	href: string;
	children: React.ReactNode;
};

interface MobileNavbarProps {
	items: NavbarItem[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const MobileNavbar = ({ items, open, onOpenChange }: MobileNavbarProps) => {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="left" className="p-0 transition-none">
				<SheetHeader className="border-b p-4">
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
					{items.map(({ href, children }) => (
						<Link
							key={href}
							href={href}
							className="hover:bg-foreground hover:text-secondary-background flex w-full items-center p-4 text-left text-base font-medium"
							onClick={() => onOpenChange(false)}
						>
							{children}
						</Link>
					))}

					<div className="border-t">
						<Link
							href="/sign-in"
							className="hover:bg-foreground hover:text-secondary-background flex w-full items-center p-4 text-left text-base font-medium"
							onClick={() => onOpenChange(false)}
						>
							Log in
						</Link>
						<Link
							href="/sign-up"
							className="hover:bg-foreground hover:text-secondary-background flex w-full items-center p-4 text-left text-base font-medium"
							onClick={() => onOpenChange(false)}
						>
							Start selling
						</Link>
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};

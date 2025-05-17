import Link from "next/link";

import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

import { Button } from "@/components/ui/button";

interface CartButtonProps {
	isPurchased?: boolean;
	tenantSlug: string;
	productId: string;
}

export const CartButton = ({
	isPurchased,
	tenantSlug,
	productId,
}: CartButtonProps) => {
	const cart = useCart(tenantSlug);

	if (isPurchased) {
		return (
			<Button
				variant="reverse"
				className="h-12 flex-1 bg-white font-medium"
				asChild
			>
				<Link prefetch href={`/library/${productId}`}>
					View in library
				</Link>
			</Button>
		);
	}

	return (
		<Button
			variant="reverse"
			className={cn(
				"h-12 flex-1 bg-pink-400",
				cart.isProductInCart(productId) && "bg-white",
			)}
			onClick={() => cart.toggleProduct(productId)}
		>
			{cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
		</Button>
	);
};

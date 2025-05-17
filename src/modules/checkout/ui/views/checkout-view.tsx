"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { generateTenantURL } from "@/lib/utils";

import { useCart } from "../../hooks/use-cart";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

interface CheckoutViewProps {
	tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
	const router = useRouter();

	const [states, setStates] = useCheckoutStates();
	const { productIds, removeProduct, clearCart } = useCart(tenantSlug);

	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { data, error, isLoading } = useQuery({
		...trpc.checkout.getProducts.queryOptions({ ids: productIds }),
		enabled: !!productIds.length,
	});

	const purchase = useMutation(
		trpc.checkout.purchase.mutationOptions({
			onMutate: () => {
				setStates({ success: false, cancel: false });
			},
			onSuccess: (data) => {
				window.location.href = data.url;
			},
			onError: (error) => {
				if (error.data?.code === "UNAUTHORIZED") {
					router.push("/sign-in");
				}

				toast.error(error.message);
			},
		}),
	);

	useEffect(() => {
		if (states.success) {
			setStates({ success: false, cancel: false });
			clearCart();

			queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());

			router.push("/library");
		}
	}, [states.success, clearCart, router, queryClient, trpc.library.getMany]);

	useEffect(() => {
		if (error?.data?.code === "NOT_FOUND") {
			clearCart();
			toast.warning("Invalid products found, cart cleared!");
		}
	}, [error, clearCart]);

	if (isLoading) {
		return (
			<div className="px-4 pt-4 lg:px-12 lg:pt-16">
				<div className="flex h-[400px] w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
					<LoaderIcon className="animate-spin text-neutral-500" />
				</div>
			</div>
		);
	}

	if (!data || data?.totalDocs === 0) {
		return (
			<div className="px-4 pt-4 lg:px-12 lg:pt-16">
				<div className="flex h-[400px] w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
					<InboxIcon />
					<p className="text-base font-medium">No products found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="px-4 pt-4 lg:px-12 lg:pt-16">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
				{/* Cart items */}
				<div className="lg:col-span-4">
					<div className="overflow-hidden rounded-md border bg-white">
						{data?.docs.map((product, index) => (
							<CheckoutItem
								key={product.id}
								isLast={index === data.docs.length - 1}
								imageUrl={product.image?.url}
								name={product.name}
								productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
								tenantUrl={generateTenantURL(product.tenant.slug)}
								tenantName={product.tenant.name}
								price={product.price}
								onRemove={() => removeProduct(product.id)}
							/>
						))}
					</div>
				</div>

				{/* Checkout sidebar */}
				<div className="lg:col-span-3">
					<CheckoutSidebar
						total={data?.totalPrice || 0}
						onPurchase={() => purchase.mutate({ productIds, tenantSlug })}
						isCanceled={states.cancel}
						disabled={purchase.isPending}
					/>
				</div>
			</div>
		</div>
	);
};

"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { DEFAULT_LIMIT } from "@/lib/constants";

import { Button } from "@/components/ui/button";

import { ProductCard } from "./product-card";

export const ProductList = () => {
	const trpc = useTRPC();
	const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useSuspenseInfiniteQuery(
			trpc.library.getMany.infiniteQueryOptions(
				{
					limit: DEFAULT_LIMIT,
				},
				{
					getNextPageParam: (lastPage) => {
						return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
					},
				},
			),
		);

	if (data.pages?.[0]?.docs.length === 0) {
		return (
			<div className="flex h-[400px] w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
				<InboxIcon />
				<p className="text-base font-medium">No purchases found</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{data.pages
					.flatMap((page) => page.docs)
					.map((product) => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							imageUrl={product.image?.url}
							tenantSlug={product.tenant.slug}
							tenantImageUrl={product.tenant.image?.url}
							reviewRating={3}
							reviewCount={5}
						/>
					))}
			</div>
			<div className="flex justify-center pt-8">
				{hasNextPage && (
					<Button
						variant="reverse"
						disabled={isFetchingNextPage}
						onClick={() => fetchNextPage()}
						className="bg-white text-base font-medium disabled:opacity-50"
					>
						Load more
					</Button>
				)}
			</div>
		</>
	);
};

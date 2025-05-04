"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

interface ProductListProps {
	category?: string;
}

export const ProductList = ({ category }: ProductListProps) => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.products.getMany.queryOptions({ category }),
	);

	return (
		<div>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

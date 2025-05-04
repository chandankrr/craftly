import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { ProductList } from "@/modules/products/ui/components/product-list";
import { ProductListSkeleton } from "@/modules/products/ui/components/product-list-skelton";

interface CategoryPageProps {
	params: Promise<{
		category: string;
	}>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
	const { category } = await params;

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.products.getMany.queryOptions({
			category,
		}),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<ProductListSkeleton />}>
				<ProductList category={category} />
			</Suspense>
		</HydrationBoundary>
	);
};

export default CategoryPage;

import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";

import { loadProductFilters } from "@/modules/products/search-params";
import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import { ProductList } from "@/modules/products/ui/components/product-list";
import { ProductListSkeleton } from "@/modules/products/ui/components/product-list-skelton";

interface CategoryPageProps {
	params: Promise<{
		category: string;
	}>;
	searchParams: Promise<SearchParams>;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
	const { category } = await params;
	const filters = await loadProductFilters(searchParams);

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.products.getMany.queryOptions({
			...filters,
			category,
		}),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex flex-col gap-4 px-4 py-8 lg:px-12">
				<div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-6 xl:grid-cols-8">
					<div className="lg:col-span-2 xl:col-span-2">
						<ProductFilters />
					</div>
					<div className="lg:col-span-4 xl:col-span-6">
						<Suspense fallback={<ProductListSkeleton />}>
							<ProductList category={category} />
						</Suspense>
					</div>
				</div>
			</div>
		</HydrationBoundary>
	);
};

export default CategoryPage;

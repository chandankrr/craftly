import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";

import { DEFAULT_LIMIT } from "@/lib/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/view/product-list-view";

interface TenantHomePageProps {
	searchParams: Promise<SearchParams>;
	params: Promise<{
		slug: string;
	}>;
}

const TenantHomePage = async ({
	searchParams,
	params,
}: TenantHomePageProps) => {
	const { slug } = await params;
	const filters = await loadProductFilters(searchParams);

	const queryClient = getQueryClient();
	void queryClient.prefetchInfiniteQuery(
		trpc.products.getMany.infiniteQueryOptions({
			...filters,
			tenantSlug: slug,
			limit: DEFAULT_LIMIT,
		}),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductListView tenantSlug={slug} />
		</HydrationBoundary>
	);
};

export default TenantHomePage;

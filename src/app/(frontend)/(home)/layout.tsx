import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";
import { SearchFilters } from "@/modules/home/ui/components/search-filters";
import { SearchFilterSkelton } from "@/modules/home/ui/components/search-filters/search-filter-skelton";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

	return (
		<div className="flex min-h-screen flex-col">
			<Navbar />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<SearchFilterSkelton />}>
					<SearchFilters />
				</Suspense>
			</HydrationBoundary>
			<div className="bg-background flex-1">{children}</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;

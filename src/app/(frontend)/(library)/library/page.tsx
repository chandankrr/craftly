import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { DEFAULT_LIMIT } from "@/lib/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view";

export const dynamic = "force-dynamic";

const LibraryPage = () => {
	const queryClient = getQueryClient();
	void queryClient.prefetchInfiniteQuery(
		trpc.library.getMany.infiniteQueryOptions({ limit: DEFAULT_LIMIT }),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<LibraryView />;
		</HydrationBoundary>
	);
};

export default LibraryPage;

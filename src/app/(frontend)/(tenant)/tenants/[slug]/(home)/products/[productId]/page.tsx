import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { ProductView } from "@/modules/products/ui/views/product-view";
import { ProductViewSkeleton } from "@/modules/products/ui/views/product-view-skelton";

interface ProductPageProps {
	params: Promise<{ productId: string; slug: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
	const { productId, slug } = await params;

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.products.getOne.queryOptions({ id: productId }),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<ProductViewSkeleton />}>
				<ProductView productId={productId} tenantSlug={slug} />
			</Suspense>
		</HydrationBoundary>
	);
};

export default ProductPage;

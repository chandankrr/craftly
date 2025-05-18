import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { ProductView } from "@/modules/library/ui/views/product-view";

interface ProductPageProps {
	params: Promise<{ productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
	const { productId } = await params;

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.library.getOne.queryOptions({ productId }),
	);
	void queryClient.prefetchQuery(
		trpc.reviews.getOne.queryOptions({ productId }),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductView productId={productId} />
		</HydrationBoundary>
	);
};

export default ProductPage;

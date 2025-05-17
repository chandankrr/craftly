import { DEFAULT_LIMIT } from "@/lib/constants";

import { ProductCardSkeleton } from "./product-card-skelton";

export const ProductListSkeleton = () => {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
				<ProductCardSkeleton key={index} />
			))}
		</div>
	);
};

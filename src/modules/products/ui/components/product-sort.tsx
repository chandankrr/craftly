"use client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { useProductFilters } from "../../hooks/use-product-filters";

export const ProductSort = () => {
	const [filters, setFilters] = useProductFilters();

	return (
		<div className="flex items-center gap-2">
			<Button
				onClick={() => setFilters({ sort: "curated" })}
				size="sm"
				variant="noShadow"
				className={cn(
					"rounded-full bg-white hover:bg-white",
					filters.sort !== "curated" &&
						"hover:border-border border-transparent bg-transparent hover:bg-transparent",
				)}
			>
				Curated
			</Button>
			<Button
				onClick={() => setFilters({ sort: "trending" })}
				size="sm"
				variant="noShadow"
				className={cn(
					"rounded-full bg-white hover:bg-white",
					filters.sort !== "trending" &&
						"hover:border-border border-transparent bg-transparent hover:bg-transparent",
				)}
			>
				Trending
			</Button>
			<Button
				onClick={() => setFilters({ sort: "hot_and_new" })}
				size="sm"
				variant="noShadow"
				className={cn(
					"rounded-full bg-white hover:bg-white",
					filters.sort !== "hot_and_new" &&
						"hover:border-border border-transparent bg-transparent hover:bg-transparent",
				)}
			>
				Hot & New
			</Button>
		</div>
	);
};

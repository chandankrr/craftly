"use client";

import { useProductFilters } from "../../hooks/use-product-filters";
import { PriceFilter } from "./price-filter";
import { ProductFilter } from "./product-filter";

export const ProductFilters = () => {
	const [filters, setFilters] = useProductFilters();

	const hasAnyFilter = Object.entries(filters).some(([, value]) => {
		if (typeof value === "string") return value !== "";

		return value !== null;
	});

	const onClear = () => {
		setFilters({
			minPrice: "",
			maxPrice: "",
		});
	};

	const onChange = (key: keyof typeof filters, value: unknown) => {
		setFilters({ ...filters, [key]: value });
	};

	return (
		<div className="rounded-md border bg-white">
			<div className="flex items-center justify-between border-b p-4">
				<p className="font-medium">Filters</p>
				{hasAnyFilter && (
					<button
						onClick={() => onClear()}
						type="button"
						className="cursor-pointer underline"
					>
						Clear
					</button>
				)}
			</div>
			<ProductFilter title="Price">
				<PriceFilter
					minPrice={filters.minPrice}
					maxPrice={filters.maxPrice}
					onMinPriceChange={(value) => onChange("minPrice", value)}
					onMaxPriceChange={(value) => onChange("maxPrice", value)}
				/>
			</ProductFilter>
		</div>
	);
};

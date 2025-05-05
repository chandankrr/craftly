"use client";

import { useProductFilters } from "../../hooks/use-product-filters";
import { PriceFilter } from "./price-filter";
import { ProductFilter } from "./product-filter";
import { TagsFilter } from "./tags-filter.";

export const ProductFilters = () => {
	const [filters, setFilters] = useProductFilters();

	const hasAnyFilter = Object.entries(filters).some(([key, value]) => {
		if (key === "sort") return false;

		if (Array.isArray(value)) return value.length > 0;

		if (typeof value === "string") return value !== "";

		return value !== null;
	});

	const onClear = () => {
		setFilters({
			minPrice: "",
			maxPrice: "",
			tags: [],
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
			<ProductFilter title="Tags" className="border-b-0">
				<TagsFilter
					value={filters.tags}
					onChange={(value) => onChange("tags", value)}
				/>
			</ProductFilter>
		</div>
	);
};

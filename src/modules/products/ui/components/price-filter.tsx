"use client";

import { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { formatAsCurrency } from "../../utils";

interface PriceFilterProps {
	minPrice?: string | null;
	maxPrice?: string | null;
	onMinPriceChange: (value: string) => void;
	onMaxPriceChange: (value: string) => void;
}

export const PriceFilter = ({
	minPrice,
	maxPrice,
	onMinPriceChange,
	onMaxPriceChange,
}: PriceFilterProps) => {
	const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		const numericValue = e.target.value.replace(/[^0-9.]/g, "");
		onMinPriceChange(numericValue);
	};

	const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		const numericValue = e.target.value.replace(/[^0-9.]/g, "");
		onMaxPriceChange(numericValue);
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-2">
				<Label className="text-base font-medium">Minimum price</Label>
				<Input
					type="text"
					placeholder="$0"
					value={minPrice ? formatAsCurrency(minPrice) : ""}
					onChange={handleMinPriceChange}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Label className="text-base font-medium">Maximum price</Label>
				<Input
					type="text"
					placeholder="..."
					value={maxPrice ? formatAsCurrency(maxPrice) : ""}
					onChange={handleMaxPriceChange}
				/>
			</div>
		</div>
	);
};

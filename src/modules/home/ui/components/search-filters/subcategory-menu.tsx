import Link from "next/link";

import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";

interface SubcategoryMenuProps {
	category: CategoriesGetManyOutput[1];
	isOpen: boolean;
}

export const SubcategoryMenu = ({ category, isOpen }: SubcategoryMenuProps) => {
	const backgroundColor = category.color || DEFAULT_BG_COLOR;

	if (
		!isOpen ||
		!category.subcategories ||
		category.subcategories.length === 0
	) {
		return null;
	}

	return (
		<div
			className="absolute z-50"
			style={{
				top: "100%",
				left: 0,
			}}
		>
			{/* Invisible bridge to maintain hover */}
			<div className="h-3 w-60" />

			<div
				style={{
					backgroundColor,
				}}
				className="text-foreground w-60 -translate-x-[2px] -translate-y-[2px] overflow-hidden rounded-md border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
			>
				<div>
					{category.subcategories?.map((subcategory) => (
						<Link
							key={subcategory.slug}
							href={`/${category.slug}/${subcategory.slug}`}
							className="hover:bg-foreground hover:text-secondary-background flex w-full items-center justify-between p-4 text-left font-medium underline"
						>
							{subcategory.name}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

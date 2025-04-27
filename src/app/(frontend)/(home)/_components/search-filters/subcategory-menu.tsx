import Link from "next/link";

import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface SubcategoryMenuProps {
	category: CategoriesGetManyOutput[1];
	isOpen: boolean;
	position: {
		top: number;
		left: number;
	};
}

export const SubcategoryMenu = ({ category, isOpen, position }: SubcategoryMenuProps) => {
	const backgroundColor = category.color || "#F5F5F5";

	if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
		return null;
	}

	return (
		<div
			className="fixed z-50"
			style={{
				top: position.top,
				left: position.left,
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

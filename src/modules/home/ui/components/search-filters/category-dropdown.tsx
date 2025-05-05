"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

import { Button } from "@/components/ui/button";

import { SubcategoryMenu } from "./subcategory-menu";

interface CategoryDropdownProps {
	category: CategoriesGetManyOutput[1];
	isActive?: boolean;
	isNavigationHovered?: boolean;
}

export const CategoryDropdown = ({
	category,
	isActive,
	isNavigationHovered,
}: CategoryDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const onMouseEnter = () => {
		if (category.subcategories) {
			setIsOpen(true);
		}
	};

	const onMouseLeave = () => {
		setIsOpen(false);
	};

	return (
		<div
			className="relative"
			ref={dropdownRef}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<div className="relative">
				<Button
					variant="reverse"
					className={cn(
						"hover:border-border hover:bg-secondary-background h-11 rounded-full border-transparent bg-transparent px-4 text-base",
						isActive &&
							!isNavigationHovered &&
							"border-border bg-secondary-background",
						isOpen &&
							"border-border bg-secondary-background -translate-x-[2px] -translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
					)}
					asChild
				>
					<Link href={`/${category.slug === "all" ? "" : category.slug}`}>
						{category.name}
					</Link>
				</Button>

				{isOpen &&
					category.subcategories &&
					category.subcategories.length > 0 && (
						<div
							className={cn(
								"border-b-border absolute -bottom-3 left-1/2 size-0 -translate-x-1/2 border-r-[10px] border-b-[10px] border-l-[10px] border-r-transparent border-l-transparent opacity-0",
								isOpen && "opacity-100",
							)}
						/>
					)}
			</div>

			<SubcategoryMenu category={category} isOpen={isOpen} />
		</div>
	);
};

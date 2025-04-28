"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { ListFilterIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

import { Button } from "@/components/ui/button";

import { CategoriesSidebar } from "./categories-sidebar";
import { CategoryDropdown } from "./category-dropdown";

interface CategoriesProps {
	data: CategoriesGetManyOutput;
}

export const Categories = ({ data }: CategoriesProps) => {
	const params = useParams();

	const containerRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLDivElement>(null);
	const viewAllRef = useRef<HTMLDivElement>(null);

	const [visibleCount, setVisibleCount] = useState(data.length);
	const [isAnyHovered, setIsAnyHovered] = useState(false);
	const [isSibebarOpen, setIsSibebarOpen] = useState(false);

	const categoryParam = params.category as string | undefined;
	const activeCategory = categoryParam || "all";

	const activeCategoryIndex = data.findIndex(
		(category) => category.slug === activeCategory,
	);
	const isActiveCategoryHidden =
		activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

	useEffect(() => {
		const calculateVisible = () => {
			if (!containerRef.current || !measureRef.current || !viewAllRef.current)
				return;

			const containerWidth = containerRef.current.offsetWidth;
			const viewAllWidth = viewAllRef.current.offsetWidth;
			const availableWidth = containerWidth - viewAllWidth;

			const items = Array.from(measureRef.current.children);
			let totalWidth = 0;
			let visible = 0;

			for (const item of items) {
				const width = item.getBoundingClientRect().width;

				if (totalWidth + width > availableWidth) break;
				totalWidth += width;
				visible++;
			}

			setVisibleCount(visible);
		};

		const resizeObserver = new ResizeObserver(calculateVisible);
		resizeObserver.observe(containerRef.current!);

		return () => resizeObserver.disconnect();
	}, [data.length]);

	return (
		<div className="relative w-full">
			{/* Hidden div to measure all items */}
			<div
				ref={measureRef}
				className="pointer-events-none absolute flex opacity-0"
				style={{
					position: "fixed",
					top: -9999,
					left: -9999,
				}}
			>
				{data.map((category) => {
					return (
						<div key={category.id}>
							<CategoryDropdown
								category={category}
								isActive={activeCategory === category.slug}
								isNavigationHovered={false}
							/>
						</div>
					);
				})}
			</div>

			{/* Visible items */}
			<div
				ref={containerRef}
				onMouseEnter={() => setIsAnyHovered(true)}
				onMouseLeave={() => setIsAnyHovered(false)}
				className="flex flex-nowrap items-center"
			>
				{data.slice(0, visibleCount).map((category) => (
					<div key={category.id}>
						<CategoryDropdown
							category={category}
							isActive={activeCategory === category.slug}
							isNavigationHovered={isAnyHovered}
						/>
					</div>
				))}

				<div ref={viewAllRef} className="shrink-0">
					<Button
						variant="reverse"
						className={cn(
							"hover:border-border hover:bg-secondary-background h-11 rounded-full border-transparent bg-transparent px-4",
							isActiveCategoryHidden &&
								!isAnyHovered &&
								"border-border bg-secondary-background",
						)}
						onClick={() => setIsSibebarOpen(true)}
					>
						View All <ListFilterIcon className="ml-2 size-4" />
					</Button>
				</div>
			</div>

			{/* Categories sidebar */}
			<CategoriesSidebar open={isSibebarOpen} onOpenChange={setIsSibebarOpen} />
		</div>
	);
};

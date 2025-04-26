import { useState } from "react";
import { useRouter } from "next/navigation";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { CustomCategory } from "../../types";

interface CategoriesSidebarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	data: CustomCategory[]; // TODO: remove this later
}

export const CategoriesSidebar = ({ open, onOpenChange, data }: CategoriesSidebarProps) => {
	const router = useRouter();

	const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<CustomCategory | null>(null);

	// If we have parent categories, show those, otherwise show root categories
	const currentCategories = parentCategories ?? data ?? [];

	const backgroundColor = selectedCategory?.color || "#ffffff";

	const handleOpenChange = (open: boolean) => {
		setParentCategories(null);
		setSelectedCategory(null);
		onOpenChange(open);
	};

	const handleCategoryClick = (category: CustomCategory) => {
		if (category.subcategories && category.subcategories.length > 0) {
			setParentCategories(category.subcategories as CustomCategory[]);
			setSelectedCategory(category);
		} else {
			// This a leaf category (no subcategories)
			if (parentCategories && selectedCategory) {
				// This is a subcategory - navigate to /category/subcategory
				router.push(`/${selectedCategory.slug}/${category.slug}`);
			} else {
				// This is a main category - navigate to /category
				if (category.slug === "all") {
					router.push("/");
				} else {
					router.push(`/${category.slug}`);
				}
			}

			handleOpenChange(false);
		}
	};

	const handleBackClick = () => {
		if (parentCategories) {
			setParentCategories(null);
			setSelectedCategory(null);
		}
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent
				side="left"
				className="p-0 transition-none"
				style={{
					backgroundColor,
				}}
			>
				<SheetHeader className="border-b p-4">
					<SheetTitle>Categories</SheetTitle>
				</SheetHeader>
				<ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
					{parentCategories && (
						<button
							onClick={handleBackClick}
							className="hover:bg-foreground hover:text-secondary-background flex w-full items-center p-4 text-left text-base font-medium"
						>
							<ChevronLeftIcon className="mr-2 size-4" /> Back
						</button>
					)}
					{currentCategories.map((category) => (
						<button
							key={category.slug}
							onClick={() => handleCategoryClick(category)}
							className="hover:bg-foreground hover:text-secondary-background flex w-full items-center justify-between p-4 text-left text-base font-medium"
						>
							{category.name}
							{category.subcategories && category.subcategories.length > 0 && (
								<ChevronRightIcon className="size-4" />
							)}
						</button>
					))}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};

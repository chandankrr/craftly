"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { useProductFilters } from "@/modules/products/hooks/use-product-filters";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CategoriesSidebar } from "./categories-sidebar";

interface SearchInputProps {
	disabled?: boolean;
}

export const SearchInput = ({ disabled }: SearchInputProps) => {
	const [filters, setFilters] = useProductFilters();
	const [searchValue, setSearchValue] = useState(filters.search);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const trpc = useTRPC();
	const session = useQuery(trpc.auth.session.queryOptions());

	// Debounce search value
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setFilters({ search: searchValue });
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchValue, setFilters]);

	return (
		<div className="flex w-full items-center gap-2">
			<div className="relative w-full">
				<SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
				<Input
					className="h-12 pl-8"
					placeholder="Search products"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					disabled={disabled}
				/>
			</div>

			<Button
				variant="noShadow"
				className="bg-secondary-background flex size-12 shrink-0 lg:hidden"
				onClick={() => setIsSidebarOpen(true)}
			>
				<ListFilterIcon />
			</Button>

			{session.data?.user && (
				<Button
					variant="reverse"
					className="bg-secondary-background flex h-12 shrink-0"
					asChild
				>
					<Link prefetch href="/library">
						<BookmarkCheckIcon />{" "}
						<span className="hidden lg:block">Library</span>
					</Link>
				</Button>
			)}

			<CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
		</div>
	);
};

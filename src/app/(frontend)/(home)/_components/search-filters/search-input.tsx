"use client";

import { useState } from "react";

import { ListFilterIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CategoriesSidebar } from "./categories-sidebar";

interface SearchInputProps {
	disabled?: boolean;
}

export const SearchInput = ({ disabled }: SearchInputProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex w-full items-center gap-2">
			<div className="relative w-full">
				<SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
				<Input className="h-12 pl-8" placeholder="Search products" disabled={disabled} />
			</div>

			<Button
				variant="noShadow"
				className="bg-secondary-background flex size-12 shrink-0 lg:hidden"
				onClick={() => setIsSidebarOpen(true)}
			>
				<ListFilterIcon />
			</Button>

			{/* TODO: Add library button */}

			<CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
		</div>
	);
};

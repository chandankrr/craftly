"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Categories } from "./categories";
import { SearchInput } from "./search-input";

export const SearchFilters = () => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

	return (
		<div
			className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12"
			style={{
				backgroundColor: "#F5F5F5",
			}}
		>
			<SearchInput />
			<div className="hidden lg:block">
				<Categories data={data} />
			</div>
		</div>
	);
};

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { DEFAULT_LIMIT } from "@/lib/constants";

import { Checkbox } from "@/components/ui/checkbox";

interface TagsFilterProps {
	value?: string[] | null;
	onChange: (value: string[]) => void;
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
	const trpc = useTRPC();
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery(
			trpc.tags.getMany.infiniteQueryOptions(
				{
					limit: DEFAULT_LIMIT,
				},
				{
					getNextPageParam: (lastPage) => {
						return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
					},
				},
			),
		);

	const onClick = (tag: string) => {
		if (value?.includes(tag)) {
			onChange(value.filter((t) => t !== tag));
		} else {
			onChange([...(value || []), tag]);
		}
	};

	return (
		<div className="flex flex-col gap-y-2">
			{isLoading ? (
				<div className="flex items-center justify-center p-4">
					<LoaderIcon className="size-4 animate-spin" />
				</div>
			) : (
				data?.pages.map((page) =>
					page.docs.map((tag) => (
						<div
							key={tag.id}
							className="flex cursor-pointer items-center justify-between"
							onChange={() => onClick(tag.name)}
						>
							<p className="font-medium">{tag.name}</p>
							<Checkbox
								checked={value?.includes(tag.name)}
								onCheckedChange={() => onClick(tag.name)}
								className="rounded"
							/>
						</div>
					)),
				)
			)}
			{hasNextPage && (
				<button
					disabled={isFetchingNextPage}
					onClick={() => fetchNextPage()}
					className="cursor-pointer justify-start text-start font-medium underline disabled:opacity-50"
				>
					Load more...
				</button>
			)}
		</div>
	);
};

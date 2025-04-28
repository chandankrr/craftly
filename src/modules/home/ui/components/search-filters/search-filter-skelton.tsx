import { SearchInput } from "./search-input";

export const SearchFilterSkelton = () => {
	return (
		<div
			className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12"
			style={{
				backgroundColor: "#F5F5F5",
			}}
		>
			<SearchInput disabled />
			<div className="hidden lg:block">
				<div className="h-11" />
			</div>
		</div>
	);
};

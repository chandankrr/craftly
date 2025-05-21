import { ArrowLeftIcon } from "lucide-react";

export const ProductViewSkeleton = () => {
	return (
		<div className="min-h-screen bg-white">
			<nav className="w-full border-b bg-[#f4f4f0] p-4">
				<div className="flex items-center gap-2">
					<ArrowLeftIcon className="size-4" />
					<span className="text-base font-medium">Back to library</span>
				</div>
			</nav>
		</div>
	);
};

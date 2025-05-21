import Image from "next/image";

export const ProductViewSkeleton = () => {
	return (
		<div className="px-4 py-10 lg:px-12">
			<div className="overflow-hidden rounded-sm border bg-white">
				<div className="relative aspect-[3.9] border-b">
					<Image
						src="/placeholder.png"
						alt="Placeholder"
						fill
						className="object-cover"
					/>
				</div>
			</div>
			;
		</div>
	);
};

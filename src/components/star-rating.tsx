import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface StartRatingProps {
	rating: number;
	clasName?: string;
	iconClassName?: string;
	text?: string;
}

export const StarRating = ({
	rating,
	clasName,
	iconClassName,
	text,
}: StartRatingProps) => {
	const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));

	return (
		<div className={cn("flex items-center gap-x-1", clasName)}>
			{Array.from({ length: MAX_RATING }).map((_, index) => (
				<StarIcon
					key={index}
					className={cn(
						"size-4",
						index < safeRating ? "fill-black" : "",
						iconClassName,
					)}
				/>
			))}
			{text && <p>{text}</p>}
		</div>
	);
};

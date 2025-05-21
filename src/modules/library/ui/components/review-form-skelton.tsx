import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarPicker } from "@/components/star-picker";

export const ReviewFormSkeleton = () => {
	return (
		<div className="flex flex-col gap-y-4">
			<p className="font-medium">Liked it? Give it a rating</p>
			<StarPicker disabled />
			<Textarea placeholder="Want to leave a written review?" disabled />
			<Button
				variant="reverse"
				disabled
				type="button"
				className="h-12 w-fit bg-black text-white hover:bg-pink-400 hover:text-black"
			>
				Post review
			</Button>
		</div>
	);
};

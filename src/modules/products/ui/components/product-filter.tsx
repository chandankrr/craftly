import { useState } from "react";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProductFilterProps {
	title: string;
	className?: string;
	children?: React.ReactNode;
}

export const ProductFilter = ({
	title,
	className,
	children,
}: ProductFilterProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

	return (
		<div className={cn("flex flex-col gap-2 border-b p-4", className)}>
			<div
				onClick={() => setIsOpen((current) => !current)}
				className="flex cursor-pointer items-center justify-between"
			>
				<p className="font-medium">{title}</p>
				<Icon className="size-5" />
			</div>
			{isOpen && children}
		</div>
	);
};

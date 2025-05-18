"use client";

import Image from "next/image";
import Link from "next/link";

import { StarIcon } from "lucide-react";

interface ProductCardProps {
	id: string;
	name: string;
	imageUrl?: string | null;
	tenantSlug: string;
	tenantImageUrl?: string | null;
	reviewRating: number;
	reviewCount: number;
}

export const ProductCard = ({
	id,
	name,
	imageUrl,
	tenantSlug,
	tenantImageUrl,
	reviewRating,
	reviewCount,
}: ProductCardProps) => {
	return (
		<Link prefetch href={`/library/${id}`}>
			<div className="flex h-full flex-col overflow-hidden rounded-md border bg-white transition-shadow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
				<div className="relative aspect-square">
					<Image
						src={imageUrl || "/placeholder.png"}
						alt={name}
						fill
						className="object-cover"
					/>
				</div>
				<div className="flex flex-1 flex-col gap-3 border-t p-4">
					<h2 className="line-clamp-4 text-lg font-medium">{name}</h2>
					<div className="flex items-center gap-2">
						{tenantImageUrl && (
							<Image
								src={tenantImageUrl}
								alt={tenantSlug}
								width={16}
								height={16}
								className="size-[16px] shrink-0 rounded-full border"
							/>
						)}
						<p className="text-sm font-medium underline">{tenantSlug}</p>
					</div>
					{reviewCount > 0 && (
						<div className="flex items-center gap-1">
							<StarIcon className="size-3.5 fill-black" />
							<p className="text-sm font-medium">
								{reviewRating} ({reviewCount})
							</p>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
};

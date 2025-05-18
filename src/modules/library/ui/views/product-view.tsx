"use client";

import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { ReviewSidebar } from "../components/review-sidebar";

interface ProductViewProps {
	productId: string;
}

export const ProductView = ({ productId }: ProductViewProps) => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.library.getOne.queryOptions({ productId }),
	);

	return (
		<div className="min-h-screen bg-white">
			<nav className="w-full border-b bg-[#f4f4f0] p-4">
				<Link prefetch href="/library" className="flex items-center gap-2">
					<ArrowLeftIcon className="size-4" />
					<span className="text-base font-medium">Back to library</span>
				</Link>
			</nav>
			<header className="border-b bg-[#f4f4f0] py-8">
				<div className="mx-auto max-w-(--breakpoint-xl) px-4 lg:px-12">
					<h1 className="text-[40px] font-medium">{data.name}</h1>
				</div>
			</header>

			<section className="mx-auto max-w-(--breakpoint-xl) px-4 py-10 lg:px-12">
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-7 lg:gap-16">
					<div className="lg:col-span-2">
						<div className="gap-4 rounded-md border bg-white p-4">
							<ReviewSidebar productId={productId} />
						</div>
					</div>

					<div className="lg:col-span-5">
						{data.content ? (
							<p className="font-medium text-neutral-500 italic">
								{data.content}
							</p>
						) : (
							<p className="font-medium text-neutral-500 italic">
								No special content
							</p>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

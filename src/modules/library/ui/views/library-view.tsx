import { Suspense } from "react";
import Link from "next/link";

import { ArrowLeftIcon } from "lucide-react";

import { ProductList } from "../components/product-list";
import { ProductListSkeleton } from "../components/product-list-skelton";

export const LibraryView = () => {
	return (
		<div className="min-h-screen bg-white">
			<nav className="w-full border-b bg-[#f4f4f0] p-4">
				<Link prefetch href="/" className="flex items-center gap-2">
					<ArrowLeftIcon className="size-4" />
					<span className="text-base font-medium">Continue shopping</span>
				</Link>
			</nav>
			<header className="border-b bg-[#f4f4f0] py-8">
				<div className="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-y-4 px-4 lg:px-12">
					<h1 className="text-[40px] font-medium">Library</h1>
					<p className="font-medium">Your purchases and reviews</p>
				</div>
			</header>

			<section className="mx-auto max-w-(--breakpoint-xl) px-4 py-10 lg:px-12">
				<Suspense fallback={<ProductListSkeleton />}>
					<ProductList />
				</Suspense>
			</section>
		</div>
	);
};

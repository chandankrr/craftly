import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar } from "@/modules/tenants/ui/components/navbar";
import { NavbarSkeleton } from "@/modules/tenants/ui/components/navbar-skelton";

interface TenantHomeLayoutProps {
	children: React.ReactNode;
	params: Promise<{
		slug: string;
	}>;
}

const TenantHomeLayout = async ({
	children,
	params,
}: TenantHomeLayoutProps) => {
	const { slug } = await params;

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));

	return (
		<div className="flex min-h-screen flex-col bg-[#f4f4f0]">
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<NavbarSkeleton />}>
					<Navbar slug={slug} />
				</Suspense>
			</HydrationBoundary>
			<div className="flex-1">
				<div className="mx-auto h-full max-w-(--breakpoint-xl)">{children}</div>
			</div>
			<Footer />
		</div>
	);
};

export default TenantHomeLayout;

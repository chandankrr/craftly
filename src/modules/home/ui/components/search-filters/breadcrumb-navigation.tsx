import Link from "next/link";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavigationProps {
	activeCategory?: string | null;
	activeCategoryName?: string | null;
	activeSubcategoryName?: string | null;
}

export const BreadcrumbNavigation = ({
	activeCategory,
	activeCategoryName,
	activeSubcategoryName,
}: BreadcrumbNavigationProps) => {
	if (!activeCategoryName || activeCategory === "all") return null;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{activeSubcategoryName ? (
					<>
						<BreadcrumbItem>
							<BreadcrumbLink
								className="text-foreground text-xl font-medium underline"
								asChild
							>
								<Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="text-xl font-medium">
							/
						</BreadcrumbSeparator>
						<Breadcrumb>
							<BreadcrumbPage className="text-xl font-medium">
								{activeSubcategoryName}
							</BreadcrumbPage>
						</Breadcrumb>
					</>
				) : (
					<Breadcrumb>
						<BreadcrumbPage className="text-xl font-medium">
							{activeCategoryName}
						</BreadcrumbPage>
					</Breadcrumb>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

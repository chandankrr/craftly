import configPromise from "@payload-config";
import { getPayload } from "payload";

import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";
import { SearchFilters } from "./_components/search-filters";

import { Category } from "@/payload-types";
import { CustomCategory } from "./types";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
	const payload = await getPayload({
		config: configPromise,
	});

	const data = await payload.find({
		collection: "categories",
		depth: 1, // Populate subcategories, subcategories[0] will be a type of "Category"
		pagination: false,
		where: {
			parent: {
				exists: false,
			},
		},
		sort: "name",
	});

	const formatedData: CustomCategory[] = data.docs.map((doc) => ({
		...doc,
		subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
			...(doc as Category),
			subcategories: undefined,
		})),
	}));

	return (
		<div className="flex min-h-screen flex-col">
			<Navbar />
			<SearchFilters data={formatedData} />
			<div className="bg-background flex-1">{children}</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;

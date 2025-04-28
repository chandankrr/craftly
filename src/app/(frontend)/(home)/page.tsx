"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

const HomePage = () => {
	const trpc = useTRPC();
	const session = useQuery(trpc.auth.session.queryOptions());

	return <div>{JSON.stringify(session.data?.user, null, 2)}</div>;
};

export default HomePage;

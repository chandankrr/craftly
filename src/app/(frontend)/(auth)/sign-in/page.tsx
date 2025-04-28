import { redirect } from "next/navigation";

import { caller } from "@/trpc/server";

import { SignInView } from "@/modules/auth/ui/view/sign-in-view";

const SignInPage = async () => {
	const session = await caller.auth.session();

	if (session.user) {
		redirect("/");
	}

	return <SignInView />;
};

export default SignInPage;

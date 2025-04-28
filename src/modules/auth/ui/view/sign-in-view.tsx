"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { loginSchema } from "../../schemas";

const poppins = Poppins({
	subsets: ["latin"],
	weight: "700",
});

export const SignInView = () => {
	const router = useRouter();

	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const login = useMutation(
		trpc.auth.login.mutationOptions({
			onError: (error) => {
				toast.error(error.message);
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
				router.push("/");
			},
		}),
	);

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof loginSchema>) => {
		login.mutate(values);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-5">
			<div className="hide-scrollbar h-screen w-full overflow-y-auto bg-[#f4f4f0] lg:col-span-2">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 lg:p-16">
						<div className="mb-8 flex items-center justify-between">
							<Link href="/">
								<span className={cn("text-2xl font-semibold", poppins.className)}>craftly</span>
							</Link>
							<Button
								variant="noShadow"
								size="sm"
								className="border-none bg-transparent text-base underline"
								asChild
							>
								<Link prefetch href="/sign-up">
									Sign up
								</Link>
							</Button>
						</div>
						<h1 className="text-4xl font-medium">Welcome back to craftly.</h1>

						{/* Form fields */}
						<FormField
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base">Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base">Password</FormLabel>
									<FormControl>
										<Input {...field} type="password" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={login.isPending}
							variant="reverse"
							size="lg"
							className="bg-foreground text-secondary-background hover:text-foreground hover:bg-pink-400"
						>
							Log in
						</Button>
					</form>
				</Form>
			</div>
			<div
				className="hidden h-screen w-full lg:col-span-3 lg:block"
				style={{
					backgroundImage: "url('/auth-bg.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
		</div>
	);
};

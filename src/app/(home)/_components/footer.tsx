export const Footer = () => {
	return (
		<footer className="flex justify-between border-t p-6 font-medium">
			<div className="text-main-foreground">
				&copy; {new Date().getFullYear()} Craftly. All rights reserved.
			</div>
			<div className="text-main-foreground flex flex-col items-center gap-2 underline underline-offset-1 md:flex-row md:gap-8">
				<p className="cursor-pointer">Privacy Policy</p>
				<p className="cursor-pointer">Terms of Service</p>
			</div>
		</footer>
	);
};

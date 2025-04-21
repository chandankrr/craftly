import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen flex-col">
			<Navbar />
			<div className="bg-background flex-1">{children}</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;

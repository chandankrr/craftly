import { CheckoutView } from "@/modules/checkout/ui/view/checkout-view";

interface CheckoutPageProps {
	params: Promise<{ slug: string }>;
}

const CheckoutPage = async ({ params }: CheckoutPageProps) => {
	const { slug } = await params;

	return <CheckoutView tenantSlug={slug} />;
};

export default CheckoutPage;

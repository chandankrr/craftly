export const formatAsCurrency = (value: string) => {
	const numbericValue = value.replace(/[^0-9.]/g, "");

	const parts = numbericValue.split(".");
	const formattedValue =
		parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");

	if (!formattedValue) return "";

	const numberValue = parseFloat(formattedValue);
	if (isNaN(numberValue)) return "";

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(numberValue);
};

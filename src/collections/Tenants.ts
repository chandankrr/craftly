import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
	slug: "tenants",
	admin: {
		useAsTitle: "slug",
	},
	fields: [
		{
			name: "name",
			required: true,
			type: "text",
			label: "Store Name",
			admin: {
				description: "This is the name of the store (e.g. John's Store)",
			},
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			index: true,
			admin: {
				description:
					"This is the subdomain for the store (e.g. [slug].craftly.com)",
			},
		},
		{
			name: "image",
			type: "upload",
			relationTo: "media",
		},
		{
			name: "stripeAccountId",
			type: "text",
			required: true,
			admin: {
				readOnly: true,
			},
		},
		{
			name: "stripeDetialsSubmitted",
			type: "checkbox",
			admin: {
				readOnly: true,
				description:
					"You cannot create products until you submit your stripe details",
			},
		},
	],
};

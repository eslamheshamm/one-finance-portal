/** @type {import('next').NextConfig} */
const nextConfig = {
	swcMinify: false, // it should be false by default
	async headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: "/api/pdf",
				headers: [
					{
						key: "Content-Type",
						value: "application/pdf",
					},
				],
			},
		];
	},
};

module.exports = nextConfig;

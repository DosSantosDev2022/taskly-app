import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
			},
			// Adicione outros domínios aqui se precisar
		],
	},
};

export default nextConfig;

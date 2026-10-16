import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.imgur.com",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
};

export default nextConfig;

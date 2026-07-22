import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for 3D assets
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },

  // Transpile Three.js ecosystem for tree-shaking
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Enable Turbopack (default in Next.js 16)
  turbopack: {},

  // Webpack configuration for GLB/GLTF/HDR assets (used in production builds)
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|hdr)$/,
      type: "asset/resource",
    });
    return config;
  },

  // Headers for cross-origin isolation (SharedArrayBuffer for Draco)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;

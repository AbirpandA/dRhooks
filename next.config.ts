import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next';

const nextConfig: NextConfig = {
  /* config options here */
};

const withMDX = createMDX();
const finalConfig = withMDX(nextConfig);
// Strip Turbopack options since it crashes Next 16 strict validation
if (finalConfig.turbopack) {
  delete finalConfig.turbopack;
}
export default finalConfig;

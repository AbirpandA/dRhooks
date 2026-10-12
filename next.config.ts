import type { NextConfig } from "next";

// Doc URLs that changed when pages moved next to their source.
const renamedDocs = {
  bounce_button: "bounce-button",
  loading_swap: "loading-swap",
  prompt_input: "prompt-input",
} as const;

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(renamedDocs).map(([from, to]) => ({
      source: `/docs/components/${from}`,
      destination: `/docs/components/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { q } from "motion/react-client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends:["next/core-web-vitals", "next/typescript","prettier"],
    rules: {
      semi: ["error"],
      quotes: ["error", "double"],
      "prefer-arrow-callbacks": ["error"],
      "prefer-template": ["error"],
    }
  }),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;

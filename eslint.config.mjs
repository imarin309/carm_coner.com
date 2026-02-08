import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { flat as mdxFlat, flatCodeBlocks as mdxFlatCodeBlocks } from "eslint-plugin-mdx";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  mdxFlat,
  mdxFlatCodeBlocks,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

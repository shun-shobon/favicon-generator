import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import { resolve } from "node:path";

import tsconfig from "./tsconfig.json" assert { type: "json" };

const alias = Object.fromEntries(
  Object.entries(tsconfig.compilerOptions.paths).map(([key, value]) => [
    key.replace("/*", ""),
    resolve(
      __dirname,
      tsconfig.compilerOptions.baseUrl,
      value[0]!.replace("/*", ""),
    ),
  ]),
);

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  resolve: {
    alias,
  },
  build: {
    target: "esnext",
  },
});

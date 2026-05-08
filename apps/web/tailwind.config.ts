import type { Config } from "tailwindcss";
import { tailwindBase } from "../../packages/config/tailwind/base.js";

const config = {
  content: ["./app/**/*.{ts,tsx}", "../../packages/design-system/src/**/*.{ts,tsx}"],
  theme: tailwindBase.theme,
  plugins: tailwindBase.plugins
} as unknown as Config;

export default config;

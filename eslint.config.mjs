import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build/codegen scripts are not app code
    "scripts/**",
  ]),
  // Project-level rule overrides
  {
    rules: {
      // The set-state-in-effect rule flags legitimate React patterns:
      //   – setMounted(true) in Loader (SSR hydration guard)
      //   – setScrolled(scrollY.get()) on mount (initial value from motion value)
      //   – setOpenMenu/setMobileOpen on pathname change (route-reset)
      // Downgrade to warn so CI doesn't break; these are intentional.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;

import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import prettierRecommended from "eslint-plugin-prettier/recommended"

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  prettierRecommended,
  {
    rules: {
      // Options are read from .prettierrc.json (single source of truth).
      "prettier/prettier": "error",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**"]),
])

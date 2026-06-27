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
      "prettier/prettier": [
        "error",
        {
          printWidth: 80,
          tabWidth: 2,
          doubleQuote: true,
          trailingComma: "all",
          arrowParens: "always",
          semi: false,
          endOfLine: "auto",
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**"]),
])

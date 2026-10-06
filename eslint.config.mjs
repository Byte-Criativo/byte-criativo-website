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
  // .claude/worktrees abriga árvores de trabalho de agentes (com node_modules
  // próprio); nunca é código do projeto.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    ".claude/worktrees/**",
  ]),
])

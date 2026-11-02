import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["assets/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: [
      "app.js",
      "audience.js",
      "content.js",
      "data.js",
      "motion.js",
      "video-library.js",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

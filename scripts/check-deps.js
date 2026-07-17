/**
 * Fail fast with a clear message when private deps required for build are missing.
 */
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");

function fail(message) {
  console.error("\n[check-deps] Build cannot continue:\n");
  console.error(`  ${message}\n`);
  process.exit(1);
}

let webawesomePath;
try {
  webawesomePath = require.resolve("@web.awesome.me/webawesome-pro/package.json");
} catch {
  fail(
    [
      "Missing dependency @web.awesome.me/webawesome-pro.",
      "This is a private package from Cloudsmith.",
      "",
      "Set WEBAWESOME_NPM_TOKEN, then reinstall:",
      "  export WEBAWESOME_NPM_TOKEN=your_token_here",
      "  pnpm install",
      "",
      "See .npmrc.example and .env.example.",
    ].join("\n  "),
  );
}

const cssFiles = [
  "dist/styles/themes/default.css",
  "dist/styles/native.css",
  "dist/styles/utilities.css",
];

for (const file of cssFiles) {
  const full = resolve(webawesomePath, "..", file);
  if (!existsSync(full)) {
    fail(`Web Awesome package is incomplete (missing ${file}). Re-run: pnpm install`);
  }
}

console.log("[check-deps] @web.awesome.me/webawesome-pro OK");

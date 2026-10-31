#!/usr/bin/env node
// Builds the CSS entry points into dist/.
// Readable files keep the source text exactly (token values stay as written);
// lightningcss validates every entry and produces the minified vendored bundle.
import { bundle, browserslistToTargets } from "lightningcss";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const targets = browserslistToTargets(["chrome >= 90", "safari >= 14", "firefox >= 90", "samsung >= 15"]);

/** Inlines @import "./x.css" lines, keeping every other byte as written. */
function concat(file, seen = new Set()) {
  if (seen.has(file)) return "";
  seen.add(file);
  return readFileSync(file, "utf8").replace(/^@import\s+"(\.\/[^"]+)";\s*$/gm, (_, rel) => concat(join(dirname(file), rel), seen).trimEnd());
}

const readable = [
  ["src/css/tokens.css", "dist/tokens.css"],
  ["src/css/base.css", "dist/base.css"],
  ["src/css/footer.css", "dist/footer.css"],
  ["src/css/motion.css", "dist/motion.css"],
];

mkdirSync("dist", { recursive: true });
for (const [from, to] of readable) {
  bundle({ filename: from, targets, errorRecovery: false }); // throws on invalid CSS
  const code = concat(from).trimEnd() + "\n";
  writeFileSync(to, code);
  console.log(`${to} ${code.length} bytes`);
}
const min = bundle({ filename: "src/css/base.css", minify: true, targets }).code;
writeFileSync("dist/kultura-house-kit.css", min);
console.log(`dist/kultura-house-kit.css ${min.length} bytes (minified)`);
copyFileSync("src/ecosystem.json", "dist/ecosystem.json");

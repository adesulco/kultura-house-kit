#!/usr/bin/env node
// Fails when a tracked file, file name or (with --commits <range>) a commit message
// names a code tool or assistant. Terms are stored encoded so this file stays clean.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const TERMS = [
  "Y2xhdWRl", "YW50aHJvcGlj", "b3BlbmFp", "Y2hhdGdwdA==", "Y29waWxvdA==",
  "Z2VuZXJhdGVkIHdpdGg=", "YWkgYXNzaXN0YW50", "bGFuZ3VhZ2UgbW9kZWw=", "Y29kZXg=",
].map((t) => Buffer.from(t, "base64").toString("utf8"));
const pattern = new RegExp(`\\b(${TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "i");
const SKIP = [/^pnpm-lock\.yaml$/, /\.(png|jpe?g|webp|avif|ico|woff2?)$/i];

const problems = [];
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n").filter(Boolean);
for (const file of files) {
  if (pattern.test(file)) problems.push(`file name: ${file}`);
  if (SKIP.some((re) => re.test(file))) continue;
  let text;
  try { text = readFileSync(file, "utf8"); } catch { continue; }
  text.split("\n").forEach((line, i) => {
    if (pattern.test(line)) problems.push(`${file}:${i + 1}`);
  });
}

const rangeIndex = process.argv.indexOf("--commits");
if (rangeIndex > -1 && process.argv[rangeIndex + 1]) {
  const log = execFileSync("git", ["log", "--format=%H%n%B%n--end--", process.argv[rangeIndex + 1]], { encoding: "utf8" });
  for (const block of log.split("--end--")) {
    const [sha, ...body] = block.trim().split("\n");
    if (sha && pattern.test(body.join("\n"))) problems.push(`commit message: ${sha.slice(0, 8)}`);
  }
}

if (problems.length) {
  console.error("Naming guard: remove tool or assistant names from:\n" + problems.map((p) => `  ${p}`).join("\n"));
  process.exit(1);
}
console.log(`Naming guard: ${files.length} files clean.`);

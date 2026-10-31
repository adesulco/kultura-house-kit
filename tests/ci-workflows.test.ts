// Workflow lint (CI standard rule F0). Reads every workflow and fails on the patterns
// that double-bill, hang, or open a merge hole.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const DIR = join(process.cwd(), ".github", "workflows");
// Workflows that hold required checks (branch protection): no label events allowed.
const REQUIRED_CHECK_WORKFLOWS = ["ci.yml"];

type Job = { "runs-on"?: unknown; "timeout-minutes"?: unknown; uses?: string; steps?: { run?: string; uses?: string }[] };
type Workflow = { on?: Record<string, unknown> | string | string[]; concurrency?: unknown; jobs?: Record<string, Job> };

const files = readdirSync(DIR).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));
const load = (f: string) => parse(readFileSync(join(DIR, f), "utf8")) as Workflow;
const triggers = (w: Workflow): Record<string, unknown> => {
  if (!w.on) return {};
  if (typeof w.on === "string") return { [w.on]: null };
  if (Array.isArray(w.on)) return Object.fromEntries(w.on.map((k) => [k, null]));
  return w.on;
};

describe("workflow lint", () => {
  it("finds workflow files", () => expect(files.length).toBeGreaterThan(0));

  for (const file of files) {
    describe(file, () => {
      const wf = load(file);
      const on = triggers(wf);
      const pr = on.pull_request as { types?: string[]; paths?: unknown; "paths-ignore"?: unknown } | null | undefined;
      const push = on.push as { branches?: string[] } | null | undefined;

      it("never pairs push on every branch with pull_request", () => {
        const allBranches = push !== undefined && (push === null || !push.branches || push.branches.includes("**") || push.branches.includes("*"));
        expect("pull_request" in on && allBranches).toBe(false);
      });

      it("has concurrency when triggered by pull_request", () => {
        if ("pull_request" in on) expect(wf.concurrency).toBeTruthy();
      });

      it("lists pull_request types explicitly", () => {
        if ("pull_request" in on) expect(pr?.types).toEqual(expect.arrayContaining(["opened", "synchronize", "reopened", "ready_for_review"]));
      });

      it("has no paths filters under pull_request", () => {
        expect(pr && (pr.paths || pr["paths-ignore"])).toBeFalsy();
      });

      it("has no label events in a required-check workflow", () => {
        if (!REQUIRED_CHECK_WORKFLOWS.includes(file)) return;
        expect(pr?.types ?? []).not.toContain("labeled");
        expect(pr?.types ?? []).not.toContain("unlabeled");
      });

      for (const [name, job] of Object.entries(wf.jobs ?? {})) {
        it(`job ${name} has timeout-minutes (or is a reusable call)`, () => {
          if (job.uses) return;
          expect(typeof job["timeout-minutes"]).toBe("number");
        });
        it(`job ${name} runs on ubuntu only`, () => {
          if (job.uses) return;
          expect(String(job["runs-on"])).toMatch(/^ubuntu-/);
        });
        it(`job ${name} builds images only through build-push-action`, () => {
          for (const step of job.steps ?? []) expect(step.run ?? "").not.toMatch(/docker build\b/);
        });
      }
    });
  }
});

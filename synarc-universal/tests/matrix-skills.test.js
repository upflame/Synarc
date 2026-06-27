"use strict";
/**
 * Synarc Universal — skill shape matrix (~300 cases).
 *
 * For every skill in skills/<id>/, run a battery of shape/quality assertions.
 * Split into its own file so the test runner does not have to register all
 * 1,000+ matrix cases in a single module.
 */

const test   = require("node:test");
const assert = require("node:assert/strict");
const fs     = require("node:fs");
const path   = require("node:path");
const os     = require("node:os");

const ROOT = path.resolve(__dirname, "..");
const H = require("./matrix-helpers.cjs");
const skills = H.discoverSkills();
// Generator 7: skillShapeMatrix
// ---------------------------------------------------------------------------
// Matrix summary
// ---------------------------------------------------------------------------


const QUALITY_CHECKS = [
  { name: "has SKILL.md",        check: (id, dir) => fs.existsSync(path.join(dir, "SKILL.md")) },
  { name: "SKILL.md non-empty",  check: (id, dir) => { try { return fs.statSync(path.join(dir, "SKILL.md")).size > 200; } catch { return false; } } },
  { name: "has frontmatter or header", check: (id, dir) => { try { const t = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8"); return /^---$|^# /m.test(t); } catch { return false; } } },
  { name: "has description section",   check: (id, dir) => { try { const t = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8"); return /description:|##\s*Description/mi.test(t); } catch { return false; } } },
  { name: "references skill id",       check: (id, dir) => { try { const t = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8"); return t.toLowerCase().includes(id.toLowerCase()); } catch { return false; } } },
  { name: "has intent or trigger keyword", check: (id, dir) => { try { const t = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8"); return /intent|trigger|when to use|when the user|activation|pattern/i.test(t); } catch { return false; } } },
];

let m7id = 0;
for (const skillId of skills) {
  for (const check of QUALITY_CHECKS) {
    m7id++;
    const caseId = "M7:" + String(m7id).padStart(4, "0");
    const desc = "skill " + skillId + " :: " + check.name;
    test(caseId + " " + desc, () => {
      const skillDir = path.join(ROOT, "skills", skillId);
      assert.ok(check.check(skillId, skillDir), desc);
    });
  }
}




test("M7: skill matrix summary", () => {
  // No-op; the per-case tests already self-verify.
});

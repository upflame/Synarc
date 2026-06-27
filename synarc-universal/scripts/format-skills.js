const fs = require("fs");
const path = require("path");

// scripts/format-skills.js
// Re-applies the conservative minification to all 56 SKILL.md files in skills/.
// Idempotent. Safe to run after editing.

const SKILLS_DIR = path.join(__dirname, "..", "skills");
if (!fs.existsSync(SKILLS_DIR)) {
  console.error("skills dir not found: " + SKILLS_DIR);
  process.exit(1);
}

const skills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory());

let totalOrig = 0, totalMin = 0;
let touched = 0;

for (const d of skills) {
  const p = path.join(SKILLS_DIR, d.name, "SKILL.md");
  if (!fs.existsSync(p)) continue;
  const orig = fs.readFileSync(p, "utf-8");
  const origSize = orig.length;
  totalOrig += origSize;

  let min = orig;
  min = min.replace(/\r\n/g, "\n");
  min = min.replace(/\r/g, "\n");
  min = min.split("\n").map(l => l.replace(/[ \t]+$/, "")).join("\n");
  min = min.replace(/\n{3,}/g, "\n\n");
  min = min.replace(/\n*## EXPANDED[^\n]*\n+This section contains expanded[^\n]*\n+Reference file:[^\n]*\n*/g, "\n");
  min = min.replace(/^(#{1,6})\s+\[P\d+\]\s*/gm, "$1 ");

  const minSize = min.length;
  if (minSize < origSize) {
    fs.writeFileSync(p, min, "utf-8");
    touched++;
  }
  totalMin += minSize;
}
const saved = totalOrig - totalMin;
console.log("format-skills: " + touched + " / " + skills.length + " files updated, " + (saved / 1024).toFixed(1) + " kB saved");

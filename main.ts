// The Houseplant Out-of-Office — make.fun entry
// Writes one out-of-office auto-reply, as if a houseplant sent it,
// to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// Gate: UTF-8 text of 1 to 120 characters, not only white space.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Out of office. I haven't been watered since March, so your email is now fertilizer. I'll reply when it rains indoors.";

// The competition gate, enforced before and after the write:
// entry.txt must hold 1 to 120 characters and not be only white space.
function checkGate(text: string): void {
  const cps = [...text].length;
  if (cps < 1 || cps > 120) {
    throw new Error(`gate failed: entry is ${cps} code points, must be 1-120`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
}

checkGate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back what was written and verify it byte for byte.
const written = readFileSync(outPath, "utf8");
checkGate(written);
if (written !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt differs from ENTRY");
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
console.log(`wrote ${outPath} (${[...written].length} code points, sha256 ${sha256})`);
console.log(`verified: ${JSON.stringify(written)}`);

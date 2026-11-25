// The Moon Finally Answers Back — one line the Moon says, 240 chars max.
// Artifact: /output/entry.txt, house judge (glm-5.3-flash, high effort).
//
// Brief:
//  1. Speaks as the Moon answering the wishes, howls and late-night promises of
//     everyone staring up at it. Not a line about the Moon — the Moon's line.
//  2. Funny on one read.
//  3. Sounds like the Moon's own voice: wry, old, tired of being wished upon.
//  4. Lands as a comeback before the line ends.
//  5. Under 240 chars, none wasted.
//
// The engine: the Moon answers the request nobody admits making — the ex.
// Deadpan bureaucratic age, then the specific confession, then a refusal that
// is also a small kindness. Nobody explains anything.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The comeback. */
const LINE =
  "Four billion years of wishes and the only one I get now is for someone to text back. Fine. I'll do it. Not in your voice, though, and not with any interest in how he's doing.";

const MAX_CHARS = 240;

/** Cliches the Moon would be tired of — criterion 5. */
const STALE: readonly string[] = ["made of cheese", "one small step", "to the moon", "howl at the moon"];

function compose(): string {
  const text = LINE.normalize("NFC");
  const chars = [...text].length;
  const lower = text.toLowerCase();

  if (/[\r\n]/.test(text)) throw new Error("entry must be one line, no newline");
  if (text !== text.trim()) throw new Error("no edge whitespace");
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} chars, gate allows 1..${MAX_CHARS}`);
  }
  // Criterion 1/3: the Moon must not open by talking about itself — a comeback
  // starts from the thing it is answering. Fail loudly if the voice drifts to
  // a narrator describing the Moon instead of the Moon speaking.
  if (/^the moon\b/i.test(text)) throw new Error("criterion 1: the Moon speaks, it is not described");
  if (!/I'?ll|I will/i.test(text)) throw new Error("criterion 4: the comeback must commit to the answer");
  for (const bad of STALE) {
    if (lower.includes(bad)) throw new Error(`stale moon cliche, criterion 5: ${bad}`);
  }
  // Criterion 4: the last refusal is the turn; it has to still be the ending.
  if (!text.endsWith("how he's doing.")) throw new Error("the turn is gone: it must end on the refusal");
  return text;
}

function main(): void {
  const text = compose();
  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target: string = join(outDir, "entry.txt");
  writeFileSync(target, text, "utf8");
  process.stdout.write(
    `wrote ${[...text].length} chars / ${Buffer.byteLength(text, "utf8")} bytes to ${target}\n`,
  );
}

try {
  main();
} catch (err) {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
}

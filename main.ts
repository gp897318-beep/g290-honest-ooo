// The Painfully Honest Out-of-Office — one original auto-reply, one line.
// Writes the winning reply to /output/entry.txt, checked against the
// competition gate (1-200 characters, non-whitespace, single sentence).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Winner of 10 compared variants (see honest-ooo-variants.md):
// the most painfully honest private truth — reading every message while
// replying to none — kept polite with "please bear with me".
const REPLY =
  "I'm away and, to be honest, not checking email is a lie: I'm reading every message and replying to none of them until I'm back, so please bear with me.";

// The gate (RULES.txt): entry.txt must be UTF-8 text of 1-200 characters,
// not only whitespace. A reply that spans lines is not one sentence, so
// refuse newlines, edge whitespace and double spaces outright.
const chars = [...REPLY].length;
if (REPLY.trim().length === 0) throw new Error("entry is empty");
if (chars < 1 || chars > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars}`);
}
if (REPLY.includes("\n") || REPLY !== REPLY.trim() || / {2,}/.test(REPLY)) {
  throw new Error("entry must be a single cleanly-spaced line");
}

// Tone guard: the reply must be exactly one sentence — exactly one
// sentence-ending full stop, and it must be the final character — and it
// must stay confessional, not apologetic: no "sorry" / "apolog*".
const fullStops = (REPLY.match(/\./g) ?? []).length;
if (fullStops !== 1 || !REPLY.endsWith(".")) {
  throw new Error("entry must be exactly one sentence");
}
if (/\bsorry\b/i.test(REPLY) || /apolog/i.test(REPLY)) {
  throw new Error("entry must be honest, not apologetic");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", REPLY, "utf8");

// Round-trip: what the grader reads must be byte-identical to REPLY.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== REPLY) {
  throw new Error("round-trip mismatch: /output/entry.txt differs from REPLY");
}

console.log(`wrote /output/entry.txt (${chars} chars, 1 line)`);

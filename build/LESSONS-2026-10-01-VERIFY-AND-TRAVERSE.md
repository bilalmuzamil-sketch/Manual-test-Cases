# LESSONS — 2026-10-01 (binding; read before reporting status or scoping a feature)

Two failures this session cost the QA lead trust. Both are recorded here so no session repeats them.
Proposed for promotion to numbered Standing Rules (Rule 72) — until then, treat as binding.

## L1 — VERIFY, NEVER ASSERT. Read it live and show the evidence before stating it as fact.
The failures, all the same shape — I reported state I had not read:
- Claimed the WO Board updated cases "kept a format you accepted" and "no other case was affected."
  Reality: 120/127 cases had paragraph preconditions. I had not checked.
- Claimed "SV-9867 is not under epic SV-9667." Reality: it IS a child. I had not requested the parent
  field — I inferred it from a response that omitted the field.
**The rule:** before asserting any fact about a case, ticket, suite, count, format, parentage, or
coverage — query it live, and in the reply show the evidence (the number, the field, the list), never
a claim from memory or from a previous step's inference. If I have not read it this turn, I say "not
verified" rather than stating it. A verification pass (audit + counts) precedes every "it's done" or
"they're fine."

## L2 — TRAVERSE THE EPIC, NOT JUST THE PRD PAGE. The epic is a provided source (Rules 37 + 115).
The failure: I was given epic SV-9667 AND one Confluence PRD per feature. I authored strictly from the
per-feature PRD pages and never enumerated the epic's children. SV-9667 has 55 children; two of them
(SV-9867 deposit audit log, SV-10261 portal deposit) were real testable tickets I did not cover —
Mudassir did. SV-9867 was never in a PRD page at all; it was only reachable by listing the epic's
children.
**The rule:** when an epic is named as a source, enumerate ALL its children (JQL `parent = <epic>`),
classify each (Story / Bug / Task / verify-task / obsolete), and map each against our TestRail
coverage. The per-feature PRD page is a subset, never the whole scope. Any uncovered testable child is
surfaced in the OUTSTANDING register with its key, type and status — not left to be discovered by
someone else. Do this at intake (Rule 15/37) and re-run it before declaring a feature complete (Rule
115 per-source coverage verdict).

## L3 — NEW CASES GO IN A SEPARATE, LABELLED FOLDER (QA lead, 2026-10-01).
Any cases created from now on go into their own clearly-named folder (the "QA Additions" pattern, e.g.
Mudassir's section 20481), never mixed into an existing feature folder, so provenance and scope stay
clear and nothing silently overwrites another author's work.

## L5 — ALWAYS RUN A RIGOROUS COVERAGE CHECK BEFORE SAYING A SUITE IS COMPLETE (QA lead, 2026-10-02).
Ordered after the Chunk-2 authoring: *"'Let me do a rigorous coverage check' — save it as your rule, you
should always do that."* This is now a MANDATORY, every-time gate (not optional, not only when prompted),
and it is the concrete defence against the Mudassir-gap failure (L2). Before declaring ANY suite complete:
1. **Traverse the epic** — JQL `parent = <epic>`, list EVERY child, confirm the exact story set the suite
   is meant to cover (which chunk/scope each belongs to), and prove no whole story was skipped.
2. **Per-requirement anchor coverage (Rule 43)** — extract EVERY requirement anchor from the source
   (every `Sx-Ry / Nz / Ew`), extract every anchor CITED across the live cases, and DIFF. Every source
   anchor is either cited by a case OR carries a written verdict (e.g. "spec-delivery note, not a product
   test; covered by <case>"). No silent omission. Script it (Rule 88); show the diff.
3. **Per-source verdict (Rule 115)** — PRD ✓, design ✓, epic children ✓, tech plan ✓, with what was
   covered / excluded and why.
Report the coverage proof (traversal + anchor diff) as evidence; a suite is "complete" only after it is
shown, never asserted. Worked example: `build/maintenance-reminder-v2/chunk-2/COVERAGE-VERDICT-2026-10-02.md`.
**Proposed for promotion to a numbered Standing Rule (Rule 72); binding until then.**

## L6 — COMMUNICATION RULES (QA lead, 2026-10-05), binding on every reply, proposed for Standing Rule.
1. **Full names only.** Never a short form, abbreviation or internal/file/section codename in anything the
   user or a tester reads; always the full product/feature/document name (e.g. "Digital Vehicle Inspection
   Version 2", not "DVI V2"; "Work Orders Board View and Technician View", not "WO Board").
2. **Never say anything without context.** Every statement carries what it is and why it matters, in one read.
3. **Never surface an item outstanding ON THE USER without giving the solution for it** in the same breath —
   what to do, and the option to do it. No bare "waiting on you".
4. **No unnecessary paragraphs.** Lead with the answer; prefer a short table or a line; cut filler.

## Standing check to run before saying a feature/suite is done (now L5, mandatory every time)
1. Live format audit (preconditions are discrete lists, not paragraphs; titles ≤ ~80; Rule-117 shape) —
   show the counts.
2. Epic-to-coverage map (every epic child vs our cases) — show the gap list.
3. Per-requirement anchor coverage diff (every source anchor cited or verdicted) — show the diff.
4. Per-source coverage verdict (Rule 115): PRD ✓, design ✓, epic children ✓, tech plan ✓.
Only after all four, with evidence shown, is it reported complete.

## L4 — PLAIN LANGUAGE, ALWAYS. Spell out every abbreviation; give every question full context.
Failures (QA lead, 2026-10-01): I wrote "MR" without ever expanding it to "Maintenance Reminders",
and I posed outstanding questions as bare ticket codes (SV-10398, SV-10403, SV-10575…) with no plain
explanation — unreadable to a layman or a manual QA tester who has to answer them.
**The rule (Rule 7/9/70/103):** in everything the user or a tester reads — chat replies, outstanding
items, reports — use plain English, expand every abbreviation and feature name the first time, and
NEVER let a ticket key or status code carry the meaning. Every question states, in his words: what the
situation is, why it matters, what I need decided, the options with what we'd then do, and the cost of
saying nothing. A ticket key goes at the END as a reference only. If it can't be understood in one
read without opening anything, it isn't written yet.

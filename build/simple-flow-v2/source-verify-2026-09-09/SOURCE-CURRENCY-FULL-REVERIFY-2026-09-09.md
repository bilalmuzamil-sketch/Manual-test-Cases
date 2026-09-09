# Simple Flow V2 — FULL suite source RE-VERIFICATION (read 2026-09-09)

**Why this pass exists.** The 2026-09-08 pass was a *delta* — it re-verified only the 11 stories the
8-Sep change-log flagged and re-stamped just the 18 cases it touched. **47 of 65 cases were left at
`specification version 23, read 21 August 2026`.** A build-verify session reading those stamps correctly
reported the suite as last-verified 2026-08-21, and asked "did you miss something?" — it had. This pass
closes that gap: every case in group 6665 is now re-verified against, and stamped to, the current spec
revision. Lesson recorded as **`build/LEARNINGS-LOG.md` L0015** and graduated into
**`build/skills/02-SOURCE-CHECK.md` §5b (the provenance-currency gate)**.

## Source currency (Rule 31 / 57 / 59 — re-checked LIVE 2026-09-09)
| Source | Identifier | Version / last updated | Verdict |
|---|---|---|---|
| Specification | Confluence **771391574** "Simple Flow V2" | **Still the 8 September 2026 revision** — last edited 2026-09-08 15:47 by Milos Vasic; has NOT moved since yesterday | CURRENT — same revision the 18 cases were verified against 2026-09-08. |
| Epic + stories | **SV-8683**, SV-9247…SV-9267 | thin pointers to the spec page; all 10 not-previously-checked stories fetched live | CURRENT. |
| Permission map | **SV-8183** | fetched live; matches the Story-21 case mappings | CURRENT. |
| Designs / tech plan | as 2026-08-21 intake | unchanged this pass | reference only (Rule 30/57). |

## What was done (Rule 43 — per-case verdict)
- **Audit first (the new §5b gate):** live provenance audit of all 65 cases → 18 already on 8-Sep, 41 on
  v23/21-Aug, 6 Automated with no version stamp at all.
- **The 22 never-checked cases** (stories 6, 8, 9, 10, 11, 12, 16, 19, 20, 21 — never in the 8-Sep
  change-log) were content-diffed against the live spec: **21 UNCHANGED, 1 conflict (C44604).** Full
  disposition: `FULL-REVERIFY-DIFF-2026-09-09.md`.
- **The 25 cases already verified in the 2026-09-08 diff** (UNCHANGED/HELD in the changed stories) needed
  no content re-diff — re-stamped only.
- **Re-stamped 46 cases** to `Simple Flow V2 specification (Confluence page 771391574, revised 8 September
  2026), read on 9 September 2026`, marker `AUTOMATION: Not available on Build to test Yet - Last checked
  9/9/2026`; automation_type set on all (were 0). Rendered to served-page `fr-view` via the Froala
  `html.set` harness (`REPAIRED-hs.jsonl`).
- **5 Automated cases re-stamped with the QA lead's go-ahead** (C44561, C44575, C44583, C44587, C44605) —
  Rule 65 notice: `FOR-VLAD-2026-09-09.md`.
- **1 Automated case HELD, not changed — C44604** (see below).

## The one held case — C44604 (Story 20, reordering), a document conflict (Rule 58)
C44604's Expected says the reorder **Undo was "removed on user request, 2026-09-04"** and the toast is
informational only. But **every spec version — v21, v23 and the current 8-Sep revision — says "A drop is
confirmed and can be undone"**, and **no record of a 2026-09-04 Undo removal exists anywhere in the repo**
(no PO answer, no decision doc, no outstanding item). This is an unsourced case-vs-spec conflict. Per Rule
58 it is **held and asked**, never resolved by a guess — because if the PO really did request the removal,
flipping the case to the spec would revert a real decision. It keeps its current stamp and is recorded as
the deliberate one-case exception to the suite-wide re-stamp (§5b). **PO question raised for Milos** (below).

## Result
- **64 of 65 cases now carry the 8 September 2026 revision** in provenance. **C44604 is the one explicit
  hold**, recorded here and in the register. The suite no longer mis-reports its currency.
- Suite is **Rule-85 source-verified-only** (no QA build); every case carries the deferred marker.

## OUTSTANDING
1. **PO question for Milos (C44604 — Story 20 reordering Undo).** The case says you asked to remove the
   reorder Undo on 2026-09-04; the spec (all versions) says a reorder can be undone. **Which is right —
   did you ask to remove Undo, or should the case follow the spec (can be undone)?** If removed, the spec
   needs a correction and the case is right; if not, the case is corrected to "can be undone." Nothing is
   changed until you say. Cost of silence: one reordering case stays at the old stamp and untested for
   this behaviour; the rest of the suite is current and testable.
2. **Rule 65 — Vlad to be told** the 5 Automated cases changed (`FOR-VLAD-2026-09-09.md`), plus C44557 from
   2026-09-08.

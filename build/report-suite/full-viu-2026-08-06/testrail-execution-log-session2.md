# TESTRAIL EXECUTION LOG — Report Suite, 2026-08-06 second session

Standing Rule 50: exhaustive then exact. Every write re-GET and byte-compared against the intended
payload, with every field the pass did not intend to change proven byte-identical to its pre-write
snapshot. **A log recording only "200 OK" is non-compliant** — every row below carries its verification
result.

## Authorisation used

**`update_case` on OUR cases only.** No `add_case`, no `delete_case`, no section operation, no run write,
no result logged anywhere. That is exactly what was authorised and exactly what was used.

## Source reads — BOTH timestamps, as Rule 59 requires

| | UTC |
|---|---|
| Sources read at **pass start** | **2026-08-06 08:24Z** — six specs live from Confluence + epic child count |
| Sources re-read at **write start** | **2026-08-06 08:58Z** — spec versions unchanged (SBC 15, SBR 17, PV 5, TU 6, WIP 9, IV 4) |
| Sources re-read at **pass end** | **2026-08-06 09:25Z** — **specs unchanged; THE BUILD HAD MOVED** |

**Verdict of the second read:** nothing moved, writes proceeded.
**Verdict of the third read:** `v3.5-16cf83f` → **`v3.5-7168d14`**, so batch 6 below re-stamped every build
line this pass had written.

## Batches

| # | What | Ops | Result |
|---|---|---|---|
| 1 | Sales By Customer verdicts, markers, Rule-61 blocks, three Rule-42 removals | **45** | all HTTP 200, 30 fields compared each, **0 mismatch, 0 collateral** |
| 2 | C30173's totals-row removal, re-run with the correct anchor | **1** | HTTP 200, 30 fields, 0 mismatch |
| 3 | Work In Progress verdicts, markers, Rule-61 blocks | **24** | all HTTP 200, 30 fields each, 0 mismatch |
| 4 | The 12 raw-markup cases converted to plain numbered text | **12** | all HTTP 200, 30 fields each, 0 mismatch |
| 5 | Six cases given an honest "has not yet been checked against any build" sentence | **6** | all HTTP 200, 30 fields each, 0 mismatch |
| 6 | **Build-line correction after the redeploy was detected** | **69** | all HTTP 200, 30 fields each, 0 mismatch, **0 skipped** |
| | **TOTAL** | **156 ops over 82 distinct cases** | **156 × HTTP 200, 156 × byte-verified, 0 mismatches** |

Per-operation records: `evidence/2026-08-06-session2/{sbc,sbc2,wip,unmarkup,nobuild,restamp}-oplog.json`.
Each entry carries the operation, the target C-id, the HTTP status and the verification line.

## The one batch that STOPPED, and why that is the system working

Batch 1's first invocation was interrupted by a two-minute command ceiling after writing 2 of 49 cases. The
re-run then **refused 4 cases** with `body edit anchor not found` — because those 4 had already had their
edit applied by the interrupted run. **The writer refused rather than half-editing**, which is what the
guard is for. All four were then read back and proven intact: **exactly one provenance line, one build line
and one marker each, marker last, no raw markup, no barred phrase.** Two needed nothing (already correct),
one needed a corrected anchor (C30173, batch 2), and one needed no edit at all — **C38912 never claimed what
the brief thought it claimed**, so the planned edit would have been wrong.

## Declared normalisations relied on

- **`refs` comma re-join** — not relied on: `refs` was **not written on any operation in this pass**.
- **`update_case` re-renders any omitted text field** (playbook §J #3) — **mitigated on every single
  operation** by sending `custom_preconds` + `custom_steps` + `custom_expected` explicitly, always, even
  when only one changed. The final census confirms **0 of 476 cases carry raw markup or CRLF**.
- **`case_title` / `case_refs` echoes on run results** — not applicable: **no title and no `refs` was
  changed**, and run 359's results show **0 changed fields of any kind**.

## Payload-shape check, before sending — the C30341 lesson

A byte-check proves you wrote what you intended, **not that the intent was right**. So every rebuilt field
was asserted before sending to contain **exactly one** provenance line, **exactly one** build line and
**exactly one** `AUTOMATION:` marker, with the marker **last**. The raw-markup converter additionally
asserted **zero** residual `<li>`, `<ol`, `<p>`, `<hr`, `<br` in all three fields.

## Verification of everything we did NOT touch

| Claim | Evidence |
|---|---|
| The other **394** of our cases untouched | **byte-identical BY CONTENT**, all 12 compared fields including `updated_on` and `updated_by`, **0 differences** |
| Vladimir Tomovic's **C38919–C38923** untouched | **byte-identical BY CONTENT**, same 12 fields, **0 differences** (Rule 38) |
| **Run 359** untouched | `include_all` still **false**; **476 tests**; case_id sets **equal in both directions** with our 476; **535 result records**, the same 535 the first session recorded; **0 new results**; counters 6 passed / 470 untested |

## Final census over all 476 — 0 problems

Exactly one provenance line, exactly one `AUTOMATION:` marker, marker last, no raw markup, no barred phrase
("as per the build tested on", "verified by the build"), on every one of the 476.

**Markers: 357 `READY` + 77 `READY - EXPECT FAIL` + 42 `HOLD` = 476.**
**Gate: 357 + 77 = 434 = 476 − 42 held. PASSES.**

**Build lines:** 69 × `v3.5-7168d14` 8/6 · 219 × `v3.5-16cf83f` 8/6 · 7 × `v3.5-16cf83f` 8/5 ·
176 × `v3.4.1-3d03023` 8/4 · 5 with none, each saying so in its own text. **69 + 219 + 7 + 176 + 5 = 476.**

## Jira

**9 issues created, 0 edited.** SV-8962, SV-8963, SV-8964, SV-8965, SV-8966 (Sales By Customer) and
SV-8967, SV-8968, SV-8969, SV-8970 (Work In Progress). Each: `Story Defect` (10007), parent = the owning
**story**, priority **Low**, `relates to` link to that story, **no Product Area** (the field does not exist
on this type), 7-section body, and a **source block** at the bottom naming the specification with its
**Confluence** version and quoting the requirement's own words. **11 field checks read back from Jira on
each — 45 of 45 PASS.** Duplicate-searched with 7 JQL queries first; nothing matched.

**No already-filed ticket was touched** — the QA lead is retrofitting source blocks in one pass.

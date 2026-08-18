# Filters — whole-case currency pass — COMPLETION REPORT (2026-08-17)

**Pass:** `build/filters/currency-2026-08-17/` · **Date:** 2026-08-17 · worker = TestRail user id 3
**Epic:** SV-8785 · **PO:** Branko Cicovic · **TestRail group:** 4110 · **Run (Ahtasham's, not ours):** 352

## What I did (plain)
Made every Filters case fully current to the updated sources: **spec Confluence v21 + epic SV-8785
stories + the ingested Filters Claude design**. This built on the fabian-review reconciliation earlier
today (which rewrote 69 cases to the v21 redesign) by **confirming that work is current** and
**finishing the version re-stamp it left owed** — 55 cases that still cited spec v19.

## Currency pre-flight (live, this pass)
| Source | State | Verdict |
|---|---|---|
| Filters spec (Confluence page 572030978) | **v21**, lastModified Aug 14 2026; live body content-identical to the fabian read (0 requirement-prose words differ) | **CURRENT — no drift** |
| Epic SV-8785 | **33 children**, both ways (`parent`=33 and `"Epic Link"`=33, no paging remainder) | **CURRENT** |
| Filters Claude design | `design-2026-08-17/DESIGN-NOTES.md` (QA lead's ZIP) | **CURRENT — confirmatory**; pins desktop v21 labels; does NOT cover per-view page rollout |

## Counts (reconcile to 124)
| | Count |
|---|---|
| Live cases in group 4110 | **129** (ours **124** / foreign **5** — Ahtasham C43576–C43580) |
| **Content-updated** (assertion body changed) | **0** — the redesign's content changes were all done by the fabian pass earlier today; this pass found no content-stale case |
| **Label-finalized** (dropped "confirm live" for a design-pinned label) | **0** — all 26 "confirm live" occurrences are the **per-view page rollout** (owed by engineering) or **persistence-once-built**; none is a label the design pins, so none was finalized (fabian already pinned all spec/design labels) |
| **Version-pin re-stamped** (v19 → v21, refs + provenance + read-dates) | **55** (41 READY → Rule-69 · 4 EXPECT-FAIL kept · 10 HOLD kept) |
| **Already current** (left byte-identical) | **69** (the fabian-touched v21 cases — 0 changed by me) |
| Total TestRail writes | **55** `update_case` — every one HTTP 200 + byte-verified (30 fields each, 0 mismatch, 0 collateral) |
| Foreign cases touched | **0** (proven byte-identical incl. `updated_on`/`updated_by`) |
| Jira / run 352 writes | **0** |

## Is EVERY Filters case now current to v21 (content + refs)?
**Yes — all 124 our cases are current to spec v21.** Confirmed live at end of pass:
- **124/124 provenance lines cite Confluence version 21**; **0 cite v19**; **0 v19 in any `refs`**.
- Markers: **110 Rule-69 · 10 HOLD · 4 EXPECT-FAIL = 124** (exactly one marker + one provenance
  line per case; 0 raw markup).
- **Content is correct under v21** (coverage re-derived both directions; 0 orphaned cases; 0 live
  contradictions — every old-model reference is a negative "the control was removed" assertion).
- **Deliverables reconcile:** four counts **live 124 / local 124 / id-map 124 / import 124**,
  set-equal both ways; id-map **0 blank C-ids, refs 124/124 == live**; shredding guard **PASSED**;
  import header sha256 **`f2d76051…` == all 6 peer imports**.

## Cases that intentionally stay "confirm live" / blocked (the design does NOT cover these)
| Cluster | Cases | Why it stays | Owner |
|---|---|---|---|
| **Per-view page rollout** — WHICH Parts view / Report / entity-filter page carries each filter | C29566–C29588 (entity panels, 23), C29616, C38904–06, C38907, C38908–11 | The Claude design pins the desktop filter model but **not** which page carries which filter. Spec S1-R8 / S13-R23 defer this to "the set that page provides today" — the per-view list is **PENDING from engineering** | Engineering |
| **Persistence once built** | C29614 | "filters saved to your account, not one browser" — a build/behaviour check, not a label | Build-verify sync |
| **Build verification of all 124** | all Rule-69 cases (110) | App deliberately not opened this pass; the Rule-69 marker announces "not build-tested yet" | Later build-verify sync |
| **Greyed-vs-hidden Status chip** (Estimates/Completed) | C29609, C29610 | v21 S9-R5 says hidden; QA-lead ruling 2026-07-30 said greyed — CONFLICT held (not reversed) | QA lead |

*(These are the exact five areas the design does not cover — nothing was invented for them.)*

## Verification (Rule 50 / §2)
- 55 writes, all four fields + refs sent each; re-GET + byte-compared field by field — **0 mismatch,
  0 collateral change**. Per-op oplog (`oplog-restamp.jsonl`) committed per batch.
- **§2.4 dry-run** read every rebuilt payload before sending; the C38909 regex landmine ("added in
  Confluence version 19" — a historical fact) was deliberately preserved.
- **§2.10 post-write re-audit:** 0 material assertion changes (only provenance/marker/refs moved);
  bodies byte-identical START→END. `POST-WRITE-AUDIT.md`.
- Read-dates: only **spec + epic** dates moved to 17 August 2026 (the two sources re-read this pass);
  tech plan / tech design / handover / Branko-answer read-dates **left unchanged** (Rule 14.1(2)).

## OUTSTANDING — what I need from you (all six categories swept)
1. **Missing sources.** **Per-view filter list PENDING from engineering** (spec S1-R8 / S13-R23) —
   until it lands, the Parts/Reports/entity per-view cases (C38904–11, C29566–88) stay HOLD /
   "confirm live". *Owed by: engineering. Blocks: precise per-page chip coverage. Since: v20/v21.*
2. **Unanswered questions.** None new this pass.
3. **Missing go-aheads / authorisations.** None — this pass used the standing `update_case`
   authorisation for correcting existing cases (no add/delete, no run write, no Jira).
4. **Access / credentials.** **A QA-branch sign-in** for `sv8785.qa.shopview.com` to build-verify the
   124 cases and lift the 110 Rule-69 markers to READY. *Blocks: build verification. Since: this pass
   (app deliberately not opened).*
5. **Decisions deferred / held.** **Greyed-vs-hidden Status chip (C29609/C29610)** — QA-lead ruling
   2026-07-30 (greyed) vs v21 S9-R5 (hidden); held, not reversed. Your call.
6. **Things another team owes.** The engineering per-view filter list (item 1). Run 352 (Ahtasham's)
   still does not contain the 9 fabian-new cases (`include_all: false`) — a union sync is staged in
   the fabian pass (`STAGED-RUN-352-SYNC.md`) and needs Ahtasham's authorisation; not touched here.

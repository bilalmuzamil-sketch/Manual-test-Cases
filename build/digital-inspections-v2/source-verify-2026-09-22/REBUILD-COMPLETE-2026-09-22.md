# DVI V2 — suite deleted and rebuilt from scratch (2026-09-22)

The QA lead authorised deleting the old Digital Inspections V2 suite and rebuilding it from scratch
against the CURRENT spec, because the manual tester now has the new specs/docs to test against. This
file is the durable record of that rebuild.

## What was done
1. **Deleted** all 43 old cases (snapshot kept in `cases-dump.md`; ids in `DELETE-MANIFEST.md`). Guard:
   only `created_by=3` and not TestRail-Automated were touched (Rules 38/71).
2. **Rebuilt the subfolders**: removed the 6 old generic subfolders and created **16 per-story
   subfolders** named to the current spec headings, so no case sits under an unrelated folder
   (`section-map.json`). Parent group **6658** ("Digital Inspection V2 (Aug 2026)").
3. **Authored 87 new cases** across the 16 folders, covering **every** R/N/E requirement anchor in the
   current spec (373 anchors, each covered exactly once — machine-checked per section before writing).

## Source (Rule 57 / 113)
- Canonical spec: **Confluence 768507905 "Digital Inspections V2"** (space PM, PM Milos Vasic),
  last modified 2026-09-18 — the same `S#-R#` document the old cases cited, now three revisions newer.
  Body copied verbatim to `../sources/CONFLUENCE-768507905-live-2026-09-22.md` and every Expected
  quote was pulled **directly from that file by anchor id** (no hand transcription), so the Expected
  Result is the source's own words, quoted verbatim (Rule 113). A plain-language restatement for the
  tester is added AFTER the quote, clearly marked as our restatement.
- Companion decision log read with it: Confluence 845348865 (Rule 108).
- Epic **SV-8181**; per-story Jira ids recorded in the case source lines.

## Case shape
- Expected Results: `S#-R#: "verbatim quote"` (each anchor), then a plain restatement, then a source
  line (epic + story + spec page 768507905 + section anchors + read date 22 Sep 2026), then
  "Source-verified on 22 September 2026; not yet build-verified."
- **AUTOMATION marker: `HOLD - not yet build-verified on the sv8181 QA build` on ALL 87 cases.**
  A case that has not been build-verified is NOT automation-ready (QA lead, 2026-09-22). These are
  source-verified only; the marker flips to READY (or READY - EXPECT FAIL) per case at build
  verification. Arithmetic gate today: READY 0 + EXPECT-FAIL 0 = total 87 − HOLD 87. ✓
- `custom_automation_type = 2` (Functional); `custom_atmstatus = 1`.
- Render: all fr-view confirmed via `hs_repair_one.mjs` (fresh creates and marker-fix updates alike;
  edited=false, marker last).

## Folder → section → case-id map
| Folder (section id) | Story | Cases | C-ids |
|---|---|---|---|
| S1 (12150) Require a note on flagged responses | SV-9099 | 3 | C88507–C88509 |
| S17 (12151) Require a photo on a Not OK response | SV-9440 | 3 | C88510–C88512 |
| S2 (12152) Turn findings into work order lines | SV-9100 | 6 | C88513–C88518 |
| S3 (12153) Build from a completed inspection | SV-9101 | 4 | C88519–C88522 |
| S4 (12154) Build from the inspection note on a work order | SV-9102 | 3 | C88523–C88525 |
| S5 (12155) Inspection history on the asset record | SV-9103 | 7 | C88526–C88532 |
| S6 (12156) Build from the asset Inspections tab | SV-9104 | 4 | C88533–C88536 |
| S7 (12157) Record where the lines came from | SV-9105 | 4 | C88537–C88540 |
| S15 (12158) Draft the lines with ShopCoach | SV-9404 | 8 | C88541–C88548 |
| S8 (12159) Record measurements per axle | SV-9106 | 8 | C88549–C88556 |
| S11 (12160) Attach a reference file to a question | SV-9109 | 5 | C88557–C88561 |
| S12 (12161) Template builder authoring | SV-9110 | 10 | C88562–C88571 |
| S13 (12162) Customer-facing inspection report | SV-9111 | 5 | C88572–C88576 |
| S14 (12163) Inspection filling on a phone | SV-9397 | 3 | C88577–C88579 |
| S18 (12164) Mark a whole scope OK in one press | SV-9883 | 4 | C88580–C88583 |
| S19 (12165) Conditional follow-up on a checkbox response | SV-10243 | 10 | C88584–C88593 |
| **Total** | | **87** | C88507–C88593 |

Link form: `https://shopview.testrail.io/index.php?/cases/view/<id>`.

## Rule 114 pass (2026-09-22) — every case runnable by a human manual tester
After authoring, all 87 cases were re-checked against **Rule 114** (preconditions, steps and expected
must all be runnable and readable by a manual QA tester by hand). 13 cases carried instructions a
tester could not perform as written and were fixed:
- Concurrency / two-permission checks reworded to concrete two-login / second-browser steps
  (C88518, C88522, C88528, C88533).
- Server-enforcement and forced-failure checks that cannot be done by hand are now stated honestly
  in-step as developer/automated checks, with the manual part spelled out (C88516 server bypass,
  C88540 record-write failure, C88548 forced empty/failed ShopCoach, C88590 server submit-refusal).
- ShopCoach brief internals (not visible on screen) rewritten to verify via the resulting proposed
  lines, with an honest note (C88541).
- Upload-failure made a real manual action (interrupt the network) (C88561).
- Bare "the S2 conditions are met" / anchor pointers spelled out in plain terms (C88519, C88523;
  C88591 tidied). Verbatim Expected quotes were left unchanged throughout (Rule 113).
Re-scan: 0 remaining instructions a human cannot perform. All edited cases re-confirmed fr-view.

## Expected-Result layout reformat (2026-09-22, QA lead order)
All 87 cases were reformatted to the layout the QA lead set (Rule 113 amendment): Expected Results now
have three line-break-separated parts — **(1) Expected results in our plain words, one result per line
(bullets); (2) Source — the story/spec/section reference; (3) the exact verbatim quotes, one per result,
each referenced** — then the AUTOMATION marker. The plain results lead so the case is runnable at a
glance; the verbatim quotes are unchanged, moved below as backing. Preconditions/steps (including the
Rule-114 fixes) were left untouched — only `custom_expected` was rewritten. All fr-view re-confirmed.
Reproducible from `build_dvi.py --update` + `plain-bullets.txt` + `anchor_lib.py` in this folder
(one plain bullet per anchor, meaning locked to the quote).

## Outstanding for the QA lead
- **Not build-verified yet.** No QA-build verification was run (source-verify + authoring only). When
  the suite is executed against `https://sv8181.qa.shopview.com`, re-stamp read/build dates and flip
  the AUTOMATION marker per case.
- **ShopCoach dependency.** S2/S6/S15 build-lines behaviour needs ShopCoach enabled on the QA env;
  drafting on QA was previously flagged as an open question (Q7). Confirm before build verification.
- **No test run created** for this suite yet (Rule 34) — create/sync one at execution time, union-only.
- Old open questions from the spec/decision log (Q1 bulk-OK on an unmeasured position, Q2 starter
  seeding, Q6 Advisor/Started/progress placement) remain the PO's, not answered here (Rule 58).

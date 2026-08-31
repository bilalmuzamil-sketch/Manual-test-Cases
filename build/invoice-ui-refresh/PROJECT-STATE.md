# PROJECT-STATE — Invoice UI Refresh

**Canonical cold-resume doc.** Status derived live; do not trust remembered figures (Rule 92 / skill 15 §7).

## Identity
- **Epic:** SV-8218 (owner/assignee Chris Ward) · **PO:** Chris Ward
- **Spec:** Confluence **755990532**, live **v45** (as of 2026-08-31; authored at v38, re-verified at v39 then re-verified at **v45** 2026-08-31 — 14 rules changed + 2 net-new); tech plan built against **v36**
- **Design:** Claude artifact `c88ee207-3197-4f54-8cb9-bac3deb84354` (binding visual reference). **Refreshed 2026-08-31** (QA lead supplied updated export). Diff vs the POC extract: design caught up to spec v45 (masthead date labels "Estimate date:/Invoice date:/Due date:/Paid date:", Credit Balance shows open balance, now framed "binding"), **all changes already reflected in the v45 cases — 0 case updates needed.** Current extract: `reconcile-2026-08-31/design-extract-2026-08-31.txt`; finding: `reconcile-2026-08-31/DESIGN-UPDATE-2026-08-31.md`. POC extract kept dated at `intake-2026-08-21/sources/design-document-poc-text-extract.txt`.
- **Tech plan:** `intake-2026-08-21/sources/tech-plan-2026-08-12.md` (Symfony/Twig→WeasyPrint + Vue/Quasar)
- **Git dev branch (theirs):** `project/invoice-ui-refresh` · **QA env:** none yet (feature Not started)
- **Case source:** `build/invoice-ui-refresh/cases/` · internal ID prefix **INV** (`INV-<AREA>-NN`)
- **TestRail parent folder (group):** group_id **6559**, suite 1 — cases live in the sub-sections inside it, not directly in the folder. Link: https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6559 (recorded 2026-08-25)

## Scope (from spec v45)
- **13 stories**, **112 rule IDs** (S1–S13 + G-R1; was 110 at v39, +S12-R10 page breaks, +S12-R11 viewport). Documents: Estimate · Invoice (paid = receipt) ·
  Credit Invoice · Parts Sale Estimate · Parts Sale Invoice.
- Epic children: 12 named (SV-9140–9151) + SV-9195 (Story 13) + SV-9193 (batch/imported, **deferred**) +
  5 "Verify:" plan Tasks (SV-9207–9211, not test requirements).

## Status — 2026-08-21 (authoring pass complete)
- **INTAKE COMPLETE + FULL SUITE AUTHORED: 87 cases** across 14 areas (13 spec stories + Authorizer WO-UI).
- **Coverage: 110 of 110 spec rule IDs covered, both directions, 0 uncovered, 0 orphan anchors** (coverage-matrix.md).
- **Deliverables:** requirements.md (v38) · coverage-matrix.md · intake-2026-08-21/{INTAKE, SOURCE-CURRENCY, SURFACE-MATRIX, DELIBERATE-DECISIONS, OUTSIDE-IN-GAP-HUNT, quality-audit/AUDIT.md} · cases/ · testrail-id-map.csv · testrail-import/Invoice-UI-Refresh_testrail-import.{csv,xlsx}.
- **Ruthless Usefulness Audit:** 87/87 KEEP (2 WEAK-KEEP), 0 CUT, 0 NONSENSE, 0 unresolved contradictions.
- **Rule-85 project:** every case SOURCE-VERIFIED ONLY - NO BUILD EXISTS YET (deferred automation marker).
- **NO TestRail writes. NO Jira. Nothing pushed** (id-map C-IDs blank). Import file ready for the QA lead.
- **Open PO questions:** ~~PO-1~~ **RESOLVED 2026-08-31 by spec v45** (change-log 2026-08-27 rewrote the Credit Invoice Terminology "Balance" to the open-balance definition, matching S11-R6a and our INV-CRED-06 C44969 — the v39 conflict is gone; PO sheet annotated, question no longer sent) · PO-2 still open (un-logged spec edits 2026-08-13 [v38] and ~2026-08-25 [v39]; the v39 one verified cosmetic). Refreshed sheet: questions-2026-08-25/.
- **Reconciliation:** local active 87 = id-map 87 = import 87; id-map refs 87/87; set-equal both ways.

## Status — 2026-08-25 (reconciliation pass)
- Re-supplied design + tech plan are IDENTICAL to authoring inputs (design content byte-identical; tech plan md5-identical). PRD moved **v38→v39**, delta non-substantive (Slack-link row only). **No case content changed**; provenance re-stamped v38→v39 on all 87; import regenerated (0 shredded, 87/87). Detail: reconcile-2026-08-25/RECONCILIATION-2026-08-25.md.


## Status — 2026-08-31 (source re-verification v39→v45)
- **Spec moved v39→v45** (Confluence 755990532). Exhaustive v39-vs-v45 rule-body diff (v39 snapshot in `intake-2026-08-21/sources/`) found **14 changed rules + 2 net-new**. All changes trace to the spec's own change log: Milomir build feedback (2026-08-26 / 2026-08-28) and Mudassir spec review (2026-08-27).
- **Cases updated (content) to v45:** S3-R8 void/reversal unlock (INV-AUTH-04 C44922); S5-R6 "Part"→"Parts" (INV-WORK-04 C44932); S5-R7 nine Invoice-Details settings incl. Part number/description (INV-WORK-05 C44933); S8-R2 ordering tiebreak (INV-PAID-01 C44946); S8-R5 excess sub-line not deposit-gated + literal em-dash/arrow (INV-PAID-04 C44949); S11-R6a open-balance + partial-refund-and-applied note (INV-CRED-06 C44969); S12-R2 palette +#F8FAFC, scoped to light printed doc (INV-VIS-02 C44972); S12-R3 Parts-Sale accent (INV-VIS-03 C44973); S12-R4 label weight 750→700 + Inter identical on-screen/PDF (INV-VIS-04 C44974); S12-R7 POC-badge dropped (INV-VIS-07 C44977); S12-R9 label weight 750→700 (INV-VIS-09 C44979); S13-R6 void/reversal unlock (INV-PART-06 C44985). S2-R3 tester content unchanged (internal note fixed). S5-R9/S13-N1 re-stamp only.
- **⚠️ THREE of the changed rules were NOT in the pass's task list** and were caught by the exhaustive diff: **S5-R6** (Part→"Parts"), **S12-R2** (+#F8FAFC / scope reword), **S2-R3** (framing). All three post-date the v39 snapshot (v39 change log ended 2026-08-12; the Milomir/Mudassir edits are v40+). Fixed to v45 verbatim and flagged to the lead.
- **2 net-new cases:** INV-VIS-10 (S12-R10 page breaks) → **C45213**; INV-VIS-11 (S12-R11 viewport) → **C45214**. In section 6753 (Document Visual Standard).
- **Provenance re-stamped on all 87 + 2 new** → "specification version 45 … read on 31 August 2026" (spec_ref → spec v45). AUTOMATION marker date left at 8/21/2026 on the 87 (still Rule-85, no build); the 2 new carry 8/31/2026.
- **TestRail (authorized this pass):** `update_case` on all 87 + `add_case` ×2, via block-only HTML (`apply_to_testrail.py`, `to_ol`/`expected_html`). **This also FIXED a pre-existing formatting defect** — the 87 were previously pushed as plain text (walls of text); all **89 now pass `check_case_render.py`** (0 fail, 0 warn). id-map backfilled 89/89.
- **Run R417 union-synced 117→119 tests** (union-only, Rule 34). The subtree holds **30 foreign cases** (created_by=6, incl. the whole "Cross-Cutting and Regression" section 6770) that were already in R417; they were preserved untouched (Rule 38) and only our 2 new added. **Ours: 89 · live total in run: 119.**
- **Suite now: 89 cases ours, 112 rule IDs covered both directions, 0 uncovered.**
- **Foreign-vs-ours R417 reconciliation (Rule 38/39), read-only:** all **30 foreign cases (creator 6) are COMPLEMENTARY — 0 contradictions.** They cover the same rules from API-negative / edge-case / cross-cutting-E2E angles ours do not. Closest neighbours: foreign C45195 (multi-page PDF) ≈ our new S12-R10 C45213; foreign C45192 (mobile viewport) ≈ our new S12-R11 C45214 — both complementary, keep both. Nothing edited on either side. Detail: `reconcile-2026-08-31/FOREIGN-VS-OURS-R417.md`.
- **PO-1 RESOLVED by spec v45** (Terminology "Balance" rewritten to open-balance = S11-R6a, change-log 2026-08-27); PO sheet annotated on both tabs, no longer to be sent. PO-2 remains open.

## Status — 2026-08-31 (Mudassir's 30 tester cases source-verified to v45)
- **Designated manual QA tester recorded: Mudassir Qamar (TestRail user id 6, mudassir.qamar@shopview.com).**
  Per the QA lead, his cases are **IN-SCOPE (treated as the QA lead's own), NOT foreign** (Rule-38 bullet).
- **His 30 cases C45168–C45197** (contiguous; run R417; created_by=6; all custom_atmstatus=1 Not Automated,
  none Rule-71-blocked) were **source-verified to spec v45 in place** (source currency reconfirmed 2026-08-31:
  live Confluence 755990532 body matches the saved v45 body, newest change-log entry 2026-08-28).
- **Content updates (4):** C45169 (S3-R8) added the v45 void/reversal re-enable clause; **C45179 (S11-R6a)
  removed the now-WRONG stale note** ("PRD Terminology still says fixed $0.00 — stale") — v45 change-log
  2026-08-27 fixed the Terminology to the open-balance definition, so it now AGREES with S11-R6a; also
  dropped the v36 pin. C45192 added v45 **S12-R11** viewport clause (refs +S12-R11); C45195 added v45
  **S12-R10** page-break rules (refs +S12-R10). The other 26 = re-stamp only (verified matching v45).
- **All 30 reformatted to block-only HTML** (were plain-text walls; same defect the 89 had). All 30 now pass
  `check_case_render.py` (0 fail, 0 warn), mirroring the live sibling format (C44910).
- **Provenance normalized on all 30** → "…Invoice UI Refresh specification version 45, section <rule>, read on
  31 August 2026" (mirrors the 89 for a uniform tester read; Confluence page id 755990532 kept in the map
  and PROJECT-STATE, not repeated in every body — Rule 16). AUTOMATION marker left verbatim
  ("Not available on Build to test Yet - Last checked 8/26/2026"; matches the suite convention; no build exists).
- **created_by stays 6** on all 30 (his authorship preserved); updated_by is us. Nothing deleted/moved; no
  run-membership change; no Jira.
- **Suite in R417 now = 89 ours + 30 tester (Mudassir), all in-scope, 0 truly-foreign in R417 (live total 119).**
- Per-case disposition + links: `reconcile-2026-08-31/mudassir-cases-map.csv`. Reconciliation reframed:
  `reconcile-2026-08-31/FOREIGN-VS-OURS-R417.md`.
- **Held as ambiguous: none** — every rule mapped cleanly to v45 text.

## How to resume (ordered)
1. `git fetch` + `merge --ff-only` on `claude/slack-session-0sxnd9`; claim the lock.
2. Read `intake-2026-08-21/INTAKE-2026-08-21.md` + `SOURCE-CURRENCY.md`.
3. On go-ahead: run the **v36→v38 + log-vs-body diff** first (Rule 59), then author per skill 01.

## TestRail run (updated 2026-08-31)
- **Full-suite run R417** — https://shopview.testrail.io/index.php?/runs/view/417. As of 2026-08-31: **119 tests** (89 ours + 30 foreign creator-6, preserved). C-IDs backfilled into testrail-id-map.csv (89/89). New cases appended union-only via `build/invoice-ui-refresh/apply_to_testrail.py` (Rule 34); `build/testing-tools/sync_runs.py` also works if it covers R417.

## Status — 2026-08-31 (build verification + automation markers pushed)

- **BUILD VERIFIED: 53 of 119 cases** on QA branch **sv8218**, build marker **`v26.35.5-8c3cc21`**.
  Verdict = all five runnability checks passed (skill 03), detector control passing both directions.
  Evidence: `build-verify-2026-08-31/verification.json`; pass folder has the harness, the 6 captured
  documents, the 4 captured surfaces and the per-case checks.
- **MARKERS PUSHED on all 53** (QA lead authorised 2026-08-31): `AUTOMATION: Not available on Build to
  test Yet` → **`AUTOMATION: READY`**, plus **Rule-54 sentence 2** *"Last checked against build
  v26.35.5-8c3cc21 on 8/31/2026."*. Sentence 1 (documents only) carried **byte-for-byte** and verified
  unaltered on every case. **No expected behaviour changed** (Rule 57).
- **Written through the TestRail WEB EDITOR, not the API** — 48 of the 53 served their text fields from
  an escaping `<div class="markdown">` container, so an API write would have left the tester reading
  literal `<ol><li><p>`. A UI save flips the container to `markdown fr-view`. Tool:
  `build-verify-2026-08-31/markers/apply_markers.mjs` (adapted from the report-suite repair batch).
- **Result: 53 applied, 0 failed, 0 skipped.** Independent post-write sweep (`markers/final_sweep.py`,
  re-read from live + the served page, not from the writer's log): **53 of 53 pass all seven checks** —
  container `fr-view` on all three fields · 0 literal tags · 0 visible entities · exactly one
  `AUTOMATION: READY`, last · provenance s1 unaltered · s2 present once · title/section/refs/atmstatus
  unchanged. Audit log: `TESTRAIL-EXECUTION-LOG-markers-2026-08-31.md`.
- **Rule 71 / 65:** every case written carried `custom_atmstatus = 1`. The **5 Automated cases
  (C44919, C44920, C44921, C44922, C44985) were NOT touched** and remain held — all five fall in the
  unverified groups anyway. **Nothing to tell Vlad from this pass.**
- **Handover deliverable:** `build-verify-2026-08-31/HANDOVER-AUTOMATION-READY-2026-08-31.md` — the 53
  by area, with links, in plain English.
- **⚠️ OPEN DEFECT IN OUR OWN SUITE — 61 of the other 66 cases are UNREADABLE on screen** (raw
  `<ol><li>` shown to whoever opens them); 56 repairable now, **5 are the Automated ones and stay
  held**. Cause: API writes leave the escaping container. **An earlier 2026-08-31 pass also reformatted
  30 of Mudassir's cases from plain text INTO block HTML via the API, making them worse**, and
  `check_case_render.py` passed all 30 because it inspects the stored value, not the served page.
  Per-case list: `markers/readability-all-119.json`. Fix is the same tool, ~20 min, **not yet run —
  awaiting the QA lead.**
- **Run R417 unchanged** — no case added, removed or moved, so no union-only sync was needed (Rule 34).
- **Learnings recorded the same pass** (Rule 93): playbook §J (the UI-login credential trap that makes
  the container scanner report "0 escaping" for every case; the write-path table; the collapse-census
  correction) · skill 04 §4.5 (the can-the-tester-actually-read-it gate, run on the served page) ·
  core §2.1c (the flag follows the write path) · `check_case_render.py` docstring (not sufficient alone).

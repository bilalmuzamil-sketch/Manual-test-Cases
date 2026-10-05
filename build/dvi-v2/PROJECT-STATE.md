# PROJECT-STATE — DVI V2 (Digital Inspection V2)
**Canonical cold-resume doc.** Status derived live (Rule 92 / skill 15).

## Identity
- **TestRail group:** 6658 "Digital Inspection V2 (Aug 2026)", suite 1, parent 3559. **91 cases, all created_by=3,
  0 foreign, 0 automated.** 17 story-sections (S1–S19 + tech-plan). Link:
  https://shopview.testrail.io/index.php?/suites/view/1&group_id=6658
- **Build-verification env:** QA branch **sv8181.qa.shopview.com** · API sv8181api.qa.shopview.com · build **v26.36.8-2a64085**.
- **Access:** 3 cookies (sv_sso_session + PHPSESSID + cf_clearance) → /tmp/cln/sv8181-cookies.json (ephemeral, never committed).
  Boot: `qa-branch-boot.mjs sv8181 <route> admin`. Full routes/API/glossary: **build/dvi-v2/NAVIGATION-MAP.md**.

## The job (QA lead, 2026-10-01)
Build-verify all 91 on sv8181: glossary everywhere from the build, UI paths from the build, preconditions/steps
runnable by a layman/manual QA, Expected layman-understandable using the build glossary (SUBSTANCE stays the
spec's, Rule 114). After verifying, flip marker to **AUTOMATION: READY**. Build-verification lane only.

## Status — 2026-10-01 (IN PROGRESS)
- **Observed on the build (committed, with screenshots):** template builder (full: field TYPEs Checkbox/Text/
  Measurement/Per axle/Photo, RESPONSE OPTIONS/SETTINGS, Include Monitor option, Note/Photo required, reference
  file "Attach File", "Add follow-up to a response", "Require technician signature", Save Draft/Publish) ·
  inspection results /inspections/<uuid> (OK/Monitor/Not OK/N/A badges, CHECKBOX, fields complete, locked/signed,
  PDF) · Build lines menu + ShopCoach line builder draft ("Add Lines") · asset Inspections tab + SHOPCOACH ASSET
  HISTORY (/customers/vehicle/<uuid>) · roles editor · per-axle builder config ("MEASUREMENT ROWS · EVERY AXLE").
  Observed labels: build/dvi-v2/OBSERVED-UI-LABELS-sv8181.md.
- **Alignment+stamp+flip transform:** role-perm casing → build ("Work orders"/"Work order lines"/"Customers"),
  "labour"→"labor", stamp v26.36.8-2a64085 10/1/2026, HOLD→READY. Expected substance frozen (guard). Canary
  C88513 served fr-view OK; full 91 write in progress.
- **Run hand-off:** build/dvi-v2/RUN-HANDOFF-DVI-V2-2026-10-01.md.
- **RESIDUAL (run session confirms live; entry points + config confirmed):** in-progress filling states
  ("Marked OK"/"Needs action"/"Follow-up for this response"), per-axle FILLING controls (Drum/Disc/Single/Dual),
  customer-report content + "Require acknowledgement", phone-width rendering.

## NEXT (resume here)
1. Confirm the 91 transform wrote (stamp 91/91, markers READY, glossary applied); gates: runnable, render, served fr-view.
2. Report to QA lead + deliver the run hand-off.

## 2026-10-05 · Rule 115 clarity pass (manual-tester runnable + understandable)
Ran `check_tester_runnable.py` on all 91. Flagged 5; **ALL 5 FIXED** (jargon → plain words, meaning unchanged, fr-view clean):
C88583/C88585/C88592 (removed spec-id citations S12-R31/S12-R11/S15-R1 from steps), C154646 (server-side → behind-the-scenes),
and **C154644** (removed "endpoint"/"server-enforced"; the server-side flag gating now reads as the automated check, manual core kept).
C154644 was created by Bilal (user 3) but had been edited by Vladimir (user 1) on 2026-10-02 — QA lead authorised editing it (2026-10-05)
because Bilal authored it, and to notify Vlad so he adjusts his automation. **Now 91/91 pass the gate.**
**TO TELL VLAD (so he adjusts DVI automations to the reworded cases):** C88583, C88585, C88592, C154646, C154644.

## 2026-10-05 · Rule 115 precondition sweep
Ran the precondition gate across all 91. One gap: **C88573** (report-formatting case) asserted "a report for an
inspection run" with no route — fixed by adding the observed route (open the unit's "Inspections" tab > the run's
"Report"/"PDF"). fr-view clean. All 91 now pass. (Other last-1.5-week suites swept the same day: Dashboard & Founder
Part Sales clean; Mudassir's 3 jargon cases left as his own authored cases.)
- 2026-10-05 (later): stronger gate re-flagged **C88573** — the route reached the report but never said how to CREATE the
  inspection. Added the proven seeding path used by 5 build-verified DVI cases (Work Orders > New, pick customer and unit,
  start an inspection from a published template, complete and sign it). All 91 pass; fr-view clean.

# PROJECT-STATE — Printer Friendly Work Orders

**Canonical cold-resume doc.** Status derived live (Rule 92 / skill 15 §7).

## 🆕 Update — 2026-09-01 (LATEST) — BUILD-VERIFIED ON A LIVE QA BUILD AND HANDED OFF TO THE MANUAL QA TESTER

**The "QA env: none / Rule 85 source-verified only" line below is now STALE.** The suite was verified
live on **sv9315.qa.shopview.com, build `v26.35.6-598cc8a`**, on 1 September 2026.

**Verdicts, 44 cases:** 36 PASS · 1 PARTIAL · 2 UNREACHABLE · 5 NOT VERIFIED (data states this system
does not have). Per case: `build-verify-2026-09-01/verdicts/PER-CASE-VERDICTS.md`. Report:
`build-verify-2026-09-01/REPORT-2026-09-01.md`.

**Writes: 43 of 43 applied through the TestRail UI editor, 0 failures.** C45123 held (Automated,
Rule 71 — no per-case go-ahead). All four post-write checks clean.

**How the paper was actually checked, with no printer.** `window.print` stubbed to prove the click
reaches it; `emulateMedia({media:'print'})` to apply the print stylesheet; `page.pdf()` on Letter and
A4 plus text extraction **page by page**. A 33-line work order paginates to 13 pages with
`WO #S2-13958` as the last line of **every** page, and there is not one dollar sign anywhere in the
output. Field omission was proved on work orders that genuinely lack the fields, never by inference.

**The spec contradicts itself, and two cases can never be run.** Key Decisions say printing is
disabled when a work order has no line items — confirmed on the build, the option is greyed out —
while S3-N1 and S4-N1 describe that very printout. **C45107 and C45116 are UNREACHABLE**; on
2026-09-01 their marker was changed from `AUTOMATION: READY` to `AUTOMATION: HOLD` with the reason in
plain words, because telling an automation engineer a case is ready when nobody can run it is a false
claim. Arithmetic gate re-derived: READY 41 + EXPECT-FAIL 0 = 41, and 43 − HOLD 2 = 41 → closes.
**A product-owner ruling is outstanding** (register row HO-3).

**Handed off to Viktoria Videnovic** (TestRail user 4) on 2026-09-01. Run **419**, 44 tests, set-equal
to the cases in both directions, zero results pre-recorded. Deliverables in `build/handoff-2026-09-01/`:
the brief, `HOW-THE-NUMBERS-WERE-DERIVED.md`, and the `Defects-for-Testers` workbook. Six gates were
run at handover and every one is re-runnable from that folder.

**Also on 2026-09-01:** the 8 cases the brief does not send the tester through end to end now carry
that reason **inside the case**, at the end of Expected Results, so a tester working straight from
the run is told the same thing the brief tells them (skill 04 §4). Gate:
`build/handoff-2026-09-01/check_self_explains.py`.


### 🆕 Later on 2026-09-01 — THE SUITE NOW HAS A VERDICT ON ALL 44 CASES. ZERO "NOT VERIFIED".

QA lead, verbatim: *"You are never supposed to create defect, you are supposed to make the tests
RUNNABLE"* and, on the no-view sign-in, *"You can change the permission of a Tech to make this
happen."* The five NOT VERIFIED cases were settled:

| Case | Was | Now | What settled it |
|---|---|---|---|
| **C45090** | NOT VERIFIED | **PASS** | Removed the work-orders view permission group from the Technician role. **A 200 is not proof:** removing `workOrdersView` alone answers 200 and the role reads back with it still on, because the line-edit and pick-parts permissions depend on it. With the whole group off, the technician is redirected off the work order URL to /timesheets, "Work Orders" is gone from the top menu, and there is no More menu and no print option. Role restored, restore verified identical including view mode |
| **C45111** | NOT VERIFIED | **PASS** | 560-character story seeded with `POST /api/work-orders/lines/change-story` (NOT `/lines/change`, which answers 500), printed with the print stylesheet applied: all ten repetitions of the seeded phrase on the paper, 600 characters visible, no ellipsis and no "Show more". Original story restored character for character |
| **C45097** | NOT VERIFIED | **UNREACHABLE** | Pressing Save with Customer empty answers **"Customer is a required field"** and sends no request. A work order with no customer cannot exist |
| **C45098** | NOT VERIFIED | **UNREACHABLE** | Choosing a customer and pressing Save with Add Asset empty answers **"Asset is a required field"**. Nearest real data, S2-6107, has a vehicle with only a year and prints "Vehicle: 1993" — sparse, not absent |
| **C45104** | NOT VERIFIED | **UNREACHABLE** | `GET /api/work-orders/line-statuses` returns exactly `authorization_required, authorization_declined, authorized, complete`. Posting "cancelled" against a real line id answers 400 with the status field alone rejected. **There is no Cancelled line status in the product** |

**Final verdicts, 44 cases: 38 PASS · 1 PARTIAL (C45088) · 5 UNREACHABLE (C45097, C45098, C45104,
C45107, C45116).** All five UNREACHABLE cases now carry `AUTOMATION: HOLD` with the reason in plain
words, plus a tester note. Arithmetic gate re-derived: READY 38 + EXPECT-FAIL 0 = 38, and 43 − HOLD 5 =
38 → closes. **Five of the suite's requirements describe behaviour in a state the product forbids —
that is one product-owner question, not five data-state gaps.**

## Update — 2026-09-01 (runnable-steps gate: NOT RUNNABLE = 0 for all non-Automated cases)
Ran `build/testing-tools/check_runnable_cases.py` (reads TestRail live) over the whole suite: it flagged
11 cases NOT RUNNABLE (all R4 — the FIRST step, e.g. "Read the header area of the printout.", did not say
where to go). Fixed **10 of ours** (created_by 3, atm=1) by anchoring step 1 to the print view the
preconditions establish: "On the Print Work Order view (see Preconditions), …". Preconds/Expected untouched
(Rule 57); routes remain PROVISIONAL (no build). Edited through the TestRail UI editor (Froala) so every
field stays `markdown fr-view` — verified served-page fr-view + no literal tags on each. Cases: C45094,
C45095, C45096, C45099, C45104, C45105, C45106, C45109, C45111, C45114. **Final gate: 43 RUNNABLE / 1 NOT
RUNNABLE** — the one remaining is **C45123** (Automated atm=3) → left untouched (Rule 71). Local
`cases/*.json` steps synced to match. Gate exit criterion met.

## Identity
- **TestRail parent folder (group):** group_id **6617**, suite 1 — cases live in the sub-sections inside it, not directly in the folder. Link: https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6617 (recorded 2026-08-25)
- **Epic:** SV-9383 · **PO / Owner:** **TBD** (must be confirmed — PO-PFWO-1)
- **Spec:** Confluence **519176194**, live **v8** (as of 2026-08-25)
- **Design:** none (TBD on every story) · **Tech plan:** none
- **QA env:** **sv9315.qa.shopview.com** — build-verified 2026-09-01 on `v26.35.6-598cc8a` (the old "none → Rule 85" reading is superseded; see the 2026-09-01 update at the top)
- **Case source:** `cases/` · internal ID prefix **PFWO** (`PFWO-<AREA>-NN`)

## Scope (from spec v8)
- **6 stories** (SV-9384–SV-9389), **45 rule IDs**. Trigger: WO detail → More → Print Work Order;
  output: browser print view. Pricing never shown.

## Status — 2026-08-25 (authoring pass complete)
- **FULL SUITE AUTHORED: 44 cases** across 6 areas.
- **Coverage: 45/45 rule IDs, both directions, 0 uncovered, 0 orphan anchors** (coverage-matrix.md).
- **RUA:** 44/44 KEEP, 0 CUT, 0 NONSENSE.
- **Rule-85:** every case "Not available on Build to test Yet - Last checked 8/25/2026".
- **NO TestRail writes. NO Jira. Nothing pushed** (id-map C-IDs blank).
- **Open PO questions:** PO-PFWO-1 (confirm the Owner/PO — spec says TBD) · PO-PFWO-2 (no design
  exists; confirm PRD text is the appearance authority or a design will follow).
- **Deliverables:** requirements.md (v8) · coverage-matrix.md · intake-2026-08-25/{INTAKE,
  SOURCE-CURRENCY, SURFACE-MATRIX, DELIBERATE-DECISIONS, OUTSIDE-IN-GAP-HUNT, quality-audit/AUDIT.md} ·
  cases/ · testrail-id-map.csv · testrail-import/Printer-Friendly-Work-Orders_testrail-import.{csv,xlsx}
  · questions-2026-08-25/.
- **Reconciliation:** authored 44 = import 44 = id-map 44; set-equal both ways.

## Status — 2026-08-31 (source currency check — NO verification needed)
- **Spec checked live: Confluence 519176194 is now v9** (was v8 at authoring 2026-08-25). The version integer bumped, so the source qualified for a check.
- **Diff v8→v9 = NON-SUBSTANTIVE.** Same **45 rule IDs** (S1–S6), rule texts materially identical, and the spec's own **Change Log has not moved since 2026-04-19** — no entry after our authoring. Only difference found: S3-R3 carries a trailing rationale sentence ("This printout is for mechanics doing the work, not for billing") that our requirements condensed; no behavioural change. **No case content update warranted** (same call as Invoice v38→v39).
- **No case writes made** — the 44 cases remain accurate against v9. Provenance left reading v8 because v8≡v9 in substance; not re-stamped via API to avoid disturbing the render container (see the Inline render-container lesson). The cases are currently plain-text (authored 2026-08-25), which renders readably as text; a rich `fr-view` reformat can be offered as a separate nicety if the QA lead wants it.
- Epic **SV-9383** owner still **TBD** (PO-PFWO-1 open).

## Status — 2026-08-31 (layman-UI provisional routes — skill 18)
- **STANDARD ENFORCED (QA lead, 2026-08-31, universal):** no case may ship with spec-level
  preconditions/steps; every case must be runnable from the UI by a manual QA (Victoria). Rule 85 (no
  QA build), so routes are **SPEC-derived and marked PROVISIONAL — to be confirmed on the build.** Only
  PRECONDITIONS/STEPS touched; Expected Results unchanged (Rule 57).
- **Routes added (from spec v9 + the sibling Invoice-UI NAVIGATION-MAP's confirmed top-nav):**
  detail-view route — *In the top menu click "Work Orders" → open a work order → its detail view* — and
  the trigger route — *→ click "More" (the overflow/actions menu on the toolbar) → "Print Work Order" →
  the browser print view/dialog opens.* Line-state and dark-mode preconditions reframed to the open work
  order; the negative permission case (PFWO-MENU-07) states the blocked-attempt route without inventing
  access controls. No admin/menu path invented. Wording matches suite convention (UI labels in smart
  double quotes; no markdown).
- **Applied through the UI editor (Playwright → Froala `html.set` → Save, deadlock-retry ×15) so each
  field is written AND flipped to `fr-view` in one save** (the cases were previously plain text in the
  escaping `markdown` container). Recipe `render-repair-2026-08-31/layman_fix.mjs`; intended content by
  `gen_intended.py`; checkpoints in `REPAIRED-layman.jsonl`.
- **RESULT: 43 of 44 verified on the served page — `markdown fr-view`, 0 literal tags, route present,
  AUTOMATION marker still last, atmstatus & title unchanged. 0 failures.**
- **🛑 Rule 71 — 1 Automated case (atm=3) SKIPPED: C45123 (PFWO-AUDIT-01, S6-R1).** Still spec-level
  wording; ready-to-apply text in `intended-blocks.json`; ask/enrich per
  `render-repair-2026-08-31/FOR-VLAD-layman-routes-automated-2026-08-31.md`.
- **Local JSONs (`cases/`) updated to match TestRail.** No Jira / no run changes. Still Rule 85
  SOURCE-VERIFIED ONLY; routes PROVISIONAL until a build confirms exact toolbar/More-menu labels. PO/PO
  Owner still TBD (PO-PFWO-1).

## TestRail run (2026-08-25)
- **Full-suite run R419** — all 44 cases — https://shopview.testrail.io/index.php?/runs/view/419. C-IDs backfilled into testrail-id-map.csv. New cases: append via `build/testing-tools/sync_runs.py --apply` (union-only, Rule 34).

## Status — 2026-09-01 (source currency re-confirmed; QA lead cleared 6617 to this session)
- QA lead directed the other (build-verify) session NOT to touch 6597/6617 so this session owns them.
- **Source re-checked LIVE 2026-09-01: Confluence 519176194 is still v9** — unchanged since the 2026-08-31 v8→v9 (non-substantive) check. **Source verification remains CURRENT; no new case changes warranted.**
- Remaining, not source work: (a) 1 Automated case C45123 awaits Vlad for the layman-route enrichment (Rule 71); (b) build verification blocked (Rule 85, no QA build) — routes PROVISIONAL until a build; (c) PO/Owner still TBD (PO-PFWO-1).

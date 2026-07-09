# Milos Round-2 Answers → Case Mapping (APPLIED 2026-07-09)

> **Status:** APPLIED. Milos answered the 5 Round-2 open questions
> (`OpenQuestions-for-Milos-Round2.md`). Source fetched 2026-07-09 from the Google
> Sheet → verbatim copies in `milos-round2-answers-source.csv` / `.xlsx`. Clear
> spec-decisions were applied to the case JSONs and **pushed live to TestRail via
> `update_case`** (all HTTP 200, re-fetch verified). Bugs confirmed for eventual
> fix were recorded in `bugs-log.md` (expected NOT rewritten to match a bug).
>
> Rules applied: Simple-Flow **shortcut principle** and **last-update-wins** on
> contradictions (Milos's 2026-07-09 answers are the latest input).

## Per-question outcome

### Q1 — Mark-Reviewed review-note field (SF-REV-10)
- **Milos (verbatim):** "There will not be note on this filed t is design issue , which i removed from the design yesterday"
- **Outcome:** **SPEC-CHANGE (descope).** The optional review note is removed from
  the design; v1 has no note field. Under last-update-wins this supersedes the
  2026-07-08 design-bundle reversal that had restored the note.
- **Affected case:** SF-REV-10 (TestRail 29395).
- **Applied change:** title → "…includes VIN / Serial # (required) with no review
  note field"; expected → VIN required, **no note field**, sign-off completes with
  VIN only; steps updated; viu_status → VIU-Verified (live VIN-only dialog now
  matches expected). **BUG-3 → CLOSED / not a bug** (intended descope).
- **Pushed:** yes — 29395, update 200, verify 200.

### Q2 — Tech-story entry points, Story 17 vs S15-R2 (SF-TECH-*)
- **Milos (verbatim):** "Story Tech will behave as it is right now , onky change is some vissuals , and the poisnt that now they can complete multiple stories  at once , or individualy as now"
- **Outcome:** **CONFIRMED.** Story 17 (SV-7876) is authoritative; older
  line-only S15-R2 wording superseded. Only visual changes, plus stories can be
  completed **individually or several at once** (already covered: inline entry =
  SF-TECH-01/06/08, gate modal + multi-line = SF-TECH-03/05).
- **Affected cases:** SF-TECH-01..08 (already assume Story 17; all VIU-Verified).
- **Applied change:** SF-TECH-08 (TestRail 29330) — open question resolved:
  viu_status Open-Question → VIU-Verified; expected softened from "EXPECTED PER
  STORY 17" to plain confirmation + note that the gate modal completes stories
  individually or several at once. No other SF-TECH expected changed (already
  correct).
- **Pushed:** yes — 29330 (SF-TECH-08 only), update 200, verify 200.

### Q3 — Inventory-decrement invariant on completion (SF-COMP-07, SF-QB-01)
- **Milos (verbatim):** "If we are talking about the inventory parts yes but i am not sure why the PO is matter if we are talking about the PO ?"
- **Outcome:** **CONFIRMED (no expected change).** In-stock inventory parts DO
  decrement on-hand and write Part History on completion (the data-integrity
  invariant holds). Milos's PO aside is a separate concern.
- **Affected cases:** SF-COMP-07 (29296), SF-QB-01 (29426).
- **Applied change:** notes annotated "Q3 CONFIRMED"; expected already correct →
  **no wording change, not pushed.** Both remain VIU-Pending on a live decrement
  drive (PO confirms intent; still needs a live verification run).
- **Pushed:** no (expected unchanged).

### Q4 — 'New Part Request' required fields: Category / Sell Price (SF-VPART-01, SF-VPART-02)
- **Milos (verbatim):** "As discussed with Milos Vasic this is an expected behavior for now"
- **Outcome:** **SPEC-CHANGE.** The current build behavior is intended for v1:
  **Category IS required**; **Sell Price is NOT enforced**. Supersedes V2.4 S5-R1's
  "sell mandatory / no category" wording (last-update-wins). BUG-9 / GAP-A → CLOSED
  as intended.
- **Affected cases:** SF-VPART-01 (29331), SF-VPART-02 (29332).
- **Applied change:**
  - SF-VPART-01: required set = description + quantity + **category**; sell price
    optional; part saves vendorless and is orderable from the line. Title/steps
    updated; viu_status → VIU-Verified.
  - SF-VPART-02: blocked when description / quantity / **category** missing; saving
    **allowed** when only sell price is empty. Title/steps updated; viu_status →
    VIU-Verified.
- **Pushed:** yes — 29331, 29332, update 200, verify 200.
- **FOLLOW-UP (held):** the See-Financial-Data permission gate for vendorless
  part-add was premised on a mandatory sell price (now overturned). Whether a
  permission gate still applies is a separate open item; the SF-VPART-02
  See-Financial-Data permission negative step was removed pending that ruling.

### Q5 — Backend enforcement of completion / review sign-off (SF-PERM-06 / BUG-6 / BUG-7)
- **Milos/Bilal (verbatim):** "For now lets consider the UI restriction the pass for the test cases and not necessarily the API restriction but do note in the comments after running the tests that It passed for UI and failed for API so that thre can be a record in the system to eventually fix that (Comment By Bilal)"
- **Outcome:** **SPEC-CHANGE (acceptance) + CONFIRMED BUG.** For v1 the permission
  cases **PASS on UI gating** (FE hides the button for the unauthorized role). The
  BE non-enforcement of the WO-completion / review-sign-off atoms stays a **known
  API gap (BUG-6 / BUG-7) kept OPEN for a future fix** — record each result as
  "UI pass / API fail". The expected was NOT rewritten to hide the defect: the API
  gap remains explicit in the expected as a recorded known issue.
- **Affected cases:** SF-PERM-06 (29410) directly; ruling also settles
  SF-PERM-02/04/07/08 and SF-REV-09 as UI-PASS for v1.
- **Applied change:** SF-PERM-06 title → "…(UI gating is the v1 pass criterion)";
  expected reframed to: (1) UI gating = pass; (2) settings atom IS BE-enforced;
  (3) WO completion / review sign-off NOT BE-enforced → UI pass / API fail, known
  gap to fix; (4) atom-collapse OR of the receive roles. Notes record the ruling.
- **Pushed:** yes — 29410, update 200, verify 200.

## TestRail push summary (all update_case, verified via get_case)

| SF id | TestRail | outcome | update HTTP | verify HTTP |
|---|---|---|---|---|
| SF-REV-10 | 29395 | spec-change (note descoped) | 200 | 200 ✓ |
| SF-TECH-08 | 29330 | confirmed (Story 17) | 200 | 200 ✓ |
| SF-VPART-01 | 29331 | spec-change (category req / sell optional) | 200 | 200 ✓ |
| SF-VPART-02 | 29332 | spec-change (category req / sell optional) | 200 | 200 ✓ |
| SF-PERM-06 | 29410 | spec-change (UI=pass) + bug noted | 200 | 200 ✓ |

Before/after JSON snapshots: `/tmp/testrail/r2_<caseid>_before.json` /
`_after.json` (ephemeral, not committed).

## Confirmed bugs (for the bug list — expected NOT rewritten to match)
- **BUG-6** — WO-completion permission is FE-only at the backend (tech simple-complete → 201). OPEN, fix ticket.
- **BUG-7** — Review sign-off permission is FE-only at the backend (tech change-status→complete → 201). OPEN, fix ticket.

## Held / follow-up (need a further ruling)
- **See-Financial-Data gate on vendorless part-add** — its "sell is mandatory"
  premise is overturned by Q4; whether a permission gate still applies is open.
- **SF-COMP-07 / SF-QB-01 live drive** — invariant is PO-confirmed but still
  needs a live decrement + Part-History verification run (VIU-Pending).

## Resolved-from-earlier (no longer open questions)
- Round-2 Q1 (review note), Q2 (Story 17), Q3 (inventory invariant), Q4 (part
  required fields), Q5 (BE-enforcement acceptance) are all now answered/applied.

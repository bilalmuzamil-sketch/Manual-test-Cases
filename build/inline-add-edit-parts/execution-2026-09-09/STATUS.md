# Execution pass — Inline Add and Edit Parts (6597) — started 2026-09-09

**Order (QA lead, 2026-09-09):** execute the suite on the QA branch; defects created ONE AT A TIME with
his approval between each; passes marked Passed with a line break then a note that it was tested on the
QA branch and will be retested on Staging; every Story Defect linked to its story in epic SV-9315.
Failures: create the defect first (approved), then mark the test Failed, put the defect key in the
result and add a tracking note for the retest.

## Environment established

| Fact | Value |
|---|---|
| Branch | `https://sv9315.qa.shopview.com` (API `sv9315api.qa.shopview.com`) |
| **Build marker** | **`v26.36.0-f43b2fd`** — MOVED since the 2026-09-08 pass (`v26.35.9-7f2e4fa`) |
| Login | DEV MODE quick-login → Admin, via `build/testing-tools/qa-branch-boot.mjs` |
| Identity | `template_slug=administrator`, 42 fe_permissions |
| **View mode** | **`tech`** — with `seeFinancialData: true`, `seeApArData: true`, `viewHistoryLogs: true` |
| Test work order | `b90d6e97-3f47-4745-8cc6-73765802d6ab` — an **Estimate** (editable), 3 lines |
| Route | Work Orders → open the WO → **Lines** tab → expand a line → **`+ Add Part`** (`button_add_part`) |

## Suite state (live from TestRail)

127 cases under group 6597 = **123 ours** + **4 Vladimir Tomovic's (hands-off, Rule 38)**:
C45220, C45268, C53474, C53475. Run **R418** holds **124** tests (123 ours + C45220).
**C45268, C53474, C53475 are NOT in the run** — Vladimir's, so not ours to add.
Run at start of pass: 113 Untested · 10 Blocked · 1 Passed (C45220, Vladimir's).

## 🛑 Proved blocker — Full View is not reachable from this branch's logins

`GET /api/quick-login/users` returns **exactly two** users: `admin` ("Main admin user") and `tech`
("Technician user"). The **admin** user itself reports `view_mode: "tech"`. There is no Full View
quick-login, and the 2026-09-08 session already established that the role editor's Save is disabled
here, so the View mode cannot be flipped from inside the app.

**What it blocks:** the Full View cases only — *Full View Inline Add* (30) and *Full View Edit* (6),
plus the view-mode-specific Bin Allocation case C45232 and C53477.
**What it does NOT block (Rule 68):** *Tech View Inline Add* (25) · *Tech View Inline Edit* (13) ·
*Add Part Button and Edit Control* (16) · *Unsaved Data Protection* (15) · most of *Bin Allocation* (22).

## First observations on v26.36.0-f43b2fd (Tech View) — recorded, not yet written to the run

| Case | Observed | Reading |
|---|---|---|
| C44988 | `+ Add Part` present on each expanded line's Parts area — three buttons for three lines, `data-test-id="button_add_part"` | tracking to PASS |
| C44989 | Clicking it opens the inline row and focus lands in `input_inline_part_description` | tracking to PASS (the "above existing parts" clause still to confirm) |
| C44990 / C44998 | Tech View row carries exactly **Description · Part number · Qty** and no pricing field | tracking to PASS |
| C44991 | `button_edit_part_<uuid>` exists per part at `opacity: 0` — i.e. revealed on hover | tracking to PASS (hover + keyboard-focus reveal still to confirm) |
| C45003 | Row shows **Save** and **Cancel** | **PASS** — the case already states the close action "in Tech View it is labelled 'Cancel'". Checked the wording before calling it a divergence |

**Nothing has been written to TestRail or Jira in this pass yet.**

## Re-stamp note

Cases carry `Last checked against build v26.35.9-7f2e4fa on 9/8/2026`. The branch is now
`v26.36.0-f43b2fd`, so every case verified in this pass gets its Sentence 2 re-stamped to the new
marker and today's date (CLAUDE.md §5, mandatory since 2026-09-08).

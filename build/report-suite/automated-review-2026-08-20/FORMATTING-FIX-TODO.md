# FORMATTING-FIX TODO — TestRail UI Edit→full-stop→Save reflow (2026-08-20)

**Status: ✅ DONE — all 14 cases fixed and verified clean via the TestRail WEB UI (2026-08-20).**

**The QA lead's confirmed interim fix for the `<p>…<br>` render-squash is a TestRail WEB-UI action:**
open the case → **Edit** → add a full stop after any line → **Save**. This re-runs TestRail's clean
render so the stored `<p>…<br>…</p>` renders with real line breaks instead of the literal `<p>`/`<br>`
tags shown as text. It cannot be done over the API (the API returns the stored markdown source; the
squash lives in TestRail's separately-generated rendered output that only a UI Save regenerates).

## Login — SUCCEEDED with the corrected credentials
- The earlier rejection was the OLD password. The **corrected** UI credentials (6th char lowercase L)
  logged in successfully. (Credential held only in `/tmp/testrail-ui.txt`, chmod 600, never written to
  the repo.)
- Login lands on `/index.php?/onboarding`; case view/edit pages are reachable authenticated. (An
  earlier "Please try again" reading was a false body-text match on the onboarding page — authentication
  was confirmed by reaching a case-view page without a login bounce.)

## Mechanics used
- Fresh MITM bridge (`build/testing-tools/staging-bridge.mjs`, port read live from `$HTTPS_PROXY`) +
  Chromium (`/opt/pw-browsers/chromium-1194`) → Playwright.
- TestRail edit page uses the **Froala** rich editor: each field is a `.fr-element.fr-view`
  contenteditable (order: preconditions, steps, expected) backed by a hidden `input#custom_*`.
- Fix per case: open `/cases/edit/<id>` → click into the **Preconditions** editor (index 0, never the
  Expected field, to protect the AUTOMATION marker literal) → `Ctrl+End` → type `.` → wait for
  `#accept` to enable → **Save Test Case**. A net-zero (add-then-Backspace) trigger was tried first but
  TestRail **disables** Save when final content equals the original, so the single `.` (the
  QA-lead-confirmed trigger) is required and is kept. Saving reflows **all three** fields at once.

## Cases fixed and verified clean (14 of 14)
Each verified by re-rendering the view page: **real `<br>` line breaks (numbered items each on their own
line), NO literal `<p>`/`<br>` shown as text, NO `<ol>/<li>`, exactly ONE AUTOMATION marker + ONE
provenance line intact**; and via API: `created_by=3`, expected field ends with its marker un-dotted,
preconds gained exactly one trailing `.` (no double-application).

| C-id | Project / area | Verified render | Marker after fix |
|---|---|---|---|
| [C30380](https://shopview.testrail.io/index.php?/cases/view/30380) | Report Suite / Parts Velocity (DELTA-A) | CLEAN | AUTOMATION: READY |
| [C30381](https://shopview.testrail.io/index.php?/cases/view/30381) | Report Suite / Parts Velocity (DELTA-A) | CLEAN | AUTOMATION: READY |
| [C30382](https://shopview.testrail.io/index.php?/cases/view/30382) | Report Suite / Parts Velocity (DELTA-A) | CLEAN | AUTOMATION: READY - EXPECT FAIL (SV-8818) |
| [C30487](https://shopview.testrail.io/index.php?/cases/view/30487) | Report Suite / WIP (Story-5) | CLEAN | AUTOMATION: READY |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Report Suite / WIP (Story-5) | CLEAN (one-case test) | AUTOMATION: READY |
| [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | Report Suite / WIP (Story-5) | CLEAN | AUTOMATION: READY |
| [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | Report Suite / WIP (Story-5) | CLEAN | AUTOMATION: READY |
| [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | Report Suite / WIP (Story-5) | CLEAN | AUTOMATION: READY |
| [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) | Report Suite / WIP (Story-5) | CLEAN | AUTOMATION: READY |
| [C30520](https://shopview.testrail.io/index.php?/cases/view/30520) | Report Suite / WIP (Story-5) | CLEAN | AUTOMATION: READY |
| [C30524](https://shopview.testrail.io/index.php?/cases/view/30524) | Report Suite / WIP (Story-5) | CLEAN | AUTOMATION: READY |
| [C43818](https://shopview.testrail.io/index.php?/cases/view/43818) | Report Suite / WIP (Story-5) | CLEAN | AUTOMATION: READY |
| [C43838](https://shopview.testrail.io/index.php?/cases/view/43838) | Report Suite / WIP (reworked) | CLEAN | AUTOMATION: HOLD - needs one live build check |
| [C43984](https://shopview.testrail.io/index.php?/cases/view/43984) | Report Suite / WIP (new) | CLEAN | AUTOMATION: HOLD - needs one live build check |

## Scope confirmation
- The final de-duplicated list of 14 was compiled by sweeping this session's audit logs
  (`wip-design-review-2026-08-13/AUDIT-LOG.json` + `exec-aug20b-log.json`,
  `spec-deltas-2026-08-19/EXECUTION.md`) and confirmed against the coordinator's known set — an exact
  match, no extra cases found. All 14 were pre-checked live via the read-only API and were all in
  `<br>`/`<p>` interim form (0 `<ol>/<li>`) before the fix.
- **Failures: none.** All 14 fixed-and-verified-clean.
- **Nothing else touched:** no test run, no result, no Jira, no foreign case (every case `created_by=3`).
  UI case-edit only. The single trailing `.` added to each case's last precondition line is the
  QA-lead-confirmed reflow trigger (kept off the Expected/marker field).

## Note (unchanged deferred item)
Local case mirrors were **NOT** regenerated — the local `<br>` source cleanup is the separate deferred
debt item and was deliberately left untouched.

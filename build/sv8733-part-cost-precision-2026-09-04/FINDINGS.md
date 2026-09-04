# SV-8733 — Part cost inconsistent between Edit Part Request window and Bulk Receive, rounds on reopen — QA

**Ticket:** https://shopview.atlassian.net/browse/SV-8733 (Bug, TESTING QA, priority Low, assignee Slavcho Mitrov, reporter Ayesha Khan)
**QA branch:** https://sv8733.qa.shopview.com/workorders
**Build marker (read live, start/mid/end — unchanged):** `v26.35.7-65e7373`, index.html last-modified Thu 03 Sep 2026 11:58:29 GMT, etag `f7be2ce98aee29f0655bf0077dd5493a`.
**Verdict: PASSED.** Per-ticket QA branch; a QA pass makes the branch final (Rule 62), so these verdicts are not provisional.

## The reported bug (ticket description — tested per Rule 66)
A part cost entered with decimals shows different values across screens, and the Edit Part Request window rounds it on reopen:
1. Request a part on a WO line, enter cost **$45.78900**.
2. Save & Close, reopen the **Edit Part Request** window → cost was rounded to **$45.79000** (not re-saved).
3. Open the **Bulk Receive** page for the same part → it showed **$45.78950**.

Expected: the entered cost is preserved consistently across the Edit Part Request window and the Bulk Receive page, without rounding or reformatting on reopen.

## Dev handoff (Slavcho, PR #2872 — read per Rule 66, supplementary)
Root cause: the Lines-tab part dialog seeded its Cost field from the legacy cent-rounded `cost` column instead of the row's own 5-decimal `cost_decimal`, so `45.789` reopened as `45.79000`. Because the dialog posts back whatever it was seeded with, merely opening it and pressing Save & Close (changing nothing) overwrote the stored cost **and** the linked purchase-order item — which is why Bulk Receive then agreed at the rounded number. Fixing the read fixes the write-back. Baseline for the E2E (C45218) is the Parts-tab inline Cost cell (an independent surface). Related-not-fixed (separate ticket): `PartsManager::updatePartsForPartRequest()` writes `setCost()` without `setCostDecimal()` — out of scope here.

## Test data (live on the branch, disposable — no cleanup on QA branches)
WO **S8733-17358** (id d973d775…), line **"Repair - CW rotation solenoid valve on valve bank"**, part **"Seal Kit" C1095574**, vendor **GCM Truck Repair - Tysons**. Workplace Staging Heavy Duty - 9919.

## Per-check results
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Enter $45.78900 in Edit Part Request → Save & Close → **reopen shows $45.78900**, not $45.79000 | **PASS** | exhibit-01/02; dialog reopen read `45.78900` |
| 2 | No-op Save & Close (change nothing) does not round the stored cost | **PASS** | API: `cost_decimal` stays `45.789` before and after |
| 3 | No-op Save & Close on the **ordered** part does not corrupt the **linked PO item** | **PASS** | PO item `price_decimal` stays `"45.78900"` before and after |
| 4 | Parts-tab inline Cost cell (dev's independent baseline surface) = $45.78900 | **PASS** | inline `input_cost` read `45.78900` |
| 5 | **Bulk Receive** (Receive Vendor Parts) for the same part = $45.78900, not $45.78950 | **PASS** | exhibit-03; page text `$45.78900` |
| 6 | All three screens consistent at $45.78900 | **PASS** | dialog + inline + Bulk Receive all agree |

## API truth (corroborates the screens)
- After entering 45.789 via the dialog + save: part request `cost=45.79` (legacy 2-dp column, by design) / `cost_decimal=45.789` (true value).
- After a no-op Save & Close: **unchanged** (`cost_decimal=45.789`).
- PO order `05d729a8`, item `63bc67a1` (C1095574): `price=45.79`, **`price_decimal="45.78900"`**, `total_cost_decimal=45.789`.
- After a no-op Save & Close on the ordered part: PO item **unchanged** (`price_decimal="45.78900"`).

The legacy `cost`/`price` columns still display `45.79` (2-dp) by design; the true 5-decimal value lives in `cost_decimal`/`price_decimal` and is now read into the dialog, written back unchanged, and displayed consistently on the Parts tab and Bulk Receive.

## Honest split (UI vs API)
- **Thing under test = UI-observed, live:** the Edit Part Request dialog round-trip (enter → save → reopen), the Bulk Receive page cost, and the Parts-tab inline cost were all driven/observed in the browser.
- **Setup/corroboration = API:** reading `cost_decimal`/`price_decimal`, approving the line, and advancing the part to Awaiting (to create the PO for Bulk Receive) used the API. The dialog edits and the no-op saves that prove the fix were done in the UI dialog.

## Out of scope / not tested
- The dev's related-not-fixed staged-part path (`updatePartsForPartRequest` missing `setCostDecimal`) — the dev flagged it for its own ticket; not part of this fix.

## Pre-post bite-proof gate (run immediately before posting — Standing Rule 72)
- Build marker re-read LIVE right before posting: `v26.35.7-65e7373`, last-modified Thu 03 Sep 2026 11:58:29 GMT, etag `f7be2ce98aee29f0655bf0077dd5493a` — IDENTICAL to test time (no redeploy).
- All 3 evidence image URLs curled → HTTP 200.
- Ticket re-read: status still TESTING QA, still 2 comments, no scope change since testing.
- Text-node fingerprint scan clean (only "claude" occurrence is inside image URL path = branch name, not reader-facing).
- Posted comment read back: verdict line + 6-row table + 3 inline images + technical-last confirmed.

## POSTED
QA comment posted to SV-8733 — comment id **76030** (2026-09-04). Verdict PASSED. Link: https://shopview.atlassian.net/browse/SV-8733?focusedCommentId=76030

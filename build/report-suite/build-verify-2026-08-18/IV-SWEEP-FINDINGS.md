# IV RE-VERIFY SWEEP — findings (2026-08-19, build v3.8-d0e135e)

## §8.5 HARD GATE — 0 cases skipped for data-seeding or login reasons
All 14 in-scope IV cases were driven live. None is a trivially-seedable data-state or an obtainable-login
skip: the no-category part is app-enforced-unobtainable, the one-location user does not exist on this env
(switch-user 400), the nightly-capture rows are server-side and unreadable (404-probed). The 44 already-
fresh-stamped READY cases were left as-is (Rule 60 same-minor); the 11 Automated cases were held (Rule 71).

## SV-8818 EXPECT-FAIL (6) — re-confirmed live, kept
| C-id | evidence on v3.8-d0e135e |
|---|---|
| C30587, C30590, C30591, C30593, C30595, C43548 | IV **PDF export → HTTP 500** on the large all-locations view; **CSV export → HTTP 200 (~702 KB)**. SV-8818 reproduces. Ticket **Open / Low** (cached authoritative capture). Marker `READY - EXPECT FAIL (SV-8818)` + symptom/three-outcome block KEPT; sentence-2 re-stamped to v3.8-d0e135e. |

## HOLD (8) — re-driven live, characterized
| C-id | internal | live re-verification on v3.8-d0e135e | why HOLD |
|---|---|---|---|
| C30547 | IV-* (no-category part) | `POST /api/inventory/parts` = 405 (GET-only; no create endpoint); parts require a category on this build. | No-category part is app-enforced-unobtainable. |
| C30577 | IV-* (one-location Location filter hidden) | 0 of 19 roster staff single-workplace; switch-user = HTTP 400. Positive half (filter shown for multi-location users) confirmed. | One-location user does not exist on this shared env. **FLAGGED: provision a one-location test user.** |
| C30605, C30606, C30607, C30609, C30610, C38892 | IV-* (nightly snapshot / retention) | Snapshot-read endpoints all HTTP 404 — the nightly capture is a server-side job, its rows not reachable from the application. | Background-process state unreadable from the product. |

## Flagged for the QA lead (no ticket created — Rule 62 / creation hold)
1. **C30577** needs a **one-location test user** (same ask as TU-LOC-05 / C30446) — or acceptance of the
   characterization.
2. **SV-8823 sub-claim (NOT re-verified this pass):** whether the IV CSV honours column-selection-in-export
   (C30588 keeps its SV-8823 note; C30588 is an Automated case held this pass). Verify before closing the
   money portion of SV-8823.

## No new defects
No new deviation found for the 14 in-scope IV cases on v3.8-d0e135e. SV-8818 continues to reproduce (kept
EXPECT-FAIL). All 8/18 IV reopen/close adjudications live on the 44 already-stamped cases, left as-is.

## OUTSTANDING — what I need from you
- A **one-location test user** for C30577 (shared with TU-LOC-05).
- Whether to attempt deeper seeding for the nightly-capture / no-category states, or accept the
  characterizations.

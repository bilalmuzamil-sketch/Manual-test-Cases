# WIP RE-VERIFY SWEEP — findings (2026-08-19, build v3.8-d0e135e)

## §8.5 HARD GATE — 0 cases skipped for data-seeding or login reasons
All 7 in-scope WIP cases were driven live. None is a data/login skip: 2 are confirmed deviations awaiting a
ticket (creation hold), 4 are background-process (nightly-capture) limits confirmed by 404 probes, 1 is an
over-cap state the data cannot structurally reach. All 71 already-fresh-stamped READY cases were left as-is
(Rule 60 same-minor); the 14 Automated cases were held (Rule 71).

## HOLD (7) — re-driven live, characterized
| C-id | internal | live re-verification on v3.8-d0e135e | status |
|---|---|---|---|
| C30467 | WIP-COL-02 | **Location is NOT in the Column Selection control** (WO #, Status, Customer, Asset, VIN, Advisor, Days Open, Last Activity, Labor Earned/Remaining, Parts Earned/Remaining, Earned, Remaining, Adjustments, Labor Delta — no Location) — deviation from the ratified Location rule. | HOLD — confirmed deviation; **needs a ticket** (Jira creation on hold, register H1). |
| C43551 | WIP-PERS-05 | Same — Location cannot be toggled in the selector, so a hand-made Location choice cannot be made/remembered. | HOLD — same deviation, needs a ticket. |
| C30528 | WIP-* (nightly snapshot rows) | Snapshot-read endpoints 404 — nothing in the product reads the nightly capture back. | HOLD — background-process limit. |
| C30530 | WIP-* (captured Earned/Remaining maths) | Same — capture unreadable from the product. | HOLD — background-process limit. |
| C30531 | WIP-* (snapshot spans all locations) | Same. | HOLD — background-process limit. |
| C30533 | WIP-* (nothing-approved captured at $0.00) | Same. | HOLD — background-process limit. |
| C38918 | WIP-EXP (over-cap download refused) | Largest tab = Estimates 1067 rows; no tab nears the export cap; exports work at actual size. | HOLD — over-cap state structurally unreachable. |

## Confirmed built on v3.8-d0e135e (context)
- **Adjustments column IS built** (visible header + in the Column Selection control) — matches the 8/18 finding.
- Four tabs + counts, export menu (PDF/CSV), Column Selection all present.

## PO question (do NOT force — per task)
The **v22 spec self-contradiction — S2-R4 ("appears once, in one tab") vs the §3 SV-9027 line-state Key
Decision ("appears in each matching tab")** — remains a **Chris Ward PO question**, not resolved from the
build (Rules 32/57/58). Register rows RS-WIP-3/4/5. Not forced; the multi-tab cases (C30458/C43979) sit in
the 71 already-stamped set, left as-is.

## Flagged for the QA lead (no ticket created — Rule 62 / creation hold)
1. **C30467 / C43551 (Location rule deviation)** — Location is not toggleable in the WIP Column Selection
   control, contrary to the ratified Location rule. One edit from EXPECT-FAIL once a ticket is authorised.
2. **WIP spec self-contradiction (S2-R4 vs SV-9027)** — Chris Ward PO answer needed.

## OUTSTANDING — what I need from you
- Permission to file the **Location-rule deviation ticket** (unblocks C30467/C43551 → EXPECT-FAIL).
- **Chris Ward's answer** on the WIP tab-placement contradiction (S2-R4 vs SV-9027).

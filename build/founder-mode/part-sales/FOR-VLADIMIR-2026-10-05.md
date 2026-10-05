# For Vladimir — 9 Automated Part Sales cases changed on 5 October 2026

The Part Sales specification (Confluence 867434569) was edited on 5 October 2026. The QA lead approved
updating our cases to match (and asked that every precondition be runnable by a manual tester). Nine of
the cases carry TestRail's **Automated** flag, which is unchanged. Please adjust your automation.

Every one now ends with `AUTOMATION: HOLD - updated to the 5 October 2026 specification; not yet
re-checked on a Part Sales build` (was `AUTOMATION: READY`, checked on build v26.39.2-210868d on 1 Oct).

| Case | New title | What changed for automation |
|---|---|---|
| C154586 | Core charge shows on the estimate and counts toward the totals | Setup rewritten (vendor, new sale, core line; sale tax set to GST 5%). Quote punctuation only. Behaviour unchanged. |
| C154589 | Cancel Return restores the charge after a confirmation | Setup rewritten (vendor, Order, Receive, Return Core). Quote punctuation only. Behaviour unchanged. |
| C154601 | Receiving a part-sale core tags it Charged | Setup rewritten (part ordered, not received; work order core ordered for comparison). Quote punctuation only. |
| C154603 | A zero core is refused; a picked inventory core bills its price | Setup rewritten (inventory core at $85.00 vs quoted $79.99). Step 1 now "read the message shown". Quote punctuation only. |
| C154593 | Return Core returns the whole of one received core row | **Behaviour changed:** 10 ordered, 6 received → core row of 6, Return Core returns those 6; the 4 owed get their own core row. "Return all then split" is gone. |
| C154597 | Reversing keeps the core rows; an auto-applied deposit blocks it | **Behaviour added:** reversal refused while an auto-applied deposit is applied; reverse the payment → deposit back to Held → invoice reversible → next invoice re-applies it. |
| C154611 | A Complete part sale with received parts gets the received-parts refusal | **Behaviour changed:** refusal uses the received-parts message, never the "Completed" one. The "Complete with nothing received deletes" half is API-only per spec — automation's to cover. |
| C154618 | Sales Representative locks once invoiced and unlocks on reversal | **Behaviour added:** reversing the invoice unlocks the rep; next invoice captures it afresh. |
| C154624 | A split leaves the deposit, may move every line, carries the core | **Behaviour added:** a split may move every line (original keeps deposit, no lines); held deposit can be reversed and re-added on the new sale. |

Two parts of the updated suite are explicitly left to automation (not doable by hand): C154591 (core
action sent by another route is refused) and C154634 (Customer Portal unreachable → hand-off declined).
Both are non-Automated cases today.

Before/after copies of every case: `build/founder-mode/part-sales/snapshots-2026-10-05/`.

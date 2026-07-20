# Label-reconciliation batch — two spec renames vs the case wording

> Part of the 2026-07-15 spec-recheck. These are **wording** corrections (Standing Rule 9),
> handled as a batch because they are mechanical find-replace and because they need a
> **live-build label confirmation** before pushing (Rule 12 — do not infer a label; observe it).
> They are surfaced in the proposed-corrections sheet as verdict **UPDATE (label — confirm live)**.

## Rename 1 — "View and Manage AP/AR Data" → "Manage Accounts Payable and Receivable"

- **Spec basis:** Change Log 6/10/2026 (Sasha): *"Modified the setting label. Formerly, View and
  Manage AP / AR. Now, Manage Accounts Payable and Receivable."* Confirmed in §5b of the current
  (7/15) spec.
- **⚠ Live-confirm needed:** the 2026-07-13 build-accurate WORDING+VIU pass LEFT the old label
  "View and Manage AP/AR Data" in 32 cases. That strongly suggests the STAGING BUILD still
  displayed the old label on 2026-07-13. So before pushing: **check the live label**. If the
  build now shows "Manage Accounts Payable and Receivable", update all 32. If the build still
  shows the old label, the cases are build-accurate and the **spec-vs-build label is out of
  sync — flag to PO/dev** (do not silently rewrite to a label the build doesn't show).
- **Affected cases (32):** C26355, C26359, C26399, C26401, C26402, C26403, C26418, C26422,
  C26424, C26475, C26476, C26477, C26478, C26479, C26480, C26481, C26482, C26483, C26484,
  C26485, C26486, C26495, C26496, C26497, C26498, C26499, C26501, C26503, C26504, C26505,
  C26549, C27736. (C27736's expected result IS the label string — highest priority.)

## Rename 2 — "View History Logs" → "View Part History" (+ relocation)

- **Spec basis:** Change Log 7/7/2026: *"Changed 'View History Logs' → Relabel 'View Part
  History'. Only controls viewing Part History. Setting lives under Part Sales as last in the
  list."* §1h in the current spec. Audit logs moved to WO Create & Edit; WO/line story history
  to WOL View — so "View Part History" now ONLY governs the Part History icon on the inventory
  page, and it is no longer a cross-cutting toggle (it sits under the Parts group).
- **⚠ Build status — SV-8202 OPEN (Ready to Fix):** *"Legacy 'View History Logs' setting still
  present — must be replaced by Parts-scoped 'View Part History' (§1h)."* So the build STILL
  shows the legacy toggle. The cases should be updated to "View Part History" (spec-authoritative,
  last-update-wins) but will only pass once SV-8202 ships; cite SV-8202 so the tester/automation
  knows the mismatch is a known open build defect, not a case error.
- **Affected cases (9):** C26355, C26359, C26485, C26488, C26489, C26495, C26502, C26504, C27736.
  - **C26488 / C26489** are the biggest behavioral concern: they test what "View History Logs
    ON/OFF" shows for WORK ORDER + LINE history. Per the 7/7 spec that behavior MOVED — WO/line
    audit log now follows **WO Create & Edit**, WO/line story history follows **WOL View** — and
    "View Part History" governs only inventory Part History. These two cases are **repurposed by
    the spec**, not just relabeled (see findings-G4 for C26488/C26489 treatment).

## How this appears in the deliverable

The corrections workbook lists each affected case once. Label-only rows carry verdict
**UPDATE (label)** with the find-replace and the live-confirm caveat; the behaviorally-repurposed
rows (C26488/C26489) carry a full UPDATE with new steps/expected. Nothing here is pushed to
TestRail — it is a proposal for Bilal & Vlad to confirm against the live build first.

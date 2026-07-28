# Report Suite — A quick check on who can open each report — 2026-07-28

> DRAFT — for Chris / dev. Not sent yet. Plain-language product question only (no test jargon).

**What happens now**

You told us each report should just use the normal reports permission — the standard
"can this person see reports" setting — for all of them.

But the version that is actually built right now does not work that way. It controls
the reports in a mixed way:

- Most reports use the normal reports permission, like you said.
- A few reports use different permissions instead. For example, one report is tied to
  its very own separate permission, and a couple of reports use the inventory-reports
  permission (the one that decides who can see inventory reports).

So the way it is built today and the answer you gave us do not match. We want to get
this right before we lock in our tests for who can and cannot open each report.

**The question**

Which way should it work — everything on the one normal reports permission, or the
mixed way it is built today?

**Options**

- **A)** Change the build so that every report uses the single normal reports permission
  (the way you described).
- **B)** Keep the mixed way the build works today (some reports use the normal reports
  permission, a few use their own or the inventory-reports permission).

**Your answer:** ____________________

---

## QA-only (internal, not for Chris)

Technical mapping of the discrepancy — keep for our own reference; do NOT put this in
front of Chris. C-ids from `build/report-suite/testrail-id-map.csv`
(links: https://shopview.testrail.io/index.php?/cases/view/<id>).

**Chris's stated intent (Q2 = B, 2026-07-28):** "these should be gated by normal reports access."

**What the build actually shipped (mixed model, as authored in our cases):**

| Report | Shipped gating (build) | Driving story |
|---|---|---|
| Sales By Customer | dedicated atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` | SV-8598 / B5 |
| Parts Velocity | Inventory Reports → View | SV-8596 / B3 |
| Inventory Value | `ROLE_REPORT_VIEW` (report-view / inventory-reports family) | SV-8597 / B4 |
| Sales By Representative | rides the Performance reports group | SV-8599 / B6 |
| Technician Utilization | reuses timesheet-reports access | (TU nav) |
| WIP (Work In Progress) | reports access | (WIP perm) |

**Affected permission cases (KEPT AS AUTHORED per user Ruling 1 — do NOT edit until the
discrepancy is resolved):** SBC-PERM-01/02 (C30098/C30099); SBR-PERM-01/02
(C30198/C30199); PV-PERM-01/03 (C30325/C30327); TU-NAV-01/07 (C30392/C30397);
WIP-PERM-01/02 (C30526/C30527); IV-PERM-01/02 (C30603/C30604).

**Resolution path:**
- Option A (dev changes the code to a single normal-reports permission) → then revise the
  permission cases to the unified model and VIU-confirm live.
- Option B (keep the mixed model) → the cases already match; VIU-confirm the exact
  per-report permission names live at the QA branch.

Either way, the actual live gating per report must be VIU-confirmed on the Report Suite
QA branch during the queued SPEC-RELEVANCE-RECONCILIATION + VIU pass (user Ruling 2).

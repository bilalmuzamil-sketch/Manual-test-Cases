# Report Suite — the PO has ruled on report permissions, and the build does not match

**For:** engineering (Report Suite squad) + Chris Ward (spec text)
**Raised by:** QA, 2026-07-31 · **Not a QA opinion — a PO ruling that the build contradicts.**

## In plain words

Chris Ward (the product owner) has now said **twice** that every report in the Report Suite should
open for anyone who has the ordinary "can this person see reports" access. **There should be no
report that needs its own special permission.**

The build does something different for **one** report — **Sales By Customer** — which is given its
own separate permission. So the build and the product owner's decision do not match. Someone needs
to change the build (or Chris needs to change his mind — but he has now been asked twice and did
not).

## His exact words

Asked (2026-07-30): *"Which should it be — the normal reports permission for everything, or the
separate permission that is built today?"*
Options were A = change it to the normal reports access, engineering adjusts the build · B = keep
the separate permission that is built today.

> **"A - the intention is to not hide these from normal reports access. These were specced before
> CRP was built :)"**
> — Chris Ward, 2026-07-31

("CRP" = Custom Roles & Permissions. His point: the Sales By Customer spec was written before Custom
Roles existed, which is why it invented its own permission.)

He said essentially the same thing on **2026-07-28**: *"these should be gated by normal reports
access."* The re-ask was deliberately sharpened with the engineering plan's own citations, and he
did not move.

## What is actually built / specified today

| Source | What it says |
|---|---|
| **Engineering tech plan, §B5.3** | Every Sales By Customer endpoint gates on a **new dedicated permission atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`**, NOT the general `ROLE_REPORT_VIEW`. |
| **Engineering tech plan, decision #5** | The plan itself flags where that new atom sits in the permission bundle as *"a product-level decision to surface"* — i.e. the plan expected Chris to make this call. **He has now made it.** |
| **SBC spec, live v12 (2026-07-29), S1-R2 — verbatim** | *"The report is gated by a dedicated Sales By Customer report View permission — it is not tied to a generic 'all reports' permission."* |
| The other five reports | Each reuses an existing reports permission and adds no new atom — consistent with his ruling. |

So Sales By Customer is the single odd one out. This is the "mixed model" QA has been flagging since
2026-07-28.

## What needs to happen

1. **Engineering:** drop the dedicated `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` gate and gate the Sales
   By Customer report (page + its data and export endpoints) on the ordinary reports permission,
   the same way the other five reports do. **Raise this as a change ticket against the Report Suite
   epic (SV-8582).**
2. **Chris:** update **SBC spec S1-R2** — it currently states the opposite of his own ruling.
3. **QA (done):** the three affected test cases have been moved to his ruling, so they will FAIL
   against today's build until the change lands. That is intended — the failure IS the report of
   this gap. Cases:
   - **SBC-PERM-01 = C30098** — https://shopview.testrail.io/index.php?/cases/view/30098
   - **SBC-PERM-02 = C30099** — https://shopview.testrail.io/index.php?/cases/view/30099
   - **SBC-NAV-01 = C30096** — https://shopview.testrail.io/index.php?/cases/view/30096

   Each carries a plain note telling the tester that if the build still enforces a separate
   permission, that is this known pending change — report it, do not edit the test.

## One thing still to settle with Chris (not blocking the above)

The other five reports each cite a **different existing per-area reports permission** (Inventory
Reports → View for Parts Velocity and Inventory Value; the timesheet-reports permission for
Technician Utilization; the Work In Progress reports permission). Those are all reports permissions,
so his stated intent is already met — but whether he wants them **collapsed into one single Reports
permission** was not asked and has not been answered. QA has NOT changed those cases. Queued as a
follow-up question.

## Honesty note

Nothing here was observed in a running build (Rule 12) — the Report Suite QA branch is not available
to QA yet. The build behaviour above is taken from the **engineering tech plan** and the **spec
text**, both quoted verbatim. The permission behaviour must still be confirmed live when the branch
exists.

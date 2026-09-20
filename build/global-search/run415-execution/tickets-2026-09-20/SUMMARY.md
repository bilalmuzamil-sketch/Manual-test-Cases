# Tickets raised 20 September 2026

The QA lead's instruction: *"Create every ticket that is needed to be created and mention the test
case run link at the bottom of that ticket … Also just like that part sales issue see if something
else has also been broken and not yet reported for permissions."*

## Raised

| Ticket | What it is | Parent story (status read live) |
|---|---|---|
| **SV-10277** | the maximum score is reached on a name match alone, so stock, open work orders, recent use and match closeness stop ordering results | SV-9165 — **TESTING QA** |
| **SV-10278** | removing financial access hides the whole **Part sales** heading, for a role that holds Part Sales access | SV-9162 — **Ready for QA** |

Both end with a **Test Coverage** section carrying each check and its run link, and both carry a
**Sources** section quoting the PRD verbatim with the page id, version and read date.

Comment added to **SV-10188** (already *QA Complete*): the fault still reproduces on this build, with
the evidence, the PRD 6.3 quote and the run link. A completed ticket is not ours to reopen.

## Exhaustive permission sweep — one anomaly, and it is the one filed

Every role × every query × every record type from `perm-results.json`, diffed against full access:

| role | headings removed | matches the §4 bundle mapping? |
|---|---|---|
| Parts removed | parts | yes |
| Work Orders removed | work_orders | yes |
| Customers removed | customers, assets | yes |
| Work Orders + Vendor & Order removed | work_orders, vendors, purchase_orders, vendor_invoices | yes |
| Part Sales removed | part_sales | yes |
| Vendor & Order removed | vendors, purchase_orders, vendor_invoices | yes |
| **Financial Data removed** | **part_sales** | **NO — this is SV-10278** |

Prices were lost **only** when financial access was removed, and then on parts (3→0), purchase orders
(4→0), vendor invoices (4→0) and work orders — correct in every case. Row counts on untouched headings
never moved. **Total anomalies: 1.**

## NOT raised, and why

| Finding | Why no ticket |
|---|---|
| Quick actions absent from every result row | Owning story **SV-9173** is **OBSOLETE**. Rule 112 forbids a defect against a story that is not Ready for QA or Testing QA. The PRD still requires the feature, so C44866–C44873 are **Blocked** with the contradiction named, and the decision is the QA lead's. |
| C44854 (parts already on a work order) | Its ticket **SV-10188** already exists and the root cause is **SV-10277**. Commented rather than duplicated. |

## Rule overridden, and named (Rule 63)
The recorded ticket layout ends at **Sources** and bars case ids and run links from a Jira description
(QA lead, 2026-09-16/17). His instruction today is the opposite — *"mention the test case run link at
the bottom of that ticket"* — so a **Test Coverage** section now follows Sources on both tickets.
Latest wins (Rule 32); the older ruling is superseded and dated in the skill.

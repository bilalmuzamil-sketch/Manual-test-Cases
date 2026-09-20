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


---

## CORRECTION, same day — SV-10278 was WRONG and is withdrawn

The QA lead: *"This is an expected behaviour that part sales is tied to Financial data, so if you
disable financial data the part sales automatically gets disabled."* The roles and permissions screen
says it outright: **"Part Sales requires See Financial Data. Enable it to grant this permission?"**

So the only anomaly my sweep found was not an anomaly. **The permission behaviour on this build is
correct in every case measured.**

**What I did about it:** withdrawal comment posted on SV-10278 naming my mistake · all three
`relates to` links removed (SV-9162, SV-10161, SV-10277) · transitioned to **OBSOLETE** ·
**the parent field could NOT be cleared** — Jira answers *"You can not remove a subtask's parent"* for
this issue type, so SV-9162 still shows as its parent although the ticket is obsolete and unlinked.
Never deleted (rule G4).

**What I got wrong, precisely:** I read the role's permission list back from the application, saw
`partSalesView` still in it, and treated that as proof the role held the permission. A permission list
is data; the dependencies BETWEEN permissions are rules, and the rules live on the roles and
permissions screen, which I never opened. Recorded as a standing rule in `06-DEFECT-PREP.md` and as
learning **L0171**.

**C44882's recorded result was rewritten** to state the dependency as correct behaviour rather than
pointing at a separate report.

## Gaps closed after access was restored

| Check | Result |
|---|---|
| **C44880** records from another organisation | **Passed** — the branch holds 2 organisations; ours owns 499 companies, the other owns 1 (`Counter Sale`), which search never returns. Caveat recorded: a one-record sample. |
| **C55717** recently viewed respects current access | **Passed** — a technician opened a work order and it appeared in their recently viewed list; with work-order access removed, every work order entry is gone and only customers remain. |
| **C55718** an exact record number you cannot reach | **Passed** — typing `S9160-17671` with access returns it and pins it at the top; without access it returns nothing at all and every heading is empty. |

Technician role restored and read back in both runs (`c55717_18.json`, `"restored": true`).

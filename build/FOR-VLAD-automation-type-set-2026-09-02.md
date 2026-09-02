# Rule 65 notice for Vlad — Automation Type field set on 12 Automated cases (2026-09-02)

**What changed:** the QA lead (Bilal Muzamil) directed that every case in the three active
Work-Orders suites have its **Automation Type** field set (it was `None` on all but one). Only that
one field (`custom_automation_type`) was written — no title, precondition, step, expected, marker or
automation-status change. `custom_atmstatus` was **not** touched and remains **3 (Automated)** on
every case below.

**Why you're told:** Rule 71/65 — these 12 cases are TestRail-flagged **Automated**, so you get a
heads-up whenever anything on them changes, even a metadata field. The QA lead gave the explicit
go-ahead to include them (2026-09-02).

**Vladimir Tomovic's own case C45220 was NOT touched** (Rule 38 — never edited). It already read E2E.

| Suite | Case | Automation Type set |
|---|---|---|
| Invoice UI Refresh | C44919 | Functional |
| Invoice UI Refresh | C44920 | Functional |
| Invoice UI Refresh | C44921 | Functional |
| Invoice UI Refresh | C44922 | Functional |
| Invoice UI Refresh | C44985 | Functional |
| Inline Add & Edit Parts | C45005 | Functional |
| Inline Add & Edit Parts | C45026 | Functional |
| Inline Add & Edit Parts | C45223 | Functional |
| Inline Add & Edit Parts | C45224 | Functional |
| Inline Add & Edit Parts | C45227 | Functional |
| Inline Add & Edit Parts | C45237 | Functional |
| Printer Friendly WO | C45123 | E2E |

Case links: `https://shopview.testrail.io/index.php?/cases/view/<id>`

Full per-case audit (old → new, verified read-back): `build/Automation-Type-audit-2026-09-02.json`.
Whole-suite record: `build/Automation-Type-Classification-2026-09-02.xlsx`.

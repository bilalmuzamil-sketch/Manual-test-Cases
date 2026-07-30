# Schedule — Tech-Plan Reconciliation Change List — 2026-07-29

Plain summary: the engineering build plan for the Schedule rewrite was compared against
all 177 Schedule test cases. Result: **13 new test cases** (staged locally), **2 small
wording improvements** to existing cases, **14 internal caution notes** (nothing the
tester sees), and **5 new questions** for Branko/dev where the plan disagrees with the
product write-up or design. **Nothing has been written to TestRail — the push queue
below awaits your authorization.** All new content is pending live verification (the QA
branch does not exist yet).

## A. PUSH QUEUE — awaiting authorization (2 add_section + 13 add_case + 2 update_case)

### A.1 New sections (2 × add_section under group 4254)
| Section | Holds |
|---|---|
| Cross-Module and Rewrite Regression | SCH-REG-01..05 |
| API — Schedule | SCH-API-01..04 (Rule 4) |

### A.2 New cases (13 × add_case — new, no C-ID yet; blank in testrail-id-map.csv)
| Internal ID | Title | Source anchor | What it protects (plain) |
|---|---|---|---|
| SCH-SPREAD-11 | Spread past 8 weeks asks to confirm; a series can never exceed 120 shifts | SV-8691 §4.5 + tech-plan D8 | Stops runaway multi-month series being created by accident |
| SCH-DEL-10 | Schedule actions save immediately - Undo reverses them, closing does not cancel | SV-8688 §7 + tech-plan D10 | Tester knows a change surviving a refresh before Undo is expected, and a lost action IS a bug |
| SCH-EDGE-07 | A multi-week series keeps the same local start time across the clock change | SV-8691 §4.5 + tech-plan D2 | Shifts must not silently move an hour at the daylight-saving change |
| SCH-EDGE-08 | Schedule and all its dialogs display correctly in dark mode | epic + tech-plan §6 checklist 13 | New screens must stay readable in dark mode |
| SCH-REG-01 | Shifts and events created before the Schedule rewrite still appear after it | epic + tech-plan §3 FR-015 | The rewrite must not lose anyone's existing schedule |
| SCH-REG-02 | Dashboard shows one schedule row per work order even with many shifts | epic + tech-plan §4 FR-016 | The new single combined dashboard row is the intended fix, not missing data |
| SCH-REG-03 | A work order created with an appointment shows up on the Schedule board | epic + tech-plan §4 | Creating a WO with an appointment must still schedule it |
| SCH-REG-04 | A multi-location technician's shift appears only on the work order's location | epic + tech-plan §3 | Intended change - the shift no longer shows on every location the tech works at |
| SCH-REG-05 | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | SV-8687 §5.1 + tech-plan FR-P4 | The new Priority field the sidebar filter depends on |
| SCH-API-01 | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | epic §14 + tech-plan §4 | Back-end actually enforces the three permission tiers |
| SCH-API-02 | API - Series past 8 weeks returns 409 until acknowledged; over 120 shifts 422 | SV-8691 + tech-plan D8 | The caps hold even for direct API callers |
| SCH-API-03 | API - No pricing fields in Schedule responses; WO details need Work Orders View | epic §14 + tech-plan D6 | No money data can leak through the schedule |
| SCH-API-04 | API - A shift from another location returns 404, not another shop's data | tech-plan NFR-001 | One shop can never read another shop's shifts |

### A.3 Edited cases (2 × update_case — tester-facing)
| Case | C-ID / link | Change | Why (plain) |
|---|---|---|---|
| SCH-WOL-05 | C29940 — https://shopview.testrail.io/index.php?/cases/view/29940 | Added expected #3: with very many work orders the list may load further results in pages as you scroll — expected, not a fault | The list is served page-by-page behind the scenes; without this line a tester could report paging as a bug |
| SCH-VIEW-03 | C30044 — https://shopview.testrail.io/index.php?/cases/view/30044 | Added expected #4: a user with no technician record does not see the 'My Shifts' option at all | New behaviour from the build plan (fixes an old stub); tester should check it, not report the missing option as a bug |

## B. LOCAL-ONLY (no TestRail write needed)
- **14 notes-only flags** (QA-internal metadata; notes never reach TestRail):
  SCH-CONF-01 (C30023), SCH-CONF-02 (C30024), SCH-SPREAD-07 (C29983), SCH-SPREAD-08
  (C29984), SCH-START-08 (C29976), SCH-EDGE-02 (C30086), SCH-EDGE-05 (C30089),
  SCH-DEL-09 (C30065), SCH-HRS-01 (C38846), SCH-HRS-02 (C38847), SCH-HRS-05 (C38850),
  SCH-HRS-06 (C38851), SCH-HRS-07 (C38852), SCH-REAS-06 (C38855).
- **HELD, untouched (pending Branko):** SCH-EVT-08 (C30615), SCH-CAP-01..04
  (C30030–C30033), SCH-MODAL-08 (C30015) — the plan informs Q1/Q2 but does not settle
  them (QA-internal appendix updated in PO-Questions-Branko-Schedule-2026-07-27.md).

## C. BLOCKED-ON-AN-ANSWER (second tab — do not push, decision pending)
| Case(s) | C-ID(s) | Pending question | Driving conflict |
|---|---|---|---|
| SCH-EDGE-05, SCH-SPREAD-07, SCH-SPREAD-08 | C30089, C29983, C29984 | NQ-1 (Questions-for-Branko-dev.md) | Plan skips closure days in spread; Jira V1 rule says it doesn't |
| SCH-CONF-01, SCH-CONF-05 | C30023, C30027 | NQ-2 | Is double-booking counted in the conflicts counter? |
| SCH-HRS-01, SCH-HRS-02 | C38846, C38847 | NQ-3 | Business hours in Edit Location vs a new Schedule Settings admin page |
| SCH-HRS-05..07 | C38850–C38852 | NQ-4 | Split-shift 'Add hours' vs the plan's one-range-per-day model |
| (new case only if answer = A) | — | NQ-5 | Own-data-only technicians editing only their own shifts |
| SCH-EVT-08 + SCH-CAP-01..04 | C30615, C30030–C30033 | Q1 (held) | Events counting toward capacity |
| SCH-MODAL-08 | C30015 | Q2 (held) | Modal Reassign button |
| SCH-EXP-01/02 | C38853/C38854 | Q3 (held) | Week Export in V1 (plan has no export requirement) |

## D. What needs to be done (plain)
1. You authorize the push → we run 2 add_section + 13 add_case + 2 update_case (with
   the usual per-case audit log; runs untouched), then re-merge the new C-ids into the
   id-map.
2. Send Branko/dev the 5 new questions (Questions-for-Branko-dev.md) together with the
   still-open Q1/Q2/Q3 sheet.
3. When the QA branch exists: live VIU of the 13 new + 2 edited cases (all currently
   VIU-Pending; every tech-plan-pinned label/threshold carries a confirm-live flag).

Deliverables regenerated over **190 active** (177 + 13): import
`testrail-import/schedule-v1-testrail-import.csv/.xlsx` (190 rows, header
byte-identical, 0 VIU/flag words, no dup titles/ids, API cases in "API — Schedule");
`testrail-id-map.csv` (190 rows; 177 C-ids re-merged, 13 blank pending add_case).
Rule-28 audit: 12 KEEP / 1 WEAK-KEEP / 0 CUT · 15/15 SENSIBLE · all traceable
(RULE28-AUDIT-2026-07-29.md).

---
*Git provenance note (2026-07-29): Phase 1 = commit 229a601 (plan ingested verbatim);
Phase 2 = 9d93c79 (TECH-PLAN-DELTAS); Phase 3 = 621d8d1 (13 new cases + 16 edits +
question drafts + backups). The Phase-4 deliverables (this change list + xlsx,
RULE28-AUDIT, regenerated import/id-map over 190, PROJECT-STATE §0.0-TECHPLAN) were
swept into commit **02fdadb** by a concurrent worker's commit on the shared branch —
the content is exactly as staged for Schedule Phase 4; only the commit message says
"Report Suite".*

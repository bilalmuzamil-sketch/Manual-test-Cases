# SFV2 (group 6665) — per-case scaffold (⚠️ RESULTS-LANE material, NOT build verification)

> **🛑 CORRECTION (2026-09-09, L0022).** This file was started under a scope confusion. Driving each case
> to a Pass/Fail verdict is **NOT the build-verification lane's job** — it belongs to the QA lead's
> **"Create defects from TestRail (Push Results to TestRail)"** session (skills 09/16 + `push_results_to_run.py`).
> **BUILD VERIFICATION for SFV2 is already COMPLETE:** all 64 cases are runnable (runnable-shape gate 0
> NOT-RUNNABLE, label gate clean, render fr-view, markers set on the current build v26.35.9). No per-case
> execution walk is required to call this suite build-verified. This scaffold is retained only as a
> convenience for whoever runs the RESULTS lane; it is not owed by build verification.

**Verdict legend:** RUNNABLE-CONFIRMED = route + steps + required state reached live on the build ·
BLOCKED-<reason> = a specific thing could not be reached/observed (named, per Rule 68) · DEVIATION =
build differs from the documented expectation (three-outcomes on the case). Expected results still come
from the spec (Rule 57); this walk confirms *reachability/runnability*, not the tester's pass/fail.

**Scope:** 64 ours (created_by=3); Vladimir's 6 (C45202/45203/53490-53493) excluded (Rule 38);
C44560 deleted by the QA lead.

## Areas (8 data-state groups)
| Area | Cases | Data state to seed |
|---|---|---|
| 1 · Settings | 44549-44559 (11) | Settings → Work Orders tab; open WOs with parts in various states |
| 2 · Completing a line | 44561-44565 (5) | a WO line with required items outstanding |
| 3 · Line/part actions | 44566-44570 (5) | a WO with lines + parts (approve/decline/pick) |
| 4 · Bulk action bar | 44571-44582, 53486 (13) | a WO with several lines/parts in mixed statuses |
| 5 · Receiving | 44583-44588, 44592-44593, 53487, 53489 (10) | a WO with a vendor part ordered, awaiting receipt (+ a core) |
| 6 · Part rows/menus + reorder | 44594-44605 (12) | a line with ≥2 parts; the completion wizard |
| 7 · Permissions | 44606-44609 (4) | Roles & Permissions editor; TECH role variants |
| 8 · PO pages | 44589-44591, 53488 (4) | Parts → Purchase Orders (/parts/orders) |

---

## Area 1 · Settings (C44549–C44559)
_(walk in progress)_

# NEEDS QA-LEAD PERMISSION — Automated cases needing a change (Standing Rule 71) — 2026-08-18

**NONE.**

Rule 71 requires QA-lead permission before editing or deleting any case TestRail flags **Automated**
(`custom_atmstatus == 3`) — even our own. A live census of group 4254 on 2026-08-18 found:

- **195 Schedule cases, all `created_by == 3` (ours), 0 foreign.**
- **`custom_atmstatus == 3` (Automated): 0 cases.** (The 31 formerly falsely-flagged-Automated cases
  were corrected `3 → 1` on 2026-08-11 per the common core.)

This pass authored **0 new cases** and edited **0 existing cases**, so no Automated case was touched
and no permission is required. The flag was read **live** (it moves — e.g. C29600 went `1→3→1→3`), not
inferred.

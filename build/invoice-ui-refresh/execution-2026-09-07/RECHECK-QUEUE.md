# RECHECK-QUEUE — Invoice Refresh, 2026-09-07 (Rule 49)

**The branch is NOT final until release day (core §16.0), so every verdict here is PROVISIONAL.**
All observations rest on staging build **`v26.35.9-9812433`**, 7 September 2026.

| # | Row | Why it is provisional | What must be re-confirmed | Trigger |
|---|---|---|---|---|
| 1 | All 102 RUNNABLE rows | Verified against documents produced by one build on one day | The labels, on the build shipped at release | Any functional redeploy (a bug-fix-only deploy does NOT invalidate them — core §16.1 caveat / skill 03 §6.1) |
| 2 | SV-9770 (C44913, C44917) | Awaiting a product ruling from Chris Ward | Whether the Work Order field appears once ruled; **C44917's own wording will need changing if the rule changes** | Chris Ward's answer on SV-9770 |
| 3 | SV-9694 verified fixed | Confirmed on this build only | That the type sizes are still correct on the release build | Any redeploy touching the document stylesheet |
| 4 | The 15 DEFERRED rows | Never observed | Everything | When the screen or record becomes available |
| 5 | The 8 "state not present" rows | The state never occurred on the sample record | The behaviour in that state | When a tester creates the state |

**Cross-lane, for the authoring lane — not actioned here (Rule 83):** all 120 cases cite specification
**version 45**; the live page was last modified **5 September 2026** and Chris Ward recorded "live page
v49" plus an S12-R4 reference at v52. The citations are stale and need a currency pass.

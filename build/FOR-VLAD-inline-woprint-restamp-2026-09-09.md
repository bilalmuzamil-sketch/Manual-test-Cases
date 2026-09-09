# Rule 65 notice for Vlad — 11 Automated cases re-stamped (Inline 6597 + WO Print 6617), 2026-09-09

**What changed:** as part of the FULL build-verification of **Inline Add & Edit Parts (6597)** and
**Printer Friendly / WO Print (6617)** on sv9315 build **`v26.36.0-f43b2fd`** (the build moved
`v26.35.9-7f2e4fa` → `v26.36.0-f43b2fd`), the build-check provenance line on every one of our cases was
re-stamped to the new build. That sweep includes these **11 cases TestRail flags as Automated**
(`custom_atmstatus = 3`).

**The ONLY change to these 11 is the build-date provenance line** — `Last checked against build
v26.35.9-7f2e4fa on 9/8/2026` → `Last checked against build v26.36.0-f43b2fd on 9/9/2026`. **No title,
precondition, step, expected result, marker, or automation status was changed.** The re-stamp is required
because a suite is not build-verified-complete while any case still names an older build (Rule 54 amendment,
Rule 101 — no partial/delta), so the Automated cases had to move with the rest.

| Suite | Automated cases re-stamped |
|---|---|
| **6597 Inline** | C45005, C45026, C45223, C45224, C45227, C45237, C45252, C45253, C45254 |
| **6617 WO Print** | C45107, C45123 |

**Why you're told:** Rule 71/65 — you get a heads-up whenever anything on an Automated case changes.

**Vladimir Tomovic's own cases (`created_by = 1`) were NOT touched** (Rule 38): the Inline suite has 5
foreign cases authored by user 1 (incl. C53474 "ZZAUTOTEST Escalation Bin", C53475 "ZZAUTOTEST Inline
Clear Category") — left exactly as they are.

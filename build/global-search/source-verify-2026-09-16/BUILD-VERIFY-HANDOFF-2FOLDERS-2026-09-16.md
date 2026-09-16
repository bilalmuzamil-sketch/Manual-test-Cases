# HANDOFF → Build Verification: Quick Actions (6774) + V1 Regression derived (8056) — 2026-09-16

Source gate satisfied. Committed evidence (Rule 86): `SOURCE-VERIFY-2FOLDERS-2026-09-16.md` (this folder).

**6774 — Quick Actions on Hover (v1): 8 cases C44866–C44873.** Source = PRD §5.4 (v1.5, unchanged);
re-stamped "read on 16 September 2026"; fr-view verified. Marker `Not available on Build to test Yet`.
**Before executing:** these depend on a live spec-vs-ticket conflict — PRD §5.4 lists quick actions in v1,
but epic **SV-9173 is OBSOLETE ("later release", 2026-09-10)**, so the feature may not be on the build. If
quick actions are absent on the build, that is the expected consequence of SV-9173, not a case defect —
record and flag, do not fail the cases as wrong. If they ARE present, verify per PRD §5.4 (labels read off
the build).

**8056 — V1 Regression derived: 1 case C55684.** **Rule 109 parity case — V1 is the specification, NEVER
the PRD.** Source: V1 product commit **55767168**, `useGlobalSearch.ts:286-299`. Already build-checked
(`READY - Last checked against V2 QA branch sv9160 on 15/9/2026`). Expected: on a location switch the old
location's Work Order / Part Sale rows are cleared BEFORE the re-fetch, so nothing from the other location
flashes on screen. Verify against V1 BEHAVIOUR (V1 = production app.shopview.com, read-only), not the V2
requirements. Seed check: type `ZZAUTOTEST` in global search first; if no results, the build wiped test
data — reseed before running.

Both cases are already in run **R415**. Excluded from this handoff: nothing else — the other GS folders were
handed off separately (`BUILD-VERIFY-HANDOFF-2026-09-16.md`).

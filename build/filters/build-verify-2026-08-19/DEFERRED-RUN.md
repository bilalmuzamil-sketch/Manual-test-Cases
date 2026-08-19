# Filters build-verify 2026-08-19 — DEFERRED-RUN list (feature not found in the build)

**NONE.**

Every Filters case has a present feature on build **v3.8-d0e135e**. The Fabian app-wide filter redesign
(spec v21) is fully shipped to staging, so **no case is a "feature not found" deferral** and none
carries the under-development line. The 2 cases still showing `AUTOMATION: Not available on Build to
test Yet` (C29600, C29623) are held ONLY because they are Automated (`custom_atmstatus = 3`, Rule 71) —
their features are present and verified (see `FILTERS-HELD-AUTOMATED.md`); they lift to READY once the
QA lead authorises the Automated-case edit.

The 18 HOLD cases are held on PO questions or genuinely-unobtainable preconditions (a pre-redesign saved
filter; a not-yet-finished page-search rollout; Branko's Parts/Reports write-up) — not feature absence —
so they do not belong on this deferred-run list either; their re-check trigger is the thing they wait on
(Rule 49), recorded in the outstanding register.

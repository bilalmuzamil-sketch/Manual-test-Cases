# Schedule build-verification — BATCH B findings (Scheduling CORE)

## Pass outcome: BLOCKED before any live observation — no findings yet.
Live staging access is unavailable this session and cannot be minted here (SSO-gated; see
B-EXECUTION.md "THE BLOCKER"). No case in batch B was observed, so **no PASS / EXPECT-FAIL / HOLD /
NOT-FOUND verdict is recorded** — recording any would be inference, not observation (Rule 12).

## Honest split (skill 03 honesty note)
- **Cases in scope:** 66 (enumerated live from TestRail — see B-EXECUTION.md scope table).
- **Steps walked / driven this pass:** **0** — auth wall reached before the SPA could render.
- **Build marker:** `v3.8-bd246fd` (reachable, unchanged from batch A) — the blocker is authentication,
  not the build.

## Drag/harness note (for the resume)
Batch B is the highest harness-risk cluster (drag-to-create, scope picker, multi-day spread, shift
reassignment). Batch A confirmed `fc-event-draggable` handles exist on shifts. When access lands, each
drag case must be attempted BOTH via the SPA fullcalendar handles AND via the underlying
`POST /api/schedule/*` endpoint; a gesture that cannot be driven by either — while the feature is
otherwise confirmed present — is recorded as an **honest N-of-M** (feature present, gesture not
harness-drivable) and stays `AUTOMATION: READY` with the limit noted. It is NEVER faked as a pass and
NEVER falsely deferred as an absent feature. Only a genuinely ABSENT feature (probe that could fire,
found nothing — skill §2) gets Rule-69 deferred treatment.

## Nothing filed, nothing changed
0 TestRail writes · 0 Jira writes (creation on hold anyway) · 0 defects flagged (none observed) ·
run 357 untouched.

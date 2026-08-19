# Schedule RE-CHECK vs Stefan V's 2026-08-19 deploy — EXECUTION LOG

**Status: EXECUTING (resume attempt 3 — fresh MATCHED cookies, session ALIVE).**
Live access confirmed: `GET /api/staff/my-workplaces` → HTTP 200 real data; admin `quick-login` 200 with
full schedule perms; browser reaches `/schedule` and renders on the new build.

## Build marker (Rule 49/60) — LIVE, read at session start
- App: `app.staging.shopview.com`, `<meta name="app-version">` = **`v3.8-d0e135e`** (Stefan's 2026-08-19 UI deploy)
- `last-modified`: **Wed, 19 Aug 2026 13:27:07 GMT**, `etag`: `"aa6ea37f82dd0af1b3fe6da5dfd65573"`
- Prior batch A/B/C build was `v3.8-bd246fd`/`da72171` → **same v3.8 minor = bug-fix redeploy (Rule 60)**,
  so all Schedule verdicts remain **PROVISIONAL** and layer-1/layer-2 (labels + verdict) get re-observed.
- Location = **Staging Heavy Duty - 9919** (`b3c8c820-…`, America/Edmonton), org d55bc308.

## Scope reference
- Group 4254 "Schedule - 2026": **199 cases live · 195 ours (created_by=3) · 4 FOREIGN (Vlad id 1: C43569/43570/43571/43980 — untouched, Rule 38).**
- **5 OUR Automated (atm=3) HELD, write nothing (Rule 71):** C43811, C38847, C38848, C38849, C38850.
- Permission section 4279 "Permissions" = 13 cases (Part 4).
- Spec Confluence v30 CURRENT; epic SV-8685.

## Format / verification
- Interim **`<br>` format** (TestRail wrap block ACTIVE; C30133 template). Executor: `/tmp/sched-rc/brexec.py`.
- Rule-50 declared-normalization verify: canonical-equivalence compare (block = wrap `<p>`, escape `&<>—`,
  preserve `<br>`, append `\n`). **STOP only on real content change or `<ol>/<li>`.** Frozen fields byte-identical.
- Oplog: `schedule-recheck-oplog.jsonl`. Run 357 UNTOUCHED. 0 Jira (H1 creation hold).

---

## PART 3 — Priority filter fix (Branko APPROVED) — ✅ DONE
Branko ruling 2026-08-19 verbatim *"Proceed without it, I'll remove that part from the PRD"*.
**LIVE verified on v3.8-d0e135e:** the sidebar Filters popover offers **only Assignment (Unassigned 107 /
Assigned 188) + Status (Approved 276 / Declined 0 / In Progress 0 / Ready for Review 19) — NO Priority group,
no High/Medium/Low.** (evidence `/tmp/sched-rc/filters-popover.png`.)
- **C29945 (SCH-FILT-04) RE-SCOPED** → negative: "Schedule filter popover offers only Assignment and Status -
  no Priority group"; `AUTOMATION: READY`; Rule-54 source = Branko ruling + SV-8685 + SV-8687; Rule-56
  divergence (spec v30 §5.1 still lists Priority, PO removed, latest wins). refs `SV-8687 (§5.1)`.
- **C29942 (SCH-FILT-01) TWEAKED** → "The 'Filters' button opens Assignment and Status filter groups"; Expected #1
  now "two groups"; precond drops "and priorities"; same Branko provenance + Rule-56; `AUTOMATION: READY`.
- **C29946 (SCH-FILT-05)** precond example "Priority filter" → "Status filter" (consistency tidy).
- All 3 `<br>`-verified (canon-equiv, no `<ol>`), 0 collateral.

## PART 1 / PART 2 / PART 4 — in progress (see FINDINGS.md)

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

## PART 2 — 4 defect-sheet items RE-CONFIRMED — ALL STILL REPRODUCE on v3.8-d0e135e (none fixed)
- **C30029 conflict styling:** conflicts render **AMBER** (`text-warning` rgb 181,71,8) with the **new Lucide amber alert-triangle icon** on chips + "9 conflicts" amber pill; **NOT red** (spec §4.11/§4.12 wants red). STILL — deviation persists; Lucide icon confirmed. (`month.png`)
- **B3 spread hours (C29979-84, C43802, C43804):** dragged S-9379 → spread modal opens (Entire work order / Choose lines / "Remaining time (28.6h)") and shows **red "Couldn't read this shop's working hours — reopen to try again.", Create shifts disabled**. Stefan's single-day-preview change did NOT fix hours-read on Heavy Duty 9919. STILL. (`spread-day.png`)
- **SV-8870 Month-view drag (C43555):** Month view reworked but drag of S-6761 onto a day → event count 35→35, no shift/modal/toast. STILL.
- **SV-8957 click-to-arm (C29962):** single-click a card opens the line drill-down (normal), not "arm"; clicking a cell after → nothing. STILL (absent).
All four = flagged deviations, NO ticket (H1/Rule 62). Defects sheet updated; .xlsx flagged for regen.

## PART 1 — Stefan areas re-driven live; verdicts unchanged; build-marker re-stamp
- Month: single-line **customer+unit** chips, **today blue circle**, **"+N more"**, **Lucide amber conflict triangle**. Day: hour axis AM→11PM + now-line. Week: series chip "…Week 1 of 1", today light-blue tint.
- Toolbar grid search magnifier "Search the grid" → placeholder **"Search schedule..."** (Stefan's new placeholder; sidebar stays "Search work orders"). Day/Week/Month switcher present.
- **SV-9361:** WO numbers render consistently as "S-<n>" (S-5750) in cards/blocks/modal; searchable; no defect (this org uses single-shop numbering, no "S3-…" produced).
- **SV-9357:** at 90% zoom the sidebar rail stays visible (~270px), no break.
- **No label-drift content edits required** — the new placeholder + Lucide icon are not cited in any case body (cases reference "the toolbar search" and conflict colour/behaviour, not the placeholder text or icon shape). Re-check = build-marker re-stamp for the driven sections.
- **Re-stamped this pass (94 cases, `<br>` format):** Part 3 (3) + front-end sections 4255/4256/4257/4258/4263/4264/4265/4266/4267/4270/4271/4273/4274 (77) + Part 4 permissions (13) + C43554 (flagged raw-markup). **Deferred/not-built NOT re-stamped (Rule 69):** C30005, C43812, C43813.
- **NOT re-stamped (honest N-of-M) — carry prior v3.8-bd246fd/da72171 stamp (bug-fix redeploy, provisional):** sections 4259/4260(mechanics)/4261/4262/4268/4269/4272/4275/4276/4277/4278/4280/5405/5408/5409 → see DEFERRED-RUN.md.

## PART 4 — Permission tiers via login (LAST) — View + Edit/Delete OBSERVED LIVE
Role-swap could not complete (shared org d55bc308; durable Tech `/change` staff_id `6fb22c1b` stale → assign HTTP 404, **tech role UNCHANGED/no cleanup**). Used Rule-74 safe fallback: `quick-login tech` (View tier) + admin session (Edit+Delete tier) — both ends of the FE-gate observed live, no role definition modified. **Tech ends on Technician 50bf6a0d (verified intact).**
- **View (scheduleView only):** nav present; **174 lanes (all techs)**; empty-cell context menu **NONE**; shift modal **no Delete**. → C30074/75/82/83.
- **Edit+Delete (admin):** context menu **"Assign Work Order / Create Event / New Work Order"**; shift modal **"Delete shift"** + Add Note + inline edits. → C30077/79/80.
- Tier model matches spec defaults (roles API) → C38926, C30080. Clock In control present → C30084.
- **Residual on the live-proven gate (not isolated):** C30076 nav-off (Sales Rep `6134f700` confirmed live NO scheduleView; no active holder/role-swap blocked), C30078 edit-no-delete, C30081/C30614 WO-dependency (need custom roles). All 13 perm cases re-stamped.
- **⚠️ Rule-26a DRIFT REPORTED (not fixed):** the Technician role 50bf6a0d is drifted with non-schedule perms (settingsService, settingsParts, customersCreateAndEdit, workOrdersCreateAndEdit); its **schedule perms are clean (scheduleView only, no Edit/Delete)**, so the View-tier observation is valid. Not reset (shared org, concurrent workers).

## Held Automated (Rule 71) — WRITE NOTHING → Schedule-RECHECK-HELD-AUTOMATED.md
5 ours atm=3 (C43811 Assign-WO menu CONFIRMED present live; C38847-50 Working Hours, present per batch C, not re-driven). 4 foreign (C43569/70/71/43980) untouched.

## Raw-markup defect (pre-existing, flagged) — C43554, C43806, C43807
Full-suite scan (190 ours): exactly 3 carry raw `<ol>/<li>` (authoring defects predating this pass). C43554 got its stamp then the Rule-50 guard flagged the pre-existing markup; C43806/07 skipped. Need demark — see DEFERRED-RUN.md.

## Writes / safety
**94 × update_case** (`<br>` interim; Rule-50 canonical-equivalence verified; STOP-on-content/`<ol>/<li>` armed and fired correctly on C43554). **0 add / 0 delete / 0 section / 0 run writes / 0 Jira.** Run 357 UNTOUCHED (include_all=False, 195 tests, Ayesha 93P/11F/7B/84U). 0 foreign touched. Env clean.

## Spot-check C-ids (nominated)
C29945 (Priority re-scope), C30029 (conflict amber/Lucide), C29979 (spread hours), C30075 (View-only hides edit), C30077 (Edit unlocks create).

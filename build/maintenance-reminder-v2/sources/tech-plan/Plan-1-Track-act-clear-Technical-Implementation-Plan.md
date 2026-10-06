# Maintenance Reminders — Plan 1: Track, act, clear — Technical Implementation Plan

**Date:** 2026-10-02
**PRD:** [Chunk 1 MR](https://shopview.atlassian.net/wiki/spaces/PM/pages/886931488/Chunk+1+MR) (also: [Chunk 2 MR](https://shopview.atlassian.net/wiki/spaces/PM/pages/897679389/Chunk+2+MR); index: [Maintenance Reminders V1](https://shopview.atlassian.net/wiki/spaces/PM/pages/833290250/Maintenance+Reminders+V1))
**Jira epic:** [SV-3780](https://shopview.atlassian.net/browse/SV-3780)
**Design:** https://claude.ai/design/p/4411588b-b915-46d5-a8b8-43628a02e02a
> Note: the design project's `design_handoff_maintenance_reminders` markdown is stale (spec v7–v12). The PRD wins wherever they differ; implementers must not build from those notes.

**Tech stack:** `api/`: PHP 8.5, Symfony 7.4, Doctrine ORM 3 / DBAL 4, MySQL; two new modules `VehicleService/Maintenance` and `VehicleService/MeterReadings`, plus touchpoints in WorkOrders, Vehicles, Customers and EntityEvent; one Terraform schedule. `app/`: Vue 3.5, Quasar 2, TypeScript, TanStack Query; a new `components/ts/maintenance/` tree and `api/maintenance/` module, plus P0 shared components.
**Estimated complexity:** High

> **Plan 2 follows.** This is Plan 1 of two. Plan 2, "The work order and the customer" (work-order maintenance panel, add to an existing WO, the editable step after invoicing, Send reminder (the S19 email, sent by hand through the app's existing send email dialog; the automatic email is deferred to v2 by the 2026-10-02 PRD edit), Origin column, WO split handling), is built on top of this plan. **Both plans are built in sequence on one shared feature branch (`feature/SV-3780-maintenance-reminders`), tested as a whole on the branch build, then merged to `develop` together and released** (D28). There is no feature flag and no release toggle: the feature reaches every organization when that release ships (Product Q4, 2026-10-05; D27). Plan 1's interim states (automatic reset at invoicing with no visible step, no Send reminder) never reach `develop`, because the branch merges whole only after Plan 2 is done.

> **PRD revised 2026-10-02; this plan revised 2026-10-04** (Product, Milos Vasic; chunk pages and index change log). Five changes, applied throughout (details in Appendix › "Revision 2026-10-04"):
> 1. **Schedules are organization-wide with a home location.** Every location sees and enrols onto every schedule; each schedule keeps its canned lines at its home location (where it was first saved), and only users with access to that location change them (S1-R1, S1-R14, S4-R7..R9, S6-E5, S7-R1; D23, TD-30, TD-31, GR-6, GR-7).
> 2. **There is no automatic email in v1.** The only customer email is Send reminder, sent by hand from the contact card (Plan 2 Q6). The backlog-suppression flag is gone (S7-R9, S7-N3 deleted; D24). No Plan 3.
> 3. **Certificate Start and End are days.** End = Start + term; Start = End − term; valid through the End date, overdue the day after (S8-R2, S8-R10, S8-R11, S8-E1, S8-E2, S12-R4; D26, TD-33).
> 4. **Copied work is new.** At a location other than the schedule's home, Create work order (and Plan 2's Add Service) adds the same work as new lines at the local labour type and rate, with no prices or parts and an internal line note listing the home parts (S13-R30, S16-N6, S16-R22, S16-R23, S16-N9; D25, TD-32).
> 5. **Chunk 2 is ready** ("Ready for tech plan", handoff 6 October), so Q1 is answered and S10–S12 build as written, including the 2 October edits.

> **PRD answers 2026-10-05; this plan revised 2026-10-05 (revision 3).** Product (Milos Vasic) answered every Chunk 1 engineering question (replies 917667841, 917405698, 917438476); the Q7b follow-up, Q17 and Q18 were answered on 2026-10-05 in reply 918913025 (Option A: keep the hard delete; 30 days per month; Needs readings rows stay listed). Applied throughout (details in Appendix › "Revision 3 — 2026-10-05"):
> 1. **No feature flag (Q4, D27).** The feature reaches every organization at release; every surface is gated by its permission only. Readings are recorded for every organization from release; past WO and imported readings are loaded once (S10-R12).
> 2. **One shared feature branch (D28).** Plan 1, then Plan 2, are built on `feature/SV-3780-maintenance-reminders`; phase PRs target the branch; QA tests the branch build; the E2E coverage pass and the PR to `develop` run once the whole branch is done; then the release. Top risks: branch drift (BR18) and migration ordering (BR19).
> 3. **Before rows shorter than the interval (Q8a).** The default 14-before row is left out at an interval of 14 days or less, and a note names the limit (S5-R12, S5-R13). Month intervals convert at 30 days per month (Q17 ✅ ANSWERED 918913025: a 1-month interval allows 1–29 days).
> 4. **Mark complete On a work order records the WO's readings (Q9)**, dated the Reset date (S18-R19, TD-35); a WO reading counts only when entered or changed on that WO (Q13, S10-N6, TD-34).
> 5. **Any contact with an email (Q11).** A customer with at least one contact email can be sent a reminder; with none, every surface says so and offers Add contact (S7-R20, S14-R13, S14-N2). The unit count is gone.
> 6. **Every completion rests the worklist row (Q12)**, Mark complete or invoicing, until its next cycle reaches its first reminder row; Needs readings rows always show (S13-R36 wins for them), and the enrolment "Mark as done" rests a row like any other completion (S13-R43, TD-36; Q18 ✅ ANSWERED 918913025). Step-confirmed (invoice) completions cannot be undone (S18-N8).
> 7. **Asset delete: ✅ ANSWERED Q7b, Option A (reply 918913025).** An asset is deleted as ShopView deletes it today (hard delete); maintenance records, readings, certificates and audit entries are never hard deleted; the history stays in the data, with no screen in v1 (S21-R6 as revised). Built as is: no MR table has a foreign key to the asset, customer or WO and nothing reads history through the asset row (NFR-002); no asset soft delete is in scope (former BR22 retired). S8-R10 gains the month-end clamp; S13-R41 adds the company phone; S3-R12 is removed. No legal send switch in either plan (D29).

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Ready to implement
- **Current phase:** —
- **Last completed:** —
- **Delivery:** one shared feature branch for Plans 1 and 2, `feature/SV-3780-maintenance-reminders`, cut from `develop` (D28). Every phase PR (P0–P7, then Plan 2's Q1–Q6) targets the branch, never `develop`, with the full per-phase gates. QA tests the branch build. When Plan 2 is done and QA signs off: the E2E coverage pass (`/e2e-after-change`) and one PR from the branch to `develop`, then the release. Merge `develop` into the branch at least weekly and before each phase PR (merge, never rebase or force-push: the branch is shared), then run the post-sync gates of Section 3.4 (BR18, BR19). No feature flag, no release toggle.
- **Verification tickets:** SV-10847..SV-10873 (Plan 1: SV-10847..SV-10862; Plan 2: SV-10863..SV-10873). Section 11 lists each with its phase, layer, linked stories and assignee; all Done = ready for QA.
- **Open questions / blockers:** only Chunk 2 #6 (phone layout of the WO card; Plan 2, non-blocking, proposal built) and the legal footer as a non-blocking fast follow (Plan 2; the footer ships as specified in S19-R15). Nothing blocks implementation or release.
  - _All Chunk 1 questions were answered by Product on 2026-10-05 (replies 917667841 for Q1–Q8, 917405698 for Q9–Q13, 917438476 for Q8a and Q14–Q16, on the Chunk 1 thread 913866753); the PRD pages were edited to match. The Q7b follow-up, Q17 and Q18 were answered by Product on 2026-10-05 in reply 918913025. Status table: Section 1 › Clarifications._
  - **Q1** ✅ ANSWERED 2026-10-02: Chunk 2 is "Ready for tech plan"; S10–S12 and the copied S16–S18 parts build as written, including the 2 October edits.
  - **Q2** ✅ ACCEPTED 2026-10-05: one ceiling for every unit, 1,500 mileage a day and 24 engine hours a day; the same figures trigger the orange confirmation (S11-R19, S10-N2). `RateCeiling` as built.
  - **Q3** ✅ ACCEPTED 2026-10-05: the audit is recorded from release, with no screen in v1 (S21-N3). TD-09 as built.
  - **Q4** ✅ ANSWERED, CHANGED 2026-10-05: **no feature flag.** The feature ships to every organization at release; readings are recorded for every organization from release; past WO and imported readings are loaded once (S10-R12, index "Release"). Applied as D27 (permission-only gating, NFR-013) and D28 (shared feature branch).
  - **Q5** ✅ ACCEPTED 2026-10-05: one file, PDF, JPEG or PNG, up to 10 MB, replaceable or removable (S8-R9, NFR-018).
  - **Q6** ✅ ACCEPTED 2026-10-05: 50 rows at a time, server-side, loaded on scroll (S13-R37; A30 `rowsPerPage` 50).
  - **Q7** ✅ ACCEPTED 2026-10-05: (a) "On Hold" removed (S13-R25); (b) "every asset of that customer" and "deleted", no inactive state (S7-R24, S13-E5); (c) S13-R41 accepted with the company phone added, S7-R20 via Q11; (d) S3-R12 removed.
  - **Q7b follow-up** ✅ ANSWERED 2026-10-05 (reply 918913025): "Option A, keep hard delete." S21-R6 now reads: "maintenance records, readings, certificates and audit entries are never hard deleted; an asset is deleted as ShopView does today; history stays in data, no screen in v1". Built as is: no MR table has a foreign key to `vehicle`, `company` or `work_order` (NFR-002), worklist reads INNER JOIN them so a deleted asset drops out (S13-E5), MR rows are never hard deleted (soft ends only), and the history rows keep plain ids. No asset soft delete; BR22 retired.
  - **Q8** ✅ ACCEPTED 2026-10-05 (b–g): imported visits count (S13-R27); names match case- and space-insensitively, latest completion wins (S7-R4); a renewal drives at once (S8-R12); S12-R3 settles the missed At; the location rule holds for every user of the org (S13-R9); stale design folders removed (current boards: Chunk 1.dc.html, Chunk 2.dc.html). **Q8a CHANGED:** a before row must be shorter than the calendar interval (every 7 days → 1–6), so the default 14-before row is left out at 14 days or less, exactly 14 included, and a note beneath the rows names the limit (S5-R12, S5-R13).
  - **Q9** ✅ ANSWERED, CHANGED 2026-10-05: a WO reading does not count when the WO reaches Complete; instead Mark complete "On a work order" records that WO's readings, dated the Reset date, as invoicing would (S18-R19, S10-R11) → TD-35.
  - **Q10** ✅ ACCEPTED 2026-10-05: two fixed points in the year = two services, each with its own At (S2-E2).
  - **Q11** ✅ ANSWERED, CHANGED 2026-10-05: a yes/no, not a count. Send reminder is offered when at least one of the customer's contacts has an email, even where the asset's preferred contact has none; a customer with none cannot be sent a reminder, and the surface offers a way to add a contact (S7-R20, S14-R13, S14-N2).
  - **Q12** ✅ ACCEPTED, WIDENED 2026-10-05: after **any** completion, by Mark complete or by invoicing, the row leaves the worklist and returns when its next cycle reaches its first reminder row, even inside the 91 days (S13-R43, S18-R17) → TD-36. Its two edges were settled by Q18 (reply 918913025).
  - **Q13** ✅ ACCEPTED 2026-10-05: a WO reading counts only when someone entered or changed the value on that WO; WOs created from the worklist copy mileage like any other (S10-N6) → TD-34, TD-14.
  - **Q14** ✅ ACCEPTED 2026-10-05: the S1 introduction now matches S1-R1. **Q15** ✅ ACCEPTED 2026-10-05: same day number; a day missing in the end month → that month's last day (S8-R10). **Q16** ✅ ACCEPTED 2026-10-05: covered lines show pre-filled and read only for a user without the home location (S2-R17).
  - **PQ-25, PQ-26, PQ-29** ✅ ACCEPTED 2026-10-05 on the Chunk 2 thread (reply 917209101, #25, #26, #29): re-add re-attaches surviving lines (S16-R25); a copied line carries tech time (S16-R22); a line with no labour type is copied with none (S16-R22).
  - **Q17** ✅ ANSWERED 2026-10-05 (reply 918913025): "OK, 30 days per month; a 1-month interval allows 1–29 days" (S5-R12). Built: 30 days per month (every 3 months → 1–89); days count as given; a yearly At as 365 (`ReminderOffsets`, `serviceFormRules.intervalDays`).
  - **Q18** ✅ ANSWERED 2026-10-05 (reply 918913025): "OK. A Needs readings row stays listed; every other completion rests the row, including a last service date entered at enrolment" (S13-R43). Built as proposed: (a) a Needs readings row still shows after a completion (S13-R36); (b) the enrolment last service date ("Mark as done", S7-E1, `last_done_path = 'enrolment'`) rests the row like any other completion (`WorklistPredicates`, TD-36).
  - **Chunk 2 items (Plan 2 only, no Plan 1 effect):** ⏸ PENDING Chunk 2 #6 (phone layout of the WO card; non-blocking, proposal built). Answered 2026-10-05 in reply 918945793: #30 ✅ ("Nothing is scheduled for {unit} yet.", S19-R23), #31 ✅ (the legal footer is a fast follow and does not block the release: the footer ships as specified in S19-R15; a postal address or unsubscribe is added later if legal requires it), #32 ✅ (a typed address does not change the greeting, S19-R19). Nothing here holds the branch → `develop` PR.
  - **Release gate:** none from Plan 1. The branch goes to `develop` only after Plan 2 is done, QA signs off on the branch build and the coverage pass has run (D28). Top risks: branch drift (BR18), migration ordering (BR19).
  - **GR-6, GR-7** ✅ APPROVED 2026-10-04 by the user (Golden Rule exemptions for org-wide schedules and home-location canned-line reads; the PRD states both explicitly: S1-R1, S4-R7). Recorded in Section 9; each PR touching them carries a "Golden Rule Exemptions" block.
  - **Engineering-owned items on the PRD index** ("data model/API", "multi-customer asset count per S7-R23"): answer them on the index with DQ1 and a link to Sections 4–5 (owner: engineering; not a Product question).

> 🛑 **About to implement this plan? Run it as `/loop /implement docs/tech-plans/2026-10-02-maintenance-reminders-plan-1.md`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement docs/tech-plans/2026-10-02-maintenance-reminders-plan-1.md` (or `/loop /implement Phase N from docs/tech-plans/2026-10-02-maintenance-reminders-plan-1.md` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue — you're in the right place. But the `/loop` session is **orchestrator-only**: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates, and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

---

## 1. Requirements (extracted from PRD)

Requirement IDs are the PRD's own (`S1-R1`, `S11-R24`, …), grouped by story with the story's Jira key. Analysis-introduced
requirements are `NFR-001…` (backend analysis) and `NFR-F01…` (frontend analysis). Every Chunk 1 question was answered on
2026-10-05, Q7b, Q17 and Q18 included (reply 918913025); no Plan 1 requirement carries a pending marker. The "BE impact" column says what the
backend does; the frontend side of every requirement is in Section 10.

Plan 1 scope: all of S1–S9, S13, S14 (minus Send), S21; all of S10, S11, S12; S18-R1..R7, R9–R12, R17, R18, the
automatic acceptance half of S18-R13, R19, the A29 half of S18-N8, the reversal half of S18-E2 and its credit-memo no-op (NFR-022); S16-R19, R20, R22, R23, N4, N6, N7, N9; S17-R2, R5–R8; S22-R1 (origin stored, not shown).
Anything in those stories that belongs to Plan 2 is marked "→ Plan 2".

Phase codes: P0 Foundation, P1 Settings, P2 Enrolment/certificates/customer setting, P3 Readings, P4 Engine and
projection, P5 Asset tab, P6 Completion and work-order link, P7 Worklist and contact card. "FE only" means no backend
change: the backend already returns what the screen needs, or the rule is pure presentation.

### S1 Create a maintenance schedule (SV-10558)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S1-R1 | Settings > Maintenance holds one list of schedules shared by the whole organization; every location sees and enrols onto every schedule; each schedule keeps its canned lines at its home location (where it was built) | P1 | `maintenance_schedule.home_workplace_id NOT NULL` (data, not scope, D23); every schedule query org-scoped, `findById()` with `isOrganizationEntity()` (GR-6, TD-30) |
| S1-N2 | A user without Settings Service cannot reach the tab | P1 | `MaintenanceAccessGate::guardSettingsView/Manage` on every schedule endpoint |
| S1-N1 | A schedule with no services cannot be saved | P1 | Create/replace validation: at least one service |
| S1-R3 | New schedule opens an empty editor titled Untitled schedule, no modal, no template | P1 | FE only |
| S1-R4 | A schedule exists from its first Save; leaving earlier leaves nothing | P1 | One create endpoint, no draft row |
| S1-R6 | The editor carries only a name and an ordered list of services | P1 | Document shape of create/replace |
| S1-R7 | Title inline edit (DVI pattern) | P1 | FE only |
| S1-R8 | Cancel and Save; everything is saved only on Save | P1 | Whole-document `PUT` (TD-25) |
| S1-N3 | Blank name cannot be saved; reverts to the previous name | P1 | `NotBlank` on name (defensive); revert is FE |
| S1-E2 | Names unique **across the organization** (archived included); duplicate named (Copy), (Copy 2) | P1 | Follows the inspection-template precedent (`DbalInspectionTemplateFetcher::existsWithName()`: archived templates count), widened to the organization because schedules are org-wide (S1-R1). Unique `(organization_id, name)` over active and archived schedules (`msch__org_name_unq`); `nameTaken()` org-wide; duplicate → 400 field error `errors[{field: name}]` (request validator `UniqueScheduleName`), concurrent duplicate → 409 backstop; copy-name helper |
| S1-R9 | Service table: Service, Interval (triggers joined by a dot), Canned Lines (count and covered count) | P1 | Detail DTO returns triggers and `lineCount`/`coveredLineCount` |
| S1-R10 | Services reorder by drag and Move up/down | P1 | `position` persisted from array order |
| S1-R2 | Active and Archived tabs with counts; Schedule/Services/Assets columns sortable; search schedule and service names; per-state menus | P1 | List endpoint with `status`, `search`, sort, tab counts |
| S1-R12 | Enrolled asset count as plain read-only text | P1 (count live from P2) | `enrolledAssetsCount` (A1) live `COUNT` over active enrolments |
| S1-R13 | Archived schedule opens read-only all the way down | P1 | Detail returns `readOnly`; replace returns 409 on archived |
| S1-E1 | No delete anywhere, no draft | P1 | No DELETE route |
| S1-R14 | Org with more than one workplace: the list and the editor header show each schedule's home location under its name ("Lines from Calgary South"); one workplace: not shown | P1 | A1/A2 `homeWorkplace {id, name}`, A9 `homeWorkplaceName`; top-level `workplaceCount` (org active workplaces; the FE shows the label when > 1) |

### S2 Add a routine service (SV-10559)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S2-R1 | Add service opens a blank form | P1 | FE only |
| S2-R2 | Form order; no send switch anywhere | P1 | No send field in the service DTO |
| S2-R3 | Exactly one name; it is what the customer reads | P1 | Single `name` |
| S2-N4 | Blank service name cannot be saved | P1 | `NotBlank` |
| S2-R4 | Calendar interval always present and required | P1 | `TriggerSet` requires a `CalendarTrigger` |
| S2-R5 | Mileage and engine hours are optional extra triggers | P1 | Optional `MeterTrigger` per meter |
| S2-R6 | Every repeats from each completion; At is a fixed point (calendar day of year, or one reading) | P1 store, P4 resolve | `TriggerOperator` Every/At; resolution in `DueDateResolver` |
| S2-R7 | Calendar At is a day-and-month, never a month alone | P1 | `CalendarTrigger::at(day, month)` validation |
| S2-R8 | Calendar unit days or months; months 1 to 12; days whole | P1 | VO validation |
| S2-R10 | Distance unit is the word mileage | P1 | FE only |
| S2-R15 | Engine hours written hours | P1 | FE only |
| S2-N1 | Calendar interval cannot be empty | P1 | VO validation |
| S2-N3 | Calendar alone is a complete service | P1 | Meters optional |
| S2-E1 | Mileage and hours together still one calendar row | P1 | One calendar trigger per service |
| S2-R16 | A service names other services on its schedule that it covers | P1 | `coveredServiceIds` on the schedule service |
| S2-R17 | Covered services' lines arrive pre-filled, editable, marked "from PM-A"; edits stay local; for a user without access to the home location, pre-filled and read only (S4-R9) | P1 | `CannedLineRef.coveredFromServiceId`; TD-31's A4 new-service rule settled (Q16 ✅ 2026-10-05) |
| S2-R18 | Covers step only when another routine service exists | P1 | FE only (BE enforces S2-N8) |
| S2-R19 | Can only name services already on the schedule | P1 | Validation: covered ids belong to the same schedule document |
| S2-N8 | Compliance never offered as covered and covers nothing | P1 | Validation |
| S2-N9 | No cycles, direct or indirect; covering not inherited | P1 | Cycle check in `MaintenanceSchedule` |
| S2-E6 | Covering is stated, never inferred | P1 | No inference anywhere |
| S2-R9 | Whole numbers ≥1; mileage ≤999,999, hours ≤99,999, days ≤999; over 12 months is set in days | P1 | VO bounds |
| S2-N2 | Decimal refused inline | P1 | Integer type in DTO (400); inline is FE |
| S2-N5 | Digits only in number fields | P1 | FE only |
| S2-N6 | Zero refused | P1 | VO bounds |
| S2-N7 | Calendar At needs day and month | P1 | VO validation |
| S2-R11 | Due at whichever trigger arrives first, stated once | P1 text, P4 rule | FE text; earliest-wins in P4 |
| S2-R14 | Months land on the same day of a later month; days drift | P4 | `CalendarMath::addMonthsClamped()` / `addDays()` |
| S2-E5 | Missing anchor day falls on the month's last day; next cycle counts from that date | P4 | Clamp in `CalendarMath` |
| S2-E2 | Two fixed points in the year = two services, each with its own At | P1 | One calendar row per service (S2-E1); no BE work (Q10 ✅ 2026-10-05) |
| S2-E3 | No one-time flag; meter At covers the one-off | P4 | Meter At done once, never again |

### S3 Compliance inspection service (SV-10560)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S3-R1 | Ask "Is this a compliance inspection?" before triggers | P1 | FE only |
| S3-R2 | Compliance replaces the trigger block | P1 | `kind=compliance` carries `ComplianceTerm`, no `TriggerSet` |
| S3-N1 | No meter triggers and no calendar on compliance | P1 | Validation |
| S3-R3 | Type free text, required; (i) with examples | P1 | `NotBlank`; hover is FE |
| S3-R6 | Term chosen on its own | P1 | FE only |
| S3-R7 | Term months 1 to 60, required | P1 | VO bounds |
| S3-R8 | Remind before expiry in months; default 1 (term ≤12) or 2; never longer than the term | P1 | VO validation; server default when absent |
| S3-E2 | Same type, different terms allowed | P1 | No uniqueness on type |
| S3-R9 | No certificate date on the service form | P1 | FE only |
| S3-R10 | Compliance is orange, never red | P5/P7 | FE only (BE returns `kind`) |
| S3-N2 | No matching record: cannot come due, reads No record, excluded from counts | P4, P7 | Projection `has_record=0, due_on NULL`; worklist exclusion |

### S4 Canned lines on a service (SV-10561)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S4-R4 | Empty state "No lines on this service yet" | P1 | FE only |
| S4-R1 | Add canned lines opens a picker with search | P1 | A8 `GET /api/maintenance/canned-lines?schedule_id=`: the **home location's** canned lines (header workplace for an unsaved schedule) |
| S4-R7 | Picker lists the home location's canned lines whatever the header; no Location field | P1 | A8 `schedule_id` → home workplace; absent → header (new schedule) (GR-7) |
| S4-R8 | Canned lines step helper: "Set up at {home}, where this schedule was built. Other locations add the same work at their own rates" | P1 | FE only (A2 `homeWorkplace.name`) |
| S4-R9 | Only a user with access to the home location changes a service's canned lines; others see the step read only (no add, remove, reorder) with an (i); other steps editable | P1 | `HomeLocationAccess` port (TD-31); A2 `canEditCannedLines`; A4 refuses a canned-line change from a user without home access (403 `CannedLinesLockedError`); A8 with `schedule_id` → 403 without home access |
| S4-R2 | Picker shows hours per line, no price | P1 | Option DTO carries `hours`, no money |
| S4-R3 | Selected lines ordered, reorderable | P1 | `CannedLineRef.position` |
| S4-E3 | No canned-line creation from the picker | P1 | FE only |
| S4-R6 | Service hours = sum of lines; no value anywhere | P1 | Detail returns `hours` sum; no money field anywhere in MR DTOs |
| S4-R5 | Line count opens a hover card: covered services, then lines | P1 | Detail returns covered names and resolved lines |
| S4-N1 | Service with no lines is valid | P1 | `canned_lines` may be empty |
| S4-N2 | Freeform shops are never prompted | P1 | FE only |
| S4-E1 | A canned line edited later changes what the service adds | P1, P6 | Live id references; resolved at read and at append time |
| S4-E2 | A deleted canned line leaves one fewer line, no error | P1, P6 | Missing ids filtered at read and append |

### S5 Reminder timing (SV-10562)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S5-R1 | Per-service rows `[before/after] [n] [days]`, days only | P1 | `ReminderOffsets` VO |
| S5-R2 | Default rows 14 before, on the due date, 7 after | P1 | Server default when a new service omits rows; the 14-before row is left out when the calendar interval is **14 days or less**, exactly 14 included (S5-R13, Q8a ✅ 2026-10-05) |
| S5-R3 | The due-date row cannot be deleted | P1 | VO requires the `on` row |
| S5-R4 | Ceiling five rows | P1 | VO bound |
| S5-R12 | Days 1 to 365; no duplicate rows; a before row must be **shorter** than the calendar interval (every 7 days → 1 to 6), refused inline otherwise | P1 | `ReminderOffsets`: before days `<` interval days (days as N, **months as N×30**, yearly At as 365; Q17 ✅ 918913025); a before row of the interval or longer → 400 field error naming the limit |
| S5-R13 | Interval of 14 days or less: no default 14-before row; a note beneath the rows names the limit ("A reminder before the due date must be shorter than the 7-day interval") | P1 | `ReminderOffsets::defaultsFor()` (S5-R2); the note is FE only (from the service's triggers) |
| S5-R8 | Rows drive due soon on tab, worklist, panel; never listing; email nobody in v1 | P4 | `due_soon_from = due_on − largest before row`. Listing is S13's window; the one exception is the return point of the rest after any completion (S13-R43, S18-R17, TD-36) |
| S5-N1 | No automatic email in v1; a customer is reached only through Send reminder (S14); no send switch | P1 | Nothing to build |
| S5-E1 | After rows have no internal effect in v1 but are kept | P1 | Stored, unused in v1 (kept for automatic sending, deferred to v2) |
| S5-R11 | Compliance has no rows; Remind before expiry instead | P1 | Validation |

### S6 Edit and archive a schedule (SV-10563)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S6-R1 | Applying a schedule copies its services onto the asset | P2 | `EnrolledService` is a copy (TD-04) |
| S6-R2 | Later edits never touch enrolled assets | P1, P2 | Copy semantics; no fan-out on replace |
| S6-R3 | Editing is silent | P1 | FE only |
| S6-R4 | Later enrolments get the schedule as it stands then | P2 | Copy at enrol time |
| S6-N1 | No re-apply action | P2 | No endpoint |
| S6-N2 | Change reaches an asset only by remove + enrol, or archive | P2 | Follows from copy |
| S6-R11 | Edit/remove a service with confirmation; removing a covered service removes it from the coverer, copied lines stay | P1 | Replace drops dangling `coveredServiceIds`, keeps `CannedLineRef`s; confirmation is FE |
| S6-N3 | Removing a service is never retroactive | P1 | Follows from copy |
| S6-R12 | Duplicate active schedule as (Copy)/(Copy 2), no enrolments, opens for edit; archived offers Restore only | P1 | `POST …/duplicate`, 409 on archived |
| S6-E5 | A duplicate keeps the original's home location and canned lines, whichever location it is duplicated from | P1 | `MaintenanceSchedule::duplicateAs()` copies `home_workplace_id` (not the header) |
| S6-R5 | Archive, never delete | P1 | `POST …/archive` |
| S6-R6 | Archiving unenrols every asset; red confirmation with fixed text | P1 status, P2 unenrol | Set-based end of enrolments + projection delete |
| S6-R7 | Archived schedule cannot be applied | P2 | Enrol validation |
| S6-R8 | Restore enrols nothing | P1 | `POST …/restore` changes status only |
| S6-R13 | Remove from schedule on the asset tab, red confirm, same permission as enrolling | P2 | A14 `DELETE /api/maintenance/enrolments/{id}` (soft end) |
| S6-R14 | After removal rows leave tab and worklist; history and certificates stay; open WO unchanged; re-enrol anchors from last completion | P2, P4 | Enrolment ended, projection rows deleted; nothing else touched |
| S6-E1 | Removal keeps history; cycles belong to asset and service | P2 | Completions keyed by vehicle + normalized service name |
| S6-E2 | New schedule anchors from last completion of the same-named service, else now | P2 | Prefill (S7-R4) |
| S6-E4 | Archive keeps history | P2 | Soft end only |
| S6-E3 | New regulatory requirement must be applied per unit; nothing warns | n/a | No BE work (documented weak point) |

### S7 Enrol an asset (SV-10564)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S7-R1 | Enrolment from the asset tab or the customer Assets tab (the work-order entry point → Plan 2); all open the same modal, which offers **every active schedule of the organization**, each with its home location (S1-R14) where the org has more than one workplace | P2 | A9 lists org-wide active schedules (GR-6) with `homeWorkplaceName` and top-level `workplaceCount`; A11 no longer refuses a schedule from another location |
| S7-R23 | Enrol for one of the asset's customers; that customer governs everywhere; asset appears once per enrolment | P2 | `company_id` on enrolment; link checked in the DTO |
| S7-N6 | No schedules: plain message and route to create one | P2 | Preview returns an empty list and `canManageSchedules`; FE |
| S7-E8 | A schedule the asset is already on (for that customer) is not offered | P2 | Preview excludes it; enrol returns 409 |
| S7-R2 | Modal collects schedule, then optional last service date per service; no readings | P2 | Enrol command shape |
| S7-R4 | Last service date prefilled from the latest completion of a same-named service on the asset, any schedule; blank = today; never future | P2 | Prefill query; `lastServiceOn ≤ today` validation. Name match case- and space-insensitive, latest completion wins (Q8 ✅ 2026-10-05) |
| S7-R7 | Static modal title | P2 | FE only |
| S7-R8 | "(optional)" inline | P2 | FE only |
| S7-R15 | Needs mileage/engine hours reading badge per watched meter with no usable pair | P4 | A10 preview exposes `needsMileageReading`/`needsHoursReading`, computed from the usable pairs per meter from `MeterEstimator` |
| S7-E4 | Several schedules per asset; overlaps produce separate rows | P2 | No uniqueness across schedules |
| S7-E5 | Applied as it stands | P2 | Copy all services |
| S7-R6 | Compliance row shows current record (number, **End date**) or No record + Add | P2 | Preview joins current record by normalized name; A10 `complianceRecord {id, certificateNumber, endDate}` |
| S7-R24 | Customer Assets tab: Enroll in Schedule; assets of that customer, Select all, search type/make/unit/VIN | P2 | Bulk preview endpoint; every asset linked to the customer (no inactive state in v1; Q7 ✅ 2026-10-05) |
| S7-R25 | Already-on assets greyed and not tickable; "Enroll N assets" | P2 | `alreadyOn` flag (A12); bulk rejects them |
| S7-R26 | Bulk asks no dates or certificates; states how many have history | P2 | `withHistoryCount` in preview and result |
| S7-N7 | One customer at a time | P2 | Bulk validates every vehicle against the one company |
| S7-N4 | No bulk from the schedule side | P2 | No endpoint |
| S7-R13 | Modal shows and changes the customer's setting, writing the customer field | P2 | Customer setting endpoint (TD-12) |
| S7-R14 | Enrolling and notifying are separate acts | P2 | Separate endpoints, separate audit |
| S7-R17 | Setting on by default for existing and new customers; where it is off, Send reminder is unavailable for that customer (S14-R9, Plan 2) | P2 | Column default 1 |
| S7-R18 | Live toggle on the customer card and checkbox in the modal; not in the edit dialog | P2 | Dedicated endpoint; field on `GET /api/customers/view/{companyId}`; `customers/change` untouched |
| S7-R19 | Turning it off states how many enrolled units go silent | P2 | `maintenance_enrolled_units_count` on A16 `customers/view`; `affectedUnitsCount` on the A15 PATCH response |
| S7-R20 | A customer none of whose contacts has an email cannot be sent a reminder; every surface that shows the setting says so, with a way to add a contact | P2, P7 | **One rule, any contact of the company with a non-empty email (trimmed)** (Q11 ✅ changed 2026-10-05). A16: `maintenance_units_without_email_count` **dropped with no replacement**: the FE derives it from the `contacts[].email` A16 already returns, with the same rule. A9 `customers[].hasEmail` (same rule, per customer; no longer the asset's preferred contact). A30 `customerHasEmail` (moved from Plan 2 A30′ into P7, because the contact card shows the setting). A15 drops `unitsWithoutEmailCount`. "Add contact" is the existing `POST /api/contacts/create` (CE or WC), FE only |
| S7-R21 | One value covers every unit of that customer | P2 | Company-level column |
| S7-R22 | Changing it needs edit customer; not the AP/AR gate | P2 | `ROLE_CUSTOMER_CREATE_AND_EDIT` |
| S7-N5 | No bulk consent | P2 | No endpoint |
| S7-E6 | Unlinking the enrolling customer ends tracking for that customer | P6 | `EndEnrolmentsOnVehicleUnlinkedSubscriber` |
| S7-E7 | Setting change stands if enrolment is cancelled | P2 | Separate request, own transaction |
| S7-R9 | Enrolment never sends anything to a customer (nothing in v1 emails automatically, S5-N1) | P2 | **Nothing to build. No `backlog_suppressed`** (D18 superseded by D24) |
| S7-R10 | Confirmation states both halves | P2 | FE only |
| S7-N2 | Nothing suppressed internally; rows appear immediately with real status | P2, P4 | Synchronous projection |
| S7-E1 | Meter At already passed: Mark as done (default) or Leave due | P2 | Enrol command `meterAtPassed: done|leave_due`; done writes an `enrolment` completion |
| S7-E2 | Calendar At takes next occurrence, counting today | P4 | `CycleHistory` |
| S7-E3 | Enrolment never invents a past | P2, P4 | Anchor = entered/recorded date, else today |

### S8 Compliance records (SV-10565)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S8-R13 | Asset card Compliance section: one line per current record ("CVIP · AB-4471902 · ends 14 Oct 2026"), opens the form, + Add record; shown with or without a schedule | P2 | A17 `GET /api/vehicles/{id}/compliance-records` |
| S8-R5 | One record form for the enrolment row and (Plan 2) the work order | P2 | Same create endpoint |
| S8-R2 | Type, term, **Start date, End date**, optional certificate number, one optional attachment | P2 | `ComplianceRecord` (`start_on`, `end_on`) |
| S8-R6 | Field widths half/full | P2 | FE only |
| S8-R7 | Existing record shows Edit, + Add record stays for renewal | P2 | Edit current, add new |
| S8-R12 | Records per asset and service; latest **End date** is current; renewals add; edit corrects the current one only; carry-over by service name | P2 | `normalized_service_name` key; current = latest `end_on` not voided; edit refused on non-current (409). A renewal drives at once, even with a future Start (Q8 ✅ 2026-10-05) |
| S8-R10 | Start date + term fills End date; End date − term fills Start date; both days, picked from a calendar; typed beats derived | P2 | `CertificatePeriod` VO (days; same day number, clamped to the end month's last day in both directions: 31 Jan + 1 month = last day of February; `CalendarMath::addMonthsClamped/subMonthsClamped`, TD-33; Q15 ✅ 2026-10-05) |
| S8-R11 | Term plus at least one of Start/End required; a certificate always shows when it ends | P2 | VO validation (400 when neither date) |
| S8-E2 | Valid through its End date; lapses the day after; weekends/holidays do not move it | P2 | VO + resolver (overdue from `end_on + 1`) |
| S8-E1 | Start date entered by hand for a certificate already months old | P2 | Past Start allowed |
| S8-R3 | Label "Certificate number" | P2 | FE only |
| S8-R4 | Number optional, always present | P2 | Nullable column |
| S8-R9 | Attachment reuses the DVI component; replacing replaces the only one | P2 | Upload/replace/remove endpoints. **Engineering decision:** a new upload field (`CertificateAttachmentField`, FD-18; storage D5/TD-13) replaces "reuse the DVI attachment component", because DVI's component is photo-only (images, FK-bound to inspections) and a certificate is usually a PDF. File types settled by Q5 ✅ 2026-10-05: one PDF/JPEG/PNG ≤10 MB, replace/remove |
| S8-R8 | Record survives schedule removal | P2 | Record not tied to an enrolment |
| S8-N1 | Record with no schedule | P2 | Same |
| S8-N2 | Compliance service with no record cannot come due, excluded from counts | P4, P7 | Same as S3-N2 |
| S8-N3 | No Certificates tab | P2 | FE only |
| S8-E3 | Work order closing two inspections asks per record | → Plan 2 | — |
| S8-E4 | Adding a record moves the due date immediately | P4 | Recompute in the record's transaction |

### S9 Asset Maintenance tab (SV-10566)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S9-R16 | Maintenance tab is last; asset opens on Work Orders | P5 | FE only |
| S9-R14 | Not on a schedule: empty state with Enroll in Schedule | P5 | Tab DTO `enrolments: []` |
| S9-R1 | Reading cards: mileage and hours, recorded or estimated, with age | P5 | A24 `readings {mileage, hours}` (`ReadingCardDto`) |
| S9-R2 | Recorded shows the exact value; estimate carries badge and basis | P5 | `ReadingCardDto.recorded` vs `ReadingCardDto.estimate` per card |
| S9-R17 | Low confidence never red | P5 | FE only |
| S9-R4 | Flat list sorted by date, schedule as a column | P5 | Rows from the projection, `ORDER BY due_on` |
| S9-R5 | Next due with the producing rule beneath | P5 | `due.basis` (from the projection's `winning_trigger`) |
| S9-R6 | Last done = cycle anchor date (confirmed reset or elsewhere date), labelled | P5 | `lastDone {date, kind}` |
| S9-R10 | One row per service however many cycles missed | P4 | One projection row per enrolled service |
| S9-E1 | Same service on two schedules: two rows with schedule chips | P5 | Row per enrolled service |
| S9-R7 | Badge: due soon, due today, overdue; none = tracked | P5 | `status` derived at read (`DueStatus::of()`) |
| S9-R8 | Due soon from first reminder row; compliance from Remind before expiry | P4 | `due_soon_from` |
| S9-N1 | No Active/Paused | P5 | FE only |
| S9-N2 | No Ignore/Pause/history/Activity | P5 | FE only |
| S9-R12 | Due cell: earliest candidate and its trigger; others from the menu | P4, P5 | `candidates` JSON + candidates endpoint |
| S9-N3 | Meter without usable readings: calendar date, "Calendar · needs mileage reading" | P5 | `due.needsReadings[]` per row |
| S9-R9 | Routine row menu: Mark complete, Create WO, Skip, Other triggers | P5, P6 | Endpoints exist per action |
| S9-R11 | Compliance row menu: Mark complete (with certificate), Create WO, Skip | P5, P6 | Same |
| S9-R13 | Skip hides from worklist; stays grey on the tab with its date; Undo skip; + Add record on compliance; moves no date | P5 | Skip/unskip endpoints; `skipped_at` on enrolled service and projection |
| S9-R18 | Skipped routine returns on a new reading or new WO; compliance on record change | P5 | Auto-clear in reading, WO-created and record handlers |
| S9-E4 | Off-road unit or inspection elsewhere = Skip; a record brings it back | P5 | Covered by S9-R18 |
| S9-E2 | A reading here recalculates every dependent service immediately | P4 | Recompute in the reading transaction |

### S10 Enter a reading (SV-10567)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S10-R1 | Same dialog from asset and (Plan 2) work order | P3 | FE only. On the WO, readings go through its existing Mileage and Engine Hours fields (S16-R12, Plan 2); the dialog is used on the asset only |
| S10-R2 | Current value read-only with source and age; new on the right | P3 | `GET /api/vehicles/{id}/meter-readings/current` |
| S10-R4 | Reading carries timestamp and author | P3 | `entered_at`, `entered_by` |
| S10-R5 | Saving re-evaluates every threshold immediately | P4 | Recompute in transaction |
| S10-R10 | Every change of mileage/hours stored as a dated reading with source (work order, asset, customer portal, import, API); open WO value In the shop; last entered is current even if lower; lower flagged | P3 | `vehicle_meter_reading`; capture at entry points (TD-05). A WO value counts only when entered or changed on that WO (S10-N6, TD-34) |
| S10-R11 | Value on an open WO is In the shop until invoiced; Mark complete On that WO fixes it too (S18-R19) | P3 state, P6 settlement | `state=in_shop` until `WorkOrderReadingSettler` records it at invoicing **or** at Mark complete On this work order (TD-35) |
| S10-R6 | Own row per meter | P3 | FE only |
| S10-R7 | Undo after saving | P3 | A23 `DELETE /api/vehicles/{vehicleId}/meter-readings/{readingId}` |
| S10-R8 | Wrong reading corrected by entering the right one; both values kept in audit | P3 | New reading row (asset) or in-place WO correction with old/new in `entity_event` |
| S10-R9 | Field reads Mileage | P3 | FE only |
| S10-N1 | No reading is ever rejected by validation | P3 | Only integer ≥0 shape checks |
| S10-N2 | Implausible value: orange confirmation, saves on confirm | P3 | A21 returns `plausibility {mileageMaxPerDay, hoursMaxPerDay}`; A22 returns `implausible`. Same ceiling as S11-R19: 1,500 mileage/day, 24 hours/day, one ceiling for every unit (Q2 ✅ 2026-10-05) |
| S10-N3 | Lower than last saves, flagged, both kept | P3 | `lower_than_previous` |
| S10-N4 | Dialog forecasts nothing | P3 | FE only |
| S10-N5 | No telematics | n/a | None |
| S10-E1 | Gauge and ECU disagree | n/a | None (nothing refused) |
| S10-E2 | Engine swap resets hours; low value expected | P4 | Non-increasing pair discarded, reading kept |
| S10-E3 | Correction recomputes rate and thresholds | P4 | Recompute |
| S10-E4 | Two readings same day: rate takes the higher, display the last | P4 | `MeterEstimator` day collapse |
| S10-N6 | A WO reading counts only when someone entered or changed the value on that WO; the mileage a new WO copies from the asset is not a reading; WOs created from the worklist copy mileage like any other | P3 (P6 for the opener) | TD-34 (`previous` on `MileageChange`/`EngineHoursChange`); TD-14 copies the asset values |
| S10-R12 | At release, past WO and imported mileage/hours are loaded once as dated readings with their source; from release, readings are recorded for every organization | P3 | `meter-readings:load-history` (4.4), run once per environment after the deploy that first carries capture (4.4 "Order"); capture ungated (D27) |

### S11 Rate, estimate, confidence (SV-10568)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S11-R1 | Estimate = last recorded reading carried forward at a computed rate | P4 | `MeterEstimate::valueOn()` |
| S11-R2 | Rate = gain across the last three usable pairs ÷ days they span; fewer pairs use all | P4 | `MeterEstimator` |
| S11-R3 | Imported history and work-order readings both used | P3, P4 | Historical load from `work_order` and `work_order_imported` |
| S11-R4 | Pairs under 7 days discarded | P4 | Guard |
| S11-R5 | Non-increasing pairs discarded | P4 | Guard |
| S11-R6 | Future or impossible-year readings removed first | P4 | Guard |
| S11-R7 | Never cached incrementally | P4 | Recomputed from the log every time |
| S11-R8 | Confidence Low/Medium/High | P4 | `Confidence` enum |
| S11-R9 | Estimated due shows a month with confidence beneath | P5, P7 | `DueDto` (`precision`, `basis`, `confidence`); FE renders |
| S11-R17 | No data is a separate state | P4 | `null` grade |
| S11-R10 | Each meter graded independently | P4 | Per-meter estimate |
| S11-R11 | Every projected value names its rule | P4, P5 | `winningTrigger` |
| S11-R12 | Estimated mileage rounds to 100, hours to 10; recorded exact | P5 | Rounded in the tab DTO |
| S11-R18 | Rate reads "640 a week", no unit | P5 | `ratePerWeek` |
| S11-R19 | Pair beyond plausible accrual discarded for rate; reading kept | P4 | One ceiling for every unit, 1,500 mileage/day, 24 hours/day (Q2 ✅ 2026-10-05) |
| S11-R20 | Pair more than a year apart not used | P4 | Guard |
| S11-R21 | The matrix ships with the spec (no email column since 2026-10-02) | n/a | Reference table; unit tests encode it |
| S11-R22 | One table of age × usable pairs | P4 | `ConfidenceTable` |
| S11-R23 | Usable pair = consecutive readings surviving R4, R5, R19, R20 after R6; 24 months | P4 | `MeterEstimator` |
| S11-R24 | Table cells; In the shop does not refresh age | P4 | In-shop excluded |
| S11-R25 | "Measured from N visits" counts readings in a usable pair | P4, P5 | `measuredFromVisits` |
| S11-R26 | Readings over 24 months not used | P4 | Window + nightly refresh (NFR-014) |
| S11-R27 | Hover text and View work orders | P5 | FE only |
| S11-R13 | Overdue estimate shows month, no figure; a certificate reads its **End date** (day) and Certificate ("14 Oct 2026 · Certificate"); calendar its month | P5, P7 | Basis returned; `DueDto.precision = day` for certificates; FE renders |
| S11-R14 | Rate from the unit's own readings only | P4 | No cohort input |
| S11-N1 | Low: a reminder sent by hand shows "Soon" (S19-R9) | → Plan 2 (Q6, `ReminderDueLabel`) | — |
| S11-N2 | No data proposes no candidate | P4 | Resolver |
| S11-N3 | No projection presented as fact | P5, P7 | `isEstimate` flag |
| S11-E1 | No data is ordinary | P5 | FE only |
| S11-E2 | One usable pair is the floor | P4 | Estimator |
| S11-E4 | Hours sit in Low/No data more often | n/a | None |
| S11-E5 | Worked confidence examples | P4 | Unit test cases |
| S11-E6 | Worked rate example (97.5/day, due in March) | P4 | Unit test case |

### S12 Due date resolution (SV-10569)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S12-R1 | Every active trigger proposes a candidate | P4 | Resolver |
| S12-R2 | Calendar always proposes; No data meter proposes nothing | P4 | Resolver |
| S12-R3 | At lifecycle: meter At once then never; calendar At yearly, overdue until done, early/late does not move next year | P4 | `CycleHistory`. Missed calendar At stays overdue until done: answered by the PRD (MF-15), not pending |
| S12-R4 | Compliance due on the current certificate's **End date**; due soon from Remind before expiry; overdue from the next day | P4 | Resolver (due = `end_on`, `due_soon_from = end_on − remindBeforeMonths`) |
| S12-R5 | Due = earliest candidate | P4 | Resolver |
| S12-R6 | Confidence changes how the date is rendered, never which candidate wins | P4 | Resolver |
| S12-R7 | One candidate in the Due cell; the menu lists the rest; rows never merged | P4, P5 | Candidates stored |
| S12-R8 | Same-day tie names the higher confidence | P4 | Tie rank |
| S12-R9 | Grouping only in email | → Plan 2 | No BE (rows already separate) |
| S12-R10 | Covering stated; within one schedule only | P1, P6 | Validation; reset |
| S12-R11 | Covered services reset with the coverer, own interval | P6 | Covered completions |
| S12-R12 | Canned lines deduplicated by identity | P6 | `AppendServiceLinesToWorkOrder` |
| S12-R13 | Compliance never covered | P1 | Validation |
| S12-R14 | Today = day of the header location | P4 | `MaintenanceToday` from `WorkplaceTimezone` |
| S12-N1 | Meter with no usable delta is silent | P4 | Resolver |
| S12-N2 | Menu never hides a candidate | P4, P5 | All candidates stored |
| S12-E1 | A reset moves every candidate at once | P4, P6 | One anchor per cycle |
| S12-E2 | At does not move when done early or late | P4 | `CycleHistory` |
| S12-E3 | New reading recalculates immediately | P4 | Recompute |
| S12-E4 | Two schedules, same service: two rows | P4 | Row per enrolled service |
| S12-E5 | On invoicing the reading is recorded first, then the cycle resets | P6 | Order inside the invoice subscriber |

### S13 Worklist (SV-10570)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S13-R1 | Customers > Maintenance reminders tab, organization-wide | P7 | Org-scoped query (Golden Rule Exemption GR-1) |
| S13-R32 | Search shared across Customers tabs; no New customer here | P7 | FE only (BE accepts `search`) |
| S13-N1 | No count badge | P7 | FE only |
| S13-R36 | No tile: overdue, due today, due within 91 days, plus every Needs readings row | P7 | Window predicate; the rest after completion (TD-36) never hides a Needs readings row (S13-R36 and S13-R43: a Needs readings row stays listed; Q18 ✅ 918913025) |
| S13-R33 | Empty states: nothing enrolled / nothing in window / no match | P7 | A31 `hasEnrolments`; FE text |
| S13-R12 | Filters: tiles, compliance chip, location (multi-workplace org); no customer/status filter | P7 | Query params |
| S13-R40 | Compliance chip shows compliance rows; combines with tiles; tiles count what it shows | P7 | `compliance=1` on rows and tiles |
| S13-R28 | Never narrowed by header location; location filter instead | P7 | `location_ids[]` on `last_visit_workplace_id` |
| S13-R42 | Tiles, chip, location, search and sort survive leaving the list | P7 | FE only (BE stateless) |
| S13-R2 | Tiles: Overdue (<today), Due in a month (today..+30), Due in 3 months (+31..+91), Needs readings; count assets | P7 | `GET /api/maintenance/reminders/tiles` |
| S13-R3 | Tiles look the same | P7 | FE only |
| S13-R4 | Click filters, click again clears | P7 | FE only (BE param) |
| S13-R5 | Several tiles at once | P7 | Union of time tiles |
| S13-R20 | Time tiles do not overlap; Needs readings crosses them by asset | P7 | Two-set predicate (sketch 6) |
| S13-R22 | Needs readings: service watches a meter with no usable pair; calendar-only never counts | P4 flag, P7 filter | `needs_reading` |
| S13-R29 | Location filter narrows tile counts | P7 | Same predicate builder for rows and tiles |
| S13-N2 | Compliance with no record only when no tile; sorts last; excluded from counts | P7 | Predicate + `ORDER BY due_on IS NULL` |
| S13-R6 | One column set: asset, customer, service, due status, due + confidence/rule, work order + status, actions | P7 | Row DTO |
| S13-R7 | Unit then year make model; fallback year make model | P7 | Row carries the parts |
| S13-R9 | Location column only for multi-workplace orgs | P7 | A32 `workplaceCount` + `workplaces[]`; holds for every user of the org (Q8 ✅ 2026-10-05) |
| S13-R10 | Sort by header only | P7 | `sortBy` |
| S13-R11 | Server-side paging and sorting | P7 | Offset paging |
| S13-R37 | 50 rows, due ascending then unit; asset/customer/service/due sortable; search unit, VIN, customer, service; search narrows tiles | P7 | 50 rows, server-side, infinite scroll (Q6 ✅ 2026-10-05) |
| S13-R39 | Phone layout cards | P7 | FE only |
| S13-R18 | Schedule chip when a unit sits on several schedules | P7 | `scheduleName` + `showScheduleChip` |
| S13-R27 | Row location = workplace of the asset's latest WO; none if never | P4 column, P7 filter | `last_visit_workplace_id`; imported visits count (Q8 ✅ 2026-10-05) |
| S13-E5 | A deleted asset, or one whose customer is deleted, leaves the worklist; history kept (S21-R6) | P6, P7 | INNER JOIN vehicle and company. Asset delete stays a hard delete as today (Q7b ✅ Option A, 918913025; S21-R6); MR rows keep plain ids with no FK (NFR-002), so the history survives |
| S13-R34 | Estimated row shows confidence; compliance Certificate; calendar Calendar; no-usable meter "Calendar · needs mileage reading" | P7 | Row basis fields |
| S13-E3 | Needs-reading row shows the calendar date, no warning style | P7 | Same |
| S13-N3 | A service appears once | P7 | One projection row |
| S13-R13 | Due status column carries the three badges | P7 | `status` |
| S13-R23 | Same badges on both surfaces | P7 | Same derivation (`DueStatus::of()`) |
| S13-R14 | Latest WO addressing the service (either path), with its status; declined stays and offers Create again; live → Open; complete → Invoice | P7 | Latest link + WO status (`workOrder.status`). Partial: a Mark complete against a WO with no link writes no link in Plan 1, so that WO is not shown; Plan 2 TD-110 adds the `mark_complete` link ("whichever path") |
| S13-R25 | Status as the app names it; Complete = done, not yet reset | P7 | Raw WO status. No On Hold (Q7 ✅ 2026-10-05): maintenance surfaces never show "On Hold" (the backend `Status` has no hold value); the app-wide label map `utils/workOrderStatus.ts` is untouched |
| S13-R30 | Create work order: estimate, that customer and asset, at the header location; at the schedule's home location it adds the service's canned lines (S16-R19), elsewhere the same work (S16-N6: names, descriptions, hours at local rates, no parts or prices, internal line note per S16-R23); opens it | P6 | Atomic command (sketch 7); `AppendServiceLinesToWorkOrder` chooses home or copy mode (TD-32) |
| S13-R38 | Raised at the header location | P6 | Header workplace from `WorkplaceDecorator` |
| S13-R17 | One WO per row | P6 | Command per enrolled service |
| S13-R16 | Row actions Contact, Create WO; menu Mark complete, Skip, Open asset | P7 | FE; endpoints from P5/P6 |
| S13-R26 | Complete row offers Invoice (navigation); service resets through invoicing; Mark complete is the alternative | P6 | Automatic reset (TD-07); no step in Plan 1 |
| S13-R41 | Asset's contact has no phone and no email **and** the customer has no company phone → orange Contact border + hover "No phone or email on file" | P7 | Contact fields + `companyTelephone` on the row (already in A30); FE combines them (Q7c ✅ 2026-10-05) |
| S13-R35 | Rows open nothing | P7 | FE only |
| S13-E1 | Two schedules with close services: two rows | P7 | Row per enrolled service |
| S13-R43 | After any completion, by Mark complete or by invoicing, the row leaves the list and returns when its next cycle reaches its first reminder row, even inside the 91 days; a Needs readings row stays listed (S13-R36); every other completion rests the row, including a last service date entered at enrolment | P7 | Rest predicate on `last_done_path IS NOT NULL` (every completion path, the enrolment last service date / "Mark as done" included) until `due_soon_from ≤ today`; Needs readings rows never hidden (TD-36; Q18 ✅ 918913025) |

### S14 Contact card (SV-10571), minus Send

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S14-R1 | Card: contact telephone and mobile, then company telephone | P7 | `contact` block on the row |
| S14-R2 | Email with copy control | P7 | `contact.email` |
| S14-R3 | Tappable phone | P7 | FE only |
| S14-R8 | States for no email and no phone | P7 | Nullable fields |
| S14-N2 | Neither email nor phone: both empty states; no send action unless another contact of the customer has an email | P7 | Nullable fields + A30 `customerHasEmail` (S7-R20); send → Plan 2 |
| S14-N4 | No preferred contact: empty state with an action to set one | P7 | `contact.contactId: null` (the `contact` object is always present); set via existing `POST /api/vehicles/change-contact` |
| S14-E1 | Empty states read complete | P7 | FE only |
| S14-N5 | Nothing hidden by the notification setting | P7 | No predicate on the setting |
| S14-R4, R5, R6, R9, R10, R12, R13, N1, E2, E3 | Send reminder (by hand, through the existing send email dialog), last sent, disabled reason, permission, audit, read receipts | → Plan 2 Q6 | — |

### S21 Audit and traceability (SV-10576)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S21-R1 | Every state change has actor and timestamp | P1–P7 | `entity_event` rows via `EntityEventWriter` in every handler |
| S21-R2 | Adding a service to a WO writes a WO note and an audit entry naming schedule and service | P6 | Internal `communication_note` (Type WORK_ORDER, not customer-visible) + `entity_event` |
| S21-R3 | Completion records where, including another shop | P6 | `path`, `work_order_id`, `elsewhere_shop_name` |
| S21-R4 | Reading correction keeps both values with time and author | P3 | In-place WO correction logs old/new; asset corrections are new rows |
| S21-R5 | Sends logged | → Plan 2 | — |
| S21-R6 | Audit outlives objects; maintenance records, readings, certificates and audit entries are never hard deleted; an asset is deleted as ShopView deletes it today; its history stays in the data, no screen in v1 | P0–P7 | No FKs to vehicle/company/work_order (NFR-002); MR rows end softly only (never hard deleted). Assets and customers stay hard-deleted as today (Q7b ✅ Option A, 918913025); MR history outlives them because no MR table has an FK to `vehicle`, `company` or `work_order` and reads INNER JOIN them; no history screen in v1 |
| S21-R7 | Customer setting change recorded with who and when | P2 | `entity_event` type `company_maintenance_notifications` |
| S21-N1 | WO link never hard deleted | P6 | Link states only |
| S21-N2 | Unenrolled asset and archived schedule keep entries | P2 | Soft end |
| S21-E1 | Per-line tag deferred | P6 | No per-line tag; link table + note |
| S21-E2 | A moved due date traceable to the reading that moved it | P4 | `last_reading_id` on the projection + reading audit row |
| S21-N3 | No screen shows the audit in v1; every entry is recorded from release | P0–P7 | `entity_event`; no read endpoint (Q3 ✅ 2026-10-05) |

### S18 Complete a service (SV-10574), Plan 1 subset

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S18-R1 | Mark complete in the row menu everywhere; one modal (on a WO card row whose lines were added it is the row's button, S16-R17 → Plan 2) | P6 | `POST /api/maintenance/enrolled-services/{id}/completions` |
| S18-R2 | On a work order (any location in the org) or Completed elsewhere | P6 | Picker endpoint (Golden Rule Exemption GR-2) |
| S18-R3 | Reset date never in the future; defaults: today (uninvoiced WO); lines-closed else invoice date (invoiced WO), both offered | P6 | Picker returns `linesClosedOn`, `invoicedOn`, `defaultResetOn`; command validates ≤ today |
| S18-R4 | Elsewhere: optional shop name and reading; date required, no default | P6 | Command; reading written with source `completion_elsewhere` |
| S18-R5 | Compliance: certificate number, Start date, End date, term; Start defaults to the Reset date, End = Start + term, both editable | P6 | Same transaction creates a `ComplianceRecord` (dates); A28 `certificate {certificate_number?, start_date?, end_date?, term_months}`; both dates absent → Start = `reset_on` |
| S18-R6 | Mark complete resets at once; the lines path waits for invoice | P6 | Completion row now; lines path via TD-07 |
| S18-R7 | Covered services reset with the coverer, one date | P6 | Covered completions share `reset_on` |
| S18-R9 | Every closed line stamps its date, visible on the work order | P6 (stamp); → Plan 2 (display) | **Split.** Plan 1: the BE stamp, `UpdateLineData/ChangeCommandHandler` fix (TD-18). Showing the stamped date on the work order → Plan 2 (no WO line UI renders `end_date` today) |
| S18-R10 | Lines path completes when every line completes, by any of the five paths | P6 | Proposal reads `work_order_line.end_date`; test all five paths stamp it |
| S18-R11 | Completion records where | P6 | Same as S21-R3 |
| S18-R12 | Completion travels across the organization | P6 | Org-scoped completion and reset (GR-3) |
| S18-R13 (automatic half) | Proposed date = when that service's lines all closed, else invoice date; accepted automatically | P6 | `ResetDateProposal`; `proposed=1`. Editable step → Plan 2 |
| S18-R17 | Toast with Undo; "Completed · next due counts from"; Undo complete until the next cycle moves; worklist row leaves | P6, P7 | A29 `DELETE /api/maintenance/completions/{id}` (soft); undo allowed only for the latest effective completion. Worklist: rest predicate (TD-36) hides the row after **any** completion (Mark complete `work_order`/`elsewhere`, `invoice`, `covered`, `enrolment`; S13-R43, Q18 ✅ 918913025) until its next cycle reaches due soon; a Needs readings row is never hidden (S13-R36). A29 undoes only Mark complete completions (S18-N8) |
| S18-R18 | Service removed from the asset while its WO was open does not reset | P6 | Subscriber skips ended enrolments (link → `orphaned`) |
| S18-E2 (reversal half) | A cycle that came from an invoice is recalculated when that invoice is reversed and the WO re-invoiced, unless a later completion superseded it | P6 | `RevertMaintenanceOnInvoiceReversedSubscriber` undoes; the next `InvoiceCreatedEvent` re-proposes (links are `open` again). Step refinements → Plan 2 Q3 |
| S18-E2 (credit-memo half) | A credit memo changes nothing; the original date stays intact | P6 | No subscriber on `CreditMemoIssued`; pinned by a test |
| S18-E3 | A pending invoice that ShopView voids because a line was added to its WO is treated as a reversal | → Plan 2 Q3 | Plan 2 owns the VOID reconciliation (its S18-E3 row, NFR-117, TD-104, R2-13); in Plan 1 the reset stands until that WO's next invoice |
| S18-R19 | Mark complete On a work order records that WO's mileage and engine hours as readings, dated the Reset date, as invoicing would, where S10-N6 counts them | P6 | `WorkOrderReadingSettler::settle()` in `MarkServiceCompleteCommandHandler` (path `work_order`) before the completion row; undone by Undo complete (TD-35) |
| S18-N8 (Plan 1 half) | Nothing offers to change a step-confirmed (invoice) date afterwards | P6 | A24 `completed`/`undoable` and A29 apply to `work_order`/`elsewhere` completions only; A29 → 409 `CompletionNotUndoableError` for `invoice`, `covered`, `enrolment` |

Also satisfied by construction in P6 (no extra code): S18-N2 (never invoiced → never resets; Mark complete), S18-N3
(completion works with no canned line; `no_lines` links), S18-N4 (nothing scolds), S18-E1 (early completion
accepted silently), S18-E7 (Mark complete alone keeps fleets current), S18-E8 (invoicing after Mark complete changes
nothing: the link is already `reset`; its other half, "the worklist shows nothing due for it in between", is not by
construction: it is the P7 rest predicate (TD-36), for every completion path, S13-R43), S17-N2 (declined lines reset nothing), S17-E3 (approved later and invoiced
resets).

### S16 / S17 / S22, Plan 1 subset

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S16-R19 | Service lines arrive as ordinary canned lines appended at the end; no nesting, no new column | P6 | `CannedLineAppender` (extracted from the existing handler) |
| S16-R20 | Which service added which lines is stored, not shown on the lines table | P6 | `maintenance_work_order_service_line` |
| S16-N4 | Deleting those lines does not un-address the service | P6 | No FK to `work_order_line`; link state unchanged |
| S16-N6 | At a location other than the home location, Create work order (and Plan 2's Add Service) adds the same work: name, description, hours as new lines at this location's labour type and rate; no prices, no parts; internal line note lists the home parts; tracking and completion stay org-wide | P6 | Copy mode in `AppendServiceLinesToWorkOrder` + `CannedLineAppender::appendCopy()` (TD-32, GR-7) |
| S16-R22 | Each copied line takes this location's labour type of the same name, else this location's default, priced at its rate; a fixed-price home line is priced the same way | P6 | `appendCopy()` labour-type resolution; `fixedPrice`/`fixedLineTotal` null (TD-32). A home line with **no** labour type is copied with none and not priced (PQ-29 ✅ 2026-10-05); tech time copied (PQ-26 ✅) |
| S16-R23 | Each copied line carries an internal line note "Copied from {home}. Parts used there, for reference: …" (fixed price: "… Fixed price there, priced at {local}'s rate here") | P6 | `CopiedLineNote` (pure) + `Note::create(Type::WORK_ORDER_LINE, …, customerVisible: false)` |
| S16-N9 | An organization with one workplace never copies work | P6 | By construction (home = WO workplace) |
| S16-N7 | No lines on an invoiced or paid WO | P6 | Status check in `AppendServiceLinesToWorkOrder` |
| S17-R2 | Adding brings the service's canned lines, or at another location the same work (S16-N6) | P6 | Same |
| S17-R5 | One short internal WO note "{service} added from {schedule}" ("PM-A added from Highway Tractor PM"); never mentions copying (copied lines carry their own note, S16-R23); internal, emails nobody | P6 | `Note::create(... customerVisible: false)`; `CustomerNoteNotificationSender::send()` returns early for non-visible notes |
| S17-R6 | Audit entry with actor and time | P6 | `entity_event` |
| S17-R7 | Added from the worklist creates a WO and shows its number on the row | P6, P7 | Command returns id and number |
| S17-R8 | Lines duplicated across services deduplicated | P6 | Dedup by `canned_line_id` per call and against lines this WO already got from MR links |
| S22-R1 | A WO carries the origin when created from a due service, or when Add Service added a service to it (the latter in Plan 2); stored, not shown | P6 | `created_via` on the link; origin derived from the maintenance link table, `wo_panel` included (TD-16, superseded by the shared rule = Plan 2 TD-112) |

### Deferred to Plan 2 (listed so nothing is lost)

S7-R1 and S8-R5 work-order entry points; S8-E3; S11-N1 (Q6, `ReminderDueLabel`); S12-R9; S14-R4, R5, R6, R9, R10,
R12, R13, N1, E2, E3; S16-R1 to R18, R21, R24, R25, N1, N2, N3, N5, N8, E1, E2, E3 (split half; the merge half is in P6); S17-R1, N1, E1, E2;
S18-R8, R9 (display on the work order; the BE stamp is in P6), R13 (the visible step), R14, R15, R16, R20, R21, N1, N5, N6, N7, N8 (split: the A29 half is in P6), E4 to E6, E3 (the voided pending invoice, Plan 2 Q3), and the step-related refinements of E2 (its reversal half and its credit-memo no-op are in P6, NFR-022); S19 (the hand-sent email; the automatic rules are deferred to v2 by the PRD); S21-R5; S22-R2 to R4, N1, N2, E1, E2.

### Analysis-introduced requirements, backend (NFR)

| ID | Requirement | Origin |
|---|---|---|
| NFR-001 | Every MR table carries `organization_id NOT NULL` and every read/write is scoped through `OrganizationDecorator` (schedules are organization-owned with `home_workplace_id` as data, GR-6). `vehicle.organization_id` is never used for scoping | Finding: `vehicle.organization_id` is nullable and `Vehicle::getOrganizationIdentifier()` returns it unguarded |
| NFR-002 | No foreign key from any MR table to `vehicle`, `company`, `customer`, `work_order` or `work_order_line`; read paths INNER JOIN them so deleted rows drop out; history outlives the objects | Settled (S21-R6, S21-N1) |
| NFR-003 | The projection is recomputed synchronously, in the same transaction as every input write; bulk paths recompute set-based in chunks of 500 vehicles with a fixed number of queries per chunk | E1 |
| NFR-004 | Due status, confidence grade and "today" are derived at read time; nothing time-based is stored except `window_expires_on` | E1, S12-R14 |
| NFR-005 | The invoice reset subscriber never throws, runs in a savepoint, writes only through DBAL, logs `maintenance.invoice_reset_failed` with ids, and is idempotent per link | Settled; invoice transaction finding |
| NFR-006 | Readings are captured where a person or system enters a value, never where a value is copied; every row has an idempotency key unique per organization; an architecture test pins the setter callers | Finding: values propagate WO↔asset in both directions |
| NFR-007 | Reading capture and the one-time historical load run for every organization (S10-R12, D27) | Product Q4, 2026-10-05 |
| NFR-008 | Worklist rows p95 < 500 ms and tiles p95 < 300 ms for an org with 200k projection rows (largest org 18.4k assets × ~10 services); the list/count query never joins `vehicle_company`; contacts come from a second query bounded to the page | Settled (no `vehicle_company` join); production volume |
| NFR-009 | Bulk enrolment is synchronous and set-based, capped at 2,500 vehicles per request (400 above), p95 < 10 s at the cap; archive is set-based with no cap | Settled (no async) |
| NFR-010 | Audit is written to `entity_event`/`entity_event_ref` by a DBAL writer that never flushes the ORM unit of work; batched (500 rows); never `audit_log` | D4; finding: `EntityEventRecorder` flushes the whole UoW and `resolveOrFail()` throws without an actor |
| NFR-011 | The historical load is idempotent, resumable per organization, keyset-batched at 1,000 source rows, run with a cutoff ≤ the deploy time, inside `OrganizationDecorator::runAs()` | E10 / settled |
| NFR-012 | Migrations hand-written; `doctrine:migrations:diff` stays a no-op; globally unique `<alias>__` index names ≤64 chars; hand FKs in `MANUALLY_MANAGED_FOREIGN_KEYS` with a mapped backing index; the `company` column added with `ALGORITHM=INSTANT` | Repo rule |
| NFR-013 | Every MR endpoint is gated by its permission atom only; there is no organization-level switch (D27); the customer setting endpoint is gated too | Product Q4, 2026-10-05 |
| NFR-014 | Projection drift from the sliding 24-month window is repaired by a nightly per-org refresh of rows whose `window_expires_on ≤ today`, and a reconciliation command that recomputes and logs drift | Finding: S11-R26 window moves daily |
| NFR-015 | Every client id is ownership-checked in the Request DTO; arrays fail whole on one foreign id (`count(resolved) === count(requested)`) | Repo rule |
| NFR-016 | Cross-workplace reads happen only at GR-1 to GR-3, GR-6 and GR-7, always inside one organization | E2; PRD 2026-10-02 (S1-R1, S4-R7) |
| NFR-017 | No MySQL-only date arithmetic in queries: dates (today, horizons) are computed in PHP and bound, so functional tests on SQLite run the same SQL | Finding: SQLite shim set (`tests/Support/SqliteFunctionsEventSubscriber.php`) has no `DATE_ADD` |
| NFR-018 | Certificate files: one per record, PDF/JPEG/PNG, ≤10 MB, stored under an org-scoped path; download goes through an authorized endpoint, never a public URL | Q5 ✅ 2026-10-05 |
| NFR-019 | Before extracting `ServiceWorkOrderOpener` and `CannedLineAppender`, characterization tests pin the current behavior of `WorkOrders/Application/Create/CreateCommandHandler` and `Line/CreateFromCannedLine/CreateCommandHandler` | Repo rule (test before change) |
| NFR-020 | Create work order from a row is one transaction: no work order without its lines and link | Settled |
| NFR-021 | MR writes that follow a work-order edit (reading capture and recompute) never block that edit when the handler runs without a transaction (WO Create): failures there are caught and logged, and the reconciliation command repairs the projection | Finding: `WorkOrders/Application/Create/CreateCommandHandler` runs with no transaction by design (SV-8685 docblock) |
| NFR-022 | Every invoice reversal path undoes what the invoice reset did: `POST /api/invoices/reverse-invoice` and `POST /api/invoices/remove-customer-transaction` (the unpaid payment-dialog dismissal) both lead to `InvoiceReversedEvent`, whose subscriber undoes every effective completion that invoice created and that no later completion superseded (with its covered completions), reopens the work-order link, re-settles the WO's readings (TD-35: In the shop again unless an effective Mark complete On that WO keeps them recorded at its Reset date), and recomputes. It runs after the reversal commit, catches everything and never fails the reversal. A credit memo changes nothing. An invoice voided by adding a line to its WO (no event) is reconciled at the next invoice of that WO (Plan 2 Q3; S18-E3, now settled) | Plan 2 FE finding (payment-dialog dismissal reverses the invoice) + code verification (`InvoiceReversalService::reverse()`); S18-E2, S18-E3, S10-R11, S12-E5 |
| NFR-023 | Copying work to a non-home location never copies a price, a fixed price, a part, an adjustment or an inspection link; the copy is recorded in each line's internal note | PRD 2026-10-02 (S16-N6, S16-R22, S16-R23) |
| NFR-024 | A schedule's canned lines change only through a user with access to its home location, enforced server-side on A3/A4/A8; the home id is never taken from the request on A4/A5 | PRD 2026-10-02 (S4-R9) |

### Analysis-introduced requirements, frontend (NFR-F)

| ID | Requirement | Origin |
|---|---|---|
| NFR-F01 | Existing screens touched by the feature keep every existing element, test id and behavior; the maintenance additions (Customers tabs, Settings nav item, asset tab, Compliance card, customer toggle, Enroll in Schedule) are additive and render for users with the permission; for a user without the surface's permission, every touched existing screen renders as today | Analysis (FE); no flag since 2026-10-05 (D27) |
| NFR-F02 | Base dialogs render byte-identically when `fullscreenOnPhone` is unset | Analysis (FE) |
| NFR-F03 | No "0" or empty state while a count or list is loading (skeleton/spinner) | Analysis (FE) |
| NFR-F04 | FE derives no status, confidence, "today", rounding or precision | Analysis (FE) |
| NFR-F05 | Every maintenance write invalidates through one helper | Analysis (FE) |
| NFR-F06 | Every async control is re-entrancy-guarded (`:async-click`, `:async-confirm`, `:async-submit`, `useAsyncAction`) | Analysis (FE) |
| NFR-F07 | `data-test-id` on every interactive element. Moved ids unchanged | Analysis (FE) |
| NFR-F08 | Hover content reachable by hover, focus, Enter/Space and tap. Esc closes. Phone uses a sheet | Analysis (FE) |
| NFR-F09 | Vocabulary: "mileage" / "hours" in full, never mi/km/hrs | Analysis (FE) |
| NFR-F10 | Phone (<sm) dialogs fullscreen. Lists become cards below md. Menus become action sheets | Analysis (FE) |
| NFR-F11 | Maintenance chunks are lazy-loaded (`defineAsyncComponent`) and fetched only when their surface mounts (permission, route, data) | Analysis (FE) |
| NFR-F12 | The worklist table, the worklist tiles and the asset Maintenance tab expose `:data-loading="isFetching"`, so E2E waits on data instead of spinners | Decision D22 (E2E pass, testability note B2) |
| NFR-F13 | Existing Vitest specs of the shared screens that now mount maintenance pieces (Customers.vue, VehicleInvoices.vue, Customer.vue, CustomerLeftSection.vue) pass unchanged against the MSW maintenance defaults | Analysis (FE), D27 |

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|----------|-----------|--------|
| Intake directive (user) | Planning intake | 2026-10-02 (user, verbatim intent): Do not look into Chunk 2, it is not ready yet. We want two tech plans for two chunks; this iteration is Chunk 1 only, then later we see how to connect Chunk 2 on top of that. |
| Intake directive (user) | Planning intake | 2026-10-02 (user, supersedes the 'Chunk 1 only' scope of the first directive above): Figure out dependencies across the whole feature and how they are best built, then create tech plan 1 and tech plan 2 based on that. The split does not have to follow the PRD pages; Product will be asked to update the PRD to match. |
| Intake directive (user) | Planning intake | 2026-10-02 (user): Plan 1 and Plan 2 are built one after the other and RELEASED ALTOGETHER — no shop sees Plan 1 on its own. Readings capture does not need a separate earlier release. _Superseded on mechanism by D28 (shared feature branch, no flag); still released together._ |
| **Q1** (product): S10-S12 (+ copied S16-S18 parts) ready for handoff as written today | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-02: Chunk 2 marked "Ready for tech plan" (handoff 6 October); built as written, including the 2 October edits. |
| **Q2** (product): S11-R19 rate ceiling: one per meter, 1,500 mileage/day, 24 hours/day; same figures drive S10-N2 orange confirm | Confluence comment on the Chunk 1 PRD | ✅ ACCEPTED 2026-10-05 (reply 917667841): one ceiling for every unit, 1,500 mileage/day and 24 hours/day; the same figures drive the S10-N2 confirm. |
| **Q3** (product): S21 audit recorded, no screen this release | Confluence comment on the Chunk 1 PRD | ✅ ACCEPTED 2026-10-05 (917667841): recorded from release, no screen in v1 (S21-N3). |
| **Q4** (product): Feature flag story: off by default per org; off hides+keeps data; readings recorded for all shops; one-time historical load | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED, CHANGED 2026-10-05 (917667841): **no feature flag**; the feature ships to every organization at release; readings recorded for every org; past readings loaded once (S10-R12) → D27, D28, NFR-007, NFR-013. |
| **Q5** (product): Certificate attachment: one PDF/JPEG/PNG <=10MB, replace/remove | Confluence comment on the Chunk 1 PRD | ✅ ACCEPTED 2026-10-05 (917667841): one PDF/JPEG/PNG ≤10 MB, replace/remove (S8-R9). |
| **Q6** (product): Worklist paging: 50 rows at a time, server-side, infinite scroll | Confluence comment on the Chunk 1 PRD | ✅ ACCEPTED 2026-10-05 (917667841): 50 rows, loaded on scroll (S13-R37). |
| **Q7** (product): Wording: On Hold; active asset; email on contact; drop S3-R12 | Confluence comment on the Chunk 1 PRD | ✅ ACCEPTED 2026-10-05 (917667841): On Hold removed; "every asset of that customer" and "deleted"; S13-R41 accepted with the company phone; S7-R20 via Q11; S3-R12 removed. Q7b follow-up ✅ ANSWERED (row below). |
| **Q8** (product): Small confirmations a-g (build unless told otherwise) | Confluence comment on the Chunk 1 PRD | ✅ ACCEPTED 2026-10-05 (b–g, 917667841); **Q8a CHANGED** (917438476): a before row must be shorter than the interval; no default 14-before row at ≤ 14 days; a note names the limit (S5-R12, S5-R13). The "missed calendar At" item is answered by the PRD (MF-15). |
| **DQ1** (data): Assets linked to >1 customer (owed by engineering per index Open Questions) | Production query (read-only) | Query: `SELECT links, COUNT(*) AS vehicles FROM (SELECT vehicle_id, COUNT(*) AS links FROM vehicle_company GROUP BY vehicle_id) t GROUP BY links ORDER BY links;` → 1 link: 502,850; 2+: ≈19,905 (3.8%). Long tail: 1,152 vehicles with exactly 29 links, 708 with 56, 217 with 23, one with 1,486 — looks like shared/duplicated vehicles. Implications: S7-R23 customer chooser must be searchable; worklist must never join vehicle_company (key on the enrolment's customer). Follow-up: orgs=1 for every multi-link vehicle (no cross-org links). Two patterns: (1) placeholder vehicles linked to every customer ('NEED VIN' 1,486 links, 'LOOSE PARTS' 111, 'PARTS' 94, 'PARTS SALE' 80, 'PARTS SALE ONLY' 69, 'NEED/ORANGE' 61) — one per org; (2) org D99C276650C4486DBA3048222D895DC6 (14,212 assets) has one real fleet customer split into N near-duplicate company rows differing only by location punctuation, every vehicle linked to all of them: STURGEON ELECTRIC CO. 29 rows x 1,152 vehicles, ENTERPRISE TRUCK RENTAL 56 x 708, SUNBELT/FLEETNET/FLEETIO 23 x 217. MR implications: enrolment customer chooser must be searchable; worklist/tiles key on the enrolment's customer, never join vehicle_company; placeholder vehicles will appear in bulk enrolment lists. Duplicate-customer cleanup is a separate data-quality item (not MR scope). |
| **DQ2** (data): Enrolled-fleet sizing proxy: assets per organization | Production query (read-only) | Top org 18,449 assets; top 10 between 11.4k and 18.4k; 20th 6.2k. Projection ≈ ≤200k rows per org worst case — live indexed tile counts are fine, no summary table needed. Query: `SELECT HEX(c.organization_id) org, COUNT(DISTINCT vc.vehicle_id) assets FROM vehicle_company vc JOIN company c ON c.id=vc.company_id GROUP BY c.organization_id ORDER BY assets DESC LIMIT 20;` |
| **DQ3** (data): Backfill size: historical WO + imported readings | Production query (read-only) | work_order 197,841 + imported 143,093 historical readings — relevant to the Chunk 2 plan only. _Merge note: the "Chunk 2 only" remark predates D19; the historical load now ships in Plan 1 (P3, Section 4.4) and this volume sizes it._ Query: `SELECT 'work_order', COUNT(*) FROM work_order WHERE type='service' AND vehicle_id IS NOT NULL AND (mileage>0 OR engine_hours>0) UNION ALL SELECT 'imported', COUNT(*) FROM work_order_imported WHERE vehicle_id IS NOT NULL AND (vehicle_mileage>0 OR vehicle_hours>0);` |
| **E1** (engineering): Due-date persistence strategy (D1) | User (engineering decision) | Store calculated due date per enrolled service; recalculate synchronously in the same transaction as every input write; set-based for bulk; status/confidence/today derived at read time |
| **E2** (engineering): Golden Rule Exemption: org-wide (cross-workplace) worklist read (D7) | User (engineering decision) | Approved where PRD explicit; unclear → Product (see D7) |
| PRD revision 2026-10-02 (Product, Milos Vasic) | Chunk pages + index change log | Schedules org-wide with a home location (C1); no automatic email in v1 (C2); certificates as days (C3); copied work at other locations (C4); Mark complete as the row button (C5). Index Open questions answered: "Whether a compliance certificate records Start and End: yes, as days, End filled from Start plus the term"; "How automated mail is sent: answered for v1, sent by hand through the existing send pattern". Applied by the 2026-10-04 revision (Appendix). |
| **GR-6, GR-7** (engineering): Golden Rule exemptions for org-wide schedules and home-location canned-line reads | User (engineering decision) | ✅ APPROVED 2026-10-04 (PRD-explicit: S1-R1, S4-R7). Section 9. |
| **Q14, Q15, Q16** (product, Chunk 1): S1 "Where it lives" wording vs S1-R1; certificate End date arithmetic (was PQ-27); covered prefill for non-home users (was PQ-26) | Reply 916520963 on the Chunk 1 thread | ✅ ACCEPTED 2026-10-05 (reply 917438476): S1 intro reworded; same day number with the month-end clamp (S8-R10); read-only prefill (S2-R17). |
| **PQ-25, PQ-26, PQ-29** (product, Chunk 2 numbers): re-add after Remove; copied tech time (was PQ-28); a copied line with no labour type keeps none and is not priced | Chunk 2 thread, posted with Plan 2's questions | ✅ ACCEPTED 2026-10-05 (reply 917209101, Chunk 2 #25, #26, #29) (S16-R25, S16-R22). |
| **Q9** (product): Readings on a work order never invoiced stay "In the shop" forever (S10-R11) and never count; fleet shops that do not invoice their own work never build history. Proposal TBD (e.g. a WO reading also counts once Mark complete is used on that WO, or once the WO reaches Complete). | Reply on the Chunk 1 thread | ✅ ANSWERED, CHANGED 2026-10-05 (reply 917405698): a WO reaching Complete does not count; Mark complete On a work order records that WO's readings dated the Reset date (S18-R19, S10-R11) → TD-35. |
| **Q10** (product): S2-E2 "a service needed at two fixed points is set up as two At rows" — a service has one calendar row, so this can only mean two services. Proposal: "two services, not two At rows". | Reply on the Chunk 1 thread | ✅ ACCEPTED 2026-10-05 (917405698): two services, each with its own At (S2-E2). |
| **Q11** (product): S7-R20 "no email address on file" with several contacts per customer. Proposal: the customer card says how many of this customer's enrolled units have a contact with no email; the worklist and contact card use each row's own contact. | Reply on the Chunk 1 thread | ✅ ANSWERED, CHANGED 2026-10-05 (917405698): yes/no, not a count: any contact of the customer with an email (S7-R20, S14-R13, S14-N2); A16/A15 counts dropped. |
| **Q12** (product): S18-R17 / S18-E8 worklist after Mark complete. Proposal: after Mark complete (On a work order or Completed elsewhere) the service's row leaves the worklist and comes back when its next cycle reaches its first reminder row (due soon). Invoice, covered and enrolment completions do not hide the row; Needs readings rows are never hidden (S13-R36). | Reply on the Chunk 1 thread | ✅ ACCEPTED, WIDENED 2026-10-05 (917405698): every completion, by Mark complete or by invoicing (S13-R43, S18-R17) → TD-36. |
| **Q13** (product, formerly E3): Copied mileage: a WO copies the asset mileage at create; recording it as a reading at invoice refreshes confidence age without a real new reading. Recommendation: record a WO reading only when the value was entered/changed on that WO. | Reply on the Chunk 1 thread | ✅ ACCEPTED 2026-10-05 (917405698): only entered or changed values count (S10-N6) → TD-34; TD-14 copies the asset values. |
| Review-register items answered by the current PRD text | PRD text | MF-12: S13-R16 "A Needs readings row keeps every action". MF-13: superseded 2026-10-02: S8-R10 certificate dates are days (Start date, End date; End = Start + term). MF-14: S10-R10 last entered is current even when lower; S11-R5 discards non-increasing pairs. MF-15: S12-R3 + S7-E1: Leave due stays overdue until done; calendar At stays overdue until done. MF-16: S11-R2 + S11-E6 define the rate (2026-10-02). MF-17: S7-R4: any schedule, latest completion, renamed = no match (rule detail folded into Q7c). MF-18: S12-R7/R9: rows never merged; grouping is email-only. MF-19: S2-N9 covering not inherited, acyclic; S12-R11. MF-20: S8-R13 Compliance section on the asset card. MF-21: not answered → Q2. FF-1: S13-R42. FF-2: Key Decisions mobile + S13-R39. FF-3: S2-R12 removed 2026-09-29. FF-4: S9-R13 Undo skip. FF-5: not answered → Q3. FF-6: S1-R2 + S1-R8. OQ-3 → Q7d. OQ-4 → Q8. OQ-5 → DQ2. |
| **Q7b follow-up** (Product asked to confirm that deleting an asset is a soft delete) | Reply 917667841 on the Chunk 1 thread; engineering proposal 917438478 | ✅ ANSWERED 2026-10-05 (918913025): "Option A, keep hard delete." S21-R6 now reads: "maintenance records, readings, certificates and audit entries are never hard deleted; an asset is deleted as ShopView does today; history stays in data, no screen in v1". Built as is (NFR-002, S13-E5); BR22 retired. |
| **Q18** (product, new 2026-10-05): S13-R43 "after any completion" vs S13-R36 "every Needs readings row whatever its date" (and S18-E8). Proposal: a Needs readings row still shows after a completion; the enrolment "Mark as done" rests the row like any completion | Posted on the Chunk 1 thread | ✅ ANSWERED 2026-10-05 (918913025): "OK. A Needs readings row stays listed; every other completion rests the row, including a last service date entered at enrolment" (S13-R43). Built as proposed (TD-36) |
| **Release model** (user, 2026-10-05) | Coordinator correction | One shared feature branch, `feature/SV-3780-maintenance-reminders`; phase PRs target it; QA tests the branch build; the E2E coverage pass and the PR to `develop` run once Plan 2 is done; then the release. No flag, no release toggle → D28. No legal send switch → D29. |
| **PRD answers 2026-10-05** (Product, Milos Vasic) | Chunk 1 thread 913866753 (replies 917667841, 917405698, 917438476); Chunk 2 thread (917733377, 917209101); index page 833290250 change log | All Chunk 1 questions answered. Changes: no feature flag (Q4); S5-R12/R13 (Q8a); S18-R19 (Q9); S7-R20/S14-R13 yes/no (Q11); S13-R43 (Q12); S10-N6 (Q13); S8-R10 clamp; S13-R41 company phone. Both change-log rows are quoted in Appendix › Revision 3. Applied by revision 3. |
| **Chunk 1 Q17** (product, new): months → days for S5-R12 | Posted 2026-10-05, reply 917897217 (Chunk 1 thread) | ✅ ANSWERED 2026-10-05 (918913025): "OK, 30 days per month; a 1-month interval allows 1–29 days" (S5-R12). Built as proposed. |

### Product answers index (2026-10-05)

Backend view: what each answer was and what it changed in this plan.

| Q | Built | Where in this plan | Answer and what changed |
|---|---|---|---|
| Q1 | S10, S11, S12 built as written | S10–S12 tables, P3, P4 | ✅ Answered 2026-10-02; no change |
| Q2 | One rate ceiling for every unit: 1,500 mileage/day, 24 hours/day; same ceiling drives the S10-N2 confirmation | TD-24, `RateCeiling` (P3), estimator guard (P4), plausibility (P3) | Accepted; no change |
| Q3 | S21 recorded, no screen in v1 | S21 table (S21-N3), TD-09 | Accepted; no change |
| Q4 | No feature flag; readings captured for all orgs; one-time historical load | D27, D28, NFR-007, NFR-013, P0 gate, P3, 4.4 | **Changed:** no flag → D27, NFR-013, every gate and test; shared feature branch → D28 |
| Q5 | One certificate file: PDF/JPEG/PNG ≤10 MB, replace/remove | S8-R9, TD-13, NFR-018, P2 | Accepted; no change |
| Q6 | 50 rows a page, server-side, infinite scroll | S13-R37, sketch 6, P7 | Accepted; no change |
| Q7 | No "On Hold" on maintenance surfaces; no active/inactive asset; S13-R41 with company phone; S3-R12 dropped | S3, S7, S13 tables; P2 bulk preview; P7 contact fetcher | Accepted; S3-R12 row deleted; S13-R41 adds `companyTelephone`. **Q7b:** ✅ Option A, keep the hard delete (918913025); S21-R6 row updated; BR22 retired |
| Q8 | Imported visits count; name match case/space-insensitive, latest completion wins; renewal drives at once; location filter/column by org workplace count | `DbalLastVisitLocator` (P4), `ServiceName` (P0), `DbalCurrentCertificateFetcher` (P4), A32 `workplaceCount` (P7) | Accepted, except **(a) changed**: a before row must be shorter than the interval; no default 14-before row at ≤ 14 days; limit note (S5-R2, S5-R12, S5-R13; `ReminderOffsets`, P1) |
| Q9 | Mark complete On a work order records the WO's readings at the Reset date | S10-R11, S18-R19, TD-35, P6 | **Changed** → S18-R19, TD-35 (`WorkOrderReadingSettler`); BR9 closed |
| Q10 | One calendar row per service; two fixed points = two services | `TriggerSet`/`CalendarTrigger` (P1) | Accepted; no change |
| Q11 | Any contact of the customer with an email (yes/no) | S7-R20, S14-N2; A9, A15, A16, A30 (P2, P7) | **Changed** → one `hasEmail` rule; A16/A15 counts dropped; A30 `customerHasEmail` moved into P7 |
| Q12 | Every completion, the enrolment "Mark as done" included, rests the row until due soon; Needs readings never hidden (Q18 ✅ 918913025) | S13-R43, S18-R17, sketch 6 (P7), P7-4 | **Widened** → TD-36 (`invoice` and `covered` rest too) |
| Q13 | A WO reading counts only when entered or changed on that WO; MR-created WOs copy the asset values | TD-14, TD-34, sketch 4, sketch 7, `RecordWorkOrderReadingOnMeterChangeSubscriber` (P3) | Accepted → TD-34; TD-14 copies the asset values; BR8 closed |
| Q14 | PRD wording only: S1 intro reworded | — | Accepted; no change |
| Q15 | Certificate End = Start + term, same day number, clamped to month end both ways | `CertificatePeriod` (P2), TD-33 | Accepted; no change |
| Q16 | A non-home user's new service that covers another gets the covered lines pre-filled, read only | TD-31 A4 new-service rule (P1) | Accepted; no change |
| PQ-25, PQ-26, PQ-29 | Re-add re-attaches surviving lines; copied lines carry tech time; no labour type copied as none | `AppendServiceLinesToWorkOrder`, `CannedLineAppender::appendCopy()` (P6), TD-32 | Accepted; no change |
| **Q17** (new) | Months → days at 30 per month for "before row shorter than the interval" | `ReminderOffsets` (P1), FE `serviceFormRules.intervalDays` | ✅ ANSWERED (918913025): 30 per month, as built |
| **Q18** (new) | After a completion, a Needs readings row still shows (S13-R36 wins); the enrolment "Mark as done" rests the row like any completion (S13-R43) | TD-36, `WorklistPredicates` (P7), `last_done_path` note (4.1) | ✅ ANSWERED (918913025): as built |

Frontend view:

| Q | UI affected | Built | Note |
|---|---|---|---|
| Q2 | `readingPlausibility.ts` | Ceilings from A21 | Unchanged |
| Q3 | — | No audit screen | — |
| Q4 (changed) | GATE, every mount | Permission-only gating (D27, FD-27) | No flag-off state anywhere |
| Q5 | `CertificateAttachmentField` | One PDF/JPEG/PNG ≤ 10 MB | Unchanged |
| Q6 | WL | 50 rows, infinite scroll | Unchanged |
| Q7 | WL badge, EN assets, TG/CC | As built | Unchanged |
| Q8 (Q8a changed) | `serviceFormRules`, `ReminderTimingRows` | Before row < interval; 14-before default dropped at ≤ 14 days; limit note (FD-28) | — |
| Q9 (changed) | MC, AT reading cards | Reading cards refresh after Mark complete on a WO (asset-scope invalidation) | A28 records readings (BE) |
| Q10 | TriggerBlock | Two services | Unchanged |
| Q11 (changed) | TG, EN, CC | Yes/no from A16 contacts / A9 / A30 `customerHasEmail`; Add contact via `ContactDialog` (FD-29) | — |
| Q12 (widened) | WL | Rows leave after any completion (BE, S13-R43) | No FE predicate |
| Q13 | WOA | New WO shows the asset's mileage | BE |
| Q14–Q16 | SE, CF, `scheduleDraft` | As built | Unchanged |
| Q17 (new) | `serviceFormRules.intervalDays` | N × 30 for months | ✅ Q17 (918913025) |
| Q18 (new) | WL | Rows rest after any completion, `enrolment` included; Needs readings rows stay (BE, TD-36) | ✅ Q18 (918913025); no FE predicate |

## 2. Architecture Overview

Backend paths are repository-relative (`api/…`; inside Section 6 BE tables, relative to `api/`). Frontend paths are relative
to `app/src/` unless they start with `app/`, `api/` or `e2e/`. "Create" marks a new file; everything else already exists.
Notation: `GR#n` is an app Golden Rule from `app/AGENTS.md`; `GR-1`…`GR-4`, `GR-6` and `GR-7` are the backend Golden Rule Exemptions in Section 9.

### 2.0 Corrections to earlier analysis that this plan relies on (verified against `develop` at `65531b6e0a`)

| Earlier claim | What the code says | Consequence |
|---|---|---|
| Customer delete emits no event | `Company::recordDeleted()` records `CompanyDeleted` (`api/src/Customer/Customers/Application/Delete/CompanyDeleted.php`), already consumed by `DeleteAccountWhenCompanyIsDeleted` | End enrolments with one more `DomainEventSubscriber`, no change to the delete handler |
| ~11 reading entry points to retrofit | All six work-order entry points (`Create`, `Change`, `ChangeMileage`, `ChangeEngineHours`, `ChangeRequiredData`, `Line/UpdateLineData`) already raise `MileageChange` / `EngineHoursChange` via `WorkOrder::recordMileageChange()` / `recordEngineHoursChange()`; the propagation paths (`UpdateWorkOrdersOnVehicleChange`, `VehicleSwitchCommandHandler`, both merges, `WorkOrderVinChanged`) do not | Work-order capture is one subscriber; only the 7 asset-side entry points need explicit calls |
| Two merge paths | Three: `Vehicles/Application/HTTP/Merge/MergeCommandHandler`, `VehicleManager::mergeVehicles()` (called from the asset edit and from `WorkOrders/Application/HTTP/ChangeVin/ChangeVinCommandHandler`), plus the link split in `Vehicles/Application/HTTP/Change/ChangeCommandHandler::createNewVehicle()` | Lifecycle adapters hook three places, not one |
| `InvoiceCreatedEvent` | There are two classes. The one to subscribe to is the IntegrationEvent `api/src/Invoicing/Invoice/Domain/Event/InvoiceCreatedEvent.php`, published by `Invoice::invoiceCreated()` from `CreateCommandHandler::processCreate()` inside the invoice transaction. `processCreate()` also serves `OpenApi/Invoice/Application/Create/CreateController` and the sandbox seeder | One subscriber covers the app, the Public API and the sandbox |

### 2.1 Bounded context and modules (BE)

Everything lives in the **VehicleService** context, in two new modules laid out to the canonical structure in
`api/.claude/reference/architecture.md` (Domain/Model, Domain/Event, Domain/Repository, Domain/Service; Application
Command/Query/Handler/DTO/Service/EventListener; Infrastructure/Persistence; UI/HTTP, UI/CLI), plus small touchpoints
in other modules.

| Module | Owns | Why here |
|---|---|---|
| `api/src/VehicleService/Maintenance/` (Create) | Schedules, enrolments, compliance records, completions, work-order links, the engine, the projection, the worklist and asset-tab reads, every MR endpoint | Asset-centric service tracking; consumes WorkOrders, Vehicles and MeterReadings through ports |
| `api/src/VehicleService/MeterReadings/` (Create) | `vehicle_meter_reading`, the capture service, the reading dialog endpoints, the historical load | A reading is a fact about the asset, written by WorkOrders, Vehicles, imports and the Public API without knowing Maintenance exists. Not inside `Vehicles/`: that module is flat legacy and its Doctrine mapping prefix `App\VehicleService\Vehicles\Domain` would capture a canonical `Domain\Model` sub-namespace in the driver chain (TD-01) |
| `api/src/Customer/Customers/` (Modify) | `company.maintenance_notifications` and its endpoint | The setting is the customer's own field (D6) |
| `api/src/VehicleService/WorkOrders/` (Modify) | Two extracted application services, the line-close date fix, lifecycle event dispatch | Shared code used by both the existing endpoints and MR |
| `api/src/VehicleService/Vehicles/` (Modify) | Reading capture calls; lifecycle events on unlink/merge/split | Entry points |
| `api/src/EntityEvent/` (Modify) | MR entity types; a DBAL `EntityEventWriter` | Audit (D4, NFR-010) |

### 2.2 Aggregates and consistency boundaries (BE)

| Aggregate (Domain/Model) | Table(s) | Scope | Persistence | Consistency it guards |
|---|---|---|---|---|
| `MaintenanceSchedule` (root) + `ScheduleService` (child) | `maintenance_schedule`, `maintenance_schedule_service` | organization (home location is data, GR-6) | ORM | Name uniqueness (org-wide), ≥1 service, trigger/offset/term validity, cover rules (same schedule, no cycles, compliance never covers or is covered), active/archived lifecycle; canned lines change only when the caller may edit lines (`replace(…, bool $canEditLines)`, S4-R9); `home_workplace_id` never changes after the first Save (duplicate keeps it, S6-E5) |
| `Enrolment` (root) + `EnrolledService` (child) | `maintenance_enrolment`, `maintenance_enrolled_service` | organization | ORM | One active enrolment per (vehicle, company, schedule); the copy of the services; initial anchor; skip state; end reason |
| `ComplianceRecord` (root) + `ComplianceRecordAttachment` (child) | `maintenance_compliance_record`, `maintenance_compliance_record_attachment` | organization | ORM | Term/Start/End derivation (days); edit only the current record; one live attachment |
| `ServiceCompletion` (root) | `maintenance_service_completion` | organization | DBAL repository | Reset date never in the future; covered completions; undo only while latest |
| `WorkOrderServiceLink` (root) | `maintenance_work_order_service`, `maintenance_work_order_service_line` | organization | DBAL repository | Path, origin (`created_via`), state machine open → reset / orphaned (`unticked`, `removed` reserved for Plan 2) |
| `MeterReading` (MeterReadings module) | `vehicle_meter_reading` | organization | DBAL repository | Idempotency key, in-shop → recorded, lower-than-previous flag, soft removal |

Eventually consistent with these (inside the same request, never across processes): the projection
`maintenance_due_projection`, a read model owned by `DueProjectionRecomputer` and written only through
`DueProjectionWriter`.

### 2.3 How the engine and projection sit (BE)

```
                    ┌──────────── input writes (each in its own handler transaction) ─────────────┐
 HTTP: schedule     │ enrol / bulk enrol / remove / archive        (Enrolment, MaintenanceSchedule)│
 HTTP: enrolment    │ add/edit compliance record                   (ComplianceRecord)              │
 HTTP: records      │ Mark complete / undo                         (ServiceCompletion)             │
 HTTP: completions  │ skip / unskip                                (EnrolledService)               │
 HTTP: readings ───►│ reading dialog / undo         ─┐                                             │
 WO/asset/API/imp ─►│ MeterReadingRecorder (capture) ─┴─► MeterReadingRecordedEvent ──┐            │
 InvoiceCreatedEvent│ ResetMaintenanceOnInvoiceCreatedSubscriber (savepoint, DBAL)    │            │
 WorkOrderCreated / │ UpdateMaintenanceOnWorkOrderCreatedListener (location, unskip)  │            │
 VehicleSwitch      │                                                                 │            │
 Vehicle unlink /   │ Maintenance lifecycle subscribers (end / move enrolments)       │            │
 merge / split /    │                                                                 ▼            │
 CompanyDeleted     │                     DueProjectionRecomputer::recomputeVehicles([...])        │
                    └───────────────────────────────┬─────────────────────────────────────────────┘
                                                    │ fixed set of batched reads per 500 vehicles
              ┌─────────────────────────────────────┼──────────────────────────────────────┐
              ▼                     ▼               ▼                  ▼                   ▼
   EnrolledServiceSnapshot   ReadingHistory   CompletionHistory  CurrentCertificate   LastVisitLocator
   (active services)         (all recorded)   (effective)        (latest End date)    (WO + imported)
              └─────────────────────────────────────┬──────────────────────────────────────┘
                                   Domain (pure):  MeterEstimator ──► ConfidenceTable (read time)
                                                   CycleHistory   ──► DueDateResolver
                                                    │
                                                    ▼
                         DueProjectionWriter: DELETE rows for the vehicles, INSERT the new rows
                                                    │
         ┌──────────────────────────────────────────┼──────────────────────────────┐
         ▼                                          ▼                              ▼
  Worklist rows + tiles (P7)              Asset tab (P5)                 Plan 2: WO panel, Send reminder
  status/confidence derived at read with "today" from WorkplaceTimezone
```

### 2.4 Cross-module ports (BE)

| Port (interface) | Defined in | Implemented in | Used by |
|---|---|---|---|
| `MeterReadingRecorder` (application service, concrete) | MeterReadings/Application/Service | same | WorkOrders subscriber, Vehicles/OpenApi/DataImport/CustomerPortal handlers, Maintenance completion and `WorkOrderReadingSettler` (TD-35) |
| `WorkOrderReadingSettler` (concrete) | MeterReadings/Application/Service | same | Invoice reset subscriber, `InvoiceReversalReverter`, Mark complete + Undo (path `work_order`), Plan 2 VOID reconciliation (TD-35) |
| `WorkOrderCompletionDates` | MeterReadings/Domain/Repository | Maintenance/Infrastructure/Persistence/Query/Dbal (effective Mark-complete Reset dates on a WO) | `WorkOrderReadingSettler` (TD-35; MeterReadings never imports Maintenance) |
| `WorklistPredicates` (concrete) | Maintenance/Infrastructure/Persistence/Query/Dbal | same | `DbalWorklistFetcher`, tiles, Plan 2 `DbalManualReminderItemsFetcher` (TD-36, Plan 2 TD-37) |
| `ReadingHistory` | Maintenance/Domain/Repository | Maintenance/Infrastructure/Persistence/Query/Dbal (reads `vehicle_meter_reading`) | Recomputer, asset tab |
| `AssetMeterValues` | WorkOrders/Domain/Service | WorkOrders/Infrastructure/Persistence/Query/Dbal/`DbalAssetMeterValues` (org-scoped read of `vehicle.mileage`, `vehicle.engine_hours`) | WorkOrders Create handler and MR create-WO handler: the `previous` value of TD-34 |
| `ServiceWorkOrderOpener` (concrete) | WorkOrders/Application/Service | same (extracted) | WorkOrders Create handler, MR create-WO handler |
| `CannedLineAppender` (concrete) | WorkOrders/Application/Service | same (extracted) | Create-from-canned-line handler, `AppendServiceLinesToWorkOrder` |
| `MaintenanceEnrolmentCounter` | Customer/Customers/Domain/Service | Maintenance/Infrastructure/Persistence/Query/Dbal | Customer setting endpoint (S7-R19) |
| `EntityEventWriter` | EntityEvent/Domain/Service | EntityEvent/Infrastructure/Dbal | Maintenance, MeterReadings, Customer setting |
| `MaintenanceToday` | Maintenance/Domain/Service | Maintenance/Infrastructure/Time (`WorkplaceTimezone` + Symfony `ClockInterface`) | Recomputer, reads, completion validation |
| `HomeLocationAccess` | Maintenance/Domain/Service | Maintenance/Infrastructure/Security/`EnrolmentHomeLocationAccess` (`WorkplaceFetcher::getByUserId()` + admin-without-enrolment fallback) | A2 `canEditCannedLines`, A3, A4, A8 (S4-R9, TD-31) |
| `HomeCannedLineFetcher` | Maintenance/Domain/Repository | Maintenance/Infrastructure/Persistence/Query/Dbal (canned lines + parts of a home workplace; price columns never selected) | `AppendServiceLinesToWorkOrder` copy mode (TD-32, GR-7); Plan 2 A35/A36 |

Events used: `MileageChange`, `EngineHoursChange` (existing WorkOrders domain events), `WorkOrderCreatedEvent`
(existing, Symfony dispatcher), `CompanyDeleted` (existing), `InvoiceCreatedEvent` (existing IntegrationEvent),
`MeterReadingRecordedEvent` (Create, MeterReadings/Domain/Event), `VehicleUnlinkedFromCompanyEvent` and
`VehicleReassignedEvent` (Create, Vehicles/Domain/Event), `WorkOrderVehicleSwitchedEvent` (Create,
WorkOrders/Domain/Event).

### Frontend overview

**Short version.** Everything lives in a new `components/ts/maintenance/` tree plus one `api/maintenance/` module. All server
state goes through TanStack Query. One invalidation helper, keyed per asset, keeps the asset tab, the worklist, the tiles and the
Compliance section consistent. Three structural traps have to be cleared in P0 before any feature surface lands:
- the Customers page is a single Vuex-backed list with no tabs;
- the asset page's tab bar is copied three times in `customers/VehicleInvoices.vue`;
- `BaseDialog`/`BaseFormDialog` have no full-screen mode.

Each fix is opt-in or zero-DOM-change for every existing consumer. There is no feature flag (D27): the new surfaces appear for every user with the permission once the branch is released.

### 2.5 Where the feature lives (FE)

| Area | Location | Notes |
|---|---|---|
| Feature components | `components/ts/maintenance/{shared,settings,enrolment,compliance,readings,asset,completion,worklist}/` (Create) | `components/ts/` is the TS tree, so no extra `ts/` subfolder is needed. Component-local types go in `components/ts/maintenance/Model.ts` (GR#4) |
| API module | `api/maintenance/{index.ts, MaintenanceModel.ts, keys.ts, queries.ts, invalidation.ts}` (Create), re-exported from `api/index.ts` | Same shape as `api/companies/{index,CompaniesModel,keys,queries}.ts`. Contract types live in `MaintenanceModel.ts` only (GR#4) |
| Customer-context additions | `api/companies/{CompaniesModel,index,queries}.ts` (Modify) | `maintenance_notifications` on the customer detail, plus the single-field mutation (D6) |
| Shared, app-wide pieces | `components/ts/shared/{QueryState,HoverCard,ResponsiveActionMenu,EditableTitle}.vue`, `composables/{useHoverCardTrigger,useSortable}.ts` (Create) | Built in P0 and used outside the feature too |
| Permission gate | `composables/useMaintenanceAccess.ts` (Create) | Permissions only, through `usePermissions()` (reactive). No route guard and no org feature check (D27) |

### 2.6 Routing (FE)

| Surface | Route | Mechanism |
|---|---|---|
| Settings › Maintenance schedules (list) | `administration/maintenance-schedules`, name `MaintenanceSchedules`: a child of the Administration route, beside `InspectionTemplates` (`router/routes.ts` ~:1151) | `component: EmptyTabView`, `meta.requiredPermissions: ['settingsService']`. Placed **after** `InspectionTemplates` so `getFirstPermittedRoute()` keeps its current target for every role (R1-3). Tab wiring goes in `pages/Administration.vue` (asyncComponent ~:165, componentMap ~:199, routeNameToTab ~:225, `components: AdminTab[]` ~:400) and in the nav `components/ts/administration/AdminLeftMenuNav.vue` (after :209) |
| Schedule editor | `maintenance-schedules/new` (`MaintenanceScheduleEditorNew`) and `maintenance-schedules/:id` (`MaintenanceScheduleEditor`, `props: true`) as top-level siblings, the same way the DVI builder sits at `routes.ts:394-424` | No `beforeEnter`; `requiredPermissions: ['settingsService']`. `?readonly` is never trusted: read-only comes from `status === 'archived'` in the detail response |
| Asset Maintenance tab | a 4th child of `customers/vehicle/:id` (`routes.ts:582-598`): `path: 'maintenance'`, name `VehicleMaintenanceTab` | No `beforeEnter`; the parent `requiredCheck` (customers view) is the gate. Keeps `?companyId=` the same way the other tabs do |
| Worklist | `customers?tab=maintenance` (no new route) | The `?tab=` query key, the same pattern as `pages/WorkOrders.vue` `SYNC_KEYS` (:668). There is no child route, so there is no collision with the sibling `customers/:id` (`routes.ts:479`) |

### 2.7 State: query keys and invalidation (FE)

```ts
// api/maintenance/keys.ts (Create)
export const maintenanceKeys = {
  all: ['maintenance'] as const,
  // Settings (org-wide since 2026-10-02: every location sees every schedule; no locationId in the list keys)
  schedules: () => [...maintenanceKeys.all, 'schedules'] as const,
  scheduleList: (p: ScheduleListParams) => [...maintenanceKeys.schedules(), 'list', p] as const,
  scheduleCounts: (search: string) => [...maintenanceKeys.schedules(), 'counts', search] as const,
  scheduleDetail: (id: UUID) => [...maintenanceKeys.schedules(), 'detail', id] as const,
  // A8: home-workplace lines of an existing schedule; header-workplace lines for an unsaved one (locationId only then)
  cannedLines: (scheduleId: UUID | null, locationId: UUID | null, search: string) =>
    [...maintenanceKeys.all, 'canned-lines', scheduleId ?? `header:${locationId}`, search] as const,
  // Asset scope: every key under asset(vehicleId) is dropped by one invalidate
  asset: (vehicleId: UUID) => [...maintenanceKeys.all, 'asset', vehicleId] as const,
  assetOverview: (vehicleId: UUID) => [...maintenanceKeys.asset(vehicleId), 'overview'] as const,   // A24 takes no companyId
  candidates: (vehicleId: UUID, enrolledServiceId: UUID) => [...maintenanceKeys.asset(vehicleId), 'candidates', enrolledServiceId] as const,
  complianceRecords: (vehicleId: UUID) => [...maintenanceKeys.asset(vehicleId), 'compliance-records'] as const,
  currentReadings: (vehicleId: UUID) => [...maintenanceKeys.asset(vehicleId), 'readings'] as const,
  enrolmentContext: (vehicleId: UUID, companyId: UUID | null, customerSearch: string) => [...maintenanceKeys.asset(vehicleId), 'enrolment-context', companyId, customerSearch] as const,
  enrolmentPreview: (vehicleId: UUID, scheduleId: UUID, companyId: UUID) => [...maintenanceKeys.asset(vehicleId), 'enrolment-preview', scheduleId, companyId] as const,
  completionWorkOrders: (vehicleId: UUID, enrolledServiceId: UUID, req: TableQueryPageRequest) => [...maintenanceKeys.asset(vehicleId), 'completion-work-orders', enrolledServiceId, req] as const,
  // Customer scope (bulk enrolment)
  bulkPreview: (companyId: UUID, scheduleId: UUID, search: string) => [...maintenanceKeys.all, 'bulk-preview', companyId, scheduleId, search] as const,
  // Worklist (org-wide; locationId = header workplace, which fixes "today" (S12-R14) server-side)
  worklist: () => [...maintenanceKeys.all, 'worklist'] as const,
  worklistRows: (req: TableQueryPageRequest) => [...maintenanceKeys.worklist(), 'rows', req] as const,
  worklistTiles: (p: WorklistTileParams) => [...maintenanceKeys.worklist(), 'tiles', p] as const,
  worklistMeta: () => [...maintenanceKeys.worklist(), 'meta'] as const,
} as const;
```

```ts
// api/maintenance/invalidation.ts (Create): THE one helper every maintenance write calls (NFR-F05)
export const invalidateMaintenanceForAsset = (
  queryClient: QueryClient,
  vehicleId: UUID,
  companyId?: UUID | null,
): Promise<void[]> =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: maintenanceKeys.asset(vehicleId) }),
    queryClient.invalidateQueries({ queryKey: maintenanceKeys.worklist() }),
    ...(companyId ? [queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) })] : []),
  ]);

export const invalidateMaintenanceSchedules = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: maintenanceKeys.schedules() });
```

Rules:
- Every `useXxxMutation` in `api/maintenance/queries.ts` calls one of these helpers in `onSuccess`. Bulk enrolment and schedule
  archive also invalidate the whole `worklist()` scope and `maintenanceKeys.all`, because they touch many assets.
- `queryFn`s never use `errorHandler` (vue-query.md, rule 2). Inline error UI goes through `QueryState` + `isQueryErrorReal()`.
- A location switch already calls `queryClient.clear()` (`components/navigation/LocationSelector.vue:321`), so a stale "today" or a
  stale location-scoped list cannot survive a switch. Only the unsaved-schedule canned-line key carries `locationId`; the schedule
  list and detail are org-wide.
- No new Vuex state anywhere (SV-6324). The Customers list keeps its existing Vuex dispatch (`customers/fetchCompanies`), moved
  unchanged into a panel.

### 2.8 Permission gating (FE)

```ts
// composables/useMaintenanceAccess.ts (Create). No feature flag (D27): permissions only, reactive.
export function useMaintenanceAccess() {
  const { has, canView, canEdit, seeFinancialData } = usePermissions();
  return {
    canManageSchedules: computed(() => has('settingsService')),                        // S1-N2
    canView: computed(() => canView('customers')),                                      // S9/S13 prerequisites
    canEditCustomerSide: computed(() => canEdit('customers')),                          // enrol, remove, record, reading, skip, Mark complete, toggle, Add contact (S7-R22, S6-R13, S7-R20)
    canCreateWorkOrder: computed(() => canEdit('workOrders')),                          // S13-R30
    canOpenInvoicing: computed(() => has('invoicingPaymentsView') && seeFinancialData()), // WO `finance` route meta
  };
}
```

- No route guard: the router's `requiredPermissions` / parent `requiredCheck` already cover every new route (FD-27).
- The Settings nav item is gated on `settingsService` only. It does **not** copy the DVI gate
  `digitalInspectionsEnabled && myWorkplaces.length` (`AdminLeftMenuNav.vue:192-196`).
- Every maintenance component is a `defineAsyncComponent` behind a `v-if` on a permission or on data (GR#6, NFR-F11). Existing
  elements, ids and behavior of the touched screens (the Customers page, the asset page, the customer card, the customer Assets
  tab and Settings) are unchanged (NFR-F01); the new elements are additive.
- Existing specs of those screens now mount the new async pieces. The P0 MSW defaults (`app/src/testing/handlers.ts`) return
  empty, envelope-correct payloads so they render their empty states (NFR-F13).

### 2.9 Shared components (P0) and who uses them (FE)

| Piece | File | Used by |
|---|---|---|
| QueryState (spinner, then "Unable to load {subject}." + Retry, else the slot; checks error before loading) | `components/ts/shared/QueryState.vue` (Create; a copy of `accounting/shared/AccountingQueryState.vue` without the accounting sentence) | schedule list, editor, asset tab, worklist, compliance section, pickers |
| `fullscreenOnPhone` opt-in prop | `components/ts/shared/dialogs/BaseDialog.vue`, `BaseFormDialog.vue` (Modify) | every maintenance dialog |
| HoverCard (hover, focus, Enter/Space, tap; Esc, blur and leave close it; rich slot; bottom sheet on phone) | `components/ts/shared/HoverCard.vue` + `composables/useHoverCardTrigger.ts` (Create) | S4-R5 line count, S2-R4 calendar (i), S3-R3 type (i), ConfidenceMeter, S13-R41, S18-R1 (i) |
| ResponsiveActionMenu (one action list: `q-btn-dropdown` on desktop, bottom action sheet on phone; per-action disabled reason; hidden when not permitted) | `components/ts/shared/ResponsiveActionMenu.vue` (Create) | schedule list row, asset tab row + schedule menu, worklist row |
| EditableTitle (`revertOnBlank` prop) | `components/ts/shared/EditableTitle.vue` (Create, extracted from `inspections/builder/InspectionEditableText.vue`) | schedule editor title (S1-R7, S1-N3) |
| useSortable | `composables/useSortable.ts` (Create by moving `inspections/builder/useSortable.ts`; the old path re-exports) | service table (S1-R10), canned-line picker (S4-R3) |
| VehicleTabsBar | `components/ts/customers/VehicleTabsBar.vue` (Create) | replaces the 3 copies in `VehicleInvoices.vue` (:226-247, :265-286, :341-362) |
| Customers tab shell | `pages/Customers.vue` (Modify) + `components/ts/customers/CustomerListPanel.vue` (Create; the list moved verbatim) | worklist (P7) |
| DueBadge, DueCell, ConfidenceMeter, `formatDue.ts`, `intervalFormat.ts`, `copy.ts` | `components/ts/maintenance/shared/` (Create) | enrolment, asset tab, worklist; the Plan 2 panel |

### 2.10 Diagram (FE)

```
                         ┌──────────────────────── useMaintenanceAccess (permissions only) ─────────────────────────┐
Settings (P1)            │ Asset page (P2/P5)                      │ Customers page (P0 shell, P7)                     │
AdminLeftMenuNav ─► MaintenanceSchedules ─► MaintenanceScheduleEditor ─► ServiceFormDialog ─► CannedLinePickerDialog
                         │ VehicleInvoices.vue                      │ pages/Customers.vue ?tab=customers|maintenance   │
                         │  ├ ComplianceSection (card, P2)          │  ├ CustomerListPanel (moved, Vuex as today)        │
                         │  ├ VehicleTabsBar (P0) ─► 4th tab        │  └ MaintenanceRemindersTab (P7)                    │
                         │  └ VehicleMaintenanceTab (P5)            │      ├ WorklistTiles / FilterBar / WorklistTable   │
                         │      ├ ReadingCard ×2 ─► ReadingDialog(P3)│      ├ WorklistCardMobile                          │
                         │      ├ MaintenanceServicesTable          │      └ ContactCard (P7)                            │
                         │      └ row menu ─► MarkCompleteDialog(P6)│                                                   │
Customer.vue Assets tab ─► EnrolmentDialog (bulk, P2) ◄─ single (P5) │ Customer card ─► CustomerMaintenanceNotificationsToggle (P2)
                                  │                                   │
        shared: QueryState · HoverCard · ResponsiveActionMenu · BaseDialog/BaseFormDialog[fullscreenOnPhone] · DueBadge/DueCell/ConfidenceMeter
                                  │
        api/maintenance: keys ─ queries (useQuery / useTableQuery / useMutation) ─ invalidateMaintenanceForAsset(vehicleId) ─► $axios ─► BE
```

### 2.11 Seam UI: what Plan 1 renders where a Plan 2 capability is absent (FE)

| Plan 2 capability | Plan 1 renders | Where it is coded |
|---|---|---|
| Send reminder, last sent, the disabled-with-reason state (S14-R4..R6, R9, R12, N1, E2; there is no Resend, S14-R5) | `ContactCard` shows contact details and states only. No send button (hidden, not disabled), no "last sent" line. `maintenance_notifications` is read but only shown as a line "Maintenance notifications are off for this customer" so the advisor sees the setting (S14-N5: nothing hidden from the list) | `worklist/ContactCard.vue` exposes an `#actions` slot that Plan 2 fills with `SendReminderButton`, which opens the app's existing `components/shared/SendEmailDialog.vue` (S19-R3) |
| WO maintenance panel, enrol and certificate from the WO (S16, S7-R1 third entry, S8-R5 WO entry) | Nothing on the WO page. `components/shared/vehicle-info/VehicleCard.vue` and `WorkOrderLeftSection.vue` are untouched | `EnrolmentDialog` `mode: 'workOrder'` exists in the type, `MarkCompleteDialog`/`OrgWorkOrderPicker` take `preselectedWorkOrderId`. `ReadingDialog` is not mounted on the WO (S16-R12: WO readings go through the existing Mileage and Engine Hours fields) |
| Add service to an existing WO (S17-R1 choice), Undo/Remove (S16-R25) | Create work order always creates a new WO | `useMaintenanceWorkOrderActions` has a single `createWorkOrder` (A33). Plan 2 adds Add Service to this WO through A37 `POST /api/work-orders/{workOrderId}/maintenance/services` (`useAddServicesToWorkOrderMutation`; at a non-home WO the lines are copied work, TD-32, reported as `copied`), and Undo/Remove through A44 `DELETE …/maintenance/services/{enrolledServiceId}` (`useRemoveServiceFromWorkOrderMutation`), which sets the link to the `removed` state Plan 1 P6 reserves (`LinkState::Removed`), leaving lines and the WO note untouched |
| Step after invoicing (S18-R8, R13 UI, R14–R16) | Invoice row action **only navigates** to the WO's `finance` tab. Invoicing resets automatically (BE). Nothing is shown after invoicing; this interim state lives only on the feature branch and never reaches `develop` (D28) | `useMaintenanceWorkOrderActions.openInvoicing`. `billing/Invoice.vue` is untouched |
| Origin column (S22-R2..R4) | Nothing. Origin is stored by the BE at creation (S22-R1) | `pages/WorkOrders.vue` untouched |
| Panel hover "Added · 4 lines" (S16-R20) | n/a | `HoverCard` reused as-is |

Disabled states in Plan 1 never point at Plan 2 ("Available soon" does not exist anywhere). A capability that isn't there is absent.

### 2.12 Seams for Plan 2 (BE)

| Plan 2 feature | Extension point delivered by Plan 1 | Notes |
|---|---|---|
| Work-order maintenance panel (S16) | `DueProjectionRecomputer` rows read by `vehicle_id` (`mdp__org_vehicle_idx`); `DueStatus::of()`; `ConfidenceTable`; `MaintenanceAccessGate` (add `guardWorkOrderView()`) | Panel query = projection rows for the WO's vehicle + latest link per service on that WO |
| Add Service to an existing WO (S16-R8/R9/R13, S17-R1) | `AppendServiceLinesToWorkOrder::append(WorkOrder, list<EnrolledService>, CreatedVia::WoPanel)` with the copy mode (TD-32) and invoiced guard already in place; `CreatedVia::WoPanel` and `LinkState::Removed` reserved (Plan 2 Q2 writes `removed`, S16-R25) | "This WO or a new one" reuses `CreateWorkOrderForEnrolledServiceCommandHandler` |
| Addressed state on the WO (S16-R18) | `maintenance_work_order_service` rows by `work_order_id` (`mwos__work_order_id_state_idx`); `LinkPath::MarkComplete` reserved for Mark complete from the panel | Plan 1 P6 Mark complete only marks an existing `lines` link `reset`; a Mark complete against a WO with no link writes no link. Plan 2 TD-110 adds the `mark_complete` link (S13-R14 "whichever path" is completed there) |
| Step after invoicing (S18-R8, R13 step, R14–R16) | `ServiceCompletion.proposed = 1` + `ServiceCompletion::undo()`; links `state=reset` with `reset_completion_id`; `LinkState::Unticked` reserved; `ResetDateProposal` gives the proposed date; `CertificatePeriod` + `ComplianceRecord` for the certificates section | Correction endpoint edits `reset_on` of a proposed completion (new completion + undo of the old keeps history) and audits the cycle-date correction (S21-R1) |
| Reversal and re-invoice (S18-E2) | **Built in Plan 1 P6** (NFR-022, TD-29): `RevertMaintenanceOnInvoiceReversedSubscriber` + `InvoiceReversalReverter` undo the invoice's completions unless superseded, reopen the links and re-settle the readings (`WorkOrderReadingSettler`, TD-35) | Plan 2 adds only the step-related refinements (Q3: unticked/corrected completions, the VOID path) |
| WO split (S16-E3 first half) | Link rows carry `work_order_id` and line ids | Adapter in `SplitWorkOrderCommandHandler` moves links whose lines moved |
| In-shop value as a meter position (S16-E1, Plan 2 TD-108) | `DueDateResolver` (P4) takes each meter's position from `ReadingHistory`; `DbalReadingHistory::recordedForVehicles()` is its one read | Plan 1 builds "in-shop excluded" (S11-R24). Plan 2 TD-108 modifies both files: the latest live In the shop value per meter becomes a **position floor**, so a meter threshold it has reached reads due at once; rate, pairs and confidence age stay recorded-only (S10-R11). This also changes due states on Plan 1's asset tab and worklist; Plan 2 extends P4's `DueDateResolverTest` and the `DbalReadingHistory` tests |
| Reading from the WO (S16-R12) | `MileageChange`/`EngineHoursChange` capture through the WO's existing fields (TD-34); `ReadingDialog` is not mounted on the WO (S16-R12) | A value entered or changed on the WO is captured In the shop and settled by TD-35 |
| Enrol and certificate from the WO (S7-R1, S8-R5, S16-R10, S16-R11) | Enrolment and compliance endpoints are entry-point agnostic | — |
| Manual send and last sent (S14 send set, S19 sent by hand) | `ReminderContactDto` on worklist rows; A30 `customerHasEmail` (P7); `WorklistPredicates` (Plan 2 TD-37); `company.maintenance_notifications`; `EntityEventType` (add `MAINTENANCE_REMINDER_SEND`) | New `maintenance_reminder_send` table |
| Origin reporting (S22-R2..R4) | Origin derived from the maintenance link table: the earliest link on the WO with `path IN ('lines','no_lines')` and `state <> 'removed'`, whatever its `created_via` (`worklist`, `asset`, `wo_panel`); `mark_complete` never counts (S22-N3) (one rule with Plan 2 TD-112; TD-16 superseded) | Column on `WorkOrders/Application/List/ListingQueryHandler.php` via a LEFT JOIN on `mwos__work_order_id_state_idx` |

### 2.13 Seams for Plan 2 (FE)

Plan 2 reuses these **unchanged**:
- `MarkCompleteDialog` (with `preselectedWorkOrderId`);
- `OrgWorkOrderPicker`;
- `CertificateFields` + `certificateDates` (also in the invoicing step);
- `ResetDateField` + `resetDateDefaults` (the invoicing step's editable date; P6 already adds the optional `offers` and `disable` props that step passes, see the P6 file row);
- `EnrolmentDialog` (`mode="workOrder"`);
- `DueBadge` / `DueCell` / `ConfidenceMeter`;
- `HoverCard` (S16-R7 contents card);
- `ResponsiveActionMenu`;
- `QueryState`;
- the base-dialog `fullscreenOnPhone` prop.

Not reused on the work order: `ReadingDialog`. The WO keeps its existing inline Mileage and Engine Hours inputs and the card opens no reading dialog of its own (S16-R12 as answered; same as 2.11 and the 2.12 "Reading from the WO" row).

Hooks Plan 2 needs:
1. `api/maintenance/keys.ts`: add `workOrderPanel(workOrderId)` and `workOrderResets(workOrderId)` under the existing helper. `invalidateMaintenanceForAsset` gains an optional `workOrderId` so the panel refreshes with the tab and the worklist.
2. `ContactCard.vue` `#actions` slot → `SendReminderButton` + `SendReminderDialog` (wraps `components/shared/SendEmailDialog.vue`, S14-R4, S19-R3/R4) plus a "last sent" line (S14-R12). `WorklistRowDto` already carries `customerHasEmail` (A30, Plan 1 P7); Plan 2 adds `lastSentAt` (A30′).
3. Add Service to an existing WO is not a new `useMaintenanceWorkOrderActions` method: Plan 2 calls A37 `POST /api/work-orders/{workOrderId}/maintenance/services` `{enrolled_service_ids}` through `useAddServicesToWorkOrderMutation` (S17-R1, S16-R25 toast "PM-A added · 4 lines"; at a non-home WO the same `AppendServiceLinesToWorkOrder` copy mode applies, TD-32), and Undo/Remove through A44 `DELETE /api/work-orders/{workOrderId}/maintenance/services/{enrolledServiceId}` (`useRemoveServiceFromWorkOrderMutation`), which moves the open link to `removed` (reserved in P6). Plan 1's worklist and asset-tab readers already treat a `removed` link as not the row's WO (positive state lists), so Create work order is offered again. `createWorkOrder` (A33) is unchanged.
4. Mount points that Plan 1 deliberately leaves untouched:
   - `components/shared/vehicle-info/VehicleCard.vue` (one async `WorkOrderMaintenancePanel` line);
   - `billing/Invoice.vue` `createInvoice()` success (opens `MaintenanceResetDatesDialog`);
   - `pages/WorkOrders.vue` columns (origin).
5. The `serviceRowActions.ts` / `worklistRowActions.ts` builders take capability flags, so Plan 2 turns actions on without restructuring.

## 3. Technical Decisions

### 3.1 Settled decisions (planning record)

Settled before the halves were written (these override anything older):

- Split APPROVED. Plan 1 + Plan 2 are built in sequence on one shared feature branch and merge to `develop` together (D28);
  no shop ever sees Plan 1 alone. Plan 1's interim states (invoice reset with no visible step, no Send reminder) never reach `develop`.
- E1 = synchronous projection (store each enrolled service's resolved due date + candidates; recompute in the same
  transaction as every input write; set-based for bulk; status/confidence/"today" derived at read time).
- E2 = cross-workplace reads APPROVED where the PRD is explicit: worklist org-wide (S13-R1, S13-R28), Mark complete
  work-order picker (S18-R2), completion travels across the org (S18-R12). Always OrganizationDecorator, never cross-org.
  Record a Golden Rule Exemptions block in the relevant PRs.
- GR-6 and GR-7 APPROVED 2026-10-04 (user; PRD-explicit since 2026-10-02): schedules are organization-wide (S1-R1, S7-R1)
  and a schedule's home-location canned lines are read from any location (S4-R7, S16-N6). Section 9.
- No separate earlier release for readings; reading capture + the one-time historical load ship in the same release.
- No feature flag (Product Q4, 2026-10-05, D27). Readings are captured for every org from release; past WO and imported readings are loaded once after the release deploy (S10-R12).
- Line-close date stamping fix is IN Plan 1 (UpdateLineData/ChangeCommandHandler does not stamp end_date).
- Invoice-reset listener runs inside InvoiceCreatedEvent's transaction and must never throw.
- Create work order from a row = one atomic BE command. Invoice row action only navigates to the WO's invoicing.
- Bulk enrolment and archive: set-based synchronous writes; no async job.
- No FKs from MR tables to vehicle/company/work_order (hard deletes; history must outlive them); every MR table carries organization_id.
- Worklist/tiles key on the enrolment's single customer and NEVER join vehicle_company.

Decision log (D-numbers; who decided, and why):

| ID | Decision | Decided by | Choice and reason |
|---|---|---|---|
| D0 | Plan split (APPROVED 2026-10-02) | user | Plan 1 'Track, act, clear' = all of Chunk 1 + S10/S11/S12 + Mark complete (S18-R1..R7,R9-R12,R17,R18,R19, the A29 half of S18-N8) + Create work order from a row with line append (S16-R19,R20,N4,N6,N7; S17-R2,R5-R8; since 2026-10-04 also the copy at a non-home location, S16-R22,R23,N9) + automatic reset at invoicing (date = lines closed, else invoice date; no visible step) + origin stored (S22-R1) + contact card without Send. Plan 2 'The work order and the customer' = WO maintenance panel (S16), add to existing WO (S17-R1), editable step after invoicing (S18-R8,R13-R16, and the step refinements of E2; the reversal undo of S18-E2 moved to Plan 1 P6 by the NFR-022 amendment), Send reminder (S19, by hand), Origin column (S22-R2..R4), WO split handling. No Plan 3 (automatic sending deferred to v2, PRD 2026-10-02). — Both planners independently converged. Calendar-first rejected (meter dates would jump later; Plan 2 reopens every Plan 1 surface). Split-by-page not viable. Approved by user. Because both plans release together (the third intake directive), Plan 1's interim seams (automatic reset with no step, no Send reminder) are internal only — Plan 1 and Plan 2 merge to `develop` together from one feature branch (D28); no shop sees Plan 1 alone; they are not Product questions. |
| D1 | Due-date storage | user | Sync projection — User answer 2026-10-02; worklist sort/page/tiles need a stored column; PRD requires immediate recalculation |
| D2 | Readings | agent | asset_meter_reading log table in VehicleService/Vehicles; captured where a value is ENTERED (≈11 entry points) with idempotency key + architecture test on setter callers, never via a column listener (copies would duplicate); one-time historical load from work_order + work_order_imported; WO reading dated by invoice date, else WO start (consistent with S11-R24) — BE planner risk #1; DQ3 sizing _Merge note: superseded on location and name by D20 / TD-01: the table is `vehicle_meter_reading` in the new `VehicleService/MeterReadings` module. The capture shape is one work-order subscriber plus seven asset-side entry points (Section 2.0, TD-05), not ≈11 retrofits._ |
| D3 | BE permission gating | agent | **Schedule read gate (explicit):** schedule reads (A1, A2, A8) stay on ROLE_WORK_ORDER::VIEW because the data is non-sensitive organization configuration (names, intervals, canned-line names and hours, no prices). Enrolment does not depend on it: it reads schedules through A9, which is on ROLE_CUSTOMER::CREATE_AND_EDIT. The API read is therefore wider than the PRD's "Settings tabs behind Settings Service"; tightening A1/A2/A8 to ROLE_ORGANIZATION::CREATE_AND_EDIT is a one-line gate change if review prefers it; Settings Service gates the Settings UI (FE `settingsService`) and every schedule write (BE ROLE_ORGANIZATION::CREATE_AND_EDIT, which the settingsService bundle grants). Settings endpoints gated on ROLE_ORGANIZATION::CREATE_AND_EDIT (read: ROLE_WORK_ORDER::VIEW) through a MaintenanceAccessGate modelled on InspectionTemplateAccessGate; customer-side on ROLE_CUSTOMER/ROLE_VEHICLE atoms; WO creation on ROLE_WORK_ORDER::CREATE_AND_EDIT. No new atoms. The gate checks atoms only (D27). — Honors "no new permission" and the Settings>Service convention; settingsService bundle already includes ORG_CE |
| D4 | Audit mechanism | agent | entity_event with new MR entity types (+ communication_note for S21-R2); not audit_log — audit_log is purged at 90 days, skips CLI, separate DB — violates S21-R6 |
| D5 | Certificate attachment storage | agent | New compliance attachment entity on Shared FileStorage/S3Storage with a PDF+image mime policy; FE picker built on useNoteAttachmentPicker — DVI photo pipeline is image-only and FK-bound to inspections _Merge note: the FE picker is `useFilePicker` (FD-18), not `useNoteAttachmentPicker`._ This replaces S8-R9's "reuse the DVI attachment component" (engineering decision, not a Product question; the file types are Q5) |
| D6 | Customer notification setting | agent | company.maintenance_notifications BOOLEAN NOT NULL DEFAULT 1 (existing rows true) + dedicated single-field endpoint + entity_event audit — Full-form customer save overwrites ~15 fields and emits customer_updated accounting outbox row |
| D7 | Cross-workplace reads (Golden Rule Exemption) | user | Approved where the PRD explicitly asks for cross-location data; anything unclear goes to Product. Explicit today: worklist org-wide (S13-R1 'organization wide, not location specific', S13-R28); Mark complete work-order picker 'from any location in the organization' (S18-R2); completion travels across the org (S18-R12). Always OrganizationDecorator, never cross-org; recorded as Golden Rule Exemptions block in each PR. — User answer 2026-10-02 |
| D8 | FE server state + tab mechanism | agent | TanStack useTableQuery composables; worklist tab on Customers via ?tab= query key; one shared usePageSearchUrlSync("customers"); worklist opts out of subscribeToLocation — app/AGENTS.md forbids new Vuex server state; ?tab= is lighter than child routes |
| D9 | Location precedent | agent | **Superseded by D23** (PRD 2026-10-02: schedules are org-wide). Was: maintenance_schedule.workplace_id NOT NULL as a scope (inspection_template precedent), not the nullable canned-line pattern — Stronger invariant. The NOT NULL survives as `home_workplace_id` (data, not scope) |
| D10 | Shared UI gaps | agent | Generalize AccountingQueryState into a shared query-state component; add a declared maximized prop path for phone dialogs; hover card = ScheduleBlock rendering + ReportInfoIcon trigger set (tap/focus) — Key Decisions require these and none exist app-wide _Merge note: the hover card is a new `HoverCard.vue` built from the `ReportInfoIcon` trigger set; `ScheduleBlock` is left alone (FD-9); the query-state component is a new shared `QueryState.vue` copied from `AccountingQueryState`, which itself is not changed; the phone dialog path is the opt-in `fullscreenOnPhone` prop (FD-7)._ |
| D11 | Line close date | agent | Plan 1 fixes UpdateLineData/ChangeCommandHandler not stamping end_date (+ test over all five closing paths) so reset and Mark complete can propose "lines closed" — Small, unblocks S18-R3 default; FE assumed Plan 2 — BE fix is one line |
| D12 | Invoice reset hook | agent | Listener on synchronous InvoiceCreatedEvent must never throw (catch + log + Sentry); reset failure must not roll back an invoice — InvoiceCreatedEvent runs inside the invoicing transaction |
| D13 | Create work order from a row | agent | One atomic BE command (create WO in estimate + append the service lines + write link/note/audit), not N browser calls; Invoice row action only navigates to the WO invoicing, never arms the invoice shortcut (credit-hold/approval guards) — N HTTP calls today; guard bypass risk |
| D14 | Projection contents | agent | Projection stores every candidate per service (for Other triggers), per-meter usable-readings flag, winning trigger, row location (last visit workplace incl. imported), and the enrolment customer; status/confidence/today derived at read time with "today" from the header workplace timezone on the BE — FE + BE planners |
| D15 | Bulk writes | agent | Set-based synchronous writes for bulk enrolment and archive (largest single customer fleet ≈1,152 assets); no async job in Plan 1 — Avoids a user-visible background state |
| D16 | Flag name | user (Product Q4, 2026-10-05) | **Superseded by D27: no feature flag.** Was: `MaintenanceReminders` (PascalCase, app convention) |
| D17 | No FKs to vehicle/company/work_order | agent | History tables carry organization_id and plain ids; unlink/delete/merge handled by listeners/commands — Hard deletes, customer delete fires no event, S21-R6 _Merge note: customer delete does emit an event: `Company::recordDeleted()` records `CompanyDeleted`, which `EndEnrolmentsOnCompanyDeletedSubscriber` consumes (Section 2.0, P6)._ |
| D18 | Backlog suppression flag | agent | **Superseded by D24.** Was: written at enrolment in Plan 1 (S7-R9) though only the Plan 2 email reads it — BE hidden dependency #4 |
| D19 | Release sequencing | user | **Superseded by D28** (shared feature branch). Still one release of Plan 1 + Plan 2; readings capture and the historical load ship in that release, and the load runs after its deploy — the third intake directive |
| D20 | BE additions from Plan 1 drafting | agent | Readings in own module VehicleService/MeterReadings; event-path tables written via DBAL; invoice listener on Invoicing IntegrationEvent InvoiceCreatedEvent inside a savepoint, catch-all, kill switch MAINTENANCE_INVOICE_RESET_ENABLED (operational safety valve, not a release toggle; TD-07); new EntityEventWriter (existing recorder flushes UoW + needs a user); enrolled-service copies as JSON fields; WOs created from a row copy the asset mileage and hours (TD-14, Q13 ✅; copies are not readings, TD-34); nightly projection refresh (`DueProjectionRecomputer::refreshExpiredWindows()`) for the sliding 24-month reading window (new Terraform schedule); CompanyDeleted event subscribed for customer delete (backend half of this plan) |
| D21 | Schedule editor after the first Save | E2E pass (testability note B1) | After the first Save of a new schedule the editor stays open, does `router.replace` to the schedule's `/:id` route and shows a success toast. Follows the DVI template builder (new → `/:id`). Gives S1-R4 a defined success signal (P1) |
| D23 | Org-wide schedules with a home location (2026-10-04) | Product (PRD 2026-10-02) | Schedules belong to the organization (S1-R1, S7-R1). `maintenance_schedule.home_workplace_id NOT NULL` = the header workplace at the first Save, never changed afterwards; a duplicate keeps it (S6-E5). Renamed from `workplace_id` so no reviewer reads it as a scope. Reads are org-scoped (GR-6); the home's canned lines are read from any location (GR-7); only users with access to the home location change lines (S4-R9, TD-31). Supersedes D9 |
| D24 | No backlog-suppression flag (2026-10-04) | agent | S7-R9 now says only "enrolment never sends anything" and S7-N3 is deleted; the only reader was Plan 2's automatic job, deferred to v2. No column, no computation. If v2 needs "was due at enrolment" it replays the engine at `enrolled_at` from data already kept (initial anchor, completions, readings), or adds the column then with a backfill. Supersedes D18 |
| D25 | Copied work at a non-home location (2026-10-04) | Product (PRD 2026-10-02) | At a location other than the schedule's home, Create work order (and Plan 2's Add Service) copies the work: name, description, hours (and tech time, PQ-26 ✅) as new lines at the local labour type and rate; no prices, fixed prices, parts, adjustments or inspection links; one internal line note per line (S13-R30, S16-N6, S16-R22, S16-R23). TD-32 |
| D26 | Certificates as days (2026-10-04) | Product (PRD 2026-10-02) | Certificates carry a Start date and an End date (days). End = Start + term; Start = End − term; valid through End; overdue from End + 1 (S8-R10, S8-E2, S12-R4). Replaces effective/expiry months. TD-33 (same-day arithmetic with the month-end clamp both ways, Q15 ✅) |
| D27 | No feature flag (Product Q4, 2026-10-05; supersedes D16, D19's flag and TD-11) | user + Product | Nothing checks `MaintenanceReminders`. `MaintenanceAccessGate` keeps its named atom guards and loses `FEATURE_FLAG` and `guardFeatureFlag()`. Every MR endpoint is gated by its permission atom only; the FE `useMaintenanceAccess` reads permissions only. Reading capture, the invoice reset and the reversal undo run for every organization. The one-time historical load stays (S10-R12): it runs once per environment right after the deploy that first carries the capture code (4.4 "Order"). Data left by a rollback stays; there is no per-org off switch |
| D28 | Release through one shared feature branch (supersedes D19's "single release behind the flag"; amends D0) | user (coordinator correction, 2026-10-05) | Branch `feature/SV-3780-maintenance-reminders`, cut from `develop`. **Every phase PR (P0–P7, then Plan 2's Q1–Q6) targets the feature branch**, never `develop`, with the full per-phase gates (static, migration, smoke, browser-walk, code review). Per-phase E2E specs are written in their phase PRs; the formal E2E coverage pass (`/e2e-after-change`, the `## E2E Coverage Summary` block or the override marker) runs once, on the branch → develop PR. `develop` is merged into the branch at least weekly and before each phase PR (never rebase or force-push). QA tests the branch build. When Plan 2's Q6 is done and QA signs off: the coverage pass, one PR from the branch to `develop`, then the release, with its release note. No feature flag, no release toggle. Plan 1's interim states (automatic reset with no visible step, no Send reminder) never reach `develop`, because the branch merges whole. Risks BR18 (drift), BR19 (migration ordering) |
| D29 | Legal send switch (✅ decided 2026-10-05 by the user) | user | **Dropped in both plans.** No `MAINTENANCE_REMINDER_EMAIL_ENABLED`, no `manualSendAvailable`, no `ReminderSendingUnavailableError`. Plan 2 owns the send. The footer ships as specified in S19-R15; legal (postal address, unsubscribe) is a non-blocking fast follow (Chunk 2 #31 ✅ ANSWERED 918945793) and holds neither the branch nor the release; no toggle. Non-production mail safety (a sink or an allowlist, Plan 2 TD-40) is environment safety, not a release toggle |
| D22 | Observable refetch state for E2E | E2E pass (testability note B2) | The worklist table, the worklist tiles and the asset Maintenance tab expose `:data-loading="isFetching"` (NFR-F12), so E2E waits on data instead of spinners. Lands in P5 (tab) and P7 (tiles, table). No P0 shared component carries it |

### 3.2 Backend technical decisions (TD)

| ID | Decision | Choice and reason |
|---|---|---|
| TD-01 | Where the code lives | `VehicleService/Maintenance` and `VehicleService/MeterReadings`, canonical layout. Readings get their own module because the existing `VehicleService_Vehicle` mapping (prefix `App\VehicleService\Vehicles\Domain`, dir `Vehicles/Infrastructure/Doctrine`, `config/packages/doctrine.yaml:341`) is the first match for any class under that namespace, so a `Vehicles\Domain\Model\MeterReading` would be looked up as `Model.MeterReading.orm.xml` in the legacy dir. New mappings: `VehicleService_Maintenance` (prefix `App\VehicleService\Maintenance\Domain\Model`) and `VehicleService_MeterReading` (prefix `App\VehicleService\MeterReadings\Domain\Model`), each with dir `…/Infrastructure/Persistence/Repository/Doctrine`, following `Inspections_Template` at `doctrine.yaml:731` |
| TD-02 | Due-date storage (E1, settled) | Synchronous projection, one row per active enrolled service: resolved due date, due-soon date, winning trigger, all candidates (JSON), and the inputs that read-time logic needs (usable pairs and last recorded date per meter, needs-reading flags, skip, last done, location, last reading id). Recomputed per vehicle in the caller's transaction. Status and confidence derived at read |
| TD-03 | Cross-workplace reads (E2, settled) | Only at GR-1 (worklist, tiles, asset tab rows from other workplaces' schedules), GR-2 (Mark complete WO picker), GR-3 (completion and invoice reset travel across the org), GR-6 (org-wide schedules, TD-30) and GR-7 (home-location canned lines, TD-32). Always `OrganizationDecorator`, never cross-org. Golden Rule Exemptions block in each PR (Section 9) |
| TD-04 | Enrolled-service copy shape | A schedule service and its enrolled copy store triggers, reminder offsets, compliance term, canned-line refs and covered refs as JSON value objects (`triggers`, `reminder_offsets`, `compliance`, `canned_lines`, `covered_*_ids`). Copy = clone. Reason: bulk enrolment of a 2,500-unit fleet × ~10 services would otherwise write ~100k child rows of canned-line copies; nothing filters on these fields (the projection carries what the worklist filters on). Canned lines stay live ids (S4-E1, S4-E2) and are resolved at read and append time |
| TD-05 | Reading capture (E3, E4) | Primary log `vehicle_meter_reading`. Work-order side: one `RecordWorkOrderReadingOnMeterChangeSubscriber` on `MileageChange` and `EngineHoursChange`, which every human entry point already raises and no propagation path raises. Asset side: explicit `MeterReadingRecorder` calls at seven entry points (asset create, asset edit, Public API create and update, data import create and update, customer portal create). Architecture test `MeterWriteSurfaceTest` pins every caller of `Vehicle::setMileage/setEngineHours/change()`, `new Vehicle(`, `WorkOrder::setMileage/setEngineHours` to an allowlist, each entry annotated "captures" or "copies" |
| TD-06 | In-shop reading | One row per (work order, meter), key `work_order:{woId}:{meter}`, updated in place on each WO edit with old/new in `entity_event` (S21-R4). Not used by the engine until recorded (S11-R24). **Rewritten by TD-35** (2026-10-05): one row per (WO, meter), updated in place on each WO edit that changes the value (TD-34), old/new in `entity_event` (S21-R4); not used by the engine until recorded (S11-R24); recorded and dated by `WorkOrderReadingSettler` (TD-35); its value is never replaced by the WO's final value (a value that reached the WO by propagation is a copy, S10-N6) |
| TD-07 | Invoice-driven reset (settled) | `ResetMaintenanceOnInvoiceCreatedSubscriber implements IntegrationEventSubscriber` on `App\Invoicing\Invoice\Domain\Event\InvoiceCreatedEvent`. Runs inside the invoice transaction, opens a nested transaction (DBAL savepoint), writes only through DBAL so the EntityManager can never be closed by an MR failure, catches `\Throwable`, rolls back to the savepoint, logs and returns. Kill switch: container parameter `maintenance.invoice_reset_enabled` from env `MAINTENANCE_INVOICE_RESET_ENABLED` (default `1`). **Operational safety valve, not a release toggle:** it is global, defaults on, hides no surface and is never used to stage a rollout (D27). It exists because this subscriber runs inside every invoice transaction, so operations need a way to take MR code off the invoicing path without a deploy if it ever misbehaves (BR2). Turning it off stops every S18 reset (and the reversal undo, TD-29) for every shop until it is turned back on; Section 8 lists the repair commands |
| TD-08 | ORM vs DBAL persistence | ORM for aggregates written only from MR HTTP handlers (schedule, enrolment, compliance record). DBAL-backed repositories for tables written from event paths (readings, completions, links, projection): a domain subscriber dispatched from `DoctrineRepository::persist()` runs before the outer flush (application-layer.md), so a nested ORM flush there is the known hazard, and an ORM exception closes the EntityManager the invoice transaction still needs. The DBAL tables still have XML mappings so the SQLite functional schema contains them and `migrations:diff` stays a no-op |
| TD-09 | Audit writer | New `EntityEventWriter` port (EntityEvent/Domain/Service) with a DBAL adapter that inserts `entity_event` + `entity_event_ref` rows, batched, no flush. Actor from `AuditUserIdResolver::resolve()`; when no actor resolves (CLI history load, reconciliation) it writes nothing and the row's own `source`/`entered_by NULL` is the trail. Workplace = header workplace, or the WO's workplace on invoice paths. `EntityEventType` gains the MR types and labels so existing readers recognise them. Not `EntityEventRecorder`: it flushes the whole unit of work mid-transaction and `resolveOrFail()` throws without a user |
| TD-10 | Permissions (D3, no new atoms) | **Schedule read gate decision:** schedule reads stay on `ROLE_WORK_ORDER_VIEW`, because the data is non-sensitive organization configuration (names, intervals, canned-line names and hours, no prices). Enrolment does not depend on it: it reads schedules through A9, which is on `ROLE_CUSTOMER::CREATE_AND_EDIT`. The API read is therefore wider than the PRD's "Settings tabs behind Settings Service"; tightening A1/A2/A8 to `ROLE_ORGANIZATION::CREATE_AND_EDIT` is a one-line gate change if review prefers it; Settings Service gates the Settings UI (FE `settingsService` on the route and nav) and every schedule write (`ROLE_ORGANIZATION_CREATE_AND_EDIT`). Settings reads `ROLE_WORK_ORDER_VIEW`, settings writes `ROLE_ORGANIZATION_CREATE_AND_EDIT`; worklist, asset tab, compliance list `ROLE_CUSTOMER_VIEW`; enrol, remove, reading, skip, Mark complete, records, customer setting `ROLE_CUSTOMER_CREATE_AND_EDIT`; create work order `ROLE_WORK_ORDER_CREATE_AND_EDIT`. All via `MaintenanceAccessGate` (named atom guards; no flag, D27) |
| TD-11 | Feature flag | **Superseded by D27** (Product Q4, 2026-10-05): no feature flag; nothing is seeded or created in the admin tool; capture and the invoice subscriber run for every organization |
| TD-12 | Customer setting (D6) | `company.maintenance_notifications TINYINT(1) NOT NULL DEFAULT 1` added `ALGORITHM=INSTANT`; `Company::changeMaintenanceNotifications(bool)`; dedicated `PATCH /api/customers/{companyId}/maintenance-notifications` so `customers/change` (which records the `customer_updated` accounting outbox row on every save) is not involved |
| TD-13 | Certificate storage (D5) | `Shared/Application/FileStorage/FileStorage` port, path built by `ComplianceStoragePathBuilder` (pattern of `Inspections/Application/Service/Instance/InspectionStoragePathBuilder.php`): `maintenance/{organizationId}/compliance/{recordId}/{attachmentId}.{ext}`; mime policy `ComplianceAttachmentMimeTypes` (PDF, JPEG, PNG; modelled on `Communication/Notes/Domain/SupportedMimeTypes.php`). Replace = new attachment row, previous row `removed_at` set, previous object kept (S21-R6) |
| TD-14 | Create work order from a row (settled: one command) | `CreateWorkOrderForEnrolledServiceCommandHandler` in one `Transactional`: `ServiceWorkOrderOpener::open()` (extracted from `WorkOrders/Application/Create/CreateCommandHandler`), then `AppendServiceLinesToWorkOrder` (which uses `CannedLineAppender`, extracted from `Line/CreateFromCannedLine/CreateCommandHandler`). Q13 accepted (2026-10-05): `ServiceWorkOrderOpener` gets the asset's mileage and hours like any hand-made WO (S13-R38, S10-N6); sketch 7 drops the `null`s. The copy raises `MileageChange(previous = asset value)`, which TD-34 skips, so no phantom in-shop reading is recorded. The appointment step of the existing create is not used |
| TD-15 | Row location (E5) | `last_visit_workplace_id` denormalised on every projection row of the vehicle = workplace of the latest `work_order` (service type) or `work_order_imported` row by date; imported visits count (Q8 ✅). Updated on WO created, vehicle switched, recompute and load |
| TD-16 | Origin (E6) | **Superseded** by the rule shared with Plan 2 (TD-112): origin is derived from the maintenance link table, = the earliest link on the WO with `path IN ('lines','no_lines')`, whatever its `created_via` (`worklist`, `asset`, and `wo_panel` counts); `mark_complete` links never count. No column on `work_order`. (Was: earliest link with `created_via IN ('worklist','asset')`.) |
| TD-17 | "Today" | `MaintenanceToday::date()` = now in `App\Shared\Application\WorkplaceTimezone` (session header workplace), UTC fallback for CLI. Bound as a parameter (NFR-017) |
| TD-18 | Line-close date fix (settled, in Plan 1) | `UpdateLineData/ChangeCommandHandler.php:41` calls `$line->markAsCompleted()` instead of `setStatus(new LineStatus(LineStatus::COMPLETE))` |
| TD-19 | Lifecycle hooks | Vehicles dispatches `VehicleUnlinkedFromCompanyEvent` (asset delete per customer) and `VehicleReassignedEvent` (merge, VIN merge, link split) through `DomainEventBus` from the handlers; Maintenance subscribes. Customer delete uses the existing `CompanyDeleted`. Vehicles does not import Maintenance |
| TD-20 | Bulk (settled) | Set-based synchronous writes. Archive: one UPDATE ending enrolments + one DELETE of projection rows by `schedule_id`. Bulk enrol: one chunked INSERT per table, then `recomputeVehicles()` in chunks of 500. Cap per NFR-009 |
| TD-21 | Contacts on the worklist (settled: never join `vehicle_company`) | The list and count queries never touch `vehicle_company`. A second query reads the preferred contact for exactly the page's (vehicle, company) pairs (≤50) |
| TD-22 | Projection freshness | `maintenance:projection:refresh` (nightly, per org via `runAs`) calls `DueProjectionRecomputer::refreshExpiredWindows($organizationId, $today)`, which recomputes vehicles whose rows have `window_expires_on ≤ today` `maintenance:projection:reconcile` recomputes an org and logs drift. Schedule = EventBridge → ECS RunTask (pattern `infrastructure/modules/services/shopview/search-maintenance.tf`) |
| TD-23 | Service-name matching | `ServiceName::normalize()` = trim, collapse inner whitespace, lower-case (`mb_strtolower`); stored as `normalized_*name` for prefill, carry-over and history (Q8 ✅ 2026-10-05) |
| TD-24 | Rate ceiling | `RateCeiling` constants: mileage 1,500/day, engine hours 24/day; used by the estimator guard (S11-R19) and the plausibility check (S10-N2); one ceiling for every unit (Q2 ✅ 2026-10-05) |
| TD-25 | Schedule save model | Whole-document create (`POST`) and replace (`PUT`); services carry their id when they exist so cover refs stay stable; a new service sends a client-generated UUID (validated `Assert\Uuid`, rejected if it exists anywhere) so covers inside one document can reference siblings not yet saved |
| TD-26 | Cycle anchors | The enrolled service keeps only its initial anchor (date + meter values at enrolment). Every later anchor comes from the latest effective (`undone_at IS NULL`) completion. Undo is a flag, never a delete. The resolver replays history deterministically, so a correction anywhere recomputes everything (S11-R7) |
| TD-27 | Skip state | On `EnrolledService` (`skipped_at`, `skipped_by`), copied to the projection. Auto-clear: routine on a new reading or a new/switched WO for the vehicle; compliance on any record change for that service name |
| TD-28 | Work-order picker scope | Lists service-type WOs for the vehicle across every workplace of the org (GR-2), ordered `updated_at DESC, id DESC` so it rides `wo__organization_id_vehicle_id_updated_at_id_idx` (a vehicle can carry 5,133 WOs); paged 20 |
| TD-29 | Invoice reversal undoes the invoice reset (NFR-022) | Verified paths: (1) `POST /api/invoices/reverse-invoice` → `Invoicing/Invoice/UI/HTTP/ReverseInvoice/ReverseInvoiceController` → `Application/HTTP/Reverse/ReverseCommandHandler` → `Application/Service/InvoiceReversalService::reverse()`; (2) `POST /api/invoices/remove-customer-transaction` → `UI/HTTP/RemoveInvoice/RemoveInvoiceController` → `Application/HTTP/RemoveCustomerInvoiceAndTransaction/RemoveCommandHandler` → the same `reverse()`. `reverse()` hard-deletes the invoice, sets the WO back to `COMPLETE`, commits, and only then calls `Invoice::invoiceReversed()` + `justTriggerEvents()`, which publishes the IntegrationEvent `App\Invoicing\Invoice\Domain\Event\InvoiceReversedEvent(invoiceId, workOrderId)` synchronously (`InvoiceReversalService.php:110-170`). One `IntegrationEventSubscriber` therefore covers both routes. Because it runs post-commit inside the HTTP request, a thrown exception would turn a committed reversal into an HTTP 500: the subscriber catches `\Throwable`, logs `maintenance.invoice_reversal_failed` with ids and returns. It writes through DBAL in its own short transaction. "Superseded" = an effective completion of the same enrolled service with a later `reset_on` exists (Mark complete, another WO): that later completion decides (S18-E2), so the invoice's completion is left alone. Undo is the soft `undone_at` (TD-26), never a delete, with `undone_reason = invoice_reversed`. Links in `reset` go back to `open` so a re-invoice re-proposes through `ResetMaintenanceOnInvoiceCreatedSubscriber`; lines-closed dates live on `work_order_line.end_date`, so the same date comes back (S18-E2). Readings: `WorkOrderReadingSettler::settle()` re-settles the WO's rows (TD-35): back to `in_shop` with `read_on` = WO start date (S10-R11) unless an effective Mark complete On that WO keeps them recorded at its Reset date; the re-invoice settles them again with the new invoice date (S12-E5). Not covered here: (3) `POST /api/credit-memos` publishes `CreditMemoIssued` and leaves the invoice in place, so nothing happens (S18-E2: "A credit memo changes nothing"); (4) `POST /api/work-orders/lines/create` on a WO whose invoice is still `PENDING` sets that invoice `VOID` in `WorkOrders/Application/Line/Create/CreateCommandHandler::updateOrSplitWorkOrder()` (:147-160) with no event: reconciled at that WO's next invoice by Plan 2 Q3, because S18-E3 treats the void as a reversal (Plan 2 S18-E3 row, NFR-117, TD-104); until then the reset stands; (5) a line added to a `SENT`/`PAID` WO goes to a new WO via `PayedWorkOrderReopened`, and the invoice stands: nothing to do. Kill switch: the existing `maintenance.invoice_reset_enabled` (TD-07) gates both invoice subscribers. Repair: `maintenance:invoice-reversal:replay` re-runs the same service for ids from the failure log |
| TD-30 | Org-wide schedules (D23, GR-6) | `MaintenanceSchedule` does **not** implement `WorkplaceIdentifierAware` (a marker only, used by `DoctrineRepository::isWorkplaceEntity()` at `src/Shared/Infrastructure/Persistence/Doctrine/DoctrineRepository.php:270`; nothing else hooks on it). Repository `findById()` uses `isOrganizationEntity()`. Lists join `workplace` (org-scoped) for the home name. `home_workplace_id` is copied to `maintenance_enrolment.home_workplace_id` and `maintenance_due_projection.home_workplace_id` (both renamed from `schedule_workplace_id`). Name uniqueness `(organization_id, name)`; `nameTaken()` org-wide |
| TD-31 | Home-location edit right (S4-R9) | A workplace-axis authorization on top of the SM atom (a tightening, not an exemption). "Access to the home location" = the user's workplace enrolment, the same set the FE location list shows: `WorkplaceFetcher::getByUserId()` (`src/Organization/Workplaces/Domain/Services/WorkplaceFetcher.php:79`) with the admin-without-enrolment fallback to `getAllForOrganization()` (:116), mirroring `AccessibleWorkplaceResolver` and `MyWorkplacesQueryHandler`. Port `HomeLocationAccess::canEditLines(UserId, isAdmin, homeWorkplaceId): bool`. **A3:** the home is the header workplace, verified through `VerifiedWorkplaceIdResolver`; the user must have access to it, else 403; `canned_line_id[]` checked against it. **A4, existing services:** for a user without home access, each existing service's posted `canned_lines` (ordered `{canned_line_id, covered_from_service_id}`) must equal the stored list, else 403 `CannedLinesLockedError` (no silent ignore). **A4, new services:** from such a user may carry only `[]`, or exactly the covered-services prefill (Q16 ✅ 2026-10-05). `canned_line_id[]` checked against the stored home. **A8:** with `schedule_id`, a user without home access gets 403; without it, the header workplace is used. A2 returns `canEditCannedLines` (BE-authoritative; the FE never derives it) |
| TD-32 | Copy mode (S13-R30, S16-N6, S16-R22, S16-R23, S16-N9; D25, GR-7) | **Mode choice:** `AppendServiceLinesToWorkOrder` picks the mode per service: `home_workplace_id == wo.workplace_id` → home mode (today's `CannedLineAppender::append()`); otherwise copy mode (`CannedLineAppender::appendCopy()`). **Line content:** name, description, `time_estimate` and `tech_time` (hours only; tech time PQ-26 ✅). **Labour type:** resolved as the extracted handler already does: same id at this location, else same **name** at this location (`LabourTypeFetcher::getForCurrentLocation()`, `src/Organization/LabourTypes/Domain/Service/LabourTypeFetcher.php:147`), else this location's default (:138). A canned line with **no** labour type is copied with none, so it is not priced (cost 0, as at home and as today's create-from-canned-line path gives) (PQ-29 ✅ 2026-10-05). **Pricing:** `fixedPrice`, `fixedLineTotal` and the fixed portions all null, so the line is priced at the labour rate. **No side effects:** `LineCreated` is dispatched with `cannedLineId = null`, so `AddPartsToLineAfterCreatedFromCannedLine` (`isFromCannedLine()`), the adjustments subscriber (`CannedLinePartsApplied`) and the one inspection subscriber on `LineCreated` (`CreateInspectionsOnCannedLineReuse`, same `isFromCannedLine()` guard) do nothing (verified in `src/VehicleService/WorkOrders/Application/Part/Create/AddPartsToLineAfterCreatedFromCannedLine.php:64`); the other inspection subscriber, `LinkInspectionTemplatesOnCannedLineCreation`, fires when a canned line is created, not a work-order line, so it is not involved. `createdFromCannedLine = true`: no backend path dereferences a canned line through it, but the FE reads it: `WorkOrderLines.vue` blocks tech-view edits of lines awaiting authorization (`authorization_required`) when `created_from_canned_line` is set, so copied lines inherit that behavior, the same as canned lines appended at home. **Line note:** one internal line note (`Note::create(Type::WORK_ORDER_LINE, …, customerVisible: false)`), text from the pure `CopiedLineNote`: "Copied from {home}. Parts used there, for reference:" then `{qty} × {description} · {part number}` per part; fixed price at home: "Copied from {home}. Fixed price there, priced at {local}'s rate here"; no parts and not fixed: "Copied from {home}.". **Dedupe:** S17-R8 by `canned_line_id`, unchanged. **Link:** `path = lines` in both modes; no schema column (a copy is derivable from `link.workplace_id ≠ home`). **No canned lines:** a `no_lines` link (unchanged). One-workplace orgs never copy (S16-N9, by construction) |
| TD-33 | Certificate days (S8-R10, S8-R11, S8-E2; D26) | Columns `start_on DATE NOT NULL`, `end_on DATE NOT NULL`. `CertificatePeriod::from(term, ?start, ?end)`: End = `CalendarMath::addMonthsClamped(Start, term)`; Start = `subMonthsClamped(End, term)`; typed beats derived (both typed → both kept as typed, term as given); neither → 400. Literal reading of "Start plus the term gives End": 14 Oct 2025 + 12 months = 14 Oct 2026, valid through 14 Oct and overdue from 15 Oct; a missing day clamps to the month's last day in both directions (Q15 ✅ 2026-10-05). Wire dates `YYYY-MM-DD` |
| TD-34 | What counts as a work-order reading (S10-N6; replaces the former Q13 half of TD-14 and BR8) | A WO reading is recorded only when the value differs from the value the WO held before the write. `MileageChange` and `EngineHoursChange` gain an optional trailing `?int $previous` (backwards compatible: existing subscribers ignore it). The six raisers pass it. `Create/CreateCommandHandler` and `ServiceWorkOrderOpener` pass the **asset's current value**: the copy source, so a copied value is never a reading (S10-N6, last sentence). The Create handler has no vehicle dependency today, so it reads that value through a new WorkOrders port, `WorkOrders/Domain/Service/AssetMeterValues::current(Uuid $vehicleId): AssetMeterSnapshot` (`?int $mileage`, `?int $engineHours`), implemented by `WorkOrders/Infrastructure/Persistence/Query/Dbal/DbalAssetMeterValues` (one DBAL `SELECT mileage, engine_hours FROM vehicle WHERE id = :id`, organization-scoped through `OrganizationDecorator`; a null for a missing vehicle). It is called before the WO is built, so WO→asset propagation cannot overwrite the value first. The MR create-WO handler uses the same port (`$this->assetMeters`, P6 sketch). `ChangeMileage`, `ChangeEngineHours`, `ChangeRequiredData`, `Change` and `Line/UpdateLineData` read the WO's value **before** the setter. `RecordWorkOrderReadingOnMeterChangeSubscriber` skips the event when `previous !== null && value === previous`. A full-form WO save that re-sends an unchanged value therefore records nothing, even when no reading row exists yet. Why on the event: the subscriber cannot read the old value reliably, because WO↔asset propagation reorders the columns (NFR-006). The historical load (S10-R12) still loads every past WO value, as the PRD says, because history cannot tell copies apart. Accepted cost: a tech who types the same value as the copy records nothing |
| TD-35 | Settling a work order's readings (S10-R11, S18-R19, S12-E5; rewrites TD-06's promotion and NFR-022's demotion) | One idempotent service, `WorkOrderReadingSettler::settle(workOrderId)`, decides the state of the WO's reading rows (key `work_order:{wo}:{meter}`) from facts. **Recorded** when the WO has a live (not void, not reversed) invoice, or an effective `work_order`-path completion (Mark complete On this work order). `read_on` = the earliest of the invoice date and the effective Mark-complete Reset dates on that WO. Otherwise **in_shop**, `read_on` = the WO start date. The value is never touched: the row holds the last value entered on the WO (S10-N6). It never creates a row: a WO nobody read the meter on records nothing. Called from the invoice reset subscriber (before the resets, S12-E5), `InvoiceReversalReverter`, `MarkServiceCompleteCommandHandler` (path `work_order`, before the completion, so its anchors read the new reading), `UndoCompletionCommandHandler` (path `work_order`) and Plan 2's VOID reconciliation. It replaces `promoteForWorkOrder()` / `demoteForWorkOrder()`. Facts come through the `WorkOrderReadingContext` port (extended with `liveInvoiceOn`) and a new port `WorkOrderCompletionDates` (MeterReadings/Domain/Repository, implemented in Maintenance/Infrastructure), so MeterReadings never imports Maintenance. Audit old/new per changed row (S21-R4). The asset's own `mileage`/`engine_hours` columns are unchanged by A28 and A29. No schema change |
| TD-36 | The rest after completion (S13-R43, S18-R17; replaces the former Q12 rule in sketch 6) | Rows and tiles hide a row whose current cycle counts from any completion (`last_done_path IS NOT NULL`: `work_order`, `elsewhere`, `invoice`, `covered`, `enrolment`) until `today ≥ due_soon_from`. A last service date entered at enrolment (S7-E1 "Mark as done") rests a row like any completion, and a Needs readings row stays listed (S13-R43 and S13-R36 as revised; Q18 ✅ ANSWERED 918913025). `covered` rests because a covered service is reset by the same Mark complete or invoice (S18-R7; engineering assumption A1). Undo complete, an invoice reversal and the VOID reconciliation restore the previous `last_done_path`, so the row returns. The predicates live in one builder, `WorklistPredicates` (P7), which Plan 2's email items reuse (Plan 2 TD-37) |

### 3.3 Frontend technical decisions (FD)

| # | Decision | Choice | Reason |
|---|---|---|---|
| FD-1 | Server state | TanStack Query in `api/maintenance/queries.ts`. Lists use `useTableQuery`, details `useQuery`, writes `useMutation` | SV-6324: no new server state in Vuex (D8) |
| FD-2 | Cache coherence | One `invalidateMaintenanceForAsset(vehicleId, companyId?)` called by every write | The tab, worklist, tiles, Compliance section (and later the Plan 2 panel) must never disagree. A single helper is reviewable in one place |
| FD-3 | Status, confidence, "today", rounding, date precision | Rendered from BE fields only. FE derives no status | S12-R14 and S11-R12 are BE-owned (O-E3, O-E6). One source avoids FE/BE drift (NFR-F04) |
| FD-4 | Worklist tab mechanism | `?tab=maintenance` on `Customers`, one `usePageSearchUrlSync('customers')` in the shell | Shared search (S13-R32). No child-route collision with `customers/:id` |
| FD-5 | Existing Customers list | Moved verbatim into `CustomerListPanel.vue`; keeps Vuex, `useTable`, `subscribeToLocation` and every test id | Moving it is not a migration. Migrating it would widen blast radius with no requirement asking for it (FR1) |
| FD-6 | Asset tab bar | Extract `VehicleTabsBar.vue` first, as a separate commit, then add the 4th tab once | Otherwise the tab is added 3× and drifts (FR2) |
| FD-7 | Phone full-screen dialogs | Opt-in `fullscreenOnPhone` prop on both base dialogs (default `false`) that binds `:maximized="$q.screen.lt.sm"` | GR#9 forbids raw `q-dialog` form shells. 123 `BaseFormDialog` + 89 `BaseDialog` consumers stay untouched when the default is off (FR3) |
| FD-8 | Nested forms | `CertificateFields.vue` is a form body, not a dialog, and is embedded in the enrolment modal, Mark complete and the record dialog | Avoids dialog-in-dialog stacking on phone. Plan 2's invoicing step embeds the same body |
| FD-9 | Hover card | New `HoverCard.vue`, built from `reporting/shell/ReportInfoIcon.vue`'s trigger set with a `q-menu`/sheet body | `ScheduleBlock` deliberately refuses tap (13 consumers, left alone). Tap and focus are requirements (S4-R5 card, S13-R41, S11-R27) (FR4) |
| FD-10 | Action sheet on phone | `ResponsiveActionMenu` renders `q-dialog position="bottom"` + `q-list`, the precedent in `inspections/InspectionTemplateActionSheet.vue` | An action sheet is neither a form nor a confirmation (GR#9 scope). It follows the existing sanctioned idiom. The DVI sheet stays as it is |
| FD-11 | Paging | Server-side page + sort, `useTableQuery({ pagination: { pageSize: 50 } })`, infinite append (desktop virtual scroll, phone `q-infinite-scroll`). No numbered pager | Q6 ✅ 2026-10-05 (S13-R37). Matches the Customers and Work Orders lists (FR6) |
| FD-12 | Worklist filter persistence | `usePagePreferences('customers-maintenance-reminders')` + `useFilterUrlSync` (keys `mr_tiles`, `mr_compliance`, `mr_locations`; viewKey `search` stays with the shell) + sort in the same preference blob | S13-R42 mirrors Work Orders. The `mr_` prefix keeps the worklist keys disjoint from the customer list's |
| FD-13 | Schedule editor save model | Pure in-memory draft (`scheduleDraft.ts`), saved as one whole document (A3 `POST` / A4 `PUT maintenance/schedules`). An unsaved service gets `id = crypto.randomUUID()` at creation in the draft, and the BE keeps it as the service id | S1-R4/S1-R8: nothing is persisted before Save, and Cancel discards. Covered-service references between unsaved services point at those UUIDs, so no key remapping happens after save |
| FD-14 | Create work order | One BE call (A33 `POST maintenance/enrolled-services/{id}/work-orders` with `created_via: 'worklist' \| 'asset'`), then navigate | Settled (atomic command). No N-call orchestration from the browser (SV-8446 class) |
| FD-15 | Invoice row action | Navigates to `WorkOrder` › `finance` only. Never arms `composables/useInvoiceCreationIntent.ts` | Settled. Invoicing guards stay on the WO page (FR10) |
| FD-16 | Cross-location WO navigation | Open/Invoice push `?locationId={workplaceId}` so `useWorkOrderLocationResolver` offers the location switch | The worklist and the Mark complete picker are org-wide (E2). Without the param, `work-orders/view/{id}` returns 400 under another header location |
| FD-17 | Reading plausibility | FE pure `readingPlausibility.ts` evaluates "lower than last" and "above ceiling × days since last", using the ceilings from A21 `plausibility.mileageMaxPerDay` / `plausibility.hoursMaxPerDay` against `mileage.value` / `hours.value`. BE also flags on save (`lowerThanPrevious`, `implausible`) | S10-N2 needs the orange confirm **before** saving, and S10-N1 means nothing is rejected. The number is owned once (BE) and drives both the confirm and the S11-R19 guard (Q2 ✅ 2026-10-05) |
| FD-18 | Certificate attachment | `useFilePicker` with `accept="application/pdf,image/jpeg,image/png"`, a client size check ≤10 MB, upload on the record (multipart). Replace = upload over, Remove = DELETE | Replaces S8-R9's "reuse the DVI attachment component": DVI's component is photo-only, so this is an engineering decision. File types and size settled by Q5 ✅ 2026-10-05 (S8-R9). `useNoteAttachmentPicker` is bound to note mime types fetched from the server, and `PhotoField` is image-only |
| FD-19 | Set-contact from the contact card | New small `maintenance/worklist/SetPreferredContactDialog.vue` reusing `useSaveVehicleContactMutation` + `companyQueryOptions` | `components/customers/ts/PreferredContactDialog.vue` is driven by a Vuex dialog flag and reads `dialogState.info.id` through a cast. Reusing it from the worklist would mean faking Vuex state |
| FD-20 | Undo toasts | `showSuccessNotification({ message, undo: { handler } })` (`utils/helpers.ts:1035-1075`, test id `button_notification_undo`) | The existing app-wide Undo affordance. `schedule-next/UndoToastHost.vue` is calendar-specific |
| FD-21 | Vocabulary | `maintenance/shared/copy.ts` constants ("mileage", "hours", badge labels, toast templates) | S2-R10, S2-R15, S10-R9: the wording carries meaning (NFR-F09) |
| FD-22 | Location filter / column visibility | Driven by A32 `workplaceCount > 1`, with options from A32 `workplaces`. S1-R14 uses the same org workplace count, read from A1/A2/A9 | Q8 ✅ 2026-10-05 (by org workplace count, for every user of the org, S13-R9). `useMyWorkplaces` is per user and the reports' rule (selected > 1) differs (FR14) |
| FD-23 | Home location label (S1-R14) | `MaintenanceSchedulesModel.homeLabel(row, workplaceCount)` → "Lines from {name}" when `workplaceCount > 1`, else null. Rendered under the name on the list (desktop + mobile), in the editor header and on each enrolment schedule option. A new schedule shows the header workplace's name (from `useMyWorkplaces` + `locationService.getLocation()`) until its first Save | One rule, one helper. The count comes from A1/A2/A9, not from `useMyWorkplaces` (per user) and not from A32 (CV-gated) |
| FD-24 | Read-only canned lines (S4-R9) | `ServiceFormDialog` takes `canEditCannedLines` from A2 (true for an unsaved schedule). False → `CannedLinesStep` hides Add canned lines, remove and Move up/down, passes `disabled` to `useSortable`, and shows an (i) `HoverCard` "These lines belong to {home}. Only someone with access to {home} can change them." Every other step stays editable. `scheduleDraft.toPayload` sends `canned_lines` byte-identical to A2 for such services; the covered prefill stays on, read only for a non-home user (S2-R17, Q16 ✅) | BE authoritative (A4 refuses, TD-31); FE never computes access from `useMyWorkplaces` |
| FD-25 | Canned-line picker source (S4-R7) | A8 with `schedule_id` for a saved schedule; no param for an unsaved one. No location control in the picker. `subscribeToLocation` is **not** used in Settings any more (the list is org-wide; `LocationSelector` already clears the cache) | S4-R7 "whichever location is chosen in the header" |
| FD-26 | Certificate dates (S8-R10) | `DateInput` × 2 (Start, End) + term `Select`. `certificateDates.ts` derives the missing date for the preview only (typed wins). BE `CertificatePeriod` is authoritative and uses the same month arithmetic (S8-R10: same day number, clamped to the month's last day) | Days remove the "last day of month" guess (S8-R10); the PRD now fixes the arithmetic (S8-R10: same day number, clamped to the month's last day) |
| FD-27 | Gating without a flag (D27) | `useMaintenanceAccess` reads permissions through `usePermissions()` (reactive). No `organizationHasFeature`, no route guard. A surface renders when its permission holds and, where data decides, when the data says so (WO panel: A35 `organizationHasSchedules`, Plan 2) | Product Q4. The router's `requiredPermissions` / parent `requiredCheck` already cover every new route |
| FD-28 | Reminder default rows and the limit note (S5-R12, S5-R13) | `serviceFormRules.intervalDays(trigger)` = N (days) / **N × 30** (months) / 365 (yearly At), the BE conversion (Q17 ✅ 918913025). `beforeRowRule`: a before row must be `< intervalDays`. While the rows are the untouched defaults (`remindersTouched === false`), the 14-before default is present only when `intervalDays > 14` and follows interval changes; once the user edits a row nothing is added or removed automatically and the inline rule applies. When `intervalDays ≤ 14` a caption beneath the rows reads "A reminder before the due date must be shorter than the {n}-day interval" (`data-test-id="maintenance_reminder_interval_limit_note"`) | Mirrors the BE so the inline refusal and A3/A4 agree; the note is S5-R13's own UI element |
| FD-29 | No-email note and Add contact (S7-R20, Q11) | One rule per surface, "any contact of the customer has a non-empty (trimmed) email": customer card = `company.contacts.some((c) => !!c.email?.trim())` from A16 (already loaded); enrolment = A9 `customers[].hasEmail`; worklist contact card = A30 `customerHasEmail`. Setting on + no email → note "None of this customer's contacts has an email address, so no reminder can be sent." with `Button` "Add contact" (`canEditCustomerSide` only), which opens the existing `components/customers/ts/ContactDialog.vue` with `:company-id`. Its `loadCompany` emit → `invalidateMaintenanceForAsset(vehicleId, companyId)` (or `companyKeys.detail` + `maintenanceKeys.worklist()` on the customer card) | Reuses the app's contact form (same fields, validation, portal rules). `ContactDialog` dispatches the Vuex `customers/createCustomer`, which refetches that company into the Vuex `company` slot; on the worklist and asset pages nothing reads that slot for another company |

### 3.4 Risks and mitigations (BE)

| # | Risk | Likelihood / impact | Mitigation |
|---|---|---|---|
| BR1 | A missed or double capture path silently corrupts usable-pair counts (phantom or missing readings) | Medium / High | Capture only at entry points (TD-05); idempotency keys; `MeterWriteSurfaceTest`; one functional test per entry point and per copy path (P3) |
| BR2 | Invoice reset breaks invoicing | Low / Critical | Savepoint + DBAL only + catch-all + kill switch (TD-07); functional test with a forced failure proving the invoice still commits |
| BR3 | Extracting `ServiceWorkOrderOpener` / `CannedLineAppender` regresses WO creation or canned-line add | Medium / High | Characterization tests first (NFR-019); delegation only, no behavior change; re-run WO and invoice functional suites |
| BR4 | Wrapping five WO handlers in `Transactional` changes when their domain events see data | Medium / Medium | Characterization tests before wrapping; the subscribers they trigger already run inside `persist()` before flush, so ordering is unchanged; WO Create left untouched |
| BR5 | Projection drift (a trigger forgets to recompute) | Medium / Medium | One recomputer; event-driven triggers; nightly refresh and on-demand reconcile that logs drift counts (TD-22) |
| BR6 | Bulk enrolment of a very large fleet exceeds request time | Low / Medium | Cap 2,500 (NFR-009); fixed query count per 500-vehicle chunk; measured before merge on seeded data |
| BR7 | Worklist search `LIKE '%term%'` slow for the largest org | Medium / Low | Org predicate narrows via index first; measured on 200k rows (NFR-008); fallback is a prefix match on unit/VIN if p95 misses |
| BR8 | Phantom in-shop readings: WO create copies the asset's value into the WO, which raises `MileageChange` and records an in-shop reading with an old value that becomes `recorded` at invoicing, refreshing the confidence age | — | **Closed** (Q13 accepted, 2026-10-05): TD-34 stops copies being recorded (a WO reading counts only when entered or changed on that WO); TD-14 copies the asset value again. _Was:_ MR-created WOs carry no reading until Q13 is answered (TD-14, then pending Q13; an accepted Q13 removes the phantom and they copy the asset value again, as S13-R38 "as creating a work order does today" expects). For ordinary WOs this matches what Product measured confidence on (WO mileage per visit). Proposed new engineering follow-up (not a Product question): skip a WO reading equal to the asset's latest recorded value when the WO is created; measure the effect on the confidence distribution before deciding. Q13 (Section 0, posted 2026-10-02; formerly E3) proposes the alternative rule: record a WO reading only when the value was entered or changed on that WO |
| BR9 | Fleets that never invoice: their WO readings stay In the shop forever and never count (S10-R11, S11-R24) | — | **Closed** (Q9, 2026-10-05): Mark complete On a work order records the WO's readings at the Reset date (S18-R19, TD-35), so a fleet that never invoices keeps its readings current |
| BR10 | Doctrine schema tools trip on the existing expression index during the diff gate | Known / Low | Targeted introspection fallback (4.3 rule 5) |
| BR11 | `WorkOrderCreatedEvent` subscribers now run inside the MR create transaction; one with an external side effect (S3 snapshot) cannot be rolled back | Low / Low | Orphan object only; verified in the characterization test |
| BR12 | 24-month window slides without an input write | Certain / Low | `window_expires_on` + nightly refresh (needs the Terraform schedule applied per env; until applied, the reconcile command run manually). The Terraform schedule for `maintenance:projection:refresh` is applied only after the release deploy (the command does not exist before; BR18 rollout) |
| BR13 | WO split before Plan 2 leaves links on the original WO | Certain / Low | Documented limitation; Mark complete covers it; Plan 2 moves links in `SplitWorkOrderCommandHandler` |
| BR14 | Schedule name uniqueness relies on collation for case-insensitivity; SQLite tests compare case-sensitively | Low / Low | Domain check uses `ServiceName::normalize()`-style comparison in `nameTaken()`; the DB unique index is the backstop |
| BR15 | The reversal undo fails after the reversal committed, leaving services reset by a deleted invoice | Low / Medium | Catch-all + `maintenance.invoice_reversal_failed` with ids; replay command; functional test with a forced failure (TD-29) |
| BR16 | Copied pricing differs from the home location (labour type names diverge → default type) | Medium / Low | By design (S16-R22); each copied line's note says it was copied (S16-R23) |
| BR17 | Cross-workplace canned-line reads (GR-7) widen what a location sees | Low / Low | Names, hours and parts only, never prices; the home id is always server-sourced from an org-scoped MR row |
| BR18 | **Long-lived branch drift from develop** (D28). Plan 1 + Plan 2 span many weeks. `develop` keeps changing the WO handlers, invoicing, the WO list, `Invoice.vue`, `VehicleCard.vue` and `SendEmailDialog.vue`. Characterization tests written early go stale, and conflicts grow | High / High | Merge `develop` into the branch at least weekly and before each phase PR; never rebase or force-push the shared branch; one owner for syncs. After every sync re-run the characterization and functional suites of the shared files the branch modifies: the six WO handlers (P3 `Transactional` wrap), `Create/CreateCommandHandler` and `Line/CreateFromCannedLine/CreateCommandHandler` (P6 extraction), `UpdateLineData/ChangeCommandHandler` (TD-18), `Customer/Customers/Application/View/ViewQueryHandler.php`, `WorkOrders/Application/List/ListingQueryHandler.php`, `LinesDetailProvider`; FE: `Invoice.vue`, `VehicleCard.vue`, `SendEmailDialog.vue`, `Customers.vue`, `VehicleInvoices.vue`, `Customer.vue`, `routes.ts` (FR21). Expected conflict hotspots: `ExpressionIndexFilteringMySQLSchemaManager::MANUALLY_MANAGED_FOREIGN_KEYS`, `EntityEventType`, `config/services.yaml`, `config/packages/doctrine.yaml`, `Company.orm.xml`. Characterization tests are re-recorded when develop changes the pinned behavior (never silently updated to green); the final branch → develop PR is reviewed for sync conflicts, with phase diffs already reviewed |
| BR19 | **Migration ordering against develop's migrations** (D28). Branch migrations carry timestamps older than develop's latest when they merge; an order-dependent statement (same table, same index name, a hand FK on a table develop changes) fails only on some environments | Medium / High | 4.3 rule 8: name migrations at implementation time and **never re-timestamp an executed one** (the QA database will already have run it). Doctrine Migrations runs every unexecuted version in version order (`config/packages/doctrine_migrations.yaml` has default settings), so production applies them correctly even though their timestamps are older than develop's latest. Branch migrations touch only `maintenance_*` / `vehicle_meter_reading` tables and the single INSTANT `company.maintenance_notifications` column; if a develop migration also alters `company`, both are INSTANT; recheck the diff gate. After every sync: fresh database `doctrine:database:drop --force && doctrine:database:create && doctrine:migrations:migrate --no-interaction`, then `doctrine:migrations:diff --allow-empty-diff` → "No changes detected". Before the branch → develop PR, re-check that the `msch`/`menr`/… aliases and index names are still unused in develop |
| BR20 | **No per-organization rollback.** Without a flag, a defect reaches every shop and is removed only by a hotfix release | Medium / High | QA on the branch build; kill switch `MAINTENANCE_INVOICE_RESET_ENABLED` (invoicing path); NFR-021 (capture never blocks a WO edit); rollback table (Section 8) |
| BR21 | **Every-org runtime cost** on hot paths (WO page A35 and invoicing A38 in Plan 2, WO list A42′, customer view A16) | Medium / Medium | Plan 2 TD-41 budgets measured on the seeded 18k-asset org and on an org with no schedules; A16's `maintenance_enrolled_units_count` indexed (`menr__org_company_ended_idx`); numbers in the PR |
| BR22 | ~~Q7b open: S21-R6 vs asset hard delete~~ **Retired 2026-10-05.** Product chose Option A (reply 918913025): assets keep today's hard delete; S21-R6 now only forbids hard-deleting maintenance records, readings, certificates and audit entries, which Plan 1 already guarantees (NFR-002, soft ends) | — | None needed; no asset or customer soft delete is in scope |

### 3.5 Risks and mitigations (FE)

| # | Risk | Phase | Mitigation |
|---|---|---|---|
| FR1 | The Customers page is not tabbed. Its list is Vuex + `useTable` + `subscribeToLocation`, with mobile and desktop branches | P0, P7 | Verbatim move into `CustomerListPanel.vue` (separate commit), every existing element and id kept (Vitest + walk); every customers-view user sees the tabs once the branch is released. `keep-alive` panels so tab switches don't reset the list. The worklist does not subscribe to location. The Cypress `customer-list.cy.ts` and Playwright `customer.page.ts` must pass unchanged |
| FR2 | The asset tab bar is copied 3×, inside a Table `#top`, a `VehicleWorkOrdersTab` slot and a `GenericNotes` slot | P0, P5 | Extract `VehicleTabsBar.vue` first with byte-identical output (the same `q-route-tab` attributes and ids), run the existing `VehicleInvoices.spec.ts`, then add the 4th tab once. Mobile depends on `tabForRouteName` (route = truth), so the new route name is mapped there |
| FR3 | ~212 dialog consumers (123 `BaseFormDialog`, 89 `BaseDialog`) | P0 | Opt-in prop, default false. The bindings are no-ops unless the prop is set (`maximized` false, `cardStyle` kept). Default-render regression specs for both. Walk 2 unrelated dialogs on phone width |
| FR4 | Hover card on touch and keyboard. `q-tooltip` cannot do tap. Hover + click both fire on hybrid devices | P0 | `HoverCard` with explicit model + transition guard (`ReportInfoIcon` precedent), a leave grace period, and a phone sheet. `ScheduleBlock` untouched |
| FR5 | No app-wide Retry. The accounting component's copy names the accounting service | P0 | New `QueryState` copy. `AccountingQueryState` (~60 consumers) untouched |
| FR6 | Paging convention vs "50 rows" | P7 | `pageSize: 50` via `useTableQuery`, infinite append. `VIRTUAL_SCROLL_SETTINGS.sliceSize` stays 30 (render slice only). Q6 ✅ 2026-10-05 |
| FR7 | Multiple writers of `route.query` on `/customers` (shell `tab` + `search`, worklist `mr_*`) | P7 | Disjoint key sets. `useFilterUrlSync` and `usePageSearchUrlSync` both carry unrelated params through. The shell strips `mr_*` only on a tab change. Vitest covers search typed while tiles are active (no lost params) |
| FR8 | Prefs load → defaults flash → refetch (double fetch, wrong "0") | P7 | `enabled: prefsLoaded` on the rows query. Tiles render a skeleton until data arrives (NFR-F03) |
| FR9 | Cross-location navigation to a WO from the org-wide list or picker | P6, P7 | `?locationId=` on every push, so `useWorkOrderLocationResolver` handles the switch (FD-16). Covered in the walk |
| FR10 | The Invoice row action bypassing invoicing guards | P7 | Navigation only. A spec asserts the target route `finance` and that `useInvoiceCreationIntent` is never called. Hidden when the user lacks the `finance` route permissions (falls back to Open work order) |
| FR11 | Stale caches across surfaces (tab vs worklist vs tiles vs compliance section vs customer card count) | all | One invalidation helper (FD-2). A lint-free convention check in review: every `useMutation` in `api/maintenance/queries.ts` has an `onSuccess` calling it. Specs assert the call |
| FR12 | Bulk enrolment of a large fleet (hundreds of rows) in the modal | P2 | A12 returns one unpaged list (≤2,500) with `total`/`truncated`. Search is server-side, `q-virtual-scroll` renders the list, and a truncation caption shows when needed. Selections are kept by id across searches. Submit sends ids only (A13 ≤2,500) |
| FR13 | The Settings nav gate copied from DVI | P1 | Gate = settingsService only. Spec asserts it is visible with DigitalInspections off |
| FR14 | Location column/filter rule differs from reports | P7 | `workplaceCount` from A32 (FD-22, Q8 ✅). Options are all org workplaces (E2) |
| FR15 | `VehicleInvoices.vue` (1009 lines) and `Customer.vue` (875) are large shared screens | P0, P2, P5 | Additive mounts only (async components behind `v-if`). No refactors beyond the tab bar. Both already `<script lang="ts" setup>` (no touch-it-migrate). Touch-it-add-it audit via `e2e-precheck` on each touched file |
| FR16 | Test-id regressions from the moves | P0 | `e2e-precheck` + `/e2e-after-change` reference-breakage scan per phase. The ids listed in §7.4 are kept |
| FR17 | Readings recorded through existing inputs regress (BE capture retrofit) | P3 | FE walk of the WO mileage, engine hours and asset edit paths. The BE half owns the capture tests |
| FR18 | `useSortable` move: one Sortable per element trap (SV-8446) | P0, P1 | Re-export keeps the same instance semantics. The service table and the picker each own one element. Existing `useSortable.spec.ts` stays green |
| FR19 | Schedule list now org-wide: users see schedules built elsewhere and may expect to edit their lines | P1 | S4-R9 read-only state with (i) copy; A4 refuses; Vitest covers both states |
| FR20 | Certificate date shape change (months → days) ripples through CF, CS, EN, MC, DUE and the Plan 2 step | P2, P5, P6 | One `CertificateInput` type in `components/ts/maintenance/Model.ts`; `certificateDates.spec.ts` + `CertificateFields.spec.ts` are the contract; Plan 2 consumes them unchanged |
| FR21 | Branch drift (D28, BR18): the feature branch lives for both plans while develop moves. Shared files touched: `VehicleInvoices.vue` (DVI v2 adds the Inspections tab there too), `pages/Customers.vue`, `Customer.vue`, `CustomerLeftSection.vue`, `BaseDialog.vue`/`BaseFormDialog.vue`, `router/routes.ts`, `AdminLeftMenuNav.vue`, `pages/Administration.vue`, `api/index.ts`, `app/src/testing/handlers.ts`, `inspections/builder/*` (EditableTitle, useSortable) | P0–P7 | Merge develop into the branch at least weekly (merge, not rebase); after each merge run eslint, `vue-tsc`, `vitest related` and `e2e-precheck` on these files. Land P0's extractions (VehicleTabsBar, CustomerListPanel, EditableTitle, useSortable) early and as separate commits so conflicts stay mechanical. Coordinate the tab-bar order with DVI v2 (whichever lands on develop second adapts) |
| FR22 | Existing specs of shared screens now mount maintenance pieces (NFR-F13) | P0, P2, P5 | MSW defaults return empty payloads; async pieces render empty states; `Customers.spec.ts`, `VehicleInvoices.spec.ts`, `Customer.spec.ts`, `CustomerLeftSection` specs run unchanged |

## 4. Database Changes

### New tables / Modified tables

Eleven new tables and one new column. No ALTER on `work_order`, `work_order_line`, `vehicle`, `invoice` or
`vehicle_company` ("the work order does not change"). Every table: `binary_uuid` ids, `organization_id NOT NULL`,
utf8mb4/unicode_ci, InnoDB. Every ORM-written table is `AuditStampAware` (`created_at`, `updated_at` DATETIME NOT NULL
DEFAULT CURRENT_TIMESTAMP, `created_by`, `updated_by` BINARY(16) NULL, as in `Vehicle.orm.xml`). DBAL-written tables
carry the same four columns, filled by the repository (the `AuditStampListener` only sees ORM writes). The projection
is the one exception: a disposable read model with `computed_at` instead of stamps.

Index aliases (all checked unused in `src/` and `migrations/`): `msch`, `mschs`, `menr`, `menrs`, `mcrec`, `mcrecatt`,
`mcomp`, `mwos`, `mwosl`, `mdp`, `vmr`. Index names abbreviate column names to stay ≤64 characters (MySQL limit),
as `wo__workplace_type_status_tech_advisor_id_idx` already does.

#### 4.1 Tables

**`maintenance_schedule`** (P1). Mapping `Maintenance/Infrastructure/Persistence/Repository/Doctrine/MaintenanceSchedule.orm.xml`.
Intent: an organization's schedule, its canned lines at a home location (D23).

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| organization_id | BINARY(16) NOT NULL | the scope (GR-6) |
| home_workplace_id | BINARY(16) NOT NULL | D23: the header workplace at the first Save, never changed; a duplicate keeps it (S6-E5). Data, not scope |
| name | VARCHAR(120) NOT NULL | unique per organization across active **and archived** schedules (inspection-template precedent, `existsWithName()` has no status filter); collation is case-insensitive |
| status | VARCHAR(16) NOT NULL | `active` / `archived` |
| archived_at | DATETIME NULL | |
| audit stamps | | |

Indexes: `msch__org_name_unq (organization_id, name)` UNIQUE (S1-E2 org-wide); `msch__org_status_idx (organization_id, status)`.

**`maintenance_schedule_service`** (P1). Mapping `ScheduleService.orm.xml` (one-to-many from the schedule,
`orphan-removal`, cascade persist; FK declared by the association as in `Inspections/.../Template/Section.orm.xml`).

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | client-supplied for new services (TD-25) |
| schedule_id | BINARY(16) NOT NULL | ORM FK → `maintenance_schedule(id)` ON DELETE CASCADE (schedules are never deleted) |
| organization_id | BINARY(16) NOT NULL | |
| position | SMALLINT UNSIGNED NOT NULL | |
| name | VARCHAR(120) NOT NULL | |
| kind | VARCHAR(16) NOT NULL | `routine` / `compliance` |
| triggers | JSON NULL | routine only: `{calendar:{op,every?:{value,unit},at?:{day,month}}, mileage?:{op,value}, hours?:{op,value}}` |
| reminder_offsets | JSON NULL | routine only: `[{direction:before|on|after, days}]` ≤5 |
| compliance | JSON NULL | compliance only: `{type, termMonths, remindBeforeMonths}` |
| canned_lines | JSON NOT NULL | `[{cannedLineId, position, coveredFromServiceId|null}]` |
| covered_service_ids | JSON NOT NULL | sibling schedule-service ids |
| audit stamps | | |

Indexes: `mschs__schedule_id_position_idx (schedule_id, position)`.

**`maintenance_enrolment`** (P2). Mapping `Enrolment.orm.xml`. Intent: one asset on one schedule for one customer.

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| organization_id | BINARY(16) NOT NULL | |
| vehicle_id | BINARY(16) NOT NULL | no FK (NFR-002) |
| company_id | BINARY(16) NOT NULL | the enrolling customer (S7-R23), no FK |
| schedule_id | BINARY(16) NOT NULL | hand FK `maintenance_enrolment__schedule_id_fk` → `maintenance_schedule(id)` ON DELETE RESTRICT |
| home_workplace_id | BINARY(16) NOT NULL | the schedule's home, copied at enrol; drives the S13-R30 / S16-N6 copy decision |
| schedule_name | VARCHAR(120) NOT NULL | snapshot for history (schedule may be renamed) |
| enrolled_at | DATETIME NOT NULL | UTC |
| ended_at | DATETIME NULL | |
| end_reason | VARCHAR(32) NULL | `removed`, `schedule_archived`, `customer_unlinked`, `customer_deleted`, `merged` |
| ended_by | BINARY(16) NULL | |
| audit stamps | | |

Indexes: `menr__schedule_id_ended_at_idx (schedule_id, ended_at)` (FK backing + archive); `menr__org_vehicle_ended_idx (organization_id, vehicle_id, ended_at)`; `menr__org_company_ended_idx (organization_id, company_id, ended_at)` (S7-R19 count, customer delete).

**`maintenance_enrolled_service`** (P2). Mapping `EnrolledService.orm.xml` (one-to-many from `Enrolment`, ORM FK ON DELETE CASCADE).

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| enrolment_id | BINARY(16) NOT NULL | ORM FK |
| organization_id, vehicle_id | BINARY(16) NOT NULL | vehicle denormalised for batch reads |
| schedule_service_id | BINARY(16) NOT NULL | source, no FK |
| position | SMALLINT UNSIGNED NOT NULL | |
| name / normalized_name | VARCHAR(120) NOT NULL | TD-23 |
| kind, triggers, reminder_offsets, compliance, canned_lines | as on the schedule service | copied (S6-R1) |
| covered_enrolled_service_ids | JSON NOT NULL | re-pointed to sibling copies |
| initial_anchor_on | DATE NOT NULL | last service date or enrolment day (S7-R4, S7-E3) |
| initial_anchor_mileage, initial_anchor_hours | INT UNSIGNED NULL | latest recorded value on or before the anchor |
| skipped_at | DATETIME NULL | TD-27 |
| skipped_by | BINARY(16) NULL | |
| audit stamps | | |

Indexes: `menrs__enrolment_id_idx (enrolment_id)`; `menrs__org_vehicle_name_idx (organization_id, vehicle_id, normalized_name)`.

**`maintenance_compliance_record`** (P2). Mapping `ComplianceRecord.orm.xml`.

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| organization_id, vehicle_id | BINARY(16) NOT NULL | |
| service_name / normalized_service_name | VARCHAR(120) NOT NULL | carry-over key (S8-R12) |
| compliance_type | VARCHAR(120) NOT NULL | free text |
| term_months | SMALLINT UNSIGNED NOT NULL | 1–60 |
| start_on | DATE NOT NULL | typed, or End − term (S8-R10, TD-33) |
| end_on | DATE NOT NULL | valid through this day; the due date (S8-E2, S12-R4) |
| certificate_number | VARCHAR(64) NULL | |
| source_completion_id | BINARY(16) NULL | set when Mark complete created it (S18-R5) |
| voided_at, voided_by | DATETIME / BINARY(16) NULL | Undo complete voids the record it created |
| audit stamps | | |

Indexes: `mcrec__org_vehicle_name_end_idx (organization_id, vehicle_id, normalized_service_name, end_on)`.

**`maintenance_compliance_record_attachment`** (P2). Mapping `ComplianceRecordAttachment.orm.xml` (child, ORM FK CASCADE).
Columns: `id`, `record_id`, `organization_id`, `storage_path VARCHAR(512)`, `original_filename VARCHAR(255)`,
`mime_type VARCHAR(64)`, `size_bytes INT UNSIGNED`, `removed_at DATETIME NULL`, `removed_by BINARY(16) NULL`, audit
stamps. Index: `mcrecatt__record_id_removed_idx (record_id, removed_at)`.

**`maintenance_service_completion`** (P2: the enrolment "Mark as done" of S7-E1 writes the first ones; P6 adds
`reset_basis`, `undone_reason` and `mcomp__invoice_id_idx`, because P6 is the first phase that writes invoice completions). Mapping
`ServiceCompletion.orm.xml`; written by `DbalServiceCompletionRepository`.

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| organization_id, vehicle_id, enrolment_id | BINARY(16) NOT NULL | |
| enrolled_service_id | BINARY(16) NOT NULL | hand FK `maintenance_service_completion__enrolled_service_id_fk` → `maintenance_enrolled_service(id)` ON DELETE RESTRICT |
| service_name / normalized_service_name | VARCHAR(120) NOT NULL | prefill and history key (S6-E2, S7-R4) |
| reset_on | DATE NOT NULL | never after today (S18-R3) |
| path | VARCHAR(16) NOT NULL | `work_order`, `elsewhere`, `invoice`, `enrolment`, `covered` |
| work_order_id, invoice_id | BINARY(16) NULL | no FK |
| elsewhere_shop_name | VARCHAR(160) NULL | S18-R4 |
| anchor_mileage, anchor_hours | INT UNSIGNED NULL | meter values the next cycle counts from |
| reading_id | BINARY(16) NULL | reading written by "Completed elsewhere" |
| covered_by_completion_id | BINARY(16) NULL | S18-R7 |
| proposed | TINYINT(1) NOT NULL DEFAULT 0 | 1 = accepted by default at invoicing (Plan 2 seam) |
| undone_at, undone_by | DATETIME / BINARY(16) NULL | S18-R17 |
| reset_basis | VARCHAR(16) NULL | P6. `lines_closed` / `invoice_date` for `path = invoice` (set by `ResetDateProposal`); NULL for every other path. Plan 2 adds the values `user` and `carried` (no schema change) |
| undone_reason | VARCHAR(24) NULL | P6. `user` (A29 Undo complete), `invoice_reversed` (NFR-022). Plan 2 adds `corrected`, `unticked`, `invoice_voided` (no schema change) |
| audit stamps | | |

Indexes: `mcomp__enrolled_service_undone_reset_idx (enrolled_service_id, undone_at, reset_on)` (FK backing + cycle replay); `mcomp__org_vehicle_name_reset_idx (organization_id, vehicle_id, normalized_service_name, reset_on)` (prefill); `mcomp__work_order_id_idx (work_order_id)`; `mcomp__invoice_id_idx (invoice_id)` (P6, because the reversal reads completions by `invoice_id`; the table is empty at release, so the index costs nothing).

**`vehicle_meter_reading`** (P3, MeterReadings module). Mapping `MeterReadings/Infrastructure/Persistence/Repository/Doctrine/MeterReading.orm.xml`; written by `DbalMeterReadingRepository`.

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| organization_id, vehicle_id | BINARY(16) NOT NULL | org from the entry point's context, never from `vehicle.organization_id` |
| meter | VARCHAR(16) NOT NULL | `mileage` / `hours` (same values on the wire) |
| value | INT UNSIGNED NOT NULL | |
| read_on | DATE NOT NULL | day the reading is true for (local to the workplace); for WO rows: the WO start date while `in_shop`, else the earliest of the invoice date and the effective Mark-complete Reset dates on that WO (TD-35) |
| state | VARCHAR(16) NOT NULL | `in_shop` / `recorded` |
| source | VARCHAR(32) NOT NULL | `work_order`, `work_order_imported`, `asset`, `reading_dialog`, `customer_portal`, `import`, `api`, `completion_elsewhere` |
| source_ref_id | BINARY(16) NULL | work order / imported row / completion id |
| idempotency_key | VARCHAR(120) NOT NULL | see sketch 4 |
| lower_than_previous | TINYINT(1) NOT NULL DEFAULT 0 | S10-N3 |
| entered_at | DATETIME NOT NULL | UTC (S10-R4) |
| entered_by | BINARY(16) NULL | NULL for history load |
| removed_at, removed_by | DATETIME / BINARY(16) NULL | undo (S10-R7) |
| audit stamps | | |

Indexes: `vmr__org_idempotency_key_unq (organization_id, idempotency_key)` UNIQUE; `vmr__org_vehicle_meter_read_on_idx (organization_id, vehicle_id, meter, read_on)`; `vmr__source_ref_id_idx (source_ref_id)`.

**`maintenance_due_projection`** (P4). Mapping `DueProjection.orm.xml` (mapped read-model class
`Maintenance/Domain/Model/DueProjection.php`, never loaded through the EntityManager); written by `DbalDueProjectionWriter`.

| Column | Type | Notes |
|---|---|---|
| enrolled_service_id | BINARY(16) PK | hand FK `maintenance_due_projection__enrolled_service_id_fk` → `maintenance_enrolled_service(id)` ON DELETE CASCADE |
| organization_id, vehicle_id, company_id, enrolment_id, schedule_id | BINARY(16) NOT NULL | company from the enrolment, never `vehicle_company` |
| home_workplace_id | BINARY(16) NOT NULL | the schedule's home location (D23) |
| schedule_name, service_name | VARCHAR(120) NOT NULL | |
| kind | VARCHAR(16) NOT NULL | |
| due_on | DATE NULL | NULL only for compliance with no record |
| due_soon_from | DATE NULL | |
| winning_trigger | VARCHAR(16) NULL | `calendar`, `mileage`, `hours`, `certificate` |
| is_estimate | TINYINT(1) NOT NULL | |
| candidates | JSON NOT NULL | `[{trigger, dueOn, isEstimate, meter?}]`, winner first |
| watches_mileage, watches_hours | TINYINT(1) NOT NULL | |
| mileage_usable_pairs, hours_usable_pairs | SMALLINT UNSIGNED NOT NULL | |
| mileage_last_recorded_on, hours_last_recorded_on | DATE NULL | confidence age at read time |
| needs_reading | TINYINT(1) NOT NULL | watches a meter with 0 usable pairs (S13-R22) |
| has_record | TINYINT(1) NOT NULL | compliance |
| skipped_at | DATETIME NULL | |
| last_done_on | DATE NULL | |
| last_done_path | VARCHAR(16) NULL | path of the latest effective completion (`work_order`, `elsewhere`, `invoice`, `covered`, `enrolment`); NULL when the cycle counts from the initial anchor. Drives the worklist rest (TD-36): every path, `enrolment` included, rests a row until `due_soon_from`; Needs readings rows stay listed (Q18 ✅ 918913025) |
| last_completion_id | BINARY(16) NULL | undo availability |
| last_visit_workplace_id | BINARY(16) NULL | S13-R27 |
| last_reading_id | BINARY(16) NULL | S21-E2 |
| window_expires_on | DATE NULL | NFR-014 |
| computed_at | DATETIME NOT NULL | |

Indexes: `mdp__org_due_vehicle_idx (organization_id, due_on, vehicle_id)`; `mdp__org_vehicle_idx (organization_id, vehicle_id)`; `mdp__org_location_due_idx (organization_id, last_visit_workplace_id, due_on)`; `mdp__org_needs_reading_idx (organization_id, needs_reading, vehicle_id)`; `mdp__schedule_id_idx (schedule_id)`; `mdp__org_window_expires_idx (organization_id, window_expires_on)`; `mdp__enrolment_id_idx (enrolment_id)`.

**`maintenance_work_order_service`** (P6). Mapping `WorkOrderServiceLink.orm.xml`; written by `DbalWorkOrderServiceLinkRepository`.

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| organization_id, work_order_id, workplace_id, vehicle_id | BINARY(16) NOT NULL | WO workplace at link time; no FKs |
| enrolled_service_id | BINARY(16) NOT NULL | hand FK `maintenance_work_order_service__enrolled_service_id_fk` ON DELETE RESTRICT |
| path | VARCHAR(16) NOT NULL | `lines` (home or copied lines, TD-32), `no_lines` (service with no canned lines), `mark_complete` (Plan 2 panel) |
| created_via | VARCHAR(16) NOT NULL | `worklist`, `asset`; `wo_panel` reserved for Plan 2 |
| state | VARCHAR(16) NOT NULL | `open`, `reset`, `orphaned`, `declined`; `unticked` reserved for Plan 2; `removed` reserved, written by Plan 2 Q2 (S16-R25 Undo/Remove). Every predicate over `state` is a positive list, so no future state leaks in |
| reset_completion_id | BINARY(16) NULL | |
| audit stamps | | |

Indexes: `mwos__work_order_id_state_idx (work_order_id, state)`; `mwos__enrolled_service_created_idx (enrolled_service_id, created_at)` (FK backing + latest link).

**`maintenance_work_order_service_line`** (P6). Mapping `WorkOrderServiceLinkLine.orm.xml`.
Columns: `id`, `link_id` (hand FK `maintenance_work_order_service_line__link_id_fk` → `maintenance_work_order_service(id)` ON DELETE CASCADE), `organization_id`, `work_order_line_id` (no FK, S16-N4), `canned_line_id`, `created_at`, `created_by`. Indexes: `mwosl__link_id_idx (link_id)`; `mwosl__work_order_line_id_idx (work_order_line_id)`.

**`company.maintenance_notifications`** (P2). Mapping `Customer/Customers/Infrastructure/Doctrine/Company.orm.xml`, field
`maintenanceNotifications` type boolean, option default `1`, appended after `taxExemptFederal`.

#### 4.2 Illustrative DDL (the implementer hand-writes the migrations from this)

```sql
CREATE TABLE maintenance_due_projection (
    enrolled_service_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    organization_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    vehicle_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    company_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    enrolment_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    schedule_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    home_workplace_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    schedule_name VARCHAR(120) NOT NULL,
    service_name VARCHAR(120) NOT NULL,
    kind VARCHAR(16) NOT NULL,
    due_on DATE DEFAULT NULL,
    due_soon_from DATE DEFAULT NULL,
    winning_trigger VARCHAR(16) DEFAULT NULL,
    is_estimate TINYINT(1) NOT NULL,
    candidates JSON NOT NULL,
    watches_mileage TINYINT(1) NOT NULL,
    watches_hours TINYINT(1) NOT NULL,
    mileage_usable_pairs SMALLINT UNSIGNED NOT NULL,
    mileage_last_recorded_on DATE DEFAULT NULL,
    hours_usable_pairs SMALLINT UNSIGNED NOT NULL,
    hours_last_recorded_on DATE DEFAULT NULL,
    needs_reading TINYINT(1) NOT NULL,
    has_record TINYINT(1) NOT NULL,
    skipped_at DATETIME DEFAULT NULL,
    last_done_on DATE DEFAULT NULL,
    last_done_path VARCHAR(16) DEFAULT NULL,
    last_completion_id BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    last_visit_workplace_id BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    last_reading_id BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    window_expires_on DATE DEFAULT NULL,
    computed_at DATETIME NOT NULL,
    INDEX mdp__org_due_vehicle_idx (organization_id, due_on, vehicle_id),
    INDEX mdp__org_vehicle_idx (organization_id, vehicle_id),
    INDEX mdp__org_location_due_idx (organization_id, last_visit_workplace_id, due_on),
    INDEX mdp__org_needs_reading_idx (organization_id, needs_reading, vehicle_id),
    INDEX mdp__schedule_id_idx (schedule_id),
    INDEX mdp__org_window_expires_idx (organization_id, window_expires_on),
    INDEX mdp__enrolment_id_idx (enrolment_id),
    PRIMARY KEY (enrolled_service_id),
    CONSTRAINT maintenance_due_projection__enrolled_service_id_fk FOREIGN KEY (enrolled_service_id)
        REFERENCES maintenance_enrolled_service (id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;

CREATE TABLE vehicle_meter_reading (
    id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    organization_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    vehicle_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    meter VARCHAR(16) NOT NULL,
    value INT UNSIGNED NOT NULL,
    read_on DATE NOT NULL,
    state VARCHAR(16) NOT NULL,
    source VARCHAR(32) NOT NULL,
    source_ref_id BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    idempotency_key VARCHAR(120) NOT NULL,
    lower_than_previous TINYINT(1) NOT NULL DEFAULT 0,
    entered_at DATETIME NOT NULL,
    entered_by BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    removed_at DATETIME DEFAULT NULL,
    removed_by BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    updated_by BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    UNIQUE INDEX vmr__org_idempotency_key_unq (organization_id, idempotency_key),
    INDEX vmr__org_vehicle_meter_read_on_idx (organization_id, vehicle_id, meter, read_on),
    INDEX vmr__source_ref_id_idx (source_ref_id),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;

ALTER TABLE company ADD COLUMN maintenance_notifications TINYINT(1) NOT NULL DEFAULT 1, ALGORITHM=INSTANT;

-- P6 (NFR-022, TD-29), in the migration that creates maintenance_work_order_service
ALTER TABLE maintenance_service_completion
    ADD COLUMN reset_basis VARCHAR(16) DEFAULT NULL,
    ADD COLUMN undone_reason VARCHAR(24) DEFAULT NULL,
    ALGORITHM=INSTANT;
CREATE INDEX mcomp__invoice_id_idx ON maintenance_service_completion (invoice_id) ALGORITHM=INPLACE LOCK=NONE;
```

P6 completion columns: map both as nullable `string` fields, and the index, in
`Maintenance/Infrastructure/Persistence/Repository/Doctrine/ServiceCompletion.orm.xml` (P2 file) in the same PR, so
`doctrine:migrations:diff --allow-empty-diff` stays "No changes detected". The `CREATE INDEX` uses the space-separated
suffix (`MigrationOnlineDdlSyntaxTest`). If P2's migration is not merged yet when this lands, the columns and index may go
into P2's `CREATE TABLE` instead; either way one migration, not a separate one.

The remaining tables follow the same shape from 4.1. Hand FKs are created inside the `CREATE TABLE`.

#### 4.3 Migration rules (apply to every phase's migration)

1. One hand-written migration per phase that adds schema (P1, P2, P3, P4, P6), named `VersionYYYYMMDDHHMMSS` at
   implementation time, with `getDescription()` and a `down()` that drops what `up()` created (never run in prod).
   P6's migration also adds `maintenance_service_completion.reset_basis`, `undone_reason` and `mcomp__invoice_id_idx`
   (NFR-022).
2. Every index and unique constraint in the migration is declared in the XML mapping with the same name, and vice
   versa. Association FKs follow the Inspections precedent (`Version20260602120002` + `Section.orm.xml`).
3. Hand FKs on plain-id columns: add each name to
   `api/src/Shared/Infrastructure/Doctrine/Schema/ExpressionIndexFilteringMySQLSchemaManager.php`
   `MANUALLY_MANAGED_FOREIGN_KEYS` and declare its backing index in the mapping:
   `maintenance_enrolment__schedule_id_fk` (backed by `menr__schedule_id_ended_at_idx`),
   `maintenance_service_completion__enrolled_service_id_fk` (`mcomp__enrolled_service_undone_reset_idx`),
   `maintenance_due_projection__enrolled_service_id_fk` (primary key),
   `maintenance_work_order_service__enrolled_service_id_fk` (`mwos__enrolled_service_created_idx`),
   `maintenance_work_order_service_line__link_id_fk` (`mwosl__link_id_idx`).
   The P6 completion columns and `mcomp__invoice_id_idx` add no hand FK and nothing for `MANUALLY_MANAGED_FOREIGN_KEYS`.
4. `company` gets its column with `ALTER TABLE … ADD COLUMN …, ALGORITHM=INSTANT` (comma form is correct for
   `ALTER TABLE`; `MigrationOnlineDdlSyntaxTest` only forbids it on `CREATE INDEX`).
5. Gate after migrating locally: `bin/console doctrine:migrations:migrate --no-interaction`, then
   `bin/console doctrine:migrations:diff --allow-empty-diff` must say "No changes detected". The DBAL schema tools are
   known to trip on the existing expression index; if the diff command errors for that reason, verify the new tables
   by targeted introspection (`SHOW CREATE TABLE`) against the mapping and record it in the PR.
6. No feature flag exists (D27); nothing is seeded in a migration or created in the admin tool.
7. The new mapping dirs are registered in `config/packages/doctrine.yaml` in the phase that creates the first entity
   of each module (P1 Maintenance, P3 MeterReadings); an empty mapping dir breaks the container.
8. Branch migrations (D28, BR19): never re-timestamp an executed migration (the QA database will already have run it);
   after every `develop` sync, migrate a fresh database and run the diff gate (rule 5); branch migrations touch only
   `maintenance_*` / `vehicle_meter_reading` tables and the INSTANT `company.maintenance_notifications` column; before the
   branch → develop PR, re-check that the aliases and index names are still unused in develop.

### Data migrations (4.4)

| What | How | Batching and safety |
|---|---|---|
| Customer setting default (S7-R17) | Column `DEFAULT 1` fills every existing row during the INSTANT add; no backfill statement | Instant metadata change, no table copy |
| Historical reading load (S11-R3, NFR-007, NFR-011) | `bin/console meter-readings:load-history --organization=<uuid>|--all --cutoff=<ISO-8601 UTC> [--dry-run]` (MeterReadings/UI/CLI). For each org inside `OrganizationDecorator::runAs()`: (a) `work_order` rows of type service with `vehicle_id` NOT NULL and `mileage > 0` or `engine_hours > 0`, created before the cutoff, INNER JOIN `vehicle` (deleted assets skipped), LEFT JOIN `invoice` on `inv__work_order_id_idx`: invoiced → `recorded`, `read_on` = `invoice.created_on` as a date in the WO workplace's timezone; not invoiced and not declined → `in_shop`, `read_on` = `start_date`; key `work_order:{woId}:{meter}`. (b) `work_order_imported` with `vehicle_id` NOT NULL and `vehicle_mileage`/`vehicle_hours > 0`: `recorded`, `read_on` = `invoice_date`, key `work_order_imported:{id}:{meter}`. Then `lower_than_previous` is set per vehicle and meter in one ordered pass. One mapping rule unchanged: history loads every past WO value (S10-R12), copies included, because history cannot tell copies apart; live capture follows S10-N6 (TD-34) | Keyset pagination on `id` per source, 1,000 source rows per batch; existing keys fetched in one `IN` query per batch and skipped, so a rerun and the overlap with live capture are both no-ops. One transaction per batch. Progress line per batch; `--organization` lets ops resume one org. Mapping logic lives in `HistoricalReadingMapper` (unit-tested); the command is thin and untested by rule |
| Order | Capture goes live in production with the deploy of the release that carries the merged feature branch (D28). Run the load once right after that deploy with `--cutoff` = the deploy start (UTC); idempotency covers the overlap; record the per-org counts. Also run it on the QA environment after each branch-build deploy, on staging after the develop deploy, and on staging again after every staging refresh from production until the release (the clone carries an empty readings table). Volume ≈197,841 + 143,093 source rows (≈341k readings). Tenant enumeration is the per-tenant-loop exemption (GR-4) | |
| Revision 2026-10-04 (D23–D26) | None. Nothing is built yet: the plans are edited before P1 starts, so the renamed columns (`home_workplace_id`), the certificate days (`start_on`, `end_on`) and the dropped `backlog_suppressed` go straight into the first migrations | — |
| Projection | None at release: no organization has enrolments until users enrol after the release. `maintenance:projection:reconcile --organization=<uuid>` exists for repair and is safe to run any time | Chunks of 500 vehicles |

## 5. API Changes

The backend owns this contract. Every other part of this plan follows it; if anything disagrees, the contract wins.
Every path is relative to `/api/` (the FE `$axios` base).

### New endpoints

#### 5.1 Wire rules (apply to every row)

1. **Responses use camelCase keys.** That is how `DefaultSerializer` (`GetSetMethodNormalizer`, no name converter) and
   `api-standards.md` emit them, and the Inspections DTOs the FE already consumes look the same
   (`row.latestActiveVersion`). The one exception is A16: `customers/view/{id}` is a legacy array endpoint, so it keeps
   snake_case there.
2. **Request bodies and query params may use snake_case.** `RequestPayloadValueResolver` looks up the camelCase name
   first and the snake_case name second, so either form works. The bodies below are written in snake_case, which is
   what the FE already sends.
3. **Lists** return `{"data": {"collection": [...], "pagination": {sortBy, descending, page, rowsPerPage, total}}}`.
   That matches the FE's `ResponseDataCollection<T>`.
4. **Error statuses** follow `Shared/Infrastructure/EventSubscriber/ApiErrorHandler.php`:
   - 400: request validation (field-bound `errors[]`) and plain `DomainError`.
   - 403: missing atom.
   - 404: `ResourceNotFoundError`, which includes ids that belong to another tenant.
   - 409: errors that extend `ConflictError` (state conflicts).
   - 422 is not used.
5. **Meter values** are `mileage` and `hours`, everywhere: wire, enum and database column.
6. **Dates** are `YYYY-MM-DD` (certificates included), and datetimes are ISO 8601 UTC.
7. **`DueDto`** (used by A24, A25, A30) is `{date, precision: 'day'|'month', basis: 'calendar'|'mileage'|'hours'|'certificate', confidence: 'high'|'medium'|'low'|null, needsReadings: ('mileage'|'hours')[], noRecord}`.
   - The backend decides `precision`: `month` for meter estimates only; `day` otherwise (certificates included: `date` = the End date).
   - `needsReadings` is a list (counter to the FE's single `needs_reading`), because one service can watch both meters
     and need both.
8. **Gates.** Every maintenance route runs a `MaintenanceAccessGate` guard first; it checks the atom (no feature flag, D27).
   - SV = `ROLE_WORK_ORDER::VIEW` (schedule reads; deliberately not Settings Service, because the data is non-sensitive organization configuration (names, intervals, canned-line names and hours, no prices). Enrolment does not depend on it: it reads schedules through A9, which is on `ROLE_CUSTOMER::CREATE_AND_EDIT`. The API read is therefore wider than the PRD's "Settings tabs behind Settings Service"; tightening A1/A2/A8 to `ROLE_ORGANIZATION::CREATE_AND_EDIT` is a one-line gate change if review prefers it. Settings Service gates the Settings UI and every schedule write through SM)
   - SM = `ROLE_ORGANIZATION::CREATE_AND_EDIT` (settings writes)
   - CV = `ROLE_CUSTOMER::VIEW`
   - CE = `ROLE_CUSTOMER::CREATE_AND_EDIT`
   - WC = `ROLE_WORK_ORDER::CREATE_AND_EDIT`

#### 5.2 Endpoints (the reconciled contract)

| FE id | Method + path | Request | Response fields | Auth / gate | Phase | Status |
|---|---|---|---|---|---|---|
| A1 | GET `maintenance/schedules` | `status=active\|archived`, `search`, `sortBy=name\|servicesCount\|enrolledAssetsCount`, `descending`, `page`, `rowsPerPage` (≤100) | `collection[]: {id, name, status, servicesCount, enrolledAssetsCount, archivedAt, homeWorkplace: {id, name}}`, `pagination`, `counts: {active, archived}` (org-wide); top-level `workplaceCount: int` (org active workplaces, S1-R14). **Organization-wide (GR-6)**, not the header workplace | SV | P1 | matched (BE field `enrolledCount` renamed to the FE's `enrolledAssetsCount`) · **changed 2026-10-04** |
| A2 | GET `maintenance/schedules/{id}` | — | `{id, name, status, homeWorkplace: {id, name}, workplaceCount, canEditCannedLines: bool, readOnly, services[]: {id, position, name, kind, triggers: TriggerDto, reminderOffsets[]: {direction: before\|on\|after, days}, compliance: {type, termMonths, remindBeforeMonths}\|null, coveredServiceIds[], coveredServiceNames[], cannedLines[]: {cannedLineId, name, hours, position, coveredFromServiceId}, lineCount, coveredLineCount, hours}}`. `TriggerDto = {calendar: {op: every\|at, value?, unit?: days\|months, day?, month?}, mileage?: {op, value}, hours?: {op, value}}`. Deleted canned lines are omitted (S4-E2). Readable from any workplace of the org (GR-6); resolved canned lines read from the home workplace (GR-7). `canEditCannedLines` = the user has access to the home workplace (S4-R9, TD-31; BE-authoritative, the FE never derives it) | SV | P1 | matched (+ `homeWorkplace`, `workplaceCount`, `canEditCannedLines`, `readOnly`) · **changed 2026-10-04** |
| A3 | POST `maintenance/schedules` | `{name, services[]: {id, name, kind, triggers?, reminder_offsets?, compliance?, covered_service_ids[], canned_lines[]: {canned_line_id, covered_from_service_id?}}}`, array order = position | 201 `{id}`. Duplicate name → **400** with `errors[{field: "name", message: "A schedule with this name already exists."}]` (request validator `UniqueScheduleName`). Concurrent duplicate → 409 backstop. Home location = the verified header workplace (`VerifiedWorkplaceIdResolver`); the user must have access to it (403); `canned_line_id`s checked against it. Name uniqueness is org-wide (S1-E2) | SM | P1 | matched. **(a) agreed:** one whole document; the client keys for unsaved services are the FE's `crypto.randomUUID()`. The backend keeps each key as that service's id, validates it with `Assert\Uuid`, and rejects one that already exists. `covered_service_ids` may reference sibling keys in the same document |
| A4 | PUT `maintenance/schedules/{id}` | Same as A3. Services that exist keep their id; a service missing from the body is removed (S6-R11) | 200 `{id}`; 400 same as A3; 409 archived (read-only); **403 `CannedLinesLockedError`** when a user without access to the home location changes a service's canned lines (S4-R9, TD-31). Allowed from any workplace; `canned_line_id`s checked against the stored home | SM | P1 | matched (rule added 2026-10-04) |
| A5 | POST `maintenance/schedules/{id}/duplicate` | — | 201 `{id, name}`. The copy keeps the original's home location and canned lines, whatever the header (S6-E5); name unique in the organization | SM | P1 | matched (rule added 2026-10-04) |
| A6 | POST `maintenance/schedules/{id}/archive` | — | 200 `{unenrolledCount}` (0 until P2) | SM | P1 (unenrol P2) | matched |
| A7 | POST `maintenance/schedules/{id}/restore` | — | 204; 409 if the schedule is not archived. No name check: archived names stay reserved (`msch__org_name_unq` covers archived rows, as inspection templates do), so a restore can never collide | SM | P1 | matched (BE changed 200 → 204; the name-taken 409 dropped) |
| A8 | GET `maintenance/canned-lines` | `search`, `page`, `rowsPerPage` (≤100), **`schedule_id` (optional; organization-checked)** | `collection[]: {id, name, description, hours}`, `pagination`; the lines of that schedule's **home** workplace (S4-R7, GR-7), else the header workplace (unsaved schedule); no price. No location param (S4-R7). 403 with `schedule_id` when the user has no access to the home location (S4-R9) | SV | P1 | new-from-FE (replaces BE `canned-line-options`) · **changed 2026-10-04** |
| A9 | GET `vehicles/{vehicleId}/maintenance/enrolment-context` | `company_id` (optional), `customer_search` (optional) | `customers[]: {companyId, name, maintenanceNotifications, hasEmail}` (at most 50 linked customers; `hasEmail` = at least one contact of that customer has a non-empty email, S7-R20; no longer the asset's preferred contact), `customersTotal`, `customersTruncated`; `schedules[]: {id, name, servicesCount, alreadyOn, homeWorkplaceName}` (**every active schedule of the organization**, GR-6, S7-R1; `alreadyOn` is for `company_id`, or for the only customer when there is one); top-level `workplaceCount`; `hasAnySchedule`; `canManageSchedules` | CE | P2 | new-from-FE (replaces BE `enrolment-customers` and the schedule-less preview). **Counter:** the customer list is capped at 50 and searchable through `customer_search`, because placeholder assets carry up to 1,486 customer links · **changed 2026-10-04** · **changed 2026-10-05** (`hasEmail` rule, Q11) |
| A10 | GET `maintenance/schedules/{scheduleId}/enrolment-preview` | `vehicle_id`, `company_id` (both required) | `services[]: {scheduleServiceId, name, kind, lastDonePrefill, needsMileageReading, needsHoursReading, meterAtPassed: {meter, atValue, currentValue}\|null, complianceRecord: {id, certificateNumber, endDate: YYYY-MM-DD}\|null}`. The two needs-reading flags are `false` until P4 | CE | P2 (flags P4) | new-from-FE (replaces BE `vehicles/{id}/enrolment-preview?scheduleId`) · **changed 2026-10-04** |
| A11 | POST `maintenance/enrolments` | `{vehicle_id, company_id, schedule_id, services[]: {schedule_service_id, last_done_on\|null, meter_at_passed_action: done\|leave_due\|null}}` | 201 `{enrolmentId}`; 400 future date / unknown service; 409 archived, already enrolled. A schedule from another location is accepted (S7-R1, GR-6) | CE | P2 | matched (BE adopts the FE body names; the other-location 409 removed 2026-10-04) |
| A12 | GET `maintenance/schedules/{scheduleId}/bulk-enrolment-preview` | `company_id` (required), `search` (type, make, unit, VIN) | `assets[]: {vehicleId, unitNumber, year, make, model, vehicleType, vin, alreadyOn, hasHistory}` sorted by unit, not paged, at most 2,500; `total`, `truncated`, `withHistoryCount` | CE | P2 | new-from-FE path. **Counter:** a capped, unpaged list (so Select all is real) plus server search, `total`, `truncated` and `withHistoryCount` (S7-R26) |
| A13 | POST `maintenance/enrolments/bulk` | `{company_id, schedule_id, vehicle_ids[]}` (≤2,500) | 201 `{enrolledCount, withHistoryCount, skippedAlreadyOn[]}`; 404 for the whole request if any vehicle is foreign or unlinked; 400 if empty or over 2,500 | CE | P2 | matched (+ two fields) |
| A14 | DELETE `maintenance/enrolments/{id}` | — | 204. A soft end (`ended_at`, reason `removed`); nothing is hard-deleted. 409 if already ended | CE | P2 | renamed (BE `POST …/remove` → the FE's DELETE, documented as a soft end) |
| A15 | PATCH `customers/{companyId}/maintenance-notifications` | `{enabled: bool}` | `{maintenanceNotifications, affectedUnitsCount}` (`unitsWithoutEmailCount` dropped, Q11) | `ROLE_CUSTOMER::CREATE_AND_EDIT` | P2 | renamed. **Counter:** PATCH instead of POST, because this is a partial update (`api-standards.md`); the response fields are the FE's in camelCase · **changed 2026-10-05** |
| A16 | GET `customers/view/{companyId}` (existing) | — | Existing snake_case array plus `maintenance_notifications` (bool), `maintenance_enrolled_units_count` (int, distinct vehicles in active enrolments for this company). `maintenance_units_without_email_count` is **removed, with no replacement**: the FE derives has-email from the `contacts[].email` A16 already returns (trimmed, non-empty), the same rule as A9 `hasEmail` and A30 `customerHasEmail` (Q11; reconciled with FE 2026-10-05) | existing (`customers_view`) | P2 | matched. **(d) agreed.** **changed 2026-10-05**. It replaces the BE's separate GET `maintenance-notifications`, which is dropped |
| A17 | GET `vehicles/{vehicleId}/compliance-records` | — | `[{serviceName, current: Record, history: Record[]}]`. `Record = {id, complianceType, termMonths, startDate: YYYY-MM-DD, endDate: YYYY-MM-DD, certificateNumber, attachment: {id, fileName, mimeType, size, url}\|null}`. `startDate` is always present (typed, or End − term); the FE may type it nullable but never needs to handle null. Current = latest `endDate`. `url` is the authorized A20 GET path, never a public link | CV | P2 | new-from-FE path (BE was `maintenance/vehicles/{id}/…`) · **changed 2026-10-04** |
| A18 | POST `vehicles/{vehicleId}/compliance-records` | `{service_name, compliance_type, term_months, start_date\|null, end_date\|null, certificate_number\|null}` | 201 Record; 400 when neither date is given, or the term is out of range (`CertificatePeriod`, TD-33) | CE | P2 | new-from-FE path · **changed 2026-10-04** |
| A19 | PUT `maintenance/compliance-records/{id}` | Same as A18 without `service_name` | 200 Record; 400 as A18; 409 if it is not the current record | CE | P2 | matched · **changed 2026-10-04** |
| A20 | POST / DELETE / GET `maintenance/compliance-records/{id}/attachment` | POST: multipart `file` | POST 201 `{attachment}`; DELETE 204 (soft); GET streams the file. 400 for a wrong mime type or a file over 10 MB (Q5 ✅) | POST/DELETE CE, GET CV | P2 | matched (+ GET download, which `attachment.url` points at) |
| A21 | GET `vehicles/{vehicleId}/meter-readings/current` | — | `{mileage: Reading\|null, hours: Reading\|null, plausibility: {mileageMaxPerDay: 1500, hoursMaxPerDay: 24}}`. `Reading = {readingId, value, readAt, source, state: recorded\|in_shop, enteredByName}` (the latest live reading of that meter) | CV | P3 | matched. **(b) agreed:** the ceiling comes from `RateCeiling` (Q2 ✅), the same constant the estimator uses. The BE's separate `meter-readings/plausibility` endpoint is dropped |
| A22 | POST `vehicles/{vehicleId}/meter-readings` | `{mileage?: int≥0, hours?: int≥0}`, at least one | 201 `{readings[]: {id, meter, value, lowerThanPrevious, implausible}}`. A value is never rejected (S10-N1) | CE | P3 | matched (BE body key `engineHours` → `hours`) |
| A23 | DELETE `vehicles/{vehicleId}/meter-readings/{readingId}` | — | 204 (soft removal; the vehicle column reverts). 409 unless the reading is the meter's latest live reading and was entered through the dialog by this user | CE | P3 | renamed (BE `POST …/undo` → DELETE) |
| A24 | GET `vehicles/{vehicleId}/maintenance` | (`companyId` is rejected: the tab shows every enrolment of the asset) | `{isEnrolled, hasComplianceRecords, readings: {mileage: ReadingCardDto, hours: ReadingCardDto}, services[]: ServiceRowDto, enrolments[]: {id, scheduleId, scheduleName, companyId, companyName}}`. `ReadingCardDto = {recorded: {value, readAt, source, state}\|null, estimate: {value (rounded to 100/10), ratePerWeek, visitsCount, confidence}\|null}`. `ServiceRowDto = {enrolledServiceId, enrolmentId, scheduleId, scheduleName, showScheduleChip, name, kind, triggers, due: DueDto, status: due_soon\|due_today\|overdue\|null, skipped, completed: {completionId, resetOn, undoable}\|null, lastDone: {date, kind: completion\|elsewhere\|invoice\|entered_at_enrolment}\|null, currentRecordId}`. `completed` is set only when the latest effective completion is a Mark complete (`work_order`/`elsewhere`); invoice, covered and enrolment completions show only through `lastDone`, so `undoable` is never true for them (S18-N8) | CV | P5 | new-from-FE path (BE was `maintenance/vehicles/{id}`); `companyId` param rejected · **changed 2026-10-05** |
| A25 | GET `maintenance/enrolled-services/{id}/candidates` | — | `collection[]: {trigger, date, precision, confidence, isWinner}`, never filtered (S12-N2) | CV | P5 | matched |
| A26 | POST / DELETE `maintenance/enrolled-services/{id}/skip` | — | 204; 409 if already in that state | CE | P5 | renamed (BE `…/unskip` → DELETE `…/skip`) |
| A27 | GET `maintenance/enrolled-services/{enrolledServiceId}/completion-work-orders` | `search` (number), `page` (20 per page) | `collection[]: {id, number, displayNumber, workplaceId, workplaceName, createdOn (= work_order.start_date), status, invoicedOn\|null, linesClosedOn\|null, defaultResetOn}`; work orders from every workplace of the org (GR-2) | CE | P6 | renamed. **Counter to the FE path** `vehicles/{id}/maintenance/work-orders`: `linesClosedOn` belongs to the service (its own lines), so the route needs the enrolled service. **(c) agreed** on `linesClosedOn` / `invoicedOn` |
| A28 | POST `maintenance/enrolled-services/{id}/completions` | `{path: work_order\|elsewhere, work_order_id\|null, shop_name\|null, reading: {meter, value}\|null, reset_on, certificate: {certificate_number?, start_date?, end_date?, term_months}\|null}`. Both dates absent → Start = `reset_on`, End = Start + term (S18-R5) | 201 `{completionId, resetOn, nextDueCountsFrom, nextDueOn}`; 400 `errors.reset_on` for a future date, missing `work_order_id`, or a certificate missing on a compliance service; 409 enrolment ended | CE | P6 | matched (BE adopts the FE body names) · **changed 2026-10-04** |
| A29 | DELETE `maintenance/completions/{id}` | — | 204 (soft undo: sets `undone_at`); 409 once a later completion exists (S18-R17); 409 `CompletionNotUndoableError` for an `invoice`, `covered` or `enrolment` completion (S18-N8) | CE | P6 | renamed (BE `POST …/undo` → DELETE) · **changed 2026-10-05** |
| A30 | GET `maintenance/reminders` | `page`, `rowsPerPage` (fixed at 50, Q6 ✅), `sortBy=due\|asset\|customer\|service`, `descending`, `search`, `tiles[]` ⊆ `overdue, due_month, due_3_months, needs_readings`, `compliance=1`, `location_ids[]` | `collection[]: WorklistRowDto = {enrolledServiceId, vehicleId, companyId, unitNumber, year, make, model, customerName, serviceName, scheduleName, showScheduleChip, kind, due: DueDto, status, location: {id, name}\|null, workOrder: {id, displayNumber, workplaceId, status}\|null, contact: {contactId\|null, name, telephone, mobile, email}, companyTelephone, maintenanceNotifications, customerHasEmail}`, `pagination`. `customerHasEmail` = any contact of the enrolment's company has a non-empty email (same rule as A16, moved from Plan 2 A30′). Rows and tiles exclude resting rows (TD-36). Organization-wide (GR-1) | CV | P7 | matched (BE adopts the FE query names and row shape). **(c) agreed:** `workOrder.workplaceId` · **changed 2026-10-05** |
| A31 | GET `maintenance/reminders/tiles` | `search`, `compliance`, `location_ids[]` (not `tiles`) | `{overdue, dueMonth, due3Months, needsReadings, hasEnrolments}` (distinct assets) | CV | P7 | matched |
| A32 | GET `maintenance/reminders/meta` | — | `{workplaceCount, workplaces[]: {id, name}}` (the org's workplaces) | CV | P7 | new-from-FE. **(c) agreed** |
| A33 | POST `maintenance/enrolled-services/{id}/work-orders` | `{created_via: worklist\|asset}`, required (origin S22-R1) | 201 `{workOrderId, displayNumber, workplaceId, linesAdded: bool, linesAddedCount, copiedWork: bool, homeWorkplaceName: string}`. At the home location → canned lines; elsewhere → copied work (S13-R30, S16-N6, TD-32): `copiedWork` is true when the WO's location is not the home location, and `linesAdded`/`linesAddedCount` count copied lines too; there is no more "linked, no lines" at a non-home location; 409 enrolment ended or a live linked WO already exists. The new WO copies the asset's mileage and hours (TD-14, Q13 ✅); no wire change | WC | **P6** (FE consumes in P7, on the asset tab and the worklist) | matched + **counter:** the request needs `created_via` · **changed 2026-10-04** |
| A34 | POST `vehicles/change-contact` (existing) | unchanged | unchanged | existing | P7 | matched |

Contract reconciliation counts:

| Status | Count | IDs |
|---|---|---|
| matched | 20 | A1–A7, A11, A13, A16, A19–A22, A25, A28, A30, A31, A33, A34 (A2, A7, A13, A20, A33 with field additions) |
| renamed | 6 | A14, A15, A23, A26, A27, A29 |
| new-from-FE | 8 | A8, A9, A10, A12, A17, A18, A24, A32 |
| rejected | 0 | No endpoint rejected. Two parts were rejected: the A24 `companyId` param, and the A27 FE path (replaced by a service-scoped path) |
| changed 2026-10-04 | 10 | A1, A2, A8, A9, A10, A17, A18, A19, A28, A33 (PRD revision of 2026-10-02; shapes agreed between BE and FE). A3, A4, A5, A7 and A11 keep their shapes; their rules changed (home location, org-wide names, 403 `CannedLinesLockedError`, no other-location 409). No new endpoints in Plan 1. Re-audit 2026-10-04 (Q11): A15 and A16 replace `hasEmail`/`has_email` with `unitsWithoutEmailCount`/`maintenance_units_without_email_count`; A9 `hasEmail` is read from the asset's own contact. _Reversed 2026-10-05 (next row)._ |
| changed 2026-10-05 | 6 | A9, A15, A16, A24, A29, A30 (+ rules on A3/A4 (before row < interval, S5-R12/R13), A28 (path `work_order` settles the WO's readings, TD-35), A33 (copies the asset mileage), every gate: no flag). No new endpoints in Plan 1 |

FE alignment checklist from the contract (already applied in Section 5.4 and the FE phase tables):

1. Type the responses of every new maintenance endpoint in **camelCase**. A16 (`customers/view`) stays snake_case.
2. `DueDto.needs_reading` becomes `needsReadings: ('mileage'|'hours')[]`.
3. A9: handle `customersTruncated` with a `customer_search` box. The response may carry `alreadyOn` per schedule only
   once `company_id` is known.
4. A12: the list is unpaged with `total`, `truncated` and `withHistoryCount`; send `search` to the server.
5. A15: use **PATCH**; the response is `{maintenanceNotifications, affectedUnitsCount}`.
6. A21: each meter carries `readingId`. The orange confirm reads `plausibility.mileageMaxPerDay` /
   `plausibility.hoursMaxPerDay` and compares against `mileage.value` / `hours.value`.
7. A24: drop the `companyId` query param.
8. A27: the path becomes `maintenance/enrolled-services/{id}/completion-work-orders`. Read `defaultResetOn` for the
   Reset date default.
9. A28: the response adds `nextDueOn`.
10. A33: send `created_via` (`worklist` from the worklist, `asset` from the asset tab). `linesAddedCount` is also
    available. The backend ships it in P6. Reads `copiedWork` for the type; navigation is unchanged.
11. Certificate fields are days (`start_date`/`end_date`, `startDate`/`endDate`); no `effective_month`/`expiry_month` anywhere.
12. A8 `schedule_id`; A2 `canEditCannedLines`; A1/A2/A9 `homeWorkplace`/`homeWorkplaceName` and `workplaceCount`.
13. A16 (derived from `contacts[].email`), A9 `hasEmail` and A30 `customerHasEmail` all mean "any contact of the customer has a non-empty email" (2026-10-05).
14. A24 `completed` only for a Mark complete; A29 may answer 409 `CompletionNotUndoableError` (2026-10-05).
15. A3/A4: a before row must be shorter than the calendar interval (days N, months N×30, yearly At 365; Q17 ✅ 918913025); the server default leaves out the 14-before row at ≤ 14 days.

#### 5.3 Backend view: conventions, inbound id checks and handlers

The reconciled contract (endpoints A1–A34) is reproduced at the top of this section and is authoritative. This subsection
restates it in backend terms; if anything here ever differs, the contract wins.

Conventions for every new endpoint:

- **Envelope and keys.** Internal (Quasar) envelope `{"data": …}`. Response keys are camelCase (`DefaultSerializer`,
  no name converter). Lists return `{"data": {"collection": [...], "pagination": {...}}}`, the FE's
  `ResponseDataCollection<T>`. Request keys may be snake_case: `RequestPayloadValueResolver` falls back to the
  snake_case name.
- **Dates.** `YYYY-MM-DD` (certificates included); datetimes ISO 8601 UTC. Meter values are `mileage` / `hours`.
- **Code layout.** One controller per action. The RequestDto lives in `UI/HTTP/<Feature>/DTO/`; the pure
  Command/Query lives in `Application/Command|Query/<Feature>/`. Every controller first calls the named
  `MaintenanceAccessGate` guard (atom).
- **Error statuses** follow `Shared/Infrastructure/EventSubscriber/ApiErrorHandler.php`:
  - 403: missing atom.
  - 404: `ResourceNotFoundError`, which covers ids from another tenant.
  - 400: request validation (field-bound) and plain `DomainError`.
  - 409: state conflicts. The MR errors for these (`ScheduleArchivedError`, `EnrolmentEndedError`,
    `LiveWorkOrderExistsError`, `LaterCompletionExistsError`, `NotCurrentRecordError`, the duplicate-name backstop)
    extend `ConflictError`.
  - 422 is not used.
- **No money field** appears in any MR response.
- **`DueDto`** = `{date, precision, basis, confidence, needsReadings[], noRecord}`. The backend sets
  `precision = month` for meter estimates only, `day` otherwise (certificates included).

Inbound id checks (NFR-015):

| Id | Checked against | Mechanism |
|---|---|---|
| `scheduleId` (route) | organization (GR-6) | `MaintenanceScheduleRepository::findById()` guarded by `isOrganizationEntity()` |
| `schedule_id` (A8) | organization (GR-6) | Same `findById()`; then `HomeLocationAccess` for the 403 (TD-31) |
| `vehicleId` (route or body) | organization | `AssetOwnership::vehicleInOrganization()`: EXISTS over `vehicle_company` JOIN `company` with `c.organization_id` from `OrganizationDecorator` |
| `company_id` | organization + linked to the vehicle | `AssetOwnership::isLinked()` |
| `enrolmentId`, `enrolledServiceId`, `completionId`, `recordId` | organization | `findById()` with `isOrganizationEntity()`; DBAL repos bind `organization_id` from the decorator |
| `work_order_id` (A28) | organization, and the WO's `vehicle_id` equals the service's vehicle | `MaintenanceWorkOrderLookup::findForVehicle()` (any workplace: GR-2) |
| `canned_line_id[]` (A3/A4) | the schedule's home workplace (A3: the verified header; A4: the stored home) | `DbalCannedLineOwnership::assertAllInWorkplace()`: one `IN` query with `organization_id` + `workplace_id`; `count(found) === count(distinct requested)` |
| `vehicle_ids[]` (A13) | linked to the one `company_id` | One `IN` query; count check; a single miss → 404 for the whole request |
| `readingId` (A23) | organization + belongs to the route vehicle | DBAL lookup with both predicates |
| `location_ids[]` (A30/A31) | organization | `IN` query on `workplace`; count check |
| service `id` keys in A3/A4 | not used by any existing schedule service, except this schedule's own on PUT | `Assert\Uuid` + existence check |

Gates: SV `ROLE_WORK_ORDER_VIEW`, SM `ROLE_ORGANIZATION_CREATE_AND_EDIT`, CV `ROLE_CUSTOMER_VIEW`, CE
`ROLE_CUSTOMER_CREATE_AND_EDIT`, WC `ROLE_WORK_ORDER_CREATE_AND_EDIT`. Full request and response fields are in the
contract table above.

| Id | Method + path | Key response fields | Gate | Phase | Handler / fetcher |
|---|---|---|---|---|---|
| A1 | GET `/api/maintenance/schedules` | `collection[] {id, name, status, servicesCount, enrolledAssetsCount, archivedAt, homeWorkplace}`, `counts {active, archived}`, `workplaceCount` (org-wide, GR-6) | SV | P1 | `ListSchedulesQueryHandler`, `DbalScheduleListFetcher` |
| A2 | GET `/api/maintenance/schedules/{id}` | `{id, name, status, homeWorkplace, workplaceCount, canEditCannedLines, readOnly, services[]}` (triggers, reminder offsets, compliance, covers, resolved canned lines with hours from the home workplace, counts) | SV | P1 | `GetScheduleQueryHandler`, `HomeLocationAccess` |
| A3 | POST `/api/maintenance/schedules` | 201 `{id}`; duplicate name (org-wide) → 400 `errors[{field: name}]` via `UniqueScheduleName`; 403 when the user has no access to the header workplace | SM | P1 | `CreateScheduleCommandHandler` (`VerifiedWorkplaceIdResolver` + `HomeLocationAccess`) |
| A4 | PUT `/api/maintenance/schedules/{id}` | 200 `{id}`; 409 archived; 403 `CannedLinesLockedError` (S4-R9) | SM | P1 | `ReplaceScheduleCommandHandler` (passes `canEditLines`) |
| A5 | POST `/api/maintenance/schedules/{id}/duplicate` | 201 `{id, name}`; home kept (S6-E5) | SM | P1 | `DuplicateScheduleCommandHandler` |
| A6 | POST `/api/maintenance/schedules/{id}/archive` | `{unenrolledCount}` | SM | P1 (unenrol P2) | `ArchiveScheduleCommandHandler` |
| A7 | POST `/api/maintenance/schedules/{id}/restore` | 204 | SM | P1 | `RestoreScheduleCommandHandler` |
| A8 | GET `/api/maintenance/canned-lines?schedule_id` | `collection[] {id, name, description, hours}` from the schedule's home workplace (else the header); 403 without home access | SV | P1 | `DbalCannedLineOptionFetcher` (org + the given workplace, GR-7) |
| A9 | GET `/api/vehicles/{vehicleId}/maintenance/enrolment-context` | `customers[]` (≤50, `customer_search`), `customersTotal`, `customersTruncated`, `schedules[] {id, name, servicesCount, alreadyOn, homeWorkplaceName}` (org-wide, GR-6), `workplaceCount`, `hasAnySchedule`, `canManageSchedules` | CE | P2 | `GetEnrolmentContextQueryHandler`, `DbalEnrolmentContextFetcher` |
| A10 | GET `/api/maintenance/schedules/{scheduleId}/enrolment-preview?vehicle_id&company_id` | `services[] {scheduleServiceId, name, kind, lastDonePrefill, needsMileageReading, needsHoursReading, meterAtPassed, complianceRecord}` | CE | P2 (flags P4) | `GetEnrolmentPreviewQueryHandler`, `DbalEnrolmentPreviewFetcher` |
| A11 | POST `/api/maintenance/enrolments` | 201 `{enrolmentId}` | CE | P2 | `EnrolVehicleCommandHandler` |
| A12 | GET `/api/maintenance/schedules/{scheduleId}/bulk-enrolment-preview?company_id&search` | `assets[]` (unpaged, ≤2,500), `total`, `truncated`, `withHistoryCount` | CE | P2 | `DbalBulkEnrolmentPreviewFetcher` |
| A13 | POST `/api/maintenance/enrolments/bulk` | 201 `{enrolledCount, withHistoryCount, skippedAlreadyOn[]}` | CE | P2 | `BulkEnrolVehiclesCommandHandler` |
| A14 | DELETE `/api/maintenance/enrolments/{id}` | 204 (soft end, reason `removed`) | CE | P2 | `RemoveEnrolmentCommandHandler` |
| A15 | PATCH `/api/customers/{companyId}/maintenance-notifications` | `{maintenanceNotifications, affectedUnitsCount}` | CE | P2 | `ChangeMaintenanceNotificationsCommandHandler` |
| A17 | GET `/api/vehicles/{vehicleId}/compliance-records` | `[{serviceName, current, history[]}]`; Record `{id, complianceType, termMonths, startDate, endDate, certificateNumber, attachment {id, fileName, mimeType, size, url}}` | CV | P2 | `DbalComplianceRecordListFetcher` |
| A18 | POST `/api/vehicles/{vehicleId}/compliance-records` | 201 Record | CE | P2 | `AddComplianceRecordCommandHandler` |
| A19 | PUT `/api/maintenance/compliance-records/{id}` | Record; 409 not current | CE | P2 | `CorrectComplianceRecordCommandHandler` |
| A20 | POST / DELETE / GET `/api/maintenance/compliance-records/{id}/attachment` | 201 `{attachment}` / 204 / stream | CE (GET: CV) | P2 | `AttachCertificateCommandHandler`, `RemoveCertificateCommandHandler`, `DownloadCertificateController` |
| A21 | GET `/api/vehicles/{vehicleId}/meter-readings/current` | `{mileage, hours: {readingId, value, readAt, source, state, enteredByName}\|null, plausibility {mileageMaxPerDay, hoursMaxPerDay}}` | CV | P3 | `CurrentReadingsQueryHandler` (ceiling from `RateCeiling`, Q2 ✅) |
| A22 | POST `/api/vehicles/{vehicleId}/meter-readings` | 201 `{readings[] {id, meter, value, lowerThanPrevious, implausible}}` | CE | P3 | `RecordReadingsCommandHandler` |
| A23 | DELETE `/api/vehicles/{vehicleId}/meter-readings/{readingId}` | 204 (soft) | CE | P3 | `UndoReadingCommandHandler` |
| A24 | GET `/api/vehicles/{vehicleId}/maintenance` | `{isEnrolled, hasComplianceRecords, readings {mileage, hours}: ReadingCardDto, services[]: ServiceRowDto, enrolments[]}` | CV | P5 | `GetAssetMaintenanceQueryHandler` |
| A25 | GET `/api/maintenance/enrolled-services/{id}/candidates` | `collection[] {trigger, date, precision, confidence, isWinner}` | CV | P5 | `GetCandidatesQueryHandler` |
| A26 | POST / DELETE `/api/maintenance/enrolled-services/{id}/skip` | 204 | CE | P5 | `SkipServiceCommandHandler`, `UnskipServiceCommandHandler` |
| A27 | GET `/api/maintenance/enrolled-services/{id}/completion-work-orders` | `collection[] {id, number, displayNumber, workplaceId, workplaceName, createdOn, status, invoicedOn, linesClosedOn, defaultResetOn}` | CE | P6 | `ListCompletionWorkOrdersQueryHandler` (GR-2) |
| A28 | POST `/api/maintenance/enrolled-services/{id}/completions` | 201 `{completionId, resetOn, nextDueCountsFrom, nextDueOn}` | CE | P6 | `MarkServiceCompleteCommandHandler` (path `work_order` also settles the WO's readings first, TD-35, S18-R19; no wire change) |
| A29 | DELETE `/api/maintenance/completions/{id}` | 204 (soft undo); 409 `CompletionNotUndoableError` for non-Mark-complete completions (S18-N8) | CE | P6 | `UndoCompletionCommandHandler` (path `work_order`: re-settles the WO's readings, TD-35) |
| A30 | GET `/api/maintenance/reminders` | `collection[]: WorklistRowDto` (with `location {id, name}`, `workOrder {id, displayNumber, workplaceId, status}`, `contact {...}`, `companyTelephone`, `maintenanceNotifications`, `customerHasEmail`), `pagination` (50) | CV | P7 | `ListRemindersQueryHandler`, `DbalWorklistFetcher` (GR-1; `WorklistPredicates`, TD-36) |
| A31 | GET `/api/maintenance/reminders/tiles` | `{overdue, dueMonth, due3Months, needsReadings, hasEnrolments}` | CV | P7 | `GetReminderTilesQueryHandler` |
| A32 | GET `/api/maintenance/reminders/meta` | `{workplaceCount, workplaces[] {id, name}}` | CV | P7 | `GetWorklistMetaQueryHandler` |
| A33 | POST `/api/maintenance/enrolled-services/{id}/work-orders` | body `{created_via}`; 201 `{workOrderId, displayNumber, workplaceId, linesAdded, linesAddedCount, copiedWork, homeWorkplaceName}` | WC | P6 | `CreateWorkOrderForEnrolledServiceCommandHandler` (home or copy mode, TD-32) |

Dropped from the earlier BE draft, because the contract absorbs them:

- `maintenance/vehicles/{id}/enrolment-customers` → A9.
- GET `customers/{id}/maintenance-notifications` → A16.
- `vehicles/{id}/meter-readings/plausibility` → `plausibility` in A21, and `implausible` in the A22 result.

#### 5.4 Frontend view (consumers and DTO types)

**The authoritative source is the reconciled Plan 1 API contract at the top of this section, which the BE author owns.** This subsection
mirrors it from the FE side. If the two ever disagree, the contract wins. The FE calls these through `$axios` with relative paths
(`'maintenance/...'`).

Wire rules the FE codes against:
1. **Response keys are camelCase** on every new endpoint, and every type in `api/maintenance/MaintenanceModel.ts` is camelCase.
   The one exception is A16 (`customers/view/{id}`, legacy array, snake_case).
2. **Request bodies and query params are snake_case**, as the FE already sends them (the BE resolver accepts both forms).
3. Lists use `ResponseDataCollection<T>` (`collection` + `pagination`).
4. **Errors:**
   - 400 = validation (`errors[]` with `field`) or a plain domain error;
   - 403 = missing atom;
   - 404 = not found or another tenant's id;
   - 409 = state conflict;
   - 422 never appears.
   The axios interceptor no longer treats a domain 409 as a session expiry (only the legacy session body logs out,
   `boot/axios.ts:903-922`). Where the FE renders the error itself, the request sets the existing per-request config flags:
   - `handlesValidationLocally: true` on A3, A4 and A28, so the duplicate-name and `reset_on` errors render inline without a second toast;
   - `handlesConflictLocally: true` on A23 and A29, so an undo that is no longer allowed shows "This can no longer be undone" instead of the generic conflict toast.
5. Meters are `mileage` / `hours`. Dates are `YYYY-MM-DD`; datetimes ISO 8601 UTC (no certificate months remain).
6. `DueDto = {date, precision: 'day'|'month', basis, confidence, needsReadings: ('mileage'|'hours')[], noRecord}`.
   The BE decides `precision`: `month` for meter estimates only, `day` otherwise (a certificate's `date` is its End date).

Endpoints that no longer exist and must not be referenced:
- a separate customer-notifications GET (use A16);
- a plausibility GET (folded into A21);
- an `enrolment-customers` read (folded into A9).

| # | Method + path | Phase (BE) | FE consumer | Request (snake_case) | Response fields the FE uses (camelCase) |
|---|---|---|---|---|---|
| A1 | GET `maintenance/schedules` | P1 | `useScheduleListQuery` (`useTableQuery`, `rowsPerPage` ≤100) | `status, search, sortBy=name\|servicesCount\|enrolledAssetsCount, descending, page, rowsPerPage` | `collection[]: {id, name, status, servicesCount, enrolledAssetsCount, archivedAt, homeWorkplace}`, `pagination`, `counts: {active, archived}`, `workplaceCount`. Organization-wide (no header scoping, no `subscribeToLocation`) |
| A2 | GET `maintenance/schedules/{id}` | P1 | `useScheduleDetailQuery` | — | `{id, name, status, homeWorkplace, workplaceCount, canEditCannedLines, readOnly, services[]: ServiceDto}`. ServiceDto = `{id, position, name, kind, triggers: TriggerDto, reminderOffsets[]: {direction, days}, compliance: {type, termMonths, remindBeforeMonths}\|null, coveredServiceIds[], coveredServiceNames[], cannedLines[]: {cannedLineId, name, hours, position, coveredFromServiceId}, lineCount, coveredLineCount, hours}`. `TriggerDto = {calendar: {op, value?, unit?, day?, month?}, mileage?: {op, value}, hours?: {op, value}}`. Read-only mode keys on `readOnly`; the canned-lines step's read-only mode keys on `canEditCannedLines` (FD-24) |
| A3 | POST `maintenance/schedules` | P1 | `useCreateScheduleMutation` (`handlesValidationLocally`) | `{name, services[]: {id, name, kind, triggers?, reminder_offsets?, compliance?, covered_service_ids[], canned_lines[]: {canned_line_id, covered_from_service_id?}}}`. Array order = position. **`services[].id` for an unsaved service = `crypto.randomUUID()`**, which the BE keeps as the service id. `covered_service_ids` may reference sibling keys | 201 `{id}`. Duplicate name → **400** `errors[{field: 'name', message}]`, shown inline under the title. A concurrent duplicate → 409 (generic toast) |
| A4 | PUT `maintenance/schedules/{id}` | P1 | `useUpdateScheduleMutation` (`handlesValidationLocally`) | Same as A3. A service missing from the body is removed | 200 `{id}`. 400 as A3. 409 archived |
| A5 | POST `maintenance/schedules/{id}/duplicate` | P1 | `useDuplicateScheduleMutation` | — | 201 `{id, name}` |
| A6 | POST `maintenance/schedules/{id}/archive` | P1 (unenrol P2) | `useArchiveScheduleMutation` | — | `{unenrolledCount}` |
| A7 | POST `maintenance/schedules/{id}/restore` | P1 | `useRestoreScheduleMutation` | — | 204. 409 only if the schedule is no longer archived (toast) |
| A8 | GET `maintenance/canned-lines` | P1 | `useMaintenanceCannedLinesQuery(scheduleId, search)` (`useTableQuery`, ≤100/page) | `search, page, rowsPerPage`, `schedule_id` when set | `collection[]: {id, name, description, hours}`. No price (S4-R2, S4-R6) |
| A9 | GET `vehicles/{vehicleId}/maintenance/enrolment-context` | P2 | `useEnrolmentContextQuery(vehicleId, companyId, customerSearch)` | `company_id?`, `customer_search?` | `customers[]: {companyId, name, maintenanceNotifications, hasEmail}` (≤50; `hasEmail` = any contact of that customer has an email), `customersTotal`, `customersTruncated`; `schedules[]: {id, name, servicesCount, alreadyOn, homeWorkplaceName}` (every active schedule of the org; `alreadyOn` is meaningful only once `company_id` is known or there is a single customer); `workplaceCount`; `hasAnySchedule`; `canManageSchedules` |
| A10 | GET `maintenance/schedules/{scheduleId}/enrolment-preview` | P2 (flags P4) | `useEnrolmentPreviewQuery` | `vehicle_id`, `company_id` (both required) | `services[]: {scheduleServiceId, name, kind, lastDonePrefill, needsMileageReading, needsHoursReading, meterAtPassed: {meter, atValue, currentValue}\|null, complianceRecord: {id, certificateNumber, endDate}\|null}` |
| A11 | POST `maintenance/enrolments` | P2 | `useEnrolAssetMutation` | `{vehicle_id, company_id, schedule_id, services[]: {schedule_service_id, last_done_on\|null, meter_at_passed_action}}` | 201 `{enrolmentId}`. 400 / 409 → toast, dialog stays open |
| A12 | GET `maintenance/schedules/{scheduleId}/bulk-enrolment-preview` | P2 | `useBulkEnrolmentPreviewQuery(companyId, scheduleId, search)` | `company_id`, `search` (server-side: type, make, unit, VIN) | `assets[]: {vehicleId, unitNumber, year, make, model, vehicleType, vin, alreadyOn, hasHistory}` (unpaged, ≤2,500, sorted by unit), `total`, `truncated`, `withHistoryCount` |
| A13 | POST `maintenance/enrolments/bulk` | P2 | `useBulkEnrolMutation` | `{company_id, schedule_id, vehicle_ids[]}` (≤2,500) | 201 `{enrolledCount, withHistoryCount, skippedAlreadyOn[]}` |
| A14 | DELETE `maintenance/enrolments/{id}` | P2 (FE mount P5) | `useRemoveEnrolmentMutation` | — | 204 (soft end). 409 already ended |
| A15 | **PATCH** `customers/{companyId}/maintenance-notifications` | P2 | `useSetMaintenanceNotificationsMutation` (`api/companies/queries.ts`) | `{enabled}` | `{maintenanceNotifications, affectedUnitsCount}` |
| A16 | GET `customers/view/{companyId}` (existing, **snake_case**) | P2 | `companyQueryOptions` / `useCompanyQuery` | — | adds `maintenance_notifications`, `maintenance_enrolled_units_count` to `CustomerCompanyView`; has-email is derived from `contacts[]` (trimmed, non-empty) |
| A17 | GET `vehicles/{vehicleId}/compliance-records` | P2 | `useComplianceRecordsQuery` | — | `[{serviceName, current: Record, history: Record[]}]`, `Record = {id, complianceType, termMonths, startDate, endDate, certificateNumber, attachment: {id, fileName, mimeType, size, url}\|null}`. `url` = the authorized A20 GET (opened through `$axios` as a blob, never as a bare link) |
| A18 | POST `vehicles/{vehicleId}/compliance-records` | P2 | `useCreateComplianceRecordMutation` | `{service_name, compliance_type, term_months, start_date\|null, end_date\|null, certificate_number\|null}` | 201 Record. 400 when neither date |
| A19 | PUT `maintenance/compliance-records/{id}` | P2 | `useUpdateComplianceRecordMutation` | A18 without `service_name` | 200 Record. 409 not current |
| A20 | POST / DELETE / GET `maintenance/compliance-records/{id}/attachment` | P2 | `useUploadCertificateAttachmentMutation`, `useRemoveCertificateAttachmentMutation`, `maintenanceApi.downloadCertificateAttachment` | POST multipart `file` | POST 201 `{attachment}`; DELETE 204; GET streams the file. 400 mime / >10 MB (Q5 ✅) |
| A21 | GET `vehicles/{vehicleId}/meter-readings/current` | P3 | `useCurrentReadingsQuery` | — | `{mileage: Reading\|null, hours: Reading\|null, plausibility: {mileageMaxPerDay, hoursMaxPerDay}}`, `Reading = {readingId, value, readAt, source, state, enteredByName}` |
| A22 | POST `vehicles/{vehicleId}/meter-readings` | P3 | `useRecordReadingsMutation` | `{mileage?, hours?}` (at least one) | 201 `{readings[]: {id, meter, value, lowerThanPrevious, implausible}}` |
| A23 | DELETE `vehicles/{vehicleId}/meter-readings/{readingId}` | P3 | `useUndoReadingMutation` (`handlesConflictLocally`) | — | 204. 409 if the reading is no longer the latest live reading or was not entered by this user through the dialog |
| A24 | GET `vehicles/{vehicleId}/maintenance` (**no `companyId` param**) | P5 | `useAssetMaintenanceQuery(vehicleId)` | — | `{isEnrolled, hasComplianceRecords, readings: {mileage, hours}: ReadingCardDto, services[]: ServiceRowDto, enrolments[]: {id, scheduleId, scheduleName, companyId, companyName}}` |
| A25 | GET `maintenance/enrolled-services/{id}/candidates` | P5 | `useCandidatesQuery` (enabled on menu open) | — | `collection[]: {trigger, date, precision, confidence, isWinner}` |
| A26 | POST / DELETE `maintenance/enrolled-services/{id}/skip` | P5 | `useSkipServiceMutation` / `useUndoSkipMutation` | — | 204. 409 already in that state |
| A27 | GET `maintenance/enrolled-services/{enrolledServiceId}/completion-work-orders` | P6 | `useCompletionWorkOrdersQuery(vehicleId, enrolledServiceId, search)` (`useTableQuery`, 20/page) | `search, page` | `collection[]: {id, number, displayNumber, workplaceId, workplaceName, createdOn, status, invoicedOn\|null, linesClosedOn\|null, defaultResetOn}`. Every workplace of the org (E2) |
| A28 | POST `maintenance/enrolled-services/{id}/completions` | P6 | `useMarkCompleteMutation` (`handlesValidationLocally`) | `{path, work_order_id\|null, shop_name\|null, reading: {meter, value}\|null, reset_on, certificate: {certificate_number?, start_date?, end_date?, term_months}\|null}` | 201 `{completionId, resetOn, nextDueCountsFrom, nextDueOn}`. 400 field errors shown inline (`reset_on`, `work_order_id`, certificate). 409 enrolment ended → toast |
| A29 | DELETE `maintenance/completions/{id}` | P6 | `useUndoCompletionMutation` (`handlesConflictLocally`) | — | 204. 409 once a later completion exists, or `CompletionNotUndoableError` for a non-Mark-complete completion (S18-N8) |
| A30 | GET `maintenance/reminders` | P7 | `useWorklistQuery` (`useTableQuery`, `pageSize: 50`) | `page, rowsPerPage=50, sortBy=due\|asset\|customer\|service, descending, search, tiles[], compliance=1, location_ids[]` | `collection[]: WorklistRowDto`, `pagination` |
| A31 | GET `maintenance/reminders/tiles` | P7 | `useWorklistTilesQuery` | `search, compliance, location_ids[]` (never `tiles`) | `{overdue, dueMonth, due3Months, needsReadings, hasEnrolments}` |
| A32 | GET `maintenance/reminders/meta` | P7 | `useWorklistMetaQuery` | — | `{workplaceCount, workplaces[]: {id, name}}` |
| A33 | POST `maintenance/enrolled-services/{id}/work-orders` | **P6** (FE consumes in P7 on both surfaces) | `useCreateWorkOrderFromServiceMutation` | `{created_via: 'worklist'\|'asset'}` (required) | 201 `{workOrderId, displayNumber, workplaceId, linesAdded, linesAddedCount, copiedWork, homeWorkplaceName}`; `copiedWork` is read for the type only, navigation unchanged. 409 enrolment ended or a live linked WO exists → toast + invalidate (the row then shows Open work order) |
| A34 | POST `vehicles/change-contact` (existing) | — | `useSaveVehicleContactMutation` (existing) | unchanged | unchanged |

**DTO shapes in `api/maintenance/MaintenanceModel.ts` (camelCase):**

```ts
export type MaintenanceMeter = 'mileage' | 'hours';
export type DueStatus = 'due_soon' | 'due_today' | 'overdue';   // enum VALUES stay snake_case; keys are camelCase
export type Confidence = 'high' | 'medium' | 'low';
export type DueBasis = 'calendar' | 'mileage' | 'hours' | 'certificate';

export type DueDto = {
  date: DateString | null;            // null only for compliance "No record"
  precision: 'day' | 'month';         // BE-owned: 'month' only for meter estimates; certificate = End date, 'day' (S11-R9, S11-R13)
  basis: DueBasis;
  confidence: Confidence | null;      // only when basis is mileage|hours
  needsReadings: MaintenanceMeter[];  // [] | ['mileage'] | ['hours'] | ['mileage','hours'] (S9-N3, S13-R22)
  noRecord: boolean;                  // compliance without record (S3-N2)
};

export type ServiceRowDto = {
  enrolledServiceId: UUID; enrolmentId: UUID; scheduleId: UUID; scheduleName: string;
  showScheduleChip: boolean; name: string; kind: 'routine' | 'compliance';
  triggers: TriggerDto; due: DueDto; status: DueStatus | null; skipped: boolean;
  completed: { completionId: UUID; resetOn: DateString; undoable: boolean } | null;
  lastDone: { date: DateString; kind: 'completion' | 'elsewhere' | 'invoice' | 'entered_at_enrolment' } | null;
  currentRecordId: UUID | null;
};

export type ReadingCardDto = {
  recorded: { value: number; readAt: DateString; source: ReadingSource; state: 'recorded' | 'in_shop' } | null;
  estimate: { value: number /* BE-rounded, S11-R12 */; ratePerWeek: number; visitsCount: number; confidence: Confidence } | null;
};

export type WorklistRowDto = {
  enrolledServiceId: UUID; vehicleId: UUID; companyId: UUID;
  unitNumber: string | null; year: number | null; make: string | null; model: string | null;
  customerName: string; serviceName: string; scheduleName: string; showScheduleChip: boolean;
  kind: 'routine' | 'compliance'; due: DueDto; status: DueStatus | null;
  location: { id: UUID; name: string } | null;
  workOrder: { id: UUID; displayNumber: string; workplaceId: UUID; status: WorkOrderStatus } | null;
  contact: { contactId: UUID | null; name: string | null; telephone: string | null; mobile: string | null; email: string | null };
  companyTelephone: string | null;
  maintenanceNotifications: boolean;
  customerHasEmail: boolean; // any contact of the company has an email (S7-R20, 2026-10-05)
};

export type ComplianceRecordDto = {
  id: UUID; complianceType: string; termMonths: number;
  startDate: DateString | null /* always sent; nullable type only */; endDate: DateString; certificateNumber: string | null;
  attachment: { id: UUID; fileName: string; mimeType: string; size: number; url: string } | null;
};
export type HomeWorkplace = { id: UUID; name: string };
export type ScheduleListItemDto = { id: UUID; name: string; status: 'active' | 'archived'; servicesCount: number;
  enrolledAssetsCount: number; archivedAt: string | null; homeWorkplace: HomeWorkplace };
```

In `components/ts/maintenance/Model.ts`: `export type CertificateInput = { complianceType: string; termMonths: number | null; startDate: DateString | null; endDate: DateString | null; certificateNumber: string | null; startTouched: boolean; endTouched: boolean };`

### Modified endpoints

| Endpoint | Change | Consumers to re-verify |
|---|---|---|
| A16 `GET /api/customers/view/{companyId}` (`Customer/Customers/Application/View/ViewQueryHandler.php`) | Adds `maintenance_notifications` (bool, cast like `require_po` at `:193`), `maintenance_enrolled_units_count` (through the `MaintenanceEnrolmentCounter` port) (no email field: the FE derives it from `contacts[]`, 2026-10-05). Snake_case, like the rest of this legacy array | Customer info card (FE), E2E customer factories that snapshot this response |
| `POST /api/work-orders/create` (`WorkOrders/Application/Create/CreateCommandHandler.php`) | Behavior unchanged; the body delegates to `ServiceWorkOrderOpener`. `MileageChange`/`EngineHoursChange` carry `previous` = the asset's value (TD-34), so the copied value records no reading | Every WO creation flow, appointment at creation, default adjustments, snapshots |
| `POST /api/work-orders/{id}/lines/create-from-canned-line` (`Line/CreateFromCannedLine/CreateCommandHandler.php`) | Behavior unchanged; the body delegates to `CannedLineAppender` | Canned-line add, inspection template auto-link, auto-pick parts on approval |
| `POST /api/work-orders/change-line-required-data` (`Line/UpdateLineData/ChangeCommandHandler.php`) | Stamps `end_date` (TD-18) and runs in `Transactional`; raises `MileageChange`/`EngineHoursChange` with `previous` (TD-34) | Line completion via the required-data prompt; reports that read `end_date` |
| `POST /api/work-orders/change-mileage`, the change-engine-hours, change-required-data and full WO change endpoints | Wrapped in `Transactional` (P3); raise `MileageChange`/`EngineHoursChange` with `previous` = the WO's value before the write (TD-34), so an unchanged re-sent value records nothing | WO header edits |
| `POST /api/vehicles/create`, `POST /api/vehicles/change`, `POST /api/v1/assets`, `PATCH /api/v1/assets/{id}`, vehicles import, customer-portal vehicle create | Record readings for entered values; responses unchanged | Asset screens, Public API clients, imports, portal |
| `POST /api/vehicles/delete`, `POST /api/vehicles/merge`, `POST /api/vehicles/change` (VIN merge, link split), `POST /api/work-orders/change-vin` | Dispatch lifecycle events; responses unchanged | Asset delete/merge flows |
| A34 `POST /api/vehicles/change-contact` | Unchanged (the FE uses it for "set a contact", S14-N4) | — |

## 6. Implementation Phases

Each phase lands as its own PR (or PR wave) **into the shared feature branch** `feature/SV-3780-maintenance-reminders`
(D28), is independently testable there, and leaves the branch green. `develop` is untouched until the branch merges whole,
after Plan 2 is done and QA has signed off on the branch build. Before opening a phase PR, sync the branch from `develop`
and run the post-sync gates (BR18, BR19, FR21). Backend tables list paths under `api/` unless they start with another top-level directory; frontend tables list
paths under `app/src/` unless they start with `app/`, `api/` or `e2e/`. "Depends on" is derived from the hand-offs the
phase text names (for example "recompute hook added in P4", "browser mount arrives in P5").

Backend verification gates for every phase, run on the changed files only:

- `php tools/php-cs-fixer/vendor/bin/php-cs-fixer --config=.php-cs-fixer.php fix <changed files>`
- `vendor/bin/phpstan clear-result-cache && vendor/bin/phpstan analyse --memory-limit=3G <changed src and test files>` (files, never directories)
- `./vendor/bin/pest <new and mirrored unit tests>` and `./vendor/bin/pest <new functional tests>`; clean status line (no deprecated/risky/skipped)
- Migration gate where the phase adds schema: `bin/console doctrine:migrations:migrate --no-interaction`, then `bin/console doctrine:migrations:diff --allow-empty-diff` → "No changes detected"
- `bin/console lint:container` after any service wiring change
- Smoke: `bin/smoke-test.sh` (after a cache clear, `--warmup` first); add each new GET route to the curated list; any 500 blocks. Check `var/log/dev.log` (native) or php-fpm logs (docker) for fatals
- E2E: per-phase specs are written in the phase PR; the formal coverage pass (`/e2e-after-change`, block or override marker) runs once, on the branch → develop PR (D28)
- Before opening the phase PR: the branch is synced from `develop` (merge, never rebase), a fresh database is migrated and the diff gate passes (4.3 rule 8, BR19)

Frontend gates for every phase (scoped to changed files; there is no push hook):
`npx eslint --max-warnings=0 <files>` · `npx vitest related --run <files>` + `npx vitest run <new specs>` · `npx vue-tsc --noEmit` ·
`cd e2e && npx tsx scripts/e2e-precheck.ts --files=<vue files> --pretty` (no missing test ids) · compile gate (Vite up, no overlay) ·
browser-walk on the branch build (QUICK_LOGIN_USERS `admin` unless stated), plus a regression walk of every touched existing
screen, which now always carries the additions, and a walk of every touched existing screen as a user without the new
permission · `e2e-precheck` per phase; the `/e2e-after-change` coverage pass (reference-breakage scan + curation + block) runs
once on the branch before the PR to develop (D28).

### Phase P0: Foundation

**Implements:** `MaintenanceAccessGate` (atoms only, no flag, D27); the `VehicleService/Maintenance` scaffold; MR `entity_event` types and the DBAL `EntityEventWriter`; `MaintenanceToday`; `ServiceName`. FE shared pieces every later phase needs: `QueryState`/Retry, opt-in `fullscreenOnPhone` on `BaseDialog`/`BaseFormDialog`, `HoverCard` (hover/tap/focus), `ResponsiveActionMenu`, `EditableTitle` (reverts on blank), `useSortable` moved out of the DVI builder, `VehicleTabsBar`, the Customers tab shell with `?tab=`, `DueBadge`/`DueCell`/`ConfidenceMeter`. Requirement IDs traced to P0 in Section 10: S1-R7, S1-R9, S1-R10, S1-N3, S2-R10, S2-R15, S3-R10, S3-N2, S4-R5, S9-R7, S9-R16, S9-R17, S9-N3, S11-R9, S11-R11, S11-R13, S11-R27, S13-R1, S13-R23, S13-R32, S13-R34, S21-R1, S21-R3, S21-R4, S21-R6, S21-R7, S21-N1, S21-N2, S21-E2, S21-N3, NFR-001, NFR-010, NFR-013, NFR-F01, NFR-F02, NFR-F04, NFR-F05, NFR-F07, NFR-F08, NFR-F09, NFR-F10, NFR-F11, NFR-F13.

**Depends on:** Nothing.

#### Database changes:
None.

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/UI/HTTP/Shared/MaintenanceAccessGate.php` | Create | `guardSettingsView()` (`ROLE_WORK_ORDER_VIEW`), `guardSettingsManage()` (`ROLE_ORGANIZATION_CREATE_AND_EDIT`), `guardCustomerView()` (`ROLE_CUSTOMER_VIEW`), `guardCustomerEdit()` (`ROLE_CUSTOMER_CREATE_AND_EDIT`), `guardWorkOrderCreate()` (`ROLE_WORK_ORDER_CREATE_AND_EDIT`): each `denyAccessUnlessGranted(<atom>)`. **No `FEATURE_FLAG`, no `guardFeatureFlag()`** (D27). Same shape as `Inspections/UI/HTTP/Template/InspectionTemplateAccessGate.php`, minus its flag check |
| `src/EntityEvent/Domain/EntityEventType.php` | Modify | Add `MAINTENANCE_SCHEDULE`, `MAINTENANCE_ENROLMENT`, `MAINTENANCE_ENROLLED_SERVICE`, `MAINTENANCE_COMPLETION`, `MAINTENANCE_COMPLIANCE_RECORD`, `MAINTENANCE_WORK_ORDER_SERVICE`, `VEHICLE_METER_READING`, `COMPANY_MAINTENANCE_NOTIFICATIONS` and their `getLabel()` arms |
| `src/EntityEvent/Domain/Service/EntityEventWriter.php` | Create | Port: `write(list<EntityEventDto>): void`, never flushes the ORM, skips silently when no actor resolves (TD-09) |
| `src/EntityEvent/Infrastructure/Dbal/DbalEntityEventWriter.php` | Create | Multi-row `INSERT` into `entity_event` and `entity_event_ref` in chunks of 500; `user_id` from `AuditUserIdResolver::resolve()`, `organization_id` from `OrganizationDecorator`, `occurred_at` UTC |
| `src/VehicleService/Maintenance/Domain/Service/MaintenanceToday.php` | Create | Port: `date(): \DateTimeImmutable` (local day, midnight) |
| `src/VehicleService/Maintenance/Infrastructure/Time/WorkplaceMaintenanceToday.php` | Create | `ClockInterface::now()` converted to `WorkplaceTimezone::getDateTimeZone()` (UTC fallback outside a session) |
| `src/VehicleService/Maintenance/Domain/Model/ServiceName.php` | Create | `normalize()` (TD-23) |
| `config/services.yaml` | Modify | Bind the two ports; parameters `env(MAINTENANCE_INVOICE_RESET_ENABLED): '1'` and `maintenance.invoice_reset_enabled: '%env(bool:MAINTENANCE_INVOICE_RESET_ENABLED)%'` (used in P6) |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `api/maintenance/index.ts`, `MaintenanceModel.ts`, `keys.ts`, `queries.ts`, `invalidation.ts` | Create | Module scaffold, key factory (§2.7), invalidation helper, shared DTO types (§5.4). P0 holds no endpoint calls yet. Each phase adds its own |
| `api/index.ts` | Modify | `export * from './maintenance';` |
| `app/src/testing/handlers.ts` (MSW defaults) | Modify | Default maintenance handlers return empty, envelope-correct, **camelCase** payloads (per the reconciled contract), so unrelated specs that mount gated components never crash ("Stubs are code"). Nothing is flag-gated (D27), so the existing specs of Customers.vue, VehicleInvoices.vue, Customer.vue and CustomerLeftSection.vue mount the new async pieces: the defaults must make each render its empty state (NFR-F13) |
| `composables/useMaintenanceAccess.ts` | Create | §2.8 |
| `components/ts/shared/QueryState.vue` | Create | Generalized `AccountingQueryState` (props `testIdPrefix`, `subject`, `isPending`, `hasError`, `retry`). Error is checked before pending. The accounting copy is not changed |
| `components/ts/shared/dialogs/BaseDialog.vue`, `BaseFormDialog.vue` | Modify | Opt-in `fullscreenOnPhone?: boolean` (default `false`) |
| `components/ts/shared/HoverCard.vue`, `composables/useHoverCardTrigger.ts` | Create | Trigger set from `ReportInfoIcon.vue`. Body = `q-menu` (desktop) / bottom `q-dialog` (phone `lt.sm`). 300 ms open delay on hover only |
| `components/ts/shared/ResponsiveActionMenu.vue` | Create | `actions: MenuAction[] = {key, label, icon?, danger?, disabledReason?: string \| null, visible?: boolean, testId}`; emits `select(key)` |
| `components/ts/shared/EditableTitle.vue` | Create | Extracted from `InspectionEditableText.vue`, plus `revertOnBlank` (default `false`) |
| `components/ts/inspections/builder/InspectionEditableText.vue` | Modify | Becomes a thin wrapper around `EditableTitle` (same props, test ids `testId` / `${testId}_input`), so its 3 consumers (`InspectionTemplateBuilder.vue`, `InspectionBuilderMobile.vue`, `InspectionBuilderSection.vue`) are untouched |
| `composables/useSortable.ts` | Create | Moved from `inspections/builder/useSortable.ts` |
| `components/ts/inspections/builder/useSortable.ts` | Modify | `export * from '@/composables/useSortable';` (consumers `InspectionTemplateBuilder.vue`, `InspectionBuilderMobile.vue`, `work-orders/work-order-lines/WorkOrderLines.vue` unchanged). The existing spec stays where it is |
| `components/ts/customers/VehicleTabsBar.vue` | Create | One `q-tabs` + `q-route-tab` loop, props `modelValue`, `tabs: NavigationTab[]`, `companyId`. Emits `update:modelValue` (GR#7). Test ids `vehicle_tab_${tab.name}` unchanged |
| `components/ts/customers/VehicleInvoices.vue` | Modify | Replace the 3 copies (:226-247, :265-286, :341-362) with `<VehicleTabsBar>`. `NavigationTab` type → `components/ts/customers/Model.ts` (if absent, Create) so both files share it |
| `components/ts/customers/CustomerListPanel.vue` | Create | Lines :20-87 + script of `pages/Customers.vue` moved verbatim. Takes `search` as a prop (owned by the shell). Keeps `subscribeToLocation`, Vuex dispatch and test ids (`button_new_customer` stays in the shell header) |
| `pages/Customers.vue` | Modify | Shell: header (title, `PageSearchInput`, New customer only on the customers tab, S13-R32), `q-tabs` when `access.canView`, `q-tab-panels` (customers panel / `MaintenanceRemindersTab` async). `?tab=` sync |
| `components/ts/maintenance/worklist/MaintenanceRemindersTab.vue` | Create (stub) | Renders the S13-R33 "no maintenance reminders yet" empty state until P7. Lets P0 ship the shell dark |
| `components/ts/maintenance/shared/DueBadge.vue` | Create | `status: DueStatus \| null`, `kind`, `skipped`, `completed`. Overdue red except compliance (orange, S3-R10). Grey Skipped. "Completed" chip |
| `components/ts/maintenance/shared/DueCell.vue`, `formatDue.ts` | Create | Line 1 = date (day or month per `precision`, org date format). Line 2 = basis ("Calendar", "Certificate", ConfidenceMeter, "Calendar · needs mileage reading", "No record"). Never an overdue figure (S11-R13) |
| `components/ts/maintenance/shared/ConfidenceMeter.vue` | Create | 3 bars + word. Low is never red (S9-R17). HoverCard body with the rule (S11-R11), the fixed disclaimer (S11-R27) and "View work orders" → `VehicleWorkOrdersTab` |
| `components/ts/maintenance/shared/intervalFormat.ts`, `copy.ts` | Create | "15,000 mileage · 3 months" (S1-R9, S2-R10, S2-R15). Copy constants |
| `components/ts/maintenance/Model.ts` | Create | Component-local types (MenuAction re-export, draft shapes added in P1) |

#### Key code changes:
Frontend:

**Code sketch: phone full-screen prop (opt-in, default off)**

```vue
<!-- BaseFormDialog.vue (and BaseDialog.vue, same three lines) -->
<q-dialog
  v-model="isDialogVisible"
  :maximized="fullscreenOnPhone && $q.screen.lt.sm"
  ...existing bindings unchanged
>
  <q-card
    :class="[
      'dialog-card', cardClass, `dialog-size-${size}`,
      { 'dialog-card--anchored': isCardAnchored, 'dialog-card--fullscreen': fullscreenOnPhone && $q.screen.lt.sm },
    ]"
    :style="fullscreenOnPhone && $q.screen.lt.sm ? undefined : cardStyle"
  >
```
```ts
// props (withDefaults): fullscreenOnPhone?: boolean  → default false
```
CSS for `.dialog-card--fullscreen` goes in `app/src/css/app.scss` next to `.dialog-card` (:1193): `max-width: none; width: 100vw; height: 100%; border-radius: 0`, with the action bar sticky at the bottom. `isCardAnchored` positioning is skipped while maximized.

**Code sketch: Customers tab shell**

```vue
<!-- pages/Customers.vue -->
<template>
  <q-page>
    <div class="row items-center q-mb-md">
      <div v-if="$q.screen.gt.sm" class="q-table__title">Customers</div>
      <q-space />
      <PageSearchInput v-model="search" class="q-mr-sm" />
      <Button v-if="activeTab === 'customers' && permissionService.canEdit('customers')" data-test-id="button_new_customer" ... />
    </div>

    <template v-if="showTabs">
      <q-tabs :model-value="activeTab" align="left" dense active-color="primary" indicator-color="primary"
              @update:model-value="setTab">
        <q-tab name="customers" label="Customers" data-test-id="customers_tab_customers" />
        <q-tab name="maintenance" label="Maintenance reminders" data-test-id="customers_tab_maintenance" />
      </q-tabs>
      <q-tab-panels :model-value="activeTab" keep-alive class="q-mt-sm">
        <q-tab-panel name="customers" class="q-pa-none"><CustomerListPanel :search="search" /></q-tab-panel>
        <q-tab-panel name="maintenance" class="q-pa-none"><MaintenanceRemindersTab :search="search" /></q-tab-panel>
      </q-tab-panels>
    </template>
    <CustomerListPanel v-else :search="search" />   <!-- defensive: the route already requires customers view -->

    <CustomerDialog v-model="isCustomerDialogVisible" />
  </q-page>
</template>

<script lang="ts" setup>
const { search } = usePageSearchUrlSync('customers');   // ONE instance for both tabs (S13-R32)
const access = useMaintenanceAccess();
const showTabs = computed(() => access.canView.value);
type CustomersTab = 'customers' | 'maintenance';
const isTab = (v: unknown): v is CustomersTab => v === 'customers' || v === 'maintenance';
const activeTab = computed<CustomersTab>(() =>
  showTabs.value && isTab(route.query.tab) ? route.query.tab : 'customers');
const setTab = (tab: CustomersTab) => {
  // Keep `search`; drop the worklist's own mr_* keys when leaving it (restored from user prefs on return, S13-R42)
  const query = Object.fromEntries(Object.entries(route.query).filter(([k]) => !k.startsWith('mr_')));
  void router.replace({ query: { ...query, tab: tab === 'customers' ? undefined : tab } });
};
</script>
```
`keep-alive` on the panels stops a tab switch from re-mounting the Vuex list and losing its scroll and pagination. The
`CustomerListPanel` keeps the existing desktop/mobile split and `subscribeToLocation`. The worklist does not subscribe (S13-R28).
⚠ `CustomerListPanel` keeps reading `search` reactively. The existing `watch(search)` mobile refetch moves with it.

**Code sketch: HoverCard (hover, tap, focus)**

```vue
<!-- components/ts/shared/HoverCard.vue -->
<template>
  <span ref="anchor" role="button" tabindex="0" aria-haspopup="dialog" :aria-expanded="open"
        :aria-label="ariaLabel" :data-test-id="testId" class="hover-card__trigger"
        @mouseenter="onEnter" @mouseleave="onLeave" @focus="show" @blur="onBlur"
        @click.stop="toggle" @keydown.enter.prevent.stop="toggle" @keydown.space.prevent.stop="toggle"
        @keydown.esc.stop="hide">
    <slot name="trigger" />
  </span>
  <q-menu v-if="!isPhone" v-model="open" :target="anchor" no-parent-event no-focus
          anchor="bottom left" self="top left" class="hover-card" :data-test-id="`${testId}_card`"
          @mouseenter="cancelHide" @mouseleave="onLeave">
    <div class="hover-card__body"><slot /></div>
  </q-menu>
  <q-dialog v-else v-model="open" position="bottom" :data-test-id="`${testId}_sheet`">
    <q-card class="hover-card__sheet"><slot /></q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{ testId: string; ariaLabel: string; openDelay?: number }>(), { openDelay: 300 });
const { open, show, hide, toggle, onEnter, onLeave, onBlur, cancelHide } = useHoverCardTrigger(() => props.openDelay);
const isPhone = computed(() => useQuasar().screen.lt.sm);
</script>
```
`useHoverCardTrigger` owns the timers: delayed open on mouseenter, a 150 ms grace on leave so the pointer can travel into the card,
and a false→true transition guard the same as `ReportInfoIcon`. It is unit-tested with fake timers.

**Code sketch: VehicleTabsBar**

```vue
<template>
  <q-tabs :model-value="modelValue" horizontal indicator-color="transparent" active-color="primary"
          @update:model-value="(v) => emit('update:modelValue', v)">
    <q-route-tab v-for="tab in tabs" :key="tab.name" :data-test-id="`vehicle_tab_${tab.name}`"
                 :to="{ name: tab.path, query: { companyId } }" :name="tab.name"
                 :label="tab.name !== 'work-orders' && tab.counter > 0 ? `${tab.label} (${tab.counter})` : tab.label" />
  </q-tabs>
</template>
<script lang="ts" setup>
import type { NavigationTab } from './Model';
const props = defineProps<{ modelValue: string; tabs: NavigationTab[]; companyId?: string | null }>();
const emit = defineEmits(['update:modelValue']);
</script>
```

#### Unit / Integration tests:
Backend:
- `tests/Unit/VehicleService/Maintenance/UI/HTTP/Shared/MaintenanceAccessGateTest.php`: each guard checks its own atom; no flag lookup (no `FeatureFlagOrganizationFetcher` dependency).
- `tests/Functional/EntityEvent/Infrastructure/Dbal/DbalEntityEventWriterTest.php`: rows and refs written with org and actor; nothing written without an actor; no pending ORM entity is flushed by the call (persist an unflushed entity, call the writer, assert it is still unflushed).
- `tests/Unit/VehicleService/Maintenance/Infrastructure/Time/WorkplaceMaintenanceTodayTest.php`: a UTC instant late at night yields the previous local day for `America/Edmonton`.
- `tests/Unit/VehicleService/Maintenance/Domain/Model/ServiceNameTest.php`: case and whitespace insensitivity.

Frontend:
- `components/ts/shared/tests/QueryState.spec.ts`: error wins over pending, Retry calls `retry`, slot renders.
- `components/ts/shared/dialogs/tests/BaseFormDialog.fullscreen.spec.ts` + `BaseDialog.fullscreen.spec.ts`:
  - default → no `maximized`, card keeps `dialog-size-*` and `cardStyle` (NFR-F02);
  - prop on + `lt.sm` → maximized + `dialog-card--fullscreen`;
  - prop on + desktop → unchanged.
- `components/ts/shared/tests/HoverCard.spec.ts`: opens on hover after the delay, on focus, on Enter/Space, on click (tap); closes on Esc, blur and leave (with grace); phone renders the sheet.
- `composables/tests/useHoverCardTrigger.spec.ts` (fake timers).
- `components/ts/shared/tests/ResponsiveActionMenu.spec.ts`: desktop dropdown vs phone sheet, a disabled item shows its reason, invisible actions are not rendered, `select` is emitted.
- `components/ts/shared/tests/EditableTitle.spec.ts`: commit on Enter/blur, Esc reverts, `revertOnBlank` reverts blank, default keeps the DVI behavior (emits '').
- Existing `inspections/builder/tests/InspectionEditableText.spec.ts` and `useSortable.spec.ts` must pass unchanged.
- `components/ts/customers/tests/VehicleTabsBar.spec.ts`. Existing `components/ts/customers/tests/VehicleInvoices.spec.ts` must pass unchanged.
- `pages/tests/Customers.spec.ts` (Create or extend): customers view → tabs, Customers active by default, the list renders as today (same ids); `?tab=maintenance` selects the worklist; the search term is kept across tabs; New customer is hidden on the maintenance tab; the `mr_*` keys are dropped on a tab change.
- Existing `VehicleInvoices.spec.ts`, `Customer.spec.ts` and the `CustomerLeftSection` spec pass unchanged against the MSW defaults (NFR-F13).
- `components/ts/maintenance/shared/tests/{DueBadge,DueCell,ConfidenceMeter,formatDue,intervalFormat}.spec.ts`: every basis/precision/status combination (S9-N3, S11-R9, S11-R13, S13-R34, S3-R10, S9-R17).

#### Verification (Definition of Done gates):
- Backend: static gates, `lint:container`.
- Frontend: the per-phase FE gates above, plus:

**Browser-walk (P0):**
1. Regression, `admin` (every customers-view user now sees the tabs): `/customers` opens on the Customers tab and the list, search, New customer and the mobile layout at 390 px behave as on develop; `/customers/vehicle/<id>/work-orders?companyId=<cid>`: Work Orders, Invoices and Notes tabs work from each panel; an existing `BaseFormDialog` (New customer) on phone width is not fullscreen.
2. `/customers?tab=maintenance` shows the tab with the stub empty state. The search term carries across tabs. Console clean.
3. DVI builder `/inspection-templates/new` (DigitalInspections on): title inline edit and drag reorder unchanged.

#### E2E tests (e2e/)
Spec folder `e2e/tests/ui/maintenance-reminders/`, project `maintenance-reminders`, conventions in Section 7. **Scenarios (Create): 1 of 5 slots.**

**P0-1 `customers-maintenance-tab-shell.spec.ts`: The Customers page carries a Maintenance reminders tab and keeps the search across tabs.**
- Type: Happy path. Reqs: S13-R1, S13-R32, NFR-F01 (the moved list keeps its ids). Role: admin. Priority **P2 (page visibility)**.
- Gate 4: the real `?tab=` sync, the shared `usePageSearchUrlSync('customers')` and the Vuex list moved into a `keep-alive` panel must work together against the real list endpoint; a mock cannot show that the moved list still loads, filters and survives the tab switch.
- Preconditions: none beyond the admin session.
- Steps:
  1. Open `/customers`. Expected: `customers_tab_customers` active; `table_customers` and `button_new_customer` visible.
  2. Type a term in the page search, click `customers_tab_maintenance`. Expected: URL has `?tab=maintenance`; `button_new_customer` absent (S13-R32); the search input still holds the term.
  3. Click `customers_tab_customers`. Expected: the customer list with the same search term applied.
- Expected result: The tab shell keeps the customer list intact and shares one search across tabs.
- **Do not** assert the stub empty-state copy. P7 replaces it and the shared org may have enrolments by then.
- Page objects / factories: Extend `e2e/src/pages/customers/customers.page.ts` (`customersTab`, `maintenanceTab`, `openTab(name)`). Factories: none new.

**Backlog:** none. **Reference updates:** R0-1 to R0-6 (two edits, four verify-only). **§8 skip:** not applicable (template + route changes).

**Dev-layer (Test Layer = Dev):** QueryState error-before-pending (fe-unit, gate 3, `components/ts/shared/tests/QueryState.spec.ts`); HoverCard open/close triggers (fe-unit, `HoverCard.spec.ts`); ResponsiveActionMenu desktop vs sheet (fe-unit); EditableTitle revertOnBlank (fe-unit); DueBadge/DueCell/ConfidenceMeter every basis/status (fe-unit, `components/ts/maintenance/shared/tests/*`); `fullscreenOnPhone` default unchanged (fe-unit, `BaseFormDialog.fullscreen.spec.ts`); `MaintenanceAccessGate` each guard checks its own atom (be-unit, `MaintenanceAccessGateTest.php`); `EntityEventWriter` (be-functional).

### Phase P1: Settings: schedules

**Implements:** BE: S1–S5, S6 edit/duplicate/archive/restore, S12-R10/R13 validation. FE: S1–S6 excluding S6-R13/R14 (schedule list and editor, services, triggers, compliance services, covered services, canned-line picker, reminder rows, edit/duplicate/archive/restore). Requirement IDs traced to P1 in Section 10: S1-R1, S1-R14, S1-R2, S1-R3, S1-R4, S1-R6, S1-R7, S1-R8, S1-R9, S1-R10, S1-R12, S1-R13, S1-N1, S1-N2, S1-N3, S1-E1, S1-E2, S2-R1, S2-R2, S2-R3, S2-R4, S2-R5, S2-R6, S2-R7, S2-R8, S2-R9, S2-R10, S2-R11, S2-R15, S2-R16, S2-R17, S2-R18, S2-R19, S2-N1, S2-N2, S2-N3, S2-N4, S2-N5, S2-N6, S2-N7, S2-N8, S2-N9, S2-E1, S2-E2, S2-E3, S2-E6, S3-R1, S3-R2, S3-R3, S3-R6, S3-R7, S3-R8, S3-R9, S3-N1, S3-E2, S4-R1, S4-R2, S4-R3, S4-R4, S4-R5, S4-R6, S4-R7, S4-R8, S4-R9, S4-N1, S4-N2, S4-E1, S4-E2, S4-E3, S5-R1, S5-R2, S5-R3, S5-R4, S5-R11, S5-R12, S5-N1, S5-E1, S6-R2, S6-R3, S6-R5, S6-R6, S6-R8, S6-R11, S6-R12, S6-N1, S6-N2, S6-N3, S6-E5, S12-R10, S12-R13, S21-R1, S21-R3, S21-R4, S21-R6, S21-R7, S21-N1, S21-N2, S21-E2, NFR-001, NFR-002, NFR-012, NFR-013, NFR-015, NFR-024, NFR-F01, NFR-F03, NFR-F04, NFR-F05, NFR-F06, NFR-F07, NFR-F09, NFR-F10, NFR-F11.

**Depends on:** P0 (access gate, audit writer, `ServiceName`; FE shared pieces).

#### Database changes:
| Table | Change |
|---|---|
| `maintenance_schedule`, `maintenance_schedule_service` | Create (migration P1) |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `config/packages/doctrine.yaml` | Modify | Mapping `VehicleService_Maintenance` (TD-01) |
| `src/VehicleService/Maintenance/Domain/Model/MaintenanceSchedule.php` | Create | Root; `OrganizationIdentifierAware`, `AuditStampAware` (**not** `WorkplaceIdentifierAware`, TD-30). `static create(..., Uuid $homeWorkplaceId)`, `replace(name, list<ScheduleServiceDraft>, bool $canEditLines)` (refuses changed canned lines when false, S4-R9), `duplicateAs(string $name, Uuid $id)` (keeps `homeWorkplaceId`, S6-E5), `archive(\DateTimeImmutable)`, `restore()`. Invariants: ≥1 service, cover ids belong to this document, no cycle (DFS over `coveredServiceIds`), compliance never covers or is covered, cannot change when archived |
| `src/VehicleService/Maintenance/Domain/Model/ScheduleService.php` | Create | Child entity; position, name, kind, VOs below |
| `src/VehicleService/Maintenance/Domain/Model/ScheduleStatus.php`, `ServiceKind.php`, `Meter.php`, `TriggerOperator.php`, `CalendarUnit.php` | Create | Backed enums |
| `src/VehicleService/Maintenance/Domain/Model/TriggerSet.php`, `CalendarTrigger.php`, `MeterTrigger.php` | Create | Always-valid VOs; bounds of S2-R8, S2-R9, S2-N6, S2-N7; `toArray()/fromArray()` for the JSON column; `watches(Meter)` |
| `src/VehicleService/Maintenance/Domain/Model/ReminderOffsets.php`, `ReminderOffset.php` | Create | ≤5 rows, one `on` row, 1–365 days, no duplicates, **before < calendar interval** (S5-R3, R4, R12; days N, **months N×30**, yearly At 365; Q17 ✅ 918913025); `defaultsFor(CalendarTrigger)` leaves out the 14-before row when the interval is **≤ 14 days** (S5-R2, S5-R13); `largestBeforeDays()`; `maxBeforeDays(CalendarTrigger)` (feeds the 400 message naming the limit) |
| `src/VehicleService/Maintenance/Domain/Model/ComplianceTerm.php` | Create | type non-blank, term 1–60, remind-before ≤ term, `defaultRemindBefore(term)` (S3-R7, R8) |
| `src/VehicleService/Maintenance/Domain/Model/CannedLineRefs.php`, `CannedLineRef.php` | Create | Ordered refs with `coveredFromServiceId` |
| `src/VehicleService/Maintenance/Domain/Model/ScheduleNameTakenError.php`, `ScheduleArchivedError.php`, `InvalidScheduleError.php` | Create | `DomainError` subclasses with stable messages ("A schedule with this name already exists.") |
| `src/VehicleService/Maintenance/Domain/Model/CannedLinesLockedError.php` | Create | 403 (S4-R9, TD-31) |
| `src/VehicleService/Maintenance/Domain/Service/HomeLocationAccess.php`, `src/VehicleService/Maintenance/Infrastructure/Security/EnrolmentHomeLocationAccess.php` | Create | TD-31: `canEditLines(UserId, isAdmin, homeWorkplaceId)`; `WorkplaceFetcher::getByUserId()` + the admin-without-enrolment fallback (mirrors `AccessibleWorkplaceResolver`) |
| `src/VehicleService/Maintenance/Domain/Repository/MaintenanceScheduleRepository.php` | Create | `findById()` (org-scoped, GR-6), `save()`, `nameTaken(name, ?excludeId)` (org-wide) |
| `src/VehicleService/Maintenance/Domain/Service/ScheduleCopyNamer.php` | Create | " (Copy)", " (Copy 2)" (pattern of `DuplicateTemplateCommandHandler::uniqueCopyName()`) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Repository/Doctrine/MaintenanceSchedule.orm.xml`, `ScheduleService.orm.xml` | Create | Mappings, JSON fields, indexes of 4.1 |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Repository/Doctrine/DoctrineMaintenanceScheduleRepository.php` | Create | Extends `DoctrineRepository`; `findById()` guarded by `isOrganizationEntity()` (GR-6, TD-30) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalScheduleListFetcher.php` | Create | Org-scoped list (GR-6), tab counts, search (`EXISTS` on service name), `enrolledAssetsCount` (`0` until P2 creates the table: the sub-select is added in P2); `homeWorkplace` from an org-scoped `workplace` join; `workplaceCount` (org active workplaces, S1-R14) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalCannedLineOptionFetcher.php` | Create | `work_order_canned_line` scoped by org + the **given** workplace: the schedule's home when `schedule_id` is passed, else the header (GR-7, S4-R7; `CannedLineListQueryHandler.php:88-89` precedent); returns id, name, description, `time_estimate` as hours |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalCannedLineOwnership.php` | Create | `assertAllInWorkplace(list<Uuid>, Uuid $homeWorkplaceId)` with count check (DTO validator; A3: verified header, A4: stored home) |
| `src/VehicleService/Maintenance/Application/Command/Schedule/CreateScheduleCommand.php`, `ReplaceScheduleCommand.php`, `DuplicateScheduleCommand.php`, `ArchiveScheduleCommand.php`, `RestoreScheduleCommand.php` | Create | Pure data |
| `src/VehicleService/Maintenance/Application/Handler/Schedule/*CommandHandler.php` (5) | Create | `Transactional`; audit via `EntityEventWriter` (S21-R1: schedule edits, archive, restore). `CreateScheduleCommandHandler`: home = verified header via `VerifiedWorkplaceIdResolver` + `HomeLocationAccess`; `ReplaceScheduleCommandHandler` passes `canEditLines`; `DuplicateScheduleCommandHandler` keeps the home (TD-30, TD-31) |
| `src/VehicleService/Maintenance/Application/Query/Schedule/ListSchedulesQuery.php`, `GetScheduleQuery.php`, `ListCannedLineOptionsQuery.php` + handlers in `Application/Handler/Schedule/` | Create | Read models to DTOs |
| `src/VehicleService/Maintenance/Application/DTO/Schedule/*Dto.php` | Create | `ScheduleListItemDto`, `ScheduleDetailDto`, `ScheduleServiceDto`, `CannedLineOptionDto` |
| `src/VehicleService/Maintenance/UI/HTTP/Schedule/*Controller.php` (8) + `DTO/*RequestDto.php` | Create | Endpoints of 5.1 Settings. `ListCannedLineOptionsController` + DTO: `schedule_id` optional (org-checked), 403 without home access |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `api/maintenance/index.ts`, `queries.ts`, `MaintenanceModel.ts`, `keys.ts` | Modify | A1–A8 + `ServiceDto`, `TriggerDto`, `ReminderOffsetDto`, `ComplianceSpecDto`, `HomeWorkplace`; A8 takes `schedule_id`; keys per §2.7 (org-wide schedule keys) |
| `components/ts/administration/AdminLeftMenuNav.vue` | Modify | "Maintenance schedules" `q-route-tab` after :209, `v-if="access.canManageSchedules"`, `data-test-id="link_maintenance_schedules_tab"` (S1-R1, S1-N2) |
| `pages/Administration.vue` | Modify | asyncComponent `MaintenanceSchedules`, componentMap, `routeNameToTab: { MaintenanceSchedules: 'maintenanceSchedules' }`, AdminTab entry |
| `router/routes.ts` | Modify | admin child `maintenance-schedules`, top-level `maintenance-schedules/new` and `/:id` (§2.6) |
| `components/ts/maintenance/settings/MaintenanceSchedules.vue`, `MaintenanceSchedulesModel.ts` | Create | Active/Archived tabs with `q-badge` counts (S1-R2), `usePageSearchUrlSync('administration-maintenance-schedules')`, `Table @request` server sort (default name asc). Columns Schedule (name + "Lines from {home}" caption when `workplaceCount > 1`, S1-R14, FD-23, `data-test-id="maintenance_schedules_home_${id}"`) / Services / Assets (plain text, S1-R12). Row menu via `ResponsiveActionMenu`: Edit, Duplicate, Archive (active); Restore (archived). Archived rows open read-only (S1-R13). **No `subscribeToLocation`** (org-wide list, FD-25). Empty state "No maintenance schedules yet" + New schedule (S1-N1 wording for the list). `FilteredTableEmptyState` for search |
| `components/ts/maintenance/settings/MaintenanceSchedulesMobile.vue` | Create | Phone cards with the same home caption + the action sheet via `ResponsiveActionMenu` |
| `components/ts/maintenance/settings/ArchiveScheduleDialog.vue` | Create | `BaseDialog`, exact S6-R6 copy, red confirm, `:async-confirm` |
| `components/ts/maintenance/settings/MaintenanceScheduleEditor.vue` | Create | Route page. `EditableTitle revertOnBlank` ("Untitled schedule", S1-R3, R7, N3). Service table. Cancel/Save (Save disabled with 0 services, S1-R8). `CloseConfirmationDialog` when dirty (Cancel and `onBeforeRouteLeave`). Duplicate-name inline error from 400 `errors[{field: 'name'}]` (A3/A4 sent with `handlesValidationLocally: true`, so no extra toast) (S1-E2). 409 (archived, concurrent duplicate) → interceptor toast. Read-only keys on A2 `readOnly`. Read-only mode when archived (S1-R13): every control disabled, Restore shown. After the first Save of a new schedule the editor stays open, does `router.replace` to the schedule's `/:id` route and shows a success toast (D21, the DVI template builder's new → `/:id` pattern). Header caption "Lines from {home}" under the title (S1-R14; `data-test-id="maintenance_schedule_home_location"`); a new schedule shows the header workplace's name. Passes `canEditCannedLines` (A2; `true` for new) and `homeWorkplace` to `ServiceFormDialog` |
| `components/ts/maintenance/settings/scheduleDraft.ts` | Create | Pure: `fromDto`, `toPayload`, `isDirty(a, b)`, `addService`, `removeService` (detaches it from coverers, S6-R11), `move(from, to)`. `addService` assigns `id: crypto.randomUUID()` (kept by the BE as the service id; covered refs use it). `toPayload` copies `cannedLines` from the loaded DTO unchanged for every service when `canEditCannedLines` is false (FD-24); the covered prefill for a new service stays on, read only for a non-home user (S2-R17) |
| `components/ts/maintenance/settings/ServiceTable.vue` | Create | Columns Service / Interval / Canned Lines ("4 lines · 3 covered" with a `HoverCard`: covered services first, then lines, S4-R5). Drag via `useSortable` + Move up/down menu (S1-R10). Row menu Edit / Remove (confirm, S6-R11) |
| `components/ts/maintenance/settings/ServiceFormDialog.vue` | Create | `BaseFormDialog fullscreenOnPhone :auto-close-on-confirm="false" :async-submit`. Steps in order (S2-R2): name; compliance switch (S3-R1); `TriggerBlock` or `ComplianceBlock` (S3-R2); `CoveredServicesStep` (only when ≥1 other routine service and not compliance, S2-R18); `CannedLinesStep`; `ReminderTimingRows` or Remind before expiry (S5-R11). Edit/remove confirmations over the form (S6-R11). Props `canEditCannedLines`, `homeWorkplaceName`, `workplaceCount` forwarded to `CannedLinesStep` |
| `components/ts/maintenance/settings/CannedLinesStep.vue` | Create | **New file** (was inline in `ServiceFormDialog`): empty state (S4-R4), selected lines list + reorder, Add canned lines → `CannedLinePickerDialog`. Helper "Set up at {home}, where this schedule was built. Other locations add the same work at their own rates" when `workplaceCount > 1` (S4-R8; `data-test-id="maintenance_canned_lines_home_helper"`). Read-only mode (FD-24, S4-R9): no add/remove/reorder, `useSortable` disabled, (i) `HoverCard` `maintenance_canned_lines_readonly_info` |
| `components/ts/maintenance/settings/TriggerBlock.vue`, `IntervalRow.vue` | Create | Locked calendar checkbox with a HoverCard (S2-R4). Mileage/hours checkboxes reveal rows (S2-R5, E1). Every/At (S2-R6). Calendar At = day+month picker (S2-R7, N7). Days/months from a list (S2-R8). One plain line "Comes due at whichever trigger arrives first" (S2-R11). Digits-only `Input` (S2-N5) |
| `components/ts/maintenance/settings/ComplianceBlock.vue` | Create | Type (free text + (i) HoverCard examples, S3-R3); term 1–60 list (S3-R7); Remind before expiry with defaults 1/2 months and a ≤ term rule (S3-R8). No dates (S3-R9) |
| `components/ts/maintenance/settings/CoveredServicesStep.vue` | Create | Multi-select of the schedule's other routine services minus cycles (S2-R16, N8, N9), the guidance line (S2-R19), pre-fills covered lines marked "from PM-A" (S2-R17) |
| `components/ts/maintenance/settings/ReminderTimingRows.vue` | Create | 3 defaults (S5-R2), the 14-before default left out while the interval is 14 days or less and the rows are untouched (S5-R13, FD-28); due row delete disabled (S5-R3); max 5 → Add reminder disabled (S5-R4); 1–365, no duplicates, a before row shorter than the calendar interval (S5-R12); beneath the rows, at an interval of 14 days or less, the limit note `maintenance_reminder_interval_limit_note` (S5-R13) |
| `components/ts/maintenance/settings/serviceFormRules.ts` | Create | Pure validation: whole numbers ≥1, caps 999,999 / 99,999 / 999 (S2-R9, N2, N6); >12 months → days; the cycle check; reminder rules; compliance rules. `intervalDays()` (days N / months N × 30 / yearly 365; Q17 ✅ 918913025) and `beforeRowRule` (`< intervalDays`, S5-R12); `defaultReminderRows(intervalDays)` drops the 14-before row at `intervalDays ≤ 14` (S5-R13, FD-28) |
| `components/ts/maintenance/settings/CannedLinePickerDialog.vue` | Create | `BaseFormDialog fullscreenOnPhone`: search, multi-select list showing **hours** (S4-R2), selected list ordered + drag (S4-R3), no create (S4-E3). Empty state "No lines on this service yet" + button (S4-R4, on the form). Prop `scheduleId: UUID \| null` → A8 `schedule_id` (S4-R7); no location control |

#### Key code changes:
The tables above are the change list. One sketch, for the S4-R8/S4-R9 step:

```vue
<!-- CannedLinesStep.vue (abridged) -->
<div v-if="workplaceCount > 1" class="text-caption" data-test-id="maintenance_canned_lines_home_helper">
  Set up at {{ homeWorkplaceName }}, where this schedule was built. Other locations add the same work at their own rates
</div>
<template v-if="canEditCannedLines">
  <Button label="Add canned lines" data-test-id-suffix="maintenance_add_canned_lines" @click="pickerOpen = true" />
</template>
<HoverCard v-else test-id="maintenance_canned_lines_readonly_info" aria-label="Why these lines are read only">
  <template #trigger><q-icon name="info" /></template>
  These lines belong to {{ homeWorkplaceName }}. Only someone with access to {{ homeWorkplaceName }} can change them.
</HoverCard>
<ol ref="listEl"> <!-- useSortable(listEl, { disabled: () => !canEditCannedLines }) --> … </ol>
```

#### Unit / Integration tests:
Backend:
- Unit `tests/Unit/VehicleService/Maintenance/Domain/Model/MaintenanceScheduleTest.php`: create needs a service; cover cycle A→B→A rejected; indirect cycle rejected; compliance cannot cover or be covered; removing a covered service drops the ref and keeps copied lines; archived cannot be replaced or duplicated; restore of an active schedule rejected; an archived schedule's name stays taken (a new schedule with that name → `nameTaken()` true), so restore needs no name check; replace with `canEditLines=false` and changed lines → `CannedLinesLockedError` while other fields still change; duplicate keeps the home; the name check is org-wide.
- Unit `TriggerSetTest`, `CalendarTriggerTest`, `MeterTriggerTest`, `ReminderOffsetsTest` (defaults: 13 and 14 days drop the 14-before row, 15 keeps it; before = interval refused, interval − 1 accepted; 1-month interval → 29 accepted, 30 refused; due row required; max five; duplicates), `ComplianceTermTest`.
- Unit `ScheduleCopyNamerTest`: Copy, Copy 2, Copy 3 when taken.
- Unit `EnrolmentHomeLocationAccessTest`: enrolled, not enrolled, admin without enrolments.
- Unit handler tests for create/replace/duplicate/archive/restore (repository fake, audit spy).
- Functional `tests/Functional/VehicleService/Maintenance/UI/HTTP/ScheduleEndpointsTest.php`: CRUD round trip; 400 duplicate name (`errors[{field: name}]`), 409 on a concurrent duplicate; 403 without `ROLE_ORGANIZATION::CREATE_AND_EDIT`; a before row equal to a 7-day interval → 400 `errors[{field: 'services[0].reminder_offsets[0].days'}]`; B's schedule is listed and readable from A with `homeWorkplace` = B (GR-6); another org's → 404; PUT from A by a user not enrolled at B: lines unchanged → 200, lines changed → 403; A8 `schedule_id` of B without B access → 403, with → B's lines; A3 under a header the user is not enrolled in → 403; duplicate from A keeps home B; "PM" at B blocks "PM" at A (400); a canned line from a workplace other than the home in the body → 404; list search by service name; archived detail `readOnly`.

Frontend:
- `scheduleDraft.spec.ts`: `toPayload` leaves `cannedLines` untouched in read-only mode; `addService` assigns a `crypto.randomUUID()` id that is kept on save, covered refs between unsaved services survive `toPayload`, dirty diff, reorder, removal of a covered service detaches it from coverers but keeps the lines copied into them.
- `serviceFormRules.spec.ts`: every number rule, the cycle check with an indirect cycle, reminder rules, compliance remind > term message, S5-R12/R13 boundaries: every 7 days → before 1–6 accepted, 7 refused; every 14 days → defaults have no 14-before row; every 15 days → the 14-before row is present; every 1 month → before 29 accepted, 30 refused; every 3 months → 89 accepted, 90 refused; yearly At → 364 accepted.
- `ReminderTimingRows.spec.ts`: the note shows at 7 and 14 days with the interval in the text and is absent at 15 days and for months; untouched defaults follow an interval change across 14 days (row removed, then restored); after a row edit nothing is added or removed automatically and the inline refusal shows.
- `intervalFormat.spec.ts` extended.
- Component specs with MSW:
  - `MaintenanceSchedules.spec.ts`: tabs + counts, search, menu by status, archive confirm copy, restore; the home caption appears only when A1 `workplaceCount > 1`, desktop and mobile alike; no `subscribeToLocation` subscription;
  - `MaintenanceScheduleEditor.spec.ts`: Save disabled at 0 services, a blank rename reverts, the duplicate-name error inline from 400 `errors[{field: 'name'}]` with no toast (`handlesValidationLocally`), dirty Cancel confirm, archived read-only; a new schedule's caption names the header workplace; an existing one names A2 `homeWorkplace`; `canEditCannedLines` is passed through;
  - `CannedLinesStep.spec.ts` (new): the helper only when `workplaceCount > 1`; read-only shows no Add/remove/move and has the (i) copy; `useSortable` is disabled;
  - `ServiceFormDialog.spec.ts`: compliance swaps the blocks, the covered step is hidden on the first service, the failed save keeps the dialog open;
  - `CannedLinePickerDialog.spec.ts`: shows hours, never price; sends `schedule_id` when set and nothing when null; no location control.
- `AdminLeftMenuNav.spec.ts` (extend): the nav item needs settingsService only; it does not depend on DigitalInspections.

#### Verification (Definition of Done gates):
- Backend: standard + migration gate + smoke (`/api/maintenance/schedules`, `/api/maintenance/canned-lines`).
- Frontend: the per-phase FE gates above, plus:

**Browser-walk (P1):**
1. `admin`:
   - `/administration/maintenance-schedules`: empty state;
   - New schedule → `/maintenance-schedules/new`: title "Untitled schedule", rename to blank reverts, Save disabled;
   - add a routine service with mileage + At-calendar, then a second service covering the first (lines prefilled "from …"), then a compliance service (no covered step, Remind before expiry);
   - add a routine service with calendar Every 7 days → the reminder rows show no 14-before row and the note "A reminder before the due date must be shorter than the 7-day interval"; adding a before row of 7 days is refused inline; switch to Every 15 days → the 14-before row comes back (untouched defaults) (S5-R12, S5-R13);
   - drag + Move up/down; Save; a duplicate name shows the inline error;
   - Duplicate → "(Copy)"; Archive → red confirm with the exact copy; Archived tab → open read-only → Restore.
1b. Org with ≥2 workplaces:
   - The list shows "Lines from {home}" under every name. Switch the header location to B and the same schedules stay listed.
   - Open a schedule built at A while the header is at B. The canned-lines step reads "Set up at A…". The picker lists A's lines (Network shows `schedule_id=`).
   - Duplicate it from B. The copy still reads "Lines from A".
   - For a user without access to A (temporarily remove the admin's access to A in Settings › Users, then restore it): the step is read only with the (i), and the name and triggers stay editable.
   - Org with one workplace: no caption anywhere.
2. Phone width 390 px: the service form is fullscreen, the row menu is an action sheet.
3. `tech` (no settingsService): no nav item, and a direct URL is denied.

#### E2E tests (e2e/)
Spec folder `e2e/tests/ui/maintenance-reminders/`, project `maintenance-reminders`, conventions in Section 7. **Scenarios (Create): 4 of 5 slots (ranked).**

**P1-1 `schedule-create.spec.ts`: Admin builds a schedule with a routine and a compliance service and saves it.**
- Type: Happy path. Reqs: S1-R1, S1-R14, S4-R7, S1-R3, S1-R4, S1-R6, S1-R8, S1-R9, S2-R1, S2-R2, S2-R4, S2-R5, S2-R6, S2-R11, S3-R1, S3-R2, S3-R3, S3-R7, S3-R8, S4-R1, S4-R2, S4-R3, S4-R6, S5-R1, S5-R2, S1-R12 (Assets column "0"). Role: admin. Priority **P3**.
- Preconditions: One canned line "MR-E2E Oil change <ts>" exists in the header workplace (`workOrderFactory.createCannedLineFromLine`).
- Steps:
  1. Settings → `link_maintenance_schedules_tab`. Expected: `table_maintenance_schedules` (or the empty state) on the Active tab. Read `MaintenanceFactory.listSchedules` → `workplaceCount`.
  2. `button_maintenance_schedules_new`. Expected: URL `/maintenance-schedules/new`, title "Untitled schedule", Save disabled.
  3. Rename the title to `MR-E2E PM <ts>`.
  4. Add service "PM-A": calendar Every 6 months + mileage Every 10,000; Add canned lines → search → pick the line (the picker shows hours, no price); save the form. Expected: a row "PM-A", interval "10,000 mileage · 6 months", "1 line"; 3 default reminder rows were shown in the form (14 before / on / 7 after).
  5. Add service "Annual inspection" and switch the compliance toggle on: type "CVIP", term 12. Expected: the trigger block is replaced; Remind before defaults to 1 month; no covered step.
  6. Save. Expected: the editor stays open, the URL becomes `/maintenance-schedules/<id>` (`toHaveURL(/maintenance-schedules\/[0-9a-f-]{36}$/)`, D21) and a success toast shows. Back on the list the row shows Services 2 and Assets 0; when `workplaceCount > 1`, `maintenance_schedules_home_<id>` reads "Lines from <header workplace name>", otherwise it is absent.
  7. Reload the editor. Expected: both services, triggers and lines persisted.
- Expected result: The schedule document round-trips through the real BE with both service kinds intact.
- Page objects / factories: Create `e2e/src/pages/administration/maintenance-schedules.page.ts`, `maintenance-schedule-editor.page.ts`; dialogs `e2e/src/pages/dialogs/maintenance-service-form.dialog.ts`, `maintenance-canned-line-picker.dialog.ts`. Extend `base-administration.page.ts` with `navigateToMaintenanceSchedules()`. Factories: `workOrderFactory.createCannedLineFromLine`; `MaintenanceFactory.archive` for cleanup.

**P1-2 `schedule-edit-covering.spec.ts`: Admin adds a covering service and reorders services on an existing schedule.**
- Type: Happy path (edit). Reqs: S2-R16, S2-R17, S2-R18, S2-R19, S1-R10, S4-R5, S6-R11, S6-R3, S1-R8. Role: admin. Priority **P3**.
- Gate 4: covered-line prefill draws on real canned-line data, and the order and covered refs have to survive real persistence.
- Preconditions: Schedule via API with one routine service "PM-A" holding 2 canned lines.
- Steps:
  1. Open the schedule. Add a service "PM-B"; the covers step lists "PM-A"; tick it. Expected: PM-A's 2 lines arrive marked "from PM-A".
  2. Save the form. Expected: the PM-B row reads "2 lines · 2 covered"; keyboard focus / Enter on `maintenance_service_lines_<key>` opens the hover card listing PM-A, then the lines.
  3. `maintenance_service_action_move_up_<PM-B>`. Save the schedule. Reload. Expected: PM-B is first and still covers PM-A.
  4. Remove PM-A with the confirm. Save. Reload. Expected: PM-B keeps its 2 lines, and the covered count is 0.
- Expected result: Covering, reorder and removal persist exactly as edited.
- Page objects / factories: As P1-1. Use Move up/down, never drag (drag is flaky).

**P1-3 `schedule-lifecycle.spec.ts`: Admin duplicates, archives and restores a schedule.**
- Type: Happy path (lifecycle). Reqs: S6-R12, S6-E5, S6-R5, S6-R6 (copy + confirm), S6-R8, S1-R2 (tabs + counts), S1-R13, S1-E1. Role: admin. Priority **P3**.
- Preconditions: Schedule `MR-E2E Fleet <ts>` via API.
- Steps:
  1. Row menu → Duplicate. Expected: the editor opens on "MR-E2E Fleet <ts> (Copy)"; the copy's home caption (when shown) equals the original's (S6-E5). Save/close.
  2. Row menu on the original → Archive. Expected: `dialog_maintenance_archive_schedule` with the exact S6-R6 red copy; confirm.
  3. Archived tab. Expected: the row is present; the Active and Archived badge counts changed by ±1 against the values read in step 0 (deltas only).
  4. Open the archived row. Expected: every control disabled, only Restore offered.
  5. Restore. Expected: the row is back on Active.
- Expected result: The archive and restore lifecycle and the read-only state are driven by real server status.
- Page objects / factories: Dialog: `e2e/src/pages/dialogs/maintenance-archive-schedule.dialog.ts`.

**P1-4 `schedule-settings-role-gate.spec.ts`: A user without Settings Service cannot reach Maintenance schedules.**
- Type: Edge case (role gate). Reqs: S1-N2. Role: technician (`loggedInAsTechnician`) or a fresh custom role without `settingsService` (preferred: `ReportRoleSeeder` / `custom-role.fixtures.ts`, since the local stack has no technician). Priority **P2**.
- Gate 4: a real permission set from the real login. Also probes `GET /api/maintenance/schedules` from that session and expects 403.
- Preconditions: `expectAuthenticatedShell(page)` before any absence assertion (AGENTS.md local-cookie trap).
- Steps:
  1. As the restricted user, open Settings. Expected: no `link_maintenance_schedules_tab`.
  2. Deep-link `/administration/maintenance-schedules`. Expected: redirected away (first permitted route / Error), and no `table_maintenance_schedules`.
- Expected result: The tab cannot be reached without settingsService, in the UI or the API.

**Backlog:** one: a user without access to the schedule's home location sees its canned lines read only, with the (i), and can still edit the name and triggers (S4-R9, S4-R8, S1-R14) → `schedule-home-location-readonly.spec.ts` (needs ≥2 workplaces and a user scoped to one; Section 7 Backlog). **Reference updates:** R1-1 to R1-4 (verify-only). **§8 skip:** n/a.

**Dev-layer (Test Layer = Dev):** duplicate-name inline error (S1-E2): fe-unit (gate 3, `MaintenanceScheduleEditor.spec.ts`) + be-functional (`ScheduleEndpointsTest.php` 400/409). Blank title reverts (S1-N3), Save disabled with 0 services (S1-N1/R8): fe-unit. Number/trigger bounds (S2-R7..R9, N1..N7), reminder rows (S5-R3, R4, R12, R13: limit note and dropped default), compliance remind ≤ term (S3-R8): fe-unit `serviceFormRules.spec.ts` + be-unit VO tests. Cycle check (S2-N9), compliance never covers (S2-N8): be-unit `MaintenanceScheduleTest.php` + fe-unit. Search by service name, sort (S1-R2): be-functional. Org-wide list, home-location edit rights, org-wide names (S1-R1, S1-E2, S4-R9, S6-E5): be-functional `ScheduleEndpointsTest` (a schedule from workplace B is listed and readable at A; another org's → 404). S4-R9 read-only: fe-unit `CannedLinesStep.spec.ts` + be-functional A4 refusal. S4-R7 home lines: be-functional A8 `schedule_id`. S6-E5: be-unit. Canned lines show hours not price (S4-R2): fe-unit `CannedLinePickerDialog.spec.ts`. Nav item needs settingsService only (S1-N2): fe-unit `AdminLeftMenuNav.spec.ts`. Phone fullscreen form / action sheet (NFR-F10): fe-unit.

### Phase P2: Enrolment, certificates, customer setting

**Implements:** BE: S6 archive effects and removal, S7, S8, S21-R7. FE: S7, S8, S7-R13..R22, S6-R5..R8 effects (S6-R13/R14 endpoint here; its UI in P5). Requirement IDs traced to P2 in Section 10: S1-R12, S6-R1, S6-R2, S6-R4, S6-R6, S6-R7, S6-R13, S6-R14, S6-N1, S6-N2, S6-E1, S6-E2, S6-E3, S6-E4, S7-R1, S7-R2, S7-R4, S7-R6, S7-R7, S7-R8, S7-R9, S7-R10, S7-R13, S7-R14, S7-R15, S7-R17, S7-R18, S7-R19, S7-R20, S7-R21, S7-R22, S7-R23, S7-R24, S7-R25, S7-R26, S7-N2, S7-N4, S7-N5, S7-N6, S7-N7, S7-E1, S7-E2, S7-E3, S7-E4, S7-E5, S7-E7, S7-E8, S8-R2, S8-R3, S8-R4, S8-R5, S8-R6, S8-R7, S8-R8, S8-R9, S8-R10, S8-R11, S8-R12, S8-R13, S8-N1, S8-N3, S8-E1, S8-E2, S8-E4, S21-R1, S21-R3, S21-R4, S21-R6, S21-R7, S21-N1, S21-N2, S21-E2, NFR-001, NFR-002, NFR-009, NFR-012, NFR-013, NFR-015, NFR-018, NFR-F01, NFR-F04, NFR-F05, NFR-F06, NFR-F07, NFR-F09, NFR-F10, NFR-F11.

**Depends on:** P1 (schedules to enrol in; `ArchiveScheduleCommandHandler` and `DbalScheduleListFetcher` are extended here).

#### Database changes:
| Table | Change |
|---|---|
| `maintenance_enrolment`, `maintenance_enrolled_service`, `maintenance_compliance_record`, `maintenance_compliance_record_attachment`, `maintenance_service_completion` | Create (migration P2) |
| `company` | `ADD COLUMN maintenance_notifications TINYINT(1) NOT NULL DEFAULT 1, ALGORITHM=INSTANT` (same migration) |
| `ExpressionIndexFilteringMySQLSchemaManager::MANUALLY_MANAGED_FOREIGN_KEYS` | Add the two P2 hand FKs |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/Domain/Model/Enrolment.php`, `EnrolledService.php`, `EnrolmentEndReason.php` | Create | `Enrolment::enrol(schedule, vehicleId, companyId, list<EnrolledServiceInput>, today)` copies services (cover ids re-pointed to sibling copies), sets initial anchors, copies the schedule's `home_workplace_id`; **no `backlog_suppressed`** (D24); `end(reason, by, at)`; `EnrolledService::skip()/unskip()` (used P5) |
| `src/VehicleService/Maintenance/Domain/Model/ComplianceRecord.php`, `ComplianceRecordAttachment.php`, `CertificatePeriod.php` | Create | `CertificatePeriod::from(term, ?startOn, ?endOn)` per TD-33 (sketch below): Start + term → End, End − term → Start (`CalendarMath::addMonthsClamped/subMonthsClamped`; same day number, a missing day → the month's last day, both directions, S8-R10); typed beats derived; neither date → error (S8-R10, R11, E2). `ComplianceRecord::correct()` refuses non-current (caller passes `isCurrent`) ; `attach()` / `removeAttachment()` |
| `src/VehicleService/Maintenance/Domain/Model/ServiceCompletion.php`, `CompletionPath.php` | Create | Root; `atEnrolment()` (S7-E1 done), later factories in P6; `undo()` |
| `src/VehicleService/Maintenance/Domain/Repository/EnrolmentRepository.php`, `ComplianceRecordRepository.php`, `ServiceCompletionRepository.php` | Create | Ports |
| `src/VehicleService/Maintenance/Domain/Repository/AssetOwnership.php` | Create | `vehicleInOrganization()`, `isLinked()`, `linkedVehicleIds(companyId, list<Uuid>)` |
| `src/VehicleService/Maintenance/Domain/Repository/LastServicePrefill.php` | Create | Latest effective completion date per normalized name for a vehicle (S7-R4) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Repository/Doctrine/Enrolment.orm.xml`, `EnrolledService.orm.xml`, `ComplianceRecord.orm.xml`, `ComplianceRecordAttachment.orm.xml`, `ServiceCompletion.orm.xml` | Create | Mappings |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Repository/Doctrine/DoctrineEnrolmentRepository.php`, `DoctrineComplianceRecordRepository.php` | Create | `isOrganizationEntity()`-guarded `findById()` |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Repository/Dbal/DbalServiceCompletionRepository.php` | Create | TD-08 |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalAssetOwnership.php`, `DbalLastServicePrefill.php`, `DbalEnrolmentPreviewFetcher.php`, `DbalBulkEnrolmentPreviewFetcher.php`, `DbalComplianceRecordListFetcher.php`, `DbalMaintenanceEnrolmentCounter.php` | Create | Reads of 5.1; bulk preview searches `vehicle` + `vehicle_type` + maker by the company's links (`vehicle_company` here is the customer's own asset list, not the worklist) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Dbal/DbalBulkEnrolmentWriter.php` | Create | Chunked multi-row INSERTs for enrolments and enrolled services (TD-20) |
| `src/VehicleService/Maintenance/Infrastructure/Storage/ComplianceStoragePathBuilder.php`, `src/VehicleService/Maintenance/Domain/Model/ComplianceAttachmentMimeTypes.php` | Create | TD-13 |
| `src/VehicleService/Maintenance/Application/Command|Handler/Enrolment/EnrolVehicleCommand(+Handler)`, `BulkEnrolVehiclesCommand(+Handler)`, `RemoveEnrolmentCommand(+Handler)` | Create | `Transactional`; audit; recompute hook added in P4. Schedule via org-scoped `findById()`; no header-location check (S7-R1, GR-6) |
| `src/VehicleService/Maintenance/Application/Handler/Schedule/ArchiveScheduleCommandHandler.php` | Modify | After `archive()`: set-based `UPDATE maintenance_enrolment SET ended_at, end_reason='schedule_archived' WHERE schedule_id AND ended_at IS NULL` (org-bound), returns the count; projection delete added in P4 |
| `src/VehicleService/Maintenance/Application/Command|Handler/ComplianceRecord/AddComplianceRecord…`, `CorrectComplianceRecord…`, `AttachCertificate…`, `RemoveCertificate…` | Create | `Transactional`; record changes clear compliance skips (P5 adds) and recompute (P4 adds) |
| `src/VehicleService/Maintenance/Application/Query|Handler/Enrolment/*`, `ComplianceRecord/*` + DTOs | Create | Previews, list, download |
| `src/VehicleService/Maintenance/UI/HTTP/Enrolment/*Controller.php`, `UI/HTTP/ComplianceRecord/*Controller.php` + DTOs | Create | A9–A14, A17–A20; DTO validators per the inbound-id table |
| `src/VehicleService/Maintenance/Application/Query/Enrolment/GetEnrolmentContextQuery.php` + handler, `Infrastructure/Persistence/Query/Dbal/DbalEnrolmentContextFetcher.php` | Create | A9: linked customers (≤50, `customer_search`, `customersTotal`, `customersTruncated`) with `maintenanceNotifications`/`hasEmail` (= EXISTS a contact of that company with a non-empty email, S7-R20); **every active schedule of the organization** (GR-6, S7-R1) with `alreadyOn` and `homeWorkplaceName`; top-level `workplaceCount`; `hasAnySchedule`, `canManageSchedules` |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalScheduleListFetcher.php` | Modify | `enrolledAssetsCount` sub-select over active enrolments |
| `src/Customer/Customers/Domain/Company.php` | Modify | `bool $maintenanceNotifications = true`; `changeMaintenanceNotifications(bool): bool` (returns whether it changed) |
| `src/Customer/Customers/Infrastructure/Doctrine/Company.orm.xml` | Modify | Field `maintenanceNotifications` boolean default 1 |
| `src/Customer/Customers/Domain/Service/MaintenanceEnrolmentCounter.php` | Create | Port (implemented by `DbalMaintenanceEnrolmentCounter`): `countEnrolledUnits(companyId)` (S7-R19) only. No `countUnitsWithoutContactEmail()` (Q11: the FE derives has-email from A16 `contacts[]`) |
| `src/Customer/Customers/Application/Command/MaintenanceNotification/ChangeMaintenanceNotificationsCommand.php` + `Application/Handler/MaintenanceNotification/ChangeMaintenanceNotificationsCommandHandler.php` | Create | `Transactional`; `Company` loaded through the org-scoped repository; `entity_event` of type `COMPANY_MAINTENANCE_NOTIFICATIONS` with old/new (S21-R7); no accounting outbox row |
| `src/Customer/Customers/UI/HTTP/MaintenanceNotification/ChangeMaintenanceNotificationsController.php` + `DTO/` | Create | A15 `PATCH`; atom check; response `{maintenanceNotifications, affectedUnitsCount}` |
| `src/Customer/Customers/Application/View/ViewQueryHandler.php` | Modify | A16: select and cast `maintenance_notifications`; add `maintenance_enrolled_units_count` (port `MaintenanceEnrolmentCounter`). No email field: the FE derives it from `contacts[]` |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `api/maintenance/*` | Modify | A9–A14, A17–A20 (camelCase response types) |
| `api/companies/CompaniesModel.ts`, `index.ts`, `queries.ts` | Modify | A15 `companiesApi.setMaintenanceNotifications` (**PATCH**, response `{maintenanceNotifications, affectedUnitsCount}`), `useSetMaintenanceNotificationsMutation` (invalidates `companyKeys.detail` + `maintenanceKeys.all`), A16 snake_case fields (`maintenance_notifications`, `maintenance_enrolled_units_count`) on `CustomerCompanyView` |
| `components/ts/maintenance/enrolment/EnrolmentDialog.vue` | Create | `BaseFormDialog fullscreenOnPhone`, static title "Enroll in schedule" (S7-R7), `mode: 'asset' \| 'bulk' \| 'workOrder'` (workOrder reserved for Plan 2). Body: unit + customer at normal weight (S7-R7); `EnrolmentCustomerSelect` (S7-R23); schedule `Select` listing every org active schedule (A9) with an `#option` slot rendering "Lines from {homeWorkplaceName}" when `workplaceCount > 1` (S7-R1, S1-R14, E8; option id `maintenance_enrolment_schedule_option_${id}`); per-service rows (S7-R2, R4) or `EnrolmentAssetsSection` (bulk); notification checkbox (S7-R13, R19, R20, E7); the confirmation copy in both halves (S7-R10). Beneath the notification checkbox, when the chosen customer's A9 `hasEmail` is false and the setting is on: the S7-R20 note + Add contact (FD-29; `maintenance_enrolment_no_email`, `button_maintenance_enrolment_add_contact`); `ContactDialog` stacks over the enrolment dialog and, on save, refetches A9 so the note clears. No-schedules state with a "Create a schedule" link to `MaintenanceScheduleEditorNew` when `access.canManageSchedules` (S7-N6) |
| `components/ts/maintenance/enrolment/EnrolmentCustomerSelect.vue` | Create | Searchable `Select` (`use-input`). Client filter over A9 `customers[]` (≤50). When `customersTruncated`, typing (debounced 300 ms, ≥2 chars) re-keys `useEnrolmentContextQuery` with `customer_search` (server search), and a caption reads "Showing 50 of {customersTotal}. Type to search." Preselected and shown as text when there is exactly one (S7-R23). Choosing a customer re-keys A9 with `company_id` so `schedules[].alreadyOn` is correct (S7-E8). Placeholder assets carry up to 1,486 customer links (production data) |
| `components/ts/maintenance/enrolment/EnrolmentServiceRow.vue` | Create | Name, "(optional)" inline (S7-R8), `DateInput` with prefill + max today (S7-R4), "Blank counts from today" hint, Needs mileage/engine hours reading badge (S7-R15), meter-At-passed choice "Mark as done" (default) / "Leave due" (S7-E1), compliance record line "{number} · ends {endDate}" or "No record" + "+ Add record" (S7-R6) opening `CertificateFields` inline |
| `components/ts/maintenance/enrolment/EnrolmentAssetsSection.vue` | Create | Checkbox list + Select all over the A12 list (unpaged, ≤2,500) + a search box sent to the **server** (`search`, debounced, re-keys `bulkPreview`) matching type/make/unit/VIN (S7-R24: every asset of that customer; there is no inactive state). Greyed "Already on this schedule" from `alreadyOn` (S7-R25). "{n} of {m} have a last service on record; the rest count from today" computed from the ticked assets' `hasHistory` (header uses `withHistoryCount` before any tick) (S7-R26). `truncated` → caption "Showing {assets.length} of {total}. Search to narrow." Selections survive a search change (kept by `vehicleId`). Confirm label "Enroll N assets". Toast after submit uses A13 `enrolledCount` / `skippedAlreadyOn.length` |
| `components/ts/maintenance/compliance/CertificateFields.vue` | Create | Embeddable form body (no dialog): type (prefilled from the service), term, **Start date** (`DateInput`), **End date** (`DateInput`), Certificate number (S8-R3, R4), attachment. Half/full widths (S8-R6). Derivation via `certificateDates.ts` (S8-R10, R11). `v-model` = `CertificateInput` (GR#7). Optional prop `defaultStartDate?: DateString` (used by Mark complete, S18-R5) applied while Start is untouched. Ids: `input_maintenance_certificate_start${idSuffix}`, `input_maintenance_certificate_end${idSuffix}`, `input_maintenance_certificate_number${idSuffix}`, `select_maintenance_certificate_term${idSuffix}`. Optional prop `idSuffix?: string` (default `''`) appended to every `data-test-id` / `data-test-id-suffix` it renders: `input_maintenance_certificate_*${idSuffix}`, `select_maintenance_certificate_term${idSuffix}`. Absent, the ids are byte-identical to the §7.4 list. No caller in Plan 1 passes it; Plan 2's step after invoicing renders N instances |
| `components/ts/maintenance/compliance/tests/CertificateFields.spec.ts` | Modify (P2 spec) | Ids unchanged without the prop; every id suffixed with `idSuffix="_abc"` |
| `components/ts/maintenance/compliance/certificateDates.ts` | Create | Pure: Start + term → End; End − term → Start; typed wins; both days; month arithmetic = same day number, clamped to the month's last day (S8-R10: 14 Oct 2025 + 12 months = 14 Oct 2026; 31 Jan + 1 month = last day of February); neither date → invalid (S8-R10, R11, E2). Its result is a *preview*. BE stays authoritative |
| `components/ts/maintenance/compliance/CertificateAttachmentField.vue` | Create | `useFilePicker` (accept pdf/jpeg/png, ≤10 MB client check), file chip with open/replace/remove (S8-R9) |
| `components/ts/maintenance/compliance/CertificateRecordDialog.vue` | Create | `BaseFormDialog fullscreenOnPhone` wrapping `CertificateFields`. Modes add/edit-current; read-only history list beneath (S8-R7, R12) |
| `components/ts/maintenance/compliance/ComplianceSection.vue` | Create | Asset card section: "CVIP · AB-4471902 · ends 14 Oct 2026" per current record (`formatOrgDate(endDate)`), each opening the record dialog, plus "+ Add record" (`canEditCustomerSide`) (S8-R13, N1, N3) |
| `components/ts/customers/VehicleInvoices.vue` | Modify | New `q-card` after the Preferred Contact card (:174-210) mounting `ComplianceSection` (async, `v-if="access.canView"`) |
| `components/ts/customers/CustomerMaintenanceNotificationsToggle.vue` | Create | `q-toggle` "Maintenance notifications" with `useAsyncAction` re-entrancy guard. Off → inline "N enrolled units will not receive reminders" (S7-R19). On + no contact of the customer has an email (FD-29, from A16 `contacts[]`) → "None of this customer's contacts has an email address, so no reminder can be sent." (`maintenance_customer_notifications_no_email`) + `Button` "Add contact" (`data-test-id-suffix="maintenance_customer_add_contact"`, `canEdit('customers')` only) opening `ContactDialog` with `:company-id` (S7-R20). Disabled without `canEdit('customers')` (S7-R22) |
| `components/ts/customers/CustomerLeftSection.vue` | Modify | Mounts the toggle (async, `v-if="access.canView"`). The first live control on that card (S7-R18) |
| `components/ts/customers/Customer.vue` | Modify | "Enroll in Schedule" `Button` beside New Asset (:140-147), `v-if="access.canEditCustomerSide"`, `data-test-id-suffix="maintenance_enroll_in_schedule"`. Opens `EnrolmentDialog mode="bulk"` (S7-R24, N7) |

#### Key code changes:
Frontend:

**Code sketch: enrolment modal (single + bulk, searchable customer chooser)**

```vue
<!-- EnrolmentDialog.vue (abridged) -->
<BaseFormDialog v-model="isDialogVisible" fullscreen-on-phone :auto-close-on-confirm="false" :async-submit="submit"
  title="Enroll in schedule" :confirm-button-text="confirmLabel" :disable-confirm-button="!canSubmit"
  data-test-id-suffix="maintenance_enrolment" confirm-button-test-id="button_maintenance_enrolment_confirm">
  <template #form-content>
    <QueryState test-id-prefix="maintenance_enrolment" subject="schedules" :is-pending="context.isPending.value"
                :has-error="contextError" :retry="context.refetch">
      <div v-if="!context.data.value?.hasAnySchedule" data-test-id="maintenance_enrolment_no_schedules"> … Create a schedule (when canManageSchedules) … </div>
      <template v-else>
        <div class="text-body2">{{ assetLabel }} · {{ selectedCustomerName }}</div>
        <EnrolmentCustomerSelect v-if="mode !== 'bulk'" v-model="companyId" v-model:search="customerSearch"
                                 :customers="context.data.value.customers" :truncated="context.data.value.customersTruncated"
                                 :total="context.data.value.customersTotal" />
        <Select v-model="scheduleId" :options="scheduleOptions" label="Schedule" emit-value map-options
                data-test-id-suffix="maintenance_enrolment_schedule" />
        <template v-if="mode === 'bulk'">
          <EnrolmentAssetsSection v-model="selectedVehicleIds" v-model:search="assetSearch" :preview="bulkPreview.data.value" />
        </template>
        <template v-else-if="preview.data.value">
          <EnrolmentServiceRow v-for="s in preview.data.value.services" :key="s.scheduleServiceId"
                               v-model="serviceInputs[s.scheduleServiceId]" :service="s" />
        </template>
        <q-checkbox :model-value="notifications" :disable="notificationsPending || !access.canEditCustomerSide.value"
                    label="Send preventive maintenance notifications" data-test-id="maintenance_enrolment_notifications"
                    @update:model-value="toggleNotifications" />
        <div class="text-caption">The rows appear on the worklist. No emails are sent for them.</div>
      </template>
    </QueryState>
  </template>
</BaseFormDialog>
```
```ts
// The setting writes immediately and stands even if enrolment is cancelled (S7-E7)
const { run: toggleNotifications, isPending: notificationsPending } = useAsyncAction(async (enabled: boolean) => {
  const res = await setNotifications.mutateAsync({ companyId: companyId.value, enabled });
  silencedCount.value = enabled ? null : res.affectedUnitsCount;   // A15 PATCH response
});
const submit = async () => {
  if (props.mode === 'bulk') await bulkEnrol.mutateAsync({ company_id, schedule_id, vehicle_ids: selectedVehicleIds.value });
  else await enrol.mutateAsync({ vehicle_id, company_id, schedule_id, services: toServicePayload(serviceInputs) });
  isDialogVisible.value = false;   // rejection keeps the dialog open (async-submit contract)
};
```
Schedule options come from `context.schedules` filtered by `alreadyOn === false` (S7-E8). `alreadyOn` is only trustworthy once
`company_id` is sent (or there is one customer), so the schedule `Select` is disabled until a customer is chosen. The bulk preview
query is keyed on `(companyId, scheduleId, search)` and is `enabled` only once a schedule is picked. "Select all" ticks only the
loaded `alreadyOn === false` assets (with `truncated`, the caption makes the scope explicit).
Bulk mode has no last-date and no certificate inputs (S7-R26).

**Code sketch: certificate dates (FE preview, BE authoritative; FD-26)**

```ts
// certificateDates.ts (Create) — preview only; BE CertificatePeriod decides (FD-26)
export const addMonthsClamped = (d: DateString, months: number): DateString => {
  const [y, m, day] = d.split('-').map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, last));                       // same day number, clamped to the end month's last day (S8-R10)
  return target.toISOString().slice(0, 10);
};
export function deriveCertificateDates(input: CertificateInput): CertificateInput {
  const { termMonths, startDate, endDate, startTouched, endTouched } = input;
  if (!termMonths) return input;
  if (startDate && !endTouched) return { ...input, endDate: addMonthsClamped(startDate, termMonths) };   // S8-R10
  if (endDate && !startTouched) return { ...input, startDate: addMonthsClamped(endDate, -termMonths) };
  return input;                                                                                       // typed wins
}
export const isCertificateValid = (i: CertificateInput) => !!i.termMonths && (!!i.startDate || !!i.endDate); // S8-R11
```

Backend:

**Code sketch: `CertificatePeriod` (P2, TD-33)**

```php
public static function from(int $termMonths, ?\DateTimeImmutable $startOn, ?\DateTimeImmutable $endOn): self
{
    if ($termMonths < 1 || $termMonths > 60) { throw InvalidCertificateError::term(); }
    if (null === $startOn && null === $endOn) { throw InvalidCertificateError::needsADate(); }     // S8-R11
    return new self($termMonths,
        startOn: $startOn ?? CalendarMath::subMonthsClamped($endOn, $termMonths),                  // End − term (S8-R10)
        endOn:   $endOn   ?? CalendarMath::addMonthsClamped($startOn, $termMonths));               // Start + term; typed wins
}
```

#### Unit / Integration tests:
Backend:
- Unit `EnrolmentTest`: copy includes every service; cover ids re-pointed; archived schedule rejected; anchor = entered date else today; future date rejected; meter At passed → `done` creates an enrolment completion, `leave_due` does not.
- Unit `CertificatePeriodTest`: Start + 12 → End; End − 12 → Start; Jan 31 + 1 → Feb 28/29; both typed kept; neither → error; term bounds.
- Unit `ComplianceRecordTest`: correcting a non-current record refused; replace attachment keeps one live.
- Unit handler tests for enrol, bulk enrol (cap 2,500; already-on skipped), remove, archive (count), customer setting (audit old/new, no outbox call).
- Functional `EnrolmentEndpointsTest`: vehicle from another org → 404; company not linked to the vehicle → 404; bulk with one foreign vehicle id fails whole; prefill picks the latest completion of the same normalized name across schedules; a schedule from another workplace **is** offered with its home name and is enrollable (S7-R1, GR-6).
- Functional `ComplianceRecordEndpointsTest`: upload PDF ≤10 MB ok, 11 MB and `.exe` 400, download needs the atom, record from another org 404.
- Functional `tests/Functional/Customer/Customers/UI/HTTP/MaintenanceNotificationsEndpointTest.php`: toggle off returns the unit count; `entity_event` written; `customers/view` exposes the field and `maintenance_units_without_email_count` is absent; no `accounting_outbox` row written.
- Functional `EnrolmentEndpointsTest` (extend): `hasEmail` true for a customer whose preferred contact has no email but another contact does.

Frontend:
- `CertificateFields.spec.ts`: ids unchanged without `idSuffix`; every id suffixed with `idSuffix="_abc"`; the ids are `…_start`/`…_end`; `defaultStartDate` fills Start until the user edits it.
- `certificateDates.spec.ts`:
  - Start + term → End (14 Oct 2025 + 12 → 14 Oct 2026, the PRD example);
  - End − term → Start;
  - 31 Jan 2026 + 1 → 28 Feb 2026; 31 Jan 2028 + 1 → 29 Feb 2028; 30 Nov + 3 → 28 Feb (non-leap) (clamp);
  - a typed End beats a derived End, and a typed Start beats a derived Start;
  - neither date → invalid (S8-R11);
  - a changed term re-derives only the untouched date.
- `EnrolmentDialog.spec.ts`:
  - single customer shown as text, several → searchable select;
  - `customersTruncated` → caption + typing re-queries A9 with `customer_search`; choosing a customer re-queries with `company_id` and the schedule list honors `alreadyOn`;
  - already-on schedules not offered;
  - prefilled date, future date rejected;
  - Needs-reading badge;
  - meter-At choice defaults to done;
  - no schedules → empty state + link only with settingsService;
  - notification toggle writes immediately and survives Cancel;
  - bulk: greyed already-on, "N of M have history" from ticked `hasHistory`, the "Enroll N assets" label, Select all skips greyed assets, the search is sent as A12 `search`, the `truncated` caption, selections survive a search change;
  - lists every A9 schedule with the home caption when `workplaceCount > 1`; the compliance row shows "ends {date}";
  - MSW handlers return camelCase payloads (contract fixtures), certificates with `startDate`/`endDate`.
- `CertificateAttachmentField.spec.ts` (11 MB rejected client-side, the mime accept string), `ComplianceSection.spec.ts` ("ends {d Mon yyyy}").
- `CustomerMaintenanceNotificationsToggle.spec.ts`: sends **PATCH** `{enabled}`, reads `affectedUnitsCount`; re-entrancy (a double click fires once), the silenced-count copy, disabled without edit; the no-email note appears only when the setting is on and no contact in A16 `contacts[]` has a non-empty email (whitespace counts as none); Add contact shows only with `canEdit('customers')` and opens `ContactDialog` with the company id; `loadCompany` invalidates `companyKeys.detail` and the worklist.
- `EnrolmentDialog.spec.ts` (extend): the no-email note + Add contact follow A9 `customers[].hasEmail` for the chosen customer; after `ContactDialog` saves, A9 is refetched.
- `Customer.spec.ts` (extend): button only with `canEdit('customers')`.

#### Verification (Definition of Done gates):
- Backend: standard + migration gate + smoke (new GET routes).
- Frontend: the per-phase FE gates above, plus:

**Browser-walk (P2):**
1. `admin`, after a P1 schedule exists:
   - `/customers/<cid>/vehicles`: Enroll in Schedule beside New Asset → bulk modal; the schedule select lists schedules from every location with "Lines from …" (org with ≥2 workplaces);
   - search "Heavy" narrows (server-side, Network shows `search=`); tick 3; enroll; toast;
   - on a placeholder asset with many customer links (e.g. a "NEED VIN" unit) the single-asset chooser shows "Showing 50 of N" and typing finds a customer (verified in P5 when the single mount exists);
   - reopen: those 3 are greyed "Already on this schedule".
2. `/customers/<cid>/work-orders`: on the left card, toggle Maintenance notifications off → "N enrolled units…" shows. Reload → persisted. A customer none of whose contacts has an email, setting on → the note says no reminder can be sent, with Add contact → add a contact with an email → the note disappears (S7-R20).
3. `/customers/vehicle/<id>/work-orders?companyId=<cid>`:
   - asset card Compliance section → + Add record;
   - End date only + term → Start date derived (e.g. End 14 Oct 2026, term 12 → Start 14 Oct 2025); change Start → End follows unless End was typed;
   - attach a PDF (and a 12 MB file is refused);
   - save → line "Type · number · ends D Mon YYYY"; edit current; add a renewal → history read-only.
4. Phone 390 px: the modals are fullscreen.
5. Regression: the customer card, the Assets tab and the asset card keep every existing element; the toggle, Enroll in Schedule and the Compliance card are the only additions. As `tech` without customers edit: the toggle is disabled and no Enroll in Schedule button shows.

(Single-asset enrolment mounts in P5 on the Maintenance tab.)

#### E2E tests (e2e/)
Spec folder `e2e/tests/ui/maintenance-reminders/`, project `maintenance-reminders`, conventions in Section 7. **Scenarios (Create): 5 of 5 slots (ranked).**

**P2-1 `bulk-enrolment.spec.ts`: Admin enrolls several of a customer's assets in a schedule from the Assets tab.**
- Type: Happy path. Reqs: S7-R24, S7-R25, S7-R26, S7-N7, S7-R10, S7-R13 (checkbox shown), S6-R1, S6-R4, S1-R12 (Assets count goes live). Role: admin. Priority **P3**.
- Preconditions: Fresh customer + contact + 3 vehicles (unit numbers `MR<ts>-1..3`). Active schedule via API (any workplace; the header workplace for simplicity).
- Steps:
  1. `/customers/<cid>/vehicles` → `button_maintenance_enroll_in_schedule`. Expected: `dialog_maintenance_enrolment` titled "Enroll in schedule".
  2. Pick the schedule. Type `MR<ts>` in `input_maintenance_enrolment_asset_search`. Expected: the 3 assets are listed.
  3. Tick 2 assets. Expected: the confirm reads "Enroll 2 assets"; the history line says "0 of 2 have a last service on record…".
  4. Confirm. Expected: a toast with the enrolled count; the dialog closes.
  5. Reopen, pick the same schedule. Expected: the 2 assets are greyed "Already on this schedule" (checkbox `aria-disabled`); the third can be ticked.
  6. Settings → Maintenance schedules. Expected: the schedule's Assets column = 2.
- Expected result: Bulk enrolment persists per asset and drives both the greyed state and the live count.
- Page objects / factories: Create `e2e/src/pages/dialogs/maintenance-enrolment.dialog.ts`; extend `e2e/src/pages/customers/customer.page.ts` (`enrollInScheduleButton`). Factories: `vehicleFactory.create` ×3, `MaintenanceFactory.createSchedule`, `removeEnrolment` + `archive` cleanup.

**P2-2 `compliance-record.spec.ts`: Admin adds a compliance record on the asset card, then adds a renewal.**
- Type: Happy path. Reqs: S8-R13, S8-R2, S8-R3, S8-R4, S8-R10, S8-R11, S8-E2, S8-R7, S8-R12, S8-N1, S8-N3. Role: admin. Priority **P3**.
- Gate 4: day derivation is previewed by the FE but stored by the BE (`CertificatePeriod`). The rendered line must agree with what was persisted after a reload.
- Preconditions: Fresh customer + vehicle; no schedule needed (S8-N1).
- Steps:
  1. `/customers/vehicle/<vid>/work-orders?companyId=<cid>` → `maintenance_compliance_section` → `button_maintenance_compliance_add_record`.
  2. Type "CVIP", term 12, End date = today + 11 months (`shiftDayKey`), number "AB-<ts>". Expected: Start date derived = End − 12 months, shown in `input_maintenance_certificate_start`.
  3. Save. Expected: the section line reads "CVIP · AB-<ts> · ends <D Mon YYYY>".
  4. Reload. Expected: the same line.
  5. Open the line → Edit current: change the number → save. Expected: the line shows the new number.
  6. `button_maintenance_compliance_add_record` again with a later End date. Expected: the line shows the renewal (latest End date is current); the dialog's history lists the previous record read-only.
- Expected result: Records persist, the latest End date is current, and renewals append history.
- Page objects / factories: Create `e2e/src/pages/dialogs/maintenance-certificate.dialog.ts`; extend `vehicle.page.ts` (`complianceSection`, `complianceRecord(id)`).

**P2-3 `customer-maintenance-notifications.spec.ts`: Admin turns maintenance notifications off for a customer with enrolled units.**
- Type: Happy path. Reqs: S7-R18, S7-R19, S7-R21, S7-R22 (enabled for an editor), S7-R17 (default on), S21-R7 (recorded; not asserted in UI). Role: admin. Priority **P2**.
- Gate 4: the silenced-units number comes from the real BE count of active enrolments (`affectedUnitsCount` / `maintenance_enrolled_units_count`), and the value has to survive a reload.
- Preconditions: Fresh customer + contact with email + 2 vehicles enrolled via `MaintenanceFactory.bulkEnrol`.
- Steps:
  1. `/customers/<cid>/work-orders`. Expected: `maintenance_customer_notifications_toggle` is ON.
  2. Toggle off. Expected: `maintenance_customer_notifications_silenced` reads "2 enrolled units will not receive reminders".
  3. Reload. Expected: the toggle is still off and the silenced text still shows.
  4. Toggle on (restore). Expected: the silenced text is gone.
- Expected result: The setting persists at the customer level and reports the real silenced-unit count.
- Cleanup: `customerFactory.setMaintenanceNotifications(cid, true)` in `finally`.

**P2-4 `certificate-attachment.spec.ts`: Admin attaches a PDF certificate to a compliance record and removes it.**
- Type: Happy path (file integration). Reqs: S8-R9 (Q5), NFR-018. Role: admin. Priority **P2**.
- Gate 4: multipart upload, org-scoped storage, and the chip after a re-fetch.
- Preconditions: Vehicle with one compliance record via `MaintenanceFactory.addComplianceRecord`. A small PDF fixture under `e2e/fixtures/files/`.
- Steps:
  1. Open the record → `button_maintenance_certificate_attach` → set the file through `page.waitForEvent('filechooser')` (`useFilePicker` clicks a detached `<input type=file>`). Expected: a file chip with the name.
  2. Save, reload, reopen. Expected: the chip persists.
  3. `button_maintenance_certificate_remove_attachment` → save → reopen. Expected: no chip.
- Expected result: Exactly one attachment per record, stored and removed through the real endpoints.
- The 11 MB / wrong-mime rejection is NOT here (fe-unit + be-functional).

**P2-5 `schedule-archive-unenrols.spec.ts`: Archiving a schedule unenrolls its assets and takes it out of enrolment.**
- Type: Edge case (server-state gate). Reqs: S6-R6 (unenrol effect), S6-R7, S6-E4. Role: admin. Priority **P2**.
- Preconditions: Customer + 1 vehicle enrolled via API in schedule S.
- Steps:
  1. Settings → archive S through the UI (exact red copy). Expected: S on the Archived tab with Assets 0.
  2. `/customers/<cid>/vehicles` → Enroll in Schedule → open `select_maintenance_enrolment_schedule`. Expected: S not offered.
- Expected result: Archive ends enrolments set-based and blocks re-applying the schedule.

**Backlog:** 1 (enrolment role gate; Section 7 Backlog). **Reference updates:** R2-1 to R2-3 (verify-only). **§8 skip:** n/a.

**Dev-layer (Test Layer = Dev):** customer chooser truncation ≥50 / server search (S7-R23): fe-unit `EnrolmentDialog.spec.ts` + be-functional. Bulk with a foreign vehicle fails whole (NFR-015), cap 2,500 (NFR-009): be-functional `EnrolmentEndpointsTest.php`. Last-service prefill by normalized name (S7-R4): be-functional. Future date refused (S7-R4): fe-unit + be-functional. Meter-At-passed default "done" (S7-E1): be-unit `EnrolmentTest.php` + fe-unit. S7-R1 org-wide schedule list in enrolment: be-functional `EnrolmentEndpointsTest` (a schedule from workplace B offered at A). No-schedules state + link (S7-N6): fe-unit. No-email note and Add contact (S7-R20): fe-unit `CustomerMaintenanceNotificationsToggle.spec.ts`, `EnrolmentDialog.spec.ts`; the contact create itself is the existing `contacts/create` flow. Toggle re-entrancy (NFR-F06): fe-unit. Attachment 11 MB / mime rejection: fe-unit `CertificateAttachmentField.spec.ts` + be-functional `ComplianceRecordEndpointsTest.php`. Certificate day derivations, both directions + month-end clamp (S8-R10, R11, E2): fe-unit `certificateDates.spec.ts` + be-unit `CertificatePeriodTest.php`. Correcting a non-current record → 409 (S8-R12): be-functional. Single-asset enrolment is mounted in P5 (covered by P5-1).

### Phase P3: Readings

**Implements:** BE: S10, S11-R3, S21-R4, the one-time historical load. FE: S10 (reading dialog, component only; mounted in P5). Requirement IDs traced to P3 in Section 10: S9-E2, S10-R1, S10-R2, S10-R4, S10-R5, S10-R6, S10-R7, S10-R8, S10-R9, S10-R10, S10-R11, S10-N1, S10-N2, S10-N3, S10-N4, S10-N5, S10-E1, S10-E2, S10-E3, S10-E4, S11-R3, S21-R1, S21-R3, S21-R4, S21-R6, S21-R7, S21-N1, S21-N2, S21-E2, NFR-001, NFR-002, NFR-006, NFR-007, NFR-011, NFR-012, NFR-013, NFR-015, NFR-F01, NFR-F04, NFR-F05, NFR-F06, NFR-F07, NFR-F09, NFR-F10, NFR-F11.

**Depends on:** P0 (`EntityEventWriter`, `MaintenanceToday`). Independent of P1 and P2.

#### Database changes:
| Table | Change |
|---|---|
| `vehicle_meter_reading` | Create (migration P3) |

#### Backend changes (`api/`):
Capture ships for every organization (S10-R12, D27); a WO reading counts only when entered or changed on that WO (S10-N6, TD-34). This phase changes write paths that exist today,
so it is the highest-regression phase in Plan 1.

| File | Action | Description |
|---|---|---|
| `config/packages/doctrine.yaml` | Modify | Mapping `VehicleService_MeterReading` (TD-01) |
| `src/VehicleService/MeterReadings/Domain/Model/MeterReading.php` | Create | Root; `OrganizationIdentifierAware`, `AuditStampAware`; factories `fromWorkOrder()`, `fromAssetEntry()`, `fromDialog()`, `fromCompletionElsewhere()`, `fromHistory()`; `correctTo(int, ?Uuid)`, `settle(ReadingState, \DateTimeImmutable readOn)` (state and date only, never the value, TD-35), `remove(?Uuid)` |
| `src/VehicleService/MeterReadings/Domain/Model/Meter.php`, `ReadingSource.php`, `ReadingState.php`, `IdempotencyKey.php` | Create | Enums (`Meter` values `mileage` / `hours`, contract rule 5); key factories per source (sketch 4) |
| `src/VehicleService/MeterReadings/Domain/Event/MeterReadingRecordedEvent.php` | Create | `vehicleId`, `readingId`, `meter`, `state` (domain event, `DomainEventBus`) |
| `src/VehicleService/MeterReadings/Domain/Repository/MeterReadingRepository.php` | Create | `findByKey()`, `add()`, `update()`, `latestLive(vehicleId, meter, ?excludeId)`; `settleForWorkOrder()` is added in P6 (TD-35) |
| `src/VehicleService/MeterReadings/Domain/Repository/WorkOrderReadingContext.php` | Create | Port: for a WO id → `{vehicleId, workplaceId, startDate, invoicedOn|null}` (org-scoped) |
| `src/VehicleService/MeterReadings/Infrastructure/Persistence/Repository/Doctrine/MeterReading.orm.xml` | Create | Mapping (schema parity) |
| `src/VehicleService/MeterReadings/Infrastructure/Persistence/Repository/Dbal/DbalMeterReadingRepository.php` | Create | DBAL writes (TD-08); every statement binds `organization_id` from `OrganizationDecorator` |
| `src/VehicleService/MeterReadings/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderReadingContext.php` | Create | `work_order` LEFT JOIN `invoice` (`inv__work_order_id_idx`), org-scoped |
| `src/VehicleService/MeterReadings/Application/Service/MeterReadingRecorder.php` | Create | The capture service (sketch 4): `recordFromWorkOrder()`, `recordFromAsset(vehicleId, ?mileage, ?hours, ReadingSource, ?previousMileage, ?previousHours)`, `recordFromDialog()`, `recordElsewhere()`; audit through `EntityEventWriter` |
| `src/VehicleService/MeterReadings/Application/EventListener/RecordWorkOrderReadingOnMeterChangeSubscriber.php` | Create | `DomainEventSubscriber` for `WorkOrders\Domain\MileageChange` and `EngineHoursChange` → `recordFromWorkOrder(..., $event->previous())`; skips when `previous !== null && value === previous` (TD-34, S10-N6) |
| `src/VehicleService/WorkOrders/Domain/MileageChange.php`, `EngineHoursChange.php` | Modify | Optional trailing `?int $previous = null` + getter (TD-34; backwards compatible, existing subscribers ignore it). `WorkOrder::recordMileageChange(?int $previous = null)` / `recordEngineHoursChange(?int $previous = null)` (Modify) |
| `src/VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php` | Modify | Inject `AssetMeterValues`; read the vehicle's current mileage/hours before building the WO and pass them as `previous` (the copy source; S10-N6, TD-34), so a copied value is never a reading; still non-transactional |
| `src/VehicleService/WorkOrders/Domain/Service/AssetMeterValues.php`, `src/VehicleService/WorkOrders/Domain/Model/AssetMeterSnapshot.php`, `src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/DbalAssetMeterValues.php` | Create | TD-34 port: `current(Uuid $vehicleId): AssetMeterSnapshot`; one org-scoped DBAL read of `vehicle.mileage` / `vehicle.engine_hours`; bound in `config/services.yaml`. Also used by the MR create-WO handler (P6) |
| `src/VehicleService/WorkOrders/Application/ChangeMileage/ChangeMileageCommandHandler.php`, `ChangeEngineHours/ChangeEngineHoursCommandHandler.php`, `ChangeRequiredData/ChangeCommandHandler.php`, `Line/UpdateLineData/ChangeCommandHandler.php`, `Change/ChangeCommandHandler.php` | Modify | Wrap in `Transactional` so WO, reading and (P4) projection commit together. Read the WO's value before the setter and pass it as `previous` (TD-34). Characterization tests first (NFR-019 style). `WorkOrders/Application/Create/CreateCommandHandler.php` is deliberately left non-transactional (its SV-8685 docblock) |
| `src/VehicleService/Vehicles/Application/HTTP/Create/CreateCommandHandler.php` | Modify | After the vehicle is persisted: `recordFromAsset(..., ReadingSource::Asset, null, null)` |
| `src/VehicleService/Vehicles/Application/HTTP/Change/ChangeCommandHandler.php` | Modify | In `updateGrantedOptions()` (`:148-149`), capture previous values before the setters and call `recordFromAsset()` for changed, non-null, >0 values. Not in `mergeVehicles()`, `createNewVehicle()` or `updateExistingWOs()` (copies) |
| `src/OpenApi/Asset/Application/Create/CreateController.php` (`:161`), `src/OpenApi/Asset/Application/Update/UpdateController.php` (`:100-106`) | Modify | `ReadingSource::Api` |
| `src/Organization/DataImport/Application/VehiclesImport/ImportCommandHandler.php` (`createNewVehicle()` `:169`, `updateExistingVehicle()` `:207`, which calls `Vehicle::change()` at `:217`) | Modify | `ReadingSource::Import`; the existing `(int) null` → 0 cast means "blank", so 0 is skipped |
| `src/External/CustomerPortal/Application/Handler/CreateVehicle/CreateVehicleCommandHandler.php` | Modify | `ReadingSource::CustomerPortal` |
| `src/VehicleService/MeterReadings/Application/Command|Handler/Reading/RecordReadingsCommand(+Handler)`, `UndoReadingCommand(+Handler)` | Create | Dialog save: `Transactional`; readings + `Vehicle::setMileage/setEngineHours` + `vehicleChangedEvent()` so open WOs get the value through the existing `UpdateWorkOrdersOnVehicleChange` (a copy, not a reading). Undo: soft remove, revert vehicle columns to the previous live value |
| `src/VehicleService/MeterReadings/Application/Query|Handler/Reading/CurrentReadingsQuery(+Handler)` + DTOs | Create | A21: latest live reading per meter (`readingId`, `value`, `readAt`, `source`, `state`, `enteredByName`) and `plausibility` from `RateCeiling` (S10-R2, S10-N2) |
| `src/VehicleService/MeterReadings/Domain/Service/ReadingPlausibility.php` | Create | Sets `implausible` on each A22 result. Implausible = lower than the previous live value, or `(new − previous) / max(1, days since previous) > RateCeiling::perDay(meter)` |
| `src/VehicleService/MeterReadings/Domain/Model/RateCeiling.php` | Create | 1,500/day mileage, 24/day engine hours, one ceiling for every unit (S11-R19); also used by the P4 estimator |
| `src/VehicleService/MeterReadings/UI/HTTP/Reading/*Controller.php` + `DTO/`, `UI/HTTP/Shared/MeterReadingAccessGate.php` | Create | A21, A22, A23 |
| `src/VehicleService/MeterReadings/Domain/Repository/HistoricalReadingSource.php`, `Infrastructure/Persistence/Query/Dbal/DbalHistoricalReadingSource.php` | Create | Keyset reads of `work_order` and `work_order_imported` (org-scoped) |
| `src/VehicleService/MeterReadings/Application/Service/HistoricalReadingMapper.php`, `HistoricalReadingLoader.php` | Create | Pure mapping (state, `read_on` in the workplace timezone, key) and batch orchestration with existing-key skip |
| `src/VehicleService/MeterReadings/UI/CLI/LoadHistoricalReadingsCommand.php` | Create | `meter-readings:load-history`; per-org `OrganizationDecorator::runAs()`, enumeration like `Accounting/Reconciliation/UI/CLI/AccountingReconcilePushCommand.php`; `MemoryLimit::raiseTo()` if needed, never `ini_set` |
| `tests/Unit/Architecture/MeterWriteSurfaceTest.php` | Create | Fails when a caller of `Vehicle::setMileage/setEngineHours/change`, `new Vehicle(`, `WorkOrder::setMileage/setEngineHours` appears outside the allowlist; each allowlisted file is tagged `captures` or `copies` (TD-05) |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `api/maintenance/*` | Modify | A21–A23. Undo deletes the `id` returned by A22 `readings[]` (one DELETE per meter saved); the current card shows A21 `readingId` (the readings endpoints live under `vehicles/`, but the FE keeps them in the maintenance module because only maintenance surfaces call them in Plan 1) |
| `components/ts/maintenance/readings/ReadingDialog.vue` | Create | `BaseFormDialog fullscreenOnPhone`. Per meter: current on the left, read-only with source + age ("In the shop" state, S10-R11); new value on the right (S10-R2, R6). Labels "Mileage" / "Engine hours" (S10-R9). Orange confirm on implausible or lower values, then save (S10-N1..N3). Undo toast on save (S10-R7). No forecast (S10-N4). Props `vehicleId`, `companyId`, `workOrderId?` (Plan 2: same dialog from the WO, S10-R1) |
| `components/ts/maintenance/readings/readingPlausibility.ts` | Create | Pure: `{kind: 'lower' \| 'implausible' \| null}` from (A21 `mileage`/`hours` `value` + `readAt`, new value, location today, A21 `plausibility.mileageMaxPerDay` / `hoursMaxPerDay`) (S11-R19, S10-N2: 1,500 mileage a day, 24 engine hours a day) |
| `components/ts/maintenance/readings/ReadingWarning.vue` | Create | Orange inline confirmation block (`InfoNotice`-style, never `negative`) with "Save anyway" / "Change" |

No existing reading input changes in P3. The existing `components/shared/vehicle-info/VehicleCard.vue` mileage and engine-hours
inputs (:142-205) and the asset edit dialog keep working, and the BE captures from them (B6). P3 FE is component-only. Its
browser mount arrives in P5 (Enter mileage).

#### Key code changes:
Backend:

Sketch 4 (capture and idempotency):

```php
final class MeterReadingRecorder
{
    public function recordFromWorkOrder(Uuid $workOrderId, Meter $meter, ?int $value, ?int $previous): ?MeterReading
    {
        if (null === $value || $value <= 0) {
            return null;                                           // blank on the WO is not a reading
        }
        if (null !== $previous && $value === $previous) {
            return null;                                           // S10-N6: unchanged on this WO = copy, not a reading
        }
        $context = $this->workOrderContext->forWorkOrder($workOrderId);  // org-scoped; null for parts WOs
        if (null === $context) {
            return null;
        }
        $key = IdempotencyKey::forWorkOrder($workOrderId, $meter);       // "work_order:{woId}:{meter}"
        $existing = $this->readings->findByKey($key);

        if (null !== $existing) {
            if ($existing->value() === $value) {
                return $existing;                                  // full-form WO save re-sends the same value
            }
            $old = $existing->value();
            $existing->correctTo($value, $this->actor->resolve()); // S10-R8: last entered wins, in place
            $this->readings->update($existing);
            $this->audit->write([AuditEntries::readingCorrected($existing, $old, $context->workplaceId)]); // S21-R4
        } else {
            $previous = $this->readings->latestLive($context->vehicleId, $meter);
            $existing = MeterReading::fromWorkOrder(
                Uuid::new(), $this->organizationId(), $context->vehicleId, $meter, $value, $workOrderId, $key,
                null !== $context->invoicedOn ? ReadingState::Recorded : ReadingState::InShop,   // S10-R11
                $context->invoicedOn ?? $context->startDate,
                null !== $previous && $value < $previous->value(),                               // S10-N3
                $this->actor->resolve(), $this->clock->now(),
            );
            $this->readings->add($existing);
            $this->audit->write([AuditEntries::readingRecorded($existing, $context->workplaceId)]);
        }

        $this->domainEvents->dispatch(new MeterReadingRecordedEvent($context->vehicleId, $existing->id(), $meter));
        return $existing;
    }

    /** Asset-side: only values a person or system actually changed. */
    public function recordFromAsset(Uuid $vehicleId, ?int $mileage, ?int $hours, ReadingSource $source, ?int $previousMileage, ?int $previousHours): void
    {
        $today = $this->today->date();
        foreach ([[Meter::Mileage, $mileage, $previousMileage], [Meter::EngineHours, $hours, $previousHours]] as [$meter, $new, $prev]) {
            if (null === $new || $new <= 0 || $new === $prev) {
                continue;
            }
            // "{source}:{vehicleId}:{meter}:{value}:{Y-m-d}" so a double submit the same day is one reading
            $key = IdempotencyKey::forEntry($source, $vehicleId, $meter, $new, $today);
            if (null !== $this->readings->findByKey($key)) {
                continue;
            }
            // ... add recorded reading dated $today, lower_than_previous vs latestLive(), audit, dispatch event
        }
    }
}
```

Keys: `work_order:{woId}:{meter}`, `work_order_imported:{id}:{meter}` (history only), `{asset|reading_dialog|import|api|customer_portal}:{vehicleId}:{meter}:{value}:{date}`, `completion:{completionId}:{meter}`. The unique index `vmr__org_idempotency_key_unq` is the backstop: a race that slips past `findByKey()` gets a `UniqueConstraintViolationException`, which the DBAL repository catches and turns into "already recorded" (MySQL rolls back the statement only, the transaction continues).

#### Unit / Integration tests:
Backend:
- Unit `MeterReadingRecorderTest`: unchanged vs `previous` → nothing recorded; WO create whose value equals the asset's → nothing; WO create with a different value → `in_shop`; same value re-save is a no-op; changed value corrects in place and audits old/new; invoiced WO records as `recorded` with the invoice date; open WO records `in_shop` with the start date; 0/null skipped; lower value flagged; asset path records only changed values; same-day duplicate dedupes.
- Unit `IdempotencyKeyTest`, `ReadingPlausibilityTest` (ceiling per meter, lower value), `HistoricalReadingMapperTest` (invoiced vs not, declined skipped, timezone date, keys equal to live capture keys), `HistoricalReadingLoaderTest` (existing keys skipped, batches).
- Characterization then change tests for the five wrapped WO handlers (`tests/Unit/VehicleService/WorkOrders/Application/...`): same WO outcome as before, now inside `Transactional`.
- Functional `tests/Functional/VehicleService/MeterReadings/ReadingCaptureTest.php`, one test per entry point: WO change-mileage, WO full change, WO required data, line update data, WO create, asset create, asset edit (changed and unchanged mileage), Public API create/update, import create/update, portal create. Plus the copy paths produce no reading: asset edit propagating to an open WO, vehicle switch, merge, VIN change. S10-N6: WO create with the asset's own value → no reading; WO create with a typed different value → one reading; full WO change re-sending an unchanged value on a WO with no reading row → no reading.
- Unit `MileageChangeTest` (BC: `previous` optional).
- Functional `ReadingEndpointsTest`: current values, plausibility flags, save, undo (only latest, only own), foreign vehicle 404, 403 without the atom.
- Architecture `MeterWriteSurfaceTest`.

Frontend:
- `readingPlausibility.spec.ts`: lower, above ceiling over the elapsed days, same-day, no previous reading.
- `ReadingDialog.spec.ts`:
  - shows current + source + age, "In the shop" state;
  - the orange confirm flow saves on confirm and never blocks;
  - an empty form cannot submit;
  - the Undo toast handler calls DELETE with each A22 `readings[].id` and invalidates `maintenanceKeys.asset`; a 409 shows "This can no longer be undone" (request sent with `handlesConflictLocally`);
  - the orange confirm uses A21 `plausibility.mileageMaxPerDay` / `hoursMaxPerDay`;
  - no red classes anywhere.

#### Verification (Definition of Done gates):
- Backend: standard + migration gate + smoke (`/api/vehicles/{id}/meter-readings/current` with a seeded id). Ops: run `meter-readings:load-history` per 4.4 "Order" (after the release deploy in production; on QA after each branch-build deploy); record per-org counts in the PR.
- Frontend: the per-phase FE gates above, plus:

**Browser-walk (P3, regression only):**
- `admin`: `/workorders/<id>/lines`. Change mileage in the asset card and save. It persists and the console is clean. The BE half verifies that a reading row was written.
- Asset edit dialog from `/customers/vehicle/<id>`: change engine hours and save. Same check.

#### E2E tests (e2e/)
**Scenarios (Create): 0.** `ReadingDialog.vue` is created but **not mounted** until P5 ("component-only. Its browser mount arrives in P5"). No new UI can be reached, so no gate-4 scenario exists. Reading capture from existing entry points (WO mileage, asset edit, import, Public API, portal) can be observed with the API alone: be-functional `ReadingCaptureTest.php` (gate 2).

**Backlog:** none.

**Reference updates (re-run, no edits expected):** P3 wraps 5 existing WO handlers in `Transactional` and adds capture to Vehicle Create/Change, Import, OpenApi Asset Create/Update and Portal. Existing specs that drive those paths must be re-run unchanged (the P3 re-run set in Section 7). No locator, route or text changes.

**§8 skip / override:**
- **If the P3 PR ships the FE component as planned:** none of the §8 strings applies (`internal-refactor` requires "no template change", and `ReadingDialog.vue` is a template). Coverage block = override marker: `> ⚠️ **E2E-COVERAGE-OVERRIDE:** ReadingDialog is not mounted until P5; its E2E lands with P5-2.`
- **Recommended:** move `components/ts/maintenance/readings/*` and the `api/maintenance` A21-A23 additions into the P5 PR. P3 then has zero `app/src/**/*.{vue,ts}` and qualifies verbatim for **`None — no-fe-diff`**. The BE controllers (new reading controllers, OpenApi Create/Update) still trigger §9, but the orchestrator stamps `no-fe-diff`.

**Dev-layer (Test Layer = Dev):** capture per entry point + copy paths produce no reading (be-functional `ReadingCaptureTest.php`). Idempotency / same-day dedupe (be-unit `IdempotencyKeyTest.php`). Plausibility (be-unit `ReadingPlausibilityTest.php`, fe-unit `readingPlausibility.spec.ts`). Undo only latest/own (be-functional `ReadingEndpointsTest.php`). Historical load (be-unit `HistoricalReadingLoaderTest.php`). Write-surface pin (architecture `MeterWriteSurfaceTest.php`).

### Phase P4: Engine and projection

**Implements:** BE: S11, S12, S9-E2, S8-E4, S10-R5, S21-E2: estimator, confidence table, due resolution, the projection table and the one recompute service every input write calls. FE: contract freeze of the DTO types and MSW fixtures. Requirement IDs traced to P4 in Section 10: S2-R6, S2-R11, S2-R14, S2-E3, S2-E5, S3-N2, S5-R8, S6-R6, S6-R14, S7-R15, S7-N2, S7-E2, S7-E3, S7-E5, S8-N2, S8-E4, S9-R8, S9-R10, S9-R12, S9-E2, S10-R5, S10-N5, S10-E1, S10-E2, S10-E3, S10-E4, S11-R1, S11-R2, S11-R3, S11-R4, S11-R5, S11-R6, S11-R7, S11-R8, S11-R10, S11-R11, S11-R12, S11-R14, S11-R17, S11-R19, S11-R20, S11-R21, S11-R22, S11-R23, S11-R24, S11-R25, S11-R26, S11-N2, S11-N3, S11-E2, S11-E3, S11-E4, S11-E5, S11-E6, S12-R1, S12-R2, S12-R3, S12-R4, S12-R5, S12-R6, S12-R7, S12-R8, S12-R14, S12-N1, S12-N2, S12-E1, S12-E2, S12-E3, S12-E4, S13-R22, S13-R27, S18-R7, S18-R10, S18-R11, S18-R12, S18-R18, S21-R1, S21-R3, S21-R4, S21-R6, S21-R7, S21-N1, S21-N2, S21-E2, NFR-001, NFR-002, NFR-003, NFR-004, NFR-009, NFR-012, NFR-013, NFR-014, NFR-015, NFR-017, NFR-021, NFR-F01, NFR-F04, NFR-F05, NFR-F06, NFR-F07, NFR-F09, NFR-F10, NFR-F11.

**Depends on:** P2 (enrolments, completions, compliance records; their handlers gain the recompute call here) and P3 (readings).

**Plan 2 extends this phase (S16-E1).** Plan 1's behavior is "in-shop excluded": the resolver and `DbalReadingHistory` use recorded, live readings only (S11-R24). Plan 2 TD-108 modifies `DueDateResolver.php` and `DbalReadingHistory.php` so the latest live In the shop value per meter is a position floor (a threshold it reaches reads due at once), with rate, pairs and age unchanged. Keep the position input a separate argument of the resolver so that change is additive (2.12).

#### Database changes:
| Table | Change |
|---|---|
| `maintenance_due_projection` | Create (migration P4); hand FK added to `MANUALLY_MANAGED_FOREIGN_KEYS` |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/Domain/Model/ReadingPoint.php`, `MeterEstimate.php`, `UsablePair.php`, `Confidence.php` | Create | Engine value objects |
| `src/VehicleService/Maintenance/Domain/Service/MeterEstimator.php` | Create | Sketch 1 |
| `src/VehicleService/Maintenance/Domain/Service/ConfidenceTable.php` | Create | Sketch 1 |
| `src/VehicleService/Maintenance/Domain/Service/CalendarMath.php` | Create | `addMonthsClamped()`, `addDays()`, `subMonthsClamped()`, `nextAnnualOccurrence(day, month, onOrAfter)` (S2-R14, E5) |
| `src/VehicleService/Maintenance/Domain/Model/CycleState.php`, `src/VehicleService/Maintenance/Domain/Service/CycleHistory.php` | Create | Anchor date and meter values from the latest effective completion, else the initial anchor; calendar-At pending occurrence; meter-At done (S12-R3, E2; S7-E2) |
| `src/VehicleService/Maintenance/Domain/Model/DueCandidate.php`, `ResolvedDue.php`, `DueTrigger.php` | Create | Output |
| `src/VehicleService/Maintenance/Domain/Service/DueDateResolver.php` | Create | Sketch 2 (compliance branch: due = the current certificate's End date, day precision, overdue from End + 1; S12-R4, S8-E2, S11-R13). In-shop excluded here; Plan 2 TD-108 adds the in-shop position floor (S16-E1) |
| `src/VehicleService/Maintenance/Domain/Model/DueStatus.php` | Create | `of(?dueOn, ?dueSoonFrom, today)`: overdue / due today / due soon / none (S9-R7, S12-R4) |
| `src/VehicleService/Maintenance/Domain/Model/DueProjection.php` | Create | Mapped read-model class (no behavior; mapping only) |
| `src/VehicleService/Maintenance/Domain/Repository/EnrolledServiceSnapshotFetcher.php`, `ReadingHistory.php`, `CompletionHistory.php`, `CurrentCertificateFetcher.php`, `LastVisitLocator.php`, `DueProjectionWriter.php` | Create | Ports of the recomputer |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalEnrolledServiceSnapshotFetcher.php`, `DbalReadingHistory.php`, `DbalCompletionHistory.php`, `DbalCurrentCertificateFetcher.php`, `DbalLastVisitLocator.php` | Create | One query each per chunk of ≤500 vehicles; all org-bound. `DbalCurrentCertificateFetcher`: latest `end_on` per normalized name, not voided; a renewal drives at once (S8-R12). `DbalLastVisitLocator`: imported visits count (S13-R27) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Dbal/DbalDueProjectionWriter.php` | Create | `replaceForVehicles(list<Uuid>, list<DueProjectionRow>)`: DELETE by `(organization_id, vehicle_id IN …)`, multi-row INSERT chunks of 500; `deleteForEnrolments()`, `deleteForSchedule()`, `updateLocation(vehicleId, workplaceId)`, `updateSkip()` |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Repository/Doctrine/DueProjection.orm.xml` | Create | Mapping |
| `src/VehicleService/Maintenance/Application/Service/DueProjectionRecomputer.php` | Create | Sketch 3: `recomputeVehicles()` and `refreshExpiredWindows(Uuid $organizationId, \DateTimeImmutable $today): int` (the sliding 24-month window refresh, NFR-014; called by the nightly command). `DueProjectionRow::from()` writes `home_workplace_id`; no backlog flag (D24) |
| `src/VehicleService/Maintenance/Domain/Repository/ExpiredWindowFetcher.php`, `Infrastructure/Persistence/Query/Dbal/DbalExpiredWindowFetcher.php` | Create | `vehicleIdsWithWindowExpiredBy(Uuid $organizationId, \DateTimeImmutable $today): list<Uuid>`: `SELECT DISTINCT vehicle_id … WHERE organization_id = :org AND window_expires_on <= :today` (`mdp__org_window_expires_idx`; `today` bound, NFR-017) |
| `src/VehicleService/Maintenance/Application/EventListener/RecomputeOnMeterReadingRecordedSubscriber.php` | Create | `DomainEventSubscriber` for `MeterReadingRecordedEvent` → `recomputeVehicles([vehicleId], readingId)`; wraps the call in a savepoint and catches/logs when the reading came from a WO path (NFR-021) |
| Enrol, bulk enrol, remove, archive, compliance record handlers (from P2) | Modify | Call the recomputer (or `deleteForEnrolments()`/`deleteForSchedule()`) inside their transaction |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalEnrolmentPreviewFetcher.php` | Modify | Usable pairs per meter for S7-R15 (estimator over the vehicle's readings) |
| `src/VehicleService/Maintenance/UI/CLI/RefreshExpiringProjectionCommand.php`, `ReconcileProjectionCommand.php` | Create | TD-22 (per org `runAs`; thin; logic in the recomputer). `maintenance:projection:refresh` calls `DueProjectionRecomputer::refreshExpiredWindows($organizationId, $today)` per org |
| `infrastructure/modules/services/shopview/maintenance-projection-refresh.tf` | Create | Nightly EventBridge schedule → ECS RunTask of `maintenance:projection:refresh --all` (pattern `search-maintenance.tf:40-72`). Terraform PR; applied per env |

#### Frontend changes (`app/`):
No new FE files. The FE work is a **contract freeze**:
- `DueDto`, `ServiceRowDto`, `ReadingCardDto` and `WorklistRowDto` in `api/maintenance/MaintenanceModel.ts` are agreed with the BE author;
- the default MSW handlers in `app/src/testing/handlers.ts` are updated to realistic payloads: one fixture per confidence cell plus No data, calendar-only, compliance "No record", and month vs day precision.

`DueCell`/`ConfidenceMeter` specs are re-run against those fixtures. Rounding (S11-R12) and status are BE-owned (FD-3), so the FE does
nothing more here.

#### Key code changes:
Backend:

Sketch 1 (rate and confidence, S11):

```php
final class MeterEstimator
{
    private const WINDOW_MONTHS = 24;      // S11-R26
    private const MIN_PAIR_DAYS = 7;       // S11-R4
    private const MAX_PAIR_DAYS = 365;     // S11-R20
    private const PAIRS_FOR_RATE = 3;      // S11-R2

    /** @param list<ReadingPoint> $readings recorded, live readings of ONE meter (in-shop excluded, S11-R24; Plan 2 TD-108 adds the in-shop position floor, S16-E1) */
    public function estimate(Meter $meter, array $readings, \DateTimeImmutable $today, ?int $vehicleYear): MeterEstimate
    {
        $windowStart = $today->modify(sprintf('-%d months', self::WINDOW_MONTHS));
        $valid = array_values(array_filter($readings, fn (ReadingPoint $r): bool =>
            $r->readOn <= $today                                         // S11-R6 future
            && !$this->impossibleYear($r->readOn, $vehicleYear)          // S11-R6 before 1990 or before model year
            && $r->readOn >= $windowStart));                             // S11-R26

        $byDay = [];                                                     // S10-E4: the rate takes the higher value
        foreach ($valid as $r) {
            $day = $r->readOn->format('Y-m-d');
            $byDay[$day] = max($byDay[$day] ?? 0, $r->value);
        }
        ksort($byDay);
        $points = array_map(fn (string $d, int $v) => [new \DateTimeImmutable($d), $v], array_keys($byDay), $byDay);

        $usable = [];
        for ($i = 1, $n = count($points); $i < $n; ++$i) {
            [$d0, $v0] = $points[$i - 1];
            [$d1, $v1] = $points[$i];
            $days = (int) $d0->diff($d1)->days;
            if ($days < self::MIN_PAIR_DAYS || $v1 <= $v0 || $days > self::MAX_PAIR_DAYS) {
                continue;                                                // S11-R4, R5, R20
            }
            if (($v1 - $v0) / $days > RateCeiling::perDay($meter)) {
                continue;                                                // S11-R19 (Q2 ✅)
            }
            $usable[] = new UsablePair($d0, $v0, $d1, $v1, $days);
        }

        $last = $this->lastEntered($valid);                              // display keeps the last entered (S10-E4)
        if ([] === $usable) {
            return MeterEstimate::noData($meter, $last);                 // S11-R17, S12-R2
        }

        $recent = array_slice($usable, -self::PAIRS_FOR_RATE);
        $gain = array_sum(array_map(fn (UsablePair $p) => $p->v1 - $p->v0, $recent));
        $span = array_sum(array_map(fn (UsablePair $p) => $p->days, $recent));

        return new MeterEstimate(
            meter: $meter,
            ratePerDay: $gain / $span,                                   // S11-R2 (E6: 11,700 / 120 = 97.5)
            usablePairs: count($usable),                                 // S11-R23
            measuredFromVisits: $this->distinctEndpoints($usable),       // S11-R25
            lastRecordedOn: $last->readOn,
            lastRecordedValue: $last->value,
            windowExpiresOn: $usable[0]->d0->modify(sprintf('+%d months', self::WINDOW_MONTHS)),
        );
    }
}

final class ConfidenceTable                                               // S11-R22, R24; evaluated at read time
{
    public static function grade(int $ageDays, int $usablePairs): ?Confidence
    {
        if ($usablePairs < 1) {
            return null;                                                  // No data
        }
        return match (true) {
            $ageDays <= 30  => 1 === $usablePairs ? Confidence::Medium : Confidence::High,
            $ageDays <= 90  => 1 === $usablePairs ? Confidence::Low : ($usablePairs <= 3 ? Confidence::Medium : Confidence::High),
            $ageDays <= 180 => 1 === $usablePairs ? Confidence::Low : Confidence::Medium,
            $ageDays <= 365 => $usablePairs >= 4 ? Confidence::Medium : Confidence::Low,
            default         => Confidence::Low,
        };
    }
}
```

`MeterEstimate::projectedDateFor(int $target)`: if a recorded reading already reached the target, the date of the
first such reading (exact, not an estimate); otherwise `lastRecordedOn + ceil((target − lastRecordedValue) / ratePerDay)`
days (estimate; may lie in the past → overdue, S11-R13).

Sketch 2 (due resolution, S12):

```php
final class DueDateResolver
{
    public function resolve(EnrolledServiceTerms $terms, CycleState $cycle, MeterEstimates $meters, ?CurrentCertificate $certificate): ResolvedDue
    {
        if ($terms->isCompliance()) {
            if (null === $certificate) {
                return ResolvedDue::noRecord();                                   // S3-N2, S8-N2
            }
            $due = $certificate->endOn;                                           // S12-R4: due on the End date, valid through it (S8-E2)
            return ResolvedDue::single(DueCandidate::exactDay(DueTrigger::Certificate, $due),  // precision day (S11-R13)
                dueSoonFrom: CalendarMath::subMonthsClamped($due, $terms->remindBeforeMonths()));
        }

        $candidates = [$this->calendarCandidate($terms->calendar(), $cycle)];     // S12-R2: calendar always
        foreach ([Meter::Mileage, Meter::EngineHours] as $meter) {
            $trigger = $terms->meterTrigger($meter);
            if (null === $trigger || $meters->for($meter)->isNoData()) {
                continue;                                                         // S12-R2, S11-N2, S12-N1
            }
            if ($trigger->isAt() && $cycle->meterAtDone($meter)) {
                continue;                                                         // S12-R3: once done, never again
            }
            $anchor = $cycle->anchorValue($meter) ?? $meters->for($meter)->valueAtOrAfter($cycle->anchorOn());
            if (null === $anchor && $trigger->isEvery()) {
                continue;
            }
            $target = $trigger->isAt() ? $trigger->value() : $anchor + $trigger->value();
            $candidates[] = $meters->for($meter)->candidateFor($target);          // exact or estimate
        }

        usort($candidates, fn (DueCandidate $a, DueCandidate $b) =>
            [$a->dueOn, $b->rank()] <=> [$b->dueOn, $a->rank()]);                 // S12-R5; tie: S12-R8 exact > High > Medium > Low
        $winner = $candidates[0];

        return new ResolvedDue($winner, $candidates,                             // S12-R7, S12-N2: keep every candidate
            dueSoonFrom: $winner->dueOn->modify(sprintf('-%d days', $terms->reminderOffsets()->largestBeforeDays())));  // S9-R8, S5-R8
    }

    private function calendarCandidate(CalendarTrigger $calendar, CycleState $cycle): DueCandidate
    {
        return DueCandidate::exact(DueTrigger::Calendar, match (true) {
            $calendar->isAt()         => $cycle->pendingAnnualOccurrence(),       // S12-R3, S7-E2
            $calendar->isEveryMonths()=> CalendarMath::addMonthsClamped($cycle->anchorOn(), $calendar->value()),  // S2-R14, E5
            default                   => CalendarMath::addDays($cycle->anchorOn(), $calendar->value()),
        });
    }
}
```

`CycleHistory`: anchor = latest effective completion (`undone_at IS NULL`, ordered `reset_on`, then `created_at`),
else the initial anchor. Calendar At: `P0 = nextAnnualOccurrence(day, month, onOrAfter: initial anchor)`; for each
effective completion in order with `reset_on ≥ P − 182 days`, `P = P + 1 year` once; the pending `P` is the candidate,
so a missed occurrence stays overdue until done and early/late completion does not move next year's date (S12-R3,
S12-E2). Meter At done = any effective completion after enrolment, or an `enrolment` completion (S7-E1).

Sketch 3 (recompute service, NFR-003):

```php
final class DueProjectionRecomputer
{
    /** @param list<Uuid> $vehicleIds  Runs in the CALLER's transaction; opens none of its own. */
    public function recomputeVehicles(array $vehicleIds, ?Uuid $triggeringReadingId = null): void
    {
        $today = $this->today->date();
        foreach (array_chunk(array_values(array_unique($vehicleIds)), 500) as $chunk) {
            $services = $this->services->activeForVehicles($chunk);          // 1 query (org-bound)
            if ([] === $services) {
                $this->writer->replaceForVehicles($chunk, []);               // e.g. last enrolment just ended
                continue;
            }
            $active      = EnrolledServiceSnapshot::vehicleIds($services);
            $readings    = $this->readings->recordedForVehicles($active);    // 1 query, live + recorded only
            $completions = $this->completions->effectiveForServices(EnrolledServiceSnapshot::ids($services)); // 1
            $certs       = $this->certificates->currentForVehicles($active); // 1, latest end_on per name, not voided
            $visits      = $this->lastVisits->forVehicles($active);          // 1, WO (service) + imported, latest by date

            $rows = [];
            foreach (EnrolledServiceSnapshot::groupByVehicle($services) as $vehicleId => $vehicleServices) {
                $meters = MeterEstimates::of(
                    $this->estimator->estimate(Meter::Mileage, $readings->for($vehicleId, Meter::Mileage), $today, $vehicleServices[0]->vehicleYear),
                    $this->estimator->estimate(Meter::EngineHours, $readings->for($vehicleId, Meter::EngineHours), $today, $vehicleServices[0]->vehicleYear),
                );
                foreach ($vehicleServices as $service) {
                    $cycle    = $this->cycles->replay($service, $completions->for($service->id));
                    $resolved = $this->resolver->resolve($service->terms, $cycle, $meters, $certs->for($vehicleId, $service->normalizedName));
                    $rows[]   = DueProjectionRow::from($service, $resolved, $meters, $cycle, $visits->for($vehicleId), $triggeringReadingId, $this->clock->now());
                }
            }
            $this->writer->replaceForVehicles($chunk, $rows);                // DELETE + multi-row INSERT
        }
    }

    /**
     * Sliding 24-month window refresh (S11-R26, NFR-014). Caller: the nightly `maintenance:projection:refresh`
     * (TD-22). The caller runs inside
     * OrganizationDecorator::runAs($organizationId); the id is bound and asserted equal to the decorator scope.
     * Not called from an input write: each chunk of 500 vehicles gets its own short transaction.
     */
    public function refreshExpiredWindows(Uuid $organizationId, \DateTimeImmutable $today): int
    {
        $vehicleIds = $this->expiredWindows->vehicleIdsWithWindowExpiredBy($organizationId, $today); // mdp__org_window_expires_idx
        foreach (array_chunk($vehicleIds, 500) as $chunk) {
            $this->transactional->wrap(fn () => $this->recomputeVehicles($chunk));
        }

        return count($vehicleIds);                                          // logged by the command
    }
}
```

#### Unit / Integration tests:
Backend:
- Unit `MeterEstimatorTest`: S11-E6 worked example (97.5/day, March); each guard (6 days, equal values, 400 days, above ceiling, future date, 1985 reading, older than 24 months); same-day collapse takes the higher value; measured-from-visits counts only readings in a usable pair; no usable pair → No data; one pair floor (S11-E2).
- Unit `ConfidenceTableTest`: every cell of the S11-R24 table plus the S11-E5 examples (data provider).
- Unit `CalendarMathTest`: Jan 31 + 1 month = Feb 28 (and 29 in a leap year), next cycle from Feb 28; days drift.
- Unit `CycleHistoryTest`: calendar At missed stays overdue; early and late completion keep next year's date; meter At done never returns; undone completion ignored; anchor meter values from completion, else initial.
- Unit `DueDateResolverTest`: earliest wins; tie names the higher confidence; No data meter proposes nothing; recorded reading past target → exact date; compliance due = End date, due soon = End − remind months, overdue from End + 1, precision day; no record → no due; due-soon from the largest before row.
- Unit `DueStatusTest`; `DueProjectionRecomputerTest` (fakes: query count is fixed per chunk, rows replaced, empty services deletes rows; `refreshExpiredWindows()` recomputes only vehicles with `window_expires_on ≤ today`, chunked by 500, and returns the count).
- Functional `tests/Functional/VehicleService/Maintenance/ProjectionRecomputeTest.php`: enrol → rows; reading via dialog moves a meter due; compliance record moves the due (S8-E4); remove deletes rows; archive deletes rows; recompute runs in the same transaction (forced failure after recompute rolls everything back).

Frontend:
No new specs; the existing `DueCell`/`ConfidenceMeter` specs are re-run against the P4 fixtures (see above).

#### Verification (Definition of Done gates):
- Backend: standard + migration gate. Performance check before merge: seed 18k vehicles × 10 services in a throwaway MySQL (`mysql:8.0`) and record `recomputeVehicles()` time per 500-vehicle chunk and a bulk enrol of 2,500 (NFR-009).
- Frontend: the per-phase FE gates above, plus:

Verification: `npx vue-tsc --noEmit` + `npx vitest run components/ts/maintenance/shared`. No browser-walk.

#### E2E tests (e2e/)
**Scenarios (Create): 0.** **Backlog:** none. **Reference updates:** none (no template, route or test-id change).

**§8 skip reason: `None — prop-type-rename`.** FE = types in `app/src/api/maintenance/MaintenanceModel.ts` + MSW payloads in `app/src/testing/handlers.ts`, with no template touched. P4 also hits none of the §9 paths (no `.vue`, nothing under `pages/`/`components/`/`router/`, no `*Controller.php`; BE adds CLI commands, DBAL fetchers and subscribers only), so CI requires no block at all. Use the string if the orchestrator produces one anyway.

**Dev-layer (Test Layer = Dev):** the engine is BE unit by construction (gate 1): `MeterEstimatorTest`, `ConfidenceTableTest` (every S11-R24 cell), `CalendarMathTest`, `CycleHistoryTest`, `DueDateResolverTest`, `DueStatusTest`; projection recompute in-transaction (be-functional `ProjectionRecomputeTest.php`); `DueCell`/`ConfidenceMeter` against the P4 fixtures (fe-unit).

### Phase P5: Asset Maintenance tab

**Implements:** BE: S9, S11 display rules, S21 for skip. FE: S9, S6-R13/R14 UI, S21 for these actions. Requirement IDs traced to P5 in Section 10: S3-N2, S5-R8, S6-R13, S6-R14, S7-R1, S7-E4, S9-R1, S9-R2, S9-R4, S9-R5, S9-R6, S9-R7, S9-R9, S9-R10, S9-R11, S9-R12, S9-R13, S9-R14, S9-R16, S9-R18, S9-N1, S9-N2, S9-N3, S9-E1, S9-E2, S9-E4, S11-R9, S11-R10, S11-R11, S11-R12, S11-R13, S11-R17, S11-R18, S11-R25, S11-N3, S11-E1, S12-R7, S12-N2, S21-R1, S21-R3, S21-R4, S21-R6, S21-R7, S21-N1, S21-N2, S21-E2, NFR-001, NFR-002, NFR-004, NFR-012, NFR-013, NFR-015, NFR-016, NFR-021, NFR-F01, NFR-F03, NFR-F04, NFR-F05, NFR-F06, NFR-F07, NFR-F09, NFR-F10, NFR-F11.

**Depends on:** P4 (projection rows), P3 (reading dialog mounted here), P2 (single-asset enrolment mounted here; A14 removal).

#### Database changes:
None.

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/Application/Query/AssetTab/GetAssetMaintenanceQuery.php` + `Application/Handler/AssetTab/GetAssetMaintenanceQueryHandler.php` | Create | Builds the tab DTO: meter cards (estimator over the vehicle's readings, rounded estimate per S11-R12, `ratePerWeek` S11-R18, confidence from `ConfidenceTable` with today's age), rows from the projection (all of the vehicle's active enrolments, any workplace: GR-1), `status`, enrolments list. `completed` only for a `work_order`/`elsewhere` latest effective completion; `undoable` = that completion is the latest effective one (S18-R17, S18-N8) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalAssetMaintenanceFetcher.php` | Create | Projection rows for one vehicle (`mdp__org_vehicle_idx`) + enrolment and company names; latest in-shop reading per meter |
| `src/VehicleService/Maintenance/Application/Query/AssetTab/GetCandidatesQuery.php` + handler | Create | Candidates JSON with confidence graded at read |
| `src/VehicleService/Maintenance/Application/Command|Handler/Skip/SkipServiceCommand(+Handler)`, `UnskipServiceCommand(+Handler)` | Create | `Transactional`; `EnrolledService::skip()/unskip()`; `DueProjectionWriter::updateSkip()`; audit (S21-R1 skips) |
| `src/VehicleService/Maintenance/Application/EventListener/ClearRoutineSkipsOnMeterReadingRecordedSubscriber.php` | Create | S9-R18 routine: clear skips on the vehicle's routine services (set-based UPDATE on enrolled services + projection), audit as automatic |
| `src/VehicleService/Maintenance/Application/EventListener/UpdateMaintenanceOnWorkOrderCreatedListener.php` | Create | `#[AsEventListener]` on `WorkOrders\Domain\Event\WorkOrderCreatedEvent`: clear routine skips (S9-R18) and set `last_visit_workplace_id` for the vehicle (S13-R27); catch and log (NFR-021: WO create has no transaction) |
| `src/VehicleService/WorkOrders/Domain/Event/WorkOrderVehicleSwitchedEvent.php` | Create | Dispatched by `VehicleSwitchCommandHandler` after the switch (`fromVehicleId`, `toVehicleId`, `workOrderId`) |
| `src/VehicleService/WorkOrders/Application/HTTP/VehicleSwitch/VehicleSwitchCommandHandler.php` | Modify | Dispatch the event through `DomainEventBus` |
| `src/VehicleService/Maintenance/Application/EventListener/UpdateMaintenanceOnWorkOrderVehicleSwitchedSubscriber.php` | Create | Unskip routine services of the new vehicle; recompute location for both vehicles |
| Compliance record handlers (P2) | Modify | Clear compliance skips for that vehicle and normalized service name on add/correct (S9-R18) |
| `src/VehicleService/Maintenance/UI/HTTP/AssetTab/*Controller.php` + `DTO/` | Create | A24 (`GET /api/vehicles/{id}/maintenance`, `ReadingCardDto`/`ServiceRowDto` with `DueDto`), A25, A26 (POST/DELETE skip) |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `api/maintenance/*` | Modify | A24–A26 |
| `router/routes.ts` | Modify | Child `{ path: 'maintenance', name: 'VehicleMaintenanceTab', component: EmptyTabView }` after :597; no `beforeEnter` (the parent `requiredCheck`, customers view, is the gate) |
| `components/ts/customers/VehicleInvoices.vue` | Modify | `navigationTabs` gains `{name: 'maintenance', label: 'Maintenance', counter: 0, path: 'VehicleMaintenanceTab'}`, **last**, after Notes, only when `access.canView` (S9-R16). `tabForRouteName` maps `VehicleMaintenanceTab` → `'maintenance'`. 4th `q-tab-panel` mounts `VehicleMaintenanceTab` (async) with `VehicleTabsBar` in its header. ShopCoach `v-if` excludes the maintenance tab the same way it excludes notes |
| `components/ts/maintenance/asset/VehicleMaintenanceTab.vue` | Create | `QueryState` around `useAssetMaintenanceQuery(vehicleId)` (A24 rejects a `companyId` param: the tab shows every enrolment of the asset; `?companyId=` stays on the URL only for tab navigation and to preselect the customer in enrolment). Not enrolled and no records → "This unit is not on a maintenance schedule" + Enroll in Schedule (S9-R14). Otherwise: "Enter mileage" button → `ReadingDialog` (S9-E2); two `ReadingCard`s; services table/cards; the schedule menu per enrolment (Remove from schedule). The tab root exposes `:data-loading="isFetching"` (D22, NFR-F12) |
| `components/ts/maintenance/asset/ReadingCard.vue` | Create | Mileage left, hours right. Recorded value exact with source + age (S9-R1, R2), "In the shop". Estimate: rounded value, "Estimated" badge, "640 a week" (S11-R18), "Measured from N visits" (S11-R25), `ConfidenceMeter` (S11-R10). No data state (S11-R17) |
| `components/ts/maintenance/asset/MaintenanceServicesTable.vue` | Create | `Table`, flat, sorted by due (S9-R4). Columns Service (+ schedule chip when `showScheduleChip`, S9-E1), Interval (`intervalFormat`), Due (`DueCell`, S9-R5, R12), Last done (with label kind, S9-R6), Status (`DueBadge`, S9-R7). Row menu via `ResponsiveActionMenu` |
| `components/ts/maintenance/asset/MaintenanceServiceCardMobile.vue` | Create | Phone card per row (`lt.md`) |
| `components/ts/maintenance/asset/serviceRowActions.ts` | Create | Pure: builds `MenuAction[]` from a row + access + phase capability flags. Routine: Mark complete, Create work order, Skip, Other triggers (S9-R9). Compliance: Mark complete, Create work order, Skip (S9-R11). Skipped: Undo skip (+ "+ Add record" for compliance, S9-R13). Completed + undoable: Undo complete (S18-R17). Mark complete is wired in P6, Create work order in P7 (§2.11) |
| `components/ts/maintenance/asset/OtherTriggersMenu.vue` | Create | Lazy `useCandidatesQuery` on open, lists every candidate with date + trigger, the winner marked (S9-R12, S12-R7, N2) |
| `components/ts/maintenance/asset/RemoveFromScheduleDialog.vue` | Create | `BaseDialog`, exact copy "Remove {unit} from {schedule}? Its maintenance history is kept. Its reminders from this schedule stop." Red, `:async-confirm` (S6-R13, R14) |
| `components/ts/maintenance/enrolment/EnrolmentDialog.vue` | Modify | Mounted in `mode="asset"` from the tab (the single entry point) |

#### Key code changes:
Frontend:

**Code sketch: Due cell + confidence meter (render only)**

```vue
<!-- DueCell.vue -->
<template>
  <div class="due-cell" :data-test-id="`maintenance_due_${testKey}`">
    <div class="due-cell__date">{{ due.noRecord ? copy.noRecord : formatDueDate(due) }}</div>
    <div class="due-cell__basis text-caption">
      <ConfidenceMeter v-if="isEstimate" :confidence="due.confidence" :basis="due.basis" :vehicle-id="vehicleId" :test-key="testKey" />
      <span v-else-if="due.needsReadings.length">{{ copy.calendarNeeds(due.needsReadings) }}</span>  <!-- "Calendar · needs mileage reading" / "… mileage and engine hours readings" -->
      <span v-else-if="due.basis === 'certificate'">{{ copy.certificate }}</span>
      <span v-else-if="!due.noRecord">{{ copy.calendar }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{ due: DueDto; vehicleId: UUID; testKey: string }>();
const isEstimate = computed(() => (props.due.basis === 'mileage' || props.due.basis === 'hours') && props.due.confidence !== null);
</script>
```
```ts
// formatDue.ts: precision is BE-owned: 'month' only for meter estimates; certificates arrive as 'day' (End date, S11-R13)
export const formatDueDate = (due: DueDto): string =>
  due.date === null ? '' : due.precision === 'month' ? formatMonthYear(due.date) : formatOrgDate(due.date);
```
```vue
<!-- ConfidenceMeter.vue -->
<HoverCard :test-id="`maintenance_confidence_${testKey}`" :aria-label="`${label} confidence`">
  <template #trigger>
    <span class="confidence-meter" :class="`confidence-meter--${confidence}`">   <!-- low = grey/amber, never negative (S9-R17) -->
      <i v-for="n in 3" :key="n" :class="{ on: n <= level }" /> {{ label }} confidence
    </span>
  </template>
  <div>{{ copy.basedOn(basis) }}</div>                       <!-- "based on mileage estimate" (S11-R9, S11-R11) -->
  <div class="text-caption">{{ copy.estimateDisclaimer }}</div>  <!-- S11-R27 verbatim -->
  <router-link :to="{ name: 'VehicleWorkOrdersTab', params: { id: vehicleId }, query: route.query }"
               data-test-id="maintenance_confidence_view_work_orders">View work orders</router-link>
</HoverCard>
```

#### Unit / Integration tests:
Backend:
- Unit `GetAssetMaintenanceQueryHandlerTest`: rounding to 100/10; recorded shown exactly; `ratePerWeek`; confidence age from today; no enrolment → empty `enrolments`; an invoice completion → `completed: null`, `lastDone.kind = invoice`.
- Unit skip/unskip handlers; listener tests for auto-clear (routine on reading and new WO; compliance only on record change; a compliance skip survives a new reading).
- Functional `AssetTabEndpointsTest`: rows from a schedule at another workplace are visible; foreign vehicle 404; skip hides from the projection's worklist predicate but keeps the row on the tab; `WorkOrderCreatedEvent` clears a routine skip.

Frontend:
- `serviceRowActions.spec.ts`: the routine/compliance/skipped/completed matrices, permissions hide actions, phase flags.
- `VehicleMaintenanceTab.spec.ts`:
  - not-enrolled state + Enroll opens the modal in asset mode;
  - A24 is requested **without** a `companyId` param even when the URL has `?companyId=`;
  - `DueCell` renders "needs mileage and engine hours readings" when `needsReadings` has both;
  - a certificate-based row renders the End date as a day ("14 Oct 2026") with caption "Certificate";
  - error → Retry;
  - rows sorted as returned;
  - Skip → grey Skipped + Undo skip;
  - Remove from schedule copy;
  - every mutation calls `invalidateMaintenanceForAsset`.
- `ReadingCard.spec.ts` (recorded vs estimate vs No data vs In the shop), `OtherTriggersMenu.spec.ts` (all candidates, none hidden).
- `VehicleInvoices.spec.ts` (extend): Maintenance is the last tab for a customers-view user. The default landing is still Work Orders. `VehicleMaintenanceTab` route → `selectedTab === 'maintenance'`.

#### Verification (Definition of Done gates):
- Backend: standard + smoke (`/api/vehicles/{id}/maintenance`).
- Frontend: the per-phase FE gates above, plus:

**Browser-walk (P5):**
1. `admin`:
   - `/customers/vehicle/<id>/maintenance?companyId=<cid>` for an un-enrolled asset → empty state → Enroll (single mode, prefilled dates, compliance row "No record + Add record") → rows appear sorted by due;
   - Enter mileage → dialog → enter a lower value → orange confirm → save → Undo toast; Undo reverts;
   - reading cards show recorded/estimated + confidence; hover/focus/tap the meter opens the card with "View work orders";
   - row menu → Other triggers lists every candidate;
   - Skip → grey Skipped; Undo skip;
   - schedule menu → Remove from schedule → rows leave.
2. Asset on two schedules → schedule chips.
3. `tech` (view-only on customers if configured): no write actions.
4. Phone 390 px: cards + action sheet; the confidence card opens as a sheet on tap.
5. Regression: the Work Orders, Invoices and Notes tabs and the asset card behave as on develop; at 390 px the tab bar scrolls and every tab is reachable (R5-1).

#### E2E tests (e2e/)
Spec folder `e2e/tests/ui/maintenance-reminders/`, project `maintenance-reminders`, conventions in Section 7. **Scenarios (Create): 4 of 5 slots (ranked).**

**P5-1 `asset-tab-enrol.spec.ts`: Admin enrolls an asset from its empty Maintenance tab and sees its services with due status.**
- Type: Happy path. Reqs: S9-R16, S9-R14, S7-R1, S7-R2, S7-R4, S7-R6, S7-R7, S7-R8, S9-R4, S9-R5, S9-R6, S9-R7, S9-N3 (needs-reading basis), S6-R1, S7-N2. Role: admin. Priority **P3**.
- Gate 4: real enrolment → synchronous projection → rendered status. Neither the mock nor the API alone shows the agreement.
- Preconditions: Fresh customer + contact + vehicle with no readings. Schedule via API: "Oil" (calendar Every 6 months + mileage Every 10,000, 1 canned line) + compliance "CVIP" term 12.
- Steps:
  1. `/customers/vehicle/<vid>?companyId=<cid>`. Expected: lands on Work Orders; `vehicle_tab_maintenance` is the last tab.
  2. `vehicle_tab_maintenance`. Expected: `maintenance_asset_not_enrolled` + `button_maintenance_asset_enroll`.
  3. Enroll → schedule → for "Oil" set `input_maintenance_enrolment_last_done_<id>` = today − 8 months. Expected: the CVIP row shows "No record" + "+ Add record".
  4. Confirm. Expected: `table_maintenance_asset_services` with an "Oil" row whose `maintenance_badge_<id>` = Overdue and whose `maintenance_due_<id>` reads "Calendar · needs mileage reading"; the CVIP row reads "No record" with no badge.
- Expected result: Single-asset enrolment produces projection rows whose status, due basis and order render on the tab.
- Page objects / factories: Create `e2e/src/pages/customers/vehicle-maintenance.page.ts` (tab body, rows by `enrolledServiceId`, `rowAction(verb,id)`, reading cards). Extend `vehicle.page.ts` (`maintenanceTabLink`) and the `AssetTab` union in `vehicle-inspections.page.ts` with `'maintenance'`. Reuse `maintenance-enrolment.dialog.ts` (asset mode). Factories: `MaintenanceFactory.createSchedule/getAssetMaintenance`.

**P5-2 `asset-reading-dialog.spec.ts`: Admin enters a mileage reading, confirms a lower value, and undoes it.**
- Type: Happy path. Reqs: S10-R1, S10-R2, S10-R6, S10-R9, S10-N1, S10-N2/N3, S10-R7, S9-R1, S9-R2, S9-E2, S10-R4. Role: admin. Priority **P3**.
- Preconditions: Enrolled vehicle (API). One reading 50,000 recorded through `MaintenanceFactory.recordReadings`.
- Steps:
  1. Maintenance tab → `button_maintenance_enter_mileage`. Expected: `dialog_maintenance_reading` with the current 50,000 on the left (source + age).
  2. Type 49,000 in `input_maintenance_reading_mileage`. Submit. Expected: the orange `maintenance_reading_warning_mileage` appears (not red); nothing saved yet.
  3. `button_maintenance_reading_confirm_anyway`. Expected: dialog closed; `maintenance_reading_card_mileage` shows 49,000 recorded; the undo toast is shown.
  4. `button_notification_undo`. Expected: the card shows 50,000 again.
- Expected result: The reading saves without validation, flags lower values, and undo reverts the vehicle value.
- Page objects / factories: Dialog: create `e2e/src/pages/dialogs/maintenance-reading.dialog.ts`.

**P5-3 `asset-skip-service.spec.ts`: Admin skips a routine service, and a new reading brings it back.**
- Type: Edge case (server-driven auto-clear). Reqs: S9-R13, S9-R18, S9-E4, S21-R1. Role: admin. Priority **P2**.
- Gate 4: the auto-clear is a BE subscriber (`ClearRoutineSkipsOnMeterReadingRecordedSubscriber`) whose effect has to show up on the tab after a UI reading.
- Preconditions: Enrolled vehicle with routine service "Oil" (API).
- Steps:
  1. Row menu → `maintenance_asset_action_skip_<id>`. Expected: the row stays, the badge reads Skipped (grey), and the date is unchanged.
  2. Row menu shows `…undo_skip_<id>`; click it. Expected: the badge returns to the prior status.
  3. Skip again → Enter mileage (any value) → save. Expected: the "Oil" badge is no longer Skipped.
- Expected result: Skip is reversible by hand and cleared automatically by a new reading.

**P5-4 `asset-remove-from-schedule.spec.ts`: Admin removes an asset from a schedule while its compliance record stays.**
- Type: Happy path. Reqs: S6-R13, S6-R14, S8-R8, S6-E1. Role: admin. Priority **P3**.
- Preconditions: Vehicle enrolled (API) in a schedule with a compliance service; one compliance record via API.
- Steps:
  1. Maintenance tab → `maintenance_schedule_menu_<enrolmentId>` → `maintenance_schedule_action_remove_<enrolmentId>`. Expected: `dialog_maintenance_remove_from_schedule` with the exact copy "Remove {unit} from {schedule}? …"; red confirm.
  2. Confirm. Expected: the schedule's rows leave; the not-enrolled state shows.
  3. Asset card. Expected: the compliance record line is still present.
- Expected result: Removal soft-ends tracking without losing history.

**Backlog:** 1 (asset tab role gate; Section 7 Backlog). **Reference updates:** R5-1 to R5-3 (one edit, two verify-only). **§8 skip:** n/a.

**Dev-layer (Test Layer = Dev):** A24 rejects `companyId` (fe-unit `VehicleMaintenanceTab.spec.ts`); rounding to 100/10, `ratePerWeek`, confidence age (be-unit `GetAssetMaintenanceQueryHandlerTest.php`); reading card recorded/estimate/No data/In the shop (fe-unit `ReadingCard.spec.ts`; estimates cannot be seeded through the UI: see testability note B5); Other triggers lists every candidate (S9-R12, S12-R7/N2): fe-unit `OtherTriggersMenu.spec.ts` + be-functional; two schedules → two rows + chips (S9-E1): be-functional + fe-unit; Maintenance tab is the last tab for a customers-view user: fe-unit `VehicleInvoices.spec.ts`; low confidence never red (S9-R17): fe-unit; skip hides from the worklist predicate (be-functional `AssetTabEndpointsTest.php`; UI covered in P7-4); WO created clears a routine skip (be-functional).

### Phase P6: Completion, work-order link, automatic reset, lifecycle

**Implements:** BE: S18 subset, S16/S17/S22 subset, S13-R26/R30, S7-E6, S13-E5, S16-E3 merge half (Mark complete + undo, work-order ↔ service link, line append, automatic reset on invoicing, unlink/delete/merge handling, the line-close date fix). FE: S18 subset (Mark complete dialog on the asset tab). Requirement IDs traced to P6 in Section 10: S4-E1, S4-E2, S7-E6, S9-R9, S9-R11, S10-R11, S12-R10, S12-R11, S12-R12, S12-E1, S12-E5, S13-R17, S13-R26, S13-R30, S13-R38, S13-E5, S16-R19, S16-R20, S16-R22, S16-R23, S16-N4, S16-N6, S16-N7, S16-N9, S17-R2, S17-R5, S17-R6, S17-R7, S17-R8, S18-R1, S18-R2, S18-R3, S18-R4, S18-R5, S18-R6, S18-R7, S18-R9, S18-R10, S18-R11, S18-R12, S18-R13, S18-R17, S18-R18, S21-R1, S21-R2, S21-R3, S21-R4, S21-R6, S21-R7, S21-N1, S21-N2, S21-E1, S21-E2, S22-R1, NFR-001, NFR-002, NFR-005, NFR-012, NFR-013, NFR-015, NFR-016, NFR-019, NFR-020, NFR-023, NFR-F01, NFR-F04, NFR-F05, NFR-F06, NFR-F07, NFR-F09, NFR-F10, NFR-F11.

**Depends on:** P4 (recompute), P3 (`MeterReadingRecorder`, `recordElsewhere`; `WorkOrderReadingSettler` is created here on P3's repository), P5 (FE: the asset tab hosts Mark complete).

#### Database changes:
| Table | Change |
|---|---|
| `maintenance_work_order_service`, `maintenance_work_order_service_line` | Create (migration P6); two hand FKs added to `MANUALLY_MANAGED_FOREIGN_KEYS` |
| `maintenance_service_completion` | `ADD COLUMN reset_basis VARCHAR(16) NULL, ADD COLUMN undone_reason VARCHAR(24) NULL, ALGORITHM=INSTANT` + `CREATE INDEX mcomp__invoice_id_idx (invoice_id) ALGORITHM=INPLACE LOCK=NONE` (same P6 migration; mapped in `ServiceCompletion.orm.xml`; NFR-022) |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/WorkOrders/Application/Line/UpdateLineData/ChangeCommandHandler.php` | Modify | TD-18: `$line->markAsCompleted()`; failing test first (bug-fix rule) |
| `tests/Functional/VehicleService/WorkOrders/LineCompletionStampsEndDateTest.php` | Create | One test per closing path named in S18-R10 (complete the line, bulk action bar, create invoice, clock out, review) plus the required-data path, each asserting `end_date` is set. Known code paths: `Domain/Line/Service/LineStatusManager.php:62`, `Domain/Line/CompleteLineIfTaskWasFinished.php:23`, `Application/Handler/WorkOrder/SimpleCompleteWorkOrderCommandHandler.php:123`; the implementer confirms which of these the bulk bar and invoice creation route through before writing the tests (S18-R9, R10) |
| `src/VehicleService/WorkOrders/Application/Service/ServiceWorkOrderOpener.php` | Create | Extracted from `Create/CreateCommandHandler.php` (number allocation, `new WorkOrder(...)`, SA assignment, `recordMileageChange()`/`recordEngineHoursChange()` when values are present, save, `WorkOrderCreatedEvent`); input `OpenServiceWorkOrderInput` (pure data). For a WO created from a row the input carries the asset's mileage/hours and passes them as both the value and `previous` (TD-14, TD-34), so the copy records no reading |
| `src/VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php` | Modify | Delegates to the opener; technician check and appointment scheduling stay here (order unchanged) |
| `src/VehicleService/WorkOrders/Application/Service/CannedLineAppender.php` | Create | Extracted from `Line/CreateFromCannedLine/CreateCommandHandler.php:45-128`: `append(WorkOrder, CannedLine, ?LineStatus): Line` (labor type resolved to the current location, history entries, `LineChangedStatusToAuthorized`, `LineCreatedEvent`). Adds `appendCopy(WorkOrder, CannedLine, string $internalNote): Line` beside it (TD-32, sketch 8b): local labour type (same id → same name → default), no fixed price, `LineCreated` with `cannedLineId = null` (no parts, adjustments, inspections), `createdFromCannedLine = true`, one internal line note |
| `src/VehicleService/WorkOrders/Application/Line/CreateFromCannedLine/CreateCommandHandler.php` | Modify | Delegates to the appender |
| `src/VehicleService/Maintenance/Domain/Model/WorkOrderServiceLink.php`, `LinkPath.php`, `LinkState.php`, `CreatedVia.php` | Create | Link root; `open()`, `markReset(completionId)`, `markOrphaned()`, `markDeclined()`. `LinkState::Unticked` and `LinkState::Removed` reserved (Plan 2 writes them; `removed` = S16-R25 Undo/Remove) |
| `src/VehicleService/Maintenance/Domain/Repository/WorkOrderServiceLinkRepository.php`, `Infrastructure/Persistence/Repository/Dbal/DbalWorkOrderServiceLinkRepository.php`, `Infrastructure/Persistence/Repository/Doctrine/WorkOrderServiceLink.orm.xml`, `WorkOrderServiceLinkLine.orm.xml` | Create | TD-08. `hasLiveWorkOrder()` = `state IN ('open','reset')` (a positive list, so a `removed` link never counts) |
| `src/VehicleService/Maintenance/Domain/Model/ServiceCompletion.php` | Modify | Factories `onWorkOrder()`, `elsewhere()`, `fromInvoice(proposed: true)`, `covered(byCompletion)`; reset date ≤ today invariant |
| `src/VehicleService/Maintenance/Domain/Service/ResetDateProposal.php` | Create | Lines all closed → latest `end_date` (local date, ≤ invoice date); a declined line is ignored; all lines declined → no reset (S17-N2); no lines left → invoice date (S18-R13, S16-N4) |
| `src/VehicleService/Maintenance/Application/Service/AppendServiceLinesToWorkOrder.php` | Create | Sketch 8. For each service, each live canned line of the **home** workplace in order (`HomeCannedLineFetcher`, GR-7), skipping ids already added on this WO by any MR link (S17-R8, S12-R12); **home vs copy mode** per service: `home_workplace_id == wo.workplace_id` → `CannedLineAppender::append()`, else `appendCopy()` with the `CopiedLineNote` text (S13-R30, S16-N6, S16-R22, S16-R23; one-workplace orgs never copy, S16-N9); guard: WO not invoiced/paid (S16-N7); a service with no live canned lines gets a `no_lines` link; writes link + link lines, one short internal WO note "{service} added from {schedule}" that never mentions copying (`Note::create(..., Source SYSTEM, Type WORK_ORDER, customerVisible: false)`, S17-R5, S21-R2) and `entity_event` (S17-R6). Returns `AppendResult {linesAddedCount, linesSkippedAsDuplicateCount, copied, perService[]}` (the Plan 2 Q2 result object lives here) |
| `src/VehicleService/Maintenance/Domain/Service/CopiedLineNote.php` | Create | Pure text builder (S16-R23): "Copied from {home}. Parts used there, for reference:" + `{qty} × {description} · {part number}` per part; fixed price: "Copied from {home}. Fixed price there, priced at {local}'s rate here"; no parts: "Copied from {home}." Unit-tested |
| `src/VehicleService/Maintenance/Domain/Repository/HomeCannedLineFetcher.php`, `Infrastructure/Persistence/Query/Dbal/DbalHomeCannedLineFetcher.php` | Create | Live canned lines of a service with their parts (description, part number, quantity), `organization_id` + `workplace_id = home` (GR-7); price columns never selected; deleted ids dropped (S4-E2) |
| `src/VehicleService/Maintenance/Application/Command|Handler/WorkOrder/CreateWorkOrderForEnrolledServiceCommand(+Handler)` | Create | Sketch 7 |
| `src/VehicleService/Maintenance/Application/Command|Handler/Completion/MarkServiceCompleteCommand(+Handler)`, `UndoCompletionCommand(+Handler)` | Create | `Transactional`: completion (+ covered, S18-R7), optional reading through `MeterReadingRecorder::recordElsewhere()` (S18-R4), optional `ComplianceRecord` (S18-R5: Start/End dates; when the body has no date, Start defaults to `reset_on` and End = Start + term), link `mark_complete`→ when `where=work_order`, the WO's open `lines` link for this service is marked `reset` so invoicing changes nothing (S18-E8); path `work_order`: `WorkOrderReadingSettler::settle(workOrderId)` **before** writing the completion, so its anchors read the settled reading (S18-R19, S12-E5 order); recompute, audit. Undo: refuse unless the path is `work_order`/`elsewhere` (409 `CompletionNotUndoableError`, S18-N8); refuse if a later effective completion exists; set `undone_at` on it and its covered completions, void the record it created, remove the reading it wrote, reopen the link; after undo of a `work_order` completion, `settle(workOrderId)` again; recompute |
| `src/VehicleService/Maintenance/Application/Query|Handler/Completion/ListCompletionWorkOrdersQuery(+Handler)`, `Infrastructure/Persistence/Query/Dbal/DbalCompletionWorkOrderFetcher.php` | Create | A27 picker (GR-2), fields `{id, number, displayNumber, workplaceId, workplaceName, createdOn (= start_date), status, invoicedOn, linesClosedOn, defaultResetOn}`: `work_order` of type service for the vehicle, org-scoped (`OrganizationDecorator` on `wo.organization_id`, no workplace filter), LEFT JOIN `invoice`, LEFT JOIN `workplace` for the name; lines-closed date from this service's link lines, if any |
| `src/VehicleService/Maintenance/Application/EventListener/ResetMaintenanceOnInvoiceCreatedSubscriber.php` | Create | Sketch 5 |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalInvoiceFacts.php`, `DbalLineCloseDates.php` | Create | Invoice id, `created_on` as a local date in the WO workplace's timezone, WO final mileage/hours, vehicle; `end_date` and status per line id |
| `src/VehicleService/MeterReadings/Application/Service/WorkOrderReadingSettler.php` | Create | TD-35. Reads the facts through the `WorkOrderReadingContext` port, extended with `liveInvoiceOn` (exists and not VOID) and `effectiveMarkCompleteResetOns` (a Maintenance read exposed through a new port `WorkOrderCompletionDates` in MeterReadings/Domain/Repository, implemented in Maintenance/Infrastructure, so MeterReadings never imports Maintenance). Recorded at the earliest of the live invoice date and the effective Mark-complete Reset dates, else `in_shop` at the WO start date; never changes the value; never creates a row; audit old/new per changed row (S21-R4) |
| `src/VehicleService/MeterReadings/Domain/Repository/WorkOrderCompletionDates.php` + `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderCompletionDates.php` | Create | Port + adapter: effective (`undone_at IS NULL`) `work_order`-path completion Reset dates on a WO, org-scoped (TD-35) |
| `src/VehicleService/Maintenance/Domain/Error/CompletionNotUndoableError.php` | Create | `ConflictError` (409): A29 on an `invoice`, `covered` or `enrolment` completion (S18-N8) |
| `src/VehicleService/Vehicles/Domain/Event/VehicleUnlinkedFromCompanyEvent.php`, `VehicleReassignedEvent.php` | Create | TD-19 (`vehicleId`, `companyId`; `fromVehicleId`, `toVehicleId`, `companyId`, `fromVehicleDeleted`) |
| `src/VehicleService/Vehicles/Application/HTTP/Delete/DeleteCommandHandler.php` | Modify | Dispatch `VehicleUnlinkedFromCompanyEvent` inside its `wrapInTransaction` after the unlink |
| `src/VehicleService/Vehicles/Application/HTTP/Merge/MergeCommandHandler.php`, `src/VehicleService/Vehicles/Domain/Service/VehicleManager.php` (`mergeVehicles()`), `src/VehicleService/Vehicles/Application/HTTP/Change/ChangeCommandHandler.php` (`createNewVehicle()`) | Modify | Dispatch `VehicleReassignedEvent` inside their transactions |
| `src/VehicleService/Maintenance/Application/EventListener/EndEnrolmentsOnVehicleUnlinkedSubscriber.php`, `EndEnrolmentsOnCompanyDeletedSubscriber.php`, `MoveMaintenanceOnVehicleReassignedSubscriber.php` | Create | Set-based: end enrolments (`customer_unlinked`, `customer_deleted`) + delete projection rows (S7-E6, S13-E5). Reassign: move the company's enrolments to the target vehicle; where the target already has an active enrolment on the same schedule for that company, keep the one with the later effective completion and end the other `merged` (S16-E3); move completions, compliance records, links and readings when the source vehicle is deleted, otherwise only rows tied to the moved enrolments and the moved WOs; recompute both vehicles |
| `src/VehicleService/Maintenance/UI/HTTP/Completion/*Controller.php`, `UI/HTTP/WorkOrder/CreateWorkOrderForEnrolledServiceController.php` + `DTO/` | Create | A27, A28 (body `path`, `work_order_id`, `shop_name`, `reading`, `reset_on`, `certificate`; response adds `nextDueCountsFrom`, `nextDueOn`), A29 (DELETE = soft undo), A33 (body `created_via` required; response `{workOrderId, displayNumber, workplaceId, linesAdded, linesAddedCount, copiedWork, homeWorkplaceName}`) |
| `src/VehicleService/Maintenance/Application/EventListener/RevertMaintenanceOnInvoiceReversedSubscriber.php` | Create | `IntegrationEventSubscriber` on `App\Invoicing\Invoice\Domain\Event\InvoiceReversedEvent`; kill switch; catch-all + log (sketch 5b, TD-29, NFR-022) |
| `src/VehicleService/Maintenance/Application/Service/InvoiceReversalReverter.php` | Create | The undo logic, shared by the subscriber and the replay command (sketch 5b) |
| `src/VehicleService/Maintenance/UI/CLI/ReplayInvoiceReversalCommand.php` | Create | `maintenance:invoice-reversal:replay --organization=<uuid> --invoice-id=<uuid> --work-order-id=<uuid>`; runs the reverter inside `OrganizationDecorator::runAs()`; thin, untested by rule |
| `src/VehicleService/Maintenance/Domain/Model/CompletionUndoReason.php`, `ResetBasis.php` | Create | Enums for the two new completion columns |
| `src/VehicleService/Maintenance/Domain/Model/ServiceCompletion.php` | Modify (P6) | `fromInvoice(..., ResetBasis $basis)`; `undo(Uuid $by, CompletionUndoReason $reason)` (A29 passes `User`) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Repository/Doctrine/ServiceCompletion.orm.xml` | Modify (P2 file) | Map `reset_basis` and `undone_reason` as nullable `string` fields and the index `mcomp__invoice_id_idx`, so the migrations diff stays a no-op |
| `src/VehicleService/Maintenance/Domain/Service/ResetDateProposal.php` | Modify (P6) | `propose()` returns `ProposedResetDate {date, basis}` instead of a bare date; `ResetMaintenanceOnInvoiceCreatedSubscriber` stores the basis |
| `src/VehicleService/Maintenance/Domain/Repository/ServiceCompletionRepository.php`, `Infrastructure/Persistence/Repository/Dbal/DbalServiceCompletionRepository.php` | Modify (P2/P6) | `effectiveForInvoice(Uuid $invoiceId): list<ServiceCompletion>` (path `invoice`, `undone_at IS NULL`, org-bound, `mcomp__invoice_id_idx`); `laterEffectiveExists(Uuid $enrolledServiceId, ServiceCompletion $than): bool` (`reset_on > :than OR (reset_on = :than AND created_at > :created)`, `undone_at IS NULL`); `undo(ServiceCompletion, CompletionUndoReason, ?Uuid $by)`; `undoCoveredBy(Uuid $completionId, CompletionUndoReason, ?Uuid $by)` |
| `src/VehicleService/Maintenance/Domain/Model/WorkOrderServiceLink.php` | Modify (P6) | `reopen()`: `reset` → `open`, clears `reset_completion_id`; refused from `orphaned`/`declined` |
| `src/VehicleService/Maintenance/Domain/Repository/WorkOrderServiceLinkRepository.php`, `Infrastructure/Persistence/Repository/Dbal/DbalWorkOrderServiceLinkRepository.php` | Modify (P6) | `reopenByCompletion(Uuid $completionId): ?Uuid` (returns the vehicle id) |
| `src/VehicleService/MeterReadings/Domain/Repository/MeterReadingRepository.php`, `Infrastructure/Persistence/Repository/Dbal/DbalMeterReadingRepository.php` | Modify (P3) | `settleForWorkOrder(workOrderId, state, readOn)`: one UPDATE bound to `organization_id` and `source_ref_id`, returning the changed rows for the audit (TD-35) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalInvoiceFacts.php` | Modify (P6) | `workOrderStartDate(Uuid $workOrderId): ?\DateTimeImmutable` (org-scoped; null for parts WOs or no vehicle) |
| `src/EntityEvent/Domain/EntityEventType.php` | Modify (P0) | Event `reverted_by_invoice_reversal` on `MAINTENANCE_COMPLETION` (label) |
| `config/services.yaml` (Maintenance block) | Modify | Bind `maintenance.invoice_reset_enabled` into the new subscriber as well |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `api/maintenance/*` | Modify | A27 (`maintenance/enrolled-services/{id}/completion-work-orders`), A28, A29 |
| `components/ts/maintenance/completion/MarkCompleteDialog.vue` | Create | `BaseFormDialog fullscreenOnPhone`. Title "Mark {service} complete"; the (i) line and explanation copy (S18-R1); "Where was it done?" radio On a work order / Completed elsewhere (S18-R2); `OrgWorkOrderPicker`; `ResetDateField` (S18-R3, R4); `CertificateFields` for compliance with `:default-start-date="resetOn"` (Start defaults to the Reset date; End = Start + term; both editable, S18-R5); submit → toast "{service} marked complete · next due counts from {date}" with Undo (S18-R17) |
| `components/ts/maintenance/completion/OrgWorkOrderPicker.vue` | Create | Searchable, paged (20/page, A27) list of the WOs for this enrolled service's asset **from every location** (number, location, date, status badge via `colorCoding`/`workOrderStatusLabel`) (S18-R2, E2). Props `vehicleId`, `enrolledServiceId`, `preselectedWorkOrderId` (Plan 2 panel) |
| `components/ts/maintenance/completion/ResetDateField.vue` | Create | `DateInput` with max = location today (`utils/dateRanges.ts getLocationTodayStr`), required, with the offered dates as clickable chips beneath ("Lines closed 4 Sep · Use invoice date (1 Oct)"). Optional prop `idSuffix?: string` (default `''`) on `input_maintenance_reset_date${idSuffix}` and `maintenance_reset_date_offer_*${idSuffix}`; absent, the ids are unchanged. Two more optional props for Plan 2's step after invoicing (`<ResetDateField v-model :offers :id-suffix :disable>`): `offers?: DateString[]` (when passed, exactly these dates are the chips, in order; absent, the chips come from the picked WO's `linesClosedOn` / `invoicedOn` as today) and `disable?: boolean` (default `false`; disables the input and the chips). With none of the three passed, rendering and behavior are unchanged. No caller in Plan 1 passes them (Plan 2's step renders N instances) |
| `components/ts/maintenance/completion/tests/ResetDateField.spec.ts` | Modify (P6 spec) | Ids unchanged without the prop; every id suffixed with `idSuffix="_abc"`; `offers` replaces the derived chips; `disable` disables input and chips; no props → identical render |
| `components/ts/maintenance/completion/resetDateDefaults.ts` | Create | Pure: the default = the picked WO's A27 `defaultResetOn` (BE-computed: today for an uninvoiced WO, else lines-closed, else invoice date), clamped to location today; elsewhere → no default (S18-R3, R4). Offer chips come from `linesClosedOn` / `invoicedOn`, only those that are non-null |
| `components/ts/maintenance/asset/serviceRowActions.ts` | Modify | Enable Mark complete + Undo complete |
| `components/ts/maintenance/asset/VehicleMaintenanceTab.vue` | Modify | Mount `MarkCompleteDialog`. Completed rows read "Completed · next due counts from {date}" (S18-R17) |

#### Key code changes:
Backend:

Sketch 5 (invoice reset subscriber, TD-07, NFR-005):

```php
final class ResetMaintenanceOnInvoiceCreatedSubscriber implements IntegrationEventSubscriber
{
    public function __invoke(InvoiceCreatedEvent $event): void        // App\Invoicing\Invoice\Domain\Event\InvoiceCreatedEvent
    {
        if (!$this->enabled) {                                         // maintenance.invoice_reset_enabled kill switch
            return;
        }
        $workOrderId = Uuid::fromString($event->workOrderId);
        try {
            $this->connection->beginTransaction();                     // nested → SAVEPOINT inside the invoice transaction
            $facts = $this->invoiceFacts->forWorkOrder($workOrderId); // org-scoped; null for parts WOs / no vehicle
            if (null !== $facts) {
                // 1. S12-E5 / S10-R11 / TD-35: the reading first
                $this->readingSettler->settle($workOrderId);

                // 2. the resets (S18-R13 automatic half)
                $touched = [$facts->vehicleId];
                foreach ($this->links->openForWorkOrder($workOrderId) as $link) {         // state = open, path lines|no_lines
                    $service = $this->services->activeEnrolledService($link->enrolledServiceId());
                    if (null === $service) {
                        $this->links->markOrphaned($link);                               // S18-R18
                        continue;
                    }
                    $resetOn = $this->proposal->propose($this->lineDates->forLink($link), $facts->invoicedOn);
                    if (null === $resetOn) {
                        $this->links->markDeclined($link);                               // S17-N2: every line declined
                        continue;
                    }
                    $completion = ServiceCompletion::fromInvoice($service, $resetOn, $workOrderId, $facts->invoiceId,
                        $facts->anchorMileage, $facts->anchorHours, proposed: true);     // Plan 2 edits/reverts it
                    $this->completions->add($completion);
                    foreach ($service->coveredEnrolledServiceIds() as $coveredId) {      // S18-R7, S12-R11
                        $this->completions->add(ServiceCompletion::covered($coveredId, $completion));
                    }
                    $this->links->markReset($link, $completion->id());                  // "resets once" (S18-R8, E8)
                    $touched[] = $link->vehicleId();
                }
                $this->recomputer->recomputeVehicles($touched);
                $this->audit->write($this->auditEntries->forInvoiceReset($workOrderId, $facts));   // DBAL, no flush
            }
            $this->connection->commit();                               // RELEASE SAVEPOINT
        } catch (\Throwable $e) {
            try {
                $this->connection->rollBack();                         // ROLLBACK TO SAVEPOINT: invoice work untouched
            } catch (\Throwable) {
            }
            $this->logger->error('maintenance.invoice_reset_failed', [
                'work_order_id' => $event->workOrderId, 'invoice_id' => $event->invoiceId, 'exception' => $e,
            ]);
            // never rethrow: a maintenance failure must not roll back an invoice
        }
    }
}
```

Mark complete already linked to this WO marks its open link `reset` first, so the subscriber finds nothing to do
for that service (S18-E8, S18-R8 "resets once"). A WO split before Plan 2 leaves links on the original WO (documented
limitation; Mark complete covers it).

Note (VOID path): an invoice voided by adding a line to its WO raises no event; its reset stands until the WO's next
invoice, where Plan 2 Q3 reconciles it (TD-29 case 4).

Sketch 5b (invoice reversal undo, TD-29, NFR-022):

```php
final class RevertMaintenanceOnInvoiceReversedSubscriber implements IntegrationEventSubscriber
{
    public function __invoke(InvoiceReversedEvent $event): void       // published AFTER the reversal committed
    {
        if (!$this->enabled) {                                         // maintenance.invoice_reset_enabled (TD-07)
            return;
        }
        try {
            $this->reverter->revert(Uuid::fromString($event->invoiceId), Uuid::fromString($event->workOrderId));
        } catch (\Throwable $e) {
            $this->logger->error('maintenance.invoice_reversal_failed', [
                'invoice_id' => $event->invoiceId, 'work_order_id' => $event->workOrderId, 'exception' => $e,
            ]);                                                        // never rethrow: a throw here = HTTP 500 on a committed reversal
        }
    }
}

final class InvoiceReversalReverter
{
    public function revert(Uuid $invoiceId, Uuid $workOrderId): void
    {
        $this->connection->transactional(function () use ($invoiceId, $workOrderId): void {    // DBAL only, short transaction
            $actor = $this->actor->resolve();                                                    // AuditUserIdResolver; null in CLI replay
            $vehicles = [];
            foreach ($this->completions->effectiveForInvoice($invoiceId) as $completion) {     // org-scoped, path = invoice, not undone
                if ($this->completions->laterEffectiveExists($completion->enrolledServiceId(), $completion)) {
                    continue;                                                                    // superseded: the later completion decides (S18-E2)
                }
                $this->completions->undo($completion, CompletionUndoReason::InvoiceReversed, $actor);
                $this->completions->undoCoveredBy($completion->id(), CompletionUndoReason::InvoiceReversed, $actor);  // S18-R7
                $vehicles[] = $this->links->reopenByCompletion($completion->id()) ?? $completion->vehicleId();       // reset → open
            }
            // the invoice is gone: In the shop again unless an effective Mark complete On this WO keeps them recorded (TD-35)
            $this->readingSettler->settle($workOrderId);
            $vehicles[] = $this->invoiceFacts->vehicleOf($workOrderId);
            $vehicles = array_values(array_unique(array_filter($vehicles)));
            if ([] !== $vehicles) {
                $this->recomputer->recomputeVehicles($vehicles);                                 // NFR-003
                $this->audit->write($this->auditEntries->forInvoiceReversal($invoiceId, $workOrderId, $vehicles));   // NFR-010; skipped without an actor (TD-09)
            }
        });
    }
}
```

Sketch 7 (atomic create work order, TD-14, NFR-020):

```php
final class CreateWorkOrderForEnrolledServiceCommandHandler implements CommandHandler
{
    public function __invoke(CreateWorkOrderForEnrolledServiceCommand $command): CreatedWorkOrderDto
    {
        $this->transactional->begin();
        try {
            $service = $this->services->activeById($command->enrolledServiceId)      // org-scoped
                ?? throw new EnrolmentEndedError();
            if ($this->links->hasLiveWorkOrder($service->id())) {                      // S13-R14: Open, not a second Create
                throw new LiveWorkOrderExistsError();
            }
            $enrolment = $service->enrolment();
            $asset = $this->assetMeters->current($enrolment->vehicleId());            // org-scoped vehicle mileage/hours (the copy source)
            $workOrder = $this->opener->open(new OpenServiceWorkOrderInput(
                workplaceId: $command->headerWorkplaceId,                              // S13-R38
                companyId: $enrolment->companyId(),                                    // the enrolment's customer, S7-R23
                customerId: $this->preferredContact->for($enrolment->vehicleId(), $enrolment->companyId()),
                vehicleId: $enrolment->vehicleId(),
                mileage: $asset->mileage(), engineHours: $asset->engineHours(),        // TD-14 (Q13 ✅, S13-R38): copied like any WO;
                previousMileage: $asset->mileage(), previousEngineHours: $asset->engineHours(), // TD-34: a copy, never a reading (S10-N6)
                user: $command->user,
            ));                                                                        // estimate status, S13-R30
            $result = $this->appendLines->append($workOrder, [$service], $command->createdVia);   // home: lines; elsewhere: copied work (S13-R30, S16-N6)
            $this->transactional->commit();

            return new CreatedWorkOrderDto((string) $workOrder->getId(), $workOrder->getDisplayNumber(),
                $result->linesAddedCount, copiedWork: $result->copied, homeWorkplaceName: $service->homeWorkplaceName());
        } catch (\Throwable $e) {
            $this->transactional->rollBack();
            throw $e;
        }
    }
}
```

There is no `linkWithoutLines()`: a service with no canned lines gets a `no_lines` link inside `append()`.

Note: `WorkOrderCreatedEvent` subscribers (default adjustments, default part-sale line, snapshot) now run inside this
transaction. A rollback after the snapshot subscriber wrote to S3 leaves an orphan object, which is harmless; verify
in the characterization test that none of them commits on its own.

Sketch 8 (`AppendServiceLinesToWorkOrder`, home vs copy mode, TD-32):

```php
final class AppendServiceLinesToWorkOrder
{
    /** @param list<EnrolledService> $services */
    public function append(WorkOrder $wo, array $services, CreatedVia $via): AppendResult
    {
        if ($wo->getStatus()->isInvoiced() || $wo->getStatus()->isPaid()) {
            throw new WorkOrderInvoicedError();                                            // S16-N7
        }
        $onWo   = $this->linkLines->cannedLineIdsOnWorkOrder($wo->getId());               // S17-R8; live links (+ removed links' surviving lines if PQ-25 = re-attach)
        $result = AppendResult::empty();
        foreach ($services as $service) {
            $refs = $this->homeLines->liveForService($service);                            // org + home workplace; deleted ids dropped (S4-E2); GR-7
            if ([] === $refs) {
                $result = $result->withLink($this->links->openNoLines($wo, $service, $via));
                continue;
            }
            $copy = !$service->homeWorkplaceId()->equals($wo->getWorkplaceId());           // S16-N6; one-workplace orgs never copy (S16-N9)
            $link = WorkOrderServiceLink::open($wo, $service, LinkPath::Lines, $via);
            foreach ($refs as $ref) {
                if (isset($onWo[$ref->cannedLineId])) { $result = $result->skipped(); continue; }       // S17-R8
                $line = $copy
                    ? $this->appender->appendCopy($wo, $ref->cannedLine,
                        $this->copyNote->for($ref, $service->homeWorkplaceName(), $wo->workplaceName()))  // S16-R22, R23
                    : $this->appender->append($wo, $ref->cannedLine);                                       // S16-R19
                $link->addLine($line->getId(), $ref->cannedLineId);
                $onWo[$ref->cannedLineId] = true;
            }
            $this->links->add($link);
            $this->notes->addInternalWorkOrderNote($wo, sprintf('%s added from %s', $service->name(), $service->scheduleName())); // S17-R5
            $this->audit->write($this->auditEntries->forAppend($wo, $service, $link, $copy));                // S17-R6
            $result = $result->withLink($link, copied: $copy);
        }
        return $result;
    }
}
```

Sketch 8b (`CannedLineAppender::appendCopy()`, TD-32):

```php
public function appendCopy(WorkOrder $wo, CannedLine $source, string $internalNote): Line
{
    $labourType = $source->getLabourTypeId() === null
        ? null                                                                          // no labour type at home → none here, not priced (PQ-29 ✅)
        : ($this->resolveLabourTypeAtCurrentLocation($source)                           // same id here → same name here (getForCurrentLocation)
            ?? $this->labourTypeFetcher->getCurrentLocationDefault());                  // S16-R22: no match here → local default
    $line = new Line(Uuid::create(), $source->getLineName(), new WorkOrderId($wo->getId()->getValue()),
        $source->getDescription(), $source->getTimeEstimate(), new \DateTime(), false, false, false, false,
        order: $this->lineRepository->fetchNextLineNumber($wo->getId()->getValue()),
        labourTypeId: $labourType ? LabourTypeId::create($labourType->getId()) : null,
        labourTypeCost: new LabourTypeCost($labourType?->getLabourRate()->getValue() ?? 0),
        status: $this->resolveDefaultLineStatus(), techTime: $source->getTechTime(),     // tech time (PQ-26 ✅)
        fixedPrice: new FixedPrice(null), fixedLineTotal: null,                         // "Fixed price there, priced at …'s rate here"
        createdFromCannedLine: true);
    $this->lineRepository->save($line);
    $this->workOrderEventDispatcher->recordLineCreated($line, $wo);
    $this->dispatchEventsAfterLineIsCreated($line, cannedLineId: null);                 // no parts, adjustments, inspections (S16-N6, NFR-023)
    $this->notes->addInternalLineNote($line, $internalNote);                           // Type WORK_ORDER_LINE, customerVisible: false (S16-R23)
    $this->eventDispatcher->dispatch(new LineCreatedEvent($line));
    return $line;
}
```

Frontend:

**Code sketch: Mark complete modal**

```ts
// MarkCompleteDialog.vue <script lang="ts" setup> (abridged)
const props = defineProps<{ modelValue: boolean; vehicleId: UUID; companyId: UUID | null; service: ServiceRowDto | WorklistRowDto; preselectedWorkOrderId?: UUID | null }>();
const emit = defineEmits(['update:modelValue', 'completed']);
const where = ref<'work_order' | 'elsewhere'>('work_order');
const workOrderId = ref<UUID | null>(props.preselectedWorkOrderId ?? null);
const workOrders = useCompletionWorkOrdersQuery(() => props.vehicleId, () => props.service.enrolledServiceId, woSearch); // A27, org-wide (E2)
const selectedWo = computed(() => workOrders.rows.value.find((w) => w.id === workOrderId.value) ?? null);
const offers = computed(() => resetDateOffers(where.value, selectedWo.value, getLocationTodayStr())); // default = selectedWo.defaultResetOn
watch(offers, (o) => { if (!resetDateTouched.value) resetOn.value = o.defaultDate; }, { immediate: true });
const serviceName = computed(() => ('serviceName' in props.service ? props.service.serviceName : props.service.name));
const certificate = ref<CertificateInput>(certificateFromService(props.service));   // compliance only
// S18-R5: Start date follows the Reset date until the user edits Start; End derives from Start + term (certificateDates)
watch(resetOn, (d) => {
  if (props.service.kind !== 'compliance' || certificate.value.startTouched) return;
  certificate.value = deriveCertificateDates({ ...certificate.value, startDate: d });
}, { immediate: true });
// body: certificate: { certificate_number, start_date: certificate.value.startDate, end_date: certificate.value.endDate, term_months }
const markComplete = useMarkCompleteMutation();     // onSuccess → invalidateMaintenanceForAsset(vehicleId, companyId)
const undo = useUndoCompletionMutation();

const submit = async () => {
  const res = await markComplete.mutateAsync({
    enrolledServiceId: props.service.enrolledServiceId,
    body: { path: where.value, work_order_id: where.value === 'work_order' ? workOrderId.value : null,
            shop_name: where.value === 'elsewhere' ? shopName.value || null : null,
            reading: where.value === 'elsewhere' && readingValue.value !== null ? { meter: readingMeter.value, value: readingValue.value } : null,
            reset_on: resetOn.value, certificate: props.service.kind === 'compliance' ? certificate.value : null },
  }); // maintenanceApi.markComplete sets { handlesValidationLocally: true }; 400 errors[] (reset_on, work_order_id, certificate) render inline
  showSuccessNotification({
    message: copy.markedComplete(serviceName.value, res.nextDueCountsFrom),
    undo: { handler: () => undo.mutateAsync({ completionId: res.completionId, vehicleId: props.vehicleId }) }, // 409 → "can no longer be undone"
  });
  emit('completed', res);
  emit('update:modelValue', false);
};
```
The row's "Completed · next due counts from" text reads `nextDueCountsFrom`. `nextDueOn` (A28) is the new due date; it is held for the toast caption only and the row refreshes through invalidation.
Note: the "Lines closed" offer appears only when A27 `linesClosedOn` is non-null. Because Plan 1 includes the line-close stamping fix, it is
populated whenever every linked line has an `end_date`. Otherwise only "Use invoice date" is offered (S18-R3 fallback). For WOs
whose lines did not come from a service, the BE decides what "the service's lines" means (B12). The FE renders whatever it gets.

#### Unit / Integration tests:
Backend:
- Unit `ResetDateProposalTest`: all closed → latest close date; one open line → invoice date; deleted lines → invoice date; all declined → null; close date after invoice date clamped.
- Unit `ServiceCompletionTest` (future reset refused, covered share the date), `WorkOrderServiceLinkTest` (state machine).
- Unit `AppendServiceLinesToWorkOrderTest`: order kept; duplicate canned line across two services added once; line already added by an earlier link skipped; invoiced WO refused; note is not customer-visible and never mentions copying; the copy matrix: labour type by name; default when the source's labour type has no match here; a source with no labour type → copied line with no labour type and cost 0 (PQ-29 ✅); fixed-price source priced by rate; no parts / adjustments / inspection (no `LineCreated` canned id); internal line note text (parts list, fixed-price text, no-parts text); dedupe across copy mode.
- Unit `CannedLineAppenderTest` (copy) + `CopiedLineNoteTest`.
- Unit `MarkServiceCompleteCommandHandlerTest`, `UndoCompletionCommandHandlerTest` (later completion blocks undo; covered undone too; created record voided; path `work_order` calls the settler before the completion row and again after undo; an `invoice`/`covered`/`enrolment` completion → `CompletionNotUndoableError`).
- Unit `WorkOrderReadingSettlerTest`: no row → no-op; in_shop + live invoice → recorded at the invoice date; in_shop + Mark complete On the WO → recorded at the Reset date; both → the earlier date; invoice reversed with a Mark complete still effective → stays recorded at the Reset date; Undo of the only Mark complete on an uninvoiced WO → in_shop at the start date; the value is never changed.
- Functional `MarkCompleteRecordsWorkOrderReadingsTest`: a WO with a typed mileage → Mark complete On this work order → reading `recorded`, `read_on` = Reset date, confidence age refreshed on A24; a WO whose mileage was only copied → nothing recorded (S10-N6); Undo complete → back to In the shop.
- Functional `CompletionEndpointsTest`: A29 on an invoice completion → 409 `CompletionNotUndoableError`.
- Unit `ResetMaintenanceOnInvoiceCreatedSubscriberTest`: happy path; removed enrolment → orphaned, no completion; already reset by Mark complete → nothing; a repository throwing → savepoint rolled back, error logged, no exception escapes; kill switch off → nothing.
- Characterization then delegation tests for `WorkOrders/Application/Create/CreateCommandHandler` and `Line/CreateFromCannedLine/CreateCommandHandler` (NFR-019).
- Functional `tests/Functional/VehicleService/Maintenance/InvoiceResetTest.php` through `POST` invoice creation: lines closed on day X → completion `reset_on = X`; in-shop reading settled (recorded) with the invoice date before the reset (TD-35); a forced MR failure still creates the invoice (HTTP 2xx, invoice row present, no completion).
- Functional `CreateWorkOrderFromServiceTest`: WO in estimate at the header workplace with the service's lines in order; second call 409; schedule at another workplace → WO with copied lines at the header's labour rate, no parts, line notes, `copiedWork: true`; a home line with no labour type arrives with no labour type and is not priced (PQ-29 ✅); the WO carries the asset mileage and no reading is recorded (TD-14, TD-34); failure in the line append rolls the WO back.
- Functional `MarkCompleteEndpointsTest`: picker lists WOs from another workplace of the same org and none from another org; future date 400; compliance completion creates a record (no dates → Start = reset date, End = + term); undo.
- Functional `MaintenanceLifecycleTest`: asset delete for one customer ends that customer's enrolments only; customer delete ends its enrolments; merge with both on the same schedule keeps the later-completed one; VIN-change merge moves enrolments.
- Unit `InvoiceReversalReverterTest`: undoes an unsuperseded completion and its covered completions with `undone_reason = invoice_reversed`; leaves a completion superseded by a later Mark complete untouched (and its link stays `reset`); reopens the link; re-settles the WO's readings (TD-35); does nothing (and audits nothing) for an invoice with no completions; a parts WO (no reading rows) settles nothing.
- Unit `RevertMaintenanceOnInvoiceReversedSubscriberTest`: a throwing reverter is logged with ids and swallowed; kill switch off → reverter not called.
- Unit `ResetDateProposalTest` (extended): basis `lines_closed` vs `invoice_date` per branch.
- Unit `WorkOrderServiceLinkTest` (extended): `reopen()` from `reset`; refused from `orphaned`/`declined`.
- Functional `DbalMeterReadingRepositoryTest`: `settleForWorkOrder()` changes only that WO's `work_order` rows in the org; rows from other sources untouched; idempotent.
- Functional `tests/Functional/VehicleService/Maintenance/InvoiceReversalTest.php`:
  - `POST /api/invoices/create` then `POST /api/invoices/reverse-invoice` → the completion has `undone_at` and reason `invoice_reversed`, covered completions undone, link `open`, WO readings re-settled (TD-35: `in_shop`), the service's due date back to its pre-invoice value; re-invoicing proposes again with the same lines-closed date and settles the reading with the new invoice date.
  - `POST /api/invoices/create` then `POST /api/invoices/remove-customer-transaction` (the payment-dialog dismissal) → same outcome.
  - A Mark complete with a later reset date between invoice and reversal → the invoice's completion is superseded and left exactly as it was (not undone); the Mark-complete completion still decides; the link keeps `reset`.
  - `POST /api/credit-memos` against the invoice → completions, links and readings unchanged (S18-E2 credit-memo half pinned).
  - Reverter forced to throw → the reversal still returns 2xx, the invoice is gone, `maintenance.invoice_reversal_failed` logged.
- Re-run `tests/Functional/Invoicing/` reverse/remove/credit-memo files and `InvoiceResetTest`, file by file.

Frontend:
- `resetDateDefaults.spec.ts`: default = A27 `defaultResetOn`, elsewhere → none, the never-future clamp, chips only for non-null `linesClosedOn` / `invoicedOn`.
- `MarkCompleteDialog.spec.ts`:
  - title + copy;
  - picker lists WOs from 2 workplaces;
  - preselected WO;
  - elsewhere needs a date and allows an optional shop name and reading;
  - a future date is refused; a 400 `errors[{field: 'reset_on'}]` renders inline without a toast;
  - the picker calls `maintenance/enrolled-services/{id}/completion-work-orders`;
  - the toast uses `nextDueCountsFrom`; Undo 409 → "can no longer be undone";
  - compliance: Start = the Reset date and follows it until edited; End = Start + term; the A28 body carries `start_date`/`end_date`;
  - success toast with Undo → DELETE;
  - a rejection keeps the dialog open.
- `OrgWorkOrderPicker.spec.ts`. `VehicleMaintenanceTab.spec.ts` (extend): Completed row text + Undo complete; an invoice completion fixture (`completed: null`, `lastDone.kind: 'invoice'`) shows no Undo complete (S18-N8); the `undoable: false` guard stays as defensive code.
- `MarkCompleteDialog.spec.ts` (extend): on the work-order path, success invalidates `maintenanceKeys.asset(vehicleId)` (reading cards included, S18-R19).
- `ResetDateField.spec.ts`: ids unchanged without `idSuffix`; every id suffixed with `idSuffix="_abc"`; `offers` renders exactly the passed chips; `disable` disables the input and chips; default render unchanged.

#### Verification (Definition of Done gates):
- Backend: standard + migration gate + smoke. Re-run the WO and invoice functional suites touched by the two extractions
(`tests/Functional/VehicleService/WorkOrders/`, `tests/Functional/Invoicing/`), file by file.
- Frontend: the per-phase FE gates above, plus:

**Browser-walk (P6):**
1. `admin`, `/customers/vehicle/<id>/maintenance?companyId=<cid>`:
   - row menu → Mark complete → On a work order → the picker shows WOs from both locations (org with 2 workplaces);
   - pick an invoiced WO → Reset date defaults to the lines-closed or invoice date, with chips;
   - save → toast with Undo; the row reads Completed; Undo restores it;
   - on a WO whose mileage was entered on the WO (e.g. 61,000), Mark complete On a work order → the mileage card shows 61,000 recorded (not In the shop) dated the Reset date (S18-R19);
   - Completed elsewhere: Reset date required; entering a future date is impossible;
   - compliance row → Mark complete → Start date equals the Reset date; change the Reset date → Start follows; End = Start + term → save → the asset card reads 'CVIP · … · ends D Mon YYYY' and the row's due reads '<End date> · Certificate'.
2. Invoicing regression (the BE reset runs in-transaction): invoice a WO at `/workorders/<id>/finance`. Invoicing still succeeds and the console is clean.
3. An invoice-reset service (P6-1 path) shows no Undo complete on the asset tab (S18-N8).

#### E2E tests (e2e/)
Spec folder `e2e/tests/ui/maintenance-reminders/`, project `maintenance-reminders`, conventions in Section 7. **Scenarios (Create): 4 of 5 slots (ranked).**

**P6-1 `invoice-resets-service.spec.ts`: Invoicing a work order that addresses a service resets that service automatically.**
- Type: Happy path (money path). Reqs: S18-R13 (automatic half), S18-R6, S18-R9, S18-R10, S12-E5, S10-R11 (in-shop settlement, TD-35), NFR-005, S13-R26 (BE). Role: admin. Priority **P4 (invoicing)**.
- Gate 4: the reset runs in a subscriber inside the real invoice transaction, and the invoice has to succeed in the UI.
- Preconditions: Vehicle enrolled (API) in "Oil" with last done = today − 8 months (overdue). WO created via `MaintenanceFactory.createWorkOrderForService(id, 'asset')` (A33, so lines + link exist). Lines completed via `workOrderFactory.changeLineStatus` (stamps `end_date`), WO transitioned to complete.
- Steps:
  1. `/workorders/<woId>/finance` → create the invoice through the existing finance UI. Expected: the invoice is created (existing invoice success signal); no error toast.
  2. Asset `…/maintenance`. Expected: the "Oil" row's Last done = the lines-closed date (today), the badge no longer reads Overdue, and Next due is ~6 months out.
- Expected result: Invoicing still succeeds and silently resets the linked service from the lines-closed date.
- Environment: runs on the QA environment built from the feature branch (local invoice creation 500s; see the environment notes in Section 7).
- Page objects / factories: Existing `e2e/src/pages/finance/*` invoice flow + `vehicle-maintenance.page.ts`.

**P6-2 `mark-complete-on-work-order.spec.ts`: Admin marks a service complete against a work order and undoes it.**
- Type: Happy path. Reqs: S18-R1, S18-R2, S18-R3, S18-R6, S18-R11, S18-R17, S18-R19, S10-R11, S9-R9. Role: admin. Priority **P3**.
- Preconditions: Enrolled vehicle, "Oil" overdue; one open (uninvoiced) service WO for the vehicle via `workOrderFactory.create`. The WO has mileage 61,000 entered on it (`workOrderFactory.setMileage(woId, 61000)`, an entered value per S10-N6).
- Steps:
  1. Row menu → `maintenance_asset_action_mark_complete_<id>`. Expected: `dialog_maintenance_mark_complete` "Mark Oil complete".
  2. `maintenance_mark_complete_where_work_order` → pick `maintenance_mark_complete_wo_<woId>`. Expected: `input_maintenance_reset_date` defaults to today (uninvoiced WO); a future date cannot be picked.
  3. Confirm. Expected: the toast "Oil marked complete · next due counts from <today>" with Undo; the row reads "Completed · next due counts from <today>".
  4. Expected: `maintenance_reading_card_mileage` shows 61,000 recorded, not In the shop (S18-R19).
  5. Undo. Expected: the row returns to Overdue; the mileage card reads In the shop again.
- Expected result: Mark complete resets at once, records the WO's reading, and is undoable while still the latest cycle.
- Page objects / factories: Dialog: create `e2e/src/pages/dialogs/maintenance-mark-complete.dialog.ts` (picker + `ResetDateField`). Confirm the Mark complete undo toast reuses `button_notification_undo` (testability note B4).

**P6-3 `mark-complete-compliance.spec.ts`: Admin completes a compliance inspection, and the certificate appears on the asset card.**
- Type: Happy path. Reqs: S18-R5, S8-R5, S8-E4, S9-R11. Role: admin. Priority **P3**.
- Preconditions: Enrolled vehicle with compliance service "CVIP" term 12 and no record (row "No record").
- Steps:
  1. CVIP row menu → Mark complete → Completed elsewhere, reset date = today; certificate fields: number "C-<ts>". Expected: Start date = today (the Reset date); End date = today + 12 months.
  2. Confirm. Expected: the CVIP row's `maintenance_due_<id>` reads '<D Mon YYYY+1>' (the End date, day precision) with basis "Certificate".
  3. Asset card. Expected: `maintenance_compliance_record_<id>` "CVIP · C-<ts> · ends <D Mon YYYY+1>".
- Expected result: One transaction creates the completion and the compliance record, and moves the due date.

**P6-4 `mark-complete-elsewhere.spec.ts`: Admin records a service done at another shop with a reading.**
- Type: Edge case (distinct path writes a reading). Reqs: S18-R4, S18-R11, S21-R3. Role: admin. Priority **P2**.
- Preconditions: Enrolled vehicle with routine "Oil" (mileage trigger).
- Steps:
  1. Mark complete → `maintenance_mark_complete_where_elsewhere`. Expected: the reset date is empty and required (Confirm blocked until set).
  2. Shop "Jiffy <ts>", reading 61,000, date = today − 3 days. Confirm. Expected: the row reads "Completed · next due counts from <date>".
  3. Reading card. Expected: mileage 61,000 recorded.
- Expected result: The elsewhere path stores the shop, date and reading, and resets from the entered date.

**Backlog:** 1 (cross-location picker; Section 7 Backlog). **Reference updates:** P6 re-run set (no edits expected; Section 7). **§8 skip:** n/a.

**Dev-layer (Test Layer = Dev):** covered services reset together (S18-R7, S12-R11): be-unit `MarkServiceCompleteCommandHandlerTest.php`. Undo refused after a later completion (S18-R17): be-functional + fe-unit 409 copy. Reset date ≤ today (be-unit + fe-unit `resetDateDefaults.spec.ts`). Reset proposal rules (all declined → none, deleted lines → invoice date): be-unit `ResetDateProposalTest.php`. Invoice still succeeds when MR throws (NFR-005): be-functional `InvoiceResetTest.php`. Line append dedup, copy mode (other workplace → copied lines: no parts, local labour type, internal line note) and invoiced guard (S17-R8, S16-N6, S16-R22, S16-R23, N7): be-unit `AppendServiceLinesToWorkOrderTest.php`; schedule at another workplace → WO with copied lines + `copiedWork: true`: be-functional `CreateWorkOrderFromServiceTest`. Internal WO note not customer-visible (S17-R5): be-unit. Lifecycle on delete/merge (S7-E6, S13-E5, S16-E3): be-functional `MaintenanceLifecycleTest.php`. Removed enrolment → link orphaned (S18-R18): be-unit. Five line-close paths stamp `end_date` (S18-R10): be-functional `LineCompletionStampsEndDateTest.php`.

### Phase P7: Worklist and contact card

**Implements:** BE: S13, S14 minus Send. FE: S13, S14 minus Send (Customers tab, tiles, chip, location filter, search, sort, 50-row server-side infinite scroll, Create/Open work order via A33, Invoice navigation, mobile cards, contact card). Requirement IDs traced to P7 in Section 10: S3-N2, S5-R8, S7-R20, S8-N2, S9-R9, S9-R11, S11-R9, S11-R13, S11-N3, S13-R1, S13-R2, S13-R3, S13-R4, S13-R5, S13-R6, S13-R7, S13-R9, S13-R10, S13-R11, S13-R12, S13-R13, S13-R14, S13-R16, S13-R17, S13-R18, S13-R20, S13-R22, S13-R25, S13-R26, S13-R27, S13-R28, S13-R29, S13-R30, S13-R33, S13-R34, S13-R35, S13-R36, S13-R37, S13-R38, S13-R39, S13-R40, S13-R41, S13-R42, S13-R43, S13-N1, S13-N2, S13-N3, S13-E1, S13-E3, S13-E5, S14-R1, S14-R2, S14-R3, S14-R8, S14-N2, S14-N4, S14-N5, S14-E1, S16-R19, S16-R20, S16-N4, S16-N6, S16-N7, S17-R2, S17-R5, S17-R6, S17-R7, S17-R8, S18-R6, S18-R17, S18-E8, S21-R1, S21-R2, S21-R3, S21-R4, S21-R6, S21-R7, S21-N1, S21-N2, S21-E2, S22-R1, NFR-001, NFR-004, NFR-008, NFR-013, NFR-015, NFR-016, NFR-017, NFR-F01, NFR-F03, NFR-F04, NFR-F05, NFR-F06, NFR-F07, NFR-F09, NFR-F10, NFR-F11.

**Depends on:** P4 (projection), P6 (A33 create work order, `MarkCompleteDialog`), P5 (FE row-action builders and `useMaintenanceWorkOrderActions` consumers on the asset tab).

#### Database changes:
None (indexes from P4).

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/Application/Query/Worklist/ListRemindersQuery.php`, `GetReminderTilesQuery.php` + handlers | Create | Filters VO `WorklistFilter` (tiles `overdue|due_month|due_3_months|needs_readings`, compliance, `location_ids`, search) built once and shared by rows and tiles (S13-R29, R37) |
| `src/VehicleService/Maintenance/Domain/Model/WorklistFilter.php`, `WorklistTile.php`, `WorklistSort.php` | Create | Enums and the horizon dates (`today`, `today+30`, `today+31`, `today+91`) computed in PHP (NFR-017) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorklistFetcher.php` | Create | Sketch 6 |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorklistContactFetcher.php` | Create | Second query: preferred contact for the page's (vehicle, company) pairs (TD-21); `contact` is always an object, with `contactId: null` when there is no preferred contact (S14-N4). Location names for `location {id, name}` come from the same org-scoped workplace read as A32. Adds `customerHasEmail` per company of the page (one EXISTS query over the page's ≤ 50 companies, org-scoped through `company`; any contact with a non-empty email, S7-R20) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/WorklistPredicates.php` | Create | The window, tile, rest (TD-36), skip, compliance-record and search predicates as one builder, used by rows, tiles and (Plan 2) the email items (Plan 2 TD-37) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorklistWorkOrderFetcher.php` | Create | Latest link with `state IN ('open','reset','declined')` per page row (a positive list: `orphaned` and `removed` excluded) → `work_order` (status, display number) + invoice existence, org-scoped across workplaces (GR-1) |
| `src/VehicleService/Maintenance/Application/DTO/Worklist/ReminderRowDto.php`, `ReminderTilesDto.php`, `ReminderContactDto.php` | Create | Shapes of 5.1 (`ReminderRowDto` + `customerHasEmail`) |
| `src/VehicleService/Maintenance/UI/HTTP/Worklist/ListRemindersController.php`, `GetReminderTilesController.php`, `GetWorklistMetaController.php` + `DTO/ListRemindersRequestDto.php` (`#[Search]`, `#[Pagination]`, `location_ids` validated) | Create | A30, A31 (with `hasEnrolments`), A32 (`workplaceCount`, `workplaces[]`) |
| `src/VehicleService/Maintenance/Application/Query/Worklist/GetWorklistMetaQuery.php` + handler | Create | A32: the org's workplaces (org-scoped `workplace` read) |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `api/maintenance/*` | Modify | A30–A33 (A33 itself ships with BE P6; the FE wires it in P7 on the asset tab and the worklist); `WorklistRowDto.customerHasEmail` (A30) |
| `components/ts/maintenance/worklist/MaintenanceRemindersTab.vue` | Modify (replaces the stub) | Owns tiles, chip, location filter, prefs + URL sync, worklist query, desktop table / phone cards, the 3 empty states (S13-R33), `MarkCompleteDialog`, `ContactCard`. Takes `search` from the shell |
| `components/ts/maintenance/worklist/WorklistTiles.vue` | Create | 4 toggle tiles, multi-select, one shared visual treatment (S13-R2..R5, R20). Skeleton while pending, never 0 (NFR-F03). Horizontal scroll on phone (S13-R39). `v-model` = `WorklistTile[]`. The tiles container exposes `:data-loading="isFetching"` (D22, NFR-F12) |
| `components/ts/maintenance/worklist/worklistFilters.ts` | Create | `FilterDef[]`: `{key:'compliance', type:'toggle', label:'Compliance inspection'}` (S13-R40), `{key:'location_ids', type:'multi', visible: () => meta.workplaceCount > 1}` (S13-R28). Tile ↔ URL mapping |
| `components/ts/maintenance/worklist/WorklistTable.vue` | Create | `Table` server-side (`@request` → `mapPaginationForAPI`), virtual scroll → `onScroll`. One column set (S13-R6): Asset (S13-R7), Customer, Service (+ chip, S13-R18), Location (only when count >1, S13-R9), Due status (`DueBadge`, S13-R13), Due (`DueCell`, S13-R34), Work order (link + status badge, S13-R14, R25), Actions (Contact + primary + menu, S13-R16). Header sort only (S13-R10). Rows not clickable (S13-R35). The table exposes `:data-loading="isFetching"` (D22, NFR-F12) |
| `components/ts/maintenance/worklist/WorklistCardMobile.vue` | Create | Phone card per row. Menu as an action sheet (S13-R39) |
| `components/ts/maintenance/worklist/worklistRowActions.ts` | Create | Pure: primary action from `workOrder?.status` (null/declined → Create work order; live → Open work order; complete → Invoice, or Open when `!canOpenInvoicing`) (S13-R14, R26). Menu: Mark complete, Skip, Open asset (S13-R16) |
| `components/ts/maintenance/shared/useMaintenanceWorkOrderActions.ts` | Create | `createWorkOrder(row, createdVia: 'worklist' \| 'asset')` → A33 `{created_via}` → invalidate → `router.push({ name: 'WorkOrder', params: { id: res.workOrderId }, query: { locationId: res.workplaceId } })`. A 409 (a live linked WO already exists) → invalidate so the row flips to Open work order (S13-R30, R38, R17). `openWorkOrder(wo)` → `lines` with `?locationId`. `openInvoicing(wo)` → `finance` with `?locationId`, never `useInvoiceCreationIntent` (FD-15, FD-16). Reads A33 `copiedWork` only for the type; navigation is unchanged (S13-R30 opens the work order in both cases) |
| `components/ts/maintenance/worklist/ContactCard.vue` | Create | `HoverCard`-style click card (`q-menu` desktop, sheet phone): contact name, telephone + mobile + company telephone labelled with `tel:` links (S14-R1, R3); email + copy button (S14-R2); no-email / no-phone / no-contact states (S14-R8, N2, N4, E1) with "Set contact" → `SetPreferredContactDialog`. When the setting is on and A30 `customerHasEmail` is false: the S7-R20 note "None of {customer}'s contacts has an email address, so no reminder can be sent." (`maintenance_contact_customer_no_email`) with Add contact (`button_maintenance_contact_add_contact`, `canEditCustomerSide`) → `ContactDialog` with `:company-id="row.companyId"`; on save → `invalidateMaintenanceForAsset(row.vehicleId, row.companyId)` (FD-29). **No Send reminder, no last sent** (§2.11) |
| `components/ts/maintenance/worklist/ContactButton.vue` | Create | The Contact button. Orange border + hover "No phone or email on file" when the contact has no telephone, no mobile and no email **and** the row has no `companyTelephone` (S13-R41) |
| `components/ts/maintenance/worklist/SetPreferredContactDialog.vue` | Create | FD-19: `BaseFormDialog fullscreenOnPhone`, `Select` of the company's contacts, `useSaveVehicleContactMutation`, then `invalidateMaintenanceForAsset` |
| `components/ts/maintenance/asset/serviceRowActions.ts`, `VehicleMaintenanceTab.vue` | Modify | Enable Create work order (`createWorkOrder(row, 'asset')`) / Open work order on asset rows via `useMaintenanceWorkOrderActions` (S9-R9, R11) |

#### Key code changes:
Backend:

Sketch 6 (worklist query, NFR-008):

```php
public function fetchPage(WorklistFilter $filter, WorklistSort $sort, PaginationData $page): array
{
    $qb = $this->connection->createQueryBuilder()
        ->select(
            'BIN_TO_UUID(p.enrolled_service_id) AS enrolledServiceId', 'BIN_TO_UUID(p.vehicle_id) AS vehicleId',
            'BIN_TO_UUID(p.company_id) AS companyId', 'p.service_name', 'p.schedule_name', 'p.kind',
            'p.due_on', 'p.due_soon_from', 'p.winning_trigger', 'p.is_estimate',
            'p.mileage_usable_pairs', 'p.mileage_last_recorded_on', 'p.hours_usable_pairs', 'p.hours_last_recorded_on',
            'p.needs_reading', 'p.watches_mileage', 'p.watches_hours', 'p.has_record',
            'BIN_TO_UUID(p.last_visit_workplace_id) AS locationWorkplaceId',
            'v.unit', 'v.year', 'v.vin', 'mk.name AS makeName', 'md.name AS modelName',
            'c.name AS companyName', 'c.telephone AS companyTelephone', 'c.maintenance_notifications',
        )
        ->from(DueProjection::TABLE_NAME, 'p')
        ->innerJoin('p', Vehicle::TABLE_NAME, 'v', 'v.id = p.vehicle_id')                  // deleted asset drops out (S13-E5)
        ->innerJoin('p', Company::TABLE_NAME, 'c', 'c.id = p.company_id')                  // deleted customer drops out
        ->leftJoin('v', VehicleMaker::TABLE_NAME, 'mk', 'mk.id = v.vehicle_maker_id')       // global reference data
        ->leftJoin('v', VehicleModel::TABLE_NAME, 'md', 'md.id = v.vehicle_model_id')
        ->where('p.skipped_at IS NULL')                                                     // S9-R13
        ->andWhere("(p.needs_reading = 1"                                                  // S13-R36: never hidden
            . " OR p.last_done_path IS NULL"                                             // no completion yet: nothing to rest
            . " OR p.due_soon_from <= :today)");                                          // S13-R43 / TD-36: every completion, enrolment included, rests (Q18 ✅)
    $this->organizationDecorator->decorateQuery($qb, 'p.organization_id');                 // org-wide, never workplace (GR-1)
    $this->organizationDecorator->decorateQuery($qb, 'c.organization_id');                 // tenant-owned join scoped too

    $this->predicates->apply($qb, $filter);   // shared with tiles:
    //  no tile:   (p.due_on <= :plus91 OR p.needs_reading = 1 OR (p.kind = 'compliance' AND p.has_record = 0))   S13-R36, N2
    //  tiles T:   (p.kind = 'routine' OR p.has_record = 1) AND (p.due_on < :today [overdue] OR p.due_on BETWEEN :today AND :plus30 OR p.due_on BETWEEN :plus31 AND :plus91)
    //  N alone:   p.needs_reading = 1
    //  T and N:   p.vehicle_id IN (vehicles with a row in T) AND p.vehicle_id IN (vehicles with a row needing reading)
    //             AND (row in T OR p.needs_reading = 1)                                       S13-R20
    //  compliance chip: p.kind = 'compliance'                                                 S13-R40
    //  location:  p.last_visit_workplace_id IN (:locationIds)                                S13-R28, R29
    //  search:    (v.unit LIKE :s OR v.vin LIKE :s OR c.name LIKE :s OR p.service_name LIKE :s)  S13-R37

    // S13-R37 default: due ascending, then unit; no-record compliance last; stable tie-breaker for paging
    $qb->orderBy('CASE WHEN p.due_on IS NULL THEN 1 ELSE 0 END', 'ASC');
    match ($sort->column) {
        WorklistSortColumn::Due      => $qb->addOrderBy('p.due_on', $sort->direction)->addOrderBy('v.unit', 'ASC'),
        WorklistSortColumn::Asset    => $qb->addOrderBy('v.unit', $sort->direction),
        WorklistSortColumn::Customer => $qb->addOrderBy('c.name', $sort->direction),
        WorklistSortColumn::Service  => $qb->addOrderBy('p.service_name', $sort->direction),
    };
    $qb->addOrderBy('p.enrolled_service_id', 'ASC')
       ->setFirstResult(($page->getPage() - 1) * 50)->setMaxResults(50);                   // S13-R37

    return $qb->executeQuery()->fetchAllAssociative();
}
```

Tiles are one query over the same FROM/JOIN/scope and the same filter minus the tile predicate:
`COUNT(DISTINCT CASE WHEN p.due_on < :today THEN p.vehicle_id END) AS overdue`, likewise for the two windows and
`p.needs_reading = 1`, each also excluding `kind = 'compliance' AND has_record = 0` (S13-N2), skipped rows and resting rows.
**Rest after completion (S13-R43, S18-R17, TD-36).** A row whose current cycle counts from any completion (`last_done_path`
in `work_order`, `elsewhere`, `invoice`, `covered`, `enrolment`, the enrolment last service date included; Q18 ✅ 918913025) is hidden from rows and
tiles until `today ≥ due_soon_from` (the next cycle's first reminder row; compliance: Remind before expiry), even when its
next due falls inside the 91 days. A Needs readings row is never hidden (S13-R36). Using `due_soon_from` as the return
point is the one place where reminder rows affect listing (S13-R43 says so). Undo complete, an invoice reversal and Plan
2's VOID reconciliation restore the previous path, so the row comes back. The asset tab is unaffected. The predicates
live in `WorklistPredicates` (shared with tiles and Plan 2's email items). The
"T and N" sub-selects use `mdp__org_due_vehicle_idx` and `mdp__org_needs_reading_idx`. `showScheduleChip` (S13-R18) is
derived from a grouped count over the page's vehicle ids. Confidence and `status` are computed in PHP per
row from the stored inputs and `today` (NFR-004).

Frontend:

**Code sketch: worklist query + URL/preference sync**

```ts
// MaintenanceRemindersTab.vue <script lang="ts" setup> (abridged)
const props = defineProps<{ search: string }>();
const PAGE_KEY = 'customers-maintenance-reminders';
type WorklistPrefs = { mr_tiles: string[]; mr_compliance: string[]; mr_locations: string[]; sortBy: WorklistSort; descending: boolean };
const DEFAULTS: WorklistPrefs = { mr_tiles: [], mr_compliance: [], mr_locations: [], sortBy: 'due', descending: false }; // S13-R37

const prefs = usePagePreferences<WorklistPrefs>(PAGE_KEY, DEFAULTS);
const filterState = ref<FilterState>({ mr_tiles: [], mr_compliance: [], mr_locations: [] });
const saved = ref<WorklistPrefs>(DEFAULTS);
useFilterUrlSync({
  router, route, keys: ['mr_tiles', 'mr_compliance', 'mr_locations'], state: filterState,
  savedState: () => pickFilters(saved.value), suspendPersistence: prefs.suspended,
  isValidValue: isValidWorklistParam,   // tiles ∈ 4 names, compliance '1', locations ∈ meta.workplaces ids
});

const meta = useWorklistMetaQuery();
const filters = () => ({
  search: props.search,
  tiles: filterState.value.mr_tiles,
  compliance: filterState.value.mr_compliance.length ? 1 : undefined,
  location_ids: (meta.data.value?.workplaceCount ?? 0) > 1 ? filterState.value.mr_locations : undefined,
});
const table = useTableQuery<WorklistRowDto>({
  queryKey: (req) => maintenanceKeys.worklistRows(req),
  fetchPage: (req) => maintenanceApi.fetchWorklist(req).then((r) => r.data.data),
  pagination: { pageSize: 50, sortBy: 'due', descending: false },       // S13-R37
  filters,
  enabled: () => prefsLoaded.value,                                       // never fetch with defaults then refetch with prefs
});
const tiles = useWorklistTilesQuery(() => ({ search: props.search, compliance: filters().compliance, location_ids: filters().location_ids })); // tiles never filter themselves (S13-R29)

onMounted(async () => {
  saved.value = await prefs.load();
  table.setInitialPagination({ sortBy: saved.value.sortBy, descending: saved.value.descending }); // personal sort (S13-R42)
  prefsLoaded.value = true;
});
watch([filterState, () => table.pagination.value.sortBy, () => table.pagination.value.descending], () =>
  prefs.save({ ...pickFilters(filterState.value), sortBy: table.pagination.value.sortBy, descending: table.pagination.value.descending }), { deep: true });
```
- Search lives in the shell (`usePageSearchUrlSync('customers')`, browser-Back retention, never account-saved: S13-R42), so it is not in `keys`.
- Empty states (S13-R33):
  - `tiles.data.hasEnrolments === false` → "No maintenance reminders yet";
  - no tile/filter/search active and 0 rows → time tiles read 0 and the table says "Nothing is due in the next three months";
  - anything active and 0 rows → `FilteredTableEmptyState` "No reminders match" + Clear filters (clears tiles, chip, location, **and** the shared search).
- Phone: `q-infinite-scroll @load` → `table.handleScroll(1)`.

#### Unit / Integration tests:
Backend:
- Unit `WorklistFilterTest` (horizon dates, tile combinations), `ListRemindersQueryHandlerTest` (status/confidence derivation, contact merge, location names).
- Functional `tests/Functional/VehicleService/Maintenance/WorklistEndpointsTest.php`: window (91 days, needs-reading beyond the window included); each tile boundary (today, +30, +31, +91); two time tiles union; time tile + Needs readings by asset; compliance chip narrows tiles; no-record compliance only with no tile, sorted last, never counted; location filter narrows rows and tiles; search on unit, VIN, customer, service; sort columns and stable paging (50); skipped excluded; rest after completion (TD-36): `work_order`, `elsewhere`, `invoice` and `covered` completions with the next due inside 91 days hide rows and tiles until `due_soon_from ≤ today`, then return; an `enrolment` completion (S7-E1 "Mark as done") hides the same way (S13-R43, Q18 ✅); Undo complete and an invoice reversal bring the row back; a Needs readings service stays listed (and counted in Needs readings) after any completion (S13-R36); `customerHasEmail` true when a non-preferred contact has an email; rows of an asset whose customer was deleted disappear; a second org's rows never appear; a user at workplace A sees rows whose last visit was workplace B (GR-1); the vehicle linked to 29 customers (fixture) still yields one row per enrolment; a `removed` link is not the row's WO and Create work order is offered again.
- No skipped tests (clean status line): the index check is a manual `EXPLAIN` on MySQL against the seeded dataset, pasted into the PR, confirming `mdp__org_due_vehicle_idx` drives the default list.

Frontend:
- `worklistRowActions.spec.ts`: every WO status → primary action (declined → Create again, complete → Invoice, complete without finance permission → Open), the menu set (S13-R16, R26).
- `worklistFilters.spec.ts`: the location filter is visible only for count >1, the URL validators.
- `WorklistTiles.spec.ts`: multi-toggle, skeleton while pending, no special colour for overdue.
- `MaintenanceRemindersTab.spec.ts` (MSW):
  - pageSize 50 sent, sort by header → `sortBy`, default due asc;
  - tiles query excludes tiles from its params;
  - location filter + column hidden at count 1;
  - three empty states;
  - URL `?tab=maintenance&mr_tiles=overdue` restores state; prefs saved debounced;
  - search from the shell narrows rows and tiles;
  - a completion (Mark complete) removes the row through invalidation (the BE drops it, S13-R43);
  - Create work order sends `created_via: 'worklist'` and navigates with `?locationId=res.workplaceId`; a 409 invalidates and the primary action flips to Open work order;
  - Invoice never imports `useInvoiceCreationIntent` (assert the push target `finance`).
- `ContactCard.spec.ts`: all states, `tel:` hrefs, copy email, Set contact opens the dialog; the no-email-on-any-contact note + Add contact when `customerHasEmail` is false and notifications are on; hidden without CE; `loadCompany` invalidates; **no Send reminder rendered**. `ContactButton.spec.ts`: orange only when the contact has no phone, mobile or email and `companyTelephone` is empty; a company telephone alone suppresses it.
- `useMaintenanceWorkOrderActions.spec.ts`: `created_via` per surface (`asset` / `worklist`), navigation targets, 409 handling.

#### Verification (Definition of Done gates):
- Backend: standard + smoke (`/api/maintenance/reminders`, `/api/maintenance/reminders/tiles`). Performance check on the
seeded 18k-asset dataset: rows p95 < 500 ms, tiles p95 < 300 ms (NFR-008); attach the numbers to the PR.
- Frontend: the per-phase FE gates above, plus:

**Browser-walk (P7):**
1. `admin`, org with ≥2 workplaces, `/customers?tab=maintenance`:
   - 4 tiles with counts (skeleton first); click Overdue + Needs readings → combined; Compliance inspection chip;
   - location filter present (and absent at a 1-workplace org); location column present;
   - sort by Customer header; scroll → page 2 loads (Network shows `rowsPerPage=50`);
   - type a search term → narrows rows and tiles; switch to the Customers tab and back → term and filters kept;
   - reload the URL → filters restored; open a fresh tab at `/customers?tab=maintenance` → filters from user prefs.
2. Row actions:
   - Contact → card with phones and email copy; a customer without contact → Set contact → save → the card updates; a customer none of whose contacts has an email → the card says so, with Add contact; a row whose contact has nothing but whose customer has a company telephone → no orange border (S13-R41);
   - Create work order → lands on the new WO (estimate) with the service's lines. With the header at a non-home location: the same line names and hours at that location's labour rates, no parts, each line carrying an internal line note 'Copied from {home}. Parts used there, for reference: …' (Line note · Internal, not customer-visible). The new WO shows the asset's mileage (Q13, S13-R38). Back → the row shows the WO link + badge and the primary action reads Open work order;
   - set the WO complete → Invoice → lands on `/workorders/<id>/finance` (no auto invoice dialog); invoice it → back → the row is gone (S13-R43);
   - another row with a short interval (next due inside 91 days) → menu → Mark complete → the row leaves anyway (S13-R43; a Needs readings row would stay); Skip → the row leaves (still visible grey on the asset tab).
3. Header location switch → the list does **not** narrow (org-wide, S13-R28) but refetches (today).
4. Phone 390 px: cards, tiles scroll sideways, the menu is an action sheet, the contact card is a sheet with tappable numbers.
5. `tech` without customers view: no tab.

#### E2E tests (e2e/)
Spec folder `e2e/tests/ui/maintenance-reminders/`, project `maintenance-reminders`, conventions in Section 7. **Scenarios (Create): 4 of 5 slots (ranked).**

**P7-1 `worklist-create-wo-to-invoice.spec.ts`: Admin works a due service from the worklist through work order and invoice until it clears.**
- Type: Happy path (the "track, act, clear" loop). Reqs: S13-R1, S13-R6, S13-R7, S13-R13, S13-R14, S13-R16, S13-R17, S13-R25, S13-R26, S13-R30, S13-R38, S17-R2, S17-R7, S16-R19, S22-R1 (stored). Role: admin. Priority **P4 (creates and invoices a WO)**.
- Preconditions: Fresh customer + contact + vehicle `MR<ts>` enrolled (API) in "Oil" overdue (calendar Every 6 months, last done today − 8 months; 2 canned lines at the schedule's home workplace = the header workplace).
- Steps:
  1. `/customers?tab=maintenance` → search `MR<ts>`. Expected: `maintenance_worklist_row_<id>` showing asset `MR<ts>`, the customer, "Oil", badge Overdue; primary action "Create work order".
  2. `button_maintenance_worklist_primary_<id>`. Expected: navigates to the new WO (estimate) with the 2 canned lines appended.
  3. Back to the worklist. Expected: `maintenance_worklist_wo_link_<id>` shows the WO number + status; the primary action reads "Open work order".
  4. API: complete lines + transition the WO to complete. Reload the worklist. Expected: the primary action reads "Invoice".
  5. Click Invoice. Expected: lands on `/workorders/<id>/finance` with no auto-opened invoice dialog. Create the invoice through the UI.
  6. Back to `/customers?tab=maintenance`, search `MR<ts>`. Expected: no row for "Oil" (S13-R26, S13-R43: the invoicing completion rests the row until its next cycle's first reminder row, and the next due is about 6 months out).
- Expected result: A due service can be acted on and cleared without leaving the worklist flow.
- Environment: runs on the branch's QA environment, same as P6-1 (see the environment notes in Section 7).
- Page objects / factories: Create `e2e/src/pages/customers/maintenance-worklist.page.ts` (tiles, chip, table, row actions by `enrolledServiceId`).

**P7-2 `worklist-filters-persist.spec.ts`: Admin narrows the worklist with a tile and search, and the filters survive leaving the list.**
- Type: Happy path (filter, one per list surface per test-scope-rules §8). Reqs: S13-R2, S13-R4, S13-R5, S13-R40, S13-R32, S13-R37 (search), S13-R42. Role: admin. Priority **P2**.
- Preconditions: Two fresh vehicles enrolled: A overdue (routine), B with compliance due within 30 days (record **End date = today + 20 days**).
- Steps:
  1. `/customers?tab=maintenance`, search `MR<ts>`. Expected: rows for A and B.
  2. Click `maintenance_tile_overdue`. Expected: only A's row.
  3. Click Overdue again (clear), click `filter_chip_compliance`. Expected: only B's row.
  4. Row menu → `maintenance_worklist_action_open_asset_<B>` → browser back. Expected: the compliance chip and search term are still applied; only B's row.
- Expected result: Tiles, chip and search narrow the real result set and persist across navigation.
- **No absolute tile counts** (org-wide, shared org). A count-delta assertion waits on `data-loading` (D22, NFR-F12).

**P7-3 `worklist-contact-card.spec.ts`: Admin opens a row's contact card and sets a preferred contact when none exists.**
- Type: Happy path. Reqs: S14-R1, S14-R2, S14-R8, S14-N4, S14-E1, S13-R41. Role: admin. Priority **P2**.
- Gate 4: the contact block comes from a second BE query (TD-21), and Set contact writes through the existing `POST /api/vehicles/change-contact`.
- Preconditions: Vehicle V1 enrolled + overdue, whose customer has a contact with phone + email set as preferred. Vehicle V2 enrolled + overdue, whose customer has a contact but no preferred contact on the vehicle.
- Steps:
  1. V1 row → `button_maintenance_worklist_contact_<id>`. Expected: `maintenance_contact_card` with `maintenance_contact_phone_telephone` (`tel:` href) and the email + `button_maintenance_contact_copy_email`; no Send reminder button.
  2. V2 row → Contact. Expected: `maintenance_contact_no_contact` + `button_maintenance_contact_set`.
  3. Set contact → `dialog_maintenance_set_contact` → pick the contact → save. Expected: reopening the card shows that contact's details.
- Expected result: The contact card reflects real contact data and can fix a missing preferred contact in place.

**P7-4 `worklist-skip-mark-complete.spec.ts`: Skipping from the worklist hides the row but keeps it on the asset tab.**
- Type: Edge case (cross-surface state). Reqs: S13-R16, S9-R13, S13-N3, S18-R17 (worklist half), S18-E8, S13-R43. Role: admin. Priority **P2**.
- Preconditions: Vehicle enrolled with two overdue routine services "Oil" and "Brakes". "Brakes" is calendar Every 2 months with the default reminder rows and watches no meter (so it is never a Needs readings row, which the rest would not hide), so after completion its next due (~61 days) is still inside the 91-day window: only the rest after completion can remove it.
- Steps:
  1. Worklist, search `MR<ts>` → "Oil" menu → `maintenance_worklist_action_skip_<id>`. Expected: the "Oil" row leaves; "Brakes" remains.
  2. "Brakes" menu → `maintenance_worklist_action_mark_complete_<id>` → Completed elsewhere, today → confirm. Expected: the "Brakes" row leaves although its next due is inside the window (S13-R43). Reload the worklist (wait on `data-loading`). Expected: still no "Brakes" row and no "Oil" row.
  3. Asset `…/maintenance`. Expected: "Oil" shows Skipped (grey, date kept); "Brakes" shows "Completed · next due counts from <today>".
- The return at due soon needs time travel and is Dev-layer (be-functional `WorklistEndpointsTest.php`).
- Expected result: Worklist actions change real state that both surfaces agree on.

**Backlog:** 2 (org-wide worklist; Create work order at a non-home location copies the work → `worklist-create-wo-copied-work.spec.ts`; Section 7 Backlog). **Reference updates:** R7-1, R7-2 (verify-only). **§8 skip:** n/a.

**Dev-layer (Test Layer = Dev):** tile boundaries (today, +30, +31, +91), unions, Needs-readings crossing (S13-R2, R5, R20, R22, R36): be-functional `WorklistEndpointsTest.php`. No-record compliance last and uncounted (S13-N2): be-functional. Location filter visible only at >1 workplace (S13-R9, R28): fe-unit `worklistFilters.spec.ts` + be-functional. 50-row paging / sort (S13-R10, R11, R37): be-functional + fe-unit `MaintenanceRemindersTab.spec.ts`. Primary action per WO status incl. declined → Create again (S13-R14): fe-unit `worklistRowActions.spec.ts`. 409 on a second Create → flips to Open (S13-R17): fe-unit + be-functional `CreateWorkOrderFromServiceTest.php`. Copy path (S16-N6, S16-R22/R23 line note, S16-N9): be-functional `CreateWorkOrderFromServiceTest`. Orange Contact border with the company-phone rule (S13-R41): fe-unit `ContactButton.spec.ts`. S13-R43 invoice path (an invoice completion with the next due inside 91 days leaves rows and tiles, returns at due soon): be-functional `WorklistEndpointsTest.php`. S7-R20 contact-card note + Add contact: fe-unit `ContactCard.spec.ts`. Skeleton not 0 (NFR-F03): fe-unit `WorklistTiles.spec.ts`. Deleted customer drops rows (S13-E5): be-functional. Phone cards (S13-R39): fe-unit. Tech without customers view → no tab: fe-unit `Customers.spec.ts`. Create WO from the asset tab with `created_via: asset`: fe-unit `useMaintenanceWorkOrderActions.spec.ts` (same A33 path as P7-1).

## 7. Testing Strategy

Every phase block in Section 6 lists its own tests; this section is the cross-cutting summary.

### Unit tests
- Backend (Pest, `tests/Unit/…`): domain value objects and aggregates (P1 triggers, offsets, compliance term, schedule invariants incl. the home-location lock; P2 enrolment, certificate period (days), compliance record), handler tests with repository fakes and audit spies (P1, P2, P5, P6), `EnrolmentHomeLocationAccessTest` (P1), copy mode (P6 `AppendServiceLinesToWorkOrderTest`, `CannedLineAppenderTest`, `CopiedLineNoteTest`), the engine (P4: `MeterEstimatorTest` with the S11-E6 worked example, `ConfidenceTableTest` over every S11-R24 cell and the S11-E5 examples, `CalendarMathTest`, `CycleHistoryTest`, `DueDateResolverTest`, `DueProjectionRecomputerTest` with a fixed query count per chunk), capture (P3 `MeterReadingRecorderTest`, `IdempotencyKeyTest`, `ReadingPlausibilityTest`, `HistoricalReadingMapperTest`, `HistoricalReadingLoaderTest`), the invoice subscriber (P6, including the forced-failure and kill-switch cases).
- Architecture: `tests/Unit/Architecture/MeterWriteSurfaceTest.php` pins every meter setter caller (P3, TD-05).
- Characterization tests before any change to existing handlers (NFR-019): the five WO handlers wrapped in `Transactional` (P3), `WorkOrders/Application/Create/CreateCommandHandler` and `Line/CreateFromCannedLine/CreateCommandHandler` before the extractions (P6).
- Frontend (Vitest + MSW, camelCase contract fixtures): P0 shared components and the default-render regression specs for both base dialogs (NFR-F02); pure modules (`scheduleDraft`, `serviceFormRules`, `certificateDates`, `readingPlausibility`, `resetDateDefaults`, `serviceRowActions`, `worklistRowActions`, `worklistFilters`); component specs per phase; existing specs that must pass unchanged (`InspectionEditableText`, `useSortable`, `VehicleInvoices`).

### Integration tests
Backend functional tests (SQLite functional schema; no MySQL-only date arithmetic, NFR-017):
- P0 `DbalEntityEventWriterTest`; P1 `ScheduleEndpointsTest`; P2 `EnrolmentEndpointsTest`, `ComplianceRecordEndpointsTest`, `MaintenanceNotificationsEndpointTest`;
- P3 `ReadingCaptureTest` (one test per entry point and per copy path), `ReadingEndpointsTest`; P4 `ProjectionRecomputeTest`; P5 `AssetTabEndpointsTest`;
- P6 `LineCompletionStampsEndDateTest`, `InvoiceResetTest`, `InvoiceReversalTest` (NFR-022), `CreateWorkOrderFromServiceTest`, `MarkCompleteEndpointsTest`, `MaintenanceLifecycleTest`, plus a file-by-file re-run of `tests/Functional/VehicleService/WorkOrders/` and `tests/Functional/Invoicing/`;
- P7 `WorklistEndpointsTest`.

### Manual testing checklist
- Browser-walk per phase as listed in each Section 6 block, on the branch build, plus a regression walk of every touched existing screen (NFR-F01); phone width 390 px for every new surface.
- Before the PR to develop: QA tests the whole branch build (Plan 1 + Plan 2); the `/e2e-after-change` coverage pass runs once on the branch (D28).
- P3: run `meter-readings:load-history` per 4.4 "Order" (QA after each branch-build deploy; production once, right after the release deploy) and record per-org counts in the PR.
- P4: performance check on a throwaway MySQL seeded with 18k vehicles × 10 services: `recomputeVehicles()` time per 500-vehicle chunk and a bulk enrol of 2,500 (NFR-009).
- P6: invoicing regression walk (the reset runs inside the invoice transaction).
- P7: rows p95 < 500 ms and tiles p95 < 300 ms on the seeded 18k-asset dataset, plus a manual `EXPLAIN` confirming `mdp__org_due_vehicle_idx` drives the default list (NFR-008); attach both to the PR.

### 7.4 Test ids (FE)

Convention (GR#5, base-wrappers.md):
- Raw elements: `data-test-id="maintenance_<surface>_<element>[_<id>]"`.
- Base wrappers: `data-test-id-suffix="maintenance_<surface>_<element>"` → rendered `button_maintenance_…`, `input_maintenance_…`, `select_maintenance_…`, `table_maintenance_…`. Always pass a suffix (the `button_base` collision).
- Per-row ids end in `_${enrolledServiceId}` (asset tab, worklist) or `_${schedule.id}` (settings).
- `ResponsiveActionMenu` items: `maintenance_<surface>_action_<verb>_${id}`, the same in the dropdown and the sheet, so one locator works at both widths.

| Surface | Key ids |
|---|---|
| Settings nav + list | `link_maintenance_schedules_tab`, `maintenance_schedules_tab_active`, `maintenance_schedules_tab_archived`, `table_maintenance_schedules`, `button_maintenance_schedules_new`, `maintenance_schedules_action_{edit,duplicate,archive,restore}_${id}`, `dialog_maintenance_archive_schedule`, `maintenance_schedules_home_${id}` (S1-R14) |
| Editor | `maintenance_schedule_title`, `maintenance_schedule_title_input`, `button_maintenance_schedule_save`, `button_maintenance_schedule_cancel`, `button_maintenance_schedule_add_service`, `maintenance_service_row_${key}`, `maintenance_service_action_{edit,remove,move_up,move_down}_${key}`, `maintenance_service_lines_${key}` (hover trigger), `maintenance_schedule_home_location` (S1-R14) |
| Service form | `dialog_maintenance_service_form`, `input_maintenance_service_name`, `maintenance_service_compliance_toggle`, `maintenance_trigger_calendar`, `maintenance_trigger_mileage`, `maintenance_trigger_hours`, `select_maintenance_interval_operator_<trigger>`, `input_maintenance_interval_value_<trigger>`, `select_maintenance_interval_unit`, `maintenance_covered_option_${key}`, `button_maintenance_add_canned_lines`, `maintenance_canned_lines_home_helper` (S4-R8), `maintenance_canned_lines_readonly_info` (S4-R9), `maintenance_reminder_row_${i}`, `button_maintenance_reminder_add`, `button_maintenance_reminder_delete_${i}`, `input_maintenance_compliance_type`, `select_maintenance_compliance_term`, `select_maintenance_remind_before` |
| Canned-line picker | `dialog_maintenance_canned_lines`, `input_maintenance_canned_lines_search`, `maintenance_canned_line_option_${id}`, `maintenance_canned_line_selected_${id}` |
| Enrolment | `dialog_maintenance_enrolment`, `select_maintenance_enrolment_customer` (its `use-input` search is the A9 `customer_search` box), `select_maintenance_enrolment_schedule`, `maintenance_enrolment_schedule_option_${id}` (S7-R1, S1-R14), `maintenance_enrolment_service_${scheduleServiceId}`, `input_maintenance_enrolment_last_done_${scheduleServiceId}`, `maintenance_enrolment_needs_reading_${scheduleServiceId}`, `maintenance_enrolment_meter_at_{done,leave}_${id}`, `maintenance_enrolment_asset_${vehicleId}`, `maintenance_enrolment_select_all`, `input_maintenance_enrolment_asset_search`, `maintenance_enrolment_notifications`, `button_maintenance_enrolment_confirm`, `maintenance_enrolment_no_schedules`, `button_maintenance_enroll_in_schedule` (customer Assets tab) |
| Certificates | `maintenance_compliance_section`, `maintenance_compliance_record_${id}`, `button_maintenance_compliance_add_record`, `dialog_maintenance_certificate`, `select_maintenance_certificate_term`, `input_maintenance_certificate_start`, `input_maintenance_certificate_end`, `input_maintenance_certificate_number`, `button_maintenance_certificate_attach`, `button_maintenance_certificate_remove_attachment` |
| Customer toggle | `maintenance_customer_notifications_toggle`, `maintenance_customer_notifications_silenced`, `maintenance_customer_notifications_no_email` |
| Asset tab | `vehicle_tab_maintenance` (from `VehicleTabsBar`), `maintenance_asset_not_enrolled`, `button_maintenance_asset_enroll`, `button_maintenance_enter_mileage`, `maintenance_reading_card_{mileage,hours}`, `table_maintenance_asset_services`, `maintenance_asset_row_${id}`, `maintenance_due_${id}`, `maintenance_badge_${id}`, `maintenance_confidence_${id}`, `maintenance_asset_action_{mark_complete,create_work_order,open_work_order,skip,undo_skip,other_triggers,add_record,undo_complete}_${id}`, `maintenance_schedule_menu_${enrolmentId}`, `maintenance_schedule_action_remove_${enrolmentId}`, `dialog_maintenance_remove_from_schedule` |
| Reading dialog | `dialog_maintenance_reading`, `input_maintenance_reading_mileage`, `input_maintenance_reading_hours`, `maintenance_reading_warning_{mileage,hours}`, `button_maintenance_reading_confirm_anyway`; undo uses the existing `button_notification_undo` |
| Mark complete | `dialog_maintenance_mark_complete`, `maintenance_mark_complete_where_{work_order,elsewhere}`, `maintenance_mark_complete_wo_${workOrderId}`, `input_maintenance_mark_complete_wo_search`, `input_maintenance_reset_date`, `maintenance_reset_date_offer_{lines_closed,invoice}`, `input_maintenance_mark_complete_shop`, `input_maintenance_mark_complete_reading`, `button_maintenance_mark_complete_confirm` |
| Worklist | `customers_tab_customers`, `customers_tab_maintenance`, `maintenance_tile_{overdue,due_month,due_3_months,needs_readings}`, `filter_chip_compliance` / `filter_chip_location_ids` (FilterBar convention), `table_maintenance_worklist`, `maintenance_worklist_row_${id}`, `button_maintenance_worklist_contact_${id}`, `button_maintenance_worklist_primary_${id}`, `maintenance_worklist_action_{mark_complete,skip,open_asset}_${id}`, `maintenance_worklist_wo_link_${id}`, `maintenance_worklist_empty_{none,window,filtered}` |
| Contact card | `maintenance_contact_card`, `maintenance_contact_phone_{telephone,mobile,company}`, `button_maintenance_contact_copy_email`, `maintenance_contact_no_{email,phone,contact}`, `button_maintenance_contact_set`, `dialog_maintenance_set_contact` |
| Shared | `error_<prefix>`, `button_retry_<prefix>`, `loading_<prefix>` (QueryState) |

Unchanged ids that E2E depends on and that P0 refactors move:
- `vehicle_tab_*` (`e2e/src/pages/customers/vehicle.page.ts`, `vehicle-inspections.page.ts`, `e2e/src/pages/work-orders/inspection-build.component.ts`);
- `button_new_customer` and `table_customers` (`e2e/src/pages/customers/customer.page.ts`, `app/cypress/e2e/customers/customer-list.cy.ts`);
- `table_customer_vehicles`.

### E2E tests

Planning only: no diff exists yet, so every Reference Update below comes from a grep of today's `e2e/` against the
identifiers this plan says it will move or add. Each one is checked again against the real diff when the phase's
`/e2e-after-change` runs. Rules applied: `coverage-policy.md` (§3 batchCap = 5 per phase, §5, §8, §9, §10) and
`test-scope-rules.md` §3 gates (first match wins). A Create entry passes only at gate 4. Every candidate that stops at
gates 1 to 3 is listed under "Dev-layer" in its phase block; those rows become `Test Layer = Dev` cases, not specs.

#### Cross-phase conventions (apply to every Create)

| Item | Decision | Why |
|---|---|---|
| Spec folder | `e2e/tests/ui/maintenance-reminders/<workflow>.spec.ts` | Plural slug (§4). Do **not** use `tests/ui/customers/`, because the `customers` project glob `**/customers/*.spec.ts` would collect it, and `admin` uses an explicit testMatch list |
| Playwright project | New `maintenance-reminders` project in `e2e/playwright.config.ts`: `storageState: .auth/admin.json`, `dependencies: ['setup-admin','setup-technician']`, `testMatch: ['**/ui/maintenance-reminders/*.spec.ts']` | Projects use explicit testMatch, and an unlisted spec runs nowhere (AGENTS.md "new spec never runs in CI"), so the folder needs its own entry |
| Domain tag / describe | `@maintenance`; `describe('<Workflow> Tests @maintenance')`; title `C<id> - Admin <action>` | §4 |
| Shared org, feature live | Every spec now runs with Maintenance live (no flag, D27). MR specs archive their schedules in `afterAll` (archived schedules make `organizationHasSchedules` false, so Plan 2's WO panel stays hidden in unrelated specs) and end their enrolments | No flag scope exists; cleanup keeps unrelated specs' DOM stable |
| Where they run | On the feature branch: locally and on the QA environment built from the branch. The invoicing flows (P6-1, P7-1) run on that QA environment (or locally with `workplace.bookkeeping_enabled = 0`), since stage only carries develop/main until the merge | D28 |
| Test data | Fresh customer + contact + vehicle per spec (`customerFactory.findOrCreate` → `ensureContact` → `vehicleFactory.create`). The fixture base vehicle is shared and collects every run's enrolments | Deterministic rows. Org-wide worklist and tile counts are never asserted as absolute numbers |
| Cleanup | Schedules **cannot be deleted** (S1-E1), so cleanup = `archive` (A6). Enrolments soft-end via A14. Unique names `MR-E2E <ts>` | Archived schedules pile up in the shared org. That is acceptable because the Archived tab is never count-asserted |
| "Today" | Compute last-done / reset dates with `e2e/src/utils/shop-tz-date.ts` (`shopTzDateKey`, `shiftDayKey`) in the header workplace tz | S12-R14: today = header location day |

**New factory (shared by P1 to P7):** `e2e/src/api/factories/maintenance.factory.ts` (`MaintenanceFactory`, not
`ScheduleFactory`, which already exists for the calendar schedule). Methods are added as each phase lands; register in
`factories/index.ts` + `src/fixtures/test-fixtures.ts`:
- P1: `createSchedule({name, services[]})` (A3 POST `maintenance/schedules`), `getSchedule(id)` (A2), `listSchedules({status, search})` (A1), `duplicate(id)` (A5), `archive(id)` (A6), `restore(id)` (A7), `listCannedLineOptions(search)` (A8). Helpers: `routineService({name, calendar:{every|at, value, unit}, mileage?, hours?, cannedLineIds[]})`, `complianceService({name, type, termMonths})`.
- P2: `enrol({vehicleId, companyId, scheduleId, services[]: {scheduleServiceId, lastDoneOn, meterAtPassedAction}})` (A11), `bulkEnrol` (A13), `removeEnrolment(id)` (A14), `addComplianceRecord(vehicleId, …)` (A18), `listComplianceRecords(vehicleId)` (A17).
- P2 (on `CustomerFactory`): `setMaintenanceNotifications(companyId, enabled)` (A15 PATCH), so the toggle spec can restore state.
- P3: `recordReadings(vehicleId, {mileage?, hours?})` (A22), `currentReadings(vehicleId)` (A21).
- P5: `getAssetMaintenance(vehicleId)` (A24), to resolve `enrolledServiceId`/`enrolmentId` for row test ids, `skip(enrolledServiceId)` (A26).
- P6: `markComplete(enrolledServiceId, body)` (A28), `createWorkOrderForService(enrolledServiceId, 'asset')` (A33).
- P7: `listReminders(params)` (A30), used only for diagnostics, never as the assertion.

Canned lines for P1+: `workOrderFactory.createCannedLineFromLine(...)` in the header workplace (A8 returns the schedule's
home-workplace lines, which is the header workplace for a schedule created in the test). Invoicing: `invoiceFactory.create`, `workOrderFactory.changeLineStatus/transitionTo`.

#### Scenarios

Spec paths below are under `e2e/tests/ui/maintenance-reminders/`. Full preconditions, gates, notes and page objects are in
each phase's "E2E tests" block in Section 6.

##### P0

**Test: P0-1 The Customers page carries a Maintenance reminders tab and keeps the search across tabs** (Happy path, S13-R1, S13-R32, NFR-F01)
_File:_ `e2e/tests/ui/maintenance-reminders/customers-maintenance-tab-shell.spec.ts` · _Role:_ admin · _Priority:_ P2 (page visibility) · _Preconditions:_ none beyond the admin session.

1. Open `/customers`. Expected: `customers_tab_customers` active; `table_customers` and `button_new_customer` visible.
2. Type a term in the page search, click `customers_tab_maintenance`. Expected: URL has `?tab=maintenance`; `button_new_customer` absent (S13-R32); the search input still holds the term.
3. Click `customers_tab_customers`. Expected: the customer list with the same search term applied.
- **Expected:** The tab shell keeps the customer list intact and shares one search across tabs.

##### P1

**Test: P1-1 Admin builds a schedule with a routine and a compliance service and saves it** (Happy path, S1-R1, S1-R14, S4-R7, S1-R3, S1-R4, S1-R6, S1-R8, S1-R9, S2-R1, S2-R2, S2-R4, S2-R5, S2-R6, S2-R11, S3-R1, S3-R2, S3-R3, S3-R7, S3-R8, S4-R1, S4-R2, S4-R3, S4-R6, S5-R1, S5-R2, S1-R12 (Assets column "0"))
_File:_ `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ One canned line "MR-E2E Oil change <ts>" exists in the header workplace (`workOrderFactory.createCannedLineFromLine`).

1. Settings → `link_maintenance_schedules_tab`. Expected: `table_maintenance_schedules` (or the empty state) on the Active tab. Read `MaintenanceFactory.listSchedules` → `workplaceCount`.
2. `button_maintenance_schedules_new`. Expected: URL `/maintenance-schedules/new`, title "Untitled schedule", Save disabled.
3. Rename the title to `MR-E2E PM <ts>`.
4. Add service "PM-A": calendar Every 6 months + mileage Every 10,000; Add canned lines → search → pick the line (the picker shows hours, no price); save the form. Expected: a row "PM-A", interval "10,000 mileage · 6 months", "1 line"; 3 default reminder rows were shown in the form (14 before / on / 7 after).
5. Add service "Annual inspection" and switch the compliance toggle on: type "CVIP", term 12. Expected: the trigger block is replaced; Remind before defaults to 1 month; no covered step.
6. Save. Expected: the editor stays open, the URL becomes `/maintenance-schedules/<id>` (`toHaveURL(/maintenance-schedules\/[0-9a-f-]{36}$/)`, D21) and a success toast shows. Back on the list the row shows Services 2 and Assets 0; when `workplaceCount > 1`, `maintenance_schedules_home_<id>` reads "Lines from <header workplace name>", otherwise it is absent.
7. Reload the editor. Expected: both services, triggers and lines persisted.
- **Expected:** The schedule document round-trips through the real BE with both service kinds intact.

**Test: P1-2 Admin adds a covering service and reorders services on an existing schedule** (Happy path, S2-R16, S2-R17, S2-R18, S2-R19, S1-R10, S4-R5, S6-R11, S6-R3, S1-R8)
_File:_ `e2e/tests/ui/maintenance-reminders/schedule-edit-covering.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Schedule via API with one routine service "PM-A" holding 2 canned lines.

1. Open the schedule. Add a service "PM-B"; the covers step lists "PM-A"; tick it. Expected: PM-A's 2 lines arrive marked "from PM-A".
2. Save the form. Expected: the PM-B row reads "2 lines · 2 covered"; keyboard focus / Enter on `maintenance_service_lines_<key>` opens the hover card listing PM-A, then the lines.
3. `maintenance_service_action_move_up_<PM-B>`. Save the schedule. Reload. Expected: PM-B is first and still covers PM-A.
4. Remove PM-A with the confirm. Save. Reload. Expected: PM-B keeps its 2 lines, and the covered count is 0.
- **Expected:** Covering, reorder and removal persist exactly as edited.

**Test: P1-3 Admin duplicates, archives and restores a schedule** (Happy path, S6-R12, S6-E5, S6-R5, S6-R6 (copy + confirm), S6-R8, S1-R2 (tabs + counts), S1-R13, S1-E1)
_File:_ `e2e/tests/ui/maintenance-reminders/schedule-lifecycle.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Schedule `MR-E2E Fleet <ts>` via API.

1. Row menu → Duplicate. Expected: the editor opens on "MR-E2E Fleet <ts> (Copy)"; the copy's home caption (when shown) equals the original's (S6-E5). Save/close.
2. Row menu on the original → Archive. Expected: `dialog_maintenance_archive_schedule` with the exact S6-R6 red copy; confirm.
3. Archived tab. Expected: the row is present; the Active and Archived badge counts changed by ±1 against the values read in step 0 (deltas only).
4. Open the archived row. Expected: every control disabled, only Restore offered.
5. Restore. Expected: the row is back on Active.
- **Expected:** The archive and restore lifecycle and the read-only state are driven by real server status.

**Test: P1-4 A user without Settings Service cannot reach Maintenance schedules** (Edge case, S1-N2)
_File:_ `e2e/tests/ui/maintenance-reminders/schedule-settings-role-gate.spec.ts` · _Role:_ technician (`loggedInAsTechnician`) or a fresh custom role without `settingsService` (preferred: `ReportRoleSeeder` / `custom-role.fixtures.ts`, since the local stack has no technician) · _Priority:_ P2 · _Preconditions:_ `expectAuthenticatedShell(page)` before any absence assertion (AGENTS.md local-cookie trap).

1. As the restricted user, open Settings. Expected: no `link_maintenance_schedules_tab`.
2. Deep-link `/administration/maintenance-schedules`. Expected: redirected away (first permitted route / Error), and no `table_maintenance_schedules`.
- **Expected:** The tab cannot be reached without settingsService, in the UI or the API.

##### P2

**Test: P2-1 Admin enrolls several of a customer's assets in a schedule from the Assets tab** (Happy path, S7-R24, S7-R25, S7-R26, S7-N7, S7-R10, S7-R13 (checkbox shown), S6-R1, S6-R4, S1-R12 (Assets count goes live))
_File:_ `e2e/tests/ui/maintenance-reminders/bulk-enrolment.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Fresh customer + contact + 3 vehicles (unit numbers `MR<ts>-1..3`). Active schedule via API (any workplace; the header workplace for simplicity).

1. `/customers/<cid>/vehicles` → `button_maintenance_enroll_in_schedule`. Expected: `dialog_maintenance_enrolment` titled "Enroll in schedule".
2. Pick the schedule. Type `MR<ts>` in `input_maintenance_enrolment_asset_search`. Expected: the 3 assets are listed.
3. Tick 2 assets. Expected: the confirm reads "Enroll 2 assets"; the history line says "0 of 2 have a last service on record…".
4. Confirm. Expected: a toast with the enrolled count; the dialog closes.
5. Reopen, pick the same schedule. Expected: the 2 assets are greyed "Already on this schedule" (checkbox `aria-disabled`); the third can be ticked.
6. Settings → Maintenance schedules. Expected: the schedule's Assets column = 2.
- **Expected:** Bulk enrolment persists per asset and drives both the greyed state and the live count.

**Test: P2-2 Admin adds a compliance record on the asset card, then adds a renewal** (Happy path, S8-R13, S8-R2, S8-R3, S8-R4, S8-R10, S8-R11, S8-E2, S8-R7, S8-R12, S8-N1, S8-N3)
_File:_ `e2e/tests/ui/maintenance-reminders/compliance-record.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Fresh customer + vehicle; no schedule needed (S8-N1).

1. `/customers/vehicle/<vid>/work-orders?companyId=<cid>` → `maintenance_compliance_section` → `button_maintenance_compliance_add_record`.
2. Type "CVIP", term 12, End date = today + 11 months (`shiftDayKey`), number "AB-<ts>". Expected: Start date derived = End − 12 months, shown in `input_maintenance_certificate_start`.
3. Save. Expected: the section line reads "CVIP · AB-<ts> · ends <D Mon YYYY>".
4. Reload. Expected: the same line.
5. Open the line → Edit current: change the number → save. Expected: the line shows the new number.
6. `button_maintenance_compliance_add_record` again with a later End date. Expected: the line shows the renewal (latest End date is current); the dialog's history lists the previous record read-only.
- **Expected:** Records persist, the latest End date is current, and renewals append history.

**Test: P2-3 Admin turns maintenance notifications off for a customer with enrolled units** (Happy path, S7-R18, S7-R19, S7-R21, S7-R22 (enabled for an editor), S7-R17 (default on), S21-R7 (recorded; not asserted in UI))
_File:_ `e2e/tests/ui/maintenance-reminders/customer-maintenance-notifications.spec.ts` · _Role:_ admin · _Priority:_ P2 · _Preconditions:_ Fresh customer + contact with email + 2 vehicles enrolled via `MaintenanceFactory.bulkEnrol`.

1. `/customers/<cid>/work-orders`. Expected: `maintenance_customer_notifications_toggle` is ON.
2. Toggle off. Expected: `maintenance_customer_notifications_silenced` reads "2 enrolled units will not receive reminders".
3. Reload. Expected: the toggle is still off and the silenced text still shows.
4. Toggle on (restore). Expected: the silenced text is gone.
- **Expected:** The setting persists at the customer level and reports the real silenced-unit count.

**Test: P2-4 Admin attaches a PDF certificate to a compliance record and removes it** (Happy path, S8-R9 (Q5), NFR-018)
_File:_ `e2e/tests/ui/maintenance-reminders/certificate-attachment.spec.ts` · _Role:_ admin · _Priority:_ P2 · _Preconditions:_ Vehicle with one compliance record via `MaintenanceFactory.addComplianceRecord`. A small PDF fixture under `e2e/fixtures/files/`.

1. Open the record → `button_maintenance_certificate_attach` → set the file through `page.waitForEvent('filechooser')` (`useFilePicker` clicks a detached `<input type=file>`). Expected: a file chip with the name.
2. Save, reload, reopen. Expected: the chip persists.
3. `button_maintenance_certificate_remove_attachment` → save → reopen. Expected: no chip.
- **Expected:** Exactly one attachment per record, stored and removed through the real endpoints.

**Test: P2-5 Archiving a schedule unenrolls its assets and takes it out of enrolment** (Edge case, S6-R6 (unenrol effect), S6-R7, S6-E4)
_File:_ `e2e/tests/ui/maintenance-reminders/schedule-archive-unenrols.spec.ts` · _Role:_ admin · _Priority:_ P2 · _Preconditions:_ Customer + 1 vehicle enrolled via API in schedule S.

1. Settings → archive S through the UI (exact red copy). Expected: S on the Archived tab with Assets 0.
2. `/customers/<cid>/vehicles` → Enroll in Schedule → open `select_maintenance_enrolment_schedule`. Expected: S not offered.
- **Expected:** Archive ends enrolments set-based and blocks re-applying the schedule.

##### P3 and P4

No E2E scenarios: P3 builds `ReadingDialog.vue` without mounting it (its E2E is P5-2), and P4 is engine and projection only. The §8 skip / override situation for each is stated in its phase block.

##### P5

**Test: P5-1 Admin enrolls an asset from its empty Maintenance tab and sees its services with due status** (Happy path, S9-R16, S9-R14, S7-R1, S7-R2, S7-R4, S7-R6, S7-R7, S7-R8, S9-R4, S9-R5, S9-R6, S9-R7, S9-N3 (needs-reading basis), S6-R1, S7-N2)
_File:_ `e2e/tests/ui/maintenance-reminders/asset-tab-enrol.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Fresh customer + contact + vehicle with no readings. Schedule via API: "Oil" (calendar Every 6 months + mileage Every 10,000, 1 canned line) + compliance "CVIP" term 12.

1. `/customers/vehicle/<vid>?companyId=<cid>`. Expected: lands on Work Orders; `vehicle_tab_maintenance` is the last tab.
2. `vehicle_tab_maintenance`. Expected: `maintenance_asset_not_enrolled` + `button_maintenance_asset_enroll`.
3. Enroll → schedule → for "Oil" set `input_maintenance_enrolment_last_done_<id>` = today − 8 months. Expected: the CVIP row shows "No record" + "+ Add record".
4. Confirm. Expected: `table_maintenance_asset_services` with an "Oil" row whose `maintenance_badge_<id>` = Overdue and whose `maintenance_due_<id>` reads "Calendar · needs mileage reading"; the CVIP row reads "No record" with no badge.
- **Expected:** Single-asset enrolment produces projection rows whose status, due basis and order render on the tab.

**Test: P5-2 Admin enters a mileage reading, confirms a lower value, and undoes it** (Happy path, S10-R1, S10-R2, S10-R6, S10-R9, S10-N1, S10-N2/N3, S10-R7, S9-R1, S9-R2, S9-E2, S10-R4)
_File:_ `e2e/tests/ui/maintenance-reminders/asset-reading-dialog.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Enrolled vehicle (API). One reading 50,000 recorded through `MaintenanceFactory.recordReadings`.

1. Maintenance tab → `button_maintenance_enter_mileage`. Expected: `dialog_maintenance_reading` with the current 50,000 on the left (source + age).
2. Type 49,000 in `input_maintenance_reading_mileage`. Submit. Expected: the orange `maintenance_reading_warning_mileage` appears (not red); nothing saved yet.
3. `button_maintenance_reading_confirm_anyway`. Expected: dialog closed; `maintenance_reading_card_mileage` shows 49,000 recorded; the undo toast is shown.
4. `button_notification_undo`. Expected: the card shows 50,000 again.
- **Expected:** The reading saves without validation, flags lower values, and undo reverts the vehicle value.

**Test: P5-3 Admin skips a routine service, and a new reading brings it back** (Edge case, S9-R13, S9-R18, S9-E4, S21-R1)
_File:_ `e2e/tests/ui/maintenance-reminders/asset-skip-service.spec.ts` · _Role:_ admin · _Priority:_ P2 · _Preconditions:_ Enrolled vehicle with routine service "Oil" (API).

1. Row menu → `maintenance_asset_action_skip_<id>`. Expected: the row stays, the badge reads Skipped (grey), and the date is unchanged.
2. Row menu shows `…undo_skip_<id>`; click it. Expected: the badge returns to the prior status.
3. Skip again → Enter mileage (any value) → save. Expected: the "Oil" badge is no longer Skipped.
- **Expected:** Skip is reversible by hand and cleared automatically by a new reading.

**Test: P5-4 Admin removes an asset from a schedule while its compliance record stays** (Happy path, S6-R13, S6-R14, S8-R8, S6-E1)
_File:_ `e2e/tests/ui/maintenance-reminders/asset-remove-from-schedule.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Vehicle enrolled (API) in a schedule with a compliance service; one compliance record via API.

1. Maintenance tab → `maintenance_schedule_menu_<enrolmentId>` → `maintenance_schedule_action_remove_<enrolmentId>`. Expected: `dialog_maintenance_remove_from_schedule` with the exact copy "Remove {unit} from {schedule}? …"; red confirm.
2. Confirm. Expected: the schedule's rows leave; the not-enrolled state shows.
3. Asset card. Expected: the compliance record line is still present.
- **Expected:** Removal soft-ends tracking without losing history.

##### P6

**Test: P6-1 Invoicing a work order that addresses a service resets that service automatically** (Happy path, S18-R13 (automatic half), S18-R6, S18-R9, S18-R10, S12-E5, S10-R11 (in-shop settlement, TD-35), NFR-005, S13-R26 (BE))
_File:_ `e2e/tests/ui/maintenance-reminders/invoice-resets-service.spec.ts` · _Role:_ admin · _Priority:_ P4 (invoicing) · _Preconditions:_ Vehicle enrolled (API) in "Oil" with last done = today − 8 months (overdue). WO created via `MaintenanceFactory.createWorkOrderForService(id, 'asset')` (A33, so lines + link exist). Lines completed via `workOrderFactory.changeLineStatus` (stamps `end_date`), WO transitioned to complete.

1. `/workorders/<woId>/finance` → create the invoice through the existing finance UI. Expected: the invoice is created (existing invoice success signal); no error toast.
2. Asset `…/maintenance`. Expected: the "Oil" row's Last done = the lines-closed date (today), the badge no longer reads Overdue, and Next due is ~6 months out.
- **Expected:** Invoicing still succeeds and silently resets the linked service from the lines-closed date.

**Test: P6-2 Admin marks a service complete against a work order and undoes it** (Happy path, S18-R1, S18-R2, S18-R3, S18-R6, S18-R11, S18-R17, S18-R19, S10-R11, S9-R9)
_File:_ `e2e/tests/ui/maintenance-reminders/mark-complete-on-work-order.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Enrolled vehicle, "Oil" overdue; one open (uninvoiced) service WO for the vehicle via `workOrderFactory.create`, with mileage 61,000 entered on it (`workOrderFactory.setMileage(woId, 61000)`, an entered value per S10-N6).

1. Row menu → `maintenance_asset_action_mark_complete_<id>`. Expected: `dialog_maintenance_mark_complete` "Mark Oil complete".
2. `maintenance_mark_complete_where_work_order` → pick `maintenance_mark_complete_wo_<woId>`. Expected: `input_maintenance_reset_date` defaults to today (uninvoiced WO); a future date cannot be picked.
3. Confirm. Expected: the toast "Oil marked complete · next due counts from <today>" with Undo; the row reads "Completed · next due counts from <today>".
4. Expected: `maintenance_reading_card_mileage` shows 61,000 recorded, not In the shop (S18-R19).
5. Undo. Expected: the row returns to Overdue; the mileage card reads In the shop again.
- **Expected:** Mark complete resets at once, records the WO's reading, and is undoable while still the latest cycle.

**Test: P6-3 Admin completes a compliance inspection, and the certificate appears on the asset card** (Happy path, S18-R5, S8-R5, S8-E4, S9-R11)
_File:_ `e2e/tests/ui/maintenance-reminders/mark-complete-compliance.spec.ts` · _Role:_ admin · _Priority:_ P3 · _Preconditions:_ Enrolled vehicle with compliance service "CVIP" term 12 and no record (row "No record").

1. CVIP row menu → Mark complete → Completed elsewhere, reset date = today; certificate fields: number "C-<ts>". Expected: Start date = today (the Reset date); End date = today + 12 months.
2. Confirm. Expected: the CVIP row's `maintenance_due_<id>` reads '<D Mon YYYY+1>' (the End date, day precision) with basis "Certificate".
3. Asset card. Expected: `maintenance_compliance_record_<id>` "CVIP · C-<ts> · ends <D Mon YYYY+1>".
- **Expected:** One transaction creates the completion and the compliance record, and moves the due date.

**Test: P6-4 Admin records a service done at another shop with a reading** (Edge case, S18-R4, S18-R11, S21-R3)
_File:_ `e2e/tests/ui/maintenance-reminders/mark-complete-elsewhere.spec.ts` · _Role:_ admin · _Priority:_ P2 · _Preconditions:_ Enrolled vehicle with routine "Oil" (mileage trigger).

1. Mark complete → `maintenance_mark_complete_where_elsewhere`. Expected: the reset date is empty and required (Confirm blocked until set).
2. Shop "Jiffy <ts>", reading 61,000, date = today − 3 days. Confirm. Expected: the row reads "Completed · next due counts from <date>".
3. Reading card. Expected: mileage 61,000 recorded.
- **Expected:** The elsewhere path stores the shop, date and reading, and resets from the entered date.

##### P7

**Test: P7-1 Admin works a due service from the worklist through work order and invoice until it clears** (Happy path, S13-R1, S13-R6, S13-R7, S13-R13, S13-R14, S13-R16, S13-R17, S13-R25, S13-R26, S13-R30, S13-R38, S17-R2, S17-R7, S16-R19, S22-R1 (stored))
_File:_ `e2e/tests/ui/maintenance-reminders/worklist-create-wo-to-invoice.spec.ts` · _Role:_ admin · _Priority:_ P4 (creates and invoices a WO) · _Preconditions:_ Fresh customer + contact + vehicle `MR<ts>` enrolled (API) in "Oil" overdue (calendar Every 6 months, last done today − 8 months; 2 canned lines at the schedule's home workplace = the header workplace).

1. `/customers?tab=maintenance` → search `MR<ts>`. Expected: `maintenance_worklist_row_<id>` showing asset `MR<ts>`, the customer, "Oil", badge Overdue; primary action "Create work order".
2. `button_maintenance_worklist_primary_<id>`. Expected: navigates to the new WO (estimate) with the 2 canned lines appended.
3. Back to the worklist. Expected: `maintenance_worklist_wo_link_<id>` shows the WO number + status; the primary action reads "Open work order".
4. API: complete lines + transition the WO to complete. Reload the worklist. Expected: the primary action reads "Invoice".
5. Click Invoice. Expected: lands on `/workorders/<id>/finance` with no auto-opened invoice dialog. Create the invoice through the UI.
6. Back to `/customers?tab=maintenance`, search `MR<ts>`. Expected: no row for "Oil" (S13-R26, S13-R43: the invoicing completion rests the row until its next cycle's first reminder row, and the next due is about 6 months out).
- **Expected:** A due service can be acted on and cleared without leaving the worklist flow.

**Test: P7-2 Admin narrows the worklist with a tile and search, and the filters survive leaving the list** (Happy path, S13-R2, S13-R4, S13-R5, S13-R40, S13-R32, S13-R37 (search), S13-R42)
_File:_ `e2e/tests/ui/maintenance-reminders/worklist-filters-persist.spec.ts` · _Role:_ admin · _Priority:_ P2 · _Preconditions:_ Two fresh vehicles enrolled: A overdue (routine), B with compliance due within 30 days (record **End date = today + 20 days**).

1. `/customers?tab=maintenance`, search `MR<ts>`. Expected: rows for A and B.
2. Click `maintenance_tile_overdue`. Expected: only A's row.
3. Click Overdue again (clear), click `filter_chip_compliance`. Expected: only B's row.
4. Row menu → `maintenance_worklist_action_open_asset_<B>` → browser back. Expected: the compliance chip and search term are still applied; only B's row.
- **Expected:** Tiles, chip and search narrow the real result set and persist across navigation.

**Test: P7-3 Admin opens a row's contact card and sets a preferred contact when none exists** (Happy path, S14-R1, S14-R2, S14-R8, S14-N4, S14-E1, S13-R41)
_File:_ `e2e/tests/ui/maintenance-reminders/worklist-contact-card.spec.ts` · _Role:_ admin · _Priority:_ P2 · _Preconditions:_ Vehicle V1 enrolled + overdue, whose customer has a contact with phone + email set as preferred. Vehicle V2 enrolled + overdue, whose customer has a contact but no preferred contact on the vehicle.

1. V1 row → `button_maintenance_worklist_contact_<id>`. Expected: `maintenance_contact_card` with `maintenance_contact_phone_telephone` (`tel:` href) and the email + `button_maintenance_contact_copy_email`; no Send reminder button.
2. V2 row → Contact. Expected: `maintenance_contact_no_contact` + `button_maintenance_contact_set`.
3. Set contact → `dialog_maintenance_set_contact` → pick the contact → save. Expected: reopening the card shows that contact's details.
- **Expected:** The contact card reflects real contact data and can fix a missing preferred contact in place.

**Test: P7-4 Skipping from the worklist hides the row but keeps it on the asset tab** (Edge case, S13-R16, S9-R13, S13-N3, S18-R17 (worklist half), S18-E8, S13-R43)
_File:_ `e2e/tests/ui/maintenance-reminders/worklist-skip-mark-complete.spec.ts` · _Role:_ admin · _Priority:_ P2 · _Preconditions:_ Vehicle enrolled with two overdue routine services "Oil" and "Brakes"; "Brakes" is calendar Every 2 months with the default reminder rows and watches no meter (never Needs readings; next due after completion stays inside the 91-day window).

1. Worklist, search `MR<ts>` → "Oil" menu → `maintenance_worklist_action_skip_<id>`. Expected: the "Oil" row leaves; "Brakes" remains.
2. "Brakes" menu → `maintenance_worklist_action_mark_complete_<id>` → Completed elsewhere, today → confirm. Expected: the "Brakes" row leaves although its next due is inside the window (S13-R43); after a reload it is still absent.
3. Asset `…/maintenance`. Expected: "Oil" shows Skipped (grey, date kept); "Brakes" shows "Completed · next due counts from <today>".
- **Expected:** Worklist actions change real state that both surfaces agree on.


#### Summary counts

| Phase | Create | Backlog | Reference updates (edit / verify-only / re-run) | §8 |
|---|---|---|---|---|
| P0 | 1 | 0 | 2 edit (R0-1, R0-2) + 4 verify | — |
| P1 | 4 | 1 | 3 verify (+R0-5 overlap) | — |
| P2 | 5 | 1 | 3 verify | — |
| P3 | 0 | 0 | re-run set (no edits) | `no-fe-diff` if the FE component moves to P5; else override marker |
| P4 | 0 | 0 | 0 | `prop-type-rename` (and outside §9 anyway) |
| P5 | 4 | 1 | 2 edit (R5-1, R5-2) + 1 verify | — |
| P6 | 4 | 1 | re-run set (no edits) | — |
| P7 | 4 | 2 | 2 verify | — |
| **Total** | **22** | **6** | **4 edits, 13 verify-only, 2 re-run sets (19 entries)** | |

All counts assume the coverage pass runs once, on the branch → develop PR (D28); per-phase PRs into the branch carry their own specs where the data exists. Any workflow not already covered by the per-phase specs goes to Backlog in that one run (batchCap 5) and needs the override marker.

#### Backlog

A non-zero Backlog fails the advisory CI check and does not satisfy the local hard-block (§7, §11). For P2, P5, P6 and P7,
either write the backlog spec in the same PR or ship with the override marker and keep the Backlog table in the block (P1 too since 2026-10-04).

| Phase | Workflow | Why deferred | Suggested file |
|---|---|---|---|
| P1 | A user without access to the schedule's home location sees its canned lines read only, with the (i), and can still edit the name and triggers (S4-R9, S4-R8, S1-R14) | Needs ≥2 workplaces and a user scoped to one (custom user, not a role); the fixture org has one workplace | `e2e/tests/ui/maintenance-reminders/schedule-home-location-readonly.spec.ts` |
| P2 | A view-only customer role sees no Enroll in Schedule button and cannot PATCH notifications (S7-R22, `canEditCustomerSide`) | Ranked 6th by value-per-test; needs a fresh custom role (`custom-role.fixtures.ts`) | `e2e/tests/ui/maintenance-reminders/enrolment-role-gate.spec.ts` |
| P5 | A user with customers view but no customer edit sees the tab read-only (no Enroll, Enter mileage or row actions) (`canEditCustomerSide`, S6-R13 same permission as enrolling) | Ranked 5th. The P5 walk says "tech (view-only on customers **if configured**)": the role baseline is unverified, and it needs a fresh custom role | `e2e/tests/ui/maintenance-reminders/asset-tab-role-gate.spec.ts` |
| P6 | The Mark complete picker lists work orders from another location of the org (S18-R2, S18-R12, GR-2) | Needs ≥2 active workplaces with a WO at each; the fixture org has one. Seeding (`workplaceFactory.create` + `activate`) is heavy | `e2e/tests/ui/maintenance-reminders/mark-complete-cross-location.spec.ts` |
| P7 | The worklist is org-wide: rows whose last visit was at another location are visible, and switching the header location does not narrow the list (S13-R28, S13-R27, GR-1) | Needs ≥2 active workplaces + a WO at the second one (same seeding cost as the P6 item); ranked 5th | `e2e/tests/ui/maintenance-reminders/worklist-org-wide.spec.ts` |
| P7 | Create work order at a location other than the schedule's home copies the work: line names/hours present, no parts, internal line note "Copied from …" (S13-R30, S16-N6, S16-R22, S16-R23) | Needs ≥2 workplaces with canned lines at one only (shared seeding with the P6/P7 cross-location items) | `e2e/tests/ui/maintenance-reminders/worklist-create-wo-copied-work.spec.ts` |

#### Reference updates (mandatory, uncapped)

- **R0-1** (P0, edit) `e2e/src/pages/customers/customers.page.ts:16`: `newCustomerButton = //button[@aria-label='New']`. Today's `Customers.vue` renders `aria-label="New customer"` + `data-test-id="button_new_customer"`, so the locator already looks stale (it may already be failing on develop: see the environment notes below). P0 rewrites this header into the shell. Edit: repoint to `[data-test-id='button_new_customer']` (used by `tests/ui/customers.spec.ts:914` C20266).
- **R0-2** (P0, edit) `e2e/src/pages/customers/customers.page.ts:15,21,22,59`: XPath `//table[contains(@class,'q-table')]`, `//tbody/tr`, `//tbody/tr/td[1]`. P0 moves the list into `CustomerListPanel` inside `q-tab-panels`. Edit: repoint `customersTable` to `[data-test-id='table_customers']` and scope rows to it (`tbody:not(.q-virtual-scroll__padding) tr`). With the feature always on, the worklist panel exists beside the list whenever the user opened the tab; scoping to `table_customers` is required, not optional. **Mandatory before the branch → develop PR.**
- **R0-3** (P0, verify-only) `e2e/src/pages/customers/vehicle.page.ts:42-44`, `vehicle-inspections.page.ts:100,105`, `work-orders/inspection-build.component.ts:334`: `vehicle_tab_work-orders/invoices/notes/inspections`, read with `toHaveClass(/q-tab--active/)` on the element that carries the id. P0 replaces the 3 copies in `VehicleInvoices.vue` (:226-247, :265-286, :341-362) with `VehicleTabsBar`. Verify-only if `VehicleTabsBar` keeps `data-test-id` on the `q-route-tab` root (the `<a class="q-tab">`) and one bar per panel; if the id moves to an inner node or the tab becomes a plain `q-tab`, edit these locators. Re-run `tests/ui/customers/vehicle-asset-profile-tabs.spec.ts`, `asset-invoices-columns.spec.ts`, `asset-delete.spec.ts`, `tests/ui/vehicle-merge.spec.ts`, `tests/ui/administration/imported-invoice-views.spec.ts`, `tests/dvi-v2/asset-inspections-tab.spec.ts`.
- **R0-4** (P0, verify-only) `tests/permissions/custom/customer-management-enforcement.spec.ts:302,405,1042`, `permissions-helper.page.ts:144`, `tests/permissions/customers-parts-permissions.spec.ts:56,68`: `button_new_customer` / text "New Customer". The button moves into the shell header and is hidden on the maintenance tab. The tabs are always present for customers-view roles; `button_new_customer` stays in the shell header on the Customers tab, so the specs still find it (id kept per §7.4).
- **R0-5** (P0, verify-only) inspection builder specs (`tests/ui/inspection-templates.spec.ts`, `tests/ui/inspections/*.spec.ts`, `src/pages/administration/inspection-builder.page.ts`): ids `testId` / `${testId}_input` on `InspectionEditableText`, drag via `useSortable`. `InspectionEditableText` becomes a wrapper around `EditableTitle`; `useSortable` moves. The plan keeps ids and re-exports. Re-run.
- **R0-6** (P0, verify-only) any existing spec opening a `BaseDialog`/`BaseFormDialog` at phone width (`tests/ui/customers/vehicle-asset-profile-tabs.spec.ts`, `inspection-fill-mobile.spec.ts`, `filters-mobile-sheet-apply.spec.ts`): dialog card classes / sizing. Opt-in `fullscreenOnPhone` (default false); NFR-F02 byte-identical default.
- **R1-1** (P1, verify-only) `tests/permissions/custom/settings-access-enforcement.spec.ts` (individual `getByTestId('link_*_tab')`): new nav item `link_maintenance_schedules_tab` in the Service group. The item renders for every settingsService role; individual `getByTestId('link_*_tab')` checks are unaffected.
- **R1-2** (P1, verify-only) `src/pages/administration/adjustment-templates.page.ts:189-195` (`serviceNavGroup` = `div:has(> .navbar-vertical-label):has(link_adjustment_templates_tab)`) used by `tests/ui/administration/adjustment-templates.spec.ts:150`: the Service nav group gains an item. It asserts the heading, not the item count.
- **R1-3** (P1, verify-only) `tests/permissions/redirect-to-first-permitted.spec.ts`: `getFirstPermittedRoute()` ordering over Administration children. The child is placed after `InspectionTemplates` (§2.6) so the first-permitted target is unchanged; verify, edit only if the ordering differs.
- **R1-4** (P1) `inspection-builder.page.ts` / DI specs: `useSortable` re-export. Covered by R0-5.
- **R2-1** (P2, verify-only) `src/pages/customers/customer.page.ts:42-48` (`customerName` XPath incl. `//div[contains(@class,'card-title')]` and `//main//button[.//img]/preceding-sibling::div[1]`, `.first()`): the left card gains the toggle (`CustomerLeftSection.vue`); the Assets tab gains a button beside `button_new_asset`. The toggle is now always on the card; verify `.first()` still resolves to the name, edit to a test-id locator if not.
- **R2-2** (P2) `src/pages/customers/customer.page.ts:89` `button_new_asset`: sibling button added. None (id-based).
- **R2-3** (P2, verify-only) `src/pages/customers/vehicle.page.ts` (asset card): new Compliance `q-card` after the Preferred Contact card in `VehicleInvoices.vue` (:174-210). No positional locators found.
- **P3 re-run set** (no edits expected): `tests/ui/work-order-extended.spec.ts` (completion with mileage + engine hours, ~:428), `tests/ui/work-orders/completion-required-field-gates.spec.ts`, `completion-simple-flow.spec.ts`, `tests/ui/customers.spec.ts` C2200 (update vehicle without changing VIN), `tests/ui/asset-import.spec.ts`, `tests/ui/vehicle-merge.spec.ts`, and any spec using `workOrderFactory.setMileage/setEngineHours` (`work-order.factory.ts:835,862`). No locator, route or text changes.
- **R5-1** (P5, edit, **mandatory before the branch → develop PR**) `tests/ui/customers/vehicle-asset-profile-tabs.spec.ts` (mobile 390 px, asserts each `vehicle_tab_*` visible); `tests/dvi-v2/asset-inspections-tab.spec.ts:308` (siblings loop): a 4th (5th with DVI v2) tab is always present. At 390 px `q-tabs` may scroll, pushing Notes out of view: where the spec asserts each tab visible without scrolling, edit it to scroll the tab into view first.
- **R5-2** (P5, edit) `src/pages/customers/vehicle-inspections.page.ts` `AssetTab` type: new tab name. Add `'maintenance'` to the union (needed by P5-1).
- **R5-3** (P5) routes: `customers/vehicle/:id` children (`goto`/`toHaveURL` on `/work-orders`, `/invoices`, `/notes`): new child `maintenance`. None (additive).
- **P6 re-run set** (no edits expected): P6 extracts `ServiceWorkOrderOpener` from WO Create and `CannedLineAppender` from CreateFromCannedLine, fixes the line `end_date` stamping, dispatches events in vehicle delete/merge/VIN-change, and runs a subscriber inside invoice creation. Re-run `tests/ui/work-orders/new-line-from-canned-line.spec.ts`, `tests/ui/inspection-canned-line.spec.ts`, `tests/ui/work-orders/scheduled-work-order-create.spec.ts`, `tests/ui/work-orders/credit-hold-wo-creation-gate.spec.ts`, `tests/ui/customers/asset-delete.spec.ts`, `tests/ui/vehicle-merge.spec.ts`, `tests/ui/work-orders/bulk-create-invoice.spec.ts`, `completion-*.spec.ts`, `tests/ui/finance.spec.ts`, `tests/ui/billing/*`. No identifier changes.
- **R7-1** (P7, verify-only) `src/pages/customers/customers.page.ts` (after R0-2): the worklist table is mounted in the Maintenance panel (`table_maintenance_worklist`). None if R0-2 scoped the locators to `table_customers`; otherwise the generic `//tbody/tr` would match worklist rows whenever the worklist panel was opened.
- **R7-2** (P7) `components/ts/maintenance/worklist/MaintenanceRemindersTab.vue` stub copy: replaced. None (P0-1 deliberately does not assert the stub).
- **R-ALL-1** (verify, re-run set): with no flag, every existing spec that opens `/customers`, an asset page, a customer page or Settings now meets the additions; re-run the `customers`, `admin` and `permissions` projects on the branch before the PR to develop.

#### Testability notes

FE work beyond `data-test-id` / `aria-label` that the scenarios need, and how each is settled. No hard FE blocker was found
for the 22 planned scenarios themselves.

| # | Phase | Component | What is missing | Resolution |
|---|---|---|---|---|
| B1 | P1 | `MaintenanceScheduleEditor.vue` (new) | No defined success signal after the **first Save** of `/maintenance-schedules/new` (S1-R4) | **Resolved by D21**: the editor stays open, does `router.replace` to the schedule's `/:id` route and shows a success toast. P1-1 waits on `toHaveURL(/maintenance-schedules\/[0-9a-f-]{36}$/)` |
| B2 | P5, P7 | `WorklistTiles.vue`, `WorklistTable.vue`, `VehicleMaintenanceTab.vue` | No observable "refetch in flight" state. After a mutation, TanStack keeps showing the stale value while `isFetching`, so a count or value change cannot be waited on deterministically (only row appearance/disappearance can) | **Resolved by D22 / NFR-F12**: `:data-loading="isFetching"` on the tiles container, the table and the tab root. Binding to state is outside the e2e carve-out, so it is in the FE file tables of P5 and P7. The P7 scenarios still avoid absolute counts |
| B4 | P6 | `MarkCompleteDialog.vue` success toast | The plan names Undo for Mark complete but not its test id (the reading dialog explicitly reuses `button_notification_undo`) | Confirm the shared `utils/helpers.ts:1070` notify-undo path (`button_notification_undo`, FD-20). An attribute-only gap is fixable by the implementer |
| B5 | P5, P7 | Test data, not FE | Estimated readings / confidence need ≥2 readings ≥7 days apart, but A22 records "today" only. There is no API to backdate a reading, so estimate/confidence rendering cannot be seeded for E2E | Keep it Dev-layer (BE unit engine + fe-unit `ReadingCard`/`ConfidenceMeter`). If E2E is ever wanted, a test-only backdated reading seed would be a BE ask (out of e2e scope) |
| B6 | P6, P7 | Environment | Local invoice creation 500s | See the environment notes below |
| B7 | P0, P1, P2, P5 | Plan coordination | DVI v2 Inspections tab vs the P0 tab-bar extraction | See the collision notes below; and branch drift (FR21, BR18) |
| B8 | P1, P7 | Test data | Cross-location scenarios (S4-R9 read-only lines, S13-R30 copied work) need a second workplace and a user scoped to one | Same seeding cost as the existing P6/P7 cross-location backlog; Backlog until two-workplace seeding lands |

#### Environment and collision notes

- **Invoicing flows run on the QA environment built from the feature branch.** Invoice creation 500s on the local stack
  because of a QuickBooks bookkeeping row with no auth (null `auth`). The two invoicing E2E flows, P6-1 and P7-1, therefore
  run on the branch's QA environment (stage carries only develop/main until the merge); locally, clearing
  `workplace.bookkeeping_enabled` is the workaround the E2E pass names.
- **No flag: the maintenance surfaces appear in every existing spec's org** (D27): the Customers tab shell (R0-2, already
  an edit), the asset page's 4th tab (R5-1), the customer card toggle and Compliance section (R2-1). Treat R0-2 and R5-1
  as **mandatory edits** before the branch → develop PR.
- **DVI v2 collision.** DVI v2's Inspections tab collides with the P0 asset tab-bar extraction in `VehicleInvoices.vue`
  (`tests/dvi-v2/asset-inspections-tab.spec.ts` and `vehicle-inspections.page.ts` already target a
  `vehicle_tab_inspections` that is not on develop). Whichever merges second adapts: it adds its tab through
  `navigationTabs`, keeping `vehicle_tab_${name}` on the `q-route-tab` root.
- **Possibly stale locator on develop.** `customers.page.ts` `newCustomerButton` (`@aria-label='New'`) does not match
  today's "New customer" label, so C20266 may already fail on develop. Confirm before attributing it to P0 (R0-1).
- **Technician baseline.** The local stack has no technician account (AGENTS.md). For P1-4 and the P5 backlog item, prefer a
  fresh custom role without `settingsService` / customer edit.
- **Cypress.** `app/cypress/e2e/customers/customer-list.cy.ts` also reads `table_customers` / `button_new_customer` (§7.4).
  Cypress is deprecated and out of scope here, but it is worth a check in the P0 FE gate.

#### TestRail section proposal

- No Maintenance section exists. `.testrail-cases.json` (4,106 cases) has no case mentioning "maintenance", and
  `e2e/scripts/testrail-push.ts` `SECTION_MAP` has no matching prefix.
- Repo convention: **map by numeric section id, not name.** SV-9304 found that names resolve to nothing, and the
  `ui/search/`, `ui/whats-new/`, `ui/work-orders/` and `ui/dashboard/` entries were all re-pinned to ids. New features with
  their own surface get their own top-level section (precedent: `'ui/accounting/': 'Accounting'`).
- Proposal: create the top-level section **"Maintenance Reminders"** with sub-sections *Schedules (Settings)*,
  *Enrolment & Compliance*, *Asset Maintenance tab*, *Completion & Reset*, *Worklist & Contact*. Add
  `'ui/maintenance-reminders/': <parent section id>` to `SECTION_MAP`. If per-sub-section filing is wanted, add per-file
  entries, because `findSection` resolves one section per path.
- Without the SECTION_MAP entry, `/e2e-after-change` Phase C.5 cannot pre-mint cases for this folder (the push skips
  unmapped folders).
- Priorities used: P4 for the two invoicing flows (P6-1, P7-1); P3 for the primary happy paths; P2 for role gates, filters,
  contact card, edge paths and the tab shell.

## 8. Rollback Plan

| Layer | How to roll back | Data left behind |
|---|---|---|
| Invoicing path, first | `MAINTENANCE_INVOICE_RESET_ENABLED=0` (no deploy, see the next row) before any code rollback | — |
| Whole feature | **No flag (D27).** Before the branch merges, nothing is on `develop`. After the release: roll back by a hotfix release that reverts the feature-branch merge commit (or the offending phase's commits) | All MR rows kept; tables unused after the revert; reading capture stops with the revert; re-merging later resumes capture, and the historical load is re-run (idempotent) |
| Frontend surfaces | Reverting the merge removes every surface at once; there is no partial FE switch | — |
| Invoice reset and reversal undo | Set `MAINTENANCE_INVOICE_RESET_ENABLED=0` and roll the API task; this disables both subscribers. Invoicing and reversal are untouched either way (NFR-005, NFR-022) | Open links stay `open`; after re-enabling, run `maintenance:invoice-reversal:replay` for the invoice ids logged as reversed in between, then `maintenance:projection:reconcile`; Mark complete still works |
| Reading capture | Revert the P3 entry-point commits; keep the table | Readings already captured stay (history); the load is idempotent and can be re-run |
| Extracted services (`ServiceWorkOrderOpener`, `CannedLineAppender`) | Revert P6 commits; the original handlers come back verbatim (characterization tests prove equivalence both ways) | None |
| Line-close fix | Revert the one-line change | `end_date` values already stamped stay correct |
| Schema | Migrations are additive (11 new tables, one INSTANT column). Never run `down()` in production; leaving unused tables is harmless. `company.maintenance_notifications` stays with its default | — |
| Projection corruption | `maintenance:projection:reconcile --organization=<uuid>` rebuilds from source tables (it is a pure function of them) | — |

## 9. Security Considerations

**Tenant scoping (NFR-001).** Every MR table carries `organization_id`; every DBAL statement binds it from
`OrganizationDecorator` (never from the request); schedules are organization-scoped with `home_workplace_id` as data
(GR-6), and canned lines of a home location are read only for that schedule (GR-7). Joined tenant-owned
tables (`company`, `work_order`, `invoice`, `vehicle_company`, `customer`, `workplace`) are scoped in the join or by a
second decorator call (`c.organization_id`, `wo.organization_id`, `inv.organization_id`); `vehicle_maker` and
`vehicle_model` are global reference data. `vehicle` is joined only on an id that already came from an org-scoped MR
row. The reviewer's Tenant Pass enumerations (code-review-checklist) apply to every PR.

**Inbound ids (NFR-015).** The inbound-id table in Section 5 is the contract. Two traps to avoid explicitly: no nullable
`#[MapEntity]` on any MR DTO (use non-nullable or a plain `?string` resolved in a validator), and every array of ids is
count-checked.

**Golden Rule Exemptions (record each in the PR description under "Golden Rule Exemptions").** Rule: tenant scoping,
workplace axis (`WorkplaceDecorator` on workplace-owned data). Organization scoping is never relaxed.

| ID | Where | PRD citation | Reason | Alternatives rejected |
|---|---|---|---|---|
| GR-1 | Worklist rows and tiles; asset tab rows from schedules of other workplaces; latest-WO join on the worklist (P5, P7) | S13-R1 "organization wide, not location specific"; S13-R28 "never narrowed by the location chosen in the header, which would hide every unit never yet serviced"; Key Decision "tracking stays organization-wide" (change log 2026-09-28) | The product promise is one list for the whole shop group | (a) Header workplace only: hides every never-serviced unit, which S13-R28 rejects. (b) The user's accessible workplaces: same hiding for units whose last visit was elsewhere, and a per-user predicate on a shared index |
| GR-2 | Mark complete work-order picker (P6) | S18-R2 "from any location in the organization" | A unit serviced at another location must be closable from here | Header-workplace WOs only: forces Completed elsewhere for the shop's own work and loses the WO link |
| GR-3 | Completion and invoice reset write to enrolments whose schedule belongs to another workplace (P6) | S18-R12 "Completion travels across the organization. A unit serviced at one location advances what another location tracks"; S16-N6 "tracking and completion stay organization-wide" | Without it the same truck is overdue at one location the day after it was serviced at another | Reset only when WO workplace = schedule workplace: contradicts S18-R12 |
| GR-4 | Tenant enumeration in `meter-readings:load-history`, `maintenance:projection:refresh`, `maintenance:projection:reconcile` (P3, P4) | database.md "Running a per-tenant loop" | Fleet sweeps need the org list; every iteration then runs inside `OrganizationDecorator::runAs()` | Per-org manual runs only (not operable for 796 orgs); `addOrganizationIdProvider()` in a loop (forbidden, `TenantScopeMechanismTest`) |
| GR-6 (✅ APPROVED 2026-10-04 by the user: the PRD states it, S1-R1) | Schedule reads and writes scoped by **organization only**: A1, A2, A4–A7, A9, A10, A11/A13 schedule lookup, A12; `MaintenanceScheduleRepository::findById()` uses `isOrganizationEntity()`; the column is renamed `home_workplace_id`, and the entity does **not** implement `WorkplaceIdentifierAware` (P1, P2) | S1-R1 "shared by the whole organization: every location sees every schedule and can enrol onto it"; S7-R1 "every active schedule of the organization, whichever location is chosen in the header"; Key Decision 2026-10-02 | Product decided one schedule list per organization. The home location is data (where the lines come from), not a scope. The schedule keeps a workplace column, so `api/.claude/reference/code-review-checklist.md` ("an org-only check on an entity that carries a workplace is a finding") applies: this is a real departure | (a) Keep schedules workplace-scoped and make shops copy them per location: Product rejected this explicitly ("a schedule tied to one location's lines would be useless at the others"). (b) Workplace-scoped list plus a "shared" flag: two concepts where the PRD has one, and the enrolment modal would still need a cross-workplace read |
| GR-7 (✅ APPROVED 2026-10-04 by the user: the PRD states it, S4-R7) | `work_order_canned_line` (+ `work_order_canned_line_part`, `labour_type` names) of the schedule's **home** workplace read while the header is another workplace: A2 resolved lines, A8 picker (S4-R7), Plan 2 A35 line summary, A36 contents, `HomeCannedLineFetcher` used by the copy append (S13-R30, S16-N6, S16-R23) (P1, P6) | S4-R7 "lists the canned lines of the schedule's home location, whichever location is chosen in the header"; S16-N6; S16-R23 "Parts used there, for reference" | The lines live at the home location. Every other location reads them to show them and to copy them. The home id always comes from an org-scoped MR row, never from the request | (a) Copy canned lines into every workplace at enrol time: duplicates price/part data across locations (the PRD forbids carrying prices/parts) and drifts on S4-E1. (b) Header-workplace canned lines only: S4-R7 says the opposite. Writes stay local: copied lines are created on the WO, which is header-scoped via `#[MapEntity]` |

Revision 3 (2026-10-05) adds **no** exemption. Gating is by permission atom only; there is no organization-level switch (D27, NFR-013).

**Tightening (not an exemption): the S4-R9 home-location edit right (TD-31).** A workplace-axis authorization on top of
the SM atom. "Access to the home location" = the user's workplace enrolment (`WorkplaceFetcher::getByUserId()`, with the
admin-without-enrolment fallback), mirroring `AccessibleWorkplaceResolver`. Enforced on A3 (the verified header), A4
(canned-line changes) and A8 (picker with `schedule_id`). `canned_line_id[]` is checked against the home workplace, never
the header.

**Permissions (no new atoms, TD-10).**

| Surface | Atom | FE bundle |
|---|---|---|
| Settings schedule reads, canned-line options | `ROLE_WORK_ORDER::VIEW` | settingsService (the Settings UI); the read atom itself is WO view |
| Settings schedule writes | `ROLE_ORGANIZATION::CREATE_AND_EDIT` | settingsService |
| Change a schedule's canned lines | `ROLE_ORGANIZATION::CREATE_AND_EDIT` **and** access to the home location (S4-R9, TD-31) | settingsService |

**Schedule read gate (decision).** Schedule reads (A1, A2, A8) stay on `ROLE_WORK_ORDER::VIEW`, because the data is non-sensitive organization configuration (names, intervals, canned-line names and hours, no prices). Enrolment does not depend on it: it reads schedules through A9, which is on `ROLE_CUSTOMER::CREATE_AND_EDIT`. The API read is therefore wider than the PRD's "Settings tabs behind Settings Service"; tightening A1/A2/A8 to `ROLE_ORGANIZATION::CREATE_AND_EDIT` is a one-line gate change if review prefers it. Settings Service gates the Settings UI (route `requiredPermissions`, nav item)
and every schedule write (A3–A7 on `ROLE_ORGANIZATION::CREATE_AND_EDIT`, which the settingsService bundle grants,
`FEPermissionMappings.php:656-666`). A technician with WO view can therefore read schedules through the API but cannot
reach Settings or change a schedule. This is intended, not a gap (TD-10, D3).
| Worklist, tiles, asset tab, candidates, compliance list and download, current readings | `ROLE_CUSTOMER::VIEW` | customersView |
| Enrol, bulk enrol, remove, reading save/undo, skip, Mark complete and undo (A29 refuses non-Mark-complete completions, S18-N8), WO picker, compliance writes, customer setting | `ROLE_CUSTOMER::CREATE_AND_EDIT` | customersCreateAndEdit |
| Create work order from a row | `ROLE_WORK_ORDER::CREATE_AND_EDIT` | workOrdersCreateAndEdit |

The enrolment preview lists schedules to a user who may lack settings atoms; it exposes names and service shapes only,
which the enrolment act needs.

**Files (NFR-018).** MIME sniffed from content (not the client header) against PDF/JPEG/PNG; size checked before
upload; object keys contain only ids; downloads stream through the authorized endpoint with
`Content-Disposition: attachment`; no public URLs.

**Logging.** `maintenance.invoice_reset_failed` and recompute failures log ids only, never contact data.

**Copied work (NFR-023).** A copy at a non-home location never carries a price, a fixed price, a part, an adjustment or
an inspection link; the home location's names, hours and parts are read only for the schedule's own lines (GR-7).

**Customer email.** Plan 1 sends nothing (and v1 sends nothing automatically, PRD 2026-10-02); the WO note is created with `customerVisible: false`, and
`CustomerNoteNotificationSender::send()` returns before sending for such notes.

## 10. Requirement Traceability

One table for both layers. **Layer** is `API` (backend half; the Files column starts with the route or surface it touches)
or `App` (frontend half; the Files column starts with the half's own layer tag, `[FE]`, `[FE+BE]` or `[BE]`, and uses the
file-group legend below). Status "Planned" means the phase table names the files; nothing is implemented yet. In App rows,
status "BE" means the backend satisfies the requirement and the frontend only renders or sends it; "→ Plan 2" means not
delivered in Plan 1. **E2E** rows (from the E2E pass, after the NFR rows) name the scenario ids of Section 7 and their spec
files; status "Backlog" is a deferred spec and "Dev" means covered by unit/functional tests, not a spec. Requirements
without an E2E row are owned by the Dev-layer line of their phase.

App file-group legend:
- **SH** = P0 shared (`QueryState`, `HoverCard`, `ResponsiveActionMenu`, `EditableTitle`, `useSortable`, base-dialog prop);
- **TABS** = `VehicleTabsBar.vue` + `VehicleInvoices.vue`;
- **CSH** = `pages/Customers.vue` + `CustomerListPanel.vue`;
- **DUE** = `maintenance/shared/{DueBadge,DueCell,ConfidenceMeter,formatDue,intervalFormat,copy}`;
- **API** = `api/maintenance/*`;
- **GATE** = `useMaintenanceAccess` (permissions only);
- **SL** = `settings/MaintenanceSchedules(.vue,Mobile,Model)` + `ArchiveScheduleDialog`;
- **SE** = `settings/MaintenanceScheduleEditor` + `scheduleDraft` + `ServiceTable`;
- **SF** = `settings/ServiceFormDialog` + `TriggerBlock` + `IntervalRow` + `ComplianceBlock` + `CoveredServicesStep` + `ReminderTimingRows` + `serviceFormRules`;
- **CP** = `settings/CannedLinePickerDialog`;
- **EN** = `enrolment/*` + `Customer.vue` button;
- **CF** = `compliance/{CertificateFields,certificateDates,CertificateAttachmentField,CertificateRecordDialog}`;
- **CS** = `compliance/ComplianceSection` + `VehicleInvoices.vue` card;
- **TG** = `CustomerMaintenanceNotificationsToggle` + `CustomerLeftSection.vue` + `api/companies`;
- **RD** = `readings/*`;
- **AT** = `asset/*`;
- **MC** = `completion/*`;
- **WOA** = `useMaintenanceWorkOrderActions`;
- **WL** = `worklist/{MaintenanceRemindersTab,WorklistTiles,worklistFilters,WorklistTable,WorklistCardMobile,worklistRowActions}`;
- **CC** = `worklist/{ContactCard,ContactButton,SetPreferredContactDialog}`.

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| S1-R1 | P1 | API | GET/POST /api/maintenance/schedules · `MaintenanceSchedule` (`home_workplace_id`), `DoctrineMaintenanceScheduleRepository` (`isOrganizationEntity()`, GR-6), `msch__org_name_unq` | Planned |
| S1-R1 | P1 | App | [FE+BE] GATE, SL (org-wide, no `subscribeToLocation`), AdminLeftMenuNav, Administration, routes | Planned |
| S1-R2 | P1 | API | GET /schedules · `DbalScheduleListFetcher` | Planned |
| S1-R2 | P1 | App | [FE+BE] SL, API | Planned |
| S1-R3 | P1 | App | [FE] SE, routes | Planned |
| S1-R4 | P1 | API | POST /schedules · `CreateScheduleCommandHandler` | Planned |
| S1-R4 | P1 | App | [FE] SE (draft only) | Planned |
| S1-R6 | P1 | API | POST /schedules, PUT /schedules/{id} · `CreateScheduleRequestDto`, `ReplaceScheduleRequestDto` | Planned |
| S1-R6 | P1 | App | [FE] SE | Planned |
| S1-R7 | P0/P1 | App | [FE] SH EditableTitle, SE | Planned |
| S1-R8 | P1 | API | PUT /schedules/{id} · `ReplaceScheduleCommandHandler` | Planned |
| S1-R8 | P1 | App | [FE] SE | Planned |
| S1-R9 | P1 | API | GET /schedules/{id} · `GetScheduleQueryHandler`, `ScheduleDetailDto` | Planned |
| S1-R9 | P0/P1 | App | [FE] DUE intervalFormat, ServiceTable | Planned |
| S1-R10 | P1 | API | PUT /schedules/{id} · `ScheduleService` position | Planned |
| S1-R10 | P0/P1 | App | [FE] SH useSortable, ServiceTable | Planned |
| S1-R12 | P1, P2 | API | GET /schedules · `DbalScheduleListFetcher` (enrolled count) | Planned |
| S1-R12 | P1 | App | [FE+BE] SL | Planned |
| S1-R13 | P1 | API | GET/PUT /schedules/{id} · `ScheduleArchivedError`, `ScheduleDetailDto.readOnly` | Planned |
| S1-R13 | P1 | App | [FE] SE, SF, CP (read-only) | Planned |
| S1-R14 | P1 | API | GET /maintenance/schedules, GET /maintenance/schedules/{id}, GET …/enrolment-context · `homeWorkplace`, `homeWorkplaceName`, `workplaceCount` (`DbalScheduleListFetcher`, `DbalEnrolmentContextFetcher`) | Planned |
| S1-R14 | P1, P2 | App | [FE+BE] SL caption, SE header, EN schedule option (FD-23) | Planned |
| S1-N1 | P1 | API | POST /schedules, PUT /schedules/{id} · `MaintenanceSchedule` | Planned |
| S1-N1 | P1 | App | [FE] SE, SL empty state | Planned |
| S1-N2 | P1 | API | all schedule routes · `MaintenanceAccessGate` | Planned |
| S1-N2 | P1 | App | [FE+BE] GATE, AdminLeftMenuNav, routes | Planned |
| S1-N3 | P1 | API | POST/PUT schedules · request DTOs (`NotBlank`) | Planned |
| S1-N3 | P0/P1 | App | [FE+BE] SH EditableTitle (`revertOnBlank`), SE | Planned |
| S1-E1 | P1 | API | (no DELETE route) | Planned |
| S1-E1 | P1 | App | [FE] SL (no delete action) | Planned |
| S1-E2 | P1 | API | POST/PUT schedules, POST …/duplicate · `MaintenanceSchedule`, `ScheduleCopyNamer`, `msch__org_name_unq` (org-wide; archived names count, inspection-template precedent), `nameTaken()` org-wide | Planned |
| S1-E2 | P1 | App | [FE+BE] SE (400 `errors[{field: 'name'}]`, `handlesValidationLocally`), A3/A4/A5 | Planned |
| S2-R1 | P1 | App | [FE] ServiceTable, SF | Planned |
| S2-R2 | P1 | API | POST/PUT schedules · `ScheduleServiceDto` (no send field) | Planned |
| S2-R2 | P1 | App | [FE] SF | Planned |
| S2-R3 | P1 | API | POST/PUT schedules · `ScheduleService` | Planned |
| S2-R3 | P1 | App | [FE] SF | Planned |
| S2-R4 | P1 | API | POST/PUT schedules · `TriggerSet`, `CalendarTrigger` | Planned |
| S2-R4 | P1 | App | [FE] TriggerBlock + SH HoverCard | Planned |
| S2-R5 | P1 | API | POST/PUT schedules · `MeterTrigger` | Planned |
| S2-R5 | P1 | App | [FE] TriggerBlock | Planned |
| S2-R6 | P1, P4 | API | POST/PUT schedules · `TriggerOperator`, `DueDateResolver`, `CycleHistory` | Planned |
| S2-R6 | P1 | App | [FE] IntervalRow | Planned |
| S2-R7 | P1 | API | POST/PUT schedules · `CalendarTrigger` | Planned |
| S2-R7 | P1 | App | [FE] IntervalRow | Planned |
| S2-R8 | P1 | API | POST/PUT schedules · `CalendarTrigger`, `CalendarUnit` | Planned |
| S2-R8 | P1 | App | [FE] IntervalRow | Planned |
| S2-R9 | P1 | API | POST/PUT schedules · `CalendarTrigger`, `MeterTrigger` | Planned |
| S2-R9 | P1 | App | [FE+BE] serviceFormRules | Planned |
| S2-R10 | P0/P1 | App | [FE] DUE copy, intervalFormat | Planned |
| S2-R11 | P4 | API | GET /vehicles/{id}/maintenance · `DueDateResolver` | Planned |
| S2-R11 | P1 | App | [FE] TriggerBlock | Planned |
| S2-R14 | P4 | API | `CalendarMath` | Planned |
| S2-R14 | P4 | App | [BE] DUE renders | BE |
| S2-R15 | P0/P1 | App | [FE] DUE copy | Planned |
| S2-R16 | P1 | API | POST/PUT schedules · `ScheduleService.coveredServiceIds`, `MaintenanceSchedule` | Planned |
| S2-R16 | P1 | App | [FE+BE] CoveredServicesStep | Planned |
| S2-R17 | P1 | API | POST/PUT schedules, GET /schedules/{id} · `CannedLineRef` | Planned |
| S2-R17 | P1 | App | [FE] CoveredServicesStep, CP | Planned |
| S2-R18 | P1 | App | [FE] SF | Planned |
| S2-R19 | P1 | API | POST/PUT schedules · `MaintenanceSchedule` | Planned |
| S2-R19 | P1 | App | [FE] CoveredServicesStep | Planned |
| S2-N1 | P1 | API | POST/PUT schedules · `TriggerSet` | Planned |
| S2-N1 | P1 | App | [FE+BE] serviceFormRules | Planned |
| S2-N2 | P1 | API | POST/PUT schedules · request DTOs (integers) | Planned |
| S2-N2 | P1 | App | [FE] serviceFormRules | Planned |
| S2-N3 | P1 | API | POST/PUT schedules · `TriggerSet` | Planned |
| S2-N3 | P1 | App | [FE] serviceFormRules | Planned |
| S2-N4 | P1 | API | POST/PUT schedules · request DTOs | Planned |
| S2-N4 | P1 | App | [FE+BE] serviceFormRules | Planned |
| S2-N5 | P1 | App | [FE] IntervalRow (digits-only Input) | Planned |
| S2-N6 | P1 | API | POST/PUT schedules · `CalendarTrigger`, `MeterTrigger` | Planned |
| S2-N6 | P1 | App | [FE] serviceFormRules | Planned |
| S2-N7 | P1 | API | POST/PUT schedules · `CalendarTrigger` | Planned |
| S2-N7 | P1 | App | [FE] serviceFormRules | Planned |
| S2-N8 | P1 | API | POST/PUT schedules · `MaintenanceSchedule` | Planned |
| S2-N8 | P1 | App | [FE+BE] CoveredServicesStep | Planned |
| S2-N9 | P1 | API | POST/PUT schedules · `MaintenanceSchedule` (cycle check) | Planned |
| S2-N9 | P1 | App | [FE+BE] serviceFormRules (cycle), ServiceTable count | Planned |
| S2-E1 | P1 | API | POST/PUT schedules · `TriggerSet` | Planned |
| S2-E1 | P1 | App | [FE] TriggerBlock | Planned |
| S2-E2 | P1 | App | [FE] TriggerBlock (one calendar row per service; two fixed points = two services) | Planned |
| S2-E3 | P4 | API | `CycleHistory` (meter At) | Planned |
| S2-E3 | P1 | App | [FE] IntervalRow | Planned |
| S2-E5 | P4 | API | `CalendarMath` | Planned |
| S2-E5 | P4 | App | [BE] — | BE |
| S2-E6 | P1 | API | no inference anywhere | Planned |
| S2-E6 | P1 | App | [FE] CoveredServicesStep | Planned |
| S3-R1 | P1 | App | [FE] SF | Planned |
| S3-R2 | P1 | API | POST/PUT schedules · `ComplianceTerm`, `ServiceKind` | Planned |
| S3-R2 | P1 | App | [FE] SF, ComplianceBlock | Planned |
| S3-R3 | P1 | API | POST/PUT schedules · `ComplianceTerm` | Planned |
| S3-R3 | P1 | App | [FE] ComplianceBlock + HoverCard | Planned |
| S3-R6 | P1 | App | [FE] ComplianceBlock | Planned |
| S3-R7 | P1 | API | POST/PUT schedules · `ComplianceTerm` | Planned |
| S3-R7 | P1 | App | [FE+BE] ComplianceBlock | Planned |
| S3-R8 | P1 | API | POST/PUT schedules · `ComplianceTerm` | Planned |
| S3-R8 | P1 | App | [FE+BE] ComplianceBlock, serviceFormRules | Planned |
| S3-R9 | P1 | App | [FE] ComplianceBlock | Planned |
| S3-R10 | P0 | App | [FE] DUE DueBadge | Planned |
| S3-N1 | P1 | API | POST/PUT schedules · `MaintenanceSchedule` | Planned |
| S3-N1 | P1 | App | [FE] SF | Planned |
| S3-N2 | P4, P7 | API | GET /vehicles/{id}/maintenance, GET /maintenance/reminders · `DueDateResolver`, `DbalWorklistFetcher` | Planned |
| S3-N2 | P0/P5/P7 | App | [FE+BE] DUE DueCell "No record", WL | Planned |
| S3-E2 | P1 | API | POST/PUT schedules · `ComplianceTerm` | Planned |
| S3-E2 | P1 | App | [FE] ComplianceBlock | Planned |
| S4-R1 | P1 | API | GET /maintenance/canned-lines `schedule_id` · `DbalCannedLineOptionFetcher` | Planned |
| S4-R1 | P1 | App | [FE+BE] CP, A8 | Planned |
| S4-R2 | P1 | API | GET /maintenance/canned-lines · `CannedLineOptionDto` | Planned |
| S4-R2 | P1 | App | [FE+BE] CP, A8 (hours) | Planned |
| S4-R3 | P1 | API | POST/PUT schedules · `CannedLineRefs` | Planned |
| S4-R3 | P1 | App | [FE] CP + useSortable | Planned |
| S4-R4 | P1 | App | [FE] SF canned step | Planned |
| S4-R5 | P1 | API | GET /schedules/{id} · `GetScheduleQueryHandler` | Planned |
| S4-R5 | P0/P1 | App | [FE] SH HoverCard, ServiceTable | Planned |
| S4-R6 | P1 | API | GET /schedules/{id} · `ScheduleDetailDto` | Planned |
| S4-R6 | P1 | App | [FE] CP, ServiceTable (no price) | Planned |
| S4-N1 | P1 | API | POST/PUT schedules · `CannedLineRefs` | Planned |
| S4-N1 | P1 | App | [FE] SF | Planned |
| S4-N2 | P1 | App | [FE] SF (no prompt) | Planned |
| S4-E1 | P1, P6 | API | GET /schedules/{id}, POST …/work-orders · `GetScheduleQueryHandler`, `AppendServiceLinesToWorkOrder` | Planned |
| S4-E1 | P1 | App | [BE] — | BE |
| S4-E2 | P1, P6 | API | GET /schedules/{id}, POST …/work-orders · same | Planned |
| S4-E2 | P1 | App | [BE] CP tolerates missing lines | BE |
| S4-E3 | P1 | App | [FE] CP | Planned |
| S4-R7 | P1 | API | GET /maintenance/canned-lines `schedule_id` · `DbalCannedLineOptionFetcher` (home workplace, GR-7) | Planned |
| S4-R7 | P1 | App | [FE+BE] CP `scheduleId`, A8 | Planned |
| S4-R8 | P1 | API | — (FE only; A2 `homeWorkplace.name`) | Planned |
| S4-R8 | P1 | App | [FE] CannedLinesStep helper | Planned |
| S4-R9 | P1 | API | GET /schedules/{id} `canEditCannedLines`; PUT /schedules/{id} 403; GET /canned-lines `schedule_id` 403 · `HomeLocationAccess`, `EnrolmentHomeLocationAccess`, `CannedLinesLockedError` (TD-31) | Planned |
| S4-R9 | P1 | App | [FE+BE] CannedLinesStep read-only + (i), scheduleDraft passthrough (FD-24) | Planned |
| S5-R1 | P1 | API | POST/PUT schedules · `ReminderOffsets` | Planned |
| S5-R1 | P1 | App | [FE] ReminderTimingRows | Planned |
| S5-R2 | P1 | API | POST/PUT schedules · `ReminderOffsets::defaultsFor()` (≤ 14 days) | Planned |
| S5-R2 | P1 | App | [FE] ReminderTimingRows, serviceFormRules (S5-R13 default) | Planned |
| S5-R3 | P1 | API | POST/PUT schedules · `ReminderOffsets` | Planned |
| S5-R3 | P1 | App | [FE] ReminderTimingRows | Planned |
| S5-R4 | P1 | API | POST/PUT schedules · `ReminderOffsets` | Planned |
| S5-R4 | P1 | App | [FE] ReminderTimingRows | Planned |
| S5-R8 | P4 | API | `DueDateResolver` (due soon) | Planned |
| S5-R8 | P4/P5/P7 | App | [BE] DUE renders `status` | BE |
| S5-R11 | P1 | API | POST/PUT schedules · `MaintenanceSchedule` | Planned |
| S5-R11 | P1 | App | [FE] SF | Planned |
| S5-R12 | P1 | API | POST/PUT schedules · `ReminderOffsets` (before < interval; months N×30, Q17 ✅ 918913025) | Planned |
| S5-R12 | P1 | App | [FE+BE] serviceFormRules (`< intervalDays`, FD-28) | Planned |
| S5-R13 | P1 | API | POST/PUT schedules · `ReminderOffsets::defaultsFor()` + 400 limit message | Planned |
| S5-R13 | P1 | App | [FE+BE] ReminderTimingRows (limit note, dropped default), serviceFormRules | Planned |
| S5-N1 | P1 | API | none (nothing sends automatically in v1) | Planned |
| S5-N1 | P1 | App | [FE] SF (no send switch) | Planned |
| S5-E1 | P1 | API | POST/PUT schedules · `ReminderOffsets` (stored, unused in v1) | Planned |
| S5-E1 | P1 | App | [BE] — | BE |
| S6-R1 | P2 | API | POST /maintenance/enrolments · `Enrolment::enrol()` | Planned |
| S6-R1, S6-R2, S6-R4 | P2 | App | [BE] — | BE |
| S6-R3 | P1 | App | [FE] SE (Save shows no notice about enrolled assets; nothing is pushed to them) | Planned |
| S6-R2 | P1, P2 | API | PUT /schedules/{id} · copy semantics (`Enrolment`) | Planned |
| S6-R4 | P2 | API | POST /maintenance/enrolments · `Enrolment::enrol()` | Planned |
| S6-R5 | P1 | API | POST /schedules/{id}/archive · `ArchiveScheduleCommandHandler` | Planned |
| S6-R5 | P1 | App | [FE] SL | Planned |
| S6-R6 | P1, P2, P4 | API | POST /schedules/{id}/archive · `ArchiveScheduleCommandHandler`, `DbalDueProjectionWriter::deleteForSchedule()` | Planned |
| S6-R6 | P1/P2 | App | [FE+BE] ArchiveScheduleDialog, invalidate all | Planned |
| S6-R7 | P2 | API | POST /maintenance/enrolments · `Enrolment::enrol()` | Planned |
| S6-R7 | P2 | App | [FE+BE] EN (archived schedules not offered) | Planned |
| S6-R8 | P1 | API | POST /schedules/{id}/restore · `RestoreScheduleCommandHandler` | Planned |
| S6-R8 | P1 | App | [FE+BE] SL | Planned |
| S6-R11 | P1 | API | PUT /schedules/{id} · `MaintenanceSchedule::replace()` | Planned |
| S6-R11 | P1 | App | [FE] SF / ServiceTable confirmations | Planned |
| S6-R12 | P1 | API | POST /schedules/{id}/duplicate · `DuplicateScheduleCommandHandler`, `ScheduleCopyNamer` | Planned |
| S6-R12 | P1 | App | [FE+BE] SL duplicate → opens editor | Planned |
| S6-E5 | P1 | API | POST /schedules/{id}/duplicate · `MaintenanceSchedule::duplicateAs()` keeps `home_workplace_id` | Planned |
| S6-E5 | P1 | App | [BE] SL duplicate (caption shows the original's home) | BE |
| S6-R13 | P2 | API | DELETE /maintenance/enrolments/{id} · `RemoveEnrolmentCommandHandler` | Planned |
| S6-R13 | P5 | App | [FE+BE] AT RemoveFromScheduleDialog | Planned |
| S6-R14 | P2, P4 | API | DELETE /maintenance/enrolments/{id} · `Enrolment::end()`, `DbalDueProjectionWriter` | Planned |
| S6-R14 | P5 | App | [FE+BE] AT, invalidation | Planned |
| S6-N1 | P2 | API | (no endpoint) | Planned |
| S6-N1, S6-N2, S6-N3 | P1 | App | [FE] SF/SE (no re-apply action) | Planned |
| S6-N2 | P2 | API | copy semantics | Planned |
| S6-N3 | P1 | API | PUT /schedules/{id} · copy semantics | Planned |
| S6-E1 | P2 | API | `ServiceCompletion` keyed by vehicle + name | Planned |
| S6-E1..E4 | P2 | App | [BE] — | BE |
| S6-E2 | P2 | API | GET /maintenance/schedules/{id}/enrolment-preview · `DbalLastServicePrefill` | Planned |
| S6-E3 | n/a | API | none (documented weak point: a new requirement is applied per unit and nothing warns) | n/a |
| S6-E4 | P2 | API | POST /schedules/{id}/archive · soft end | Planned |
| S7-R1 | P2 | API | GET …/enrolment-context, GET /maintenance/schedules/{id}/enrolment-preview, POST /maintenance/enrolments · `DbalEnrolmentContextFetcher` (org-wide, GR-6), `DbalEnrolmentPreviewFetcher` | Planned |
| S7-R1 | P2/P5 | App | [FE+BE] EN (org-wide schedule list + caption; asset + bulk entry points) | Partial (WO entry → Plan 2) |
| S7-R2 | P2 | API | POST /maintenance/enrolments · `EnrolVehicleCommand` | Planned |
| S7-R2 | P2 | App | [FE] EN | Planned |
| S7-R4 | P2 | API | GET /maintenance/schedules/{id}/enrolment-preview · `DbalLastServicePrefill`, `ServiceName` | Planned |
| S7-R4 | P2 | App | [FE+BE] EnrolmentServiceRow, A10 | Planned |
| S7-R6 | P2 | API | GET /maintenance/schedules/{id}/enrolment-preview · `DbalEnrolmentPreviewFetcher` (`complianceRecord.endDate`) | Planned |
| S7-R6 | P2 | App | [FE] EnrolmentServiceRow "ends {date}", CF | Planned |
| S7-R7 | P2 | App | [FE] EN | Planned |
| S7-R8 | P2 | App | [FE] EnrolmentServiceRow | Planned |
| S7-R9 | P2 | API | none (nothing sent; no `backlog_suppressed`, D24) | Planned |
| S7-R9 | P2 | App | [BE] — (nothing to store; nothing sends in v1) | BE |
| S7-R10 | P2 | App | [FE] EN | Planned |
| S7-R13 | P2 | API | PATCH /api/customers/{id}/maintenance-notifications · `ChangeMaintenanceNotificationsCommandHandler` | Planned |
| S7-R13 | P2 | App | [FE+BE] EN, TG mutation | Planned |
| S7-R14 | P2 | API | separate endpoints | Planned |
| S7-R14 | P2 | App | [FE] EN copy | Planned |
| S7-R15 | P4 | API | GET /maintenance/schedules/{id}/enrolment-preview · `DbalEnrolmentPreviewFetcher`, `MeterEstimator` | Planned |
| S7-R15 | P2/P4 | App | [FE+BE] EnrolmentServiceRow badge | Planned |
| S7-R17 | P2 | API | `company.maintenance_notifications DEFAULT 1` | Planned |
| S7-R17 | P2 | App | [BE] TG shows default on | BE |
| S7-R18 | P2 | API | PATCH …/maintenance-notifications, GET /api/customers/view/{id} · `Company`, `ViewQueryHandler` | Planned |
| S7-R18 | P2 | App | [FE] TG | Planned |
| S7-R19 | P2 | API | PATCH …/maintenance-notifications, GET /customers/view/{id} · `DbalMaintenanceEnrolmentCounter` | Planned |
| S7-R19 | P2 | App | [FE+BE] TG, EN | Planned |
| S7-R20 | P2, P7 | API | GET /customers/view/{id} `contacts[].email` (FE-derived), GET …/enrolment-context `hasEmail`, GET /maintenance/reminders `customerHasEmail` (any contact of the company with an email) | Planned |
| S7-R20 | P2/P7 | App | [FE+BE] TG (from A16 contacts), EN (A9 `hasEmail`), CC (A30 `customerHasEmail`), Add contact → ContactDialog (FD-29) | Planned |
| S7-R21 | P2 | API | company-level column | Planned |
| S7-R21 | P2 | App | [BE] — | BE |
| S7-R22 | P2 | API | PATCH …/maintenance-notifications · `ROLE_CUSTOMER_CREATE_AND_EDIT` | Planned |
| S7-R22 | P2 | App | [FE+BE] GATE canEditCustomerSide | Planned |
| S7-R23 | P2 | API | GET /vehicles/{id}/maintenance/enrolment-context, POST /maintenance/enrolments · `AssetOwnership::isLinked()`, `Enrolment` | Planned |
| S7-R23 | P2 | App | [FE+BE] EnrolmentCustomerSelect (A9 ≤50 + `customer_search`) | Planned |
| S7-R24 | P2 | API | GET /maintenance/schedules/{id}/bulk-enrolment-preview · `DbalBulkEnrolmentPreviewFetcher` (every linked asset) | Planned |
| S7-R24 | P2 | App | [FE+BE] EnrolmentAssetsSection (A12 server search), Customer.vue | Planned |
| S7-R25 | P2 | API | bulk preview (A12), POST /maintenance/enrolments/bulk · `DbalBulkEnrolmentPreviewFetcher`, `BulkEnrolVehiclesCommandHandler` | Planned |
| S7-R25 | P2 | App | [FE+BE] EnrolmentAssetsSection | Planned |
| S7-R26 | P2 | API | bulk preview, POST …/bulk · same | Planned |
| S7-R26 | P2 | App | [FE+BE] EnrolmentAssetsSection (`hasHistory`, `withHistoryCount`) | Planned |
| S7-N2 | P2, P4 | API | POST /maintenance/enrolments(/bulk) · `DueProjectionRecomputer` | Planned |
| S7-N2 | P2 | App | [BE] — | BE |
| S7-N4 | P2 | API | (no endpoint) | Planned |
| S7-N4 | P2 | App | [FE] (no schedule-side bulk) | Planned |
| S7-N5 | P2 | API | (no endpoint) | Planned |
| S7-N5 | P2 | App | [FE] (no bulk consent UI) | Planned |
| S7-N6 | P2 | API | GET /maintenance/schedules/{id}/enrolment-preview · `DbalEnrolmentPreviewFetcher` | Planned |
| S7-N6 | P2 | App | [FE] EN empty state | Planned |
| S7-N7 | P2 | API | POST …/bulk · `AssetOwnership::linkedVehicleIds()` | Planned |
| S7-N7 | P2 | App | [FE] EN bulk = one customer | Planned |
| S7-E1 | P2 | API | POST /maintenance/enrolments · `ServiceCompletion::atEnrolment()` | Planned |
| S7-E1 | P2 | App | [FE+BE] EnrolmentServiceRow | Planned |
| S7-E2 | P4 | API | `CycleHistory` | Planned |
| S7-E2, S7-E3, S7-E5 | P2/P4 | App | [BE] — | BE |
| S7-E3 | P2, P4 | API | POST /maintenance/enrolments · `Enrolment`, `CycleHistory` | Planned |
| S7-E4 | P2 | API | POST /maintenance/enrolments · `Enrolment` | Planned |
| S7-E4 | P5 | App | [FE] AT chips | Planned |
| S7-E5 | P2 | API | POST /maintenance/enrolments · `Enrolment::enrol()` | Planned |
| S7-E6 | P6 | API | POST /api/vehicles/delete · `VehicleUnlinkedFromCompanyEvent`, `EndEnrolmentsOnVehicleUnlinkedSubscriber` | Planned |
| S7-E6 | P6 | App | [BE] — | BE |
| S7-E7 | P2 | API | PATCH …/maintenance-notifications · own transaction | Planned |
| S7-E7 | P2 | App | [FE] EN (immediate write) | Planned |
| S7-E8 | P2 | API | GET /maintenance/schedules/{id}/enrolment-preview, POST /maintenance/enrolments · `DbalEnrolmentPreviewFetcher`, `EnrolVehicleCommandHandler` | Planned |
| S7-E8 | P2 | App | [FE+BE] EN | Planned |
| S8-R2 | P2 | API | POST/PUT compliance records · `ComplianceRecord` (`start_on`, `end_on`) | Planned |
| S8-R2 | P2 | App | [FE+BE] CF | Planned |
| S8-R3, S8-R4 | P2 | App | [FE] CF | Planned |
| S8-R4 | P2 | API | POST compliance records · nullable `certificate_number` | Planned |
| S8-R5 | P2 | API | POST /vehicles/{id}/compliance-records · `AddComplianceRecordCommandHandler` | Planned |
| S8-R5 | P2 | App | [FE] CF embedded in EN | Partial (WO entry → Plan 2) |
| S8-R6 | P2 | App | [FE] CF | Planned |
| S8-R7 | P2 | API | POST/PUT compliance records · `ComplianceRecord` | Planned |
| S8-R7 | P2 | App | [FE] CS, CertificateRecordDialog | Planned |
| S8-R8 | P2 | API | record independent of enrolment | Planned |
| S8-R8 | P2 | App | [BE] CS survives removal | BE |
| S8-R9 | P2 | API | POST/DELETE/GET …/attachment · `ComplianceRecordAttachment`, `ComplianceStoragePathBuilder` | Planned |
| S8-R9 | P2 | App | [FE+BE] CertificateAttachmentField (replaces the DVI component: DVI's is photo-only; engineering decision, D5/FD-18), A20 | Planned |
| S8-R10 | P2 | API | POST/PUT compliance records · `CertificatePeriod` (days, TD-33, month-end clamp) | Planned |
| S8-R10, S8-R11 | P2 | App | [FE+BE] CF (`certificateDates` same day number, month-end clamp, FD-26) | Planned |
| S8-R11 | P2 | API | POST/PUT compliance records · `CertificatePeriod` (days; 400 when neither date) | Planned |
| S8-R12 | P2 | API | POST/PUT compliance records · `ComplianceRecord`, `DbalCurrentCertificateFetcher` (latest `end_on`; renewal drives at once) | Planned |
| S8-R12 | P2 | App | [FE+BE] CertificateRecordDialog history | Planned |
| S8-R13 | P2 | API | GET /vehicles/{id}/compliance-records · `DbalComplianceRecordListFetcher` | Planned |
| S8-R13 | P2 | App | [FE] CS "ends D Mon YYYY" | Planned |
| S8-N1 | P2 | API | POST compliance records · same | Planned |
| S8-N1, S8-N3 | P2 | App | [FE] CS | Planned |
| S8-N2 | P4, P7 | API | GET /maintenance/reminders · `DueDateResolver`, `DbalWorklistFetcher` | Planned |
| S8-N2 | P4 | App | [BE] DUE | BE |
| S8-E1 | P2 | API | POST compliance records · `CertificatePeriod` (days; past Start allowed) | Planned |
| S8-E1, S8-E2 | P2 | App | [FE+BE] certificateDates | Planned |
| S8-E2 | P2 | API | POST/PUT compliance records · `CertificatePeriod` (days); `DueDateResolver` overdue from `end_on + 1` | Planned |
| S8-E3 | — | App | — | → Plan 2 (step after invoicing) |
| S8-E4 | P4 | API | POST/PUT compliance records · `DueProjectionRecomputer` | Planned |
| S8-E4 | P2/P4 | App | [BE] invalidation on record write | BE |
| S9-R1 | P5 | API | GET /vehicles/{id}/maintenance · `GetAssetMaintenanceQueryHandler`, `MeterEstimator` | Planned |
| S9-R1, S9-R2 | P5 | App | [FE+BE] AT ReadingCard | Planned |
| S9-R2 | P5 | API | GET /vehicles/{id}/maintenance · same | Planned |
| S9-R4 | P5 | API | GET /vehicles/{id}/maintenance · `DbalAssetMaintenanceFetcher` | Planned |
| S9-R4, S9-R5 | P5 | App | [FE] AT table, DUE | Planned |
| S9-R5 | P5 | API | GET /vehicles/{id}/maintenance · `winningTrigger` | Planned |
| S9-R6 | P5 | API | GET /vehicles/{id}/maintenance · `lastDone {date, kind}` | Planned |
| S9-R6 | P5 | App | [FE+BE] AT Last done | Planned |
| S9-R7 | P5 | API | GET /vehicles/{id}/maintenance · `DueStatus` | Planned |
| S9-R7 | P0/P5 | App | [FE] DUE DueBadge | Planned |
| S9-R8 | P4 | API | `DueDateResolver` | Planned |
| S9-R8 | P4 | App | [BE] — | BE |
| S9-R9 | P5, P6 | API | skip, completions, work-orders, candidates routes · see P5/P6 | Planned |
| S9-R9 | P5/P6/P7 | App | [FE] serviceRowActions, MC, WOA | Planned |
| S9-R10 | P4 | API | one projection row per service | Planned |
| S9-R10 | P5 | App | [BE] — | BE |
| S9-R11 | P5, P6 | API | skip, completions, work-orders routes · see P5/P6 | Planned |
| S9-R11 | P5/P6/P7 | App | [FE] serviceRowActions, MC, WOA | Planned |
| S9-R12 | P4, P5 | API | GET …/enrolled-services/{id}/candidates · `candidates` JSON, `GetCandidatesQueryHandler` | Planned |
| S9-R12 | P5 | App | [FE+BE] DUE, OtherTriggersMenu | Planned |
| S9-R13 | P5 | API | POST / DELETE …/skip · `SkipServiceCommandHandler`, `UnskipServiceCommandHandler` | Planned |
| S9-R13 | P5 | App | [FE+BE] serviceRowActions, DueBadge | Planned |
| S9-R14 | P5 | API | GET /vehicles/{id}/maintenance · `GetAssetMaintenanceQueryHandler` | Planned |
| S9-R14 | P5 | App | [FE] VehicleMaintenanceTab | Planned |
| S9-R16 | P0/P5 | App | [FE] TABS, routes | Planned |
| S9-R17 | P0 | App | [FE] ConfidenceMeter | Planned |
| S9-R18 | P5 | API | `ClearRoutineSkipsOnMeterReadingRecordedSubscriber`, `UpdateMaintenanceOnWorkOrderCreatedListener`, compliance record handlers | Planned |
| S9-R18 | P5 | App | [BE] invalidation | BE |
| S9-N1, S9-N2 | P5 | App | [FE] serviceRowActions (no such actions) | Planned |
| S9-N3 | P5 | API | GET /vehicles/{id}/maintenance · `due.needsReadings[]` | Planned |
| S9-N3 | P0/P5 | App | [FE] DueCell (`needsReadings[]`) | Planned |
| S9-E1 | P5 | API | GET /vehicles/{id}/maintenance · row per enrolled service | Planned |
| S9-E1 | P5 | App | [FE] AT chip | Planned |
| S9-E2 | P4 | API | POST /api/vehicles/{id}/meter-readings · `RecomputeOnMeterReadingRecordedSubscriber` | Planned |
| S9-E2 | P3/P5 | App | [FE+BE] RD, invalidation | Planned |
| S9-E4 | P5 | API | POST …/skip, compliance records · same | Planned |
| S9-E4 | P5 | App | [FE] serviceRowActions (+ Add record) | Planned |
| S10-R1 | P3 | App | [FE] ReadingDialog (asset only; never mounted on the WO, S16-R12) | Planned |
| S10-R2 | P3 | API | GET /api/vehicles/{id}/meter-readings/current · `CurrentReadingsQueryHandler` | Planned |
| S10-R2 | P3 | App | [FE+BE] ReadingDialog, A21 | Planned |
| S10-R4 | P3 | API | POST /api/vehicles/{id}/meter-readings · `MeterReading` | Planned |
| S10-R4 | P3 | App | [BE] — | BE |
| S10-R5 | P4 | API | POST /api/vehicles/{id}/meter-readings · `DueProjectionRecomputer` | Planned |
| S10-R5 | P3/P4 | App | [FE+BE] invalidation | Planned |
| S10-R6 | P3 | App | [FE] ReadingDialog | Planned |
| S10-R7 | P3 | API | DELETE …/meter-readings/{readingId} · `UndoReadingCommandHandler` | Planned |
| S10-R7 | P3 | App | [FE+BE] ReadingDialog undo, A23 | Planned |
| S10-R8 | P3 | API | WO entry points, POST …/meter-readings · `MeterReading::correctTo()`, `EntityEventWriter` | Planned |
| S10-R8 | P3 | App | [FE] ReadingDialog | Planned |
| S10-R9 | P3 | App | [FE] ReadingDialog, copy | Planned |
| S10-R10 | P3 | API | WO and asset entry points · `MeterReadingRecorder`, `RecordWorkOrderReadingOnMeterChangeSubscriber`, `MeterWriteSurfaceTest` | Planned |
| S10-R10, S10-R11 | P3 | App | [FE+BE] ReadingCard/ReadingDialog "In the shop" | Planned |
| S10-R11 | P3, P6 | API | `ReadingState`, `WorkOrderReadingSettler` | Planned |
| S10-N1 | P3 | API | POST …/meter-readings · `RecordReadingsRequestDto` | Planned |
| S10-N1 | P3 | App | [FE] ReadingDialog (no rejection) | Planned |
| S10-N2 | P3 | API | GET …/meter-readings/current (`plausibility`), POST …/meter-readings (`implausible`) · `ReadingPlausibility`, `RateCeiling` | Planned |
| S10-N2 | P3 | App | [FE+BE] readingPlausibility (A21 `plausibility`), ReadingWarning | Planned |
| S10-N3 | P3 | API | `lower_than_previous` | Planned |
| S10-N3 | P3 | App | [FE+BE] readingPlausibility | Planned |
| S10-N4 | P3 | App | [FE] ReadingDialog | Planned |
| S10-N5, S10-E1..E4 | P3/P4 | App | [BE] — | BE |
| S10-N6 | P3 | API | `MileageChange.previous`, `RecordWorkOrderReadingOnMeterChangeSubscriber` (TD-34) | Planned |
| S10-R12 | P3 | API | CLI `meter-readings:load-history` (4.4) | Planned |
| S10-N6, S10-R12 | P3 | App | [BE] — | BE |
| S10-E2 | P4 | API | `MeterEstimator` | Planned |
| S10-E3 | P4 | API | `DueProjectionRecomputer` | Planned |
| S10-E4 | P4 | API | `MeterEstimator` | Planned |
| S11-R1 | P4 | API | `MeterEstimate` | Planned |
| S11-R1–R8, R14, R20–R23, R26, N2–N3, E2–E6 (S11 other) | P4 | App | [BE] — | BE |
| S11-E1 | P5 | App | [FE] ReadingCard, DueCell (No data rendered as an ordinary state, no warning style) | Planned |
| S11-R2 | P4 | API | `MeterEstimator` | Planned |
| S11-R3 | P3, P4 | API | CLI `meter-readings:load-history` · `HistoricalReadingMapper`, `HistoricalReadingLoader` | Planned |
| S11-R4 | P4 | API | `MeterEstimator` | Planned |
| S11-R5 | P4 | API | `MeterEstimator` | Planned |
| S11-R6 | P4 | API | `MeterEstimator` | Planned |
| S11-R7 | P4 | API | `DueProjectionRecomputer` | Planned |
| S11-R8 | P4 | API | `Confidence` | Planned |
| S11-R9 | P5, P7 | API | GET /vehicles/{id}/maintenance, GET /maintenance/reminders · row DTOs | Planned |
| S11-R9 | P0/P5 | App | [FE] DueCell, ConfidenceMeter | Planned |
| S11-R10 | P4 | API | `MeterEstimates` | Planned |
| S11-R10 | P5 | App | [FE] ReadingCard | Planned |
| S11-R11 | P4, P5 | API | GET /vehicles/{id}/maintenance · `winningTrigger` | Planned |
| S11-R11 | P0 | App | [FE] ConfidenceMeter hover | Planned |
| S11-R12 | P5 | API | GET /vehicles/{id}/maintenance · `GetAssetMaintenanceQueryHandler` | Planned |
| S11-R12 | P4 | App | [BE] ReadingCard renders | BE |
| S11-R13 | P5, P7 | API | GET /vehicles/{id}/maintenance, GET /maintenance/reminders · row DTOs (`DueDto.precision = day` for certificates) | Planned |
| S11-R13 | P0 | App | [FE] DueCell (certificate = day precision from BE) | Planned |
| S11-R14 | P4 | API | `MeterEstimator` | Planned |
| S11-R17 | P4 | API | `ConfidenceTable` | Planned |
| S11-R17 | P5 | App | [FE] ReadingCard No data | Planned |
| S11-R18 | P5 | API | GET /vehicles/{id}/maintenance · `ratePerWeek` | Planned |
| S11-R18 | P5 | App | [FE] ReadingCard | Planned |
| S11-R19 | P4 | API | `MeterEstimator`, `RateCeiling` | Planned |
| S11-R19 | P4 | App | [BE] — | BE |
| S11-R20 | P4 | API | `MeterEstimator` | Planned |
| S11-R21 | P4 | API | reference matrix · `ConfidenceTableTest` encodes it (no email column since 2026-10-02) | Planned |
| S11-R22 | P4 | API | `ConfidenceTable` | Planned |
| S11-R23 | P4 | API | `MeterEstimator` | Planned |
| S11-R24 | P4 | API | `ConfidenceTable` | Planned |
| S11-R24 | P4 | App | [BE] ConfidenceMeter renders | BE |
| S11-R25 | P4, P5 | API | GET /vehicles/{id}/maintenance · `measuredFromVisits` | Planned |
| S11-R25 | P5 | App | [FE] ReadingCard | Planned |
| S11-R26 | P4 | API | CLI `maintenance:projection:refresh` · `MeterEstimator`, `RefreshExpiringProjectionCommand`, `DueProjectionRecomputer::refreshExpiredWindows()` | Planned |
| S11-R27 | P0 | App | [FE] ConfidenceMeter | Planned |
| S11-N1 | — | App | — | → Plan 2 (Q6, `ReminderDueLabel`: Low → "Soon") |
| S11-N2 | P4 | API | `DueDateResolver` | Planned |
| S11-N3 | P5, P7 | API | row DTOs · `isEstimate` | Planned |
| S11-E2 | P4 | API | `MeterEstimator` | Planned |
| S11-E4 | n/a | API | none (descriptive: hours sit in Low/No data more often) | n/a |
| S11-E5 | P4 | API | `ConfidenceTableTest` | Planned |
| S11-E6 | P4 | API | `MeterEstimatorTest` | Planned |
| S12-R1 | P4 | API | `DueDateResolver` | Planned |
| S12-R2 | P4 | API | `DueDateResolver` | Planned |
| S12-R3 | P4 | API | `CycleHistory` (PRD answers it, MF-15) | Planned |
| S12-R4 | P4 | API | `DueDateResolver` (due = End date) | Planned |
| S12-R5 | P4 | API | `DueDateResolver` | Planned |
| S12-R6 | P4 | API | `DueDateResolver` | Planned |
| S12-R7 | P4, P5 | API | GET …/candidates · `candidates` JSON | Planned |
| S12-R7 | P5 | App | [FE+BE] OtherTriggersMenu | Planned |
| S12-R8 | P4 | API | `DueCandidate::rank()` | Planned |
| S12-R10 | P1, P6 | API | POST/PUT schedules · `MaintenanceSchedule`, completion handlers | Planned |
| S12-R11 | P6 | API | POST …/completions, invoice · `ServiceCompletion::covered()` | Planned |
| S12-R12 | P6 | API | POST …/work-orders · `AppendServiceLinesToWorkOrder` | Planned |
| S12-R13 | P1 | API | POST/PUT schedules · `MaintenanceSchedule` | Planned |
| S12-R14 | P4 | API | all reads · `MaintenanceToday`, `WorkplaceMaintenanceToday` (no email half since 2026-10-02) | Planned |
| S12-R14 | P4 | App | [BE] (FE sends `X-Location-ID` only) | BE |
| S12-N1 | P4 | API | `DueDateResolver` | Planned |
| S12-N2 | P4, P5 | API | GET …/candidates · `candidates` JSON | Planned |
| S12-N2 | P5 | App | [FE] OtherTriggersMenu | Planned |
| S12-E1 | P4, P6 | API | `CycleHistory` | Planned |
| S12-E2 | P4 | API | `CycleHistory` | Planned |
| S12-E3 | P4 | API | `RecomputeOnMeterReadingRecordedSubscriber` | Planned |
| S12-E4 | P4 | API | row per enrolled service | Planned |
| S12-E5 | P6 | API | invoice creation · `ResetMaintenanceOnInvoiceCreatedSubscriber` | Planned |
| S12 other | P4 | App | [BE] — | BE |
| S13-R1 | P7 | API | GET /maintenance/reminders · `DbalWorklistFetcher` (GR-1) | Planned |
| S13-R1 | P0/P7 | App | [FE+BE] CSH, WL | Planned |
| S13-R2 | P7 | API | GET /maintenance/reminders/tiles · `DbalWorklistFetcher::tiles()` | Planned |
| S13-R2..R5 | P7 | App | [FE+BE] WorklistTiles, A31 | Planned |
| S13-R3 | P7 | API | — (FE only; one shared tile treatment in `WorklistTiles`) | Planned |
| S13-R5 | P7 | API | GET /maintenance/reminders · `WorklistFilter` | Planned |
| S13-R6 | P7 | API | GET /maintenance/reminders · `ReminderRowDto` | Planned |
| S13-R6, S13-R7 | P7 | App | [FE] WorklistTable | Planned |
| S13-R7 | P7 | API | GET /maintenance/reminders · `ReminderRowDto` | Planned |
| S13-R9 | P7 | API | GET /maintenance/reminders/meta · `workplaceCount`, `workplaces[]` | Planned |
| S13-R9 | P7 | App | [FE+BE] WorklistTable, A32 | Planned |
| S13-R10 | P7 | API | GET /maintenance/reminders · `WorklistSort` | Planned |
| S13-R10, S13-R11 | P7 | App | [FE+BE] WorklistTable, useTableQuery | Planned |
| S13-R11 | P7 | API | GET /maintenance/reminders · `DbalWorklistFetcher` | Planned |
| S13-R12 | P7 | API | GET /maintenance/reminders(/tiles) · `WorklistFilter` | Planned |
| S13-R12 | P7 | App | [FE] worklistFilters | Planned |
| S13-R13 | P7 | API | GET /maintenance/reminders · `DueStatus` | Planned |
| S13-R13 | P7 | App | [FE] DueBadge | Planned |
| S13-R14 | P7 | API | GET /maintenance/reminders · `DbalWorklistWorkOrderFetcher` | Partial (Mark-complete link → Plan 2 TD-110) |
| S13-R14 | P7 | App | [FE+BE] WorklistTable, worklistRowActions | Partial (Mark-complete link → Plan 2 TD-110) |
| S13-R16 | P7 | API | row actions (P5/P6 routes) | Planned |
| S13-R16 | P7 | App | [FE] worklistRowActions | Planned |
| S13-R17 | P6 | API | POST …/work-orders · same | Planned |
| S13-R17 | P7 | App | [FE] WOA | Planned |
| S13-R18 | P7 | API | GET /maintenance/reminders · `showScheduleChip` | Planned |
| S13-R18 | P7 | App | [FE] WorklistTable chip | Planned |
| S13-R20 | P7 | API | GET /maintenance/reminders · predicate builder | Planned |
| S13-R20, S13-R22 | P7 | App | [BE] WorklistTiles renders | BE |
| S13-R22 | P4, P7 | API | GET /maintenance/reminders · `needs_reading` | Planned |
| S13-R23 | P0 | App | [FE] DueBadge | Planned |
| S13-R25 | P7 | API | GET /maintenance/reminders · raw WO status, which has no hold value | Planned |
| S13-R25 | P7 | App | [FE] WorklistTable status badge (app labels; never "On Hold"; `utils/workOrderStatus.ts` untouched) | Planned |
| S13-R26 | P6 | API | invoice creation · `ResetMaintenanceOnInvoiceCreatedSubscriber` | Planned |
| S13-R26 | P7 | App | [FE+BE] worklistRowActions, WOA openInvoicing | Partial (step after invoicing → Plan 2) |
| S13-R27 | P4, P7 | API | GET /maintenance/reminders · `DbalLastVisitLocator`, `last_visit_workplace_id` (imported visits count) | Planned |
| S13-R27 | P7 | App | [BE] WorklistTable renders | BE |
| S13-R28 | P7 | API | GET /maintenance/reminders(/tiles) · `WorklistFilter`, `mdp__org_location_due_idx` | Planned |
| S13-R28 | P7 | App | [FE] WL (no subscribeToLocation), worklistFilters | Planned |
| S13-R29 | P7 | API | GET /maintenance/reminders/tiles · shared predicate builder | Planned |
| S13-R29 | P7 | App | [FE+BE] WL tiles params | Planned |
| S13-R30 | P6 | API | POST …/enrolled-services/{id}/work-orders · `CreateWorkOrderForEnrolledServiceCommandHandler`, `ServiceWorkOrderOpener`, `AppendServiceLinesToWorkOrder` copy mode, `CannedLineAppender::appendCopy` | Planned |
| S13-R30 | P7 | App | [FE+BE] WOA, A33 (`copiedWork`) | Planned |
| S13-R32 | P0 | App | [FE] CSH | Planned |
| S13-R33 | P7 | API | GET /maintenance/reminders/tiles · `hasEnrolments` | Planned |
| S13-R33 | P7 | App | [FE] WL empty states | Planned |
| S13-R34 | P7 | API | GET /maintenance/reminders · `ReminderRowDto` | Planned |
| S13-R34 | P0/P7 | App | [FE] DueCell | Planned |
| S13-R35 | P7 | App | [FE] WorklistTable | Planned |
| S13-R36 | P7 | API | GET /maintenance/reminders · `WorklistFilter`, predicate builder | Planned |
| S13-R36 | P7 | App | [BE] — | BE |
| S13-R37 | P7 | API | GET /maintenance/reminders(/tiles) · `DbalWorklistFetcher` | Planned |
| S13-R37 | P7 | App | [FE+BE] WL (pageSize 50, sort, search) | Planned |
| S13-R38 | P6 | API | POST …/work-orders · same | Planned |
| S13-R38 | P7 | App | [FE+BE] WOA | Planned |
| S13-R39 | P7 | App | [FE] WorklistCardMobile, WorklistTiles, SH menu | Planned |
| S13-R40 | P7 | API | GET /maintenance/reminders(/tiles) · `WorklistFilter` | Planned |
| S13-R40 | P7 | App | [FE] worklistFilters | Planned |
| S13-R41 | P7 | API | GET /maintenance/reminders · A30 contact + `companyTelephone` (FE rule) | Planned |
| S13-R41 | P7 | App | [FE] ContactButton (contact + `companyTelephone`) | Planned |
| S13-R42 | P7 | App | [FE] WL prefs + URL sync, CSH search | Planned |
| S13-N1 | P7 | App | [FE] (no badge) | Planned |
| S13-N2 | P7 | API | GET /maintenance/reminders(/tiles) · predicate builder | Planned |
| S13-N2, S13-N3 | P7 | App | [BE] DueCell | BE |
| S13-N3 | P7 | API | GET /maintenance/reminders · one row per enrolled service | Planned |
| S13-E1 | P7 | API | GET /maintenance/reminders · row per enrolled service | Planned |
| S13-E1, S13-E3 | P7 | App | [FE] WL | Planned |
| S13-E3 | P7 | API | GET /maintenance/reminders · `ReminderRowDto` | Planned |
| S13-E5 | P6, P7 | API | GET /maintenance/reminders · INNER JOINs, lifecycle subscribers (hard delete as today, Q7b ✅ Option A 918913025) | Planned |
| S13-E5 | P7 | App | [BE] — | BE |
| S13-R43 | P7 | API | GET /maintenance/reminders, …/tiles · `WorklistPredicates` rest (TD-36) | Planned |
| S13-R43 | P7 | App | [BE] WL renders (rows leave through invalidation) | BE |
| S14-R1 | P7 | API | GET /maintenance/reminders · `ReminderContactDto` | Planned |
| S14-R1..R3 | P7 | App | [FE+BE] CC | Planned |
| S14-R2 | P7 | API | GET /maintenance/reminders · `ReminderContactDto` | Planned |
| S14-R3 | P7 | API | — (FE only; `tel:` links in `ContactCard` from the `contact` phone fields) | Planned |
| S14-R4..R6, S14-R9, S14-R12, S14-R13, S14-N1, S14-E2 | — | App | CC `#actions` slot | → Plan 2 |
| S14-R8 | P7 | API | GET /maintenance/reminders · `ReminderContactDto` | Planned |
| S14-R8 | P7 | App | [FE] CC | Planned |
| S14-R10 | — | App | — | → Plan 2 (Send hidden) |
| S14-N2 | P7 | API | GET /maintenance/reminders · `ReminderContactDto`, `customerHasEmail` | Planned |
| S14-N2, S14-N4, S14-E1 | P7 | App | [FE+BE] CC (A30 `customerHasEmail`; send → Plan 2), SetPreferredContactDialog | Planned |
| S14-N4 | P7 | API | GET /maintenance/reminders; existing POST /api/vehicles/change-contact · `ReminderContactDto` | Planned |
| S14-N5 | P7 | API | GET /maintenance/reminders · no setting predicate | Planned |
| S14-N5 | P7 | App | [BE] — | BE |
| S14-E3 | — | App | — | → Plan 2 |
| S16-R19 | P6 | API | POST …/work-orders · `CannedLineAppender`, `AppendServiceLinesToWorkOrder` | Planned |
| S16-R19, S16-R20, S16-N4, S16-N6, S16-N7 | P6/P7 | App | [BE] WOA reads `linesAdded` | BE |
| S16-R20 | P6 | API | POST …/work-orders · `WorkOrderServiceLink`, `maintenance_work_order_service_line` | Planned |
| S16-N4 | P6 | API | no FK to `work_order_line` | Planned |
| S16-N6 | P6 | API | POST …/work-orders · `AppendServiceLinesToWorkOrder` copy mode, `CannedLineAppender::appendCopy`, `HomeCannedLineFetcher` (GR-7) | Planned |
| S16-R22 | P6 | API | POST …/work-orders · `CannedLineAppender::appendCopy` (labour type by name, else default; rate pricing; no labour type at home → none, PQ-29 ✅) | Planned |
| S16-R23 | P6 | API | POST …/work-orders · `CopiedLineNote`, internal line note | Planned |
| S16-R22, S16-R23, S16-N9 | P6/P7 | App | [BE] WOA reads `copiedWork`; line notes render in the existing line-note UI | BE |
| S16-N9 | P6 | API | by construction (home = WO workplace in a one-workplace org) | Planned |
| S16-N7 | P6 | API | POST …/work-orders · `AppendServiceLinesToWorkOrder` | Planned |
| S17-R2 | P6 | API | POST …/work-orders · `AppendServiceLinesToWorkOrder` (home or copy mode) | Planned |
| S17-R2, S17-R5..R8 | P6/P7 | App | [BE] — | BE |
| S17-R5 | P6 | API | POST …/work-orders · `AppendServiceLinesToWorkOrder` (`Note::create`, "{service} added from {schedule}", never mentions copying) | Planned |
| S17-R6 | P6 | API | POST …/work-orders · `EntityEventWriter` | Planned |
| S17-R7 | P6, P7 | API | POST …/work-orders · `CreatedWorkOrderDto` | Planned |
| S17-R8 | P6 | API | POST …/work-orders · `AppendServiceLinesToWorkOrder` | Planned |
| S18-R1 | P6 | API | POST …/enrolled-services/{id}/completions · `MarkServiceCompleteCommandHandler` | Planned |
| S18-R1 | P6 | App | [FE] MC, HoverCard (i) | Planned (WO card entry → Plan 2) |
| S18-R2 | P6 | API | GET …/completion-work-orders (A27) · `DbalCompletionWorkOrderFetcher` (GR-2) | Planned |
| S18-R2 | P6 | App | [FE+BE] OrgWorkOrderPicker (A27 `completion-work-orders`) | Planned |
| S18-R3 | P6 | API | GET …/completion-work-orders (A27), POST …/completions · `ResetDateProposal`, `ServiceCompletion` | Planned |
| S18-R3 | P6 | App | [FE+BE] ResetDateField, resetDateDefaults | Planned |
| S18-R4 | P6 | API | POST …/completions · `MeterReadingRecorder::recordElsewhere()` | Planned |
| S18-R4 | P6 | App | [FE+BE] MC | Planned |
| S18-R5 | P6 | API | POST …/completions · `ComplianceRecord`, `CertificatePeriod` (A28 Start/End; Start defaults to `reset_on`) | Planned |
| S18-R5 | P6 | App | [FE+BE] MC + CF (`defaultStartDate` = Reset date) | Planned |
| S18-R6 | P6 | API | POST …/completions · `MarkServiceCompleteCommandHandler` | Planned |
| S18-R6 | P6/P7 | App | [FE+BE] MC, worklistRowActions | Planned |
| S18-R7 | P6 | API | POST …/completions, invoice · `ServiceCompletion::covered()` | Planned |
| S18-R7, S18-R10..R12, S18-R18 | P4/P6 | App | [BE] — | BE |
| S18-R9 (stamp) | P6 | API | POST /api/work-orders/change-line-required-data · `UpdateLineData/ChangeCommandHandler` | Planned |
| S18-R9 (visible on the work order) | — | App | — (no WO line UI renders `end_date`) | → Plan 2 |
| S18-R10 | P6 | API | `ResetDateProposal`, `LineCompletionStampsEndDateTest` | Planned |
| S18-R11 | P6 | API | POST …/completions · `ServiceCompletion` | Planned |
| S18-R12 | P6 | API | POST …/completions, invoice · org scope (GR-3) | Planned |
| S18-R13 (auto) | P6 | API | invoice creation · `ResetMaintenanceOnInvoiceCreatedSubscriber`, `ResetDateProposal` | Planned |
| S18-R13 | P6 | App | [BE] (automatic acceptance) | Partial (editable step → Plan 2) |
| S18-R17 | P6 | API | DELETE /maintenance/completions/{id} · `UndoCompletionCommandHandler` | Planned |
| S18-R17 (worklist row leaves), S18-E8 (nothing due in between) | P7 | API | GET /maintenance/reminders, …/tiles · `WorklistPredicates` rest predicate TD-36 (every completion, `enrolment` included; Needs readings rows never hidden, S13-R36; Q18 ✅ 918913025) | Planned |
| S18-R17 | P6 | App | [FE+BE] MC toast/Undo, AT Completed row | Planned |
| S18-R18 | P6 | API | invoice creation · `ResetMaintenanceOnInvoiceCreatedSubscriber` | Planned |
| S18-E2 (reversal half) | P6 | API | POST /api/invoices/reverse-invoice, POST /api/invoices/remove-customer-transaction · `InvoiceReversalReverter` (superseded check), `ResetMaintenanceOnInvoiceCreatedSubscriber` (re-proposal) | Planned |
| S18-E2 (credit-memo half) | P6 | API | POST /api/credit-memos · no subscriber; `InvoiceReversalTest` credit-memo case | Planned |
| S18-E3 | — | API / App | Voided pending invoice treated as a reversal: Plan 2 Q3 (its S18-E3 row, NFR-117, TD-104) | → Plan 2 |
| S18-R19 | P6 | API | POST …/completions · `WorkOrderReadingSettler` in Mark complete (TD-35) | Planned |
| S18-R19 | P6 | App | [FE+BE] MC (asset-scope invalidation refreshes RD/AT reading cards) | Planned |
| S18-N8 (A29 half) | P6 | API | DELETE /maintenance/completions/{id} · `CompletionNotUndoableError`; A24 `completed` only for Mark complete | Planned |
| S18-N2, S18-N3, S18-N4, S18-E1, S18-E7, S18-E8 (invoicing half), S17-N2, S17-E3 | P6 | API | Satisfied by construction in P6, no extra code (see the note under S18 in Section 1): `ResetMaintenanceOnInvoiceCreatedSubscriber`, `ResetDateProposal`, `WorkOrderServiceLink` states, `MarkServiceCompleteCommandHandler` | Planned |
| S21-R1 | P1–P7 | API | all writes · `EntityEventWriter`, `DbalEntityEventWriter` | Planned |
| S21-R1, R3, R4, R6, R7, N1, N2, E2 | all | App | [BE] — | BE |
| S21-R2 | P6 | API | POST …/work-orders · `AppendServiceLinesToWorkOrder` (note + audit) | Planned |
| S21-R2 | P7 | App | [BE] — | BE |
| S21-R3 | P6 | API | POST …/completions, invoice · `ServiceCompletion` | Planned |
| S21-R4 | P3 | API | WO entry points · `MeterReadingRecorder` | Planned |
| S21-R5 | — | App | — | → Plan 2 |
| S21-R6 | P0–P7 | API | NFR-002, MR rows never hard deleted (soft ends); assets hard-deleted as today, Q7b ✅ Option A 918913025; no history screen in v1 | Planned |
| S21-R7 | P2 | API | PATCH …/maintenance-notifications · `ChangeMaintenanceNotificationsCommandHandler` | Planned |
| S21-N1 | P6 | API | `WorkOrderServiceLink` states | Planned |
| S21-N2 | P2 | API | soft end | Planned |
| S21-E1 | P6 | API | link table + note | Planned |
| S21-E2 | P4 | API | `last_reading_id` | Planned |
| S21-N3 | P0–P7 | API | `entity_event`, no screen, no read endpoint | Planned |
| S21-N3 | — | App | — | Nothing to build |
| S22-R1 | P6 | API | POST …/work-orders · `WorkOrderServiceLink.createdVia`; origin derived from the link table (`path IN ('lines','no_lines')`, `wo_panel` counts; Add Service links count in Plan 2; TD-16 superseded, Plan 2 TD-112) | Planned |
| S22-R1 | P7 | App | [FE+BE] WOA sends A33 `created_via` (`worklist` / `asset`) | Planned (stored, not shown) |
| NFR-001 | P0–P7 | API | all · decorators in every Dbal*/Doctrine* adapter; schedules org-scoped with `home_workplace_id` as data (GR-6) | Planned |
| NFR-002 | P1–P6 | API | migrations P1–P6 | Planned |
| NFR-003 | P4 | API | `DueProjectionRecomputer` | Planned |
| NFR-004 | P4, P5, P7 | API | reads · `DueStatus`, `ConfidenceTable`, `MaintenanceToday` | Planned |
| NFR-005 | P6 | API | invoice creation · `ResetMaintenanceOnInvoiceCreatedSubscriber` | Planned |
| NFR-006 | P3 | API | entry points · `MeterReadingRecorder`, `MeterWriteSurfaceTest` | Planned |
| NFR-007 | P3 | API | capture for every organization (D27), load CLI | Planned |
| NFR-008 | P7 | API | GET /maintenance/reminders(/tiles) · `DbalWorklistFetcher`, `DbalWorklistContactFetcher` | Planned |
| NFR-009 | P2, P4 | API | POST …/bulk · `BulkEnrolVehiclesCommandHandler`, `DbalBulkEnrolmentWriter` | Planned |
| NFR-010 | P0 | API | `DbalEntityEventWriter` | Planned |
| NFR-011 | P3 | API | CLI · `HistoricalReadingLoader` | Planned |
| NFR-012 | P1–P6 | API | migrations, mappings, `ExpressionIndexFilteringMySQLSchemaManager` | Planned |
| NFR-013 | P0–P7 | API | all MR routes · `MaintenanceAccessGate`, `MeterReadingAccessGate` (atom only, no org switch, D27) | Planned |
| NFR-014 | P4 | API | CLI · `RefreshExpiringProjectionCommand` → `DueProjectionRecomputer::refreshExpiredWindows()`, `ReconcileProjectionCommand`, Terraform schedule | Planned |
| NFR-015 | P1–P7 | API | all with ids · request DTO validators | Planned |
| NFR-016 | P1, P2, P5–P7 | API | GR-1..GR-3, GR-6, GR-7 routes · see Section 9 | Planned |
| NFR-017 | P4, P7 | API | `WorklistFilter`, `CalendarMath` | Planned |
| NFR-018 | P2 | API | attachment routes · `ComplianceAttachmentMimeTypes`, `ComplianceStoragePathBuilder` | Planned |
| NFR-019 | P6 | API | characterization tests | Planned |
| NFR-020 | P6 | API | POST …/work-orders · `CreateWorkOrderForEnrolledServiceCommandHandler` | Planned |
| NFR-021 | P4, P5 | API | `RecomputeOnMeterReadingRecordedSubscriber`, `UpdateMaintenanceOnWorkOrderCreatedListener` | Planned |
| NFR-022 | P6 | API | POST /api/invoices/reverse-invoice, POST /api/invoices/remove-customer-transaction · `RevertMaintenanceOnInvoiceReversedSubscriber`, `InvoiceReversalReverter`, `WorkOrderReadingSettler::settle()` (TD-35), `mcomp__invoice_id_idx` | Planned |
| NFR-023 | P6 | API | POST …/work-orders · `CannedLineAppender::appendCopy` (no price, fixed price, part, adjustment or inspection link), `CopiedLineNote` | Planned |
| NFR-024 | P1 | API | POST/PUT /schedules, GET /canned-lines · `HomeLocationAccess`, `CannedLinesLockedError`, `DbalCannedLineOwnership` (home id never from the request on A4/A5) | Planned |
| NFR-F01 | P0–P7 | App | [FE] GATE, CSH, TABS, Customer.vue, CustomerLeftSection, AdminLeftMenuNav (additive, ids kept) | Planned |
| NFR-F02 | P0 | App | [FE] SH base dialogs + regression specs | Planned |
| NFR-F03 | P1, P5, P7 | App | [FE] QueryState, WorklistTiles, SL counts | Planned |
| NFR-F04 | P0–P7 | App | [FE] DUE, AT, WL | Planned |
| NFR-F05 | P0–P7 | App | [FE] API invalidation.ts | Planned |
| NFR-F06 | P1–P7 | App | [FE] all | Planned |
| NFR-F07 | P0–P7 | App | [FE] §6 | Planned |
| NFR-F08 | P0 | App | [FE] HoverCard | Planned |
| NFR-F09 | P0–P7 | App | [FE] copy.ts | Planned |
| NFR-F10 | P0–P7 | App | [FE] SH, AT, WL, SL | Planned |
| NFR-F11 | P0–P7 | App | [FE] async mounts behind permission/data | Planned |
| NFR-F12 | P5, P7 | App | [FE] AT `VehicleMaintenanceTab` root, WL `WorklistTiles`, `WorklistTable` (`:data-loading="isFetching"`, D22) | Planned |
| NFR-F13 | P0, P2, P5 | App | [FE] `app/src/testing/handlers.ts`, existing specs | Planned |
| S13-R1 | P0, P7 | E2E | P0-1, P7-1 · `e2e/tests/ui/maintenance-reminders/customers-maintenance-tab-shell.spec.ts`; `e2e/tests/ui/maintenance-reminders/worklist-create-wo-to-invoice.spec.ts` | Planned |
| S13-R32 | P0, P7 | E2E | P0-1, P7-2 · `e2e/tests/ui/maintenance-reminders/customers-maintenance-tab-shell.spec.ts`; `e2e/tests/ui/maintenance-reminders/worklist-filters-persist.spec.ts` | Planned |
| NFR-F01 | P0 | E2E | P0-1 · `e2e/tests/ui/maintenance-reminders/customers-maintenance-tab-shell.spec.ts` | Planned |
| S1-R1 | P1 | E2E | P1-1 · `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts` | Planned |
| S1-R14, S4-R7 | P1 | E2E | P1-1 · `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts` | Planned |
| S6-E5 | P1 | E2E | P1-3 · `e2e/tests/ui/maintenance-reminders/schedule-lifecycle.spec.ts` | Planned |
| S4-R9, S4-R8, S1-R14 (non-home user) | P1 | E2E | Backlog · `e2e/tests/ui/maintenance-reminders/schedule-home-location-readonly.spec.ts` | Backlog |
| S1-R3, S1-R4, S1-R6, S1-R8, S1-R9 | P1 | E2E | P1-1 · `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts` | Planned |
| S1-R12 | P1, P2 | E2E | P1-1, P2-1 · `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts`; `e2e/tests/ui/maintenance-reminders/bulk-enrolment.spec.ts` | Planned |
| S2-R1, S2-R2, S2-R4, S2-R5, S2-R6, S2-R11 | P1 | E2E | P1-1 · `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts` | Planned |
| S3-R1, S3-R2, S3-R3, S3-R7, S3-R8 | P1 | E2E | P1-1 · `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts` | Planned |
| S4-R1, S4-R2, S4-R3, S4-R6 | P1 | E2E | P1-1 · `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts` | Planned |
| S5-R1, S5-R2 | P1 | E2E | P1-1 · `e2e/tests/ui/maintenance-reminders/schedule-create.spec.ts` | Planned |
| S2-R16, S2-R17, S2-R18, S2-R19 | P1 | E2E | P1-2 · `e2e/tests/ui/maintenance-reminders/schedule-edit-covering.spec.ts` | Planned |
| S1-R10, S4-R5, S6-R3, S6-R11 | P1 | E2E | P1-2 · `e2e/tests/ui/maintenance-reminders/schedule-edit-covering.spec.ts` | Planned |
| S6-R12, S6-R5, S6-R8, S1-R2, S1-R13, S1-E1 | P1 | E2E | P1-3 · `e2e/tests/ui/maintenance-reminders/schedule-lifecycle.spec.ts` | Planned |
| S6-R6 | P1, P2 | E2E | P1-3, P2-5 · `e2e/tests/ui/maintenance-reminders/schedule-lifecycle.spec.ts`; `e2e/tests/ui/maintenance-reminders/schedule-archive-unenrols.spec.ts` | Planned |
| S1-N2 | P1 | E2E | P1-4 · `e2e/tests/ui/maintenance-reminders/schedule-settings-role-gate.spec.ts` | Planned |
| S7-R24, S7-R25, S7-R26, S7-N7, S7-R10, S7-R13 | P2 | E2E | P2-1 · `e2e/tests/ui/maintenance-reminders/bulk-enrolment.spec.ts` | Planned |
| S6-R1, S6-R4 | P2, P5 | E2E | P2-1, P5-1 · `e2e/tests/ui/maintenance-reminders/bulk-enrolment.spec.ts`; `e2e/tests/ui/maintenance-reminders/asset-tab-enrol.spec.ts` | Planned |
| S8-R13, S8-R2, S8-R3, S8-R4, S8-R10, S8-R11, S8-E2, S8-R7, S8-R12, S8-N1, S8-N3 | P2 | E2E | P2-2 · `e2e/tests/ui/maintenance-reminders/compliance-record.spec.ts` | Planned |
| S7-R17, S7-R18, S7-R19, S7-R21, S7-R22 | P2 | E2E | P2-3 · `e2e/tests/ui/maintenance-reminders/customer-maintenance-notifications.spec.ts` | Planned |
| S8-R9, NFR-018 | P2 | E2E | P2-4 · `e2e/tests/ui/maintenance-reminders/certificate-attachment.spec.ts` | Planned |
| S6-R7, S6-E4 | P2 | E2E | P2-5 · `e2e/tests/ui/maintenance-reminders/schedule-archive-unenrols.spec.ts` | Planned |
| S7-R22 (role) | P2 | E2E | Backlog · `e2e/tests/ui/maintenance-reminders/enrolment-role-gate.spec.ts` | Backlog |
| S10-*, S11-R3 (capture) | P3 | E2E | Dev (be-functional) | Dev |
| S11-*, S12-* (engine) | P4 | E2E | Dev (be-unit) | Dev |
| S9-R16, S9-R14, S9-R4, S9-R5, S9-R6, S9-R7, S9-N3 | P5 | E2E | P5-1 · `e2e/tests/ui/maintenance-reminders/asset-tab-enrol.spec.ts` | Planned |
| S7-R1, S7-R2, S7-R4, S7-R6, S7-R7, S7-R8, S7-N2 | P5 | E2E | P5-1 · `e2e/tests/ui/maintenance-reminders/asset-tab-enrol.spec.ts` | Planned |
| S10-R1, S10-R2, S10-R4, S10-R6, S10-R7, S10-R9, S10-N1, S10-N2, S10-N3 | P5 | E2E | P5-2 · `e2e/tests/ui/maintenance-reminders/asset-reading-dialog.spec.ts` | Planned |
| S9-R1, S9-R2, S9-E2 | P5 | E2E | P5-2 · `e2e/tests/ui/maintenance-reminders/asset-reading-dialog.spec.ts` | Planned |
| S9-R13 | P5, P7 | E2E | P5-3, P7-4 · `e2e/tests/ui/maintenance-reminders/asset-skip-service.spec.ts`; `e2e/tests/ui/maintenance-reminders/worklist-skip-mark-complete.spec.ts` | Planned |
| S9-R18, S9-E4 | P5 | E2E | P5-3 · `e2e/tests/ui/maintenance-reminders/asset-skip-service.spec.ts` | Planned |
| S6-R13, S6-R14, S8-R8, S6-E1 | P5 | E2E | P5-4 · `e2e/tests/ui/maintenance-reminders/asset-remove-from-schedule.spec.ts` | Planned |
| S6-R13 (role read-only) | P5 | E2E | Backlog · `e2e/tests/ui/maintenance-reminders/asset-tab-role-gate.spec.ts` | Backlog |
| S18-R13 (auto), S18-R9, S18-R10, S12-E5, S10-R11, NFR-005 | P6 | E2E | P6-1 · `e2e/tests/ui/maintenance-reminders/invoice-resets-service.spec.ts` | Planned |
| S18-R1, S18-R2, S18-R3, S18-R17, S9-R9 | P6 | E2E | P6-2 · `e2e/tests/ui/maintenance-reminders/mark-complete-on-work-order.spec.ts` | Planned |
| S18-R6 | P6 | E2E | P6-1, P6-2 · `e2e/tests/ui/maintenance-reminders/invoice-resets-service.spec.ts`; `e2e/tests/ui/maintenance-reminders/mark-complete-on-work-order.spec.ts` | Planned |
| S18-R5, S8-R5, S8-E4, S9-R11 | P6 | E2E | P6-3 · `e2e/tests/ui/maintenance-reminders/mark-complete-compliance.spec.ts` | Planned |
| S18-R4, S21-R3 | P6 | E2E | P6-4 · `e2e/tests/ui/maintenance-reminders/mark-complete-elsewhere.spec.ts` | Planned |
| S18-R11 | P6 | E2E | P6-2, P6-4 · `e2e/tests/ui/maintenance-reminders/mark-complete-on-work-order.spec.ts`; `e2e/tests/ui/maintenance-reminders/mark-complete-elsewhere.spec.ts` | Planned |
| S18-R12 (cross-location picker) | P6 | E2E | Backlog · `e2e/tests/ui/maintenance-reminders/mark-complete-cross-location.spec.ts` | Backlog |
| S13-R6, S13-R7, S13-R13, S13-R14, S13-R16, S13-R17, S13-R25, S13-R26, S13-R30, S13-R38 | P7 | E2E | P7-1 · `e2e/tests/ui/maintenance-reminders/worklist-create-wo-to-invoice.spec.ts` | Planned |
| S17-R2, S17-R7, S16-R19, S22-R1 | P7 | E2E | P7-1 · `e2e/tests/ui/maintenance-reminders/worklist-create-wo-to-invoice.spec.ts` | Planned |
| S13-R2, S13-R4, S13-R5, S13-R40, S13-R37, S13-R42 | P7 | E2E | P7-2 · `e2e/tests/ui/maintenance-reminders/worklist-filters-persist.spec.ts` | Planned |
| S14-R1, S14-R2, S14-R8, S14-N4, S14-E1, S13-R41 | P7 | E2E | P7-3 · `e2e/tests/ui/maintenance-reminders/worklist-contact-card.spec.ts` | Planned |
| S13-N3 | P7 | E2E | P7-4 · `e2e/tests/ui/maintenance-reminders/worklist-skip-mark-complete.spec.ts` | Planned |
| S18-R17 (worklist half), S18-E8 | P7 | E2E | P7-4 · `e2e/tests/ui/maintenance-reminders/worklist-skip-mark-complete.spec.ts` (return at due soon, invoice/covered rest too, Needs readings never hidden: Dev, `WorklistEndpointsTest.php`) | Planned |
| S18-R19 | P6 | E2E | P6-2 (step 4) · `e2e/tests/ui/maintenance-reminders/mark-complete-on-work-order.spec.ts` | Planned |
| S13-R43 | P7 | E2E | P7-1 (step 6), P7-4 · `e2e/tests/ui/maintenance-reminders/worklist-create-wo-to-invoice.spec.ts`; `e2e/tests/ui/maintenance-reminders/worklist-skip-mark-complete.spec.ts` | Planned |
| S13-R27, S13-R28 | P7 | E2E | Backlog · `e2e/tests/ui/maintenance-reminders/worklist-org-wide.spec.ts` | Backlog |
| S13-R30 (copy), S16-N6, S16-R22, S16-R23 | P7 | E2E | Backlog · `e2e/tests/ui/maintenance-reminders/worklist-create-wo-copied-work.spec.ts` | Backlog |
| S21-R1/R2/R4/R6/R7, S21-E2 (audit) | P1–P7 | E2E | Dev (be-functional; no screen, Q3) | Dev |
| NFR-F02..F11, NFR-001..024 | P0–P7 | E2E | Dev / manual (perf: NFR-008, NFR-009) | Dev |
| Deferred list in Section 1: S7-R1 and S8-R5 work-order entry points; S8-E3; S11-N1; S12-R9; S14-R4, R5, R6, R9, R10, R12, R13, N1, E2, E3; S16-R1 to R18, R21, R24, R25, N1, N2, N3, N5, N8, E1, E2, E3 (split half; the merge half is in P6); S17-R1, N1, E1, E2; S18-R8, R9 (display on the work order), R13 (the visible step), R14, R15, R16, R20, R21, N1, N5, N6, N7, N8 (split: the A29 half is in P6), E4 to E6, E3 (the voided pending invoice, Plan 2 Q3), and the step-related refinements of E2 (its reversal half and its credit-memo no-op are in P6, NFR-022); S19 (the hand-sent email; the automatic rules are deferred to v2 by the PRD); S21-R5; S22-R2 to R4, N1, N2, E1, E2. | — | API / App | Seams in Sections 2.11–2.13 | → Plan 2 |

## 11. Verification Tickets
_Filed 2026-10-05 after the plan was approved. Each ticket is the post-implementation checklist for one phase and layer; links go to the epic's stories._

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| [SV-10847](https://shopview.atlassian.net/browse/SV-10847) | [MR Plan 1 · P0 · BE] Verify access gate, audit writer and maintenance clock | P0 · BE: The backend foundation every later phase relies on: permission-only access gate, non-flushing audit writer, local-day clock and service-name normalization. | SV-10576 | Sinisa Nogic |
| [SV-10848](https://shopview.atlassian.net/browse/SV-10848) | [MR Plan 1 · P0 · FE] Verify shared components and the Customers tab shell | P0 · FE: The shared FE building blocks and the Customers page tab shell ship with no regression to existing screens. | SV-10558, SV-10559, SV-10560, SV-10561, SV-10566, SV-10568, SV-10570 | Nikola Milosevic |
| [SV-10849](https://shopview.atlassian.net/browse/SV-10849) | [MR Plan 1 · P1 · BE] Verify schedule endpoints and rules | P1 · BE: Maintenance schedules can be created, edited, duplicated, archived and restored through the API with the agreed rules and permissions. | SV-10558, SV-10559, SV-10560, SV-10561, SV-10562, SV-10563, SV-10569, SV-10576 | Sinisa Nogic |
| [SV-10850](https://shopview.atlassian.net/browse/SV-10850) | [MR Plan 1 · P1 · FE] Verify Maintenance schedules settings screens | P1 · FE: The Settings > Maintenance schedules list, editor and service form work end to end on desktop and phone. | SV-10558, SV-10559, SV-10560, SV-10561, SV-10562, SV-10563 | Nikola Milosevic |
| [SV-10851](https://shopview.atlassian.net/browse/SV-10851) | [MR Plan 1 · P2 · BE] Verify enrolment, certificates and customer setting | P2 · BE: Assets can be enrolled singly and in bulk, compliance records with attachments are stored, and the customer maintenance-notifications setting persists. | SV-10558, SV-10563, SV-10564, SV-10565, SV-10576 | Sinisa Nogic |
| [SV-10852](https://shopview.atlassian.net/browse/SV-10852) | [MR Plan 1 · P2 · FE] Verify enrolment dialog, compliance card and notifications toggle | P2 · FE: Users can enroll assets, record certificates and switch customer maintenance notifications from the customer and asset screens. | SV-10558, SV-10563, SV-10564, SV-10565 | Nikola Milosevic |
| [SV-10853](https://shopview.atlassian.net/browse/SV-10853) | [MR Plan 1 · P3 · BE] Verify meter reading capture and readings API | P3 · BE: Every mileage and engine-hours entry point records a reading exactly once, the readings endpoints behave, and history is back-filled. | SV-10567, SV-10568, SV-10576 | Sinisa Nogic |
| [SV-10854](https://shopview.atlassian.net/browse/SV-10854) | [MR Plan 1 · P3 · FE] Verify reading dialog component and meter regressions | P3 · FE: The reading dialog (built here, mounted on the asset tab in P5) and its plausibility checks, and that existing meter edits still work. | SV-10566, SV-10567 | Nikola Milosevic |
| [SV-10855](https://shopview.atlassian.net/browse/SV-10855) | [MR Plan 1 · P4 · BE] Verify due-date engine, projection and refresh jobs | P4 · BE: The estimator, confidence grading, due-date resolution and the due projection recompute correctly, in-transaction and at scale. | SV-10559, SV-10560, SV-10562, SV-10563, SV-10564, SV-10565, SV-10566, SV-10567, SV-10568, SV-10569, SV-10570, SV-10576 | Sinisa Nogic |
| [SV-10856](https://shopview.atlassian.net/browse/SV-10856) | [MR Plan 1 · P4 · FE] Verify due-display contract freeze and fixtures | P4 · FE: The FE types and default fixtures match the backend due contract before the screens that render it are built. | SV-10559, SV-10562, SV-10564, SV-10565, SV-10567, SV-10568 | Nikola Milosevic |
| [SV-10857](https://shopview.atlassian.net/browse/SV-10857) | [MR Plan 1 · P5 · BE] Verify asset Maintenance tab API and skips | P5 · BE: The asset tab endpoint, trigger candidates and skip/unskip behave, including automatic skip clearing. | SV-10566, SV-10568, SV-10569, SV-10576 | Sinisa Nogic |
| [SV-10858](https://shopview.atlassian.net/browse/SV-10858) | [MR Plan 1 · P5 · FE] Verify asset Maintenance tab | P5 · FE: The asset Maintenance tab shows enrolled services, readings and confidence, and supports enrol, readings, skip and remove. | SV-10560, SV-10562, SV-10563, SV-10564, SV-10566, SV-10568, SV-10569 | Nikola Milosevic |
| [SV-10859](https://shopview.atlassian.net/browse/SV-10859) | [MR Plan 1 · P6 · BE] Verify completion, invoice reset, reversal and lifecycle | P6 · BE: Mark complete, create-work-order-from-service, the automatic reset on invoicing, its reversal, and asset/customer lifecycle handling. | SV-10561, SV-10564, SV-10566, SV-10567, SV-10569, SV-10570, SV-10572, SV-10573, SV-10574, SV-10576, SV-10577 | Sinisa Nogic |
| [SV-10860](https://shopview.atlassian.net/browse/SV-10860) | [MR Plan 1 · P6 · FE] Verify Mark complete dialog and completed rows | P6 · FE: Users can mark services complete on a work order or elsewhere, with correct reset dates, certificates and undo. | SV-10566, SV-10572, SV-10574 | Nikola Milosevic |
| [SV-10861](https://shopview.atlassian.net/browse/SV-10861) | [MR Plan 1 · P7 · BE] Verify worklist, tiles and contact data API | P7 · BE: The organization-wide worklist rows, tiles and meta endpoints filter, sort and page correctly and fast. | SV-10560, SV-10564, SV-10565, SV-10568, SV-10570, SV-10571, SV-10573, SV-10574, SV-10576 | Sinisa Nogic |
| [SV-10862](https://shopview.atlassian.net/browse/SV-10862) | [MR Plan 1 · P7 · FE] Verify Maintenance reminders worklist and contact card | P7 · FE: The worklist on the Customers page lets users filter, act on and clear due services, and reach the customer through the contact card. | SV-10560, SV-10562, SV-10564, SV-10566, SV-10570, SV-10571, SV-10572, SV-10574, SV-10577 | Nikola Milosevic |

When all these tickets are marked Done, the feature is ready for QA.

---

## Appendix: merge notes

This plan merges a backend half, a frontend half, the reconciled API contract, the clarification and decision record, and
the phase skeleton. Where they contradicted each other, the contract won on API matters, the backend half on data and
domain, and the frontend half on UI. Each resolution is listed below.

### Contradictions resolved

| # | Topic | What disagreed | Resolution (rule) | Where changed |
|---|---|---|---|---|
| 1 | Duplicate schedule name status | BE S1-E2 and the P1 functional test said 409; the contract says 400 with `errors[{field: "name"}]` and keeps 409 only as a concurrent-duplicate backstop | 400 field error, 409 backstop (contract) | Section 1 S1-E2; Phase P1 tests |
| 2 | Enrolment preview needs-reading fields | BE S7-R15: `mileageUsablePairs`/`hoursUsablePairs`; contract A10: `needsMileageReading`/`needsHoursReading` | Contract field names; usable pairs stay the internal input (contract) | Section 1 S7-R15 |
| 3 | Bulk preview already-on flag | BE S7-R25: `alreadyOnSchedule`; contract A12: `alreadyOn` | `alreadyOn` (contract) | Section 1 S7-R25 |
| 4 | Meaning of `hasEmail` | BE S7-R20: from the preferred contact; contract A16 and BE 5.2: at least one of the company's contacts has an email | At least one contact with an email (contract). Superseded by the re-audit fixes of 2026-10-04: a count of enrolled units whose contact has no email (Q11) | Section 1 S7-R20 |
| 5 | Asset tab reading cards | BE S9-R1/S9-R2: `meters[]` with `isEstimate`/`basis`; contract A24: `readings {mileage, hours}` as `ReadingCardDto {recorded, estimate}` | `ReadingCardDto` (contract) | Section 1 S9-R1, S9-R2 |
| 6 | Producing rule on the asset row | BE S9-R5: `winningTrigger` on the wire; contract: `due.basis` | `due.basis`; `winning_trigger` stays a projection column (contract) | Section 1 S9-R5 |
| 7 | Last done on the asset row | BE S9-R6 (Sections 1 and 10): `lastDoneOn`/`lastDonePath`; contract: `lastDone {date, kind}` | `lastDone {date, kind}` (contract) | Section 1 and Section 10, S9-R6 |
| 8 | Needs-reading flags on rows | BE S9-N3 (Sections 1 and 10): `needsMileage`/`needsHours`; contract `DueDto.needsReadings[]` | `due.needsReadings[]` (contract) | Section 1 and Section 10, S9-N3 |
| 9 | Due status field name | BE S9-R7, S13-R13, the P5 handler row and the P7 tiles note: `dueStatus`; contract rows: `status` | `status` on the wire; the domain class stays `DueStatus` (contract) | Section 1; Phases P5 and P7 |
| 10 | Schedule chip on the worklist | BE S13-R18, the P7 note and Section 10: `vehicleScheduleCount`; contract A30: `showScheduleChip` | `showScheduleChip`, derived from the grouped count (contract) | Section 1, Phase P7, Section 10 |
| 11 | Invoiced flag on worklist rows | BE S13-R14: `isInvoiced` on the row; contract A30 `workOrder` carries `{id, displayNumber, workplaceId, status}` only | No `isInvoiced` on the wire; the primary action reads `workOrder.status` (contract) | Section 1 S13-R14 |
| 12 | Missing preferred contact | BE S14-N4: `contact: null`; contract and BE P7 fetcher: `contact` is always an object with `contactId: null` | Object with `contactId: null` (contract) | Section 1 S14-N4 |
| 13 | Estimated-due inputs | BE S11-R9: `isEstimate` + inputs on the wire; contract: `DueDto` (`precision`, `basis`, `confidence`) | `DueDto` (contract) | Section 1 S11-R9 |
| 14 | Lines-added field | FE traceability: `lines_added`; contract A33: `linesAdded` (camelCase response) | `linesAdded` (contract) | Section 10, S16 row |
| 15 | When the FE wires A33 | Contract: "FE consumes in P5/P7"; FE half: Create work order is enabled in P7 on both the asset tab and the worklist | P7 on both surfaces (FE, a UI phasing matter); the BE endpoint still ships in P6 | Section 5.2 A33 row |
| 16 | S2-E2 two fixed points | FE traceability: TriggerBlock with multiple At rows; BE: a service has one calendar row, so two fixed points means two services | One calendar row per service (BE, domain); wording question drafted as Q10 | Section 10, S2-E2 App row |
| 17 | S7-N3 scope | FE traceability: satisfied by BE in P2; BE: → Plan 2 (the backlog flag is only stored in P2) | → Plan 2 (BE, domain/scope) | Section 10, S7-N3 App row |
| 18 | S7-E6 phase | FE traceability: P2; BE: P6 (`EndEnrolmentsOnVehicleUnlinkedSubscriber`) | P6 (BE, domain) | Section 10, S7-E6 App row |
| 19 | S11-N1 scope | FE traceability grouped it with BE P4 rules; BE: → Plan 2 (no automatic email in Plan 1) | → Plan 2 (BE, domain/scope) | Section 10, S11 rows |
| 20 | S14-E3 scope | FE traceability: n/a; BE: → Plan 2 (part of the Send set) | → Plan 2 (BE, scope) | Section 10, S14-E3 App row |
| 21 | Reading log table and module | Decision D2: `asset_meter_reading` in `VehicleService/Vehicles`; BE half (D20, TD-01): `vehicle_meter_reading` in `VehicleService/MeterReadings` | BE half (data) | Section 3.1 D2 annotated |
| 22 | Certificate file picker | Decision D5: FE picker built on `useNoteAttachmentPicker`; FE FD-18: `useFilePicker`, because the note picker is bound to note mime types | `useFilePicker` (FE, UI) | Section 3.1 D5 annotated |
| 23 | Hover card construction | Decision D10: `ScheduleBlock` rendering + `ReportInfoIcon` trigger set; FE FD-9: a new `HoverCard.vue`, `ScheduleBlock` left alone because it refuses tap | New `HoverCard.vue` (FE, UI) | Section 3.1 D10 annotated |
| 24 | FE risk cross-references | FD-7 (phone dialogs) cited R4 and FD-9 (hover card) cited R3, but the FE risk table numbers dialogs R3 and the hover card R4 | Swapped back: FD-7 → FR3, FD-9 → FR4 (FE, internal consistency) | Section 3.3 |
| 25 | Customer delete event | Decision D17 says customer delete fires no event; the BE half verified that `Company::recordDeleted()` records `CompanyDeleted` | `CompanyDeleted` is subscribed (BE, domain) | Section 3.1 D17 annotated |
| 26 | Historical reading volume | DQ3 says the 197,841 + 143,093 rows matter to the Chunk 2 plan only; D19 and the BE half put the one-time historical load in Plan 1 (P3) | Plan 1 P3 (BE, data); DQ3 annotated | Section 1 clarifications, DQ3 row |

### Other editorial changes (no change of substance)

- Risk ids were prefixed to keep the two tables apart: backend `BR1`–`BR14`, frontend `FR1`–`FR18`; FD references updated.
- Frontend section references (`§1.x`, `§3`, `§5`, `§6`) were renumbered to this document's sections (2.5–2.10, 5.4, 2.11, 7.4).
- References to the separate contract file were replaced with references to Section 5; "section 7" in the backend half now
  reads Section 9 (security) where it meant the Golden Rule Exemptions.
- Backend risks BR8 and BR9 now point at the drafted questions E3 and Q9 that cover the same issues. BR8's own follow-up
  (skip a WO reading equal to the asset's latest recorded value) and E3's rule (record a WO reading only when the value was
  entered or changed on that WO) are different proposals for the same problem; both are kept, and E3 is the one queued to ask.
- Internal planning-state references in the decision record were reworded as "the first directive" / "the third intake
  directive".
- The frontend traceability row "S11 other (…)" was relabelled "S11-R1–R8, R14, R20–R23, R26, N2–N3, E1–E6 (S11 other)" so each id is explicit.
- Phase tables use the template's `File | Action | Description` header; the action values (Create/Modify) are unchanged.

### Amendments after the merge

- **P6 amendment: invoice reversal undoes the invoice reset.** Added NFR-022 (Section 1) and the S18-E2 (reversal half)
  and S18-E3 rows to the S18 Plan 1 subset; S18-E2 left the "Deferred to Plan 2" list except its step-related refinements
  (Section 1 and the Section 10 deferred row), and the Plan 1 scope line names both. Added TD-29 (3.2) and BR15 (3.4; the
  amendment called it R15, renumbered to the BR series). Section 4: `reset_basis`, `undone_reason` and
  `mcomp__invoice_id_idx` on `maintenance_service_completion` (4.1, 4.2 DDL and mapping note, 4.3 rules 1 and 3), plus the
  P6 database row. P6: 15 backend file rows (including the `ServiceCompletion.orm.xml` mapping row the amendment's notes
  name), sketch 5b, the VOID-path note, the unit and functional tests, and `InvoiceReversalTest` in 7.2. Section 8: the
  "Invoice reset only" row now reads "Invoice reset and reversal undo". Section 10: NFR-022, S18-E2 (reversal half) and
  S18-E3 rows. The amendment's S18-E3 row is kept even though "E3" also stays in the Plan 2 deferred range, as the
  amendment only removes E2 from that list.
- **FE `idSuffix` (EQ-5).** Optional `idSuffix` prop on `CertificateFields` (P2 file row, a new P2 spec row and a P2 FE test
  bullet) and on `ResetDateField` (P6 file row, a new P6 spec row and a P6 FE test bullet).
- **E2E pass.** Every `#### E2E tests (e2e/)` placeholder in P0–P7 now holds that phase's scenarios (22 Create in total),
  backlog count, reference-update ids, §8 situation and Dev-layer line; P3 states the override marker vs the recommended
  `None — no-fe-diff`, and P4 states `None — prop-type-rename`. Section 7 "E2E tests" now holds the cross-phase
  conventions and the new `MaintenanceFactory`, the scenarios in the template format, summary counts, the Backlog table
  (4 rows), the Reference Updates list (19 entries), the testability notes (B1–B7), the environment and collision notes
  and the TestRail section proposal. Section 10 gained the E2E traceability rows (Layer `E2E`) and a legend sentence.
  Two edits to the E2E pass text: P1-1 step 6 now waits on the D21 URL + toast instead of "see blocker B1", and P7-2's
  count note points at D22 instead of blocker B2. Page-object lines were kept only where the E2E pass names them.
- **D21** (3.1): the schedule editor stays open after the first Save, does `router.replace` to `/:id` and shows a success
  toast (P1 `MaintenanceScheduleEditor.vue` row; resolves testability note B1).
- **D22 / NFR-F12** (3.1, Section 1, Section 10): `:data-loading="isFetching"` on the asset Maintenance tab root (P5
  `VehicleMaintenanceTab.vue` row) and on the worklist tiles and table (P7 `WorklistTiles.vue`, `WorklistTable.vue` rows);
  no P0 shared component carries it, so P0 is unchanged. Resolves testability note B2.
- **Environment and collision notes** (Section 7): invoicing E2E flows (P6-1, P7-1) run on stage because local invoice
  creation 500s on a QuickBooks bookkeeping row with no auth; DVI v2's Inspections tab vs the P0 tab-bar extraction in
  `VehicleInvoices.vue` (whichever merges second adapts); `customers.page.ts` `newCustomerButton` may already be stale on
  develop (C20266).

### Audit fixes (2026-10-02, Plan 1 audit against the PRD)

| # | Finding | Fix | Where changed |
|---|---|---|---|
| 1 | S18-R17 / S18-E8: no predicate removed a completed row from the worklist | New drafted Product question **Q12**: after Mark complete the row leaves the worklist and comes back when its next cycle reaches its first reminder row (due soon). Built in as a rest predicate on rows and tiles: hidden while `last_done_path` is a completion path (not NULL/`enrolment`) and `today < due_soon_from`; overrides the window and Needs readings. then pending Q12 | Section 0 (Q12, E3), Clarifications, both PENDING index tables, Section 1 S18-R17 and the by-construction note (S18-E8), 4.1 `last_done_path` note, P7 sketch 6 + tiles note, P7 functional tests and walk, P7-1 step 6, P7-4 (phase block and Section 7; "Brakes" now Every 2 months so only the rest rule removes it), P7 traced list, Section 10 (API + E2E rows; S18-E8 split into invoicing half by construction and worklist half in P7) |
| 2 | S18-R9 "visible on the work order" in neither plan | Marked split: BE stamp in Plan 1 P6; display on the WO → Plan 2. Plan 2 must add it to its Section 1 (it does not mention S18-R9 today) | Section 1 S18-R9 row and deferred list, Section 10 (stamp row, new → Plan 2 App row, deferred row); S18-R9 dropped from the P4 traced list |
| 3 | S2-E2 built against the PRD with no question pending | References drafted Q10 (not yet posted, "two services, not two At rows"); then pending Q10 | Section 0 Q10, Clarifications Q10, Section 1 and Section 10 S2-E2 |
| 4 | S8-R9 does not reuse the DVI component | Stated as an engineering decision: the new upload field replaces "reuse the DVI attachment component" because DVI's component is photo-only; file types stay Q5 (posted) | Section 1 S8-R9, D5, FD-18, Section 10 S8-R9 App row |
| 5 | Schedule read gate looser than "Settings tabs behind Settings Service" | Decision stated: schedule reads stay on `ROLE_WORK_ORDER::VIEW` (advisors enrolling assets need the schedule list); Settings Service gates the Settings UI and every schedule write | D3, TD-10, 5.1 rule 8, Section 9 (new "Schedule read gate" paragraph) |
| 6 | TD-14: WOs created from the worklist carry no mileage | Tied to E3: if E3 is accepted, worklist-created WOs copy the asset mileage like any hand-made WO. then pending Q13 | Section 0 E3, Clarifications E3, D20, TD-14, BR8, sketch 7 comment |
| 7a | 2.12 and D0 gave the reversal undo of S18-E2 to Plan 2 | Both now point at Plan 1 P6 / NFR-022; Plan 2 keeps only the step refinements | 2.12 reversal row, D0 |
| 7b | The two Q7 tables disagreed on "On Hold" | Settled: maintenance surfaces never show On Hold (the BE `Status` has no hold value); the app-wide `utils/workOrderStatus.ts` map is untouched | Section 1 S13-R25, both PENDING index Q7 rows, Section 10 S13-R25 rows |
| 7c | Q8 asked what MF-15 says the PRD answers | Q8 was stale: "missed calendar At stays overdue until done" is answered by S12-R3 (PRD text checked), so it is no longer pending | Section 0 Q8, Clarifications Q8, BE PENDING index Q8 row, Section 1 and Section 10 S12-R3 |
| 7d | S6-R3 and S11-E1 phase/layer mismatch | Aligned to Section 1: S6-R3 = P1 FE only (new App row; removed from the P2 range row and moved from the P2 to the P1 traced list); S11-E1 = P5 FE only (new App row; removed from the P4 range row and moved from the P4 to the P5 traced list) | Section 10, P1/P2/P4/P5 traced lists |
| 7e | A7's name-taken 409 could never fire | Checked the precedent: inspection templates check names in the application (`DbalInspectionTemplateFetcher::existsWithName()`, org + workplace scope, no status filter, so archived templates count) and `RestoreTemplateCommandHandler` does no name check. Followed it: the unique index keeps covering archived schedules; the dead 409 is dropped from A7 (409 only when not archived) | 4.1 `name` note, Section 1 S1-E2, A7 rows in 5.2 and 5.4, P1 `MaintenanceScheduleTest`, Section 10 S1-E2 |
| 7f | Work-order origin defined differently from Plan 2 | Unified: origin is derived from the maintenance link table = the earliest link with `path IN ('lines','no_lines')`, any `created_via`, `wo_panel` counts, `mark_complete` never. TD-16 marked superseded (Plan 2 TD-112) | TD-16, 2.12 origin row, Section 1 and Section 10 S22-R1 |
| 7g | (found while fixing 2.12) S13-R14 "whichever path" gap was undeclared | The 2.12 addressed-state row now says Plan 1 writes no link for a Mark complete against a WO with no link, and Plan 2 TD-110 completes it | 2.12 |
| 8a | Plan 2 calls `DueProjectionRecomputer::refreshExpiredWindows()`, which Plan 1 never defined | Added with that exact name (`refreshExpiredWindows(Uuid $organizationId, \DateTimeImmutable $today): int`, chunked by 500, one short transaction per chunk) and an `ExpiredWindowFetcher` port. The nightly command calls it. No differently named method existed to rename | P4 file rows, sketch 3, P4 unit test, TD-22, D20, Section 10 S11-R26 and NFR-014 |
| 8b | Plan 2's step after invoicing passes `offers` and `disable` to `ResetDateField` | Added both as optional P6 props (`offers?: DateString[]`, `disable?: boolean = false`); default behavior unchanged | P6 FE file row, spec row and FE test bullet; 2.13 |

Checks run after the fixes:
- A scripted check (range-expanding parser) found that every Section 1 requirement id (344) and every Section 1 NFR / NFR-F
  (34) appears in Section 10.
- A sweep for machine-local paths (`/Users/`, `/private/`, `/tmp/`, `/home/`, `~/`, scratchpad names) found none.

### Revision 2026-10-04 (PRD edits of 2026-10-02)

Product revised the PRD on 2026-10-02 (Milos Vasic; chunk pages and index change log). This revision applies the backend
and frontend change sets for those edits, reconciled into one API contract. Nothing is built yet, so no data migration
is needed (4.4).

**What the PRD changed (C1–C5) and where it landed:**

| # | PRD change | Plan changes |
|---|---|---|
| C1 | Schedules are organization-wide with a home location: every location sees and enrols onto every schedule; the picker lists the home location's lines; only users with access to the home location change lines; a duplicate keeps its home | S1-R1, S1-E2 (org-wide names), S7-R1 rewritten; **new** S1-R14, S4-R7, S4-R8, S4-R9, S6-E5; D23 (D9 superseded); TD-30, TD-31; GR-6, GR-7 (Section 9) plus the S4-R9 tightening; NFR-001/016 reworded, **new** NFR-024; `maintenance_schedule.home_workplace_id` (renamed from `workplace_id`), `msch__org_name_unq`, `msch__org_status_idx`; `home_workplace_id` on enrolment and projection (renamed from `schedule_workplace_id`); A1/A2/A8/A9 shapes (`homeWorkplace`, `homeWorkplaceName`, `workplaceCount`, `canEditCannedLines`, A8 `schedule_id`); A3/A4/A5/A7/A11 rules (403 `CannedLinesLockedError`, no other-location 409); ports `HomeLocationAccess`, `HomeCannedLineFetcher`; FE FD-23..FD-25, FR19, `CannedLinesStep.vue`, org-wide schedule keys (no `subscribeToLocation`); P1 walk step 1b; P1/P2 tests |
| C2 | No automatic email in v1; S19 is a hand send (Plan 2 Q6) | S5-R8/N1/E1 "in v1"; S7-R9 rewritten (nothing to build); **S7-N3 deleted** (Section 1 and its Section 10 App row); S11-N1 → Plan 2 Q6 ("Soon"); S12-R6 and S12-R14 lose their email halves; S14 row and seams point at the existing send email dialog; **`backlog_suppressed` removed** everywhere (enrolled service, projection, DDL, `Enrolment::enrol()`, `EnrolmentTest`, Dev-layer line; D24, D18 superseded); TD-22 and the recomputer no longer mention Plan 2's reminder job; the 2.12 "Automatic email" seam row deleted; D0 says "No Plan 3" |
| C3 | Certificate Start and End are days; End = Start + term; Start = End − term; valid through End | S8-R2, R10, R11, R12, R13, E1, E2, S7-R6, S11-R13, S12-R4, S18-R5 rewritten; D26, TD-33; `start_on`/`end_on` replace `effective_month`/`expiry_month_end` (`mcrec__org_vehicle_name_end_idx`); wire rules 6/7 (`precision = day` for certificates); A10/A17/A18/A19/A28 shapes; sketch 2 compliance branch (due = End, overdue End + 1); `CertificatePeriod` and `certificateDates.ts` sketches; FD-26, FR20; test ids `input_maintenance_certificate_start`/`_end`; P2-2 and P6-3 E2E steps, P2/P6 walks and tests |
| C4 | Copied work at a non-home location (names, descriptions, hours at local labour type and rate; no prices or parts; internal line note; WO note never mentions copying) | S13-R30, S16-N6, S17-R2, S17-R5 rewritten; **new** S16-R22, S16-R23, S16-N9, NFR-023; D25, TD-32; sketch 7 rewritten (no `linkWithoutLines()`), **new** sketch 8 (`AppendServiceLinesToWorkOrder` home vs copy mode) and 8b (`CannedLineAppender::appendCopy()`); `CopiedLineNote`, `HomeCannedLineFetcher`; A33 `copiedWork`, `homeWorkplaceName`; `LinkState::Removed` reserved for Plan 2 (S16-R25) with positive state lists (`hasLiveWorkOrder()`, `DbalWorklistWorkOrderFetcher`); BR16, BR17; P6/P7 tests and walk |
| C5 | Mark complete becomes the WO card row's button once lines are added | S18-R1 paraphrase (→ Plan 2); 2.11 panel-hover copy "Added · 4 lines" |
| — | Chunk 2 "Ready for tech plan" (handoff 6 October) | **Q1 ✅ answered**; "PENDING Q1" removed from the S10/S11/S12 headings, the Clarifications row and both PENDING index rows |

**Section 0:** Q1 answered; GR-6 and GR-7 ✅ approved by the user 2026-10-04 (PRD-explicit, S1-R1 and S4-R7); Q8 item
reworded to "future-start renewal" and the Q8(g) note added; new Product questions **PQ-25** (re-add after Undo/Remove),
**Q16** (covered prefill for a non-home user), **Q15** (certificate arithmetic), **PQ-26** (copied tech time), each
with its built-in proposal (PQ-22..PQ-24 concern only the hand-sent email and live in Plan 2). Q2–Q12 and E3 stay open.
_Renumbered by the re-audit fixes below: Q16 and Q15 were PQ-26 and PQ-27; the copied-tech-time PQ-26 was PQ-28._

**Conflicts between the two change sets, and how they were resolved** (API and data: the backend set wins; UI: the
frontend set wins):

| # | Conflict | Resolution |
|---|---|---|
| 1 | S1-R1 BE impact: the FE set kept `maintenance_schedule.workplace_id` under `OrganizationDecorator`; the BE set renamed it `home_workplace_id`, `isOrganizationEntity()`, no `WorkplaceIdentifierAware` | BE (data) |
| 2 | S7-R9 / D18: the FE set left "keep or drop `backlog_suppressed`" to the BE | BE: dropped (D24) |
| 3 | A4 refusal for a non-home user: the FE set allowed "403 or a 400 field error" | BE: 403 `CannedLinesLockedError`; the FE sends the arrays untouched (FD-24) |
| 4 | S6-E5 BE impact: the FE set said "copies `workplace_id`" | BE: `duplicateAs()` keeps `home_workplace_id` |
| 5 | A17 `startDate`: the FE set typed it `string \| null` | BE: always present (typed or derived); the FE may keep the nullable type and never handles null |
| 6 | S13-R30 / S16-N6 copy path: the FE set pointed at "revision-be" | BE: TD-32, sketches 8/8b |
| 7 | Product question numbering: FE PQ-A | Renamed PQ-27 (one list, PQ-22..PQ-28). Renumbered by the re-audit fixes of 2026-10-04: now Q15 on the Chunk 1 thread |
| 8 | Certificate test ids: the BE cross-area note used `input_maintenance_certificate_start_date` / `_end_date` | FE (UI): `input_maintenance_certificate_start` / `_end` (§7.4, `CertificateFields`) |
| 9 | Backlog spec names: BE `schedule-home-location-lines.spec.ts` and `worklist-create-wo-copied.spec.ts` | FE (UI): `schedule-home-location-readonly.spec.ts` and `worklist-create-wo-copied-work.spec.ts`; P1 Backlog 0 → 1, P7 1 → 2, total 4 → 6 |
| 10 | P2-2 E2E step 2 and the P7 walk: two wordings of the same change | FE (UI) wording (`shiftDayKey`, the derived Start shown in `input_maintenance_certificate_start`; the copied-line note text in the walk) |

**Other edits:** wire rules and the 5.3/5.4 views restated for days and org-wide schedules; the reconciliation counts
gain "changed 2026-10-04" (A1, A2, A8, A9, A10, A17, A18, A19, A28, A33; no new endpoints in Plan 1); FE alignment
checklist items 11 and 12; `ComplianceRecordDto`, `HomeWorkplace`, `ScheduleListItemDto` and `CertificateInput` types;
the S4-R9 tightening and the copied-work rule in Section 9; the "change a schedule's canned lines" permission row.

Checks run after the revision:
- The scripted check (range-expanding parser over the first column of every Section 1 and Section 10 table) found that
  every Section 1 requirement id (351: +8 new, −1 for S7-N3) and every Section 1 NFR / NFR-F (24 + 12) appears in
  Section 10. It surfaced two gaps that predate this revision (S11-R21, S11-E4 had no Section 10 row); both rows were added.
- A sweep for machine-local paths found none.
- Plan 2 runs the same check after its own revision; the cross-plan ids (S16-R21, S16-R24, S16-R25, S16-N8) are traced there.

### Re-audit fixes 2026-10-04

A re-audit against the current PRD (Chunk 1, Chunk 2 and the index, all at their 2026-10-02 revision) checked 430 PRD
ids. It found 0 missing and 12 partial, one HIGH conflict, four MEDIUM findings and a set of LOW findings. Each fix and
where it landed:

| # | Finding | Fix | Where |
|---|---|---|---|
| H1 | The Q12 rest overrode S5-R8 and S13-R36. It hid rows after every effective completion, Needs readings rows included | The rest is now S18-R17's rule only. A **Mark complete** (`last_done_path` = `work_order` or `elsewhere`, the two answers to "Where was it done?", S18-R2) rests the row until due soon. Invoice, covered and enrolment completions never rest a row; the S13-R36 window decides. A Needs readings row is never hidden. The `due_soon_from` return point is noted as the single S5-R8 exception and is part of Q12. Still then pending Q12 | Section 0 Q12, Section 1 S5-R8 / S13-R36 / S18-R17 / by-construction note, Clarifications, both PENDING indexes, `last_done_path` column, sketch 6 predicate and the "Rest after Mark complete" paragraph, P7 functional test and browser walk, E2E P7-1 step 6 (now relies on the 91-day window) and P7-4 preconditions (Brakes watches no meter), Section 10 S18-R17 rows |
| M1 | Section 0 said Q9–Q13 were both posted and "drafted, not yet asked" | The heading now reads "Posted 2026-10-02 as a reply on the Chunk 1 thread". Each item is marked then pending. The Clarifications rows say "posted 2026-10-02, awaiting Product", and Q13 is a Product question. Q9, Q10, Q11 and Q13 were added to both PENDING indexes next to Q12 | Section 0, Clarifications, PENDING indexes, S2-E2 rows, BR8, BR9 |
| M2 | Q11 proposed a count, but the plan built a yes/no `has_email` | Built to Q11. A16 has `maintenance_units_without_email_count` and A15 has `unitsWithoutEmailCount`: enrolled units whose preferred contact for this customer is missing or has no email (`MaintenanceEnrolmentCounter::countUnitsWithoutContactEmail()`). A9 `hasEmail` reads the asset's own contact. The toggle note shows the count. Yes/no `has_email` is kept only as the fallback if Product declines. then pending Q11 | S7-R20 rows (Sections 1 and 10), A9/A15/A16 in Section 5 (and the 5.2 note), P2 BE/FE file rows, toggle copy, P2 browser walk, merge-note row 4 |
| M3 | TD-14 depended on Q13, which looked unposted | Q13 is posted, and TD-14 stays then pending Q13. S13-R38 ("as creating a work order does today") is cited as support for copying the asset mileage if Q13 is accepted. "E3 is accepted" is now "Q13 is accepted" | Section 0 Q13, Clarifications, TD-14, sketch 7 comment, BR8, PENDING index |
| M4 | S13-R14 was marked Planned, but Plan 1 never links a Mark-complete WO | Marked **Partial (Mark-complete link → Plan 2 TD-110)** in Section 10, with the same note in Section 1 | Section 1 S13-R14, Section 10 S13-R14 API + App |
| L3 | The schedule-read gate gave a stale reason ("advisors enrolling assets need the schedule list") | New reason: the data is non-sensitive configuration, and enrolment reads schedules through A9 (CE). This read is wider than "Settings tabs behind Settings Service"; tightening it is a one-line gate change | D3, TD-10, 5.1 rule (SV), Section 9 paragraph |
| L4 | The Q8 rule dropped the 14-day default row at ≤14 days | The row is now dropped only when the calendar interval is **shorter** than 14 days. At exactly 14 days S5-R12 allows it. _Superseded by Revision 3 (Q8a): the row is dropped at **14 days or less**, exactly 14 included_ | Section 0 Q8, S5-R2 rows, both PENDING indexes, `ReminderOffsets`, `serviceFormRules`, `ReminderOffsetsTest` |
| L5 | "Resend" was listed as a Plan 2 capability | Removed; the row cites S14-R5 ("there is no Resend") | 2.11 |
| L6 | S6-E3, S13-R3 and S14-R3 had no Section 10 row of their own | Added API rows: S6-E3 n/a (documented weak point), S13-R3 and S14-R3 FE only | Section 10 |
| Code 5a | "Both inspection subscribers do nothing" was inaccurate | Only `CreateInspectionsOnCannedLineReuse` listens on `LineCreated` (same `isFromCannedLine()` guard). `LinkInspectionTemplatesOnCannedLineCreation` fires on canned-line creation and is not involved | TD-32 |
| Code 7 | "`createdFromCannedLine` is descriptive" was imprecise | It is true only for the backend. The FE `WorkOrderLines.vue` blocks tech-view edits of lines awaiting authorization when `created_from_canned_line` is set. Copied lines inherit that, the same as canned lines at home | TD-32 |
| PRD | Chunk 1 S1 "Where it lives" still says schedules belong to the location they were built at | New Product question **Q14**. Proposal: reword it to the home-location model. The plan follows S1-R1 | Section 0, Clarifications, PENDING index |

**Question renumbering:** the new questions are posted on the Chunk 1 thread as Q14–Q16.
- Q14: the S1 wording (new).
- **Q15** was PQ-27: certificate End = Start + term on the same day number (14 Oct 2025 + 12 months = 14 Oct 2026).
- **Q16** was PQ-26: a non-home user sees the covered prefill, read only, because only home-location users change lines (S4-R9).

The Chunk 2 items keep Chunk 2 numbers and are posted with Plan 2's questions:
- **PQ-25** is unchanged (re-add after Undo).
- **PQ-26** was PQ-28 (copied tech time).

Every id in the body was renamed. The earlier history blocks keep their wording and carry a pointer to this mapping.

**Not changed (accepted):**
- L2: the TD-32 default labour type for a source line without one was a literal reading of S16-R22. Superseded by the follow-up below (PQ-29).
- L7: the phase mismatches for shared components are benign.
- The S5-R12 "N×28 days" month comparison was not raised in this pass.
- The S13-R37 numbered pager stays under Q6.
- The S8-R9 attachment component stays under Q5.

Checks run after the fixes:
- The scripted Section 1 ↔ Section 10 check (range-expanding parser over the first column of every Section 1 and
  Section 10 table) found that all 351 Section 1 requirement ids and every NFR / NFR-F (24 + 12) appear in Section 10.
  S6-E3, S13-R3 and S14-R3 now also have rows of their own.
- A sweep for machine-local paths found none in the body.

**Follow-up (2026-10-04, after the re-audit fixes):**
- **PQ-29** (Chunk 2, posted on the Chunk 2 thread). In copy mode (S13-R30, S16-R22), a home canned line with no labour type is copied with no labour type and is not priced. Before this change it took the local default labour type and rate. The local default now applies only when the source's labour type has no match at this location. The change is then pending PQ-29 and is applied in:
  - Section 0 and the Clarifications row;
  - the BE PENDING index;
  - Section 1 S16-R22;
  - TD-32;
  - sketch 8b;
  - `AppendServiceLinesToWorkOrderTest` and `CreateWorkOrderFromServiceTest`;
  - Section 10 S16-R22.

  The re-audit's L2 note is superseded.
- **Q14, Q15, Q16** were posted 2026-10-04 as reply 916520963 on the Chunk 1 thread. Section 0 and the Clarifications row are updated.
- **Plan 2 forward notes.** The 2.11 row and hook 3 now describe Plan 2's design, which replaces the old `addToWorkOrder` idea:
  - A37 `POST /api/work-orders/{workOrderId}/maintenance/services` (`useAddServicesToWorkOrderMutation`; copied work at a non-home WO);
  - A44 `DELETE …/maintenance/services/{enrolledServiceId}` (`useRemoveServiceFromWorkOrderMutation`). It moves the link to the `removed` state that P6 reserves, and leaves the lines and the WO note untouched.
- I re-ran the scripted Section 1 ↔ Section 10 check. All 351 ids and every NFR / NFR-F (24 + 12) are traced, and none is missing.

### Revision 3 — 2026-10-05 (Product answers)

Product (Milos Vasic) answered every Chunk 1 question on 2026-10-05 (replies 917667841, 917405698, 917438476 on the Chunk 1 thread 913866753) and the Chunk 2 questions (917733377, 917209101). Engineering answered the Q7b follow-up (reply 917438478). The user set the release model (one shared feature branch) and dropped the legal send switch. This revision applies the backend change set (`P1-R3-E01`…`E88`) and the frontend change set (`R3-P1-00`…`R3-P1-62`) with the FE adjustments. Where they conflicted, the backend set won for API and data and the frontend set won for UI.

| # | Change | Source | PRD ids |
|---|---|---|---|
| C1 | **No feature flag.** Ships to every organization; readings recorded for every org from release; past WO and imported readings loaded once (D27) | Q4 | S10-R12 (new), index "Release" + Key Decision |
| C2 | **Release model:** Plan 1, then Plan 2, on one shared feature branch `feature/SV-3780-maintenance-reminders`; phase PRs target the branch; QA tests the branch build; the E2E coverage pass and one PR to `develop` when Plan 2 is done; then the release. No flag, no release toggle (D28). Risks BR18 (drift), BR19 (migration ordering) | User | — |
| C3 | Before row **shorter** than the calendar interval; no default 14-before row at **14 days or less**; a note names the limit. Months convert at 30 days (then pending Chunk 1 Q17, new) | Q8a | S5-R12, S5-R13 (new) |
| C4 | Mark complete **On a work order** records that WO's readings, dated the Reset date (TD-35) | Q9 | S18-R19 (new), S10-R11 |
| C5 | A WO reading counts only when entered or changed on that WO; a copied value is not a reading; WOs created from the worklist copy mileage (TD-34, TD-14) | Q13 | S10-N6 (new) |
| C6 | Any contact of the customer with an email lets a reminder be sent; with none, every surface says so and offers Add contact; the unit count is gone (A9, A15, A16, A30) | Q11 | S7-R20, S14-R13 (new), S14-N2 |
| C7 | Every completion, Mark complete or invoicing, rests the worklist row until due soon; Needs readings rows always show (TD-36) | Q12 | S13-R43 (new), S18-R17 |
| C8 | Step-confirmed (invoice) dates cannot be changed afterwards: A24 `completed` only for Mark complete; A29 409 `CompletionNotUndoableError` | Chunk 2 #12 | S18-N8 (new, Plan 1 half) |
| C9 | End date past the end of the month moves back to the month's last day, both directions | Q15 | S8-R10 |
| C10 | Orange Contact border only when the asset's contact has no phone and no email **and** the customer has no company phone | Q7c | S13-R41 |
| C11 | Assets stay **hard-deleted**; maintenance history is kept in the data (engineering, reply 917438478). _Superseded 2026-10-05: an engineering proposal, not an answer; now pending Product (Final audit fixes, H1)_ | Q7b | S21-R6, S13-E5 |
| C12 | S3-R12 removed; S21-N3 added (audit recorded, no screen) | Q7d, Q3 | S3-R12, S21-N3 |
| C13 | Accepted as proposed (markers removed): Q1–Q3, Q5, Q6, Q7a/c/d, Q8b–g, Q10, Q14, Q16; PQ-25, PQ-26, PQ-29 | Status table | various |
| C14 | **No legal send switch** in either plan (D29). The legal footer is Chunk 2 #31; a "yes" holds the branch before `develop` (superseded 2026-10-05: #31 answered in 918945793, the footer ships as specified in S19-R15 and legal is a non-blocking fast follow) | User | S19-R15 (Plan 2) |
| C15 | **Still open / to be posted:** then pending Chunk 1 Q17 (months → days, proposal 30); Chunk 2 #6 (phone layout), #30, #31, #32 (all Plan 2) | — | S5-R12; S16, S19 |

Index page 833290250, change-log rows of 2026-10-05 (verbatim):

| 2026-10-05 | Milos Vasic | Engineering's tech-plan questions on Chunk 1 answered. No feature flag: the feature ships to every organization, and past readings are loaded once. Rate ceiling of 1,500 mileage or 24 engine hours a day, also the implausible-value threshold. Audit recorded, no screen in v1. Certificate file PDF, JPEG or PNG up to 10 MB. Worklist loads 50 rows as you scroll. On Hold removed; S3-R12 removed. Reminder sent to any of the customer's contacts with an email. A completed row returns when its next cycle reads due soon. Mark complete on a work order also records its readings. Copied mileage on a new work order is not a reading. End date keeps the day number. Smaller confirmations on name matching, imported visits, renewals, the location filter and short intervals. |
| 2026-10-05 | Milos Vasic | Engineering's Chunk 2 questions answered. Work order readings are entered in the existing fields; an In the shop value makes a service due without moving the rate. The collapsed card carries its badge alone. Add Service from the card only. Reversing or voiding an invoice undoes its resets and proposes again at the next invoice. The step after invoicing comes before payment, is shown to anyone who can invoice, asks before discarding changes, and cannot be reopened. The email carries everything the worklist shows for the unit, or its next two services, so Send reminder is always available; recipients are picked from the customer's contacts, with Add email for one without. Origin includes Add Service, with a From maintenance filter and a total. The phone layout of the card is an open question. |

Edit groups applied:
- **Header and Section 0:** release sentence rewritten (D28); revision-3 blockquote; Delivery bullet; every Chunk 1 question shown answered with its answer; Q7b follow-up recorded; Q17 and Chunk 2 #6/#30/#31/#32 kept as the only then pending items; release gate; engineering-owned index items (P1-R3-E03..E05, R3-P1-00..02).
- **Section 1:** S2-E2, S2-R17, S5-R2, S5-R12, S5-R8, S7-R4, S7-R20, S7-R24, S8-R9, S8-R10, S8-R12, S10-R1, S10-R10, S10-R11, S10-N2, S11-R19, S13-R9, S13-R25, S13-R27, S13-R36, S13-R37, S13-R41, S13-E5, S14-N2, S18-R17, S21-R6, S16-R22, S22-R1 rewritten; S3-R12 deleted; new S5-R13, S10-N6, S10-R12, S13-R43, S18-R19, S18-N8 (Plan 1 half), S21-N3, NFR-F13; NFR-007, NFR-013, NFR-018, NFR-022, NFR-F01, NFR-F11 rewritten; deferred list gains S14-R13, S18-R20/R21/N7/N8; Clarifications answered; "then pending index" renamed "Product answers index (2026-10-05)" (E06–E41, R3-P1-03..12).
- **Section 2:** ports `WorkOrderReadingSettler`, `WorkOrderCompletionDates`, `WorklistPredicates`; FE gating permission-only (no route guard, no org feature check); routes placed after `InspectionTemplates`; seams updated (E42–E44, R3-P1-13..18).
- **Section 3:** D0, D3, D16, D19, D20, D25, D26 amended; **D27, D28, D29** added; TD-06, TD-10, TD-11, TD-14, TD-15, TD-23, TD-24, TD-29, TD-31, TD-32, TD-33 amended; **TD-34, TD-35, TD-36** added; FD markers removed, **FD-27..FD-29** added; BR8, BR9 closed; **BR18..BR21** added; FR1, FR13 rewritten, **FR21, FR22** added (E45–E48, R3-P1-19..21).
- **Section 4:** `last_done_path` and `read_on` notes; rule 6 (no flag), rule 8 (branch migrations); 4.4 history-load rule and "Order" (E49–E52).
- **Section 5:** 403 = missing atom; A9, A15, A16, A24, A29, A30 changed; A28, A33 rules; checklist items 13–15; modified-endpoint `previous` notes; counts row "changed 2026-10-05" (E53–E56, R3-P1-22..23).
- **Section 6:** phase PRs into the feature branch; gates (sync before PR, coverage pass on the branch → develop PR, walks without the permission); P0 gate atoms only, P0-1 rewritten as the tab-shell spec; P1 `ReminderOffsets`/`serviceFormRules`/`ReminderTimingRows` boundaries; P2 has-email rule and Add contact; P3 `previous` capture (TD-34); P5 `completed` rule; P6 `WorkOrderReadingSettler`, `CompletionNotUndoableError`, sketches 5/5b/7, P6-2 reading step; P7 `WorklistPredicates`, rest predicate (TD-36), `customerHasEmail`, Add contact (E57–E79, R3-P1-24..52).
- **Section 7:** flag conventions deleted; "Shared org, feature live" and "Where they run" rows; P0-1/P6-2/P7-4 copies updated; R0-2 and R5-1 mandatory edits; R-ALL-1; B3 deleted; counts 4 edits / 13 verify-only (E80–E84, R3-P1-53..59).
- **Sections 8–10:** rollback by a revert release (no flag), invoicing kill switch first; permissions table notes A29; "Revision 3 adds no exemption"; traceability rows edited and added (S5-R13, S10-N6, S10-R12, S13-R43, S18-R19, S18-N8, S21-N3, NFR-F13), S3-R12 and the NFR-013 E2E row deleted, every answered "(pause glyph)" status now "Planned" (E85–E87, R3-P1-60..61).
- **Appendix:** historical pause glyphs in the earlier history blocks were neutralized to "then pending" so `grep` for the pause glyph lists only open items (E88, R3-P1-62).

Conflicts between the change sets and how they were settled:
- **Decision ids.** The FE set used D27 for delivery + gating; the backend numbering is kept: D27 no flag, D28 shared feature branch, D29 no legal send switch.
- **Branch name.** `feature/SV-3780-maintenance-reminders` (epic key), not `feature/maintenance-reminders`.
- **Month conversion.** N×30 on both sides (the FE had N×28), then pending Chunk 1 Q17; tests use 29/30 and 89/90.
- **A16.** No replacement field; the FE derives has-email from `contacts[].email` (trimmed, non-empty), the same rule as A9 `hasEmail` and A30 `customerHasEmail`.
- **A24 `completed`.** Null unless the latest effective completion is a Mark complete; the FE keeps its `undoable: false` guard as defensive code.
- **A28/A29 and the asset columns.** The settler changes reading state and date only; no vehicle-detail invalidation is needed.
- **R5-1.** Treated as a mandatory edit before the branch → develop PR (the FE set had verify-only).
- **FR numbering.** The FE set's FR21/FR23 are FR21/FR22 here (there was no FR22).
- **M1 reversal.** M1 (2026-10-04) narrowed the email to each service's reminder window; Product reversed it (S19-R6: the worklist's 91-day window). Those edits live in Plan 2.

Checks: the scripted Section 1 ↔ Section 10 check passes (358 PRD ids, 24 NFR, 13 NFR-F; none missing). `grep` for the pause glyph returns only Chunk 1 Q17 and Chunk 2 #6, #30, #31, #32. No feature-flag check, flag-off test or flag rollout text remains. No machine-local path in the plan.

### Final audit fixes 2026-10-05

The final audit of Plan 1 against the current PRD (Chunk 1, Chunk 2 and the index, with the 2026-10-05 answers) found no missing PRD id and one HIGH, three MEDIUM and six LOW findings. Fixes:

| # | Finding | Fix | Where |
|---|---|---|---|
| H1 | Q7b was shown as answered, but reply 917438478 is an engineering proposal (keep hard delete) with no Product reply, while S21-R6 says "Nothing that carries one is hard deleted" | Q7b is now pending Product everywhere it read as answered. New risk BR22: if Product holds to S21-R6, asset (and customer) soft delete is new cross-app scope that needs a separate decision and probably its own ticket. The plan keeps history without depending on the asset row either way (no FKs, NFR-002; plain ids; INNER JOINs, S13-E5). Revision 3 row C11 marked superseded | Header item 7, Section 0, Section 1 intro, S13-E5, S21-R6, Clarifications and answer tables, BR22, Section 10 |
| M1 | The S18-E3 row used the old meaning (credit memo). In the current PRD the credit memo is part of S18-E2, and S18-E3 is the pending invoice voided by an added line, treated as a reversal | Row renamed S18-E2 (credit-memo half); new S18-E3 row → Plan 2 Q3 (Plan 2's S18-E3 row, NFR-117, TD-104, R2-13). TD-29 no longer quotes "not a case"; the scope line and both deferred lists updated; the P6 credit-memo test is labelled S18-E2 | Section 1 scope line and S18 rows, deferred lists, TD-29, P6 tests, Section 10 |
| M2 | S13-R43 ("after any completion") vs S13-R36 ("every Needs readings row whatever its date"), plus the enrolment "Mark as done" exempted from the rest, were never put to Product | New Chunk 1 question **Q18**, to be posted, now pending. Proposal built in: Needs readings rows still show (S13-R36 wins for them); the enrolment "Mark as done" rests the row like any completion. The enrolment exemption is dropped: the rest predicate is `last_done_path IS NOT NULL` | Header item 6, Section 0, S13-R36, S13-R43, S18-R17, answer tables, TD-36, 4.1 `last_done_path`, P7 sketch and text, `WorklistEndpointsTest`, Section 10 |
| M3 | Plan 2 TD-108 modifies Plan 1's `DueDateResolver` and `DbalReadingHistory` for S16-E1 (in-shop value as a position floor), and Plan 1 never said so | New 2.12 seam row; P4 note "Plan 2 extends this phase"; the resolver file row and sketch comment name TD-108. Plan 1's behavior stays "in-shop excluded" (S11-R24) | 2.12, P4 |
| L1 | Scope line and D0 left out S18-R19 and the Plan 1 half of S18-N8 | Both added (S10-N6 and S10-R12 were already covered by "all of S10") | Section 1 scope line, D0 |
| L2 | 2.13 listed `ReadingDialog` (with `workOrderId`) as reused by Plan 2, contradicting 2.11/2.12 | Removed; 2.13 now says the WO keeps its inline inputs and opens no reading dialog (S16-R12 as answered) | 2.13 |
| L3 | D3 still said "incl. guardFeatureFlag"; the environment kill switch looked like a release toggle | `guardFeatureFlag` removed from D3. The only environment switch left is `MAINTENANCE_INVOICE_RESET_ENABLED`; TD-07 and D20 now state it is an operational safety valve (global, default on, hides no surface, never used to stage a rollout) that takes MR code off the invoicing path without a deploy (BR2). No other environment kill switch exists in the plan | D3, D20, TD-07 |
| L4 | Re-audit appendix entry L4 ("exactly 14 days" keeps the row) reads as the opposite of the current rule | Marked superseded by Revision 3 (Q8a: 14 days or less) | Appendix › Re-audit fixes 2026-10-04 |
| L5 | Posted Q17 wording ("longer" vs the PRD's "shorter") | No plan change: the plan already builds "shorter than" with N×30; the wording is a comment-thread matter | — |
| L6 | TD-34 did not name how the WO Create handler reads the asset's mileage/hours for `previous` | New WorkOrders port `AssetMeterValues::current(vehicleId): AssetMeterSnapshot`, implemented by `DbalAssetMeterValues` (one org-scoped read of `vehicle.mileage` / `vehicle.engine_hours`, called before the WO is built); also used by the MR create-WO handler (`$this->assetMeters`) | TD-34, 2.4, P3 file rows |

Checks: the scripted Section 1 ↔ Section 10 check passes (358 PRD ids, 24 NFR, 13 NFR-F; none missing). `grep` for the pause glyph now also returns Q7b and Q18 alongside Chunk 1 Q17 and Chunk 2 #6, #30, #31, #32. A sweep for machine-local paths found none. Open items for Product: Q7b (reply under 917438478), Q17 (posted as 917897217), Q18 (to be posted).

### Final answers 2026-10-05

Product answered the last open Chunk 1 items in reply 918913025 (Chunk 1 thread) and the Chunk 2 items in reply 918945793 (Chunk 2 thread). Applied in place:

| Item | Product's answer | Plan 1 edit |
|---|---|---|
| Q7b (918913025) | "Option A, keep hard delete." S21-R6 now reads: "maintenance records, readings, certificates and audit entries are never hard deleted; an asset is deleted as ShopView does today; history stays in data, no screen in v1" | Header item 7, Section 0, S13-E5 and S21-R6 rows (Sections 1 and 10), Clarifications, answers index. **BR22 retired**: no asset or customer soft delete is in scope. No code change: MR tables have no FK to the asset (NFR-002) and MR rows end softly only |
| "Soon" (918913025) | The email never shows confidence wording; every guessed date, including every Low date, reads Soon (S19-R9) | Plan 2 only (`ReminderDueLabel`); the S11-N1 row here is unchanged |
| Q17 (918913025) | "OK, 30 days per month; a 1-month interval allows 1–29 days" (S5-R12) | Markers removed from the header, Section 0, S5-R12 (Sections 1 and 10), FD-28, the A3/A4 note, and the `ReminderOffsets` and `serviceFormRules` rows. Built as is (N × 30) |
| Q18 (918913025) | "OK. A Needs readings row stays listed; every other completion rests the row, including a last service date entered at enrolment" (S13-R43) | Already built (TD-36). The S13-R36, S13-R43 and S18-R17 rows, TD-36, the `last_done_path` note, the P7 sketch and the tests now say so: a last service date entered at enrolment rests the row; Needs readings rows stay listed |
| Chunk 2 #30, #31, #32 (918945793) | #30 → new S19-R23; #31 the legal footer is a fast follow and blocks nothing; #32 a typed address doesn't change the greeting | Plan 2 only. The "branch waits for the legal footer before `develop`" hold is removed from Section 0 and D29: the footer ships as specified in S19-R15; legal is a non-blocking fast follow. C14 in the Revision 3 history is annotated as superseded |

Execution State: **Ready to implement.** Open: only Chunk 2 #6 (phone layout, Plan 2, non-blocking, proposal built) and the legal footer as a fast follow. Pause glyphs in earlier appendix history blocks were neutralized, so `grep` for the glyph returns only Chunk 2 #6.

Checks: the scripted Section 1 ↔ Section 10 check passes (358 PRD ids, 24 NFR, 13 NFR-F; none missing). The machine-local path sweep found none (the only hit is the descriptive list of patterns in an earlier history block).
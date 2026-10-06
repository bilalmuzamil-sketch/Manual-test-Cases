# Maintenance Reminders — Plan 2: The work order and the customer — Technical Implementation Plan

**Date:** 2026-10-02
**PRD:** [Chunk 2 MR](https://shopview.atlassian.net/wiki/spaces/PM/pages/897679389/Chunk+2+MR) (also: [Chunk 1 MR](https://shopview.atlassian.net/wiki/spaces/PM/pages/886931488/Chunk+1+MR); index: [Maintenance Reminders V1](https://shopview.atlassian.net/wiki/spaces/PM/pages/833290250/Maintenance+Reminders+V1))
**Jira epic:** [SV-3780](https://shopview.atlassian.net/browse/SV-3780)
**Design:** https://claude.ai/design/p/4411588b-b915-46d5-a8b8-43628a02e02a
> Note: the design project's handoff markdown is stale. The PRD wins wherever they differ; implementers must not build from those notes.

**Tech stack:** `api/`: PHP 8.5, Symfony 7.4, Doctrine ORM 3 / DBAL 4, MySQL; no new module: everything lands in Plan 1's `VehicleService/Maintenance`, plus touchpoints in WorkOrders (list column port) and a Twig email template. `app/`: Vue 3.5, Quasar 2, TypeScript, TanStack Query; new `components/ts/maintenance/work-order/` and `components/ts/maintenance/invoicing/` trees, additive edits to `VehicleCard.vue`, `Invoice.vue`, `pages/WorkOrders.vue` and the shared `components/shared/SendEmailDialog.vue`, and the existing `api/maintenance/` module extended.
**Estimated complexity:** High

> **Builds on Plan 1.** This is Plan 2 of two. It builds strictly on Plan 1, "Track, act, clear" (`2026-10-02-maintenance-reminders-plan-1.md`): its tables, services, endpoints (A1–A34) and components are reused, never forked. **A Plan 2 phase must not start before the Plan 1 phases it depends on are merged into the feature branch** (each phase block in Section 6 names them). **Plan 1 and Plan 2 are built in sequence on one shared feature branch (`feature/SV-3780-maintenance-reminders`), tested as a whole on the branch build, then merged to `develop` together and released** (Plan 1 D28). There is no feature flag and no toggle (Product Q4, 2026-10-05); no shop sees Plan 1 on its own because nothing reaches `develop` before Plan 2 is done.
>
> **The customer email is sent by hand only** (PRD 2026-10-02). Q6 builds Send reminder on the contact card through the app's existing send email dialog (`components/shared/SendEmailDialog.vue`, used today for invoices, estimates, purchase orders and statements), for one asset. From = the org name over the platform address; Reply-To = the sender; optional BCC to the sender. The backend renders the email body; the dialog shows a preview. Automatic sending, its daily job and its queue are deferred to v2 (kept at the end of S19 with their old numbers) and are not planned here. Recipients are picked from the customer's contacts; a contact without an email shows Add email, which writes the address onto the contact (A45). The email carries what the worklist shows for the unit, or its next two services as Coming up, so Send reminder is never disabled for having nothing due (S19-R6, S19-R7). The legal footer is a fast follow that blocks nothing (Chunk 2 #31, reply 918945793): The footer ships as specified in S19-R15, and the release does not wait; a postal address or unsubscribe is added later if legal requires it. Where the unit has nothing dated at all, the opening line and the table give way to "Nothing is scheduled for {unit} yet." (S19-R23). No send switch (D29). **There is no Plan 3.**
>
> **Product answers of 2026-10-05; this plan revised 2026-10-05 (revision 3)** (Milos Vasic, replies 917733377 and 917209101 on the Chunk 2 thread; Chunk 1 replies 917667841, 917405698, 917438476). No feature flag (D27) and one shared feature branch (D28); the legal send switch is dropped (D29). The collapsed WO card carries its badge alone (#5). The step after invoicing is shown to anyone who can invoice (#9, TD-39) and cannot be reopened (#12). The greeting names one or two people, otherwise "Hello," (#22). The send dialog lists every contact, with Add email (#23, A45). Send reminder is never disabled; the email carries what the worklist shows for the unit (91 days), or its next two services as Coming up (#24, TD-37). Origin also counts Add Service, and the summary line reads "42 work orders · $38,410 · Work order total", each WO's whole total (#13). Every other Chunk 2 question was accepted as proposed. #30, #31 and #32 were answered on 2026-10-05 (reply 918945793): S19-R23 "Nothing is scheduled for {unit} yet."; the legal footer is a non-blocking fast follow; a typed address does not change the greeting (S19-R19). S19-R9 now reads Soon for any guessed date, never confidence wording (Chunk 1 reply 918913025). Open: PQ-6 only (phone layout, non-blocking, proposal built). Details in Appendix › "Revision 3 — 2026-10-05".

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Ready to implement
- **Current phase:** —
- **Last completed:** —
- **Delivery (D28):** one shared feature branch for Plans 1 and 2 (`feature/SV-3780-maintenance-reminders`, cut from `develop`). Order: **Plan 1 (P0–P7), then Plan 2 (Q1–Q6), on the branch → QA tests the branch build → one PR takes the branch to `develop` → the next regular release.** Each phase PR targets the branch, never `develop`, with the full per-phase gates. The E2E coverage pass runs once, on the branch → `develop` PR. Merge `develop` into the branch at least weekly and before each phase PR (merge, never rebase or force-push: the branch is shared), then re-run the post-sync gates (Plan 1 D28, BR18–BR21 and §4.3 rule 8; here R2-19 and R220). No feature flag, no release toggle. Plan 2's phases continue on the same branch after Plan 1's. **No hold:** the footer ships as specified in S19-R15; legal (postal address, unsubscribe) is a non-blocking fast follow (Chunk 2 #31 ✅ ANSWERED 918945793); it holds neither the branch → `develop` PR nor the release.
- **Verification tickets:** SV-10847..SV-10873 (Plan 1: SV-10847..SV-10862; Plan 2: SV-10863..SV-10873). Section 11 lists each with its phase, layer, linked stories and assignee; all Done = ready for QA.
- **Open questions / blockers:** only Chunk 2 #6 (PQ-6, phone layout; non-blocking, proposal built) and the legal footer as a non-blocking fast follow (the footer ships as specified in S19-R15). Nothing blocks implementation or release.
  - _Chunk 2 questions answered by Product on 2026-10-05 (reply 917733377 for #1–#21, reply 917209101 for #14 and #22–#29); Chunk 2 MR was edited to match. Status: OPEN with Product: PQ-6 only. CHANGED: PQ-5, PQ-9, PQ-22, PQ-24. ACCEPTED (some widened): every other. MOOT: PQ-15..PQ-19. ANSWERED 2026-10-05 (reply 918945793): #30, #31, #32 (posted in reply 917831683). PQ-n = Chunk 2 #n. The former PQ-26/PQ-27 moved to the Chunk 1 thread as Q16/Q15 and are answered there._
  - **PQ-1** ✅ ACCEPTED (#1): an In the shop value counts toward a meter threshold (the service reads due at once) but moves neither the rate nor the confidence until it is recorded (S16-E1). TD-108 built; the parameter `maintenance.in_shop_position_enabled` is removed.
  - **PQ-2** ✅ ACCEPTED (#2): readings are entered in the WO's existing Mileage and Engine Hours fields; a missing one makes the row read "Needs mileage reading" / "Needs engine hours reading" and point to that field; the card opens no reading dialog (S16-R12, FD-226).
  - **PQ-3** ✅ ANSWERED (#3): Add Service is a button on every row and opens the Add Service modal (S16-R8).
  - **PQ-4** ✅ ACCEPTED (#4): covered services fold only under a listed coverer, otherwise they keep their own row (S16-R3).
  - **PQ-5** ✅ ANSWERED, CHANGED (#5): the collapsed card carries the count badge alone, with no other text (S16-R2). FD-211 header changed; A35 `addressedCount` dropped.
  - **PQ-6** ⏸ PENDING PQ-6 — OPEN with Product (#6, index Open Questions): how the WO maintenance card works on a phone, where the asset card sits behind "Show details". Product: "don't treat 'behind Show details' as the final answer". _Non-blocking:_ affects the Q1 phone layout only (R208); build the stacked layout behind "Show details" as an interim and expect a change.

> **Assumption (non-blocking, asked 2026-10-05 in reply 919502849 on the Chunk 2 thread):** "a guessed date" in S19-R9 = any meter-estimated date at any confidence → "Soon". If Product says Low only, High/Medium estimates show their month: a one-function change in `ReminderDueLabel`.
  - **PQ-7** ✅ ACCEPTED (#7): the this-WO / new-WO choice appears only on the WO card; the worklist and the asset tab keep Create work order (S17-R1).
  - **PQ-8** ✅ ACCEPTED (#8): reversing an invoice undoes the resets it made; its services are proposed again at the next invoice, keeping any date a person entered; a credit memo changes nothing (S18-E2).
  - **PQ-9** ✅ ANSWERED, CHANGED (#9): the step is shown to every user who can invoice, with no other permission, because it only confirms when the work was done (S18-N7). A38–A40 are gated by invoice-create (`InvoiceCreateVoter::INVOICE_CREATE`, TD-39); the FE CE gate is removed.
  - **PQ-10** ✅ ACCEPTED (#10): the step comes before the payment dialog (S18-R20).
  - **PQ-11** ✅ ACCEPTED (#11): "Discard your changes? The proposed dates stay."; closing untouched accepts every proposal (S18-R21).
  - **PQ-12** ✅ ACCEPTED, TIGHTENED (#12): the step cannot be reopened, and nothing offers to change its dates afterwards; the confirmed date is the date the service counts from (S18-N8). "Mark complete / Undo complete are the correction path" was **not** endorsed: an invoice completion is not undoable (A24/A35 `completed` is null for it; Plan 1 A29 answers 409 `CompletionNotUndoableError`).
  - **PQ-13** ✅ ACCEPTED, WITH ADDITION (#13): a WO also carries the origin when Add Service added a service to it; the From maintenance filter and the summary line "42 work orders · $38,410 · Work order total", where the total is each work order's whole total; Mark complete is not an origin; an organization-wide report follows later (S22-R1, S22-R4, S22-N3).
  - **PQ-14** ✅ ACCEPTED (#14): plain text without a link when the user cannot open the schedule (S22-R2).
  - **PQ-15** ✅ MOOT (S14/S19): nothing sends automatically in v1, so S14-R5 "no Resend" holds and "Last sent" is the latest hand send. `lastSentAutomatic` is dropped.
  - **PQ-16, PQ-17, PQ-18, PQ-19** ✅ MOOT (#15–#21 resolved by the 2 October edits): they were about the automatic email, deferred to v2.
  - **PQ-20** ✅ ANSWERED by the PRD edit: S5-N1, S5-R8 and S14-R5 now read "in v1", and automatic sending is deferred.
  - **PQ-21** ✅ ANSWERED by the PRD edit: S11-N1 "In Low, a reminder sent by hand shows Soon". **S19-R9 now reads Soon for any guessed date, never confidence wording** (Chunk 1 reply 918913025: "The email never shows confidence wording; every guessed date, including every Low date, reads Soon"). `ReminderDueLabel` returns "Soon" for any guessed date, every Low estimate included; the FE shows the BE label (A43). The former PRD tension is resolved.
  - **PQ-22** ✅ ANSWERED, CHANGED (#22): one person → "Hi Dave Brabay,"; two → "Hi Dave Brabay and Lisa Brabay,"; three or more, or an address without a name → "Hello," (S19-R19). Built as `ReminderRecipients::greeting()` from the ticked contacts in `contact_ids` order (preferred contact first when ticked). The mixed case (one or two ticked contacts plus a typed address) is settled by #32 below.
  - **PQ-23** ✅ ACCEPTED, EXTENDED (#23): every contact of the customer is listed; the preferred contact is ticked when it has an email; a contact without one is listed unticked, cannot be ticked, and shows "No email" with Add email, which writes the address onto the contact so it can then be ticked (S19-R3, FD-225). Add email calls **A45** `PATCH /api/customers/{companyId}/contacts/{contactId}/email` (TD-38).
  - **PQ-24** ✅ ANSWERED, CHANGED (#24): Send reminder is never disabled. The email carries everything the worklist shows for the unit: overdue, due today and due within 91 days; where there is none of that, the unit's next two upcoming services as Coming up (S19-R6, S19-R7, S14-R13, TD-37). `hasReminderItems` and `NothingToRemindError` are gone.
  - **PQ-25..PQ-29** ✅ ACCEPTED (#25–#29): S16-R25 re-attach and no Remove after a reset (Undo complete first); S16-R22 tech time copied, no labour type → not priced; S18-E3 a voided pending invoice is treated as a reversal.
  - **#30** ✅ ANSWERED 2026-10-05 (reply 918945793): "OK. When a unit has nothing dated, the opening line and the table give way to 'Nothing is scheduled for {unit} yet.'; the call to action and signature stay" (new S19-R23). Built: Send stays offered and sends; A43 returns `items: []` and `nothingScheduledLine`, which replaces the opening line (the prefilled content) and the table; greeting, call to action, signature and footer stay; no error.
  - **#31** ✅ ANSWERED 2026-10-05 (reply 918945793): "the legal footer is a fast follow and does NOT block the release or anything else. Build the footer as specified in S19-R15 and release without waiting. A postal address or unsubscribe is added later if legal requires it." Built: the S19-R15 footer (why the customer received it; no unsubscribe link). No hold on the branch or the release; no switch (D29).
  - **#32** ✅ ANSWERED 2026-10-05 (reply 918945793): "OK. A typed address doesn't change the greeting" (S19-R19). Built as proposed: the ticked contacts are named per S19-R19 ("Hi Dave Brabay,"); a typed address never forces "Hello," (`ReminderRecipients::greeting()`, `greetContactByName`).
  - _Open ENGINEERING questions (each with its recommendation; the old ids, and the questions dropped as resolved, are in the Appendix):_
  - **EQ-1** ✅ MOOT (no job in v1): the system actor for job-written `entity_event` rows. Every v1 send is written by the user who pressed Send.
  - **EQ-2** ✅ MOOT (no job in v1): the transport for mass sending. A hand send is synchronous inside the A41 request, as invoice and purchase order emails are (TD-120).
  - **EQ-3** ✅ RESOLVED. Step data: own GET (A38) keyed by `invoice_id`; it leaves the invoicing endpoint contract alone and survives reversal, at the cost of one request per invoiced WO with a vehicle, in every org, skipped when the org has no schedule (TD-41b, FD-224) (TD-106, FD-206). _Blocks:_ A38 and `useMaintenanceInvoiceStep` (Q3).
  - **EQ-4** Step correction: new completion + undo, or in-place update with audit? _Recommendation:_ new completion + undo (NFR-111); Plan 1's cycle replay depends on immutable history (TD-105). _Blocks:_ `ServiceCompletion::correctTo()` and A40 (Q3).
  - **EQ-5** Live next due on the step: FE computation or a BE preview (A39), and which completion does the preview replace? _Recommendation:_ BE preview, debounced (meter-based dates need the rate; Plan 1 NFR-F04, the FE derives nothing), with an optional `completion_id` (the A38 row's `completionId`) that the FE sends. This is the one wire difference between the halves; the backend shape is adopted (Appendix). _Blocks:_ A39 and `useNextDuePreviewQuery` (Q3).
  - **EQ-6** ✅ MOOT (no job in v1): the organization timezone was only needed for the 08:00 local send.
  - **EQ-7, EQ-8** ✅ MOOT: the send switch is dropped (D29, decided 2026-10-05). No `MAINTENANCE_REMINDER_EMAIL_ENABLED`, no `manualSendAvailable`.
  - **EQ-9** Panel row DTO shape. _Recommendation:_ a strict superset of A24 `ServiceRowDto`, so `MarkCompleteDialog`, `DueCell` and `DueBadge` take rows with no cast or change (both halves agree; TD-102, FD-202). _Blocks:_ A35 DTOs and the panel (Q1).
  - **EQ-10** ✅ RESOLVED. Multi-instance test ids in Plan 1 `ResetDateField` / `CertificateFields`. Plan 1 already adds the optional `idSuffix` prop (P2 on `CertificateFields`, P6 on `ResetDateField`; absent, the ids stay identical), so no Plan 1 change is owed. The Q3 step passes `idSuffix = _${id}`; the E2E fallback (scoping those locators inside `maintenance_invoice_step_row_${id}`) stays. For the same reason, E2E testability note **B-3 is not a blocker** (Section 7, E2E tests).
  - **EQ-11** Panel and step cache keys. _Recommendation:_ nest under `maintenanceKeys.asset(vehicleId)`, so Plan 1's single invalidation helper covers them without a signature change. _Blocks:_ `api/maintenance/keys.ts` (Q1, Q3).
  - **EQ-12** `created_via` value for a WO created from the panel, and whether it counts as an origin (S22-R1). _Recommendation:_ `wo_panel` (reserved in Plan 1 as `CreatedVia::WoPanel`); count it as origin alongside `worklist` and `asset` (the backend's TD-112 agrees; TD-112 derives origin from the link table by `path`, whatever `created_via`, and supersedes Plan 1 TD-16). _Blocks:_ A33′ (Q2) and the origin rule (Q4).
  - _Customer email (no gate left):_
  - **S19 ops** ✅ ANSWERED 2026-10-02 (index Open Questions): the email is sent by hand through the existing send pattern, from the org name over the platform address, with Reply-To the sender; there is no mass sending and no send time in v1 (both wait for v2).
  - **S19 legal** ✅ ANSWERED 2026-10-05 (#31, reply 918945793): the footer ships as specified in S19-R15. Legal (postal address, unsubscribe) is a non-blocking fast follow, added later if required. No switch (D29): Q6 is built and ships with the branch; nothing waits.
  - **Non-production delivery (NFR-118, TD-40):** before the branch build is deployed to QA or any non-production environment with cloned data, that environment must deliver Maintenance mail only to a mail sink or an explicit recipient allowlist (`MAINTENANCE_REMINDER_RECIPIENT_ALLOWLIST`, TD-40). This is environment safety, not a release toggle. _Blocks:_ any non-production send, and the Q6 E2E specs (testability note B-1).
  - **Release gate:** shared feature branch (Plan 1 D28); no flag, no release toggle; top risks Plan 1 BR18/BR19 (branch drift, migration ordering), here R2-19 and R220.

> 🛑 **About to implement this plan? Run it as `/loop /implement docs/tech-plans/2026-10-02-maintenance-reminders-plan-2.md`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement docs/tech-plans/2026-10-02-maintenance-reminders-plan-2.md` (or `/loop /implement Phase N from docs/tech-plans/2026-10-02-maintenance-reminders-plan-2.md` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue — you're in the right place. But the `/loop` session is **orchestrator-only**: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates, and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

---

## 1. Requirements (extracted from PRD)

Requirement IDs are the PRD's own (`S16-R1`, `S19-R21`, …), grouped by story with the story's Jira key. Analysis-introduced
requirements for Plan 2 are `NFR-101…` (backend analysis) and `NFR-F101…` (frontend analysis); Plan 1's `NFR-001…` and
`NFR-F01…` still apply unchanged. New endpoints continue the Plan 1 contract numbering at `A35`. The "BE impact" column
says what the backend does; the frontend side of every requirement is in Section 10.

Markers (after Product's answers of 2026-10-05, only one remains):
- `⏸ PENDING PQ-6` (Chunk 2 #6): the phone layout of the WO maintenance card, open with Product (index Open Questions); non-blocking, the interim layout is built.
- #30, #31 and #32 were answered on 2026-10-05 (reply 918945793): S19-R23 (nothing dated → "Nothing is scheduled for {unit} yet."),
  the S19-R15 footer ships as specified with legal as a non-blocking fast follow, and a typed address does not change the
  greeting (S19-R19).

Plan 2 scope: S16 (all, as revised 2026-10-02, including S16-R21..R25, N8, N9: copied work at a non-home location,
Undo/Remove after Add Service, Mark complete as the row's button once lines are added) except the rules Plan 1
delivered (S16-R19, R20 storage, N4, the N6 copy mode and the N7 enforcement); S17-R1, S17-N1, S17-E1, E2 and the panel path of S17-R2/R5/R6/R8
(Plan 1 has the create path); S18-R1 (WO half), S18-R8, R13 (editable proposal), R14, R15, R16, E2–E6, N1, N5, N6 and the step halves of
S18-R7/R18, as a correction layer over Plan 1's automatic reset; the work-order entry points of S7-R1, S8-R5, S16-R10,
S16-R11, S16-R12, reusing Plan 1 components unchanged; S14 Send reminder and last sent (S14-R4, R5, R6, R9, R10, R12, N1,
E2, E3) plus S21-R5 send logging; S19 as revised 2026-10-02, the reminder email sent by hand from the contact card through
the existing send email dialog (automatic sending is deferred to v2 by the PRD and is not planned here); S22-R2..R4
Origin column and reportability (S22-R1, origin stored, is Plan 1; its Add Service half and S22-N3 are traced here); work order split handling for maintenance links; the
Plan 1 internal seams listed below. Added by Product's answers of 2026-10-05: S14-R13, S18-N7, S18-N8, S18-R20, S18-R21,
S22-N3 and the Plan 2 half of S22-R1.

Phase codes: Q1 WO panel, Q2 Add a service to a WO, Q3 Step after invoicing, Q4 Origin column, Q5 WO split, Q6 Send
reminder by hand. (Q7, the automatic email, was removed on 2026-10-04: deferred to v2 by the PRD.) "FE only" means no backend change: the backend already returns what the
screen needs (Plan 1 or an earlier Plan 2 phase), or the rule is pure presentation. "By construction" means the rule
holds because of how existing code works and gets a test, not new code.

### S16 The maintenance panel on a work order (SV-10572)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S16-R1 | Panel inside the asset card, collapsed by default | Q1 | FE only |
| S16-R2 | Collapsed: a badge counting due soon / due today / overdue services, alone, with no other text (#5) | Q1 | `dueCount` on A35 (top-level due rows only; next-service rows not counted). **Assumption, stated:** a covered service folded under a listed coverer is not counted separately, because #4 (917733377) accepted that covered services fold into the coverer that is listed (S16-R3), so the badge counts the rows the expanded card shows; a covered service whose coverer is not listed keeps its own row and is counted; **`addressedCount` removed** (no consumer) |
| S16-R3 | Expanded: every due service, covered folded into the coverer; a schedule with nothing due shows its next service; each row carries the S16-R16 summary | Q1 | A35 `rows[]` built by `WorkOrderPanelRowsBuilder` (sketch Q1-a): `coveredServiceNames[]`, `isNextService`; fold only under a listed coverer, otherwise the covered service keeps its own row (S16-R3, #4) |
| S16-R4 | Due in the asset tab's words (S11-R9, S11-R13) | Q1 | Plan 1 `DueDto` on each row |
| S16-R5 | Asset tab badges; compliance orange, never red | Q1 | `status` (Plan 1 `DueStatus::of()`); colour FE only |
| S16-R6 | Compliance row carries no tag | Q1 | FE only |
| S16-R7 | Hover/tap shows contents: job description, parts, inspection form; at a non-home location the parts are headed "PARTS {HOME} USES (reference)" | Q1 | A36 `maintenance/enrolled-services/{id}/contents` (no prices; parts always returned; lines and parts read from the schedule's home workplace, GR-7); A35 `copiesWork` tells the FE to use the reference heading |
| S16-R8 | Add Service is a button on every row and opens the Add Service modal (this WO or a new one, S17-R1) | Q1, Q2 | FE only (A36 preview, A37) |
| S16-R9 | Add Service on every row whose service has canned lines, including not-yet-due; no canned lines → Mark complete only | Q1, Q2 | `hasCannedLines` on each A35 row; A37 refuses a service without canned lines with `NoCannedLinesError` (409) |
| S16-R10 | Certificate addable from the panel | Q1 | FE only (Plan 1 A18 unchanged) |
| S16-R11 | Asset on no schedule → Enroll in Schedule opens the S7 modal | Q1 | `isEnrolled` on A35; Plan 1 A9/A11 unchanged |
| S16-R12 | Readings are entered in the WO's existing Mileage and Engine Hours fields; a missing one makes the row read "Needs mileage reading" / "Needs engine hours reading" and point to that field; no reading dialog on the card; the panel then shows what moved | Q1 | No new endpoint (TD-107): `change-mileage` / `change-engine-hours` captured per Plan 1 TD-34 (a value changed on this WO), In the shop until settled (Plan 1 TD-35); A35 `needsReadings[]` drives the hint. FE: per-row hint button focuses VehicleCard's input (FD-226) |
| S16-R13 | Two ways per row: Add Service (its canned lines, or at another location the same work per S16-N6; resets at invoicing) or Mark complete (resets now); either marks the row addressed on this WO | Q1, Q2 | A37 (lines, or copied work at a non-home WO) and Plan 1 A28 with `work_order_id` (now writes a `mark_complete` link, Q2); `addressed` on A35 |
| S16-R14 | Nothing infers a match from line text or canned lines | Q1 | By construction: links exist only from explicit A37/A28/A33 calls |
| S16-R15 | Lines path resets at invoicing through the step; Mark complete resets at once | Q3 | Plan 1 TD-07 + Q3 step |
| S16-R16 | Row summary "4 lines · 2.8 hours"; no money on row, hover, or the Add Service modal | Q1, Q2 | `lineCount`, `hours` on each A35 row; A36 (which also serves the Add Service modal preview) and A37 carry no price field (NFR-115) |
| S16-R17 | Before lines are added Mark complete is in the row menu; once added the row reads "Added · 4 lines" and Mark complete is the row's button; either opens the S18-R1 modal with this WO chosen | Q1, Q2 | FE only (A35 `addressed.path`; Plan 1 A27/A28) |
| S16-R18 | Addressed state visible on the WO itself | Q1, Q2 | `addressed {path, linesCount, completionId, resetOn}` per row on A35, from `maintenance_work_order_service` by `work_order_id` (no `addressedCount`: the collapsed header shows the badge alone, S16-R2) |
| S16-R20 | Which service added which lines appears in the panel ("Added · 4 lines") | Q1 | `addressed.linesCount` from Plan 1 `maintenance_work_order_service_line` (storage already Plan 1). Assumption: the count is the lines the add appended, including any later deleted by hand (S16-N4: deleting them does not unsatisfy the service) |
| S16-N1 | No reading control in the panel | Q1 | FE only |
| S16-N2 | Line search does not return maintenance services | Q1 | By construction: no change to line search |
| S16-N3 | Nothing in the panel blocks closing the WO | Q1 | By construction: no WO status guard reads MR data |
| S16-N5 | No price anywhere in the panel | Q1 | NFR-115 |
| S16-R21 | Non-home location: the row reads exactly as at home (Add Service offered), plus an (i) "PM-A's lines were set up at {home}. We add the same work here at {here}'s rates. Parts are not added; each line's note lists the parts {home} uses, for reference" | Q1 | A35 `copiesWork` (home ≠ WO workplace), `homeWorkplaceName` per row, top-level `workOrderWorkplaceName`; `addServiceBlockedReason` loses `other_location` (GR-1 ext.) |
| S16-R22 | A copied line takes this location's labour type of the same name, else the default; priced at that rate; a fixed-price line is priced the same way | Q2 | Plan 1 `AppendServiceLinesToWorkOrder` copy mode (Plan 1 TD-32), consumed unchanged through A37; the home line's tech time is copied as well as its hours; a home line with no labour type stays without one, so it is not priced (#26, #29) |
| S16-R23 | Each copied line carries an internal line note "Copied from {home}. Parts used there, for reference: …" (fixed-price variant) | Q2 | Plan 1 copy mode, consumed (home parts read through `HomeCannedLineFetcher`, GR-7) |
| S16-R24 | The Add Service modal is the standard one everywhere; at a non-home location its preview lists no parts | Q1, Q2 | A36 serves the preview (parts always returned; the FE hides them when the row `copiesWork`) |
| S16-R25 | Toast "PM-A added · 4 lines" with Undo while toasts stay; then Remove in the row menu until invoiced; both un-address the row (back to Add Service, not listed in the step); neither deletes a line; Remove is not offered once the service was reset (Undo complete first); adding again re-attaches the surviving lines and adds only the missing ones (#25, #28) | Q2 | **A44** `DELETE work-orders/{id}/maintenance/services/{enrolledServiceId}` sets the link to `LinkState::Removed` (TD-125); A35 `addressed.removable`; A37 `services[].linesCount` feeds the toast; `removed` is excluded from A38, `addressed`, origin, the worklist WO column, `hasLiveWorkOrder` and the split (positive state lists) |
| S16-N6 (display) | Non-home location: Add Service copies the same work (no refusal); the row reads as S16-R21 | Q1, Q2 | A35 `copiesWork` replaces `addServiceBlockedReason = other_location`; the copy itself is Plan 1 |
| S16-N7 (display) | Invoiced or paid WO: no Add Service, (i) | Q1 | `addServiceBlockedReason = invoiced` (enforcement is Plan 1) |
| S16-N8 | Org with no maintenance schedule: no maintenance card on the WO | Q1 | A35 top-level `organizationHasSchedules` (org-scoped `EXISTS` on active schedules); the card is hidden when false and the asset has no enrolment or record |
| S16-N9 | One-workplace org never copies | Q2 | By construction (every WO is at the home location, so `copiesWork` is always false) |
| S16-E1 | A reading entered here re-evaluates at once; an In the shop value counts toward a threshold (due at once) but changes neither the rate nor the confidence until recorded (#1) | Q1 | Panel refetch after the WO reading save; recompute already runs in the capture path (Plan 1 P4). TD-108 (settled), **no parameter** |
| S16-E2 | Ten due services do not scroll forever | Q1 | FE only |
| S16-E3 (split half) | Splitting a WO keeps each service with the WO that carries its lines; a service marked complete stays with the original (still on the Chunk 2 page: the 2026-10-02 change log removed the old E3 and rewrote S16-E3 as split + merge) | Q5 | `MoveMaintenanceLinksOnWorkOrderSplitSubscriber`; the partial-split refinement is NFR-114 |

Delivered by Plan 1 and only consumed here: S16-R19, S16-N4, the S16-N6 copy mode (Plan 1 TD-32) and the S16-N7
enforcement (in `AppendServiceLinesToWorkOrder`), the merge half of S16-E3 (Plan 1 `MoveMaintenanceOnVehicleReassignedSubscriber`).

### S17 Add a service to a work order (SV-10573)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S17-R1 | Adding offers this WO or a new one | Q2 | On the panel: this WO = A37, a new one = Plan 1 A33 with `created_via = wo_panel` (A33′). The worklist and the asset tab keep Create work order only (S17-R1 as revised, #7; TD-111). The destination choice sits inside the Add Service modal (FD-209) |
| S17-N1 | Permission gated; must offer the second destination | Q2 | A37 gated exactly as `create-from-canned-line`: `ROLE_WORK_ORDER::CREATE_AND_EDIT` with the WO as subject (TD-123); FE "this WO" on `workOrderLinesCreateAndEdit` (the New Line bundle); A33 already offers New |
| S17-E1 | One four-hour line and four canned lines both possible | Q2 | By construction: the schedule's canned lines are appended as they are |
| S17-E2 | A WO with hand-typed lines can satisfy a due service without re-adding lines | Q2 | Plan 1 A28 `path = work_order` with this WO; Q2 makes it write a `mark_complete` link so the panel shows it addressed (S16-R18) |
| S17-R2, R5, R6, R8 (WO-panel path) | Lines (or at another location the same work, S16-N6), one short internal WO note "PM-A added from {schedule}" that never mentions copying, audit, dedupe on an existing WO | Q2 | Plan 1 `AppendServiceLinesToWorkOrder::append(…, CreatedVia::WoPanel)` (home or copy mode, short WO note), unchanged |

Delivered by Plan 1: S17-R2, R5–R8 for the create path; S17-N2, S17-E3 by construction.

### S18 Complete a service (SV-10574): the step after invoicing

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S18-R1 (WO half) | On a WO card row whose lines were added, Mark complete is the row's button (S16-R17); before that it is in the menu | Q2 | FE only (A35 `addressed`; Plan 1 A27/A28) |
| S18-R7 (step half) | Covered services shown as a consequence of the coverer, one date to correct | Q3 | A38 `services[].coveredServiceNames[]`; A40 corrects the coverer and moves the covered completions with it |
| S18-R8 | Step lists every service whose lines were added on this WO, ticked by default, untickable, with its reason; unticked does not reset; a Mark-complete reset is not listed | Q3 | A38 (links with `path = lines/no_lines` reset by this invoice, plus `unticked` links; a link `removed` by Undo/Remove is never listed, S16-R25); A40 `ticked: false` undoes the completion and sets the link `unticked` |
| S18-R9 (display half) | Each closed line stamps the date it closed, visible on the work order and distinct from the invoice date | Q3 | The stamp is Plan 1 P6 (TD-18). Q3 returns it: the WO lines read (`LinesDetailProvider::fetchWorkOrderLines()`, `GET /api/work-orders/lines/{workOrderId}`) gains `end_date` per line (null while open); today it is not returned |
| S18-R13 (visible step) | Invoicing shows each service with the date its cycle counts from: lines-closed date, else invoice date | Q3 | A38 `proposedResetOn`, `proposalBasis` (`lines_closed` / `invoice_date` / `carried`), `linesClosedOn`, `invoicedOn`; Plan 1 `ResetDateProposal` returns the basis (modified) |
| S18-R14 | Proposed date editable; next due follows live through the service's interval | Q3 | A40 date correction; A39 `next-due-preview?reset_on=&completion_id=` runs the Plan 1 engine for one service with the row's completion replaced by a hypothetical one |
| S18-R15 | Confirm dates = one action; closing untouched accepts every proposal | Q3 | Untouched proposals stay as Plan 1 wrote them (`proposed = 1` means accepted by default); the FE posts A40 only with a diff, and A40 marks the rows it receives as confirmed |
| S18-R16 | Compliance certificates section, one record per inspection: type, number, Start date, End date (days) and term; Start + term fills End (S8-R10); optional | Q3 | A38 `complianceServices[]` (`currentRecord` is the Plan 1 A17 Record with `startDate`/`endDate`); A40 `certificates[]` (`compliance_type`, `certificate_number`, `start_date`, `end_date`, `term_months`) creates or corrects `ComplianceRecord`s through Plan 1 `CertificatePeriod`; new column `source_work_order_id` |
| S18-R18 (step half) | Service removed while its WO was open is not listed | Q3 | Plan 1 marks such links `orphaned`; A38 excludes them |
| S18-N1 | Step skippable; nothing blocks closing | Q3 | By construction (FE dialog; no WO guard) |
| S18-N5 | Step appears only where a maintenance service was completed; leaving accepts | Q3 | A38 returns empty `services` and `complianceServices` for an ordinary WO and for an invoice that was reversed or removed; FE opens nothing |
| S18-N6 | Completing a WO shows no maintenance step | Q3 | By construction: no listener on WO completion |
| S18-E2 | Reversing an invoice undoes the resets it made; its services are proposed again when the WO is next invoiced, keeping any date a person entered; a credit memo changes nothing (#8) | Plan 1 P6 (reversal undo, Plan 1 NFR-022); Q3 (refinements) | The undo on every reversal path is in Plan 1 P6. Q3 adds the user-date carry-forward and the VOID reconciliation (Section 3a, settled) |
| S18-E3 | A pending invoice that ShopView voids because a line was added to its WO is treated the same way as a reversal (#27) | Q3 | A credit memo (`CreditMemoIssued`) touches nothing; after a reversal or a void the re-invoice re-proposes the same lines-closed date and carries a user-entered date forward (TD-104); the VOID reconciliation at the next invoice (Section 3a, settled) |
| S18-E4 | Two compliance inspections → details per record | Q3 | A38/A40 one certificate entry per compliance service |
| S18-E5 | Work done elsewhere is not detected | Q3 | By construction |
| S18-E6 | Compliance is not in the step's date list; its due comes from the certificate's End date | Q3 | A38 puts compliance links in `complianceServices[]`, never in `services[]` |
| S18-N7 | The step is shown to every user who can invoice; no other permission (#9) | Q3 | A38–A40 gated by `InvoiceCreateVoter::INVOICE_CREATE` through `MaintenanceAccessGate::guardInvoiceStep()` (TD-39); FE: no CE gate |
| S18-N8 | The step cannot be reopened; nothing offers to change its dates afterwards (#12) | Q3 | No reopen endpoint; A40 409 once the invoice is gone (Section 3a); A24/A35 `completed` is null for invoice completions and Plan 1 A29 refuses them (409 `CompletionNotUndoableError`) |
| S18-R20 | The step comes straight after the invoice is created and before the payment dialog (#10) | Q3 | FE only (FD-205) |
| S18-R21 | Closing after a change asks "Discard your changes? The proposed dates stay."; closing untouched accepts every proposal (#11) | Q3 | FE only (FD-207) |
| S8-E3 | WO closing two compliance inspections asks per record | Q3 | Same as S18-E4 |
| S21-R1 (step) | Cycle-date corrections carry actor and time | Q3 | `entity_event` `maintenance_completion` / `corrected`, `unticked`, `confirmed` (NFR-111) |

### Work-order entry points (S7-R1, S8-R5, S16-R10, S16-R11, S16-R12)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S7-R1 (WO entry) | Enrolment from the WO panel opens the same modal | Q1 | FE only (Plan 1 A9/A10/A11 are entry-point agnostic; A9 `company_id` = the WO's company) |
| S8-R5 (WO entry) | One record form serves the WO | Q1 | FE only (Plan 1 A18) |

### S14 Contact card: Send reminder and last sent (SV-10571)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S14-R4 | Send reminder sends the S19 email for that one asset with its current state, through the app's existing send email dialog | Q6 | A43 preview + A41 `POST maintenance/reminders/send`; the BE renders the body (TD-126); items per **TD-37** (the worklist's rows for the unit: overdue, due today, due within 91 days; else the next two as Coming up). No send switch (D29) |
| S14-R5 | Control reads Send reminder; nothing automatic in v1, so no Resend | Q6 | FE only |
| S14-R6 | A row's send covers that one asset only | Q6 | `DbalManualReminderItemsFetcher` selects only that (vehicle, company) |
| S14-R9 | Setting off → row appears, send unavailable naming the setting | Q6 | A30 `maintenanceNotifications` (Plan 1); A41 409 `NotificationsOffError` |
| S14-R10 | Sending follows edit-customer permission; hidden without it | Q6 | A41 gated CE |
| S14-R12 | "last sent <date>" once a reminder was sent by hand for the asset | Q6 | A30′ `lastSentAt` (latest hand send for that vehicle + customer) from `maintenance_reminder_send` |
| S14-R13 | Send reminder is offered when any contact of the customer has an email, even where the preferred contact has none; it opens the S19-R3 dialog; it is never disabled for having nothing due | Q6 | Plan 1 A30 `customerHasEmail`; no `hasReminderItems`; no `NothingToRemindError`; nothing dated at all → the "Nothing is scheduled for {unit} yet." line, still sendable (S19-R23; #30 ✅ 918945793) |
| S14-N1 | Setting off → disabled with the reason, not hidden | Q6 | Same as S14-R9 |
| S14-E2 | Sending writes an audit entry and updates last sent | Q6 | `entity_event` `maintenance_reminder_send` / `sent` + send log (recipients, message, user, time) |
| S14-E3 | Read receipts not tracked | Q6 | By construction (no tracking pixel, no open column) |
| S21-R5 | Sends logged with message, recipients, timestamp | Q6 | `maintenance_reminder_send` (`subject`, `body_html`, `recipients` JSON, `sent_by`, `sent_at`) + items |

### S19 The customer reminder email, sent by hand (SV-10575)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S19-R1 | One email; Send reminder on the contact card sends it for one asset; nothing automatic | Q6 | A41 (one vehicle + company) |
| S19-R2 | Fixed wording, same for every shop, any mix of states, no singular/plural; the dialog opens with it | Q6 | `ReminderComposer::defaultContent()` → A43 `content` (Twig-shared constant; copy owned by Product), prefilled in the dialog's editable box through `initialContent` (FD-222) |
| S19-R3 | Opens the existing send email dialog: every contact of the customer with a checkbox; the preferred contact ticked when it has an email; a contact without one listed unticked, not tickable, "No email" + Add email (writes the address onto the contact, then tickable); the further-addresses field (#23) | Q6 | FE `SendEmailDialog` lists every A16 contact (`listAllContacts` + slot, FD-223), `AddContactEmailDialog` (FD-225); **Add email → A45** (TD-38); A41 `contact_ids[]` (ticked, each with an email in `email_list`) + `email_list[]` |
| S19-R4 | Content box prefilled with S19-R2, editable for this one send; beneath it the asset's reminder table read only; no wording editor | Q6 | A43 `content` (the box's `initialContent`, editable; the dialog's fixed `message` paragraph is hidden), `items[]`, `callToAction`; A41 `email_content` |
| S19-R5 | Due today + overdue → one email listing both, state per row | Q6 | `ReminderStage::state()` per item |
| S19-R6 | Every service of the asset the worklist shows: overdue, due today, due within 91 days (S13-R36), any state (#24) | Q6 | Plan 1 `WorklistPredicates` for one (vehicle, company) (TD-37) |
| S19-R7 | None of those → the asset's next two upcoming services, each as Coming up; Send reminder is never disabled for having nothing due (#24) | Q6 | TD-37 fallback; both empty → A43 `items: []` + `nothingScheduledLine` "Nothing is scheduled for {unit} yet.", still sendable (S19-R23; #30 ✅ 918945793) |
| S19-R8 | Row: unit, service, when due, state (Past due / Due today / Coming up) | Q6 | `ReminderItem {unitLabel, serviceName, dueLabel, state}` → A43 `items[]` |
| S19-R9 | Due month where the date is sound (a day for a certificate); Soon for any guessed date, every Low date included, never confidence wording | Q6 | `ReminderDueLabel` → A43 `dueLabel` ("Soon"; no confidence word anywhere in the email) |
| S19-R14 | Every send recorded with message, recipients, sender, timestamp; updates Last sent | Q6 | `maintenance_reminder_send` (+ items) + `entity_event`; A30′ `lastSentAt` |
| S19-R15 | Footer states why; no unsubscribe link | Q6 | Template footer constant, shipped as specified; legal (postal address, unsubscribe) is a non-blocking fast follow (#31 ✅ 918945793) |
| S19-R16 | Hardcoded layout and wording, existing send pattern | Q6 | `TemplatedEmail` + `templates/email/base.html.twig`, as the invoice and PO emails |
| S19-R17 | Sent as the org name over the platform address | Q6 | `from('"<org name>" <%env(REPLY_EMAIL_SENDER)%>')` (TD-115) |
| S19-R18 | Reply-To = the user who pressed Send; the dialog's toggle BCCs them | Q6 | Reply-To user email; A41 `include_bcc` (TD-115) |
| S19-R19 | Greeting names the people: one → "Hi Dave Brabay,"; two → "Hi Dave Brabay and Lisa Brabay,"; three or more, or no named address ticked → "Hello," (#22); invoice-email signature (Best regards, user name, org name, header-location telephone); the call to action is to call | Q6 | `ReminderComposer` greeting from `ReminderRecipients::greeting()`: the ticked contacts' `trim(first last)` names in `contact_ids` order (preferred first when ticked); typed addresses do not change it (S19-R19; #32 ✅ 918945793) |
| S19-R21 | No header-location telephone → call to action omitted | Q6 | Composer; A43 `callToAction: null` |
| S19-R23 | Nothing dated at all (only no-record compliance, or every service skipped) → the opening line and the table give way to "Nothing is scheduled for {unit} yet."; the call to action and the signature stay | Q6 | TD-37 empty set → A43 `items: []`, `nothingScheduledLine`, `content` = that line (replaces the S19-R2 opening line); `ReminderComposer` renders no table; CTA, signature, footer kept (#30 ✅ 918945793) |
| S19-N3 | Notifications off → cannot be sent (S14-R9) | Q6 | 409 `NotificationsOffError`; FE disabled with reason |
| S19-N5 | No internal email | Q6 | By construction (recipients are the company's contacts plus typed addresses) |
| S19-N7 | No wording editor in Settings, no subject edit; editing one send is not an editor | Q6 | By construction |
| S19-N8 | Reuses the WO send mechanism as it stands (dialog, sender, Reply-To of the sender) | Q6 | TD-115, TD-126 |
| S19-E4 | Bounces not tracked | Q6 | By construction |
| S7-R10 | Enrolment confirmation: rows appear, no emails sent | — | FE only (Plan 1), unchanged |
| S11-N1 | Low: a hand-sent reminder shows Soon | Q6 | `ReminderDueLabel` |
| S12-R9 | Grouping into one entry applies to the email alone | Q6 | By construction (one asset per email; A24, A30, A35 keep one row per service) |

**Deferred to v2 (not requirements of this release; the PRD keeps them at the end of S19 with their old numbers, which are
not reused):** S19-R10 (08:00 local, working days), S19-R11 (org timezone from the busiest workplace), S19-R12 (hourly
job), S19-R13 (day granularity), S19-R20 (telephone of the most recent visit, location per row), S19-R22 (send only on a
change), S19-N1 (no bulk send at enrolment, backlog suppressed), S19-N2 (Low → no automatic email), S19-N4 (nothing on a
weekend), S19-N6 (preferred contact removed → stops receiving), S19-E1 (08:00 vs a truck at 08:05), S19-E2 (consolidation
is load bearing), S19-E3 (25 of 796 orgs span timezones), S19-E6 (group by recipient), S19-E7 (services months apart →
two emails). Also gone from v1: the email halves of S7-R9 (enrolment sends nothing; Plan 1's backlog-suppression flag is
removed), S12-R6 and S12-R14, S5-E1/S5-R8, and S7-N3 (deleted from the PRD). Phase Q7, which built them, is removed
(Section 6).

### S22 Origin reporting (SV-10577)

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S22-R1 (Plan 2 half) | A WO also carries the origin when Add Service added a service to it (#13) | Q2, Q4 | An A37 (Add Service) link counts (TD-112) |
| S22-R2 | WO list gains a Maintenance schedule column naming and linking to the schedule; plain text without a link when the user cannot open the schedule (#14) | Q4 | `maintenanceOrigin {scheduleId, scheduleName}` on each `GET /api/work-orders` row (A42′; no `workplaceId`: schedules are org-wide and open from any location, GR-6) |
| S22-R3 | Empty for WOs with no maintenance origin | Q4 | `maintenanceOrigin: null` |
| S22-R4 | From maintenance filter; with it on, a line above the list reads the count and the total of every matching WO across all pages ("42 work orders · $38,410 · Work order total"); the total is each WO's whole total; an org-wide report follows (#13) | Q4 | Filter `filters[]={field: 'maintenanceOrigin', value: '1'}` on `GET /api/work-orders` plus a true aggregate: with `totals=1`, `pagination.filteredTotals {workOrderCount, totalWorkOrderPrice}` over **every** row matching the current filters (TD-112, which sums `wo.total_price`, the whole WO total). The existing `pagination.totalWorkOrderPrice` is a per-page sum (`ListingQueryHandler.php:182-199`) and is not used for this |
| S22-N1 | A hand-made WO carries no origin, never inferred | Q4 | Origin only from links with `path IN ('lines','no_lines')` and `state <> 'removed'` |
| S22-N2 | Open rates and bounces not tracked | Q4 | By construction |
| S22-N3 | Mark complete is not an origin (#13) | Q4 | By construction: `mark_complete` links never count (TD-112) |
| S22-E1 | Adding a service to an existing WO marks its origin without replacing an earlier one | Q2, Q4 | A37 link counts; origin = the **earliest** qualifying link (the PRD now states it in S22-R1 too) |
| S22-E2 | The column is why this is v1 | Q4 | — |

S22-R1 (origin stored) is Plan 1; its Add Service half (above) is checked here.

### Plan 1 internal seams closed by Plan 2

| Seam | Phase | What changes |
|---|---|---|
| Automatic reset → editable step | Q3 | `ServiceCompletion` gains `reset_basis`, `confirmed_at`, `confirmed_by`; `ResetDateProposal::propose()` returns date + basis; A38/A40 correct the proposals |
| Invoice row action stays navigation | Q3 | No BE change (the step is reached through invoicing only) |
| WO split before Plan 2 left links on the original WO (Plan 1 R13) | Q5 | `MoveMaintenanceLinksOnWorkOrderSplitSubscriber` |
| `LinkPath::MarkComplete`, `CreatedVia::WoPanel`, `LinkState::Unticked` reserved | Q2, Q3 | Now written |
| `LinkState::Removed` reserved in Plan 1 P6 | Q2 | Written by A44 (Undo/Remove, S16-R25, TD-125) |
| The automatic reset had no inverse (reversed/removed invoice, incl. the unpaid payment-dialog dismissal) | **Closed in Plan 1 P6** (amendment, NFR-022) | Not in Plan 2 scope; Q3 builds on it (section 3a) |

### Analysis-introduced requirements, backend (NFR)

| ID | Requirement | Origin |
|---|---|---|
| NFR-101 | A hand send writes its log row and calls the transport inside one transaction; a transport failure rolls the row back and returns 400 `ReminderSendFailedError`. There is no 60-second resend guard (TD-122): the dialog's latch stops double submits | S19-R14; analysis (crash between send and log) |
| NFR-103 | No switch gates A41 (D29, decided 2026-10-05). The footer ships as specified in S19-R15 and legal (postal address, unsubscribe) is a non-blocking fast follow (Chunk 2 #31 ✅ 918945793); nothing waits. No organization flag (D27) | D29; S19-R15 (#31) |
| NFR-106 | The send log is permanent (no purge job), stores the rendered message, the recipients, the sender, the timestamp and the items; application logs carry ids only, never addresses or names | S19-R14, S21-R5, S21-R6 |
| NFR-107 | A35 runs a fixed number of queries (at most 7) whatever the number of services; p95 < 300 ms for a vehicle with 3 enrolments × 15 services | Analysis (shared WO screen) |
| NFR-108 | `GET /api/work-orders`: the main list SQL is unchanged unless `maintenance_origin` is sent; origin comes from one page-bounded indexed query that always runs (TD-41c); p95 regression ≤ 5 % on the largest org | Analysis (hot path) |
| NFR-109 | Characterization tests pin `ListingQueryHandler` output (rows, pagination, totals) before the change | Repo rule (test before change, as Plan 1 NFR-019) |
| NFR-110 | The split adapter never fails the split: DBAL only, savepoint, catch `\Throwable`, log `maintenance.work_order_split_failed` with ids (the reversal subscriber's equivalent rule is Plan 1 NFR-022) | Analysis; Plan 1 NFR-005 pattern |
| NFR-111 | A cycle-date correction never updates `reset_on` in place: it writes a new completion and undoes the old one (and their covered completions), audited old → new | S21-R1, S21-R6; Plan 1 seam |
| NFR-112 | Every inbound id in Plan 2 request DTOs is ownership-checked; arrays fail whole on one foreign id | Repo rule; extends Plan 1 NFR-015 |
| NFR-113 | No new permission atoms | D3 (Plan 1 TD-10) |
| NFR-114 | WO split: an open `lines` link moves to the new WO when every remaining line it added moved there; otherwise it stays; `no_lines` and `mark_complete` links stay with the original. Runs inside the split transaction | S16-E3 (split half; the rule is on the Chunk 2 page) refined for a partial split; Plan 1 R13 |
| NFR-115 | No money field in any Plan 2 response or email (panel, contents, add confirmation, step, reminder) | S16-R16, S16-N5; analysis extends to the step and the email |
| NFR-117 | Plan 2 extensions of Plan 1 NFR-022 (the reversal undo itself is Plan 1 P6): a re-invoice after a reversal carries a user-entered step date forward; an invoice voided by adding a line to its WO (no event) is reconciled at the next invoice of that WO (S18-E3 now names the void-pending case, #27); A38 returns empty arrays and A40 answers 409 once the invoice is reversed, removed or void | FE finding F-1; S18-E2, S18-E3; Plan 1 NFR-022 |
| NFR-118 | Outside production, every maintenance email (Send reminder, A41) is delivered only to a mail sink or an explicit recipient allowlist (TD-40), never to a real customer address, because staging and QA data are cloned from production. This must hold before the branch build is deployed to any non-production environment. Q6 E2E runs only where it exists | E2E pass testability note B-1 (review); staging is a production clone |
| NFR-119 | User-entered email content is HTML-escaped before `nl2br` (do not copy the invoice template's `customEmailContent\|raw`); every `email_list` address is validated (`Assert\Email`, 1–30 addresses) | S19-R4, S19-R3; analysis (free-typed content and addresses) |
| NFR-120 | A45 adds an email to a contact only when it has none (409 otherwise), gated by `ROLE_CUSTOMER::CREATE_AND_EDIT`, audited (`entity_event` `customer_contact` / `email_added`), and dispatches `CustomerUpdatedEvent` (portal webhook parity) | S19-R3; TD-38 |

### Analysis-introduced requirements, frontend (NFR-F)

| ID | Requirement | Phase | Origin |
|---|---|---|---|
| NFR-F101 | Existing WO page, invoicing flow and Work Orders list keep every existing element, id and behavior. The additions are the panel (only when the org has an active schedule, or the asset is enrolled or has a record), the step (only when A38 returns something), the Origin column and filter, and the S18-R9 "Closed {date}" caption. For a user without the surface's permission, and for a WO with no maintenance link, the WO page and invoicing behave as today; the step adds at most one A38 request per invoiced WO with a vehicle in an org with schedules | Q1–Q4 | Analysis (frontend); no flag since 2026-10-05 |
| NFR-F102 | Invoicing never fails, blocks or waits more than 4 s because of the step; any step error means "accepted" | Q3 | Analysis (frontend) |
| NFR-F103 | The panel never renders on part sales, imported WOs or history mode | Q1 | Analysis (frontend) |
| NFR-F104 | At most one maintenance request per WO open (A35); contents only on hover; previews only on date change (debounced) | Q1, Q3 | Analysis (frontend) |
| NFR-F105 | The panel reflects inline reading saves, Add Service, Mark complete and status changes without a reload | Q1–Q2 | Analysis (frontend) |
| NFR-F106 | Add Service, Undo, Remove, Send reminder and Confirm dates are re-entrancy-guarded | Q2, Q3, Q6 | Analysis (frontend) |
| NFR-F107 | Every new interactive element has a test id, including the Add Service dialog and the send dialog's reminder table; multi-instance ids are unique per row | Q1–Q6 | Analysis (frontend) |
| NFR-F108 | Phone: panel rows stack, hover is a sheet, menus are action sheets, the step is full screen | Q1, Q3 | Analysis (frontend) |
| NFR-F109 | Edits to `VehicleCard.vue` and `Invoice.vue` are additive (≤ ~20 lines each) and every existing spec of both passes unchanged | Q1, Q3 | Analysis (frontend) |
| NFR-F110 | Navigation to another location's WO carries `locationId` or degrades to plain text (schedules are org-wide and open from any location) | Q2, Q4 | Analysis (frontend) |
| NFR-F111 | Shared `SendEmailDialog` changes are additive (new props default off, two new slots, one extra emitted field); every existing consumer renders and behaves identically | Q6 | Analysis (frontend) |
| NFR-F112 | An org with no active schedule pays no visible cost: the panel renders no DOM, and invoicing reaches the payment dialog synchronously whenever the cached A35 for that WO says `organizationHasSchedules: false` (FD-224) | Q1, Q3 | Analysis (frontend), D27 |

### Plan 1 requirements the Plan 2 frontend re-verifies

Delivered by Plan 1 (P6/P7) and unchanged on the backend; Plan 2 screens render them again, so they are traced in Section 10.

| ID | Requirement (paraphrase) | Phase | BE impact |
|---|---|---|---|
| S17-R7 | Added from the worklist creates a WO and shows its number on the row (a panel-created WO shows the same way) | Q2 | None (Plan 1) |
| S14-N2 | Contact without email: no send action unless another of the customer's contacts has an email | Q6 | None (Plan 1); A30 `customerHasEmail` (Plan 1 P7) decides whether Send is offered; S14-R13 |
| S14-N4 | No preferred contact: empty state with an action to set one; no send until a contact exists | Q6 | None (Plan 1 `contact.contactId: null`); A41 409 `NoPreferredContactError` |

Counts (recounted 2026-10-05 by script, compressed rows such as "S17-R2, R5, R6, R8" expanded): 115 distinct PRD requirement IDs in the tables above (108 before revision 3, plus S14-R13, S18-N7, S18-N8, S18-R20, S18-R21, S22-N3 and the Plan 2 half of S22-R1; the deferred S19 rules are listed, not counted), 16 backend NFRs (NFR-101, NFR-103, NFR-106..NFR-115, NFR-117..NFR-120; NFR-102, 104, 105 and 116 were deleted with Q7) and 12 frontend NFRs (NFR-F101..NFR-F112); Section 10 traces every one.

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|----------|-----------|--------|
| Intake directive (user) | Planning intake | 2026-10-02 (user, verbatim intent): Do not look into Chunk 2, it is not ready yet. We want two tech plans for two chunks; this iteration is Chunk 1 only, then later we see how to connect Chunk 2 on top of that. |
| Intake directive (user) | Planning intake | 2026-10-02 (user, supersedes the 'Chunk 1 only' scope of the first directive above): Figure out dependencies across the whole feature and how they are best built, then create tech plan 1 and tech plan 2 based on that. The split does not have to follow the PRD pages; Product will be asked to update the PRD to match. |
| Intake directive (user) | Planning intake | 2026-10-02 (user): Plan 1 and Plan 2 are built one after the other and RELEASED ALTOGETHER — no shop sees Plan 1 on its own. Readings capture does not need a separate earlier release. |
| **Q1** (product): S10-S12 (+ copied S16-S18 parts) ready for handoff as written today | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED: the 2026-10-02 page edit marked Chunk 2 "Ready for tech plan". |
| **Q2** (product): S11-R19 rate ceiling: one per meter, 1,500 mileage/day, 24 hours/day; same figures drive S10-N2 orange confirm | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917667841): accepted; one ceiling for every unit, 1,500 mileage and 24 engine hours a day, also the orange confirmation (S11-R19, S10-N2). |
| **Q3** (product): S21 audit recorded, no screen this release | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917667841): accepted; audit recorded from release, no screen in v1 (S21-N3). |
| **Q4** (product): Feature flag story: off by default per org; off hides+keeps data; readings recorded for all shops; one-time historical load | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917667841), CHANGED: no feature flag; ships to every organization; readings recorded for every org from release; past WO and imported readings loaded once (S10-R12). Plan 1 D27. |
| **Q5** (product): Certificate attachment: one PDF/JPEG/PNG <=10MB, replace/remove | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917667841): accepted; one PDF, JPEG or PNG up to 10 MB, replace or remove (S8-R9). |
| **Q6** (product): Worklist paging: 50 rows at a time, server-side, infinite scroll | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917667841): accepted; 50 rows at a time, loaded on scroll (S13-R37). |
| **Q7** (product): Wording: On Hold; active asset; email on contact; drop S3-R12 | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917667841): On Hold removed; "every asset of that customer" / "deleted"; S3-R12 removed; S13-R41 accepted, S7-R20 via Q11. Q7b follow-up answered by engineering (917438478). |
| **Q8** (product): Small confirmations a-g (build unless told otherwise) | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917667841, 917438476): b–g accepted; Q8a changed (a before row shorter than the interval; no default 14-before row at 14 days or less, S5-R12, S5-R13). |
| **DQ1** (data): Assets linked to >1 customer (owed by engineering per index Open Questions) | Production query (read-only) | Query: `SELECT links, COUNT(*) AS vehicles FROM (SELECT vehicle_id, COUNT(*) AS links FROM vehicle_company GROUP BY vehicle_id) t GROUP BY links ORDER BY links;` → 1 link: 502,850; 2+: ≈19,905 (3.8%). Long tail: 1,152 vehicles with exactly 29 links, 708 with 56, 217 with 23, one with 1,486 — looks like shared/duplicated vehicles. Implications: S7-R23 customer chooser must be searchable; worklist must never join vehicle_company (key on the enrolment's customer). Follow-up: orgs=1 for every multi-link vehicle (no cross-org links). Two patterns: (1) placeholder vehicles linked to every customer ('NEED VIN' 1,486 links, 'LOOSE PARTS' 111, 'PARTS' 94, 'PARTS SALE' 80, 'PARTS SALE ONLY' 69, 'NEED/ORANGE' 61) — one per org; (2) org D99C276650C4486DBA3048222D895DC6 (14,212 assets) has one real fleet customer split into N near-duplicate company rows differing only by location punctuation, every vehicle linked to all of them: STURGEON ELECTRIC CO. 29 rows x 1,152 vehicles, ENTERPRISE TRUCK RENTAL 56 x 708, SUNBELT/FLEETNET/FLEETIO 23 x 217. MR implications: enrolment customer chooser must be searchable; worklist/tiles key on the enrolment's customer, never join vehicle_company; placeholder vehicles will appear in bulk enrolment lists. Duplicate-customer cleanup is a separate data-quality item (not MR scope). |
| **DQ2** (data): Enrolled-fleet sizing proxy: assets per organization | Production query (read-only) | Top org 18,449 assets; top 10 between 11.4k and 18.4k; 20th 6.2k. Projection ≈ ≤200k rows per org worst case — live indexed tile counts are fine, no summary table needed. Query: `SELECT HEX(c.organization_id) org, COUNT(DISTINCT vc.vehicle_id) assets FROM vehicle_company vc JOIN company c ON c.id=vc.company_id GROUP BY c.organization_id ORDER BY assets DESC LIMIT 20;` |
| **DQ3** (data): Backfill size: historical WO + imported readings | Production query (read-only) | work_order 197,841 + imported 143,093 historical readings — relevant to the Chunk 2 plan only. _Merge note: the "Chunk 2 only" remark predates D19; the historical load ships in Plan 1 (P3), and Plan 2 does not use this figure._ Query: `SELECT 'work_order', COUNT(*) FROM work_order WHERE type='service' AND vehicle_id IS NOT NULL AND (mileage>0 OR engine_hours>0) UNION ALL SELECT 'imported', COUNT(*) FROM work_order_imported WHERE vehicle_id IS NOT NULL AND (vehicle_mileage>0 OR vehicle_hours>0);` |
| **E1** (engineering): Due-date persistence strategy (D1) | User (engineering decision) | Store calculated due date per enrolled service; recalculate synchronously in the same transaction as every input write; set-based for bulk; status/confidence/today derived at read time |
| **E2** (engineering): Golden Rule Exemption: org-wide (cross-workplace) worklist read (D7) | User (engineering decision) | Approved where PRD explicit; unclear → Product (see D7) |
| **Q9** (product): Readings on a work order never invoiced stay "In the shop" forever (S10-R11) and never count; fleet shops that do not invoice their own work never build history. Proposal TBD (e.g. a WO reading also counts once Mark complete is used on that WO, or once the WO reaches Complete). | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917405698), CHANGED: Mark complete "On a work order" records that WO's readings, dated the Reset date (Plan 1 S18-R19, TD-35). |
| **Q10** (product): S2-E2 "a service needed at two fixed points is set up as two At rows" — a service has one calendar row, so this can only mean two services. Proposal: reword to "two services". | Confluence comment on the Chunk 1 PRD | ✅ ANSWERED 2026-10-05 (917405698): two services, each with its own At (S2-E2). |
| **E3** (engineering): Copied mileage: a WO copies the asset mileage at create; recording it as a reading at invoice refreshes confidence age without a real new reading. Recommendation: record a WO reading only when the value was entered/changed on that WO. | User (engineering decision) | ✅ Q13 accepted 2026-10-05 (917405698): only an entered or changed value counts (S10-N6, Plan 1 TD-34). |
| **Plan 2 product questions PQ-1…PQ-29** (Section 0) | Chunk 2 PRD thread (footer comment 914882562; PQ-22..PQ-29 as #22..#29, reply 916586498) | ✅ ANSWERED 2026-10-05 (917733377, 917209101): PQ-5, PQ-9, PQ-22, PQ-24 changed; PQ-12 tightened; PQ-13, PQ-23 extended; the rest accepted. Open with Product: PQ-6 (non-blocking). #30, #31, #32 (posted in 917831683) ✅ ANSWERED 2026-10-05 (918945793). |
| **Undo on invoice reversal: where does it land?** (engineering; backend half EQ-1, frontend half EQ-1) | Engineering review | Resolved: Plan 1 P6 amendment (accepted): TD-29, NFR-022, `reset_basis`/`undone_reason` columns. Plan 2 Q3 adds the carried user date, the VOID reconciliation (S18-E3, #27) and the step's 409/empty behavior (Section 3a). |
| **Fold `reset_basis` / `undone_reason` into Plan 1's P6 migration?** (engineering; backend half EQ-7) | Engineering review | Resolved: yes, in the Plan 1 P6 amendment (accepted). |
| **Release model** (user, 2026-10-05) | Coordinator correction | One shared feature branch: Plan 1, then Plan 2, then QA on the branch build, then one PR to `develop`, then release. No feature flag, no release toggle (Plan 1 D27, D28). |
| **Legal send switch** (user, 2026-10-05) | Coordinator decision | Dropped (D29): no `manualSendAvailable`, no `MAINTENANCE_REMINDER_EMAIL_ENABLED`. The footer applies to hand sends (PRD index); Chunk 2 #31 ✅ ANSWERED (918945793): the footer ships as specified in S19-R15; legal is a non-blocking fast follow. |
| **Chunk 2 #30** (S19-R7 × S14-R13): a unit with no dated service at all | Posted 917831683 (Chunk 2 thread) | ✅ ANSWERED 2026-10-05 (918945793): "When a unit has nothing dated, the opening line and the table give way to 'Nothing is scheduled for {unit} yet.'; the call to action and signature stay" → new S19-R23 |
| **Chunk 2 #31** (S19-R15): the legal footer | Posted 917831683 (Chunk 2 thread) | ✅ ANSWERED 2026-10-05 (918945793): "the legal footer is a fast follow and does NOT block the release or anything else. Build the footer as specified in S19-R15 and release without waiting. A postal address or unsubscribe is added later if legal requires it." |
| **Chunk 2 #32** (S19-R19): greeting with ticked contacts plus a typed address | Posted 917831683 (Chunk 2 thread) | ✅ ANSWERED 2026-10-05 (918945793): "OK. A typed address doesn't change the greeting" |
| **S19-R9 "Soon"** (former PQ-21 tension) | Chunk 1 thread | ✅ ANSWERED 2026-10-05 (918913025): "The email never shows confidence wording; every guessed date, including every Low date, reads Soon" |
| **Q7b follow-up** (Product asks engineering to confirm soft delete) | Engineering reply 917438478 | Assets stay hard-deleted; maintenance history is kept in the data (Plan 1, S21-R6). |
| Review-register items answered by the current PRD text | PRD text | MF-12: S13-R16 "A Needs readings row keeps every action". MF-13: S8-R10 certificate dates are months only, expire last day of month (superseded by the PRD edit of 2026-10-02: Start and End are days, valid through End; Plan 1 D26). MF-14: S10-R10 last entered is current even when lower; S11-R5 discards non-increasing pairs. MF-15: S12-R3 + S7-E1: Leave due stays overdue until done; calendar At stays overdue until done. MF-16: S11-R2 + S11-E6 define the rate (2026-10-02). MF-17: S7-R4: any schedule, latest completion, renamed = no match (rule detail folded into Q7c). MF-18: S12-R7/R9: rows never merged; grouping is email-only. MF-19: S2-N9 covering not inherited, acyclic; S12-R11. MF-20: S8-R13 Compliance section on the asset card. MF-21: not answered → Q2. FF-1: S13-R42. FF-2: Key Decisions mobile + S13-R39. FF-3: S2-R12 removed 2026-09-29. FF-4: S9-R13 Undo skip. FF-5: not answered → Q3. FF-6: S1-R2 + S1-R8. OQ-3: → Q7d. OQ-4: → Q8. OQ-5: → DQ2. |

Product questions Q1–Q8 were posted as a footer comment on the Chunk 1 PRD page on 2026-10-02; Q9, Q10 and E3 (as Q13) followed. All answered 2026-10-05.

### Product answers index (2026-10-05)

Backend view. Open rows first; every other former pending row is now answered and mapped to its edit.

| Marker | Rule(s) | Proposal built in | If the answer differs |
|---|---|---|---|
| ⏸ PENDING PQ-6 (S16) | Phone layout of the WO card (non-blocking) | Stacked layout behind "Show details" as an interim (R208) | Layout only, FE (S–M) |
| Answered (S19/S14) | #30 (918945793) → S19-R23 | A43 `items: []` + `nothingScheduledLine` "Nothing is scheduled for {unit} yet.", replacing the opening line and the table; A41 sends | → S19-R23, TD-37 |
| Answered (S19) | #31 (918945793) | The footer ships as specified in S19-R15 (why the customer receives it; no unsubscribe link); no switch (D29); legal is a non-blocking fast follow | → S19-R15 (template constant if legal later adds a postal address or unsubscribe) |
| Answered (S19) | #32 (918945793) | Name the ticked contacts per S19-R19; a typed address never changes the greeting | → S19-R19 |
| Answered (S16) | PQ-1, PQ-2, PQ-3, PQ-4, PQ-5 | In-shop value counts toward a threshold, not the rate (TD-108, parameter removed); existing fields (TD-107); fold under a listed coverer; badge alone (`addressedCount` dropped) | → Section 1 S16 rows, TD-108, A35 |
| Answered (S17) | PQ-7 | Card only (TD-111) | → S17-R1 |
| Answered (S18) | PQ-8, PQ-9, PQ-10, PQ-11, PQ-12, PQ-27 | Reversal undoes and re-proposes; anyone who can invoice (TD-39); before payment; discard confirmation; no reopen (S18-N8); a voided pending invoice is a reversal | → S18 rows, TD-39, Section 3a |
| Answered (S22) | PQ-13, PQ-14 | + Add Service origin; filter + "42 work orders · $38,410 · Work order total", each WO's whole total; Mark complete not an origin; plain text without Settings | → S22 rows, TD-112 |
| Answered (S19/S14) | PQ-22, PQ-23, PQ-24 | Greeting by count; every contact listed with Add email (A45); never disabled, worklist window else next two (TD-37) | → S14/S19 rows, TD-37, TD-38 |
| Answered (S16) | PQ-25, PQ-26, PQ-28, PQ-29 | Re-attach surviving lines; tech time copied; Remove refused once reset; no labour type → not priced | → S16-R22, S16-R25, TD-125 |
| Answered (Plan 1) | Chunk 1 Q15, Q16 | Same day number, month-end clamped (S8-R10); covered lines read only (S2-R17) | → Plan 1 |

Frontend view:

| Marker | FE affected | Built | Change cost if decided otherwise |
|---|---|---|---|
| ⏸ PENDING PQ-6 (S16) | PNL | On a phone the panel is reached through "Show details" (today's asset card behavior); rows stack, hover is a sheet, menus are action sheets | Layout only (S–M depending on the answer) |
| Answered #30 (S19-R23) | SEND | `SendReminderDialog` prefills the box with A43 `content` (= `nothingScheduledLine`) and renders no table; Send stays enabled | — |
| Answered #31 (S19-R15) | SEND | Built; no switch (D29); the footer is BE-rendered | — |
| Answered #32 (S19-R19) | SEND | `greetContactByName` names the ticked contacts; typed addresses ignored | — |

The legal footer holds nothing: it ships as specified in S19-R15, and a postal address or unsubscribe is a non-blocking fast follow if legal requires it (#31, 918945793). There is no "ship dark" option and no switch (D29).


---

## 2. Architecture Overview

Plan 2 adds no bounded context and no module. The backend extends Plan 1's `VehicleService/Maintenance`; the frontend adds five surfaces, reusing Plan 1 components unchanged and extending one shared app component (`SendEmailDialog.vue`) additively. Automatic email is deferred to v2 and has no code in this plan.

### 2.0 Codebase facts this plan relies on (verified against `develop` at `65531b6e0a`, on top of Plan 1's corrections table)

| Fact | Evidence | Consequence for Plan 2 |
|---|---|---|
| `InvoiceReversedEvent` (IntegrationEvent, `invoiceId`, `workOrderId`) is published by `Invoice::invoiceReversed()` from `InvoiceReversalService::reverse()` **after** the reversal transaction commits; the reversal hard-deletes the `invoice` row and sets the WO back to `COMPLETE`. Both `POST /api/invoices/reverse-invoice` and `POST /api/invoices/remove-customer-transaction` go through `reverse()` | `api/src/Invoicing/Invoice/Application/Service/InvoiceReversalService.php:110-170` | One subscriber covers both routes (S18-E2). It runs post-commit, so it cannot roll anything back, but an exception would turn a committed reversal into an HTTP 500: it must catch everything |
| `WorkOrderSplitted(splittedWorkOrderId, newWorkOrderId)` is a `DomainEvent` dispatched through `DomainEventBus` **inside** the split transaction, after the moved lines are flushed (`assignLinesToNewWorkOrder()` calls `flushAll()`); five `WorkOrderSplittedSubscriber`s already react to it (four under `WorkOrders/Domain/{Part,PartRequest,PartReturnRequest,Task}`, one in `Inventory/Orders/Domain`) | `api/src/VehicleService/WorkOrders/Application/SplitWorkOrder/SplitWorkOrderCommandHandler.php:73-104,200-210`, `api/src/VehicleService/WorkOrders/Domain/WorkOrderSplitted.php` | The split adapter is one more subscriber. `SplitWorkOrderCommandHandler` is not modified. Invoiced and paid WOs cannot be split (guard at `:74-76`) |
| The send pattern is `TemplatedEmail` with `from('"<org name>" <REPLY_EMAIL_SENDER>')`, `addReplyTo(<user email>)`, a Twig template under `templates/email/`, and a synchronous `MailerInterface::send()` (no Messenger routing for mail); `to(...$emailList)` sends one message to all chosen addresses; BCC to the user when `include_bcc`; the signature is user name, org name and header-location telephone; the WO keeps the sent HTML (`WorkOrder::invoiceSent()`) | `api/src/Invoicing/Invoice/Application/HTTP/Send/InvoiceStatusUpdatedToSentActions.php:44-147`, `api/src/Inventory/Orders/Application/HTTP/EmailOrder/EmailOrderCommandHandler.php:25-45`, `config/packages/mailer.yaml`, `config/packages/messenger.yaml:202` | S19-R16/R17/R18/R19 and S19-N8 reuse this pattern verbatim (TD-115, TD-126) |
| `organization_detail` carries `email` and `telephone`; `workplace` carries `telephone` | `api/src/Organization/OrganizationDetails/Infrastructure/Doctrine/OrganizationDetails.orm.xml`, `.../Email.orm.xml` (`email`), `api/src/Organization/Workplaces/Infrastructure/Doctrine/Workplace.orm.xml` | The call to action and signature use the header workplace's telephone (S19-R19, R21) |
| `work_order_line` records only `created_from_canned_line` (boolean), never which canned line | `api/src/VehicleService/WorkOrders/Infrastructure/Doctrine/Line/Line.orm.xml:35` | S17-R8 dedupe on an existing WO can only see lines that Plan 1's `maintenance_work_order_service_line` recorded; a canned line added by hand is invisible to it (risk R2-8) |
| Canned-line contents: `work_order_canned_line.description`, `time_estimate`; parts in `work_order_canned_line_part` (`description`, part number, `quantity`); inspection forms through `inspection_template_canned_line(canned_line_id)` | `.../Doctrine/CannedLine/CannedLine.orm.xml`, `.../CannedLine/Part/Part.orm.xml`, `api/src/VehicleService/Inspections/Infrastructure/Persistence/Repository/Doctrine/Instance/CannedLineTemplateLink.orm.xml` | S16-R7 hover contents come from these three tables; price columns are never selected (S16-R16, S16-N5) |
| `GET /api/work-orders` (`ListingQueryHandler`) enriches each page with page-bounded follow-up queries (`getLineCounts()`, `getProgress()`, `getClockedInTechnicians()` over `$workOrderIds`) and already returns `pagination.totalWorkOrderPrice` | `api/src/VehicleService/WorkOrders/Application/List/ListingQueryHandler.php:181-245` | S22-R2 adds one more page-bounded query. `totalWorkOrderPrice` is summed in the page loop (`:182-199`) over `Paginator::getValues()`, which applies `setMaxResults` (`Paginator.php:117`): it is a **page** total, and the FE adds pages as they load (`WorkOrders.vue:1437`). S22-R4 therefore needs its own aggregate (`filteredTotals`, TD-112) |
| `POST /api/invoices/create` returns a fixed array (`invoice_id`, `auto_paid`, …) from `CreateCommandHandler::processCreate()`, which also serves the Public API create and the sandbox seeder | `api/src/Invoicing/Invoice/Application/HTTP/Create/CreateCommandHandler.php:99-110,275` | The step after invoicing is read through its own endpoint; the invoice create contract is not touched (TD-106) |

### 2.1 Frontend findings that change the design

Three findings from the code change the design and have to be read first:
- **F-1 Payment dialog dismissal reverses the invoice.** Closing the invoice-mode payment dialog unpaid calls
  `invoices/remove-customer-transaction` (`TransactionsPaymentDialog.vue` `removeTransactionImpl`, about :1544). That
  route is `RemoveInvoiceController` → `InvoiceReversalService`. Plan 1's automatic reset has already run by then, inside
  `InvoiceCreatedEvent`. The BE undoes proposed completions on this path in Plan 1 P6 (the reversal amendment). The FE step re-reads the server
  after every invoice and never trusts a local copy.
- **F-2 Paying reloads the page.** `onPaymentCreated` (`Invoice.vue` :1234, reload at :1242) and `invoiceReversed` (:1785, reload at
  :1789) both call `router.go(0)`. A step queued to open after payment would be lost on the most common path. The step therefore opens
  **before** the payment dialog (FD-205).
- **F-3 `VehicleCard.vue` has three hosts.** They are `work-orders/WorkOrderLeftSection.vue:45`,
  `work-orders/imported/ImportedWorkOrderLeftSection.vue:13` and `parts/part-sale/PartSaleLeftSection.vue:19`. The panel
  is gated on `cardType === 'workOrder'`. On phones the whole card sits behind "Show details"
  (`WorkOrderLeftSection.vue` `showDetails`).

### 2.2 Where Plan 2 sits (BE)

Plan 2 adds no bounded context and no module. Everything new lives in Plan 1's `api/src/VehicleService/Maintenance/`
module (canonical layout), plus small touchpoints:

| Module | Plan 2 adds | Why here |
|---|---|---|
| `api/src/VehicleService/Maintenance/` (Plan 1) | WO panel read, contents read, add-to-WO command, remove-from-WO command (A44), step read/confirm/preview, reversal and split adapters, reminder send log, manual send and its preview (A41, A43), origin adapter | Same aggregates (`Enrolment`, `ServiceCompletion`, `WorkOrderServiceLink`, `ComplianceRecord`) and the same projection; one new aggregate `ReminderSend` |
| `api/src/VehicleService/WorkOrders/` | `WorkOrderMaintenanceOriginProvider` port (Domain/Service) + its call in `ListingQueryHandler` | The WO list owns its row shape; Maintenance implements the port, so WorkOrders never imports Maintenance |
| `api/src/EntityEvent/` (Plan 1 writer) | New types `MAINTENANCE_REMINDER_SEND` and `CUSTOMER_CONTACT` (A45) | Audit of a hand send (written by the sending user) |
| `api/templates/email/maintenance/` | The reminder template | Existing send pattern (S19-R16) |
| `api/src/Customer/Contacts/` | A45 add-email command, controller, error (TD-38) | The contact owns its email; Maintenance never writes `customer` |

### 2.3 New aggregate (BE)

| Aggregate (Domain/Model) | Table(s) | Scope | Persistence | Consistency it guards |
|---|---|---|---|---|
| `ReminderSend` (root) + `ReminderSendItem` (child) | `maintenance_reminder_send`, `maintenance_reminder_send_item` | organization | DBAL repository (written from an HTTP handler outside the ORM unit of work, TD-08 reasoning) | One row per hand send, recipients JSON, rendered body; immutable once written |

Plan 1 aggregates extended (no new invariants beyond those listed):
- `ServiceCompletion`: `reset_basis`, `confirmed_at/by`, `undone_reason`; `correctTo(date)` returns a new completion and undoes itself (NFR-111).
- `WorkOrderServiceLink`: writes the reserved `LinkPath::MarkComplete`, `CreatedVia::WoPanel`, `LinkState::Unticked` and `LinkState::Removed` (Undo/Remove, S16-R25, `remove()`); adds `LinkState::Undone` (a Mark-complete link whose completion was undone) and `reopen()` (reversal). Every predicate on link state is a positive state list, so `removed` never leaks into reset, the step, `addressed`, origin, the worklist WO column or the split.
- `ComplianceRecord`: `source_work_order_id` (one record per compliance service per WO, S18-E4).

### 2.4 Diagram (BE)

```
                       ┌────────────────────────── Work order screen ───────────────────────────┐
 A35 GET panel ───────►│ WorkOrderPanelQueryHandler                                             │
                       │   projection rows by (org, vehicle)  ── Plan 1 mdp__org_vehicle_idx    │
                       │   + links by work_order_id           ── Plan 1 mwos__work_order_id_...  │
                       │   + canned-line summary (live ids)   ── WorkOrderPanelRowsBuilder      │
 A36 GET contents ────►│ DbalServiceContentsFetcher (lines, parts, inspection form; no prices) │
 A37 POST services ───►│ AddServicesToWorkOrderCommandHandler ─► Plan 1 AppendServiceLinesTo-  │
 A44 DELETE service ──►│ RemoveServiceFromWorkOrderCommandHandler (link → removed; lines stay)  │
 A33′ (wo_panel) ─────►│   Plan 1 CreateWorkOrderForEnrolledServiceCommandHandler   WorkOrder   │
 A28 (Plan 1, WO) ────►│   MarkServiceCompleteCommandHandler (+ mark_complete link, TD-110)     │
                       └────────────────────────────────────────────────────────────────────────┘
 POST invoices/create ─► InvoiceCreatedEvent ─► Plan 1 ResetMaintenanceOnInvoiceCreatedSubscriber
                         (Q3: basis + re-invoice reconciliation)    │ completions proposed=1
 A38 GET step ─────────► InvoiceStepQueryHandler (keyed by invoice_id) ◄┘
 A39 GET preview ──────► NextDuePreviewQueryHandler ─► Plan 1 CycleHistory + DueDateResolver (pure)
 A40 POST step ────────► ConfirmInvoiceStepCommandHandler ─► correct / untick / confirm / certificates
 reverse-invoice ──┐
 remove-customer-  ├──► InvoiceReversalService::reverse() ─(post-commit)─► InvoiceReversedEvent
 transaction ──────┘        ─► RevertMaintenanceOnInvoiceReversedSubscriber (Plan 1 P6, NFR-022)
 POST work-orders/split ─► WorkOrderSplitted (in tx) ─► MoveMaintenanceLinksOnWorkOrderSplitSubscriber
 GET /api/work-orders ──► ListingQueryHandler ─► WorkOrderMaintenanceOriginProvider (page-bounded)

                         every write above ─► Plan 1 DueProjectionRecomputer::recomputeVehicles()
                                                 │
                                                 ▼  maintenance_due_projection (Plan 1)
 A43 GET preview ──► ReminderPreviewQueryHandler ─► WorklistPredicates (Plan 1) + ReminderStage.state + ReminderDueLabel + ReminderComposer
 A41 POST send ────► SendManualReminderCommandHandler ─► ReminderRecipients (contact_ids, email_list)
                     ─► ReminderComposer (greeting, escaped content, table, call to action, signature, footer)
                     ─► SymfonyReminderMailer (From org name over REPLY_EMAIL_SENDER, Reply-To user, BCC opt.)
                     ─► maintenance_reminder_send(+_item) ─► entity_event (user)
 A45 PATCH contact email ─► AddContactEmailCommandHandler (Customer/Contacts) ─► CustomerUpdatedEvent (portal webhook) + entity_event
```

### 2.5 Cross-module ports added (BE)

| Port | Defined in | Implemented in | Used by |
|---|---|---|---|
| `WorkOrderMaintenanceOriginProvider` | `WorkOrders/Domain/Service` (Create) | `Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderMaintenanceOriginProvider` (Create) | `WorkOrders/Application/List/ListingQueryHandler` |
| `ReminderMailer` | `Maintenance/Domain/Service` (Create) | `Maintenance/Infrastructure/Mail/SymfonyReminderMailer` (Create, `MailerInterface`) | Manual send |
| `OrganizationContactDetails` | `Maintenance/Domain/Service` (Create) | A small org-scoped read: org name, header-workplace name and telephone | Composer |

A45 uses Plan 1's `EntityEventWriter`, which already exists; no new port.

Events consumed (all existing): `InvoiceCreatedEvent` (Plan 1 subscriber, extended), `InvoiceReversedEvent`,
`WorkOrderSplitted`, `MileageChange` / `EngineHoursChange` (Plan 1 capture, unchanged). `CreditMemoIssued` is
deliberately not consumed (S18-E3).

### Frontend overview

**Short version.** Plan 2 adds five FE surfaces (no feature flag, D27; each is gated by permission only):
1. a maintenance panel inside the work order's asset card (`VehicleCard.vue`, one async mount line);
2. Add Service, opening an Add Service dialog (preview, this work order or a new one), with a toast Undo and a menu Remove; Mark complete becomes the row's button once lines are added;
3. the step after invoicing, opened from the single success path of `Invoice.vue` `initCreateInvoiceImpl()`, which every
   invoicing entry point reaches;
4. a Maintenance schedule column on the Work Orders list;
5. Send reminder in Plan 1's contact card slot, opening the app's existing send email dialog, with Add email for a contact without one (A45).

Everything else Plan 2 shows on screen is a Plan 1 component, reused without changes, plus additive props and one slot
on the shared `SendEmailDialog.vue`. The automatic email is deferred to v2 (no code in this plan).

### 2.6 Where Plan 2 lives (FE)

| Area | Location | Notes |
|---|---|---|
| WO panel | `components/ts/maintenance/work-order/` (Create): `WorkOrderMaintenancePanel.vue`, `PanelServiceRow.vue`, `ServiceContentsCard.vue`, `AddServiceAction.vue`, `AddServiceDialog.vue`, `addServiceToast.ts`, `panelRowActions.ts`, `panelState.ts` | Mounted from `components/shared/vehicle-info/VehicleCard.vue` (a legacy path, but the file is already `<script lang="ts" setup>`, so no migration is needed) |
| Step after invoicing | `components/ts/maintenance/invoicing/` (Create): `MaintenanceInvoiceStepDialog.vue`, `InvoiceStepServiceRow.vue`, `useMaintenanceInvoiceStep.ts`, `invoiceStepDiff.ts` | Mounted from `components/ts/billing/Invoice.vue` (already `<script lang="ts" setup>`) |
| Origin column | `pages/WorkOrders.vue` (Modify), `components/ts/work-orders/WorkOrdersBoardModel.ts` (Modify), `components/ts/maintenance/work-order/MaintenanceOriginCell.vue` (Create) | Unconditional column (FD-213); `applyColumns` falls back to the default for a key missing from saved prefs (`WorkOrders.vue:1118`) |
| Send reminder | `components/ts/maintenance/worklist/SendReminderButton.vue`, `SendReminderDialog.vue`, `ReminderPreviewTable.vue`, `AddContactEmailDialog.vue` (Create); `components/shared/SendEmailDialog.vue` (Modify, additive: `listAllContacts` prop, `contact-no-email` slot, FD-223; NFR-F111); placed in Plan 1's `ContactCard.vue` `#actions` slot by `MaintenanceRemindersTab.vue` (Modify) | `ContactCard.vue` itself is unchanged |
| API | `api/maintenance/{MaintenanceModel,index,keys,queries,invalidation}.ts` (Modify, Plan 1 files) | A35–A41, A43, A44, plus the modified A30 and A33. No new module; **A45** in `api/companies/{index,CompaniesModel,queries}.ts` (contacts belong to the companies domain) |
| Copy | `components/ts/maintenance/shared/copy.ts` (Modify) | Panel, step, send and origin strings, including the copied-work (i) of S16-R21 and the invoiced text of S16-N7 |

### 2.7 Plan 1 components reused unchanged (FE)

| Plan 1 component | Plan 2 use | Requirement |
|---|---|---|
| `enrolment/EnrolmentDialog.vue` (`mode="workOrder"`) | Panel "Enroll in Schedule" | S16-R11, S7-R1 (third entry point) |
| `compliance/CertificateRecordDialog.vue` + `CertificateFields.vue` + `certificateDates.ts` (Start/End dates as days; Plan 1 P2 as revised) | Panel "Add record"; certificate section of the step | S16-R10, S8-R5, S18-R16, S18-E4 |
| `readings/ReadingDialog.vue` (`workOrderId?`) | Not mounted on the WO (S16-R12: the card opens no reading dialog). The inline VehicleCard inputs are the WO's reading entry; a row's Needs-reading hint focuses them (FD-226) | S16-R12, S16-N1 |
| `completion/MarkCompleteDialog.vue` (`preselectedWorkOrderId`) + `OrgWorkOrderPicker.vue` | Panel row menu (before lines are added) or the row's button (after) → Mark complete with this WO already chosen | S16-R17, S18-R1, S18-R2 |
| `completion/ResetDateField.vue` (+ the offer-chip rule of `resetDateDefaults.ts`; the `offers` and `disable` props are provided by Plan 1 P6) | The editable date on each step row. Its initial value is A38 `proposedResetOn`, the server's proposal for that completion (`proposalBasis` `lines_closed`, `invoice_date` or `carried`); the lines-closed and invoice dates are only offered beneath the field | S18-R13, S18-R14, NFR-117 |
| `shared/DueBadge.vue`, `DueCell.vue`, `ConfidenceMeter.vue`, `formatDue.ts` | Panel rows | S16-R4, S16-R5, S16-R6 |
| `worklist/ContactCard.vue` (`#actions` slot) | Holds `SendReminderButton` | S14-R4..R12 |
| `components/ts/shared/HoverCard.vue`, `ResponsiveActionMenu.vue`, `QueryState.vue`, base dialogs `fullscreenOnPhone` | Panel hover, row menu, load/error; step dialog | S16-R7, NFR-F08, NFR-F10 |
| `shared/useMaintenanceWorkOrderActions.ts` | `createWorkOrder(row, 'wo_panel')` for the "new work order" destination | S17-R1 |
| `composables/useMaintenanceAccess.ts` | Every gate (permissions only, Plan 1; no flag) | — |

**Existing app component modified (not Plan 1):** `components/shared/SendEmailDialog.vue` (already `<script lang="ts" setup>`; 5 components mount it directly, R215). The changes are additive (FD-223, NFR-F111).

`MarkCompleteDialog` types its `service` prop as `ServiceRowDto | WorklistRowDto`. To pass it without a cast or a change,
the panel row DTO is a **superset of `ServiceRowDto`** (EQ-9).

**Plan 1 seam request (EQ-10).** `ResetDateField` and `CertificateFields` render fixed test ids
(`input_maintenance_reset_date`, `maintenance_reset_date_offer_*`, `input_maintenance_certificate_*`). The step renders N
instances of each. Plan 1 adds an optional `idSuffix` prop (P2 on `CertificateFields`, P6 on `ResetDateField`): absent,
the ids stay byte-identical (EQ-10, resolved). The step passes `idSuffix = _${id}`; as a fallback, E2E scopes those
locators inside `maintenance_invoice_step_row_${id}`.

### 2.8 Query keys and invalidation (FE, extends Plan 1 `api/maintenance/keys.ts`)

```ts
// api/maintenance/keys.ts (Modify): new keys nest under asset(vehicleId), so Plan 1's
// invalidateMaintenanceForAsset(vehicleId) already refreshes the panel and the step (no signature change).
workOrderPanel: (vehicleId: UUID, workOrderId: UUID) => [...maintenanceKeys.asset(vehicleId), 'wo-panel', workOrderId] as const,
serviceContents: (vehicleId: UUID, enrolledServiceId: UUID) => [...maintenanceKeys.asset(vehicleId), 'contents', enrolledServiceId] as const,
invoiceStep: (vehicleId: UUID, workOrderId: UUID, invoiceId: UUID) => [...maintenanceKeys.asset(vehicleId), 'invoice-step', workOrderId, invoiceId] as const,
nextDuePreview: (vehicleId: UUID, enrolledServiceId: UUID, resetOn: DateString) => [...maintenanceKeys.asset(vehicleId), 'next-due-preview', enrolledServiceId, resetOn] as const,
// Merge note: A39 also takes the step row's `completion_id` (backend contract, EQ-5); it is fixed per step row, so the key above stays unique within a step.
```

- Add Service to this WO also invalidates `workOrderKeys.lines(woId)` and `workOrderKeys.detail(woId)`, and calls the
  injected `fetchWorkOrder`. The canned lines and the WO note (S17-R5, `notes_count`) then show up without a reload.
- The panel uses `staleTime: 0`, `refetchOnMount: 'always'`. A split (Q5) navigates to the new WO, which mounts a new
  key, and going Back remounts the old one. No split-specific FE code is needed.
- A43 key: `reminderPreview: (vehicleId: UUID, companyId: UUID) => [...maintenanceKeys.asset(vehicleId), 'reminder-preview', companyId] as const`.
- Undo/Remove (A44) invalidates the panel only (the lines stay, S16-R25); it also calls `fetchWorkOrder` so the WO stays honest.
- A45 (Add email) invalidates `companyKeys.detail(companyId)` (the dialog's contacts) and `maintenanceKeys.worklist()` (`customerHasEmail`).
- Rule kept from Plan 1 (NFR-F05): every Plan 2 mutation's `onSuccess` calls `invalidateMaintenanceForAsset`.

### 2.9 Gating (FE)

| Surface | Shown when | Actions gated by |
|---|---|---|
| Panel | `cardType === 'workOrder'` && `workOrder.vehicle?.id` && `!isHistoryMode` && `permissionService.canView('workOrders')` (S16 prerequisite); then A35 decides: `organizationHasSchedules === false` with no enrolment and no record → nothing renders (S16-N8). With no enrolment and no record, the panel shows only when `canEditCustomerSide` (its only offer is Enroll) | Add Service (dialog) → this WO: `permissionService.has('workOrderLinesCreateAndEdit')`, the bundle that gates New Line and the canned-line add today (`WorkOrderNavBar.vue:65`, `LineDialog.vue`); the BE gate is the one `create-from-canned-line` uses (TD-123); → new WO: `access.canCreateWorkOrder`. Undo/Remove: `workOrderLinesCreateAndEdit`. Mark complete (menu or row button), Add record, Enroll, Undo complete: `access.canEditCustomerSide`. Needs-reading hint: a button only when VehicleCard's input is editable, text otherwise (FD-226). A technician with view only sees rows read-only |
| Step after invoicing | `props.type === 'workorder'` && A38 returns anything. No other permission: anyone who reached invoice creation can invoice (S18-N7). A38 is skipped when the cached A35 says no schedules (FD-224) | — |
| Origin column | Always in the columns array (no conditional spread) | Link when `permissionService.has('settingsService')` (schedules are org-wide), else plain text (S22-R2) |
| Send reminder | `access.canEditCustomerSide` (hidden otherwise, S14-R10) && `row.contact.contactId` (S14-N4) && `row.customerHasEmail` (S14-R13, S7-R20) | Disabled with reason only when `maintenanceNotifications === false` (S14-R9, N1). Never disabled for having nothing due (S19-R7); no send switch (D29) |

There is no feature flag (D27). For an org with no active schedule: the panel renders nothing, the invoice step is skipped
synchronously when the cached A35 says so (FD-224, NFR-F112), and the Origin column is present but empty. Every other
existing behavior is unchanged (NFR-F101).

### 2.10 Diagram (FE)

```
WorkOrder.vue (provide workOrder, company, fetchWorkOrder, restrictActionStatuses)
 └ WorkOrderLeftSection ─► VehicleCard (cardType=workOrder)
      └ [async, v-if gate] WorkOrderMaintenancePanel ── useWorkOrderPanelQuery (A35)
           ├ PanelServiceRow × n ── DueCell/DueBadge (P1) · HoverCard(P1) ► ServiceContentsCard (A36, lazy)
           │    ├ AddServiceAction ─► AddServiceDialog (A36 preview; this WO: A37 → toast Undo (A44) │ new WO: A33 'wo_panel')
           │    ├ row button: Mark complete once added (S16-R17) ► MarkCompleteDialog(P1, preselectedWorkOrderId)
           │    └ ResponsiveActionMenu (P1): Mark complete (before add) / Remove (A44) / Add record ► CertificateRecordDialog(P1) / Undo complete (A29)
           └ Enroll in Schedule ► EnrolmentDialog(P1, mode=workOrder)

Invoice.vue initCreateInvoiceImpl() success  ◄── header Create invoice / … menu / lines bulk bar / Finance toolbar /
 │                                                completion wizard / clock-out-and-complete / review (all via createInvoice())
 ├ stepDone = maintenanceStep.run(workOrderId, invoiceId)   (A38; resolves at once when the cached A35 says no schedules / nothing to show / error)
 ├ [async] MaintenanceInvoiceStepDialog ─ InvoiceStepServiceRow × n (ResetDateField P1, A39 preview) · CertificateFields P1 → A40
 └ afterStep(() => displayPayInvoiceDialog(...))            (payment dialog opens when the step closes)

pages/WorkOrders.vue ── column maintenanceSchedule ► MaintenanceOriginCell (listing row .maintenanceOrigin)
MaintenanceRemindersTab (P1) ─ ContactCard (P1) #actions ► SendReminderButton (A30.lastSentAt, A30.customerHasEmail)
                                                            ► SendReminderDialog ► SendEmailDialog (shared; A43 preview, A41 send)
                                                                                 ► AddContactEmailDialog (A45)
```

---

## 3. Technical Decisions

### 3.1 Settled decisions (planning record)

Settled before the halves were written (these override anything older). D0 approves the split, D7 the cross-workplace reads, D28 the shared feature branch (Plan 1; D19 superseded); D23–D26 (2026-10-04, copied from Plan 1) record the PRD edit of 2026-10-02 (org-wide schedules, no backlog flag, copied work, certificate days).

| ID | Decision | Decided by | Choice and reason |
|---|---|---|---|
| D0 | Plan split (APPROVED 2026-10-02) | user | Plan 1 'Track, act, clear' = all of Chunk 1 + S10/S11/S12 + Mark complete (S18-R1..R7,R9-R12,R17,R18) + Create work order from a row with line append (S16-R19,R20,N4,N6,N7; S17-R2,R5-R8) + automatic reset at invoicing (date = lines closed, else invoice date; no visible step) + origin stored (S22-R1) + contact card without Send. Plan 2 'The work order and the customer' = WO maintenance panel (S16), add to existing WO (S17-R1), editable step after invoicing (S18-R8,R13-R16,E2), Send reminder (S19, by hand), Origin column (S22-R2..R4), WO split handling. No Plan 3 (automatic sending deferred to v2, PRD 2026-10-02). — Both planners independently converged. Calendar-first rejected (meter dates would jump later; Plan 2 reopens every Plan 1 surface). Split-by-page not viable. Approved by user. Because both plans release together (the third intake directive), Plan 1's interim seams (automatic reset with no step, no Send reminder) are internal only — Plan 1 and Plan 2 merge to `develop` together from one feature branch (D28); no shop sees Plan 1 alone; they are not Product questions. |
| D1 | Due-date storage | user | Sync projection — User answer 2026-10-02; worklist sort/page/tiles need a stored column; PRD requires immediate recalculation |
| D2 | Readings | agent | asset_meter_reading log table in VehicleService/Vehicles; captured where a value is ENTERED (≈11 entry points) with idempotency key + architecture test on setter callers, never via a column listener (copies would duplicate); one-time historical load from work_order + work_order_imported; WO reading dated by invoice date, else WO start (consistent with S11-R24) — BE planner risk #1; DQ3 sizing |
| D3 | BE permission gating | agent | Settings endpoints gated on ROLE_ORGANIZATION::CREATE_AND_EDIT (read: ROLE_WORK_ORDER::VIEW) through a MaintenanceAccessGate modelled on InspectionTemplateAccessGate (atom guards only; no flag guard since D27); customer-side on ROLE_CUSTOMER/ROLE_VEHICLE atoms; WO creation on ROLE_WORK_ORDER::CREATE_AND_EDIT. No new atoms. — Honors "no new permission" and the Settings>Service convention; settingsService bundle already includes ORG_CE |
| D4 | Audit mechanism | agent | entity_event with new MR entity types (+ communication_note for S21-R2); not audit_log — audit_log is purged at 90 days, skips CLI, separate DB — violates S21-R6 |
| D5 | Certificate attachment storage | agent | New compliance attachment entity on Shared FileStorage/S3Storage with a PDF+image mime policy; FE picker built on useNoteAttachmentPicker — DVI photo pipeline is image-only and FK-bound to inspections |
| D6 | Customer notification setting | agent | company.maintenance_notifications BOOLEAN NOT NULL DEFAULT 1 (existing rows true) + dedicated single-field endpoint + entity_event audit — Full-form customer save overwrites ~15 fields and emits customer_updated accounting outbox row |
| D7 | Cross-workplace reads (Golden Rule Exemption) | user | Approved where the PRD explicitly asks for cross-location data; anything unclear goes to Product. Explicit today: worklist org-wide (S13-R1 'organization wide, not location specific', S13-R28); Mark complete work-order picker 'from any location in the organization' (S18-R2); completion travels across the org (S18-R12). Always OrganizationDecorator, never cross-org; recorded as Golden Rule Exemptions block in each PR. — User answer 2026-10-02 |
| D8 | FE server state + tab mechanism | agent | TanStack useTableQuery composables; worklist tab on Customers via ?tab= query key; one shared usePageSearchUrlSync("customers"); worklist opts out of subscribeToLocation — app/AGENTS.md forbids new Vuex server state; ?tab= is lighter than child routes |
| D9 | Location precedent | agent | **Superseded by D23** (PRD 2026-10-02: schedules are org-wide). Was: maintenance_schedule.workplace_id NOT NULL as a scope (inspection_template precedent). The NOT NULL survives as `home_workplace_id` (data, not scope) |
| D10 | Shared UI gaps | agent | Generalize AccountingQueryState into a shared query-state component; add a declared maximized prop path for phone dialogs; hover card = ScheduleBlock rendering + ReportInfoIcon trigger set (tap/focus) — Key Decisions require these and none exist app-wide |
| D11 | Line close date | agent | Plan 1 fixes UpdateLineData/ChangeCommandHandler not stamping end_date (+ test over all five closing paths) so reset and Mark complete can propose "lines closed" — Small, unblocks S18-R3 default; FE assumed Plan 2 — BE fix is one line |
| D12 | Invoice reset hook | agent | Listener on synchronous InvoiceCreatedEvent must never throw (catch + log + Sentry); reset failure must not roll back an invoice — InvoiceCreatedEvent runs inside the invoicing transaction |
| D13 | Create work order from a row | agent | One atomic BE command (create WO in estimate + append the service lines + write link/note/audit), not N browser calls; Invoice row action only navigates to the WO invoicing, never arms the invoice shortcut (credit-hold/approval guards) — N HTTP calls today; guard bypass risk |
| D14 | Projection contents | agent | Projection stores every candidate per service (for Other triggers), per-meter usable-readings flag, winning trigger, row location (last visit workplace incl. imported), and the enrolment customer; status/confidence/today derived at read time with "today" from the header workplace timezone on the BE — FE + BE planners |
| D15 | Bulk writes | agent | Set-based synchronous writes for bulk enrolment and archive (largest single customer fleet ≈1,152 assets); no async job in Plan 1 — Avoids a user-visible background state |
| D16 | Flag name | user (Product Q4, 2026-10-05) | **Superseded by D27: no feature flag.** The feature ships to every organization when the branch is released; gating is by permission only |
| D17 | No FKs to vehicle/company/work_order | agent | History tables carry organization_id and plain ids; unlink/delete/merge handled by listeners/commands — Hard deletes, customer delete fires no event, S21-R6 |
| D18 | Backlog suppression flag | agent | **Superseded by D24.** Was: written at enrolment in Plan 1 (S7-R9) though only the Plan 2 email reads it |
| D19 | Release sequencing | user | **Superseded by D28** (shared feature branch). Readings capture and the historical load ship in that release; the load runs after its deploy |
| D20 | BE additions from Plan 1 drafting | agent | Readings in own module VehicleService/MeterReadings; event-path tables written via DBAL; invoice listener on Invoicing IntegrationEvent InvoiceCreatedEvent inside a savepoint, catch-all, kill switch MAINTENANCE_INVOICE_RESET_ENABLED; new EntityEventWriter (existing recorder flushes UoW + needs a user); enrolled-service copies as JSON fields; WOs created from a row copy the asset mileage (Q13 ✅, Plan 1 TD-14); nightly projection refresh for the sliding 24-month reading window (new Terraform schedule); CompanyDeleted event subscribed for customer delete — the Plan 1 backend half |
| D23 | Org-wide schedules with a home location (2026-10-04) | Product (PRD 2026-10-02) | Schedules belong to the organization (S1-R1, S7-R1). `maintenance_schedule.home_workplace_id NOT NULL` = the header workplace at the first Save, never changed afterwards; a duplicate keeps it (S6-E5). Renamed from `workplace_id` so no reviewer reads it as a scope. Reads are org-scoped (GR-6); the home's canned lines are read from any location (GR-7); only users with access to the home location change lines (S4-R9, TD-31). Supersedes D9 |
| D24 | No backlog-suppression flag (2026-10-04) | agent | S7-R9 now says only "enrolment never sends anything" and S7-N3 is deleted; the only reader was Plan 2's automatic job, deferred to v2. No column, no computation. If v2 needs "was due at enrolment" it replays the engine at `enrolled_at` from data already kept (initial anchor, completions, readings), or adds the column then with a backfill. Supersedes D18 |
| D25 | Copied work at a non-home location (2026-10-04) | Product (PRD 2026-10-02) | At a location other than the schedule's home, Create work order (and Plan 2's Add Service) copies the work: name, description, hours and tech time as new lines at the local labour type and rate (a home line with no labour type stays without one, so it is not priced; #26, #29); no prices, fixed prices, parts, adjustments or inspection links; one internal line note per line (S13-R30, S16-N6, S16-R22, S16-R23). TD-32 |
| D26 | Certificates as days (2026-10-04) | Product (PRD 2026-10-02) | Certificates carry a Start date and an End date (days). End = Start + term; Start = End − term; valid through End; overdue from End + 1 (S8-R10, S8-E2, S12-R4). Replaces effective/expiry months. TD-33 (Chunk 1 Q15 answered: same day number, month-end clamped, S8-R10) |
| D27 | No feature flag (Product Q4, 2026-10-05; Plan 1) | user + Product | Nothing checks `MaintenanceReminders`; every MR endpoint is gated by its permission atom only; the FE gates by permission only. Full text in Plan 1 |
| D28 | Release through one shared feature branch (Plan 1) | user | Branch `feature/SV-3780-maintenance-reminders` from `develop`; every phase PR (P0–P7, then Q1–Q6) targets it; QA tests the branch build; one PR takes it to `develop`, then the next regular release. Weekly `develop` merges. The formal E2E coverage pass runs once, on the branch → `develop` PR. Full text and branch hygiene in Plan 1 D28, BR18–BR21 and §4.3 rule 8 |
| D29 | Legal send switch (✅ decided 2026-10-05 by the user) | user | **Dropped in both plans.** No `MAINTENANCE_REMINDER_EMAIL_ENABLED`, no `maintenance.reminder_email_enabled`, no A32′ `manualSendAvailable`, no `ReminderSendingUnavailableError`, no FE hidden-until-switch state. The footer ships as specified in S19-R15; legal (postal address, unsubscribe) is a non-blocking fast follow (Chunk 2 #31 ✅ 918945793) and holds neither the branch nor the release. NFR-118 / TD-40 (sink or allowlist) stay: environment safety, not a release toggle. Supersedes TD-121, NFR-103's switch, EQ-7, EQ-8 |

### 3.2 Backend technical decisions (TD)

| ID | Decision | Choice and reason |
|---|---|---|
| TD-101 | Module placement | All in Plan 1's `VehicleService/Maintenance`; reminder code under `Domain/Model/Reminder`, `Application/{Command,Query,Handler,Service}/Reminder`, `Infrastructure/Mail`. One port in WorkOrders for the list column. No new Doctrine mapping prefix (Plan 1 `VehicleService_Maintenance` already covers `Domain\Model`) |
| TD-102 | Panel read model | A35 reads the projection rows of the WO's vehicle (all enrolments, every workplace: GR-1) and maps them through `ServiceRowAssembler`, which Plan 2 creates itself in Q1 by extracting `GetAssetMaintenanceQueryHandler`'s row mapping (Plan 1 has no assembler), so `PanelRowDto` is a strict superset of A24 `ServiceRowDto` (EQ-9). Panel-only fields (fold, next service, line summary, blocked reason, addressed) are added by `WorkOrderPanelRowsBuilder`, a pure Application service unit-tested without a database. "Today" = Plan 1 `MaintenanceToday` (header workplace) |
| TD-103 | Add services to this WO (A37) | One `Transactional` command over `enrolled_service_ids[]` (≥1, ≤20) calling Plan 1 `AppendServiceLinesToWorkOrder::append($wo, $services, CreatedVia::WoPanel)` once, so S17-R8 dedupe spans the whole request. Guards before any write: WO not invoiced/paid (S16-N7), each service active, has canned lines (S16-R9), not already linked open on this WO, and no live link on another WO (Plan 1's one-live-link rule, `LiveWorkOrderExistsError`). **No location guard: a non-home WO gets copied work (Plan 1 TD-32, S16-N6, S16-R22, S16-R23).** One failing guard rejects the whole request (409). The response adds `copied: bool` and `services[]: {enrolledServiceId, linesCount}` for the toast (S16-R25) |
| TD-104 | Invoice reversal (all paths) | The undo is in **Plan 1 P6** (amendment: TD-29, NFR-022, `reset_basis`/`undone_reason` columns). Plan 2 Q3 adds only the carried user date, the VOID reconciliation (S18-E3, #27) and the step's empty/409 behaviour (3a) |
| TD-105 | Step correction model | A date change never updates `reset_on` in place (NFR-111): `ServiceCompletion::correctTo($date, $by)` creates a new `invoice`-path completion (same WO, invoice, anchors; `reset_basis = user`, `proposed = 0`, `confirmed_at` set), undoes the old one with `undone_reason = corrected`, moves the covered completions the same way, and points the link's `reset_completion_id` at the new one. Untick = undo with `undone_reason = unticked` + link `unticked`; re-tick = a new completion from the posted date. A row posted unchanged = `confirmed_at/by` set, `proposed = 0`. Lower bound: a corrected date may not precede the service's previous effective completion (400), so cycle replay stays monotonic. Rejected: in-place update with an audit row (loses the replayable history Plan 1 TD-26 relies on) |
| TD-106 | How the FE gets the step | A dedicated GET (A38) keyed by `invoice_id`, read after invoicing. The invoice create response (`processCreate()`, shared with the Public API and the sandbox seeder) is not touched. A reversed, removed or voided invoice yields empty arrays, so a stale dialog can never write (A40 also answers 409 `InvoiceNoLongerExistsError`). Matches the FE half, EQ-3 |
| TD-107 | Reading from the WO (S16-R12) | No new endpoint. The WO's reading is entered through the existing `POST /api/work-orders/change-mileage` / `change-engine-hours` (S16-R12, PQ-2 accepted); Plan 1 P3 captures a value entered or changed on this WO as In the shop (Plan 1 TD-34) and recomputes; Plan 1 TD-35 settles it. The panel is refetched after the save |
| TD-108 | In-shop reading and "just became due" (S16-E1; settled, PQ-1 ✅) | Plan 1 keeps an In-the-shop reading out of the rate. The engine uses the latest live in-shop value of the vehicle **only as the current meter position** (a meter trigger whose threshold the in-shop value has reached becomes due today; an `At` reading passed by it becomes overdue), never for the rate, usable pairs or the confidence age (S11-R24 intact). Implementation: Plan 1 `DbalReadingHistory` also returns the latest in-shop value per meter; `DueDateResolver` takes `max(estimatedPositionToday, inShopValue)` as the position. Applies everywhere the projection is read (panel, tab, worklist), because there is one projection. No parameter (the former `maintenance.in_shop_position_enabled` is removed as dead configuration) |
| TD-110 | Mark complete from a WO shows on that WO (S16-R13, R18, S17-E2) | Plan 1 `MarkServiceCompleteCommandHandler` (A28, `path = work_order`): when the WO has no open `lines` link for the service, it now writes a link `path = mark_complete`, `state = reset`, `created_via = wo_panel`, `reset_completion_id` = the new completion. `UndoCompletionCommandHandler` (A29) sets such a link to `undone` (a `lines` link it had marked reset goes back to `open`, as Plan 1 already does). No wire change to A28/A29. `mark_complete` links never count as origin (TD-112) and are never listed in the step (S18-R8). A `mark_complete` link's completion is also the trigger for `WorkOrderReadingSettler` (Plan 1 TD-35): A28 records that WO's readings, A29 re-settles them |
| TD-111 | "This WO or a new one" (S17-R1; PQ-7 ✅) | On the panel only, chosen inside the Add Service modal (FD-209): A37 (this WO) or A33′ with `created_via = wo_panel` (new WO). The worklist and the asset tab keep Plan 1's Create/Open work order. Accepted by Product (#7). An open-WO picker for the worklist (asset's open, uninvoiced WOs at the schedule's location) is a follow-up of size M if Product wants it |
| TD-112 | Origin (S22-R2..R4, E1) | **Supersedes Plan 1 TD-16** (which derived origin from `created_via IN ('worklist','asset')`): origin is derived from the link table, never stored on `work_order`. Origin of a WO = the **earliest** link on it with `path IN ('lines','no_lines')` **and `state <> 'removed'`** (an Add Service undone by mistake is not an origin, S16-R25), whatever its `created_via` (`worklist`, `asset`, `wo_panel`; so `wo_panel` counts); an A37 (Add Service) link counts (S22-R1), so adding a service to an existing WO marks an origin and never replaces an earlier one (S22-E1). `mark_complete` links never count (S22-N3). Column: one page-bounded query through the port after the page is fetched (the `getLineCounts()` pattern), page-bounded and indexed, always run (NFR-108, TD-41c). Filter `maintenanceOrigin = 1`: an `EXISTS` on `maintenance_work_order_service` (`mwos__work_order_id_state_idx`) appended by the adapter only when the filter is present. **Value (S22-R4):** a true aggregate, not the page total. When the request carries `totals=1`, A42′ adds `pagination.filteredTotals: {workOrderCount: int, totalWorkOrderPrice: int\|null}` over **all** rows matching the current request: tab/status, type, search, every filter including `maintenanceOrigin`. Query shape: `ListingQueryHandler::filteredTotals()` rebuilds the list through the same `buildQuery($query)` (so the same `WorkplaceDecorator::decorateQuery('wo.workplace_id')`, `FilterDecorator`, `SearchDecorator` and origin `EXISTS`), replaces the select with `wo.id, wo.total_price`, adds `GROUP BY wo.id` (neutralises any join fan-out), drops ORDER BY and LIMIT, and wraps it: `SELECT COUNT(*), COALESCE(SUM(t.total_price), 0) FROM (<inner>) t`, with the inner parameters bound. Tenant scoping: the header workplace through the decorator (as the list), and the `EXISTS` binds `mo.organization_id` from `OrganizationDecorator`; never cross-workplace, never cross-org. The value is each WO's whole `wo.total_price` (S22-R4: not only the lines a service added), the same value the Total price column shows, converted with the same `FixedDecimal2 … x100ValueToInt()`; `totalWorkOrderPrice` is `null` when `allowPricing` is false (count still returned). Runs only when `totals=1` is sent, so the unfiltered list is unchanged (NFR-108); the existing per-page `pagination.totalWorkOrderPrice` is left exactly as it is (NFR-109). Shown by FD-214 |
| TD-113 | WO split | `MoveMaintenanceLinksOnWorkOrderSplitSubscriber` (DomainEventSubscriber on `WorkOrderSplitted`) inside the split transaction, after the lines were flushed. Rule NFR-114; `removed` links are ignored (positive state list: only `open` links move). DBAL only, in a savepoint, catch-all + log (NFR-110), so maintenance can never fail a split. Partial moves keep the link on the original: `ResetDateProposal` reads close dates by line id, which survive a move, and "resets once" (S18-R8) forbids two live links |
| TD-115 | Sender and Reply-To (S19-R16..R18, N8) | `TemplatedEmail`, From `"<org>" <REPLY_EMAIL_SENDER>` (`$replyEmailSender` injected from `%env(REPLY_EMAIL_SENDER)%`, not read from `$_SERVER` in new code), the exact form of `InvoiceStatusUpdatedToSentActions` and `EmailOrderCommandHandler`. **Reply-To = the user who pressed Send**; BCC to that user when `include_bcc` (S19-R17, R18, N8). Signature = user first/last name, org name, header-location telephone (`WorkplaceDecorator` + org-scoped `workplace` read); no telephone → no call to action (S19-R21) |
| TD-118 | Window and state (S19-R5..R7) | **Rewritten by TD-37**: `ReminderStage` keeps `state()` only (Coming up (today < due) / Due today (= due) / Past due (> due)). `inWindow()` and the use of reminder rows for the email are removed |
| TD-120 | Transport | Synchronous `MailerInterface::send()` inside the A41 request, as invoices and purchase orders; no rate limiter, no async job |
| TD-121 | Switching the send on | **Deleted** (D29, 2026-10-05). No container parameter, no env var, no A32′ field, no `ReminderSendingUnavailableError` |
| TD-122 | Manual send content (S14-R4, R6, S19-R5..R9) | One email for one (vehicle, company); items per **TD-37** (the worklist's rows for the pair, else the next two as `coming_up`; both empty → `nothingScheduledLine` replaces the opening line and the table, S19-R23). Any guessed date, every Low estimate included → "Soon", never confidence wording (S11-N1, S19-R9 as revised, 918913025). Recipients = `email_list` (validated, deduped, 1–30); `contact_ids` name the ticked contacts (each a contact of that company whose email is in `email_list`) for the greeting (S19-R19, in the order sent) and the log. **No 60-second resend guard** (dropped 2026-10-04: the dialog's SV-8519 latch already stops double submits, invoice and PO sends have no server guard, and a quick second send to a forgotten contact is legitimate; "Last sent" is the PRD's guard against deliberate repeats, S14-R12). No `NothingToRemindError`: Send reminder is never disabled for having nothing due (S14-R13) |
| TD-123 | Permissions (no new atoms, NFR-113) | A35 and A36: `ROLE_WORK_ORDER::VIEW` (WV, S16 prerequisite; A36 also serves the asset-tab hover, so its guard accepts WV or CV). A37: the existing add-canned-line gate, verified in code: `create-from-canned-line` calls `denyAccessUnlessGranted(ROLE_WORK_ORDER_CREATE_AND_EDIT, $workOrder)` (`WorkOrders/Application/Line/CreateFromCannedLine/CreateController.php:27`); with the `unanimous` decision strategy (`security.yaml:295`) the role atom and the subject voter `OrganizationAwareVoter` (WO in the user's org) must both grant. A37 does the same through a new `MaintenanceAccessGate::guardWorkOrderLinesCreate(WorkOrder)`. The FE shows "Add to this work order" on `workOrderLinesCreateAndEdit`, the bundle that shows New Line today; that bundle carries WO view + WO create-and-edit (`FEPermissionMappings.php:155-166`), so FE and BE agree. As with New Line, `workOrdersCreateAndEdit` alone also carries the atom: such a user is not shown the destination yet is allowed by A37, the same as the existing canned-line add (S17-N1). A38, A39, A40: `InvoiceCreateVoter::INVOICE_CREATE` through `guardInvoiceStep()` (TD-39, S18-N7). A45: `ROLE_CUSTOMER::CREATE_AND_EDIT` (TD-38). A41 and A43: CE (S14-R10). A44: the A37 gate (WC with the WO as subject). All through Plan 1 `MaintenanceAccessGate` (new guards `guardWorkOrderView()`, `guardWorkOrderOrCustomerView()`, `guardInvoiceStep()`; atoms only, D27) |
| TD-124 | Non-production email delivery (NFR-118) | → **TD-40**. Outside production, every maintenance email (A41, through `SymfonyReminderMailer`) is delivered only to a mail sink or an explicit recipient allowlist, never to a real customer address: staging and QA data are cloned from production. Required before the branch build is deployed to any non-production environment. Decided in review of the E2E pass (testability note B-1) |
| TD-125 | Undo/Remove (S16-R25) | A44 sets the service's `open` `lines`/`no_lines` link on this WO to `removed` (audit `maintenance_work_order_service` / `removed`). Lines and the WO note are untouched (S16-N4). 409 `WorkOrderInvoicedError` once the WO is invoiced or paid; 409 `ServiceAlreadyResetError` when the link is `reset` (Mark complete on this WO or invoicing; Undo complete first; S16-R25 as revised, #28); 409 `NothingToRemoveError` without an open link. The toast's Undo calls the same endpoint. A removed link resets nothing at invoicing and is excluded from the step (A38), `addressed` (A35), origin (TD-112), the worklist WO column, `hasLiveWorkOrder` (so Create work order is available again) and the split (TD-113), all through positive state lists. `InvoiceReversalReverter` is unchanged (Remove is refused after invoicing). Re-adding later re-attaches the surviving lines and appends only the missing ones (S16-R25, #25) |
| TD-126 | Send dialog contract (agreed with FE 2026-10-04) | The FE wraps `components/shared/SendEmailDialog.vue` (FD-222/223). **The BE renders the email body**: greeting, the user's `email_content` (the S19-R2 wording as prefilled from A43 `content`, possibly edited; HTML-escaped, `nl2br`, NFR-119), the asset's reminder table, the call to action, the invoice-style signature and the footer. What the dialog shows is a preview: the greeting by the same S19-R19 rule from the ticked contacts, A43 `content` prefilled in the editable box (`initialContent`, S19-R4), the dialog's fixed `message` paragraph hidden (`message=""`), A43 `items` read only in the `#after-content` slot, and A43 `callToAction` read only beneath. The FE sends `contact_ids`, never a greeting string, so the logged body is the single source of truth. Contacts come from A16 (`companyQueryOptions`), **all of them**; a contact without an email is listed (S19-R3); Add email calls A45, then refetches A16. A43 does not repeat them. When A43 `nothingScheduledLine` is set, the preview and the email show it in place of the table |
| TD-37 | Email content (S19-R5..R9, S14-R13) | One predicate builder, `WorklistPredicates` (extracted in Plan 1 P7 from `DbalWorklistFetcher`), serves the worklist **and** the email. Email items for one (vehicle, company) = the rows the worklist shows for that pair with a date: not skipped, not resting (TD-36), compliance only with a record, `due_on ≤ today + 91`. That covers overdue, due today and due within 91 days. A Needs readings row beyond 91 days is not carried (S19-R6 lists the three states only). **Fallback:** when that set is empty, the two earliest dated services of the pair (not skipped, compliance with a record; resting rows included), each with state `coming_up` (S19-R7). `ReminderStage::inWindow()` and the use of reminder rows for the email are removed. `ReminderStage::state()` stays (Past due / Due today / Coming up). If both sets are empty (only no-record compliance, or every service skipped), A43 returns `items: []` and `nothingScheduledLine: "Nothing is scheduled for {unit} yet."`; A41 still sends, the table replaced by that line. **There is no `NothingToRemindError`** (reconciled 2026-10-05). A43 also returns `content` = that line, so it replaces the S19-R2 opening line in the prefilled box, and the composer renders no table; the call to action, signature and footer stay (S19-R23, Chunk 2 #30 ✅ 918945793). Items are ordered by due date; the fallback is never empty for a pair with any dated service |
| TD-38 | Add email onto a contact from the send dialog (S19-R3) | New endpoint **A45** `PATCH /api/customers/{companyId}/contacts/{contactId}/email` in `Customer/Contacts` (the module that owns the contact), canonical layout. Gate `ROLE_CUSTOMER::CREATE_AND_EDIT`: verified as the gate of the existing contact edit `POST /api/contacts/change` (`src/Customer/Contacts/Application/Change/ChangeController.php:15-16`), and the same atom S14-R10 already requires to send. Not `contacts/create`'s "CE **or** WC" expression (`Create/CreateController.php:19-22`): that exists so a WO user can add a contact inline while creating a WO; this edits an existing contact, which is CE-only today. Tenant check: non-nullable `#[MapEntity] Company` (organization) plus the contact's `company_id` = the route company, else 404 (the same check `ChangeCommand` makes). **Add only:** 409 `ContactAlreadyHasEmailError` when the contact already has an email, so this never becomes a second, unaudited edit path. Validation: `NotBlank`, `Email`, max 255 (`CustomerEmail.orm.xml` length), plus `CustomerEmail::isValid()`. `Transactional`: `Customer::setEmail()`, `CustomerFactory::update()`, dispatch the existing `CustomerUpdatedEvent`, so the customer-portal webhook `customer.updated` fires exactly as for the contact form (`CustomerPortalWebhookSubscriber`). **Accounting parity (verified 2026-10-05):** A45 emits exactly what `contacts/change` emits and nothing more. `Contacts/Application/Change/ChangeCommandHandler.php` saves the contact through `CustomerFactory::update()` (a plain repository save) and dispatches `CustomerUpdatedEvent`, whose only subscriber is `CustomerPortalWebhookSubscriber`; it writes **no** accounting outbox row. `customer_updated` is recorded only by the company-level writers (`Customer/Customers/Application/Change|Create/*CommandHandler.php`, the OpenAPI customer create/update controllers, onboarding). Yet `CustomerSnapshotBuilder::resolveContactEmail()` and `CustomerUpdatedPayloadBuilder` read the authorizer contact's email, else the first contact's, so adding an email to that contact changes the accounting customer email without an event, the same as the contact form does today (R2-17). The hub side (`../shopview-accounting`) was not checked. **Audit:** `entity_event` through Plan 1's `EntityEventWriter`, new type `CUSTOMER_CONTACT`, event `email_added`, old `null` / new address, refs contact + company, workplace = header (TD-09). Application logs carry ids only. Rejected: reusing `contacts/change`. It is a full-form overwrite of about ten fields (the masked-echo bug class), the dialog does not hold the contact form, and it writes no audit. Precedent for a single-field endpoint: D6/A15 |
| TD-39 | Who sees the step after invoicing (S18-N7) | A38, A39, A40 are gated by `InvoiceCreateVoter::INVOICE_CREATE` (`ROLE_INVOICE::CREATE_AND_EDIT`, never the default office user; `src/Invoicing/Invoice/Infrastructure/Security/InvoiceCreateVoter.php`), the gate of `POST /api/invoices/create`. A new `MaintenanceAccessGate::guardInvoiceStep()` delegates to it. The CE gate is removed. A40 still creates and corrects completions and compliance records: the PRD says the step "needs no other permission, because it only confirms when the work was done" |
| TD-40 | Non-production delivery without a release toggle | Before the branch build is deployed to any non-production environment with cloned data, that environment must deliver Maintenance mail only to a sink or an allowlist. If ops has no environment-wide sink, `SymfonyReminderMailer` honors `MAINTENANCE_REMINDER_RECIPIENT_ALLOWLIST` (comma list; empty in production = no restriction; non-empty = drop and log every other address). This is an environment safety guard, not a release toggle |
| TD-41 | Every organization now pays the runtime cost | (a) A35 short-circuits after one `EXISTS` on `msch__org_status_idx` when the org has no active schedule and the vehicle has no enrolment or record: p95 < 50 ms on that path. (b) A38 answers from one query on `mwos__work_order_id_state_idx`: p95 < 100 ms. The FE skips A38 when the cached A35 says `organizationHasSchedules === false` and `isEnrolled === false` (FE FD-224; **confirmed safe**: with no active schedule every enrolment is ended (archive ends them, S6-R6), so A38 would return empty arrays; the invoice reset subscriber, VOID reconciliation and reading settlement run server-side regardless; a stale cache can only skip a step whose proposals then stand, S18-N5). (c) A42′: NFR-108's "skipped when the flag is off" is replaced by "page-bounded and indexed"; p95 regression ≤ 5 % stays the bar. (d) A16 now computes `maintenance_enrolled_units_count` and `has_email` on every customer view (indexed: `menr__org_company_ended_idx`, `customer.company_id`). (e) The invoice reset subscriber and reading capture were already ungated |

### 3a. Invoice reversal: what Plan 2 adds on top of Plan 1 P6

**The reversal undo is in Plan 1 P6** (amendment: TD-29, NFR-022). That covers `POST /api/invoices/reverse-invoice`
and `POST /api/invoices/remove-customer-transaction` (the unpaid payment-dialog dismissal), both through
`InvoiceReversalService::reverse()` → `InvoiceReversedEvent` after the commit. It undoes unsuperseded invoice
completions and their covered ones (`undone_reason = invoice_reversed`), reopens the links, puts the WO's readings back
to In the shop and recomputes. It also adds the `reset_basis` / `undone_reason` columns and pins the credit-memo no-op
(S18-E3). None of that is repeated here.

Plan 2 Q3 adds:

| What | Where | Rule |
|---|---|---|
| Carry a user-entered date across reverse + re-invoice | Plan 1 `ResetDateProposal` / `ResetMaintenanceOnInvoiceCreatedSubscriber` (Modify) | When proposing for a link, prefer the latest completion of that link with `undone_reason = invoice_reversed` and `reset_basis = user`; the new completion gets `reset_basis = carried` |
| Invoice voided by adding a line (`POST /api/work-orders/lines/create` on a `PENDING` invoice, `WorkOrders/Application/Line/Create/CreateCommandHandler::updateOrSplitWorkOrder():147-160`, no event). S18-E3 (2026-10-05, #27) treats it as a reversal | Same subscriber (Modify) | At the WO's next `InvoiceCreatedEvent`, links in `reset` whose completion's invoice is `VOID` or missing are undone (`undone_reason = invoice_voided`) and re-proposed against the new invoice |
| Step after a reversal | A38 / A40 | A38 returns empty arrays for a reversed, removed or `VOID` invoice; A40 answers 409 `InvoiceNoLongerExistsError` |
| Readings on the voided/reversed path | `WorkOrderReadingSettler::settle()` (Plan 1 TD-35) | Run after the undo, so a VOID invoice no longer fixes the WO's readings unless a Mark complete does |

### 3.3 Frontend technical decisions (FD)

| # | Decision | Choice | Reason |
|---|---|---|---|
| FD-201 | Panel mount point | Inside `VehicleCard.vue`'s `q-expansion-item` body, after `FaultCodesLookupButton`, as one `defineAsyncComponent` behind a `v-if` | S16-R1 says "inside the asset card". Mounting from `WorkOrderLeftSection` would put it below the card. One additive line plus the async import. The other two hosts are excluded by `cardType` |
| FD-202 | Panel data | One read per WO (A35), rows typed `PanelRowDto = ServiceRowDto & {…}` | Lets `MarkCompleteDialog`, `DueCell` and `DueBadge` take rows unchanged. The badge count, folding, "next service" and blocked reasons come from the BE (NFR-F04) |
| FD-203 | Hover contents | Lazy A36 on first open of the `HoverCard`, cached under the asset scope | Keeps the panel read small. S16-R7 content (description, parts, inspection form) has no money (S16-R16) |
| FD-204 | Reading after an inline save | The panel watches the injected `workOrder.mileage`, `workOrder.engine_hours`, `workOrder.status_value` and `workOrder.vehicle.id`, and invalidates its key. VehicleCard's save handlers are untouched. An In the shop value makes a threshold service due at once (S16-E1, TD-108) | S16-E1 accepted. The BE recomputes in the same transaction (Plan 1 E1), so the refetch sees the new state. Rows whose `status` went from null to due show a "Now due" marker for this page visit (`panelState.ts` diff by `enrolledServiceId`) |
| FD-205 | When the step opens | **Before the payment dialog** (S18-R20). `run()` starts the moment the invoice is created. The calls to `displayPayInvoiceDialog` are wrapped in `afterStep(fn)`, which runs `fn` synchronously when no step is pending | F-2: paying calls `router.go(0)`, so a step queued after payment would be lost. The chain's `.finally` (HTML preview, `creatingInvoice`) is not delayed. When nothing is pending (FD-224 fast path, or no maintenance) the behavior is byte-identical to today |
| FD-206 | Step data | A38 GET after creation (server truth), timeout 4 s, any error resolves as "accepted" | F-1: the invoice can disappear, and the BE knows. No change to the invoicing endpoint contract (EQ-3). Never blocks invoicing (NFR-F102). Skipped by FD-224 when the cached A35 says the org has no schedule |
| FD-207 | Step writes | POST (A40) only the diff: unticked rows, changed dates, and non-empty certificate records. Confirm with no diff closes without a request. Close (X or Esc) with no edits closes. With edits, it shows `CloseConfirmationDialog` "Discard your changes? The proposed dates stay." (S18-R21) | S18-R15 and S18-N5: untouched means accepted, and the BE has already applied that (Plan 1). The diff is computed in the pure `invoiceStepDiff.ts`, against A38 `ticked` and `proposedResetOn` (so an untouched carried date is no change) |
| FD-208 | Live next due | A39 preview per row, debounced 300 ms on date change, sending the row's `completionId` as `completion_id` (backend contract, EQ-5), rendered with `formatDue` | S18-R14. FE derives no due date (NFR-F04, EQ-5) |
| FD-209 | Add Service | One "Add Service" `Button` per row opens `AddServiceDialog` (`BaseFormDialog fullscreenOnPhone`): title "Add {service}"; preview from A36 (lines with hours; parts only when `!copiesWork`, S16-R24); destination radio "This work order (#{n})" / "A new work order" (S17-R1), each shown only when permitted (S17-N1; one permitted → no radio); confirm "Add Service". Same dialog at every location. Invoiced WO: the button is replaced by the (i) of S16-N7 | S16-R8 (PQ-3 answered), R16, R24, S17-R1, N1 (verify on the Chunk 2 board, R217) |
| FD-210 | New WO from the panel | `useMaintenanceWorkOrderActions.createWorkOrder(row, 'wo_panel')` with **no navigation**. A toast "Work order {displayNumber} created for {service}" carries an Open action (with `?locationId`) | The advisor stays on the truck in front of them. Origin is recorded with `created_via: wo_panel` (S22-R1). This needs a `navigate: false` option on the Plan 1 composable, one optional parameter |
| FD-211 | Addressed state and primary action | `addressed.path` is `lines` (or `no_lines`) and not reset → the row reads "Added · {n} lines" (S16-R20) and its **button is Mark complete** (S16-R17), opening `MarkCompleteDialog` with this WO; the menu offers Remove while `addressed.removable` (S16-R25). Reset by Mark complete → "Added · {n} lines · marked complete, next due counts from {date}", no button and no Undo complete on the panel (it is undone from the asset tab, Plan 1 `serviceRowActions`, S18-R17). `path === 'mark_complete'` → "Marked complete on this work order · next due counts from {date}", menu Undo complete (`panelRowActions`: Undo complete only on the `mark_complete` path). `path === 'no_lines'` reads "Added · no lines" and follows the `lines` rules. `{n}` counts the lines the add appended, including any later deleted by hand (assumption; S16-N4). Not addressed → button Add Service, Mark complete in the menu. Collapsed header: the title "Maintenance" and a `q-badge` with `dueCount`, nothing else (S16-R2, #5); `addressedCount` is not rendered. Verify the title and badge layout against the Chunk 2 board (R217). An invoice completion arrives with `completed: null` (only `lastDone.kind: 'invoice'`), so no Undo complete is offered for it (S18-N8) | S16-R13, R17, R18, R20, R25 |
| FD-212 | Panel collapse | Collapsed on every WO open, not persisted. Expanding it is local state | S16-R1, S16-E2 |
| FD-213 | Origin column | Always in the columns array (`{name: 'maintenanceSchedule', label: 'Maintenance schedule', sortable: false, selected: true, required: false}` after `linesCount`). `applyColumns` already falls back to `defaultColumnSelected` for a key missing from saved prefs (`WorkOrders.vue:1118`), so existing preference blobs need no migration. Link cell stops row-click propagation | No flag (D27). Visible by default as S22-R2 says; an org without schedules sees an empty column it can hide |
| FD-214 | Reportability | A toggle FilterDef `maintenanceOrigin` ("From maintenance"), always present. It sends `filters[]={field: 'maintenanceOrigin', value: '1'}` (the `vehicleHere` pattern in `getFilters`) plus `totals=1`. A line above the table (and the mobile list) reads "{workOrderCount} work orders · {total} · Work order total" from `pagination.filteredTotals` (S22-R4); without `seeFinancialData()` it reads "{workOrderCount} work orders" (the amount follows the existing Total price gate) | S22-R4 as written; the existing footer total is a page sum (`WorkOrders.vue:1437`) and is not used. An org-wide, date-ranged report is a Reports-suite follow-up (S22-N3 context) |
| FD-216 | Send button states | Hidden: no CE, no preferred contact, `customerHasEmail` false (Plan 1 A30). Disabled with reason: notifications off (S14-R9, N1) only. Enabled otherwise, including when nothing is due (S19-R7: the email then carries the next two services as Coming up) and when nothing is dated at all (the S19-R23 line). After a send: toast "Reminder sent." and "Last sent {date}" from the A30 refetch. No send switch (D29) | S14-R13, S19-R7 |
| FD-217 | Split (Q5) | No FE code. Fresh keys per WO plus `staleTime: 0` | BE moves links. FE behavior is checked in the walk |
| FD-218 | Automatic email | Deferred to v2 (PRD 2026-10-02); no code in this plan | — |
| FD-219 | Copied work at a non-home location | No blocked state. The row is identical to home (S16-R21) plus an (i) `HoverCard` naming the locations: the row's `homeWorkplaceName` and the panel's top-level `workOrderWorkplaceName`; the hover card's parts heading reads "PARTS {HOME} USES (reference)" when `copiesWork`; the Add Service dialog preview omits parts when `copiesWork` (S16-R24) | S16-R7, R21, R24, N6 |
| FD-220 | Toast Undo after Add Service | `showSuccessNotification({ message: '{service} added · {n} lines', undo: { handler: () => removeService(…) } })` (Plan 1 FD-20 pattern, `button_notification_undo`); `{n}` is A37 `services[].linesCount`. Undo = A44; `handlesConflictLocally` → a 409 shows "This can no longer be undone" | S16-R25 |
| FD-221 | Remove in the row menu | Menu item "Remove from this work order" while `addressed.removable`; no confirm (nothing is deleted); toast "{service} removed from this work order. Its lines stay on it." Hidden once a lines-added row was reset by Mark complete or invoicing (Undo complete first; A44 409 is the backstop; S16-R25, #28) | S16-R25, S16-N4 |
| FD-222 | Send reminder dialog | Reuse `components/shared/SendEmailDialog.vue` through a wrapper `SendReminderDialog.vue` that supplies the customer (A16 `companyQueryOptions`, every contact), `defaultContactId` = the asset's preferred contact, the header location telephone, **`initialContent` = A43 `content`** in the editable box (S19-R4: prefilled and editable), **`message=""`** so the wording is not shown twice (FD-223 adds a `v-if="message"` guard), **`listAllContacts`** instead of the former `keepDefaultContactWithoutEmail`, and in the new `#after-content` slot the read-only reminder table (A43 `items`) or, when A43 `nothingScheduledLine` is set, no table: the box is prefilled with that line (A43 `content`) in place of the S19-R2 wording (S19-R23; Send stays enabled), followed by A43 `callToAction` read only (nothing renders when it is null, S19-R21); plus `greetContactByName`. The `#contact-no-email` slot renders `Button` "Add email" (`data-test-id-suffix="maintenance_reminder_add_email_${contact.id}"`) only when `access.canEditCustomerSide`, opening `AddContactEmailDialog` (FD-225), mounted by the wrapper as a sibling of `SendEmailDialog`. The wrapper owns the A41 call (`contact_ids`, `email_list`, `include_bcc`, `email_content`) and the latch reset (`clearData`/`closeDialog` on success, `emailSending = false` on failure, the `Invoice.vue` precedent). A41 errors (400, 409 `NotificationsOffError`, `NoPreferredContactError`; no `NothingToRemindError`, no `ReminderSendingUnavailableError`) are toasted by the interceptor | S14-R4, S19-R3, R4, R18, R19, R21; the PRD says "the existing send email dialog" |
| FD-223 | SendEmailDialog additive changes | New optional props: `greetContactByName: boolean` (default false → "Hello," exactly as today); `listAllContacts: boolean` (default false); `initialContent: string` (default ''). The fixed message `<p>` gets `v-if="message"` (all 5 direct consumers pass a non-empty `message`, so their DOM is unchanged). New slots: `after-content` (between the content box and "Best regards") and `contact-no-email` (scoped `{ contact }`, rendered in a contact row only when `listAllContacts` and the contact has no email). The `sendEmail` payload gains `contactIds: string[]` (the ticked contacts, the `defaultContactId` first when ticked, then list order). The greeting `<p>` gets `data-test-id="text_send_email_greeting"`. **`listAllContacts` true:** the table lists every `companyContacts` entry; a contact without a non-empty email renders its checkbox with `disable`, the text "No email" (`data-test-id="text_send_email_contact_no_email_${id}"`) and the slot; the default pick ticks `defaultContactId` only if it has an email and never falls back to another contact; the default pick runs **once** (first non-empty contact list), so a refetch after Add email never re-ticks or un-ticks anything. **False:** today's `contactsWithEmail` table and `watch` fallback, byte-identical. **Greeting with `greetContactByName`:** names = ticked contacts (`defaultContactId` first, then list order) as `trim(first_name + ' ' + last_name)`; 1 → "Hi {A},"; 2 → "Hi {A} and {B},"; 0 or ≥ 3 → "Hello,". Typed addresses do not change it (S19-R19; #32 ✅ 918945793). The BE renders the sent greeting from `contact_ids` by the same rule; the FE never sends a greeting string | NFR-F111, TD-126; the 5 direct consumers pass none of the new props and render unchanged |
| FD-224 | Invoice step fast path (new) | `useMaintenanceInvoiceStep.start()` first reads `queryClient.getQueryData(maintenanceKeys.workOrderPanel(vehicleId, workOrderId))`. If it exists and says `organizationHasSchedules === false` with `isEnrolled === false`, nothing is pending and `afterStep` runs synchronously (no A38). Otherwise it calls A38 as before (4 s timeout, any error = accepted). The cache entry exists whenever the WO page mounted the panel query. Confirmed safe by the BE (TD-41b) | No flag (D27): without this, every invoice with a vehicle in every shop waits on an A38 round trip before the payment dialog. Stale-cache risk is one-sided: a stale "no schedules" skips a step whose proposals then stand (S18-N5) |
| FD-225 | Add email (new) | `components/ts/maintenance/worklist/AddContactEmailDialog.vue`: `BaseFormDialog fullscreenOnPhone`, title "Add email for {first last}", one email `Input` (`data-test-id-suffix="maintenance_add_contact_email"`, the app's email rule), Save (`confirm-button-test-id="button_maintenance_add_contact_email_save"`, `:async-submit`). Receives `companyId` and the contact. Calls `useAddContactEmailMutation` (**A45** `PATCH customers/{companyId}/contacts/{contactId}/email`, `handlesValidationLocally` → inline 400 on `email`; 409 → toast "This contact already has an email." + refetch; 404 → toast). On success: invalidate `companyKeys.detail(companyId)` and `maintenanceKeys.worklist()`; the contact becomes tickable but is **not** ticked automatically (S19-R3 "so it can then be ticked"). Shown only with `access.canEditCustomerSide` (= `ROLE_CUSTOMER_CREATE_AND_EDIT`, A45's gate) | A narrow endpoint because `contacts/change` replaces every contact field (TD-38) |
| FD-226 | Needs-reading hint points to the field (new) | Per row, from the row's `due.needsReadings`: "Needs mileage reading" / "Needs engine hours reading" (`maintenance_wo_panel_needs_reading_${meter}_${id}`). When the WO's input is editable it is a link-style `Button` that emits `focus-meter: 'mileage' \| 'hours'` up to `VehicleCard.vue`, which calls `mileageInput.value?.focus()` / `engineHoursInput.value?.focus()` (refs exist at :143, :179) and scrolls it into view; when read-only it is plain text | S16-R12 "points to that field" without a second reading entry |

### 3.4 Risks and mitigations (BE)

| # | Risk | Likelihood / impact | Mitigation |
|---|---|---|---|
| R2-3 | ~~Legal: the footer for the hand-sent email~~ **Closed 2026-10-05** (#31, 918945793): the footer ships as specified in S19-R15; a postal address or unsubscribe is a non-blocking fast follow | Low / Low | The footer is a template constant, so a later legal change is small; it holds nothing |
| R2-6 | `ListingQueryHandler` regression (hot path, every shop) | Medium / High | Characterization test first (NFR-109); page-bounded enrichment; filter only when sent; origin query page-bounded and indexed; p95 measured (NFR-108) |
| R2-7 | Step correction races a later completion (Mark complete elsewhere between read and confirm) | Low / Low | 409 `LaterCompletionExistsError`; FE refetches A38 |
| R2-8 | S17-R8 dedupe cannot see canned lines added by hand (lines store only a boolean) | Certain / Low | Documented; dedupe covers every line added through Maintenance; inferring from line text is forbidden (S16-R14) |
| R2-9 | Partial split leaves the link on the original WO while some of its lines moved | Low / Low | Rule NFR-114; Mark complete covers the edge; close dates are read by line id, which survives the move |
| R2-11 | S16-E1 vs S11-R24 conflict | — | **Closed** (PQ-1 accepted; TD-108 settled, no parameter) |
| R2-13 | The voided-invoice path (line added to a `PENDING` invoice) raises no event | Certain / Low | Settled (S18-E3, #27): treated as a reversal. Reconciled at the next invoice of that WO; A38 treats `VOID` as gone; readings re-settled (Section 3a) |
| R2-14 | `WorkOrderCreatedEvent` subscribers already run inside the A33 transaction (Plan 1 R11); A37 adds lines to an existing WO the same way | Low / Low | A37 uses the same `CannedLineAppender` the existing canned-line endpoint uses; characterization tests from Plan 1 cover it |
| R2-15 | Typed addresses can send one asset's reminder to anyone (as the invoice dialog can) | Low / Low | CE gate; audit and send log with recipients; at most 30 addresses (NFR-119); one asset per message |
| R2-16 | ~~Legal answer timing~~ **Closed 2026-10-05** (#31, 918945793): legal is a non-blocking fast follow, so its timing holds neither the branch nor the release | — | None needed |
| R2-17 | A45 changes a contact's email without an accounting `customer_updated` row. Accounting reads the authorizer (else first) contact's email as the customer email (`Accounting/Outbox/Application/Service/PayloadBuilder/CustomerSnapshotBuilder.php:50-64`, same rule in `CustomerUpdatedPayloadBuilder`), and the existing `contacts/change` emits no outbox row either (verified 2026-10-05: its handler only saves and dispatches `CustomerUpdatedEvent`, whose sole subscriber is the portal webhook; `customer_updated` comes only from company-level writers) | Certain / Low | A45 emits what `contacts/change` emits (`CustomerUpdatedEvent`, portal webhook) and nothing more (TD-38). The accounting copy refreshes only on the next company-level `customer_updated` (the transactional snapshot is firstOrCreate on the consumer). Pre-existing gap, out of MR scope; raise a follow-up ticket only with the user's agreement. Core side only: the hub (`../shopview-accounting`) was not checked |
| R2-18 | The A43 fallback can show services months away, which the old rule deliberately excluded (the eleven-month example) | Certain / Low | Product's explicit choice (S19-R7, #24); labels read "Coming up" |
| R2-19 | **Long-lived shared branch drifts from `develop`** (Plan 1 BR18) and **branch migrations order against develop's** (Plan 1 BR19); **no per-organization rollback** without a flag (Plan 1 BR20); **every-org runtime cost** on A35/A38/A42′/A16 (Plan 1 BR21) | High / High | Plan 1 D28, BR18–BR21 and §4.3 rule 8: weekly `develop` merge plus a merge before each phase PR, never rebase; fresh-database migrate + `doctrine:migrations:diff` no-op after every sync; never re-timestamp an executed migration; re-run the characterization suites of shared files (`ListingQueryHandler`, `LinesDetailProvider`, the invoice reset subscriber); QA on the branch build; TD-41 budgets measured |

### 3.5 Risks and mitigations (FE)

| # | Risk | Phase | Mitigation |
|---|---|---|---|
| R201 | `VehicleCard.vue` (1067 lines) is shared by WO, part sale and imported WO, and used by every shop | Q1 | One async import, one computed, one mount gated on `cardType === 'workOrder'`, plus the ~3-line `@focus-meter` handler (FD-226). No change to the save handlers. `VehicleCard.spec.ts` asserts absence for the other two card types and an unchanged DOM when A35 says no schedules. `e2e-precheck` on the file. Walk a part sale and an imported WO |
| R202 | `Invoice.vue` (2262 lines) carries the money path: deposit auto-apply, held credit, IBS, over-discount, the payment dialog, rollback on dismiss | Q3 | About 20 additive lines. `afterStep()` runs synchronously when nothing is pending; FD-224 keeps orgs without schedules synchronous. Every existing `Invoice.spec.ts` case stays green, plus the ordering and fast-path cases. The step never throws and has a 4 s timeout (NFR-F102). The `useAsyncAction` latch and `.finally` are untouched |
| R203 | Invoicing guards bypassed | Q3 | The step is opened only from `initCreateInvoiceImpl`'s success. Nothing new arms `useInvoiceCreationIntent`. The worklist Invoice action stays navigation only (Plan 1 FD-15) |
| R204 | Payment-dialog dismissal reverses the invoice after the step applied corrections (F-1) | Q3 | BE responsibility (Plan 1 P6). FE re-reads A38 per invoice and keeps no local copy |
| R205 | The page reload after payment loses UI state (F-2) | Q3 | The step opens before the payment dialog (FD-205) |
| R206 | Dialog stacking: the pin-note warning opens after the chain while the step is open | Q3 | Today it already stacks with the payment dialog. Both are confirm-style dialogs. Walked on a pinned-note customer |
| R207 | Multi-instance test ids from Plan 1 `ResetDateField` / `CertificateFields` | Q3 | EQ-10 resolved: Plan 1 P2/P6 add the `idSuffix` prop; row scoping is the fallback |
| R208 | Mobile: the panel is reachable only after "Show details" on <md | Q1 | ⏸ PENDING PQ-6 (Product): phone layout not final. Build the stacked layout behind "Show details" as an interim and expect a change (rows stack, HoverCard becomes a sheet, menus become action sheets, NFR-F108) |
| R209 | Stale panel after inline edits, Add Service or invoicing | Q1–Q3 | FD-204 watcher, keys nested under `asset(vehicleId)`, `staleTime: 0` |
| R210 | (Moot since 2026-10-05) the column was flag-conditional | Q4 | Always present (FD-213) |
| R211 | The Plan 1 composable `useMaintenanceWorkOrderActions` changes signature | Q2 | An optional third parameter with a default keeps every Plan 1 call site unchanged. The existing spec stays green |
| R212 | (Moot since 2026-10-02) A link to a schedule at another location would 404 | Q4 | Schedules are org-wide; the link is gated only on `settingsService` |
| R213 | Hover cards on hybrid devices | Q1 | The Plan 1 `HoverCard` contract, unchanged |
| R214 | E2E reference breakage on VehicleCard, finance, lines and work-orders pages | all | No existing id changes. With no flag every existing spec meets the additions: R-Q3-1 and R-Q3-5 are real re-runs on the branch. Test orgs now run with the feature live (Section 7 conventions). The coverage pass runs once, on the branch → `develop` PR (D28) |
| R215 | `components/shared/SendEmailDialog.vue` is mounted directly by 5 components (Invoice.vue invoice/estimate, OrderItems.vue + AddOrderDialog.vue PO, UnpaidTransactionsStatements.vue, AccountingCustomerStatementDialog.vue), each passing `message`; `UnpaidTransactionsTable.vue` and `PartSale.vue` only mention it in comments and pass data to children that mount it. It has an exposed-ref contract (`clearData`, `closeDialog`, `emailSending`) | Q6 | Additive only (FD-223): `listAllContacts`, `greetContactByName` and `initialContent` default off; the `contact-no-email` slot renders only under `listAllContacts`; existing `SendEmailDialog.spec.ts` + `UnpaidTransactionsStatements.spec.ts` + `Invoice.spec.ts` green; walk an invoice send and a PO send; `e2e-precheck` on the file (E2E `send-invoice-email.dialog.ts` reads `dialog_send_email`, `button_send_email`) |
| R216 | Undo races the toast timeout or a concurrent invoice | Q2 | A44 409 handled locally; panel refetch; Remove stays in the menu as the fallback |
| R217 | Add Service dialog vs design: the PRD names "the standard" Add Service modal without describing it | Q2 | Build per FD-209 and check against the Chunk 2 board before Q2 starts; layout-only changes after that |
| R218 | A35 is now requested on every WO open of every shop | Q1 | A35 fast path for orgs without schedules (TD-41a); NFR-107 p95 measured on an org without schedules as well as on the seeded one |
| R219 | The S18-R9 "Closed {date}" caption is visible on every completed line in every shop | Q3 | Additive text with its own test id; line-row readers in E2E re-run (R-Q3-5) |
| R220 | Branch drift on shared files: `VehicleCard.vue`, `Invoice.vue`, `pages/WorkOrders.vue`, `SendEmailDialog.vue`, `WorkOrderLineRow.vue`/`WorkOrderLineCard.vue`, `WorkOrdersBoardModel.ts`, plus Plan 1's list | all | Weekly merge of `develop` into the branch (merge, never rebase), gates and `e2e-precheck` on these files after each merge; `Invoice.vue` changes kept in one contiguous block for easy conflict resolution; a conflict in a characterization-pinned behavior is re-recorded deliberately, never silently updated to green |
| R221 | Add email writes customer data from inside the send dialog | Q6 | A45 never overwrites an existing email (409); CE gate on both sides; the contact form's other fields are untouched |

---

## 4. Database Changes

Two new tables and three additive columns on Plan 1 tables (the completion columns `reset_basis`/`undone_reason` are Plan 1 P6). No change to `work_order`, `work_order_line`, `invoice`,
`vehicle`, `company`, `entity_event`. Every table: `binary_uuid` ids, `organization_id NOT NULL`, utf8mb4/unicode_ci,
InnoDB; DBAL-written tables carry the four audit-stamp columns filled by the repository (Plan 1 rule). New index aliases
(checked unused in `src/` and `migrations/`): `msend`, `msendi`.

### New tables / Modified tables

#### 4.1 New tables

**`maintenance_reminder_send`** (Q6). Mapping `Maintenance/Infrastructure/Persistence/Repository/Doctrine/ReminderSend.orm.xml`;
written by `DbalReminderSendRepository`.

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| organization_id | BINARY(16) NOT NULL | |
| vehicle_id | BINARY(16) NOT NULL | no FK (NFR-002) |
| company_id | BINARY(16) NOT NULL | no FK (NFR-002) |
| workplace_id | BINARY(16) NOT NULL | header location whose telephone was used (also the audit workplace) |
| recipients | JSON NOT NULL | `[{contactId\|null, name\|null, email}]`: each `email_list` entry, named when it matches a ticked contact |
| bcc_sender | TINYINT(1) NOT NULL DEFAULT 0 | `include_bcc` |
| greeting_name | VARCHAR(255) NULL | the names greeted per S19-R19 ("Dave Brabay" or "Dave Brabay and Lisa Brabay"); NULL → "Hello," |
| subject | VARCHAR(255) NOT NULL | |
| body_html | MEDIUMTEXT NOT NULL | rendered message as sent (S19-R14) |
| template_version | VARCHAR(16) NOT NULL | e.g. `2026-10.1` |
| sent_at | DATETIME NOT NULL | UTC |
| sent_by | BINARY(16) NOT NULL | the user who pressed Send |
| audit stamps | | |

One row per hand send, immutable once written; the row and the transport call share one transaction (NFR-101).
Index: `msend__org_vehicle_company_sent_idx (organization_id, vehicle_id, company_id, sent_at)` (A30′ `lastSentAt` for
the page's ≤ 50 pairs).

**`maintenance_reminder_send_item`** (Q6). Mapping `ReminderSendItem.orm.xml`.

| Column | Type | Notes |
|---|---|---|
| id | BINARY(16) PK | |
| send_id | BINARY(16) NOT NULL | hand FK `maintenance_reminder_send_item__send_id_fk` → `maintenance_reminder_send(id)` ON DELETE CASCADE |
| organization_id | BINARY(16) NOT NULL | |
| enrolled_service_id | BINARY(16) NOT NULL | no FK (history outlives enrolments) |
| unit_label, service_name | VARCHAR(160) / VARCHAR(120) NOT NULL | snapshot |
| state | VARCHAR(16) NOT NULL | `coming_up`, `due_today`, `past_due`; `coming_up` also marks the S19-R7 fallback items |
| due_on | DATE NULL | |
| due_label | VARCHAR(32) NOT NULL | "October 2026", "14 Oct 2026" (certificate), "Soon" (Low) |
| created_at, created_by | | |

Index: `msendi__send_id_idx (send_id)` (FK backing). Last sent reads the header table.

#### 4.2 Columns added to Plan 1 tables

| Table (Plan 1) | Column | Phase | Why |
|---|---|---|---|
| `maintenance_service_completion` | `reset_basis`, `undone_reason` | **Plan 1 P6** (amendment) | Not added here; Plan 2 only writes the extra values `user`, `carried` (basis) and `corrected`, `unticked`, `invoice_voided` (reason), no schema change |
| `maintenance_service_completion` | `confirmed_at DATETIME NULL`, `confirmed_by BINARY(16) NULL` | Q3 | S18-R15 confirmation recorded |
| `maintenance_compliance_record` | `source_work_order_id BINARY(16) NULL` + index `mcrec__source_work_order_id_idx` | Q3 | One record per compliance service per WO (S18-E4); a re-confirm corrects instead of duplicating |

#### 4.3 Illustrative DDL (the implementer hand-writes the migrations from this)

```sql
CREATE TABLE maintenance_reminder_send (
    id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    organization_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    vehicle_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    company_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    workplace_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    recipients JSON NOT NULL,
    bcc_sender TINYINT(1) NOT NULL DEFAULT 0,
    greeting_name VARCHAR(255) DEFAULT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html MEDIUMTEXT NOT NULL,
    template_version VARCHAR(16) NOT NULL,
    sent_at DATETIME NOT NULL,
    sent_by BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    updated_by BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    INDEX msend__org_vehicle_company_sent_idx (organization_id, vehicle_id, company_id, sent_at),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;

CREATE TABLE maintenance_reminder_send_item (
    id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    send_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    organization_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    enrolled_service_id BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)',
    unit_label VARCHAR(160) NOT NULL,
    service_name VARCHAR(120) NOT NULL,
    state VARCHAR(16) NOT NULL,
    due_on DATE DEFAULT NULL,
    due_label VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    INDEX msendi__send_id_idx (send_id),
    PRIMARY KEY (id),
    CONSTRAINT maintenance_reminder_send_item__send_id_fk FOREIGN KEY (send_id)
        REFERENCES maintenance_reminder_send (id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;

ALTER TABLE maintenance_service_completion
    ADD COLUMN confirmed_at DATETIME DEFAULT NULL,
    ADD COLUMN confirmed_by BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)',
    ALGORITHM=INSTANT;

ALTER TABLE maintenance_compliance_record
    ADD COLUMN source_work_order_id BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)', ALGORITHM=INSTANT;
CREATE INDEX mcrec__source_work_order_id_idx ON maintenance_compliance_record (source_work_order_id) ALGORITHM=INPLACE LOCK=NONE;
```

#### 4.4 Migration rules

1. Plan 1's rules 1–7 (Plan 1 section 4.3) apply unchanged: hand-written migrations, `getDescription()`, a `down()`
   that drops what `up()` created (never run in prod), every index named identically in XML and SQL, the diff gate
   (`doctrine:migrations:diff --allow-empty-diff` → "No changes detected", with the targeted-introspection fallback
   for the known expression-index trip); no feature flag exists.
2. One migration per phase that adds schema: Q3 (`confirmed_at/by`, `source_work_order_id`), Q6 (send + item
   tables).
3. `CREATE INDEX … ALGORITHM=INPLACE LOCK=NONE` uses the space-separated suffix; `ALTER TABLE … , ALGORITHM=INSTANT`
   uses the comma (`tests/Unit/Architecture/MigrationOnlineDdlSyntaxTest.php`).
4. Hand FK `maintenance_reminder_send_item__send_id_fk` is added to
   `api/src/Shared/Infrastructure/Doctrine/Schema/ExpressionIndexFilteringMySQLSchemaManager.php`
   `MANUALLY_MANAGED_FOREIGN_KEYS`, backed by `msendi__send_id_idx` declared in `ReminderSendItem.orm.xml`.
5. New columns are mapped in the Plan 1 XML files (`ServiceCompletion.orm.xml`, `ComplianceRecord.orm.xml`) in the same PR.
6. Branch migration rules: Plan 1 §4.3 rule 8, D28 and BR19. Name migrations at implementation
   time and never re-timestamp one already executed on the QA database; after every `develop` sync run the fresh-database
   migrate + diff gate; before the branch → `develop` PR re-check that `msend`/`msendi`/`mcrec` aliases are still unused.
7. A45 needs no schema change (`entity_event.entity_type` is `VARCHAR(255)`, `EntityEvent.orm.xml:8`; `customer.email` exists).

### Data migrations (4.5)

None. No production organization has Maintenance data before the release that carries the branch, so the new columns
start NULL and fill as the features write.

---

## 5. API Changes

Conventions from the Plan 1 contract apply unchanged: internal envelope `{"data": …}`; camelCase response keys;
request keys may be snake_case; 400 for request validation and plain `DomainError`, 403 atom, 404 unknown or
foreign id, 409 for errors extending `ConflictError`; no 422; dates `YYYY-MM-DD`, months `YYYY-MM`, datetimes ISO 8601
UTC; no money field anywhere (NFR-115). Gates: WV `ROLE_WORK_ORDER::VIEW`, WC `ROLE_WORK_ORDER::CREATE_AND_EDIT`,
CV `ROLE_CUSTOMER::VIEW`, CE `ROLE_CUSTOMER::CREATE_AND_EDIT`; every route calls its `MaintenanceAccessGate` guard first.

**Alignment with the FE half.** The ids, paths and field names below follow the frontend half's API assumptions (A35–A41, A43, A44, A45, A30′,
A33′, A42′; **10 new + 4 modified = 14** (A45 new 2026-10-05; A32′ deleted by D29, A29 changed in Plan 1); A43/A44 and the A41 reshape agreed 2026-10-04). Where the backend adds or differs, the "vs FE" column says so, and the
backend shape is the contract (Appendix).

### New endpoints

#### 5.1 Endpoints

| Id | Method + path | Request | Response | Gate | Phase | Errors | vs FE |
|---|---|---|---|---|---|---|---|
| A35 | GET `/api/work-orders/{workOrderId}/maintenance` | — | `{vehicleId, companyId, isEnrolled, hasComplianceRecords, dueCount, needsReadings: ('mileage'\|'hours')[], rows: PanelRowDto[]}`. Top level also carries `organizationHasSchedules: bool` (≥ 1 active schedule in the org, S16-N8) and `workOrderWorkplaceName: string` (same for every row, S16-R21). `PanelRowDto` = A24 `ServiceRowDto` & `{coveredServiceNames[], lineCount, hours, hasCannedLines, isNextService, homeWorkplaceId, homeWorkplaceName, copiesWork: bool (home ≠ WO workplace, S16-R21), addServiceBlockedReason: 'invoiced'\|null, addressed: {path: 'lines'\|'no_lines'\|'mark_complete', linesCount, completionId\|null, resetOn\|null, removable: bool}\|null}` (`linesCount` = the lines the add appended, including any later deleted by hand; assumption, S16-N4). `removable` = an `open` `lines`/`no_lines` link and the WO not invoiced/paid (S16-R25); `addressed` is null for a `removed` link. Lines and summaries are read from the schedule's home workplace (GR-7). Rows ordered: due rows by due date (overdue first), then next-service rows; a WO without a vehicle returns `isEnrolled: false`, empty rows. **Short-circuit (TD-41a):** with `organizationHasSchedules = false` and no enrolment or record for the vehicle, the handler returns after that one `EXISTS`: `{organizationHasSchedules: false, isEnrolled: false, hasComplianceRecords: false, rows: [], dueCount: 0, needsReadings: []}`. `completed` (A24 shape) is set only when the latest effective completion is a Mark complete (`work_order`/`elsewhere`); invoice, covered and enrolment completions show only through `lastDone` | WV | Q1 | 404 WO not in the org/workplace (non-nullable `#[MapEntity] WorkOrder`, as `WorkOrderHistoryViewRequestDto`); 403 atom | **Changed 2026-10-05**: `addressedCount` removed (S16-R2 badge alone); fast path. Earlier (2026-10-04: `copiesWork`, `homeWorkplace*`, `removable`, `organizationHasSchedules` agreed; `workOrderWorkplaceName` at the top level, a BE counter). BE adds: `addressed` is also set for an `unticked` lines link (`linesCount` kept), so the FE can say "added, not reset" |
| A36 | GET `/api/maintenance/enrolled-services/{id}/contents` | — | `{lines[]: {name, description, hours, parts[]: {partNumber, description, quantity}}, inspectionForm: {id, name}\|null}`; lines deduped by canned-line id, in Add Service order; deleted canned lines omitted; parts always returned, never prices; lines and parts read from the schedule's home workplace (GR-7). Also serves the Add Service modal preview (S16-R24; the FE hides parts when the row `copiesWork`) | WV or CV | Q1 | 404 | Matches. Several canned lines may each link an inspection template; the BE returns the first by line order (S16-R7 says "the inspection form") |
| A37 | POST `/api/work-orders/{workOrderId}/maintenance/services` | `{enrolled_service_ids: UUID[]}` (1–20, distinct) | 201 `{linesAddedCount, linesSkippedAsDuplicateCount, copied: bool, services[]: {enrolledServiceId, linesCount}}`; at a non-home WO the lines are copied work (Plan 1 TD-32); `services[].linesCount` feeds the toast "PM-A added · 4 lines" (S16-R25) | WC with the WO as subject (as `create-from-canned-line`, TD-123) | Q2 | 400 empty / over 20 / duplicates; 404 a foreign or unknown id (whole request); 409 `WorkOrderInvoicedError` (S16-N7), `EnrolmentEndedError`, `NoCannedLinesError` (S16-R9), `ServiceAlreadyOnWorkOrderError`, `LiveWorkOrderExistsError` (open link on another WO); 400 `enrolled_service_ids` when a service belongs to another vehicle | Matches; BE adds the 20 cap and two 409 reasons |
| A38 | GET `/api/work-orders/{workOrderId}/maintenance/invoice-step` | `invoice_id` (required, `Assert\Uuid`) | `{invoiceId, invoicedOn, services[]: {enrolledServiceId, completionId, linkId, name, scheduleName, reason: {scheduleName}, coveredServiceNames[], ticked, proposedResetOn, proposalBasis: 'lines_closed'\|'invoice_date'\|'carried', resetOn, linesClosedOn\|null, nextDue: DueDto}, complianceServices[]: {enrolledServiceId, name, complianceType, termMonths, currentRecord: Record\|null, recordFromThisWorkOrder: bool}}`, where `Record` is the Plan 1 A17 Record (`startDate`, `endDate` as days). Empty arrays when the invoice is reversed, removed or `VOID`, when no service was added (S18-N5), for Mark-complete resets (S18-R8), for orphaned links (S18-R18) and for links `removed` by Undo/Remove (S16-R25) | `InvoiceCreateVoter::INVOICE_CREATE` (TD-39, S18-N7) | Q3 | 404 WO; `invoice_id` of another WO → empty (never another WO's data) | **Changed 2026-10-05** (gate). BE adds `linkId`, `proposalBasis`, `recordFromThisWorkOrder` |
| A39 | GET `/api/maintenance/enrolled-services/{id}/next-due-preview` | `reset_on` (required, ≤ today in the header workplace), `completion_id` (optional; the A38 row's `completionId`, replaced by the hypothetical completion) | `{nextDue: DueDto, coveredServices[]: {enrolledServiceId, name, nextDue: DueDto}}` | `InvoiceCreateVoter::INVOICE_CREATE` (TD-39) | Q3 | 400 future or malformed date; 404 | **Differs:** BE needs `completion_id` from the step row; without it the existing proposed completion (often later) would win the replay and the preview would ignore the edited date. BE adds `coveredServices` (S18-R7) |
| A40 | POST `/api/work-orders/{workOrderId}/maintenance/invoice-step` | `{invoice_id, services[]: {enrolled_service_id, ticked, reset_on}, certificates[]: {enrolled_service_id, compliance_type, certificate_number?, start_date?, end_date?, term_months}}` (dates as days), diff only; both arrays may be empty but not both | 200 `{updatedCount, untickedCount, certificatesCreatedCount, certificatesCorrectedCount}` | `InvoiceCreateVoter::INVOICE_CREATE` (TD-39) | Q3 | 400 `errors[{field: 'services[i].reset_on'}]` (future, or before the previous effective completion), certificate rules (`CertificatePeriod`), unknown `enrolled_service_id` for this invoice; 409 `LaterCompletionExistsError` (superseded), `InvoiceNoLongerExistsError` (reversed, removed or void) | Matches; BE adds `certificatesCorrectedCount` (a certificate posted again for a service whose record came from this WO corrects it) and the lower-bound rule. `compliance_type` is sent (the certificate fields per S8-R2 and S18-R16, as Plan 1 A18): the FE prefills it from the service, and the BE answers 400 `errors[{field: 'certificates[i].compliance_type'}]` when it differs from the enrolled service's compliance type |
| A41 | POST `/api/maintenance/reminders/send` | `{vehicle_id, company_id, contact_ids: UUID[], email_list: string[] (1–30, every address the dialog emitted: ticked contacts + typed), include_bcc: bool, email_content: string (≤ 5,000)}` | 201 `{sendId, sentAt, recipients: string[], servicesCount}`. One message to every address (`to(...$emailList)`), From the org name over `REPLY_EMAIL_SENDER`, Reply-To the user, BCC the user when `include_bcc`; the BE renders the body (TD-126) | CE | Q6 | 404 vehicle/company not in org or not linked, or no active enrolment for the pair; 400 empty `email_list`, an invalid address, a `contact_ids` entry that is not a contact of this company or whose email is not in `email_list`; 409 `NotificationsOffError` (S14-R9), `NoPreferredContactError` (S14-N4); 400 `ReminderSendFailedError` (transport; nothing logged, NFR-101). No `ReminderJustSentError` (the 60 s guard is dropped), **no `NothingToRemindError`** (S14-R13; the #30 case sends with the "Nothing is scheduled" line), **no `ReminderSendingUnavailableError`** (D29). Items per TD-37. Greeting from `contact_ids` **in the order sent** (the FE sends the preferred contact first when ticked, then list order); name = `trim(first_name . ' ' . last_name)`; 1 → "Hi A,", 2 → "Hi A and B,", 0 or ≥ 3 → "Hello,"; typed addresses ignored (S19-R19; #32 ✅ 918945793) | **Changed 2026-10-05** (errors, greeting). **Reshaped 2026-10-04** with the FE names (`contact_ids`, `email_list`, `include_bcc`, `email_content`; `recipients: string[]`). BE added: 1–30 addresses; each `contact_ids` email must be in `email_list`; 409 `NoPreferredContactError` |
| A43 | GET `/api/maintenance/reminders/preview` | `vehicle_id`, `company_id` (both required) | `{subject, content: string, callToAction: string\|null, items[]: {enrolledServiceId, unitLabel, serviceName, dueLabel, state: 'past_due'\|'due_today'\|'coming_up'}, nothingScheduledLine: string\|null, locationTelephone: string\|null}`. `items[]` per TD-37: the worklist's rows for the pair (overdue, due today, due within 91 days), else the pair's next two dated services as `coming_up`; empty only when the pair has no dated service at all, and then `nothingScheduledLine` = "Nothing is scheduled for {unit} yet." (S19-R23), otherwise null. `content` = the fixed S19-R2 wording only (prefilled in the editable box, FD-222); when `nothingScheduledLine` is set, `content` = that line instead, so it replaces the opening line and the table (S19-R23). The call to action is **not** inside `content`: it comes back as `callToAction` (null when the header location has no telephone, S19-R21), so editing the box cannot delete it and the BE applies S19-R21 when rendering. `dueLabel` is BE-built: month, a day for a certificate, "Soon" for any guessed date, Low included, no confidence wording (S19-R9, S11-N1). No contacts (the FE reads A16) | CE | Q6 | 404 as A41 | **Changed 2026-10-05** (item selection, `nothingScheduledLine`). New 2026-10-04, FE need agreed with a BE counter (`callToAction` split out of `content`) |
| A44 | DELETE `/api/work-orders/{workOrderId}/maintenance/services/{enrolledServiceId}` | — | 204; the link → `removed`; lines and the WO note untouched (TD-125) | WC with the WO as subject (as A37) | Q2 | 404 foreign WO or service; 409 `WorkOrderInvoicedError` (invoiced/paid), `ServiceAlreadyResetError` (reset by Mark complete or invoicing, S16-R25), `NothingToRemoveError` (no open link) | **New 2026-10-04**, agreed as specified |
| A45 | PATCH `/api/customers/{companyId}/contacts/{contactId}/email` | `{email: string}` (`NotBlank`, `Email`, ≤ 255) | 200 `{contactId, email}`; dispatches `CustomerUpdatedEvent` (portal webhook `customer.updated`); audit `entity_event` `customer_contact` / `email_added` | `ROLE_CUSTOMER::CREATE_AND_EDIT` (TD-38) | Q6 | 400 `errors[{field: 'email'}]` invalid; 404 company not in the org, or the contact is not a contact of this company; 409 `ContactAlreadyHasEmailError` (never overwrites) | **New 2026-10-05** (S19-R3 Add email). Path per the BE (validates both links); FE `companiesApi.addContactEmail(companyId, contactId, {email})` |

### Modified endpoints

#### 5.2 Modified endpoints

| Id | Endpoint | Change | Consumers to re-verify | vs FE |
|---|---|---|---|---|
| A30′ | GET `/api/maintenance/reminders` (Plan 1 `DbalWorklistFetcher`) | Each row gains `lastSentAt: string\|null` only (latest hand send for that (vehicle, company), read by one query over the page's ≤ 50 pairs on `msend__org_vehicle_company_sent_idx`). `customerHasEmail` moved to Plan 1 A30 (P7); **`hasReminderItems` removed** (S14-R13: never disabled for having nothing due). `lastSentAutomatic` is dropped (nothing automatic in v1) | Worklist (FE) | **Changed 2026-10-05** |
| A32′ | GET `/api/maintenance/reminders/meta` (Plan 1) | **Deleted** (D29): no `manualSendAvailable`; Plan 1's meta is unchanged by Plan 2 | — | **Changed 2026-10-05** |
| A33′ | POST `/api/maintenance/enrolled-services/{id}/work-orders` (Plan 1 `CreateWorkOrderForEnrolledServiceCommandHandler`) | `created_via` accepts `wo_panel` (Plan 1 reserved `CreatedVia::WoPanel`) | Panel (FE) | Matches |
| A42′ | GET `/api/work-orders` (`WorkOrders/Application/List/ListingQueryHandler.php`) | Each row gains `maintenanceOrigin: {scheduleId, scheduleName}\|null` (no `workplaceId`: schedules are org-wide and open from any location, GR-6; origin excludes `removed` links; origin also from A37 links, S22-R1; never from `mark_complete`, S22-N3). `filters[]` accepts `{field: 'maintenanceOrigin', value: '1'}` (EXISTS on an origin link). New optional query param `totals=1`: `pagination` gains `filteredTotals: {workOrderCount, totalWorkOrderPrice\|null}` over every row matching the request, not the page (TD-112); absent → no extra query and no new key. `pagination.totalWorkOrderPrice` is unchanged (still the page sum) | Every WO list consumer: the Work Orders page, the board, saved filters, any E2E snapshot of this response; part-sale rows (`type=parts`) always get `null` | Matches |
| A28 (internal) | POST `/api/maintenance/enrolled-services/{id}/completions` (Plan 1) | No wire change. With `path = work_order` and no open `lines` link on that WO, the handler also writes a `mark_complete` link (TD-110), and records that WO's readings dated the Reset date (Plan 1 S18-R19, TD-35); the asset's own `mileage` / `engine_hours` columns are not changed | Mark complete modal (asset tab, worklist, panel) | — |
| A29 (Plan 1, changed) | DELETE `/api/maintenance/completions/{id}` (Plan 1) | Sets a `mark_complete` link `undone`. 409 `CompletionNotUndoableError` for invoice completions (S18-N8); the panel's Undo complete appears only on `mark_complete` rows (FD-211). With `path = work_order` it re-settles that WO's readings (Plan 1 TD-35): back to In the shop unless the WO has a live invoice or another effective Mark complete On it; values are never changed, and the asset's own `mileage` / `engine_hours` do not change | Same | **Changed 2026-10-05** |
| A24 (internal) | GET `/api/vehicles/{vehicleId}/maintenance` (Plan 1) | No wire change; benefits from TD-108 (settled); `completed` is set only for Mark complete completions, so invoice completions show no Undo (S18-N8) | Asset tab | — |
| `POST /api/invoices/reverse-invoice`, `POST /api/invoices/remove-customer-transaction` | No wire change; `InvoiceReversedEvent` gains a subscriber (3a) | Invoicing, the unpaid payment dialog | — |
| `POST /api/work-orders/split` (`SplitWorkOrderController`) | No wire change; `WorkOrderSplitted` gains a subscriber | Split flow | — |
| `POST /api/work-orders/change-mileage`, `change-engine-hours` | No change beyond Plan 1 | WO reading entry | — |

Gates of the modified Plan 1 reads (frontend half): A30′ keeps Plan 1's CV gate; A42′ keeps the existing WO list permission.

#### 5.3 Inbound id checks (NFR-112)

| Id | Checked against | Mechanism |
|---|---|---|
| `workOrderId` (A35, A37, A38, A40) | organization and header workplace | Non-nullable `#[MapEntity] WorkOrder` (the resolver's tenant check, as `WorkOrderHistoryViewRequestDto`) |
| `enrolled_service_ids[]` (A37) | organization; vehicle = the WO's vehicle | One `IN` query on `maintenance_enrolled_service` bound to the decorator org; `count(found) === count(distinct requested)` else 404; vehicle mismatch → 400 field error |
| `{id}` enrolled service (A36, A39) | organization | Plan 1 `findById()` with `isOrganizationEntity()` |
| `completion_id` (A39) | organization; belongs to `{id}` | DBAL lookup with both predicates; mismatch → 400 |
| `invoice_id` (A38, A40) | organization; `invoice.work_order_id` = route WO | DBAL lookup with `inv.organization_id` from the decorator; another WO's invoice → empty (A38) / 409 (A40) |
| `services[].enrolled_service_id`, `certificates[].enrolled_service_id` (A40) | the set of services linked to this WO by this invoice | One query; count check; a stranger → 400 |
| `vehicle_id`, `company_id` (A41, A43) | organization; linked; an active enrolment exists | Plan 1 `AssetOwnership::vehicleInOrganization()`, `isLinked()` + enrolment lookup |
| `contact_ids[]` (A41) | contacts of `company_id` in the org, each with an email that appears in `email_list` | `DbalCustomerEmailContactsFetcher` (org-scoped); count check; mismatch → 400 |
| `email_list[]` (A41) | format | `Assert\Email` each, 1–30 (NFR-119) |
| `workOrderId`, `enrolledServiceId` (A44) | organization and header workplace; the service's vehicle = the WO's vehicle | Non-nullable `#[MapEntity] WorkOrder`; Plan 1 `findById()` with `isOrganizationEntity()`; mismatch → 404 |
| `filters[maintenanceOrigin]` (A42′) | value `1` only | Ignored otherwise (the list's filter parser already whitelists fields) |
| `totals` (A42′) | value `1` only | Anything else → no aggregate; the aggregate reuses the list's own decorators, so it can never widen the row set |
| `companyId`, `contactId` (A45) | organization; the contact belongs to the company | Non-nullable `#[MapEntity] Company`; contact lookup by id **and** `company_id` (`CustomerRepository`); a miss → 404 |

#### 5.4 Frontend view (what the FE adopts from the contract)

The frontend half assumed the same endpoints (A43 and A44 were FE needs, adopted 2026-10-04). Where it differed, the backend shape above wins; the FE code in
Section 6 consumes these additions:
- A36 is gated WV **or** CV (it also serves the asset-tab hover); the FE gate table (Section 2.9) is unaffected.
- A37 accepts 1–20 distinct ids and can also answer 409 `NoCannedLinesError` and `LiveWorkOrderExistsError`; the
  panel sends one id per call, and 409s already refetch the panel.
- A38 rows also carry `linkId`, `proposalBasis` and `recordFromThisWorkOrder`; a `VOID` invoice also yields empty arrays (S18-E3). A38–A40 are gated by the invoice-create permission (S18-N7).
- A39 takes the optional `completion_id` (the A38 row's `completionId`), which the FE sends, and returns
  `coveredServices[]` beside `nextDue` (EQ-5).
- A40 also returns `certificatesCorrectedCount` and refuses a date before the service's previous effective completion
  with the same 400 field error the FE already maps.
- A41 takes the dialog's `contact_ids`, `email_list`, `include_bcc`, `email_content` and returns `recipients[]`; send ids
  only for ticked contacts (each one's email must be in `email_list`); 1–30 addresses. Its 400s and 409s
  (`NotificationsOffError`, `NoPreferredContactError`) and 400 `ReminderSendFailedError` are toasted by the interceptor.
  There is no `ReminderJustSentError`, `NothingToRemindError` or `ReminderSendingUnavailableError`. The greeting follows
  `contact_ids` order (preferred contact first when ticked).
- A43 supplies `content` (the box's `initialContent`, editable; `message` is passed as `''`), the read-only
  `items` table (worklist window, else the next two as Coming up), the read-only `callToAction` (null → nothing renders,
  S19-R21) and `nothingScheduledLine` (S19-R23: when set, `content` is that line and no table renders, so it replaces the opening line and the table; Send stays enabled).
- A45 adds an email to a contact that has none (Add email in the send dialog, FD-225); afterwards refetch A16
  (`companyKeys.detail`) and the worklist.
- A44 un-addresses a service (toast Undo and the menu's Remove, S16-R25).
- A35 adds `copiesWork`, `homeWorkplaceName`, `addressed.removable`, top-level `organizationHasSchedules` and top-level
  `workOrderWorkplaceName`; `addServiceBlockedReason` is `'invoiced' | null` only; **no `addressedCount`**; the fast-path
  response (`organizationHasSchedules: false`, empty rows) must type-check; `completed` is null for invoice completions.
- A30 (Plan 1) carries `customerHasEmail`; A30′ adds `lastSentAt`; A42′ `maintenanceOrigin` has no `workplaceId`.
- A42′ returns `pagination.filteredTotals` when the FE sends `totals=1` (only while the "From maintenance" filter is on, FD-214).
- A35's `addressed` is also set for an `unticked` lines link (`linesCount` kept).
- A28 (Mark complete On this WO) records the WO's readings; A29 (Undo complete) puts them back to In the shop unless the
  WO has a live invoice or another effective Mark complete On it. Neither changes the asset's own `mileage` /
  `engine_hours`, so no vehicle-detail invalidation is needed; `maintenanceKeys.asset(vehicleId)` is enough.

---

## 6. Implementation Phases

Each phase lands as its own PR (or wave) **into the shared feature branch** `feature/SV-3780-maintenance-reminders`
(Plan 1 D28), is independently testable, and leaves the branch green; `develop` is untouched until the branch merges
whole, after Plan 1's phases and QA on the branch build. Merge `develop` into the branch before each phase PR (Plan 1
D28, BR18–BR21, §4.3 rule 8). There is no feature flag and no send switch (D27, D29). Order: Q1 → Q2 → Q3 → Q4 → Q5 → Q6 (Q4 and Q5 depend only on
Plan 1 for their code and may run in parallel with Q2/Q3; Q4's E2E update Q4-U1 edits Q2's spec, so it lands after Q2).
There is no Q7 (automatic email, deferred to v2) and no Plan 3.

Backend verification gates for every phase, run on the changed files only (Plan 1's list, unchanged):

- `php tools/php-cs-fixer/vendor/bin/php-cs-fixer --config=.php-cs-fixer.php fix <changed files>`
- `vendor/bin/phpstan clear-result-cache && vendor/bin/phpstan analyse --memory-limit=3G <changed src and test files>` (files, never directories)
- `./vendor/bin/pest <new and mirrored unit tests>` and `./vendor/bin/pest <new functional tests>`; clean status line
- Migration gate where the phase adds schema: `bin/console doctrine:migrations:migrate --no-interaction`, then `bin/console doctrine:migrations:diff --allow-empty-diff` → "No changes detected"
- `bin/console lint:container` (and `--env=prod`) after any service wiring or parameter change
- Smoke: `bin/smoke-test.sh` (after a cache clear, `--warmup` first); parameterised routes (A35–A44) are not in the static curated list, so each PR pastes one manual `curl -4 http://localhost:8080/api/...` per new GET with a seeded id; any 500 blocks. Check `var/log/dev.log` (native) or php-fpm logs (docker)
- E2E: per-phase specs are written in the phase PR; the formal coverage pass (`/e2e-after-change`, the `## E2E Coverage Summary` block or the override marker) runs once, on the branch → `develop` PR (D28)

Paths in the tables are under `api/` unless they start with another top-level directory.

Frontend gates for every phase (scoped to changed files):
`npx eslint --max-warnings=0 <files>` · `npx vitest related --run
<files>` + `npx vitest run <new specs>` · `npx vue-tsc --noEmit` · `cd e2e && npx tsx scripts/e2e-precheck.ts
--files=<vue files> --pretty` · compile gate · browser-walk (QUICK_LOGIN_USERS `admin` unless stated), plus a walk of
every touched existing screen as a user without the new permission and on a WO with no maintenance link · per-phase
E2E specs in the phase PR; the coverage pass on the branch → `develop` PR.

Frontend tables list paths under `app/src/` unless they start with `app/`, `api/` or `e2e/`.

### Phase Q1: Work order maintenance panel

**Implements:** S16-R1..R7 (R7 incl. the reference parts heading), R9 (data and Mark-complete-only rows), R10, R11, R12 (existing fields; the hint points to the field, FD-226), R13 (Mark complete half), R14, R16, R17 (Mark complete in the menu before an add), R18, R20 (display), R21 (copied-work (i)), R24 (preview data, A36); S16-N1, N2, N3, N5, N6 (display: copied-work (i), S16-R21), N7 (invoiced (i)), N8 (no card without schedules); S16-E1 (TD-108, settled), E2; S7-R1 and S8-R5 (WO entry); NFR-107, NFR-112, NFR-113, NFR-115; NFR-F101, NFR-F103, NFR-F104, NFR-F105, NFR-F107, NFR-F108, NFR-F109, NFR-F112. PQ-6 (phone layout) ⏸ PENDING PQ-6 affects the phone layout only (non-blocking).

**Depends on:** Nothing in Plan 2 (first phase). The FE needs this phase's A35/A36. **Requires Plan 1 phases merged into the feature branch:** P4–P7 (backend: P4–P6, the projection, `GetAssetMaintenanceQueryHandler` (A24, from which Plan 2 extracts `ServiceRowAssembler` itself, TD-102) and the WO links; frontend: P5–P7, the asset-tab components, `MarkCompleteDialog`, `EnrolmentDialog`, `CertificateRecordDialog`, `HoverCard`, `ResponsiveActionMenu`).

#### Database changes:
None.

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/UI/HTTP/Shared/MaintenanceAccessGate.php` | Modify (Plan 1) | `guardWorkOrderView()` (`ROLE_WORK_ORDER_VIEW`), `guardWorkOrderOrCustomerView()` (atoms only, D27) |
| `src/VehicleService/Maintenance/UI/HTTP/WorkOrderPanel/GetWorkOrderPanelController.php` + `DTO/GetWorkOrderPanelRequestDto.php` | Create | A35; `#[MapEntity] public WorkOrder $workOrder` (non-nullable) |
| `src/VehicleService/Maintenance/Application/Query/WorkOrderPanel/GetWorkOrderPanelQuery.php`, `Application/Handler/WorkOrderPanel/GetWorkOrderPanelQueryHandler.php` | Create | Short-circuit first (TD-41a): with no active schedule in the org and no enrolment or record for the vehicle, return after that one `EXISTS` (no `addressedCount`). Otherwise orchestrates the fixed query set (NFR-107): WO facts, projection rows, enrolled-service JSON, canned-line summary, links on this WO, workplace names. Adds top-level `organizationHasSchedules` (org-scoped `EXISTS` on active schedules, S16-N8) and `workOrderWorkplaceName` |
| `src/VehicleService/Maintenance/Application/Service/WorkOrderPanel/WorkOrderPanelRowsBuilder.php` | Create | Pure. Sketch Q1-a: due filter, folding, next service per enrolment, `copiesWork` (S16-R21), `invoiced`-only blocked reason, addressed + `removable` (S16-R25; a `removed` link is not addressed), ordering, `dueCount` (badge, S16-R2) |
| `src/VehicleService/Maintenance/Application/DTO/WorkOrderPanel/WorkOrderPanelDto.php`, `PanelRowDto.php`, `PanelAddressedDto.php` | Create | `PanelRowDto` extends Plan 1 `ServiceRowDto` (strict superset, EQ-9) |
| Plan 1 asset-tab row assembler (`GetAssetMaintenanceQueryHandler`'s row mapping) | Modify (Plan 1) | Plan 2's own extraction (Plan 1 has no `ServiceRowAssembler`): move the projection-row → `ServiceRowDto` mapping into `ServiceRowAssembler` (Application/Service) so A24 and A35 share it; A24 output unchanged (pinned by Plan 1's A24 functional test) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderPanelFacts.php` | Create | WO `vehicle_id`, `company_id`, `workplace_id`, status (invoiced/paid) bound to `wo.organization_id`; header workplace via the MapEntity check |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalCannedLineSummaryFetcher.php` | Create | One query: `work_order_canned_line` by the union of the rows' live canned-line ids, `organization_id` + `workplace_id IN (the schedules' home workplaces)` (GR-7); returns count and `SUM(time_estimate)` per id; no price columns |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderLinksFetcher.php` | Create | Links of this WO (`mwos__work_order_id_state_idx`) with their link-line counts and completion `reset_on`; states read through a positive list (`open`, `reset`, `unticked` for `addressed`; `open` for `removable`), so `removed` never shows |
| `src/VehicleService/Maintenance/UI/HTTP/EnrolledService/GetServiceContentsController.php`, `Application/Query|Handler/EnrolledService/GetServiceContentsQuery(+Handler)`, `Infrastructure/Persistence/Query/Dbal/DbalServiceContentsFetcher.php` | Create | A36: canned lines (`description`, `time_estimate`), parts (`description`, part number, `quantity`), `inspection_template_canned_line` → template name; scoped by org and the schedule's home workplace (GR-7, read from any header location); parts always returned, price columns never selected. Also serves the Add Service modal preview (S16-R24) |
| `src/VehicleService/Maintenance/Domain/Service/DueDateResolver.php`, `Infrastructure/Persistence/Query/Dbal/DbalReadingHistory.php` | Modify (Plan 1) | TD-108 (settled, S16-E1): latest live in-shop value per meter as a position floor; rate/pairs/age unchanged. No container parameter |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `components/shared/vehicle-info/VehicleCard.vue` | Modify | One async import plus one mount in the expansion body: `<WorkOrderMaintenancePanel v-if="showMaintenancePanel" :work-order-id="workOrder.id" :vehicle-id="workOrder.vehicle.id" :company-id="workOrder.company_id" :workplace-id="workOrder.workplace_id" />`. `showMaintenancePanel` = `cardType === 'workOrder'` && vehicle id && `!isHistoryMode` && `permissionService.canView('workOrders')`. `WorkOrderInfo` gains `workplace_id?: string` (the store `WorkOrder` already has it); `@focus-meter` on the panel focuses `mileageInput` / `engineHoursInput` and scrolls it into view (FD-226). About 18 lines in total |
| `components/ts/maintenance/work-order/WorkOrderMaintenancePanel.vue` | Create | `q-expansion-item` (collapsed, FD-212). Header: `q-badge` `dueCount` alone, no title or other text (S16-R2, #5; neutral color, BE count; the expansion item gets an `aria-label` "Maintenance" for accessibility, not visible text). Body: `QueryState` → rows / not-enrolled state with Enroll (S16-R11); re-emits each row's `focus-meter` (FD-226). Renders nothing until A35 resolves; renders nothing when `organizationHasSchedules === false` and the asset has no enrolment or record. Mounts `MarkCompleteDialog`, `CertificateRecordDialog`, `EnrolmentDialog` lazily. FD-204 watcher; renders nothing when A35 `organizationHasSchedules === false` (S16-N8) |
| `components/ts/maintenance/work-order/PanelServiceRow.vue` | Create | Name + schedule chip (`showScheduleChip`); "4 lines · 2.8 hours" summary as the `HoverCard` trigger (S16-R16, R7); covered names folded ("Includes …", S16-R3, S18-R7); `DueCell` + `DueBadge` (S16-R4, R5; compliance stays orange, S16-R6); copied-work (i) when `copiesWork` (`maintenance_wo_panel_copy_info_${id}`, S16-R21, naming the row's `homeWorkplaceName` and the panel's top-level `workOrderWorkplaceName`); primary action slot per `panelRowActions.primary(row)`: Add Service, or **Mark complete** once added (S16-R17), or (i) invoiced (`maintenance_wo_panel_add_blocked_${id}`, S16-N7), or nothing when `!hasCannedLines` and not addressed (S16-R9); `ResponsiveActionMenu`; addressed line "Added · {n} lines" (FD-211); "Now due" marker (S16-E1); per-row Needs-reading hint from `due.needsReadings` (S16-R12, FD-226): a `Button` emitting `focus-meter` when `meterInputsEditable`, text otherwise |
| `components/ts/maintenance/work-order/ServiceContentsCard.vue` | Create | HoverCard body. A36 on first open: job descriptions, parts with quantity, inspection form name; parts heading "PARTS {HOME} USES (reference)" when `copiesWork` (S16-R7). Never a price (S16-R16, N5) |
| `components/ts/maintenance/work-order/panelRowActions.ts` | Create | Pure: `primary(row, access)` → `'add_service' \| 'mark_complete' \| 'blocked_invoiced' \| null`; `menu(row, access)` → Mark complete (only while not added; CE; alone for a service with no canned lines, S16-R9), Remove (`addressed.removable`, lines atom, S16-R25), Add record (compliance, CE, S16-R10), Undo complete (`completed.undoable` && `addressed.path === 'mark_complete'`, S18-R17; a `lines` row reset by Mark complete shows none, FD-211; an invoice completion arrives with `completed: null`, so no Undo complete, S18-N8). No "Open asset" item. Without CE and without the lines atom: no menu. Same shape as Plan 1 `serviceRowActions.ts` |
| `components/ts/maintenance/work-order/panelState.ts` | Create | Pure: `newlyDue(prev, next)` by `enrolledServiceId` (S16-E1); `copyInfoCopy(service, home, here)` (S16-R21 text); `blockedReasonCopy('invoiced')` |
| `api/maintenance/{MaintenanceModel,index,keys,queries}.ts` | Modify | `WorkOrderPanelDto` (+ `organizationHasSchedules`, `workOrderWorkplaceName`; no `addressedCount`; the fast-path shape `{organizationHasSchedules: false, isEnrolled: false, hasComplianceRecords: false, rows: [], dueCount: 0, needsReadings: []}` type-checks), `PanelRowDto` (+ `copiesWork`, `homeWorkplaceName`, `addressed.removable`), `ServiceContentsDto`; `useWorkOrderPanelQuery`, `useServiceContentsQuery` |
| `components/ts/maintenance/shared/copy.ts` | Modify | The S16-R21 (i) text, "PARTS {HOME} USES (reference)", "Added · {n} lines", "{service} added · {n} lines", the Remove toast, "Lines can't be created on an invoiced work order." (S16-N7), "Now due". No "Lines can be created only on work orders at {location}" (removed with S16-N6's rewrite) |

#### Key code changes:
**Backend.** Sketch Q1-a (panel rows, S16-R2, R3, R9, R18, R21, R25, N6, N7):

```php
final class WorkOrderPanelRowsBuilder
{
    /** @param list<ProjectedServiceRow> $rows  all active enrolled services of the WO's vehicle (Plan 1 projection) */
    public function build(array $rows, WorkOrderFacts $wo, LinkSet $linksOnWo, CannedLineSummary $summary, \DateTimeImmutable $today): WorkOrderPanelView
    {
        $due = array_filter($rows, fn ($r) => null !== DueStatus::of($r->dueOn, $r->dueSoonFrom, $today)   // S16-R3
            && !$r->isSkipped && !($r->isCompliance && !$r->hasRecord));
        $dueIds = array_map(fn ($r) => $r->enrolledServiceId, $due);

        $folded = [];                                                    // S16-R3: fold only under a listed coverer
        foreach ($due as $r) {
            foreach ($r->coveredEnrolledServiceIds as $coveredId) {
                if (in_array($coveredId, $dueIds, true)) { $folded[$coveredId] = $r->enrolledServiceId; }
            }
        }
        $top = array_values(array_filter($due, fn ($r) => !isset($folded[$r->enrolledServiceId])));

        foreach ($this->enrolmentsWithNothingDue($rows, $due) as $enrolmentRows) {                    // S16-R3 next service
            $top[] = $this->earliest($enrolmentRows)->asNextService();
        }

        return new WorkOrderPanelView(
            rows: array_map(fn ($r) => $r
                ->withCovered($this->coveredNames($r, $folded, $rows))
                ->withSummary($summary->for($r->cannedLineIds))                                      // S16-R16, no money
                ->withBlockedReason($wo->isInvoicedOrPaid() ? AddServiceBlockedReason::Invoiced : null)    // S16-N7
                ->withCopiesWork(!$r->homeWorkplaceId->equals($wo->workplaceId))                     // S16-R21, N6 (copy, no refusal)
                ->withAddressed($linksOnWo->addressedFor($r->enrolledServiceId))                      // S16-R18, R20 (never a removed link)
                ->withAddressedRemovable($linksOnWo->removableFor($r->enrolledServiceId) && !$wo->isInvoicedOrPaid()), // S16-R25
                $this->order($top)),
            dueCount: count(array_filter($top, fn ($r) => !$r->isNextService)),                       // S16-R2
        );
    }
}
```

**Frontend.** **Key code sketch: the panel inside the WO card**

```vue
<!-- VehicleCard.vue (Modify, inside <q-expansion-item>, after FaultCodesLookupButton) -->
<WorkOrderMaintenancePanel
  v-if="showMaintenancePanel"
  :work-order-id="workOrder!.id!"
  :vehicle-id="workOrder!.vehicle!.id!"
  :company-id="workOrder?.company_id ?? null"
  :workplace-id="workOrder?.workplace_id ?? null"
/>
```
```ts
// VehicleCard.vue <script lang="ts" setup> additions
const WorkOrderMaintenancePanel = defineAsyncComponent(
  () => import('@/components/ts/maintenance/work-order/WorkOrderMaintenancePanel.vue'),
);
const { enabled: maintenanceEnabled } = useMaintenanceAccess();
const showMaintenancePanel = computed(
  () => maintenanceEnabled.value && props.cardType === 'workOrder' && !props.isHistoryMode
    && !!workOrder?.value?.id && !!workOrder?.value?.vehicle?.id,
);
```
(The template uses non-null assertions only inside the `v-if` that has just proven them. If review rejects `!`, pass
`workOrder` through a typed computed `panelProps` that returns `null` otherwise.)

```ts
// WorkOrderMaintenancePanel.vue <script lang="ts" setup> (abridged)
const props = defineProps<{ workOrderId: UUID; vehicleId: UUID; companyId: UUID | null; workplaceId: UUID | null }>();
const access = useMaintenanceAccess();
const queryClient = useQueryClient();
const workOrder = inject<ComputedRef<{ mileage?: unknown; engine_hours?: unknown; status_value?: string } | null>>('workOrder');
const panel = useWorkOrderPanelQuery(() => props.vehicleId, () => props.workOrderId); // staleTime 0
const expanded = ref(false);                                                          // S16-R1, never persisted
const previousRows = ref<PanelRowDto[]>([]);
const nowDue = ref<Set<UUID>>(new Set());
watch(() => panel.data.value?.rows, (rows, old) => {
  if (rows && old) nowDue.value = newlyDue(old, rows);                                // S16-E1
});
// FD-204: inline mileage/hours save, status change or asset switch -> refetch (BE recomputed in-transaction)
watch(() => [workOrder?.value?.mileage, workOrder?.value?.engine_hours, workOrder?.value?.status_value], () =>
  queryClient.invalidateQueries({ queryKey: maintenanceKeys.workOrderPanel(props.vehicleId, props.workOrderId) }));

const visible = computed(() => panel.data.value?.organizationHasSchedules !== false);   // S16-N8
const markCompleteRow = ref<PanelRowDto | null>(null);  // menu (before add) or row button (after add, S16-R17) -> MarkCompleteDialog :preselected-work-order-id
const addServiceRow = ref<PanelRowDto | null>(null);    // -> AddServiceDialog (Q2)
const recordRow = ref<PanelRowDto | null>(null);        // -> CertificateRecordDialog
const enrolOpen = ref(false);                           // -> EnrolmentDialog mode="workOrder"
```
```ts
// panelRowActions.ts (Create)
export const primary = (row: PanelRowDto, a: PanelAccess): PanelPrimary => {
  if ((row.addressed?.path === 'lines' || row.addressed?.path === 'no_lines') && !row.completed)
    return a.canEditCustomerSide ? 'mark_complete' : null;                                                     // S16-R17
  if (row.addressed) return null;                                                                                 // reset: text only
  if (row.addServiceBlockedReason === 'invoiced') return 'blocked_invoiced';                                     // S16-N7
  if (!row.hasCannedLines) return null;                                                                           // S16-R9 (menu only)
  return a.canAddLines || a.canCreateWorkOrder ? 'add_service' : null;
};
```

#### Unit / Integration tests:
**Backend:**
- Unit `WorkOrderPanelRowsBuilderTest`: due filter (due soon, today, overdue; skipped and no-record compliance out); covered folded under a listed coverer and not otherwise; one next-service row per enrolment with nothing due; `dueCount` excludes next-service rows; a row at a non-home WO → `copiesWork` true and no blocked reason; invoiced → `invoiced`; addressed from `lines` / `no_lines` (open, reset, unticked) and `mark_complete` links; orphaned/declined/undone/`removed` links not addressed; `addressed.removable` matrix (open lines → true; reset/removed/invoiced → false); ordering.
- Unit `DueDateResolverTest` (Plan 1, extended): an in-shop value past a meter threshold makes the candidate due today; an `At` reading passed by an in-shop value is overdue; rate and confidence ignore the in-shop value.
- Functional `tests/Functional/VehicleService/Maintenance/WorkOrderPanelEndpointTest.php`: rows for a vehicle on two schedules (one with another home workplace → `copiesWork: true`, `homeWorkplaceName`); invoiced WO → `invoiced`; `organizationHasSchedules` false for an org with no active schedule; top-level `workOrderWorkplaceName`; WO without vehicle; foreign WO 404; user without `ROLE_WORK_ORDER_VIEW` 403; an org with no active schedule and no enrolment → one query and `organizationHasSchedules: false` (TD-41a; assert the query count); `addressedCount` absent; no price key anywhere in the JSON (recursive key scan); a WO mileage change through `POST /api/work-orders/change-mileage` followed by A35 shows the row due (TD-108).
- Functional `ServiceContentsEndpointTest`: lines deduped, parts listed with quantities, inspection form name, deleted canned line omitted, no price key; home-workplace lines read from another header (GR-7).
- Unit `ServiceRowAssemblerTest` + Plan 1's A24 functional test re-run unchanged.

**Frontend:**
- `VehicleCard.spec.ts` (extend):
  - the panel mounts only for `workOrder` + vehicle + not history mode + WO view;
  - it is absent for `partSale`, `importedWorkOrder` and history mode;
  - with A35 `organizationHasSchedules: false` and no enrolment the card's DOM is unchanged from today;
  - `focus-meter: 'mileage'` focuses the mileage input, `'hours'` the engine-hours input.
- `WorkOrderMaintenancePanel.spec.ts` (MSW):
  - collapsed by default; the badge shows `dueCount` (skeleton while loading, never 0, NFR-F03);
  - the collapsed header shows the badge only, with no title or other text (S16-R2);
  - not-enrolled state with Enroll (CE) / hidden without CE;
  - a row whose `due.needsReadings` holds `mileage` shows 'Needs mileage reading'; clicking it emits `focus-meter('mileage')`; read-only inputs → plain text;
  - a change to the injected `workOrder.mileage` refetches; a newly due row gets "Now due";
  - renders nothing when `organizationHasSchedules` is false (S16-N8);
  - Mark complete opens with the preselected WO;
  - Add record opens the certificate dialog with the service name;
  - error → Retry.
- `PanelServiceRow.spec.ts`:
  - summary text without money;
  - the hover opens on hover, focus and tap (HoverCard contract);
  - compliance badge is orange when overdue;
  - no Add Service without canned lines;
  - `copiesWork` → (i) with both location names, Add Service still offered; invoiced → (i) and no Add Service;
  - added → "Added · n lines" and the Mark complete button; not added → Mark complete in the menu only;
  - addressed lines for both paths.
- `panelRowActions.spec.ts` (the primary/menu matrix including Remove gating; an invoice-completion fixture `completed: null, lastDone.kind: 'invoice'` offers no Undo complete, S18-N8; the `undoable: false` guard stays as defensive code), `panelState.spec.ts`, `ServiceContentsCard.spec.ts` (no currency in the output; the reference heading when `copiesWork`).

#### Verification (Definition of Done gates):
**Backend:** standard + smoke (manual curl of A35, A36). Performance: A35 on the seeded dataset for a vehicle with 3 × 15
services, query count asserted in the functional test via a DBAL logging middleware count (≤ 7), p95 measured and
pasted in the PR (NFR-107).

**Frontend:** shared gates, plus:
1. `admin`, an org with an enrolled unit that has a due service, `/workorders/<id>/lines`:
   - asset card → "Maintenance" collapsed with a badge; expand → rows with "n lines · h hours", due wording as on the
     asset tab, red overdue routine, orange compliance;
   - hover a summary → contents with no price; tap the same on a 390 px phone (sheet);
   - change Mileage inline in the card above → the panel refreshes; a service that crossed shows "Now due";
   - a service on a unit with no mileage reads "Needs mileage reading" → click → the cursor lands in the card's Mileage field;
   - the collapsed header shows the badge and no other text;
   - row menu → Mark complete → the modal opens with this WO chosen → save → the row reads "Marked complete on this work
     order …"; Undo complete restores it;
   - compliance row → Add record → save → the asset's Compliance section shows it;
   - a unit on no schedule → Enroll in Schedule → the Plan 1 modal → rows appear.
2. A WO at a location other than the schedule's home: the row reads exactly as at home, with an (i) "'<service>'s lines
   were set up at <home>…" naming both locations, and Add Service is offered. Hovering the summary shows the parts under
   "PARTS <HOME> USES (reference)". An invoiced WO: (i) "Lines can't be created on an invoiced work order", Mark complete
   stays in the menu.
3. `tech` (view WOs, no edit customers): rows visible, no row menu, no Add Service unless it holds the lines atom.
4. Regression: a part sale (`/part-sales/<id>`) and an imported WO look as before; in an org with no schedule, the WO
   page shows no panel and Network shows one quick A35 call (`organizationHasSchedules: false`); a part sale and an
   imported WO make no request.
5. Phone: "Show details" → the card → the panel; menus open as action sheets (layout still ⏸ PENDING PQ-6).
6. An org with no schedule: the WO asset card has no Maintenance panel (S16-N8).

#### E2E tests (e2e/)
UI-affecting (§9): yes (`VehicleCard.vue`, new `components/ts/maintenance/work-order/*`, new A35/A36 controllers). §8: n/a.
**Creates: 4 of 5 slots (ranked).** Shared conventions (spec folder, shared org with the feature live, data, factories, page objects) are in
Section 7, E2E tests.

**Q1-1 `wo-maintenance-panel.spec.ts`: Admin opens a work order and reads the maintenance panel for its asset**
- **Type:** Happy path. **Reqs:** S16-R1, S16-R2, S16-R3, S16-R4, S16-R5, S16-R7, S16-R16, S16-N5, NFR-115, NFR-F107. **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** A35 assembles projection rows, canned-line summaries and the due wording from real Plan 1 data. A36 reads real canned-line contents. A mock cannot show the real projection-to-row mapping, and the API alone cannot show what the card renders.
- **Preconditions:** Fresh customer + contact + vehicle `MR<ts>`. Two canned lines at the header workplace ("MR-E2E Oil <ts>" 1.5 h with one part, "MR-E2E Filter <ts>" 0.6 h). Schedule (API): routine "PM-A" (calendar Every 6 months; both canned lines) + compliance "CVIP" term 12. Enrolled (API) with PM-A last done = today − 8 months (overdue). CVIP record (API) with **End date = today + 20 days** (due soon: Remind before 1 month). An open service WO for the vehicle via `workOrderFactory.create`.
- **Steps:**
  1. Open `/workorders/<woId>/lines` (`linesPage.waitForPageToOpen`). Expected: `maintenance_wo_panel` is inside the asset card, collapsed; `maintenance_wo_panel_badge` reads `2`. The collapsed header shows no text beside the badge (S16-R2).
  2. Click `maintenance_wo_panel_toggle`. Expected: `maintenance_wo_panel_row_<PM-A>` and `maintenance_wo_panel_row_<CVIP>` are visible. `maintenance_wo_panel_summary_<PM-A>` reads "2 lines · <h> hours", where <h> is the sum of the seeded line hours. `maintenance_wo_panel_badge_<PM-A>` reads Overdue. The CVIP badge reads due soon.
  3. Focus `maintenance_wo_panel_summary_<PM-A>` and press Enter (the HoverCard keyboard contract; no hover timing). Expected: `maintenance_wo_panel_contents_<PM-A>` lists both canned-line descriptions and the part number with its quantity, and contains no currency (`not.toContainText(/\$\s?\d/)`).
- **Expected result:** The panel renders real due data and the contents of the service from the server, with no money.
- **Page objects / factories:** new `wo-maintenance-panel.component.ts`; `lines.page.ts`; `MaintenanceFactory` (Plan 1) + `getWorkOrderPanel` to resolve the row ids.

**Q1-2 `wo-panel-mark-complete.spec.ts`: Admin marks a due service complete from the work order's panel and undoes it**
- **Type:** Happy path. **Reqs:** S16-R13 (Mark-complete half), S16-R17, S18-R1 (WO entry), NFR-F105. After Q2 also S16-R18, S17-E2, TD-110 (see Q2-U1). **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** the WO is preselected from the panel's context, A28 writes against this WO, and the panel refetches its own key from the real recompute. The panel-only outcome is the WO-addressed state; Plan 1 P6-2 covers Mark complete from the asset tab only.
- **Preconditions:** As Q1-1, but PM-A only (no compliance). WO with one hand-typed line (`workOrderFactory.addLine`), uninvoiced.
- **Steps:**
  1. Open the WO and expand the panel. Expected: PM-A row Overdue.
  2. `maintenance_wo_panel_menu_<PM-A>` → `maintenance_wo_panel_action_mark_complete_<PM-A>`. Expected: `dialog_maintenance_mark_complete` opens with "on a work order" selected and `maintenance_mark_complete_wo_<woId>` already chosen. `input_maintenance_reset_date` defaults to today.
  3. Confirm. Expected: a toast with Undo. `maintenance_wo_panel_badge_<PM-A>` no longer reads Overdue (the row becomes the schedule's next service).
  4. `button_notification_undo`. Expected: `maintenance_wo_panel_badge_<PM-A>` reads Overdue again.
- **Expected result:** A due service can be closed against this WO from the WO itself, and Undo restores it.
- **Page objects / factories:** `wo-maintenance-panel.component.ts`, Plan 1 `maintenance-mark-complete.dialog.ts`; `workOrderFactory.addLine`.

**Q1-3 `wo-panel-reading-now-due.spec.ts`: Entering mileage on the work order's asset card makes a mileage service due in the panel**
- **Type:** Happy path. **Reqs:** S16-R12, S16-E1 (TD-108), S16-N1 (hint, not a control), NFR-F105 (FD-204). **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** the inline VehicleCard input → `POST /work-orders/change-mileage` → Plan 1 in-shop capture + recompute (TD-108) → the panel's FD-204 watcher refetches A35. This is the only path where the existing WO input and the new panel meet. Neither a mock nor an API call alone can observe that.
- **Preconditions:** Canned line at the header workplace. Schedule "Oil" (mileage Every 10,000 + calendar Every 12 months; 1 canned line). Enrolled with last done = today − 1 month, `meterAtPassedAction` mileage 50,000. Reading 52,000 via `MaintenanceFactory.recordReadings`. Open WO.
- **Steps:**
  1. Open the WO and expand the panel. Expected: the Oil row is the next-service row (not due); `maintenance_wo_panel_now_due_<Oil>` is absent.
  2. `linesPage.setMileageValue(61000)` in the asset card above the panel. Expected: the input saves (its spinner settles).
  3. Expected: `maintenance_wo_panel_now_due_<Oil>` appears, and `maintenance_wo_panel_badge_<Oil>` reads due (Due today / Overdue) without a reload.
- **Expected result:** A reading typed on the work order re-evaluates the panel immediately and says what moved.
- **Page objects / factories:** `wo-maintenance-panel.component.ts`; `lines.page.ts` (`setMileageValue`); `MaintenanceFactory.recordReadings`.

**Q1-4 `wo-panel-invoiced-blocked.spec.ts`: On an invoiced work order the panel offers no Add Service and says why**
- **Type:** Edge case (UI gate driven by real server state, `test-scope-rules.md` §4 row 14). **Reqs:** S16-N7 (display). **Role:** admin. **Priority:** P2.
- **Preconditions:** PM-A enrolled overdue with canned lines. WO for the vehicle with one line, completed (`changeLineStatus`, `transitionTo('complete')`) and invoiced via `invoiceFactory.create`. **Runs on stage** (B-2).
- **Steps:**
  1. Open the invoiced WO and expand the panel. Expected: `maintenance_wo_panel_add_blocked_<PM-A>` reads "Lines can't be created on an invoiced work order." and `button_maintenance_wo_panel_add_service_<PM-A>` is absent (once Q2 exists).
  2. Open `maintenance_wo_panel_menu_<PM-A>`. Expected: `maintenance_wo_panel_action_mark_complete_<PM-A>` is still offered.
- **Expected result:** The invoiced state of the real WO gates Add Service and leaves Mark complete available.
- **Page objects / factories:** `wo-maintenance-panel.component.ts`; `workOrderFactory.changeLineStatus` / `transitionTo`; `invoiceFactory.create`.

**Backlog (Q1):**

| Workflow | Why deferred | Suggested file |
|---|---|---|
| A user who can view WOs but not edit customers sees panel rows read-only (no row menu: no Mark complete / Add record / Undo; no Enroll) | Ranked 5th. Needs a fresh custom role (`custom-role.fixtures.ts` / `report-role-seed.helper.ts`); the local stack has no technician | `e2e/tests/ui/maintenance-reminders/wo-panel-role-gate.spec.ts` |
| At a WO whose location is not the schedule's home, the row reads as at home with the copied-work (i) and the reference parts heading (S16-R21, S16-R7, S16-N6) | Needs ≥2 workplaces with labour types (same seeding cost as Plan 1's cross-location backlog items); first candidate to promote when two-workplace seeding lands | `e2e/tests/ui/maintenance-reminders/wo-panel-copied-work.spec.ts` |

**Dev-layer (Q1):** fold rule and next-service-per-enrolment (S16-R3), `dueCount` excludes next-service rows
(S16-R2), ordering, `copiesWork`, `addressed.removable`: be-unit `WorkOrderPanelRowsBuilderTest`. S16-N8 (`organizationHasSchedules`):
be-functional + fe-unit. S16-R21 copy text: fe-unit. No price key anywhere, query
count ≤ 7 (NFR-107, NFR-115), foreign WO 404, no-WV 403, fast path one query (TD-41a): be-functional `WorkOrderPanelEndpointTest`,
`ServiceContentsEndpointTest`. Panel absent for part sale / imported WO / history mode, unchanged DOM when the org has no schedule
(NFR-F101, NFR-F103, NFR-F109, NFR-F112): fe-unit `VehicleCard.spec.ts`. Needs-reading hint focuses the input (S16-R12): fe-unit
`VehicleCard.spec.ts`, `WorkOrderMaintenancePanel.spec.ts`. Compliance orange never red, compliance row no tag (S16-R5,
R6), no Add Service without canned lines (S16-R9), copied-work and invoiced (i) copy, phone sheet (NFR-F108), Retry (QueryState): fe-unit
`PanelServiceRow.spec.ts`, `WorkOrderMaintenancePanel.spec.ts`. Enroll in Schedule from the panel (S16-R11, S7-R1) is an
entry-point variation of Plan 1 P5-1 (§5); the WO company id in the request is fe-unit. Add record from the panel
(S16-R10, S8-R5) is a variation of Plan 1 P2-2; the dialog opening with the service name is fe-unit. S16-R14, S16-N2,
S16-N3: by construction (no test, or the existing canned-line search spec re-run). TD-108 engine: be-unit
`DueDateResolverTest`.

**Reference updates (Q1):** R-Q1-1 … R-Q1-4, verify / re-run only (Section 7, Reference updates).

### Phase Q2: Add a service to a work order

**Implements:** S16-R8 (the Add Service modal; PQ-3 answered), R9, R13 (Add half, including copied work at a non-home WO), R15 (lines path, completed in Q3), R17 (Mark complete as the row's button once added), R21..R25 (Add half: copy consumed from Plan 1, the modal preview, toast Undo and menu Remove), S16-N6 (copy path), S16-N9; S18-R1 (WO half); S17-R1 (card only, #7), S17-N1, S17-E1, S17-E2; S17-R2/R5/R6/R8 (panel path; the dedupe count shown); S17-R7 (re-verified); S22-E1 (write side) and S22-R1 for `wo_panel` (an Add Service link is an origin, #13); NFR-112, NFR-113, NFR-115; NFR-F105, NFR-F106, NFR-F110.

**Depends on:** Q1. **Requires Plan 1 phases merged into the feature branch:** P6 (`AppendServiceLinesToWorkOrder` with its copy mode (Plan 1 TD-32) and result object, A28/A33, `CreatedVia::WoPanel` and `LinkState::Removed` reserved; FE `useMaintenanceWorkOrderActions`).

#### Database changes:
None (`removed` is a value of the existing link `state` column, reserved in Plan 1 P6).

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/UI/HTTP/WorkOrderPanel/AddServicesToWorkOrderController.php` + `DTO/AddServicesToWorkOrderRequestDto.php` | Create | A37; `#[MapEntity] WorkOrder`; `enrolled_service_ids` `Assert\Count(min: 1, max: 20)`, `Assert\Unique`, `Assert\All(Assert\Uuid)`; ownership validator (NFR-112) |
| `src/VehicleService/Maintenance/UI/HTTP/Shared/MaintenanceAccessGate.php` | Modify (Plan 1) | `guardWorkOrderLinesCreate(WorkOrder $wo)`: `denyAccessUnlessGranted(ROLE_WORK_ORDER_CREATE_AND_EDIT, $wo)`, the exact check of `CreateFromCannedLine/CreateController.php:27` (role atom + `OrganizationAwareVoter` on the subject, TD-123). Used by A37 and A44 |
| `src/VehicleService/Maintenance/Application/Command/WorkOrderPanel/AddServicesToWorkOrderCommand.php`, `Application/Handler/WorkOrderPanel/AddServicesToWorkOrderCommandHandler.php` | Create | Sketch Q2 (TD-103); no location guard (copied work at a non-home WO, Plan 1 TD-32); response adds `copied` |
| `src/VehicleService/Maintenance/UI/HTTP/WorkOrderPanel/RemoveServiceFromWorkOrderController.php` + `DTO/RemoveServiceFromWorkOrderRequestDto.php` | Create | A44 (S16-R25); non-nullable `#[MapEntity] WorkOrder`; `enrolledServiceId` org-scoped, vehicle = the WO's vehicle (NFR-112) |
| `src/VehicleService/Maintenance/Application/Command/WorkOrderPanel/RemoveServiceFromWorkOrderCommand.php`, `Application/Handler/WorkOrderPanel/RemoveServiceFromWorkOrderCommandHandler.php` | Create | Sketch Q2-b (TD-125): link → `removed`, audit; no line delete, no recompute |
| `src/VehicleService/Maintenance/Domain/Error/WorkOrderInvoicedError.php`, `NoCannedLinesError.php`, `ServiceAlreadyOnWorkOrderError.php`, `ServiceAlreadyResetError.php`, `NothingToRemoveError.php` | Create | Extend `ConflictError` (409). No `OtherLocationError` (S16-N6 now copies) |
| `src/VehicleService/Maintenance/Domain/Model/CreatedVia.php` | Modify (Plan 1) | `WoPanel` accepted on the A33 request DTO (Plan 1 `CreateWorkOrderForEnrolledServiceRequestDto` choice list) |
| `src/VehicleService/Maintenance/Application/Handler/Completion/MarkServiceCompleteCommandHandler.php`, `UndoCompletionCommandHandler.php` | Modify (Plan 1) | TD-110: write a `mark_complete` link when `path = work_order` and no open `lines` link exists on that WO (a `removed` link does not count); undo sets it `undone` |
| `src/VehicleService/Maintenance/Domain/Model/WorkOrderServiceLink.php`, `LinkState.php` | Modify (Plan 1) | `markComplete(...)` factory, `LinkState::Undone`, `markUndone()`, `remove(by)` (writes the reserved `LinkState::Removed`) |
| Link-state readers: `DbalWorklistWorkOrderFetcher`, `hasLiveWorkOrder`, `ResetMaintenanceOnInvoiceCreatedSubscriber` link selection (Plan 1) | Modify (Plan 1) | Positive state lists: the worklist WO column reads "latest with state IN (open, reset, declined)"; a `removed` link is never live, so Create work order is available again; only `open` links reset |

(The `AppendServiceLinesToWorkOrder` result object `{linesAddedCount, linesSkippedAsDuplicateCount, copied, perService[]}` and its copy mode now live in Plan 1 P6; Q2 consumes them.)

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `components/ts/maintenance/work-order/AddServiceAction.vue` | Create | `Button` "Add Service" (`button_maintenance_wo_panel_add_service_${id}`, `:async-click` guard, NFR-F106) opening `AddServiceDialog`. No destination menu. With no permitted destination, nothing renders |
| `components/ts/maintenance/work-order/AddServiceDialog.vue` | Create | FD-209: `BaseFormDialog fullscreenOnPhone :async-submit`, title "Add {service}", A36 preview (`QueryState`): lines with hours, parts only when `!copiesWork`, no money (S16-R16, R24); destination `q-option-group` this/new (only the permitted ones; one → no radio); confirm "Add Service" (`button_maintenance_add_service_confirm`) |
| `components/ts/maintenance/work-order/addServiceToast.ts` | Create | `showAddedToast(row, res, undo)` → `showSuccessNotification({ message: copy.serviceAdded(name, linesCount), undo: { handler: undo } })` (S16-R25, FD-220) |
| `api/maintenance/{index,queries,MaintenanceModel}.ts` | Modify | `useAddServicesToWorkOrderMutation` (A37). `onSuccess`: `invalidateMaintenanceForAsset`, `workOrderKeys.lines(woId)`, `workOrderKeys.detail(woId)`. **`useRemoveServiceFromWorkOrderMutation` (A44, `handlesConflictLocally`)**: `onSuccess` → `invalidateMaintenanceForAsset` + `workOrderKeys.detail(woId)` |
| `components/ts/maintenance/shared/useMaintenanceWorkOrderActions.ts` | Modify (Plan 1) | `createWorkOrder(row, createdVia, { navigate = true } = {})`. The dialog passes `'wo_panel'` and `navigate: false` (FD-210). `CreatedVia` gains `'wo_panel'` |
| `components/ts/maintenance/work-order/PanelServiceRow.vue` | Modify | Wires `AddServiceAction`, the Mark complete primary button (`button_maintenance_wo_panel_mark_complete_${id}`, S16-R17) and the Remove menu item (`maintenance_wo_panel_action_remove_${id}`, FD-221) |

#### Key code changes:
**Backend.** Sketch Q2 (A37, TD-103):

```php
final class AddServicesToWorkOrderCommandHandler implements CommandHandler
{
    public function __invoke(AddServicesToWorkOrderCommand $command): AddedServicesDto
    {
        $workOrder = $command->workOrder;                                         // MapEntity: org + header workplace
        if ($workOrder->getStatus()->isInvoiced() || $workOrder->getStatus()->isPaid()) {
            throw new WorkOrderInvoicedError();                                   // S16-N7
        }
        $services = $this->services->activeByIds($command->enrolledServiceIds);  // org-scoped; count-checked in the DTO
        foreach ($services as $service) {
            match (true) {
                null === $service->activeOrNull() => throw new EnrolmentEndedError(),
                !$service->vehicleId()->equals($workOrder->getVehicleId()) => throw ValidationError::field('enrolled_service_ids'),
                [] === $service->cannedLines() => throw new NoCannedLinesError(),                                // S16-R9
                $this->links->hasOpenOnWorkOrder($service->id(), $workOrder->getId()) => throw new ServiceAlreadyOnWorkOrderError(),
                $this->links->hasLiveWorkOrderOtherThan($service->id(), $workOrder->getId()) => throw new LiveWorkOrderExistsError(),
                default => null,
            };                                                                    // no location guard: a non-home WO gets copied work (S16-N6)
        }

        $this->transactional->begin();
        try {
            // Plan 1: lines (home) or copied work (non-home, TD-32), links, short WO note, audit, dedupe (S17-R2, R5, R6, R8)
            $result = $this->appendLines->append($workOrder, $services, CreatedVia::WoPanel);
            $this->transactional->commit();
        } catch (\Throwable $e) {
            $this->transactional->rollBack();
            throw $e;
        }

        return AddedServicesDto::from($result);                                  // copied, services[].linesCount; no price (NFR-115)
    }
}
```

Sketch Q2-b (A44, TD-125):

```php
final class RemoveServiceFromWorkOrderCommandHandler implements CommandHandler
{
    public function __invoke(RemoveServiceFromWorkOrderCommand $command): void
    {
        $wo = $command->workOrder;
        $link = $this->links->liveOnWorkOrder($wo, $command->enrolledServiceId) ?? throw new NothingToRemoveError();
        if ($wo->isInvoicedOrPaid()) { throw new WorkOrderInvoicedError(); }                   // S16-R25 "until invoiced"
        if (LinkState::Reset === $link->state()) { throw new ServiceAlreadyResetError(); }     // S16-R25 (#28): reset by Mark complete or invoicing; Undo complete first
        $link->remove($command->userId);                                                       // state → removed; lines and WO note untouched (S16-N4)
        $this->links->save($link);
        $this->audit->write(EntityEventType::MAINTENANCE_WORK_ORDER_SERVICE, 'removed', $link->id(), $wo->getWorkplaceId());
    }
}
```

**Frontend.** **Key code sketch: the Add Service dialog**

```ts
// AddServiceDialog.vue <script lang="ts" setup> (abridged)
const props = defineProps<{ modelValue: boolean; row: PanelRowDto; workOrderId: UUID; workOrderNumber: string; vehicleId: UUID; companyId: UUID | null }>();
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();
const fetchWorkOrder = inject<(() => Promise<void>) | null>('fetchWorkOrder', null);
const contents = useServiceContentsQuery(() => props.vehicleId, () => props.row.enrolledServiceId);   // A36 (cached with the hover card)
const showParts = computed(() => !props.row.copiesWork);                                             // S16-R24
const canThis = computed(() => permissionService.has('workOrderLinesCreateAndEdit'));
const canNew = computed(() => access.canCreateWorkOrder.value);
const destination = ref<'this' | 'new'>(canThis.value ? 'this' : 'new');
const addToThis = useAddServicesToWorkOrderMutation();
const remove = useRemoveServiceFromWorkOrderMutation();
const submit = async () => {
  if (destination.value === 'this') {
    const res = await addToThis.mutateAsync({ workOrderId: props.workOrderId, vehicleId: props.vehicleId, companyId: props.companyId,
      body: { enrolled_service_ids: [props.row.enrolledServiceId] } });
    await fetchWorkOrder?.();                                                                         // lines + note show (S16-R19, S17-R5)
    showAddedToast(props.row, res, () => remove.mutateAsync({ workOrderId: props.workOrderId,         // S16-R25 Undo = A44
      enrolledServiceId: props.row.enrolledServiceId, vehicleId: props.vehicleId }));
  } else {
    const wo = await createWorkOrder(props.row, 'wo_panel', { navigate: false });                    // FD-210 unchanged
    showSuccessNotification({ message: copy.workOrderCreatedFor(props.row.name, wo.displayNumber),
      actions: [{ label: 'Open', color: 'white', 'data-test-id': 'button_maintenance_open_new_work_order',
        handler: () => router.push({ name: 'WorkOrder', params: { id: wo.workOrderId }, query: { locationId: wo.workplaceId } }) }] });
  }
  emit('update:modelValue', false);
};
```

#### Unit / Integration tests:
**Backend:**
- Unit `AddServicesToWorkOrderCommandHandlerTest`: each guard raises its error before any write; no location guard (a non-home WO passes to the copy mode); two services sharing a canned line add it once (`linesSkippedAsDuplicateCount = 1`); a line already added by an earlier link on this WO is skipped; `CreatedVia::WoPanel` passed.
- Unit `RemoveServiceFromWorkOrderCommandHandlerTest`: open link → `removed` + audit, no line touched; invoiced → 409; reset → 409; no link → 409.
- Unit `MarkServiceCompleteCommandHandlerTest` (Plan 1, extended): `path = work_order` with no open link writes a `mark_complete` link (also after a Remove); with an open `lines` link marks it reset and writes none; `UndoCompletionCommandHandlerTest`: `mark_complete` link → `undone`.
- Functional `tests/Functional/VehicleService/Maintenance/AddServicesToWorkOrderEndpointTest.php`: lines appended at the end in order with the internal WO note (not customer-visible) and an `entity_event` row; second call 409; invoiced WO 409; a schedule with another home workplace → copied lines at this WO's labour rate, no parts, one internal line note each, WO note "{service} added from {schedule}", `copied: true`; a foreign enrolled-service id 404 for the whole request; user without WC 403; A33 with `created_via = wo_panel` creates a WO whose origin is set (read back through A42′ once Q4 lands).
- Functional `RemoveServiceFromWorkOrderEndpointTest`: remove → 204, link `removed`, lines still on the WO, A35 row back to Add Service, A38 lists nothing after invoicing, the invoice reset writes no completion, origin unset; invoiced WO → 409; a reset link → 409; no link → 409; foreign → 404; no WC → 403; Create work order (A33) allowed again.
- Re-run Plan 1's `CreateWorkOrderFromServiceTest` and `MarkCompleteEndpointsTest` file by file.

**Frontend:**
- `AddServiceDialog.spec.ts`:
  - the preview shows lines + hours, and parts only when `!copiesWork`; no "$" anywhere;
  - destinations per permission (both, one without a radio, none → the Add Service button is hidden);
  - "this": A37 body, lines/detail keys invalidated, `fetchWorkOrder` called, a toast "PM-A added · n lines" with Undo → A44 DELETE; Undo 409 → "This can no longer be undone";
  - "new": A33 with `created_via: 'wo_panel'`, no navigation, toast Open pushes with `locationId`;
  - 409 → the dialog stays usable and the panel refetches;
  - double submit → one request.
- `PanelServiceRow.spec.ts`: Remove → A44 and a toast; after a refetch with `addressed` the button reads Mark complete and opens `MarkCompleteDialog` with `preselectedWorkOrderId`.
- `panelRowActions.spec.ts`: Remove hidden when `!removable` or the lines atom is missing.
- `useMaintenanceWorkOrderActions.spec.ts` (extend): `navigate: false`.

#### Verification (Definition of Done gates):
**Backend:** standard + smoke (manual curl of A44 on a seeded link).

**Frontend:**
1. `admin`, WO at the schedule's home: Add Service → the dialog previews lines, hours and parts, with no price → "This
   work order" → Add Service.
   - The lines appear at the end of the Lines tab as ordinary lines (no grouping, S16-R19) and the notes count goes up
     (note "PM-A added from {schedule}", S17-R5).
   - A toast "PM-A added · n lines" with Undo appears. Click Undo: the row returns to Add Service and the lines stay.
   - Add again and wait for the toast to go: the row reads "Added · n lines" with a **Mark complete** button. The menu →
     Remove: the row returns to Add Service and the lines stay.
   - Add a second service that shares a canned line → the toast count reflects the dedupe.

   1b. Header at a non-home location: the row reads as at home with the (i). The dialog preview lists no parts. After
   adding, each line carries "Line note · Internal: Copied from {home}. Parts used there, for reference: …", at this
   location's labour rate, and no parts are added. A fixed-price line's note reads "Copied from {home}. Fixed price
   there, priced at {here}'s rate here".

   1c. Invoice the WO: Remove is gone from the menu.
2. "A new work order" in the dialog → toast with Open; you stay on the current WO. Open → the new WO (estimate) carries
   the lines. On the worklist, that row shows the new WO number (S17-R7).
3. A user with view WOs and without the lines atom sees only "A new work order" (no radio) or no Add Service at all.
4. Regression: line search on the WO still returns canned lines only (S16-N2).

#### E2E tests (e2e/)
UI-affecting (§9): yes (A37 and A44 controllers, `AddServiceAction.vue`, `AddServiceDialog.vue`). §8: n/a. **Creates: 3; Updates: 1 (4 of 5 slots).**

**Q2-1 `wo-panel-add-service-this-wo.spec.ts`: Admin adds a due service's canned lines to the open work order from the panel**
- **Type:** Happy path. **Reqs:** S16-R8, S16-R13 (Add half), S16-R17, S16-R18, S16-R20, S16-R24, S16-R25 (toast), S17-R1 (this WO), S17-R2 (panel path), S17-N1, S16-R19 (Plan 1, re-verified), NFR-F105. **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** A37 appends real lines through Plan 1's `AppendServiceLinesToWorkOrder`, and the FE has to invalidate both the panel and the WO lines/detail keys and call `fetchWorkOrder` so the lines show without a reload.
- **Preconditions:** PM-A (2 canned lines) enrolled overdue. An open WO for the vehicle at the schedule's home workplace with no lines.
- **Steps:**
  1. Open the WO and expand the panel. `button_maintenance_wo_panel_add_service_<PM-A>`. Expected: `dialog_maintenance_add_service` previews both line names with hours and the part, and no currency; the destination options `maintenance_add_service_destination_{this,new}_<PM-A>`.
  2. Choose this, then `button_maintenance_add_service_confirm`. Expected: a toast "PM-A added · 2 lines" with `button_notification_undo`.
  3. Expected without a reload: both canned-line names are on the Lines tab (`linesPage.verifyLineName`). `maintenance_wo_panel_addressed_<PM-A>` reads "Added · 2 lines"; `button_maintenance_wo_panel_mark_complete_<PM-A>` is visible; there is no Add Service button. `maintenance_wo_panel_addressed_count` shows 1.
  4. Reload. Expected: the lines and the addressed line persist.
- **Expected result:** Adding from the panel puts the service's lines on this WO, marks the row addressed and makes Mark complete the row's button.
- **Page objects / factories:** `wo-maintenance-panel.component.ts` (`addService(id)`, `addServiceDialog`); `lines.page.ts` (`verifyLineName`); `MaintenanceFactory` (Plan 1).

**Q2-2 `wo-panel-add-service-new-wo.spec.ts`: Admin adds a due service to a new work order from the panel and finds it on the worklist**
- **Type:** Happy path. **Reqs:** S17-R1 (new WO), S17-N1, S17-R7 (re-verified), S22-R1 (`wo_panel` stored), NFR-F110. **Role:** admin. **Priority:** P3.
- **Preconditions:** PM-A enrolled overdue. An open WO for the vehicle. `MR<ts>` searchable on the worklist.
- **Steps:**
  1. Panel → Add Service → the dialog → `maintenance_add_service_destination_new_<PM-A>` → `button_maintenance_add_service_confirm`. Expected: a toast naming the new WO number, with Open; the URL is still the current WO (no navigation, FD-210).
  2. `button_maintenance_open_new_work_order` (if the toast is still up; otherwise skip to step 3 and open the WO from the worklist link). Expected: the new WO is an estimate and carries both canned lines.
  3. `/customers?tab=maintenance`, search `MR<ts>`. Expected: `maintenance_worklist_wo_link_<PM-A row>` shows the new WO number.
- **Expected result:** The second destination creates a WO with the lines, keeps the user where they were, and the worklist agrees.
- **Page objects / factories:** `wo-maintenance-panel.component.ts` (`addServiceDialog`); Plan 1 `maintenance-worklist.page.ts`; `lines.page.ts`.
- **Note:** the toast auto-dismisses, so the worklist link is the reliable path (testability note B-6).

**Q2-3 `wo-panel-add-service-undo-remove.spec.ts`: Admin undoes an Add Service from the toast, adds again and removes it from the menu, and the lines stay**
- **Type:** Edge case (reversal of a user action, real link state). **Reqs:** S16-R25, S16-N4, S18-R8 (BE consequence, Dev). **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** A44 changes the server link state that A35 renders, and the lines must stay on the real WO.
- **Preconditions:** As Q2-1.
- **Steps:**
  1. Add Service → this → confirm. Click `button_notification_undo` before the toast auto-dismisses. Expected: the row shows Add Service again; both canned lines are still on the Lines tab.
  2. Add again; wait for `notification` to detach. Open `maintenance_wo_panel_menu_<PM-A>` → `maintenance_wo_panel_action_remove_<PM-A>`. Expected: the row shows Add Service; the lines are still listed (re-adding re-attaches the surviving lines, S16-R25 #25, so the count stays at the lines the WO holds; "Added · n lines" keeps counting lines deleted by hand, assumption per S16-N4).
  3. Reload. Expected: the state persists.
- **Expected result:** Undo and Remove un-address the service without deleting a line.
- **Page objects / factories:** `wo-maintenance-panel.component.ts` (`removeAction(id)`, `addServiceDialog`). **Note:** Undo races the toast timeout (B-9, the B-6 pattern); click immediately after the toast attaches; the Remove path is the stable assertion.

**Q2-U1 (Update of Q1-2 `wo-panel-mark-complete.spec.ts`): addressed state after Mark complete (TD-110)**
- **What changes in behavior:** Q2 makes A28 (`path = work_order`, no open lines link) write a `mark_complete` link, and Undo sets it `undone`. Mark complete stays in the menu on a row whose lines were not added.
- **Minimal edit:** after Q1-2 step 3, assert `maintenance_wo_panel_addressed_<PM-A>` reads "Marked complete on this work order …" and `maintenance_wo_panel_addressed_count` shows 1. After step 4 (Undo), assert the addressed line is gone. Reqs added: S16-R18, S17-E2.

**Backlog (Q2):**

| Workflow | Why deferred | Suggested file |
|---|---|---|
| A user without `workOrderLinesCreateAndEdit` (but with WO create) is offered only "A new work order", as they get no New Line today; a user with no bundle carrying `ROLE_WORK_ORDER::CREATE_AND_EDIT` gets 403 from A37 (S17-N1, §4 row 13). A37 does not refuse a holder of `workOrdersCreateAndEdit` alone, the same as `create-from-canned-line` (TD-123) | Needs a fresh custom role; ranked below the destinations and Undo/Remove | `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-role-gate.spec.ts` |
| At a non-home location Add Service copies the work (no parts, local labour rate, internal line note) (S16-N6, S16-R22, S16-R23, S16-R24) | Needs ≥2 workplaces with labour types | `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-copied.spec.ts` |

**Dev-layer (Q2):** each A37 guard (invoiced, ended enrolment, no canned lines, already on this WO, live WO elsewhere)
raises before any write; dedupe of a shared canned line (`linesSkippedAsDuplicateCount`, S17-R8); `CreatedVia::WoPanel`:
be-unit `AddServicesToWorkOrderCommandHandlerTest`. Lines appended at the end in order, internal note (S17-R5),
`entity_event`, second call 409, foreign id 404, no-WC 403, copied work at a non-home WO: be-functional
`AddServicesToWorkOrderEndpointTest`; labour-type mapping and the fixed-price note: be-unit (Plan 1 copy mode). A44 guards
(invoiced 409, reset 409, no link 409) and the exclusion of `removed` links from the step, origin and reset:
be-functional `RemoveServiceFromWorkOrderEndpointTest`. Destinations per atom, the double-submit guard (NFR-F106), 409 →
refetch, toast copy, Undo/Remove: fe-unit `AddServiceDialog.spec.ts`, `PanelServiceRow.spec.ts`. `navigate: false`: fe-unit
`useMaintenanceWorkOrderActions.spec.ts`. S17-E1, S16-N9: by construction.

**Reference updates (Q2):** R-Q2-1, verify only (Section 7, Reference updates).

### Phase Q3: Step after invoicing (and the reversal handling)

**Implements:** S18-R7 (step half), R8, R9 (display half: the line close date shown on the WO), R13 (visible, editable proposal), R14, R15, R16 (certificate Start/End dates as days), R18 (step half; BE omission, rendered); S18-N1, N5, N6; S18-E2 (step refinements; the step re-appears for a new invoice), E3 (a voided pending invoice treated as a reversal), E4, E5, E6; S18-N7 (anyone who can invoice), S18-N8 (no reopen), S18-R20 (before payment), S18-R21 (discard confirmation); S8-E3; S16-R15; S21-R1 (step); NFR-111, NFR-112, NFR-113, NFR-115, NFR-117; NFR-F101, NFR-F102, NFR-F104, NFR-F106, NFR-F107, NFR-F108, NFR-F109, NFR-F112.

**Depends on:** Q2 (link states, including `removed`), Q1 (FE). **Requires Plan 1 phases merged into the feature branch:** P2 (certificates as days: `CertificatePeriod`, `CertificateFields` Start/End dates, A17 Record) and P6, including the reversal amendment (TD-29, NFR-022), the line-close stamp (TD-18, S18-R9) and the `ResetDateField` `offers` / `disable` props (provided by Plan 1 P6; Plan 2 only passes them).

**Prerequisite in Plan 1 P6 (not repeated here):** the reversal undo (`RevertMaintenanceOnInvoiceReversedSubscriber`,
`InvoiceReversalReverter`, `MeterReadingRecorder::demoteForWorkOrder()`, `reset_basis`/`undone_reason`, the replay command
and their tests), per the Plan 1 P6 amendment (TD-29, NFR-022).

#### Database changes:
| Table | Change |
|---|---|
| `maintenance_service_completion` | `confirmed_at`, `confirmed_by` |
| `maintenance_compliance_record` | `source_work_order_id` + `mcrec__source_work_order_id_idx` |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/Application/EventListener/ResetMaintenanceOnInvoiceCreatedSubscriber.php` | Modify (Plan 1) | Carries a user date forward (3a); **re-invoice reconciliation**: links of this WO in `reset` whose completion's invoice is `VOID` or missing are undone (`undone_reason = invoice_voided`) and re-proposed against the new invoice (3a, voided-invoice row; S18-E3, #27); after undoing void-invoice completions, calls `WorkOrderReadingSettler::settle()` (Plan 1 TD-35) before the new resets |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalInvoiceFacts.php` | Modify (Plan 1) | `invoiceStatus(invoiceId)` (exists / void / gone) |
| `src/VehicleService/Maintenance/UI/HTTP/Shared/MaintenanceAccessGate.php` | Modify (Plan 1) | `guardInvoiceStep()` → `denyAccessUnlessGranted(InvoiceCreateVoter::INVOICE_CREATE)` (`ROLE_INVOICE::CREATE_AND_EDIT`, the gate of `POST /api/invoices/create`; TD-39, S18-N7) |
| `src/VehicleService/Maintenance/UI/HTTP/InvoiceStep/GetInvoiceStepController.php`, `ConfirmInvoiceStepController.php` + `DTO/GetInvoiceStepRequestDto.php`, `DTO/ConfirmInvoiceStepRequestDto.php` (+ `ConfirmedServiceDto`, `StepCertificateDto`) | Create | A38, A40; both call `guardInvoiceStep()` |
| `src/VehicleService/Maintenance/Application/Query/InvoiceStep/GetInvoiceStepQuery.php` + `Handler/InvoiceStep/GetInvoiceStepQueryHandler.php`, `Infrastructure/Persistence/Query/Dbal/DbalInvoiceStepFetcher.php` | Create | Links of this WO with `path IN (lines, no_lines)`, state `reset` (completion `invoice_id` = the requested invoice) or `unticked` (a positive list, so `removed` links never appear, S16-R25); compliance services split out (S18-E6); `nextDue` from the projection row; `currentRecord` from Plan 1 `DbalCurrentCertificateFetcher` (A17 Record: `startDate`, `endDate` as days) |
| `src/VehicleService/Maintenance/Application/Command/InvoiceStep/ConfirmInvoiceStepCommand.php` + `Handler/InvoiceStep/ConfirmInvoiceStepCommandHandler.php` | Create | Sketch Q3-a |
| `src/VehicleService/Maintenance/Domain/Model/ServiceCompletion.php` | Modify (Plan 1) | `correctTo(date, by): ServiceCompletion`, `confirm(by)` (TD-105) |
| `src/VehicleService/Maintenance/Domain/Model/ComplianceRecord.php` | Modify (Plan 1) | `fromWorkOrder(..., sourceWorkOrderId)`; correction reuses Plan 1's current-record rule |
| `src/VehicleService/Maintenance/Domain/Error/InvoiceNoLongerExistsError.php` | Create | `ConflictError` |
| `src/VehicleService/Maintenance/UI/HTTP/EnrolledService/NextDuePreviewController.php` + DTO, `Application/Query|Handler/EnrolledService/NextDuePreviewQuery(+Handler)` | Create | A39: loads the service's cycle history (Plan 1 `CompletionHistory`, `ReadingHistory`, `CurrentCertificateFetcher` for one vehicle), replaces `completion_id` with a hypothetical completion at `reset_on`, runs Plan 1 `CycleHistory` + `DueDateResolver`; covered services likewise; nothing persisted; calls `guardInvoiceStep()` |
| `src/EntityEvent/Domain/EntityEventType.php` | Modify | Event types on `MAINTENANCE_COMPLETION`: `corrected`, `unticked`, `confirmed` (labels; `reverted_by_invoice_reversal` is Plan 1) |
| `src/VehicleService/WorkOrders/Domain/Line/Service/LinesDetailProvider.php` | Modify | S18-R9 display half: `fetchWorkOrderLines()` also selects `wol.end_date` (the Plan 1 P6 stamp) and returns it per line as `end_date` (ISO datetime, null while the line is open). Additive key on `GET /api/work-orders/lines/{workOrderId}`; no new query |

#### Frontend changes (`app/`):
Every invoicing entry point reaches the same success code. The header "Create invoice", the … menu, the lines bulk bar
and the completion wizard (FR-047 `goToInvoice` → `armInvoiceCreation` → `Invoice.vue` `consumeInvoiceCreation`,
:2149–2175) all land there. So do the Finance toolbar (`onCreateInvoiceRequested`, :1436), clock-out-and-complete
(`useCompletionIntent` → wizard → the same intent) and review. Each ends in `createInvoice()` → `doCreateInvoice()` →
`initCreateInvoice` (`useAsyncAction`) → `initCreateInvoiceImpl()` → `createInvoiceMutation.mutateAsync(...).then(...)`
(:1277). **That `.then` is the only hook.** Part sales and orders reuse `Invoice.vue` with `props.type !== 'workorder'`
and are excluded.

| File | Action | Description |
|---|---|---|
| `components/ts/billing/Invoice.vue` | Modify | (1) the `useMaintenanceInvoiceStep()` instance; (2) `stepDone = maintenanceStep.run(...)` right after `setInvoice`; (3) the two `displayPayInvoiceDialog(...)` calls wrapped in `maintenanceStep.afterStep(...)`; (4) one async `<MaintenanceInvoiceStepDialog v-if>` mount. About 20 lines, all additive. No change to the guards, the over-discount warning, IBS, the deposit auto-apply branches, `.finally` or the pin-note warning |
| `components/ts/maintenance/invoicing/useMaintenanceInvoiceStep.ts` | Create | `run(workOrderId, vehicleId, companyId, invoiceId)`: no permission gate (S18-N7); FD-224 fast path from the cached A35; `fetchQuery(A38)` with a 4 s timeout, opens when non-empty, and resolves when closed. Any error resolves (NFR-F102). `afterStep(fn)` runs `fn` synchronously when no step is pending |
| `components/ts/maintenance/invoicing/MaintenanceInvoiceStepDialog.vue` | Create | `BaseFormDialog fullscreenOnPhone`, title "When was the maintenance done?" (the PRD index name for the step). Service rows, then a "Compliance certificates (optional)" section with one `CertificateFields` per compliance service (the certificate fields per S8: type prefilled from the service, Certificate number, Start date, End date as days, term; Start + term fills End, S8-R10; S18-R16, E4, E6). Primary **Confirm dates** (`:async-submit`), close X. FD-207 |
| `components/ts/maintenance/invoicing/InvoiceStepServiceRow.vue` | Create | Tick (default from `ticked`, S18-R8), name, reason "Lines added from {schedule}" (S18-R8), "Also resets: …" (S18-R7), `ResetDateField` (Plan 1, `idSuffix = _${id}`) whose initial value is A38 `proposedResetOn`, the server's proposal for that completion (`proposalBasis` `lines_closed`, `invoice_date` or `carried`, NFR-117). It is never re-derived on the FE: `linesClosedOn` and `invoicedOn` are only offered as chips beneath the field (non-null, never future), "Next due {formatDue}" from A39 (S18-R14). Unticked → the date is disabled and the row reads "Stays due" |
| `components/ts/maintenance/invoicing/invoiceStepDiff.ts` | Create | Pure: `{services: changed rows, certificates: non-empty records}` (a certificate record is non-empty when number, Start or End is set); `isEmpty`. A row is changed when its tick differs from A38 `ticked` or its date differs from A38 `proposedResetOn` |
| `api/maintenance/*` | Modify | `invoiceStepQueryOptions` (A38), `useNextDuePreviewQuery` (A39, with `completion_id`, EQ-5), `useConfirmInvoiceStepMutation` (A40) |
| `components/ts/work-orders/work-order-lines/WorkOrderLineRow.vue`, `WorkOrderLineCard.vue` (+ the line type in `components/ts/work-orders/work-order-lines/Model.ts`) | Modify | S18-R9 display half: a closed line with `end_date` shows "Closed {date}" (date in the header workplace timezone), labelled so it cannot be read as the invoice date; test id `text_work_order_line_closed_on_${lineId}`. Rendered for every closed line with `end_date` (S18-R9; R219). Additive, a few lines per file |

#### Key code changes:
**Backend.** Sketch Q3-a (A40, TD-105, NFR-111):

```php
final class ConfirmInvoiceStepCommandHandler implements CommandHandler
{
    public function __invoke(ConfirmInvoiceStepCommand $command): ConfirmedInvoiceStepDto
    {
        if (!$this->invoices->existsForWorkOrder($command->invoiceId, $command->workOrderId)) {   // reversed, removed, void
            throw new InvoiceNoLongerExistsError();
        }
        $today = $this->today->date();
        $this->transactional->begin();
        try {
            $touched = [];
            foreach ($command->services as $row) {                                   // diff only (FE)
                $link = $this->links->invoiceLinkFor($command->workOrderId, $command->invoiceId, $row->enrolledServiceId)
                    ?? throw ValidationError::field('services', 'Not on this invoice.');
                $current = $link->resetCompletionId() ? $this->completions->get($link->resetCompletionId()) : null;
                if ($this->completions->laterEffectiveExists($row->enrolledServiceId, $current)) {
                    throw new LaterCompletionExistsError();                          // superseded (S18-E2 rule)
                }
                if ($row->resetOn > $today || $this->completions->previousEffectiveAfter($row->enrolledServiceId, $current, $row->resetOn)) {
                    throw ValidationError::field("services[{$row->index}].reset_on");
                }
                match (true) {
                    !$row->ticked && null !== $current => $this->untick($link, $current, $command->user),          // S18-R8
                    $row->ticked && null === $current => $this->retick($link, $row->resetOn, $command->user),
                    $row->ticked && $current->resetOn() != $row->resetOn => $this->correct($link, $current, $row->resetOn, $command->user), // S18-R14
                    default => $current->confirm($command->user),                                                   // S18-R15
                };
                $touched[] = $link->vehicleId();
            }
            $certificates = $this->certificates->apply($command->workOrderId, $command->certificates, $command->user); // S18-R16, E4
            $this->recomputer->recomputeVehicles(array_unique([...$touched, ...$certificates->vehicleIds]));
            $this->audit->write($this->auditEntries->forStep($command));                                         // S21-R1
            $this->transactional->commit();
        } catch (\Throwable $e) {
            $this->transactional->rollBack();
            throw $e;
        }

        return ConfirmedInvoiceStepDto::from($touched, $certificates);
    }

    private function correct(WorkOrderServiceLink $link, ServiceCompletion $old, \DateTimeImmutable $on, User $by): void
    {
        $new = $old->correctTo($on, $by);                         // new row, reset_basis = user; old undone_reason = corrected
        $this->completions->add($new);
        $this->completions->save($old);
        foreach ($this->completions->coveredBy($old->id()) as $covered) {          // S18-R7: one date, covered follow
            $this->completions->save($covered->undo($by, CompletionUndoReason::Corrected));
            $this->completions->add(ServiceCompletion::covered($covered->enrolledServiceId(), $new));
        }
        $this->links->pointTo($link, $new->id());
    }
}
```

The reversal sketch is Plan 1's sketch 5b (P6 amendment).

**Frontend.** **Key code sketch: the hook in `Invoice.vue`**

```ts
// Invoice.vue <script lang="ts" setup> additions
const MaintenanceInvoiceStepDialog = defineAsyncComponent(
  () => import('@/components/ts/maintenance/invoicing/MaintenanceInvoiceStepDialog.vue'),
);
const maintenanceStep = useMaintenanceInvoiceStep();

// inside initCreateInvoiceImpl(), in the existing `.then(async () => { ... })` right after
// `invoice.value.include_declined = false; dispatch setWorkOrderField(customer_account_id)`:
if (props.type === 'workorder' && invoiceData.invoice_id && workOrder?.value?.vehicle?.id)
  maintenanceStep.start({
    workOrderId: invoice.value.work_order?.id ?? routeId.value,
    vehicleId: workOrder.value.vehicle.id,
    companyId: invoice.value.work_order?.company_id ?? null,
    invoiceId: invoiceData.invoice_id,
  });                                            // not awaited: .finally (HTML preview, creatingInvoice) is not delayed

// the two existing payment-dialog opens become:
maintenanceStep.afterStep(() => displayPayInvoiceDialog(false));   // SV-10143 partial branch
if (params.cost) maintenanceStep.afterStep(() => displayPayInvoiceDialog()); // regular branch
```
```vue
<MaintenanceInvoiceStepDialog
  v-if="maintenanceStep.isOpen.value && maintenanceStep.step.value"
  :model-value="maintenanceStep.isOpen.value"
  :step="maintenanceStep.step.value"
  :context="maintenanceStep.context.value"
  @update:model-value="(v: boolean) => !v && maintenanceStep.close()"
/>
```
```ts
// useMaintenanceInvoiceStep.ts (Create)
export function useMaintenanceInvoiceStep() {
  const queryClient = useQueryClient();
  const isOpen = ref(false);
  const step = ref<InvoiceStepDto | null>(null);
  const context = ref<InvoiceStepContext | null>(null);
  let pending: Promise<void> | null = null;   // null => nothing pending => afterStep runs synchronously
  let release: (() => void) | null = null;

  const start = (ctx: InvoiceStepContext): void => {
    // S18-N7: anyone who can invoice sees the step. FD-224: an org with no schedule skips A38 synchronously.
    const panel = queryClient.getQueryData<WorkOrderPanelDto>(maintenanceKeys.workOrderPanel(ctx.vehicleId, ctx.workOrderId));
    if (panel && !panel.organizationHasSchedules && !panel.isEnrolled) return;   // nothing pending → afterStep runs at once
    pending = (async () => {
      try {
        const data = await withTimeout(queryClient.fetchQuery(invoiceStepQueryOptions(ctx)), 4000);
        if (!data.services.length && !data.complianceServices.length) return;   // S18-N5: ordinary WO, nothing shown
        context.value = ctx; step.value = data; isOpen.value = true;
        await new Promise<void>((resolve) => { release = resolve; });
      } catch { /* untouched = accepted (S18-N5); invoicing must never fail because of this (NFR-F102) */ }
    })().finally(() => { pending = null; });
  };
  const afterStep = (fn: () => void): void => { if (pending) void pending.then(fn); else fn(); };
  const close = (): void => { isOpen.value = false; release?.(); release = null; };
  return { start, afterStep, close, isOpen, step, context };
}
```
```ts
// InvoiceStepServiceRow.vue <script lang="ts" setup> (abridged): the row starts from the server's proposal (A38)
const props = defineProps<{ row: InvoiceStepServiceDto; invoicedOn: DateString }>();
const ticked = ref(props.row.ticked);                                  // S18-R8
const resetOn = ref<DateString>(props.row.proposedResetOn);            // lines_closed | invoice_date | carried (NFR-117); never linesClosedOn ?? invoicedOn
const offers = computed(() =>                                          // alternatives beneath the field only (Plan 1 chip rule)
  [props.row.linesClosedOn, props.invoicedOn].filter((d): d is DateString => !!d));
const changed = computed(() =>                                         // feeds invoiceStepDiff (FD-207)
  ticked.value !== props.row.ticked || resetOn.value !== props.row.proposedResetOn);
```
```vue
<!-- `offers` and `disable` are ResetDateField props provided by Plan 1 P6; `idSuffix` likewise (EQ-10) -->
<ResetDateField v-model="resetOn" :offers="offers" :id-suffix="`_${props.row.enrolledServiceId}`" :disable="!ticked" />
```
Notes:
- **Auto-paid full or overflow.** No payment dialog opens, so the step simply shows.
- **Payment dialog dismissed afterwards.** That removes the invoice (F-1). The BE undoes what the step confirmed (Plan 1 P6),
  and no FE handling is needed.
- **Reversal.** `invoiceReversed` reloads the page. When the work order is invoiced again, the step shows for the new
  invoice (S18-E2).
- **Mark complete first.** A service already reset by Mark complete is not in A38 (S18-R8).

#### Unit / Integration tests:
**Backend:**
- Unit `ResetDateProposalTest` (Plan 1, extended): a user date undone by reversal is carried (`carried`).
- Unit `ServiceCompletionTest` (extended): `correctTo()` keeps the old row with `undone_reason = corrected`; `confirm()`.
- Unit `ConfirmInvoiceStepCommandHandlerTest`: untick, retick, correct, confirm-unchanged; future date and before-previous date → 400; superseded → 409; reversed invoice → 409; certificate create vs correct (`source_work_order_id`), with `start_date`/`end_date` as days through `CertificatePeriod` (End = Start + term, Start = End − term, same day number and month-end clamp, S8-R10).
- Unit `NextDuePreviewQueryHandlerTest`: the replaced completion is ignored; covered previews follow.
- Functional `tests/Functional/VehicleService/Maintenance/InvoiceReversalTest.php` (Plan 1 P6 file, extended): a line added to a `PENDING`-invoiced WO, then re-invoiced → the old completion undone (`invoice_voided`) and a new one proposed (S18-E3), and the WO's readings re-settled (Plan 1 TD-35); reverse + re-invoice after a user-corrected step date → the same date carried (`carried`). The reversal paths themselves are Plan 1's tests.
- Functional `tests/Functional/VehicleService/WorkOrders/WorkOrderLinesEndDateTest.php` (S18-R9 display half): `GET /api/work-orders/lines/{id}` returns `end_date` for a completed line and `null` for an open one; every other key unchanged.
- Functional `InvoiceStepEndpointsTest`: A38 lists only lines-path services of that invoice, excludes Mark-complete, orphaned and `removed` links, puts compliance in `complianceServices`; A38 for a reversed invoice → empty arrays; A40 correct/untick/confirm write history and audit; a later Mark complete makes A40 409; two compliance services → two records; A39 returns a different `nextDue` for a different `reset_on`; a user with `ROLE_INVOICE::CREATE_AND_EDIT` and **without** `ROLE_CUSTOMER::CREATE_AND_EDIT` gets 200 from A38/A39/A40 and can confirm (S18-N7); a user without the invoice atom 403; the default office user 403; no price key.

**Frontend:**
- `useMaintenanceInvoiceStep.spec.ts`:
  - cached A35 with `organizationHasSchedules: false` and `isEnrolled: false` → `afterStep` runs synchronously and A38 is never called; no cached A35 → A38 is called;
  - empty A38 → no dialog, `afterStep` runs once it resolves;
  - non-empty → `isOpen`; `afterStep` waits until `close()`;
  - A38 error and timeout → resolves, payment proceeds;
  - a user without CE still gets the step (S18-N7).
- `Invoice.spec.ts` (extend; every existing case must stay green):
  - org without schedules (cached A35): payment dialog timing identical (synchronous);
  - step → the step opens, then the payment dialog after close;
  - `auto_apply_status === 'full'` → step only;
  - `partial` → step, then `displayPayInvoiceDialog(false)`;
  - `type: 'partSale'` → no A38;
  - the step never delays `retrieveInvoiceHtmlPdf('html')`.
- `MaintenanceInvoiceStepDialog.spec.ts`:
  - rows ticked by default with the reason and covered names;
  - the date starts at A38 `proposedResetOn` for every basis, including `carried` (a carried date shows, not `linesClosedOn`); `linesClosedOn` / `invoicedOn` appear only as offers beneath; a future date is refused;
  - changing a date calls A39 (debounced) and updates Next due;
  - untick disables the date;
  - Confirm with no changes → no request, closes;
  - Confirm with changes → A40 diff body;
  - X untouched → closes, no request; X after an edit → discard confirmation (S18-R21);
  - the step has no reopen entry point after close (S18-N8);
  - certificate section optional, per record; posts `start_date`/`end_date`/`term_months`; 400 → field error; 409 → toast + refetch.
- `invoiceStepDiff.spec.ts`: an untouched row (including a `carried` one) is no change; a date different from `proposedResetOn` or a changed tick is.
- `WorkOrderLineRow.spec.ts` / `WorkOrderLineCard.spec.ts` (extend): a closed line shows "Closed {date}" in the workplace timezone; an open line shows nothing; every existing element of the row is unchanged.

#### Verification (Definition of Done gates):
**Backend:** standard + migration gate + smoke. Re-run `tests/Functional/Invoicing/` (reverse, remove, create) and Plan 1's
`InvoiceResetTest` and `InvoiceReversalTest`, file by file.

**Frontend:** 1. `admin`: a WO with PM-A added from the panel (Q2), every line completed on 4 Sep. Then
   `/workorders/<id>/finance` → Create invoice:
   - "When was the maintenance done?" opens first, with PM-A ticked, "Lines added from PM-A", date 4 Sep (A38's
     proposal, `lines_closed`), chips "Lines closed 4 Sep · Use invoice date (today)" and a Next due month;
   - change the date → Next due changes; Confirm dates → the payment dialog opens;
   - pay → reload → the asset tab shows PM-A counting from the chosen date.
2. Repeat the entry: header Create invoice on an unfinished WO (completion wizard path); lines bulk bar Create invoice;
   clock out and complete on a line of that WO. Each one shows the step exactly once.
3. Untick PM-A → Confirm → the asset tab still shows PM-A due. Close X untouched → proposals stand.
4. Dismiss the payment dialog after confirming → the invoice is removed → the asset tab shows PM-A not reset (Plan 1 P6, BE).
   Invoice again → the step's date shows the date entered before (A38 `proposalBasis = 'carried'`), with the lines-closed
   date only offered beneath (E2E Q3-2).
5. Reverse an invoice → invoice again → the step shows for the new invoice.
6. A compliance service on the WO → the certificates section → enter the Start date + term → End derives → after
   Confirm, the asset Compliance section reads "… · ends D Mon YYYY".
7. An ordinary WO (no maintenance) and a part sale: invoicing looks exactly as today and no step appears. In an org with
   no schedule: no `invoice-step` request and the payment dialog opens at once (FD-224).
8. Phone 390 px: the step is full screen and Confirm dates is reachable.
9. E2E invoicing specs (`e2e/src/pages/finance/finance.page.ts` consumers) pass on the branch (R-Q3-1).
10. Lines tab: a completed line reads "Closed {date}" (the date it closed, not the invoice date); an open line shows no date; every other element of the line row is unchanged (S18-R9).
11. A user who can invoice but has no customer edit: the step appears and Confirm dates works (S18-N7).

#### E2E tests (e2e/)
UI-affecting (§9): yes (A38/A39/A40 controllers, `Invoice.vue`). §8: n/a. **Creates: 3 of 5 slots.** All three invoice
through the UI and **run on stage** (B-2).

**Q3-1 `invoice-step-confirm-dates.spec.ts`: Admin invoices a work order with a maintenance service, corrects the cycle date in the step, and the service counts from it**
- **Type:** Happy path (money path). **Reqs:** S18-R8, S18-R13, S18-R14, S18-R15, S16-R15, NFR-F102 (step resolves, payment proceeds), FD-205 (S18-R20, step before payment). **Role:** admin. **Priority:** P4.
- **Why E2E (gate 4):** the step hangs off the real `POST /invoices/create` success path in `Invoice.vue`. A38 reads what Plan 1's subscriber wrote inside the invoice transaction, A39 runs the engine, and A40 writes a new completion that the asset tab must then show.
- **Preconditions:** PM-A calendar-only (Every 6 months, 2 canned lines; calendar-only keeps Next due deterministic). Enrolled with last done = today − 8 months. WO for the vehicle; PM-A added via `MaintenanceFactory.addServicesToWorkOrder` (A37). Lines completed via `workOrderFactory.changeLineStatus` (stamps `end_date` = today), WO → complete.
- **Steps:**
  1. `/workorders/<woId>/finance` → `financePage.createInvoiceAndAwaitResponse()`. Expected: `dialog_maintenance_invoice_step` opens **before** any payment dialog. `maintenance_invoice_step_row_<PM-A>` is ticked (`maintenance_invoice_step_tick_<PM-A>`), `maintenance_invoice_step_reason_<PM-A>` reads "Lines added from <schedule>", the date input holds A38's proposal, here today (`proposalBasis = 'lines_closed'`), and `maintenance_invoice_step_next_due_<PM-A>` shows a month ≈ today + 6.
  2. Set the PM-A date to `shiftDayKey(today, -40)`. Expected: `maintenance_invoice_step_next_due_<PM-A>` changes to the month of (today − 40 d) + 6 months.
  3. `button_maintenance_invoice_step_confirm`. Expected: the step dialog closes and `section_new_payment_form` becomes visible.
  4. `financePage.clearPaymentDialogPreservingInvoice()` (reload, never X). Open the asset `…/maintenance` tab. Expected: PM-A Last done = today − 40 d, and Next due matches step 2.
- **Expected result:** The proposed date can be corrected in the step, the preview follows, and the correction persists after invoicing.
- **Page objects / factories:** new `maintenance-invoice-step.dialog.ts`; `finance.page.ts`; Plan 1 `vehicle-maintenance.page.ts`; `MaintenanceFactory.addServicesToWorkOrder`.

**Q3-2 `invoice-step-dismissed-payment-carried-date.spec.ts`: Dismissing the payment dialog after the step undoes the reset, and re-invoicing proposes the user's date again**
- **Type:** Edge case (data integrity, money path). **Reqs:** S18-E2, S18-E3, NFR-117 (carry-forward), F-1, S18-R15. Builds on Plan 1 P6's reversal undo (NFR-022). **Role:** admin. **Priority:** P4.
- **Why E2E (gate 4):** the X on the payment dialog → `invoices/remove-customer-transaction` → `InvoiceReversalService::reverse()` → post-commit subscriber (Plan 1 P6) → the asset tab, then a second real invoice → A38 `proposalBasis = 'carried'` → the step row. This is the exact FE↔BE contract that testability note B-4 found mismatched in the first draft; the Q3 frontend now seeds the row from A38 `proposedResetOn`, so step 4 can pass.
- **Preconditions:** As Q3-1.
- **Steps:**
  1. Create invoice → step → set the PM-A date to today − 40 d → Confirm. Expected: the payment dialog opens.
  2. Click `button_close_payment_dialog` (deliberate: this removes the invoice). Expected: the page reloads and `button_create_invoice` is offered again (WO back to Complete).
  3. Asset `…/maintenance`. Expected: PM-A reads Overdue again (the reset and the correction were undone).
  4. Back to finance → Create invoice. Expected: the step opens for the new invoice, and PM-A's date input holds **today − 40 d** (A38 `proposedResetOn` with `proposalBasis = 'carried'`), not today (the lines-closed date, offered only beneath the field).
  5. Confirm untouched → `clearPaymentDialogPreservingInvoice()`. Expected: asset tab PM-A Last done = today − 40 d.
- **Expected result:** Removing the invoice never leaves a stale reset behind, and the user's date survives into the re-invoice.
- **Page objects / factories:** `maintenance-invoice-step.dialog.ts`; `finance.page.ts` (`createInvoiceAndAwaitResponse`, `closePaymentDialogButton`, `clearPaymentDialogPreservingInvoice`); Plan 1 `vehicle-maintenance.page.ts`; `MaintenanceFactory.addServicesToWorkOrder`.

**Q3-3 `invoice-step-compliance-certificate.spec.ts`: Admin records the inspection certificate in the step, and it appears on the asset card**
- **Type:** Happy path. **Reqs:** S18-R16, S8-R10, S18-E6, S18-E4 / S8-E3 (one record per inspection; the two-record variant is Dev). **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** A40 `certificates[]` creates a `ComplianceRecord` with `source_work_order_id` through Plan 1 `CertificatePeriod`, and Plan 1's compliance section on the asset card has to render it.
- **Preconditions:** Compliance "CVIP" term 12 with one canned line ("CVIP inspection <ts>"), no record. Enrolled. CVIP added to a WO via A37. Lines completed, WO → complete.
- **Steps:**
  1. Create invoice. Expected: the step shows a "Compliance certificates (optional)" section with `maintenance_invoice_step_certificate_<CVIP>`, and **no** CVIP row in the dates list (S18-E6).
  2. Enter certificate number `C-<ts>`, Start date = today, term 12. Expected: End date = today + 12 months (Plan 1 `CertificateFields`, same-day arithmetic, S8-R10).
  3. Confirm → `clearPaymentDialogPreservingInvoice()` → asset card. Expected: `maintenance_compliance_record_<id>` reads "CVIP · C-<ts> · ends <D Mon YYYY+1>".
- **Expected result:** The certificate captured at invoicing lands as the asset's current compliance record.
- **Page objects / factories:** `maintenance-invoice-step.dialog.ts` (`certificateFields(id)`); `finance.page.ts`; Plan 1 `vehicle-maintenance.page.ts`; `MaintenanceFactory.addServicesToWorkOrder`.

**Backlog (Q3):**

| Workflow | Why deferred | Suggested file |
|---|---|---|
| Reverse an invoice from the invoice menu → invoice again → the step re-appears for the new invoice (S18-E2 via `reverse-invoice`; the FE reloads through `invoiceReversed`) | Same BE reverter as Q3-2 (one representative, §5). Separate UI path through `financePage.confirmReverse`; ranked below Q3-2 | `e2e/tests/ui/maintenance-reminders/invoice-step-after-reverse.spec.ts` |
| A user who can invoice but lacks customer edit sees the step and can confirm dates (S18-N7) | Needs a custom role with invoice and no CE | `e2e/tests/ui/maintenance-reminders/invoice-step-role-gate.spec.ts` |

**Dev-layer (Q3):** untick → "Stays due" and no reset (S18-R8 untick): be-functional `InvoiceStepEndpointsTest` + fe-unit
`MaintenanceInvoiceStepDialog.spec.ts`. Ordinary WO / part sale / org without schedules (FD-224) → no step and identical payment timing
(S18-N5, NFR-F101, NFR-F102 error/timeout): fe-unit `useMaintenanceInvoiceStep.spec.ts`, `Invoice.spec.ts`. An E2E on an
ordinary WO would pass even with A38 broken, because any error resolves as "accepted", so it has no failure mode. Every
invoicing entry point (wizard, bulk bar, clock-out-and-complete) shows the step exactly once: fe-unit `Invoice.spec.ts`
(single hook, §5 entry-point variation). Covered services follow the coverer (S18-R7): be-unit
`ConfirmInvoiceStepCommandHandlerTest`. Mark-complete resets, orphaned and `removed` links not listed (S18-R8, S18-R18, S16-R25), reversed
invoice → empty / 409, a later completion → 409, two compliance services → two records (S18-E4), A39 previews, invoice-create gate (S18-N7: no-CE 200, no-invoice 403),
no price key: be-functional `InvoiceStepEndpointsTest`. `correctTo` keeps the old row (NFR-111), audit (S21-R1): be-unit
`ServiceCompletionTest`. VOID-by-added-line reconciliation (S18-E3) with readings re-settled, and carry after reverse: be-functional `InvoiceReversalTest`
(Plan 1 file, extended). X after edit → discard confirmation (S18-R21), no reopen (S18-N8), future date refused, 400 field error: fe-unit.
Phone full screen (NFR-F108): fe-unit. Line close date shown on the WO (S18-R9 display half): be-functional
`WorkOrderLinesEndDateTest` + fe-unit `WorkOrderLineRow.spec.ts`. S18-N1, N6, E5: by construction.

**Reference updates (Q3):** R-Q3-2 and R-Q3-3 are **edits** to Plan 1's planned P6-1 and P7-1 specs (the step now opens
before the payment dialog); R-Q3-1, R-Q3-4 and R-Q3-5 are verify / re-run (Section 7, Reference updates). When Q3-2 is written,
refresh the `finance.page.ts:817-826` docstring (comment drift).

### Phase Q4: Origin column

**Implements:** S22-R1 (Plan 2 half: an Add Service link is an origin), S22-R2 (plain text without Settings, #14), R3, R4 (filter + "… · Work order total", each WO's whole total, #13), N1, N2, N3 (Mark complete not an origin), E1, E2; NFR-108, NFR-109, NFR-115; NFR-F101, NFR-F110.

**Depends on:** nothing in Plan 2 for its code: the origin rule reads every `lines` / `no_lines` link whatever its `created_via`, so `wo_panel` links count as soon as Q2 writes them. Q4 may run in parallel with Q2/Q3; only its E2E update Q4-U1 (an edit to Q2-2) lands after Q2. **Requires Plan 1 phases merged into the feature branch:** P6 (links).

#### Database changes:
None (Plan 1 `mwos__work_order_id_state_idx` serves both reads).

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `tests/Functional/VehicleService/WorkOrders/WorkOrderListCharacterizationTest.php` | Create | First (NFR-109): pins rows, pagination and `totalWorkOrderPrice` (the per-page sum, as today) for a seeded set, with and without filters, both types |
| `src/VehicleService/WorkOrders/Domain/Service/WorkOrderMaintenanceOriginProvider.php` | Create | Port: `originsFor(list<string> $workOrderIdsBytes): array<string, MaintenanceOrigin>`, `applyOriginFilter(QueryBuilder $qb, string $woAlias): void` (no availability switch: no flag, D27) |
| `src/VehicleService/WorkOrders/Domain/Service/MaintenanceOrigin.php` | Create | Value object `{scheduleId, scheduleName}` (no `workplaceId`: schedules are org-wide, GR-6) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderMaintenanceOriginProvider.php` | Create | Sketch Q4; bound to the decorator org |
| `src/VehicleService/WorkOrders/Application/List/ListingQueryHandler.php` | Modify | After the page loop: `if (Type::PARTS !== $query->type)` merge `maintenanceOrigin` per row (always; page-bounded, indexed, TD-41c); `maintenanceOrigin` filter field routed to `applyOriginFilter()` only when present |
| `src/VehicleService/WorkOrders/Application/List/ListingController.php`, `ListingQuery.php` | Modify | Read the optional `totals` query param (`'1'` only) into `ListingQuery::$withFilteredTotals` (default false) |
| `src/VehicleService/WorkOrders/Application/List/ListingQueryHandler.php` (same file as above) | Modify | `filteredTotals(ListingQuery)` per TD-112: `buildQuery($query)` → select `wo.id, wo.total_price` + `GROUP BY wo.id`, no ORDER BY / LIMIT → wrapped `SELECT COUNT(*), COALESCE(SUM(t.total_price), 0)`; merged as `pagination.filteredTotals` only when `withFilteredTotals`; `totalWorkOrderPrice` null without `allowPricing`. The page-loop `totalWorkOrderPrice` is untouched |
| `src/VehicleService/WorkOrders/Application/List/DTO/WorkOrderDto.php` | Modify | `public ?array $maintenanceOrigin = null` |
| `config/services.yaml` (or the Maintenance services file Plan 1 adds) | Modify | Alias the port to the Maintenance adapter; a null implementation is not needed |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `pages/WorkOrders.vue` | Modify | Unconditional column `{name: 'maintenanceSchedule', label: 'Maintenance schedule', sortable: false, selected: true, required: false}` after `linesCount` (FD-213). `#body-cell-maintenanceSchedule` → `MaintenanceOriginCell`. FilterDef `maintenanceOrigin` + `getFilters` push (FD-214), both always present. While that filter is on, `loadData` also sends `totals=1` and a summary line above the table (and above the mobile list) reads "{workOrderCount} work orders · {total} · Work order total" from `pagination.filteredTotals` (S22-R4); without `seeFinancialData()` "{workOrderCount} work orders"; test id `text_work_orders_maintenance_totals`. It never uses the accumulated page total. Mobile `WorkOrderCardMobile` unchanged |
| `components/ts/work-orders/WorkOrdersBoardModel.ts` | Modify | `WorkOrderBoardRow.maintenanceOrigin?: { scheduleId: UUID; scheduleName: string } \| null` |
| `components/ts/maintenance/work-order/MaintenanceOriginCell.vue` | Create | Empty for null (S22-R3). Link to `MaintenanceScheduleEditor` when `settingsService` (schedules are org-wide; any location opens them), else plain text (S22-R2). No workplace-equality branch. `@click.stop` so the row click does not open the WO |

#### Key code changes:
**Backend.** Sketch Q4 (TD-112):

```php
public function originsFor(array $workOrderIds): array          // ≤ page size
{
    $rows = $this->connection->createQueryBuilder()
        ->select('BIN_TO_UUID(l.work_order_id) AS workOrderId', 'BIN_TO_UUID(e.schedule_id) AS scheduleId',
                 'e.schedule_name AS scheduleName', 'l.created_at')
        ->from(WorkOrderServiceLink::TABLE_NAME, 'l')
        ->innerJoin('l', EnrolledService::TABLE_NAME, 's', 's.id = l.enrolled_service_id')
        ->innerJoin('s', Enrolment::TABLE_NAME, 'e', 'e.id = s.enrolment_id')
        ->where('l.work_order_id IN (:ids)')
        ->andWhere("l.path IN ('lines','no_lines')")                          // S22-N1; mark_complete is not an origin
        ->andWhere("l.state <> 'removed'")                                    // S16-R25: an undone Add Service is not an origin
        ->orderBy('l.created_at', 'ASC')->addOrderBy('l.id', 'ASC')
        ->setParameter('ids', $workOrderIds, ArrayParameterType::BINARY);
    $this->organizationDecorator->decorateQuery($rows, 'l.organization_id');

    $origins = [];
    foreach ($rows->executeQuery()->iterateAssociative() as $row) {
        $origins[$row['workOrderId']] ??= new MaintenanceOrigin($row['scheduleId'], $row['scheduleName']); // earliest wins (S22-E1)
    }

    return $origins;
}

public function applyOriginFilter(QueryBuilder $qb, string $woAlias): void
{
    $qb->andWhere(sprintf("EXISTS (SELECT 1 FROM %s mo WHERE mo.work_order_id = %s.id AND mo.organization_id = :moOrg AND mo.path IN ('lines','no_lines'))",
            WorkOrderServiceLink::TABLE_NAME, $woAlias))
       ->setParameter('moOrg', $this->organizationDecorator->getOrganizationIdBytes());
}
```

**Frontend.** No sketch beyond the table: an unconditional column and a FilterDef, the `totalPrice` and `vehicleHere` precedents (FD-213, FD-214).

#### Unit / Integration tests:
**Backend:**
- Characterization test first (above), green before and after.
- Unit `ListingQueryHandler` merge test (fake provider): origin merged per row; provider not called for `type=parts`.
- Functional `tests/Functional/VehicleService/Maintenance/WorkOrderOriginTest.php`: WO from the worklist → origin = that schedule; hand-made WO → null (S22-N1, R3); a service added later to a WO that already had an origin keeps the first (S22-E1); a hand-made WO with a panel Add Service gets an origin; a WO whose only link is from A37 (Add Service to an existing WO) has that origin (S22-R1); Mark complete on a WO → no origin (S22-N3); a panel Add Service later removed (A44) → no origin; filter `maintenanceOrigin=1` returns only origin WOs; with `totals=1` and `rowsPerPage=2` over three origin WOs, `filteredTotals.workOrderCount = 3` and `filteredTotals.totalWorkOrderPrice` = the sum of all three `total_price` values while `totalWorkOrderPrice` stays the page sum; `filteredTotals` sums the whole `total_price` of each matching WO, not the lines a service added (S22-R4); search and status filters narrow the aggregate as they narrow the rows; a WO at another workplace and another org's WO are excluded; `allowPricing` false → `totalWorkOrderPrice: null`, count kept; no `totals` → no `filteredTotals` key; another org's links never leak.

**Frontend:**
- `WorkOrders.spec.ts` (extend):
  - the column is in the columns array and `defaultColumnsMap()`; a saved prefs blob without `maintenanceSchedule` shows it by default (the `applyColumns` fallback); the filter sends `maintenanceOrigin` and `totals=1`;
  - the totals line reads '{n} work orders · {total} · Work order total' from `filteredTotals` (not the accumulated page total), hides the amount without `seeFinancialData`, and is absent when the filter is off.
- `MaintenanceOriginCell.spec.ts`: null → empty; link vs plain text by permission only (no workplace-equality branch); click does not
  propagate.

#### Verification (Definition of Done gates):
**Backend:** standard + smoke (`/api/work-orders` is in the curated list). Performance: `EXPLAIN` of the filtered list and
p95 of the unfiltered list on the largest seeded org before/after, pasted in the PR (NFR-108).

**Frontend:** `admin` `/workorders`:
- WOs created from the worklist, the asset and the panel show the schedule name; a hand-made WO shows an empty cell;
- click the name → the schedule editor;
- "From maintenance" chip → only origin WOs, and the totals line reads "{n} work orders · {total} · Work order total" for all of them (compare with a page size smaller than the result set);
- column hide/show persists across a reload.

Regression: a saved column layout from develop loads with the new column visible and every other column as saved; the
column picker gains one entry. `tech`: plain text, no link.

#### E2E tests (e2e/)
UI-affecting (§9): yes (`pages/WorkOrders.vue`, new `MaintenanceOriginCell.vue`). The list controller's handler changes,
but the controller file does not. §8: n/a. **Creates: 1; Updates: 1 (2 of 5 slots).**

**Q4-1 `work-orders-maintenance-origin.spec.ts`: The Work Orders list names and links the maintenance schedule a work order came from**
- **Type:** Happy path. **Reqs:** S22-R2 (link when `settingsService`, plain text without Settings; schedules are org-wide), S22-R3, S22-N1. **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** A42′ joins the origin per page with a real link set, the FE adds a column through the saved-preferences machinery, and the cell link must not trigger the row click.
- **Preconditions:** Fresh customer + vehicle enrolled in schedule `MR-E2E Origin <ts>` (PM-A with canned lines). WO A via `MaintenanceFactory.createWorkOrderForService(id, 'asset')` (A33, origin set). WO B via `workOrderFactory.create` for the same customer (hand-made).
- **Steps:**
  1. `/workorders`; narrow to the customer (search). Ensure the "Maintenance schedule" column is visible (`toggle_column_maintenanceSchedule`; the admin may have saved column prefs). Expected: the header "Maintenance schedule" is present.
  2. Expected: `link_work_orders_maintenance_schedule_<A>` reads `MR-E2E Origin <ts>`. WO B's row has no link and no text (empty cell).
  3. Click the link. Expected: the URL is `/maintenance-schedules/<scheduleId>` (the schedule editor), not the WO.
- **Expected result:** Maintenance-originated WOs show their schedule as a working link, and hand-made WOs show nothing.
- **Page objects / factories:** `work-orders.page.ts` (extended: `maintenanceScheduleLink(woId)`, `maintenanceScheduleText(woId)`, `ensureColumnVisible('maintenanceSchedule')`); `MaintenanceFactory.createWorkOrderForService`; `workOrderFactory.create`.

**Q4-U1 (Update of Q2-2 `wo-panel-add-service-new-wo.spec.ts`): a panel-created WO counts as an origin (EQ-12)**
- **What changes:** Q4 renders `maintenanceOrigin` for `created_via = wo_panel` WOs.
- **Minimal edit:** append a step: `/workorders` → the new WO's row shows `link_work_orders_maintenance_schedule_<newWoId>` with the schedule name. Reqs added: S22-R2 (panel origin), S22-E1 write side.

**Backlog (Q4):** none.

**Dev-layer (Q4):** the "From maintenance" filter returns only origin WOs and `filteredTotals` sums all of them across
pages (S22-R4, each WO's whole total), earliest origin wins (S22-E1), an A37 link is an origin (S22-R1), Mark complete is not an origin
(S22-N3), hand-made → null, tenant isolation: be-functional `WorkOrderOriginTest`, `WorkOrderListCharacterizationTest` (NFR-109). Filter
persistence is already E2E-covered generically (`tests/ui/work-orders/filters-persistence.spec.ts`), so the maintenance
predicate adds no E2E (`test-scope-rules.md` §8). Column in `defaultColumnsMap()`, prefs fallback; the filter sends `maintenanceOrigin` and `totals=1`; the totals line copy "{n} work orders · {total} · Work order total": fe-unit `WorkOrders.spec.ts`. Link vs plain text by
permission, `@click.stop`: fe-unit `MaintenanceOriginCell.spec.ts`. Merge skipped for `type=parts`: be-unit.
S22-N2, E2: by construction / none.

**Reference updates (Q4):** R-Q4-1 … R-Q4-5, verify only (Section 7, Reference updates). Testability note B-8: confirm the
column picker generates `toggle_column_maintenanceSchedule`.

### Phase Q5: Work order split

**Implements:** S16-E3 (split half; still on the Chunk 2 page, the merge half is Plan 1), NFR-114 (its partial-split refinement), NFR-110; closes Plan 1 risk R13.

**Depends on:** Nothing in Plan 2. Q5 may run in parallel with Q2/Q3. **Requires Plan 1 phases merged into the feature branch:** P6.

#### Database changes:
None.

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/Application/EventListener/MoveMaintenanceLinksOnWorkOrderSplitSubscriber.php` | Create | `DomainEventSubscriber` on `App\VehicleService\WorkOrders\Domain\WorkOrderSplitted`. Sketch Q5 |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Repository/Dbal/DbalWorkOrderServiceLinkRepository.php` | Modify (Plan 1) | `openLinesLinksForWorkOrder()` (state `open` only, a positive list, so `removed` links never move), `moveToWorkOrder(linkId, newWorkOrderId)` |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalLineWorkOrderLocator.php` | Create | `work_order_id` per `work_order_line.id` (deleted lines absent), org-scoped |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| — | — | No FE change (FD-217). `WorkOrderLines.vue` `newWorkOrderFromSelectedLines` (:2268) navigates to the new WO, whose panel is a fresh key |

#### Key code changes:
**Backend.** Sketch Q5:

```php
public function __invoke(WorkOrderSplitted $event): void            // inside the split transaction, lines already flushed
{
    try {
        $this->connection->beginTransaction();                       // savepoint
        foreach ($this->links->openLinesLinksForWorkOrder($event->getSplittedWorkOrderId()) as $link) {
            $where = $this->lineLocator->workOrderOf($link->lineIds());          // only lines that still exist
            if ([] !== $where && [] === array_diff(array_unique(array_values($where)), [(string) $event->getNewWorkOrderId()])) {
                $this->links->moveToWorkOrder($link->id(), $event->getNewWorkOrderId());   // NFR-114: all moved → link moves
                $this->audit->write($this->auditEntries->linkMoved($link, $event));
            }                                                                    // partial or none moved → stays (TD-113)
        }
        $this->connection->commit();
    } catch (\Throwable $e) {
        $this->connection->rollBack();
        $this->logger->error('maintenance.work_order_split_failed', ['work_order_id' => (string) $event->getSplittedWorkOrderId(), 'exception' => $e]);
    }
}
```

**Frontend.** None (FD-217).

#### Unit / Integration tests:
**Backend:**
- Unit `MoveMaintenanceLinksOnWorkOrderSplitSubscriberTest`: all lines moved → link moves; some moved → stays; none moved → stays; `mark_complete`, `no_lines` and `removed` links untouched; repository failure → logged, no exception.
- Functional `tests/Functional/VehicleService/Maintenance/WorkOrderSplitTest.php` through `POST /api/work-orders/split`: invoicing the new WO resets the moved service (Plan 1 subscriber) and the original WO's invoice does not; a split moving half the lines leaves the link on the original; the split still succeeds when the subscriber is forced to fail.
- Re-run the existing split functional tests file by file.

**Frontend:** none.

#### Verification (Definition of Done gates):
**Backend:** standard + smoke.

**Frontend:** on a WO with PM-A lines plus other lines, select the PM-A lines → Split → the new
WO's panel shows "PM-A on this work order"; Back → the original WO no longer does. A service marked complete stays on
the original. Invoicing the new WO → the step lists PM-A.

#### E2E tests (e2e/)
UI-affecting (§9): **no** (a BE subscriber plus DBAL only; no controller, no `app/` file, FD-217). **Skip reason (§8):
`None — no-fe-diff`.** Creates: 0.

Why no Create even though it is a real workflow: gate 2 decides it. `POST /api/work-orders/split` followed by A35/A38
observes the link move, and `WorkOrderSplitTest` does exactly that. The FE split navigation is unchanged and already
E2E-covered (C290/C291/C2189).

**Dev-layer (Q5):** NFR-114 all-moved / partial / none, `mark_complete` and `no_lines` stay, failure logged and the split
still succeeds (NFR-110): be-unit `MoveMaintenanceLinksOnWorkOrderSplitSubscriberTest`; be-functional `WorkOrderSplitTest`
(invoicing the new WO resets the moved service, the original does not).

**Reference updates (Q5):** R-Q5-1, re-run set (Section 7, Reference updates).

### Phase Q6: Send reminder by hand (existing send email dialog)

**Implements:** S14-R4, R5, R6, R9, R10, R12, R13, S14-N1, S14-N2/N4 (re-verified), S14-E2, E3; S21-R5; S19-R1..R9 (R3 with Add email; R6/R7 the worklist window, else the next two; R9 Soon, no confidence wording), R14..R19 (R19 one or two names), R21, R23, N3, N5, N7, N8, E4; S11-N1; S12-R9; NFR-101 (rewritten), NFR-103, NFR-106, NFR-112, NFR-113, NFR-115, NFR-118, NFR-119, NFR-120; NFR-F106, NFR-F107, NFR-F111. No send switch (D29): Q6 ships with the branch. The footer ships as specified in S19-R15; legal (postal address, unsubscribe) is a non-blocking fast follow (#31 ✅ 918945793). S19-R23 (nothing dated, #30 ✅) and S19-R19 (a typed address does not change the greeting, #32 ✅) answered 2026-10-05 (918945793).

**Depends on:** Nothing in Plan 2. **Requires Plan 1 phases merged into the feature branch:** P7 (worklist, `ContactCard` `#actions` slot, A30 with `customerHasEmail`, `WorklistPredicates`; Plan 1 `ConfidenceTable` from P4; `EntityEventWriter`); the existing A16 company read (contacts) and `components/shared/SendEmailDialog.vue`.

#### Database changes:
| Table | Change |
|---|---|
| `maintenance_reminder_send`, `maintenance_reminder_send_item` | Create (migration Q6; Section 4.1); one hand FK in `MANUALLY_MANAGED_FOREIGN_KEYS` |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/VehicleService/Maintenance/Domain/Model/Reminder/ReminderSend.php`, `ReminderSendItem.php`, `ReminderItemState.php` | Create | Aggregate: one row per hand send, recipients JSON, immutable once written (`ReminderSend::fromComposed(...)`) |
| `src/VehicleService/Maintenance/Domain/Repository/ReminderSendRepository.php`, `Infrastructure/Persistence/Repository/Dbal/DbalReminderSendRepository.php`, `Infrastructure/Persistence/Repository/Doctrine/ReminderSend.orm.xml`, `ReminderSendItem.orm.xml` | Create | DBAL writes; mappings so SQLite tests and the diff gate see the tables |
| `src/VehicleService/Maintenance/Domain/Service/Reminder/ReminderDueLabel.php` | Create | Month label ("October 2026"); a day for a certificate ("14 Oct 2026", `DueDto` precision `day`); "Soon" whenever the winning candidate is a meter estimate, at any confidence (a guessed date, every Low included; S19-R9 as revised 2026-10-05, S11-N1); never any confidence wording; calendar → month |
| `src/VehicleService/Maintenance/Domain/Service/Reminder/ReminderStage.php` | Create | Pure: `state()` (Past due / Due today / Coming up). No window (TD-37), no stage index, no change detection |
| `src/VehicleService/Maintenance/Domain/Service/Reminder/ReminderRecipients.php` | Create | VO: validates `email_list` (format, 1–30, deduped), matches `contact_ids` to their emails (each must be in `email_list`), `greeting()` per S19-R19 from the ticked contacts in `contact_ids` order: 1 → "Hi A,"; 2 → "Hi A and B,"; ≥ 3 or 0 named → "Hello,"; typed addresses do not change it (S19-R19; #32 ✅ 918945793) |
| `src/VehicleService/Maintenance/Application/Service/Reminder/ReminderComposer.php` | Create | `defaultContent(items, unit)` (the fixed S19-R2 wording, shared with A43; with no items, the S19-R23 line "Nothing is scheduled for {unit} yet." instead); `compose()` renders greeting, the user's content (the prefilled wording, possibly edited; HTML-escaped, then `nl2br`, NFR-119), the reminder table (none when `$items === []`: the content is then the `nothingScheduledLine`, S19-R23), the call to action (header-location telephone, or none, S19-R21), the invoice-style signature (user name, org name, header-location telephone) and the S19-R15 footer through `templates/email/maintenance/maintenance-reminder.html.twig`; no money (NFR-115) |
| `src/VehicleService/Maintenance/Domain/Service/ReminderMailer.php`, `Infrastructure/Mail/SymfonyReminderMailer.php` | Create | TD-115: `TemplatedEmail`, `to(...$emailList)`, From `"<org name>" <REPLY_EMAIL_SENDER>`, Reply-To = the user, BCC = the user when `include_bcc`; + the allowlist guard `MAINTENANCE_REMINDER_RECIPIENT_ALLOWLIST` (TD-40: empty = no restriction; non-empty = drop and log every other address) |
| `src/VehicleService/Maintenance/Domain/Service/OrganizationContactDetails.php` + its DBAL adapter | Create | Org name, header-workplace name and telephone (org-scoped `workplace` read) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalCustomerEmailContactsFetcher.php` | Create | Validates `contact_ids` against the company's contacts with an email, org-scoped (NFR-112) |
| `src/VehicleService/Maintenance/Application/Command/Reminder/SendManualReminderCommand.php`, `Handler/Reminder/SendManualReminderCommandHandler.php` | Create | Sketch Q6 (TD-37, TD-122, TD-126): insert + send in one transaction; errors per A41 |
| `src/VehicleService/Maintenance/Application/Query/Reminder/ReminderPreviewQuery.php`, `Handler/Reminder/ReminderPreviewQueryHandler.php`, `UI/HTTP/Reminder/ReminderPreviewController.php` + DTO | Create | A43: `subject`, `content` (= `defaultContent(items, unit)`), `callToAction` (null without a header telephone), `items[]` with BE-built `dueLabel` (TD-37), `nothingScheduledLine` (set only when `items` is empty; `content` is then that line, S19-R23), `locationTelephone`. No contacts (the FE reads A16) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalManualReminderItemsFetcher.php` | Create | That pair's rows through Plan 1 `WorklistPredicates` (window ≤ today + 91, not skipped, not resting, compliance with a record); fallback: the two earliest dated services of the pair (not skipped; resting included), state `coming_up` (TD-37, S19-R6/R7). The same rows as A30 for that pair |
| `src/VehicleService/Maintenance/UI/HTTP/Reminder/SendManualReminderController.php` + `DTO/SendManualReminderRequestDto.php` | Create | A41: `vehicle_id`, `company_id`, `contact_ids[]` (`Assert\All(Assert\Uuid)`), `email_list[]` (`Assert\Count(min: 1, max: 30)`, `Assert\All(Assert\Email)`), `include_bcc`, `email_content` (≤ 5,000) |
| `src/VehicleService/Maintenance/Domain/Error/NotificationsOffError.php`, `NoPreferredContactError.php` (`ConflictError`), `ReminderSendFailedError.php` (`DomainError`) | Create | A41/A43 errors. **Not created:** `NothingToRemindError` (S14-R13; reconciled 2026-10-05), `ReminderSendingUnavailableError` (D29), `ReminderJustSentError` (the 60 s guard is dropped, TD-122) |
| `src/VehicleService/Maintenance/Infrastructure/Persistence/Query/Dbal/DbalWorklistLastSentFetcher.php` (beside Plan 1 `DbalWorklistFetcher`) | Create / Modify (Plan 1) | A30′ for the page's pairs: `lastSentAt` only from `maintenance_reminder_send` (`customerHasEmail` is Plan 1 P7; `hasReminderItems` removed) |
| `templates/email/maintenance/maintenance-reminder.html.twig` | Create | Extends `email/base.html.twig`; fixed copy (Product); the S19-R15 footer; no table block when there are no items (S19-R23); autoescaped; user content is passed already escaped + `nl2br`, never `|raw` on raw input (NFR-119) |
| `src/EntityEvent/Domain/EntityEventType.php` | Modify | `MAINTENANCE_REMINDER_SEND` and `CUSTOMER_CONTACT` (A45) + labels (written by the acting user) |
| `config/services.yaml`, `.env`, `.env.test` | Modify | No send switch (D29); `REPLY_EMAIL_SENDER` bound as a parameter; `MAINTENANCE_REMINDER_RECIPIENT_ALLOWLIST` (TD-40, empty by default) |
| `src/Shared/Infrastructure/Doctrine/Schema/ExpressionIndexFilteringMySQLSchemaManager.php` | Modify | Add `maintenance_reminder_send_item__send_id_fk` |
| Non-production mail delivery (environment config, agreed with ops) | Modify | NFR-118, TD-40: before the branch build is deployed to QA or any non-production environment with cloned data, mail sent through `SymfonyReminderMailer` goes only to a mail sink or the allowlist, never to a real customer address |
| `src/Customer/Contacts/UI/HTTP/AddEmail/AddContactEmailController.php` + `DTO/AddContactEmailRequestDto.php` | Create | A45 (TD-38): `#[Route('/api/customers/{companyId}/contacts/{contactId}/email', methods: ['PATCH'])]`, `#[IsGranted(PermissionEnum::ROLE_CUSTOMER_CREATE_AND_EDIT)]`; DTO with non-nullable `#[MapEntity] Company`, `contactId` (`Assert\Uuid`), `email` (`NotBlank`, `Email`, `Length(max: 255)`) |
| `src/Customer/Contacts/Application/Command/AddEmail/AddContactEmailCommand.php`, `Application/Handler/AddEmail/AddContactEmailCommandHandler.php` | Create | `Transactional`; contact by id and company (404); 409 when it already has an email; `setEmail(new CustomerEmail(...))` (plus `CustomerEmail::isValid()`); `CustomerFactory::update()`; dispatch `CustomerUpdatedEvent` (portal webhook parity); `EntityEventWriter::write()` (`CUSTOMER_CONTACT` / `email_added`, old `null` / new address, refs contact + company, workplace = header); application logs carry ids only |
| `src/Customer/Contacts/Domain/Error/ContactAlreadyHasEmailError.php` | Create | `ConflictError` (A45 never overwrites; editing an address stays in the contact form) |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `components/shared/SendEmailDialog.vue` | Modify (additive, FD-223) | Props `greetContactByName`, `initialContent`, `listAllContacts` (all default off); `v-if="message"` on the fixed message `<p>`; slots `after-content` and `contact-no-email`; `sendEmail` payload + `contactIds`; greeting `<p data-test-id="text_send_email_greeting">`; no-email text `text_send_email_contact_no_email_${id}` (only under `listAllContacts`). Defaults keep every consumer byte-identical (NFR-F111, R215) |
| `components/shared/tests/SendEmailDialog.spec.ts` | Modify | Default render unchanged ('Hello,', empty content, no slot output, only contacts with an email, today's first-with-email fallback); a non-empty `message` renders exactly as today (`message` + ".", and `invoiceNumber` variant). `listAllContacts`: every contact listed; one without email is disabled, shows 'No email' and the slot; the default contact is ticked only with an email; no fallback tick; a contacts refetch (a contact gaining an email) leaves the ticks as they were and makes that contact tickable. `greetContactByName`: one ticked → 'Hi {first last},'; two → 'Hi A and B,' with the default contact first; three → 'Hello,'; none ticked + typed address → 'Hello,'; one ticked + typed address → 'Hi {first last},'; last name null → 'Hi {first},'. `initialContent` prefills the box; `message=""` renders no message `<p>`; `after-content` renders; payload `contactIds` in greeting order |
| `components/ts/maintenance/worklist/SendReminderButton.vue` | Create | Inside the `#actions` slot: "Last sent {date}" (S14-R12) and `Button` "Send reminder" (S14-R5); states per FD-216 (disabled only for notifications off); click → `SendReminderDialog` |
| `components/ts/maintenance/worklist/SendReminderDialog.vue` | Create | FD-222 wrapper: `useCompanyQuery(companyId)` (contacts), `useReminderPreviewQuery(vehicleId, companyId)` (A43), header telephone; renders `SendEmailDialog` (`doc-type="Maintenance reminder"`, `scenario="reminder"`, `:default-contact-id="row.contact.contactId"`, `greet-contact-by-name`, `:initial-content` = A43 `content`, `message=""` (hidden by the `v-if` guard; never null, which throws), `list-all-contacts`, `:loading-data`) with `ReminderPreviewTable` (no table when `nothingScheduledLine` is set; the line is then the prefilled content, S19-R23) and then the read-only `callToAction` (when not null) in `#after-content`; the `#contact-no-email` slot with Add email (CE) → `AddContactEmailDialog`; `@send-email` → A41; success → `clearData()`/`closeDialog()`, toast, invalidate the worklist; failure → `emailSending = false` |
| `components/ts/maintenance/worklist/ReminderPreviewTable.vue` | Create | Read-only rows unit · service · due label · state (S19-R8; labels from A43, the FE derives none; `coming_up` fallback rows render as Coming up); when A43 `nothingScheduledLine` is set it renders no table (the line is the prefilled content, S19-R23); `maintenance_reminder_preview_table`, `maintenance_reminder_preview_row_${enrolledServiceId}` |
| `components/ts/maintenance/worklist/MaintenanceRemindersTab.vue` | Modify (Plan 1) | Fills the `ContactCard` `#actions` slot with `SendReminderButton :row` |
| `api/maintenance/*` | Modify | `useReminderPreviewQuery` (A43, key `reminderPreview`), `useSendReminderMutation` (A41 reshaped); `WorklistRowDto.lastSentAt` (`customerHasEmail` is Plan 1); `ReminderPreviewDto.nothingScheduledLine: string \| null` |
| `components/ts/maintenance/worklist/AddContactEmailDialog.vue` | Create | FD-225 |
| `components/ts/maintenance/worklist/tests/AddContactEmailDialog.spec.ts` | Create | Sends PATCH A45 `{email}` to `customers/{companyId}/contacts/{contactId}/email`; invalid email blocked client-side; 400 `errors[{field: 'email'}]` inline without a toast; 409 toast + company refetch; success invalidates `companyKeys.detail` and `maintenanceKeys.worklist()` and closes; re-entrancy (double Save fires once) |
| `api/companies/{CompaniesModel,index,queries}.ts` | Modify | `AddContactEmailRequest`, `companiesApi.addContactEmail(companyId, contactId, {email})` (**PATCH** `customers/{companyId}/contacts/{contactId}/email`, `handlesValidationLocally`), `useAddContactEmailMutation` |

#### Key code changes:
**Backend.** Sketch Q6 (A41, TD-122, TD-126, NFR-101):

```php
final class SendManualReminderCommandHandler implements CommandHandler
{
    public function __invoke(SendManualReminderCommand $c): SentReminderDto
    {
        $pair = $this->pairs->load($c->vehicleId, $c->companyId) ?? throw new NotFoundError();  // org, linked, active enrolment
        if (!$pair->notificationsOn()) { throw new NotificationsOffError(); }                   // S19-N3, S14-R9
        if (null === $pair->preferredContactId()) { throw new NoPreferredContactError(); }      // S14-N4
        $items = $this->items->forPair($c->vehicleId, $c->companyId, $this->today());          // TD-37: worklist rows, else next two as coming_up
        // $items === []: the S19-R23 line replaces the opening line and the table; no error (S14-R13)
        $recipients = ReminderRecipients::resolve($c->contactIds, $c->emailList,               // 400 on a foreign id or a mismatch
            $this->contacts->withEmail($pair->companyId(), $c->contactIds), $pair->preferredContactId());
        $composed = $this->composer->compose($pair, $items, $recipients->greeting(),           // S19-R19
            $c->emailContent, $this->contactDetails->forHeader(), $c->user);                     // escaped content, CTA or none, signature

        $this->connection->transactional(function () use ($composed, $recipients, $c): void {   // NFR-101: row and transport together
            $this->sends->add(ReminderSend::fromComposed($composed, $recipients, $c->includeBcc, $c->user, $this->clock->now()));
            $this->mailer->send($composed->toEmail(to: $recipients->emails(), replyTo: $c->user->email(),
                bcc: $c->includeBcc ? $c->user->email() : null));                                // TransportException → rollback, 400 ReminderSendFailedError
            $this->audit->write($this->auditEntries->forSend($composed, $recipients));         // S14-E2, S21-R5
        });

        return SentReminderDto::from($composed, $recipients);                                   // no 60 s guard (TD-122)
    }
}
```

**Frontend.** Key code sketch: the button and the dialog wrapper

```ts
// SendReminderButton.vue (abridged)
const props = defineProps<{ row: WorklistRowDto }>();
const access = useMaintenanceAccess();
const open = ref(false);
const visible = computed(() => access.canEditCustomerSide.value                                // S14-R10 hidden; no send switch (D29)
  && !!props.row.contact.contactId && props.row.customerHasEmail);                              // S14-N4; S14-R13 / S7-R20
const disabledReason = computed(() => (!props.row.maintenanceNotifications ? copy.notificationsOffReason : null)); // S14-R9, N1; never for nothing due (S19-R7)
```
```ts
// SendReminderDialog.vue <script lang="ts" setup> (abridged)
const props = defineProps<{ modelValue: boolean; row: WorklistRowDto }>();
const access = useMaintenanceAccess();                                                           // Add email shown only with CE (FD-225)
const company = useCompanyQuery(() => props.row.companyId);                                     // contacts (S19-R3)
const preview = useReminderPreviewQuery(() => props.row.vehicleId, () => props.row.companyId);  // A43
const dialogRef = ref<InstanceType<typeof SendEmailDialog> | null>(null);
const send = useSendReminderMutation();                                                          // onSuccess → invalidate worklist()
const onSendEmail = async (data: SendEmailData) => {
  try {
    await send.mutateAsync({ vehicle_id: props.row.vehicleId, company_id: props.row.companyId,
      contact_ids: data.contactIds, email_list: data.emailList, include_bcc: data.includeBCC, email_content: data.emailContent });
    dialogRef.value?.clearData(); dialogRef.value?.closeDialog();
    showSuccessNotification({ message: copy.reminderSent });
  } catch { if (dialogRef.value) dialogRef.value.emailSending = false; }                         // Invoice.vue precedent; interceptor toasts 409/400
};
```
```vue
<SendEmailDialog v-if="modelValue && preview.data.value" ref="dialogRef" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)"
  :company="company.data.value" :default-contact-id="row.contact.contactId" doc-type="Maintenance reminder" scenario="reminder"
  :location-telephone="preview.data.value.locationTelephone" greet-contact-by-name
  message="" :initial-content="preview.data.value.content" list-all-contacts :loading-data="company.isPending.value"
  @send-email="onSendEmail">
  <template #after-content>
    <ReminderPreviewTable v-if="!preview.data.value.nothingScheduledLine" :items="preview.data.value.items" />  <!-- S19-R23: the line is the prefilled content; no table -->
    <p v-if="preview.data.value.callToAction" data-test-id="text_maintenance_reminder_call_to_action">{{ preview.data.value.callToAction }}</p>
  </template>
  <template #contact-no-email="{ contact }">
    <Button v-if="access.canEditCustomerSide.value" flat dense label="Add email"
            :data-test-id-suffix="`maintenance_reminder_add_email_${contact.id}`" @click="addEmailFor = contact" />
  </template>
</SendEmailDialog>
<AddContactEmailDialog v-if="addEmailFor" :model-value="!!addEmailFor" :contact="addEmailFor" :company-id="row.companyId"
                       @update:model-value="(v) => { if (!v) addEmailFor = null; }" />
```
with `const addEmailFor = ref<EmailContact | null>(null);` (the contact type exported from `SendEmailDialog`'s slot props;
move `EmailContact` to `components/shared/Model.ts` if it must be imported, GR#4).
`initialContent` is read once when the dialog mounts, so the `SendEmailDialog` mounts only after A43 resolves. `message`
is `""`, not null: `formatHTML(null)` throws, and `formatHTML('')` returns `''` but the template would still print ".";
the `v-if="message"` guard (FD-223) drops the paragraph, so the wording appears once, in the box. When A43 `nothingScheduledLine` is set, A43 `content` already equals it, so the box opens with "Nothing is scheduled for {unit} yet." in place of the opening line and no table renders; the greeting preview, call to action and signature stay (S19-R23). The greeting the
dialog shows is a preview of the BE's S19-R19 rule; the FE sends `contact_ids`, never a greeting
(TD-126).

#### Unit / Integration tests:
**Backend:**
- Unit `ReminderDueLabelTest` (meter estimate at High/Medium/Low → "Soon"; calendar → month; certificate → day "14 Oct 2026"; no confidence word in any label), `ReminderStageTest` (state per day: Coming up / Due today / Past due), `ReminderRecipientsTest` (format, 1–30, dedupe, `contact_ids` email not in `email_list` → 400, greeting matrix per S19-R19: one → 'Hi Dave Brabay,', two → 'Hi Dave Brabay and Lisa Brabay,' in `contact_ids` order, three → 'Hello,', typed only → 'Hello,', one ticked + one typed → 'Hi Dave Brabay,'), `ReminderComposerTest` (greeting cases per S19-R19, S19-R23: no items → no table, the content is the "Nothing is scheduled" line, call to action and signature kept, escaped content with `<script>`, no call to action without a telephone, invoice-style signature, no money), `SendManualReminderCommandHandlerTest` (notifications off, no preferred contact, foreign contact id → 400, typed addresses, only that pair's services; a service due in 60 days is carried; a service resting after a Mark complete is not; a Needs-readings row beyond 91 days is not; with nothing in the 91 days the two earliest upcoming services are carried as Coming up; nothing dated at all → sent with the 'Nothing is scheduled' line in place of the opening line and the table (S19-R23); Low labelled "Soon"; transport failure → no row). Functional `DbalManualReminderItemsFetcher`: the same rows as A30 for that pair (shared `WorklistPredicates`).
- Functional `tests/Functional/VehicleService/Maintenance/ManualReminderSendTest.php` (Symfony mailer test assertions, `assertEmailCount`, `getMailerMessage`): From name = org name, address = `REPLY_EMAIL_SENDER`; **Reply-To = the user**; BCC when asked; To = ticked contacts + typed addresses in one message; body lists only that asset; send row with recipients and body + items + `entity_event`; A30′ `lastSentAt` set for that row only; A43 payload (`content` without the call to action, `callToAction` null without a header telephone, `dueLabel` "Soon", fallback items as `coming_up`, `nothingScheduledLine` only when nothing is dated, with `content` equal to it, S19-R23); greeting: one ticked → 'Hi Dave Brabay,'; two ticked → 'Hi Dave Brabay and Lisa Brabay,' in the order of `contact_ids`; three → 'Hello,'; the 409s and 400s; user without CE 403.
- **Add** functional `tests/Functional/Customer/Contacts/UI/HTTP/AddContactEmailEndpointTest.php`: adds the email; 409 when one exists; 404 for a foreign company and for a contact of another company; 403 for a user with only `ROLE_WORK_ORDER::CREATE_AND_EDIT`; 400 invalid; `entity_event` row written; `CustomerUpdatedEvent` dispatched (portal webhook); no `accounting_outbox` row (parity with `contacts/change`). Unit `AddContactEmailCommandHandlerTest`.

**Frontend:**
- `SendReminderButton.spec.ts`: hidden (no CE, no preferred contact, `customerHasEmail` false); disabled with the reason only when notifications are off; enabled when nothing is due; click opens the dialog; the last-sent line.
- `SendReminderDialog.spec.ts`: passes the company contacts, the preferred `defaultContactId`, `initialContent` = A43 `content` (the box opens prefilled and editable), `message` = `''` (no message paragraph, no lone ".", no TypeError), `listAllContacts`, the telephone, the slot table and the read-only call to action (absent when null); `sendEmail` → A41 body (`contact_ids`, `email_list`, `include_bcc`, `email_content`, one vehicle + company; never a greeting); success → `clearData`/`closeDialog`, toast and worklist invalidated; failure → `emailSending` reset and the dialog stays open; the latch prevents a double send; Add email appears for a contact without email only with CE and opens `AddContactEmailDialog` for that contact; after it saves, the refetched contact is tickable and not ticked; `contact_ids` are sent with the preferred contact first; with A43 `nothingScheduledLine` set the box opens with that line in place of the S19-R2 wording, no table renders, the call to action still shows, and Send stays enabled (S19-R23).
- `ReminderPreviewTable.spec.ts`: renders the BE labels verbatim, including "Soon"; rows with `state: 'coming_up'` (the next-two fallback) render as Coming up; with `nothingScheduledLine` set (and `items: []`) no table renders.
- `AddContactEmailDialog.spec.ts`: per the file table.
- `SendEmailDialog.spec.ts`: per the file table.
- Re-run the specs of the 5 components that mount the dialog directly (R215): `Invoice.spec.ts`, `UnpaidTransactionsStatements.spec.ts`, plus the `OrderItems`, `AddOrderDialog` and `AccountingCustomerStatementDialog` specs where they exist. `UnpaidTransactionsTable.spec.ts` and the `PartSale` specs are indirect users; re-run them too.
- `MaintenanceRemindersTab.spec.ts` (extend): the slot is filled.

#### Verification (Definition of Done gates):
**Backend:** standard + migration gate + `lint:container --env=prod` + smoke (manual curl of A43, and one manual
`curl -4 -X PATCH …/api/customers/{companyId}/contacts/{contactId}/email` against a seeded contact without email: expect
200, then 409 on repeat). Mail is captured by the test transport; no real send in any gate. Outside production, a walk
that sends happens only where the NFR-118 sink or allowlist (TD-40) is in place.

**Frontend:** `admin`, only where the NFR-118 sink or allowlist exists (TD-40), `/customers?tab=maintenance`:
- Contact → Send reminder. The existing send dialog opens, titled "Sending Maintenance reminder".
- Every contact of the customer is listed; the asset's preferred contact is ticked when it has an email; a contact without
  one is unticked, cannot be ticked, and shows "No email" with Add email → enter an address → save → that contact can now
  be ticked (it is not ticked for you). There is a field for further addresses.
- With one contact ticked the greeting reads "Hi {first} {last},"; tick a second → "Hi {A} and {B},"; tick a third →
  "Hello,". The content box holds the fixed wording and can be edited; it is not repeated above
  the box (no stray "." line). The asset's
  reminder table sits beneath it, read only (a Low row reads "Soon"), followed by the call to action. The signature
  shows your name, the org name and the header location's telephone. The BCC toggle is present.
- Send. Toast, the dialog closes, and the card shows "Last sent {today}".
- In the mail sink: From = the org name, Reply-To = you, BCC = you when toggled, only that asset is listed, and the
  greeting matches the preview.

Then check the other states:
- Notifications off → disabled with the reason, and the row is still listed (S14-N5).
- A unit with nothing due in the next 91 days → Send reminder is enabled and the preview lists its next two services as
  Coming up.
- A unit with no dated service at all → Send is enabled; the content box opens with "Nothing is scheduled for {unit} yet."
  in place of the fixed wording, there is no table, and the call to action and signature stay (S19-R23).
- No preferred contact → no button.
- Customer none of whose contacts has an email → no button; the card says so and offers Add contact (Plan 1).
- `tech` → no button.
- Phone: the sheet card shows the button and the dialog opens fullscreen.

**Regression (R215):** send an invoice email from `/workorders/<id>/finance` and a PO email. The dialogs read "Hello,"
and look exactly as before.

#### E2E tests (e2e/)
UI-affecting (§9): yes (A41 and A43 controllers, `SendReminderButton.vue`, `SendReminderDialog.vue`, `SendEmailDialog.vue`,
`MaintenanceRemindersTab.vue`). §8: n/a. **Creates: 3 of 5 slots, all blocked by environment (B-1).** Q6-1, Q6-2 and Q6-3 run
**on the branch's QA environment** (or stage after the merge), and only where the NFR-118 mail sink or recipient
allowlist (TD-40) exists. QA and staging data are cloned from production, so a send without it could reach a real
customer.

**No "ships dark" path (D29).** There is no send switch. The footer ships as specified in S19-R15; legal is a non-blocking
fast follow (#31, 918945793), so nothing holds the branch → `develop` PR; the coverage pass runs on that PR as for every other phase.

**Q6-1 `worklist-send-reminder.spec.ts`: Admin sends a reminder from the contact card through the send dialog, and "Last sent" persists**
- **Type:** Happy path (the only E2E of the reminder email transport). **Reqs:** S14-R4, S14-R5, S14-R6, S14-R12, S14-R13, S14-E2, S19-R3, S19-R4, S19-R18, S19-R19; optional inbox check S19-R16, S19-R17, NFR-115. **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** A43 and A41 compose from real worklist rows, the shared dialog has to carry the new props and slot, and the real mailer sends. A30′ `lastSentAt` comes back on a real refetch.
- **Preconditions:** Environment premise B-1 (sink or allowlist, TD-40). Fresh customer + contact with email `buildEmailAddress('mr.reminder.<ts>')` (`e2e/src/email/gmail-client.ts`) set as the vehicle's preferred contact. Vehicle `MR<ts>` enrolled with "Oil" overdue. A second contact W of the same customer **without** an email. Notifications on (default). Use a Gmail `+tag` address, never a real customer domain.
- **Steps:**
  1. `/customers?tab=maintenance`, search `MR<ts>` → `button_maintenance_worklist_contact_<id>`. Expected: `maintenance_contact_card` shows `button_maintenance_contact_send_reminder` labelled "Send reminder" (no "Resend").
  2. Click it. Expected: `dialog_send_email` (reuse `e2e/src/pages/dialogs/send-invoice-email.dialog.ts`, or a subclass `send-reminder-email.dialog.ts`); `checkbox_contact_<contactId>` is checked; `checkbox_contact_<W>` is disabled and `text_send_email_contact_no_email_<W>` reads 'No email'; `text_send_email_greeting` reads "Hi <first> <last>,"; `input_email_content` holds the fixed wording (non-empty) and no message paragraph shows above it; `maintenance_reminder_preview_row_<Oil>` lists "Oil"; `toggle_include_bcc` is present.
  3. `button_send_email`. Expected: a toast; `maintenance_contact_last_sent` reads "Last sent <today>".
  4. Reload, search, reopen the card. Expected: "Last sent <today>" persists.
  5. (Optional, stage CI has `GMAIL_APP_PASSWORD`) `fetchEmailBody('mr.reminder.<ts>')`. Expected: the body opens "Hi <first> <last>", names `MR<ts>` and "Oil", contains no currency, and Reply-To is admin's email. Under NFR-118 this step needs the test address on the stage allowlist; with a sink only, it does not run.
- **Expected result:** The reminder goes out by hand for that one asset through the existing dialog and is logged as last sent.
- **Page objects / factories:** Plan 1 `maintenance-worklist.page.ts` (extended contact card: `sendReminderButton`, `sendDisabledReason`, `lastSent`); `send-invoice-email.dialog.ts` (or the subclass); `customerFactory` / `vehicleFactory`; `e2e/src/email/gmail-client.ts`.

**Q6-2 `worklist-send-reminder-notifications-off.spec.ts`: With maintenance notifications off, the row stays and Send reminder is disabled with the reason**
- **Type:** Edge case (UI gate driven by real server state, §4 row 14). **Reqs:** S14-R9, S14-N1, S14-N5 (Plan 1), S19-N3. **Role:** admin. **Priority:** P2.
- **Preconditions:** Same environment premise as Q6-1 (B-1). Customer with notifications off via `CustomerFactory.setMaintenanceNotifications(companyId, false)` (restored in `afterEach`); contact with email preferred; vehicle enrolled overdue.
- **Steps:**
  1. Worklist, search → the row is listed. Open the contact card. Expected: `button_maintenance_contact_send_reminder` is disabled and `maintenance_contact_send_disabled_reason` names the setting.
- **Expected result:** The customer's real setting disables sending without hiding the row.
- **Page objects / factories:** Plan 1 `maintenance-worklist.page.ts` (extended contact card); `CustomerFactory.setMaintenanceNotifications`.

**Q6-3 `worklist-send-reminder-add-email.spec.ts`: Admin adds an email to a contact from the send dialog, ticks it, and the greeting names both people**
- **Type:** Happy path. **Reqs:** S19-R3 (Add email), S19-R19 (two names), NFR-120. **Role:** admin. **Priority:** P3.
- **Why E2E (gate 4):** A45 writes the contact through the real Customer/Contacts path, the dialog's contacts refetch from A16 and the contact becomes tickable; the API alone cannot show the dialog state, a mock cannot show the real write.
- **Preconditions:** Same environment premise as Q6-1 (B-1). Customer with preferred contact V (Gmail `+tag` email) and contact W without email; vehicle enrolled overdue.
- **Steps:**
  1. Worklist → contact card → `button_maintenance_contact_send_reminder`. Expected: V ticked; W disabled with 'No email'; `text_send_email_greeting` reads "Hi <V first> <V last>,".
  2. `button_maintenance_reminder_add_email_<W>` → `dialog_maintenance_add_contact_email` → type `buildEmailAddress('mr.reminder.w.<ts>')` → `button_maintenance_add_contact_email_save`. Expected: the dialog closes; `checkbox_contact_<W>` is enabled and unchecked; W shows the new address.
  3. Tick W. Expected: the greeting reads "Hi <V> and <W>,".
  4. Close the send dialog without sending; reopen the customer page. Expected: W carries the new email (persisted).
- **Expected result:** Add email writes onto the contact and the dialog lets it receive the reminder.
- **Page objects / factories:** `send-reminder-email.dialog.ts` (extended: `addEmailButton(id)`, `noEmailText(id)`), new `e2e/src/pages/dialogs/maintenance-add-contact-email.dialog.ts`; `customerFactory.ensureContact` (one contact without email).

**Backlog (Q6):**

| Workflow | Why deferred | Suggested file |
|---|---|---|
| A user without customer edit sees no Send reminder button, and A41 refuses them (S14-R10, §4 row 13) | Needs a custom role; also blocked by B-1 | `e2e/tests/ui/maintenance-reminders/worklist-send-reminder-role-gate.spec.ts` |

**Dev-layer (Q6):** hidden when no CE / no preferred contact / no contact email (S14-N2, N4, S14-R13), disabled only when
notifications are off, enabled with nothing due (S19-R7), the S19-R23 line, double-click once (NFR-F106), 409 toast + refetch:
fe-unit `SendReminderButton.spec.ts`, `SendReminderDialog.spec.ts`, `ReminderPreviewTable.spec.ts`. Add email write and
409 (A45, NFR-120): be-functional `AddContactEmailEndpointTest` + fe-unit `AddContactEmailDialog.spec.ts`. Additive `SendEmailDialog` (NFR-F111): fe-unit
`SendEmailDialog.spec.ts` + the consumer specs. From name = org name over `REPLY_EMAIL_SENDER`, Reply-To user, BCC,
recipients, only that asset (S14-R6), send row + items + `entity_event` (S14-E2, S21-R5), the
409s, no-CE 403: be-functional `ManualReminderSendTest`. "Soon" for any guessed date, Low included, no confidence wording (S19-R9, S11-N1), day for a certificate, item
selection (TD-37, S19-R6/R7, worklist window, else the next two), call to action, greeting (S19-R19, two names), composer escaping (NFR-119), no money: be-unit
`ReminderDueLabelTest`, `ReminderStageTest`, `ReminderRecipientsTest`, `ReminderComposerTest`,
`SendManualReminderCommandHandlerTest`. S14-E3, S19-N5, S19-N7, S19-E4: by construction.

**Reference updates (Q6):** R-Q6-1 is an **edit** to Plan 1's planned P7-3 spec (drop its "no Send reminder" assertion);
R-Q6-2 and R-Q6-3 are verify only (Section 7, Reference updates).

### Phase Q7: removed from v1 (2026-10-04)

**Removed from v1** (PRD 2026-10-02: automatic sending deferred to v2). There is no phase, no table, no job, no
Terraform rule and no E2E for it in this plan. Its requirements are the PRD's "Deferred to v2" list at the end of S19
and are not requirements of this release:

**Deferred to v2 (matches the PRD's deferred S19 items, with their old numbers):** S19-R10 (08:00 local, working days),
S19-R11 (org timezone from the busiest workplace), S19-R12 (hourly job), S19-R13 (day granularity), S19-R20 (telephone of
the most recent visit, location per row), S19-R22 (send only on a change), S19-N1 (no bulk send at enrolment, backlog
suppressed), S19-N2 (Low → no automatic email), S19-N4 (nothing on a weekend), S19-N6 (preferred contact removed → stops
receiving), S19-E1 (08:00 vs a truck at 08:05), S19-E2 (consolidation is load bearing), S19-E3 (25 of 796 orgs span
timezones), S19-E6 (group by recipient), S19-E7 (services months apart → two emails). Also gone with them: the email
halves of S7-R9, S12-R6, S12-R14 and S5-E1/S5-R8, and S7-N3 (deleted from the PRD).

What the old Q7 design held (job, run row, change detector, eligibility, send window, timezone resolver, Terraform
rule, system actor; TD-109, TD-114, TD-116, TD-117, TD-119; NFR-102, NFR-104, NFR-105, NFR-116; GR-4 ext., GR-5; EQ-1,
EQ-2, EQ-6; PQ-15..PQ-19) is kept as a v2 carry-over in the 2026-10-04 revision notes (Appendix) and in this plan's git
history, not here. FE: none. E2E: none.

---

## 7. Testing Strategy

Every phase block in Section 6 lists its own tests; this section is the cross-cutting summary.

### Unit tests
- Backend (Pest, `tests/Unit/…`): pure services first: `WorkOrderPanelRowsBuilderTest`, `ServiceRowAssemblerTest` (Q1);
  `AddServicesToWorkOrderCommandHandlerTest`, `RemoveServiceFromWorkOrderCommandHandlerTest` and the extended Plan 1 Mark
  complete / undo handler tests (Q2);
  `ResetDateProposalTest`, `ServiceCompletionTest`, `ConfirmInvoiceStepCommandHandlerTest`, `NextDuePreviewQueryHandlerTest`
  (Q3); the `ListingQueryHandler` merge test with a fake provider (Q4); `MoveMaintenanceLinksOnWorkOrderSplitSubscriberTest`
  (Q5); `ReminderDueLabelTest`, `ReminderStageTest`, `ReminderRecipientsTest`, `ReminderComposerTest`,
  `SendManualReminderCommandHandlerTest`, `AddContactEmailCommandHandlerTest` (Q6); the extended Plan 1 `DueDateResolverTest` for TD-108 (Q1).
- Characterization before change (NFR-109): `WorkOrderListCharacterizationTest` pins `GET /api/work-orders` before Q4.
- Frontend (Vitest + MSW): `VehicleCard.spec.ts` (mount gate, unchanged DOM without schedules, `focus-meter`), `WorkOrderMaintenancePanel`,
  `PanelServiceRow`, `ServiceContentsCard`, `panelRowActions`, `panelState` (Q1); `AddServiceDialog`, the Undo/Remove cases
  of `PanelServiceRow`, the extended `useMaintenanceWorkOrderActions` spec (Q2); `useMaintenanceInvoiceStep`, `MaintenanceInvoiceStepDialog`, `invoiceStepDiff`
  and the extended `Invoice.spec.ts`, every existing case green (Q3); `WorkOrders.spec.ts`, `MaintenanceOriginCell` (Q4);
  `SendReminderButton`, `SendReminderDialog`, `ReminderPreviewTable`, `AddContactEmailDialog`, the extended `SendEmailDialog` spec plus every
  consumer's spec (R215), the extended `MaintenanceRemindersTab` spec (Q6). No currency in any panel, step or toast output.

### Integration tests
Backend functional tests (one file each, re-run file by file):
- Q1 `WorkOrderPanelEndpointTest` (query count ≤ 7, recursive no-price key scan), `ServiceContentsEndpointTest`;
- Q2 `AddServicesToWorkOrderEndpointTest`, `RemoveServiceFromWorkOrderEndpointTest`, plus re-runs of Plan 1's `CreateWorkOrderFromServiceTest` and `MarkCompleteEndpointsTest`;
- Q3 `InvoiceStepEndpointsTest`, the extended Plan 1 `InvoiceReversalTest`, plus re-runs of `tests/Functional/Invoicing/` and Plan 1's `InvoiceResetTest`;
- Q4 `WorkOrderListCharacterizationTest`, `WorkOrderOriginTest`;
- Q5 `WorkOrderSplitTest`, plus the existing split tests;
- Q6 `ManualReminderSendTest` (Symfony mailer test assertions; no real send), `AddContactEmailEndpointTest` (A45).

### Manual testing checklist
- Browser-walk per phase as listed in each Section 6 block, on the branch build, plus a regression walk of every touched
  existing screen (WO page, part sale, imported WO, invoicing, Work Orders list; NFR-F101), and the same screens in an org
  with no schedule (NFR-F112); phone width 390 px for the panel and the step.
- Before the branch → `develop` PR: QA signs off the branch build on its QA environment (D28), after the latest
  `develop` merge and its post-sync gates.
- Q1: A35 p95 and query count on the seeded dataset for a vehicle with 3 × 15 services, pasted in the PR (NFR-107).
- Q3: every invoicing entry point shows the step exactly once; payment-dialog dismissal and reverse + re-invoice walked.
- Q4: `EXPLAIN` of the filtered list and p95 of the unfiltered list on the largest seeded org, before and after (NFR-108).
- Q6: an invoice send and a PO send through the shared dialog look exactly as before (R215). No send switch (D29);
  sends outside production only where the sink or allowlist exists (TD-40).

### 7.4 Test ids (FE)

Convention as in Plan 1: raw `maintenance_<surface>_<element>[_<id>]`; base wrappers `data-test-id-suffix` →
`button_…`, `input_…`. Per-row ids end in `_${enrolledServiceId}`.

| Surface | Ids |
|---|---|
| WO panel | `maintenance_wo_panel`, `maintenance_wo_panel_toggle`, `maintenance_wo_panel_badge`, `maintenance_wo_panel_not_enrolled`, `button_maintenance_wo_panel_enroll`, `maintenance_wo_panel_needs_reading_{mileage,hours}_${id}` (per row; a `Button` with the same id via `data-test-id` when editable), `maintenance_wo_panel_row_${id}`, `maintenance_wo_panel_summary_${id}` (hover trigger), `maintenance_wo_panel_contents_${id}`, `maintenance_wo_panel_due_${id}`, `maintenance_wo_panel_badge_${id}`, `maintenance_wo_panel_covered_${id}`, `maintenance_wo_panel_addressed_${id}`, `maintenance_wo_panel_now_due_${id}`, `maintenance_wo_panel_add_blocked_${id}` (invoiced only), `maintenance_wo_panel_copy_info_${id}`, `button_maintenance_wo_panel_mark_complete_${id}`, `maintenance_wo_panel_menu_${id}`, `maintenance_wo_panel_action_{mark_complete,add_record,undo_complete,remove}_${id}`; QueryState `error_maintenance_wo_panel`, `button_retry_maintenance_wo_panel`, `loading_maintenance_wo_panel` |
| Add Service | `button_maintenance_wo_panel_add_service_${id}`, `dialog_maintenance_add_service`, `maintenance_add_service_preview_line_${index}`, `maintenance_add_service_preview_parts`, `maintenance_add_service_destination_{this,new}_${id}`, `button_maintenance_add_service_confirm`, `button_notification_undo` (toast, existing), `button_maintenance_open_new_work_order` (toast action) |
| Step after invoicing | `dialog_maintenance_invoice_step`, `maintenance_invoice_step_row_${id}`, `maintenance_invoice_step_tick_${id}`, `maintenance_invoice_step_reason_${id}`, `maintenance_invoice_step_covered_${id}`, `maintenance_invoice_step_next_due_${id}`, `maintenance_invoice_step_stays_due_${id}`, `maintenance_invoice_step_certificate_${id}`, `button_maintenance_invoice_step_confirm`, `button_maintenance_invoice_step_close`. Date and certificate inputs: Plan 1 ids with `idSuffix = _${id}` (EQ-10), otherwise scoped by row |
| Origin | `link_work_orders_maintenance_schedule_${workOrderId}`, `text_work_orders_maintenance_schedule_${workOrderId}`, `filter_chip_maintenanceOrigin` (FilterBar convention), `text_work_orders_maintenance_totals`, `toggle_column_maintenanceSchedule` |
| Send | `button_maintenance_contact_send_reminder`, `maintenance_contact_send_disabled_reason`, `maintenance_contact_last_sent`, `maintenance_reminder_preview_table`, `maintenance_reminder_preview_row_${enrolledServiceId}`, `text_maintenance_reminder_call_to_action`, `text_maintenance_reminder_nothing_scheduled`, `button_maintenance_reminder_add_email_${contactId}`, `dialog_maintenance_add_contact_email`, `input_maintenance_add_contact_email`, `button_maintenance_add_contact_email_save`, plus the existing dialog ids `dialog_send_email`, `checkbox_contact_${id}`, `input_optional_emails`, `input_email_content`, `toggle_include_bcc`, `button_send_email`, new `text_send_email_greeting`, `text_send_email_contact_no_email_${id}` |

Unchanged ids that E2E depends on in the files Plan 2 touches: `vehicle_card_change_action`, `vehicle_card_title_link`,
`input_vehicle_mileage`, `input_vehicle_engine_hours`, `input_vehicle_license_plate`, `vehicle_*_readonly`,
`table_work_orders`, `text_work_orders_empty`, `loading_reverse_invoice`, `button_notification_undo`, `dialog_send_email`,
`button_send_email`, `toggle_include_bcc`, `checkbox_contact_${id}`, `input_email_content`, `input_optional_emails`.
`input_vehicle_mileage` / `input_vehicle_engine_hours` are now focus targets of the Needs-reading hint (no id change).

### E2E tests

From the E2E curation pass over phases Q1–Q6 (no diff yet; revised 2026-10-04 for the PRD edit; nothing built; baseline `develop` at `65531b6e0a`). Every
Reference Update below comes from grepping today's `e2e/` for the identifiers this plan says it will touch, plus Plan 1's
*planned* Section 7 specs. Re-check each one against the real diff when `/e2e-after-change` runs on the branch → `develop` PR (D28; per-phase specs
land in their phase PRs, the formal coverage pass runs once).

Rules applied: `coverage-policy.md` §3 (batchCap = 5 per phase), §5, §8, §9, §10; `test-scope-rules.md` §3 gates (first
match wins, so a Create entry has to reach gate 4) and the §4 routing table (row 14, "UI gate driven by real server
state", counts as E2E). A candidate that stops at gates 1–3 is listed under "Dev-layer" in its phase block (Section 6).
Those rows become `Test Layer = Dev` cases, not specs. The full scenario detail (why E2E, preconditions, page objects)
is in each phase's "E2E tests (e2e/)" block; this section lists the scenarios in template form.

#### Conventions inherited from Plan 1 (reuse, do not duplicate)

| Item | Decision |
|---|---|
| Spec folder / project | `e2e/tests/ui/maintenance-reminders/<workflow>.spec.ts`, Playwright project `maintenance-reminders` (Plan 1 §7: `storageState .auth/admin.json`, `testMatch ['**/ui/maintenance-reminders/*.spec.ts']`). Every Plan 2 spec goes in the same folder, so the project needs no config change |
| Tags / titles | `@maintenance`, `describe('<Workflow> Tests @maintenance')`, `C<id> - Admin <action>`, `@P<n>` |
| Shared org, feature live | No feature flag (D27): every spec now runs with Maintenance live. MR specs archive their schedules in `afterAll` (archived schedules make `organizationHasSchedules` false, so the WO panel stays hidden in unrelated specs) and end enrolments (Plan 1 E80). No `openOrgFeatureFlagScope`, no boot-after-enabling step |
| Where they run | On the feature branch: locally and on the QA environment built from it. Invoicing scenarios (Q1-4, Q3-1..Q3-3) run on that QA environment (or locally with `workplace.bookkeeping_enabled = 0`); Q6 scenarios only where the NFR-118 sink/allowlist exists (B-1, TD-40) |
| Data | Fresh customer + contact + vehicle per spec: `customerFactory.findOrCreate` → `ensureContact` → `vehicleFactory.create` (`e2e/src/api/factories/{customer,vehicle}.factory.ts`). Canned lines: `workOrderFactory.createCannedLineFromLine` (`work-order.factory.ts:1207`) in the header workplace. Schedules: names `MR-E2E <ts>`, cleanup = archive |
| Dates | `e2e/src/utils/shop-tz-date.ts` (`shopTzDateKey`, `shiftDayKey`) in the header workplace timezone |
| Factory | Plan 1's `e2e/src/api/factories/maintenance.factory.ts` (`MaintenanceFactory`). **Plan 2 adds:** `getWorkOrderPanel(workOrderId)` (A35, used to resolve ids and for diagnostics only, never as the assertion), `addServicesToWorkOrder(workOrderId, enrolledServiceIds)` (A37), `getInvoiceStep(workOrderId, invoiceId)` (A38, diagnostics). Plan 1 methods reused: `createSchedule`, `routineService`, `complianceService`, `enrol`, `addComplianceRecord`, `recordReadings`, `getAssetMaintenance`, `markComplete`, `createWorkOrderForService` (A33; Plan 2 lets it pass `'wo_panel'`), `archive`; `CustomerFactory.setMaintenanceNotifications` |
| Existing factories reused | `workOrderFactory.create / addLine / changeLineStatus / transitionTo / splitLines` (`work-order.factory.ts:375,492,1172,879,1948`), `invoiceFactory.create` (`invoice.factory.ts:139`) |
| Plan 1 page objects reused | `e2e/src/pages/customers/vehicle-maintenance.page.ts` (asset tab), `e2e/src/pages/customers/maintenance-worklist.page.ts` (worklist + contact card), `e2e/src/pages/administration/maintenance-schedules.page.ts`, dialogs `e2e/src/pages/dialogs/maintenance-{mark-complete,enrolment,certificate}.dialog.ts` |
| **New Plan 2 page objects** | `e2e/src/pages/work-orders/wo-maintenance-panel.component.ts` (`WoMaintenancePanel`: toggle, badge, `row(id)`, `needsReading(meter, id)`, `summary(id)`, `contents(id)`, `dueBadge(id)`, `nowDue(id)`, `addBlocked(id)`, `menu(id)`, `action(kind,id)`, `addService(id)`, `addServiceDialog` (preview, `destination('this'\|'new', id)`, confirm), `removeAction(id)`, `markCompleteButton(id)`, `copyInfo(id)`). Same component pattern as `wo-adjustments-card.page.ts` / `inspection-build.component.ts`. `e2e/src/pages/dialogs/maintenance-invoice-step.dialog.ts` (`MaintenanceInvoiceStepDialog`: `row(id)`, `tick(id)`, `reason(id)`, `dateInput(id)` (Plan 1 ids with `idSuffix = _${id}`, EQ-10; row scoping is the fallback), `nextDue(id)`, `certificateFields(id)`, `confirm()`, `close()`). Extend `e2e/src/pages/work-orders/work-orders.page.ts` with `maintenanceScheduleLink(woId)` / `maintenanceScheduleText(woId)` / `ensureColumnVisible('maintenanceSchedule')`. Extend Plan 1's `maintenance-worklist.page.ts` contact card with `sendReminderButton`, `sendDisabledReason`, `lastSent`. The send dialog reuses `e2e/src/pages/dialogs/send-invoice-email.dialog.ts` (or a subclass `send-reminder-email.dialog.ts`, with `addEmailButton(id)`, `noEmailText(id)`); new `e2e/src/pages/dialogs/maintenance-add-contact-email.dialog.ts` |
| Existing page objects reused | `e2e/src/pages/work-orders/lines.page.ts` (`waitForPageToOpen` :949, `goToFinanceTab` :1013, `setMileageValue` :2644, `verifyLineName` :1703), `e2e/src/pages/finance/finance.page.ts` (`createInvoiceAndAwaitResponse` :797, `clearPaymentDialogPreservingInvoice` :862, `closePaymentDialogButton` = `button_close_payment_dialog`), `e2e/src/pages/work-orders/work-orders.page.ts` |
| Invoicing environment | **Invoice creation 500s on the local stack** (QuickBooks `bookkeeping` row with null `auth`, Plan 1 §7 and `e2e/AGENTS.md`). Every scenario that invoices (Q1-4, Q3-1, Q3-2, Q3-3) runs on the branch's **QA environment** (stage carries develop/main only until the merge). The local workaround is `workplace.bookkeeping_enabled = 0` on the fixture workplace (reversible) |
| Payment dialog | Never X the payment dialog unless the scenario *means* to remove the invoice. Use `clearPaymentDialogPreservingInvoice()` (reload) to get past it. X = `invoices/remove-customer-transaction` = invoice reversal (F-1) |
| Customer email (NFR-118) | Q6 scenarios run only where the mail sink or recipient allowlist exists (TD-40). Test contacts use Gmail `+tag` addresses (`buildEmailAddress`), never a real customer domain |

TestRail: no Maintenance section exists yet. Plan 1's proposal (top-level "Maintenance Reminders" + `SECTION_MAP` entry
`'ui/maintenance-reminders/'`) has to land before any Plan 2 case can be pre-minted. Suggested sub-sections for Plan 2:
*Work order panel*, *Step after invoicing*, *Origin*, *Send reminder*.

#### Scenarios

**Phase Q1: Work order maintenance panel** (all admin; spec folder `e2e/tests/ui/maintenance-reminders/`)

**Test: Q1-1 Admin opens a work order and reads the maintenance panel for its asset** (Happy path, S16-R1, S16-R2, S16-R3, S16-R4, S16-R5, S16-R7, S16-R16, S16-N5, NFR-115, NFR-F107) — `wo-maintenance-panel.spec.ts`
1. Seed PM-A (overdue, 2 canned lines) and CVIP (record End date = today + 20 days, due soon) on a fresh vehicle with an open WO; open `/workorders/<woId>/lines`.
2. Check the panel is collapsed inside the asset card with badge `2`.
3. Expand it; read the PM-A and CVIP rows, the PM-A summary and both badges.
4. Focus the PM-A summary and press Enter to open its contents.
- **Expected:** collapsed badge `2` and no other header text (S16-R2); PM-A "2 lines · <h> hours" (the seeded hours), Overdue; CVIP due soon; the contents list both canned-line descriptions and the part with its quantity, and no currency.

**Test: Q1-2 Admin marks a due service complete from the work order's panel and undoes it** (Happy path, S16-R13 (Mark complete), S16-R17, S18-R1 (WO entry), NFR-F105; after Q2 also S16-R18, S17-E2) — `wo-panel-mark-complete.spec.ts`
1. Open a WO with one hand-typed line; expand the panel (PM-A Overdue).
2. Row menu → Mark complete.
3. Confirm with the defaults.
4. Click Undo on the toast.
- **Expected:** the dialog opens with "on a work order" and this WO chosen, reset date today; after Confirm the PM-A badge no longer reads Overdue; after Undo it reads Overdue again.

**Test: Q1-3 Entering mileage on the work order's asset card makes a mileage service due in the panel** (Happy path, S16-R12, S16-E1, S16-N1, NFR-F105; TD-108) — `wo-panel-reading-now-due.spec.ts`
1. Seed "Oil" (mileage 10,000 / 12 months), last done at 50,000, reading 52,000; open the WO and expand the panel.
2. Enter mileage 61,000 in the asset card input (`setMileageValue`) and wait for its spinner to settle.
- **Expected:** before: Oil is the next-service row, no "now due" marker; after: `maintenance_wo_panel_now_due_<Oil>` appears and the badge reads Due today / Overdue, without a reload.

**Test: Q1-4 On an invoiced work order the panel offers no Add Service and says why** (Edge case, S16-N7 (display)) — `wo-panel-invoiced-blocked.spec.ts`, QA environment
1. Complete and invoice a WO for a vehicle with PM-A overdue (API); open it and expand the panel.
2. Open the PM-A row menu.
- **Expected:** `maintenance_wo_panel_add_blocked_<PM-A>` reads "Lines can't be created on an invoiced work order.", no Add Service button (once Q2 exists); Mark complete is still offered.

**Phase Q2: Add a service to a work order**

**Test: Q2-1 Admin adds a due service's canned lines to the open work order from the panel** (Happy path, S16-R8, S16-R13 (Add), S16-R17, S16-R18, S16-R20, S16-R24, S16-R25 (toast), S17-R1 (this WO), S17-R2 (panel), S17-N1, S16-R19, NFR-F105) — `wo-panel-add-service-this-wo.spec.ts`
1. Open an empty WO for a vehicle with PM-A overdue; expand the panel; click Add Service on PM-A.
2. In `dialog_maintenance_add_service`, choose "This work order" and confirm.
3. Without reloading, check the Lines tab and the panel row.
4. Reload.
- **Expected:** the dialog previews both lines with hours and the part, no currency, and both destinations; a toast "PM-A added · 2 lines" with Undo; both canned lines on the Lines tab; the row reads "Added · 2 lines", Mark complete is the row's button and Add Service is gone; the collapsed header shows the badge only; everything persists after the reload.

**Test: Q2-2 Admin adds a due service to a new work order from the panel and finds it on the worklist** (Happy path, S17-R1 (new WO), S17-N1, S17-R7, S22-R1 (`wo_panel`), NFR-F110) — `wo-panel-add-service-new-wo.spec.ts`
1. Panel → Add Service → the dialog → "A new work order" → confirm.
2. If the toast is still up, click Open; otherwise go to step 3.
3. Worklist `/customers?tab=maintenance`, search `MR<ts>`.
- **Expected:** a toast with the new WO number and the URL unchanged; the new WO is an estimate carrying both canned lines; the worklist row's WO link shows the new number.

**Test: Q2-3 Admin undoes an Add Service from the toast, adds again and removes it from the menu, and the lines stay** (Edge case, S16-R25, S16-N4; S18-R8 consequence is Dev) — `wo-panel-add-service-undo-remove.spec.ts`
1. Add Service → this → confirm; click `button_notification_undo` as soon as the toast attaches.
2. Add again; let the toast go; row menu → Remove.
3. Reload.
- **Expected:** after Undo and after Remove the row shows Add Service again and the lines stay on the Lines tab; the state persists after the reload. Undo races the toast timeout (B-9); the Remove path is the stable assertion.

**Update: Q2-U1** (of Q1-2; S16-R18, S17-E2, TD-110): after Confirm, assert "Marked complete on this work order …" (the
collapsed header shows the badge only); after Undo, assert the addressed line is gone.

**Phase Q3: Step after invoicing** (the branch's QA environment)

**Test: Q3-1 Admin invoices a work order with a maintenance service, corrects the cycle date in the step, and the service counts from it** (Happy path, S18-R8, S18-R13, S18-R14, S18-R15, S16-R15, NFR-F102, FD-205) — `invoice-step-confirm-dates.spec.ts`
1. PM-A (calendar 6 months) added via A37, lines completed today, WO complete; Finance → Create invoice.
2. Change the PM-A date to today − 40 d.
3. Confirm dates.
4. Clear the payment dialog by reload (never X); open the asset maintenance tab.
- **Expected:** the step opens before any payment dialog with PM-A ticked, "Lines added from <schedule>", the date holding A38's proposal (today, `lines_closed`) and Next due ≈ today + 6 months; Next due follows the new date; the payment form appears after Confirm; the asset tab shows Last done = today − 40 d and the matching Next due.

**Test: Q3-2 Dismissing the payment dialog after the step undoes the reset, and re-invoicing proposes the user's date again** (Edge case, S18-E2, S18-E3, NFR-117, F-1, S18-R15) — `invoice-step-dismissed-payment-carried-date.spec.ts`
1. Create invoice → set the PM-A date to today − 40 d → Confirm.
2. Click the payment dialog X (deliberately removes the invoice).
3. Open the asset maintenance tab.
4. Back to Finance → Create invoice.
5. Confirm untouched; clear the payment dialog by reload; open the asset tab.
- **Expected:** after the X, Create invoice is offered again and PM-A reads Overdue; the new step's date input holds today − 40 d (A38 `proposedResetOn`, `proposalBasis = 'carried'`), not the lines-closed date, which is only offered beneath the field; finally Last done = today − 40 d.

**Test: Q3-3 Admin records the inspection certificate in the step, and it appears on the asset card** (Happy path, S18-R16, S8-R10, S18-E6, S18-E4 / S8-E3) — `invoice-step-compliance-certificate.spec.ts`
1. CVIP (term 12, one canned line, no record) added via A37, lines completed, WO complete; Create invoice.
2. Enter certificate number `C-<ts>`, Start date = today, term 12.
3. Confirm → clear the payment dialog by reload → asset card.
- **Expected:** the certificates section shows CVIP and the dates list has no CVIP row; the End date derives (today + 12 months); the asset card shows "CVIP · C-<ts> · ends <D Mon YYYY+1>".

**Phase Q4: Origin column**

**Test: Q4-1 The Work Orders list names and links the maintenance schedule a work order came from** (Happy path, S22-R2, S22-R3, S22-N1) — `work-orders-maintenance-origin.spec.ts`
1. WO A from the schedule (A33, `'asset'`), WO B hand-made; `/workorders`, search the customer, make the "Maintenance schedule" column visible.
2. Read both rows.
3. Click WO A's schedule link.
- **Expected:** the column header is present; WO A shows `MR-E2E Origin <ts>` as a link, WO B's cell is empty; the link opens `/maintenance-schedules/<scheduleId>`, not the WO.

**Update: Q4-U1** (of Q2-2; S22-R2 (panel origin), S22-E1 write side): append `/workorders` → the new WO's row shows
`link_work_orders_maintenance_schedule_<newWoId>` with the schedule name.

**Phase Q5: Work order split.** No scenario. Skip reason `None — no-fe-diff` (BE subscriber only; covered by
`WorkOrderSplitTest`).

**Phase Q6: Send reminder by hand** (QA environment; blocked by B-1 and NFR-118)

**Test: Q6-1 Admin sends a reminder from the contact card through the send dialog, and "Last sent" persists** (Happy path, S14-R4, S14-R5, S14-R6, S14-R12, S14-R13, S14-E2, S19-R3, S19-R4, S19-R18, S19-R19; optional S19-R16, S19-R17, NFR-115) — `worklist-send-reminder.spec.ts`
1. Environment premise B-1 (sink or allowlist); contact with a Gmail `+tag` email, a second contact W without email, vehicle `MR<ts>` with "Oil" overdue.
2. Worklist, search `MR<ts>`, open the contact card, click Send reminder.
3. In `dialog_send_email`, check the ticked preferred contact, the greeting, the prefilled content and the read-only table; click `button_send_email`.
4. Reload, search, reopen the card.
5. (Optional, needs the address on the allowlist) fetch the email body.
- **Expected:** the button reads "Send reminder" (no "Resend"); `checkbox_contact_<contactId>` checked, `checkbox_contact_<W>` disabled with "No email", `text_send_email_greeting` "Hi <first> <last>,", `input_email_content` non-empty, `maintenance_reminder_preview_row_<Oil>` present, `toggle_include_bcc` present; a toast and "Last sent <today>", which persists after reload; the body opens "Hi <first> <last>", names `MR<ts>` and "Oil" with no currency, Reply-To = admin.

**Test: Q6-2 With maintenance notifications off, the row stays and Send reminder is disabled with the reason** (Edge case, S14-R9, S14-N1, S14-N5, S19-N3) — `worklist-send-reminder-notifications-off.spec.ts`
1. Same premise; customer notifications off (restored in `afterEach`).
2. Worklist, search, open the contact card.
- **Expected:** the row is listed; Send reminder is disabled and `maintenance_contact_send_disabled_reason` names the setting.

**Test: Q6-3 Admin adds an email to a contact from the send dialog, ticks it, and the greeting names both people** (Happy path, S19-R3 (Add email), S19-R19 (two names), NFR-120) — `worklist-send-reminder-add-email.spec.ts`
1. Same premise; preferred contact V with a Gmail `+tag` email, contact W without email; vehicle enrolled overdue.
2. Open Send reminder; Add email on W; save `buildEmailAddress('mr.reminder.w.<ts>')`.
3. Tick W; close without sending; reopen the customer page.
- **Expected:** V ticked, W disabled with "No email", greeting "Hi <V>,"; after Add email W is enabled and unchecked; after ticking, the greeting reads "Hi <V> and <W>,"; W carries the new email on the customer page.

No "ships dark" override (D29): the Q6 scenarios are covered on the branch → `develop` PR like every other phase.

**Phase Q7:** removed from v1 (automatic sending deferred to v2). No scenario.

#### Backlog

A non-zero Backlog fails the advisory CI check and does not satisfy the local hard-block. For Q1, Q2, Q3 and Q6, either
write the backlog spec in the same PR or ship with the override marker and keep the Backlog table in the block.

| Phase | Workflow | Why deferred | Suggested file |
|---|---|---|---|
| Q1 | A user who can view WOs but not edit customers sees panel rows read-only (no row menu: no Mark complete / Add record / Undo; no Enroll) | Ranked 5th. Needs a fresh custom role (`custom-role.fixtures.ts` / `report-role-seed.helper.ts`); the local stack has no technician | `e2e/tests/ui/maintenance-reminders/wo-panel-role-gate.spec.ts` |
| Q1 | At a WO whose location is not the schedule's home, the row reads as at home with the copied-work (i) and the reference parts heading (S16-R21, S16-R7, S16-N6) | Needs ≥2 workplaces with labour types; first candidate to promote when two-workplace seeding lands | `e2e/tests/ui/maintenance-reminders/wo-panel-copied-work.spec.ts` |
| Q2 | A user without `workOrderLinesCreateAndEdit` (but with WO create) is offered only "A new work order"; a user with no bundle carrying `ROLE_WORK_ORDER::CREATE_AND_EDIT` gets 403 from A37 (S17-N1; TD-123) | Needs a fresh custom role; ranked below the destinations and Undo/Remove | `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-role-gate.spec.ts` |
| Q2 | At a non-home location Add Service copies the work (no parts, local labour rate, internal line note) (S16-N6, S16-R22, S16-R23, S16-R24) | Needs ≥2 workplaces with labour types | `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-copied.spec.ts` |
| Q3 | Reverse an invoice from the invoice menu → invoice again → the step re-appears for the new invoice (S18-E2 via `reverse-invoice`) | Same BE reverter as Q3-2 (one representative, §5); separate UI path through `financePage.confirmReverse` | `e2e/tests/ui/maintenance-reminders/invoice-step-after-reverse.spec.ts` |
| Q3 | A user who can invoice but lacks customer edit sees the step and can confirm dates (S18-N7) | Needs a custom role with invoice and no CE | `e2e/tests/ui/maintenance-reminders/invoice-step-role-gate.spec.ts` |
| Q6 | A user without customer edit sees no Send reminder button, and A41 refuses them (S14-R10) | Needs a custom role; also blocked by B-1 | `e2e/tests/ui/maintenance-reminders/worklist-send-reminder-role-gate.spec.ts` |

#### Reference updates (mandatory, uncapped)

No existing id changes (Section 7.4 "Unchanged ids"). With no flag, every existing spec runs against the feature on the
branch, so the verify entries are real re-runs before the PR to `develop`. The three edits fall on Plan 1's *planned*
specs.

| ID | Phase | Kind | Target | Broken / at-risk reference | Minimal action |
|---|---|---|---|---|---|
| R-Q1-1 | Q1 | verify | `e2e/src/pages/work-orders/lines.page.ts:455-457, 2552, 2607, 2653, 2668, 2686` | `input_vehicle_{mileage,engine_hours,license_plate}` and the `.q-field:has(input[…]) p.text-caption / .q-spinner` reads in `VehicleCard.vue`. The panel mounts after `FaultCodesLookupButton` inside the same `q-expansion-item`. The selectors are scoped to the `.q-field` holding the input, so they cannot match the panel. The FD-204 watcher adds one A35 refetch per save; the spinner waits target the input, not the panel | Re-run consumers: `tests/ui/work-order-extended.spec.ts`, `work-order-lines.spec.ts`, `technician-work-order.spec.ts`, `finance.spec.ts`, `work-orders/completion-required-field-gates.spec.ts`, `tests/qb/quickbooks-{customer,journal-entries}.spec.ts` |
| R-Q1-2 | Q1 | verify | `tests/ui/work-order-history-validation.spec.ts:465-578` | Same input ids in history mode. The panel is gated `!isHistoryMode` | Re-run |
| R-Q1-3 | Q1 | verify | `src/pages/work-orders/inspection-build.component.ts:329`, `tests/dvi-v2/asset-inspections-tab.spec.ts:611` | `vehicle_card_title_link` `.filter({visible:true}).first()`. The panel adds no element with that id (it has no asset link) | Re-run |
| R-Q1-4 | Q1 | verify | `src/pages/parts/part-sales/single-part-sale.page.ts:612` | `//div[contains(@class,'q-expansion-item')]//div[contains(@class,'q-item__label')]` `.first()`. The panel is a **nested** `q-expansion-item`, gated `cardType === 'workOrder'` (NFR-F103), so it never renders on a part sale. Even if it did, the card header comes first in DOM order | Re-run `tests/ui/part-sales*.spec.ts` that use it; edit only if the gate regresses |
| R-Q2-1 | Q2 | verify | Plan 1 planned `worklist-create-wo-to-invoice.spec.ts` (P7-1), asset-tab create-WO path | `useMaintenanceWorkOrderActions.createWorkOrder(row, createdVia, { navigate = true })` gains an options arg; the default keeps navigation | None if the default is `true` as planned |
| R-Q3-1 | Q3 | verify (re-run set) | `finance.page.ts` consumers and other invoicing entry points: `tests/ui/finance.spec.ts`, `tests/ui/finance/*.spec.ts`, `tests/ui/billing/{invoice-reverse,invoice-preview-refresh}.spec.ts`, `tests/ui/work-orders/{over-discount-warning,wo-flow-date-handling,bulk-create-invoice,auto-complete-bulk,completion-*}.spec.ts`, `tests/ui/{partial-payments,deposits,credit-memos}.spec.ts`, `tests/ui/timeclock/clock-out-complete-*.spec.ts`, `tests/permissions/wo-{create-invoice,reverse-invoice,review-pay}-permissions.spec.ts`, `tests/qb/*.spec.ts` | `Invoice.vue`: the payment dialog is wrapped in `maintenanceStep.afterStep()`. Ids `button_create_invoice`, `section_new_payment_form`, `button_close_payment_dialog` unchanged | Re-run on the branch. Every invoicing spec now runs with the feature live: in the E2E org (which has active MR-E2E schedules while maintenance specs run) every WO with a vehicle makes one A38 call before the payment dialog (≤ 4 s; empty for ordinary WOs); the payment-dialog waits must tolerate it. In an org without schedules FD-224 keeps it synchronous. No edits expected |
| R-Q3-2 | Q3 | **edit** | Plan 1 planned `e2e/tests/ui/maintenance-reminders/invoice-resets-service.spec.ts` (P6-1) | A WO created via A33 (a `lines` link) → after Q3, **`dialog_maintenance_invoice_step` opens before the payment dialog**, and its backdrop swallows later clicks | See "Edits to Plan 1's planned specs" |
| R-Q3-3 | Q3 | **edit** | Plan 1 planned `worklist-create-wo-to-invoice.spec.ts` (P7-1) step 5 | Same: the step opens after Create invoice and blocks the in-app navigation back to the worklist | See "Edits to Plan 1's planned specs" |
| R-Q3-4 | Q3 | verify | Plan 1 planned `mark-complete-on-work-order.spec.ts` (P6-2), `mark-complete-compliance.spec.ts` (P6-3), `compliance-record.spec.ts` (P2-2) | EQ-10: Plan 1 `ResetDateField` / `CertificateFields` gain an optional `idSuffix`. Absent, `input_maintenance_reset_date` / `input_maintenance_certificate_*` stay byte-identical | None if absent stays identical; the Q3 dialog page object scopes by row otherwise |
| R-Q3-5 | Q3 | verify (re-run set) | `e2e/src/pages/work-orders/lines.page.ts` line-row readers (`verifyLineName` and the row text reads) | The "Closed {date}" caption is added to every closed line row (S18-R9, R219) | Re-run `tests/ui/work-order-lines.spec.ts`, `work-order-extended.spec.ts`; edit any exact whole-row text match to read the name cell |
| R-Q4-1 | Q4 | verify | `src/pages/work-orders/work-orders.page.ts:130-147` | Header XPaths `//th[contains(text(),'…')]`. "Maintenance schedule" contains none of the 18 matched substrings | None |
| R-Q4-2 | Q4 | verify | `work-orders.page.ts:180-182` (`td[2]`, `td[3]`, `td[12]`), `tests/ui/work-order-list.spec.ts:249` (`nth-child(4)`), `tests/ui/work-orders/filters-shared-url.spec.ts:168,219` (`td` nth 1), `tests/ui/technician-work-order.spec.ts:141` (`td[2]`) | Positional cells. The new column is spread **after** `linesCount`, so every index ≤ 12 holds. `numbersOfLines` (`td[12]`) has no consumers | None. Edit only if the implementer places the column earlier than planned |
| R-Q4-3 | Q4 | verify | `work-orders.page.ts:150-160` column toggles, `tests/ui/work-orders/waiting-on-parts-receive.spec.ts:45` (`toggle_column_*`) | One more toggle row (always present); no toggle-count assertions found | None |
| R-Q4-4 | Q4 | verify | `tests/ui/work-orders/filters-*.spec.ts` (`filters` project) | A new FilterDef `maintenanceOrigin` (always present). Row counts are scoped to seeded rows | None |
| R-Q4-5 | Q4 | verify | `src/api/fixtures/test-data.fixture.ts:549` (`GET /work-orders`) | Additive `maintenanceOrigin` field per row | None |
| R-Q5-1 | Q5 | verify (re-run set) | `tests/ui/work-order-lines.spec.ts:403-448` (C290, C291, C2189), `lines.page.ts:2141 splitWorkOrder`, `work-order.factory.ts:1948 splitLines` consumers | A new `WorkOrderSplitted` subscriber inside the split transaction. It must never fail the split (NFR-110) | Re-run |
| R-Q6-1 | Q6 | **edit** | Plan 1 planned `worklist-contact-card.spec.ts` (P7-3) step 1: "no Send reminder button" | Once Q6 lands on the branch, V1 (contact with email, CE admin) renders `button_maintenance_contact_send_reminder` and the negative assertion fails | See "Edits to Plan 1's planned specs" |
| R-Q6-2 | Q6 | verify | Plan 1 planned `e2e/src/pages/customers/maintenance-worklist.page.ts` contact card locators | `ContactCard.vue` is unchanged; the `#actions` slot is filled additively | None |
| R-Q6-3 | Q6 | verify | `e2e/src/pages/dialogs/send-invoice-email.dialog.ts` and its specs (invoice send) | `SendEmailDialog` gains additive props, a slot and a test id on the greeting `<p>` (NFR-F111, R215) | Re-run the invoice send specs |

Totals: 19 entries: 3 edits (all on Plan 1 planned specs), 16 verify-only / re-run.

**Cross-cutting caveat (feature always on).** Every invoicing spec passes through `afterStep`. While the E2E org has an
active schedule, a WO with a vehicle waits on A38 before the payment dialog (≤ 4 s, empty for ordinary WOs). Keep MR-E2E
schedules archived in cleanup so the org returns to "no active schedule" between runs where possible, and do not raise
local parallelism for mixed runs.

**Comment drift (not a breakage).** `finance.page.ts:817-826` documents the payment-dialog X as
`/invoices/remove-transaction-and-invoice` and cites `Invoice.vue` line numbers. The real route is
`invoices/remove-customer-transaction` (`app/src/api/billing/index.ts:64` → `RemoveInvoiceController`), and Q3 shifts
`Invoice.vue` lines by about 20. Refresh the docstring when Q3-2 is written, because Q3-2 relies on that route.

#### Edits to Plan 1's planned specs

These land in the same PR as the Plan 2 phase that causes them (Q3 for the first two, Q6 for the third).

| Plan 1 spec | Ref | Cause | Edit |
|---|---|---|---|
| P6-1 `e2e/tests/ui/maintenance-reminders/invoice-resets-service.spec.ts` | R-Q3-2 | After Q3, `dialog_maintenance_invoice_step` opens before the payment dialog for a WO created via A33, and its backdrop swallows later clicks | After `createInvoiceAndAwaitResponse()`: expect `dialog_maintenance_invoice_step`, click `button_maintenance_invoice_step_close` (untouched = accepted, S18-R15), then `clearPaymentDialogPreservingInvoice()`. The assertion (Last done = lines-closed date) is unchanged |
| P7-1 `e2e/tests/ui/maintenance-reminders/worklist-create-wo-to-invoice.spec.ts` | R-Q3-3 | Same: the step opens after Create invoice (step 5) and blocks the in-app navigation back to the worklist | The same edit as P6-1, before step 6 |
| P7-3 `e2e/tests/ui/maintenance-reminders/worklist-contact-card.spec.ts` | R-Q6-1 | Once Q6 lands on the branch, a contact with email renders `button_maintenance_contact_send_reminder` | Drop the "no Send reminder" assertion from step 1 (Q6-1 owns the button) |

#### Summary counts

| Phase | Create | Update | Backlog | Reference updates | §8 |
|---|---|---|---|---|---|
| Q1 | 4 | 0 | 2 | 4 verify | — |
| Q2 | 3 | 1 (Q1-2) | 2 | 1 verify | — |
| Q3 | 3 | 0 | 2 | 2 edit + 3 verify | — |
| Q4 | 1 | 1 (Q2-2) | 0 | 5 verify | — |
| Q5 | 0 | 0 | 0 | 1 re-run set | `None — no-fe-diff` |
| Q6 | 3 (env-blocked) | 0 | 1 | 1 edit + 2 verify | — |
| **Total** | **14** | **2** | **7** | **19 (3 edit, 16 verify)** | |

#### Testability notes (FE work beyond attributes, plus environment)

| # | Phase | Component / area | What is missing | Effect | Resolution |
|---|---|---|---|---|---|
| B-1 | Q6 | Environment (ops config) | QA and staging data are cloned from production, so a reminder sent there could reach a real customer. No send switch (D29) | Q6-1, Q6-2, Q6-3 (and the Q6 backlog item) run only where it is in place | **NFR-118 / TD-40**: before the branch build is deployed to QA or any non-production environment, every maintenance email goes only to a mail sink or the `MAINTENANCE_REMINDER_RECIPIENT_ALLOWLIST`. The specs run only there |
| B-2 | Q1, Q3 | Environment | Local invoice create 500s (QuickBooks bookkeeping row with null `auth`) | Q1-4, Q3-1, Q3-2, Q3-3 | Run on the branch's QA environment; locally `workplace.bookkeeping_enabled = 0` (reversible) |
| B-3 | Q3 | Plan 1 `ResetDateField.vue`, `CertificateFields.vue` | Fixed test ids rendered N times in the step (EQ-10) | Duplicate ids in the step dialog | **Not a blocker:** Plan 1 P2 (`CertificateFields`) and P6 (`ResetDateField`) already add the optional `idSuffix` prop (EQ-10 resolved). Fallback kept: the step page object scopes the inputs inside `maintenance_invoice_step_row_${id}` / `maintenance_invoice_step_certificate_${id}` |
| B-4 | Q3 | `components/ts/maintenance/invoicing/InvoiceStepServiceRow.vue` (planned) | The first draft seeded `ResetDateField` from `resetDateDefaults` (`linesClosedOn ?? invoicedOn`), not from A38 `proposedResetOn`. A carried user date (`proposalBasis = 'carried'`, NFR-117 / TD-104) would display as the lines-closed date while an untouched Confirm keeps the carried date on the server | Q3-2 step 4 would fail by design; a real product bug | **Fixed in this plan:** the row's initial date is A38 `proposedResetOn`; `linesClosedOn` / `invoicedOn` are only offered beneath the field; the diff compares against `proposedResetOn` (Phase Q3 frontend table, sketch and Vitest notes) |
| B-5 | Q1 | `WorkOrderMaintenancePanel.vue` (planned) | No refetch-in-flight signal. Plan 1 resolved the same gap with `:data-loading="isFetching"` (D22 / NFR-F12) on its tab, tiles and table, but the Q1 file table does not add it to `maintenance_wo_panel` | The planned scenarios wait on text/appearance changes (Overdue → not, `now_due` appears), so they are deterministic. Any future "value unchanged after refetch" assertion is not | Recommended: add `:data-loading="panel.isFetching.value"` on `maintenance_wo_panel` in Q1. **Not blocking** for the 13 Creates |
| B-6 | Q2 | `AddServiceDialog.vue` toast action | `button_maintenance_open_new_work_order` lives on an auto-dismissing Notify | Clicking it can race the timeout | Q2-2 uses the worklist WO link as the asserted path. Not blocking |
| B-8 | Q4 | `pages/WorkOrders.vue` column picker | Section 7.4 does not list the toggle id for the new column. Existing toggles render `toggle_column_<name>` (`waiting-on-parts-receive.spec.ts:45`). Users with saved prefs may not see the column | Q4-1 step 1 | Confirm the picker generates `toggle_column_maintenanceSchedule`; if not, it is an attribute-only fix the implementer adds |
| B-9 | Q2 | Toast Undo (S16-R25) | Undo lives on the same auto-dismissing Notify | Q2-3 step 1 can race the toast timeout | Same mitigation as B-6: click as soon as the toast attaches; the Remove path (step 2) is the stable assertion. Not blocking |

Open items from the E2E pass:
- Plan 1's TestRail section and `SECTION_MAP` entry for `ui/maintenance-reminders/` must exist before any Plan 2 case can be pre-minted.
- Q6-1's contact must receive real mail outside production only through the NFR-118 allowlist; use a Gmail `+tag` address (`buildEmailAddress`), never a real customer domain.
- `finance.page.ts:817-826` docstring names a route that does not exist (`remove-transaction-and-invoice`). Refresh it when Q3-2 is written.

---

## 8. Rollback Plan

| Layer | How to roll back | Data left behind |
|---|---|---|
| Whole feature | **No flag (D27).** Roll back by a hotfix release that reverts the feature-branch merge commit (or the offending phase's commits). A45 included | All MR rows kept; tables unused after the revert; reading capture stops with the revert; re-merging later resumes capture, and the historical load is re-run (idempotent) |
| Customer email (Send reminder) | No send switch (D29): removed only by a revert release. Outside production, the TD-40 sink or allowlist keeps mail away from real customers | Send log kept (permanent) |
| Invoice subscribers (reset and reversal, Plan 1) | **First**, with no deploy: Plan 1's `MAINTENANCE_INVOICE_RESET_ENABLED=0` (Plan 1 rollback, incl. the replay command). Q3's carry-forward and VOID reconciliation live in the same reset subscriber and switch off with it | — |
| In-shop position (TD-108) | No parameter (settled); revert the TD-108 commit, then `maintenance:projection:reconcile` per org | — |
| WO split adapter | Revert the subscriber commit; splits keep working (it never blocks) | Links moved so far stay on the new WO (correct) |
| WO list column | Revert Q4 commits; the characterization test proves the list is back to its pre-Q4 output | — |
| Schema | Migrations are additive (2 tables, 3 columns); never run `down()` in production | — |
| Frontend surfaces | No flag (D27): reverting the merge removes every surface | — |
| A45 (Add email) | Revert the endpoint | Emails already added stay on the contacts (audited in `entity_event`) |

**Rollout prerequisites.**
- **Non-production email delivery (NFR-118, TD-40).** Before the branch build is deployed to QA or any non-production
  environment (staging included), that environment's mail sink or `MAINTENANCE_REMINDER_RECIPIENT_ALLOWLIST` must exist
  and be verified, because their data is cloned from production. The Q6 E2E specs run only there.
- **Legal footer (Chunk 2 #31, answered 918945793).** No switch (D29). The footer ships as specified in S19-R15; a postal
  address or unsubscribe is a non-blocking fast follow, so nothing waits on legal. There is no Plan 3.
- **Release mechanics** (Plan 1 D28, BR18–BR21, §4.3 rule 8): migrations run with the deploy of the release that carries the branch; the
  historical reading load runs once right after it; the Terraform schedule for `maintenance:projection:refresh` is
  applied only after the deploy.

---

## 9. Security Considerations

**Tenant scoping.** Every new table carries `organization_id`; every DBAL statement binds it from
`OrganizationDecorator` (never from the request). Joined tenant tables (`work_order`, `invoice`, `company`,
`customer`, `workplace`, `work_order_canned_line`, `organization_detail`) are scoped in the join or by a second
decorator call. A38/A40 refuse another WO's invoice even inside the same org; A44 acts only on a link of the route WO.

**Inbound ids (NFR-112).** Section 5.3 is the contract. Non-nullable `#[MapEntity]` only; arrays count-checked.

**Golden Rule Exemptions** (tenant scoping, workplace axis; organization scoping is never relaxed). Record each in the
PR description under "Golden Rule Exemptions". GR-1..GR-3 and GR-6/GR-7 are Plan 1's (GR-6 and GR-7 ✅ APPROVED by the user
2026-10-04: the PRD states them, S1-R1 and S4-R7); Plan 2 extends them. GR-4 (ext.) and GR-5 are withdrawn (no job).

| ID | Where in Plan 2 | PRD citation | Reason | Alternatives rejected |
|---|---|---|---|---|
| GR-1 (ext.) | A35 rows from schedules homed at other workplaces; the copy decision compares the WO workplace with `home_workplace_id` (`copiesWork`, S16-R21); A42′ origin name of a schedule homed elsewhere | S16-R3 "every service that is due"; S16-N6 "tracking and completion stay organization-wide"; S16-R21; S13-R1 | The truck in front of the advisor is due for what it is due for, whichever location is the schedule's home | Header-workplace schedules only: hides due services the advisor must still address |
| GR-3 (ext.) | A40 corrections write completions of enrolments whose schedule is at another workplace | S18-R12 "Completion travels across the organization" | A correction must follow the completion it corrects | Restrict to same-workplace schedules: leaves the other location's cycle on a wrong date |
| GR-6 (ext., ✅ APPROVED 2026-10-04) | Schedule reads by organization only, as Plan 1 GR-6: the A35 schedule lookup, the A42′ origin link (opens from any location) | S1-R1 "shared by the whole organization"; S7-R1 | Product decided one schedule list per organization; the home location is data, not a scope | Workplace-scoped schedules copied per location (Product rejected) |
| GR-7 (ext., ✅ APPROVED 2026-10-04) | The schedule's **home** workplace canned lines (`work_order_canned_line`, `work_order_canned_line_part`, `labour_type` names) read while the header is another workplace: A35 line summary, A36 contents (hover and Add Service modal preview), the copy append consumed by A37 (`HomeCannedLineFetcher`) | S4-R7; S16-N6; S16-R23 "Parts used there, for reference" | The lines live at the home location; every other location reads them to show and copy them. The home id always comes from an org-scoped MR row, never from the request. Writes stay local: copied lines are created on the WO, which is header-scoped via `#[MapEntity]` | Copy canned lines into every workplace at enrol time (duplicates price/part data, drifts); header-workplace canned lines only (S4-R7 says the opposite) |

**Consent rules (PRD "Consent, gathered").** Setting off → no send (S19-N3, S14-R9); no preferred contact → no send
(S14-N4); recipients only from the company's own contacts plus addresses the user types (R2-15); enrolment sends nothing
(S7-R9). The setting change is audited by Plan 1 (S21-R7). **No unsubscribe link** by design (S19-R15); the footer ships as
specified in S19-R15; a postal address or unsubscribe, if legal requires one, is a non-blocking fast follow (Chunk 2 #31,
918945793); there is no switch (D29). A later footer change is a template change only.

**Email content.** One asset per message (S14-R6, S12-R9), so nobody sees another customer's vehicles. The user's
content is HTML-escaped before `nl2br` (NFR-119; the invoice template's `customEmailContent|raw` is not copied); Twig
autoescaping on every other value (unit names and service names are user text). No money. The subject carries only the
org name. Logs carry ids, never addresses (NFR-106). `email_list` addresses are validated (1–30, `Assert\Email`) and
logged with the send (recipients JSON).

**Email identity.** From is the platform address with the org's name (S19-R17); SPF/DKIM stay the platform's. Reply-To is
the sending user (S19-R18), as on the invoice and PO emails; BCC to that user only when they tick the toggle.

**Non-production delivery (NFR-118, TD-40).** QA and staging data are cloned from production, so its contacts carry real
customer addresses. Outside production, every maintenance email (Send reminder) is
delivered only to a mail sink or an explicit recipient allowlist (`MAINTENANCE_REMINDER_RECIPIENT_ALLOWLIST`), never to a
real customer; this must hold before the branch build is deployed there. E2E test
contacts use Gmail `+tag` addresses on that allowlist, never a real customer domain.

**Permissions (NFR-113).** A35/A36 WV (A36 also CV), A37 WC with the WO as subject (the `create-from-canned-line` check;
the FE destination on `workOrderLinesCreateAndEdit`, TD-123), A44 the same as A37, A38–A40 `InvoiceCreateVoter::INVOICE_CREATE` (S18-N7, TD-39), A41 and A43 CE, A45 `ROLE_CUSTOMER::CREATE_AND_EDIT` (TD-38), A42′ unchanged (existing WO list
permission; `filteredTotals` honours `allowPricing`). No new atoms.

**A45 (Add email).** Organization-scoped through the non-nullable `#[MapEntity] Company` plus the contact's `company_id`
(a miss is 404); `customer` (contact) rows carry no workplace, so no workplace axis applies; **no Golden Rule exemption**.
Add only (409 when an email exists), so it is never a second, unaudited edit path. Logs carry ids only; the address lives
in `entity_event` (audit) and on the contact. Revision 3 adds no exemption.

**Frontend.** The step after invoicing opens only from `initCreateInvoiceImpl`'s success; nothing new arms
`useInvoiceCreationIntent`, and the worklist Invoice action stays navigation only (risk R203, Plan 1 FD-15). Actions are
hidden by permission as listed in Section 2.9 (the backend gate is authoritative). Navigation to another location's WO
carries `locationId` or degrades to plain text (NFR-F110); a schedule opens from any location (GR-6). Copy never shows
money (NFR-115). A41's `email_list` accepts free-typed addresses (S19-R3), so the BE validates each address and logs
recipients in the send log only (NFR-106); the FE adds no new exposure, and the dialog's existing email-format rule
applies. The shared `SendEmailDialog` changes are additive (NFR-F111).

---

## 10. Requirement Traceability

One table for both layers. **Layer** says where the work is: `BE`, `FE`, or `BE + FE` (the frontend renders or sends
what the backend provides). Rows with Layer `E2E`, at the end of the table, name the Playwright scenario of Section 7
that traces the requirement. "By construction" means the rule holds because of how existing code works and gets a test, not
new code. Status "Planned" means the phase tables name the files; nothing is implemented yet. Phases are the union of both
halves.

| Requirement | Phase | Layer | API | Files | Status |
|---|---|---|---|---|---|
| S16-R1 | Q1 | FE | A35 | BE: FE only · FE: VehicleCard mount, PNL | Planned |
| S16-R2 | Q1 | BE + FE | A35 `dueCount` | BE: `WorkOrderPanelRowsBuilder` (no `addressedCount`) · FE: PNL header badge only (FD-211) | Planned |
| S16-R3 | Q1 | BE + FE | A35 rows | BE: `WorkOrderPanelRowsBuilder` (fold, next service) · FE: PanelServiceRow covered names, A35 rows / `isNextService` | Planned |
| S16-R4 | Q1 | BE + FE | A35 `due` | BE: `ServiceRowAssembler` (Plan 1 `DueDto`) · FE: P1 DueCell, formatDue | Planned |
| S16-R5 | Q1 | BE + FE | A35 `status` | BE: Plan 1 `DueStatus` · FE: P1 DueBadge | Planned |
| S16-R6 | Q1 | FE | — | BE: FE only · FE: PanelServiceRow (no tag) | Planned |
| S16-R7 | Q1 | BE + FE | A36, A35 `copiesWork` | BE: `DbalServiceContentsFetcher` (home workplace, GR-7) · FE: P1 HoverCard, ServiceContentsCard (reference parts heading when `copiesWork`), A36 | Planned |
| S16-R8 | Q1, Q2 | FE | A36, A37 | BE: FE only (calls A36/A37) · FE: AddServiceAction + AddServiceDialog (the Add Service modal on every row) | Planned |
| S16-R9 | Q1, Q2 | BE + FE | A35 `hasCannedLines`, A37 | BE: `WorkOrderPanelRowsBuilder`, `NoCannedLinesError` · FE: PanelServiceRow `hasCannedLines`, panelRowActions | Planned |
| S16-R10 | Q1 | FE | Plan 1 A18 | BE: FE only · FE: panelRowActions Add record, P1 CertificateRecordDialog | Planned |
| S16-R11 | Q1 | BE + FE | A35 `isEnrolled`, Plan 1 A9/A11 | BE: `GetWorkOrderPanelQueryHandler` · FE: PNL not-enrolled state, P1 EnrolmentDialog `mode="workOrder"` | Planned |
| S16-R12 | Q1 | BE + FE | existing `work-orders/change-mileage`, `change-engine-hours` | BE: Plan 1 P3 capture (TD-34: a value changed on this WO), A35 `needsReadings` · FE: inline VehicleCard inputs, per-row hint → `focus-meter` (FD-226), FD-204 refresh | Planned |
| S16-R13 | Q1, Q2 | BE + FE | A37, A28 | BE: `AddServicesToWorkOrderCommandHandler` (home lines or copied work), `MarkServiceCompleteCommandHandler` · FE: AddServiceDialog, panelRowActions Mark complete | Planned |
| S16-R14 | Q1 | BE + FE | — | BE: by construction · FE: No inference anywhere (actions are explicit) | Planned |
| S16-R15 | Q3 | BE + FE | A38/A40 | BE: Plan 1 `ResetMaintenanceOnInvoiceCreatedSubscriber`, `ConfirmInvoiceStepCommandHandler` · FE: STEP | Planned |
| S16-R16 | Q1, Q2 | BE + FE | A35 `lineCount`, `hours`, A36 | BE: `DbalCannedLineSummaryFetcher` · FE: PanelServiceRow summary, ServiceContentsCard, AddServiceDialog preview, toast (no money) | Planned |
| S16-R17 | Q1, Q2 | FE | A35 `addressed`; Plan 1 A27/A28 | BE: FE only · FE: panelRowActions.primary → Mark complete button after add, menu before → P1 MarkCompleteDialog `preselectedWorkOrderId` | Planned |
| S16-R18 | Q1, Q2 | BE + FE | A35 `addressed` | BE: `DbalWorkOrderLinksFetcher`, `WorkOrderServiceLink::markComplete()` · FE: FD-211 addressed line + header count, A35 `addressed` | Planned |
| S16-R20 | Q1 | BE + FE | A35 `addressed.linesCount` | BE: `DbalWorkOrderLinksFetcher` (lines appended, hand deletions still counted: assumption) · FE: addressed line "Added · n lines" | Planned |
| S16-N1 | Q1 | FE | — | BE: FE only · FE: needs-reading hint only, no control | Planned |
| S16-N2 | Q1, Q2 | BE + FE | — | BE: by construction · FE: Line search unchanged (walk) | Planned |
| S16-N3 | Q1 | BE + FE | — | BE: by construction · FE: Panel never touches WO close | Planned |
| S16-N5 | Q1 | BE + FE | A35, A36 | BE: NFR-115 key-scan tests · FE: No money in PNL | Planned |
| S16-R21 | Q1 | BE + FE | A35 `copiesWork`, `homeWorkplaceName`, top-level `workOrderWorkplaceName` | BE: `WorkOrderPanelRowsBuilder`, `GetWorkOrderPanelQueryHandler` · FE: PanelServiceRow copied-work (i) | Planned |
| S16-R22, S16-R23 | Q2 | BE | A37, A33 | BE: Plan 1 `AppendServiceLinesToWorkOrder` copy mode (Plan 1 TD-32), consumed · FE: none (existing line notes render) | Planned |
| S16-R24 | Q1, Q2 | BE + FE | A36, A35 `copiesWork` | BE: `DbalServiceContentsFetcher` · FE: AddServiceDialog (no parts when copying) | Planned |
| S16-R25 | Q2 | BE + FE | A37, **A44**, A35 `addressed.removable` | BE: `RemoveServiceFromWorkOrderCommandHandler` (TD-125), `LinkState::Removed`, positive state lists in A35/A38/origin/split/worklist · FE: addServiceToast Undo, Remove menu item | Planned |
| S16-N6 (display) | Q1, Q2 | BE + FE | A35 `copiesWork` | BE: `WorkOrderPanelRowsBuilder` (no `other_location`) · FE: no blocked state; (i) per S16-R21 | Planned |
| S16-N7 (display) | Q1 | BE + FE | A35 `addServiceBlockedReason` | BE: `WorkOrderPanelRowsBuilder` · FE: (i) `invoiced` copy | Planned |
| S16-N8 | Q1 | BE + FE | A35 `organizationHasSchedules` | BE: `GetWorkOrderPanelQueryHandler` · FE: panel renders nothing | Planned |
| S16-N9 | Q2 | BE | — | BE: by construction (one workplace → `copiesWork` always false) | Planned |
| S16-E1 | Q1 | BE + FE | A35 | BE: `DueDateResolver`, `DbalReadingHistory` (TD-108, settled, no parameter) · FE: FD-204 watcher, panelState `newlyDue` | Planned |
| S16-E2 | Q1 | FE | — | BE: FE only · FE: Collapsed by default (FD-212) | Planned |
| S16-E3 (split half) | Q5 | BE | split | BE: `MoveMaintenanceLinksOnWorkOrderSplitSubscriber` (partial split: NFR-114); merge half is Plan 1 | Planned |
| S17-R1 | Q2 | BE + FE | A37, A33′ | BE: `AddServicesToWorkOrderCommandHandler`, `CreatedVia::WoPanel` · FE: AddServiceDialog destinations, A37, A33′ | Planned |
| S17-N1 | Q2 | BE + FE | A37 | BE: `MaintenanceAccessGate::guardWorkOrderLinesCreate(WorkOrder)` (= `create-from-canned-line` gate, TD-123) · FE: AddServiceDialog destinations (`workOrderLinesCreateAndEdit` / `canCreateWorkOrder`) | Planned |
| S17-E1 | Q2 | BE + FE | A37 | BE: by construction · FE: Summary counts lines (one or many) | Planned |
| S17-E2 | Q1, Q2 | BE + FE | A28 | BE: `MarkServiceCompleteCommandHandler` (TD-110) · FE: Mark complete from the panel (FD-211) | Planned |
| S17-R2 (panel) | Q2 | BE | A37 | BE: Plan 1 `AppendServiceLinesToWorkOrder` (home lines or copied work, S16-N6) | Planned |
| S17-R5 (panel) | Q2 | BE | A37 | BE: Plan 1 `AppendServiceLinesToWorkOrder` (one short internal WO note, never mentions copying) | Planned |
| S17-R6 (panel) | Q2 | BE | A37 | BE: Plan 1 `AppendServiceLinesToWorkOrder` (audit) | Planned |
| S17-R8 (panel) | Q2 | BE + FE | A37 | BE: `AppendServiceLinesToWorkOrder` result (re-add after Remove re-attaches surviving lines, S16-R25) · FE: toast count, A37 | Planned |
| S18-R1 (WO half) | Q2 | FE | A35 | BE: FE only · FE: PanelServiceRow Mark complete button | Planned |
| S18-R7 (step) | Q3 | BE | A38, A40 | BE: `DbalInvoiceStepFetcher`, `ConfirmInvoiceStepCommandHandler::correct()` | Planned |
| S18-R8 | Q3 | BE + FE | A38, A40 | BE: `DbalInvoiceStepFetcher` (`removed` links excluded), `LinkState::Unticked` · FE: InvoiceStepServiceRow tick + reason, A38 | Planned |
| S18-R9 (display half) | Q3 | BE + FE | `GET /api/work-orders/lines/{workOrderId}` `end_date` | BE: `LinesDetailProvider` (stamp itself: Plan 1 P6, TD-18) · FE: `WorkOrderLineRow.vue` / `WorkOrderLineCard.vue` "Closed {date}" on every closed line (R219) | Planned |
| S18-R13 (step) | Q3 | BE + FE | A38 | BE: `ResetDateProposal` (basis), `DbalInvoiceStepFetcher` · FE: P1 ResetDateField seeded from A38 `proposedResetOn` (lines-closed / invoice dates as offers), A38 | Planned |
| S18-R14 | Q3 | BE + FE | A39, A40 | BE: `NextDuePreviewQueryHandler`, `ServiceCompletion::correctTo()` · FE: A39 preview, Next due | Planned |
| S18-R15 | Q3 | BE + FE | A40 | BE: `ServiceCompletion::confirm()` · FE: Confirm dates; untouched close → no request (FD-207) | Planned |
| S18-R16 | Q3 | BE + FE | A38, A40 (type, number, dates) | BE: `ComplianceRecord::fromWorkOrder()` (Start/End days, `CertificatePeriod`), `source_work_order_id` · FE: STEP certificate section, P1 CertificateFields (type, number, Start/End, term) | Planned |
| S18-R18 (step) | Q3 | BE + FE | A38 | BE: `DbalInvoiceStepFetcher` (orphaned excluded) · FE: A38 omission | Planned |
| S18-N1 | Q3 | BE + FE | — | BE: by construction · FE: Step closable, never blocks | Planned |
| S18-N5 | Q3 | BE + FE | A38 | BE: `GetInvoiceStepQueryHandler` (empty arrays) · FE: Shown only for a non-empty A38 | Planned |
| S18-N6 | Q3 | BE + FE | — | BE: by construction · FE: No step on WO completion (hook is invoice-only) | Planned |
| S18-E2 (step refinements) | Q3 | BE + FE | reverse + re-invoice | BE: `ResetDateProposal` carry-forward; readings re-settled (Plan 1 TD-35) (undo itself: Plan 1 P6, NFR-022) · FE: Step per new invoice | Planned |
| S18-E3 | Q3 | BE | re-invoice, lines/create (VOID) | BE: carried user date (credit-memo no-op pinned in Plan 1 P6); voided-invoice reconciliation in `ResetMaintenanceOnInvoiceCreatedSubscriber` (S18-E3 treats it as a reversal) · FE: — (no FE) | Planned |
| S18-N7 | Q3 | BE + FE | A38–A40 gate | BE: `guardInvoiceStep()` → `InvoiceCreateVoter::INVOICE_CREATE` (TD-39) · FE: `useMaintenanceInvoiceStep` (no CE gate) | Planned |
| S18-N8 | Q3 | BE + FE | A24/A35 `completed`, Plan 1 A29 | BE: no reopen endpoint; invoice completions not undoable (Plan 1 A29 409) · FE: no reopen entry; Undo complete keyed on `completed` | Planned |
| S18-R20 | Q3 | FE | A38 | FE: FD-205 `afterStep` (step before the payment dialog) | Planned |
| S18-R21 | Q3 | FE | — | FE: FD-207 discard confirmation | Planned |
| S18-E4 | Q3 | BE + FE | A38, A40 | BE: `ComplianceRecord::fromWorkOrder()` · FE: One CertificateFields per compliance service | Planned |
| S18-E5 | Q3 | BE | — | BE: by construction · FE: Nothing to build | Planned |
| S18-E6 | Q3 | BE + FE | A38 `complianceServices` | BE: `DbalInvoiceStepFetcher` · FE: Compliance absent from the date list, present in certificates (due from the End date) | Planned |
| S8-E3 | Q3 | BE | A38, A40 | BE: as S18-E4 | Planned |
| S21-R1 (step) | Q3 | BE | A40 | BE: `EntityEventType` completion events | Planned |
| S7-R1 (WO entry) | Q1 | FE | Plan 1 A9–A11 | BE: FE only · FE: P1 EnrolmentDialog from PNL | Planned |
| S8-R5 (WO entry) | Q1 | FE | Plan 1 A18 | BE: FE only · FE: P1 CertificateRecordDialog from PNL | Planned |
| S14-R4 | Q6 | BE + FE | A43, A41 | BE: `SendManualReminderCommandHandler` (items per TD-37), `ReminderPreviewQueryHandler` · FE: SendReminderButton, SendReminderDialog, SendEmailDialog (shared) | Planned |
| S14-R5 | Q6 | FE | — | BE: FE only · FE: "Send reminder", no Resend | Planned |
| S14-R6 | Q6 | BE + FE | A41 | BE: `DbalManualReminderItemsFetcher` · FE: A41 body one vehicle | Planned |
| S14-R9 | Q6 | BE + FE | A41, A30 | BE: `NotificationsOffError` · FE: SEND disabled reason | Planned |
| S14-R10 | Q6 | BE + FE | A41 | BE: `MaintenanceAccessGate::guardCustomerEdit()` · FE: SEND hidden without CE | Planned |
| S14-R12 | Q6 | BE + FE | A30′ `lastSentAt` | BE: `DbalWorklistLastSentFetcher` (`msend__org_vehicle_company_sent_idx`) · FE: SEND last-sent line, A30′ | Planned |
| S14-N1 | Q6 | BE + FE | A41, A30 | BE: as S14-R9 · FE: SEND disabled, not hidden | Planned |
| S14-E2 | Q6 | BE + FE | A41 | BE: `SendManualReminderCommandHandler` (audit + log with recipients) · FE: Refetch after send; BE audit | Planned |
| S14-E3 | Q6 | BE | — | BE: by construction | Planned |
| S21-R5 | Q6 | BE | A41 | BE: `maintenance_reminder_send(_item)` (recipients JSON) · FE: renders what the BE returns | Planned |
| S19-R1 | Q6 | BE | A41 | BE: `SendManualReminderCommandHandler` (one vehicle + company) | Planned |
| S19-R2, R4, R18 | Q6 | BE + FE | A43, A41 | BE: `ReminderComposer` (BE renders the body, TD-126), template, Reply-To user · FE: SendReminderDialog (`initialContent` = A43 `content`, `message=""`) + SendEmailDialog props/slot | Planned |
| S19-R3 | Q6 | BE + FE | A41, **A45**, A16 | BE: A45 `AddContactEmailCommandHandler` (TD-38); A41 `contact_ids` + `email_list` · FE: SendEmailDialog `listAllContacts` + `contact-no-email` slot, AddContactEmailDialog (FD-225) | Planned |
| S19-R19 | Q6 | BE + FE | A41 `contact_ids` order | BE: `ReminderRecipients::greeting()` (1 → "Hi A,", 2 → "Hi A and B,", else "Hello,") · FE: `greetContactByName` preview (FD-223) | Planned (#32 ✅ 918945793: a typed address does not change the greeting) |
| S14-R13 | Q6 | BE + FE | A30 `customerHasEmail` (Plan 1), A43, A41 | BE: TD-37 (no `NothingToRemindError`, no `hasReminderItems`) · FE: SendReminderButton visibility; never disabled for nothing due | Planned (S19-R23, #30 ✅) |
| S19-R5 | Q6 | BE | A43, A41 | BE: `ReminderStage::state()` | Planned |
| S19-R6 | Q6 | BE | A41, A43 | BE: `DbalManualReminderItemsFetcher` through Plan 1 `WorklistPredicates` (TD-37) | Planned |
| S19-R7 | Q6 | BE + FE | A41, A43 | BE: TD-37 next-two fallback; `nothingScheduledLine` · FE: ReminderPreviewTable renders Coming up, or no table with the S19-R23 line; no disabled state | Planned |
| S19-R8, R9 | Q6 | BE + FE | A43 `items` | BE: `ReminderItem`, `ReminderDueLabel` (any guessed date incl. Low → "Soon", never confidence wording; certificate → day) · FE: ReminderPreviewTable (BE labels) | Planned |
| S19-R14 | Q6 | BE | A41 | BE: `maintenance_reminder_send` + `entity_event` | Planned |
| S19-R15 | Q6 | BE | A41 | BE: template footer, as specified (why the customer received it; no unsubscribe) | Planned (#31 ✅ 918945793: legal is a non-blocking fast follow) |
| S19-R16, R17 | Q6 | BE | A41 | BE: `SymfonyReminderMailer` (TD-115) | Planned |
| S19-R21 | Q6 | BE + FE | A43 `callToAction` | BE: `ReminderComposer` (no telephone → no call to action) · FE: read-only call to action absent when null | Planned |
| S19-R23 | Q6 | BE + FE | A43, A41 | BE: TD-37 empty set → `nothingScheduledLine`, A43 `content` = that line, `ReminderComposer` renders no table, CTA + signature kept · FE: SendReminderDialog prefills the line, ReminderPreviewTable renders no table | Planned |
| S19-N3 | Q6 | BE + FE | A41, A30 | BE: `NotificationsOffError` · FE: SEND disabled reason | Planned |
| S19-N5, S19-N7, S19-E4 | Q6 | BE | — | BE: by construction | Planned |
| S19-N8 | Q6 | BE | A41 | BE: `SymfonyReminderMailer` (TD-115, TD-126) | Planned |
| S7-R10 | — | FE | — | Plan 1 FE text (enrolment sends nothing), unchanged | Planned (Plan 1) |
| S11-N1 | Q6 | BE | A43/A41 | BE: `ReminderDueLabel` ("Soon") | Planned |
| S12-R9 | Q6 | BE | A41 | BE: by construction (one asset per email) | Planned |
| S19 deferred rules (was R10–R13, R20, R22, N1, N2, N4, N6, E1–E3, E6, E7; plus the email halves of S7-R9, S12-R6, S12-R14, S5-E1/S5-R8; S7-N3 deleted) | — | — | — | Deferred to v2 by the PRD (Phase Q7 removed) | Not in this release |
| S22-R2 | Q4 | BE + FE | A42′ | BE: `DbalWorkOrderMaintenanceOriginProvider`, `ListingQueryHandler` · FE: ORG column (link on `settingsService`, else plain text, S22-R2), A42′ | Planned |
| S22-R3 | Q4 | BE + FE | A42′ | BE: `ListingQueryHandler` (null) · FE: ORG empty cell | Planned |
| S22-R4 | Q4 | BE + FE | A42′ filter + `totals=1` | BE: `applyOriginFilter()` + `ListingQueryHandler::filteredTotals()` (aggregate of each matching WO's whole `total_price`, TD-112) · FE: FilterDef `maintenanceOrigin` + "{n} work orders · {total} · Work order total" line (FD-214) | Planned |
| S22-R1 (Plan 2 half) | Q2, Q4 | BE | A37, A42′ | BE: TD-112 (an A37 link is an origin) | Planned |
| S22-N3 | Q4 | BE | A42′ | BE: TD-112 (`mark_complete` links never an origin) | Planned |
| S22-N1 | Q4 | BE + FE | A42′ | BE: `DbalWorkOrderMaintenanceOriginProvider` (path filter, `removed` excluded) · FE: A42′ | Planned |
| S22-N2 | Q4 | BE | — | BE: by construction | Planned |
| S22-E1 | Q2, Q4 | BE + FE | A37, A42′ | BE: earliest-link rule · FE: A42′ | Planned |
| S22-E2 | Q4 | BE | — | BE: — | Planned |
| NFR-101 | Q6 | BE | A41 | BE: `SendManualReminderCommandHandler` (row + transport in one transaction) | Planned |
| NFR-103 | Q6 | BE | A41 | BE: no switch (D29); the footer ships as specified, legal is a non-blocking fast follow (#31) | Planned |
| NFR-106 | Q6 | BE | — | BE: send log columns (recipients JSON); log context | Planned |
| NFR-107 | Q1 | BE | A35 | BE: `GetWorkOrderPanelQueryHandler` (query count test) | Planned |
| NFR-108 | Q4 | BE | A42′ | BE: `ListingQueryHandler`, provider (page-bounded, indexed, always run; TD-41c) | Planned |
| NFR-109 | Q4 | BE | A42′ | BE: `WorkOrderListCharacterizationTest` | Planned |
| NFR-110 | Q5 | BE | split | BE: `MoveMaintenanceLinksOnWorkOrderSplitSubscriber` | Planned |
| NFR-111 | Q3 | BE | A40 | BE: `ServiceCompletion::correctTo()` | Planned |
| NFR-112 | Q1, Q2, Q3, Q4, Q5, Q6 | BE | all | BE: request DTO validators (section 5.3) | Planned |
| NFR-113 | Q1, Q2, Q3, Q4, Q5, Q6 | BE | all | BE: `MaintenanceAccessGate` | Planned |
| NFR-114 | Q5 | BE + FE | split | BE: `MoveMaintenanceLinksOnWorkOrderSplitSubscriber` · FE: no FE code; checked in the browser walk | Planned |
| NFR-115 | Q1, Q2, Q3, Q4, Q5, Q6 | BE | A35–A44, email | BE: DTOs, `ReminderComposer`; key-scan tests | Planned |
| NFR-117 | Q3 | BE + FE | lines/create (VOID), re-invoice, A38, A40 | BE: reconciliation + carry-forward in `ResetMaintenanceOnInvoiceCreatedSubscriber`, `InvoiceNoLongerExistsError` · FE: InvoiceStepServiceRow starts from A38 `proposedResetOn` (a carried date shows as carried) | Planned |
| NFR-118 | Q6 | BE | A41 | BE: non-production mail delivery to a sink or allowlist (TD-40) before the branch build is deployed there; rollout prerequisite (Section 8) | Planned (ops) |
| NFR-120 | Q6 | BE | A45 | BE: `AddContactEmailCommandHandler` (add only, CE gate, `entity_event`, `CustomerUpdatedEvent`) | Planned |
| NFR-119 | Q6 | BE | A41 | BE: `ReminderComposer` (escape then `nl2br`), `ReminderRecipients` / DTO (`Assert\Email`, 1–30) | Planned |
| S17-R7 | Q2 | FE | Plan 1 | BE: Plan 1 (no Plan 2 change) · FE: Plan 1 worklist; new WO number shown after a panel create | Planned |
| S14-N2, S14-N4 | Q6 | BE + FE | A30 `customerHasEmail` (Plan 1), A41 | BE: `NoPreferredContactError` (N4), Plan 1 `customerHasEmail` (N2) · FE: SEND hidden without a preferred contact or any contact email; a preferred contact without email listed unticked (`listAllContacts`) | Planned |
| NFR-F101 | Q1, Q2, Q3, Q4 | FE | — | FE: VehicleCard, Invoice.vue, WorkOrders.vue, WorkOrderLineRow/Card specs (additive; no flag) | Planned |
| NFR-F102 | Q3 | FE | — | FE: useMaintenanceInvoiceStep | Planned |
| NFR-F103 | Q1 | FE | — | FE: VehicleCard gate | Planned |
| NFR-F104 | Q1, Q3 | FE | — | FE: queries | Planned |
| NFR-F105 | Q1, Q2 | FE | — | FE: FD-204, keys | Planned |
| NFR-F106 | Q2, Q3, Q6 | FE | — | FE: `:async-click` / `:async-submit` (Add Service, Undo, Remove, Send, Confirm dates) | Planned |
| NFR-F107 | Q1, Q2, Q3, Q4, Q5, Q6 | FE | — | FE: Section 7.4, EQ-10 | Planned |
| NFR-F108 | Q1, Q3 | FE | — | FE: PNL, STEP | Planned |
| NFR-F109 | Q1, Q3 | FE | — | FE: — | Planned |
| NFR-F110 | Q2, Q4 | FE | — | FE: ADD toast, ORG | Planned |
| NFR-F111 | Q6 | FE | — | FE: SendEmailDialog additive + regression specs of the 5 components that mount it (R215) | Planned |
| NFR-F112 | Q1, Q3 | FE | A35 | FE: VehicleCard (no DOM), `useMaintenanceInvoiceStep` FD-224 | Planned |
| S16-R1 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| S16-R2 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| S16-R3 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| S16-R4 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| S16-R5 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| S16-R7 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| S16-R16 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| S16-N5 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| NFR-115 (panel UI) | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| NFR-F107 | Q1 | E2E | — | E2E: Q1-1 · `e2e/tests/ui/maintenance-reminders/wo-maintenance-panel.spec.ts` | Planned |
| S16-R13 (Mark complete) | Q1 | E2E | — | E2E: Q1-2 · `e2e/tests/ui/maintenance-reminders/wo-panel-mark-complete.spec.ts` | Planned |
| S16-R17 | Q1, Q2 | E2E | — | E2E: Q1-2 (menu before add), Q2-1 (row button after add) · `e2e/tests/ui/maintenance-reminders/wo-panel-{mark-complete,add-service-this-wo}.spec.ts` | Planned |
| S18-R1 (WO entry) | Q1 | E2E | — | E2E: Q1-2 · `e2e/tests/ui/maintenance-reminders/wo-panel-mark-complete.spec.ts` | Planned |
| S16-R18 (mark_complete) | Q2 | E2E | — | E2E: Q2-U1 · `e2e/tests/ui/maintenance-reminders/wo-panel-mark-complete.spec.ts` | Planned |
| S17-E2 | Q2 | E2E | — | E2E: Q2-U1 · `e2e/tests/ui/maintenance-reminders/wo-panel-mark-complete.spec.ts` | Planned |
| S16-R12 | Q1 | E2E | — | E2E: Q1-3 · `e2e/tests/ui/maintenance-reminders/wo-panel-reading-now-due.spec.ts` | Planned |
| S16-E1 | Q1 | E2E | — | E2E: Q1-3 · `e2e/tests/ui/maintenance-reminders/wo-panel-reading-now-due.spec.ts` | Planned |
| S16-N1 | Q1 | E2E | — | E2E: Q1-3 · `e2e/tests/ui/maintenance-reminders/wo-panel-reading-now-due.spec.ts` | Planned |
| NFR-F105 | Q1–Q2 | E2E | — | E2E: Q1-2, Q1-3, Q2-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-*.spec.ts` | Planned |
| S16-N7 (display) | Q1 | E2E | — | E2E: Q1-4 · `e2e/tests/ui/maintenance-reminders/wo-panel-invoiced-blocked.spec.ts` | Planned (QA env) |
| S16-R8 | Q2 | E2E | — | E2E: Q2-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-this-wo.spec.ts` | Planned |
| S16-R13 (Add) | Q2 | E2E | — | E2E: Q2-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-this-wo.spec.ts` | Planned |
| S16-R18 (lines) | Q2 | E2E | — | E2E: Q2-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-this-wo.spec.ts` | Planned |
| S16-R20 | Q2 | E2E | — | E2E: Q2-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-this-wo.spec.ts` | Planned |
| S16-R19 (re-verified) | Q2 | E2E | — | E2E: Q2-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-this-wo.spec.ts` | Planned |
| S17-R2 (panel path) | Q2 | E2E | — | E2E: Q2-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-this-wo.spec.ts` | Planned |
| S17-R1 | Q2 | E2E | — | E2E: Q2-1, Q2-2 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-{this,new}-wo.spec.ts` | Planned |
| S17-N1 | Q2 | E2E | — | E2E: Q2-1, Q2-2 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-{this,new}-wo.spec.ts` | Planned |
| S17-R7 (re-verified) | Q2 | E2E | — | E2E: Q2-2 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-new-wo.spec.ts` | Planned |
| S22-R1 (wo_panel) | Q2 | E2E | — | E2E: Q2-2 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-new-wo.spec.ts` | Planned |
| S16-R24, S18-R1 (WO half) | Q2 | E2E | — | E2E: Q2-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-this-wo.spec.ts` | Planned |
| S16-R25, S16-N4 | Q2 | E2E | — | E2E: Q2-3 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-undo-remove.spec.ts` (toast step also Q2-1) | Planned |
| S16-R21, S16-N6 (display) | Q1 | E2E | — | E2E: Backlog · `e2e/tests/ui/maintenance-reminders/wo-panel-copied-work.spec.ts` (needs ≥ 2 workplaces) | Backlog |
| S16-R22, S16-R23, S16-R24 (copy) | Q2 | E2E | — | E2E: Backlog · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-copied.spec.ts` (needs ≥ 2 workplaces) | Backlog |
| S16-N8, S16-N9 | Q1, Q2 | E2E | — | E2E: none (Dev: be-functional `WorkOrderPanelEndpointTest`, fe-unit `WorkOrderMaintenancePanel.spec.ts`; N9 by construction) | Planned (Dev) |
| NFR-F110 | Q2, Q4 | E2E | — | E2E: Q2-2, Q4-1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-new-wo.spec.ts`, `work-orders-maintenance-origin.spec.ts` | Planned |
| S18-R8 | Q3 | E2E | — | E2E: Q3-1 · `e2e/tests/ui/maintenance-reminders/invoice-step-confirm-dates.spec.ts` | Planned (QA env) |
| S18-R13 (visible step) | Q3 | E2E | — | E2E: Q3-1 · `e2e/tests/ui/maintenance-reminders/invoice-step-confirm-dates.spec.ts` | Planned (QA env) |
| S18-R14 | Q3 | E2E | — | E2E: Q3-1 · `e2e/tests/ui/maintenance-reminders/invoice-step-confirm-dates.spec.ts` | Planned (QA env) |
| S18-R15 | Q3 | E2E | — | E2E: Q3-1, Q3-2 · `e2e/tests/ui/maintenance-reminders/invoice-step-*.spec.ts` | Planned (QA env) |
| S16-R15 | Q3 | E2E | — | E2E: Q3-1 · `e2e/tests/ui/maintenance-reminders/invoice-step-confirm-dates.spec.ts` | Planned (QA env) |
| NFR-F102 | Q3 | E2E | — | E2E: Q3-1 · `e2e/tests/ui/maintenance-reminders/invoice-step-confirm-dates.spec.ts` | Planned (QA env) |
| S18-E2 | Q3 | E2E | — | E2E: Q3-2 · `e2e/tests/ui/maintenance-reminders/invoice-step-dismissed-payment-carried-date.spec.ts` | Planned (QA env, B-4 fixed in Q3) |
| S18-E3 | Q3 | E2E | — | E2E: Q3-2 · `e2e/tests/ui/maintenance-reminders/invoice-step-dismissed-payment-carried-date.spec.ts` | Planned (QA env, B-4 fixed in Q3) |
| NFR-117 | Q3 | E2E | — | E2E: Q3-2 · `e2e/tests/ui/maintenance-reminders/invoice-step-dismissed-payment-carried-date.spec.ts` | Planned (QA env, B-4 fixed in Q3) |
| S18-R16, S8-R10 | Q3 | E2E | — | E2E: Q3-3 (Start date + term → End date) · `e2e/tests/ui/maintenance-reminders/invoice-step-compliance-certificate.spec.ts` | Planned (QA env) |
| S18-E6 | Q3 | E2E | — | E2E: Q3-3 · `e2e/tests/ui/maintenance-reminders/invoice-step-compliance-certificate.spec.ts` | Planned (QA env) |
| S18-E4 / S8-E3 (one record) | Q3 | E2E | — | E2E: Q3-3 · `e2e/tests/ui/maintenance-reminders/invoice-step-compliance-certificate.spec.ts` | Planned (QA env) |
| S22-R2 | Q4 | E2E | — | E2E: Q4-1, Q4-U1 · `e2e/tests/ui/maintenance-reminders/work-orders-maintenance-origin.spec.ts` | Planned |
| S22-R3 | Q4 | E2E | — | E2E: Q4-1 · `e2e/tests/ui/maintenance-reminders/work-orders-maintenance-origin.spec.ts` | Planned |
| S22-N1 | Q4 | E2E | — | E2E: Q4-1 · `e2e/tests/ui/maintenance-reminders/work-orders-maintenance-origin.spec.ts` | Planned |
| S22-E1 (write side) | Q4 | E2E | — | E2E: Q4-U1 · `e2e/tests/ui/maintenance-reminders/wo-panel-add-service-new-wo.spec.ts` | Planned |
| S18-R9 (display half) | Q3 | E2E | — | E2E: none (Dev: be-functional `WorkOrderLinesEndDateTest`, fe-unit `WorkOrderLineRow.spec.ts`); R-Q3-5 re-run | Planned (Dev) |
| S14-R4 | Q6 | E2E | — | E2E: Q6-1 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder.spec.ts` | Planned (blocked by B-1, NFR-118) |
| S14-R5 | Q6 | E2E | — | E2E: Q6-1 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder.spec.ts` | Planned (B-1, NFR-118) |
| S14-R6 | Q6 | E2E | — | E2E: Q6-1 (inbox step) · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder.spec.ts` | Planned (B-1, NFR-118) |
| S14-R12 | Q6 | E2E | — | E2E: Q6-1 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder.spec.ts` | Planned (B-1, NFR-118) |
| S14-E2 | Q6 | E2E | — | E2E: Q6-1 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder.spec.ts` | Planned (B-1, NFR-118) |
| S19-R16, S19-R17 (manual) | Q6 | E2E | — | E2E: Q6-1 (inbox step, optional) · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder.spec.ts` | Planned (B-1, NFR-118) |
| S19-R4, S19-R18 | Q6 | E2E | — | E2E: Q6-1 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder.spec.ts` | Planned (B-1, NFR-118) |
| S19-R3 | Q6 | E2E | — | E2E: Q6-1, Q6-3 · `worklist-send-reminder.spec.ts`, `worklist-send-reminder-add-email.spec.ts` | Planned (B-1) |
| S19-R19 | Q6 | E2E | — | E2E: Q6-1, Q6-3 · `worklist-send-reminder.spec.ts`, `worklist-send-reminder-add-email.spec.ts` | Planned (B-1) |
| S14-R13 | Q6 | E2E | — | E2E: Q6-1 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder.spec.ts` | Planned (B-1) |
| NFR-120 | Q6 | E2E | — | E2E: Q6-3 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder-add-email.spec.ts`; be-functional `AddContactEmailEndpointTest` | Planned (B-1) |
| S14-R9, S19-N3 | Q6 | E2E | — | E2E: Q6-2 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder-notifications-off.spec.ts` | Planned (B-1, NFR-118) |
| S14-N1 | Q6 | E2E | — | E2E: Q6-2 · `e2e/tests/ui/maintenance-reminders/worklist-send-reminder-notifications-off.spec.ts` | Planned (B-1, NFR-118) |
| NFR-114 / S16-E3 (split) | Q5 | E2E | — | E2E: none (Dev, gate 2; skip reason `None — no-fe-diff`); covered by `api/tests/Functional/VehicleService/Maintenance/WorkOrderSplitTest.php` | Planned (Dev) |
| S19-R1, R2, R5..R9, R14, R15, R21, N5, N7, N8, E4; S11-N1; S12-R9; NFR-119 | Q6 | E2E | — | E2E: none (Dev, gates 1–2): be-unit `ReminderStageTest`, `ReminderDueLabelTest`, `ReminderComposerTest`, `ReminderRecipientsTest`; be-functional `ManualReminderSendTest` | Planned (Dev) |

---

## 11. Verification Tickets
_Filed 2026-10-05 after the plan was approved. Each ticket is the post-implementation checklist for one phase and layer; links go to the epic's stories._

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| [SV-10863](https://shopview.atlassian.net/browse/SV-10863) | [MR Plan 2 · Q1 · BE] Verify work order maintenance panel API | Q1 · BE: The work order panel and service contents endpoints return the right rows, fast, with correct scoping. | SV-10572, SV-10573 | Sinisa Nogic |
| [SV-10864](https://shopview.atlassian.net/browse/SV-10864) | [MR Plan 2 · Q1 · FE] Verify work order maintenance panel | Q1 · FE: The Maintenance panel on the work order asset card shows due services and offers the right actions. | SV-10564, SV-10565, SV-10572, SV-10573 | Nikola Milosevic |
| [SV-10865](https://shopview.atlassian.net/browse/SV-10865) | [MR Plan 2 · Q2 · BE] Verify Add Service and Remove on a work order | Q2 · BE: A due service's lines can be added to and removed from a work order, with the right links, notes and conflicts. | SV-10572, SV-10573, SV-10577 | Sinisa Nogic |
| [SV-10866](https://shopview.atlassian.net/browse/SV-10866) | [MR Plan 2 · Q2 · FE] Verify Add Service dialog and Remove on the panel | Q2 · FE: Users can add a due service to this or a new work order from the panel, undo it and remove it. | SV-10572, SV-10573, SV-10574, SV-10577 | Nikola Milosevic |
| [SV-10867](https://shopview.atlassian.net/browse/SV-10867) | [MR Plan 2 · Q3 · BE] Verify invoice step API and re-invoice handling | Q3 · BE: The step after invoicing lists the right services, saves corrected dates and certificates, and survives reversal and re-invoicing. | SV-10565, SV-10572, SV-10574, SV-10576 | Sinisa Nogic |
| [SV-10868](https://shopview.atlassian.net/browse/SV-10868) | [MR Plan 2 · Q3 · FE] Verify "When was the maintenance done?" step | Q3 · FE: The step after invoicing appears exactly once before payment, lets users confirm or correct dates and certificates, and leaves ordinary invoicing untouched. | SV-10572, SV-10574 | Nikola Milosevic |
| [SV-10869](https://shopview.atlassian.net/browse/SV-10869) | [MR Plan 2 · Q4 · BE] Verify work order list origin and totals | Q4 · BE: The work order list carries the maintenance origin, filters by it and returns whole-result totals without changing existing output. | SV-10577 | Sinisa Nogic |
| [SV-10870](https://shopview.atlassian.net/browse/SV-10870) | [MR Plan 2 · Q4 · FE] Verify Maintenance schedule column on Work Orders | Q4 · FE: The Work Orders list shows, links and filters by the maintenance schedule a WO came from. | SV-10577 | Nikola Milosevic |
| [SV-10871](https://shopview.atlassian.net/browse/SV-10871) | [MR Plan 2 · Q5 · BE] Verify maintenance links follow a work order split | Q5 · BE: Splitting a work order moves maintenance links with their lines, so the right invoice resets the service. | SV-10572 | Sinisa Nogic |
| [SV-10872](https://shopview.atlassian.net/browse/SV-10872) | [MR Plan 2 · Q6 · BE] Verify hand-sent reminder and add-contact-email API | Q6 · BE: A reminder email can be previewed and sent by hand to the chosen contacts, logged and audited, and that a contact email can be added from the dialog. | SV-10568, SV-10569, SV-10571, SV-10575, SV-10576 | Sinisa Nogic |
| [SV-10873](https://shopview.atlassian.net/browse/SV-10873) | [MR Plan 2 · Q6 · FE] Verify Send reminder from the contact card | Q6 · FE: Users can send a maintenance reminder by hand from the worklist contact card through the existing send email dialog, with no change to other email dialogs. | SV-10571, SV-10575 | Nikola Milosevic |

When all these tickets are marked Done, the feature is ready for QA.

---

## Appendix: merge notes

This plan merges a backend half, a frontend half, the clarification and decision record, and the phase skeleton. Where
they contradicted each other, the backend half won on requirements, NFRs, data, the API (ids, paths, fields, errors),
backend phases, rollback and security; the frontend half won on frontend architecture, frontend phase content, test ids
and frontend traceability. Each resolution is listed below.

### Contradictions resolved

| # | Topic | What disagreed | Resolution (rule) | Where changed |
|---|---|---|---|---|
| 1 | A39 next-due preview request and response | FE: `reset_on` only, response `{nextDue}`. BE: optional `completion_id` (the A38 row's `completionId`) so the replay ignores the completion being replaced, and `coveredServices[]` in the response | BE shape; the FE sends `completion_id` (backend wins on API) | Section 5.1, 5.4; Section 2.8 key note; FD-208; Phase Q3 frontend table; EQ-5 |
| 2 | A37 add services request bounds and errors | FE: `enrolled_service_ids` ≥ 1, four 409 reasons. BE: 1–20 distinct ids, plus `NoCannedLinesError`, `LiveWorkOrderExistsError`, and 404 for the whole request on one foreign id | BE contract | Section 5.1, 5.4 |
| 3 | A38 step response | FE field list lacks `linkId`, `proposalBasis`, `recordFromThisWorkOrder`; FE lists empty arrays for reversed or removed invoices only. BE adds the three fields and also empties for a `VOID` invoice | BE contract | Section 5.1, 5.4 |
| 4 | A40 step confirm | FE response `{updatedCount, untickedCount, certificatesCreatedCount}`, 400 only for a future date. BE adds `certificatesCorrectedCount` and a 400 for a date before the previous effective completion | BE contract | Section 5.1, 5.4 |
| 5 | A41 manual send | FE response without `sendId`; three 409 reasons. BE adds `sendId`, 409 `ReminderJustSentError` (60 s guard) and 400 `ReminderSendFailedError` | BE contract | Section 5.1, 5.4 |
| 6 | A36 contents gate | FE: WV. BE: WV or CV (A36 also serves the asset-tab hover) | BE gate (TD-123) | Section 5.1, 5.4 |
| 7 | A35 panel | FE: 404 "WO not in org"; `addressed` only for addressed rows. BE: 404 for a WO outside the org or header workplace; `addressed` also set for an `unticked` lines link | BE contract | Section 5.1, 5.4 |
| 8 | A39/A40 ids | The brief anticipated a frontend note swapping A39 and A40. No such note exists: both halves use A39 = preview (GET, optional `completion_id`) and A40 = confirm (POST) | Nothing to swap; ids as in the backend half | — |
| 9 | Reversal handling owner | FE (finding F-1, EQ-1, Q3 notes, R204, Q3 verification step 4) asked the Plan 2 backend to undo completions on `invoices/remove-customer-transaction`. BE: the undo on every reversal path is in Plan 1 P6 (amendment, TD-29, NFR-022), accepted | Plan 1 P6; the FE references now point at it and the frontend EQ-1 is dropped as resolved (same question as the backend EQ-1, marked resolved) | Section 2.1; Phase Q3; Section 3.5 R204; Section 0 |
| 10 | Q1 Plan 1 prerequisites | BE: Plan 1 P4–P6. FE: Plan 1 P5–P7 | Union: P4–P7, each half's reason kept | Phase Q1 |
| 11 | Q5 requirement id | FE: "NFR (engineering), no requirement id" and a trace row "Split links (engineering)". BE: NFR-114 (the S16-E3 split rule as written on 2026-10-02) | NFR-114 (backend wins on NFRs); the FE trace row is merged into the NFR-114 row | Phase Q5; Section 10 |
| 12 | Phase attribution | S16-N2 (BE Q1, FE Q2), S17-E2 (BE Q2, FE Q1), S16-R8 (BE Q1/Q2, FE Q2), S16-R16 (BE Q1, FE Q1/Q2), S16-R13 (BE Q1/Q2, FE Q1/Q2) | Section 10 shows the union of both halves' phases | Section 10 |
| 13 | Product question numbering | Both halves numbered from PQ-1 with different questions under the same numbers (for example PQ-7 = fold rule in BE, origin link in FE); three questions overlapped | One deduplicated list PQ-1…PQ-19, ordered by phase; every in-text reference rewritten (mapping below) | Section 0 and every reference |
| 14 | Engineering question numbering | Both halves numbered from EQ-1; three pairs overlapped; three questions resolved | One list EQ-1…EQ-12 of open questions; resolved ones dropped (mapping below) | Section 0 and every reference |
| 15 | Column count in the rollback plan | BE 7.1: "3 tables, 5 columns"; BE Section 4: "four additive columns" (`confirmed_at`, `confirmed_by`, `source_work_order_id`, `last_visit_on`) | 4 (the enumerated list in Section 4.2) | Section 8 |
| 16 | Dangling reference | BE risk R2-13 cites "(3a path 4)"; Section 3a has no numbered paths | "Section 3a, voided-invoice row" | Section 3.4 |
| 17 | Requirements traced but not in the requirement list | The FE traceability lists S17-R7, S14-N2 and S14-N4 (Plan 1 requirements re-rendered by Plan 2); the BE requirement list does not | Added to Section 1 as "Plan 1 requirements the Plan 2 frontend re-verifies" | Section 1, Section 10 |
| 18 | Collapsed trace rows | FE: one row "S19 (all)" (no FE), one row "S22-E1, S22-N1", one row "S14-N2, S14-N4" | One row per requirement in Section 10 | Section 10 |
| 19 | DQ3 remark | DQ3 says the historical volume is "relevant to the Chunk 2 plan only"; D19 moved the historical load into the release (Plan 1 P3) | Kept verbatim with a merge note | Section 1 clarifications |

### Product question mapping (old id → this plan)

| This plan | Backend half | Frontend half | Answer 2026-10-05 |
|---|---|---|---|
| PQ-1 | PQ-2 | — | Accepted (S16-E1); parameter removed |
| PQ-2 | — | PQ-1 | Accepted: existing fields; hint points to the field (S16-R12) |
| PQ-3 | — | PQ-2 | Answered (S16-R8) |
| PQ-4 | PQ-7 | — | Accepted (S16-R3) |
| PQ-5 | — | PQ-11 | Changed: badge alone (S16-R2) |
| PQ-6 | — | PQ-8 | ⏸ PENDING PQ-6 (open with Product) |
| PQ-7 | PQ-6 | PQ-10 (merged) | Accepted (S17-R1) |
| PQ-8 | PQ-1 | — | Accepted (S18-E2) |
| PQ-9 | — | PQ-3 | Changed: anyone who can invoice (S18-N7) |
| PQ-10 | — | PQ-4 | Accepted (S18-R20) |
| PQ-11 | — | PQ-5 | Accepted (S18-R21) |
| PQ-12 | — | PQ-12 | Accepted, tightened (S18-N8) |
| PQ-13 | PQ-9 | PQ-6 (merged; the backend adds the Mark-complete-origin half) | Accepted + Add Service origin (S22-R1, R4, N3) |
| PQ-14 | — | PQ-7 | Accepted (S22-R2) |
| PQ-15 | PQ-3 | PQ-9 (merged) | Moot |
| PQ-16 | PQ-4 | — | Moot |
| PQ-17 | PQ-5 | — | Moot |
| PQ-18 | PQ-8 | — | Moot |
| PQ-19 | PQ-10 | — | Moot |

### Engineering question mapping (old id → this plan)

| This plan | Backend half | Frontend half |
|---|---|---|
| EQ-1 | EQ-2 | — |
| EQ-2 | EQ-3 | — |
| EQ-3 | EQ-4 | EQ-2 (merged) |
| EQ-4 | EQ-5 | — |
| EQ-5 | EQ-6 | EQ-3 (merged) |
| EQ-6 | EQ-8 | — |
| EQ-7 | EQ-9 | — |
| EQ-8 | — | EQ-6 |
| EQ-9 | — | EQ-4 |
| EQ-10 | — | EQ-5 |
| EQ-11 | — | EQ-7 |
| EQ-12 | — | EQ-8 |
| dropped (resolved) | EQ-1 (undo on reversal → Plan 1 P6), EQ-7 (`reset_basis`/`undone_reason` in Plan 1 P6) | EQ-1 (same question as backend EQ-1) |

The resolved questions are recorded in the Section 1 clarifications table.

### Other editorial changes (no change of substance)

- The frontend half's reference to a working contract file was replaced by "the Plan 1 API contract (Plan 1 Section 5)".
- The backend half's "section 8 traces every one" now points at Section 10; its per-half counts line was replaced by a
  count of the merged Section 1.
- Backend and frontend phase blocks were interleaved under the template headings; table headers "Path | C/M | What and
  why" became "File | Action | Description". The frontend half's "Implements" lists were merged into each phase's single
  list, with the NFR ids taken from the traceability of both halves; "Requires Plan 1 phases merged" names the Plan 1
  phases each half depends on.
- The frontend Q4 and Q5 blocks have no code sketch; their "Key code changes" say so.

### E2E pass, review fixes and housekeeping (2026-10-02)

| # | Change | Where changed |
|---|---|---|
| E1 | **E2E plan spliced in.** The E2E curation pass (12 Creates, 2 Updates, 6 Backlog, 17 Reference updates, 8 testability notes) replaced every "Planned in the E2E pass" placeholder. Each phase block carries its scenarios with name, type, requirement ids, role, steps, expected result and page objects / factories, plus its backlog and Dev-layer list. Q5 and Q7 carry the skip reason `None — no-fe-diff`; Q6 carries the read-half override marker and the B-1 / NFR-118 stage gate | Phases Q1–Q7 "E2E tests (e2e/)" |
| E2 | Section 7 "E2E tests": conventions inherited from Plan 1, the scenarios in template format, one Backlog table, the Reference updates list, the three edits to Plan 1's planned specs (P6-1, P7-1, P7-3), summary counts and the testability notes B-1…B-8 | Section 7 |
| E3 | Section 10: E2E traceability rows (Layer `E2E`) appended, one per traced requirement; Q5 and Q7 rows name the Dev-layer test that covers them instead | Section 10 |
| E4 | **B-4 fixed (plan bug).** The step row's date was seeded from `resetDateDefaults` (`linesClosedOn ?? invoicedOn`), so a carried user date (`proposalBasis = 'carried'`, NFR-117) would have shown as the lines-closed date while an untouched Confirm kept the carried date on the server. The row's initial date is now A38 `proposedResetOn`, the server's proposal for that completion; the lines-closed and invoice dates are only offered beneath the field, and the diff compares against `proposedResetOn`. Scenario Q3-2 (dismiss payment, re-invoice keeps the user's date) is consistent with it | Section 2.7; FD-207; Phase Q3 frontend table, code sketch (new `InvoiceStepServiceRow` sketch), Vitest notes, verification step 4; Section 10 S18-R13 and NFR-117 rows; Section 7 testability note B-4 |
| E5 | **B-1 addressed by a new requirement, NFR-118.** Outside production, every maintenance email (Send reminder) goes only to a mail sink or explicit allowlist, never to real customer addresses, because staging data is cloned from production. The kill switch stays `0` by default everywhere. Q6/Q7 E2E runs on stage only once the sink or allowlist exists | Section 0 (email gate); Section 1 NFR table and counts (18 backend NFRs); TD-124 (Section 3.2); Phase Q6 and Q7 "Implements" and backend tables, Q6 verification; Section 8 rollout prerequisites; Section 9; Section 10 |
| E6 | **EQ-10 resolved** (housekeeping): Plan 1 P2 (`CertificateFields`) and P6 (`ResetDateField`) already add the optional `idSuffix` prop, so no Plan 1 change is owed. Testability note B-3 is therefore not a blocker; row scoping stays as the fallback | Section 0; Section 2.7 seam paragraph; risk R207; Section 7 testability notes |

### Audit fixes (2026-10-02, PRD-vs-plan audit pass)

| # | Finding | Fix | Where changed |
|---|---|---|---|
| A1 | **H1, S22-R4:** `pagination.totalWorkOrderPrice` is a per-page sum (`ListingQueryHandler.php:182-199`; `Paginator.php:117` applies `setMaxResults`), and the FE adds pages as they load, so "From maintenance" + Total price gave the value of the loaded rows only | New true aggregate: A42′ `totals=1` → `pagination.filteredTotals {workOrderCount, totalWorkOrderPrice\|null}` over every row matching the request (all filters, including `maintenanceOrigin`). Same `buildQuery()` and decorators (header workplace; origin `EXISTS` bound to the decorator org), select `wo.id, wo.total_price` + `GROUP BY wo.id`, no ORDER BY/LIMIT, wrapped `COUNT`/`SUM`; `null` amount without `allowPricing`; only runs when asked (NFR-108). Shown as a totals line while the filter is on. PQ-13 reworded on the correct premise | Section 0 PQ-13; Section 1 S22-R4; pending index; Section 2.0; TD-112; FD-214; Section 5.1–5.4 (A42′, `totals`); Phase Q4 (BE/FE tables, tests, verification, Dev-layer); Section 9; Section 10 |
| A2 | **M1:** the manual Send reminder used the worklist's 91-day window and Needs-readings rows, which S19-R7 forbids (S14-R4 → "the email specified in S19") | TD-122 rewritten: a manual send covers what the S19 email covers, the pair's services inside their reminder window per S19-R6/R7 (`ReminderStage`); backlog and Low in window still included; nothing in window → 409 `NothingToRemindError`. `ReminderStage` is now created in Q6 and reused by Q7 | Section 1 S14-R4, S19-R6, S19-R7; TD-122; Section 4.1 `stage` note; Section 5.1/5.4 (A41); Phase Q6 (BE table, tests, Dev-layer); Phase Q7 (ReminderStage row); Section 10 |
| A3 | **M2:** S5-N1, S5-R8 and S14-R5 say nothing is emailed automatically in this release, while the email ships in it behind the kill switch | New product question PQ-20 (cites S5-N1); proposal: "nothing is emailed automatically until the email is switched on" | Section 0 PQ-20; pending index |
| A4 | **M6:** FE gated "Add to this work order" on `workOrderLinesCreateAndEdit`, BE A37 on WC; the Q2 backlog claimed A37 refuses a user without the lines bundle | Verified the existing add-canned-line gate: `CreateFromCannedLine/CreateController.php:27` `denyAccessUnlessGranted(ROLE_WORK_ORDER_CREATE_AND_EDIT, $workOrder)`, `unanimous` strategy (`security.yaml:295`) with the `OrganizationAwareVoter` subject voter; the FE New Line button is gated on `workOrderLinesCreateAndEdit` (`WorkOrderNavBar.vue:65`), a bundle carrying WO view + WO CE (`FEPermissionMappings.php:155-166`). A37 now uses the same check (`guardWorkOrderLinesCreate(WorkOrder)`) and the FE keeps the New Line bundle, so both sides match the existing feature. The backlog claim is corrected (a `workOrdersCreateAndEdit`-only user is allowed by A37, as by `create-from-canned-line`) | Section 1 S17-N1; Section 2.9; TD-123; Section 5.1; Phase Q2 (BE table, FE spec, backlog); Section 7 Backlog; Section 9; Section 10 |
| A5 | **S19-R9 vs "Soon":** `ReminderDueLabel` replaced "Low confidence" with "Soon", unflagged | New product question PQ-21 (proposal: follow S19-R9, month + "Low confidence"); design switched to the proposal; email rows marked pending | Section 0 PQ-21; Section 1 S19-R9; pending index; TD-122; Section 4.1 `due_label`; Phase Q6 (ReminderDueLabel, tests, Dev-layer); Section 10 S19-R9 |
| A6 | **L4:** "Open asset maintenance tab" in the panel row menu contradicts S16-R9 ("Mark complete alone") | Removed: menu = Mark complete, Add record (compliance), Undo complete; no menu without CE | `panelRowActions.ts` row; Section 2.10 diagram; Section 7.4 test ids; Q1 verification step 3; Q1/Section 7 backlog; R-Q1-3 |
| A7 | **S18-R9:** the line close date must be "visible on the work order, distinct from the invoice date"; Plan 1 only stamps it, and the lines read does not return `end_date` today | Q3 adds the display half: `LinesDetailProvider` returns `end_date`; `WorkOrderLineRow.vue` / `WorkOrderLineCard.vue` show "Closed {date}" (flag on). Traceability row added; Section 1 count 120 → 121 | Section 1 S18 table and counts; Phase Q3 (Implements, BE/FE tables, tests, verification step 10, Dev-layer, R-Q3-5); Section 7 reference updates and summary counts (18 entries); Section 10 |
| A8 | **L1:** S16-E3 reported as removed | S16-E3 is still on the Chunk 2 page, rewritten on 2026-10-02 as split + merge; the old E3 ("creating a work order is unchanged") is what was removed. Q5 implements its split half (NFR-114 refines a partial split); the merge half is Plan 1 | Section 1 scope, S16 table, NFR-114 origin; pending index (FE); Phase Q5 Implements; Section 10 |
| A9 | **L3:** PQ-16 understated the effect | Reworded: a second "after" row (still Past due, e.g. +7 and +14) never sends either; cites S5-E1 | Section 0 PQ-16 |
| A10 | **L8:** Q4 dependency text contradicted Section 6 | Q4's code depends only on Plan 1; only its E2E update Q4-U1 lands after Q2 (both places now say so) | Section 6 intro; Phase Q4 "Depends on" |
| A11 | **L10:** "three `WorkOrderSplittedSubscriber`s" | Five (four in `WorkOrders/Domain/{Part,PartRequest,PartReturnRequest,Task}`, one in `Inventory/Orders/Domain`) | Section 2.0 |
| A12 | **L9:** origin rule vs Plan 1 TD-16 | TD-112 states the rule is derived from the link table by `path IN ('lines','no_lines')` whatever `created_via` (so `wo_panel` counts) and **supersedes Plan 1 TD-16** | TD-112; EQ-12 |
| A13 | **Dependency notes:** `refreshExpiredWindows()` and the `ResetDateField` `offers` / `disable` props had no owner in Plan 2 | Marked as provided by Plan 1 P4 (`DueProjectionRecomputer::refreshExpiredWindows()`) and Plan 1 P6 (`ResetDateField` props); Plan 2 only calls / passes them. `ServiceRowAssembler` stays Plan 2's own extraction (Q1) | NFR-105; Section 2.7; Phase Q1 (assembler row); Phase Q3 (Requires, sketch comment); Phase Q7 (Requires, recomputer row, sketch comment) |
| A14 | Housekeeping | Scripted check: every Section 1 PRD id (121), backend NFR (18) and frontend NFR (10) appears in Section 10. No machine-local paths in the plan. Section 0 lists all 21 product questions (PQ-1…PQ-21) in final wording | Whole plan |

### Revision 2026-10-04 (PRD edit of 2026-10-02, reconciled BE + FE change sets)

The Chunk 2 page is "Ready for tech plan" (handoff 6 October); the PRD edit of 2 October changed five things Plan 2
builds on. The backend change set won on API and data, the frontend change set on UI, and the API contract follows the
backend reconciliation agreed on 2026-10-04. Old ids in the mapping tables above are unchanged.

| # | Change | What this plan now says | Where |
|---|---|---|---|
| R1 | **No automatic email in v1** (S19 rewritten; the automatic rules moved to "Deferred to v2") | Phase Q7 deleted; its requirements are the "Deferred to v2" list matching the PRD (S19-R10..R13, R20, R22, N1, N2, N4, N6, E1..E3, E6, E7, plus the email halves of S7-R9, S12-R6, S12-R14, S5-E1/S5-R8; S7-N3 deleted). Deleted with it: `maintenance_reminder_run`, `last_visit_on`, TD-109/114/116/117/119, NFR-102/104/105/116, GR-4 ext., GR-5, `SystemActor`, `organizationIdsWithFlag()`, `maintenance-reminders.tf`, `ReminderChangeDetector`, `ReminderEligibility`, `SendWindowPolicy`, `ReminderGroupBuilder`, `OrganizationTimezoneResolver`, `ReminderDispatcher`, `ReminderCallToAction`, the rate limiter. **v2 carry-over:** that design (hourly job with a run row per org and local day, idempotency key at most once, change detection by stage + state fingerprint, 08:00 local Mon–Fri with catch-up to 17:00, timezone from the busiest workplace cached 7 days, system actor UUID) is recoverable from this file's git history before this revision | Header, Sections 0, 1, 2, 3, 4, 6 (Q7), 7, 8, 9, 10 |
| R2 | **Q6 rewritten as a hand send through the existing `SendEmailDialog`** | The BE renders the body (greeting by the PQ-22 rule, escaped content, reminder table, call to action, invoice-style signature, footer; TD-126). New A43 preview (`content`, `callToAction` split out, `items`, `locationTelephone`); A41 reshaped to the FE names (`contact_ids`, `email_list` 1–30, `include_bcc`, `email_content`); Reply-To = the user, BCC optional; no 60-second guard (TD-122); new 409 `NoPreferredContactError`; `NoRecipientError` and `ReminderJustSentError` gone. Send tables reshaped (recipients JSON, one row per send). NFR-101 rewritten, NFR-119 added (escape before `nl2br`, address validation). FE: additive props/slot on `SendEmailDialog` (FD-222/223, NFR-F111, regression risk R215 over its 7 consumers). NFR-118 and the `manualSendAvailable` switch kept; the switch now waits only on the legal footer | Sections 1, 2, 3, 4, 5, 6 (Q6), 7, 9, 10 |
| R3 | **Copied work at another location** (S16-R21..R25, N6 rewritten, N8, N9; S17-R2/R5) | A35 `copiesWork`, `homeWorkplace*`, `addressed.removable`, top-level `organizationHasSchedules` and `workOrderWorkplaceName`; `other_location` and `OtherLocationError` removed; the copy itself is Plan 1 TD-32. Add Service opens `AddServiceDialog` (preview from A36, no parts when copying); toast Undo and menu Remove call the new A44, which sets the link to `removed` (TD-125), excluded everywhere by positive state lists. GR-6/GR-7 ✅ approved 2026-10-04. New E2E Q2-3 (undo/remove); copy scenarios in Backlog (need ≥ 2 workplaces) | Sections 1, 2, 3, 5, 6 (Q1, Q2, Q4, Q5), 7, 9, 10 |
| R4 | **Mark complete becomes the row's button once lines are added** (S16-R17, S18-R1) | `panelRowActions.primary()`; FD-211; Q2-1 asserts it | Sections 1, 3, 6, 7, 10 |
| R5 | **Certificates are days** (S8-R2, R10, R11, E1, E2; S18-R16, E6) | A38 `currentRecord` = Plan 1 A17 Record (`startDate`, `endDate`); A40 `start_date`/`end_date`; Q3 step uses Plan 1 `CertificateFields` (Start + term fills End); Q3-3 enters Start date + term; Q1-1 seeds a record ending today + 20 days | Sections 1, 5, 6 (Q1, Q3), 7, 10 |
| R6 | **No Plan 3** | The Plan 3 trigger is removed everywhere; the only sending gate left is the legal footer question | Header, Sections 0, 1, 6, 7, 8 |

**Section 0 status changes.** PQ-3 answered (the Add Service modal); PQ-14 half moot (Settings half open); PQ-15..PQ-19
moot; PQ-20 and PQ-21 answered by the PRD edit ("Soon" on Low); PQ-22..PQ-28 added with proposals (PQ-22 = FE PQ-B,
PQ-23 = FE PQ-C, PQ-27 = FE PQ-A); PQ-1, PQ-2, PQ-4..PQ-13 stay open and are no longer "pending rework". EQ-1, EQ-2, EQ-6
moot; EQ-7 narrowed to the legal switch. "S19 ops" answered; "S19 legal" narrowed to the footer (postal address).

**Housekeeping.** Scripted check after the revision: every Section 1 PRD id (108, compressed rows expanded), backend NFR
(15) and frontend NFR (11) appears in Section 10. No machine-local paths in the plan. E2E totals: Create 13, Update 2,
Backlog 7, Reference updates 19 (3 edit, 16 verify).

### Re-audit fixes 2026-10-04

Re-audit of this plan against the current PRD (Chunk 1, Chunk 2, index). It found no missing requirement and 8 partial ones. Each finding and its fix:

| # | Finding | Fix | Where changed |
|---|---|---|---|
| F1 | **H1:** the Q6 wrapper passed no `message` to `SendEmailDialog`. The dialog renders `${formatHTML(message)}.`, and `formatHTML(null)` throws. All 5 components that mount it directly pass `message` | `message` = A43 `content`, the fixed S19-R2 wording, shown in the dialog's fixed paragraph. The wrapper strips a trailing full stop because the dialog adds one. The box opens empty for this send's own words, and the BE renders the fixed wording before `email_content`. The `initialContent` prop is dropped | TD-126; FD-222; FD-223; Section 1 S19-R2/R4; A41 (`email_content` may be empty); A43; Section 5.4; Phase Q6 (BE composer row, FE table, sketch, note, Vitest notes, walk, E2E Q6-1 step 2); Section 10 |
| F2 | **R215 count:** "7 consumers" | 5 components mount the dialog directly. `UnpaidTransactionsTable.vue` and `PartSale.vue` are indirect users; their specs are still re-run | R215; Section 2.7; FD-223; NFR-F111 row |
| F3 | **M1:** S18-E3 says "a voided invoice is not a case", but the app voids a `PENDING` invoice when a line is added (`Line/Create/CreateCommandHandler.php:147-160`) | Reconciliation at the next invoice is kept and marked pending PQ-27 (new) | Section 0 PQ-27; Section 1 S18-E2/E3, NFR-117; clarifications; pending index; TD-104; Section 3a; R2-13; A38 note; Phase Q3 (subscriber row, tests, Dev-layer); Section 10 |
| F4 | **M2:** the FE pending row for PQ-2 said "As specified in the PRD" | The row now says the inline inputs deviate from S16-R12 and S10-R1 and are pending PQ-2. PQ-5/PQ-6 are split into their own row | pending index (FE) |
| F5 | **M3:** when the preferred contact has no email, the dialog ticks the first contact that has one | Added to PQ-23. Proposal: the preferred contact stays listed and unticked with a "no email" note, nothing else is ticked, and Send works with the contacts the user ticks. New optional dialog prop `keepDefaultContactWithoutEmail` (default false keeps today's behavior) | PQ-23; pending index; FD-223; Phase Q6 (FE table, sketch, spec notes, walk); Section 10 S14-N2/N4, S19-R2..R4 |
| F6 | **M4/M5:** these stay flagged (PQ-7, PQ-13, PQ-1) | TD-108 and its Q1 row now say `maintenance.in_shop_position_enabled` defaults to `1` (the proposal) and is pending PQ-1 | TD-108; Phase Q1 BE table |
| F7 | **M6:** FD-211 offered Undo complete on a `lines` row reset by Mark complete; `panelRowActions` did not | FD-211 now matches `panelRowActions`: Undo complete appears only on the `mark_complete` path. A `lines` row reset by Mark complete is undone from the asset tab | FD-211; `panelRowActions.ts` row |
| F8 | **L1:** Remove is refused after a reset, which is stricter than "until invoiced" | New PQ-28. Proposal: yes; Undo complete first | PQ-28; TD-125; FD-221; A44; sketch Q2-b |
| F9 | **L2:** the line count after lines are deleted by hand was undefined | Assumption: "Added · n lines" counts the lines the add appended, including lines later deleted by hand (S16-N4) | Section 1 S16-R20; FD-211; A35; Q2-3 step; Section 10 S16-R20 |
| F10 | **L3:** `addressed.path` could not hold `no_lines` | `'lines'\|'no_lines'\|'mark_complete'`. A `no_lines` row follows the `lines` rules | A35; FD-211; `panelRowActions.primary()` sketch; `WorkOrderPanelRowsBuilderTest` |
| F11 | **L4:** the step title did not match the PRD index | Renamed "When was the maintenance done?" | Phase Q3 FE table, walk step 1 |
| F12 | **L5:** Appendix E5 still mentioned "the automatic job" | Removed | Appendix E5 |
| F13 | **L6:** line numbers had drifted | Split guard at `:74-76`. `Invoice.vue` reloads at `:1242` and `:1789` | Section 2.0; F-2 |
| F14 | **§2 dependency:** TD-102 and Q1's "Requires" line named a Plan 1 row assembler that does not exist | Plan 2 creates `ServiceRowAssembler` itself in Q1, extracted from `GetAssetMaintenanceQueryHandler` | TD-102; Phase Q1 "Requires" |
| F15 | **Question numbering:** renumbered to match the Chunk 2 thread (#22..#29, continuing 1–21) | PQ-22..PQ-25 are unchanged. PQ-26 is the former PQ-28 (tech time on a copy). PQ-27, PQ-28 and PQ-29 are new: the voided pending invoice, Remove after a reset, and a copied line with no labour type (proposal: the copy keeps no labour type and is not priced; owed as a Plan 1 edit). The former PQ-26 (covered prefill without home access) and PQ-27 (certificate End date) moved to the Chunk 1 thread as **Q16** and **Q15** and are cited that way. Older appendix blocks keep their old numbers as history | Section 0; clarifications; pending index; D25, D26; Section 1 S16-R22; Phase Q3 tests and walk |

**Not changed (re-audit open items left as they were):** Plan 1's stale `addToWorkOrder` forward note. It is a Plan 1 edit; Plan 2 uses `useAddServicesToWorkOrderMutation`. The Section 1 clarification row Q1 is still "pending". Remove still shows while the toast is up.

**Housekeeping.** The scripted check ran after these fixes. All 108 Section 1 PRD ids and all 26 NFRs (15 backend, 11 frontend) appear in Section 10. Every Section 1 id appears in a phase "Implements" line except S7-R10, which is FE only and delivered by Plan 1. There are no machine-local paths in the plan.

#### Re-audit follow-up 2026-10-04

| # | Change | Where changed |
|---|---|---|
| F16 | **H1 revised to keep S19-R4's prefill (supersedes F1's empty box).** The wrapper passes `initialContent` = A43 `content`, so the box opens prefilled and editable, and passes `message=""` so the wording appears only once. In the code, `formatHTML('')` returns `''` safely, but the dialog's template still prints `${formatHTML(message)}.` as a lone "." (`formatHTML(null)` throws). The smallest safe fix is a `v-if="message"` guard on that `<p>`. All 5 direct consumers pass a non-empty `message` (Invoice, OrderItems, AddOrderDialog, UnpaidTransactionsStatements, AccountingCustomerStatementDialog), so their DOM is unchanged and no hide prop is needed. The BE renders `email_content`, which is the prefilled wording, possibly edited, and adds no separate fixed paragraph | Section 1 S19-R2/R4; TD-126; FD-222; FD-223; A41; A43; Section 5.4; Phase Q6 (composer row, FE table, sketch and note, Vitest notes, walk, E2E Q6-1 step 2); Section 10 |
| F17 | Clarifications row Q1 is marked answered: the 2026-10-02 page edit marked Chunk 2 "Ready for tech plan" | Section 1 clarifications |
| F18 | PQ-22..PQ-29 are marked POSTED (reply 916586498 on the Chunk 2 thread). PQ-1..PQ-21 were already posted on 2026-10-02 as footer comment 914882562 (corrected by the orchestrator) | Section 0; Section 1 clarifications |

**Housekeeping.** The trace check was re-run. All 108 Section 1 PRD ids appear in Section 10. Every Section 1 id appears in an "Implements" line except S7-R10, which Plan 1 delivers. There are no machine-local paths in the plan.

### Revision 3 — 2026-10-05

**Inputs.** Product's replies of 2026-10-05 (Milos Vasic): 917733377 (Chunk 2 #1–#21) and 917209101 (#14, #22–#29) on the
Chunk 2 thread; 917667841, 917405698, 917438476 on the Chunk 1 thread. The PRD pages as edited that day (Chunk 1 MR,
Chunk 2 MR, index: Key Decision "No feature flag", new "Release" section, new Open Question on the WO card's phone
layout). The reconciled backend and frontend revision-3 change sets (the backend's reconciliation log is authoritative for
the API and data; the frontend's for UI) plus the FE adjustments. The user's two decisions of the same day: one shared
feature branch, and no legal send switch.

**Decisions applied.**
- **D27 No feature flag.** Every `MaintenanceReminders` check, flag guard, flag-off walk, flag-off spec and E2E flag scope
  is gone. Gating is by permission only. Every org now pays the runtime cost: TD-41 (A35 fast path, A38 skipped through
  FD-224, A42′ always run, page-bounded).
- **D28 Delivery.** One shared feature branch (`feature/SV-3780-maintenance-reminders`): Plan 1 (P0–P7), then Plan 2
  (Q1–Q6), each phase PR into the branch with the full per-phase gates → QA tests the branch build → one PR to `develop`
  (the formal E2E coverage pass runs there) → the next regular release. Branch-drift risks recorded as R2-19 (Plan 1
  BR18–BR21: drift, migration ordering, no per-org rollback, every-org cost) and R220 (FE shared files); hygiene in Plan 1
  D28, BR18–BR21, §4.3 rule 8 (weekly `develop` merge, never rebase, fresh-database migrate + diff gate after every sync, never
  re-timestamp an executed migration).
- **D29 No legal send switch.** `manualSendAvailable`, A32′, `MAINTENANCE_REMINDER_EMAIL_ENABLED`,
  `maintenance.reminder_email_enabled`, `ReminderSendingUnavailableError`, TD-121, FD-215 and the "ships dark" override
  are removed. The legal footer applies to hand sends (PRD index); the shared branch waits for it (postal address, Chunk 2 #31)
  before going to `develop`. NFR-118 / TD-40 (sink or allowlist) stay as environment safety.

**Chunk 2 answers mapped to edits.**

| Q | Answer | Edits |
|---|---|---|
| #1 (PQ-1) | Accepted: an In the shop value counts toward a threshold, not the rate | TD-108 settled; `maintenance.in_shop_position_enabled` removed; R2-11 closed; Q1-3 note and B-7 deleted |
| #2 (PQ-2) | Accepted: existing fields; the hint points to the field | S16-R12; FD-226 (`focus-meter`); Q1 FE rows, tests, walk; test ids per row |
| #3, #4, #7, #8, #10, #11, #14 | Accepted | Markers removed; S16-R8, S16-R3, S17-R1, S18-E2, new S18-R20 / S18-R21, S22-R2 |
| #5 (PQ-5) | Changed: badge alone | S16-R2; A35 `addressedCount` removed; FD-211; Q1 panel header, specs, E2E, test ids |
| #6 (PQ-6) | Deferred to Product | ⏸ PENDING PQ-6 kept (Section 0, R208, Q1 walk) |
| #9 (PQ-9) | Changed: anyone who can invoice | New S18-N7; TD-39 (`InvoiceCreateVoter::INVOICE_CREATE`, `guardInvoiceStep()`); A38–A40 gates; `useMaintenanceInvoiceStep` loses the CE gate; tests, walk step 11, backlog row |
| #12 (PQ-12) | Accepted, tightened: no reopen, nothing changes the dates | New S18-N8; invoice completions not undoable (A24/A35 `completed` null; Plan 1 A29 409) |
| #13 (PQ-13) | Accepted + Add Service origin; the total is each WO's whole total | S22-R1 (Plan 2 half), S22-R4 copy "42 work orders · $38,410 · Work order total", new S22-N3; TD-112; FD-214; Q4 tests |
| #15–#21 | Moot | Unchanged |
| #22 (PQ-22) | Changed: one or two names, otherwise "Hello," | S19-R19; `ReminderRecipients::greeting()` in `contact_ids` order; FD-223; greeting tests |
| #23 (PQ-23) | Extended: every contact listed; Add email | S19-R3; **A45** `PATCH /api/customers/{companyId}/contacts/{contactId}/email` (TD-38, NFR-120); FD-225 `AddContactEmailDialog`; `listAllContacts` + `contact-no-email` slot; Q6-3 |
| #24 (PQ-24) | Changed: never disabled; worklist's 91-day window, else the next two as Coming up | New S14-R13; S19-R6/R7; TD-37 (`WorklistPredicates`); TD-118/TD-122 rewritten; `hasReminderItems` and `NothingToRemindError` removed; A43 `nothingScheduledLine` |
| #25–#29 | Accepted | Markers removed (S16-R25, S16-R22, S18-E3) |

Other answers carried in: A24/A29 undo semantics (Undo complete puts the WO's readings back to In the shop unless the WO
has a live invoice or another effective Mark complete On it; the asset's own mileage and engine hours never change), Q9
(Mark complete On a WO records its readings, Plan 1 TD-35), Q13 (only an entered or changed WO value is a reading,
Plan 1 TD-34), and the readings re-settlement on the VOID path (Section 3a).

**New Product questions (posted 2026-10-05, reply 917831683; proposals built).** #30 a unit with no dated service at all: send with "Nothing is
scheduled for {unit} yet." in place of the table. #31 the legal footer: posted asking whether it applies to hand sends
(proposal no); superseded by the PRD index (it applies), correction to be posted on the Chunk 2 thread; open item is the
postal address (legal); the branch waits for it before `develop`. #32 greeting with ticked contacts plus a typed address: name the ticked
contacts per S19-R19. The product question mapping table above gains an "Answer 2026-10-05" column.

**Housekeeping.** The Section 1 ↔ Section 10 trace check was re-run by script: 115 Section 1 PRD ids (108 + S14-R13,
S18-N7, S18-N8, S18-R20, S18-R21, S22-N3, S22-R1 Plan 2 half), 16 backend NFRs (NFR-120 added) and 12 frontend NFRs
(NFR-F112 added); every one appears in Section 10. The only pause-glyph markers left are PQ-6, #30, #31 and #32; markers in the
older appendix notes above were reworded as history. No machine-local paths. Section 7 E2E counts: Create 14 (Q6-3
added), Update 2, Backlog 7, Reference updates 19.

### Final audit fixes 2026-10-05

| # | Finding | Fix |
|---|---|---|
| MEDIUM-1 | #31 asked again whether the legal footer applies to hand sends, with a "no" proposal; the PRD index already says it applies | #31 reworded everywhere (header, Section 0, gates, markers, S19 heading and S19-R15, NFR-103, clarifications, pending tables, D29, R2-3, R2-16, Q6, Section 7, rollback, security, Section 10, Revision 3 notes): the footer applies to hand sends; the open item is the postal address (legal). The branch → `develop` hold stays. Marked "correction to be posted on the Chunk 2 thread" |
| MEDIUM-2 | The collapsed WO card kept a "Maintenance" title | Q1 panel header and test list: the badge alone, no title or other text (S16-R2, #5), matching the Q1 walk and E2E Q1-1. The accessible name is an `aria-label`, not visible text |
| LOW-1 | S18-R16: the step could not carry the certificate type | A40 `certificates[]` gains `compliance_type` (as Plan 1 A18; 400 when it differs from the enrolled service's type); the Q3 step row lists the certificate fields per S8 (type prefilled, Certificate number, Start, End, term); Section 1 and Section 10 S18-R16 rows updated |
| LOW-2 | S19-R9 "with Low confidence" vs S11-N1 "Soon" | Kept "Soon"; the PRD tension is stated at PQ-21 and TD-122, raised in reply 917438478 |
| LOW-3 | S16-R2 badge counting rule unstated | Section 1 S16-R2: the badge excludes covered services folded under a listed coverer, per #4's answer (917733377, S16-R3); a covered service with no listed coverer keeps its own row and counts |
| LOW-4.1 | Drift risks cited as R2-16/R2-17 | Repointed to R2-19 (with R220) in the Delivery line and the release gate |
| LOW-4.2 | #30–#32 marked both "to be posted" and "posted" | All read posted 2026-10-05 in reply 917831683 (the harvest predated it); #31 also carries the correction above |
| LOW-5 | "Plan 1 Section 1.3" does not exist | Repointed to Plan 1 D28, BR18–BR21 and §4.3 rule 8 (Delivery line, D28 row, R2-19, Section 4 rule 6, Section 6 intro, rollback, Revision 3 D28 note) |
| Item 8 | Does Add email (A45) owe an accounting event? | Verified in code: `contacts/change` (`Customer/Contacts/Application/Change/ChangeCommandHandler.php`) saves the contact and dispatches `CustomerUpdatedEvent`, whose only subscriber is the portal webhook; it writes no outbox row. `customer_updated` comes only from company-level writers. `CustomerSnapshotBuilder` and `CustomerUpdatedPayloadBuilder` read the authorizer (else first) contact's email. A45 emits the same (`CustomerUpdatedEvent`) and nothing more; recorded in TD-38 and R2-17. The hub side (`../shopview-accounting`) was not checked |

**Housekeeping.** The Section 1 ↔ Section 10 check was re-run by script: 115 Section 1 PRD ids (compressed rows such as
"S19-R8, R9" expanded), 16 backend NFRs and 12 frontend NFRs, every one traced in Section 10. Machine-local path sweep:
none.

### Final answers 2026-10-05

Product answered Chunk 2 #30, #31 and #32 in reply 918945793 (Chunk 2 thread) and the "Soon" wording in reply 918913025 (Chunk 1 thread). Applied in place:

| Item | Product's answer | Plan 2 edit |
|---|---|---|
| #30 (918945793) | "When a unit has nothing dated, the opening line and the table give way to 'Nothing is scheduled for {unit} yet.'; the call to action and signature stay" (new **S19-R23**) | New S19-R23 row in Section 1 and Section 10. Design changed from "line in place of the table" to "line in place of the opening line **and** the table": A43 returns `items: []`, `nothingScheduledLine` and `content` = that line (so it prefills the box in place of the S19-R2 wording); `ReminderComposer::defaultContent(items, unit)` returns the line; the composer and template render no table; greeting, call to action, signature and footer stay. FE: `SendReminderDialog` renders `ReminderPreviewTable` only when `nothingScheduledLine` is null. Updated: TD-37, TD-122, FD-216, FD-222, A43, the Section 5 FE notes, the Q6 file table, both sketches, the tests and the Q6 browser walk |
| #31 (918945793) | "The legal footer is a fast follow and does NOT block the release or anything else. Build the footer as specified in S19-R15 and release without waiting. A postal address or unsubscribe is added later if legal requires it." | Every "the branch waits for the legal footer before `develop`" hold removed (header, Section 0 Delivery and S19 legal, the S19 and Q6 headings, S19-R15, NFR-103, Clarifications, answers index, D29, the Q6 E2E note, rollback, security, Section 10). R2-3 and R2-16 closed |
| #32 (918945793) | "OK. A typed address doesn't change the greeting" (S19-R19) | Already built; markers removed (S19-R19 rows, FD-223, A41, `ReminderRecipients`) |
| S19-R9 (918913025) | The email never shows confidence wording; every guessed date, including every Low date, reads Soon | The S19-R9 row reads "Soon for any guessed date, never confidence wording"; PQ-21's PRD tension marked resolved; TD-122, Section 10 and the test notes updated |

Execution State: **Ready to implement.** Open: only Chunk 2 #6 (PQ-6, phone layout; non-blocking, interim layout built) and the legal footer as a non-blocking fast follow. The only remaining pause-glyph marker is PQ-6 (#6).

Checks: the scripted Section 1 ↔ Section 10 check passes (116 expanded PRD ids, S19-R23 included; none missing). The machine-local path sweep found none.
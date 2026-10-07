# SV-10323 — Note attachment "For Customer" checks the note's organization — QA findings (5 Oct 2026)

**Ticket:** [SV-10323](https://shopview.atlassian.net/browse/SV-10323) · Bug · TESTING QA · Medium · parent SV-9667 (Notifications Update V1)
**Developer handoff:** comment 77887 (Nemanja Djuric, 5 Oct 08:05 −0500) · PR [#3369](https://github.com/ShopView/shopview/pull/3369)
**AFTER build:** `sv9667.qa.shopview.com`, app-version `v26.40.7-7ffda69` (read at every run, unchanged all pass). PR head is `0764761`, one
commit later; that commit only touches `WorkOrderPartRequests.vue` (tablet-width Parts table), so every line under test is deployed.
**BEFORE build (Rule 86):** production `app.shopview.com`, `v26.40.7-e1021b1`, org `72b2cc90…`.
**Spec:** Notifications Update V1, Confluence page 817463297, v27 (2026-10-01) — S10-R5b quoted below.

## SOURCE-CURRENCY (Rule 31/59)
| Source | Identifier / version | Checked | Verdict |
|---|---|---|---|
| Ticket + comments | SV-10323, 4 comments, last 77887 | 17:5x UTC 5 Oct, re-read before write | CURRENT |
| Spec | page 817463297 v27 | 5 Oct | CURRENT |
| PR | #3369 head 0764761, CI all green | 5 Oct | CURRENT |
| Build | v26.40.7-7ffda69 | every run | CURRENT |

## What "done" means (ticket description) + the developer's checklist
1. A user cannot update an attachment on another organization's note.
2. An attachment whose uploader has no organization can still be updated by its own organization.
3. A test covers the cross-organization attempt.
Handoff checklist: (a) Edit user toggles → saves, survives reload · (b) View-only user → switch disabled, API 403 · (c) random id → 404 (was 400).

Spec S10-R5b (verbatim): *"Ticking or clearing For Customer on an attachment is not an edit to the note. Any user with Edit for the kind of
record it is on can do it: 'Work Orders → Edit' for a work order or work order line, 'Part Sales → Edit' for a part sale, and 'Customers →
Edit' for a customer or an asset. A user who can only view the record sees the checkbox disabled, so they can still tell which files the
customer sees."*

## Variant matrix (Rule 96) — every cell observed live on the branch

Record kinds × users. Fixture notes (all ZZAUTOTEST, on WO S2-17414 / customer West Mifflin Diesel Repair / its asset / part sale P9667-368).
"disabled" = `aria-disabled="true"`, a click sends no request, value unchanged after reload; API column = direct `POST /api/note/update-attachment`.

| User (genuine sign-in) | Permissions that matter | Work order | WO line | Customer | Asset | Part sale |
|---|---|---|---|---|---|---|
| Admin | everything | ticks, 201, persists | ticks, 201, persists | ticks, 201, persists | ticks, 201, persists | ticks, 201, persists |
| Sales Representative | WO View, Part Sales View, Customers Edit | disabled, 403 | disabled, 403 | ticks, 201, persists | ticks, 201, persists | disabled, 403 |
| Sales Representative minus Customers Edit | WO View, Part Sales View, Customers View | (as above) | (as above) | **disabled, 403** | **disabled, 403** | (as above) |
| Office User | WO View, Part Sales View, Customers Edit | disabled, 403 | disabled, 403 | ticks, 201, persists | ticks, 201, persists | disabled, 403 |
| Technician (tech view mode) | WO View, Lines C&E, Customers View | **box not shown** | **box not shown** | **box not shown** | **box not shown** | note not visible |

Every cell matches S10-R5b **except the Technician row** — see question Q1. Same row on production: box not shown (checked live, below).

## Organization checks (done-when 1 and 3)
Org A = Staging Foothills Group Inc `d55bc308`; Org B = a second organization registered for this test (`6b0ca354`, customer, note
`7a2a6a9e`, attachment `2bf122af`).
| Attempt | Result | Flag afterwards |
|---|---|---|
| Org A admin ticks Org B's attachment | 404 `'Attachment' was not found.` — body byte-identical to a made-up id | Org B's flag unchanged |
| Org B admin ticks Org A's work-order attachment | 404, same body | Org A's flag unchanged |
| Org B admin ticks its own attachment (control) | 201 | ticked |
| Org A note list | does not contain Org B's note | — |
| Made-up attachment id | branch 404 `{"errors":[{"error":"'Attachment' was not found."}]}` · production 400 `{"errors":[{"id":"Not found"}]}` | — |
| Malformed id | branch 400 (validation) | — |

No screen sends another organization's attachment id, so this half is API-surface by nature (Rule 63(a)); the user-facing half is the
leaver case below. **Done-when 3:** PR #3369 adds `NoteTenantScopingTest` cases
`testUpdateAttachmentOnAnotherOrganizationsAttachmentIsNotFoundAndLeavesTheFlag`,
`testUpdateAttachmentReachingAnotherOrganizationsNoteIsNotFoundAndLeavesTheFlag`,
`testUpdateAttachmentOfAnotherOrganizationIsIndistinguishableFromANonexistentAttachment` and
`testAnAttachmentUploadedByAUserWithNoOrganizationIsUpdatableByItsOwnOrganization`; every check run on head `0764761` is `success`
(incl. "Run Unit and Functional Tests (8.5)").

## Done-when 2 — uploader with no organization ("staff member removed")
Real-world reproduction of an uploader who no longer belongs to the organization: a staff member writes a note with an attachment, then the
staff member is deleted.
| Step | Production (BEFORE) | Branch (AFTER) |
|---|---|---|
| Staff member (Foreman) writes note + attachment | note 27554943 on S2-918, 201 | note c4cdab05 on S2-17414, 201 |
| Admin ticks while the staff member exists (control) | 201 | 201 |
| Staff member deleted | 200, gone from staff list | 200, gone from staff list |
| Admin clicks For Customer on screen | **400 "Attachment is not found"**; screen shows *"Attachment is not found / Please try to resolve this."* and *"Error updating attachment"*; box stays empty after reload | **201**, box ticked, still ticked after reload |

Exhibit: `ev/01-staff-removed-before-after-hd.png`.

## View-only before/after
Production, Parts Technician role (Work Orders View only, full view mode, genuine sign-in): the box was clickable, 201, persisted.
Branch, Sales Representative (Work Orders View only): disabled, no request, 403 if forced. Exhibit `ev/02-view-only-before-after-hd.png`.

## Observations, each bucketed (Rule 93)
- **Q1 — Technician sees no For Customer box at all (bucket: ASK THE QA LEAD).** Spec S10-R5b says a view-only user "sees the checkbox
  disabled", and the handoff names the Technician as its view-only user. On both builds the box is not rendered for a tech-view-mode user
  (`NoteAttachments` renders the option only when `woFullViewMode`). **Pre-existing:** production Technician (genuine sign-in, `view_mode:
  tech`) sees the file card without the box — `raw/prod-technician.json`, `ev/raw/prod-technician-no-box.png`. Not changed by this ticket.
- **Customer-portal notes (bucket c — explained, not a defect).** The new rule refuses For Customer on notes not written by staff (portal,
  system, API). The screen never offers the box on those notes either (`NoteCard`: `show-for-customer-option = note.source === "user"`), so
  screen and server agree; the PR documents it against S10-R5a. No portal is wired to sv9667, so a portal note could not be created here.
- **Developer's handoff says 404 "(was 400)"** — confirmed on production (400) vs branch (404).

## Environment changes and clean-up
- Branch (per-ticket, no clean-up required): Tech user role swapped Sales Rep → Office User → **restored to Technician**; Sales
  Representative role had Customers Edit removed for one check → **restored** (read back: present). ZZAUTOTEST notes + Org B left in place.
- **Production (restore-after):** all SV-10323 notes deleted (27554943, the view-only note, ae033525), all three test staff deleted;
  read back: 0 SV-10323 notes, 0 test staff.

## QA lead's ruling and what was posted
QA lead, 6 Oct 2026, verbatim: *"Then for that ticket mark it as QA Passed but in the later comment put a question for the developer if
this was left intentional or should be the part of that fix."* Technical section: not answered → posted without one (Rule 84).
- **Comment 77936** — OVERALL QA STATUS: PASSED (`comment-draft.txt`), images 01 + 02.
- **Comment 77937** — question to Nemanja about the Technician (`comment-question-nemanja.txt`), image 03.

## Pre-post gate (Rule 72), 2026-10-06 03:12 UTC
Build marker re-read live: `v26.40.7-7ffda69` (unchanged) · session 200 · named test data (leaver note c4cdab05) present and ticked, so step
2 was reworded to "clear it, then tick it again" · ticket re-read: TESTING QA, Medium, no new comments since 77887 · tone/fingerprint scan on
both bodies: 0 hits · no technical section · 3 images uploaded as real attachments. **Read-back after posting:** 77936 first line
"OVERALL QA STATUS: PASSED", 2 media type `file` (900×835, 900×561, in order), table 1 header + 9 rows; 77937 mention @Nemanja Djuric,
1 media type `file` (900×617).

## Learning check (Rule 95)
New and recorded: `reset-password` from a QA-branch page context needs `credentials:'include'` (else 401 `sso_required` — production has no
SSO gate so it works there); a guard before destructive steps (abort if the note/attachment was not created) — a missing guard deleted the
first branch leaver before it had written anything.

## Update 2026-10-06 ~03:20 UTC — verdict changed to PARTIALLY PASSED (QA lead's ruling)
QA lead, verbatim: *"In that comment also mention the logic why are we leaving that comment there, and it should be marked as partially
passed and shoul dbe fully passed after the last comment is addressed"*. Comment **77936** updated in place (PUT 200): yellow panel
**OVERALL QA STATUS: PARTIALLY PASSED**, a "why partially passed" paragraph linking 77937, opening line "9 of the 10 checks below passed; 1
is open", and table row 10 = the Technician point marked OPEN. Comment **77937** updated in place (PUT 200) with one line: the ticket stays
Partially Passed until this is answered (and fixed if needed). Read back: 77936 panel type `warning`, 2 media `file` 900×835 / 900×561,
11 table rows (header + 10); 77937 1 media `file` 900×617.

## Update 2026-10-06 ~03:30 UTC — reasoning now quotes the rule
QA lead: *"You say  \" but it sits inside the rule this ticket implements,\" but you never quote that rule, it should be authentic always. Keep your comment short concise but the rule quotation."* 77936 PUT 200: the paragraph now quotes Nemanja 77887 (*"now checks the note's organization and the For Customer rule (Edit for the record kind)"*) and S10-R5b verbatim, from the live spec re-read at v27 (2026-10-01). Read back: panel still PARTIALLY PASSED, 2 media, 11 table rows.

## Retest 2026-10-07 — check 10 against Chris's option B (comment 77996; spec S10-R5b v28)
**Trigger:** Chris Ward 77996 (6 Oct 11:23 −0500), verbatim: *"option B. Tech View roles keep not seeing the For Customer checkbox on work order and work order line notes, as in production. Everywhere else (customer, asset and part sale notes), follow S10-R5b: edit permission for that record means the checkbox works, view-only means it shows greyed out. The Full View rule no longer applies to those."* Spec page 817463297 **v28** (16:23:05Z, "S10-R5b: Tech View roles do not see For Customer on work order and line notes, as today (SV-10323)") — exception text quoted in the comment.
**Build:** `v26.40.8-cf5b7ad` (= PR #3369 head, 13:00Z 6 Oct, *before* Chris's ruling; no commit on the branch since), read 06:24Z and again at 07:01Z — unchanged. **So no option-B code was deployed.**

| User (genuine Tech quick-login, role swapped) | Mode | WO note | WO line | Customer | Asset | Part sale |
|---|---|---|---|---|---|---|
| Technician (WO View, Customers View, no Part Sales) | Tech | no box ✓ | no box ✓ | **no box — should be greyed ✗** | **no box — should be greyed ✗** | page not reachable (no permission) |
| ZZ10323 TechView view-only (+ Part Sales View) | Tech | no box ✓ | no box ✓ | **no box ✗** | **no box ✗** | **every Parts page bounces to /workorders** |
| ZZ10323 TechView edit (+ Customers Edit, Part Sales Edit, WO Edit) | Tech | no box ✓ (even with WO Edit) | no box ✓ | **no box — should work ✗** | **no box ✗** | **bounces to /workorders** |
| Sales Representative (regression) | Full | greyed, 403 ✓ | greyed, 403 ✓ | ticks 201, persists ✓ | ticks 201, persists ✓ | greyed, 403 ✓ |
| Admin (regression) | Full | works ✓ | works ✓ | works ✓ | works ✓ | works ✓ |

Screenshots confirm the notes and their files are on screen for every "no box" cell (raw `retest-2026-10-07/raw/*/result.json`; exhibit `retest-2026-10-07/ev/01-techview-customer-asset-hd.png`).

**Posted comment 78010** (remaining issue to Nemanja, Rule 97 layout): Chris's ask quoted, S10-R5b v28 quoted, steps (live-verified: Administration > Staff > search > edit icon > Edit Staff Member > Role > Save & Close; asset Unit 24 / A1305B is under **Lamkin Diesel Services Inc** — my first draft named the wrong customer, caught by the live check), 1 exhibit (attachment 61876). Read back: mention @Nemanja Djuric, 1 media `file` 1290×1218, ordered lists 9 + 3, 2 quotes. Gate: marker unchanged, ticket unchanged since 77996, 0 fingerprint hits, no technical section. 77936 stays PARTIALLY PASSED (not edited).

**Not in the comment — asked of the QA lead (Rule 97d):** a Tech View role with Part Sales View/Edit cannot open any Parts page (Parts menu does nothing; `/parts`, `/parts/part-sales`, the part sale link all redirect to `/workorders`). So the part-sale half of option B cannot be reached by any Tech View user on screen.
**Env:** Tech user restored to **Technician** (read back). Roles ZZ10323 TechView view-only / edit left on the branch for the developer to reproduce with. Sales Rep and Admin runs toggled For Customer on the five fixture files (per-ticket branch, no clean-up).
**Learning check:** `POST /api/roles` needs `organization` (else 400 "organization: Missing required parameter"; an empty body gives 500 — API-only, not raised, Rule 94); Tech View roles are locked out of every Parts page; staff editor = `select_role` + `button_save_staff` "Save & Close". Recorded in playbook §AC.15.

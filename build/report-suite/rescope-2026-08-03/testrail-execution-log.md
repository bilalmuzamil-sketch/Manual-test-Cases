# Report Suite — GROUP E RESCOPE · TestRail execution log · 2026-08-03

**STATUS: EXECUTED.** 2 cases rescoped · **4 `update_case` calls** (2 primary + 2 corrective on the
SAME two cases) · **ALL HTTP 200** · **ALL re-GET field-by-field MATCH** · **0 add · 0 delete · 0 run
write · 0 Jira post.**

## Authorisation (Standing Rules 6 / 25 / 48)

| | |
|---|---|
| **The ruling, verbatim** | **"Rescope"** — QA lead, **2026-08-03**, answering the recommendation *"RESCOPE, not retire"* for C30327 + C30391 in `chris-answers-2026-08-01/staged-case-plan-CDE-2026-08-03.md` group E |
| **What it answered** | The group-E question he had frozen on 2026-08-03: *"DO NOT execute group E (C30327, C30391). Those are retire-or-rescope, and a delete is irreversible and would change run 359's count — bring me the recommendation and I will get his explicit sign-off."* |
| **Product basis** | Chris Ward **Q2 = A** (*"Collapse all report access into a single Reports permission"*) + his chat instruction *"if it's already built, we just hide the new permissions from FE (they can exist and not do anything for now -- no wasted time)"*; QA lead **"Yes all the reports will be gated by ONE permission FOR NOW."** |
| **Scope granted** | `update_case` on **C30327 and C30391 only**. No delete, no add, no run write. Honoured — the executor carries a hard allow-list `{30327, 30391}` and throws on anything else. |

## Source currency (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| **PV spec (the governing spec for both cases)** | Confluence pageId **620888066** "Parts Velocity Report" | **lastModified 2026-07-29** — unchanged since our v4 capture of 2026-07-31 (`spec-current-2026-07-31/Parts-Velocity-Report-current.md`, v4, 2026-07-29T06:41:59Z). ⚠️ The Confluence **version number** is not exposed by the Atlassian MCP tools available this session (`getConfluencePage` / `searchConfluenceUsingCql` return `lastModified` only, no `version`); the date match to the v4 capture is the evidence, stated as such rather than as a version read. | 2026-08-03 | **CURRENT** |
| **PO answers** | `chris-answers-2026-08-01/answers-ingested.md` (Q2 = A) | 2026-08-01 | 2026-08-03 | **CURRENT** |
| **QA-lead ruling** | chat, verbatim above | 2026-08-03 | 2026-08-03 | **CURRENT** |
| **Designs** | none — Report Suite is SPEC-ONLY, no Figma | n/a | 2026-08-03 | **N/A (stated, not assumed)** |
| **Live build** | Report Suite QA branch `project/reports-suite-bravo` | **NOT AVAILABLE** | 2026-08-03 | **STALE / absent — both cases stay VIU-Pending; the on-screen permission label is NOT build-confirmed** |

## Rule 41 — whole-case re-verification (not a surgical edit)

**C30327 / PV-PERM-03 — re-verified WHOLE against the live PV Confluence spec (pageId 620888066,
lastModified 2026-07-29 = our v4 capture), 2026-08-03.** Fields checked: title · preconditions ·
steps · expected · refs · notes.
- Precondition "Manager or Office User role" — still correct: live **S1-N1** *"Users without the
  Manager or Office User role cannot reach the Reports section and will not see the Parts Velocity
  navigation entry (enforced by the Reports section's access control)."*
- Nav location "under Parts", label "Parts Velocity" — still correct: live **S1-R1**.
- An export exists on the report — still correct: live §2 *"The report can be exported as CSV or PDF."*
- **SECOND FINDING (recorded, not silently left):** the live spec text still describes the ABOLISHED
  per-area model — **S1-R4** verbatim: *"Both loading the report and exporting it require the
  **Inventory Reports → View** permission. A user without that permission is denied the report data
  and the export."* and **S1-N2** verbatim: *"A user who has the Reports-section role but lacks the
  **Inventory Reports → View** permission (S1-R4) still sees the Parts Velocity navigation entry …
  on opening the report they are shown the standard access-denied state rather than data, and the
  export is likewise denied."* The case follows the **newer authoritative ruling** (Standing Rule
  32); **Chris owes this spec edit** and it is carried into the outstanding register.

**C30391 / PV-API-04 — re-verified WHOLE against the same live spec, 2026-08-03.** Same fields.
- Section placement **4337 "PV — API"** is correct per Standing Rule 4 (it asserts back-end request
  behaviour) — unchanged.
- The spec pins **no REST contract and no status codes**, so none are asserted (no invented 200/403)
  — verified still true in the live text.
- Same second finding as above (S1-R4 / S1-N2 stale).

## The two operations

### Op 1 — C30327 · PV-PERM-03 · https://shopview.testrail.io/index.php?/cases/view/30327

Section 4330 "PV — Permissions" (unchanged). `update_case` **HTTP 200** · re-GET **MATCH 5/5 fields**.

| Field | BEFORE (live, read this run) | AFTER |
|---|---|---|
| **Title** | Reports access without Inventory Reports View: entry shows; data denied | **Ordinary reports access alone opens Parts Velocity and its export** (65 chars) |
| **Precond 1** | You are signed in as a user with the Manager or Office User role. | *unchanged* |
| **Precond 2** | That user's role does NOT have the Inventory Reports → View permission. | That user's role has the ordinary reports access turned on (the standard "can this person see reports" setting) and no other reports-related permission turned on. |
| **Step 3** | If any export control is reachable, try to export. | Use the export control on the report and download a file. |
| **Expected 1** | The Parts Velocity navigation entry is still visible (the entry follows Reports-section access, not the report permission). | The Parts Velocity entry is visible in the Reports navigation under Parts. |
| **Expected 2** | On opening the report, the standard access-denied state is shown instead of data. | Opening it shows the report data - not an access-denied screen. |
| **Expected 3** | The export is likewise denied - no file downloads. | The export downloads. |
| **Expected 4** | — | *Note for the tester: for now ONE ordinary reports access opens all six of these new reports, and no report has a permission of its own. If an extra Parts or Inventory reports permission does exist and switching it OFF blocks this report or its export, that is wrong - mark this Failed and report it. If a separate per-report permission is ever added on purpose in a later release, this test will be updated first, so treat that as a planned change and not as a bug.* |
| **`refs`** | `SV-8641 (specs/parts-velocity.md S1-N2; S1-R4)` | `SV-8641 (PV spec S1-N2; S1-R4 - RESCOPED 2026-08-03: the old "Reports access without Inventory Reports View" state cannot exist under one permission; Chris Ward Q2=A + "they can exist and not do anything"; QA lead "ONE permission FOR NOW")` (233 chars, inside TestRail's 250-per-reference limit) |

Steps 1 and 2 unchanged. **Op 1b (corrective, same case):** the first write carried a typographic
apostrophe in precondition 2; re-written with a straight apostrophe to match the rest of the live
suite (e.g. C30325) — `update_case` **HTTP 200**, re-GET **MATCH**.

### Op 2 — C30391 · PV-API-04 · https://shopview.testrail.io/index.php?/cases/view/30391

Section 4337 "PV — API" (unchanged). `update_case` **HTTP 200** · re-GET **MATCH 5/5 fields** (after op 2b).

| Field | BEFORE (live, read this run) | AFTER |
|---|---|---|
| **Title** | The backend denies report data AND export without Inventory Reports View | **The back end serves report data and export on ordinary reports access** (69 chars) |
| **Precond 1** | You are signed in as a Reports-section user whose role lacks the Inventory Reports → View permission. | You are signed in as a user whose role has the ordinary reports access turned on and no other reports-related permission turned on. |
| **Precond 2** | Browser devtools (network tab) are open. | *unchanged* |
| **Expected 1** | The backend REFUSES the report data request - the user is denied the data (the UI shows the standard access-denied state, see PV-PERM-03). | The back end returns the report data - the request is not refused. |
| **Expected 2** | The backend likewise refuses the export request - no file is produced. | The back end returns the export file - the request is not refused. |
| **Expected 3** | Both loading and exporting are gated by the same Inventory Reports → View permission. | Both requests succeed with only the ordinary reports access turned on - nothing else had to be enabled. |
| **Expected 4** | — | *Note for the tester: if the back end refuses either request for a user who has the ordinary reports access, mark this Failed and report it. If an extra Parts or Inventory reports permission exists in the system it must not change these results - for now it is hidden from the screen and enforces nothing. A per-report permission added on purpose in a later release is a planned change, not a bug, and this test will be updated first.* |
| **`refs`** | `SV-8641 (specs/parts-velocity.md S1-R4; S1-N2)` | `SV-8641 (PV spec S1-R4; S1-N2 - RESCOPED 2026-08-03; same driver as C30327: Chris Ward Q2=A "single Reports permission" + "they can exist and not do anything"; QA lead "ONE permission FOR NOW")` (192 chars) |

Steps unchanged in substance. **Ops 2b/2c (corrective, same case):** the first `refs` write contained
a comma, and **TestRail normalises `refs` as a comma-separated list — it strips the space after a
comma**, so the re-GET differed by one character from what was sent (content intact, not truncated).
The `refs` was re-written comma-free so the field now matches byte-for-byte; the typographic
apostrophes in the two steps were straightened at the same time. Both **HTTP 200**, re-GET **MATCH**.
*Durable gotcha for the playbook: never put ", " inside a TestRail `refs` value if you intend a
byte-exact re-GET comparison.*

## Deliberate decisions on these two cases (Standing Rule 46)

| Decision | Plain answer | Evidence | Risk |
|---|---|---|---|
| The permission is called *"the ordinary reports access"*, not a build label | Nobody has told us the real on-screen name and there is no QA branch, so we use the same plain phrase the live SBC cases already use and confirm the real label at VIU. | Chris said only *"a single Reports permission"*; no build observation exists (Rules 9 / 12) | **MEDIUM** — the wording will need a VIU pass to become build-accurate |
| Both cases keep TestRail `type_id 5` ("Negative") and the local `type: Negative` | Not changed. The rescoped case still contains a negative assertion — *an extra permission switched OFF must not block the report* — and the authorisation was to rescope the wording, not to re-classify the case. | Rule 6 (nothing beyond what was authorised) | **LOW** — say the word and it is a 2-field edit |
| C30327 now sits close to C30325 | They are not duplicates: C30325 is the plain happy path, C30327 adds *"and NO other reports permission is switched on"* plus the navigation-entry check — that is the only place in the suite that proves an extra permission is **inert**. | The group-E analysis; the 475-case sweep found no other case asserting it | **LOW** — flagged for the QA lead: if he would rather merge them, the surviving case must keep the "no other permission on" premise |
| No new case for the inert back-end permission atom itself | An atom that does nothing has no observable behaviour, so there is nothing for a tester to check. | Chris: *"they can exist and not do anything for now"* | **LOW** |
| The PV spec was NOT edited | Chris owns the spec; we do not write product documents. | Rule 32 / Rule 6 | **MEDIUM** — until he edits S1-R4 / S1-N2 the spec and the cases disagree on paper |

## Contradiction re-diff — the suite's last known contradiction is CLOSED

Read live after the writes, side by side (Standing Rule 45(e) — both texts quoted, not just case ids):

| Case | Premise | Asserts |
|---|---|---|
| **PV-PERM-01 C30325** | *"That user's role has the ordinary reports access…"* | *"The report data loads and rows are shown."* + *"The export downloads successfully…"* |
| **PV-PERM-03 C30327** (rescoped) | *"…has the ordinary reports access turned on … and no other reports-related permission turned on."* | *"Opening it shows the report data - not an access-denied screen."* + *"The export downloads."* |
| **PV-API-04 C30391** (rescoped) | same premise, back-end layer | *"The back end returns the report data - the request is not refused."* |
| **PV-PERM-02 C30326** | *"…role is neither Manager nor Office User…"* | *"The user cannot reach the Reports section."* — a **different gate** (section role, not the reports permission): no conflict |

**BEFORE:** C30327 said a user WITH reports access but WITHOUT *Inventory Reports → View* is shown
*"the standard access-denied state … instead of data"*. Under one permission that person **is** a
user with ordinary reports access, so C30327 asserted *denied* where C30325 asserts *loads* — the
two could not both be true. **AFTER: all four cases agree; the contradiction is gone.**

**Suite-wide closure check (Standing Rule 17 — 100%, no sampling):** all **475** active local case
bodies re-swept field-by-field for per-area / report-specific permission wording. **5 hits, 0
problems:** SBC-PERM-01 (C30098) and IV-PERM-01 (C30603) say *no* report-specific permission is
required (correct); PV-PERM-03 / PV-API-04 name an extra permission only to assert it is inert
(correct); SBC-NAV-02 is the case **retired and deleted from TestRail on 2026-07-28** — no C-id, no
live impact, flagged only so nobody re-imports it as-is. **Zero active cases now assert a per-area
report permission gate.**

## Run 359 — untouched (Standing Rules 34 / 47)

| | Tests | Results |
|---|---|---|
| **BEFORE** (the same-day snapshot taken by the C+D pass, `chris-answers-2026-08-01/run359-snapshot-2026-08-03/`) | **475** | **539** |
| **AFTER** (this run, full paginated read) | **475** | **539** |

`include_all = false` · both C30327 and C30391 confirmed still present as tests in the run · 475
unique case_ids · **0 `update_run` calls, 0 result writes.** `update_case` cannot alter a run's
selection, and none was attempted.

⚠️ **Honest note on my own first snapshot:** my BEFORE capture used an unpaginated `get_tests/359`
and therefore truncated at TestRail's 250-row page cap (`snapshots/run359-tests-BEFORE.json` holds
250 rows, not 475). The authoritative pre-state is the C+D pass's snapshot from earlier the same day
(475 / 539); this run's AFTER capture is the corrected full paginated read and matches it exactly.
*Durable gotcha: always page `get_tests` / `get_results_for_run` with `&limit=250&offset=N`.*

## Local artefacts updated

- `cases/cases-pv-A-access-permissions-filters.json` — PV-PERM-03 re-synced **from the live case**
  (title, preconditions, steps, expected, `spec_ref`, `permissions_required`, `notes`)
- `cases/cases-pv-D-exports-visual-api.json` — PV-API-04, same
- `testrail-id-map.csv` — the 2 titles (surgical, CRLF preserved: the file is CRLF and a naive
  text-mode rewrite reflows all 476 lines — *durable gotcha*)
- `rescope-2026-08-03/snapshots/` — per-case BEFORE/AFTER bodies, run-359 tests+results, `ops-log.json`

**Not regenerated:** the TestRail import CSV/XLSX and the workbooks — two other workers are writing
`build/report-suite/**` concurrently and regeneration touches shared files. The two title changes are
in the id-map, so the next authorised regeneration picks them up.

## OUTSTANDING — what I need from you

| # | What is needed | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **Chris Ward's spec edit to PV S1-R4 and S1-N2** (they still require *Inventory Reports → View* and describe a shown-then-denied state that cannot happen) | Chris Ward | Nothing operationally — the cases follow his newer ruling (Rule 32) — but the spec and the cases disagree on paper, so a reader of the spec would judge these two cases wrong | 2026-08-01 (his Q2=A answer) |
| 2 | **The same edit on the other four specs** — IV, TU, WIP and SBR text still name per-area report permissions | Chris Ward | Same paper-level disagreement across 8 further cases already reworded in groups C+D | 2026-08-01 |
| 3 | **A QA branch + fresh cookies** | you / dev | The real on-screen name of the single reports permission is unconfirmed, and **both rescoped cases stay VIU-Pending** — nothing here has been observed on a running build | 2026-07-22 |
| 4 | **Optional: your word on the two flagged items above** — (a) move both cases from Negative to Functional, (b) whether C30327 should instead be merged into C30325 | you | Nothing; both are one-line edits | 2026-08-03 |

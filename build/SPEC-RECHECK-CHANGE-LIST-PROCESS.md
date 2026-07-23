# Spec-Recheck Change-List Workbook — Process (reusable, any project/feature)

> **Plain-English purpose:** turn a spec-recheck/reconciliation pass into the ONE simple
> sign-off file the user actually wants — a **change list of only the test cases that need a
> change or a decision**, each tagged with the driving Jira ticket and whether that ticket is
> Done, plus a second tab that isolates the cases blocked on a not-yet-done ticket. The other
> (fine-as-is) cases are omitted — only their count is stated.
>
> This is the deliverable proven on **Custom Roles (SV-7388), 2026-07-20**
> (`build/custom-roles-run/CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx`, generator
> `build/custom-roles-run/gen_simple_changelist.py`). It is the OUTPUT half of
> `build/SPEC-RECHECK-PROCESS.md` (which is the ANALYSIS half — read/ingest spec + Done
> tickets, reconcile, live-verify). Apply **WHEN THE USER ASKS** for a change list / a
> "cases that need changing" sheet / a spec-recheck sign-off file.

## When the user asks for it
Trigger phrases: "give me the change list", "make me a simple change-list file", "which cases
need changing (with the ticket)", "a spec-recheck sign-off sheet", "same file as the Custom
Roles change list for <project>".

## Kickoff prompt (reusable — fill the brackets)
> "Produce the **spec-recheck change-list workbook** for **[project/feature]**: from the
> reconciliation of every TestRail case vs the current spec + all Done Jira tickets
> (newest-wins on conflicts, labels/behaviour live-verified), give me a **simple** file with
> only the cases that need a change or a decision — each with a plain description, the driving
> **ticket number + whether it's Done**, and an Action (Apply update / Decision). Put the cases
> blocked on a not-yet-done ticket on a second tab. Omit the fine cases (state the count).
> **Nothing to TestRail until I approve**, and honour my do-not-change list exactly."

---

## The originating instructions + corrections this file must honour (Rule 18)

This format is not arbitrary — it is the settled result of the user's asks and the corrections
made along the way on Custom Roles. Every one of these is a REQUIREMENT, not a preference, and
must carry over to every project's change list:

1. **"Keep the file simple."** The first attempt was a fuller *Proposed-Corrections* workbook
   (current-text → proposed-text + citations + live-check columns). The user asked *"what do you
   mean by the change list"* and told me to **simplify**: a change list is a short list of only
   the cases that need action — NOT a full current-vs-proposed diff of every case. The fuller
   proposed-corrections workbook is still allowed as **optional backup**, but the change list is
   the **primary sign-off view** and must stay simple.
2. **"If a change is due to a ticket, mention the ticket number."** Every ticket-driven row
   names its **driving Jira ticket** (per-story precision; multiple keys joined with " / " when
   more than one drives it).
3. **"If a ticket needs a change but is NOT yet done, highlight those cases with the ticket
   number."** Hence the **Ticket status** column (DONE / NOT DONE (state) / OBSOLETE / no
   ticket) **and** a dedicated **second tab "Waiting on open tickets"** listing only the
   not-done-ticket rows, orange-shaded, with the note that they must not be finalised until the
   ticket ships.
4. **Only cases that need a change or a decision appear.** The fine-as-is cases are **omitted**;
   the header states their count only (e.g. "The other 240 cases are fine as-is").
5. **Action column = `Apply update` OR `Decision`.** *Apply update* = a wording/expected fix we
   can make; *Decision* = spec is silent/self-contradictory or a PO/dev choice is needed — we do
   NOT guess (Rule 1). Decisions are never silently resolved.
6. **Plain, layman "What needs to change" text (Rule 7).** No enum names, HTTP terms, bug codes,
   or §-jargon in the reader-facing cell — just what is wrong now and what it should be.
7. **TestRail Case ID + clickable link on every row (Rule 8).** Sourced from the project's
   `testrail-id-map.csv`. Show the internal ID too if the user wants it, but the C-ID + link is
   mandatory.
8. **Nothing is pushed to TestRail to make this file** (Rule 6). The change list is a *proposal*;
   the header says "Nothing pushed to TestRail yet." TestRail edits happen only later, after the
   user approves specific cases, honouring the **do-not-change / freeze list literally**.
8a. **The file is ALSO the user's own manual-edit worksheet — make every row self-sufficient to
    apply by hand.** On Custom Roles the user applied several rows **himself, directly from this
    file**, then told me *"I have manually Updated the below given testrail test case manually
    from the file which you have provided… do not change them and the rest you can change"* — that
    is exactly how the **freeze/do-not-change list arises** (the cases the user already actioned).
    So each row must carry everything needed to make the edit without opening anything else:
    the C-ID + link, the plain "what needs to change" (enough to act on), and the driving ticket.
    Expect the user to hand back a do-not-change list afterward and honour it literally.
8b. **Each row states ONE concrete action.** The user asked, of a single row, *"what will you do
    with this test case in TestRail if I give you a go-ahead?"* — so a row's Action + change text
    must map to one unambiguous edit (or one decision), never a vague cluster.
8c. **Some Decision rows are resolved by the user/PO offline** (*"these 8 test cases I have asked
    you to not touch because I have managed them internally"*). A `Decision` row may come back as
    "handled internally → freeze it"; do not re-touch those.
9. **Live-verify on the build is MANDATORY — column D describes what the build ACTUALLY does, not
   what a document says (Rules 12/13; NON-SKIPPABLE).** Every "What needs to change" cell must be
   written from a LIVE observation on staging captured THAT run (screenshot / captured response),
   in the same voice as the Custom Roles file: *"Permission Summary lists a 3rd cross-cutting
   toggle 'View History Logs' — the build has only TWO (See Financial Data + View and Manage AP/AR
   Data). Drop the History toggle."* — i.e. state the current build behaviour, the spec/expected,
   and the resulting action. A proposed change the live build contradicts is **withdrawn** (a spec
   label-rename the build hasn't shipped stays build-accurate + is flagged). **This step is NOT
   optional and must NOT be replaced by documented prior findings, `viu_status`, memory, or
   inference.** If live access is unavailable (no fresh cookies, env down), **STOP and request
   what's needed (fresh staging cookies + env/branch + feature-flag state) — do NOT deliver the
   change list off documented/inferred behaviour and call it done.** (Rationale, 2026-07-23: the
   first Simple Flow + Fees & Discounts change lists were built from documented findings + Jira
   status WITHOUT a fresh live build check, and the user rightly rejected them — "checking in the
   build is part of the process, why did you skip that? Never skip anything." The live build check
   is a hard gate on this deliverable.)
10. **Contradiction rule = last-update-wins.** Spec-vs-spec, comment-vs-spec, or
    Sasha-vs-Sasha: the newest statement wins, and the change reflects it.
11. **Read ALL the Done tickets AND their comments — Stories, Story-defects, AND Bugs — not just
    the spec.** The user's explicit instruction: *"read all the tickets having the status DONE
    which are Bugs/Story defects besides the other tickets you are reading, also read the comments
    of [the reviewer, e.g. Sasha] in those bugs and story defects; if there is a contradiction in
    any of the reviewer's statements, or within the specs, or between a comment and the spec,
    consider the latest version as the correct one."* So the ingest MUST cover: (a) every Done
    Story, (b) every Done Story-defect, (c) every Done Bug, and (d) the reviewer's comment threads
    on the defects/bugs — because a Done bug or a reviewer comment often overrides the spec text
    (last-update-wins). The driving-ticket column, its Done/Not-Done state, and many "what needs
    to change" rows come from these defect/bug tickets and their comments, not the spec alone.
12. **Human-readable filename (Rule 19):** `<Project>_SpecRecheck_ChangeList_<YYYY-MM-DD>.xlsx`
    (+ `.md` twin). Deliver `.xlsx` **and** a `.md` mirror.

---

## The exact file format (mirror 1:1 — Rule 16)

**Two tabs, seven columns, identical on both tabs:**

- **Tab 1 — `Change list (N)`** (N = number of action cases):
  - Row 1: bold title — `"<Project> spec-recheck — cases that need a change or a decision (N of TOTAL)."`
  - Row 2: explainer — `"The other <TOTAL−N> cases are fine as-is. Orange rows = waiting on a ticket that is NOT yet done. Nothing pushed to TestRail yet."`
  - Row 3: blank.
  - Row 4: **header** — `Case ID | TestRail link | Area | What needs to change | Driving ticket | Ticket status | Action`.
  - Rows 5…: one row per action case, sorted by Case ID; **orange fill** on any row whose Ticket status starts with "NOT DONE".
  - **Column D "What needs to change" is a LIVE-OBSERVED field** — it states how the build is
    behaving on staging *right now* (observed that run), the spec/expected, and the action; never a
    paraphrase of a findings doc. This is the column the user pointed to as the standard.
- **Tab 2 — `Waiting on open tickets`**: same 7-column layout; only the rows whose driving ticket is NOT DONE; header note that they must not be finalised until the ticket ships.
- Styling: dark-blue header fill + white bold text, wrapped cells, thin borders, frozen header row, column widths ≈ `[9, 40, 20, 72, 20, 22, 14]`.
- `.md` mirror: a Markdown table of the same columns + a "Highlight — cases waiting on a ticket that is NOT yet done" section.

Canonical example to copy: `build/custom-roles-run/CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx`
and its generator `build/custom-roles-run/gen_simple_changelist.py`.

---

## The 6 steps

0. **ASK two gating questions up front (Standing Rules 22 + 23):** (a) **Confluence spec** — unless
   you are certain the local `requirements.md` is current, ASK the user whether to read the CURRENT
   Confluence spec (via Atlassian MCP `getConfluencePage`; each project's canonical pageId) and
   reconcile against it; (b) **Live-build check** — confirm you'll run the live build check for
   column D and request fresh cookies + env/branch + flags. Do not proceed past this step by
   assuming either.
1. **Run (or reuse) the spec-recheck analysis** — `build/SPEC-RECHECK-PROCESS.md` steps 1–4:
   ingest the current spec (the CURRENT Confluence page when the user says to — Rule 23) + **every
   Done ticket of every type — Stories, Story-defects, AND Bugs — WITH their comment threads (esp.
   the reviewer's)**, reconcile 100% of the cases to one verdict each (OK / UPDATE / OPEN-QUESTION),
   and **live-verify** labels/behaviour on the build (Rule 22). A Done bug/defect or a reviewer
   comment can override the spec (last-update-wins). The change list is built from the UPDATE +
   OPEN-QUESTION verdicts only.
2. **Assemble one row per action case** with: Case ID (+ link from `testrail-id-map.csv`), Area
   (the TestRail leaf section / functional area), plain "What needs to change", Driving ticket(s),
   Ticket status (from Jira: DONE / NOT DONE(state) / OBSOLETE / no ticket), Action (Apply update
   / Decision). Keep OK cases OUT; remember the total for the header count.
3. **Split the second tab** — copy every row whose Ticket status starts with "NOT DONE" onto the
   "Waiting on open tickets" tab.
4. **Fill the parameterised generator** (below) and emit `.xlsx` + `.md` with the human-readable
   filename. Verify counts (N action rows, TOTAL−N omitted, M waiting) before delivering.
5. **Deliver + explain** — hand over both files with a one-line summary of the counts and the
   note that nothing has been pushed to TestRail. Offer the fuller proposed-corrections workbook
   only as optional backup.
6. **On approval only** — apply the agreed rows in TestRail via `build/SPEC-RECHECK-PROCESS.md`
   step 6 (get → update changed fields → re-get verify → per-case audit log), honouring the
   do-not-change list literally. Keep traceability (`refs` = ticket + spec, Rule 20) intact.

---

## Reusable generator template (parameterise, don't rewrite)

Copy `build/custom-roles-run/gen_simple_changelist.py` into the project folder and change only
the data. Its shape (already proven):

```python
DATE = "<YYYY-MM-DD>"
LINK = "https://shopview.testrail.io/index.php?/cases/view/{}"
AREA = { <section_id or key>: "<Area label>", ... }   # id -> human area name
# case_id -> (area_key, plain "what needs to change", "TICKET / TICKET", ticket_status, action)
#   ticket_status: "DONE" | "NOT DONE (<state>)" | "OBSOLETE" | "no ticket"
#   action:        "Apply update" | "DECISION"
M = { <cid>: (<area_key>, "<plain change>", "<tickets>", "<ticket_status>", "<action>"), ... }
# -> Tab 1 "Change list (N)" (all rows, orange where NOT DONE) + Tab 2 "Waiting on open tickets"
#    (NOT-DONE rows only); .xlsx + .md twin; header count = "N of TOTAL"; 240-style omit line.
```

Do not invent a new layout — mirror the columns/tabs/wording/filename 1:1 (Rule 16). The only
per-project inputs are: the project name, TOTAL case count, the `AREA` map, and the `M` dict of
action cases (with tickets + Done status from the recheck).

## Guardrails (the ones that mattered)
- **Simple beats complete** — this file is a short action list, never a full current-vs-proposed
  diff of every case. Keep the fine cases out (count only).
- **Never write TestRail to build the file** (Rule 6); nothing is finalised on a NOT-DONE ticket.
- **Cite the driving ticket + Done status on every ticket-driven row**; per-story precision.
- **Plain layman wording** in the reader-facing cell (Rule 7); C-ID + link on every row (Rule 8).
- **Live-build check is a HARD GATE (Rules 12/13):** column D is written from a live staging
  observation captured that run; withdraw any proposal the build contradicts. If access is missing,
  STOP and request fresh cookies + env/branch + flags — never substitute documented/inferred
  behaviour to appear complete.
- **Honour the do-not-change/freeze list literally** when the edits are later applied.
- **Human-readable filename** `<Project>_SpecRecheck_ChangeList_<date>.xlsx` (+ `.md`) (Rule 19).
- **No secrets in git** — cookies/TestRail creds live only under `/tmp`.

## Self-seed to unblock — never stay blocked on data (Standing Rule 14)
This process MUST self-seed any missing data state rather than declare "blocked" or ask the user to
provide data. Playbook (learned 2026-07-23): (a) don't rely on the user to fix env/data/workplace
issues — find the switcher or another usable record yourself; (b) if the UI is flaky (Quasar
dialogs/selects intercepting clicks) switch to the API, and if the API is scoped/awkward switch to
the UI; (c) discover endpoints by probing — POST an empty/partial body and read the validation error
for required fields (e.g. `POST /api/work-orders/create` needs company_id+vehicle_id+workplace_id+
start_date+`is_vehicle_here:true`); (d) create the WOs/lines/parts/adjustments/roles/customer-defaults
needed (a customer default makes fees auto-apply); (e) for Quasar UI click by element-center
coordinate (`page.mouse.click`) not Playwright actionability clicks; (f) clean up ZZAUTOTEST data and
restore roles afterwards. Only a genuinely un-provisionable dependency (a server 500 on create, an
external device) is a real blocker — characterise it with evidence (endpoint + requestId), never bare
"NOT VERIFIED", and hand the user a layman step-by-step data-setup sheet for the one thing only a
human/dev can supply. User rule: "there is nothing like 'require seeding data' — make everything in
the build; do not find an excuse to keep yourself blocked."

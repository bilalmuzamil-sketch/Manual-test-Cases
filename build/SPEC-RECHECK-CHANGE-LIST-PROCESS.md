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
9. **Live-verify before proposing (Rules 12/13).** A proposed change the live build contradicts
   is **withdrawn** — e.g. a spec label-rename the build has not shipped stays build-accurate and
   is instead flagged as a gap. (On Custom Roles the user said *"41 of the changes are label
   renames that need a live-build check first — do it then"*; the live check moved several rows
   from "Apply update" to "Decision"/withdrawn.)
10. **Contradiction rule = last-update-wins.** Spec-vs-spec, comment-vs-spec, or
    Sasha-vs-Sasha: the newest statement wins, and the change reflects it.
11. **Read the Done tickets AND their comments** (bugs/story-defects included), not just the
    spec — the driving-ticket column and Done/Not-Done status come from there.
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
- **Tab 2 — `Waiting on open tickets`**: same 7-column layout; only the rows whose driving ticket is NOT DONE; header note that they must not be finalised until the ticket ships.
- Styling: dark-blue header fill + white bold text, wrapped cells, thin borders, frozen header row, column widths ≈ `[9, 40, 20, 72, 20, 22, 14]`.
- `.md` mirror: a Markdown table of the same columns + a "Highlight — cases waiting on a ticket that is NOT yet done" section.

Canonical example to copy: `build/custom-roles-run/CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx`
and its generator `build/custom-roles-run/gen_simple_changelist.py`.

---

## The 6 steps

1. **Run (or reuse) the spec-recheck analysis** — `build/SPEC-RECHECK-PROCESS.md` steps 1–4:
   ingest the current spec + every Done/Obsolete ticket (with comments), reconcile 100% of the
   cases to one verdict each (OK / UPDATE / OPEN-QUESTION), and **live-verify** labels/behaviour
   on the build. The change list is built from the UPDATE + OPEN-QUESTION verdicts only.
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
- **Live-verify → withdraw** any proposal the build contradicts (Rules 12/13).
- **Honour the do-not-change/freeze list literally** when the edits are later applied.
- **Human-readable filename** `<Project>_SpecRecheck_ChangeList_<date>.xlsx` (+ `.md`) (Rule 19).
- **No secrets in git** — cookies/TestRail creds live only under `/tmp`.

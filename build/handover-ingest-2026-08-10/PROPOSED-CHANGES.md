# PROPOSED CHANGES — staged, unexecuted, each with its driving statement quoted — 2026-08-10

> ## ⛔ NOTHING IN THIS FILE HAS BEEN APPLIED.
> **Zero TestRail writes. Zero Jira writes. Zero tickets created (Rule 62). No case file edited.**
> Every item below needs the QA lead's explicit go-ahead (Rule 6), and several need Branko's answer first —
> those are marked **BLOCKED** and must not be applied even if the batch is approved.

**11 proposals: 6 case edits · 3 new cases · 2 record corrections.**
**5 are ready to apply on your word. 6 are blocked on an answer.**

---

## Summary

| # | What | Target | Ready? |
|---|---|---|---|
| **P-01** | Scope the Reports presence case to the reports this epic actually covers | `FLT-RPTS-01` = [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | **READY** |
| **P-02** | Drop the A/R Aging worked example and the word "New" | `FLT-RPTS-22` = [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | **READY** |
| **P-03** | Correct the shared-view exit label to the spec's wording | `FLT-URL-05` = [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | **READY** |
| **P-04** | Same, including the title | `FLT-URL-06` = [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | **READY** |
| **P-05** | Conflict-label wording | `SCH-MODAL-07` = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) · `SCH-CONF-03` = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | **BLOCKED — Branko** |
| **P-06** | Warn the tester that filters persist server-side between runs | `FLT-PERS-02` = [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | **READY** |
| **P-07** | Warn the tester that date filters are browser-timezone relative | `FLT-RPTS-23` = [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | **READY** (apply with P-01) |
| **P-08** | Correct the SV-8844 "fixed" claim in the written record | `CLAUDE.md` · register · `build/filters/recheck-2026-08-05/` | **BLOCKED — out of write scope** |
| **P-09** | Hand the automation engineer the FilterBar test-id list | a note, no case | **READY** |
| **N-01** | New: a filter click during page load must not silently revert | new Filters case | **BLOCKED — recommend a ticket first** |
| **N-02** | New: view options survive a session | new Schedule case | **BLOCKED — Branko** |
| **N-03** | New: drag a shift to the next day in week view | new Schedule case | **BLOCKED — Branko** |

---

## P-01 · Scope `FLT-RPTS-01` = C38909 to this epic — **the important one**

**Driving statement, verbatim:**

> *"**6 Reports** — Shop Billing Efficiency, My Timesheets, Timesheet Activities (PunchClock), Notes,
> Reminders, Sales Tax."*
> *"**Do not migrate** `TechnicianEfficiency`, `Sales`, `ServiceAdvisorAnalysis`, `WorkInProgress` —
> coordinate first."*
> *"**As-of-date reports (A/R & A/P Aging ×5–6)**… **Deferred pending PM**… **NOT migrated**."*
> *"**Nav-orphan / hidden reports** (…SalesFollowUp, PayrollTimesheet…): reachability/priority call before
> migrating."*
> *"**No-date reports** (IBS Batch, QuickBooks Unexported): no date dimension server-side."*

**Fields:** `steps`, `expected` (whole body), plus the automation marker's reason string.

**What the edit does:**
1. **Keeps** the surfaces in the rollout: Timesheet Activities, Notes, Reminders, Sales Tax (both tabs),
   Shop Billing Efficiency — with their existing per-report chip lists **unchanged**.
2. **Moves the other thirteen into a single deferral block** that names, per group, **who owns it and what
   has to happen before it can be tested** — quoting the handover, dated 2026-08-10.
3. **Replaces the misleading tester note.** Current text: *"Not built yet on the build tested… mark this
   test BLOCKED - do not mark it failed."* Proposed: BLOCKED stays right for the in-scope reports, but for
   the deferred thirteen the note says plainly that **those reports are not part of this piece of work and
   are not expected to have a filter bar** — so nobody logs thirteen phantom blockers.
4. **Flags two naming questions rather than resolving them:** *Shop Efficiency* vs the rollout's *Shop
   Billing Efficiency*, and *"Timesheets (Payroll Timesheet)"* vs *My Timesheets*.

**NOT proposed: deletion.** Those reports get filter bars eventually; `delete_case` is irreversible.
**Scoped and dated, not thrown away** (Rule 42).

**Honest note:** the marker stays `AUTOMATION: HOLD` — the write-up is still missing, which is the original
reason for the hold, and this edit does not change that.

---

## P-02 · `FLT-RPTS-22` = C38911 — remove the invented framing and the unrunnable example

**Driving statement, verbatim:** *"**Guiding rule: "adopt-only-existing"** — migrate only the filters a page
has *today*; **don't invent new filter capabilities from the spec/Figma** (user decision 2026-07-29)."*

**Fields:** `title`, `steps` 1, `expected` 1.

- **Title** *"**New** Reports filter types behave correctly…"* → drop *"New"*. Under adopt-only-existing
  these types are **not new**; they are existing controls being adopted.
- **Step 1** *"for example **A/R Aging Detail** (Location, Transaction Type)"* → replace with an in-scope
  example. **Notes (Mention)** is already in the step and is in the rollout.
- **Expected 1** keep the behaviour, drop the implication that the aging reports are testable now.

---

## P-03 / P-04 · The shared-view exit label — a Rule 57 correction

**Driving statements, verbatim:**

> **Spec S11-R7 (live 2026-08-10):** *"a **"Back to my view"** action is available… **The label is
> deliberately "my view" rather than "my filters", since the action affects both filters and search**."*
> **Handover:** *"`FilterBar.vue` — … + **"Back to my saved filters"** (shared-view exit)"*, test id
> **`back_to_saved_filters`**.

| | Now | Proposed |
|---|---|---|
| **P-03** `FLT-URL-05` = C38879, `expected` 3 + 4 | *"A **'Back To My Saved Filters'** option is shown…"* | *"A **'Back to my view'** option is shown…"* |
| **P-04** `FLT-URL-06` = C38896, `title` + all four `expected` | *"**'Back To My Saved Filters'** is not shown when you are on your own view"* | *"**'Back to my view'** is not shown when you are on your own view"* |

**Also remove C38879's hedge** — *"(If the wording on screen is slightly different, note what it says and
carry on.)"* — because it tells the tester to **accept** a documented divergence. Replace with a plain
expect-fail note naming the ticket, and set both markers to
**`AUTOMATION: READY - EXPECT FAIL (<ticket>)`**.

**⚠️ This proposal depends on a ticket that does not exist yet.** The defect — *the shared-view exit button
reads "Back to my saved filters" where S11-R7 requires "Back to my view"* — is **recommended, not filed**
(Rule 62). **If you decline the ticket, apply P-03/P-04 with `AUTOMATION: HOLD` instead**, because a case
cannot cite a ticket that was never raised.

**Not proposed: changing the build's label.** That is a developer's job and Branko may prefer the build's
wording — in which case **his spec changes and our cases stay as they are.** Either way it is his call, not
ours.

---

## P-05 · The Schedule conflict label — **BLOCKED, and it must stay blocked**

**Driving statement, verbatim:** *"Terminology is inconsistent with the rest of the product, which uses
"business hours". Update the conflict label string."* — [SV-8917](https://shopview.atlassian.net/browse/SV-8917).

**Against, verbatim:** **§4.2** *"**The technician's configured working hours take precedence.** If those
are not set, **the shop's business hours** are used."* · **§4.11** *"Shift starts before the **working-day**
start."*

**Targets:** `SCH-MODAL-07` = C30014 and `SCH-CONF-03` = C30025 — the only two of 168 that quote the label
(verified by quoted-string search, not word search).

**NO EDIT IS PROPOSED, on purpose.** There are **three** possible correct answers — the label names the
**technician's** hours · it names **business hours** and §4.11 changes with it · it goes **neutral**
(*"before the working day"*) — and **applying any of them now is choosing for the product owner.** Under
Rule 57 the cases keep the documented expectation until a source moves.

**What to do instead:** ask Branko (`QUESTIONS.md` B-2). **We have not commented on SV-8917** — it is Sasha
Grosman's ticket (Rules 38 / 62).

---

## P-06 · Tell the tester that filters persist between test runs

**Driving statement, verbatim:** *"the invoice-status filter **persists server-side**, so **a prior run
leaves it selected and a later bare toggle deselects it**. `SalesTaxPage.resetSavedFilters()` PUTs the pref
back to default…"*

**Target:** `FLT-PERS-02` = C29614, `preconds` — one plain line, no new case:

> *"Before you start: filters are remembered against your account, so anything left switched on by a
> previous test run will still be on when you begin. Clear all filters first, otherwise your results will
> not mean what you think they mean."*

**Why a precondition and not a case:** the behaviour is already asserted (S10-R2/R4); this is a **trap for
the tester**, and it is exactly the kind of thing the Rule 28 audit says to write once rather than explode
into per-page cases.

---

## P-07 · Tell the tester that date filters follow the browser's timezone

**Driving statement, verbatim:** *"date bounds go through `parseLocalDate` (local midnight)… **browser-TZ-
relative by design** (SV-8459, merged 2026-07-21). A "different payload" between two environments is
**almost always a different browser timezone, not a bug** — verify same-browser before chasing it."*

**Target:** `FLT-RPTS-23` = C38882, `expected` — one plain line appended before the provenance block:

> *"Note: date ranges follow your own computer's time zone. If a date filter seems to include or miss a
> record at the very edge of the range, check the time zone on the machine you are testing from before
> raising it."*

**Rests on a document, as Rule 57 requires:** the PRD's Key Decisions already tie the date chip to *"the
application's current default range"*; the note is guidance to the tester, **not a new assertion**.

---

## P-08 · Correct the SV-8844 record — **BLOCKED, out of this pass's write scope**

**Driving statement, verbatim:** *"PRD **v1.3 said persist search to the account (old "D18")**; **v1.6
reversed it** — search lives only in the browser tab session (`sessionStorage`), never the account."*
Corroborated twice in the live spec: **S13-R25** and **S10-R5**.

**What is wrong, verbatim from CLAUDE.md:** *"**SV-8844 IS FIXED** (no `search` key in the saved pref, no
PUT sent, fresh browser returns the full 30 rows)"*.

**It was not fixed. It was very probably never a defect** — and **we reported it** (read live today:
reporter Bilal Muzamil, now OBSOLETE/Done).

**The cases are clean** — the false line was already deleted from C38900/C38901/C38902 and I re-read all
three today; **no case edit is needed.** The correction is to `CLAUDE.md`, the outstanding-items register
and `build/filters/recheck-2026-08-05/`. **CLAUDE.md is explicitly out of this pass's write scope**, and the
register is shared, so **nothing was edited.**

---

## P-09 · Hand the test-id list to the automation engineer — a note, not a case edit

**Driving statement, verbatim:** *"Standard FilterBar locators: `toggle_filter_bar`, `filter_chip_<key>`,
`filter_preset_range_<preset>`, `filter_clear_selection_<key>`, `filter_search_<key>`,
`filter_option_<key>_<id>`, `clear_filters`, `back_to_saved_filters`; page search: `page_search_toggle` /
`page_search_input` / `page_search_clear`."*

**These are the stable hooks for every Filters case marked `AUTOMATION: READY`.** Plus the gotcha that will
cost an afternoon otherwise: *"the `Input` wrapper forwards `data-test-id` onto the native `<input>`, so
`[data-test-id="x"] input` matches nothing — **use `input[data-test-id="x"]`**."*

**No case changes.** Under Rules 7/9 test ids do not belong in tester-facing text. **This is a hand-off
note, and it also belongs in `build/APP-ACTIONS-PLAYBOOK.md` — not edited here** (shared file, another
worker live).

---

## N-01 · New Filters case — a filter click during page load must not silently revert

**Driving statement, verbatim:** *"**Possible product UX bug worth a ticket:** a filter interaction during
the ~400ms pref-load is silently reverted."* · *"each report's `initialize()` awaits `GET
…/preferences/{pageKey}` THEN wires `useFilterUrlSync`… **a filter click before that resolves is reverted
~400ms later**."*

**Proposed id:** `FLT-PERS-NEW-1`. **Rests on S11-R2 and S2-R6**, not on the commit — a selection that
undoes itself satisfies neither *"the table already filtered"* nor *"filters in real time as the user makes
selections"*.

**BLOCKED: recommend filing the defect first.** It is **user-reachable**, so **Rule 51 does not apply** —
this is not an API-only finding. **Engineering itself says it is worth a ticket and has not filed one.**
Recommendation: **Low, parent SV-8785.** `QUESTIONS.md` QA-2.

---

## N-02 · New Schedule case — view options survive a session — **BLOCKED, Branko**

**Driving statement, verbatim:** *"**Persist view options per user** — Store view state — **capacity
planning toggle, department visibility**, and similar options — at the user level in cache so it survives
across sessions."* · In Scope: Yes · *"scope TBC"*.

**Proposed id:** `SCH-VIEW-NEW-1`. **Gap confirmed:** C30046, C30043, C30047, C30050, C30051 cover the
toggles' **defaults and effects**, none covers **persistence**.

**BLOCKED because the spec does not support it.** §9 gives a Default column and says nothing about
persistence; the only persistence sentence in the document is §5.3 about the **panel**, and it says
*"**Session-scoped per user for build**"* — arguably **weaker** than E12's *"survives across sessions"*.
**Authoring it now would promote a "scope TBC" review row into a requirement.** `QUESTIONS.md` B-5.

---

## N-03 · New Schedule case — drag a shift to the next day in week view — **BLOCKED, Branko**

**Driving statement, verbatim:** *"Support **dragging a shift onto the following day directly from week
view** as an alternative to the carryover button."* · In Scope: Yes · *"scope TBC"*.

**Proposed id:** `SCH-DND-11`. **Gap confirmed:** C29955–C29961 create from the sidebar, C29962 is
click-to-arm, C43555 is month-view drag-create, `SCH-REAS-01` is technician-to-technician. **None moves a
shift to a different DAY in week view.**

**BLOCKED because §7 covers only *"Dragging a shift block **from one technician row to another**"*, and
§4.10's day-moves are for **events**.** A same-technician cross-day shift drag is **not clearly required by
any spec sentence**, and E9 is *"scope TBC"*. `QUESTIONS.md` B-6.

---

## If you approve

**Apply in this order:** P-01 → P-02 → P-07 (same case family, one pass over the Parts/Reports set) →
P-06 → P-03/P-04 (only once the ticket question is settled) → P-09 as a note.

**Every write follows Standing Rule 50:** re-GET and byte-compare each case against the intended payload,
prove every untouched field byte-identical against a pre-write snapshot, **stop the batch on the first
mismatch**, and log the operation, C-id, HTTP status and verification result per op.

**Then Rule 34/47:** run 352 is a fixed selection (`include_all: false`) — **snapshot `get_tests` and
`get_results_for_run` first, and no `case_ids` write is needed at all** unless a new case is added, in
which case it must be the **full union**.

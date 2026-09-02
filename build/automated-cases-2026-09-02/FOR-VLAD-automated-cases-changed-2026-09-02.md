# For Vladimir Tomovic — 7 cases flagged Automated were changed, 2 September 2026

**Rule 65 notice.** Every one of these carries `custom_atmstatus = 3`, so an automation script may be
reading its wording. The flag itself was **re-read immediately before and after every write and is
still 3** on all seven; no section moved, no `refs` value changed.

**Authorisation (QA lead, 2026-09-02, verbatim):** *"yes this case needs to be updated, and all those
test case also need to be updated which are automated but yet they should be updated to make them
runnable and Build verified. This authorization is for these three suites for now. 1. Invoice refresh
2. Inline Add Part 3. Workorder Print"*

**Not touched: [C45220](https://shopview.testrail.io/index.php?/cases/view/45220)** — `created_by = 1`,
your case. It is flagged Automated and it is inside the authorised suite, and it was still left
exactly as it is. No authorisation reaches your cases.

## Suite: Inline Add and Edit Parts — 6 cases, PRECONDITIONS ONLY

Steps and Expected Results were **not touched** on any of these six. Only precondition lines 2 and 3
changed, and only because they named two things that **do not exist on the screen**:

| Was written | What the build actually shows |
|---|---|
| `Work Order Line - Create and Edit` | the role screen's **`Work order lines`** section and the box in its **`Create & Edit`** column |
| `Work Orders → Work Order View Mode` | the **`Work orders`** section, and beneath it a **`View mode`** block offering **`Full View`** and **`Tech view`** |

| Case | Title |
|---|---|
| [C45005](https://shopview.testrail.io/index.php?/cases/view/45005) | Saving adds the part at the top of the list with a Part added toast |
| [C45026](https://shopview.testrail.io/index.php?/cases/view/45026) | Saving an edit updates the part line in place and closes the row |
| [C45223](https://shopview.testrail.io/index.php?/cases/view/45223) | Selecting a part auto-allocates the full quantity to a single bin |
| [C45224](https://shopview.testrail.io/index.php?/cases/view/45224) | Allocation is shown below the row as a Pulled from chip |
| [C45227](https://shopview.testrail.io/index.php?/cases/view/45227) | Choosing a bin from the picker moves the full quantity into it |
| [C45237](https://shopview.testrail.io/index.php?/cases/view/45237) | Allocation is stored on save and not shown on the saved part row |

Their markers and their `Last checked against build v26.35.6-598cc8a on 9/1/2026.` sentences are
**unchanged** — the behaviour check was 1 September and that date was deliberately not moved just
because a precondition was reworded.

## Suite: Printer Friendly Work Orders — 1 case, ALL THREE FIELDS

**[C45123](https://shopview.testrail.io/index.php?/cases/view/45123) — "Printing logs a Work Order
Printed event in audit history".** This one changed materially, so read it before relying on any
script that drives it:

1. **Its steps now name the route.** They said *"Open the work order's audit history"*, which names
   nothing clickable. They now say: the **three-dots** button at the top right of the work order,
   between `SHOPCOACH ANALYSIS` and `New Line` → **`Audit Log`** → a window titled
   **`Work Order Log`** with columns `Event`, `User`, `Line`, `Details`, `Date`, `Time`.
2. **The event label is corrected to `Work order printed`.** The 1 September pass recorded it as
   *"Work order printed history"* and raised a wording divergence on that basis. **There was no
   divergence** — `probe_print3.mjs` read each table row with `tr.innerText`, which glues the
   Event cell's clock-icon text (`history`) onto the event name. **If a script asserts on
   "Work order printed history", it is asserting on a string that has never existed on the page.**
3. **Its marker moved from `AUTOMATION: Not available on Build to test Yet` to `AUTOMATION: READY`**,
   with `Last checked against build v26.35.6-598cc8a on 9/2/2026.` The behaviour was verdicted PASS
   live on 1 September, so the deferred marker was a false statement about the build.

Suite arithmetic re-derived live afterwards: **READY 39 + EXPECT-FAIL 0 = 39**, and **44 − HOLD 5 = 39**
→ closes.

## Evidence

Payload, pre-write snapshots, per-case applied log and the four post-write checks:
`build/automated-cases-2026-09-02/`. All four came back clean — precondition-label gate ALL CLEAR,
runnability 7/7, stored-value render check 7/7, served-page container scan 0 escaping.

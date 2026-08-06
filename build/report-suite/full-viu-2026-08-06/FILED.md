# Jira — tickets filed this session

> **⚠️ CORRECTION 2026-08-06 (second session).** This file states below that **none of the six
> specifications mentions the ~10,000-row export cap. That is WRONG, and it is wrong in our own
> favour.** Checked independently against the live spec bodies: **Sales By Customer v15 documents it
> twice (S14-R16 for CSV, S15-R25 for PDF)**, **Sales By Representative v17 documents it (S14-E2)**
> and **Inventory Value v4 documents it including the exact user-facing message (S10-R12)**. Only
> **Parts Velocity v5, Technician Utilization v6 and Work In Progress v9** are silent. So for three
> of the six reports a case may assert the cap on the strength of the SPECIFICATION and does not
> have to fall back on epic story SV-8591; for the other three the story remains the only source.
> The wrong claim is left in place below rather than overwritten, because a claim we made and then
> fixed is part of the record. Full table: `SPEC-DIFF.md` §8. The narrowed question to Chris Ward is
> Q6 in `QUESTIONS-FOR-CHRIS.md`.


## Note on a retracted instruction

A mid-session message asked for filing to stop and for candidate packages instead. The QA lead
**retracted it the same hour**, verbatim: *"I take everything back which I said before... Do not take
any action or change anything based on the above which I said to you earlier."* **It was never in
force and nothing was written to any case under it** — the live census confirms **0 cases carry a
"no ticket yet" marker**. The standing authorisation to file stands, and Rule 51 (an API-only fault
is never filed) is unaffected.

## Filed this session — 15 Story Defects, every field read back

The first eight came from the Inventory Value batches; the last seven from Parts Velocity.

| Key | Parent story | Summary |
|---|---|---|
| [SV-8925](https://shopview.atlassian.net/browse/SV-8925) | SV-8612 | SBC and SBR spreadsheets export money, percentages and dates as text |
| [SV-8926](https://shopview.atlassian.net/browse/SV-8926) | SV-8671 | Inventory Value totals row labelled "Totals" where the spec asks for "Total" |
| [SV-8927](https://shopview.atlassian.net/browse/SV-8927) | SV-8670 | Inventory Value opens with Margin and Total Sell already on |
| [SV-8928](https://shopview.atlassian.net/browse/SV-8928) | SV-8675 | Inventory Value forgets the part search text between visits |
| [SV-8929](https://shopview.atlassian.net/browse/SV-8929) | SV-8675 | Inventory Value keeps a saved category that no longer exists |
| [SV-8930](https://shopview.atlassian.net/browse/SV-8930) | SV-8668 | Inventory Value shows an empty table with no message when nothing matches |
| [SV-8931](https://shopview.atlassian.net/browse/SV-8931) | SV-8674 | Inventory Value opens on All locations instead of the user's current location |
| [SV-8932](https://shopview.atlassian.net/browse/SV-8932) | SV-8679 | Inventory Value: long text never shortens, and headings announce no sort state |
| [SV-8934](https://shopview.atlassian.net/browse/SV-8934) | SV-8646 | Parts Velocity PDF prints Description, Category and Vendor in full instead of shortening them to 18 characters |
| [SV-8935](https://shopview.atlassian.net/browse/SV-8935) | SV-8646 | Parts Velocity spreadsheet prints Last Sale as the words "54 days" instead of a plain number |
| [SV-8936](https://shopview.atlassian.net/browse/SV-8936) | SV-8646 | Parts Velocity download success message is a general one and does not name the report or the file type |
| [SV-8937](https://shopview.atlassian.net/browse/SV-8937) | SV-8646 | Parts Velocity PDF heading shows an end date one day later than the range asked for, and is labelled "Start Date Range" |
| [SV-8938](https://shopview.atlassian.net/browse/SV-8938) | SV-8643 | Parts Velocity Location column sits sixth, after Vendor, instead of first before Type |
| [SV-8939](https://shopview.atlassian.net/browse/SV-8939) | SV-8642 | Parts Velocity opens on All locations instead of the location the user is working in |
| [SV-8940](https://shopview.atlassian.net/browse/SV-8940) | SV-8643 | Parts Velocity never shortens long Description, Category or Vendor text, so the table runs far wider than the window |

All fifteen are in the Rule-52 shape: issuetype **Story Defect (10007)** · parent = the **owning
story** · priority **Low** · `relates to` link to the same story · **no Product Area** · seven-section
body naming the exact test data and what was ruled out. Every field was read back — **11 checks each,
all PASS**. No existing ticket was edited, commented on, transitioned or re-prioritised.

**Duplicate search run before the last seven** (and reported here so it can be judged):
`parent=SV-8582 AND issuetype="Story Defect"`, `text ~ "location" AND created > 2026-07-25`,
`text ~ "toast"`, `text ~ "truncated"`, and `text ~ "velocity" AND issuetype in (Bug,"Story Defect")`.
That returned SV-8925–SV-8932 (this session's own eight), SV-8879, SV-8880, SV-8881, SV-8818,
SV-8819, SV-8820, SV-8823, SV-8907 and SV-8908 — **none of which covers any of the seven**, and the
two nearest neighbours (SV-8931 on Inventory Value's location default, SV-8932 on Inventory Value's
truncation) are named inside the new tickets so a triager can see the relationship.

## Two candidates that were DISPROVEN and must never be filed

Recorded here so nobody re-raises them.

**(a) The ~10,000-row export refusal is deliberate, and it is in the epic.** Both export formats
return HTTP 400 on the Parts Velocity default view (10,064 rows) with *"This report is too large to
export. Narrow the date range or filters, then try again."* That is the **10k row-cap guard named in
epic story [SV-8591](https://shopview.atlassian.net/browse/SV-8591)** — *"[Reports Suite][A3] Export
contract + 10k row-cap guard"*. Under Rule 57 an epic story is a source of expected behaviour, so
this is **expected**. **What IS worth asking Chris Ward: none of the six specifications mentions the
cap**, and it means the Parts Velocity first-visit view cannot be exported at all.

**(b) The header-click sort is correct.** A snapshot taken four seconds after a click still showed
the previous order and the previous request, reading exactly like *"the second click does not
reverse the direction"*. Four clicks driven in sequence, reading the header's own sort class
alongside the rows, showed the real cycle: first click **ascending**, second **descending**, third
**ascending**. A stale read, and the same trap that nearly produced a false report on the previous
pass.

## Rule-61 block census, live over all 476

| | Count |
|---|---|
| `AUTOMATION: READY` | 385 |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 45 |
| `AUTOMATION: HOLD` | 33 |
| no plain-text marker (the 13 raw-markup cases) | 13 |

Of the 45 expect-fail cases: **35 carry the ticketed Rule-61 three-outcome block**, **0 carry the
no-ticket variant** (every deviation found so far has a ticket), and **10 carry no block at all** —
C30500, C30510, C30512–C30518 and C38918, the Work In Progress export set. Those 10 are deliberately
blank: the failure has never been reproduced, and **a symptom nobody has seen must never be
written**.

## Batch 7 — twelve more Story Defects (Technician Utilization)

| Key | Parent story | Summary |
|---|---|---|
| [SV-8943](https://shopview.atlassian.net/browse/SV-8943) | SV-8648 | Opens on All locations instead of the location the user is working in |
| [SV-8944](https://shopview.atlassian.net/browse/SV-8944) | SV-8648 | Total hours do not match Timesheet Activities for the same technician, range and location |
| [SV-8945](https://shopview.atlassian.net/browse/SV-8945) | SV-8649 | Sorting a column reloads the report from the server instead of reordering the rows on screen |
| [SV-8946](https://shopview.atlassian.net/browse/SV-8946) | SV-8652 | The technician filter reloads the report from the server instead of hiding rows on screen |
| [SV-8947](https://shopview.atlassian.net/browse/SV-8947) | SV-8652 | The technician filter and its select-all control are labelled differently from the specification |
| [SV-8948](https://shopview.atlassian.net/browse/SV-8948) | SV-8654 | Downloads ignore the technician filter and include everybody |
| [SV-8949](https://shopview.atlassian.net/browse/SV-8949) | SV-8654 | Downloads are not ordered by technician name A to Z |
| [SV-8950](https://shopview.atlassian.net/browse/SV-8950) | SV-8654 | Downloads leave out the Summary row |
| [SV-8951](https://shopview.atlassian.net/browse/SV-8951) | SV-8654 | The Expanded spreadsheet contains per-day rows and the file names differ from the specification |
| [SV-8952](https://shopview.atlassian.net/browse/SV-8952) | SV-8654 | Download messages: the success wording is generic and a failed download says nothing at all |
| [SV-8953](https://shopview.atlassian.net/browse/SV-8953) | SV-8655 | Expand and collapse controls do not tell assistive technology whether a row is open |
| [SV-8954](https://shopview.atlassian.net/browse/SV-8954) | SV-8656 | The Location column disappears when one location is chosen, and cannot be turned on again |

**Duplicate search run before filing, reported so it can be judged:**
`parent in (SV-8648..SV-8656)` — **0 results**, so no Technician Utilization story carried a defect
of its own before this batch; and `project=SV AND text ~ "Technician Utilization" ORDER BY created
DESC` — 33 results, of which the relevant neighbours are **SV-8818** (the PDF timeout on five of the
six reports, which names this report — so nothing was filed for the Expanded PDF failure),
**SV-8881** (the download-menu wording on this report — so nothing was filed for that either, and
C30434 points at SV-8881), **SV-8879** (the location chooser shown to a single-location user),
**SV-8907**/**SV-8908** (Work In Progress), and the two historic ones **SV-6431** (Done) and
**SV-5334** (obsolete) about the *previous* reports disagreeing with Timesheet Activities — both
named inside SV-8944 so a triager can see the relationship.

## Four more candidates DISPROVEN and not filed

**(c) The Total Hours link is not colour-only** — it is font-weight 600 against 400, with a pointer
cursor, and gains an underline and a 2px outline on keyboard focus. S6-R1 allows "an equivalent
non-color affordance".

**(d) The drill-through to Timesheet Activities is not broken** — the raw identifier and "no results"
were a stale read at 8 s; the page settles to the technician's name and a full Totals line.

**(e) The Expanded PDF server error is SV-8818**, already filed and already naming this report. It is
a ~30-second timeout (874 rows succeed in 23.6 s, 1,235 rows fail at 31.8 s), not the 10,000-row
guard, which answers HTTP 400 with its own message.

**(f) The Summary's one-hundredth gap is the documented rounding drift** that C30415 allows; the
figures reconcile to the raw seconds exactly.

## One existing ticket whose scope this batch showed to be too narrow — NOT edited

**[SV-8937](https://shopview.atlassian.net/browse/SV-8937)** says the one-day-late PDF end date and
the *"Start Date Range:"* label are specific to Parts Velocity. **Technician Utilization does exactly
the same thing** — asked for 1 Jan to 6 Aug 2026 it prints *"Start Date Range: Jan 1, 2026 - Aug 7,
2026"*. Reported, not edited: widening someone's ticket is the QA lead's call.

## Batch 8 — two more Story Defects (Sales By Customer)

| Key | Parent story | Summary |
|---|---|---|
| [SV-8955](https://shopview.atlassian.net/browse/SV-8955) | SV-8601 | Never puts the date range or Product Type in the page link, so the report cannot be shared |
| [SV-8956](https://shopview.atlassian.net/browse/SV-8956) | SV-8612 | Download file names leave out the date range |

**Duplicate search run before filing:** `parent in (SV-8606..SV-8615)` → 1 result, SV-8925, this
session's own spreadsheet-formatting ticket; `project=SV AND text ~ "page link" ORDER BY created DESC`
→ 231 results, all about the Filters project's URL-state work (SV-8796, SV-8871, SV-8828 and
neighbours) and none about a report's address bar; `project=SV AND text ~ "Sales By Customer" AND
created > 2026-07-25` → 50 results, of which the near neighbours are SV-8780 (SBC gated by its own
permission), SV-8818, SV-8819, SV-8820, SV-8879, SV-8880 and SV-8925 — **none covers either of these
two.**

## A second existing ticket whose scope is wider than its own text — NOT edited

**[SV-8937](https://shopview.atlassian.net/browse/SV-8937)** is written as Parts Velocity only. The
one-day-late PDF end date now reproduces on **Technician Utilization** and on **Sales By Customer**
as well. The *"Start Date Range:"* mislabel is narrower — Parts Velocity and Technician Utilization
have it, Sales By Customer prints *"Date Range:"* correctly. Reported for the QA lead's decision.

---

## SESSION 4 — 2026-08-06 — three Story Defects, priority **Medium**

**Rule 53 changed today: what we file is now `Medium`, not `Low`.** All three below were filed at
`Medium`. Tickets filed before 2026-08-06 are **not** retroactively re-prioritised.

**Shape used on all three (Rule 52):** `issuetype` = **Story Defect** (10007) · `parent` = **the owning
story**, which is itself a child of epic SV-8582 · `priority` = **Medium** · the owning story also linked
**`relates to`** · **no Product Area** (the field does not exist on this type). Each carries a
plain-language **source block** naming the WIP specification version 9 and the numbered requirement.

**Duplicate-searched first** with six JQL queries (`align`, `Last Activity`, `muted` / `Estimates
figure`, `Inv. Hrs`, `Totals row`, `Work In Progress`) plus the child lists of stories SV-8660, SV-8661
and SV-8662. **SV-8661 and SV-8662 had no children at all**, so nothing existing covered these.

| Key | Parent story | Priority | Summary | Field checks |
|---|---|---|---|---|
| [SV-8987](https://shopview.atlassian.net/browse/SV-8987) | SV-8660 | Medium | Work In Progress: the Last Activity column is left-aligned where the description asks for right-aligned | **11/11 PASS** |
| [SV-8988](https://shopview.atlassian.net/browse/SV-8988) | SV-8661 | Medium | Work In Progress: the Estimates figure in the summary strip is not shown in a muted style | **11/11 PASS** |
| [SV-8989](https://shopview.atlassian.net/browse/SV-8989) | SV-8660 | Medium | Work In Progress: Inv. Hrs shows two decimal places where the description asks for one | **11/11 PASS** |

**0 tickets edited. 0 of anyone else's tickets touched** — in particular **SV-8960** (Nebojsa Glavinic),
which contradicts S4-R4, was left exactly as found and escalated in `FINDINGS.md` instead.

**Not filed, deliberately:** the five "Approved - Partially Completed" rows with no started signal (an
innocent explanation could not be ruled out) and the **C30495 / S6-R3 Totals-row colouring** contradiction
(it contradicts an already-verdicted case, so it is the QA lead's call, not a unilateral filing).

# Automated Cases Register — `custom_atmstatus = 3` across the three active suites

**Purpose:** the durable list of every case carrying TestRail's OWN **"Automated"** status field
(`custom_atmstatus = 3`) in Schedule (4254), Report Suite (4281) and Filters (4110). This is the
**hand-off list for Vladimir Tomovic** (the automation engineer): after build verification, the
plain-text markers on our touched cases get lifted to `AUTOMATION: READY` / `... EXPECT FAIL` and
these case numbers are shared with him so he adjusts his automations (Standing Rule 65).

**Compiled read-only, 2026-08-18, from live TestRail.** id 3 = us (Bilal Muzamil), id 1 =
Vladimir Tomovic, id 7 = Ahtasham Amjad.

**Totals:** 56 cases at `custom_atmstatus = 3` — **44 ours** (all edited this session: **11 content
changed [A]**, **33 marker/provenance/refs only [B]**) + **12 foreign** (Vladimir Tomovic; **0
touched**). Schedule has **0** at `=3` (but 20 at `=4` Pending, set by Vladimir — listed at the end).

**Bucket key:** **A** = we changed real test content (title/preconditions/steps/expected body).
**B** = we changed only the automation marker / Rule-54 provenance line / refs; test content
byte-identical to before our write. **—** = we did not touch it this session.

---

## OURS (`created_by = 3`) — the `atmstatus=3` flag was set by Vladimir; we authored the case body

| Project | C-id | Link | Title | Current plain-text marker | Touched this session | Bucket |
|---|---|---|---|---|---|---|
| Filters | C29600 | [open](https://shopview.testrail.io/index.php?/cases/view/29600) | Status and Asset on Site together show only work orders matching both | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — title, preconditions, steps, expected-BODY |
| Filters | C29614 | [open](https://shopview.testrail.io/index.php?/cases/view/29614) | Filters are remembered permanently, even after closing the browser | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Filters | C29623 | [open](https://shopview.testrail.io/index.php?/cases/view/29623) | On a phone, choices in a filter sheet apply only when you tap Apply filters | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — title, preconditions, steps, expected-BODY |
| Filters | C38877 | [open](https://shopview.testrail.io/index.php?/cases/view/38877) | Imported works alone: picking it greys out the other filters | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30107 | [open](https://shopview.testrail.io/index.php?/cases/view/30107) | Product Type multi-select: both toggles on by default; S/P prefix filtering | AUTOMATION: READY - EXPECT FAIL (SV-9074) | YES | B |
| Report Suite | C30114 | [open](https://shopview.testrail.io/index.php?/cases/view/30114) | Pinned control toggles All customers and Clear all; clearing shows empty state | AUTOMATION: READY - EXPECT FAIL (SV-8991) | YES | B |
| Report Suite | C30121 | [open](https://shopview.testrail.io/index.php?/cases/view/30121) | Each customer gets one summary row with its invoice count in parentheses | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30123 | [open](https://shopview.testrail.io/index.php?/cases/view/30123) | Expanding a customer reveals asset rows; chevrons toggle and are independent | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30138 | [open](https://shopview.testrail.io/index.php?/cases/view/30138) | The invoice number opens the invoice in the same browser tab | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30217 | [open](https://shopview.testrail.io/index.php?/cases/view/30217) | A rep row appears only when the rep has a matching non-reversed invoice | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30221 | [open](https://shopview.testrail.io/index.php?/cases/view/30221) | Expanding a rep loads its invoices on demand with a row-level spinner | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — expected-BODY |
| Report Suite | C30262 | [open](https://shopview.testrail.io/index.php?/cases/view/30262) | Show Unassigned adds one top-pinned Unassigned row that acts like a rep row | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30314 | [open](https://shopview.testrail.io/index.php?/cases/view/30314) | Invoice credit snapshot: WO rep, else customer rep, else unassigned | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30326 | [open](https://shopview.testrail.io/index.php?/cases/view/30326) | Without the Manager or Office User role the report entry is not shown | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30328 | [open](https://shopview.testrail.io/index.php?/cases/view/30328) | Type filter: single-select, first in row, three options, default Both; reloads | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30333 | [open](https://shopview.testrail.io/index.php?/cases/view/30333) | Toolbar search matches part number or description, case-insensitively | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30338 | [open](https://shopview.testrail.io/index.php?/cases/view/30338) | Empty state shows the standard no-data message when no parts match the filters | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30346 | [open](https://shopview.testrail.io/index.php?/cases/view/30346) | Info icons sit on Units Sold, Demand and Turns/Yr with descriptions | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — expected-BODY |
| Report Suite | C30352 | [open](https://shopview.testrail.io/index.php?/cases/view/30352) | First visit shows exactly the 14 default columns in the specified order | AUTOMATION: READY - EXPECT FAIL (SV-8938) | YES | A — expected-BODY |
| Report Suite | C30353 | [open](https://shopview.testrail.io/index.php?/cases/view/30353) | A re-enabled column returns to its canonical slot, with no reload | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — expected-BODY |
| Report Suite | C30390 | [open](https://shopview.testrail.io/index.php?/cases/view/30390) | Header-click sorting re-queries the server; nulls first asc and last desc | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30398 | [open](https://shopview.testrail.io/index.php?/cases/view/30398) | Without reports access Technician Utilization is hidden | AUTOMATION: HOLD - needs a second sign-in as a user without reports access, and there is one shared sign-in on this environment | YES | B |
| Report Suite | C30399 | [open](https://shopview.testrail.io/index.php?/cases/view/30399) | Standard no-data message when no time in scope or all technicians cleared | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30401 | [open](https://shopview.testrail.io/index.php?/cases/view/30401) | Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp) | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30404 | [open](https://shopview.testrail.io/index.php?/cases/view/30404) | Est. Lost Labor values internal hours at each location's default rate | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30410 | [open](https://shopview.testrail.io/index.php?/cases/view/30410) | All six columns sort on screen: ascending first, toggling with no third state | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30424 | [open](https://shopview.testrail.io/index.php?/cases/view/30424) | Deselecting a technician hides the row and recalculates the Summary | AUTOMATION: READY - EXPECT FAIL (SV-8946) | YES | B |
| Report Suite | C30429 | [open](https://shopview.testrail.io/index.php?/cases/view/30429) | The Total Hours link opens Timesheet Activities in the same tab | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30449 | [open](https://shopview.testrail.io/index.php?/cases/view/30449) | The per-day breakdown is fetched only when a technician row is expanded | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30452 | [open](https://shopview.testrail.io/index.php?/cases/view/30452) | Four tabs in a fixed order with the partially-completed tab selected | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30460 | [open](https://shopview.testrail.io/index.php?/cases/view/30460) | No qualifying work orders: every tab shows the no-data message and no Totals | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — steps |
| Report Suite | C30462 | [open](https://shopview.testrail.io/index.php?/cases/view/30462) | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — preconditions |
| Report Suite | C30488 | [open](https://shopview.testrail.io/index.php?/cases/view/30488) | Total Earned is the hero figure and equals the started-stage figures summed | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30498 | [open](https://shopview.testrail.io/index.php?/cases/view/30498) | The Advisor filter lists the advisors in the loaded jobs; screen only | AUTOMATION: READY - EXPECT FAIL (SV-8968) | YES | B |
| Report Suite | C30508 | [open](https://shopview.testrail.io/index.php?/cases/view/30508) | Remembers the "as of" date, filter selections, location, columns | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — title, steps, expected-BODY |
| Report Suite | C30510 | [open](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress: a three-dot menu holds Download (PDF) and Download (CSV) | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30515 | [open](https://shopview.testrail.io/index.php?/cases/view/30515) | The downloaded files are named "wip-2-report.pdf" and "wip-2-report.csv" | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30518 | [open](https://shopview.testrail.io/index.php?/cases/view/30518) | Export notifications: success caption, "Empty export" warning | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30527 | [open](https://shopview.testrail.io/index.php?/cases/view/30527) | Without reports access Work In Progress is absent from the navigation | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30535 | [open](https://shopview.testrail.io/index.php?/cases/view/30535) | One row per in-stock part at the selected locations valued at the resolved date | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — steps, expected-BODY |
| Report Suite | C30557 | [open](https://shopview.testrail.io/index.php?/cases/view/30557) | Totals row sums the FULL filtered set on the server, not just the visible page | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30563 | [open](https://shopview.testrail.io/index.php?/cases/view/30563) | The "as of" date today, with today not yet recorded, values live stock | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — title, steps, expected-BODY |
| Report Suite | C30569 | [open](https://shopview.testrail.io/index.php?/cases/view/30569) | Category and Vendor multi-selects reload the report to matching parts only | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30583 | [open](https://shopview.testrail.io/index.php?/cases/view/30583) | Rows are sorted by Total Cost highest first on load and after any reload | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |

---

## FOREIGN (`created_by != 3`) — authored AND flagged by the automation engineer; HANDS-OFF (Rule 38)

| Project | C-id | Link | Title | Current plain-text marker | Touched this session | Bucket |
|---|---|---|---|---|---|---|
| Report Suite | C38919 | [open](https://shopview.testrail.io/index.php?/cases/view/38919) | TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it | (none) | no | — |
| Report Suite | C38920 | [open](https://shopview.testrail.io/index.php?/cases/view/38920) | PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row | (none) | no | — |
| Report Suite | C38921 | [open](https://shopview.testrail.io/index.php?/cases/view/38921) | IV CSV export carries the As of and Locations metadata lines above the header, plus a scope-conditional Location column | (none) | no | — |
| Report Suite | C38922 | [open](https://shopview.testrail.io/index.php?/cases/view/38922) | WIP CSV export gains the Locations line while its column semantics stay exactly as shipped | (none) | no | — |
| Report Suite | C38923 | [open](https://shopview.testrail.io/index.php?/cases/view/38923) | SBR Summary and Expanded CSV exports carry the Location column at its designated slot | (none) | no | — |
| Report Suite | C43567 | [open](https://shopview.testrail.io/index.php?/cases/view/43567) | Filter-panel search keeps keyboard focus across the QSelect No-results swap | (none) | no | — |
| Report Suite | C43568 | [open](https://shopview.testrail.io/index.php?/cases/view/43568) | Manual Parts return counts toward Units Returned on Parts Velocity | (none) | no | — |
| Report Suite | C43569 | [open](https://shopview.testrail.io/index.php?/cases/view/43569) | Report route permission gate for Sales By Customer / Sales By Representative / Inventory Value | (none) | no | — |
| Report Suite | C43570 | [open](https://shopview.testrail.io/index.php?/cases/view/43570) | Select all / Clear all filter encoding does not overflow the request line | (none) | no | — |
| Report Suite | C43571 | [open](https://shopview.testrail.io/index.php?/cases/view/43571) | Report drill-through cells render plain text when the viewer cannot open the target | (none) | no | — |
| Report Suite | C43572 | [open](https://shopview.testrail.io/index.php?/cases/view/43572) | Work In Progress appends pages on scroll while the server summary stays constant | (none) | no | — |
| Report Suite | C43573 | [open](https://shopview.testrail.io/index.php?/cases/view/43573) | Remembered view restores Inventory Value category and vendor filters across a reload | (none) | no | — |

---

## Appendix — Schedule `custom_atmstatus = 4` (Pending), for awareness (NOT "Automated")

20 Schedule cases were moved `Not Automated → Pending` by **Vladimir Tomovic (user id 1)** at
**2026-08-17T10:15:33 UTC**, before our Schedule passes. "Pending" ≠ "Automated" (`3`), but it signals
Vlad has queued them for automation; our later edits preserved the value (we never sent the field). All 20 (all edited by us this session,
value untouched): C29925, C29927, C29928, C29931, C29932, C29936, C29937, C29939, C29943, C29944,
C29948, C29950, C29951, C29952, C29954, C30039, C30040, C30042, C30043, C30046.

---

## 2026-08-26 — TWO Automated cases rewritten under the QA lead's explicit per-case approval (Rule 65 / Rule 71)

**For Vladimir Tomovic.** These are the **only two** `custom_atmstatus = 3` cases touched on
2026-08-26. Both were re-read whole (Rule 41), re-derived from the CURRENT live specification,
and byte-verified by a re-GET (Rule 50). **`custom_atmstatus` is still 3 on both** and **the
AUTOMATION marker line was left byte-identical on both** — the marker was not moved, reworded or
re-flagged. Titles were not changed. **Please re-check the automations for these two.**

| Project | C-id | Link | atmstatus | Marker (unchanged) | What changed, in plain words |
|---|---|---|---|---|---|
| Report Suite | C30287 | [open](https://shopview.testrail.io/index.php?/cases/view/30287) | 3 | `AUTOMATION: READY` | Sales By Representative CSV cell formatting. The report gained a **Shop Supplies** money column, and the rule for when the Margin % cell is left empty changed. The test used to say the Margin % cell is empty when **Subtotal** is zero or less; it now says the cell is empty when the **Margin base** (Labor Invoiced + Parts Invoiced + Adjustments, i.e. Subtotal minus Shop Supplies) is zero or less. The preconditions and steps now also ask the tester to read a Shop Supplies cell, and the money-formatting rule is stated to cover that column. The expectation was corrected to the **current specification version 24** (was pinned to version 22). A trailing note about SV-9069 was removed because version 24 now states the two-decimal Margin % itself. |
| Report Suite | C30518 | [open](https://shopview.testrail.io/index.php?/cases/view/30518) | 3 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | Work In Progress export notifications. **The three expected messages did not change at all** — they are worded identically in version 28 to the version this test was written against, which we confirmed by reading both. Only the record of which specification version the test was checked against was corrected, from **version 21 to the current version 28**, and a wrong version number in the test's own source-caution note ("version 11") was corrected to 28. **Nothing an automation asserts on has changed for this case.** |

**One caution on C30518 — please read before you re-run it.** Saving this case through the
TestRail API added a visible `<p>` at the start and `</p>` at the end of its Expected Results on
the case page. That is a TestRail behaviour, newly proven on 2026-08-26 and written up in
`build/APP-ACTIONS-PLAYBOOK.md` §J, not a wording change by us — the sentences themselves are
correct. It needs a one-line clean-up in the TestRail web editor. **C30287 is not affected.**

---

## 2026-08-28 — TWO Automated cases edited under the QA lead's explicit approval (Rule 65 / Rule 71)

**FOR VLADIMIR TOMOVIC.** These are the **only two** `custom_atmstatus = 3` cases touched on
**2026-08-28**. On both: the atm flag was read **before** anything was written and the field was
**never sent**, so it is **still 3**; the **title was not changed**; the case was re-read whole
(Rule 41); and the **rendered case page was re-read after the write** and shows no stray tags.
**Please re-check the automations for these two — one of them does change an assertion.**

| Project | C-id | Link | atmstatus | Marker after (unchanged) | Does an assertion change? | What changed, in plain words |
|---|---|---|---|---|---|---|
| Report Suite | C30518 | [open](https://shopview.testrail.io/index.php?/cases/view/30518) | 3 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | **NO** | Work In Progress export notifications. Two things were fixed, **neither of them a step or an expectation**. (1) The **render damage is gone**: saving this case through the API on 26 August had put a visible `<p>` at the start and `</p>` at the end of its Expected Results on the case page. It was repaired in the TestRail web editor and the page is now clean. (2) The record of which specification the test is pinned to was corrected in the **References** field, from *WIP spec v21 2026-08-17* to *WIP spec v28 2026-08-24*. **No step or expectation wording was altered.** We re-read both specification versions and the three messages this test checks — the success caption, the "Empty export" warning and the export error — are **worded identically in v28 and v21**, so there was nothing to change. |
| Report Suite | C30287 | [open](https://shopview.testrail.io/index.php?/cases/view/30287) | 3 | `AUTOMATION: READY` | **YES — one column heading** | Sales By Representative CSV cells. The test said the first column of both downloaded files is headed **"Sales Representative"**. The specification (version 24, requirements S14-R15 and S14-R16) gives that heading as the single word **"Representative"**, and the product owner settled it in writing on 5 August 2026 (*""Representative" on its own is fine… We match our tests to it"*). The heading is now **"Representative"** in the steps and in expected point 4. Expected point 6, which told the tester to fail the build over a *pending* rename to "Sales Representative", was rewritten — that rename was settled the other way, so as written it would have failed a correct build. The References field was re-pinned from *SBR spec v22* to *SBR spec v24*, and the provenance line re-dated to 28 August 2026. **Nothing else changed** — not the title, not the preconditions, not points 1, 2, 3 or 5, not the build-check sentence, not the marker. |

**A side effect on C30518 you should know about.** A save through the TestRail **web editor** re-saves
**every** field on the form, not only the one being edited. C30518's Preconditions and Steps held
plain text with typed `1.` `2.` `3.` prefixes; the editor recognised the numbering and stored them as
a real numbered list. **The words are byte-identical and the tester still reads a numbered list** —
only the numbers changed from typed characters to list markers. If an automation scrapes those two
fields as raw text, the literal `"1. "` prefixes are no longer in the string. C30287 was edited via the
API and is **not** affected.

Full evidence: `build/report-suite/damage-2026-08-26/C30518-REPAIR-2026-08-28.md` and
`build/report-suite/c30287-header-2026-08-28/CSV-COLUMN-HEADER-CORRECTION.md`.

---

## 2026-08-28 — PENDING, NOT WRITTEN: one typo on C30287, held for the QA lead's go-ahead (Rule 71)

**NOTHING WAS WRITTEN FOR THIS ITEM.** [C30287](https://shopview.testrail.io/index.php?/cases/view/30287)
is `custom_atmstatus = 3` (**Automated**), read live 2026-08-28, so **Rule 71 holds it**: no change to
an Automated case without the QA lead's explicit go-ahead, even a typo. Recorded here so it is not
lost and not silently fixed by a later pass.

| Field | C-id | atmstatus | Found | Proposed correction (ONE word) | Does an assertion change? |
|---|---|---|---|---|---|
| Steps (step 2) | C30287 | **3** | `… the negative value's cell, **an** Labor Delta cell, the undefined Margin % cell …` | `… the negative value's cell, **a** Labor Delta cell, the undefined Margin % cell …` | **No** — grammar only; no label, value, column or expectation changes |

**Exact one-line edit, ready to apply on approval:** in `custom_steps`, replace `an Labor Delta cell`
with `a Labor Delta cell`. Nothing else on the case is touched; `custom_atmstatus` is **never sent**
(it stays 3), and the title is not changed.

**Why it is worth doing at all:** the case is tester-facing (Rules 7/9) and this is the only defect in
it. **Why it is not done now:** it is Automated, and Rule 71 does not have a "too small to matter"
exemption. **If approved, Rule 65 then applies — Vladimir must be told**, and the change gets its own
row in the section above.

**ASK:** may we apply this one-word correction to C30287?

---

## 2026-08-28 (second pass) — FOR VLAD: two Automated cases changed, 38 held

**Authority:** the QA lead approved, on 2026-08-28, the C30287 typo asked for in the section above,
and **pin-only** restamps on the 39 Automated cases *"if that does not break automation"*.

**Both changes below were verified on the RENDERED case page immediately after the write.
`custom_atmstatus` was re-read live before each write, was never sent, and is still `3` on both.
Title, `refs`, section, priority, type, estimate, milestone, template and `custom_automation_type`
are unchanged on both.**

| Project | C-id | Link | atmstatus | Marker after (unchanged) | Does an assertion change? | What changed, in plain words |
|---|---|---|---|---|---|---|
| Report Suite | **C30287** | [open](https://shopview.testrail.io/index.php?/cases/view/30287) | 3 | `AUTOMATION: READY` | **NO** | **The one-word typo approved above is now done.** In the Steps only, `an Labor Delta cell` reads `a Labor Delta cell`. Grammar only. No label, no value, no column, no expectation, no version and no other field was touched — Preconditions and Expected Results were not even sent. |
| Report Suite | **C30277** | [open](https://shopview.testrail.io/index.php?/cases/view/30277) | 3 | `AUTOMATION: READY` | **NO** | **The cited specification version only.** In the Expected Results provenance line, *Sales By Representative report specification version 22 … read on 17 August 2026* now reads *version 24 … read on 28 August 2026*. Every requirement the case cites (S14-R2, S14-R2a, S14-R20, S21-R6, S22-R4) was read again in the live version 24 and still says exactly what the case asserts, so **not one word of the five expectations changed**. |

### ⚠️ C30277 — one thing about it you need to know before you re-run anything

**The words did not change, but the way the Expected Results is STORED did.** The field used to hold
plain text with newline characters. Saving it through the API made TestRail wrap the whole thing in a
`<p>…</p>`, and inside that wrapper the newlines stopped acting as line breaks — the case page briefly
showed all five expectations, the provenance line and the marker **run together in one paragraph**.
It was spotted immediately, the run was stopped, and the case was repaired within the same minute by
re-storing the same words with `<br>` line breaks.

* **What a tester sees now is identical to what they saw before, line for line, apart from the
  version number.** That was proved by comparing the rendered page before and after.
* **What an automated check reading the raw field through the API sees is NOT identical:** the field
  is now `<p>line one<br>line two…</p>` instead of `line one\nline two…`.
* **So: if any check of yours parses C30277's Expected Results as raw text and splits it on newlines,
  it needs updating.** If your checks work from the case's steps, or from the rendered page, nothing
  changes for you. **Please tell us which, because the answer decides the next item.**

### The other 38 Automated cases were NOT touched, and here is exactly why

The QA lead's approval was **pin-only — the version and date, nothing else** — and conditional on
*"if that does not break automation"*. When we went to apply it we found that **on these 38 there is
no route that changes only the version and date**:

* **35 of them** render their text in TestRail's escaping container, so they can only be edited in the
  **web editor** — and a web-editor save **re-saves every field on the form**, re-storing
  **Preconditions and Steps** as HTML lists (the same side effect recorded for C30518 above). The
  approval explicitly excludes changing preconditions and steps.
* **3 of them** (C30451, C30460, C30506) are stored as plain text like C30277, so an API write would
  flatten them exactly as it flattened C30277, and repairing that means re-storing the body as HTML.

**They are therefore still pinned to their old specification version and are listed, one per row, in
`build/report-suite/batch-2026-08-28/AUTOMATED-PIN-ONLY-SPLIT.md`.**

**ASK FOR VLAD:** does any of your automation read a case's Preconditions, Steps or Expected Results
**as raw text through the TestRail API**? If it does not, we can clear all 38 in one run this week.
If it does, tell us which cases and we will leave those alone.


---

## 2026-08-28 (third pass) — FOR VLAD: the 38 held Automated cases were RE-PINNED

**Vlad cleared this.** Relayed by the QA lead on **2026-08-28**: Vlad checked the already-updated
Automated case **C30287** and reported that the update *"has not changed the formatting and it still
looks good on that case"*. That was passed to this pass as the go-ahead for the specification-version
pin restamps on the cases held in the section above.

**38 cases, not 39** — the 39th, **C30277**, was re-read live and already cites the live version 24, so
it needed nothing and was not written.

**On every one of the 38: only the cited specification version changed.** No assertion, no
precondition, no step, no title, no `refs`, no priority, no type. `custom_atmstatus` was read live
**before** each write (all `3`) and read again **after** it (all still `3`). Every case's **rendered
page was re-read in a real browser after its own write**, and a final sweep re-read all 38 again at
the end: **38 clean, 0 problems** (`build/report-suite/automated-repin-2026-08-28/FINAL-SWEEP.json`).

**Two cases came back wrong during the run. Both times the run was STOPPED on that case**, the case
was repaired, re-verified, and only then did anything else get written:

* **C30451** — stored as bare text; the API's `<p>` wrapper killed its line breaks. Re-stored with
  `<br>` line breaks, same words, verified line for line.
* **C30460** — stored as bare text in all three fields; the web-editor Save flattened all three. All
  three restored from `get_history_for_case` with `<br>` line breaks, verified line for line.

**🔴 THE ONE THING WE NEED FROM VLAD, STILL UNANSWERED.** His answer was about how the case *looks*,
and the page does look the same. But **the raw value `get_case` returns changed shape on all 38**:
`custom_expected` moved from plain text with newline characters to HTML (`<p>`/`<br>`, or `<ol><li>`
where the editor recognised the manual numbering), and on **18 of the 38** `Preconditions` and/or
`Steps` moved the same way too — because **a web-editor Save re-saves every field on the form**, not
only the field that was edited. Per-case detail:
`build/report-suite/automated-repin-2026-08-28/STORAGE-SHAPE-CHANGES.json`.

**Vlad — does any of your automation read a case's Preconditions, Steps or Expected Result as RAW
TEXT through the TestRail API and split it on newlines?** If it does, those checks need updating for
the cases below. If your checks work from the rendered page, nothing changes for you.

| C-id | Report | Pin | Route | What changed | `custom_atmstatus` | Verified | Raw storage shape now HTML |
|---|---|---|---|---|---|---|---|
| [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30247](https://shopview.testrail.io/index.php?/cases/view/30247) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Steps |
| [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Steps |
| [C30256](https://shopview.testrail.io/index.php?/cases/view/30256) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Steps |
| [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Steps |
| [C30271](https://shopview.testrail.io/index.php?/cases/view/30271) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30272](https://shopview.testrail.io/index.php?/cases/view/30272) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30274](https://shopview.testrail.io/index.php?/cases/view/30274) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions |
| [C30275](https://shopview.testrail.io/index.php?/cases/view/30275) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30276](https://shopview.testrail.io/index.php?/cases/view/30276) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions |
| [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | Sales By Representative | v22 → **v24** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions + Steps |
| [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions |
| [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions + Steps |
| [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions + Steps |
| [C30351](https://shopview.testrail.io/index.php?/cases/view/30351) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Steps |
| [C30354](https://shopview.testrail.io/index.php?/cases/view/30354) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30375](https://shopview.testrail.io/index.php?/cases/view/30375) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30377](https://shopview.testrail.io/index.php?/cases/view/30377) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | Parts Velocity | v10 → **v11** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions |
| [C30451](https://shopview.testrail.io/index.php?/cases/view/30451) | Work In Progress | v22 → **v28** | API | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | Work In Progress | v21 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | Work In Progress | v21 → **v28** | API | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions + Steps |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Work In Progress | v21 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions + Steps |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | Work In Progress | v21 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Steps |
| [C30506](https://shopview.testrail.io/index.php?/cases/view/30506) | Work In Progress | v22 → **v28** | API | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) | Work In Progress | v22 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Steps |
| [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | Work In Progress | v21 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Steps |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress | v21 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | Work In Progress | v22 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | Work In Progress | v21 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | Work In Progress | v21 → **v28** | web editor | **Only the cited specification version changed. No assertion, precondition or step wording was altered.** | still 3 | rendered page re-read: clean | Expected Result + Preconditions |

**38 rows. Full evidence: `build/report-suite/automated-repin-2026-08-28/RESULTS.md`.**


---

## 2026-08-28 (fourth pass) — FOR VLAD: five Automated cases had `refs` ONLY changed

**QA lead approved 2026-08-28.** This is the WIP traceability backfill: the live specification v28
requirement anchors were recorded on the cases that already test those requirements, because
`verify.py` only counts a requirement as covered when the anchor string appears on the case.

**On all five, `refs` was the ONLY field sent.** Preconditions, Steps and Expected Result were
compared before and after and are **byte-identical**; the rendered case page was re-read in a real
browser and is **character-identical**; `custom_atmstatus` is still `3`. **Nothing a tester or an
automated check reads as case CONTENT changed on these five — only the reference list.**

| C-id | Anchors added to `refs` | What else changed |
|---|---|---|
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | S2-N2 · S6-N1 | nothing |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | S3-R2 · S3-R3 | nothing |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | S5-R2 | nothing |
| [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) | S8-R5 · S8-R6 | nothing |
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | S9-R2 · S9-R4 | nothing |

**Vlad — if any check of yours asserts on a case's `refs` string, these five now carry an extra
comma-separated entry of the shape `SV-8664 (WIP spec v28 2026-08-24 S8-R5; S8-R6)`.** Nothing
already in `refs` was removed or rewritten.

Full evidence: `build/report-suite/refs-backfill-2026-08-28/RESULTS.md`.


---

## 2026-08-28 (fifth pass) — FOR VLAD: three Automated cases had their LINE BREAKS restored

**QA lead approved 2026-08-28, explicitly including C29955.** This pass repaired 19 cases whose
Expected Results had been damaged by our own earlier passes. Three of the 19 carry
`custom_atmstatus = 3` (**Automation status = Automated**) and so are recorded here under Rule 65.

**This was a RESTORATION of line breaks, not a rewrite. No wording, no expectation and no assertion
was changed on any of the three.** The original text was taken verbatim from each case's own
`get_history_for_case` record, and the visible words of the restored body are identical, in order, to
the visible words of the damaged body — only the line separators came back.

**`custom_expected` was the ONLY field sent.** `title`, `custom_preconds`, `custom_steps`, `refs`,
`custom_atmstatus`, `custom_automation_type`, `section_id`, `priority_id`, `type_id`, `estimate`,
`milestone_id`, `template_id` and `suite_id` were compared before and after and are **byte-identical**;
`custom_atmstatus` is **still 3** on all three. The rendered case page was re-read after each write and
is clean.

| C-id | Project | What was wrong | What changed | Automation status | Rendered check |
|---|---|---|---|---|---|
| [C26427](https://shopview.testrail.io/index.php?/cases/view/26427) | Custom Roles | Our 2026-07-20 write hit the multi-block sanitiser trap, so the tester read a literal `<p>…</p>` on screen | The same words, re-emitted as one block with the paragraph break kept as `<br>`. **No wording change.** | still 3 | clean — 2 lines, no literal tags |
| [C26489](https://shopview.testrail.io/index.php?/cases/view/26489) | Custom Roles | Same trap, same day — two of the three paragraphs were shown to the tester as literal `<p>…</p>` text | The same words, re-emitted as one block with the paragraph breaks kept as `<br>`. **No wording change.** | still 3 | clean — 3 lines, no literal tags |
| [C29955](https://shopview.testrail.io/index.php?/cases/view/29955) | Schedule | Our **2026-08-20** pass flattened the Expected Results into a single run-together line — the five numbered assertions, the provenance line and the AUTOMATION marker all ran together | Line breaks restored from the pre-damage text in the case's own history. **No wording or assertion change.** | still 3 | clean — 8 lines, marker present once and last |

**Vlad — one thing to know about C29955.** After our damage but before this repair, on **2026-08-27**
TestRail user 7 (**Ahtasham Amjad**) changed its automation marker from `AUTOMATION: READY` to
`AUTOMATION: AUTOMATED`. Under Rule 38 a foreign edit is hands-off, so **his marker was preserved, not
reverted** — the restored case reads `AUTOMATION: AUTOMATED`. If any check of yours matches on
`AUTOMATION: READY` for C29955, that is why. Note `AUTOMATED` is not one of the three canonical marker
literals; it is reported to the QA lead, not edited by us.

**Correction to the 2026-08-28 damage sweep:** it stated C29955 was the only Automated case in the
damaged set, reading `custom_automation_type`. The Automated flag is `custom_atmstatus` (option 3 =
*Automated*); `custom_automation_type` is *Automation Type* (None / E2E / Functional / Unit). Read
correctly, **three** of the 19 were Automated — the three above.

Full evidence: `build/report-suite/repair-2026-08-28/RESULTS.md` (per-case audit log:
`build/report-suite/repair-2026-08-28/REPAIRED.jsonl`, whole-case re-verification:
`WHOLE-CASE-VERIFY.json`).


---

## 2026-08-28 (sixth pass) — FOR VLAD: one Automated case had `refs` ONLY changed

**QA lead approved 2026-08-28.** This is the WIP nine-anchor citation repair: eight requirement
anchors from WIP specification v28 were tested by cases that never named them, so every coverage
check read them as gaps. The anchors were added to the `refs` of the cases that already test them.

**On the one Automated case, `refs` was the ONLY field sent.** Preconditions, Steps and Expected
Result were compared before and after and are **byte-identical**; the rendered case page was re-read
and is clean; `custom_atmstatus` is **still 3**. **Nothing a tester or an automated check reads as
case CONTENT changed — only the reference list.**

| C-id | Anchor added to `refs` | What else changed |
|---|---|---|
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | S5a-R3 — the four tab labels stay as they are even though the summary figures were renamed | nothing |

**Vlad — if any check of yours asserts on this case's `refs` string, C30452 now carries one extra
comma-separated entry of the shape `SV-8657 (WIP spec v28 2026-08-24 S5a-R3 - …)`.** Nothing already
in `refs` was removed or rewritten, and the cited spec version on the rest of the string was **not**
re-pinned.

The other six cases repaired in the same pass (C45205, C30489, C30490, C30493, C30491, C43821) are
all `custom_atmstatus = 1` and are outside Rule 65.

Full evidence: `build/report-suite/wip-authoring-2026-08-28/CREATED-AND-REPAIRS-2026-08-28.md`
(per-case audit log: `CITATION-REPAIRS.jsonl`).

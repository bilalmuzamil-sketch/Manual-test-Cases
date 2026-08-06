# Ticket links for the QA lead — 2026-08-06

Two lists, both read **live from Jira today**. Nothing here is copied forward from a note: ticket
types and parents have been changed by other people several times today, so a stored list goes out
of date within hours.

---

# LIST A — every ticket whose description we corrected

**92 tickets.** All 92 were read live today and all 92 carry the rewritten description — 91 of them
in the full five-part shape, and [SV-8902](https://shopview.atlassian.net/browse/SV-8902), our own
throwaway probe, deliberately not, because dressing a probe up as a defect would mislead a reader.

| | Tickets | Corrected |
|---|---|---|
| Report Suite (epic SV-8582) | 65 | 65 |
| Filters (epic SV-8785) | 7 | 7 |
| Schedule (epic SV-8685) | 20 | 20 |
| **Total** | **92** | **92** |

**CLOSED** marks the 8 closed ones, which were done last on your instruction that all of them be
corrected. Closed status was read live — none of them was reopened and no status was touched.

## Report Suite — 65 tickets (epic SV-8582)

| Ticket | What it is | Closed? |
|---|---|---|
| [SV-8780](https://shopview.atlassian.net/browse/SV-8780) | Sales By Customer gated by its own permission |  |
| [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | PDF download fails, 5 of the 6 reports |  |
| [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Parts Velocity Turns / Yr overstated | **CLOSED** |
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | Inventory Value as-of date off by one day |  |
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | Invoice from a completed work order errors | **CLOSED** |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | Customer save errors instead of validating | **CLOSED** |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | Inventory Value file: money as text, columns ignored |  |
| [SV-8879](https://shopview.atlassian.net/browse/SV-8879) | Location chooser shown to a one-location user |  |
| [SV-8880](https://shopview.atlassian.net/browse/SV-8880) | Sales By Representative file missing 4 columns |  |
| [SV-8881](https://shopview.atlassian.net/browse/SV-8881) | Tech Utilization menu drops the word Download |  |
| [SV-8907](https://shopview.atlassian.net/browse/SV-8907) | Work In Progress download fails when rows exist |  |
| [SV-8908](https://shopview.atlassian.net/browse/SV-8908) | Work In Progress Asset filter misses a shared unit number |  |
| [SV-8925](https://shopview.atlassian.net/browse/SV-8925) | Customer and Rep files export numbers as text |  |
| [SV-8926](https://shopview.atlassian.net/browse/SV-8926) | Inventory Value totals row says Totals, not Total |  |
| [SV-8927](https://shopview.atlassian.net/browse/SV-8927) | Inventory Value opens with Margin and Total Sell on |  |
| [SV-8928](https://shopview.atlassian.net/browse/SV-8928) | Inventory Value forgets the part search text |  |
| [SV-8929](https://shopview.atlassian.net/browse/SV-8929) | Inventory Value keeps a deleted category, opens empty |  |
| [SV-8930](https://shopview.atlassian.net/browse/SV-8930) | Inventory Value empty table with no message |  |
| [SV-8931](https://shopview.atlassian.net/browse/SV-8931) | Inventory Value opens on All locations |  |
| [SV-8932](https://shopview.atlassian.net/browse/SV-8932) | Inventory Value: no shortening, sort not announced |  |
| [SV-8934](https://shopview.atlassian.net/browse/SV-8934) | Parts Velocity PDF does not shorten long text |  |
| [SV-8935](https://shopview.atlassian.net/browse/SV-8935) | Parts Velocity file writes Last Sale as words |  |
| [SV-8936](https://shopview.atlassian.net/browse/SV-8936) | Parts Velocity download message names nothing |  |
| [SV-8937](https://shopview.atlassian.net/browse/SV-8937) | PDF heading end date a day late, 3 reports |  |
| [SV-8938](https://shopview.atlassian.net/browse/SV-8938) | Parts Velocity Location column sixth, not first |  |
| [SV-8939](https://shopview.atlassian.net/browse/SV-8939) | Parts Velocity opens on All locations |  |
| [SV-8940](https://shopview.atlassian.net/browse/SV-8940) | Parts Velocity never shortens long text |  |
| [SV-8943](https://shopview.atlassian.net/browse/SV-8943) | Tech Utilization opens on All locations |  |
| [SV-8944](https://shopview.atlassian.net/browse/SV-8944) | Tech Utilization hours do not match Timesheets |  |
| [SV-8945](https://shopview.atlassian.net/browse/SV-8945) | Tech Utilization sort reloads from the server |  |
| [SV-8946](https://shopview.atlassian.net/browse/SV-8946) | Tech Utilization filter reloads from the server |  |
| [SV-8947](https://shopview.atlassian.net/browse/SV-8947) | Tech Utilization filter labels differ from the spec |  |
| [SV-8948](https://shopview.atlassian.net/browse/SV-8948) | Tech Utilization downloads ignore the filter |  |
| [SV-8949](https://shopview.atlassian.net/browse/SV-8949) | Tech Utilization downloads not in name order |  |
| [SV-8950](https://shopview.atlassian.net/browse/SV-8950) | Tech Utilization downloads omit the Summary row |  |
| [SV-8951](https://shopview.atlassian.net/browse/SV-8951) | Tech Utilization Expanded file: per-day rows, wrong names |  |
| [SV-8952](https://shopview.atlassian.net/browse/SV-8952) | Tech Utilization download messages generic or silent |  |
| [SV-8953](https://shopview.atlassian.net/browse/SV-8953) | Tech Utilization expand controls not announced |  |
| [SV-8954](https://shopview.atlassian.net/browse/SV-8954) | Tech Utilization Location column vanishes for good |  |
| [SV-8955](https://shopview.atlassian.net/browse/SV-8955) | Sales By Customer link carries no date range |  |
| [SV-8956](https://shopview.atlassian.net/browse/SV-8956) | Sales By Customer file names omit the date range |  |
| [SV-8962](https://shopview.atlassian.net/browse/SV-8962) | Sales By Customer filter: no search icon, wrong label |  |
| [SV-8963](https://shopview.atlassian.net/browse/SV-8963) | Sales By Customer: Location unsortable, blanks misplaced |  |
| [SV-8964](https://shopview.atlassian.net/browse/SV-8964) | Sales By Customer Expanded PDF on A3 |  |
| [SV-8965](https://shopview.atlassian.net/browse/SV-8965) | Sales By Customer row colours, padding, no indent |  |
| [SV-8966](https://shopview.atlassian.net/browse/SV-8966) | Sales By Customer saved view keeps dead filters |  |
| [SV-8967](https://shopview.atlassian.net/browse/SV-8967) | Work In Progress WO number never a link |  |
| [SV-8968](https://shopview.atlassian.net/browse/SV-8968) | Work In Progress filters reload from the server |  |
| [SV-8969](https://shopview.atlassian.net/browse/SV-8969) | Work In Progress: early Clear, no All advisors |  |
| [SV-8970](https://shopview.atlassian.net/browse/SV-8970) | Work In Progress table blue-grey, not white |  |
| [SV-8972](https://shopview.atlassian.net/browse/SV-8972) | Rep Expanded file: column order and heading wrong |  |
| [SV-8973](https://shopview.atlassian.net/browse/SV-8973) | Rep empty-state wording differs |  |
| [SV-8974](https://shopview.atlassian.net/browse/SV-8974) | Rep same-day invoices not in number order |  |
| [SV-8975](https://shopview.atlassian.net/browse/SV-8975) | Rep: three icon buttons announce the wrong name |  |
| [SV-8976](https://shopview.atlassian.net/browse/SV-8976) | Rep stale saved date range leaves it empty |  |
| [SV-8977](https://shopview.atlassian.net/browse/SV-8977) | Rep heading and Totals rows scroll away |  |
| [SV-8978](https://shopview.atlassian.net/browse/SV-8978) | Rep on a phone has no totals bar |  |
| [SV-8979](https://shopview.atlassian.net/browse/SV-8979) | Rep chevrons half the touch size |  |
| [SV-8980](https://shopview.atlassian.net/browse/SV-8980) | Rep table grey, title and filter out of line |  |
| [SV-8981](https://shopview.atlassian.net/browse/SV-8981) | Rep Expanded PDF one flat table, on A3 |  |
| [SV-8982](https://shopview.atlassian.net/browse/SV-8982) | Rep file names carry an extra date word |  |
| [SV-8983](https://shopview.atlassian.net/browse/SV-8983) | Rep Assignments file missing the UTF-8 marker |  |
| [SV-8987](https://shopview.atlassian.net/browse/SV-8987) | Work In Progress Last Activity left-aligned |  |
| [SV-8988](https://shopview.atlassian.net/browse/SV-8988) | Work In Progress Estimates figure not muted |  |
| [SV-8989](https://shopview.atlassian.net/browse/SV-8989) | Work In Progress Inv. Hrs two decimals |  |

## Filters — 7 tickets (epic SV-8785)

| Ticket | What it is | Closed? |
|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | Filter bar shares the tab row | **CLOSED** |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Page search stopped working | **CLOSED** |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | Phone: shared filter link lists the wrong work orders |  |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | Phone: no Clear Filters button |  |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | Empty screen offers Clear Filters after a page search | **CLOSED** |
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | Restored filter button loses its value name |  |
| [SV-8912](https://shopview.atlassian.net/browse/SV-8912) | Phone: no page search, magnifier opens global search |  |

## Schedule — 20 tickets (epic SV-8685)

| Ticket | What it is | Closed? |
|---|---|---|
| [SV-8848](https://shopview.atlassian.net/browse/SV-8848) | Every time shown six hours late |  |
| [SV-8849](https://shopview.atlassian.net/browse/SV-8849) | Series shift cannot be opened in Week view |  |
| [SV-8850](https://shopview.atlassian.net/browse/SV-8850) | '+N more' opens an empty box |  |
| [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | Tech Hours option changes nothing |  |
| [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | Clash warning with no way to fix it |  |
| [SV-8853](https://shopview.atlassian.net/browse/SV-8853) | Escape and Enter dead on confirm windows |  |
| [SV-8854](https://shopview.atlassian.net/browse/SV-8854) | User without WO permission reads the WO list |  |
| [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | Spread window has no start date |  |
| [SV-8856](https://shopview.atlassian.net/browse/SV-8856) | Day-view sideways drag jumps a whole hour |  |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | Sidebar filters: no Clear all, no count |  |
| [SV-8886](https://shopview.atlassian.net/browse/SV-8886) | Scope picker: no Select all, no Cancel |  |
| [SV-8902](https://shopview.atlassian.net/browse/SV-8902) | Our own disposable probe, not a defect | **CLOSED** |
| [SV-8923](https://shopview.atlassian.net/browse/SV-8923) | Business Hours switch shades nothing - withdrawn by us | **CLOSED** |
| [SV-8924](https://shopview.atlassian.net/browse/SV-8924) | Assigning an unassigned job moves its start 6 h earlier |  |
| [SV-8933](https://shopview.atlassian.net/browse/SV-8933) | Working hours will not open for other-location staff |  |
| [SV-8941](https://shopview.atlassian.net/browse/SV-8941) | Month view shows the VIN |  |
| [SV-8942](https://shopview.atlassian.net/browse/SV-8942) | At 960px the page scrolls sideways |  |
| [SV-8957](https://shopview.atlassian.net/browse/SV-8957) | Click alternative to dragging has gone |  |
| [SV-8958](https://shopview.atlassian.net/browse/SV-8958) | Month series bar does not name the technician |  |
| [SV-8959](https://shopview.atlassian.net/browse/SV-8959) | Tooltip clash warning in the wrong place |  |

**Excluded, and why:** [SV-8910](https://shopview.atlassian.net/browse/SV-8910) — created under our
shared account but whose work it is has never been confirmed, so you asked for it to be left out
until that is settled; its description has **not** been corrected. That is the only exclusion. One
further note on the counting: [SV-8871](https://shopview.atlassian.net/browse/SV-8871) surfaces in
both the Report Suite and the Filters sweeps because both look at everything this account created —
it belongs to a Filters story and is counted once, under Filters.

---

# LIST B — every ticket of ours that is a Bug **right now**

**13 tickets.** Read live today, because two of them stopped being Bugs while this was being
prepared: [SV-8845](https://shopview.atlassian.net/browse/SV-8845) was converted by Ahtasham Amjad
and [SV-8848](https://shopview.atlassian.net/browse/SV-8848) by Ayesha Khan, both at about 09:20
this morning. Any stored list would still call them Bugs.

Open ones first. Priority is `Low` on all thirteen except the one noted.

| Ticket | What it is | Status | Parent | Priority |
|---|---|---|---|---|
| [SV-8736](https://shopview.atlassian.net/browse/SV-8736) | Purchase order total off by 1 cent between two screens | Ready to Fix | *none* | Medium |
| [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | PDF download fails, 5 of the 6 reports | Ready to Fix | SV-8582 (Epic) | Low |
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | Inventory Value as-of date off by one day | Ready to Fix | SV-8582 (Epic) | Low |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | Inventory Value file: money as text, columns ignored | Ready to Fix | SV-8582 (Epic) | Low |
| [SV-8879](https://shopview.atlassian.net/browse/SV-8879) | Location chooser shown to a one-location user | Open | SV-8582 (Epic) | Low |
| [SV-8880](https://shopview.atlassian.net/browse/SV-8880) | Sales By Representative file missing 4 columns | Open | SV-8582 (Epic) | Low |
| [SV-8881](https://shopview.atlassian.net/browse/SV-8881) | Tech Utilization menu drops the word Download | Open | SV-8582 (Epic) | Low |
| [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Parts Velocity Turns / Yr overstated | Done | SV-8582 (Epic) | Low |
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | Invoice from a completed work order errors | OBSOLETE | *none* | Low |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | Customer save errors instead of validating | OBSOLETE | *none* | Low |
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | Filter bar shares the tab row | OBSOLETE | *none* | Low |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Page search stopped working | OBSOLETE | *none* | Low |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | Empty screen offers Clear Filters after a page search | OBSOLETE | *none* | Low |

## Three things that change what you do with this list

**1. Five of them are the ones that should become a Story Defect — not eight.** The audit this
morning named eight; two have been converted by other people since, so six are left, and one of
those is better left alone. Verified live, with the target story checked as a real level-0 story
under epic SV-8582:

| Ticket | Convert to a Story Defect under | How sure |
|---|---|---|
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | SV-8672 — Inv Value Story 5, As-Of Date and History | confident |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | SV-8677 — Inv Value Story 10, Export to PDF and CSV | confident |
| [SV-8880](https://shopview.atlassian.net/browse/SV-8880) | SV-8631 — SBR Story 14, PDF and CSV exports | confident |
| [SV-8881](https://shopview.atlassian.net/browse/SV-8881) | SV-8654 — Tech Util Story 7, Export to PDF and CSV | confident |
| [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | SV-8591 — the shared export story | a judgement, not a lookup — the fault is in shared code and hits 5 reports |

[SV-8879](https://shopview.atlassian.net/browse/SV-8879) is **recommended to stay a Bug**: it is on
all six reports and every report has its own location story, so no single story owns it. The two
that needed asking about no longer do — [SV-8845](https://shopview.atlassian.net/browse/SV-8845) is
now a Story Defect under SV-8797, and [SV-8848](https://shopview.atlassian.net/browse/SV-8848),
whose parent Mudassir Qamar had deliberately removed, is now a Story Defect under SV-8686.

**2. Six of the thirteen are closed** — SV-8819, SV-8821, SV-8822, SV-8843, SV-8844 and SV-8847.
Converting a closed ticket changes nothing anybody will act on, so they are not worth the clicks.

Five of those six now show **no parent**, and that is recent: SV-8843, SV-8844 and SV-8847 had their
epic parent taken off at about 09:25 this morning and SV-8821 at 03:05, all under this shared
account, so somebody was tidying closed tickets off the epics. SV-8822 never had one. We have not
put any of them back — undoing another person's change is not ours to do.

**3. We cannot do the conversion — it is clicks in Jira, not something the API allows.** Sending it
as a change request returns an error: *"Issues with this Issue Type must be created in the same
project as the parent."* The only route is the web page's **Change work type** wizard, which changes
the type and moves the parent in one action. So this list is a list of clicks for you.

## The honest trade-off, measured live today

Converting takes a ticket **off the epic's own list of children**: asking Jira for the epic's
children returns **7 of our 12 Bugs and 0 of our 80 Story Defects**. So you gain consistency and
per-story visibility, and you lose epic-level visibility and the Product Area value — all 80 of our
Story Defects read Product Area empty, while all 12 Bugs still carry one.

## "Since the last 1.5 weeks" — and one ticket that was missing from our lists

**No Bug of ours falls outside that window.** The oldest is
[SV-8736](https://shopview.atlassian.net/browse/SV-8736), filed 28 July; the rest were filed on 4
and 5 August.

**[SV-8736](https://shopview.atlassian.net/browse/SV-8736) was not in any of our ticket lists** and
is in the list above for the first time. It is ours — we drafted it and filed it on 28 July during
the purchase-order rounding side job, and our own committed draft records the filing. It sits
outside all three report projects, which is why the sweep of those projects never saw it. Three
things about it need your decision: it has **no parent**, its priority is **Medium** (it predates the
rule that we always file at Low), and its description has **not** been rewritten into the five-part
shape, because it was never in the list of 92.

Three other Bugs came up in the sweep of everything created under this account since 20 July —
SV-8443, SV-8449 and SV-8682. **None is ours:** each is written in your own bug-report style, and
our records only ever refer to SV-8443 and SV-8682 as tickets we read while triaging. They are not
in the list.

---

## How this was checked

- All 92 of List A read live, HTTP 200 on every one, and their descriptions checked for the five
  parts: **91 of 92 carry all five**. The one exception is
  [SV-8902](https://shopview.atlassian.net/browse/SV-8902), our own throwaway probe, which was
  deliberately left out of the shape and recorded as such at the time.
- The counts in the file this list came from were re-derived from its own tables and agree: 65 + 7 +
  20 = 92.
- Every Bug in List B was read live, not taken from a file, and the two conversions and four parent
  removals that happened today were confirmed in each ticket's own history.
- **Nothing was written.** No Jira change, no TestRail call.


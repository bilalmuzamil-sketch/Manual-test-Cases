# FINDINGS — Report Suite VIU, 2026-08-06 second session

Read `SOURCE-CURRENCY.md`, then `SPEC-DIFF.md`, then this file, then `RECHECK-QUEUE.md`.

# 1 · THE HONEST HEADLINE

**Sales By Customer and Work In Progress were driven live. Sales By Representative was not driven at
all.** Nine defects were filed, two of them against requirements Chris Ward wrote on 5 August that
nobody had ever checked against the running build.

| | Count |
|---|---|
| Our cases under group 4281 | **476** |
| Cases this session touched | **82** |
| `update_case` operations | **156** |
| Cases with a verdict established live **this session** | **69** |
| Cases repaired but deliberately **not** re-verdicted | **13** |
| Defects filed | **9** |
| **Cases still without a verdict on any 6 August build** | **188** |

**This pass did NOT complete the 250 outstanding cases and does not claim to.** It completed **Sales By
Customer's 58** and **24 of Work In Progress's 66**, and left **Sales By Representative's 109
untouched**. That is the plain arithmetic; nothing below softens it.

# 2 · THE BUILD MOVED EIGHT MINUTES INTO THE PASS, AND OUR FIRST STAMP WAS WRONG

| Read at | app-version | last-modified |
|---|---|---|
| 08:24:28Z | `v3.5-16cf83f` | Wed, 05 Aug 2026 06:40:32 GMT |
| **09:25:03Z** | **`v3.5-7168d14`** | **Thu, 06 Aug 2026 08:32:37 GMT** |

The redeploy landed at **08:32:37Z**. Every live drive ran from about 08:33Z to 09:20Z, so the
observations belong to **`v3.5-7168d14`** — not to the marker read at the start, which is what 45 cases
had already been stamped with.

**Caught by the Rule-59 end-of-pass re-read and corrected: all 69 build lines this pass wrote were
re-stamped to `v3.5-7168d14`, byte-verified.** Honest residue: the very first capture of the Sales By
Customer page structure (about 08:26–08:29Z) preceded the deploy; no verdict rests on it alone.

**Rule 59's lesson fired for the second day running.** A start read and an end read are the minimum on a
branch that redeploys daily.

# 3 · SALES BY CUSTOMER — all 58 outstanding cases adjudicated

45 written. **26 PASS · 11 EXPECT-FAIL · 7 HOLD**, plus three cases repaired by removal.

## 3.1 · The five defects filed, both texts side by side

| Case | What the DOCUMENT requires (verbatim) | What the build does | Ticket |
|---|---|---|---|
| [C30112](https://shopview.testrail.io/index.php?/cases/view/30112) · [C30116](https://shopview.testrail.io/index.php?/cases/view/30116) | **S18-R2** "The control carries a search (magnifier) icon marking it as searchable." · **S18-R5** "…'N selected' when more than one customer is selected… While the user is typing a search query in the filter, the field shows the query text instead of the summary label." | the only icon is `arrow_drop_down`; two picked reads **"2 customers"**; while typing the closed control still reads **"All customers"**, the search box being a separate element outside the field | [SV-8962](https://shopview.atlassian.net/browse/SV-8962) |
| [C30142](https://shopview.testrail.io/index.php?/cases/view/30142) · [C30144](https://shopview.testrail.io/index.php?/cases/view/30144) | **S10-R1** "Every column is sortable except the chevron column." · **S10-R3** "A missing value sorts to the bottom in ascending order and to the top in descending order" | **Location has no sort arrow and does not respond**, though the server sorts by it happily (HTTP 200 for `sortBy=location`); Margin % ascending puts the **19 blank rows FIRST** and descending puts them last — **exactly inverted** | [SV-8963](https://shopview.atlassian.net/browse/SV-8963) |
| [C30166](https://shopview.testrail.io/index.php?/cases/view/30166) | **S15-R7** "The PDF is A4 landscape with 25px margins on all sides" | the **Expanded View PDF is A3 landscape (1190.55 × 841.89 pts)**. The Summary PDF from the same menu, same filters, same moment is correctly A4 (841.89 × 595.28) | [SV-8964](https://shopview.atlassian.net/browse/SV-8964) |
| [C30185](https://shopview.testrail.io/index.php?/cases/view/30185) · [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) | **S20-R8** headers and customer rows "use the white surface (#ffffff)" · **S20-R9** asset and invoice rows "#f9fafb" · **S20-R10** totals row white · **S20-R12** "2rem of left padding" · **S20-R14** "invoice rows are indented one level deeper" | headers, customer rows and totals row all `rgb(249,250,251)`; asset **and** invoice rows `rgb(238,241,245)`, a third colour in no requirement; outer padding **14.28px**; an invoice number starts at the **same** left edge as a customer name | [SV-8965](https://shopview.atlassian.net/browse/SV-8965) |
| [C30176](https://shopview.testrail.io/index.php?/cases/view/30176) | **S6-R5** "any saved value that is no longer valid is discarded, and that setting uses its default instead" · **S6-R6** names "an unknown date range, a location the user no longer has access to" · **S18-R9** a selected customer no longer present "is dropped from the selection" | an unknown date range leaves the control reading **"Select Date Range" with an empty report**; an unusable location and an unusable customer are both **kept**, each reading "1 selected" for something with no name. Product Type and the column set **do** fall back correctly | [SV-8966](https://shopview.atlassian.net/browse/SV-8966) |

## 3.2 · Three unsourced assertions repaired by REMOVAL, never by substituting the build

**[C30096](https://shopview.testrail.io/index.php?/cases/view/30096)** asserted the report is "listed in
the **Performance** group … BELOW the pre-existing entries". **The specification is silent on the
group** — `S1-R1` says only *"'Sales By Customer' appears in the Reports left-side navigation."* The
build puts it under a separate **SALES** group (Parts Velocity and Inventory Value under **PARTS**; only
Work In Progress, Technician Utilization and Sales By Representative under **PERFORMANCE**). The case now
asserts what the specification asserts and tells the tester to record the group heading and not fail on
it. **It was NOT rewritten to say "SALES"** — that would be inventing a requirement from the build.

**[C30114](https://shopview.testrail.io/index.php?/cases/view/30114)** asserted that after "Clear all"
"the totals row shows zeros". **No requirement says what the totals row does when nothing matches** —
and the build shows **no totals row at all**. Claim removed; tester asked to record what they see.

**[C30173](https://shopview.testrail.io/index.php?/cases/view/30173)** asserted a no-match download
carries "a totals row of zeros". Same absence of a source; the download carries **headers and nothing
else**, confirmed. Same repair.

All three questions went to Chris (`QUESTIONS-FOR-CHRIS.md`) rather than being decided from the build
(Rule 58).

## 3.3 · Verified by arithmetic, not by eye

- **Server pagination and server totals**: `rowsNumber = 384` against `rowsPerPage = 30`, and `totals`
  covers all 384 customers (C30155, C30193).
- **The tree reconciles**: Aacastle Services $497.08 = its one asset $497.08 = its two invoices
  $248.54 + $248.54 (C30153).
- **Date sort is by most recent invoice**: descending gives Aadale Motors `2026-08-04T09:12:57Z`,
  Aacrest Works `…09:12:36Z`, Aacastle Services `…09:12:32Z` — monotonic on `last_invoice_date` even
  though the Date cell is blank on customer rows, which is what `S10-R5` asks (C30145).
- **One browser key settles five cases**: `report_view:sales-by-customer` holds exactly dateRange,
  locationIds, sortBy, descending, columns, productType, customerAll, customerIds — so what IS saved
  (C30174), what is NOT (C30175: no search text, no expansion, no scroll), that it is per report
  (C30177), the no-saved-view defaults (C30178) and the customer shape (C30180) are all answered at once.
- **The 366-day cap is enforced**: 367 days → HTTP 400 *"Date range cannot exceed 366 days."*; exactly
  366 → HTTP 200.

## 3.4 · Four candidates DISPROVEN before anything was filed

**(a) The Customer sort is NOT broken.** Two header clicks both reported `ascending` with rows unmoved —
which reads exactly like a broken toggle. Driving the report's own request showed
`sortBy=customer&descending=false` → Aaborough→Bivale and `descending=true` → Zuwood→Xihaven. **The
click had not landed: a harness artefact, not a defect.**

**(b) "No results" in the Customer type-ahead is CORRECT.** `Aagate` returns nothing in This Month
because `S18-R2` scopes the list "to the active date range, Product Type, and location" and that
customer has no invoices then. This Year returns it at once. **PASS.**

**(c) The empty-state message is in the right place.** Its DOM parent is `q-table__bottom`, which reads
like a breach of `S17-R3` — but the screenshot shows it centred in the empty table area below the
headers, and `S17-R3`'s own negative list is "not in the toolbar, the totals row, or a modal". It is in
none of those. **PASS on the substance, not on a DOM path.**

**(d) The page background is not a defect.** `S20-R2`: "The page background is the application's
standard blue-grey (**#f9fafb** in light mode)". The background is right; it is the **rows** that should
have been white on top of it — which is what SV-8965 says.

## 3.5 · Reported, not filed

**The PDF heading date is one day late here too, and the spreadsheet is not.** The Summary PDF for
1–6 August heads *"Date Range: Aug 1, 2026 – Aug 7, 2026"*; the CSV for the same view heads
*"…Aug 6, 2026"* — correct. That narrows [SV-8937](https://shopview.atlassian.net/browse/SV-8937)'s
mechanism: **the fault is the PDF renderer, not the range.** SV-8937 was **not edited** — the QA lead is
retrofitting tickets in one pass.

**The PDF heading joins the dates with an EN dash (U+2013) where `S15-R11` asks for an em dash.** Too
small for its own ticket and it sits on the same line as the fault above.

## 3.6 · A CORRECTION TO OUR OWN TICKET SV-8956, worth a developer's minute

[SV-8956](https://shopview.atlassian.net/browse/SV-8956) says the downloads "leave out the date range" in
their file names. **The user-visible outcome is right; the cause is not where a developer would look.**
The **server sends the correct name** — `filename=sales-by-customer-summary-this_month.csv`,
`…-last_month.csv`, `…-this_year.csv`, `…-custom.csv`, varying correctly with the range. But the front
end fetches the export into a **blob** and triggers the download with its **own** name, discarding
`content-disposition`. The file lands as `sales-by-customer-summary.csv`.

**So the fix belongs in the front end and the back end needs no change.** Not added to the ticket, to
avoid colliding with the retrofit pass.

# 4 · WORK IN PROGRESS — 24 of 66 adjudicated, and Chris's new requirements fail

## 4.1 · The four defects filed

| Case(s) | What the DOCUMENT requires (verbatim) | What the build does | Ticket |
|---|---|---|---|
| [C30468](https://shopview.testrail.io/index.php?/cases/view/30468) · [C43557](https://shopview.testrail.io/index.php?/cases/view/43557) · [C30523](https://shopview.testrail.io/index.php?/cases/view/30523) | **S4-R5** (rewritten 5 Aug) "WO # is shown as a link … **only when the user has permission to access Work Orders**" | **plain text for everyone**, including an administrator holding `workOrdersView`: a `<span>`, no href, black, cursor `auto`, clicking does nothing, **zero anchors in the whole table** | [SV-8967](https://shopview.atlassian.net/browse/SV-8967) |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) · [C30505](https://shopview.testrail.io/index.php?/cases/view/30505) | **S7-R1/R2/R4** (rewritten 5 Aug) "the report loads the complete set of open jobs in one request … narrows the visible jobs … **on screen only (no reload)**" | every filter change sends a fresh request; the tab request carries `advisors=…&customers=…`; and the response is **paginated at 30 of 115**, so the complete set is not loaded in one request either | [SV-8968](https://shopview.atlassian.net/browse/SV-8968) |
| [C30499](https://shopview.testrail.io/index.php?/cases/view/30499) | **S7-R3/R5** "the filter offers a single 'Clear' action … **shown only once at least one** customer is selected" | `Clear all` is offered **before anything is selected**, on all three filters; and the **Advisor filter has no "All advisors" item** while Customer and Asset both have theirs | [SV-8969](https://shopview.atlassian.net/browse/SV-8969) |
| [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) | **S10-R1** "Each tab uses an **all-white** table: white column headers and white data cells, with no alternating row shading" | headings, data rows and totals row are all `rgb(249,250,251)`. There is correctly no alternating shading | [SV-8970](https://shopview.atlassian.net/browse/SV-8970) |

**SV-8967 and SV-8968 matter most in this pass**: they are the first live check of requirements the
product owner wrote yesterday, and both fail.

## 4.2 · What PASSES on Work In Progress, verified rather than assumed

- **The summary strip is exactly right** — seven figures in `S5-R1`'s order: Total Earned, Total
  Remaining, Not Started, Started — Earned, Started — Remaining, Ready to Invoice, Estimates.
- **Its arithmetic reconciles to the cent**: Total Earned `$254.69` = Started—Earned `$164.69` + Ready to
  Invoice `$90.00` (C30488); Total Remaining `$2,755.15` = Not Started `$1,549.84` + Started—Remaining
  `$1,205.31` (C30489).
- **Every information icon is genuinely accessible** — `tabindex="0"`, `role="button"` and a full
  plain-English `aria-label`, e.g. *"Total Earned: Work you have already done but have not billed yet —
  the money waiting to be collected."* (C30493, C30524).
- **The Totals row** is labelled `Totals`, sits at the bottom, is bold, and sums the visible rows
  exactly: `$10.00 + $0.00 + $129.69 + $25.00 = $164.69` (C30494, C30495).
- **Four tabs in order with counts** — Approved - Partially Completed (4), Approved - Not Started (4),
  Completed (2), Estimates (65) — first selected by default, **no on-screen status filter**, **no Trend
  tab** (C30452, C30455).
- **The Asset cell is right, including both placeholders**: `(no unit #) 12345` and `123 — no VIN —`
  (C30470).
- **Days Open is deliberately ungrammatical and correct**: `1 days`, `0 days` (C30472).
- **The initial sort is Days Open descending**, sent as `sortBy=days_open&descending=true` on the very
  first request (C30483).
- **`earned = labor_earned + parts_earned` and `total = earned + remaining`** in the payload (C30479).
- **The export menu wording matches `S9-R1` exactly**: `Download (PDF)` and `Download (CSV)`.

## 4.3 · The 12 raw-markup cases are fixed — they were showing HTML to the tester

**C30451, C30456, C30457, C30460, C30487, C30490, C30491, C30493, C30519, C30522, C30526, C30528** stored
all three text fields as raw `<ol>`/`<li>` with `<hr />` and `<p>AUTOMATION: …</p>`. This project renders
that markup **literally to the manual tester**, so all 12 were unreadable, **had no parseable provenance
line**, and **their marker was not last**.

All 12 converted to plain numbered text. **Formatting only — not one word of meaning changed, and the
build line was preserved verbatim** (`v3.4.1-3d03023` on 8/4/2026), because those cases were **not**
re-observed and stamping today's build would have been a false claim.

**Consequence: the marker count is now 476 of 476.** Before this, 12 cases had no machine-findable marker
at all, so the ready-to-automate figure was unprovable.

# 5 · SALES BY REPRESENTATIVE — NOT DRIVEN. 109 cases untouched.

Stated plainly, not buried: **the largest single block of outstanding work was not reached.** Its 109
cases keep the markers and `v3.4.1-3d03023` build lines they had, which say so on themselves. They are
not re-check rows — under Rule 60 an older build line is an honest record, not a defect. They are the
next pass's work.

# 6 · PROOFS

- **156 `update_case` operations over 82 distinct cases**, every one **HTTP 200 + re-GET and
  byte-compared, 30 fields each, 0 mismatches, 0 collateral**. **All three text fields sent on every
  payload**, so the omit-field re-render (playbook §J normalisation #3) never fired — the final census
  confirms **0 of 476 carry raw markup or CRLF**.
- **0 add · 0 delete · 0 section · 0 run writes · 0 results logged anywhere.**
- **394 untouched cases proven byte-identical BY CONTENT** — every field including `updated_on` and
  `updated_by`, 0 differences.
- **Foreign C38919–C38923 proven byte-identical BY CONTENT** — never touched (Rule 38), proven by
  content rather than by `updated_on` alone.
- **Run 359 proven untouched**: `include_all` still **false**, **476 tests**, case_id sets **equal in both
  directions** with our 476, **535 result records** — the same 535 the first session recorded — **0 new
  results**, counters 6 passed / 470 untested. *(The 4 cases C43550–C43553 the first session recorded as
  absent from the run are now present, so run and suite are in sync; we made no run writes.)*
- **Final census over all 476: exactly one provenance line, one `AUTOMATION:` marker, marker last, no raw
  markup, no barred phrase — 0 problems.** Run because a byte-check proves you wrote what you intended,
  not that the intent was right (the C30341 lesson).
- **Markers: 357 READY + 77 READY-EXPECT-FAIL + 42 HOLD = 476. Gate: 357 + 77 = 434 = 476 − 42. PASSES.**
- **All 9 tickets: 11 field checks read back from Jira each, ALL PASS** — `Story Defect` (10007), parent =
  the owning **story**, priority **Low**, `relates to` link, no Product Area, Open, 7-section body, and a
  **source block** naming the specification with its **Confluence** version.
- **Duplicate-searched before filing** with 7 separate JQL queries; nothing matched any of the nine.

# 7 · CORRECTIONS TO OUR OWN RECORD — both in our favour, both fixed rather than repeated

## 7.1 · The export row cap IS documented, in three of the six specifications

`FINDINGS.md` and `FILED.md` from the first session both assert that **none** of the six specifications
mentions the ~10,000-row export cap. **That is wrong.** Verified independently against the live bodies:
**SBC v15 documents it twice (S14-R16, S15-R25)**, **SBR v17 documents it (S14-E2)**, **IV v4 documents it
including the exact user-facing message (S10-R12)**. Only **PV v5, TU v6 and WIP v9** are silent.

The old claim is left standing in those files with this correction cross-referenced, because a wrong claim
we made and then fixed is part of the record. Full table in `SPEC-DIFF.md` §8. The question to Chris is
the **narrow** one: add it to the three that omit it.

## 7.2 · The build marker we stamped on 45 cases was already superseded when we stamped it

Section 2. **Corrected on all 69, byte-verified.** Recorded rather than quietly overwritten.

# 8 · WHAT I DID NOT DO, AND WHY

- **Sales By Representative: 109 cases, not driven.** Ran out of session.
- **42 of Work In Progress's 66: not driven.** Same reason.
- **The second test login: NOT obtained, though the QA lead authorised unblocking it.** The honest
  reason: `switch-user` and `quick-login` both rotate the one shared `sv_sso_session` on this estate, so
  it had to be the **last** live action — and the session ran out on the deliverables first. **17
  permission cases remain unobserved because of this.** It is the highest-value thing the next pass can
  do and it needs no new access, only a window when no sibling worker is live on `.qa.shopview.com`.
- **The `refs` spec versions were not updated.** **432 of 476 cases name a stale spec version in `refs`**
  — IV v3 (64), PV v4 (61), SBC v13 (78), SBR v15 (105), TU v5 (57), WIP v6 (67). Rule 42 depends on that
  version pin to connect a closed list to the requirement that invalidates it, so this is a real gap. A
  432-case metadata sweep, out of scope here. **Flagged, not fixed.**
- **Two tester-facing provenance lines still name the wrong spec version** — one Parts Velocity case with
  no version at all, one Sales By Customer case reading **v9** against a live v15. Two writes, not done.
- **No already-filed ticket was edited.** The QA lead is retrofitting source blocks in one pass and a
  second writer would collide. Three factual improvements are owed and written up here instead: SV-8956's
  real cause (§3.6), SV-8937's PDF-only mechanism (§3.5), and SV-8937's scope.

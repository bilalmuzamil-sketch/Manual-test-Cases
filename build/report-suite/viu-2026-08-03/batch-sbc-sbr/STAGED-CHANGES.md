# Staged changes — Sales By Customer + Sales By Representative (2026-08-04)

> **NOTHING IN THIS FILE HAS BEEN PUSHED.** No TestRail write of any kind was made during this
> pass (Standing Rule 6). Every item below needs the QA lead's authorisation, and several need a
> PO ruling first. All of it is provisional against build `v3.4.1-0ed4433` observed 2026-08-04 (Rule 49).

## 0. Summary of what is being proposed

| Change | Cases | Needs |
|---|---:|---|
| **Add the Rule-49 non-final-build marker** to the notes field | **195** | QA lead go-ahead (mechanical, no wording risk) |
| **Add a missing spec anchor** to `refs` | **3** | QA lead go-ahead |
| **Rewrite a brittle closed enumeration** (Rule 42) | **27** | QA lead go-ahead |
| **Reword to match the build** (labels, counts, controls) | **9** | QA lead go-ahead; 2 also want a PO word |
| **Add the Rule-24 tester note** | **1** (`SBR-WO-04`) | QA lead go-ahead |
| **HOLD pending a build change or a PO ruling** | **8** | PO / dev — do not edit these yet |
| **Raise a dev ticket, leave the case alone** | **8** | QA lead to file |
| **New cases proposed** | **0** | see §5 for why |

## 1. Applies to every one of the 195 — the Rule-49 build marker

Every case in scope needs this appended to its **notes / metadata** field (never the
tester-facing fields, Rule 20):

```
VIU 2026-08-04: verdict observed live on QA branch sv8582, build v3.4.1-0ed4433. THE BRANCH WAS DECLARED
NOT FINAL, so this finding is PROVISIONAL and must be re-confirmed when the build settles
(Standing Rule 49). Re-check queue: build/report-suite/viu-2026-08-03/batch-sbc-sbr/RECHECK-ROWS.md
```

## 2. Missing spec anchors (Rule 20 — `refs` must carry ticket AND anchor)

| Case | C-id | Current `refs` | Problem |
|---|---|---|---|
| `SBC-EMPTY-04` | [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | `SV-8582 (SBC spec §7 User Feedback Summary — the data-fetch error toast; CROSS-CUTTING: the SBC spec carries no error-st…` | EDIT NEEDED — no spec anchor (Rule 20 requires ticket AND anchor) |
| `SBR-CALC-07` | [C30235](https://shopview.testrail.io/index.php?/cases/view/30235) | `SV-8593 (SBR spec §3 Key Decisions accounting parentheses — owned by the shared A5 report-shell formatter module: verbat…` | EDIT NEEDED — no spec anchor (Rule 20 requires ticket AND anchor) |
| `SBR-CALC-08` | [C30236](https://shopview.testrail.io/index.php?/cases/view/30236) | `SV-8582 (SBR spec §3 half-up rounding rule + round of unrounded rollups; CROSS-CUTTING display rule with no single ownin…` | EDIT NEEDED — no spec anchor (Rule 20 requires ticket AND anchor) |

Each cites a spec **section** in prose but no `Sn-Rn` anchor. All three are genuinely
cross-cutting display rules with no single owning story, so the honest fix is to cite the
owning section explicitly in anchor form rather than invent a requirement number — that needs
the QA lead's call on the convention.

## 3. Brittle closed enumerations to rewrite (Rule 42)

27 cases close a list with wording like "exactly". Each needs either a
version-pinned anchor in `refs` (`<TICKET> (<anchor>, spec v<N> <date>)`) or scope-conditional
wording. This is exactly the shape of the defect that made `SBR-EXP-10`/`SBR-EXP-11` wrong when
the Location column arrived.

| Case | C-id | The closing phrase |
|---|---|---|
| `SBC-CALC-05` | [C30153](https://shopview.testrail.io/index.php?/cases/view/30153) | 1. An asset's invoice subtotals sum exactly to that asset's row total. \|\| 2. A customer's asset subtotals sum exactly to the customer's row total.… |
| `SBC-CUST-05` | [C30116](https://shopview.testrail.io/index.php?/cases/view/30116) | 2. With exactly one customer selected the label shows that customer's name.… |
| `SBC-EXP-05` | [C30163](https://shopview.testrail.io/index.php?/cases/view/30163) | 1. Each export contains exactly the customers matching the active filters — the selected customers, within the active date range, Product Type, and lo… |
| `SBC-EXP-16` | [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | 1. The menu offers exactly four items: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CS… |
| `SBC-LINK-02` | [C30139](https://shopview.testrail.io/index.php?/cases/view/30139) | 2. Pressing back returns to the report with its filters, sort, and columns restored exactly as set.… |
| `SBC-LOC-03` | [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | 4. With "All locations" active you can tell which location each row's data belongs to — a location label or marking is shown. (Exactly where and how i… |
| `SBC-LOC-04` | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | 8. Every one of the four downloads also contains the Location column, in the same position it holds on screen, showing the same values you just read: … |
| `SBC-TREE-01` | [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | 1. The customer occupies exactly one summary row at the top level of the table.… |
| `SBC-TREE-10` | [C30130](https://shopview.testrail.io/index.php?/cases/view/30130) | 1. The single-invoice asset expands and shows exactly one invoice detail row.… |
| `SBC-TREE-12` | [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | 3. The customer/asset totals drop by exactly that invoice's amounts.… |
| `SBC-TYPE-02` | [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | 1. The dropdown offers exactly three options, in this order: "Parts & Service," "Parts only," "Service only" — with "Parts & Service" selected by defa… |
| `SBR-ASGN-02` | [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) | 3. The CSV starts with a UTF-8 BOM and its headers, in order, are exactly: Customer Name, Sales Representative, Rep is active?.… |
| `SBR-ASGN-03` | [C30294](https://shopview.testrail.io/index.php?/cases/view/30294) | 1. Every customer with an assigned sales representative produces exactly ONE row (single-rep model: one rep per customer).… |
| `SBR-CALC-06` | [C30234](https://shopview.testrail.io/index.php?/cases/view/30234) | 1. The labels read exactly: Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal.… |
| `SBR-EXP-01` | [C30276](https://shopview.testrail.io/index.php?/cases/view/30276) | 1. The menu lists exactly four actions: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", and "Download Expanded Vie… |
| `SBR-EXP-06` | [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) | 1. The files are named exactly "sales-by-representative-summary.pdf" and "sales-by-representative-expanded.pdf".… |
| `SBR-EXP-10` | [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | 2. With a single location in scope the headers, in order, are exactly: Sales Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. H… |
| `SBR-EXP-11` | [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | 2. With a single location in scope the headers, in order, are exactly: Sales Representative, Date, Invoice #, Customer, Status, Hrs Worked, Hrs Invoic… |
| `SBR-EXP-15` | [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) | 2. An error toast reads exactly: "This report is too large to export. Narrow the date range or filters, then try again." (persists 120 seconds or unti… |
| `SBR-LINK-03` | [C30249](https://shopview.testrail.io/index.php?/cases/view/30249) | 1. Back returns to the report with ALL state intact — date range, product type, invoice status, location, Show Unassigned, every rep's expansion state… |
| `SBR-LOC-03` | [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | 4. With "All Locations" active you can tell which location each row's data belongs to — a location label or marking is shown. (Exactly where and how i… |
| `SBR-ROW-01` | [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | 1. Rep A occupies exactly one summary row.… |
| `SBR-ROW-02` | [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | 5. Every row renders exactly the report's column count with blanks in position — a cell with nothing to show is blank, never shifted or wrapped (a dri… |
| `SBR-STAT-01` | [C30208](https://shopview.testrail.io/index.php?/cases/view/30208) | 2. It offers exactly four options: "All Statuses," "Unpaid," "Partially Paid," "Paid."… |
| `SBR-TOT-03` | [C30239](https://shopview.testrail.io/index.php?/cases/view/30239) | 1. A simplified external totals bar sits directly below the table, outside its horizontal scroll container, showing "Totals" on the left and the grand… |
| `SBR-TREE-07` | [C30223](https://shopview.testrail.io/index.php?/cases/view/30223) | 1. Every invoice appears under exactly one rep (the rep credited at invoicing time) or under the Unassigned row — never under two rows.… |
| `SBR-TYPE-02` | [C30206](https://shopview.testrail.io/index.php?/cases/view/30206) | 1. The dropdown offers exactly three options: "Parts & Service," "Parts only," "Service only" — with "Parts & Service" as the default on first load.… |

## 4. Per-case rewrites, holds and dev tickets

Current text first, then what I propose and why. Where I do **not** propose text, that is
deliberate — either the build is the wrong side of the argument, or there is no build wording to
write against yet.

### `SBC-DATE-01` — [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) — verdict **DEVIATION**

- CURRENT (expected 1): the date-range control "offers eleven options in the specified order".
- PROPOSED: "The date-range popup shows an inline calendar plus exactly nine quick choices, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. Below them a line reads 'Range: N days' and there is an Apply button. There is no 'Custom', 'Today' or 'Yesterday' choice."

### `SBC-DATE-03` — [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) — verdict **DEVIATION**

- CURRENT: opens a "Custom range" start/end dialog and enforces a 366-day maximum.
- PROPOSED: "Pick a start day and an end day directly on the calendar inside the popup (there is no 'Custom' button — the calendar is always there). The 'Range: N days' line counts the days you have picked. Press Apply. If you pick a span longer than the allowed maximum the report does not load and an error is shown."

### `SBC-DATE-04` — [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) — verdict **DEVIATION**

- CURRENT: "Changing the date range writes it into the page link for sharing."
- HOLD — no proposed text. The address bar never changes (it stays /reports/sales-by-customer); the setting is saved locally instead. Either the case is retired in favour of the persistence cases, or it waits for shareable links to be built. Needs the QA lead's call, not a silent reword.

### `SBC-PERS-06` — [C30179](https://shopview.testrail.io/index.php?/cases/view/30179) — verdict **DEVIATION**

- CURRENT: a saved view and a "page-link range" clash, and the saved view wins.
- HOLD — no proposed text. Same root cause as SBC-DATE-04: no range can be put in the page link, so the clash cannot arise. Retire or hold together with SBC-DATE-04.

### `SBC-EXP-04` — [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) — verdict **DEVIATION**

- CURRENT: "Margin % plain; dates mm-dd-yyyy; currency plain; no color".
- NO CASE CHANGE PROPOSED — the case is right and the build is wrong (spec S14-R9/R10/R11 quoted on the verdict row). Raise a dev ticket for the export formatter. The "no color" clause does pass.

### `SBC-SORT-01` — [C30142](https://shopview.testrail.io/index.php?/cases/view/30142) — verdict **DEVIATION**

- CURRENT: "All columns sortable except chevron; text alphabetical, numbers by value".
- NO CASE CHANGE PROPOSED — the case matches the spec; the build does not sort Customer, Location, Margin or Margin %. Raise a dev ticket. If the PO instead rules those four intentionally unsortable, the case becomes: "These eight columns sort: Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Subtotal."

### `SBC-EMPTY-01` — [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) — verdict **DEVIATION**

- CURRENT: an empty-state message shows in the table body.
- HOLD — the build shows no message at all, so there is no build wording to write the case against. Needs either the message to be built or the PO to confirm a bare empty table is intended.

### `SBC-EMPTY-02` — [C30182](https://shopview.testrail.io/index.php?/cases/view/30182) — verdict **DEVIATION**

- CURRENT: the empty-state message never appears while still loading.
- HOLD — depends entirely on SBC-EMPTY-01 being built first.

### `SBC-VIS-02` — [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) — verdict **DEVIATION**

- CURRENT: "Row surfaces alternate by tree level; header and totals rows stay white."
- PROPOSED (matches the build): "Every row in the table uses the same light background, and the Totals row uses that same background rather than white." — but confirm with the PO first, because this may be a styling gap rather than the intended design.

### `SBC-VIS-03` — [C30187](https://shopview.testrail.io/index.php?/cases/view/30187) — verdict **DEVIATION**

- CURRENT: dark mode darkens every surface while the PDF always renders light.
- NO CASE CHANGE PROPOSED — both clauses are right. The build has a real bug: in dark mode the Totals row keeps BLACK text on a near-black background. Raise a dev ticket; keep the case as the thing that catches it.

### `SBC-NAV-01` — [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) — verdict **DEVIATION**

- CURRENT: listed in the Performance group, below the pre-existing entries.
- PROPOSED (matches the build): "'Sales By Customer' is listed under the SALES heading in the reports side navigation." — but ASK the PO first: the spec says Performance, the build says SALES, and Chris's companion video described a new grouping, so this may be a deliberate regroup.

### `SBR-DATE-01` — [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) — verdict **DEVIATION**

- CURRENT: "offers the standard presets plus Custom".
- PROPOSED: same nine-preset wording as SBC-DATE-01 (the control is shared).

### `SBR-DATE-02` — [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) — verdict **DEVIATION**

- CURRENT: "A Custom range uses the date-picker and holds a 366-day maximum span".
- PROPOSED: same inline-calendar wording as SBC-DATE-03; keep the maximum-span clause, which is real.

### `SBR-ROW-02` — [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) — verdict **DEVIATION**

- CURRENT: "Row layout: 12 columns in order, blanks in position, bold summary rows".
- PROPOSED: "13 columns in order: Date, Invoice, Customer, Status, Location, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal (plus the expand arrow)." OUR case is the stale side here — the Location column was added by the 2026-07-29 ruling (S21-R7 / S14-R20) after this case was written.

### `SBR-EXP-10` — [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) — verdict **DEVIATION**

- CURRENT: enumerates the Summary CSV headers WITHOUT Location.
- TWO separate actions. (a) OUR case needs Location adding to the header list — it was added by S14-R20 on 2026-07-29 and the build has it. (b) The BUILD needs a dev ticket: four spec'd columns are missing from the file (# Invoices, # Customers, Hrs Worked, Hrs Invoiced) and it carries a Totals row S14-R15 says it should not have, and the first header reads "Representative" not "Sales Rep". Do not fold (b) into the case as if the build were right.

### `SBR-EXP-11` — [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) — verdict **DEVIATION**

- CURRENT: enumerates the Expanded CSV headers WITHOUT Location.
- TWO separate actions, same shape as SBR-EXP-10. (a) OUR case needs Location adding. (b) Dev ticket for the naming and ordering: "Representative" vs "Sales Rep", "Invoice Status" vs "Status", and Invoice # / Date swapped. The three hours columns ARE now present, so S14-R16's old build-note about one mislabelled hours column can be closed.

### `SBR-EXP-12` — [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) — verdict **DEVIATION**

- CURRENT: "CSV cells: plain numbers, signed Inv. Hrs, empty Margin %, (Inactive)".
- NO CASE CHANGE PROPOSED — same shared formatter bug as SBC-EXP-04 (one ticket covers both reports). Two clauses could not be exercised at all (signed Inv. Hrs, (Inactive)).

### `SBR-LOC-04` — [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) — verdict **DEVIATION**

- CURRENT (per Chris's ruling): the Location filter is HIDDEN for a one-location user.
- NO CASE CHANGE PROPOSED — and do NOT "fix" the case to match the build. The build shows the filter; the spec only ever hides the COLUMN; Chris ruled the filter hidden. Per Rule 33 the PO ruling outranks the spec text, so this is a PO/dev question. Same for the SBC twin.

### `SBR-TOT-03` — [C30239](https://shopview.testrail.io/index.php?/cases/view/30239) — verdict **DEVIATION**

- CURRENT: "Mobile shows a simplified totals bar below the table; Subtotal at right".
- HOLD — at 390px the Totals row stays inside the sideways-scrolling table and there is no bar beneath it, so the totals scroll out of view. Either the bar gets built or the PO confirms the current behaviour and the case is rewritten to it.

### `SBR-MOB-03` — [C30304](https://shopview.testrail.io/index.php?/cases/view/30304) — verdict **DEVIATION**

- CURRENT: "Touch targets are at least 44x44 px and touch users get no hover-only tooltips".
- NO CASE CHANGE PROPOSED — the case is right and the build is not: chevrons measure 22x22, the nav button 31x31 and the column-selector button 55x31. Raise a dev accessibility ticket.

### `SBR-VIS-02` — [C30306](https://shopview.testrail.io/index.php?/cases/view/30306) — verdict **DEVIATION**

- CURRENT: dark mode switches page, toolbar, table and Totals to dark equivalents.
- NO CASE CHANGE PROPOSED — the Totals row keeps black text on a near-black surface. Same dev ticket as SBC-VIS-03.

### `SBR-VIS-04` — [C30308](https://shopview.testrail.io/index.php?/cases/view/30308) — verdict **DEVIATION**

- CURRENT: "Chevrons and sortable headers are keyboard-operable and expose their state".
- NO CASE CHANGE PROPOSED — the case is right. Build gaps: chevrons are focusable (tabindex=0) but carry no aria-expanded, and the column headers have no tabindex at all. Dev accessibility ticket.

### `SBR-STATE-01` — [C30298](https://shopview.testrail.io/index.php?/cases/view/30298) — verdict **DEVIATION**

- CURRENT: a VERBATIM empty-state message, no grand Totals, toolbar interactive.
- HOLD — there is no empty-state message to quote. Same shared gap as SBC-EMPTY-01.

### `SBR-STATE-04` — [C30301](https://shopview.testrail.io/index.php?/cases/view/30301) — verdict **DEVIATION**

- CURRENT: an inline could-not-load message with a Retry control.
- HOLD — a failure surfaces a toast; no inline message and no Retry control exists. Either it gets built or the case is rewritten to the toast.

### `SBR-WO-01` — [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) — verdict **VIU-Observed-PASS**

- CURRENT: title and body say "Sales Representative selector".
- PROPOSED (Rule 9): use the work order's own label, "Sales rep" (lower-case r), for the work-order surface. Note the CUSTOMER record says "Sales Representative" in full and the CSV export says "Representative" — each case must use the label of the surface it tests.

### `SBR-WO-04` — [C30313](https://shopview.testrail.io/index.php?/cases/view/30313) — verdict **VIU-Observed-PASS**

- CURRENT: the selector is read-only when Invoiced or Paid.
- PROPOSED: keep as-is and ADD the Standing Rule 24 tester line, because the back end still accepts the change: "Note for the tester: this field is only made read-only on the screen. If you find the sales rep can still be changed another way (through the back-end/API), that is expected — mark this test PASSED and do not raise it as a bug."

### `SBR-WO-06` — [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) — verdict **VIU-Observed-PASS**

- CURRENT: customer record shows a "Sales Representative" row; "Unassigned" when none.
- PROPOSED: keep the label (it is correct for this surface) and add a note that the picker in Edit Customer lists ALL staff including inactive ones, and that the value is stored as a name rather than a link to the staff record. The "Unassigned" empty text still needs confirming live.

### `SBC-CALC-03` — [C30151](https://shopview.testrail.io/index.php?/cases/view/30151) — verdict **DEVIATION**

- CURRENT: "+green / -red / 0.0 on every row".
- NO CASE CHANGE PROPOSED — the heading and the 0.0 default are right; the colours simply cannot be seen while the hours pipeline is empty. Re-run when hours exist.

### The four hours-dependent SBR calculation cases

`SBR-CALC-01` · `SBR-CALC-02` · `SBR-CALC-03` · `SBR-CALC-09`

No wording change proposed. The cases look correct; they simply could not be exercised because
`Inv. Hrs` / `Hrs Worked` / `Hrs Invoiced` are `0.0` for every row in the org and new invoices
cannot be created on this branch. They must be re-run, not edited. Same for `SBC-CALC-03`.

## 5. New cases proposed: none — and why that is the honest answer

I found real build behaviour that no case covers, but I am **not** proposing new cases for it
yet, because in every instance the right next step is a ruling rather than a test:

| Uncovered behaviour | Why no new case yet |
|---|---|
| The customer's **Sales Representative picker offers all staff, including inactive staff**, instead of the toggled-on reps the work-order selector uses (`F50`) | This contradicts the intent of S19-R2 but S19-R2 is written about the WO selector. Whether the customer picker should honour the toggle is a **PO question**. Once ruled, it is one new case. |
| A customer's rep is stored as a **name pair, not a rep id** (`F50`) | Testable, but the assertion depends on the answer above, and it is invisible to a manual tester (it only shows up in the API payload). Would belong in an API section. |
| The **PDF `Date Range` header is one day later** than the requested end date (`F13`) | A genuine bug; the correct first move is a dev ticket. A regression case should be written from the fix, per the standing "tickets become test cases" practice. |
| **`change-sales-rep` silently no-ops across workplaces** (201 with no effect) | Out of scope for these two reports — it belongs to work-order permissions/scoping, and it is another team's area. Recorded in `ENV-DEFECTS.md` for whoever owns it. |

If the QA lead wants any of these authored now, say which and I will write them against the
observed behaviour with the evidence path attached.

## 6. Dev tickets this pass would raise (case left alone)

| # | Defect | Cases that catch it |
|---|---|---|
| 1 | **CSV export formatting** keeps `$`, thousands separators and `%`, and writes dates as `Jun 02 2026` instead of `mm-dd-yyyy` — breaks re-pivoting. One shared formatter, both reports. | `SBC-EXP-04` C30162 · `SBR-EXP-12` C30287 |
| 2 | **SBR Summary CSV is missing four spec'd columns** (`# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced`) though the payload carries the figures; also carries a Totals row S14-R15 excludes, and names the first column `Representative` not `Sales Rep`. | `SBR-EXP-10` C30285 |
| 3 | **SBC does not sort Customer, Location, Margin or Margin %** — no request is issued at all, yet Customer displays a sort arrow and `aria-sort="ascending"`. SBR sorts Margin % fine. | `SBC-SORT-01` C30142 |
| 4 | **Dark mode: the Totals row keeps black text on a near-black surface** — unreadable. | `SBC-VIS-03` C30187 · `SBR-VIS-02` C30306 |
| 5 | **Touch targets below 44x44** on mobile (chevrons 22x22, nav 31x31, column selector 55x31). | `SBR-MOB-03` C30304 |
| 6 | **Accessibility: chevrons expose no `aria-expanded`; column headers are not keyboard focusable** (no `tabindex`). | `SBR-VIS-04` C30308 |
| 7 | **PDF `Date Range` header is one day later** than the requested end date, on all four PDFs of both reports. | `SBC-EXP-09` C30167 (noted) |
| 8 | **Customer's Sales Representative picker lists all staff including inactive**, and stores a name pair rather than a rep id. | `SBR-WO-06` C30315 (noted) |

Separately, the write-path 500s in `ENV-DEFECTS.md` (§1 invoice creation, §2 customer update, 
§3 work-order line creation) are almost certainly known work-in-progress on this branch, but 
they are recorded with request ids in case they are not.


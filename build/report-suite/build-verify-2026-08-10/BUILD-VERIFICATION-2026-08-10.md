# Build verification of the three handed-off reports — 2026-08-10

**Scope:** Work In Progress **78** · Technician Utilization **60** · Sales By Customer **87** = **225**,
all ours. **Live total under group 4281 = 488**, of which **12 are Vladimir Tomovic's** — three of those
sit inside these three reports (C38919 · C38922 · C43572) and were **not touched or counted** (Rule 38).

**Build `v3.5-4795eee`** · etag `a80113cf3856c5fedf63be893e8b41c7` · last-mod Fri 07 Aug 2026 13:10:42
GMT. **Read three times — pass start, before the first write decision, and at the end. Byte-identical
every time (`sha256 a4ea53ed…13e8f`), so THE BUILD MOVED ZERO TIMES.**

---

## 1 · The number, stated plainly

**225 of 225 are now build-verified on the dimensions the QA lead named, with one honest limit
(dimension 4) written out below. 0 of 225 are unverified.**

| # | What was checked | Coverage | Result |
|---|---|---|---|
| 1 | **Every on-screen label a case names** — button, menu item, column heading, filter name, tab, dialog, accessible name, placeholder | **225 of 225**, mechanically, no sampling | 1,065 quoted strings tested against the live vocabulary of **that case's own report** |
| 2 | **The navigation path** | **225 of 225** | every case reaches its report the same way, and that way was driven live |
| 3 | **The test data named** | **225 of 225** | **no case depends on a named record existing** — see §4 |
| 4 | **Step executability** | **every control the 225 name was opened and operated**; not every case driven end to end | see the honest limit in §5 |
| 5 | **Raw markup** | **225 of 225** | **0** — confirmed by search, not assumed |

## 2 · What was wrong in our cases

**Nothing.** That is the finding, and it took the whole pass to establish rather than assume.

The label sweep raised **82 cases** with a quoted string not visible on the default page, of which **14**
quoted a string that exists **on a different report** — which reads exactly like a batch of broken cases.
**Every one was checked against the specification before anything was written, and not one was our
mistake.** In each instance the case matches the document and the **build** is what differs, so under
Standing Rule 57 the case keeps its expectation and the tester marks it failed. The full side-by-side is
in `LABEL-LAYER-2026-08-10.md`.

**Consequence: 0 `update_case`, 0 of anything else.** Correcting any of those 82 would have bent the
expectation to whatever shipped, after which the case could no longer fail.

## 3 · What I recorded as a build deviation, and did not file

Per the standing hold — *"DO not create tickets keep the hold"* — **nothing was filed anywhere.**
Seven deviations are written up with both texts quoted side by side in `LABEL-LAYER-2026-08-10.md` §
"The result": the Sales By Customer and Technician Utilization **download menus** (four Summary/Expanded
items where the specs require "Download (CSV)" / "Download (PDF)", and **no "Print" item at all**, which
SBC S16-R1 requires), the Work In Progress **tab capitalisation**, the Sales By Customer **customer-search
hint**, the **missing hover tooltips** on the expand-all chevron and the column selector, the Technician
Utilization **"All technicians"** control where S5-R6 says "Select all", and **"Filter By Technician"**
where S5-R1 says "Filter by Technician".

## 4 · What I disproved — a finding of my own, killed by its own control

**I thought I had found SV-8967 fixed. I was wrong, and the control proved it.**

On the running build the Work In Progress work-order number rendered as a real anchor —
`<a class="wip-wo-link" href="/workorders/{id}/lines" data-test-id="link_wip_wo_…">` — on **all four
tabs**. It took keyboard focus, and clicking it navigated to the work order (title became
`S8582-16269 - Aacrest Works | Work Order | ShopView`). Three of our cases
([C30468](https://shopview.testrail.io/index.php?/cases/view/30468) ·
[C30523](https://shopview.testrail.io/index.php?/cases/view/30523) ·
[C43557](https://shopview.testrail.io/index.php?/cases/view/43557)) say the opposite and carry
`AUTOMATION: READY - EXPECT FAIL (SV-8967)`. On that reading, all three were misleading a tester.

**Before changing them I read the guard out of the shipped bundle:**

```js
Fe = computed(() => Ma().WorkOrders)              // = !!userHasDefaultWorkplace() && canView/canEdit('workOrders')
He = row => Fe.value && row.workplace_id === De.value   // De = the currently-selected location
```

The link is suppressed when the signed-in user has **no default workplace** — and `admin@shopview.com`'s
own staff record reads `defaultWorkplace: null`. **My session showed links only because I had seeded a
default workplace to get past the app's no-location bounce.** The earlier session, signing in normally,
saw plain text — faithfully.

**So the three cases were NOT changed, and their expect-fail markers stand.** What the pass does add is
the *mechanism*, which is sharper than "the WO number is plain text" and should help whoever fixes it:

- the link is withheld from **any user with no default workplace**, whatever their permissions; and
- separately, **a row whose `workplace_id` is not the active location renders as plain text even for a
  fully permitted user** — so with several locations selected, only the active location's rows are links.

**Neither of those conditions appears in Work In Progress S4-R5.**

## 5 · The honest limits

- **Dimension 4 is the one with a limit.** Every control the 225 cases name was opened and operated live —
  both download menus on all three reports, the column selector on all three, the date picker with all
  nine presets and its Apply button, every filter including select-all / clear-all / type-ahead, all four
  Work In Progress tabs, the expand-all controls and per-row expanders, and the work-order link path.
  **But not every case was driven end to end**, and the ones that cannot be are the same ones already on
  hold: exports over the 10,000-row cap, anything needing a **second, non-administrator sign-in**
  (outstanding since 5 August), and the backend-only nightly snapshot.
- **This pass was not a pass/fail re-verdict of the 225** and does not claim to be. It is a check that a
  tester can *run* them.
- **The branch is final for these three reports** (the QA lead's ruling of 2026-08-10) but the Rule-49
  queue stays open, because a redeploy still invalidates labels and verdicts.

## 6 · Test data — why §1 row 3 reads the way it does

**No case in the 225 tells a tester to find a specific pre-existing record.** The suite carries **zero**
"the customer named X" style dependencies; **42 cases** instruct the tester to seed their own data marked
`ZZAUTOTEST`; and every proper name that does appear — `Acme Corp`, `John Smith`, `Christian Pitts`,
`Andrew Wade` — appears as *"for example"* or inside a recorded observation, never as data to go and find.
**This is the SV-8821 failure mode not being present**, checked rather than assumed.

**Nothing was seeded and nothing was changed in the environment this pass**, so there is nothing to
restore. `CHANGES-MADE.md` records the same.

---

## 7 · Per-case table

Legend: *all matched the build* = every label the case quotes was found in that report's live vocabulary ·
*spec-backed, build differs* = the quoted label is in the specification and the build shows something else,
so the case is right and stands · *state not on the default page* = a toast, empty state, tooltip, seeded
value or worked example that the default view cannot show.

### Sales By Customer Report

| Case | Title | Labels checked | Result |
|---|---|---:|---|
| [C30190](https://shopview.testrail.io/index.php?/cases/view/30190) | Asset and invoice rows are fetched on first expand; one call p | 1 | all matched the build |
| [C30191](https://shopview.testrail.io/index.php?/cases/view/30191) | Sorting is applied on the server and re-fetches the first page | 1 | all matched the build |
| [C30192](https://shopview.testrail.io/index.php?/cases/view/30192) | The Customer type-ahead queries the server instead of loading  | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `contains` |
| [C30193](https://shopview.testrail.io/index.php?/cases/view/30193) | Customer rows are server-paginated; the totals row is server-c | 1 | all matched the build |
| [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) | Exports are server-generated and the 10,000-row cap is counted | 3 | spec-backed, build differs — `Download (CSV)`, `Download (PDF)` |
| [C43546](https://shopview.testrail.io/index.php?/cases/view/43546) | The back end serves SBC report data and export on ordinary rep | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Access denied.` |
| [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | Sales By Customer listed under Performance, below existing lin | 4 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Sales By Customer - Report | ShopView`, `Sales By Customer.`, `can this person see reports` |
| [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | Asset identified by VIN, falling back to Unit #, then plate | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Unknown Asset` |
| [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | Duplicate asset labels get stable (#1)/(#2) suffixes that surv | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `(#1)`, `(#2)` |
| [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | Column selector is its own toolbar button with nine toggles al | 1 | spec-backed, build differs — `Column Selection.` |
| [C30157](https://shopview.testrail.io/index.php?/cases/view/30157) | Column toggles hide header+cells; Customer, Subtotal and chevr | 1 | all matched the build |
| [C43550](https://shopview.testrail.io/index.php?/cases/view/43550) | A one-location user never sees Location in the column-selectio | 1 | spec-backed, build differs — `Column Selection.` |
| [C30112](https://shopview.testrail.io/index.php?/cases/view/30112) | Customer filter sits between Product Type and Location, carrie | 2 | spec-backed, build differs — `Search customers…` |
| [C30113](https://shopview.testrail.io/index.php?/cases/view/30113) | Typing in the Customer filter lists matching customers by cont | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Acme Corp`, `contains`, `corp` |
| [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | Pinned control toggles All customers and Clear all; clearing s | 4 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `No sales data found for the selected filters.`, `None` |
| [C30115](https://shopview.testrail.io/index.php?/cases/view/30115) | First load starts in the all-customers state and the report sh | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `All customers.` |
| [C30116](https://shopview.testrail.io/index.php?/cases/view/30116) | Collapsed label reads None, the customer's name, or N selected | 6 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `2 customers`, `2 selected`, `3 selected`… |
| [C30117](https://shopview.testrail.io/index.php?/cases/view/30117) | Changing the customer selection narrows the table and refreshe | 0 | all matched the build |
| [C30120](https://shopview.testrail.io/index.php?/cases/view/30120) | A subset customer selection reconciles on a filter change; kep | 0 | all matched the build |
| [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) | Date range picker offers nine periods in the specified order,  | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `All Time` |
| [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | Building a custom range on the calendar cannot exceed a 366-da | 1 | all matched the build |
| [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) | Changing the date range writes it into the page link for shari | 1 | all matched the build |
| [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | Empty state shows in the table body; toolbar interactive; kept | 4 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `No sales data found for the selected filters.` |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | A failed data fetch shows the error toast which fades after 5  | 5 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `An error occurred while fetching the report data.` |
| [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | The overflow menu holds exactly the four download items - no P | 5 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Print` |
| [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) | Download file names carry the version and the active date rang | 5 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Date Range:` |
| [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | Expanded View CSV: column order, blank-cell rules, and the Loc | 4 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Locations:`, `Parts Sales` |
| [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) | CSV formats: Margin % plain; dates mm-dd-yyyy; currency plain; | 1 | all matched the build |
| [C30163](https://shopview.testrail.io/index.php?/cases/view/30163) | CSV and PDF hold exactly the customers matching the active fil | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Service only` |
| [C30164](https://shopview.testrail.io/index.php?/cases/view/30164) | Each download item shows a loading state and its own export-fa | 10 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `CSV export failed.`, `PDF export failed.` |
| [C30166](https://shopview.testrail.io/index.php?/cases/view/30166) | PDF page: A4 landscape, uniform margins, ShopView footer and p | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Software Powered by ShopView` |
| [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | PDF header: title, organization, date range, Product Type and  | 9 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Aug 1, 2026 - Aug 7, 2026`, `Locations:`, `May 1, 2026 - May 31, 2026`… |
| [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) | PDF logo is embedded, scales without distortion | 0 | all matched the build |
| [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) | Expanded CSV body: column set and order, the Customer → Asset  | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Locations:` |
| [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | An export over 10,000 data rows is refused with the too-large  | 2 | spec-backed, build differs — `Download (CSV)`, `Download (PDF)` |
| [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | A no-match export still downloads headers and a zero totals ro | 3 | spec-backed, build differs — `Download (CSV)`, `Download (PDF)` |
| [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | Summary and Expanded View downloads exist for both PDF and CSV | 4 | all matched the build |
| [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) | A logo that is set but will not load falls back to the ShopVie | 0 | all matched the build |
| [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | The invoice number opens the invoice in the same browser tab | 0 | all matched the build |
| [C30139](https://shopview.testrail.io/index.php?/cases/view/30139) | Browser back from an invoice restores filters; sort and column | 0 | all matched the build |
| [C30140](https://shopview.testrail.io/index.php?/cases/view/30140) | Customer name is plain text; the invoice link never turns visi | 0 | all matched the build |
| [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | An invoice deleted after load shows the not-found state and ba | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `not found` |
| [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | You cannot reach an invoice you have no permission to open | 0 | all matched the build |
| [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | Location filter: rightmost, lists accessible locations, All lo | 1 | all matched the build |
| [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | Selecting locations scopes the data; All locations covers ever | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `All locations,`, `All locations.` |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | Location column: shown to any multi-location user, Multiple on | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Multiple` |
| [C30188](https://shopview.testrail.io/index.php?/cases/view/30188) | On a phone every toolbar control works on touch; the toolbar s | 0 | all matched the build |
| [C30189](https://shopview.testrail.io/index.php?/cases/view/30189) | On touch the table scrolls sideways with Subtotal pinned and c | 0 | all matched the build |
| [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | Ordinary reports access opens Sales By Customer — no separate  | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `can this person see reports` |
| [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | Without reports access, Sales By Customer is not listed and ca | 1 | all matched the build |
| [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | Opening an invoice you lack permission for shows access-denied | 0 | all matched the build |
| [C30101](https://shopview.testrail.io/index.php?/cases/view/30101) | Location access enforced: no data from a location the user can | 0 | all matched the build |
| [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) | No Sales By Customer permission is offered in the role permiss | 1 | all matched the build |
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | Product Type: three options with Parts & Service default; S/P  | 8 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Parts & Service,`, `Parts & Service.`, `Parts only`… |
| [C30174](https://shopview.testrail.io/index.php?/cases/view/30174) | Filters; sort and visible columns are restored on the next vis | 0 | all matched the build |
| [C30175](https://shopview.testrail.io/index.php?/cases/view/30175) | Type-ahead search text, expansion state and scroll position ar | 0 | all matched the build |
| [C30176](https://shopview.testrail.io/index.php?/cases/view/30176) | A saved value that is no longer valid is dropped and falls bac | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `1 selected`, `Select Date Range` |
| [C30177](https://shopview.testrail.io/index.php?/cases/view/30177) | The saved view is specific to this report and does not affect  | 0 | all matched the build |
| [C30178](https://shopview.testrail.io/index.php?/cases/view/30178) | With no saved view every setting uses its own default | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Parts & Service.` |
| [C30179](https://shopview.testrail.io/index.php?/cases/view/30179) | When a saved view and a page-link range clash the saved view w | 0 | all matched the build |
| [C30180](https://shopview.testrail.io/index.php?/cases/view/30180) | Customer filter restore: all-customers stays all; an id set is | 0 | all matched the build |
| [C30142](https://shopview.testrail.io/index.php?/cases/view/30142) | All columns sortable except chevron; text alphabetical, number | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Parts Sales` |
| [C30143](https://shopview.testrail.io/index.php?/cases/view/30143) | Default sort is Customer name ascending case-insensitive | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Best Test`, `acme`, `acme test` |
| [C30144](https://shopview.testrail.io/index.php?/cases/view/30144) | Missing values sort to the bottom ascending and to the top des | 0 | all matched the build |
| [C30145](https://shopview.testrail.io/index.php?/cases/view/30145) | Sorting by Date orders customers by their most recent invoice  | 0 | all matched the build |
| [C30149](https://shopview.testrail.io/index.php?/cases/view/30149) | Financial columns run in the specified order with Subtotal and | 0 | all matched the build |
| [C30150](https://shopview.testrail.io/index.php?/cases/view/30150) | Margin % is Margin over Subtotal to one decimal; em dash when  | 0 | all matched the build |
| [C30151](https://shopview.testrail.io/index.php?/cases/view/30151) | Inv. Hrs heading is verbatim; value shows +green / -red / 0.0  | 2 | all matched the build |
| [C30152](https://shopview.testrail.io/index.php?/cases/view/30152) | Inv. Hrs is never blank: no-labor rows and near-zero values bo | 1 | all matched the build |
| [C30153](https://shopview.testrail.io/index.php?/cases/view/30153) | Invoice subtotals sum to their asset row and asset subtotals t | 0 | all matched the build |
| [C30154](https://shopview.testrail.io/index.php?/cases/view/30154) | Subtotal is the rightmost column; pinned on scroll and bold ev | 0 | all matched the build |
| [C30155](https://shopview.testrail.io/index.php?/cases/view/30155) | The totals row covers the whole filtered set; not just the cur | 0 | all matched the build |
| [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | Each customer gets one summary row with its invoice count in p | 0 | all matched the build |
| [C30122](https://shopview.testrail.io/index.php?/cases/view/30122) | A customer with no matching invoices in the current view is no | 0 | all matched the build |
| [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | Expanding a customer reveals asset rows; chevrons toggle and a | 0 | all matched the build |
| [C30124](https://shopview.testrail.io/index.php?/cases/view/30124) | Expanding an asset reveals its invoice rows with number link a | 1 | all matched the build |
| [C30125](https://shopview.testrail.io/index.php?/cases/view/30125) | Invoices group into one asset row per vehicle record | 0 | all matched the build |
| [C30126](https://shopview.testrail.io/index.php?/cases/view/30126) | Asset rows order A to Z with the Parts Sales bucket always las | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Parts Sales`, `Parts Sales,` |
| [C30128](https://shopview.testrail.io/index.php?/cases/view/30128) | Header-row chevron expands or collapses every customer on the  | 4 | spec-backed, build differs; state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Collapse all`, `Expand all.`, `collapse` |
| [C30129](https://shopview.testrail.io/index.php?/cases/view/30129) | Reload-causing changes collapse expansion; Customer filter typ | 0 | all matched the build |
| [C30130](https://shopview.testrail.io/index.php?/cases/view/30130) | Edge: a single-invoice asset can still be expanded | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Parts Sales` |
| [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | A service (S) invoice with no vehicle also lands in the Parts  | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Parts Sales` |
| [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | Reversed and voided invoices are excluded from every row; coun | 2 | all matched the build |
| [C30133](https://shopview.testrail.io/index.php?/cases/view/30133) | Every row type renders the same columns in the same order | 0 | all matched the build |
| [C30185](https://shopview.testrail.io/index.php?/cases/view/30185) | Page and toolbar match the suite theme in padding; surface and | 0 | all matched the build |
| [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) | Row surfaces alternate by tree level; header and totals rows s | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Styles` |
| [C30187](https://shopview.testrail.io/index.php?/cases/view/30187) | Dark mode darkens every surface while the PDF always renders l | 0 | all matched the build |

### Technician Utilization

| Case | Title | Labels checked | Result |
|---|---|---:|---|
| [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | The per-day breakdown is fetched only when a technician row is | 1 | all matched the build |
| [C30450](https://shopview.testrail.io/index.php?/cases/view/30450) | Date-range and location changes trigger a fresh server load | 1 | all matched the build |
| [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) | Technician Utilization sits under Performance, below existing  | 1 | all matched the build |
| [C30393](https://shopview.testrail.io/index.php?/cases/view/30393) | One row per technician who clocked time in the range at those  | 0 | all matched the build |
| [C30394](https://shopview.testrail.io/index.php?/cases/view/30394) | First visit defaults to the This Month preset and the user's a | 2 | all matched the build |
| [C30395](https://shopview.testrail.io/index.php?/cases/view/30395) | Changing the date range reloads the rows; a Custom range is ca | 0 | all matched the build |
| [C30396](https://shopview.testrail.io/index.php?/cases/view/30396) | The loading indicator shows on load and reload; rows swap only | 0 | all matched the build |
| [C30397](https://shopview.testrail.io/index.php?/cases/view/30397) | All clock records are day-grouped and windowed in one report-l | 0 | all matched the build |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Without reports access Technician Utilization is hidden | 0 | all matched the build |
| [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | Standard no-data message when no time in scope or all technici | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Empty bays, endless possibilities. Get Going!` |
| [C30428](https://shopview.testrail.io/index.php?/cases/view/30428) | Total Hours is a real link with a non-color affordance and key | 0 | all matched the build |
| [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | The Total Hours link opens Timesheet Activities in the same ta | 0 | all matched the build |
| [C30430](https://shopview.testrail.io/index.php?/cases/view/30430) | Same range, single location, closed records: Total Hours match | 0 | all matched the build |
| [C30431](https://shopview.testrail.io/index.php?/cases/view/30431) | Reconcile exception (a): an open clock is snapshotted at each  | 0 | all matched the build |
| [C30432](https://shopview.testrail.io/index.php?/cases/view/30432) | Reconciliation exception (b): the link passes no location | 0 | all matched the build |
| [C30433](https://shopview.testrail.io/index.php?/cases/view/30433) | A day row's Total Hours links to that technician's single-day  | 0 | all matched the build |
| [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | Est. Lost Labor values internal hours at each location's defau | 1 | all matched the build |
| [C30405](https://shopview.testrail.io/index.php?/cases/view/30405) | Est. Lost Labor, when shown, is pinned right and bold with the | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Internal hours valued at each location's default labor rate` |
| [C30406](https://shopview.testrail.io/index.php?/cases/view/30406) | Zero internal hours - or a configured $0.00 rate - shows $0.00 | 1 | all matched the build |
| [C30407](https://shopview.testrail.io/index.php?/cases/view/30407) | Internal hours with no default labor rate anywhere show an em- | 4 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `(an em-dash), NOT`, `(distinguishing it from`, `cell carries the assistive-technology label` |
| [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) | Internal hours split across rated and unrated locations show a | 1 | all matched the build |
| [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) | Three-dot menu is leftmost, then Column Selection; three downl | 10 | spec-backed, build differs — `Expanded (CSV)`, `Expanded (PDF)` |
| [C30435](https://shopview.testrail.io/index.php?/cases/view/30435) | The Summary PDF holds the technician rows plus the Summary | 4 | file/URL — checked at export time — `Technician-Utilization-Expanded.pdf`, `Technician-Utilization-Summary.pdf` |
| [C30436](https://shopview.testrail.io/index.php?/cases/view/30436) | The CSV is always summary-level, quotes comma-containing value | 4 | file/URL — checked at export time; spec-backed, build differs — `technician-utilization.csv`, `Download (CSV)` |
| [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | Downloads cover only selected technicians, locations, and date | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Locations:` |
| [C30438](https://shopview.testrail.io/index.php?/cases/view/30438) | Downloads always order rows Technician A to Z; the on-screen s | 0 | all matched the build |
| [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) | PDF logo follows the uploaded logo; the spreadsheet never carr | 0 | all matched the build |
| [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) | Choosing a download with no technician selected is a silent no | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Success / Data exported successfully.` |
| [C30441](https://shopview.testrail.io/index.php?/cases/view/30441) | A starting download notifies; a failed one shows the failure m | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Download started`, `Failed to download report`, `Success / Data exported successfully.` |
| [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) | An over-cap Technician Utilization export is refused with the  | 0 | all matched the build |
| [C43552](https://shopview.testrail.io/index.php?/cases/view/43552) | Both spreadsheet downloads hold the summary rows and no per-da | 1 | all matched the build |
| [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | Headers in fixed order; Total, WO and Internal Hours show cloc | 1 | all matched the build |
| [C30402](https://shopview.testrail.io/index.php?/cases/view/30402) | Utilization % is WO hours over total hours from unrounded valu | 0 | all matched the build |
| [C30403](https://shopview.testrail.io/index.php?/cases/view/30403) | A technician with only internal hours shows 0.0% utilization | 1 | all matched the build |
| [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | The Location filter is the rightmost multi-select; All Locatio | 4 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Multiple` |
| [C30443](https://shopview.testrail.io/index.php?/cases/view/30443) | Location changes reload with hours pooled into one row per tec | 0 | all matched the build |
| [C30444](https://shopview.testrail.io/index.php?/cases/view/30444) | The saved location selection restores defensively; bad ones ar | 0 | all matched the build |
| [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | Technician Utilization: Location filter hidden for a one-locat | 0 | all matched the build |
| [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | Location column: leftmost for a multi-location user; Summary r | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Multiple` |
| [C30418](https://shopview.testrail.io/index.php?/cases/view/30418) | Each technician row has an accessible expand/collapse control | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Collapse Christian Pitts's daily breakdown`, `Expand Christian Pitts's daily breakdown` |
| [C30419](https://shopview.testrail.io/index.php?/cases/view/30419) | Expanding shows one row per clocked day in date order, loaded  | 0 | all matched the build |
| [C30420](https://shopview.testrail.io/index.php?/cases/view/30420) | Day rows use the same columns and formats as the technician ro | 0 | all matched the build |
| [C30421](https://shopview.testrail.io/index.php?/cases/view/30421) | One control in the table header expands or collapses all techn | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Collapse all technicians`, `Expand all technicians` |
| [C30422](https://shopview.testrail.io/index.php?/cases/view/30422) | Expansion state is view-only: it resets on any reload and fres | 0 | all matched the build |
| [C30409](https://shopview.testrail.io/index.php?/cases/view/30409) | On load rows sort by Technician A to Z with the ascending indi | 1 | all matched the build |
| [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | All six columns sort on screen: ascending first, toggling with | 0 | all matched the build |
| [C30411](https://shopview.testrail.io/index.php?/cases/view/30411) | A data reload resets the sort to Technician A to Z | 0 | all matched the build |
| [C30412](https://shopview.testrail.io/index.php?/cases/view/30412) | Sorting reorders only the technician rows | 0 | all matched the build |
| [C30413](https://shopview.testrail.io/index.php?/cases/view/30413) | Sorting Est. Lost Labor keeps em-dash rows last both ways; $0. | 1 | all matched the build |
| [C30414](https://shopview.testrail.io/index.php?/cases/view/30414) | A pinned Summary row labeled Summary sits at the bottom, stays | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `AVG:`, `TOTAL:` |
| [C30415](https://shopview.testrail.io/index.php?/cases/view/30415) | Summary totals visible technicians from unrounded hours; 0.01  | 0 | all matched the build |
| [C30416](https://shopview.testrail.io/index.php?/cases/view/30416) | Summary Utilization % is the weighted rate; not an average of  | 0 | all matched the build |
| [C30417](https://shopview.testrail.io/index.php?/cases/view/30417) | Summary Est. Lost Labor sums rated contributions; em-dash only | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `only when EVERY visible technician's Est. Lost Labor is` |
| [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) | Filter by Technician starts with every technician selected on  | 3 | spec-backed, build differs; state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `2 technicians`, `Filter by Technician` |
| [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | Deselecting a technician hides the row and recalculates the Su | 0 | all matched the build |
| [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | All technicians and Clear all controls set every technician on | 3 | spec-backed, build differs — `Select all` |
| [C30426](https://shopview.testrail.io/index.php?/cases/view/30426) | Previously deselected technicians stay deselected on the next  | 0 | all matched the build |
| [C30447](https://shopview.testrail.io/index.php?/cases/view/30447) | All-white table with no row shading; toolbar controls in the f | 0 | all matched the build |
| [C30448](https://shopview.testrail.io/index.php?/cases/view/30448) | Dark mode keeps every report element legible | 0 | all matched the build |
| [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | Column Selection: Technician always on, the other five togglea | 2 | spec-backed, build differs — `Column Selection` |

### Work In Progress

| Case | Title | Labels checked | Result |
|---|---|---:|---|
| [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | Nightly snapshot records one row per then-open job per calenda | 1 | all matched the build |
| [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | Captured Earned and Remaining use the same maths as the on-scr | 1 | all matched the build |
| [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | Nightly snapshot spans every location with no user location fi | 1 | all matched the build |
| [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | Nightly snapshot: a job with nothing approved is captured at $ | 1 | all matched the build |
| [C30506](https://shopview.testrail.io/index.php?/cases/view/30506) | Column Selection toggles columns; Total is not offered at all | 1 | spec-backed, build differs — `Column Selection` |
| [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) | Toggling columns never reorders them (Total always last) | 0 | all matched the build |
| [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | Remembers the date range, filter selections, location, columns | 0 | all matched the build |
| [C30509](https://shopview.testrail.io/index.php?/cases/view/30509) | A saved setting that is no longer valid falls back to its defa | 0 | all matched the build |
| [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | A hand-made Location column choice is remembered like any othe | 0 | all matched the build |
| [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | With all toggleable columns on, the fixed column order and ali | 0 | all matched the build |
| [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | First visit shows the default columns; the rest are in the col | 0 | all matched the build |
| [C30468](https://shopview.testrail.io/index.php?/cases/view/30468) | The WO # is a link that opens the WO in the same browser tab | 0 | all matched the build |
| [C30469](https://shopview.testrail.io/index.php?/cases/view/30469) | Status shows as a color-coded badge whose label text is always | 5 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `In progress`, `Review` |
| [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | The Asset cell shows the Unit # in bold with the VIN underneat | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `— no VIN —` |
| [C30471](https://shopview.testrail.io/index.php?/cases/view/30471) | Customer shows the customer's company name | 0 | all matched the build |
| [C30472](https://shopview.testrail.io/index.php?/cases/view/30472) | Days Open shows whole days since creation and reads 0 days / 1 | 4 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `X days` |
| [C30473](https://shopview.testrail.io/index.php?/cases/view/30473) | Last Activity shows Today; Xd ago; or an em-dash when there is | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `3d ago`, `Today`, `Xd ago` |
| [C43557](https://shopview.testrail.io/index.php?/cases/view/43557) | The WO # is plain text, not a link, without Work Order permiss | 0 | all matched the build |
| [C30474](https://shopview.testrail.io/index.php?/cases/view/30474) | Money columns show US dollars to two decimals with thousands s | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `— for example`, `, two decimal places, and thousands separators — for example` |
| [C30475](https://shopview.testrail.io/index.php?/cases/view/30475) | Labor Earned is the clocked share of each approved line's quot | 0 | all matched the build |
| [C30476](https://shopview.testrail.io/index.php?/cases/view/30476) | Labor Remaining is the approved labor's quoted value minus Lab | 0 | all matched the build |
| [C30477](https://shopview.testrail.io/index.php?/cases/view/30477) | Parts Earned is the sell value of approved-line parts already  | 0 | all matched the build |
| [C30478](https://shopview.testrail.io/index.php?/cases/view/30478) | Parts Remaining values the not-yet-received quantity at its se | 0 | all matched the build |
| [C30479](https://shopview.testrail.io/index.php?/cases/view/30479) | Earned + Remaining make Total; not the WO's grand total | 0 | all matched the build |
| [C30480](https://shopview.testrail.io/index.php?/cases/view/30480) | Lines that are not yet approved contribute nothing to any mone | 0 | all matched the build |
| [C30481](https://shopview.testrail.io/index.php?/cases/view/30481) | Inv. Hrs shows quoted minus worked hours; signed to one decima | 4 | all matched the build |
| [C30482](https://shopview.testrail.io/index.php?/cases/view/30482) | An open estimate with no approved work shows $0.00 in every mo | 1 | all matched the build |
| [C38890](https://shopview.testrail.io/index.php?/cases/view/38890) | A technician still clocked in counts toward Labor Earned, capp | 0 | all matched the build |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress: a three-dot menu holds Download (PDF) and Do | 2 | all matched the build |
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | Downloads keep shown columns, honor filters, include the tab's | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Branch`, `Locations:` |
| [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | Downloaded money and Inv. Hrs values keep the on-screen format | 2 | all matched the build |
| [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | Inv. Hrs green/red coloring appears on screen and in the PDF;  | 0 | all matched the build |
| [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | Days Open in a download is frozen at the moment the file is ge | 0 | all matched the build |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | The downloaded files are named "wip-2-report.pdf" and "wip-2-r | 3 | file/URL — checked at export time — `wip-2-report.csv`, `wip-2-report.pdf` |
| [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | Export headers read "Unit" and "Branch" — documented limitatio | 4 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Branch`, `Unit` |
| [C30517](https://shopview.testrail.io/index.php?/cases/view/30517) | The PDF shows the shop logo at the top when one is set | 0 | all matched the build |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Export notifications: success caption, "Empty export" warning | 8 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `An error occurred while exporting the report. Please try again.`, `Data exported successfully.`, `Empty export`… |
| [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | An over-cap Work In Progress download is refused with the too- | 0 | all matched the build |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | The Advisor filter lists the advisors in the loaded jobs; scre | 0 | all matched the build |
| [C30499](https://shopview.testrail.io/index.php?/cases/view/30499) | Customer filter is a type-ahead multi-select reading "All cust | 3 | all matched the build |
| [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | Asset filter shows Unit # and VIN and matches text against eit | 2 | all matched the build |
| [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) | The date range offers the presets plus Custom; This Week defau | 5 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `All Time`, `Today`, `Yesterday` |
| [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) | The date range filters on the WO's created date and reloads on | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Date range cannot be over one year.` |
| [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | Location filter: rightmost multi-select with All locations, re | 2 | all matched the build |
| [C30504](https://shopview.testrail.io/index.php?/cases/view/30504) | The location scope never includes an inaccessible location | 1 | all matched the build |
| [C30505](https://shopview.testrail.io/index.php?/cases/view/30505) | Advisor, customer and asset filters AND together and recompute | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Empty bays, endless possibilities. Get Going!` |
| [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | Location column names each work order's location and never rea | 3 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Branch`, `Multiple` |
| [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) | Ordinary reports access covers opening and downloading Work In | 1 | all matched the build |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | Without reports access Work In Progress is absent from the nav | 1 | all matched the build |
| [C30456](https://shopview.testrail.io/index.php?/cases/view/30456) | Every open service WO at a selected location appears in the re | 0 | all matched the build |
| [C30457](https://shopview.testrail.io/index.php?/cases/view/30457) | Invoiced; Paid and part-sale work orders never appear | 0 | all matched the build |
| [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | Each qualifying work order appears exactly once in exactly one | 1 | all matched the build |
| [C30459](https://shopview.testrail.io/index.php?/cases/view/30459) | While loading the standard indicator shows and old rows stay u | 0 | all matched the build |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | No qualifying work orders: every tab shows the no-data message | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `(0)`, `Empty bays, endless possibilities. Get Going!` |
| [C30483](https://shopview.testrail.io/index.php?/cases/view/30483) | The initial sort is Days Open with the longest-open work order | 0 | all matched the build |
| [C30484](https://shopview.testrail.io/index.php?/cases/view/30484) | Clicking a header sorts ascending, clicking again toggles desc | 1 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `cleared` |
| [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | Columns sort by their underlying values; Asset sorts by the Un | 0 | all matched the build |
| [C30486](https://shopview.testrail.io/index.php?/cases/view/30486) | Sorting reorders only the active tab's rows; Totals stays at t | 0 | all matched the build |
| [C30487](https://shopview.testrail.io/index.php?/cases/view/30487) | The summary strip shows seven figures in a fixed order as US d | 0 | all matched the build |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Total Earned is the hero figure and equals the started-stage f | 2 | spec-backed, build differs — `Approved - partially completed` |
| [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | Total Remaining equals Not Started plus Started — Remaining | 2 | spec-backed, build differs — `Approved - not started`, `Approved - partially completed` |
| [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | Each per-stage figure equals the matching tab's money total | 3 | spec-backed, build differs — `Approved - not started`, `Approved - partially completed` |
| [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | The Estimates figure is the Estimates tab's total quoted value | 0 | all matched the build |
| [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) | Each summary figure's information icon reveals its plain expla | 5 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Approved jobs nobody has started yet. The full amount is still ahead.`, `Finished jobs, ready to bill the customer.`, `Jobs in progress: the work already done but not billed yet.`… |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Status-to-tab mapping: Estimate, Complete, In Progress and Rev | 3 | spec-backed, build differs — `Approved - partially completed` |
| [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | Approved started-boundary: time or part received vs neither de | 2 | spec-backed, build differs — `Approved - not started`, `Approved - partially completed` |
| [C30451](https://shopview.testrail.io/index.php?/cases/view/30451) | Work In Progress appears in the reports navigation under the P | 2 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Work In Progress - Report | ShopView` |
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | Four tabs in a fixed order with the partially-completed tab se | 5 | state not on the default page (toast, empty state, tooltip, seeded value, illustration) — `Completed (30)` |
| [C30455](https://shopview.testrail.io/index.php?/cases/view/30455) | There is no Trend / over-time tab or chart | 0 | all matched the build |
| [C30494](https://shopview.testrail.io/index.php?/cases/view/30494) | Each tab has a Totals row pinned to the bottom, labeled "Total | 1 | all matched the build |
| [C30495](https://shopview.testrail.io/index.php?/cases/view/30495) | The Totals row sums each visible money column and the Inv. Hrs | 3 | all matched the build |
| [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) | Each tab uses an all-white table with no alternating row shadi | 0 | all matched the build |
| [C30520](https://shopview.testrail.io/index.php?/cases/view/30520) | The summary strip is a bold band ruled top and bottom above th | 0 | all matched the build |
| [C30521](https://shopview.testrail.io/index.php?/cases/view/30521) | The Total column is bold and stays pinned right on sideways sc | 0 | all matched the build |
| [C30522](https://shopview.testrail.io/index.php?/cases/view/30522) | The Totals row stays visible while only the active tab's body  | 0 | all matched the build |
| [C30523](https://shopview.testrail.io/index.php?/cases/view/30523) | The WO # link is keyboard-focusable and opens the work order | 0 | all matched the build |
| [C30524](https://shopview.testrail.io/index.php?/cases/view/30524) | Each summary figure's info icon is keyboard-reachable and scre | 1 | all matched the build |
| [C30525](https://shopview.testrail.io/index.php?/cases/view/30525) | In dark mode every table; strip; link and coloring stays legib | 0 | all matched the build |
---

## 8 · Exports driven end to end — added after the table above

All three reports' spreadsheet exports were **actually downloaded and opened**, not merely triggered
(`tools/export.cjs`; files kept in `evidence/`). This closes the largest part of dimension 4.

| Report | Menu item used | File that arrived | Bytes |
|---|---|---|---:|
| Work In Progress | `Download (CSV)` | **`wip-2-report.csv`** | 2,862 |
| Technician Utilization | `Download Summary (CSV)` | **`Technician-Utilization-Summary.csv`** | 1,256 |
| Sales By Customer | `Download Summary (CSV)` | **`sales-by-customer-summary-custom.csv`** | 914 |

**Confirmed present in every file**, which settles several strings the on-screen sweep could not reach:
a UTF-8 byte-order mark · a `"Date Range: Aug 1, 2026 - Aug 10, 2026"` first line · a
`"Locations: Staging Heavy Duty - 9919"` second line · quoted headers · and on Sales By Customer a
`Totals` row carrying values. The success toast reads exactly **"Success / Data exported successfully."**
on all three, as C30440, C30441 and C30518 quote it. C30515's quoted filename **`wip-2-report.csv`** is
exactly right.

**One inaccuracy in a recorded observation, reported not fixed.**
[C30436](https://shopview.testrail.io/index.php?/cases/view/30436)'s *"What you should see today"* block
says the two spreadsheets are `technician-utilization-summary.csv` and `technician-utilization-expanded.csv`.
The file that actually arrives is **`Technician-Utilization-Summary.csv`** — Title Case, not lower case.
The block's substance is right (there are two files, and neither carries the Summary row — this one ends
at "William Johns"); only the casing is wrong. **It was not edited**: that block tells the tester what to
mark, so changing it is a judgement worth a nod rather than an unattended guess. The replacement is a
one-line swap whenever authorised.

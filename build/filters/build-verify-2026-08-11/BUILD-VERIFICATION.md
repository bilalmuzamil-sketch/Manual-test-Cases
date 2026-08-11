# Filters — build verification, per case

**Build:** `v3.6-3e9dd6d` · `index.html` last-modified **Tue, 11 Aug 2026 07:45:44 GMT** · etag
`b1b2623f07bec03883f57a0e17204431` · sha256 `fa01a52544d9fc96…`. **Read three times across the pass
and byte-identical each time — the build moved ZERO times under us**, though it had moved a whole
minor version since the last recorded Filters marker (`v3.4.2-ef30acc`).

**Suite: ours 114 / live total 119** (5 foreign by Ahtasham — untouched, Rule 38).

## The headline

| | cases |
|---|---|
| **Checked against the running build** | **106** |
| — correct as written | 89 |
| — corrected this pass | 8 |
| — mismatch recorded, deliberately **not** changed | 9 |
| **NOT checked against the build** | **8** |

**The 8 are named at the end and 7 of them share one blocker: a second test login.**

## What "build-verified" means here

Every control the case names was found on the running build **with that exact wording**, the
navigation path was walked, and the test data the case names was confirmed to exist. It does **not**
mean the case passed — a verdict is a separate thing, and this pass did not re-verdict the suite.

---

## Per case

| Case | Section | Verdict | Note |
|---|---|---|---|
| [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | Filter Bar Layout and Visibility | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | Filter Bar Layout and Visibility | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | Filter Bar Layout and Visibility | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | Status Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | Status Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | Status Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | Status Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | Status Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | Status Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | Customer Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | Lead Technician Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | Lead Technician Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | Lead Technician Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | Lead Technician Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | Lead Technician Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | Lead Technician Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | Lead Technician Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | Service Advisor Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | Service Advisor Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | Service Advisor Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | Service Advisor Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | Service Advisor Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | Service Advisor Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | Service Advisor Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | Asset on Site Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | Asset on Site Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | Asset on Site Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | Asset on Site Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | Asset on Site Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | Asset on Site Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | Active Filter Chips and Clear Filters | CHECKED - CORRECTED | label corrected to the build wording |
| [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | Active Filter Chips and Clear Filters | CHECKED - CORRECTED | label corrected to the build wording |
| [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | Active Filter Chips and Clear Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | Active Filter Chips and Clear Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | Active Filter Chips and Clear Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Active Filter Chips and Clear Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | Collapse and Expand | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | Collapse and Expand | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | Collapse and Expand | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | Collapse and Expand | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | Collapse and Expand | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | Empty State | CHECKED - MISMATCH RECORDED | empty state observed; message and control read off the build |
| [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | Empty State | CHECKED - MISMATCH RECORDED | empty state observed; Clear Filters present, no clear-the-search action |
| [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | Tab Behaviour | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | Tab Behaviour | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | Tab Behaviour | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | Tab Behaviour | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | Tab Behaviour | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | Persistence | NOT VERIFIED | screen not driven this pass |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | Persistence | NOT VERIFIED | screen not driven this pass |
| [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | Persistence | NOT VERIFIED | screen not driven this pass |
| [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | Persistence | NOT VERIFIED | screen not driven this pass |
| [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | URL State and Shareable Links | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | URL State and Shareable Links | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | URL State and Shareable Links | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | URL State and Shareable Links | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | Mobile Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | Mobile Filters | CHECKED - CORRECTED | label corrected to the build wording |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Mobile Filters | CHECKED - CORRECTED | label corrected to the build wording |
| [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | Mobile Filters | CHECKED - CORRECTED | label corrected to the build wording |
| [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | Mobile Filters | CHECKED - CORRECTED | label corrected to the build wording |
| [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | Mobile Filters | CHECKED - CORRECTED | label corrected to the build wording |
| [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | Mobile Filters | CHECKED - CORRECTED | label corrected to the build wording |
| [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | Mobile Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | Mobile Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | Mobile Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | API — Work Orders List Filtering | BUILD-VERIFIED | list request captured: filters[N][field]/[value], HTTP 200 |
| [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | API — Work Orders List Filtering | BUILD-VERIFIED | combined status+customer request captured, HTTP 200 |
| [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | API — Work Orders List Filtering | BUILD-VERIFIED | unknown customer id -> HTTP 200, no 5xx |
| [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | API — Work Orders List Filtering | BUILD-VERIFIED | malformed status/company -> HTTP 200, page loads with no error |
| [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | API — Work Orders List Filtering | BUILD-VERIFIED | no-match combination -> HTTP 200 + empty state rendered |
| [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | Tab Behaviour | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | Status Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | Asset on Site Filter | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | URL State and Shareable Links | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Persistence | NOT VERIFIED | screen not driven this pass |
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Persistence | NOT VERIFIED | screen not driven this pass |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Reports Page Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | Page Search Toolbar | CHECKED - MISMATCH RECORDED | IBS Batch Transactions; Sales Tax Invoices |
| [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | API — Work Orders List Filtering | NOT VERIFIED | screen not driven this pass |
| [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | URL State and Shareable Links | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | Empty State | CHECKED - MISMATCH RECORDED | empty state observed with filter+search; only one action offered |
| [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | Page Search Toolbar | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Parts Page Filters | CHECKED - MISMATCH RECORDED | Vendor (Inventory 4th chip); Created by (Part Sales) |
| [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Parts Page Filters | CHECKED - MISMATCH RECORDED | Part Type |
| [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Parts Page Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts Page Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Parts Page Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Reports Page Filters | CHECKED - MISMATCH RECORDED | My Timesheets; Sales Tax; Collected; All Tax Rates |
| [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Reports Page Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | Reports Page Filters | CHECKED - MISMATCH RECORDED | Location; Transaction Type |
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | Persistence | NOT VERIFIED | screen not driven this pass |
| [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | Page Search Toolbar | CHECKED - MISMATCH RECORDED | Sales Tax; Collected |
| [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | Parts Page Filters | BUILD-VERIFIED | labels, path and named data confirmed |
| [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) | Mobile Filters | BUILD-VERIFIED | labels, path and named data confirmed |

---

## The 8 corrected, with what was wrong

Every one is a **label**, and in every one the **assertion is untouched** (Rule 57). Full
side-by-side with the governing requirement quoted: `CLASSIFICATION.md`.


### [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) — HTTP 200, 30 fields compared, 3 intended, 0 mismatch

- **class C** · `custom_expected` · illustration only; S7-R1 pins no format, it requires 'displays the selected value(s)'
  - **was:** `The chip displays the selected value (for example 'Status: Estimate').`
  - **now:** `The chip displays the selected value (on the build tested it reads 'Status : Estimate').`

### [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) — HTTP 200, 30 fields compared, 3 intended, 0 mismatch

- **class C** · `custom_expected` · our case had paraphrased S7-R2's illustrative e.g. instead of its rule; the rule is 'first value followed by a count of additional selections', which is what the build does
  - **was:** `The chip lists the selected values starting with the first one and shortens the label when it gets too long (the design shows 'Status: Estimate, In progress, Approved...').`
  - **now:** `The chip displays the FIRST selected value followed by a count of the additional selections - it does not spell out every value (on the build tested, ticking Estimate, In progress and Approved gives 'Status : Estimate, +2').`

### [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) — HTTP 200, 30 fields compared, 3 intended, 0 mismatch

- **class C** · `custom_expected` · locator inside a behaviour assertion
  - **was:** `A sticky blue 'Apply filters' button`
  - **now:** `A sticky blue 'Apply Filters' button`

### [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) — HTTP 200, 30 fields compared, 3 intended, 0 mismatch

- **class A** · `custom_steps` · step direction
  - **was:** `Tap the 'Apply filters' button.`
  - **now:** `Tap the 'Apply Filters' button.`
- **class C** · `custom_expected` · locator inside a behaviour assertion
  - **was:** `After 'Apply filters' the sheet closes`
  - **now:** `After 'Apply Filters' the sheet closes`

### [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) — HTTP 200, 30 fields compared, 3 intended, 0 mismatch

- **class A** · `custom_steps` · step direction
  - **was:** `Tap the 'Apply filters' button inside the sheet`
  - **now:** `Tap the 'Apply Filters' button inside the sheet`
- **class C** · `custom_expected` · locator inside a behaviour assertion
  - **was:** `An 'Apply filters' button is shown inside the sheet.`
  - **now:** `An 'Apply Filters' button is shown inside the sheet.`

### [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) — HTTP 200, 30 fields compared, 3 intended, 0 mismatch

- **class A** · `custom_steps` · step direction
  - **was:** `then tap 'Apply filters'.`
  - **now:** `then tap 'Apply Filters'.`
- **class C** · `custom_expected` · locator inside a behaviour assertion
  - **was:** `After 'Apply filters' the list shows`
  - **now:** `After 'Apply Filters' the list shows`

### [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) — HTTP 200, 30 fields compared, 3 intended, 0 mismatch

- **class A** · `custom_steps` · step direction
  - **was:** `and tap 'Apply filters'.`
  - **now:** `and tap 'Apply Filters'.`

### [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) — HTTP 200, 30 fields compared, 3 intended, 0 mismatch

- **class A** · `custom_steps` · step direction
  - **was:** `Choose Yes and tap 'Apply filters'.`
  - **now:** `Choose Yes and tap 'Apply Filters'.`

Each of the 8 also had its **Rule-54 sentence 2** moved from `v3.4.2-d00239b on 8/5/2026` to
`v3.6-3e9dd6d on 8/11/2026`, because those 8 were genuinely observed today. **Sentence 1 was not
touched on any of them** — a live check does not change where an expectation comes from.

**The other 106 cases keep their old build stamp**, including the 89 found correct. That is
deliberate: re-stamping is a write, and a write claiming today's build across ~98 cases was more than
this session could finish and byte-verify. Their stamps are honest about when they were last
*written*; **this document is the record of what was *checked* today.**

---

## The 8 not checked, by name

- [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) — Persistence
- [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) — Persistence
- [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) — Persistence
- [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) — Persistence
- [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) — Persistence
- [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) — Persistence
- [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) — API — Work Orders List Filtering
- [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) — Persistence

**7 of the 8 are Persistence cases and they all need the same thing: a second test login on this
branch**, so that "saved per user" and "user B does not see user A's filters" can actually be driven.
That ask has been outstanding since 5 August. The eighth,
[C38895](https://shopview.testrail.io/index.php?/cases/view/38895), needs it too — its per-user
isolation step is the whole point of the case.

**What WAS established about persistence without a second login**, and recorded rather than claimed as
a verdict: the page reads and writes `GET /api/users/me/preferences/work-orders-list` (HTTP 200), and
saved state was observed carrying over in the wild — the Parts Inventory page loaded with a bin
location, six categories and a supply filter already applied, and the Notes report with an author and
a mention already set. **None of that was created by this pass.** It is consistent with the feature
working, but it is not the per-user isolation the cases assert, so the cases stay unverified.
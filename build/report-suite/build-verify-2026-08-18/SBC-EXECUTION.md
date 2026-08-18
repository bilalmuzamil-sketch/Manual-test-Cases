# SBC-EXECUTION — Sales By Customer live build-verification (2026-08-18)

**Build under test:** `v3.8-2bf8d14` (app.staging.shopview.com / api.staging.shopview.com), last-modified 2026-08-18 17:45:12 GMT, etag `0f69246068bb597a9f1a1f02bd708754` — **read at pass start and end, byte-stable (no redeploy under the pass).**

**Scope:** 96 Sales By Customer cases in group 4281 (all `created_by = 3`, ours). Report + all features live-verified PRESENT on v3.8. **Result: 86 PASS (READY) / 0 DEVIATION-marker / 10 HOLD / 0 NOT-BUILT.**

The **Sales By Customer report is fully built on v3.8** — nav entry, all filters (date/product-type/location/customer), the customer/asset/invoice tree, all financial columns, sorting, the 10-column selector, all four exports (Summary/Expanded × PDF/CSV), pagination and the API all present and driven live this pass. **The calc contract from epic SV-8582 (FORMULAS-SV-8582.md) verifies exactly against live data** (Margin = Part Margin + Labor Margin + Adjustments; Margin % = Margin / (Subtotal - Shop supply) x 100, confirmed per-row and on the totals row).

| C-id | internal | section | touched | live marker | atm |
|---|---|---|---|---|---|
| [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | ? | Access & Navigation | yes | AUTOMATION: READY | 1 |
| [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | ? | Permissions | no | AUTOMATION: READY | 1 |
| [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | ? | Permissions | no | AUTOMATION: READY | 1 |
| [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | ? | Permissions | no | AUTOMATION: HOLD - waiting on one answer from the product owner about whether this person is given a link at all | 1 |
| [C30101](https://shopview.testrail.io/index.php?/cases/view/30101) | ? | Permissions | no | AUTOMATION: READY | 1 |
| [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) | ? | Permissions | no | AUTOMATION: READY | 1 |
| [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) | ? | Date Range | yes | AUTOMATION: READY | 1 |
| [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | ? | Date Range | no | AUTOMATION: HOLD - the calendar cannot be driven past the 366-day span from this harness; the back end refuses a wider range but the on-screen prevention was not seen | 1 |
| [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) | ? | Date Range | yes | AUTOMATION: READY | 1 |
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | ? | Product Type | yes | AUTOMATION: READY | 3 |
| [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | ? | Product Type | yes | AUTOMATION: READY | 1 |
| [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | ? | Location | no | AUTOMATION: READY | 1 |
| [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | ? | Location | no | AUTOMATION: READY | 1 |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | ? | Location | no | AUTOMATION: HOLD - the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at | 1 |
| [C30112](https://shopview.testrail.io/index.php?/cases/view/30112) | ? | Customer Filter | yes | AUTOMATION: READY | 1 |
| [C30113](https://shopview.testrail.io/index.php?/cases/view/30113) | ? | Customer Filter | no | AUTOMATION: READY | 1 |
| [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | ? | Customer Filter | yes | AUTOMATION: READY | 3 |
| [C30115](https://shopview.testrail.io/index.php?/cases/view/30115) | ? | Customer Filter | no | AUTOMATION: READY | 1 |
| [C30116](https://shopview.testrail.io/index.php?/cases/view/30116) | ? | Customer Filter | yes | AUTOMATION: READY | 1 |
| [C30117](https://shopview.testrail.io/index.php?/cases/view/30117) | ? | Customer Filter | yes | AUTOMATION: READY | 1 |
| [C30120](https://shopview.testrail.io/index.php?/cases/view/30120) | ? | Customer Filter | no | AUTOMATION: READY | 1 |
| [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | ? | Tree & Rows | yes | AUTOMATION: READY | 3 |
| [C30122](https://shopview.testrail.io/index.php?/cases/view/30122) | ? | Tree & Rows | no | AUTOMATION: READY | 1 |
| [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | ? | Tree & Rows | yes | AUTOMATION: READY | 3 |
| [C30124](https://shopview.testrail.io/index.php?/cases/view/30124) | ? | Tree & Rows | yes | AUTOMATION: READY | 1 |
| [C30125](https://shopview.testrail.io/index.php?/cases/view/30125) | ? | Tree & Rows | no | AUTOMATION: READY | 1 |
| [C30126](https://shopview.testrail.io/index.php?/cases/view/30126) | ? | Tree & Rows | no | AUTOMATION: READY | 1 |
| [C30128](https://shopview.testrail.io/index.php?/cases/view/30128) | ? | Tree & Rows | no | AUTOMATION: READY | 1 |
| [C30129](https://shopview.testrail.io/index.php?/cases/view/30129) | ? | Tree & Rows | no | AUTOMATION: READY | 1 |
| [C30130](https://shopview.testrail.io/index.php?/cases/view/30130) | ? | Tree & Rows | yes | AUTOMATION: READY | 1 |
| [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | ? | Tree & Rows | no | AUTOMATION: HOLD - this organisation has no service invoice without a vehicle, so nothing lands in the Parts Sales bucket from the service side | 1 |
| [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | ? | Tree & Rows | no | AUTOMATION: HOLD - this organisation has no reversed or voided invoice inside the report date range | 1 |
| [C30133](https://shopview.testrail.io/index.php?/cases/view/30133) | ? | Tree & Rows | no | AUTOMATION: READY | 1 |
| [C43827](https://shopview.testrail.io/index.php?/cases/view/43827) | ? | Tree & Rows | yes | AUTOMATION: READY | 1 |
| [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | ? | Asset Labels | no | AUTOMATION: READY | 1 |
| [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | ? | Asset Labels | no | AUTOMATION: HOLD - no customer in this organisation has two assets that produce the same label, so the numbered suffix cannot appear | 1 |
| [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | ? | Invoice Links | no | AUTOMATION: READY | 3 |
| [C30139](https://shopview.testrail.io/index.php?/cases/view/30139) | ? | Invoice Links | no | AUTOMATION: READY | 1 |
| [C30140](https://shopview.testrail.io/index.php?/cases/view/30140) | ? | Invoice Links | no | AUTOMATION: READY | 1 |
| [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | ? | Invoice Links | no | AUTOMATION: HOLD - deleting a real invoice while the report is open is not something to do on a shared environment | 1 |
| [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | ? | Invoice Links | no | AUTOMATION: HOLD - waiting on one answer from the product owner about what the invoice number should look like, and it needs a second sign-in that cannot open work orders or part sales | 1 |
| [C30142](https://shopview.testrail.io/index.php?/cases/view/30142) | ? | Sorting | yes | AUTOMATION: READY | 1 |
| [C30143](https://shopview.testrail.io/index.php?/cases/view/30143) | ? | Sorting | yes | AUTOMATION: READY | 1 |
| [C30144](https://shopview.testrail.io/index.php?/cases/view/30144) | ? | Sorting | yes | AUTOMATION: READY | 1 |
| [C30145](https://shopview.testrail.io/index.php?/cases/view/30145) | ? | Sorting | no | AUTOMATION: READY | 1 |
| [C30149](https://shopview.testrail.io/index.php?/cases/view/30149) | ? | Totals & Calc | yes | AUTOMATION: READY | 1 |
| [C30150](https://shopview.testrail.io/index.php?/cases/view/30150) | ? | Totals & Calc | no | AUTOMATION: READY | 1 |
| [C30151](https://shopview.testrail.io/index.php?/cases/view/30151) | ? | Totals & Calc | yes | AUTOMATION: READY | 1 |
| [C30152](https://shopview.testrail.io/index.php?/cases/view/30152) | ? | Totals & Calc | yes | AUTOMATION: READY | 1 |
| [C30153](https://shopview.testrail.io/index.php?/cases/view/30153) | ? | Totals & Calc | no | AUTOMATION: READY | 1 |
| [C30154](https://shopview.testrail.io/index.php?/cases/view/30154) | ? | Totals & Calc | yes | AUTOMATION: READY | 1 |
| [C30155](https://shopview.testrail.io/index.php?/cases/view/30155) | ? | Totals & Calc | yes | AUTOMATION: READY | 1 |
| [C43822](https://shopview.testrail.io/index.php?/cases/view/43822) | ? | Totals & Calc | yes | AUTOMATION: READY | 1 |
| [C43823](https://shopview.testrail.io/index.php?/cases/view/43823) | ? | Totals & Calc | yes | AUTOMATION: READY | 1 |
| [C43824](https://shopview.testrail.io/index.php?/cases/view/43824) | ? | Totals & Calc | yes | AUTOMATION: READY | 1 |
| [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | ? | Column Selector | yes | AUTOMATION: READY | 1 |
| [C30157](https://shopview.testrail.io/index.php?/cases/view/30157) | ? | Column Selector | yes | AUTOMATION: READY | 1 |
| [C43550](https://shopview.testrail.io/index.php?/cases/view/43550) | ? | Column Selector | no | AUTOMATION: READY | 1 |
| [C43825](https://shopview.testrail.io/index.php?/cases/view/43825) | ? | Column Selector | yes | AUTOMATION: READY | 1 |
| [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | ? | Exports | no | AUTOMATION: READY | 1 |
| [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30163](https://shopview.testrail.io/index.php?/cases/view/30163) | ? | Exports | no | AUTOMATION: READY | 1 |
| [C30164](https://shopview.testrail.io/index.php?/cases/view/30164) | ? | Exports | no | AUTOMATION: READY | 1 |
| [C30166](https://shopview.testrail.io/index.php?/cases/view/30166) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) | ? | Exports | no | AUTOMATION: HOLD - this organisation has a logo that loads correctly, so the set-but-will-not-load fallback cannot be produced | 1 |
| [C43826](https://shopview.testrail.io/index.php?/cases/view/43826) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C43832](https://shopview.testrail.io/index.php?/cases/view/43832) | ? | Exports | yes | AUTOMATION: READY | 1 |
| [C30174](https://shopview.testrail.io/index.php?/cases/view/30174) | ? | Persistence | no | AUTOMATION: READY | 1 |
| [C30175](https://shopview.testrail.io/index.php?/cases/view/30175) | ? | Persistence | no | AUTOMATION: READY | 1 |
| [C30176](https://shopview.testrail.io/index.php?/cases/view/30176) | ? | Persistence | yes | AUTOMATION: READY | 1 |
| [C30177](https://shopview.testrail.io/index.php?/cases/view/30177) | ? | Persistence | no | AUTOMATION: READY | 1 |
| [C30178](https://shopview.testrail.io/index.php?/cases/view/30178) | ? | Persistence | yes | AUTOMATION: READY | 1 |
| [C30179](https://shopview.testrail.io/index.php?/cases/view/30179) | ? | Persistence | no | AUTOMATION: READY | 1 |
| [C30180](https://shopview.testrail.io/index.php?/cases/view/30180) | ? | Persistence | no | AUTOMATION: READY | 1 |
| [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | ? | Empty & Edge | no | AUTOMATION: READY | 1 |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | ? | Empty & Edge | no | AUTOMATION: HOLD - a failing data fetch cannot be forced from the application | 1 |
| [C30185](https://shopview.testrail.io/index.php?/cases/view/30185) | ? | Visual | yes | AUTOMATION: READY | 1 |
| [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) | ? | Visual | yes | AUTOMATION: READY | 1 |
| [C30187](https://shopview.testrail.io/index.php?/cases/view/30187) | ? | Visual | no | AUTOMATION: READY | 1 |
| [C43840](https://shopview.testrail.io/index.php?/cases/view/43840) | ? | Visual | yes | AUTOMATION: READY | 1 |
| [C30188](https://shopview.testrail.io/index.php?/cases/view/30188) | ? | Mobile | no | AUTOMATION: READY | 1 |
| [C30189](https://shopview.testrail.io/index.php?/cases/view/30189) | ? | Mobile | no | AUTOMATION: READY | 1 |
| [C30190](https://shopview.testrail.io/index.php?/cases/view/30190) | ? | API | yes | AUTOMATION: READY | 1 |
| [C30191](https://shopview.testrail.io/index.php?/cases/view/30191) | ? | API | yes | AUTOMATION: READY | 1 |
| [C30192](https://shopview.testrail.io/index.php?/cases/view/30192) | ? | API | yes | AUTOMATION: READY | 1 |
| [C30193](https://shopview.testrail.io/index.php?/cases/view/30193) | ? | API | yes | AUTOMATION: READY | 1 |
| [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) | ? | API | yes | AUTOMATION: READY | 1 |
| [C43546](https://shopview.testrail.io/index.php?/cases/view/43546) | ? | API | no | AUTOMATION: READY | 1 |

# SV-10142 — Adjustments block shows only "Labor" (no fee name) — QA findings (7 Oct 2026)

**Ticket:** [SV-10142](https://shopview.atlassian.net/browse/SV-10142) · Bug · Medium · TESTING QA · assignee Stefan Mitrovic · reporter Ryan Fyfe (PowerTools, Mike Freeman) · customer Jordan Schaffland / Massey's Truck & Tank Repair (19 users), Intercom 215475884862731. No parent epic, no links. Labels `ai-unverified-repro`, `bug-report`, `source-intercom`.
**Reporter's words:** *"When a labor fee is shown on an estimate or invoice, section in which it is shown (Adjustments) only pulls "Labor", and not the description of the Labor Fee … this is occurring on the new invoice layout."*
**PR:** ShopView/shopview#3424 (open, not merged). Commits `f1d3b51` (named rows), `c688413` (combine same-named rows), `d72fa24` (merge main, 2 Oct 23:07Z), `d283ced` (merge main, 7 Oct 08:34Z). **No commit implements Chris's 78126 fixed order.** PR QA steps: invoice + estimate with labor fee, labor discount, part adjustment → own rows; Legacy layout unchanged; part-sale invoice with part-line adjustment → `Parts · <name>`. PR summary also names the customer-portal document.
**AFTER build:** `sv10142.qa.shopview.com`, `v26.40.3-d72fa24`, last-modified Fri 02 Oct 2026 23:18:08 GMT (= PR commit `d72fa24`, which contains `f1d3b51` + `c688413`). Read at start (~13:40Z) and before exhibits.
**BEFORE (Rule 86):** production `app.shopview.com`, build `v26.40.9-27b6bca`, prod test org, Trucks Hill 2.

## Expected behaviour — the sources, newest wins (Rules 32/56/57)
| Source | Date | Says |
|---|---|---|
| Spec *Invoice UI Refresh* S7-R5, Confluence page 755990532 **v70** | 24 Sep 2026 | rollup rows labelled exactly "Labor" / "Parts", then each work-order-wide row — **the behaviour the ticket complains about; not yet updated** |
| Stefan 77763 (options) → **Chris 77792** | 2 Oct | Option 1, named rows; **combine identical rows into one row carrying the total**; fees and discounts separate; hide $0.00 rows. Example output given. *"Rows combine only when the group (Labor / Parts) and the fee name are the same; a fee and a discount never combine."* |
| Stefan 77809 → **Chris 77997** | 6 Oct | *"Order: always Labor rows first, then Parts rows, then work-order-wide rows. Inside each group, rows go in the order each was first added."* · same name, different calculation: *"yes, combine them into one row with the total."* |
| Stefan 78034 → **Chris 78126** | **7 Oct 09:00 −0500** | *"fixed order, please. Inside each group (Labor, then Parts), fees come before discounts, and each is A to Z by name. Entry order doesn't matter, so the same invoice prints the same way every time."* Example prints as written whichever fee was entered first. |

Chris's 78126 is the newest authoritative source and post-dates both the branch build (2 Oct) and the spec (v70, 24 Sep).

## SOURCE-CURRENCY
| Source | Identifier | Checked | Verdict |
|---|---|---|---|
| Ticket + comments | SV-10142, 7 comments (last 78126 Chris, 09:00 −0500), 3 attachments (Intercom transcript read; 2 images) | 7 Oct ~13:35Z | CURRENT |
| Changelog | last content change 7 Oct 04:01 (TESTING QA + QA Branch set) | 7 Oct | CURRENT |
| PR | #3424 head `d283ced` (merge only), updated 09:01Z | 7 Oct | CURRENT |
| Spec | Invoice UI Refresh v70 (24 Sep) | 7 Oct | CURRENT but **not updated for this ruling** (S7-R5 still rollup) |
| Build | v26.40.3-d72fa24 | start | CURRENT; **predates Chris's 77997 and 78126** |

## Set-up (per-ticket branch, no clean-up)
- QuickBooks advanced mode blocked every fee (`adjustments/add` 409 "Connect a QuickBooks item for fees…"). **QuickBooks feature turned OFF on the branch org** (`POST /api/organization/feature-flags`, list minus `990e383e…`; snapshot `ff-before.json` in /tmp). Same unblock as SV-9480. Not restored (per-ticket branch).
- Work orders built by API (create, mileage, canned lines *Service - Battery service / Full grease service / PDI*, inventory parts **84-2005 CONNECTOR** and **MD668D ATF**, picked, adjustments, complete, invoice). Customer **4 Star Truck Repair**, contact Savannah.
- Part sale P10142-248: first part added **on screen** (creates the Default line), the rest by API.
- Invoice design switched to Legacy and back to Modern for the Legacy check (read back `modern`).

## Results — every cell observed live (Rule 96 matrix)
| # | Work order | Entry order | Document | Adjustments block (verbatim) | Result |
|---|---|---|---|---|---|
| 1 | S10142-17580 | Shop, Diagnostic, Shop, Shop · Core disc, Env, Env · Fleet | estimate (Finance tab + PDF) | Labor · Shop fee $45.00 / Labor · Diagnostic fee $25.00 / Parts · Core discount ($5.00) / Parts · Environmental fee $6.00 / Fleet discount ($10.00) | names + combine PASS · order FAIL (78126) |
| 2 | S10142-17582 | same as 1 | invoice PDF + Finance tab | identical to 1 | names + combine PASS · order FAIL |
| 3 | S10142-17583 | Chris's order (Diagnostic first, Env before Core) | invoice PDF + Finance tab | Labor · Diagnostic fee $25.00 / Labor · Shop fee $45.00 / Parts · Environmental fee $6.00 / Parts · Core discount ($5.00) / Fleet discount ($10.00) — **Chris's example line for line** | PASS (but only because of entry order) |
| 4 | S10142-17584 | Zeta, Zulu disc, Promo fee, Shop flat $5, Bravo disc, Alpha, Promo disc, Shop 2% labor, Waste disc(part), Tire(part), Battery(part), Tiny 0.01% part, Loyalty disc, Admin fee, Loyalty disc | estimate PDF + invoice PDF + Finance tab | Labor · Zeta fee $7.00 / Labor · Zulu discount ($2.00) / Labor · Promo $10.00 / Labor · Shop fee $8.00 / Labor · Bravo discount ($3.00) / Labor · Alpha fee $4.00 / Labor · Promo ($4.00) / Parts · Waste discount ($1.00) / Parts · Tire fee $2.00 / Parts · Battery fee $1.00 / Loyalty discount ($5.00) / Admin fee $8.00 / Loyalty discount ($2.00) | see rows 4a–4e |
| 4a | | | | Promo fee + Promo discount → two rows | PASS (77792) |
| 4b | | | | Shop fee flat $5 + 2% of $149.95 labor ($3.00) → one $8.00 row | PASS (77997 #2) |
| 4c | | | | Tiny fee 0.01% × $4.56 = $0.0005 → not printed | PASS (77792 hide $0.00) |
| 4d | | | | Labor group, then Parts group, then work-order-wide | PASS (77997 #1) |
| 4e | | | | inside Labor: Zeta, Zulu disc, Promo… — entry order, fees and discounts mixed. Expected: Alpha fee, Promo, Shop fee, Zeta fee, Bravo discount, Promo, Zulu discount | **FAIL (78126)** |
| 4f | | | | two work-order-wide Loyalty discounts stay two rows, in entry order | as Stefan 77809 stated and Chris 77997 accepted; 78126 rules only on Labor/Parts groups |
| 5 | P10142-248 part sale | Tire, Core disc, Env, Env · Fleet | invoice PDF | Parts · Tire fee $2.00 / Parts · Core discount ($5.00) / Parts · Environmental fee $6.00 / Fleet discount ($10.00) | names + combine PASS · order FAIL (expected Environmental, Tire, Core discount) |
| 6 | Legacy layout | S10142-17580 branch vs S2-962 prod | estimate PDF | both: Fleet discount ($10.00) / Shop fee (×3) $45.00 / Diagnostic fee $25.00 / Core discount ($5.00) / Environmental fee (×2) $6.00 — **identical text** | PASS (unchanged) |
| 7 | Legacy layout | C/D/E invoices | invoice PDF | legacy grouping (×n), unchanged style | PASS |
| 8 | Estimate vs invoice | S10142-17584 | both PDFs | identical Adjustments rows | PASS |

Arithmetic: the line-level + WO-wide amounts on 1–3 net to $61.00 (76 fees − 15 discounts), matching the work order's `adjustmentsSummary` and the production BEFORE (Labor 70 + Parts 1 − 10 = 61).

## Production BEFORE (bug reproduced live)
Work order **S2-962** (Trucks Hill 2, customer *aa*, canned lines ER5/ER3/ER4, two ZZAUTOTEST vendor parts), same eight adjustments in the same entry order. Production `documentDesign` was **legacy**; switched to **modern** for the capture, rendered the estimate PDF, switched back to **legacy** and read back `legacy`. New layout prints **`Labor $70.00 · Parts $1.00 · Fleet discount ($10.00)`** — no names, and the parts fee and discount netted into $1.00. Legacy estimate captured as the comparison for row 6.
**Clean-up:** S2-962 deleted (`work-orders/delete` 201; re-read → 400 `workOrderId Not found`); `documentDesign` read back **legacy**. QuickBooks advanced mode was off on production, so no flags touched there. Session location set to Trucks Hill 2.

## Customer portal — NOT REACHED (raised with the QA lead, Rule 91)
Profile menu → **Customer Portal** on the branch sends `POST https://shopview-portal-feature-branch-xn74b9.laravel.cloud/sso-login {"returnJson":true,"portalType":"customer"}`; the browser fails it with `net::ERR_FAILED`. The CORS preflight from origin `https://sv10142.qa.shopview.com` returns 204 **without** `Access-Control-Allow-Origin`, so the shared portal server does not accept this branch. Not one of the PR's QA steps; the PR summary lists the portal document as sharing the same template.

## Evidence
`ev/01-before-vs-after-hd.png` · `ev/02-order-follows-entry-order-hd.png` · `ev/03-variants-hd.png` · `ev/04-part-sale-hd.png` · `ev/05-legacy-unchanged-hd.png` (built by `build_exhibits.py` from `ev/raw/` — PDFs rendered at 4×, Finance-tab captures at 2×). Scripts in `scripts/`.

## ⚠️ THE BRANCH MOVED DURING THE PASS — re-tested in full (Rules 59/72)
- **Pre-post gate (~14:40Z) caught it:** S10142-17582 suddenly printed in the fixed order while the front-end marker was still `v26.40.3-d72fa24`. Stefan had pushed **`13b782a` "fix(be)[SV-10142]: fixed row order inside Labor and Parts — fees first, then A to Z"** (14:25:33Z) + merge `a32d41c` (14:25:41Z). The back end redeployed first; the **front end followed at 14:45:51 GMT → `v26.40.8-a32d41c`** (includes a merge of `main`). The first draft (PARTIALLY PASSED with a "fixed order missing" remaining issue) was **never posted**.
- Commit message: sorts each line-level group by *(is discount, lower-cased name)*; work-order-wide rows keep entry order; Legacy untouched. Files: `AdjustmentRenderFormatter.php`, `InvoiceDtoInterface.php`, `InvoiceAdjustmentRenderProvider.php`, unit test, e2e spec.
- **Stefan comment 78143 (09:46 −0500)** asks Chris to verify the out-of-order example and sign off; PR merges once he does.
- **Re-tested on `v26.40.8-a32d41c`, every document re-rendered:**
  - S10142-17580 (est), 17582 (inv, reverse entry), 17583 (inv, Chris order): all `Labor · Diagnostic fee $25.00 / Labor · Shop fee $45.00 / Parts · Environmental fee $6.00 / Parts · Core discount ($5.00) / Fleet discount ($10.00)` — **Chris's 78126 example line for line, whatever the entry order.** PASS
  - S10142-17584 (est + inv): `Labor · Alpha fee $4.00 / Promo $10.00 / Shop fee $8.00 / Zeta fee $7.00 / Bravo discount ($3.00) / Promo ($4.00) / Zulu discount ($2.00) / Parts · Battery fee $1.00 / Tire fee $2.00 / Waste discount ($1.00) / Loyalty discount ($5.00) / Admin fee $8.00 / Loyalty discount ($2.00)` — fees then discounts, A to Z; work-order-wide rows in entry order, not combined. PASS
  - **New variant S10142-17585** (entered: zeta fee, bravo discount, Alpha fee, Alpha discount, brake fee, part discounts Waste discount, core discount): `Labor · Alpha fee / brake fee / zeta fee / Alpha discount / bravo discount / Parts · core discount / Waste discount` — case-insensitive A to Z; discount-only group sorts. PASS
  - P10142-248: `Parts · Environmental fee $6.00 / Tire fee $2.00 / Core discount ($5.00) / Fleet discount ($10.00)`. PASS
  - Legacy (C/D/E invoices + estimate A): Adjustments text **identical** to the pre-commit captures, and estimate A Legacy **identical to production S2-962 Legacy**. PASS
- First-build exhibits kept in `ev/first-build/` (they show the entry-order behaviour on `d72fa24`); the posted set is rebuilt from `ev/raw2/` on `a32d41c`.

## QA lead's rulings (7 Oct)
1st ask: verdict *"Partially passed now"* · portal *"Ask stefan to enable POrtal on the branch to testing the part {{mention what is blocked on portal access}}"* · technical section *"No"* · spec note *"Yes, ask Chris"*. 2nd ask (after the redeploy): *"Partially passed, portal"*. Then: *"wait before posting anything see this comment …78143"* — **holding, nothing posted.**

## QA lead: *"1. Go ahead"* — posted
**Pre-post gate (~14:58Z):** marker `v26.40.8-a32d41c` (unchanged since 14:45:51 GMT); ticket TESTING QA, 8 comments, last 78143 (Stefan); fresh render of S10142-17582/17583 = Chris's example; fingerprint scan 0 hits; no technical section; exhibit 1 embed height corrected 992 → 1018 after the rebuild.
- **78144** (09:58:33 −0500): yellow panel *"OVERALL QA STATUS: PARTIALLY PASSED"* (waiting only on the portal), 15-row table (14 PASSED, row 15 NOT TESTED), spec v70 S7-R5 quoted + Chris's three rulings cited as the newer source, 6 images (attachments 61907–61912), 8 walked steps.
- **78145** (09:58:33 −0500): @Stefan Mitrovic — enable the Customer Portal on the branch (what it blocks); @Chris Ward — update S7-R5 to match 77792/77997/78126.
- Read back via v3 ADF: 78144 first node panel `warning`; media `file` ×6 in order at 512×1018, 390×957, 390×1196, 390×710, 512×444, 420×787; tableRow 16 = header + 15; 13 list items. 78145 mentions resolved (@Stefan Mitrovic, @Chris Ward).

## Learning check (Rule 95)
New and recorded: a back-end-only deploy leaves the front-end marker unchanged → the gate must re-render a result (Rule 72 (1) amended, LESSONS-INDEX row); on-screen numbers differ from `view.number` (LESSONS-INDEX row); inventory `make-request` needs `inventory_part_id`; estimate PDF endpoint; amount-0 refused; portal CORS on branches; reading the Adjustments block from PDFs (playbook §AC.15 addendum 5).

## Environment changes left (per-ticket branch, no clean-up)
QuickBooks feature OFF on the branch org; work orders S10142-17580…17585, part sale P10142-248 (all invoiced except 17580); invoice design back on Modern. Production: S2-962 deleted, design back on Legacy.

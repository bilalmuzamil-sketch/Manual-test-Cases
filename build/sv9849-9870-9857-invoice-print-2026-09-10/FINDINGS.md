# SV-9849 / SV-9870 / SV-9857 — QA on branch `sv9849` (2026-09-10)

**QA branch:** https://sv9849.qa.shopview.com/
**Build marker (read live, unchanged across the pass):** `v26.36.0-3340667`, `index.html` last-modified Thu 10 Sep 2026 02:40:22 GMT, etag `1510d575ab23fd2fb6125e8952b81330`.
**Org:** Foothills Group Inc · workplace "Staging Heavy Duty - 9919" (shop 9849).
**Document render path used:** `GET /api/invoices/preview?invoice_id=<id>&type=pdf|html` — the same endpoint the Finance tab's download button calls (captured from the live UI). Invoice id comes from `GET /api/work-orders/view/{woId}`.

All three tickets share this branch: SV-9849 landed at `5836b5d23c`, **SV-9870 landed on the same branch at `95c3a42a42`** (Milomir, comment 76271), and SV-9870's change 2 is the fix for SV-9857.

---

## VERDICTS

| Ticket | Verdict |
|---|---|
| **SV-9849** — masthead logo centre + 210px | **PASS** |
| **SV-9870** — printed paper reduction (11 print-only changes) | **PASS** (one measurement note, not a defect) |
| **SV-9857** — tall work line defers whole, leaving page 1 blank | **PASS** — fixed by SV-9870 change 2 |

---

## SV-9849 — masthead logo centred + 210px slot — PASS

Tested with the **eight logo shapes attached to the ticket** (L1–L8), downloaded from Jira and uploaded through the real org endpoint `POST /api/organization/organization-details/upload-logo`, re-rendering the invoice after each.

| logo shape | rendered box | offset from PAGE centre | ink past margin |
|---|---|---|---|
| L1 square 512×512 | 46 × 46 px | **−0.00 pt** | 0 |
| L2 wide 4:1 | 184 × 46 px | **−0.00 pt** | 0 |
| L3 ultrawide 10:1 | 210 × 21 px | **−0.00 pt** | 0 |
| L4 tall 1:3 | 15 × 46 px | **−0.00 pt** | 0 |
| L5 tiny 48×48 | 46 × 46 px | **−0.00 pt** | 0 |
| L6 huge 4000² | 46 × 46 px | **−0.00 pt** | 0 |
| L7 wide + tagline | 210 × 26 px | **−0.00 pt** | 0 |
| L8 padded transparent | 46 × 46 px | **−0.00 pt** | 0 |

Also **−0.00 pt on all 11 invoices** measured (different document numbers and lengths) — the logo does not move with the number, which is Chris Ward's point 2/3. Ticket records today's swing as 276.5px.

**Mechanism matches what Milomir described and Chris approved:**
- `.mh-brand { flex: 1 1 0; min-width: 0; margin-right: 20px }` and `.mh-doc { flex: 1 1 0; min-width: 0; margin-left: 20px }` — equal flex-grow from a **zero basis** on both side columns.
- `.mh-logo { flex: 0 0 210px; align-self: center; text-align: center }` — fixed 210px slot.
- `.organization-logo-new { width:auto; height:46px; max-width:210px; object-fit:contain; margin:0 auto }`.
- **No CSS grid** (Chris's point 4). `gap: 0` with the 20px carried as column margins, with the template's own note explaining WeasyPrint 69's compressible `gap`.
- `.doc-num { display:block; overflow-wrap:break-word }` — **`white-space: nowrap` is gone** (the deliberate SV-9762 reversal), so the number may wrap. Per Chris's ruling the "document label always on one line" expectation is withdrawn and is **not** tested.

**Other document types:** Estimate `EST-S9849-17358` — centred −0.00pt, 1 page, 0 ink past margin, and prints the shop name **"Staging Heavy Duty - 9919" in full** (G-R3: an estimate reads the live location). Part sales `P2-219 / P2-222 / P2-242` — centred −0.00pt, 1 page each.

**Credit memo — CM-4191** (Customers → 4 Star Truck Repair → Invoices → "Print credit memo", `GET /api/credit-memos/{id}/pdf`): logo **46×46px at −0.00pt from page centre**, 0 ink past the margin, **"CREDIT TO" block present**, **no "Remit Payment To"**, document label stacked as `Credit: CM-4191`, and the shop name prints "Staging Heavy Duty - 9919" in full. Matches Mudassir's CM-4189 result.

**Not verified this pass (honest):** the **no-logo shop** path (the logo is org-level and there is no remove option on this env — the same limitation Mudassir recorded). Long-number wrapping was verified at the CSS layer only, not driven with a 20-character number.

---

## SV-9870 — printed paper reduction — PASS

### All eleven changes are present, and are print-only
Verified against the served document CSS (`type=html`, the exact input WeasyPrint renders):

1. **Vertical spacing** — every one of the 28 declarations at its specified value (`.invoice-pdf-new` padding-top 24 / padding-bottom 20, `.mh` 8, `.grp-lbl` 12/0/5, `.addr` 8/14, `.asset-band` 8/2 + 10, `.order-chips` 10, `.sec-lbl` 14/0/3, `.job` 9, `.scope-lbl` 6/0/2/38, `.scope` 0/0/7/38, `.chargesec` 6 + 9, `.csec-head` 3, table td 3, adjrow 2, `.job-foot` 5/5, `.ps-body` 9, `.sum::after` 18, `.bal` 10/18, `.totals-new` 3, `.adj-item` 2/0/2/18).
2. **`.job { break-inside: auto }`** in print; the base (screen) rule still `avoid`. **Glue kept:** `.job-top`, `.scope-lbl`, `.csec-head` `break-after: avoid`; `.job-foot` `break-before: avoid`.
3. **Disclaimer/signature** — `.disc` 9px/1.35, `.sign-line` 16px, `.sign-cap` 3px, `.auth` 8/6, `.footer` 8/6.
4. **`.sum` 280px** (base 340px), `float: right` retained.
5. **Why runs on from the What** — `.job-top` block/relative/padding-left 38px, `.job-no` absolute, `.job-ttl` + `.job-sub` inline.
6. **Text one pixel smaller** — body 13px/1.4, `.scope` 11.5px/1.4, table 12px.
7. **Charge-row dividers removed** — `td`, `tr.crow td`, `tr:last-child td` all `border-top:0; border-bottom:0`.
8. **`.b-break` 6px 0 8px.**
9. **No running header** — `@page { margin-top: 30px; @top-left{content:none} @top-right{content:none} }`, `@page :first { margin-top: 0 }`.
10. **`.scope { max-width: none }`** — the 70ch measure removed.
11. **Side padding 18px.**

**Print-only confirmed** — the screen document is untouched: `.invoice-pdf-new` padding `38px 42px 30px`, `.disc` 11.5px/1.5, `.scope` 12.5px + `max-width:70ch`, table 13px, `.sum` 340px, `.b-break` 26px 0 16px, `.footer` 22/12, and the charge-row borders still present.

### Rendered output (11 invoices, 39 pages)

| invoice | work lines | pages | page-1 fill | running header on p2+ |
|---|---|---|---|---|
| S2-4963 | 2 | 2 | 92.2% | none |
| S2-6889 | 2 | 2 | 74.7% | none |
| S2-10250 | 3 | 2 | 69.7% | none |
| S2-13311 | 4 | 2 | 88.0% | none |
| S2-10601 | 5 | 2 | 91.3% | none |
| S2-4219 | 8 | 3 | 92.7% | none |
| S2-16012 | 10 | 3 | 92.4% | none |
| S2-16541 | 23 | 5 | 93.2% | none |
| S2-15586 | 23 | 8 | 91.5% | none |
| S2-10056 | 28 | 5 | 92.5% | none |
| S2-8627 | 31 | 5 | 93.7% | none |

- **0 of 39 pages** carry any top-margin text → change 9 holds everywhere.
- **0 orphaned section headings** at a page end and **0 separated "Line total" footers** at a page top across all 39 pages → change 2's glue holds.
- **Money identical between screen and print** on S2-8627: 83 money figures in the HTML document, 83 in the PDF, **identical multiset**.
- Disclaimer renders **9.0px in #4B5565** in the PDF — Chris Ward's **S12-R5b exemption** honoured (deliberately *not* darkened to #364152), while `.af-k`, `.addr-lbl`, `.grp-lbl`, `.sign-cap` remain #364152 as he listed.
- Sheet counts sit at or below the design's targets (design: 10–24 lines → 3.33 sheets, 25+ → 7.00; here 23 lines → 5, 28 → 5, 31 → 5).
- **Part-sale mirror correct:** flat parts body, no SCOPE OF WORK / LABOR blocks, so changes 2, 5 and 10 legitimately do not apply (S13-R2). 1 page each.

### The credit-memo divider divergence is real and correct
Milomir flagged (comment 76269) that the credit memo **keeps** its row dividers because they come off a different selector (`.pay-table tbody tr + tr td`, S11-R4) that SV-9870 never measured, and Chris endorsed leaving them. Measured, counting thin horizontal rules (<2pt tall, >40pt wide) across each whole document:

| document | thin horizontal rules |
|---|---|
| **Invoice** S2-8627 (5 pages) | **2** — the section rule and Summary bar only, which change 7 explicitly keeps |
| **Credit memo** CM-4191 (1 page) | **7** — its credited-item dividers, retained |

So change 7 zeroed the charge-row dividers on the invoice while the credit memo's own dividers survive, exactly as intended. The credit memo also picks up the SV-9870 mirror where it applies: same 56px side inset, and the disclaimer at **9.0px / #4B5565**.

### One measurement note — not a defect, no action needed
**The rendered side margin is 56px, not the 48px the ticket computes.** The change itself is exactly as written (`.invoice-pdf-new` padding-left/right 42px → **18px**, confirmed). The ticket's arithmetic ("with the 30px page margin that is 48px a side") omits an ~8px container margin between the `@page` margin and `.invoice-pdf-new`. Measured content box on every page: x0 = 42.0pt, x1 = 553.3pt, i.e. **56px a side**.
This is corroborated by the spec's own **G-R4 634px content box**, which only reconciles with the pre-change inset of 30 + 8 + 42 = 80px a side (793.7 − 160 = 633.7px). After the change: 30 + 8 + 18 = 56px → 681.7px content, which is exactly what renders.
Consequence: the document is **more** conservative than intended and stays comfortably above the half-inch printer-safe floor the ticket sets. Worth a line in the ticket so nobody later "corrects" it down to 48px.

---

## SV-9857 — a tall work line moves to the next page whole — PASS (fixed by SV-9870 change 2)

The reported defect (page 1 ending after the identity chips, blank to the footer) does not occur.

- **Work lines now split across the page boundary.** On S2-8627, line **02 "Service - Transmission"** begins on page 1 with its SCOPE OF WORK and page 2 **resumes the same story mid-sentence** ("Filled the transmission with Allison-approved oil…") before LABOR and PARTS. Same pattern on S2-16541, S2-15586, S2-10056, S2-16012.
- **Page 1 is filled to 88–94%** on 9 of the 11 documents.
- The safety rules the ticket wanted kept are kept: 0 orphaned headings, 0 separated footers over 39 pages.

**Implemented as Option A, not the recommended Option B.** SV-9857 recommended a deferral threshold; the shipped fix is SV-9870 change 2 — let the line split, keeping the label and footer glue. That is what SV-9870 prescribes and it is recorded there as a sanctioned reversal of S12-R10 / SV-9671. Worth closing SV-9857 explicitly on that basis rather than as "Option B done".

**Residual, and out of scope by the ticket's own words:** the two documents with lower page-1 fill (S2-6889 74.7%, S2-10250 69.7%) both end page 1 early because the **Summary block defers whole** to page 2. The design states plainly that "the Summary block still takes a page of its own when it does not fit… is untouched by any of this", and SV-9822 (same family) is closed OBSOLETE. Not an SV-9857 defect, but it is the remaining pagination waste on short invoices.

---

## Environment notes
- **Seeded:** credit memo **CM-4190** (`ZZAUTOTEST SV-9870 QA credit`, $12,345.00) on customer account `ebeb8706…`, created while trying to reach the credit-invoice render route. Harmless; per the standing rule a per-ticket QA branch needs no cleanup.
- **Org logo left as `L8_padded_transparent_800x800.png`** from the shape sweep. Re-upload via Administration → Settings → Organization if the next tester wants the original wordmark back.
- No document was edited; no invoice was re-issued. All rendering was read-only through the preview endpoint.

## Evidence
- `ev/exhibits/ex1-sv9849-centring.png` — three logo shapes against the page-centre line.
- `ev/exhibits/ex2-sv9857-linesplit.png` — a work line splitting across the page-1/page-2 boundary.
- `ev/exhibits/ex3-sv9870-print.png` — empty top margin on page 3; 9px/#4B5565 disclaimer beside the 280px Summary.

## Learnings saved (2026-09-10)

Two things from this pass were written into the standing books so they are not re-derived:

1. **`APP-ACTIONS-PLAYBOOK.md` §U.1 — never call a route "not found" until you have driven the screen
   that uses it.** My own miss this pass: I found `GET /api/invoices/preview?invoice_id=…&type=pdf` by
   driving the Finance tab and watching the network, then twenty minutes later probed blindly for the
   credit-memo route, collected 404/405s and reported the credit memo as *"could not be verified"*. The
   QA lead pointed me at Customers → Invoices tab → "Print credit memo", and that one click revealed
   `GET /api/credit-memos/{id}/pdf`. The generalised rule now in the playbook and in CLAUDE.md: before
   the word "blocked", ask **"which technique has already worked in this session, and have I tried it on
   this problem?"** — the failure was not lack of a method, it was not reusing one I already had.
2. **`APP-ACTIONS-PLAYBOOK.md` §AC — the printed-document QA recipe.** All the document endpoints
   (invoice/estimate PDF + HTML, credit-memo PDF, credit-memo seeding, logo upload with its `logo`
   multipart field), verifying print CSS from the served `type=html` (which also proves a change is
   print-only, and reads `@page` margins correctly instead of measuring them from text), and the
   pymupdf measurement set — page fill, content box from full-width rects, image-box centring across
   several logo aspect ratios, span size/colour, hairline counts for dividers, money-token multiset
   compare, and the pages-2+ mid-job assertion for orphan/widow rules. Plus the reminder that a ticket's
   own arithmetic can disagree with the CSS (the 56px vs 48px reconciliation) and that this is a note,
   not a defect.

## Before-vs-after exhibits — attempted 2026-09-10, NOT shipped (and why)

The QA lead ruled that these comments are read by non-technical people at the highest positions and must
carry a **before-vs-after comparison** (now Standing Rule 73 + playbook §AD). I tried to add one to all
three comments after the fact. **It could not be done bite-proof, so nothing was posted.**

What was established live:
- **The only pre-fix environment is staging** (`app.staging.shopview.com`, `v26.36.0-ede3d52`). Its
  session is **dead** — `POST /api/quick-login` → **401**, work-order list → **401**.
- **Every other QA branch is torn down** — `sv8733`, `sv8911`, `sv9065`, `sv9096`, `sv6295`, `sv8218`
  all return nothing for `index.html`.
- **The document CSS is server-side, not in the SPA bundle** — staging's `/css/index.S7x7Gk_8.css`
  contains 0 occurrences of `invoice-pdf-new`, `mh-logo`, `break-inside`, `organization-logo-new` — so
  the §P "read the deployed bundle without logging in" route cannot answer it either.
- **The ticket carries no reporter before-images**: `SV-9870`'s only attachments (60518, 60519) are the
  two exhibits I uploaded yesterday.

The one pair I could assemble, and why it was rejected:
- I still hold a **genuine pre-fix render from 2026-09-09** — staging `v26.35.9-58789c5`, work order
  **S2-17466**, id `bd929cc0-eef9-4276-b200-bcf1d57b57dd` — and **the same work order exists on the
  branch** (`GET /api/work-orders?search=17466` → `S9849-17466`, same id), rendered today via
  `POST /api/work-orders/invoices/estimate {work_order_id, type:"pdf", issue_date, due_date}` → 200.
- The numbers look like a perfect exhibit: **8 pages → 5**, and content per page rising from
  `716/636/762/705/700/715/639/386` to `751/783/774/769/793` (points down the 842pt page, footer
  excluded) — the half-empty pages filling up, exactly the SV-9857 + SV-9870 story.
- **But the two halves are not comparable.** The pre-fix render is labelled `Estimate: EST-S2-17466`
  and today's is `Invoice:` (the WO is now Approved), and although **the job list is identical
  (01–22 on both)**, the money differs — **39 money tokens appear only in the before and 8 only in the
  after**, so the branch copy's data has drifted from the staging copy. "8 pages → 5 pages" in front of
  a VP off two documents that are not the same document is precisely the bite Rule 73 exists to prevent.

**What would make it airtight:** fresh staging cookies (`sv_sso_session` / `PHPSESSID` / `cf_clearance`
for `.shopview.com`). With those the same document type can be rendered on both builds and the pair
becomes a true like-for-like — about fifteen minutes, and the three comments are updated in place by
`commentId` (76272 / 76273 / 76274), not stacked.

## Before-vs-after built 2026-09-10 — AND IT FOUND A REGRESSION I HAD MISSED

Fresh staging cookies arrived, so the before/after was built properly. **Staging is genuinely the
pre-fix build:** its served document contains **0** occurrences of `break-inside: auto` and **0** of
`flex: 0 0 210px`, while the branch document has 1 and 2. Staging `v26.36.0-ede3d52`, branch
`v26.36.0-3340667`, both read live.

Method: the **same work orders** rendered on both builds through the **same endpoint with the same
parameters** — `POST /api/work-orders/invoices/estimate {work_order_id, type:"pdf"|"html",
issue_date, due_date}` → 200 on both. Four documents: `fa8aec20` (S-8627), `2dfb7f51`, `4c269aef`,
`d2cea2b7`.

### The two exhibits that show the fixes working
- `ev/before-after/ba1-sv9849-logo-centre.png` — masthead, same invoice. Logo **+47.7 pt off page
  centre before, +0.0 pt after**, measured from `page.get_image_info()`.
- `ev/before-after/ba2-sv9870-9857-paper-9-to-5.png` — every page of the same invoice, both builds:
  **9 sheets → 5**, with subtotal `$4,949.72` and total `$5,197.20` identical on both, and pages
  filling to the bottom instead of stopping early (content ends at
  `356/586/689/782/718/442/652/636/429` before, `792/733/768/760/708` after).

### 🔴 THE REGRESSION — the per-line footer has lost its Labor and Parts figures
`ev/before-after/ba3-line-footer-regression.png`.

Markup, same document, same line, both builds:
- **staging:** `<div class="job-foot avoid-break-inside"><span>Labor <b>$400.00</b></span><span
  class="ltot with-divider">Line total <b>$400.00</b></span></div>`
- **branch:** `<div class="job-foot avoid-break-inside"><span class="ltot">Line total
  <b>$400.00</b></span></div>`

Every job footer in the document, counted (not sampled):

| build | Labor + Parts + Line total | Labor + Line total | Parts + Line total | Line total only |
|---|---|---|---|---|
| staging (pre-fix) | 12 | 5 | 2 | 3 |
| branch (fixed) | 0 | 0 | 0 | **22** |

Across all four documents — **65 work-line footers** — the pre-fix build prints `Labor` on 50 and
`Parts` on 45; the branch prints **0 and 0**, while the `Line total` count is unchanged
(13/13, 13/13, 22/22, 17/17) and the values themselves are correct.

**Why this is a defect and not a density change:**
- Spec **S5-R9**, quoted verbatim inside SV-9773: *"Each work line shows a footer with figures labeled
  exactly "Labor", "Parts", and "Line total". The Labor and Parts figures are that line's own totals
  after its line-level fees and discounts; "Line total" is their sum."*
- **SV-9773 is Done** (resolved 2026-09-09) and its whole point was to make those two figures
  *correct*, not to remove them.
- SV-9870 states the opposite twice: *"Every step was verified to print identical money figures before
  and after"*, *"Money figures were hashed and compared before and after every change"*, and lists
  under **Not this ticket**: *"The per-line SCOPE OF WORK / LABOR / PARTS headings and Line total
  rows"*. All eleven of its changes are CSS declarations; this is a markup change.

**Consequence: the SV-9870 PASS I posted is wrong on this point and comment 76273 needs correcting.**
I found it only because the QA lead required a before-vs-after comparison — the fix's own 11 changes
all verify clean, and no amount of after-only checking would have surfaced it. That is now Standing
Rule 73, and this is its first catch.

**Not yet done, awaiting the QA lead:** correcting the three comments in place, and raising the defect.

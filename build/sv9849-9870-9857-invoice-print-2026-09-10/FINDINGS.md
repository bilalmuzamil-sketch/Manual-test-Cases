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


---

# RETRACTION — the "line-footer regression" I reported was NOT a regression

Earlier in this file I reported that the fixed branch had lost the per-line `Labor` and `Parts`
figures from every work-line footer, called it a breach of spec S5-R9, and recommended reversing
SV-9870's PASS. **That was wrong and it is retracted in full.**

**The real cause:** the two toggles **"Summarize parts total"** and **"Summarize labor total"**,
under the settings (gear) icon on the work order's Finance tab, were **switched OFF on the branch
work orders and ON on the staging work orders**. Those toggles are what print the two figures. The
branch code was never involved.

Proven live, not argued:

- `GET /api/invoices/{workOrderId}/settings/view` — staging `summarizePartsTotal: true`,
  `summarizeLaborTotal: true`; branch `false` / `false` on the same work orders.
- Setting them to `true` on the branch via `POST /api/invoices/{workOrderId}/settings/change`
  restored the figures **exactly** — same labels, same values, same count of footers.
- These settings are **per work order**, not per organisation (verified: they differ between work
  orders inside the same org).

**What I should have noticed and did not.** The difference was **perfectly uniform** — every one of
the 65 footers, on all four documents, in the same way. Code changes are rarely that tidy; a toggle
always is. And other fields in the very same settings object differed in the *opposite* direction
between the two environments, which alone said "these two environments are configured differently".
I had the evidence an hour before I understood it, and I explained it away as data drift.

This is now **Standing Rule 75** — a difference between two environments is a **configuration**
difference until proven otherwise; read the settings object on both and match it before the word
"regression" is used. The wrong exhibit `ba3-line-footer-regression.png` has been deleted.

---

# FULL RE-TEST — 2026-09-10, all three tickets, settings matched

Run after the retraction, at the QA lead's instruction, because the three comments are read by the
company's most senior people and the verdicts have to be right.

## Method

- **Pre-fix build:** `app.staging.shopview.com` / `api.staging.shopview.com` —
  `v26.36.0-ede3d52`, `index.html` last-modified Wed 09 Sep 2026 11:50:48 GMT.
- **Fixed build:** `sv9849.qa.shopview.com` / `sv9849api.qa.shopview.com` —
  `v26.36.0-3340667`, last-modified Thu 10 Sep 2026 02:40:22 GMT.
- Same organisation (Foothills Group Inc, shop "Staging Heavy Duty - 9919"), **same work-order ids**
  on both — the branch is a clone.
- **Eight documents**, not one: `0a41cc04 · 2d750857 · 2dfb7f51 · 3d78d797 · 4c269aef · 78dd906f ·
  d2cea2b7 · fa8aec20`, rendered through the same endpoint with the same parameters on both builds:
  `POST /api/work-orders/invoices/estimate {work_order_id, type:"pdf"|"html", issue_date, due_date}`
  → 200 on both.
- **Display settings matched per work order before rendering** (the lesson above). Six of the eight
  differed — on `partNumber`, `summarizePartsTotal` and `summarizeLaborTotal`. Every branch setting
  was snapshotted first (`/tmp/rt/branch-settings-ORIGINAL.json`) and **restored afterwards,
  byte-identical on 8 of 8**.
- Staging confirmed to be genuinely the pre-fix build: **0** occurrences of `break-inside: auto` and
  **0** of `flex: 0 0 210px` in its served document; the branch has 1 and 2.

## Per-document measurements (all 8, no sampling)

| doc | sheets | money identical | footers Labor/Parts | page-1 fill | pages 2+ starting mid-job | orphan headings, split footers |
|---|---|---|---|---|---|---|
| 0a41cc04 | 6 → 5 | YES | 10/7 → 10/7 | 738 → 784 | 1/5 → 4/4 | 0,0 → 0,0 |
| 2d750857 | 5 → 3 | YES | 6/3 → 6/3 | 710 → 729 | 1/4 → 2/2 | 0,0 → 0,0 |
| 2dfb7f51 | 6 → 5 | YES | 11/8 → 11/8 | 533 → 733 | 1/5 → 4/4 | 0,0 → 0,0 |
| 3d78d797 | 3 → 2 | YES | 0/0 → 0/0 | 687 → 756 | 1/2 → 1/1 | 0,0 → 0,0 |
| 4c269aef | 7 → 5 | YES | 11/10 → 11/10 | 672 → 766 | 2/6 → 4/4 | 0,0 → 0,0 |
| 78dd906f | 4 → 3 | YES | 7/5 → 7/5 | 561 → 722 | 1/3 → 2/2 | 0,0 → 0,0 |
| d2cea2b7 | 12 → 8 | YES | 17/19 → 17/19 | 581 → 784 | 1/11 → 7/7 | 0,0 → 0,0 |
| fa8aec20 | 9 → 5 | YES | 11/8 → 11/8 | 356 → 792 | 1/8 → 4/4 | 0,0 → 0,0 |

"page-1 fill" = the y-coordinate of the lowest content on page 1, out of a ~800 pt content box.

## SV-9870 — print density — **PASS**

- **52 sheets → 36 across the eight documents, 31% fewer paper.** Every one of the eight shrank.
- **Money is untouched: the full multiset of money tokens is identical on all 8 documents**, in both
  directions. Subtotals and totals match exactly.
- **The per-line `Labor` / `Parts` footer figures are identical on all 8** once the display settings
  are matched — the retracted "regression" does not exist.
- **All 11 declared CSS changes verified in the branch's own served print CSS:** 41 of the 45
  declared values match exactly; the remaining 4 (`.job-top` / `.scope-lbl` / `.csec-head`
  `break-after: avoid`, `.job-foot` `break-before: avoid`) are in the **base** rules and change 2
  says to KEEP them, so **45/45 accounted for**. The 26 pre-fix values are confirmed present in
  staging's base rules.
- **Print-only proven**, not a screen change: `.job { break-inside }` is `avoid` in the base rules
  and `auto` only inside `@media print`.

## SV-9857 — page breaks / no half-empty pages — **PASS**

- Pages 2 and onward now begin **mid-job** (i.e. a job flows across the break instead of being
  pushed whole): **28 of 28 on the branch, versus 9 of 40 on staging.**
- **0 orphaned job headings and 0 footers separated from their line, on all 8 documents.**
- Page-1 fill rose from an average of **604** to **758** out of ~800 pt. The worst case, `fa8aec20`,
  went from **356 → 792** — a page that was more than half blank is now full.

## SV-9849 — logo centring — **PASS**

Measured from `page.get_image_info()` — horizontal offset of the logo's centre from the page centre:

| doc | staging | branch |
|---|---|---|
| 0a41cc04 | +38.05 pt | +0.00 pt |
| 2d750857 | +45.81 pt | +0.00 pt |
| 2dfb7f51 | +37.44 pt | +0.00 pt |
| 3d78d797 | +42.01 pt | +0.00 pt |
| 4c269aef | +42.83 pt | +0.00 pt |
| 78dd906f | +50.40 pt | +0.00 pt |
| d2cea2b7 | +38.99 pt | +0.00 pt |
| fa8aec20 | +47.69 pt | +0.00 pt |

The pre-fix offset **varies per document** (+37.44 to +50.40) — that is the point: the logo sat
wherever the text beside it pushed it. On the branch it is **+0.00 pt on every one**.

**Logo-shape stress test — 8 different shapes uploaded and rendered (`logo-L1`…`L8`):** a tiny
square, a wide banner, an extreme-wide strip, a tall narrow strip, and four ordinary shapes. **All
8 render at +0.00 pt** and **none exceeds the 157.5 pt (210 px) slot** — the two wide ones clamp to
exactly 157.5 pt. The organisation's real logo was recovered from a staging PDF and **re-uploaded
afterwards (HTTP 201)**, so the environment is as it was found.

## Before-vs-after exhibits (Standing Rule 73)

- `ev/before-after/ba1-sv9849-logo-centred.png` — the masthead of the same invoice on both builds,
  with the page-centre line drawn: **+47.69 pt off centre before, +0.00 pt after.**
- `ev/before-after/ba2-sv9870-paper-9-to-5.png` — **every page** of the same invoice on both builds:
  **9 sheets before, 5 after**, with the same subtotal and total on each side.
- `ev/before-after/ba3-sv9857-page-fill.png` — page 1 of the same invoice, before (the blank half
  boxed) and after (full).

## Honest limits

- Both builds are the **same organisation's** data on the **same eight work orders**; a different
  organisation's documents were not rendered.
- The comparison is of the **generated documents**, measured from the PDFs and the served HTML/CSS.
  Nothing was judged by eye.
- `sv9849.qa.shopview.com` is a per-ticket QA branch. Per Standing Rule 62, a per-ticket branch is
  final once we pass it, so these verdicts are **not** provisional and no re-check queue is opened.

## What is still open

- The three posted comments (**76272** SV-9849, **76273** SV-9870, **76274** SV-9857) do **not** yet
  carry the before/after exhibits. They should be rebuilt as **one complete comment each, corrected
  in place by `commentId`** — never stacked — awaiting the QA lead's go-ahead.
- No defect is outstanding from this work. The retracted one did not exist.

---

# The three QA comments rebuilt with before-vs-after — 2026-09-10, and the pre-post gate that ran first

Authorised by the QA lead. Each comment was **rebuilt as one complete comment and updated in place by
its comment id** — 76272 (SV-9849), 76273 (SV-9870), 76274 (SV-9857). Nothing was stacked, and no
comment contains any "we said X, actually Y" framing: each states the current result and its evidence.

## The pre-post bite-proof gate (Standing Rule 72), run immediately before the first write

| # | Check | Result |
|---|---|---|
| 1 | Build markers re-read live on **both** environments | Branch `v26.36.0-3340667` (last-mod Thu 10 Sep 02:40:22 GMT) and staging `v26.36.0-ede3d52` (Wed 09 Sep 11:50:48 GMT) — both unchanged since the pass |
| 2 | Ticket state re-read live | SV-9849 Ready for Production · SV-9870 Ready for Production · SV-9857 TESTING QA; **no new comment on any of the three** since ours |
| 3 | Every embedded image URL curled | 6 of 6 returned HTTP 200 from the committed path |
| 4 | Every figure traced to a live measurement from this pass | Yes — sheet counts, offsets, page-fill and the money comparison all come from the 8-document run |
| 5 | Named test data still live | The named documents were rendered live this pass |
| 6 | Human-voice / no AI fingerprint scan of reader-facing text | Clean |
| 7 | Format — verdict first line, complete table, captioned images, technical detail last | Confirmed in all three |
| 8 | Read back from Jira after posting | Done — see below |

## Read-back after posting

| Ticket | Comment | First line | Images, in order | Table rows |
|---|---|---|---|---|
| SV-9849 | 76272 | `OVERALL QA STATUS: PASSED — masthead logo` | ba1-sv9849-logo-centred, then ex1-sv9849-centring | header + 8 |
| SV-9870 | 76273 | `OVERALL QA STATUS: PASSED — printed invoice paper reduction` | ba2-sv9870-paper-9-to-5, then ex3-sv9870-print | header + 11 |
| SV-9857 | 76274 | `OVERALL QA STATUS: PASSED — a tall work line no longer leaves the rest of the page blank` | ba3-sv9857-page-fill, then ex2-sv9857-linesplit | header + 5 |

## What changed in the comments, and why

- **Every comment now opens its evidence with a BEFORE vs AFTER exhibit** (Standing Rule 73) — the same
  document on the pre-fix build beside the fixed build, each half labelled with its build marker, with
  one plain sentence of what changed. That is the part a non-technical reader actually reads.
- **SV-9870's "we have no before version here" paragraph is gone**, because it is no longer true. It is
  replaced by the measured comparison: **52 sheets → 36 across eight invoices, 31% less paper, all eight
  shorter and none longer**, with the money proven identical between the two builds.
- **SV-9857 now carries real before-and-after numbers** instead of after-only percentages: pages after
  the first begin mid-job **28 of 28** on the fixed build against **9 of 40** before, and average page-1
  fill rises **604 → 758**.
- **SV-9849 now carries the measured drift it fixes** — **+37.44 to +50.40 pt off centre before,
  +0.00 pt after, on all eight** — rather than only the after-state.
- **The method is stated in each technical section**: the same work orders, the same endpoint, and the
  **document display settings read and matched per work order** before rendering, so the build is the
  only variable. That sentence is what makes the comparison defensible if anyone re-runs it.

---

## Follow-up ticket raised from this testing — SV-9871 (2026-09-10)

**The ask.** The QA lead sent the downloaded PDF of `INV-S2-8627` and asked for a follow-up ticket on
SV-9857 saying *"the Downloaded PDF invoice breaks the line in two parts"*, highlighted in the
screenshot, with the story defect attached to the relevant story.

**What I said before writing it (Standing Rule 61).** SV-9857's own description lists **Option A —
"Let a work line split across a page boundary"** — and that is exactly what shipped (SV-9870 change 2,
`.job { break-inside: auto }` in the print block). A ticket reporting *"the line breaks in two parts"*
would report **the fix we had just passed** as a defect. I put that on the table rather than writing
it, and offered the defensible reframing: **the split is correct; what is missing is the job heading
on the continuation page.** The QA lead chose that framing, and chose **SV-9151 (Story 12 — Document
Visual Standard)** as the story to attach it to.

**What the document actually shows** (live, `GET /api/invoices/preview?invoice_id=443f3092-8c52-4a3a-9c53-a1d8f20d01d5&type=pdf`,
branch `sv9849.qa.shopview.com`, build `v26.36.0-3340667`):

- The invoice is **5 pages**; **4 of them are continuation pages**.
- **Only page 2 opens mid-job.** Page 1 ends mid-sentence inside job **02 Service - Transmission**
  ("… Cleaned the oil"), and page 2 opens with the rest of that sentence — **no job number, no job
  title, no "continued" marker** — then prints **Labor $824.75** and **Line total $1,159.49** under a
  heading that is on the previous page.
- **Pages 3, 4 and 5 each open with their own job heading** (06, 09, 14), so the scope is one
  continuation page out of four, not a whole-document fault.

**The ticket.** **[SV-9871](https://shopview.atlassian.net/browse/SV-9871)** — *"Printed invoice: a
split work line has no job heading on its continuation page"* · Bug · **priority Medium** · Product
Area **Work Orders** · status Open · **no parent** (deliberate: SV-9857 is itself parentless, so the
follow-up matches it rather than inventing an epic). Structure: **"Found while testing SV-9857"** as
the top line with the link (Rule 70) → blank line → short plain description (Rule 67) → "How to
reproduce" with the branch link and five click-by-click steps → the annotated exhibit → "Fastest way
to reproduce" (Rule 71) → rule → **"Technical details" last**.

**Links, verified by read-back:** `Relates → SV-9857` and `Relates → SV-9151 (Story 12 - Document
Visual Standard)`.

**Exhibit.** `ev/exhibits/sv9857-followup-line02-split-no-continuation.png` — page-1 bottom above,
page-2 top below, five numbered callouts with a legend: (1) page 1 is the only place the job is named
"02 Service - Transmission"; (2) page 1 stops mid-sentence; (3) page 2 opens with the rest of that
sentence, unlabelled; (4) Labor $824.75 prints under a heading on the previous page; (5) Line total
$1,159.49 does the same. Callout tags sit in the left margin so **no caption covers a value being
evidenced** (Rule 64).

**Two things fixed while building the exhibit, both caught by re-reading the rendered PNG:**
page-1 boxes were drawn 42 px high because the crop offset was applied but not the canvas paste
offset (`O1 = P1Y - ay/Z`), and the callout circles were initially sitting on top of "$334.74" and
"$1,159.49".

**One honest cost decision:** I did **not** start the Chromium/MITM harness to read one button label,
so the reproduction step says *"Download the invoice PDF"* rather than inventing a control name
(Rule 63 vs Rule 9 — stated rather than papered over).

### Rule-72 pre-post gate + read-back

| # | Check | Result |
|---|---|---|
| 1 | Build marker re-read live before writing | `v26.36.0-3340667`, unchanged |
| 2 | The PDF is the same document the QA lead attached | same invoice number `INV-S2-8627`, 5 pages, same split point |
| 3 | Exhibit URL on `raw.githubusercontent.com` | **HTTP 200** |
| 4 | Priority | **Medium** (never Low/High) |
| 5 | Product Area | **Work Orders** (`customfield_10153` = 10120) — required on SV Bug creation |
| 6 | Links | `Relates SV-9857`, `Relates SV-9151` — both read back from Jira |
| 7 | Human voice, no AI fingerprint | scanned, clean |
| 8 | SV-9857 comment **76274** read back after the in-place update | first line `OVERALL QA STATUS: PASSED …` intact · **2 media, correct order** (before/after, then the detail exhibit) · **6 table rows** · new section *"A separate issue was raised from this testing"* present · `updated 2026-09-10T00:40:09.921-0500` |

**No new comment was stacked on SV-9857** — comment 76274 was updated in place by `commentId`.

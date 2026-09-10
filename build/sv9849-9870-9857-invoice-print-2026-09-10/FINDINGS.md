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

**Not verified this pass (honest):** the **credit memo** masthead, and the **no-logo shop** path (the logo is org-level and there is no remove option on this env — the same limitation Mudassir recorded). Long-number wrapping was verified at the CSS layer only, not driven with a 20-character number.

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

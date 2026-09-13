# SV-9979 — "Legacy text renders ~2px larger" — QA of the fix branch, 2026-09-13

**Verdict: the reported problem is FIXED.** One thing the fix did not restore is recorded below,
and a responsiveness sweep was run on top of the ticket.

## Builds, read live at the start of the run

| | marker | note |
|---|---|---|
| Fix branch `sv9979.qa.shopview.com` | **v26.36.4-bbd06a5** | last-modified Sun 13 Sep 2026 05:07:17 GMT, etag `fffb10ce…` |
| Production `app.shopview.com` | **v26.36.4-3e1c643** | the build the problem was reported on |
| Legacy QA `sv9901.qa.shopview.com` | **v26.35.10-7b9a47d** | the build the type is meant to match |

All three on the Legacy layout (`documentDesign: legacy`; sv9901 predates the setting and is Legacy always).
**The same logo file on all three — 283 × 104 px, 18,819 bytes, sha256 `b102a952f47b2d6d`** — so nothing
below is explained by different pictures. The fix branch carries the **same work order and the same
invoice** as sv9901 (`S2-4219` / `INV-S2-4219`), so it is literally the same document on both.

## 1. The reported problem — FIXED

Same document, same viewport 1500 × 1100, measured live:

| | sv9901 ORIGINAL | production (reported) | sv9979 FIX |
|---|---|---|---|
| preview zoom | none — the wrapper does not exist | **1.11421** | **1** |
| shop-name line, rendered height | **28.61 px** | 31.86 px (**+11.4%**) | **28.61 px** ✔ |
| declared type ladder | 19.2 / 14.4 / 14 / 12.8 / 8.64 | same | same |
| rendered type | 19.20 px | **21.39 px** | **19.20 px** ✔ |

**The type on the fix branch is byte-for-byte the size it is on v26.35.10.** That is exactly what the
ticket's *Expected* asks for.

**How it was fixed** (read from the deployed code, `InvoiceDisplay.xIw-eD6h.js`):

```js
const y = 718, k = 1, G = "invoice-design-legacy";
const S = 800 / y;                                  // 1.1142 - the modern zoom
const M = /class="(?:[^"]*\s)?invoice-design-legacy(?:\s[^"]*)?"/.test(html);
const s = M ? k : S;                                // legacy -> 1
```

The document now carries a **`invoice-design-legacy`** class and the app skips the zoom for it.
Confirmed both ends: the class is **present** in the fix branch's document and **absent** from
production's and sv9901's.

## 2. Covered document types

The ticket asks for Work Order Invoice, Estimate, Credit Invoice, Parts Sale Estimate and Parts Sale
Invoice. Driven live on the fix branch:

| document | marker | zoom | rendered type |
|---|---|---|---|
| Work Order **Invoice** (paid, INV-S2-4219) | yes | 1 | 19.2 px ✔ |
| Work Order **Estimate** (S9979-17358) | yes | 1 | 19.2 px ✔ |
| Approved Work Order estimate (S9979-17435) | yes | 1 | 19.2 px ✔ |
| **Parts Sale** estimate | yes | 1 | 19.2 px ✔ |
| **Credit Invoice** | **NOT VERIFIED** | — | — |

**Honest limit:** no credit memo exists on the branch and one was not created, so the credit document
was not observed. The fix's stylesheet does name `.credit-pdf` alongside `.invoice-pdf-new`, which
suggests it was considered — but that is reading code, not observing behaviour, and it is not a pass.

## 3. Print — unchanged, as it should be

Both PDFs, same invoice, same logo file:

| | sv9901 | sv9979 fix |
|---|---|---|
| type sizes | 9.6 / 10.5 / 10.8 / 14.4 pt | **identical** |
| pages | 3 | 3 |
| logo drawn | 178.50 × 65.60 pt | 159.43 × 58.59 pt |

Type identical — correct, the zoom never touched print. The **logo difference is not from this fix**:
it comes from the `SV-9975` logo rule (`width:238px` → `width:100%;max-width:238px`) which production
already carries and this branch inherits. Reported separately; the QA lead has it on hold.

## 4. What the fix did NOT restore

The zoom is gone, but the Legacy document is **still laid out at 718 px**
(`.invoice-sheet .invoice-pdf-new { width: 718px }` still applies), and it is no longer zoomed back up.
So on a normal screen the Legacy document is now **10.25% narrower than on v26.35.10**:

| | sv9901 ORIGINAL | sv9979 FIX |
|---|---|---|
| document content width | **800 px** | **718 px** |
| masthead row | 720 px | **638 px** |
| logo on screen | 238 px | **212.66 px** (10.6% smaller) |
| document height, same invoice | 2545.75 px | **2757.23 px** (+211 px of extra wrapping) |
| white page behind it | 800 px | 800 px — leaving an 82 px empty strip on the right |

**Whether that matters is a product decision, not a QA one.** 718 px is the true A4 content width, so the
preview now breaks lines where the PDF breaks them, which the 800 px preview never did. But it is not
"matching v26.35.10", and it is visible: a smaller logo and a taller document. Worth one sentence from
whoever asked for the 718 px layout.

## 5. Responsiveness — asked for on top of the ticket, and it found something

Swept the Finance-tab preview at **1920, 1600, 1440, 1280, 1100, 1024, 900, 820, 768, 600, 500, 430, 390,
360** on the fix branch, measuring every leaf text element's box plus the logo's, and reporting any pair
that overlaps by more than 1.5 px in both axes.

**Fix branch: 0 overlaps at all 14 widths.** Nothing collides, nothing is cut off, and the document scales
down to fit rather than scrolling sideways (verified by eye at 390 px, not only by the numbers).

**The original build is the one with the problem.** Same document, same widths:

| width | sv9901 ORIGINAL | production | sv9979 FIX |
|---|---|---|---|
| 1280 | 0 overlaps | 0 | 0 |
| 768 | **1 overlap** — "Invoice: INV-S2-4219" over the logo, 18 × 20.6 px | 0 | 0 |
| 390 | **2 overlaps** — the invoice number (94 × 77.8 px) and the invoice date (83 × 20 px) both under the logo, and the page scrolls sideways | 0 | 0 |

So the scaling the app introduced is what makes the preview usable on a narrow screen; the defect was
only that it **also enlarged** the Legacy document on a normal screen. The fix keeps the shrink-to-fit
and removes the enlargement — `Math.min(cap, width/718)` with the cap now 1 for Legacy.

**In scope?** No — the ticket is about type size. It is reported here because it was asked for and
because it is a real (pre-existing, now-fixed) defect on the build the ticket treats as the reference.

## Evidence

* `ev/01-text-size-three-builds.png` — original / production / fix, same document, annotated.
* `ev/02-responsiveness-390.png` — the overlap on the original build at phone width, beside the fix.

## State

Nothing was written on the fix branch. Nothing was written on production. No Jira write of any kind.

---

# Credit Invoice — the last row, now closed (2026-09-13)

A credit memo did not exist on the branch, so one was created:
**CM9979-4189**, $12.34, store credit, reason `ZZAUTOTEST credit memo for SV-9979 document check`,
customer Abode Trucking & Repair (`POST /api/credit-memos` → **201**).

Printing it calls **`GET /api/credit-memos/{id}/pdf` directly — there is no in-app HTML preview for a
credit memo**, so `.invoice-sheet` and its zoom never apply to it and the reported problem cannot occur
there. The PDF was measured anyway: 1 page, 595.28 × 841.89 pt, fonts Nunito-Sans / Nunito-Sans-Bold,
type ladder **6.48 / 9.6 / 10.5 / 10.8 / 14.4 pt** — the standard ladder, identical to every other
document measured on every build.

**All five document types the ticket lists are now covered.**

---

# What was posted (2026-09-13)

* **[SV-9980]** filed — *"Legacy invoice preview renders about 10% narrower on screen than the old build"*.
  Bug · priority **Medium** · parent **SV-9892** · `Relates` → SV-9979 · Product Area Work Orders ·
  first line credits SV-9979 · one annotated attachment, verified rendering as a real Jira file.
  Every field read back from Jira after writing.
* **SV-9979 comment `76429`** — the QA result. First line is the verdict, then the before/after exhibit,
  a 9-row checks table, the SV-9980 exhibit, the responsiveness exhibit, the answer to the open question
  in the previous comment, the honest limits, and the technical section last.
  Read back: **3 media nodes, all `type: file`, in order, correct dimensions; 16 table rows; three
  SV-9980 references all resolved to real issue links; no AI fingerprint.**

## Pre-post gate (Standing Rule 72)

* Build markers re-read live at pass start **and again at 10:40:53Z immediately before posting** —
  all three identical both times.
* The `invoice-design-legacy` marker class re-checked live at gate time: present on sv9979, absent on
  sv9901 and production.
* Ticket re-read at gate time: still In Progress, still 1 comment — nothing had moved under us.
* Every figure in the comment traces to a measurement taken this pass; every named record verified live
  on the branch.
* Images uploaded as real Jira attachments and verified **from the posted comment**, not from the source.

## Outstanding

* **SV-9980** is with the developer — whether the Legacy preview should be 800 px like v26.35.10 or
  718 px to match the PDF is a product call, not a QA one.
* The printed logo being ~11% smaller (SV-9975's rule, inherited) is **not** raised — on hold by the
  QA lead's decision.

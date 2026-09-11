# The controlled test: one work order, two builds — 2026-09-11

**Status: analysis only. Nothing filed, nothing posted.**

The QA lead supplied both branches for the **same work order**, which makes this the first comparison
where the data is held constant and only the build changes.

| | branch | build marker (read live) | role |
|---|---|---|---|
| **OLDER** | `sv9901.qa.shopview.com` | **v26.35.10-7b9a47d** | the version the Invoice Design Selection spec names as the Legacy baseline |
| **NEWER** | `sv9872.qa.shopview.com` | **v26.36.2-ad8b0e2** | SV-9872, the engineering review branch for the restored Legacy design |

Work order `217b4166-4027-4320-9c21-110b3a82e469` — **S-16810**, status *paid*, 30 job lines.
Invoice `4aec4ae9…` on sv9901 and `9cec61bf…` on sv9872 (separate databases, same document).

---

## The one real difference was a setting, not the template

Before comparing anything, the invoice display settings were read on both branches for this work
order (`GET /api/invoices/{woId}/settings/view`). **Nine of the ten fields matched. One did not:**

| setting | sv9901 (v26.35.10) | sv9872 (v26.36.2) |
|---|---|---|
| laborRate · laborHours · laborCost | true | true |
| partNumber · partQuantity · partCost · partDescription | true | true |
| summarizePartsTotal | true | true |
| **summarizeLaborTotal** | **true** | **false** |
| disclaimer | identical text | identical text |

Rendering the invoice on sv9872 **as found** gives **10 pages and 0 "Labor Total" rows**. Setting
that one switch to `true` — nothing else — gives **11 pages and 29 "Labor Total" rows**, which is
exactly what v26.35.10 prints.

**So the missing Labor Total rows are one switch on the work order's Finance tab, not a template
change.** That closes the question left open by the earlier PDF-only passes, where two documents both
supplied as "the old one" disagreed with each other about those rows.

Exhibit: `ev/EX2-the-switch.png`.

## With the settings matched, the two builds produce the same document

| check | result |
|---|---|
| Pages | **11 on both** — the same content falls on the same page |
| Text elements | **1,050 on each** |
| Elements identical in position, size, weight, colour and text | **1,037 of 1,050** |
| Elements that differ | **13 — and all 13 are the same thing**: the branch's own name inside the invoice number, `S9901-16810` against `S9872-16810` (once in the masthead, once in the Service Order cell, once in each of the 11 page footers). Same y, same x to a hundredth of a point, same size, same weight, same colour. |
| Lines, rules and boxes | **225 on each, 0 differ** — same positions, same heights, same fills |
| Letterhead image | byte for byte the same file (sha256 `162e66d103f99aed…`) |

**No element of the design differs.** On this document, the restored Legacy template on v26.36.2 meets
the spec's requirement that it be byte-identical to v26.35.10.

Exhibit: `ev/EX1-same-invoice-both-builds.png`.

---

## Honest limits

- **This is one work order.** It is a strong test because the data is held constant, but it exercises
  only the elements this invoice contains: labour lines, part lines, a payment row, the summary block,
  the signature block and the disclaimer. It does **not** exercise a credit invoice, a part-sale
  document, a shop with no logo, a deposit, or an invoice with no due date — all of which the
  Invoice Design Selection spec calls out separately.
- **I changed one setting on sv9872** (`summarizeLaborTotal` false → true, via
  `POST /api/invoices/{woId}/settings/change`, HTTP 200, read back and verified) so the comparison
  would be like for like. Per-ticket QA branches are disposable and need no cleanup, and leaving it on
  makes sv9872 match v26.35.10 — but it is **not** how I found it, and that is stated here so nobody
  is surprised.
- The 13 differing elements are the branch name. On a real deployment they would be identical too.

## Files

| file | what |
|---|---|
| `v26.35.10-sv9901.pdf` | the invoice rendered on v26.35.10 |
| `v26.36.2-sv9872-settings-matched.pdf` | the same invoice on v26.36.2 with the settings matched |
| `v26.36.2-sv9872-as-found.pdf` | the same invoice on v26.36.2 before the switch was corrected |
| `ev/EX1-same-invoice-both-builds.png` | the template proof |
| `ev/EX2-the-switch.png` | the switch, before and after, on the same branch |

Rebuild the exhibits with `python3 make_exhibits.py`. No credentials are stored in this folder.

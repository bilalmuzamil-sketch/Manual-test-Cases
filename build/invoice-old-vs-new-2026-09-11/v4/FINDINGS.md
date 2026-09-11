# Strict comparison — INV-S9901-16810 (older) vs INV-S2-10056 (newer), 2026-09-11

**Status: analysis only. Nothing filed, nothing posted.**

The QA lead asked for these two and only these two, compared strictly.

Both files are **byte-identical to the copies supplied earlier** (`72b665bb…` and `953d31c2…`), so
this is a deeper pass over the same pair, not a re-run.

| | document | shop | producer | pages |
|---|---|---|---|---|
| **OLDER** | Invoice **INV-S9901-16810**, invoice date Sep 11 2026 | Staging Heavy Duty - 9919 | WeasyPrint 69.0 | 11 |
| **NEWER** | Invoice **INV-S2-10056**, invoice date Oct 2 2025 | Heavy Duty - 9919 | WeasyPrint 69.0 | 5 |

Same shop — GST# 812694966 RT0001, 9919 Shepard Road SE, Calgary — and the same render engine.

---

## Verdict: no design difference

Measured out of the PDFs themselves, not observed by eye.

### Identical

| what | value on both |
|---|---|
| **Embedded font subsets** | `VPGUFU+Nunito-Sans-Bold` and `ZFIQEG+Nunito-Sans` — **the same subset tags**, so the same glyph sets were embedded |
| Type sizes | 6.48 · 9.6 · 10.5 · 10.8 · 14.399pt |
| Line metrics | ascender 1.011, descender −0.353 on every size |
| Colours | #000000 text, #424242 disclaimer, #a8a8a8 rule |
| Rule and border classes | h 0.75 black · h 0.75 grey · h 16.09 totals cells · white cards — same fills, same widths, no others |
| Page geometry | 595.28 × 841.89pt |
| White card heights | first page **793.37**, middle pages **776.87**, last page **295.74** |
| Line-table columns | Description **90.41** · Quantity **339.40** · Rate **442.17** · Amount **498.79** |
| Money column right edges | **465.11** · **537.00** · **539.25** — the complete set, identical |
| Rule above the line table | y **346.41**, x 58.50 → 536.78 |
| Line-table header rule | y **376.30**, x 60.75 → 534.53 |
| Per-line separator rules | x 60.00 → 535.28 |
| Baseline ladder | masthead 30.0 · **Bill To 126.0** · bill-to rows 145.64 / 160.37 / 175.10 / 189.83 / 204.56 · **asset headings 237.29** · asset values 257.62 · service-order values 321.58 · **line headings 355.41** · **first job line 384.85** |
| Row pitch inside a job | **13.09pt** between description rows · **17.59pt** to each totals row · **29.44pt** title to first item |
| Between jobs | **27.94pt** |
| Continuation-page headings | Description/Quantity/Rate/Amount at the same four x values |
| Footer | y **814.1**, same three fields |
| Template vocabulary | every fixed label the template prints appears in both — 44 of 45 strings match exactly |
| Per-line totals pattern | Parts Total + Labor Total + Line Total on every job except the one split across a page break (29 of 30 old, 12 of 13 new) |
| Gutter label alignment | on the price row for 63 of 93 labels (older) and 30 of 43 (newer) — the same ~68%, the rest sitting above it on multi-row descriptions |
| Letterhead image | byte-for-byte the same file, sha256 `17cf53f5141d7b3c…`, 11,904 bytes, on every page of both |

### The one visible difference

**"Service Order" prints on one line in the older invoice and wraps onto two in the newer one.**

That column has no fixed width — it sizes itself to its content. The older order number
**`S9901-16810` is 67.6pt wide**; the newer **`S2-10056` is 51.4pt**. The 16.2pt narrower column can no
longer hold the 69.3pt heading, so it breaks.

The same auto-sizing shifts the five columns of both header tables by at most **5.27pt**, and by
**exactly the same deltas in both tables** (−5.27 / −4.19 / −1.66 / −0.30), which is what a shared
column grid responding to content does. The older invoice's **Unit cell is empty**; the newer one
prints `49`.

Exhibit: `ev/EX2-service-order-wrap.png`.

### Everything else that differs is content

- **Shop name** — "Staging Heavy Duty - 9919" vs "Heavy Duty - 9919". Same GST number, address and
  phone; the letterhead is frozen onto an invoice when it is created and the newer file renders an
  **October 2025** invoice.
- **Remit-to block** — frozen the same way (Punta Gorda vs Foothills Group / Interstate Billing).
- **Masthead height** — the older shop name and document number each wrap, so its address block sits
  19.64pt lower. **"Bill To" is at y 126.0 on both regardless**, because that block is a fixed height.
  The visible consequence is a larger white gap above "Bill To" on the newer invoice — 46.90pt against
  27.26pt — caused entirely by the shorter shop name.
- **Asset row height** — "2019 Landoll Corporation 930e" wraps to three rows; "2006 Peterbilt 335"
  does not.
- **Page count** — 11 vs 5, because the older invoice carries 30 job lines against 13.

## Method

- `pymupdf` text spans for every position, size, font, colour and string; `get_drawings` for every
  rule, border and card; `get_fonts` for the embedded subsets; `extract_image` + sha256 for the
  letterhead.
- A **role-by-role skeleton diff** of both documents end to end (517 rows against 204) produced no row
  pattern present in one design and absent from the other.
- A **template-vocabulary diff** of every fixed label the template prints: 44 of 45 strings match; the
  45th is `Service Order` against `Service` + `Order`, the same words wrapped.

## Exhibits

| file | shows |
|---|---|
| `ev/EX1-strict-verdict.png` | both page 1s with the strict checklist |
| `ev/EX2-service-order-wrap.png` | the heading wrap, with the measured cause beside it |

Rebuild with `python3 make_exhibits.py`.

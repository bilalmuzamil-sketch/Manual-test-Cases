# Spec moved under us mid-pass — Confluence 755990532, live page v57
**Pulled:** 7 September 2026, minutes after Chris Ward's ruling on SV-9770.
**Compared against:** the snapshot taken earlier the same day (page last modified 5 September).
**Four changes.** Diffed line by line; nothing else in the document moved.

---

## 1 · S3-N1 rewritten + new S3-R10 — THE WORK ORDER FIELD SHOWS

Chris's ruling, verbatim: *"the field shows. The rule was wrong, not the build."* He identifies the
trailing-digits comparison as his own 2026-09-04 revision written to match the build, and reverses it.

**New S3-N1** — hidden in exactly two cases, shown in every other:
- **(a)** the document has no work order behind it (a standalone Parts Sale)
- **(b)** the work order number and the document number are **character-for-character identical as
  whole strings**, nothing stripped, no digit run extracted

**New S3-R10** — what the field shows: the work order's number exactly as it appears on the work
order, no document-type prefix added, no reformatting. `S-32136` reads `S-32136` on a document
numbered `INV-S2-32136`.

### What it changes for us

| Case | Was | Now |
|---|---|---|
| **C44917** | Passed (build followed the old rule) | **FAILED** — re-checked live: `S-32136` vs `INV-S2-32136` are not identical, so the field must show; the build still hides it |
| **C44913** | Passed | Passed, with the gap named: the Work Order field leads the fixed order and is absent, so the order was verified across three of five |
| **C44984** | Passed | Passed, **strengthened** — the new S3-N1(a) names the standalone Parts Sale explicitly |

**Ticket:** already tracked as **SV-9642** (Story Defect, Code Review, under SV-9142), raised by
Mudassir from the code side. Chris linked it and said whichever is picked up first closes both.
**No new ticket raised.**

**C44917 now needs re-authoring** — its title and all three clauses describe the retired rule. That is
authoring work, not this lane's.

---

## 2 · New G-R4 — page size and the document's width

Every customer document renders **A4 portrait, 210 × 297 mm**, fixed: not per country, not a setting.
Two widths are named because they had been confused with one another — a **718px sheet box** (the
white sheet) and a **634px content box** (what elements lay out in). US Letter is a known limitation,
tracked separately as SV-9791, and is never solved by rescaling type.

### Verified this pass — G-R4 passes

| G-R4 states | Measured |
|---|---|
| A4 portrait, 210 × 297 mm | **595.28 × 841.89 pt = 210.0 × 297.0 mm** on all six document types (Invoice, Estimate, Credit, Parts Sale, deposit-paid Invoice, the 19-page Invoice) |
| 718px sheet box | 595.28pt − 30px×2 page margins − 8px×2 body margin = 538.3pt = **717.7px** |
| 634px content box | 718 − 42×2 sheet padding = 634px; measured directly, Bill To spans x 60.0 → 535.3 = **475.3pt = 634px** |

**Note the 718/634 figures are PRINT geometry.** On screen the sheet is responsive — 718px at a
1440px viewport, 800px at 1500px — so do not read those numbers as an on-screen assertion.

**No case covers G-R4.** It is a coverage gap, like G-R2.

---

## 3 · S10-R2 expanded — where the document date comes from

The `{date}` is the document's issued date, one value rendered by both documents. On an **Invoice** it
is the invoice's stored creation date, fixed once the invoice exists. On an **Estimate** no invoice
record exists yet, so it is the date the estimate is produced and **it tracks the current date**: the
same Estimate opened on a later day shows the later date, and two printouts taken on different days
can carry different dates. Existing production behaviour, what G-R3 describes, **explicitly not a
defect**. (Mudassir, SV-9784.)

**Consistent with what we saw.** Estimate renders during this pass came back dated Sep 6 even where a
later issue date was passed — the server uses its own current date, exactly as the rule now describes.
Nothing to re-verdict; C44906 and C44960 already pass.

---

## 4 · Changelog rows

Three rows added for the above. No other rule text moved.

---

## Coverage gaps this creates

| New rule | Added | Case? |
|---|---|---|
| **S3-R10** — what the Work Order field shows | 2026-09-07 | **none** |
| **G-R4** — page size and document width | 2026-09-07 | **none** (verified anyway, passes) |
| **G-R2** — PDF filename | 2026-09-04 | **none** (already reported) |

All 120 cases still cite specification version 45; the live page is v57. Bringing the suite current is
authoring work and was not done in this lane.

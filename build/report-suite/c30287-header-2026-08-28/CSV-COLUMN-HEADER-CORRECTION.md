# C30287 — CSV column heading corrected to "Representative", 2026-08-28

**Case:** C30287 — *CSV cells: plain numbers, signed Labor Delta, empty Margin %, (Inactive)*
<https://shopview.testrail.io/index.php?/cases/view/30287> · section 4322 (Sales By Representative) ·
`created_by = 3` (ours) · **`custom_atmstatus = 3` (AUTOMATED)**.

**Authority:** the QA lead — *"do what is best"*.
**Rule 65 / 71:** the atm flag was checked **before** anything was written, it is **3**, so this case
is on Vladimir's register (2026-08-28 heading in
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`). The flag itself was never
sent and is **still 3**.

---

## 1 · Container check BEFORE the write

| Field | Container on the case-view page |
|---|---|
| `custom_preconds` | `markdown fr-view` |
| `custom_steps` | `markdown fr-view` |
| `custom_expected` | `markdown fr-view` |

All three **render** stored HTML, so **the API route was safe here** (unlike C30518 and C27776, which
had the escaping bare-`markdown` container and had to go through the UI editor). Only the two fields
that changed were sent; `custom_preconds` was omitted and is byte-identical afterwards.

## 2 · The source, read verbatim on 2026-08-28 (Rule 59)

Confluence **585629698 — "SBR (Sales By Representative) Report" — version 24**, live-checked
2026-08-28 (last edited 2026-08-24).

> **S14-R15:** *Summary CSV — file `sales-by-representative-summary.csv`, UTF-8 BOM, one header row +
> one row per rep… **Headers, in order: `Representative`, `# Invoices`, `# Customers`, …***

> **S14-R16:** *Expanded CSV — file `sales-by-representative-expanded.csv`… **Headers, in order:
> `Representative`, `Date`, `Invoice #`, `Customer`, `Status`, …***

The heading is the single word **"Representative"** in both files. The case said
**"Sales Representative"**.

**Why the case said the wrong thing, and why "Representative" is right:** the PO (Chris Ward) ruled on
**31 July 2026** *"Rep is too much slang, let's do representative everywhere"*, and our cases were
changed to the full "Sales Representative". He was then asked the direct question on **5 August 2026**
and answered **`A)`** — *""Representative" on its own is fine — it is not slang, so it satisfies your
ruling. We match our tests to it and you tidy the write-up."*
(`build/report-suite/chris-answers-2026-08-05/ANSWERS-INGESTED.md`, item 3.0; options in
`build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.md`
§3). **The write-up has since been tidied** — v24 words S14-R15/R16 with the single word. Latest wins
(Rule 32), and the case now discloses the divergence (Rule 56).

## 3 · What changed, exactly

**Steps** — one phrase:

```
was:  … and the (Inactive) rep's "Sales Representative" cell.
now:  … and the (Inactive) rep's "Representative" cell.
```

**Expected Results** — four edits, nothing else:

| # | Was | Now |
|---|---|---|
| point 4 | *"The **"Sales Representative"** name carries the "(Inactive)" tag when applicable…"* | *"The name in the **"Representative"** column carries the "(Inactive)" tag when applicable…"* |
| point 6 | *"…the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the **pending rename**…"* | *"…the first column heading in both files is the single word "Representative". If a file shows "Sales Rep" or "Sales Representative" instead, mark this test Failed and report the heading — do not change the test."* |
| provenance | *"…read on **26 August 2026**."* | *"…read on **28 August 2026**."* |
| divergence sentence | *(none)* | added: the single-word heading follows the PO's written answer of 5 August 2026, which differs from his earlier 31 July 2026 ruling; we take the later answer as prevailing, and v24 words S14-R15/R16 the same way |

**Point 6 had to be rewritten, not just re-worded.** It told the tester the rename to
"Sales Representative" was *pending* and to fail the build over it. That question was **settled** on
5 August 2026 in the opposite direction, so as written it would have made a tester fail a correct
build. It now states the settled heading and still gives the plain "what to do" (Rule 7).

**References were also re-pinned** (they were two versions behind the case's own provenance):

```
was:  SV-8631 (SBR spec v22 2026-08-17 S14-R17; heading renamed to Labor Delta per SV-9071)
now:  SV-8631 (SBR spec v24 2026-08-24 S14-R17; CSV headers per S14-R15 and S14-R16;
      Shop Supplies column per S5-R12 and S5-R13; heading renamed to Labor Delta per SV-9071)
```

**Not changed:** the title, the preconditions, points 1/2/3/5, the `Last checked against build
v3.8-bd246fd on 8/18/2026` sentence, and the `AUTOMATION: READY` marker.

## 4 · Verification AFTER the write

Two writes were made (the text fields, then a `refs`-only write) and each was re-GET-verified.

| Check | Result |
|---|---|
| `update_case` (text fields) | HTTP **200**; stored value byte-equals what was sent |
| `update_case` (`refs` only) | HTTP **200**; `refs` byte-equals what was sent, and `custom_preconds` / `custom_steps` / `custom_expected` were **byte-unchanged** by it (omitted fields are preserved) |
| Rendered page, all three containers | **`markdown fr-view`** — still renders |
| Literal tags visible to the tester | **none** |
| HTML entities visible as text | **none** |
| `AUTOMATION` marker | present once, **last**: `AUTOMATION: READY` |
| Provenance line | present, **SBR version 24, read on 28 August 2026** |
| `custom_atmstatus` | **3 — unchanged** |
| Title | **unchanged** |

## 5 · Suggested follow-up, NOT done here

The steps still read *"…, **an** Labor Delta cell, …"* — a leftover from the `Inv. Hrs` → `Labor Delta`
rename. It is a one-word grammar slip with no effect on what the tester does, and it is outside what
was asked, so it was left alone.

## OUTSTANDING — what I need from you

1. **Vladimir**: this case is Automated and was edited today. The CSV column heading its automation
   asserts on changes from **"Sales Representative"** to **"Representative"** — unlike C30518, this one
   **does** change an assertion. Register entry filed under 2026-08-28.

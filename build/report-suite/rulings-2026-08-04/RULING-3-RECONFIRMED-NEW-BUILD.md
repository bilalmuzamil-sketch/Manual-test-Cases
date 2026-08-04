# RULING 3 — RE-DRIVEN LIVE ON THE NEW BUILD `v3.4.1-3d03023` · 2026-08-04

The QA lead refreshed the cookies mid-session, so the export was **re-driven live on the build that
is actually deployed now** — not on the superseded `v3.4.1-0ed4433` the earlier answer rested on.
This document supersedes nothing in `RULING-3-FINDINGS.md`; it **re-confirms both halves on the new
build** and reports **one change the deploy introduced that breaks one of our cases.**

**The QA lead's condition, verbatim:**

> *"Money arrives as text if that still shows the amount in number and that amount is correct then
> its good to stay closed."*

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / marker | Checked | Verdict |
|---|---|---|---|---|
| Inventory Value spec | Confluence **720142338**, mirror `specs/inventory-value.md` | **version 3**, 2026-07-29 | 2026-08-04 | **CURRENT** |
| **Live build** | `sv8582.qa.shopview.com` | **`v3.4.1-3d03023`**, etag `9875201c58ba78d9851c37f7039c16e1`, `last-modified Tue, 04 Aug 2026 10:41:58 GMT` | **2026-08-04 ~11:35 UTC** | **PARTIAL (Rule 49)** — branch still declared NOT FINAL |
| Session | refreshed cookies from the QA lead; `POST /api/quick-login` → **200** | issued 2026-08-04 | 2026-08-04 | **was alive; I then burned it — see §5** |
| SV-8823 | Jira | **OBSOLETE / Done** | 2026-08-04 | **CURRENT** |

---

## THE ANSWER — BOTH HALVES, SEPARATELY, ON THE BUILD LIVE NOW

### HALF (a) — is the amount visible, and is it correct? **YES.**

The figure is fully legible and **arithmetically correct across the entire file**, not a sample.
Checked over **all 9,275 data rows** of the live export, every identity the report's own columns
must satisfy:

| Identity checked on every row | Rows failing |
|---|---|
| `Total Cost` = `Qty` × `Unit Cost` | **0** |
| `Total Sell` = `Qty` × `Unit Sell` | **0** |
| `Margin` = `Total Sell` − `Total Cost` | **0** |
| `Margin %` = `Margin` ÷ `Total Sell` | **0** |

(1-cent tolerance for legitimate rounding; 0.1 percentage-point for the one-decimal `Margin %`.)

**And the values are unchanged from the build on which they were already cross-checked against the
report's own API.** The worked row the QA lead's note refers to, `R134A` at Staging Heavy Duty - 9919:

| | Qty | Unit Cost | Unit Sell | Total Cost | Total Sell | Margin | Margin % |
|---|---|---|---|---|---|---|---|
| **new build `3d03023`** | 786.55 | $14.21 | $21.86 | **$11,176.88** | $17,193.98 | $6,017.10 | 35.0% |
| old build `0ed4433` (API-verified, 55,650 cells, 0 mismatches) | 786.55 | $14.21 | $21.86 | **$11,176.88** | $17,193.98 | $6,017.10 | 35.0% |
| **identical?** | **yes** | **yes** | **yes** | **yes** | **yes** | **yes** | **yes** |

The `Totals` row reads `Qty 195,249.93 · Total Cost $977,080.47 · Total Sell $1,832,152.49 ·
Margin $855,072.02 · Margin % 46.7%`.

**So on the QA lead's stated condition — the amount is shown, and it is correct. His condition is
met, and it is met on the build live now.**

### HALF (b) — does it behave as a number in a spreadsheet? **NO. It lands as text.**

Not softened, and the census is the whole file rather than a sample:

| | Cells | Share |
|---|---:|---:|
| Money / percent cells a numeric parse **REJECTS** | **55,656** | **100.0%** |
| Money / percent cells that parse as a bare number | **0** | **0.0%** |
| **`Qty` cells that parse as a bare number, for contrast** | **9,276** | **100.0%** |

That contrast is the proof it is a **deliberate per-column formatting choice, not a file-wide
problem**: the very same file writes `Qty` as `786.55`, which any spreadsheet reads as a number, and
writes `Total Cost` as `$11,176.88`, which none will.

**The raw bytes of the row, from the live file:**

```
R134A,Refrigerant,HD-Fluids,—,"Staging Heavy Duty - 9919",786.55,$14.21,$21.86,"$11,176.88","$17,193.98","$6,017.10",35.0%
```

**Two precisions worth keeping, both of which make it broader than the original ticket said:**
the `$` is on **every** money cell regardless of size (`$14.21` is unquoted and still not a number,
so this is not only about values over a thousand), and **`Margin %` is affected too** (`35.0%`).

**The honest limit, restated:** I did not run an interactive desktop-spreadsheet import — LibreOffice
will not load any file in this container. That does **not** soften the finding: the cell content is
byte-proven, and **for the automation engineer the answer is final — he must strip `$` and `,` before
any arithmetic.** What I will **not** assert is whether one particular desktop import wizard would
silently coerce it for a human double-clicking the file (Rule 12).

### And against the spec — half (b) is a written deviation, not a silence

**Inventory Value spec v3, Story 10 context note, verbatim:**

> *"Context note: in the CSV, money values are written as **plain numbers with two decimals and no
> thousands separators (so they parse cleanly in a spreadsheet)**; the PDF uses the same on-screen
> currency formatting with the "$" and thousands separators."*

**The spec legislated against the current behaviour, and named spreadsheet parsing as its reason.**
So keeping SV-8823 closed is a legitimate product decision the QA lead may absolutely take, but it is
an **accepted deviation from the written spec**, not "behaviour matches spec". Chris Ward should
correct that context note; the question is already in the consolidated sheet with him.

---

## THE SECOND HALF OF THE TICKET — the chosen columns, and their order

### Still true on the new build. Confirmed byte-identically.

Three exports requested in the same run, identical scope, only the `columns` parameter differing:

| Request | HTTP | Bytes | SHA-256 |
|---|---|---:|---|
| no `columns` parameter | **200** | 724,149 | `d22946f257bb01d9…` |
| `columns=part_number,description,qty` | **200** | 724,149 | `d22946f257bb01d9…` |
| `columns=zzz_nonsense_column` | **200** | 724,149 | `d22946f257bb01d9…` |

**All three byte-identical — the same SHA-256.** The parameter has **no effect whatsoever**, and an
invalid column name still raises **no validation error**. Evidence:
`evidence/ruling3-rebuild/columns-param-sha256.txt`.

**The column order in the file still differs from the screen.** File header row, read live:

```
"Part #",Description,Category,Vendor,Location,Qty,"Unit Cost","Unit Sell","Total Cost","Total Sell",Margin,"Margin %"
```

`Total Cost` sits **9th** and **`Margin %` is last**. The screen order captured on the previous build
put `Total Cost` **last** (`…, Margin, Margin %, Total Sell, Total Cost`). **I could not re-read the
on-screen header on the new build** — the session died before I got to the rendered page (§5) — so I
state that half as **carried forward from the previous build's live read, not re-observed today**
(Rule 12).

**The requirement it breaches, verbatim (Rule 25) — Inventory Value spec v3, `S10-R3`:**

> *"Both downloads include only the columns currently shown, in the same left-to-right order as the
> screen, with Total Cost last."*

One requirement, **three assertions, one row each** (Rule 45(e)):

| Assertion | File behaviour on `3d03023` | Verdict |
|---|---|---|
| *"include **only the columns currently shown**"* | all 12 columns always, whatever is requested | **BREACH — re-confirmed live** |
| *"in the **same left-to-right order as the screen**"* | file order differs | **BREACH — carried forward, not re-observed** |
| *"with **Total Cost last**"* | `Total Cost` 9th, `Margin %` last | **BREACH — re-confirmed live** |

### RECOMMENDATION — and nothing has been filed

**Nothing filed.** Applying the Rule-51 reachability test: a user picks columns in the on-screen
column control, chooses **Download (CSV)** from the three-dot menu, and gets columns he did not ask
for in an order that does not match what he was looking at. **No endpoint call is needed to see it —
this is USER-FACING, so Rule 51's ask-first duty for API-only tickets does not apply.** The
`columns=` probes are merely how the cause was characterised.

**My recommendation: YES, this deserves its own ticket, separate from the money half** — priority
**Low** (Rule 53), parent **epic SV-8582** with **SV-8677** linked (Rule 52). Three reasons: it is a
**different fault** from the number formatting and one fix will not address the other; the QA lead's
closing condition was explicitly about *"money arrives as text"* and **treating SV-8823's closure as
covering the columns too would put a decision in his mouth**; and it is **unambiguously wrong against
a quoted requirement**, needing no PO ruling.

---

## THE DEPLOY CHANGED THE EXPORT — and it breaks one of our cases

**This is the find that justified re-driving on the new build.** The export now emits **three**
metadata lines where it previously emitted two:

| Line | old build `0ed4433` | **new build `3d03023`** |
|---|---|---|
| 1 | `"As of: 2026-08-04"` | **`"Date Range: Jan 1, 2026 - Aug 4, 2026"`  ← NEW** |
| 2 | `"Locations: All locations"` | `"As of: 2026-08-04"` |
| 3 | *(column header row)* | `"Locations: All locations"` |
| 4 | — | *(column header row)* |

**The affected case: IV-EXP-05 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)**
*"PDF header shows report name; org; period and an as-of line; logo if set"*. Its tester note reads:

> *"the PDF reads "As of 2026-08-04" and **the CSV's first line reads "As of: 2026-08-04"** (with a
> colon). Both are correct; do not raise it."*

**That is now false — `As of:` is the SECOND line.** A tester following it on the current build would
report a mismatch that is not a product defect. **The case needs a one-line correction** (name the
`"Date Range:"` line and say `As of:` follows it).

**I have not made that edit.** It is outside the four write-steps I was authorised for, and Rule 6
means nothing goes into TestRail unasked. **It is the top item in the outstanding list.**

**Every other metadata-line case is safe** — I checked all 469. The seven `"Locations:"` cases
(C30161, C30167, C30277, C30376, C30437, C30511, C30588) all describe it as *"a leading line above
the column headers"* or *"exact position in the file is confirmed in the build"*, which stays true
with a third line added. **C30590 is the only casualty**, and it is a casualty precisely because it
committed to an absolute position — the failure mode Standing Rule 42 exists to prevent.

---

## §5 · MY OWN MISTAKE, RECORDED RATHER THAN GLOSSED

**I burned the refreshed session.** After the first successful exports I called
`POST /api/quick-login` repeatedly while probing why the report **data** endpoint returned
`409 {"errors":[{"error":"Session has expired."}]}`. Every endpoint then began returning 409 —
`fe-permissions`, `my-workplaces` and the export that had just worked. CLAUDE.md already warns that
`quick-login` is **stateful on the shared `PHPSESSID`** and must be probed **strictly sequentially**;
I did not respect that, and roughly ten logins in quick succession invalidated it.

**What that cost, precisely:** the on-screen column-order re-read (so that one assertion is carried
forward rather than re-observed) and the API cross-check of every cell on the new build (replaced by
the whole-file arithmetic check above, which is a genuine correctness test but is not the same test).
**What it did not cost:** everything else here was captured live before the session died and is
committed as evidence.

**The recipe worth remembering:** the report **data** endpoint
`GET /api/reporting/reports/inventory-value` returned **409 "Session has expired."** on this build
**even on a fresh single login**, while the **export** endpoint on the identical scope returned
**200**. That may be a new-build behaviour or a session quirk; **I could not distinguish the two
before losing the session, so I am not asserting which** (Rule 12). Worth a single clean probe next
time — one login, one call, no retries.

---

## OUTSTANDING — what I need from you

1. **Authorise the one-line correction to [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)**
   — the deploy added a `"Date Range:"` first line, so its *"the CSV's first line reads As of:"* note
   is now wrong and a tester will report a non-defect. **Nothing written. Blocked on: you.**
2. **Does the columns/ordering half get its own ticket?** I recommend yes — user-facing, priority
   Low, parent SV-8582, linked SV-8677. **Nothing filed. Blocked on: you.**
3. **SV-8823 stays closed on the money half** — your condition is genuinely met — **but please let it
   be recorded as an accepted deviation**, because the spec requires the opposite in writing.
   **Blocked on: you.**
4. **Fresh cookies, if you want the two carried-forward items re-observed** — the on-screen column
   order and a per-cell API cross-check on the new build. My fault, not an environment failure.
   **Blocked on: you.**
5. **Chris Ward should correct the Story 10 context note** so our spec mirror stops saying the build
   is wrong on a point you have accepted. Already in his sheet. **Blocked on: Chris Ward.**
6. **Confirmation of what `v3.4.1-3d03023` changed** — engineering. It already moved the export's
   metadata lines, so there may be more. **Blocked on: engineering.**

**No data was seeded and nothing was written to the product** — every call was a `GET` except the
logins. Nothing to clean up.

# RULING 3 — the Inventory Value spreadsheet export, re-driven live from scratch · 2026-08-04

The previous pass's Ruling-3 analysis was lost when it was interrupted (see
`recovery/RECOVERY-FINDINGS.md` §2). **This is a fresh live drive, not a reconstruction.**

**The QA lead's condition, verbatim:**

> *"Money arrives as text if that still shows the amount in number and that amount is correct then
> its good to stay closed."*

The condition has **two halves, and they do not have the same answer.** Both are answered separately
below, neither softened.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / marker | Checked | Verdict |
|---|---|---|---|---|
| Inventory Value spec | Confluence **720142338**, mirror `specs/inventory-value.md` | **version 3**, 2026-07-29 | 2026-08-04 | **CURRENT** |
| Live build | `sv8582.qa.shopview.com` | **`v3.4.1-0ed4433`**, etag `02091e9dc11f187d7739b4efa166ea21`, `last-modified Mon, 03 Aug 2026 13:40:38 GMT` | **2026-08-04 09:49 UTC** | **PARTIAL (Rule 49)** — branch declared NOT FINAL |
| Session | admin, `POST /api/quick-login` → **200** | cookies issued 2026-08-03 18:12 UTC | 2026-08-04 09:50 UTC | **ALIVE** |
| SV-8823 | Jira | **OBSOLETE / Done** (QA lead's ruling) | 2026-08-04 | **CURRENT** |

**Build marker identical to the 2026-08-03 capture** — same app-version *and* same etag, so this is
the same build the original finding came from. No deploy intervened.

---

## 0 · FIRST, A CORRECTION TO OUR OWN RECORD — and it matters more than the ruling

`recovery/RECOVERY-FINDINGS.md` §5 recorded, as a Rule-41 second finding, that **C30589's**
plain-number assertion **has no spec basis**:

> *"**The IV spec does not say this.** … Nothing in Story 10 states a CSV plain-number rule"*

**That is WRONG. The Inventory Value spec states it explicitly.** Story 10 (spec line 298, inside
Story 10 which runs from line 277) closes with this context note, quoted verbatim:

> *"**Context note: in the CSV, money values are written as plain numbers with two decimals and no
> thousands separators (so they parse cleanly in a spreadsheet)**; the PDF uses the same on-screen
> currency formatting with the "$" and thousands separators."*

The previous pass read only the **`S10-R7`** anchor (which really does say only *"Money and Margin %
use two-decimal and one-decimal formats respectively"*) and did not read the **`(+ context note)`**
hedge its own `refs` field carried — the hedge points at exactly this sentence.

**Three consequences, all of which change the shape of this ruling:**

1. **C30589's assertion is properly sourced.** It is not an unsourced claim to be softened. Task 2
   was briefed on the assumption that it was; that premise is now corrected, and Task 2 is handled
   accordingly (see `D15-DECISION.md`).
2. **The spec asks for the opposite of what the build does, and names spreadsheet parsing as its
   reason** — *"so they parse cleanly in a spreadsheet"*. The spec author anticipated precisely half
   (b) of the QA lead's question and legislated against the current behaviour.
3. **Therefore closing SV-8823 is a deliberate deviation from the written spec, not a no-op.** It is
   a legitimate product decision — the QA lead may absolutely take it — but it must be recorded as a
   deviation and put to Chris Ward, not filed as "behaviour matches spec". Logged in the register.

---

## 1 · HALF (a) — IS THE AMOUNT VISIBLE, AND IS IT CORRECT?

### **ANSWER: YES. Unambiguously yes, and verified exhaustively rather than sampled.**

The amount is fully legible in the cell and it is **numerically correct**. Nothing is truncated,
rounded away, mangled or lost.

**The worked example the QA lead's own note refers to** — part `R134A`, Staging Heavy Duty - 9919:

| Column | The report's own API value | The spreadsheet cell | Correct? |
|---|---|---|---|
| Qty | `786.55` | `786.55` | **yes** |
| Unit Cost | `1421` cents | `$14.21` | **yes** |
| Unit Sell | `2186` cents | `$21.86` | **yes** |
| **Total Cost** | **`1117688` cents** | **`$11,176.88`** | **yes** |
| Total Sell | `1719398` cents | `$17,193.98` | **yes** |
| Margin | `601710` cents | `$6,017.10` | **yes** |
| Margin % | `35` | `35.0%` | **yes** |

**And this was not left at one row.** Every row of the full export was cross-checked against the
report's own API, cell by cell:

| Check | Result |
|---|---|
| Rows in the live CSV export | **9,276** (9,275 data rows + 1 `Totals` row) |
| Rows pulled from the report API (19 pages of 500) | **9,275** |
| Rows matched API ↔ CSV | **9,275 — every one** |
| Money and Qty cells cross-checked | **55,650** |
| **Genuine value mismatches** | **0** |

**One honest note on that zero.** A first pass reported **56** apparent mismatches. They were **not**
data defects — they were an artefact of my own keying: **11 `(part number, location)` pairs occur
twice** in the data (22 rows), and keying on that pair collapsed them so the wrong twin was compared.
Re-run allowing a row to match **any** candidate for its key: **0 rows fail to match, and 0 of those
failures sit on a non-duplicated key.** I am recording the false alarm rather than quietly presenting
the clean number, because the clean number only means something with that explanation attached.

**So on the QA lead's stated condition — "if that still shows the amount in number and that amount is
correct" — the amount is shown and it is correct, on all 55,650 cells. His condition is met.**

---

## 2 · HALF (b) — DOES IT BEHAVE AS A NUMBER IN A SPREADSHEET, OR LAND AS TEXT?

### **ANSWER: IT LANDS AS TEXT. Not "sometimes", not "in some tools" — every single money cell in the file.**

I will not soften this, and it is worth being clear that half (b) fails **more broadly** than the
original ticket described.

**The raw cell content, byte-exact from the live file:**

```
R134A,Refrigerant,HD-Fluids,—,"Staging Heavy Duty - 9919",786.55,$14.21,$21.86,"$11,176.88","$17,193.98","$6,017.10",35.0%
```

**Per-column parse test, run against the live file:**

| Column | Raw cell | Parses as a bare number? |
|---|---|---|
| Qty | `786.55` | **YES** → `786.55` |
| Unit Cost | `$14.21` | **NO** — text |
| Unit Sell | `$21.86` | **NO** — text |
| Total Cost | `$11,176.88` | **NO** — text |
| Total Sell | `$17,193.98` | **NO** — text |
| Margin | `$6,017.10` | **NO** — text |
| Margin % | `35.0%` | **NO** — text |

**Whole-file census — 9,276 rows × the 6 money/percent columns = 55,656 cells:**

| | Cells | Share |
|---|---:|---:|
| Cells a numeric parse **rejects** | **55,656** | **100.0%** |
| Cells that parse as a bare number | **0** | **0.0%** |

### Two precisions the original ticket got slightly wrong — both make it worse, not better

1. **It is not only the values over a thousand.** The ticket explained the quoting as caused by the
   thousands separator, which is true of the *quoting* — but the **`$` sign is on every money cell
   regardless of size.** `$7.26`, `$15.78`, `$8.52` and `$893.69` are unquoted and **still not
   numbers**. So the problem is not confined to large values; it is universal.
2. **`Margin %` is affected too.** `35.0%` carries a percent sign and is equally unparseable. The
   ticket discussed money only.

### The honest limit on this half — stated, not glossed

I could not complete an **interactive spreadsheet import** in this container. **LibreOffice 24.2.7.2
is installed but refuses to load any input file here** — it fails identically on a two-line
`a,b\n1,2` test file (`Error: source file could not be loaded`), with an explicit user profile and
with absolute `file://` paths. **That is an environment limitation, not a property of the export**,
and I am not going to dress a working test around it.

**What that limit does and does not affect:**

- **It does not affect the finding.** The cell content is `$11,176.88` — byte-proven. That string is
  not a number, and every programmatic reader rejects it. **For the automation engineer, who is who
  this matters to, the answer is final: he must strip `$` and `,` before any arithmetic or
  comparison.** There is no version of this where his code gets a number for free.
- **It does affect one narrower question I therefore will not assert:** whether a *particular*
  desktop spreadsheet's import wizard would silently coerce `$11,176.88` into a currency-formatted
  number for a human double-clicking the file. Different importers behave differently, and **I did
  not observe any of them this run, so I am not stating it either way** (Rule 12). If the QA lead
  wants that specific answer, it needs a machine with a working spreadsheet application.

### What this means against the spec

The spec's requirement exists **for exactly this reason** — *"so they parse cleanly in a
spreadsheet"*. So half (b) is not a cosmetic quibble that the spec is silent on. **It is the precise
outcome the spec set out to prevent, and the build does not deliver it.**

---

## 3 · THE VERDICT ON HALF (a) vs HALF (b), PUT PLAINLY

| The QA lead's condition | Verdict |
|---|---|
| *"still shows the amount in number"* — the figure is legible, present, not mangled | **MET** |
| *"and that amount is correct"* | **MET** — 55,650 cells, 0 mismatches |
| **Therefore, on his stated condition: is it good to stay closed?** | **YES — his condition is satisfied.** |
| *But does the money behave as a number in a spreadsheet?* | **NO — 100% of money cells are text** |
| *And is that a deviation from the written spec?* | **YES — Story 10's context note requires the opposite, by name and for this exact reason** |

**Recommendation, honestly framed:** **SV-8823 can stay closed on the money half** — the QA lead's
condition is genuinely met and the data is correct, which is the thing that would have made it
urgent. **But it should be closed as an accepted deviation, not as a non-issue**, because the spec
demands the opposite in writing. The clean way to retire it permanently is for **Chris Ward to change
the Story 10 context note** to describe currency-formatted CSV output. Until he does, our own spec
mirror says the build is wrong. **That question is in the consolidated sheet already with him.**

---

## 4 · THE SECOND HALF OF THE TICKET — the chosen columns, and their order

**Still true today. Confirmed live, and confirmed byte-identically.**

### 4a · The chosen column set is ignored entirely

Three exports were requested in the same run — one with no `columns` parameter, one asking for three
columns, one asking for a column that does not exist:

| Request | HTTP | SHA-256 of the returned file |
|---|---|---|
| no `columns` parameter | **200** | `54d64e54…e025b1f` |
| `columns=part_number,description,qty` | **200** | `54d64e54…e025b1f` |
| `columns=zzz_nonsense_column` | **200** | `54d64e54…e025b1f` |

**All three files are byte-identical — the same SHA-256.** The parameter is not partially honoured or
mis-ordered; **it has no effect whatsoever**, and an invalid column name raises **no validation
error**. Evidence: `evidence/ruling3/columns-param-sha256.txt`.

For contrast, the **Work In Progress** export on the same build **does** enforce it
(`columns=…,invoiced_hours` → `400 {"error":"Invalid column \"invoiced_hours\"."}`), so the shared
export contract can honour and validate the parameter — the Inventory Value writer simply does not.

### 4b · The column order in the file differs from the screen

**Live on-screen header row, read from the rendered table this run**
(`evidence/ruling3/on-screen-columns-LIVE.json`):

```
Part #, Description, Category, Vendor, Location, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost
```

**Live file header row, from the export taken minutes later:**

```
"Part #",Description,Category,Vendor,Location,Qty,"Unit Cost","Unit Sell","Total Cost","Total Sell",Margin,"Margin %"
```

| | Position of `Total Cost` | Last column |
|---|---|---|
| **Screen** | **12th — last** | `Total Cost` |
| **File** | **9th** | **`Margin %`** |

**The screen is spec-correct. The file is not.**

### 4c · The requirement it breaches, verbatim (Standing Rule 25)

> **Inventory Value spec v3, Story 10, `S10-R3`:** *"Both downloads include only the columns
> currently shown, in the same left-to-right order as the screen, with Total Cost last."*

**That single requirement makes three assertions, and the file fails all three** (one row per
assertion, Rule 45(e)):

| Assertion in `S10-R3` | File behaviour | Verdict |
|---|---|---|
| *"include **only the columns currently shown**"* | all 12 columns always, whatever is asked for | **BREACH** |
| *"in the **same left-to-right order as the screen**"* | Margin/Margin %/Total Sell/Total Cost re-ordered | **BREACH** |
| *"with **Total Cost last**"* | Total Cost is 9th; `Margin %` is last | **BREACH** |

### 4d · RECOMMENDATION — and nothing has been filed

**I have filed nothing.** SV-8823 is OBSOLETE by the QA lead's ruling and it is not mine to re-open.

**Is it user-facing or API-only?** Applying the Rule-51 reachability test — *is the fault reachable
from the product's own screens?* — **this is USER-FACING, both halves of it.** A user picks columns in
the column-selection control on screen, chooses **Download (CSV)** from the three-dot menu, and gets
a file with columns he did not ask for in an order that does not match what he was looking at. **No
endpoint call is needed to see it.** The `columns=` probes above are merely how the cause was
characterised precisely; they are not what makes it visible. So **this is not an API ticket, and
Rule 51's ask-first duty does not apply to it** — though nothing is being filed either way without
the QA lead's word.

**My recommendation: YES, this half deserves its own ticket, separate from the money half.**

| Reason | |
|---|---|
| **It is a different fault from the money formatting** | one is a presentation choice in the number writer; this is the export ignoring its own column contract. One fix does not address the other. |
| **The QA lead's closing condition does not cover it** | his ruling was explicitly about *"money arrives as text"*. He was not asked about, and did not rule on, the columns. Treating SV-8823's closure as covering both would put a decision in his mouth. |
| **It is unambiguously wrong against the spec** | three breaches of one requirement, quoted above — no interpretation needed, and no PO ruling required to call it. |
| **It has real user consequence** | a user who narrows to three columns to send to a manager gets all twelve, with the value column he cares about not where he left it. |
| **Severity, honestly: LOW-to-MEDIUM.** | no data is wrong — every figure in the file is correct (§1). It is the wrong *shape*, not the wrong *numbers*. And per Standing Rule 53 any ticket we file goes in at priority **Low** regardless. |

**Suggested shape if he says file it:** a `Bug` at priority **Low**, parent **epic SV-8582**, linked
to story **SV-8677** (which owns the export contract) — the same shape as the other five, per
Standing Rule 52. Evidence is already in this repo; no fresh capture needed.

---

## 5 · WHAT I DROVE, SO IT CAN BE RE-RUN

| # | Action | Result |
|---|---|---|
| 1 | Build marker re-read before starting | `v3.4.1-0ed4433`, etag unchanged vs 2026-08-03 |
| 2 | `POST /api/quick-login {"key":"admin"}` | **200** |
| 3 | `GET /api/reporting/reports/inventory-value` — 19 pages × 500 | **200**, 9,275 rows |
| 4 | `GET …/inventory-value/export?format=csv` (whole list) | **200**, `text/csv`, 1,426,923 B, 9,276 rows |
| 5 | Same export filtered `search=R134A` | **200**, 925 B |
| 6 | Same, `columns=part_number,description,qty` | **200** — byte-identical to #5 |
| 7 | Same, `columns=zzz_nonsense_column` | **200** — byte-identical to #5, no validation error |
| 8 | SPA `/reports/inventory-value` rendered, header row read live | 12 columns, `Total Cost` last |
| 9 | Per-cell numeric parse over all 55,656 money/percent cells | 0 parse as numbers |
| 10 | Per-cell value cross-check, CSV ↔ API, 55,650 cells | 0 mismatches |

**Evidence:** `evidence/ruling3/` — `iv-R134A-csv-head.txt`, `iv-wholelist-csv-head.txt`,
`on-screen-columns-LIVE.json`, `iv-screen-columns.png`, `columns-param-sha256.txt`,
`numeric-parse-test.txt`.

**No data was seeded and nothing was written** — every call in this pass was a `GET` except the
login. Nothing to clean up.

**Rule 49:** every verdict here comes from a build engineering has declared **NOT FINAL**, so all of
it is **provisional** and stays queued in `../viu-2026-08-03/RECHECK-QUEUE.md` under build marker
`v3.4.1-0ed4433`.

---

## 6 · OUTSTANDING — what I need from you

1. **Does the columns/ordering half get its own ticket?** I recommend **yes** (§4d), user-facing,
   priority Low, epic parent SV-8582, linked to SV-8677. **Nothing filed.** **Blocked on:** you.
2. **SV-8823 stays closed on the money half — but please let it be recorded as an accepted deviation,
   not as spec-compliant.** The spec requires the opposite in writing (§0). **Blocked on:** you.
3. **Chris Ward should correct the Story 10 context note** to describe currency-formatted CSV output,
   otherwise our own spec mirror permanently says the build is wrong on a point you have accepted.
   Already in the consolidated sheet with him. **Blocked on:** Chris Ward.
4. **The screen-vs-file `Margin %` disagreement is still unresolved** — for `W4707QP` the API returns
   `56.05`, the screen shows `56.0%` (truncating) and both the CSV and PDF show `56.1%` (rounding).
   `S10-R7` asks only for one decimal, so neither is strictly non-compliant, but the two surfaces
   disagree with each other. Flagged, not filed. **Blocked on:** you, then Chris Ward.
5. **One narrow question is genuinely unanswered:** whether a desktop spreadsheet's import wizard
   would coerce `$11,176.88` for a human double-clicking the file. LibreOffice will not run in this
   container (§2). Needs a machine with a working spreadsheet app. **It does not change the
   automation answer**, which is settled. **Blocked on:** an environment, if you want it at all.

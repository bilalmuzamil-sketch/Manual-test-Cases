# CONTRADICTIONS — Stage-2b cross-case consistency sweep, Report Suite, 2026-08-04

**Population swept: all 478 active cases. Contradictions found: 7. Resolved to a precedence
winner: 4. Flagged PENDING a ruling: 3.** No case in the suite scored NONSENSE, and the
KEEP-but-NONSENSE embarrassment check is empty.

All four mandatory mechanical helpers were run; the raw output is
`sweeps/STAGE-2B-SWEEP-OUTPUT.txt` and the runnable checker is `sweeps/sweep_stage2b.py`
(read-only, no TestRail access).

---

## The four helpers and what each returned

| Helper | Scope | Result |
|---|---|---|
| **(i) opposite-assertion keyword-pair scan** | 15 control groups built from the case text, 478 cases | 11 groups carry BOTH sides of an opposite pair. **Ten are legitimate** — a suite properly asserts *shown* under one condition and *hidden* under another for the same control. **One is a real split: the Location-column mechanism** (group CG-LOCATION-COLUMN-MECHANISM below). |
| **(ii) TITLE vs EXPECTED, every case** | 478 / 478 | 16 flagged by the machine; **all 16 read clean on inspection** — the title names a control the expected refers to by another word ("three-dot menu" in the title, "the menu" in the expected), or a negative title whose expected states the same thing positively. **0 stale titles.** |
| **(iii) same-anchor clustering** | 882 spec anchors; 145 shared by more than one case | Every shared-anchor cluster diffed. The only disagreements inside a cluster are the Location-column ones already named. |
| **(iv) surface-split check (Rule 40)** | 145 clusters; 25 flagged as having an export surface but a missing sibling surface | **23 are false positives** (a PDF-page-setup or file-name requirement genuinely has no CSV or screen surface; or the sibling surface is covered under a different anchor). **2 are genuine candidate gaps** — see the bottom of this file. |

### Rule 42 / fail-condition F7 — the mechanical closed-enumeration sweep

Separately swept (`sweeps/sweep-f7-enumerations.txt`): every tester-facing occurrence of
**`exactly`**, **`only these`**, **`no other`**, **`the complete list`**, **`in order, are`**,
**`are exactly`** across all 478 cases — **60 hits**.

- **40** are genuine closed enumerations, and **all 40 carry a version-pinned anchor** in `refs`.
- **20** are the adverb used for precision, not to close a list — *"sum **exactly** to that asset's
  row total"*, *"select **exactly** one customer"*, *"a configured rate of **exactly** $0.00"*,
  *"appears **exactly** once, in **exactly** one tab"*. Each was read individually to confirm it.

**F7 result: 0 unanchored absolute enumerations in 478 cases.** This is the defect class that
broke SBR-EXP-10/11 on 2026-07-31; the repair held.

---

## CONTRADICTION GROUP 1 — CG-LOCATION-COLUMN-MECHANISM (3 cases + 4 more to align)

**The control:** the per-row **Location column** — is it switched on by the user in the
column-selection control, or does it appear automatically when more than one location is in scope?

**The suite says both.** Verbatim, from the cases' own expected results:

| Asserts SELECTOR-CONTROLLED | Asserts AUTOMATIC |
|---|---|
| **WIP-COL-02** = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) — *"Location **IS offered in the column-selection control**, between VIN and Advisor, and is off by default."* and *"the Location column **does NOT appear on its own** when you have more than one location selected - you have to switch it on yourself. **That is what the build does today.**"* | **SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) — *"Location is **NOT offered** in the column selector — it appears and disappears **on its own**, following the location scope."* |
| **WIP-FLT-09** = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) — *"Location is offered in the column-selection control … **The column does not appear or disappear on its own** when you change the location selection - it follows the column-selection toggle only."* | **PV-FILT-14** = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) — *"Location is **NOT** one of the 20 columns in the picker — it is managed by the location scope, not by you."* |
| **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) — precondition 4: *"Location is **turned ON in the column-selection control** (it is off by default)."* | **TU-LOC-06** = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) — *"Location is **never listed** in the Column Selection control — it follows the location scope **on its own**."* |
| **IV-LOC-06** = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) — *"Location **IS one of the columns offered in the column-selection control** - its visibility **follows that toggle, not the location selection**."* | **SBR-LOC-05** = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913), **SBR-COL-01** = [C30265](https://shopview.testrail.io/index.php?/cases/view/30265), **SBC-COL-01** = [C30156](https://shopview.testrail.io/index.php?/cases/view/30156), **PV-COL-02/03**, **TU-COL-01**, **TU-HRS-02**, **TU-EXP-04**, **SBR-ROW-02** — all "automatic / not in the panel". |
| **IV-COL-01** = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551), **IV-COL-04** = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554), **IV-PERS-02** = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580), **IV-EXP-02** = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) — all *"when it is turned on in the column-selection control"*. | |

**Both cannot be true, and the specs settle it.** Quoted from the current spec mirrors
(`../spec-current-2026-07-31/`):

- **IV v3 `S7-R6`** (Inventory-Value-Report-current.md L349): *"Its visibility **follows the
  location scope automatically** and it is **not one of the columns offered in the
  column-selection control** (Story 8)."*
- **WIP v6 `S4-R3`** (Work-In-Progress-Report-current.md L213): *"The **Location** column is **not
  offered in the column selector**; its visibility is **automatic** — shown only when more than one
  location is in scope (Story 7)."*
- **WIP v6 `S7-R13`** (L348): *"…and is hidden whenever a single location is in scope; **the user
  does not toggle it in the column selector**."*

The WIP raw diff (`Work-In-Progress-Report-raw-unified.diff` L31–32) shows `Location` was **removed
from the column-selector list on 2026-07-29** — so the WIP cases still assert the pre-v6 model.

**Winner by Standing Rule 33:** the **current specs** (a PO document) outrank our live observation
of the build. Both IV S7-R6 and WIP S4-R3/S7-R13 say *automatic*, and eleven cases on the other
four reports already say *automatic*.

**Why this matters, plainly:** as written, **WIP-COL-02, WIP-FLT-09 and the four IV cases cannot
fail a build that breaks the current spec** — they assert the broken behaviour as the pass
condition. WIP-COL-02 says so out loud: *"That is what the build does today."*

**The alignment edit each member needs:** assert the automatic, scope-driven behaviour (the model
PV/SBC/SBR/TU already use), and carry the observed selector-controlled build as a **recorded
deviation** in the notes — which is exactly the pattern **WIP-FLT-05** = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) already uses for its one-day span-cap difference.

**Status: PENDING the QA lead's ruling.** Not because the precedence is unclear — it is not — but
because a previous authorised pass deliberately chose to follow the build, and reversing that is his
call, not ours (Rule 6). The decision is logged in `DELIBERATE-DECISIONS.md` row D1.

---

## CONTRADICTION GROUP 2 — CG-SBR-STATUS-POSITION (1 case)

**The control:** where the **Status** column sits on the Sales By Representative grid.

- **SBR-BADGE-01** = [C30226](https://shopview.testrail.io/index.php?/cases/view/30226), expected 1:
  *"The Status column sits **between the Customer column and the Inv. Hrs column**."*
- **SBR-EXP-04** = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279), expected 2:
  *"…columns: Date / Invoice / Customer / Status / **(Location, only when more than one location is
  in scope…)** / Inv. Hrs …"*
- **SBR-ROW-02** = [C30218](https://shopview.testrail.io/index.php?/cases/view/30218), expected 1:
  *"When more than one location is in scope the automatic Location column is added **immediately
  after Status**, making 13."*

With more than one location in scope, Status is **not** adjacent to Inv. Hrs, so SBR-BADGE-01's
expected 1 is false on exactly the estate most customers run.

**Winner:** **SBR v15 `S21-R7`** (the 2026-07-29 Chris Ward addition), which the sibling cases
follow. **Resolution: aligned** — SBR-BADGE-01 expected 1 becomes scope-conditional, worded the
same way as SBR-ROW-02 already is. No ruling is reversed.

**Worth recording:** the 2026-08-03 VIU pass **noticed** this and rationalised it rather than
repairing it — its own observation reads *"the case says 'between Customer and Inv. Hrs' — still
true in the sense that Status precedes the metric block"*. That is not what the case says.

---

## CONTRADICTION GROUP 3 — CG-IV-PAGINATION (1 case, intra-case)

**IV-NAV-05** = [C30538](https://shopview.testrail.io/index.php?/cases/view/30538) contradicts itself:

- expected 1: *"the user moves through pages with the reports suite's **standard pagination
  control**."*
- expected 3: *"Note for the tester: on this build **there are no numbered page controls** on the
  screen - the rows load as you scroll. **That is what you should see**."*

**Winner:** our live observation (Rule 33 tier 3) — there is no pagination control.
**Resolution: aligned** — state scroll-loading as the behaviour and carry the spec's pagination
requirement as the recorded deviation, instead of asserting both.

---

## CONTRADICTION GROUP 4 — CG-IV-TOTALS-LABEL (1 case, intra-case)

**IV-TOT-01** = [C30556](https://shopview.testrail.io/index.php?/cases/view/30556):

- expected 1 requires the label **"Totals"**.
- its own note says *"On screen the label is **"Total"** (S4-R1) while the DOWNLOADED totals row is
  labeled **"Totals"** (S10-R6)"*.

The build shows "Totals". As written the case therefore **cannot fail a build that breaks S4-R1**.

**Winner:** **IV v3 `S4-R1`**. **Resolution: aligned** — assert the spec value "Total" in the
expected so the observed "Totals" registers as the deviation it is, or get Chris Ward to ratify
"Totals" and update S4-R1. Flagged to him either way.

---

## CONTRADICTION GROUP 5 — CG-SBC-CUSTOM-RANGE (1 case, intra-case)

**SBC-DATE-03** = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104):

- step 1: *"Open the date range picker. **A month calendar is shown inside it, which is how a custom
  start and end date are picked on this build.**"*
- expected 1: *"**Choosing "Custom" opens a date-picker dialog** for a start and end date."*

**Winner:** our live observation — there is no Custom item. **Resolution: aligned** — restate
expected 1 as the inline-calendar behaviour and record the missing Custom option as the deviation.
Note that the closed preset list in the sibling **SBC-DATE-01** = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102)
is a **separate** question and is **not** to be trimmed to the build (see DELIBERATE-DECISIONS D2).

---

## The two genuine surface-split candidates (Standing Rule 40)

Both are small, both are named, neither is authored — a candidate gap is the QA lead's to authorise
(Rule 6).

| Anchor | Requirement | Covered surfaces | Missing surface | Evidence |
|---|---|---|---|---|
| **PV `S3-R3`** | Server-side sort, nulls first ascending / last descending, *"so the same order appears on screen and in the exports"* | screen (**PV-ROW-04** = [C30344](https://shopview.testrail.io/index.php?/cases/view/30344)) · API (**PV-API-03** = [C30390](https://shopview.testrail.io/index.php?/cases/view/30390)) · **CSV** (**PV-EXP-04** = [C30378](https://shopview.testrail.io/index.php?/cases/view/30378)) | **PDF** — PV-EXP-04's steps download the CSV only, so the PDF's row order and null placement are asserted nowhere | PV-EXP-04 steps 1–3 all read "download the CSV" |
| **SBR `S6-R9`** | Detail rows newest first, numeric invoice-number tie-break, P before S — and **SBR-TREE-09**'s own note says *"The same order applies in the Expanded View PDF per-rep tables **and the Expanded CSV** (S14-R6/S14-R16)"* | screen (**SBR-TREE-09** = [C30225](https://shopview.testrail.io/index.php?/cases/view/30225)) · **PDF** (**SBR-EXP-04** = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) expected 4) | **CSV** — **SBR-EXP-11** = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) expected 3 asserts only the **rep** order ("flattened across all reps in the report's currently-active order"), never the per-invoice order inside a rep | SBR-EXP-11 expected 3 quoted in full above |

**Recommendation (not executed):** extend **PV-EXP-04** with a PDF leg, and extend **SBR-EXP-11**
expected 3 with the per-invoice order — extending rather than authoring new cases, per Rule 28.

---

## Delivery bar

`gen_audit.py` fails loudly while any CONTRADICTION row lacks either a resolution or a PENDING
flag. It currently exits **0**: 4 aligned, 3 flagged PENDING the QA lead's ruling on
CG-LOCATION-COLUMN-MECHANISM. **Nothing in this file has been executed in TestRail.**

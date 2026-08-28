# WIP `refs` backfill — the live v28 requirement anchors recorded on the cases that test them — 2026-08-28

**23 anchors written across 14 WIP cases. Every case verified after its own write: the three text
fields BYTE-IDENTICAL, the rendered page CHARACTER-IDENTICAL, `custom_atmstatus` unchanged. Nothing
came back wrong. `refs` was the only field sent.**

Approved by the QA lead 2026-08-28. Source of the list:
`build/report-suite/wip-authoring-2026-08-28/COVERAGE-MATRIX.md`, whose headline finding is that the
WIP "NOT COVERED" count is mostly a **traceability** gap, not a coverage gap — `verify.py` scores an
anchor as covered only when the anchor STRING appears on a case, and the Summary Strip cases cite
*"WIP Story 5 + the 13 August 2026 design review"* rather than the `S5-Rxx` anchors. This is Rule 64
case **(b)**: the source EXISTS and was simply never recorded on the case.

## Does a `refs`-only write re-render the body? — NO, and it was proved before the run

This was the open question in the instruction, because the `<p>`-wrapper trap flattens a bare-text
body (it did exactly that to C30451 earlier today). **C30466 was written first as a deliberate
route-safety probe**, with the rendered page captured in a real browser before and after:

* `custom_preconds`, `custom_steps`, `custom_expected` — **byte-identical**, all three;
* the three rendered containers — **same class, character-identical innerText**;
* `title`, `custom_atmstatus`, section, priority, type, estimate, milestone, template — unchanged.

**So the plain API route is safe for a `refs`-only change, including on the Automated cases, and no
web-editor route was needed.** It was still re-proved on every one of the remaining 13, both by
field comparison and by re-reading the rendered page.

## Reconciliation with the coverage matrix — 23 anchors / 14 cases, not 25 / 12

The matrix's summary line says *"25 anchors across 12 cases"*. Derived live from the matrix's own
per-requirement rows and checked against each case's current `refs`:

| | Count |
|---|---|
| Requirement rows the matrix marks *covered in substance* | **23** |
| — of those, already cited in the case's `refs` (**S4-R9** on **C30485**) | **1** |
| **Anchors actually missing and written this pass** | **23** |
| **Cases written** | **14** |

(The 23 written figure counts **S5-R1 twice** — it is carried by two different cases, C30487 and
C30520, and each needed its own citation. Distinct anchors written: 22.) The matrix's 25/12 was a
hand count in its summary block and does not match its own rows; **the rows are authoritative and are
what was executed.**

## Format

TestRail splits `refs` on **commas** and validates each entry, so each appended entry is
**comma-free** and far inside the **248-character** limit — a longer or comma-bearing entry returns
HTTP 400 *"does not match the required pattern"*. The entry reuses the case's existing Jira key and
the established in-repo shape:

```
SV-8661 (WIP spec v28 2026-08-24 S5-R4; S5-R5; S5-R6; S5-R7)
```

Nothing already in `refs` was removed or rewritten — the new entry is appended.

## What was written

| C-id | Anchors added | `custom_atmstatus` | Automated? | Verified |
|---|---|---|---|---|
| [C30457](https://shopview.testrail.io/index.php?/cases/view/30457) | S2-R3 | 1 | no | body byte-identical; rendered page identical |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | S2-N2 · S6-N1 | 3 | **Automated** | body byte-identical; rendered page identical |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | S3-R2 · S3-R3 | 3 | **Automated** | body byte-identical; rendered page identical |
| [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | S4-R4 | 1 | no | body byte-identical; rendered page identical |
| [C30487](https://shopview.testrail.io/index.php?/cases/view/30487) | S5-R1 · S5-R10 | 1 | no | body byte-identical; rendered page identical |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | S5-R2 | 3 | **Automated** | body byte-identical; rendered page identical |
| [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | S5-R3 | 1 | no | body byte-identical; rendered page identical |
| [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | S5-R4 · S5-R5 · S5-R6 · S5-R7 | 1 | no | body byte-identical; rendered page identical |
| [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | S5-R8 · S5-R9 | 1 | no | body byte-identical; rendered page identical |
| [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) | S5-R12 | 1 | no | body byte-identical; rendered page identical |
| [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) | S8-R5 · S8-R6 | 3 | **Automated** | body byte-identical; rendered page identical |
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | S9-R2 · S9-R4 | 3 | **Automated** | body byte-identical; rendered page identical |
| [C30520](https://shopview.testrail.io/index.php?/cases/view/30520) | S5-R1 | 1 | no | body byte-identical; rendered page identical |
| [C43818](https://shopview.testrail.io/index.php?/cases/view/43818) | S5-R13 | 1 | no | body byte-identical; rendered page identical |

## ⚠️ FOR VLAD (Rule 65)

**Five of the 14 are Automated** — C30460, C30462, C30488, C30507, C30511. On each of them **only the
`refs` field changed**; the Preconditions, Steps and Expected Result are byte-identical and the
rendered page is character-identical. Rows are in
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md` under the 2026-08-28
heading.

## OUTSTANDING — what I need from you

Nothing outstanding for this backfill. The three anchors the coverage matrix HELD (**S7-R7a**,
**S9-E2**, **S10-R2**) were deliberately not backfilled — the first two are change-log mentions with
no requirement definition (see the `verify.py` fix committed today) and **S10-R2 is a live source
conflict awaiting a PO decision**.

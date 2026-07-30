> # ⛔ NOT SENT — INTERNAL REFERENCE ONLY
>
> **QA-lead decision, 2026-07-31: do NOT message Vladimir.** No note, no question, no reference
> offer. This file is retained **only** as the internal record of what his cases established for us.
> It is not a draft awaiting sending, and it must not be sent later without a fresh decision.
>
> **Date:** 2026-07-31 · **Author:** QA / Claude · **Status:** NOT SENT — retained as internal
> reference only (user decision 2026-07-31)

# Internal record — what Vladimir Tomovic's 5 automated Reports Suite cases established

**Standing position, unchanged and absolute (Standing Rule 38):** his cases are **HANDS-OFF**. We do
not edit, retitle, re-reference, move, retire, or add them to any run — not to tidy a title, not to
backfill a reference, not to merge an apparent duplicate. That applies to all five
(**C38919–C38923**) and to anything he authors in future. Nothing in this record changes that.

**Authorship (read-only, verified):** all five created **2026-07-30 15:54 UTC** and last updated
**17:41 UTC** by TestRail user id 1 = **Vladimir Tomovic**. Source of every fact below:
`build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md` (read-only sweep, **zero TestRail
writes**) and `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md`.

---

## 1. The finding that matters — C38923 was CORRECT, and it exposed a real defect in OUR suite

**[C38923](https://shopview.testrail.io/index.php?/cases/view/38923)** — *"SBR Summary and Expanded
CSV exports carry the Location column at its designated slot"* — asserted that the Location column
reaches the SBR CSV exports.

**He was right, and we were wrong against our own spec.** Two of our cases —
**SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and
**SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** — enumerated the
CSV headers with the word *"exactly"* and no Location column, because they cited `S14-R15` /
`S14-R16` / `S14-R18` (header lists dating from the 2026-07-11 "Exports hardened" change) and **not**
`S14-R20`, the export requirement Chris Ward added on **2026-07-29** in SBR spec **v15**, verbatim:

> *"Whenever the Location column is shown on screen (S21-R7), it is **included in all four exports in
> the same position it occupies on screen** — Summary and Expanded, PDF and CSV …"*

He authored on 2026-07-30, **inside the v15 window**, so the assertion matches the live spec. His case
carried **no references at all** — which is exactly the signal that could have been used to dismiss
it, and would have been wrong. **The same on-screen/export split existed on three further reports**
(PV `S6-R11`, TU `S7-R13`, IV `S10-R15`), so his one disagreement surfaced a four-report gap.

**This is the origin of Standing Rule 44** (another author's contradicting case is a bug report
against our suite until disproven) and a large part of **Rule 40** (trace a requirement across every
surface) and **Rule 41** (touch a case, re-verify the whole case) — see
`build/LESSONS-2026-07-31.md` §1.4–1.5.

**Status of the fix:** authorized and being applied on **our** cases only (C30285 / C30286 and the
PV / TU / IV equivalents). **C38923 is not touched.**

---

## 2. The still-open question — C38922 and the WIP Column Selection menu

**[C38922](https://shopview.testrail.io/index.php?/cases/view/38922)** — *"WIP CSV export gains the
Locations line while its column semantics stay exactly as shipped"* — its **step 3** toggles Location
**on** in the WIP Column Selection menu.

Our **WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)** asserts
Location is **not offered** in that control at all. Our side is grounded three times over in WIP spec
**v6** (2026-07-29): `S4-R3` (*"The Location column is not offered in the column selector"*), `S7-R13`
(*"the user does not toggle it in the column selector"*), and the §3 Key Decision (*"automatic, not a
manual toggle"*). Two further cases of ours say the same (**C30466**, **C30467**), so our side is
internally consistent.

**Both readings can be honest at once.** His title says *"exactly as shipped"*, which points at
**today's build**; ours describes the **v6 target**. If the build still ships a toggle, the correct
output is a **build-conformance finding** — "v6's automatic-visibility change has not shipped yet" —
and **not** an edit to either case.

**This remains an OPEN build-conformance question**, resolvable by **one live observation**: with more
than one location in scope, is `Location` listed in the WIP Column Selection menu? We cannot run it —
no Report Suite QA branch (Standing Rule 22). Tracked in
`build/OUTSTANDING-ITEMS-REGISTER.md`. **Our case stands unchanged** in the meantime (Rules 32/33 —
the spec is the newest authoritative product source), and **C38922 is not touched.**

---

## 3. The other three — overlap picture, recorded for coverage honesty only

Judged on subject + conditions + steps, because four of the five carry **no expected results** (the
fifth has only a parsing fragment) — so the pass criterion lives in his automation code, not the case.
Stated as a limit, not a hedge. **No action follows from any row below.**

| His case | Relationship to ours | Note |
|---|---|---|
| **C38920** | Duplicates our **PV-FILT-14 = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914)** | Every condition his steps set up is already asserted there (hidden at a single location, "Multiple" on the merged special-order row, per-location names on inventory rows). |
| **C38922** | Duplicates our **[C30511](https://shopview.testrail.io/index.php?/cases/view/30511)** + **[C30516](https://shopview.testrail.io/index.php?/cases/view/30516)** | Plus the open toggle question in §2 above. |
| **C38919** | Automated equivalent of our **[C38859](https://shopview.testrail.io/index.php?/cases/view/38859)** + **[C30437](https://shopview.testrail.io/index.php?/cases/view/30437)** | Bundles column-toggle + reload-persistence + export-mirrors-screen into one end-to-end path — a sensible regression shape, not new coverage. |
| **C38921** | **New coverage we do not have** | Pins the `As of` metadata line inside the CSV *and* its position above the header row; we had deliberately left the position open. |
| **C38923** | **New coverage we do not have** — and the finding in §1 | No case of ours claimed the Location column in the SBR CSVs. |

---

## 4. QA-internal notes

- **Counting convention (Rule 38):** Report Suite is always reported as **"ours 474 / live total
  479"** — our tallies count ours only, and never claim or hide anyone else's work.
- No foreign case sits in run 359 or any other run; none was added by us and none may be.
- Vladimir has authored 1,775 cases project-wide — a long-standing author, not a newcomer. Rule 33's
  bar applies regardless: **judge the claim, not the claimant.**
- **Rule 39 residual:** the *basis* of C38922's step 3 (as-shipped vs a spec version) cannot be
  established from the case itself, and the QA lead has decided **not to ask him**. It is therefore
  recorded honestly as **"basis not established — not asked, by QA-lead decision"**, and the question
  is resolved instead by the live WIP observation in §2.
- Case links: `https://shopview.testrail.io/index.php?/cases/view/<id>`

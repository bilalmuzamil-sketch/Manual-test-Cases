# The 9 anchorless Report Suite cases, read against the LIVE specification by topic — 2026-08-28

These nine were held back from every earlier re-pin for one reason: **they cite no requirement
anchor**, so nothing mechanical could prove their content was still current, and stamping a case with
a version nobody had read it against is the exact fault this work exists to fix.

**Method (Rule 12 — observed, never inferred).** Each case was fetched live, its subject identified,
and the **live** specification searched **by topic** for the text that governs that subject. The
verdict comes from putting the case's own words next to the live words. **The specification bodies
already fetched on 2026-08-26 were reused — nothing was re-fetched** (`source-verify-2026-08-26/specs`,
read with `anchor.py`). Live versions: **PV 11** (2026-08-20) · **SBR 24** (2026-08-24) ·
**WIP 28** (2026-08-24).

**No expectation wording was changed on any of the nine.** Where a case proved current it got its
cited version and read-date restamped and nothing else. Where it did not, it was **held**.

| Verdict | Count | Cases |
|---|---|---|
| **Re-pinned — content proved current against the live text** | **5** | C30526 · C43592 · C43593 · C43594 · C43839 |
| **HELD — the live text now says something the case does not** | **2** | C30235 · C30236 |
| **HELD — the anchor it cites no longer exists** | **1** | C43821 |
| **HELD — a conflicting instruction, not a content problem** | **1** | C43547 |

---

## 1 · Re-pinned (5) — and the requirement each one maps to

| C-id | Report | Pin | Maps to (live) | The live text it was read against | Link |
|---|---|---|---|---|---|
| **C30526** | WIP | **22 → 28** | **Story 1 · Prerequisites** | *"The user must have the single reports permission — the one permission that grants access to all reports; there is no per-report permission. … the report reuses one existing reporting permission; it does not add a new one, and **the same permission covers the report and its downloads**."* The case's three points say exactly this, including that the download needs no extra permission. **The one-ordinary-reports-access rule still holds.** | <https://shopview.testrail.io/index.php?/cases/view/30526> |
| **C43592** | WIP | **22 → 28** | **§3 Key Decisions · fixed-price valuation** | *"Fixed-price lines are valued at their fixed amounts, and earn on completion. A line priced with a fixed labor total, or a fixed line total split into labor and part portions, is valued at those fixed amounts — the numbers the customer is billed — not at underlying picked parts or an hourly derivation."* | <https://shopview.testrail.io/index.php?/cases/view/43592> |
| **C43593** | WIP | **22 → 28** | **§3 Key Decisions · binary earning** | *"…earning is binary: the full fixed amount stays in Remaining until the line is completed, then moves entirely to Earned. When invoiced hours exist, the derived-rate proration applies. A completed work order never leaves value stuck in Remaining."* Matches all four points and the tester note. | <https://shopview.testrail.io/index.php?/cases/view/43593> |
| **C43594** | WIP | **22 → 28** | **§3 Key Decisions · core charges** | *"A core charge counts in parts value at every stage. … it is included in Parts Remaining and Parts Earned consistently across all tabs, including Estimates. Marking a returned core OK or Not OK never changes WIP figures — the core assessment is a credit event handled at invoicing, outside this report."* | <https://shopview.testrail.io/index.php?/cases/view/43594> |
| **C43839** | SBR | **22 → 24** | **nothing — and that is the point** | The case states in its own provenance that *"the Sales By Representative report specification version 22 does not name this visual treatment"*, and sources the expectation from Chris Ward's design review of 17 August 2026 instead. **Live version 24 was searched for a header-wrapping rule and still has none** (the only two "wrap" mentions are S5-R10, about data cells never being wrapped, and S17-R3, about the exports button on mobile). The case's own statement is therefore still true of v24, so the version was restamped to 24 and the sentence remains accurate. | <https://shopview.testrail.io/index.php?/cases/view/43839> |

All five were written through the TestRail **web editor** except C30526, which had to be re-encoded
through the API — see §3. Each was verified on its rendered page immediately after its own write:
zero literal tags, zero visible entities, the wording otherwise identical to before, the AUTOMATION
marker present once and still last, `custom_atmstatus` unchanged.

## 2 · Held (4) — precisely what is unresolved on each

### C30235 — <https://shopview.testrail.io/index.php?/cases/view/30235>
*"Negative dollar values render in accounting parentheses; money columns only"* · SBR, pinned at 22

**Two things in the live SBR v24 text that the case does not say.** Live §3:

> Negative dollar values use accounting-convention parentheses — ($1,234.56) — **on screen and in both
> PDFs**, across every money column (Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin,
> **Shop Supplies**, Adjustments, Margin, Subtotal). Labor Delta … and Margin % … are excluded.

1. The case's column list **omits Shop Supplies** — a column that has since been added to the report.
2. The case scopes the treatment to **"on screen"**; the live text scopes it to **"on screen and in
   both PDFs"**.

**Unresolved:** this is a content change, and JOB 4's approval covers re-pins only. **May we add
Shop Supplies to the column list and extend the scope to the two PDFs?** Both are direct quotations
from the live specification, so no PO decision is needed — only your go-ahead.

### C30236 — <https://shopview.testrail.io/index.php?/cases/view/30236>
*"Half-up rounding at each precision; totals may differ by one last-decimal unit"* · SBR, pinned at 22

The case says: *"money to cents; **Labor Delta and Margin % to one decimal**."* Live SBR v24 §3 says:

> All displayed numeric values round half-up (away from zero) at their stated precision (money to
> cents; **Labor Delta to one decimal; Margin % to two decimals**).

Corroborated twice over in the live text — S9-R2 rounds Labor Delta *"half-up to one decimal"*, and
the Margin % definition reads *"Margin ÷ Margin base × 100, **to two decimals**"*.

**Unresolved:** the case would send a tester to fail a correct build, or pass a wrong one, on
Margin %. It is a content change. **May we correct Margin % to two decimals and then re-pin?**

### C43821 — <https://shopview.testrail.io/index.php?/cases/view/43821>
*"Completed tab: Earned equals Total minus Adjustments, Remaining $0.00"* · WIP, pinned at 22

**Its three assertions are all still true — but the anchor it cites has been deleted.** The case
cites **S4a-R2**, and **there is no S4a-R2 anywhere in live WIP v28**. The live rules that carry the
same behaviour are:

* **S4-R18a** — *"On a work order in the Completed tab, Parts Earned is the sell value of every
  approved-line part and **Parts Remaining is always $0.00**…"*
* **S4-R15a** — the matching labour rule: *"…Labor Earned is the full quoted value of every approved
  labor line, whatever hours were clocked to it."*
* **S4-R21** — *"Total is Earned plus Remaining plus Adjustments"*, from which *Earned = Total −
  Adjustments* follows once Remaining is zero.

**Unresolved:** re-pinning it to v28 while it still cites S4a-R2 would leave the case pointing at a
requirement that does not exist — a worse state than being under-pinned. **May we re-cite it to
S4-R15a, S4-R18a and S4-R21 (in the References field and the provenance line) and then re-pin?** No
expectation wording would change.

### C43547 — <https://shopview.testrail.io/index.php?/cases/view/43547>
*"A large PDF download fails outright while the CSV of the same view works"* · PV, pinned at 10

**Its content proved CURRENT, and it maps to live PV v11 S6-R12 (with S6-N1).** S6-R12 live:

> An export is capped at a maximum of 10,000 rows in the current filtered set. When the filtered set
> exceeds the cap, neither the PDF nor the CSV is produced and the user is shown the message: *"This
> report is too large to export. Narrow the date range or filters, then try again."*

That is the message the case's item 4 quotes, word for word, as the behaviour that is **expected and
is NOT the failure under test**. S6-N1 covers the export-failure toast. The EXPECT-FAIL symptom and
its three outcomes still describe SV-8818 correctly.

**Unresolved — and it is an instruction conflict, not a content problem (Rule 63).** This batch
told us, for C43547, both *"Do NOT re-pin it"* (in the formatting item) and *"if its expectation
matches the live text → re-pin"* (in this item). **It was NOT re-pinned**, on the narrower
instruction. **Confirm which you want**: it is proved current and would take pin 10 → 11 plus a
read-date restamp, one edit, no wording change.

## 3 · A second flattening trap, found and repaired the same minute — C30526

C30526's three fields rendered in `markdown fr-view` while being **stored as bare text with newline
characters**. Opening such a field in the TestRail **web editor** loads it as one unbroken run of
text — the newlines have no HTML meaning — and the save writes back a **single paragraph**. Its
preconditions, steps and expectations all collapsed onto one line each.

* **The run stopped immediately**, as instructed; the other four were not attempted until the cause
  was understood.
* **Repaired in the same minute** by re-storing the same words through the API with the newlines
  written as `<br>` inside one `<p>`, and the pin applied.
* **Proved**: the rendered text of all three fields is now **identical, line for line, to the text
  captured before the write**, apart from the pin. `custom_atmstatus` unchanged (1). Evidence:
  `evidence/c30526-repair.json`, `evidence/job4-verify.json`,
  `evidence/snapshot-anchorless-9-before.json`.
* **`ui_edit.mjs` now refuses any field that renders `fr-view` while stored as bare text**, and
  `api_edit.py` refuses the mirror-image case. Between them the two gates close the trap from both
  sides. The full route table is in `RESULTS.md` §1.

## OUTSTANDING — what I need from you

1. **C30235** — approve adding **Shop Supplies** to the money-column list and extending the scope to
   *"on screen and in both PDFs"*, then re-pin 22 → 24?
2. **C30236** — approve correcting **Margin % to two decimals**, then re-pin 22 → 24?
3. **C43821** — approve re-citing it to **S4-R15a, S4-R18a and S4-R21** (its S4a-R2 no longer
   exists), then re-pin 22 → 28?
4. **C43547** — this batch gave two conflicting instructions about it. **Re-pin 10 → 11, or leave it
   pinned at 10?** It is proved current either way.

# Report Suite — the two approved content fixes and the re-cite — 2026-08-28

**Three cases written, all three verified on their RENDERED page after their own write. Nothing came
back wrong. None of the three is Automated (`custom_atmstatus = 1`), so no Rule-65 register row
arises from this job.**

Approved by the QA lead 2026-08-28, from the candidate list in
`build/report-suite/batch-2026-08-28/ANCHORLESS-9-VERDICTS.md`.

**Route:** all three render their text in a **bare `markdown` container**, which ESCAPES stored HTML —
an API write would put its own `<p>` wrapper on the tester's screen as literal text. They therefore
went through the **TestRail web editor** with surgical DOM-Range find/replace edits
(`../batch-2026-08-28/ui_edit.mjs`), which changes only the selected text. `refs` was then set through
the API, which is proven not to touch the body.

---

## C30235 — Shop Supplies + the PDF scope · corrected and pinned 22 → 24

Live SBR **v24** §3, read again today in
`source-verify-2026-08-26/specs/sales-by-representative.json`:

> *"Negative dollar values use accounting-convention parentheses — ($1,234.56) — **on screen and in
> both PDFs**, across every money column (Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin,
> **Shop Supplies**, Adjustments, Margin, Subtotal)."*

| Was | Now |
|---|---|
| *"— on screen, across every money column"* | *"— **on screen and in both PDFs**, across every money column"* |
| *"Parts Margin, Adjustments, Margin, Subtotal"* | *"Parts Margin, **Shop Supplies**, Adjustments, Margin, Subtotal"* |
| pinned **v22** | pinned **v24**, with a sentence naming exactly what v24 added |

## C30236 — Margin % to two decimals · corrected and pinned 22 → 24

Live SBR **v24** §3:

> *"All displayed numeric values round half-up (away from zero) at their stated precision (money to
> cents; **Labor Delta to one decimal; Margin % to two decimals**)."*

The case said *"money to cents; Labor Delta **and Margin %** to one decimal"* — which would have sent a
tester to **fail a correct build** on Margin %. Now: *"money to cents; Labor Delta to one decimal;
Margin % to two decimals."* Pinned **v24**, with a sentence saying plainly that the case previously
said one decimal and has been corrected.

## 🔴 C43821 — the anchor was NOT deleted. The case was RIGHT and the TOOL was WRONG

**The premise of this item does not hold.** It was raised as *"it cites S4a-R2 which no longer
exists"*. Read directly out of the live WIP **v28** body:

> *"**S4a-R2**: A row on the Completed tab therefore shows Earned equal to its Total less
> Adjustments, and Remaining of $0.00."*

**S4a-R2 is present, and its text is word-for-word what C43821 asserts.** The report that it had been
deleted came from `verify.py`, whose anchor pattern is

```python
ANCHOR = re.compile(r"\bS\d+-(?:R|E|N|Q)\d+[a-z]?\b")
```

That pattern **cannot match a story number carrying a letter**, so `S4a-R1`, `S4a-R2`, `S4a-R3`,
`S4a-N1` and `S4a-N2` are invisible to every count the tool produces — including the "gone" list that
the deletion claim rested on. This is a **third bug of the same family** as the two named for the
tooling job, and it is fixed there.

**So no re-cite was made and nothing was invented.** The instruction said to hold rather than invent a
mapping; the honest outcome is stronger than either — **the existing citation is correct and was
kept**, the case was pinned **22 → 28**, and the provenance now records that S4a-R2 was re-read in
version 28 and quotes it, so the next reader does not have to re-litigate this.

**The proposed replacement mapping (S4-R15a, S4-R18a, S4-R21) was NOT applied.** It would have
replaced a correct, direct citation with three indirect ones.

## Verification

`RENDERED-AFTER.json` — all three case pages re-read in a real browser after every write. Three
containers each, line breaks intact, no literal tag, no visible entity, the new version cited, the old
version gone, provenance present, `AUTOMATION:` marker present once and last. `DONE.jsonl` is the
per-case audit log (operation, C-id, HTTP status, verification result) and `REFS-LOG.json` records
the `refs` writes and proves the body, title and `custom_atmstatus` were unchanged by them.

## OUTSTANDING — what I need from you

1. **Everything the `S4a-` blind spot touched should be re-derived.** Six live WIP requirements
   (`S4a-R1`, `S4a-R2`, `S4a-R3`, `S4a-N1`, `S4a-N2`) have never appeared in any coverage count,
   verdict table or "NOT COVERED" list this project has produced. The fixed tool now sees them —
   **their coverage has not been assessed and is not claimed here.**

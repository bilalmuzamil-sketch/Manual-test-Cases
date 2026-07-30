> # ⛔ SUPERSEDED — DO NOT SEND
>
> **Superseded 2026-07-31.** This question is **already answered by Chris Ward's own spec**: SBR
> **v15** (live since 2026-07-29) requirement **`S14-R20`** rules it explicitly — the answer is
> **option A**. Asking it would be asking the PO to re-answer something he has already written down,
> which is exactly the embarrassment Standing Rule 31 exists to prevent (we did that three times on
> Filters the same day — see `build/LESSONS-2026-07-31.md` §1.1).
>
> **The verbatim answer, from `S14-R20`:**
>
> > *"Whenever the Location column is shown on screen (S21-R7), it is **included in all four exports
> > in the same position it occupies on screen** — Summary and Expanded, PDF and CSV: a Summary
> > (rolled-up) row carries the rep's location, reading **Multiple** when that rep spans more than one
> > location; an Expanded (per-invoice) row carries that invoice's own exact location. In addition,
> > every export … includes a "Locations:" line naming the location or locations the report is scoped
> > to … in a CSV it appears as a leading metadata line above the column-header row."*
>
> **What is happening instead:** the fix is **authorized and being applied** to our own cases —
> **SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and
> **SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)**, plus the Parts
> Velocity (`S6-R11`), Technician Utilization (`S7-R13`) and Inventory Value (`S10-R15`) equivalents.
> Written **scope-conditionally** per Standing Rule 42 (not a closed "exactly these headers" list),
> with `S14-R20` added to `refs` per Rule 20.
>
> **THE RESIDUAL ASK FROM CHRIS — the only thing still owed by him** — is *not* this question. It is a
> **spec correction**: v15 is internally inconsistent, because **`S14-R15` / `S14-R16` still enumerate
> the CSV headers *"in order"* without the conditional Location column that its own new `S14-R20`
> adds**. That blocks nothing (the newer text wins under Rule 32) but it will keep regenerating this
> same confusion for every reader. **Now tracked in `build/OUTSTANDING-ITEMS-REGISTER.md`** alongside
> his other open spec corrections.
>
> Retained for the record only. The original draft is below, unchanged.

---

# Sales By Representative — one question for Chris Ward — 2026-07-31

Plain-language product question only (no bugs, no test jargon).
Please pick an option (or write your own answer).

## Question 1 — Does the Location show as its own column in the Sales By Representative downloads?

**What happens now:** You told us that every downloaded report carries a "Locations:" line
naming the location or locations the report was run for, and that each report shows a Location
column on the screen. For the Sales By Representative report we are clear on both of those. What
we are not clear on is the downloaded spreadsheet files (the CSV downloads) for that report —
whether the Location is also meant to appear there as its own column alongside the other
columns, or whether the "Locations:" line at the top of the file is all that is expected.

**The question:** In the Sales By Representative spreadsheet downloads, should Location appear as
its own column in the file as well, or should only the "Locations:" line at the top show it?

**Options:**

- A) Location appears as its own column in the spreadsheet download as well.
- B) Only the "Locations:" line at the top; the columns stay exactly as they are today.

**Your answer:** **A — already answered by `S14-R20` in his own spec v15 (2026-07-29). Question
withdrawn; never sent.**

**One note on why we are asking:** our tests list the exact columns of those download files, in
order, and check them one by one. So we need to know whether to add Location to that list, or
leave the list as it is. Either answer is easy for us to apply — we just should not guess it.

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail links: `https://shopview.testrail.io/index.php?/cases/view/<id>` (Standing Rule 8).

| Q# | Affected cases (TestRail C-id) | Source refs | What each answer resolves to |
|---|---|---|---|
| 1 | SBR-EXP-10 (C30285) + SBR-EXP-11 (C30286) — both enumerate the CSV headers with the word "exactly" and neither list contains a Location column. Context: SBR-LOC-05 (C38913) asserts the Location column **on screen** only; SBR-EXP-02 (C30277) asserts the `Locations:` **metadata line** in every file; SBR-COL-04 (C30268) covers selector-vs-export and is a different concern. | SBR spec v15; Chris Ward's answers 2026-07-31; engineering tech plan. Trigger: **C38923** (Vladimir Tomovic's automated case, created 2026-07-30) asserts the Location column reaches the SBR Summary and Expanded CSVs — which directly contradicts our verbatim header lists. Full comparison: `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md` §4. | **RESOLVED = A**, from the spec itself (`S14-R20`), with no question sent. C30285 + C30286 get a scope-conditional Location entry (Rule 42) and `S14-R20` in `refs` (Rule 20); same fix applied to the PV / TU / IV export equivalents. C38923 was **correct** — nothing goes back to Vladimir (QA-lead decision 2026-07-31: do not message him; see `Note-to-Vladimir-automation-overlap.md`, marked NOT SENT). |

**Why this was nearly sent, and the control that stopped it:** the question was drafted from the
foreign-case contradiction before our own newest source had been re-derived. **Standing Rule 44** now
requires exactly that re-derivation *first* — which is what turned this from a PO question into a
defect on our own side. See `build/LESSONS-2026-07-31.md` §1.5.

# DEFECTS WITH NO IDENTIFIABLE SOURCE — for the QA lead to decide

QA lead's ruling: *"Any ticket which do not have any source you need to give them to me."* A defect whose
expected behaviour cannot be traced to the PRD, a story in the epic, or a verified answer from Chris Ward
is **not filed**. It comes here.

## STATUS: **3 items, none filed** — ⚠️ **CORRECTED 2026-08-06: item 2 was WRONG and is now FILED**

**Item 2 does not belong in this file at all.** Its claim that no requirement covers the totals row when
nothing matches is **false against the live document**, which states it **three times**. It was verified
from Confluence on 2026-08-06 and filed the same day as
**[SV-8991](https://shopview.atlassian.net/browse/SV-8991)**. So this file now holds **2 genuinely
unsourced items (1 and 3 as numbered below, plus item 4) and 1 corrected entry**. The wrong claim is
**kept below, struck through and dated**, rather than overwritten — a silently-erased wrong claim is how
the next session re-derives the same mistake. Full working:
`build/report-suite/zeros-row-2026-08-06/SOURCE-VERIFICATION.md`.

---

## 1 · Sales By Customer — the Location column is not sortable, and it may not be meant to be

**What we saw.** Every column heading sorts except two: the little arrow column at the far left, which is
correct, and **Location**, which has no sort arrow and does not respond.

**Why this one is NOT in the "no source" bucket, and is filed.** `S10-R1` says "Every column is sortable
except the chevron column", which covers it plainly. **Filed as
[SV-8963](https://shopview.atlassian.net/browse/SV-8963).** Listed here only so the record shows it was
considered against this test and passed it.

---

## 2 · Sales By Customer — the totals line vanishes when nothing matches — ✅ **SOURCED AND FILED 2026-08-06**

**What we saw.** Narrow the report until nothing matches and there is **no totals line at all** — not a
line of zeros. The same in a downloaded spreadsheet: headings and nothing else. *(This observation stands
— only the conclusion drawn from it was wrong.)*

### ⚠️ THE CLAIM BELOW IS WRONG — SUPERSEDED 2026-08-06

> ~~**Why it is NOT filed.** **No requirement says what the totals line should do when nothing matches.**
> Two of our own tests claimed "a totals row of zeros"; that claim came from us, not from any document, and
> it has been taken out (Rule 42/57). The underlying data is there — the server returns zero totals — so
> the report *could* show a zeros line if that is what is wanted.~~
>
> ~~**What we need.** Chris's answer to Q2 in `QUESTIONS-FOR-CHRIS.md`. If he says a zeros line should
> show, this becomes a filed defect immediately.~~

**Why it was wrong.** The Sales By Customer description states it **three times**, and it did so at
**Confluence version 15, published 2026-08-05T17:53Z — before the session that removed the claim ran**.
Read live from Confluence on 2026-08-06 and quoted verbatim:

- **`S18-R10`** (the download): *"If an export (CSV or PDF) is triggered while the active filters match no
  customers — for example, no customer is selected — the export still downloads, containing the column
  headers and **a totals row of zeros**, with no data rows and no warning."*
- **`S18-N1`** (the screen): *"When no customer is selected (every customer cleared), the report shows the
  empty state (Story 17) and **the totals row shows zeros**."*
- **the Story 16 placeholder note**, restating the export half and pointing at S18-R10: *"…an empty
  selection still downloads a **headers-plus-zero-totals** file…"*

So the assertion our two cases carried was **correctly sourced all along**, and removing it **disarmed two
tests** — the reverse of the usual failure. Nothing was rewritten to match the build; a documented
expectation was talked out of existence, leaving each case citing in its own provenance line the very
requirement its tester note denied. A case that cannot fail is not a test (Rule 57).

**It needed no answer from Chris.** Item Q2 was **deliberately kept off** the 2026-08-06 question sheet for
exactly this reason — its premise was false, and Rule 7 forbids putting a bug in front of a product owner.

**Filed as [SV-8991](https://shopview.atlassian.net/browse/SV-8991)** — Story Defect, parent SV-8616
(the owning story, *SBC - Story 18 - Filter by customer*), priority Medium, both requirement anchors
quoted, screenshot attached, 21 field checks read back all PASS. Six JQL duplicate searches ran first; no
duplicate exists.

**One precision correction:** the question-sheet README cited the pair as *"near S18-R10/R11"*. The second
requirement is **`S18-N1`**, not `S18-R11` — which is a different requirement about server-side filtering.

**Affected cases:**

- **[C30173](https://shopview.testrail.io/index.php?/cases/view/30173)** — the **download** half.
  **REPAIRED 2026-08-06:** assertion restored, the false note replaced by the Rule-61 symptom and its three
  outcomes, marker now `AUTOMATION: READY - EXPECT FAIL (SV-8991)`, `refs` pinned to v15. One
  `update_case`, HTTP 200, 30 fields compared, 0 mismatches.
- **[C30114](https://shopview.testrail.io/index.php?/cases/view/30114)** — the **screen** half.
  **REPAIRED 2026-08-06, authorised separately:** the false note removed, the S18-N1 assertion *"and the
  totals row shows zeros"* restored to item 4, the Rule-61 symptom and its three outcomes added before the
  provenance line, marker now `AUTOMATION: READY - EXPECT FAIL (SV-8991)`, `refs` repinned v13 → **v15**.
  One `update_case`, HTTP 200, **30 fields compared, 0 mismatches**; run 359 proven untouched **by result
  id** (535 of 535 present, 0 graded fields changed). Its symptom block is deliberately **narrower** than
  C30173's, because this case asserts four things and only the totals row fails — `sbc9.json` records
  `label: "None"` passing alongside `totals: null`. Details:
  `build/report-suite/full-viu-2026-08-06/execution-log.md`.

**⇒ Both halves of SV-8991 are now armed.** Neither case can any longer pass on a build that drops the
totals row, and the marker census moves **READY 357 → 356 · EXPECT FAIL 77 → 78** (the gate still holds at
434 ready to automate). The provenance build lines on both were **not** re-stamped — nothing was
re-observed today, so both still read `v3.5-7168d14` and the verdicts stay **PROVISIONAL** (Rule 49).

**An unresolved ambiguity in our own evidence, asserted nowhere.** `evidence/2026-08-06-session2/sbc7.json`
holds `emptyBody: " | "` followed immediately by `totalsInEmpty` reading a **fully populated, non-zero**
totals row — which cannot be the same state as `sbc9.json`'s `afterClear: {"totals": null}`. The likeliest
reading is two different empty states (an empty **date range** versus an empty **customer selection**), in
which case a stale non-zero totals row would be a **second, separate defect**. The harness script that
produced that capture is not in the repository and the branch is unreachable today, so it is recorded as a
question for the next live pass and claimed nowhere (Rule 12).

---

## 3 · Sales By Customer sits under a "SALES" heading, not under "Performance"

**What we saw.** Sales By Customer is on its own under a **SALES** heading. Parts Velocity and Inventory
Value are under **PARTS**. Only Work In Progress, Technician Utilization and Sales By Representative are
under **PERFORMANCE**.

**Why it is NOT filed.** **The specification is silent on the heading.** `S1-R1` says only that the report
"appears in the Reports left-side navigation" — which it does. Our test's "Performance group" claim traced
to a walkthrough video of 30 July, and the specification has been revised twice since without ever naming
a group. **Filing this would mean asserting a requirement no current document contains** (Rule 57).

**What we need.** Chris's answer to Q1.

**Affected case:** [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) — repaired to assert
only what the specification asserts, with a note telling the tester to record the heading and not fail on
it.

---

## 4 · The PDF heading joins its two dates with the wrong kind of dash

**What we saw.** The Sales By Customer PDF heading reads *"Date Range: Aug 1, 2026 – Aug 7, 2026"* using an
**en dash (U+2013)**. `S15-R11` asks for the dates to be "joined by an **em dash**" and gives an em-dash
example.

**Why it is NOT filed.** It **is** sourced, and it **is** a difference — but it is a single wrong character
on a line that already carries a **real** fault (the end date is a day late, which is
[SV-8937](https://shopview.atlassian.net/browse/SV-8937)). Filing a second ticket for the dash on the same
line would be noise, and quietly folding it into someone else's ticket is not ours to do.

**What we need.** A one-word ruling: fold it into SV-8937, file it separately, or drop it. Our
recommendation is to **fold it into SV-8937** when that ticket is next touched.

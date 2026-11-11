# RECONCILE — open group loads every document at once (C1062570, C1062571) — CLAUDE.md §1 bullet (d), Rules 106 / 114 / 137

Read 11 Nov 2026 ~10:55 UTC. Cases read live from TestRail (`get_case`), stories read live from Jira (read-only).

## 1. The SOURCE
PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, **version 11** (5 Nov 2026, Chris Ward), S1-R8, last sentence, verbatim:
> "On A/R Collection and A/P Unpaid Invoices, an open customer or vendor shows its first 100 documents, then the next 100 as the user scrolls; its document count, its subtotals, the Totals row and the exports always cover all of its documents."

**Honesty note (Rule 106, 2026-09-15 extension):** this is the single live read of the PRD taken at the start of this test pass (10 Nov 2026, QA lead's "read once at the start"; copy `build/aging-reports/sources/prd-947650561-v11-read-1110.md`, line 138). It was **not re-fetched today** — no go-ahead for a second source read in this pass (Rule 81). If the PRD moved past v11 since 10 Nov, that is NOT VERIFIED here.
PRD change log row 2026-11-04 (Chris Ward): "S1-R8: documents inside an open customer or vendor load 100 at a time." — the sentence is deliberate, not a leftover.

**Second source checked, and the gap it shows:** the owning story SV-11531 (read live 11 Nov 10:55 UTC; description last edited 23 Oct 2026) still carries the **older** S1-R8 (30 customers/vendors at a time; Detail buckets 100 lines) **without** the 4 Nov per-group sentence. Under Rule 32 (latest wins) the PRD v11 of 5 Nov is the later document and governs. This is not a contradiction (the story is silent on per-group paging, not opposed to it), so it does not hold the ticket; it is worth one line to the QA lead because a developer reading only the story would not see the requirement.

## 2. The CASES' Expected (live)
C1062570 (A/R Collection) Expected, step 2: "The group opens with its first 100 invoices." · step 3: "The next invoices load under the first 100, up to 100 more each time." · step 4: "Every invoice is listed once: the number of rows equals the count in brackets, and no invoice number is repeated." Provenance quotes S1-R8 in full, PRD v11.
C1062571 (A/P Unpaid Invoices) Expected: the same with "bills". Provenance quotes S1-R8 in full, PRD v11.

## 3. Case vs source (Rule 137's three questions)
| Question | Answer |
|---|---|
| Does the case forbid anything the sentence does not? | No. "first 100" and "next … up to 100 more each time" are the sentence's "first 100 documents, then the next 100 as the user scrolls". |
| Does it allow anything the sentence forbids? | No. |
| Can it be true for everything the product legitimately shows? | Yes: with 105 documents, 100 then 5. |
**Verdict: case and source AGREE.**

## 4. The BUILD observed (QA site sv11315, build v26.45.2-6a8b89c, 10-11 Nov 2026)
* A/R Collection, only ZZAUTOTEST OVER100 C (105) ticked: opening the group lists all 105 invoices; past the 100th (S11315-17714) invoices 101-105 are already drawn; no loading row; no further request when opening or scrolling. Measured on three separate probes (`exec/s1e` twice, `exec/s1f`, `exec/s1g`).
* A/P Unpaid Invoices, only ZZAUTOTEST OVER100 V (105) ticked: the same (100th = ZZO100-099).
* What does NOT fail (written into the ticket, Rule 137(3)): count "(105)", "Total for" row, Totals row ($18,274.20 / $6,510.00), each document once, no duplicates.

## 5. Outcome (bullet (d) four-way table)
**Case agrees with source + build differs ⇒ a real defect.** Not a false pass, not a false defect.

## 6. Gates (skill 06 A1-A10, short form)
| # | Check | Result |
|---|---|---|
| A1 | Reproduced on the current build, more than once | Yes - s1e (x2 on A/R), s1f, s1g, 11 Nov 03:42-03:50 UTC, build v26.45.2-6a8b89c. Not re-measured at the moment of drafting (no UI work allowed in this pass; 6e) - re-check on the build before filing if hours have passed. |
| A2 | Verbatim quote, current version | PRD v11 quote above (read 10 Nov; see honesty note). |
| A3 | Not unfinished | Owning story SV-11531 = TESTING QA (live, 10:55:55Z). The developer handed it to QA. |
| A4 | Not already reported | JQL `parent = SV-11315`, `text ~ "100 documents"`, Story Defects under SV-11531/11533/11534 - no ticket about per-group loading (`../duplicate-search-2026-11-11.json`). SV-12529 ("A/R Aging Collection displays all customers' totals despite filtering") is a different fault. |
| A5 | Not by design | PRD change log 2026-11-04 adds it deliberately. |
| A5-b | Shop meaning | A shop's biggest customers/vendors (hundreds of open documents) should open quickly in pieces; the rule is that the group draws 100 at a time. In shop words: "a customer with more than 100 open invoices opens all of them at once instead of 100 at a time." |
| A6 | Not env/data/role | Admin role, seeded ZZAUTOTEST data, two reports, same result. |
| A7 | Correct parent | SV-11531: S1-R8 is Story 1's requirement; cases carry refs SV-11531. |
| A8 | Evidence | two annotated pictures, steps, build, env, data named. |
| A9 | Refusals | "Duplicate" - searched, none. "Works as designed" - PRD 4 Nov says otherwise. "Cannot reproduce" - seeded data names given. "Unfinished" - story in TESTING QA. |
| A10 | Rule 62 | Prepared to the button; NOT filed. |

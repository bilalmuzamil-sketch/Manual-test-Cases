# DEFECT-CANDIDATE D1 — aging PDFs leave out Amount / Open Balance (A/R Detail also Due Date) when a name is one very long word

**VERDICT: ADMISSIBLE — drafted, NOT filed** (Rule 62/94 A10: the QA lead's per-ticket go-ahead is needed). Epic SV-11936 (Reports).
Re-checked 16 Nov 2026, 09:24–10:00 UTC, staging v26.45.4-f3d3d2d (start and end of every run).

| # | Check | Result | Evidence |
|---|---|---|---|
| A1 | Reproduced twice on the current build | ✅ A/R Detail: 8 PDFs (HD + LE sessions, as of 16 Nov and 30 Sep, all locations and Heavy Duty only), build unchanged start/end. A/P Detail and A/P Unpaid (long-name vendor): 2 each (HD session 09:5x, LE session 10:0x). A/R Collection, Heavy Duty only: 2 (HD and LE sessions). | `D1-evidence.json` (headings + count of "$" per PDF), `../evidence/pdf-extra.json`, `../evidence/pdf-repro2-LE.json`, `../evidence/screen-HD*.json` |
| A2 | Expectation quoted verbatim from the current source | ✅ Confluence 947650561 **v13** (13 Nov 2026, last modified re-read 16 Nov ~09:40 UTC) S3-R7b and S3-R3 (quoted in TICKET.html); Chris Ward, SV-12831 comment 81407 (14 Nov 2026) "every column should always print on the page". | TICKET.html |
| A3 | Not an unfinished feature | ✅ Owning story SV-11533 "Story 3 - Export to PDF and CSV" is **TESTING STAGE** (built, under test; read live 16 Nov). Its sub-items SV-12544/SV-12547 (PDF format) are Done. | live JQL 16 Nov |
| A4 | Not already reported (closed included) | ✅ Nearest: **SV-12831** (Open) covers only the A/R and A/P **Summary** PDFs; its description says *"The A/R Aging Detail and A/R Aging Collection PDFs already keep all their columns on the page with the same long names"*, and Chris limited the fix: *"This is only for the A/R and A/P Aging Summary PDFs"*. **SV-12137** (Ready for Production) is the on-screen table before the rebuild, not the PDFs. SV-12546 (Obsolete) is empty buckets; SV-12539 (RfP) is PDF failing at ~1,100 rows. | Queries below |
| A5 | Not by design | ✅ S3-R7b requires Amount and Open Balance on every "Total for" row; Chris called the same symptom on the Summaries a defect. | — |
| A6 | Not environment / data / role | ✅ Triggered by staging's long-name test customers/vendors ("ZZAUTOTESTAbcdefghij…", 120 letters; "ZZBREAK … Superlongunbroken…"). Chris on SV-12831: "Even if names this long are rare … isn't okay." Admin, clean quick-login sessions, build marker read from the page. Ordinary-name PDFs print every column (control). | `D1-evidence.json` |
| A7 | Correct parent | Epic at creation **SV-11936** (QA lead amendment 5 Nov, Reports). Links: relates to SV-11533 (owning story, established from SV-11315's children) and SV-12831. | EPIC.txt |
| A8 | Evidence complete | ✅ Annotated picture (opened and checked: no data covered), steps, build, environment, zones, times. | D1-annotated.png |
| A9 | Argue it down | "Duplicate of SV-12831" — no: that ticket and Chris's ruling are explicitly limited to the Summaries and state the other PDFs are fine. "Test data only" — Chris already ruled rare long names still must print every column. "Unbuilt" — Story 3 is built and in testing. "Cannot reproduce" — 14 PDFs across two sessions and zones. "Works as designed" — S3-R7b says otherwise. "Environment" — same build marker throughout. **Strongest remaining argument:** it could be added to SV-12831 instead of a new ticket; that is the QA lead's call (recommendation: new ticket, because SV-12831's fix is scoped by Chris to the Summaries). |
| A10 | Creation hold / permission | ⏸ Not filed. Per-ticket go-ahead needed. |

**Duplicate searches run (read-only, 16 Nov ~09:58 UTC):**
- `project = SV AND (text ~ "aging PDF" OR text ~ "aging pdf columns" OR summary ~ "PDF") AND (summary ~ "aging" OR summary ~ "A/R" OR summary ~ "A/P" OR parent in (SV-11936, SV-11839, SV-11531, SV-11532, SV-11533, SV-11535, SV-11536, SV-11539))` → 40 hits.
- `(parent = SV-11936 OR parent = SV-11839 OR parent in (SV-11531 … SV-11539) OR parent = SV-11315) AND (text ~ "PDF" OR summary ~ "PDF" OR text ~ "cut off" OR text ~ "column")` → 57 hits; PDF/column ones listed in `../evidence/dup-searches.txt`.

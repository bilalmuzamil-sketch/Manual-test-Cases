# Filters re-check — TestRail execution log, 5 August 2026

**`update_case` ONLY. No case added, no case deleted, no section touched, no run written to.**

Build the cases were verified against: **`v3.4.2-d00239b`** on `sv8785.qa.shopview.com`.

## How each operation was verified (Standing Rule 50 — exhaustive, then exact)

1. **re-GET before writing** and prove the live case is still byte-identical to the pre-write
   snapshot on **every** field — a drift would have stopped the batch.
2. **`update_case` with only the intended fields.**
3. **re-GET after writing** and compare **every one of the 28 fields**: each intended field
   byte-equal to what we meant to write, and **every other field byte-identical to the
   pre-write snapshot**. Only `updated_on` and `updated_by` are exempt.
4. A mismatch means **the write failed** — stop, and dump both byte sequences. None occurred.

**Declared normalisation (the only one):** TestRail's `refs` splits on commas, trims each entry
and rejoins with a bare comma, and rejects any single entry over 248 characters. The one `refs`
we wrote is a single comma-free entry of **230** characters.

**Rule 41 — whole-case re-read.** Every case opened was re-read end to end against the current
specification (Confluence **version 18**, page body version 1.6, fetched live 2026-08-05) before
being saved, not only the field being changed. That is recorded per operation below.

**Rule 38 — foreign cases.** The executor refuses any case not authored by us. All 110 are
`created_by = 3`; **zero foreign cases exist in the Filters group.**

## Totals

| | |
|---|---|
| `update_case` operations | **110** |
| HTTP 200 | **110** |
| Byte-verified MATCH | **110** |
| Fields compared per operation | **28** |
| Mismatches | **0** |
| `add_case` / `delete_case` / section changes | **0** |
| Run writes | **0** |

## Every operation

| # | Case | C-id | Fields written | HTTP | Verification | Fields compared | What the edit did |
|---|---|---|---|---|---|---|---|
| 1 | FLT-BAR-01 | C29557 | custom_expected | 200 | MATCH | 28 | replaced the closed-ticket line with the accepted-behaviour wording (QA lead decision 2) |
| 2 | FLT-BAR-02 | C29558 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 3 | FLT-BAR-03 | C29559 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 4 | FLT-STAT-01 | C29560 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 5 | FLT-STAT-02 | C29561 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 6 | FLT-STAT-03 | C29562 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 7 | FLT-STAT-04 | C29563 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 8 | FLT-STAT-05 | C29564 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 9 | FLT-STAT-06 | C29565 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 10 | FLT-CUST-01 | C29566 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 11 | FLT-CUST-02 | C29567 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 12 | FLT-CUST-03 | C29568 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 13 | FLT-CUST-04 | C29569 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 14 | FLT-CUST-05 | C29570 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 15 | FLT-CUST-06 | C29571 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 16 | FLT-CUST-07 | C29572 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 17 | FLT-CUST-08 | C29573 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 18 | FLT-CUST-09 | C29574 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 19 | FLT-TECH-01 | C29575 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 20 | FLT-TECH-02 | C29576 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 21 | FLT-TECH-03 | C29577 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 22 | FLT-TECH-04 | C29578 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 23 | FLT-TECH-05 | C29579 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 24 | FLT-TECH-06 | C29580 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 25 | FLT-TECH-07 | C29581 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 26 | FLT-ADV-01 | C29582 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 27 | FLT-ADV-02 | C29583 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 28 | FLT-ADV-03 | C29584 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 29 | FLT-ADV-04 | C29585 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 30 | FLT-ADV-05 | C29586 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 31 | FLT-ADV-06 | C29587 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 32 | FLT-ADV-07 | C29588 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 33 | FLT-ASSET-01 | C29589 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 34 | FLT-ASSET-02 | C29590 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 35 | FLT-ASSET-03 | C29591 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 36 | FLT-ASSET-04 | C29592 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 37 | FLT-ASSET-05 | C29593 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 38 | FLT-ASSET-06 | C29594 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 39 | FLT-CHIP-01 | C29595 | custom_expected | 200 | MATCH | 28 | removed the SV-8824 known-issue line (defect fixed on this build) |
| 40 | FLT-CHIP-02 | C29596 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 41 | FLT-CHIP-03 | C29597 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 42 | FLT-CHIP-04 | C29598 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 43 | FLT-CHIP-05 | C29599 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 44 | FLT-CHIP-06 | C29600 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 45 | FLT-COLL-01 | C29601 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 46 | FLT-COLL-02 | C29602 | custom_expected | 200 | MATCH | 28 | replaced the closed-ticket line with the accepted-behaviour wording (QA lead decision 2) |
| 47 | FLT-COLL-03 | C29603 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 48 | FLT-COLL-04 | C29604 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 49 | FLT-COLL-05 | C29605 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 50 | FLT-EMPTY-01 | C29606 | custom_expected | 200 | MATCH | 28 | replaced the closed-ticket line with the accepted-behaviour wording (QA lead decision 2) |
| 51 | FLT-EMPTY-02 | C29607 | custom_expected | 200 | MATCH | 28 | replaced the closed-ticket line with the accepted-behaviour wording (QA lead decision 2) |
| 52 | FLT-TAB-01 | C29608 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 53 | FLT-TAB-02 | C29609 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 54 | FLT-TAB-03 | C29610 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 55 | FLT-TAB-04 | C29611 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 56 | FLT-TAB-05 | C29612 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 57 | FLT-PERS-01 | C29613 | custom_expected | 200 | MATCH | 28 | added the SV-8871 known-issue line (new defect found on this build) |
| 58 | FLT-PERS-02 | C29614 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 59 | FLT-PERS-03 | C29615 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 60 | FLT-PERS-04 | C29616 | custom_expected | 200 | MATCH | 28 | added the SV-8832 known-issue line (we reproduced this with seeded data; our earlier pass had not) |
| 61 | FLT-URL-01 | C29617 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 62 | FLT-URL-02 | C29618 | custom_expected | 200 | MATCH | 28 | extended the shared-link known-issue line with the desktop half (SV-8871) |
| 63 | FLT-URL-03 | C29619 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 64 | FLT-URL-04 | C29620 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 65 | FLT-MOB-01 | C29621 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 66 | FLT-MOB-02 | C29622 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 67 | FLT-MOB-03 | C29623 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 68 | FLT-MOB-04 | C29624 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 69 | FLT-MOB-05 | C29625 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 70 | FLT-MOB-06 | C29626 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 71 | FLT-MOB-07 | C29627 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 72 | FLT-MOB-08 | C29628 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 73 | FLT-MOB-09 | C29629 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 74 | FLT-MOB-10 | C29630 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 75 | FLT-API-01 | C29631 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 76 | FLT-API-02 | C29632 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 77 | FLT-API-03 | C29633 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 78 | FLT-API-04 | C29634 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 79 | FLT-API-05 | C29635 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 80 | FLT-TAB-06 | C38876 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 81 | FLT-STAT-07 | C38877 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 82 | FLT-ASSET-07 | C38878 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 83 | FLT-URL-05 | C38879 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 84 | FLT-PERS-05 | C38880 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 85 | FLT-PERS-06 | C38881 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 86 | FLT-RPTS-23 | C38882 | custom_expected, custom_preconds, custom_steps, refs, title | 200 | MATCH | 28 | rewrote the expected results to follow the newer specification (ready-made periods and a pre-filled default range), written so it does not depend on one fixed list of periods; re-titled and rewrote the preconditions and steps to match, and named the report to use; pinned the reference to the newer specification revision |
| 87 | FLT-PSRCH-01 | C38883 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 88 | FLT-PSRCH-02 | C38884 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 89 | FLT-PSRCH-03 | C38886 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 90 | FLT-PSRCH-04 | C38888 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 91 | FLT-PSRCH-05 | C38889 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 92 | FLT-PSRCH-06 | C38891 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 93 | FLT-PSRCH-07 | C38893 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 94 | FLT-API-06 | C38895 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 95 | FLT-URL-06 | C38896 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 96 | FLT-EMPTY-03 | C38897 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 97 | FLT-PSRCH-08 | C38898 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 98 | FLT-PSRCH-09 | C38899 | custom_expected | 200 | MATCH | 28 | replaced the closed-ticket line with the accepted-behaviour wording (QA lead decision 2) |
| 99 | FLT-PSRCH-10 | C38900 | custom_expected | 200 | MATCH | 28 | removed the SV-8844 known-issue line entirely (defect fixed; QA lead decision 1) |
| 100 | FLT-PSRCH-11 | C38901 | custom_expected | 200 | MATCH | 28 | removed the SV-8844 known-issue line entirely (defect fixed; QA lead decision 1) |
| 101 | FLT-PSRCH-12 | C38902 | custom_expected | 200 | MATCH | 28 | removed the SV-8844 known-issue line entirely (defect fixed; QA lead decision 1) |
| 102 | FLT-PSRCH-13 | C38903 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 103 | FLT-PARTS-01 | C38904 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 104 | FLT-PARTS-09 | C38905 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 105 | FLT-PARTS-11 | C38906 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 106 | FLT-PARTS-12 | C38907 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 107 | FLT-PARTS-13 | C38908 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 108 | FLT-RPTS-01 | C38909 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 109 | FLT-RPTS-21 | C38910 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |
| 110 | FLT-RPTS-22 | C38911 | custom_expected | 200 | MATCH | 28 | re-stamped the provenance line only |

Every row above also carries, in the machine log `tools/exec-log.jsonl`, the field
`reverified_whole_against: "Filters spec Confluence v18 (body version 1.6), read live 2026-08-05"`.

## Run 352 — proven untouched, before and after

| Check | Before | After |
|---|---|---|
| `include_all` | false | false |
| Tests | 110 | 110 |
| Result records | 425 | 425 |
| `case_id` sets equal in BOTH directions | — | **yes**, nothing only-before and nothing only-after |
| Every prior result present **by id** | — | **yes**, 0 missing |
| Result records byte-identical field by field | — | **yes**, 0 differences |
| Ahtasham Amjad's results (user 7) | 30 — 23 passed, 7 failed | 30 — 23 passed, 7 failed |

**No `update_run` was needed** because no case was added or removed, so the union rule never
came into play. The 425 records break down as **30 by Ahtasham on 4 August** (his live execution)
and **395 from the run's creation in July** (316 comment-only, 79 untested).

# SV-12547 — Aging PDFs close each group with "Total for <name>" (retest of fix 0a80fba213)

**Verdict (ours): PASSED — every item on Nemanja's QA checklist (comment 80951) observed on the branch.**
**Ticket state when we finished (re-read 12 Nov 2026):** Done / resolution Done at 02:23 CDT, with comment 81008
under our shared account ("QA Status: Passed … https://shopview.testrail.io/index.php?/tests/view/4687253").
That was not posted by this session — treated as the QA lead's action (Rule 53/103). **Nothing written to Jira by this session.**

- Environment: https://sv11315.qa.shopview.com, build marker v26.45.2-6a8b89c (fix commit 0a80fba213 is back-end only, so the
  front-end marker does not move), location Staging Heavy Duty - 9919, Admin (and a reports-only user for the credit-term check).
- Product decision driving the change: Milos, comment 80928 ("switch, do the change") on Nemanja's question 80913.
- Mode: API mode (Rule 113) — PDFs/CSVs fetched through the app's own export (both the ⋯ menu on screen and the same
  request through the page session), read with pdftotext -layout / -bbox, a few pages rendered to PNG. No recording, no technical section.

## Checklist (handoff 80951) → result

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Ex.1 A/R Aging Collection, ZZAUTOTEST AR R36 Collect X, 11/11/2026 | PASSED — "Total for ZZAUTOTEST AR R36 Collect X $110.00 $110.00"; screen reads the same | ev/ex1-arcol.pdf, ex1-arcol-screen.png, png-ex1-1.png |
| 2 | Ex.2 A/R Aging Detail, ZZAUTOTEST AR R13 Payment After | PASSED — "Total for 31-60 days past due $100.00 $60.00"; matches screen | ev/ex2-ardet.pdf, ex2-ardet-screen.png |
| 3 | No "Subtotal" anywhere | PASSED — 0 in all 18 PDFs downloaded (4 grouped reports × several filters + 2 Summary PDFs) | ev/check.json |
| 4 | A/P Unpaid Invoices, one vendor | PASSED — Kernville, P97 Network: "Total for <vendor>" | apun-*.pdf |
| 5 | A/P Aging Detail, one vendor | PASSED — Amani: 91+, 61-90 (negative), 31-60 buckets each "Total for <bucket>" | apdet-amani*.pdf |
| 6 | Bucket names letter-for-letter | PASSED — A/R Detail all customers (634 rows): "91 or more days past due", "61-90 days past due", "31-60 days past due", "1-30 days past due", "Current"; totals equal the screen | ardet-all.pdf, apdet-allbuckets.pdf |
| 7 | Same words as the screen's "Total for" row | PASSED — screen captures for ex1, ex2, Amani, P97, wrap vendor | ev/*-screen.json/png |
| 8 | Long name wraps, Date column not widened | PASSED — seeded vendor with a 173-character name (ZZAUTOTEST SV12547 Wrap Vendor …) wraps inside the row; Date column ~68 pt vs 69–90 pt with short names; amounts under Amount/Open Balance. P97 (78 chars) on one line | apun-wrap.pdf, png-apun-wrap-1.png, seed.json |
| 9 | Location column shown and hidden | PASSED — all locations (shown) and one location (hidden): amounts under Amount and Open Balance, no Due Date/Past Due figures on the Total row | arcol-locmix-*.pdf, apun-kernville-*.pdf, ardet-all-1loc.pdf |
| 10 | Phone + Credit term on the A/R Collection customer line; credit term only with View+Manage AP/AR | PASSED — Admin: "Phone: 257-911-9306   Credit term: COD"; reports-only user (role "ZZAUTOTEST AR AP Reports only": reportsPageAccess only, seeApArData false): "Phone: 257-911-9306" and **no** Credit term, on the PDF and on screen. Total row = name + two amounts only | arcol-bancescu.pdf, tech-arcol-bancescu.pdf, tech-arcol.png, png-bancescu-1.png |
| 11 | Negative total format | PASSED — "Total for Bancescu & Sons Truck & Trailer Repair (-$1,880.00) (-$1,880.00)", Kernville "(-$96.81)", seeded vendor "Total for Current (-$25.00)" | as above |
| 12 | Amounts + Totals row unchanged | PASSED against the screen (same figures on every group checked, incl. A/R Detail all-customer bucket totals $118,830.25/$118,341.26 … Current $5,921.00). Not compared against a pre-fix PDF — the branch only holds the fixed build | check.json |
| 13 | CSVs: one row per document, one Totals row, no group/"Total for" rows | PASSED on all four reports | *.csv, check.json |
| 14 | A/R and A/P Summary (not impacted) | Render fine, no "Total for"/"Subtotal" | arsum-bancescu.pdf, apsum-kernville.pdf |

Checker note: check.py flagged the 173-character wrap row as "0 money tokens" — a line-split artefact of pdftotext (the
amounts sit on the wrapped line); the rendered page png-apun-wrap-1.png shows them under the right columns.

## Role handling (Rule 105)
- Tech user (staff d2cb20a6…) was given "ZZAUTOTEST AR AP Reports only" (read back first: reportsPageAccess only,
  seeApArData false) for check 10, then **Technician was reset to template on screen** (already at template — Save stayed
  disabled; the 6 template permissions before = after) and assigned back. Log: ev/role-log.json, ev/role-reset-af8d02b5.png.

## Test data left on the branch (no cleanup on QA branches)
- Vendor "ZZAUTOTEST SV12547 Wrap Vendor With An Extremely Long Name …" (173 chars) + a $25.00 vendor credit dated 12 Nov 2026.

## Not done
- Jira comment, label and status: not touched — the ticket was already Done with a PASSED comment (81008). Asked the QA lead.
- Before/after exhibit: not built. The pre-fix "Subtotal" pictures are the ticket's own attachments (PIC1/PIC3); no Jira
  cookies in this container to download them.

## Learning check
Nothing new for the playbook beyond: the roles page route is /administration/roles-permissions (already recorded).

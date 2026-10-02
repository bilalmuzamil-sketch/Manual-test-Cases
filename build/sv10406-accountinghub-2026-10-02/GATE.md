# SV-10406 — re-audit and pre-post gate, 2 October 2026

The QA lead asked for everything on this ticket to be re-checked carefully. This records the audit
and the Standing Rule 72 gate run immediately before comment 77791 was rewritten.

## The audit — every claim in the posted comment re-verified against the live record

| # | Claim as posted | Re-verified | Verdict |
|---|---|---|---|
| 1 | Build `v26.40.3-e9ae339` | `index.html` re-read live; last-modified Fri 02 Oct 09:34:01 GMT, etag `2d055567…`, sha256 `3d6dedfab1ad6c40…` — identical to pass start | **HOLDS** |
| 2 | `sv10406.qa.shopview.com` does not resolve | Re-checked, still does not resolve | **HOLDS** |
| 3 | Decimals kept on every return | All 18 ZZAUTOTEST credits re-read from the stored record, de-duped by `vendor_return_id`, arithmetic re-checked line by line | **HOLDS** |
| 4 | "N05 — and the credit is not just the fee" | **N05 carries NO restocking fee.** The claim is true of the product but that case does not demonstrate it | **WRONG CITATION — fixed**, now cites `-FEE` ($17.77 less $5.00 = $12.77) |
| 5 | "Could not produce a no-tax return; the tax box would not take a zero" | A real click + Ctrl+A + Delete + type + Tab sets it first time. The earlier failures were a programmatic setter the framework never saw, plus two inputs sharing `data-test-id="input_base"` | **WRONG — fixed**, `-AC5B` created with tax 0 and fee 0 |
| 6 | "The two systems do not agree on the inventory change" | On `-AC5B`: ShopView $217.55, AccountingHub entry **#13746** AP debit $217.55 / Parts Inventory credit **$217.55** | **WRONG — criterion 5 PASSES.** Reframed: on **taxed** returns only, the tax lands in Parts Inventory (11 of 11) |
| 7 | "Only 1 of 8 confirmed returns reached AccountingHub — needs a developer's eye" | Full vendor-credit list paged to the end (1,317 records): **17 of our 18 posted**, matched by memo. The one absent (`-AH1`) was confirmed 14:28, before activation 14:33:44 | **WRONG — withdrawn entirely**, nothing to investigate |
| 8 | `add-item` keeps decimals | Items re-read: 1.50, 0.50, 1.25 all exact | **HOLDS** |
| 9 | `change-item` returns HTTP 500 | Re-probed during the audit, 500 again | **HOLDS** |
| 10 | Location tax restored to GST | `GET /api/workplaces` → Heavy Duty - 9919 tax `{"name":"GST"}` | **HOLDS** |
| 11 | Backfill wrote 16,636 records, state completed | Re-read: `completed`, `written 16636` | **HOLDS** |
| 12 | Cancel Return inert | Unchanged | **HOLDS** |

Also established during the audit, and new: the five credits created **before** go-live post
AP debit / **Opening Balance Equity** credit (correct for a historical backfill), while the twelve
created after activation post AP debit / **Parts Inventory** credit.

## New observation, searched before reporting (Standing Rule 93)

`/accounting/ledger/journal-entries` shows *"Something went wrong loading this section"*; reproduced
twice, **no API call fails**, so it is client-side. **Already tracked —
[SV-10653](https://shopview.atlassian.net/browse/SV-10653) "Restore reliable Journal Entries views"
(Open) names that exact string in requirement S3-R3**, with
[SV-10712](https://shopview.atlassian.net/browse/SV-10712) as its verification ticket. **Not raised.**
Bucket: already tracked.

## Pre-post gate (Standing Rule 72)

| Check | Result |
|---|---|
| Build marker re-read at the moment of posting | `v26.40.3-e9ae339`, sha256 `3d6dedfab1ad6c40…` — **identical**, no redeploy under the pass |
| Ticket state re-read | **TESTING QA**, priority **Medium**, newest comment is still 77791 (mine) — nothing arrived mid-pass |
| Figures traced to live evidence this pass | Yes — every number re-read from the stored record or the ledger |
| Named test data still live on the branch | `-AC5B` and `-FEE` both present on the Credits tab |
| Evidence images | Uploaded as **real Jira attachments** (61708/61709/61710), not external media |
| Human voice / no AI fingerprint | Scanned the body text — clean |
| No mention of Stefan (QA lead's instruction) | Confirmed absent in the source **and** in the ADF read-back (`MENTIONS: none`) |
| No "Technical details for developers" section (Rule 84) | Absent — not asked for on this ticket |
| Read back after posting, in ADF | First text = `OVERALL QA STATUS: PASSED`; **3 media nodes, all type `file`** with correct 900×453 / 900×225 / 900×463; one table of 10 rows; **none of the three retracted claims present** |

## Exhibits

- `ev/01-no-tax-return-both-systems-agree.png` — the clean criterion-5 case, both systems
- `ev/02-half-unit-with-restocking-fee.png` — 0.5 unit with a $5.00 fee → $12.77
- `ev/03-on-a-taxed-return-the-tax-lands-in-inventory.png` — the narrowed tax observation

The superseded `ev/01-shopview-vs-accountinghub.png` was removed: its footer carried the retracted
"the two systems do not agree" sentence, and leaving it would have contradicted the corrected record.


---

## Consolidation to a single comment — 2 October 2026, 12:05 UTC

The QA lead: *"there should not be any correction note in a different comment. I want one single
comment in the ticket that tells it all as per the standard comment with exhibits and everything."*

The ticket carried **three** comments of mine, not one:

| id | What it was | Action |
|---|---|---|
| 77727 | QA PASS against the **old** build `v26.39.2-998e506`, with "parts could not be exercised, see the comment below" | **Deleted** (HTTP 204) — text archived at `superseded-comments/comment-77727_2026-10-01_qa-pass-on-old-build.txt` |
| 77728 | "STILL TO BE TESTED" — the four blocked items, tagging Stefan | **Deleted** (HTTP 204) — text archived at `superseded-comments/comment-77728_2026-10-01_blocked-items.txt` |
| 77791 | Today's result | **Rewritten in place** as the single complete comment |

Everything load-bearing from the deleted two was folded into 77791 before they were removed: the
manual-return create/credit checks, the automated-tests criterion (a code-review matter), the
Cancel Return finding, the two API-only paths, and the answer to my own sv10408-vs-sv10406 branch
question. The two deleted comments reported against a build that no longer exists and listed
blockers that are now all cleared, so nothing in them was still true and uncaptured.

**A fourth exhibit was built so that every picture in the single comment comes from the CURRENT
build** — the 1 Oct exhibits showed `v26.39.2-998e506`. `ev/04-quarter-unit-and-the-whole-unit-control.png`
re-captures the 1.25 case and a whole-unit control on `v26.40.3-e9ae339`.

### Gate on the consolidated post

| Check | Result |
|---|---|
| Build marker re-read at post time | `v26.40.3-e9ae339`, sha256 `3d6dedfab1ad6c40…` — identical |
| Ticket state | TESTING QA, priority Medium, unchanged |
| Bar-word scan (correction / apologies / I was wrong / needs a developer / AI terms) | **none present** |
| Mentions | none — nobody tagged, per instruction |
| Technical-details section (Rule 84) | absent, not asked for |
| ADF read-back | first text `OVERALL QA STATUS: PASSED`; **4 media nodes, all type `file`**, in the intended order, each with width **and** height; two tables (12 rows and 7 rows); `MENTIONS: none` |
| Comments remaining on the ticket | 4 total — Chris Ward, parth fadadu, Stefan Mitrovic, and **exactly one** of mine |

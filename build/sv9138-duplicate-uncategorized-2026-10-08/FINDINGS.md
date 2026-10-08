# SV-9138 — Duplicate "Uncategorized" categories — QA findings (8 Oct 2026)

**Ticket:** https://shopview.atlassian.net/browse/SV-9138 (Bug, TESTING QA, assignee Parth Fadadu, reporter Ryan Fyfe,
customer Mike Austin / Windy Hill Repair). **PR:** ShopView/shopview #3347 (base `main`, head `944b391`).
**Branch:** https://sv9138.qa.shopview.com — build `v26.40.12-944b391`, index last-modified Thu 08 Oct 2026 00:13:34 GMT,
etag `1c0aeb295e17f28400d8b4f290b742bf` (= PR head). **Production BEFORE:** app.shopview.com test org 72b2cc90,
build `v26.40.12-106a0f1`.

## Source currency (read 8 Oct 2026)
| Source | Version / state | Verdict |
|---|---|---|
| Ticket description + 1 comment (Stefan Mitrovic 77474, analysis & plan) | updated 2026-10-07 18:57 CDT | CURRENT |
| PR #3347 description, review (Dipesh), Parth's reply, QA-handoff bot | head 944b391, 2026-10-07 | CURRENT |
| Developer QA handoff / test plan | none beyond the PR "Test plan" section | — |

## What the ticket asks (reporter's words)
Expected: *"Only a single "Uncategorized" category should exist (or duplicates should not be created), and the Category
dropdown / settings list should not be cluttered with repeated entries."* Places named: **Category dropdown** and
**Settings → Category list**.

## Results — LIVE on sv9138 (screen unless stated)
| # | Check | Result |
|---|---|---|
| 1 | Settings → Categories shows ONE "Uncategorized" (Default badge, pinned top) | PASSED (49 → 50 categories only because of my ordinary test category) |
| 2 | New Inventory Part → Category dropdown shows ONE "Uncategorized" | PASSED (exhibit 02) |
| 3 | Inventory import, 9 rows: `" Uncategorized"`, `"Uncategorized "`, `"  UNCATEGORIZED  "`, `"uncategorized"`, blank, `"Uncategorized"` → all 6 land in the single Uncategorized; `"ZZAUTOTEST-9138-Cat"` + `" zzautotest-9138-cat "` → ONE new category; `" HD-Fasteners "` → existing HD-Fasteners | PASSED (exhibit 03; per-part categories read live) |
| 4 | Same spellings imported 3 times (the historical "one more copy per import") | PASSED — Uncategorized parts 8,766 → 8,772 → 8,778 → 8,784; categories stayed at 50 |
| 5 | The file really left the page with the padding intact (FormData captured in-page) | PASSED — `data/import-sent3.txt` |
| 6 | Settings → New Category with 9 spellings (incl. non-breaking-space and zero-width-space look-alikes) | PASSED — 8 blocked by "Category Name Is Already In Use." (Save greyed); zero-width one refused by the server "A category with this name already exists."; nothing created |
| 7 | Rename an ordinary category to `" Uncategorized"`, `"UNCATEGORIZED"`, `"uncategorized "`, `"Uncategorized"` | PASSED — each refused: "Cannot rename a category to the reserved name "Uncategorized"." |
| 8 | Default row cannot be opened / edited / deleted from Settings | PASSED — clicking the row opens nothing; ordinary rows open Edit Category with Delete |
| 9 | Regression: ordinary category add (201), rename (200), delete via Delete → Delete confirm (200) | PASSED |
| 10 | Public Open API `POST /api/v1/part-categories` (feature `openapi` switched ON for the branch org, full-access key created) — 5 spellings | PASSED — all 422 "Cannot create a category with the reserved name "Uncategorized"."; ordinary name 201 |

## Production BEFORE (Rule 86) — reproduced twice
Importing the same kind of file (`prod-import.csv`: leading-space, trailing-space, padded capitals, lowercase, blank)
created **3 extra categories** — `"Uncategorized "`, `"  UNCATEGORIZED  "`, `" Uncategorized"` — visible in Settings →
Categories (4 rows) and at the top of the Category dropdown (4 choices). Exhibits 01/02 left halves.
**Restored both times:** 5 inventory parts deleted (`/api/inventory/parts/delete` 201), their catalog parts
(`remove-catalogue-part` 200), the 3 copies (`/api/parts-catalogue/categories/{id}/remove` 200). Category list proven
identical to the pre-test snapshot: 15 rows, ids AND full row contents equal; Uncategorized back to 1,365 parts.

## NOT exercised — needs a decision (Rule 91: not mine to skip)
The fix's second half deals with copies that ALREADY exist (Windy Hill): leftover copies show no Default badge, cannot
be deleted from Settings but can be renamed; one deterministic default (exact name, then lowest id) used by the list,
part creation, PO add-item and receiving; and the ops cleanup command `app:remove-duplicate-uncategorized-categories`.
**None of it can be reached on sv9138:** the branch org has exactly one Uncategorized, and the fix now blocks every
product path that could make a copy (checks 3, 6, 7, 10). QA has no database or console access. Needs either the
developer to insert 2–3 copies into the sv9138 database (one exact, one padded, one with its own pricing matrix), or a
ruling that it is out of scope for QA. Asked of the QA lead.

## API-only observation (Rule 94 — NOT filed, asked)
`POST /api/parts-catalogue/categories/{default}/remove` and `POST /api/parts-catalogue/change-category` (rename the
default) both answer **200 `{"data":[]}`** but change nothing (row, name and 8,784 parts unchanged). The screen offers
neither action. Reported to the QA lead.

## Branch changes (per-ticket branch — no cleanup needed)
Org flag `openapi` added (snapshot `data/org-flags-before.json`); API key "ZZAUTOTEST SV-9138 key"; categories
`ZZAUTOTEST-9138-Cat` and `ZZAUTOTEST-9138-OpenAPI`; 27 ZZ9138 inventory parts.

## Exhibits
01 categories before/after · 02 dropdown before/after · 03 import result on QA · 04 Settings refusals on QA.

## QA lead rulings (8 Oct 2026)
- On the "duplicates customers already have" half: *"If the fix now stops you from making more then that is it."* → out of
  scope for this test; the comment says so in one line.
- On the server-only delete/rename observation: *"I still dont understand what we want to achieve here"* → dropped, not reported.
- Screen recording: **NO**. Technical details section: **NO**.

## Extra check before posting
Re-importing `SV-9138-test-import.csv` unchanged (same part numbers): 201, still 51 categories / one Uncategorized (8,784),
the 9 parts kept their categories → step 4 tells testers to use the file as it is.

## Pre-post gate (Rule 72), 8 Oct 2026 ~04:10 UTC
Build marker re-read: `v26.40.12-944b391`, last-modified 00:13:34 GMT, etag `1c0aeb29…` — unchanged; PR head still 944b391.
Ticket: TESTING QA, Parth, only comment 77474. Named data live (ZZ9138-A…I categories read live). Text scanned for AI
fingerprints: clean. No technical section. Attachments uploaded as real Jira files (61953–61957).

## Posted
Comment **78202** (2026-10-07 23:11 CDT). Read back from Jira: success panel "OVERALL QA STATUS: PASSED" first; media
in order 01, 02, 03, 04 (+ the CSV file card); table 10 rows + header. Copy: `comment-as-posted-78202.txt`.

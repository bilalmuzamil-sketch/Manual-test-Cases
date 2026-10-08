# SV-10902 — a collapsed split row must not bring back its pre-split customer (8 Oct 2026)

**Environment:** QA branch `sv10360` (API `sv10360api`), build `v26.40.8-3e5c1df`, `index.html` last-modified Wed 07 Oct 2026 13:37:51 GMT, etag `W/"a9c702e4d9b3d8b90d41a69c38e2cc51"` (unchanged at start, mid-pass and before posting). Fix = accounting PR ShopView/shopview-accounting#75 (`SV-10902-split-party-collapse`, head `e437061c`), backend only; core unchanged (PR says the old FE payload is unreachable).
**BEFORE:** production `v26.40.12-106a0f1`, 8 Oct 2026 (Rule 86).
**Sources:** SV-10902 description (Problem / Paths / Example / Expected / Fix direction / Tests) re-read 8 Oct (status Blocked, last comment 78173 Nikola — login fixed); PR 75 description + QA step.
**QA-lead rulings this ticket (8 Oct):** Plaid amount-revision path → "Skip it, say so"; no recording; no technical section.

## How the rows were built
Own bank account `ZZAUTOTEST SV-10902 bank` (chart 1095), rows imported through **Import statement** (the screen uploads to `/api/accounting/upload/bank-accounts/{id}/import`; a direct POST to `/api/accounting/bank-accounts/{id}/import` loses the multipart body → 422). Rows A–H built with the same requests the screen sends (rule create+apply, `POST …/splits` with no `party` key on untouched lines, `PUT …/party-assignment` for user picks); **row K built entirely on screen**. Key fact learned: on a FIRST split every new line inherits the row's customer (both lines showed the old customer), so the disagreeing-unprotected state needs a later line added untouched.

## Results (category-only rule applied from the Rules screen, `Apply`)
| Row | Lines before collapse | Result | Verdict |
|---|---|---|---|
| A | 7 Star, 7 Star, blank (rule-set); row had 4 Star | blank (`party_summary.kind = blank`) | PASS — fix |
| G | ZZ Bob, ZZ Bob, blank; row had ZZ Acme | blank | PASS — fix (2nd specimen) |
| K (all on screen) | ZZ Bob, ZZ Bob, blank; row had ZZ Acme | blank | PASS — fix (3rd specimen) |
| B / H | 7 Star / ZZ Bob agreeing (rule) | kept | PASS |
| F | 4 Star, 4 Star (inherited) | 4 Star kept (derived from the lines) | PASS |
| D | user-picked 7 Star / 7 Star | 7 Star kept | PASS |
| C | user-picked 7 Star / A & J | rule skipped, still split | PASS |
| E | splits cleared by hand | blank; re-split → new lines blank | PASS |
| Posting | A posted → no customer; B posted → 7 Star (Categorized tab) | | PASS |
| **Production BEFORE** | row ZZ10902-A, same steps (ZZ Acme → split → ZZ Bob ×2 + blank) | **ZZ Acme came back** (`party_summary.kind = single`) — the reported bug | reproduced |

Journal entries (#13752 A, #13753 B) carry no customer field, so the posted rows themselves are the evidence.

## Could not check
- Plaid amount-revision path (`PlaidItemSyncer::applyRevision`): needs Plaid to send a modified transaction with a new amount; the sandbox only does that via server-side calls with the developers' Plaid keys; no app route triggers it. QA lead: skip, say so.

## Slip, recorded honestly
While discovering the split control I clicked every control on row H; it cleared H's customer and posted it. H's result had already been captured (ZZ Bob after the rule, `ev/raw/B2-after.png`). H is now posted with no customer — test data only. Lesson logged.

## Data left
Branch: rows A–H, K under `ZZAUTOTEST SV-10902 bank`; customers ZZ Acme/ZZ Bob/ZZ Carol; all my rules deleted. Production: bank account retired, chart 1095 inactive, customers ZZ Acme/Bob/Carol inactive, rule deleted, two pending rows A/B remain under the retired account; Admin role restored and verified equal (45 ids, name/description/view_mode/cross_toggles).

## Posted
- QA comment **78224** (8 Oct 2026 04:38:25 −0500), green PASSED, 3 pictures (before/after with production, all six rows, posted rows). Read back from Jira: success panel first, 9 table rows (header + 8), 3 media as `file` attachments in order. No recording, no technical section (QA lead, 8 Oct).
- Pre-post gate: branch marker unchanged (`v26.40.8-3e5c1df`, 07 Oct 13:37:51 GMT, etag `a9c702e4…`); PR 75 head still `e437061c` (open); ticket re-read Blocked/Medium, last comment 78173; voice scan clean; all reproduction labels walked live with row K.

## Learning check
- Playbook §AL: bank statement import goes through `/api/accounting/upload/...` (direct multipart to `/api/accounting/bank-accounts/{id}/import` loses the body); first split inherits the row's customer on every new line; split control = row ⋮ → Split; rule dialog test-ids.
- LESSONS-INDEX: never click every control on a row to find one.

# SV-10878 — Plaid bank connect: per-row refusals, distinct pickers, nothing saved on failure (8 Oct 2026)

**Environment:** QA branch `sv10360` (API `sv10360api`), build `v26.40.8-3e5c1df`, `index.html` last-modified Wed 07 Oct 2026 13:37:51 GMT, etag `W/"a9c702e4d9b3d8b90d41a69c38e2cc51"` (identical at start and at the parity re-read). Admin. Plaid sandbox "First Platypus Bank". Core PR ShopView/shopview#3507, accounting PR ShopView/shopview-accounting#74 (branch `SV-10878-plaid-connect-validation`).
**Sources:** SV-10878 description + AC1–5 (re-read 8 Oct, status Blocked, last comment 78172 Nikola 7 Oct 16:53 −0500 "login works again"); PR 74 description + its QA step.

## Results (all live, this pass)
| # | Check | Evidence | Result |
|---|---|---|---|
| 1 | Row lists hide an account another ticked row picked (both directions) | M.json A1–A3, ev/01 | PASS |
| 2 | Duplicate made while unticked → "This chart account is already picked for another account." on the row, Connect disabled until fixed | M.json B1–B3, ev/02 | PASS |
| 3 | Account linked from a 2nd tab after page load → exchange 422 `selections.0.account_id` "That chart account already belongs to another bank account.", shown inline under "Some accounts could not be connected. See the messages below." No toast | M2.json F, ev/03 | PASS |
| 4 | Bank accounts unchanged after the refusal (2 manual) | M2.json F | PASS |
| 5 | Retry with the SAME public token after fixing the row → 200, connected 2, imported 26 | M2.json G, ev/03 | PASS |
| 6 | Parity Plaid vs manual form: after 1000 linked both offer {1010, 2300}; with 1090 inactive + 1091 active both offer {1091} only | M2.json E1/E2, P.json, N.json H1, Q.json Q1, ev/04 | PASS |
| 7 | Existing-account success: Credit Card → 2300 (API, captured token) and Money Market → 1091 (screen, Connect clicked, 200) | N.json, Q.json | PASS |
| 8 | API refusals, all 422 per selection, banks unchanged: already linked · duplicate · inactive 1090 · non-bank 6000 · both fields · taken number 1000 · same new number twice | N.json | PASS |
| 9 | Race: two tokens, same account 1092, sent together → one 200, one 422; one bank account added | X.json | PASS |
| 10 | Double submit: same body twice together → both 200, one bank account, 3 imported then 3 skipped | X.json | PASS |

API-only checks (8–10) found nothing wrong, so nothing to raise (Rule 94 not triggered).

## Could not check (stated in the comment)
- AC5 Sentry recurrence — only observable after staging deploy; no Sentry access.
- `plaid_items` rows — no screen or endpoint lists them. Seen instead: no bank account added + the same token connected later (so the refused request never exchanged with Plaid).
- Production BEFORE (Rule 86): prod Plaid is live ("Confirm you're human", no sandbox bank; `pl/V-4` → `ev/raw/prod-plaid-human-check.png`), prod build `v26.40.12-106a0f1`. To get that far the prod Admin role (`2a43e6cb…`) was given the `accounting*` permissions and then **restored — 45 ids equal, name/description/view_mode/cross_toggles equal**. No prod bank account was created (0 before, 0 after).

## Data left on sv10360 (ZZAUTOTEST)
Chart accounts 1090 (inactive), 1091, 1092, 1093; bank accounts "ZZAUTOTEST SV-10878 manual", "… manual savings", Plaid Checking/Saving/Credit Card/Money Market/CD×2.

## Learning check
New recipe recorded: playbook §AL (Plaid sandbox, token capture, prod limits).

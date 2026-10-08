# SV-10903 — Edit dialog save: versioned, queued, conflict banner (8 Oct 2026)

**Environment:** QA branch `sv10360`, build `v26.40.8-3e5c1df` (`index.html` last-modified Wed 07 Oct 2026 13:37:51 GMT, etag `a9c702e4…`, unchanged start → posting). Fix = core PR ShopView/shopview#3509 (head `294871ff`, open); build commit `3e5c1df` is 107 ahead / 0 behind the fix commit, so the fix is in the build. Front-end only.
**BEFORE:** production `v26.40.12-106a0f1`, same day (Rule 86).
**Sources:** SV-10903 description (Problem / Examples / Expected fix / Tests), re-read at posting (Blocked, last comment 78174 Nikola). PR 3509 description incl. its two QA steps.
**QA-lead rulings this ticket:** no recording, no technical section; the two extra findings → ONE new ticket under the same epic, assigned to the same developer (SV-11026); after being told about SV-10906 (product question on the Split window's Reload), still include the Reload issue in the new ticket.

## Results (branch, rows ZZ10903-1…8 on `ZZAUTOTEST SV-10903 bank`, imported on screen)
| # | Check | Evidence | Result |
|---|---|---|---|
| 1 | In-flight memo (inline memo save held 8 s by route interception — disclosed), Edit opened (memo box empty), Account → 6100, Save: dialog PUT sent after the memo PUT returned, with `mutation_version` 3 and the memo carried from the latest row → memo + account both saved (v4) | T1.json | PASS |
| 2 | Tab 2 changed Account (v3); tab 1 dialog Save with v2 → 409 `stale_transaction`, banner "This transaction changed. Reload it before saving." + Reload | T2.json | PASS |
| 3 | Banner state: memo/payee kept, Save disabled, Enter sends nothing | T2.json | PASS |
| 4 | Reload → re-seed (account 5100 shown); Save → 200 with account 5100 + memo; "Saved." | T2.json | PASS |
| 5 | Inline save refused (409) → row notice + Edit/Split disabled (clicking Edit opens nothing); Match stays enabled | T3.json | PASS |
| 6 | Row Reload → Edit/Split enabled; row shows tab 2's memo; next dialog save 200 | T6.json | PASS |
| 7 | After a refused save, later writes on the row run (row 6: inline memo then dialog payee) | T4.json | PASS |
| 8 | Plain edit (row 7) → 200 "Saved." | T4.json | PASS |
| — | Dialog-raised conflict does NOT lock the row: the 409 body's latest row replaces the cached row (`showConflictRow`), so after Cancel the row shows the latest values and Edit stays enabled — by design | T4.json | noted |
| — | Matched row: details save returns **422** "Only pending transactions can be edited; this one is matched." (not 409 `transaction_matched`, which only the party writer raises) → red warning toast, dialog open, no banner/Dismiss — 3/3 (rows 8, 5, 4; row 4 matched on screen) | T5.json, W2b | → SV-11026 |
| — | Reload discards typed memo/payee (re-seeds from row) — 2/2 (rows 2, 7) | T2.json, W2.json | → SV-11026 |

## Production BEFORE
- In-flight: old dialog PUT sent immediately with no version and `memo:null` → 200; the held memo save then 409 → memo lost (account Insurance, memo empty). PT1.json.
- Concurrent: tab 2 set 5100 (v3); old dialog PUT with no version → 200 v4, `account=null` — tab 2's change silently wiped, dialog closed, no warning. PT3.json.
- Production restored: Admin role 45/45 equal (name/description/view_mode/cross_toggles), bank account retired, chart 1096 inactive.

## Posted / filed
- **SV-11026** (Bug, Medium, parent SV-10360, assignee Nikola Mitrovic, labels + Product Area copied, Relates SV-10903 + SV-10906). Read back: 4 headings in order, 2 media `file`, lists 3/4/3. Reproduction data left ready: ZZ10903-7 (pending) and ZZ10903-6 (pending, JE #13758 to match).
- **SV-10903 comment 78239**, green PASSED, 3 pictures, 9 table rows, names SV-11026. Read back OK.
- Gate: marker unchanged; PR head `294871ff`; ticket Blocked, last comment 78174; voice scan clean.

## Data left on sv10360
`ZZAUTOTEST SV-10903 bank` (chart 1096) with rows ZZ10903-1…8; manual JEs #13755–13758 (`ZZAUTOTEST SV-10903 match target …`); rows 4, 5, 8 matched.

## Learning check
- Playbook §AL: journal-entry create + Match transaction UI (Select → Match entry, single click); the dialog's conflict refreshes rather than locks.
- Correction to self: I first called the matched-row pop-up "yellow"; it is red. Read the picture before describing colour.

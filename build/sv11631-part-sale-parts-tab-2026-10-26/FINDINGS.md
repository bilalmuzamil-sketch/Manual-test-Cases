# SV-11631 — Part Sale Parts tab: cut-off part details and table papercuts (26 Oct 2026)

Mode: **API** (QA lead chose "API (faster)"). No recording, no technical section.
Branch `sv11631` build **v26.43.1-a53a4ac** (index.html last-modified Fri 23 Oct 2026 18:43:07 GMT, etag
`cb8455abbd7420ff760df4ddd38a0d47`), read at start, during captures and again just before posting: unchanged.
Production before: `app.shopview.com` build v26.43.0-ffea43c, part sale P2-85 (production has no P2-162).
Sources: ticket description R1–R17 + N1–N2, comments 79285/79311 (Chris) and 79507 (Milomir, QA link); the design artifact
linked in the ticket (decision list incl. "Requested At column removed … (tap on touch). Approved.").

## Verdict: FAILED (4 of 19)
| # | Result | Evidence |
|---|---|---|
| R1 | PASS | fields 32px, rows 41px, no labels |
| R2 | **FAIL** | WK4707Q-23KW (106px) in a 98px box → "WK4707Q-23…", no tooltip; ZZ12CHARPN01 → "ZZ12CHARPN…". Branch inventory: 5 of 587 twelve-character part numbers, 7 of 5,931 up to 12 chars, would be cut |
| R3 | **FAIL** | desktop hover shows full name; 390 touch tap on read-only "Engine Oil Filter, Kubota V24…" (P2-162) shows nothing |
| R4 | PASS | 7,123.46 at rest, 7,123.45670 while editing, no write on blur, stored 7123.4567 |
| R5 | PASS | "28.77%" |
| R6 | PASS | hover shows full value; Category "HD-Fil…" cut where design shows "HD-Filters" → extra point (comment 2) |
| R7, R8 | PASS | order unchanged, "Qty" |
| R9 | **FAIL** | column removed, desktop hover "Requested by Admin ShopView on Oct 26, 2026"; touch tap on avatar shows nothing (design: "tap on touch") |
| R10 | hidden half PASS; shown half not run | adding a fee/discount refused (no QuickBooks item mapped for fees, `feeItemMapped:false`; 0 of 318 parts have one) → asked Milomir (QA lead: "Yes, ask Milomir") |
| R11 | PASS | pinned, fits buttons, left edge; heading text 4px left of centre → extra point |
| R12 | **FAIL** | P2-162 1130/1130 fits; P2-109 with a "Requested" part 1146/1130, badge 13.6px under Actions |
| R13 | PASS | Description 108px at 1024/768; P2-109 Sell Price box ~7px under Actions at 1024 (value readable) → extra point |
| R14 | PASS | 10px scrollbar + edge shadow at 1024/768, inset right-edge shadow at 390 (captured with `scrollbars:true`) |
| R15 | PASS | nothing sticky at 390 |
| R16 | PASS | tooltip on avatar only; hides on pointer leave, 18px vertical scroll and sideways scroll |
| R17 | PASS | 30 options, 0 overlaps; description tooltip stays over the open dropdown → extra point (no requirement) |
| N1 | PASS | work order Parts tab headers/widths/labels same as production |
| N2 | PASS | Pick (in_stock→received, 201), Return (make-return-request 200), delete, row menu ("Add Part Fee / Discount"); totals: P2-162 8 parts sum $817.30 = Financial Info Parts $817.30 |

Side observation (bucket c, outside the ticket): on P2-109 Financial Info Parts $21,498.07 vs sum of rows $41,498.05; the
difference is exactly the quoted core-charge row (2 × $9,999.99, `is_core_charge:true`). The figure is the server's own
`total_parts_sell_price` from `/api/work-orders/lines/{id}`, shown unchanged, so this front-end ticket does not affect it.
Not reported.

## Posted
- Comment **79529**: red "OVERALL QA STATUS: FAILED"; WHAT FAILED (4 items, pictures F1–F4 + steps + current/expected
  quoted); line; WHAT PASSED (before/after picture BA + 19-row table). Read back: panel FAILED, 5 media as attachments in
  order, list lengths 3/3/3/2, 20 table rows.
- Comment **79530**: @Milomir — 4 extra points (E1 category vs design, E2 Actions heading, E3 Sell Price edge at 1024,
  E4 tooltip over dropdown), each with picture + steps, plus the R10 ask. Read back: mention first, 4 media in order.
- Pre-post gate: branch marker unchanged; ticket TESTING QA, 3 comments, none new; wording scan clean (removed a tool name
  from the text and the E1 picture label); no technical section; no recording. Ticket not transitioned (no instruction).

## Test data left on the branch (no clean-up per standing ruling)
P2-109: ZZ12CHARPN01 (cost 7123.4567, sell 9,999.99, core 9,999.99) and WK4707Q-23KW (Requested); one Washer deleted.
P2-162: Engine Oil Filter picked; Ignition Switch return requested. Production P2-85: 5 ZZAUTOTEST parts.

## Learning check
- `qa-session.mjs` gained `scrollbars:true` (Playwright headless hides scrollbars by default with `--hide-scrollbars`;
  a scrollbar requirement cannot be checked without it) and `touch:true` (hasTouch + isMobile for tap checks; use a fresh
  page per tap so taps don't interfere). Recorded in the playbook and lessons index.
- `jira_post_qa.py` reads the STAGING marker; on a per-ticket branch re-read the branch's own index.html separately.

## Retest — 28 Oct 2026, build v26.43.2-3ed5bdc (index last-modified Wed 28 Oct 2026 01:41:44 GMT, etag b042466f…)
Same mode as before (API, no recording, no technical section). Ticket re-read: TESTING QA, no comments after 79530.
Method: re-ran the saved scripts (`meas`, `tap2`, `hov`, `menu`, `cap`, `scr2`, `edit`, `tot`, `act`, `ret`, `feescan`) and
diffed against `data/*.json` with the new `scripts/diff_meas.py` (rows matched by part number — row order changed).
New scripts: `tapcheck.mjs` (two tap methods + mouse control), `wopick.mjs`/`wocat.mjs`/`prodcat.mjs` (N1), `ret2.mjs` +
`bundle.mjs` (Return wiring), `qbflag.mjs`/`qbmap.mjs` (R10 unblock attempts), `bottom.mjs`, `ex28.py`, `ex28q.py`.

| # | 26 Oct | 28 Oct | Evidence |
|---|---|---|---|
| R2 | FAIL | **PASS** | Part Number column 114→124 px (box 98→108); WK4707Q-23KW + ZZ12CHARPN01 not cut at 1440/1024/768/390 |
| R3 | FAIL | **FAIL** | 390 touch: tap on "Engine Oil Filter, Kubota V24…" (P2-162) and on P2-109 rows shows nothing, both tap methods; mouse hover shows full text |
| R9 | FAIL | **FAIL** | 390 touch: tap on avatar shows nothing (both methods, both sales); mouse hover "Requested by Jeffrey Jordan on Jul 24, 2026" |
| R12 | FAIL | **PASS** | P2-109 at 1440: 1130/1130, scrollbar 0; Requested badge right edge 1292 < Actions 1294 |
| R10 | hidden half | hidden half | shown half still blocked: QB not configured (products-and-services 400 "Bookkeeping is not configured", integration offers Intuit authUrl), feature-flag POST 403 "Access denied." (needs admin-portal token, §AC.14), 0 of 317 parts on 93 sales have an adjustment. QA lead said "Try mapping myself" — tried, external dependency; asked Milomir in 79620 |
| R13 | PASS | PASS + extra point | Description 108→88 px at 1024/768; Description–Sell Price still visible; "Bolt, M20", "Cotter Pin", "Nut, M20" now cut. QA lead: "Add as extra point" → 79621 |
| E1–E4 | open | **fixed** | HD-Filters fits; Actions text centre 1359.57 vs column 1359.58; Sell Price ends 867 < Actions 878 at 1024; no tooltip over open dropdown |
| R1,R4–R8,R11,R14–R17 | PASS | PASS | fields 32 / rows 41 / no labels; cost 7,123.46 → 7,123.45670 editing, no write, stored 7123.4567; 28.77%; order + Qty; scrollbars/shadows; nothing sticky at 390; tooltip hides on 18px + sideways scroll; 30 options 0 overlaps |
| N1 | PASS | PASS | WO Parts tab same headers/labels/cell types; long category → 58 px box on BOTH (production S2-889 set to "ZZAUTOTEST NoMarkup" → 58 px) |
| N2 | PASS | PASS | Pick 201, delete 200, row menu, totals $817.30; Return: stock part → removePart immediately, ordered part → return form (make-return-request 200). Production bundle has the identical split (`part_source_type==="inventory"?remove:dialog`) |

Posted: **79620** (FAILED; R3/R9 with picture + steps; before/after picture; 20-row table; R10 ask to Milomir) and
**79621** (@Milomir, Description 88 vs 108 px extra point). Gate: build re-read v26.43.2-3ed5bdc, ticket TESTING QA with no
new comments, wording scan clean; read back 79620 panel FAILED, 2 media in order, 20 table rows; 79621 mention first, 1 media.
Test data changed on the branch: Freight returned to stock, Fuel Filter return requested, Primary Engine Air Filter picked,
Washer M20 deleted (P2-109). Production: S2-889 part 1 category set to "ZZAUTOTEST NoMarkup".

### Learning check (retest speed)
- Running several saved scripts at once made each start its own bridge (all used `/tmp/qa21`) and two crashed. Start the
  bridge once, then run scripts one after another (or give each its own dir).
- Wait on process exit, never on expected output text — a wait keyed to output that never comes cost ~10 minutes.
- Saved scripts that find a row by text must skip a missing row (test data moves between passes).
- A retest is: re-read ticket + marker → re-run saved scripts → diff against saved data → only new scripts for what changed.

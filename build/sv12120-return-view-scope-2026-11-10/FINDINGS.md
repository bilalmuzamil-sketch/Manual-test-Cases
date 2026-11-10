# SV-12120 — Return view limited to the user's own shop (tested 10 Nov 2026, ~12:40–13:05 UTC)
Branch https://sv12120.qa.shopview.com build `v26.45.3-8f11821` (last-modified Tue 10 Nov 11:23:48 GMT). PR #4273 head `2de4c74a1d`
(only `ViewQueryHandler.php` + tests changed). Production `v26.45.3-fc08f23`. Picked up from the 12:31 UTC 3-hourly Board 2 check
(QA assignee empty, no Powertools plan, handoff = Parth 80645 / 80641). Mode: API mode, no recording, no technical section.

## Set-up
- Org A = Staging Foothills Group Inc (admin quick-login). Return A = 343cd292-… (X101366385:01, Willoughby Mechanical Services,
  Heavy Duty, WO S2-17521, $196.61). Return L = 2dba7fe7-… (12313551, Meadowbrook Truck & Trailer Repair, Lethbridge).
- Org B = **ZZAUTOTEST SV12120 Org B** registered on the branch (playbook §AC.14): admin bilal.muzamil+sv12120b@shopview.com
  (password in /tmp only), location **ZZAUTOTEST OrgB Shop** created by API, signed in through the normal login form.
- Made-up id: 3f6c2b1e-9d4a-4c8e-b7a1-5e2d9c0f1a77.

## Results (every row observed; ev/matrix.json, uiloc.json, orgbui.json, brshot.json, prod.json)
| # | Check (handoff 80645) | Result |
|---|---|---|
| 1 | Org B admin opens Org A's return address | request 404 `'Vendor Return' was not found.`; page shows empty Return Details, no vendor/credit memo/items of Org A — PASS |
| 2 | Org A admin opens a made-up return id | 404 (same body as row 1), no error toast — PASS (production: 500 + two red "Ooooops! An error occurred" toasts) |
| 3 | Org A opens its own return | 200, vendor/credit memo/items/totals/WO link shown — PASS |
| 4 | Org A's return from Lethbridge while Heavy Duty selected (UI location switcher) | 404; switch to Lethbridge → loads; back to Heavy Duty → own return loads — PASS |
| 5 | Org B opens Lethbridge return / made-up id | 404 both — PASS |
| 6 | Malformed id `not-a-uuid` | 404 `'resource' was not found.` (route rule from SV-12107) — PASS |
| 7 | Bodies for unknown / other org / other location | byte-identical `{"errors":[{"error":"'Vendor Return' was not found."}]}` — cannot be used to probe |
Note: an API-only `change-location` does not move the SPA (it re-pins its stored location on reload) — row 4 was redone with the
on-screen switcher (playbook line ~1428).

## Not covered by the PR (description's third "Expected")
"Invoice view scoping is decided explicitly (organization vs. workplace) and documented." PR #4273 does not touch invoices. Live today:
`/api/invoices/{id}/view` — other organization → 400 "The invoice doesn't exist" (isolated); another LOCATION in the same org → 200
(ev/inv-view.json). Asked the QA lead whether to pass without it.

## Side observation (asked, not filed)
When a return is not found (any of rows 1, 2, 4) the page shows an empty "Return Details" shell (Credit memo number: N/A, $0.00
totals, "Empty bays, endless possibilities. Get Going!") with no "not found" message. Same shell on production (behind the error
toasts) — not new. Asked the QA lead whether it should be raised.

## Production (Rule 126)
Made-up id → 500 + two error toasts (ev/prod-01-unknown-id.png). Cross-organization "before" not captured on production (only one
production organization is held; registering a new production organization was not done).
Rule 121: read-only view, no money or accounting data written — no AccountingHub/QuickBooks effect.
Exhibits: ev/exhibits/01-before-after-unknown-return.png, 02-own-return-vs-other-organization.png.

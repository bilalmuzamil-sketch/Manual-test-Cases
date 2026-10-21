# SV-9016 — Per-company IBS service charge rate (QA, 21 Oct 2026)

**Verdict: PASSED** — Jira comment 79177 (3 attachments, read back: 3 images, 17 table rows, 6 steps).
Branch `sv9016` build `v26.40.19-362cbdf` (index.html last-modified Tue 20 Oct 2026 05:25:32 GMT,
etag `7fefe740e1d3069d7a4f9c4a25489f3e`), read at start and again immediately before posting.

## Checks (handoff A–G)
- A/B/C: section placement + text + 1.90% default + no-credentials state; edit/cancel/save/reload; saving disables controls;
  validation messages (empty, -1, 100.01, 101, 1.999, 1e1, each after Tab); accepted 0/100/.5/0.29 → 0.00/100.00/0.50/0.29%.
  POST body `{"serviceChargeRate":N}` to `/api/ibs/settings/service-charge-rate`.
- D (batch_export.csv; Location ID QAIBS01 mapped for Staging Heavy Duty - 9919):
  | Case | Rate | Items | S/C | Net |
  |---|---|---|---|---|
  | D1 | 1.90% | S2-16913 $1,211.85 | $23.03 | $1,188.82 |
  | D2 | 3.50% | S2-17292 $3,205.72 | $112.20 | $3,093.52 |
  | D3 | 3.50% | S2-17322 $5,047.60 + credit CM9016-552 −$1,880.00 | $110.87 | $3,056.73 |
  | E | 0.40% | S2-15996 $2,188.75 (S/C exactly 8.755) | $8.76 | $2,180.00 (sum +1¢, existing rule) |
  All matched the computed values. Invoice rows match the production format. CSVs in `ev/`.
- F: location switch through the UI (avatar → Change Location → Staging Lethbridge - 4310) shows the same rate.
  Second-company half: **not applicable** — the account has one company (no company switcher; "ShopHub" menu is a module switcher).
- G: Technician role reset to template first (Rule 105: already at template, Save stayed disabled; 6 perms, no integrations).
  Tech: no Settings in the avatar menu; `/administration/ibs` redirects to `/workorders`; the API returns 403 "Access denied." (informational).

## Production before
- `app.shopview.com` Settings → IBS: Credentials, Location ID Mappings, IBS Remit To Address — no Service Charge section.
- Seeded for IBS customer **Ahsan** (IBS# 655676), Trucks Hill 2: work order **S-988** invoiced $299.90, batch created →
  cover sheet S/C **$5.70** (1.90%), Net $294.20, Dealer# blank. Left in place (no-cleanup ruling).
  Also left: **S-985** (In Progress, canned line with unpicked parts) and two/three scratch work orders from the
  parts-free canned-line search (lines deleted). No production settings were changed.

## Other observations
- Another tester (Mudassir Qamar) tested the same branch concurrently (comment 79174, PASS) and set the rate back to 1.90%.
- His question: re-downloading an existing batch uses the current rate. On the screen, the Sent tab ⋮ menu offers only
  **Make Payment** and each batch row only expand / remove-from-batch — I found no way to re-download a cover sheet from the
  screen. Raised to the QA lead (not added to the comment).

## Gate
Build marker re-read before posting (unchanged); ticket re-read (TESTING QA, newest comment Mudassir 79174);
images uploaded as attachments and read back; voice scan by tool; no technical section; no recording (batch instruction).
Learning check: nothing new beyond the playbook (the IBS batch export needs a Location ID mapping for Dealer#; production
canned lines in Trucks Hill 2 mostly carry parts — use one with an empty part_requests list).

# SV-10628 — Unable to edit Sell Price on a completed Part Sale — QA findings (13 Oct 2026)

**Ticket:** [SV-10628](https://shopview.atlassian.net/browse/SV-10628) · Bug · Medium · TESTING QA · assignee parth fadadu · reporter Ryan Fyfe (PowerTools, Mike Freeman) · customer Brad Trublood / Advanced Diesel (18 users), Intercom 215476152573426 · no parent, no links. 1 comment (77651, assignment only). No developer QA handoff on the ticket; the PR's test plan was used as the checklist alongside the description.
**Reporter's flow:** open part sale P-21059 (Complete) → open a part → change Sell Price → *"Cannot change part on completed work order."* Customer's screenshot: Parts grid, Received vendor part, inline Sell Price.
**PR:** ShopView/shopview #3486 (open, hotfix → main), head `ec15c08`. Removes the Admin/Foreman role-NAME guard in `ChangePartDto`; the route gate (`ROLE_PART::CREATE_AND_EDIT` or `ROLE_WORK_ORDER::CREATE_AND_EDIT`) decides. Broadening to completed service work orders is intended. PR QA step: *"as a Parts Manager, open a Complete Part Sale → open a part → change Sell Price → save succeeds with no error"*.
**QA lead's answers:** recording **Yes** · technical section **No** · test service work orders too **Yes**. Mid-run: *"Continue unattended … all the authority to CRUD the QA branch"* and *"production branch too"*; production Technician login supplied; new **Standing Rule 105** (reset a role to template before assigning it).

## Environments
- **AFTER:** `sv10628.qa.shopview.com`, build **v26.40.17-ec15c08** (= PR head), last-modified Tue 13 Oct 2026 09:50:38 GMT, etag `a2504bd3…`. Read at start and at the pre-post gate: unchanged.
- **BEFORE (Rule 86):** production `app.shopview.com`, build **v26.40.17-f5bf8f4** (last-modified 13 Oct 08:42:45 GMT), org 72b2cc90…, location Trucks Hill 2.

## Production BEFORE — reproduced
- Parts Manager role (prod `48c378ce…`) **reset to template first — it had drifted: `woMoveLabor` added; reset removed it (32 → 31)**. Assigned to **bilal.muzamil+tech@shopview.com**, logged in as that user (real login, not impersonation).
- **P2-70** (Complete, ZZAUTOTEST Bridgeport Hauling, Received vendor part ZZ9565-P1): Sell Price 25.00 → typed 26.00 + Enter → `POST /api/work-orders/parts/change` **400 "Cannot change part on completed work order."**; toast shown; after reload **25.00**, status Complete.
- **S2-810** (Complete service work order), Parts tab: 90.00 → 91.00 → same 400 + toast; after reload **90.00**.
- **Restore:** Technician role reset to template (already at template, Save disabled) and re-assigned; staff record compared field by field to the pre-change snapshot → **no differences**. No prices changed. Parts Manager left at template (Rule 26/105).

## Branch matrix — every cell observed live (Rule 96)
Each role: reset to template (UI two-confirm flow) → assigned to `tech@shopview.com` → logged in as Tech → completed part sale **P2-243** (vendor part FF5324 + inventory part FS19593, Heavy Duty) and completed service work order **S3-15003** (vendor 68399093AB + inventory SH550057739, Lethbridge) → Sell Price +1.00 in the Parts grid, Enter, reload.

| Role | Reset (before→after) | Part sale P2-243 | Service WO S3-15003 |
|---|---|---|---|
| Admin | 57→57 | both 201, kept, Complete | both 201, kept, Complete |
| Parts Manager | 31→31 | both 201, kept | both 201, kept |
| Service Manager | 36→36 | both 201, kept | both 201, kept |
| Senior Service Advisor | 31→31 | both 201, kept | both 201, kept |
| Service Advisor | 25→25 | both 201, kept | both 201, kept |
| Parts Technician | **28→19 (had drifted: +10 incl. work-order edit, −timesheetsView)** | both 201, kept | greyed out (no WO edit perm) |
| Foreman | 23→23 | greyed out (no partSalesCreateAndEdit) | both 201, kept |
| Sales Representative | 8→8 | greyed out | no Sell Price column |
| Office User | locked role (padlock), 25 | greyed out (no partSalesCreateAndEdit) | no Sell Price column |
| Technician | 6→6 | no access (no partSalesView) | no Sell Price (no seeFinancialData) |
| Time Clock User | locked role, 3 | no access | no Sell Price |

Greyed-out cells match each role's permissions exactly (`data/*.json` → `perms`). Status stayed **Complete** on every reload.

## Extra checks
- **Totals (P2-209, vendor-only, Received part 95749, qty 4):** 26.44 → 35.00, no toast, kept after reload; Financial Info Parts **$153.17 → $187.41** (+4 × 8.56), GST $7.67 → $9.38, Total **$160.84 → $196.79**; still Complete.
- **Edit Part dialog** (S3-15003 → Lines → click part 68399093AB): `input_workorder_part_sell_price` 53.05 → 58.05, Save & Close → 201, kept, Complete.
- **Technician** in the same dialog: only Part Number / Description / Quantity shown; description + " ZZ10628" → 201, kept, Complete; Sell Price unchanged (read $58.05 afterwards).
- **Part sale ⋮ menu:** only "Add Part Fee / Discount" — no edit dialog on part sales; the grid is the only path (the customer's).
- **Paid part sale P3-239:** Sell Price input disabled.
- **View-only custom role** `ZZAUTOTEST SV-10628 View part sales only` (`5b1daf45…`: partSalesView, customersView, catalogInventoryView, seeFinancialData, woFullViewMode): on P2-243 all 5 Sell Prices greyed out, no Add Part. **API observation (Rule 94 — not filed, asked):** the same user sending `parts/change` directly got **201** and FF5324 became **$99.00**. Explained by the mapping: `seeFinancialData` carries `ROLE_PART_CREATE_AND_EDIT` and every view mode carries `ROLE_WORK_ORDER_CREATE_AND_EDIT` (`FEPermissionMappings.php` @ ec15c08), so this role is not a "neither atom" role; FE blocks, BE allows = PASS (Rule 24). A role able to view a part sale cannot be built without one of the atoms.

## Recording
`ev/sv10628-recording.mp4` — 2:00, 1280×800 H.264, decodes clean, frame grid reviewed. P2-209 CUK 26 009 $42.31 → $47.31 (Parts $207.41 → $212.41), S3-15003 Edit Part $58.05 → $63.05; every caption value read off the screen (`data/rec-log.json`).

## How-to-see-it walk (Rule 101) — walked live as the Tech user
Tech button → top search "209" → **Part sales** tab → Una Truck Center (Complete) → P2-209 → Parts (3) → Sell Price on 95749: 35.00 → 35.50, no error, kept, Complete. Alternative walked too: Parts → Part Sales (left menu) → Status chip → Clear selection → Completed → Search "Una Truck" → P2-209.
**Branch quirk found:** global search shows newer part sales with the branch prefix ("P10628- 209"), so "P2-209" finds nothing; "209" works; older P2-206 keeps its number. Branch indexing, not this ticket — bucket (c)/(d), recorded in playbook §AM.

## Posted
Comment **78577** (13 Oct 07:54:47 −0500), verdict **PASSED**, no technical section. Pre-post gate: marker unchanged `v26.40.17-ec15c08`; ticket TESTING QA, last comment 77651; Tech user = Parts Manager and P2-209 present (C 30 005 25.10 / 95749 35.50 / CUK 26 009 47.31); text scan clean. Read back: first line verdict panel, 5 media `type:file` in order (900×1288, 900×1083, 900×521, 900×661, video), 24 table rows (12 + 12).

## Branch state left (per-ticket branch, no clean-up)
Tech user = **Parts Manager** (so the steps work). Custom role `ZZAUTOTEST SV-10628 View part sales only` kept. Prices changed on P2-243, P2-209, S3-15003 (FF5324 = $99.00 from the API check). Part description 68399093AB = "Inner Tie Rod Boot ZZ10628".

## Learning check
Playbook **§AM** (part sales navigation, branch search prefix, per-role edits, Edit Part click offset, locked roles, permission atoms, bridge restart); LESSONS-INDEX rows 2026-10-13 ×3; Standing Rule 105.

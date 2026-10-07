# SV-10323 retest 2 — after Nemanja's fix (7 Oct 2026) — IN PROGRESS

**Trigger:** Nemanja 78059 *"Ready for retest: check 11 (rows 3–8 in 78010)"*, build **v26.40.8-129d22f** (read live: last-modified Wed 07 Oct 2026 09:46:12 GMT).
**Rows 7–8 root cause (Nemanja 78014) verified against the spec:** *Part Sales Update v1* (Confluence **v36**, 2026-10-06) S1-N5: *"See Financial Data gates the whole part sale screen, so a user without it never reaches the parts grid and never sees a core row. This project does not open part sales to those users."* → our ZZ10323 roles lacked See Financial Data; the earlier "part sale does not open" failure was our test set-up, not the build.
**Set-up:** `PUT /api/roles/{id}` (full body echoed, `crossToggles.seeFinancialData:true`) on both ZZ10323 roles → 200; diff before/after = only `seeFinancialData` added, view mode `tech` unchanged (`scripts/sfd-roles.json`).
**Spec:** Notifications Update V1 still **v28** (2026-10-06) — same as retest 1.
Run: `scripts/matrix4.sh` → TechView edit (toggle) · TechView view-only (observe) · Technician (observe) · Sales Representative (toggle) · Admin (toggle); Tech restored to Technician at the end.

## Results (all on v26.40.8-129d22f, read from every run's page meta)
| Role (Tech user) | WO note | WO line note | Customer | Asset | Part sale |
|---|---|---|---|---|---|
| ZZ10323 TechView edit (Tech View; Customers Edit, Part Sales Edit, SFD on) | no box | no box | **works** (true→false, kept after reload) | **works** | **works** (false→true, kept) |
| ZZ10323 TechView view-only (Tech View; Customers View, Part Sales View, SFD on) | no box | no box | greyed (`aria-disabled=true`), click no change; direct update 403 | greyed, 403 | greyed, 403 |
| Technician (Tech View; Customers View, no Part Sales) | no box | no box | greyed, 403 | greyed, 403 | can't open (no Part Sales) |
| Sales Representative (Full View; WO View, Customers Edit, Part Sales View) | greyed | greyed | works | works | greyed |
| Admin (Full View) | works | works | works | works | works |
Rows 1–2 re-captured targeted as Technician (`ev/raw/r4-rows12-*.png`): `note_card` found for both fixture notes, **no** `checkbox_attachment_for_customer_*` anywhere inside them.
**Part sale line note (Nemanja: "known, by design"):** the part sale **New Note** dialog has no line selector (`ev/raw/psnote.png` — content, tag groups, quick notes, reminder only), so such a note cannot be written from the screen; not tested.
**State left:** Tech back on Technician; fixture flags now WO/WOL true, customer/asset/part sale false (Admin's toggles); both ZZ10323 roles keep See Financial Data on (per-ticket branch, no clean-up).
Exhibits: `ev/01-customer-asset-before-after-hd.png`, `ev/02-part-sale-before-after-hd.png`, `ev/03-work-order-notes-technician-hd.png` (BEFORE halves = retest-1 captures on v26.40.8-cf5b7ad).

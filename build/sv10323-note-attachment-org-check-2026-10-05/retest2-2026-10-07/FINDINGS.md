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

## Pre-post gate (Rule 72) — 7 Oct ~13:08Z
Branch marker re-read over HTTP: `v26.40.8-129d22f`, last-modified Wed 07 Oct 2026 09:46:12 GMT, etag `009978c294552bb4c2a183bb447fb21f` — unchanged. Ticket re-read: TESTING QA, 14 comments, last 78059 (Nemanja), nothing new. Fingerprint scan on the comment text: 0 hits. No technical section (QA lead: *"No"*). Image embed sizes = half the 2× files (1290×2436, 1290×1244, 1280×790).

## Posted
- QA lead: *"1. No 2. Just add a New comment with the overall QA status with the screenshots."* — one new comment; 77936 and 78010 not edited.
- **78116** (2026-10-07 08:09:39 −0500): green panel *"OVERALL QA STATUS: PASSED"*, @Nemanja Djuric, S10-R5b v28 quoted, 8-row Tech View table + 2-row Full View table, 3 images (attachments 61896/61897/61898), 5 walked steps, the part-sale-line note.
- Read back via v3 ADF: first node panel `success`; media `file` ×3 in order at 1290×2436 / 1290×1244 / 1280×790; tableRow 12 = 2 headers + 10; mention resolved; 5 list items. Ticket now 15 comments.

## Learning check (Rule 95)
Nothing new. (Reminder already in playbook §U.0b, hit again: `pkill -f` on the bridge pattern killed my own shell — read the build marker over plain HTTP instead when the browser isn't needed.)

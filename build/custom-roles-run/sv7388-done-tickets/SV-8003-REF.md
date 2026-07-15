# SV-8003 — 403: Notes - Edit/Delete/Attach files - Every but Admin role (notes are not covered in the latest spec)

> REFERENCE ticket (Story Defect subtask, Done 2026-07-14). Fetched because SV-8319's
> obsolete ruling points here. **Contains Sasha's FINAL Notes model.**

- **Type:** Story Defect (subtask)
- **Status:** Done
- **Resolution:** Done
- **Created:** 2026-06-29  **Updated:** 2026-07-14T08:23
- **Link:** https://shopview.atlassian.net/browse/SV-8003

## Description (excerpt)

Initially Notes was a separate permission (no longer). Every role could see Edit/Delete/Attach
options on other people's notes and got 403s. Description's "Expected" (older, superseded by
07-08 comment below): WO View → create + view all notes, edit/delete own only; WO Delete →
view/edit/delete all notes including others'.

## Comments (13 of 13) — key rulings

### Sasha Grosman — 2026-07-01T07:35 (comment 72555)

Expected:
* Users with Work Order → View: can create notes, and edit their own notes, delete their own notes.
* Users with Work Order → Delete: can edit other people's notes, and delete other people's notes.

### Viktoria Videnovic — 2026-07-06T03:09 (comment 72811)

List of Notes surfaces: Customer > Notes tab; Asset > Notes tab; WO > Notes tab (same for
line notes); Notifications (personal); Reports > Notes page.
Endpoints: POST /api/note/delete, POST /api/note/update.

### Sasha Grosman — 2026-07-08T06:33 (comment 73028) — **FINAL NOTES MODEL (latest ruling; spec updated accordingly)**

Notes Tabs (on Work Order, Customer, Asset) all follow the same basic logic:
* The related "**View**" CRUD enables **creating notes, editing anyone's notes, deleting notes
  the user created themselves**
  * WO → View allows this for Work Orders
  * Customer → View allows this for Customer and Asset
* The related "**Delete**" CRUD enables **deleting notes other people created**
  * WO → Delete allows this for Work Orders
  * Customer → Delete allows this for Customer and Asset

Notes field on Edit Customer and Edit Asset modal follows the CRUD logic for the other fields
on those modals:
* The related "View" CRUD enables viewing the field value
* The related "Create & Edit" CRUD enables accessing the edit modal and updating the field

### Sasha Grosman — 2026-07-08T07:00 (comment 73030)

1. Notifications everyone should have. Not behind a gate.
2. Access to Reports gives you access to everything, same as spec. Includes Notes and Reminders.

### Viktoria Videnovic — 2026-07-13T13:31

Fixed for WO notes; FAILED for Customer permission (Customer View edit-others 403;
Customer Delete delete-others 403).

### Viktoria Videnovic — 2026-07-14T05:33

Verified in QA env.

## Contradiction resolution (last-update-wins)

- 07-01 ruling (View = own-only edit) is SUPERSEDED by 07-08 ruling (View = edit ANYONE's note,
  delete own; Delete = delete others').
- SV-8319 (07-14, "WO View does not allow editing notes created by others") was closed OBSOLETE
  pointing here — consistent with the 07-08 model where WO View SHOULD allow editing others'
  notes; the 07-14 QA verification says the build now implements this.

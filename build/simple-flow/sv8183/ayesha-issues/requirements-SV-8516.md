# SV-8516 — Ayesha issue ingest (Simple Flow / SV-8183)

- **Source (pointer only, do NOT fetch):** https://shopview.atlassian.net/browse/SV-8516
- **Ingested:** 2026-07-24 (REST v3, live Atlassian session)
- **Key / Type:** SV-8516 / Story Defect
- **Status:** Done
- **Priority:** Medium
- **Reporter:** Ayesha Khan
- **Assignee:** Dusan Radulovic
- **Created:** 2026-07-22 18:19 (-0500) · **Updated:** 2026-07-23 20:20 (-0500)
- **Parent:** SV-8183 — "Permission: Simple Flow — enforcement mapping to existing WO / Parts / Settings atoms"
- **Links:** (none) · **Labels:** `Staging_Verified` · **Environment field:** (empty — env stated in description/comments)

## Summary
Time Clock user can edit/cancel/return parts and change vendor (should have no access per SV-8183; Production blocks it)

## Description (verbatim, HTML stripped)
Per SV-8183 (Blocked), a **Time Clock user should have no access to part actions.** Logged in as Time Clock, the user can **edit part details, cancel a part, cancel an order, return a part, change the vendor, and make any changes to the part details.** On Production, a Time Clock user cannot do anything with part details.

**Steps to Reproduce:**
1. Log in as a Time Clock user.
2. Open a work order / part and try to edit part details, cancel the part, cancel the order, return the part, and change the vendor.

**Actual Result:** Time Clock user can do everything on the part details (edit, cancel, cancel order, return, change vendor).

**Expected Result:** Time Clock user has no access to part actions — cannot edit, cancel, return, or change vendor — matching Production. (Per SV-8183 per-role matrix: **Time Clock = no access.**)

**Impact:** A no-access role can fully edit and act on parts, bypassing the permission model.

(cc Sasha Grosman, Bilal Muzamil)

## Comments (in order)
**Sasha Grosman — 2026-07-23 09:25 (-0500):**
> Users require **WOL → Create & Edit** permission to manage anything related to part requests. Making them, editing them, canceling. Since this is not reproducible in production, we should fix this before release.

**Ayesha Khan — 2026-07-23 20:20 (-0500):**
> Tested on Staging: the Time Clock user **cannot edit part details** [now], but **can still return a part, cancel a return, and resolve cores.** This behavior is the same on Production, so I'm not filing a separate bug for it — adding here for context: [→ folded into SV-8541]

## Attachments (2) — both VIDEO, no images
- `Time Clock Permissions and Return Actions.mp4` (video/mp4, 5,716,899 bytes, id 58941) → downloaded to `/tmp/fd-tickets/SV-8516/att-58941.mp4`
- `Time Clock User Permissions for Parts and Orders.mp4` (video/mp4, 14,011,802 bytes, id 58910) → downloaded to `/tmp/fd-tickets/SV-8516/att-58910.mp4`

**NOTE:** Both attachments are screen-recording videos (no still images). `ffmpeg`/`ffprobe` are NOT available in this environment, so frames could not be extracted / visually analyzed this run. The textual description + Steps capture the repro; videos are supplementary. Flag for a run with ffmpeg (or human viewing) if frame-level UI evidence is needed.

**Status note:** ticket is **Done** + `Staging_Verified` — the edit/cancel/change-vendor part of the Time-Clock over-grant was FIXED. Ayesha's follow-up comment says the *residual* return-part / cancel-return / resolve-cores behavior persists on BOTH Staging and Production and is tracked as the clarification **SV-8541** (not a separate bug).

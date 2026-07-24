# SV-8541 — Ayesha issue ingest (Simple Flow / SV-8183)

- **Source (pointer only, do NOT fetch):** https://shopview.atlassian.net/browse/SV-8541
- **Ingested:** 2026-07-24 (REST v3, live Atlassian session)
- **Key / Type:** SV-8541 / Story Defect
- **Status:** Open
- **Priority:** Medium
- **Reporter:** Ayesha Khan
- **Assignee:** Sasha Grosman
- **Created:** 2026-07-23 21:57 (-0500) · **Updated:** 2026-07-23 22:15 (-0500)
- **Parent:** SV-8183 — "Permission: Simple Flow — enforcement mapping to existing WO / Parts / Settings atoms"
- **Links:** relates to **SV-8515** · **Labels:** (none) · **Environment field:** (empty — env stated in description body: Staging + Production)

## Summary
[Clarification] User without "Work Order Line: Create & Edit" can return a received special-order part and resolve cores (Staging + Production)

## Description (verbatim, HTML stripped)
A user who **does not have Work Order Line: Create & Edit** permission can still:
- **Return a special-order part that was already received**, and
- **Resolve cores for inventory parts and special parts.**

This occurs on **both Staging and Production.** Since the behavior matches Production, it may be **existing behavior rather than a Simple-Flow regression** — raising as a clarification to confirm the intended permission rule.

(Note: this **supersedes** the earlier "Office user can cancel/return parts in requested/quoted state" finding from **SV-8515**, which is no longer reproducible — it now behaves the same on both Staging and Production.)

**Steps to Reproduce:**
1. Log in as a user without Work Order Line: Create & Edit permission.
2. On a work order, return a special-order part that has already been received.
3. Resolve a core (OK/Not OK) for an inventory part and a special part.

**Actual Result:** The user can return the received special-order part and resolve cores, despite lacking Work Order Line: Create & Edit.

**Expected Result / Clarification Needed:** Confirm whether a user without Work Order Line: Create & Edit should be able to return a received special-order part and resolve cores. Per the permission model, these actions **appear to require that permission.** If this is intended (given Production behaves the same), please confirm; if not, it's a permission-enforcement gap.

**Impact:** If unintended, users without the required permission can return received parts and resolve cores, bypassing the permission model — affecting inventory and core-charge accuracy.

(cc Sasha Grosman, Bilal Muzamil)

## Comments
(none as of ingest)

## Attachments (1) — VIDEO, no images
- `Permissions Bug for Work Order Line Actions.mp4` (video/mp4, 23,786,964 bytes, id 58946) → downloaded to `/tmp/fd-tickets/SV-8541/att-58946.mp4`

**NOTE:** The single attachment is a screen-recording video (no still image). `ffmpeg`/`ffprobe` are NOT available in this environment, so frames could not be extracted / visually analyzed this run. The textual description + Steps capture the repro; the video is a supplementary demonstration. Flag for a run with ffmpeg (or human viewing) if frame-level UI evidence is needed.

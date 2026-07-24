# SV-8515 — Ayesha issue ingest (Simple Flow / SV-8183)

- **Source (pointer only, do NOT fetch):** https://shopview.atlassian.net/browse/SV-8515
- **Ingested:** 2026-07-24 (REST v3, live Atlassian session)
- **Key / Type:** SV-8515 / Story Defect
- **Status:** Ready to Fix
- **Priority:** Medium
- **Reporter:** Ayesha Khan
- **Assignee:** Dusan Radulovic
- **Created:** 2026-07-22 18:13 (-0500) · **Updated:** 2026-07-23 22:00 (-0500)
- **Parent:** SV-8183 — "Permission: Simple Flow — enforcement mapping to existing WO / Parts / Settings atoms"
- **Links:** relates to **SV-8541** (the cancel/return-parts half was spun out there)
- **Labels:** (none) · **Environment field:** (empty — env stated in description body)

## Summary
Office user can bulk receive POs and cancel/return parts (should be view-only per SV-8183; Production blocks these)

## Description (verbatim, HTML stripped)
Per SV-8183 (Blocked), an Office user (**Vendor & Order Mgmt: View only**) should not be able to receive or edit on the Bulk Receive page. Two issues found:

1. **Bulk receive:** Office has **no per-PO Receive button**, but can still **multi-select POs → Receive Selected → enter invoice/part numbers, change vendor, and bulk receive — same as Admin.**
2. **Cancel/return parts:** Office can cancel a part in requested/quoted state, cancel orders, and return parts. **On Production, an Office user cannot do any of this** in the requested/quoted state and cannot return parts.

**Steps to Reproduce:**
1. Log in as an Office user.
2. Parts → Purchase Orders → multi-select POs → Receive Selected → enter details / change vendor / receive.
3. Also try to cancel a requested/quoted part, cancel an order, and return a part.

**Actual Result:** Office can bulk receive (Receive Selected), make edits, and cancel/return parts.

**Expected Result:** Office (Vendor & Order View-only) can view but not receive or edit (SV-8183 AC-5), and cannot cancel/return parts — matching Production.

**Impact:** A view-only role can receive, edit, and cancel/return parts, bypassing the permission model.

(cc Sasha Grosman, Bilal Muzamil)

## Comments (in order)
**Sasha Grosman — 2026-07-23 09:22 (-0500):**
> There are 2 issues in this ticket.
> [Issue 1] refers to Office user, but the test is users with Vendor & Order Management → View Permission. Assuming that is the actual pre-requisite for the issue (please verify). We will use this ticket to fix this issue: To Bulk Receive users must have **Vendor & Order Management → Create & Edit** (fits the existing Custom Roles and Perms requirements).
> [Issue 2] Office users can cancel/return parts. A few action items:
> - Can you please clarify the steps to repro here? We cannot find how to do this from Parts tab; we think you mean to do this from WOs
> - Can you clarify the prerequisite by defining the permissions, not the roles
> - Please create this as a separate ticket

**Ayesha Khan — 2026-07-23 21:51 (-0500):**
> Confirmed — the prerequisite for Issue 1 is a user with **Vendor & Order Management → View permission** (not the Office role specifically). Any user with only View permission can still bulk receive, when they should need Vendor & Order Management → Create & Edit. Using this ticket to fix that, as you noted.
> For issue 2, I have created a separate ticket: [SV-8541]

## Attachments (2) — both VIDEO, no images
- `Fixing Bulk PO Access for users.mp4` (video/mp4, 9,521,581 bytes, id 58945) → downloaded to `/tmp/fd-tickets/SV-8515/att-58945.mp4`
- `Office User Permissions Fix Needed for Ticket 8183.mp4` (video/mp4, 12,475,359 bytes, id 58909) → downloaded to `/tmp/fd-tickets/SV-8515/att-58909.mp4`

**NOTE:** Both attachments are screen-recording videos (no still images). `ffmpeg`/`ffprobe` are NOT available in this environment, so frames could not be extracted and the video content could not be visually analyzed this run. The textual description + Steps to Reproduce above capture the repro; the videos are supplementary demonstrations. Flag for a future run with ffmpeg (or a human viewing) if frame-level UI evidence is needed.

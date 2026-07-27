# SV-8682 — Custom Roles post-release regression ingest

- **Source (pointer only, do NOT fetch):** https://shopview.atlassian.net/browse/SV-8682
- **Ingested:** 2026-07-27 (REST v3, live Atlassian session — GET /rest/api/3/myself → 200)
- **Key / Type:** SV-8682 / Bug
- **Status:** Code Review
- **Priority:** Medium
- **Reporter:** Bilal Muzamil · **Assignee:** parth fadadu
- **Created:** 2026-07-27 03:53 (-0500) · **Updated:** 2026-07-27 08:58 (-0500)
- **Parent/Epic:** (none)
- **Labels:** (none) · **Components:** (none) · **Fix Versions:** (none)
- **Environment field:** (empty — screenshot shows app.staging.shopview.com)
- **Links:** **relates to SV-8443 (Done, fixVersion v0.68)** — "New Vendor Creation Is Blocked When 'AP/AR Data' Is Disabled Despite Vendor Management Permissions Being Enabled" (the v0.68 vendor-permission fix this regression sits next to)

## Summary
Parts → Vendors Throws 403 When Vendor & Order Management View Is Enabled Unless Reports Is Also Enabled

## What broke (plain English)
A custom role that SHOULD be able to see the Vendors page (it has **Vendor & Order Management → View = ON** and **See Financial Data = ON**) gets a **403 "Access Denied"** when it opens **Parts → Vendors**. The page only opens if you ALSO turn on the unrelated **Reports** permission. So there is a wrong/undocumented dependency: Vendors access is secretly tied to the Reports permission.

- **Role/permission:** any custom role with Vendor & Order Management → View ON + See Financial Data ON + **Reports OFF**.
- **Screen/action:** Parts → Vendors page load.
- **Feature area:** Vendor & Order Management permission gating (Custom Roles & Permissions).

## Description (verbatim, HTML stripped)
A role with Vendor & Order Management → View and See Financial Data = ON receives a 403 Access Denied error when navigating to Parts → Vendors.
However, enabling Reports for the same role removes the 403 error and allows the Vendors page to open. This indicates an incorrect dependency between access to Parts → Vendors and the Reports permission.

**Permission Configuration:**
- Vendor & Order Management → View = ON
- See Financial Data = ON
- Reports = OFF

**Steps to Reproduce (STRs):**
1. Create or edit a role.
2. Enable: Vendor & Order Management → View; See Financial Data. Keep Reports disabled.
3. Assign the role to a user.
4. Log in as that user.
5. Navigate to Parts → Vendors.

**Actual Result:** The Vendors page throws a 403 Access Denied error.

**Additional Observation:** If Reports is enabled for the same role, the Vendors page opens successfully and the 403 error no longer appears.

**Expected Result:** Access to Parts → Vendors should depend on Vendor & Order Management → View and should not require the unrelated Reports permission.

**Impact:** Users with the documented Vendor view permission cannot access the Vendors page unless they are also granted unnecessary Reports access — an undocumented and over-permissive dependency.

## Comments
(none as of ingest)

## Attachments (2)
- `image-20260727-064423.png` (id 59026, image/png, 38,189 B) → `/tmp/fd-tickets/reg-att/SV-8682-image.png`. **Analyzed:** browser at `app.staging.shopview.com/access-denied` showing the ShopView **Parts** area with a full-page grey lock icon and **"Access restricted — Looks like you don't have access to this page. Reach out to your administrator to request access."** Confirms the 403 → access-denied lockout on the Vendors page.
- `screen-capture (75).webm` (id 59025, video/x-matroska, 2,566,842 B) — screen recording (not frame-extracted; ffmpeg unavailable). Textual STR above captures the repro.

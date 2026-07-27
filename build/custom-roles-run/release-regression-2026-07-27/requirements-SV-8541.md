# SV-8541 — Custom Roles post-release regression ingest (re-pulled fresh 2026-07-27)

> Same issue previously ingested for Simple Flow at
> `build/simple-flow/sv8183/ayesha-issues/requirements-SV-8541.md` (2026-07-24, held for Sasha).
> **Now grouped under Custom Roles** — Milos confirmed it is a Custom-Roles-and-Permissions
> issue, not a Simple Flow one. Re-pulled fresh 2026-07-27 to capture CURRENT status + NEW comments.

- **Source (pointer only, do NOT fetch):** https://shopview.atlassian.net/browse/SV-8541
- **Ingested:** 2026-07-27 (REST v3, live Atlassian session)
- **Key / Type:** SV-8541 / Story Defect
- **Status:** **Open** (unchanged since 2026-07-24)
- **Priority:** Medium
- **Reporter:** Ayesha Khan · **Assignee:** parth fadadu (was Sasha Grosman on 2026-07-24 — reassigned)
- **Created:** 2026-07-23 21:57 (-0500) · **Updated:** 2026-07-27 07:01 (-0500)
- **Parent:** SV-8183 — "Permission: Simple Flow — enforcement mapping to existing WO / Parts / Settings atoms"
- **Labels:** **fast-follow** (added since 2026-07-24 ingest) · **Fix Versions:** (none)
- **Links:** relates to **SV-8515 (Done)**
- **Environment:** Staging + Production (stated in body)

## What broke (plain English)
A user WITHOUT the **Work Order Line: Create & Edit** permission can still (a) **return a special-order part that was already received** and (b) **resolve cores (OK / Not OK)** for inventory and special parts. It looks like these actions should require Work Order Line: Create & Edit, but they don't. It behaves the same on Staging AND Production, so it may be existing (spec-intended) behavior rather than a Simple Flow regression — raised as a clarification for the PM.

- **Role/permission:** any role WITHOUT Work Order Line: Create & Edit (e.g. Office / Time Clock).
- **Screen/action:** WO part three-dot menu → Return a received special-order part; core resolve OK/Not OK.
- **Feature area:** Work Order Line / core-resolution permission gating (Custom Roles & Permissions).
- **Clarification per spec (see comments + screenshot):** current Confluence spec says **"Marking Cores OK/Not Ok is gated by WO→View"** and part return via the three-dot menu needs only **Work Orders → View** — so the build may actually be spec-correct; the PM must confirm.

## Description (verbatim, HTML stripped)
A user who does not have Work Order Line: Create & Edit permission can still:
- Return a special-order part that was already received, and
- Resolve cores for inventory parts and special parts.

This occurs on both Staging and Production. Since the behavior matches Production, it may be existing behavior rather than a Simple-Flow regression — raising as a clarification to confirm the intended permission rule.

(Note: this supersedes the earlier "Office user can cancel/return parts in requested/quoted state" finding from SV-8515, which is no longer reproducible — it now behaves the same on both Staging and Production.)

**Steps to Reproduce:**
1. Log in as a user without Work Order Line: Create & Edit permission.
2. On a work order, return a special-order part that has already been received.
3. Resolve a core (OK/Not OK) for an inventory part and a special part.

**Actual Result:** The user can return the received special-order part and resolve cores, despite lacking Work Order Line: Create & Edit.

**Expected Result / Clarification Needed:** Confirm whether a user without Work Order Line: Create & Edit should be able to return a received special-order part and resolve cores. Per the permission model these actions appear to require that permission. If intended (given Production behaves the same), please confirm; if not, it's a permission-enforcement gap.

**Impact:** If unintended, users without the required permission can return received parts and resolve cores, bypassing the permission model — affecting inventory and core-charge accuracy.

## Comments (2)
1. **Milos Vasic @ 2026-07-24 12:07 (-0500):** "As i can see this is already like this on production, This bug is related to the custom roles and permissions and should be fixed there if not intended to work like this. Simple flow is just using the rules already established in this case. Not a blocker for Simple flow. adding for visibility." → **This is why the issue is now grouped under Custom Roles.**
2. **parth fadadu @ 2026-07-27 06:36 (-0500):**
   - *Return a special-order part that was already received:* "For special order parts, users can return the part from the three-dot menu with only the Work Orders → View permission. This was briefly discussed in the ticket, but we still need a final decision from the Product Manager on the expected behavior."
   - *Resolve cores for inventory parts and special parts:* "This is based on CP spec and the comment on the ticket. According to Sasha's comment, 'Cores OK/Not OK' is gated by the Work Orders → View permission (SS-1)."

## Attachments (2)
- `Permissions Bug for Work Order Line Actions.mp4` (id 58946, video/mp4, 23,786,964 B) → previously downloaded `/tmp/fd-tickets/SV-8541/att-58946.mp4` (screen recording; ffmpeg unavailable → not frame-extracted).
- `Screenshot 2026-07-27 at 4.49.16 PM.png` (id 59032, image/png, 124,871 B) → `/tmp/fd-tickets/reg-att/SV-8541-screenshot.png`. **Analyzed:** the Confluence **Custom Roles and Permissions** spec (pageId 565116952), change-log Jul 7 2026 section, with the line **"Marking Cores OK/Not Ok is gated by WO→View"** highlighted in red — the spec basis parth cites for core-resolution being a Work Orders → View gate, not Work Order Line: Create & Edit.

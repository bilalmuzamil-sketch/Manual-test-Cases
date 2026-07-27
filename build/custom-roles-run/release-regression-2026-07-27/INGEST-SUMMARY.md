# Custom Roles — Post-Release Regression Ingest Summary (2026-07-27)

**Context:** QA reports Custom Roles & Permissions broke after a new feature release. Three
issue tickets were ingested from Jira (https://shopview.atlassian.net) via REST v3 on a live
Atlassian session (GET /rest/api/3/myself → 200; NO OTP re-login needed — saved session cookies
still valid). This is ingest + coverage analysis only — NO VIU, NO TestRail writes, NO authoring.

**The feature release behind the breakage:** the **v0.68 / v0.69 rollout** — specifically the
**Fees & Discounts feature-flag rollout** plus the **vendor / AP-AR permission dependency changes**.
Custom Roles is volatile and regresses when other features (Fees & Discounts, Vendor mgmt) ship.
- SV-8682 sits next to **SV-8443 (Done, v0.68)** — the vendor-permission (AP/AR-vs-Vendor) fix.
- SV-8701 is **v0.69**, triggered only when the **FeesAndDiscounts flag is ON**, same lockout class as the SV-7958 (v0.65/v0.68) Time Clock lockout family.
- SV-8541 is a WO-Line/core permission clarification now reclassified from Simple Flow to Custom Roles.

---

## Ticket 1 — SV-8682 (Bug, Code Review, Medium)
- **What broke (plain):** A custom role with **Vendor & Order Management → View + See Financial Data ON** (Reports OFF) gets a **403 "Access restricted"** on **Parts → Vendors**. The page only opens if the unrelated **Reports** permission is also turned on. Wrong/over-permissive dependency: Vendors access is secretly tied to Reports.
- **Role:** any custom role with Vendor & Order Management → View ON, See Financial Data ON, Reports OFF.
- **Permission:** Vendor & Order Management (View) — should NOT depend on Reports.
- **Screen/action:** Parts → Vendors page load.
- **Feature:** Vendor & Order Management permission gating; relates to SV-8443 (v0.68 vendor fix).
- **Status:** Code Review (fix in progress; assignee parth fadadu).

## Ticket 2 — SV-8541 (Story Defect, Open, Medium)  *(re-pulled fresh; now grouped under Custom Roles)*
- **What broke (plain):** A user WITHOUT **Work Order Line: Create & Edit** can still **return an already-received special-order part** and **resolve cores (OK/Not OK)**. Same on Staging AND Production — likely existing/spec-intended behavior, raised as a clarification.
- **Role:** any role without Work Order Line: Create & Edit (e.g. Office / Time Clock).
- **Permission:** Work Order Line: Create & Edit vs Work Orders → View. Per current Confluence spec, **"Marking Cores OK/Not Ok is gated by WO→View"** and part-return via the 3-dot menu needs only Work Orders → View — so the build may be spec-correct; PM to confirm.
- **Screen/action:** WO part 3-dot menu → return received special-order part; core resolve OK/Not OK.
- **Feature:** WO-Line / core-resolution permission gating (parent SV-8183; relates SV-8515).
- **Status:** Open, label **fast-follow**, reassigned to parth fadadu; awaiting PM decision.
- **Change since 2026-07-24 ingest:** assignee changed (Sasha → parth); `fast-follow` label added; parth added a comment citing the spec (Cores = WO→View gate) + Milos confirmed it belongs to Custom Roles.

## Ticket 3 — SV-8701 (Bug, Done, High)
- **What broke (plain):** With the **FeesAndDiscounts flag ON**, a custom-role user holding **Customers Create & Edit + See Financial Data + Manage AP/AR** (no settings/org grants) is **fully locked out of EVERY customer detail page** (full-page "Access restricted" — WO/payments/invoices tabs all unreachable). One background 403 (GET /customers/{id}/default-adjustments) triggers a global redirect to /access-denied.
- **Role:** custom role with Customers Create & Edit + See Financial Data + Manage AP/AR, no org grants.
- **Permission:** customer default-adjustments endpoint — FE rule (S13-R10: customers C&E + AP/AR + flag) vs BE gate (was ROLE_ORGANIZATION_VIEW). FE/BE mismatch = the classic FE-allows/BE-blocks lockout.
- **Screen/action:** any customer detail page while FeesAndDiscounts flag ON.
- **Feature:** Fees & Discounts customer default-adjustments; same lockout class as SV-7958 family.
- **Status:** **Done** — fixed (PR #2363; BE gate realigned to S13-R9: Customers C&E + Manage AP/AR), Staging_Verified + Prod_Verified labels present; prod deploy manual (still pending per the comment).

---

## Jira access
Working. Saved Atlassian session cookies in /tmp/fd-tickets/ still valid — `GET /rest/api/3/myself`
returned HTTP 200. **No OTP / re-login required this run.** All 3 issues + comments + 2 image
attachments fetched HTTP 200; both PNGs opened and analyzed (SV-8682 = /access-denied lock screen;
SV-8541 = Confluence spec change-log "Cores OK/Not Ok gated by WO→View"). Two .mp4/.webm videos were
NOT frame-extracted (ffmpeg unavailable) — textual repro captured instead.

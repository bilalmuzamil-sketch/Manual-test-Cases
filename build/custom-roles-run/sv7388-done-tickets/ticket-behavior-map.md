# SV-7388 DONE-tickets → behavior map (2026-07-15)

> Built live from Jira via Atlassian MCP on 2026-07-15. 203 Done/OBSOLETE child tickets
> + 2 reference tickets (SV-7993 open, SV-8003 Done) digested with FULL comments.
> **Contradiction rule (user 2026-07-15): last-update-wins** — between Sasha's own
> statements, within the spec, or between a Sasha comment and the spec, the NEWEST
> timestamp is authoritative.
>
> The map lives in four fragments (one row per ticket, 8 columns):
> - `map-fragment-1.md` — SV-7474..SV-7832 (49 rows: CRP foundation + early defects)
> - `map-fragment-2.md` — SV-7849..SV-7995 (59 rows, incl. SV-7993-REF)
> - `map-fragment-3.md` — SV-7997..SV-8107 (49 rows, incl. both REF rows)
> - `map-fragment-4.md` — SV-8110..SV-8345 (49 rows)
> Open (not-Done) tickets: `../sv7388-open-tickets-2026-07-15.md` (57 tickets).

## Authoritative rulings cheat-sheet (post last-update-wins resolution)

1. **Cores OK/Not-OK = Work Orders → View** (Sasha 7/7 changelog + Key Decisions "agreed
   with Cody"; supersedes §1b WOL C&E residue; SV-8130 verified 07-13).
2. **Story history (line) = WOL View** (≡ WO View since WOL has no independent View) —
   Sasha 07-07 (SV-7989), supersedes 7/3 "WOL C&E".
3. **Audit logs (WO-level AND line-level) = WO → Create & Edit** (SV-7989, spec §1a Edit).
   No longer tied to View History Logs.
4. **Notes model (SV-8003 Sasha 07-08, verified 07-14):** on WO/Customer/Asset Notes tabs —
   related **View** CRUD = create notes + edit ANYONE's note + delete OWN notes; related
   **Delete** CRUD = delete OTHERS' notes. WO gates WO notes; Customers gates Customer+Asset
   notes. Notes FIELD on Edit Customer/Edit Asset modal follows that modal's field CRUD
   (View to see, C&E to edit). Notifications: ungated. Reports > Notes: follows Reports.
5. **Invoice reversal gates (Sasha 07-09, SV-8237/8238; spec changelog 6/28 row retro-fixed):**
   WO invoice reversal = **WO → Delete**; part-sale invoice reversal = **Part Sales → Delete**;
   payment deletion = **Invoicing & Payments → Delete** (delete payments before reversing).
6. **Add Customer / new asset inside the New WO flow = WAD with WO C&E** (SV-8002 Sasha
   07-04/07-06; supersedes CR-BRK-025): Customers permission gates only the Customers nav;
   inline create works (403 fixed + verified SV-8147 07-13).
7. **Service Manager template + system role HAVE Work Orders → Delete** (Sasha 07-14,
   SV-8297; REVERSES SV-8093). Also SM: Customer Portal ON, Invoicing V/E (no Delete).
8. **Sales Rep final matrix (SV-8061 verified 07-14):** WO View, WOL View, Customers V+C&E,
   Part Sales View, Reports ON, SFD ON, AP/AR ON, Full View — NOT "Reports only".
9. **Office role (spec 7/14 update):** WO —, Part Sales —, Invoicing V/E/D in the matrix,
   Customers V/E/D, Catalog V, Vendor V, Timesheets V/E; hard-coded "Office cannot create
   invoices (but can make payments)" rule pending implementation — **OPEN with Sasha in
   SV-7993 comment 73184** (SV-8345 closed OBSOLETE deferring there). Office + Time Clock
   system roles are NOT editable (read-only Permission Summary).
10. **Send to Portal = Full View (view mode)**, not Customer Portal (SV-7799/7801/7979).
    **Send to Terminal = Invoicing C&E + Customer Portal ON** (SV-8087, spec 7/6).
11. **Part quantity change on a WO line = WOL Create & Edit** (Sasha 07-06, SV-8136;
    Pick/Order Parts alone insufficient — reverses earlier SV-7929 reading).
12. **AP/AR aging reports follow Reports** (all-or-nothing; SV-8177/8235 verified 07-08).
    Manage AP/AR gates Unpaid Invoices/Payments/Credits tabs (Customer + Vendor) + sensitive
    customer fields + sensitive vendor fields incl. Taxes on Vendor Overview (SV-8133).
13. **Invoicing → Delete enabling prompts to enable Manage AP/AR** (spec §1i gate 2;
    SV-8170 verified 07-13).
14. **My Timesheets visibility follows the staff "clockable" flag**, not role permissions
    (SV-8097/SV-8060). All users always clock in/out.
15. **Customer profile related tabs (WO/Part Sales) stay VISIBLE for Customers-View-only
    roles; links to the WO/PS are NOT clickable** (spec Open Q10 answer; SV-8050 Sasha 07-02).
16. **Backend enforcement is intentionally partial** (SV-7958 Sasha 07-14): FE gating is
    accepted for many read endpoints (e.g. /api/technicians stays 200 for Time Clock).
    Only View/Edit resource-level enforcement is guaranteed server-side. The 4 API leak
    cases C29457–C29460 assert a contract the PO declined to mandate → re-scope.
17. **Integrations sub-setting (`settingsIntegrations`) gates Settings → Integrations
    (QuickBooks, IBS, Open API)** — SV-8157 verified 07-13; QB relocation to Finance was
    cancelled (SV-7493 OBSOLETE). Departments live under App Settings (SV-7781).
18. **Role display names standardized:** "Time Clock User", "Parts Technician",
    "Office User" (SV-8178) — use full names in case wording.
19. **View Part History** = new label of "View History Logs"; only controls Part History
    on the inventory page; sits under the Parts group (spec 7/7 + §1h; SV-8202 open —
    legacy label may still show in build until fixed).
20. **WO Create/Edit works in Tech View too** (SV-7832) — no view-mode dependency.

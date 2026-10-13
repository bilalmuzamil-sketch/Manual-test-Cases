## PROVEN: UI-driven WO seeding for reference states (staging, 2026-07-15)
Confirmed end-to-end via boot2+Chromium bridge as Admin (create endpoints are NOT simple REST —
this is the working UI recipe):
1. **Create WO:** navigate `/workorders` → click **New** → in "New Work Order" dialog pick a Customer
   (q-select, first `.q-menu .q-item`) → pick an Asset → click **Save** → a **Confirmation** dialog
   ("customer over credit limit") appears → click **Create** (red). WO id then in URL `/workorders/<id>/lines`.
2. **Add an UNAPPROVED line + part requests:** click **New Line** → in "New Line" modal open the
   "What Are You Doing?" q-select (catalog lookup — NO free text; pick an existing service, e.g.
   "Replace - Brake pot" which carries 2 parts) → LEAVE **"Line Approved" UNCHECKED** → **Save & Close**.
   Result: WO has linesCount=1, statusRequested=2 (2 part-request rows) → **Approve/Decline** shows on
   the WO detail; the **Parts tab** shows editable **Vendor dropdown (Assign Vendor)**, **Part Number
   field (Fix Part #)**, **Core Charge column**. ("Save & Add Part" instead adds a specific part request.)
3. **Delete WO (cleanup):** WO Delete is UI-only (DELETE/POST API 404). On the WO detail open the top
   "⋮" menu → **Delete Work Order** → confirm. Verified removes the WO.
Still needs deeper seeding (build on the above): pick cored part P550848 onto a line (Core OK/Not-OK);
create a PO + delivery via `/parts` (Order Parts/Pick/Receive/Bulk Receive); an invoice in void state
(Invoicing reverse). Tag throwaway data ZZAUTOTEST; clean up after.


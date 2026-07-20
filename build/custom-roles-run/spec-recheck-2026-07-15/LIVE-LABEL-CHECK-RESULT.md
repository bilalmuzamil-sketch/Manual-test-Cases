# LIVE-BUILD LABEL CHECK — RESULT (observed 2026-07-20, staging)

> VIU per Standing Rules 9/10/12/13: labels OBSERVED live in the real build with evidence,
> never inferred. Driven as **Admin** via the boot2 harness (fresh cookies), read-only —
> nothing created or saved. Evidence: `live-label-evidence-2026-07-20/` (screenshots +
> innerText dumps: create-role-editor, edit-Admin, edit-PartsManager, summary-Admin).

## What was observed (5 independent observations)

| Surface | AP/AR toggle label | History toggle |
|---|---|---|
| Create Role editor (`/roles-permissions/new`) ×2 | **"View and Manage AP/AR Data"** | absent |
| Admin role Edit (`/{id}/edit`) | **"View and Manage AP/AR Data"** | absent |
| Parts Manager role Edit | **"View and Manage AP/AR Data"** | absent |
| Admin Permission Summary (`/{id}/summary`) | **"View and Manage AP/AR Data"** | absent |

**The role editor's "Cross-Cutting Toggles" card contains EXACTLY TWO toggles:**
1. **See Financial Data**
2. **View and Manage AP/AR Data** (verbatim; description: "Controls visibility of unpaid
   invoices, payments and credits tabs on customer and vendor pages. Without this setting the
   following fields are hidden on the Edit Customer modal: Credit terms, Credit limit, Default
   Labor rate, Default Shop Supplies, Min and Max, Taxes, PO is required.")

**The Parts Department group contains EXACTLY THREE children** (Admin edit, all-on):
Part sales, Catalog and Inventory, Vendor and order management. **No "View Part History" /
"View History Logs" item** anywhere in the editor. (The `viewHistoryLogs` permission KEY still
exists in the deployed JS bundle and gates the inventory route titled "Part History" — i.e. the
capability persists, but it is NOT exposed as a role-editor toggle.)

## Ruling (last-update-wins reconciled with VIU / Standing Rule 9)

### 1. AP/AR label — the build is BEHIND the spec. KEEP the build wording.
- Spec (6/10 change log) renamed the toggle to "Manage Accounts Payable and Receivable"; the
  **build has NOT adopted it** (still "View and Manage AP/AR Data", 5/5 observations 2026-07-20).
- Standing Rule 9 requires test-case wording to match the EXACT on-screen build label. The cases
  already say "View and Manage AP/AR Data" → **they are build-accurate. The proposed rename is
  WITHDRAWN.** Do NOT change these 32 cases.
- **Action for dev/PO (not a case change):** the build label lags the 6/10 spec rename — either
  ship the relabel or update the spec. Flag alongside SV-8202 (the sibling label/relabel gap).

### 2. History toggle — it does NOT exist in the role editor. Cases describing it are wrong.
- No "View History Logs" and no "View Part History" toggle is present in the editor (cross-cutting
  card = 2 toggles only; Parts group = 3 children only).
- Cases that describe a THIRD cross-cutting toggle "View History Logs" (**C26355, C26359, C27736**)
  are wrong vs the live build → correct them to the 2-toggle cross-cutting card.
- Per-role summaries that assert a "View History Logs on/off" line (**C26495, C26502, C26504**) →
  drop that line; no such editor toggle exists.
- Section-3546 behaviour cases (**C26488, C26489**) → the setting is not an editor toggle; the
  `viewHistoryLogs` capability now surfaces as the inventory **"Part History"** view. WO/line
  audit log follows WO Create & Edit; line story history follows WOL View (spec 7/7). Rewrite
  stands, minus any "toggle in the role editor" framing.

## Net effect on the proposed-corrections sheet
- **32 AP/AR-label cases:** proposed rename WITHDRAWN → treat as build-accurate (final verdict OK
  for the label; any behavioural correction on the same case still stands).
- **6 History cases (C26355/C26359/C27736 + C26495/C26502/C26504):** correction CHANGES from a
  label rename to "remove the non-existent History cross-cutting toggle" / "drop the History-Logs
  summary line".
- **C26488/C26489:** behavioural rewrite stands (inventory Part History; audit/story moved).
- Confidence: HIGH (5 live observations with screenshots).

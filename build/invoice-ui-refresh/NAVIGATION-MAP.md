# NAVIGATION MAP — Invoice UI Refresh

> **WHAT THIS FILE IS.** How each screen this project's cases inspect is reached in the ShopView shop
> app, written in the build's own on-screen labels so every case cites the same routes (Rule 27, Rule 57).
> Read it before writing a route into a case; append to it the moment a path is confirmed on a live build.

**Project:** invoice-ui-refresh · **Epic:** SV-8218 · **Branch(es) covered:** `sv8218` (QA) / staging ·
**Map started:** 2026-08-31 · **Last appended:** 2026-08-31

---

> **⚠️ AUTHORITATIVE SOURCE (2026-08-31):** Invoice runnability is owned by the build-verification
> session working on the real build **`v26.35.5-8c3cc21` (sv8218)** — the routes it writes into the cases
> (build-checked, `AUTOMATION: READY`) are authoritative wherever they differ from this design-derived map.
> Use this map as reference only; do not overwrite a build-verified case route with a route from here.

## 🛑 STATUS OF THIS MAP — PROVISIONAL (design-derived + a recorded build observation this session could not re-confirm live)

- The routes below are drawn from **two sources**: the **binding Design Document** and **spec v45**
  (Rule 57 lets us take on-screen labels/navigation from the build only), **corroborated by the sv8218
  build observation recorded on 2026-08-31** in `build/skills/18-LAYMAN-UI-STEPS.md` and in the captured
  surfaces `build-verify-2026-08-31/surface-*.txt` (build marker `v26.35.5-8c3cc21`).
- **This session did not open the live UI**, so every route here is **PROVISIONAL — to be re-confirmed
  on the current build** before it is treated as fact. Where the design/spec/recorded observation do not
  show how to reach a state, the case says so rather than inventing a path (skill 18 hard line).
- **NAVIGATION ONLY** — never expected behaviour (Rule 57). A row here is never cited in a case's
  Expected Results or provenance line.

---

## THE MAP

| # | Feature / screen | Route (build's own on-screen labels) | Source |
|---|---|---|---|
| N1 | **Top navigation** | The top menu reads **Work Orders · Schedule · Customers · Parts · Reports · Search** (with Clock In and the active location on the right). | surface-*.txt, design |
| N2 | **A work order's Estimate / Invoice document** | Click **Work Orders** in the top menu → click the work order's row to open it → click the **Finance** tab (the tab strip reads **Lines · Parts · Notes · Stats · Finance**). The document appears on the right. Use the **Estimate / Invoice** toggle above the document to switch between the two. | surface-finance-tab.txt, skill 18, design |
| N3 | **Invoice display settings (the cog dialog)** | On the **Finance** tab, the icon row above the document reads **download · email · print · settings (cog) · more**. Click the **settings (cog)** icon. The dialog lists **Labor rate · Labor hours · Labor price · Part number · Part quantity · Part price · Part description · Summarize parts total · Summarize labor total**, then a **Settings** button to apply. | surface-invoice-settings-full.txt |
| N4 | **Save / print / download the document** | On the **Finance** tab: the **print** icon prints, the **download** icon saves the PDF, the **email** icon emails it. | surface-finance-tab.txt |
| N5 | **Authorizer on a work order** | Open the work order (N2 entry). The **Authorizer** row is in the **customer card on the left**, below **Contact** and **Phone**. Click the Authorizer dropdown. It offers **only** contacts with **Approves Work** ticked on their contact record. | surface-wo-customer-card.txt, design, skill 18 |
| N6 | **A customer's contacts / the "Approves Work" flag** | Click **Customers** in the top menu → open the customer → **Contacts** tab → edit a contact → the **Approves Work** checkbox. Only ticked contacts appear in the Authorizer dropdown (N5). | design, surface-customer-contacts.txt |
| N7 | **A Parts Sale Estimate / Invoice document** | Click **Customers** → open the customer → **Part Sales** tab → open the part sale → **Finance** tab. **Alternative** (global list): click **Parts** → **Part Sales** in the left menu → open the part sale from the list → **Finance** tab. | surface-part-sales.txt, surface-customer-page.txt, design |
| N8 | **Authorizer on a parts sale** | Open the part sale (N7). The **Authorizer** row is in the customer card, same placement and same "Approves Work" rule as the work order (N5). | design |
| N9 | **A Credit Invoice (credit memo)** | Click **Customers** → open the customer → **Invoices** tab → find the credit's row (its number, e.g. **CM-100**, sits in the **Invoice #** column among ordinary invoice numbers) → click the **print** icon at the right of that row (tooltip **Print credit memo**). Your **active location must be the location the credit was issued at** (credits are location-scoped and do not appear under another location). If the credit is **fully applied or fully refunded**, turn the **Open only** filter **off** first, or its row is not listed. | skill 18, surface-customer-page.txt, design |
| N10 | **Reverse a payment** | Click **Customers** → open the customer → **Payments** tab → click the **delete (trash)** icon on the payment row. A confirmation reads *"This action will reverse the payment for all invoices associated with it. The payment record is preserved for audit history."* → click **Reverse**. | recorded on sv8218 (Mudassir C45177 route), reversal-walk.json |
| N11 | **The customer's Invoices / Payments / Deposits lists** | Click **Customers** → open the customer → the tabs read **Work Orders · Part Sales · Contacts · Assets · Notes · Invoices · Payments · Deposits · Fees & Discounts**. | surface-customer-page.txt |
| N12 | **A work line's status (Complete / Declined)** | Open the work order (N2) → **Lines** tab → each line shows a **Status** column (values seen: **Complete**, **Declined**). | surface-wo-customer-card.txt |

---

## NOTES AND GOTCHAS (navigation only)

- **N3 — no "Show declined work" control.** The cog dialog (N3) does **not** contain a "Show declined
  work" toggle on the observed build, and the rendered document showed no Declined Work section even for a
  work order full of Declined-status lines. So the state "declined work shown on the document" has **no
  UI control to reach it** on this build. Cases that need it (INV-DECL-01/02/03) say so and are held
  NOT AVAILABLE ON BUILD (skill 18 hard line) — they are never routed through an API substitute.
- **N3 — the "Show % on Estimates and Invoices" location setting** (shop-supplies percentage, INV-FSUM-03)
  was not located in the tester-reachable UI on the observed build; the exact Administration path is
  unconfirmed. The case names the reachable document route and states the setting must be confirmed on
  the build rather than inventing the path.
- **Customer (ShopPay) portal is staging-only.** Portal-generated Invoice PDFs and the paid banner exist
  only on **staging**, never on the QA branch (QA lead, 2026-08-31). Cases whose preconditions require a
  portal artefact carry the staging-only HOLD marker and are run on staging.
- **Parts Sale reachable two ways** (N7): via the customer's **Part Sales** tab, or via the top-nav
  **Parts → Part Sales** global list. Both open the same part-sale record; re-confirm which the tester
  should prefer on the build.

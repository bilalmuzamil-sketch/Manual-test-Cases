# SV-8456 — Fees & Discounts UI Corrections — Ingested Requirements

> **Source (pointer only — do NOT fetch; Atlassian-SSO login-walled):**
> https://shopview.atlassian.net/browse/SV-8456
> Ingested ENTIRELY from already-downloaded local capture at `/tmp/fd-tickets/SV-8456/`
> (issue.json, description.md, comments.json/.md, att-manifest.json + 7 attachment files).
> No Jira login / no network to Jira was used.

## Ticket header

| Field | Value |
|---|---|
| **Key** | SV-8456 |
| **Summary** | F&D UI corrections: modal controls, table styling, nav placement, card order & verbiage |
| **Issue type** | Story Defect |
| **Status** | **Done** |
| **Epic** | SV-7387 (Fees & Discounts V1) — *see note* |
| **Parent (issue.json `parent`)** | **SV-8288** — the ticket's stored parent key is SV-8288, not SV-7387 directly. SV-8288 is presumed to be a sub-epic/story under the F&D V1 epic SV-7387. Captured faithfully; flagged, not resolved (no Jira access to confirm SV-8288's own parent). |
| **PO** | Chris Ward |
| **Reporter** | Stefan Vukovic |
| **Assignee** | Stefan Vukovic |
| **Labels** | `QAcomplete_Ahtasham_Amjad`, `Staging_Verified`, `fees-discounts` |
| **Created** | 2026-07-21T05:07:50-0500 |
| **Updated** | 2026-07-22T11:49:17-0500 |
| **Ingest date** | 2026-07-22 |

---

## DESCRIPTION (verbatim)

**Product Area**
Settings / Work Orders / Customers / Fees & Discounts

**Environment**
Local / dev — flagged during handoff review of the F&D feature. Frontend-only; backend unaffected. The product owner's design screenshots are the source of truth where they differ from the written spec.

**Description**
Several visual/layout details in the Fees & Discounts UI diverged from the product design during the handover. These are frontend-only corrections to bring the screens back in line with the design.

**Steps to Reproduce**

  1. Open Settings → Fees & Discounts (the template list + New/Edit dialog).
  2. Open a Work Order's Lines tab and view the sidebar cards.
  3. Open a Part Sale and view the sidebar cards.
  4. Open a Customer → Fees & Discounts tab.

**Actual Result (misses)**

  * **Modals:** Taxable rendered as a toggle; Auto-apply rendered as a toggle; dialog field order didn't match the design.
  * **Settings table:** Type and Auto-Apply columns rendered as colored badges; columns center/right-aligned and bunched to the right.
  * **Navigation:** "Fees & Discounts" lived under the **Finance** section.
  * **Work Order sidebar:** the whole-WO adjustments card rendered **below** the Financial Info card; title read "WO Fees & Discounts".
  * **Part Sale sidebar:** adjustments card rendered **below** the Financial Info card.
  * **Customer Fees & Discounts tab:** table styling didn't match the Settings page.

**Expected Result**

  * Taxable → **Yes/No dropdown**; Auto-apply → **checkbox** with descriptive caption; dialog field order matches the design.
  * Settings + customer tables: **plain-text cells** (no badges), all columns **left-aligned and evenly distributed**.
  * "Fees & Discounts" under **Service** (below Canned Lines); permission gate unchanged (Settings → Finance + FeesAndDiscounts flag).
  * Whole-WO / Parts-Sale adjustments cards render **above** the Financial Info card.
  * WO card titled **"Work Order Fees & Discounts"**.
  * Customer tab mirrors the Settings table styling (minus the convenience-fee toggle), retaining link-existing-template + Remove.

**Notes**
Preserved the taxable jurisdiction note and the "Pass convenience fee to customer" banner. Playwright page objects updated for the changed control types / test-ids; nav-gating regression test added. Full E2E coverage pass deferred.

> **Internal contradiction flagged (in the ticket text itself):** the Expected-Result bullet
> says the permission gate is *"unchanged (Settings → Finance + FeesAndDiscounts flag)"*,
> but the QA-Handoff comment and the QA-Result comment (below) describe the **main behavioral
> change** as a **pivot from Settings → Finance to Settings → Service** gating. The comments
> are newer and were the basis of verification; last-update-wins ⇒ the **Service** gate is
> authoritative. See Delta section.

---

## COMMENTS (all 3, in order — author + date + full body)

### Comment 1 — Stefan Vukovic — 2026-07-21T07:07:54-0500

> [Chris Ward] please verify.
>
> **QA Handoff — F&D UI corrections + settingsService gate**
>
> Frontend-only — no backend, data, or calculation changes. PR: #2215 (merged to `develop`).
>
> **Test env:** https://app.staging.shopview.com — merged to `develop`, so it's on **staging**. Use your standard staging QA accounts.
>
> **What changed / what to check**
>   1. **Settings → Fees & Discounts** — now under the **Service** nav group (was Finance). Table: **Type** and **Auto-Apply** render as **plain text** (no colored badges); all columns **left-aligned and evenly spaced**.
>   2. **New / Edit Fee-or-Discount modal** — **Taxable** is a **Yes/No dropdown**; **Auto-apply** is a **checkbox** with the "When on…" caption; the "Tax treatment varies by jurisdiction…" note still shows; saving persists the values correctly.
>   3. **Work Order & Part Sale sidebars** — the whole-order **Fees & Discounts card renders above the Financial Info card**; the WO card title reads **"Work Order Fees & Discounts"**.
>   4. **Customer → Fees & Discounts tab** — table styling matches the Settings page.
>
> **Permission behavior — main behavioral change, please verify by role:**
>   * A **Settings → Service** user **sees** "Fees & Discounts" under Service and **can manage** it (New / Edit / Delete + the convenience-fee toggle).
>   * A **Settings → Finance-only** user (no Service) **no longer sees** the F&D nav item and **cannot reach** `/administration/adjustment-templates`.
>   * Other Service-section items (Labor Rates, Canned Lines, Asset Types, Inspection Templates) are **unaffected**.
>
> **Preserved (regression check):** the jurisdiction tax note in both dialogs, and the "Pass convenience fee to customer" banner/toggle on the Settings page.
>
> **Automated coverage:** permission-pivot enforcement is automated — TestRail **C29922** (settingsService gating) + **C29923** (Service-admin delete flow), under _Fees & Discounts (VIU-PENDING) → Permissions (Story 13)_.

### Comment 2 — Chris Ward — 2026-07-21T19:17:59-0500

> [Stefan Vukovic] Verified!
>
> Some small incoming on a second ticket. https://shopview.atlassian.net/browse/SV-8479.

### Comment 3 — Ahtasham Amjad — 2026-07-22T11:49:00-0500

> **QA Result:**
>
> **Env:** Staging
>
>   1. Taxable → **Yes/No dropdown**; Auto-apply → **checkbox** with descriptive caption; dialog field order matches the design. ✅ (image-20260722-164303.png)
>   2. Settings + customer tables: **plain-text cells** (no badges), all columns **left-aligned and evenly distributed** ✅ (image-20260722-164454.png, image-20260722-164459.png)
>   3. "Fees & Discounts" under **Service** (below Canned Lines); permission gate unchanged (Settings → Finance + FeesAndDiscounts flag) ✅ (image-20260722-164545.png)
>   4. Whole-WO / Parts-Sale adjustments cards render **above** the Financial Info card ✅ (image-20260722-164632.png)
>   5. WO card titled **"Work Order Fees & Discounts"**. ✅ (image-20260722-164710.png)
>   6. Customer tab mirrors the Settings table styling (minus the convenience-fee toggle), retaining link-existing-template + Remove. ✅ (image-20260722-164746.png)
>
> **QA Status → Passed**
>
> cc: [Chris Ward] [Stefan Vukovic]

---

## ATTACHMENTS (7 total; 6 unique + 1 exact duplicate)

All 7 are ShopView app-UI screenshots (no credentials / OTP / email content). File `58882`
is a byte-identical duplicate of `58883` (same MD5 `5a1e5f17…`; the manifest records
`dup_of: 58883`). Copied into `attachments/SV-8456/` with readable names.

| # | Jira filename | ID | Type | Size | Repo copy (readable name) |
|---|---|---|---|---|---|
| 1 | image-20260722-164303.png | 58884 | image/png | 77,829 B | image-20260722-164303_new-fee-discount-modal.png |
| 2 | image-20260722-164454.png | 58879 | image/png | 84,863 B | image-20260722-164454_settings-fd-table.png |
| 3 | image-20260722-164459.png | 58883 | image/png | 108,636 B | image-20260722-164459_customer-fd-tab.png |
| 4 | image-20260722-164545.png | 58881 | image/png | 32,106 B | image-20260722-164545_service-nav-placement.png |
| 5 | image-20260722-164632.png | 58880 | image/png | 64,532 B | image-20260722-164632_wo-card-above-financial.png |
| 6 | image-20260722-164710.png | 58885 | image/png | 16,197 B | image-20260722-164710_wo-card-title.png |
| 7 | image-20260722-164746.png | 58882 | image/png | 108,636 B | image-20260722-164746_customer-fd-tab-dup.png (= dup of #3) |

### Image analyses (opened + described)

**#1 — 58884 — New Fee / Discount modal (proves modal control changes).**
A centered white modal titled **"New Fee / Discount"** with an "×" close control, over a
dimmed Settings/Fees & Discounts page (a "…charged a convenience fee through the…" banner
and a Type/Calc/Taxable/Auto- table are visible behind). Modal fields top-to-bottom:
- Row 1: **Type** dropdown (value "Fee") and **Calculation Type** dropdown (value "Flat Amount").
- **Name** text input (placeholder "Name").
- **Default Amount** text input (placeholder "Default Amount").
- A **green highlight box** (annotation) frames the corrected region containing:
  - **Taxable** rendered as a **dropdown** (value "Yes") — NOT a toggle.
  - Grey caption: **"Tax treatment varies by jurisdiction — confirm your local requirements before saving."**
  - An **unchecked checkbox** labelled **"Auto-apply to all new work orders at this location"** — NOT a toggle.
  - Grey caption under it: **"When on, this fee / discount is added automatically to every new work order created at this location. It can still be edited or removed on individual work orders."**
  - **Description (Optional)** text input.
  - Footer buttons **Cancel** (grey) and **Create** (blue).
Confirms: Taxable = Yes/No dropdown; Auto-apply = checkbox + caption; jurisdiction note present; field order Type/Calc → Name → Default Amount → Taxable → note → Auto-apply → Description → Cancel/Create.

**#2 — 58879 — Settings → Fees & Discounts table (proves plain-text/left-aligned + banner).**
Top nav shows Schedule / Customers / Parts / Reports, a "Search ⌘/Ctrl+K" box, Clock In,
and org badge **"Staging Heavy Duty - 9919"** (avatar "AS"). Heading **"Pass convenience
fee to customer"** with subtitle "When enabled, customers are charged the payment
convenience fee on payments made through the customer portal." and a **blue ON toggle** at
right. Below, an amber info banner: **"Customers are already charged a convenience fee
through the customer portal. Adding fees here may charge them twice."** Then heading
**"Fees & Discounts"** with a blue **"New Fee / Discount"** button at right. Table columns
(all left-aligned, evenly spaced, **plain text — no colored badges**):
**Name | Type | Calculation Type | Amount | Max Amount | Taxable | Auto-Apply To Work Orders** + per-row edit (pencil) and delete (red trash) icons. Rows:
- Fee | Fee | Flat Amount | $500,000.00 | — | No | Yes
- New Processing Fee | Processing Fee | % of Grand Total | 10% | — | Yes | Yes
- Part Fee | Fee | % of Parts Total | 11% | — | Yes | Yes
Confirms: Type and Auto-Apply are plain text (no badges); columns left-aligned; convenience banner + toggle preserved.

**#3 — 58883 — Customer → Fees & Discounts tab (proves customer-table styling).**
URL bar: `app.staging.shopview.com/customers/731702ff-49a2-4f4e-81ed-bd13680ddd9a/default-adjustments`
(account avatar "A / Work"). Top nav Work Orders / Schedule / **Customers** (active) / Parts /
Reports; org badge "Staging Heavy Duty - 9919". Customer sub-tabs: Work Orders (21) /
Part Sales (3) / Contacts (1) / Assets (7) / Notes (4) / Invoices (17) / Payments (19) /
Deposits (1) / **Fees & Discounts (3)** (active). Heading **"Default Fees & Discounts"**
with subtitle "These fees & discounts auto-apply to every new work order for this customer.
They can still be edited or removed on individual work orders without changing the defaults
here." and a blue **"Add Fee/Discount"** button at right. Table columns (left-aligned,
plain text, matching Settings): **Name | Type | Calculation Type | Amount | Max Amount |
Taxable** + per-row **delete (trash) only** (no convenience toggle). Rows:
- Fee | Fee | Flat Amount | $500,000.00 | — | No
- New Processing Fee | Fee | % of Grand Total | 10% | — | Yes
- Part Fee | Fee | % of Parts Total | 11% | — | Yes
Confirms: customer tab mirrors Settings styling (minus convenience toggle); Add Fee/Discount
(link-existing) + per-row Remove retained.

**#4 — 58881 — Settings left-nav (proves Service placement).**
Cropped left settings navigation with a green annotation box. Groups/items visible:
Locations, Departments, Taxes (top), then a **SERVICE** group header with: Labor Rates,
**Fees & Discounts** (green-boxed, immediately **below Canned Lines**), Asset Types,
Inspection Templates; then a **PARTS** group (Pricing…). The green box frames
**"Canned Lines"** + **"Fees & Discounts"** together. Confirms: F&D now lives under
**SERVICE**, directly below Canned Lines (moved out of Finance).

**#5 — 58880 — Work Order sidebar cards (proves card order + card content).**
Right-hand WO sidebar, top-to-bottom: an asset/details card (a copyable id
"456456456464654654", Mileage 25, Engine Hours 0, License Plate, a greyed **"Valid VIN
Required"** button); then the **"Work Order Fees & Discounts"** card **ABOVE** the Financial
Info card. That card lists **Fee +$500,000.00** and **Discount (−4%) −$20.89** (each with a
⋮ overflow menu) and caption "Applies to the whole work order, after all other fees &
discounts." Below it the **"Financial Info"** card: Item/Cost table — Parts $21.74, Labor
$464.86, Shop Supplies $48.81, Fees & Discounts (6) $500,045.21, Subtotal $500,580.62, GST
$29.03, Total $500,609.65 (green), Balance $500,609.65. Confirms: whole-WO adjustments card
renders ABOVE Financial Info; card title = "Work Order Fees & Discounts".

**#6 — 58885 — WO Fees & Discounts card close-up (proves card title/verbiage).**
Tight crop of the same card: bold title **"Work Order Fees & Discounts"**, rows
**Fee +$500,000.00** and **Discount (−4%) −$20.89** (each with ⋮), grey caption "Applies to
the whole work order, after all other fees & discounts." Confirms the exact corrected title.

**#7 — 58882 — Customer → Fees & Discounts tab (exact duplicate of #3 / 58883).**
Byte-identical to #3; same customer Default Fees & Discounts screen. No new information.

---

## SCOPE HEADLINE (plain terms) — what SV-8456 requires

Frontend-only visual/layout corrections to realign the Fees & Discounts UI with the PO's
design (design screenshots are source-of-truth over the written spec). Eight corrections,
each with its evidence:

1. **Modal controls — Taxable dropdown.** In the New/Edit Fee or Discount dialog, Taxable
   must be a **Yes/No dropdown**, not a toggle. *(Evidence #1 / 58884.)*
2. **Modal controls — Auto-apply checkbox.** Auto-apply must be a **checkbox** with the
   descriptive caption ("Auto-apply to all new work orders at this location" + "When on…"
   sentence), not a toggle. *(Evidence #1 / 58884.)*
3. **Modal field order** matches the design (Type / Calculation Type → Name → Default
   Amount → Taxable → jurisdiction note → Auto-apply → Description → Cancel/Create).
   *(Evidence #1 / 58884.)*
4. **Settings table styling.** Type and Auto-Apply columns render as **plain text (no
   colored badges)**; all columns **left-aligned and evenly distributed**. *(Evidence #2 /
   58879.)*
5. **Nav placement.** "Fees & Discounts" moves to the **Service** nav group, **below Canned
   Lines** (was under Finance). *(Evidence #4 / 58881.)*
6. **Work Order sidebar card.** The whole-WO adjustments card renders **above** the
   Financial Info card and is titled **"Work Order Fees & Discounts"** (was below; was "WO
   Fees & Discounts"). *(Evidence #5 & #6 / 58880, 58885.)*
7. **Part Sale sidebar card.** The whole-sale adjustments card renders **above** the
   Financial Info card. *(Described in ticket + verified in comment #3; live-confirmed in
   our 2026-07-21 pass as "Parts Sale Fees & Discounts".)*
8. **Customer → Fees & Discounts tab styling.** Table mirrors the Settings-page styling
   (plain-text, left-aligned), **minus the convenience-fee toggle**, retaining
   link-existing-template (Add Fee/Discount) + per-row Remove. *(Evidence #3 / 58883.)*

**Behavioral change (permission pivot — flagged in comments as the "main behavioral
change"):** F&D settings access pivots to a **Settings → Service** gate. A Service user
sees + manages F&D (New/Edit/Delete + convenience toggle); a Finance-only user no longer
sees the nav item and cannot reach `/administration/adjustment-templates`; other Service
items unaffected. Automated coverage = **C29922** (settingsService gating) + **C29923**
(Service-admin delete flow), TestRail section "Permissions (Story 13)".

**Preserved (regression):** the jurisdiction tax note in both dialogs, and the "Pass
convenience fee to customer" banner/toggle on the Settings page.

---

## DELTA VS. ALREADY-DONE (our 2026-07-21 SV-8456 work)

**Compared against:** `build/fees-discounts/PROJECT-STATE.md` §0.0l and
`build/fees-discounts/viu-sv8456-2026-07-21/findings.md`.

### Verdict: **NO DELTA — the ticket as captured is FULLY COVERED by our 2026-07-21 work.**

Point-by-point reconciliation:

| Ticket requirement | Our 2026-07-21 work | Match? |
|---|---|---|
| Taxable = Yes/No dropdown | Verified live (findings Task 1/Task 3 #3) | ✅ |
| Auto-apply = checkbox + caption | Verified live, exact caption captured | ✅ |
| Modal field order per design | Verified live (Task 3 #3) | ✅ |
| Settings table plain-text/left-aligned (no badges) | Verified live (Task 3 #4) | ✅ |
| Nav under Service, below Canned Lines | Verified live (Task 3 #1) | ✅ |
| WO card "Work Order Fees & Discounts" ABOVE Financial Info | Verified live (Task 3 #5) | ✅ |
| Part Sale card ABOVE Financial Info | Verified live (Task 3 #6; title "Parts Sale Fees & Discounts") | ✅ |
| Customer tab mirrors Settings styling, minus convenience toggle, link-existing + Remove | Verified live (Task 3 #7) | ✅ |
| Preserved: jurisdiction note + convenience banner | Verified live (Task 3 #8) | ✅ |
| Permission pivot to Settings → Service (Service sees/manages; Finance-only blocked) | Verified live (Task 2, release-critical) | ✅ |
| Automated coverage C29922 / C29923 | Reconciled into id-map (FD-PERM-012/013), mirrored as dev_authored | ✅ |

- **34 cases reworded + pushed** (update_case 34/34, 200 + re-GET MATCH); **0 deviations**;
  **no status flips** — all documented in §0.0l. This matches the ticket's Expected Results
  exactly.
- **C29922 / C29923** referenced in comment #1 were reconciled (not duplicated) into the
  id-map as FD-PERM-012 / FD-PERM-013.

### Anything NEW or CHANGED since 2026-07-21 that we have NOT reflected?

**None material.** The ticket reached **Done / Staging_Verified / QAcomplete** on
2026-07-22. The only content dated after our 2026-07-21 pass is **QA-Result comment #3
(Ahtasham Amjad, 2026-07-22)** — it is a pure pass/confirmation with screenshots (all 6
checks ✅, QA Status → Passed) and introduces **no new or changed requirement**; it simply
corroborates what we already verified. No new attachments, no scope change, no re-open.

### Two flags to note (not deltas in our work — inconsistencies inside the ticket):

1. **Permission-gate wording contradiction inside the ticket.** The Description's
   Expected-Result and QA-comment #3 item 3 both say the gate is *"unchanged (Settings →
   Finance + FeesAndDiscounts flag)"*, while the QA-Handoff comment #1 calls the
   **Service** pivot the "main behavioral change." The build (and our live VIU) implement
   the **Settings → Service** gate — so our work correctly follows the newer/authoritative
   comment, and the "Finance-unchanged" phrasing in the description/QA-result is stale
   ticket prose. **Our implementation is correct; no change needed.**
2. **Parent-key vs Epic.** issue.json stores parent **SV-8288** (task/CLAUDE.md name the
   epic as **SV-7387**). Captured both; SV-8288 is presumed an intermediate sub-epic under
   SV-7387. No effect on scope.

**Bottom line:** SV-8456 is faithfully captured and is **fully covered** by the 2026-07-21
implementation (34 cases + C29922/C29923). No new/changed requirements to action.

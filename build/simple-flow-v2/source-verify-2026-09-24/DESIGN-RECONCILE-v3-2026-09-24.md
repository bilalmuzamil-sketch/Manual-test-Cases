# Simple Flow V2 — full source verification incl. design v3 (2026-09-24)

Completes the "source verify" with the sources the QA lead supplied: spec 771391574, epic SV-8683,
permissions SV-8183, and the **v3 design** (two zips). Design was **driven end-to-end** (Rule 115);
screenshots in `../design-exploration-v3-2026-09-24/`. **No TestRail writes.**

## Sources & currency (checked live 2026-09-24)
| Source | State | Verdict |
|---|---|---|
| Spec Confluence **771391574** | last modified **11 Sep 2026**; change log unchanged since 8 Sep | current; content unchanged since our 9-Sep pass (see SOURCE-CURRENCY-2026-09-24) |
| Epic **SV-8683** | **status Done**, updated **2026-09-24**; names **QA env `sv8683.qa.shopview.com`** | in-scope list matches our suite; **see build finding below** |
| Permissions **SV-8183** | "Received later" is the one new atom; no others | matches Story 21 cases + design `skipRecv` |
| Design **v3** — `Work_orders_and_settings_setup_3` (Shopview App, Bulk Action Emails, **Work Order PRD.md**) + `Purchase_Orders_Page_3` (Purchase Orders, Purchase Order Details, …- Vendor Missing, Receive Vendor Parts) | 6 pages driven live; PRD.md (409 lines) read | mostly CONFIRMS; **one conflict** below |

Design v3 saved under `../sources-design-v3-2026-09-24/`. CDN libs localized to drive it; original `support.js` kept as `support.orig.js`.

## Design v3 reconciliation vs spec vs cases (Rule 56/57/115)
**CONFIRMS (design agrees with spec and our cases):**
- Settings model incl. the rename/new-setting set and "a settings change applies to every open work order" (Stories 1–4).
- "Completion is never blocked" — a line completes whatever its parts' state; gating moved to the wizard (Story 5).
- Bulk action bar: grouped with dividers, one primary, **Decline lives in More**, **Deselect all**, partial-success reporting (Story 7/8/9/11/12).
- Completion wizard: step list computed from settings + outstanding work, skips done steps, "Missing details always last" (Stories 16/17), Create-invoice-as-finish (Story 18).
- Receive modal / pages: one card per vendor, **Vendor missing sorts first**, Assign vendor + "Add vendor", vendor editable until received (Stories 13/14). "Receive vendor parts" page groups by vendor with a numeric totals bar (Story 14).
- Part statuses & row actions, Receive split-button / "Receive later" permission-gated, core-charge handling (Stories 6/15).
- Parts reorder **within their own line only**, drop **can be undone** (Story 20).

**🔴 CONFLICT #1 — Declining a line that holds received/picked parts (Story 6 / case C44567):**
- **Spec 771391574 (our case C44567):** Decline is **disabled** while the line holds received or picked parts, reason *"Return this line's received parts before declining it."*
- **Design v3 `Work Order PRD.md` §2:** *"Declining a line with parts is always allowed — no confirmation modal, no 'return the parts first' guard. It applies immediately with an undo toast."*
- The design is even **internally inconsistent**: its own bulk-bar example (§6) still reports *"1 line couldn't be declined — Line 3: parts must be returned first."*
- → **PO question for Milos** (Rule 56 — do not pick silently). Case C44567 currently follows the spec; **HELD/flagged, not changed.**

**🟠 CORROBORATION — C44604 (reorder Undo):** design v3 PRD.md §3/§6 says a reorder drop **toasts with undo**; the spec says a drop *"can be undone."* **Both current sources say Undo exists**, so the case's Expected ("Undo removed on user request 2026-09-04") conflicts with both. Strengthens the existing PO question; still HELD.

## Coverage
- **21/21 stories still covered.** Every design v3 surface (settings, line/part actions, bulk bar, wizard, PO list/details/vendor-missing, receive-vendor-parts, bulk-action emails) maps to an existing story/case. No new story surfaced by the design.
- The "Receive vendor parts" page shows numeric totals (COST TOTAL / PARTS SELECTED / POS SELECTED) → Rule 116 numeric checks apply at build-verify; Story 14 cases cover the receive page (verify count/total accuracy when a build is exercised).

## 🔴 Build finding (updates APPRAISAL finding #3)
- Epic SV-8683 is **Done** and names a **QA environment `sv8683.qa.shopview.com`**. This contradicts the standing PROJECT-STATE note "no QA build exists yet," and aligns with the case provenance line "Last checked against build v26.35.9-5700a76 on 9/9/2026."
- **Therefore build-verification is likely now possible.** The `AUTOMATION: READY` markers may be justified *if* the suite was genuinely build-verified on that env — but we hold no captured build evidence for it (Rule 12/110), and no app session is available here (401 blocker). **The QA lead should confirm** whether to run a build-verification pass on `sv8683.qa.shopview.com` (which would legitimately set READY/EXPECT-FAIL per case and refresh the provenance).

## Outstanding — what I need from you
1. **PO question (Milos):** decline-with-parts — is Decline blocked while a line holds received/picked parts (spec), or always allowed with undo (design v3)? The two current sources disagree.
2. **PO question (Milos):** C44604 reorder Undo — spec and design both say a drop can be undone; the case says Undo was removed 2026-09-04. Which is correct?
3. **Build-verify decision:** epic is Done and `sv8683.qa.shopview.com` exists — do you want a build-verification pass (would resolve the READY-vs-HOLD marker question with real evidence and let me re-stamp provenance)? An app login is currently 401-blocked, so I'd need working access.
4. **Provenance re-stamp** to the 11-Sep revision (content unchanged) is ready to run once #3 is settled, so I don't write a build claim we can't back.
_No case content change is required by the spec (unchanged); the only substantive case actions are the two held PO conflicts above._

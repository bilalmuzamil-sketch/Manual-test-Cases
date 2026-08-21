# Surface Matrix — Simple Flow V2 (Rule 40)

Simple Flow V2 is almost entirely **on-screen Vue/Quasar work-order + settings + purchase-order UI**.
There is no customer document/PDF surface of its own (the invoice it produces is the existing invoice;
reordering parts, Story 20, only affects the order the existing invoice/PDF prints). Surfaces that matter:
the **work-order line list + line/part menus**, the **bulk action bar**, the **completion wizard modal**,
the **receive modal**, the **purchase-order pages**, the **settings page**, the **clock-out modal**, and
**permission gating** across all of them. No CSV export and no API-only content (Rule 4 not triggered).

Legend: ✅ authored · — n/a.

| Story / area | WO line UI | Bulk bar | Wizard/modal | PO pages | Settings | Clock-out | Permission gate |
|---|---|---|---|---|---|---|---|
| 1-4 Settings | — | — | — | — | ✅ (12) | — | ✅ App Settings |
| 5 Completing a line | ✅ | ✅ | ✅ wizard | — | (driven by) | ✅ | ✅ WO C&E + Full View |
| 6 Line/part actions | ✅ | ✅ | — | — | — | — | ✅ per action |
| 7 Bulk action bar | ✅ select | ✅ (bar) | — | — | — | — | ✅ WO Lines C&E |
| 8 Bulk approve/decline | ✅ | ✅ | — | — | — | — | ✅ Full View |
| 9 Bulk complete | ✅ | ✅ | ✅ wizard | — | — | — | ✅ WO C&E |
| 10 Bulk delete (deferred) | — | ✅ absent | — | — | — | — | — |
| 11 Bulk order | ✅ | ✅ | confirm | (creates PO) | — | — | ✅ Order Parts |
| 12 Bulk pick | ✅ | ✅ | — | — | — | — | ✅ Pick Parts |
| 13 Receiving | ✅ | ✅ | ✅ receive modal | — | — | — | ✅ Order Parts |
| 14 PO pages | — | — | — | ✅ (3) | — | — | ✅ Vendor & Order Mgmt + See Fin |
| 15 Receive later | ✅ split btn | ✅ | ✅ wizard step | — | (gated by setting) | — | ✅ Received later (new atom) |
| 16-17 Completion wizard | ✅ | ✅ | ✅ (5) | — | (steps from settings) | ✅ | ✅ per step |
| 18 Finish action | ✅ header | ✅ | ✅ | — | (review setting) | — | ✅ Invoicing + See Fin / Review |
| 19 Part rows/menus | ✅ (2) | ✅ mirror | — | — | — | — | ✅ Order Parts / Full View |
| 20 Reordering parts | ✅ | — | — | (invoice/PDF read order) | — | — | ✅ WO Lines C&E + Full View |
| 21 Permissions | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ (the whole story) |

**Explicitly N/A, with reason:**
- **Customer document / PDF:** V2 does not restyle documents; the invoice it produces is the existing one. Story 20 only sets the part order the existing invoice/PDF reads.
- **CSV export / email / mobile-specific:** not in this spec.
- **API-only payload:** the receive pipeline and audit log are existing back-end behaviour reused, not new endpoint contracts a tester would assert directly (Rule 4 not triggered). BE atom-collapse noted per SV-8183.
- **Bulk delete lines:** out of scope (SV-9256) — one boundary negative (SFV2-BULK-08).

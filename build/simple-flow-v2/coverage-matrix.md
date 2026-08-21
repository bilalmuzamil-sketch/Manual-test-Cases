# Coverage Matrix — Simple Flow V2 (spec v21)

**Re-derived 2026-08-21 from spec v21 (21 stories) + permission map SV-8183, and the 61 authored cases, BOTH directions. No C-IDs yet (nothing pushed).**

| Story | Title | Verdict | Covered by (internal ID) |
|---|---|---|---|
| SV-9247 | Story 1 Work Order settings page | covered | SFV2-SET-01, SFV2-SET-02, SFV2-SET-03, SFV2-SET-04, SFV2-SET-05 |
| SV-9248 | Story 2 Settings apply to every work order | covered | SFV2-SET-06, SFV2-SET-07, SFV2-SET-08 |
| SV-9249 | Story 3 Confirmation before a settings change | covered | SFV2-SET-09, SFV2-SET-10 |
| SV-9250 | Story 4 Applying a settings change at scale | covered | SFV2-SET-11, SFV2-SET-12 |
| SV-9251 | Story 5 Parts no longer block completing a line | covered | SFV2-COMP-01, SFV2-COMP-02, SFV2-COMP-03, SFV2-COMP-04, SFV2-COMP-05 |
| SV-9252 | Story 6 Which actions appear on a line and on a part | covered | SFV2-ACT-01, SFV2-ACT-02, SFV2-ACT-03, SFV2-ACT-04, SFV2-ACT-05 |
| SV-9253 | Story 7 The bulk action bar | covered | SFV2-BULK-01, SFV2-BULK-02, SFV2-BULK-03, SFV2-BULK-04 |
| SV-9254 | Story 8 Bulk approve and decline | covered | SFV2-BULK-05, SFV2-BULK-06 |
| SV-9255 | Story 9 Bulk complete lines | covered | SFV2-BULK-07 |
| SV-9256 | Story 10 Bulk delete lines | covered | SFV2-BULK-08 |
| SV-9257 | Story 11 Bulk order parts | covered | SFV2-BULK-09, SFV2-BULK-10 |
| SV-9258 | Story 12 Bulk pick parts | covered | SFV2-BULK-11, SFV2-BULK-12 |
| SV-9259 | Story 13 Receiving from the work order | covered | SFV2-RCV-01, SFV2-RCV-02, SFV2-RCV-03, SFV2-RCV-04, SFV2-RCV-05, SFV2-RCV-06 |
| SV-9260 | Story 14 The receive page and PO bulk receive | covered | SFV2-PO-01, SFV2-PO-02, SFV2-PO-03 |
| SV-9261 | Story 15 Receive later | covered | SFV2-RL-01, SFV2-RL-02 |
| SV-9262 | Story 16 When the completion wizard opens | covered | SFV2-WIZ-01 |
| SV-9263 | Story 17 The completion wizard | covered | SFV2-WIZ-02, SFV2-WIZ-03, SFV2-WIZ-04, SFV2-WIZ-05 |
| SV-9264 | Story 18 Create invoice as the finish action | covered | SFV2-FIN-01, SFV2-FIN-02, SFV2-FIN-03 |
| SV-9265 | Story 19 Part rows and menus | covered | SFV2-MENU-01, SFV2-MENU-02 |
| SV-9266 | Story 20 Reordering parts on a line | covered | SFV2-ORD-01, SFV2-ORD-02 |
| SV-9267 | Story 21 Permissions on the new surfaces | covered | SFV2-PERM-01, SFV2-PERM-02, SFV2-PERM-03, SFV2-PERM-04 |
| SV-8183 | Permission map (atoms + per-role matrix) | covered | SFV2-PERM-01, SFV2-PERM-02, SFV2-PERM-03, SFV2-PERM-04 |

## Reconciliation
- Spec stories: **21** · covered: **21** · UNCOVERED: **0** (none)
- Cases: **61** · every case anchor resolves to a real story/ticket: **YES**
- Extra epic children handled: **SV-8726** (PO 'Total Price'->'Total Cost') noted on SFV2-PO-01 (Story 14 PO pages); **SV-8734** (bulk approve/decline) covered by Story 8 (SFV2-BULK-05/06); **SV-8540** (Receive-all task) covered by bulk receive (Story 13); **4 Bugs** (SV-8495 Ready-to-Fix, SV-8497/8581/8680 Done) — correct behaviour covered by the stories, not authored as separate cases.
- **Story 10 (SV-9256, Bulk delete lines) is OUT OF SCOPE** — represented by one boundary negative (SFV2-BULK-08).
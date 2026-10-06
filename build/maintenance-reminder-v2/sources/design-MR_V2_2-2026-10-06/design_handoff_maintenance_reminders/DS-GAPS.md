# Shopview DS: what Maintenance Reminders needs and the system does not have

24 Sep 2026. Everything that exists in `components.css` is now used in the five pages: Button (primary, secondary, danger, sm), Badge (all tones, sm), Checkbox, Radio, Toggle, Tabs, Card, Modal shell with header, title and footer, Menu shell, Alert, Tooltip and the Header. What follows is still drawn by hand, because the system has no component for it. It lists what is needed, not a design.

## Forms
1. **Field with an external label.** `Input` and `Select` exist only with a floating label inside the border. Every form here puts the label above the field. About 200 fields.
2. **Compact inline select.** A 36px dropdown sitting inside a row of text, e.g. `every [30] [days ▾]` or `[at ▾] [January ▾]`. No label, width set by its content.
3. **Number field.** A short numeric input (76–126px) with an optional unit suffix (`mileage`, `hrs`).
4. **Date picker.** Already a known gap (`SV.GAPS`). Needed for Expiry date, Effective date and Work done.
5. **Combobox / type-ahead.** Already a known gap. Needed for compliance Type and work order search.
6. **File attachment field.** Already a known gap. Needed on the compliance history record.
7. **Read-only value field.** The greyed "current" value beside an editable "new" one (Enter a reading).

## Actions
8. **Icon button.** A square 28–32px button with an icon only: edit, kebab ⋮, close. No `sv-btn` variant covers it.
9. **Inline text action.** `+ Add service`, `Reset`, `Add reminder`: accent text with an optional icon, sitting in a row. `sv-btn--link` has padding and focus styling meant for a standalone button.

## Display
10. **Status dot / due marker.** The small amber dot after a service name on due-today rows.
11. **Numbered section marker.** The 20px grey circle with `1`, `2`, `3` beside form section titles.
12. **Chip (interval token).** Read-only rounded rectangles such as `15,000 mileage` · `or` · `3 months` in service rows. Not a badge: square corners, sunken fill, tabular numbers.
13. **Confidence meter.** The High / Medium / Low bar on the mileage estimate card.
14. **Description list / key–value rows.** `Facts` exists but only as a side-panel block. The work order left column needs a compact card version (Engine, VIN, Mileage, Licence plate).
15. **Tooltip without a title.** `Tooltip` requires a bold one-line label. The info icons here carry a single rule sentence. They currently use `sv-tt__sub` alone.

## Feedback
16. **Toggle warning state.** Consent off is drawn in warning amber. `Toggle` has only on, off and disabled. The two instances now use the standard blue "on" look.
17. **Toast placement in a frame.** `sv-toast` is 400px and meant to be fixed on screen. It needs a positioned variant for artboards (Invoice created).

## Product screens
18. **Work order detail layout.** The left column of cards (Work Order, Customer, Asset, Financial Info), the text tab bar with the blue active tab, and the line table with Actual/Estimate, Progress, Status, Action, Rate, Margin, Total. None of it is in the system. `Template - Detail View` does not match the real work order.
19. **Settings side navigation.** `SettingsSidebar` (DEV TOOLS / SETTINGS groups with icons). `SidePanel` is a filter panel, not a navigation list.
20. **Menu rows with a description.** A menu row with a second line of text (e.g. Start from a template). `MenuRow` has a label only.

## Things that changed size by adopting the system
- Buttons: 40px became 36px (md). Buttons at 28–32px became `sm` (32px), including the work order `New Line` (was 28px, radius 4).
- Checkboxes: 14–18px became 16px, with the tinted checked state. The 17px solid-blue checks are gone.
- Toggles: 40×22 became 36×20.

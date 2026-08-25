# Surface matrix — Printer Friendly Work Orders
Single trigger surface: Work Order Detail → More menu → Print Work Order. Output surface: the browser
print view (print-media rendering of the work order detail page).

| Surface | What is tested | Covered by |
|---|---|---|
| More menu (WO toolbar) | menu item presence, label, position, enable/disable, statuses, desktop+mobile | Area 01 |
| Print view — header | WO number/status, customer/vehicle/advisor/tech/date, empties omitted, shop name, placeholders | Area 02 |
| Print view — line items | fields, parts, no pricing, no action/progress cols, order, cancelled, separation, empties | Area 03 |
| Print view — summary/footer | time totals, no pricing, timestamp, per-page WO number | Area 04 |
| Print view — formatting | chrome hidden, black-on-white, font size, portrait, plain badges, landscape | Area 05 |
| Audit history / History tab | print event logged with user+time, visible, cancel still logs, multiple entries | Area 06 |

No PDF/email surface (explicitly out of scope). Pricing never appears on any surface.

# SV-12041 — Returns: part at 0 with its core shows a misleading "bin locations" warning (6 Nov 2026)
Not accounting (Product Area Parts). No Powertools plan. QA assignee empty. Defaults: API mode, no recording, no technical section.
Handoff: Slavcho 80333 (sv12041). Description (Chris rewrite, 80252) = the expected wording, verbatim:
- part at 0 with its core on the return: "{part number} has a return quantity of 0, a core cannot be returned on its own: a core becomes returnable after the part is used on a work order or part sale. Set a return quantity for the part, or remove it from this return."
- any other line at 0: "Enter a return quantity above 0 for {part number}, or remove it from this return."
- several lines at 0 -> names the first one. Return still refused, nothing saved. All lines > 0 saves as today.
**Open point to check:** Slavcho 80333: "A part without bin locations at 0 never reaches these messages. Its Quantity field shows its own inline error, as before" vs description "Any other line at 0" -> message. On production every inventory part has a bin; the bin-less line is the free-typed (not-in-inventory) row: Part Number empty, Description/Quantity/Price inputs (`input_manual_return_part_*`).

## Production BEFORE (v26.45.2-864113d, Trucks Hill 2) — on screen, Parts > Returns > Create Return
- 1238214 (A428, vendor Limited View, bin FAS 4 = 30, core $10): part 0 + core 1 > Save Return -> red toast **"Each part with bin locations must have a return quantity greater than 0"**, no request sent, stays on Create Return (ev/prod-p1-core-saved.png).
- 1238213 (A427, vendor gfhfghg, bin FAS 3, no core) at 0 -> same toast (ev/prod-p2-nocore-saved.png).
Nothing saved on production (no request).

## QA branch: BLOCKED 6 Nov ~15:20 UTC — shared .qa.shopview.com cookies expired (quick-login 401 sso_required). Asked the QA lead for fresh ones. Branch back end awake (login 401 = up).

## QA branch sv12041 (build v26.45.2-11fd956), 6 Nov 2026 ~16:00-16:40 UTC — fresh QA cookies from the QA lead
| # | Case (Parts > Returns > Create Return, vendor Hester & Sons) | Branch result | Production |
|---|---|---|---|
| 1 | 895-PK (core $10, bin A2CF) at 0, core 1 | toast: "895-PK has a return quantity of 0, a core cannot be returned on its own: a core becomes returnable after the part is used on a work order or part sale. Set a return quantity for the part, or remove it from this return." — no request | old "bin locations" toast |
| 2 | P550848 (no core, bin H3B) at 0 | "Enter a return quantity above 0 for P550848, or remove it from this return." — no request | old toast |
| 3 | P550848 + 895-PK both 0 (core 1) | names P550848 (first) | — |
| 4 | 895-PK + P550848 both 0 (core 1) | names 895-PK with the core message (first) | — |
| 5 | 895-PK with TWO bins (A2CF, A1A added by cycle count) both 0, core 1 | core message | — |
| 6 | two bins: A2CF 0, A1A 1, core 1 | "Manual Return created successfully", 201 manual-return-request/create | — |
| 7 | all lines above 0 (P550848 1, 895-PK 1, core 1) | saved (Hester & Sons, $63.94, qty 3) — NOTE: saved by mistake by a discovery run (script treated SAVE=0 as true); it is the ticket's "every line above 0 saves" check anyway | — |
| 8 | part 0 + core 0 / part 1 + core 0 | core Quantity box: "Quantity cannot be lower than 0.01", no request | same |
| 9 | typed-in line (description only) at 0 | Quantity box: "Quantity cannot be lower than 0.01" | same |
Refused saves send no request and change no stock. Another manual return today (5 Star Truck Repair, 895-PK + core, $10.42) is NOT mine (likely the developer's).
**Open (Rule 97d / 109c — asked the QA lead):** description says "Any other line at 0" -> message; Slavcho 80333 says lines without bin locations keep their inline error. Rows 8-9 match Slavcho and are unchanged from production.

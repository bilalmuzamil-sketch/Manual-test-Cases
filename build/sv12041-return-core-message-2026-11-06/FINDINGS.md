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

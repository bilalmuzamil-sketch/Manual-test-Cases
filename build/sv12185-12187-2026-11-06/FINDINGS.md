# SV-12185 + SV-12187 — 6 Nov 2026 (API mode, no recording, no technical section — QA lead ruling)
Both tickets had QA assignee Mudassir Qamar; QA lead explicitly asked for them to be tested.

## SV-12185 — duplicate customer name shows 2 toasts → PASSED (comment 80304), label QAcomplete, QA Complete
Branch sv12185 v26.45.2-b7be383; production v26.45.1-753355c (before). Screen-driven (cust.mjs).
| # | Case | Prod | Branch |
|---|---|---|---|
| 1 | New Customer, existing name "4 Star Truck Repair" (prod: "aa") | 2 red toasts (same ms) | 1 red toast "Company with provided name already exists…" |
| 2 | Same, upper case | 2 | 1 |
| 3 | not created, dialog stays open | yes | yes |
| 4 | Edit customer (pencil `button_base`) → rename to existing | 2 | 1 (POST /api/customers/change 400) |
| 5 | valid create | saves | saves |
| 6 | valid edit | saves | saves |
Observation (bucket c — explained, not a defect): on QA branches (sv12185, sv12187) clicking Save within ~1.5–3 s of opening Edit Customer sends nothing; at 4 s it saves. Production saves at 1.5 s. On the branches the Google geocode search never runs (prod runs it ~0.7 s), so the dialog is still waiting; same on an unrelated branch (sv12187) → QA-environment, not this fix. Evidence ev/*-early-*.json.

## SV-12187 — Enter in Qty of the inline Add Part row
Branch sv12187 v26.45.2-ef57078; production v26.45.1-753355c; sv11788 v26.43.5-9596ea9.
- Branch: Enter in Qty/Description/Cost/Sell price/Part number and the Save button all save ("Part added", make-request) and open a new row with the cursor in Part number — 6/6 fields (enter.mjs), keyboard path a/b (kbd.mjs), Needs-Approval line, existing inventory part number, fast typing, slowed part search, 1440x900, mouse path, Enter-in-part-number-then-Qty path. Empty Qty + Enter sends nothing (both builds).
- Production and sv11788: the reported failure did NOT reproduce on my set-up in 16 tries / 7 variants (same list as above).
- Bundle diff (WorkOrderLineParts): prod row Enter handler `ca=e=>{ne.value||en(e)}` — Enter ignored anywhere in the row while the part-number suggestion list is open (`ne` set by onPopupShow/onPopupHide). Branch `pn=e=>{ae.value&&cn(e)||ea(e)}` — ignored only when the target is inside the part-number typeahead. So the fix matches the described symptom; the condition is the suggestion list still open while in Qty.
- Mudassir passed it on sv12187 (comment 80302, 6 Nov 03:04 CDT) incl. "Picked PP804396 from the dropdown with the mouse (dropdown left open) → Qty 2 → Enter: saves" and moved it to Ready for Production with QAComplete labels — done before my verdict was ready. NOT posted a second comment (would duplicate). Exhibit prepared: ev/exh-12187.png (not uploaded).
- Side observation (bucket c): "Mileage is a required field" appears in the left panel on QA branches after a part saves; QA org setting requireMileage=true (prod false) — configuration, not a defect.
- sv12187 stopped answering ~08:40 UTC; wake service returns "Internal Server Error" (probably torn down after Ready for Production).

Pre-post gate (SV-12185): build marker re-read b7be383 before posting; ticket TESTING QA, no new comments; image is a real attachment (read back in the comment echo); text human, no fingerprint; transition to QA Complete confirmed by re-read.
Learning check: (1) a dialog's Save on QA branches can be blocked by the geocoder not running — wait for the dialog to settle before concluding "Save does nothing" (playbook); (2) re-read the ticket immediately before posting — SV-12187 was passed by its assignee mid-test (Rule 103 caught it).

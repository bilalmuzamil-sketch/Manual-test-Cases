# SV-12039 — Inventory part switches to Vendor/Order when the quantity is entered (IN PROGRESS, 4 Nov 2026)
Ticket: Bug, TESTING QA, assignee Slavcho Mitrov, no `accounting` label, QA Assignee empty -> clear to test. No developer handoff.
Customer: Cesar Ramirez, CT Truck and Trailer Shop (Intercom). Part "LAMP - HEADLIGHT, HALOGEN, FOAM GROMMET, RIGHT HAND".
QA lead (4 Nov): API mode, no recording, no technical section.
Builds: branch sv12039 v26.45.0-9b141c4 (last-mod Tue 03 Nov 13:55:53 GMT); production v26.45.0-8e138e1 (09:59:25 GMT).

## Sources read
- Description + acceptance criteria (keep Inventory/Pick when stock is enough; no switch to Vendor/Order on quantity; Pick shown;
  legitimate ordering of out-of-stock parts not affected). No comments.
- Attachments: Intercom transcript (customer says the part number IS "LAMP - HEADLIGHT, HALOGEN, FOAM GROMMET, RIGHT HAND"; the
  LEFT HAND one is A66-01512-004) and the 18.7 s screen video (frames in /tmp only). Video: line right-click menu > Request part >
  paste into Part Number > pick the "Inventory Qty: 1 EA" option > Source Inventory + bin table (AZ Terminal, 1 in stock) > the moment
  focus leaves Part Number, Source flips to Vendor, bin table goes, plain Quantity box appears.

## What triggers it (found by comparing the front-end code, production vs branch — PartSelect)
When focus leaves the Part Number box, the picker compares the box's text with the selected part's part number. Production compares
them exactly; the branch first removes line breaks (`replace(/[\r\n]/g,"")`) from both. A part number that contains a line break can
never match the one-line text box, so production "detaches" the selection into a new part to order from a vendor.
=> The customer's part number very likely holds a hidden line break (imported data). Reproduced below with seeded part numbers
   containing a line break; normal part numbers never trigger it (tried long names with commas, short numbers, Tab/Enter/click).

## Test data (left in place, ZZAUTOTEST)
Production (Trucks Hill 2): WO S2-1917 (e4072e29…), line e3c567cd…; parts (1 in stock each, bin Location57):
 "ZZ12039 LAMP - HEADLIGHT, HALOGEN, FOAM GROMMET, RIGHT HAND" 5437ebf7 · "ZZ12039-RH" ca02b406 · "ZZ12039-NL-END\n" d3074237 ·
 "ZZ12039 LAMP - HEADLIGHT,\r\nRIGHT HAND" 3c339691.
Branch (Heavy Duty): WO S12039-17581 (f6475634…), line d6caff65…; same four parts 6074cef0 · 2d988fc4 · 38b4f487 · c1934d46 (bin BCAB).
The line breaks were put into the part numbers through the back end (the parts screen's one-line box cannot hold one) — set-up only.

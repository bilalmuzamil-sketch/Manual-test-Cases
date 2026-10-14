
### D1 — List row click opens the work order preview panel; row switch; same row toggles closed (19.1 s)

- 1. load the Details board (List is the default display) · new text (0):  · shot `D1-01.png`
- 2. click the List row S1-680 (Customer cell) · new text (212): @aria-label: Close preview; @aria-label: Loading work order; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Fibrook Equipment · TRK-077 · 2015 Volvo VNL; Open Work Order (+205 inside the embedded page) · shot `D1-02.png`
  - check: preview panel present immediately after the click → `True`
  - check: loading skeleton 'Loading work order' shown while the embedded page loads → `False`
- 3. wait for the embedded work order page to load · new text (10):  (+10 inside the embedded page) · gone 136 · shot `D1-03.png`
  - check: skeleton gone after load → `True`
  - check: panel header shows S1-680 → `True`
  - check: panel subtitle 'Fibrook Equipment · TRK-077 · 2015 Volvo VNL' → `True`
  - check: panel width (wide default = 960px) → `960`
  - check: clicked row highlighted (cells carry the selection mark) → `True`
- 4. click another row, S1-354 · new text (14): Northline Haulage · TRK-512 · 2020 Volvo VNL 760 (+13 inside the embedded page) · gone 10 · shot `D1-04.png`
  - check: header now S1-354 → `True`
  - check: embedded Lines tab badge = 4 (S1-354 has four demo lines) → `4`
- 5. click S1-354 again (the open row) · new text (0):  · gone 90 · shot `D1-05.png`
  - check: panel closed by clicking the open row again → `True`
- 6. click S1-511 (Invoiced) row · new text (85): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Fisquare Farms · John Deere 6120M; Open Work Order (+79 inside the embedded page) · shot `D1-06.png`
- 7. press Escape · new text (0):  · gone 85 · shot `D1-07.png`
  - check: Escape closes the panel → `True`
- 8. click S1-360 (Imported) row · new text (87): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Hard Rock Industries LLC · TRK-301 · 2021 Kenworth T680; Open Work Order (+81 inside the embedded page) · shot `D1-08.png`
  - check: Imported work order opens in the preview too → `True`
- 9. click 'Open Work Order' in the panel header · new text (2): @aria-label: Dismiss; Opening S1-360 · shot `D1-09.png`
  - check: toast 'Opening S1-360' shown → `True`
- 10. click the X (aria 'Close preview', title 'Close (Esc)') · new text (0):  · gone 87 · shot `D1-10.png`
  - check: X closes the panel → `True`

### D2 — Preview panel vs other controls: row menu, view switch, Tech View rows, Board cards (163.6 s)

- 1. hover row S1-702 to reveal its '…' button · new text (0):  · shot `D2-01.png`
- 2. click the row's '…' (Reassign Lead Tech) button · new text (2): Reassign Lead Tech; Unassign · shot `D2-02.png`
  - check: row menu opened, preview NOT opened → `True`
- 3. choose 'Reassign Lead Tech' in the menu · new text (11): 0 open; 1 open; 2 open; 3 open; 4 open; @aria-label: Close; @placeholder: Search technicians; CW; Cameron Williamson; Cancel; S1-702 · Fibridge Commercial · gone 1 · shot `D2-03.png`
- 4. type 'zzz' in 'Search technicians' · new text (1): No technicians match “zzz” · gone 7 · shot `D2-04.png`
- 5. clear search and type 'Ral' · new text (1): 3 open · gone 1 · shot `D2-05.png`
- 6. pick Ralph Edwards · new text (3): @aria-label: Dismiss; S1-702 lead technician set to Ralph Edwards; Undo · gone 6 · shot `D2-06.png`
- 7. click Undo in the toast · new text (1): Assignment undone · gone 2 · shot `D2-07.png`
- 8. open preview on S1-702 · new text (90): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Fibridge Commercial · TRK-118 · 2022 Freightliner M2; Open Work Order (+84 inside the embedded page) · gone 2 · shot `D2-08.png`
- 9. switch to 'By Lead Tech' with the preview open — **step error:** Locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator("button[aria-label=\"By Lead Tech\"], button[title=\"By Lead Tech · new text (0):  · shot `D2-09.png`
  - check: preview hidden in Tech View → `False`
- 10. click a Tech View row (S1-644 number cell) — **step error:** Locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator("[data-wo=\"S1-644\"]").first
 · new text (0):  · shot `D2-10.png`
  - check: no preview / nothing opens from a Tech View row → `False`
- 11. switch to 'Board' — **step error:** Locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator("button[aria-label=\"Board\"], button[title=\"Board\"]").first
   · new text (0):  · shot `D2-11.png`
- 12. click a Board card (S1-354) away from its '…' button — **step error:** Locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator("[data-wo=\"S1-354\"]").first
 · new text (0):  · shot `D2-12.png`
  - check: no preview / nothing opens from a Board card → `False`
- 13. switch back to 'Table' — **step error:** Locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator("button[aria-label=\"Table\"], button[title=\"Table\"]").first
   · new text (0):  · shot `D2-13.png`
  - check: preview state on return to Table (was open before the switch) → `True`

### D3 — Inside the preview: embedded work order page tabs and controls (editable, peek=1 not passed) (13.6 s)

- 1. open preview on S1-354 · new text (90): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Northline Haulage · TRK-512 · 2020 Volvo VNL 760; Open Work Order (+84 inside the embedded page) · shot `D3-01.png`
  - check: embedded page URL → `http://127.0.0.1:40155/wo-details/Add%20Part.html?embed=1`
  - check: embedded page is in editable mode (no is-peek class) → `True`
  - check: Approve/Decline line buttons visible inside the preview → `True`
  - check: 'New Line' visible inside the preview → `True`
  - check: lead technician on the Overview = Brenda Martinez → `
            Lead Technician
            BMBrenda Martinez
          `
- 2. click embedded tab 'Overview' · new text (51):  (+51 inside the embedded page) · gone 70 · shot `D3-02.png`
- 3. click embedded tab 'Lines' · new text (70):  (+70 inside the embedded page) · gone 51 · shot `D3-03.png`
- 4. click embedded tab 'Parts' · new text (0):  · gone 75 · shot `D3-04.png`
- 5. click embedded tab 'Notes' · new text (0):  · shot `D3-05.png`
- 6. click embedded tab 'Stats' · new text (47):  (+47 inside the embedded page) · shot `D3-06.png`
- 7. click embedded tab 'Finance' · new text (116):  (+116 inside the embedded page) · gone 44 · shot `D3-07.png`
- 8. click embedded tab 'Lines' · new text (74):  (+74 inside the embedded page) · gone 118 · shot `D3-08.png`
- 9. click 'Approve' on line 1 (embedded) · new text (6):  (+6 inside the embedded page) · shot `D3-09.png`
- 10. click 'Add Part' in line 1 (embedded) · new text (20):  (+20 inside the embedded page) · gone 1 · shot `D3-10.png`

### D4 — Add Part.html opened as the peek page (?embed=1&peek=1) — the read-only mode the file defines (11.3 s)

- 1. load Add Part.html?embed=1&peek=1 · new text (0):  · shot `D4-01.png`
  - check: body has is-peek → `True`
  - check: hidden in peek mode: Add Deposit / Create Invoice group → `True`
  - check: hidden in peek mode: Approve line → `True`
  - check: hidden in peek mode: New Line → `True`
  - check: hidden in peek mode: Add Part → `True`
  - check: hidden in peek mode: time clock → `True`
- 2. open embedded 'Overview' tab · new text (53): $1,393.00; $10,715.39; $12,108.39; $5,501.94; $7,268.70; 2002 Kenworth T680; 243-406-8859; 245; 2GDJG31M3F4523491; 33%; 397,788; 545 · gone 65 · shot `D4-02.png`
- **D4b**
  - 1. load Add Part.html?embed=1 (what the Details board actually loads) · new text (0):  · shot `D4b-01.png`
    - check: Approve visible without peek=1 → `True`

### D5 — Prop variants of the Details board: peekWidth=narrow, overviewLayout=summary, dark theme (14.6 s)

- 1. open preview on S1-702 (narrow + summary variant) · new text (90): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Fibridge Commercial · TRK-118 · 2022 Freightliner M2; Open Work Order (+84 inside the embedded page) · shot `D5-01.png`
  - check: panel width (narrow = 720px) → `720`
- 2. embedded Overview tab (summary layout) · new text (51):  (+51 inside the embedded page) · gone 70 · shot `D5-02.png`
  - check: summary layout present (ov-merge) → `True`
- **D5b**
  - 1. dark theme: open preview on S1-702 · new text (90): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Fibridge Commercial · TRK-118 · 2022 Freightliner M2; Open Work Order (+84 inside the embedded page) · shot `D5b-01.png`
    - check: theme attribute → `system`

### W1 — Tech View: collapse a group, Collapse all / Expand all, group count tooltip (10.6 s)

- 1. switch to 'By Lead Tech' · new text (31): 0%; 1 part; 10%; 100%; 15%; 2 parts; 20%; 25%; 3 parts; 30%; 35%; 40% · gone 16 · shot `W1-01.png`
- 2. hover the Esther Howard group count · new text (1): 4 work orders · shot `W1-02.png`
- 3. click the Esther Howard group chevron (Collapse) · new text (1): @title: Expand · gone 23 · shot `W1-03.png`
- 4. click the header 'Collapse all' · new text (1): @title: Expand all · gone 144 · shot `W1-04.png`
- 5. click the header 'Expand all' · new text (166): $1,120.50; $1,275.40; $1,745.00; $1,915.00; $11,830.15; $12,004.80; $2,110.40; $2,380.00; $3,462.10; $4,780.65; $4,960.00; $410.00 · gone 2 · shot `W1-05.png`
- 6. type 'S1-455' in Search (Tech View) · new text (3): @aria-label: Clear search; @placeholder: Type to search; @title: Clear search · gone 168 · shot `W1-06.png`
- 7. type a no-match search 'zzzz' · new text (2): Check the spelling, or search by work order number, customer, unit or VIN.; No results for “zzzz” · gone 34 · shot `W1-07.png`

### W2 — Tech View: assign / reassign / unassign through the '…' menu and dialog; locked menu (52.2 s)

- 1. switch to 'By Lead Tech' · new text (31): 0%; 1 part; 10%; 100%; 15%; 2 parts; 20%; 25%; 3 parts; 30%; 35%; 40% · gone 16 · shot `W2-01.png`
- 2. hover Unassigned row S1-352 · new text (0):  · shot `W2-02.png`
- 3. click its '…' (Assign Tech) · new text (1): Assign Tech · shot `W2-03.png`
- 4. choose 'Assign Tech' · new text (9): 0 open; 1 open; 2 open; 3 open; 4 open; @aria-label: Close; @placeholder: Search technicians; Cancel; S1-352 · Fibrook Equipment · shot `W2-04.png`
- 5. type 'zzz' · new text (1): No technicians match “zzz” · gone 5 · shot `W2-05.png`
- 6. type 'Kri' · new text (1): 4 open · gone 1 · shot `W2-06.png`
- 7. pick Kristin Watson · new text (3): @aria-label: Dismiss; S1-352 assigned to Kristin Watson; Undo · gone 6 · shot `W2-07.png`
- 8. hover S1-352 (now under Kristin) · new text (0):  · shot `W2-08.png`
- 9. '…' → Unassign · new text (1): S1-352 moved to Unassigned · gone 1 · shot `W2-09.png`
- 10. hover Invoiced S1-511 · new text (0):  · shot `W2-10.png`
- 11. click its '…' (locked) · new text (3): Invoiced · can’t be reassigned; Reassign Lead Tech; Unassign · shot `W2-11.png`
- 12. click 'Reassign Lead Tech' in the locked menu · new text (0):  · shot `W2-12.png`
  - check: no dialog opened from a locked menu → `True`
- 13. hover the lock icon on S1-511 — **step error:** Locator.hover: Timeout 30000ms exceeded.
Call log:
  - waiting for locator("[data-wo=\"S1-511\"] [data-tip]").first
    - locator resolved t · new text (0):  · gone 3 · shot `W2-13.png`
- 14. press Escape / click outside · new text (0):  · gone 3 · shot `W2-14.png`
- 15. open S1-702 '…' → Reassign → pick the current lead (Esther Howard) · new text (0):  · shot `W2-15.png`
- 16. open S1-702 '…' → Reassign → pick crew member Ralph Edwards · new text (3): @aria-label: Dismiss; S1-702 lead technician set to Ralph Edwards; Undo · shot `W2-16.png`
- 17. Undo · new text (1): Assignment undone · gone 2 · shot `W2-17.png`

### W3 — Board View: drag allowed, drag refused (locked / no permission), reorder, column drag, pin limit (21.7 s)

- 1. switch to 'Board' · new text (59): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 3.5 hrs; 0.0 / 7.5 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 7.5 hrs; 0.8 / 8.0 hrs; 1.2 / 4.0 hrs · gone 86 · shot `W3-01.png`
- 2. drag S1-352 (Unassigned) onto Esther Howard's column header · new text (3): @aria-label: Dismiss; S1-352 assigned to Esther Howard; Undo · gone 1 · shot `W3-02.png`
- 3. Undo · new text (2): 6; Assignment undone · gone 2 · shot `W3-03.png`
- 4. drag S1-511 (Invoiced, locked) toward Ralph Edwards' column (hover, refused) · new text (0):  · shot `W3-04.png`
- 5. release the refused drag · new text (0):  · shot `W3-05.png`
- 6. HTML5 drag S1-511 onto Ralph Edwards' header (drop refused) · new text (0):  · gone 2 · shot `W3-06.png`
  - check: S1-511 still in Jenny Wilson's column → `True`
- 7. reorder within Esther: drag S1-341 onto S1-644 · new text (0):  · shot `W3-07.png`
- 8. drag the Kristin Watson column header before Ralph Edwards · new text (0):  · shot `W3-08.png`
- 9. pin column esther · new text (5): @aria-label: Dismiss; @aria-label: Unpin column; @title: Drag to reorder pinned columns; @title: Unpin column; Esther Howard pinned · shot `W3-09.png`
- 10. pin column ralph · new text (1): Ralph Edwards pinned · gone 1 · shot `W3-10.png`
- 11. pin column jenny · new text (1): Jenny Wilson pinned · gone 1 · shot `W3-11.png`
- 12. pin column theresa · new text (1): Theresa Webb pinned · gone 1 · shot `W3-12.png`
- 13. pin column kristin · new text (3): @aria-label: Up to 5 pinned columns; @title: Up to 5 pinned columns; Kristin Watson pinned · gone 3 · shot `W3-13.png`
- 14. pin column cameron · new text (1): Up to 5 pinned columns — unpin one first · gone 1 · shot `W3-14.png`
- 15. hover the pin of the 6th technician (Brenda) when 5 are pinned · new text (0):  · shot `W3-15.png`
- 16. click unpin on Esther · new text (3): @aria-label: Pin column; @title: Pin column; Esther Howard unpinned · gone 3 · shot `W3-16.png`
- 17. drag the minimap thumb · new text (0):  · gone 2 · shot `W3-17.png`

### W4 — Toolbar menus: Columns (search / no match / Show all / Reset), Row height, Card size, Status filter, empty state (51.3 s)

- 1. open Columns (List) · new text (11): 17; @placeholder: Find a column; Auth; Columns; Days open; Invoiced Date; Reset to default; Returns; Show all; of; shown · shot `W4-01.png`
- 2. type 'zzz' in 'Find a column' · new text (1): No columns match · gone 4 · shot `W4-02.png`
- 3. type 'unit' · new text (0):  · gone 1 · shot `W4-03.png`
- 4. clear find, click 'Show all' · new text (16): 0/2; 1/1; 14; 15/21; 2/2; 2/3; 21; 28; 3/9; 6/6; Apr 20, 2026; Auth · shot `W4-04.png`
- 5. click 'Reset to default' · new text (0):  · gone 12 · shot `W4-05.png`
- 6. press Escape · new text (0):  · gone 11 · shot `W4-06.png`
- 7. open Row height (List) · new text (4): Large; Medium; Row height; Small · shot `W4-07.png`
- 8. choose Large · new text (17): 0.0 / 1.5 hrs; 0.0 / 3.0 hrs; 0.0 / 4.5 hrs; 0.0 / 6.0 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 6.0 hrs; 0.8 / 5.3 hrs; 1.2 / 4.8 hrs; 1.2 / 6.0 hrs; 1.4 / 4.7 hrs; 2.2 / 5.4 hrs · gone 4 · shot `W4-08.png`
- 9. switch to By Lead Tech; open Columns · new text (37): 0%; 1 part; 10%; 100%; 15%; 2 parts; 20%; 25%; 3 parts; 30%; 35%; 40% · gone 32 · shot `W4-09.png`
- 10. press Escape; switch to Board; open Card size · new text (47): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 3.5 hrs; 0.0 / 7.5 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 7.5 hrs; 0.8 / 8.0 hrs; 1.2 / 4.0 hrs · gone 93 · shot `W4-10.png`
- 11. choose Compact · new text (0):  · gone 61 · shot `W4-11.png`
- 12. open Status filter and choose Paid — **step error:** Locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for get_by_text("Paid", exact=True).last
    - locator resolved to <span clas · new text (3): Clear selection; Complete; Review · shot `W4-12.png`
- 13. press Escape; search 'zzzz' (filters + search → empty) · new text (5): @aria-label: Clear search; @placeholder: Type to search; @title: Clear search; Check the spelling, or search by work order number, customer, unit or VIN.; No results for “zzzz” · gone 106 · shot `W4-13.png`
- 14. click 'Clear all filters' if offered — **step error:** Locator.click: Timeout 3000ms exceeded.
Call log:
  - waiting for get_by_text("Clear all filters").first
 · new text (0):  · shot `W4-14.png`
- 15. press Ctrl+K (global search) · new text (44): $4,180.20; 12; 2017 Komatsu PC210; 2022 Peterbilt 579; 2025 Freightliner M2; 3; 45836; 923 Ross Islands, X1T 2B1; @placeholder: Search work orders, customers, parts and more; Adale Transport; Add new line; Approved · shot `W4-15.png`
- 16. type 'S1' in global search · new text (31): "; -472 Fibrook Equipment; -498 Fibridge Mining; -511 Fisquare Farms; -578 Fibridge Commercial; -644 Fibridge Commercial; 2014 Caterpillar 336F; 2016 John Deere 6155M; 2019 Freightliner Cascadia; 2020 Kenworth T680; 2021 Ford F-550; AI · gone 36 · shot `W4-16.png`

### W5 — Review-frame empty states via prop variants: no technicians / no work orders / nothing; canAssign off (27.5 s)

- **variant no-technicians**
  - 1. emptyState=no-technicians: switch to By Lead Tech · new text (16): 0%; 2 parts; @aria-label: Declined · can’t be reassigned; @aria-label: Imported · review before assigning; @title: Collapse; @title: Collapse all; @title: Declined · can’t be reassigned; @title: Drag to reorder technicians; @title: Imported · review before assigning; @title: Priority; Add Technician; Add technicians to assign work orders. Until then, every work order stays in Unassigned. · gone 124 · shot `W5-no-technicians-01.png`
  - 2. click 'Add Technician' / 'New Work Order' if shown · new text (2): @aria-label: Dismiss; Opening Add Technician · shot `W5-no-technicians-02.png`
  - 3. switch to Board · new text (12): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 7.5 hrs; @title: Card size; TRK-077 · 2019 Peterbilt 579; TRK-301 · 2021 Kenworth T680; TRL-118 · 2017 Wabash Dry Van; TRL-220 · 2015 Utility Reefer; TRL-903 · 2013 Great Dane Reefer · gone 36 · shot `W5-no-technicians-03.png`
- **variant no-work-orders**
  - 1. emptyState=no-work-orders: switch to By Lead Tech · new text (4): Create a work order and assign a technician to see it here.; Department; No work orders yet; Technician · gone 188 · shot `W5-no-work-orders-01.png`
  - 2. click 'Add Technician' / 'New Work Order' if shown · new text (2): @aria-label: Dismiss; Opening New Work Order · shot `W5-no-work-orders-02.png`
  - 3. switch to Board · new text (1): @title: Card size · gone 2 · shot `W5-no-work-orders-03.png`
- **variant nothing**
  - 1. emptyState=nothing: switch to By Lead Tech · new text (5): Add Technician; Add technicians and create your first work order to track work by tech.; Department; Nothing here yet; Technician · gone 188 · shot `W5-nothing-01.png`
  - 2. click 'Add Technician' / 'New Work Order' if shown · new text (2): @aria-label: Dismiss; Opening Add Technician · shot `W5-nothing-02.png`
  - 3. switch to Board · new text (1): @title: Card size · gone 2 · shot `W5-nothing-03.png`
- **variant canAssign=false**
  - 1. canAssign=false: switch to Board · new text (51): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 3.5 hrs; 0.0 / 7.5 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 7.5 hrs; 0.8 / 8.0 hrs; 1.2 / 4.0 hrs · gone 90 · shot `W5-noassign-01.png`
  - 2. HTML5 drag S1-352 onto Esther's header (refused: no permission) · new text (0):  · shot `W5-noassign-02.png`
    - check: S1-352 still in Unassigned → `True`

### A1 — Add Part page: add-part row validation, discard confirm, More options form, approve with Undo, fee dialog (40.9 s)

- 1. click '+ Add Part' on line 1 · new text (20): $; @title: Cancel; @title: Open the full part form (Shift+Enter); Category; Cost; Description; Enter; Esc; More options; Part number; Qty; Save · shot `A1-01.png`
- 2. click Save with empty fields · new text (1): Enter a description, qty, cost and sell price to save this part. · shot `A1-02.png`
- 3. type 'zz' in Description, click the X (cancel) · new text (4): Discard Part; Discard this part?; Keep Editing; The details you entered will be lost. · shot `A1-03.png`
- 4. click 'Keep Editing' · new text (0):  · gone 4 · shot `A1-04.png`
- 5. click 'More options' — **step error:** Locator.click: Error: strict mode violation: get_by_text("More options") resolved to 2 elements:
    1) <button type="button" class="ap-more · new text (0):  · shot `A1-05.png`
- 6. type 'LF' in Part number — **step error:** Locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator("#npNumber")
    - locator resolved to <input type="text" id="npNu · new text (0):  · shot `A1-06.png`
- 7. press Escape twice (discard prompt, then Discard Part) · new text (0):  · gone 21 · shot `A1-07.png`
- 8. click Approve on line 1 · new text (6): @title: Close; @title: Start time clock; Approved; Complete; Line approved; Undo · gone 4 · shot `A1-08.png`
- 9. Undo in toast · new text (4): @title: Approve; @title: Approve the line to start the clock; @title: Decline; Needs Approval · gone 6 · shot `A1-09.png`
- 10. open the page '…' menu → 'Add Fee / Discount' · new text (14): $; @title: Close; Add; Add new fee/discount; Amount; Apply from template; Calculation type; Cancel; Fee / Discount; Max cap; Name; New Work Order Total · shot `A1-10.png`
- 11. Cancel · new text (0):  · gone 14 · shot `A1-11.png`

### D2b — Preview open: is the display switcher reachable? Tech View rows / Board cards after closing the preview (16.2 s)

  - check: before opening: 'By Lead Tech' switcher reachable → `reachable`
- 1. open preview on S1-702 · new text (90): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Fibridge Commercial · TRK-118 · 2022 Freightliner M2; Open Work Order (+84 inside the embedded page) · shot `D2b-01.png`
  - check: with the preview open at 1440x900: 'Table' control → `covered by the preview panel (aside)`
  - check: with the preview open at 1440x900: 'By Lead Tech' control → `covered by the preview panel (aside)`
  - check: with the preview open at 1440x900: 'Board' control → `covered by the preview panel (aside)`
  - check: with the preview open at 1440x900: 'Columns' control → `covered by the preview panel (aside)`
  - check: with the preview open at 1440x900: 'Row height' control → `covered by the preview panel (aside)`
  - check: with the preview open at 1440x900: 'New Work Order' control → `no button`
  - check: 'New Work Order' button reachable (by text) → `covered`
- 2. press Escape to close the preview · new text (0):  · gone 90 · shot `D2b-02.png`
- 3. switch to 'By Lead Tech' · new text (31): 0%; 1 part; 10%; 100%; 15%; 2 parts; 20%; 25%; 3 parts; 30%; 35%; 40% · gone 16 · shot `D2b-03.png`
- 4. click a Tech View row (S1-644), away from its controls · new text (0):  · shot `D2b-04.png`
  - check: no preview opens from a Tech View row → `True`
  - check: no navigation / toast from a Tech View row click → `0`
- 5. switch to 'Board' · new text (44): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 3.5 hrs; 0.0 / 7.5 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 7.5 hrs; 0.8 / 8.0 hrs; 1.2 / 4.0 hrs · gone 86 · shot `D2b-05.png`
- 6. click a Board card (S1-354) away from its '…' button · new text (0):  · shot `D2b-06.png`
  - check: no preview opens from a Board card → `True`
  - check: no toast from a Board card click → `0`
- 7. switch back to 'Table' · new text (86): %; 0:24; 0:36; 0:48; 10; 100; 11; 12; 15; 1:12; 1:25; 1FD0W5HY2EEA05499 · gone 59 · shot `D2b-07.png`
  - check: preview stays closed → `True`
- 8. open preview on S1-702 then switch to Board via keyboard-free route: close X first · new text (90): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Fibridge Commercial · TRK-118 · 2022 Freightliner M2; Open Work Order (+84 inside the embedded page) · shot `D2b-08.png`
- 9. resize to 1920 wide · new text (0):  · shot `D2b-09.png`
  - check: at 1920 wide with preview open: 'Table' → `covered by the preview panel (aside)`
  - check: at 1920 wide with preview open: 'By Lead Tech' → `covered by the preview panel (aside)`
  - check: at 1920 wide with preview open: 'Board' → `covered by the preview panel (aside)`

### W3b — Refused drag message (denied pill) during a drag: locked status and no permission (17.0 s)

- 1. switch to 'Board' · new text (59): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 3.5 hrs; 0.0 / 7.5 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 7.5 hrs; 0.8 / 8.0 hrs; 1.2 / 4.0 hrs · gone 86 · shot `W3b-01.png`
- 2. start dragging Invoiced S1-511 and hold it over Ralph Edwards' column · new text (1): Invoiced · can’t be reassigned · shot `W3b-02.png`
- 3. end the drag · new text (0):  · gone 1 · shot `W3b-03.png`
- 4. start dragging Declined S1-359 over Esther Howard's column · new text (1): Declined · can’t be reassigned · shot `W3b-04.png`
- 5. end the drag · new text (0):  · gone 1 · shot `W3b-05.png`
- 6. start dragging Imported S1-360 over Esther Howard's column · new text (1): Imported · review before assigning · shot `W3b-06.png`
- 7. end the drag · new text (0):  · gone 1 · shot `W3b-07.png`
- 8. start dragging Approved S1-352 over Esther Howard's column (allowed: blue drop line, no message) · new text (0):  · shot `W3b-08.png`
- 9. end the drag · new text (0):  · shot `W3b-09.png`
- 10. Tech View: hover the lock on S1-511 · new text (87): 0%; 0:24; 0:36; 0:48; 1 part; 10%; 100%; 11; 12; 15%; 1:12; 1:25 · gone 44 · shot `W3b-10.png`
- **W3c canAssign=false**
  - 1. canAssign=false: switch to 'Board' · new text (51): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 3.5 hrs; 0.0 / 7.5 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 7.5 hrs; 0.8 / 8.0 hrs; 1.2 / 4.0 hrs · gone 90 · shot `W3c-01.png`
    - check: no '…' menu buttons on cards → `0`
  - 2. start dragging S1-352 over Esther Howard's column · new text (1): You don’t have permission to assign technicians · shot `W3c-02.png`

### W4b — Filters + search empty state (Status filter applied, then a no-match search); Clear all filters (16.0 s)

- 1. switch to 'By Lead Tech' · new text (31): 0%; 1 part; 10%; 100%; 15%; 2 parts; 20%; 25%; 3 parts; 30%; 35%; 40% · gone 16 · shot `W4b-01.png`
- 2. open the Status filter · new text (3): Clear selection; Complete; Review · shot `W4b-02.png`
- 3. tick 'Approved' · new text (0):  · gone 3 · shot `W4b-03.png`
- 4. press Escape · new text (0):  · shot `W4b-04.png`
- 5. search 'zzzz' · new text (5): @aria-label: Clear search; @placeholder: Type to search; @title: Clear search; Check the spelling, or search by work order number, customer, unit or VIN.; No results for “zzzz” · gone 202 · shot `W4b-05.png`
- 6. click 'Clear all filters' — **step error:** Locator.click: Timeout 5000ms exceeded.
Call log:
  - waiting for get_by_text("Clear all filters").first
 · new text (0):  · shot `W4b-06.png`
- 7. switch to 'Board' and search 'zzzz' with Status still set · new text (1): @title: Card size · gone 2 · shot `W4b-07.png`
- 8. switch to 'Table' (List) with the no-match search · new text (17): @title: Columns; @title: Row height; Asset; Assigned Tech; Clocked In; Created on; Customer; Lead Technician; Lines; Number; On Site; Progress · gone 3 · shot `W4b-08.png`

### A1b — Add Part page: More options full form, catalog search no match, discard (7.7 s)

- 1. click '+ Add Part' on line 1 · new text (20): $; @title: Cancel; @title: Open the full part form (Shift+Enter); Category; Cost; Description; Enter; Esc; More options; Part number; Qty; Save · shot `A1b-01.png`
- 2. click 'More options' · new text (12): %; AI; Add part; Cancel; Core charge; Margin; Rate; Save part; ShopCoach Parts Guide; Source; Typed by Brenda Martinez; Vendor · shot `A1b-02.png`
- 3. type 'zzz' in Part number · new text (2): No catalog match for “zzz”.; Typed by Brenda Martinez as “zzz” · gone 1 · shot `A1b-03.png`
- 4. press Escape (discard prompt) · new text (4): Discard Part; Discard this part?; Keep Editing; The details you entered will be lost. · shot `A1b-04.png`
- 5. click 'Discard Part' · new text (0):  · gone 37 · shot `A1b-05.png`

### T1 — Dark theme for real (ShopviewTheme.set('dark')): List + preview, Tech View, Board View on both boards (23.6 s)

- **variant Work Orders Details.dc.html**
    - check: resolved theme and page background → `rgb(15, 17, 20) / theme=dark`
  - 1. dark: open preview on S1-702 · new text (90): @aria-label: Close preview; @aria-label: Work order preview; @title: Close (Esc); @title: Work order preview; Fibridge Commercial · TRK-118 · 2022 Freightliner M2; Open Work Order (+84 inside the embedded page) · shot `T1-details-01.png`
    - check: embedded page theme (iframe data-theme) → `dark / rgb(238, 242, 246)`
  - 2. dark: close preview · new text (0):  · gone 90 · shot `T1-details-02.png`
  - 3. dark: By Lead Tech · new text (31): 0%; 1 part; 10%; 100%; 15%; 2 parts; 20%; 25%; 3 parts; 30%; 35%; 40% · gone 16 · shot `T1-details-03.png`
  - 4. dark: Board · new text (44): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 3.5 hrs; 0.0 / 7.5 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 7.5 hrs; 0.8 / 8.0 hrs; 1.2 / 4.0 hrs · gone 86 · shot `T1-details-04.png`
- **variant Work Orders.dc.html**
    - check: resolved theme and page background → `rgb(15, 17, 20) / theme=dark`
  - 1. dark: By Lead Tech · new text (31): 0%; 1 part; 10%; 100%; 15%; 2 parts; 20%; 25%; 3 parts; 30%; 35%; 40% · gone 16 · shot `T1-wo-01.png`
  - 2. dark: Board · new text (44): 0.0 / 1.0 hrs; 0.0 / 1.5 hrs; 0.0 / 2.0 hrs; 0.0 / 2.5 hrs; 0.0 / 3.0 hrs; 0.0 / 3.5 hrs; 0.0 / 7.5 hrs; 0.0 / 9.0 hrs; 0.4 / 4.0 hrs; 0.6 / 7.5 hrs; 0.8 / 8.0 hrs; 1.2 / 4.0 hrs · gone 86 · shot `T1-wo-02.png`

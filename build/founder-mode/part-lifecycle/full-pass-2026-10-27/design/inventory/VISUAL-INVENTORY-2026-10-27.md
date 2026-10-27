# Part Lifecycle — design visual inventory, 27 Oct 2026 (Rule 126 point 3, skill 21 §4b)

`design_visual_inventory.py` rendered all 51 board files at 1440 and 1536 px (`visual-tool/`). It can measure only the
DOM, which exists on the four Before boards and the redrawn 2.6 table; the other 46 boards are screenshots, so every look
item on them was listed by hand from the image (`visual_rows.py`).

Rows: 193 (74 tool + 119 hand) · by class: {'OUT-OF-SCOPE': 67, 'CASE-NEEDED': 122, 'SPEC-CONFLICT': 2, 'DATA': 1, 'COVERED': 1} · **unclassified: 0**

| Source | Board | Element | What is seen | Class |
|---|---|---|---|---|
| design_visual_inventory.py |  | column "#0" | empty×7 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Category" | link×6, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Date" | link×2, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Date" | link×7 · renderer (count of rows) | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "Description" | link×6, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Event" | link×2, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Event" | plain×6, link×1 · renderer (count of rows) | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "Manufacturer" | empty×6, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Measurement" | link×6, dash×4, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Part Number" | link×6, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Size" | empty×6, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Staff" | plain×3 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Staff" | link×7 · renderer (count of rows) | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "Tags" | empty×4, square badge×2, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Time" | link×2, plain×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Time" | link×7 · renderer (count of rows) | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "unnamed svg #23zig5 (3 shapes)" | empty×6, icon:unnamed svg #23zig5 (3 shapes)×1 · renderer (count of rows) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Category" | {"color": "rgb(31, 36, 48)", "color_tok": [], "font_size": "11px", "weight": "400", "underline": "none"} · link | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Category" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Date" | {"color": "rgb(31, 36, 48)", "color_tok": [], "font_size": "11px", "weight": "400", "underline": "none"} · link | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Date" | {"color": "rgb(0, 0, 0)", "color_tok": [], "font_size": "13px", "weight": "700", "underline": "none"} · link | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "Date" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Description" | {"color": "rgb(31, 36, 48)", "color_tok": [], "font_size": "11px", "weight": "400", "underline": "none"} · link | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Description" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Event" | {"color": "rgb(31, 36, 48)", "color_tok": [], "font_size": "11px", "weight": "400", "underline": "none"} · link | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Event" | {"color": "rgb(0, 0, 0)", "color_tok": [], "font_size": "13px", "weight": "700", "underline": "none"} · link | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "Event" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Event" | {"font_size": "13px", "weight": "600", "color": "rgb(49, 55, 74)", "color_tok": [], "align": "start"} · plain | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "Manufacturer" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Measurement" | {"color": "rgb(31, 36, 48)", "color_tok": [], "font_size": "11px", "weight": "400", "underline": "none"} · link | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Measurement" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Part Number" | {"color": "rgb(31, 36, 48)", "color_tok": [], "font_size": "11px", "weight": "400", "underline": "none"} · link | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Part Number" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Size" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Staff" | {"color": "rgb(0, 0, 0)", "color_tok": [], "font_size": "13px", "weight": "700", "underline": "none"} · link | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "Staff" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Tags" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Tags" | {"h": 17, "w": 34, "font_size": "9.5px", "weight": "400", "bg": "rgba(0, 0, 0, 0)", "bg_tok": [], "color": "rgb(61, 70,  · square badge | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Time" | {"color": "rgb(31, 36, 48)", "color_tok": [], "font_size": "11px", "weight": "400", "underline": "none"} · link | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column "Time" | {"color": "rgb(0, 0, 0)", "color_tok": [], "font_size": "13px", "weight": "700", "underline": "none"} · link | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column "Time" | {"font_size": "10.5px", "weight": "700", "color": "rgb(61, 70, 84)", "color_tok": [], "align": "left"} · plain | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column header row | Staff / Date / Time / Event · columns in order | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column header row | [] / [icon unnamed svg #23zig5 (3 shapes)] / Description / Part Number / Tags / Category / Manufacturer / Measurement /  · columns in order | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | board | 0 / 0 · gap to viewport left / right (px) | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | board | no · inside a card or panel | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | board | d0 x-dc bg=rgba(0, 0, 0, 0) r=0px pad=0px ; d1 body bg=rgb(255, 255, 255) r=0px pad=0px · painted ancestors (inner→outer) | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | page | rgb(255, 255, 255) /  / False · body background / theme attribute / page wider than viewport | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | page | rgb(255, 255, 255) /  / True · body background / theme attribute / page wider than viewport | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column header labels | 10.5px/700/rgb(61, 70, 84)/ls normal · size/weight/colour/letter-spacing | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column header labels | 13px/700/rgb(0, 0, 0)/ls normal · size/weight/colour/letter-spacing | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column header row | static top=auto · rgba(0, 0, 0, 0) · 0px none rgb(128, 128, 128) · position / background / bottom border | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | unnamed svg #1gcab6 (6 shapes) | (no control) · 13px · rgb(37, 99, 235) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #23zig5 (3 shapes) | (no control) · 12px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #5swayx (3 shapes) | (no control) · 13px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #a00t10 (2 shapes) | (no control) · 15px · rgb(31, 36, 48) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #cs6z3o (2 shapes) | (no control) · 12px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #e33pp2 (3 shapes) | (no control) · 13px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #f39d1b (1 shapes) | (no control) · 10px · rgb(31, 36, 48) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #ijjmpg (1 shapes) | (no control) · 13px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #jcirji (2 shapes) | (no control) · 12px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #ju38mz (2 shapes) | (no control) · 13px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #krk97m (3 shapes) | (no control) · 13px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #ldxdr1 (2 shapes) | (no control) · 12px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #lh5st0 (1 shapes) | (no control) · 13px · rgb(31, 36, 48) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #ltp4wy (1 shapes) | (no control) · 10px · rgb(31, 36, 48) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #y6s7wp (4 shapes) | (no control) · 13px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | unnamed svg #z2k7z3 (3 shapes) | (no control) · 13px · rgb(61, 70, 84) · on control · size · colour | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | column header labels | none · label pairs closer than 4px (gap px) | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | column header labels | none · labels clipped | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | text | none · clipped without ellipsis | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | text | none · overlapping text pairs | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | text | none · truncated with ellipsis (by design) | D-33 (redrawn table on board 2.6) |
| design_visual_inventory.py |  | pill/badge | 28 (16px/400) e.g. Staging Heavy Duty - 9919
AS · height px (font size/weight) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| design_visual_inventory.py |  | pill/badge | 22 (11.5px/400) e.g. Default · height px (font size/weight) | OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target) |
| hand (image viewed 27 Oct) | all boards | top bar | logo, ShopHub menu, Work Orders, Schedule, Customers, Parts (grey pill when current), Reports, Search box with Ctrl+K, Clock In, bell with count, loca  | OUT-OF-SCOPE app chrome this feature does not change (top bar, location selector, avatar, Clock In, bell) |
| hand (image viewed 27 Oct) | all list boards | side menu | SALES & SERVICE: Part Sales; PARTS: Inventory, Part Library; SUPPLY CHAIN: Returns, Purchase Orders, Vendor Invoices, Vendors; icons before each; curr  | D-01 |
| hand (image viewed 27 Oct) | 7.1 | side menu | Part Library item blue (current)  | D-41 |
| hand (image viewed 27 Oct) | 1.4 / 2.3 / 5.3 | page title | "Inventory" bold, top left  | D-01 |
| hand (image viewed 27 Oct) | 1.4 / 2.3 / 5.3 | tabs | Active / Inactive on their own line under the title; selected = blue text; no underline  | D-01 |
| hand (image viewed 27 Oct) | 3.5 / 4.10 | tabs (Inactive selected) | Inactive blue text with a light blue rounded hover background; Active dark  | D-02 |
| hand (image viewed 27 Oct) | 1.4 | toolbar | Search (magnifier + word), Bin Location filter with pin icon and chevron, Category filter with list icon and chevron, Supply with box icon and chevron  | D-01 |
| hand (image viewed 27 Oct) | 2.3 / 3.4 / 4.1 | search box | typed term, round clear (x) icon at the right of the box  | D-01 |
| hand (image viewed 27 Oct) | 5.3 | column headers | bold, left aligned: Description, Part Number, Tags, Category, Manufacturer, Vendor, Bin Location / Quantity, Total Qty, Avg Cost, Core, Sell Price, Mi  | D-01 |
| hand (image viewed 27 Oct) | 4.0 | column headers (today) | Description, Part Number, Tags, Category, Manufacturer, Vendor, Bin Location / Quantity, Total Qty, Avg Cost, Core, Sell Price, Min, Max, Last  | D-01 |
| hand (image viewed 27 Oct) | 1.4 | history icon | clock-with-arrow icon at the left of rows with history, its own narrow column  | D-01 |
| hand (image viewed 27 Oct) | 1.4 | bin cell | outlined rounded chip "PB1 / 7" (bin, thin divider, quantity)  | D-01 |
| hand (image viewed 27 Oct) | 1.4 / 2.3 | tags cell | grey rounded chips; a "..." chip when more tags do not fit  | D-01 |
| hand (image viewed 27 Oct) | 1.4 | cell text | long descriptions cut off with "..."  | D-01 |
| hand (image viewed 27 Oct) | 1.4 | row hover | one row shaded light grey (pointer on it)  | D-01 |
| hand (image viewed 27 Oct) | 4.0 | Total Qty cell (today) | coloured badges: orange "6 Available", green "0 Available"  | D-30 |
| hand (image viewed 27 Oct) | 4.0 | Sell Price cell (today) | some amounts in a green outlined box ("$500.00")  | OUT-OF-SCOPE existing price-rule style, unchanged by this feature |
| hand (image viewed 27 Oct) | 4.0 | page layout (today) | title on the same line as the toolbar, no tabs, no checkboxes, sidebar reads Catalog  | OUT-OF-SCOPE Before board: today's screen, named "Before" by the design, not the target (Rule 115) |
| hand (image viewed 27 Oct) | 3.5 | inactive row | inactive part row has no tag or badge  | D-02 |
| hand (image viewed 27 Oct) | 4.10 | empty Inactive tab | header row kept; grey centred text "No inactive parts at this location."; no icon  | D-03 |
| hand (image viewed 27 Oct) | 3.4 | filtered empty state | header row kept; magnifier icon in a light grey circle; dark centred text "No parts match the search "N6801-06-04"."  | D-04 |
| hand (image viewed 27 Oct) | 4.1 | three-dot button (open) | light grey square behind the dots while open  | D-05 |
| hand (image viewed 27 Oct) | 4.1 | actions menu | white card with shadow under the button, right edges lined up; items Cycle count, Deactivate parts, Export; no icons; covers the header cells below it  | D-05 |
| hand (image viewed 27 Oct) | 4.8 | actions menu in bulk mode | only Export  | D-06 |
| hand (image viewed 27 Oct) | 4.2 | bulk bar | near-black, rounded corners, full list width, directly under the tabs  | D-07 |
| hand (image viewed 27 Oct) | 4.2 | count badge | round dark grey badge, white number  | D-07 |
| hand (image viewed 27 Oct) | 4.2 | selected label | "selected" light grey  | D-07 |
| hand (image viewed 27 Oct) | 4.2 | divider | thin vertical line after "selected"  | D-07 |
| hand (image viewed 27 Oct) | 4.2 | Deactivate (disabled) | small blue button, dimmed  | D-07 |
| hand (image viewed 27 Oct) | 4.2 | X | white X at the right end of the bar  | D-07 |
| hand (image viewed 27 Oct) | 4.2 | toolbar below the bar | search and filters move under the bar; New Inventory Part still shown  | D-07 |
| hand (image viewed 27 Oct) | 4.2 | checkbox column | first column, empty square boxes on header and rows; history icon column next  | D-07 |
| hand (image viewed 27 Oct) | 4.3 | ticked box | filled dark grey square with a white tick  | D-08 |
| hand (image viewed 27 Oct) | 4.3 | ticked row | whole row shaded light grey  | D-08 |
| hand (image viewed 27 Oct) | 4.3 | header box (some ticked) | dark square with a white dash  | D-08 |
| hand (image viewed 27 Oct) | 4.3 | Deactivate (enabled) | bright blue  | D-08 |
| hand (image viewed 27 Oct) | 4.3 | count line | "2 records selected." small dark text under the table, left  | D-08 |
| hand (image viewed 27 Oct) | 4.3 | description tooltip | dark grey tooltip with the full description, just under the row  | D-08 |
| hand (image viewed 27 Oct) | 4.6 | header box (all ticked) | dark square with a white tick and a grey hover circle  | D-09 |
| hand (image viewed 27 Oct) | 4.6 | Activate button | small blue button, same blue as Deactivate  | D-09 |
| hand (image viewed 27 Oct) | 4.9 | badge "630" | badge wider for three digits  | D-10 |
| hand (image viewed 27 Oct) | 4.9 | 200 tooltip | dark grey box "Select 200 parts or fewer." just below the Deactivate button, over the search box  | D-10 |
| hand (image viewed 27 Oct) | 4.5 | success toast | green, bottom right, white tick-in-circle icon, text, "Close" at right  | D-13 |
| hand (image viewed 27 Oct) | 4.5 | after the change | bar and checkbox column gone; search term kept  | D-13 |
| hand (image viewed 27 Oct) | 4.4 / 4.7 / 3.3 / 3.7 | dialog frame | white, centred, rounded corners, shadow; page behind dimmed  | D-11 |
| hand (image viewed 27 Oct) | 4.4 / 4.7 / 3.3 / 3.7 | title | large bold title; thin line under the title row  | D-11 |
| hand (image viewed 27 Oct) | 4.4 / 4.7 / 3.3 / 3.7 | close X | grey X at the right end of the title row  | SPEC-CONFLICT DV-01 (held D-49) |
| hand (image viewed 27 Oct) | 4.4 / 3.3 | message lines | regular dark lines; "Existing records ..." a little bolder; "Stock, cost of goods ..." grey  | D-11 |
| hand (image viewed 27 Oct) | 4.4 / 4.7 / 3.7 | note box | full-width outlined box "Note (Optional)" as its placeholder  | D-11 |
| hand (image viewed 27 Oct) | 3.3 | note box (typing) | blue outline, small blue label "Note (Optional)", typed note  | D-24 |
| hand (image viewed 27 Oct) | 4.4 / 4.7 / 3.3 / 3.7 | footer | thin line above; Cancel white with grey outline, then the confirm button, at the bottom right  | D-11 |
| hand (image viewed 27 Oct) | 4.4 / 3.3 | confirm button (deactivate) | red "Deactivate"  | D-11 |
| hand (image viewed 27 Oct) | 4.7 / 3.7 | confirm button (activate) | blue "Activate"  | D-12 |
| hand (image viewed 27 Oct) | 3.3 / 3.7 | layering | confirmation smaller than the part window, over it; part window dimmed  | D-24 |
| hand (image viewed 27 Oct) | 4.4 / 4.7 | layering | bulk bar and its button dimmed behind the dialog  | D-11 |
| hand (image viewed 27 Oct) | 1.1 | window frame | white, centred, rounded, over the dimmed list  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | title row | "New Inventory Part", grey X right, thin line under it, no pill  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | text boxes | outlined grey boxes with grey placeholder labels; focused box blue outline with small blue label  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | dropdowns | Vendor, Category, Manufacturer with down arrows at the right  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | money row | Cost, Sell Price, Core Charge: three equal boxes on one line  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | Inventory Tracking heading | medium heading with a small (i) icon after it  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | tracking switch (on) | blue track and knob at the right, label "Track quantities and cost of goods"  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | Min / Max | two equal boxes on one line under the switch  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | Inventory section | heading; bin dropdown, Quantity box, light-blue rounded "Default" tag  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | Add Bin Location | blue link with a plus icon before the words  | D-14 |
| hand (image viewed 27 Oct) | 1.1 | footer | thin line above; Cancel (white, grey outline) and Save (blue) at the right; no Delete Part  | D-14 |
| hand (image viewed 27 Oct) | 1.3 | filled box | small label at the top left, value under it; "$" before money values  | D-15 |
| hand (image viewed 27 Oct) | 1.2 | error state | red outline, red label, small red message under each empty required box; all at once  | D-16 |
| hand (image viewed 27 Oct) | 1.6 / 5.2 | tracking switch (off) | grey track, knob at the left; Min/Max hidden, Tags moves up  | D-17 |
| hand (image viewed 27 Oct) | 1.4 | linked toast | green, bottom right, tick icon, three lines of text, Close  | D-18 |
| hand (image viewed 27 Oct) | 1.5 | error toast | red, bottom right, white warning triangle, message, smaller second line "Please try to resolve this.", Close  | D-19 |
| hand (image viewed 27 Oct) | 2.1 / 3.1 | title row (edit) | "Edit Inventory Part"; green rounded "Active" pill (light green fill, green text, green border) left of the grey X  | D-20 |
| hand (image viewed 27 Oct) | 3.6 | status pill (inactive) | grey rounded "Inactive" pill (light grey fill, grey text, grey border)  | D-21 |
| hand (image viewed 27 Oct) | 2.1 | Part Status | grey label; two radio buttons Active / Inactive on one line; picked = filled blue  | D-20 |
| hand (image viewed 27 Oct) | 3.2 | radio just picked | filled blue with a light halo (focus ring)  | D-22 |
| hand (image viewed 27 Oct) | 2.1 | Average Cost label | "Average Cost" in the edit window  | D-20 |
| hand (image viewed 27 Oct) | 2.1 | tag chips (edit) | blue chips each with a small x  | D-20 |
| hand (image viewed 27 Oct) | 2.1 | Delete Part | red button bottom left, white trash icon, white label  | D-20 |
| hand (image viewed 27 Oct) | 2.2 | other-locations text | small orange text directly under the Description box and under the Part Number box  | D-23 |
| hand (image viewed 27 Oct) | 3.4 | status toast | green, bottom right, "Part deactivated.", Close  | D-26 |
| hand (image viewed 27 Oct) | 5.1 | tracking tooltip | dark grey box, white text, four lines, opens below the (i) icon over the switch and the Min box  | D-27 |
| hand (image viewed 27 Oct) | 5.6 | Min box focused | black outline with up/down arrows at the right  | DATA (focus state of a number box; existing component) |
| hand (image viewed 27 Oct) | 5.3 / 5.4 | Not Tracked cell | light grey plain text "Not Tracked" in Total Qty, no badge  | D-30 |
| hand (image viewed 27 Oct) | 5.7 | cycle count toolbar | printer icon, pale Save, blue Cancel, "Count changes available: 200"  | D-31 |
| hand (image viewed 27 Oct) | 5.7 | cycle count columns | Description, Part Number, Category, Manufacturer, Vendor, Bin Location / Quantity, Total Qty, Count, Adjustment (sort arrow), Min, Max; bins as plain   | D-31 |
| hand (image viewed 27 Oct) | 5.7 | Not Tracked in Count | grey "Not Tracked" in Count, no count box  | D-31 |
| hand (image viewed 27 Oct) | 5.7 | tabs during cycle count | Active / Inactive still shown  | D-31 |
| hand (image viewed 27 Oct) | 2.4 / 5.5 / 3.8 | Part details card | white rounded card at the left: "Part details", blue description cut off with "..", bold labels with values under them  | D-32 |
| hand (image viewed 27 Oct) | 2.4 / 5.5 | history header | "Part History" title; magnifier and "Search" at the top right  | D-32 |
| hand (image viewed 27 Oct) | 2.4 / 5.5 | history table | bold headers Staff, Date, Time, Event; thin row lines; Event text darker and a little bolder  | D-32 |
| hand (image viewed 27 Oct) | 2.6 (rendered) | history columns at the other location | Staff 237 px, Date 188 px, Time 149 px; Event wraps to a second line  | D-33 |
| hand (image viewed 27 Oct) | 2.6 (png only) | history columns, build screenshot under the redraw | Staff, Date and Time narrowed when events are long (the design note says the build must be fixed)  | SPEC-CONFLICT DV-03 (the redrawn table is the design; held D-33) |
| hand (image viewed 27 Oct) | 3.8 | history search open | field with the typed term and a round clear (x) icon at the right  | D-34 |
| hand (image viewed 27 Oct) | 5.5 | "Manufacturer updated | Original Manufacturer: - | | an existing entry with empty values on a build screenshot  | OUT-OF-SCOPE existing Part History entry; noted for build verification (13 Oct record) |
| hand (image viewed 27 Oct) | 6.1 | lookup result | description left, part number right; grey second line "Inventory Qty: 78 ea" or "Part Library"; outlined bin chip on the third line  | D-35 |
| hand (image viewed 27 Oct) | 6.1 / 6.2 / 6.3 | Part Number field (open) | grey filled field with blue underline, small blue label, up arrow  | OUT-OF-SCOPE existing lookup field style, unchanged |
| hand (image viewed 27 Oct) | 6.2 | no results | "No results" single line in the open list  | D-36 |
| hand (image viewed 27 Oct) | 6.3 | inactive line | single dark line "GREASETUBE is inactive. Activate it from the Inactive tab to use it."; no special-order row  | D-37 |
| hand (image viewed 27 Oct) | 6.4 | canned job picker | New Line window, Title dropdown result "Replace - Steering shaft u joints", "HD Fleet Rate : $299.90", "Total Parts: 3"  | D-38 |
| hand (image viewed 27 Oct) | 6.5 | warning toast | orange, bottom right, white "!" icon, two-line text, Close  | D-38 |
| hand (image viewed 27 Oct) | 6.6 | Inactive tag (return lookup) | small grey rounded tag "Inactive" after the description, before the part number  | D-39 |
| hand (image viewed 27 Oct) | 6.7 | Inactive tag (Issue Credit) | small grey rounded tag "Inactive" after the part number, before the description  | D-40 |
| hand (image viewed 27 Oct) | 6.1 to 6.5 | work order page behind the dialogs | lines, approve/decline buttons, status pills, ShopCoach links  | OUT-OF-SCOPE existing work order / part sale / return screen around the lookup, unchanged by this feature |
| hand (image viewed 27 Oct) | 6.6 | Create Return page | Vendor, Packaging Slip, columns, Save Return  | OUT-OF-SCOPE existing work order / part sale / return screen around the lookup, unchanged by this feature |
| hand (image viewed 27 Oct) | 6.7 | Issue Credit dialog | credit date, outcome radios, payment method, reason, totals, Cancel / Issue Refund  | OUT-OF-SCOPE existing work order / part sale / return screen around the lookup, unchanged by this feature |
| hand (image viewed 27 Oct) | 7.1 | Part Library toolbar | Search, Manufacturer filter with person icon, Category filter; no create button  | D-41 |
| hand (image viewed 27 Oct) | 7.1 | selection | header checkbox and blue three-dot button before Description; row checkboxes  | D-41 |
| hand (image viewed 27 Oct) | 7.1 | columns | Description, Part Number, Tags, Category, Manufacturer, Measurement, Size  | D-41 |
| hand (image viewed 27 Oct) | 7.2 | entry card | "Part details"; name bold with a blue pencil-on-lines icon at the right; Part number, Category, Manufacturer, Measurement, Total parts  | D-42 |
| hand (image viewed 27 Oct) | 7.2 | parts table | "Parts" title; arrow column, Workplace, Bin location, Average cost, Sell price, Core charge, Remaining Quantity, Min, Max  | D-42 |
| hand (image viewed 27 Oct) | 7.2 | no Delete | no Delete button on the page  | D-42 |
| hand (image viewed 27 Oct) | all boards | drawn width | boards drawn 1600 px wide (5.3, 5.4, 5.7: 2300 px; 4.0: 1800 px), light theme only  | D-43 / D-44 / D-45 / D-46 |
| hand (image viewed 27 Oct) | all boards | dark theme | not drawn; the PRD states the bar in dark theme (S2-R7a)  | COVERED C425595 |
| hand (image viewed 27 Oct) | 1.0 / 3.0 | Before: part dialog | Catalog Part first, no status, Delete red and Save blue side by side, explanation text in red and grey  | OUT-OF-SCOPE Before board: today's screen, named "Before" by the design, not the target (Rule 115) |
| hand (image viewed 27 Oct) | 2.0 | Before: Part History | staff names in olive link colour, explanation panels  | OUT-OF-SCOPE Before board: today's screen, named "Before" by the design, not the target (Rule 115) |
| hand (image viewed 27 Oct) | 6.0 | Before: lookup | results with olive second lines, three Save buttons  | OUT-OF-SCOPE Before board: today's screen, named "Before" by the design, not the target (Rule 115) |
| hand (image viewed 27 Oct) | 7.0 | Before: Catalog page | "Catalog" title, New Catalog Part button, explanation panel  | OUT-OF-SCOPE Before board: today's screen, named "Before" by the design, not the target (Rule 115) |
| hand (image viewed 27 Oct) | all Before boards | red label | "BEFORE · WHAT IS ON STAGING TODAY" red badge  | OUT-OF-SCOPE Before board: today's screen, named "Before" by the design, not the target (Rule 115) |
| hand (image viewed 27 Oct) | canvas | canvas chrome | "7 pages" menu, Zoom, per-board Play / Export, Fit, Read-only, Back to canvas, sticky notes  | OUT-OF-SCOPE the design tool's own controls, not ShopView |

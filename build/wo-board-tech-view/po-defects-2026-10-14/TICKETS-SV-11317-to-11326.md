# Chris Ward's design defects, fetched 14 Oct 2026 (read-only)

## SV-11317 · Tech View: open on the design's 13 columns, not the List's
created 2026-10-14T14:13:38.384-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Tech View opens on the design's default columns instead of the List's production defaults.

### Expected

S5-R4: "Until the user changes Tech View's columns, Tech View shows these columns, in this order, as in the design: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created on, Total price (Total price subject to financial permission). On Site, VIN/Serial # and Lead Technician are off by default; each can be added with the column chooser (S2-R4). List's columns are unchanged." S7-R7: Assigned Techs is on by default and can be removed.

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S5-R4, S7-R7).

### Actual (staging build, develop b19269d4487, clicked through locally)

Tech View shows the List's 14 columns (On Site, Status, Number, Customer, Asset, Unit, VIN/Serial #, Progress, Service Advisor, Lead Technician, Clocked In, Lines, Total Price, Created On). At 1440px wide the table runs off the right edge, and Lead Technician repeats the group's technician on every row.

### How to check

* A user who has never changed Tech View's columns sees exactly the 13 columns above, in that order.
* On Site, VIN/Serial # and Lead Technician can still be added from the column chooser.
* Total price is hidden for users without financial permission.
* List's columns are unchanged.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11318 · Tech View: status pill size follows density (18px / 18px / 22px)
created 2026-10-14T14:13:42.272-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Tech View keeps the List's production status pill and its red and blue counts, but the pill's size follows the density setting.

### Expected

S2-R19: Tech View's Status column is the same status pill List shows in production, with the same red service-actions count and blue parts-actions count on it. S6-R2a: "In Tech View the status pill is 18px tall at Compact and Regular and 22px tall at Comfortable, the design's two badge sizes. List's status pill is unchanged."

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S2-R19, S6-R2a).

### Actual (staging build, develop b19269d4487, clicked through locally)

The status pill is the same size (about 21px) at every density.

### How to check

* Compact and Regular: status pill 18px tall. Comfortable: 22px tall.
* Red and blue counts still show on the pill, with their tooltips.
* List's status pill looks exactly as in production.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11319 · Tech View and Board View: use the design's Lucide icons (switcher and all view icons)
created 2026-10-14T14:13:46.946-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Replace the Material stand-in icons with the design's Lucide icons in the switcher, Tech View and Board View.

### Expected

S1-R9a: the switcher uses List = list, Tech View = user-round, Board View = square-kanban (Lucide, 20px). In Tech View and Board View: density row-height (Tech View) / card-height (Board View), collapse chevron-down, pin / pin-off, Invoiced or Paid lock, Unassigned avatar user-round, empty states clipboard-list. List's icons are unchanged.

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S1-R9a).

### Actual (staging build, develop b19269d4487, clicked through locally)

Material icons: view_list, person and view_kanban in the switcher; format_line_spacing for density; expand_more / chevron_right, push_pin, Material lock, person and assignment in the views.

### How to check

* Compare each icon against the design screenshots attached.
* List's toolbar and rows show the same icons as production.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11320 · Tech View: drag grip on every work order row and group header
created 2026-10-14T14:13:52.874-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Show the design's six-dot drag grip at the left of every Tech View row and group header.

### Expected

S9-R1a: "In Tech View every work order row and every group header, Unassigned included, shows the design's six-dot drag grip at its left edge, to users who can drag (S4-N1). The whole row still drags (S2-R8); the grip shows that it can."

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S9-R1a).

### Actual (staging build, develop b19269d4487, clicked through locally)

Rows show no grip, although dragging a row works. Technician group headers have a grip; Unassigned has none.

### How to check

* A user with Work Orders create and edit sees a grip on every row and every group header, Unassigned included.
* A user without it sees no grips.
* Dragging from anywhere on the row still works; a click still opens the work order.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11321 · Tech View: column header labels 12px, weight 500, secondary color; no overlap
created 2026-10-14T14:13:56.218-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Restyle Tech View's column header labels to the design and stop labels colliding.

### Expected

S2-R21: "Tech View's column header labels are 12px, medium weight (500), in the secondary text color, as in the design. Labels never overlap a neighboring label."

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S2-R21).

### Actual (staging build, develop b19269d4487, clicked through locally)

Labels are bold black. At 1440px "Lead Technician" runs into "Clocked In", and "Progress" touches "Service Advisor".

### How to check

* Header labels match the design's style at 1440 and 1536 wide.
* No label touches or overlaps its neighbor, with the default columns and with every optional column added.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11322 · Switcher tooltip covers the column header row
created 2026-10-14T14:13:59.251-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Open the switcher's hover tooltip above the switcher.

### Expected

S1-R9b: "The switcher's hover tooltip opens above the switcher, so it never covers the table's column header row."

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S1-R9b).

### Actual (staging build, develop b19269d4487, clicked through locally)

Hovering Tech View in the switcher shows the "Tech View" tooltip below it, on top of the Service Advisor header.

### How to check

* Hover each of the three switcher buttons: the tooltip shows above the switcher and the header row stays readable.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11323 · Board View: run full width, no grey rounded panel
created 2026-10-14T14:14:01.714-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Remove the grey rounded panel around Board View's columns.

### Expected

S3-R23: "Board View runs full width, with no grey rounded panel around the columns, as in the design."

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S3-R23).

### Actual (staging build, develop b19269d4487, clicked through locally)

Board View's columns sit inside a grey rounded panel with margins.

### How to check

* Board View's columns run the full width of the page, as in the attached design screenshot.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11324 · Tech View: run edge to edge on white, no side gutter
created 2026-10-14T14:14:05.340-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Remove the side gutter around Tech View's table.

### Expected

S2-R22: "Tech View's table runs edge to edge on white, with no side gutter and no card or panel around it, as in the design."

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S2-R22).

### Actual (staging build, develop b19269d4487, clicked through locally)

Tech View's table sits inset from the page edges with a gutter on each side.

### How to check

* Tech View's table and its group headers run to both edges of the page, as in the attached design screenshot.
* List is unchanged.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11325 · Tech View: number link, progress bar and advisor avatar as in the design
created 2026-10-14T14:14:08.687-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Restyle three Tech View cells to the design.

### Expected

S2-R20: "Tech View's cells follow the design: the work order number shows as a link in the accent color; Progress shows as a thin bar with the percentage beside it; Service Advisor shows the advisor's avatar before the name. Clocked In keeps List's display (S5-R11)."

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S2-R20).

### Actual (staging build, develop b19269d4487, clicked through locally)

Number is plain text, Progress is a colored percentage pill, and Service Advisor shows the name only, as in List.

### How to check

* Number shows as an accent-color link and opens the work order.
* Progress shows a thin bar plus the percentage.
* Service Advisor shows avatar then name.
* Clocked In looks exactly as in List.
* List's cells are unchanged.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

## SV-11326 · Tech View and Board View: add a Technician filter (lead technician, multi-select)
created 2026-10-14T14:19:36.634-0500 · reporter Chris Ward · status Open · type Bug · parent SV-10043

### What

Add a Technician filter to the filter bar in Tech View and Board View only.

### Expected

S1-R15: in Tech View and Board View the filter bar also offers a Technician filter, after Assigned to me: a multi-select listing Unassigned first, then the location's technicians (the same people who get a group or column, S9-R4), by first name then last name. Choosing one or more shows only those technicians' groups or columns; every other group or column, pinned ones included, is hidden. It filters by lead technician only. S1-R15a: it combines with every other filter and with Assigned to me; when nothing matches the S1-N1a empty state applies and Clear all filters also clears it. S1-R15b: List does not offer it and stays as in production; switching to List shows List as if none were chosen, switching back brings the choice back; it is remembered the same way as the other filters.

PRD: [Board View & Tech View PRD v51](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845185030) (S1-R15, S1-R15a, S1-R15b).

### Actual (staging build, develop b19269d4487, clicked through locally)

Tech View and Board View offer only the production chips (Status on the All tab, Assigned to me, Asset on Site). There is no Technician filter.

### How to check

* Tech View and Board View show a Technician chip after Assigned to me; List does not.
* The list shows Unassigned first, then the location's technicians by first then last name.
* Choosing technicians hides every other group/column, pinned ones included.
* Combined with Assigned to me and Asset on Site, only work orders matching all show; no match shows the S1-N1a empty state, and Clear all filters clears Technician too.
* Switch to List: all work orders show as without the filter; switch back: the choice returns.

### Screenshots

Attached: staging build first, Branko's design (files starting D) after.

Raised from Sasha's staging review, 2026-10-14.

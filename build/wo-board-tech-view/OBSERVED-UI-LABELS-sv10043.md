# Observed UI labels — WO Board / Tech View — sv10043 build v26.40.8-7a95011 (2026-10-08)
Evidence: build-verify-2026-10-08/*.txt/png. Seeded: staff "ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo" (Technician, Time Clock on,
Staging Heavy Duty - 9919, department Administration); work order S10043-17581 (4 Star Truck Repair, 2011 Hyundai Santa Fe, line
"Replace - Brake pot", Approved). Pins restored afterwards (Admin keeps only Brandi Smith, pinned before this session).

## Work Orders toolbar
- Tabs: `All` · `Estimates` · `Work Orders` · `Completed`. Filters: `Status` (Estimate, Approved, In progress, Review, Complete, Invoiced,
  Paid, Declined, Imported, `Clear selection`; in Tech/Board View the Imported option carries "Imported work orders open in List.") ·
  `Assigned to me` · `Asset on Site`. `Search` button opens the search box. `Create Work Order`.
- Display switcher (buttons, tooltip = name): `List` · `Tech View` · `Board View`. At 900 px wide the switcher, `Density` and the column/field
  choosers are not shown (narrow-900.png).
- `Column Selection` (List and Tech View) — List: Waiting On Parts, Asset, VIN/Serial #, Progress, Service Advisor, Lead Technician, Clocked In,
  Lines, Total price, Created on, Invoiced Date, Days open, Parts, Returns. Tech View adds `Assigned Techs`.
- `Fields to display` (Board View only): Lead technician, Customer, Asset, VIN/serial, Progress, Service advisor, Clocked in, Line count,
  Line technicians, Estimated hours, Total price, On-site, Created date.
- `Density` (Tech View and Board View only; not in List): `Compact` · `Regular` · `Comfortable`.

## Tech View
- Groups: `Unassigned` first, then technicians; header = six-dot drag handle, collapse arrow (button name "Collapse <name>" / "Expand <name>"),
  initials avatar, name, pin icon ("Pin <name>" / "Unpin <name>"), count "N work orders" / "1 work order". Empty group: `No work orders`.
- Row menu: `More actions for <number>` → `Reassign lead technician`.

## Board View
- Columns: `Unassigned` first, then pinned technicians in pin order, then the rest (A–Z); far-right columns render only when scrolled to.
- Empty column: `Drag a work order here to assign it`. Card: number, status, "Customer …", asset, Progress, Lead technician, Total price;
  `More actions for <number>` → `Reassign lead technician`.
- Pin limit: 4th pin button disabled, tooltip `You can pin up to 3 technicians.`
- Dialog `Reassign lead technician` "<number> · <customer>": search box, `Unassigned` (shows `Current` when it is), technicians with initials
  and "N open"; `Cancel` · `Reassign`.
- Drag to another technician → message `Lead technician updated` (with `Close`), gone within ~10 s. Reassign to Unassigned → `Lead technician removed`.
  No shift prompt appeared (the work order had no scheduled shifts) — the "Clear …'s scheduled shifts?" prompt was NOT observed.
- No-match search: `No work orders match these filters` · `Try removing a filter to widen your results.` · `Clear all filters`.

## Set-up screens
- Settings: your initials (top right) → `Settings` → `Staff` → `New Staff Member`: First Name · Last Name · Email · Salary Type · Salary · Job Title ·
  Role (Admin, Foreman, Office User, Parts Manager, Parts Technician, Sales Representative, Senior Service Advisor, Service Advisor, Service Manager,
  Technician, Time Clock User) · Departments (**at least one required**: "Departments must have at least 1 option selected") · Location
  (Staging Lethbridge - 4310, Staging Heavy Duty - 9919) · Billable · `Time Clock` toggle · `Sales Representative` toggle · `Save & Add Next` / `Save & Close`.
- `Create Work Order` → dialog `New Work Order`: Customer (+ `Add`) · Asset (+ `Add`) · `Asset Here?` · `Save`. The new work order opens on
  its Lines tab with the `New Line` form already open. Numbers on this site look like `S10043-17581`.
- `New Line` form: `What Are You Doing?` picks a canned line (e.g. "Replace - Brake pot"; free text gave "No results") · `Line Approved` toggle ·
  `Save & Add Line` / `Save & Close`. Turning `Line Approved` on makes the work order `Approved`.
- **Lead Technician on the work order page is read-only ("Unassigned", not a field) while the work order is an Estimate; once Approved it is a
  `Lead Technician` dropdown** (staff list A–Z, incl. Unassigned). Setting it there showed no prompt.
- Work order tabs: Lines · Parts · Notes · Timesheets · `History (n)` · Stats · Finance. The History tab table (Staff, Date, Time, Event, Work
  Order Total, Customer, Contacts) showed no rows for the lead changes made by drag/reassign (observation only).
- Location: shown next to the bell; change it with your initials → `Change Location`.

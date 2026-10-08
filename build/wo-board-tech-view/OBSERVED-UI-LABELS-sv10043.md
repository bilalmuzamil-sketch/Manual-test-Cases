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
  No shift question appeared — not even when the outgoing lead held a whole-work-order shift (see the Schedule section below).
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

## Customers, contacts and assets (observed 2026-10-08, evidence new-customer.txt, customer-created.txt, new-asset*.txt, wob24-wob32 logs)
- Customers list: `New Customer` → dialog: Name * · Phone · Address 1 · Address 2 · City · ZIP/Postal Code · State/Province · Country · Notes · Website · IBS · `Save`.
  Saving opens the customer page; tabs: `Work Orders` · `Part Sales` · `Contacts` · `Assets` · `Notes` · `Invoices` · `Payments` · `Deposits` · `Fees & Discounts`.
- `Contacts` tab → `New Contact`: First Name · Last Name · Title · Email · Telephone · Mobile · Approves Work · Customer Portal Access · `Save`.
- `Assets` tab → `New Asset`: Contact * · VIN/Serial # · Year · Make * · Model · Trim · Engine · Drivetrain · Unit · Type · Mileage · Engine Hours · Licence Plate ·
  Color · Notes · `Save`. Contact and Make are required ("Contact is a required field", "Make is a required field"); a new customer has no contact, so add one first.
  Make offers e.g. Freightliner, Ford; Model offers e.g. M2, Explorer. Saved: "2022 Freightliner Em2 106 TRK-118" and "1999 Ford Explorer" (no unit).
  The same New Asset form opens from `New Work Order` → Asset `Add`. An asset with no make cannot be saved (proved: build-verify-2026-10-08/asset-without-make-claim.json).
- Example customers named in the cases ("Fibridge Commercial", "Fisquare Farms", "Zeta Hauling", "Alpha Freight", "Mid Trucking", "Trailer Shop") do NOT exist on this site (customer search, 2026-10-08); the cases now tell the tester to create them.

## Schedule (observed 2026-10-08, evidence schedule-page.txt, schedule-drop*.png, schedule-picker, wob36-wob50 logs)
- Day / Week / Month, `Today`, `Search work orders`, `Filters`; rows per technician grouped by department. Dragging a work order card onto a technician's row:
  a one-line work order is booked at once ("Shift scheduled." with `Undo`); a work order with several lines opens a picker: `Entire work order` · `Choose lines` ·
  Hours · `Cancel` · `Create 1 shift`. Clicking a shift opens its panel (with a delete icon, no confirmation).
- 🔴 The clear-shifts question the cases describe (its title and its keep / clear / cancel buttons) was NOT shown on this build: changing the lead by the Reassign
  dialog or by dragging, with the outgoing lead holding a whole-work-order shift, changed the lead at once and the shift stayed (proved: clear-shifts-prompt-claim.json).
  The cases that test the question carry "What you should see today".
- Tech View / Board View recheck: no `Collapse all` / `Expand all` button (each group has only "Collapse <name>"); `Column Selection` and `Fields to display` menus
  list ticks only, no search box. Board View column pin button is named "Pin <technician name>" / "Unpin <technician name>" (no visible tooltip text).

### Gate vocabulary — confirmed on sv10043 v26.40.8-7a95011, 2026-10-08
`New Customer` · `New Contact` · `New Asset` · `Contacts` · `Assets` · `Entire work order` · `Choose lines` · `Create 1 shift` · `Shift scheduled.` · `Admin ShopView` ·
`Lead technician updated` · `Lead technician removed` · `Reassign lead technician` · `Make is a required field`.
Staff that exist on this site and appear in cases: "Admin ShopView" (the Admin quick-login user), "Tech ShopView".

### Example data the tester creates or types (not screen labels; the cases say how to create each one)
Technicians "Esther Howard", "Ralph Edwards", "Jenny Wilson", "Kristin Watson", "Theresa Webb", "Dana Ortiz", "Brenda Martinez", "Cameron Williamson", "Floyd Miles",
"Aaron Keating", "Aaron Baker", "Aaron Zed", "Chris Lee", "James Smith", "Maximiliana Fitzgerald-Montgomery", "Sam Second", "Nora New", "Nina Newtech", "Ina Active",
"Ivan Inactive", "Ella Elsewhere", "Lena Otherloc", "Billy Nobill", "Nick Noclock", "Tim Clockuser", "Owen Office", "Olive Office", "Fay Financial", "Nate Nofinance",
"Vera Viewonly"; roles "WO View Only"; customers "Fibridge Commercial", "Fibridge Commercial Transport Services", "Fisquare Farms", "Zeta Hauling", "Alpha Freight",
"Mid Trucking", "Trailer Shop", "ZZ Board Test Co"; line labels "Line 1" … "Line 6 Clocked", "Line 1 Unassigned", "Oil change" (the build offers only ready-made lines;
the cases say so); tech story "Brought unit in. Completed inspection"; actual hours "0.02 / 2.00"; the comment "not checked by hand"; and every name beginning
"ZZAUTOTEST" (Rule 6 test-data tag), e.g. "ZZAUTOTEST Alpha Co" … "ZZAUTOTEST Zoe Zulu".

Further example data named in the cases (created or typed by the tester as each case's setup says; regression cases included):
"(c) not built - an asset needs a Make" · "Brake Pads" · "Brake inspection" · "Line 2" · "Line 2 Explicit" · "Line 2 Implicit" · "Line 3" · "Line 3 Complete" · "Line 3 Explicit" · "Line 4 Complete" · "Line 5 Logged" · "Pin column" · "ZZAUTOTEST Aardvark Co" · "ZZAUTOTEST Abbey Co" · "ZZAUTOTEST Board Unassigned" · "ZZAUTOTEST Bravo Co" · "ZZAUTOTEST Cal Charlie" · "ZZAUTOTEST Charlie Co" · "ZZAUTOTEST Columns" · "ZZAUTOTEST Dan Delta" · "ZZAUTOTEST Delta Co" · "ZZAUTOTEST Dispatcher Role" · "ZZAUTOTEST Dispatcher Two" · "ZZAUTOTEST Echo Co" · "ZZAUTOTEST Empty Columns" · "ZZAUTOTEST Empty Shop" · "ZZAUTOTEST Empty Tech" · "ZZAUTOTEST Empty Unassigned" · "ZZAUTOTEST Ezra Echo" · "ZZAUTOTEST Fibridge" · "ZZAUTOTEST Fisquare" · "ZZAUTOTEST Fresh" · "ZZAUTOTEST Golf Co" · "ZZAUTOTEST Grouping" · "ZZAUTOTEST Inv Co" · "ZZAUTOTEST Loc2" · "ZZAUTOTEST Loc2 Customer" · "ZZAUTOTEST Location 2" · "ZZAUTOTEST New Dispatcher" · "ZZAUTOTEST Newbie" · "ZZAUTOTEST No Money" · "ZZAUTOTEST Org B" · "ZZAUTOTEST OrgB Customer" · "ZZAUTOTEST OrgB Tech" · "ZZAUTOTEST Pin Order" · "ZZAUTOTEST Refresh" · "ZZAUTOTEST Regression Co" · "ZZAUTOTEST Site Co" · "ZZAUTOTEST Spare Co" · "ZZAUTOTEST Tab Co" · "ZZAUTOTEST Unassigned First" · "ZZAUTOTEST Viewer" · "ZZAUTOTEST WO View Only" · "ZZAUTOTEST WO view only" · "ZZAUTOTEST Xia X-ray" · "ZZAUTOTEST Yan Yankee"

Still NOT observed on this build (kept in the cases, so the label gate keeps flagging them on purpose): the clear-shifts question's title and its keep / clear buttons — see the Schedule section above.

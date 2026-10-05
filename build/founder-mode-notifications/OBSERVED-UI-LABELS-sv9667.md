# Observed UI labels — Founder Mode Notifications — sv9667 v26.40.7-7ffda69 (2026-10-05)
Evidence: build-verify-2026-10-05/nt-*.txt/png. Seeded: tag group "ZZAUTOTEST Service Team" (member Tech ShopView, personal),
quick note "ZZAUTOTEST Road test", notes on WO S2-4219 (Admin→group/Tech; Tech→@Admin ShopView) and part sale P9667-370.
- **Bell** (top right, next to the location name) → `/notifications/inbox`; badge shows the unread count (e.g. 1).
- Page **Notifications**, tabs **Inbox · Tag groups · Quick notes · Preferences** (each its own address: /notifications/inbox,
  /tag-groups, /quick-notes, /preferences). Inbox opens by default.
- Inbox controls: **Search** · **Unread only** · **Mark all read**; empty: "No unread notifications — There are no notifications
  for selected filters". Row: sender ("Admin ShopView") · pill "**Work Order: S2-4219**" · time "12:40 PM, Today" ·
  "**Tagged:** Tech ShopView" · per-row button **Mark as read** · message with @tags.
- **Tag groups** tab: **New tag group** · columns Name · Members · Visibility (Personal/…) · row edit / delete icons; empty "No tag groups.".
  Dialog **New tag group** / **Edit tag group**: fixed "@" + Name · Members (multi-select; "Add at least one member.") ·
  **Public tag group** toggle (off help: "Only you can see this group and tag it on a note.") · Cancel / **Create** (edit: **Save**).
  Toast "Tag group created". Delete: "**Delete tag group** — Are you sure you want to delete the tag group "<name>"?" Delete / Cancel.
- **Quick notes** tab: Search · **New quick note** · columns Name · Preview; empty "No quick notes.". Dialog **New quick note** /
  **Edit quick note**: Name · text "Use @ to tag team members or tag groups" · "0 / 2000" · "Tag groups:" pills · Cancel / Create (Save).
  Toast "Quick note created". Delete: "**Delete quick note** — Are you sure you want to delete the quick note "<name>"?".
- **Preferences** tab: card "Notification preferences" · toggle "Email notifications" · help "By turning this off you won't receive
  an email when you're tagged on a note. You'll still see it in your notifications." · **Save preferences**.
- **Notes tab** on work order / part sale / customer: Search · Sort By Newest First · upload icon · **New Note**; empty part sale:
  "No Part Sale Notes Yet … Create Your First Note". Note card: author · pill ("Work Order: S2-4219", "Part Sale: P9667-370",
  "Customer: 4 Star Truck Repair") · time · "Tagged: …" · menu ( … ): author → **Edit · Add attachment · Delete Note**;
  non-author admin → **Delete Note**. **Delete Note** dialog: "This note and its attachments will be deleted for everyone. This
  cannot be undone." Cancel / Delete.
- **New Note** dialog: work order → "**Create note for**: Work Order" list; text "Use @ to tag team members or tag groups";
  "2000 characters remaining"; "**Tag groups:**" pills (hover lists members); "**Quick notes:**" pills (hover shows the text);
  **Reminder Date**; **Customer Visible** (work order only; absent on part sale); Cancel / Save. "@" list starts with
  "Admin ShopView (You)" then team members (7 shown).
- Sign-in on a QA branch: only two quick-login users — **Admin** ("Admin ShopView", administrator) and **Tech** ("Tech ShopView",
  Technician, 6 permissions; can open Notifications and write work-order notes, and @-mention "Admin ShopView").
- Observation (not a ruling): Tech ShopView received the work-order note notification; the part-sale note sent the same way
  had not appeared in its inbox at the time of reading (C154702 covers this — run session confirms).

### Gate vocabulary — confirmed on sv9667 v26.40.7-7ffda69, 2026-10-05 (evidence build-verify-2026-10-05/nt-*)
`Notifications` · `Inbox` · `Tag groups` · `Quick notes` · `Preferences` · `Search` · `Unread only` · `Mark all read` · `Mark as read` ·
`New tag group` · `Edit tag group` · `Delete tag group` · `Public tag group` · `Members` · `Name` · `Visibility` · `Create` · `Save` · `Cancel` · `Delete` ·
`New quick note` · `Edit quick note` · `Delete quick note` · `Preview` · `Notification preferences` · `Email notifications` · `Save preferences` ·
`New Note` · `Create note for` · `Tag groups:` · `Quick notes:` · `Reminder Date` · `Customer Visible` · `Delete Note` · `Edit` · `Add attachment` ·
`Tagged:` · `Notes` · `Sort By` · `Admin ShopView` · `Tech ShopView` · `Change Location` · `Create Work Order` · `Part Sales` · `Work Orders` ·
`Customers` · `Assets` · `Roles & Permissions` · `Create Custom Role` · `Choose a template` · `Service Advisor` · `Technician` · `Edit Staff Member` · `Staff` ·
`Work orders` · `Part sales` · `Customers` · `Collect In Portal` · `Dashboard` · `Admin ShopView (You)`.
Locations on this build: "Staging Heavy Duty - 9919" · "Staging Lethbridge - 4310" · "QB Location".
Staff used as examples (exist on this build): "Ashlee Thomas" · "Ashley Schultz" · "Amy Fernandez" · "Angelica Harper".
### Example data the tester types (not screen labels)
Tag-group, quick-note and role names such as "Service Team", "Waiting on parts", "Techs", "ZZ Pair", "ZZ Public team", "ZZ Personal team",
"ZZ Public team 2", "ZZ Note", "ZZ L1 public", "ZZ L2 public", "ZZ work order secret", "ZZ part sale hello", and any name beginning "ZZAUTOTEST".
Role names typed by the tester: "ZZAUTOTEST Work orders only" · "ZZAUTOTEST Customers only" · "ZZAUTOTEST Part sales only" · "ZZAUTOTEST PS and customer delete" ·
"ZZAUTOTEST WO delete" · "ZZAUTOTEST No work order or customer view" · "ZZAUTOTEST No work order view" · "ZZAUTOTEST Editors" · "ZZAUTOTEST View only".
Example message text typed by the tester: "Vehicle is waiting on parts; will update the customer" · "@Service Team please road test" ·
"Please check this @Tech ShopView and @ZZ Pair today" · "@ me if urgent".
Wording the cases quote from their own instructions (not screen labels): "Sign in as User C" · "Another user at the location" · "another user" · "that is not a tag (e.g".

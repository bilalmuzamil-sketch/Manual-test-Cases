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

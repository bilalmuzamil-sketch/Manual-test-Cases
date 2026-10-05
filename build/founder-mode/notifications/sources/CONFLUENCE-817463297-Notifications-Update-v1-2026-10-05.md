# Notifications Update V1 — verbatim source copy

- Confluence page 817463297, title "Notifications Update V1", lastModified Oct 02, 2026, read 2026-10-05 via Atlassian MCP (markdown).

---

|  |  |
| --- | --- |
| **Epic** | [SV-9667](https://shopview.atlassian.net/browse/SV-9667) |
| **Owner** | @Chris Ward |
| **Status** | Locked for build - 2026-09-17 |
| **Design** | <https://claude.ai/artifact/CmsxESdXv2Y2YTGyTVVLg7> |

# Notifications Center

## 1. Business Case

ShopView's notes let a user leave a note on a work order and tag people in it, but there has never been one place where a person can see everything addressed to them. There has also been no way to reuse a set of recipients or a message, and no way for a person to decide whether a tag reaches them by email as well as in the app.

The Notifications Center fixes this without introducing a new system. Every user gets one inbox for the notifications addressed to them, with search and an unread filter. Every user who can see work order or part sale notes manages their own tag groups (reusable recipient lists), their own quick notes (reusable message bodies), and whether they receive email, from tabs on that same Notifications page. A tag group can be kept personal or made public to the location, so a shop can build shared lists once, and an admin can maintain the public ones. The result is that a user finds what is addressed to them in one place and self-serves the lists and messages they use every day, with no administrator setup.

## 2. Feature Overview

**Core**

\- A **Notifications** inbox, opened from the bell icon in the top navigation, listing the notifications addressed to the signed-in user. It is a single list.

\- The inbox has a **search** box, an **Unread only** filter, and a **Mark all read** action. It is a view-and-manage surface: notes are written on a record (a work order, a work order line, or a part sale), never from the inbox itself.

\- The Notifications page carries its own tabs: **Inbox**, **Tag groups**, **Quick notes** and **Preferences**. Everything behind them belongs to the signed-in user, with one exception: public tag groups are shared with everyone at the location.

\- A tag group is a saved list of recipients. It is **personal** by default (only its owner sees it) and can be made **public** (everyone at the location sees it and can tag it on a note). A public group can be renamed, re-membered or deleted by its owner and by any admin.

\- Composing a note lets the user tag team members or tag groups by typing `@`, click a tag group or a quick note as a pill, and (on a work order note) mark the note **Customer Visible**.

\- Deleting a note removes it for everyone: from the record and from every recipient's inbox.

\- Each user sets their own **Preferences**: whether they receive email when tagged. In-app delivery is always on.

**Out of Scope**

\- Scheduling or delaying a notification to send later. Notifications send when the note is saved.

\- Composing a note from the inbox. The inbox has no compose action.

\- A note with no record behind it (a standalone, general note). The application has no way to create one.

\- Any change to the Reminder Date field. It stays in the New Note dialog exactly as it is today, and the Reminders report, the dashboard's reminders panel and the urgent-reminder signal on the bell keep reading it.

\- Notification priority (a "high priority" flag or sort).

\- Filtering the inbox by the type of the referenced record, by sender, or by any sort control.

\- A public quick note. Every quick note belongs to the user who created it.

\- An organization-level delivery control, or an administrator deciding delivery on behalf of a user. Email preference is per user only.

\- A tag group that spans locations. A tag group belongs to one location and its members are staff of that location.

\- Notifying anyone when a customer writes a note through the Customer Portal. A portal note lands on the record and is read there; it tags nobody, because a customer has no way to tag, so it reaches no inbox. This is how it behaves today and this feature does not change it.

\- Any behavior change to notes shown on records beyond what is described here.

## 3. Jobs to be Done / Goals

\- **When** something across the shop is addressed to me, **I want** one place that lists it, **so I can** act on it without opening each record.

\- **When** I regularly notify the same people, **I want** to save that set as a tag group and tag it with `@`, **so I can** reach all of them at once.

\- **When** my team all notify the same people, **I want** one public tag group we can all use, **so I can** stop every person keeping their own copy of the same list.

\- **When** I send the same message often, **I want** to insert a saved quick note, **so I can** stay consistent and save typing.

\- **When** I decide how I want to be reached, **I want** to turn my own email notifications on or off, **so I can** control my own inbox without asking an administrator.

Measurable goals:

\- Give every user a single inbox for the notifications addressed to them.

\- Let every user who writes notes self-serve their own tag groups, quick notes and email preference with no administrator setup.

\- Let a location share tag groups, and let an admin keep the shared ones correct when their owner is away or gone.

## 4. Key Decisions

\- **Delete is one action, and it is shared.** Deleting a note removes it from the record for everyone and from every recipient's inbox. There is no archive, no restore, no separate permanent delete, and no way for a recipient to clear a notification from their own inbox alone.

\- **The tag group Name field shows the **`@`** rather than asking the user to type it.** A tag group exists to be tagged, and the field is where a user first meets that idea, so the symbol is shown as a fixed part of the field and cannot be deleted. It is presentation only: the name itself never contains it. **Rejected:** leaving the user to type `@` into the name. That stores the symbol inside the name, so the same group reads as "@Sales" in one place and "Sales" in another, and a user who does not type it ends up with a group that looks different from everyone else's.

\- **A user can **`@`** themselves, the way they would CC themselves on an email.** A writer often wants the note in their own inbox: to find it again, to carry it into tomorrow, or to have the email copy. Tagging a group they belong to already did this, so the direct route was the only one closed. **Rejected:** keeping the user out of their own `@` list, which is what the list did before. It made the two routes disagree, and left a user who wanted a copy tagging a colleague instead.

\- `@`** tags either a person or a tag group.** There is no separate recipient dropdown. Typing `@` offers team members and tag groups together (people first, a divider, then tag groups). Picking a tag group drops `@<group name>` into the message, and on save it expands to that group's members.

\- **Tag groups, quick notes and preferences are tabs on the Notifications page.** They sit beside the Inbox, on the page the bell already opens, because that is where the tag they configure arrives. A tag group belongs to the person who made it, a quick note is theirs alone, and a preference decides what reaches them; none of it is shop configuration.

\- **A tag group is personal by default and can be made public.** Personal is the safe default: a group becomes visible to other people only when its owner deliberately says so. Public means everyone at the location can see it and tag it.

\- **A public tag group is maintainable by an admin.** Its owner and any admin can rename it, change its members or delete it. A personal tag group stays the owner's alone; an admin cannot see it or touch it. This is what keeps a shared list correct when its owner is away, has left, or named it badly.

\- **The inbox follows the active location.** Switching location changes which notifications the inbox lists and the bell counts. This covers notifications from notes on work orders, work order lines and part sales, which belong to a location. Notes on a customer or an asset have no location, so their notifications are listed and counted whichever location is active. They tag and notify exactly like every other note: today a customer or asset note can already tag team members and email them, and this feature keeps that and brings those notes into the inbox (@chris ruling, 2026-09-25). **Rejected:** keeping today's organization-wide inbox with only tag groups following the location. Organization-wide is fundamentally broken, so it is cut now rather than carried into this release. Run by Fabian and Sasha, 2026-09-23.

\- **A tag group is location-scoped.** It belongs to the location that is active when it is created, and its members can only be staff of that location. The dialog does not restate the location, because the Notifications Center follows the active location (S1-R18) and the location selector at the top right already shows it.

\- **Quick notes are strictly per user.** There is no public quick note.

\- **In-app is always on; the only delivery choice is email.** The Notifications Center is the in-app surface, so a user cannot turn in-app off. Each user turns only their own email on or off. A user who has never saved a preference receives email, so introducing the choice can never silently drop a notification.

\- **The author is a recipient.** If the author belongs to a tag group they tagged, or `@`-mentions themselves, they are notified like anyone else.

\- **Editing a note belongs to its author, and to nobody else.** A note carries its author's name, so another person editing it puts words in that author's mouth while the attribution stays put. No permission and no role makes that reasonable. **Rejected:** letting an admin edit, and letting anyone holding the record's View permission edit, which is what SV-8003 specified on 2026-07-08 and what the application does today. That rule means nearly everyone in a shop can rewrite anyone's note.

\- **Deleting a note is moderation, so it follows the Delete permission.** Taking down something wrong, offensive, or written on the wrong job is a supervisor's task, and Delete is the permission that already means "you may remove things here". The author may always delete their own. **Rejected:** an admin-only rule, which invents a second idea of who is in charge alongside the permissions the shop already configures.

\- **No new permission.** Nothing in this feature introduces a permission of its own. Every gate in this document reuses a permission the application already has.

## 5. Terminology

\- **Notification / note** → The same object. On a record it is a "note"; the inbox is the view of the notes that address the current user (through an `@`-mention or a tag group they belong to). This document uses "note" for the object and "notification" for its appearance in the inbox.

\- **Tag group** → A saved, reusable list of recipients, belonging to one location. Tagging a group on a note tags every member of it. A tag group is either personal or public.

\- **Personal tag group** → A tag group only its owner can see, tag and manage.

\- **Public tag group** → A tag group everyone at its location can see and tag. Its owner and any admin can manage it.

\- **Quick note** → A user's saved, reusable message body that can be inserted into a note.

\- **Recipient** → A person a note notifies: someone `@`-mentioned in it, or a member of a tag group it tags. The author is a recipient when they are `@`-mentioned or belong to a tagged group.

\- **Tagged** → The label on a note listing everyone who was copied on it, the way a CC line does. Those are the note's recipients other than its author.

\- **Admin** → A user whose role is the standard Admin role, recognized by the role it was created from rather than by its name, so renaming the role does not change who counts. No other role counts as admin anywhere in this document.

\- **Active location** → The location selected in the top-right location selector. Everything location-scoped in this document uses it.

## 6. Assumptions

\- A note keeps the tag text it was written with. After a tag group is renamed, a note that tagged it still reads `@` and the old name. If that note is edited later, the old text no longer matches the group, so under S3-E2 the group drops out of its recipients. People already notified keep their notification. Accepted deliberately.

\- Every note hangs off a record: a work order, a work order line, a part sale, a customer or an asset. The application has no way to create one without, and no screen offers it.

## 7. Requirements

### Story 1: Work the Notifications inbox

As a user, I want one inbox for everything addressed to me so that I can act on it without opening each record.

**Jira:** [SV-10244](https://shopview.atlassian.net/browse/SV-10244)

**Prerequisites:**

\- The user is signed in.

**Requirements:**

\- **S1-R1:** A bell icon in the top navigation opens the Notifications inbox.

\- **S1-R2:** The bell shows a badge with the count of the user's unread notifications.

\- **S1-R3:** The badge shows the exact count up to 99, and "99+" for 100 or more.

\- **S1-R4:** The Inbox tab is a single list. It has no second view, no archive and no grouping. The tab strip described in Story 5 sits on the page around it, not inside the list.

\- **S1-R5:** The list shows the notifications addressed to the user whose note has not been deleted.

\- **S1-R6:** A search box filters the list as the user types.

\- **S1-R6a:** The search box starts as a **Search** button. Clicking it opens the search box in place. The box stays open when the search is cleared, the same as search on the Inventory list.

\- **S1-R7:** Search matches any part of the sender's name, the reference shown on the notification, or the notification text.

\- **S1-R8:** Search matches on partial text and ignores letter case.

\- **S1-R9:** An **Unread only** filter narrows the list to unread notifications.

\- **S1-R10:** The **Unread only** filter is on when the user first opens the inbox.

\- **S1-R10a:** The **Unread only** control is a single toggle button labeled "Unread only" in both states. It is filled in the app's primary blue when on and outlined when off.

\- **S1-R11:** The **Unread only** setting is remembered for that USER across page loads until they change it. It is not remembered for the browser: a shared shop terminal must not let one person's choice decide what the next person sees.

\- **S1-R12:** A **Mark all read** action marks every unread notification as read.

\- **S1-R13:** Notifications are listed newest first.

\- **S1-R14:** The inbox loads 50 notifications at a time.

\- **S1-R15:** While a full page of 50 has come back, a **Load more** action below the list fetches the next 50.

\- **S1-R16:** Searching starts again from the first page of results.

\- **S1-R17:** On release, every user starts from the default again: the remembered **Unread only** choice is now held per person rather than per browser, so anything stored under the old shared key is ignored. Nobody loses anything but a toggle position, and re-flipping it stores it against them.

\- **S1-R18:** The inbox lists, and the bell counts, notifications from notes on work orders, work order lines and part sales that belong to the active location, and notifications from notes on a customer or an asset, whichever location is active.

\- **S1-R19:** Switching the active location changes what the inbox lists and what the bell counts to that location's notifications.

\- **S1-R20:** **Mark all read** marks every unread notification in the inbox as read.

\- **S1-R21:** A notification is listed and counted only for a user who can view the record its note is on: 'Work Orders → View' for a work order or work order line, 'Part Sales → View' for a part sale, 'Customers → View' for a customer, and the same access that opens an asset today for an asset.

\- **S1-R22:** The notifications card on the dashboard follows the same rule as the inbox (S1-R21). It never shows the text of a note the user could not see in their inbox.

**Negative cases:**

\- **S1-N1:** The inbox has no Archived view, no Restore action and no per-user dismiss. A recipient cannot remove a notification from their own inbox while leaving it on the record.

\- **S1-N2:** When the user has no unread notifications, the **Mark all read** action is disabled.

\- **S1-N3:** When the user has no unread notifications, hovering the disabled **Mark all read** action shows the tooltip "No unread notifications".

\- **S1-N4:** When the bell count is zero, no badge is shown.

\- **S1-N5:** The inbox has no compose action.

\- **S1-N6:** The inbox has no sender filter and no sort control.

\- **S1-N7:** The inbox is never organization-wide. A notification from a note at another location is neither listed nor counted until the user switches to that location.

\- **S1-N8:** A notification from a note on a customer or an asset is never hidden by switching location. Those notes have no location, so they are listed and counted at every location.

\- **S1-N9:** The live "New mention" pop-up follows the inbox. It does not appear for a note at another location (S1-N7). A note on a customer or an asset shows it at every location (S1-N8).

*\\\* Context note: the reference in S1-R7 is the label of the record the notification is about, most often a work order or part sale number such as S99-15591 (see Story 2).*

### Story 2: Read a notification

As a user, I want each notification to show me who sent it, what it is about and who else was copied, so that I can judge it without opening the record.

**Jira:** [SV-10245](https://shopview.atlassian.net/browse/SV-10245)

**Prerequisites:**

\- The inbox is showing at least one notification.

**Requirements:**

\- **S2-R1:** A notification's top line shows the sender's name, then the referenced record as a pill, then (when present) an "edited" stamp.

\- **S2-R2:** Below the top line, the notification shows the time it was sent.

\- **S2-R3:** When the note has recipients other than its author, a **Tagged:** line names them.

\- **S2-R4:** The reference pill links to the referenced record.

\- **S2-R5:** For a work order, the reference pill reads "Work Order: S\\\<shop\\\>-\\\<number\\\>" (for example, "Work Order: S99-15591").

\- **S2-R6:** For a part sale, the reference pill reads "Part Sale: P\\\<shop\\\>-\\\<number\\\>" (for example, "Part Sale: P99-4021").

\- **S2-R7:** For a work order line, the reference pill reads "Line: " followed by the work order number, the line's position, its name and its description.

\- **S2-R7a:** For a customer, the reference pill reads "Customer: " followed by the customer's name.

\- **S2-R7b:** For an asset, the reference pill reads "Asset: Unit " followed by the unit number, a comma and the year, make and model (for example, "Asset: Unit 546, 2019 Freightliner Cascadia"). When the asset has no unit number it reads "Asset: " followed by the year, make and model.

\- **S2-R8:** The **Tagged:** line shows two recipient names inline, then "+N more" for the rest (for example, "Ashlee Thomas, Ashley Schultz +2 more"). The two shown are the first two in the order the author tagged them; the hover carries the full list.

\- **S2-R9:** Hovering the **Tagged:** line shows every recipient's name.

\- **S2-R10:** The message text is shown exactly as it was written, with the `@` tags left in place.

\- **S2-R11:** The user can toggle a single notification between read and unread.

\- **S2-R12:** When a notification has attachments, they are shown on the notification.

\- **S2-R13:** The "edited" stamp reads "Edited on \\\<date\\\>", where the date is written like "Sep 8, 2026". It does not name the editor, because only the author can edit a note and the author is already named on the notification.

\- **S2-R13a:** The **Tagged:** line (S2-R3) and the "Edited on" stamp (S2-R13) also show on each note on every Notes tab: work order, work order line, part sale, customer and asset. The **Tagged:** line names the people the note reached when it was sent, so a tagged group is shown as the members it had at that moment.

\- **S2-R13b:** In a note's message, tags (@people and @groups) are shown in blue. All other text is in the normal text color.

**Negative cases:**

\- **S2-N1:** The **Tagged:** line is not shown when the only recipient is the note's own author; it never lists the author.

\- **S2-N2:** Recipient email addresses are never shown on the notification, including on hover.

\- **S2-N3:** A plain "@" in the message that is not a recipient tag (for example, "@ me if urgent") is left in the message text.

\- **S2-N4:** The "edited" stamp is not shown on a note that has never been edited.

*\\\* Context note on S2-R5 and S2-R6: the shop segment is the shop id the Work Order or Part Sale screen shows for that order (the invoice's shop id when the order has been invoiced, otherwise the location's current shop id), so the pill matches those screens exactly.*

*\\\* Context note on S2-R10: an earlier version of this feature stripped the *`@`* tags out of the posted note on the grounds that the **Tagged:** line already listed the recipients. That is reversed, because removing them changed the author's sentence and left a reader unable to see who a line of the message was aimed at.*

### Story 3: Compose a note

As a user, I want to tag people and tag groups and reuse my quick notes while writing, so that I reach the right people without retyping.

**Jira:** [SV-10246](https://shopview.atlassian.net/browse/SV-10246)

**Prerequisites:**

\- The user is adding a note from a record that supports notes: a work order, a work order line, or a part sale.

\- For a work order or work order line, the user has 'Work Orders → View'.

\- For a part sale, the user has 'Part Sales → View'.

**Requirements:**

\- **S3-R1:** The compose dialog is titled "New Note" when creating and "Update Note" when editing.

\- **S3-R2:** When more than one record could be the note's subject, a "Create note for" field selects the subject.

\- **S3-R3:** The message box is labeled "Use @ to tag team members or tag groups".

\- **S3-R4:** The message box shows how many characters remain, as "\\\<N\\\> characters remaining", out of 2,000.

\- **S3-R5:** Typing `@` opens a list that offers both team members and tag groups.

\- **S3-R6:** In the `@` list, team members appear first, then a divider, then tag groups.

\- **S3-R7:** In the `@` list, a tag group is marked with a "(Tag group)" hint after its name.

\- **S3-R8:** The `@` list shows at most seven team members at a time, ordered by first name. Typing narrows the matches across the WHOLE staff list before the cap applies, so nobody is hidden by it. The cap exists because tag groups are listed below the people: without it a long staff directory would push the tag groups off the bottom of the list.

\- **S3-R9:** The `@` list shows every matching tag group, with no cap.

\- **S3-R10:** The tag groups offered are the user's own groups and every public group at the active location. The same applies on a customer or asset note: it has no location, so the public groups offered are those at the location the user is signed into.

\- **S3-R11:** A "Tag groups:" row shows those same tag groups as clickable pills; clicking a pill inserts `@<group name>` into the message.

\- **S3-R12:** Hovering a tag group pill shows that group's member names.

\- **S3-R13:** A "Quick notes:" row shows the user's quick notes as clickable pills; clicking a pill inserts its body text into the message.

\- **S3-R14:** Hovering a quick note pill shows that quick note's body text.

\- **S3-R15:** A "Customer Visible" checkbox is shown only on a work order note.

\- **S3-R16:** On Save, the note is sent to every member of each tagged group and to every `@`-mentioned person, with duplicates removed.

\- **S3-R17:** The author is notified when they are among the recipients (for example, they tagged a group they belong to).

\- **S3-R18:** Typing `@` offers the user themselves, listed among the team members with a "(You)" hint after their name.

\- **S3-R19:** Choosing themselves inserts their plain name, with no hint, so the tag reads in the message exactly like a tag on anyone else.

\- **S3-R20:** A user who tags themselves is notified like any other recipient, in their inbox and by email, subject to their own Preferences (Story 8).

**Negative cases:**

\- **S3-N1:** A person who is both in a tagged group and `@`-mentioned is notified once, not twice.

\- **S3-N2:** The "Customer Visible" checkbox is not shown on a work order line note or a part sale note.

\- **S3-N3:** The "Quick notes:" row is not shown when the user has no quick notes.

\- **S3-N4:** The "Tag groups:" row is not shown when the user has no tag groups available.

\- **S3-N5:** The compose dialog has no recipient dropdown and no send-later field. It keeps the existing Reminder Date field exactly as it is today; this project does not add it, remove it or change it.

\- **S3-N6:** A note written on a customer or an asset is composed exactly like any other note: typing `@` offers the same team members and tag groups, and saving the note notifies everyone it tags.

\- **S3-N7:** Tagging yourself is never automatic. A note notifies its author only when the author is a recipient: tagged directly, or a member of a tagged group.

\- **S3-N8:** A user who tags themselves and also tags a group they belong to is notified once, not twice.

**Edge cases:**

\- **S3-E1:** Inserting a quick note never pushes the message past 2,000 characters; the inserted text is cut to fit.

\- **S3-E2:** A tag group counts as tagged only while its `@<group name>` text is still in the message; deleting that text removes the group from the recipients.

\- **S3-E3:** Inserting a quick note that itself tags people or tag groups also tags them on the note being composed.

\- **S3-E4:** A note does not have to tag anyone. A note saved with no `@`-mention and no tag group is kept on its record and notifies no one.

\- **S3-E5:** A note is deleted for everyone at once (S4-R5), so nobody is told about a deletion as such; what the deletion does is refresh the unread count and any open inbox so they stop showing a note that no longer exists. Everyone the note reached gets that refresh EXCEPT the person who pressed Delete, who does not need their own action reflected back at them. An author who tagged themselves is refreshed like any other recipient when somebody else deletes the note.

*\* Context note on S3-E5: the rule is about the actor, not the author. Until self-tagging existed the two were indistinguishable, because the author was almost always the person deleting, and the code compared against the author. An author who copies themselves (S3-R18) is an ordinary recipient, so an admin deleting their note must leave their screen correct. A deletion with no signed-in user behind it, such as a system purge, refreshes everyone.*

*\\\* Context note on S3-R11: clicking a tag group pill and picking the group in the *`@`* list do the same thing. Both insert the *`@<group name>`* tag and tag the group.*

*\\\* Context note on S3-N6: corrected 2026-09-25. Customer and asset notes can already tag team members in production, the tag is saved and the people tagged get an email; an earlier version of this PRD said otherwise. They now also reach the inbox (S1-R18, S1-N8).*

*\\\* Context note on S3-R15: Customer Visible is an existing work order note capability. Marking a work order note Customer Visible emails the work order's customer contact a link to the customer portal; the note's internal *`@`* tags are stripped from that email, so the customer does not see the tagged names.*

### Story 4: Delete a note

As a note author, I want to remove a note I wrote, so that a mistake does not stay on the record.

**Jira:** [SV-10247](https://shopview.atlassian.net/browse/SV-10247)

**Prerequisites:**

\- The user is viewing a note on a record.

\- The user is the note's author, or holds Delete for the kind of record the note is on.

**Requirements:**

\- **S4-R1:** A note offers a "Delete Note" action in its actions menu.

\- **S4-R2:** Choosing "Delete Note" opens a confirmation dialog titled "Delete Note".

\- **S4-R3:** The confirmation reads "This note and its attachments will be deleted for everyone. This cannot be undone."

\- **S4-R4:** The confirmation's confirm button reads "Delete".

\- **S4-R5:** Confirming removes the note from the record for everyone.

\- **S4-R6:** Confirming removes the note from the inbox of everyone it notified.

\- **S4-R7:** Confirming removes the note's attachments.

**Negative cases:**

\- **S4-N1:** A user who is neither the note's author nor a holder of Delete for that kind of record is not offered "Delete Note" on that note.

\- **S4-N2:** A user who is not the note's author is not offered edit on that note, whatever permissions or role they hold.

\- **S4-N3:** There is no Archived view, no Restore action and no Delete Forever action anywhere in this feature.

\- **S4-N4:** A recipient cannot dismiss a notification from their own inbox. Deleting is the author's action on the record, not a per-person action on a copy.

*\\\* Context note on deletion leaving no trace: a deleted note is gone from the record and from every inbox, and nothing records that it existed - not a history entry, not a stamp, nothing. That is the behavior today and it is deliberately unchanged here. It is written down so it reads as a decision rather than an oversight, because the product has a View History Logs permission elsewhere that sets the opposite expectation.*

*\\\* Context note: this is the delete behavior the application already has. An archive model with a Restore and a Delete Forever was built on top of it during development and then removed; delete is the single, shared action described above.*

### Story 5: Reach tag groups, quick notes and preferences

As a user who writes notes, I want to manage my tag groups, quick notes and email preference from the same place I read my notifications, so that I can set them up myself where the tags arrive.

**Jira:** [SV-10248](https://shopview.atlassian.net/browse/SV-10248)

**Prerequisites:**

\- The user is signed in.

\- The user has 'Work Orders -\> View' or 'Part Sales -\> View'.

**Requirements:**

\- **S5-R1:** The bell icon in the top navigation opens the Notifications page.

\- **S5-R2:** The Notifications page has a tab strip with four tabs, in this order: **Inbox**, **Tag groups**, **Quick notes**, **Preferences**.

\- **S5-R3:** Opening the page from the bell selects the **Inbox** tab.

\- **S5-R4:** The other three tabs open the user's tag groups (Story 6), their quick notes (Story 7) and their preferences (Story 8).

\- **S5-R5:** Every user who can open the Notifications page sees all four tabs. No tab is gated on a settings permission.

\- **S5-R6:** Each tab has its own address, so a user can return to one directly and a link can point at one.

**Negative cases:**

\- **S5-N1:** A user without 'Work Orders → View' and without 'Part Sales → View' can still open the Notifications page. They see no work order, work order line or part sale notifications. They still see notifications from customer notes when they hold 'Customers → View', and from asset notes when they can open the asset (S1-R21). What a person sees is decided per notification, against the record it is about, rather than by a gate on the page. Nothing redirects them, and the bell behaves for them exactly as it does today.

\- **S5-N2:** No part of the Notifications page is hidden from a user who can open it. There is no admin-only tab and no admin-only control on any tab.

*\\\* Context note on S5-R5: a public tag group is visible to every member of its location, so an admin who needs to maintain one finds it on their own Tag groups tab. That is why no admin-only surface is needed and none is provided.*

### Story 6: Manage tag groups

As a user, I want to build and share recipient lists, so that I and my team can tag the right people in one step.

**Jira:** [SV-10249](https://shopview.atlassian.net/browse/SV-10249)

**Prerequisites:**

\- The user has opened the **Tag groups** tab on the Notifications page.

\- An active location is selected.

**Requirements:**

\- **S6-R1:** The Tag groups tab lists the user's own tag groups and every public tag group at the active location.

\- **S6-R2:** The list has the columns **Name**, **Members** and **Visibility**.

\- **S6-R3:** The **Members** cell shows member names, with a "+N" count when there are more than fit.

\- **S6-R4:** The **Visibility** cell reads "Personal" or "Public".

\- **S6-R5:** When there are no groups to show, the list reads "No tag groups."

\- **S6-R6:** A **New tag group** button opens a dialog titled "New tag group".

\- **S6-R7:** The dialog has a **Name** field, a **Members** multi-select, and a **Public tag group** toggle.

\- **S6-R8:** **Name** is required and is at most 40 characters. The field stops accepting input at 40; it does not accept a longer value and then reject it on save.

\- **S6-R8a:** The **Name** field carries a fixed `@` at its left edge, before the typing area. It is always shown, in the New tag group dialog and in the Edit tag group dialog alike.

\- **S6-R8b:** The `@` cannot be removed. It cannot be selected, deleted, typed over, or cut. The caret sits after it whenever the field has focus, including when the user presses Home or holds the left arrow, and Select All selects only the typed text.

\- **S6-R8c:** The `@` reads as part of the field rather than as a character the user typed. It is shown in the field's secondary text color rather than the color of the typed value, and a hairline rule separates it from the typing area. The typed value keeps the ordinary input color and weight.

\- **S6-R8d:** The `@` is not part of the group's name. The name saved, listed on the Tag groups tab, checked for duplicates and shown anywhere else in the product is the typed text alone, with no `@`.

\- **S6-R8e:** The `@` does not count toward the 40-character limit in S6-R8. A user can type 40 characters after it.

\- **S6-R8f:** If the user types `@` as the first character of the name, it is not inserted. The field never shows two of them.

\- **S6-R8g:** A `@` typed anywhere other than the first position is accepted as an ordinary character, because it is part of the name the user chose.

\- **S6-R8h:** When the Edit dialog opens on a group whose stored name begins with `@`, that leading `@` is not shown in the typing area, because the fixed prefix already supplies it. Saving stores the name without it.

\- **S6-R9:** The **Members** picker offers only staff who belong to the active location.

\- **S6-R26:** **Members** is required. A tag group holds at least one member.

\- **S6-R27:** While no member is selected, the dialog's confirm button is disabled: "Create" on a new group, "Save" on an edit.

\- **S6-R28:** Removing the last member of an existing group disables **Save** for as long as the group has no members. The member cannot be removed and saved away.

\- **S6-R29:** The disabled confirm button carries the tooltip "Add at least one member."

\- **S6-R10:** The **Public tag group** toggle is off by default.

\- **S6-R11:** With the toggle off, the help text under it reads "Only you can see this group and tag it on a note."

\- **S6-R12:** With the toggle on, the help text reads "Everyone at this location can see this group and tag it on a note. You and any admin can rename it, change its members, or delete it."

\- **S6-R13:** A new tag group belongs to the active location, and that location is fixed for the life of the group.

\- **S6-R14:** Creating a group confirms with the success message "Tag group created".

\- **S6-R15:** The owner of a group, or any admin when the group is public, sees **Edit** and **Delete** actions on its row.

\- **S6-R16:** **Edit** opens the same dialog titled "Edit tag group".

\- **S6-R17:** Saving an edit confirms with the success message "Tag group updated".

\- **S6-R18:** **Delete** opens a confirmation titled "Delete tag group" whose confirm button reads "Delete".

\- **S6-R19:** For a personal group, the confirmation reads "Are you sure you want to delete the tag group "\\\<name\\\>"?"

\- **S6-R20:** For a public group, the confirmation reads "Are you sure you want to delete the tag group "\\\<name\\\>"? This is a public tag group: deleting it removes it for everyone at this location, and any note already tagged with it keeps its text but loses the group."

\- **S6-R21:** Confirming a delete confirms with the success message "Tag group deleted".

\- **S6-R22:** A public group is visible to, and taggable by, every user at its location.

\- **S6-R23:** A personal group is visible to, and taggable by, its owner only.

\- **S6-R24:** Hovering a row shows every member's name.

\- **S6-R25:** The "Edit tag group" dialog opens with the group's name, members and visibility already filled in.

\- **S6-R30:** A user can include themselves in a tag group's members, and the Members picker offers them.

**Negative cases:**

\- **S6-N1:** Saving a personal group whose name matches another group the user already owns at that location is refused, with the inline message on the Name field: "You already have a tag group with this name at this location."

\- **S6-N2:** Saving a public group whose name matches another public group at that location is refused, with the inline message on the Name field: "A public tag group with this name already exists at this location."

\- **S6-N3:** The name check runs on create, on rename, and when a group is switched from personal to public without a rename.

\- **S6-N4:** Another user's personal group is never listed and can never be tagged.

\- **S6-N5:** A user who is neither the owner nor an admin sees no **Edit** or **Delete** on a public group.

\- **S6-N6:** An admin cannot edit or delete another user's personal group.

\- **S6-N7:** The dialog does not show or let the user choose a location.

\- **S6-N8:** The picker never offers staff from another location.

**Edge cases:**

\- **S6-E1:** Switching a public group back to personal hides it from everyone but its owner immediately.

\- **S6-E2:** Two users may each own a personal group with the same name at the same location.

\- **S6-E3:** An admin renaming another user's public group does not change who owns it.

\- **S6-E4:** A group with no members cannot be saved, in either direction: it cannot be created empty and an existing group cannot be emptied.

\- **S6-E6:** A group whose only member leaves the location keeps that member until someone edits the group. The rule is enforced in the dialog, not by a background sweep.

\- **S6-E7:** When an admin edits another user's public group, the **Public tag group** toggle is shown on and disabled. Only the owner can switch a group between public and personal (S10-R7).

*\\\* Context note on S6-N1 and S6-N2: the two checks are deliberately different in scope. A personal name only has to be unique among the owner's own groups, so two people can each keep a personal "Techs". A public name has to be unique among every public group at the location, because everyone there sees it in the same *`@`* list. A personal group may share a name with someone else's public group; when that happens the user sees both in their *`@`* list, each marked "(Tag group)".*

*\\\* Context note on S6-R13: the dialog does not restate the location because the Notifications Center follows the active location (S1-R18), and the location selector at the top right already shows it.*

### Story 7: Manage quick notes

As a user, I want to save the messages I send often, so that I can insert them instead of retyping.

**Jira:** [SV-10250](https://shopview.atlassian.net/browse/SV-10250)

**Prerequisites:**

\- The user has opened the **Quick notes** tab on the Notifications page.

**Requirements:**

\- **S7-R1:** The Quick notes tab lists the user's own quick notes, with the columns **Name** and **Preview**.

\- **S7-R2:** The **Preview** column shows the start of the quick note's body.

\- **S7-R3:** A search box filters the list by name as the user types.

\- **S7-R4:** A **New quick note** button opens a dialog titled "New quick note".

\- **S7-R5:** The dialog has a **Name** field and a body field.

\- **S7-R6:** **Name** is required and is at most 40 characters. The field stops accepting input at 40; it does not accept a longer value and then reject it on save.

\- **S7-R7:** The body field is labeled "Use @ to tag team members or tag groups", is required, and is at most 2,000 characters, the same cap as the message it is inserted into.

\- **S7-R8:** In the body, typing `@` offers team members and tag groups the same way the compose dialog does (Story 3).

\- **S7-R9:** A "Tag groups:" row of clickable pills inserts `@<group name>` into the body.

\- **S7-R10:** Creating a quick note confirms with the success message "Quick note created".

\- **S7-R11:** Each row has **Edit** and **Delete** actions.

\- **S7-R12:** **Edit** opens the same dialog titled "Edit quick note".

\- **S7-R13:** Saving an edit confirms with the success message "Quick note updated".

\- **S7-R14:** **Delete** opens a confirmation titled "Delete quick note" that reads "Are you sure you want to delete the quick note "\\\<name\\\>"?" with a confirm button reading "Delete".

\- **S7-R15:** Confirming a delete confirms with the success message "Quick note deleted".

\- **S7-R16:** A quick note that tags people or tag groups carries those tags, so inserting it into a note also tags them (see S3-E3).

\- **S7-R17:** A quick note body can tag the user themselves. Inserting it tags them on the note being composed, the same as any other tag it carries.

**Negative cases:**

\- **S7-N1:** The list has no visibility column and no public option; every quick note is the user's own.

\- **S7-N2:** Another user's quick notes are never listed.

\- **S7-N3:** When the search matches nothing, the list shows its empty state rather than another user's notes.

### Story 8: Set your Preferences

As a user, I want to decide whether being tagged also emails me, so that I control my own inbox.

**Jira:** [SV-10251](https://shopview.atlassian.net/browse/SV-10251)

**Prerequisites:**

\- The user has opened the **Preferences** tab on the Notifications page.

**Requirements:**

\- **S8-R1:** The Preferences tab shows a card headed "Notification preferences".

\- **S8-R2:** The card has a single toggle labeled "Email notifications".

\- **S8-R3:** Under the toggle, the help text reads "By turning this off you won't receive an email when you're tagged on a note. You'll still see it in your notifications."

\- **S8-R4:** A **Save preferences** button saves the choice.

\- **S8-R5:** Saving confirms with the success message "Notification preferences saved".

\- **S8-R6:** With "Email notifications" on, the user receives an email when they are a recipient of a note.

\- **S8-R7:** With "Email notifications" off, the user receives no email when they are a recipient of a note.

\- **S8-R8:** In-app delivery (the inbox and the bell count) is always on and cannot be turned off.

**Negative cases:**

\- **S8-N1:** The Preferences tab has no in-app toggle, no organization-level control, and no option to set delivery for anyone but the signed-in user.

**Edge cases:**

\- **S8-E1:** A user who has never saved a preference receives email. A missing preference never stops a notification.

*\\\* Context note on S8-E1: this is the "fail open" rule. The absence of a saved preference is treated as "email on", so introducing the email choice can never silently drop a notification.*

### Story 9: Notes on Part Sales

As a parts user, I want to write and read notes on a part sale the way I do on a work order, so that parts work has the same trail.

**Jira:** [SV-10252](https://shopview.atlassian.net/browse/SV-10252)

**Prerequisites:**

\- The user is on a Part Sale.

\- The user has 'Part Sales → View'.

**Requirements:**

\- **S9-R1:** A Part Sale has a **Notes** tab where the user can add and read notes, the same way a work order does.

\- **S9-R2:** A note on a Part Sale references the Part Sale; its pill reads "Part Sale: P\\\<shop\\\>-\\\<number\\\>".

\- **S9-R3:** Part Sale notes support the same `@` tagging, tag groups, quick notes, attachments, edit and delete behavior as work order notes.

\- **S9-R4:** A user who can see a Part Sale note is notified of it in the inbox and by email like any other note.

\- **S9-R5:** The Part Sale reference pill links to the Part Sale screen.

**Negative cases:**

\- **S9-N1:** A Part Sale note does not offer the "Customer Visible" checkbox; Part Sale notes are internal to the shop.

\- **S9-N2:** A user without 'Part Sales → View' cannot add a Part Sale note and does not see Part Sale notes in the inbox. 'Work Orders → View' alone is not enough: part sale notes follow Part Sales permissions.

*\\\* Context note: a Part Sale is a kind of work order, so a Part Sale note reuses the work order note behavior; only the label ("Part Sale:"), the link (to the Part Sale screen), and the absence of Customer Visible differ.*

### Story 10: Who can do what

As a shop, I want the permissions to be predictable, so that no one is surprised by what they can or cannot reach.

**Jira:** [SV-10253](https://shopview.atlassian.net/browse/SV-10253)

**Prerequisites:**

\- None.

**Requirements:**

\- **S10-R1:** Any signed-in user can open their own inbox and act on the notifications addressed to them.

\- **S10-R2:** Any signed-in user can open the Notifications page and manage their own tag groups, quick notes and preferences from its tabs. No settings permission is involved, and no permission gates the page itself.

\- **S10-R3:** Adding a note to a work order or work order line requires 'Work Orders → View'.

\- **S10-R4:** Adding a note to a Part Sale requires 'Part Sales → View'.

\- **S10-R5:** Only the note's author can edit a note or add and remove its attachments.

\- **S10-R5a:** A note written by staff can be deleted by its author, or by a user who holds Delete for the kind of record it is on: 'Work Orders → Delete' for a work order or work order line note, 'Part Sales → Delete' for a part sale note, and 'Customers → Delete' for a customer or asset note. Notes written by customers in the portal and system notes have no menu and cannot be deleted from the app.

\- **S10-R5b:** Ticking or clearing **For Customer** on an attachment is not an edit to the note. Any user with Edit for the kind of record it is on can do it: 'Work Orders → Edit' for a work order or work order line, 'Part Sales → Edit' for a part sale, and 'Customers → Edit' for a customer or an asset. A user who can only view the record sees the checkbox disabled, so they can still tell which files the customer sees.

*\\\* Context note on S10-R4, S10-R5a and S9-N2: each kind of record uses its own permissions. Work order notes follow Work Orders, part sale notes follow Part Sales, customer notes follow Customers, and asset notes are read with the same access that opens an asset today and deleted or marked For Customer with Customers permissions. There is no separate Vehicles permission in the role editor. Production has 5 part sale notes (2 written by customers in the portal, 3 by staff), stored today as work order notes and readable with Work Orders access. After the release they need 'Part Sales → View', which changes who can see 2 of them, in 2 shops; none of the 5 has a reminder or tags anyone. Asset notes keep today's read access, so nobody loses an asset note or its reminder on release day.*

*\\\* Context note on S10-R5b: For Customer decides what the customer is shown, which is usually the service advisor's call on a technician's photos, so it is not limited to the note's author. SV-10254 (released Sep 25) let any user who could view the record tick it; this narrows that to users who can edit the record.*

\- **S10-R6:** Only a tag group's owner can manage a personal tag group.

\- **S10-R7:** A tag group's owner and any admin can rename a public tag group, change its members or delete it. Only the owner can switch a group between public and personal.

\- **S10-R8:** Only a quick note's owner can manage that quick note.

\- **S10-R9:** No permission specific to notifications is introduced.

**Negative cases:**

\- **S10-N1:** A user who is not a note's author is not offered edit on it (S10-R5). A user who is not the author and does not hold Delete for that kind of record is not offered delete (S10-R5a).

\- **S10-N2:** An admin has no access to another user's personal tag groups, quick notes or preferences.

*\\\* Context note: "admin" throughout is the user whose role is the standard Admin role. Holding settings permissions does not make a user an admin for these rules.*

## 8. User Feedback Summary

| Trigger | Message | Behavior |
| --- | --- | --- |
| Mark all read with nothing unread | "No unread notifications" | Tooltip on the disabled action |
| Delete Note | "This note and its attachments will be deleted for everyone. This cannot be undone." | Confirmation dialog titled "Delete Note", button "Delete"; on confirm the note leaves the record and every inbox |
| Creating a tag group | "Tag group created" | Success toast |
| Editing a tag group | "Tag group updated" | Success toast |
| Deleting a personal tag group | "Are you sure you want to delete the tag group "\\\<name\\\>"?" | Confirmation dialog titled "Delete tag group", button "Delete" |
| Deleting a public tag group | "Are you sure you want to delete the tag group "\\\<name\\\>"? This is a public tag group: deleting it removes it for everyone at this location, and any note already tagged with it keeps its text but loses the group." | Confirmation dialog titled "Delete tag group", button "Delete" |
| Tag group deleted | "Tag group deleted" | Success toast |
| Tag group with no members | "Add at least one member." | Tooltip on the disabled Create / Save button; the button stays disabled until a member is selected |
| Personal tag group name taken | "You already have a tag group with this name at this location." | Inline error on the Name field; save is refused |
| Public tag group name taken | "A public tag group with this name already exists at this location." | Inline error on the Name field; save is refused |
| Personal visibility help | "Only you can see this group and tag it on a note." | Help text under the toggle |
| Public visibility help | "Everyone at this location can see this group and tag it on a note. You and any admin can rename it, change its members, or delete it." | Help text under the toggle |
| Creating a quick note | "Quick note created" | Success toast |
| Editing a quick note | "Quick note updated" | Success toast |
| Deleting a quick note | "Are you sure you want to delete the quick note "\\\<name\\\>"?" | Confirmation dialog titled "Delete quick note", button "Delete" |
| Quick note deleted | "Quick note deleted" | Success toast |
| Saving preferences | "Notification preferences saved" | Success toast |
| Email preference help | "By turning this off you won't receive an email when you're tagged on a note. You'll still see it in your notifications." | Help text under the toggle |
| Mark read fails | "Notifications could not be marked as read." | Error toast |
| Saving Unread only fails | "Your Unread only setting could not be saved." | Error toast |
| Tag group name too long | "Name can be at most 40 characters." | Inline error on the Name field |
| Tag group member left the location | "A selected member is no longer at this location." | Inline error on the Members field |
| Creating a tag group with no active location | "Select a location to create a tag group." | Error toast |
| Tag group was deleted meanwhile | "This tag group no longer exists." | Error toast |
| Tag group can no longer be changed by this user | "You can no longer change this tag group." | Error toast |
| Quick notes list is empty | "No quick notes." | Empty state |
| Quick note was deleted meanwhile | "This quick note no longer exists." | Error toast |
| Quick note message too long | "Message can be at most 2,000 characters." | Inline error on the message field |
| Quick note tags someone no longer available | "A tagged team member is no longer available." | Inline error |
| Preferences fail to load | "Your notification preferences could not be loaded." | Inline message with a Retry button |
| Part Sale Notes tab is empty | "No Part Sale Notes Yet / Track this part sale, communicate with your team, and document important details. Add reminders, attach files, and @mention team members." | Empty state title and text |
| Opening a part sale at another location | "Switch location? / This part sale is in \<location\>. Switch your active location to view it? / Switch location" | Confirmation dialog, same as work orders today |
| Location switch canceled | "Switch canceled. Returning to part sales." | Toast |
| Part sale at a location the user cannot access | "This part sale belongs to a location you don't have access to." | Error message |
| Saving a note when its record was deleted meanwhile | "This record is no longer available. Refresh the page and try again." | Error message in the New Note dialog |
| Ticking Customer Visible on a note that is not a work order note | "Customer Visible is available on work order notes only." | Error message in the New Note dialog |
| Any other refused note save | "The note could not be saved. Refresh the page and try again." | Error message in the New Note dialog |

## Change Log

| Date | Reporter | Change | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

# Notifications Update v1 — verbatim source copy

Source: Confluence **817463297** "Notifications Update V1" (space ~Chris Ward), last modified
2026-09-25, status **Locked for build - 2026-09-17**, read 2026-09-30. Epic **SV-9667** (Founder Mode
Batch #1). Design canvas: https://claude.ai/artifact/CmsxESdXv2Y2YTGyTVVLg7 . Owner: Chris Ward.
No QA branch / no tech plan yet.

Stories: S1 Work the inbox (SV-10244), S2 Read a notification (SV-10245), S3 Compose a note (SV-10246),
S4 Delete a note (SV-10247), S5 Reach tags/quick-notes/prefs (SV-10248), S6 Manage tag groups
(SV-10249), S7 Manage quick notes (SV-10250), S8 Preferences (SV-10251), S9 Notes on Part Sales
(SV-10252), S10 Who can do what (SV-10253).

## 7. Requirements

### Story 1: Work the Notifications inbox — SV-10244
- S1-R1: A bell icon in the top navigation opens the Notifications inbox.
- S1-R2: The bell shows a badge with the count of the user's unread notifications.
- S1-R3: The badge shows the exact count up to 99, and "99+" for 100 or more.
- S1-R4: The Inbox tab is a single list. It has no second view, no archive and no grouping. The tab strip described in Story 5 sits on the page around it, not inside the list.
- S1-R5: The list shows the notifications addressed to the user whose note has not been deleted.
- S1-R6: A search box filters the list as the user types.
- S1-R7: Search matches any part of the sender's name, the reference shown on the notification, or the notification text.
- S1-R8: Search matches on partial text and ignores letter case.
- S1-R9: An Unread only filter narrows the list to unread notifications.
- S1-R10: The Unread only filter is on when the user first opens the inbox.
- S1-R11: The Unread only setting is remembered for that USER across page loads until they change it. It is not remembered for the browser: a shared shop terminal must not let one person's choice decide what the next person sees.
- S1-R12: A Mark all read action marks every unread notification as read.
- S1-R13: Notifications are listed newest first.
- S1-R14: The inbox loads 50 notifications at a time.
- S1-R15: While a full page of 50 has come back, a Load more action below the list fetches the next 50.
- S1-R16: Searching starts again from the first page of results.
- S1-R17: On release, every user starts from the default again: the remembered Unread only choice is now held per person rather than per browser, so anything stored under the old shared key is ignored. Nobody loses anything but a toggle position, and re-flipping it stores it against them.
- S1-R18: The inbox lists, and the bell counts, notifications from notes on work orders, work order lines and part sales that belong to the active location, and notifications from notes on a customer or an asset, whichever location is active.
- S1-R19: Switching the active location changes what the inbox lists and what the bell counts to that location's notifications.
- S1-R20: Mark all read marks every unread notification in the inbox as read.
- S1-N1: The inbox has no Archived view, no Restore action and no per-user dismiss. A recipient cannot remove a notification from their own inbox while leaving it on the record.
- S1-N2: When the user has no unread notifications, the Mark all read action is disabled.
- S1-N3: When the user has no unread notifications, hovering the disabled Mark all read action shows the tooltip "No unread notifications".
- S1-N4: When the bell count is zero, no badge is shown.
- S1-N5: The inbox has no compose action.
- S1-N6: The inbox has no sender filter and no sort control.
- S1-N7: The inbox is never organization-wide. A notification from a note at another location is neither listed nor counted until the user switches to that location.
- S1-N8: A notification from a note on a customer or an asset is never hidden by switching location. Those notes have no location, so they are listed and counted at every location.

### Story 2: Read a notification — SV-10245
- S2-R1: A notification's top line shows the sender's name, then the referenced record as a pill, then (when present) an "edited" stamp.
- S2-R2: Below the top line, the notification shows the time it was sent.
- S2-R3: When the note has recipients other than its author, a Tagged: line names them.
- S2-R4: The reference pill links to the referenced record.
- S2-R5: For a work order, the reference pill reads "Work Order: S<shop>-<number>" (for example, "Work Order: S99-15591").
- S2-R6: For a part sale, the reference pill reads "Part Sale: P<shop>-<number>" (for example, "Part Sale: P99-4021").
- S2-R7: For a work order line, the reference pill reads "Line: " followed by the work order number, the line's position, its name and its description.
- S2-R8: The Tagged: line shows two recipient names inline, then "+N more" for the rest (for example, "Ashlee Thomas, Ashley Schultz +2 more"). The two shown are the first two in the order the author tagged them; the hover carries the full list.
- S2-R9: Hovering the Tagged: line shows every recipient's name.
- S2-R10: The message text is shown exactly as it was written, with the @ tags left in place.
- S2-R11: The user can toggle a single notification between read and unread.
- S2-R12: When a notification has attachments, they are shown on the notification.
- S2-R13: The "edited" stamp reads "Edited on <date>", where the date is written like "Sep 8, 2026". It does not name the editor, because only the author can edit a note and the author is already named on the notification.
- S2-N1: The Tagged: line is not shown when the only recipient is the note's own author; it never lists the author.
- S2-N2: Recipient email addresses are never shown on the notification, including on hover.
- S2-N3: A plain "@" in the message that is not a recipient tag (for example, "@ me if urgent") is left in the message text.
- S2-N4: The "edited" stamp is not shown on a note that has never been edited.

### Story 3: Compose a note — SV-10246
- S3-R1: The compose dialog is titled "New Note" when creating and "Update Note" when editing.
- S3-R2: When more than one record could be the note's subject, a "Create note for" field selects the subject.
- S3-R3: The message box is labeled "Use @ to tag team members or tag groups".
- S3-R4: The message box shows how many characters remain, as "<N> characters remaining", out of 2,000.
- S3-R5: Typing @ opens a list that offers both team members and tag groups.
- S3-R6: In the @ list, team members appear first, then a divider, then tag groups.
- S3-R7: In the @ list, a tag group is marked with a "(Tag group)" hint after its name.
- S3-R8: The @ list shows at most seven team members at a time, ordered by first name. Typing narrows the matches across the WHOLE staff list before the cap applies, so nobody is hidden by it. The cap exists because tag groups are listed below the people: without it a long staff directory would push the tag groups off the bottom of the list.
- S3-R9: The @ list shows every matching tag group, with no cap.
- S3-R10: The tag groups offered are the user's own groups and every public group at the active location.
- S3-R11: A "Tag groups:" row shows those same tag groups as clickable pills; clicking a pill inserts @<group name> into the message.
- S3-R12: Hovering a tag group pill shows that group's member names.
- S3-R13: A "Quick notes:" row shows the user's quick notes as clickable pills; clicking a pill inserts its body text into the message.
- S3-R14: Hovering a quick note pill shows that quick note's body text.
- S3-R15: A "Customer Visible" checkbox is shown only on a work order note.
- S3-R16: On Save, the note is sent to every member of each tagged group and to every @-mentioned person, with duplicates removed.
- S3-R17: The author is notified when they are among the recipients (for example, they tagged a group they belong to).
- S3-R18: Typing @ offers the user themselves, listed among the team members with a "(You)" hint after their name.
- S3-R19: Choosing themselves inserts their plain name, with no hint, so the tag reads in the message exactly like a tag on anyone else.
- S3-R20: A user who tags themselves is notified like any other recipient, in their inbox and by email, subject to their own Preferences (Story 8).
- S3-N1: A person who is both in a tagged group and @-mentioned is notified once, not twice.
- S3-N2: The "Customer Visible" checkbox is not shown on a work order line note or a part sale note.
- S3-N3: The "Quick notes:" row is not shown when the user has no quick notes.
- S3-N4: The "Tag groups:" row is not shown when the user has no tag groups available.
- S3-N5: The compose dialog has no recipient dropdown and no send-later field. It keeps the existing Reminder Date field exactly as it is today; this project does not add it, remove it or change it.
- S3-N6: A note written on a customer or an asset is composed exactly like any other note: typing @ offers the same team members and tag groups, and saving the note notifies everyone it tags.
- S3-N7: Tagging yourself is never automatic. A note notifies its author only when the author is a recipient: tagged directly, or a member of a tagged group.
- S3-N8: A user who tags themselves and also tags a group they belong to is notified once, not twice.
- S3-E1: Inserting a quick note never pushes the message past 2,000 characters; the inserted text is cut to fit.
- S3-E2: A tag group counts as tagged only while its @<group name> text is still in the message; deleting that text removes the group from the recipients.
- S3-E3: Inserting a quick note that itself tags people or tag groups also tags them on the note being composed.
- S3-E4: A note does not have to tag anyone. A note saved with no @-mention and no tag group is kept on its record and notifies no one.
- S3-E5: A note is deleted for everyone at once (S4-R5), so nobody is told about a deletion as such; what the deletion does is refresh the unread count and any open inbox so they stop showing a note that no longer exists. Everyone the note reached gets that refresh EXCEPT the person who pressed Delete, who does not need their own action reflected back at them. An author who tagged themselves is refreshed like any other recipient when somebody else deletes the note.

### Story 4: Delete a note — SV-10247
- S4-R1: A note offers a "Delete Note" action in its actions menu.
- S4-R2: Choosing "Delete Note" opens a confirmation dialog titled "Delete Note".
- S4-R3: The confirmation reads "This note and its attachments will be deleted for everyone. This cannot be undone."
- S4-R4: The confirmation's confirm button reads "Delete".
- S4-R5: Confirming removes the note from the record for everyone.
- S4-R6: Confirming removes the note from the inbox of everyone it notified.
- S4-R7: Confirming removes the note's attachments.
- S4-N1: A user who is neither the note's author nor a holder of Delete for that kind of record is not offered "Delete Note" on that note.
- S4-N2: A user who is not the note's author is not offered edit on that note, whatever permissions or role they hold.
- S4-N3: There is no Archived view, no Restore action and no Delete Forever action anywhere in this feature.
- S4-N4: A recipient cannot dismiss a notification from their own inbox. Deleting is the author's action on the record, not a per-person action on a copy.

### Story 5: Reach tag groups, quick notes and preferences — SV-10248
- S5-R1: The bell icon in the top navigation opens the Notifications page.
- S5-R2: The Notifications page has a tab strip with four tabs, in this order: Inbox, Tag groups, Quick notes, Preferences.
- S5-R3: Opening the page from the bell selects the Inbox tab.
- S5-R4: The other three tabs open the user's tag groups (Story 6), their quick notes (Story 7) and their preferences (Story 8).
- S5-R5: Every user who can open the Notifications page sees all four tabs. No tab is gated on a settings permission.
- S5-R6: Each tab has its own address, so a user can return to one directly and a link can point at one.
- S5-N1: A user without 'Work Orders -> View' and without 'Part Sales -> View' can still open the Notifications page. Their inbox is empty, because what a person sees is decided per notification, against the record it is about, rather than by a gate on the page. Nothing redirects them, and the bell behaves for them exactly as it does today.
- S5-N2: No part of the Notifications page is hidden from a user who can open it. There is no admin-only tab and no admin-only control on any tab.

### Story 6: Manage tag groups — SV-10249
- S6-R1: The Tag groups tab lists the user's own tag groups and every public tag group at the active location.
- S6-R2: The list has the columns Name, Members and Visibility.
- S6-R3: The Members cell shows member names, with a "+N" count when there are more than fit.
- S6-R4: The Visibility cell reads "Personal" or "Public".
- S6-R5: When there are no groups to show, the list reads "No tag groups."
- S6-R6: A New tag group button opens a dialog titled "New tag group".
- S6-R7: The dialog has a Name field, a Members multi-select, and a Public tag group toggle.
- S6-R8: Name is required and is at most 40 characters. The field stops accepting input at 40; it does not accept a longer value and then reject it on save.
- S6-R8a: The Name field carries a fixed @ at its left edge, before the typing area. It is always shown, in the New tag group dialog and in the Edit tag group dialog alike.
- S6-R8b: The @ cannot be removed. It cannot be selected, deleted, typed over, or cut. The caret sits after it whenever the field has focus, including when the user presses Home or holds the left arrow, and Select All selects only the typed text.
- S6-R8c: The @ reads as part of the field rather than as a character the user typed. It is shown in the field's secondary text color rather than the color of the typed value, and a hairline rule separates it from the typing area. The typed value keeps the ordinary input color and weight.
- S6-R8d: The @ is not part of the group's name. The name saved, listed on the Tag groups tab, checked for duplicates and shown anywhere else in the product is the typed text alone, with no @.
- S6-R8e: The @ does not count toward the 40-character limit in S6-R8. A user can type 40 characters after it.
- S6-R8f: If the user types @ as the first character of the name, it is not inserted. The field never shows two of them.
- S6-R8g: A @ typed anywhere other than the first position is accepted as an ordinary character, because it is part of the name the user chose.
- S6-R8h: When the Edit dialog opens on a group whose stored name begins with @, that leading @ is not shown in the typing area, because the fixed prefix already supplies it. Saving stores the name without it.
- S6-R9: The Members picker offers only staff who belong to the active location.
- S6-R26: Members is required. A tag group holds at least one member.
- S6-R27: While no member is selected, the dialog's confirm button is disabled: "Create" on a new group, "Save" on an edit.
- S6-R28: Removing the last member of an existing group disables Save for as long as the group has no members. The member cannot be removed and saved away.
- S6-R29: The disabled confirm button carries the tooltip "Add at least one member."
- S6-R10: The Public tag group toggle is off by default.
- S6-R11: With the toggle off, the help text under it reads "Only you can see this group and tag it on a note."
- S6-R12: With the toggle on, the help text reads "Everyone at this location can see this group and tag it on a note. You and any admin can rename it, change its members, or delete it."
- S6-R13: A new tag group belongs to the active location, and that location is fixed for the life of the group.
- S6-R14: Creating a group confirms with the success message "Tag group created".
- S6-R15: The owner of a group, or any admin when the group is public, sees Edit and Delete actions on its row.
- S6-R16: Edit opens the same dialog titled "Edit tag group".
- S6-R17: Saving an edit confirms with the success message "Tag group updated".
- S6-R18: Delete opens a confirmation titled "Delete tag group" whose confirm button reads "Delete".
- S6-R19: For a personal group, the confirmation reads "Are you sure you want to delete the tag group "<name>"?"
- S6-R20: For a public group, the confirmation reads "Are you sure you want to delete the tag group "<name>"? This is a public tag group: deleting it removes it for everyone at this location, and any note already tagged with it keeps its text but loses the group."
- S6-R21: Confirming a delete confirms with the success message "Tag group deleted".
- S6-R22: A public group is visible to, and taggable by, every user at its location.
- S6-R23: A personal group is visible to, and taggable by, its owner only.
- S6-R24: Hovering a row shows every member's name.
- S6-R25: The "Edit tag group" dialog opens with the group's name, members and visibility already filled in.
- S6-R30: A user can include themselves in a tag group's members, and the Members picker offers them.
- S6-N1: Saving a personal group whose name matches another group the user already owns at that location is refused, with the inline message on the Name field: "You already have a tag group with this name at this location."
- S6-N2: Saving a public group whose name matches another public group at that location is refused, with the inline message on the Name field: "A public tag group with this name already exists at this location."
- S6-N3: The name check runs on create, on rename, and when a group is switched from personal to public without a rename.
- S6-N4: Another user's personal group is never listed and can never be tagged.
- S6-N5: A user who is neither the owner nor an admin sees no Edit or Delete on a public group.
- S6-N6: An admin cannot edit or delete another user's personal group.
- S6-N7: The dialog does not show or let the user choose a location.
- S6-N8: The picker never offers staff from another location.
- S6-E1: Switching a public group back to personal hides it from everyone but its owner immediately.
- S6-E2: Two users may each own a personal group with the same name at the same location.
- S6-E3: An admin renaming another user's public group does not change who owns it.
- S6-E4: A group with no members cannot be saved, in either direction: it cannot be created empty and an existing group cannot be emptied.
- S6-E6: A group whose only member leaves the location keeps that member until someone edits the group. The rule is enforced in the dialog, not by a background sweep.

### Story 7: Manage quick notes — SV-10250
- S7-R1: The Quick notes tab lists the user's own quick notes, with the columns Name and Preview.
- S7-R2: The Preview column shows the start of the quick note's body.
- S7-R3: A search box filters the list by name as the user types.
- S7-R4: A New quick note button opens a dialog titled "New quick note".
- S7-R5: The dialog has a Name field and a body field.
- S7-R6: Name is required and is at most 40 characters. The field stops accepting input at 40; it does not accept a longer value and then reject it on save.
- S7-R7: The body field is labeled "Use @ to tag team members or tag groups", is required, and is at most 2,000 characters, the same cap as the message it is inserted into.
- S7-R8: In the body, typing @ offers team members and tag groups the same way the compose dialog does (Story 3).
- S7-R9: A "Tag groups:" row of clickable pills inserts @<group name> into the body.
- S7-R10: Creating a quick note confirms with the success message "Quick note created".
- S7-R11: Each row has Edit and Delete actions.
- S7-R12: Edit opens the same dialog titled "Edit quick note".
- S7-R13: Saving an edit confirms with the success message "Quick note updated".
- S7-R14: Delete opens a confirmation titled "Delete quick note" that reads "Are you sure you want to delete the quick note "<name>"?" with a confirm button reading "Delete".
- S7-R15: Confirming a delete confirms with the success message "Quick note deleted".
- S7-R16: A quick note that tags people or tag groups carries those tags, so inserting it into a note also tags them (see S3-E3).
- S7-R17: A quick note body can tag the user themselves. Inserting it tags them on the note being composed, the same as any other tag it carries.
- S7-N1: The list has no visibility column and no public option; every quick note is the user's own.
- S7-N2: Another user's quick notes are never listed.
- S7-N3: When the search matches nothing, the list shows its empty state rather than another user's notes.

### Story 8: Set your Preferences — SV-10251
- S8-R1: The Preferences tab shows a card headed "Notification preferences".
- S8-R2: The card has a single toggle labeled "Email notifications".
- S8-R3: Under the toggle, the help text reads "By turning this off you won't receive an email when you're tagged on a work order or a part sale. You'll still see it in your notifications."
- S8-R4: A Save preferences button saves the choice.
- S8-R5: Saving confirms with the success message "Notification preferences saved".
- S8-R6: With "Email notifications" on, the user receives an email when they are a recipient of a note.
- S8-R7: With "Email notifications" off, the user receives no email when they are a recipient of a note.
- S8-R8: In-app delivery (the inbox and the bell count) is always on and cannot be turned off.
- S8-N1: The Preferences tab has no in-app toggle, no organization-level control, and no option to set delivery for anyone but the signed-in user.
- S8-E1: A user who has never saved a preference receives email. A missing preference never stops a notification.

### Story 9: Notes on Part Sales — SV-10252
- S9-R1: A Part Sale has a Notes tab where the user can add and read notes, the same way a work order does.
- S9-R2: A note on a Part Sale references the Part Sale; its pill reads "Part Sale: P<shop>-<number>".
- S9-R3: Part Sale notes support the same @ tagging, tag groups, quick notes, attachments, edit and delete behavior as work order notes.
- S9-R4: A user who can see a Part Sale note is notified of it in the inbox and by email like any other note.
- S9-R5: The Part Sale reference pill links to the Part Sale screen.
- S9-N1: A Part Sale note does not offer the "Customer Visible" checkbox; Part Sale notes are internal to the shop.
- S9-N2: A user without 'Work Orders -> View' and without 'Part Sales -> View' cannot add a Part Sale note and does not see Part Sale notes in the inbox.

### Story 10: Who can do what — SV-10253
- S10-R1: Any signed-in user can open their own inbox and act on the notifications addressed to them.
- S10-R2: Any signed-in user can open the Notifications page and manage their own tag groups, quick notes and preferences from its tabs. No settings permission is involved, and no permission gates the page itself.
- S10-R3: Adding a note to a work order or work order line requires 'Work Orders -> View'.
- S10-R4: Adding a note to a Part Sale requires 'Work Orders -> View' or 'Part Sales -> View'.
- S10-R5: Only the note's author can edit a note or add and remove its attachments.
- S10-R5a: A note can be deleted by its author, or by a user who holds Delete for the kind of record it is on: 'Work Orders -> Delete' for a work order, work order line or part sale note, and 'Customers -> Delete' for a customer or asset note.
- S10-R6: Only a tag group's owner can manage a personal tag group.
- S10-R7: A tag group's owner and any admin can manage a public tag group.
- S10-R8: Only a quick note's owner can manage that quick note.
- S10-R9: No permission specific to notifications is introduced.
- S10-N1: A user who is not a note's author is not offered edit on it (S10-R5). A user who is not the author and does not hold Delete for that kind of record is not offered delete (S10-R5a).
- S10-N2: An admin has no access to another user's personal tag groups, quick notes or preferences.

## Key decisions & terminology (context — see page for full text)
Delete is one shared action (no archive/restore). The tag-group Name field shows a fixed presentation-only
`@`. A user can `@` themselves. `@` tags a person or a tag group (people first, divider, then groups).
Tag groups/quick notes/preferences are tabs on the Notifications page. Tag group personal-by-default,
can be public; public maintainable by owner + any admin; personal is owner-only. Inbox follows the active
location; customer/asset notes have no location and show at every location. Quick notes strictly per user.
In-app always on; only email is a choice; missing preference = email on (fail open). Author is a recipient
when tagged/in a tagged group. Editing belongs to the author only. Delete follows the Delete permission
(or author). No new permission. "Admin" = the standard Admin role.

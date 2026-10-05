#!/usr/bin/env python3
"""Founder Mode -> Notifications: bring the suite current with the specification as edited 2 October 2026
(Confluence 817463297; our previous read 30 Sep 2026 of the 25 Sep version).
  python3 spec_update_2026_10_05.py               dry run
  python3 spec_update_2026_10_05.py --apply       update 6 cases + create folder and new cases
Every quote is asserted to be a verbatim substring of the saved 2 Oct source (anchor text) or ticket text."""
import sys, json, os, re
sys.path.insert(0, "build/founder-mode/notifications")
from notif_lib import api, esc, ol, ul
HERE = "build/founder-mode/notifications"
SP = "/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad"
APPLY = "--apply" in sys.argv

# --- the 2 Oct source, anchor -> text (markdown escapes removed)
def _clean(s):
    s = s.replace("\\\\\\<", "<").replace("\\\\\\>", ">").replace("\\\\<", "<").replace("\\\\>", ">")
    return re.sub(r"\\([\[\]()*_>#.!`<-])", r"\1", s).replace("`", "").replace("**", "").strip()
N = {}
for line in open(f"{HERE}/sources/CONFLUENCE-817463297-Notifications-Update-v1-2026-10-05.md"):
    l = _clean(line.replace("\\-", "-", 1)); m = re.match(r'^[-*]\s*(S\d+-[RNE]\d+[a-z]?)\s*:\s*(.+)$', l)
    if m: N[m.group(1)] = m.group(2).strip()
TICKETS = {  # verbatim from Jira, read 5 Oct 2026
 "SV-10274": "The Notes section and attached images should remain contained within the available browser width. The UI should automatically wrap, resize, or otherwise accommodate multiple image attachments while keeping all note controls—including the three-dot menu—visible and accessible without horizontal scrolling.",
 "SV-10739": "A new portal note on a part sale can be seen, edited, deleted and given attachments. Notes on service work orders behave exactly as before.",
}
def Q(a, t):
    src = N.get(a) or TICKETS.get(a.split(" ")[0], "")
    assert t in src, f"NOT VERBATIM {a}: {t[:90]}"
    return (a, t)
def quotes(qs): return "<ul>" + "".join(f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for a, q in qs) + "</ul>"
def expected(results, source, qs, marker):
    return ("<p><strong>Expected results</strong></p>" + ul(results)
            + f"<p><strong>Source - where this behaviour comes from</strong><br>{esc(source)}</p>"
            + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>" + quotes(qs) + f"<p>{esc(marker)}</p>")
def src(story, jira, name):
    return (f"Epic SV-9667; story {jira} ({story}, {name}); Notifications Update v1 PRD (Confluence 817463297) as edited "
            f"2 October 2026, {story}; read 5 Oct 2026. Source-verified 5 October 2026; not yet build-verified.")
UPD_MARK = "AUTOMATION: HOLD - updated to the 2 October 2026 specification; not yet build-verified on a Notifications build"
NEW_MARK = "AUTOMATION: HOLD - authored from the 2 October 2026 specification; not yet build-verified on a Notifications build"

# --- runnable setup blocks (labels: specification, design boards, playbook roles/staff recipes)
ADMIN = "Sign in as an Owner/Admin user (the standard Admin role). This is User A."
TEAM = 'A teammate at the same location to tag, User B (e.g. "Dana Lee"); they are listed under Settings -> Staff.'
ROLE = ("Create the test role: Settings -> Roles & Permissions -> Create custom role -> choose a template (e.g. \"Service Advisor\") -> Apply; "
        "{perm}; enter the Role name \"{name}\" and click Create. Assign it: Settings -> Staff -> open {who} -> Edit Staff Member -> Role -> "
        "pick \"{name}\" -> save. {who_cap} must log out and back in before testing (a role change ends their session).")
def role(name, perm, who="User B"): return ROLE.format(name=name, perm=perm, who=who, who_cap=who)
WO = 'A work order at this location: Work Orders -> New Work Order, select a customer (e.g. "4 Star Truck Repair"), save.'
PS = 'A part sale at this location: Parts -> Part Sales -> New Part Sale, select the customer.'
CUSTNOTE = 'The customer\'s own notes: Customers -> open the customer (e.g. "4 Star Truck Repair") -> Notes tab.'
ASSET = ('An asset of that customer with a unit number, year, make and model (e.g. Unit 546, 2019 Freightliner Cascadia): '
         'Customers -> open the customer -> Assets tab -> open the asset (add one if none exists) -> Notes tab.')
NOTE = "To write a note on any of these records: on its Notes tab click New Note, type the message, type @ and pick the person, then save."

# ======================= 6 updated cases =======================
UPDATES = {
 154680: dict(
  title="Without work order and part sale View: page opens, record-based list",
  pre=[ADMIN, TEAM,
       role("ZZAUTOTEST Customers only", "untick Work Orders -> View and Part Sales -> View, and leave Customers -> View ticked"),
       WO, PS, CUSTNOTE, ASSET, NOTE,
       "As User A, write one note on each of the four records (work order, part sale, customer, asset), each @-mentioning User B."],
  steps=["Sign in as User B and click the bell in the top navigation.",
         "Read which notifications the Inbox lists, and the bell's count.",
         "Confirm nothing redirects you away from the Notifications page."],
  results=["User B can open the Notifications page; nothing redirects them and the bell behaves as it does today.",
           "The Inbox lists no work order, work order line or part sale notification.",
           "The customer note and the asset note notifications are listed (User B holds Customers -> View and can open the asset)."],
  source=src("S5", "SV-10248", "Reach tag groups, quick notes and preferences"),
  quotes=[Q("S5-N1", "A user without 'Work Orders → View' and without 'Part Sales → View' can still open the Notifications page."),
          Q("S5-N1", "They see no work order, work order line or part sale notifications."),
          Q("S5-N1", "They still see notifications from customer notes when they hold 'Customers → View', and from asset notes when they can open the asset (S1-R21)."),
          Q("S5-N1", "Nothing redirects them, and the bell behaves for them exactly as it does today.")]),
 154698: dict(
  title=None,  # keep
  pre=["Sign in as any user on the build under test.",
       "Open the Notifications page from the bell in the top navigation and select the Preferences tab."],
  steps=None,  # keep
  results=['The Preferences tab shows a card headed "Notification preferences" with a single toggle labelled "Email notifications".',
           'The help text under the toggle reads "By turning this off you won\'t receive an email when you\'re tagged on a note. You\'ll still see it in your notifications."',
           'A "Save preferences" button saves the choice and confirms with "Notification preferences saved".'],
  source=src("S8", "SV-10251", "Set your Preferences"),
  quotes=[Q("S8-R1", 'The Preferences tab shows a card headed "Notification preferences".'),
          Q("S8-R2", 'The card has a single toggle labeled "Email notifications".'),
          Q("S8-R3", 'Under the toggle, the help text reads "By turning this off you won\'t receive an email when you\'re tagged on a note. You\'ll still see it in your notifications."'),
          Q("S8-R4", "A Save preferences button saves the choice."),
          Q("S8-R5", 'Saving confirms with the success message "Notification preferences saved".')]),
 154702: dict(
  title="Part Sale notes: notified like any note, no Customer Visible, Part Sales View",
  pre=[ADMIN, TEAM, PS, NOTE,
       'A second teammate, User C (e.g. "Sam Ortiz"). ' + role("ZZAUTOTEST Work orders only", "leave Work Orders -> View ticked and untick Part Sales -> View", who="User C"),
       "As User A, write a note on the part sale that @-mentions User C (before switching to User C)."],
  steps=["As User A, write a note on the part sale that @-mentions User B; check User B's Inbox and email.",
         "On the part sale's New Note dialog, look for a \"Customer Visible\" checkbox.",
         "Sign in as User C. Try to open the part sale and add a note; then open the Inbox and look for the part sale note that mentioned you."],
  results=["User B is notified of the part sale note in the Inbox and by email, like any other note.",
           "The part sale New Note dialog has no \"Customer Visible\" checkbox.",
           "User C, who has Work Orders -> View but not Part Sales -> View, cannot add a part sale note and does not see part sale notes in the Inbox: Work Orders -> View alone is not enough."],
  source=src("S9", "SV-10252", "Notes on Part Sales"),
  quotes=[Q("S9-R4", "A user who can see a Part Sale note is notified of it in the inbox and by email like any other note."),
          Q("S9-N1", 'A Part Sale note does not offer the "Customer Visible" checkbox; Part Sale notes are internal to the shop.'),
          Q("S9-N2", "A user without 'Part Sales → View' cannot add a Part Sale note and does not see Part Sale notes in the inbox. 'Work Orders → View' alone is not enough: part sale notes follow Part Sales permissions.")]),
 154704: dict(
  title="Adding a note needs View on that kind of record",
  pre=[ADMIN, TEAM, WO, PS,
       role("ZZAUTOTEST Part sales only", "untick Work Orders -> View and leave Part Sales -> View ticked"),
       'A second teammate, User C (e.g. "Sam Ortiz"). ' + role("ZZAUTOTEST Work orders only", "leave Work Orders -> View ticked and untick Part Sales -> View", who="User C")],
  steps=["Sign in as User B (Part Sales -> View only). Try to open the work order and add a note to it or to one of its lines.",
         "Still as User B, open the part sale and add a note (New Note, type a message, save).",
         "Sign in as User C (Work Orders -> View only). Add a note to the work order.",
         "Still as User C, try to open the part sale and add a note."],
  results=["User B cannot add a note to the work order or its lines.",
           "User B can add a note to the part sale.",
           "User C can add a note to the work order.",
           "User C cannot add a note to the part sale: Work Orders -> View is not enough for a part sale."],
  source=src("S10", "SV-10253", "Who can do what"),
  quotes=[Q("S10-R3", "Adding a note to a work order or work order line requires 'Work Orders → View'."),
          Q("S10-R4", "Adding a note to a Part Sale requires 'Part Sales → View'.")]),
 154705: dict(
  title="Only the author edits; delete needs authorship or that record's Delete",
  pre=[ADMIN, WO, PS, CUSTNOTE, NOTE,
       "As User A, write one note on each: the work order, the part sale and the customer.",
       TEAM + " " + role("ZZAUTOTEST WO delete", "tick Work Orders -> Delete, and untick Part Sales -> Delete and Customers -> Delete"),
       'A second teammate, User C (e.g. "Sam Ortiz"). ' + role("ZZAUTOTEST PS and customer delete", "tick Part Sales -> Delete and Customers -> Delete, and untick Work Orders -> Delete", who="User C"),
       "A teammate with neither role and none of those Delete permissions, User D (e.g. a Technician).",
       "For the last step: a work order note written by the customer in the Customer Portal, and a system note (one the app wrote itself). If the work order has neither, mark step 5 Blocked and write why."],
  steps=["As User A (the author), edit your work order note and add then remove an attachment.",
         "Sign in as User D and look at User A's notes for edit and delete.",
         "Sign in as User B and look for delete on the work order note, the part sale note and the customer note.",
         "Sign in as User C and look for delete on the same three notes.",
         "As User A, open the customer's portal note and the system note and look for their ⋮ menu."],
  results=["Only the author can edit a note or add and remove its attachments; User D is offered neither edit nor delete.",
           "User B (Work Orders -> Delete) is offered delete on the work order note only, not on the part sale or customer note.",
           "User C (Part Sales -> Delete, Customers -> Delete) is offered delete on the part sale note and the customer note, not on the work order note.",
           "A note written by a customer in the portal, and a system note, have no ⋮ menu and cannot be deleted from the app, even by an admin."],
  source=src("S10", "SV-10253", "Who can do what"),
  quotes=[Q("S10-R5", "Only the note's author can edit a note or add and remove its attachments."),
          Q("S10-R5a", "A note written by staff can be deleted by its author, or by a user who holds Delete for the kind of record it is on: 'Work Orders → Delete' for a work order or work order line note, 'Part Sales → Delete' for a part sale note, and 'Customers → Delete' for a customer or asset note."),
          Q("S10-R5a", "Notes written by customers in the portal and system notes have no menu and cannot be deleted from the app."),
          Q("S10-N1", "A user who is not a note's author is not offered edit on it (S10-R5). A user who is not the author and does not hold Delete for that kind of record is not offered delete (S10-R5a).")]),
 154706: dict(
  title="Public tag group: admin edits, only the owner switches public/personal",
  pre=[ADMIN,
       'A teammate who is not an admin, User B (e.g. a Service Advisor "Dana Lee"). As User B: open the Notifications page from the bell -> Tag groups tab -> New tag group: '
       'Name "ZZ Public team", pick a member, turn Public tag group on, Create. Again: Name "ZZ Personal team", Public off, Create. Then Quick notes tab -> New quick note: Name "ZZ Note", any message, save.',
       'A second non-admin teammate, User C (e.g. "Sam Ortiz").'],
  steps=["Sign in as User A (admin), open the Tag groups tab, and open \"ZZ Public team\" to edit it.",
         "Look at the Public tag group toggle; rename the group (e.g. \"ZZ Public team 2\"), change its members, and save.",
         "Look for \"ZZ Personal team\" and User B's quick note \"ZZ Note\", and for any way to reach User B's Preferences.",
         "Sign in as User C and look for edit or delete on \"ZZ Public team 2\".",
         "Sign in as User B, open \"ZZ Public team 2\", switch Public tag group off, save; then delete it."],
  results=["The admin can rename the public group and change its members; delete is also offered to them.",
           "For the admin the Public tag group toggle shows on and is disabled: only the owner can switch it.",
           "The admin cannot see or reach User B's personal group, quick notes or preferences.",
           "User C, neither owner nor admin, cannot edit or delete the public group.",
           "User B, the owner, can switch the group between public and personal, and can delete it."],
  source=src("S10", "SV-10253", "Who can do what") + " Also S6 (SV-10249, Manage tag groups), S6-E7.",
  quotes=[Q("S10-R6", "Only a tag group's owner can manage a personal tag group."),
          Q("S10-R7", "A tag group's owner and any admin can rename a public tag group, change its members or delete it. Only the owner can switch a group between public and personal."),
          Q("S6-E7", "When an admin edits another user's public group, the Public tag group toggle is shown on and disabled."),
          Q("S10-R8", "Only a quick note's owner can manage that quick note."),
          Q("S10-N2", "An admin has no access to another user's personal tag groups, quick notes or preferences.")]),
}

# ======================= new cases =======================
INBOX = "Open the Notifications page from the bell in the top navigation (the Inbox tab)."
SEED3 = "As User B, write three notes (e.g. on a work order) that each @-mention User A, so User A's Inbox has notifications."
NEW = [
 dict(anchors=["S1-R6a"], title="Search starts as a button, opens in place, stays open when cleared",
  pre=[ADMIN, TEAM, WO, NOTE, SEED3, INBOX],
  steps=["Look at the top of the Inbox for the search control.", "Click Search.", "Type a word from a notification (e.g. part of the work order number), then clear the box."],
  results=["The search control starts as a Search button.", "Clicking it opens the search box in the same place.", "After clearing the search, the box stays open, as on the Inventory list."],
  source=src("S1", "SV-10244", "Work the Notifications inbox"),
  quotes=[Q("S1-R6a", "The search box starts as a Search button. Clicking it opens the search box in place. The box stays open when the search is cleared, the same as search on the Inventory list.")]),
 dict(anchors=["S1-R10a"], title="Unread only is one toggle button: filled blue on, outlined off",
  pre=[ADMIN, TEAM, WO, NOTE, SEED3, INBOX],
  steps=["Find the Unread only control and read its label.", "Click it to switch it on, and read its label and look.", "Click it again to switch it off, and read its label and look."],
  results=['It is a single toggle button labelled "Unread only" both when on and when off.', "When on it is filled in the app's primary blue.", "When off it is outlined."],
  source=src("S1", "SV-10244", "Work the Notifications inbox"),
  quotes=[Q("S1-R10a", 'The Unread only control is a single toggle button labeled "Unread only" in both states. It is filled in the app\'s primary blue when on and outlined when off.')]),
 dict(anchors=["S1-R21"], title="A notification is listed and counted only if you can view its record",
  pre=[ADMIN, TEAM, WO, PS, CUSTNOTE, NOTE,
       role("ZZAUTOTEST No work order or customer view", "untick Work Orders -> View and Customers -> View, and leave Part Sales -> View ticked"),
       "As User A, write one note on each of the work order, the part sale and the customer, each @-mentioning User B (3 notes)."],
  steps=["Sign in as User B, click the bell, and read the Inbox.", "Count the notifications listed, and read the bell's count."],
  results=["Only the part sale notification is listed (1 of the 3).", "The work order note and the customer note are not listed and not counted: the bell counts 1, not 3."],
  source=src("S1", "SV-10244", "Work the Notifications inbox"),
  quotes=[Q("S1-R21", "A notification is listed and counted only for a user who can view the record its note is on: 'Work Orders → View' for a work order or work order line, 'Part Sales → View' for a part sale, 'Customers → View' for a customer, and the same access that opens an asset today for an asset.")]),
 dict(anchors=["S1-R22"], title="Dashboard notifications card never shows a note you can't see",
  pre=[ADMIN, TEAM, WO, PS, NOTE,
       role("ZZAUTOTEST No work order view", "untick Work Orders -> View and leave Part Sales -> View ticked"),
       'As User A, write a work order note and a part sale note that each @-mention User B, with distinct text (e.g. "ZZ work order secret" and "ZZ part sale hello").'],
  steps=["Sign in as User B and open the Dashboard.", "Read the notifications card on the Dashboard.", "Open the Inbox and compare."],
  results=['The Dashboard notifications card shows the part sale note ("ZZ part sale hello").', 'It never shows the text "ZZ work order secret", which User B cannot see in their Inbox either.'],
  source=src("S1", "SV-10244", "Work the Notifications inbox"),
  quotes=[Q("S1-R22", "The notifications card on the dashboard follows the same rule as the inbox (S1-R21). It never shows the text of a note the user could not see in their inbox.")]),
 dict(anchors=["S1-N9"], title="New mention pop-up follows the inbox's location rule",
  pre=[ADMIN, TEAM, "Two locations User A and User B can both switch between in the top-right location selector, Location 1 and Location 2.",
       "A work order at Location 2 (switch to Location 2, then Work Orders -> New Work Order).", CUSTNOTE, NOTE,
       "Keep User B signed in on a second browser, at Location 1."],
  steps=["As User A, write a note on the Location 2 work order that @-mentions User B; watch User B's screen.",
         "As User A, write a note on the customer that @-mentions User B; watch User B's screen."],
  results=['No "New mention" pop-up appears for User B for the Location 2 work order note while they are at Location 1.',
           'The "New mention" pop-up appears for User B for the customer note, at whichever location they are.'],
  source=src("S1", "SV-10244", "Work the Notifications inbox"),
  quotes=[Q("S1-N9", 'The live "New mention" pop-up follows the inbox. It does not appear for a note at another location (S1-N7). A note on a customer or an asset shows it at every location (S1-N8).')]),
 dict(anchors=["S2-R7a", "S2-R7b"], title="Customer and asset notifications show their reference pills",
  pre=[ADMIN, TEAM, CUSTNOTE, ASSET,
       "A second asset of that customer with NO unit number (e.g. a 2021 Ford F-150).", NOTE,
       "As User B, write one note on the customer and one on each asset, each @-mentioning User A."],
  steps=[INBOX, "Read the reference pill on each of the three notifications."],
  results=['The customer note\'s pill reads "Customer: " and the customer name (e.g. "Customer: 4 Star Truck Repair").',
           'The asset note\'s pill reads "Asset: Unit 546, 2019 Freightliner Cascadia".',
           'The asset with no unit number reads "Asset: " and the year, make and model (e.g. "Asset: 2021 Ford F-150").'],
  source=src("S2", "SV-10245", "Read a notification"),
  quotes=[Q("S2-R7a", 'For a customer, the reference pill reads "Customer: " followed by the customer\'s name.'),
          Q("S2-R7b", 'For an asset, the reference pill reads "Asset: Unit " followed by the unit number, a comma and the year, make and model (for example, "Asset: Unit 546, 2019 Freightliner Cascadia").'),
          Q("S2-R7b", 'When the asset has no unit number it reads "Asset: " followed by the year, make and model.')]),
 dict(anchors=["S2-R13a"], title="Every Notes tab shows the Tagged: line and the Edited on stamp",
  pre=[ADMIN, TEAM, 'A second teammate, User C (e.g. "Sam Ortiz").', WO, PS, CUSTNOTE, ASSET, NOTE,
       'A tag group: bell -> Tag groups tab -> New tag group, Name "ZZ Pair", members User B and User C, Create.'],
  steps=["On each Notes tab - the work order, one of its lines, the part sale, the customer and the asset - write a note that tags @ZZ Pair.",
         "Edit one of those notes (change a word, save).",
         "Change \"ZZ Pair\" to remove User C, then look at the earlier notes again.",
         "Read each note on each Notes tab."],
  results=["Every note on every Notes tab shows a Tagged: line naming User B and User C.",
           'The edited note shows an "Edited on" stamp.',
           "After User C is removed from the group, the earlier notes still name User C: the line shows who the note reached when it was sent."],
  source=src("S2", "SV-10245", "Read a notification"),
  quotes=[Q("S2-R13a", 'The Tagged: line (S2-R3) and the "Edited on" stamp (S2-R13) also show on each note on every Notes tab: work order, work order line, part sale, customer and asset. The Tagged: line names the people the note reached when it was sent, so a tagged group is shown as the members it had at that moment.')]),
 dict(anchors=["S2-R13b"], title="Tags in a note's message show in blue, other text in normal color",
  pre=[ADMIN, TEAM, WO, NOTE, 'A tag group you own (bell -> Tag groups tab -> New tag group, e.g. "ZZ Pair").',
       'Write a note on the work order: "Please check this @Dana Lee and @ZZ Pair today" (tagging User B and the group).'],
  steps=["Read the note on the work order's Notes tab.", INBOX + " Read the same note as User B."],
  results=["@Dana Lee and @ZZ Pair are shown in blue.", "All other words of the message are in the normal text color."],
  source=src("S2", "SV-10245", "Read a notification"),
  quotes=[Q("S2-R13b", "In a note's message, tags (@people and @groups) are shown in blue. All other text is in the normal text color.")]),
 dict(anchors=["S3-R10"], title="Customer and asset notes offer the signed-in location's public groups",
  pre=[ADMIN, "Two locations you can switch between, Location 1 and Location 2.",
       'At Location 1: bell -> Tag groups tab -> New tag group, Name "ZZ L1 public", Public tag group on, Create. At Location 2 the same with "ZZ L2 public".',
       CUSTNOTE, ASSET],
  steps=["Sign in to Location 1. On the customer's Notes tab click New Note and type @; read the tag groups offered.",
         "Do the same on the asset's Notes tab.",
         "Switch to Location 2 and repeat both."],
  results=['At Location 1, both notes offer your own groups and "ZZ L1 public", not "ZZ L2 public".',
           'At Location 2, both offer "ZZ L2 public", not "ZZ L1 public".'],
  source=src("S3", "SV-10246", "Compose a note"),
  quotes=[Q("S3-R10", "The tag groups offered are the user's own groups and every public group at the active location."),
          Q("S3-R10", "The same applies on a customer or asset note: it has no location, so the public groups offered are those at the location the user is signed into.")]),
 dict(anchors=["S10-R5b"], title="For Customer on an attachment needs Edit; view-only sees it disabled",
  pre=[ADMIN, WO, PS, CUSTNOTE,
       "As User A, write a note with an attached photo on each of the work order, the part sale and the customer (New Note -> attach a file -> save).",
       TEAM + " " + role("ZZAUTOTEST Editors", "tick Work Orders -> Edit, Part Sales -> Edit and Customers -> Edit"),
       'A second teammate, User C (e.g. "Sam Ortiz"). ' + role("ZZAUTOTEST View only", "leave Work Orders -> View, Part Sales -> View and Customers -> View ticked, and untick their Edit permissions", who="User C")],
  steps=["Sign in as User B (not the author). On each of the three notes, tick then clear For Customer on the photo.",
         "Sign in as User C and look at the For Customer checkbox on each photo."],
  results=["User B can tick and clear For Customer on all three, although they did not write the notes: it is not an edit to the note.",
           "User C sees the For Customer checkbox disabled, still showing whether the customer sees the file."],
  source=src("S10", "SV-10253", "Who can do what"),
  quotes=[Q("S10-R5b", "Ticking or clearing For Customer on an attachment is not an edit to the note. Any user with Edit for the kind of record it is on can do it: 'Work Orders → Edit' for a work order or work order line, 'Part Sales → Edit' for a part sale, and 'Customers → Edit' for a customer or an asset. A user who can only view the record sees the checkbox disabled, so they can still tell which files the customer sees.")]),
 dict(anchors=["SV-10274"], title="A note with many images keeps its ⋮ menu on screen, no sideways scroll",
  pre=[ADMIN, WO, "Twelve image files on your computer (any photos)."],
  steps=["On the work order's Notes tab click New Note, type a message, attach all 12 images, save.",
         "Without scrolling sideways, look for the note's ⋮ menu (Edit, Delete, Attach File).",
         "Do the same on a part sale note."],
  results=["The note and its images stay within the browser width; the images wrap onto more rows.",
           "The note's ⋮ menu is visible and usable without scrolling sideways."],
  source=("Epic SV-9667; bug SV-10274 (Work Order Notes UI Extends Horizontally When Multiple Images Are Attached), Expected Behavior; "
          "read 5 Oct 2026. Source-verified 5 October 2026; not yet build-verified."),
  quotes=[Q("SV-10274 Expected Behavior", "The Notes section and attached images should remain contained within the available browser width."),
          Q("SV-10274 Expected Behavior", "keeping all note controls—including the three-dot menu—visible and accessible without horizontal scrolling.")]),
 dict(anchors=["SV-10739"], title="Customer Portal: a customer's own part sale note still works",
  pre=[ADMIN, PS + " Use a customer that has a Customer Portal login for one of its contacts.",
       "The Customer Portal login for that customer contact (ask the account admin for it if you do not have it).",
       "For comparison, a service work order for the same customer."],
  steps=["Sign in to the Customer Portal as the customer contact and open the part sale.",
         "Add a note, then edit it, attach a file to it, and delete it.",
         "Do the same on the service work order."],
  results=["On the part sale the customer can see their new note, edit it, add an attachment and delete it.",
           "On the service work order, notes behave exactly as before."],
  source=("Epic SV-9667; task SV-10739 (Customer Portal Notifications changes: read part sale notes), Acceptance criteria; "
          "read 5 Oct 2026 (task In Progress). Source-verified 5 October 2026; not yet build-verified."),
  quotes=[Q("SV-10739 Acceptance criteria", "A new portal note on a part sale can be seen, edited, deleted and given attachments."),
          Q("SV-10739 Acceptance criteria", "Notes on service work orders behave exactly as before.")]),
]
FOLDER = "Specification update 2 October 2026 (QA Additions)"

def main():
    for u in UPDATES.values():
        assert u["title"] is None or len(u["title"]) <= 80, u["title"]
    for n in NEW: assert len(n["title"]) <= 80, n["title"]
    log = {"updated": [], "created": {}}
    snap = f"{HERE}/snapshots-2026-10-05"; os.makedirs(snap, exist_ok=True)
    for cid, u in UPDATES.items():
        c = api(f"get_case/{cid}")
        assert c["custom_atmstatus"] != 3, f"C{cid} is Automated - stop (Rule 71)"
        payload = {"custom_preconds": ol(u["pre"]), "custom_expected": expected(u["results"], u["source"], u["quotes"], UPD_MARK)}
        if u["title"]: payload["title"] = u["title"]
        if u.get("steps"): payload["custom_steps"] = ol(u["steps"])
        if not APPLY: print(f"[DRY] update C{cid} {payload.get('title', c['title'])[:70]}"); continue
        json.dump(c, open(f"{snap}/C{cid}-before.json", "w"), indent=1)
        api(f"update_case/{cid}", payload); a = api(f"get_case/{cid}")
        ok = all((a.get(k) or "") == v for k, v in payload.items()); json.dump(a, open(f"{snap}/C{cid}-after.json", "w"), indent=1)
        log["updated"].append({"case": f"C{cid}", "verified": ok, "atmstatus": c["custom_atmstatus"]}); print(f"[OK] C{cid} verified={ok}")
    if not APPLY:
        for n in NEW: print(f"[DRY] new {n['anchors']} {n['title']} ({len(n['title'])})")
        return
    sec = api("add_section/1", {"suite_id": 1, "parent_id": 20436, "name": FOLDER}); print("[OK] folder", sec["id"])
    for n in NEW:
        r = api(f"add_case/{sec['id']}", {"title": n["title"], "custom_preconds": ol(n["pre"]), "custom_steps": ol(n["steps"]),
             "custom_expected": expected(n["results"], n["source"], n["quotes"], NEW_MARK), "custom_automation_type": 2, "custom_atmstatus": 1})
        log["created"][str(r["id"])] = {"title": n["title"], "anchors": n["anchors"], "section": sec["id"]}; print(f"[OK] C{r['id']} {n['title']}")
    log["folder"] = sec["id"]; json.dump(log, open(f"{HERE}/spec-update-log-2026-10-05.json", "w"), indent=1)

if __name__ == "__main__":
    main()

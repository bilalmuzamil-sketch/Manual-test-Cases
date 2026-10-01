# -*- coding: utf-8 -*-
"""Author the DEFERRED / not-in-this-release gap cases in two new release-labelled folders:
  A) Founder Mode / Fixed Rules - list rules with no category  (author: NOT IN THIS RELEASE)
  B) Maintenance Reminders / Automatic customer email S19       (author: SHIP THE REST WITHOUT IT, P5)
Run with --apply to create the sections and cases; dry otherwise."""
import sys
sys.path.insert(0,"build/gap-fill")
import gf_deferred as G

# ---------------------------------------------------------------- FOLDER A : Fixed Rules (SV-10403)
FR_REL="Not in this release."
FR_CITE="story SV-10403, Parts Alphabetical Sort Story 4; PRD page 578781186, S3-R12b/R13/R17/R18"
FR_NOTE=("Raised by Milan Zivanovic during tech planning for Parts Alphabetical Sort. The Fixed Rules "
 "tab only lists rules whose part has a category, so a category-less rule never appears; across every "
 "shop in production that is 3 rules. The Parts Alphabetical Sort PRD rules out changing what the "
 "server sends, so S3-R12b records the gap and this story fixes it separately, after that release.")
FR_MARK="deferred story SV-10403 (status Open; author: not in this release); no build - not build-verified."
FR_PRE=[
 "On a build where this story (list fixed rules whose part has no category) has shipped.",
 "A part with NO category assigned, e.g. part 'ZZAUTOTEST-NOCAT' (example).",
 "A fixed-price rule on that part, e.g. Fixed price $79.99 (example), created in Settings > Pricing > Fixed Rules.",
 "At least two other fixed-price rules on parts that DO have a category, e.g. categories 'Brakes' and 'Filters' (examples).",
 "Logged in as a user with Settings access (the Pricing tab is visible).",
]

def folderA():
    root=G.add_section("Founder Mode / Fixed Rules - list rules with no category - author: NOT IN THIS RELEASE (QA Additions 2026-10-01)")
    s=root
    G.add(s,"Fixed rule whose part has no category is listed with an empty Category cell",
        FR_REL,FR_CITE,("auto",),FR_PRE,
        ["Open Settings.","Open the Pricing area.","Open the Fixed Rules tab.",
         "Find the row for the part with no category, e.g. 'ZZAUTOTEST-NOCAT' (example)."],
        ["The fixed rule for the category-less part appears in the Fixed Rules list.",
         "Its Category cell is blank (empty), while the rule's other cells (part, fixed price) are populated."],
        FR_CITE+".",
        [("S3 PRD R1","Every fixed rule is listed on the Fixed Rules tab, whether or not its part has a category."),
         ("S3 PRD R2","A rule whose part has no category shows an empty Category cell."),
         ("SV-10403 AC1","Given a fixed rule whose part has no category, when the user opens the Fixed Rules tab, then the rule is listed with an empty Category cell.")],
        FR_NOTE,FR_MARK)
    G.add(s,"Empty Category sorts last in the Fixed Rules list, ascending and descending",
        FR_REL,FR_CITE,("auto",),FR_PRE,
        ["Open Settings > Pricing > Fixed Rules.",
         "Click the Category column header to sort ascending; note where the category-less row sits.",
         "Click the Category column header again to sort descending; note where it sits."],
        ["Ascending: the rule with the empty Category is listed last (below every rule that has a category).",
         "Descending: the rule with the empty Category is still listed last."],
        FR_CITE+".",
        [("S3 PRD R3","An empty Category value sorts last in the Category column, in ascending and descending order alike (the existing S3-R12b fallback)."),
         ("SV-10403 AC2","Given the Category column is sorted ascending or descending, when the list includes a rule with no category, then that rule is last.")],
        FR_NOTE,FR_MARK)
    G.add(s,"Fixed rules (N) tab-label count includes rules whose part has no category",
        FR_REL,FR_CITE,("auto",),
        FR_PRE+["Exactly 3 category-less fixed rules exist at this location (per the acceptance criterion), plus the category-carrying rules."],
        ["Open Settings > Pricing > Fixed Rules.",
         "Read the tab label, shown as 'Fixed rules (N)'.",
         "Count the rows in the list (including the 3 category-less rows)."],
        ["N in 'Fixed rules (N)' equals the full count of fixed rules, counting the 3 category-less rules (it is not reduced by excluding them).",
         "Example: with 7 category-carrying rules plus the 3 category-less rules, the label reads 'Fixed rules (10)', not 'Fixed rules (7)'."],
        FR_CITE+".",
        [("S3 PRD R4","The tab label count N in “Fixed rules (N)” includes these rules (S3-R17)."),
         ("SV-10403 AC3","Given 3 category-less rules exist at a location, when the tab opens, then the label count includes all 3.")],
        FR_NOTE,FR_MARK)
    G.add(s,"Fixed Rules search finds a category-less rule by Part number and by Fixed price",
        FR_REL,FR_CITE,("auto",),FR_PRE,
        ["Open Settings > Pricing > Fixed Rules.",
         "Type the category-less rule's part number into the Fixed Rules search, e.g. 'ZZAUTOTEST-NOCAT' (example).",
         "Clear the search, then type the category-less rule's fixed price, e.g. '79.99' (example)."],
        ["Searching the part number returns the category-less rule in the results.",
         "Searching the fixed price also returns the category-less rule - it is searchable on the same fields as any other rule."],
        FR_CITE+".",
        [("S3 PRD R5","Fixed Rules search (S3-R18) matches these rules on Part number and Fixed price like any other rule.")],
        FR_NOTE,FR_MARK)
    return root

# ------------------------------------------------- FOLDER B : Automatic customer reminder email (S19)
S19_REL="Ship the rest of the feature without it."
S19_CITE="story SV-10575 / S19, Phase P5; Confluence 'Chunk 2 MR' page 897679389, read 1 Oct 2026"
S19_NOTE=("Phase P5. The design is settled. Four operational questions gate delivery: who the mail comes "
 "from, whether mass sending is possible at all, what recalculates and queues the day's sends, and the "
 "global send time. Chunk 2 MR is a placeholder - the S19 requirements are copied as they stand and not "
 "yet reviewed for handoff, so this wording will be reworked before developers pick it up (re-check the "
 "quotes then, per Rules 31/32/59).")
S19_MARK="deferred story SV-10575 (Phase P5; author: ship the rest of the feature without it); no build - not build-verified."
EMAIL_WHY=("the delivered email must be read by a person to judge how it renders - the sender name, the "
 "footer wording and the call-to-action; and producing the email at all needs the daily 08:00 send job "
 "or a developer trigger, which a manual tester cannot fire by hand.")
JOB_WHY=("the send is a timed daily backend job (08:00 local, working days); an automated harness fires "
 "it and checks the recipients, the content and the send log - a manual tester cannot trigger the 08:00 "
 "job by hand.")
S19_PRE=[
 "On a build where the automatic customer reminder email (S19) has shipped, with the maintenance_reminders flag on.",
 "A customer whose 'Send preventive maintenance notifications' setting is ON, e.g. 'ZZAUTOTEST Fleet Co' (example).",
 "At least one asset of that customer enrolled on a maintenance schedule so a service falls inside its reminder window, e.g. asset 'ZZAUTOTEST Truck 12' (example).",
 "That asset has a preferred contact carrying an email address, e.g. 'owner@example.test' (example).",
]

def folderB():
    root=G.add_section("Maintenance Reminders / Automatic customer email S19 - author: SHIP THE REST WITHOUT IT, Phase P5 (QA Additions 2026-10-01)")
    s=root
    A=("auto",); M=("manual",EMAIL_WHY); J=("auto",)  # J documented via JOB_WHY note inline where needed
    G.add(s,"One consolidated email per customer-and-recipient, with state per row",
        S19_REL,S19_CITE,A,
        S19_PRE+["Two units of the same customer share one preferred contact and are both inside the window - one due today, one overdue, e.g. 'Truck 12' and 'Truck 15' (examples)."],
        ["Bring both units inside their reminder window (one due today, one overdue).",
         "Run the daily reminder send (the 08:00 job) for the organization.",
         "Open the recipient's inbox and the sent email."],
        ["The recipient receives exactly ONE email, not one per unit.",
         "The email lists both units, and each row carries that unit's own state (due today / overdue).",
         "Units belonging to a different customer, or to a different preferred contact, are not in this email."],
        S19_CITE+".",
        [("S19-R1","One email will exist. It carries every unit of that customer currently inside its reminder window, whatever state each one is in, so an owner reads one message rather than hunting a truck across three"),
         ("S19-R4","One email is built per customer and per recipient. A customer's units that share a preferred contact travel in one message; units whose contact differs make a second. Nobody is sent a list of vehicles that are not theirs"),
         ("S19-R5","A customer with one unit due today and another overdue receives one email listing both. The table carries the state per row"),
         ("S19-R8","Each row in the email will name the unit, the service where known, and when it is due")],
        S19_NOTE,S19_MARK)
    G.add(s,"The email carries only units inside the reminder window, nothing beyond it",
        S19_REL,S19_CITE,A,
        S19_PRE+["One service of the customer is inside its window; another service is due far in the future, e.g. in 11 months (example)."],
        ["Run the daily reminder send for the organization.","Open the delivered email and read every row."],
        ["The in-window service appears in the email.",
         "The service due far in the future (e.g. 11 months away) does NOT appear - nothing outside the window rides along."],
        S19_CITE+".",
        [("S19-R6","An email will carry everything currently inside its reminder window, not only services whose first row fired today"),
         ("S19-R7","Nothing outside the window is included. A service due in eleven months does not ride along")],
        S19_NOTE,S19_MARK)
    G.add(s,"A customer is never emailed the same list twice - a send needs a change",
        S19_REL,S19_CITE,A,
        S19_PRE+["The customer has already received one reminder email for the current set of units; nothing has changed since."],
        ["Run the daily reminder send again with no change to the customer's units.",
         "Then move one service newly inside its window (or newly due/overdue) and run the send again.",
         "Check the recipient's inbox after each run."],
        ["The first re-run (nothing changed) sends NO email, even though a reminder row would otherwise fire.",
         "The second run (something newly changed) does send an email.",
         "The customer never receives the same list twice."],
        S19_CITE+".",
        [("S19-R22","An email goes only when something has changed for that customer since the last one: a service newly inside its window, newly due, or newly overdue. Where nothing has moved, no email is sent even though a reminder row would otherwise fire, so a customer never receives the same list twice")],
        S19_NOTE,S19_MARK)
    G.add(s,"Enrolling a fleet sends no email, and already-due services are suppressed",
        S19_REL,S19_CITE,A,
        S19_PRE+["A customer's asset is enrolled with a service that is ALREADY overdue at the moment of enrolment (a backlog from paper history)."],
        ["Enrol the asset so a service is already overdue at enrolment.",
         "Run the daily reminder send for the organization.","Check the recipient's inbox."],
        ["Enrolment itself triggers no email (no bulk send on enrol).",
         "The service that was already due at the moment of enrolment is suppressed from the automatic email - it does not generate a customer reminder."],
        S19_CITE+".",
        [("S19-N1","Enrolment never triggers a bulk send. Services already due at enrolment are suppressed from automatic email")],
        S19_NOTE,S19_MARK)
    G.add(s,"Low-confidence estimates never auto-email; a No-data calendar date may",
        S19_REL,S19_CITE,A,
        S19_PRE+["One due date comes from a Low-confidence meter estimate; another comes from the calendar on a unit with No data (no usable meter history)."],
        ["Set up one in-window service whose date is a Low-confidence meter estimate, and one whose date is the calendar date on a No-data unit.",
         "Run the daily reminder send for the organization.","Read the delivered email."],
        ["The Low-confidence service does NOT trigger an automatic email (the advisor is expected to call instead).",
         "The No-data service's calendar date MAY send automatically (a calendar date is not an estimate)."],
        S19_CITE+".",
        [("S19-N2","In Low confidence, automatic email does not send at all. The advisor calls"),
         ("S19-R9","Each unit shows its due month, with Low confidence where it applies, exactly as the worklist shows it per S11-R9. Automatic email does not send at all on low confidence, so this governs a send made by hand from the contact card"),
         ("S11 matrix / No data row","may send on the calendar date, which is not an estimate")],
        S19_NOTE,S19_MARK)
    G.add(s,"A customer whose notifications setting is off receives nothing for any asset",
        S19_REL,S19_CITE,A,
        S19_PRE[:0]+[
         "On a build where S19 has shipped, with the maintenance_reminders flag on.",
         "A customer whose 'Send preventive maintenance notifications' setting is OFF, e.g. 'ZZAUTOTEST Fleet Co' (example).",
         "Several of that customer's assets are enrolled with services inside their reminder window.",
         "Each asset has a preferred contact with an email address."],
        ["Confirm the customer's notifications setting is off.",
         "Run the daily reminder send for the organization.","Check every contact's inbox for that customer."],
        ["No automatic reminder email is sent for ANY of that customer's assets while the setting is off.",
         "The setting is read from the customer record (not from the asset and not from the enrolment)."],
        S19_CITE+".",
        [("S19-N3","A customer whose notification setting is off receives nothing for any of their assets. The setting lives on the customer record, not on the asset and not on the enrolment")],
        S19_NOTE,S19_MARK)
    G.add(s,"A unit with no preferred contact gets no auto reminder; worklist row kept",
        S19_REL,S19_CITE,A,
        S19_PRE[:3]+["The asset has NO preferred contact with an email address (or the preferred contact was removed)."],
        ["Remove the preferred contact from the asset (or start with none).",
         "Run the daily reminder send for the organization.",
         "Open the Maintenance reminders worklist and find the unit's row."],
        ["The unit receives no automatic reminder (there is nobody to send to).",
         "The unit's worklist row is unaffected - it keeps its due date and still appears in the worklist.",
         "The contact card shows its empty state for the missing contact."],
        S19_CITE+".",
        [("S19-R3","The recipient is the preferred contact recorded against each unit. A unit with none receives nothing"),
         ("S19-N6","A unit whose preferred contact is removed stops receiving automatic reminders. Its worklist row is unaffected and keeps its due date, and the contact card shows the empty state from S14-N4")],
        S19_NOTE,S19_MARK)
    G.add(s,"Automatic sends go out at 08:00 local on working days only, never at a weekend",
        S19_REL,S19_CITE,("manual",JOB_WHY),
        S19_PRE+["The organization's timezone is derivable from the workplace with the most work orders."],
        ["Set the organization clock to a weekday and let the local 08:00 send run; check send timing.",
         "Advance to a Saturday and a Sunday at 08:00 local and let the hourly job run.",
         "Confirm the job runs hourly and sends to organizations whose local 08:00 has just arrived."],
        ["On a working day, the reminder emails go out at 08:00 local to the organization.",
         "On Saturday and Sunday, nothing is sent.",
         "The send time is resolved to the day only (nothing is computed to the hour)."],
        S19_CITE+".",
        [("S19-R10","Sends will go out at 08:00 local to the organization, on working days only"),
         ("S19-R11","The organization's timezone will be derived from the workplace with the most work orders, since the organization carries none"),
         ("S19-R12","The job will run hourly and send to the organizations whose local 08:00 has just arrived"),
         ("S19-R13","Granularity is the day. Nothing in the feature is computed to an hour"),
         ("S19-N4","Nothing is sent on a weekend")],
        S19_NOTE,S19_MARK)
    G.add(s,"Every automatic reminder send is logged: message, recipient and timestamp",
        S19_REL,S19_CITE,("manual",JOB_WHY),S19_PRE,
        ["Run the daily reminder send so at least one email goes out.",
         "Open the send log / audit for that customer and recipient."],
        ["A log entry exists for the send, recording the message, the recipient and the timestamp."],
        S19_CITE+".",
        [("S19-R14","Every send will be logged, with the message, the recipient and the timestamp")],
        S19_NOTE,S19_MARK)
    G.add(s,"Email sender is the shop's name over the platform address; Reply-To the shop",
        S19_REL,S19_CITE,M,
        S19_PRE+["The organization has an email address set, e.g. 'shop@example.test' (example)."],
        ["Run the daily reminder send so an email is delivered.",
         "Open the delivered email and inspect the From name and the Reply-To address."],
        ["The sender shows as the organization's (shop's) name over the platform sending address - ShopView's own address never shows as the sender's name.",
         "Reply-To is the organization's email address (where the shop has one).",
         "This follows the same pattern the invoice and purchase-order emails already use."],
        S19_CITE+".",
        [("S19-R16","The layout and the wording will be hardcoded, populated from shop and asset data, and will follow the existing ShopView send pattern"),
         ("S19-R17","The email is sent as the organization's name over the platform sending address, the same pattern the invoice and purchase order emails already use. ShopView's own address never shows as the sender's name"),
         ("S19-R18","Reply-To is the organization's email address. Where a shop has none, a reply reaches an address nobody at the shop reads, and that is a stated consequence rather than an accident")],
        S19_NOTE,S19_MARK)
    G.add(s,"The email footer says why it was received and carries no unsubscribe link",
        S19_REL,S19_CITE,M,S19_PRE,
        ["Run the daily reminder send so an email is delivered.",
         "Open the delivered email and read the footer."],
        ["The footer states why the customer received the email (the reminder reason).",
         "There is NO unsubscribe link in the email - consent is managed by a setting on the customer record, not by a link in the mail."],
        S19_CITE+".",
        [("S19-R15","The footer will state why the customer received it. There is no unsubscribe link: consent is managed by a setting on the customer record, not by a link in the mail")],
        S19_NOTE,S19_MARK)
    G.add(s,"The email carries the location name and phone, and the action is to call",
        S19_REL,S19_CITE,M,
        S19_PRE+["The location has a telephone number set, e.g. '(555) 010-1234' (example)."],
        ["Run the daily reminder send so an email is delivered.",
         "Open the delivered email and read the body and call-to-action.",
         "Separately, remove the telephone from both the location and the organization and send again."],
        ["The body carries the name and telephone of the location, and the call to action is to call (book by phone).",
         "Where the customer's units sit at more than one location, the telephone shown is that of the most recent visit, and the table carries the location per row.",
         "Where no telephone is found at the location or the organization, the call-to-action is omitted rather than printed with nothing after it."],
        S19_CITE+".",
        [("S19-R19","The body carries the name and telephone of the location, and the call to action is to call. Booking is a conversation, and a telephone is present where an email address often is not"),
         ("S19-R20","Where a customer's units sit at more than one location, the telephone is that of the most recent visit, and the table carries the location per row"),
         ("S19-R21","Where no telephone is found at either the location or the organization, the call to action is omitted rather than printed with nothing after it")],
        S19_NOTE,S19_MARK)
    G.add(s,"The email wording is fixed and reads correctly for any mix of unit states",
        S19_REL,S19_CITE,M,
        S19_PRE+["The customer has units in a mix of states at once - due soon, due today and past due."],
        ["Run the daily reminder send for a customer whose units are in a mix of states.",
         "Open the delivered email and read the wording end to end."],
        ["The wording is the same fixed wording used for every shop (no shop-editable subject, opening or closing).",
         "The wording reads correctly whether there is one unit or many, and for any mix of states - it never needs a separate singular and plural form."],
        S19_CITE+".",
        [("S19-R2","The wording is fixed and the same for every shop. It is phrased so it holds for any mix of states and never needs a singular and a plural form"),
         ("S19-N7","There is no wording editor, no per-message toggle, no subject the shop can change and no reset to default. Those are a later version")],
        S19_NOTE,S19_MARK)
    return root

if __name__=="__main__":
    a=folderA(); b=folderB()
    G.save("build/gap-fill/deferred-created-log.json")
    print("folderA root:",a,"  folderB root:",b)

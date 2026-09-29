import importlib.util
spec=importlib.util.spec_from_file_location("mr_lib","build/maintenance-reminder-v2/mr_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
ADV='You are signed in as a service advisor with edit-customer permission (which governs sending); the maintenance_reminders feature is on.'
WORK='Open Customers > Maintenance reminders and use a row\'s Contact button to open the contact card.'
S14='Epic SV-3780; story SV-10571 (S14, Contact the customer from a row); Chunk 1 MR spec (Confluence 886931488), S14; read 29 Sep 2026.'
S21='Epic SV-3780; story SV-10576 (S21, The audit trail); Chunk 1 MR spec (Confluence 886931488), S21; read 29 Sep 2026.'

S14CASES=[
{"anchors":["S14-R1","S14-R2","S14-R3"],"title":"The Contact card shows labelled phones and a copy-able, tappable set of contacts",
 "pre":[ADV,WORK,'A row whose customer has telephone, mobile, company telephone and an email on file.'],
 "steps":['Open the contact card from a row\'s Contact button and read the numbers and their labels and order.','Find the copy control on the email address.','Tap/click a phone number (open the card on a phone to confirm it is tappable).'],
 "results":[
   'Contact opens a card carrying the contact\'s telephone and mobile, then the customer\'s company telephone, each labelled.',
   'The email address carries a copy control.',
   'A phone number is tappable, so the card is usable on a phone.'],
 "source":S14,
 "quotes":[("S14-R1","Contact will open a card carrying the contact's telephone and mobile, then the customer's company telephone, each labelled"),
           ("S14-R2","The email address will carry a copy control"),
           ("S14-R3","A phone number will be tappable, so the card is usable on a phone")]},
{"anchors":["S14-R4","S14-R5","S14-R6","S14-E2","S14-E3"],"title":"Send reminder sends for one asset only, updates last sent, and has no Resend",
 "pre":[ADV,WORK,'A customer with more than one enrolled unit; the audit trail reachable so a written entry can be checked.'],
 "steps":['On the card, read the send control label and look for any Resend.','Press Send reminder for this asset and confirm what it covers (this asset only, not the customer\'s other units).','After sending, check the audit entry, the "last sent" line, and whether a read receipt is tracked.'],
 "results":[
   'Send reminder sends the email for that one asset with its current state; a send from a row covers that one asset only, never the customer\'s other units.',
   'The send control reads "Send reminder"; nothing is emailed automatically this release, so there is no Resend. (The email is the one specified in S19; its sender and delivery are still to be confirmed, so the action is built here and switched on once they are.)',
   'Sending a reminder writes an audit entry and updates "last sent"; read receipts are not tracked.'],
 "source":S14,
 "quotes":[("S14-R4","Send reminder will send the email for that one asset, with its current state. It carries none of the customer's other units, per S14-R6. The email itself is the one specified in S19; its sender and delivery are still to be confirmed per Open Questions, so the action is built here and switched on once they are"),
           ("S14-R5","The send control reads Send reminder. Nothing is emailed automatically in this release, so there is no Resend"),
           ("S14-R6","A send from a row will cover that one asset only, never the customer's other units"),
           ("S14-E2","Sending a reminder writes an audit entry and updates last sent"),
           ("S14-E3","Read receipts are not tracked")]},
{"anchors":["S14-R8","S14-N2","S14-N4","S14-E1"],"title":"The card reads as complete in every empty state and offers no send where it cannot",
 "pre":[ADV,WORK,'Rows for: a contact with no email; a contact with no phone; a contact with neither; and an asset with no preferred contact.'],
 "steps":['Open the card for a contact with no email, and one with no phone.','Open the card for a contact with neither email nor phone.','Open the card for an asset with no preferred contact.','In each case judge whether the card reads as complete and whether a send action is offered.'],
 "results":[
   'The card renders a state for a contact with no email, and a state for a contact with no phone number.',
   'A contact with neither email nor phone shows both empty states and no send action.',
   'An asset with no preferred contact shows an empty state in place of the contact details, with an action to set one, and no send action until a contact exists.',
   'The empty states are common rather than exceptional, so the card reads as complete in every one of them.'],
 "source":S14,
 "quotes":[("S14-R8","The card will render a state for a contact with no email, and a state for a contact with no phone number"),
           ("S14-N2","A contact with neither email nor phone shows both empty states and no send action"),
           ("S14-N4","An asset with no preferred contact shows an empty state in place of the contact details, with an action to set one. There is no send action until a contact exists"),
           ("S14-E1","The empty states are common rather than exceptional, so the card must read as complete in every one of them")]},
{"anchors":["S14-N1","S14-R9","S14-N5","S14-R10"],"title":"Notification off disables Send with a reason; without edit-customer permission Send is hidden",
 "pre":[ADV,WORK,'A row whose customer has the notification setting off; and access to sign in as a user WITHOUT edit-customer permission.'],
 "steps":['Open the card for a customer whose notification setting is off and read the send control and any reason.','Confirm the row still appears on the worklist and nothing is hidden from the worklist because of the setting.','Sign in as a user without edit-customer permission and open the same card; look for Send reminder.'],
 "results":[
   'Where the customer\'s notification setting is off, Send reminder is disabled with the reason shown beside it (not hidden); the row still appears and the send action names that setting as the reason — an advisor never presses send and gets silence.',
   'Nothing is hidden from the worklist because of the notification setting; it affects sending and nothing else.',
   'A user without edit-customer permission does not see Send reminder at all — hidden rather than disabled, because it is not something they can fix from the card.'],
 "source":S14,
 "quotes":[("S14-N1","Where the customer's notification setting is off, Send reminder is disabled with the reason shown beside it, not hidden"),
           ("S14-R9","Where the customer's notification setting is off, the row still appears and the send action is unavailable, naming that setting as the reason. An advisor must never press send and get silence"),
           ("S14-N5","Nothing is hidden from the worklist because of the notification setting. It affects sending and nothing else"),
           ("S14-R10","Sending by hand follows the permission to edit a customer ... A user without it does not see Send reminder at all, hidden rather than disabled, because it is not something they can fix from the card")]},
{"anchors":["S14-R12"],"title":"A 'last sent' line appears once a reminder has been sent by hand for that asset",
 "pre":[ADV,WORK,'An asset for which a reminder has been sent by hand, and one for which none has.'],
 "steps":['Open the card for an asset with no hand-send and confirm there is no last-sent line.','Send a reminder, reopen the card and read the line beneath the address.'],
 "results":[
   'A line beneath the address reads "last sent <date>" once a reminder has been sent by hand for that asset, so nobody sends twice without knowing.'],
 "source":S14,
 "quotes":[("S14-R12","A line beneath the address reads last sent <date> once a reminder has been sent by hand for that asset, so nobody sends twice without knowing")]},
]

AUD='You are signed in as a service advisor; the maintenance_reminders feature is on. Open the audit trail wherever the build surfaces it for the asset/customer, and check entries against the action you just performed.'
S21CASES=[
{"anchors":["S21-R1","S21-R3"],"title":"Every maintenance state change writes an audit entry with an actor and a timestamp",
 "pre":[AUD,'An enrolled asset you can drive through readings, a correction, a completion and its undo, a skip, a compliance record change, a cycle-date correction, an enrolment, a removal, a schedule edit, archive/restore and a send; a completion done at another shop.'],
 "steps":['Perform each state change in turn (reading, correction, completion + undo, skip, compliance record change, cycle-date correction after invoicing, enrolment, removal, schedule edit, archive, restore, send).','After each, open the audit trail and confirm an entry with an actor and a timestamp.','For a completion done at another shop, read where the entry records it happened.'],
 "results":[
   'Every state change produces an entry with an actor and a timestamp — readings, corrections, completions and their undo, skips, compliance record changes, cycle-date corrections in the step after invoicing, enrolments, removals from a schedule, schedule edits, archive and restore, and sends.',
   'A completion records where it happened, including when that is another shop.'],
 "source":S21,
 "quotes":[("S21-R1","Every state change produces an entry with an actor and a timestamp: readings, corrections, completions and their undo, skips, compliance record changes, cycle-date corrections in the step after invoicing, enrolments, removals from a schedule, schedule edits, archive and restore, and sends"),
           ("S21-R3","A completion will record where it happened, including when that is another shop")]},
{"anchors":["S21-R2","S21-E1"],"title":"Adding a service to a work order writes a note and an audit entry naming its origin",
 "pre":[AUD,'A work order to which a maintenance service is added from a schedule.'],
 "steps":['Add a maintenance service to a work order.','Read the work order note and the audit entry.','Look at whether the per-line origin tag is present or deferred.'],
 "results":[
   'Adding a service to a work order writes both a work order note and an audit entry, naming the schedule and service it came from.',
   'Where the note and the audit entry record the origin, a per-line tag is cosmetic and can be deferred.'],
 "source":S21,
 "quotes":[("S21-R2","Adding a service to a work order will write both a work order note and an audit entry, naming the schedule and service it came from"),
           ("S21-E1","Where the note and the audit entry record the origin, a per line tag is cosmetic and can be deferred")]},
{"anchors":["S21-R4","S21-E2"],"title":"A reading correction keeps both values, and a moved due date is traceable to the reading that moved it",
 "pre":[AUD,'An asset with a recorded reading that you will correct; and a service whose due date will move weeks later when a new reading is entered.'],
 "steps":['Correct a reading and open the audit trail; read both the old and the new value.','Enter a new reading that moves a due date weeks out, then trace the moved due date back through the audit trail.'],
 "results":[
   'A reading correction keeps both values, each with its timestamp and author.',
   'A due date that moved weeks after a new reading is traceable to the reading that moved it.'],
 "source":S21,
 "quotes":[("S21-R4","A reading correction will keep both values, each with its timestamp and author"),
           ("S21-E2","A due date that moved weeks after a new reading must be traceable to the reading that moved it")]},
{"anchors":["S21-R5"],"title":"Sends are logged with message, recipient and timestamp",
 "pre":[AUD,'An asset for which a reminder is sent by hand.'],
 "steps":['Send a reminder, then open the audit trail and read the send entry.'],
 "results":[
   'Sends are logged with message, recipient and timestamp.'],
 "source":S21,
 "quotes":[("S21-R5","Sends will be logged with message, recipient and timestamp")]},
{"anchors":["S21-R6","S21-N1","S21-N2"],"title":"Audit entries outlive the objects they describe and are never hard-deleted",
 "pre":[AUD,'A disposable test asset you can unenrol, a schedule you can archive, and a work order link that an audited action references.'],
 "steps":['Unenrol an asset that carries audit entries and confirm the entries remain.','Archive a schedule that carries audit entries and confirm the entries remain.','Confirm a work order link referenced by the trail is never hard-deleted.'],
 "results":[
   'Audit entries outlive the objects they describe; nothing that carries one is hard-deleted.',
   'A work order link is never hard-deleted, or the trail goes with it.',
   'An unenrolled asset and an archived schedule keep their entries.'],
 "source":S21,
 "quotes":[("S21-R6","Audit entries will outlive the objects they describe. Nothing that carries one is hard deleted"),
           ("S21-N1","A work order link is never hard deleted, or the trail goes with it"),
           ("S21-N2","An unenrolled asset and an archived schedule keep their entries")]},
{"anchors":["S21-R7"],"title":"A notification-setting change is recorded; asserting consent on a customer's behalf carries a name and date",
 "pre":[AUD,'A customer whose notification setting you can change, and the case where a shop asserts the customer\'s consent on their behalf.'],
 "steps":['Change a customer\'s notification setting and open the audit trail; read who made it and when.','Assert the customer\'s consent on their behalf and confirm a name and a date are recorded against it.'],
 "results":[
   'A change to a customer\'s notification setting is recorded with who made it and when.',
   'A shop asserting a customer\'s consent on their behalf is the one thing that later needs a name and a date against it.'],
 "source":S21,
 "quotes":[("S21-R7","A change to a customer's notification setting is recorded with who made it and when. A shop asserting a customer's consent on their behalf is the one thing that later needs a name and a date against it")]},
]
L.run("S14",S14CASES,"build/maintenance-reminder-v2/created-log.json")
L.run("S21",S21CASES,"build/maintenance-reminder-v2/created-log.json")

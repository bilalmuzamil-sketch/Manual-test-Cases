# -*- coding: utf-8 -*-
"""Chunk-2 batch 5: S19 Customer reminder email sent by hand (26642); Numeric & date accuracy (26644)."""
import sys,os
sys.path.insert(0,os.path.dirname(__file__))
import mr2_lib as M

# ===================== S19 — The customer reminder email (sent by hand) (26642) =====================
S="SV-10575"; L="S19, The customer reminder email (sent by hand)"; P="Part 2 / S19"
p=["You are signed in with Create and edit customers, on the build under test. The Maintenance Reminders feature is on (maintenance_reminders flag).",
 "A customer whose 'Send preventive maintenance notifications' setting is ON, with an asset that has a preferred contact carrying an email address (e.g. customer 'ZZAUTOTEST Fleet Co', unit 'Truck 12', contact 'Dave Brabay').",
 "The asset has one or more services currently inside their reminder window. Open the asset's contact card."]
M.add(26642,"One email, sent by hand via Send reminder; nothing sends automatically in v1",S,L,P,
 p,
 ["On the contact card, use Send reminder for one asset.","Confirm there is no automatic/scheduled sending anywhere in v1.","Confirm every message v1 sends goes to a customer (there is no internal email)."],
 ["One email exists; Send reminder on the contact card sends it for one asset.",
  "Nothing sends it automatically in v1 (automatic sending is deferred to v2).",
  "There is no internal email - every message v1 sends goes to a customer."],
 [("S19-R1","One email will exist. Send reminder on the contact card sends it for one asset, per S14-R6. Nothing sends it automatically in v1"),
  ("S19-N5","There is no internal email. Every message v1 sends goes to a customer")])
M.add(26642,"Send reminder opens the existing email dialog with the right recipients",S,L,P,
 p,
 ["Use Send reminder.","Confirm it opens the application's existing send email dialog.","Read the recipient list and checkboxes.","Confirm the asset's preferred contact is ticked and there is a field for further addresses."],
 ["Send reminder opens the application's existing send email dialog.",
  "Its recipients are the customer's contacts that have an email address, each with a checkbox, and the asset's preferred contact ticked.",
  "The dialog has a field for further addresses."],
 [("S19-R3","Send reminder opens the application's existing send email dialog. Its recipients are the customer's contacts that have an email address, each with a checkbox and the asset's preferred contact ticked, and the dialog's field for further addresses")])
M.add(26642,"Content prefilled with fixed wording, editable for one send; no shop editor",S,L,P,
 p,
 ["Open the Send reminder dialog.","Read the prefilled content and confirm it is the fixed wording, phrased to hold for any mix of states (no singular/plural forms).","Edit the content for this one send and confirm it is allowed.","Confirm the reminder table beneath is read-only and there is no wording editor in Settings."],
 ["The content box is prefilled with the fixed wording, which is the same for every shop and holds for any mix of states (no singular and plural forms).",
  "The content can be changed for that one send, as in every email sent from that dialog; beneath it the reminder table for the asset is read only.",
  "There is no wording editor in Settings, no subject the shop can change and no reset to default - changing one send's content is not an editor."],
 [("S19-R2","The wording the dialog opens with is fixed and the same for every shop. It is phrased so it holds for any mix of states and never needs a singular and a plural form"),
  ("S19-R4","The dialog's content box is prefilled with the wording of S19-R2 and can be changed for that one send, as in every email sent from that dialog. Beneath it the reminder table for the asset is read only. There is no wording editor for the shop, per S19-N7"),
  ("S19-N7","There is no wording editor in Settings, no subject the shop can change and no reset to default. Those are a later version. Changing the content of one send in the dialog is not an editor")])
M.add(26642,"The email lists every in-window service with its state; nothing beyond it",S,L,P,
 p,
 ["On an asset with one service due today and another overdue, send the reminder.","Read the email's table.","Confirm it lists every service of the asset currently inside its reminder window, whatever its state.","Confirm a service due in eleven months does not ride along."],
 ["An asset with one service due today and another overdue gets one email listing both, with the state per row.",
  "The email carries every service of the asset currently inside its reminder window, whatever state each one is in.",
  "Nothing outside the window is included (a service due in eleven months does not ride along).",
  "Each row names the unit, the service where known, when it is due and its state: Past due, Due today or Coming up."],
 [("S19-R5","An asset with one service due today and another overdue gets one email listing both. The table carries the state per row"),
  ("S19-R6","An email will carry every service of the asset that is currently inside its reminder window, per S5, whatever state each one is in"),
  ("S19-R7","Nothing outside the window is included. A service due in eleven months does not ride along"),
  ("S19-R8","Each row in the email names the unit, the service where known, when it is due and its state: Past due, Due today or Coming up")])
M.add(26642,"Each unit shows its due month (Low where it applies); a guess reads Soon",S,L,P,
 p,
 ["Send a reminder for an asset whose due date is an estimate.","Read how the date shows in the email.","For a Low-confidence / guess date, confirm it reads Soon rather than a month."],
 ["Each unit shows its due month, with Low confidence where it applies, exactly as the worklist shows it.",
  "Where a row's date would be a guess, it reads 'Soon' rather than a month the shop would be held to."],
 [("S19-R9","Each unit shows its due month, with Low confidence where it applies, exactly as the worklist shows it per S11-R9. Where a row's date would be a guess, it reads Soon rather than a month the shop would be held to.")])
M.add(26642,"Sender is the shop over the platform address; Reply-To is the sender; BCC copy",S,L,P,
 p,
 ["Send a reminder and inspect the delivered email's From and Reply-To.","Use the dialog's toggle to include your own email and confirm a BCC copy.","Confirm it reuses the work-order send mechanism as it stands."],
 ["The email is sent as the organization's name over the platform sending address (ShopView's own address never shows as the sender's name).",
  "Reply-To is the user who pressed Send, as on invoice and purchase-order emails; the dialog's toggle to include their own email sends them a copy as BCC.",
  "The send reuses the work order send mechanism as it stands (the dialog, the organization as sender over the platform address, and the reply address of the user who pressed Send)."],
 [("S19-R17","The email is sent as the organization's name over the platform sending address, the same pattern the invoice and purchase order emails already use. ShopView's own address never shows as the sender's name"),
  ("S19-R18","Reply-To is the user who pressed Send, as on the invoice and purchase order emails. The dialog's toggle to include their own email sends them a copy as BCC"),
  ("S19-N8","The send reuses the work order send mechanism as it stands: the dialog, the organization as sender over the platform address, and the reply address of the user who pressed Send"),
  ("S19-R16","The layout and the wording will be hardcoded, populated from shop and asset data, and will follow the existing ShopView send pattern")])
M.add(26642,"The email opens with the contact's name, invoice-style signature, call to call",S,L,P,
 p,
 ["Send a reminder and read the opening line, the signature and the call to action.","On a location with no telephone, confirm the call to action is omitted."],
 ["The email opens with the chosen contact's first and last name (for example 'Hi Dave Brabay').",
  "The signature is the one the invoice email carries: Best regards, the user's name, the organization's name and the telephone of the location chosen in the header; the call to action is to call.",
  "Where the location has no telephone, the call to action is omitted rather than printed with nothing after it."],
 [("S19-R19","The email opens with the chosen contact's first and last name, for example Hi Dave Brabay. The signature is the one the invoice email already carries: Best regards, the user's name, the organization's name and the telephone of the location chosen in the header. The call to action is to call. Booking is a conversation, and a telephone is present where an email address often is not"),
  ("S19-R21","Where the location has no telephone, the call to action is omitted rather than printed with nothing after it")])
M.add(26642,"Footer states why received; no unsubscribe link (consent on the customer record)",S,L,P,
 p,
 ["Send a reminder and read the footer.","Confirm it states why the customer received it.","Confirm there is no unsubscribe link."],
 ["The footer states why the customer received the email.",
  "There is no unsubscribe link: consent is managed by a setting on the customer record, not by a link in the mail."],
 [("S19-R15","The footer will state why the customer received it. There is no unsubscribe link: consent is managed by a setting on the customer record, not by a link in the mail")])
M.add(26642,"Setting off blocks any send; every send is recorded; bounces not tracked",S,L,P,
 p,
 ["Turn the customer's 'Send preventive maintenance notifications' setting off and confirm no reminder can be sent for any of their assets.","Send a reminder and open the audit.","Check 'Last sent' on the contact card.","Confirm bounces are not tracked."],
 ["A customer whose notification setting is off cannot be sent a reminder for any of their assets (the setting lives on the customer record, not the asset or enrolment).",
  "Every send is recorded in the audit with the message, the recipients, the user who sent it and the timestamp, and updates 'Last sent' on the contact card.",
  "Bounces are not tracked; nothing reports that a reminder failed to arrive."],
 [("S19-N3","A customer whose notification setting is off cannot be sent a reminder for any of their assets, per S14-R9. The setting lives on the customer record, not on the asset and not on the enrolment"),
  ("S19-R14","Every send is recorded in the audit with the message, the recipients, the user who sent it and the timestamp, per S21-R5, and updates Last sent on the contact card, per S14-R12. Today only invoice and estimate emails are recorded, on their work order, so this record is new"),
  ("S19-E4","Bounces are not tracked. Nothing will report that a reminder failed to arrive")])

# ===================== Numeric & date accuracy (Rule 116) (26644) =====================
SN="SV-10568"; LN="S11/S12/S18, numeric & date accuracy"; PN="Part 2 / S11-S12, S18 (Rule 116)"
pn=["You are signed in with View customers, on the build under test. The Maintenance Reminders feature is on (maintenance_reminders flag).",
 "An asset is enrolled with a mileage-triggered service and you can seed exact dated readings (e.g. unit 'ZZAUTOTEST Truck 12'). Compute the expected values by hand to check the product."]
M.add(26644,"Rate maths: last 3 usable pairs summed over the days they span (worked example)",SN,LN,PN,
 pn,
 ["Seed readings giving three usable pairs: +2,700 over 30 days, +6,000 over 60 days, +3,000 over 30 days (last reading 345,700).",
  "Read the computed rate.","With the next service at 360,000, read the estimated due month.","Confirm older pairs beyond the last three are not used."],
 ["The rate sums the last three usable pairs over the days they span: 2,700 + 6,000 + 3,000 = 11,700 over 120 days = 97.5 a day.",
  "14,300 remain to 360,000 (360,000 - 345,700), about 147 days, so the service is due in March.",
  "Older pairs beyond the last three are not used."],
 [("S11-R2","The rate is what the meter added across the unit's last three usable pairs, divided by the days those pairs span: the three intervals are added together and read as one period. Older pairs are not used. With one or two usable pairs, all of them are used. A newer interval counts more simply because only the latest ones are taken"),
  ("S11-E6","June to July adds 2,700 in 30 days, July to September 6,000 in 60 days, September to October 3,000 in 30 days: 11,700 in 120 days, a rate of 97.5 a day. The unit last read 345,700 and the next service is at 360,000, so 14,300 remain, about 147 days, and the service is due in March. Its confidence comes from the table in S11-R24, not from this sum")])
M.add(26644,"Confidence table: age of last reading x usable pairs (every cell)",SN,LN,PN,
 pn,
 ["For each combination of last-reading age band (<=30, 31-90, 91-180, 181-365, >365 days) and usable-pair count (1; 2-3; 4+), seed data and read the confidence word.","Compare each result against the locked table."],
 ["Confidence comes from one table reading age of last recorded reading against usable pairs; every combination has its own cell and nothing is graded separately or capped.",
  "Up to 30 days: 1 pair Medium, 2+ High. 31-90 days: 1 pair Low, 2-3 Medium, 4+ High. 91-180 days: 1 pair Low, 2+ Medium. 181-365 days: 4+ Medium, fewer Low. Over 365 days: Low.",
  "A value shown 'In the shop' is not yet recorded and does not refresh the age until its work order is invoiced."],
 [("S11-R22","Confidence comes from one table that reads two things together: how old the unit's last recorded reading is, and how many usable pairs it has. Every combination has its own cell, given in S11-R24 and in the table beneath these requirements. Nothing is graded separately and nothing caps anything"),
  ("S11-R24","By age of the last recorded reading, then usable pairs. Up to 30 days: one pair Medium, two or more High. 31 to 90 days: one pair Low, two or three Medium, four or more High. 91 to 180 days: one pair Low, two or more Medium. 181 to 365 days: four or more Medium, fewer Low. Over 365 days: Low. A value shown In the shop per S10-R11 is not yet recorded and does not refresh the age until its work order is invoiced")])
M.add(26644,"Confidence worked examples (count and age together decide the cell)",SN,LN,PN,
 pn,
 ["Two visits, last reading yesterday (1 pair, under 30 days): read confidence.","Six visits, five pairs, last reading 120 days old: read confidence.","Twelve visits over three years, last reading eight months ago: read confidence; then the same unit fourteen months after its last visit.","A unit whose every reading is older than 24 months."],
 ["Two visits, last reading yesterday (1 pair, under 30 days): Medium.",
  "Six visits, five pairs, last reading 120 days old: Medium. Twelve visits over three years, last visit eight months ago: Medium; the same unit fourteen months after its last visit: Low.",
  "Every reading older than 24 months: No data, and the calendar governs.",
  "One usable pair (two visits in a clean history) is the floor at which anything is computed."],
 [("S11-E5","Two visits, the last one yesterday: one pair, under 30 days, Medium. Six visits, five pairs, the last reading 120 days old: Medium. Twelve visits over three years, the last one eight months ago: Medium. The same unit fourteen months after its last visit: Low. Every reading older than 24 months: No data, and the calendar governs"),
  ("S11-E2","One usable pair, which is two visits in a clean history, is the floor at which anything is computed")])
M.add(26644,"A discarded pair lowers the usable-pair count (and so the confidence)",SN,LN,PN,
 pn,
 ["Seed five visits where one pair breaks a guard (e.g. under 7 days apart, or non-increasing).","Count the usable pairs.","Read the confidence and compare against a clean five-visit history."],
 ["A usable pair is two consecutive readings surviving the guards, from the last 24 months.",
  "Where a guard discards a pair the count drops with it: a unit with five visits and one bad pair has three pairs (not four), so it grades one step lower than a clean five-visit history would."],
 [("S11-R23","A usable pair is two consecutive readings that survive the guards in S11-R4, S11-R5, S11-R19 and S11-R20, after S11-R6 has removed impossible readings. Only readings from the last 24 months count, per S11-R26. No usable pair is No data. In a clean history one pair is two visits, two or three pairs are three or four visits, and four or more pairs are five or more visits. Where a guard discards a pair the count drops with it")])
M.add(26644,"Estimated values round: distance to nearest 100, hours to nearest 10",SN,LN,PN,
 pn,
 ["Seed data producing an estimated distance (e.g. a projected 345,732) and an estimated hours figure.","Read how each estimate is shown.","Read a recorded reading."],
 ["Estimated distance rounds to the nearest 100 and estimated hours to the nearest 10.",
  "A recorded reading is shown exactly as entered (never rounded)."],
 [("S11-R12","Estimated distance will round to the nearest 100 and estimated hours to the nearest 10. A recorded reading is shown exactly as entered")])
M.add(26644,"24-month cut-off: readings older than two years give No data, calendar governs",SN,LN,PN,
 pn,
 ["Seed a unit whose only readings are all older than 24 months.","Read the service's due basis.","Confirm the readings are not used for the rate or the pair count."],
 ["Readings older than 24 months are not used, for the rate or for the pair count.",
  "A unit whose readings are all older than 24 months reads No data and the calendar governs, as for a unit never read."],
 [("S11-R26","Readings older than 24 months are not used, for the rate or for the pair count. A unit whose readings are all older than that reads No data and the calendar governs, as for a unit never read")])
M.add(26644,"Due date: the earliest candidate wins; compliance = the certificate End date",SN,"S12, Due date resolution","Part 2 / S12 (Rule 116)",
 pn,
 ["Seed a service with a calendar candidate and an earlier mileage candidate; read the Due date.","On a compliance service, read the Due date against the certificate's End date.","Confirm due-soon / due-today / overdue fall on the right days."],
 ["Due is the earliest candidate across the service's active triggers.",
  "A compliance service is due on its current certificate's End date; it reads due soon from its Remind before expiry, due today on that day and overdue from the next day."],
 [("S12-R5","Due will be the earliest candidate"),
  ("S12-R4","A compliance service is due on its current certificate's End date. It reads due soon from its Remind before expiry, due today on that day and overdue from the next day")])
M.add(26644,"Reset/next-due dates count from the work date, not the paperwork date",SN,"S18, Complete a service","Part 1 / S18 (Rule 116)",
 pn,
 ["Mark a service complete on Monday (the work date) and confirm the next cycle counts from Monday.","Invoice the work order three weeks later and confirm the next due does not move.","Change the proposed reset date and confirm the next due follows it through the service's interval."],
 ["The next due counts from the day the work was done (the Reset date), not the invoice/paperwork date.",
  "A truck serviced Monday and invoiced three weeks later counts its next cycle from Monday, and invoicing later changes nothing.",
  "The proposed reset date is editable and the next due follows it through the service's own interval and updates as it changes."],
 [("S18-R14","The proposed date is editable and names the day the work was done. The next due follows from it through the service's own interval and updates as it changes, so a shop invoicing weeks late resets from the work rather than from the paperwork"),
  ("S18-E8","A truck serviced on Monday and invoiced three weeks later is marked complete on Monday and counts its next cycle from Monday. The worklist shows nothing due for it in between, and invoicing later changes nothing")])
M.save(os.path.join(os.path.dirname(__file__),"created-chunk2.json"))

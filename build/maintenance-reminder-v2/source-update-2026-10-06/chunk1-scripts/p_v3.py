# Third pass (coordinator, 6 Oct): fold in the final design drive (DESIGN-DRIVE-FINDINGS.md + spec-comparison.md).
# Design-only details a tester would see are added to the cases that already exercise that screen, cited to the
# design artboard, only where the spec does not contradict them (Rule 115). Contradictions go to DIVERGE (p_v3.DIVERGE).
from p_common import *

DWHY = ' Design drive (6 Oct): adds what the tester sees there on the design, cited to the artboard; the spec does not contradict it.'
DSRC = DES

def add(u, step, result, quotes, art):
    if step: u['steps'].append(step)
    if result: u['results'].append(result)
    for q in quotes: u['quotes'].append(q)
    if 'Design drive (6 Oct)' not in u['why']: u['why'] += DWHY
    if art and DES not in u['source']:
        u['source'] = u['source'].replace('; read 6 Oct 2026.', f'; {DES}, {art}; read 6 Oct 2026.')
    elif art and art not in u['source']:
        u['source'] = u['source'].replace('; read 6 Oct 2026.', f' and {art}; read 6 Oct 2026.')

def apply(U, N):
    add(U[146316], None, 'On the design the blank name shows the inline message "Enter a service name." (record the build\'s wording).',
        [['Design board, artboard V1 (validation)', 'Enter a service name.']], 'artboard V1')

    add(U[146318], 'Hover the "Every" operator and read its tooltip.',
        'On the design the operator\'s tooltip reads "every rebases on the last completion. at is a fixed point that never moves."',
        [['Design board, service form (operator tooltip)', 'every rebases on the last completion. at is a fixed point that never moves.']], 'service form P04 to P06')

    add(U[146320], None, 'On the design the inline messages read "Enter a whole number." (2.5), "Enter a number greater than 0." (0) and "Choose a day and month." (the empty "At"); record the build\'s wording.',
        [['Design board, artboard V1 (validation)', 'Enter a whole number.'], ['Design board, artboard V1 (validation)', 'Enter a number greater than 0.'], ['Design board, artboard V1 (validation)', 'Choose a day and month.']], 'artboard V1')

    add(U[146314], 'Add a third service ("PM-D", Every 12 months) and see where it lands in the table.',
        'The new service lands at the bottom of the table (design: the drag handle\'s tooltip says "New services land at the bottom.").',
        [['Design board, service table (drag-handle tooltip)', 'New services land at the bottom.']], 'artboard D1 (drag-handle tooltip)')

    add(U[146325], None, 'On the design the (i) reads "e.g. Annual safety, Annual state, Annual federal, Emissions test".',
        [['Design board, artboards K01 and K02 (Type (i))', 'e.g. Annual safety, Annual state, Annual federal, Emissions test']], 'artboards K01, K02')

    add(U[146326], 'Hover the (i) beside Term and the (i) beside Remind before expiry.',
        'On the design the Term (i) reads "1 to 60 months." and the Remind before expiry (i) reads "How far ahead of expiry the service starts to read due soon. It cannot be longer than the term."',
        [['Design board, artboards K01 and K02 (Term (i))', '1 to 60 months.'], ['Design board, artboards K01 and K02 (Remind before expiry (i))', 'How far ahead of expiry the service starts to read due soon. It cannot be longer than the term.']], 'artboards K01, K02')

    add(U[146331], 'Hover the (i) beside the reminder rows, and hover the disabled delete on the "On the due date" row.',
        'On the design the (i) reads "Days from this service’s due date, up to five, when it starts to read due soon. The reminder on the due date cannot be removed." and the disabled delete\'s tooltip reads "The reminder on the due date cannot be removed."',
        [['Design board, service form (reminder (i))', 'Days from this service’s due date, up to five, when it starts to read due soon. The reminder on the due date cannot be removed.'], ['Design board, service form (due-date row tooltip)', 'The reminder on the due date cannot be removed.']], 'service form P04 to P06')

    add(U[146338], 'On the asset\'s Maintenance tab open the schedule menu and hover the (i) beside Remove from schedule.',
        'On the design the (i) reads "Removing a schedule and adding another keeps every cycle: the new schedule\'s services anchor from the last completion of a matching service where one exists, otherwise from now."',
        [['Design board, artboard M1 (schedule header (i))', 'Removing a schedule and adding another keeps every cycle: the new schedule\'s services anchor from the last completion of a matching service where one exists, otherwise from now.']], 'artboard M1')

    u = U[146340]
    u['steps'][0] = 'On asset 402 click Enroll in Schedule and read the modal title (the design titles it "Enroll in a schedule") and the line beneath it; open the same modal on another asset and compare the title.'
    add(u, 'Hover the (i) beside the "LAST SERVICE (OPTIONAL)" heading.',
        'On the design the (i) reads "One last-service date per service. Brakes done last week and an oil service long overdue cannot be described by a single date. Left blank, counting starts today."',
        [['Design board, artboard X1 (title)', 'Enroll in a schedule'], ['Design board, artboard X1 (LAST SERVICE (i))', 'One last-service date per service. Brakes done last week and an oil service long overdue cannot be described by a single date. Left blank, counting starts today.']], 'artboard X1')

    add(U[146341], 'Hover the (i) beside the "Needs mileage reading" badge.',
        'On the design the (i) reads "Each meter is judged on its own: a service measured from mileage and one measured from engine hours never share a badge."',
        [['Design board, artboard X1r (badge (i))', 'Each meter is judged on its own: a service measured from mileage and one measured from engine hours never share a badge.']], 'artboard X1r')

    add(U[146343], 'Hover the (i) beside "Send preventive maintenance notifications" in the modal, and the (i) beside the "Maintenance notifications" toggle on the customer card.',
        'On the design the modal\'s (i) reads "The customer’s own setting, for every asset they own. Reminders are sent by hand with Send reminder. Off, Send reminder is unavailable; due dates are still tracked." and the card\'s (i) reads "Covers every asset this customer owns, including units enrolled later. Turning it off does not remove any unit from maintenance tracking."',
        [['Design board, artboard X1 (notification (i))', 'The customer’s own setting, for every asset they own. Reminders are sent by hand with Send reminder. Off, Send reminder is unavailable; due dates are still tracked.'], ['Design board, artboard CS0 (toggle (i))', 'Covers every asset this customer owns, including units enrolled later. Turning it off does not remove any unit from maintenance tracking.']], 'artboards X1, CS0')

    add(U[146347], 'Hover the (i) beside Type.',
        'On the design the Type (i) reads "The compliance inspection this record belongs to."',
        [['Design board, artboard K4 (Type (i))', 'The compliance inspection this record belongs to.']], 'artboard K4')

    add(U[146348], 'Hover the (i) beside Start date and the (i) beside End date.',
        'On the design the Start date (i) reads "Entered by hand, because it comes from the agency and has nothing to do with when a work order completed." and the End date (i) reads "A certificate is valid through its End date."',
        [['Design board, artboard K4 (Start date (i))', 'Entered by hand, because it comes from the agency and has nothing to do with when a work order completed.'], ['Design board, artboard K4 (End date (i))', 'A certificate is valid through its End date.']], 'artboard K4')

    add(U[146352], 'Hover the (i) beside the mileage "Current estimate".',
        'On the design the (i) reads "The estimate works out a rate from the last three usable pairs of readings, read as one period, and carries the last reading forward at that rate. At least two readings are needed for any estimate. A new recorded reading replaces it outright."',
        [['Design board, artboard S4 (estimate (i))', 'The estimate works out a rate from the last three usable pairs of readings, read as one period, and carries the last reading forward at that rate. At least two readings are needed for any estimate. A new recorded reading replaces it outright.']], 'artboard S4')

    add(U[146355], 'Hover the (i) on the Due column heading.',
        'On the design the (i) reads "The earliest candidate and the trigger that produced it. Other candidates are in the row menu. A date known only to the month shows the month. Every estimate shows a month with its confidence; once due, the badge carries it."',
        [['Design board, artboard S4 (Due (i))', 'The earliest candidate and the trigger that produced it. Other candidates are in the row menu. A date known only to the month shows the month. Every estimate shows a month with its confidence; once due, the badge carries it.']], 'artboard S4')

    add(U[146363], 'Hover the (i) on the due-status column heading and note the heading the build shows.',
        'On the design the (i) reads "Overdue: past its due date. Due today: an exact certificate or calendar date that falls today. Due soon: inside the first reminder, 14 days by default. Empty: not yet due." (the design heads the column "Status"; the spec says "Due status": record the build\'s heading).',
        [['Design board, artboard S1 (Status (i))', 'Overdue: past its due date. Due today: an exact certificate or calendar date that falls today. Due soon: inside the first reminder, 14 days by default. Empty: not yet due.']], 'artboard S1')

    U[146366]['why'] += ' Design drive (6 Oct): the design words the hover differently; the case follows the spec and asks the tester to record the build\'s wording (DIVERGE).'
    U[146366]['results'][2] = U[146366]['results'][2] + ' (The design\'s hover reads "Contact · no phone or email on file"; record the build\'s wording.)'
    U[146366]['quotes'].append(['Design board, artboard S1 (Contact hover)', 'Contact · no phone or email on file'])
    U[146366]['source'] = U[146366]['source']

    u = U[146373]
    add(u, 'On each card read the empty-state labels and hover their (i).',
        'On the design: no email reads "No email address" with "Add an address" and the (i) "The phone is the only route until an address is added."; no phone reads "No phone number" with "Add a number" and the (i) "Call is unavailable until one is added. Email is the only route."; no contact reads "No contact information" with "Add contact information".',
        [['Design board, artboard B1e (no email)', 'The phone is the only route until an address is added.'], ['Design board, artboard B1p (no phone)', 'Call is unavailable until one is added. Email is the only route.'], ['Design board, artboard B1p (no contact)', 'No contact information'], ['Design board, artboard B1p (no contact)', 'Add contact information']], 'artboards B1e, B1p')

    u = U[146374]
    add(u, None, None, [['Design board, artboard B1o', 'Notifications off for this customer'], ['Design board, artboard B1o', 'Turn on for this customer'], ['Design board, artboard B1o', 'Last sent 12 Aug, before it was turned off']], 'artboard B1o')
    u['steps'][2:2] = ['Still as the advisor, read the lines under the email address on that card.',
                       'On the customer information card turn "Maintenance notifications" on, send a reminder from the row\'s Contact card, turn the toggle off again and reopen the Contact card.']
    u['results'][2:2] = ['On the design the card reads "Notifications off for this customer" and offers "Turn on for this customer" (a design-only shortcut; record whether the build has it).',
                         'The last-sent line still shows the date of that send while Send reminder is disabled (on the design it reads e.g. "Last sent 12 Aug, before it was turned off"; record the build\'s wording).']

    add(U[146313], None, 'On the design the validation note reads "Blank on blur reverts to the previous name. Same for rename."',
        [['Design board, artboard V1 (validation)', 'Blank on blur reverts to the previous name. Same for rename.']], 'artboard V1')
    add(U[146320], None, 'On the design the number-field note reads "Digits only. Letters cannot be typed, so there is no error state."',
        [['Design board, artboard V1 (validation)', 'Digits only. Letters cannot be typed, so there is no error state.']], 'artboard V1')
    add(U[146331], 'Open a schedule in the service builder and hover the (i) on the reminder step.',
        'On the design that (i) reads "Every new service starts with these rows. Days from this service’s own due date, up to five, when it starts to read due soon."',
        [['Design board, artboards R4 and R4ro (reminder step (i))', 'Every new service starts with these rows. Days from this service’s own due date, up to five, when it starts to read due soon.']], 'artboards R4, R4ro')
    add(U[146329], None, 'On the design the hover card is headed "COVERS" and then "CANNED LINES".',
        [['Design board, editor service table (line-count hover card)', 'COVERS'], ['Design board, editor service table (line-count hover card)', 'CANNED LINES']], 'editor service table (line-count hover card)')
    add(U[146373], None, 'On the design a contact with neither shows "No phone number" with the hover "Nothing to call." and "No email address" with the hover "Nothing to send to."',
        [['Design board, artboard B1p (no phone, no email)', 'Nothing to call.'], ['Design board, artboard B1p (no phone, no email)', 'Nothing to send to.']], None)

    n = N[24]  # NEW-25 Send reminder offered when any contact has an email
    assert 'any contact' in n['title']
    n['results'][1] = 'The Send email dialog opens (the design titles it "Send email"), listing the customer\'s contacts to pick from with the preferred contact tagged "Preferred contact", a field for "Optional emails" and the toggle "Include your email to BCC"; the email goes to the picked contact and arrives in your inbox.'
    n['results'].insert(2, 'On the design the Optional emails field hints "Addresses separated by commas" and the reminder text is marked "Read only".')
    n['quotes'] += [['Design board, artboard B5 (dialog)', 'Addresses separated by commas'], ['Design board, artboard B5 (dialog)', 'Read only'], ['Design board, artboard B5 (dialog)', 'Send email'], ['Design board, artboard B5 (dialog)', 'Preferred contact'], ['Design board, artboard B5 (dialog)', 'Optional emails'], ['Design board, artboard B5 (dialog)', 'Include your email to BCC']]
    n['source'] = n['source'].replace('artboards B1l, B5l;', 'artboards B1l, B5, B5l;')

def mech_fix(cid, u):
    if cid == 146310:
        u['results'][0] = 'The empty screen offers one thing to press: on the design it reads "No schedules yet" with the button "Create the first schedule" (record the build\'s wording).'
        u['quotes'] = [['Chunk 1 MR, S1 Nothing there yet', 'The first screen every shop sees has one thing to press.'],
                       ['Design board, artboard P01', 'No schedules yet'], ['Design board, artboard P01', 'Create the first schedule']] + u['quotes']
        u['why'] += DWHY
        u['source'] = u['source'].replace('; read 6 Oct 2026.', f'; {DES}, artboard P01; read 6 Oct 2026.')
    if cid == 146317:
        add(u, 'Hover the (i) beside "Triggers and intervals".',
            'On the design the calendar checkbox hover reads "Calendar always applies, so every service comes due even with no readings." and the (i) beside "Triggers and intervals" reads "Calendar is required so the service always comes due. Distance and engine-hour readings come from work orders and are often missing, so they are optional additions that bring the service due sooner when a unit works harder. Whole numbers only."',
            [['Design board, service form (Calendar hover)', 'Calendar always applies, so every service comes due even with no readings.'], ['Design board, service form (Triggers (i))', 'Calendar is required so the service always comes due. Distance and engine-hour readings come from work orders and are often missing, so they are optional additions that bring the service due sooner when a unit works harder. Whole numbers only.']], 'service form P04 to P06')
    if cid == 146324:
        add(u, 'Hover the (i) beside "Is this a compliance inspection?".',
            'On the design the (i) reads "A compliance inspection runs on the term the agency set, so distance and calendar triggers do not apply. The certificate’s End date is held on the asset’s record."',
            [['Design board, service form (compliance (i))', 'A compliance inspection runs on the term the agency set, so distance and calendar triggers do not apply. The certificate’s End date is held on the asset’s record.']], 'service form P04, K01')
    if cid == 146353:
        add(u, 'Hover the (i) beside the list heading.',
            'On the design the (i) reads "One list for the whole asset, ordered by what comes due first. Schedules are a column, not a heading, so two schedules never split the order."',
            [['Design board, artboard S4 (list (i))', 'One list for the whole asset, ordered by what comes due first. Schedules are a column, not a heading, so two schedules never split the order.']], 'artboard S4')
    if cid == 146360:
        add(u, 'Hover the (i) on the Needs readings tile.',
            'On the design the (i) reads "A meter with no reading, or not enough readings to measure a rate. The calendar date still shows, and every action stays available."',
            [['Design board, artboard S1 (Needs readings (i))', 'A meter with no reading, or not enough readings to measure a rate. The calendar date still shows, and every action stays available.']], 'artboard S1')
    if cid == 146364:
        add(u, 'Hover the meter icon beside the estimated due month.',
            'On the design the hover reads "Based on mileage estimate".',
            [['Design board, artboard S1 (meter hover)', 'Based on mileage estimate']], 'artboard S1')
    if cid == 146371:
        add(u, 'Hover the copy control beside the email address.',
            'On the design its tooltip reads "Copy address".',
            [['Design board, artboard B1 (copy control tooltip)', 'Copy address']], 'artboard B1')

EXCLUDE = [
 dict(item='Design drive 3a: Engine hours "Current estimate" (i) "The same calculation, run against the hour meter." and the P2/P3 reading-card (i)s', reason='Reading cards and the estimate are S10/S11 (Chunk 2); the Chunk 1 copy of S11 covers confidence only. Handed to the Chunk 2 review; Chunk 1 case C146352 carries the mileage estimate (i).'),
 dict(item='Design drive 3a: designer notes (captions on artboards X1, X1s, X1r, CS0, P4, B4, B4f, B1o, T5) and the pencil tooltip "Edit"', reason='Designer notes are board annotations, not product screens, so a tester never sees them; the pencil tooltip is the existing product control. No case.'),
 dict(item='Design drive 3a: Canned lines per location proposal board hover (hours per line, e.g. "Engine oil and filter change 1.2 hours")', reason='Confirms S4-R2 (hours per line, no price), already tested by C146328; no new behaviour. No change.'),
 dict(item='Design drive "spec states that no artboard draws" (S1-E2 name-in-use message, S7-E1 Mark as done / Leave due, S7-R19 count statement, S11 "No data", S11-R27 hover ending, S13-R33 "No reminders match", S1-R10 Move up / Move down)', reason='Not excluded from testing: the cases keep the spec wording as their only source (C146313, C146342, C146343, C146365, C146314, NEW-7). Listed so nobody takes screen wording for them from the design.'),
]

DIVERGE = [
 dict(topic='Contact button hover: spec "No phone or email on file"; design "Contact · no phone or email on file"',
      source_a=['S13-R41', 'the row\'s Contact button has an orange border and a hover: No phone or email on file'],
      source_b=['Design board, artboard S1 (Contact hover)', 'Contact · no phone or email on file'], affected_cases=[146366]),
 dict(topic='Worklist Due-column (i) grades one pair as Low; the spec table grades one pair up to 30 days as Medium',
      source_a=['S11-R24', 'Up to 30 days: one pair Medium, two or more High'],
      source_b=['Design board, artboard S1 (Due (i))', 'Low: one pair, or the last reading is old.'], affected_cases=[146364, 146385]),
 dict(topic='Asset-tab confidence meter hover (desktop): spec ends with the fixed disclaimer and View work orders; the design hover ends differently and has no View work orders',
      source_a=['S11-R27', 'Beside it, View work orders opens the asset\'s Work Orders tab'],
      source_b=['Design board, artboard S4 (meter hover)', 'Low, Medium or High, grading the meter. Four visits inside ten months with the last reading six days old. Confidence falls as the last reading ages. Separate from a reading’s own state, which is recorded or estimated.'], affected_cases=['NEW-7']),
 dict(topic='Record form (i) says any two of term, Start date and End date give the third; the spec derives only the dates from the term and requires the term',
      source_a=['S8-R11', 'A record needs the term and at least one of the two dates'],
      source_b=['Design board, artboard K4 (Term (i))', 'From the certificate. Any two of term, Start date and End date give the third.'], affected_cases=[146348, 146383]),
 dict(topic='Turning notifications off: spec states the count of silenced units; no artboard draws it (the toggle (i) says only that tracking continues)',
      source_a=['S7-R19', 'Turning it off will state how many of that customer\'s enrolled units will not receive reminders'],
      source_b=['Design board, artboard CS0 (toggle (i))', 'Turning it off does not remove any unit from maintenance tracking.'], affected_cases=[146343]),
 dict(topic='Schedule list button: spec "New schedule"; design "New Schedule" (capital S)',
      source_a=['S1-R3', 'New schedule opens an empty editor titled Untitled schedule'],
      source_b=['Design board, artboard R1 (list button)', 'New Schedule'], affected_cases=[146311, 146312, 146313]),
 dict(topic='Compliance row cannot be dragged on the design; the spec makes every service reorderable',
      source_a=['S1-R10', 'Services will be reorderable by drag and by Move up / Move down'],
      source_b=['Design board, service table (compliance drag-handle tooltip)', 'A compliance inspection has no place in the routine ladder. It covers nothing and is covered by nothing, so there is no position to move it to.'], affected_cases=[146314]),
 dict(topic='Remind before expiry (i): the design gives two wordings for one control (K01/K02 vs R6); the spec gives none',
      source_a=['Design board, artboards K01 and K02 (Remind before expiry (i))', 'How far ahead of expiry the service starts to read due soon. It cannot be longer than the term.'],
      source_b=['Design board, artboard R6 (Remind before expiry (i))', 'How far ahead to warn.'], affected_cases=[146326]),
 dict(topic='Blank last-service date: the spec says it is stated in the modal; the design states it only inside a hover (i)',
      source_a=['S7-R4', 'Blank means counting starts today, stated in the modal'],
      source_b=['Design board, artboard X1 (LAST SERVICE (i))', 'Left blank, counting starts today.'], affected_cases=[146340]),
 dict(topic='Spec internal: number fields accept digits only (symbols do not enter), yet a decimal and a negative are "rejected inline"; the design draws a decimal message',
      source_a=['S2-N5', 'A number field accepts digits only. Letters and symbols do not enter the field, so there is no error to show'],
      source_b=['S2-N6', 'An interval of zero is rejected inline, on the same rule as a decimal and a negative'], affected_cases=[146320, 146389]),
 dict(topic='Empty contact card action: tech plan "Set contact" (choose an existing contact); design "Add contact information" (a new contact form)',
      source_a=['Plan 1 §6 P7 ContactCard', 'no-email / no-phone / no-contact states (S14-R8, N2, N4, E1) with "Set contact"'],
      source_b=['Design board, artboard B1p (no contact)', 'Add contact information'], affected_cases=[146373]),
 dict(topic='Demo board (superseded): triggers (i) mentions telematics; spec has no telematics in v1',
      source_a=['S10-N5 (Chunk 2 MR, Confluence 897679389)', 'There is no live telematics feed in v1'],
      source_b=['Design Demo board (Add a service, Triggers (i))', 'Calendar is required so a reminder always fires. Distance and engine-hour readings depend on telematics many assets do not have, so they are optional additions that bring the service due sooner when a unit works harder. Whole numbers only.'], affected_cases=[146317]),
 dict(topic='Demo board (superseded): estimate from the two most recent readings; spec uses the last three usable pairs',
      source_a=['S11-R2 (Chunk 2 MR, Confluence 897679389)', 'The rate is what the meter added across the unit\'s last three usable pairs, divided by the days those pairs span'],
      source_b=['Design Demo board (asset, estimate (i))', 'The estimate takes the two most recent recorded readings, works out a rate from the distance and days between them, and carries the last reading forward at that rate. A new recorded reading replaces it outright.'], affected_cases=[146352]),
 dict(topic='Demo board (superseded): a low-confidence future date reads Soon; spec shows a month at every confidence',
      source_a=['S11-R9', 'Every estimated due date shows a month, at every confidence'],
      source_b=['Design Demo board (asset, Due (i))', 'At low confidence a future date reads Soon; once due, the badge carries it.'], affected_cases=[146357]),
 dict(topic='Demo board (superseded): worklist Due (i) grades confidence by agreement of readings; spec uses the age-by-pairs table',
      source_a=['S11-R22', 'Confidence comes from one table that reads two things together: how old the unit\'s last recorded reading is, and how many usable pairs it has'],
      source_b=['Design Demo board (worklist, Due (i))', 'High: several recent readings agree. Medium: few or older readings. Low: irregular readings, so the month may move.'], affected_cases=[146364, 146385]),
 dict(topic='Demo board (superseded): notification (i) says only the email stops; spec has no automatic email in v1 and Send reminder becomes unavailable',
      source_a=['S14-R9', 'the row still appears and the send action is unavailable, naming that setting as the reason'],
      source_b=['Design Demo board (enrolment, notification (i))', 'The customer’s own setting. It covers every asset they own. Off, due dates are still tracked; only the email stops.'], affected_cases=[146343]),
 dict(topic='Demo board (superseded): compliance (i) says the expiry month is held on the record; spec certificate dates are days',
      source_a=['S8-R10', 'Both are days, picked from a calendar, so nobody has to guess whether a certificate ends on the same day or at the end of a month'],
      source_b=['Design Demo board (compliance switch (i))', 'The expiry month is held on the asset’s record.'], affected_cases=[146324]),
 dict(topic='Demo board (superseded): "absorbs" wording; spec and the current board say "covers"',
      source_a=['S2-N8', 'It covers nothing and is covered by nothing'],
      source_b=['Design Demo board (drag-handle tooltip)', 'It absorbs nothing and is absorbed by nothing'], affected_cases=[146323]),
 dict(topic='Demo board (superseded): Send reminder has its own confirmation step; spec opens the send email dialog directly',
      source_a=['S14-R13', 'It opens the send email dialog of S19-R3, where the user picks who receives it from the customer\'s contacts'],
      source_b=['Design Demo board (B5 designer note)', 'The friction is deliberate, so nobody fires an email with one stray click.'], affected_cases=[146372, 'NEW-25']),
 dict(topic='Design-package defect (note, no case): 35 "Create work order" links in Chunk 1 point at Chunk 2#v5, which does not exist',
      source_a=['Design board, worklist rows (link label)', 'Create work order'],
      source_b=['Design drive findings §1c', 'link → `Chunk 2.dc.html#v5` (Create work order; 35 links)'], affected_cases=[]),
]

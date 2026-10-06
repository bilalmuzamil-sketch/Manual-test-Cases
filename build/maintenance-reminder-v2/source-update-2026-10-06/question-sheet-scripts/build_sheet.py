#!/usr/bin/env python3
"""Maintenance Reminders (Chunk 1 + Chunk 2) - one PO question sheet for Milos Vasic, 6 Oct 2026.

Single source for the rows. Writes:
  spec.json  -> fed to build/testing-tools/make_question_sheet.py (writes the .xlsx + layman check)
  the .md beside the .xlsx (same rows + the QA-internal mapping)
  docx.json  -> reader-facing rows only, for make_docx.js
"""
import json, re, os, sys

REPO = '/home/user/Manual-test-Cases'
BASE = f'{REPO}/build/maintenance-reminder-v2/source-update-2026-10-06'
OUT = f'{BASE}/Maintenance-Reminders_Questions-for-Milos-Vasic_2026-10-06'
HERE = os.path.dirname(os.path.abspath(__file__))
TR = 'https://shopview.testrail.io/index.php?/cases/view/'

c1 = json.load(open(f'{BASE}/chunk1-proposals.json'))
c2 = json.load(open(f'{BASE}/chunk2-proposals.json'))
log1 = json.load(open(f'{BASE}/applied/chunk1-log.json'))['created']
log2 = json.load(open(f'{BASE}/applied/chunk2-log.json'))['created']
C1 = c1['diverge']                      # index 0..52  == CHUNK1-FINDINGS D1..D53
C2 = {x['id']: x for x in c2['diverge']}
assert len(C1) == 53 and len(C2) == 29

# NEW-x (chunk 1) and Nx (chunk 2) -> real case ids, by exact title
t2id1 = {t: i for i, t in log1.items()}
t2id2 = {t: i for i, t in log2.items()}
NEW1 = {f'NEW-{k+1}': t2id1.get(n['title']) for k, n in enumerate(c1['new'])}
NEW2 = {n['key']: t2id2.get(n['title']) for n in c2['new']}

def case_ref(c):
    s = str(c)
    if s in NEW1 or s in NEW2:
        real = NEW1.get(s) or NEW2.get(s)
        return f'C{real} ({s}) {TR}{real}' if real else f'{s} (no id found)'
    n = s.lstrip('C')
    return f'C{n} {TR}{n}'

def item(ref):
    """('c1', idx) or ('c2', 'D3') -> (label, anchors, cases)"""
    kind, k = ref
    if kind == 'c1':
        x = C1[k]
        src = f"{x['source_a'][0]} | {x['source_b'][0]}"
        return f'Chunk 1 D{k+1} (diverge index {k})', src, x['affected_cases']
    x = C2[k]
    src = f"{x['side_a']['source']} | {x['side_b']['source']}"
    return f'Chunk 2 {k}', src, x['affected_cases']

def anchors(src):
    a = sorted(set(re.findall(r'S\d+-[RNE]\d+', src)), key=lambda s: (int(s[1:s.index('-')]), s))
    extra = []
    for pat in [r'Plan [12] §[\w.]+(?: [A-Z]{2}-\d+)?', r'artboards? [\w/ ,]+?(?=[ )(]|$)', r'Demo board', r'old WO chrome|older work-order board|4-work-order', r'key decision', r'Reusable components']:
        extra += re.findall(pat, src)
    return ', '.join(a + sorted(set(e.strip() for e in extra)))

def handling(refs):
    out = []
    if any(k == 'c1' for k, _ in refs):
        out.append("Chunk 1 - the description governs the case wording; the tester records the build's wording where it differs (CHUNK1-FINDINGS §6/§8).")
    for k, v in refs:
        if k == 'c2':
            h = f"Chunk 2 {v} - {C2[v]['case_handling']}"
            if h not in out:
                out.append(h)
    return ' '.join(out)

PM = 'Maintenance Reminders'
OPT_NS = 'Not sure — please check with the engineers'

# ------------------------------------------------------------------ PO rows
S = []   # (sheet, [rows])

S.append(('Schedules in Settings', [
 dict(topic=f'{PM} — Settings, Maintenance (schedules): which services a bigger service covers',
  now='The description says a service covers another one only when the shop picks it; it is never worked out from the interval or from lines the two share. The design’s help text (the “i” beside “Services” in the schedule editor) says the opposite: “A service of larger scope includes the work of every smaller routine service, so one visit clears both.”',
  question='Does a bigger service cover the smaller ones automatically, or only the ones the shop picks for it?',
  options=f'A) Only the ones the shop picks — the help text in the design will be reworded\nB) Automatically — every smaller routine service in the same schedule is covered, and the description will be changed\nC) {OPT_NS}',
  items=[('c1', 28)],
  why='Description vs current design (the design’s own help text). A document-vs-document disagreement is a PO question (skill 07 §5). Older-board “absorbs” wording (Chunk 1 D51, Chunk 2 D26) is on the Older design boards row.'),
 dict(topic=f'{PM} — Settings, Maintenance (schedules): services that repeat every 3 years',
  now='The description says a calendar interval longer than 12 months must be typed in days, and days stop at 999 (about 2 years and 9 months). So a service due every 3 years cannot be set at all. The design’s sample schedule has one set to “Every 36 months”, although the design’s own interval box elsewhere also allows only 1 to 12 months.',
  question='Should a shop be able to set a service that repeats every 3 years (or longer) on the calendar?',
  options=f'A) Yes — allow more than 12 months (please give the highest number of months: ........)\nB) Yes — keep months at 12, but raise the days limit above 999 so it can be typed in days\nC) No — 3-year services are not supported in this version; the sample in the design will be corrected\nD) {OPT_NS}',
  items=[('c1', 29)],
  why='Description vs the design’s sample schedule (PM-D “36 months”). The design contradicts itself (artboard C6 caps months at 1 to 12), so the sample alone would be a designer note; it stays a PO row because it exposes a real product gap the description creates (days capped at 999, months at 12), which only the PO can decide.'),
 dict(topic=f'{PM} — Settings, Maintenance (schedules): typing a decimal or a minus sign into a number box',
  now='The description says two different things. One sentence: number boxes accept digits only, so a decimal point or a minus sign simply does not go in and there is no message. Another sentence: zero is refused with a message “on the same rule as a decimal and a negative”. The design draws a message for a decimal: typing 1.5 shows “Enter a whole number.”',
  question='When someone types 2.5 or -3 into an interval box, what should happen?',
  options=f'A) The “.” or “-” does not go in at all, so there is no message (only zero gets a message)\nB) The characters go in and a message appears under the box, as the design draws (“Enter a whole number.”)\nC) {OPT_NS}',
  items=[('c1', 42)],
  why='The description contradicts itself, and the design takes one side. An ambiguous source is never settled from the build (Rule 58).'),
 dict(topic=f'{PM} — Settings, Maintenance (schedules): copying one service inside a schedule',
  now='In the design, the menu on a service row in the schedule editor offers “Edit service”, “Duplicate” and “Remove service”. The description says a service can be edited or removed, and says nothing about duplicating one. (Duplicating a whole schedule is in the description already; this is about one service inside a schedule.)',
  question='Should a service in a schedule have a “Duplicate” option?',
  options=f'A) Yes — keep “Duplicate”; it makes a copy of that service in the same schedule (please say what the copy is called: ........)\nB) No — only edit and remove; “Duplicate” comes out of the service menu\nC) {OPT_NS}',
  items=[('c1', 3)],
  why='Design adds an action the description does not describe; also listed in Chunk 1 findings §9 “Questions for the PO”.'),
 dict(topic=f'{PM} — Settings, Maintenance (schedules): moving a compliance inspection in the list',
  now='The description says every service in a schedule can be moved by dragging, or with Move up / Move down. In the design, a compliance inspection row cannot be moved; its tooltip says it “has no place in the routine ladder … so there is no position to move it to.”',
  question='Can a compliance inspection be moved up or down the list of services?',
  options=f'A) No — compliance inspections stay where they are, as the design shows\nB) Yes — every service can be moved, compliance inspections included\nC) {OPT_NS}',
  items=[('c1', 39)],
  why='Description vs current design.'),
 dict(topic=f'{PM} — Settings, Maintenance (schedules): the “New schedule” button',
  now='The button on the list of schedules reads “New schedule” in the description and “New Schedule” (capital S) in the design.',
  question='Which spelling should the button use?',
  options='A) “New schedule”\nB) “New Schedule”\nC) Whichever matches the app’s other “New …” buttons',
  items=[('c1', 38)],
  why='Label wording, description vs design. Kept as its own row because it is the only wording difference on this screen.'),
]))

S.append(('Asset Maintenance tab', [
 dict(topic=f'{PM} — the asset’s Maintenance tab: four wording differences',
  now='The description and the design use different words in four places:\n(a) A unit on no schedule. Description: “This unit is not on a maintenance schedule”. Design: “Not on a maintenance schedule”.\n(b) The button that puts it on one. Description: “Enroll in Schedule” (also on the work order’s maintenance card). Design: “Enroll in a schedule” (on the tab, on the work order card, and as the title of the window it opens).\n(c) A compliance inspection with no certificate recorded. Description: “No record”. Design: “Certificate unknown” on the tab, “no certificate on file” in the enrolment window.\n(d) The button to add a certificate. Description: “+ Add record”. Design: “Add history record” (also the form’s title and its confirmation).',
  question='For each of (a) to (d), whose words should the screen use?',
  options='A) The description’s words for all four\nB) The design’s words for all four\nC) Mixed — please write the letter and the side, e.g. “a: design, b: description, c: design, d: description”',
  items=[('c1', 18), ('c1', 11), ('c2', 'D8'), ('c1', 12), ('c1', 19), ('c1', 20)],
  why='Label wording, description vs design, grouped per screen so the PO answers once. The enrolment window title (Chunk 1 D12) has no description wording; design “Enroll in a schedule” vs plan “Enroll in schedule” is settled for the cases by the 12 Aug ruling (design over plan) and is mentioned here only as context.'),
 dict(topic=f'{PM} — the asset’s Maintenance tab: is a certificate’s term required?',
  now='The description says a certificate record needs its term plus at least one of its two dates, and cannot be saved without the term. The design’s help text beside “Term” on the record form says: “Any two of term, Start date and End date give the third.” That would let someone save a Start date and an End date with no term.',
  question='Must every certificate record have a term?',
  options=f'A) Yes — the term is always required; the help text will be reworded\nB) No — any two of term, Start date and End date are enough, and the system works out the third\nC) {OPT_NS}',
  items=[('c1', 36)],
  why='Description vs current design (help text that implies different saving rules).'),
 dict(topic=f'{PM} — the asset’s Maintenance tab: what sits under an estimated due month',
  now='For a due date estimated from mileage or engine hours, the description puts a small confidence meter and a word (High, Medium or Low confidence) under the month, and keeps the reason (for example “based on mileage estimate”) inside the meter’s hover. The reminders list follows the same rule. The design’s desktop asset tab instead prints “Based on mileage estimate” under the month, with no meter.',
  question='What should appear under an estimated month on the asset’s Maintenance tab?',
  options=f'A) The meter and the confidence word, with the reason in the hover (as described)\nB) The reason as plain text, with no meter (as drawn)\nC) Both — the meter and the word, and the reason as plain text\nD) {OPT_NS}',
  items=[('c1', 21)],
  why='Description vs current design (layout of the estimated-date cell).'),
 dict(topic=f'{PM} — the asset’s Maintenance tab: how the confidence hover ends',
  now='The description says the confidence meter’s hover always ends with: “This is the system’s best estimate from this unit’s past readings. Check its history if in doubt.” and has a “View work orders” link beside it that opens the asset’s Work Orders tab. The design’s hovers (desktop and phone) end with other explanations, and no screen in the design shows “View work orders”.',
  question='Should the hover end with that sentence and offer “View work orders”?',
  options=f'A) Yes — both the sentence and the link, as described\nB) The sentence only, without the link\nC) Neither — the design’s hover text is what you want\nD) {OPT_NS}',
  items=[('c1', 31), ('c1', 35), ('c2', 'D20')],
  why='Description vs current design: the design draws a hover with different content and never draws View work orders. Merged from both reviewers.'),
 dict(topic=f'{PM} — the asset’s Maintenance tab and the work order card: how a certificate’s due date reads',
  now='The description says a due date that comes from a certificate is written as its End date followed by “Certificate”, for example “14 Oct 2026 · Certificate”, and that the work order’s maintenance card uses the same words as the asset tab. The design writes the date with “Based on the certificate term” under it on the asset tab, and the date alone on the work order card (for example “CVIP · Due 14 Sep 2026”).',
  question='How should a certificate’s due date read on the asset tab and on the work order card?',
  options=f'A) “14 Oct 2026 · Certificate” on both, as described\nB) As the design draws it — “Based on the certificate term” under the date on the tab, and the date alone on the card\nC) {OPT_NS}',
  items=[('c1', 22), ('c2', 'D15')],
  why='Description vs current design, on two screens the description ties together. Merged from both reviewers.'),
]))

S.append(('Maintenance reminders list', [
 dict(topic=f'{PM} — the maintenance reminders list: four wording differences',
  now='The description and the design use different words in four places on the list:\n(a) The column showing due soon / due today / overdue. Description: “Due status” (chosen so it never reads as the work order’s own status). Design: “Status”.\n(b) The third summary tile. Description: “Due in 3 months”. Design: “Due in three months”.\n(c) The table when nothing falls in the next three months. Description: it says nothing is due in the next three months. Design: “Nothing is due.”\n(d) The hover on a Contact button when there is no phone or email. Description: “No phone or email on file”. Design: “Contact · no phone or email on file”.',
  question='For each of (a) to (d), whose words should the list use?',
  options='A) The description’s words for all four\nB) The design’s words for all four\nC) Mixed — please write the letter and the side, e.g. “a: description, b: design …”',
  items=[('c1', 5), ('c1', 6), ('c1', 7), ('c1', 33)],
  why='Label wording, description vs design, grouped per screen. For (c) the engineers’ plan agrees with the description.'),
 dict(topic=f'{PM} — the maintenance reminders list: sorting on a phone',
  now='The description says the list is sorted only by clicking a column heading, and that there is no separate sort control. The design’s phone layout has no column headings and shows a “Sort: Due, soonest first” control instead.',
  question='How does someone sort the reminders list on a phone?',
  options=f'A) With the “Sort” control the phone design shows (the “no sort control” rule is for the desktop list)\nB) They cannot — on a phone the list is always soonest due first, with no control\nC) {OPT_NS}',
  items=[('c1', 13)],
  why='Description vs current design (phone).'),
 dict(topic=f'{PM} — the maintenance reminders list: a reminder whose work order is still open',
  now='The description says that once a live work order is linked to a reminder, the row’s “Create work order” button becomes “Open work order”. In the design, rows whose work order is at Estimate or In progress show only the work order number as a link and the “Contact” button — no “Open work order” button.',
  question='When a reminder’s work order is still open, does the row show an “Open work order” button?',
  options=f'A) Yes — “Open work order” takes the place of “Create work order”, as described\nB) No — the work order number link is enough, as drawn\nC) {OPT_NS}',
  items=[('c1', 32)],
  why='Description vs current design.'),
]))

S.append(('Contact card and email', [
 dict(topic=f'{PM} — the contact card on the reminders list: which phone numbers it shows',
  now='The description says the contact card shows the contact’s telephone and mobile, then the customer’s company telephone, each with its own label. The design shows a single phone number, labelled with the person’s name and role (for example “Dave Brabay · owner”).',
  question='Which phone numbers should the contact card show?',
  options=f'A) All three, each labelled, as described\nB) One number only, as drawn (please say which one: ........)\nC) {OPT_NS}',
  items=[('c1', 30)],
  why='Description vs current design.'),
 dict(topic=f'{PM} — the contact card: an asset with no preferred contact',
  now='The description says the card then shows an empty state “with an action to set one”. The engineers read that as “Set contact” — choose one of the customer’s existing contacts. The design shows “Add contact information”, which opens a form for a brand-new contact.',
  question='What should the action on an asset with no preferred contact do?',
  options=f'A) Pick one of the customer’s existing contacts\nB) Add a brand-new contact, as drawn\nC) Both — pick an existing contact or add a new one\nD) {OPT_NS}',
  items=[('c1', 43)],
  why='The description is not specific; the engineers’ plan and the design read it two different ways (different behaviour, not just a label).'),
 dict(topic=f'{PM} — the reminder email: High or Medium confidence dates',
  now='The description says each row of the email shows its due month where the date is sound, and “Soon” where the date would be a guess, including every Low confidence date. The engineers have assumed that every date estimated from mileage or engine hours counts as a guess — so High and Medium confidence dates would also read “Soon”. The engineers raised this on the description’s comment thread on 5 October; if you have already answered it there, just write “answered on the thread”.',
  question='In the reminder email, does a High or Medium confidence estimate show its month, or “Soon”?',
  options=f'A) Its month — only Low confidence dates read “Soon”\nB) “Soon” — every date estimated from readings reads “Soon”, whatever its confidence\nC) {OPT_NS}',
  items=[('c2', 'D3')],
  why='Plan 2 records this as its own assumption, asked on the Chunk 2 thread 2026-10-05 (reply 919502849), with no answer in our sources. The description’s “where the date is sound” is ambiguous (Rule 58). Split from the next row (skill 07 §3: one question per row).'),
 dict(topic=f'{PM} — the reminder email: a unit with no readings to estimate from',
  now='When a unit has no mileage readings yet, its due date comes from the service’s calendar interval. A note in the email design says such a unit reads “Soon” rather than a date. The description does not mention this case.',
  question='In the email, does that unit’s row show its calendar month, or “Soon”?',
  options=f'A) Its calendar month\nB) “Soon”\nC) {OPT_NS}',
  items=[('c2', 'D3')],
  why='Second half of Chunk 2 D3 (design board R1 note vs the description’s silence on a calendar date standing in for a missing estimate).'),
 dict(topic=f'{PM} — the reminder email: certificate rows and “due today” rows',
  now='The description says each row of the email shows its due month. The email design and the engineers’ plan show a certificate’s exact day (for example “14 Aug 2026 · Past due”), and “Today” for a service due today.',
  question='In the email, should a certificate show its exact day, and a service due today say “Today”?',
  options=f'A) Yes to both — exact day for a certificate, “Today” for due today, the month for everything else\nB) No — every row shows its month only\nC) Exact day for a certificate, but the month (not “Today”) for a service due today\nD) {OPT_NS}',
  items=[('c2', 'D4')],
  why='Description vs design and plan together.'),
 dict(topic=f'{PM} — the reminder email: a unit whose only reminder is waiting for a reading',
  now='The reminders list shows a service that is waiting for a mileage reading (“Needs readings”) even when its calendar date is far away. The description says the email carries every service the list shows for the unit — and also that when nothing is overdue, due today or due within the next 91 days, the email carries the next two upcoming services instead, and nothing else. For a unit like this, the two sentences give different emails.',
  question='For a unit whose only row on the list is a “Needs readings” service with a far-off date, what does the email list?',
  options=f'A) That service, because the list shows it\nB) Only the next two upcoming services, marked “Coming up” (that service appears only if it is one of those two)\nC) {OPT_NS}',
  items=[('c2', 'D16')],
  why='The description contradicts itself for this one case.'),
]))

S.append(('Work order maintenance card', [
 dict(topic=f'{PM} — the maintenance card on a work order: what the closed card shows',
  now='The description says the closed card carries a badge counting the services that are due, “the badge alone, with no other text”. The design’s closed card shows a title, the count with a word, and an expand arrow: “Maintenance schedule · 1 due”. The engineers plan a title and a badge with just the number.',
  question='Apart from the count, may the closed card show a title and the word “due”?',
  options=f'A) A title and the number only — e.g. “Maintenance schedule” with a badge reading “1”\nB) As the design shows — “Maintenance schedule” and “1 due”\nC) The badge alone, no title at all\nD) {OPT_NS}',
  items=[('c2', 'D2')],
  why='Description vs current design. The PO’s 5 Oct answer (“the collapsed card carries its badge alone”, recorded in Plan 2) does not say whether a card title is allowed.'),
 dict(topic=f'{PM} — the maintenance card on a work order: does the count include a covered service?',
  now='When the card is opened, a service that another one covers is folded inside it (for example PM-A shown inside PM-C) rather than given its own row. The description says the badge counts “the services” that are due. The engineers have assumed a folded service is not counted separately.',
  question='When PM-A and PM-C are both due and PM-A is folded inside PM-C, does the badge read 1 or 2?',
  options=f'A) 1 — it counts the rows shown\nB) 2 — it counts every service that is due\nC) {OPT_NS}',
  items=[('c2', 'D12')],
  why='Ambiguous description; the plan fills it with a stated assumption of its own.'),
 dict(topic=f'{PM} — the maintenance card on a work order: entering a reading',
  now='One sentence in the description says the reading window is the same on the asset and on the work order. Another sentence, and the main Maintenance Reminders page, say that on a work order readings are typed into its existing Mileage and Engine Hours boxes, and the maintenance card opens no reading window of its own.',
  question='On a work order, how is a reading entered?',
  options=f'A) Only in the work order’s own Mileage and Engine Hours boxes — the sentence about the same window is out of date\nB) In those boxes, and also through the same reading window as on the asset\nC) {OPT_NS}',
  items=[('c2', 'D1')],
  why='The description contradicts itself (and the main page’s component list sides with the later sentence).'),
]))

S.append(('Readings and estimates', [
 dict(topic=f'{PM} — readings and estimates: how confidence is graded',
  now='The description’s confidence table, agreed on 1 October, grades a unit whose last reading is 30 days old or less and that has one pair of readings (two visits) as Medium. The design’s help text on the reminders list says “Low: one pair, or the last reading is old.”, and the design’s sample engine-hours card shows Low for two visits with the last reading six days old.',
  question='Does the table decide, so the help text and the sample are corrected to match it?',
  options=f'A) Yes — the table decides (one recent pair is Medium); the help text will be reworded and the sample fixed\nB) No — one pair should always be Low; the table needs changing\nC) {OPT_NS}',
  items=[('c1', 23), ('c1', 34), ('c2', 'D18'), ('c2', 'D19')],
  why='Description vs current design help text and sample. Merged from both reviewers (confidence key vs confidence table). D19’s second ask (“thin” readings not graded down on their own) is answered by S11-R22 (“Nothing is graded separately and nothing caps anything”), so it is not asked.'),
 dict(topic=f'{PM} — readings and estimates: correcting an older reading',
  now='The description says a wrong reading is corrected by entering the right one, and the last one entered becomes the current reading. It also says a correction anywhere in the history recalculates the rate. The engineers let someone change the Mileage on an older work order, which changes that older reading where it sits.',
  question='Can a shop correct an older reading by changing the Mileage on that old work order?',
  options=f'A) Yes — it corrects that reading, which keeps its original date; the current reading stays as it is, and the estimate is recalculated\nB) No — only the newest reading can be corrected, by entering the right value; older readings are never changed\nC) {OPT_NS}',
  items=[('c2', 'D17')],
  why='The description is ambiguous between two of its own sentences; the plan picks one reading. Also raised earlier in the Chunk 1 review (MF-14, “Which reading is current after a lower correction…”), still open there.'),
]))

S.append(('Mark complete', [
 dict(topic=f'{PM} — marking a service complete: the line in the Mark complete window',
  now='The description gives one line directly under the window’s title: “PM-A resets now from the date below. It won’t wait for an invoice”. The design words it “PM-A resets from this date. It won’t wait for an invoice.” and places it under the Reset date box.',
  question='Which words should the line use, and where does it sit?',
  options=f'A) The description’s words, under the title\nB) The design’s words, under the Reset date box\nC) The description’s words, under the Reset date box\nD) {OPT_NS}',
  items=[('c1', 8), ('c2', 'D7')],
  why='Description vs current design (both boards). Merged from both reviewers.'),
]))

S.append(('Older design boards', [
 dict(topic=f'{PM} — the design: the two older boards',
  now='The description pages name the “Chunk 1” and “Chunk 2” boards as their design. The same design project still holds two older boards — the “Demo” board and an older work-order board — and they say things that neither the description nor the newer boards say any more. For example: readings “depend on telematics”; the estimate uses only the last two readings; a low-confidence date reads “Soon” on the asset; confidence depends on whether readings “agree”; turning reminders off stops “only the email”; a certificate’s expiry is held as a month; a bigger service “absorbs” smaller ones; Send reminder asks for a second confirmation; the date after invoicing defaults to the invoice date; certificates are entered as “date completed and date expires”; and a separate step appears when a work order is completed.',
  question='Are the Demo board and the older work-order board retired, so that the description and the Chunk 1 and Chunk 2 boards decide?',
  options='A) Yes — both older boards are retired; ignore them\nB) No — some of what they show still applies (please say which: ........)\nC) Not sure — please check with the designer',
  items=[('c1', i) for i in range(44, 52)] + [('c2', f'D{i}') for i in range(22, 30)],
  why='Collapsed per the brief: sixteen items (Chunk 1 D45–D52, Chunk 2 D22–D29), every one the same question. The description pages name their boards, but the linked design project still holds these two, so one confirmation is worth asking.'),
]))

# ------------------------------------------------------------------ dropped / redirected (QA internal)
RULING = 'QA lead ruling 12 Aug 2026 (skill 07 §5; register D1): where the tech plan contradicts the spec or the design, those win for the cases, and every contradiction is reported to the QA lead — not put on a PO sheet.'
DROPPED = [
 ('Settled — the description is clear; only the engineers\' plan differs. ' + RULING + ' FOR THE QA LEAD to pass to engineering.',
  [(('c1', 0), 'Plan also squeezes inner spaces when matching service names; the description ignores only capitals and surrounding spaces.'),
   (('c1', 1), 'Settings entry: description + design sidebar “Maintenance”; plan “Maintenance schedules”.'),
   (('c1', 4), 'Asset tab status: description + design put the badge beside the service; plan draws a separate Status column.'),
   (('c1', 14), 'Notification toggle without edit-customer permission: main page key decision (“every gated action is hidden”, same as S14-R10 for Send reminder) vs plan “disabled”.'),
   (('c2', 'D5'), 'Undo complete after Mark complete on a lines-added row: description S18-R17/S16-R25 AND the design (Chunk 2 artboard W13c: “the row menu offers Undo complete”) agree; only Plan 2 FD-211 differs.'),
   (('c2', 'D9'), 'Reason text names the service (“Lines added from PM-A”): description, design and the plan’s own walk-through agree; only one plan table says schedule.'),
   (('c2', 'D13'), 'Menu item “Remove”: description + design; plan “Remove from this work order”.')]),
 ('Settled — the description gives no words; design and plan differ; the design wins over the plan for the cases (same ruling). FOR THE QA LEAD to report as plan contradictions.',
  [(('c1', 2), 'Empty schedule list: design “No schedules yet” vs plan “No maintenance schedules yet”.'),
   (('c1', 9), 'No-email note: design vs plan wording.'),
   (('c1', 10), 'Enrolment confirmation: design toast vs plan caption.'),
   (('c1', 15), 'Send dialog title: design “Send email” vs plan “Sending Maintenance reminder” (the dialog is the app’s existing one; its title is an on-screen label read from the build).'),
   (('c1', 16), 'Toast after a send: design “Reminder sent to Dave Brabay” vs plan “Reminder sent.”.'),
   (('c1', 17), 'Blank last-service-date hint: design “Left blank, counting starts today.” vs plan “Blank counts from today”.'),
   (('c2', 'D6'), 'Add Service window labels: design vs plan.')]),
 ('Settled — the description is silent and the plan sources it alone; nothing current contradicts it (12 Aug ruling, part a). JUDGEMENT: promote back to the sheet if the QA lead disagrees.',
  [(('c2', 'D10'), 'An Add Service that is undone/removed is not a maintenance origin (Plan 2 TD-112). S16-R25 says Undo/Remove return the row to “no longer addressed on this work order”; S22-R1 does not address removal. C204119/C204121 may now assert the plan’s rule.'),
   (('c2', 'D11'), 'Words for “a service that has just become due”: plan “Now due”. The current boards draw no wording; the older 16 Sep screenshots predate the 2 Oct design-to-description check.')]),
 ('Not a disagreement on checking the sources.',
  [(('c1', 24), 'Work order status “Complete” vs design “Completed”: the description means the work order’s own existing status, which is an on-screen label taken from the build (Rule 57 allows labels). Design sample wording is a designer note.'),
   (('c1', 26), 'Remind before expiry “2 months before” on artboard K02: K02 is the FILLED form showing a value someone chose (S3-R8 says the default “can be changed”). Not a default. (Designer note: empty artboard K01 shows “Choose” instead of the 1-month default.)'),
   (('c1', 27), 'Calendar “At”: S2-R7 and Chunk 1 review decision MF-2 say At takes a day and a month; the design tooltip “at always takes a month” does not say a month alone. (Designer may reword it.)'),
   (('c1', 41), 'Blank date “stated in the modal”: the design’s (i) sits inside the enrolment window, so it is stated in the modal; its wording is settled above (Chunk 1 D18). JUDGEMENT.'),
   (('c2', 'D14'), 'Service name in the email: S2-R3 is explicit (“the name a shop gives a service is the name its customer reads in a reminder”) and design frame R1T agrees; R1/R1U adding “ service” is a designer note.'),
   (('c2', 'D21'), 'Resolved on checking by the Chunk 2 reviewer: S18-R8 provides unticking, so the (i) agrees with the description. Dropped per the brief.')]),
 ('FOR THE DESIGNER — design gaps or errors, not product decisions (the description is clear and the design is silent, incomplete or inconsistent with itself).',
  [(('c1', 52), 'DESIGN-PACKAGE DEFECT: 35 “Create work order” links on the Chunk 1 board point at Chunk 2 #v5, which does not exist (design drive §1c).'),
   (('c1', 25), 'Remove-service confirmation (E04r) omits the outcome S6-R11 requires (enrolled assets untouched; later enrolments get the schedule as it now stands).'),
   (('c1', 37), 'Turning notifications off: S7-R19’s count of silenced units is drawn on no artboard.'),
   (('c1', 40), 'Remind before expiry (i) has two wordings on the design (K01/K02 vs R6); K01/K02 matches S3-R8.')]),
]

# ------------------------------------------------------------------ build
spec_sheets, internal, md, docx_sheets = [], [], [], []
used = set()
for sheet, rows in S:
    spec_sheets.append({'name': sheet, 'rows': [{k: r[k] for k in ('topic', 'now', 'question', 'options')} for r in rows]})
    docx_sheets.append({'name': sheet, 'rows': spec_sheets[-1]['rows']})
    for n, r in enumerate(rows, 1):
        labels, cases, srcs = [], [], []
        for ref in r['items']:
            lab, src, cs = item(ref)
            if ref in used and ref != ('c2', 'D3'):
                sys.exit(f'item used twice: {ref}')
            used.add(ref)
            labels.append(lab); srcs.append(anchors(src))
            for c in cs:
                cr = case_ref(c)
                if cr not in cases: cases.append(cr)
        internal.append([f'{sheet} #{n}', '\n'.join(cases) or '(none)', '; '.join(dict.fromkeys(s for s in srcs if s)),
                         'Items: ' + ', '.join(labels) + '.\n' + r['why'] +
                         '\nCase handling as the reviewers recorded it: ' + handling(r['items']) +
                         '\nThe question has NOT been sent yet.'])

internal.append(['', '', '', ''])
internal.append(['DROPPED / REDIRECTED', 'Cases', 'Requirement', 'Why it is not on the PO sheet'])
for head, lst in DROPPED:
    internal.append(['', '', '', head])
    for ref, note in lst:
        lab, src, cs = item(ref)
        if ref in used: sys.exit(f'dropped item also on a row: {ref}')
        used.add(ref)
        internal.append([lab, '\n'.join(case_ref(c) for c in cs) or '(no case)', anchors(src), note])

# completeness: every diverge item accounted for exactly once
allrefs = {('c1', i) for i in range(53)} | {('c2', k) for k in C2}
missing = allrefs - used
if missing: sys.exit(f'unaccounted items: {sorted(missing)}')
internal.append(['', '', '', ''])
internal.append(['NOTE', '', '', 'Not in scope of this sheet (not in either reviewer’s diverge list): Chunk 1 findings §9 also lists PO questions on field length limits, a service-contents hover implied by Plan 2 TD-123, and the fate of the legacy maintenance screens. Raise separately if wanted.'])
internal.append(['NOTE', '', '', 'NEW-x / Nx keys were mapped to the created case ids by exact title from applied/chunk1-log.json and applied/chunk2-log.json.'])

title = 'MAINTENANCE REMINDERS (Chunk 1 and Chunk 2) — questions for Milos Vasic, 6 October 2026'
intro = ('On 6 October 2026 we compared the two Maintenance Reminders description pages (Chunk 1: Settings, the asset and the '
         'reminders list; Chunk 2: the work order and the customer) with the design boards and the engineers’ plans. Almost '
         'everything agrees. The rows below are the places where they say different things and we cannot tell which one you '
         'intend. None of them is a bug report — nothing here has been built and tested yet. Each sheet covers one part of the '
         'feature. Please answer in the last column, or in a message as the sheet name, the number and a letter, for example '
         '“Maintenance reminders list 2: A”. A few words is plenty.')

spec = {'path': OUT + '.xlsx', 'title': title, 'intro': intro, 'sheets': spec_sheets, 'internal': internal}
json.dump(spec, open(f'{HERE}/spec.json', 'w'), ensure_ascii=False, indent=1)
json.dump({'title': title, 'intro': intro, 'sheets': docx_sheets, 'path': OUT + '.docx'}, open(f'{HERE}/docx.json', 'w'), ensure_ascii=False, indent=1)

# ---- markdown (same rows + the QA-internal mapping)
L = [f'# {title}', '', intro, '', '**Status: WRITTEN AND HELD — not sent.** The QA lead decides when it reaches the PO (skill 07 §1).', '']
total = 0
for sh in spec_sheets:
    L += [f'## {sh["name"]}', '']
    for n, r in enumerate(sh['rows'], 1):
        total += 1
        L += [f'### {n}. {r["topic"]}', '', f'**What happens now:** ' + r['now'].replace('\n', '  \n'), '',
              f'**The question:** {r["question"]}', '', '**Options:**', '']
        L += [f'- {o}' for o in r['options'].split('\n')]
        L += ['', '**Your answer:** ____________________', '']
L += ['---', '', '## QA internal — not for the PO', '', '| Question # | Cases it decides | Requirement | Why it is a question and not a defect |', '|---|---|---|---|']
def cell(s):
    s = str(s).replace('|', '\\|')
    s = re.sub(r'C(\d+)(?: \((N(?:EW-)?\d+)\))? (https://\S+)', lambda m: f'[C{m.group(1)}]({m.group(3)})' + (f' ({m.group(2)})' if m.group(2) else ''), s)
    return s.replace('\n', '<br>')
for row in internal:
    L.append('| ' + ' | '.join(cell(c) for c in row) + ' |')
open(OUT + '.md', 'w').write('\n'.join(L) + '\n')
print('PO rows:', total, {s['name']: len(s['rows']) for s in spec_sheets})
print('items accounted for:', len(used), 'of', len(allrefs))

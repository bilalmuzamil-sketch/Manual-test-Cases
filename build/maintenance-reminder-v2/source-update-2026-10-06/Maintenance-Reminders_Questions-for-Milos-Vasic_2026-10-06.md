# MAINTENANCE REMINDERS (Chunk 1 and Chunk 2) — questions for Milos Vasic, 6 October 2026

On 6 October 2026 we compared the two Maintenance Reminders description pages (Chunk 1: Settings, the asset and the reminders list; Chunk 2: the work order and the customer) with the design boards and the engineers’ plans. Almost everything agrees. The rows below are the places where they say different things and we cannot tell which one you intend. None of them is a bug report — nothing here has been built and tested yet. Each sheet covers one part of the feature. Please answer in the last column, or in a message as the sheet name, the number and a letter, for example “Maintenance reminders list 2: A”. A few words is plenty.

**Status: WRITTEN AND HELD — not sent.** The QA lead decides when it reaches the PO (skill 07 §1).

## Schedules in Settings

### 1. Maintenance Reminders — Settings, Maintenance (schedules): which services a bigger service covers

**What happens now:** The description says a service covers another one only when the shop picks it; it is never worked out from the interval or from lines the two share. The design’s help text (the “i” beside “Services” in the schedule editor) says the opposite: “A service of larger scope includes the work of every smaller routine service, so one visit clears both.”

**The question:** Does a bigger service cover the smaller ones automatically, or only the ones the shop picks for it?

**Options:**

- A) Only the ones the shop picks — the help text in the design will be reworded
- B) Automatically — every smaller routine service in the same schedule is covered, and the description will be changed
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 2. Maintenance Reminders — Settings, Maintenance (schedules): services that repeat every 3 years

**What happens now:** The description says a calendar interval longer than 12 months must be typed in days, and days stop at 999 (about 2 years and 9 months). So a service due every 3 years cannot be set at all. The design’s sample schedule has one set to “Every 36 months”, although the design’s own interval box elsewhere also allows only 1 to 12 months.

**The question:** Should a shop be able to set a service that repeats every 3 years (or longer) on the calendar?

**Options:**

- A) Yes — allow more than 12 months (please give the highest number of months: ........)
- B) Yes — keep months at 12, but raise the days limit above 999 so it can be typed in days
- C) No — 3-year services are not supported in this version; the sample in the design will be corrected
- D) Not sure — please check with the engineers

**Your answer:** ____________________

### 3. Maintenance Reminders — Settings, Maintenance (schedules): typing a decimal or a minus sign into a number box

**What happens now:** The description says two different things. One sentence: number boxes accept digits only, so a decimal point or a minus sign simply does not go in and there is no message. Another sentence: zero is refused with a message “on the same rule as a decimal and a negative”. The design draws a message for a decimal: typing 1.5 shows “Enter a whole number.”

**The question:** When someone types 2.5 or -3 into an interval box, what should happen?

**Options:**

- A) The “.” or “-” does not go in at all, so there is no message (only zero gets a message)
- B) The characters go in and a message appears under the box, as the design draws (“Enter a whole number.”)
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 4. Maintenance Reminders — Settings, Maintenance (schedules): copying one service inside a schedule

**What happens now:** In the design, the menu on a service row in the schedule editor offers “Edit service”, “Duplicate” and “Remove service”. The description says a service can be edited or removed, and says nothing about duplicating one. (Duplicating a whole schedule is in the description already; this is about one service inside a schedule.)

**The question:** Should a service in a schedule have a “Duplicate” option?

**Options:**

- A) Yes — keep “Duplicate”; it makes a copy of that service in the same schedule (please say what the copy is called: ........)
- B) No — only edit and remove; “Duplicate” comes out of the service menu
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 5. Maintenance Reminders — Settings, Maintenance (schedules): moving a compliance inspection in the list

**What happens now:** The description says every service in a schedule can be moved by dragging, or with Move up / Move down. In the design, a compliance inspection row cannot be moved; its tooltip says it “has no place in the routine ladder … so there is no position to move it to.”

**The question:** Can a compliance inspection be moved up or down the list of services?

**Options:**

- A) No — compliance inspections stay where they are, as the design shows
- B) Yes — every service can be moved, compliance inspections included
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 6. Maintenance Reminders — Settings, Maintenance (schedules): the “New schedule” button

**What happens now:** The button on the list of schedules reads “New schedule” in the description and “New Schedule” (capital S) in the design.

**The question:** Which spelling should the button use?

**Options:**

- A) “New schedule”
- B) “New Schedule”
- C) Whichever matches the app’s other “New …” buttons

**Your answer:** ____________________

## Asset Maintenance tab

### 1. Maintenance Reminders — the asset’s Maintenance tab: four wording differences

**What happens now:** The description and the design use different words in four places:  
(a) A unit on no schedule. Description: “This unit is not on a maintenance schedule”. Design: “Not on a maintenance schedule”.  
(b) The button that puts it on one. Description: “Enroll in Schedule” (also on the work order’s maintenance card). Design: “Enroll in a schedule” (on the tab, on the work order card, and as the title of the window it opens).  
(c) A compliance inspection with no certificate recorded. Description: “No record”. Design: “Certificate unknown” on the tab, “no certificate on file” in the enrolment window.  
(d) The button to add a certificate. Description: “+ Add record”. Design: “Add history record” (also the form’s title and its confirmation).

**The question:** For each of (a) to (d), whose words should the screen use?

**Options:**

- A) The description’s words for all four
- B) The design’s words for all four
- C) Mixed — please write the letter and the side, e.g. “a: design, b: description, c: design, d: description”

**Your answer:** ____________________

### 2. Maintenance Reminders — the asset’s Maintenance tab: is a certificate’s term required?

**What happens now:** The description says a certificate record needs its term plus at least one of its two dates, and cannot be saved without the term. The design’s help text beside “Term” on the record form says: “Any two of term, Start date and End date give the third.” That would let someone save a Start date and an End date with no term.

**The question:** Must every certificate record have a term?

**Options:**

- A) Yes — the term is always required; the help text will be reworded
- B) No — any two of term, Start date and End date are enough, and the system works out the third
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 3. Maintenance Reminders — the asset’s Maintenance tab: what sits under an estimated due month

**What happens now:** For a due date estimated from mileage or engine hours, the description puts a small confidence meter and a word (High, Medium or Low confidence) under the month, and keeps the reason (for example “based on mileage estimate”) inside the meter’s hover. The reminders list follows the same rule. The design’s desktop asset tab instead prints “Based on mileage estimate” under the month, with no meter.

**The question:** What should appear under an estimated month on the asset’s Maintenance tab?

**Options:**

- A) The meter and the confidence word, with the reason in the hover (as described)
- B) The reason as plain text, with no meter (as drawn)
- C) Both — the meter and the word, and the reason as plain text
- D) Not sure — please check with the engineers

**Your answer:** ____________________

### 4. Maintenance Reminders — the asset’s Maintenance tab: how the confidence hover ends

**What happens now:** The description says the confidence meter’s hover always ends with: “This is the system’s best estimate from this unit’s past readings. Check its history if in doubt.” and has a “View work orders” link beside it that opens the asset’s Work Orders tab. The design’s hovers (desktop and phone) end with other explanations, and no screen in the design shows “View work orders”.

**The question:** Should the hover end with that sentence and offer “View work orders”?

**Options:**

- A) Yes — both the sentence and the link, as described
- B) The sentence only, without the link
- C) Neither — the design’s hover text is what you want
- D) Not sure — please check with the engineers

**Your answer:** ____________________

### 5. Maintenance Reminders — the asset’s Maintenance tab and the work order card: how a certificate’s due date reads

**What happens now:** The description says a due date that comes from a certificate is written as its End date followed by “Certificate”, for example “14 Oct 2026 · Certificate”, and that the work order’s maintenance card uses the same words as the asset tab. The design writes the date with “Based on the certificate term” under it on the asset tab, and the date alone on the work order card (for example “CVIP · Due 14 Sep 2026”).

**The question:** How should a certificate’s due date read on the asset tab and on the work order card?

**Options:**

- A) “14 Oct 2026 · Certificate” on both, as described
- B) As the design draws it — “Based on the certificate term” under the date on the tab, and the date alone on the card
- C) Not sure — please check with the engineers

**Your answer:** ____________________

## Maintenance reminders list

### 1. Maintenance Reminders — the maintenance reminders list: four wording differences

**What happens now:** The description and the design use different words in four places on the list:  
(a) The column showing due soon / due today / overdue. Description: “Due status” (chosen so it never reads as the work order’s own status). Design: “Status”.  
(b) The third summary tile. Description: “Due in 3 months”. Design: “Due in three months”.  
(c) The table when nothing falls in the next three months. Description: it says nothing is due in the next three months. Design: “Nothing is due.”  
(d) The hover on a Contact button when there is no phone or email. Description: “No phone or email on file”. Design: “Contact · no phone or email on file”.

**The question:** For each of (a) to (d), whose words should the list use?

**Options:**

- A) The description’s words for all four
- B) The design’s words for all four
- C) Mixed — please write the letter and the side, e.g. “a: description, b: design …”

**Your answer:** ____________________

### 2. Maintenance Reminders — the maintenance reminders list: sorting on a phone

**What happens now:** The description says the list is sorted only by clicking a column heading, and that there is no separate sort control. The design’s phone layout has no column headings and shows a “Sort: Due, soonest first” control instead.

**The question:** How does someone sort the reminders list on a phone?

**Options:**

- A) With the “Sort” control the phone design shows (the “no sort control” rule is for the desktop list)
- B) They cannot — on a phone the list is always soonest due first, with no control
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 3. Maintenance Reminders — the maintenance reminders list: a reminder whose work order is still open

**What happens now:** The description says that once a live work order is linked to a reminder, the row’s “Create work order” button becomes “Open work order”. In the design, rows whose work order is at Estimate or In progress show only the work order number as a link and the “Contact” button — no “Open work order” button.

**The question:** When a reminder’s work order is still open, does the row show an “Open work order” button?

**Options:**

- A) Yes — “Open work order” takes the place of “Create work order”, as described
- B) No — the work order number link is enough, as drawn
- C) Not sure — please check with the engineers

**Your answer:** ____________________

## Contact card and email

### 1. Maintenance Reminders — the contact card on the reminders list: which phone numbers it shows

**What happens now:** The description says the contact card shows the contact’s telephone and mobile, then the customer’s company telephone, each with its own label. The design shows a single phone number, labelled with the person’s name and role (for example “Dave Brabay · owner”).

**The question:** Which phone numbers should the contact card show?

**Options:**

- A) All three, each labelled, as described
- B) One number only, as drawn (please say which one: ........)
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 2. Maintenance Reminders — the contact card: an asset with no preferred contact

**What happens now:** The description says the card then shows an empty state “with an action to set one”. The engineers read that as “Set contact” — choose one of the customer’s existing contacts. The design shows “Add contact information”, which opens a form for a brand-new contact.

**The question:** What should the action on an asset with no preferred contact do?

**Options:**

- A) Pick one of the customer’s existing contacts
- B) Add a brand-new contact, as drawn
- C) Both — pick an existing contact or add a new one
- D) Not sure — please check with the engineers

**Your answer:** ____________________

### 3. Maintenance Reminders — the reminder email: High or Medium confidence dates

**What happens now:** The description says each row of the email shows its due month where the date is sound, and “Soon” where the date would be a guess, including every Low confidence date. The engineers have assumed that every date estimated from mileage or engine hours counts as a guess — so High and Medium confidence dates would also read “Soon”. The engineers raised this on the description’s comment thread on 5 October; if you have already answered it there, just write “answered on the thread”.

**The question:** In the reminder email, does a High or Medium confidence estimate show its month, or “Soon”?

**Options:**

- A) Its month — only Low confidence dates read “Soon”
- B) “Soon” — every date estimated from readings reads “Soon”, whatever its confidence
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 4. Maintenance Reminders — the reminder email: a unit with no readings to estimate from

**What happens now:** When a unit has no mileage readings yet, its due date comes from the service’s calendar interval. A note in the email design says such a unit reads “Soon” rather than a date. The description does not mention this case.

**The question:** In the email, does that unit’s row show its calendar month, or “Soon”?

**Options:**

- A) Its calendar month
- B) “Soon”
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 5. Maintenance Reminders — the reminder email: certificate rows and “due today” rows

**What happens now:** The description says each row of the email shows its due month. The email design and the engineers’ plan show a certificate’s exact day (for example “14 Aug 2026 · Past due”), and “Today” for a service due today.

**The question:** In the email, should a certificate show its exact day, and a service due today say “Today”?

**Options:**

- A) Yes to both — exact day for a certificate, “Today” for due today, the month for everything else
- B) No — every row shows its month only
- C) Exact day for a certificate, but the month (not “Today”) for a service due today
- D) Not sure — please check with the engineers

**Your answer:** ____________________

### 6. Maintenance Reminders — the reminder email: a unit whose only reminder is waiting for a reading

**What happens now:** The reminders list shows a service that is waiting for a mileage reading (“Needs readings”) even when its calendar date is far away. The description says the email carries every service the list shows for the unit — and also that when nothing is overdue, due today or due within the next 91 days, the email carries the next two upcoming services instead, and nothing else. For a unit like this, the two sentences give different emails.

**The question:** For a unit whose only row on the list is a “Needs readings” service with a far-off date, what does the email list?

**Options:**

- A) That service, because the list shows it
- B) Only the next two upcoming services, marked “Coming up” (that service appears only if it is one of those two)
- C) Not sure — please check with the engineers

**Your answer:** ____________________

## Work order maintenance card

### 1. Maintenance Reminders — the maintenance card on a work order: what the closed card shows

**What happens now:** The description says the closed card carries a badge counting the services that are due, “the badge alone, with no other text”. The design’s closed card shows a title, the count with a word, and an expand arrow: “Maintenance schedule · 1 due”. The engineers plan a title and a badge with just the number.

**The question:** Apart from the count, may the closed card show a title and the word “due”?

**Options:**

- A) A title and the number only — e.g. “Maintenance schedule” with a badge reading “1”
- B) As the design shows — “Maintenance schedule” and “1 due”
- C) The badge alone, no title at all
- D) Not sure — please check with the engineers

**Your answer:** ____________________

### 2. Maintenance Reminders — the maintenance card on a work order: does the count include a covered service?

**What happens now:** When the card is opened, a service that another one covers is folded inside it (for example PM-A shown inside PM-C) rather than given its own row. The description says the badge counts “the services” that are due. The engineers have assumed a folded service is not counted separately.

**The question:** When PM-A and PM-C are both due and PM-A is folded inside PM-C, does the badge read 1 or 2?

**Options:**

- A) 1 — it counts the rows shown
- B) 2 — it counts every service that is due
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 3. Maintenance Reminders — the maintenance card on a work order: entering a reading

**What happens now:** One sentence in the description says the reading window is the same on the asset and on the work order. Another sentence, and the main Maintenance Reminders page, say that on a work order readings are typed into its existing Mileage and Engine Hours boxes, and the maintenance card opens no reading window of its own.

**The question:** On a work order, how is a reading entered?

**Options:**

- A) Only in the work order’s own Mileage and Engine Hours boxes — the sentence about the same window is out of date
- B) In those boxes, and also through the same reading window as on the asset
- C) Not sure — please check with the engineers

**Your answer:** ____________________

## Readings and estimates

### 1. Maintenance Reminders — readings and estimates: how confidence is graded

**What happens now:** The description’s confidence table, agreed on 1 October, grades a unit whose last reading is 30 days old or less and that has one pair of readings (two visits) as Medium. The design’s help text on the reminders list says “Low: one pair, or the last reading is old.”, and the design’s sample engine-hours card shows Low for two visits with the last reading six days old.

**The question:** Does the table decide, so the help text and the sample are corrected to match it?

**Options:**

- A) Yes — the table decides (one recent pair is Medium); the help text will be reworded and the sample fixed
- B) No — one pair should always be Low; the table needs changing
- C) Not sure — please check with the engineers

**Your answer:** ____________________

### 2. Maintenance Reminders — readings and estimates: correcting an older reading

**What happens now:** The description says a wrong reading is corrected by entering the right one, and the last one entered becomes the current reading. It also says a correction anywhere in the history recalculates the rate. The engineers let someone change the Mileage on an older work order, which changes that older reading where it sits.

**The question:** Can a shop correct an older reading by changing the Mileage on that old work order?

**Options:**

- A) Yes — it corrects that reading, which keeps its original date; the current reading stays as it is, and the estimate is recalculated
- B) No — only the newest reading can be corrected, by entering the right value; older readings are never changed
- C) Not sure — please check with the engineers

**Your answer:** ____________________

## Mark complete

### 1. Maintenance Reminders — marking a service complete: the line in the Mark complete window

**What happens now:** The description gives one line directly under the window’s title: “PM-A resets now from the date below. It won’t wait for an invoice”. The design words it “PM-A resets from this date. It won’t wait for an invoice.” and places it under the Reset date box.

**The question:** Which words should the line use, and where does it sit?

**Options:**

- A) The description’s words, under the title
- B) The design’s words, under the Reset date box
- C) The description’s words, under the Reset date box
- D) Not sure — please check with the engineers

**Your answer:** ____________________

## Older design boards

### 1. Maintenance Reminders — the design: the two older boards

**What happens now:** The description pages name the “Chunk 1” and “Chunk 2” boards as their design. The same design project still holds two older boards — the “Demo” board and an older work-order board — and they say things that neither the description nor the newer boards say any more. For example: readings “depend on telematics”; the estimate uses only the last two readings; a low-confidence date reads “Soon” on the asset; confidence depends on whether readings “agree”; turning reminders off stops “only the email”; a certificate’s expiry is held as a month; a bigger service “absorbs” smaller ones; Send reminder asks for a second confirmation; the date after invoicing defaults to the invoice date; certificates are entered as “date completed and date expires”; and a separate step appears when a work order is completed.

**The question:** Are the Demo board and the older work-order board retired, so that the description and the Chunk 1 and Chunk 2 boards decide?

**Options:**

- A) Yes — both older boards are retired; ignore them
- B) No — some of what they show still applies (please say which: ........)
- C) Not sure — please check with the designer

**Your answer:** ____________________


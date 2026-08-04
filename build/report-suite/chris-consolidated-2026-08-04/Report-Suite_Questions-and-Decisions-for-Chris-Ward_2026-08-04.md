# Report Suite - questions and decisions for Chris Ward - 2026-08-04 (one workbook, three tabs)

**STATUS: READY TO SEND** (not yet sent). This ONE workbook REPLACES the three separate sheets - the urgent one-question sheet, the spec-versus-build sheet and the 17-item sheet - all three of which are now marked SUPERSEDED and kept for the record. On return: ingest verbatim, then revisit the affected cases per the standing workflow; nothing is edited before his answers and the QA lead's go-ahead.

**Three tabs, most urgent first:**

1. **Urgent - the location column** - one question, needed today.
2. **What the product does vs your write-up** - 9 items.
3. **Questions and things to write down** - 14 items.

**24 items in total.** Twenty-eight came in from the three sheets and four were removed as the same question asked twice, so **nothing is asked twice across the three tabs**. A fourth, QA-only tab carries the traceability and is not for Chris.


# Tab 1 - Urgent - the location column

**Needed today, please - the automated versions of these tests are being written today, so this one answer unblocks work that is already starting.**

One question only, and it should take a minute. It is on its own tab because it is the urgent one: the automated versions of these tests are being written today, and eight of our checks are waiting on your answer. The other two tabs are the longer lists - they still stand, and nothing is asked twice across the three.

## 1 - The location column - should it appear on its own, or does the user switch it on?

**What happens now:** The six reports can show a location column, telling you which branch each row belongs to. Right now they do not agree on how it should behave:

- **Sales By Customer, Sales By Representative, Parts Velocity and Technician Utilization** handle it on their own - the column appears when you are looking at more than one location, and disappears when you narrow to one.
- **Work In Progress** never shows it on its own. The column is missing until you switch it on yourself from the list of columns - even when you have every location in view.
- **Inventory Value** does the opposite. The column is on from the start, and it stays on even after you narrow to a single location - so you get a column repeating the same branch name on every row.
- **One more oddity on Inventory Value -** the screen and the downloaded file disagree with each other. The download drops the column when you narrow to one location, but the screen keeps it.

**But both of those two written descriptions say the column should be automatic, and should not be something the user switches on.** Quoting them directly:

- **Work In Progress:** *"The Location column is not offered in the column selector; its visibility is automatic - shown only when more than one location is in scope (Story 7)."*
- **Work In Progress:** *"...and is hidden whenever a single location is in scope; the user does not toggle it in the column selector."*
- **Inventory Value:** *"Its visibility follows the location scope automatically and it is not one of the columns offered in the column-selection control (Story 8)."*

**Why we are asking:** We are asking rather than assuming because our eight checks for those two reports currently describe what the product does today, not what your description asks for - which means if the product is the thing that is wrong, our tests would quietly pass it instead of catching it.

**The question:** Which behaviour should all six reports use for the location column?

**Options:**

- A) The column appears on its own whenever more than one location is in view, and disappears when only one is - it is not something the user switches on. (This matches what both your written descriptions already say, and what the other four reports already do. If you choose A we will raise the two reports that behave differently, and correct our eight checks so they would catch it.)
- B) The column is a switch the user turns on and off from the list of columns, and it stays however they left it. (If you choose B, the two written descriptions need updating to say so, and we will keep our eight checks as they are.)
- C) Something else, or it should differ between reports - please describe it.

**Your answer:** ____________________

**Needed today, please: the automated versions of these tests are being written today, and these eight checks cannot be finalised until we know which behaviour is the correct one.**


# Tab 2 - What the product does vs your write-up

This tab is a **side-by-side of your own written descriptions against what the product actually does today**, taken from a live look at the test build on **3 and 4 August**. Every item shows you the exact words from your write-up, what we saw happen, and asks which of the two you would rather keep. Nothing here is a bug report - bugs go straight to engineering and are not on this tab.

There are **9 items**: **7 need you to choose something**, **1 needs only a line changing in a write-up**, and **1 needs nothing at all** and is here purely so you are not surprised by it later.

**The last tab is its companion** - that one asks you to correct wording; this one asks you to choose between the wording and the product. Deliberately, nothing is asked twice.

**One honest caveat up front:** engineering has told us the test build is not finished yet. So everything described below is what we saw on 3 and 4 August, and we will look again when they say it is done. If your answer depends on that, say so and we will come back to you.


## Decisions we need from you

### 1 - The location chooser is still shown to someone who only has one location - on all six reports

**What your write-up says:** Four of the six write-ups say the opposite of the ruling you gave us on 31 July. Quoted word for word:

Sales By Representative: "A single-location user still sees the filter with one selectable location; behavior is unchanged from single-location use."

Parts Velocity: "A user with access to only one location still sees the Location filter with a single selectable location; behavior is unchanged from single-location use."

Technician Utilization: "A user with access to only one location still sees the filter with a single selectable location; behavior is unchanged from single-location use."

Inventory Value: "A user with access to only one location still sees the filter with a single selectable location."

Work In Progress and Sales By Customer say nothing either way. Your ruling on 31 July was the opposite - you chose hidden, and called it "classic spec drift".

**What the product actually does:** We gave a person access to exactly one location, signed in as them, and opened all six reports on 3 August. The location chooser was still on screen on every single one of the six.

The location COLUMN is a separate thing and it behaves correctly: on Sales By Customer and Sales By Representative the column was properly absent for that person.

So the product is following the four written lines above, not your ruling.

**Which do you want?** Should the location chooser stay visible for a person who only has one location, or be hidden?

- A) Keep what the product does - the chooser stays visible. We change our tests back, and you tidy the four lines so they stop contradicting the ruling.
- B) Change the product to match your ruling - hide it. We raise it with engineering, and the four lines still need correcting because they say it stays.
- C) Something else - please describe it.

**Your answer:** ____________________

### 2 - On Work In Progress the machine is still identified by its unit number first, not its vehicle number

**What your write-up says:** Your Work In Progress write-up still puts the unit number first. Quoted word for word:

"The Asset column is a two-line cell: the unit number on the first line in bold, and the vehicle identification number on the second line in a smaller, muted style."

and

"The Asset column sorts by unit number."

Your ruling on 29 July was the other way round - you answered "A is the correct answer" to the vehicle-number-first chain (vehicle number, then unit number, then plate), and added: "Not just for these specs though -- really good to keep this in mind for all actions moving forward."

**What the product actually does:** On 3 and 4 August the machine's cell showed the unit number first, in bold, with the vehicle number underneath it in smaller grey text - for example 6548 on the top line and 1FDSE3EL1EDB20609 underneath. Sorting on that column also used the unit number.

So the product is following the written line above, not your ruling.

One thing worth knowing before you decide, because it is your own point back to you: you told us "we just have to be careful with using the acronym VIN ... it stands for VEHICLE identification number. So for a generator for example, it gets confusing when we say VIN rather than serial #." That is already happening in the real data. The field labelled as the vehicle number is holding serial-number-style values for things that are not vehicles - live examples we read include BULK PARTS1, 12-06696 and P631627 - sitting alongside genuine 17-character vehicle numbers like 1FDSE3EL1EDB20609.

**Which do you want?** Which number should lead on this report, and what should the heading call it?

- A) Change the product so the vehicle number leads (then the unit number, then the plate), matching your ruling and the other report. We raise it with engineering and you update the Work In Progress write-up.
- B) Keep the product as it is - the unit number leads on this report. We change our tests back, and we record that your ruling does not reach this one report.
- C) Lead with the vehicle number as in A, but change the wording so it also reads sensibly for a machine that is not a vehicle - please tell us the word you want on screen.

**Your answer:** ____________________

### 3 - The Sales By Representative downloads say "Representative" - a third spelling

**What your write-up says:** Your Sales By Representative write-up still uses the short form in the download column list. Quoted word for word, from the summary spreadsheet requirement:

"Headers, in order: `Sales Rep`, `# Invoices`, `# Customers`, ..."

Your ruling on 31 July was: "Rep is too much slang, let's do representative everywhere" - so we changed our tests to the full "Sales Representative".

**What the product actually does:** The file that actually downloads says neither of those. Read straight out of the downloaded summary file on 3 August, the first column heading is simply:

Representative

So three different words are in play: your document says "Sales Rep", your ruling says "Sales Representative", and the product says "Representative". The same single word is used in the detailed download too.

**Which do you want?** Which word should the download column heading use?

- A) "Representative" on its own is fine - it is not slang, so it satisfies your ruling. We match our tests to it and you tidy the write-up.
- B) It must read "Sales Representative" in full, as your ruling said. We raise it with engineering.
- C) Something else - please write the exact wording you want.

**Your answer:** ____________________

### 4 - Four columns are missing from the Sales By Representative summary download

**What your write-up says:** Your write-up closes the list of columns for that download. Quoted word for word:

"Headers, in order: `Sales Rep`, `# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced`, `Inv. Hrs`, `Labor Invoiced`, `Labor Margin`, `Parts Invoiced`, `Parts Margin`, `Margin`, `Margin %`, `Subtotal`."

That is thirteen columns.

**What the product actually does:** We downloaded the file on 3 August for a single location. It has nine columns, and this is the heading line read straight out of the file:

Representative, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal

Four are missing: # Invoices, # Customers, Hrs Worked and Hrs Invoiced.

The figures themselves are not missing - the information the screen is built from does carry the invoice count and both hours figures. It is only the download that is short. That is why we read this as an unfinished download rather than missing data.

**Which do you want?** Should those four columns be added to the download, or should the download be the shorter nine?

- A) They are missing by mistake - add the four back. We raise it with engineering and your write-up stays exactly as it is.
- B) The shorter nine-column file is what you want - we correct our tests and you shorten the write-up's list.
- C) Something else - please say which of the four you want.

**Your answer:** ____________________

### 5 - The date chooser offers nine choices and has no "Custom" option

**What your write-up says:** Three write-ups describe the same eleven-item list. Quoted word for word from Sales By Customer:

"The picker offers eleven options, in this order: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom."

Work In Progress and Inventory Value describe the same eleven, each in their own words.

**What the product actually does:** The chooser we opened on 3 August offers nine, and they are not those nine. Read off the screen, in the order shown:

Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week

Beside them it shows a month calendar you click dates on, a live readout of how many days your range covers (it read "Range: 3 days" when we looked) and an Apply button. There is no Today, no Yesterday, and no item called Custom - you build your own range by clicking the calendar instead. "All Time" is correctly not offered.

Two things you should know. First, this is ONE shared chooser used by all six reports, so whatever you decide here lands on every one of them. Second, one of our tests cannot be run at all today, because it tells the tester to click "Custom" and there is nothing to click.

**Which do you want?** Should the date chooser be changed to match the write-ups, or should the write-ups be changed to match it?

- A) Keep what the product does - we correct the write-ups and our tests to the nine choices plus the calendar, and the unrunnable test gets fixed the same day.
- B) Add Today, Yesterday and a Custom option so it matches the write-ups. We raise it with engineering; it affects all six reports.
- C) Somewhere in between - please tell us which of the three (Today, Yesterday, Custom) you want added.

**Your answer:** ____________________

### 6 - The Technician Utilization download menu has four options, all worded differently

**What your write-up says:** Your Technician Utilization write-up describes three options, each quoted word for word:

"The menu has an option labeled 'Download Summary (PDF)'."

"The menu has an option labeled 'Download Expanded View (PDF)'."

"The menu has an option labeled 'Download (CSV)'."

**What the product actually does:** The menu we opened on 3 August has four options, and not one of them is worded that way. Read straight off the screen, exactly as they appear:

"Summary (PDF)" · "Summary (CSV)" · "Expanded (PDF)" · "Expanded (CSV)"

So there is one more spreadsheet option than the write-up describes, and the word "Download" is missing from the front of all four.

For comparison, Sales By Customer and Sales By Representative both show the longer wording, and it matches their own write-ups exactly: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)". So this report is the odd one out rather than the whole set being different.

**Which do you want?** Should Technician Utilization keep its four shorter options, or be brought into line with the other two reports?

- A) Keep the four options and their shorter wording - we match our tests to them and you tidy the write-up (which will also mean listing the fourth option).
- B) Bring it into line with Sales By Customer and Sales By Representative - the longer "Download ..." wording. We raise it with engineering.
- C) Something else - please write the wording you want.

**Your answer:** ____________________

### 7 - The Inventory Value spreadsheet carries an "As of" line that no write-up asks for

**What your write-up says:** Your Inventory Value write-up asks for that line in the printable download ONLY. Quoted word for word:

"The PDF header shows the report name 'Inventory Value', the organization name, the selected period, and an 'as of' line naming the day the values represent (or a message that no snapshot is available for the period)."

Nothing in any of the six write-ups asks for it in the spreadsheet.

**What the product actually does:** The spreadsheet has it anyway. The very first line of the downloaded file, read on 3 August, is:

"As of: 2026-08-03"

with the locations line directly beneath it. The printable download carries the same information but words it slightly differently - it reads "As of 2026-08-04", with no colon. (The two dates differ only because we downloaded the two files on different days; the wording is the difference, not the date.) So the line is in both files, only one of them is written down, and the two are punctuated differently.

**Which do you want?** Should the spreadsheet carry the "As of" line, and should both files word it the same way?

- A) Yes, it belongs in the spreadsheet too - you add it to the write-up and we keep testing for it.
- B) No, it should not be in the spreadsheet - we raise it with engineering to take it out.
- C) Keep it in both, but make them word it identically - please say which wording you prefer.

**Your answer:** ____________________


## Only needs writing down (no decision needed)

### 8 - Four write-ups still say each report needs its own separate permission

**What your write-up says:** You have already ruled on this - all report access collapses into one single reports permission. Four write-ups still say otherwise. Quoted word for word:

Parts Velocity: "Both loading the report and exporting it require the Inventory Reports -> View permission. A user without that permission is denied the report data and the export."

Inventory Value: "The user must have the permission that grants access to the inventory reports."

Technician Utilization: "The user must have the permission that grants access to the timesheet reports."

Work In Progress: "The user must have the permission that grants access to Work In Progress reports."

Sales By Customer's write-up has already been corrected - thank you.

**What the product actually does:** The product already does exactly what you ruled. Checked on 3 August, and proven both ways round:

There is exactly ONE reports permission in the whole product, and no per-report one exists anywhere in the list a manager picks from.

A person whose entire set of permissions was eight - including that one reports permission, and no report-specific permission at all - could open and download all six reports.

A person without that one permission was refused all six, both on screen and on download.

So nothing needs deciding. It is only the four written lines that still disagree, which makes it look to an outside reader as though our tests are wrong.

**Which do you want?** Will you update those four write-ups so they all name the single reports permission?

- A) Yes, I will update them.
- B) It is already done (please point us at it).
- C) No - and here is why.

**Your answer:** ____________________


## For your awareness (nothing needed from you)

### 9 - Print has gone from the product everywhere - two of your lines and one open job still describe it

**What your write-up says:** Two Sales By Customer requirements still list Print as one of the ways the report goes out. Quoted word for word:

"Exports (CSV, PDF, Print) are generated on the server and contain exactly the customers matching the active filters ..."

"If an export (CSV, PDF, or Print) is triggered while the active filters match no customers - for example, no customer is selected - the export still downloads, containing the column headers and a totals row of zeros, with no data rows and no warning."

There is also still an open job in the tracker for building Print.

**What the product actually does:** We searched every download menu, button and link on all six reports on 3 August. There is no Print anywhere in the product. That matches your decision to retire it, so the product is right and our tests already assume it is gone.

**Which do you want?** Nothing is needed from you today - this is purely so you are not surprised by it. Next time you are in the document, dropping Print from those two lines (and closing that open job) would tidy up the last trace of it.

- No decision needed. Tick here if you would like us to keep it on the reminder list until the two lines and the job are closed.

**Your answer:** ____________________


# Tab 3 - Questions and things to write down

Plain-language product questions only - no bugs, no test jargon. This tab is an **exhaustive sweep of everything still owed by you**, not a top-up: every question sheet, the description-change watch list, our own decision register and all six live descriptions were re-read, and anything you have already answered has been deliberately left out.

It is in **two parts**. The first five need you to **choose something**. The rest need **no decision at all** - you have already answered them; only the written description still says something different, so they are one-line confirmations. **Several of those were due on 4 August**, which is why they are listed one at a time rather than bundled.


## Decisions we need from you

### 1 - The Sales By Representative download columns contradict each other

**What happens now:** Your Sales By Representative description was updated on 29 July. One part of it now says that when the location column is showing on screen, it is also included in all four downloads. But an older part of the same document still lists the download columns as a fixed set, in order, with no location column in the list - those older lines were never updated. So the same document says two different things about the same download.

**The question:** Which one is right - should the downloads include the location column whenever it is showing on screen, or should they always show the same fixed set of columns?

**Options:**

- A) The downloads should include the location column whenever it appears on screen (this is the newer instruction, and we have already built our checks to follow it - so if A is right we just need your confirmation, plus the older lines tidied up).
- B) The downloads should always show the same fixed set of columns, whatever is on screen (in which case we will change our checks back).

**Your answer:** ____________________

### 2 - Have the six descriptions been updated to match your video and your answers yet?

**What happens now:** You updated all six report descriptions on 29 July - thank you, the changes we were waiting for mostly landed. A handful did not, and they are ones where the written description now says the OPPOSITE of an answer you gave us afterwards. The clearest is the Work In Progress report: on 29 July you told us assets should be identified by VIN first (then unit number, then plate) for every report, and you believed you had already made that edit - but the Work In Progress description still puts the unit number first in several places. The others are: the location dropdown being hidden for a one-location person, the full word "Representative" on the customer card, the new reports sitting below the existing links in the menu, and the note that Parts Velocity is the "only" report in the Parts group when Inventory Value is there too. We are testing to your ANSWERS, not to the older written text. The seven still-missing edits are each listed on their own further down, or on the tab before this one where the product disagrees with your answer as well.

**The question:** Will the descriptions be updated to match your answers, or should we simply keep testing to your answers and treat the written text as out of date?

**Options:**

- A) The descriptions will be updated - we keep testing to your answers meanwhile.
- B) Do not wait for the descriptions - your answers are the final word and the written text can stay as it is.

**Your answer:** ____________________

### 3 - Where the location column goes in the shorter "Summary" downloads

**What happens now:** On screen the location column has a clear home: on Sales By Customer it sits right after the date, and on Sales By Representative right after the status. Your instruction for the downloads is that it appears "in the same position it occupies on screen". That works for the detailed downloads, which have those same columns. But the shorter Summary downloads do NOT have a date or a status column at all - so there is no position for it to match. Nothing in the descriptions says where it should go in those two files, and we do not want to guess.

**The question:** In the shorter Summary downloads, where should the location column sit?

**Options:**

- A) With the naming columns at the left - straight after the customer name (Sales By Customer) or the representative name (Sales By Representative), before the money columns.
- B) At the far right, after all the money columns.
- C) You do not mind - we will confirm whatever the build does and write that down.

**Your answer:** ____________________

### 4 - "The same logo treatment" - the three descriptions describe three different rules

**What happens now:** In your 29 July note you said every report now uses the same logo treatment. The written descriptions do not agree with each other on what that treatment is. Technician Utilization says the built-in ShopView logo is always used. Sales By Customer says it tries the company's own uploaded logo first, then falls back to the built-in one, and if neither exists it prints no logo at all and lets the text fill the space. Parts Velocity does not mention a logo anywhere. Our checks for the three reports currently follow their own descriptions, so they cannot all be right.

**The question:** Which single rule should every report's printed download follow?

**Options:**

- A) Try the company's own uploaded logo first, then the built-in ShopView logo, and print no logo only if neither exists (the Sales By Customer rule).
- B) Always print the built-in ShopView logo (the Technician Utilization rule).
- C) Something else - please describe it.

**Your answer:** ____________________

### 5 - Which Sales By Customer features were dropped - we need the list

**What happens now:** You told us that Sales By Customer had several features dropped just before the squad assembled, that some of them are exactly the kind of thing that should sit behind an extra permission, and that the written requirements should have been dropped along with them - "I own that". We went looking, and the good news is that everything your own change history records as dropped has already gone from both the description and our checks: the customer comparison list, the side-by-side asset comparison, using the global search bar to narrow the report, the "All Time" date range, and Print. We found nothing left over. But we cannot tell whether those five ARE the ones you meant, or whether you meant an earlier set we never saw - and if it is an earlier set, there could be requirements sitting somewhere we have not looked.

**The question:** Which dropped features did you mean - the five we found, or others we have not been told about?

**Options:**

- A) Those are the ones - nothing else was dropped, so this is already tidy and you can close it.
- B) There were others - please list them (even roughly) and we will check the description and our tests for anything left behind.

**Your answer:** ____________________


## Things that only need writing down (no decision needed)

### 6 - Technician Utilization sits BELOW the existing menu links

**What happens now:** Your video showed the new reports being added below the report links that were already there, without moving them. The Technician Utilization description names the right menu group but never says the new entry goes below the existing items.

**The question:** Will you add that wording?

**Options:**

- A) Yes, I will update it.
- B) It is already done (please point us at it).
- C) No - and here is why.

**Your answer:** ____________________

### 7 - Sales By Customer: the menu group and which links it sits below

**What happens now:** The same point for Sales By Customer: your video put it in the Performance group, below the four report links that already exist. Its description does not name a group at all, and does not mention the existing links.

**The question:** Will you add the group and the placement to the Sales By Customer description?

**Options:**

- A) Yes, I will update it.
- B) It is already done (please point us at it).
- C) No - and here is why.

**Your answer:** ____________________

### 8 - The asset chooser on Work In Progress: normal ShopView style, with a select-all

**What happens now:** In the walkthrough you said you were happy to update the description so the asset chooser looks like every other multi-pick list in the application, with a select-all / clear-all toggle. That has not been written down. Nothing in our tests depends on it - we just do not want it forgotten.

**The question:** Will you add it to the description?

**Options:**

- A) Yes, I will update it.
- B) It is already done (please point us at it).
- C) No - drop it.

**Your answer:** ____________________

### 9 - "Representative" written out in full, everywhere

**What happens now:** You answered that the short form is slang and it should say representative everywhere. The Sales By Representative description still says "Sales Rep" on the customer card, in the name of the assignments screen, and in the lists of download column headings.

**The question:** Will you change those to the full word?

**Options:**

- A) Yes, I will update them.
- B) It is already done (please point us at it).
- C) No - and here is why.

**Your answer:** ____________________

### 10 - Parts Velocity is described as the "only" report in the Parts group

**What happens now:** Inventory Value lives in the Parts group too, so that line is no longer true. It is a one-line fix.

**The question:** Will you correct it?

**Options:**

- A) Yes, I will update it.
- B) It is already done (please point us at it).
- C) No - and here is why.

**Your answer:** ____________________

### 11 - The Escape key on the "deactivate a representative" pop-up

**What happens now:** You answered this on 28 July: pressing Escape must NOT close that pop-up, because it is a confirm-or-cancel decision. The Sales By Representative description still says Escape closes it. Our test follows your answer.

**The question:** Will you correct that line?

**Options:**

- A) Yes, I will update it.
- B) It is already done (please point us at it).
- C) No - and here is why.

**Your answer:** ____________________

### 12 - The "too big to download" limit is missing from three descriptions

**What happens now:** You confirmed the same size limit and the same single message apply to all six reports. Three descriptions - Parts Velocity, Technician Utilization and Work In Progress - still carry no line about it at all. Our tests already exist for all six.

**The question:** Will you add the limit and the message wording to those three?

**Options:**

- A) Yes, I will update them.
- B) It is already done (please point us at it).
- C) No - and here is why.

**Your answer:** ____________________

### 13 - A note that "VIN" also covers machines that are not vehicles

**What happens now:** This was your own point: VIN stands for vehicle identification number, and for something like a generator the number people actually read is its serial number. You asked us to be careful with the wording. Our tests keep the on-screen word VIN and add a plain note for the tester - but the descriptions do not explain it, so a reader could think the two are different things.

**The question:** Will you add a short note to the descriptions?

**Options:**

- A) Yes, I will add it.
- B) Not needed - the on-screen word is enough.
- C) Something else - please describe it.

**Your answer:** ____________________

### 14 - Some odd characters appear in two of the descriptions

**What happens now:** The Sales By Representative and Parts Velocity documents contain a few garbled characters where a quote mark or a dash should be - almost certainly from a copy-and-paste. It changes nothing about the product, but it makes those lines hard to read and hard to quote back to you.

**The question:** Would you tidy those up next time you are in the documents?

**Options:**

- A) Yes.
- B) Leave them.

**Your answer:** ____________________


---

# QA-ONLY - internal, not for Chris

Do not send this part to Chris. TestRail C-ids from `build/report-suite/testrail-id-map.csv` (Standing Rule 8). Links: https://shopview.testrail.io/index.php?/cases/view/<id>

**Every internal-id/C-id pair below is verified against the id-map at generation time - the generator ABORTS on a mismatch, and also aborts on a C-id that is not in the id-map at all.** The 2026-07-31 sheet printed **PV-API-04 as C30388**, which is wrong: **PV-API-04 = C30391**, and **C30388 = PV-API-01**. Anyone acting on that row would have edited the wrong case.

## Per-item mapping - every surviving reader-facing item

| Tab | Item | Was | Source sheet | Affected internal case IDs (TestRail C-id) | Spec anchors + live evidence | What each answer resolves to |
|---|---|---|---|---|---|---|
| Tab 1 | 1 | the whole of the one-question sheet | chris-location-question-2026-08-04 | IV-COL-01 (C30551); IV-COL-04 (C30554); IV-PERS-02 (C30580); IV-EXP-02 (C30588); IV-LOC-06 (C38917); WIP-COL-01 (C30466); WIP-COL-02 (C30467); WIP-FLT-09 (C38916) | Inventory Value spec v3 S7-R6; WIP spec v6 S4-R3; S7-R13 | If Chris answers A (automatic - matches both specs): All 8 cases are re-worded to assert the automatic, scope-driven model that SBC/SBR/PV/TU already use, and the observed selector-controlled build is recorded as a DEVIATION in the case notes (the pattern WIP-FLT-05 = C30502 already uses). Two build defects get raised: Work In Progress never shows it automatically; Inventory Value never hides it at single scope on screen. This is the outcome Standing Rule 33 already points to - the specs outrank our build observation - so A costs 8 re-words and 2 tickets. // If Chris answers B (user-toggled): All 8 cases stand exactly as they are; no TestRail write is needed. Chris updates the two written descriptions (WIP S4-R3 + S7-R13, IV S7-R6). The 11 cases on the other four reports that assert the automatic model stay correct, because B would apply only to the two reports whose descriptions change - CONFIRM THIS WITH HIM if he picks B, since a suite-wide B would invalidate those 11. // If Chris answers C (something else / differs per report): Re-derive per report from his answer; expect a further reconciliation pass and treat all 8 as blocked until then. // Regardless of the answer - a separate surface split to settle: On Inventory Value the SCREEN keeps the Location column at single scope while the CSV download drops it (screen observed 2026-08-04; CSV observed 2026-08-03, viu-2026-08-03/evidence/location-matrix/inventory-value__SINGLE__plain.csv has no Location header, __MULTI__ does). Two surfaces, two behaviours - IV-EXP-02 (C30588) is the export case affected. Standing Rule 40: every surface gets its own verdict. |
| Tab 2 | 1 | item 1 of the 10-row sheet | chris-sheet-2026-08-04 | SBR-LOC-04 (C30216); PV-FILT-13 (C30340); TU-LOC-05 (C30446); WIP-FLT-06 (C30503); IV-LOC-04 (C30577). NOTE: there is NO Sales By Customer case asserting the hidden filter - SBC-LOC-01 (C30109) only asserts the control's position, so SBC is a coverage question in its own right if he picks B. | OUR SOURCE: Chris Ward 2026-07-31 Q1=A, verbatim "A -- classic spec drift" (chris-answers-2026-07-31/answers-ingested.md). THE BUILD'S SOURCE: SBR v15 S21-N1, PV v4 S2-E4, TU v5 S9-N1, IV v3 S7-N1 - all four still read "still sees the filter". LIVE: viu-2026-08-03/evidence/singleloc-matrix.json - hasLocationControl TRUE on all six for the single-workplace subject; build v3.4.1-0ed4433. Verdicts: batch-sbc-sbr/VERDICTS.md SBR-LOC-04, batch-pv-tu/VERDICTS.md PV-FILT-13 + TU-LOC-05, batch-wip-iv/VERDICTS.md IV-LOC-04. RECHECK-QUEUE row B18 (flagged there as the single most important row to re-check). | A -> the 5 cases flip from 'filter hidden' to 'filter shown', and SBC needs no new case. B -> no case change; a dev ticket is raised for all six, and SBC needs a NEW case for parity. Either way the four spec notes need his edit. All 5 currently sit DEVIATION and are HELD (batch-wip-iv/STAGED-CHANGES.md group C2) - deliberately not edited, because editing them would assert behaviour no written source supports. |
| Tab 2 | 2 | item 3 of the 10-row sheet | chris-sheet-2026-08-04 | WIP-COL-05 (C30470); WIP-SORT-03 (C30485); WIP-FLT-03 (C30500); WIP-EXP-07 (C30516). Cross-report reference case, no change proposed: SBC-LBL-01 (C30134). | OUR SOURCE: Chris Ward 2026-07-29, verbatim "A is the correct answer" plus the durable instruction "Not just for these specs though -- really good to keep this in mind for all actions moving forward" (chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md). THE BUILD'S SOURCE: WIP v6 S4-R7 ("the unit number on the first line in bold, and the vehicle identification number on the second line") and S4-R9 ("The Asset column sorts by unit number"). LIVE DOM, verbatim: <div class="wip-asset"><span class="wip-asset__unit text-weight-bold">6548</span><span class="wip-asset__vin text-caption text-grey-7">1FDSE3EL1EDB20609</span></div>. Serial-style values live in the VIN field: BULK PARTS1, 12-06696, P631627, 86J8FAC1VALJ43SJY. Build v3.4.1-0ed4433. HONEST LIMIT: we did not CREATE a non-vehicle asset - the report has no asset-creation surface; the terminology point is evidenced from existing records only (batch-wip-iv/STAGED-CHANGES.md group C1). | A -> dev ticket; the 4 cases stand as written and he edits S4-R7/S4-R9. B -> the 4 cases revert to unit-number-leads and the durable CLAUDE.md ruling is narrowed to exclude this report. C -> a label change is a new question for the whole suite, including SBC-LBL-01. All 4 are HELD, not edited. |
| Tab 2 | 3 | item 4 of the 10-row sheet | chris-sheet-2026-08-04 | SBR-EXP-10 (C30285); SBR-EXP-11 (C30286). | Three sources, three words. SPEC: SBR v15 S14-R15/S14-R16 both open with `Sales Rep`. OUR SOURCE: Chris Ward 2026-07-31 Q5=A, verbatim "Rep is too much slang, let's do representative everywhere" - so our cases correctly say "Sales Representative" (Rule 32). BUILD: header line read from evidence/location-matrix/sales-by-representative__SINGLE__summary.csv line 2 = `Representative,"Inv. Hrs",...`; the expanded file agrees. Build v3.4.1-0ed4433. Analysis: viu-2026-08-03/LABEL-DIFF.md section A4, which explicitly says do NOT edit these two to "Representative" before he rules. | A -> both cases reworded to "Representative" and he tidies S14-R15/R16. B -> dev ticket; the cases stand. Either way these two cases also carry item 5 (the four missing columns) and the separate LABEL-DIFF A6 findings (the expanded file puts Invoice # before Date and heads the status column "Invoice Status"), so all of it lands as ONE combined edit per case, each re-verified WHOLE against the current spec per Rule 41. |
| Tab 2 | 4 | item 5 of the 10-row sheet | chris-sheet-2026-08-04 | SBR-EXP-10 (C30285) - the same case as item 4, so both answers land in one edit. | SPEC (Rule 25, verbatim): SBR v15 S14-R15 "Headers, in order: `Sales Rep`, `# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced`, `Inv. Hrs`, `Labor Invoiced`, `Labor Margin`, `Parts Invoiced`, `Parts Margin`, `Margin`, `Margin %`, `Subtotal`." = 13. BUILD: 9 - `Representative, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal` (evidence/location-matrix/sales-by-representative__SINGLE__summary.csv). Missing: # Invoices, # Customers, Hrs Worked, Hrs Invoiced. The payload DOES carry invoice_count, hours_worked and hours_invoiced, which is why LABEL-DIFF.md A5 reads it as an unfinished export, not a data defect. Build v3.4.1-0ed4433. NOTE: S14-R16 itself carries a build note asking engineering to align the hours columns, so his own document already half-anticipates this. | A -> dev ticket; C30285 stands as written. B -> C30285's enumeration shortens to nine and he shortens S14-R15. Rule 42 applies either way: the rewritten enumeration must carry a version-pinned anchor. |
| Tab 2 | 5 | item 6 of the 10-row sheet | chris-sheet-2026-08-04 | SBC-DATE-01 (C30102); SBC-DATE-03 (C30104) - NOT RUNNABLE TODAY; SBR-DATE-01 (C30201); PV-FILT-03 (C30330); WIP-FLT-04 (C30501); IV-DATE-01 (C30561). | SPEC: SBC v13 S2-R2 closes the eleven-item list verbatim; WIP v6 S7-R6 and IV v3 S5-R1 close the same list in their own words. BUILD: nine presets + inline calendar + "Range: N days" + Apply, captured verbatim in viu-2026-08-03/evidence/date-range-picker.json. Build v3.4.1-0ed4433. This is the application's SHARED date component, so it is a suite-wide product decision. Registered as DELIBERATE-DECISIONS.md entry 2.1 at risk MEDIUM precisely because C30104's steps cannot be executed today. | A -> 6 cases reworded to the nine presets + calendar, C30104 becomes runnable, and 3 specs need his edit. B -> dev ticket against the shared component; all 6 cases stand and C30104 stays unrunnable until it ships. C -> partial dev ticket plus a partial case rewrite. |
| Tab 2 | 6 | item 7 of the 10-row sheet | chris-sheet-2026-08-04 | TU-EXP-01 (C30434); TU-EXP-02 (C30435). | SPEC (Rule 25, verbatim): TU v5 S7-R2 'an option labeled "Download Summary (PDF)"', S7-R3 '"Download Expanded View (PDF)"', S7-R4 '"Download (CSV)"' = three items with the Download prefix. BUILD: four items - `Summary (PDF)`, `Summary (CSV)`, `Expanded (PDF)`, `Expanded (CSV)`, no prefix (batch-pv-tu/VERDICTS.md TU-EXP-01; evidence/tu/ui/tu-ui-*.json). CONTRAST captured the same run: SBC and SBR both show the four long labels and MATCH their specs exactly (batch-sbc-sbr/VERDICTS.md F2, LABEL-DIFF.md B row SBC-EXP-01). Build v3.4.1-0ed4433. Registered as DELIBERATE-DECISIONS.md entry 2.4, risk MEDIUM. | A -> C30434 reworded to the four shipped strings (and C30435's Summary-PDF scope re-checked), and he edits S7-R2/R3/R4 to four items. B -> dev ticket; both cases stand. |
| Tab 2 | 7 | item 8 of the 10-row sheet | chris-sheet-2026-08-04 | IV-EXP-04 (C30590). | SPEC (Rule 25, verbatim): IV v3 S10-R8 "The PDF header shows the report name 'Inventory Value', the organization name, the selected period, and an 'as of' line naming the day the values represent..." - the PDF only; no requirement mentions the CSV. S10-R15 governs only the "Locations:" line. BUILD: CSV line 1 = "As of: 2026-08-03" with the locations line on line 2 (evidence/location-matrix/inventory-value__SINGLE__plain.csv); extracted PDF header block reads `As of 2026-08-04` with NO colon (batch-wip-iv/STAGED-CHANGES.md B28). Build v3.4.1-0ed4433. This surfaced from the SURFACE-MATRIX 1b sweep (Rule 40) - the IV "Locations:" line is the only one of six that is line 2 rather than line 1, because the as-of line sits above it. | A -> he adds the CSV as-of line to S10-R8 (or a new requirement) and C30590 gains the CSV half. B -> dev ticket to remove it; C30590 unchanged. C -> a wording ticket plus a one-line spec edit; C30590 quotes whichever string he picks. |
| Tab 2 | 8 | item 9 of the 10-row sheet | chris-sheet-2026-08-04 | PV-PERM-01 (C30325); PV-PERM-03 (C30327); PV-API-04 (C30391); TU-NAV-07 (C30398); WIP-PERM-01 (C30526); WIP-PERM-02 (C30527); IV-PERM-01 (C30603); IV-PERM-02 (C30604). | ALREADY RULED - no product decision is being re-asked. Chris Ward 2026-07-31 Q4=A, verbatim "A - the intention is to not hide these from normal reports access. These were specced before CRP was built :)" (and the same answer 2026-07-28), plus the QA LEAD's ruling 2026-08-03, verbatim: "Yes all the reports will be gated by ONE permission FOR NOW." SPEC TEXT STILL STALE: PV v4 S1-R4 + S1-N2, IV v3 Story-1 prerequisite, TU v5 Story-1 prerequisite, WIP v6 Story-1 prerequisite; SBC v13 S1-R2 has been corrected. LIVE PROOF BOTH WAYS (viu-2026-08-03/SURFACE-MATRIX.md Matrix 2 + evidence/permissions/permission-matrix.json + minimal-role-proof.json): the FE permission catalogue holds exactly one report atom; an 8-atom Sales Representative holding only it got 200 on data AND export for all six; a Foreman without it got 403 on all six, data and export. Build v3.4.1-0ed4433. This is why C30327 and C30391 are verified MORE strongly than written - the extra per-report permission does not merely fail to enforce, it does not exist. | No case change on any answer - all 8 already follow the ruling. This row only closes a documentation debt on four spec pages. The separate rescope-or-retire decision on C30327 and C30391 is the QA LEAD's, not Chris's (chris-answers-2026-08-01/staged-case-plan-CDE-2026-08-03.md). |
| Tab 2 | 9 | item 10 of the 10-row sheet | chris-sheet-2026-08-04 | SBC-EXP-01 (C30159); SBC-EXP-14 (C30172). | SPEC: SBC v13 S18-R7 "Exports (CSV, PDF, Print) are generated on the server..." and S18-R10 "If an export (CSV, PDF, or Print) is triggered while the active filters match no customers..." - both still name Print, although Chris retired it in Story 16 ("(removed - Print retired)"). JIRA SV-8614 "SBC - Story 16 - Print the report" is still OPEN. BUILD: a sweep of every button, menu item and link for 'print' in text or aria-label returned an EMPTY list on all six reports (batch-sbc-sbr/VERDICTS.md F3; evidence/sales-by-customer/observe-full.json#toolbar.printControls). Build v3.4.1-0ed4433. Registered as DELIBERATE-DECISIONS.md entry 1.4 at risk LOW, and as an OUTSIDE-IN.md external signal. | No decision and no case change - C30159 explicitly asserts the ABSENCE of Print and PASSED live. Included only so a documentation tidy-up and the closure of SV-8614 are not forgotten; SV-8614 is a dev/ticket action, not Chris's. |
| Tab 3 | 1 | item 1 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | SBR-EXP-10 (C30285); SBR-EXP-11 (C30286); SBR-EXP-03 (C30278); SBR-EXP-04 (C30279); SBR-LOC-05 (C38913) | SBR spec v15 (Confluence 585629698, lastModified 2026-07-29 - RE-VERIFIED LIVE 2026-08-03, still unresolved): NEW S14-R20 ("included in all four exports in the same position it occupies on screen") vs S14-R15 (Summary CSV headers "in order", beginning `Sales Rep`, no Location) and S14-R16 (Expanded CSV headers). The header enumerations date from the 2026-07-11 "Exports hardened" round and were never amended. Corroborated by contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md and by Vladimir Tomovic's automated C38923, which was RIGHT (Rule 44). | A -> the 5 cases stand as pushed and Chris tidies S14-R15/R16. B -> revert the export halves to the fixed lists and drop the Location assertions. Same on-screen/export split was fixed on SBC (S4-R13), PV (S6-R11), TU (S7-R13), IV (S10-R15); WIP already had it. Either way VIU-confirm live. |
| Tab 3 | 2 | item 2 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | WIP-COL-05 (C30470); WIP-FLT-03 (C30500); WIP-SORT-03 (C30485); WIP-EXP-07 (C30516); SBR-LOC-04 (C30216); TU-LOC-05 (C30446); IV-LOC-04 (C30577); PV-FILT-13 (C30340); TU-NAV-01 (C30392); PV-NAV-01 (C30322) | SPEC-WATCH-2026-07-28.md re-diff 2026-07-31, re-confirmed 2026-08-03 (all five non-SBC specs still at their 2026-07-29 versions per live CQL, so nothing has landed since): 7 of 12 items still need spec text - 1b WIP identifier, 4 location filter hidden, 6 nav placement wording, 8 WIP asset dropdown, 9 customer-card Representative, 10 SBC nav anchors, 11 PV "only report". Deadline 2026-08-04. | A -> no case change; SPEC-WATCH stays open until the text lands. B -> SPEC-WATCH closes as a documentation debt. Neither answer changes a case. Items 1b/4/6/9/10/11 are ALSO asked individually as sheet items 6-12 so he can tick them off. |
| Tab 3 | 3 | item 3 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | SBC-EXP-16 (C38856); SBC-LOC-04 (C38912); SBR-EXP-10 (C30285); SBR-EXP-03 (C30278); SBR-LOC-05 (C38913) | SPEC-SILENT, found by coverage-rederivation-2026-07-31. SBC S4-R13 states inclusion with no position; SBR S14-R20 says "the same position it occupies on screen" but the Summary CSV (S14-R15) has no Date/Status column and the Summary PDF (S14-R5) has none either. Cases currently hedge ("with the identifying columns ahead of the money columns (confirm its exact position in the build)") - hedged, not invented (Rule 9). | A -> replace the hedge with the stated position. B -> reword to far-right. C -> keep the hedge and pin it at VIU. No case is wrong today either way. |
| Tab 3 | 4 | item 4 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | SBC-EXP-10 (C30168); TU-EXP-06 (C30439); TU-EXP-07 (C30440); PV-EXP-05 (C30379); PV-EXP-06 (C30380); SBR-EXP-03 (C30278); SBR-EXP-04 (C30279) | Cross-report spec contradiction against his 2026-07-29 message ("Each report now ensures the same 'logo' treatment"): SBC S15-R16/R17/R18 = 3-step chain ending in NO logo; TU = bundled ShopView default; PV has no logo requirement at all. DELIBERATE-DECISIONS.md A2. Not resolved by us (Rule 15 - never pick a side silently). | A -> TU/PV export cases gain the fallback chain. B -> SBC-EXP-10's chain collapses to the bundled default. C -> re-ask. Wording-only edits either way. |
| Tab 3 | 5 | item 5 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | NONE - zero case impact either way. Evidence base: SBC-DATE-01 (C30102) asserts the ABSENCE of "All Time"; the SBC Print case was retired 2026-07-28 (deleted from TestRail, so it has no live C-id); no case exists for customer comparison, asset comparison or global-search narrowing | His chat, verbatim: "SBC actually has several features that we dropped almost right before the squad assembled ... the requirements should have dropped with the additional features dropping, I own that." Checked live 2026-08-03 against the SBC spec change log (Confluence 577634305): the four dropped rounds are 2026-07-12 (customer comparison + asset comparison), 2026-07-15 (global search), 2026-07-16 (All Time), 2026-07-29 (Print). ZERO lingering requirements and ZERO stale cases found - see chris-answers-2026-08-01/answers-ingested.md section 3. | A -> the item closes with a written all-clear. B -> re-derive coverage for whatever he names. We did NOT manufacture a retire list to fill the gap (Rule 12). |
| Tab 3 | 6 | item 8 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | Same cases as row 2 - these are SPEC-WATCH items 1b, 4, 6, 10, 8, 9, 11 asked one at a time so he can tick each off ["row 2" here means the source sheet's own item-2 mapping row, which is Tab 3 item 2 above] | Named individually at the QA lead's instruction ("each named individually, not as a bundle"), because the 2026-08-04 deadline is tomorrow and a bundled question has so far produced a bundled non-answer. [this mapping row covers items 6-12 of the source sheet; after the de-duplication its surviving items are Tab 3 items 6, 7, 8, 9, 10] | No case change on any answer - the cases already follow his rulings (Rule 32). These only close a documentation debt. |
| Tab 3 | 7 | item 9 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | Same cases as row 2 - these are SPEC-WATCH items 1b, 4, 6, 10, 8, 9, 11 asked one at a time so he can tick each off ["row 2" here means the source sheet's own item-2 mapping row, which is Tab 3 item 2 above] | Named individually at the QA lead's instruction ("each named individually, not as a bundle"), because the 2026-08-04 deadline is tomorrow and a bundled question has so far produced a bundled non-answer. [this mapping row covers items 6-12 of the source sheet; after the de-duplication its surviving items are Tab 3 items 6, 7, 8, 9, 10] | No case change on any answer - the cases already follow his rulings (Rule 32). These only close a documentation debt. |
| Tab 3 | 8 | item 10 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | Same cases as row 2 - these are SPEC-WATCH items 1b, 4, 6, 10, 8, 9, 11 asked one at a time so he can tick each off ["row 2" here means the source sheet's own item-2 mapping row, which is Tab 3 item 2 above] | Named individually at the QA lead's instruction ("each named individually, not as a bundle"), because the 2026-08-04 deadline is tomorrow and a bundled question has so far produced a bundled non-answer. [this mapping row covers items 6-12 of the source sheet; after the de-duplication its surviving items are Tab 3 items 6, 7, 8, 9, 10] | No case change on any answer - the cases already follow his rulings (Rule 32). These only close a documentation debt. |
| Tab 3 | 9 | item 11 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | Same cases as row 2 - these are SPEC-WATCH items 1b, 4, 6, 10, 8, 9, 11 asked one at a time so he can tick each off ["row 2" here means the source sheet's own item-2 mapping row, which is Tab 3 item 2 above] | Named individually at the QA lead's instruction ("each named individually, not as a bundle"), because the 2026-08-04 deadline is tomorrow and a bundled question has so far produced a bundled non-answer. [this mapping row covers items 6-12 of the source sheet; after the de-duplication its surviving items are Tab 3 items 6, 7, 8, 9, 10] | No case change on any answer - the cases already follow his rulings (Rule 32). These only close a documentation debt. |
| Tab 3 | 10 | item 12 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | Same cases as row 2 - these are SPEC-WATCH items 1b, 4, 6, 10, 8, 9, 11 asked one at a time so he can tick each off ["row 2" here means the source sheet's own item-2 mapping row, which is Tab 3 item 2 above] | Named individually at the QA lead's instruction ("each named individually, not as a bundle"), because the 2026-08-04 deadline is tomorrow and a bundled question has so far produced a bundled non-answer. [this mapping row covers items 6-12 of the source sheet; after the de-duplication its surviving items are Tab 3 items 6, 7, 8, 9, 10] | No case change on any answer - the cases already follow his rulings (Rule 32). These only close a documentation debt. |
| Tab 3 | 11 | item 14 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | SBR-DEACT-04 (C30255) | ANSWERED by Chris 2026-07-28, verbatim "B." (chris-answers-2026-07-28/answers-ingested.md Q1) = Escape must NOT dismiss. Verified live 2026-08-03: SBR S13-R8 still says Escape closes the dialog. NOTE - a correction to our own record: PO-Questions-Chris-ReportSuite-2026-07-31.md line 125 says this question is still "open four days". That is STALE; only the spec text remains outstanding, which is why this appears here as a write-down item, not a decision. | No case change - C30255 already follows his answer. |
| Tab 3 | 12 | item 15 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | PV-EXP-11 (C38885); TU-EXP-09 (C38887); WIP-EXP-10 (C38918) | His 2026-07-31 Q2=A ("A - great catch", one suite-wide message) + Q3=A ("this was not well thought out by me", cap on all six). Verified: the PV/TU/WIP pages carry no cap line; the three cases exist and are pushed. | No case change - documentation debt only. |
| Tab 3 | 13 | item 16 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | SBC-LBL-01 (C30134); WIP-COL-05 (C30470) | His own 2026-07-29 standing note, verbatim: "we just have to be careful with using the acronym VIN ... for a generator ... it gets confusing". Our cases keep the build label "VIN" plus a plain tester note, per the durable ruling in CLAUDE.md. | No case change either way - the on-screen label is unaffected. |
| Tab 3 | 14 | item 17 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | NONE | Cosmetic encoding artefact (mojibake) in the SBR and PV spec text, already noted in SPEC-WATCH-2026-07-28.md. Not a product question; asked only because it makes quoting those lines back to him unreliable. | No case impact. |

### The links, spelled out

| Internal ID | TestRail | Link | Report | Spec anchor | What it asserts today |
|---|---|---|---|---|---|
| IV-COL-01 | C30551 | [open](https://shopview.testrail.io/index.php?/cases/view/30551) | Inventory Value | Inventory Value spec v3 S7-R6 | Asserts Location is in the column-selection control and appears 'when it is turned on', between Vendor and Qty. |
| IV-COL-04 | C30554 | [open](https://shopview.testrail.io/index.php?/cases/view/30554) | Inventory Value | Inventory Value spec v3 S7-R6 | Asserts Location can be 'turned on from the column-selection control' and then appears in its fixed position. |
| IV-PERS-02 | C30580 | [open](https://shopview.testrail.io/index.php?/cases/view/30580) | Inventory Value | Inventory Value spec v3 S7-R6 | Fixed column order stated 'with Location, when it is turned on in the column-selection control, between Vendor and Qty'. |
| IV-EXP-02 | C30588 | [open](https://shopview.testrail.io/index.php?/cases/view/30588) | Inventory Value | Inventory Value spec v3 S7-R6 | Tester note says the files carry Location 'when Location is turned ON in the column-selection control'. |
| IV-LOC-06 | C38917 | [open](https://shopview.testrail.io/index.php?/cases/view/38917) | Inventory Value | Inventory Value spec v3 S7-R6 | Step 1 instructs the tester to 'Turn Location on in the column-selection control'; expected says visibility 'follows that toggle, not the location selection'. |
| WIP-COL-01 | C30466 | [open](https://shopview.testrail.io/index.php?/cases/view/30466) | Work In Progress | WIP spec v6 S4-R3; S7-R13 | Precondition 4: 'Location is turned ON in the column-selection control (it is off by default).' |
| WIP-COL-02 | C30467 | [open](https://shopview.testrail.io/index.php?/cases/view/30467) | Work In Progress | WIP spec v6 S4-R3; S7-R13 | Asserts Location IS offered in the selector, off by default, and does 'NOT appear on its own' - and says out loud 'That is what the build does today.' |
| WIP-FLT-09 | C38916 | [open](https://shopview.testrail.io/index.php?/cases/view/38916) | Work In Progress | WIP spec v6 S4-R3; S7-R13 | Asserts 'The column does not appear or disappear on its own ... it follows the column-selection toggle only.' |

## De-duplication log - what was removed and where the question now lives

**4 overlapping items removed. 28 reader-facing items across the three sheets in; 24 out.**

| Removed | The item | What happened | Why, and what was preserved |
|---|---|---|---|
| Tab 2, item 2 of the 10-row sheet | "The extra location column works one way on Work In Progress and the exact opposite way on Inventory Value" | REMOVED - the same question, asked wider, is Tab 1 | Tab 1 asks the identical question (automatic versus a switch the user controls) but across all SIX reports and adds the screen-versus-download split on Inventory Value, so it is the superset. Asking both would have let him answer the two-report version and the six-report version differently. Its QA mapping row is RETAINED below - it carries WIP-PERS-02 (C30507), which Tab 1's own eight-case list does not. |
| Tab 3, item 6 of the 17-item sheet | "Work In Progress: which number identifies the vehicle or machine first" - will you update the description? | REMOVED - subsumed by Tab 2 item 2 | Tab 2 item 2 asks which side moves now the product disagrees with his 29 July ruling, and BOTH of its options already name who edits the write-up. Keeping the separate tick-box allowed a contradiction: he could tick "yes I will update it" here and choose "keep the product as it is" there. Its QA mapping row is RETAINED below. |
| Tab 3, item 7 of the 17-item sheet | "The location chooser is hidden for someone with only one location" - will you correct those four lines? | REMOVED - subsumed by Tab 2 item 1 | Tab 2 item 1 puts the same four quoted lines in front of him and says in BOTH options that the four lines need correcting. Same contradiction risk as above. Its QA mapping row is RETAINED below. |
| Tab 3, item 13 of the 17-item sheet | "Five descriptions still say the report needs its own area permission" | REMOVED - exact duplicate of Tab 2 item 8 | The 10-row sheet already recorded this as the one overlap between the two sheets. Tab 2's version is the better one: it carries the live both-ways proof, and its figure is right - it says FOUR write-ups and lists four, whereas this row said "five" and then listed four. So the removal also retires a stale figure. Its QA mapping row is RETAINED below - it carries four navigation/tab cases (PV-NAV-01, IV-NAV-01, TU-NAV-01, WIP-TAB-01) that Tab 2 item 8's row does not. |

### Merged out - the QA mapping rows of the removed items, RETAINED

Kept so that not one case id is lost: three of these four rows carry case ids the surviving item's row does not.

| Was | Source sheet | Now asked as | Affected internal case IDs (TestRail C-id) | Spec anchors + live evidence | What each answer resolves to |
|---|---|---|---|---|---|
| item 2 of the 10-row sheet | chris-sheet-2026-08-04 | asked once, as Tab 1 | Work In Progress: WIP-COL-02 (C30467); WIP-COL-01 (C30466); WIP-PERS-02 (C30507); WIP-FLT-09 (C38916). Inventory Value: IV-LOC-06 (C38917); IV-COL-04 (C30554). | SPEC: WIP v6 S4-R3 + S7-R13 ("not offered in the column selector; its visibility is automatic"); IV v3 Story-7 context note + S7-R7 ("not a user-toggled column in the column-selection control"). LIVE: viu-2026-08-03/batch-wip-iv/evidence/ui/colsel-work-in-progress.json - Location is item index 5 of 16, ariaChecked=false; colsel-inventory-value.json - Location is item index 4 of 11, ariaChecked=true; iv-singleloc.png shows the column still present with the chooser narrowed to Staging Lethbridge - 4310. Build v3.4.1-0ed4433. ALSO OUR OWN CONTRADICTION (Rule 28 cross-case sweep): C30466 and C30507 both list Location inside the toggleable order while C30467 says it is not offered - that self-contradiction is resolved whichever way he rules. HONEST LIMIT: the separate one-location-USER read of the IV screen was CONFOUNDED by a persisted column selection (RECHECK-QUEUE B34, recorded NOT VERIFIED); the observation quoted to Chris is the ADMIN-NARROWING one, which is clean. Note also that the IV single-location CSV has NO Location column (evidence/location-matrix/inventory-value__SINGLE__plain.csv), so the download already follows the automatic rule while the screen follows the toggle. | A -> dev ticket for both reports; the 6 cases stand as written and the two specs need no change. B -> both specs need his edit and the 6 cases are reworded to the toggle model (WIP off-by-default, IV on-by-default, or one agreed default). C -> the two reports are documented as deliberately different and our cross-case contradiction is closed by writing each report's own model down. |
| item 6 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | asked once, as Tab 2 item 2 | Same cases as row 2 - these are SPEC-WATCH items 1b, 4, 6, 10, 8, 9, 11 asked one at a time so he can tick each off [this is the grouped mapping row the source sheet used for its items 6-12; "row 2" in its text means the sheet's own item-2 row, which is carried above as Tab 3 item 2] | Named individually at the QA lead's instruction ("each named individually, not as a bundle"), because the 2026-08-04 deadline is tomorrow and a bundled question has so far produced a bundled non-answer. | No case change on any answer - the cases already follow his rulings (Rule 32). These only close a documentation debt. |
| item 7 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | asked once, as Tab 2 item 1 | Same cases as row 2 - these are SPEC-WATCH items 1b, 4, 6, 10, 8, 9, 11 asked one at a time so he can tick each off [this is the grouped mapping row the source sheet used for its items 6-12; "row 2" in its text means the sheet's own item-2 row, which is carried above as Tab 3 item 2] | Named individually at the QA lead's instruction ("each named individually, not as a bundle"), because the 2026-08-04 deadline is tomorrow and a bundled question has so far produced a bundled non-answer. | No case change on any answer - the cases already follow his rulings (Rule 32). These only close a documentation debt. |
| item 13 of the 17-item sheet | PO-Questions-Chris-ReportSuite-2026-08-03 | asked once, as Tab 2 item 8 | PV-PERM-01 (C30325); PV-PERM-03 (C30327); PV-API-04 (C30391); IV-PERM-01 (C30603); IV-PERM-02 (C30604); TU-NAV-07 (C30398); WIP-PERM-01 (C30526); WIP-PERM-02 (C30527); PV-NAV-01 (C30322); IV-NAV-01 (C30534); TU-NAV-01 (C30392); WIP-TAB-01 (C30451) | NEW spec debt created by his own Q2=A ("Collapse all report access into a single Reports permission") plus the QA lead's ruling 2026-08-03, verbatim: "Yes all the reports will be gated by ONE permission FOR NOW." Verified live 2026-08-03: PV S1-R4/S1-N2, IV S1-R4 and the TU/WIP Story-1 prerequisites still name per-area permissions; only SBC S1-R2 has been corrected (2026-07-31). NOTE: the SBC change log still instructs engineering to DROP the atom, while his later chat allows hiding it inert - the later source wins (Rule 32). | No decision needed - the model is settled. Groups C and D of staged-case-plan-CDE-2026-08-03.md reword these 12 cases to the single permission; the two retire-or-rescope candidates (C30327, C30391) await the QA lead's sign-off. |

## Changes made in consolidation - all of them

| Where | What changed | Why |
|---|---|---|
| Tab 1 opening line | The original said the question is "separate from the longer sheet you already have - that one still stands". Now that the three sheets are one workbook it points at the other two tabs instead. No change of meaning. | pointer fix, forced by the consolidation |
| Tab 2 opening line — the item count | "There are 10 items: 8 need you to choose something..." recomputed to 9 items / 7 decisions, because item 2 moved to Tab 1. The counts are computed from the data, never typed, so they cannot drift again. | stale figure, caused by the de-duplication |
| Tab 2 opening line — the companion pointer | "Please read it alongside the sheet dated 3 August" now reads "the last tab is its companion". Same sentence otherwise. | pointer fix, forced by the consolidation |
| Tab 2 opening line — "this sheet" | The two occurrences of "this sheet" read "this tab". Nothing else in the paragraph changed. | pointer fix, forced by the consolidation |
| Tab 3, item 2 — the pointer at the end | "The seven still-missing edits are listed one by one further down this sheet" now reads "...are each listed on their own further down, or on the tab before this one where the product disagrees with your answer as well" — because two of those seven (the vehicle number on Work In Progress, and the location chooser) are now asked once, on Tab 2. | pointer fix, forced by the de-duplication |
| QA-only tab — the "not asked here" rows that pointed at the other sheet | Five rows said "already question N of the 3 August sheet". They now name the tab and item number in this workbook. One row — "the 17 items of the 3 August sheet are deliberately not duplicated" — became meaningless once the sheets merged and is replaced by a row describing the consolidation itself. | pointer fix, forced by the consolidation |
| QA-only tab — the source-currency block | The six description versions were RE-CHECKED LIVE today, 2026-08-04, read straight from Confluence rather than carried over from the 3 August check. All six are unchanged (Sales By Customer 13 · Sales By Representative 15 · Parts Velocity 4 · Technician Utilization 5 · Work In Progress 6 · Inventory Value 3), so no item on any tab has been overtaken by a description edit. Dates and verdicts updated accordingly. | Standing Rule 31 pre-flight, done fresh for this pass |

## Declared wording carry-over (Standing Rule 7)

| Word | Where | Why it is kept rather than reworded |
|---|---|---|
| toggle | Tab 3 item 10 | The phrase "a select-all / clear-all toggle" is carried VERBATIM from the 3 August sheet, which is wording-checked and ready to send. "Toggle" is also Chris's own vocabulary — his Inventory Value description says "it is not a user-toggled column in the column-selection control" — so it is his word, not our jargon. Rewriting a wording-checked, PO-facing line was outside the brief for this pass, so it is declared instead of silently changed. |

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| Sales By Customer description | Confluence page 577634305 | version 13, last changed 2026-07-31 | 2026-08-04 (read live) | CURRENT - unchanged since the sheets were written |
| Sales By Representative description | Confluence page 585629698 | version 15, last changed 2026-07-29 | 2026-08-04 (read live) | CURRENT - unchanged since the sheets were written |
| Parts Velocity description | Confluence page 620888066 | version 4, last changed 2026-07-29 | 2026-08-04 (read live) | CURRENT - unchanged since the sheets were written |
| Technician Utilization description | Confluence page 641400833 | version 5, last changed 2026-07-29 | 2026-08-04 (read live) | CURRENT - unchanged since the sheets were written |
| Work In Progress description | Confluence page 703660034 | version 6, last changed 2026-07-29 | 2026-08-04 (read live) | CURRENT - unchanged since the sheets were written |
| Inventory Value description | Confluence page 720142338 | version 3, last changed 2026-07-29 | 2026-08-04 (read live) | CURRENT - unchanged since the sheets were written |
| The build | QA branch sv8582 / project/reports-suite-bravo, app-version v3.4.1-0ed4433 | v3.4.1-0ed4433 | 2026-08-03 / 2026-08-04 | PARTIAL - engineering declared the branch NOT FINAL, so every observation quoted on these tabs is PROVISIONAL and is queued for re-check in viu-2026-08-03/RECHECK-QUEUE.md (Standing Rule 49). Shortfall: the observations may change when the branch settles. |
| Epic SV-8582 + child stories | Jira, project SV | currency-checked, no full re-read this pass | 2026-08-03 | PARTIAL - Tier-1 currency check only (Standing Rule 37); a full re-read was not authorised for this pass and is not claimed |
| Designs | none exist for the Report Suite | n/a | 2026-08-04 | ABSENT - spec-only project; no Figma file has ever been supplied, so no design source was consulted and none is claimed |
| Engineering tech plan | tech-plan-2026-07-29/ | as supplied 2026-07-29 | 2026-08-04 | CURRENT |
| Chris Ward's answers, messages and both videos | chris-answers-2026-07-28 / -07-31 / -08-01, chris-update-2026-07-29, both video transcripts | newest = the 2026-08-01-round two-question sheet | 2026-08-04 | CURRENT - re-swept today; nothing newer than 2026-08-01 exists, so no question on any tab has been answered since the source sheets were written |
| The three source sheets themselves | chris-location-question-2026-08-04 / chris-sheet-2026-08-04 / PO-Questions-Chris-ReportSuite-2026-08-03 | all three READY TO SEND, none sent | 2026-08-04 | CURRENT - all three are now marked SUPERSEDED by this workbook, and are kept, not deleted |

Method (Standing Rule 31, and the version-number trap it names): the six description versions were read from the LIVE Confluence page objects on 2026-08-04 - GET /wiki/api/v2/pages/<id>, HTTP 200 on all six - and the CONFLUENCE VERSION NUMBER was used, never the version written inside the document body. Values read: 13 (2026-07-31), 15, 4, 5, 6, 3 (all five 2026-07-29). These are the exact versions the three source sheets were built against, so nothing on any tab is stale against its description.

**Build marker: v3.4.1-0ed4433.** Nothing in this workbook claims completeness: the build is a PARTIAL source by engineering's own statement, so every observation is PROVISIONAL and queued in `viu-2026-08-03/RECHECK-QUEUE.md` (Standing Rule 49).

## Completeness proof - every source swept (Standing Rule 17)

| Source | Items found | Notes | Swept by |
|---|---|---|---|
| viu-2026-08-03/batch-sbc-sbr/VERDICTS.md + STAGED-CHANGES.md | 3 spec-vs-build items | items 4, 5, 6 (SBC/SBR halves) and 10. The SBC nav-group question (spec says Performance, build says SALES) is NOT on this sheet - it is already question 9 of the 3 August sheet, unanswered | the 10-row sheet |
| viu-2026-08-03/batch-pv-tu/VERDICTS.md + STAGED-CHANGES.md | 3 spec-vs-build items | items 1 (PV/TU halves), 6 (PV half) and 7. Its section-C product questions map 1:1 onto items 1, 6 and 7 | the 10-row sheet |
| viu-2026-08-03/batch-wip-iv/VERDICTS.md + STAGED-CHANGES.md | 4 spec-vs-build items | items 1 (WIP/IV halves), 2, 3 and 8. Its group C (HELD pending a Chris ruling, 6 cases) is fully represented here: C1 -> item 3, C2 -> item 1, C3 is a build defect not a product question | the 10-row sheet |
| viu-2026-08-03/LABEL-DIFF.md | 4 items | A2 -> item 7, A3 -> item 6, A4 -> item 4, A5 -> item 5. A6/A7/A8/A9 are build defects or wording fixes, not product decisions - excluded with reason | the 10-row sheet |
| viu-2026-08-03/SURFACE-MATRIX.md | 2 items | Matrix 2 -> item 9; the 1b as-of/locations line sweep -> item 8. Matrix 1a (Location column placement) is read as an implementation slip with no product question | the 10-row sheet |
| viu-2026-08-03/DELIBERATE-DECISIONS.md | 4 of 35 entries name Chris Ward as the closer | 1.4 -> item 10, 2.1 -> item 6, 2.4 -> item 7; the fourth (logo treatment) is already question 4 of the 3 August sheet and is NOT repeated | the 10-row sheet |
| viu-2026-08-03/RECHECK-QUEUE.md | 0 new | B18/B19/B34 are the same observations as items 1, 7 and 2. Every row on this sheet inherits the queue's PROVISIONAL status (Standing Rule 49) | the 10-row sheet |
| spec-watch-verification-2026-08-03/VERIFICATION.md + ADDENDUM | 0 new | confirms the six live versions used in the source-currency block (SBC 13 / SBR 15 / PV 4 / TU 5 / WIP 6 / IV 3) and that only SBC moved since 07-31 | the 10-row sheet |
| The six live descriptions, re-read for this sheet | 10 verbatim quotes extracted | every reader-facing quote on this sheet was pulled from the live capture or the version-matched mirror, not from a summary (Standing Rule 15) | the 10-row sheet |
| PO-Questions-Chris-ReportSuite-2026-08-03.md (17 items, unanswered) | 0 duplicated | checked item by item - nothing on this sheet repeats it. Its 17 items are description-text asks; this sheet is spec-versus-build behaviour. The overlap is only item 9 here vs its item 13, and ours adds the live both-ways proof it lacked | the 10-row sheet |
| chris-answers-2026-07-28 / -07-31 / -08-01, chris-update-2026-07-29, both videos | 8 candidates WITHDRAWN | see the withdrawn appendix - every one quoted | the 10-row sheet |
| coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md + COVERAGE-REDERIVATION.md | 0 new | its open bucket is fully covered by the 3 August sheet; nothing there is a spec-vs-build item | the 10-row sheet |
| OUTSTANDING-ITEMS-REGISTER.md (Report Suite rows) | 0 new | its Chris-facing rows are the 3 August sheet itself and the spec-watch deadline; the QA-branch row is the QA lead's, not Chris's | the 10-row sheet |
| PO-Questions-Chris-ReportSuite-2026-07-31.md (5 questions) | 4 open | Q5 is ANSWERED (=A) on the separate permissions sheet; Q1-Q4 carried forward VERBATIM | the 17-item sheet |
| PO-Questions-Chris-ReportSuite-2026-07-27.md (3 questions) | 0 open | Q1 answered 2026-07-28 ("B."), Q2 superseded by the one-permission ruling, Q3 answered by the 2026-07-30 Loom | the 17-item sheet |
| PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30.md (5 questions) | 0 open | all five answered = A on 2026-07-31; 70 cases updated + 7 added and pushed | the 17-item sheet |
| SPEC-WATCH-2026-07-28.md (12 items, deadline 2026-08-04) | 7 open | items 1b, 4, 6, 8, 9, 10, 11 - each now asked INDIVIDUALLY as items 6-12 | the 17-item sheet |
| What-We-Need-From-Chris-Ward-2026-07-31.md (12 items) | 11 open | item 4 (permission granularity) is now closed; the rest dedupe into this sheet | the 17-item sheet |
| coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md (D1-D7 open bucket) | 6 open | D5 closed by the one-permission ruling; D1/D2/D3/D4/D6/D7 all dedupe into this sheet | the 17-item sheet |
| OUTSTANDING-ITEMS-REGISTER.md (Report Suite rows) | 0 new | its Chris-facing rows are the QA branch (not Chris), SV-8780 (out of scope by ruling) and the scope question (now answered) | the 17-item sheet |
| The six LIVE Confluence specs, re-checked 2026-08-03 | 2 new | SBC lastModified Jul 31; SBR/PV/TU/WIP/IV all still Jul 29. NEW: the five per-area permission descriptions (item 13); and the SBC change log still says DROP the atom while his chat says hide it (folded into item 13's note) | the 17-item sheet |
| Chris's 2026-08-01-round chat message + the filled 2-question sheet | 1 new | "which SBC features were dropped" (item 5). His two answers themselves are ingested, not re-asked | the 17-item sheet |
| Chris's 2026-07-29 group message | 1 new | the "be careful with the acronym VIN" caution is his own point and is not written into any spec (item 16) | the 17-item sheet |
| Both walkthrough videos (2026-07-30 Loom + the earlier PRD companion) | 0 new | every delta already promoted or on SPEC-WATCH; nothing unaddressed | the 17-item sheet |
| coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md (spec-silent / spec-inconsistent flags) | 0 new | the spec-silent flag is the Summary-download position = item 3; the spec-inconsistent flags are items 1 and 4 | the 17-item sheet |
| PROJECT-STATE.md | 0 new | no Chris-facing ask not already listed above | the 17-item sheet |
| The six LIVE Confluence descriptions, re-read for THIS workbook 2026-08-04 | **0 new** | All six still at the versions the source sheets used (13 / 15 / 4 / 5 / 6 / 3), read live over the page API, HTTP 200 on all six. No item has been overtaken by a description edit, so nothing needed withdrawing on that ground. | this consolidation |
| Chris Ward's answers, messages and both video transcripts, re-swept 2026-08-04 | **0 new** | Newest authoritative Chris source is still 2026-08-01, which both source sheets already accounted for. Nothing has been answered since they were written, so 0 further candidates were withdrawn by this pass; the 12 rows above are the de-duplicated union of what the two sheets had already withdrawn. | this consolidation |
| The three source sheets, compared item by item for overlap | **4 overlaps found** | 1 the two sheets had already spotted (the permission write-down) and 3 this pass found: the Location-column model asked twice, and two write-down tick-boxes whose ask is already inside a spec-versus-build item's options. All four removed; see the de-duplication log. 28 reader-facing items in, 24 out. | this consolidation |
| build/OUTSTANDING-ITEMS-REGISTER.md (Report Suite send-list row) | **0 new** | Its Chris-facing row previously listed the three sheets; it now points at this workbook. No new ask surfaced. | this consolidation |

## Withdrawn - already answered (not put in front of Chris)

**12 candidate questions**, the de-duplicated union of both source sheets' withdrawn lists. Questions have been withdrawn for this reason on four previous sheets, so the check is mandatory before any item survives. **This pass added 0 new withdrawals** - nothing has been answered since the source sheets were written.

| Candidate question | Already answered by | Withdrawn on |
|---|---|---|
| Should the location chooser be hidden for a one-location person? | ANSWERED 2026-07-31 Q1=A, verbatim "A -- classic spec drift". NOT re-asked. Item 1 asks a genuinely NEW question that could not exist before 3 August: the build disagrees with his ruling, so he must choose whether the product changes or the ruling does. The reader-facing text states his ruling rather than asking for it again. | both sheets |
| Should the six reports be gated by their own dedicated permission? | ANSWERED THREE TIMES: 2026-07-28 ("these should be gated by normal reports access"), 2026-07-31 Q4=A ("the intention is to not hide these from normal reports access. These were specced before CRP was built :)"), and the separate permissions sheet Q1=A. Plus the QA lead 2026-08-03: "Yes all the reports will be gated by ONE permission FOR NOW." Item 9 asks ONLY for the four spec edits and says so in its own text. | both sheets |
| Does the 10,000-row download limit apply to Parts Velocity, Technician Utilization and Work In Progress? | ANSWERED 2026-07-31 Q3=A, verbatim "A - this was not well thought out by me (the specs were written at different times)". Suite-wide. The three cases exist and are pushed. Only his spec edit remains, and that is already item 15 of the 3 August sheet. | both sheets |
| Which of the two "too large to export" messages is correct? | ANSWERED 2026-07-31 Q2=A, verbatim "A - great catch". One suite-wide string, and the build returns it verbatim (confirmed live 2026-08-03 on the SBC guard). Nothing left to ask. | both sheets |
| Should the asset identifier be the VIN chain rather than the serial number? | ANSWERED 2026-07-29, verbatim "A is the correct answer", with the durable instruction to apply it everywhere. Item 3 does NOT re-ask it - it reports that the build did not implement it and asks which side now moves. His own VIN/serial caution is quoted inside item 3 rather than raised as its own question, because it is his point, not ours. | the 10-row sheet |
| Should "Rep" be spelled out as "Representative"? | ANSWERED 2026-07-31 Q5=A, verbatim "Rep is too much slang, let's do representative everywhere". Item 4 accepts that ruling and asks only about the THIRD spelling the build produced, which did not exist as a fact until 3 August. | the 10-row sheet |
| Does Escape close the "deactivate a representative" pop-up? | ANSWERED 2026-07-28, verbatim "B." - Escape must NOT dismiss it. Our case follows it; only his spec edit remains and that is item 14 of the 3 August sheet. | both sheets |
| Should "All Time" be offered in the date chooser? | ANSWERED and already implemented - he removed it (SBC 2026-07-16 change log; WIP 2026-07-21 change log, recorded as "a Chris product/UX decision"). Live check 2026-08-03: not offered anywhere. Item 6 confirms its absence as a MATCH and asks only about the nine-versus-eleven list. | the 10-row sheet |
| How far does "one single Reports permission" reach - do the six reports just read one permission, or are the per-area permissions merged/removed in Custom Roles? | ANSWERED - and this was going to be the headline question of this sheet. Chris's Q2 = A ("Collapse all report access into a single Reports permission") plus the QA LEAD's ruling 2026-08-03, verbatim: "Yes all the reports will be gated by ONE permission FOR NOW." Rule 33 - the QA lead's ruling, consistent with the PO's answer. WITHDRAWN so we do not ask a settled question. "FOR NOW" is recorded on every affected case. | the 17-item sheet |
| Are there any pictures or videos to check the reports against? (Question 3 of the 27 July sheet) | ANSWERED by delivery, not by words - he produced the walkthrough Loom on 2026-07-30. It was ingested and ruled AUTHORITATIVE, and drove 3 firm deltas plus the SPEC-WATCH list. Designs remain absent, which is a separate, already-recorded fact. | the 17-item sheet |
| Does the short heading "Rep is active?" also become "Representative"? | ANSWERED by his 2026-07-31 Q5 = A, verbatim "slang, let's do representative everywhere" - the scope explicitly reaches the export column headers. Affects SBR-ASGN-02 (C30293). | the 17-item sheet |
| What is the exact renamed "Sales Rep Assignments" file name? | ANSWERED by the same Q5 = A - the file name is explicitly in scope of "representative everywhere". SBR-ASGN-02 (C30293) hedges the exact final string for live confirmation, which is the correct treatment; no product question remains. | the 17-item sheet |

## Not asked here (QA reference)

| Item | Why it is not on any tab | From |
|---|---|---|
| Sending the three sheets separately. | REPLACED BY THIS WORKBOOK. The 10-row sheet carried a row explaining that the 17 items of the 3 August sheet were deliberately NOT duplicated; that row is meaningless now the three are one workbook. What replaces it: the three sheets are consolidated, most-urgent tab first, and FOUR overlapping items were removed so nothing is asked twice - see the de-duplication log above. The source sheets are marked SUPERSEDED and kept, not deleted. | this consolidation |
| Where the location column sits in the shorter Summary downloads (spec-silent). | Asked once, as item 3 of the third tab. | the 10-row sheet |
| "The same logo treatment" - three descriptions describe three different rules. | Asked once, as item 4 of the third tab. | the 10-row sheet |
| Which Sales By Customer features were dropped. | Asked once, as item 5 of the third tab. | the 10-row sheet |
| The Sales By Customer navigation group (description says Performance, build shows SALES). | Asked once, as items 6 and 7 of the third tab. Not repeated, although the build observation is new - it is recorded in batch-sbc-sbr/STAGED-CHANGES.md for whenever he answers. | the 10-row sheet |
| Two printable downloads fail with a server error at full size (Parts Velocity, Inventory Value). | A DEFECT, not a product decision - Standing Rule 7 forbids putting bugs in front of the PO. It is a dev ticket; the friendly over-size guard exists on the spreadsheet path and the printable path fails instead of using it. Request ids captured in batch-wip-iv/evidence/api/. | the 10-row sheet |
| The location column's on-screen POSITION on Parts Velocity and Technician Utilization (sixth/second, not leftmost). | Read as an implementation slip, not a product decision - no source asks for anything other than leftmost, so there is nothing for him to choose. Dev ticket. | the 10-row sheet |
| The Work In Progress Estimates figure showing zero, and "Inv. Hrs" being shown but not downloadable. | Defects. Dev tickets, not PO questions. | the 10-row sheet |
| The QA branch being non-final, and fresh sign-in credentials. | Not Chris's to give - the QA lead's / engineering's. Every observation on this sheet is PROVISIONAL until the branch is declared final (Standing Rule 49); the re-check queue is OPEN. | the 10-row sheet |
| The 5 automated cases in our Report Suite folder authored by Vladimir Tomovic (C38919-C38923). | Not a Chris question, and by the QA lead's ruling 2026-07-31 we do not message Vladimir either. His cases stay untouched (Standing Rule 38) and are excluded from our counts - we report "ours 475 / live 480". One of them (C38923) was RIGHT and exposed a real gap on our side, which we fixed on our own cases. | the 17-item sheet |
| The Technician Utilization column-selector story has no Jira ticket. | Ticket-management, not a product decision - he already asked for the control in his 2026-07-29 message ("for visual/natural conformance"), so scope is settled. TU-COL-01 (C38859) and TU-LOC-06 (C38915) cite epic SV-8582 and say so in refs. Tracked in OUTSTANDING-ITEMS-REGISTER.md as an OTHER TEAM item. | the 17-item sheet |
| SV-8780 (the built dedicated Sales By Customer permission). | OUT OF SCOPE by the QA lead's ruling 2026-08-03, verbatim: "Ignore this ticket." Not commented on, not transitioned, not read-and-edited. The drafted comment is retained unposted and banner-marked NOT TO BE POSTED. | the 17-item sheet |
| Four requirements we deliberately do not test (SBC S10-N1, SBR S11-N1, SBR S14-R14, PV S4-N1). | QA decisions, not product ones - cut by the user-authorized 2026-07-28 Ruthless Usefulness Audit as no-op assertions, un-measurable px font-tier minutiae, and a stored-schema state a manual tester cannot seed. Recorded with reasons in coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md section 5. | the 17-item sheet |
| The QA branch / environment and fresh login cookies. | Not Chris's to give - this is the VIU blocker and it sits with the QA lead / engineering. All 475 cases remain VIU-Pending until it exists (Standing Rules 12/22). | the 17-item sheet |

## Live evidence behind Tab 1's "what happens now" text

| Observation | What was seen | Evidence |
|---|---|---|
| Work In Progress, every location in view | Headers: WO # / Status / Customer / Asset / Advisor / Days Open / Earned / Remaining / Total. NO Location column. Location IS listed in the Column Selection panel. | `evidence/location-behaviour.json; evidence/work-in-progress-selector.png` |
| Work In Progress, one location in view | Identical headers - still no Location column. | `evidence/location-single-vs-multi.json; evidence/wip-ONE-location-screen.png` |
| Inventory Value, every location in view | Headers: Part # / Description / Category / Vendor / LOCATION / Qty / Unit Cost / Unit Sell / Margin / Margin % / Total Sell / Total Cost. Location present, and ALSO offered in the Column Selection panel. | `evidence/location-behaviour.json; evidence/inventory-value-selector.png` |
| Inventory Value, ONE location in view (the deviation) | Location filter reads 'Staging Lethbridge - 4310' (single) yet the Location column is STILL shown, every row repeating 'Staging Lethbridge - 4310'. Reproduced twice. | `evidence/location-single-vs-multi.json; evidence/iv-ONE-location-screen.png` |
| Build marker (Standing Rule 49 - branch declared NOT FINAL) | v3.4.1-0ed4433 on sv8582.qa.shopview.com; index.html last-modified Mon, 03 Aug 2026 13:40:38 GMT, etag 02091e9dc11f187d7739b4efa166ea21 - byte-identical to the 2026-08-03 marker, so the build has not moved. All observations PROVISIONAL. | `../viu-2026-08-03/RECHECK-QUEUE.md` |

## Honesty notes

- Nothing here is rewritten. Every reader-facing row is the row its source sheet carried, emitted from that sheet's own generator, so the wording cannot drift in transit. The only text changes are the ones enumerated in the change log above.
- Standing Rule 49: the QA branch was declared NOT FINAL, so every build observation quoted on these tabs is PROVISIONAL and carries the build marker v3.4.1-0ed4433; the re-check queue viu-2026-08-03/RECHECK-QUEUE.md is OPEN.
- The Column Selection panel's per-item on/off state could not be read reliably by automation, so the "starts switched off" claim on Work In Progress rests on the column's absence from the grid plus the 2026-08-03 pass's own observation. The presence or absence of the column - which is what Tab 1's question turns on - is solid.
- Rule 37: the epic had a Tier-1 currency check only. A full re-read was not authorised for this pass and is not claimed.

---

## OUTSTANDING - what I need from you

Cross-project register: `build/OUTSTANDING-ITEMS-REGISTER.md` (Standing Rule 36).

**From you (QA lead):**

1. **Send this ONE workbook to Chris** - it replaces all three earlier sheets, and the three are banner-marked SUPERSEDED so an old one cannot go out by mistake. Tab 1 is the one that is needed today: the automated versions of those tests are being written now and eight checks are frozen until he answers.
2. **Nothing here is authorised to be applied.** No case has been edited, no TestRail write has been staged from this workbook, and the three source sheets' staged edits stay staged (Standing Rule 6). This pass was read-only on cases, specs and TestRail.
3. **The QA branch is still not final.** Engineering said so, so every build observation quoted here is provisional and the re-check queue is OPEN. Tell us when it is declared done and we re-run the queue immediately.

**From Chris:** the one urgent answer on Tab 1, 7 decisions on Tab 2 plus a tick against its write-down item, and 5 decisions on Tab 3 plus a tick against each of its 9 write-down items. Nothing at all is needed for Tab 2's last item - it is there so he is not surprised by it later.

**Nothing else is outstanding from this workbook.**


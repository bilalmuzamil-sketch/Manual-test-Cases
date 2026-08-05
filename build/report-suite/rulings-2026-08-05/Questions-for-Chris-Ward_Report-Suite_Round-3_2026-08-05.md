# Questions for Chris Ward — Report Suite — round 3 — 2026-08-05

**Project: Report Suite (the six reports) · epic SV-8582 · Product Owner: Chris Ward**

**This is the plain-language twin of `Questions-for-Chris-Ward_Report-Suite_Round-3_2026-08-05.xlsx`.**
The spreadsheet is the version to send; it mirrors the 2026-08-04 and 2026-08-05 sheets' format
exactly, and it carries a QA-only tab that must not be forwarded.

**DRAFT — NOT SENT. Nothing has been written to TestRail or Jira.**

Thank you - you have had a very heavy day on these: fifteen answers, and then you went and updated all six written descriptions on top of that. Almost everything we were waiting on is now settled, and this sheet is much shorter than the last one because of it. Nothing here is a complaint. Most of it is simply "please finish the sentence you started" - you have already made the decision, and a few paragraphs further down the same documents still say the old thing. Every question says which project and which report it is about, because we know you look after more than one thing here.

**Thirteen questions in total, each one a plain A or B, plus two notes that need no answer.**

**Live source versions confirmed at 2026-08-05T16:56:26Z, immediately before writing** — Sales By
Customer **v14** · Sales By Representative **v16** · Parts Velocity **v5** · Technician Utilization
**v6** · Work In Progress **v7** · Inventory Value **v4**. Every sentence quoted below comes from
that fetch.

---

## Tab 1 — Finish the location column

PLEASE START HERE - this is the one group that is holding real work. You have already DECIDED this: your updates today say the location column belongs to anyone who can reach more than one branch, that they see it straight away, and that they can switch it off in the column list. The trouble is that four of the six documents still contain an older paragraph saying the opposite, and one report was not changed at all. We are not asking you to decide again - only to tell us which sentence to keep.

### Item 1.0 — Report Suite - the Sales By Customer report - the column list (the "show or hide columns" story for this report, under epic SV-8582)

**What happens now**

> You updated this document today and it now says the location column can be switched on and off in the column list.
>
> Further down, the same document still lists what is in that column list and says there are "exactly nine" switches - Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin % - and Location is not one of them. It also says the columns that are always on "do not appear in the toggle list", and it does not name Location as an exception either.
>
> So the two halves of the same document cannot both be true.
>
> Why we are asking: the tester has to count the switches in that list, and right now we cannot tell them whether to expect nine or ten.

**The question**

> When someone who can reach several branches opens the column list on this report, how many switches should be in it?

**Options**

> A) TEN - the nine you already list, plus Location. (This matches your update today; the "exactly nine" sentence is the leftover and can be corrected.)
>
> B) NINE - no Location switch. (Then the location column is not something a person can switch off, and your update today is the part that needs changing.)

**Your answer:** _______________________________________________

### Item 2.0 — Report Suite - the Sales By Representative report - the location column (the "column selector" story for this report, under epic SV-8582)

**What happens now**

> The top of this document, and your own note on today's update, both say the location column is for anyone who can reach more than one branch, that they see it by default, and that they can switch it off in the column list.
>
> Further down, the requirement itself still says the opposite: the column is shown "only when the current view spans more than one location" and "when the view is scoped to a single location the column is hidden" - in other words it comes and goes on its own, with nobody switching anything.
>
> The same document also says the column list holds "the seven toggleable metric columns" and names them, and Location is not among the seven.
>
> Why we are asking: these are two different tests, and we can only write one of them.

**The question**

> For this report, is the location column something a person switches on and off, or does it appear and disappear on its own?

**Options**

> A) A PERSON SWITCHES IT - anyone who can reach more than one branch sees it by default and can switch it off. (This matches the top of your document and today's note; the "only when the view spans more than one location" paragraph is the leftover.)
>
> B) IT APPEARS ON ITS OWN - only while more than one branch is being looked at, and it is never in the column list. (Then the top of the document is the part that needs changing.)

**Your answer:** _______________________________________________

### Item 3.0 — Report Suite - the Work In Progress report - the location column (the "show or hide columns" story for this report, under epic SV-8582)

**What happens now**

> This one is the clearest of the four, because both sentences are in the version you saved today, a few paragraphs apart.
>
> One says: the location column "is offered in the column selector to any user with access to more than one location; for that user it is shown by default and can be toggled on or off."
>
> The other says: the location column "is shown automatically whenever the current scope spans more than one location, and is hidden whenever a single location is in scope; the user does not toggle it in the column selector."
>
> Why we are asking: one of those two sentences is the leftover, and we would rather you told us which than have us guess and get it wrong in both directions.

**The question**

> For this report, can a person switch the location column off in the column list?

**Options**

> A) YES they can switch it off - the "user does not toggle it" sentence is the leftover.
>
> B) NO they cannot - it comes and goes on its own, and the "offered in the column selector" sentence is the leftover.

**Your answer:** _______________________________________________

### Item 4.0 — Report Suite - the Inventory Value report - the location column (the "show or hide columns" story for this report, under epic SV-8582)

**What happens now**

> The top of this document, and your note on today's update, both say the location column is shown by default to anyone who can reach more than one branch and "can be toggled off from the column selector".
>
> Further down, the requirement still says it "is shown only when the current scope spans more than one location" and that "it is not one of the columns offered in the column-selection control".
>
> Why we are asking: this is the same leftover as on the other two reports - one sentence, and then a whole group of our tests can come off hold.

**The question**

> For this report, is the location column offered in the column list?

**Options**

> A) YES it is offered, switched on to start with - the "not one of the columns offered" sentence is the leftover.
>
> B) NO it is not offered - it comes and goes on its own, and the top of the document is the part that needs changing.

**Your answer:** _______________________________________________

### Item 5.0 — Report Suite - the Parts Velocity report - the location column (the "choose which columns to show" story for this report, under epic SV-8582)

**What happens now**

> This is the one report you have not changed on this point at all - and we want to be careful, because you did save a new version of it today, so it is not that you missed it in an old document.
>
> It still says the location column "is auto-managed by the location scope", that it is "not one of the 20 columns in the picker", and that it "is not user-toggleable".
>
> That is now the odd one out: the other five reports have all moved to the version where a person can switch it off.
>
> Why we are asking: we do not want to change this report on the strength of what you decided for the others. If you meant it to be the same, say so and we will match it; if this report really is different, we will leave it exactly as it is and stop treating it as a leftover.

**The question**

> Should this report work the same way as the other five, or is it deliberately different?

**Options**

> A) THE SAME - a person who can reach more than one branch sees the location column and can switch it off, exactly as on the others. (Then this document has one paragraph left to update.)
>
> B) DELIBERATELY DIFFERENT - on this report the column comes and goes on its own and cannot be switched off. (Then nothing needs changing here and we will note it as intended.)

**Your answer:** _______________________________________________


---

## Tab 2 — Carried over from last sheet

Five questions from the last sheet that your updates today did not touch. None of them is urgent.

### Item 1.0 — Report Suite - the Parts Velocity and Technician Utilization reports - downloads (the download stories on those two reports, under epic SV-8582)

**What happens now**

> For Sales By Representative and for Inventory Value your descriptions say exactly where the line naming the branches sits: in the header area of a printable document, and as one of the short summary lines above the column headings in a spreadsheet.
>
> Parts Velocity and Technician Utilization do not say.
>
> Why we are asking: the tester has to be told where to look, and we would rather not invent a position for it.

**The question**

> Should those two reports put that line in the same places as the others?

**Options**

> A) YES - the same as the other reports: the header area of a printable document, and a summary line above the column headings in a spreadsheet.
>
> B) NO - please say where it should go.

**Your answer:** _______________________________________________

### Item 2.0 — Report Suite - all six reports - anything on screen naming the branches (the branch-filter stories on each report, under epic SV-8582)

**What happens now**

> Our tests used to tell the tester to look for something on the page naming the branches currently being shown - separate from the branch chooser itself.
>
> We searched all six of your descriptions for it and found no mention of such a thing anywhere. So we have taken it out of the tests rather than leave a tester hunting for something that may never have been meant to exist. We would rather tell you that plainly than quietly leave it in.
>
> Why we are asking: if it should be there, we need to put it back and it is a developer job. If not, we have already done the right thing and you can simply confirm it.

**The question**

> Should there be something on the page naming the branches you are looking at, beyond the branch chooser itself?

**Options**

> A) NO - the branch chooser already shows it. Nothing else is needed, and removing it was correct.
>
> B) YES - please say what it should say and where it should sit.

**Your answer:** _______________________________________________

### Item 3.0 — Report Suite - the Sales By Customer report - downloaded file names (the download story for this report, under epic SV-8582)

**What happens now**

> Your update today changed the date list to nine choices and removed Today and Yesterday.
>
> Another part of the same document still explains what a downloaded file should be called for a Today range and for a Yesterday range.
>
> Why we are asking: it is almost certainly just a leftover, but we do not want to delete something from a test on our own guess.

**The question**

> Can that leftover be removed, or are Today and Yesterday still meant to exist somewhere?

**Options**

> A) REMOVE IT - Today and Yesterday are gone for good.
>
> B) THEY STILL EXIST somewhere - please say where.

**Your answer:** _______________________________________________

### Item 4.0 — Report Suite - the Technician Utilization report - the column button (the "show or hide columns" story for this report, under epic SV-8582)

**What happens now**

> Your description says that hovering over the column button shows the words "Column Selection".
>
> It does not say what someone using a screen reader should hear when they land on that button.
>
> Why we are asking: a screen reader has to read out something, and if we make the words up the test is only checking our own invention.

**The question**

> Should a screen reader read out the same words, "Column Selection"?

**Options**

> A) YES - the same words.
>
> B) Something else - please say what.

**Your answer:** _______________________________________________

### Item 5.0 — Report Suite - the Technician Utilization report - spreadsheet downloads (the download story for this report, under epic SV-8582)

**What happens now**

> Following your answer about this report's download menu, we wrote a test for two different spreadsheet downloads - a short one and a full one.
>
> The product currently offers only one spreadsheet, and your description does not mention a second.
>
> Why we are asking: if there should only ever be one, we will delete the test rather than leave it sitting there unused.

**The question**

> Should this report offer two spreadsheet downloads, or only one?

**Options**

> A) ONE is correct - we will delete the extra test.
>
> B) TWO - please say what each one should contain.

**Your answer:** _______________________________________________


---

## Tab 3 — Still holding tests

Three questions, each of which frees a parked test the moment you answer it. The first two have been
asked twice before and we are only repeating them because a test is genuinely stuck.

### Item 1.0 — Report Suite - the Sales By Customer report - where it sits in the menu (the "where the report lives and who can open it" story, under epic SV-8582)

**What happens now**

> This is the third time we have put this one in front of you, and we are only repeating it because a test is genuinely stuck on it - it is not a nag.
>
> We need to know which menu group this report belongs in. Our notes from the product show it under a group named SALES; your description says Performance. We cannot tell which one is meant to be right, so we cannot tell whether the product is wrong or our test is.
>
> Why we are asking: one word from you and the test is either correct as written or reworded in a minute.

**The question**

> Which menu group should this report appear in?

**Options**

> A) Performance - below the links that were already there.
>
> B) Sales - below the links that were already there.
>
> C) Somewhere else - please say where.

**Your answer:** _______________________________________________

### Item 2.0 — Report Suite - the Sales By Representative report - the word on screen (the sales-representative stories for this report, under epic SV-8582)

**What happens now**

> You confirmed that the full word "Representative" is right in the downloaded files, and we have matched our tests to it.
>
> Two tests are still parked because they are about the word on the SCREEN and on the customer's record, not in the files. You were only asked about the files at the time, and we did not want to stretch your answer to cover screens you had not been shown.
>
> Why we are asking: two tests come unparked the moment you answer, whichever way you answer.

**The question**

> Should the full word "Representative" also be used on the screen and on the customer's record?

**Options**

> A) YES - the full word everywhere it appears, not only in the downloaded files.
>
> B) NO - only the downloaded files matter; the screen can stay as it is.

**Your answer:** _______________________________________________

### Item 3.0 — Report Suite - the date chooser - all six reports share it (the date-range stories on each report, under epic SV-8582)

**What happens now**

> Your update today set the date list to nine choices, with "Last 12 Months" first, and said there is no Today, no Yesterday and nothing called Custom.
>
> When we tried the reports, the two you removed still work, and the new first choice - Last 12 Months - is refused. So the product looks like it is still on the old list.
>
> We have NOT raised this as a fault yet, for one honest reason: the new list is only hours old, and we would rather check that it is what you intend before asking anyone to build it.
>
> Why we are asking: this one chooser is shared by all six reports, so it decides the wording of six tests.

**The question**

> Is the nine-choice list you wrote today - starting with Last 12 Months, and with no Today, Yesterday or Custom - what you want built?

**Options**

> A) YES - that is the intended list. We will write the tests to it and raise the difference with the developers.
>
> B) NO - please say what the list should be.

**Your answer:** _______________________________________________


### And two notes that need no answer

> NO ANSWER NEEDED - two notes for when you are next in the descriptions. FIRST: the Technician Utilization description is now correct about the location column in its requirements, so it is not on the list above - but three sentences elsewhere in it still describe the old behaviour ("hidden when a single location is in scope"). Nothing is blocked by it; it is just untidy, and a reader of only those sentences would test the wrong thing. SECOND: the seven small wording tidy-ups from the last sheet are still open and still holding nothing up - where the Technician Utilization report sits in the menu; the machine chooser on Work In Progress; the line calling Parts Velocity the only report in its group; the line saying the Escape key closes the deactivate pop-up; the download size limit missing from three descriptions; a short note that the vehicle-number field also holds serial numbers for things that are not vehicles; and some garbled characters in two descriptions. Tell us if you would like us to keep listing those or to stop.

> THINGS WE DELIBERATELY DID NOT ASK YOU, because you have already answered them. Your updates today settled four things we had queued up, and we would rather show you that than have you wonder why they vanished. (1) The logo rule: the ShopView logo stands in only when a logo has been uploaded but will not load, and when no logo has been uploaded at all no logo is printed and the text fills the space - now written into the description, so we have stopped citing your message and cite the description instead. (2) One reports permission for all six reports, not a separate permission per report. (3) On the Sales By Customer report, a person who can only reach one branch never sees Location and it never appears in their column list - that answers a question we had open. (4) On the same report, whether a person who can reach several branches but is looking at only one still gets the column - your update says yes, "regardless of how many locations are currently selected". Thank you: that was the single hardest one and it is now closed.

---

## QA-only — not for Chris

The internal question-to-case mapping lives on the spreadsheet's `QA internal - not for Chris` tab: every question's
affected TestRail case IDs with links, the requirement anchors quoted verbatim from the live pages,
and what each possible answer resolves to. It also records the source-currency block, the
case-count arithmetic (**440 now → 456 on Tab 1 alone**), why Technician Utilization is deliberately
NOT on Tab 1, and the three cases we found are on hold **wrongly** and therefore did not ask about.

**Do not forward that tab.**

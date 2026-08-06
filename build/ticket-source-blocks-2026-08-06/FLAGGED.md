# FLAGGED — the tickets whose expectation could NOT be sourced, and the ones only PARTLY sourced

**For the QA lead.** His instruction: *"Any ticket which do not have any source you need to give them to
me and i need to see what we can do with them"*. This file is that list. **Nothing here had a source
invented for it.** Where a document did not support the expectation, the ticket now says so in its own
closing block, in plain words.

**Headline: of the 65 tickets, 2 have NO documented source and 5 more are only PARTLY supported. The
other 58 are cleanly sourced.**

---

# PART ONE — NO DOCUMENTED SOURCE (2 tickets)

## 1 · SV-8821 — Creating an invoice from a completed work order fails with a server error

**Ticket:** https://shopview.atlassian.net/browse/SV-8821
**Status:** OBSOLETE (already closed) · **Priority:** Low · Bug · parent SV-8582

**What it claims should happen.** When somebody tries to make an invoice for a work order that has no
contact person on it, the system should refuse clearly and say the contact is missing.

**What the build actually does.** It answers with a general server error, which reads as something being
broken rather than something being missing.

**Exactly where I looked and found nothing.** All six report specifications, read live today: Sales By
Customer v15, Sales By Representative v17, Parts Velocity v5, Technician Utilization v6, Work In Progress
v9, Inventory Value v4. None of them covers invoicing at all — invoicing is not a reporting feature. I
also read the epic SV-8582 and the two foundation stories nearest this ground, SV-8591 (the export
contract) and SV-8592 (the invoice financial columns and clock summary), and neither says what answer the
system should give when a required piece of information is absent. Chris Ward's answer workbook was
searched across all three tabs and its 24 items — there is no item about invoicing.

**What the expectation actually rests on.** Consistency with the answers the product already gives
elsewhere — it does say *"Work order is not complete."* and *"Line can`t be completed with unfulfilled
part requests."* for other missing prerequisites — plus the general principle that missing information
should produce a clear refusal rather than a server error. **That is our reading, not a written rule.**

**Do any of our test cases depend on it?** **No.** Nothing in the Report Suite, Schedule or Filters case
source names SV-8821, so nothing needs revisiting whatever you decide.

**Recommendation: (c) KEEP IT, with the block stating plainly that the specification is silent.** A server
error on an ordinary user action is self-evidently wrong regardless of documentation, and this one is
reachable from the product's own screen — which is exactly why it was kept when its sibling SV-8822 was
withdrawn. It is already closed, so keeping it costs nothing and the record is now honest about its basis.

---

## 2 · SV-8822 — Saving a customer returns a server error instead of a validation error

**Ticket:** https://shopview.atlassian.net/browse/SV-8822
**Status:** OBSOLETE (already withdrawn) · **Priority:** Low · Bug · no parent

**What it claims should happen.** When a customer is saved with a field the system does not recognise, it
should answer with a validation message explaining what is wrong.

**What the build actually does.** It answers with a server error.

**Exactly where I looked and found nothing.** The same eight specifications and the same epic stories as
above. None of them describes customer saving — it is not a reporting feature. Chris Ward's workbook has
no item about it either. **The ticket itself already said this when it was filed**, in its own words:
*"No written requirement covers this — stating that plainly rather than dressing it up."* That honesty is
to its credit and it is preserved.

**What the expectation actually rests on.** A general robustness expectation. Nothing more.

**Do any of our test cases depend on it?** **No** — no case names SV-8822.

**Recommendation: (a) LEAVE IT WITHDRAWN — no action needed.** It is already OBSOLETE, and it was
withdrawn for a separate and sufficient reason: the fault can only be reached by sending the save request
directly in a shape the product's own screens never produce, so no customer and no manual tester can ever
see it (Standing Rule 51). Its unsourceability simply confirms the withdrawal was right. The block records
both facts.

---

# PART TWO — SOURCED, BUT THE SOURCE SUPPORTS ONLY PART OF THE EXPECTATION (5 tickets)

These are **not** unsourceable and none needs withdrawing. They are listed because you should see exactly
which half rests on a document and which half does not. Each block on the ticket says the same thing.

## 3 · SV-8848 — Every time on the Schedule reads six hours later than it should

**Ticket:** https://shopview.atlassian.net/browse/SV-8848 · **Open** · Low · Bug

**Supported.** Schedule specification v23 **section 4.2**: *"Every shift has a start time. It is derived
from a hierarchy: The technician's configured working hours take precedence."* The technician in the steps
works 7:00 AM to 7:00 PM, so 1:00 PM is wrong. And **section 4.8**: *"Now line. A vertical indicator
showing the current time."*

**NOT supported.** The specification contains **no time-zone rule of any kind** — I searched it for
*timezone*, *time zone*, *local*, *UTC* and *wall clock* and there are zero occurrences. So the phrase in
the ticket about the board showing "shop-local times" is not a quoted requirement; what is written down is
that the start time follows the technician's hours and the marker shows the current time.

**Why it still stands as a defect:** a 7:00 AM job reading 1:00 PM breaks the hours hierarchy whichever
clock you think is correct.

**Cases that depend on it:** SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865)
carries `EXPECT FAIL (SV-8848)`; SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969)
and SCH-START-04 = [C29972](https://shopview.testrail.io/index.php?/cases/view/29972) mention it as a known
issue. None needs changing unless you decide the board is right and the ticket is wrong.

**Who can close the gap:** Branko, with one sentence about which clock the Schedule shows.

## 4 · SV-8924 — Assigning an unassigned job moves its start time six hours earlier

**Ticket:** https://shopview.atlassian.net/browse/SV-8924 · **Open** · Low · Story Defect · parent SV-8688

**Supported.** Schedule v23 **section 3.2**: *"Dragging a shift from this row down onto a technician assigns
it."* And **section 4.2**: *"When an unassigned shift is later dragged onto a technician row in the grid,
that technician's hours apply."*

**NOT supported.** The ticket's expectation says the start time should be *"left exactly as it was"*. The
specification says the opposite thing in a mild way — the technician's hours apply, so a change on
assignment is contemplated. **Our wording is stricter than the written rule.**

**Why it still stands:** the job landed at 1:00 in the morning and the technician starts at 7:00 in the
morning, so the result is neither the time it had nor that technician's hours. It fails either reading.

**Cases that depend on it:** SCH-START-07 = [C29975](https://shopview.testrail.io/index.php?/cases/view/29975)
carries `EXPECT FAIL (SV-8924)`.

**Who can close the gap:** nobody needs to — but if a developer pushes back on the word *"unchanged"*, the
correct expectation is *"the technician's hours apply"*, and the block says so.

## 5 · SV-8933 — Working hours cannot be opened for a staff member from another location

**Ticket:** https://shopview.atlassian.net/browse/SV-8933 · **Open** · Low · Story Defect · parent SV-8699

**Supported.** Schedule v23 **section 4.2**, Hours settings: *"Each section sits behind a toggle (“Set
custom hours for this technician” …). The per-day editor appears only when the toggle is on."* Story
**SV-8699** repeats it in its own requirements. Neither places any condition on which location the person
is viewed from.

**NOT supported.** Neither the specification nor the story says whether working hours are meant to be held
**per location**. It is silent. So the source settles that the toggle must reveal the editor; it does not
settle whether a person from another location should be reachable in that list at all.

**What the expectation actually rests on for that half:** our inference that a screen which offers you a
person should then let you edit them, or explain why not.

**Cases that depend on it:** **none** — no case names SV-8933.

**Recommendation:** keep it, and note that if hours really are per-location the right fix is a clear
message rather than an error. **The block says exactly that.** **Who can close it: Branko.**

## 6 · SV-8818 — PDF download fails with a server error on 5 of the 6 reports

**Ticket:** https://shopview.atlassian.net/browse/SV-8818 · **Ready to Fix** · Low · Bug

**Supported.** Four separate requirements, now named in the block: Inventory Value v4 **S10-R12** (the
10,000-row cap and the exact message shown above it) and **S10-R14** (the failure message); Sales By
Customer v15 **S15-R25** (the same cap for PDFs); Parts Velocity v5 **S6-N1** (*"If an export fails, an
error toast is shown."*); Technician Utilization v6 **Story 7 Error Handling** (*"Failed to download
report"*).

**PARTLY supported.** **Parts Velocity, Technician Utilization and Work In Progress carry no export size
cap at all** — I checked all six specifications for *10,000*, *10k* and *too large to export*: it is present
in Sales By Customer, Sales By Representative and Inventory Value, and absent from the other three. So for
those three reports the source is only the failure-message requirement, not a cap. **This also corrects a
line in our own earlier records which said none of the six specifications mentions the cap — three of them
do.**

**Also worth your eye:** the ticket quoted the Inventory Value description at **version 3**; it is now at
**version 4**, and both requirements carry over unchanged. The block names version 4.

**Cases that depend on it:** ten, all carrying `EXPECT FAIL (SV-8818)` —
SBC-API-05 = [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) ·
SBC-EXP-14 = [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) ·
SBR-EXP-15 = [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) ·
SBR-API-05 = [C30320](https://shopview.testrail.io/index.php?/cases/view/30320) ·
PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) ·
PV-EXP-12 = [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) ·
TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) ·
IV-EXP-07 = [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) ·
IV-EXP-09 = [C30595](https://shopview.testrail.io/index.php?/cases/view/30595) ·
IV-EXP-10 = [C43548](https://shopview.testrail.io/index.php?/cases/view/43548).
**None needs revisiting** — the ticket stands and is already Ready to Fix.

## 7 · SV-8881 — Technician Utilization download menu drops the word "Download"

**Ticket:** https://shopview.atlassian.net/browse/SV-8881 · **Open** · Low · Bug

**Supported — the wording, twice over.** Technician Utilization v6 **S7-R2/R3/R4** write each label out in
full, every one beginning *"Download"*. And Chris Ward chose the longer wording on 5 August 2026, in the
questions spreadsheet — tab *"The product vs your write-up"*, **row 11 (question 6.0), cell F11**:
*"B) is correct here. Consistency is key."*

**NOT supported — how many options there should be.** The description names **three** options; the product
ships **four**. His answer settles the wording and says nothing about the count. The block says the count
is still his to confirm.

**Also corrected in the block:** the ticket cited *Sales By Customer S15-R1/S15-R2* — those numbers do not
exist in the Technician Utilization specification, and its own S7-R2/R3/R4 are the governing requirements.
The ticket also quoted the CSV label as *"Download (CSV)"* where v6 reads *"Download Summary (CSV)"*.

**Cases that depend on it:** none carries `EXPECT FAIL (SV-8881)`; TU-EXP references point at it as a known
issue only.

**Who can close the gap:** Chris Ward, with one word on the option count.

---

# PART THREE — one ticket where the product owner OVERRIDES the specification (not a gap, but you should see it)

## SV-8879 — the location chooser shown to a single-location user

**Ticket:** https://shopview.atlassian.net/browse/SV-8879 · **Open** · Low · Bug

This one is **fully sourced**, as a **type 3** product owner answer — tab *"The product vs your write-up"*,
**row 6 (question 1.0), cell F6**, where Chris Ward answered *"B) (answered in sheet: "Urgent - Location
column")"*, option B being *"Change the product to match your ruling - hide it."*

**It is flagged only because his answer differs from the written descriptions rather than agreeing with
them.** Four of the six still say the opposite — for example Parts Velocity: *"A user with access to only
one location still sees the Location filter with a single selectable location; behavior is unchanged from
single-location use."* **The block says this plainly** rather than implying the specifications agree, and
records that he accepted those four lines still need correcting. That is Standing Rule 54's honesty half
and Standing Rule 56's disclosure duty.

---

# What I did NOT do

**No source was invented, stretched, or borrowed from a vaguely-related requirement.** Where the nearest
requirement supported only part of the expectation, the block names the part it supports and states the
part it does not — SV-8937's existing block is the model and the five entries in Part Two follow it.

**Nothing was withdrawn, reopened, re-prioritised or re-typed.** Every recommendation above is yours to
make. The only change made to any ticket was the appended block.

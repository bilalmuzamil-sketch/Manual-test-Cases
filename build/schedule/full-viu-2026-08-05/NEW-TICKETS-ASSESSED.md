# Six new tickets from other people, assessed — 2026-08-06

**Rule 38 was respected absolutely: not one of these tickets was touched.** Rule 45(e) is respected too —
every "covered" or "not covered" verdict below quotes **both texts side by side**, because a verdict that
names only case ids is unfalsifiable and therefore untested by anyone.

**Nothing was authored.** Two of these are candidate coverage gaps and they need the QA lead's
authorisation before a case is written.

---

## 1. [SV-8915](https://shopview.atlassian.net/browse/SV-8915) — "view opens at midnight instead of the first business hour"

*Sasha Grosman · Bug · High · parent SV-8685 · Open*

**Does our case contradict a documented decision? NO — and this is the question the coordinator asked.**

**What the ticket says**, verbatim: *"Schedule view loads with the viewport anchored at midnight."* and it
sets out an expected hierarchy: *"Open at the first hour of configured business hours. If business hours
are not set, default to 7:00am (per Cody's recommendation). If a shift exists earlier than the start of
business hours, open at that shift's start time instead."*

**What our case says.** `SCH-DAY-01` = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)
asserts, from Schedule specification v23 §4.8: *"On initial day-view load and when navigating to a new
day, the timeline auto-scrolls so the working-day start sits at the left edge of the visible area (with a
small 30 to 60 minute buffer before it)."*

**Side by side, the PRIMARY rule is the SAME** — open at the start of the working day. **We do not
contradict it.** What SV-8915 adds is **two fallbacks the specification does not state**: a 7:00am default
when no business hours are set, and deferring to an earlier shift's start. Those are new product
behaviour, not a correction to ours.

**Re-driven live on `v3.5-7ec992f`:** the fault reproduces — the day axis opens with **12 AM at the left
edge (x 524)** while the working day starts at **06:00 (x 813)**, and stepping a day leaves it at midnight.
Our case keeps its DEVIATION and its expect-fail marker names **SV-8837**, which is the older ticket for
the same fault and is still Open.

**What is owed:** nothing on our case. If the QA lead wants the **two fallbacks** covered they are new
assertions and would need one case each — and the second fallback (*"if a shift exists earlier… open at
that shift's start"*) genuinely conflicts with the specification's own buffer wording, so it is a **PO
question before it is a test case** (Rule 57).

---

## 2. [SV-8916](https://shopview.atlassian.net/browse/SV-8916) — "'Add Existing Work Order' button missing from build"

*Sasha Grosman · Bug · Medium · parent SV-8685 · Open*

**This is a genuine CANDIDATE COVERAGE GAP. We have no counterpart among the 168.**

**What the ticket says**, verbatim: *"The 'Add Existing Work Order' button is present in the Schedule
design but is not present in the QA build."*

**What we have.** Searched all 168 for the phrase and for the behaviour: **zero cases mention "Add
Existing Work Order"**, and no case asserts any control that adds an already-existing work order to the
board from the grid side. The nearest neighbours are the sidebar drag cases
(`SCH-DND-01`…`SCH-DND-08`), which all begin from a card **already in the sidebar list**, and
`SCH-REAS-06` = [C38855](https://shopview.testrail.io/index.php?/cases/view/38855), whose assertion is
the **left-click menu contents**: *"Left-click on empty grid space opens a menu with: Create event, New
work order."* — **"New work order" creates a new one; it does not add an existing one.** Different
assertion, so it does not cover this.

**Honest limitation, and it is the reason we did not author anything.** The ticket's own source is a
**design**, not the specification: *"The 'Add Existing Work Order' button is present in the Schedule
design"*, and its next step is *"Confirm with Bronco whether the button was descoped during build or never
scoped."* Under Rule 57 an expectation that rests only on a design and is not in the specification is a
**question for the product owner, not a case**. We searched Schedule specification v23 and **found no
requirement for such a button**.

**What is owed:** the QA lead's ruling. If Branko confirms it is in scope it becomes one new case; if he
confirms the descope it becomes a decisions-register entry.

---

## 3. [SV-8917](https://shopview.atlassian.net/browse/SV-8917) — conflict label reads "working hours" instead of "business hours"

*Sasha Grosman · Bug · Low · parent SV-8685 · Open*

**Confirmed live, and we have a case that will now catch it.**

**What the ticket says**, verbatim: *"The schedule conflict label reads 'extended beyond working hours'.
The rest of the product uses the term 'business hours', so the wording is inconsistent."*

**What we observed**, on `v3.5-7ec992f`, in the shift modal and the hover tooltip: the labels read
**"Extends past working hours (6:00 PM)"** and **"Starts before working hours (6:00 AM)"**. So the ticket
is right about the wording — and note the **6:00 PM in the label is the shop's BUSINESS-hours end**, which
is exactly why the word is wrong.

**Coverage, both texts.** `SCH-CONF-02` = [C30024](https://shopview.testrail.io/index.php?/cases/view/30024)
and its siblings assert the conflict **types and hierarchy**, not the label's exact noun. So the
inconsistency would **not** fail any of our cases today. **This is a copy-only defect and it is his to
carry** — we did not add an assertion for it, because doing so unasked would be authoring on someone
else's ticket.

**What is owed:** if the QA lead wants it locked down, one label assertion added to a conflict case. Small,
and it should wait for the fix so we do not write a case that must change twice.

---

## 4. [SV-8919](https://shopview.atlassian.net/browse/SV-8919) — Edit Line enforces "Max 5" technicians but Schedule allows 8

*Ayesha Khan · Story Defect · Medium · parent SV-8688 · Open*

**Not covered, and correctly not covered — it is a cross-screen inconsistency, and she has already asked
the right question on it.**

**What the ticket says**, verbatim: *"The Schedule lets any number of technicians be assigned to a line
(no cap), but the Work Order Edit Line modal enforces 'Technicians (Max 5).'"* and it closes with
*"Clarification Needed."*

**What we have.** `SCH-LINE-*` and `SCH-REAS-*` assert the Schedule side only. **No case of ours asserts a
technician cap at all**, in either direction — because Schedule specification v23 states none. Her ticket
says the same thing: it asks what the cap should be rather than asserting one.

**What is owed:** nothing from us until the clarification lands. **When it does, it is one case**, and
under Rule 57 it cannot be written before then.

---

## 5. [SV-8921](https://shopview.atlassian.net/browse/SV-8921) and 6. [SV-8922](https://shopview.atlassian.net/browse/SV-8922) — people on the grid who are not in Staff

*Ayesha Khan · SV-8921 Bug, Medium, **no parent** · SV-8922 Story Defect, Medium, parent SV-8686 · both Open*

**Independently corroborated, and by a much larger margin than either ticket states.**

**What SV-8922 says**, verbatim: *"At Staging Heavy Duty – 9919, Settings → Staff (filtered to Technician)
lists 11 technicians… The Schedule grid instead shows different people (e.g., Brittany Anderson, Colleen
Guerrero, William, Charles, Andrew, Wade, Mark, Boris, Alyssa Randall) — none of whom are in the Staff
list."*

**What we measured**, independently, while driving `SCH-PERM-10` = [C30083](https://shopview.testrail.io/index.php?/cases/view/30083):
of the **17 named people on the grid, 15 have no staff record at all**. Only *MQ Test Tech No* and *Ayesha
Khan AK* were found in the 68-row staff list. **Her number is understated, not overstated.**

**What OUR case asserts, and why it still PASSES.** C30083's two expected results are that a
department-assigned staff member appears as a row *"controlled by the department on the staff record, NOT
by role permission"*, and that *"The staff member without a department does not appear as a row."* Both
were proven: an **Admin-role** person with Service and Service/Parts departments appears under **both**
groups, and **10 active staff with no Heavy-Duty department appear on the grid zero times**. So the
department rule holds for everyone who has a record — **the phantom rows are a different fault, which is
hers.**

**Honest note on the limitation, and it is stated on the case:** because 15 of 17 grid people have no
record, the department correlation could only be tested against the two who do. That is a real limit on
our evidence, and it is SV-8922's fault rather than the case's.

**One observation for the QA lead, not an action:** **SV-8921 has no parent**. Under Standing Rule 52 every
ticket we create hangs off the epic. It is not ours, so **we did not reparent it** — flagging it only.

---

## Sasha Grosman's three tickets cite a design link — flagging the source, as asked

**SV-8915, SV-8916 and SV-8917 all close with the same source:**
`Design: https://claude.ai/design/p/d3cdcf5c-83df-45ea-ba75-7ddedb5124b5?file=Schedule.dc.html&via=share`,
each recorded as *"Raised in the Schedule design review with Fabian on 5 Aug 2026."*

**The design source appears to have MOVED, and that matters.** Our own recorded design pointer for this
project is a **different artefact** — the Claude prototype `Schedule.dc.html` ruled authoritative by
Branko (Q0) and ingested into `build/schedule/design-2026-07-27/`. Sasha's link is a **share URL to a
live, editable Claude design page**, not to the file we hold, and there is **no version or date on it** by
which we could tell whether the two agree.

**Consequences, stated rather than assumed:**

* **We cannot verify any of Sasha's three design-sourced claims against a design we hold.** SV-8917 we
  confirmed **from the build and the specification's own vocabulary**, so it stands on its own. **SV-8916
  we could not verify at all** — that button is in *his* design and in **no requirement of specification
  v23**.
* Under **Standing Rule 31** a design whose currency cannot be established is a **PARTIAL source**, and
  under **Rule 32** the newest authoritative product source wins — so **if his link is newer than our
  ingest, our design baseline is stale**, and the Rule-31 pre-flight for the next Schedule task should
  fetch it and diff.

**What is owed:** confirmation of which design artefact is canonical — Sasha's share link or our
`design-2026-07-27/` ingest — and, if his, a re-ingest and diff before any design-sourced case is written.

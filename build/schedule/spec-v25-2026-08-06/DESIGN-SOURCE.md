# Schedule — THE DESIGN-SOURCE QUESTION: what could and could not be established — 2026-08-06

> **The design was deliberately NOT fetched and NOT ingested.** The QA lead's authorisation is
> conditional — verbatim: **"Yes if Sasha's design is final."** **That condition is not established**
> (see §4), so the condition has not been met and no fetch was made. Everything below is established
> **from the three tickets and from the specification**, read live, read-only.
>
> Register row: `build/OUTSTANDING-ITEMS-REGISTER.md` **C3**. This document advances it; it does not
> clear it.

---

## 1. The problem, stated once

**Three Schedule tickets — [SV-8915](https://shopview.atlassian.net/browse/SV-8915),
[SV-8916](https://shopview.atlassian.net/browse/SV-8916),
[SV-8917](https://shopview.atlassian.net/browse/SV-8917) — all raised by Sasha Grosman on
2026-08-05, all close with the same source line:**

> *"Raised in the Schedule design review with Fabian on 5 Aug 2026."*
> *"Design: `https://claude.ai/design/p/d3cdcf5c-83df-45ea-ba75-7ddedb5124b5?file=Schedule.dc.html&via=share`"*

That is a **share URL to a live, editable design page carrying no version and no date.** It is **not**
the artefact we hold (`build/schedule/design-2026-07-27/`, the Claude prototype Branko ruled
authoritative at **Q0**), and **~48 of our Schedule labels were pinned from the artefact we hold**.

**We cannot tell whether the two are the same document.** A `claude.ai/design/p/<id>` share link
resolves to whatever that page contains **at the moment it is opened** — so even fetching it would
tell us what it says today, not whether it is final, and not what it said when our 27 July capture was
made. **That is a property of the link, not a gap in our effort**, and it is why the QA lead's
condition is the right one to insist on.

**Design source verdict under Rule 31: PARTIAL.** Exact shortfall, named as the rule requires:

> *We hold a design artefact with no version and no date; three tickets dated 2026-08-05 cite a
> different design URL, also with no version and no date; we cannot establish which is canonical, and
> ~48 of our on-screen labels derive from the one we hold.*

---

## 2. What the spec now settles about each of the three claims

The brief asked specifically whether any of the three is supported by a requirement in **v25**, and
whether **SV-8916's button** exists in **v24 or v25**. All three were checked against the live bodies
of **v23, v24 and v25**.

### SV-8915 — "view opens at midnight instead of the first business hour" → **ALREADY A SPEC REQUIREMENT, AND ALREADY COVERED. Closed as a duplicate.**

**This one is not design-only at all**, which is the opposite of what its `Design:` footer implies.
**v25 §4.8 states the hierarchy verbatim, and it has been there since before our ingest:**

> *"**Auto-scroll to business hours.** On initial day-view load and when navigating to a new day, the
> timeline auto-scrolls so the working-day start sits at the left edge of the visible area (with a
> small 30 to 60 minute buffer before it). The start time comes from the same hierarchy shifts use:
> **the earliest technician's configured start if tech hours are set, otherwise business hours,
> otherwise 7:00 AM.** If technicians have different start times, the earliest one is used so no
> shifts are off-screen. The auto-scroll fires only on load or day navigation; if the user scrolls
> manually, their position is not overridden. **The full 24-hour timeline remains intact and
> scrollable.**"*

**Our case already asserts it**, and both texts side by side (Rule 45(e)):

> **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** *"Day view
> auto-scrolls to the working-day start; manual scrolling stands"*, `custom_expected`: *"The start
> used is the earliest technician's configured start; if no tech hours are set, business hours;
> otherwise 7:00 AM - so no shifts sit off-screen to the left."*

**Branko closed it 2026-08-06T09:04:20Z**, verbatim: *"I linked the ticket which is already reported
by QA, closing this one."* → **OBSOLETE / Done.** The QA ticket it duplicates is
**[SV-8837](https://shopview.atlassian.net/browse/SV-8837)** *"Day view does not auto-scroll to the
working-day start"* (Mudassir Qamar, 2026-08-04, Ready for QA).

**VERDICT: covered · no case change · no coverage gap.** **One genuinely open sub-point, and it is a
PO question rather than a test case:** SV-8915's *"related change request"* — *"Schedule width should
render only business hours plus a small trailing buffer rather than the full 24 hours"* —
**directly contradicts v25's own sentence** *"The full 24-hour timeline remains intact and
scrollable."* Its own text says it is *"Tracked separately on the enhancements list"*, i.e. **not
V1**, so nothing is authored; it is recorded in `DELIBERATE-DECISIONS.md` entry 5 and raised as
**Q3**.

### SV-8916 — "'Add Existing Work Order' button missing from build" → **THE PO DISPUTES THE PREMISE. Nothing to author.**

**Checked as a literal string against all three spec bodies:**

| Probe | v23 | v24 | v25 |
|---|---|---|---|
| `Add Existing Work Order` | **absent** | **absent** | **absent** |
| `Add Existing` | absent | absent | absent |
| `Existing Work Order` | absent | absent | absent |

**So the answer to the brief's specific question is: no, the button does NOT appear in v24 or v25. It
appears in no version of the specification.**

**And the design half is now answered too — by the person who owns the design.** Branko Cicovic
commented on **2026-08-06T08:30:54Z**, verbatim:

> *"Hey there is no "Add Existing Work Order" in the design. Can you clarify where you found this?"*

The ticket is **Blocked**, awaiting Sasha's clarification.

**VERDICT: blocked — owner Sasha Grosman, then Branko.** **Nothing to author, and this is a
downgrade of the concern recorded in register row C4.** That row currently reads that SV-8916 *"has
NO counterpart among our 168 and only a DESIGN as its source"* — **which is now too generous to the
ticket**: the PO says the button is not in the design either, so it presently has **no established
source at all**. Under Rule 57 a case cannot be authored from a claim with no source, and under
Rule 6 nothing would be authored without go-ahead regardless. **If Sasha produces the frame that
shows the button, this becomes a real candidate coverage gap; until then it is a disputed claim.**

### SV-8917 — "conflict label reads 'working hours' instead of 'business hours'" → **NOT A REQUIREMENT CHANGE, BUT IT HAS SHIPPED AND IT STALES TWO OF OUR CASES' LABELS.**

**The specification does not specify these label strings at all.** §4.11's conflict table gives
*descriptions*, not on-screen text:

> *"**Before hours** — Shift starts before the working-day start."* · *"**After hours** — Shift
> extends past the working-day end."*

So SV-8917 asserts nothing the spec requires or forbids — it is a **copy-consistency** point, and
**our SCH-CONF-03 was right to hedge** (*"a reason sentence **in the spirit of** 'Starts before
working hours'"*).

**But it has been fixed and deployed.** Stefan Vukovic, **2026-08-06T13:03:11Z**, verbatim:

> *"Fixed and deployed to sv8685.qa. "Starts before working hours" → "Starts before business hours",
> and the same for "Extends past …". Both live in the one humanization map every surface reads, so the
> conflicts popover, the block's accessible name, the hover card and the shift modal all changed
> together. The wire codes are untouched and the server carries no copy of its own for these. Left as
> they were, deliberately: "Not a working day" (that names the DAY, not the hours), and the spread
> dialog's "this technician's working hours" messages — those mean the per-technician setting, which
> Settings → Staff also calls working hours."*

**This is corroborated by the build itself:** `index.html` last-modified **12:56:44 GMT**, six and a
half minutes before that comment, and the marker is now **`v3.5-d64ba62`** — a build none of our 168
verdicts was taken on.

**VERDICT: case needs extending (label layer only, Rule 9 / Rule 60(b)) — 2 cases.** Staged in
`PROPOSED-CHANGES.md` §3. **Honest limit: we have NOT seen the new labels on screen** — the
application is SSO-walled in this pass — so the proposed wording is **ticket-sourced, not
live-verified** (Rules 12/49), and the proposal says so on its face. His note also tells us **what
NOT to change**, which is why *"Not a working day"* stays exactly as our cases have it.

---

## 3. What this pass could NOT establish, stated plainly

1. **Whether the design Sasha cites is the same document as the one we hold.** Not knowable from a
   version-less share link, and not attempted (authorisation is conditional).
2. **Whether that design is FINAL.** This is the QA lead's own condition, and **only Sasha Grosman or
   Fabian can answer it.** Nothing in the three tickets, the spec, or the epic says.
3. **Whether any of our ~48 design-pinned labels has drifted.** This is the real exposure, and it
   cannot be measured without a diff against a design we can name and date.
4. **Whether the *"design is single source of truth"* instruction changes our source precedence.**
   See §4 — this is new information from today and it is a question, not a conclusion.

---

## 4. NEW TODAY, AND IT RAISES THE STAKES: two people said the DESIGN outranks the PRD

Recorded because it materially changes how much the PARTIAL design verdict matters — and because it is
**exactly the kind of instruction that must not be adopted silently** (Rules 32/33: a ruling is a
source, and its scope has to be established before it is applied).

**Branko Cicovic — the PO — on SV-8829, 2026-08-06T09:31:05Z, verbatim:**

> *"… **Please always check the design as it is single source of truth.**"*

**Stefan Vukovic — engineering — on SV-8874, 2026-08-06T08:15:35Z, verbatim:**

> *"Take a look at this one, **per design we show only shifts/events that are matching the search.
> This is a gap between PRD and design.**"*

**And the second one had teeth:** that comment led to Milos Vasic updating the PRD and closing the
ticket, and **Confluence v24 deleted the requirement 81 seconds later**. So on 6 August, **a design we
do not hold caused a requirement to be removed from the specification we do hold.**

**Why this is a question and not a new rule:**

- **Standing Rule 57 lists three sources of expected behaviour — the PRD, the epic's stories, and the
  PO's verified answers. A design is not on that list.** Our whole method treats designs as the source
  of **labels** (Rule 9) and of visual states, not of requirements.
- Branko's sentence, read at full strength, would **invert that** — and it was written in a comment
  about a badge, not as a considered process ruling. **We are not going to reinterpret the source
  hierarchy off one clause** (Rule 58: an ambiguous source is not resolved by inference).
- But if he means it literally, then **a design we cannot name, date or verify is the top authority on
  Schedule**, and our 168 cases rest on a PARTIAL source. **That is a decision for the QA lead**, and
  it is **Q4**.

**The practical consequence, either way: C3 has become more urgent, not less.** Until the design is
named, dated and confirmed final, **every design-pinned label in the Schedule suite is provisional** —
and that is now true on the PO's own account of where truth lives.

---

## 5. Summary table

| Ticket | Status (read live) | Supported by a requirement in v25? | Verdict for our suite |
|---|---|---|---|
| **SV-8915** | **OBSOLETE / Done** — Branko closed it as a duplicate of SV-8837 | **YES** — §4.8 states the hierarchy verbatim, and it predates our ingest | **covered** by SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001). No change. Its 24-hour-width change request contradicts v25 and is out of V1 → **Q3**. |
| **SV-8916** | **Blocked** — Branko: *"there is no 'Add Existing Work Order' in the design"* | **NO** — absent from v23, v24 **and** v25 | **blocked**, owner Sasha then Branko. **Nothing to author.** Register row C4 overstates it: the claim now has **no established source at all**. |
| **SV-8917** | **TESTING QA** — Stefan fixed and deployed at 12:56Z | **NO** — the spec specifies conflict *descriptions*, never the label strings | **case needs extending, label layer only** — 2 cases, staged in `PROPOSED-CHANGES.md` §3, **not live-verified**. |

---

## OUTSTANDING — what I need from you

| What is missing | Who owes it | What it blocks | Since |
|---|---|---|---|
| **Confirmation that Sasha's design is FINAL, and which artefact is canonical** — the QA lead's condition *"Yes if Sasha's design is final"* is still unmet, so no fetch and no diff has been made. | **Sasha Grosman / Fabian**, then us | The design source stays **PARTIAL**; **~48 design-pinned Schedule labels cannot be confirmed current**; SV-8916 cannot be resolved either way. | 2026-08-06 (register **C3**) |
| **A ruling on whether *"the design is single source of truth"* changes our source precedence** (Rule 57 lists PRD · stories · PO answers, and does not list designs). | **the QA lead**, with Branko | How we resolve any future PRD-vs-design gap — and it is not hypothetical: one such gap **removed a requirement from the PRD today**. | 2026-08-06 · **Q4** |
| **Sasha to say where he saw "Add Existing Work Order"** | **Sasha Grosman** | SV-8916 stays Blocked; a candidate coverage gap can be neither authored nor dismissed. | 2026-08-05 |

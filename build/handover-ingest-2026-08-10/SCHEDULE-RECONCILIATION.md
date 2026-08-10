# SCHEDULE RECONCILIATION — the 5 August design review vs our 168 active cases — 2026-08-10

**Document:** `af54d7ba-Schedule_scheduledesignreview20260805.md` — *"Schedule Feature — Design Review
Findings"*, Fabian / Sasha Weekly, Aug 5 2026.
**Our suite:** 168 active Schedule cases (195 bodies − 27 retired), TestRail group 4254.
**Spec:** Confluence **713031682**, fetched live 2026-08-10, `lastModified` Aug 07 2026.

**READ-ONLY. Nothing changed in TestRail, nothing changed in Jira, no ticket created (Rule 62).**

---

## Totals (Rule 43)

| Verdict | Count |
|---|---|
| Covered by case(s) — both texts quoted | **4** |
| **Case needs changing** | **3** |
| New case needed (proposed, not authored) | **3** |
| Not testable — reason given | **8** |
| **Conflicts with the PRD — raised, NOT resolved** | **3** |
| **Total testable statements extracted** | **21** |

4 + 3 + 3 + 8 + 3 = **21**. ✔ (3 bugs + 18 enhancement rows = 21 rows in the document; **E10 and E11 are
counted separately** because they assert different things — Rule 45(e).)

---

## THE HEADLINE

> **The good news is real: this document gives us a WRITTEN SOURCE for expectations we previously had
> none for, and it corroborates a defect we already carry.**
>
> **The finding that matters is B5.** Two of our cases — `SCH-MODAL-07` =
> [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) and `SCH-CONF-03` =
> [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) — quote the conflict label as
> *"Starts before working hours"* / *"Extends past working hours"*.
> **[SV-8917](https://shopview.atlassian.net/browse/SV-8917) says it should read "business hours".**
> **But the specification's own model says those are two DIFFERENT things** — a technician's working
> hours take precedence over the shop's business hours — **so the ticket's fix, applied literally, would
> make the label wrong for any technician with custom hours.** That is a conflict to raise, not to
> resolve, and it is the sharpest thing in this document.
>
> **And the two biggest design-review items — the "Add Existing Work Order" button and the carryover
> action — appear in NO version of the specification** (v23, v24, v25 and live: **zero occurrences of
> either string**). Neither may be authored against.

---

## Section A — the three filed bugs

### B1 · Grid opens at midnight instead of the first business hour

> **Verbatim:** *"The schedule grid renders starting at 00:00, forcing every user to scroll right before
> they can see or do anything. **Expected: open at the first hour of business hours; fall back to 7:00am
> when business hours are unset (per Cody's recommendation); if a shift exists earlier than business hours,
> open at that shift's time.**"* — [SV-8915](https://shopview.atlassian.net/browse/SV-8915), High, Regression.

**VERDICT: COVERED — `SCH-DAY-01` = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001).**

| The review's expectation | Our case's `expected`, verbatim |
|---|---|
| *"open at the first hour of business hours; fall back to 7:00am when business hours are unset"* | *"1. On load and on each day navigation, the timeline is auto-scrolled so the working-day start sits at the left edge of the visible area, with a small buffer (roughly 30 to 60 minutes) before it. 2. The start used is the earliest technician's configured start; if no tech hours are set, business hours; otherwise 7:00 AM - so no shifts sit off-screen to the left."* |

**And the case is already marked to fail:** `AUTOMATION: READY - EXPECT FAIL (SV-8837)`, with a
tester-facing note naming the ticket. **SV-8915 was closed OBSOLETE/Done by Branko as a duplicate of
[SV-8837](https://shopview.atlassian.net/browse/SV-8837)** (still **Ready for QA**, read live today) — so
our case already points at the surviving ticket. **No change.**

**⚠️ One difference worth recording rather than smoothing over.** The two expectations are *not* identical:

| Review | Spec §4.8 (live, unchanged since v23) |
|---|---|
| *"**if a shift exists earlier than business hours, open at that shift's time**"* — a **shift-driven** rule | *"the **earliest technician's configured start** if tech hours are set… If technicians have different start times, **the earliest one is used so no shifts are off-screen**"* — a **technician-hours-driven** rule |

They usually coincide and they differ in a real case: **a shift dragged to 5am on a technician whose hours
start at 7am.** The review would open the grid at 5am; the spec would open it at 7am. **Our case follows the
spec, which is correct under Rule 57.** Raised as **B-2** in `QUESTIONS.md`; **no case change**.

---

### B4 · "Add Existing Work Order" button missing from the build

> **Verbatim:** *"The button is present in the design but absent in the QA environment. **Needs
> confirmation with Bronco as to whether it was dropped in build or never scoped.**"* —
> [SV-8916](https://shopview.atlassian.net/browse/SV-8916), Medium, *"Missing vs. design"*.
> **Read live today: status Blocked.**

**VERDICT: CONFLICTS / OPEN — no case, and none may be authored.**

**Proven, not assumed:** the string `Add Existing Work Order` appears **zero times** in the v23, v24 and
v25 spec bodies and **zero times** in today's live body; and **zero times across all 195 of our case
bodies.** So it has **a design source and no product source**, and the review itself says it is unresolved.

**Under Rule 57 this is the textbook "no source speaks" case:** the gap becomes a **PO question**, and
authoring a case from the design alone would manufacture a requirement. **The ticket is Blocked for the same
reason**, which is a good sign that engineering reads it the same way.

**Recorded in `OUT-OF-V1.md` and as `B-3` in `QUESTIONS.md`.** Reserved id if it is ever authorised:
`SCH-DND-10`. **Not authored.**

---

### B5 · Conflict label reads "working hours" instead of "business hours" ⚠️

> **Verbatim:** *"Terminology is inconsistent with the rest of the product, which uses "business hours".
> Update the conflict label string."* — [SV-8917](https://shopview.atlassian.net/browse/SV-8917), Low in
> the document, **Medium in Jira, status TESTING QA** (read live today).

**VERDICT: CONFLICTS WITH THE PRD — raised, NOT resolved. Two cases affected.**

**The QA lead said two of our cases quote the old label. I checked all 168 with a quoted-string search
rather than a word search, and he is exactly right — it is two, and no more:**

| Case | Quoted label |
|---|---|
| `SCH-MODAL-07` = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | *"Starts before working hours"* · *"Extends past working hours"* |
| `SCH-CONF-03` = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | *"Starts before working hours"* · *"Extends past working hours"* |

(Six other cases contain the phrase *working hours* descriptively — a technician's own hours — and are not
label assertions. `SCH-CONF-02` = [C30024](https://shopview.testrail.io/index.php?/cases/view/30024) quotes
*"Scheduled on a weekend (outside working **days**)"*, a different string.)

**Now the part that makes this a conflict rather than a copy fix. The spec uses the two terms for two
different things**, and the distinction is load-bearing:

> **§4.2, verbatim:** *"**Every shift has a start time.** It is derived from a hierarchy: 1. **The
> technician's configured working hours take precedence.** 2. If those are not set, **the shop's business
> hours** are used. 3. If neither is set, a general default of 7:00 AM to 7:00 PM applies."*
>
> **§4.11, verbatim:** *"Before hours — Shift starts before the **working-day** start."* /
> *"After hours — Shift extends past the **working-day** end."*

**So the specification never calls this conflict "business hours".** It calls it the *working-day*
start/end, resolved from the technician first. **And our two cases assert precisely that**, deliberately:

> `SCH-CONF-03` `expected` 1, verbatim: *"…measured against **that technician's own configured working-day
> START time (not a fixed hour)**."* · `expected` 3: *"Both the start and the end follow the hierarchy
> **technician hours, then shop business hours, then the general default** working day of 7:00 AM to
> 7:00 PM."*

**If SV-8917's fix is applied literally — replace "working hours" with "business hours" — the label becomes
wrong for every technician who has custom hours**, because it will announce a conflict against the shop's
hours while measuring against the technician's. **That is a worse defect than the one being fixed**, and it
is not hypothetical: §4.2 makes technician hours the *first* rule in the hierarchy.

**Three possible answers, and we are not choosing between them:**
- **(a)** the label should name the **technician's** hours — the ticket's premise is wrong;
- **(b)** the label should read **"business hours"** and the spec's §4.11 wording changes with it —
  then our two cases change;
- **(c)** the label should be **neutral** (e.g. *"before the working day"*) — matching §4.11 exactly and
  sidestepping both.

**RAISED, NOT RESOLVED**, per the brief. `QUESTIONS.md` **B-2** (product) and **QA-2** (whether to comment
on SV-8917 — **we have not**, Rules 38/62). **No case change proposed until it is answered**, because
changing them now would be choosing (b) by default.

---

## Section B — enhancements that touch what we already assert

### E5 · Use remaining hours, not total estimate ⚠️

> **Verbatim:** *"When a work order is partially complete, scheduling should be driven by **remaining
> hours** rather than the original total estimate."* · **In Scope: Yes** · *"Stated requirement; scope TBC"*.

**VERDICT: CONFLICTS WITH THE PRD — raised, NOT resolved.**

| The review | Spec §4.5, verbatim |
|---|---|
| *"scheduling should be driven by remaining hours rather than the original total estimate"* | *"**Each drop spreads the full estimate for that technician, independently.**… There is no shared "remaining" counter across technicians and no splitting of a shift. Because progress is driven by clocked-in time, **scheduled hours, the estimate, and actual hours are three separate quantities and are not forced to reconcile.**"* |

**And our case follows the spec, in almost the spec's words:**

> `SCH-SPREAD-10` = [C29986](https://shopview.testrail.io/index.php?/cases/view/29986) *"The same work
> order on a second technician spreads the full estimate again"*, `expected`: *"1. Technician B gets a full
> 40h series of their own - the estimate is spread again in full, not reduced by A's booking. 2. **There is
> no shared 'remaining hours' counter across technicians** and no splitting of a shift. 3. Planned hours
> across technicians may now exceed the estimate - this is expected and produces no error."*

**Honest reading of how directly they collide:** the spec sentence our case quotes is about **two
technicians**; E5 is about **one partially-complete work order**. They are not word-for-word contradictory.
**But the spec's *reason* — "not forced to reconcile" — is exactly the principle E5 overturns**, and if E5
ships, C29986's "Full estimate" framing has to be re-derived. **The spec is the later authoritative source
(edited 7 August, two days after the review), so the case stands today. Raised as `B-4`. No change.**

---

### E2 · Per-line hours on hover

> **Verbatim:** *"Show hours consumed against estimate (e.g. "1hr of 4hr")… **In Scope: Yes** · WO list
> panel · **Aggregate/bottom-level in V1; per-line as follow-up**."*

**VERDICT: COVERED for V1 — `SCH-TIP-01` = [C30034](https://shopview.testrail.io/index.php?/cases/view/30034), no change.**

| The review's V1 half | Our case, via spec §4.13 |
|---|---|
| *"hours consumed against estimate"*, **aggregate** in V1 | Spec §4.13: *"a time-logged progress bar ("X / Yh")"* — which C30034 asserts, together with *"the individual line names as a short list capped at 3 with a "+N more lines" row (**no line statuses**)"* |

**The V1 scope and our case agree**, including on the *absence* of per-line figures. **The per-line half is
a follow-up and is recorded in `OUT-OF-V1.md`.** Note the review's own hedge — *"Fabian built this in the
original scheduler and is unsure how much it was used"* — which is not the language of a settled
requirement.

---

### E3 + E4 · Whole-WO as the default action, "Schedule by Line" as a secondary view

> **E3, verbatim:** *"The current modal **buries the primary action** and leads with an overwhelming
> line-selection UI. Make whole-WO scheduling **one prominent click as the default path**."* · In Scope:
> Yes · *"scope TBC"*.
> **E4, verbatim:** *"Hide line-level scheduling behind a **secondary button that opens its own uncluttered
> view**, explicitly designed to handle large work orders of 25+ lines."* · In Scope: Yes · *"scope TBC"*.

**VERDICT ×2: NOT TESTABLE YET — future redesign, scope TBC. But flagged as a standing risk to four cases.**

**They cannot be authored** — *"scope TBC"* twice, and no spec sentence supports either.

**What must be on the record is what they would cost us if they ship.** The spec's §4.3 scope picker — and
our four cases built on it — describes a **different design**:

> **§4.3, verbatim:** *""Schedule whole work order" **is pinned at the top, visually distinct**, and
> labeled with the line count and total hours… **Individual line rows.** Tapping a row is the fast
> path… **"Select multiple"** is an opt-in control…"*

**E3's premise that the modal "buries the primary action" contradicts the spec's "pinned at the top,
visually distinct".** Either the build does not match §4.3, or the review is arguing against §4.3 itself —
**the document does not say which**, and that is a genuine ambiguity, not our gap to fill.

**At risk if E3/E4 ship:** `SCH-SCOPE-01` = [C29963](https://shopview.testrail.io/index.php?/cases/view/29963),
`SCH-SCOPE-02` = [C29964](https://shopview.testrail.io/index.php?/cases/view/29964),
`SCH-SCOPE-03` = [C29965](https://shopview.testrail.io/index.php?/cases/view/29965),
`SCH-SCOPE-05` = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967). **Recorded in
`OUT-OF-V1.md` as a watch list. Nothing changed.**

---

### E10 · Business-hours-aware default viewport

> **Verbatim:** *"Open the schedule at the first business hour, defaulting to 7:00am when business hours are
> unset, and at the earliest existing shift when one starts before business hours. **This is the intended
> behavior behind the B1 fix.**"* · In Scope: Yes · **"Scoped for V1"**.

**VERDICT: COVERED — `SCH-DAY-01` = C30001, as under B1. No change.**

**And worth stating plainly because it bears on the Branko sheet: E10 required no decision at all.** It is
**already a spec requirement** — §4.8 *"Auto-scroll to business hours"* — present in **v23, v24, v25 and the
live body** (proven by string count in `SOURCE-CURRENCY.md` §4). So marking it *"Scoped for V1"* ratifies
something already ratified. **That is why E11's "Paired with E10" carries no scope authority** — see
`BRANKO-SHEET-RECHECK.md` S2-Q8, reason 5.

---

### E11 · Constrain schedule width to business hours + buffer ⚠️

> **Verbatim:** *"Render **only business hours plus a small trailing buffer** rather than the full 24 hours.
> After-hours scheduling is an edge case and can be reached by scrolling."* · **In Scope: Yes** ·
> *"Paired with E10"*.

**VERDICT: CONFLICTS WITH THE PRD — raised, NOT resolved. This is Branko sheet Section 2 question 8.**

| The review | Spec §4.8, verbatim (live 2026-08-10) |
|---|---|
| *"Render only business hours plus a small trailing buffer rather than the full 24 hours"* | *"**The full 24-hour timeline remains intact and scrollable.**"* |

**Our case says the spec's version:**

> `SCH-DAY-01` = C30001 `expected` 4, verbatim: *"The timeline is not stuck at the start - it **remains a
> full 24-hour scrollable timeline (midnight to midnight)**."*

**The case stands and is NOT changed**, because the spec was edited **7 August — two days after the
review** — and still says the full 24 hours. **The full six-reason argument is in
`BRANKO-SHEET-RECHECK.md`.** The one thing this document adds: **the question's premise on the sheet was
wrong and has been corrected.**

---

### E12 · Persist view options per user

> **Verbatim:** *"Store view state — **capacity planning toggle, department visibility**, and similar
> options — at the user level in cache so it survives across sessions."* · In Scope: Yes · *"scope TBC"*.

**VERDICT: NEW CASE NEEDED (proposed, not authored) — `SCH-VIEW-NEW-1`.**

**Nothing in our 168 asserts that View Options survive a session.** We cover their **defaults and effects**
— `SCH-VIEW-05` = [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) (*"six toggles with
defaults"*), `SCH-VIEW-02` = C30043 (department toggles), `SCH-VIEW-06` = C30047, `SCH-VIEW-09` = C30050,
`SCH-VIEW-10` = C30051 — but **not their persistence**.

**And the spec is close to silent, which is why this is proposed rather than authored.** §9's tables give a
Default column for every option and say nothing about persistence. The **only** persistence sentence in the
whole document is §5.3, about the **panel collapse**, and it says: *"**Persistence.** Not persisted in the
prototype. **Session-scoped per user for build** — this is a working-mode preference, not a saved view."*

**That sentence is about a different control, and "session-scoped" is arguably weaker than E12's "survives
across sessions".** So the honest position: **the case would rest on E12 alone, which is a review with
"scope TBC"** — not enough under Rule 57. **Proposed, with the gap named, and it needs Branko before it can
be authored.** `QUESTIONS.md` **B-5**.

---

### E9 · Drag a shift to the next day in week view

> **Verbatim:** *"Support dragging a shift onto the following day directly from week view **as an
> alternative to the carryover button**."* · In Scope: Yes · *"Stated; scope TBC"*.

**VERDICT: NEW CASE NEEDED (proposed, not authored) — `SCH-DND-11`.**

**Checked and it is a genuine gap:** our drag family covers creating from the sidebar
(`SCH-DND-01`…`SCH-DND-07`), click-to-arm (`SCH-DND-08` = C29962), **month-view** drag-create
(`SCH-DND-09` = C43555) and **technician-to-technician** reassignment (`SCH-REAS-01`). **None covers moving
an existing shift to a different DAY in week view.**

**The spec supports a weaker version of it than the review does**, and the difference matters:

> **§7, verbatim:** *"**Shift reassignment.** Dragging a shift block **from one technician row to another**
> reassigns it…"* — a **technician** move. **§4.10** allows events *"to reassign between technicians **or
> move between days**"* — but that is **events**, not shifts.

**So a same-technician, different-day shift drag is not clearly required by any spec sentence.** Proposed
with that limitation stated; **not authored.**

---

## Section C — explicitly out of V1, and one document defect

| # | Item | Scope column, verbatim | Our exposure |
|---|---|---|---|
| **E1** | Hover pill on work order cards | *"**Out of Scope** / Done in foundermode FS"* | **NONE.** Our tooltip cases (`SCH-TIP-01`…`05`, C30034–C30038) are all **grid block** tooltips per §4.13. **No case asserts a hover pill on a sidebar work-order card.** Checked. |
| **E13** | Visual indicator for explicitly assigned lines | *"Will be done in Foundermode FS"* | **NONE.** No case asserts light-blue text or any explicit/implicit assignment distinction. |
| **E14** | Single tech selector + "Add Tech" | *"Will be done in Foundermode FS"* | **NONE** in Schedule. §4.3's *"There is no technician cap and no swap flow"* is what our cases follow. |
| **E16** | Vertical orientation for Day View | *"**Fast-follow, not part of this v1 release**"* | **NONE.** The word *vertical* appears in three cases (C30003, C30006, C30088) and every instance is **vertical scrolling** or the **now line**, never an orientation. Checked individually. |
| **E6** | User-level "always schedule whole WO" preference | In Scope: Yes · *"**Open question** — decide before V1"* | **NONE.** No preference case exists. **Open by the document's own admission** — not authorable. |
| **E15 / E7 / E8** | Restore carryover · rename it · extend by one day only | Yes · *"**final wording to be confirmed**"* · *"Ships with E15"* | **NONE — and none may be authored.** `carryover` appears **zero times** in v23/v24/v25/live spec and **zero times** across our 195 case bodies. **E7 says the name is TBC**, so authoring would pin a label that does not exist yet — precisely what Rule 9 forbids. |

### A defect in the document itself, reported not fixed

**The bug table lists B1, B4 and B5 — but the enhancement rows reference a "B2" and a "B3" that appear
nowhere in the document.** E13: *"Makes **the B2 fix** legible to users instead of invisible."* E15:
*"Restore the carryover button (**was B3**)."*

So **two findings from that review are referenced and not recorded here.** B3 is recoverable — it is the
carryover item, reclassified to E15. **B2 is not**: all we know is that it concerns explicitly-assigned
versus lead-tech-implied lines and that a fix exists. **We cannot tell whether B2 has a Jira ticket, whether
it is in V1, or whether any of our cases touch it.** `QUESTIONS.md` **QA-7**.

---

## What this document does NOT claim

- **The v25 → current Schedule spec diff was NOT done.** The page moved on 7 August and our newest mirror
  is v25. The **twelve sentences** every verdict above rests on were proven unchanged across v23/v24/v25
  and the live body (`SOURCE-CURRENCY.md` §4), so the verdicts are sound — **but a requirement added or
  removed on 7 August elsewhere in the document would not have been seen.**
- **Neither epic was re-checked** (Rule 37 Tier 1 not run) — declared in `SOURCE-CURRENCY.md` §6.
- **No build was observed.** The Rule 49 queue stays **OPEN**; all 168 verdicts stay **PROVISIONAL**.
- **No conflict is resolved.** Three are raised and left open.

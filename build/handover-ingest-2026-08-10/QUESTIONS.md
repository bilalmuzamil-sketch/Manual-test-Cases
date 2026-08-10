# QUESTIONS — what is genuinely open after ingesting both documents — 2026-08-10

**Two audiences, kept strictly apart (Rule 55).**

- **Part 1 — FOR BRANKO (product).** Written for a non-technical reader. **Every row names its project and
  its feature**, because Branko owns Filters, Schedule *and* Global Search and answers row by row, often
  days later. **No case IDs, no requirement anchors, no ticket numbers, no jargon.**
- **Part 2 — FOR THE QA LEAD (ours).** Our decisions, our process, our record. Full detail.

**None of these has been sent or filed. No Jira ticket has been created (Rule 62).**

---

# PART 1 — FOR BRANKO

> **These are NOT on the sheet that is ready to go out, and that is deliberate.** That sheet is finished at
> 20 items and re-checked today. Adding late items to a sheet already in flight is the trickle of separate
> asks Rule 55 exists to stop. **These belong on the NEXT sheet, or as a short follow-up once the current
> one is answered — the QA lead's call.**

---

### B-1 · FILTERS — the Work Orders list — whether the filter dropdowns should close when you pick something

**What happens now**

> The five filter buttons on the Work Orders list open a small panel when you click them. They do not all
> behave the same way when you make a choice.
>
> The ones where you can tick several things — Customer, Lead Technician, Service Advisor, Status — stay
> open, so you can tick a second and a third. That is what we would expect.
>
> But Asset on Site, where you can only pick one answer, closes the moment you pick. And the date panel on
> the report pages closes when you pick a ready-made period, but stays open while you are typing your own
> dates.
>
> Your written description gives one rule for all of them — the panel closes when you click outside it —
> and does not mention closing when you choose something.
>
> Why we are asking: none of our tests is wrong today, because none of them says either way. But a tester
> will notice that the buttons behave differently from each other, and we would rather have your answer
> than let them guess.

**The question**

> Should a filter panel where you can only pick ONE answer close by itself as soon as you pick?

**Options**

> A) Yes — a one-choice panel closes as soon as you pick. Please have the description say so.
>
> B) No — every panel should stay open until you click outside it, as the description says today.
>
> C) Something else — please describe it.

**Your answer:** _______________________________________________

---

### B-2 · SCHEDULE — the technician calendar — the wording of the warning when a shift falls outside someone's hours

**What happens now**

> When a shift is put before or after someone's working day, the calendar shows a warning. Today that
> warning says "working hours".
>
> A fault raised after the design review on 5 August asks for it to say "business hours" instead, because
> that is the wording used elsewhere in the product.
>
> Here is our worry, and it is why we have not simply changed our tests. Your own description treats those
> two as DIFFERENT things. It says a technician's own hours come first, and the shop's business hours are
> only used when that technician has no hours of their own.
>
> So if the warning is changed to say "business hours" for everybody, it will be wrong for any technician
> who has their own hours set — it would blame the shop's hours while actually measuring against the
> technician's.

**The question**

> When a shift falls outside someone's hours, what should the warning say?

**Options**

> A) It should refer to THAT TECHNICIAN'S hours, because those are what it measures against.
>
> B) It should say "business hours" for everyone — then your description needs changing to match.
>
> C) It should avoid both and just say something like "outside the working day".
>
> D) Something else — please describe it.

**Your answer:** _______________________________________________

---

### B-3 · SCHEDULE — the technician calendar — the "Add Existing Work Order" button

**What happens now**

> A button called "Add Existing Work Order" appears in the drawing of the Schedule, but it is not in the
> product. It was raised as a fault after the design review on 5 August, and that report says openly that
> nobody is sure whether it was dropped while building or never planned at all. The fault has been parked
> since.
>
> We searched your written description for it and it is not there — not in the current version and not in
> any earlier one we hold.
>
> Why we are asking rather than writing a test: a drawing on its own is not enough for us to say the
> product must do something. If we wrote the test now we would be inventing a requirement, and if the
> button was never planned, that test would fail forever for no reason.

**The question**

> Should there be an "Add Existing Work Order" button on the Schedule in this release?

**Options**

> A) Yes — it was meant to be there. (Then we will write the test, and it should go in your description.)
>
> B) No — it was never planned, or it has been dropped. (Then nothing more is needed from us.)
>
> C) Not in this release, but later — please say roughly when.

**Your answer:** _______________________________________________

---

### B-4 · SCHEDULE — the technician calendar — how many hours get planned for a job that is half done

**What happens now**

> When a big job is spread across several days, the calendar decides how many hours to plan.
>
> Your description is clear about this today: it plans the WHOLE original estimate every time, and it says
> in as many words that planned hours, the estimate and the hours actually worked are three separate
> numbers that are not made to add up.
>
> The design review of 5 August asks for the opposite: that when a job is partly finished, planning should
> use the hours REMAINING rather than the original estimate. That review lists it as in scope for this
> release.
>
> Our test follows your description. We have not changed it, because your description was updated on
> 7 August — two days after that review — and still says the original estimate.

**The question**

> When a job is already partly finished, should the calendar plan the hours remaining, or the whole
> original estimate?

**Options**

> A) THE WHOLE ORIGINAL ESTIMATE — as your description says today. Nothing changes.
>
> B) THE HOURS REMAINING — then your description needs changing, and we will change our test to match.
>
> C) Something else — please describe it.

**Your answer:** _______________________________________________

---

### B-5 · SCHEDULE — the technician calendar — whether the view settings are remembered

**What happens now**

> The Schedule has a small settings panel that turns things on and off — the capacity bars along the top,
> which departments are shown, whether events appear, and so on.
>
> Your description tells us which of those start switched on and which start switched off. It does not say
> whether the product remembers a person's choices for next time.
>
> The design review of 5 August asks for them to be remembered for each person, and lists it as in scope
> for this release, but marks the details as still to be worked out.
>
> Why we are asking: we have no test for this, and we do not want to write one that says "remembered" when
> the only thing asking for it is a meeting note.

**The question**

> Should each person's Schedule view settings be remembered for next time?

**Options**

> A) YES — remembered for that person, and they should still be set that way after signing out and back in.
>
> B) NO — they go back to their starting positions each time.
>
> C) Remembered only until they close the browser, not beyond that.

**Your answer:** _______________________________________________

---

### B-6 · SCHEDULE — the technician calendar — dragging a shift onto the next day

**What happens now**

> In the week view you can drag a shift from one technician to another, and your description covers that.
>
> The design review of 5 August also asks that you be able to drag a shift onto the NEXT DAY for the same
> technician, as a quicker alternative to a button. It lists it as in scope for this release but marks the
> details as still to be worked out.
>
> Your description does not mention moving a shift to a different day. It only mentions moving one between
> technicians. It does allow meetings and other non-job blocks to be moved between days — but that is a
> different kind of block.
>
> We have no test for it, and we would rather ask than invent one.

**The question**

> Should someone be able to drag a shift onto a different day for the same technician?

**Options**

> A) YES — dragging a shift onto another day moves it there. (Then we will write the test.)
>
> B) NO — shifts move only between technicians; changing the day is done another way.
>
> C) Not in this release — please say roughly when.

**Your answer:** _______________________________________________

---

# PART 2 — FOR THE QA LEAD

---

### QA-1 · ⚠️ Does Rule 30 hold for a "technical design"? — the biggest open question here

**Your brief flags it and I want to show you why it is not academic.** Rule 30 says a tech plan *informs but
never overrules* product truth. The Filters handover contains this, verbatim:

> *"The PRD **prose** once said "presetless" — **ignore that**; design + BE reality won."*

**That is engineering recording, as a working practice, that they overruled the PRD.** In this instance
there is no live conflict — the current PRD agrees with them. **But it is Rule 57's failure mode written
down as a method**, and Rule 62's arrival today suggests the standing is being tightened, not loosened.

**Second instance in the same document:** the handover states its own PRD baseline as *"currently v1.6"* —
**the in-body field, not the Confluence version.** So its author was caught by the **same Rule 31(a) trap
we were**, and any *"the PRD says X"* in it is only as current as that.

**What I need:** does a handover/technical design join Rule 57's three sources (PRD · epic stories · PO
answers), or does it stay informative-only under Rule 30? **Every "conflicts with the PRD" verdict in both
reconciliation files is left open on your answer.**

---

### QA-2 · Three defects recommended, none filed (Rule 62)

**No ticket has been created.** Each of these is **user-reachable**, so **Rule 51 does not apply** — none is
an API-only finding.

| # | Finding | Evidence | Recommendation |
|---|---|---|---|
| **D-1** | The shared-view exit button reads **"Back to my saved filters"** where **S11-R7** requires **"Back to my view"** — and the spec spells out *why*: *"The label is deliberately "my view" rather than "my filters", since the action affects both filters and search"* | Handover names `FilterBar.vue`'s label and test id `back_to_saved_filters`; spec text confirmed in the live body and in two earlier mirrors | **File Low, parent SV-8785.** Blocks P-03/P-04 |
| **D-2** | **A filter click during the ~400ms preference load is silently reverted.** Click a filter, it appears to take, 400ms later it undoes itself | Handover, verbatim: *"Possible product UX bug worth a ticket"* — **engineering says so and has not filed it** | **File Low, parent SV-8785.** Blocks N-01 |
| **D-3** | **SV-8917's fix, applied literally, would introduce a worse defect** — see B-2 | Spec §4.2 vs §4.11 | **Do NOT file. Do NOT comment on SV-8917** — Sasha Grosman's ticket (Rule 38). **Ask Branko instead** |

**Also for the record: we have not touched SV-8915, SV-8916 or SV-8917** — read-only, no comments, no field
changes (Rules 38 / 62).

---

### QA-3 · The cross-project boundary — one direction checked, one not

Your brief: *"Our Filters cases must not assert filter behaviour on Report Suite reports, and vice versa."*

**Direction 1, checked: our Filters case crosses the line four times.** `FLT-RPTS-01` = C38909 asserts
filter buttons on Technician Efficiency, Sales, Advisor Analysis and Work in Progress — the four the
handover forbids because **SV-8582 owns them**. P-01 fixes it.

**Direction 2, NOT checked: whether any Report Suite case asserts Filters-epic behaviour.** Out of scope,
and **another worker is live in `build/report-suite/chris-answers-2026-08-10/`.** **Worth someone's hour**,
because the handover confirms the two epics have overlapping report surfaces and separate filter chassis.

---

### QA-4 · An access fact that will bite whoever tests My Timesheets

> *"`/timesheets` (MyTimesheets) has `beforeEnter: onlyClockableUsers` gated on the login `clockable` flag;
> the `reporting` project admin is seeded `clockable:false` → **redirect, grid never mounts**."*

**My Timesheets is one of the six reports in this epic's rollout.** If it comes into our scope, **the account
we test with may not be able to reach the page at all** — and the failure looks like a missing feature, not
a permission. **Recorded here so nobody loses a morning to it.**

---

### QA-5 · Are SV-8832 and SV-8871 the same underlying gap?

The handover's open item **W2** — *"entity chips apply an invalid id from a shared URL without an
"ignore-if-not-a-valid-option" guard (stale/deleted id gets sent **+ briefly-blank chip label**). Best fixed
kit-wide (spec S11-R3)"* — describes **both** symptoms we carry separately:

- the invalid id being sent = **[SV-8832](https://shopview.atlassian.net/browse/SV-8832)** (Open), our
  `FLT-PERS-04` deviation;
- the blank chip label = **[SV-8871](https://shopview.atlassian.net/browse/SV-8871)**, on `FLT-URL-02` =
  [C29618](https://shopview.testrail.io/index.php?/cases/view/29618).

**If one kit-wide guard fixes both, one of the two tickets is redundant.** That is a developer's call, not
ours. **Nothing changed, nothing commented.**

---

### QA-6 · Two currency gaps, declared rather than implied

1. **The Schedule spec moved and we have not diffed it.** Live `lastModified` **Aug 07**; our newest mirror
   is **v25, published Aug 06**. The **twelve sentences** this pass rests on are proven unchanged across
   v23/v24/v25 and the live body — **but a requirement added or removed elsewhere on 7 August would not
   have been seen.** And **CLAUDE.md still says version 23**, two versions behind our own mirror.
2. **Neither epic was re-checked.** Rule 37 Tier 1 was **not run** on SV-8785 or SV-8685 — out of this
   pass's scope, and Tier 2 needs your authorisation.

**Also worth an eyebrow:** our own cases disagree about which build they were last checked against —
`SCH-CONF-02`/`SCH-CONF-03` say **`v3.5-d122eef`, 8/5**, `SCH-DAY-01` says **`v3.5-7ec992f`, 8/6**, and
CLAUDE.md says **`v3.5-be42149`**. Three markers, one branch.

---

### QA-7 · The design review is missing two of its own findings

The bug table lists **B1, B4, B5** — but two enhancement rows reference findings that appear nowhere in the
document: E13 says *"Makes **the B2 fix** legible to users instead of invisible"* and E15 says *"Restore the
carryover button (**was B3**)"*.

**B3 is recoverable** — it is the carryover item, reclassified to E15. **B2 is not.** All we know is that it
concerns explicitly-assigned versus lead-tech-implied lines and that a fix exists. **We cannot tell whether
it has a ticket, whether it is in V1, or whether any of our cases touch it.**

**Ask Sasha or Fabian for the full review, not the extract.** The document says so itself: *"the review text
did not come through in the original request; findings below are extracted from the meeting record."*

---

### QA-8 · Three files need correcting and I did not touch any of them

| File | What is wrong | Why not fixed |
|---|---|---|
| `CLAUDE.md` | *"SV-8844 IS FIXED"* — it was never a defect (P-08); Schedule spec named as v23 when our own mirror is v25 and live is later | **Explicitly out of this pass's write scope** |
| `build/OUTSTANDING-ITEMS-REGISTER.md` | Six new open items from this pass are not in it | Shared file, other workers live |
| `build/filters/questions-2026-08-06/…_2026-08-06.md`/`.xlsx` (the **non-friendly** pair) | Already bannered superseded, but still carries **both uncorrected premises** | Outside the item-3 write scope. **It must not be sent** |

---

## OUTSTANDING — what I need from you

1. **Send the friendly Branko sheet** (`build/filters/questions-2026-08-06/…Friendly-Version…`), 20 items,
   both premises corrected. **Do not forward the QA-only tab.** — *blocks 20 questions and 20+ held cases*
2. **Rule the S2-Q8 judgement.** I kept the question rather than removing it; six reasons are in
   `BRANKO-SHEET-RECHECK.md`. **If you disagree, it is one line to drop it.**
3. **Answer QA-1** — does a technical design join Rule 57's sources? — *blocks 7 "conflicts with the PRD"
   verdicts across both projects*
4. **Approve or decline the five READY proposals** in `PROPOSED-CHANGES.md` (P-01, P-02, P-06, P-07, P-09).
   **P-01 is the one that matters** — *blocks a case that would send a tester to thirteen reports nobody is
   changing*
5. **Rule on D-1 and D-2** — file them or not (Rule 62). — *blocks P-03, P-04, N-01*
6. **Authorise the Schedule v25 → current spec diff**, and say whether you want a Rule 37 Tier-1 epic
   currency check on SV-8785 and SV-8685. — *blocks any claim that either suite is current*
7. **Decide whether B-1 to B-6 go on a follow-up sheet to Branko, or wait for the next round.** — *blocks
   3 proposed new cases and 2 case edits*
8. **Someone should hold the CLAUDE.md and register corrections** in QA-8 — I could not write either file.

**Nothing else is outstanding from this pass.**

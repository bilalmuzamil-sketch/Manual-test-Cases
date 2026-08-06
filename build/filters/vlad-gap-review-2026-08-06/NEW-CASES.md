# NEW CASES — four gaps proven absent, four cases authored

**Authorisation:** the QA lead authorised `add_case` **only for a gap proven absent** with both texts
quoted side by side. **Every one of the four below has that proof in `ROW-BY-ROW.md`.** The eight
other rows produced **no** new case — five because the coverage already exists, one because it is a
recorded deliberate wait, one because no document states the behaviour, and one because it was split
and its covered half needed nothing.

**Every expectation below comes from the specification, the epic's stories or Branko's answers
(Rule 57). Not one sentence came from the build** — the branch API returned HTTP 401 all session, so
**none of the four has been observed**, and each says so on itself in place of a build stamp.

**Internal IDs checked three ways before use** (not in the 150 local case bodies · not among the 36
retired bodies · not in the id-map) — see the check output in `testrail-execution-log.md`.

---

## 1. FLT-PERS-07 = [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) — *Persistence* (section 4121)

**Title:** *When two devices set different filters, the last one saved wins*

**Answers:** row **3b** — the second assertion of `S10-R2`.

**The requirement it rests on, verbatim (spec v19):**
> *"Filter selections are stored server-side against the user account… **Where two devices write
> different state, last write wins.**"*

**Why it was needed:** the *syncing* half of `S10-R2` was covered by
[C29614](https://shopview.testrail.io/index.php?/cases/view/29614); **the conflict rule was covered
nowhere.** [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) mentions the words *"last
write wins"* inside its `refs` — but a `refs` field is metadata and no expected result asserted it, so
it was untestable.

**Marker:** `AUTOMATION: READY` — two browser contexts signed in as one account is automatable, and
plain READY asserts *automatable*, not *currently passing* (Rule 60). **Never observed; no build stamp.**

---

## 2. FLT-PSRCH-14 = [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) — *Page Search Toolbar* (section 5410)

**Title:** *On a phone, pages with two or more icon buttons collapse them into one menu*

**Answers:** row **4** — `S13-R19`.

**The requirement it rests on, verbatim (spec v19):**
> *"Where a page has more than one icon-only action in its toolbar, those actions collapse into a
> single "more" kebab on mobile. **This applies to Inventory, Purchase Orders, Timesheet Activities,
> both Technician Efficiency reports, Sales Tax (Collected)**, and any other page carrying two or more
> icon actions"*

**Why it was needed:** [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) asserts the
**rule** and cites `S13-R19`, but its step 3 visits **one example page** — *"for example Parts
Inventory or Purchase Orders"*. **The six surfaces the requirement names are not exercised.**

**Rule 42 handled deliberately:** the six pages are enumerated because **the specification itself
enumerates them**, and the case's expected result 6 keeps it open-ended — *"This rule applies to any
page carrying two or more small icon buttons, so if you find another page like that, it should behave
the same way"* — plus a control (step 7: a page with only **one** icon button, which must **not**
collapse), so the case can fail for the right reason.

**Marker:** `AUTOMATION: READY` — a phone viewport is automatable (a tool flag never justifies HOLD).
**Never observed; no build stamp.**

---

## 3. FLT-PARTS-14 = [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) — *Parts Page Filters* (section 5411)

**Title:** *Parts and Reports filters collapse, share and work on a phone as Work Orders do*

**Answers:** row **9** — the three uncovered dimensions of Branko's Round-3 Q5.

**The source it rests on, verbatim (Branko, 2026-07-31, Round 3, Q5 = A):**
> *"A - Yes - multi-select, clearing, **collapse**, persistence, **shareable URL** and **mobile** all
> match Work Orders."*

**Why it was needed:** of his six named dimensions, **three were covered** — multi-select and clearing
by [C38907](https://shopview.testrail.io/index.php?/cases/view/38907), persistence by
[C38880](https://shopview.testrail.io/index.php?/cases/view/38880) — and **three were covered nowhere:
collapse, shareable URL, mobile.** [C38908](https://shopview.testrail.io/index.php?/cases/view/38908),
which Vlad correctly identified as the only case speaking to parity, asserts a **before/after
inventory of which filters exist**, not how they behave.

**Sourcing note:** a **PO answer is a valid source of expected behaviour under Rule 57**, so this case
is properly sourced even though the specification has no numbered requirement for it — and the
provenance line says exactly that, with the file link and the date, per Rule 54.

**No Rule-56 divergence sentence** — nothing earlier contradicted Q5, and inventing a conflict would
itself be a defect.

**Marker:** `AUTOMATION: HOLD - the new filter bar has reached only some Parts views and one report
tab, so most of this cannot be run yet` — the same honest reason its nine siblings carry.
**Never observed; no build stamp.**

---

## 4. FLT-MOB-11 = [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) — *Mobile Filters* (section 4123)

**Title:** *On a phone, picking Imported works alone and disables the other filters*

**Answers:** row **11** — the documented half of it.

**The requirement it rests on, verbatim (spec v19) — note it names no screen size:**
> *"Imported is an exception to S2-R2 and cannot be combined with anything else… selecting Imported
> switches the list to the imported records and **disables the other filter chips** while it is active.
> Deselecting Imported returns the list and **re-enables the other chips**"*

with `S12-R6` supplying the phone mechanism, verbatim:
> *"mobile does not filter in real time. Selections… are staged, and the table updates only when the
> user taps an "Apply filters" button within the sheet."*

**Why it was needed:** [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) is explicitly
desktop — precondition 1 reads *"on a desktop browser"* — and the ten mobile cases mention Imported
only once, in [C29623](https://shopview.testrail.io/index.php?/cases/view/29623), as one of nine
checkboxes, asserting nothing about exclusivity. On a phone the control is a **bottom sheet with
deferred apply**, a genuinely different interaction, so desktop coverage does not carry.

**What was deliberately NOT authored, and why:** Vlad's row also names a second behaviour from the
codebase — *"strips imported when a non-exclusive status is the last toggled"*. **It appears in no
document**: not `S2-R7`, not `S2-N4`, not Story 12, not any Branko answer. A unit test is not a source
of expected behaviour (Rule 57), so authoring it would have invented a requirement from the code.
**It is Q4 in `QUESTIONS-FOR-BRANKO.md`** instead.

**Marker:** `AUTOMATION: READY`. **Never observed; no build stamp.**

---

## What these four do to the readiness figure

| | before | after |
|---|---|---|
| Cases | 110 | **114** |
| `AUTOMATION: READY` | 80 | **79** |
| `AUTOMATION: READY - EXPECT FAIL` | 14 | **15** |
| `AUTOMATION: HOLD` | 15 | **20** |
| **no marker at all** | **1** (C29558) | **0** |
| **READY TO AUTOMATE** | **94** | **94** |

**The gate passes both ways: 79 + 15 = 94, and 114 − 20 = 94.** Both figures were read back from the
live cases, not computed from these notes.

**The figure did not rise, and every movement is explained.** +3 new READY cases and C29558 regaining
a marker are offset by **4 cases moving to HOLD** pending Branko's answer on row 1 — which is the
correct outcome: a case whose expected behaviour is genuinely in dispute must not be handed to an
automation engineer as ready.

**One correction to the record while we are here:** the previously reported figure of **95** was
already **one too high**. It was 81 + 14; the live census shows **80** READY plus **one case with no
marker at all** (C29558, whose marker another author's edit had removed), so the true figure before
this pass was **94**.

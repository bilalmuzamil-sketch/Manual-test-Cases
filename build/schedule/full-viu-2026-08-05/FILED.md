# Defect tickets filed from this pass

**Standing authorisation is in force.** Defects are filed as they are established, in the shape the
QA lead requires: issuetype **Story Defect (10007)** · parent **the owning story** (an epic parent
returns HTTP 400 on this type) · priority **Low** · the owning story also linked `relates to` ·
**no Product Area** (the field is absent on this type). Seven-section body, exact test data named,
duplicate search run and stated, every field read back.

**Rule 51 is respected absolutely:** an API-only fault — one reachable only by calling an endpoint
directly with a request the product's own screens never send — is **not filed**. It goes to
`API-ASK.md` and is raised as an ask. Both tickets below were checked against that test and both are
reachable from the screens by an ordinary manual tester.

---

## SV-8933 — working hours cannot be opened for a staff member who belongs to another location

**[SV-8933](https://shopview.atlassian.net/browse/SV-8933)** · Story Defect · Low · parent
**SV-8699** (Working Hours Settings) · `relates to` SV-8699 · Open · created 2026-08-06 00:22:56
−0500 · **12/12 field checks PASS**, summary byte-compared against the payload.

**The symptom, plainly.** A staff member who belongs to a different location from the one you are
working in can still be found in the Staff list and opened — but switching on *"Set custom hours for
this technician"* produces an error and flips the switch straight back off. Their hours cannot be
reached at all from where you are.

**The mechanism.** The dialog calls `GET /api/staff/{staff_id}/working-hours` and is told **404
`'Staff' was not found.`**, while the *same id* on a neighbouring call from the same dialog returns
**200** (`enrolled-workplaces`). The record exists; the working-hours lookup is filtered by the
session's current workplace, and the Staff list is not.

**Proven by switching location — deterministic and reversible:** Benjamin Peters is 404 on Heavy
Duty, **200 on Lethbridge**, and 404 again on switching back. Ayesha Khan AK is 200 throughout.

**Scope, measured:** **63 of 161 staff fail, 98 succeed**; technicians worst hit at 34 of 54. Not one
record, and not the whole service.

**Duplicate search — five queries, no match.** All 68 epic descendants; `text ~ "working hours"`;
`text ~ "custom hours"`; `summary ~ "hours"`; `text ~ "Staff was not found"`. SV-8887/8890/8891/8892
are all about the editor *once open*; SV-8851 is the board's Tech Hours switch; SV-8827 is that
switch's default; SV-8831/SV-8922 are the inverse case.

**Test data by name.** **Benjamin Peters** (Staging Lethbridge - 4310) viewed from **Staging Heavy
Duty - 9919**; contrast **Ayesha Khan AK** (Heavy Duty), whose hours open normally.

**Ruled out first:** one unlucky record (no — 63); the whole service down (no — 98 succeed); the
person rather than the location (no — the same person works from the other location).

---

## SV-8941 — Month view shows the VIN although the specification says it is omitted there

**[SV-8941](https://shopview.atlassian.net/browse/SV-8941)** · Story Defect · Low · parent
**SV-8690** (Shift Block Anatomy & Scope Labeling) · `relates to` SV-8690 · Open ·
**12/12 field checks PASS**, summary byte-compared against the payload.

**The symptom.** With the **VIN Number** switch on, Month view prints the VIN on shift blocks. Month
blocks are small, and the VIN takes the space the job description needed.

**The spec, verbatim.** Schedule specification v23, **§4.4**: *"Shown in day and week views only;
month view omits it due to space constraints."*

**Counts, on the current build:** **Month 11 of 67 blocks carry a full 17-character VIN** — Week
29/55 and Day 6/12 are **correct**. Examples read straight off the Month blocks:
`Xiriver Apparel ~ 24069 ~ 3HSDZAPT9KN042164 ~ 19 Lines ~ Part of a series`.

**Ruled out first, and this changed the number.** A first pass used a loose 17-character pattern and
a selector that also matched nested child elements, giving inflated and unreliable counts. It was
discarded and the figures re-taken with top-level block elements only and a strict VIN pattern
(17 chars from the VIN alphabet, at least one digit **and** at least one letter, so unit numbers and
job codes such as `12-06696` cannot be mistaken for one). The ticket says so.

**Also checked:** the switch is not simply being ignored — with it off, no block in any view shows a
VIN; with it on, Day and Week show it as intended. So the fault is specific to Month view.

**Duplicate search — four queries, no match.** All 69 epic descendants; `text ~ "VIN"`;
`summary ~ "VIN"`; `text ~ "month view"`. **SV-8835 is the closest and is not this** — it reports the
hover *tooltip* showing the VIN while the toggle is **off**; this is the *block*, in Month view, with
the toggle **on**. Opposite switch position, different surface. (And the tooltip behaviour SV-8835
describes was ruled *correct* by the product owner on 31 July 2026.) SV-8865, SV-8867, SV-8870 and
SV-8909 are Month-view faults about opening, reassigning, drag-creating and empty-cell clicking —
none touches block text.

**Case:** `SCH-VIEW-04` = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045), whose
item 3 reads *"Month view blocks never show the VIN, even with the toggle on (space constraints)."*
Items 1, 2, 4 and 5 pass.

---

## ⚠️ A ticket WE filed earlier today is INVALID — recommend withdrawal

**[SV-8923](https://shopview.atlassian.net/browse/SV-8923)** — *"the Business Hours switch shades
nothing"*. **It is wrong.** Full evidence in `SV-8923-SHOULD-BE-WITHDRAWN.md`.

It was raised while the shop had **no business hours configured at all**, which breaches the source
case's own precondition (*"The shop has working hours set"*). With nothing configured there is
nothing to shade, so the switch was behaving correctly. With business hours set to 06:00–18:00,
shading works to the pixel: **40 shaded elements ON, 0 OFF, 40 ON again**, in two bands measuring
exactly 6.0 hours each at 48.1 px/hour — 00:00–06:00 and 18:00–24:00.

**Not actioned — the QA lead's call.** The recommendation is to close it with a plain withdrawal
comment, never delete it.

---

## Findings that turned out NOT to be defects

Recorded because a finding that dissolves is worth as much as one that stands — and because two of
these came close to being false tickets.

| Finding | Verdict | Why |
|---|---|---|
| *"Saving a technician's working hours does not persist"* | **NOT A DEFECT — our own harness bug** | The Save button was clicked without being scrolled into view, so the click landed on nothing. Scrolled first, the `PUT` fires, returns 200, and the value reads back. |
| *"The Business Hours switch shades nothing"* (SV-8923) | **NOT A DEFECT — invalid ticket** | Observed against an unmet precondition, as above. |
| *"The board payload carries no hours data"* | **FALSE** | It carries a `workingWindows` array of 162 entries with correct per-technician ranges. The grid simply does not render them — a sharper statement of SV-8851, and useful to whoever fixes it. |
| *"The working-hours service is broken"* | **NO SUCH REGRESSION** | It resolved into the three separate items above plus SV-8851. |

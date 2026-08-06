# Defect tickets — what is filed, and what is a CANDIDATE awaiting your authorisation

**RULE CHANGE, 2026-08-06, and it governs everything below.** The QA lead withdrew the standing
authorisation to file defects. His words: *"For now we need to create the test cases which are
authentic… However you can keep on sharing such things to me and ask me if I want to create a ticket
for such things. Not stoping you… just asking you to just ask me if I want to create a ticket for
that or not."*

**No ticket has been filed since that instruction arrived, and none will be.** Deep testing
continues exactly as before — mechanism established, duplicate search run, evidence captured, and an
honest attempt made to disprove each finding first — but the output is a **package handed to you**,
not a ticket.

---

## ⚠️ ONE TICKET WAS FILED BEFORE THE RULE CHANGE — your call on whether it stands

**[SV-8933](https://shopview.atlassian.net/browse/SV-8933)** — *"Working hours cannot be opened for a
staff member who belongs to another location"*. Story Defect · priority Low · parent **SV-8699** ·
`relates to` SV-8699 · status Open · created **2026-08-06 00:22:56 −0500**.

It was filed under the previous standing authorisation, **roughly forty minutes before the new
instruction arrived**. It has not been touched since and no further writes have been made anywhere in
Jira. **If you would rather it had not been raised, say so and it will be closed with a plain
withdrawal comment** — closed, never deleted, so the reasoning stays on the record.

Full package for it is in section C1 below, exactly as it would be handed over had it waited.

---

## ⚠️ AND ONE TICKET WE FILED EARLIER TODAY IS INVALID — recommend withdrawal

**[SV-8923](https://shopview.atlassian.net/browse/SV-8923)** — *"the Business Hours switch shades
nothing"*. **It is wrong, and the proof is in `SV-8923-SHOULD-BE-WITHDRAWN.md`.** It was raised while
the shop had **no business hours configured at all**, which breaches the source case's own
precondition (*"The shop has working hours set"*). With hours set, shading works perfectly — 40
shaded elements ON, 0 OFF, 40 ON again, in two bands measuring exactly 6.0 hours each, covering
00:00–06:00 and 18:00–24:00. **Not actioned. Your call.**

---

# CANDIDATES — AWAITING AUTHORISATION

Each is ready to submit. One word from you is enough.

---

## C1 — Working hours cannot be opened for staff of another location *(ALREADY FILED as SV-8933 — see above)*

**The symptom, in plain words.** If a staff member belongs to a different location from the one you
are currently working in, you can still find them in the Staff list and open their record — but the
moment you switch on *"Set custom hours for this technician"* the screen shows an error and flips the
switch back off. There is no way to reach their hours from where you are.

**The mechanism, not just the symptom.** The dialog calls
`GET /api/staff/{staff_id}/working-hours` and is told **404 `{"errors":[{"error":"'Staff' was not
found."}]}`** — while the *same id*, on a neighbouring call made by the same dialog moments earlier,
succeeds: `GET /api/staff/{staff_id}/enrolled-workplaces` → **200**. The record plainly exists. The
working-hours lookup is filtered by the session's **current workplace**; the Staff list is not.

**Proven by switching location, deterministically and reversibly:**

| Session location | Benjamin Peters | Ayesha Khan AK |
|---|---|---|
| Heavy Duty - 9919 | **404** | 200 |
| Lethbridge - 4310 | **200** | 200 |
| Heavy Duty - 9919 again | **404** | 200 |

**Scope, measured not estimated:** every staff record probed on its `staff_id` — **63 of 161 fail,
98 succeed**. Technicians are worst hit, 34 of 54. Not one record, and not the whole service.

**Spec requirement it breaches, verbatim.** Schedule specification, Confluence page 713031682,
version 23, **§4.2 (Working Hours)**: *"Set custom hours for this technician" reveals a per-day
(Mon-Sun) From/To editor for that technician.* No condition about the viewer's location is stated.
**Honest caveat: if per-location hours are in fact intended, then the defect is that the screen offers
an action it cannot complete, rather than the scoping itself.** The ticket says so explicitly.

**Duplicate search — five JQL queries, none matches.** Every descendant of epic SV-8685 (68 issues);
`text ~ "working hours"`; `text ~ "custom hours"`; `summary ~ "hours"`; `text ~ "Staff was not
found"`. Nearest: SV-8887/8890/8891/8892 are all about the editor *once open* (minute granularity,
overlap colour, row alignment, end-before-start) — this is about it never opening. SV-8851 is the
board's Tech Hours switch. SV-8827 is that switch's default. SV-8831/SV-8922 are the inverse.

**Exact test data, by on-screen name.** **Benjamin Peters**, staff of **Staging Lethbridge - 4310**
(`staff_id 11d2d65b-d8c5-48cf-b34b-382f039d2e12`), viewed while on **Staging Heavy Duty - 9919**.
Contrast case in the same sitting: **Ayesha Khan AK** (`staff_id 1e81b8a0-…`), who belongs to Heavy
Duty and whose hours open normally — which is what shows the editor itself is healthy.

**What was tried and ruled out:** that it was one unlucky record (no — 63 of them); that the whole
service was down (no — 98 succeed, and the editor works); that it was the person rather than the
location (no — the same person works from the other location).

**Owning story: SV-8699 (Working Hours Settings).** Rule 51 check: **not API-only** — reachable
entirely through the screens, so a manual tester hits it with no tooling.

**Body:** `tickets/SV-8933-payload.json`, seven sections.

---

## C2 — Month view shows the VIN on some blocks when the specification says it must not

**Status: needs its duplicate search re-run and the count re-confirmed before hand-over.** Recorded
now so it is not lost; **not ready to submit**, and deliberately not presented as if it were.

**The symptom.** In Month view, **9 of 25** shift blocks display the VIN. Day and Week views are
where the VIN belongs.

**Spec requirement, verbatim.** Schedule specification v23, **§4.4**: *"Shown in day and week views
only; month view omits it due to space constraints."*

**Case:** `SCH-VIEW-04` = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045). Items
1, 2, 4 and 5 of that case pass, including the day-view lane growing 104px → 123px.

**Owning story:** SV-8700 (View Options, Color System & Display Customization).

**What is still owed before this is handed over:** a fresh duplicate search (SV-8835 is adjacent —
*"Hover tooltip shows VIN even when the VIN toggle is off"* — and the two must be told apart in
writing), and a re-count on the current build.

**Meanwhile the case does its job without a ticket.** C30045 carries the documented expectation and
the no-ticket variant of the monitoring block, so a tester still fails it and still reports it.

---

## Not candidates — findings that turned out NOT to be defects

Recorded because a finding that dissolves is worth as much as one that stands, and because two of
these nearly became false tickets.

| Finding | Verdict | Why |
|---|---|---|
| *"Saving a technician's working hours does not persist"* | **NOT A DEFECT — our own harness bug** | The Save button was clicked without being scrolled into view, so the click landed on nothing. Scrolled first, the `PUT` fires, returns 200 and the value reads back. |
| *"The Business Hours switch shades nothing"* (**SV-8923**, already filed) | **NOT A DEFECT — invalid ticket** | Observed with no business hours configured, breaching the case's own precondition. With hours set, shading is correct to the pixel. |
| *"The board payload carries no hours data"* | **FALSE** | It carries a `workingWindows` array of 162 entries with correct per-technician ranges. The grid simply does not render them — a sharper statement of SV-8851, useful to whoever fixes it. |
| *"The working-hours service is broken"* | **NO SUCH REGRESSION** | It resolved into the three separate items above and SV-8851. |

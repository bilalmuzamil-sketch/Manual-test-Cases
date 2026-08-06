# The "working-hours service is broken" report — RESOLVED into three separate things

**This supersedes `TECH-HOURS-REGRESSION-2026-08-06.md`.** That note is kept unchanged as the
record of what was seen; this one records what the owed investigation actually established.

**Headline: the service is NOT broken. One of the three symptoms was our own harness bug, one is an
already-ticketed known defect, and one is a real, unticketed, user-facing scoping defect.**

Build throughout: **`v3.5-7ec992f`**, last-modified Wed 05 Aug 2026 22:49:36 GMT, etag
`e2a80a6ab5e0b47c29fd88af9db1e980`, `index.html` sha256 `66e91c52…dbbc53` — read at
**2026-08-06 04:58Z**, identical to the previous session's start and end reads. **No redeploy.**

---

## Symptom 2 — "saving a technician's hours does not persist" — **FALSE. It was our own bug.**

This is the important one, because it was the basis for calling the service broken and for blocking
`SCH-START-01 = C29969`.

**What actually happened:** the script that "saved" clicked the **Save & Close** button at its
bounding-box centre **without first scrolling it into view**. In the staff dialog that button sits
below the fold, so the click landed on nothing. No request was sent, the dialog stayed open, and
that was read as "the save does not persist".

**Proof, on the same build, minutes apart:**

| Run | Method | Result |
|---|---|---|
| `w3.mjs` | edit hours, click Save **without** `scrollIntoViewIfNeeded` | **0 requests**, dialog stays open |
| `w7.mjs` | edit hours, `scrollIntoViewIfNeeded` **then** click | `POST /change` **201** + `PUT /working-hours` **200** |

The `w7` PUT carried the edited value — `{"dayOfWeek":1,"startMinute":420,"endMinute":1200}` —
and re-opening the record read back **20:00**. **The save persists correctly.**

A control confirms the mechanism from the other side: with hours **untouched** but the button
scrolled into view (`w4.mjs`), the save fired both requests and closed the dialog every time. So the
variable was never the hours — it was whether our click reached the button.

**Consequence: `SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) is
NO LONGER BLOCKED by this.** A technician can be given a distinct window through the UI.

**Near-miss avoided:** had this been filed, it would have been a false defect asserting that saving
working hours does not work — when it does. Evidence `evidence/batch8/w7.json`.

---

## Symptom 1 — "the grid shows no technician hours" — **REAL, and already ticketed as SV-8851.**

**Re-observed live today, and it reproduces exactly.** With `Tech Hours` in View Options driven
from `aria-checked=false` to `true`:

* **0 of 23 technician rows** show any hours text.
* **Ayesha Khan AK — who demonstrably has stored working hours** (`GET
  /api/staff/1e81b8a0…/working-hours` → **200**, ranges Mon–Fri) — renders as
  `AKA | Ayesha Khan AK | <job title>`: initials, name, job title. **No hours.**
* Toggling fires **no board request at all**.

**⚠️ CORRECTION to an earlier technical claim, including one made in the first draft of this file.**
Both the previous session and this one first reported that *"the board payload carries no hours data
anywhere"*. **That is wrong.** The board response carries a **`workingWindows` array of 162 entries**
with correct per-technician ranges — for example MQ Test Tech Qamar
`{"date":"2026-08-03","isWorking":true,"availableMinutes":720,"ranges":[{"startMinute":360,"endMinute":1080}]}`
and Ayesha Khan AK `{"ranges":[{"startMinute":420,"endMinute":1260}]}`. The earlier search missed it
because the recursive key scan ran over an **empty capture** and returned `undefined`, which was read
as "nothing found". **The data is present and correct; the grid simply does not render it.** That is a
sharper and more useful statement of the same defect, and it should go in front of whoever fixes
SV-8851.

This is **exactly** what **[SV-8851](https://shopview.atlassian.net/browse/SV-8851)** describes —
*"Turning on the Tech Hours option in View Options changes nothing on the screen"* — read live
today: **Story Defect, priority Low, parent SV-8700, status Open.**

**Consequence: `SCH-VIEW-09 = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050)` is
settled as a DEVIATION on SV-8851, which is what its existing text already says.** The earlier
same-day flip to **PASS — "fixed"**, and the accompanying report that *SV-8851's fix had shipped
while its ticket sat Open*, are **not reproducible and should be treated as withdrawn.** No fix has
shipped. Evidence `evidence/batch8/w10.json`.

---

## Symptom 3 — "one staff member's hours cannot be loaded" — **REAL, unticketed, and it is LOCATION SCOPING**

**The mechanism, not just the symptom.** Opening **Benjamin Peters** (staff of
**Staging Lethbridge - 4310**) while the session is on **Staging Heavy Duty - 9919** and turning on
*"Set custom hours for this technician"* fires:

```
GET /api/staff/11d2d65b-d8c5-48cf-b34b-382f039d2e12/working-hours
  -> 404 {"errors":[{"error":"'Staff' was not found."}]}
```

…while **the very same id** on a neighbouring call succeeds:

```
GET /api/staff/11d2d65b-d8c5-48cf-b34b-382f039d2e12/enrolled-workplaces
  -> 200  (Staging Lethbridge - 4310)
```

So the staff record plainly exists. The UI then shows the inline error
*"Couldn't load this technician's hours, so they can't be edited right now. Close and reopen the
dialog to try again."*, and the toggle snaps back to OFF — no editor ever appears.

**The decisive experiment — switching location flips it, deterministically and reversibly:**

| Session location | Benjamin Peters | Ayesha Khan AK |
|---|---|---|
| Heavy Duty - 9919 (start) | **404** | 200 |
| Lethbridge - 4310 | **200** | 200 |
| Heavy Duty - 9919 (restored) | **404** | 200 |

**So `working-hours` is scoped to the session's CURRENT location — but the Staff list shows staff
from OTHER locations, opens them, and offers the toggle.** That mismatch is the defect: the screen
offers an action it cannot complete.

**Scope, measured rather than guessed:** all 161 staff were probed by `staff_id` —
**63 return 404, 98 return 200** (`evidence/batch8/working-hours-scope-by-staff.txt`). It is not one
staff member and it is not the whole service.

**A methodology note worth keeping:** a first scope pass reported **161 of 161 failing** and was
**wrong** — it used the staff-list `id` field, where this endpoint wants the separate **`staff_id`**
field on the same record (Ayesha: list `id` `24e7590c…` vs `staff_id` `1e81b8a0…`). This is the same
user-id-vs-staff-id trap already recorded in CLAUDE.md for Custom Roles. Both figures were checked
against the browser's own calls before anything was concluded.

**Duplicate search — five JQL queries, none matches:**

| Query | Nearest hits | Why not a duplicate |
|---|---|---|
| every descendant of epic SV-8685 (68 issues) | SV-8887, SV-8890, SV-8891, SV-8892 (all on SV-8699) | all concern the hours **editor** — minute granularity, overlap colour, row alignment, end-before-start validation. None is a failure to **load**. |
| `text ~ "working hours"` | SV-8851 | the grid toggle, i.e. symptom 1 |
| `text ~ "custom hours"` | — | nothing on load failure |
| `summary ~ "hours"` | SV-8827 | the toggle's **default state** |
| `text ~ "Staff was not found"` | SV-8831, SV-8922 | the **inverse** — someone on the grid with no staff record for the location |

**Rule 51 check: this is NOT API-only.** It is reachable entirely through the screens — Staff list →
open a staff member of another location → toggle. A manual tester hits it with no tooling. **So it
is filed** rather than sent to `API-ASK.md`.

---

## What this changes for the suite

| Case | Before | Now |
|---|---|---|
| `SCH-VIEW-09` = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | re-opened, unsettled, "must not be written either way" | **DEVIATION (SV-8851)** — settled, live-observed today |
| `SCH-START-01` = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) | blocked — "saves do not persist" | **unblocked** — saves persist; drive it |
| `C38847`, `C38849`, `SCH-START-02` = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) | *possibly* blocked by the same service | **not blocked by it** — they need shop business hours on Edit Location, a separate screen |

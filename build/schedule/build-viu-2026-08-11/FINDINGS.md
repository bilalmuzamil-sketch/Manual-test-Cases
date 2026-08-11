# Schedule build VIU — findings, 2026-08-11

**Nothing here is filed anywhere.** The Jira ticket-creation hold is active (Standing Rule 62 and the
hold at its tail), and none of these is a product defect in any case. **0 Jira calls of any kind.**

---

## F1 · The location bounce is FIXED — and it is worth recording as a positive finding

The second attempt's blocker was that **every** route redirected to `/administration/locations`,
because `admin@shopview.com` had `default_workplace: null`. After the QA lead set the default
location, **`/schedule` no longer goes there.** Measured, not assumed: it now redirects to
`/login?redirect=/schedule` (`evidence/step0-landing.png`).

**Recorded because a cleared blocker is as worth knowing as a new one** — the next pass should not
re-derive the location diagnosis, or waste a run re-testing five routes to prove it.

**Not a defect. Nothing to file.**

---

## F2 · Editing a staff record kills that user's session — the documented behaviour, observed again, and it now has a cost worth naming

**Observation.** The session behind the supplied cookie set went from **HTTP 200 at ~13:00** to
**HTTP 409 `{"errors":[{"error":"Session has expired."}]}` at 13:16:21Z**, across every endpoint
tried, and stayed there through re-probes at 13:18:46Z and 13:22:38Z. In the same window the QA lead
edited `admin@shopview.com` **twice** — the default location, then the working hours.

**This is a recorded, expected behaviour of the estate, not a product defect.** The playbook already
holds it: *"Changing a user's role immediately invalidates the held session — the very next request
returns HTTP 409 'Session has expired.' (at +0ms). The new role applies on a fresh login… This 409 is
expected, not an error."* (`build/APP-ACTIONS-PLAYBOOK.md`, *Role change forces re-auth (409)*).

**What is genuinely new, and is the reason this is written up at all:** the playbook records it for a
**role** change. Here it fired on a **default-location** change and, apparently, again on a
**working-hours** change — i.e. it appears to be **any edit to the staff record**, not specifically the
role. **Stated as an observation with its limit: two edits, one dead session, and we could not read the
record afterwards to confirm which edit did it.** It is not asserted as proven.

**The operational consequence is the useful part, and it will otherwise burn a cookie set:**
**complete all account configuration FIRST, then sign in, then send the cookies.** A set minted
between two edits is dead on arrival.

**Not a defect. Nothing to file.** Belongs in the playbook as a widening of an existing entry —
**flagged, not edited from here**, since the playbook is shared and a sibling may be writing to it.

---

## F3 · A harness gotcha that cost the previous attempt, now solved

**`chromium.launch({proxy:{server:$HTTPS_PROXY}})` does NOT work on this estate** — the page lands on
**`about:blank`** with zero requests issued. Chromium cannot TLS the egress proxy directly.

**The pattern that does work** (and is what the previous pass's `boot.cjs` did, though that detail was
not written down as the reason): intercept **every** request with `ctx.route('**/*')`, re-issue it with
node `fetch` — which honours `HTTPS_PROXY` — and `route.fulfill()` the response back into the page,
attaching the cookie header on the way. Working implementation: `tools/step0_land.cjs`.

**Worth recording because the failure mode is silent:** no error, no timeout, just a blank page and an
empty request log, which reads exactly like a dead environment.

**Not a defect. Nothing to file.** Playbook §A candidate — flagged, not edited.

---

## F4 · The `PHPSESSID` 409 is distinguishable from a dead shared token, and the distinction was load-bearing today

Kept as a worked example because getting it wrong sends the wrong ask:

| Symptom | Meaning | What to ask for |
|---|---|---|
| **409** `Session has expired.`, `application/problem+json` from nginx | The request **reached the app**; the session record behind this `PHPSESSID` is invalidated | **A fresh sign-in** |
| **401** `{"error":"sso_required"}` on **all** branches on a byte-identical shared token | The **shared `sv_sso_session`** is dead | **A fresh `sv_sso_session`** |

Today's set gave **409 on all three API hosts and never 401**, while the older Reports set gave
**401 on all three** — a clean control, side by side, in the same minute. **So the ask is a fresh
sign-in, and asking for a `cf_clearance` or "new cookies" would have been the wrong ask.**

**Not a defect. Nothing to file.**

---

## F5 · The working-hours configuration is UNVERIFIED, and that is itself the finding

The QA lead reports 07:00–19:00 Monday–Friday, Saturday not working, Sunday unconfirmed. **We could
not read any of it** — `/api/staff` returns 409 like everything else. **So every hours-dependent case
remains blocked on a precondition nobody has yet confirmed in the environment**, and under Rule 12 it
is NOT VERIFIED rather than taken from his screenshot.

**This is the SV-8923 trap in its live form.** That ticket was withdrawn as invalid precisely because
a defect was raised against a shop whose configured hours did not match the source case's own stated
precondition. **The check is therefore not optional: read the stored hours, compare them against what
each case's precondition states, and only then observe.** Where a case needs different hours, that is
a blocked observation with a reason on that case's record — the case is not reinterpreted and the
environment is not adjusted.

**Not a defect. Nothing to file.**

---

## F6 · The build renders these panels UPPERCASE via CSS — read the raw text nodes, never the screen

`textContent` is immune to CSS `text-transform`; `innerText` is not. The Schedule toolbar panels are
styled uppercase, so the screen (and any `innerText` dump) shows `FILTER & DISPLAY` and `VIEW OPTIONS`,
while the shipped strings are **`Filter & display`** and **`View options`**.

**This decided both of our internal label clashes, and a screenshot alone would have decided them
wrongly** — twice. Recorded as a method fact: a label diff on this product reads the raw text nodes.

**Second half of the same lesson, and the sharper one: prefer the VISIBLE string over the ACCESSIBLE
NAME.** The toolbar button carries `aria-label="Filter and display options"`, on all 15 surfaces, so a
containment check "finds" our `Filter and Display` wording in the build — in a string **no manual tester
can ever see**. A diff that accepts the accessible name will certify the wrong label with confidence.

**Not a defect. Nothing to file.** Playbook §A/§J candidate — flagged, not edited (a sibling may be
writing to it).

---

## F7 · ✅ RESOLVED — the before/after-hours flag IS measured per technician. The build is CORRECT and C30025's claim is UPHELD

**This was left open last round because the flagged shifts belonged to technicians whose hours we had
not read. They have now been read, and the answer is unambiguous: the build is right and our suspicion
was wrong.**

**The decisive source:** `GET /api/schedule/board?from=<ISO-Z>&to=<ISO-Z>` returns, in one payload,
each shift's **`conflictReasons`** *and* **`workingWindows` per `staffId` per date** — so every conflict
can be checked against **its own** technician's window without touching the UI.

**Two technicians on the SAME board have DIFFERENT hours, and each message quotes ITS OWN technician's
boundary. That is what settles it:**

| Shift | Technician | That technician's hours | Shift, shop-local | Reason | UI quoted |
|---|---|---|---|---|---|
| Goport Energy | **Alicia Campbell** | **06:00 – 15:00** | Tue 08:15 → **18:00** | `after_hours` | **"(3:00 PM)"** = **her 15:00** ✅ |
| Fuline Enterprises | **MQ Test Tech Qamar** | **07:00 – 19:00** | Tue **06:00** → 14:43 | `before_hours` | **"(7:00 AM)"** = **his 07:00** ✅ |
| Xamont Holdings | MQ Test Tech Qamar | 07:00 – 19:00 | Tue **06:00** → 13:15 | `before_hours` | **"(7:00 AM)"** ✅ |
| Brabay Maintenance | Mudassir Qamar | 06:00 – 15:00 | Mon 07:00 → **18:30** | `after_hours` | 3:00 PM boundary ✅ |
| Zuline Builders | MQ Test Tech Qamar | 07:00 – 19:00 | Mon **05:00** → **00:00** | both | 7:00 AM / 7:00 PM ✅ |

**Arithmetic checked in the shop's own timezone** (America/Edmonton, UTC−6 in August), and **every row
holds in both directions** — each flagged shift genuinely breaches its own technician's window, and no
unflagged shift does.

**Why it looked wrong before, stated plainly:** we compared a 3:00 PM boundary against
**`admin@shopview.com`'s** 07:00–19:00. The 3:00 PM shift belongs to a technician configured
**06:00–15:00**. **Refusing to call that a defect was the right call** — filing it would have been the
[SV-8923](https://shopview.atlassian.net/browse/SV-8923) mistake exactly: a defect raised against a
configuration nobody had checked.

**⚠️ ONE GENUINE OBSERVATION SURVIVES, AND IT IS THE BUILD'S OWN WORDING.** The message says
**"business hours"** while the boundary is demonstrably the **technician's** configured window. **The
label says business; the arithmetic is per-technician.** That is mildly misleading to a tester and is
recorded for the QA lead — **a wording matter in the BUILD, not an error in our case.** **Nothing
filed** (creation hold).

**Confirmed a third independent way:** each block's own `aria-label` carries the same phrase — e.g.
*"Shift (conflict: Starts before business hours, Double-booked): Xamont Holdings, 70061328, 4 Lines,
opens shift details…"*. Evidence: `evidence/board.json` equivalent capture in
`evidence/surfaces2-dump.json`, `evidence/working-hours-admin.json`.

---

## F8 · `Adjust` is not in the shift modal under any wording — recorded, not filed

**C30014** ([link](https://shopview.testrail.io/index.php?/cases/view/30014)) asserts the conflicted
shift's modal *"offers an 'Adjust' action"* which *"leads to a way to resolve the conflict"*.

**Observed:** a conflicted shift's modal **does** carry the conflict text (`Double-booked with Goport
Energy`), so the banner half is right. But the modal's actions are **`Delete shift`**, **`Close shift
details`**, **`Add Note`**, **`Edit estimated hours for <line>`**, **`Change colour`** and **`Open work
order S-12876 in a new tab`**. **No `Adjust`, and no near-neighbour** across 909 harvested strings.

**Under the re-scoped brief this is NOT ours to verdict** — the manual tester marks the case passed or
failed. It is recorded here with its evidence so the tester is not left hunting a control that appears
not to exist, and so the QA lead can see it. **The case KEEPS its documented expectation (Rule 57); it
is not rewritten to match the build.** **Nothing filed** (creation hold, Rule 62).

---

## F9 · A closed enumeration in C30015 has gone stale — the Rule-42 time bomb, live

`C30015` item 1 says the modal offers Delete and close *"and no other actions"*. The build offers four
more (F8). **The case's actual point — that there is NO `Reassign` action — is CONFIRMED correct.**
Repair is a scope-conditional rewrite of item 1, not a deletion of the assertion. Staged in
`LABEL-DIFF.md` §2.6.

---

## F10 · The specification's right-click contradiction is settled by observation — the build is LEFT-click

Our records already carried this as a spec defect: **§7 says the cell menu opens on left-click while
§14.1 and §14.2 twice call it a right-click menu.** Observed: **left-click opens it** (headed
`MQ Test Tech Qamar · Tue, Aug 11 · 21:15`, items `Create Event` and `New Work Order`); **right-click
adds nothing at all** — that surface captured **zero** new strings.

**So C30054 is correct on all five of its points, and the SPECIFICATION is wrong in two places.** A
documentation defect for the PO — **not a case change, and nothing filed.**

---

## F11 · ✅ THE SCOPE PICKER OPENED — AND MY EARLIER "TOOLING LIMIT" CONCLUSION WAS WRONG. The drag works; I had been dragging a ONE-LINE order

**This is a correction of my own finding, recorded in full rather than quietly replaced, because the
mistake is instructive and it is exactly the class of error I had just warned about in F7.**

**WHAT I CONCLUDED, AND IT WAS WRONG:** after six failed techniques I wrote that the drag was a genuine
tooling limit and that 10 cases could not be observed. **The evidence looked strong** — FullCalendar
`resourceTimeline`, no HTML5 drag source anywhere, `data-schedule-drop` on 0 elements, and
instrumentation proving `pointerdown` ×2 / `pointermove` ×51 / `pointerup` ×2 were delivered while
nothing happened.

**WHAT WAS ACTUALLY WRONG: THE PRECONDITION.** Every attempt dragged **S-12876 / Pamill Paving — a ONE
LINE work order** (`1 line · 1h Est.`). **The scope picker exists to choose between a whole order and a
subset of its lines, so for a single-line order there is nothing to choose and no picker is expected.**
The build was behaving correctly the entire time.

**PROOF THAT THE DRAG WORKS — and it was hiding in plain sight.** The failed attempts **did** create two
shifts, both on **S-12876**, `staffId: null` (the Unassigned lane), 60 minutes each, at the exact
coordinates targeted. **So the drag completed every time; only the picker was absent, correctly.** I
found them by diffing the board at pass end, not by noticing at the time — which is the second lesson.

**RE-RUN WITH A MULTI-LINE ORDER AND IT OPENED IMMEDIATELY.** Dragging **S8685-13014 / Fuline
Enterprises (6 lines)** onto an empty lane cell produced the picker on the first try
(`evidence/drag4-multiline.png`, `evidence/drag4-multiline-dump.json`).

**LABELS NOW CONFIRMED EXACT, observed live:**

| Our cases assert | Build ships | Verdict |
|---|---|---|
| `Schedule whole work order` | **`Schedule whole work order`** | ✅ **EXACT** |
| `Select multiple` | **`Select multiple`** | ✅ **EXACT** |

**Also captured on that surface**, useful for the same family of cases: the header
**`S8685-13014 · Fuline Enterprises`**, the drop context **`dropped on Service/Parts · Tue, Aug 11`**,
the whole-order option's subtitle **`All 6 lines · 8.7h total`**, the alternative prompt
**`or pick a line`**, the close control **`Close the line picker`**, per-line rows with **`Est. 0.7h`**
style estimates, and the capacity readout
**`Capacity 42% — 75h 56m scheduled of 182h, overtime`**.

**Still not observed: `Select all`, `Cancel`, `Change scope`, `Full estimate`** — these live in the
**`Select multiple`** sub-state and the multi-day spread step, one level deeper than this pass reached.
**They are reachable; the route is now known.**

**🧹 CLEANUP, STATED IN FULL.** The two accidental shifts were **deleted**
(`DELETE /api/schedule/shifts/{id}` → **204** each) and the board **proven restored**: **11 shifts,
id sets equal in both directions, 11 of 11 per-shift hashes identical, events 3, series 4, 0 unexpected
records.** The multi-line run **opened the picker without confirming**, so it created nothing — verified
the same way afterwards.

**🛑 AND THE LINE WAS NOT CROSSED: no shift was ever POSTed to conjure the picker.** The picker was
produced by a real drag on a real multi-line order. The two shifts were **unintended residue of a
failed interaction**, not a fabricated outcome — and they were removed.

**THE LESSON, and it is F7's lesson a second time in one session: check the case's OWN PRECONDITION
before concluding the build or the tooling is at fault.** A single-line order cannot produce a
multi-line chooser. I nearly recorded a build capability as unobservable because I had not read the
precondition of the thing I was trying to observe.

---

## F12 · Two admin routes recorded so nobody guesses them again

`/administration/working-hours` and `/administration/roles` are **not routes** — both render an empty
shell. The real ones, reached by clicking the admin nav:

- **`/administration/roles-permissions`** (Roles & Permissions)
- **`/administration/staff`** (Staff)
- `/administration/locations` and `/administration/settings` are correct as-is.

`Reset To Template`, `Add hours`, `Set business hours for this shop` and `Set custom hours for this
technician` live **inside dialogs on those pages** which this pass did not manage to open — a click-
targeting shortfall, **not** an access or data problem. **`admin@shopview.com` was deliberately skipped
when picking a staff row**, since editing it is what killed the session earlier.

---

## F13 · ✅ SV-8886 IS **NOT** A FALSE DEFECT — `Select all` and `Cancel` are genuinely absent, and C29967 is CORRECT

**This was checked precisely because it COULD have been our second precondition error in one session.
It is not. The absence is real, and it was measured from the state where those controls must appear.**

### What makes this the right state to judge from — stated first, per the precondition rule

The state was driven to satisfy every condition §4.3 attaches to those controls:

1. A **MULTI-LINE** order — **S8685-13014 / Fuline Enterprises, 6 lines** (not the one-line order that produced my F11 mistake).
2. The **scope picker open**, headed `S8685-13014 · Fuline Enterprises`, `dropped on Service/Parts · Tue, Aug 11`.
3. **`Select multiple` actually clicked** — confirmed by the surface changing, not assumed from the click.
4. **Two line checkboxes ticked** — 2 checkboxes found and clicked.
5. **🔑 THE CONFIRM BAR IS PRESENT AND RENDERING** — it shows the tally **`2 selected · 1.7h`**.

**Point 5 is the decisive one: the very bar that §4.3 says carries the tally, `Select all` and `Cancel`
IS on screen and IS rendering its tally.** So this is unambiguously a state where the other two controls
should appear. **An absence measured here is a real absence** — unlike the arm control measured on the
Locations page, or the picker measured on a one-line order.

### The measurement

Searched **`document.documentElement.innerHTML`** — the entire DOM including hidden and off-screen
nodes, which is stronger than a visibility test:

| Label | In markup at all | Exact text nodes | Visible |
|---|---|---|---|
| **`Select all`** | **NO** | **0** | no |
| **`Cancel`** | **NO** | **0** | no |
| `Change scope` | NO | 0 | no |
| `Full estimate` | NO | 0 | no |

The only near neighbours of "Select" are **`Select multiple`** and the tally **`2 selected · 1.7h`**.

### Consequences — all three, and none of them is a retraction

- **SV-8886 STANDS and is STRENGTHENED**, by an independent observation on a *different* work order
  (6 lines) from the one in its own steps (2 lines) — which corroborates its own claim that *"any work
  order with two or more approved lines behaves the same way"*.
- **C29967's assertion is CORRECT** and its verdict does **not** flip. The earlier forensic restoration
  of that absence claim **restored a TRUE assertion** — worth stating, because the concern was that it
  might have restored an incorrect one.
- **The tally shape defect is corroborated too:** the bar reads **`2 selected · 1.7h`**, matching the
  ticket's complaint that it is not the `Create shift - 2 lines - 6h` shape §4.3 specifies.

### Why SV-8886 is NOT in the SV-8923 class, which is the question that was asked

**SV-8923 was withdrawn because it was raised from a shop with no business hours configured — a
precondition its own source case required.** SV-8886's own reproduction steps **do** enter the sub-state
(step 5 *"Click 'Select multiple'"*, step 6 *"Tick one line"*) before reading the bottom bar. **It was
measured from the correct state when it was filed, and our re-measurement agrees.**

**Read live, not assumed:** SV-8886 is a `Story Defect`, parent **SV-8689 (Scope Picker)**, priority
**Medium**, **status In Progress**, assigned to **Stefan Vukovic**, last updated 2026-08-11T07:30−0500.
**Someone is already working on it.** **Nothing was filed, withdrawn, commented on or transitioned** —
ticket changes are the QA lead's call and the creation hold is active.

### Still unobserved, with the reason

**`Change scope`** and **`Full estimate`** are **not in the picker or its tick-box sub-state at all**.
They belong to the **multi-day spread step**, which is one level further on — **past the confirm button**.
Reaching it means committing a real shift, and this pass deliberately escaped instead:
**board verified 11 shifts, id sets equal both directions, 11 of 11 per-shift hashes identical, events 3,
series 4, 0 added, 0 removed.** The route is known and the next pass can take it with cleanup planned.

**Evidence:** `evidence/picker-substate.json`, `evidence/picker-substate.log`,
`evidence/pick-01-picker.png`, `evidence/pick-02-select-multiple.png`, `evidence/pick-03-lines-ticked.png`.

---

## F14 · The four dialogs were NOT reached — and the reason is a new observation that needs one confirmation before anyone calls it a defect

**Not closed. Reported honestly rather than dressed up.**

**What happened:** the Roles & Permissions and Staff admin lists **render no rows**, so there was no row
to click and no dialog to open. The Staff page shows **`Active(0)`** / **`Deactivated(0)`** and the
empty-state string **`Empty bays, endless possibilities. Get Going!`** — while
**`GET /api/staff?limit=200` returns 64 staff records**, read in this same session minutes earlier.

**🛑 I AM NOT CALLING THAT A DEFECT, AND THE PRECONDITION RULE IS WHY.** Twice this session an
"absence" turned out to be an artefact of the state I was standing in. Here there is a live, untested
alternative explanation: **this page is reached through a hydrated SPA session**, and the request the
list makes may be failing for a reason belonging to my harness rather than to the product — the three
filters (`All Permissions`, `All Locations`, `All Departments`) are another candidate. **I did not
isolate it, so I am not claiming it.**

**What would settle it in one minute:** open `/administration/staff` in a normally signed-in browser. If
the 64 staff appear, this is my harness and nothing more. If it is empty there too, it is a real defect
worth a ticket — and a notable one, since it is the page an administrator manages people from.

**Consequence for this pass:** **`Reset To Template`** (C38926), **`Time Clock`** (C30084),
**`Add hours`** (C38850), **`Set business hours for this shop`** (C38847) and **`Set custom hours for
this technician`** (C38848, C38849) remain **NOT OBSERVED**, with that reason recorded. **The routes are
correct** (`/administration/roles-permissions`, `/administration/staff`, `/administration/locations` —
F12); it is the row-level targeting that is blocked, and it is blocked by an empty list rather than by a
selector I can improve.

**Nothing was seeded to work around it.** Creating a staff member to populate a list that should already
show 64 would have **manufactured the condition** rather than tested it — and it would have put a
throwaway person into a shared org for no gain. Seeding was authorised; it was not the right tool here.

---

## Deviations observed against the documents

**⚠️ THE PARAGRAPH THAT STOOD HERE IS SUPERSEDED AND IS KEPT DATED RATHER THAN DELETED.** It read:
*"None — and that is a statement about how far this pass got, not about the product. No page of the
product was reached…"*. **That was true at 13:28Z and false by 13:36Z**, when the fresh sign-in arrived
and the Schedule page was reached.

**What was observed, stated as labels-and-navigation only (the re-scoped brief):** 15 surfaces, 909
distinct build strings, **12 cases needing a wording correction** (`LABEL-DIFF.md`), and the incidental
observations F6–F10 above. **No pass/fail behaviour verdict was reached or claimed** — the manual QA
tester marks the cases, per the QA lead's 2026-08-10 ruling confirmed 2026-08-11.

**The 174 cases' recorded verdicts still rest on earlier builds** — 90 on `v3.5-7ec992f`, 78 on
`v3.5-d122eef` (which no longer exists), 6 on `v3.5-af3a6e1` — and **this pass did not re-verdict
them**, because verdicting is no longer our job. What it establishes is that **their LABELS are now
checked against `v3.5-65d6500`** to the extent set out in `BUILD-VERIFICATION.md`.

## AUTOMATED CASES CHANGED — FOR VLAD

**None.** No case was changed by this pass — **0 TestRail writes of any kind** — and `custom_atmstatus`
is **1 (Not Automated) on all 174** Schedule cases, re-measured live by the previous pass earlier
today and unchanged since, there having been no write. **Nothing for Vlad to adjust.** (Standing
Rule 65: the section is stated even when empty.)

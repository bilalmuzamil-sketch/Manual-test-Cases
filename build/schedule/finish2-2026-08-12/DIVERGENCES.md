# Schedule — divergences found by the runnability walk, 2026-08-12 (finish2 pass)

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285ffcf50626363a578fe273071` ·
`index.html` sha256 `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` · read at
**2026-08-12T07:11:17Z**. Unmoved since 11 August.

A divergence is recorded here when a **precondition or a step** the sources describe **cannot be
carried out on this build**. **Nothing here has been silently rewritten to match the build, and no
expected behaviour has been changed** — expectations still come only from the specification, the epic
and the recorded answers (Rule 57).

The test applied to each: **would a reader of the source recognise what the build offers as the same
thing?** If yes it is cosmetic and is corrected. If no it is substantive, and **the case keeps what
the source says.**

**No ticket has been raised for anything below — the creation hold is active** (Standing Rule 62 and
the 2026-08-10 ruling, verbatim: *"Do not create anything until my next order."*). Both are written
up ready to file.

---

## THE HEADLINE: THREE CANDIDATE DIVERGENCES COLLAPSED WHEN CHECKED HARDER

This is the more useful half of the pass, so it goes first. Three results looked like divergences on
the first measurement and **are not**. Each would have been a plausible, confident, wrong finding.

| Case | What the first check said | What a proper check showed |
|---|---|---|
| [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | day view opens at **12 AM**, not the working-day start | **the window was too wide to test it.** At 1680 px the whole 24-hour day nearly fits (1155 px visible of 1248), so `scrollLeft` was already at its maximum of 93. Narrowed to **900 px** the case passes on **all five** of its expected results — see below |
| [C30006](https://shopview.testrail.io/index.php?/cases/view/30006) | the now-line label is **not visible** | **it is not supposed to be.** The chip sits at `opacity: 0` at rest and the case asks for it **on hover**. Hovered, it reads **`7:34 AM`** and opacity goes **0 → 1** |
| [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | there is **no editable estimated-hours field** in the modal | **there is.** Clicking the hours value (`1h`) reveals `input_shift_line_estimate_<uuid>`. It is inline-editable exactly as the case says |

**C30001 in full, because it is the strongest pass in the suite.** At 900 px: it opens with **6 AM**
at the left edge against a **7:00 AM** business start — the *"roughly 30 to 60 minutes"* buffer the
case asks for. A manual scroll to **5 PM** **survived** idling and interaction (`scrollLeft` 873 both
times). Navigating to the next day **re-triggered** the auto-scroll, back to 6 AM. The timeline stayed
a **full 24-hour** scroller (24 hour labels, `maxScroll` 873). That is expected results 1, 2, 3, 4 and
5, each observed.

---

## A · SUBSTANTIVE — the step the source describes cannot be carried out

### A1 · No way to collapse a department group

| | |
|---|---|
| **Case** | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) — *Collapsing a department header hides its technician rows* |
| **Source** | `SV-8686 (§3.2)` |
| **The source says, verbatim** | STEP 1: *"Click a department group header to collapse it."* · EXPECTED 1: *"Collapsing hides that department's technician rows (the group header stays visible)."* |
| **The build offers, verbatim** | the header row is `div.schedule-lane.schedule-lane--department`; its computed `cursor` is **`auto`**; it has **no chevron, arrow or expand child**; and **neither it nor any of its four ancestors carries `aria-expanded`** |

**How hard this was checked before it was written down**, because the project's own standing lesson is
to prove the state a control should appear in before recording it absent:

- **both views** — Week and Day
- **every department header on the page** — `WORK ORDER STATUS`, `SERVICE/PARTS`, `SERVICE`
- **two different gestures** — a synthetic `click()` on the row element, and a **real mouse click at
  the header's own screen coordinates** (402, 222)
- **the lane count read before and after each one: 30 → 30, every single time**
- and a check for any popup the click might have opened instead: **none**

**A tester following step 1 clicks the header and nothing at all happens.**

**Worth knowing, and it is why this is a divergence rather than a missing feature:** the *function* of
hiding a department group **does exist** — the **Filter & display** menu's `Service` / `Work order
status` / `Service/Parts` toggles hide them, proven live on
[C30043](https://shopview.testrail.io/index.php?/cases/view/30043), where turning `Service` off took
the lane count **30 → 9**. But that is **a different control in a different place**, and no reader of
*"click a department group header"* would recognise a toolbar menu as the same thing.

**Recommendation: one Story Defect against `SV-8686`, priority Medium** (Rules 52/53), when the hold
lifts.

### A2 · The Tech Hours toggle displays nothing — and the precondition it needs is PROVEN MET

| | |
|---|---|
| **Case** | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) — *Tech Hours toggle displays each technician's working hours next to their name* |
| **Source** | `SV-8700 (§9 (Tech Hours))` |
| **The source says, verbatim** | EXPECTED 1: *"Each technician's working hours are displayed next to their name in the row header."* · EXPECTED 2: *"The hours match the technicians' configured hours."* |
| **The build offers** | turning `Tech Hours` on in **View options** changes **nothing observable**: the technician row headers are **byte-identical** before and after, and no hour range appears anywhere near a name |

**This one matters because the obvious innocent explanation was checked and ruled out.** The case's
own precondition 2 is *"Technicians have configured working hours"* — if nobody had any, an empty
result would be **correct**. So the staff records were read first:

**Six staff were opened in Settings → Staff, and all six carry `Set working hours for this technician`
switched ON**, with per-day values `select_working_hours_start_monday_0` = **`7:00 AM`** and
`select_working_hours_end_monday_0` = **`7:00 PM`**, Monday to Friday — Admin ShopView, Alicia
Campbell, Anthony Mejia, Ayesha Khan, Benjamin Peters and Bilal Muzamil.

**So the hours exist, the toggle exists and is clickable, and nothing is displayed.**

**Also ruled out: a broken click helper.** The very same helper, in the very same menu, drove
`Show Saturday` (7 day columns → 6, proven on
[C30051](https://shopview.testrail.io/index.php?/cases/view/30051)), `VIN Number` (blocks showing a
17-character VIN **0/44 → 27/44**, [C30045](https://shopview.testrail.io/index.php?/cases/view/30045))
and the `Service` department toggle (lanes **30 → 9**, C30043). Three toggles moved the screen; this
one did not.

**Recommendation: one Story Defect against `SV-8700`, priority Medium**, when the hold lifts.

---

## B · WHAT WAS DONE TO THESE TWO CASES, AND WHAT WAS DELIBERATELY NOT DONE

**Not done: their expected results are untouched.** Both still say what the specification says. An
expected result is not ours to change (Rule 57), and a case rewritten to match the build can no longer
fail.

**Done: the smallest change that stops a tester being stranded tomorrow.** Each now carries a plain
note in its expected results, above the provenance line, and its marker moved `AUTOMATION: READY` →
`AUTOMATION: HOLD`:

> *"What you will find on the build as it stands: … Please mark this test BLOCKED, not failed, and do
> not raise a new problem for it — it is already written up and is waiting to be reported."*

**The HOLD reason names the real blocker** — *"a ticket cannot be raised yet"* — because under Rule 61
the right marker for a known failure is `READY - EXPECT FAIL (SV-xxxx)`, and **that needs a ticket
number that the creation hold makes it impossible to have**. Each becomes one edit the moment the hold
lifts. This matches the precedent already recorded in `CLAUDE.md` for exactly this situation.

**The consequence is that the ready-to-automate gate falls from 147 to 145.** That is the honest
direction, and it is the point of the exercise.

---

## C · TWO CASES WHOSE PRECONDITION THIS ESTATE DOES NOT CURRENTLY MEET — reported, NOT recorded as failures

Neither is a divergence. Both are recorded so nobody re-derives them.

| Case | Why it could not be settled |
|---|---|
| [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) — *Lines with no technician show a 'Needs techs' badge* | every line in the work order opened (`S8685-13014`, 6 lines) **has** a technician, so the badge has nothing to appear on. **Not evidence the badge is missing.** Settling it means seeding a line with no technician |
| [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) — *A technician with no custom hours inherits shop business hours* | **all six** staff sampled have custom hours ON, so "a technician with no custom hours" did not exist to look at |

## D · A NOTE ON [C30022](https://shopview.testrail.io/index.php?/cases/view/30022), DELIBERATELY NOT CALLED EITHER WAY

The case says events **default to grey**. Every event block in view renders
`schedule-block--event schedule-block--violet` with a **violet** left border. **But none of these
events is known to have had no colour chosen** — they are pre-existing data and may each have been
given a colour. Settling it needs an event created with the colour left alone, which is a seeding job.
**Recorded as an observation, not a verdict.**

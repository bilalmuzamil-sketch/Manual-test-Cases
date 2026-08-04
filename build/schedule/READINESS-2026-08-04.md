# Schedule — is it ready for automation? (4 August 2026)

**What this is.** We ran every one of the **165 Schedule test cases against the real, running app**
for the first time — the Schedule QA branch at `sv8685.qa.shopview.com`. Before today not one of them
had ever been checked against a build; the whole suite was written from the specification. Every case
now has a definite answer.

**The build we tested:** ShopView **v3.5-4873abe**, checked at the start, the middle and the end of
the day — the same build all three times, so nothing changed under us.

## The one table

| Part of the feature | Test cases | Work correctly on the build | Broken on the build (a ticket is open) | Waiting on the product owner | Not built yet | Needs a free tool built into the browser | **Ready to automate** |
|---|---|---|---|---|---|---|---|
| Who is allowed to do what | 13 | 12 | 1 | 0 | 0 | 0 | **13** |
| Spreading a big job over several days | 10 | 7 | 1 | 1 | 1 | 0 | **9** |
| Deleting and undoing | 9 | 9 | 0 | 0 | 0 | 0 | **9** |
| Dragging a job onto a technician | 8 | 6 | 1 | 0 | 1 | 0 | **8** |
| The shift window | 8 | 4 | 4 | 0 | 0 | 0 | **8** |
| The two toolbar menus | 8 | 6 | 2 | 0 | 0 | 0 | **8** |
| Start times and the Unassigned row | 7 | 6 | 0 | 0 | 0 | 0 | **6** |
| Events (meetings, time off) | 7 | 6 | 0 | 0 | 1 | 0 | **7** |
| Odd situations and small screens | 7 | 4 | 1 | 1 | 0 | 3 | **5** |
| The Schedule page, its three views and the department rows | 6 | 6 | 0 | 0 | 0 | 0 | **6** |
| The work order filters | 6 | 5 | 1 | 0 | 0 | 0 | **6** |
| Opening a work order to see its lines | 6 | 6 | 0 | 0 | 0 | 0 | **6** |
| Clash warnings | 6 | 6 | 0 | 0 | 0 | 0 | **6** |
| The work order list and its search box | 5 | 5 | 0 | 0 | 0 | 0 | **5** |
| The Day view timeline | 5 | 3 | 2 | 0 | 0 | 0 | **5** |
| The hover summary | 5 | 4 | 1 | 0 | 0 | 0 | **5** |
| Setting working hours | 5 | 5 | 0 | 0 | 0 | 0 | **5** |
| Does the rest of the app still work | 5 | 5 | 0 | 0 | 0 | 0 | **5** |
| The little month calendar | 4 | 4 | 0 | 0 | 0 | 0 | **4** |
| Choosing what to schedule | 4 | 4 | 0 | 0 | 0 | 0 | **4** |
| A spread job shown as one run of days | 4 | 3 | 1 | 0 | 0 | 0 | **4** |
| Several jobs at the same time | 4 | 3 | 1 | 0 | 0 | 0 | **4** |
| The capacity bars | 4 | 4 | 0 | 0 | 0 | 0 | **4** |
| Behind the scenes (the data requests) | 4 | 3 | 0 | 0 | 1 | 0 | **4** |
| What a block on the board says | 3 | 3 | 0 | 0 | 0 | 0 | **3** |
| The toolbar | 3 | 2 | 1 | 0 | 0 | 0 | **3** |
| Moving a job to another technician | 3 | 3 | 0 | 0 | 0 | 0 | **3** |
| Keyboard | 3 | 1 | 2 | 0 | 0 | 0 | **3** |
| Colours | 3 | 3 | 0 | 0 | 0 | 0 | **3** |
| **TOTAL** | **165** | **138** | **19** | **2** | **4** | **3** | **161** |

**A manual tester CAN run all 165 of these cases today, with nothing but a browser** — including the
19 that are currently broken (they are *supposed* to fail, and each one names its ticket number so a
red result is information rather than noise) and the 4 on features that are not built yet (each one
tells the tester to mark it **blocked**, not failed).

**Two exceptions, and only two.** **SCH-EDGE-07** needs a daylight-saving clock change, and the next
one is 1 November 2026. **SCH-START-02** needs the shop's business hours switched on, which changes a
setting everyone else sharing this test environment relies on. Both say so on the case and tell the
tester to mark them blocked.

**Three cases ask for a measuring tool** — SCH-EDGE-02, SCH-EDGE-04 and SCH-EDGE-08 check how the
screen behaves at a small width, under heavy load, and in dark mode. **A manual tester CAN run these**
using the browser's own built-in developer tools, which are free and already on every machine — but
they are not something to hand a brand-new non-technical tester without showing them once first. They
are marked so nobody is caught out.

## What the automation engineer should SKIP, and why

1. **The 2 shop-closure cases — SCH-EDGE-05 and SCH-SPREAD-07.** The specification says two opposite
   things about whether a shop closure day blocks a spread, and nobody has ruled. Automating now could
   lock in the wrong behaviour. Both cases say, in the case itself: *"DO NOT AUTOMATE YET."*
2. **The 2 cases that cannot be set up here — SCH-EDGE-07 and SCH-START-02.** One waits for a clock
   change in November, the other for a shared setting nobody has authorised changing.
3. **Leave the 8 drag-and-drop cases until last, and budget more time for them.** There is no
   click-to-arm alternative to dragging on this build (SCH-DND-08 — that is itself a gap we reported),
   so every one of those cases needs real mouse-press-move-release emulation, not a simple click.
   They all work — we drove every one of them by hand today — but they are the slowest to write.

**Everything else — 161 cases — is ready to automate today.** The 19 that currently fail should still
be automated: they are correct, they are what the app is supposed to do, and each one already carries
its ticket number.

**One thing that will make automation much easier, and it is very good news:** the developers have put
**166 stable test handles** on this feature — every toolbar button, every toggle in both menus, every
sidebar card and its status badge, every mini-calendar date, the shift window and every field inside
it, each line row, the capacity bars (which even carry the percentage and the date as attributes), and
each conflict row keyed by its shift. The full list is in
`build/schedule/viu-2026-08-04/snapshots/testids-union.json`. **An automation engineer will not have to
guess at a single selector.** The grid itself is FullCalendar, which is well documented and stable.

## What is blocked on Branko (the product owner)

1. **The shop-closure contradiction — 2 cases frozen.** Section 4.5 says *"Shop closures and public
   holidays are not skipped in V1."* Section 12 says closures *"block the spread step from placing
   shifts on those days."* Both sentences are still in version 23. There is no shop-closure setting in
   the app at all, so testing cannot settle it. **This has been open since 22 July and the question has
   still not been sent to him** — that is the single oldest item on this project.
2. **Two of the twelve tickets another QA raised today argue against Branko's own earlier rulings.**
   **SV-8835** says the hover summary should hide the VIN when the switch is off; Branko ruled on
   31 July that it is always visible. **SV-8829** says the shift window should show labor and total
   figures; Branko ruled on 22 July that no money is shown anywhere on the Schedule. Our cases follow
   his rulings. He needs to confirm which stands, and the specification needs correcting either way.
3. **Should a technician with no working hours saved be treated as working weekends?** Right now they
   are, which is why a Sunday shift raises no clash for them and Sunday capacity looks as full as a
   Tuesday. It is the single cause behind two of the twelve tickets. It is a product decision, not a
   code bug.
4. **Is the 8-week / 120-shift limit on a long spread a real product requirement?** It is in the
   engineering plan only and the app enforces neither. If it is not a requirement, two of our cases
   should change rather than the code.

## What is blocked on the developers

**Ten tickets were raised today from this pass**, all at priority Low, all hanging off epic SV-8685
with the owning story linked:

| ticket | what is wrong |
|---|---|
| **SV-8848** | Every time on the Schedule shows **six hours later** than the time it was scheduled for. A 7 AM job reads 1 PM. **This is the one to fix first** — the board is unusable as a planning tool until it is. |
| **SV-8849** | A spread job cannot be opened at all from the Week view, so it cannot be recoloured, noted or deleted from there. |
| **SV-8850** | The "+1 more" link on a crowded day opens an empty box — the hidden jobs are never listed. |
| **SV-8851** | The Tech Hours option in View Options does nothing. |
| **SV-8852** | The clash warning in the shift window offers no way to fix the clash. |
| **SV-8853** | Escape and Enter do nothing on the delete and reassign confirmation windows. |
| **SV-8854** | A user who is not allowed to see work orders can still read the whole work order list on the Schedule. |
| **SV-8855** | The spread window has no start date, so two technicians cannot be scheduled one after the other. |
| **SV-8856** | Dragging a job sideways in Day view jumps a whole hour instead of a quarter of an hour. |
| **SV-8857** | The sidebar filters have no "Clear all" and no count of how many are on. |

**Six of the twelve tickets another QA raised today were independently confirmed** — SV-8826,
SV-8831, SV-8837, SV-8839, SV-8840 and SV-8841. **Two do not reproduce as written** and are questions
back to their author rather than code changes: **SV-8830** (a weekend shift IS flagged, but only for a
technician who actually has working hours saved — the steps used one who has none) and **SV-8827**
(the Business Hours half is real, the Tech Hours half is not — Tech Hours already defaults off).

## OUTSTANDING — what I need from you

1. **Send Branko the shop-closure question.** Two cases stay frozen and unautomatable until he
   answers, and this has been waiting since 22 July.
2. **Rule on the two tickets that clash with his earlier answers** (SV-8835 and SV-8829). Our cases
   follow his rulings; another QA's tickets say the opposite. Nothing was changed on either side.
3. **Say whether you want a ticket for the one API-only finding.** It is written up and waiting in
   `build/schedule/viu-2026-08-04/API-ASK.md` and has NOT been filed, because an API-only defect is
   never raised without your explicit say-so — even inside a batch you have already approved.
4. **Authorise one new test case.** Another QA found a hole we had no case for: nothing checks that a
   technician showing on the board is a real, findable staff member. The case is drafted, not written.
5. **Ask engineering to tell us when this branch is final.** Until they do, all 165 answers are
   provisional and the re-check queue stays open.
6. **Decide whether run 357 should be reset.** It holds 429 result records, all of them ours and all
   Untested, and Ayesha has not started. Nothing was written to it today.

## Can the automation engineer start on Schedule?

**Yes — start tomorrow, with 161 of the 165 cases, and start with the shift window, the toolbar, the
sidebar and permissions; leave the 8 drag cases for last and skip the 4 named above.**

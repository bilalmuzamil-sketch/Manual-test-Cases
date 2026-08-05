# Schedule — is it ready for automation? (4 August 2026)

**What this is.** We ran every one of the **165 Schedule test cases against the real, running app**
for the first time — the Schedule QA branch at `sv8685.qa.shopview.com`. Before today not one of them
had ever been checked against a build; the whole suite was written from the specification.

**How much of it was actually checked: all of it. 165 of the 165 cases have a definite answer** —
not "mostly", not "the important ones". Nothing is left partly-observed and nothing is left
untouched. The count was verified twice over, once from the record of the run and once by re-reading
what each case now says on the live system, and the two agree exactly, area by area.

**The build we tested:** ShopView **v3.5-4873abe**, checked at the start, the middle and the end of
the day, and once more afterwards — the same build every time, so nothing changed under us.

**One caveat, and it is important.** The developers have told us this QA branch is **not finished** —
they are still working on it. So every answer below is **today's answer, not a permanent one**. All
165 are queued to be checked again when they tell us the branch is done, and until then nobody should
describe the Schedule suite as finished.

**Note added 5 August: two column names in the table below have been changed, because they were
being misread.**

- *"Broken on the build (a ticket is open)"* is now **"Product is wrong (ticket open) — the case
  correctly fails"**. It never meant that our test case was broken. It means **the product is wrong,
  the ticket is open, and the case correctly comes out red.**
- *"Needs a free tool built into the browser"* is now **"Manual tester can run it; needs a tool only
  for automated checking"**. It never meant a manual tester could not run those cases. **They can,
  today, with nothing to install.**

**Only the labels and the legend changed. No number, no verdict and no finding was altered.**

## The one table

| Part of the feature | Test cases | Work correctly on the build | Product is wrong (ticket open) — the case correctly fails | Waiting on the product owner | Not built yet | Cannot be set up in this test environment | Manual tester can run it; needs a tool only for automated checking | **Ready to automate** |
|---|---|---|---|---|---|---|---|---|
| Who is allowed to do what | 13 | 12 | 1 | 0 | 0 | 0 | 0 | **13** |
| Spreading a big job over several days | 10 | 7 | 1 | 1 | 1 | 0 | 0 | **9** |
| Deleting and undoing | 9 | 9 | 0 | 0 | 0 | 0 | 0 | **9** |
| Dragging a job onto a technician | 8 | 6 | 1 | 0 | 1 | 0 | 0 | **8** |
| The two toolbar menus | 8 | 6 | 2 | 0 | 0 | 0 | 0 | **8** |
| The shift window | 8 | 4 | 4 | 0 | 0 | 0 | 0 | **8** |
| Odd situations and small screens | 7 | 4 | 1 | 1 | 0 | 1 | 3 | **5** |
| Events (meetings, time off) | 7 | 6 | 0 | 0 | 1 | 0 | 0 | **7** |
| Start times and the Unassigned row | 7 | 6 | 0 | 0 | 0 | 1 | 0 | **6** |
| Clash warnings | 6 | 6 | 0 | 0 | 0 | 0 | 0 | **6** |
| The Schedule page, its three views and the department rows | 6 | 6 | 0 | 0 | 0 | 0 | 0 | **6** |
| Opening a work order to see its lines | 6 | 6 | 0 | 0 | 0 | 0 | 0 | **6** |
| The work order filters | 6 | 5 | 1 | 0 | 0 | 0 | 0 | **6** |
| Does the rest of the app still work | 5 | 5 | 0 | 0 | 0 | 0 | 0 | **5** |
| The Day view timeline | 5 | 3 | 2 | 0 | 0 | 0 | 0 | **5** |
| The hover summary | 5 | 4 | 1 | 0 | 0 | 0 | 0 | **5** |
| The work order list and its search box | 5 | 5 | 0 | 0 | 0 | 0 | 0 | **5** |
| Setting working hours | 5 | 5 | 0 | 0 | 0 | 0 | 0 | **5** |
| Behind the scenes (the data requests) | 4 | 3 | 0 | 0 | 1 | 0 | 0 | **4** |
| The capacity bars | 4 | 4 | 0 | 0 | 0 | 0 | 0 | **4** |
| A spread job shown as one run of days | 4 | 3 | 1 | 0 | 0 | 0 | 0 | **4** |
| Several jobs at the same time | 4 | 3 | 1 | 0 | 0 | 0 | 0 | **4** |
| Choosing what to schedule | 4 | 4 | 0 | 0 | 0 | 0 | 0 | **4** |
| The little month calendar | 4 | 4 | 0 | 0 | 0 | 0 | 0 | **4** |
| Colours | 3 | 3 | 0 | 0 | 0 | 0 | 0 | **3** |
| The toolbar | 3 | 2 | 1 | 0 | 0 | 0 | 0 | **3** |
| Keyboard | 3 | 1 | 2 | 0 | 0 | 0 | 0 | **3** |
| Moving a job to another technician | 3 | 3 | 0 | 0 | 0 | 0 | 0 | **3** |
| What a block on the board says | 3 | 3 | 0 | 0 | 0 | 0 | 0 | **3** |
| **TOTAL** | **165** | **138** | **19** | **2** | **4** | **2** | **3** | **161** |

## LEGEND — what every column above means, in plain words

**Read this before drawing any conclusion from the table.** Two of these column names were misread
before, so they are now spelled out in full — and the two most important points are these:

- **A case in the "Product is wrong (ticket open)" column is a GOOD case.** The **case** is correct;
  the **product** is wrong. A ticket is open and named on the case itself. **A FAIL there is the
  expected result** until the ticket is fixed. Nothing in that column means our test case is faulty —
  those are the cases that *caught* the faults.
- **A case in the "Manual tester can run it; needs a tool only for automated checking" column CAN be
  run by a manual tester today, with nothing to install.** The tool is the browser's own developer
  tools, which are already on every machine. It is what an *automated* check needs; it is not
  something that stops a person testing it.

Column by column:

- **Part of the feature** — the area of Schedule the row groups together.
- **Test cases** — how many cases exist for that area.
- **Work correctly on the build** — we drove it on the live build and the product did what the case
  says it should.
- **Product is wrong (ticket open) — the case correctly fails** — the case is right, the **product**
  is wrong, and a ticket is open for it. **Automate these and expect a red result** until the fix
  lands; do not raise a new ticket, and do not treat the case as faulty.
- **Waiting on the product owner** — a product question is unanswered, so what the case should expect
  could still change. Automating now risks locking in the wrong behaviour. Both of these say **"DO NOT
  AUTOMATE YET"** on the case itself.
- **Not built yet** — the feature does not exist in the product yet. Each of these cases tells the
  tester to mark it **blocked**, not failed.
- **Cannot be set up in this test environment** — nothing to do with tools. The starting conditions
  cannot be created here (a clock change that has not happened, or a shared setting nobody has
  authorised changing). These cases tell the tester to mark them blocked.
- **Manual tester can run it; needs a tool only for automated checking** — **a manual tester can run
  these today on the machine they already have; nothing needs installing.** The tool is the browser's
  built-in developer tools (F12), used to force a small screen width, heavy load, or dark mode.
- **Ready to automate** — what is left once the two skip groups are set aside (waiting on the product
  owner, and cannot be set up here). **The "product is wrong" column is NOT subtracted** — those cases
  are automated and are expected to come out red.

**Every row adds up.** Working + product-is-wrong + waiting + not built + cannot-be-set-up equals the
case count on every single line, and 138 + 19 + 2 + 4 + 2 = 165. The last two columns overlap the
others on purpose: the three that need a browser tool all work correctly, and they are counted there
too.

**A manual tester CAN run all 165 of these cases today, with nothing but a browser** — including the
19 where the product is wrong (they are *supposed* to fail, so a red result is information rather than
noise) and the 4 on features that are not built yet (each one tells the tester to mark it
**blocked**, not failed).

**Of the 19 product-is-wrong cases, 15 name the exact ticket number on the case itself, with a
link.** The other **4** say plainly that there is no ticket yet and tell the tester not to raise one without
asking — three of those are deliberate (they are questions for the product owner rather than code
faults, and the reasons are written down), and **one of them needs a ticket and does not have one**;
see the outstanding list.

**Two cases cannot be run here at all, and only two.** **SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865)** needs a daylight-saving clock
change, and the next one is 1 November 2026. **SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970)** needs the shop's business hours
switched on, which changes a setting everyone else sharing this test environment relies on. Both say
so on the case and tell the tester to mark them blocked.

**Three cases ask for a measuring tool** — SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086), SCH-EDGE-04 = [C30088](https://shopview.testrail.io/index.php?/cases/view/30088) and SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) check how the
screen behaves at a small width, under heavy load, and in dark mode. **A manual tester CAN run
these** using the browser's own built-in developer tools, which are free and already on every
machine — but they are not something to hand a brand-new non-technical tester without showing them
once first. They are marked so nobody is caught out.

## What the automation engineer should SKIP, and why

1. **The 2 shop-closure cases — SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) and SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983).** The specification says two opposite
   things about whether a shop closure day blocks a spread, and nobody has ruled. Automating now could
   lock in the wrong behaviour. Both cases say, in the case itself: *"DO NOT AUTOMATE YET."*
2. **The 2 cases that cannot be set up here — SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) and SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970).** One waits for a clock
   change in November, the other for a shared setting nobody has authorised changing.
3. **Leave the 8 drag-and-drop cases until last, and budget more time for them.** There is no
   click-to-arm alternative to dragging on this build (SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) — that is itself a gap we reported),
   so every one of those cases needs real mouse-press-move-release emulation, not a simple click.
   They all work — we drove every one of them by hand today — but they are the slowest to write.

**One warning worth more than the three points above.** Some of these cases move real work already
on the board. If a test drags an existing shift, **put it back and then compare every field to what
it was before** — owner, start, end and length, not just the one you changed. We learned this the
hard way today: a drag test restored a shift's start time and left it on the wrong technician and
seven and a half hours short, and nobody noticed until the whole week was compared field by field.
That shift has been put back.

**Everything else — 161 cases — is ready to automate today.** The 19 that currently fail should still
be automated: **the cases are correct — it is the product that is wrong** — they describe what the app
is supposed to do, and 15 of them already carry their ticket number. **A red result on those 19 is the
expected result, not a faulty test.**

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
   the app at all, so testing cannot settle it — **only he can**. **This has been open since 22 July
   and the question has still not been sent to him** — that is the single oldest item on this project.
2. **Two of the twelve tickets another QA raised today argue against Branko's own earlier rulings.**
   **[SV-8835](https://shopview.atlassian.net/browse/SV-8835)** says the hover summary should hide the VIN when the switch is off; Branko ruled on
   31 July that it is always visible. **[SV-8829](https://shopview.atlassian.net/browse/SV-8829)** says the shift window should show labor and total
   figures; Branko ruled on 22 July that no money is shown anywhere on the Schedule. Our cases follow
   his rulings, and we changed nothing on either side. He needs to confirm which stands — **and the
   specification needs correcting either way, because the sentences those tickets were read from are
   still in it.**
3. **Should a technician with no working hours saved be treated as working weekends?** Right now they
   are, which is why a Sunday shift raises no clash for them and Sunday capacity looks as full as a
   Tuesday. It is the single cause behind two of the twelve tickets. It is a product decision, not a
   code bug.
4. **Is the 8-week / 120-shift limit on a long spread a real product requirement?** It is in the
   engineering plan only and the app enforces neither. If it is not a requirement, two of our cases
   should change rather than the code.

## What is blocked on the developers

**Ten tickets were raised today from this pass**, all at priority **Low**, all hanging off epic
**[SV-8685](https://shopview.atlassian.net/browse/SV-8685)** with the owning story linked. Every one was read back from Jira afterwards to confirm it
saved correctly:

| Ticket | What is wrong | Test cases affected |
|---|---|---|
| [SV-8848](https://shopview.atlassian.net/browse/SV-8848) | Every time on the Schedule shows **six hours later** than the time it was scheduled for. A 7 AM job reads 1 PM. **This is the one to fix first** — the board is unusable as a planning tool until it is. | 4 |
| [SV-8849](https://shopview.atlassian.net/browse/SV-8849) | A spread job cannot be opened at all from the Week view, so it cannot be recoloured, noted or deleted from there. | 1 |
| [SV-8850](https://shopview.atlassian.net/browse/SV-8850) | The "+1 more" link on a crowded day opens an empty box — the hidden jobs are never listed. | 1 |
| [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | The Tech Hours option in View Options does nothing. | 1 |
| [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | The clash warning in the shift window offers no way to fix the clash. | 1 |
| [SV-8853](https://shopview.atlassian.net/browse/SV-8853) | Escape and Enter do nothing on the delete and reassign confirmation windows. | 2 |
| [SV-8854](https://shopview.atlassian.net/browse/SV-8854) | A user who is not allowed to see work orders can still read the whole work order list on the Schedule. | 1 |
| [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | The spread window has no start date, so two technicians cannot be scheduled one after the other. | 1 |
| [SV-8856](https://shopview.atlassian.net/browse/SV-8856) | Dragging a job sideways in Day view jumps a whole hour instead of a quarter of an hour. | 1 |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | The sidebar filters have no "Clear all" and no count of how many are on. | 1 |

**Six of the twelve tickets another QA raised today were independently confirmed** — [SV-8826](https://shopview.atlassian.net/browse/SV-8826),
[SV-8831](https://shopview.atlassian.net/browse/SV-8831), [SV-8837](https://shopview.atlassian.net/browse/SV-8837), [SV-8839](https://shopview.atlassian.net/browse/SV-8839), [SV-8840](https://shopview.atlassian.net/browse/SV-8840) and [SV-8841](https://shopview.atlassian.net/browse/SV-8841). **Two do not reproduce as written** and are questions
back to their author rather than code changes: **[SV-8830](https://shopview.atlassian.net/browse/SV-8830)** (a weekend shift IS flagged, but only for a
technician who actually has working hours saved — the steps used one who has none) and **[SV-8827](https://shopview.atlassian.net/browse/SV-8827)**
(the Business Hours half is real, the Tech Hours half is not — Tech Hours already defaults off). None
of their tickets was touched.

## OUTSTANDING — what I need from you

1. **Send Branko the shop-closure question.** Two cases stay frozen and unautomatable until he
   answers, and this has been waiting since 22 July.
2. **Rule on the two tickets that clash with his earlier answers** ([SV-8835](https://shopview.atlassian.net/browse/SV-8835) and [SV-8829](https://shopview.atlassian.net/browse/SV-8829)). Our cases
   follow his rulings; another QA's tickets say the opposite. Nothing was changed on either side.
3. **Say whether you want a ticket for the one API-only finding.** It is written up and waiting in
   `build/schedule/viu-2026-08-04/API-ASK.md` and has NOT been filed, because an API-only defect is
   never raised without your explicit say-so — even inside a batch you have already approved.
4. **Say whether you want an eleventh ticket for a real fault we found and did not raise.** The shift
   window's "time logged" bar showed a job as **fully worked when nothing had been clocked against
   it** — it looks like it is showing the estimate twice. It is the only product-is-wrong case with no ticket
   and no stated reason, and it affects one case (SCH-MODAL-03 =
   [C30010](https://shopview.testrail.io/index.php?/cases/view/30010)).
5. **Authorise one new test case.** Another QA found a hole we had no case for: nothing checks that a
   technician showing on the board is a real, findable staff member. The case is drafted, not written.
6. **Authorise a small tidy-up on 16 cases.** Sixteen of the 165 show raw page markup — literal
   `<ol>` and `<li>` tags — in their steps and expected results. It is readable and it is **not new**
   (it predates today's work), but it looks unprofessional to a tester and should be cleaned.
7. **Ask engineering to tell us when this branch is final.** Until they do, all 165 answers are
   provisional and the re-check queue stays open.
8. **Decide whether run 357 should be reset.** It holds 429 result records, all of them ours and all
   Untested, and Ayesha has not started. Nothing was written to it today, and that was verified
   afterwards rather than assumed.

## Can the automation engineer start on Schedule?

**Yes — start tomorrow, with 161 of the 165 cases, and start with the shift window, the toolbar, the
sidebar and permissions; leave the 8 drag cases for last and skip the 4 named above.** The one thing
to keep in mind is that the answers are today's answers: the branch is not finished, so expect some
of the 19 product-is-wrong cases to start passing as tickets are fixed, and re-check rather than
assume.

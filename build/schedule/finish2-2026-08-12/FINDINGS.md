# Schedule — findings, 2026-08-12 (finish2 pass)

**Build `v3.5-65d6500`**, unmoved since 11 August. Findings only; the numbers are in
`COMPLETION-REPORT.md`.

## 1 · The most useful result of the pass is three findings that did NOT survive

Three cases looked like divergences on the first measurement. **All three are passes**, and each
would have been a confident, plausible, wrong report handed to the QA lead on the eve of release.

**[C30001](https://shopview.testrail.io/index.php?/cases/view/30001) — day view auto-scroll.** The
first check said it opens at midnight instead of the working-day start. **The window was too wide for
the test to mean anything**: at 1680 px the whole 24-hour day nearly fits, so the timeline was already
scrolled as far as it could go. Narrowed to 900 px it passes on **all five** expected results — opens
at **6 AM** against a **7:00 AM** business start (the *"30 to 60 minutes"* buffer the case asks for), a
manual scroll to **5 PM** survives idling and interaction, the next day **re-triggers** the auto-scroll,
and the timeline stays a full 24-hour scroller.

**[C30006](https://shopview.testrail.io/index.php?/cases/view/30006) — the now line.** The label was
reported as not visible. It sits at `opacity: 0` **because the case asks for it on hover**. Hovered, it
reads `7:34 AM`.

**[C30012](https://shopview.testrail.io/index.php?/cases/view/30012) — inline estimate.** Reported as
having no editable field. Clicking the hours value reveals `input_shift_line_estimate_<uuid>`.

**The pattern in all three: the first check measured the wrong thing, in the wrong state, or at the
wrong window size.** The rule that caught them is the project's own — prove the state a control should
appear in before recording it absent.

## 2 · Two divergences that did survive, both checked far harder than the first look

**[C29929](https://shopview.testrail.io/index.php?/cases/view/29929) — no way to collapse a department
group.** Both views, all three headers, synthetic clicks and real mouse clicks at the header's own
coordinates: **lanes 30 → 30, every time.** The header has `cursor: auto`, no chevron, and no
`aria-expanded` on it or any of its four ancestors. **The function exists elsewhere** — the Filter &
display toggles hide groups, proven live (lanes 30 → 9) — but no reader of *"click a department group
header"* would recognise a toolbar menu as the same thing.

**[C30050](https://shopview.testrail.io/index.php?/cases/view/30050) — Tech Hours displays nothing —
and this is the one worth reading.** The innocent explanation was checked first and **ruled out**: the
case needs technicians to have hours configured, and **six staff were opened in Settings and all six
carry `Set working hours for this technician` ON, 7:00 AM to 7:00 PM Monday to Friday**. A broken click
helper was ruled out too — the **same helper in the same menu** drove `Show Saturday` (7 columns → 6),
`VIN Number` (0/44 → 27/44 blocks showing a VIN) and the `Service` group toggle (30 → 9 lanes). Three
toggles moved the screen; this one did not.

**Neither case was rewritten.** Both keep what the specification says and now carry a plain note
telling the tester to mark them BLOCKED rather than failing them and raising a duplicate.

## 3 · Six of my own checks were wrong, and were re-driven rather than banked

The one worth carrying forward: **there are three search inputs on the Schedule page** —
`select_global_search`, `input_sidebar_search` and `input_schedule_search`. A `/search/i` match lands
on the wrong one, and the symptom is a search that appears to do nothing: every term returned an
unchanged 32 blocks. Addressed by its own test id, the toolbar search matches **all five** field types
and the nonsense control returns 0.

The others: the toolbar menu items are **plain `div`s, not `.q-item`** (four cases read as having no
toggles at all); the mini-calendar check ran while the sidebar was showing the drill-down; the
visibility helper rejected an element at `opacity: 0`, which was the very state under test; and the OT
tag was hunted in Week view, where it does not render.

## 4 · A defect I introduced, found by reconciling my own count

The re-stamp executor skips any case already naming the running build — but it **deliberately exempted
the two note-carrying cases** from that skip, which is right on a first run and **wrong on a resume**.
A transient HTTP 502 forced a resume, and **C29929 came back with its tester note applied twice**.

**It was found by reconciling the operation count against the plan — 39 writes over 38 cases — not by
chance**, and repaired in one further write. Both note cases were then re-read live: exactly one note,
one marker, one provenance line each.

## 5 · Things reported and deliberately not called

**[C30086](https://shopview.testrail.io/index.php?/cases/view/30086) — the sidebar does not collapse
below 960 px.** At 900 px the grid does become horizontally scrollable, as the case says, but the
sidebar stays visible at its **full 275 px** rather than collapsing. **Not called a divergence**: the
case pairs two assertions in one sentence, one of which passes, and the width at which a collapse is
supposed to happen is not something this pass established beyond the case's own wording. **Worth one
look before release.**

**[C30022](https://shopview.testrail.io/index.php?/cases/view/30022) — events render violet, not
grey.** But **none of the events in view is known to have had no colour chosen**; they are pre-existing
data. Settling it needs an event created with the colour left alone.

**[C29952](https://shopview.testrail.io/index.php?/cases/view/29952) and
[C38849](https://shopview.testrail.io/index.php?/cases/view/38849)** cannot be settled on this estate
as it stands — every line in the work order opened has a technician, and all six staff sampled have
custom hours. **Absence of something you cannot make appear is not evidence.**

## 6 · A surface reached for the first time

**[C38847](https://shopview.testrail.io/index.php?/cases/view/38847)** — Settings → Locations → edit
reveals `BUSINESS HOURS` and `Set business hours for this shop`, and turning it on reveals Monday to
Sunday rows. The 12 August pass recorded this as *"not reached, NOT recorded as absent"*; it is now
reached, and it works.

## OUTSTANDING — what I need from you

1. **Permission to raise two Story Defects** — C29929 and C30050. Both are written up ready to file in
   `DIVERGENCES.md`. **The creation hold blocks them** (Standing Rule 62 and your 2026-08-10 ruling,
   verbatim *"Do not create anything until my next order."*). It was the right call when you made it —
   nothing was being created unasked — but it now costs these two cases their correct
   `READY - EXPECT FAIL` marker, because that marker needs a ticket number. **One word and both become
   a one-line edit each.**
2. **Three users for the permission cases**, configured **before** their cookies are minted — unblocks
   ten cases. Carried over from the previous pass and still the single highest-value item.
3. **A fresh Technician sign-in**, if any Technician-perspective work is wanted. The previous pass lost
   that session to a role edit and it does not come back.
4. **Worker time on the 89 cases nobody has walked** — the method works, it is cheap, and nothing
   blocks it.
5. **A ruling on C30061** (its expected result uses shorthand scope names) and **C30015 step 3** (a
   tester who picks a non-series shift destroys it — one sentence would remove the hazard). Both carried
   over from the previous pass, both still open.

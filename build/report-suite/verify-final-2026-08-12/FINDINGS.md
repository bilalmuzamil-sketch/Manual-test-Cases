# FINDINGS — Report Suite build verification, 12 August 2026

**PARTIAL — stood down at the 5-hour usage limit, budget redirected to Schedule.**
**Build `v3.7-4626299` · ours 480 / live 492 · run 359 proven untouched · 0 TestRail writes.**

---

## 1 · The build moved to `v3.7` fifteen minutes before this session opened

I was briefed to expect `v3.6-8c28eed`. The branch is running **`v3.7-4626299`**, `index.html`
last-modified **05:06:49 GMT today**. Read three times — session start, mid-run and end — and
**byte-identical each time**, so nothing redeployed underneath the work.

**This is a minor-version move on release eve.** Its immediate cost: the 8 cases this morning's pass
stamped with `v3.6-8c28eed` now predate the running build, so **at the moment this session opened, 0
of 480 cases carried a build line naming the build that is shipping.**

## 2 · The count, honestly

**334 of 480 cases had every control and every on-screen label their steps name observed present and
operable on `v3.7`, with every surface those steps require driven this session.** On the three
reports handed off to QA that figure is **190 of 229**.

**Read that number with its caveat, which is real: 120 of the 334 also carry a data-state
precondition** — *"a customer with invoices spanning two locations"*, *"seed ZZAUTOTEST data"*,
*"one of which you then reverse"* — **that this session did not independently confirm.** Counting
only cases with no unconfirmed data-state precondition gives **214**.

So there are three defensible figures and each means something different:

| | |
|---|---:|
| cases whose controls, labels and required surfaces were all verified on `v3.7` | **334** |
| …of those, with no unconfirmed data-state precondition as well | **214** |
| …restricted to the three final reports | **190** |
| **not verified** | **146** |

The 146 break down as: a downloaded file's contents 58 · a second sign-in 40 · a seeded snapshot
state 17 · another screen in the application 13 · phone viewport 8 · logo state 6 · dark mode 6 ·
a quoted label not observed 34 (a case can have more than one reason).

**No case was re-stamped**, because the pass stopped before its write phase — so no case claims to
have been checked against `v3.7`, which is the honest position.

## 3 · 0 of 480 cases send a tester to a control that does not exist

Every toolbar control named across all 480 cases was found and **operated** — clicked, panel read.
This is the question the QA lead asked first, and the answer is good.

**It took two attempts to be able to say it.** The first sweep reported four controls missing on
Sales By Customer and Sales By Representative. They exist; my id pattern required a `_filter` suffix
they do not have. **Reported as a finding, that would have been four phantom defects on a report
handed off to QA.**

## 4 · Three divergences, all in `DIVERGENCES.md`, all needing a decision

1. **57 of the 60 tickets our EXPECT FAIL markers point at were closed OBSOLETE in one two-minute
   sweep on 9 August** (22:40:38 → 22:42:46, about two seconds apart). **75 of our 480 cases** now
   tell a tester "expect this to fail, here is the ticket" — and the ticket says Done. We checked
   two: **SV-8954 still reproduces; SV-8907 is genuinely fixed.** The status carries no information.
2. **The Location column.** Earlier passes could not settle this and said so; **it can be settled
   now**, because this account reaches five locations — the exact access condition the specifications
   name. **Five of the six reports still follow the superseded selection-gated rule and never offer
   the column in the selector.** Inventory Value alone does what the specs ask.
3. **Sales By Customer's `Product Type` filter was redesigned in the specification on 10 August
   (SV-9074, Ready to Fix) and the build has not caught up.** Two cases send the tester to options
   that do not exist. **Their steps were not rewritten to the build** — that would have deleted
   coverage of a two-day-old requirement and turned a real gap into a passing test.

## 5 · Two things that looked like defects and were not

- **Sorting on Technician Utilization and Sales By Customer "did not change the order."** It is a
  measurement artefact — my extractor read the expand-chevron cell, so it compared identical strings
  whatever the sort did. **Not a defect; NOT VERIFIED.** Work In Progress's sort was properly proven.
- **Parts Velocity appears to offer a tenth date preset, `Today`.** It does not. The panel opens on
  the month the range starts in; Parts Velocity defaults to a January start, so the calendar shows a
  "jump to today" button the other five do not need.

Both are recorded because each would otherwise be rediscovered and filed tomorrow morning.

## 6 · Confirmed good

- **10 of 10 downloads succeeded** across the three final reports, every one with the success
  notification and a plausible file size; Work In Progress's filenames match `S9-R9` exactly.
- **The nine date presets are identical on all six reports** — no `Today`, no `Custom`, no `All Time`.
- **All four Performance reports and both Parts reports sit in the navigation groups their
  specifications name.**
- **Every toolbar control is visible at 390×844** on the three final reports.
- **The four Work In Progress tab names are right as our cases already state them.**

---

## OUTSTANDING — what I need from you

1. **Were the 57 tickets closed on 9 August closed because they were fixed, or because the list was
   being tidied before release?** This is the single most consequential question here: it governs
   what tomorrow's testers do with **75 cases**. Nothing was changed on the strength of the closure.
2. **Should [SV-8954](https://shopview.atlassian.net/browse/SV-8954) be reopened and widened?** It
   describes the Location column on Technician Utilization; it is actually on **five** reports, and
   it is closed.
3. **Confirm [SV-9074](https://shopview.atlassian.net/browse/SV-9074) is not in this release**, so
   the two Sales By Customer cases can be held rather than failed.
4. **Permission to apply the three prepared holds** (`CHANGES-MADE.md`). They are written and
   justified; nothing was pushed.
5. **A second, lesser sign-in on `sv8582`** — 40 cases across all six reports cannot be verified
   without one.
6. **The remaining 146 cases need a second pass.** `RESUME.md` has the exact recipe; the tooling is
   committed and re-runnable.

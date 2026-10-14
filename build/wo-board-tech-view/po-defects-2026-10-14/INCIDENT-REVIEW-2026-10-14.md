# WO Board & Tech View — why our cases did not catch Chris Ward's 10 design defects (14 Oct 2026)

**Trigger:** Chris Ward (PO) filed SV-11317 to SV-11326 on 14 Oct 2026 (19:13–19:19 UTC), all children of epic SV-10043, all from
Sasha Grosman's staging review "with local click-through against Branko's design file". Jira search `parent = SV-10043 AND
created >= 2026-10-13` returns exactly these 10. Ticket text saved verbatim: `TICKETS-SV-11317-to-11326.md`.
**Spec:** PRD Confluence 845185030 now at v52 (saved `CONFLUENCE-845185030-now-2026-10-14.md`). Our last check was **v49**
(15:34 UTC, `../currency-2026-10-14/CONFLUENCE-845185030-v49-2026-10-14b.md`).
**Reading coverage:** the 10 tickets (12,975 B) 100%; PRD now (75,305 B) change log rows 670–688 read in full, every cited rule
code checked in v49 and now; our records searched by script: 258 WO cases (`../currency-2026-10-14/notify/cases-text.json`),
`../source-update-2026-10-08/FULL-UPDATE-2026-10-08.md`, `design-gap-triage-2026-10-08.md`, the 14 Oct design text inventory
(1,908 rows), the 23 Sep design-vs-spec sheet, the Review Decisions page (29 Sep).

## 1 · Ticket by ticket

| Ticket | What Chris expects | Rule in the spec when our cases were written? | Our case | Would a tester running our cases have caught it? | Why not |
|---|---|---|---|---|---|
| SV-11317 | Tech View opens on the design's 13 columns | **No.** S5-R4 rewritten in v51 (14 Oct). Until v49 it said "the production List default columns" | [C96979](https://shopview.testrail.io/index.php?/cases/view/96979) and [C96927](https://shopview.testrail.io/index.php?/cases/view/96927) (ours) assert the OLD rule | **No — they would PASS the wrong build** | We saw the design differ on 8 Oct (design "10 of 10 shown", no Lead Technician / VIN / On Site), recorded it (W-2), drafted a PO question ("is Lead Technician meant to be dropped in Tech View?") and **never sent it** |
| SV-11318 | Status pill 18 / 18 / 22 px by density | No. New S6-R2a, v51 | none | No | Size is visual; our design coverage counts words only |
| SV-11319 | Lucide icons in switcher and views | No. New S1-R9a, v51 | none | No | The design library names the Lucide set; our 14 Oct inventory classified the library **OUT-OF-SCOPE** |
| SV-11320 | Six-dot grip on every row and group header, Unassigned included | No. New S9-R1a, v51 | [C96925](https://shopview.testrail.io/index.php?/cases/view/96925) (Vladimir) and [C97003](https://shopview.testrail.io/index.php?/cases/view/97003) (ours) use the handle on a technician header / Board column to drag | No | They use the grip as a tool; no case checks that it is shown on every row and on Unassigned |
| SV-11321 | Header labels 12 px, weight 500, grey; no overlap | No. New S2-R21, v51 | none | No | Typography and overlap at real widths (1440 px) never checked |
| SV-11322 | Switcher tooltip opens above, never covers the header row | No. New S1-R9b, v51 | 148 cases read the tooltip's words | No | We checked what the tooltip says, never where it opens or what it hides |
| SV-11323 | Board View full width, no grey rounded panel | No. New S3-R23, v51 | none | No | Library text "runs edge to edge on white (never inside a card on grey)" classified **OUT-OF-SCOPE** |
| SV-11324 | Tech View edge to edge on white, no gutter | No. New S2-R22, v51 | none | No | Same library sentence, same classification |
| SV-11325 | Number as accent link, Progress as thin bar, advisor avatar | No. New S2-R20, v51 | none | No | Every case says "Design: … on-screen labels only"; cell look never compared |
| SV-11326 | Technician filter in Tech View and Board View | No. New S1-R15/a/b, v52 | none | No | The design showed a Technician chip. We recorded it as out of scope from the 25 Sep decision "List stays exactly as in production" (Review Decisions SQ-2 / DR-33) and PRD "filters apply the same way in every display". That decision was about List; **we stretched it to the new views without asking** |

**Result: 0 of 10 would have been caught. For SV-11317 our own cases expected the wrong behaviour.**

The spec did not contain any of these 14 rules until v51/v52, written today *from* these findings (change log: "let Tech View
ship as the List's table"). But the design is one of our sources (Rule 57 lists it; Rule 115 demands 100% coverage of it), and the
design showed all of them. So this is our miss, not only the spec's.

## 2 · Root causes

1. **We used the design for words, not for looks.** Every WO case's source line says "Design: … on-screen labels only". We never
   turned what the design SHOWS (default columns, icons, grips, sizes, spacing, panels, cell styles, tooltip position) into checks.
2. **Our design coverage proof cannot see any of this.** Since 9 Oct the proof is the text inventory (Rule 124 amended). It
   proves every word is covered or classified; an icon, a 4 px size, a gutter or a missing grip has no word, so it passed
   "0 unclassified" while every one of these differences went unchecked. The proof gave false confidence.
3. **Design-library rules were filed as out of scope.** The library said in plain words "the table runs edge to edge on white,
   never inside a card on grey" and named the Lucide icon set. We classified the whole library folder OUT-OF-SCOPE because it is
   "library", although the screens are built from it.
4. **Divergences were recorded but not always asked.** The Tech View columns question was drafted 8 Oct and never sent (the
   14 Oct PO sheet had 11 other questions). The Technician chip was excluded by stretching a List-only decision.
5. **When design and spec disagreed, the case followed the spec silently.** Correct under Rule 57, but without a sent question
   the case then asserts what the build did, so it can never catch the design gap (C96927 even told the tester: if the build
   matches the design, mark it failed).

## 3 · What changes (prevention) — PROPOSED, needs the QA lead's yes (Rule 72)

- **P1 · Design-look checks are cases.** For every screen and state in a design: one "looks as in the design" case listing what a
  tester can see — default columns and order, each icon, grips/handles, cell styles (link, bar, avatar), header style, page frame
  (edge to edge, panels, gutters), tooltip position, sizes per density, and no overlap at 1440 and 1536 px — with the design
  screenshot named as the picture to compare against. Where the PRD is silent the expected result quotes the design (Rule 57);
  where they disagree, a PO question goes out the same day.
- **P2 · A visual inventory beside the text inventory (Rule 124 / skill 21).** Extract from the design's code and screenshots
  every icon, component, container, size and default state; each one is COVERED by a case or classified, zero unclassified.
- **P3 · Library rules are in scope when the screen uses the library.** Every "always / never / must" sentence in the design
  library becomes a check or a classified item, never a blanket OUT-OF-SCOPE.
- **P4 · No drafted question stays unsent.** Every design-vs-spec divergence goes in a register with a "sent on" column; the
  completion report shows the unsent count and it must be zero.
- **P5 · A decision about one screen is not stretched to another.** An out-of-scope ruling is applied only to what it names;
  anything wider is asked.

## 4 · Take-away
A test suite that agrees with the spec and ignores how the design looks will pass a build that looks nothing like the design.
"Every word covered" is not "the screen is covered".

## 5 · How the lesson is kept so it is not relearned
- Recorded now (facts): this file; `build/LESSONS-REGISTER.md` entry L-01; pointer in `../PROJECT-STATE.md`.
- PROPOSED (needs a yes, Rule 72): one line in CLAUDE.md §1 Critical Core pointing to `build/LESSONS-REGISTER.md` (that section
  is always loaded); skill 15 (intake) and skill 21 (design drive) open the register as their first step; P1–P5 written into
  skill 21 and skill 01; a new Rule 126 "a design is covered only when its look is covered".

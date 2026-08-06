# Branko Cicovic question sheet — Filters and Schedule — 2026-08-06

**STATUS: READY TO SEND — not sent. Nothing written to TestRail or Jira.**

| File | What it is |
|---|---|
| `Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-06.xlsx` | **the version to send.** 4 tabs; the 4th is QA-only and must not be forwarded |
| `Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-06.md` | plain-language twin |
| `gen_branko_sheet.py` | generator; mirrors the peers 1:1 (Rule 16) and **imports** the carried-forward rows from the 2026-08-05 generator so their wording cannot drift |

**21 items:** 7 Filters · 8 Schedule questions about his own document · 6 Schedule behaviours only the
engineering plan describes. **17 of our tests are on hold across them, and 2 more are waiting on the
two new Schedule questions that decide whether they pass or fail.**

## Addendum 2026-08-06 — 4 Schedule items added, 17 → 21

From the Schedule spec **v23 → v25** diff (`build/schedule/spec-v25-2026-08-06/QUESTIONS-FOR-BRANKO.md`).
They are **appended as Schedule items 5–8**, not re-ordered into the tab, so the established structure
and the carried-forward wording are untouched (Rule 16); the tab note names 5 and 6 as the decisive ones
so their importance is still visible on the reader tab. **Every sentence below was re-verified live,
read-only, before it was written.**

| New item | Asks | Decides | Verified live 2026-08-06 |
|---|---|---|---|
| **Schedule 5** | what happens to the calendar blocks that do **not** match the toolbar search | **what [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) should assert** — the fade/highlight requirement is in its title *and* two expected items | Confluence **v25** §6 now names only the fields searched; **"non-matching" = 0 hits, "de-emphas" = 0, "dim" = 0** in the whole body, so the spec is **silent, not reversed**. **SV-8686 (Story, TESTING QA) still requires it twice** — Requirements *"Non-matching blocks fade; matching blocks highlight."* and Acceptance Criteria *"…matching blocks highlight and non-matching blocks fade."* **SV-8874 is OBSOLETE/Done** (03:32:42−0500, Milos Vasic), so C30041's `EXPECT FAIL (SV-8874)` marker is already wrong either way |
| **Schedule 6** | can the estimated hours still be **typed into** in the shift window | **whether [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) passes or fails** on the same build | **v25 §4.9 still reads *"Estimated hours with inline edit."*** and **SV-8695 still requires it** — two written sources. Against them, **Branko's only comment on SV-8829, 2026-08-06T04:31:05−0500 = 09:31:05Z, seventeen minutes after v25 published at 09:13:51Z**: *"Estimated badge should not be clickable, you can change time only in the input fields above…"* — **ambiguous between the line badge and the modal field**, so Rule 58 says ask, never resolve it from the build |
| **Schedule 7** | his **story** still says the job lines show a labour **total** while his **spec** now says labour/**status** | nothing under answer A — **[C30011](https://shopview.testrail.io/index.php?/cases/view/30011)** already follows the three agreeing sources; answer B would rewrite its item 3 | **v25**: *"Scope summary and the scheduled line(s) with labor/status figures."* · **SV-8695**, still: *"…scope summary with scheduled line(s) and labor/total…"* — present **before and after his own description edit of 2026-08-03**, so he edited the story three days ago and left `total` standing, then changed the spec today |
| **Schedule 8** | full 24 hours or working hours + a buffer, **for this release** | nothing today — **[C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** is correct as written | **v25 §4.8**: *"The full 24-hour timeline remains intact and scrollable."* against **SV-8915**'s *"Related change requests"*: *"Schedule width should render only business hours plus a small trailing buffer rather than the full 24 hours… Tracked separately on the enhancements list."* Its marker's ticket **SV-8837 is still open**, so that marker is untouched by this question |

**One of the four source questions was deliberately LEFT OFF, and this is why.** The source file's
**Q2b** asked what the word *"labor"* means in v25's new *"labor/status figures"* — hours or money.
**He has already answered it in his own words** (SV-8829, verified live: *"for work order lines we just
show estimate and status badge, there shouldn't be totals"*) and, on **the source file's own
admission**, *"neither answer changes the case's substance"*. So it would have cost a PO round trip for
zero test consequence, and re-asking a settled point is the exact embarrassment this project has had
once already. **Its one live consequence is on the sheet as Schedule item 7** — that two of his own
documents now disagree. The residual ambiguity is in **our own** text (C30011 uses *"labor"* for both
hours and money in one expected result) and that is an internal wording repair, not a product question.

**The design-authority question was deliberately NOT added as a new row.** Its **product** half —
which drawing of the Schedule is canonical — is **already Schedule item 4** on this sheet, and asking
it twice inside one workbook is the drip Rule 55 exists to prevent. Its **process** half — whether a
design may outrank the written description in **our own method** — is a decision for **the QA lead**,
not for Branko, and has been put to him separately.

**Also re-confirmed and unchanged in v25**, so items 1–3 and tab 3 stand exactly as written: both
shop-closure sentences survive, both click-menu wordings survive, and all six engineering-only topics
are still absent.

## ⚠️ This workbook REPLACES `build/branko-questions-2026-08-05/`

That 13-item sheet was written, is ready, and **was never sent** (register row C4). Rule 55 says to
sweep every open ambiguity onto **one** sheet so a PO answers in a single sitting *"rather than a drip
of separate asks"* — and two unsent sheets to the same person **is** that drip. So all 13 of its items
are carried forward here (imported from its own generator, byte-identical wording) and 4 new items
added.

**The 2026-08-05 workbook needs a SUPERSEDED banner so an old one cannot go out by mistake. It was NOT
edited** — this task was scoped to write only inside the two new folders.

## Source currency (Rules 31 + 59) — fetched live, and re-read immediately before writing

| Source | Identifier | Version / state | Checked | Verdict |
|---|---|---|---|---|
| Filters specification | Confluence 572030978 | **19**, 2026-08-06T11:48:47Z, HTTP 200 | 2026-08-06 | **CURRENT** |
| Schedule specification | Confluence 713031682 | **25**, 2026-08-06T09:13:51Z, HTTP 200 — **re-fetched for the addendum and searched in full for every sentence items 5–8 rest on** | 2026-08-06 | CURRENT (⚠️ CLAUDE.md and the register still say 23 — **neither was edited, out of scope**; the **v23 → v25 diff now exists** at `build/schedule/spec-v25-2026-08-06/SPEC-DIFF.md`) |
| Jira | SV-8876, SV-8825, SV-8915, SV-8916, SV-8917 · **addendum: SV-8686, SV-8695, SV-8829, SV-8874, SV-8837, SV-8915** | read live, HTTP 200 each, read-only | 2026-08-06 | CURRENT |
| TestRail (Filters) | group 4110 | 114 cases, **all ours**, 20 on HOLD | 2026-08-06 | CURRENT |
| TestRail (Schedule) | C30041 · C30012 · C30011 · C30001 | **pulled live for the addendum**, HTTP 200 each — titles, `refs` and automation markers read from the live cases | 2026-08-06 | CURRENT for those four; **PARTIAL for the 3 held C-ids on items 1–3** (C29983, C30089, C43555 — still from committed records, cited as such) |
| Designs | — | **which artefact is canonical is item 4 of tab 2** | 2026-08-06 | **PARTIAL** |

The Filters page's **in-body field still reads "Version: 1.6"** — the Rule-31(a) trap. The Confluence
number is the one used.

**The build was NOT observed.** A read-only probe returned **HTTP 401 `sso_required`**; `quick-login`
and `switch-user` were **deliberately not called** (both rotate the shared session). **Both branches
have redeployed** — `sv8785.qa.shopview.com` now reads **`v3.4.2-280ca5a`** (last-modified Thu 06 Aug
2026 09:37:49 GMT) where the Filters passes ran on `v3.4.2-d00239b`. Every build-side sentence quoted
to Branko therefore comes from a build that no longer exists. All verdicts stay **PROVISIONAL**.

## What was verified live, point by point

- **Filters S9-R2 / S9-R3 unchanged in v19** — *"On the Estimates tab, the Status filter chip is
  hidden…"*. So the Status-chip contradiction with his 17 July answer is still live. **4 cases held.**
- **The Parts/Reports hold count is exactly TEN** — C38880, C38882, C38904–C38911. (C43562 is held for
  a different reason: absent product, not a missing document.)
- **The S12-R2 cross-reference is still wrong in v19** — it points at **S12-R5** (the page search
  control) when the real exception is **S12-R6** (mobile applies only on tapping the button). His own
  v17 renumbering moved the requirement and left the pointer behind.
- **Both Schedule contradictions survive v25** — both shop-closure sentences, and both the left-click
  and right-click wordings.
- **All six engineering-only Schedule topics are still absent from v25** — 0 matches each for
  pre-existing shifts, dashboard, appointment, another branch, and any spread-length limit; only
  *"priority"* appears, as a bare field name with no behaviour.

## Two things deliberately NOT asked

**1. SV-8876 is CLOSED — it is not Branko's to answer, and the brief was wrong about it.** The brief
listed it as *"still his to answer"* and CLAUDE.md's Filters section says *"Branko owes SV-8876"*.
**Read live 2026-08-06:** Task, **status Done**, resolution Done, resolved 2026-08-05T08:38:16−0500,
parent SV-8785, reporter Ahtasham Amjad — **he closed it himself**, verbatim: *"closing this as it was
a gap with test case , I've updated the test case here >>…/cases/view/29557 And created a story defect
>> as the build is not behaving as per PRD"*. Asking it would have re-asked a closed question — the
exact embarrassment this project has already had once. **The half that IS still his** — did he want the
buttons on one row, in which case the developer job should be cancelled? — **is on the sheet as Filters
item 5.**
**Separate point for the QA lead, not for Branko: that comment says Ahtasham edited OUR case
[C29557](https://shopview.testrail.io/index.php?/cases/view/29557).** Under Rule 38 we do not touch his
cases and he should not be editing ours. Reported, not acted on.

**2. Filters v19's new chip requirement produced NO question, on purpose.** S1-R3 reads *"Each chip
displays a leading type-icon identifying the filter, the filter name, and a chevron icon indicating it
opens a dropdown"*. **That is clear enough to test** — a tester can check each chip carries a leading
icon plus a chevron, and which specific icon belongs to which chip comes from the design node the spec
links. Rule 55 says ask what is unclear; it does not say invent an ask.

## Outstanding — what is needed

1. **Send this workbook, and mark the 2026-08-05 one superseded.** Do not forward tab 4.
2. **Arrange the Engineering + PO session** Branko proposed on 4 August for the page-by-page
   Parts/Reports list — **that is on you, not on him** (register row 636). Item 2 of tab 1 asks him only
   for timing and whether it is still in this release; it is **not** a re-ask of the list, which he has
   already declined twice.
3. **A v18 → v19 Filters diff.** Still owed — this pass checked only the points the sheet rests on and
   does **not** claim to have diffed that document. **The v23 → v25 Schedule diff is DONE** and is
   where Schedule items 5–8 came from (`build/schedule/spec-v25-2026-08-06/SPEC-DIFF.md`); what is
   still owed there is the **record correction** — CLAUDE.md and the outstanding-items register both
   still name Schedule version 23, and neither was edited by this pass.
4. **Fresh `cf_clearance` for `.qa.shopview.com`** before any build claim is re-measured.
5. **Nothing here is authorised to be applied.** No case was edited; the 17 held cases stay held.

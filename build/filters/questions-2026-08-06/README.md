# Branko Cicovic question sheet — Filters and Schedule — 2026-08-06

**STATUS: READY TO SEND — not sent. Nothing written to TestRail or Jira.**

| File | What it is |
|---|---|
| `Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-06.xlsx` | **the version to send.** 4 tabs; the 4th is QA-only and must not be forwarded |
| `Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-06.md` | plain-language twin |
| `gen_branko_sheet.py` | generator; mirrors the peers 1:1 (Rule 16) and **imports** the carried-forward rows from the 2026-08-05 generator so their wording cannot drift |

**17 items:** 7 Filters · 4 Schedule questions about his own document · 6 Schedule behaviours only the
engineering plan describes. **17 of our tests are on hold across them.**

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
| Schedule specification | Confluence 713031682 | **25**, 2026-08-06T09:13:51Z, HTTP 200 | 2026-08-06 | ⚠️ **our records say 23 — two versions uningested** |
| Jira | SV-8876, SV-8825, SV-8915, SV-8916, SV-8917 | read live, HTTP 200 each | 2026-08-06 | CURRENT |
| TestRail (Filters) | group 4110 | 114 cases, **all ours**, 20 on HOLD | 2026-08-06 | CURRENT |
| TestRail (Schedule) | — | **not re-pulled**; the 3 held C-ids come from committed records | — | **PARTIAL, and cited as such** |
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
3. **A v18 → v19 Filters diff and a v23 → v25 Schedule diff.** This pass checked only the points the
   sheet rests on and does **not** claim to have diffed either document.
4. **Fresh `cf_clearance` for `.qa.shopview.com`** before any build claim is re-measured.
5. **Nothing here is authorised to be applied.** No case was edited; the 17 held cases stay held.

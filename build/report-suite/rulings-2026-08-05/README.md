# Report Suite — the two rulings of 2026-08-05

**Epic [SV-8582](https://shopview.atlassian.net/browse/SV-8582) · PO Chris Ward · research pass, 2026-08-05**

**RESEARCH AND DRAFTING ONLY. NOTHING WAS WRITTEN ANYWHERE** — no TestRail write, no Jira write, no
case edit, and **`CLAUDE.md` was not touched**. Every TestRail, Jira and Confluence read in this
folder was a read-only `get`.

## What is in here

| File | What it is |
|---|---|
| **`LOCATION-CONTRADICTION.md`** | Answers *"Have we asked question to him related to that?"* — our exact question quoted from the 2026-08-04 sheet (item 1.0, tab `Urgent - Location column`), his exact answer verbatim, where the two halves of his sentence conflict with a worked example, an honest verdict on whose fault it is, every affected case split into **genuinely blocked / wrong either way / unaffected**, and the developer ticket that cannot be written. |
| **`VIN-ORDER-RULING.md`** | The **decision taken** on the vehicle-number order (latest-wins, per the QA lead), with every source quoted verbatim and dated — all six Confluence descriptions fetched live, the Work In Progress page's full version history, epic SV-8582 and all 102 children's descriptions and comments, the tech plan, and the walkthrough video. Includes the source-currency block, the answer to whether the durable cross-project rule survives, the affected cases across all six reports, the surface matrix, the risk each way, and **two defects found in the currently staged wording**. |
| **`Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx`** | **The sheet to send.** Ten questions, each a plain A or B, mirroring the 2026-08-04 sheet's format 1:1. **The `QA internal - not for Chris` tab must not be forwarded.** |
| **`Follow-up-Question-for-Chris-Ward_2026-08-05.md`** | The one-page plain-language twin of the spreadsheet. |
| **`gen_followup_sheet.py`** | The generator for both. Writes only those two files; makes no TestRail or Jira call. |

## The two rulings this pass was built to

**Ruling 1 — the vehicle-number order**, verbatim: *"COnsider the latest piece of information as the
authentic one and do mention in the expected behavior after a line break about where the PO asked for
this behavior and where it differes and we have taken the last information as the prevailing one."*

**Ruling 2 — every PO questionnaire from now on**, verbatim: *"Anything which is not clear we need to
ask him again. Make sure that thre is a possibility that one PO is handling more than one
project/feature so whenever you create a questionnaire for them do mention for them the project
name/feature name, and the questions should be extremely simplified for a non technical PO to
understand and answer and use the references from stories/epic too if needed."*

## The headline findings

- **We did ask the location-column question**, on 2026-08-04, as the only item on its own urgent tab.
  **The ambiguity is inside his answer**, and our question was clear and answerable — but we never put
  the one state that matters in front of him, and the follow-up sheet fixes exactly that.
- **The ambiguous state is the DEFAULT state of every report** — a multi-branch manager looking at one
  branch — proven by six of our own cases.
- **Only 11 cases are genuinely blocked** by it. **Five more are wrong under BOTH readings**, so they
  can be corrected now without waiting for him — and **three of those five are live and unwarned**.
- **His new vehicle-number answer contradicts no specification. It restores one.** The Work In Progress
  description has said *"the unit number on the first line in bold"* since it was written, and was never
  changed to carry his 29 July instruction.
- **The 29 July cross-project ruling was given against an option set that mis-described the alternative
  as "the serial number"** — which is not what the build or the description did.
- **The durable cross-project rule should be narrowed, not repealed** (recommendation only — `CLAUDE.md`
  untouched).
- **⚠️ Three of the staged Work In Progress rewrites invent a "then plate" fallback that no Work In
  Progress source supports.** If the 46-operation push runs as staged, three tests would fail a correct
  build.

# Invoice UI Refresh — source verification, 2026-09-03

**Run because the QA lead made it mandatory that day** (verbatim: *"NOte everytime I ask you to build
verify anything, the first thing you must ALWAYS do is to get the latest from all the sources, and then
proceed with the task."*). It also closes an open item: the 2026-09-03 Credit Invoice pass had settled a
disclaimer question partly from the **v39** spec body held in this repo while the cases cite **v45**,
and disclosed that gap rather than closing it. **It is closed now.**

## What was pulled, and how

| | |
|---|---|
| Page | **`Invoice UI Refresh`**, id **`755990532`**, space `~712020aa…` (Chris Ward) |
| Live state | **last modified `Aug 28, 2026`** — read from a CQL metadata call, which costs nothing |
| Body | pulled live and written to **`spec-body-confluence-LIVE-2026-09-03-755990532.md`** (70,345 chars) |
| Held copy for comparison | `../intake-2026-08-21/sources/spec-body-confluence-v39-755990532.md` (64,053 chars, saved 2026-08-21) |
| Method | `anchor_diff.py` — inherited from `build/report-suite/source-verify-2026-08-26/tools/verify.py` (Rule 27). Bodies go **file-to-file**; only anchor ids, counts and named anchors are printed (Rule 88) |

**The date alone answered the first question.** The page's last change is **28 August**; the cases were
read against **v45 on 31 August**. So nothing has moved since the suite was source-verified — the v39
body in the repo is an old snapshot, not evidence that the requirement changed.

## The delta, v39 (21 Aug) → live (28 Aug)

**2 anchors added · 0 removed · 16 changed**, out of 111.

| | |
|---|---|
| **Added** | **`S12-R10`** (page breaks: later pages open with one identification line — shop location left, document number right; the full masthead does not repeat) · **`S12-R11`** (viewport: nothing clipped; a wide element scrolls inside its own container) |
| **Changed** | `S11-R3` `S12-R2` `S12-R3` `S12-R4` `S12-R7` `S12-R9` `S13-N1` `S13-R6` `S2-N2` `S2-R3` `S3-R8` `S5-N1` `S5-R6` `S5-R7` `S8-R2` `S8-R5` |
| Notable | `S5-R6`/`S5-N1`: the parts-entry label corrected **`"Part"` → `"Parts"`** · `S5-R7`: settings renamed to `"Part price"`, `"Part number"`, `"Part description"` · `S3-R8`/`S13-R6`: voiding or reversing an invoice re-enables the Authorizer row · `S8-R5`: broadened from deposits to **any** partially-applied payment · `S12-R9`: font weight `750` → `700` |

### 🛑 Two diff artefacts, named — because the first two runs were wrong about the spec

1. **The first run reported ALL 109 shared anchors as changed.** The live page comes back as markdown
   and the held body was saved in another flavour, so `*` vs `-` list markers and `_\*` vs `*\*`
   emphasis differed on every line. That was a statement about the diff, not the spec (skill 03
   §8.0-a). Fixed by normalising **markup only, never wording**.
2. **The second run reported 26, of which 13 were the `-N` negatives.** A span running to the *next*
   anchor makes the last anchor of each story swallow that story's trailing note **and the next story's
   heading**, so a downstream edit lights up an unrelated requirement. Fixed by cutting each span at
   the story boundary (`---` / `###`).

**Only after both fixes is 16 an honest number.** Both fixes are in `anchor_diff.py` with the reason
written next to them.

## Coverage verdict (Rule 43) — read LIVE from TestRail, 119 cases

**Every changed anchor is cited by at least one case, and BOTH new requirements are already covered.**

| Anchor | Cases |
|---|---|
| `S12-R10` **new** | [C45195](https://shopview.testrail.io/index.php?/cases/view/45195), [C45213](https://shopview.testrail.io/index.php?/cases/view/45213) |
| `S12-R11` **new** | [C45192](https://shopview.testrail.io/index.php?/cases/view/45192), [C45214](https://shopview.testrail.io/index.php?/cases/view/45214) |
| `S5-R6` (`"Part"`→`"Parts"`) | [C44932](https://shopview.testrail.io/index.php?/cases/view/44932) — **already says `"Parts"`** |
| `S5-R7` | C44933, C44935, C45172 |
| `S3-R8` | C45169, C44985, C44922 |
| `S8-R2` | C45196, C44946, C45174 |
| `S8-R5` | C44949 |
| `S11-R3` | C45197, C44966 |
| `S2-N2` · `S2-R3` | C44911 · C44965, C44910, C45168 |
| `S12-R2/R3/R4/R7/R9` | C44972, C44973, C44974, C44977, C44979 |
| `S13-N1` · `S13-R6` | C44987 · C44984, C44985 |
| **Anchors with no case at all** | **NONE** |

Spot-checked the three highest-risk: C44932 asserts **`"Parts"`** (the corrected label), C45195 says
**"Per v45 S12-R10"** verbatim, C45192 covers the viewport rule. All cite **specification version 45**.

## Verdict

**SOURCE IS CURRENT. Nothing to fold in, no case carries a superseded expectation.** The 31 August pass
read v45 — i.e. the text as it stands after the 28 August edit — and the suite reflects it.

**And the disclaimer finding survives:** `S9-R1`, `S9-N1`, `S9-R2` and `S11-R7` are **not** in the
changed set, so the wording the finding rests on is the live wording. The version gap disclosed in
`../credit-states-2026-09-03/VERDICTS.md` is closed, and its finding stands unchanged.

## One thing NOT refreshed, stated rather than glossed

The **Design Document** is a Claude artifact share link with no version and no date (§5 of CLAUDE.md:
*"an undated, editable share link has no date"*). It cannot be diffed the way Confluence can. The last
recorded read is **2026-08-31** (`../reconcile-2026-08-31/DESIGN-UPDATE-2026-08-31.md`), which found it
had changed and that **every change aligned it with v45, with no case needing an update**. To do better
than that it has to be re-opened and re-extracted by hand.

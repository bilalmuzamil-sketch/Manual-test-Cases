# TASK A — the four cases carrying a waiting-on-the-product-owner line no question supports

**Report Suite · epic SV-8582 · PO Chris Ward · 2026-08-05**

**The QA lead's authorisation, verbatim:** *"Yes, if removing it is the correct step"* — a
**CONDITIONAL** yes. The condition is ours to satisfy, per case, before writing. This paper is
that proof.

**Outcome in one line:** removal was **proven correct on three** cases and they are done;
**one — SBC-VIS-02 = [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) — was NOT
TOUCHED**, because a real product question sits behind it that nobody ever put to Chris.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last updated | Checked | Verdict |
|---|---|---|---|---|
| Chris Ward's answers | Google Sheets `1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY`, ingested to `chris-answers-2026-08-05/ANSWERS-INGESTED.md` | 15 of 24 answered | 2026-08-05 (read) | **CURRENT** — newest authoritative product source |
| Our question sheet (all 24 items + the QA mapping tab) | `chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx` | 24 items, 4 tabs | 2026-08-05 (read in full, every cell) | **CURRENT** |
| Sales By Customer description | Confluence 577634305 | **version 13**, 2026-07-31T13:02:21Z | 2026-08-05 (read live) | **CURRENT as a version; STALE against his answers** |
| Sales By Representative description | Confluence 585629698 | **version 15**, 2026-07-29T06:38:33Z | 2026-08-05 (read live) | same |
| Parts Velocity description | Confluence 620888066 | **version 4**, 2026-07-29T06:41:59Z | 2026-08-05 (read live) | same |
| Technician Utilization description | Confluence 641400833 | **version 5**, 2026-07-29T06:45:11Z | 2026-08-05 (read live) | same |
| Work In Progress description | Confluence 703660034 | **version 6**, 2026-07-29T06:33:58Z | 2026-08-05 (read live) | same |
| Inventory Value description | Confluence 720142338 | **version 3**, 2026-07-29T06:32:54Z | 2026-08-05 (read live) | same |
| Epic SV-8582 | Jira | Tier-1 currency check only (Rule 37) | 2026-08-05 | **PARTIAL** — no full re-read was authorised and none is claimed |
| **QA branch build** | `sv8582.qa.shopview.com` | **`v3.5-16cf83f`**, `last-modified` Wed 05 Aug 2026 06:40:32 GMT, etag `177c59546701e7810b894492dabc1423` | 2026-08-05 11:35 UTC | **⚠️ REDEPLOYED — and NOT OBSERVED THIS PASS** (see below) |

**The version numbers were read from the live Confluence page objects, not from the text inside
the documents** — that is the Rule-31(a) trap, and it is how the Schedule spec once drifted five
versions unnoticed.

### ⚠️ THE BUILD HAS MOVED, AND WE COULD NOT LOOK AT IT

The branch redeployed overnight: the marker read **`v3.4.1-3d03023`** on 4 August and reads
**`v3.5-16cf83f`** now — a minor-version jump, not a rebuild. **Our sign-in no longer works**
(`GET /api/auth/me` → **HTTP 401 `sso_required`**), which is exactly what a deploy does to these
sessions. So **this pass made no live observation of anything.** Every build fact quoted below is
the 3/4 August observation, which is **provisional** (Rule 49) and now sits **two builds behind**.
Nothing here upgrades a verdict, and the re-check queue stays **OPEN**.

---

## 1 · THE FOUR CASES, AND THE EXACT LINE THEY CARRY

All four carried the identical two-line block, immediately before the provenance line:

```
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx
```

| Internal ID | C-id | Link | Report | What the case asserts |
|---|---|---|---|---|
| **SBC-VIS-02** | C30186 | https://shopview.testrail.io/index.php?/cases/view/30186 | Sales By Customer | Row surfaces alternate by tree level; header and totals rows stay white |
| **TU-EXP-07** | C30440 | https://shopview.testrail.io/index.php?/cases/view/30440 | Technician Utilization | Choosing a download with no technician selected is a silent no-op |
| **WIP-SUM-05** | C30491 | https://shopview.testrail.io/index.php?/cases/view/30491 | Work In Progress | The Estimates figure is the Estimates tab's total quoted value, shown muted |
| **IV-DATE-04** | C30564 | https://shopview.testrail.io/index.php?/cases/view/30564 | Inventory Value | For a past date the report replays the closest recorded day on or before it |

**A fifth case, WIP-FLT-05 = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502),
carries the same line and is deliberately OUT OF SCOPE** — our own records classify it as *"a
question that should have been asked and was not"*, so its line is wrong about the sheet but right
that a product decision is missing. It is left frozen and is an ask.

---

## 2 · THE NEGATIVE PROOF — no question on the sheet covers any of the four

A negative claim needs evidence, not assertion (Rule 12). Three independent searches were run over
the **whole** workbook — all four tabs, every cell, 24 reader-facing items — not over a summary of it.

### 2.1 · Search one — the topic of every one of the 24 items

| Item | Its topic, in its own words | Covers any of the four? |
|---|---|---|
| T1-1 | *"The location column - should it appear on its own, or does the user switch it on?"* | no |
| T2-1 | The location chooser shown to a one-location person | no |
| T2-2 | Which identifier leads in the Work In Progress **Asset** column — unit number or vehicle number | no |
| T2-3 | The Sales By Representative download heading word | no |
| T2-4 | Four columns missing from the Sales By Representative summary download | no |
| T2-5 | The date chooser's nine choices and the absent "Custom" item | no |
| T2-6 | The Technician Utilization download **menu wording** | no |
| T2-7 | The Inventory Value spreadsheet's *"As of"* line | no |
| T2-8 | Whether each report needs its own permission | no |
| T2-9 | Print being gone from the product | no |
| T3-1 | Whether the downloads carry the location column | no |
| T3-2 | Whether the six descriptions will be updated | no |
| T3-3 | Where the location column sits in the Summary downloads | no |
| T3-4 | The logo rule for printed downloads | no |
| T3-5 | Which Sales By Customer features were dropped | no |
| T3-6 | Writing down that Technician Utilization sits below the existing menu links | no |
| T3-7 | The Sales By Customer menu group and placement | no |
| T3-8 | The Work In Progress asset chooser's style and select-all | no |
| T3-9 | Writing *"Representative"* out in full | no |
| T3-10 | Parts Velocity called the *"only"* report in the Parts group | no |
| T3-11 | The Escape key on the deactivate pop-up | no |
| T3-12 | The too-big-to-download limit missing from three descriptions | no |
| T3-13 | A note that *"VIN"* also covers machines that are not vehicles | no |
| T3-14 | Garbled characters in two descriptions | no |

**24 of 24 items examined. Not one asks about row colours, a silent no-op, the Estimates value, or
a past-date replay.**

### 2.2 · Search two — keyword sweep of every reader-facing cell

Every word each case's assertion turns on was searched across all three reader tabs:

| Keyword | Hits | Keyword | Hits |
|---|---:|---|---:|
| colour / color | **0** | muted | **1** |
| alternat / stripe | **0** | Estimate | **0** |
| surface | **0** | quoted | 9 |
| indent | **0** | no-op | **0** |
| white | **0** | no technician | **0** |
| row background | **0** | silent | **0** |
| tree | **0** | nightly | **0** |
| chevron | **0** | past date / replay / recorded day | **0** |
| historic | **0** | snapshot | **1** |

**Both non-zero hits were opened and read, and neither is about these cases:**

- **`muted`** — the single hit is **T2-2**, quoting the Work In Progress **Asset column**:
  *"The Asset column is a two-line cell: the unit number on the first line in bold, and the vehicle
  identification number on the second line in a smaller, muted style."* That is a different column
  from the **Estimates figure** in WIP-SUM-05, and a different question entirely.
- **`snapshot`** — the single hit is **T2-7**, inside a quoted Inventory Value spec line
  (*"...or a message that no snapshot is available for the period"*). The question there is whether
  the *"As of"* line belongs in the spreadsheet, not how a past date resolves.
- **`quoted`** — all nine hits are the phrase *"quoted word for word"*, introducing a citation of
  his own description. None is about a quoted **value**.

### 2.3 · Search three — the QA-only mapping tab, matched on exact C-id boundaries

| Case | Appears in a mapping row? | Under which item | Honest reading |
|---|---|---|---|
| **C30186** | **NO — no row mentions it at all** | — | The line was applied with **no mapping basis whatsoever** |
| **C30440** | **YES** | **T3-4, the LOGO question** | **A mapping error.** See 2.4 |
| **C30491** | **NO** | — | No mapping basis |
| **C30564** | **NO** | — | No mapping basis |

*(C30502 does appear, but only as a **style precedent** — the row reads "the pattern WIP-FLT-05 =
C30502 already uses" — not as a case the question affects.)*

### 2.4 · The one mapped case, with both texts quoted side by side (Rule 45(e))

| The question C30440 was filed under | What C30440 actually asserts |
|---|---|
| **T3-4:** *"'The same logo treatment' — the three descriptions describe three different rules."* Asked: *"Which single rule should every report's printed download follow?"* | *"1. Nothing happens: NO file downloads and NO message appears (not even an error). 2. This silent no-op is the specified behavior for every download option when no technician is selected."* |

**The case does not mention a logo, a PDF header, or an image anywhere in its title, preconditions,
steps or expected results.** Chris's answer to T3-4 — *"if the customer has a logo selected, it
appears, if not — no logo"* — cannot change whether a download fires when no technician is picked.
Our own delta paper reached the same conclusion independently: *"Our earlier mapping filed it under
the logo question, which it has nothing to do with."*

### 2.5 · And his answers were swept too, not just the questions

All 15 answers were read in full (`ANSWERS-INGESTED.md`). **None** touches row colours, the silent
no-op, the Estimates value, or the past-date replay. The 9 blanks are T3-6 … T3-14, every one of
which asks him to correct a written description — none of them these four.

---

## 3 · WHAT EACH CASE IS ACTUALLY BLOCKED ON

The previous pass's summary said all four were blocked on *"a developer or nothing at all"*. **We
re-derived it from the sources rather than accepting it, and it is not quite right — C30186 is
different from the other three.**

### 3.1 · C30440 — blocked on a DEVELOPER, no ticket exists

**Live evidence, 2026-08-03** (`viu-2026-08-03/batch-pv-tu/VERDICTS.md`, verdict **DEVIATION**):

> With every technician cleared (the report showing the no-data message) choosing "Summary (CSV)"
> still issued the export request, received 200 and raised a success toast.

**The requirement it breaches, verbatim** — Technician Utilization spec **version 5, S7-N1**:

> If no technician is selected, choosing a download option does nothing: no file downloads and no
> message appears.

**No developer ticket exists for it.** The 2026-08-04 defect pack filed six tickets
(SV-8818 … SV-8823) and this is not among them; searching the pack for *"no-op"* and
*"no technician"* returns nothing. **That is an ask.**

### 3.2 · C30491 — blocked on a DEVELOPER, no ticket exists

**Live evidence, 2026-08-03/04** (`batch-wip-iv/VERDICTS.md`, verdict **DEVIATION**):

> The Estimates figure IS shown muted and IS excluded from Total Earned and Total Remaining … BUT it
> reads $0.00 while the Estimates tab holds 146 work orders — the build shows the approved-value
> total (which is always 0 for an estimate) rather than the "total quoted value" WIP spec v6 S5-R8
> requires … Read: the quoted-value figure is not built — an unbuilt requirement, not a case error.

**The requirement, verbatim** — Work In Progress spec **version 6**:

> **S5-R8:** **Estimates** is the total quoted value of the jobs in the "Estimates" tab, and is
> shown in a muted style.
> **S5-R9:** The Estimates figure is excluded from Total Earned and from Total Remaining.

**Is there a genuine product question here?** Our own register raised one — *"What value should an
Estimate show — quoted, or approved?"* — **but it was never put to Chris**, and it does not survive
contact with the spec: **S5-R8 answers it in his own document, in words** (*"the total quoted
value"*). Our own decision register says so plainly: *"Our case is right; we deliberately did not
weaken it."* **So the spec is not silent, there is nothing for him to decide, and the blocker is a
developer.** No ticket exists. **That is an ask.**

### 3.3 · C30564 — blocked on a DEVELOPER, and the ticket is already named on the case

The case already tells the tester the truth, in its own expected results:

> Known issue: the product does not currently do this. It has been filed for a fix here:
> https://shopview.atlassian.net/browse/SV-8820

**Verified live in Jira today:** `GET /rest/api/3/issue/SV-8820` → **HTTP 200** · type **Bug** ·
status **Ready to Fix** · priority **Low** · parent **SV-8582** · summary *"Inventory Value reports
the stock value for one day AFTER the date asked for"*. That is the same defect the case describes
from the other side, so the citation is accurate and current.

**Why the date-picker hold does not apply to it.** Our register held **six** cases over the
date-chooser preset list — SBC-DATE-01 [C30102](https://shopview.testrail.io/index.php?/cases/view/30102),
SBR-DATE-01 [C30201](https://shopview.testrail.io/index.php?/cases/view/30201),
WIP-FLT-04 [C30501](https://shopview.testrail.io/index.php?/cases/view/30501),
IV-DATE-01 [C30561](https://shopview.testrail.io/index.php?/cases/view/30561), plus the cap figure
in WIP-FLT-05 [C30502](https://shopview.testrail.io/index.php?/cases/view/30502). **C30564 is not
one of them, and it enumerates no presets.** Its un-runnable *"Custom"* step was already repaired —
step 1 now reads *"Open the date range picker and use the month calendar inside it to set a range
ending on the past recorded day, then apply."* **And T2-5 has since been answered anyway** (*"A) This
was purely unintentional -- the original datepicker is the intentional one."*), so even the
step-level dependency is closed.

### 3.4 · C30186 — a REAL product question, never asked. NOT TOUCHED.

**Live evidence, confirmed on two builds** (`batch-sbc-sbr/VERDICTS.md`, verdict **DEVIATION**;
re-confirmed on `v3.4.1-3d03023` on 2026-08-04):

> The case asserts row surfaces ALTERNATE by tree level and that header and totals rows stay WHITE.
> Observed: every data row and the Totals row share rgb(249,250,251) — there is no striping and the
> Totals row is not white.

**The requirement, verbatim** — Sales By Customer spec **version 13** — supports the case:

> **S20-R8:** Column-header cells and customer summary rows use the white surface (#ffffff) …
> **S20-R10:** The totals row uses the white surface (#ffffff) … with a top border and bold text.
> ** Context note: the totals row was set to white on purpose, not the tinted background, to match
> Technician Efficiency, the suite's visual reference.*

**But the pass that found the deviation refused to conclude it was a defect**, in writing:

> PROPOSED (matches the build): "Every row in the table uses the same light background, and the
> Totals row uses that same background rather than white." — **but confirm with the PO first, because
> this may be a styling gap rather than the intended design.**

**So the honest position is uncomfortable and is stated rather than smoothed over:** the freeze
line's *stated reason* is provably wrong — no item on the sheet asks this — **but a real product
question does sit behind it, and it was never asked.** Removing the line would say *"ready to
automate"*, which bakes in an assertion our own pass declined to make; replacing it with a
developer line would assert it IS a defect, which our own pass also declined to say.

**Under the QA lead's condition — *"if removing it is the correct step"* — removal is NOT provably
correct here, so the case was NOT TOUCHED.** What it needs is one sentence from Chris, and that is
an ask. It is the same shape of problem as C30502: a question we should have asked and did not.

---

## 4 · THE DECISION AND THE WRITE, PER CASE

| Case | Decision | What was written |
|---|---|---|
| **C30440** | **(ii) REPLACE** — the line was wrong about *who* we wait for | Freeze block removed; an accurate plain-English line added naming the real blocker (a developer fault, no ticket yet) |
| **C30491** | **(ii) REPLACE** — same | same shape |
| **C30564** | **(i) REMOVE ENTIRELY** | Freeze block removed; nothing added, because the case **already** names SV-8820 in plain words, so no readiness is overstated |
| **C30186** | **NO WRITE** | Untouched. Condition not satisfied |

**Why C30440 and C30491 did not simply get the line deleted.** Both will FAIL on the current build.
Deleting the freeze line and adding nothing would have left a test that looks ready and fails with
no explanation — which overstates readiness and invites someone to "fix" a correct test. The
replacement says, in words a non-technical tester can act on, that the fault is the product's, that
it is a developer's to fix, and that the test should be left alone.

**The exact new sentence on C30440:**

> Known issue: the product does not currently do this — on the build tested, choosing a download
> with no technician selected still started the download and showed a success message. That is a
> fault for a developer to fix, not a decision for the product owner. No developer ticket has been
> raised for it yet, so this test will fail until it is fixed — record what you see and leave the
> test as it is.

**The exact new sentence on C30491:**

> Known issue: the product does not currently do this — on the build tested, the Estimates figure
> read $0.00 even though the Estimates tab held jobs, because the product is showing the approved
> value instead of the quoted value. That is a fault for a developer to fix, not a decision for the
> product owner. No developer ticket has been raised for it yet, so this test will fail until it is
> fixed — record what you see and leave the test as it is.

### Two things deliberately NOT changed, and why

- **The provenance line was left exactly as it stands** on all three, still naming *"the build
  tested on 8/4/2026 (build v3.4.1-3d03023)"*. That is **true** — it is the build we tested them on.
  Re-stamping it to `v3.5-16cf83f` would claim an observation we did not make (Rule 12). The redeploy
  is recorded in the re-check queue, which is where a build change belongs.
- **No `AUTOMATION: READY` / `AUTOMATION: HOLD` marker was added.** That marker does not exist on
  **any** of the 474 live cases yet (counted: 0 and 0), and the QA lead specified it for the **new**
  cases. Putting it on 3 of 469 would create a convention that holds for 0.6% of the suite. Stated
  here so the omission is a decision, not an oversight.

---

## 5 · RULE-41 WHOLE-CASE RE-READ — and what else it found

Every touched case was re-read end to end, not just the field being edited.

| Case | Re-verified whole against | Fields checked | Result |
|---|---|---|---|
| C30440 | **Technician Utilization report specification version 5** (live-verified 2026-08-05) | title · preconditions · steps · expected · refs · section · type | Expected items 1–2 match **S7-N1 verbatim**. Title 65 chars. refs correct format. **One second finding — below.** |
| C30491 | **Work In Progress report specification version 6** (live-verified 2026-08-05) | same | Expected items 1–3 match **S5-R8 + S5-R9 verbatim**. Title 75 chars. refs correct. No further defect. |
| C30564 | **Inventory Value report specification version 3** (live-verified 2026-08-05) | same | Expected item 1 matches **S5-R4 verbatim**. Step 1 already repaired. Title 71 chars. refs correct. No further defect. |
| C30186 | **Sales By Customer report specification version 13** (live-verified 2026-08-05) | same | Expected items 1–5 match **S20-R8/R9/R10/R11/R14 verbatim**. No case defect — the disagreement is with the build, not within the case. |

### SECOND FINDING (recorded, not silently left) — C30440's step 2

> 2. Choose each download option in turn (Summary PDF, Expanded PDF, CSV).

It names **three** options in the **short** form. Chris's **T2-6 = B** answer (*"B) is correct here.
Consistency is key."*) settles the wording as the longer *"Download …"* form, and on our reading
settles the count at **four**. **The step is imprecise, not broken** — *"choose each download option
in turn"* still tells a tester exactly what to do whatever the menu holds — so it is **not** a
blocker.

**It was NOT changed, deliberately.** C30440 is **not** one of the 46 staged edits (checked: the 46
cover C30434 and C30435 for this same answer, not C30440), so editing its steps was authorised by
neither instruction. **It is an ask: one more edit, to bring step 2 into line with T2-6 = B.**

### THIRD FINDING — both C30440 and C30491 were carrying a DEVIATION with no warning to the tester

Neither case said anywhere that the product currently fails it, despite live DEVIATION verdicts from
3/4 August. A tester would have hit an unexplained failure and had no way to tell a real regression
from a known one. **Fixed by this pass** — that is what the new sentence does.

---

## 6 · VERIFICATION (Standing Rule 50 — exhaustive, then exact)

| Op | Operation | Target | HTTP | Verification |
|---:|---|---|---:|---|
| 1 | `update_case` (`custom_expected`) | **C30440** TU-EXP-07 | **200** | **MATCH** — 30 fields compared · 1 intended field byte-equal to the intended payload · 29 untouched fields proven byte-identical to the pre-write snapshot · 0 mismatch |
| 2 | `update_case` (`custom_expected`) | **C30491** WIP-SUM-05 | **200** | **MATCH** — 30 fields compared · 1 intended byte-equal · 29 untouched byte-identical · 0 mismatch |
| 3 | `update_case` (`custom_expected`) | **C30564** IV-DATE-04 | **200** | **MATCH** — 30 fields compared · 1 intended byte-equal · 29 untouched byte-identical · 0 mismatch |

- **No sampling.** Every field of every touched case was compared, both directions.
- **`refs` was not written** by any of the three operations, and was proven byte-identical.
  The declared `refs` normalisation — `','.join(p.strip() for p in s.split(','))` — was therefore
  not needed here; it is declared for completeness.
- **0 add · 0 delete · 0 section · 0 run writes.**
- Pre-write snapshot: `/tmp/testrail/PRE/cases-4281.json` — **474 cases** under group 4281
  (469 ours + 5 authored by Vladimir Tomovic). Per-case before/after bodies retained.
- **Overlap check:** none of the four cases appears in the 46 staged operations
  (`chris-answers-2026-08-05/staged-operations.json` — its 46 C-ids were listed and compared).
- **On a mismatch the write would have been treated as FAILED and the batch stopped.** No mismatch
  occurred, so nothing was retried.

---

## 7 · OUTSTANDING — what I need from you

1. **One sentence from Chris about the Sales By Customer row colours** (C30186). His own description
   says the totals row is white *"on purpose"*; the product paints every row the same. Is the
   description right and the product wrong, or was the striping never really wanted? Until he says,
   the case stays frozen. **This question has never been asked — that is our gap, not his.**
2. **Your go-ahead to raise two developer tickets that do not exist yet** — the Technician
   Utilization silent-no-op fault (C30440) and the Work In Progress Estimates value (C30491). Both
   are proven against his own descriptions; neither is in the six tickets filed on 4 August.
3. **Your go-ahead for one more small edit to C30440's step 2**, to bring its three short download
   names into line with Chris's T2-6 = B answer.
4. **A decision on WIP-FLT-05 = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502)**,
   left frozen on purpose: its line is wrong about the sheet, but right that a product decision is
   missing — the one-day date-cap difference was never asked of Chris.
5. **Fresh sign-in for the QA branch.** It redeployed to **`v3.5-16cf83f`** this morning and our
   session is dead, so **nothing was observed live this pass** and every build fact above is two
   builds old.

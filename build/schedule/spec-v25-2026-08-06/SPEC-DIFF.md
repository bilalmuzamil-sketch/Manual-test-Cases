# Schedule — SPEC DIFF: our baseline (Confluence v23) → CURRENT (Confluence v25)

> **Pulled live 2026-08-06.** Page **713031682** "Schedule", space `SHOPVIEW`.
> Auth pre-verified `GET /rest/api/3/myself` → **HTTP 200** (Bilal Muzamil). Current body via
> `GET /wiki/rest/api/content/713031682?expand=body.storage,version,history.lastUpdated` → **HTTP 200**.
> **All 25 historical bodies** pulled with `?status=historical&version=<n>` → **25 × HTTP 200**, so
> every delta is attributed to the version that introduced it **and every requirement can be DATED by
> diffing its own text across versions** (Standing Rule 31 trap (c)).
>
> | | |
> |---|---|
> | **Our baseline** | Confluence **version 23** — 2026-07-30T10:40:32Z (= `build/schedule/requirements.md`) |
> | **Current** | Confluence **version 25** — 2026-08-06T09:13:51Z, **Branko Cicovic**, version comment **empty** |
> | **Versions behind** | **2** (24, 25) — both published **TODAY**, 39 minutes apart |
> | **Page-body "Version" field** | still reads **1.0**, as it has since v1. **Trap (a). Go by the Confluence number.** |
> | **Change-log section** | **none — this page has never had one**, and the version comment is empty on both v24 and v25 |

---

## 0. Headline — and it is a small one, stated plainly

**The entire v23 → v25 change is THREE tokens, of which ONE is not content at all.** This is a
**near-quiet spec bump**, and saying so is the finding: two versions landed today, both by the PO,
both with empty version comments, and between them they move **two sentences**.

**But "small" is not "nothing", and neither of the two is cosmetic:**

- **one DELETES a requirement our suite asserts in a case TITLE** — and that case is currently marked
  `EXPECT FAIL` against a defect that has now been **closed OBSOLETE on the strength of that very
  deletion**;
- **one RATIFIES a nine-day-old PO ruling** our suite already follows, which makes a **Rule-56
  divergence sentence on a live case stale**.

**And dating the second one surfaced something the diff alone would not have found:** a **PO ruling
made 17 minutes AFTER v25 was published** which supersedes a **different §4.9 requirement that v25
left untouched** — and one of our cases asserts that requirement as a PASS. That is row **D-A/3**,
and it is the sharpest item in this document.

### Exhaustiveness proof of the diff (Standing Rule 50 — no sampling)

The two bodies were tokenised into tags and text nodes and compared as full token streams, not
eyeballed and not sampled:

| | |
|---|---|
| v23 tokens | **2182** |
| v25 tokens | **2182** |
| **non-equal opcodes** | **3** |
| of which non-content | **1** — the `ac:macro-id` on the Jira macro, which **Confluence regenerates on every save**. It changed at v24 *and again* at v25, which is exactly how you tell it is machinery rather than an edit. |
| **of which substantive** | **2** |

---

## 1. THE PER-REQUIREMENT COVERAGE VERDICT TABLE (Standing Rule 43 — mandatory)

**One row per ASSERTION, not per requirement (Rule 45(e)).** Assertion counts were taken from the
verbatim text before the rows were written: delta **D-B** asserts **two** things (what happens to
non-matching blocks, and what happens to matching ones), so it is **split into two rows**; delta
**D-A** asserts **one** thing about the line figures.

**Both texts are quoted side by side in every row**, requirement beside the covering case's own
words. A row naming only a case id would be unfalsifiable and is not permitted.

| Req id | Verbatim requirement text (Rule 25) | Delta type | Surfaces it names (Rule 40) | **VERDICT** | Case(s) — internal ID + C-id + link, with the case's own text quoted |
|---|---|---|---|---|---|
| **D-A/1** · §4.9 | **v23:** *"Scope summary and the scheduled line(s) with **labor/total** figures."* → **v25:** *"Scope summary and the scheduled line(s) with **labor/status** figures."* | **CHANGED** (v25) | **screen only** — the shift detail modal. Checked against the full surface list: no export, no print, no API, no email, no settings, no empty state, no mobile variant is named or implied. `§8.1` does list a `total` field on the Line entity, but that is the data model, not this surface. | **covered by case — and the change RATIFIES it.** No edit needed to the assertion. **A separate edit IS needed to the case's divergence sentence**, which has gone stale; see `PROPOSED-CHANGES.md` §1. | **SCH-MODAL-04 = [C30011](https://shopview.testrail.io/index.php?/cases/view/30011)** *"The modal lists the scheduled line(s) with no money fields"*. The assertion is carried by **`custom_expected` items 2 and 3**, verbatim: *"2. Exactly the 2 scheduled lines are listed (not all 4), each showing its line number, title, hours, and **a status pill only**."* and *"3. **No labor figures and no total dollar amount** appear anywhere in the modal."* → the requirement now says **status**, the case says **status pill only**. They agree. |
| **D-B/1** · §6 (Search) | **v23:** *"…and line name. **Non-matching blocks fade**; matching blocks highlight."* → **v25:** the whole sentence is **GONE**; only *"Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name."* remains. | **REMOVED** (v24) | **screen only** — the grid. No other surface named. | **case needs extending** — specifically, **this assertion must be REMOVED from the case, and the case retitled**. It is now unsourced in the PRD. **Do NOT substitute what the build does** (Rules 25/57): the positive replacement assertion needs Branko, see `QUESTIONS-FOR-BRANKO.md` Q1. **⚠️ The assertion is NOT dead — the owning STORY still requires it; see §3.** | **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** — the removed requirement is in the **case TITLE** (*"Toolbar search highlights matching blocks and **fades non-matching ones**"*) and in **`custom_expected` item 1**, verbatim: *"1. Blocks that match the search are highlighted; **blocks that do not match fade**."* Also **item 3**, verbatim: *"3. Matching blocks stay in place on the grid (search **visually filters; it does not remove** or rearrange)."* — which depends entirely on the deleted sentence. |
| **D-B/2** · §6 (Search) | **v23:** *"…Non-matching blocks fade; **matching blocks highlight**."* → **v25:** **GONE.** | **REMOVED** (v24) | **screen only** — the grid. | **case needs extending** — same case, same field, second assertion. The *highlight* half is separable from the *fade* half and is verdicted separately precisely because a partial repair is a live risk: removing only the fade clause would leave the case asserting a highlight the PRD no longer requires. | **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)**, `custom_expected` item 1, verbatim: *"1. **Blocks that match the search are highlighted**; blocks that do not match fade."* |
| **D-A/3** · §4.9 | **NOT a v24/v25 text change — the spec line is UNCHANGED and still reads** *"Estimated hours with inline edit."* **What changed is the GOVERNING SOURCE:** Branko Cicovic on **SV-8829, 2026-08-06T09:31:05Z**, verbatim: *"**Estimated badge should not be clickable, you can change time only in the input fields above.** I updated PRD, for work order lines we just show estimate and status badge, there shouldn't be totals. Please always check the design as it is single source of truth."* | **PO RULING supersedes unchanged spec text** (2026-08-06, **17 minutes AFTER v25**) | **screen only** — the shift detail modal. | **blocked** — **the blocker is an ambiguity in the ruling's SCOPE, and the owner is Branko.** His words name *"the Estimated **badge**"*; SV-8829's own steps distinguish the **line row's** estimate badge (*"only 1h and an Authorized badge"*) from the **modal-level** *"Estimated hours with inline edit"*. **Whether the ruling kills the modal-level inline edit, or only the line badge, is not determinable from the text** — and under **Rule 58 an ambiguous source is never resolved by looking at the build.** So the case is **NOT flipped**; a `HOLD` and the question are proposed instead. See `QUESTIONS-FOR-BRANKO.md` Q2. | **SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012)** *"Estimated hours can be edited inline in the modal"* — `custom_expected` verbatim: *"1. **The estimated hours field is editable directly in the modal.** 2. The new value persists after closing and re-opening. 3. Dependent displays (progress vs estimate) reflect the new value."* It currently carries **`AUTOMATION: READY`** — i.e. **we expect it to PASS** — while SV-8829 reports the build does **not** allow the edit and **Branko closed that report OBSOLETE**, meaning the build is right. **As it stands this case would fail a build the PO considers correct.** |

### Completeness gate (Rule 17) — both totals, reconciled

| | |
|---|---|
| **Substantive deltas found by the diff** | **2** (D-A, D-B) |
| **Rows after the per-assertion split** | **3** (D-A/1 · D-B/1 · D-B/2) |
| **Additional rows for a governing-source change that is NOT a page diff** | **1** (D-A/3) |
| **Total rows in the verdict table** | **4** |
| **Un-verdicted rows** | **0** |
| **Deltas in the diff but absent from the table** | **0** |
| **Anchors in the change log absent from the table** | **0 — the page has no change log** (stated, not assumed) |

**Honest note on the count:** **D-A/3 is not a v23→v25 spec delta and is not presented as one.** It
was found *while dating* delta D-A across versions, it changes what the case ought to expect, and
burying it in prose is exactly what Rule 43 exists to prevent — so it gets a row, with its delta type
labelled for what it is.

---

## 2. DATING EACH DELTA BY ITS OWN TEXT (Standing Rule 31 trap (c))

**A page version being new says nothing about whether a rule inside it is new.** Each string was
traced across **all 25 historical bodies**. Verdict first: **both deltas are genuinely new, so no
inversion risk materialised** — but the *ages of the texts they replaced* are not visible from the
version number, and one of them matters.

| Marker string | First appears | Last appears | Age of the text at the moment it moved |
|---|---|---|---|
| `labor/total figures` | **v1** — 2026-07-15T21:17:56Z | **v24** | **the ORIGINAL wording, unchanged across 24 versions / 22 days** |
| `labor/status figures` | **v25** — 2026-08-06T09:13:51Z | v25 | **brand new — under 4 hours old when this pass read it** |
| `Non-matching blocks fade; matching blocks highlight.` | **v7** — 2026-07-17T10:10:41Z | **v23** | **~20 days old when deleted** |
| `Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name.` | **v7** | **v25 (survives)** | unchanged since v7 |

**The three partial saves are named so the gaps are not misread.** Versions **10, 12 and 14** have
truncated bodies (7,314 / 8,632 / 5,918 characters against ~36,000 either side) — Confluence
intermediate saves, not requirement states in which the strings were "absent". They are excluded from
the dating logic deliberately, and named here rather than silently skipped.

**Why the trap was worth running even though it fired negative:** the same check on the *stories* did
find something (§3), and on Filters this morning the identical check found spec text **byte-identical
across ten versions and unchanged since 2026-05-14** being treated as new. Cost: one script. Value:
the only thing standing between "the page is newer" and "the rule is newer".

---

## 3. THE HALF THE DIFF CANNOT SEE — the owning STORIES still carry both old requirements

Under **Rule 57** expected behaviour comes from **(a) the PRD, (b) the epic's stories, or (c) the PO's
verified answers**. The PRD is only one of the three, so a sentence leaving the PRD does **not**
automatically leave the requirement set. It was checked, and in **both** cases the story still asserts
the old text.

### 3a. SV-8686 still requires the fade/highlight behaviour — in TWO places

Read live 2026-08-06. **Requirements** section, verbatim:

> *"Grid search filters blocks by matching against customer name, WO number, unit number, technician
> name, and line name. **Non-matching blocks fade; matching blocks highlight.** — (PRD: §6)"*

**Acceptance Criteria**, verbatim:

> *"Given the user types in the grid search, when the query matches a customer name, then **matching
> blocks highlight and non-matching blocks fade**."*

**Trap (c) applied to the story too:** the text is present **before and after all four** of Ayesha
Khan's description edits, the most recent at **2026-08-05T19:22:33Z** — so it has **not** been quietly
removed from the story, it was confirmed present as recently as yesterday evening.

**But the PRD deletion is not ambiguous, because it has a documented audit trail** (this is why
D-B/1 and D-B/2 are verdicted as repairs rather than as open questions):

| Time (UTC) | Who | What |
|---|---|---|
| 2026-08-05 05:26Z | Mudassir Qamar | files **SV-8874** *"Grid search hides non-matching shifts instead of fading them"*, quoting the PRD requirement |
| **2026-08-06 08:15:35Z** | **Stefan Vukovic** | *"Take a look at this one, **per design we show only shifts/events that are matching the search. This is a gap between PRD and design.**"* |
| **2026-08-06 08:32:34Z** | **Milos Vasic** | *"All good on this one **updated the PRD** , i will close this ticket as absolute"* |
| 2026-08-06 08:32:42Z | Milos Vasic | transitions SV-8874 → **OBSOLETE / Done** |
| **2026-08-06 08:34:03Z** | **Confluence v24** (authored under **Branko Cicovic's** account) | **the fade/highlight sentence is deleted — 81 seconds after that comment** |

**So the deletion is a deliberate de-scope, not an accident:** the design shows only matching blocks,
the PRD was judged wrong, the PRD was corrected, the defect was closed. **SV-8686 is now the stale
artefact** — exactly the pattern v23 produced when it deleted the modal *Reassign* action while
SV-8695 kept listing it, which our own `requirements.md` already records.

**One attribution detail recorded rather than explained away:** the comment saying *"updated the
PRD"* is **Milos Vasic's**, while Confluence attributes **v24** to **Branko Cicovic's** account
(`712020:92c46428-…`, the same account as v1 through v25). We do not know which of them performed the
edit and are not guessing.

**And the sharp consequence for Rule 57:** the PRD is now **SILENT** on what happens to non-matching
blocks. *"Filters grid blocks by matching against…"* is suggestive but does not say. **Stefan's
"per design we show only matching" is an engineer's statement about a design we do not hold** (source
D is PARTIAL). **So the deletion licenses REMOVING our fade assertion; it does not license asserting
the opposite from the build.** That is Q1 for Branko.

### 3b. SV-8695 still says `labor/total` — and Branko himself left it there

Read live 2026-08-06. **Requirements** section, verbatim:

> *"Shift detail modal shows: … scope summary with scheduled line(s) and **labor/total**, estimated
> hours with inline edit, …— (PRD: §4.9)"*

**Trap (c) applied:** `labor/total` is present **before and after Branko Cicovic's own description
edit of 2026-08-03T08:54:30Z** — *"labor/status" appears in neither the before nor the after text.* So
**the PO edited this story three days ago and left `labor/total` standing**, then changed the PRD on
2026-08-06. The story is the stale artefact, and the same person authored both.

**Three sources now point one way and one lags:** Branko's 22 July ruling (no money on the Schedule),
PRD v25 (`labor/status`), and his 2026-08-06 SV-8829 comment (*"we just show estimate and status
badge, there shouldn't be totals"*) all agree. **SV-8695 alone still says `total`.** Under Rules
32/33 the case follows the three, which it already does.

**SV-8695 also still lists *"estimated hours with inline edit"*** — which is the other half of row
**D-A/3**, and the reason that row is `blocked` rather than decided: **the PRD and the story agree
with each other and only the PO's newest comment disagrees**, so flipping the case off two written
sources onto one ambiguous sentence would be the Filters mistake in reverse.

---

## 4. What did NOT change, checked rather than assumed

Stated because a NO-CHANGE list is the highest-risk section of any reconciliation and the one that
produced a false all-clear on 2026-07-31:

- **The five requirements our `requirements.md` flags as `[v22/v23 — changed]`** — the §4.9 Actions
  list (*Reassign* deleted), §4.5/§4.6 shop closures, §4.4 shift colour, §4.10/§7 cell menu, §4.8 now
  line — are **byte-identical between v23 and v25**. The token diff has exactly 3 opcodes; none is in
  any of them.
- **The two HELD items** (D1 events-count-toward-capacity, D4 modal Reassign) are **untouched**; §4.11
  and §4.12 still read as they did at v23.
- **The §12-vs-§4.5 shop-closures self-contradiction is STILL LIVE and unresolved in v25** — §4.5
  *"Shop closures and public holidays are not skipped in V1."* against §12's blocking wording. **v24
  and v25 did not touch it**, so outstanding item **S1** stands exactly as it did, and the question
  still has not been sent.
- **The §7-vs-§14.1/§14.2 left-click-vs-right-click cell-menu wording defect** reported by the
  5 August pass is **still present in v25** — not fixed, not made worse.
- **`Add Existing Work Order` appears in NO version** — checked as a literal against **v23, v24 and
  v25**: absent from all three. This is the SV-8916 point; see `DESIGN-SOURCE.md`.

---

## 5. What this means for the 168 cases, in one paragraph

**Requirements changed: 2** (plus 1 governing-source change that is not a page edit). **Cases
affected: 3.** **Cases needing an edit: 2** — [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)
substantively (title + two expected items + its marker) and
[C30011](https://shopview.testrail.io/index.php?/cases/view/30011) in its provenance/divergence
wording only. **Cases needing a HOLD and a question: 1** —
[C30012](https://shopview.testrail.io/index.php?/cases/view/30012). **New cases genuinely needed: 0
from the spec diff.** **Nothing has been written to TestRail** — every change is staged in
`PROPOSED-CHANGES.md` awaiting the QA lead's go-ahead (Rule 6), and Rule 11 asks which process he
wants run on a new spec version before anything is applied.

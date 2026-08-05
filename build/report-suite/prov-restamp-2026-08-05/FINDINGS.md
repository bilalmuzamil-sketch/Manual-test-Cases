# Report Suite — PROVENANCE RE-STAMP + LOCATION RE-REPAIR — FINDINGS

**Date:** 2026-08-05 · **Project:** Report Suite ONLY · epic **SV-8582** · TestRail group **4281**
**Population:** all **473** of our cases (live total 478; the 5 foreign cases C38919–C38923 excluded and
proven untouched). **No sampling** (Rule 50).

---

# 1 · JOB 1 — THE PROVENANCE LINE NO LONGER NAMES THE BUILD AS THE SOURCE

**The QA lead's instruction, verbatim:** *"at present it says something like this ' and as per the build
tested on ' it should never say that it is an expected behavior as per the build testing because it can
confuse the tester as well as it can raise a serious concern of the higher ups that how can something be
considered as the expected behavior if it is happening on the build because the build can be wrong too."*

**Before:** **461 of 473** cases opened *"This is the expected behaviour as per the build tested on
8/4/2026 (build v3.4.1-3d03023), and as per the … specification version N (anchor)."* — the build named
**first**, as the source of the expectation.

**After, on all 473 — two sentences that never merge:**

> This is the expected behaviour as per epic SV-8582 and the Sales By Customer report specification
> version 15 (S1-R1, S1-R3, S1-R4).
> Last checked against build v3.4.1-3d03023 on 8/4/2026.

**Sentence 1 names documents only** — the epic, the report's specification at its **current live version**
with the case's own requirement anchors, and, where that is genuinely the basis, Chris Ward's answer file
with its link and date. **Sentence 2 names the build only as what the case was last checked against**, in
neutral words; it never says "passed" or "verified", so a case that fails on the build is not
contradicted by its own provenance.

| Check | Result |
|---|---|
| Cases re-stamped | **473 of 473** |
| Provenance lines per case afterwards | **exactly 1** on all 473, read back from live |
| Barred phrasings remaining (`as per the build tested on`, `verified by the build`, `as the build behaves`, `as per the build`) | **0** |
| `confirmed in the build` hedges remaining | **0** (the last one, C30160, was repaired — §4) |
| Cases whose sentence 2 says plainly they have **not** been checked on a build | **7** (C30278, C38856, C43550, C43551, C43552, C43553 and C30502's predecessor state) |

**17 distinct provenance shapes existed**; each was re-expressed in the two-sentence form with its own
citations preserved, not flattened to a template. Six cases whose divergence clause said *"where the
wording of that specification differs, the behaviour above follows a later product decision"* had their
clause **removed** because the specification has since caught up — the PV/TU/WIP/IV permission cases
(C30325, C30327, C30391, C30398, C30526, C30603) plus C30159 and C30328. **Rule 56's honesty half:
where nothing diverges, no divergence sentence.** The clauses that remain now **name Chris Ward and link
his answer file** instead of gesturing at "a later product decision".

---

# 2 · THE SPECIFICATIONS MOVED **TWICE** WHILE THIS PASS RAN

| Report | Version I used when writing began | Version live at the end | Moved? | Cases affected | Change-log message |
|---|---|---|---|---|---|
| Sales By Customer | 14 | **15** | **YES** | **86** | "Parth WIP review + suite-wide link-permission rule (2026-08-05)" |
| Sales By Representative | 16 | **17** | **YES** | **111** | same |
| Parts Velocity | 5 | 5 | no | — | "Applied QA review workbook decisions (2026-08-04)" |
| Technician Utilization | 6 | 6 | no | — | same |
| Work In Progress | 7 | **9** (two versions) | **YES** | **77** | "WIP asset filter scope wording (Parth review)" |
| Inventory Value | 4 | 4 | no | — | same |

**So 274 cases were re-stamped a SECOND time in the same pass** — the first write carried SBC 14 / SBR 16
/ WIP 7, the second carries SBC 15 / SBR 17 / WIP 9. That is recorded here rather than quietly absorbed,
because a field written twice in one day is itself worth knowing. **Every case was left naming the version
that was live when the pass finished**, re-read at the end (Rule 31). The build did **not** move:
`v3.5-16cf83f`, `index.html` sha256 identical at the start and the end of the pass.

**These new edits do NOT touch the Location column.** Read from the live text, not assumed:
**SBC v14→15** added **one** requirement and changed none; **SBR v16→17** changed **zero** numbered
requirements (a narrative edit only); **WIP v7→9** changed **S4-R5, S7-R1, S7-R2, S7-R4** and none of them
is about Location. **SBC S13-R4, SBC S4-R12, SBR S21-R7, SBR S20-R1/R2, WIP S4-R3 and WIP S7-R13 are all
byte-unchanged**, so every held/released decision below still stands against the newest text.

## 2.1 · The new requirements, quoted verbatim — recorded for the follow-on pass, NOT acted on

**SBC v15 — S9-R1a (NEW):**
> "The invoice number is rendered as a link only when the user has permission to open the target it links
> to (the work order or parts sale); a user without that permission sees the invoice number as plain text."

**SBR v17 — §2 expanded rows (narrative, no anchor):**
> "…the invoice's date and number (a clickable link to the underlying work order or parts sale in the same
> tab, **rendered as a link only when the user has permission to open that target, otherwise plain text**);
> the customer name (**clickable and styled as plain text when the user has permission to open the
> customer, otherwise non-interactive plain text**)…"

**WIP v9 — S4-R5 (CHANGED):**
> OLD: "WO # is shown as a link that opens the work order in the same browser tab; the user returns via
> the browser's back navigation."
> NEW: "…**only when the user has permission to access Work Orders. A user without Work Order permission
> sees the WO # as plain text, not a link**."

**WIP v9 — S7-R1 / S7-R2 / S7-R4 (CHANGED):** each filter's option list is now *"the advisors / customers /
assets present **across all open jobs in the current scope** (the report loads the complete set of open
jobs in one request)"* rather than *"present in the loaded jobs"*.

**Change-log entries dated today exist on all three pages** for exactly these items, signed `@claude`.

**COVERAGE CONSEQUENCE, STATED SEPARATELY SO IT CANNOT FLATTER THE GATE:** the link-permission rule adds a
**negative** requirement on at least three reports — *a user without permission sees plain text* — and
**no case in the suite covers it on any report.** The denominator has moved. **Not authored** (Rule 6; the
coordinator has this as a separate authorised piece of work needing per-role live testing). The gate in §6
is measured against the cases that **exist**.

**One case was tightened, because leaving it would have been asserting more than its source says:**
**WIP-COL-03 = [C30468](https://shopview.testrail.io/index.php?/cases/view/30468)** said *"1. The WO # is
shown as a link."* unconditionally; under v9 S4-R5 that is only true for a permitted user, so item 1 now
reads *"For a person who has permission to open work orders, the WO # is shown as a link."* (Rule 42
scope-conditional). The **negative half remains uncovered and is reported, not written.**

---

# 3 · JOB 2 — THE LOCATION COLUMN, RE-DERIVED FROM THE CURRENT LIVE TEXT

The earlier pass removed a pasted "Location is toggleable" paragraph from 13 cases because five specs
contradicted it; Chris then edited four specs to ratify the toggleable model. **So I re-derived every one
of the 13 from that report's own live specification, and the answer is not the one the brief expected.**

**ONLY TECHNICIAN UTILIZATION ACTUALLY MOVED ITS NUMBERED REQUIREMENTS.** In the other five reports the
decision landed in the **narrative summary and the change log**, while the numbered requirement that says
the opposite was **left untouched** — verified by extracting every numbered requirement from both versions
and comparing by anchor (`diff-summary.json`).

| Report | The requirement that governs the column — VERBATIM, live | The narrative / change log — VERBATIM, live | Verdict |
|---|---|---|---|
| **TU v6** | **S10-R4** (rewritten in v6): "The per-row Location column **is one of the toggleable columns** for a user with access to more than one location: it is shown by default and **can be toggled on or off from the column selector** (S9-R9). A user with access to only one location never sees it and it is not offered to them in the column selector." · **S9-R9** (rewritten in v6): "The report shows a per-row Location column to any user with access to more than one location; it is shown by default and can be toggled on or off from the column selector" | agrees | **SETTLED → 3 cases RELEASED** |
| **SBC v15** | **S13-R4** (unchanged): "The nine toggleable columns are, in order: Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %." — a closed list of nine **without** Location | **S4-R12**: "…the column is shown by default and **can be toggled on or off from the column selector**" | **BOTH WAYS → held** |
| **SBR v17** | **S21-R7** (unchanged): "A per-row Location column is shown on the report **only when the current view spans more than one location**… When the view is scoped to a single location the column is hidden" · **S20-R1**: the dropdown holds "the **seven** toggleable metric columns" · **S20-R2** lists them, Location not among them | §2: "it is shown by default and **can be toggled on or off from the column selector**" | **BOTH WAYS → held** |
| **PV v5** | **S3-R10** (unchanged from v4): "The column is auto-managed by the location scope (it is not one of the 20 columns in the picker, S4-R1, and **is not user-toggleable**)" | §4 **added in v5**: "Such a user sees it by default and **can toggle it on or off from the column selector**" · change log **added in v5**: "the Location column changed to an access gate (… and can toggle it in the column selector …)" | **BOTH WAYS → held** |
| **WIP v9** | **S7-R13** (unchanged): "…**the user does not toggle it in the column selector**." | **S4-R3** (changed in v7): "The Location column **is offered in the column selector**… can be toggled on or off." — **the same document contradicts itself** | **BOTH WAYS → held** |
| **IV v4** | **S7-R6** (unchanged from v3): "Its visibility follows the location scope automatically and **it is not one of the columns offered in the column-selection control**" · **S3-R1**: "When the report is scoped to more than one location, a Location column (S7-R6) is inserted…" | §2/§4 **added in v4**: "access-gated and toggleable" | **BOTH WAYS → held** |

## 3.1 · ⚠️ THIS CORRECTS THE BRIEF ON PARTS VELOCITY, AND I DID NOT ACCEPT EITHER SIDE

The brief and the round-3 question sheet record **Parts Velocity as "never touched"** on this point, and
the coordinator's correction listed the remaining contradictions as **SBC, SBR, WIP and IV only** — with
the instruction to *"follow PV's own v5 text"*. **Followed literally that would mean asserting
"not user-toggleable" for PV.** But PV v5's §4 **and** its change log were **added in v5** and assert the
opposite of S3-R10, which v5 left untouched. **PV states it both ways.** Asserting either side would pick
a winner inside a self-contradictory document, which **Rules 15 and 57 forbid**, and it would contradict
the round-3 sheet we sent Chris today, which asks about PV. **PV's two cases therefore stay held.** I did
not import a sibling report's rule into PV, and I did not settle it from the build.

## 3.2 · What the 12 held cases now say, and what they no longer say

They **no longer assert either reading**. Each states only what **both** readings agree on — the column
appears when more than one location is involved, its values, its position, its presence in the downloads,
and that a single-location-access user never sees it — and then carries a plain-words note (no anchors, no
jargon, Rule 7) that the written description says two different things, that the product owner has been
asked, that **no bug is to be raised either way**, and a link to the round-3 sheet. Marker:
`AUTOMATION: HOLD - the written description says two different things about the Location column and the
product owner has been asked`.

Three further defects in those cases were fixed while they were open (Rule 41):
- **The stale round-2 link on 13 cases** — they pointed at `Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx`,
  superseded by the round-3 sheet. On the 3 TU cases the note was **false** as well as stale.
- **"Note for the tester: on this build the column does not yet behave this way… The change is with the
  developers." on 13 cases** — it asserted the build's behaviour on a point we had just declared
  unsettled, **and it claimed a developer ticket that is named nowhere.** Removed from the 10 that stay
  held (their held note says the same thing accurately) and replaced on the 3 TU cases with the plain
  *"if it does not behave this way, mark this test Failed and report it - do not change the test."*
- **A doubled `---` separator** (C30156 and others) and stray trailing separators — normalised, so all 473
  now carry exactly one separator before the provenance line.

## 3.3 · The 16 held cases — released or held, one by one

| Case | C-id | Report | Outcome | Why |
|---|---|---|---|---|
| TU-HRS-02 | [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | TU | **RELEASED → READY** | TU v6 S9-R9 + S10-R4 both state the access-gate + toggleable model |
| TU-EXP-04 | [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | TU | **RELEASED → READY** | same |
| TU-LOC-06 | [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | TU | **RELEASED → READY** | same |
| WIP-COL-01 | [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | WIP | **RELEASED → READY** | its expected result (the column order with Location present) is true under **both** readings; only its **precondition** depended on the disputed point — it told the tester *"If it is switched off, turn it back on in the column-selection control"*, which one reading forbids. Sentence removed; **the only precondition changed in this pass.** |
| SBC-COL-01 | [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | SBC | HELD | S4-R12 vs S13-R4 |
| SBC-LOC-04 | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | SBC | HELD | same; its item 5 asserted the toggleable reading and now asserts only the single-location-access half |
| SBR-LOC-05 | [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | SBR | HELD | S21-R7 + S20-R1/R2 vs §2 |
| PV-COL-02 | [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | PV | HELD | S3-R10 vs §4 + change log |
| PV-FILT-14 | [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | PV | HELD | same |
| WIP-COL-02 | [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | WIP | HELD | S4-R3 vs S7-R13 |
| WIP-EXP-02 | [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | WIP | HELD | same |
| WIP-FLT-09 | [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | WIP | HELD | same |
| IV-COL-01 | [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | IV | HELD | S7-R6 vs §2/§4 |
| IV-COL-04 | [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | IV | HELD | same |
| IV-EXP-02 | [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | IV | HELD | same |
| IV-LOC-06 | [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) | IV | HELD | same |

**C30265 (SBR-COL-01) was NOT touched** — it is correct against SBR's own S21-R7 + S20-R1 + S20-R3, and
the earlier pass already recorded that changing it would import Sales By Customer's rules into Sales By
Representative.

---

# 4 · THE THREE CASES HELD FOR THE WRONG REASON

## 4.1 · C30186 (SBC-VIS-02) — **HOLD REMOVED**

**What its line said:** `AUTOMATION: HOLD - waiting on an answer from the product owner`.
**What I established:** its expected result is Sales By Customer v15 **near verbatim**, so there is no open
product question. Both texts, side by side (Rule 45(e)):

| Our case, verbatim | The specification, verbatim |
|---|---|
| "1. Column-header cells and customer summary rows use the white surface (#ffffff)." | **S20-R8**: "Column-header cells and customer summary rows use the white surface (#ffffff), or the dark surface in dark mode." |
| "2. Asset rows and invoice rows use the blue-grey background (#f9fafb)." | **S20-R9**: "Asset rows and invoice rows use the blue-grey background (#f9fafb), or the dark background in dark mode." |
| "3. The totals row uses the white surface with a top border and bold text (white on purpose, matching Technician Efficiency)." | **S20-R10**: "The totals row uses the white surface (#ffffff)… with a top border and bold text." + its own context note: "the totals row **was set to white on purpose**, not the tinted background, **to match Technician Efficiency**, the suite's visual reference." |
| "4. The pinned Subtotal cell on any row uses that row's own background — never a contrasting strip." | **S20-R11**: "The pinned Subtotal cell on any row uses that row's own background — it is never a contrasting strip." |
| "5. The three tree levels show by indentation: customer at the base, asset rows one level in (chevron and vehicle icon sit in from the customer), invoice rows one level deeper." | **S20-R14**: "The three tree levels are shown by indentation: the customer row is at the base; asset rows are indented one level (their chevron and vehicle icon sit in from the customer); invoice rows are indented one level deeper." |

**Engaging with the earlier reasoning rather than overriding it:** the pass that kept this hold worried that
lifting it would *"silently assert that the striping is intended"*. **It is not silent — the specification
asserts it, in five numbered requirements, and even records that the white totals row was deliberate.**
The concern was written against an older version and is now obsolete. **The round-3 sheet does not ask the
question**, and correctly so: it records on its QA-only tab that this is our own defect, not Chris's.
**Changed to:** `AUTOMATION: READY`. **Body unchanged** — there was nothing wrong with it.
*A tool flag never justifies HOLD, so the devtools colour read does not hold it either.*

## 4.2 · C43550 (SBC-COL-04) — **HOLD REMOVED**

**What its line said:** `AUTOMATION: HOLD - waiting on an answer from the product owner`, and its
provenance claimed *"Nothing in the Sales By Customer report specification version 14 covers this."*
**That was false.** **SBC S4-R12, verbatim:** *"a user with access to a single location **is never shown
it and it never appears in their column selector**."* **TU v6 S10-R4** and **WIP v9 S4-R3** say the same,
and on PV, SBR and IV the governing requirement keeps the column out of that list **for everyone** — so
the case's assertion is true under **every** live reading of all six reports. Its provenance now says
exactly that. **Changed to:** `AUTOMATION: READY`.

**On the "never been run" point:** that is **not** a reason to hold. `READY` asserts *automatable*, not
*currently passing*; there is nothing unobtainable here. **It was not observed live this pass** — doing so
means editing a real person's location access on a shared QA org while other workers are live on it — and
its sentence 2 says plainly *"This has not yet been checked against a build."*

## 4.3 · C30502 (WIP-FLT-05) — **HOLD REMOVED. NO TICKET FILED, AND THE EARLIER CLAIM WAS WRONG.**

**What its line said:** `AUTOMATION: HOLD - waiting on an answer from the product owner`, with a note
claiming *"on this build the exact cut-off sits one day later than the specification says (a 367-day span
is accepted, 368 is refused). Record what you see; the one-day difference is already known and **is with
the product owner**."*

**I observed it live on `v3.5-16cf83f` this pass** (`wip-cap-probe.txt`, `GET /api/reporting/reports/
work-in-progress?from=…&to=…`, from 2025-06-01):

| Span from start to end | Live result |
|---|---|
| 364 days inclusive | HTTP 200, 26 rows |
| **366 days inclusive** (2025-06-01 → 2026-06-01) | **HTTP 200, 29 rows — ACCEPTED** |
| **367 days inclusive** (2025-06-01 → 2026-06-02) | **HTTP 400 `Date range cannot be over one year.`** |
| 368, 369, 371, 401 days inclusive | HTTP 400, same message |

**WIP v9 S7-R8, verbatim:** *"A Custom range is capped at a **366-day maximum span (start to end)**."*
**The build matches the requirement exactly** on the natural reading — 366 days is the largest accepted.
**So there is no developer defect, and the previous note was wrong by a day in both halves.** It was also
wrong that it was "with the product owner": nobody had asked him anything about it.

**⇒ NO TICKET WAS FILED, and none should be.** Not a Rule-51 abstention and not a Rule-12 abstention —
**there is nothing to file.** Filing a Story Defect for a conforming build would have been the same class
of error as the one this pass exists to correct. The one genuine residue is that **S7-R8 does not say
whether the first and last days are counted**, so the exact changeover day is not written down anywhere —
a one-line precision question for Chris, recorded in §7, not a defect.

**Changed to:** `AUTOMATION: READY`. Item 3 now states the documented cap precisely (*"up to 366 days,
counting the start date and the end date themselves… 367 days or more is refused with the message 'Date
range cannot be over one year.'"*) and the note tells the tester to record the last range that loads and
the first that is refused. **Its sentence 2 is the only one in the suite that reads `Last checked against
build v3.5-16cf83f on 8/5/2026`** — because it is the only case observed live this pass.

## 4.4 · One more repair found on the way — C30160 (SBC-EXP-02)

The **last** `confirmed in the build` hedge in the suite. Its item 3 deferred the custom-range file-name
word to the build; **S14-R14 gives the whole map including `Custom → custom`**, so the case now states it.
**And the document has a residue, reported not invented:** S14-R14 still maps *"Today → today; Yesterday →
yesterday"* although v14's own S2-R2 **removed both presets**, and it gives **no word at all for the new
"Last 12 Months" preset** — so item 2 now names the eight periods the map does cover and tells the tester
to record what they see for Last 12 Months rather than judging it.

---

# 5 · WHAT I DID **NOT** CHANGE, AND WHY

- **The 5 foreign cases C38919–C38923** (Vladimir Tomovic) — never read for classification, never written.
  **Proven byte-identical on every field including `updated_on` and `updated_by`** (Rule 38).
- **SV-8879, SV-8880, SV-8881** — our three Bugs from earlier today. Untouched, per the coordinator: the
  conversion needs the Jira UI wizard and silently wipes Product Area.
- **Four more cases that look wrongly held, REPORTED not changed** — outside the three I was authorised to
  resolve, so they are a finding, not an edit: **C30096 (SBC-NAV-01)**, whose own body says *"the product
  owner has ruled… and the written description now says the same"* and whose spec anchor **S1-R2** states
  it outright, yet its marker still reads `HOLD - waiting on an answer from the product owner`; and
  **C30310, C30315, C43551** on the same marker. **C30096 in particular looks like it should be
  `READY - EXPECT FAIL (SV-8780)`.** Each needs one authorised look; releasing them would move the gate
  again and I did not want that decided by me.
- **The new link-permission coverage** implied by SBC v15 / SBR v17 / WIP v9 — **not authored** (§2.1).
- **`refs` on any case** — nothing in this pass changed a case's traceability, so `refs` was not in a
  single payload. The declared comma normalisation was therefore never exercised.
- **`delete_case` — called zero times.** Nothing earned it.

---

# 6 · MARKERS AND THE ARITHMETIC GATE

| Marker | Count |
|---|---|
| `AUTOMATION: READY` | **430** |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | **17** |
| `AUTOMATION: HOLD - <reason>` | **26** |
| **Total** | **473** — exactly one marker per case, read back from live |

**GATE: 430 + 17 = 447 ready to automate** (was **440**). The **+7** are exactly the seven cases released
above: C30401, C30437, C38915, C30466, C30186, C30502, C43550. **The gate reconciles: 473 − 26 held = 447.**
Every marker is the **last thing** in Expected Results, after the provenance line, with a blank line
before it and a line break after.

The 26 holds break down as: **12** the Location contradiction · **8** parts of a report not built yet ·
**4** still genuinely (or arguably — see §5) waiting on Chris · **1** the two TU spreadsheet downloads that
do not exist · **1** needing one live check of a logo that fails to load. **Not-built cases are excluded
from the ready figure by definition** — absent product is not a readiness shortfall.

**The denominator moved and the gate does not pretend otherwise:** the link-permission requirements that
arrived at 17:53–17:54Z have **no cases at all**, so they are counted nowhere in the 447 and are stated as
uncovered in §2.1.

---

# 7 · OUTSTANDING — what I need

1. **Chris Ward: one sentence on the Location column** — is it in the column selector or automatic? It
   blocks **12 cases** and it is now a *tidy-up*, not a decision: he has decided, and **five of six
   specifications still carry the older paragraph** (SBC S13-R4 · SBR S21-R7 + S20-R1/R2 · **PV S3-R10** ·
   WIP S7-R13 · IV S7-R6 + S3-R1). Asked in
   `rulings-2026-08-05/Questions-for-Chris-Ward_Report-Suite_Round-3_2026-08-05.xlsx`, **unanswered**.
   **Add Parts Velocity to that ask explicitly** — the sheet describes PV as untouched, and it is not.
2. **Chris Ward: does the 366-day WIP limit count the first and last days?** One line settles C30502's
   changeover day. Not currently on any sheet.
3. **Chris Ward: the three spec residues** — SBC S14-R14 still maps the deleted Today/Yesterday presets and
   gives no word for Last 12 Months; WIP's S7-R13 vs S4-R3 self-contradiction; the access-vs-scope gate,
   which still differs between reports.
4. **The QA lead: four possibly-wrongly-held cases** (§5) — C30096, C30310, C30315, C43551. One look each.
5. **The QA lead: authorise the link-permission coverage** — new requirements, zero cases (§2.1).
6. **The branch declared final.** `sv8582` is still not final, so **every verdict in this suite is
   PROVISIONAL** and the Rule-49 queue `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN**.
7. **A live check for C43550** (a single-location-access sign-in) and for the logo-fails-to-load case
   C43553 — both currently say honestly that they have not been checked on a build.

*Register note: I do not own `build/OUTSTANDING-ITEMS-REGISTER.md` this pass — another worker is live in
it — so items 1–7 are reported here for the coordinator to fold in.*

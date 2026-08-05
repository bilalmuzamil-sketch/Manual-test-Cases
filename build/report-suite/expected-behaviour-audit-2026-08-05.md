# Report Suite — EXPECTED-BEHAVIOUR AUDIT
## Does each case's expected result state a DOCUMENTED requirement, or describe OBSERVED BUILD BEHAVIOUR?

**Date:** 2026-08-05 · **Project:** Report Suite ONLY · **Population:** all **473** of our cases under
TestRail group 4281 (live total 478; the 5 foreign cases C38919–C38923 are excluded from the population
and were not read for classification, per Rule 38) · **No sampling** (Rule 50).

**Why this audit exists — the QA lead's correction, verbatim:**

> "The expected behaviors are NOT the ones 'how the build is behaving'. Expected behaviors are the ones
> which are either in PRD-COnfluence/Epic STories/Verified in the Anser sheets by the PO. From the Build
> we are JUST doing the VIU and the processes attached to that VIU process. I am shocked to see that how
> come you considered the Build behavior as the expected behavior?"

**The rule applied:** expected behaviour comes ONLY from (a) the Confluence PRD, (b) the epic's stories,
(c) the PO's verified answers. From the build we take ONLY the exact on-screen labels (Rule 9) and the
PASS/FAIL verdict (Rules 10/12/13). A closed ticket is a decision about whether to FIX; it is never a
specification change.

**Sources read LIVE for this audit** (versions in `final-viu-2026-08-05/SOURCE-CURRENCY.md`):
SBC **v14** · SBR **v15** · PV **v5** · TU **v5** · WIP **v6** · IV **v3** — 749 numbered requirements
extracted. Epic SV-8582 = 105 children, verified two ways.

---

# 1 · HEADLINE RESULT

| Class | What it means | Count |
|---|---|---|
| **A — BUILD-DERIVED EXPECTATION** | describes the build where a documented requirement says otherwise | **16** |
| **A\* — SPEC NOW STATES IT BOTH WAYS** | a sub-class of A: the governing spec contradicts *itself*, so there is no single documented answer to restore to | **2** |
| **B — BUILD-DERIVED, SOURCE SILENT** | defers a detail to the build; no source speaks | **8** |
| **C — LEGITIMATE** | the assertion is documented; the build supplied only a label, or an honest "the build differs, here is the ticket" note | **440** |
| **D — UNSOURCED ASSERTION, REPAIR BY REMOVAL** | we over-specified beyond every source; fix by deleting or scope-conditioning the claim, never by substituting what the build does | **7** |
| | **TOTAL** | **473** |

**The honest summary in one paragraph.** The contamination is **real, specific and narrow**, and it is
**not** where I first suspected. The provenance layer is sound — **472 of 473** cases cite a
specification, an epic or a PO answer, and only one cites the build plus the tech plan (and says so
openly). The dominant pattern in the suite is the *correct* one: state the documented expectation, then
add a plain note that the build does not do it yet and name the ticket. **440 cases do exactly that.**
But **one boilerplate paragraph about the Location column was pasted into 14 cases across all six
reports, and in 13 of them it asserts the exact opposite of that report's own specification** — and it
displaced wording that had been *right*. That is the systemic error, and it is fully repairable.

**Three of my own initial suspicions were WRONG and the spec proved them wrong** — recorded here because
Rule 45(e) exists precisely so that "this one is fine" has to be demonstrated, not asserted: C30356
(per-browser persistence), C30336 ("by design" empty result) and C30384 (the toast casing mix) all
turned out to be quoted almost verbatim from their specs.

---

# 2 · CLASS A — BUILD-DERIVED EXPECTATION (16)

## 2.1 · THE LOCATION COLUMN-SELECTOR BOILERPLATE — 13 cases, 5 reports

**The offending text, pasted identically into all 13** (quoted verbatim from the live TestRail cases):

> "Location is one of the columns in the column-selection control, and with more than one location
> SELECTED it is already switched on for you - you do not have to turn it on. **You can still switch it
> off.** If the signed-in person only has access to ONE location, Location is not offered in the
> column-selection list at all."

**What each report's own live specification says — verbatim, side by side:**

| Report | Governing requirement, QUOTED VERBATIM from the live spec | Verdict |
|---|---|---|
| **Parts Velocity v5** | **S3-R10**: "The column is auto-managed by the location scope (it is not one of the 20 columns in the picker, S4-R1, and **is not user-toggleable**) and is hidden entirely when a single location is in scope." | **CONTRADICTED** |
| **Technician Utilization v5** | **S10-R4**: "The per-row Location column is **not one of the toggleable columns**: it is auto-managed by the location scope (shown only when more than one location is in scope — S9-R9) and is **never listed in the column selector**." | **CONTRADICTED** |
| **Work In Progress v6** | **S4-R3**: "The Location column is **not offered in the column selector**; its visibility is automatic — shown only when more than one location is in scope (Story 7)." · **S7-R13**: "…the user does **not** toggle it in the column selector." | **CONTRADICTED** |
| **Inventory Value v3** | **S7-R6**: "Its visibility follows the location scope automatically and **it is not one of the columns offered in the column-selection control** (Story 8)." | **CONTRADICTED** |
| **Sales By Representative v15** | **S21-R7**: "A per-row Location column is shown on the report **only when the current view spans more than one location**… When the view is scoped to a single location the column is hidden." · **S20-R1**: the dropdown holds "the **seven** toggleable metric columns" · **S20-R3**: the five always-visible columns "do not appear in the dropdown" | **CONTRADICTED** — the dropdown is a closed list of seven metric columns; Location is not among them |

**So five of the six specifications state, explicitly and unambiguously, that the Location column is
never in the column selector and is not user-toggleable.** The boilerplate asserts the opposite.

**The 13 cases:**

| Report | Internal ID | C-id | Link |
|---|---|---|---|
| PV | PV-COL-02 | C30352 | https://shopview.testrail.io/index.php?/cases/view/30352 |
| PV | PV-FILT-14 | C38914 | https://shopview.testrail.io/index.php?/cases/view/38914 |
| TU | TU-HRS-02 | C30401 | https://shopview.testrail.io/index.php?/cases/view/30401 |
| TU | TU-EXP-04 | C30437 | https://shopview.testrail.io/index.php?/cases/view/30437 |
| TU | TU-LOC-06 | C38915 | https://shopview.testrail.io/index.php?/cases/view/38915 |
| WIP | WIP-COL-02 | C30467 | https://shopview.testrail.io/index.php?/cases/view/30467 |
| WIP | WIP-EXP-02 | C30511 | https://shopview.testrail.io/index.php?/cases/view/30511 |
| WIP | WIP-FLT-09 | C38916 | https://shopview.testrail.io/index.php?/cases/view/38916 |
| IV | IV-COL-01 | C30551 | https://shopview.testrail.io/index.php?/cases/view/30551 |
| IV | IV-COL-04 | C30554 | https://shopview.testrail.io/index.php?/cases/view/30554 |
| IV | IV-EXP-02 | C30588 | https://shopview.testrail.io/index.php?/cases/view/30588 |
| IV | IV-LOC-06 | C38917 | https://shopview.testrail.io/index.php?/cases/view/38917 |
| SBR | SBR-LOC-05 | C38913 | https://shopview.testrail.io/index.php?/cases/view/38913 |

### The Rule-32 question answered honestly: doesn't the PO's newer answer beat the older spec?

It would — **if his answer were unambiguous, and if the specs had not moved since.** Neither holds:

1. **His answer is self-contradictory on this exact point.** It is why 11 cases are already held and why
   `rulings-2026-08-05/Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx` was sent. Rule 32(iii) is
   explicit: where the newest source is ambiguous, **ASK the PO — do not pick a side.** Building the
   ambiguous reading into 13 cases as a requirement picked a side.
2. **For Parts Velocity the spec is now NEWER than his answer.** PV **v5** was saved
   **2026-08-05T13:21:40Z**, with the version message *"Applied QA review workbook decisions
   (2026-08-04)"* — i.e. he republished it **after** giving the answer — **and S3-R10 still says "not
   user-toggleable."** For Parts Velocity, latest-wins now points **at the specification**.
3. **The displaced wording was correct.** `THE-46-EXECUTED.md` §4.1 records that C30352's line 3 said the
   Location column *"is not in the column picker"* and calls it *"wrong under both readings"*. **It was
   not wrong. It is PV S3-R10 almost word for word.** A correct case was overwritten.

**REPAIR:** remove the boilerplate; restore each report's documented rule (automatic, scope-driven, not
in the column selector); keep an honest note that a newer PO answer is ambiguous on the point and the
question is open; marker **HOLD** until he answers. **No build behaviour is asserted either way.**

## 2.2 · C30466 (WIP-COL-01) — the precondition instructs an impossible action

**Case:** WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466).
**Offending text (precondition 4), verbatim:**

> "More than one location is selected, so the Location column is showing. **If it is switched off, turn
> it back on in the column-selection control.**"

**Governing requirement (WIP v6 S4-R3), verbatim:** "The Location column is **not offered in the column
selector**; its visibility is automatic."

The tester is told to do something the specification says cannot be done. **REPAIR:** drop the second
sentence. (Its expected result — the column order — is spec-correct and is not touched.)

## 2.3 · C30538 (IV-PAGE-01) — the build's behaviour stated as what the tester *should* see

**Case:** IV-PAGE-01 = [C30538](https://shopview.testrail.io/index.php?/cases/view/30538).
**Offending text, verbatim:**

> "Note for the tester: on this build there are no numbered page controls on the screen - the rows load
> as you scroll. **That is what you should see**; record…"

**Governing requirement (IV v3 S1-R8), verbatim:** "The report is server-paginated: the server returns
one page of rows at a time, and **the user moves through pages with the reports suite's standard
pagination control.**"

"That is what you should see" makes the build the expectation. **REPAIR:** the expectation stays
S1-R8's pagination control; the note becomes "on the build tested there were no numbered page controls —
record what you see; this is a difference from the specification", and it needs a ticket (see §6).

## 2.4 · C30352 also carries a Rule-56 divergence sentence that misrepresents the sources

**Verbatim, from the live case:** "…his decision differs from what this case said before, **which stated
the Location column is not in the column picker**, and we have taken his later decision as the one that
prevails."

This frames **the spec-correct position** as the outdated one. It is a divergence sentence pointing the
wrong way. **REPAIR:** removed with the boilerplate.

---

# 3 · CLASS A\* — THE SPECIFICATION NOW STATES IT BOTH WAYS (2)

Sales By Customer **v14**, saved **2026-08-05T13:07:07Z**, changed **S4-R12** but did **not** update
Story 13. The two live requirements cannot both be true:

> **S4-R12 (new in v14):** "The Location column applies only to a user who has access to more than one
> location… For a user with access to more than one location, the column is shown by default and **can be
> toggled on or off from the column selector**, regardless of how many locations are currently selected."

> **S13-R4 (unchanged):** "**The nine toggleable columns are, in order:** Date, Inv. Hrs, Labor Invoiced,
> Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %." — a closed list of nine,
> **without** Location.
> **S13-R6 (unchanged):** "The Customer and Subtotal columns, and the chevron control column, are always
> present and do not appear in the toggle list." — Location is not named as an exception either.

| Case | Internal ID | C-id | What it asserts | Position |
|---|---|---|---|---|
| SBC column selector | SBC-COL-01 | [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | "there is no Location toggle in this panel. **That is correct** - the Location column appears by itself when you have more than one location in scope" — matches **S13-R4** but contradicts **S4-R12** | agrees with one live requirement, contradicts the other |
| SBC Location column | SBC-LOC-04 | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | carries the toggleable boilerplate — matches **S4-R12** but contradicts **S13-R4** | the mirror image |

**These two cases currently contradict each other**, and each has a live requirement on its side. **This
is a specification defect, not a test defect** (Rule 15: never pick a side silently). **REPAIR:** state
S4-R12 as the governing rule for SBC (it is the newest edit and the more specific requirement), state
plainly that Story 13's nine-column list has not been updated to match, mark both **HOLD**, and add the
question to Chris's follow-up sheet.

---

# 4 · CLASS B — BUILD-DERIVED, SOURCE SILENT (8)

These defer a detail to the build — "whatever the build does is right" — which is the error in its
mildest form. Each is repaired by asserting only what a source supports, and by asking where nothing does.

| Case | C-id | The deferral, verbatim | Does a source speak? |
|---|---|---|---|
| SBC-LBL-01 | [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | "what stands in when all three are missing **is confirmed in the build** (the older rule showed 'Unknown Asset')" | **PARTLY** — the SBC v14 change note reads 'VIN → Unit # → plate → "Unknown Asset"', so "Unknown Asset" IS documented; the deferral is unnecessary. Repair by citing it. |
| SBC-EXP-02 | [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) | "Record the exact word the file uses for each - the mapping **is confirmed in the build**" | **YES** — S14-R14 gives the full label→token map. Repair by citing S14-R14. **⚠️ and S14-R14 still maps "Today → today; Yesterday → yesterday" although v14's S2-R2 has just deleted both presets** — a spec residue defect (§7). |
| SBC-EXP-09 | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | "(exact placement within the header **is confirmed in the build**)" | **YES** — S15-R10 specifies the header block's contents in order. Repair by citing S15-R10. |
| SBR-EXP-02 | [C30277](https://shopview.testrail.io/index.php?/cases/view/30277) | "(exact position in the file **is confirmed in the build**)" | **YES** — S14-R20: "In a PDF the 'Locations:' line appears in the header strip; in a CSV it appears as a leading metadata line above the column-header row." Repair by citing S14-R20. |
| PV-EXP-02 | [C30376](https://shopview.testrail.io/index.php?/cases/view/30376) | "(exact position in the file **is confirmed in the build**)" | **SILENT** — PV has no equivalent of SBR S14-R20. **Needs Chris.** |
| TU-COL-01 | [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | "it still carries a name that assistive technology reads out… (The exact wording **is confirmed in the build**.)" | **PARTLY** — TU S10-R1 gives the tooltip "Column Selection"; the accessible name is not specified. Scope-condition it. |
| SBC-EXP-04 group / PV | [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | "A month calendar is shown inside it, which is how a custom start and end date are picked **on this build**" | **YES, NOW** — SBC v14 S2-R4 specifies exactly this. Repair by citing S2-R4 instead of the build. |
| TU-EXP-04 | [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | "(exact position in the file **is confirmed in the build**)" | **SILENT** for TU. **Needs Chris.** (also a Class-A case, §2.1) |

**Nine further cases carry the same "confirmed in the build" hedge about the Location label** —
C30111, C30215, C30337, C30443, C30503, C30574, C30575 (plus C38912, C30511 already listed). Their hedge
attaches to an assertion that is itself unsourced, so they are handled as **Class D** below.

---

# 5 · CLASS D — UNSOURCED ASSERTION, REPAIR BY REMOVAL (7)

Rule 25's own worked example: where our case asserted something no source supports, the fix is to
**remove** the claim, not to replace it with what the build does.

**The claim, verbatim, in all seven:**

> "The page itself shows which location(s) the report is currently scoped to (**the new on-screen scope
> indicator** - exactly where and how it appears is confirmed in the build)."

**Searched all six live specifications for any documented on-screen scope indicator:**

| SBC v14 | SBR v15 | PV v5 | TU v5 | WIP v6 | IV v3 |
|---|---|---|---|---|---|
| **0 matches** | **0 matches** | **0 matches** | **0 matches** | **0 matches** | **0 matches** |

**No specification describes an on-screen scope indicator at all.** We invented it, then deferred its
appearance to the build — an unsourced assertion wrapped in a build deferral.

| Internal ID | C-id | Link |
|---|---|---|
| SBC-LOC-03 | C30111 | https://shopview.testrail.io/index.php?/cases/view/30111 |
| SBR-LOC-03 | C30215 | https://shopview.testrail.io/index.php?/cases/view/30215 |
| PV-FILT-10 | C30337 | https://shopview.testrail.io/index.php?/cases/view/30337 |
| TU-LOC-02 | C30443 | https://shopview.testrail.io/index.php?/cases/view/30443 |
| WIP-FLT-06 | C30503 | https://shopview.testrail.io/index.php?/cases/view/30503 |
| IV-LOC-01 | C30574 | https://shopview.testrail.io/index.php?/cases/view/30574 |
| IV-LOC-02 | C30575 | https://shopview.testrail.io/index.php?/cases/view/30575 |

**REPAIR:** delete the sentence. What each spec *does* support — that the Location **filter** shows the
current selection (SBC S20-R19, SBR S18-R13, PV S2-R9, TU S9-R9, WIP S7-R9, IV S7-R1) — is already
asserted elsewhere in the same cases, so nothing is lost.

**Three further wording repairs of the same kind** (the assertion is documented, only the *justification*
was build-flavoured — so these are wording fixes, not expectation changes, and are counted in Class C):

| Case | C-id | Build-flavoured justification | The documented basis it should cite |
|---|---|---|---|
| WIP-COL-05 | C30470 | "the product owner has confirmed this two-line layout is correct for this report **and is already built**" | **WIP S4-R7**: "The Asset column is a two-line cell: the unit number on the first line in bold, and the vehicle identification number on the second line in a smaller, muted style." |
| PV-CALC-04 | C30362 | "produces no row at all - **accepted behavior**" | PV S5-R1 / S5-R2 define the row sets; S5-R3 makes returns a metric, not a row axis |
| PV-API-04 | C30391 | "**for now it is hidden from the screen and enforces nothing**" | **PV v5 S1-R4**: "…require the single reports permission… there is no per-report permission." |

---

# 6 · CLASS C — LEGITIMATE (440) — and the proof for the ones I suspected

**Rule 45(e) compliance: no "this one is fine" verdict without both texts quoted.** The three I was most
suspicious of, each cleared by its own spec:

| Case | Our case says, VERBATIM | The spec says, VERBATIM | Verdict |
|---|---|---|---|
| PV-COL-06 [C30356](https://shopview.testrail.io/index.php?/cases/view/30356) | "This is **by design**: storage is per browser, not tied to the account - there is no per-account separation." | **PV S4-R6**: "The report saves, **in this browser (not tied to the user account)**… Because storage is per-browser, **a different user signing in on the same browser inherits the saved view (there is no per-account separation)**." | **C — near-verbatim from the spec** |
| PV-FILT-09 [C30336](https://shopview.testrail.io/index.php?/cases/view/30336) | "Type = Special Order combined with any Bin filter yields an empty result showing the empty state - this is **by design**, not a defect." | **PV S2-R8**: "…all special-order rows are excluded whenever any bin filter is active — so Type = Special Order combined with any Bin filter yields an empty result, **by design**." | **C — the words "by design" are the spec's own** |
| PV-EXP-10 [C30384](https://shopview.testrail.io/index.php?/cases/view/30384) | "the success/failure casing mix is the shipped wording, documented as-is (not a bug)" | **S6-R9**: success reads "Velocity report exported **(CSV)**"… **S6-N1**: failure "reads 'Failed to export velocity report **(csv)**'" | **C — the casing mix is specified.** Only the phrase "shipped wording" needs rewording to "specified wording". |

**Two more cleared, because the brief expected them to be wrong:**

| Case | Our case says | The spec says | Verdict |
|---|---|---|---|
| SBR-COL-01 [C30265](https://shopview.testrail.io/index.php?/cases/view/30265) | "you will also see a Location column on the table that is in neither list. **That is correct** - it appears by itself and is not something you can switch on or off here." | **SBR S21-R7** (auto by scope) + **S20-R1** ("the seven toggleable metric columns") + **S20-R3** (the five always-on "do not appear in the dropdown") | **C — CORRECT AS WRITTEN.** My brief asked me to "fix" this case. **It must NOT be changed.** It follows Sales By Representative's own specification exactly; changing it to the Sales-By-Customer access model would import another report's spec into it. |
| WIP-EXP-06 [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | 'These exact names (including the "-2-") are the specified current behavior.' | **WIP S9-R9**: 'The downloaded files are named **"wip-2-report.pdf"** and **"wip-2-report.csv"**.' | **C — documented verbatim** |

**The 20 "Known issue" cases are the model pattern, not a problem.** Each states the documented
expectation and then adds: *"Known issue: the product does not currently do this. It has been filed for a
fix here: <ticket>"* — C30162, C30172, C30194, C30287, C30290, C30320, C30440, C30491, C30562, C30564,
C30565, C30566, C30588, C30589, C30593, C30595, C38885, C38887, C43547, C43548. **This is exactly what the
QA lead's correction asks for** and it should be the template for the repairs.

**The 4 logo cases are now spec-ratified.** C30168, C30281, C30379, C30439 expect *no logo when none is
uploaded*, sourced to Chris's answer. **SBC v14 S15-R17** now says it outright: "(2) the bundled ShopView
logo **only when an uploaded logo is set but fails to load**; (3) **no logo when none is uploaded**", with
**S15-R18** for the full-width text column. Their provenance can be **upgraded from a PO answer to the
specification** — a strictly stronger source.

**The 4 WIP identifier cases are spec-backed** — the group the coordinator flagged as suspect. Re-derived
from the spec alone: **WIP S4-R7** (unit number first, in bold; VIN underneath) and **S4-R8** (the
"(no unit #)" / "— no VIN —" placeholders). The conclusion recorded earlier was right; **the recorded
justification ("spec and build agree") was contaminated reasoning that happened to land on the correct
answer.** Restated here on the spec's authority alone. `plate` appears **0 times** in the live WIP spec,
so the earlier removal of an invented "then plate" fallback was also correct.

---

# 7 · WHAT ONLY CHRIS WARD CAN FIX — the SILENT and SELF-CONTRADICTORY sources

These cannot be repaired by us at any level of diligence.

| # | The question | Why we cannot answer it | Cases blocked |
|---|---|---|---|
| 1 | **Is the Location column in the column selector, or automatic?** | His 2026-08-05 answer says **both yes and no about the same user**; five specs say automatic/never-in-selector; SBC v14 S4-R12 alone says toggleable. | the 13 of §2.1 + C30156 + C38912 = **15** |
| 2 | **SBC contradicts itself:** S4-R12 says Location is toggleable in the column selector; S13-R4 closes the toggle list at nine columns without it, and S13-R6 does not list it as an exception. | Two live requirements in the same document, same version. | C30156, C38912 |
| 3 | **The Location model differs between specs.** SBC v14 = **access** gate ("a user who has access to more than one location… regardless of how many locations are currently selected"). PV v5 S2-R12, SBR S21-R7, TU S9-R9, WIP S7-R13, IV S7-R6 = **in-scope** gate. Both were republished today under the same version message. | Same behaviour, two specifications. | every location case, all six reports |
| 4 | **Where does the "Locations:" line sit in a Parts Velocity / Technician Utilization export?** | SBR S14-R20 specifies it; PV and TU are silent. | C30376, C30437 |
| 5 | **Is there an on-screen scope indicator at all?** | **Zero mentions in all six specs.** We invented it. | the 7 of §5 |
| 6 | **SBC S14-R14 still maps "Today → today; Yesterday → yesterday"** although v14's S2-R2 has just removed both presets. | Spec residue from today's edit. | C30160 |
| 7 | **Is the accessible name of the column-selection button specified?** | TU S10-R1 gives a tooltip, not an accessible name. | C38859 |

All seven go onto `build/report-suite/rulings-2026-08-05/` as follow-up questions, in plain layman words,
each naming **the project and the report** on its own row (Rule 55).

---

# 8 · HOW THIS HAPPENED — so it does not happen again

1. **A PO answer was treated as a suite-wide ruling and pasted across six reports** whose specifications
   differ. Rule 40's surface discipline has a sibling this suite lacked: **one report's answer is not
   another report's requirement.**
2. **The answer was ambiguous and was resolved by looking at the build.** Rule 32(iii) says ask; the pass
   picked the reading the build supported. That is the precise mechanism the QA lead identified.
3. **Rule 41 fired and was overridden.** The pass *did* re-read C30352 whole — and used the re-read to
   **overwrite a spec-correct line**, recording it as "wrong under both readings". A whole-case re-read
   is worthless if it is judged against the build instead of the spec.
4. **No check existed for "is this expected result traceable to a documented requirement?"** The
   provenance line (Rule 54) records *which* source; nothing verified that the source actually **says**
   what the case asserts. **This audit is that check, and it should run in every pass.**

---

# 9 · SCOPE AND HONESTY

- **All 473 cases were classified.** Detection was by exhaustive pattern sweep over the live text of
  every case (two waves, 22 + 20 patterns), plus a provenance-layer audit of all 473, plus a full
  requirement extraction from all six live specs. **No sampling.**
- **Every Class A / A\* / B / D case is named** with internal ID, C-id and link, with both texts quoted.
- **Class C is a residual class**, reached by exhaustive elimination: every case not landing in A/A\*/B/D
  after both sweeps. **I have quoted both texts for the 7 cases most at risk within it, not for all 440**
  — and I state that plainly rather than implying a 440-case cold read.
- **No TestRail write had been made when this audit was committed.** The evidence exists independently of
  the repair, as instructed.

---

# 10 · "STEPS CORRECTLY VIU'd BUT EXPECTATION ALTERED IN THE SAME PASS"

**Added on the QA lead's clarification (2026-08-05), verbatim:**

> "For the rule: 'the case should be matched to the build' That doesnt mean the expected behavior should
> match the build. That kills the purpose of the test case. I think when we said 'the case should be
> matched to the build' it meant that the test case should be VIU'd from the build"

**The reasoning, which is the part that matters:** if the expected behaviour bends to whatever shipped,
**the case can no longer fail — and a test that cannot fail is not a test.** A build-derived expected
result is not a wording problem; it is a case that has been **silently disarmed**. Worse, it *looks*
freshly maintained and its provenance line looks current, so nothing draws the eye to it.

## 10.1 · Method

Report Suite has had the most passes of the three projects, so it has had the most opportunities for this.
I reconstructed the local case source at **every one of the 41 commits** that touched
`build/report-suite/cases/`, and for each commit compared, per case, the **steps** and the **expected
result with the Rule-54 provenance line stripped off** (so that a provenance re-stamp cannot masquerade as
an expectation change — without that filter the count is 478 and meaningless). I then isolated the passes
that were **build/VIU passes** rather than authoring or answer-ingest passes.

## 10.2 · Result — the pure VIU passes are CLEAN

| Pass | Commit | Cases where steps AND the expectation body both changed | Cases where the expectation body changed at all |
|---|---|---|---|
| **Final push 2026-08-04 (all 478, byte-verified)** | `37c685cb` | **0** | **0** |
| **Phase 5 — 414 `update_case`** | `457851e5` | **0** | **0** |
| **Build re-check 2026-08-04** | `0ac4cf21` | **0** | **2** |
| Answer-ingest: "the 46 executed" 2026-08-05 | `48487bcf` | **0** | **50** |
| Non-VIU close-out: groups C+D | `644c7a0f` | **0** | **3** |
| Single fix: C30590 | `e6aa9f60` | **0** | **1** |

**In no pass, anywhere in this project's history, did a case's steps and its expectation body change
together.** The specific failure mode the QA lead asked me to hunt — steps VIU'd while the expectation was
quietly moved in the same edit — **did not occur in Report Suite.** I am stating that as a clean negative,
with the method above so it can be re-run and contradicted.

## 10.3 · The 2 expectation changes a build re-check DID make — and they were correct

Both were on Parts Velocity, in the 2026-08-04 build re-check, and both **removed a line rather than
rewriting an expectation**:

| Case | What was removed |
|---|---|
| PV-CALC-09 | "Known issue: the product does not currently do this. It has been filed for a fix here: …/SV-8819" |
| PV-CALC-16 | the same line |

**SV-8819 had been fixed** (`Done`, 2026-08-04T08:32, confirmed live again this pass). The documented
expectation was untouched; only the now-false "the product does not do this" note went. **That is correct
maintenance, and it is the model:** when a fix lands, the note goes and the expectation stays exactly where
it was.

## 10.4 · Where the contamination actually entered — and it was not a VIU pass

**It was the answer-ingest pass of 2026-08-05** (`48487bcf`, "the 46 executed"), which moved the
expectation body on **50** cases. Most of those 50 were legitimately driven by Chris Ward's answers — a
proper source. But **14 of them carry the Location column-selector boilerplate of §2.1**, and that
paragraph exists because **an ambiguous PO answer was resolved by looking at the build.** The mechanism, in
one sentence: *the answer did not settle the question, the build did, and the build's reading was written
into the cases as a requirement.*

**This is the honest shape of the problem, and it is more useful than "a VIU pass rewrote expectations":**
the VIU discipline held. What failed was the step **after** the VIU, where an ambiguous answer met an
observed build and the observation won.

## 10.5 · Three permission cases where the edit outran its source — and the spec has since caught up

The non-VIU close-out (`644c7a0f`) rewrote **IV-PERM-01 ([C30603](https://shopview.testrail.io/index.php?/cases/view/30603))**,
**PV-PERM-01 ([C30325](https://shopview.testrail.io/index.php?/cases/view/30325))** and
**WIP-PERM-01 ([C30526](https://shopview.testrail.io/index.php?/cases/view/30526))** from a named
per-report permission to "the ordinary reports access", adding the hedge *"for now"*.

- **At the time, that contradicted the then-current spec.** PV **v4** S1-R4 read: "Both loading the report
  and exporting it require the **Inventory Reports → View permission**." The original case text matched the
  spec; the edit moved it away from the spec.
- **The spec has since caught up — today.** PV **v5** S1-R4, saved 2026-08-05T13:21:40Z, now reads:
  "…require the **single reports permission — the one permission that grants access to all reports; there
  is no per-report permission.**"

So the edit's *outcome* is now the documented requirement, while the *reasoning at the time* was not
source-backed. **Repair: keep the assertion, drop the "for now" hedge, and re-point the provenance at
PV v5 S1-R4** — the assertion stops being a hedge about the build and becomes a citation.
**And note the live consequence:** story defect **SV-8780** ("SBC report gated by its own permission",
`Ready to Fix`) is the build failing this now-documented requirement, so the SBC permission cases are
**READY - EXPECT FAIL (SV-8780)**, not passes.

## 10.6 · Category D, restated under the clarification

The clarification closes the last ambiguity, and my classification already follows it: **where our case
asserted something no source supports, the repair is to REMOVE the assertion or make it scope-conditional
(Rule 42) — never to substitute what the build does.** The seven Class-D cases in §5 (the invented
"on-screen scope indicator", which appears **0 times in all six specs**) are repaired by **deletion**. No
observed behaviour is written in its place.

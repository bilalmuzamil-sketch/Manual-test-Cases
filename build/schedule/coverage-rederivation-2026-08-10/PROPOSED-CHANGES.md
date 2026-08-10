# Schedule — PROPOSED CHANGES: staged, unexecuted — 2026-08-10

**NOTHING IN THIS FILE HAS BEEN EXECUTED.** No `update_case`, no `add_case`, no `delete_case`, no
run write, no result, no Jira write, no Jira ticket. The authorisation for this pass was to **build
the map** (*"Authorise the Schedule requirement-to-case rebuild — Do what is logically correct"*),
not to rewrite the suite. Every item below needs a separate go-ahead (Rules 6 and 62).

**Run 357 belongs to Ayesha Khan** and was read once, read-only: `include_all` false, 168 tests,
429 result records, 168 untested.

| Id | What | Ops | Risk if we do nothing |
|---|---|---|---|
| **P1** | one case reworded to the v26 requirement | 1 `update_case` | a tester passes a build that shows the wrong tooltip |
| **P2** | the specification version re-stamped on all 168 provenance lines | 168 `update_case` | every case points a reader at a body four versions old, that predates §5.3 |
| **P3** | five provenance lines corrected to name the source they actually rest on | 5 `update_case` | a reader following the citation will not find the requirement and will conclude we invented it |
| **P4** | two new cases for §5.3 | 2 `add_case` + 1 run sync | the panel toggle ships untested |
| **P5** | one case's dark-theme persistence half asserted | 1 `update_case` | the case claims in `refs` what its steps do not check |

---

## P1 · SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) — the capacity tooltip lists **assigned** technicians

**Driving requirement, verbatim, Confluence v27 §4.12:**

> *"Hover tooltip: a **per-assigned technician** breakdown (assigned vs that tech's capacity), with
> overtime technicians highlighted in amber."*

**Dated:** `per-assigned technician` first appears in **v26** (2026-08-07T11:02:57Z). The wording it
replaced — `a per-technician breakdown` — was present in **v1** and every version through v25.
**v26 carries no version comment**, so nothing announced it.

**Current title:** *"Hovering a capacity bar shows a per-technician breakdown"*
**Current expected 1:** *"A tooltip shows a per-technician breakdown: assigned hours vs that
technician's capacity."*

**Proposed title:** *"Hovering a capacity bar shows a breakdown of the technicians assigned that day"*
**Proposed expected 1:** *"A tooltip lists the technicians who have work assigned that day, one row
each, showing that technician's assigned hours against their own capacity. Technicians with nothing
assigned that day are not listed."*
**Proposed precondition addition:** *"At least one technician in a visible department has NOTHING
assigned on that day, so you can tell a per-assigned list from a list of everybody."*

**Everything else stays**, including expected 2 (amber highlight) and expected 3 (numbers agree with
the grid), which already match the requirement.

**⚠️ HOLD THIS ONE UNTIL BRANKO ANSWERS.** The change is a one-word, unannounced edit to a sentence
that stood for 26 versions. It reads as deliberate, but under Rule 58 an ambiguity is not settled by
guessing and **certainly not by looking at the build**. The question is `QUESTIONS-FOR-BRANKO.md`
**S-1**, one row. **If he confirms, this is a five-minute edit; if he says it was a typo, we would
have written the wrong expectation into the suite.**

---

## P2 · All 168 cases — re-stamp the specification version

**Every case's provenance line reads *"the Schedule specification version 23"*. Live is 27.**
Verified across all 168 live bodies: 168 say 23, none says 24, 25, 26 or 27.

**Rule 54 requires the line to be re-stamped whenever we re-check against the spec, and states that a
stale stamp is itself a finding.** This pass is that re-check.

**Proposed:** replace `version 23` with `version 27` in the provenance sentence of all 168.

**What must NOT change, and this is the load-bearing constraint.** Rule 54 state 2 names the build
and the date it was tested. The 168 currently name **two** builds — **90 at `v3.5-7ec992f`**, **78 at
`v3.5-d122eef`**. **No build was observed in this pass.** A re-stamp may correct the specification
version and must **leave every case's build marker and tested-on date exactly as it is**. Writing a
fresh build date would assert a check we did not make (Rule 12) — the precise failure that makes a
provenance line worse than none.

**Ops:** 168 `update_case`, one field each, each byte-verified against its intended payload with
every untouched field proven byte-identical to its pre-write snapshot (Rule 50). **On any mismatch
the batch stops.**

**Honest note on sequencing:** if P1, P3, P4 and P5 are also approved, they should ride **inside**
this pass as one write per case rather than a second write on top — the same case written twice is
two chances to damage it.

---

## P3 · Five provenance lines that name a source which does not support the assertion

Full evidence and the contrast with the ten cases that get it right: `ORPHANS.md` §2.

| Case | Current provenance names | Proposed to name |
|---|---|---|
| **SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865)** | *"the Schedule specification version 23 (§4.5)"* | the **engineering technical plan** (D2 / NFR-005), with its link, and say plainly that **no numbered requirement in the specification covers the clock change** — the wording C38867 already uses correctly |
| **SCH-DEL-10 = [C38864](https://shopview.testrail.io/index.php?/cases/view/38864)** | *"…version 23 (§7)"* | §7 for the toast and Undo, **and the technical plan (D10)** for actions saving immediately |
| **SCH-API-01 = [C38872](https://shopview.testrail.io/index.php?/cases/view/38872)** | *"…version 23 (§14)"* | §14 for the tiers, **and the technical plan (§4 / NFR-003)** for the verb-to-permission mapping and the 403 |
| **SCH-WOL-06 = [C29941](https://shopview.testrail.io/index.php?/cases/view/29941)** | *"…version 23 (§3.1)"* | §3.1 for the search, **and say the empty-result behaviour is derived from it rather than stated by it** |
| **SCH-DEL-06 = [C30062](https://shopview.testrail.io/index.php?/cases/view/30062)** | *"…version 23 (§7)"* | §7 for the series scope prompt, **and say the standalone case is derived rather than stated** |

**Priority: the first three.** A reader who follows C38865's citation to §4.5 will find nothing about
clock changes — `daylight` and `clock change` appear **0 times in all 27 spec versions** — and will
reasonably conclude the case invented its expectation. **The refs field on all five is already
honest**; only the tester-facing sentence over-claims.

---

## P4 · Two new cases for §5.3 Panel collapse

Full requirement text and the proof that no existing case covers it: `SPEC-DIFF.md` D1 and
`GAPS.md` G1.

| Proposed id | Title | Section | `refs` |
|---|---|---|---|
| `SCH-PANEL-01` | Panel toggle collapses and expands the sidebar, and the grid reclaims the width | Navigation & Layout (existing) | `SV-8686 (§5.3,§6,§3.1)` |
| `SCH-PANEL-02` | Collapsing the panel hides its contents rather than discarding them | Navigation & Layout (existing) | `SV-8686 (§5.3 (State preservation,Narrow viewports))` |

**`SCH-PANEL-01` would assert:** the toggle is the first item in the grid toolbar, left of Today ·
the tooltip reads *"Hide panel"* when open and *"Show panel"* when collapsed · the icon itself does
not change between states · the divider disappears so no seam remains · the grid reflows into the
reclaimed space.

**`SCH-PANEL-02` would assert:** calendar date, work-order scroll position, panel search text,
drill-down state and the selected work order all survive a collapse/expand cycle · reopening returns
to whichever panel mode was active · below 960px the panel auto-collapses but the toggle still works,
and that manual choice holds until the next resize across the breakpoint.

**Both would carry `AUTOMATION: HOLD - not yet checked against a build`**, because **no build was
observed in this pass** and neither `READY` nor `READY - EXPECT FAIL` can be asserted without
observing one (Rules 12 / 49 / 61).

**⚠️ RUN SYNC IS PART OF THIS ITEM, NOT AN AFTERTHOUGHT (Rules 34 / 47).** Run 357 has
`include_all = false`, so **it will not pick up new cases by itself**. Syncing it means reading
`get_tests/357`, **UNION**ing the current 168 case ids with the 2 new ones, and sending the **full
union** — a partial `case_ids` list **deletes the omitted tests and their results**, and there are
**429 result records** on that run. Snapshot before, verify every prior result present **by id**
after. **Run 357 belongs to Ayesha Khan and needs its own explicit authorisation.**

---

## P5 · SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) — assert the dark-theme persistence

**Driving requirement, verbatim, v27 §11:**

> *"**Dark theme.** The Schedule supports a user-selectable Light / Dark theme, **chosen from the
> user menu and persisted per user**."*

**The case's own `refs` already claim it** — `SV-8685 (§11 (Dark theme - user-selectable Light /
Dark,persisted per user))` — **but its four steps never sign out and back in**, so the case asserts
less than its own reference says it does.

**Proposed:** one step and one expected result added — *"Sign out and sign back in, and open the
Schedule again"* / *"The Schedule is still in dark mode - the choice was remembered for your user."*
Plus naming the **user menu** as where the theme is chosen, which the current steps leave as *"switch
the app to dark mode"*.

**Not proposed:** the two remaining §11 partials — that elevation/shadow tokens swap so depth reads
correctly, and that the *"+N more"* overflow is conveyed by shape rather than colour. **Both are
closer to design-fidelity checks than behaviour**, and the Figma-fidelity pass that would own them
has not happened. **Recorded as deliberate skips in `DELIBERATE-DECISIONS.md` rather than left
silently undone.**

---

## What was considered and is NOT proposed

| Considered | Why not |
|---|---|
| **Retiring any case** | `delete_case` is irreversible and **nothing here earned it**. The 27 cases no assertion named were each checked and every one is legitimate (`ORPHANS.md` §5). |
| **Authoring for the carryover button, "Add Existing Work Order", or the modal redesign** | `carryover` and `Add Existing Work Order` appear **0 times in all 27 spec versions**. Authoring from the design alone would manufacture a requirement (Rules 57 / 58). |
| **Changing C30001's full-24-hour assertion for E11** | the specification still says *"The full 24-hour timeline remains intact and scrollable"* in v27, **edited two days after the design review**. The case follows the spec, which is correct under Rule 57. Already asked as Tab 2 Item 8.0 of the 6 August sheet. |
| **Changing C30014 / C30025 for SV-8917's "business hours" label** | §4.2 makes the technician's own hours take precedence over the shop's, so applying the ticket literally would make the label wrong for any technician with custom hours. **Raised, not resolved** — `QUESTIONS-FOR-BRANKO.md` and B-2 of `build/handover-ingest-2026-08-10/QUESTIONS.md`. |
| **Filing any Jira ticket** | Rule 62. Nothing in this pass is a defect anyway — every finding is about our own documents. |
| **Regenerating the import or the id-map** | nothing about the case source changed, and `gen_import.py` blanks the id-map C-ids and drops the `refs` column on every rerun. All four counts already reconcile at 168. |

# Report Suite — coverage RE-DERIVATION against the CURRENT specs

**Date 2026-07-31.** Analysis + authoring pass. Scope = all six reports, all 474 of our
active cases, all six live spec versions captured today.

## Headline

> **882 of 895 current requirements were covered AT THE START of this pass. 6 genuine gaps
> were found — and all 6 were CLOSED in this same pass. 888 of 895 are covered ON
> COMPLETION. 0 open gaps. 0 stale or invented anchors on any active case.**

**Read the numbers this way, because the two figures are both true at different points:**
**882 = before**, **888 = after**. The 6 gaps were closed as **extensions to existing cases,
0 new cases** (33 `update_case`, all HTTP 200, all re-GET byte-verified MATCH; run 359
verified 474/474 and never written). The arithmetic reconciles exactly: **888 covered + 7
deliberately not covered = 895**. Evidence: `AUTHORING-COVERAGE.md` §6 ("Before this pass
882/895 → After **888/895**"; "Open genuine gaps 6 → **0**") and
`testrail-execution-log-2026-07-31.md`. **Sections 3 and 4 below are the BEFORE state,
kept deliberately** so the gaps and their root cause stay on the record rather than being
edited out of history; §6 and `AUTHORING-COVERAGE.md` are the AFTER state.

The remaining 7 requirements are deliberately not covered, each with a named reason
(4 cut by the user-authorized 2026-07-28 audit, 3 not independently testable) — listed
verbatim in §5. Nothing is left unjudged.

---

## SOURCE-CURRENCY block (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| Spec — Sales By Customer | Confluence pageId **577634305** | **v12**, updated 2026-07-29 by Chris Ward | 2026-07-31 | **CURRENT** |
| Spec — Sales By Representative | Confluence pageId **585629698** | **v15**, updated 2026-07-29 | 2026-07-31 | **CURRENT** |
| Spec — Parts Velocity | Confluence pageId **620888066** | **v4**, updated 2026-07-29 | 2026-07-31 | **CURRENT** |
| Spec — Technician Utilization | Confluence pageId **641400833** | **v5**, updated 2026-07-29 | 2026-07-31 | **CURRENT** |
| Spec — WIP Work In Progress | Confluence pageId **703660034** | **v6**, updated 2026-07-29 | 2026-07-31 | **CURRENT** |
| Spec — Inventory Value | Confluence pageId **720142338** | **v3**, updated 2026-07-29 | 2026-07-31 | **CURRENT** |
| Epic + child stories | **SV-8582**, 97 children SV-8583→SV-8679 | Tier-1 currency check 2026-07-31 (`build/epic-recheck-2026-07-31/`) — 6 reopened stories noted | 2026-07-31 | **CURRENT** |
| Designs | none exist for this project | n/a — spec-only authoring, no Figma file | 2026-07-31 | **N/A (none to be current with)** |
| Engineering tech plan | `build/report-suite/tech-plan-2026-07-29/` | 2026-07-29 | 2026-07-31 | **CURRENT** |
| PO answers / messages / video | Chris Ward 2026-07-28, 2026-07-29 message, 2026-07-31 answers; PRD companion video 2026-07-30 | newest = 2026-07-31 answers | 2026-07-31 | **CURRENT** |

Spec bodies used are the verbatim captures in
`build/report-suite/spec-current-2026-07-31/` (REST storage-format → markdown; the
capture pipeline was validated byte-identical against the prior versions).

**Live-build status (Standing Rules 12/22):** no Report Suite QA branch/environment
exists yet. **Nothing in this pass is live-verified.** Every case touched stays
`VIU-Pending`, and every label the spec does not pin down is marked *(VIU-confirm)* /
"confirmed in the build" in the case body.

---

## 1. Why this pass exists

The earlier per-report coverage matrices — `build/report-suite/coverage-sbc.md`,
`-sbr.md`, `-pv.md`, `-tu.md`, `-wip.md`, `-iv.md` — were written against **older spec
versions** (the 2026-07-22 authoring round). Everything we did today worked from the
**spec DIFF**: every added, changed and removed requirement was handled. That proves the
**changes** are covered. It does **not** prove nothing was **already** missing before the
diff. This pass closes that hole by re-deriving coverage from the current specs from
scratch, requirement by requirement.

**These results supersede the six `coverage-*.md` matrices** for the question "is every
requirement covered?". Those files remain as the record of the 2026-07-22 authoring
round.

---

## 2. Method

1. **Enumerate.** For each spec, take the `## 6. Requirements` section and read every
   requirement definition inside it. A definition is a list line whose first bold run
   starts with a requirement id. Four shapes occur and all four are counted:
   `**S1-R1:** …` · `**S5-R1: Inventory data source.** …` (id + inline title inside the
   bold) · `**S3-R1a:** …` (letter-suffixed sub-requirement) · `**S18-R7.1:** …` (dotted
   sub-requirement). `R` = requirement, `N` = negative case, `E` = edge case — all three
   count, because each is a thing a tester can be asked to check.
2. **Map by anchor.** For each of our cases, read the `spec_ref` field and extract every
   requirement id it cites. Compressed citations are expanded (`S14-R1/R2/R4` → three
   ids; `S18-R7.1–R7.6` → the parent plus six sub-ids) — without this, 6 requirements
   looked uncovered when they were not.
3. **Map by text where the anchor missed.** Any requirement with no anchor is scored by
   term overlap against every active case body in that report, and the top candidates are
   read **by hand** to decide whether the behaviour is genuinely asserted. This is what
   stops a mis-typed anchor from being reported as a coverage gap.
4. **Judge every leftover** into one of: `GAP` · `NOT-TESTABLE` · `CUT-BY-AUDIT` ·
   `SPEC-BLOCKED` · `DESCOPED`. Judgements are stored in `judgements.json` with the
   reason for each, so the run is reproducible and reviewable.
5. **Reverse check.** Every anchor cited by a case is checked to exist in the current
   spec.

Repeat per spec version with `python3 rederive_coverage.py` (reads the specs, the case
bodies, `testrail-id-map.csv` and `judgements.json`; writes
`requirement-coverage.csv` + `coverage-summary.json`).

### Completeness of the parse (Standing Rule 17)

Every requirement id that appears **anywhere** in each spec was cross-checked against
the ids the parser *defined*. The residue is fully explained — nothing was dropped:

| Spec | Defined | Ids mentioned but not defined | Explanation |
|---|---|---|---|
| SBC | 234 | `S16-R6`, `S8-R14a`, `S8-R14b` | All three appear **only in the change log**, which records their deletion (Print retired; the expand-gate removed 2026-07-16). Correctly not requirements. |
| SBR | 234 | — | none |
| PV | 73 | — | none |
| TU | 120 | — | none |
| WIP | 122 | `S7-R7a`, `S9-E2` | Both appear **only in the change log**, which records their removal (All-Time dropped; export-only "Lead Tech" column dropped). |
| IV | 112 | — | none |

Three SBC stories and one SBR story are explicitly **removed** in the spec itself and
carry no requirements — SBC Story 5 *(removed — search consolidated into the Customer
filter)*, Story 16 *(removed — Print retired)*, Story 19 *(removed — asset comparison
deferred)*; SBR has no Story 7. These are gaps in the **numbering**, not missing
requirements.

**Sub-requirement crediting rule (stated so the numbers can be audited):** a case citing
a **dotted parent** (`S18-R7`) is credited with its dotted children (`S18-R7.1`…`.6`),
because the children are a bulleted breakdown of one rule. A case citing a
**letter-suffix parent** (`S8-R5`) is **not** automatically credited with `S8-R5a` —
letter-suffixed items are materially different rules (e.g. PV `S5-R4` is the movement
columns while `S5-R4a` is the profitability columns), so each needs its own citation or
its own text evidence.

---

## 3. Per-report totals

**This table is the BEFORE state (start of the pass).** All 6 gaps below were closed later in
the same pass — see §6 / `AUTHORING-COVERAGE.md` for the AFTER state (**888 covered · 0 open
gaps**).

| Report | Spec | Requirements | of which R / N / E | Covered | **Genuine gaps** | Not covered by design | Our active cases |
|---|---|---|---|---|---|---|---|
| Sales By Customer | v12 | **234** | 204 / 21 / 9 | 231 | **1** | 2 | 83 |
| Sales By Representative | v15 | **234** | 190 / 35 / 9 | 231 | **1** | 2 | 111 |
| Parts Velocity | v4 | **73** | 61 / 6 / 6 | 69 | **1** | 3 | 71 |
| Technician Utilization | v5 | **120** | 101 / 12 / 7 | 118 | **2** | 0 | 60 |
| Work In Progress | v6 | **122** | 114 / 5 / 3 | 122 | **0** | 0 | 79 |
| Inventory Value | v3 | **112** | 99 / 8 / 5 | 111 | **1** | 0 | 70 |
| **TOTAL** | | **895** | 769 / 87 / 39 | **882** | **6** | **7** | **474** |

Covered splits into **865 covered by a direct (or dotted-parent) anchor** and **17
covered by the case text with the anchor missing or mis-typed** — a traceability-hygiene
problem, not a coverage problem. Those 17 anchors are backfilled in this pass (§6).

*(Live TestRail holds 479 cases under group 4281. 5 of those — C38919–C38923 — are
Vladimir Tomovic's and are excluded from every number here; we never touch them.)*

---

## 4. The genuine gap list (6) — ALL SIX CLOSED IN THIS PASS

All six are the **same shape**: the on-screen behaviour is covered, the **export half of
the same requirement is not**. Verbatim spec text, and the judgement. **Status: all 6 were
closed as extensions to existing cases (0 new cases) before this pass ended** — the list is
retained as the record of what was found, not as an open backlog (`AUTHORING-COVERAGE.md` §2
names the 6 extensions).

| # | Report | Req | Verbatim (the uncovered half) | Judgement |
|---|---|---|---|---|
| 1 | SBC | **S4-R13** | *"When the Location column is shown on screen (more than one location in scope, S4-R12), every export also includes that Location column."* | **Genuine gap.** The `"Locations:"` line half **is** covered (SBC-EXP-09 = [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) expected 4 for the PDF header, SBC-EXP-03 = [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) expected 7 for the CSV). No case asserts the **column** in the exports. |
| 2 | SBR | **S14-R20** | *"Whenever the Location column is shown on screen (S21-R7), it is included in all four exports in the same position it occupies on screen … a Summary (rolled-up) row carries the rep's location, reading **Multiple** when that rep spans more than one location; an Expanded (per-invoice) row carries that invoice's own exact location."* | **Genuine gap.** SBR-EXP-02 = [C30277](https://shopview.testrail.io/index.php?/cases/view/30277) expected 5 covers only the `"Locations:"` line. |
| 3 | PV | **S6-R11** | *"Every export includes the per-row **Location** column whenever it is shown on screen …, in its on-screen column position."* | **Genuine gap.** PV-EXP-02 = [C30376](https://shopview.testrail.io/index.php?/cases/view/30376) expected 3 covers only the `"Locations:"` line. |
| 4 | TU | **S7-R13** | *"Every download (both PDF views and the CSV) includes the per-row **Location** column whenever it is shown on screen …, in its on-screen leftmost position."* | **Genuine gap.** TU-EXP-04 = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) expected 4 covers only the `"Locations:"` line. |
| 5 | IV | **S10-R15** | *"Every export (each CSV and each PDF) includes the **Location** column whenever it is shown on screen (S7-R6)…"* | **Genuine gap.** IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) expected 4 covers only the `"Locations:"` line. |
| 6 | TU | **S8-R16** | *"The icon-only Column Selection control carries an accessible name exposed to assistive technology."* | **Genuine gap.** TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) expected 1 checks the **tooltip**, which is not the accessible name. The suite tests accessible names elsewhere (TU-DAY-01 = [C30418](https://shopview.testrail.io/index.php?/cases/view/30418), TU-DAY-04 = [C30421](https://shopview.testrail.io/index.php?/cases/view/30421)), so this is observable and genuinely untested. |

**Why WIP has zero gaps:** WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) already drives the download and reads the exported
column header ("Branch"). The other five reports' Location cases stop at the screen. WIP
is the pattern the other five are brought up to in §6.

**Root cause, stated plainly.** The per-row Location column is a **2026-07-29 suite-wide
addition**. On 2026-07-31 one case per report was authored for it (C38912–C38917). Five
of the six were written to the *on-screen* requirement (`S4-R12`, `S21-R7`, `S3-R10`,
`S9-R9`, `S7-R6`) and the sibling *export* requirement in the same spec round was not
picked up — except on WIP, where the exported "Branch" header forced the author to open
the file. This is exactly the class of miss a spec-diff pass cannot catch by itself.

---

## 5. Requirements deliberately NOT given a case (7) — with reasons

**Cut by the user-authorized Ruthless Usefulness Audit of 2026-07-28**
(`build/report-suite/quality-audit-2026-07-28/`) — re-authoring them would reverse a
recorded ruling:

| Req | Verbatim | Cut as |
|---|---|---|
| SBC **S10-N1** | *"When the table has no customer rows, the sort controls on the headers are still present but produce no visible change."* | retired SBC-SORT-07 — **no-op assertion** (a test whose expected result is "nothing happens" cannot fail informatively). |
| SBR **S11-N1** | *"With only one rep row visible, the sort affordances are present but produce no observable change."* | retired SBR-SORT-06 — **no-op assertion**. |
| SBR **S14-R14** | *"Tier selection uses the longest formatted **positive** value … the export shifts the base tier **one step smaller** … clamped at the 8px floor…"* | retired SBR-EXP-09 — **px font-tier edge minutiae, not manually testable**. A manual tester cannot measure an 8px-floor one-step font-tier shift inside a PDF. |
| PV **S4-N1** | *"If a saved view predates the current version of the report's saved format (its stored schema version does not match the current one), the system ignores the stale view and loads the current defaults…"* | retired PV-COL-07 — **stale-schema seeding not executable manually**. The reachable half (an invalid saved *value* falls back to its default) **is** covered by PV-COL-05 = [C30355](https://shopview.testrail.io/index.php?/cases/view/30355). |

**Not independently testable:**

| Req | Verbatim | Why |
|---|---|---|
| SBC **S20-N1** | *"No applicable user-visible negative cases. The visual conformance rules apply whenever the report is rendered."* | The spec itself says there is nothing to test. |
| PV **S3-R1** | *"The table displays one row per part, showing the columns currently enabled in the column picker (see Story 4). Calculation of each column's value is defined in Story 5."* | A pointer/restatement. Its substance is tested by PV-ROW-01 = [C30341](https://shopview.testrail.io/index.php?/cases/view/30341) and PV-ROW-02 = [C30342](https://shopview.testrail.io/index.php?/cases/view/30342) (the row model) plus PV-COL-02 = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) and PV-COL-03 = [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) (the enabled columns). A case of its own would be spec-parroting. |
| PV **S7-R7** | *"These rules are the normative visual spec for this report as built … this spec is the source of truth for this report."* | A statement about the **spec**, not about the product. (SBR's twin `S18-R7.6` reads the same way and is anchored on SBR-VIS-01 = [C30305](https://shopview.testrail.io/index.php?/cases/view/30305) — noted so the two are not treated inconsistently.) |

**Blocked by the spec itself: none.** No current Report Suite requirement carries a
"pending / undefined / TBD from engineering" clause that prevents authoring.
**Descoped by a PO ruling: none in this pass** (the PO-descoped items — Print,
All-Time, the asset-comparison story — were *removed from the specs*, so they never enter
the enumeration).

---

## 6. Reverse check — stale or invented anchors

**Zero stale or invented anchors on any of the 474 active cases.** Every requirement id
cited by an active case exists in that report's current spec.

Seven citations point at ids that no longer exist (`S16-R3`, `S16-R3a`, `S16-R3b`,
`S16-R3c`, `S16-R4`, `S16-R5`, `S16-N1` — SBC's retired Print story). **All seven belong
to one case, SBC-EXP-13, which was itself retired and deleted from TestRail on
2026-07-28** when Print was removed. Correct behaviour, not a defect.

**17 anchors were missing or mis-typed** on cases that *do* test the requirement. These
are the traceability-hygiene half of this pass — every one is backfilled (metadata layer
only; no tester-facing text changed):

| Report | Requirement(s) with no anchor | Covering case | Why the anchor was wrong |
|---|---|---|---|
| SBC | `S14-R8` | SBC-EXP-03 = C30161 | citation stopped at `S14-R5/R6/R7/R13` |
| SBC | `S14-R9` | SBC-EXP-04 = C30162 | citation off by one (`S14-R10..R13`) |
| SBC | `S14-R15` | SBC-EXP-02 = C30160 | not cited |
| SBC | `S14-R16`, `S15-R25` | SBC-EXP-14 = C30172 | cites the pre-v12 numbering (`S14-R14`, `S15-R22`) |
| SBC | `S15-R16`, `S15-R17`, `S15-R18` | SBC-EXP-10 = C30168 | cites the pre-v12 numbering (`S15-R12..R15`) |
| SBR | `S2-R7` | SBR-PERS-04 = C30274 | anchor did not travel when SBR-DATE-03 was merged in on 2026-07-28 |
| SBR | `S2-N1`, `S21-N2` | SBR-STATE-01 = C30298 | the two filter routes into the empty state were not cited |
| TU | `S1-R6` | TU-NAV-03 = C30394 | not cited |
| WIP | `S1-R5` | WIP-TAB-01 = C30451 | anchor did not travel when WIP-TAB-04 was merged in on 2026-07-28 |
| WIP | `S6-N1` | WIP-SCOPE-05 = C30460 | anchor did not travel when WIP-TOT-04 was cut on 2026-07-28 |
| WIP | `S9-R10a` | WIP-EXP-02 = C30511 | not cited |
| WIP | `S10-R5a` | WIP-FLT-09 = C38916 | not cited |
| IV | `S4-N1` | IV-NAV-06 = C30539 | anchor did not travel when IV-TOT-05 was cut on 2026-07-28 |

**Pattern worth remembering:** 5 of the 17 were lost when a case was **merged or cut** in
the 2026-07-28 consolidation — the survivor kept the behaviour but not the retired case's
spec anchors. Any future merge must carry the merged case's anchors into the survivor's
`refs`.

---

## 7. Ground-truth sanity checks (as briefed)

| Check | Result |
|---|---|
| The QuickBooks precision gap closed earlier today (PV-PREC-01 = [C38924](https://shopview.testrail.io/index.php?/cases/view/38924), PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925)) must **not** appear as a gap | **Confirmed.** `PV S5-R1` and `PV S5-R5` are `COVERED-DIRECT`, PV-PREC-01 among the covering cases. PV-PREC-02 is a case with **no report-spec requirement at all** (QuickBooks is in no report spec — its ref cites SV-8589 + the tech plan and says so), which is a ticket-driven case, not a coverage gap. |
| TU **Story 10** exists in the spec but has **no Jira story** — a ticket gap, not a coverage gap | **Confirmed, not miscounted.** All six of `S10-R1…S10-R6` are `COVERED-DIRECT` by TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859), whose `refs` deliberately use the **epic** `SV-8582` and state *"NO OWNING JIRA STORY: epic SV-8582 carries no TU Story-10 ticket and the spec's own Jira field reads TBD; epic key used and FLAGGED"*. Counted as covered; the missing ticket is carried as an outstanding item, not a gap. |

---

## 8. Flagged for the PO / spec watch (not silently resolved)

1. **The "too large to export" message lives in only 3 of 6 specs, in 3 different
   wordings.** SBC (`S14-R16`, `S15-R25`) says *"This export is too large to generate. …
   then try again."*; SBR (`S14-E2` + §7) says *"… and try again."*; IV's §7 says *"This
   report is too large to export. … then try again."* (its requirement `S10-R12` states
   the cap without quoting a message); **PV, TU and WIP carry no cap line at all.** Chris Ward's **2026-07-31 answer (Q2 = Option A)** ruled **one suite-wide
   message** — *"This report is too large to export. Narrow the date range or filters,
   then try again."* — and explicitly retired the SBC variant. All six of our cap cases
   already quote the ruled string (Rule 32, newest-wins), so **no case change is needed**;
   what is outstanding is **Chris's spec edit** on all six pages. Already on
   `SPEC-WATCH-2026-07-28.md` (deadline **2026-08-04**) — re-confirmed here.
2. **PV `S7-R7` vs SBR `S18-R7.6`** are the same "this spec is the source of truth"
   meta-statement; SBR's is anchored on a case and PV's is judged not-testable. Harmless,
   but if the suite ever wants them treated alike, the SBR anchor is the one to drop.

Nothing else in the six specs was ambiguous enough to stop on.

---

## Files

| File | What it is |
|---|---|
| `COVERAGE-REDERIVATION.md` | this document |
| `requirement-coverage.csv` | **one row per requirement** (895): report, story, requirement id, kind, verbatim text, status, covering case internal IDs + C-ids, text candidates, verdict + judgement |
| `judgements.json` | the hand judgement + reason for every requirement the anchor pass could not map — the reviewable input to the re-run |
| `coverage-summary.json` | machine-readable per-report totals, parse notes, reverse-check output |
| `rederive_coverage.py` | the enumerator/mapper — re-run per spec version |
| `AUTHORING-COVERAGE.md` | §6 authoring: what was extended, why the number is 6 and not 6 new cases |
| `RULE28-AUDIT.md` | the three-dimension audit + cross-case consistency sweep over the changes |
| `testrail-manifest-2026-07-31.md` / `testrail-execution-log-2026-07-31.md` | the push manifest and the per-operation audit log |

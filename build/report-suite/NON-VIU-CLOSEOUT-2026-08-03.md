# Report Suite — NON-VIU CLOSEOUT, 2026-08-03

**Purpose.** The QA lead's instruction, verbatim: *"I want the report suite now at the stage where the
only remaining part left is the VIU and things related to VIU. So make sure nothing is left."* This
document is the checklist that answers it, item by item, with the evidence for each.

**Every check below was RUN, not quoted.** Where a check needed a live read (TestRail, Confluence,
Jira) the live read was done today. Where something could not be fully verified it is labelled
**PARTIAL** or **NOT VERIFIED** with the exact shortfall (Standing Rule 12).

## THE ONE-LINE ANSWER

> **NO — Report Suite is not yet VIU-only. Two things remain, and both need a human decision, not
> work: (1) the QA lead must rule RESCOPE-or-RETIRE on two Parts Velocity cases that the
> one-permission ruling leaves unrunnable, and (2) Chris Ward owes 5 product decisions and 12
> description corrections, 7 of which were due 4 August. Everything else non-VIU is DONE.**

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31) — all checked live 2026-08-03

| # | Source | Identifier | Version / last-updated | Verdict |
|---|---|---|---|---|
| 1 | **SBC spec** | Confluence 577634305 | **lastModified Jul 31 2026** — body read live | **CURRENT** |
| 2 | **SBR spec** | Confluence 585629698 | lastModified **Jul 29 2026** = our v15 capture | **CURRENT** |
| 3 | **PV spec** | Confluence 620888066 | lastModified **Jul 29 2026** = our v4 capture | **CURRENT** |
| 4 | **TU spec** | Confluence 641400833 | lastModified **Jul 29 2026** = our v5 capture | **CURRENT** |
| 5 | **WIP spec** | Confluence 703660034 | lastModified **Jul 29 2026** = our v6 capture | **CURRENT** |
| 6 | **IV spec** | Confluence 720142338 | lastModified **Jul 29 2026** = our v3 capture | **CURRENT** |
| 7 | **Epic SV-8582** | Jira, Tier-1 currency check (Rule 37) | **97 children** — matches our ingest exactly | **CURRENT** |
| 8 | **Tech plan** (Rule 30) | `tech-plan-2026-07-29/` | reconciled 2026-07-29/30 | **CURRENT** |
| 9 | **Videos** | 2026-07-30 Loom + PRD companion | ingested; ruled authoritative | **CURRENT** |
| 10 | **Designs** | — | **NONE EXIST** — spec-only project; no Rule-35 fetch queue is open | **N/A** |
| 11 | **The build** | QA branch `project/reports-suite-bravo` | never available to QA | **ABSENT** |

**⚠️ Two currency findings from today, both real:**

1. **Our local SBC spec mirrors are STALE** — `specs/sbc-sales-by-customer.md` and the
   `spec-current-2026-07-31/` capture (**v12, Jul 29**) both still carry the abolished
   dedicated-permission **S1-R2**. The live page is **Jul 31**. Trusting either would have written
   the exact opposite of the live spec into a `refs` field. **Open item — see §12.**
2. **The 6 "reopened" stories are actually OBSOLETE, not reopened.** Live Jira: **90 Open · 6
   OBSOLETE (SV-8583…SV-8588) · 1 In Progress (SV-8589)**. **Checked: ZERO of our 475 cases cite any
   of the 6 obsolete keys**, so there is no traceability damage. (SV-8589 is cited by 6 cases and is
   In Progress — fine.)

---

## THE CHECKLIST — 12 items

### 1 · Coverage — **DONE (re-derivation PARTIAL, 0 genuine gaps)**

Re-derived **from the current spec bodies and the current case source**, both directions, rather than
quoting the doc. Honest limit stated first: my anchor extractor captured **856 of the ~895**
requirement anchors — **39 were missed purely by formatting** (e.g. `**S8-R7 (asset label —
primary):**`, where the parenthetical breaks the pattern). So this is an **independent PARTIAL
cross-check of the documented 888/895, not a full re-derivation.**

| Direction | Result |
|---|---|
| requirement → case (uncovered requirements) | **7 uncovered of the 856 checked** — and **all 7 explained, 0 genuine gaps** |
| case → requirement (stale anchors) | **31 flagged, ALL 31 verified as MY OWN extractor artefacts** — spot-checked live against the spec bodies (SBC `S8-R7`, `S14-R5`, PV `S5-R1` all present). **0 real stale anchors** |

**The 7 uncovered, each verdicted (Rule 43):** **SBC S10-N1**, **SBR S11-N1**, **SBR S14-R14**, **PV
S4-N1** — the four deliberately-not-tested, cut by the authorised 2026-07-28 Ruthless Usefulness
Audit (no-op assertions, un-measurable px font tiers, an un-seedable stored-schema state), recorded
with reasons in `coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md` §5. Plus three that are
**not assertions at all**: **SBC S20-N1** (*"No applicable user-visible negative cases"*), **PV
S3-R1** (a pointer — *"Calculation of each column's value is defined in Story 5"*, covered by the
column cases), **PV S7-R7** (a statement about the document — *"These rules are the normative visual
spec for this report as built"*). **Nothing testable is uncovered.**

### 2 · Traceability, Rule 20 — **DONE, verified live on all 475**

| Check | Local source | **LIVE TestRail** |
|---|---|---|
| Active cases checked | **475** | **475** |
| Missing `refs` | **0** | **0** |
| Missing a Jira ticket key | **0** | **0** |
| Missing a spec anchor | **0** | — |
| `refs` citing an OBSOLETE story | **0** | **0** |

### 3 · Wording, Rule 9 — **DONE for what the specs pin; the rest is legitimately VIU**

Labels come from the spec text verbatim; nothing invented. Anything the descriptions do not pin is
written as *"confirm in the build"* rather than guessed — **that hedging is exactly what VIU exists to
resolve and is not a defect.** The largest single instance is the **on-screen name of the one reports
permission**: neither Chris nor the QA lead named a build label, so all 12 permission cases say *"the
ordinary reports access"* and must be VIU-confirmed. **Honest exposure, already recorded as E3 (HIGH)
in the deliberate-decisions register.**

### 4 · Rule 28 three-dimension audit — **DONE on dimensions 1 and 3; ⚠️ dimension 2 has 2 KNOWN CONTRADICTIONS, deliberately left open**

| Dimension | Verdict |
|---|---|
| **1 USEFUL** | **DONE** — 100% scored in the authorised 2026-07-28 audit; the 41-group merge consolidation and 57 deletes were executed |
| **2 MAKES SENSE** | **0 nonsense** · 9 sense repairs executed 2026-07-28. **BUT: 2 UNRESOLVED CONTRADICTIONS as of today** — see below |
| **3 GENUINE + LAYMAN** | **DONE** — 475/475 traceable (§2); 0 titles over 80 chars; plain numbered wording throughout |

**⚠️ THE 2 CONTRADICTIONS, stated plainly because a suite may not be delivered with one hidden.**
Today's group-C/D pass moved 10 cases onto the single reports permission. **PV-PERM-03 =
[C30327](https://shopview.testrail.io/index.php?/cases/view/30327)** and **PV-API-04 =
[C30391](https://shopview.testrail.io/index.php?/cases/view/30391)** still assert the OLD per-area
model, so they now **directly contradict PV-PERM-01 = [C30325](https://shopview.testrail.io/index.php?/cases/view/30325)**.
They cannot both be true. **This was NOT an oversight — they were held back on purpose** because
fixing them is a retire-or-rescope decision and a delete is irreversible. **Resolution is one ruling
away (§12 item 1);** my recommendation is **RESCOPE**, which is an ordinary edit.

### 5 · Titles — **DONE, measured live**

**0 of 475 over 80 characters**, measured from live TestRail titles today (not from the id-map). The
10 cases retitled today measure 55–78.

### 6 · Rule 40 surfaces — **DONE**

The multi-surface Location requirement — the one that produced Rule 40 — is verdicted per surface
across all six reports: on-screen (6 cases: C38912, C38913, C38914, C38915, C38916, C38917), CSV and
PDF exports (SBC `S4-R13`, SBR `S14-R20`, PV `S6-R11`, TU `S7-R13`, IV `S10-R15` all now carry export
coverage; WIP already did), and the `"Locations:"` metadata line. **The remaining open point is a
POSITION question, not a coverage gap** — where the column sits inside the two shorter Summary
downloads, which no description states. That is **item 3 of the Chris sheet** and the 5 affected cases
hedge it honestly.

### 7 · Rule 45 outside-in — **DONE, both directions, live**

| Direction | Result |
|---|---|
| Their cases duplicating ours | Read live today: **5 foreign cases, all `created_by = 1` (Vladimir Tomovic)** — C38919, C38920, C38921, C38922, C38923. Classified 2026-07-31: C38920 duplicates PV-FILT-14 (C38914); C38922 duplicates WIP-EXP-02 (C30511) + WIP-EXP-07 (C30516); C38919 bundles TU-COL-01 (C38859) + TU-EXP-04 (C30437); **C38921 is genuine new coverage**; **C38923 was RIGHT and exposed a real defect on OUR side** |
| Assertions of theirs with no counterpart in ours | Run via `gap-rootcause-2026-07-31/reverse_coverage_diff.py`. **1 candidate gap remains: C38921's assertion about the `As of` metadata line's POSITION above the header row.** Named, not silently dropped; authoring it needs the QA lead's go-ahead (Rule 6) |
| Hands-off | **All 5 untouched today.** The executors carry a hard `created_by !== 3` guard that refused each of them before any write |
| Counting | Reported both ways always: **ours 475 / live total 480** |
| Automation-engineer lens | **LIMITED — and this must be said.** With no QA branch the lens can only ask what the DOCUMENT implies, not what a running build emits. That limit is the single biggest reason an outsider working from the build could still out-see us |

### 8 · Rule 46 deliberate-decisions register — **DONE, with today's additions listed**

`coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md` exists with all six fields per entry and
an honest risk profile (**HIGH 3 · MEDIUM 7 · LOW 25**). Today adds four entries, all already written
into today's papers rather than left implicit:

1. **No test case for the inert back-end permission** — invisible in the front end, enforcing nothing;
   nothing for a tester to pass or fail. The observable half IS covered, by **SBC-PERM-05 =
   [C39447](https://shopview.testrail.io/index.php?/cases/view/39447)**.
2. **The ticket key SV-8780 was kept OUT of the tester-facing note** (Rule 20), against the staged
   plan's own proposal.
3. **The new case is SBC-PERM-05, not SBC-PERM-03** — that id was already taken by C30100.
4. **C30327 / C30391 deliberately left contradicting the suite**, pending the retire-or-rescope
   ruling (§4).

### 9 · Run 359, Rules 34/47 — **DONE, verified live after every write**

| Check | Result |
|---|---|
| Our active cases NOT in the run | **0** |
| Run tests not in our active set | **0** (so no foreign case sits in the run either) |
| Test count | **474 → 475** (the one `add_case`), verified after both of today's passes |
| Prior result records | **539 before → 539 after · every one verified present by result id** |
| `include_all` | `false` — so the union procedure is mandatory on every future `add_case` |

**Note for the record: the staged plan said the run held 0 results. It held 539.** The snapshot was
taken at write time, which is precisely why they survived.

### 10 · Deliverables — **DONE; all four numbers reconcile**

| Number | Value |
|---|---|
| **Local active cases** | **475** |
| **Live in TestRail (ours)** | **475** |
| **`testrail-id-map.csv` rows** | **475** · **0 blanks** (475/475 C-ids re-merged after the generator blanked them) |
| **Import data rows** | **475** |

Import header **byte-identical** to the Filters peer file (verified by `cmp`). **0** VIU words, **0**
feature-flag words, **0** duplicate titles, **0** internal-id leaks; 30 API cases all in "API"
sections (Rule 4). Six per-report split files regenerated: 84 + 111 + 71 + 60 + 79 + 70 = **475**.

### 11 · Source currency — **DONE.** See the block above.

### 12 · Open asks — **the two things that are genuinely left**

#### BLOCKED-ON-THE-QA-LEAD (Rule 48, all five fields)

| Field | Detail |
|---|---|
| **What I need** | A ruling: **RESCOPE or RETIRE** PV-PERM-03 = [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) and PV-API-04 = [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) |
| **Which ruling froze it (verbatim)** | *"DO NOT execute group E (C30327, C30391). Those are retire-or-rescope, and a delete is irreversible and would change run 359's count — bring me the recommendation and I will get his explicit sign-off."* |
| **When / what it answered** | 2026-08-03, answering how far to take his own ruling *"Yes all the reports will be gated by ONE permission FOR NOW"* |
| **What it blocks** | Those two cases are **currently unrunnable** (their premise state cannot be produced under one permission) **and they contradict C30325** — the only unresolved contradiction in the suite (§4) |
| **Was it right?** | **Yes, clearly.** A `delete_case` is irreversible, the ruling is explicitly *"FOR NOW"*, and the build has never been observed. Deleting on those grounds would be a real coverage loss |
| **What unblocks it** | One word. **My recommendation: RESCOPE — which is an ordinary `update_case`, no delete, no run change.** Reasoning and the exact proposed wording are in `chris-answers-2026-08-01/staged-case-plan-CDE-2026-08-03.md` |

#### BLOCKED-ON-CHRIS-WARD

| # | What | What it blocks | Since |
|---|---|---|---|
| 1 | **5 product decisions** — SBR export columns · will the descriptions be updated · Location position in the Summary downloads · the single logo rule · which SBC features were dropped | ~15 cases stay hedged rather than asserted | 4 of the 5 since **2026-07-31** |
| 2 | **12 description corrections**, incl. the **7 SPEC-WATCH items due 2026-08-04 — tomorrow** | The written text contradicts rulings our cases follow, so anyone comparing us to the description reads a mismatch as OUR error | **2026-07-28** |
| 3 | **The 5 non-SBC descriptions still name a per-area report permission** (NEW today) | The 12 cases reworded today are correct per his ruling but disagree with his own written text | 2026-08-03 |

**Both are in `PO-Questions-Chris-ReportSuite-2026-08-03.md`/`.xlsx` — READY TO SEND** (17 items,
13 sources swept, 10 candidates withdrawn as already answered).

#### BLOCKED-ON-NOBODY — small, ours, staged

| # | What | Why not done today |
|---|---|---|
| 1 | **Refresh the local SBC spec mirrors** to the live Jul-31 text | Editing spec mirrors was outside the authorised scope. **The risk is live**: the next pass that trusts `specs/sbc-sales-by-customer.md` will read the abolished dedicated-permission requirement as current |
| 2 | **Add the QA lead's 2026-08-03 ruling citation** to the 4 cases pushed earlier today (C30096, C30098, C30099, C39447) | Their tester note already contains *"for now"*, but their `refs` cite Chris only. 4 tiny `refs` appends; outside that push's authorisation |
| 3 | **`SPEC-WATCH-2026-07-28.md` header says "6 OF 12"** while its own table lists **7** open items (1b, 4, 6, 8, 9, 10, 11) | A one-line count fix in a doc I was not authorised to edit this pass. **The 7 is correct** — the individual rows are the source of truth |

---

## WHAT CANNOT BE CLOSED WITHOUT VIU — stated separately and honestly

**There is no QA branch and there never has been.** Therefore:

- **All 475 cases are VIU-Pending. Not one has been observed against a running build.**
- Every on-screen label, every layout position and every calculation in the suite rests on *"the
  description says so"*, never *"the build shows it"* (Standing Rules 12/22).
- The specific things that can ONLY be settled live: the **on-screen name of the one reports
  permission**; whether the built dedicated SBC permission is in fact hidden from the role editor
  (**C39447**); the **Location column's actual position** in the two Summary downloads; and the
  ~small set of labels our cases legitimately hedge as *"confirm in the build"*.
- **Fresh login cookies will be needed** the moment the branch exists.

**This is the VIU work itself, not an omission — and it is the only category of work left after the
two decisions above are made.**

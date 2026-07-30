# Schedule — COVERAGE RE-DERIVATION against the CURRENT spec (Confluence v23)

**Date:** 2026-07-31 · **Project:** Schedule (ShopView App) · **PO:** Branko Cicovic ·
**Epic:** SV-8685 (15 stories SV-8686..SV-8700) · **TestRail:** project 1, group 4254, run 357

---

## 0. WHY THIS EXISTS

Our coverage matrix (`build/schedule/coverage-matrix.md`) was built against Confluence
**v18**. Earlier today we worked from the **v18 → v23 DIFF** and handled every added,
changed and removed requirement. That proves **the CHANGES are covered** — it does **not**
prove that nothing was **already missing** before v19. On the **Filters** project the same
exercise found **~26 uncovered requirements**, and a junior QA's spec read found real gaps
we had not seen. This pass closes that exposure for Schedule by re-deriving coverage from
**zero**: enumerate every statement in the live v23 body, map each one to the case(s) that
actually assert it, and judge every unmapped statement.

**This document supersedes** `build/schedule/coverage-matrix.md` and the per-story coverage
tables in `build/schedule/epic-sv8685/` as the authoritative statement of Schedule coverage.
Those files are prior art built on the v18 baseline; they were not trusted as inputs here.

---

## 1. SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last updated | Checked | Verdict |
|---|---|---|---|---|
| Spec (PRD) | Confluence page **713031682** "Schedule", space SHOPVIEW | **Confluence version 23**, 2026-07-30T10:40:32Z, by Branko Cicovic (page-body "Version" field still reads 1.0 — Branko never bumps it; the Confluence version number is the real marker) | 2026-07-31 (pull captured in `spec-current-2026-07-31/`) | **CURRENT** |
| Epic + child stories | **SV-8685** + 15 children **SV-8686..SV-8700** | Verified UNCHANGED since our ingest — story set, statuses and changelog all match (`build/epic-recheck-2026-07-31/SCHEDULE-EPIC-DELTA.md`, Rule-37 Tier-1 check) | 2026-07-31 | **CURRENT** |
| Designs | Claude prototype `Schedule.dc.html` (authoritative per Branko Q0) + `design-2026-07-27/`; header also links "Business and Tech hours settings" | No Figma file for Schedule; **no Rule-35 fetch queue open for this project** | 2026-07-31 | **CURRENT** (spec-first project — the prototype is a reference, and per today's contradiction X7 prototype strings are **not** quoted as build labels) |
| Engineering tech plan | Schedule tech plan (`build/schedule/tech-plan-2026-07-29/`) | Ingested 2026-07-29/30; 13 tech-plan cases authored (`cases-H-tech-plan.json`) | 2026-07-31 | **CURRENT** |
| PO / stakeholder answers | Branko answers 2026-07-31 (`branko-answers-2026-07-31/answers-ingested.md`) — 6 answered, 1 declined; plus the TechPlan sheet NQ-1..NQ-5 | Latest PO input 2026-07-31 | 2026-07-31 | **CURRENT** (NQ-1..NQ-5 still unanswered — see §7) |
| Live build | — | **No QA branch / environment exists (OQ-3)** | 2026-07-31 | **NOT AVAILABLE** — nothing in this suite is build-verified; every case stays `VIU-Pending` (Rules 12/22). Coverage below is **spec-to-case** coverage, never a claim of verified behaviour. |

---

## 2. PHASE 1 — HOW EVERY REQUIREMENT WAS ENUMERATED (and how we know the parse is complete)

The Schedule PRD is **prose-heavy**: it does not use S#-R# numbering, so requirements were
enumerated as **atomic testable statements per section**, not just numbered items.

**Parse rules** (implemented in `tools/enumerate_reqs.py`, re-runnable):

1. Body = from the first `### 1. Overview` heading to end of file. Statements are attributed
   to the **deepest heading in force** (`### N.` section / `#### N.M` subsection).
2. Three unit kinds:
   * **BULLET** — each top-level `- ` item, with its continuation lines folded in (so a
     multi-sentence bullet stays ONE requirement, as the spec wrote it).
   * **TABLEROW** — each **data** row of every markdown table (header + separator skipped);
     cells joined, so "Double-booked — Two different work orders overlap…" is one statement.
   * **PROSE** — each **sentence** of every non-list, non-table paragraph, split on
     sentence-final punctuation followed by a capital/quote, with guards for `e.g.`, `i.e.`
     and decimals so "7.00" / "e.g." never split a statement.
3. Numbered list items (the §4.2 start-time hierarchy) are treated as bullets.

**Completeness proof (Rule 17):** the parser counts every non-blank body line it consumes and
compares against the file's non-blank body line count:

```
non-blank body lines: 242 | lines consumed: 242 | MATCH
units: 243
```

Every non-blank line of the spec body lands in exactly one unit, so **no statement was
skipped and none was double-counted** (243 > 242 because one prose paragraph holds two
sentences).

### Totals per section — 243 statements

| Section | # | Section | # | Section | # |
|---|---|---|---|---|---|
| §1 Overview | 2 | §4.7 Overlap / lanes | 5 | §8.2 Series | 3 |
| §1.1 Problem statement | 2 | §4.8 Day view | 8 | §9 View options | 12 |
| §1.2 Goals | 4 | §4.9 Shift detail modal | 11 | §10 Color system | 6 |
| §2 Personas | 4 | §4.10 Events | 11 | §11 Non-functional | 5 |
| §3 Information architecture | 2 | §4.11 Conflict detection | 10 | §12 Edge cases | 6 |
| §3.1 Sidebar | 10 | §4.12 Capacity | 7 | §13 Success metrics | 4 |
| §3.2 Grid | 10 | §4.13 Hover tooltips | 5 | §14 Roles and permissions | 3 |
| §4.1 Drag-and-drop | 7 | §5.1 WO filters | 8 | §14.1 Permission tiers | 12 |
| §4.2 Start times / hours | 15 | §5.2 Mini calendar | 3 | §14.2 WO sidebar dependency | 3 |
| §4.3 Scope picker | 6 | §6 Grid toolbar | 8 | §14.3 No "own only" | 3 |
| §4.4 Block anatomy | 7 | §7 Interactions | 6 | §14.4 Department-based rows | 3 |
| §4.5 Multi-day spread | 11 | §8.1 Key entities | 8 | §15 Future considerations | 6 |
| §4.6 Linked series | 7 | | | **TOTAL** | **243** |

(§4 "Core features" and §5 "Sidebar features" carry no direct body text — all their content
sits in the numbered subsections, which is why they hold 0 statements of their own.)

---

## 3. PHASE 2 — HOW EACH STATEMENT WAS MAPPED TO CASES

Two independent signals, so a **mistyped anchor cannot manufacture a false gap** and a
**correct anchor cannot manufacture false coverage**:

* **A — ANCHOR:** the case's `refs` / `spec_ref` cites the statement's section. All **164/164**
  active cases carry Rule-20 refs, repaired against v23 earlier today.
* **B — TEXT:** distinctive-word overlap between the statement and the case **body**
  (title + preconditions + steps + expected + notes), scored
  `|shared distinctive words| / |statement distinctive words|`.

Candidates were then **read by hand, section by section** — every statement against every
anchored case's actual **Expected** lines — because an anchor proves *citation*, not
*assertion*. Three further mechanical detectors backstopped the read:

1. `missing_words.py` — statements whose distinctive nouns appear **nowhere** in the
   164-case corpus (finds wholly-unasserted content).
2. `clause_check.py` — statements whose distinctive words are missing from **their own**
   candidate cases (finds "covered by the wrong case" and partially-asserted multi-clause rules).
3. A **spec-label sweep** — 50 exact on-screen labels/strings the spec pins ("Set business
   hours for this shop", "These hours overlap…", "Needs techs", "Select multiple",
   "Full estimate", "Until a date…", "returns 8h", "+2 more", "click-to-arm", …) checked for
   presence in at least one case. **49/50 present**; the one absence is cosmetic ("week 2 of"
   — SCH-SER-02 carries the spec's own generic form "week N of M").

---

## 4. PHASE 3 — THE RESULT

| Verdict | Count | % of 243 |
|---|---|---|
| **COVERED** — at least one case asserts it | **206** | 84.8% |
| **COVERED-FLAGGED** — covered, but the spec text conflicts with a higher-precedence ruling (§6) | **4** | 1.6% |
| **NOT-TESTABLE** — with the reason stated per item | **30** | 12.3% |
| **GAP — genuine, needs closing** | **3** | 1.2% |

**Covered = 210 of the 213 testable statements (98.6%).**

### The NOT-TESTABLE 30 — itemised, never hand-waved

| Group | # | Statements | Why not independently testable |
|---|---|---|---|
| Goals / problem statement / overview | 7 | R-1-01/02, R-1.1-01/02, R-1.2-01/02/03 | Statements of intent ("reduce scheduling errors to near zero", "replaces whiteboards"). The *mechanisms* they name are all covered (conflict detection → SCH-CONF-01..07; spread → SCH-SPREAD-*). **R-1.2-04 — the roster-sync goal — IS testable and IS covered** (SCH-DND-07). |
| Personas | 4 | R-2-01..04 | A table of who uses the module and what they need — no observable behaviour. Their needs map to covered features (department filtering → SCH-VIEW-02; own shifts + hours → SCH-VIEW-03 / SCH-VIEW-09). |
| Success metrics | 4 | R-13-01..04 | Post-launch analytics targets ("under 5% of shifts", "80% of active shops, 90 days post-launch") measured over a fleet, not in a test. |
| Future considerations | 6 | R-15-01..06 | Explicitly out of V1 (PTO, auto-scheduling, recurring events, skill matching, spread-around-bookings, long-job cap). Authoring here would be inventing scope. |
| Data-model internals | 7 | R-8.1-01/02/05/06/08, R-8.2-01/03 | Field names and internal ids (`sid`, `rowKey`, `blockDuration`, `seriesId`, "not a distinct persisted entity"). Each row's **observable** aspects are covered by named cases — listed per item in Appendix A. |
| Lead-in fragments | 2 | R-4.1-01 ("The primary interaction model."), R-4.2-12 ("Both use the same pattern:") | Sentence fragments introducing the bullets beneath, which carry the requirement. |

Conservative by instruction: **if a manual tester could observe it, it was called a gap, not
"untestable"**. That is why §11's non-functional bullets (performance, 960px responsiveness,
accessibility, undo timing, dark theme) are all **COVERED**, not dismissed — SCH-EDGE-02/03/04/08,
SCH-KEY-01/05, SCH-DEL-08/09.

### The 3 GAPS

| # | Statement | Verbatim text | Judgement | Closure |
|---|---|---|---|---|
| **G1** | **R-4.3-05** (§4.3) | "There is no technician cap and no swap flow." | **(a) genuine gap — PARTIAL.** "No technician cap" *is* covered (SCH-LINE-04 and SCH-SCOPE-01 both assert the avatar stack has "no cap"). **"No swap flow" is asserted nowhere:** no case observes that scheduling a **second** technician onto a line that **already has one** *adds* them alongside rather than replacing the incumbent or prompting to swap. A build that silently replaced the first technician would pass every one of the 164 cases. | **EXTEND SCH-DND-07** (C29962) — the roster-sync case is exactly where this observation belongs. |
| **G2** | **R-14.1-04** (§14.1) | "This is the experience for roles like Technician, Parts Manager, Parts Tech, Office, and Time Clock." | **(a) genuine gap.** Nothing asserts **which default roles sit at which Schedule tier**. The role names *Technician, Parts Manager, Parts Tech, Office, Time Clock* appear **nowhere** in the 164-case corpus. SCH-PERM-01..06 test the tiers **abstractly** ("a user whose role has Schedule: View"), so a shipped default that gave Technicians **Edit** would pass the whole permission set. | **NEW case SCH-PERM-13.** |
| **G3** | **R-14.1-08** (§14.1) | "This is the level for Service Manager, Senior Service Advisor, Service Advisor, and Foreman roles." | **(a) genuine gap** — the Edit half of the same missing mapping; *Service Manager, Senior Service Advisor, Service Advisor, Foreman* likewise appear nowhere in the corpus. | **Same case SCH-PERM-13** (one observable behaviour — the default tier mapping — so one case, not two; Rule 28 no-padding). |

**Honest read of the number.** 3 gaps out of 213 testable statements is a *low* yield compared
with Filters' ~26, and that is the expected shape rather than a thin hunt: Schedule was authored
**spec-first** (166 cases straight from the PRD, 2026-07-21), then had the **epic SV-8685**
backfill (2026-07-27, +10 cases), the **tech plan** pass (2026-07-30, +13 cases), the **v18→v23
diff** and the **Branko answers** applied — and this morning's authenticity pass repaired all
164 refs anchors against v23. Filters, by contrast, had drifted **8 spec versions** with new
requirements never ingested. The two gaps found here are both **v18-era omissions** — neither
came from the v19–v23 deltas — which is precisely the exposure this exercise existed to close.

---

## 5. PHASE 4 — REVERSE CHECK (cases pointing at requirements that do not exist)

* **Anchor validity: CLEAN.** Every `§`-anchor in all 164 active cases' `refs` / `spec_ref`
  resolves to a section that exists in v23. **0 dangling anchors** (this morning's pass
  repaired 2; none remain).
* **No case anchors into the "Removed upstream (v19–v23)" appendix.** All 8 removed clauses
  (R1–R8) were checked individually. The only mentions of removed text are **negative
  assertions or history notes**, which is correct:
  * modal *Reassign* → SCH-MODAL-08 asserts it is **absent**;
  * shift colour *tied to the work order* → SCH-COLOR-02 asserts **per-shift** colour;
  * spread *skips shop closures* → SCH-EDGE-05 / SCH-SPREAD-07 assert **not skipped in V1**;
  * series *breaks around booked days* → SCH-SER-01/02 mention it only in `notes` as the
    v18→v22 history;
  * right-click menu *{New Shift, New Event, View Day}* → SCH-REAS-03 and SCH-PERM-02 assert
    those items were **removed** and the menu is left-click *{Create Event, New Work Order}*.
* **Cases with no v23 PRD statement: 6, all explained** — SCH-REG-01/02/03/04, SCH-API-04,
  SCH-EDGE-07. These trace to the **engineering tech plan** (data migration, dashboard,
  WO-create scheduler, location resolution, NFR-001 location scoping, DST/clock-change), not to
  the PRD. Rule 20 is satisfied via their tech-plan anchors; they are extra coverage, not orphans.
* **158 of 164 active cases** are cited by at least one v23 statement; the other 6 are exactly
  those tech-plan cases.

---

## 6. FLAGGED — spec text that conflicts with a higher-precedence ruling (no case changed)

Each is **resolved by an explicit precedence rule with citations** — none was guessed, and none
changes a case. All three are **upstream tidies for Branko**.

| # | Statement | The conflict | Resolution (Rule 32 latest-wins / Rule 33 precedence) |
|---|---|---|---|
| **F1** | **R-12-03** (§12) | §12: shop closures "…**block the spread step** from placing shifts on those days". §4.5: "Shop closures and public holidays **are not skipped in V1**..". | §4.5's sentence is the **Confluence v22** edit; §12's is untouched **v18-era residue**. Latest-wins → **not skipped**, which is what **SCH-EDGE-05** asserts. **No case authored for either side** (per instruction). This is Branko's open question **NQ-1**; §12 needs the tidy. |
| **F2** | **R-4.9-06** (§4.9) | §4.9: the modal shows "the scheduled line(s) **with labor/total figures**". **SCH-MODAL-04** asserts **no money fields anywhere** in the modal. | **Rule 33 precedence: the PO ruling wins.** Branko's 2026-07-22 Q3 answer + the Claude design §4c + the tech plan's **D6/NFR-002 "no pricing in Schedule responses"** (independently asserted by **SCH-API-03**) all say no money. The §4.9 clause is stale prose. **No case change**; §4.9 flagged for tidy. |
| **F3** | **R-14.1-03, R-14.1-07** (§14.1) | §14.1 still lists a "**right-click** context menu" among the editing affordances, and Edit "including via right-click context menu". | Branko 2026-07-31: "**there is no right click, only left click**", and §4.10/§7 were rewritten to left-click in **v22**. **SCH-PERM-02 / SCH-PERM-04** already follow left-click. **No case change**; §14.1 flagged for tidy. |

Also confirmed still live from earlier passes: **Jira SV-8695 is stale** (its text still lists a
modal *Reassign* action that v23 deleted and Branko denied) — the ticket is the stale artefact,
not our case.

---

## 7. AMBIGUOUS / STOPPED ITEMS

**None encountered in Phases 1–4.** Every one of the 243 statements was classifiable, every
anchor resolved, and the three spec conflicts above each had an explicit ruling to resolve them
(they are recorded as flags, not guesses). Nothing was authored on a spec-silent point.

Still-unanswered PO/engineering questions (they block *new* assertions, not this pass):
**NQ-1** §12-vs-§4.5 closures · **NQ-2..NQ-5** incl. own-data **write** scoping (re-routed to
engineering; §14 is silent, so nothing may be asserted) · spec-silent S1–S6 in
`requirements.md`.

---

## 8. WHAT PHASE 5 AUTHORED

**1 new case + 1 extension**, closing all 3 gaps. See `AUTHORED.md` in this folder.

Appendix A (`APPENDIX-A-full-matrix.md`) carries the **complete 243-statement matrix** —
every statement verbatim, its verdict, and the case(s) that assert it.

# CANDIDATES — cases with no source, classified — 2026-08-11

**Survey only. Nothing was deleted, nothing was edited. 0 `delete_case`, 0 `update_case`, 0 Jira writes.**

**The ruling this answers (QA lead, 2026-08-11, verbatim):**
> "And there should not be a case for which we do not have a source. A case should only exists IF there
> is a source for that. Otherwise the case should be deleted, but before deleting the case check if that
> case has 'Automated' marker"

**Population: 764 cases of ours** (Filters 114 · Schedule 174 · Report Suite 476). Live totals 119 / 174 /
488; the 17-case difference is foreign work by Ahtasham Amjad and Vladimir Tomovic, excluded and
untouched (Rule 38).

---

## 🟢 THE HEADLINE: class (a) is EMPTY

# **0 of 764 cases are UNSOURCEABLE. Nothing is proposed for deletion.**

Every one of the 764 cites a real Jira ticket **and** a real, currently-existing source. There is no case
in these three projects that asserts something no document supports and has nothing else to fall back on.
**That is the outcome the source-accuracy passes were for, and it is worth saying plainly rather than
hunting for something to put in the column.**

What the survey *did* find is **two cases resting on a requirement that does not say what they assert**
— both already open with the product owner — and **a set of recording defects** where a real source
exists but is not written down accurately.

| Class | What it means | Remedy | Count |
|---|---|---|---|
| **(a) UNSOURCEABLE** | No document supports it, anywhere | deletion candidate | **0** |
| **(b) TRACEABILITY GAP** | Source exists, not recorded correctly | find and record it | **6 named + 377 stale pins** |
| **(c) OPEN WITH THE PO** | Source question genuinely unanswered | **hold, do not delete** | **13** |

---

# (a) UNSOURCEABLE — deletion candidates

## **None.**

No case reached this class. Two came close — **C29600** and **C29632** — and both were placed in class
(c) instead, because the question behind them is **live with Branko** and an answer would source them.
**Deleting a case that is one PO sentence away from being sourced would destroy real coverage**, which is
precisely the distinction the brief drew.

---

# (c) OPEN WITH THE PO — hold, do not delete (13)

## C-1 · The cross-filter combination gap — the sharpest finding, and it is **two** cases, not one

### 1. FLT-COMBO (C29600) — [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) · Filters · **`atmstatus = 3` AUTOMATED** · **no automation marker at all** · **no provenance line at all**

**What it asserts:** ticking a Status and picking a Customer shows **only** the work orders matching
**both** — i.e. two different filters combine as an intersection.

**What its `refs` claims:** `SV-8793 (§2 Feature Overview (multi-criteria); S8-R3 ('combination of active
filters')) [spec v19 2026-08-06]`

**What `S8-R3` actually says**, verbatim from live Filters v19:
> "When the combination of active filters and any active search query produces **no matching records**,
> the table shows an **empty state** with a message indicating no results were found…"

**S8-R3 is the empty-state requirement.** It mentions "combination of active filters" only to say what
happens when the combination matches *nothing*. It does not say how two filters combine.

**Where I looked and what I found** — live Filters v19, searched for `intersect`, `combination`,
`combine`, `both`, `together`, `AND`, `narrow`, `cumulative`, `match all`, `all selected filters`:
- `S2-R2` — "matching **any** of the selected statuses" → OR **within** one filter
- `S3-R6` — "belonging to **any** of the selected customers" → OR **within** one filter
- `S2-R7` — Imported **cannot** be combined with anything else → one specific exclusion
- `S13-R10` — search "works **additively** with the filter bar: a query narrows within the active filters"
- `§2 Feature Overview` — describes the bar and calls it "multi-criteria"; states no combination rule

**The telling asymmetry: the spec states how *search* combines with *filters*, and never states how two
*filters* combine with each other.** That reads like an oversight in the PRD, not a deliberate silence —
which is exactly why it is Branko's to answer rather than ours to delete.

**Corroboration that the anchor is being borrowed:** [C29606](https://shopview.testrail.io/index.php?/cases/view/29606)
cites the same `S8-R3` **and is the correct user of it** — it *is* the empty-state case. Two cases, one
anchor, only one of them supported by it.

**Automation status: `atmstatus = 3` — AUTOMATED.** Under the QA lead's own precondition this alone
takes it off any deletion list: Vlad's suite may already depend on it.

**Recommendation: HOLD.** Add to Branko's next question sheet: *"When someone picks a status and a
customer at the same time, should the list show only the work orders that match both?"* On his answer
the case becomes sourced in one edit. **Separately it needs a provenance line and an automation marker —
it is the only case in all three projects missing both.**

### 2. FLT-COMBO-API (C29632) — [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) · Filters · `atmstatus = 1` · `AUTOMATION: READY`

**NEW — not previously known. This is the API sibling of C29600 and it has the same gap.**

**What it asserts:** *"A combined multi-filter request returns only work orders matching all filters"* —
and its Expected Result states both halves explicitly: *"the customer filter and status filter **both
restrict** the result, while the two statuses combine as either-or."*

**What its `refs` claims:** `SV-8785 [epic] (S2-R2; S3-R6; S8-R3 (backend view)) [spec v19 2026-08-06]`

**Split by assertion (Rule 45(e)) — one row per assertion, because they land differently:**

| Assertion | Cited | Verdict |
|---|---|---|
| Two **statuses** combine as either-or | `S2-R2` "matching **any** of the selected statuses" | ✅ **SOURCED, verbatim** |
| The **customer and status** filters both restrict | `S8-R3` (empty state) | ❌ **NOT SOURCED — same gap as C29600** |

**Recommendation: HOLD, and add it to the same Branko question.** One answer sources both cases. It is
**not** currently on Branko's sheet — C29600 is; **this one was missed**, and it is `READY` rather than
`HOLD`, so it would go to automation asserting an unstated rule.

## C-2 · The Status-chip pair — spec text vs a PO ruling, already disclosed and already held (2)

| Case | Link | Automation | State |
|---|---|---|---|
| FLT-TAB-02 (C29609) | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | `atm=1` · HOLD | Estimates tab |
| FLT-TAB-03 (C29610) | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | `atm=1` · HOLD | Completed tab |

Both assert the Status chip is **greyed out and pre-filled**; live `S9-R2`/`S9-R3` say it is **hidden**.
**This is not an unsourced case — it is a disclosed conflict, handled correctly.** Their `refs` now reads:
> "…Branko Round-1 Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = chip shown greyed-out/pre-filled; **the
> PRD text saying 'hidden' is unchanged since v4 2026-05-14**"

They cite the ruling, date it, name the divergence, pin when the spec text last moved, and sit on
`AUTOMATION: HOLD - waiting on Branko`. **Recommendation: no action. Recorded here so nobody re-opens
them as unsourced** — and noted as evidence the Rule-31-trap-(c) repair described in CLAUDE.md landed.

## C-3 · Sourced by a tech plan only — held on the OPEN Rule 30 / Rule 57 authority question (9)

These cite a **real, verified tech-plan item** and honestly say the spec has no requirement for it. They
are **sourced** — a tech plan is on Rule 57's authoritative list at (d3). What is **open** is whether a
technical design can carry a product expectation alone, which **Rule 57 records as an outstanding
question to the QA lead and expressly does not answer.**

| Case | Link | Project | Automation | Cited tech-plan item | Verified in file |
|---|---|---|---|---|---|
| C38865 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | Schedule | **`atm=3` AUTOMATED** · READY | `NFR-005` DST | ✅ |
| C38867 | [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Schedule | **`atm=3` AUTOMATED** · HOLD | `FR-015` data migration | ✅ |
| C38868 | [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Schedule | **`atm=3` AUTOMATED** · HOLD | `FR-016` Dashboard | ✅ |
| C38869 | [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | Schedule | **`atm=3` AUTOMATED** · HOLD | `AppointmentScheduler` | ✅ |
| C38870 | [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | Schedule | **`atm=3` AUTOMATED** · READY | WO-primary location resolution | ✅ |
| C38871 | [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Schedule | **`atm=3` AUTOMATED** · HOLD | `FR-P4` WO priority | ✅ |
| C38875 | [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | Schedule | **`atm=3` AUTOMATED** · READY | `NFR-001` location scoping | ✅ |
| C38881 | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Filters | `atm=1` · HOLD | `s4-3.3` storage→preference migration | ✅ |
| C38925 | [C38925](https://shopview.testrail.io/index.php?/cases/view/38925) | Report Suite (PV) | `atm=1` · READY | Phase 0 / PR-1 D2 (QuickBooks) | ✅ |

**Every cited item id was found by direct search in the named file.** **Seven of the nine are flagged
Automated**, so the QA lead's precondition bites hardest here.

**Recommendation: HOLD all nine, and settle the one question that governs them all** — does a technical
design carry PRD-level authority on product behaviour, or does Rule 30's "informs but never overrules"
still hold? **One answer resolves nine cases.** C38881 already says "confirmation requested" in its own
`refs`. **Do not delete any of them: they are sourced; only the weight of that source is in doubt.**

---

# (b) TRACEABILITY GAP — the source exists; the recording is wrong (6 named + 377 pins)

**Deleting any of these would throw away real coverage.** Each needs a recording fix, not a decision.

### B-1 · Provenance line credits the spec while the `refs` admits the spec is silent (3)

The tester-facing line names the specification as the source; the `refs` beside it says the spec is
silent and names the **tech plan** as the real source. **Rule 54 requires sentence 1 to name the source
that actually supports the expectation** — as written these lines manufacture authority the spec does not
give.

| Case | Link | Provenance says | `refs` admits | Automation |
|---|---|---|---|---|
| C38885 | [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) | "…Parts Velocity specification version 5 (Story 6 exports)" | "spec **silent on a cap**; tech-plan A3/FR-F4… locked by Chris 2026-07-21" | `atm=1` · READY - EXPECT FAIL (SV-8818) |
| C43547 | [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) | "…Parts Velocity specification version 5 (Story 6 exports)" | "the spec **is silent** on a renderer size limit" | `atm=1` · READY - EXPECT FAIL (SV-8818) |
| C38890 | [C38890](https://shopview.testrail.io/index.php?/cases/view/38890) | "…Work In Progress specification version 10 (S4-R15)" | "**spec silent on running clocks**; tech-plan B1.2 open-clock policy" | `atm=1` · READY |

**Note C38890 is only half-affected:** `S4-R15` genuinely sources the *"capped at the quote"* half —
verbatim *"never more than the full quoted value"*. Only the *running clock* half rests on the tech plan.

**Recommendation: rewrite the provenance line on all three to name the tech plan (and, for C38885, Chris
Ward's 2026-07-21 lock) alongside the spec.** No coverage changes; the line simply stops over-claiming.

### B-2 · `refs` says a spec edit is owed — Chris has since made it (1)

**C30603** — [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) · IV · `atm=1` ·
`AUTOMATION: HOLD - needs a second sign-in`

Its `refs` says *"the IV prerequisite **still names the inventory-reports permission** — his spec edit
owed."* **Live IV v5 Story 1 Prerequisites now reads**, verbatim:
> "The user must have the **single reports permission** — the one permission that grants access to all
> reports; there is **no per-report permission**."

**The edit has been made** (IV moved v4 → v5). **The case is now better sourced than its own `refs`
claims.** Recommendation: re-stamp `refs` and provenance to IV v5 and drop the "owed" clause.

### B-3 · Cases carrying no automation marker (3)

Not a sourcing gap, but a recorded defect against the QA lead's own marker convention, and it is the
same three cases every time.

| Case | Link | Project | `atmstatus` | Note |
|---|---|---|---|---|
| **C29600** | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Filters | **3 — Automated** | also missing its provenance line; also class (c) |
| C30169 | [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) | Report Suite (SBC) | 1 | already recorded in commit `55bccd34` |
| C30288 | [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) | Report Suite (SBR) | 1 | not previously recorded here |

### B-4 · 377 stale provenance version pins

Full table in `SOURCE-CURRENCY.md`. **SBC 86 · SBR 76 · PV 70 · WIP 77 · IV 68 = 377 of 764**; Filters,
Schedule and TU are **fully current at 0**.

**This is a stale *pin*, not a wrong *case*.** Per Rule 31 trap (c), a page moving says nothing about
whether the cited requirement moved — establishing that needs a per-requirement diff, which this survey
did not do. It is listed because a version pin is only worth something if it is the right version
(Rule 42). A worker is live on source accuracy for the three handed-off reports.

---

# Cases examined and found properly sourced — recorded so they are not re-raised

**The ten Filters Parts/Reports cases** — C38876, C38882, C38904, C38905, C38906, C38907, C38908,
C38909, C38910, C38911, C43562 — all show **coverage 0.00** against numbered requirements and are
**correctly sourced anyway**: they cite spec **prose** (`§2 Feature Overview → Parts Filters`,
`§4 Key Decisions → "Context-specific filter sets on Parts and Reports"`, `"Multi-select where it makes
sense"`, `"New date-range filter type"` — **all five verified present in live v19**), Branko's answer
files (**all folders verified on disk**), Figma nodes and the tech plan. Their provenance lines already
say in plain words that the spec has no numbered requirement and name what they rest on instead. **This
is Rule 54's honesty clause working exactly as intended, and it is why a low overlap score is a triage
signal and never a verdict.**

**C43554** — [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) · Schedule ·
**`atm=3` Automated** — cites no spec anchor because the Schedule spec is silent on the default view. It
cites **story SV-8686's acceptance criterion**, read live and quoted verbatim in `SOURCE-CURRENCY.md`:
*"the grid displays with day view as default"*. **An epic story is a source (Rule 57(b)). Properly
sourced.**

**C38909** — the one case my tooling flagged as citing a non-existent `§8`. **The tool was wrong**: the
`§3+§8` refers to the engineering handover, not the spec. Recorded in `METHOD.md`.

---

# What I need from the QA lead

1. **Nothing to authorise for deletion — class (a) is empty.** No `delete_case` list is being put to you.
2. **One question for Branko unblocks two cases** (C29600, C29632): *when someone picks a status and a
   customer at the same time, should the list show only work orders matching both?* **C29632 is not
   currently on his sheet and should be added.**
3. **One ruling from you unblocks nine** (C-3): does a technical design carry PRD-level authority on
   product behaviour, or does Rule 30's "informs but never overrules" still hold? **Seven of the nine are
   flagged Automated.**
4. **Six recording fixes are ready to execute on your go-ahead** (B-1 ×3, B-2 ×1, B-3 markers ×3, minus
   overlap) — all `update_case`, no coverage change. **Not executed: this pass is read-only.**
5. **Note for whoever acts on the "Automated" precondition:** the text marker and the TestRail field
   disagree. **`custom_atmstatus = 3` is the real Automated flag; 75 of our 764 carry it**, and C29600 is
   one of them while carrying no text marker at all.

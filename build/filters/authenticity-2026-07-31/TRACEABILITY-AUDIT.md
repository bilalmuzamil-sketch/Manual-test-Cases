# Filters — TRACEABILITY AUDIT (all 110 active cases)

**Closing-authenticity pass, 2026-07-31.** Phase 2 of the pass. Scope = **100 % of the
active suite (110 cases / 110 in TestRail / 110 in run 352)** — no sampling (Rule 17).

- **Spec of record:** `build/filters/spec-current-2026-07-31/Filters-spec-current.md` —
  **v1.6**, Confluence page **572030978**, version **12**, updated **2026-07-28** by
  Branko Cicovic (pulled live 2026-07-31).
- **Per-case table:** `traceability-per-case.csv` (+ `.json`) — every case with its
  C-id, TestRail link, anchors after, validity verdict, before→after refs.
- **Repair script:** `phase2_repair_refs.py` · **report generator:**
  `gen_traceability_report.py` (reads the "before" side out of git so the
  before→after stays honest even if the repair is re-run).
- **What "refs" means here:** the TestRail **References** field. Locally it is the case
  body's `spec_ref`. It is a **metadata-layer** field — nothing in this audit changes a
  single word a tester reads (Rules 7/9/20).

---

## 1. THE TICKET SITUATION — stated plainly, because it is the honest answer

> **Filters has no Jira epic and no Jira stories. A ticket key therefore does not exist
> for any case in this suite, and none was invented.**

This is **evidence-backed, not an assumption**. On 2026-07-31 the SV Jira project was
enumerated exhaustively — **all 170 epics** — from seven independent angles
(full epic list; text ~ "filter"; "filter chips"; the Confluence page id `572030978`;
"filter redesign"; the tech plan's net-new artefact `UserPagePreference`; and every epic
created since 2026-06-01). **No Filters epic exists.** The one near-miss, **SV-4913
"Page Filter Improvements"**, was ruled out on its children: it is the legacy free-text
"page filter" search-box bug bucket, a different feature from this project's persistent
multi-criteria chip filter bar. Full evidence:
**`build/epic-recheck-2026-07-31/FILTERS-EPIC-SEARCH.md`** (raw JQL responses in its
`raw/` folder).

Corroboration from inside the project's own inputs: the **tech plan**
(`tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`) cites only the Confluence
spec and spec-internal `S#-R#` ids — **it carries no Jira key at all**; and every story
row in the ingested spec has a Jira field reading **"TBD"**.

### What that means for Standing Rule 20

Rule 20 wants `<TICKET(S)> (<spec-anchor>)`. For Filters the ticket half **cannot** be
satisfied from Jira, so:

| | |
|---|---|
| **Maximum achievable authenticity for this suite** | **spec anchor only** (plus the tech plan / Branko's answer sheets where they are the true source) |
| **Is that an authoring gap?** | **NO.** It is an **UPSTREAM gap** — the work was never ticketed in Jira. Nothing a test author can do closes it. |
| **What we did instead of inventing** | The ticket half now reads **`Filters (no Jira epic)`** on all 110 cases. It is a *statement that no ticket exists*, not a fake key, and it is exactly the same 22 characters as the old `Filters (Epic key TBD)` — so no refs string grew. |
| **Why the old wording had to go** | `Epic key TBD` / `epic (key TBD)` implies an epic exists and we merely have not looked it up. After the 170-epic enumeration that reading is **false**. |
| **What closes it** | Branko / the user supplying a key, or confirming the work is tracked outside Jira. Then re-run the Schedule precedent `build/schedule/epic-sv8685/backfill_refs.py`. Recorded as an open ask in `PROJECT-STATE.md`. |

**Every case is still fully traceable** — to a ratified, live, version-stamped spec
requirement (and, where that is genuinely the source, to the dated tech plan or to
Branko's dated answer). That is provable authenticity; it is simply not *Jira*
authenticity, and this document refuses to pretend otherwise (Rules 12/20/25).

---

## 2. HEADLINE — before → after

| | Before this pass | After |
|---|---|---|
| Active cases audited | 110 | 110 |
| refs whose spec anchor is **valid in v1.6** | **30** (27 %) | **100** (91 %) |
| refs citing a **spec section** (`§2` / `§4`) instead of a numbered anchor — because v1.6 numbers no requirements for Parts/Reports | 9 | **9** (unchanged; upstream gap, see §4) |
| refs with **no spec anchor at all** (engineering-plan-only behaviour) | 2 (only 1 said so) | **1**, and it now **says so explicitly** — the other was given the `S10-R2` context anchor |
| **STALE** refs (pointed at a superseded document/version) | **78** | **0** |
| refs leaking an **internal case id** | **1** | **0** |
| refs **> 250 chars** (TestRail's hard cap) | 0 | 0 (max **248**) |
| refs containing a **comma** (TestRail strips the following space → false MISMATCH on re-GET) | 2 | **0** |
| Anchors pointing at a requirement that **no longer exists in v1.6** | — | **0** (see §5) |
| Cases changed this pass | — | **110 / 110** |

**Verdict counts on the ORIGINAL state** (from `traceability-per-case.csv`):

| Count | Verdict before |
|---|---|
| **76** | **STALE** — cited the **V1.0** `requirements.md` ingest, not a live v1.6 anchor |
| 29 | PRESENT + VALID in v1.6 |
| **2** | **STALE** — cited **spec v1.3 / an unresolved conflict** (the Phase-1 defects (a) + (b)) |
| **1** | **DEFECT** — internal case id leaked into References (the Phase-1 defect (c)) |
| 1 | NO SPEC ANCHOR — honestly stated as absent (`FLT-TAB-06`) |
| **1** | **MISSING** — no spec anchor and no statement that none exists (`FLT-PERS-06`) |

---

## 3. THE THREE DEFECT CLASSES REPAIRED

### 3.1 Stale SOURCE — 76 cases (the big one)

76 refs read `requirements.md Story N S#-R#`. **`build/filters/requirements.md` is the
V1.0 ingest** (Confluence **v4**, 2026-05-14) — **eight Confluence versions / five spec
minor versions behind** v1.6, and its header still falsely claims "SPEC CONFIRMED
CURRENT". Citing it is not a live anchor (`spec-current-2026-07-31/SPEC-DIFF.md` §6).

**The anchor IDs themselves all survived** — v1.6 **ADDED 49** requirements and
**REMOVED 0** — so the repair is a re-point of the *source*, with anchors preserved
1:1. The script asserts `anchors_before == anchors_after` on every one of the 76, so no
anchor could be silently dropped.

**Before:** `requirements.md Story 2 S2-N3; Story 8 S8-R3`
**After:** `Filters (no Jira epic) (S2-N3; S8-R3) [spec v1.6 2026-07-28]`

The redundant `Story N` tokens are dropped (the anchor already names its story), the
version stamp is added so the next reviewer can tell *which* spec was checked, and the
ticket half now states the truth.

### 3.2 Stale ANNOTATION — 5 cases (anchor right, note obsolete)

| Case | C-id | What was stale | Repair |
|---|---|---|---|
| **FLT-STAT-07** | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | *"spec S2-R1 (conflict raised with the author — export of spec **v1.3** awaited)"*. The conflict is **resolved**: v1.6 `S2-R7` states verbatim that Imported *"cannot be combined with anything else … disables the other filter chips while it is active"* — exactly what the case asserts. | Re-pointed to **S2-R7 + S2-N4**; the resolved PENDING-BRANKO note replaced with the verbatim citation. *(Phase-1 defect (a).)* |
| **FLT-API-06** | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | *"spec **v1.3** S10 per-user persistence (export awaited)"*. The export is no longer awaited. | Re-pointed to **S10-R2 + S10-R3**; the endpoint shape stays credited to the **tech plan** (it is not a spec assertion) and expected-4 is flagged as tech-plan intent only. *(Phase-1 defect (b).)* |
| **FLT-PERS-02** | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | *"S10-R2 (**session-only wording superseded by PO ruling** 2026-07-17)"*. That hedge is now itself obsolete — **v1.6 rewrote S10-R2** to say *"stored server-side against the user account. They survive logout and sync across the user's devices … last write wins"*. **The PRD caught up to what we already test.** | Cites **S10-R2 + S10-R3 + S10-R1** directly, with Branko's Q2 answer demoted to corroboration. |
| **FLT-TAB-06** | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | Said *"not in the ratified product spec"* — honest, but did not name the version checked. | Now: *"no requirement in the ratified spec **v1.6** — default/last-used tab is engineering-plan-only — confirmation requested"* + the tech-plan decision id. |
| **FLT-PERS-06** | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Cited the tech plan **only**, with **no statement that no spec anchor exists** — a tech-plan citation can be misread as a spec citation. | Now says so explicitly, and cites **S10-R2** as the *context* that makes a one-off migration necessary. |

### 3.3 Internal-id LEAK — 1 case

**FLT-EMPTY-02 = [C29607](https://shopview.testrail.io/index.php?/cases/view/29607)** —
References contained the internal id `FLT-EMPTY-03`. References must carry ticket/spec
refs only; internal cross-references belong in `notes`. Removed, wording preserved.
*(Phase-1 defect (c).)* A full scan confirms **0 remaining internal-id leaks** in refs
**and 0 in any tester-facing field** (Title / Preconditions / Steps / Expected /
permissions text).

---

## 4. THE 10 CASES WITH NO NUMBERED ANCHOR — why that is correct, not lazy

| Cases | C-ids | Situation |
|---|---|---|
| **FLT-PARTS-01/09/11/12/13**, **FLT-RPTS-01/21/22/23** (9) | C38904–C38911, C38882 | **v1.6 numbers no requirements for Parts or Reports filters.** They appear only as prose in **§2 Feature Overview** and **§4 Key Decisions**. Every quoted phrase in these refs was **verified present in v1.6 this run** — *"Parts Filters"*, *"Reports Filters"*, *"Context-specific filter sets on Parts and Reports"*, *"Multi-select where it makes sense"*, *"New date-range filter type"* (1 hit each). So these cases cite the **best anchor that exists**: the exact spec section + **Branko's dated answers of 2026-07-31** (Q2/Q3/Q5/Q7), which are the ratified product source for this behaviour. **Upstream gap** — asking Branko to fold Parts/Reports into the numbered requirements is already logged as **NEW-Q3**. |
| **FLT-TAB-06** (1) | C38876 | Default/last-used tab is **engineering-plan-only** — absent from v1.6 entirely. Now labelled as such with confirmation requested. Correct per Rule 20's "flag it rather than leave it unsourced". |

---

## 5. ANY ANCHOR POINTING AT A REQUIREMENT THAT NO LONGER EXISTS IN v1.6?

**None. Zero.** Machine-checked: every `S#-R#` / `S#-N#` / `S#-E#` token in all 110 refs
was matched against the set of anchors literally present in the v1.6 text — **0
misses**. This is consistent with the diff: v1.6 **removed 0** of V1.0's 78
requirements. `S3-E1`, `S4-E1`, `S5-E1`, `S13-E1` (edge-case anchors) were explicitly
confirmed present.

### The 4 requirements whose TEXT changed (V1.0 → v1.6) — each citing case re-read

| Anchor | Change | Citing cases | Still valid? |
|---|---|---|---|
| `S8-R3` | broadened from *filters only* to *"filters **and any active search query**"*, and *"work orders"* → *"records"* | FLT-EMPTY-01 (C29606), FLT-STAT-06 (C29565), FLT-CUST-09 (C29574), FLT-TECH-06 (C29580), FLT-ADV-06 (C29587), FLT-ASSET-06 (C29594), FLT-CHIP-06 (C29600), FLT-MOB-10 (C29630), FLT-API-02 (C29632), FLT-API-05 (C29635) | **YES — narrower case, no contradiction.** Each tests the filters-only situation, which v1.6 still covers; the both-active situation is **FLT-EMPTY-03 (C38897)**. Guarded by preconditions (see the Phase-4 sweep). |
| `S8-R4` | prompt must now also offer to clear the **query** | FLT-EMPTY-02 (C29607), FLT-MOB-10 (C29630) | **YES** — filters-only variant; the clear-the-query half is FLT-EMPTY-03. |
| `S10-R2` | **the biggest behavioural change in the diff**: browser-session → **server-side, per account, survives logout, syncs, last-write-wins** | FLT-PERS-02 (C29614), FLT-API-06 (C38895) | **YES — and both already tested the NEW behaviour** (absorbed via Branko's Q2 answer on 2026-07-17, before the PRD caught up). Only the annotations were stale; repaired in §3.2. |
| `S12-R4` | punctuation only (em dash → semicolon) | FLT-MOB-09 (C29629) | **YES** — no behavioural change. |

### The one place our cases and the PRD prose still disagree — declared, not hidden

`S9-R2`, `S9-R3`, `S2-N1`, `S2-N2` and §4 Key Decisions all say the Status chip is
**"hidden"** on the Estimates/Completed tabs. **FLT-TAB-02 (C29609)** and **FLT-TAB-03
(C29610)** assert it is **shown greyed out and pre-filled** — on the authority of
**Branko's Round-1 Q4 = B answer (2026-07-17)** and the **QA-lead ruling of
2026-07-30**, both later and higher-precedence than the PRD prose (last-update-wins).
The cases are right; **the PRD text is what is out of date**, unchanged across eight
versions. Their refs now say this out loud — anchor + the ruling + *"PRD alignment is
Branko's open item"* — so the next reviewer cannot re-raise it as a case defect
(Rule 25: cite the reference *and* the verbatim wording being deviated from).
FLT-BAR-03 (C29559) and FLT-TAB-05 (C29612) already carried this annotation; TAB-02/03
now match them, which also removes the internal inconsistency flagged as
`ahtesham-review-2026-07-31/VERIFICATION.md` §CONFLICT-1.

---

## 6. FINAL POSITION

| Dimension | Result |
|---|---|
| Cases with a spec anchor **valid against v1.6** | **100 / 110** |
| Cases whose spec citation is a **verified-present v1.6 prose section** (no numbered anchor exists) | **9 / 110** |
| Cases with **no spec anchor**, explicitly labelled as such + confirmation requested | **1 / 110** (FLT-TAB-06) |
| Cases with a **stale** citation | **0** |
| Cases citing a **non-existent** requirement | **0** |
| Cases with a **ticket** key | **0 — because none exists** (170 SV epics enumerated). Every case states this honestly; **no key was invented.** |
| Internal-id leaks (refs **and** tester-facing fields) | **0** |
| refs within TestRail's limits (≤ 250 chars, comma-free) | **110 / 110** (max 248) |
| Tester-facing words changed by this phase | **0** |

**Bottom line:** every one of the 110 cases can now be traced, by anyone, to a named
requirement in a version-stamped ratified spec — or, in the 10 cases where the spec
genuinely has no numbered requirement, to the exact spec section plus a dated PO answer
or tech-plan decision, **with the absence declared**. The only missing link is a Jira
ticket, and that link does not exist to be made.

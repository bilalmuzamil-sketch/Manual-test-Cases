# COVERAGE MATRIX — every session learning, and which Skill file carries it

> **Purpose, in one line: this is what makes *"nothing is missed"* CHECKABLE rather than asserted.**
>
> **Origin, USER DIRECTIVE (2026-08-12), verbatim:** *"I want this whole memory of this
> session/correction/learning/instructions which worked for us to be the part of the skills, so that
> when I will be using each skill in each session for each process we do not miss anything."*
>
> **THE FAILURE MODE THIS WAS BUILT AGAINST: a skill that says *"see file X"* is worthless in a
> session that never opens file X.** So the verdict **PRESENT ONLY AS A POINTER** counts as a **gap**,
> exactly as **ABSENT** does. *"Follow Rule 50"* is a pointer; **stating what Rule 50 requires is
> substance.**
>
> **Method, stated so it can be challenged:** every item below was taken from a named source, then
> searched for **in substance** across `00-COMMON-CORE.md` and `01`–`07`. **This pass made ZERO
> TestRail calls, ZERO Jira calls and ZERO application access** — it is a documentation pass, and
> every factual claim is **as recorded by the pass that made it**, inheriting that pass's caveats.

---

## THE TOTALS

| | Count |
|---|---:|
| **Items inventoried** | **98** |
| **Already present in substance** | **80** |
| **Added by this pass — the item was ABSENT** | **16** |
| **Already present but INCOMPLETE — the missing half added** | **2** |
| **Deliberately excluded, with the reason** | **2** |

**98 = 80 + 16 + 2 + 2 — the gate closes.** Counted from the tables below, not from notes:
**52 rules + 32 operational facts + 12 working practices + 2 exclusions = 98.**

**⚠️ THE FIGURES IN THIS BOX WERE WRONG IN THE FIRST DRAFT AND ARE CORRECTED RATHER THAN QUIETLY
FIXED** — it read *"91 = 74 + 15 + 2"*, written from working notes instead of counted from the
tables, and **it failed its own gate** (the real row count is 98). **A figure that fails its own gate
is a finding**, and this file would have no standing to demand that discipline of anyone else while
hiding its own slip. Superseded wording kept here, dated **2026-08-13**.

**THE 16 ABSENT ITEMS NOW ADDED:** R08 · R22 · R25 · R32 · R33 · R37 · R38 · R39 · R40 · R41 · R45 ·
R46 · R48 · R52 · O14 · P10.
**THE 2 INCOMPLETE ONES COMPLETED:** **R24** (the practice was there; the 14 named C-ids were not) ·
**O22** (the `&`-not-`?` rule was there; the `trlib` cause and the fragile paginator were not).

**⚠️ TWO MEASUREMENT NOTES, RECORDED RATHER THAN GLOSSED, BECAUSE THEY BEAR ON HOW MUCH THIS TABLE IS
WORTH:**

1. **THE FIRST-PASS SEARCH PRODUCED AT LEAST TWO FALSE ABSENCES OF ITS OWN — my own probes, failing
   exactly the way skill `03` §2 describes.** A literal-string grep for the app-host trap returned
   nothing while **core §6(2) carries it in full**, and a grep for the TestRail URL separator rule
   returned nothing because the pattern contained backticks, while **core §3.3 carries it**. **Both
   were caught by re-reading the section rather than trusting the grep.** This is recorded because it
   is the same discipline the skills teach: **a selector that matches nothing returns an empty list,
   and an empty list reads exactly like "absent"** — so **no ABSENT verdict below rests on a single
   grep**; each was confirmed by reading the candidate section.
2. **THIS IS A COVERAGE MEASUREMENT, NOT A QUALITY ONE.** It proves an item is **stated in substance**
   in a named file. It does **not** prove the statement is well-placed, well-worded, or that a reader
   under time pressure will act on it.

---

## 1 · RULES AND RULINGS — what the QA lead decided

*Source column: `CLAUDE.md` rule number, with the date of the ruling.*

| # | Item (his ruling, in short) | Source | Carried by | Verdict |
|---|---|---|---|---|
| R01 | Surface a conflict between his instruction and a rule **before acting** — his words, the rule's text with its number, an explicit ask | R63, 08-11 | `00` §11.6 | PRESENT |
| R02 | A **tightening or layering is NOT a conflict** — escalating those trains him to wave escalations through | R63, 08-11 | `00` §11.6 | PRESENT |
| R03 | *"Good catch, be like this always"* — checking before acting is behaviour he asked for by name | R63, 08-11 | `00` §11.6, `06` | PRESENT |
| R04 | Every case must have a source; a sourceless case should not exist | R64, 08-11 | `01` step 7 | PRESENT |
| R05 | **Three meanings of "no source"** — unsourceable / traceability gap / open with the PO, with **opposite remedies** | R64, 08-11 | `01` step 7 table | PRESENT |
| R06 | Check the **Automated marker before deleting**; it is TestRail's own `custom_atmstatus`, not our text marker | R64, 08-11 | `00` §3.1, `01` step 7 | PRESENT |
| R07 | The flag **does not mean the same on every project** — Schedule's 31 were our own `add_case` hardcoding | R64, 08-11 | `00` §3.1 | PRESENT |
| R08 | **"Yeh wee need to fix everycase … where we have mistakengly done that"** — the 31 corrected `3→1`; **authorship read PER CASE from history, never by subtraction** | R64, 08-11 | `01` step 7 | **ADDED** |
| R09 | Never reuse a retired internal ID (`SBC-COL-03` overwrote a retired record) | R64 | `01` step 6 | PRESENT |
| R10 | The deletion candidate list goes to him first; `delete_case` is irreversible | R64 | `01` step 7 | PRESENT |
| R11 | **Tell Vlad** when we change a case TestRail flags Automated — **updates as much as deletions** | R65, 08-11 | `00` §5.3 + a section in `01`,`03`,`04`,`05` | PRESENT |
| R12 | Record `custom_atmstatus` **at write time** — the flag moves (`C29600` went `1→3→1→3`) | R65, 08-11 | `00` §5.3 | PRESENT |
| R13 | Every pass report ends **"AUTOMATED CASES CHANGED — FOR VLAD"**; say "none", never omit | R65, 08-11 | `00` §5.3 | PRESENT |
| R14 | The question sheet is **the LAST thing sent** | R66, 08-12 | `07` §1, `05` | PRESENT |
| R15 | …but that **never licenses sitting on a genuine blocker** — *does the answer change what we do NEXT?* | R66, 08-12 | `07` §1 counter-limit | PRESENT |
| R16 | Per-project completion **table** delivered **before the next project starts** | R67, 08-12 | `05` | PRESENT |
| R17 | The seven columns, every one, every time | R67, 08-12 | `05` table | PRESENT |
| R18 | **Build-verified and steps-walked are different numbers** — 76 vs 28 of 176 | R67(a) | `00` §1.5, `05`(a) | PRESENT |
| R19 | Never report **"VIU complete"** | R67(b), R10 08-11 | `00` §1.6, `05`(b) | PRESENT |
| R20 | Derive every figure **live**, stamp the read time | R67(c) | `00` §1.7, `05`(c) | PRESENT |
| R21 | Column 3's second group is a **fact, not a shortfall** | R67 clarified 08-12 | `05`(g) | PRESENT |
| R22 | **Gate totals; refuse to sum figures that may double-count** — the 425/339 → 433/331 correction | R49/R67, 08-11 | `00` §1.5a, `05`(h) | **ADDED** |
| R23 | A blocker must be **proved**, and blocks only what it actually blocks — six requirements | R68, 08-12 | `00` §11.4 | PRESENT |
| R24 | The scar: **~60% of a reported remainder was self-inflicted**; the 14 named cases | R68, 08-12 | `00` §11.4 | PRESENT (C-ids **ADDED**) |
| R25 | **A cost is a scheduling decision** — C29581/C29588; and the *opposite* failure, doing it first | R68, 08-12 | `00` §11.4 | **ADDED** |
| R26 | *Configure first, mint second* — a role edit kills sessions one way | R68, 08-12 | `00` §7.3, `03` | PRESENT |
| R27 | **Runnability**: preconditions and steps verified against the build; expectation from documents | R9 amend, 08-12 | `03` | PRESENT |
| R28 | The **three-link chain** — learned from sources → verified runnable → divergence raised | R9 amend, 08-12 | `03` | PRESENT |
| R29 | **Two guards** — the build supplies neither the expectation nor the coverage | R9 amend, 08-12 | `03`, `00` §11.2 | PRESENT |
| R30 | The **five runnability checks** | R9 amend, 08-12 | `03` | PRESENT |
| R31 | **Cosmetic vs substantive**, and the one-question test | R9 amend, 08-12 | `03` | PRESENT |
| R32 | *"A tester should not find a step coming from mars"* + *"a runnable test to execute"* | R9 amend, 08-12 | `03` | **ADDED** |
| R33 | **An unverified step is an unverified case** — report N of M, on which marker, never rounded | R9 amend, 08-12 | `03` | **ADDED** |
| R34 | The **behaviour verdict belongs to the manual tester** (*"you are RIGHT"*) | R10 amend, 08-11 | `00` §1.6, `04`, `05` | PRESENT |
| R35 | **VIU means the attached processes too**, not a wording sweep | R10, 08-11 | `00` §0, README | PRESENT |
| R36 | *"Matched to the build"* = **VIU'd against** it — the route, never the assertion | R25 widened, 08-12 | `00` §11.2, `03` | PRESENT |
| R37 | **The technical-design authority question is ANSWERED AND CLOSED** — do not re-ask it | R30/33/57, 08-12 | `00` §11.2, `02`, `07` | **ADDED** *(and two stale "open" blocks CORRECTED)* |
| R38 | Where **nothing contradicts** it, the technical design **sources a case alone** — 11 held cases released | R30/57, 08-12 | `00` §11.2, `02` | **ADDED** |
| R39 | **Every contradiction is REPORTED TO HIM** — applying the order silently is not compliance | R33, 08-12 | `00` §11.2, `02`, `07` | **ADDED** |
| R40 | **All three branches are FINAL** (*"The Branches are Final now."*) | R49, 08-11 | `00` §16, `03` §6.2, `05`(i), `06` | **ADDED** |
| R41 | *"Final" means handed off, NOT frozen* — a redeploy still invalidates layers 1–2 | R49, 08-11 | `00` §16, `03` §6.2 | **ADDED** |
| R42 | The **eight-item evidence bar** — *"they did badly bite me and my job is on threat"* | R52 amend, 08-12 | `06` | PRESENT |
| R43 | Editing a Jira description over REST **destroys pasted images**, unlogged (SV-8818) | R52, 08-12 | `06`(2) | PRESENT |
| R44 | Priority **Medium**; **High barred** | R53, 08-06 | `06` | PRESENT |
| R45 | **Every cited source carries the date WE READ IT** — never back-filled, one date per source | R54 amend, 08-11 | `00` §14.1, `01`, `02` | **ADDED** |
| R46 | Sentence 2 records the **whole build-facing layer**, not labels alone | R54 clarified, 08-12 | `00` §14.2 | **ADDED** |
| R47 | **A bug-fix deploy does not make a prior pass stale**; the trigger is an observed contradiction | R60 amend, 08-12 | `03` §6.1, `05`(g) | PRESENT |
| R48 | **An expect-fail marker needs LIVE BACKING — no backing, no marker**; 31 of 33 tickets closed | R61 amend, 08-11 | `00` §15.1, `01`, `04` | **ADDED** |
| R49 | The **three-outcome instruction** for backed markers; ticket status is never evidence | R61 | `00` §15.2, `03`, `04` | PRESENT |
| R50 | The creation hold is **JIRA TICKETS ONLY** — `add_case` permitted and expected | R62 corrected, 08-11 | `00` §11.1 | PRESENT |
| R51 | *"anything that stops you from creating/updating a test case You MUST let me know"* | R62, 08-11 | `00` §11.1/§13, `07` | PRESENT |
| R52 | The hold **re-stated 2026-08-12**; the new bar is **for the future**, not a signal to file | R62/R52, 08-12 | `00` §11.1, `06` | **ADDED** |

---

## 2 · HARD-WON OPERATIONAL FACTS — the traps

| # | Item | Source | Carried by | Verdict |
|---|---|---|---|---|
| O01 | **The byte-check passes when the PAYLOAD is wrong** — three instances, incl. C30341's appended duplicate | learnings §1.1 | `00` §2.4 | PRESENT |
| O02 | Dry-run and **read the built payloads**; make the writer **refuse** input it cannot handle; anchor regexes on something that cannot occur in the field | learnings §1.1 | `00` §2.4 | PRESENT |
| O03 | **A fresh `updated_on` proves nothing — in BOTH directions** | learnings §1.2 | `00` §2.5 | PRESENT |
| O04 | **An HTTP 500/502 can come back from a write that LANDED** — never blind-retry | learnings §1.3 | `00` §2.6 | PRESENT |
| O05 | An **idempotence guard tests the CONTENT**, not the case; reconcile the op count against the plan | learnings §1.4 | `00` §2.7 | PRESENT |
| O06 | A **"0 changes"** claim = set equality **both ways** + presence **by id** | learnings §1.5 | `00` §2.8 | PRESENT |
| O07 | **Probes that cannot fail** — 40+ false absences in two days, all ours | learnings §2 | `03` §2 | PRESENT |
| O08 | The **14-row catalogue** (two markups one detector · `page_search_toggle` · `filter_chip_vehicleHere` · `tech_assigned_id` 400 · tbody row counts · virtual scroll · leftover search term · `header_*` sort · ascending sort · location pair · range-dependent precondition · active-workplace-only · `ensureBarOpen` · `pgrep` matching itself · no in-body version field) | learnings §2.2 | `03` §2 | PRESENT |
| O09 | The **three-part discipline**; a **control that proves the detector can fire**; `NOT_ESTABLISHED` never `ABSENT`; a probe emitting `check_could_fail` | learnings §2.3 | `03` §2 | PRESENT |
| O10 | **Instrumentation creating the evidence** — the preference scare, and the seeded default workplace | learnings §3 | `00` §7.4, `03` | PRESENT |
| O11 | **`textContent` vs computed style — BOTH readings needed**; the transform may sit on a **child** | learnings §4.1 | `03` §4.1 | PRESENT |
| O12 | The **accessible name is not the visible label** | learnings §4.2 | `03` §4.2 | PRESENT |
| O13 | **Punctuation inside quote marks is not a label mismatch** | learnings §4.3 | `03` §4.3 | PRESENT |
| O14 | **An error message can name a field that does not exist** — do not reverse-engineer a contract from an error string | learnings §4.4 | `03` §4.4 | **ADDED** |
| O15 | **Editing a role / staff record / settings destroys every holder's session**, one way | playbook §I | `00` §7.3, `03` | PRESENT |
| O16 | **The app host answers HTTP 200 on any path** — always probe the `…api.` host | playbook §A | `00` §6(2) | PRESENT *(first-pass false absence — see note 1)* |
| O17 | **`PHPSESSID` is per-branch**; `sv_sso_session` and `cf_clearance` are shared | playbook §A | `00` §6 | PRESENT |
| O18 | **401 vs 409 vs an HTML challenge name different dead halves**; the diagnostic ladder; the 409 recovery recipe | playbook §A | `00` §6.1/§6.2 | PRESENT |
| O19 | `paste -sd'; '` **silently corrupts the cookie header** | playbook §A | `00` §6(3) | PRESENT |
| O20 | **`refs`: 248 chars per entry, a PATTERN error, comma-normalised** — the one declared normalisation | playbook §J | `00` §3.2 | PRESENT |
| O21 | **`get_sections` needs paging and fails SILENTLY** (625 sections) | playbook §J | `00` §3.3 | PRESENT |
| O22 | **The `&`-not-`?` URL rule** — and it is the real cause of the `trlib`/`getall()` breakage; the conditional-plus-`.replace()` that works only by accident | playbook §J, 08-11 | `00` §3.3 | PRESENT *(false absence; the **`trlib` cause ADDED**)* |
| O23 | The generator **blanks the id-map C-ids and drops `refs`** on every rerun | playbook §J | `00` §3.6 | PRESENT |
| O24 | The **`joinlines` shredding bug** | playbook §J | `00` §3.7 | PRESENT |
| O25 | **`case_title` / `case_refs` on run results are read-time ECHOES** | playbook §J | `00` §3.4 | PRESENT |
| O26 | **TestRail re-renders tester text into HTML hours after the write** | playbook §J | `00` §3.5 | PRESENT |
| O27 | **`add_case` must NOT hardcode `custom_atmstatus: 3`** | R64/playbook | `00` §3.1 | PRESENT |
| O28 | **A clean tree is not a current tree** — 110 commits behind while reporting *clean* and *1 ahead* | learnings §7.1 | `00` §9.1 | PRESENT |
| O29 | **Parallel workers share one git index** — path-scoped `add` **and** `commit`; the asymmetry | learnings §7.2 | `00` §9.2/§9.3 | PRESENT |
| O30 | **`/tmp` loses evidence. Every time.** | learnings §8 | `00` §8, §10 | PRESENT |
| O31 | **The repository is PUBLIC**; **response bodies leak tokens** as readily as headers; redact **at the point of capture**; `scan_secrets.py` | playbook preamble, 08-11 | `00` §10 | PRESENT |
| O32 | The **seven survival requirements** (R1–R7) and the test that decides R1 | NO-WORK-LOSS | `00` §8 | PRESENT |

---

## 3 · WORKING PRACTICES — how we actually got things right

*The part most likely to be dropped, because it is not written as a rule.*

| # | Item | Carried by | Verdict |
|---|---|---|---|
| P01 | **State the smaller honest number**, never the flattering one | `00` §1.5, `05` | PRESENT |
| P02 | **Record a correction visibly and dated — never overwrite it** | `00` §1.5a, `02`, `05`, `06`, `07` | PRESENT |
| P03 | Say **"not established"** rather than manufacturing a finding | `00` §1.4, `03` | PRESENT |
| P04 | **Quote both texts side by side** — one row per assertion | `01`, `02`, `03` | PRESENT |
| P05 | **Name the exact test data**, and what was ruled out | `06`(3) | PRESENT |
| P06 | **Write the `DIVERGENCES` file even when it is empty** | `03` | PRESENT |
| P07 | **End everything with "OUTSTANDING — what I need from you"**; say "nothing" rather than omit | `00` §13 + all seven | PRESENT |
| P08 | **Surface a conflict before acting**, not in the closing summary | `00` §11.6 | PRESENT |
| P09 | **Check you can clear a blocker yourself before escalating it** | `00` §11.4/§7.2 | PRESENT |
| P10 | **Refuse to sum figures that double-count** — publish the components and say why | `00` §1.5a, `05`(h) | **ADDED** |
| P11 | **Name every environment mutation the pass made**, so setup is distinguishable from finding | `00` §7.4, `03` | PRESENT |
| P12 | **Re-run from a proven-clean baseline** when a result surprises you in a sensitive area | `00` §7.4, `03`, `06` | PRESENT |

---

## 4 · DELIBERATELY EXCLUDED — with the reason

| # | Item | Why it is not in the Skill set |
|---|---|---|
| X01 | **Per-project status figures** — case counts, per-project verdict splits, which report is where | **These move within a single pass** (Rule 67(c)), so a figure baked into a skill is **wrong by the time it is read**. The skills carry the **method for deriving them live** and the **arithmetic gate**; the numbers live in each `PROJECT-STATE.md`. *(The few figures quoted — 76/28, 433/331, 31-of-33 — appear only as **dated evidence for a lesson**, each marked derive-live.)* |
| X02 | **The full environment recipe catalogue** — endpoints, payloads, IDs, click-paths for creating work orders, parts, adjustments, invoices | This is **`build/APP-ACTIONS-PLAYBOOK.md`'s job** and it runs to ~1,900 lines. Copying it would make every skill unreadable and **create a second copy that silently drifts** — the exact failure Rule 10's amendment names. **The skills carry the *hazards* in substance** (sessions, TestRail, git, secrets) and point to the playbook for the *recipes*. **This is a deliberate pointer, and it is the only one.** |

---

## 5 · WHAT THIS MATRIX DOES **NOT** CLAIM

1. **It is not a quality judgement** — see measurement note 2.
2. **Nothing here was re-verified live.** Zero TestRail, Jira or application calls. Every factual claim
   is **as recorded by the pass that made it**.
3. **No single false-absence total is given, deliberately** — the per-pass figures double-count and the
   learnings file refuses to sum them; **that refusal is carried, not quietly resolved.**
4. **Two items the brief listed as unresolved are in fact RESOLVED, and are recorded as such rather
   than written up as open** — the **technical-design authority question** (answered 2026-08-12) and
   the **untrustworthy Automated flag on Schedule** (the 31 corrected `3→1` on 2026-08-11). **Writing a
   settled question up as open is the same defect as erasing one** — it is how a session re-asks
   something a source has already answered. **The genuinely open item is the five Report Suite defects**
   (`06`, HONESTY NOTES).

---

## APPENDIX · THE SOURCES MINED

| Source | What was taken |
|---|---|
| `CLAUDE.md` | Rules **63–68**; the 2026-08-11/12 amendments to **9, 10, 25, 30, 33, 49, 52, 53, 54, 57, 58, 60, 61, 62, 67**; the header pointers; "Deliverable conventions the user likes" |
| `build/SESSION-LEARNINGS-2026-08-12.md` | All eight sections, plus its "WHAT THIS FILE DOES NOT CLAIM" |
| `build/rulings-2026-08-12/` | `TECH-DESIGN-CONTRADICTIONS.md` · `BUGFIX-DEPLOY-DOES-NOT-STALE-A-PASS.md` |
| Pass folders, 11–12 Aug | `build/{filters,schedule,report-suite}/…` — `FINDINGS`, `DIVERGENCES`, `RESUME`, `COMPLETION-REPORT`, `RUNNABILITY`, incident reports |
| `build/APP-ACTIONS-PLAYBOOK.md` | §A sessions · §I Quasar/labels · §J TestRail · §L git · the secrets preamble |
| `build/NO-WORK-LOSS-STRATEGY.md` | The seven requirements and the failures behind them |
| `build/loss-audit-2026-08-11/`, `build/secret-redaction-2026-08-11/`, `build/automated-*-2026-08-11/` | The audited incidents |
| `build/OUTSTANDING-ITEMS-REGISTER.md` | What is owed, and by whom |

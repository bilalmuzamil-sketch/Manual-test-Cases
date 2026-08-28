# PROJECT-STATE — Report Suite

> **🔴 BEFORE DOING ANY WORK ON THIS PROJECT, READ [`../skills/README.md`](../skills/README.md).**
> The eight skills are the cold-start method for every job this workspace does — authoring, source
> currency, runnability, handover, the completion report, defects, PO questions, and recovering a
> killed pass. **Start with [`../skills/00-COMMON-CORE.md`](../skills/00-COMMON-CORE.md)**, whose
> **§17 carries this project's identifiers** — epic, TestRail group, run, QA branch, API host,
> Confluence page and case-source path — **so none of them has to be guessed.**


## §0-COUNT-CORRECTION-2026-08-28 (LATEST) — the case count is **516**, not 509

**Approved by the QA lead 2026-08-28.** The CLAUDE.md project index and this file both carried
**509 cases ours**. That figure was wrong. Re-derived live from a **fully paged** `get_cases`
(an unpaged call silently returns 250 sections and finds almost nothing):

| Measure | Value | How |
|---|---|---|
| **Ours (`created_by = 3`)** | **516** | every case whose section is anywhere under group **4281** *Reports Suite* |
| Live total in the tree | **532** | the same subtree, all authors |
| Foreign (Rule 38 — report, never edit) | **16** | 532 − 516 |
| Run **359** | **516 tests · 535 results** | after the union-only sync of 2026-08-28 |

**How 509 became 516.** The estate-wide damage sweep re-derived **513** on the morning of
2026-08-28 (`build/report-suite/damage-sweep-2026-08-28/DAMAGE-SWEEP.md` §2 — the index's 509 had
never been measured), and **three new WIP cases C45208–C45210** were authored the same day
(`build/report-suite/wip-authoring-2026-08-28/CREATED-AND-REPAIRS-2026-08-28.md`). 513 + 3 = 516.

**Older section headings in this file quote 476 and other historical totals. Those are correct for
their own date and are left alone; this section is the current figure.**

---

## §0-FULL-VIU-2026-08-05 — 32 of 476 driven live; the observation gap is NARROWED, not closed

Resume: `build/report-suite/full-viu-2026-08-05/RESUME.md` -> `FINDINGS.md` -> `testrail-execution-log.md`
-> `DELIBERATE-DECISIONS.md` -> `FILED.md` -> `API-ASK.md` -> `RECHECK-QUEUE.md`.

**Build `v3.5-16cf83f`** (last-mod 05 Aug 06:40:32 GMT, etag `177c595…`), read 19:51:00Z and 19:56:39Z,
byte-identical — no redeploy. **Specs SBC 15 · SBR 17 · PV 5 · TU 6 · WIP 9 · IV 4**, none moved.

**THE HONEST NUMBER: 32 of 476 observed live, 444 not.** Every one of the 476 is listed with its tier in
FINDINGS.md. The pass captured a broad live evidence base for all six reports (headers, column selectors,
Location matrix, export matrix, presets, tooltips) but a captured artifact was NOT counted as an
adjudicated case.

**FIVE STALE HOLDS CORRECTED** — C30191 (server sort), C30592 (full-set export), C30506 + C38859
(Column Selection), C30442 (TU Location filter) all said *"not built yet"* and all are BUILT. Markers
HOLD -> READY. Census now **READY 424 · EXPECT-FAIL 27 · HOLD 25 = 476**.

**FIVE DEFECT CLUSTERS RE-DRIVEN, ALL STILL REPRODUCE:** SV-8818 (PDF 500 above the cap on PV, IV, SBC
while the same view's CSV succeeds — and the CSV path DOES refuse gracefully, so the cap exists on CSV
and is missing on PDF) · **SV-8907 WORSE THAN RECORDED — replaying the product's own request gives HTTP
500 for BOTH formats on ALL FOUR tabs, and unlike the other five reports WIP's CSV fails too** ·
SV-8820 (As-of one day after the range end: range to 07-15 -> *"As of: 2026-07-16"*) · SV-8823 (IV money
as `$`-text and CSV column order differs) · SV-8908 (shared unit **854** on **Euwood Paving** confirmed —
two WOs, VINs `1HTKTSWK4RH442544` and `5SHFE4730MB001604`, the only such unit among 115 rows).

**NEW UNTICKETED, USER-FACING:** the SBC and SBR CSVs emit `$1,979.40`, `100.0%`, `Jul 31 2026` where
**SBC S14-R9/R10/R11 and SBR S14-R17 require plain numbers and mm-dd-yyyy**. SV-8823 names Inventory
Value only. **Not filed — recommended for filing (FILED.md).**

**THE LOCATION COLUMN IS IMPLEMENTED THREE WAYS OUT OF SIX.** With one location selected it is SHOWN on
SBC/WIP/IV and HIDDEN on SBR/PV/TU; it is offered in the column selector on **IV only**. All six specs
still state it both ways, so per **Rule 58** the 12 held cases STAY HELD and the question goes back to
Chris Ward with these facts.

**⚠️ `updated_on` IS NOT A RELIABLE PROOF OF "UNTOUCHED".** 14 cases we never wrote (C30341 C30392 C30451
C30456 C30457 C30460 C30487 C30490 C30491 C30493 C30519 C30522 C30526 C30528) changed all three text
fields from plain text to raw `<ol>`/`<li>` between the 19:53Z snapshot and the post-write read, **with
`updated_on` and `updated_by` frozen at their earlier 17:40–18:14Z values**. This project renders markup
literally to the tester. **Reported, not fixed** (42 field writes, needs a go-ahead), and it belongs in
`APP-ACTIONS-PLAYBOOK.md` §J — not edited from this worker.

**PROOFS:** 32 `update_case`, all HTTP 200, 30 fields each, 0 mismatches, 0 collateral beyond
`custom_expected`; **all three text fields sent on every op**. **Run 359 untouched** — `include_all` false,
476 tests, **535 results all present BY ID, 0 field changes, 0 echoes, 0 new**, counters 6 passed / 470
untested. **Foreign C38919–C38923 byte-identical incl. `updated_on`/`updated_by`.** Four counts
**476/476/476 set-equal both ways**, id-map 0 blanks + refs 476/476, import header sha256
`a45eae40ec73b8ac` identical to all five peers, **shredding signature 0 rows**. Deliverables were
**deliberately NOT regenerated** — the counts already reconcile and a rerun blanks the id-map C-ids and
drops `refs`; the import is one column stale on 32 rows. **Nothing seeded, nothing to restore, app
read-only. `quick-login` never called.**

**OUTSTANDING:** Chris Ward's one sentence on the Location column (12 cases) · file the SBC/SBR export
formatting defect · a go-ahead to repair the 14 markup cases · the QA lead's ruling on C30096/C30310/
C30315/C43551 · the picker-reachability check behind API-ASK item 1 · **444 cases still to observe**.

# Report Suite — PROJECT-STATE (canonical resume doc)

## §0-CHRIS-NEWREQS-2026-08-05 — the suite-wide link-permission rule now has cases, and two real defects came out of the pass

**Paper: `build/report-suite/chris-newreqs-2026-08-05/`** — read `FINDINGS.md` §0 first (it says plainly
what was and was not observed), then `SPEC-DIFF.md`, `LINK-SURFACE-MATRIX.md`, `FILED.md`,
`ROLE-RESET-LOG.md`, `DELIBERATE-DECISIONS.md`, `RECHECK-QUEUE.md`, `testrail-execution-log.md`, then
`READINESS-2026-08-05.md`. Machine evidence: `PRE/` + `POST/` snapshots of all live cases and run 359,
`writeplan.json` committed **before** any write, `oplog.json`, `audit.json`, `evidence/`, and re-runnable
`tools/wip_probe.py`.

**SOURCES.** All six specs re-read live at **18:34Z** and **again at 19:06:53Z immediately before the
writes** (Rule 59): **SBC 15 · SBR 17 · PV 5 · TU 6 · WIP 9 · IV 4**, byte-identical between the two
reads on all six, so **nothing moved under this pass** — unlike the two previous passes. Build
`v3.5-16cf83f`, identical at both reads. Epic **SV-8582 = 105 children**, verified two ways with equal
key sets. **Session alive; `quick-login` never called.**

**SIX REQUIREMENT-LEVEL DELTAS, SIX VERDICT ROWS, totals reconciled.** **⚠️ THE CAUTION FIRED ON ONE OF
THE THREE ITEMS:** SBC properly **ADDED** a numbered requirement (**S9-R1a**) and WIP properly **REWROTE**
**S4-R5 / S7-R1 / S7-R2 / S7-R4** — but **SBR changed ZERO numbered requirements**; its link-permission
rule landed in the **§2 narrative only**, while **S12-R1 and S12-R3 still read unconditionally**.
**And SBC now contradicts itself:** the new S9-R1a says an unpermitted user sees plain text, while the
untouched **S9-N2** still says that user clicks through to an access-denied page. **No winner picked on
either** (Rules 15/57).

**THE LINK SWEEP — all 735 requirements across the six live specs.** **Exactly SEVEN navigable elements
on FOUR reports** (SBC invoice # ×2 targets · SBR invoice # · SBR customer name · TU Total Hours ×2 · WIP
WO #). **Parts Velocity and Inventory Value have NONE — proven, not assumed.** **Across all seven the
positive half is covered and the negative half was covered NOWHERE**, which confirms the previous
worker's report from the case text. **Every Rule-40 surface carries a verdict and each N/A carries its
reason** — the PDF surface is N/A because a live 268,586-byte report PDF holds **`/URI` × 0, `/Link` × 0,
`/Annots` × 0**; print and scheduled delivery are N/A because those words appear **0 times in all six
specs**.

**⚠️ THE ONE THING THIS PASS DID NOT DELIVER: the negative half was NOT observed on any report, and
NOTHING was observed on screen at all.** **Every one of the eleven roles holds `workOrdersView`**, so
"reports access without work-order access" is held by nobody; `switch-user` acts on the session you
present and the only way back is the barred `quick-login`; a fresh staff member cannot confirm its
invitation here; setting a password as an admin is not built (SV-8225); and the front end **bounces to
`/login`** because it needs a `user` payload only a login produces — **which we refused to fabricate**
(Rule 12). **This is an ACCESS blocker, not a seeding one.** Any ONE of three things clears it in ten
minutes: permission to use `quick-login`, a second real sign-in, or one live check by a tester with two
accounts.

**WRITTEN: 13 `update_case` + 3 `add_case`, every one HTTP 200 + byte-verified, 28 fields compared each,
0 mismatch, 0 collateral change; all three text fields on every payload.** **3 NEW CASES: WIP-COL-09 =
C43557 · SBC-LINK-05 = C43558 · SBR-LINK-06 = C43559**, internal ids proven never used anywhere in the
repo (the numbering gaps are retired ids and were avoided). **C30498 / C30499** rewritten off the
replaced "loaded jobs" wording; **C30500** given the scope assertion it never had; **C30100 FLAGGED NOT
FLIPPED**. **0 delete_case · 0 add_section · 0 results logged.**

**TWO DEFECTS FILED in the Rule-52 amended shape** (Story Defect · parent = the owning STORY · priority
Low · `relates to` link · no Product Area), 12 field checks each, all PASS, duplicate-searched with five
JQL queries first:
· **[SV-8907](https://shopview.atlassian.net/browse/SV-8907)** (parent SV-8665, Severity High) — **the
Work In Progress download fails with a server error on EVERY non-empty tab**, both formats; only an empty
tab produces a file. The other five reports export fine on the same build. **Not SV-8818**, which is
PDF-only, size-dependent and explicitly on the other five. Looks like a regression: the identical request
shape returned a populated file on 2026-08-03. **Nine WIP export cases now `READY - EXPECT FAIL`.**
· **[SV-8908](https://shopview.atlassian.net/browse/SV-8908)** (parent SV-8663, Severity Medium) — **the
WIP Asset filter is keyed one entry per unit number**, so where two vehicles share a unit number only one
is offered and the other's identification number matches nothing. **Six vehicles named with their VINs,
work orders and customers.**

**ITEM 1 IS MET — and by a mechanism the spec does not describe.** The filter option lists come from
`…/work-in-progress/filters` and are the **exact union across all 392 rows of all four tabs** — advisors
**15 = 15**, customers **215 = 215**, unit numbers **172 = 172**, set-equal both directions. **But the
new requirement's parenthetical "loads the complete set of open jobs in one request" is WRONG:** the
report paginates in pages of 100 (`pagination[page]` / `pagination[rowsPerPage]` honoured, eleven other
spellings ignored). **A specification wording problem, not a defect — reported, not filed.**

**MARKERS on all 476, exactly one each: READY 419 · READY-EXPECT-FAIL 27 · HOLD 30. GATE 419 + 27 = 446 =
476 − 30.** **Ready to automate 447 → 446 while the suite GREW by three cases** — the honest direction,
because the new cases are held for want of a sign-in and C30100 for want of Chris's answer. **The new
requirements' coverage is in the denominator and NOT in the ready figure.**

**PROOFS.** **465 untouched cases byte-identical including `updated_on`/`updated_by`; the 5 foreign cases
C38919–C38923 likewise.** **Run 359 union-synced 473 → 476** with the FULL union: `include_all` still
false, case_id set equal to our 476 both directions, **all 535 prior results present BY ID with 0
graded-field changes and 0 new results**; the only field that moved on any result is **`case_refs` on 3
records, traced to exactly C30498/C30499/C30500 — the only three cases whose refs we edited** — a declared
read-time echo. **Runs 357 and 352 needed nothing and were NOT written.** **Four counts reconcile
476/476/476/476 set-equal both directions**; id-map 0 blanks, refs 476/476 byte-equal to live; **shredding
guard PASSED and independently re-verified** (0 single-character lines in any of the seven CSVs); import
header sha256 **identical to all five peers**. **Nothing seeded, no role modified, no organisation setting
touched — so there was nothing to restore.**

**ALSO REPORTED NOT FIXED:** **PV S1-N1** still describes role-based report access (*"Users without the
Manager or Office User role cannot reach the Reports section"*) while **S1-R4 in the same version** states
the single-permission model, and the build agrees with S1-R4.

**⚠️ Rule-49 queue OPEN** — the branch is not declared final, so all 476 verdicts are PROVISIONAL, and
`chris-newreqs-2026-08-05/RECHECK-QUEUE.md` joins the two already open.

**OUTSTANDING: a second sign-in (or permission to use `quick-login`) · one sentence from Chris on the SBC
S9-R1a vs S9-N2 contradiction · the same for SBR's numbered requirements · his correction of the WIP
"one request" parenthetical and of PV S1-N1 · whether the three new HOLD cases should instead be READY ·
the branch declared final.**

## §0-PROVENANCE-RESTAMP-2026-08-05 — the build is no longer named as the source of any expectation, and 7 wrongly-held cases are released

**Paper: `build/report-suite/prov-restamp-2026-08-05/`** — read `FINDINGS.md` first, then
`SOURCE-CURRENCY.md`, then `READINESS-2026-08-05.md`. Machine evidence: `PRE/` + `POST/` snapshots of all
478 live cases and of run 359, `writeplan.json` (committed BEFORE any write), `oplog.json` +
`oplog-batch1.json` (per-operation), `diff-summary.json`, `wip-cap-probe.txt`.

**JOB 1 — DONE on 473 of 473.** The QA lead barred the old template: *"it should never say that it is an
expected behavior as per the build testing … because the build can be wrong too."* Before, **461 of 473**
cases opened *"as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the … specification"*.
Now every case carries **two sentences that never merge** — sentence 1 names **documents only** (epic
SV-8582 + the report's specification at its current live version + the case's own anchors, plus Chris
Ward's answer file where that is genuinely the basis), sentence 2 names the build **only as what the case
was last checked against** (*"Last checked against build v3.4.1-3d03023 on 8/4/2026."*) or says plainly it
has not been checked. **0 barred phrasings remain**, **exactly one provenance line per case** read back
from live, and the last `confirmed in the build` hedge in the suite (C30160) is gone.

**⚠️ THE SPECS MOVED TWICE DURING THE PASS, so 274 cases were re-stamped a SECOND time.** Writing began at
SBC **14** / SBR **16** / PV 5 / TU 6 / WIP **7** / IV 4; the end-of-pass re-read (Rule 31) found Chris had
published **SBC 15, SBR 17 and WIP 9** at 17:53–17:54Z (*"Parth WIP review + suite-wide link-permission
rule"*). All 86 SBC + 111 SBR + 77 WIP cases were re-stamped to the newest versions. **The build did not
move** — `v3.5-16cf83f`, `index.html` sha256 identical at start and end.
**Those edits do NOT touch the Location column** (verified: SBC v15 added only S9-R1a; SBR v16→17 changed
**zero** numbered requirements; WIP v7→9 changed S4-R5/S7-R1/S7-R2/S7-R4). **They DO add a suite-wide
link-permission rule with NO cases anywhere** — *a user without permission to open the target sees the
number as plain text* — quoted verbatim in `FINDINGS.md` §2.1. **Not authored** (separate authorised work).
One case was tightened for it: **WIP-COL-03 C30468** item 1 is now scope-conditional per v9 S4-R5.

**JOB 2 — the Location column, re-derived from the live text, and the answer is NOT the expected one.**
**Only Technician Utilization actually rewrote its numbered requirements** (S9-R9 **and** S10-R4, both in
v6). In the other **five** the toggleable decision landed in the **narrative + change log** while the
numbered requirement saying the opposite was **left untouched**: SBC **S13-R4** (nine columns, no
Location) · SBR **S21-R7** + S20-R1/R2 · **PV S3-R10 ("is not user-toggleable")** · WIP **S7-R13** ("the
user does not toggle it", contradicting S4-R3 **in the same version**) · IV **S7-R6**.
**⚠️ THIS CORRECTS OUR OWN RECORD AND THE ROUND-3 SHEET: Parts Velocity is a FIFTH open contradiction, not
an untouched report** — its §4 and change log were **added in v5** and assert the toggleable model. So PV's
cases stay held; asserting either side would pick a winner inside a self-contradictory document
(Rules 15/57). **12 cases held** (was 16), each asserting only what **both** readings agree on, with a
plain-words note that the description says two different things and a link to the round-3 sheet.
Also removed while they were open: a **stale round-2 link on 13 cases**, and a note on 13 cases claiming
*"on this build the column does not yet behave this way … The change is with the developers"* — which
asserted the build on an unsettled point **and** claimed a ticket named nowhere.

**THE THREE CASES HELD FOR THE WRONG REASON — all three released** (both texts quoted in `FINDINGS.md` §4):
**C30186** its five expected results are SBC v15 **S20-R8/R9/R10/R11/R14 near verbatim**, and the spec even
records that the white totals row was deliberate — the earlier "confirm with the PO, this may be a styling
gap" concern was written against an older version · **C43550** answered outright by SBC **S4-R12** (*"never
shown it and it never appears in their column selector"*), and its old provenance claim that *"nothing in
the specification covers this"* was **false** · **C30502 — OBSERVED LIVE and the build MATCHES the spec**:
a 366-day span inclusive loads (HTTP 200), 367 is refused with exactly *"Date range cannot be over one
year."*, and WIP **S7-R8** caps it at *"a 366-day maximum span (start to end)"*. **The earlier note (367
accepted / 368 refused, "with the product owner") was wrong by a day in both halves. NO TICKET WAS FILED —
there is no defect.** The only residue is that S7-R8 does not say whether the first and last days are
counted.

**MARKERS on all 473, exactly one each, last line of Expected Results: READY 430 · READY-EXPECT-FAIL 17 ·
HOLD 26. ARITHMETIC GATE 430 + 17 = 447 = the readiness figure, cross-checked the other way as 473 − 26.**
Ready to automate **440 → 447**. `READINESS-2026-08-05.md` updated; every row and the formula add up.

**PROOFS. 473 × `update_case`, every one HTTP 200, 30 fields compared each, 0 mismatches, 0 collateral
changes; one write per case per batch; 0 add / 0 delete / 0 section / 0 run writes; no result logged
anywhere; `refs` not written on any case, so the declared comma normalisation was never exercised.**
**ALL THREE TEXT FIELDS ON EVERY PAYLOAD, so the omit-field re-render (playbook §J normalisation #3) DID
NOT FIRE** — `custom_preconds` and `custom_steps` came back byte-identical to the pre-write snapshot on 472
of 473, the only mover being C30466's one authorised precondition fix. **One transient event, recorded:**
the post-write verification GET for **C30298** returned HTTP 502 *"policy unavailable"* — a gateway error
on the READ, not the write; **the batch stopped as Rule 50 requires**, C30298 was re-GET at 200 and
byte-compared field by field (all 3 intended fields correct, 0 collateral), and nothing was retried blindly.
**RUN 359 PROVEN UNTOUCHED:** 473 tests, test-id and case_id sets equal **both** directions, `include_all`
still false, counters identical (6 passed / 467 untested), **535 result records with 0 missing BY ID, 0 new,
and 0 field changes on any of the 535 — not even the declared `case_title` / `case_refs` echoes.** Run tests
**473 = our live case count 473**, so no re-sync was needed. **FOREIGN CASES C38919–C38923 byte-identical
on every field including `updated_on` and `updated_by`.** **`delete_case` called zero times.**
**DELIVERABLES:** local source re-synced **FROM LIVE** before regenerating; **shredding guard RAN AND
PASSED (0 of 473 rows)**; the generator's two known side-effects fired again and were both repaired from
live (it blanks all id-map C-ids and drops the `refs` column) → **473 rows, 0 blanks, refs 473/473,
refs+title byte-equal to live, header byte-identical**; **four counts set-equal BOTH ways at 473/473/473/473**;
import header sha256 **identical to all five peers**.
**⚠️ Branch `sv8582` still NOT declared final — every verdict is PROVISIONAL and the Rule-49 queue
`viu-2026-08-03/RECHECK-QUEUE.md` stays OPEN.**
**OUTSTANDING (full list in `FINDINGS.md` §7):** Chris's one sentence on the Location column (12 cases, and
**add Parts Velocity to the ask**) · whether the 366-day WIP limit counts the first and last days · three
spec residues · **four more cases that look wrongly held — C30096, C30310, C30315, C43551 — reported, not
released, because releasing them moves the gate** · authorisation for the new link-permission coverage ·
the branch declared final.

## §0-RUN-SYNC-2026-08-05 — run 359 is now COMPLETE at 473 tests

**Paper: `build/testrail-run-sync-2026-08-05/`** (RUN-SYNC-2026-08-05.md · the execution log · full
before/after snapshots · the executor).

The QA lead authorised the sync (*"Please run this sync and the syncs for other projects too."*) and
it is **executed**. **Run 359 went 469 → 473 tests**, gaining the four cases authored earlier today:
**SBC-COL-04 = [C43550](https://shopview.testrail.io/index.php?/cases/view/43550)** · **WIP-PERS-05 =
[C43551](https://shopview.testrail.io/index.php?/cases/view/43551)** · **TU-EXP-10 =
[C43552](https://shopview.testrail.io/index.php?/cases/view/43552)** · **SBC-EXP-17 =
[C43553](https://shopview.testrail.io/index.php?/cases/view/43553)**. Nebojsa and Viktoria can now
see and execute them; before this they were invisible in the run.

**ONE `update_run`, union-only, HTTP 200, and the run's graded work is proven intact:** all **535**
prior result records **present BY ID and byte-identical** on every graded field (`status_id`,
`comment`, `defects`, `elapsed`, `version`, `assignedto_id`, `created_by`, `created_on`, `test_id`,
`case_id`, `id`, `attachment_ids`); all 469 prior tests present by id with **0 rebound**; the
`case_id` set proven equal to the union **in both directions**; the run record diffed field by field
with **only `untested_count` (463 → 467) and `updated_on`** moving. **0 result writes, 0 case writes,
0 other run fields touched.** Verified twice — once in the executor and once by a cold re-read against
the committed snapshot.

**The five Vladimir Tomovic cases (C38919–C38923) were EXCLUDED from the union** and were **not in
the run to begin with**, so nothing of his was added or removed (Rule 38). **Authorship was derived
live from `created_by`, not a hard-coded list** — no new foreign case has appeared. **So run 359
holding 473 tests against 478 live cases in group 4281 is CORRECT: the five-case gap IS the five
foreign cases.**

**Four counts reconcile: live ours 473 · run 473 · id-map 473 · import 473**, set-equal both ways.

**⚠️ STANDING DUTY, NOT A CLOSED TASK:** `include_all` is **`false`**, so the run will **never** pick
up a new case on its own — **re-run the sync after every authorised `add_case`** (Rules 34/47).

---

## §0 UPDATE 2026-08-05 — THE EXPECTED-BEHAVIOUR CORRECTION (read this first)

**Resume order:** `build/report-suite/expected-behaviour-audit-2026-08-05.md` →
`build/report-suite/final-viu-2026-08-05/` (SOURCE-CURRENCY · FINDINGS · testrail-execution-log ·
RECHECK-QUEUE · DELIBERATE-DECISIONS · OUTSIDE-IN · API-ASK · DELETIONS) →
`build/report-suite/READINESS-2026-08-05.md` →
`build/report-suite/rulings-2026-08-05/FOLLOW-UP-QUESTIONS-ROUND-2-2026-08-05.md`.

### WHY THIS PASS EXISTS — the QA lead's correction, verbatim

> "The expected behaviors are NOT the ones 'how the build is behaving'. Expected behaviors are the ones
> which are either in PRD-COnfluence/Epic STories/Verified in the Anser sheets by the PO. From the Build we
> are JUST doing the VIU… I am shocked to see that how come you considered the Build behavior as the
> expected behavior?"

And his clarification: *"'the case should be matched to the build' … meant that the test case should be
VIU'd from the build"* — **labels and steps from the build, never the expectation.** The reasoning to hold
on to: **if the expectation bends to whatever shipped, the case can no longer fail, and a test that cannot
fail is not a test.**

### THE AUDIT RESULT — all 473 classified, no sampling

| Class | Meaning | Count |
|---|---|---|
| **A** | build-derived expectation, a documented requirement says otherwise | **16** |
| **A\*** | the spec now states it BOTH WAYS — nothing to restore to | **2** |
| **B** | build-derived, source silent | **8** |
| **C** | legitimate — the assertion is documented | **440** |
| **D** | unsourced assertion, repaired by REMOVAL (never substitution) | **7** |

**The systemic error was ONE boilerplate paragraph about the Location column, pasted into 14 cases across
all six reports.** In 13 it asserts the exact opposite of that report's own specification —
**PV S3-R10** *"is not user-toggleable"* · **TU S10-R4** *"never listed in the column selector"* ·
**WIP S4-R3** *"not offered in the column selector"* · **IV S7-R6** *"not one of the columns offered"* ·
**SBR S20-R1** (a closed list of seven metric columns). It also **overwrote wording that was right**:
C30352's line 3 said the column is not in the picker — which is PV S3-R10 almost verbatim — and the
manifest recorded it as *"wrong under both readings"*.

**The Rule-32 "his newer answer wins" defence does NOT hold:** his answer is **self-contradictory** on this
exact point (Rule 32(iii) says ask, not pick), and **for Parts Velocity the spec is now NEWER than the
answer** — v5 was saved **2026-08-05T13:21:40Z** and still says not user-toggleable.

**Where the contamination entered — and it was NOT a VIU pass.** Checked across **all 41 commits** that
touched the case source: **no pass ever changed a case's steps and its expectation body together**, and
**the two pure VIU passes changed ZERO expectations**. The one build re-check that touched an expectation
only **removed** a stale "known issue" line once SV-8819 was fixed — correct maintenance. It came from an
**answer-ingest pass** where an ambiguous PO answer met an observed build and **the observation won**.

**Three of our own suspicions were WRONG and the specs proved them wrong** — C30356, C30336, C30384 are
near-verbatim from their specs. **C30265 is correct as written and was deliberately NOT changed** despite
the brief asking for it: it follows Sales By Representative's own spec, and changing it would have imported
one report's rules into another.

### SOURCE CURRENCY — two specs moved DURING the pass

| Spec | Baseline | Live | Verdict |
|---|---|---|---|
| Sales By Customer | v13 | **v14** (saved **13:07:07Z**) | **9 semantic changes + new S20-R19a** |
| Parts Velocity | v4 | **v5** (saved **13:21:40Z** — one minute before it was fetched) | **1 real change: S1-R4** |
| SBR · TU · WIP · IV | v15 · v5 · v6 · v3 | unchanged | CURRENT |

**Chris ratified four things we were waiting on:** the access-gate Location rule (S4-R12), the
load-failure-only logo rule (**S15-R17** — which makes ticket **B5 not a defect**), the nine-preset date
picker (S2-R2, "Last 12 Months" first, no Today/Yesterday/"Custom"), and the removal of Print.

**THREE SPEC DEFECTS REPORTED, not worked around:** (1) the Location model is now specified **two different
ways across the six specs**; (2) **SBC contradicts itself** — S4-R12 says the column is in the column
selector, S13-R4 closes that list at nine without it; (3) **S14-R14 still maps "Today → today" and
"Yesterday → yesterday"** although S2-R2 has just deleted both presets.

**Epic SV-8582: 105 children**, verified two ways with equal key sets (our record said 102 — the difference
is **the three tickets we filed ourselves**). 1 story-defect subtask (SV-8780, Ready to Fix).
**SV-8819 is now `Done` (fixed); SV-8821 is `OBSOLETE`** — neither was reopened or "restored" (Rule 53).

### LIVE EVIDENCE TAKEN THIS PASS on `v3.5-16cf83f`

The **first live Report Suite session since the deploy** — the previous two passes got HTTP 401.
Build byte-identical at **13:20:39Z and 13:55:25Z**. `quick-login` was **never called** (it rotates the
session two other workers share).

- **The decisive Location capture:** the SBC Summary CSV carries a `Location` column with **both**
  locations selected and **not** with one. Our user has access to **two**, so the build **does not meet SBC
  v14 S4-R12** *"regardless of how many locations are currently selected"* while it **does meet** PV S2-R12,
  SBR S21-R7, TU S9-R9, WIP S7-R13, IV S7-R6. **Held, not flipped — SBC contradicts itself and we do not
  settle that from the build.**
- **Two brand-new v14 requirements are already correctly built:** S20-R19a (Location after Customer in the
  Summary download) and S20-R19 (after Date in the Expanded one).
- **S14-R14 filenames · UTF-8 BOM · the `"Locations:"` metadata line — all met.**
- **S15-R15 met** — the PDF holds exactly one embedded image and **zero** `http` references.
- **SV-8823 STILL REPRODUCES** — `$224.92` and `90.5%` in the live CSV.
- **NEW, unticketed:** the server **rejects `last_12_months`** (v14's new first preset) and **still accepts
  `today` and `yesterday`** (both deleted). **Asked, not filed** — `final-viu-2026-08-05/API-ASK.md`.

### WHAT WAS WRITTEN

`update_case` **only** — **0 add · 0 delete · 0 section · 0 run writes.** One write per case carrying every
intent for that case. **30 fields compared per operation, 0 mismatch, 0 collateral change, HTTP 200
throughout.** **The build clause was deliberately NOT re-stamped** — all 473 still read
`8/4/2026 (build v3.4.1-3d03023)`, because we did not re-observe them on `v3.5-16cf83f` and a fresh date
would be a false claim.

**A second pass corrected 15 cases whose provenance still said the PO's decision overrode the spec while
their body now followed the spec** — a Rule-56 divergence sentence pointing the wrong way, found by
reading our own repairs back live.

### MARKERS — 473 of 473, one grep-able literal each

**423 `AUTOMATION: READY` · 17 `AUTOMATION: READY - EXPECT FAIL` · 33 `AUTOMATION: HOLD` = 473.**
**Arithmetic gate: 423 + 17 = 440 = the ready-to-automate figure. PASSES.**
Before this pass **453 cases carried no marker at all** and two competing styles coexisted on the other 20.
**`READY` asserts *automatable*, not *passing*** — the pass/fail verdicts are the 2026-08-04 ones and are
**two builds old**.

### ⚠️ STILL OPEN

- **Rule-49 queue OPEN** (`final-viu-2026-08-05/RECHECK-QUEUE.md`) — the branch has never been declared
  final and has now redeployed **three times** since 2026-08-03. **All 473 verdicts are PROVISIONAL.**
- **This pass was NOT a per-case live VIU of all 473** and does not claim to be.
- **16 cases HOLD on one sentence from Chris** about the Location column (readiness 440 → 456).
- **4 of our cases are not in run 359** (C43550–C43553) and `include_all` is `false`, so it will never pick
  them up. **No run write was made.**
- **The missing-logo state was deliberately not seeded** — the organisation is shared with two live workers.

---

## §0 UPDATE 2026-08-04-C — THE RULE-49 RE-CHECK WAS RE-RUN AFTER THE REDEPLOY (read this first)

**The QA branch was redeployed at 2026-08-04 10:41:58 UTC**, `v3.4.1-0ed4433` → **`v3.4.1-3d03023`**
(all three markers moved). Under Standing Rule 49 the entire re-check queue fell due, and the QA lead
instructed: *"If recheck is due and if that is for Reports. Please do it."* **It is done.**

**Canonical resume folder: `build/report-suite/recheck-2026-08-04/`** —
`FINDINGS-BATCH-01-defects.md` · `FINDINGS-BATCH-02-surfaces.md` (batch 3 appended) ·
`DELIBERATE-DECISIONS.md` · `testrail-execution-log.md` · `per-case-recheck-verdicts.csv` ·
`evidence/`. Readiness: **`READINESS-2026-08-04-POST-DEPLOY.md`** (the pre-deploy one is
banner-marked SUPERSEDED).

### Outcome, all 469 cases
**451 CONFIRMED · 4 CHANGED · 14 RESIDUAL.** Row-level cells in the queue: **212 CONFIRMED · 5 CHANGED**.
Build marker read at **start, middle and end** of the run — **`v3.4.1-3d03023` all three times**, so it
did not move under us.

### The three open defects, re-driven
- **SV-8818** (PDF 500 at scale) — **CONFIRMED still reproducible.** Parts Velocity, Technician
  Utilization Expanded and Inventory Value all 500 after 30–45 s; the same scope as CSV succeeds; PDF
  succeeds narrowed. 10 cases keep their known-issue line.
- **SV-8819** (Turns/Yr window) — ⭐ **FIXED.** The `This Year` preset now implies the inclusive **216**-day
  window and matches a hand-picked range exactly; previously **215**. Measured over **500 rows per preset**.
  **Both its cases were proven to pass and their known-issue line was REMOVED** (C30367, C30374) under the
  QA lead's explicit instruction. **SV-8819 is still `Open` in Jira — that needs moving.**
- **SV-8820** (IV values stock one day late) — **CONFIRMED**, identical +1 day shift on every date tried.
  4 cases keep their line.

### What the deploy broke, and the sweep for it
The deploy added a **`"Date Range:"` line as line 1 of EVERY export** (36 of 36 surfaces re-captured).
**All 469 cases were swept** for claims about an export's first line or line order: **24 candidates,
exactly ONE genuinely false** — **IV-EXP-04 = C30590**, which said the CSV's as-of line was the *first
line*. Corrected, and rewritten **scope-conditionally** so a further added line cannot break it.
**The other 23 survived because they were written scope-conditionally in the first place — Rule 42
earning its keep.**

### The three carried-forward items, all settled
1. **IV on-screen column order** — observed live: `Total Cost` is **last on screen** but **9th of 12 in the
   file**. Deviation real and CONFIRMED.
2. **Per-cell API cross-check** — **55,584 cells, 0 genuine value mismatches** (honest caveats: a
   first run's 10 "mismatches" were my own negative-money formatter, and 11 rows are unpaired because
   several part numbers contain embedded quotes).
3. **Money format** — **55,656 of 55,656** money/percent cells still fail a numeric parse; Qty parses
   fine. **Amounts are correct**, so the QA lead's closing condition for SV-8823 still holds.

### TestRail writes — `update_case` ONLY
**471 operations, every one HTTP 200 + byte-verified, 28 fields compared each, 0 mismatches.**
469 = the Rule-54 provenance re-stamp (one of which also carried the C30590 correction) + 2 = the SV-8819
line removal. **No add, no delete, no section, no run write, no result write.**
**The provenance line now names the build as well as the date** — two builds existed on 2026-08-04, so the
date alone had become ambiguous, and **Rule 49 obligation (3) requires the marker on the case**.
Stamper is **idempotent** (proven).

### Verification
**Run 359 untouched** — 469 tests before and after, **all 529 result records present BY ID**, `include_all`
still `false`, case_ids **set-equal both directions** to our 469. **No `update_run` sent** (none needed).
**The 5 foreign cases (C38919–C38923) proven byte-identical**, timestamps included.
**Four counts all 469** — live-ours / local active / id-map / import — **set-equal in both directions**.
Import header **SHA-256 identical to all three peer projects**; 0 dup titles, 0 "VIU" words, 0 flag words,
0 internal-ID leaks, 0 titles over 80 (longest exactly 80). **47 DO-NOT-AUTOMATE warnings counted live —
all present.** **Rule-28 cross-case sweep: 0 contradictions introduced**, and 0 line-number pins remain on
any export metadata line.

### Automation readiness
**394 of 469 automatable, up from 392** — the two Parts Velocity cases moved from "expected to fail" to
"passing" because SV-8819 was fixed.

### ⚠️ THE QUEUE STAYS OPEN
Engineering never withdrew the "not final" declaration, and **this deploy proved the point within hours**.
All findings remain **PROVISIONAL** under Rule 49; every row keeps a standing obligation against the next
marker change. Re-read with `curl -s https://sv8582.qa.shopview.com/ | grep app-version` — expect
**`v3.4.1-3d03023`**.

### Outstanding
1. **SV-8819 fixed but still Open in Jira** — needs a status move (not ours: Rules 6/53).
2. **The IV columns defect was NOT filed — a duplicate exists.** **SV-8823** covers both halves by title
   but is **OBSOLETE/Done**, closed on the money half only. Instruction was *"do not file if one exists —
   report instead"*, so nothing was filed. **Re-open SV-8823 for the columns half, or authorise a split
   ticket.** Behaviour re-confirmed live: three different `columns=` requests return a **byte-identical**
   file.
3. **Chris Ward's 47 answers** still outstanding.
4. **A single-location user account** would close the last Location question.
5. **Word when the branch is declared final** — the trigger to close the queue.


> **READ THIS FIRST to resume the Report Suite project.** Single authoritative
> snapshot: status, per-report spec inventory, deliverables index, open
> questions, env/access facts, ordered how-to-resume.

Last updated: **2026-07-31** (COVERAGE RE-DERIVATION FROM THE CURRENT SPECS — 895 requirements enumerated, **888/895 covered, 6 genuine gaps found and ALL CLOSED as extensions (0 new cases)**, **15 cross-case contradictions found and fixed** (the absolute column/header lists vs the new automatic Location column, incl. the authorized SBR S14-R20 export fix), a NEW permanent same-requirement-different-surface check (Location was the only instance in the six specs), 33 update_case EXECUTED 33/33 verified, run 359 verified untouched 474/474 tests + 539/539 results, 474 active unchanged, live 4281 = 474 ours + 5 foreign untouched — see §0 UPDATE 2026-07-31-COVERAGE-REDERIVATION immediately below). Prior: (CLOSING AUTHENTICITY PASS — 474 active, Rule-20 traceability 114/472 -> 474/474, 288 over-cap titles -> 0, the SV-8589 QuickBooks gap CLOSED, Rule-28 three-dimension audit 474/474 with 0 contradictions, 414 update_case + 2 add_case EXECUTED and verified zero-diff, run 359 synced 472 -> 474 with results unchanged; **5 FOREIGN cases C38919-C38923 found inside group 4281 and left untouched pending a decision** — see §0 UPDATE 2026-07-31-CLOSING immediately below). Prior: SPEC RE-DIFF + CHRIS'S 5 ANSWERS APPLIED + AUTHORIZED PUSH EXECUTED + RUN-359 SYNCED — see §0 UPDATE 2026-07-31. Prior: **2026-07-30, third update** (COMPANION VIDEO INGESTED + DELTA PASS + AUTHORIZED
PUSH EXECUTED — Chris Ward's PRD companion video arrived (Loom e4a3ad0191…; transcript + 20-point
delta analysis in `chris-update-2026-07-29/`); 3 FIRM deltas → 7 update_case pushed under the
user's same-day authorization ("do update the test cases if you learn that the video is warranting
for that"), 7/7 HTTP 200 + re-GET MATCH, tally UNCHANGED 465, R359 untouched, live count under
group 4281 = 465 == id-map; 13 notes-only annotations local; 0 new cases; Q5 (Rep-label scope)
appended to the unsent Chris sheet; SPEC-WATCH: companion-video item CLOSED, new items #9–#12
added, changelog deadline 2026-08-04 stands; see §0 UPDATE 2026-07-30-C). Prior same day, second update (TECH-PLAN PUSH EXECUTED — the ChangeList-2026-07-30 §C
queue is LIVE under explicit user authorization "Push all three": 5 update_case [WIP-API-01 C30528 /
SBR-STAT-02 C30209 / PV-CALC-07 C30365 / SBC-API-02 C30191 / IV-EXP-07 C30593] + 5 add_case
[PV-EXP-11 = C38885 / TU-EXP-09 = C38887 / WIP-CALC-10 = C38890 / IV-DATE-09 = C38892 /
SBR-CALC-09 = C38894], 10/10 HTTP 200 + re-GET MATCH, 0 deletes, R359 untouched; **suite 465 active
LIVE under group 4281 == id-map 465/465, 0 blanks**; tech-plan push authorization CONSUMED; audit =
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "TECH-PLAN PUSH 2026-07-30"
ops 163–172; see §0 UPDATE 2026-07-30-B). Prior earlier same day: TECH-PLAN RECONCILIATION applied locally — 7 edits + 5 new cases, tally 465, push queue 5 update + 5 add awaiting authorization; see §0 UPDATE 2026-07-30. Prior: **2026-07-29, fourth update** (WAVE-2 PUSH EXECUTED — the 4 WIP VIN-chain
update_case [WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03 C30485 / WIP-EXP-07 C30516]
pushed under explicit user authorization "Push", 4/4 HTTP 200 + re-GET MATCH, live count under
group 4281 = 460 == id-map, R359 untouched; **suite 460 active, ALL current with Chris's
rulings; wave-2 authorization CONSUMED**; audit =
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "WAVE-2 PUSH 2026-07-29";
see §0 UPDATE 2026-07-29-D). Prior same day, third update (CHRIS ANSWERED THE WIP-IDENTIFIER
QUESTION = **A**:
WIP also uses the **VIN → Unit # → plate** chain — the chain is now the STANDARD for all reports
and all future work; 3 WIP cases + the WIP-EXP-07 caveat flipped LOCALLY, wave-2 push queue = 4
update_case awaiting authorization; see §0 UPDATE 2026-07-29-C). Earlier same day: AUTHORIZED
CHRIS-UPDATE PUSH EXECUTED — 24 update_case
+ 1 add_case [TU-COL-01 = C38859], 25/25 HTTP 200 + re-GET MATCH; **460 active LIVE in TestRail ==
460 local**; see §0 LATEST block). Earlier same day: 3 authorized TestRail fixes executed + Chris
Ward group-message delta pass applied LOCALLY (change-list =
`chris-update-2026-07-29/ChangeList-2026-07-29.md`, now EXECUTED; see §0 second block). Prior 2026-07-28, second
update (FULL TESTRAIL PUSH EXECUTED — see §0 second block:
459 active cases live, SBC-EXP-16 = C38856, 57 deletions, R359 515→458 documented. Earlier same
day: VIDEO PROMOTED TO AUTHORITATIVE — 27 local case edits + 1 new case
SBC-EXP-16 + 1 retire-proposed SBC-EXP-13; backups in `video-promotion-backup-2026-07-28/`;
spec-watch `SPEC-WATCH-2026-07-28.md` deadline 2026-08-04; see §0 first block. Prior 2026-07-22:
CASES IMPORTED + C-IDs MAPPED READ-ONLY — all
515 cases now live in TestRail under group 4281 "Reports Suite"; run **R359
"Reports Suite - Nebojsa/Viktoria (VIU Pending)"** exists [515 tests, all
Untested]; `testrail-id-map.csv` fully populated with real C-ids, range
**C30096–C30610** [515/515 matched by exact section-leaf-name + exact title,
0 unmatched / 0 ambiguous / 0 leftover TR cases]; NO TestRail writes made —
read-only get_sections/get_cases only. Earlier same day: PER-REPORT IMPORT
SPLIT DELIVERED; ADVERSARIAL REVIEW DONE — both auditors CLEAN after fixes;
import REGENERATED post-review.)

---

## §0 UPDATE 2026-07-31-COVERAGE-REDERIVATION (LATEST — read first)

**COVERAGE RE-DERIVATION FROM THE CURRENT SPECS + 6 GAPS CLOSED + 15 CONTRADICTIONS FIXED +
33 update_case EXECUTED AND VERIFIED. Run 359 verified untouched. 474 active, unchanged.**

Folder: `build/report-suite/coverage-rederivation-2026-07-31/`.

### Why this pass existed
Every earlier coverage matrix (`coverage-sbc.md` … `coverage-iv.md`) was built against an
**older spec version**, and all of today's earlier work ran off the **spec DIFF**. A diff
proves the *changes* are covered; it cannot prove nothing was **already** missing. This pass
re-derived coverage from the six live specs from scratch, requirement by requirement. The six
old matrices now carry a **SUPERSEDED-for-the-completeness-question** banner pointing here.

### Result
| | |
|---|---|
| Requirements enumerated in the 6 current specs | **895** (SBC 234 · SBR 234 · PV 73 · TU 120 · WIP 122 · IV 112) |
| Covered **before** this pass | 882 (865 by anchor + 17 by case text with a missing/mis-typed anchor) |
| Covered **after** | **888 / 895** |
| Genuine gaps found | **6** → **all closed** |
| Not covered by design | **7** (4 cut by the 2026-07-28 audit · 3 not independently testable) |
| Stale or invented anchors on active cases | **0** |
| Cases added / deleted | **0 / 0** — **474 active, unchanged** |

### The 6 gaps — all one defect class
All six were the **export half** of the per-row **Location** column added suite-wide on
2026-07-29: **SBC S4-R13 · SBR S14-R20 · PV S6-R11 · TU S7-R13 · IV S10-R15**, plus
**TU S8-R16** (accessible name of the icon-only Column Selection button). Closed as **6
EXTENSIONS, 0 new cases** — the case that already owns the column also already establishes
the >1-location scope, so five new "the export has the column" cases would have been the
audit's own export-duplication slop pattern. **WIP had no gap** because WIP-FLT-09
([C38916](https://shopview.testrail.io/index.php?/cases/view/38916)) already opens the file.
Extended: SBC-LOC-04 C38912 · SBR-LOC-05 C38913 · PV-FILT-14 C38914 · TU-LOC-06 C38915 ·
IV-LOC-06 C38917 · TU-COL-01 C38859.

### 15 CONTRADICTIONS found by the Rule-28 Stage-2b sweep, all resolved
Fifteen older cases enumerated a column/header list in absolute terms (*"Exactly these 14
columns show"*, *"these thirteen columns in this exact order"*, *"the headers, in order, are
exactly …"*) with **no mention of Location** — so in any two-location organisation those cases
and the Location cases **could not both be true** and a tester would fail a correct build.
Every list is now **scope-conditional** (exact for one location; states where Location joins
it otherwise), following WIP-COL-01 (C30466) which already did this. Repaired: SBC-EXP-03/11/16,
SBR-EXP-03/04/10/11, PV-COL-02/03, IV-COL-01/04, IV-PERS-02, SBR-ROW-02, TU-HRS-02, and
SBC-EXP-08 (refs only). **This includes the user-authorized SBR `S14-R20` export fix.**

### NEW PERMANENT CHECK — same-requirement-different-surface
`sweep_surface.py` finds a requirement that governs the screen **and** the export where our
cases only assert one surface — the blind spot a coverage matrix cannot see. Run over all 895:
**165 speak about a non-screen surface; 2 flagged; both false positives.** **The Location
column was the ONLY instance of this defect class in the six specs.** Keep this in the pipeline
alongside the coverage re-derivation (they catch different halves: this one catches
half-asserted requirements, the re-derivation catches wholly-unasserted ones).

### TestRail
**33 `update_case`, 33/33 HTTP 200 + re-GET byte-verified MATCH, 0 failures.**
0 `add_case` · 0 `delete_case` · 0 `add_section` · **0 titles changed** · 0 `section_id`
changed. Run **359** (`include_all: false`) snapshotted and re-read: **tests 474 → 474,
results 539 → 539**, every prior case_id present, no new case_id — Rule 34's union-add was a
**no-op** because 0 cases were added. No other run touched.
**Live under group 4281 = 479 = OUR 474 + Vladimir Tomovic's 5 foreign cases
(C38919–C38923), which were never touched (Rule 38).**
Manifest `testrail-sync-manifest-2026-07-31.md` (header = EXECUTED); per-op audit
`testrail-execution-log-2026-07-31.md`; executor `exec_push_2026-07-31.py` (resumable via
`oplog.json`).

### SOURCE-CURRENCY (Standing Rule 31)
| Source | Identifier | Version / updated | Checked | Verdict |
|---|---|---|---|---|
| Spec — Sales By Customer | pageId 577634305 | **v12**, 2026-07-29 (Chris Ward) | 2026-07-31 | CURRENT |
| Spec — Sales By Representative | pageId 585629698 | **v15**, 2026-07-29 | 2026-07-31 | CURRENT |
| Spec — Parts Velocity | pageId 620888066 | **v4**, 2026-07-29 | 2026-07-31 | CURRENT |
| Spec — Technician Utilization | pageId 641400833 | **v5**, 2026-07-29 | 2026-07-31 | CURRENT |
| Spec — WIP | pageId 703660034 | **v6**, 2026-07-29 | 2026-07-31 | CURRENT |
| Spec — Inventory Value | pageId 720142338 | **v3**, 2026-07-29 | 2026-07-31 | CURRENT |
| Epic + children | **SV-8582**, 97 children | Tier-1 currency check (`build/epic-recheck-2026-07-31/`); 6 reopened stories noted | 2026-07-31 | CURRENT |
| Designs | none exist | spec-only project — no Figma file, so nothing to be stale | 2026-07-31 | N/A |
| Engineering tech plan | `tech-plan-2026-07-29/` | 2026-07-29 | 2026-07-31 | CURRENT |
| PO answers / message / video | Chris 2026-07-31 answers · 2026-07-29 message · PRD video 2026-07-30 | newest = 2026-07-31 | 2026-07-31 | CURRENT |

**Live-build status:** no QA branch/environment exists. **Nothing in this pass is
live-verified**; all 474 cases remain `VIU-Pending` (Rules 12/22).

### Deliverables
`COVERAGE-REDERIVATION.md` · `requirement-coverage.csv` (895 rows) · `judgements.json` ·
`coverage-summary.json` · `AUTHORING-COVERAGE.md` · `RULE28-AUDIT.md` ·
`surface-split-findings.json` · `rederive_coverage.py` · `author_gaps.py` · `repair_2b.py` ·
`sweep_2b.py` · `sweep_surface.py` · `exec_push_2026-07-31.py` · `pre-write-snapshot/` ·
`post-push-verify/` · `backup/` + `backup-2b/` · manifest + execution log.

### Carried to Chris Ward (NOT resolved by us — Rule 15)
1. **SBR spec v15 is self-inconsistent:** `S14-R15`/`S14-R16` still enumerate the export
   headers as a fixed set while the newer `S14-R20` (same version) says the Location column is
   included in the exports whenever it is on screen. Our cases follow the **newer** `S14-R20`
   (Rule 32). Chris needs to confirm and correct the older lines.
2. **SPEC-WATCH (deadline 2026-08-04) stands:** the over-cap export message he ruled on
   2026-07-31 and the WIP VIN → Unit # → plate chain he ruled on 2026-07-29 are still not in
   the six spec pages.
3. Where the Location column sits inside the **SBC and SBR Summary** files (those files have
   no Date/Status column for it to follow) — left "confirm in the build", not invented.

### One-line resume
Coverage is now provably complete against the current specs (**888/895, 0 open gaps**) and the
suite is internally consistent (**0 contradictions**). Next: the Chris question sheet
(`PO-Questions-Chris-ReportSuite-2026-07-31`), then live VIU when a QA branch exists.

---

## 0. STATUS

### UPDATE 2026-07-31-CLOSING — CLOSING AUTHENTICITY PASS: every case traceable, sensible, layman-runnable, in its run

**One line: the suite is 474 active cases, all 474 now carry BOTH a Jira ticket and a spec anchor
(114 did before), no title exceeds 80 characters (288 did), the one genuine gap in epic SV-8582 is
closed, and live TestRail is byte-equal to the local source — verified by a zero-diff re-run.**

| | Before this pass | After |
|---|---|---|
| Active cases | 472 | **474** |
| Rule-20 compliant `refs` (ticket **and** spec anchor) | 114 / 472 | **474 / 474** |
| Titles over 80 characters | 288 | **0** |
| Duplicate titles | 2 groups (6 cases) | **0** |
| `refs` over the TestRail cap / carrying a comma | 17 / 52 | **0 / 0** |
| Stale spec anchors | 1 | **0** |
| QuickBooks / fractional-quantity coverage | **0 cases** | 2 |
| Run 359 tests · recorded results | 472 · 539 | **474 · 539 (unchanged)** |

**Deliverables (all under `build/report-suite/authenticity-2026-07-31/`):**
`TRACEABILITY-AUDIT.md` · `QUICKBOOKS-GAP-CLOSED.md` · `TITLE-TRIM-REPORT.md` ·
`audit/RUTHLESS-AUDIT-2026-07-31-CLOSING.md` + `audit/per-case-verdicts-2026-07-31.csv` ·
`testrail-push-manifest-closing-2026-07-31.md` (EXECUTED) ·
`testrail-execution-log-closing-2026-07-31.md` · scripts `audit_traceability.py`,
`backfill_refs.py`, `add_qb_precision_cases.py`, `trim_titles.py`,
`audit/consistency_sweep.py`, `audit/gen_verdicts.py`, `audit/apply_repairs.py`,
`exec_push_closing_2026-07-31.py` · logs `refs-backfill-log.json`, `title-trim-log.json`,
`audit/repair-log-2026-07-31.md` · 415 pre-push `get_case` snapshots.

**Phase 1 — traceability (the big one).** All 472 audited; 358 had a spec anchor but no ticket.
Backfilled with per-story precision from the live SV-8582 epic ingest (80 story keys parsed
programmatically out of the story titles — **no ticket invented**). Also found and fixed **5
MIS-CITED tickets** the earlier pass had counted compliant (SBC-LOC-01 = C30109 and
SBC-LOC-04 = C38912 → SV-8603; TU-ELL-02 = C30405 → SV-8649; WIP-COL-01 = C30466 and
WIP-COL-02 = C30467 → SV-8660) and **1 stale anchor** (SBC-API-05 = C30194 cited SBC Story 16 /
S16-R6 = Print, which the current spec v12 marks "(removed — Print retired)").
**5 cases genuinely have no single owning story and now say so in the ref text** — chief among them
**TU-COL-01 = C38859**, whose TU Story 10 has **no Jira ticket in the epic at all** (the spec's own
Jira field reads `TBD`); it had been mis-cited to SV-8655. A 6th §-only case, WIP-CALC-07 = C30480,
turned out to HAVE an owner (SV-8660, S4-R15 verbatim) and is now cited per-story.
Every one of the 80 per-story tickets is cited by at least one case except SV-8614 (SBC Story 16 —
Print), correctly, because that story is retired.

**Phase 2 — the QuickBooks gap.** SV-8589 (In Progress since 2026-07-29) names two tests verbatim —
*"fractional-quantity round-trip regression; QB journal amount exact from fractional movement"* —
and a grep of all 529 local bodies returned **0** hits for "quickbooks" and **0** for "fractional".
Authored exactly two cases, justified in `QUICKBOOKS-GAP-CLOSED.md`:
**PV-PREC-01 = C38924** (PV — Columns & Calculations; the ShopView-side round-trip) and
**PV-PREC-02 = C38925** (PV — API per Rule 4; the QuickBooks journal-amount side). A third
"negative/reversed fractional" variant was considered and **rejected as padding**. PV-PREC-02 has
**no report-spec anchor** — none of the six specs mention QuickBooks — so its `refs` says so and
anchors on SV-8589 + `tech-plan-2026-07-29` Phase 0 / PR-1 D2.

**Phase 3 — titles + the epic premise.** 294 titles changed (288 over-cap → 0, plus 6 re-worded for
uniqueness): 206 hand-written, 77 cut only at a STRONG clause boundary, 3 compressed, 8
de-duplicated. **No distinguishing detail lost — proven**: the dropped words of every trimmed title
were searched in that case's own Preconditions/Steps/Expected/notes; the 51 that flagged were
hand-checked by assertion and all 51 already carried the content. Rule-9 guardrail: a first draft
compressed report names to `SBC`/`SBR`/`WIP` — **removed** after confirming those strings appear in
**0** existing titles (internal jargon, not build labels).
`epic-sv8582/RECONCILIATION.md` **corrected**: it called SV-8594–8599 "OBSOLETE … superseded /
historical detail only", but a developer reopened all six OBSOLETE→Open on 2026-07-29 and moved
SV-8589 to In Progress. Status table, by-status counts (now OBSOLETE 6 / Open 90 / In Progress 1),
all six per-row statuses and the framing are fixed. **What the re-activation requires of the suite
was VERIFIED, not repeated** — a per-report sweep over all 474 cases against every testable item
the reopened stories put back in force: 1 genuine gap (closed in Phase 2), everything else already
covered **including the negative** ("no reader this version" — no WIP case asserts an as-of/history
reader), 0 contradictions introduced.

**Phase 4 — Rule-28 three-dimension re-verify, all 474.**
**D1 USEFUL: KEEP 424 / WEAK-KEEP 50 (user-retained, flagged) / MERGE 0 / CUT 0.**
**D2a SENSE: SENSIBLE 474 / NONSENSE 0.**
**D2b CROSS-CASE: 33 mechanical flags raised, all 33 adjudicated, CONTRADICTIONS 0 remaining and 0
PENDING.** **D3 GENUINE + LAYMAN: 474/474 on both halves.** KEEP-but-NONSENSE: empty.
**14 real defects found in our own work and repaired before delivery** — 8 spec-anchor leaks in
tester-facing text (`(per S3-N1)`, `matches §3:`, `(S2-E4)`, `(per S1-R8)`, `(Earned per S4-R19…)`,
`the on-screen S4-E1 behavior`, `(consistency goal, §1)`, `excluded per S3-N1`) which the push
script's `clean()` does **not** strip; 3 trimmed titles that had stopped naming their own report
(SBR-PERM-01 = C30198, WIP-PERM-02 = C30527, TU-NAV-07 = C30398); 1 non-actionable expected line
(PV-EXP-05 = C30379, "confirmed in the build"); and **2 of the 3 deliberately-failing permission
cases were missing their plain tester note** — verified against LIVE TestRail that only
SBC-PERM-01 = C30098 had it, so the identical note was added to SBC-PERM-02 = C30099 and
SBC-NAV-01 = C30096.
Two honest cluster rulings: the 6 per-row Location columns are KEEP (position, "Multiple" rule and
export header genuinely differ per report), and the 4 single-table over-cap export cases are KEEP on
engineering evidence — SV-8591 verbatim says the guard *"Takes a count callable/query per report"*,
so each report's cap can fail independently.

**Phase 5 — push + run 359 + reconcile.** **414 `update_case` + 2 `add_case` + 0 deletes, all HTTP
200 + re-GET verified.** Final proof: a re-run of the executor's diff against a fresh live snapshot
reports **`updates 0 · adds 0 · no-op 474`**. Run **359** union-synced 472 → **474 tests** with
**539 recorded results UNCHANGED** and every prior case still present; no result was ever written,
no other run touched. Deliverables regenerated over 474 (id-map 474 rows / 0 blanks; unified import
474 rows; 6 splits 83+111+71+60+79+70 = 474; **import header byte-identical across all five project
imports**; 0 VIU words, 0 flag phrases, 0 internal-id leaks, 0 duplicate titles, 30 API cases none
outside an "API" section).
**One real push failure, diagnosed:** `update_case/30195` (SBR-NAV-01) returned **HTTP 400** because
its `refs` was **exactly 250 characters** — the cap boundary is **EXCLUSIVE**, so 250 is rejected
while 243 passes. Ref compressed to 208 (all requirement tokens kept), assertion tightened to ≤245,
and the sharpened boundary written back to `build/APP-ACTIONS-PLAYBOOK.md`.

**⚠️ OPEN — 5 FOREIGN CASES INSIDE OUR GROUP, LEFT UNTOUCHED, NEEDS A DECISION.** Live count under
group 4281 is **479**, not 474. Five cases — **C38919 · C38920 · C38921 · C38922 · C38923** —
appeared at 2026-07-30 15:54Z with **no trace anywhere in this repository**. They are not ours, they
carry **no `refs` at all**, every title is **over 80 characters**, `custom_atmstatus` is **1** (our
convention is 3), and their subjects read like **duplicates of cases we own** (TU-COL-01 = C38859,
PV-FILT-14 = C38914, and the IV/WIP/SBR export-`Locations:` assertions already in IV-EXP-02 = C30588,
WIP-EXP-01 = C30510, SBR-EXP-02 = C30277). They were **not edited, not deleted and not added to run
359.** Reconciliation therefore reads **479 live = 474 ours + 5 foreign**, itemised in
`testrail-execution-log-closing-2026-07-31.md` rather than absorbed. **Three-way match on our own
population: live 474 == id-map 474 == import 474.**

**Still open after this pass (unchanged by it):** Chris Ward's ruling on the **SBR Escape-key**
conflict (SBR-DEACT-04 = C30255 asserts Escape does NOT dismiss per Golden Rule #9, while spec
S13-R8 wants it to — engineering escalated it as an open decision) and the **SBC permission-bundle**
question; the SPEC-WATCH changelog deadline **2026-08-04**; and **live VIU for all 474 cases, still
blocked on a QA branch that does not exist** — every case remains `VIU-Pending` and **nothing in
this pass is live-build-observed** (Rule 22: no step here required it).

---

### UPDATE 2026-07-31 — SPEC RE-DIFF (all six specs now CURRENT) + CHRIS'S 5 ANSWERS APPLIED + PUSH EXECUTED + RUN 359 SYNCED

**Resume here. This is the current state.**

**1. All six Confluence specs were re-pulled LIVE (Rule 31) — the promised changelog HAS landed.**
Every page moved on **2026-07-29**, each with a new dated Change Log row: **SBC v11→v12 · SBR
v14→v15 · PV v3→v4 · TU v4→v5 · WIP v5→v6 · IV v2→v3**. Verbatim captures +
per-report unified diffs + the full requirement-by-requirement diff:
`spec-current-2026-07-31/` (`SPEC-DIFF-2026-07-31.md`, `*-current.md`, `*-raw-unified.diff`,
`capture_specs_2026-07-31.py`). The capture pipeline was validated 6/6 byte-identical against the
2026-07-28 baseline, so every difference is a real Chris edit.

**SPEC-WATCH verdicts (`SPEC-WATCH-2026-07-28.md` updated):** **RATIFIED/CLOSED — 1a** (SBC VIN
chain), **2** (SBC Print retired), **3** (Summary/Expanded exports, extended to four menu items),
**5** (per-row Location column on all six + "Locations:" export line), **7** (Catalogue → **"Special
Order"**), **12** (rep-label scope, answered). **STILL OPEN — 1b, 4, 6, 8, 9, 10, 11.** The one to
put in front of Chris first is **1b: the WIP asset-identifier text is UNCHANGED** (§4, S4-R7/R8/R9,
S7-R4 still unit-number-first) even though he told us he had already edited it — our WIP cases
follow his later answer, so the spec and the cases are out of step until he fixes it. Items **4**
(the four "single-location user still sees the filter" notes) and **9** (SBR "Sales Rep" labels) now
actively CONTRADICT rulings he gave us afterwards. The 2026-08-04 deadline is **partly met** — the
changelog landed on time, but not everything he believed he had edited is there.

**2. Chris Ward's 5 TechPlan answers are ingested verbatim — all five = option A**
(`chris-answers-2026-07-31/answers-ingested.md`, source workbook preserved in the same folder):
Q1 the Location dropdown is **hidden** for a one-location user (*"classic spec drift"*) · Q2 **one**
suite-wide too-large message, *"This report is too large to export. Narrow the date range or
filters, then try again."* · Q3 the **10,000-row export cap applies to all six** reports · Q4 **every
report is gated by the ordinary reports permission** (*"the intention is to not hide these from
normal reports access. These were specced before CRP was built"*) · Q5 the full word **"Sales
Representative" everywhere** (*"Rep is too much slang"*). 5/5 answered, 0 ambiguous.

**3. THE PERMISSION OUTCOME (the important one): the cases CHANGED and a DEV TICKET IS NEEDED.**
His ruling is on INTENDED behaviour, so it wins (Rules 30/32/33) — but the BUILD ships a dedicated
`ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` atom (tech plan §B5.3) and SBC spec **S1-R2** still states the
dedicated model. So **SBC-PERM-01 (C30098) / SBC-PERM-02 (C30099) / SBC-NAV-01 (C30096) were moved
to the ordinary reports access** — they will FAIL against today's build on purpose, each carrying a
plain tester note — **plus a dev-facing change note: `chris-answers-2026-07-31/Q4-permission-dev-note-2026-07-31.md`**
(raise a change ticket against epic SV-8582; Chris also owes the S1-R2 spec correction). The Q2
mixed-model discrepancy thread from 2026-07-28 is now CLOSED by this ruling.

**4. Consequences applied + PUSHED.** `chris-answers-2026-07-31/DELTAS.md` = 70 APPLY-NOW / 7
NEEDS-NEW-CASE / 13 NO-CHANGE / **0 RETIRE** / 3 STILL-AMBIGUOUS. Executed under the user's
authorization: **70 `update_case` + 7 `add_case` + 0 delete, ALL HTTP 200 + re-GET MATCH, 0
failures**; live count under group 4281 = **472 == id-map 472/472, 0 blanks**. Audit:
`chris-answers-2026-07-31/testrail-execution-log-2026-07-31.md`; manifest header = EXECUTED;
70 pre-write `get_case` snapshots in `chris-answers-2026-07-31/pre-push-snapshot/`.
**NEW TALLY: 472 ACTIVE** (SBR 111 · SBC 83 · WIP 79 · IV 70 · PV 69 · TU 60), all VIU-Pending.

**New cases (Standing Rule 8):** SBC-LOC-04 = **C38912** · SBR-LOC-05 = **C38913** ·
PV-FILT-14 = **C38914** · TU-LOC-06 = **C38915** · WIP-FLT-09 = **C38916** · IV-LOC-06 = **C38917**
(the six per-report per-row **Location column** cases — auto-visibility, the per-report "Multiple"
rule, position, not-in-the-selector, constant-width filter) and WIP-EXP-10 = **C38918** (the WIP
10,000-row export cap, from Q3).

**What the 70 edits were:** one suite-wide too-large message (2) · Q1 refs re-cited to the PO's own
answer (4) and the ruling applied to the two reports that had no case, folded into SBC-LOC-01
C30109 + WIP-FLT-06 C30503 rather than authoring near-duplicates (2) · the SBC permission model (3)
· **"Sales Rep" → "Sales Representative"** across labels, export headers, the assignments download
and its file name, and the deactivation dialog (24) · PV **"Sold via WO/Parts Sale" → "Sold (WO)" /
"Sold (Parts Sale)"** (9) · **Catalogue → Special Order** (16) · TU's ratified **Story 10 Column
Selection**, Est. Lost Labor now hideable, the changed toolbar order, and the **bundled-ShopView-logo**
inversion (6) · SBC Summary/Expanded export detail — 13-column Expanded CSV with Asset, new file
names, per-item loading state, PDF "Locations:" header (5) · WIP Location **out of** the column
selector (2) · plus 41 titles trimmed to ≤80 and 51 audit repairs.

**5. RUN 359 SYNCED (Standing Rule 34).** R359 "Reports Suite - Nebojsa/Viktoria (VIU Pending)" has
`include_all=false`, so new cases do NOT appear automatically. Add-only union `update_run`:
**465 → 472 tests**, and its **539 recorded results are UNCHANGED**; every prior case still present;
all 7 new cases present. Pre-sync snapshot: `pre-push-snapshot/run359.pre-sync-2026-07-31.json`.
**No other run was touched.**

**6. Rule-28 three-dimension audit (mandatory gate) — `chris-answers-2026-07-31/audit/RUTHLESS-AUDIT-2026-07-31.md`.**
77/77 KEEP · 0 NONSENSE · **0 contradictions remaining** · traceability 77/77 · layman 77/77.
The **cross-case consistency sweep ran over all 472 cases** and found 1 real contradiction in this
pass's own work (SBR-WO-01 C30310, title vs its own expected) — repaired; 6 further flagged pairs
were adjudicated as non-contradictions with written reasons. The audit found and repaired **53
defects in our own work before delivery**, the biggest being **44 cases whose `refs` carried a spec
anchor but no Jira ticket** (Rule 20) — backfilled with the exact per-story ticket from the SV-8582
epic ingest, plus 2 mis-cited tickets corrected (SBC Story 1 = SV-8600, not SV-8601).

**7. STILL OPEN after this pass:**
- **Chris owes 8 spec-text corrections** (bundled in DELTAS.md "Spec-text corrections Chris still
  owes"), headed by the **WIP asset identifier** he thinks he already did.
- **3 questions not to guess at** (DELTAS.md A1–A3): does "normal reports access" mean the five
  other reports' per-area report permissions collapse into ONE Reports permission? · does the
  second short-form header **"Rep is active?"** also become "Representative"? · what is the exact
  renamed **assignments file name**?
- **A logo inconsistency across the suite** found by the sweep: TU now says the bundled ShopView
  default always, SBC has a three-step chain ending in *no logo*, PV has no logo requirement at all
  — yet his 2026-07-29 message promised "same logo treatment all reports". Flagged, no case changed.
- **The TU spec's new Story 10 has no Jira ticket** — ask for the key and re-cite TU-COL-01 (C38859)
  and TU-LOC-06 (C38915).
- **Mojibake** in the SBR v15 and PV v4 spec text (`â‹¯` for `⋯`, `â “˜` for `ⓘ`) — cosmetic.
- **288 of the 472 titles still exceed 80 characters** on cases this pass did not touch — worth its
  own authorized title-trim pass.
- **Live VIU is still not possible** — the Report Suite QA branch/env is still unavailable, so all
  472 cases remain **VIU-Pending** and nothing in this pass was live-verified (Rule 12).
- The **SBR staff-dialog Escape vs Golden-Rule** question is still unanswered on the 2026-07-27
  Chris sheet.



**TEST RUN SYNCED 2026-07-31 (Standing Rule 34, user-authorized):** run **R359 "Reports Suite -
Nebojsa/Viktoria (VIU Pending)"** now contains the COMPLETE active Reports Suite — **+7 cases,
458 → 465 tests**, result records unchanged (539 → 539, nothing lost), and the run's case set is
**EQUAL both ways** to the 465 live cases in `testrail-id-map.csv` (0 missing, 0 extra). This is
an add-only `update_run` union write; **no results were written to R359**. Evidence:
`build/testrail-run-sync-2026-07-31/run-sync-execution-log-2026-07-31.md`.

**UPDATE 2026-07-30-C (LATEST — COMPANION VIDEO INGESTED + DELTA PASS + AUTHORIZED PUSH
EXECUTED):** Chris Ward's promised **PRD/Spec Companion video** arrived 2026-07-30 (Loom
https://www.loom.com/share/e4a3ad01912048c0bba88f1a02677004 — canonical pointer; mp4 NOT
committed; transcript verbatim = `chris-update-2026-07-29/companion-video-transcript-2026-07-30.md`;
analysis TRANSCRIPT-based, visual-only details stay VIU-confirm). Per the user's standing ruling
his videos are authoritative product intent, newest-wins. **Delta analysis over the 465 cases**
(`chris-update-2026-07-29/companion-video-deltas-2026-07-30.md`): 20 points = **3 FIRM / 10
CONFIRMATION / 1 PENDING-SPEC / 3 VISUAL-VIU-CONFIRM / 1 CROSS-SQUAD / 2 NO-IMPACT**. FIRM
deltas applied + **PUSHED under the user's same-day authorization** ("do update the test cases
if you learn that the video is warranting for that") — **7 update_case, 7/7 HTTP 200 + re-GET
MATCH, 0 failures**: SBC-NAV-01 C30096 / TU-NAV-01 C30392 / SBR-NAV-01 C30195 / WIP-TAB-01
C30451 (Performance nav: the four anchor items NAMED — Sales, Technician Efficiency, Advisor
Analysis, Shop Efficiency — new reports added BELOW them; SBC's group was previously unknown;
SBR's "at the BOTTOM" re-based), PV-NAV-01 C30322 ("only Parts report" dropped — PV+IV both
under Parts; PV S1-R1 vs IV S1-R1 inconsistency flagged), SBR-WO-06 C30315 (customer-card row
label → **"Sales Representative"**, video-FIRM, supersedes spec S19-R7 "Sales Rep"), SBR-WO-02
C30311 (toggle path Settings → Staff → edit staff member tester-aid; titles >80 trimmed).
**0 adds / 0 deletes — TALLY UNCHANGED: 465 ACTIVE**; R359 untouched; live count under group
4281 = 465 == id-map (465/465 C-ids, 0 blanks). 13 notes-only annotations local (bold-vs-plain
hyperlinks VIU-watch; P/S prefix + customer-compare + export-reflects-page confirmations;
all-six-modeled-after-Technician-Efficiency styling reference; SBR-WO-01 label-pending;
IV-DATE-05 snapshot-indicator corroboration). **0 new cases** (both candidate gaps already
covered — Rule-28 no-slop; mini-audit on the touched 20: USEFUL 7/7 KEEP, SENSE 7/7 SENSIBLE,
GENUINE+LAYMAN 7/7; notes-only 13 unchanged). **Soft/pending NOT pushed:** C15 Rep-label scope
(how far "Representative, the full word" reaches — WO selector / Sales Rep Assignments export)
→ **Q5 appended** to the unsent `PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30.md/.xlsx`;
C20 snapshot-indicator soft ruling ("if snapshot data is taken, we don't need to see this…
offline… or no snapshot") = CONFIRMS current IV S5-R5/R6 + the ratified PV/WIP label removal,
NO contradiction, SPEC-WATCH note only. **SPEC-WATCH:** companion-video expected-artifact item
CLOSED; new watch items #9 (S19-R7 label), #10 (SBC Performance group + anchors), #11 (PV S1-R1
"only report" inconsistency), #12 (Rep-label scope Q5); **spec changelog STILL AWAITED, deadline
2026-08-04 stands.** Deliverables regenerated over 465 (header byte-identical, hygiene clean).
Backups `chris-update-2026-07-29/backup/companion-2026-07-30/` + MANIFEST; apply
`apply_companion_2026-07-30.py`; executor `exec_companion_push_2026-07-30.py`; machine result
`testrail-execution-result-companion-2026-07-30.json`; audit =
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "COMPANION-VIDEO PUSH
2026-07-30" (ops 173–179); ChangeList = `ChangeList-companion-2026-07-30.md` header EXECUTED.
Honesty (Rule 12): all edited cases remain VIU-Pending — nothing live-verified this pass; the
video's visual content (which links are bolded, the exact screens) was NOT available in the
transcript and stays VIU-confirm. Still open: Chris changelog re-diff, Q1–Q5 answers, live VIU
pending the QA branch.
**STATUS 2026-07-30: the 5-question TechPlan sheet (incl. Q5 short-form labels) was SENT to Chris Ward by the user 2026-07-30 — awaiting his answers; on return, ingest verbatim + revisit cases per the standing workflow.**

**PRIOR UPDATE 2026-07-30-B (TECH-PLAN PUSH EXECUTED; explicit user authorization "Push all
three" 2026-07-30):** the staged ChangeList-2026-07-30 §C queue is now LIVE in TestRail —
**5 update_case** (WIP-API-01 C30528 re-run idempotency; SBR-STAT-02 C30209 deposit-seeding
precondition; PV-CALC-07 C30365 Last-Sale re-anchor on reversal; SBC-API-02 C30191 sort-whitelist
safety; IV-EXP-07 C30593 title trim 128→83) + **5 add_case** with new C-ids: **PV-EXP-11 = C38885**
(sec 4335 PV — Exports), **TU-EXP-09 = C38887** (sec 4346 TU — Exports), **WIP-CALC-10 = C38890**
(sec 4354 WIP — Earned & Remaining), **IV-DATE-09 = C38892** (sec 4368 IV — As-of Date &
Snapshots), **SBR-CALC-09 = C38894** (sec 4314 SBR — Inv. Hrs & Calculations), all
custom_atmstatus:3 + custom_automation_type:0. **10/10 HTTP 200 + re-GET verified MATCH, 0
failures; 0 deletes, 0 section writes, run R359 untouched (458 tests all Untested before AND
after). Live count under group 4281 = 465 == id-map.** SBR-BADGE-01 C30226 + WIP-FLT-05 C30502 =
notes-only, NOT pushed (per the ChangeList). Pre-push live snapshots of the 5 update targets:
`tech-plan-2026-07-29/pre-push-snapshot/` (a desired-vs-live diff confirmed each update changes
ONLY its ChangeList fields). Executor `tech-plan-2026-07-29/exec_techplan_push_2026-07-30.py`;
machine result `testrail-execution-result-techplan-2026-07-30.json`; audit log =
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "TECH-PLAN PUSH 2026-07-30"
(ops 163–172); ChangeList header = EXECUTED. **Reconciled deliverables:** id-map 465/465 C-ids
(0 blanks); unified import + 6 splits regenerated over 465 (SBC 82 / SBR 110 / PV 68 / TU 59 /
WIP 77 / IV 69; header byte-identical; hygiene clean — 0 VIU/flag words, 0 internal-id leaks,
29 API cases in API sections, no dup titles); coverage addenda ×6 appended (tech-plan section).
Push authorization CONSUMED. Still open: Chris changelog re-diff (SPEC-WATCH 2026-08-04),
Questions-for-Chris-dev.md Q1–Q3 (drafts, not sent), live VIU pending the QA branch. Honesty note
(Rule 12): all 12 tech-plan-touched cases remain VIU-Pending — every engineering-plan-sourced
expectation is labeled VIU-confirm, nothing live-verified this pass.

**PRIOR UPDATE 2026-07-30 (TECH-PLAN RECONCILIATION APPLIED LOCALLY; NO TestRail writes; read
`tech-plan-2026-07-29/TECH-PLAN-DELTAS.md` + `tech-plan-2026-07-29/ChangeList-2026-07-30.md`
first):** the engineering tech plan (user upload 2026-07-29; verbatim copy =
`tech-plan-2026-07-29/TechPlan-Reports-Suite-Full-Implementation.md`) was reconciled against the
460 cases. **Applied LOCALLY:** 7 case edits (WIP-API-01 C30528 snapshot re-run idempotency;
SBR-STAT-02 C30209 deposit-covered-prepaid seeding + SBR-BADGE-01 C30226 note; PV-CALC-07 C30365
Last-Sale re-anchor on reversal; SBC-API-02 C30191 sort-whitelist safety; WIP-FLT-05 C30502
created=start-date seeding note [local-only]; IV-EXP-07 C30593 title trim — cap 10,000 locked by
Chris 07-21 per plan) + **5 NEW cases** (PV-EXP-11 + TU-EXP-09 over-cap export refusal [spec-silent,
tech-plan-sourced, flagged]; WIP-CALC-10 running-clock counts toward Labor Earned [legacy code
dropped open clocks]; IV-DATE-09 recorded day survives category/vendor rename/delete; SBR-CALC-09
post-invoice clock edit updates Inv. Hrs, billed sell unchanged). Backups
`tech-plan-2026-07-29/backup/` + MANIFEST; apply script `apply_tech_plan_2026-07-30.py`.
**PERMISSION-MODEL FINDING (Q2):** the tech plan CONFIRMS the mixed model as deliberate design
(SBC dedicated atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` — bundle placement explicitly "a
product-level decision to surface"; PV Inventory Reports→View; IV ROLE_REPORT_VIEW; SBR/TU/WIP
existing report access) — sharpens but does NOT settle Chris's Q2 ("normal reports access");
Q2 note QA-internal section updated with citations; permission cases stay AS AUTHORED (Ruling 1).
**Conflicts flagged, NOT rewritten** (`Questions-for-Chris-dev.md`, DRAFT not sent): Q1
single-location Location-filter (plan says visible, video P33 says hidden — cases stay
video-authoritative), Q2 two different too-large messages (SBC spec vs IV spec/plan), Q3 cap
missing from PV/TU/WIP spec pages; SBR-Esc + permission-model questions already open elsewhere.
**14 VIU-prep facts** recorded in TECH-PLAN-DELTAS §5 (backfill-NULL on historical SBC/SBR money;
SBR credit forward-only → historical = Unassigned; snapshot crons; localStorage key
`report_view:<slug>`; location switch clears cache; WIP client-side architecture; etc. — READ
BEFORE the QA-branch VIU). **NEW TALLY: 465 ACTIVE authored** (460 live in TestRail + 5 new blank
C-ids); deliverables regenerated over 465 (unified + 6 splits, header byte-identical, hygiene
clean: 0 VIU/flag words, 29 API cases all in API sections); id-map 465 rows, 460 C-ids re-merged.
**Rule-28 audit on the touched/new 12: USEFUL 12/12 KEEP · SENSE 12/12 SENSIBLE · GENUINE+LAYMAN
12/12.** **PUSH QUEUE AWAITING AUTHORIZATION: 5 update_case (C30528, C30209, C30365, C30191,
C30593) + 5 add_case (the new cases); 0 deletes; R359 untouched** — manifest = ChangeList
2026-07-30 §C. SPEC-WATCH 2026-08-04 unchanged (Chris changelog still pending; the WIP snapshot
re-run + cap items feed the re-diff).

**PRIOR 2026-07-29 (session complete — state-save):** wave-2 pushed (commit e2201e2; see UPDATE
2026-07-29-D), leadership process doc delivered (commit 75ad986:
`build/Test-Case-Creation-and-Refinement-Process_2026-07-29.docx` + simple guide commit 3e18b3e),
QA meeting notes ingested (`build/meetings/Daily-QA-Meetup-2026-07-29-notes.md`),
execution-discipline convention recorded. **Awaiting:** Chris spec changelog (re-diff incl. WIP
VIN text; SPEC-WATCH 2026-08-04), companion video, QA branch for VIU. **NEW active thread
2026-07-29: Simple Flow sell-price bug investigation** (Fabian/founder concern — sell stays 0
when cost changes on the Receive Parts screen; coverage check in progress).

**SESSION CHECKPOINT 2026-07-29 (pre-limit #2) — COLD-RESUME ANCHOR (read this first on resume).**
- **Suite = 460 active** (459 live in TestRail + wave-2 pending). Chris answer A APPLIED LOCALLY
  (commit 858479d). **PENDING: a 4-case wave-2 TestRail push queue AWAITING USER "push"
  AUTHORIZATION: WIP-COL-05 C30470, WIP-FLT-03 C30500, WIP-SORT-03 C30485, WIP-EXP-07 C30516**
  (VIN → Unit # → plate chain per Chris 2026-07-29; the manifest = the "Push queue — wave 2"
  section of `chris-update-2026-07-29/ChangeList-2026-07-29.md`; condense refs to the 250-char
  cap at push time; run R359 untouched — never write to it).
- **VIN chain = durable cross-report standard** (VIN → Unit # → plate; recorded in CLAUDE.md);
  the VIN-vs-serial terminology caution is ACTIVE (build label stays "VIN"; non-vehicle assets
  effectively show the serial number — plain tester note where the label is read).
- **SV-8721 side project FULLY CLOSED** (staging + prod verified; Jira comment 74275 upgraded
  with 4 inline screenshots; production recipes recorded in build/APP-ACTIONS-PLAYBOOK.md §K).
- **SPEC-WATCH:** Chris's spec changelog expected imminently — his edit was NOT hand-reviewed, so
  the re-diff must confirm the WIP identifier text too; deadline **2026-08-04**
  (`build/report-suite/SPEC-WATCH-2026-07-28.md`).
- **QA-QUALITY-PIPELINE-EXPLAINER.md + Blocked-revisit standing loop:** check whether the
  explainer worker's files landed (expected: build/QA-QUALITY-PIPELINE-EXPLAINER.md +
  build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md + PROCESS-CATALOG.md + CLAUDE.md updates — committed
  b3d241c as of this checkpoint); if absent/incomplete on resume, re-create per the user's
  2026-07-29 instruction (the 9-step pipeline doc ending with the tester-Blocked manual-revisit
  loop; instruction quoted in the session transcript).
- **Awaiting:** Chris's spec changelog + companion video; the QA branch/env for live VIU.
  (Wave-2 push authorization was granted + CONSUMED 2026-07-29 — see UPDATE 2026-07-29-D.)

**UPDATE 2026-07-29-D (LATEST — WAVE-2 PUSH EXECUTED):** the wave-2 queue is LIVE — exactly 4
update_case (WIP-COL-05 C30470, WIP-FLT-03 C30500, WIP-SORT-03 C30485, WIP-EXP-07 C30516; the
VIN → Unit # → plate chain edits per Chris's answer A), executed under explicit user
authorization "Push" 2026-07-29, **4/4 HTTP 200 + re-GET byte-verified MATCH, 0 failures;
NOTHING else written** (no adds/deletes/section/run writes; R359 untouched); refs condensed to
the 250-char cap at push (full text stays in local spec_ref); pre-push live snapshots saved
(`chris-update-2026-07-29/pre-push-snapshot/*.pre-wave2-push-2026-07-29.json`); live count under
group 4281 = **460 == id-map — suite 460 active, ALL current; wave-2 authorization CONSUMED.**
Executor `chris-update-2026-07-29/exec_wave2_push_2026-07-29.py`; audit
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "WAVE-2 PUSH 2026-07-29";
ChangeList wave-2 header = EXECUTED.

**UPDATE 2026-07-29-C (CHRIS ANSWERED THE WIP-IDENTIFIER QUESTION: "A is the correct
answer"; applied LOCALLY, NO TestRail writes; read this first).**
- **Answer = A (verbatim, user-relayed):** the Work In Progress report **ALSO uses VIN, falling
  back to Unit #, then plate** — same chain as Sales By Customer. Verbatim answer + his two
  standing notes: `chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`.
- **DURABLE STANDING RULING (Chris, verbatim): "Not just for these specs though -- really good to
  keep this in mind for all actions moving forward."** = the **VIN → Unit # → plate identifier
  chain is the STANDARD for all reports and ALL future work.** Plus his terminology caution: VIN =
  VEHICLE identification number — for non-vehicle assets (e.g. a generator) the value is
  effectively the unit's **serial number**; keep the build label "VIN" (Rule 9) and carry a short
  plain tester note where the label is read.
- **Applied LOCALLY (backups `chris-update-2026-07-29/backup/` + MANIFEST wave-2 section; script
  `apply_wip_answer_2026-07-29.py`):** WIP-COL-05 C30470 (Asset cell), WIP-FLT-03 C30500 (asset
  filter options + type-ahead), WIP-SORT-03 C30485 (Asset sort key) flipped serial → VIN chain,
  mirroring the SBC-LBL-01 C30134 wording pattern, + tester VIN-terminology note on COL-05/FLT-03.
  Full 6-report serial sweep found ONE more remnant: **WIP-EXP-07 C30516** expected-#4 caveat
  re-based on the VIN chain (caveat still reads correctly — export header text stays unpinned).
  SBC-LBL-01 notes-only residue closed (local metadata, not pushed). No other case in any report
  uses "serial" as an asset identifier (SBC-LBL-02/03 mentions = Retired-case history, untouched).
- **Push queue WAVE 2 = 4 × update_case (WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03
  C30485 / WIP-EXP-07 C30516), AWAITING fresh push authorization** (Rule 6) — queue in
  `chris-update-2026-07-29/ChangeList-2026-07-29.md` § "Push queue — wave 2".
- Rule-28 mini-audit on the 4 flipped: USEFUL 4/4 KEEP · MAKES SENSE 4/4 SENSIBLE · GENUINE +
  LAYMAN-RUNNABLE 4/4. Deliverables regenerated over 460 (unified + 6 splits, header
  byte-identical, hygiene clean); id-map C-ids re-merged 460/460.
- **SPEC-WATCH:** Chris updated the spec before bed but has **NOT hand-reviewed it** — when the
  changelog lands (~2026-07-30), the re-diff must confirm the **WIP identifier text** too
  (`SPEC-WATCH-2026-07-28.md` item #1 updated; deadline 2026-08-04 stands).

**UPDATE 2026-07-29-B (AUTHORIZED CHRIS-UPDATE PUSH EXECUTED).**
- **The Chris-update push queue is EXECUTED (explicit user authorization 2026-07-29): exactly
  24 update_case + 1 add_case per `chris-update-2026-07-29/ChangeList-2026-07-29.md`, NOTHING
  else.** All 25 ops HTTP 200 + re-GET verified MATCH (title/preconds/steps/expected/refs; the
  add also section + atm fields), 0 failures. **TU-COL-01 = C38859** (section 4348 "TU — Visual
  & Accessibility"; custom_atmstatus:3 + custom_automation_type:0). No deletes, no section
  writes, no run writes — **R359 untouched**; only group 4281 touched.
- **Live count under group 4281 = 460 == id-map (460/460 rows, 0 blank C-ids).** Deliverables
  regenerated over 460: unified import + 6 per-report splits (header byte-identical 7/7; 0 VIU
  words, 0 feature-flag words, 0 internal-id leaks, 0 dup section+title; 29 API cases all in
  "— API" sections; splits row-set == unified) + coverage addenda ×6 updated to C38859.
- **Refs-cap convention applied** (same as SBC-EXP-01/SBR-LOC-03 on 2026-07-28): 14 of the 25
  refs condensed to the TestRail 250-char cap at push; full ticket+anchor text stays in local
  `spec_ref` / import References.
- Audit: execution log § "CHRIS-UPDATE PUSH 2026-07-29" (ops 134–158) in
  `reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md`; executor
  `chris-update-2026-07-29/exec_chris_push_2026-07-29.py`; pre-push live snapshots of all 24
  update targets in `chris-update-2026-07-29/pre-push-snapshot/`; change-list header = EXECUTED.
- **Push authorization CONSUMED.** Open threads: **VIU-time corrections expected later per the
  user ruling** (label/placement hedges in the pushed bodies get confirmed live at VIU);
  **WIP identifier question (VIN vs serial) still PENDING with Chris** (WIP-COL-05 C30470 /
  WIP-FLT-03 C30500 / WIP-SORT-03 C30485 untouched, on serial); **SPEC-WATCH unchanged** —
  Chris's spec changelog + companion video expected ~2026-07-30, reminder deadline 2026-08-04
  stands (`SPEC-WATCH-2026-07-28.md`); filters cross-squad sweep (Branko/Milos) still to land.
- **Status update (state-save, later 2026-07-29):**
  - **WIP identifier question SENT to Chris Ward by the user 2026-07-29** (VIN vs serial for the
    WIP report — affects WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03 C30485). AWAITING
    his answer. On answer: **A (VIN)** = a 3-case VIN edit pass on those cases (needs fresh push
    authorization, Rule 6); **B (serial)** = no-op (cases already on the video's serial ruling).
  - **QA branch still PENDING** — the user will notify when it exists; then run the full live VIU
    (including the VIU-time label/placement confirmations noted above).
  - **NEW Side Project #2 started 2026-07-29 (separate from Report Suite): SV-8721 5-decimal fix
    verification on PRODUCTION (`app.shopview.com`)** — devs believe the fix is deployed to prod.
    Work folder: `build/side-projects/SV-8721-5decimal-PROD-2026-07-29/`. (The staging
    verification was `build/side-projects/SV-8721-5decimal-2026-07-27/`, result = FIXED on
    staging.)

**UPDATE 2026-07-29 (second block — AUTHORIZED 3-CASE FIX + CHRIS-MESSAGE DELTA PASS).**
- **Part 1 — 3 user-authorized TestRail fixes EXECUTED** (the exact 3 drifts flagged in the
  2026-07-28 checkpoint; explicit authorization 2026-07-29; NOTHING else written, R359 untouched):
  **TU-DAY-01 C30418** import angle-bracket artifact repaired (live read "Expand 's daily
  breakdown"; rewritten plain, no angle brackets), **PV-API-02 C30389** title 100→71, **PV-FILT-09
  C30336** title 96→77 — all HTTP 200 + re-GET MATCH; pre-op live snapshots in
  `testrail-pre-push-snapshot-2026-07-28/*.pre-authorized-fix-2026-07-29.json`; audit =
  execution log § "AUTHORIZED FIXES 2026-07-29". Angle-bracket sweep of ALL bodies: TU-DAY-01 was
  the ONLY one. Gotcha recorded in APP-ACTIONS-PLAYBOOK §J (TestRail swallows `<placeholders>`).
- **Part 2 — Chris Ward group message (8:53 AM 2026-07-29) INGESTED + applied LOCALLY (NO TestRail
  writes; Rule 6):** verbatim message + ingest = `chris-update-2026-07-29/` (backups in `backup/` +
  MANIFEST). Message = NEWEST source (last-update-wins over the video AND the specs); Chris is
  updating all six specs with changelogs, **spec changelog + companion video expected ~2026-07-30**;
  summary written by his assistant "pending a human-eye-pass" → verify vs the real changelog on
  arrival. Deltas applied: **SBC identifier re-ruled to VIN → Unit # → plate** (supersedes the
  video's serial ruling FOR SBC ONLY — SBC-LBL-01 C30134 + SBC-LBL-04 C30137; **WIP stays serial,
  VIN-or-serial question QUEUED for Chris**, WIP-COL-05 C30470/WIP-FLT-03 C30500/WIP-SORT-03 C30485
  untouched); **SBC exports = Summary + Expanded for BOTH PDF and CSV, four exact menu items**
  (SBC-EXP-01 C30159, SBC-EXP-16 C38856, SBC-EXP-03 C30161, SBC-EXP-11 C30169 — the old
  no-asset-layer rule superseded); **"Locations:" line in every CSV+PDF + on-screen scope
  indicator, all 6 reports** (12 existing cases extended, no new cases needed: SBC-EXP-09 C30167
  [old "location not shown" REVERSED] + the 5 other export cases + the 6 location-scoping cases);
  **"Catalogue" → exact label "Special Order" CONFIRMED** (PV-FILT-01 C30328, PV-FILT-09 C30336,
  PV-ROW-05 C30345, PV-EXP-08 C30382; Parts Sales dropdown rename = out of scope, FYI only);
  **TU column selector ADDED → 1 NEW case TU-COL-01** (now C38859 per the 2026-07-29-B push; refs SV-8655 + the message);
  **same logo treatment** (only PV lacked coverage → PV-EXP-05 C30379 extended). Also: 8 touched
  overlong titles trimmed locally + 11 story tickets backfilled into touched cases' refs (Rule 20).
  **NEW TALLY: 460 ACTIVE authored (459 in TestRail + TU-COL-01).** Deliverables regenerated over
  460 (import + 6 splits header byte-identical, hygiene clean; id-map 459 C-ids re-merged +
  TU-COL-01 blank; coverage addenda ×6). **Change-list / push-approval gate =
  `chris-update-2026-07-29/ChangeList-2026-07-29.md` + `.xlsx` (EXECUTED 2026-07-29-B: 24
  update_case + 1 add_case, TU-COL-01 = C38859).** Rule-28 three-dimension audit on all 26 touched: 26 KEEP / 26 SENSIBLE / 26
  genuine+layman. SPEC-WATCH updated (ratification IN PROGRESS; deadline 2026-08-04 stands).
- **FILTERS CROSS-SQUAD (Chris message, second part):** Branko + Milos's app-wide Filters project
  WILL cross over with the report filters; build to spec for now but EXPECT the filter portion to
  change once something workable is on staging (Branko/Milos to sweep our report filters; Chris
  awaiting their response). Re-reconcile the filter cases when that sweep lands.

**SESSION CHECKPOINT 2026-07-28 (pre-limit) — COLD-RESUME ANCHOR (read this first on resume).**
- **COMPLETION PASS DONE 2026-07-29:** the 2 manifest-omitted Chris Q1=B Esc cases **SBR-DEACT-04 =
  C30255 + SBR-DEACT-05 = C30256** are now pushed + live-verified MATCH (2 update_case, HTTP 200,
  pre-op snapshots; independently re-verified on resume after a usage-limit kill) — Push-ALL scope
  COMPLETE (72 update / 1 add / 57 delete, suite 459 ACTIVE, R359 = 458 untouched). Remaining known
  live drifts, **AWAITING user authorization** (NOT in the consumed Push-ALL scope): TU-DAY-01
  C30418 (import `<technician>` placeholder artifact) + 2 overlong titles PV-API-02 C30389 /
  PV-FILT-09 C30336. Audit: `reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md`
  § COMPLETION PASS.
- **PUSH ALL EXECUTED + VERIFIED BY EXECUTOR** (commits 93723bf / 98debf5 / ba0c043): **70
  update_case + 1 add_case (SBC-EXP-16 = C38856) + 57 delete_case**, all HTTP 200 + re-GET
  verified. **Suite now 459 ACTIVE, live == local**; run R359 = 458 tests (deletions only —
  NO run writes, R359 is Nebojsa/Viktoria's, never ours). Recovery sets:
  `testrail-pre-push-snapshot-2026-07-28/` + `consolidation-backup-2026-07-28/` +
  `video-promotion-backup-2026-07-28/`.
- **INDEPENDENT POST-PUSH VERIFICATION was IN-FLIGHT at checkpoint** (a background read-only
  worker running 7 checks vs live TestRail; output =
  `reconciliation-2026-07-28/POST-PUSH-VERIFICATION-2026-07-28.md`). **If that file is absent or
  incomplete on resume, RE-RUN the verification:** (1) live count under group 4281 == 459 ==
  id-map == import; (2) all 57 manifest deletes gone; (3) C38856 correct; (4) 12 live-vs-local
  spot-checks; (5) other groups untouched (Schedule 4254 / Filters 4110 / F&D 3894); (6) R359 ==
  458 with zero results added; (7) import hygiene.
- **THE THREE-DIMENSION AUDIT GATE (Rule 28) is live**; audit deliverables in
  `quality-audit-2026-07-28/` incl. `EXEC-NOTE-for-Stefan.md` (ready to send).
- **OPEN THREADS:** (a) SPEC-WATCH deadline **2026-08-04** — remind the user if Chris Ward
  hasn't ratified the video items into the 6 specs (`SPEC-WATCH-2026-07-28.md`); (b) Q2
  permission-discrepancy note ready to send
  (`chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md`); (c) Chris's condensed
  PRD-companion video pending → delta pass on arrival; (d) LIVE VIU pending QA branch (ask
  Chris/user; fresh staging cookies needed); (e) suggest the user give Nebojsa/Viktoria a
  heads-up that R359 went 515→458 due to consolidation; (f) **NO further TestRail writes
  authorized — the Push-ALL authorization is CONSUMED.**

**UPDATE 2026-07-28-B (LATEST — AUTHORIZED FULL TESTRAIL PUSH EXECUTED, "Push ALL" user ruling
2026-07-28).** The whole staged bundle is now LIVE in TestRail (group 4281 ONLY): **70 update_case**
(24 video-promotion edits still active + the 9 sense-check FIX-WORDING repairs + the 41 merge
survivors — one final body per case, deduplicated) + **1 add_case: SBC-EXP-16 = C38856** (section
4300 "SBC — Exports", atmstatus 3 / automation_type 0) + **57 delete_case** (SBC-EXP-13 C30171
Print retire + 6 usefulness/sense-audit CUTs [C30148, C30246, C30284, C30357, C30497, C30560] +
50 merged-away members). ALL HTTP 200, ALL verified (re-GET MATCH on title/preconds/steps/expected/
refs; deletes verified gone), **0 failures, 0 HELD merge groups**. **NEW TALLY: 459 ACTIVE cases**
(515 − 57 + 1), live-verified: exactly 459 cases under group 4281 (96 sections, C30096–C38856),
id-map 459/459 C-ids populated (== live set). **Run R359 (Nebojsa/Viktoria, NOT ours, never written
to): 515 tests before → 458 after** (case deletions removed their tests; C38856 not in the run).
Deliverables regenerated over 459 (unified import + 6 splits, header byte-identical, 0 VIU/flag
words, 0 internal-id leaks, no dup titles, 29 API cases all in "— API" sections; per-report
SBC 82 / SBR 109 / PV 67 / TU 57 / WIP 76 / IV 68). gen_import.py now EXCLUDES Retired bodies
(kept in cases/*.json marked "Retired 2026-07-28 …" — never lost). Merge/consolidation detail +
what each survivor gained: `consolidation-backup-2026-07-28/MANIFEST.md` (106 pre-edit bodies).
Authoritative live recovery set: `testrail-pre-push-snapshot-2026-07-28/` (127 pre-push live bodies
+ R359 pre-push counts). Manifest (EXECUTED header): `reconciliation-2026-07-28/
testrail-push-manifest-2026-07-28.md`; per-case audit: `reconciliation-2026-07-28/
testrail-execution-log-2026-07-28.md`; executor scripts archived in the same folder. Refs note:
SBC-EXP-01 C30159 + SBR-LOC-03 C30215 carry condensed refs in TestRail (length cap) — full text in
local spec_ref/import. Survivor priorities/types deliberately unchanged. NEXT = live VIU on the QA
branch when it exists + Chris's spec ratification watch (SPEC-WATCH deadline 2026-08-04).

**PRIOR UPDATE 2026-07-28-A (VIDEO PROMOTED TO AUTHORITATIVE; LOCAL EDITS APPLIED; superseded by
-B for the tally and the push status).** USER RULING 2026-07-28: Chris Ward's kickoff video is AUTHENTIC + AUTHORITATIVE product
intent (made for Chris Amani, company VP) and NEWER than the six specs (last updated 2026-07-21) —
by last-update-wins the **video overrides the spec where they conflict**. Applied LOCALLY (cases/
*.json only): **27 cases edited** (20 tester-facing + 7 notes/refs-only — P24 serial-number
identifier ×8, P25 SBC Print removal ×3, P33 location-filter-hidden flips ×4, P10 All-locations
per-row location-identifier adds ×5, P3 TU nav placement ×1, and the OPEN-DECISION items per
LATEST info: P31 Catalogue special-order rewording ×4, P12 asset-dropdown native+toggle note,
P30 pagination-stands notes ×2), **1 NEW case authored: SBC-EXP-16** (compressed SBC download,
video P21 — no C-ID yet, needs authorized add_case), **1 RETIRE-PROPOSED: SBC-EXP-13 C30171**
(Print-only case — NOT deleted, awaiting authorization). **NEW TOTAL: 516 authored (515 in
TestRail + 1 new).** Per-case audit log (video quote + overridden spec wording, Rules 20/25):
`reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md`; appliers
`apply_video_promotion_2026-07-28.py` + `apply_open_decision_2026-07-28.py`. **BACKUPS (recovery
requirement):** every touched case's verbatim PRE-EDIT body =
`video-promotion-backup-2026-07-28/` (27 files + MANIFEST.md; SBC-EXP-16 = delete-to-recover) —
if Chris never ratifies the video items into the specs, recover from there. **SPEC-WATCH (read on
ANY Report Suite touch): `SPEC-WATCH-2026-07-28.md`** — checklist of all 8 video-driven items
awaiting Chris's spec ratification, **DEADLINE 2026-08-04** (if still unratified, REMIND THE USER
+ offer backup recovery). Change-list regenerated (21 rows: 2 APPLIED-NOW / 14 APPLIED-LOCALLY /
1 RETIRE-PROPOSED / 1 NO-CHANGE-CONFIRMED / 2 OPEN-DECISION / 1 LIVE-VIU-PENDING) — it remains
the approval gate for the eventual authorized push (update_case ×26 + add_case ×1 + delete_case
×1). Deliverables regenerated over 516 (import + 6 splits, header byte-identical, 0 VIU/flag
words, no dup titles, API cases in "— API" sections); id-map re-merged 515/515 C-ids +
SBC-EXP-16 blank; coverage-*.md addenda appended. Run R359 untouched; ZERO TestRail writes.
NEXT = authorized TestRail push, then live VIU on the QA branch (Rule 22).

**Session wrap-up 2026-07-28 (Report Suite reconciliation, unattended) — all phases done, tree clean, HEAD pushed.**
Phase 1 specs captured + diffed (`b22d2af`), Phase 2 reconciliation + change-list (`16485ca`), Phase 3 Filters
cross-squad mirror (`173addd`), Phase 4 adversarial audit = CLEAN (`75d615e`). No TestRail writes, no secrets.

**UPDATE 2026-07-28 (PHASE 2) — VIDEO-DRIVEN SPEC-RELEVANCE RECONCILIATION DONE + CHANGE-LIST
DELIVERED (2 local case edits only; NO TestRail writes — Rule 6 needs explicit permission later).**
All **515** cases reconciled against the combined source of truth: the RATIFIED current Confluence
spec (primary; Phase-1 diff = unchanged since 2026-07-22 ingest,
`spec-current-2026-07-28/SPEC-DIFF-SUMMARY.md`), Chris's Q1/Q2/Q3 answers, and the 40 kickoff-video
deltas. **Deliverable:** `reconciliation-2026-07-28/Report-Suite_Spec-Reconciliation_ChangeList_2026-07-28.md`
+ `.xlsx` (generator `gen_changelist.py`); 19 change-list rows, Tab 2 = items blocked on Chris's spec update.

- **APPLIED-NOW (2 local edits, firmly confirmed by Chris Q1 = B):** **SBR-DEACT-04 (C30255)** reworded so
  pressing Esc does NOT close the "deactivate a sales rep" confirm dialog (Cancel + X only; app house rule
  wins over spec S13-R8); refs set to `SV-8630 (S13-R8)` per Rule 20; title 78 chars. **SBR-DEACT-05 (C30256)**
  consistency edit (Esc never closes at any time) + overlong title shortened to ≤80. Both still VIU-Pending
  (live-confirm on QA branch later).
- **PENDING-CHRIS (11 rows — NOT edited, spec still contradicts the video, Rule 23):** serial-number asset
  identifier (P24 → SBC-LBL-01 C30134 + WIP-COL-05 C30470 families); remove SBC Print (P25 → SBC-EXP-01 C30159,
  SBC-EXP-13 C30171); add SBC compressed download (P21 → new case to author); per-row location label on the 5
  non-WIP reports (P10 → SBC-LOC-03 C30111 family); Catalogue rename (P31 → PV-FILT-01 C30328 family);
  location-filter hide-when-≤1-location (P33 → SBR-LOC-04 C30216, TU-LOC-05 C30446, IV-LOC-04 C30577, PV-FILT-13
  C30340 — currently assert the OPPOSITE straight from spec).
- **OPEN-DECISION (4):** asset-dropdown stays-open vs native+toggle (P12, WIP-FLT-03 C30500); IV column-selector
  scope (P18/P36, IV-PERS-01 C30579); PV pagination vs infinite-scroll (P30, PV-API-01 C30388); TU column
  selector (P18 — none authored, correct).
- **LIVE-VIU-PENDING (2):** WIP labor-delta basis — spec S4-R23 uses QUOTED−worked (case matches spec, NOT
  edited), video P14 says invoiced−worked; confirm live (WIP-CALC-08 C30481). TU nav "move down" (P3, TU-NAV-01
  C30392) — spec is order-agnostic, confirm placement live.
- **Confirmed already-matching (no edit):** All-Time removal (P9, ~365-day backend cap = data caveat); "Sales
  By Representative" naming (P5); "Parts" nav group PV+IV (P2 → PV-NAV-01 C30322/IV-NAV-01 C30534); no "snapshot
  taken X days ago" label (P32; IV "As of" kept); labor-delta green/black/red colors (P14).
- **Q2 permissions:** all permission cases KEPT as the shipped MIXED model (user ruling 2026-07-28); discrepancy
  captured for Chris/dev in `chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md`; not edited.

**Counts: 515 total / 2 edited-now / ~30 cases flagged across 19 change-list rows (11 pending-Chris + 4
open-decision + 2 live-VIU) / remainder clean no-op.** Deliverables regenerated: import CSV/XLSX + 6 per-report
splits (515 rows, header byte-identical, VIU/flag-word-free, no dup titles, API cases in "— API" sections);
`testrail-id-map.csv` C-ids re-merged 515/515 (0 blank). Run R359 untouched; NO TestRail API calls this pass.
**NEXT:** live VIU on the QA branch (Rule 22 — no QA branch yet) + Chris's spec update to unblock the 11
PENDING-CHRIS items, then an authorized TestRail push.

---

**UPDATE 2026-07-28 — CHRIS ANSWERS INGESTED + USER RULINGS (NO TestRail writes, NO
case edits — documentation + a draft note only). ON HOLD.** Chris Ward answered all 3
PO questions (source `chris-answers-2026-07-28/answers-ingested.md`): Q1 = **B** (Esc must
NOT close the SBR deactivate confirm dialog — Golden Rule wins), Q2 = **B** ("these should
be gated by normal reports access"), Q3 = **B** (a kickoff video exists — pinned in chat,
has visual issues — plus a condensed click-through Chris will film). **Two user rulings
recorded 2026-07-28:**
- **RULING 1 (Q2 permission model) — KEEP cases as authored to the SHIPPED build's MIXED
  model** (Sales By Customer = its own dedicated permission; Parts Velocity + Inventory
  Value = inventory-reports access; Sales By Rep = performance group; etc.). Do NOT reword
  them to Chris's "normal reports access" answer. Instead **RAISE the discrepancy** (PO
  wants one single normal-reports permission vs the build shipped a mixed model) back to
  Chris/dev for a decision. **Cases stay as-is until they rule.** Reader-facing draft note
  = `chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md` (draft, NOT sent).
- **RULING 2 (process choice) — best approach delegated to us; recorded plan:** when we
  proceed (AFTER the Loom video is accessible AND the QA branch exists), run
  **SPEC-RELEVANCE-RECONCILIATION first** — fold Chris's Q1/Q2/Q3 answers + the kickoff
  video + the forthcoming condensed click-through across all 515 cases to decide which need
  a change — **THEN BUILD-ACCURATE-WORDING + live VIU on the QA branch.** The **Q1
  SBR-deactivate-dialog edit** (SBR-DEACT-04 = C30255: pressing Escape must NOT close the
  confirm dialog — Golden Rule wins) is **QUEUED for that reconciliation pass, to be
  VIU-confirmed live, NOT edited now.**

**STATUS: ON HOLD** pending (a) Loom kickoff video access (user is making it public),
(b) the condensed click-through Chris will film, (c) the Report Suite QA branch. **No case
edits / no TestRail writes until then.** Tally unchanged: 515 cases in TestRail.

**KICKOFF-VIDEO TRANSCRIPT INGESTED 2026-07-28 (documentation only — NO TestRail writes, NO
case edits):** the Loom kickoff video transcript is saved verbatim at
`chris-answers-2026-07-28/loom-kickoff-transcript.md` and a structured deltas/clarifications
doc extracted to `chris-answers-2026-07-28/video-deltas-2026-07-28.md` (40 points: 7 FIRM
DELTA · 3 PENDING-SPEC · 6 OPEN DECISION · 1 CROSS-SQUAD · 2 VISUAL-REFERENCE · 21
CONFIRMATION; per-report roll-up + the Filters-squad persistence CROSS-SQUAD clash inside).
**Ingested + on-hold pending the process decision (RULING 2 reconciliation pass);** feeds the
eventual SPEC-RELEVANCE-RECONCILIATION → build-accurate wording → live VIU. FIRM headlines:
new "Parts" nav subsection (PV+IV); TU nav must move down (additive-not-interruptive);
"Sales by Representative" label (not "Associate"); "All locations" + a location identifier on
EVERY report; ADD a compressed download view to Sales By Customer; asset identifier UNIT
NUMBER→SERIAL/BIN; REMOVE the Print button from Sales By Customer.

**UPDATE 2026-07-27 — EPIC SV-8582 INGESTED + RECONCILED (NO TestRail writes, NO
authoring):** the Jira epic is now known = **SV-8582** (ingested via Atlassian MCP;
epic Open, 97 child stories SV-8583→SV-8679 contiguous, branch
`project/reports-suite-bravo`, QA Nebojsa + Viktoria). **Reconciliation: the 97
stories MATCH our 515 authored cases 1:1** — the 80 per-report stories are thin
wrappers pointing at the same Confluence specs we already ingested (0 comments/0
attachments across all 97 → no designs/video), the 9 engineering stories (PR-1/A2–A5
Open, B1–B6 OBSOLETE) change no cases. Inventory Value (added to the epic 2026-07-26)
already authored. Sources: `epic-sv8582/INGEST-SUMMARY.md` + `epic-sv8582/RECONCILIATION.md`.
**Chris PO-questions doc READY (not sent by us): `PO-Questions-Chris-ReportSuite-2026-07-27.md/.xlsx`**
(SBR Esc vs Golden-Rule #9; per-report permission-model confirm; confirm no designs/video).
**~3–6 backend/regression cases deferred to the QA branch** (PV×QB fractional-qty precision
from PR-1 INT→DECIMAL, IV nightly-snapshot retention/prune, exact permission names/themes).
OPEN = QA branch/env + flag state + Chris's answers. Tally unchanged: 515 cases in TestRail.

**IMPORTED + MAPPED 2026-07-22 (READ-ONLY):** All 515 cases were imported into
TestRail under group **4281 "Reports Suite"** (six report folders 4282–4287,
each holding its per-area leaf subsections 4288–4376 = 89 leaves). Live read
confirmed exactly **515 cases** under 4281. Execution run **R359 "Reports Suite
- Nebojsa/Viktoria (VIU Pending)"** exists (515 tests, all Untested — NOT
created by us; do not write results without permission). `testrail-id-map.csv`
is now **fully populated**: 515/515 rows matched to real C-ids by exact
(section-leaf-name + exact title), **0 unmatched / 0 ambiguous / 0 leftover
TestRail cases**; observed **C-id range C30096–C30610**. Mapping done with
read-only get_sections + get_cases only — **NO TestRail writes**. Note per
project rule: `gen_import.py` BLANKS the id-map C-id column on rerun — re-merge
C-ids after any regeneration; deliverables with C-id/link columns can be
regenerated next.

**ADVERSARIAL REVIEW DONE 2026-07-22 — both auditors CLEAN after fixes
(SBC/SBR/PV: 3 minor doc/note fixes, b410d29; TU/IV clean; WIP: 2 fixes incl.
one real coverage gap [WIP-TAB-02 no-status-filter expected item + WIP-SORT-03
reword], 82f1665). Independent bullet counts recorded: SBC 235/235 · SBR
230/230 · PV 69/69 · TU ~111 · WIP ~119 · IV ~110 — ALL MAPPED. Suite = 515
cases / 89 sections / 6 reports; import REGENERATED post-review (delta vs
pre-review CSV = exactly the two WIP rows, nothing else; id-map byte-identical;
full gate re-passed: 515==515==515, header 5/5 byte-identical, 0 VIU/flag
words, 0 internal-id leaks, no empty fields, XLSX==CSV, deterministic rerun).
STATUS = READY FOR USER IMPORT — PER-FOLDER WORKFLOW (2026-07-22): the user
MANUALLY CREATED TestRail group **4281 "Reports Suite"** with six EMPTY
per-report subsections — **4282 "Sales By Customer Report" · 4283 "Sales By
Representative Report" · 4284 "Parts Velocity Report" · 4285 "Technician
Utilization — Product Specification" · 4286 "Work In Progress — Product
Specification" · 4287 "Inventory Value — Product Specification"** — and will
import ONE report at a time targeting each folder (the CSV Section column
creates the "XXX — area" leaf sections inside that folder). Six per-report
split files EMITTED for this (see §0.6); folders 4282–4287 confirmed created,
AWAITING CASE IMPORT. The read-only C-id mapping step is staged as the next
resume action — map C-ids into `testrail-id-map.csv` once the cases land →
VIU when env/Epic arrive (ask Chris Ward: TU S8 video inconsistency + IV
export-cap value; Epic key ask-at-VIU; designs pending; specs-will-change →
Rule-11 reconciliation per update).**

- **Case inventory (515 total, per report / sections):** SBC 99 (18 sections) ·
  SBR 127 (23) · PV 70 (9) · TU 59 (12) · WIP 83 (14) · IV 77 (13). Source:
  `cases/*.json` (26 files, uniform schema; `area` = the "XXX — leaf" TestRail
  section value; 29 API cases, all in "<Report> — API" sections per Rule 4).
  All cases `viu_status: VIU-Pending` (spec-only authoring, no designs).
- **Coverage 6/6 COMPLETE:** `coverage-{sbc,sbr,pv,tu,wip,iv}.md` — every
  spec requirement/negative/edge bullet mapped to case IDs per report
  (bullet-by-bullet maps; explicit exclusions listed where applicable).
- **Import READY (Rule 16 pure 1:1):**
  `testrail-import/report-suite-v1-testrail-import.csv` + `.xlsx` via
  `gen_import.py` — header byte-identical to ALL FIVE prior imports
  (fees-discounts / simple-flow / global-search / filters / schedule; equality
  check run 5/5 True); 515 rows; Section = the "XXX — leaf" value (the user's
  import nests these under the "Report Suite" main section per §0.5);
  deterministic ordering (report order SBC, SBR, PV, TU, WIP, IV → authored
  section order → id); VIU-word-free + feature-flag-free (0 hits); 0
  internal-id leaks in reader-facing cells (14 "(see PV-PERM-01)"-style
  cross-refs rewritten generically by `clean()`, same fix as Schedule); no
  duplicate titles within a section; every row has non-empty
  Preconditions/Steps/Expected; XLSX matches CSV row-for-row; rerun is
  byte-identical (deterministic).
- **id-map:** `testrail-id-map.csv` — 515 rows, blank C-ids, schema
  `internal_id,testrail_case_id,title,section` (same as Filters/Schedule).
  ⚠️ GOTCHA (same as Filters/Schedule): rerunning `gen_import.py` BLANKS the
  C-id column — after C-ids are populated, RE-MERGE them after any rerun.
- ONE project, SIX reports, each with its own spec (see §1 inventory).
- **PO: Chris Ward** (same PO as Fees & Discounts — never mix attributions:
  Report Suite = Chris Ward; Global Search / Filters / Schedule = Branko;
  Simple Flow = Milos).
- **Epic / Jira key: NOT AVAILABLE — ⚠️ ASK THE USER when VIU begins** (do NOT
  invent). Every spec's header reads Epic = TBD.
- **Designs: NOT YET AVAILABLE** — every story's Design field is TBD (two specs
  mention a "companion video" as visual reference; not provided). SPEC-ONLY
  authoring: build-accurate wording (Rule 9) from the spec text (these specs are
  unusually label-rich — verbatim strings, filenames, column orders, colors);
  mark anything unpinned "VIU-confirm"; design-reconciliation later if designs
  arrive.
- **QA env / branch / feature-flag status: NOT AVAILABLE — ask at VIU.**
- **Ask Chris Ward at VIU:** TU S8 companion-video inconsistency (OQ-3), IV
  export-cap value (OQ-4); Epic key ask-at-VIU (OQ-1); designs pending (OQ-3).
- **Specs WILL keep changing** (user statement). On every spec update run
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`; per Standing Rule 11 ALWAYS
  ASK which process(es) to run before proceeding.
- **TestRail: NOTHING pushed** (no writes without explicit permission —
  Standing Rule 6). `testrail-id-map.csv` = 515 rows, C-ids blank until the
  user's import assigns them (then read-only map from the shared group URL).

## 0.5 TestRail structure (user-prescribed)

ONE main section **"Report Suite"** → one **SUBSECTION per report** (named after
the report) → that report's cases inside. For the import CSV this means the
Section column carries the report name; the user's import creates the parent
"Report Suite" group. Cases with API/backend content (HTTP, endpoints, status
codes — e.g. the nightly-snapshot backend stories) go in a **"<Report> — API"**
section per Standing Rule 4. Import format = **pure 1:1** with the established
`testrail-import/<project>-testrail-import.csv` layout (Standing Rule 16: 8
named columns + 2 trailing blank columns, header byte-identical, no ID columns;
traceability via `testrail-id-map.csv` per Rule 8; VIU-word-free +
feature-flag-free).

## 0.6 Per-report import split files (2026-07-22)

For the user's per-folder import workflow (§0 STATUS: group 4281, subsections
4282–4287), `gen_import.py` now ALSO emits **six per-report import files** —
the unified `report-suite-v1-testrail-import.csv`/`.xlsx` is UNCHANGED
(byte-verified against the pre-split file). **RENAMED 2026-07-22 to
HUMAN-READABLE filenames** (user rule: spell report names out in full — never
cryptic abbreviations like sbc/pv/tu; the old
`report-suite-v1-{sbc,sbr,pv,tu,wip,iv}-…` files were removed; CSV contents
byte-identical to the pre-rename files):

| TestRail folder (manually created by the user) | CSV (`testrail-import/`) + `.xlsx` twin | Rows |
| --- | --- | --- |
| 4282 Sales By Customer Report | `Report-Suite_Sales-By-Customer-Report_testrail-import.csv` | 99 |
| 4283 Sales By Representative Report | `Report-Suite_Sales-By-Representative-Report_testrail-import.csv` | 127 |
| 4284 Parts Velocity Report | `Report-Suite_Parts-Velocity-Report_testrail-import.csv` | 70 |
| 4285 Technician Utilization — Product Specification | `Report-Suite_Technician-Utilization-Report_testrail-import.csv` | 59 |
| 4286 Work In Progress — Product Specification | `Report-Suite_Work-In-Progress-Report_testrail-import.csv` | 83 |
| 4287 Inventory Value — Product Specification | `Report-Suite_Inventory-Value-Report_testrail-import.csv` | 77 |

Sum 515. VERIFIED programmatically 2026-07-22 (re-verified after the rename):
header byte-identical to the
canonical header in all six; every data row byte-identical to its unified-file
counterpart in the same per-report order (byte-level concatenation of the six,
minus repeated headers, == the unified CSV exactly); XLSX == CSV row-for-row
in all 7 files; Section values in each file all carry that report's prefix;
CSVs byte-identical across reruns (deterministic). Import each CSV targeting
its folder above — the Section column creates the "XXX — area" leaf sections
inside that folder.

## 1. Per-report spec inventory (6/6 ingested 2026-07-22)

| # | Report | Spec file (specs/) | Canonical Confluence URL (login-walled — pointer only, do NOT fetch) | Doc header | Latest change-log | Req-bullet count* |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SBC Sales By Customer | `sbc-sales-by-customer.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/577634305/SBC+Sales+By+Customer+Report | Owner TBD · In review — 2026-07-16 | 2026-07-21 (Milan resolution) | 235 |
| 2 | SBR Sales By Representative | `sbr-sales-by-representative.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/585629698/SBR+Sales+By+Representative+Report | Owner TBD · In review — 2026-07-16 | 2026-07-21 (Milan re-review) | 224 |
| 3 | Parts Velocity | `parts-velocity.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/620888066/Parts+Velocity+Report | Owner TBD · In review — 2026-07-16 | 2026-07-16 (server-side model) | 69 |
| 4 | Technician Utilization | `technician-utilization.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/641400833/Technician+Utilization+Report | Owner Chris W. · In review — 2026-07-16 | 2026-07-16 (Milan review) | 109 |
| 5 | WIP Work In Progress | `wip-work-in-progress.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/703660034/WIP+Work+In+Progress+Report | Owner Chris W. · Draft — 2026-07-19 | 2026-07-21 (Milan + Chris override) | 118 |
| 6 | Inventory Value | `inventory-value.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/720142338/Inventory+Value+Report | Owner Chris W. · Draft — 2026-07-19 | 2026-07-21 (server-side model) | 108 |

\* Count of `S#-R/N/E` requirement bullets in the decoded spec (requirements +
negative + edge cases); a sizing signal, not a case count. Total ≈ **863**.

Extraction method (all 6, same): Confluence "Export to Word" MHTML /
quoted-printable `.doc` → Python `email` (MIME walk to `text/html`,
`get_payload(decode=True)`) + BeautifulSoup, all headings/lists/tables
preserved (tables → pipe tables). SBC arrived as export revision `_2`; the
other five as `_1`.

All six specs share the suite-canonical PRD layout: §1 Business Case · §2
Feature Overview (+ Known Limitations/Out of Scope) · §3 Key Decisions · §4
Terminology · §5 Assumptions · §6 Requirements (Stories with S#-R/N/E) · §7
User Feedback Summary (verbatim message table) · §8 Change Log.

## 2. Per-report readiness snapshot (authoring-planning view)

Common suite patterns (appear in most/all six — author once per report, reuse
wording): Reports left-nav entry + permission gate; date-range presets +
366-day-capped Custom + NO "All Time"; multi-select Location filter (rightmost,
defaults to active location, constrained to accessible locations); per-browser
remembered view (filters/columns/sort) with DEFENSIVE restore; column selector
with a pinned un-hideable headline column (bold, right-pinned); server-side
pagination/sort/filters/exports (committed build target — several specs are
"spec ahead of current code by design"); ⋯ overflow export menu; verbatim
toast/empty-state strings ("Empty bays, endless possibilities. Get Going!" on
the Parts/ops reports; per-report strings on the sales reports); 10,000-row
export cap with a "too large… narrow the date range or filters" toast; dark
mode + accessibility blocks; half-up rounding computed-from-unrounded.

1. **SBC Sales By Customer** — three-level tree Customer → Asset → Invoice
   (per-customer "Parts Sales" bucket for no-vehicle work); filters: date
   range, Product Type (P/S invoice-number prefix), server-backed type-ahead
   multi-select Customer filter (explicit "all-customers state"), Location;
   columns Inv. Hrs / Labor+Parts Invoiced+Margin / Shop Supplies / Margin /
   Margin % / pinned bold Subtotal; asset-label derivation rules (unit → plate
   → VIN-suffix → "Unknown Asset", dedup "(#N)"); server sort/pagination + lazy
   drill-down; exports CSV + PDF + Print (flat, no asset layer; range-based
   filenames; 10k cap); URL-shareable range (saved view wins over link);
   dedicated SBC View permission. 21 stories (2 retired placeholders), 235
   bullets. Label-richness EXTREME (exact hex colors, date formats, filename
   map). API contract: none explicit (server-side behaviors described
   functionally). Est. ~55–75 cases.
2. **SBR Sales By Representative** — per-rep grouped rows (contributors-only,
   A→Z, "(Inactive)" tag, pinned "Unassigned" row via Show Unassigned toggle);
   5-state→3-value payment-status mapping (single source of truth for badge +
   Invoice Status filter); Inv. Hrs colored delta; pinned bold Subtotal +
   responsive grand-Totals (desktop merged row / mobile bar); 4 exports
   (Summary/Expanded × PDF/CSV, font-size tier table, 10k row cap); PLUS three
   beyond-the-report surfaces: Story 13 staff deactivation type-YES dialog,
   Story 15 Sales Rep Assignments CSV (Export Reports dialog), Story 19 WO/Part
   Sale "Sales Rep" selector + invoice-time snapshot fallback (WO rep →
   customer rep → Unassigned). 23 stories (no Story 7), 224 bullets.
   Label-richness EXTREME (verbatim §7 message table incl. the canonical
   "Ooooops! An error occured" typo-as-shipped). API contract: none explicit.
   Known build-deltas to expect at VIU: single-rep model vs shipped dual-field
   schema; contributors-only vs seeded-toggle-reps handler; Expanded-CSV hours
   columns. Est. ~60–80 cases.
3. **Parts Velocity** — introduces the Reports→Parts section; Inventory vs
   Catalogue row model (per-location inventory rows, merged catalogue rows); 20
   columns (14 default) with authoritative per-column calc/format/null table
   (Story 5: Demand ranking, movement-vs-billed bases, reversal netting,
   Turns/Yr, Last Sale all-time lookback); filters Type/date/Category/Vendor/
   Bin/Location + toolbar search; ⓘ header tooltips (verbatim); CSV/PDF (A3
   landscape, alignment differences documented). 7 stories, 69 bullets (dense —
   much of the spec is calc tables). Permission: Inventory Reports → View
   (shown-then-denied nav model to confirm — S1-N2 build-note). API contract:
   none explicit. Calc-heavy: needs seeded WO/parts-sale/return/reversal data
   at VIU. Est. ~45–60 cases.
4. **Technician Utilization** — one row per technician with clocked time; Total/
   WO/Internal Hours, Utilization %, pinned bold Est. Lost Labor (per-location
   rate valuation; "$0.00" vs "—" vs partial-valuation semantics); Summary row
   over VISIBLE technicians; lazy per-day breakdown; on-screen technician
   filter (deselected-set persistence) vs server-side Location filter; Total
   Hours deep-link to Timesheet Activities (reconciliation-to-the-cent
   guarantee S1-R9 with two documented scope exceptions); exports Summary/
   Expanded PDF + CSV (A→Z order, screen sort NOT exported). 9 stories, 109
   bullets. Permission: reuses timesheet-reports permission. API contract: none
   explicit. Known build-delta: shipped single-rate lost-labor rollup + old
   tooltip wording. Est. ~40–55 cases.
5. **WIP Work In Progress** — four tabs (Approved-partially completed /
   Approved-not started / Completed / Estimates) with derived tab placement;
   Earned/Remaining money model from APPROVED lines only (Total = Earned +
   Remaining ≠ WO grand total); seven-figure summary strip (verbatim tooltips);
   on-screen Advisor/Customer/Asset filters vs reloading date/Location; 17
   columns (9 default); per-tab Totals; CSV/PDF per tab ("wip-2-report.*";
   Unit/Branch export-header quirk; "1 days" non-pluralization — documented
   known limitations, NOT defects); Story 11 nightly WIP snapshot (backend, no
   reader this version → API-section candidates). 11 stories, 118 bullets.
   Permission: reuses a WIP-reports permission. API contract: none explicit
   (snapshot schema described). Est. ~50–65 cases.
6. **Inventory Value** — one row per in-stock, non-core part per location
   (50–60k-part scale → fully server-side); valuation rules (fixed sell price →
   pricing-matrix markup → cost fallback); pinned bold Total Cost headline +
   default sort; server-computed totals row; as-of date model (live fallback
   for today, closest snapshot on-or-before otherwise, "As of" indicator);
   Story 11 nightly snapshot capture + 13-month daily / then monthly retention
   (backend → API-section candidates); Category/Vendor/part-search filters;
   PDF/CSV exports (as-of line, 10k cap). 12 stories, 108 bullets. Permission:
   reuses inventory-reports permission. API contract: none explicit. OPEN in
   spec: export-cap value "10,000 is a proposed default — confirm the exact
   suite-standard value with the owner before dev" (S10-R12). Est. ~45–60
   cases.

**Rule-4 note:** no spec defines an explicit REST/API contract (no endpoints,
verbs, or status codes) — server-side behavior is specified functionally. API
sections will be needed mainly for the two nightly-snapshot backend stories
(WIP S11, Inventory Value S11) and any backend-check cases we author.

## 3. Open questions (carry to Chris Ward / ask-at-VIU)

- **OQ-1 (ask at VIU):** Epic/Jira key(s) — one epic for the suite or one per
  report? Not available yet; every spec says TBD.
- **OQ-2 (ask at VIU):** QA env/branch + feature-flag/settings status per
  report (are all six on one branch?).
- **OQ-3:** Designs/Figma — none yet; two specs (Inventory Value S12 context
  note, Technician Utilization S8 context note) defer visual detail to a
  "companion video" that was removed from the header / not provided. Ask
  whether videos/designs exist to reconcile against. (TU header-cleanup removed
  the Companion Video row while S8's note still references it — minor spec
  self-inconsistency to flag.)
- **OQ-4 (product, for Chris):** Inventory Value S10-R12 export-cap value —
  spec itself says confirm the suite-standard value with the owner before dev.
- **OQ-5 (product, for Chris):** permission-model inconsistency across the
  suite — SBC uses a DEDICATED "Sales By Customer report View" permission
  (S1-R2) while SBR rides the Performance-group access (S1-R1) and PV/TU/WIP/IV
  reuse existing report permissions. Confirm intended (affects the permission
  cases we author).
- **OQ-6 (expectation-setting):** several specs are explicitly "spec ahead of
  current code by design" (server-side model committed 2026-07-16/21) and carry
  named build-deltas (SBR single-rep schema + contributors-only; PV reversal
  netting; TU per-location lost-labor). At VIU these will surface as
  deviations until dev catches up — track, don't file as new bugs without
  checking the spec's build-delta notes.
- **OQ-7:** tech-plan tuning values intentionally not fixed by the SBR spec
  (per-rep detail page size; expand-all bound) — unpinnable until build exists.

## 4. Deliverables index

- `specs/sbc-sales-by-customer.md` · `specs/sbr-sales-by-representative.md` ·
  `specs/parts-velocity.md` · `specs/technician-utilization.md` ·
  `specs/wip-work-in-progress.md` · `specs/inventory-value.md` — the COMPLETE
  decoded specs (verbatim-structured, all tables), each with a metadata header
  (canonical URL, doc status, extraction method).
- `cases/*.json` — 26 files, 515 authored cases (SBC 99 / SBR 127 / PV 70 /
  TU 59 / WIP 83 / IV 77), uniform schema, `area` = TestRail leaf section.
- `coverage-sbc.md` · `coverage-sbr.md` · `coverage-pv.md` · `coverage-tu.md`
  · `coverage-wip.md` · `coverage-iv.md` — 6/6 per-report coverage docs,
  every spec bullet mapped to case IDs.
- `gen_import.py` — unified + per-report import + id-map generator (Rule 16
  pure 1:1; self-checking: dupes/leaks/VIU-words/empties/API-section routing).
- `testrail-import/report-suite-v1-testrail-import.csv` + `.xlsx` — 515 rows,
  header byte-identical to all five prior project imports.
- `testrail-import/Report-Suite_<Full-Report-Name>_testrail-import.csv`
  + `.xlsx` — the six per-report split files (§0.6; human-readable names
  2026-07-22: Sales-By-Customer-Report / Sales-By-Representative-Report /
  Parts-Velocity-Report / Technician-Utilization-Report /
  Work-In-Progress-Report / Inventory-Value-Report; SBC 99 / SBR 127 / PV 70 /
  TU 59 / WIP 83 / IV 77; each row byte-identical to its unified counterpart)
  for the user's per-folder import into group 4281 subsections 4282–4287.
- `testrail-id-map.csv` — 515 internal ids, blank C-ids (⚠️ rerunning
  gen_import.py blanks C-ids — re-merge after any rerun once populated).
- `PROJECT-STATE.md` — this file.
- (Not yet created: PO question sheet — the OQ-3/OQ-4/OQ-5 Chris items get
  sheeted per Rule 7 when the user asks / at VIU.)

## 5. Env / access facts

- Nothing project-specific yet (no QA env named). Reuse shared infra when VIU
  starts: `build/TESTING-RUNBOOK.md`, `build/APP-ACTIONS-PLAYBOOK.md`,
  `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`,
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`, TestRail API patterns
  (project 1 / suite 1 "Master").
- TestRail: NO writes made; none permitted without explicit user permission.

## 6. HOW TO RESUME (ordered)

1. Read this file top to bottom (§0 = the definitive current state: 515 cases
   authored + ADVERSARIALLY REVIEWED CLEAN 2026-07-22, import regenerated
   post-review, ready for user import).
2. ADVERSARIAL REVIEW: **DONE 2026-07-22** (Rule 15/17) — both auditors CLEAN
   after fixes (SBC/SBR/PV 3 minor doc/note fixes b410d29; TU/IV clean; WIP 2
   fixes incl. one real coverage gap 82f1665); independent bullet counts SBC
   235/235, SBR 230/230, PV 69/69, TU ~111, WIP ~119, IV ~110 — all mapped.
3. **Next step:** the USER imports PER REPORT — six split files (§0.6),
   each targeting its manually-created folder under group 4281 "Reports
   Suite" (4282–4287; the Section column creates the "XXX — area" leaf
   sections inside that folder). Folders confirmed created 2026-07-22,
   awaiting case import. Then: READ-ONLY C-id mapping populates
   `testrail-id-map.csv` (515 rows; ⚠️ re-merge C-ids after any gen_import.py
   rerun — it blanks them) — this mapping step is the staged resume action
   once the cases land. NO TestRail writes without explicit permission.
4. When a spec UPDATE arrives: ask which process(es) to run (Standing Rule 11)
   — expect SPEC-RELEVANCE-RECONCILIATION per update (specs will keep
   changing).
5. When VIU begins: ask for Epic key(s), QA env/branch, flag/settings status
   (OQ-1/2); ask which process(es) to run (Rule 11); raise the Chris Ward
   items (TU S8 video inconsistency OQ-3, IV export cap OQ-4, permission-model
   OQ-5); designs still pending; live-observed evidence only (Rules
   10/12/13/14).
6. Keep PO attribution straight: Report Suite = **Chris Ward**.

---

# UPDATE 2026-08-04 (final unattended session) — READ THIS FIRST TO RESUME

**Canonical deliverable: `READINESS-2026-08-04.md`.** Outstanding asks (11) live in
`../OUTSTANDING-ITEMS-REGISTER.md` under the 2026-08-04 final-session block.

## The state, in numbers — all set-equal BOTH directions

**ours 469 · live under group 4281 = 474 (5 foreign, hands-off) · run 359 = 469 tests / 529 results ·
local bodies 535 = 469 active + 66 Retired · id-map 469 rows, 0 blanks · unified import 469 rows ·
six split imports 84+111+71+59+76+68 = 469 · verdict ledger 469.**
324 verified against the build · 115 deviations · 13 not built · 17 external · 16 failing an open
ticket · 47 held for Chris · 52 needing a tool · **392 automatable today.**

## ⚠️ THE BUILD MOVED — everything live is provisional

`v3.4.1-0ed4433` → **`v3.4.1-3d03023`** at **2026-08-04 10:41:58 UTC** (all three markers changed).
`build-change-2026-08-04/BUILD-MOVED-2026-08-04.md`. The Rule-49 queue
(`viu-2026-08-03/RECHECK-QUEUE.md`) is **OPEN for two reasons now** and covers **all 469** (C30098 was
added — it had never been on it). **The provenance lines say "the build tested on 8/4/2026", which is
ambiguous because two builds existed that day** — re-stamping needs a live session.

## What this session did

1. **Settled the count** — `count-reconciliation-2026-08-04.md`. 9 cases were genuinely deleted (the
   authorised merges); both earlier counts were correct, an hour apart. Every deletion was **folded
   into its survivor first**, verified by re-reading the absorbed bodies and locating the three
   "covered elsewhere" lines verbatim in C30354, C30460 and C30359/C30367/C30369/C30371.
2. **Answered Ruling 3, re-driven LIVE on the new build** —
   `rulings-2026-08-04/RULING-3-RECONFIRMED-NEW-BUILD.md`. Money **correct** (0 arithmetic failures
   over 9,275 rows) but **text** (55,656/55,656 cells); `columns=` still ignored (3 exports, identical
   SHA-256). **The deploy added a `"Date Range:"` metadata line, which breaks C30590** — not edited,
   needs approval.
3. **Stamped the different-reason notes** — `step3-notes-2026-08-04/`. 8 `update_case`, all 200 +
   byte-verified, 0 collateral. C30528/30530/30531/30533 (nightly) and C30609/30610 (history) now say
   **mark BLOCKED, not failed**; C30589 carries the verbatim known-and-accepted line; C30588 carries an
   accurate non-contradictory variant.
4. **Fixed the local-source landmine** — `step4-retire-2026-08-04/LOCAL-SOURCE-FIX.md`. The 9 merge
   deletions marked `Retired`; **and the real hazard found**: the local source was stale, so
   regenerating the import **silently deleted all 47 do-not-automate warnings**. Re-synced from live,
   regenerated, re-merged C-ids. **Never run `gen_import.py` without `sync_local.py` before it and the
   C-id re-merge after it.**
5. **Closed out the merges** in the Rule-46 register — `final-push-2026-08-04/DELIBERATE-DECISIONS.md`
   D11. 8 merges + the cut executed; **`MG-WIP-TOTAL-PINNED` DECLINED** (C30521 and C30494 both live).
6. **Reconciled and reported** — `step6-reconcile-2026-08-04/` + `READINESS-2026-08-04.md`. Rule-28
   sweep re-run over all 469 across the 253 shared anchors: **0 contradictions**, and the 5 automatic
   polarity flags are all **correct** scope-conditional wording, not conflicts.

## Honest limits

- Two Ruling-3 items are **carried forward from `0ed4433`, not re-observed**: the on-screen column
  order, and a per-cell API cross-check. **My own fault** — I burned the refreshed session with ~10
  `quick-login` calls. `quick-login` is stateful on the shared `PHPSESSID`; probe **sequentially**.
- The report **data** endpoint `GET /api/reporting/reports/inventory-value` returned **409 "Session has
  expired."** on `3d03023` even on a fresh single login, while the **export** endpoint returned 200 on
  the identical scope. **Not asserting which** — one clean probe next time.

# CORRECTION 1 — SV-8823 is re-opened, so the cases that find it must point at it · 2026-08-04

## SV-8823's live status, read from Jira this run — not inherited

| Field | Value (read live `GET /rest/api/3/issue/SV-8823`, HTTP 200) |
|---|---|
| **Status** | **Open** |
| **Resolution** | **None** |
| **Priority** | **Low** |
| Parent | SV-8582 (the Report Suite epic) |
| Type | Bug |
| Summary | *"Inventory Value spreadsheet: money arrives as text, and the file ignores the chosen columns and re-orders them"* |
| Last updated | 2026-08-04T09:07:53−0500 |

**The re-open is in the changelog, so there is no doubt about it:**

```
2026-08-04T00:55:27  resolution None -> Done      \  closed earlier in the day
2026-08-04T00:55:27  status     Open -> OBSOLETE  /
2026-08-04T01:01:01  priority   Medium -> Low
2026-08-04T09:07:33  resolution Done -> None      \
2026-08-04T09:07:33  status     OBSOLETE -> Blocked > RE-OPENED
2026-08-04T09:07:38  status     Blocked -> Ready to Fix
2026-08-04T09:07:41  status     Ready to Fix -> Open
```

So the *"Known and accepted … Do not raise this as a new problem"* sentence that stood on
**C30589** was **false from 09:07 onwards**. It has been replaced.

---

## THE TRUE SET — established by sweeping all 469, not from the given list

**Four cases**, and the sweep that produced them is reproducible.

| # | Case | Report | What it asserts | Why it fails now |
|---|---|---|---|---|
| 1 | **SBC-EXP-04 = [C30162](https://shopview.testrail.io/index.php?/cases/view/30162)** | Sales By Customer | *"Currency values are plain numbers with no dollar sign and no thousands separators."* | file carries `$224.92` |
| 2 | **SBR-EXP-12 = [C30287](https://shopview.testrail.io/index.php?/cases/view/30287)** | Sales By Representative | *"Numeric columns are plain numbers — NO currency symbol, thousands separators…"* | file carries `$1,979.40` |
| 3 | **IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)** | Inventory Value | *"…only the columns currently shown, in the same left-to-right order as the screen, with Total Cost last."* | `columns=` has no effect; `Total Cost` is 8th of 11, not last |
| 4 | **IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589)** | Inventory Value | *"…money values are written as plain numbers … NO thousands separators."* | file carries `$11,176.88` |

### How the set was established (and what it excluded, with the reason)

**Step 1 — a keyword sweep over all 469** for export + column-selection / column-order /
money-format language returned **27 candidates**. Every one was then read in full.

**Step 2 — an exhaustive targeted sweep** for the money-format assertion itself
(`plain number`, `no dollar sign`, `no currency symbol`, `no thousands separator`,
`parse cleanly`) returned **8 cases**. Five were **on-screen** assertions, not export ones, and
are correct as written — **[C30401](https://shopview.testrail.io/index.php?/cases/view/30401)**
(hours, not money), **[C30552](https://shopview.testrail.io/index.php?/cases/view/30552)**
(on-screen `$` formatting — which the build does),
**[C30142](https://shopview.testrail.io/index.php?/cases/view/30142)**,
**[C30485](https://shopview.testrail.io/index.php?/cases/view/30485)**,
**[C30585](https://shopview.testrail.io/index.php?/cases/view/30585)** (sorting by value).

**Step 3 — the live build decides, per report.** I did not assume the ticket's title
(*"Inventory Value spreadsheet"*) bounded the behaviour. Both halves were driven live on
`v3.4.1-3d03023` this run.

**Money as text — 5 of the 6 reports, not one.** Census of the export files
(`evidence/money-and-order-LIVE-2026-08-04.json`, plus the 36 captured surfaces):

| Report | Money in the spreadsheet | A case asserts plain numbers? |
|---|---|---|
| Inventory Value | `$11,176.88` — text | **yes → C30589 fails** |
| Sales By Customer | `$224.92` — text | **yes → C30162 fails** |
| Sales By Representative | `$1,979.40` — text | **yes → C30287 fails** |
| Parts Velocity | `$0.00` — text | no case asserts it — nothing to correct |
| Work In Progress | `$314.92` — text | **[C30512](https://shopview.testrail.io/index.php?/cases/view/30512) asserts `"$1,234.56"` — it MATCHES the build, so it passes** |
| Technician Utilization | plain numbers | not affected at all |

**Chosen columns ignored — 3 of the 6 reports.** Same request, three column sets each:

| Report | `columns=` honoured? | Invalid column rejected? | Verdict |
|---|---|---|---|
| **Inventory Value** | **no** — 4 requests, one SHA-256 | **no** | **broken** |
| **Sales By Customer** | **no** — 4 requests, one SHA-256 | **no** | **broken** |
| **Sales By Representative** | **no** — 3 requests, one SHA-256 | **no** | **broken** |
| Parts Velocity | yes — different files | yes, HTTP 400 | correct |
| Technician Utilization | yes — different files | yes, HTTP 400 | correct |
| Work In Progress | yes — different files | yes, HTTP 400 | correct |

**But only Inventory Value has a case that fails on it.** Only **three** cases in the whole
suite assert that a download reflects the columns you chose —
**[C30437](https://shopview.testrail.io/index.php?/cases/view/30437)** (Technician Utilization)
and **[C30511](https://shopview.testrail.io/index.php?/cases/view/30511)** (Work In Progress),
both of which **pass** because their reports honour the parameter, and **C30588** (Inventory
Value), which fails. **Sales By Customer and Sales By Representative have no column picker**, so
there are no chosen columns for their export to ignore — which is why the broken parameter on
those two costs us no test today. **It is still a live build fault, and it is raised as an
outstanding item rather than quietly filed under "no case affected".**

**One case that looked like a candidate and is provably fine.**
**[C30161](https://shopview.testrail.io/index.php?/cases/view/30161)** enumerates the Expanded
CSV's thirteen columns *"in this exact order"*. Requirement text and live file header, side by
side (Rule 45(e) — quoted, not asserted):

```
case:  Customer, Asset, Invoice #, Date, Inv. Hrs, Labor Invoiced, Labor Margin,
       Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal
build: Customer, Asset, Invoice #, Date, Inv. Hrs, Labor Invoiced, Labor Margin,
       Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal
```

**Identical. It passes, and it stays out of the set.**

---

## WHAT WAS WRITTEN — `update_case` only, 4 operations

**No assertion was changed on any of the four.** Per the QA lead's ruling these cases found the
defect, so they keep their expectations and are expected to fail until it is fixed.

| Case | What changed | What did NOT change |
|---|---|---|
| C30162 | added a plain sentence naming what the build does + the standard known-issue line | all 4 numbered assertions; provenance line already current |
| C30287 | same | all 6 numbered points, including the Sales-Representative rename note |
| C30588 | the false *"a decision on it is pending … you do not need to raise it again"* note replaced by the standard known-issue line; the back-to-front provenance tail (*"that specification currently states otherwise … treat the behaviour described above as what the build does today"*) corrected to the plain form | all 5 numbered points; **the DO-NOT-AUTOMATE line is deliberately KEPT** |
| C30589 | the false *"Known and accepted: … Do not raise this as a new problem"* replaced by the standard known-issue line, and moved above the separator so it sits where every other known-issue line sits | all 3 numbered assertions |

**The line used is byte-identical to the form already on the SV-8818 and SV-8820 cases:**

```
Known issue: the product does not currently do this. It has been filed for a fix here: https://shopview.atlassian.net/browse/SV-8823
```

### Two judgement calls, stated openly rather than buried

**1 · C30588 keeps its DO-NOT-AUTOMATE line.** It would have been tidier to move the case
cleanly into "known broken". I did not, because the line says the behaviour *"is waiting on an
answer from the product owner"* and **I have no evidence Chris Ward has answered** — the open
question is about whether the specification's wording should change, which the ticket being
re-opened does not settle. Removing it would also have dropped the live warning count from 47 to
46, and that count is something the QA lead explicitly asked me to verify. **So C30588 now sits
in both columns, which is what is actually true of it.** If the QA lead wants it moved cleanly
into known-broken, that is one further `update_case` and his word.

**2 · C30588's provenance tail was corrected, and that is a content change beyond adding a
link.** It read *"on this point that specification currently states otherwise and a product
decision is still awaited, so treat the behaviour described above as what the build does today"*.
Both clauses were wrong: the specification says **exactly** what point 1 says (`S10-R3`:
*"Both downloads include only the columns currently shown, in the same left-to-right order as the
screen, with Total Cost last."*), and the behaviour described above is **not** what the build
does. Leaving it would have contradicted the known-issue line sitting three lines above it.

---

## VERIFICATION — Standing Rule 50, exhaustive then exact

| Check | Result |
|---|---|
| Operations | **4 × `update_case`**, one field each (`custom_expected`) |
| **No** `add_case` / `delete_case` / `add_section` / `update_run` / result write | **confirmed — none attempted** |
| Pre-write snapshot | full `get_case` of all 469 pulled read-only first (`data/live-4281-START.json`) |
| Drift guard | each case re-GET immediately before writing and proven byte-identical to the snapshot on all fields but `updated_on`/`updated_by` — **0 drifted** |
| Post-write proof | re-GET, **28 fields byte-compared per case**; the intended field equal to the intended bytes, **all 27 others byte-identical to the pre-write snapshot** |
| Mismatches | **0** — the abort path never fired |
| `refs` normalisation | compared under the one declared rule (`','.join(p.strip() …)`); **this pass wrote no `refs`**, so the guard was inert |
| Rule 38 | executor hard-refuses `created_by != 3` and the five foreign ids; never fired |

**Per-operation log:** `data/exec-c1-apply.jsonl` · executor `tools/exec_c1.py`.

```
C30162: 200 + byte-verified MATCH, 28 fields compared   (565 -> 907 chars)
C30287: 200 + byte-verified MATCH, 28 fields compared  (1152 -> 1449 chars)
C30588: 200 + byte-verified MATCH, 28 fields compared  (1893 -> 1728 chars)
C30589: 200 + byte-verified MATCH, 28 fields compared   (776 ->  803 chars)
```

### Rule 41 — the whole case was re-read, not only the edited field

All four re-verified end to end against the current specification before saving —
title · preconditions · every step · every expected line · refs · section · type.

| Case | Title length | `refs` carries ticket + anchor | Spec version in `refs` matches the provenance line | Steps executable in order | Second finding |
|---|---:|---|---|---|---|
| C30162 | 71 | yes — `SV-8612 (SBC spec v13 … S14-R9 …)` | yes, v13 | yes | none |
| C30287 | 69 | yes — `SV-8631 (SBR spec v15 … S14-R17 …)` | yes, v15 | yes | none |
| C30588 | 73 | yes — `SV-8677 (IV spec v3 … S10-R3 …)` | yes, v3 | yes | the back-to-front provenance tail — **fixed in the same write** |
| C30589 | 70 | yes — `SV-8677 (IV spec v3 … S10-R7 (+ context note))` | yes, v3 | yes | none |

None of the four contains API content, so none is misplaced against Standing Rule 4.
**0 stale anchors, 0 titles over 80 characters.**

### Run 359 — proven untouched

| Check | Before | After | Verdict |
|---|---|---|---|
| `include_all` | false | false | unchanged |
| Tests | 469 | 469 | **case_id sets equal in BOTH directions — 0 missing, 0 added** |
| Recorded results | 529 | 529 | **every one present BY ID, checked individually — 0 missing** |
| Test ids | — | — | identical set |

### The five foreign cases — proven untouched, not merely unwritten

**C38919 · C38920 · C38921 · C38922 · C38923** re-read after the batch and **byte-identical on
every field including `updated_on`**. *"We did not write to them"* is an assertion; a
byte-identical timestamp is evidence.

---

## RECONCILIATION — the four counts, by set equality in both directions

| Count | Value |
|---|---|
| Live cases under group 4281 that are **ours** | **469** |
| Local active authored cases (generator's own retirement rule) | **469** |
| `testrail-id-map.csv` rows | **469** — 0 blank C-ids |
| Import data rows | **469** |

**live-ours == id-map** both ways, **local-active == id-map** both ways. Live total under the
group is **474 = ours 469 + foreign 5** (Rule 38 — both numbers, always).

### The local source was stale, and that was caught before regenerating — not after

The brief warned that a previous regeneration silently wiped the DO-NOT-AUTOMATE warnings
because the local source was behind live. **It was behind again, in the same field:** all
**469** local `expected` blocks still carried the older provenance line *without* the
`(build v3.4.1-3d03023)` marker. Regenerating first would have reverted every one of them.

So the local source was **re-synced from live before anything was generated**
(`tools/sync_local_from_live.py`): 469 `expected` blocks updated, and title / preconditions /
steps / refs confirmed already identical. **Local now matches live exactly** — 47
DO-NOT-AUTOMATE lines, 18 known-issue lines, 4 SV-8823 links, 469 build markers, **0** remaining
"Known and accepted".

### Deliverable hygiene, after regeneration

| Check | Result |
|---|---|
| Import header SHA-256 vs **all five** peer projects | **identical** — `2a4f7463eb91e36a…` |
| Rows | 469 · per report 84 / 111 / 71 / 59 / 76 / 68 |
| Blank titles · duplicate (section, title) · internal-id leaks | **0 · 0 · 0** |
| "VIU" · "feature flag" · "flag on" · "flag off" | **0 · 0 · 0 · 0** |
| API cases outside an 'API' section | **none** (28 API cases) |
| **DO-NOT-AUTOMATE lines surviving in the import** | **47** |
| Known-issue lines · SV-8823 links · build markers | **18 · 4 · 469** |
| id-map C-ids re-merged after the generator blanked them | **469 / 469, 0 blank** |

---

## OUTSTANDING — what I need from you

1. **SV-8823's title says "Inventory Value spreadsheet", but both halves are wider than that.**
   Money arrives as text on **five** of the six reports, and the chosen-columns parameter is
   ignored on **three** (Inventory Value, Sales By Customer, Sales By Representative). Only
   Technician Utilization is clean on both. **Do you want the ticket's scope broadened to say
   so, or a companion ticket raised?** I have not touched the ticket. *(Blocks: nothing today —
   only one case fails per report and all four now point at SV-8823. It matters when someone
   fixes only the Inventory Value writer and believes the job is done.)*
2. **C30588 sits in two columns at once** — filed as a defect *and* still carrying the
   "waiting on the product owner" line. **Tell me if you want it moved cleanly into known-broken**
   and I will remove the line (one `update_case`). I left it because I cannot show Chris Ward has
   answered. *(Blocks: nothing; it makes one row of the readiness table ambiguous.)*
3. **Chris Ward still owes the 47 answers.** Outstanding since 2026-08-03.
   *(Blocks: those 47 cannot be automated without risking locking in the wrong behaviour.)*
4. **Tell me when engineering declares the branch final** — the re-check queue stays open until
   then and everything here is provisional. *(Blocks: calling the suite complete at all.)*

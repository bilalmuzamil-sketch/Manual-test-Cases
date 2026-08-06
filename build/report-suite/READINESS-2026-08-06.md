# Report Suite — automation readiness, 6 August 2026

> **`READINESS-2026-08-05.md` and `READINESS-2026-08-04-POST-DEPLOY.md` are SUPERSEDED by this file.**
> Both are kept, not deleted. `READINESS-2026-08-04.md` is kept too. All three describe builds that no
> longer exist.

**Every figure in this file was read live from TestRail between `2026-08-06T11:00:04Z` and
`2026-08-06T11:04:58Z`.** Nothing here was copied from a handover note. **A pass is in flight on this
project right now, so these are a snapshot and they will move.** Proof that they already have: the
pass's own notes say `357 READY + 77 EXPECT-FAIL + 42 HOLD` (`RESUME.md` line 123,
`FINDINGS-SESSION3.md` line 32). **Live, twenty minutes later, it is `343 + 92 + 41`.** That is why
this report re-derives everything.

**This report was read-only.** No case was written, no run was written, no result was logged, nothing
was filed in Jira.

---

## 1 · The one number

**435 of our 476 cases can be handed to the automation engineer today.**

**The formula, written once:** every case carries exactly one machine-findable marker at the very end of
its Expected Results. **Ready to automate = the cases marked `AUTOMATION: READY` plus the cases marked
`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`.** That is **343 + 92 = 435**. Equivalently, **476 minus the
41 marked `AUTOMATION: HOLD`**. **Both arithmetics were read back from the live case text, not computed
from our notes. THE ARITHMETIC GATE PASSES.**

**Our cases: 476. Live total under the Report Suite group: 481.** The five-case difference is
**C38919–C38923**, which belong to **Vladimir Tomovic**. They are not ours, they are excluded from every
figure in this file, and they were not touched.

**The figure moved 446 → 435 since yesterday, and the direction is honest.** `HOLD` rose from 30 to 41
as the pass found eleven more things it genuinely cannot observe on this environment. **A lower honest
figure is the point of the exercise.**

---

## 2 · The number that is NOT ready — read this before the tables

**Not one of the 476 cases has been checked against the build that is running right now.**

The branch redeployed **at 10:43:37Z this morning**, after every pass this week had finished. The build
now serving is:

| | |
|---|---|
| app-version | **`v3.5-f77875c`** |
| `index.html` last-modified | **Thu, 06 Aug 2026 10:43:37 GMT** |
| etag | `829ed03832a746e78cbdb28eb9957a3e` |
| sha256 of `index.html` | `b0f05b6f5d9032586fb2e62d087ea6d3851118d6d30c649344388072894fc9b6` |
| read at | 10:59:33Z and 10:59:46Z — **byte-identical both times** |

**Cases naming `v3.5-f77875c`: 0 of 476.**

So the correct sentence is: **0 of 476 observed on build `v3.5-f77875c`; the remaining 476 carry their
last recorded check.** This suite is **not current** and must not be described as current.

---

## 3 · Outcomes by report — every row adds up, and so does the total

Every case falls in **exactly one** of these three columns. Nothing else on this page changes which
column a case is in.

| Report | Cases | No deviation recorded | Product is wrong | On hold | Ready to automate |
|---|---:|---:|---:|---:|---:|
| Sales By Customer Report | 87 | 63 | 14 | 10 | 77 |
| Sales By Representative Report | 112 | 89 | 18 | 5 | 107 |
| Parts Velocity Report | 71 | 61 | 9 | 1 | 70 |
| Technician Utilization | 60 | 35 | 19 | 6 | 54 |
| Work In Progress | 78 | 60 | 13 | 5 | 73 |
| Inventory Value | 68 | 35 | 19 | 14 | 54 |
| **TOTAL** | **476** | **343** | **92** | **41** | **435** |

**Every row's three outcome columns sum to its Cases figure, and the three totals sum to 476.** Nothing
is double-counted and nothing is left out.

**Why the first column is called "No deviation recorded" and not "Passes".** `AUTOMATION: READY` asserts
that a case is **automatable**, not that it currently passes (Standing Rules 60 and 61). One case proves
the difference: **SBC-COL-04 = [C43550](https://shopview.testrail.io/index.php?/cases/view/43550)** is
marked `READY` and has **never been checked against any build**. Calling that column "passes" would be a
claim we cannot support.

**A case in the "Product is wrong" column is a GOOD case.** It states what the documents require, the
build does something else, and a developer ticket exists. It is **expected to FAIL** until that ticket is
fixed, and it carries a plain block telling the tester exactly what they will see, that the failure is
already reported, and what to do if it fails in some *other* way instead. **Those 92 are ready to
automate and are counted in the 435.**

---

## 4 · Which build each verdict came from — the honest split

**The 476 verdicts do not come from one build. They come from three, and none of them is the build
running now.**

| Report | Cases | `v3.5-7168d14` (today 08:32Z) | `v3.5-16cf83f` (5 Aug) | `v3.4.1-3d03023` (4 Aug) | Never checked |
|---|---:|---:|---:|---:|---:|
| Sales By Customer Report | 87 | 45 | 29 | 11 | 2 |
| Sales By Representative Report | 112 | 64 | 3 | 44 | 1 |
| Parts Velocity Report | 71 | 0 | 54 | 17 | 0 |
| Technician Utilization | 60 | 0 | 60 | 0 | 0 |
| Work In Progress | 78 | 24 | 12 | 41 | 1 |
| Inventory Value | 68 | 0 | 68 | 0 | 0 |
| **TOTAL** | **476** | **133** | **226** | **113** | **4** |

**The four columns sum to 476 on every row and in the total.**

**Read that middle-right column carefully. 113 cases carry a verdict from Tuesday's build and are three
deploys behind** — 105 of them are in the "no deviation recorded" column, so 105 of our "fine" answers
are two days old. Every case says on itself which build it was checked against, so this is visible per
case rather than hidden in an average.

**The 4 never-checked cases, named:**

| Case | Report |
|---|---|
| SBC-COL-04 = [C43550](https://shopview.testrail.io/index.php?/cases/view/43550) | Sales By Customer |
| WIP-PERS-05 = [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | Work In Progress |
| SBC-LINK-05 = [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | Sales By Customer |
| SBR-LINK-06 = [C43559](https://shopview.testrail.io/index.php?/cases/view/43559) | Sales By Representative |

---

## 5 · The automation-marker census, read live

| Marker | Count |
|---|---:|
| `AUTOMATION: READY` | 343 |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 92 |
| `AUTOMATION: HOLD - <reason>` | 41 |
| **TOTAL** | **476** |
| Cases with no machine-findable marker | **0** |
| Cases with more than one marker | **0** |

**Exactly one marker on every one of the 476 cases.**

**The 12 raw-HTML cases have been REPAIRED — checked live, one by one, not taken on trust.** Our records
still say twelve Work In Progress cases show raw markup and hide their marker inside `<p>` tags. **That is
now out of date.** All twelve — [C30451](https://shopview.testrail.io/index.php?/cases/view/30451),
[C30456](https://shopview.testrail.io/index.php?/cases/view/30456),
[C30457](https://shopview.testrail.io/index.php?/cases/view/30457),
[C30460](https://shopview.testrail.io/index.php?/cases/view/30460),
[C30487](https://shopview.testrail.io/index.php?/cases/view/30487),
[C30490](https://shopview.testrail.io/index.php?/cases/view/30490),
[C30491](https://shopview.testrail.io/index.php?/cases/view/30491),
[C30493](https://shopview.testrail.io/index.php?/cases/view/30493),
[C30519](https://shopview.testrail.io/index.php?/cases/view/30519),
[C30522](https://shopview.testrail.io/index.php?/cases/view/30522),
[C30526](https://shopview.testrail.io/index.php?/cases/view/30526) and
[C30528](https://shopview.testrail.io/index.php?/cases/view/30528) — now carry plain text and a
machine-findable marker. **A sweep of all 476 found no raw markup anywhere: 0 cases.**

---

## 6 · FLAGS — separate from the outcomes above

**A flag never changes which outcome column a case is in.** These are things worth knowing about cases
that already have their one outcome.

| Flag | Cases | Note |
|---|---:|---|
| **Provenance line contradicts itself** — the case says both "Last checked against build …" **and** "has not yet been checked against a build" | **5** | Our own defect. The stale sentence was not removed when the case was checked. **C30278 and C43557 carry the "not checked" claim twice.** |
| Verdict is 3 deploys behind (sits on `v3.4.1-3d03023`) | **113** | Section 4. Not a case defect — a currency gap. |
| Never checked against any build | **4** | Section 4. **Overlaps the row above it by 0** — a case is in one build column or the other. |
| Depends on a restricted-permission user to observe | **20** | Section 7. **Only 8 of the 20 are on hold**; the other 12 are marked automatable because an automation harness can provision the login we cannot. |
| Raw markup / marker not machine-findable | **0** | Repaired — section 5. |
| Duplicated marker or duplicated provenance line | **0** | Swept all 476. |

**The 5 contradictory provenance lines, named:**
SBR-EXP-03 = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) ·
SBC-EXP-16 = [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) ·
TU-EXP-10 = [C43552](https://shopview.testrail.io/index.php?/cases/view/43552) ·
SBC-EXP-17 = [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) ·
WIP-COL-09 = [C43557](https://shopview.testrail.io/index.php?/cases/view/43557).

**Reported, not fixed** — this report is read-only, and repairing them is a write that needs your
go-ahead.

**Where the counts overlap, stated in the open:** the 20 restricted-user cases overlap the outcome table
— 8 sit in "on hold", 9 in "no deviation recorded" and 3 in "product is wrong". They are a flag, not a
fourth outcome, so they are **not** added to anything in section 3.

---

## 7 · The 41 on hold — what each is waiting for, and who owes it

| Waiting on | Cases | Who owes it |
|---|---:|---|
| **This environment has no such data state** — no invoice without a vehicle, no voided invoice in range, no part with a core flag, no location without a default labor rate, no technician clocked in, no logo that fails to load | 13 | engineering / test-data |
| **Chris Ward — the Location-column contradiction** (four descriptions say it two ways) | 8 | **Chris Ward** |
| **A second sign-in as a restricted user** | 7 | **QA lead** |
| **A server-side nightly job, not reachable from the app** — the nightly capture, retention pruning, thinned history | 6 | engineering |
| **Chris Ward — another product answer** (the invoice-link rule, the work-order link rule) | 4 | **Chris Ward** |
| **Our tooling cannot drive it** — the calendar past a 366-day span | 2 | us |
| **The feature is not built** — SBR-WO-02 = [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) | 1 | engineering |
| **TOTAL** | **41** | |

**These seven rows total exactly 41, the HOLD count — no case is double-counted and none is missing.**

**The 8 held on the Location column:** WIP-COL-02 = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) ·
WIP-EXP-02 = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) ·
IV-COL-01 = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) ·
IV-COL-04 = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) ·
IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) ·
SBC-LOC-04 = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) ·
WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) ·
IV-LOC-06 = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917).

**⚠️ A correction to our own record.** The pass's question sheet
(`full-viu-2026-08-06/QUESTIONS-FOR-CHRIS.md`, Q5) tells Chris that **"sixteen tests are on hold for
this"**. **Live, the number is eight.** Thirty-three cases mention the Location column, but only eight
are held on it. **The sheet has not been sent yet, so the figure can still be corrected before it
reaches him** — and it should be, because an inflated number in a question to a PO is the kind of thing
that gets the whole sheet distrusted.

**The 7 needing a second sign-in:** TU-NAV-07 = [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) ·
TU-LOC-05 = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) ·
IV-LOC-04 = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) ·
IV-PERM-01 = [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) ·
IV-PERM-02 = [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) ·
SBC-LINK-05 = [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) ·
SBR-LINK-06 = [C43559](https://shopview.testrail.io/index.php?/cases/view/43559).

---

## 8 · What is blocked, and on whom — the four facts for each

| What is missing | Who owes it | What it blocks | Since when |
|---|---|---|---|
| **A non-administrator sign-in on this branch.** This branch refuses to let an admin become a non-admin: `switch-user` returns **403 "Access denied."** and `quick-login {"key":"tech"}` returns **403**. Neither was called during this report — they rotate the shared session and would sign out the worker live on this branch. | **QA lead** | **7 cases outright**, and the observation of **20** that depend on a restricted user. Every permission assertion on all six reports. | 2026-08-05, unresolved through three sessions |
| **Chris Ward's answer on the Location column.** Four of the six descriptions say it two ways in the same document. The decision notes already say it is the user's own choice; four numbered requirements still say the opposite. **This may be a five-minute edit rather than a decision.** | **Chris Ward** | **8 cases on hold.** | 2026-08-05 |
| **Four unfinished contradictions in his own descriptions** — SBR S21-R7, WIP S7-R13, IV S7-R6, SBC S13-R4 (and PV S3-R10 was never changed on this point at all). | **Chris Ward** | The same 8, plus the risk that any repair we make is overtaken again. | 2026-08-05 |
| **The ten-thousand-row download limit is missing from three descriptions.** Verified live in this report: it **is** documented in **SBC v15, SBR v17 and IV v4**, and is **absent from PV v5, TU v6 and WIP v9**. The refusal is deliberate and correct — it is in epic story [SV-8591](https://shopview.atlassian.net/browse/SV-8591) — but an engineering ticket is not a product description. | **Chris Ward** | Nothing is on hold for it, but on three reports a tester meeting that message has nothing to check it against. | 2026-08-06 |
| **The A4 orientation contradiction on Sales By Representative.** Verified live: **SBR v17 S14-R3 says "A4 portrait"**, while **SBC says "A4 landscape"**. Both reports actually render landscape, and the SBR table has sixteen columns, which could not fit portrait. | **Chris Ward** | The orientation half of one export case. | 2026-08-06 |
| **The branch declared final**, or told plainly that it never will be. | engineering | All 476 verdicts stay PROVISIONAL and five re-check queues stay open. | 2026-08-03 |
| **Test-data states this environment cannot produce** — an invoice with no vehicle, a voided invoice in range, a part with a core flag, a location without a default labor rate, a clocked-in technician, a logo that fails to load. | engineering / test-data | **13 cases on hold.** | 2026-08-06 |
| **Access to the server-side nightly capture** — its stored rows, its re-run, its retention pruning. | engineering | **6 cases on hold.** | 2026-08-06 |

**⚠️ The question sheet for Chris has NOT been sent.** Seven questions are written up as raw material in
`full-viu-2026-08-06/QUESTIONS-FOR-CHRIS.md`; **turning them into his sheet and sending it is still
queued. On the Location column, the blocker is us, not him.**

---

## 9 · Tickets we have filed against this epic — 60

| Shape | Count | Priority | Keys |
|---|---:|---|---|
| `Bug` on the epic (pre-2026-08-05 convention, **correct for its date**) | 8 | all **Low** | [SV-8818](https://shopview.atlassian.net/browse/SV-8818) · [SV-8819](https://shopview.atlassian.net/browse/SV-8819) · [SV-8820](https://shopview.atlassian.net/browse/SV-8820) · [SV-8821](https://shopview.atlassian.net/browse/SV-8821) · [SV-8823](https://shopview.atlassian.net/browse/SV-8823) · [SV-8879](https://shopview.atlassian.net/browse/SV-8879) · [SV-8880](https://shopview.atlassian.net/browse/SV-8880) · [SV-8881](https://shopview.atlassian.net/browse/SV-8881) |
| `Story Defect` on the owning story, filed **before 05:39Z today** | 40 | **Low** | [SV-8907](https://shopview.atlassian.net/browse/SV-8907) · [SV-8908](https://shopview.atlassian.net/browse/SV-8908) · [SV-8925](https://shopview.atlassian.net/browse/SV-8925)–[SV-8932](https://shopview.atlassian.net/browse/SV-8932) · [SV-8934](https://shopview.atlassian.net/browse/SV-8934)–[SV-8940](https://shopview.atlassian.net/browse/SV-8940) · [SV-8943](https://shopview.atlassian.net/browse/SV-8943)–[SV-8956](https://shopview.atlassian.net/browse/SV-8956) · [SV-8962](https://shopview.atlassian.net/browse/SV-8962)–[SV-8970](https://shopview.atlassian.net/browse/SV-8970) |
| `Story Defect` on the owning story, filed **from 05:39Z today** | 12 | **Medium** | [SV-8972](https://shopview.atlassian.net/browse/SV-8972)–[SV-8983](https://shopview.atlassian.net/browse/SV-8983) |
| **TOTAL OURS** | **60** | 48 Low · 12 Medium | |

**The priority convention changed today at 05:39Z — `Medium` from then on, `Low` before, and the `Low`
ones are correct for their date.** They should not be "corrected".

**Status, read live:** 55 Open · 3 Ready to Fix (SV-8818, SV-8820, SV-8823) · 1 Done (SV-8819, the Parts
Velocity Turns/Yr fix) · 1 OBSOLETE (SV-8821).

**[SV-8821](https://shopview.atlassian.net/browse/SV-8821) is closed OBSOLETE and its parent has been
REMOVED by someone else** — it now reads `parent: None`. **We did not re-parent it.** Re-instating a
parent on a closed ticket somebody else triaged is your call, not ours (Standing Rule 53).

**Three Story Defects on these stories are NOT ours** — [SV-8960](https://shopview.atlassian.net/browse/SV-8960),
[SV-8961](https://shopview.atlassian.net/browse/SV-8961) and [SV-8984](https://shopview.atlassian.net/browse/SV-8984),
filed by **Nebojsa Glavinic**. Untouched, and excluded from the 60.

---

## 10 · Sources — all verified live, none taken on trust

| Source | Live value | Read at | Verdict |
|---|---|---|---|
| SBC specification | **Confluence version 15** (edited 2026-08-05T17:53Z) | 11:03:03Z | CURRENT |
| SBR specification | **Confluence version 17** (edited 2026-08-05T17:53Z) | 11:03:03Z | CURRENT |
| Parts Velocity specification | **Confluence version 5** (edited 2026-08-05T13:21Z) | 11:03:03Z | CURRENT |
| Technician Utilization specification | **Confluence version 6** (edited 2026-08-05T13:33Z) | 11:03:03Z | CURRENT |
| WIP specification | **Confluence version 9** (edited 2026-08-05T17:54Z) | 11:03:03Z | CURRENT |
| Inventory Value specification | **Confluence version 4** (edited 2026-08-05T13:33Z) | 11:03:03Z | CURRENT |
| Epic **SV-8582** | **104 children** — Epic, status Open | 11:03:16Z | CURRENT |
| Build | **`v3.5-f77875c`** | 10:59:33Z and 10:59:46Z | **NOT observed by any case** |
| TestRail cases | 476 ours / 481 live | 11:00:04Z–11:00:45Z | CURRENT |

**None of the six specifications moved since yesterday.** All six were last edited on 5 August, and this
report used the **Confluence version number** — the in-body "Version" field is the Standing Rule 31(a)
trap and was not relied on.

**The epic child count is 104, not 105.** Verified **two independent ways** —
`parent = SV-8582` → 104 and `"Epic Link" = SV-8582` → 104 — **fully paged** (the first page returns only
100, so an unpaged call under-reports), with the **key sets equal in both directions** and no remainder.
**97 Stories + 7 Bugs = 104.** Our records have said both 104 and 105; **104 is right**, and the missing
one is [SV-8821](https://shopview.atlassian.net/browse/SV-8821), whose parent was removed by someone
else. **The 52 Story Defects we filed do not appear in this count** — they hang off the stories, one
level further down, which is the shape Standing Rule 52 requires.

---

## 11 · Run 359 — proven untouched

Run 359 belongs to **Nebojsa and Viktoria**. It was **read twice and written zero times.**

| | |
|---|---|
| `include_all` | **false** (so it does not pick up new cases on its own) |
| Tests | **476** |
| Result records | **535** |
| Graded by the run owner | **6 Passed** (user 2, 5 August) · 470 Untested |
| Read at | 11:04:30Z and 11:04:58Z |
| **Test id sets equal both ways across my two reads** | **yes** |
| **Result id sets equal both ways across my two reads** | **yes** |
| **Tests differing between my two reads** | **0** |
| **Results differing between my two reads** | **0** |

**The run is IN SYNC with our suite** — all 476 of our cases are present as tests, 0 missing, and the run
holds no case from outside the Report Suite group. The Standing Rule 47 duty is satisfied with no write
needed.

**The run selection has changed since the 5 August snapshot, and it reconciles exactly — benignly.** That
snapshot held **478** case ids and **539** result ids; the run now holds **476** and **535**.

* **9 cases were deleted from TestRail** by an authorised pass — C30182, C30350, C30445, C30453, C30529,
  C30532, C30544, C30586, C30608. Each now returns **HTTP 400 "Field :case_id is not a valid test case"**,
  so they genuinely no longer exist. **Deleted cases drop out of a run automatically**, which is why this
  needed no run write.
* **7 cases were added** — C43550, C43551, C43552, C43553, C43557, C43558, C43559.
* **478 − 9 + 7 = 476.** ✅
* **539 − 10 (the results belonging to the 9 deleted cases) + 6 (the owner's new gradings) = 535.** ✅

**Nothing was destroyed by a partial `case_ids` write.** Every difference is accounted for by a deletion,
an addition, or the owner's own grading.

---

## 12 · Standing Rule 49 — the branch is not final, and there are five open queues

**Engineering will not declare this branch final before release**, so **an open re-check queue is the
normal steady state of an active project** (Standing Rule 60), not an embarrassment. **All 476 verdicts
are PROVISIONAL.**

**Five queues are open, and not one is closed:**

| Queue | State |
|---|---|
| `full-viu-2026-08-06/RECHECK-QUEUE.md` | **OPEN — opened today** |
| `full-viu-2026-08-05/RECHECK-QUEUE.md` | OPEN |
| `chris-newreqs-2026-08-05/RECHECK-QUEUE.md` | OPEN |
| `final-viu-2026-08-05/RECHECK-QUEUE.md` | OPEN |
| `viu-2026-08-03/RECHECK-QUEUE.md` | OPEN |

**Say this plainly: the first session of 6 August opened no queue at all, so its verdicts were queued
nowhere.** A later session today opened one and recorded that gap rather than papering over it. **That
was a real hole in our process and it is now closed.**

---

## 13 · Honest limits — read these as part of the number

* **The branch is NOT declared final, so every one of the 476 verdicts is PROVISIONAL.** That is a
  statement about durability, not rigour.
* **0 of 476 cases have been checked against the build now running.** The branch redeployed at 10:43:37Z
  today — **the fourth deploy in three days**, and the third since the oldest verdicts here were taken.
* **The 476 verdicts come from three different builds** — 133 · 226 · 113 — **plus 4 never checked**.
  **113 are three deploys behind.**
* **A pass is in flight right now.** These figures are a snapshot at 11:00–11:05Z and were already
  different from the pass's own notes when this was written.
* **The permission cases across every report still cannot be driven.** There is one shared sign-in on
  this environment, and this branch blocks an admin from becoming a non-admin.
* **5 cases carry a self-contradictory provenance line** — our own defect, reported not fixed.
* **This report changed nothing.** It is a read-only census: no case write, no run write, no result, no
  Jira write.

---

## OUTSTANDING — what I need from you

1. **A non-administrator sign-in on this branch.** This is the single biggest gap. It is the only thing
   blocking **7 cases outright** and the only thing standing between us and observing **20**. This branch
   refuses to let an admin become a non-admin, so it cannot be worked around from our side.
2. **Chris Ward's answer on the Location column** — and please note the honest version: **the blocker is
   us, not him.** The sheet has not been sent. **And the figure in it needs correcting from "sixteen
   tests" to "eight" before it goes.**
3. **Go-ahead to repair the 5 contradictory provenance lines** (C30278, C38856, C43552, C43553, C43557).
   Five `update_case` writes, no meaning changed. Nothing was written today.
4. **The branch declared final**, or told plainly that it never will be. Until then all 476 verdicts stay
   provisional and five queues stay open.
5. **A decision on the 113 cases that are three deploys behind.** Either we re-drive them against
   `v3.5-f77875c`, or you accept that they stay on the 4 August marker and say so on themselves. **They
   should not be quietly counted as current** — and with the branch redeploying daily, re-driving all 476
   on every deploy is not affordable, which is exactly what Standing Rule 61 exists to handle.
6. **Whether to chase the three missing export-cap descriptions and the A4 orientation contradiction**, or
   leave both as recorded questions.

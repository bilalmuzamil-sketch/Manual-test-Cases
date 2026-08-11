# Schedule assertion forensics — FINDINGS — 2026-08-11

**READ-ONLY pass: 0 TestRail writes · 0 Jira calls · 0 Confluence writes · no build opened.**
The audit itself, with both texts quoted for every verdict, is `AUDIT.md`. This file carries what the
audit *found* rather than how it measured.

---

## 1 · 🔴 THE ONE LIVE DEFECT — C29944, introduced by the pass that was fixing this exact problem

**SCH-FILT-03 = [C29944](https://shopview.testrail.io/index.php?/cases/view/29944), expected result 3:**

> *"Choosing more than one status shows the work orders of all the chosen statuses together."*

**No source in Rule 57's list supports it.** All searched, all recorded:

| Source | Searched for | Result |
|---|---|---|
| **Specification §5.1, all 27 Confluence versions** | `multi`, `multi-select`, `multiple`, `more than one`, `several` | **ABSENT FROM EVERY VERSION** — v1 through v27 |
| **Epic story SV-8687** | multi-select of the Status filter | not stated |
| **Engineering tech plan** | `multi-select` | one hit, a **technician roster control on `LineDialog.vue`** — unrelated |
| **The design** (`design-2026-07-27/`) | multi-select / more than one status | nothing |
| **Branko's answers** (Jul 31, Aug 5) | multi-select / multiple statuses | nothing |

**§5.1 in full says only:** *"Status | All work order statuses currently supported in the app"* — a
statement about **which statuses appear in the list**, not about **how many you may pick.**

**AND THE CASE'S OWN METADATA STILL SAYS SO**, unchanged since authoring on 2026-07-21:

> *"Status option list = from the app (spec defers) - enumerate live. **Single vs multi-select within a
> group is not pinned - confirm live.**"*

**The mechanism is Rule 58 exactly: the authoring pass flagged the point as unpinned, the 2026-08-05 pass
confirmed it live — its own record reads *"PASS re-proven over ALL 8 statuses the filter accepts, 0
leaks"* — and the observation was written into the tester-facing expected results as a requirement.** The
hedge survives only in the metadata layer, which no tester and no reviewer reads. **The provenance line
names §5.1, so the case claims an authority §5.1 does not give it** (Rule 54's honesty clause).

**A SECOND DEFECT ON THE SAME LINE, INDEPENDENT OF THE SOURCING: it is not runnable as written.** The
steps read *"2. **Choose one status** under Status."* — the tester never picks a second status, so
**expected 3 cannot be reached by following the steps** (Rule 28, dimension 2). That corroborates the
finding from a different direction: the assertion did not come from the case's own procedure.

### ⚠️ THE PROCESS LESSON, AND IT IS THE MOST USEFUL THING IN THIS FILE

**`build/schedule/expected-behaviour-audit-2026-08-05.md` row 59 classifies C29944 as class C —
LEGITIMATE — and quotes its expected results as THREE items, with no multi-status assertion.** The audit
was committed **before** the repair, exactly as good practice requires. **Then the same pass's write added
the assertion.**

**An audit committed before the repair does not audit the repair.** That is not a slip by that pass; it is
a structural hole in the discipline, and it is why this pass exists. **The cheap fix: a post-write
re-audit of only the cases a pass actually changed** — here, a re-read of 165 bodies against their cited
anchors, which would have caught this on the day.

---

## 2 · THE 174-CASE REWRITE THIS PASS WAS POINTED AT CHANGED **ONE** ASSERTION, AND THAT ONE IS CORRECT

The brief named the post-2026-08-10 window as the primary risk, because **all 174 bodies changed** in it.
Measured: that window (`T4→T5`, 2026-08-06 07:21Z → 2026-08-11 09:39Z) changed **exactly one assertion** —
**[C30033](https://shopview.testrail.io/index.php?/cases/view/30033)**, tracking spec v26 — and it is
faithful.

| What moved in that window | Count |
|---|---:|
| Assertion bodies changed | **1** |
| Rule-61 known-issue symptom blocks **removed** | **21** |
| Rule-61 three-outcome bullets removed with them | **63** |
| Spec-version re-stamp in a note (v23 → v27) | 1 |

**That removal is LEGITIMATE and mandated, not a weakening.** It is the Rule-61 amendment of 2026-08-11
being applied — *"When there is nothing to back 'Expect fail' then not set that marker. And let the manual
QA tester simply discover whether this test fails or passes."* **The documented expectation stayed put in
all 21 cases, so every one of them can still fail.**

**⚠️ THE HONEST RIDER: 21 cases lost their pointer to a reported defect.** A tester meeting the failure on,
say, [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) will fail it with no ticket named
in the case body — which is what the QA lead asked for (discover, do not predict), **but the traceability
has moved out of the case text into `refs` and the ticket system.** Stated so nobody later reads the
removals as lost information. **Not raised as a defect** — it implements a ruling.

---

## 3 · TWO REAL FAILURES DID HAPPEN, BOTH ON 2026-08-04, AND BOTH ARE ALREADY REPAIRED

Reproduced from cold by this pass — the check that the repair was real rather than asserted.

| Case | What happened | Live state |
|---|---|---|
| **SCH-SCOPE-05 = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967)** | On 2026-08-04 rewritten to assert ***"There is no 'Select all' button and no 'Cancel' button"*** — the **ABSENCE** of two controls **§4.3 has required since v1, 2026-07-15**. A build that grew them would have FAILED; the build as it stood PASSED. | **CORRECT** — restored 2026-08-05 to the §4.3 wording |
| **SCH-LINE-03 = [C29950](https://shopview.testrail.io/index.php?/cases/view/29950)** | On 2026-08-04 the header-count assertion became *"matches the number of lines actually listed"* — **a near-tautology the build passes automatically**: if the drill-down wrongly listed an unapproved line, the count would match it and the case would still pass. | **CORRECT** — restored 2026-08-05, now ties the count to the APPROVED lines |

**Both are the textbook Rule-57 shape**, both were found by the 2026-08-05 audit and classified A. **The
repair held.**

---

## 4 · THE FILTERS WAIVER SIGNATURE DOES NOT EXIST IN THIS SUITE — a measured negative result

The wording that started the whole Rule-57 correction — *"Known and accepted … the product behaves this way
**on purpose for now**. **Do not raise this as a new problem**"* — was searched for in **every assertion
and every note line, in all nine snapshots**.

| | |
|---|---:|
| Transitions where waiver language was **added** | **0** |
| Live bodies containing it | **1** |

The single live hit is **SCH-DEL-10 = [C38864](https://shopview.testrail.io/index.php?/cases/view/38864)**:
*"Note for the tester: Undo works by performing a reversing action, not by holding the change back - a
change surviving a refresh before Undo is expected, not a bug."* **A legitimate Rule-24-style tester
note**, whose provenance names the **technical plan** for that half. **Not a waiver over a documented
requirement.**

**The dominant note pattern in this suite is the CORRECT one:** state the documented expectation, then note
plainly that the build differs and name the ticket. **27 cases did exactly that**, and 2 more say honestly
that the state *"cannot be set up … mark it BLOCKED - not failed"* instead of inventing a verdict
(Rules 12/14).

---

## 5 · TWO TRAPS IN THE SPEC'S OWN VERSION HISTORY — either would corrupt a latest-wins call

**(a) v10, v12 and v14 are TRUNCATED PARTIAL SAVES, not requirement removals.** 7,314 / 8,632 / 5,918
chars against a neighbouring ~36,000, and Branko's own next version messages read *"Fix: restore full page
content"* and *"Restore complete page"*. **A naive first-appearance scan reads them as a requirement
vanishing and returning** — which is how `Select all` appeared to have a gappy history. Excluded from all
dating here.

**(b) v26 → v27 lost 15,477 characters and lost NO CONTENT.** A 26% byte drop on a version whose message is
merely *"Add §5.3 Panel collapse"* looks like deleted requirements. Checked: **v27 has MORE content lines
than v26 (349 vs 338), gained 12 and lost exactly one**, reworded in place to add a cross-reference.
**v27 is a strict content superset. Nothing was lost.** Recorded because a scary number left unexplained
becomes folklore.

---

## 6 · THE TIMELINE — every commit that ever touched the Schedule case source

32 commits, 2026-07-21 → 2026-08-11, mapped onto the nine snapshot windows of `AUDIT.md` §3.1. The passes
that actually moved an assertion body:

| Date | Commit | Pass | Assertion changes |
|---|---|---|---:|
| 2026-08-04 | `81f367d6`, `d0d2667f` | first live VIU + recovery | **3** (2 defects, both later repaired) |
| 2026-08-05 | `43e91dc0` | final-VIU / expected-behaviour repair | **4** (3 repairs/strengthenings + **1 new defect, C29944**) |
| 2026-08-05 | `95a308bb` | provenance re-word + run-357 sync | 0 |
| 2026-08-06 | `eb3c1349` | full-VIU write of all 168 | 0 |
| 2026-08-10 | `88f43095` | source accuracy — *"every case now cites a verified-correct source"* | **0** |
| 2026-08-11 | `0c53dfdf`, `991384cb` | six §5.3 panel cases authored + pushed | n/a — new cases |
| 2026-08-11 | `735c40f4` | C30041 latest-wins trim | **1** (correct) |
| 2026-08-11 | `e2f56f64`…`06e4ed32` | read-on-date sweep, all 174 | **0** |
| 2026-08-11 | `5a310021` | sibling's staged-pack push (see `AUDIT.md` §7A) | **1** (C29998, an addition) |

**The shape of that table is the finding: the passes that rewrote the most text changed the fewest
assertions.** The 2026-08-10 pass touched **all 174 bodies and moved zero assertions**; the read-date sweep
touched all 174 and moved zero. **Volume of text changed is not a proxy for risk** — the risk sat in a
4-assertion pass whose purpose was repair.

---

## 7 · SHARED-BRANCH STATE — reported, not resolved

**This pass's own files were committed by a sibling worker, not by it.** `AUDIT.md`, `tools/forensics.py`
and five evidence files were swept into `dec83609`, `7c413026` and `5a310021` — commits whose messages are
about other work. Nothing was lost, nothing of the sibling's was disturbed, and the audit **was** on the
record before any repair was proposed, which is what the discipline requires in substance.

**And the sibling executed a TestRail push on Schedule at ~13:56Z while these files were being written**
(2 `add_case`, 7 `update_case`), taking the suite **174 → 176**. **That is their pass and it is left
entirely alone** — re-read, verified legitimate, recorded as a dated addendum (`AUDIT.md` §7A). **No file
of theirs was edited by this pass.**

Flagged because the working rules say confusing shared-branch state is reported rather than tidied.

---

## 8 · IS THE SUITE SAFE TO HAND A MANUAL TESTER AS IT STANDS?

**On the question this pass was asked — are the cases faithful to their sources? — YES, with one exception,
and the exception is one line.**

**175 of the 176 cases carry expected results that can be quoted back to a document.** The one that cannot
is **C29944 expected 3**, and its practical harm is small and specific: **a tester who follows the steps
never reaches it**, so it will most likely be skipped rather than mis-graded. **It should still be
repaired, because it asserts a requirement nobody has agreed to**, and because the provenance line lends
it an authority §5.1 does not give.

**THREE THINGS THAT ARE *NOT* SETTLED BY THIS PASS, AND THEY MATTER MORE THAN C29944:**

**(a) NOT ONE OF THE 176 CASES IS VERIFIED AGAINST THE BUILD NOW RUNNING.** All three branches were
declared final on 2026-08-11, so a deviation is a real defect in a finished feature — and
`build/schedule/build-verify-2026-08-11/BUILD-VERIFICATION.md` records **0 of 174 observed**, the session
having died 14 minutes in. **This pass says the cases are faithful to their sources; it says nothing about
whether the product meets them.** The release is Thursday.

**(b) THE `Rule-49` QUEUE IS OPEN**, and **13 cases are held on a second non-administrator sign-in
outstanding since 5 August.**

**(c) THE DESIGN BASELINE CANNOT BE DATED**, and since 2026-08-06 the design is an authoritative source of
expected behaviour — so **~48 pinned labels rest on an artefact whose currency nobody can establish**
(`SOURCE-CURRENCY.md` §C). **That is a larger exposure than anything this pass found**, and it is
unanswered.

---

## 9 · OUTSTANDING — what I need from you

| # | What is needed | From whom | What it blocks | Since |
|---|---|---|---|---|
| **1** | **Go-ahead on `STAGED-REPAIRS.md` R1** — remove or scope-condition C29944 expected 3 | QA lead | the one live unsourced assertion in the suite | today |
| **2** | **Go-ahead on R3** — resync the local case source for C30041 | QA lead | **a regeneration today would resurrect a requirement the PRD deleted at v24** | today |
| **3** | **Branko: is the Status filter multi-select?** (Q3 — one line) | Branko, via a question sheet | whether C29944 gains a *sourced* multi-status assertion or simply loses it | today |
| **4** | **Branko: was the §4.12 one-word change to "per-assigned technician" deliberate?** (Q1) | Branko | nothing — the case follows v27 correctly; closes a LOW-risk rider carried since 2026-08-10 | 2026-08-10 |
| **5** | **Branko: the PRD deleted the search fade/highlight at v24 but story SV-8686 still requires it** (Q2) | Branko | a PRD-vs-story mismatch Rule 57 requires be RAISED, not silently resolved | 2026-08-06 |
| **6** | **A second non-administrator sign-in** on this branch | QA lead / whoever provisions it | 13 held Schedule cases | **5 August** |
| **7** | **Which design artefact is canonical** — our undated prototype, or Sasha's undated share link | Branko / QA lead | ~48 pinned labels cannot be currency-checked at all | 2026-08-06 |
| **8** | **Build verification of the Schedule suite** — 0 of 176 verified against the running build | QA lead (sequencing) | every pass/fail verdict, on a branch now FINAL, release Thursday | 2026-08-11 |

**Nothing was created anywhere** (Rule 62 hold): no Jira ticket, no TestRail case, no question sheet sent.
Items 3, 4 and 5 are **one question sheet** when authorised — three lines, answerable in a sitting.

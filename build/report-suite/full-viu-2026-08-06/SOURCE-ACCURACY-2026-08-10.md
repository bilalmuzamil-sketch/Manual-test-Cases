# SOURCE ACCURACY — the three handed-off reports, 2026-08-10

**Scope: Work In Progress · Technician Utilization · Sales By Customer — 225 cases, all ours, no sampling.**
Re-derived from live TestRail and proven **set-equal in both directions** with the handover list
(SBC 87 · TU 60 · WIP 78). Counted by case id, never by line.

**This file answers one question per case: is the tester being sent to the right requirement?**

---

## 0 · The environment, stated up front

| | |
|---|---|
| **Build** | `v3.5-4795eee` · last-mod Fri 07 Aug 2026 13:10:42 GMT · etag `a80113cf3856c5fedf63be893e8b41c7` · sha256 `a4ea53ed…13e8f` |
| **Read at** | 17:03:49Z (start) — **byte-identical to the 16:37Z reading of the previous session, so the build has not moved** |
| **Signed-in session** | 🔴 **DEAD.** `GET /api/auth/me` on `sv8582api` → **HTTP 401 `{"error":"sso_required"}`**. `quick-login` and `switch-user` were **not** called. |

**So nothing was observed on the application this pass, and nothing here claims to have been.**
Priorities 1 and 2 are document-side and need no build; priority 3 (labels and steps) is limited to
what can be checked without one, and that limit is stated where it bites.

## 0.1 · The sources, verified live from Confluence `version.number` (never the in-body "Version")

| Report | Page | **Live version** | Last edited | Our cases cited |
|---|---|---:|---|---|
| Sales By Customer | 577634305 | **16** | 2026-08-07T03:43:06Z | v15 on 86 of 87 |
| Technician Utilization | 641400833 | **7** | 2026-08-07T03:43:12Z | v6 on 55 of 60 |
| Work In Progress | 703660034 | **10** | 2026-08-07T03:43:13Z | v9 on 71 of 78 |

Out of scope but read in the same call, for the record: SBR **18** · PV **6** · IV **5**.

---

## 1 · THE HEADLINE

**All figures below are the position FOUND at the start of the pass. §6 has the position now:
225 of 225 cite a verified-correct source.**

| Found at the start | Cases |
|---|---:|
| **Cited a spec version that is no longer live** (provenance line) | **212** |
| Cited the live version already | 13 |
| **Cited a requirement anchor that does not exist in the live spec** | **0** |
| **Cited an anchor whose text CHANGED under the version bump** | **2** (both WIP `S7-R13`) |
| **Cited an anchor that is now AMBIGUOUS in the live spec** | **1** (WIP `S9-R11` — see §3) |
| **`refs` naming a spec version that is no longer live** | **201** of the 206 that name one |
| **`refs` missing a Jira ticket** (Rule 20) | **0** |
| **`refs` missing a spec anchor** (Rule 20) | **0** |
| **`refs` asserting a spec edit is still owed, when Chris has already made it** | **4** |
| **Provenance carrying an unwarranted "the spec may differ" hedge** | **5** |
| Cases with raw HTML markup in tester-facing text | **0** |
| Cases with exactly one provenance line, one marker, marker last | **225 of 225** |

**The good news first, because it is the part that could have been much worse: not one of the 225
points at a requirement that does not exist.** Every anchor cited was located in the live
specification body. That was the specific risk the QA lead named, and on these three reports it is
clean.

**The bad news is the version pin.** 212 of 225 tell a tester the expectation comes from a version of
the document that is no longer the live one, and 201 `refs` do the same.

---

## 2 · Why the version re-stamp is safe to make mechanically — and the proof

A version bump is only nominal if the requirement text did not move. So before changing a single
digit I fetched **the previous version of each page as well** (`?status=historical&version=N`) and
diffed the two **definition by definition**, not by eyeball:

| Report | Anchor definitions | Added | Removed | **Text changed** |
|---|---:|---|---|---|
| SBC v15 → **16** | 236 → 236 | none | none | **none** |
| TU v6 → **7** | 121 → **122** | **`S7-R14`** (10,000-row export cap) | none | **none** |
| WIP v9 → **10** | 122 → 122 | none | none | **`S7-R13`**, and `S9-R11` re-used (§3) |

**Reproduce it:** `/tmp/rs4/reqx2.py` (definition extraction + diff), `/tmp/rs4/histfetch.py`
(historical fetch). What actually changed in prose, end to end, is 6 lines in SBC, 9 in TU and 11 in
WIP — all of them the Location-column rewording plus the change-log rows.

**One caution recorded honestly, because it nearly produced a false alarm of my own.** My first
extractor reported 8 SBC cases citing anchors that "do not exist" (`S8-R7`…`S8-R11`, `S14-R5`,
`S15-R5`, `S8-R14`). **They all exist.** The specification writes those particular ones as
`S8-R7 (asset label — primary):` and my pattern did not allow a parenthetical between the number and
the colon. **The anchors were fine; my tool was wrong.** It is recorded because the control is the
point, not the result — and because an unchecked version of that finding would have been reported as
eight broken citations.

### Does the anchor actually SUPPORT the case, not merely exist?

Existence is the weak test. Every case was additionally scored on how much of its cited requirement's
own vocabulary appears in the case body, and **every case scoring below the threshold was read by
hand against the requirement text**. After the extractor was fixed, **0 of 225 fell below it**. The
five cases citing a section rather than a numbered requirement (§7 tables, Story-level prerequisites)
were each located in the live body and quoted in §4.

---

## 3 · 🔴 A DEFECT IN THE LIVE SPECIFICATION: WIP v10 has two different requirements both numbered `S9-R11`

This is the single most important source finding of the pass, and it is not ours to fix.

**Live WIP v10 contains `S9-R11` twice, defining two unrelated requirements:**

| Where | Text |
|---|---|
| under **Edge Cases** | *"An export is capped at a maximum of 10,000 rows in the current filtered set. When the filtered set exceeds the cap, neither the PDF nor the CSV is produced and the user is shown the message: 'This report is too large to export. Narrow the date range or filters, then try again.'"* |
| under **Error handling** | *"On a successful download the user sees a success notification with the caption 'Data exported successfully.'"* |

In **v9** only the second existed. The 2026-08-06 edit added the cap requirement and **gave it a
number that was already in use**.

**Consequence for us:** `S9-R11` on its own is no longer a unique address. One case cites it —
**WIP-EXP-… [C30518](https://shopview.testrail.io/index.php?/cases/view/30518)** — and it means the
*Error handling* one. Its citation is disambiguated rather than left to a coin-toss.

**Owed by Chris Ward: renumber one of them.** Until he does, any reader following `S9-R11` can land
on the wrong requirement.

---

## 4 · The four `refs` that assert Chris still owes a spec edit — he has made all four

Each of these told a reader the specification had not caught up with a ruling. **Every one is now
false**, verified by reading the live body:

| Case | What the `refs` claimed | What the live spec now says |
|---|---|---|
| TU [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | *"the TU prerequisite still names the timesheet permission"* | TU v7 Story 1: *"The user must have the single reports permission — the one permission that grants access to all reports; there is no per-report permission."* |
| TU [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | *"the S9-N1 'still sees the filter' note is stale; spec edit pending"* | TU v7 `S9-N1`: *"A user with access to only one location does not see the filter; it is hidden."* |
| WIP [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | *"the WIP spec page still has no cap line; his spec edit is pending"* | WIP v10 `S9-R11` (Edge Cases) states the cap and the verbatim message |
| WIP [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) | *"the WIP prerequisite still names a Work In Progress reports permission"* | WIP v10 Story 1: the single reports permission, *"there is no per-report permission"* |

**These are the most damaging kind of stale source: they point a reader at a document while telling
them the document is wrong.** A reader who checked would have found the opposite.

---

## 5 · Five provenance lines hedge a difference that does not exist (Rule 56's honesty half)

Five cases carry the boilerplate *"where the wording of that specification differs, the behaviour
above follows Chris Ward's later decision … which is the authority."* **It names no difference.** It
is unfalsifiable as written, and Rule 56 is explicit that a divergence sentence where nothing
diverges *"manufactures a conflict that does not exist and is itself a defect"* — it teaches a tester
to distrust a settled expectation.

I read each case's cited anchors in the live body. **In all five the specification agrees with the
case outright:**

| Case | Anchors cited | The live requirement |
|---|---|---|
| SBC [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | S4-R5, S4-R6 | *"When the user selects one or more locations, the report includes only data from those locations"* / *"…'All locations,' the report includes data from every location the user has access to."* — exactly the case |
| SBC [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | S15-R7…R11, S15-R14, S4-R13 | every element of the PDF header is spelled out; nothing differs |
| SBC [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | S14-R16, S15-R25, S14-R14, S15-R22 | the 10,000-row cap is stated **twice** in the SBC spec itself |
| TU [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | S9-R1 | the Location filter, rightmost, multi-select, "All Locations" as select-all — verbatim |
| WIP [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | Story 9 | **v10 now states the cap outright as `S9-R11`**, so the hedge is doubly obsolete |

**Contrast — five divergence notes that are correct and stay.** C43553 (the logo fallback) and the
four WIP identifier cases ([C30470](https://shopview.testrail.io/index.php?/cases/view/30470) ·
[C30485](https://shopview.testrail.io/index.php?/cases/view/30485) ·
[C30500](https://shopview.testrail.io/index.php?/cases/view/30500) ·
[C30516](https://shopview.testrail.io/index.php?/cases/view/30516)) each **name the earlier source,
say what it said and say we follow the later word**. That is the shape Rule 56 asks for, and those
are left alone.

---

## 6 · WHAT WAS WRITTEN — and the proof it did no damage

**231 `update_case` over 220 distinct cases. Every one HTTP 200, 30 fields compared each,
0 mismatches, 0 collateral changes.** All three text fields sent on every payload.
**0 `add_case` · 0 `delete_case` · 0 section operations · 0 run writes · 0 results logged · nothing
created anywhere**, per the standing hold.

**The build-stamp sentence was deliberately NOT refreshed on any case.** Nothing was observed on the
application this pass, so a new "last checked against" date would be a claim we cannot support
(Rule 12). Every case still names the build it was genuinely last checked on. The write tool
*refuses* the write if that sentence moves.

**How the version re-stamp was proven safe, per case, before sending:** every span the substitution
matched was masked out of **both** the before and after text, and the masked remainders had to be
**byte-identical** — so nothing outside the version digits could move, and the checker fails closed.
Payload shape was asserted before sending: exactly one provenance line, exactly one marker, marker
last, no raw markup, no `refs` comma-entry over 248 characters.

### Post-write census of all 225 — every case, every check

| Check | Result |
|---|---|
| Provenance version equals the live Confluence version | **225 of 225** |
| Anchor cited that does not exist in the live spec | **0** |
| `refs` naming a stale spec version | **0** |
| `refs` missing a Jira ticket, or missing a spec anchor | **0** |
| Exactly one provenance line · one marker · marker last | **225 of 225** |
| Raw HTML markup in tester-facing text | **0** |
| Markers (unchanged by this pass) | READY **152** · READY - EXPECT FAIL **50** · HOLD **23** = 225 |

### Run 359 — Nebojsa's and Viktoria's — PROVEN UNTOUCHED BY CONTENT

`include_all` still false · **476 tests** · **535 results** · case_id **and** test_id sets equal in
**both** directions · **all 535 prior results present BY ID** · **0 graded-field changes** ·
**0 new results**.

The **only** field that moved on any result is **`case_refs`, on 273 records across 194 cases — and
every one of those 194 is in our write set, with none outside it.** That is the declared read-time
echo of the case's own `refs`, the same class as the declared `case_title` echo, and it moved because
we edited `refs`. No graded field moved on any of the 535.

**Also proven byte-identical, including `updated_on`/`updated_by`:** the **5 in-scope cases we did not
write** (C30467, C38912, C38915, C38916, C43551 — already current), **all 12 foreign cases** under
group 4281, and **all 251 of our out-of-scope cases** on the other three reports.

⚠️ **Foreign cases have grown from 5 to 12.** Vladimir Tomovic has added seven — C43567…C43573 —
one of which, **C43572**, sits in Work In Progress scope. **Untouched (Rule 38), and flagged as a
reverse-coverage signal for a later pass rather than acted on.**

## 7 · Priority 2 — expected behaviour comes from a document, not the build

Swept all 225 for the tells of a build-sourced expectation: the *"known and accepted / on purpose for
now / do not raise this"* waiver wording, a provenance line opening *"as per the build tested on"*,
and *"the specification is silent"*. **Zero hits on all three.** The 2026-08-05 project-wide
correction holds on these three reports and nothing has regressed into them.

**Three cases that DID rest on a non-specification source now rest on the specification**, because
Chris wrote the requirement in — TU [C38887](https://shopview.testrail.io/index.php?/cases/view/38887)
(was the engineering tech plan → now `S7-R14`), WIP
[C38918](https://shopview.testrail.io/index.php?/cases/view/38918) (was a PO answer file → now
`S9-R11`), and WIP [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) (was *"neither
reading is asserted"* → now `S7-R13`). Each says so in its own words, with the date.

## 8 · Priority 3 — steps and labels

**Raw HTML markup: 0 of 225**, verified across preconditions, steps and expected results. Nothing was
re-observed on the application, because **the signed-in session is dead** — so no on-screen label,
navigation path or test-data name was re-checked against the running build this pass. **That limit is
real and is not being papered over:** priority 3 is the one of the three that a dead session genuinely
blocks, and it is unfinished.

## 9 · Per-case table

The full 225-row table is **`SOURCE-ACCURACY-TABLE-2026-08-10.csv`** beside this file: per case —
report · C-id · TestRail link · title · the source it cited before · the source it cites now · the
`refs` version before and after · the requirements it now cites · whether the anchor was
quote-verified against the live body · whether it changed this pass · and any note.

Per-operation log: **`oplog-source-accuracy-2026-08-10.json`** (231 rows, one per write).

---

## 7 · OUTSTANDING — what I need from you

*(carried into the body of the final report; kept here so this file stands alone)*

1. **Chris Ward: renumber the duplicate `S9-R11` in Work In Progress v10.** Until then one
   requirement number addresses two different requirements.
2. **A fresh `sv_sso_session` for `.qa.shopview.com`.** Nothing can be observed on the build without
   it, so priority 3 (steps and labels) is only partly checkable.
3. **A second, non-administrator sign-in** — outstanding since 5 August; still gates 3 held cases and
   about 20 observations.

# Rule 42 — the closed enumerations, and the "30 cases with two contradicting source documents"

**The question I was asked to settle:** an earlier pass reported that *"30 Rule-42 cases have two
source documents contradicting each other"* and never detailed it. This document establishes what
that claim actually was, whether it holds, and — separately — which closed enumerations really do
have contradicting governing sources.

**Short answer, up front.**

1. **The claim conflated two different things.** The "30 cases" was a **keyword list**. The "two
   source documents contradicting each other" was **two INTERNAL QA DOCUMENTS of the same
   2026-08-03 VIU pass disagreeing about whether those cases are Rule-42 compliant** — *not* two
   product sources disagreeing about the product. Both documents are quoted verbatim in §1.
2. **Neither document's position survives an exhaustive check, and I can say why.** The batch
   document's list was built by keyword and **15 of its 27 entries are not enumerations at all**;
   it also only ever looked at **two of the six reports**. The change ledger's *"Rule 42 compliance
   is good … No reference change is needed anywhere"* was based on a **7-case sample** — its
   conclusion turns out to be right, but it was not entitled to say so.
3. **The definitive number is 30** — coincidentally the same figure, and **a different 30**. Only
   **12** cases appear on both lists. **30/30 are version-pinned. 28/30 carry a closing anchor.**
   So there is **no Rule-42 remediation backlog**; there are **2 documented exceptions**.
4. **There ARE genuine source-vs-source contradictions on closed-enumeration cases: 5 of the 30.**
   Three are the `Sales Rep` → `Sales Representative` rename; two are the permission model. **In all
   five the case follows the newer authoritative source and the SPEC TEXT is what is stale** — so
   per Rule 33 our text is correct and a **PO spec edit** is owed.

---

## 1. WHAT THE CLAIM WAS — both documents, verbatim

### Document A — `viu-2026-08-03/batch-sbc-sbr/STAGED-CHANGES.md`

**§3 "Brittle closed enumerations to rewrite (Rule 42)":**

> *"27 cases close a list with wording like "exactly". Each needs either a version-pinned anchor in
> `refs` (`<TICKET> (<anchor>, spec v<N> <date>)`) or scope-conditional wording. This is exactly the
> shape of the defect that made `SBR-EXP-10`/`SBR-EXP-11` wrong when the Location column arrived."*

**§2 "Missing spec anchors (Rule 20 …)"** listed 3 more cases and concluded:

> *"All three are genuinely cross-cutting display rules with no single owning story, so the honest
> fix is to cite the owning section explicitly in anchor form rather than invent a requirement
> number — **that needs the QA lead's call on the convention**."*

**27 + 3 = the "30 cases".**

### Document B — `viu-2026-08-03/CHANGE-LEDGER.md`, the same pass, line 65 and line 66

> *"**Rule 42 compliance is good**: the closed "exactly this list" enumerations **I checked**
> (SBC-EXP-03, SBC-DATE-01, SBR-EXP-10/11, SBR-COL-01, TU-COL-01, WIP-COL-01) are all
> **scope-conditional or version-pinned with the anchor that closes them** — which is why the
> deviations below are legible instead of ambiguous."*

> *"**475 / 475 carry a Jira ticket. 474 / 475 carry a spec anchor.** … **No reference change is
> needed anywhere.**"*

### The disagreement, stated plainly

| | Document A (batch) | Document B (change ledger) |
|---|---|---|
| Verdict | **30 cases need remediation** | **compliance is good; no reference change needed anywhere** |
| Basis | a **keyword sweep** for "exactly", over **SBC and SBR only** | a **7-case sample**, named in the text |
| Who owns the decision | *"needs the QA lead's call"* | closed it itself |

The `viu-push-2026-08-04/MANIFEST.md` §3i noticed the conflict and declined to act — *"Two documents
from one pass disagree on whether these 30 are compliant"* — which is why it reached you undetailed.

**This is not a product-source conflict.** No spec, PO answer, video or tech plan is involved. It is
a QA-internal disagreement caused, in both directions, by **not looking at the whole population** —
the exact failure Rule 50 exists to prevent.

---

## 2. THE ADJUDICATION — exhaustive, all 478 cases

`tools/rule42_sweep.py` reads the title, preconditions, steps and expected result of **all 478**
cases and separates a **genuine closing construct** from an **adverbial** use of the keyword.

| | Count |
|---|---|
| Cases containing a Rule-42 keyword | **76** |
| …of which contain a **GENUINE closed enumeration** | **30** |
| …**adverbial keyword only** (a precise quantity or an equality) | **46** |
| Of the 30: `refs` carries a **VERSION PIN** | **30 / 30** |
| Of the 30: `refs` carries a **CLOSING `Sn-Rn` ANCHOR** | **28 / 30** |
| Of the 30: written **SCOPE-CONDITIONALLY** | 7 |

**What counts as a closed enumeration** (documented in the tool, refined after reading all 137
keyword contexts by hand): an explicit closing phrase over a **set** (*"in this exact order"*, *"in
order are"*, *"exactly these"*, *"only these"*, *"no other"*, *"nothing else"*); **"exactly N"**
followed by a **UI-set noun** (items / options / columns / toggles / actions / headers / toasts); or
*"reads / are / named exactly"* followed by a **quoted verbatim string** — a pinned label is as
brittle as a list.

**What does not count**, with the actual phrases from our cases: *"access to **exactly one
location**"* · *"an asset with **exactly one invoice**"* · *"select **exactly two customers**"* ·
*"invoices dated **exactly ON** the start date"* · *"Units Sold reads **exactly 2.50**"* · *"On Hand
has gone down by **exactly 2.50**"* · *"invoice subtotals **sum exactly to** that asset's row
total"* · *"filters, sort and columns restored **exactly as set**"* · *"(**Exactly where** and how it
appears is confirmed in the build.)"*. Pinning a spec version into the `refs` of those adds noise,
not traceability — **which is precisely Document A's error.**

### 2a. THE DEFINITIVE 30

| # | Report | Case | Version-pinned | Closing anchor | Scope-conditional | On Document A's list? |
|---|---|---|---|---|---|---|
| 1 | PV | PV-API-04 = [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) | YES | YES | no | **no** |
| 2 | PV | PV-CALC-07 = [C30365](https://shopview.testrail.io/index.php?/cases/view/30365) | YES | YES | no | **no** |
| 3 | PV | PV-COL-02 = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | YES | YES | **yes** | **no** |
| 4 | PV | PV-EXP-01 = [C30375](https://shopview.testrail.io/index.php?/cases/view/30375) | YES | YES | no | **no** |
| 5 | PV | PV-EXP-10 = [C30384](https://shopview.testrail.io/index.php?/cases/view/30384) | YES | YES | no | **no** |
| 6 | PV | PV-FILT-01 = [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | YES | YES | no | **no** |
| 7 | PV | PV-FILT-03 = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330) | YES | YES | no | **no** |
| 8 | PV | PV-FILT-11 = [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | YES | YES | no | **no** |
| 9 | PV | PV-PERM-03 = [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) | YES | YES | no | **no** |
| 10 | PV | PV-ROW-06 = [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | YES | YES | no | **no** |
| 11 | SBC | SBC-COL-01 = [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | YES | YES | no | **no** |
| 12 | SBC | SBC-EXP-01 = [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | YES | YES | no | **no** |
| 13 | SBC | SBC-EXP-03 = [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | YES | YES | **yes** | **no** |
| 14 | SBC | SBC-EXP-16 = [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | YES | YES | **yes** | yes |
| 15 | SBC | SBC-TYPE-02 = [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | YES | YES | no | yes |
| 16 | SBR | SBR-ASGN-02 = [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) | YES | YES | **yes** | yes |
| 17 | SBR | SBR-CALC-06 = [C30234](https://shopview.testrail.io/index.php?/cases/view/30234) | YES | YES | no | yes |
| 18 | SBR | SBR-EXP-01 = [C30276](https://shopview.testrail.io/index.php?/cases/view/30276) | YES | YES | no | yes |
| 19 | SBR | SBR-EXP-06 = [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) | YES | YES | no | yes |
| 20 | SBR | SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | YES | YES | **yes** | yes |
| 21 | SBR | SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | YES | YES | **yes** | yes |
| 22 | SBR | SBR-EXP-15 = [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) | YES | YES | no | yes |
| 23 | SBR | SBR-STAT-01 = [C30208](https://shopview.testrail.io/index.php?/cases/view/30208) | YES | YES | no | yes |
| 24 | SBR | SBR-TOT-03 = [C30239](https://shopview.testrail.io/index.php?/cases/view/30239) | YES | YES | no | yes |
| 25 | SBR | SBR-TYPE-02 = [C30206](https://shopview.testrail.io/index.php?/cases/view/30206) | YES | YES | no | yes |
| 26 | TU | TU-ELL-02 = [C30405](https://shopview.testrail.io/index.php?/cases/view/30405) | YES | YES | **yes** | **no** |
| 27 | TU | TU-EXP-08 = [C30441](https://shopview.testrail.io/index.php?/cases/view/30441) | YES | **NO** | no | **no** |
| 28 | TU | TU-NAV-08 = [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | YES | YES | no | **no** |
| 29 | WIP | WIP-EXP-10 = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | YES | **NO** | no | **no** |
| 30 | WIP | WIP-TAB-01 = [C30451](https://shopview.testrail.io/index.php?/cases/view/30451) | YES | YES | no | **no** |

**Only 12 of the 30 are on Document A's list.** Document A missed **18**, of which **15 are outside
SBC/SBR entirely** (PV ×10, TU ×3, WIP ×2) — because it was the **SBC/SBR batch** and the other four
reports were never swept for Rule 42 by anyone. The remaining 3 misses are inside SBC and were
missed because they use *"in order:"* and *"in this exact order"* rather than the keyword "exactly"
(SBC-COL-01, SBC-EXP-01, SBC-EXP-03).

### 2b. The 15 entries on Document A's list that are NOT enumerations

Each with the phrase that triggered it. None needs a version pin.

| Case | The phrase that matched | What it actually is |
|---|---|---|
| SBC-CALC-05 = [C30153](https://shopview.testrail.io/index.php?/cases/view/30153) | *"invoice subtotals **sum exactly to** that asset's row total"* | an arithmetic equality |
| SBC-CUST-05 = [C30116](https://shopview.testrail.io/index.php?/cases/view/30116) | *"Select **exactly one customer**; read the collapsed label"* | a seeding step |
| SBC-TREE-01 = [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | *"The customer occupies **exactly one summary row**"* | a uniqueness invariant |
| SBC-TREE-10 = [C30130](https://shopview.testrail.io/index.php?/cases/view/30130) | *"an asset with **exactly one invoice**"* | a seeding precondition |
| SBC-TREE-12 = [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | *"totals drop by **exactly that invoice's amounts**"* | an arithmetic equality |
| SBC-LINK-02 = [C30139](https://shopview.testrail.io/index.php?/cases/view/30139) | *"filters, sort, and columns restored **exactly as set**"* | a state-equality assertion |
| SBC-EXP-05 = [C30163](https://shopview.testrail.io/index.php?/cases/view/30163) | *"exports contain **exactly the customers** matching the active filters"* | a set-equality assertion against a filter, not a fixed list |
| SBC-LOC-03 = [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | *"(**Exactly where** and how it appears is confirmed in the build.)"* | the **opposite** of a closed list — a deliberate non-closure |
| SBC-LOC-04 = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | *"(**Exactly where** the column sits inside each file is confirmed in the build.)"* | same — deliberate non-closure |
| SBR-LOC-03 = [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | *"(**Exactly where** and how it appears is confirmed in the build.)"* | same |
| SBR-ROW-01 = [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | *"Rep A occupies **exactly one summary row**"* | a uniqueness invariant |
| SBR-ROW-02 = [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | *"Every row renders **exactly the report's column count**"* | a count-equality assertion |
| SBR-TREE-07 = [C30223](https://shopview.testrail.io/index.php?/cases/view/30223) | *"Every invoice appears under **exactly one rep**"* | a uniqueness invariant |
| SBR-LINK-03 = [C30249](https://shopview.testrail.io/index.php?/cases/view/30249) | *"scroll position — **exactly as they were**"* | a state-equality assertion |
| SBR-ASGN-03 = [C30294](https://shopview.testrail.io/index.php?/cases/view/30294) | *"produces **exactly ONE row** (single-rep model)"* | a cardinality invariant |

Three of them (**SBC-LOC-03, SBC-LOC-04, SBR-LOC-03**) are the strongest evidence that Document A's
list was mechanical: those cases deliberately **refuse** to close the list, saying the exact position
is *"confirmed in the build"* — they are model Rule-42 practice and were flagged as violations of it.

### 2c. The 2 cases without a closing `Sn-Rn` anchor — both documented, neither a defect

| Case | Verbatim `refs` | Verdict |
|---|---|---|
| **TU-EXP-08** = [C30441](https://shopview.testrail.io/index.php?/cases/view/30441) | *"SV-8654 (TU spec v5 2026-07-29 Story 7 Error Handling + §7 notifications table — **these CLOSE both strings verbatim** ("Download started" / "Failed to download report"); **Story 7 has no S-anchor for them so §7 is the closing** reference)"* | **acceptable as written.** The spec genuinely gives the two toast strings no `Sn-Rn` id; the case says so and pins the version. This is the case Document A's §2 said *"needs the QA lead's call on the convention"* — **it is the only one of the three §2 cases that also closes an enumeration.** |
| **WIP-EXP-10** = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | *"SV-8665 (WIP spec Story 9 — the 10,000-row export cap applies to ALL SIX reports per Chris Ward answer 2026-07-31 Q3=A; **the WIP spec page still has no cap line; his spec edit is pending**)"* | **acceptable as written, and it is itself an outstanding-item marker.** There is no anchor to cite because the requirement is a PO ruling the spec has not absorbed. |

### 2d. How the 30 were verified — and the part that is mechanical

`tools/enum_diff.py` extracts each case's enumerated item list and the list from the **same
enumeration in the governing spec requirement**, then diffs both directions.

| Outcome | Cases | Meaning |
|---|---|---|
| **MATCH** | 6 | machine-paired with a spec list and identical |
| **SPEC-HAS-MORE** | **3** | a real difference — §3 below |
| LOW-CONFIDENCE-PAIRING | 1 | SBR-CALC-06: the spec expresses the list as *"seven metric columns"* rather than naming them; the case names all seven. Read by hand — **correct** |
| NO-SPEC-LIST-TO-COMPARE | 2 | SBC-EXP-01 / SBC-EXP-16: the four download labels are enumerated across `S14-R2` + `S15-R2`, not in one list. Read by hand — **correct** |
| NO-EXTRACTABLE-LIST | 18 | verbatim single strings and short label sets my extractor cannot parse into a list. **All 18 read by hand — all correct** |

**Honest statement:** 9 of the 30 were machine-diffed against a spec list; **21 were read by hand.**
None was assumed.

---

## 3. THE GENUINE SOURCE-VS-SOURCE CONTRADICTIONS — 5 of the 30

These are the closed-enumeration cases whose **governing source documents genuinely disagree**.
Rule 33 precedence: PO ruling → QA-lead ruling → our live-verified findings → a reviewer's claim.
Rule 32: the most recent authoritative product source wins.

### 3a. The `Sales Rep` → `Sales Representative` rename — 3 cases

**Source 1 — the SPEC.** SBR, Confluence pageId **585629698**, version **v15**, last updated
**2026-07-29**. `S14-R15` (Summary CSV), `S14-R16` (Expanded CSV) and `S15-R4` (Assignments CSV) all
still enumerate the first header as:

> **`Sales Rep`**

**Source 2 — the PO's ANSWER.** **Chris Ward, Q5, 2026-07-31**: the full word **"Sales
Representative"** replaces the short **"Sales Rep"** everywhere.

**Which is newer:** the PO answer (**2026-07-31**) postdates the spec version (**2026-07-29**).

**What our cases say — and they are RIGHT.** SBR-EXP-10 =
[C30285](https://shopview.testrail.io/index.php?/cases/view/30285) item 2:

> *"With a single location in scope the headers, in order, are exactly: **Sales Representative**,
> # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts
> Invoiced, Parts Margin, Margin, Margin %, Subtotal."*

…and item 6 gives the tester the plain instruction that makes this safe:

> *"Note for the tester: the product owner has ruled that the full word "Sales Representative"
> replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this
> test Failed and report it as the pending rename — **do not change the test**."*

| Case | Anchor | Spec (v15, 2026-07-29) | Case (Chris Q5, 2026-07-31) | Follows the correct source? |
|---|---|---|---|---|
| SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | `S14-R15` | `Sales Rep` | `Sales Representative` | **YES** |
| SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | `S14-R16` | `Sales Rep` | `Sales Representative` | **YES** |
| SBR-ASGN-02 = [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) | `S15-R4` | `Sales Rep` | `Sales Representative` | **YES** |

**Owed: Chris Ward's spec edit.** No case change.

**And the good news on the same three cases:** the 2026-07-31 defect is **fixed**. Both SBR-EXP-10
and SBR-EXP-11 are now **scope-conditional** — item 2 is qualified *"With a single location in
scope"* and item 7 adds *"When more than one location is in scope the file also carries a Location
column"*. That is Rule 42 applied correctly to the requirement that broke it.

### 3b. The permission model — 2 cases

**Source 1 — the SPEC.** PV, pageId **620888066**, version **v4**, **2026-07-29**, `S1-R4`:

> *"Both loading the report and exporting it require the **Inventory Reports → View** permission. A
> user without that permission is denied the report data and the export."*

…and `S1-N2` repeats it.

**Source 2 — the PO's ANSWER + the QA lead's ruling.** **Chris Ward Q2 = A** and the **QA lead,
2026-08-03: "ONE permission FOR NOW"** — one ordinary reports access opens all six reports, and no
report has a permission of its own.

**Which is newer:** the QA-lead ruling (**2026-08-03**), then Chris's answer, then the spec.

**What our cases say — and they are RIGHT.** PV-PERM-03 =
[C30327](https://shopview.testrail.io/index.php?/cases/view/30327):

> *"…for now ONE ordinary reports access opens all six of these new reports, and no report has a
> permission of its own. If an extra Parts or Inventory reports permission does exist and switching
> it OFF blocks this report or its export, that is wrong — mark this Failed and report it."*

| Case | Anchor | Spec (v4) | Case (Chris Q2=A + QA lead 2026-08-03) | Follows the correct source? |
|---|---|---|---|---|
| PV-PERM-03 = [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) | `S1-R4`, `S1-N2` | Inventory Reports → View | ordinary reports access | **YES** |
| PV-API-04 = [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) | `S1-R4` | Inventory Reports → View | ordinary reports access; *"nothing else had to be enabled"* | **YES** |

**Owed: Chris Ward's spec edit** — the same edit already applied to SBC in v13, which is why SBC
`S1-R2` now reads *"gated by ordinary reports access, not by a report-specific permission"*. **PV is
the report the correction has not reached.** Note that PV-PERM-03's own closed assertion (*"no other
reports-related permission turned on"*) is what makes it a Rule-42 case at all.

### 3c. The other 25 of the 30 — one governing source, or sources that agree

**No conflict.** Each cites a version-pinned spec anchor and, where a PO answer or the live build is
also cited, the two **agree** (Rule 32 corollary (i): duplication raises confidence). Full `refs`
per case in `data/rule42-rows.json`.

---

## 4. THE FOUR CONTRADICTION GROUPS ACROSS THE WHOLE SUITE

The 5 above are the Rule-42 subset. The complete set of case-vs-spec contradictions found by this
pass is **12 assertion rows over 11 requirements**, in four groups — see `COVERAGE-EXHAUSTIVE.md`.
Groups **A** (Location filter visibility), **C** (Location column toggle-vs-automatic) and **D**
(asset identifier) are not Rule-42 cases because those cases do not close a list; they are
contradictions all the same, and **in all 12 rows the case follows the newer source**.

**In no case does our text follow the older source.** That is the answer to *"per case whether our
text follows the correct (newest authoritative) source"*: **12 / 12 correct.**

---

## 5. WHAT I RECOMMEND, AND WHAT I DID NOT DO

**Nothing was changed.** No case was edited; no TestRail write of any kind.

| Recommendation | Cases | Authorization needed |
|---|---|---|
| **No Rule-42 remediation.** Document A's 30-case backlog does not exist. Close the thread. | — | your ruling to close it |
| **Accept the 2 anchorless cases as written** (TU-EXP-08, WIP-EXP-10) — both state their reason and pin the version. Document A's §2 asked for your call on the convention; my recommendation is that citing `§7` / `Story 9` **in prose with the reason stated** is the right convention when no `Sn-Rn` id exists. | 2 | your ruling on the convention |
| **Version-pin backfill on the 358 cases that cite `specs/<file>.md` with no version** — this, not the enumeration wording, is the real Rule-42 exposure | 358 | your go-ahead |
| **PO spec edits for the 5 contradictions** (3 rename + 2 permission) | 5 | Chris Ward |

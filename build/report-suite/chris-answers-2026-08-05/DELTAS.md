# DELTAS — what Chris Ward's answers change, requirement by requirement

**Report Suite (epic SV-8582) · his answers of 2026-08-05 · NOTHING PUSHED TO TESTRAIL**

Read `ANSWERS-INGESTED.md` first — it holds his answers verbatim and the source-currency
block. This file does the work: **one verdict row per answer**, a **surface matrix** wherever
an answer lands on more than one surface, and — for every "already covered" verdict — **his
words and the case's words quoted side by side**, because a coverage claim nobody can check
is not a coverage claim (Standing Rule 45(e)).

**No TestRail write has been made.** Every change described here is staged in
`testrail-sync-manifest.md` and waits on the QA lead's go-ahead (Standing Rule 6).

**No live build observation was made in this pass.** Where a verdict needs the build to
settle it, that is said (Rules 12, 22, 49).

---

## THE HEADLINE, IN PLAIN WORDS

| | Count |
|---|---|
| Items we asked | 24 |
| He answered | **15** |
| He left blank | **9** (all of them are "please correct your written description" items) |
| Tests that were frozen waiting for him | **47** — counted live today, reconciles exactly |
| **Frozen tests his answers RELEASE** | **39** |
| **Frozen tests that STAY frozen** | **8** |
| Tests **not** frozen that his answers nonetheless make **wrong** | **7** |
| **Tests needing a wording change in total** | **31** |
| Tests released with **no wording change at all** | **15** |

**The single most important sentence in this document:** on the location column he did not
pick either option we offered. He wrote his own third rule, and that rule contradicts **ten**
of our tests that nobody had flagged — including **seven that are not on the frozen list and
would have been automated as they stand**. Details in section 3 and section 6.

### How the 47 was reconciled (Standing Rule 50 — exhaustive, no sampling)

Read live from TestRail today, read-only:

- **474** cases under group 4281 "Reports Suite"
- **minus 5** cases authored by Vladimir Tomovic (C38919–C38923) — hands off, excluded from
  our counts (Standing Rule 38)
- **= 469 ours**, of which **exactly 47** carry the "DO NOT AUTOMATE YET" line
- **39 + 8 = 47.** The split below adds up in both directions.

---

## 1 · THE VERDICT ROWS — every one of the 24 items

Every item gets a row. An item with no verdict would be a hole, which is the whole point
(Standing Rule 43).

| # | What it was about | His answer | Verdict | Cases |
|---|---|---|---|---|
| **T1-1** | Should the location column appear on its own, or does the user switch it on? | **C — his own third rule** | **REWRITE 10 cases** (8 frozen + 2 also frozen under other items) **and 5 more that were never frozen** | see §3 |
| **T2-1** | Is the location chooser shown to someone with only one location? | **B — hide it** | **RELEASE 6, no wording change** — our tests already say hidden. A developer ticket is needed. | §4.1 |
| **T2-2** | On Work In Progress, does the unit number or the vehicle number lead? | **B — keep the product, unit number leads** | **REWRITE 4** (they currently say vehicle-number-first) + **release 1 unchanged** | §5.1 |
| **T2-3** | The downloads say "Representative" — a third spelling | **A — "Representative" is fine** | **REWRITE 2** | §5.2 |
| **T2-4** | Four columns missing from the Sales By Representative summary download | **A — add them back** ("on-screen should match download") | **Keep the 13-column list; add an expect-red note.** Lands on the same line as T2-3. | §5.2 |
| **T2-5** | The date chooser offers nine choices and has no "Custom" | **A — keep the product** | **REWRITE 5 + 1 title + 1 never-frozen case** | §5.3 |
| **T2-6** | The Technician Utilization download menu wording | **B — use the longer wording, "consistency is key"** | **REWRITE 1**, release 1 unchanged, **1 coverage gap opened** | §5.4 |
| **T2-7** | The Inventory Value spreadsheet carries an "As of" line | **A — it belongs there** | **RELEASE 1, no wording change** | §4.2 |
| **T2-8** | Four descriptions still say each report needs its own permission | **A — I will update them** | **No case change.** Documentation debt only; all 8 cases already follow the ruling. | §4.3 |
| **T2-9** | Print has gone from the product | *"Love this flag. Intentionally dropped :). Great call-out!"* | **No case change.** Confirms our tests. Two asks in the item went unaddressed. | §4.4 |
| **T3-1** | Do the downloads carry the location column whenever it is on screen? | **A — yes** | **RELEASE 3, no wording change** (2 more covered under T2-3/T3-3) | §4.5 |
| **T3-2** | Will the descriptions be updated to match your answers? | **A — yes, keep testing to my answers** | **No case change — but this is the keystone.** It is his written licence for every provenance line in this pass. | §2 |
| **T3-3** | Where does the location column sit in the shorter Summary downloads? | **A — at the left, after the name** | **REWRITE 4 hedges into a definite position** | §5.5 |
| **T3-4** | Which logo rule should every report follow? | **C — his own rule, spelled out** | **REWRITE 3 + 1 never-frozen case**, release 1 unchanged, **1 coverage gap opened** | §5.6 |
| **T3-5** | Which Sales By Customer features were dropped? | **A — the five we found, nothing else** | **No case impact.** Item closes. | §4.6 |
| **T3-6** | Technician Utilization sits BELOW the existing menu links | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |
| **T3-7** | Sales By Customer: the menu group and which links it sits below | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |
| **T3-8** | The asset chooser on Work In Progress: normal ShopView style, with a select-all | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |
| **T3-9** | "Representative" written out in full, everywhere | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |
| **T3-10** | Parts Velocity is described as the "only" report in the Parts group | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |
| **T3-11** | The Escape key on the "deactivate a representative" pop-up | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |
| **T3-12** | The "too big to download" limit is missing from three descriptions | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |
| **T3-13** | A note that "VIN" also covers machines that are not vehicles | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |
| **T3-14** | Some odd characters appear in two of the descriptions | *(left blank)* | **BLOCKED — no answer.** See `OUTSTANDING.md`. | §7 |

---

## 2 · THE KEYSTONE ANSWER — why every provenance line may cite his file

Standing Rule 54 requires each case to say what its expectation rests on, and Standing Rule 32
says the newest authoritative product source wins. Both need his permission to treat the
written descriptions as out of date. **He gave it in writing.**

We asked (item T3-2):

> Will the descriptions be updated to match your answers, or should we simply keep testing to
> your answers and treat the written text as out of date?
>
> A) The descriptions will be updated - we keep testing to your answers meanwhile.
> B) Do not wait for the descriptions - your answers are the final word and the written text can stay as it is.

He answered **A**.

So: **his answers are the authority now, the descriptions will catch up later, and in the
meantime the tests follow his answers.** That is exactly the state the provenance lines must
describe — which is why each staged case below cites **his file**, and why none of them may
claim plain agreement with a specification that still says something different.

And this is confirmed independently: **all six descriptions were read live today and not one
has moved** (Sales By Customer 13 · Sales By Representative 15 · Parts Velocity 4 ·
Technician Utilization 5 · Work In Progress 6 · Inventory Value 3). His own words to the QA
lead — *"just haven't done any of the updates you separated"* — are verified true.

---

## 3 · THE BIG ONE — the location column (item T1-1)

### 3.1 · What he actually wrote

We offered him **A** (automatic, not user-switchable) or **B** (a switch the user controls).
**He chose C and wrote his own rule:**

```
C) -- by default, the
column will exist in all
reports being built as
follows (requirements):

1) user has access to
multiple locations;
2) user has selected
multiple locations;
---------
The location column
selector should still be toggleable
from the column selector
list for the user, if the above
is satisfied (note - the column
selector for locations
should not appear if the user
doesn't satisfy #1 above.
```

### 3.2 · What that rule says, broken into testable parts

This is our reading, stated openly so he can correct it:

| | The requirement | Plain words |
|---|---|---|
| **C1** | The Location column is present **by default** when **both** (1) the user has ACCESS to more than one location **and** (2) the user has SELECTED more than one location | switched on for you, without you doing anything |
| **C2** | The Location column **is** switchable from the column-selector list — when the conditions above are satisfied | you can still turn it off if you want |
| **C3** | The Location entry **must not appear in the column-selector list at all** if the user does not have ACCESS to more than one location | someone with one branch never sees the option |

**This is neither of the options we offered.** It is a hybrid: *automatic by default* **and**
*user-switchable*, with the switch itself hidden from single-location people.

**He also introduces a distinction no test of ours currently makes:** *access to* more than
one location versus *having selected* more than one. Those are two different things and his
rule turns on both.

### 3.3 · What his rule leaves genuinely unclear — we are NOT guessing (Standing Rule 12)

| | The gap | Why it matters |
|---|---|---|
| **U1** | A person **with access to several branches** who has **selected only one** — is the Location entry still offered in the list so they can switch it on by hand? | C2 says switchable *"if the above is satisfied"*, which reads as **both** conditions, so no. C3 only removes the entry when **access** is single, which reads as yes. **The two sentences point opposite ways for this exact person**, and it is a real, common case. |
| **U2** | If someone switches it off by hand, does that stick next time they open the report? | We have persistence tests. His rule says nothing about memory. |
| **U3** | Do the downloads follow the column, or the location scope? | Not stated here — but his T2-4 remark *"on-screen should match download"* and his T3-1 answer **A** together settle it: **the downloads follow the screen.** That is a derivation from two other answers, and it is labelled as one below, not presented as something he said here. |

**None of U1–U3 is resolved in the staged wording.** Where a staged case would have to take a
side, it states the rule he did give and marks the rest for his confirmation.

### 3.4 · SURFACE MATRIX (Standing Rule 40)

His rule is about a column, and a column shows up on many surfaces. One verdict per surface —
"not applicable" is allowed, silence is not.

| Surface | Verdict | Cases |
|---|---|---|
| **On screen (the grid)** | **REWRITE** — the default-on-when-multi-selected half is missing or contradicted on every report | **SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912), **SBR-LOC-05** = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913), **PV-FILT-14** = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914), **TU-LOC-06** = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915), **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466), **WIP-COL-02** = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467), **WIP-FLT-09** = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916), **IV-COL-01** = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551), **IV-COL-04** = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554), **IV-LOC-06** = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) |
| **The column-selector panel** | **REWRITE** — this is where the contradiction bites. Four reports say Location is *not* offered there; his C2/C3 say it **is** offered (conditionally) | **SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912), **PV-FILT-14** = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914), **TU-LOC-06** = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915), **TU-HRS-02** = [C30401](https://shopview.testrail.io/index.php?/cases/view/30401), **TU-EXP-04** = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) |
| **CSV download** | **REWRITE** — follows the screen, per his T2-4 + T3-1 (a derivation, see U3) | **IV-EXP-02** = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588), **WIP-EXP-02** = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511), **TU-EXP-04** = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) |
| **PDF download** | **REWRITE** — same derivation | **IV-EXP-02** = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588), **WIP-EXP-02** = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511), **TU-EXP-04** = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) |
| **Print** | **NOT APPLICABLE** — Print is retired from the product, and he confirmed that in item T2-9 | — |
| **API / response payload** | **NO CHANGE NEEDED** — no API case of ours asserts the column's visibility model; the payload carries location data regardless | — |
| **Mobile / responsive** | **NOT APPLICABLE** — no mobile case asserts the location column | — |
| **Column ORDER (a separate assertion)** | **NO CHANGE** — his rule changes *whether* the column shows, never *where*. The order assertions stand. | **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466), **IV-PERS-02** = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) |
| **Persistence / memory** | **BLOCKED on U2** — our two persistence cases restore "column selection" generically, which stays true either way; but if Location is now switchable, whether *its* state persists is unanswered | **WIP-PERS-03** = [C30508](https://shopview.testrail.io/index.php?/cases/view/30508), **IV-PERS-03** = [C30581](https://shopview.testrail.io/index.php?/cases/view/30581) |
| **Location FILTER (the chooser)** | **SEPARATE ITEM** — answered under T2-1, see §4.1. Do not conflate: the *column* and the *chooser* are different controls. | §4.1 |
| **Empty / single-location state** | **REWRITE** — the "one location = no column" half is right on four reports and wrong on Inventory Value | **IV-LOC-06** = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917), **IV-COL-04** = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) |

### 3.5 · Case by case, with the offending text quoted


****SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912)** — The Location column shows only with more than one location; Multiple on totals  
*Frozen today:* yes  
*What it says now (says the column is NOT offered in the selector):*

> 5. Location is NOT offered in the column selector — it appears and disappears on its own, following the location scope.

*Verdict:* **REWRITE** — C2 says it IS offered (conditionally), and C3 adds the never-offered-to-single-access rule

****SBR-LOC-05** = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913)** — The Location column shows only with more than one location; rep rows Multiple  
*Frozen today:* yes  
*What it says now (asserts hidden at single scope but is silent on the selector):*

> 7. With a single location in scope the Location column is hidden.

*Verdict:* **EXTEND** — add the C2 switch and the C3 hidden-entry rule

****PV-FILT-14** = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914)** — The Location column shows only with more than one location, leftmost before Type  
*Frozen today:* **NO — this one is live**  
*What it says now (says Location is NOT one of the columns in the picker):*

> 4. Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you.

*Verdict:* **REWRITE** — flatly contradicts C2. **This case is NOT frozen** and would have been automated as it stands.

****TU-LOC-06** = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915)** — The Location column shows only with more than one location; Summary row blank  
*Frozen today:* **NO — this one is live**  
*What it says now (says Location is never listed in the Column Selection control):*

> 6. Location is never listed in the Column Selection control — it follows the location scope on its own.

*Verdict:* **REWRITE** — flatly contradicts C2. **NOT frozen.**

****TU-HRS-02** = [C30401](https://shopview.testrail.io/index.php?/cases/view/30401)** — Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp)  
*Frozen today:* **NO — this one is live**  
*What it says now (says it is not in the Column Selection control and that is expected):*

> 6. When more than one location is in scope the automatic Location column also appears, leftmost before Technician — it is not in the Column Selection control and its presence is expected.

*Verdict:* **REWRITE** — contradicts C2. **NOT frozen.**

****TU-EXP-04** = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437)** — Downloads cover only selected technicians, locations, and date range  
*Frozen today:* **NO — this one is live**  
*What it says now (says the files carry it even though it is not in the control):*

> 6. Note for the tester: when you have more than one location in scope, the files also carry a Location column even though it is not in the Column Selection control. That is correct - it appears by itself. With a single location in scope there is no Location column, and that is also correct.

*Verdict:* **REWRITE** — contradicts C2. **NOT frozen.**

****WIP-EXP-02** = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511)** — Downloads keep shown columns, honor filters, include the tab's Totals row  
*Frozen today:* **NO — this one is live**  
*What it says now (says the file carries it only when switched on, and not just because several locations are selected):*

> 5. Note for the tester: the file carries the location column only when you have switched Location ON in the column-selection control - it does not appear just because you have more than one location selected. In the file it is headed "Branch", not "Location", and the asset column is headed "Unit". Both of those names are correct.

*Verdict:* **REWRITE** — contradicts C1 (multi-selected means on by default). **NOT frozen.**

****WIP-COL-02** = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467)** — First visit shows the default columns; the rest are in the column selector  
*Frozen today:* yes  
*What it says now (says Location IS in the selector and OFF by default):*

> 3. Location IS offered in the column-selection control, between VIN and Advisor, and is off by default. Turning it on adds a Location column that names each job's location; turning it off removes it again.

*Verdict:* **REWRITE** — the selector half is now right; "off by default" is wrong when several locations are selected

****WIP-FLT-09** = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)** — The Location column is automatic and never reads Multiple on a work-order row  
*Frozen today:* yes  
*What it says now (says it does not appear on its own and follows the toggle only):*

> 4. The column does not appear or disappear on its own when you change the location selection - it follows the column-selection toggle only.

*Verdict:* **REWRITE** — contradicts C1

****IV-EXP-02** = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)** — Downloads keep shown columns and order, honor filters, and include Totals  
*Frozen today:* yes  
*What it says now (says it does not appear just because several locations are selected):*

> 5. Note for the tester: the files carry the Location column when Location is turned ON in the column-selection control (it sits between Vendor and Qty). It does not appear just because you have more than one location selected.

*Verdict:* **REWRITE** — contradicts C1

****IV-LOC-06** = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917)** — The Location column sits after Vendor and never reads Multiple  
*Frozen today:* yes  
*What it says now (says visibility follows the toggle, not the location selection):*

> 4. Location IS one of the columns offered in the column-selection control - its visibility follows that toggle, not the location selection.

*Verdict:* **REWRITE** — under his rule it follows **both**

****IV-COL-01** = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551)** — With every column on they appear in the fixed order with the set alignment  
*Frozen today:* yes  
*What it says now (describes the selector-controlled column only):*

> 4. Location is one of the columns in the column-selection control; when it is turned on the Location column appears between Vendor and Qty, left-aligned.

*Verdict:* **EXTEND** — add the default-on-when-multi-selected half

****IV-COL-04** = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554)** — On a first visit the default columns show and the rest stay available  
*Frozen today:* yes  
*What it says now (describes the selector-controlled column only):*

> 4. Location is one of the columns in the column-selection control; when it is turned on the Location column shows between Vendor and Qty.

*Verdict:* **EXTEND** — same

****WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466)** — With all toggleable columns on, the fixed column order and alignment hold  
*Frozen today:* yes  
*What it says now (lists Location in the fixed column order):*

> 1. The columns appear in this order: WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, Total.

*Verdict:* **NO CHANGE** — this is an order assertion; his rule changes visibility, not position

****IV-PERS-02** = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580)** — Toggling columns never reorders them  
*Frozen today:* yes  
*What it says now (asserts toggling never reorders columns):*

> 1. Whatever columns are shown, they appear in the fixed left-to-right order - with Location, when it is turned on in the column-selection control, between Vendor and Qty (Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost) - toggling visibility never reorders columns.

*Verdict:* **NO CHANGE** — same reason

---

## 4 · ANSWERS THAT CHANGE NOTHING — with both texts quoted (Standing Rule 45(e))

A bare *"already covered by C30xxx"* is unfalsifiable, so nobody ever checks it. Each
sub-section below puts **his words** next to **the case's own words** so the claim can be
judged. Where a requirement makes two assertions, each gets its own line.

### 4.1 · T2-1 — the location chooser is hidden for a one-location person (answer B)

**His answer, verbatim:**

```
B) (answered in sheet: "Urgent - Location column")
```

**Option B, as he read it:** *"Change the product to match your ruling - hide it. We raise it
with engineering, and the four lines still need correcting because they say it stays."*

So the **product** moves, not our tests. Every one of our six cases already says hidden:

| Case | Its own words | Both agree? |
|---|---|---|
| **SBC-LOC-01** = [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | "For a user with access to only one location the Location filter is NOT shown at all — the report simply shows that one location's data." | **YES — no change** |
| **SBR-LOC-04** = [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) | "For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data." | **YES — no change** |
| **PV-FILT-13** = [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | "For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data." | **YES — no change** |
| **TU-LOC-05** = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | "For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data." | **YES — no change** |
| **WIP-FLT-06** = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | "For a user with access to only one location the Location filter is NOT shown at all — the report simply shows that one location's work orders." | **YES — no change** |
| **IV-LOC-04** = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | "For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's stock." | **YES — no change** |

**Verdict: RELEASE all 6, no wording change.** The frozen line comes off; the provenance line
is re-stamped to record that he **confirmed** this against the build on 2026-08-05.

**Two things this raises:**

1. **A developer ticket is needed** — the chooser is on screen for a one-location person on
   all six reports, which B says is wrong. We have **not** filed it: filing needs the QA
   lead's go-ahead, and per Standing Rules 52/53 it would be parented to epic SV-8582, linked
   to its story, and filed at priority **Low**.
2. **A correction to our own earlier mapping (Standing Rule 44).** Our QA-only mapping tab of
   2026-08-04 stated: *"there is NO Sales By Customer case asserting the hidden filter —
   SBC-LOC-01 (C30109) only asserts the control's position"*. **That was wrong.** **SBC-LOC-01** = [C30109](https://shopview.testrail.io/index.php?/cases/view/30109)
   line 5 asserts it in as many words:

   > 5. For a user with access to only one location the Location filter is NOT shown at all — the report simply shows that one location's data.

   So **no new Sales By Customer case is needed.** The error was ours, it is recorded here
   rather than quietly fixed, and it is the reason the earlier plan over-counted the work.

### 4.2 · T2-7 — the "As of" line in the Inventory Value spreadsheet (answer A)

**His answer:** `A)` — *"Yes, it belongs in the spreadsheet too - you add it to the
write-up and we keep testing for it."*

**Our case **IV-EXP-04** = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) already tests for it, and already says so:**

> 4. Note for the tester: the two files phrase the as-of line differently - the PDF reads "As of 2026-08-04", and in the spreadsheet it is one of the short summary lines that sit above the column headings, reading "As of: 2026-08-04" (with a colon). Both are correct; do not raise the difference, and do not count the summary lines - more of them may be added.

**Verdict: RELEASE 1, no wording change.**

**Honest residual:** the item asked **two** things — does the line belong in the spreadsheet
(yes), **and** should both files word it the same way. **A answers only the first.** Option C
was the "make them word it identically" option and he did not pick it, so the punctuation
difference (`As of: 2026-08-03` in the spreadsheet, `As of 2026-08-04` in the printable file)
stays as-is by default. Our case already tells the tester not to raise it. That stance is now
backed by his answer only **by implication**, not by words. Carried to `OUTSTANDING.md`.

### 4.3 · T2-8 — one single reports permission (answer A)

**His answer:** `A)` — "Yes, I will update them."

This was **only ever a documentation ask** — the item's own text said so. All eight cases
already follow the single-permission ruling and none of them is frozen. Example:

> **PV-PERM-01** = [C30325](https://shopview.testrail.io/index.php?/cases/view/30325) — "A user with ordinary reports access can load the report and export it"

**Verdict: no case change, no staged operation.** The SPEC-WATCH entry stays open until his
edit lands on the four descriptions.

### 4.4 · T2-9 — Print is gone (his free-text answer)

**His answer, verbatim:**

```
Love this flag. Intentionally dropped :). Great call-out!
```

**Our case **SBC-EXP-01** = [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) asserts Print's ABSENCE and passed live.** His answer confirms that is
deliberate.

**Verdict: no case change.**

**Honest residual:** the item asked him to tick a box if he wanted the two stale description
lines and the open Print job kept on the reminder list. **He ticked nothing** — he praised the
flag instead. So we do not know whether to keep reminding him, and the two lines plus that open
job are still there. Carried to `OUTSTANDING.md`.

### 4.5 · T3-1 — the downloads carry the location column whenever it is on screen (answer A)

**His answer:** `A` — *"The downloads should include the location column
whenever it appears on screen (this is the newer instruction, and we have already built our
checks to follow it)."*

**This confirms what we built.** Both texts:

| Case | Its own words | Agrees with his A? |
|---|---|---|
| **SBR-EXP-03** = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) | "With a single location in scope the columns are: Rep / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal. When more than one l…" | **YES** |
| **SBR-EXP-04** = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) | "Each block shows the header strip (workplace name and address, organization logo, title "Sales By Representative," the selected date range), the rep's name, and a per-invoice table…" | **YES** |
| **SBR-LOC-05** = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | "All four downloads include the Location column in the same position it occupies on screen. In the Summary files a rep's row carries that rep's location and reads "Multiple" when th" | **YES** |

**Verdict: RELEASE 3, no wording change** on this ground. (C30278 and C38913 do change, but
for a different reason — the Summary-file position, §5.5.)

**Note:** the older specification lines that still list a fixed download column set need his
tidy-up. That is documentation debt, not a case change.

### 4.6 · T3-5 — which Sales By Customer features were dropped (answer A)

**His answer:** `A` — "Those are the ones - nothing else was dropped, so
this is already tidy and you can close it."

**Verdict: zero case impact — the item closes.** We had already confirmed that all five
dropped features are gone from both the descriptions and our tests, and we deliberately did
**not** invent a retire list to fill the gap (Standing Rule 12). His A confirms the five are
the complete set, so there is nothing hiding anywhere we have not looked.

---

## 5 · ANSWERS THAT CHANGE OUR TESTS

### 5.1 · T2-2 — Work In Progress keeps the unit number first (answer B)

**His answer, verbatim:**

```
B) this is visually appealing, and already built. This looks right.
```

**⚠️ THIS REVERSES AN EARLIER RULING OF HIS OWN — flagged, not resolved (Standing Rules 32/33).**

On **2026-07-29** he ruled the vehicle-number chain applies everywhere, verbatim: *"A is the
correct answer"*, adding *"Not just for these specs though -- really good to keep this in mind
for all actions moving forward."* That instruction is recorded as a **durable, cross-project**
rule in `CLAUDE.md`.

**His 2026-08-05 answer B narrows it:** on Work In Progress the unit number leads. Because his
is the later authoritative product statement, **latest-wins applies to Work In Progress**. But
the durable rule says *everywhere*, so:

- **We have NOT edited the durable rule in `CLAUDE.md`.** That is the QA lead's call.
- The option he chose says in its own words: *"we record that your ruling does not reach this
  one report"* — so the narrowing is explicit, not inferred.
- **Sales By Customer keeps the vehicle-number chain** and its case is untouched.

**Four cases must be rewritten** — they currently assert the opposite of what he now wants:

- **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) — now says: "The Asset cell identifies the asset by its VIN." → **must lead with the unit number**
- **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) — now says: "The Asset column sorts by the identifier it shows - the VIN, falling back to Unit #, then plate." → **must lead with the unit number**
- **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) — now says: "Each option identifies the asset by its VIN, falling back to Unit #, then plate (the exact option text is confirmed in the build)." → **must lead with the unit number**
- **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) — now says: "Note: the on-screen Asset cell now identifies the asset by its VIN (falling back to Unit #, then plate); whether the export header text changes from "Unit" is confirmed in the build - record" → **must lead with the unit number**

**And one released unchanged:** **SBC-LBL-01** = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) (Sales By Customer) keeps the vehicle-number chain,
because his B is expressly limited to the one report. Its own words:

> 1. Asset (a) is identified by its VIN.

**SURFACE MATRIX — the asset identifier**

| Surface | Verdict | Case |
|---|---|---|
| Work In Progress, on screen | **REWRITE** — unit number leads | **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) |
| Work In Progress, sorting | **REWRITE** — sorts by the unit number | **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) |
| Work In Progress, the asset filter | **REWRITE** — matches on the unit number first | **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) |
| Work In Progress, downloads | **REWRITE** — the note about the header changing must go | **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) |
| Sales By Customer, on screen | **NO CHANGE** — the vehicle-number chain stands | **SBC-LBL-01** = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) |
| Sales By Customer, downloads | **NO CHANGE** — no download case asserts the identifier chain | — |
| API | **NO CHANGE** — no API case asserts the display identifier | — |
| Mobile / print | **NOT APPLICABLE** | — |

### 5.2 · T2-3 and T2-4 — the Sales By Representative downloads (answers A and A)

**Two of his answers land on the SAME LINE of the same case, and they pull in opposite
directions.** This is worth reading slowly.

**T2-3, verbatim:** `A)` — *"\"Representative\" on its own is fine - it is not slang,
so it satisfies your ruling. We match our tests to it and you tidy the write-up."*
→ **the product is right, our test is wrong.**

**T2-4, verbatim:**

```
A)

Further context -- on-screen should match download :).
```

→ *"They are missing by mistake - add the four back. We raise it with engineering and your
write-up stays exactly as it is."* → **the product is wrong, our test is right.**

**Both land on line 2 of **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285):**

> 2. With a single location in scope the headers, in order, are exactly: Sales Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal.

**The coherent result:** the **heading word** becomes `Representative` (he says the product is
right), and the **thirteen columns stay** (he says the product is wrong and will be fixed). So
the line becomes the thirteen columns headed `Representative`, plus a plain note that only nine
arrive today and that is the known defect — **expect red until engineering ships the four.**

**Also on that case, line 6 must change.** It currently tells the tester to fail the build:

> 6. Note for the tester: the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the pending rename — do not change the test.

Under T2-3 that instruction is now **wrong** — the file says `Representative`, and he has
accepted it. Leaving that line in place would make a tester fail a correct build.

**Same treatment on **SBR-EXP-11** = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** (lines 2 and 4).

**His extra remark is bigger than the question he was answering:**

> "Further context -- on-screen should match download :)"

That is a **new suite-wide principle**, not a Sales By Representative detail. It is the reason
the download surface follows the screen in §3.4 (gap U3). **We recommend the QA lead record it
as a durable ruling** — we have not edited `CLAUDE.md` ourselves.

**SURFACE MATRIX — the Sales By Representative download headings**

| Surface | Verdict | Case |
|---|---|---|
| Summary CSV | **REWRITE** — heading word + keep 13 columns + expect-red note | **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) |
| Expanded CSV | **REWRITE** — heading word | **SBR-EXP-11** = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) |
| Summary PDF | **NOT ANSWERED — needs a live read.** Our case says the column reads `Rep`; his answer was about the files we measured, which were the spreadsheets. We have NOT changed it on his answer. | **SBR-EXP-03** = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) |
| Expanded PDF | **NOT ANSWERED — same** | **SBR-EXP-04** = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) |
| On screen | **NOT ANSWERED** — the screen label sits under item T3-9, which he left blank | §7 |
| The assignments file | **NOT ANSWERED** — same blank item | **SBR-ASGN-02** = [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) |
| API | **NO CHANGE** — no API case asserts the download heading | — |

**This is a deliberate limit.** His A was about the **download column heading**. Applying it to
the screen, the customer card, or the printable files would be us extending his answer past
what he wrote, and the on-screen question **is still open** (T3-9).

### 5.3 · T2-5 — the date chooser: keep the product (answer A)

**His answer, verbatim:**

```
A) This was purely unintentional -- the original datepicker is
the intentional one.
```

Option **A** reads: *"Keep what the product does - we correct the write-ups and our tests to
the nine choices plus the calendar, and the unrunnable test gets fixed the same day."*

**On his gloss, honestly:** *"the original datepicker is the intentional one"* is not perfectly
unambiguous on its own — "original" could be read either way. But the **letter he chose is A**,
and A says keep the product. His *"purely unintentional"* clearly describes the descriptions
having drifted. We are following the letter, and recording the gloss verbatim so he can correct
us if we have him backwards.

**What the product actually offers** (his own item text, from our 3 August read):
`Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month,
This Week, Last Week` — nine, plus a month calendar, a live "Range: N days" readout and an
Apply button. **No Today. No Yesterday. No item called "Custom".**

**This is ONE SHARED chooser used by all six reports**, so his answer lands on every one.

**Five cases must be rewritten** — each currently enumerates eleven options including items
that do not exist:

- **SBC-DATE-01** = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) — "It offers eleven options, in this order: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom."
- **SBR-DATE-01** = [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) — "The standard presets are offered: Today, Yesterday, This Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom."
- **PV-FILT-03** = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330) — "The options are exactly: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom."
- **WIP-FLT-04** = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) — "The options offered are: "Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "This Quarter", "Last Quarter", and "Custom"."
- **IV-DATE-01** = [C30561](https://shopview.testrail.io/index.php?/cases/view/30561) — "The control offers the standard presets: "Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "This Quarter", "Last Quarter", and ""

**One is already correct and simply becomes runnable:** **SBC-DATE-03** = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104). It already describes the
build:

> 1. The date range picker shows a month calendar inside it — that is how a custom start and end date are chosen on this build. There is no separate "Custom" item to choose.

**But its TITLE still contradicts its own body** — a Standing Rule 28 title-versus-expected
failure that this pass found:

> Title: "Custom range opens a start/end date dialog and cannot exceed a 366-day span"

There is no "Custom" item and no separate dialog. **The title is staged for correction**; the
body needs no change.

**And one case that was never frozen is now wrong:** **SBC-EXP-02** = [C30160](https://shopview.testrail.io/index.php?/cases/view/30160). It maps download file-name
suffixes to date presets, and the map includes presets that do not exist:

> 2. {range} follows this map: Today → today; Yesterday → yesterday; This Week → this_week; Last Week → last_week; This Month → this_month; Last Month → last_month; This Year → this_year; Last Year → last_year; This Quarter → this_quarter; Last Quarter → last_quarter; Custom → custom.

> 3. For Custom the literal word "custom" is used — the actual start and end dates are not in the file name.

**Standing Rule 42 applies to every rewrite here.** These are closed enumerations, and the
governing specification still says eleven — so each rewritten list must be pinned to **his
answer and its date**, not to a specification version that contradicts it.

**SURFACE MATRIX — the date chooser**

| Surface | Verdict | Cases |
|---|---|---|
| Sales By Customer, the chooser | **REWRITE** | **SBC-DATE-01** = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) |
| Sales By Customer, the custom range | **NO BODY CHANGE — TITLE FIX** | **SBC-DATE-03** = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) |
| Sales By Representative, the chooser | **REWRITE** | **SBR-DATE-01** = [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) |
| Parts Velocity, the chooser | **REWRITE** | **PV-FILT-03** = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330) |
| Technician Utilization, the chooser | **NO CASE FOUND** — searched all 469; nothing enumerates the presets for this report. Not a gap his answer creates, but worth his and the QA lead's knowledge. | — |
| Work In Progress, the chooser | **REWRITE** | **WIP-FLT-04** = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) |
| Inventory Value, the chooser | **REWRITE** | **IV-DATE-01** = [C30561](https://shopview.testrail.io/index.php?/cases/view/30561) |
| Download FILE NAMES (derived from the preset) | **REWRITE — and this one was never frozen** | **SBC-EXP-02** = [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) |
| Work In Progress, the one-day span cut-off | **STAYS FROZEN** — a different question, and it was never asked. See §7. | **WIP-FLT-05** = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) |
| API | **NO CHANGE** — no API case enumerates the presets | — |
| Mobile / print | **NOT APPLICABLE** | — |

### 5.4 · T2-6 — the Technician Utilization download menu (answer B)

**His answer, verbatim:** `B) is correct here. Consistency is key.`

Option **B**: *"Bring it into line with Sales By Customer and Sales By Representative - the
longer \"Download ...\" wording. We raise it with engineering."*

So **the product is wrong** and must change. Since the two reports he named both carry **four**
options in the long form, and option A's own text said keeping four *"will also mean listing
the fourth option"*, B reads as **four options in the long wording**:
`Download Summary (PDF)` · `Download Expanded View (PDF)` · `Download Summary (CSV)` ·
`Download Expanded View (CSV)`.

****TU-EXP-01** = [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) must be rewritten.** It currently says:

> 2. The menu holds: "Download Summary (PDF)", "Download Expanded View (PDF)", and "Download (CSV)".

> 3. The labels match exactly - only the expanded option carries the word "View" (the shipped strings, documented as-is).

Three options, and line 3 blesses the shipped strings as correct — both wrong under B. The
rewritten case should **expect red today** until engineering ships the change.

****TU-EXP-02** = [C30435](https://shopview.testrail.io/index.php?/cases/view/30435) is released unchanged** — it is about what the Summary printable file contains
and what the files are named, which the menu wording does not touch:

> 1. The Summary PDF shows the technician rows and the Summary row (no day rows); it downloads as "Technician-Utilization-Summary.pdf".

**⚠️ A COVERAGE GAP HIS ANSWER OPENS.** If the menu properly has **four** options, there are
now **two** spreadsheet downloads for this report — a Summary one and an Expanded one — where
the description described a single `Download (CSV)`. **We searched all 469 cases: no case
covers the content of two separate Technician Utilization spreadsheet downloads.** A new case
is likely needed. It is **not** authored here — new cases need the QA lead's go-ahead.

**Honest note on ambiguity:** B settles the **wording** in his own words. That it also settles
the **count** at four is our reading from "bring it into line with" the two named reports.
Flagged in `OUTSTANDING.md` for a one-word confirmation.

### 5.5 · T3-3 — where the location column sits in the Summary downloads (answer A)

**His answer:** `A` — *"With the naming columns at the left - straight after
the customer name (Sales By Customer) or the representative name (Sales By Representative),
before the money columns."*

**This question was specification-SILENT** — nothing written anywhere said where the column
goes in a file that has no date or status column for it to follow. So **his file is the BASIS**
of the expectation, not a confirmation of it. That distinction drives the provenance wording.

**Four cases carry a hedge that his answer now replaces with a definite position:**

- **SBC-EXP-16** = [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) — "…he identifying columns, ahead of the money columns (the Summary files have no Date column for it to follow — confirm its exact position in the build)."
- **SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) — "…ggregates more than one, and the invoice's own location on an invoice row. (Exactly where the column sits inside each file is confirmed in the build.)"
- **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) — "…se invoices span more than one location reads "Multiple". (This file has no Status column for it to follow — confirm its exact position in the build.)"
- **SBR-EXP-03** = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) — "…d a rep who spans more than one location reads "Multiple" (this file has no Status column for it to follow — confirm its exact position in the build)."

- **SBR-LOC-05** = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) — its line 8 describes the Summary files without pinning the position; **extend**

**SURFACE MATRIX — the Summary-file column position**

| Surface | Verdict | Cases |
|---|---|---|
| Sales By Customer Summary CSV + PDF | **REWRITE** — after the Customer name, before the money columns | **SBC-EXP-16** = [C38856](https://shopview.testrail.io/index.php?/cases/view/38856), **SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) |
| Sales By Representative Summary CSV | **REWRITE** — after the Representative name | **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) |
| Sales By Representative Summary PDF | **REWRITE** — same | **SBR-EXP-03** = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) |
| Expanded files (both reports) | **NO CHANGE** — these DO have a date/status column, so the existing "same position as on screen" rule already works | **SBR-EXP-11** = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286), **SBR-EXP-04** = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) |
| On screen | **NO CHANGE** — the on-screen position was never in doubt | **SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912), **SBR-LOC-05** = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) |
| The other four reports | **NOT APPLICABLE** — none of them has a Summary/Expanded file pair with this problem | — |

### 5.6 · T3-4 — the logo rule (answer C, spelled out)

**His answer, verbatim:**

```
C - same as technician efficiency
native to SV -- if the customer
has a logo selected, it appears,
if not -- no logo (there's a weird
fallback here, see copy paste below)

Corrected #4 → C (something else). The single rule every report should follow = what Technician Efficiency actually does:

▎ Use the company's own uploaded logo. If a logo is set but fails to load, fall back to the built-in ShopView logo. If no logo is uploaded, print no logo and let the text fill the space.
```

**The operative sentence is his own correction at the end:**

> Use the company's own uploaded logo. If a logo is set but fails to load, fall back to the
> built-in ShopView logo. If no logo is uploaded, print no logo and let the text fill the space.

**This draws a distinction none of our cases makes.** We treat "no logo" as one situation. He
splits it in two:

| Situation | His rule |
|---|---|
| A logo is uploaded and loads | show it |
| A logo is **set but fails to load** | fall back to the built-in ShopView logo |
| **No logo is uploaded at all** | **print NO logo** and let the text fill the space |

**Three of our cases assert the opposite of that third row** — they say a missing logo falls
back to the bundled one:

- **SBC-EXP-10** = [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) — "With no uploaded logo, the bundled ShopView logo is used." → **WRONG under his rule**
- **TU-EXP-06** = [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) — "With NO uploaded logo, the PDF views show the bundled ShopView logo instead — not a blank space and not an error." → **WRONG under his rule**
- **PV-EXP-05** = [C30379](https://shopview.testrail.io/index.php?/cases/view/30379) — "The shop logo shows at the top of the PDF when one is set. With no uploaded logo the PDF shows the bundled ShopView default logo instead of a blank space, the same as the other reports in this suite. " → **WRONG under his rule**

**And a fourth, never frozen, says the same thing:** **SBR-EXP-06** = [C30281](https://shopview.testrail.io/index.php?/cases/view/30281)

> 3. With no configured logo, the logo region falls back to the default ShopView logo and the PDF still generates normally.

****TU-EXP-06** = [C30439](https://shopview.testrail.io/index.php?/cases/view/30439)'s TITLE also asserts it** and must change:

> Title: "PDF logo: the uploaded logo, else the bundled ShopView logo; CSV never"

****PV-EXP-06** = [C30380](https://shopview.testrail.io/index.php?/cases/view/30380) is released unchanged** — its only logo statement is about the spreadsheet, which
his rule does not touch:

> 3. Last Sale is a raw integer in the CSV (e.g. 42) - the 'N days' wording is PDF/on-screen only.

**⚠️ A SECOND COVERAGE GAP.** The middle row — *a logo is set but fails to load* — is a branch
**no case of ours tests at all** (searched all 469). It is also genuinely hard for a manual
tester to produce. A new case may be needed; **not authored here.**

**SURFACE MATRIX — the logo**

| Surface | Verdict | Cases |
|---|---|---|
| Sales By Customer PDF | **REWRITE** — no-logo means no logo | **SBC-EXP-10** = [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) |
| Sales By Representative PDF | **REWRITE — never frozen** | **SBR-EXP-06** = [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) |
| Parts Velocity PDF | **REWRITE** | **PV-EXP-05** = [C30379](https://shopview.testrail.io/index.php?/cases/view/30379) |
| Technician Utilization PDF | **REWRITE** + title | **TU-EXP-06** = [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) |
| Work In Progress PDF | **NO CASE FOUND** — searched all 469; no logo assertion for this report | — |
| Inventory Value PDF | **NO CHANGE** — **IV-EXP-04** = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) says "the shop logo when one is set", which is true under his rule and asserts no fallback | **IV-EXP-04** = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) |
| Every CSV | **NO CHANGE** — the "never a logo" rule is untouched | **PV-EXP-06** = [C30380](https://shopview.testrail.io/index.php?/cases/view/30380), **TU-EXP-06** = [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) |
| "Set but fails to load" | **GAP — no case exists on any report** | — |
| Print | **NOT APPLICABLE** — retired | — |
| Screen / API / mobile | **NOT APPLICABLE** — the rule is about printable downloads | — |

---

## 6 · THE SEVEN CASES HIS ANSWERS MAKE WRONG THAT NOBODY HAD FROZEN

**This is the section to read if you read only one.** These cases are **not** on the frozen
list. Nothing warns a tester or an automation engineer about them. As they stand today they
would **fail a build that is behaving exactly as Chris now wants** — or worse, **pass a build
that is wrong**.

| Case | Report | What it says now | Why his answer breaks it |
|---|---|---|---|
| **PV-FILT-14** = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | Parts Velocity | Location is NOT one of the columns in the picker | T1-1 **C2** — it **is** in the picker |
| **TU-LOC-06** = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | Technician Utilization | Location is never listed in the Column Selection control | T1-1 **C2** |
| **TU-HRS-02** = [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | Technician Utilization | not in the control "and its presence is expected" | T1-1 **C2** |
| **TU-EXP-04** = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | Technician Utilization | the files carry it "even though it is not in the control" | T1-1 **C2** |
| **WIP-EXP-02** = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | Work In Progress | carries it only when switched on, "not just because you have more than one location selected" | T1-1 **C1** — several selected means on by default |
| **SBR-EXP-06** = [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) | Sales By Representative | no configured logo "falls back to the default ShopView logo" | T3-4 — no logo uploaded means **no logo** |
| **SBC-EXP-02** = [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) | Sales By Customer | maps file names to `today`, `yesterday`, `custom` | T2-5 — none of those three presets exists |

**How they were found, and the honest lesson.** The 47 frozen cases came from a mapping built
when the questions were written — it recorded which cases each *question* touched. But an
answer can reach **further than the question that produced it**, and his location-column answer
did exactly that: he replaced the model rather than choosing between two, so every case that
described the old model became wrong, whether or not anyone had flagged it.

These seven were found by sweeping **all 469 cases** for the behaviour each answer describes —
not by re-reading the 47. That sweep is the Standing Rule 40/45 discipline, and it is the only
reason they are on this page instead of in an automation suite.

---

## 7 · WHAT STAYS FROZEN — the 8, and why

| Case | Report | Waiting on | Honest classification |
|---|---|---|---|
| **SBC-NAV-01** = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | Sales By Customer | **item T3-7, left blank** — which menu group it sits in and below which links | Genuinely waiting on him |
| **SBR-WO-01** = [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | Sales By Representative | **item T3-9, left blank** — the full word "Representative" on screen | Genuinely waiting on him |
| **SBR-WO-06** = [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | Sales By Representative | **item T3-9, left blank** — the customer-card label | Genuinely waiting on him |
| **WIP-FLT-05** = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) | Work In Progress | **nothing — it was never asked.** The case says the one-day span difference "is already known and is with the product owner", but no item on the sheet covers it | **Our gap.** A question that should have been asked and was not |
| **SBC-VIS-02** = [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) | Sales By Customer | **nothing.** Row colours and indentation — no item on the sheet governs it | **Frozen in error.** The line looks over-applied |
| **TU-EXP-07** = [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) | Technician Utilization | **nothing.** A silent no-op when no technician is selected — no item governs it | **Frozen in error.** Our earlier mapping filed it under the logo question, which it has nothing to do with |
| **WIP-SUM-05** = [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | Work In Progress | **a developer, not him.** The Estimates figure reads zero — recorded in our own notes as a defect, "not a product decision" | **Frozen in error** — it is a defect, and the line should say so |
| **IV-DATE-04** = [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) | Inventory Value | **a developer, not him.** Already filed as [SV-8820](https://shopview.atlassian.net/browse/SV-8820), Ready to Fix | **Frozen in error** — the case already carries its ticket |

**So of the 8 that stay frozen, only 3 are genuinely waiting on Chris.** The other 5 break down
as **1 question we failed to ask** and **4 cases carrying a "waiting on the product owner"
line that no question supports**. Four of those five are blocked on a developer or on nothing
at all.

**We have staged no change to any of the 8.** Correcting a frozen line on a case that is
really waiting on a developer changes what a tester does, so it needs the QA lead's decision,
not ours. All five are in `OUTSTANDING.md`.

---

## 8 · CONTRADICTIONS AND CONFLICTS — FLAGGED, NOT SILENTLY RESOLVED

Standing Rules 32 and 33 mean we record these and let the QA lead and the PO settle them. We
have resolved **none** of them on our own initiative.

| # | The conflict | The two sides | What we did |
|---|---|---|---|
| **X1** | **His answer versus his own earlier ruling.** T2-2 = B keeps the unit number first on Work In Progress | **2026-07-29:** *"A is the correct answer"* on the vehicle-number chain, plus *"really good to keep this in mind for all actions moving forward"* — recorded as a durable cross-project rule in `CLAUDE.md`. **2026-08-05:** B, for this one report. | Latest-wins applies to the report, so 4 cases are staged to change. **We did NOT edit the durable rule in `CLAUDE.md`** — that is the QA lead's call. |
| **X2** | **His answer versus all six specifications.** 15 answers; not one description has moved | His answers (2026-08-05) versus SBC v13, SBR v15, PV v4, TU v5, WIP v6, IV v3 | His answers win (Rule 32), **and he authorised it in writing** (T3-2 = A). Every staged provenance line says so rather than claiming specification agreement. |
| **X3** | **His own answer is internally inconsistent.** T1-1 gap **U1** | C2: switchable *"if the above is satisfied"* (both conditions) versus C3: the entry is removed only when **access** is single | **Not resolved.** No staged case takes a side. Sent back to him. |
| **X4** | **Two of his answers land on one line pulling opposite ways.** T2-3 (our test is wrong) and T2-4 (the product is wrong) both hit line 2 of **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | heading word versus column count | **Reconciled without picking a side** — they address different parts of the line. Shown in full in §5.2. |
| **X5** | **A ticket status moved with no action of ours.** [SV-8821](https://shopview.atlassian.net/browse/SV-8821) now reads **OBSOLETE** | Our record says it was deliberately kept **Open** because that failure also happens through the product's own screen (Rule 51) | **Not touched, not reversed** (Standing Rule 53 — a change under the shared account is read as the QA lead's triage). Reported only. |
| **X6** | **Our own earlier mapping was wrong.** It said Sales By Customer had no case asserting the hidden location chooser | The 2026-08-04 QA mapping tab versus **SBC-LOC-01** = [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) line 5, which asserts it plainly | **Ours was the defect** (Standing Rule 44). Corrected in the open in §4.1. No new case is needed. |

---

## 9 · COVERAGE HIS ANSWERS ADD — new cases likely needed (NOT authored)

| # | The gap | From | Why no case exists |
|---|---|---|---|
| **N1** | A person with **access** to one location must never see the Location entry in the column-selector list | T1-1 **C3** | Brand new requirement. **No case of ours distinguishes "has access to" from "has selected".** |
| **N2** | A person with access to several locations who has **selected one** — is the entry offered? | T1-1 gap **U1** | Cannot be authored until he clears the ambiguity |
| **N3** | Does a hand-made Location toggle **stick** next time? | T1-1 gap **U2** | Our persistence cases cover column selection generically but not this new switch |
| **N4** | The content of **two separate** Technician Utilization spreadsheet downloads | T2-6 **B** | The description described a single spreadsheet download; four menu items means two |
| **N5** | A logo that is **set but fails to load** falls back to the built-in one | T3-4 **C** | A branch no case tests on any report, and hard for a manual tester to produce |

**Nothing above has been authored.** New cases are a TestRail write and need the QA lead's
go-ahead (Standing Rule 6). N1 and N4 look like real coverage that the release would otherwise
ship without.

---

## 10 · DEVELOPER TICKETS HIS ANSWERS CALL FOR — none filed

| # | What is wrong | His answer that says so | Reachable from the screen? |
|---|---|---|---|
| **B1** | The location chooser is shown to a one-location person on all six reports | T2-1 **B** | Yes — user-facing |
| **B2** | Four columns missing from the Sales By Representative summary spreadsheet | T2-4 **A** | Yes — user-facing |
| **B3** | The Technician Utilization download menu uses short wording (and may be short an option) | T2-6 **B** | Yes — user-facing |
| **B4** | The location column does not follow his C1/C2/C3 rule on Work In Progress or Inventory Value | T1-1 **C** | Yes — user-facing |
| **B5** | The logo falls back to the built-in one when none is uploaded, instead of printing no logo | T3-4 **C** | Yes — user-facing |

**None of these has been filed.** All five are user-facing rather than API-only, so Standing
Rule 51 does not bar them — but filing still needs the QA lead's go-ahead. When authorised
they would be **parented to epic SV-8582**, **linked to the owning story**, and filed at
**priority Low** (Standing Rules 52 and 53).

**B4 depends on gap U1 being cleared first** — we cannot describe the correct behaviour to a
developer while his own two sentences point different ways.

---

## 11 · HONEST LIMITS OF THIS PASS

- **No live build observation.** The application was not opened. Nothing here upgrades an
  earlier provisional finding, and the Rule-49 re-check queue
  (`viu-2026-08-03/RECHECK-QUEUE.md`) **stays OPEN** — the branch has not been declared final.
- **No TestRail write.** Every operation is staged in `testrail-sync-manifest.md`.
- **Read-only TestRail GETs were used** to make sure the "before" text in the manifest is
  genuinely what is live today, not a stale local copy.
- **The epic had a Tier-1 currency check only** (Standing Rule 37). A full re-read was not
  authorised and is not claimed.
- **His reading is our reading.** Where his wording is ambiguous — U1, U2, the option count in
  T2-6, the scope of the "Representative" rename — we have said so and changed nothing, rather
  than picking the interpretation that makes the work smaller.
- **Five cases named in §7 carry a "waiting on the product owner" line we believe is wrong.**
  We have not removed them, because that changes what a tester does.


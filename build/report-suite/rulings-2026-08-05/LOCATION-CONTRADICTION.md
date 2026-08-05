# The location-column contradiction — did we ask it, and whose fault is it?

**Report Suite · epic [SV-8582](https://shopview.atlassian.net/browse/SV-8582) · PO Chris Ward · written 2026-08-05**

**RESEARCH ONLY. NOTHING WAS WRITTEN ANYWHERE.** No TestRail write, no Jira write, no case edit.
Every TestRail and Confluence read below was a read-only `get`.

The QA lead asked one question: **"Have we asked question to him related to that?"**

**The short answer: YES — we asked it, on 2026-08-04, as the single urgent item of its own
dedicated tab, and he answered it. The ambiguity is inside HIS answer, not inside our question.
But we contributed to it, and section (d) says exactly how.**

---

## (a) THE EXACT QUESTION WE ASKED — verbatim

**Source file:** `build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx`
**Tab:** `Urgent - Location column` (tab 1 of 4 — it was the ONLY item on that tab)
**Item number:** **1.0** (row 6; band row 5 reads *"DECISION WE NEED FROM YOU - TODAY"*)

**Cell D6 — "The question", verbatim:**

> Which behaviour should all six reports use for the location column?

**Cell B6 — "Topic", verbatim:**

> The location column - should it appear on its own, or does the user switch it on?

**Cell E6 — "Options", verbatim (all three, character for character):**

> A) The column appears on its own whenever more than one location is in view, and disappears when only one is - it is not something the user switches on. (This matches what both your written descriptions already say, and what the other four reports already do. If you choose A we will raise the two reports that behave differently, and correct our eight checks so they would catch it.)
>
> B) The column is a switch the user turns on and off from the list of columns, and it stays however they left it. (If you choose B, the two written descriptions need updating to say so, and we will keep our eight checks as they are.)
>
> C) Something else, or it should differ between reports - please describe it.

**Cell C6 — "What happens now", verbatim** (this is the context he read before answering, and it
matters for section (d) because of the phrase it uses throughout):

> The six reports can show a location column, telling you which branch each row belongs to. Right now they do not agree on how it should behave: Sales By Customer, Sales By Representative, Parts Velocity and Technician Utilization: handle it on their own - the column appears when you are looking at more than one location, and disappears when you narrow to one. Work In Progress: never shows it on its own. The column is missing until you switch it on yourself from the list of columns - even when you have every location in view. Inventory Value: does the opposite. The column is on from the start, and it stays on even after you narrow to a single location - so you get a column repeating the same branch name on every row. One more oddity on Inventory Value -: the screen and the downloaded file disagree with each other. The download drops the column when you narrow to one location, but the screen keeps it.
>
> Your own descriptions say it should be automatic:
> Work In Progress: "The Location column is not offered in the column selector; its visibility is automatic - shown only when more than one location is in scope (Story 7)."
> Work In Progress: "...and is hidden whenever a single location is in scope; the user does not toggle it in the column selector."
> Inventory Value: "Its visibility follows the location scope automatically and it is not one of the columns offered in the column-selection control (Story 8)."
>
> We are asking rather than assuming because our eight checks for those two reports currently describe what the product does today, not what your description asks for - which means if the product is the thing that is wrong, our tests would quietly pass it instead of catching it.

**Cell C8 — the closing line, verbatim:**

> Needed today, please: the automated versions of these tests are being written today, and these eight checks cannot be finalised until we know which behaviour is the correct one.

---

## (b) HIS EXACT ANSWER — verbatim, every character

**Source file:** `build/report-suite/chris-answers-2026-08-05/source/Chris-Ward-ANSWERED_Report-Suite_Questions-and-Decisions_2026-08-05.xlsx`
sha256 `6da732152589a31b842adf6e1a16549c3fce0dd0ca0c4da0e5792aac924993cd`
**Tab:** `Urgent - Location column` · **item 1.0** · **cell F6** ("Your answer")

He did not tick A or B. He wrote in the free-text box:

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

Read continuously, with his line breaks removed, that is four statements:

1. *"C) -- by default, the column will exist in all reports being built as follows (requirements):"*
2. *"1) user has access to multiple locations;"*
3. *"2) user has selected multiple locations;"*
4. *"The location column selector should still be toggleable from the column selector list for the
   user, if the above is satisfied (note - the column selector for locations should not appear if
   the user doesn't satisfy #1 above."*

**Two small facts about the text itself, recorded because they are evidence, not decoration:**

- **The bracket he opens is never closed.** The answer ends `...doesn't satisfy #1 above.` with no
  `)`. That is consistent with a sentence that was still being composed.
- **The trailing whitespace and the `---------` divider are his.** Nothing has been tidied.

---

## (c) WHERE THE TWO HALVES CONFLICT — with a worked example

### The two halves, side by side

| His statement 4, first half | His statement 4, second half (the bracket) |
|---|---|
| *"The location column selector should still be toggleable from the column selector list for the user, **if the above is satisfied**"* | *"(note - the column selector for locations should not appear **if the user doesn't satisfy #1 above**."* |
| **"the above" = the numbered list = requirement 1 AND requirement 2.** So the Location entry is in the column list only when the user **can see several branches AND has selected several branches**. | **This half only takes the entry away when requirement 1 fails** — when the user cannot see several branches at all. It says nothing about requirement 2. So a user who satisfies 1 **keeps** the entry, whatever they have selected. |

**Both halves describe the same control, in the same breath, and they disagree about one person.**

### The worked example — one person, two opposite answers

> **Sarah is a service manager. She has access to three branches: Calgary, Edmonton and
> Lethbridge. She opens the Inventory Value report. It opens showing Calgary only, because that is
> the branch she is working in. She clicks the control that lets her choose which columns to show,
> because she wants to add the Location column.**
>
> **Under the first half of his sentence:** there is **no "Location" line in that list at all**. Both
> of his requirements have to be satisfied, and she has only selected one branch. She cannot add the
> column even though she can see three branches.
>
> **Under the second half of his sentence:** there **is** a "Location" line in that list, switched
> off. She satisfies requirement 1 — she has access to several branches — and that is the only thing
> the bracket takes the entry away for. She switches it on and gets a Location column reading
> "Calgary" on every row.

**Same woman. Same screen. Same second. One sentence says the option is not there; the other says it
is.**

### Why this is not a corner case — it is the DEFAULT state of every report

This is the part that makes it worth a follow-up rather than a shrug. **Every one of the six reports
opens on the user's own single active branch**, not on all branches. Our own tests say so, and they
were live-verified against the build on 2026-08-04:

| Report | The case that says so | Its own words |
|---|---|---|
| Sales By Customer | **SBC-PERS-05** = [C30178](https://shopview.testrail.io/index.php?/cases/view/30178) | "3. Location = the single location you are currently working in (your active location) — not all locations." |
| Sales By Representative | **SBR-PERS-04** = [C30274](https://shopview.testrail.io/index.php?/cases/view/30274) | "Location = your currently active location only (the one location you are working in)" |
| Parts Velocity | **PV-FILT-10** = [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) | title: "Location filter is rightmost, defaults to the active location, accessible-only" |
| Technician Utilization | **TU-NAV-03** = [C30394](https://shopview.testrail.io/index.php?/cases/view/30394) | "3. The location filter defaults to the user's currently active location (the one in the application's global location switcher)." |
| Work In Progress | **WIP-FLT-06** = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | "2. On a first visit it defaults to the user's currently active location." |
| Inventory Value | **IV-NAV-03** = [C30536](https://shopview.testrail.io/index.php?/cases/view/30536) | "2. The location defaults to the user's currently active location." |

**So "has access to several branches, has selected one" is not an edge case. It is what every
multi-branch manager sees the first time they open any of the six reports — and it is the exact
state his two half-sentences answer differently.**

---

## (d) IS THIS OUR FAULT OR HIS? — the honest answer

### The verdict

**It is (ii) — a genuine self-contradiction inside his free-text answer to a question that was
clear and answerable.** We should **press for one more sentence, not apologise for the question.**

**But we contributed, and the contribution is real enough that the QA lead should know it before he
writes to Chris.** It is named in full below, and the follow-up sheet is built to fix it.

### Why the question was clear — the evidence

| Test of a clear question | Our item 1.0 | Verdict |
|---|---|---|
| Does it ask **one** thing? | *"Which behaviour should all six reports use for the location column?"* — one control, one behaviour | **Clear** |
| Are the options **mutually exclusive**? | A = appears on its own, *"not something the user switches on"*. B = *"a switch the user turns on and off"*. You cannot have both. | **Clear** |
| Is each option **fully spelled out**, with its consequence? | Both carry the consequence in brackets — which reports would be raised, which descriptions would need updating, what happens to our eight checks | **Clear** |
| Was **"something else"** available, so he was not forced into a false choice? | Option C: *"Something else, or it should differ between reports - please describe it."* | **Clear — and he used it** |
| Did we say **why** we were asking and **what it blocked**? | *"the automated versions of these tests are being written today, and these eight checks cannot be finalised until we know which behaviour is the correct one"* | **Clear** |

**Nothing in our question invited a two-condition rule with a conditional exception, and nothing in
it made his sentence ambiguous. He answered C and wrote a new rule — which he was entitled to do —
and the new rule's last sentence disagrees with itself.**

### Where we DID contribute — named plainly

**Our question never distinguished "can see several branches" from "has selected several branches".**
It used one blurred phrase throughout — *"in view"* and *"in scope"*:

- Option A: *"whenever more than one location **is in view**, and disappears when only one is"*
- Context: *"the column appears when you are looking at more than one location"*
- Context: *"even when you have every location **in view**"*

**Chris introduced the two-condition distinction himself, unprompted.** Because our option set had no
slot for it, he had to improvise the whole rule in a free-text box — and **we never handed him the one
state where the distinction bites**, so nothing in the question forced him to be precise about it.
Had option A or B named "a manager who can see three branches but is looking at one", there would be
nothing to ask today.

**The honest framing for the QA lead:** the question was well-formed, so there is nothing to apologise
for in *what we asked*. What we can fairly own is *what we did not ask* — we never put the one state
that matters in front of him. **The follow-up sheet therefore asks him only about that one state, as a
plain A/B, so this cannot happen a third time.**

### One point in HIS favour, recorded so the QA lead is not blindsided

The bracket exists at all only if requirement 1 alone gates the entry's existence. **If both
requirements gated it, the bracket would be redundant** — failing requirement 1 already fails "the
above". So the more probable intention is the second reading (the entry is offered to anyone with
access to several branches, and merely starts switched off).

**We have NOT resolved it on that reasoning, and no case has been changed on it.** It is an inference
about what he meant, and Standing Rule 12 does not let an inference stand in for an answer — especially
when the unclosed bracket suggests the sentence was unfinished. **We report the probable reading; we ask
him to confirm it.**

---

## (e) EVERY CASE AFFECTED EITHER WAY — and which are NOT actually blocked

### How the population was searched (Standing Rule 50 — exhaustive, no sampling)

- Pulled **live from TestRail, read-only**, on 2026-08-05: `get_sections` + `get_cases` for project 1 /
  suite 1, then filtered to the **96 sections** under group **4281 "Reports Suite"**.
- **474 cases** live under that group. **Minus 5** authored by Vladimir Tomovic (C38919–C38923 — hands
  off, excluded from our counts, Standing Rule 38) = **469 ours**. This matches the count independently.
- Searched **all 469** — title, preconditions, steps and expected results of each — with a
  case-insensitive regex for `location`, then narrowed to the cases where a location-bearing line also
  mentions the column selector / picker / column-selection control. **139 cases mention a location at
  all; 21 mention it alongside the column selector.** Every one of the 21 is verdicted below, plus the
  6 location-*filter* cases, which are a different control and are covered by his separate answer.
- **47 cases carry the "DO NOT AUTOMATE YET" line today** — counted live, and the frozen/live column
  below is read from that same live pull, not from a local copy.

### The two readings, named

- **Reading A — "both conditions gate the option":** the Location entry exists in the column list only
  when the user has access to several branches **and** has selected several.
- **Reading B — "access alone gates the option":** the Location entry exists whenever the user has
  access to several branches; it merely starts switched **on** when several are selected and **off**
  when one is.

### Group 1 — GENUINELY BLOCKED (11 cases): the two readings need different words

| # | Case | Live/frozen | The line at issue, verbatim | Under Reading A | Under Reading B |
|---|---|---|---|---|---|
| 1 | **WIP-COL-02** = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | FROZEN | "3. Location IS offered in the column-selection control, between VIN and Advisor, and is off by default." | **Wrong** — on a first visit only one branch is selected, so the entry must be **absent** from the list | **Right exactly as written** — only line 4's note ("does NOT appear on its own") needs deleting |
| 2 | **IV-COL-04** = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | FROZEN | "4. Location is one of the columns in the column-selection control; when it is turned on the Location column shows between Vendor and Qty." | **Wrong** — first visit = one branch selected, so no entry | **Right as written**, plus a line for the several-branches default |
| 3 | **PV-COL-02** = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | **LIVE** | "3. When more than one location is in scope the automatic Location column shows as well … It is not part of the 14-column default set and **is not in the column picker**" | *"not in the column picker"* is **wrong under both**; and on the first-visit state the entry must be **absent** | *"not in the column picker"* still **wrong**; on first visit the entry is **present and off** |
| 4 | **IV-COL-01** = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | FROZEN | "4. Location is one of the columns in the column-selection control; when it is turned on the Location column appears between Vendor and Qty, left-aligned." — with precondition "**a single location in scope**" | **Contradictory** — you cannot turn on an entry that is not offered at single scope; the case needs a multi-branch selection added | **Right as written** |
| 5 | **SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | FROZEN | "5. Location is NOT offered in the column selector…" and "6. With a single location in scope the Location column is hidden" | line 5 wrong; line 6 **stays true** (no entry ⇒ no column) | line 5 wrong; line 6 needs **"unless you switch it on yourself"** |
| 6 | **SBR-LOC-05** = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | FROZEN | "7. With a single location in scope the Location column is hidden." | **stays true as written** | needs **"by default — you can still switch it on"** |
| 7 | **PV-FILT-14** = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | **LIVE** | "4. Location is NOT one of the 20 columns in the picker…" and "5. With a single location in scope the Location column is hidden." | line 4 wrong; line 5 stays true | line 4 wrong; line 5 needs the "by default" qualifier |
| 8 | **TU-LOC-06** = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | **LIVE** | "6. Location is never listed in the Column Selection control…" and "7. With a single location in scope the Location column is hidden." | line 6 wrong; line 7 stays true | line 6 wrong; line 7 needs the qualifier |
| 9 | **WIP-FLT-09** = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | FROZEN | "4. The column does not appear or disappear on its own when you change the location selection - it follows the column-selection toggle only." | wrong; and narrowing to one branch **removes the entry** | wrong; narrowing to one branch **keeps the entry and switches the column off** |
| 10 | **IV-LOC-06** = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) | FROZEN | "4. Location IS one of the columns offered in the column-selection control - its visibility follows that toggle, not the location selection." | wrong; entry disappears at single scope | wrong; entry stays at single scope |
| 11 | **TU-EXP-04** = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) — **second assertion only** | **LIVE** | "…With a single location in scope there is no Location column, and that is also correct." | **stays true** | needs **"unless you switch it on"** |

### Group 2 — NOT BLOCKED: wrong under BOTH readings, so the fix is identical and can be made now (5 assertions across 5 cases)

**This is the group the QA lead most needs. These are being held — or in three cases are live and
unwarned — for an answer that cannot change what they should say.**

| # | Case | Live/frozen | The line, verbatim | Why both readings agree it is wrong | The fix, identical either way |
|---|---|---|---|---|---|
| 1 | **TU-HRS-02** = [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | **LIVE** | "6. When more than one location is in scope the automatic Location column also appears, leftmost before Technician — **it is not in the Column Selection control** and its presence is expected." | Both readings put the entry **in** the control for a multi-branch user. The state described (several branches selected) is one both readings agree on: the column is on by default. | Delete *"it is not in the Column Selection control"*. Keep everything else. |
| 2 | **TU-EXP-04** = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) — **first assertion** | **LIVE** | "6. …the files also carry a Location column **even though it is not in the Column Selection control**." | Same as above | Delete *"even though it is not in the Column Selection control"*. (Its second assertion **is** blocked — Group 1 row 11.) |
| 3 | **WIP-EXP-02** = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | **LIVE** | "5. …the file carries the location column only when you have switched Location ON in the column-selection control - **it does not appear just because you have more than one location selected**." | Both readings say several branches selected ⇒ the column is **on by default**. The sentence denies exactly that. | Rewrite to: it appears by itself when several branches are selected, and can be switched off. |
| 4 | **IV-EXP-02** = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | FROZEN | "5. …the files carry the Location column when Location is turned ON… **It does not appear just because you have more than one location selected.**" | Same as above | Same as above |
| 5 | **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) — **precondition, not expected result** | FROZEN | precondition "4. Location is turned ON in the column-selection control (**it is off by default**)." | Both readings say it is **on** by default once several branches are selected | Drop the parenthetical, or qualify it with the branch selection. **Its expected result — the column ORDER — needs no change under either reading.** |

### Group 3 — NOT AFFECTED: the same expected result under both readings, no change needed (9 cases)

Quoted, because a bare "not affected" is unfalsifiable (Standing Rule 45(e)).

| Case | Live/frozen | Its own words | Why neither reading touches it |
|---|---|---|---|
| **IV-PERS-02** = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) | FROZEN | "1. Whatever columns are shown, they appear in the fixed left-to-right order - with Location, **when it is turned on** in the column-selection control, between Vendor and Qty … toggling visibility never reorders columns." | The claim is about **order**, and it is already written conditionally ("when it is turned on"). His rule changes **whether** the column shows, never **where**. |
| **WIP-PERS-03** = [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | LIVE | "1. On return and after a reload, the report restores the saved date range, advisor selection, customer selection, asset selection, location selection, **column selection**, and active tab." | It restores "column selection" generically — true under both readings. **Whether the Location switch itself is remembered is a separate unanswered question** (carried to the follow-up sheet as question 2). |
| **IV-PERS-03** = [C30581](https://shopview.testrail.io/index.php?/cases/view/30581) | LIVE | "1. On return and after a reload, the report restores the saved date range, category selection, vendor selection, part search text, location selection, **column selection**, and sort." | Same as above |
| **TU-NAV-03** = [C30394](https://shopview.testrail.io/index.php?/cases/view/30394) | LIVE | "3. The location filter defaults to the user's currently active location…" | About the branch **chooser's** default, not the column. **It is the evidence that the ambiguous state is the default state** — see (c). |
| **TU-VIS-01** = [C30447](https://shopview.testrail.io/index.php?/cases/view/30447) | LIVE | "2. The toolbar controls run, left to right: the three-dot download menu, the Column Selection control, the date-range picker, the technician filter, and the Location filter (rightmost)." | About where the **controls** sit on the toolbar, not what is inside the column list |
| **SBC-MOB-01** = [C30188](https://shopview.testrail.io/index.php?/cases/view/30188) | LIVE | "1. Try each toolbar control by touch: date range, Product Type, the Customer filter, location, the overflow menu, and **the column selector**." | Checks that the control **works on touch**; asserts nothing about its contents |
| **SBR-MOB-01** = [C30302](https://shopview.testrail.io/index.php?/cases/view/30302) | LIVE | "1. Find and operate each toolbar control by touch: the ⋯ exports, **the column selector**, the Show Unassigned toggle, the date range picker, Product Type, Invoice Status, and Location." | Same as above |
| **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) — **expected result** | FROZEN | "1. The columns appear in this order: WO #, Status, Customer, Asset, VIN, Location, Advisor, …" | An **order** claim. (Its precondition is Group 2 row 5.) |
| **PV-COL-02** = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) — **lines 1–2** | LIVE | "1. With a single location in scope exactly these 14 columns show…" / "2. The other 6 columns start hidden…" | The 14-column default and the 6 hidden ones are untouched by his rule. (Line 3 is Group 1 row 3.) |

### Group 4 — the branch CHOOSER, not the column: a different control, already answered (6 cases)

Recorded so nobody conflates them. All six are **frozen today** and all six are released by his
**separate** answer to item 2.0 of tab 2 (**B — hide it**), with **no wording change**:

**SBC-LOC-01** = [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) ·
**SBR-LOC-04** = [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) ·
**PV-FILT-13** = [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) ·
**TU-LOC-05** = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) ·
**WIP-FLT-06** = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) ·
**IV-LOC-04** = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577)

### The count that matters

| | Count |
|---|---|
| Cases whose location line mentions the column selector | **21** |
| **Genuinely blocked by the contradiction** (readings differ) | **11** — 6 frozen, **5 live** |
| **NOT blocked** — wrong under both readings, fix is identical, correctable today | **5** — 2 frozen, **3 live** |
| **Not affected** — same expected result under both readings | **9** |
| The branch chooser (different control, already answered) | 6 |

**Two honest notes on how this compares with `DELTAS.md`:**

1. **`DELTAS.md` lists seven live-and-wrong cases; we make it eight.** **PV-COL-02** =
   [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) is live today and its line 3
   says the Location column *"is not in the column picker"* — wrong under **both** readings. It is not
   in `DELTAS.md`'s section 6 list. **It should be.**
2. **`DELTAS.md` records WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466)
   as "NO CHANGE".** Its **expected result** genuinely needs none. Its **precondition 4** says Location
   *"is off by default"*, which both readings contradict once several branches are selected. A small
   thing, but it is a thing.

---

## (f) THE DEVELOPER TICKET THAT CANNOT BE WRITTEN

**The ticket:** **B4** in `build/report-suite/chris-answers-2026-08-05/DELTAS.md` §10 — *"The location
column does not follow his C1/C2/C3 rule on Work In Progress or Inventory Value"*. It is **not filed**;
filing needs the QA lead's go-ahead, and when authorised it would be parented to epic
[SV-8582](https://shopview.atlassian.net/browse/SV-8582), linked to its owning story, and filed at
priority **Low** (Standing Rules 52 and 53).

**Why it cannot be written yet, in one line:** a defect ticket has to state the **correct** behaviour,
and the state a developer must code first is the **default state of every report** — a user with access
to several branches looking at one — which is precisely the state his two half-sentences answer
differently.

**The exact sentence that is missing.** One of these two, in his words:

> **Either:** "For a user who has access to more than one branch but has selected only one, the
> Location option is **not** shown in the column list."
>
> **Or:** "For a user who has access to more than one branch but has selected only one, the Location
> option **is** shown in the column list, switched off, so they can switch it on if they want."

**What else is waiting on that same sentence:**

- **Two new tests cannot be authored** — `DELTAS.md` **N1** (a person with access to one branch must
  never see the Location option) and **N2** (this exact state). N1 is authorable now; **N2 is not**.
- **11 cases stay frozen or live-and-wrong**, listed in Group 1 above.
- **A second, smaller sentence is also missing** (`DELTAS.md` **U2**): if someone switches the Location
  column off by hand, does it stay off next time they open the report? Two live persistence cases —
  **WIP-PERS-03** = [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) and
  **IV-PERS-03** = [C30581](https://shopview.testrail.io/index.php?/cases/view/30581) — restore
  "column selection" generically and stay true either way, so nothing is wrong today; but no test
  covers the new switch's memory, and none can be written without his answer.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last updated | Checked | Verdict |
|---|---|---|---|---|
| **Our question sheet** | `chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx` | 24 items, 4 tabs | 2026-08-05, read cell by cell | **CURRENT** |
| **Chris's returned answers** | `chris-answers-2026-08-05/source/…_2026-08-05.xlsx`, sha256 `6da7321525…` | 15 of 24 answered | 2026-08-05, read cell by cell | **CURRENT** — newest authoritative product source |
| **Our 469 cases** | TestRail project 1 / suite 1 / group 4281 | live | 2026-08-05, read-only `get_sections` + `get_cases` | **CURRENT** — 474 live, minus 5 foreign = 469 ours; 47 frozen |
| **Work In Progress description** | Confluence page 703660034 | **version 6**, 2026-07-29T06:33:58Z | 2026-08-05, fetched live | **STALE against his answer** — S4-R3 still says the column *"is not offered in the column selector"* |
| **Inventory Value description** | Confluence page 720142338 | **version 3**, 2026-07-29T06:32:54Z | 2026-08-05, fetched live | **STALE against his answer** — same |
| **The build** | `sv8582.qa.shopview.com`, `v3.4.1-3d03023` as last observed 2026-08-04 | not re-read this pass | — | **NOT OBSERVED THIS PASS.** No application was opened. Nothing here is a fresh live observation, and the Rule-49 re-check queue `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN** |

**Honest limits.** No live build check was made, so every "live/frozen" flag comes from TestRail and
every behaviour statement comes from the documents. Whether the product today offers the Location entry
at single scope is **not known from this pass** — and it is worth saying that even a live look would not
settle the question, because what is missing is what the behaviour **should** be, not what it **is**.

---

## What is ready

**`Follow-up-Question-for-Chris-Ward_2026-08-05.md` / `.xlsx`** in this folder — the clarification sheet,
mirroring the 2026-08-04 sheet's format exactly, with this contradiction as its first and most urgent
item.

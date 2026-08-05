# Chris Ward's answers — INGESTED VERBATIM

**Report Suite (epic SV-8582) · PO Chris Ward · ingested 2026-08-05**

This file records **exactly what Chris wrote**, nothing interpreted. Every answer below is
copied character-for-character out of his returned spreadsheet. Where his wording is
ambiguous that is said plainly and the ambiguity is carried into `OUTSTANDING.md` — it is
never resolved by guessing.

## How the file was obtained

| Step | Result |
|---|---|
| (a) `…/export?format=xlsx` | **WORKED — HTTP 200**, 32,088 bytes, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, genuine Excel 2007+ container. No sign-in required. |
| (b) `format=csv` | not needed — (a) succeeded |
| (c) WebFetch on the edit URL | not needed — (a) succeeded |
| (d) repo search for an uploaded copy | not needed — (a) succeeded |

**Saved as the source of record:**
`build/report-suite/chris-answers-2026-08-05/source/Chris-Ward-ANSWERED_Report-Suite_Questions-and-Decisions_2026-08-05.xlsx`
sha256 `6da732152589a31b842adf6e1a16549c3fce0dd0ca0c4da0e5792aac924993cd`

Shared link the QA lead gave us: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true

**The workbook he returned carries the three reader tabs only.** Our QA-only mapping tab
(`QA internal - not for Chris`) is absent from his copy, which is correct — it was never
meant to go to him. The three reader tabs and their item numbering are otherwise identical
to the sheet we sent, so every answer maps back cleanly.

## The count

| | Count |
|---|---|
| Items we asked | **24** |
| **Answered** | **15** |
| **Left blank** | **9** |

All 9 blanks are on tab 3, items 6.0–14.0 — the block headed *"THINGS THAT ONLY NEED
WRITING DOWN (NO DECISION NEEDED)"*. Every one of them asks him to correct a written
description. **That is exactly consistent with what he told the QA lead:**

> "Got the answers in there now -- just haven't done any of the updates you separated"

## THE CRUX — his answers are ahead of every specification

We checked all six Confluence descriptions live today. **Not one has moved.** They sit at
exactly the versions our baseline already held. So under **Standing Rule 32** (the most
recent authoritative product source wins) **his answer sheet is now the authority and all
six specifications LAG it.** Every case that follows an answer below must therefore cite
**his file**, and must not claim plain specification agreement (**Standing Rule 54**).

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last updated | Checked | Verdict |
|---|---|---|---|---|
| **Chris Ward's answers** | Google Sheets `1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY` | returned with 15 of 24 answered; retrieved 2026-08-05 | 2026-08-05 (downloaded live) | **CURRENT** — this is the newest authoritative product source for the suite |
| **Our question sheet** | `chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx` | 24 items, 3 reader tabs + QA tab | 2026-08-05 (read) | **CURRENT** — item numbering matches his return 1:1 |
| **Sales By Customer description** | Confluence page 577634305 | version 13, last changed 2026-07-31 | 2026-08-05 (read live) | **STALE against his answers** — version unchanged; his decisions are not written into it |
| **Sales By Representative description** | Confluence page 585629698 | version 15, last changed 2026-07-29 | 2026-08-05 (read live) | **STALE against his answers** — version unchanged; his decisions are not written into it |
| **Parts Velocity description** | Confluence page 620888066 | version 4, last changed 2026-07-29 | 2026-08-05 (read live) | **STALE against his answers** — version unchanged; his decisions are not written into it |
| **Technician Utilization description** | Confluence page 641400833 | version 5, last changed 2026-07-29 | 2026-08-05 (read live) | **STALE against his answers** — version unchanged; his decisions are not written into it |
| **Work In Progress description** | Confluence page 703660034 | version 6, last changed 2026-07-29 | 2026-08-05 (read live) | **STALE against his answers** — version unchanged; his decisions are not written into it |
| **Inventory Value description** | Confluence page 720142338 | version 3, last changed 2026-07-29 | 2026-08-05 (read live) | **STALE against his answers** — version unchanged; his decisions are not written into it |
| **Epic SV-8582** | Jira epic, hierarchy level 1 | 102 children: 97 Story + 5 Bug | 2026-08-05 (read live, Rule 37 Tier 1) | **CURRENT** — story set unchanged; see the movement note below |
| **Engineering tech plan** | `build/report-suite/tech-plan-2026-07-29/` | as supplied 2026-07-29 | 2026-08-05 (repo) | **CURRENT** — no newer version offered |
| **Designs** | none exist for this project | n/a | 2026-08-05 | **ABSENT** — spec-only project; no Rule-35 fetch queue applies |
| **QA branch / build** | `sv8582.qa.shopview.com` | `v3.4.1-3d03023` as last observed 2026-08-04 | not re-read this pass | **PARTIAL / PROVISIONAL** — the branch was declared NOT FINAL, the Rule-49 queue `viu-2026-08-03/RECHECK-QUEUE.md` is **OPEN**, and this pass performed **no live build observation at all** |

**Honesty on the build:** this was a documents-and-TestRail pass. We did **not** open the
application. Nothing below is a fresh live observation, and no verdict here upgrades any
earlier provisional finding (Rules 12, 22, 49).

### Epic movement since our 2026-08-04 ingest (Rule 37 Tier 1)

Verified **two independent ways** — `parent = SV-8582` and `"Epic Link" = SV-8582` — both
returned **102** children and the two key sets are **equal in both directions**, with no
paging remainder.

- **Story set UNCHANGED:** the same 97 stories, no additions, no removals.
- **10 Sales-By-Representative stories moved `Open` → `In Progress`** (SV-8590 … SV-8599).
  A status move only — no requirement text changed, so **no case is affected**.
- **5 Bug children now hang off the epic** (SV-8818, SV-8819, SV-8820, SV-8821, SV-8823) —
  these are our own defect tickets, correctly parented per Standing Rule 52.
- **⚠️ SV-8821 now reads `OBSOLETE`.** Our record says it was deliberately kept **Open**
  because that failure also happens through the product's own screen (Rule 51). The status
  moved without any action of ours. **Per Standing Rule 53 that is read as the QA lead's own
  triage and has NOT been touched or reversed** — it is reported here and in `OUTSTANDING.md`
  as a question, not corrected.

---

## THE ANSWERS, VERBATIM

Each block gives the question as he read it, then his answer exactly as typed. Line breaks
inside his answers are his own.

### Tab 1 — "Urgent - Location column"

#### Item 1.0 — The location column - should it appear on its own, or does the user switch it on?

*Status:* **ANSWERED**

**The question he was asked:**

> Which behaviour should all six reports use for the location column?

**His answer, verbatim:**

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

### Tab 2 — "The product vs your write-up"

#### Item 1.0 — The location chooser is still shown to someone who only has one location - on all six reports

*Status:* **ANSWERED**

**The question he was asked:**

> We gave a person access to exactly one location, signed in as them, and opened all six reports on 3 August. The location chooser was still on screen on every single one of the six.
>
> The location COLUMN is a separate thing and it behaves correctly: on Sales By Customer and Sales By Representative the column was properly absent for that person.
>
> So the product is following the four written lines above, not your ruling.

**His answer, verbatim:**

```
B) (answered in sheet: "Urgent - Location column")
```

#### Item 2.0 — On Work In Progress the machine is still identified by its unit number first, not its vehicle number

*Status:* **ANSWERED**

**The question he was asked:**

> On 3 and 4 August the machine's cell showed the unit number first, in bold, with the vehicle number underneath it in smaller grey text - for example 6548 on the top line and 1FDSE3EL1EDB20609 underneath. Sorting on that column also used the unit number.
>
> So the product is following the written line above, not your ruling.
>
> One thing worth knowing before you decide, because it is your own point back to you: you told us "we just have to be careful with using the acronym VIN ... it stands for VEHICLE identification number. So for a generator for example, it gets confusing when we say VIN rather than serial #." That is already happening in the real data. The field labelled as the vehicle number is holding serial-number-style values for things that are not vehicles - live examples we read include BULK PARTS1, 12-06696 and P631627 - sitting alongside genuine 17-character vehicle numbers like 1FDSE3EL1EDB20609.

**His answer, verbatim:**

```
B) this is visually appealing, and already built. This looks right.
```

#### Item 3.0 — The Sales By Representative downloads say "Representative" - a third spelling

*Status:* **ANSWERED**

**The question he was asked:**

> The file that actually downloads says neither of those. Read straight out of the downloaded summary file on 3 August, the first column heading is simply:
>
> Representative
>
> So three different words are in play: your document says "Sales Rep", your ruling says "Sales Representative", and the product says "Representative". The same single word is used in the detailed download too.

**His answer, verbatim:**

```
A)
```

#### Item 4.0 — Four columns are missing from the Sales By Representative summary download

*Status:* **ANSWERED**

**The question he was asked:**

> We downloaded the file on 3 August for a single location. It has nine columns, and this is the heading line read straight out of the file:
>
> Representative, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal
>
> Four are missing: # Invoices, # Customers, Hrs Worked and Hrs Invoiced.
>
> The figures themselves are not missing - the information the screen is built from does carry the invoice count and both hours figures. It is only the download that is short. That is why we read this as an unfinished download rather than missing data.

**His answer, verbatim:**

```
A)

Further context -- on-screen should match download :).
```

#### Item 5.0 — The date chooser offers nine choices and has no "Custom" option

*Status:* **ANSWERED**

**The question he was asked:**

> The chooser we opened on 3 August offers nine, and they are not those nine. Read off the screen, in the order shown:
>
> Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week
>
> Beside them it shows a month calendar you click dates on, a live readout of how many days your range covers (it read "Range: 3 days" when we looked) and an Apply button. There is no Today, no Yesterday, and no item called Custom - you build your own range by clicking the calendar instead. "All Time" is correctly not offered.
>
> Two things you should know. First, this is ONE shared chooser used by all six reports, so whatever you decide here lands on every one of them. Second, one of our tests cannot be run at all today, because it tells the tester to click "Custom" and there is nothing to click.

**His answer, verbatim:**

```
A) This was purely unintentional -- the original datepicker is 
the intentional one.
```

#### Item 6.0 — The Technician Utilization download menu has four options, all worded differently

*Status:* **ANSWERED**

**The question he was asked:**

> The menu we opened on 3 August has four options, and not one of them is worded that way. Read straight off the screen, exactly as they appear:
>
> "Summary (PDF)" · "Summary (CSV)" · "Expanded (PDF)" · "Expanded (CSV)"
>
> So there is one more spreadsheet option than the write-up describes, and the word "Download" is missing from the front of all four.
>
> For comparison, Sales By Customer and Sales By Representative both show the longer wording, and it matches their own write-ups exactly: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)". So this report is the odd one out rather than the whole set being different.

**His answer, verbatim:**

```
B) is correct here. Consistency is key.
```

#### Item 7.0 — The Inventory Value spreadsheet carries an "As of" line that no write-up asks for

*Status:* **ANSWERED**

**The question he was asked:**

> The spreadsheet has it anyway. The very first line of the downloaded file, read on 3 August, is:
>
> "As of: 2026-08-03"
>
> with the locations line directly beneath it. The printable download carries the same information but words it slightly differently - it reads "As of 2026-08-04", with no colon. (The two dates differ only because we downloaded the two files on different days; the wording is the difference, not the date.) So the line is in both files, only one of them is written down, and the two are punctuated differently.

**His answer, verbatim:**

```
A)
```

#### Item 8.0 — Four write-ups still say each report needs its own separate permission

*Status:* **ANSWERED**

**The question he was asked:**

> The product already does exactly what you ruled. Checked on 3 August, and proven both ways round:
>
> There is exactly ONE reports permission in the whole product, and no per-report one exists anywhere in the list a manager picks from.
>
> A person whose entire set of permissions was eight - including that one reports permission, and no report-specific permission at all - could open and download all six reports.
>
> A person without that one permission was refused all six, both on screen and on download.
>
> So nothing needs deciding. It is only the four written lines that still disagree, which makes it look to an outside reader as though our tests are wrong.

**His answer, verbatim:**

```
A)
```

#### Item 9.0 — Print has gone from the product everywhere - two of your lines and one open job still describe it

*Status:* **ANSWERED**

**The question he was asked:**

> We searched every download menu, button and link on all six reports on 3 August. There is no Print anywhere in the product. That matches your decision to retire it, so the product is right and our tests already assume it is gone.

**His answer, verbatim:**

```
Love this flag. Intentionally dropped :). Great call-out!
```

### Tab 3 — "Questions and things to note"

#### Item 1.0 — The Sales By Representative download columns contradict each other

*Status:* **ANSWERED**

**The question he was asked:**

> Which one is right - should the downloads include the location column whenever it is showing on screen, or should they always show the same fixed set of columns?

**His answer, verbatim:**

```
A
```

#### Item 2.0 — Have the six descriptions been updated to match your video and your answers yet?

*Status:* **ANSWERED**

**The question he was asked:**

> Will the descriptions be updated to match your answers, or should we simply keep testing to your answers and treat the written text as out of date?

**His answer, verbatim:**

```
A
```

#### Item 3.0 — Where the location column goes in the shorter "Summary" downloads

*Status:* **ANSWERED**

**The question he was asked:**

> In the shorter Summary downloads, where should the location column sit?

**His answer, verbatim:**

```
A
```

#### Item 4.0 — "The same logo treatment" - the three descriptions describe three different rules

*Status:* **ANSWERED**

**The question he was asked:**

> Which single rule should every report's printed download follow?

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

#### Item 5.0 — Which Sales By Customer features were dropped - we need the list

*Status:* **ANSWERED**

**The question he was asked:**

> Which dropped features did you mean - the five we found, or others we have not been told about?

**His answer, verbatim:**

```
A
```

#### Item 6.0 — Technician Utilization sits BELOW the existing menu links

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Will you add that wording?

**His answer:** *(the cell is empty — he did not answer this one)*

#### Item 7.0 — Sales By Customer: the menu group and which links it sits below

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Will you add the group and the placement to the Sales By Customer description?

**His answer:** *(the cell is empty — he did not answer this one)*

#### Item 8.0 — The asset chooser on Work In Progress: normal ShopView style, with a select-all

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Will you add it to the description?

**His answer:** *(the cell is empty — he did not answer this one)*

#### Item 9.0 — "Representative" written out in full, everywhere

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Will you change those to the full word?

**His answer:** *(the cell is empty — he did not answer this one)*

#### Item 10.0 — Parts Velocity is described as the "only" report in the Parts group

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Will you correct it?

**His answer:** *(the cell is empty — he did not answer this one)*

#### Item 11.0 — The Escape key on the "deactivate a representative" pop-up

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Will you correct that line?

**His answer:** *(the cell is empty — he did not answer this one)*

#### Item 12.0 — The "too big to download" limit is missing from three descriptions

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Will you add the limit and the message wording to those three?

**His answer:** *(the cell is empty — he did not answer this one)*

#### Item 13.0 — A note that "VIN" also covers machines that are not vehicles

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Will you add a short note to the descriptions?

**His answer:** *(the cell is empty — he did not answer this one)*

#### Item 14.0 — Some odd characters appear in two of the descriptions

*Status:* **LEFT BLANK — no answer**

**The question he was asked:**

> Would you tidy those up next time you are in the documents?

**His answer:** *(the cell is empty — he did not answer this one)*


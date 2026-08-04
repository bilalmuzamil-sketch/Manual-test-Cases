# RULING 3 — the Inventory Value spreadsheet: answering the QA lead's condition · 2026-08-04

**His words, verbatim:** *"Money arrives as text if that still shows the amount in number and that
amount is correct then its good to stay closed."*

Two separate questions live inside that sentence, so they are answered separately below. Then the
**second half of the same ticket** — the export ignoring the chosen columns and re-ordering them — is
settled, with a recommendation and **nothing filed** (the ask comes to him first).

**Ticket:** [SV-8823](https://shopview.atlassian.net/browse/SV-8823) — read live 2026-08-04: status
**OBSOLETE**, resolution **Done**, priority **Low**. Source write-up:
`../defect-pack-2026-08-04/TICKET-6-inventory-value-export-formatting.md`.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / marker | Checked | Verdict |
|---|---|---|---|---|
| IV spec | Confluence **720142338** | **version 3**, 2026-07-29T06:32:54Z | 2026-08-04 live | **CURRENT** |
| Live build | `sv8582.qa.shopview.com` | **`v3.4.1-0ed4433`** — re-read at the start of this pass, **unchanged** from 2026-08-03 | 2026-08-04 | **PARTIAL — declared NOT FINAL (Rule 49)** |
| Jira | SV-8823 | OBSOLETE / Done / Low | 2026-08-04 live | **CURRENT** |

Every finding here is **PROVISIONAL** per Rule 49 and belongs to the OPEN re-check queue
`../viu-2026-08-03/RECHECK-QUEUE.md`.

## The exact data used (Standing Rule 50 — an unnamed variable is an unverified variable)

`GET /api/reporting/reports/inventory-value/export?format=csv&range=custom&start_date=2026-08-01&end_date=2026-08-04`
— admin session, organisation `d55bc308-e61a-438d-b5f1-c7a73c89d49f`, location **Staging Heavy Duty -
9919** (`b3c8c820-f815-4cf1-8938-10956c5ee71a`), no category/vendor/search filter, default sort.
**5,657 part rows + 1 Totals row**, 724,109 bytes, `text/csv; charset=UTF-8`,
sha256 `b9baca78…4127561e`. The file itself is kept at
`evidence/ruling3-iv-export/inventory-value-export-2026-08-04.csv.gz`; a readable extract is at
`evidence/ruling3-iv-export/sample-first-20-rows.csv`.

---

# PART A — "does it still show the amount, and is the amount correct?"

## **YES to both. The amount is fully visible and it is exactly right.**

Here are the actual values, straight out of the file:

| Part # | Unit Cost | Unit Sell | Total Cost | Total Sell | Margin | Margin % |
|---|---|---|---|---|---|---|
| R134A | `$14.21` | `$21.86` | `$11,176.88` | `$17,193.98` | `$6,017.10` | `35.0%` |
| W4707QP | `$41.46` | `$94.33` | `$10,157.70` | `$23,110.85` | `$12,953.15` | `56.1%` |
| W3600AX | `$63.48` | `$140.89` | `$7,744.56` | `$17,188.58` | `$9,444.02` | `54.9%` |
| KL-HD2590 | `$9.77` | `$16.02` | `$6,096.48` | `$9,996.48` | `$3,900.00` | `39.0%` |
| 14-145 | `$564.48` | `$818.10` | `$5,644.80` | `$8,181.00` | `$2,536.20` | `31.0%` |
| **Totals** | | | **`$485,542.18`** | **`$860,189.30`** | **`$374,647.12`** | **`43.6%`** |

**Nothing is missing, nothing is truncated, no value is blank, and no digit is wrong.** The number is
right there in the cell — `$11,176.88` is eleven thousand one hundred and seventy-six dollars and
eighty-eight cents, exactly as the screen shows it.

## And "correct" is not an impression — it was checked on every single value

**33,942 money and percentage cells across all 5,657 rows were compared, one by one, against the
figures the report's own server returns for the same view. 33,942 matched. 0 differed.** No sampling.

- The server holds money in whole cents (`total_cost: 1117688`); the file writes `$11,176.88` — the
  same number, to the cent, on every row.
- The **Totals** row matches too: server `48554218 / 86018930 / 37464712` → file
  `$485,542.18 / $860,189.30 / $374,647.12`, and quantity `63,096.08` both places.
- The arithmetic is internally consistent as well: R134A is 786.55 units × `$14.21` = `$11,176.88`,
  and `$17,193.98 − $11,176.88 = $6,017.10`, giving 35.0%.
- The 6 negative-margin parts render `-$25.74` style — minus sign, then the dollar sign — which is
  exactly what IV specification version 3 asks for (`S3-R10`).
- The 17 parts with no meaningful margin show `—`, which is what `S10-R7` asks for.

**On his condition, therefore: the amount IS shown as a number and it IS correct, so on that test the
ticket is good to stay closed.**

---

# PART B — "does it behave as a number in a spreadsheet, or land as text?"

This is the half where I have to be careful, because the original ticket **overstated it** and I am not
going to repeat the overstatement.

## What is actually in the cell — observed, on all 28,288 money cells

Every money cell is written as `$11,176.88`: a dollar sign, comma thousands separators, two decimals.
I checked the character make-up of **all 28,288** of them. The complete set of characters used is:

`$` · `,` · `-` · `.` and the digits `0`–`9`. **That is all.**

**There is no leading apostrophe, no stray space, no non-breaking space, no tab, and no hidden
character in any money cell** — those are the things that would force a spreadsheet to treat a value as
words no matter what. (Four non-breaking spaces and four tabs do exist in the file, but they are in
**part descriptions**, pre-existing data in the parts catalogue — for example `30A Maxi Blade Fuse-<nbsp>Green`
— and they have nothing to do with the money.)

## So what happens when it is opened?

**In Excel or Google Sheets set to Canadian or US dollars, `$11,176.88` is read as a NUMBER**, shown
with currency formatting — it totals, sorts and charts normally. The ticket's claim that *"spreadsheet
software reads that as words rather than numbers"* is **not right for the ordinary case**, and that
matters, because it was the main argument for the ticket's daily cost.

**Where it would genuinely break** is a spreadsheet set to a language that uses a comma as the decimal
mark (much of Europe) or a different currency symbol. There, `$11,176.88` does not parse and lands as
text.

## The honest limit on this half — say it plainly

**I could not run a real spreadsheet to prove it.** LibreOffice is installed in this environment but
cannot open any file here at all — it fails on a two-cell test CSV as well, so it is the environment,
not our export. So Part B splits into two:

- **OBSERVED, exhaustively:** the exact characters in all 28,288 money cells, and that nothing in them
  would force text in any locale.
- **NOT OBSERVED this run:** the actual behaviour inside Excel / Sheets. It is stated from the
  well-known parsing rules of those products, and it is **labelled as such rather than presented as a
  live result.**

**If he wants Part B closed on observation rather than on reasoning, the check is 30 seconds of a
human's time:** open the attached file, click a Total Cost cell, and see whether the sum box shows a
total. I would rather ask for that than dress up an inference as a test.

## The one loose thread inside Part A, recorded because it is real but small

**Margin % is rounded differently in the file than on the screen.** For part `W4707QP` the server says
`56.05`; the **file** writes `56.1%` (rounded up) and the **screen** shows `56.0%` (cut off). Same
number, two different presentations, and the file is the one that follows the spec's
round-to-one-decimal rule. It affects **17 parts** out of 5,657 and only ever by one tenth of a
percent. **Not worth a ticket on its own** — noted so nobody rediscovers it as news.

---

# PART C — the second half of the ticket: chosen columns ignored, and re-ordered

## Both symptoms are STILL TRUE on this build. Confirmed live today.

### 1. The chosen columns are ignored

Three downloads were taken with the same filters:

| Download | Result |
|---|---|
| normal download | 11 columns, 724,109 bytes |
| download asking for only Part #, Description and Qty | 11 columns, 724,109 bytes |
| download asking for a column name that does not exist | 11 columns, 724,109 bytes, **no error** |

**All three files are byte-for-byte identical** — the same sha256, `b9baca78…4127561e`. The column
choice makes no difference whatsoever, and a nonsense column name is not even rejected.

### 2. And here is WHY — which the original ticket did not establish

**The screen never tells the server which columns you picked.** In the Inventory Value report's own
code, the download request is built from exactly these things: the file format, the date range, the
categories, the vendors, the locations, the search text and the sort. **There is no column list in it
at all.** The very next line of the same component *does* save your column choice into the browser, so
the app plainly knows what you picked — it simply does not put it in the download request.

So the server cannot honour a choice it is never sent. (Separately, the server also ignores the column
list when one *is* supplied by hand — while the Work In Progress download both honours and validates
it, so the shared download machinery is capable of it.)

### 3. The order is wrong too

| | Order |
|---|---|
| **On screen** | Part # · Description · Category · Vendor · Location · Qty · Unit Cost · Unit Sell · Margin · Margin % · Total Sell · **Total Cost** |
| **In the file** | Part # · Description · Category · Vendor · Qty · Unit Cost · Unit Sell · **Total Cost** · Total Sell · Margin · **Margin %** |

**Total Cost is last on screen but 8th in the file, and Margin % ends the file.**

### The requirement this breaches — verbatim

> **IV specification version 3, `S10-R3`:** *"Both downloads include only the columns currently shown,
> in the same left-to-right order as the screen, with Total Cost last."*

That single sentence makes three promises. **The file breaks all three:** it includes columns that are
not currently shown, it does not use the screen's order, and it does not put Total Cost last.

### Is it user-facing or only reachable behind the screen?

**USER-FACING, unambiguously.** Anyone can hit it with no special tools: open Inventory Value, switch
**Margin** and **Total Sell** off in Column Selection, take the download, and both columns are still
there. **This is not an API-only defect**, so Rule 51's withdrawal reasoning does not apply to it.

### RECOMMENDATION — and nothing has been filed

**Yes, this half deserves its own ticket, and it should not have been closed with the money half.**

- The money half is genuinely fine and the QA lead's instinct on it was right — the number is there and
  it is correct.
- The columns half is a **different fault in a different place** (the screen not sending your choice,
  plus a fixed column order in the writer) and it is the half with a real, silent cost: the user's
  choice is discarded with **no message and no explanation**, and anyone with a template built around
  the screen's layout finds the file does not match.
- Suggested shape if he says yes: **Bug**, parent **epic SV-8582**, owning story **SV-8677**
  (*Inv Value - Story 10 - Export to PDF and CSV*) attached as a link, priority **Low** — never High
  (Rule 53). Paste-ready text already exists in
  `../defect-pack-2026-08-04/TICKET-6-inventory-value-export-formatting.md` sections 3–7 and needs only
  the money half trimmed out.

**Not filed. Awaiting his yes or no.**

---

## What this means for the two test cases

| Case | C-id | Position now |
|---|---|---|
| IV-EXP-02 | [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | Asserts the export honours the chosen columns and their order. **Still fails on this build.** Its expectation matches `S10-R3`, so **the case is right and the build is wrong** — no case change. |
| IV-EXP-03 | [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) | Asserts the number formats. **Money to two decimals and Margin % to one with an em-dash all PASS.** Its expected result 2 — CSV money as plain numbers with no thousands separators — has **no basis in the spec** and is what the export does *not* do. See below. |

**IV-EXP-03's expected result 2 is our own over-reach, and it should be corrected rather than reported
as a build defect.** The spec's `S10-R7` says only *"Money and Margin % use two-decimal and one-decimal
formats respectively; an undefined Margin % shows '—'"*, and `S3-R10` describes money as carrying a `$`
**and** thousands separators. **Nothing in the Inventory Value spec asks the CSV to drop them.** The
case's own references already hedge it as `(+ context note)`. Two options, and it is his call:
**(i)** drop expected result 2 as unsourced, or **(ii)** ask Chris Ward to add the rule to the spec and
keep it. **Not changed in this pass** — it sits inside the same decision as the two cases above.

---

## OUTSTANDING — what I need from you

1. **Part B, if you want it observed rather than reasoned:** open the attached spreadsheet and check
   whether a money column totals. I will not record it as verified on my reasoning alone.
2. **A yes or no on a ticket for the columns half** (chosen columns ignored + wrong order). Paste-ready;
   nothing filed. **It is user-facing, not API-only.**
3. **A decision on IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589):**
   drop its unsourced no-separators line, or ask Chris Ward to put the rule in the spec.
4. **A decision on IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588):** it
   will keep failing until the columns half is fixed. Leave it failing against an open ticket, or note
   it as known-and-accepted so a tester does not re-report it.

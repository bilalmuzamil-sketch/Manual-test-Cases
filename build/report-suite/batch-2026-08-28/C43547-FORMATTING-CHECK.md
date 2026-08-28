# C43547 — the reported formatting fault could not be reproduced, so nothing was written

**Case:** [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) — *"A large PDF download
fails outright while the CSV of the same view works"* · Parts Velocity · EXPECT-FAIL for
[SV-8818](https://shopview.atlassian.net/browse/SV-8818) · `custom_atmstatus = 1` (not Automated).

**What was asked:** repair the line breaks, words unchanged, because *"Expected Result items 1–4 have
run together into one paragraph — a tester cannot tell them apart."*

**What is actually there, observed live on 2026-08-28 (Rule 12): items 1–4 are on four separate
lines.** The fault described is not present, so **no write was made.**

---

## 1 · The evidence

The case was read on **both** surfaces a person actually uses, with a real browser, and screenshotted
(`/tmp/job828/view-43547.png`, `/tmp/job828/test-2116217.png`):

* the **case page**, `…/cases/view/43547`;
* the **tester's surface** — the test inside run **359**, `…/tests/view/2116217`.

Both render the Expected Result identically, and both show:

```
1. The CSV downloads successfully at that size.
2. The PDF also downloads successfully. If instead nothing downloads and a message appears …
3. The small PDF downloads successfully, which shows the failure depends on size.
4. Note for the tester: a very large view is refused politely with "This report is too large to …
What you should see today: the spreadsheet download works and produces a file, but the PDF …
- If you see exactly that, mark this test FAILED and do not raise anything new.
- If it fails in a DIFFERENT way from what is described above, that is a NEW problem …
- If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed …

---
This is the expected behaviour as per epic SV-8582 … specification version 10 (Story 6 exports) …
Last checked against build v3.8-d0e135e on 8/19/2026.

AUTOMATION: READY - EXPECT FAIL (SV-8818)
```

All three fields render in `markdown fr-view`; the stored body is a single `<p>` with `<br>` between
every item. The EXPECT-FAIL symptom, all three outcomes and the AUTOMATION marker are present, and
the marker is last.

## 2 · The one legibility snag that IS there — and why it was not "fixed" either

**"What you should see today"** follows item 4 after a single line break, at the same visual level as
the numbered items, so on a quick read it looks like a continuation of item 4's note rather than the
start of the EXPECT-FAIL block.

That is real, but **it is the house style, not a defect in this case.** Every EXPECT-FAIL case in the
Report Suite was checked: **11 of the 14** put a single line break before *"What you should see
today"*, exactly as C43547 does. Only **C30382** uses a blank line.

| Separator before "What you should see today" | Cases |
|---|---|
| single line break (house style) | C30290 · C30320 · C30352 · C38885 · **C43547** · C30424 · C30498 · C30587 · C30590 · C30591 · C30593 · C30595 · C43548 |
| blank line | C30382 |

Changing only C43547 would break Rule 16 (mirror the established format) and would make the suite
less consistent, not more. **So it was left alone and is raised here instead.**

## 3 · Also checked, in case the case number was a slip

Every Report Suite case that mentions **SV-8818** was checked for genuinely run-together numbered
items. **There are none** — C30290, C30320, C30382, C38885, C43547, C30587, C30590, C30591, C30593,
C30595 and C43548 all separate every numbered item with a line break.

## OUTSTANDING — what I need from you

1. **Did you mean a different case, or a different surface?** If you can say where you saw the
   run-together text (case page, a test in a run, a PDF/Excel export, a printed view), it can be
   chased down. Nothing was written in the meantime.
2. **Do you want the blank line before "What you should see today" as a suite-wide change** on all
   14 EXPECT-FAIL cases? It genuinely does read better, and doing all 14 keeps the format
   consistent. It is a formatting-only change; no words would move.
3. C43547's content **is** current against live Parts Velocity v11 (it maps to **S6-R12**) — see
   `ANCHORLESS-9-VERDICTS.md` §2. **It was not re-pinned**, because this batch said not to; say the
   word and it takes pin 10 → 11 in one edit.

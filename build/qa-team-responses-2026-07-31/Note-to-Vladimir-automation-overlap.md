> **Date:** 2026-07-31 · **Author:** QA / Claude · **Status:** DRAFT for Bilal to send

# Note to Vladimir — your 5 automated Reports Suite cases, and where they meet ours

Hi Vladimir,

I noticed the five automated cases you added in the Reports Suite sections on 30 July —
C38919 through C38923. First things first: **we have deliberately left them untouched**, and
that stays our standing position. We don't edit, move, retire or add your cases to our runs.
This note is only so you have our side of the picture and can decide what you want to do with
yours.

## Where they sit against our manual cases

I read the assertions rather than the titles, so this is factual, not a judgement on value:

- **C38920** duplicates our **C38914** — every condition your steps set up is already asserted
  there (Location hidden at a single location, "Multiple" on the merged special-order row,
  per-location names on inventory rows).
- **C38922** duplicates our **C30511** (the `Locations:` line in the download) plus our
  **C30516** (the WIP column semantics staying as shipped).
- **C38919** is an automated equivalent of our **C38859** plus **C30437** — you bundle the
  column-toggle, the reload-persistence and the export-mirrors-screen behaviours into one
  end-to-end path. That's a sensible shape for a regression run; it just isn't new coverage.
- **C38921** and **C38923** add coverage we genuinely **do not** have. C38921 pins the `As of`
  metadata line inside the CSV and its position above the header row — we had deliberately
  left the position open. C38923 asserts the Location column reaching the SBR CSVs, which no
  case of ours claims.

## Two places where one of us is wrong about the build

These are the reason I'm writing, because a tester will hit them either way:

1. **The Column Selection menu on WIP.** Your **C38922** step 3 toggles Location on in the
   Column Selection menu. Our **C38916** asserts Location is **not offered** in that control at
   all — that its visibility follows the location scope automatically. Both can't be true.
2. **Location in the SBR CSVs.** Your **C38923** asserts the Location column reaches the SBR
   Summary and Expanded CSVs. Our **C30285** and **C30286** enumerate the CSV headers with the
   word "exactly", and that list has no Location column in it. Again, one of us is wrong.

**What source were you working from for these** — which spec version, which ticket, or a
particular build? That's the fastest way to reconcile rather than guess at it. Ours, for what
it's worth, is the SBR spec at version 15, Chris's answers from 31 July, and the engineering
tech plan — happy to share any of that if it's useful to you.

If it turns out your reading is the correct one, the fix is on our side and we'll make it.

## One small offer

Our cases each carry a requirement reference and a ticket reference in the References field;
yours currently have none. That matters only in one scenario: if your automation ends up being
the surviving coverage for a behaviour, retiring our manual case would remove the only
traceable link back to the requirement for it. If it would help, I'm happy to hand you the
exact reference strings for the behaviours yours cover so you can paste them in — purely an
offer of legwork, not a criticism of how you author.

And if these five are the start of a wider automated pass over the Reports Suite, let me know —
I'd rather aim our manual effort at what you're not covering.

Thanks,

Bilal

---

## QA-internal notes (not part of the message)

- Source of every verdict and comparison above: `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md`
  (read-only TestRail sweep, **zero writes**).
- Authorship confirmed via `get_user/1` = Vladimir Tomovic; all five created 2026-07-30 15:54 UTC,
  last updated 17:41 UTC. Project-wide he has authored 1775 cases — long-standing author, not a
  newcomer.
- Reports Suite honest phrasing stays **"ours 474 / live total 479"**. No foreign case is in run 359
  or any other run.
- Four of his five carry **no expected results**; the fifth's is a parsing artefact. So overlap was
  judged on subject + conditions + steps only — the pass criterion lives in the automation code.
  Stated as a limit, not a hedge.
- Nothing may be changed on C30285 / C30286 without the QA lead's authorization (Rule 6), and
  ideally not before the live build or Chris's ruling settles the SBR CSV question — see
  `Question-to-Chris-SBR-CSV-Location.md` in this folder.
- Case links: `https://shopview.testrail.io/index.php?/cases/view/<id>`

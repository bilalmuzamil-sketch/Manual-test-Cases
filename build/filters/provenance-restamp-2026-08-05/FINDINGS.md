# Filters — provenance re-stamp, 5 August 2026

The QA lead's ruling, verbatim:

> "at present it says something like this ' and as per the build tested on ' it should never say
> that it is an expected behavior as per the build testing because it can confuse the tester as
> well as it can raise a serious concern of the higher ups that how can something be considered as
> the expected behavior if it is happening on the build because the build can be wrong too. Yes you
> can use the builds name if you want to say that the test passed on this date through automation
> testing."

## What was actually wrong — measured, not assumed

| Finding | Count of 110 |
|---|---|
| Provenance line opened **"as per the build tested on 8/5/2026 (...), epic SV-8785 and the Filters specification ..."** — the build named FIRST, as the source | **86** |
| Of those 86, four ALSO named the build as **corroboration** inside the trailing note | **4** — C29558, C29559, C29609, C29610 |
| Already in the documents-first shape (sentence 2 needed normalising only) | 24 |
| Carried **more than one** provenance line | **0** — C29613's earlier double line has not recurred |

The four corroboration clauses are worth naming, because they are the same defect in a quieter
voice and a keyword sweep for *"as per the build"* would not have caught them:

- **C29558** — *"the specification asks only for the name and the arrow, **and the build matches the
  specification, so this test follows the specification and the build**."*
- **C29559 / C29609 / C29610** — *"**the specification and the build both hide it**, and the
  specification is the newer source, so this test follows the specification **and the build**."*

Rule 54 bars the build from sentence 1 *"not as a source, not as corroboration, not in passing"*, so
all four were reduced to the document alone. The divergence they record (an earlier answer and the
design frame said otherwise; the specification is the newer source) is **preserved in full** — only
the build's endorsement of it is gone.

## The form now on all 110

**Sentence 1 — the source. Documents only.**

> This is the expected behaviour as per epic SV-8785 and the Filters specification at Confluence
> version 18 (published 4 August 2026) (S1-R1).

**Sentence 2 — the record of checking. The build, neutrally.**

> Last checked on 8/5/2026 against build ShopView v3.4.2-d00239b on the Filters QA branch.

### What was deliberately NOT written: the word "passed"

The QA lead expressly permits naming the build to say a test passed. This pass did **not** take that
option, and the reason is honesty rather than caution:

- **only 29 of the 110 were driven live today**; the other 81 carry forward from the 04:20–04:53Z
  re-check **on the same build marker** — so the date and the marker are accurate for all 110, but a
  *verdict* claim would not be something this pass observed (Rule 12);
- the branch is **not declared final**, so every verdict is **PROVISIONAL** (Rules 49/60).

*"Last checked against"* is the most this pass can stand behind. When a full live pass does re-drive
all 110, sentence 2 can legitimately gain the pass claim.

### Where information would have been lost, it was kept

Rule 54 says sentence 2 records only that the check happened and the **deviation note carries the
failure**. That is right where a deviation note exists — but it does not on all of them:

- **16 deviation cases** keep **"; the build does not behave this way yet"**. Five of them —
  **C38879, C38896, C38883, C38884, C38898** — have **no body deviation note at all**, so the
  provenance line was the *only* prose record that the build fails. Dropping the clause to satisfy
  the letter of the rule would have destroyed information on those five, so the group keeps it.
- **8 not-built cases** (C38904–C38911 except C38882) keep **"this part of the product is not built
  yet, and the controls this test needs were looked for and were not found"** — moved out of
  sentence 1, where it read *"not as per the build"*, and into the checking sentence where it belongs.

## What survived untouched, proven

| Check | Result |
|---|---|
| Provenance lines per case | **exactly 1 on all 110** |
| Barred phrasings remaining in the 110 provenance paragraphs | **0** |
| Case body before the separator | **byte-identical on all 110** |
| Automation markers | **untouched** — 82 READY + 18 EXPECT FAIL + 10 HOLD = 110 |
| **Arithmetic gate** READY + READY-EXPECT-FAIL | **82 + 18 = 100** ✓ |
| Marker still last line, blank line before it | **110/110** |
| Rule-56 divergence paragraph | **present on C29624 and on C29624 alone** — none invented |
| Every other field vs the pre-write snapshot | **byte-identical**, 0 fields moved |

## Sources (Rules 31 + 59)

| Source | Value | Read at | Verdict |
|---|---|---|---|
| Build | `v3.4.2-d00239b`, last-mod Tue 04 Aug 2026 22:51:02 GMT, etag `b9ab1d41…` | **17:11:10Z, 17:17:26Z, 17:22:06Z** | **CURRENT** — `index.html` byte-identical all three (sha256 `d4845701337c6836…`), no redeploy under this pass |
| Specification | Confluence page 572030978, **version 18**, 2026-08-04T18:19:21.735Z, Branko Cicovic | pass start **and again at write start** | **CURRENT** — live body byte-identical to our mirror, 56983 bytes, md5 `a8d6dda9cc8a7afa6c3c08cfa51c45dc` |
| Cases | group 4110, 110 cases, every one `created_by = 3` | 17:12Z / 17:20Z | **CURRENT** — no foreign case (Rule 38) |
| Run 352 | Ahtasham Amjad, `include_all:false`, 110 tests | 17:12Z / 17:21Z | **CURRENT** — proven undamaged |

**Rule-59 second read verdict: UNCHANGED.** Both the spec version and the build marker were
re-confirmed immediately before the write phase opened, not only at pass start.

**The Rule-31(a) trap, confirmed a third time:** the page body's own *"Version: 1.6"* has not moved
while the Confluence page version is **18**. The provenance lines name the Confluence number
precisely because the in-body number lies.

## Run 352 — Ahtasham was grading while we wrote

He logged a result **during this pass** and it must never be mistaken for damage:

- **443** result records before, **444** after. **All 443 prior records present BY ID, 0 missing.**
- **0 prior records had ANY field change** — not even the declared read-time echoes `case_title` /
  `case_refs`. That is the expected outcome: no title and no `refs` was written, so there was
  nothing for them to echo.
- The **1 new record is his**: result **397789**, `user_id` **7** (Ahtasham Amjad), created
  **2026-08-05T17:21:04 UTC**, status **Passed**, test **1762333** — logged after our write phase
  closed at 17:20:21Z. His Passed count moved **41 → 42**.
- `include_all` still **false**; 110 tests; **test-id and case_id sets equal in both directions**;
  the run's case_ids **equal our 110 live cases in both directions**. No case-sync was needed.

## FOUND AND NOT FIXED — reported, per the brief

### 1. The `refs` field on all 110 cases still pins the WRONG spec version

Every one of the 110 live `refs` values ends **`[spec v1.6 2026-07-28]`**:

```
C29557  SV-8786 (S1-R1) [spec v1.6 2026-07-28]
C29558  SV-8786 (S1-R2; S1-R3) [spec v1.6 2026-07-28]
```

Two things are wrong with that, and they compound:

1. **It is the trap number.** `v1.6` is the figure written *inside* the document, which has not moved
   in eight Confluence versions. The tester-facing provenance line was corrected today to say
   **Confluence version 18**; the metadata layer still says 1.6, so **the two halves of the same case
   now disagree about which specification it was written against.**
2. **It breaks Rule 42's mechanism.** The version pin in `refs` is what connects a closed enumeration
   to the requirement whose change would invalidate it, and it is what makes Rule 28's same-anchor
   clustering work. Pinned to a version that never advances, it can never fire.

This was **not** in scope for this pass — it is a separate 110-write operation on a different field,
and `refs` was deliberately left unsent so it could be proven byte-identical. **It needs one
authorised pass.** It is also the reason the id-map's `refs` column reads 1.6: that column was
re-merged **from live**, so it faithfully mirrors the stale value rather than inventing a fresh one.

### 2. Nothing else

The whole-case sweep over all 110 found: **0** cases showing raw HTML markup to the tester, **0**
titles over 80 characters (longest exactly 80), **0** dead `blob/main` GitHub links (10 correct
`blob/HEAD` links), **0** wrong-owner `bmuzamil-shopview` links, **0** cases claiming a fault has no
developer ticket, **0** empty `refs`, and the longest `refs` entry at **241** characters — inside the
248-character pattern limit. **C29618 (FLT-URL-02)** describes SV-8845 correctly as *"reported, and
closed without a fix, so do not expect it to change"*, so the older note that two cases still called
it open no longer applies.

## Honest limits

- **This pass re-observed nothing on the application.** It is a text operation on the provenance
  layer. The build marker was read three times only to prove sentence 2's marker is the current one.
- **All 110 verdicts remain PROVISIONAL** — the branch is not declared final and the Rule-49 queue
  `final-viu-2026-08-05/RECHECK-QUEUE.md` stays **OPEN**, which under Rule 60 is now the normal
  steady state rather than a shortfall.
- **Layer statement (Rule 60(a)):** everything changed here is the **build-independent** layer —
  the Rule-54 source sentence. Layers 1–3 (labels, verdicts, build-fact markers) were **not**
  re-derived and carry their last recorded check.

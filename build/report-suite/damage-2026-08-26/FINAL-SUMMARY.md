# TestRail render damage 2026-08-26 — FINAL SUMMARY (repair complete)

**Completed 2026-08-28.** Scope, cause and the proven repair method are in `FINDINGS.md`; this file
records the FINAL outcome only.

---

## 1 · The numbers

| | Count |
|---|---|
| Cases damaged by the 2026-08-26 bulk passes | **72** |
| Repaired and verified via the TestRail UI editor | **71** |
| — of those, the pilot repaired 2026-08-26 (`C30197`) | 1 |
| — of those, repaired by the batch (`REPAIRED.jsonl`) | 70 |
| **HELD, deliberately not touched** (`C30518`, Automated) | **1** |
| Skipped for any other reason | **0** |
| Still damaged after this pass | **0** (excluding the held case) |

**71 repaired + 1 held = 72. Nothing is unaccounted for.**

## 2 · What was done in this pass

The 2026-08-26 batch died from a container restart after 58 of the 70 queued cases. This pass
resumed it and completed the remaining **12**:

`C38914 · C43557 · C43814 · C43815 · C43816 · C43817 · C43819 · C43828 · C43829 · C43830 · C43833 · C43834`

All 12 are repaired and verified. Four cases in the full set needed all three text fields rewritten
rather than just the expected result: **C30482 · C30525 · C43828 · C43830**.

## 3 · C30518 — HELD FOR VLAD, NOT REPAIRED (Rules 65 / 71)

`C30518` is flagged **Automated** (`custom_atmstatus = 3`), so it must not be changed without the QA
lead's go-ahead. **It was never opened for editing in this pass.** Confirmed live on 2026-08-28:

- `custom_atmstatus` = **3** (unchanged)
- `updated_on` = **2026-08-26 13:16 UTC** — i.e. the damaging pass; **no write since**
- Its view page still renders the `markdown` container with a literal tag visible in the expected
  result — **it is still damaged, and deliberately so.**

**OUTSTANDING: `C30518` needs Vlad's explicit go-ahead before it can be repaired.**
<https://shopview.testrail.io/index.php?/cases/view/30518>

## 4 · Verification — independent, after the fact

Beyond the per-case verification the batch performs before it checkpoints a case, an **independent
rendered-page sweep** was run over all 70 batch-repaired cases on 2026-08-28
(`/tmp/rsrepair/verify_all.mjs`, result in `VERIFY-SWEEP.json`). Per case it asserted:

1. exactly **3** anonymous `markdown*` containers on the view page;
2. every repaired field's container is **`markdown fr-view`** (renders) — never bare `markdown`
   (escapes, which is the damage signature);
3. **zero literal tags** (`<p>`, `</p>`, `<br>`, …) in the text a tester reads;
4. **zero HTML entities** (`&mdash;`, `&rsquo;`, …) visible as text;
5. the rendered text **matches the intended content** after whitespace normalisation;
6. the **AUTOMATION marker** is present exactly once and is still **last**;
7. the **provenance line** is present;
8. `custom_atmstatus` unchanged.

**Result: 70 checked, 70 CLEAN, 0 problems.** `C30197` was re-checked the same way and is clean
(all three containers `markdown fr-view`, no literal tags).

**The approved content is preserved.** The intended text came from the two independent derivations
byte-compared in `derive.py` (de-damaged live value vs. the 11:53 pre-write snapshot), so today's
approved re-pins and rewrites are kept and only the damage artefacts were removed. Content was
**pasted, never re-typed** — re-typing is what introduced curly apostrophes on the C30197 pilot.

## 5 · Two mechanical faults found and fixed in the repair script

Both were faults in `ui_repair_batch.mjs`, not in the case content. Neither ever produced a bad
write — every failure left the case **completely untouched** (checked by API re-GET before retrying:
all 6 first-round failures were still fully damaged, with no partial writes).

**(a) The save-completion check was a race.** After clicking Save the script waited a fixed 1500 ms
and then failed the case if the URL still looked like the edit page. TestRail's redirect to the view
page routinely lags `networkidle` by more than that, so **saves that had in fact succeeded were
reported as failures** (the page showed *"Successfully updated the test case."*). Replaced with a
poll for the navigation, up to 20 s.

**(b) A cached edit form silently rejected the save.** The edit form carries a one-shot token that
rotates after each successful save, so the **case immediately following a success** loaded a cached
form, POSTed a stale token, and was silently rejected — the browser simply stayed on the edit page.
This is why failures **alternated** perfectly with successes across two runs. Fixed by sending
`Cache-Control: no-cache` / `Pragma: no-cache` on the page, which forces revalidation. The save POST
status is now captured and reported in the error text so this symptom is diagnosable rather than bare.

**(c) A disabled Save button is a no-op, not a failure.** When the stored content already equals what
was pasted, TestRail disables `#accept`. The script now falls through to verification instead of
failing — verification is the real gate either way.

`FAILED.jsonl` holds **9 entries across 6 case ids**, all from causes (a)/(b)/(c). **Every one of those
6 cases was subsequently repaired and verified**, so there is no residual failure — the file is
retained as history, not as an open item.

## 6 · Outstanding — what I need from you

1. **`C30518` — permission to repair.** It is Automated (`custom_atmstatus = 3`) and is the only case
   of the 72 still carrying visible render damage. It needs Vlad's explicit go-ahead (Rules 65 / 71).

Nothing else is outstanding from this repair.

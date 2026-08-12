# FINDINGS — run sync + Automated-flag census — 2026-08-12

Both authorised jobs are complete. Nothing was stopped on. Four things are worth the QA lead's
attention: two tooling holes I closed, and two items that are **out of the scope I was given** and
are therefore reported rather than acted on.

---

## 1. Both jobs, in one line each

- **Run sync:** 357 → 176, 352 → 115, 359 → 480. **All 1,537 prior result records present by ID
  afterwards, 0 graded-field changes.** Detail in `RUN-SYNC-LOG.md`.
- **Automated flags:** 44 of our cases read `3`; **all 44 were set by Vladimir Tomovic**, so **none
  was cleared and no case was written to**. Detail in `AUTOMATED-FLAGS.md`.

---

## 2. The staged sync files were stale, exactly as they warned

Run 357's staged file recorded **458** result records; the run actually held **529**, and its
counters had moved from 25 Passed to **89 Passed / 6 Failed / 2 Blocked** — Ayesha and Mudassir have
been grading Schedule heavily. Both unions were re-derived live and neither staged list was replayed.

This did not cost anything, because the difference was in results rather than case membership, and
the executor asserts `union ⊇ current` before writing. But it confirms the instruction was right:
**a staged run-sync list is a plan, not an input.**

---

## 3. Two real holes in the Automated-flag tooling — FOUND AND CLOSED

The brief asked me to confirm the tooling can no longer flag a case Automated. It could, two ways.

### (a) The guard was failing on three false positives, so it was on its way to being ignored

`check_add_case_payloads.py` **exited 1**, reporting `FAIL — 3 NEW add_case payload(s) would flag a
case as Automated`. All three hits were **line 2 — the docstring** — of read-only history-analysis
scripts that create no cases at all (including the one I wrote for this pass).

The `ASSIGN` regex accepted a bare `=`, and its trailing look-ahead permits a comma, so ordinary
English matched: *"establish WHO set custom_atmstatus = 3, and when."*. The comment above the regex
claims the look-ahead *"keeps English sentences out"* — it does not, whenever the sentence has a
comma after the number, which is the most natural way to write it.

**This matters more than a cosmetic false positive.** A guard that fails on clean code teaches its
readers to run it, see red, and move on — and the next time it goes red for a real reason, nobody
will look. That is the one failure mode a guard cannot afford.

**Fix:** removed the bare `=` alternative, keeping `:` (quoted and unquoted, covering both Python
dicts and JS object literals) and `] =` (covering `payload["custom_atmstatus"] = 3`).
**Proven to cost no detection power:** the detected `file:line` set across the whole repo is
identical before and after **except the three prose docstrings** — every real payload in
`KNOWN_EXECUTED` still matches. **The guard now exits 0.**

### (b) The canonical builder had a bypass, reachable by the most likely spelling

`testrail_add_case.py` correctly defaults to `1` and correctly raises on `atmstatus=3`. But
`payload.update(extra)` ran **after** that check, so:

```python
add_case_payload(title="x", custom_atmstatus=3)   # -> returned 3, silently
```

`custom_atmstatus` is the **field** name — precisely the spelling someone copying a payload out of
an old exec script would reach for, since that is the key all nineteen of them use. The guard was
open to the exact mistake it exists to prevent.

**Fix:** re-validate after the merge. Both `atmstatus=3` and `custom_atmstatus=3` now raise; the
default is still `1` and a legitimate `atmstatus=4` ("Pending") still works.

---

## 4. OUT OF SCOPE — 790 of our cases outside the three active projects also read `3`

My scope was the three active projects. For completeness, the wider picture, **read-only, nothing
touched**:

| Top-level group | Our cases at `3` |
|---|---|
| Custom Roles — (Revised) | 354 |
| Test Cases | 312 |
| Fees & Discounts | 118 |
| SV-4326 — ShopCoach 2.0 | 6 |
| **Total** | **790** |

A 20-case history sample says these are **overwhelmingly Vlad's, not ours**: **19 of 20 were set by
user 1**, and **1 of 20 had no history entry** (i.e. our old `add_case` default). Extrapolated, that
is on the order of **40 cases** repo-wide that may carry our default — all in **completed or
inactive** projects (Custom Roles and Fees & Discounts are both marked COMPLETED; "Test Cases" is not
one of our three).

**Recommendation: leave it.** These projects are closed, the sample says the great majority of the
flags are legitimately Vlad's, and clearing a flag he set is worse than leaving one of ours. If the
QA lead wants it cleaned up, it is a separate authorised pass — roughly 790 history reads to
classify, then a write only to the small no-history minority. **It is a sample, not a census, and it
is labelled as one.**

---

## 5. Honest limits of this pass

- **The 790 out-of-scope cases were SAMPLED (20), not censused.** The three in-scope projects were
  done exhaustively — all 44, no sampling.
- **No case content was read or verified.** This pass changed run membership only; it makes no claim
  about whether any case is correct, current, or VIU'd.
- **`case_title` / `case_refs` echoes moved on zero records**, because no `update_case` was called.
  Had any case been written, those echoes would have moved and would need excluding from the
  untouched-run comparison (playbook §J #2 / #2b / #2c).

---

## OUTSTANDING — what I need from you

1. **The 790 out-of-scope Automated flags (item 4)** — do you want a follow-up pass to classify and
   clear the minority that are ours? My recommendation is no, because those projects are closed.
2. **Nothing else.** Both authorised jobs are complete and verified; no blocker was hit and nothing
   was stopped on.

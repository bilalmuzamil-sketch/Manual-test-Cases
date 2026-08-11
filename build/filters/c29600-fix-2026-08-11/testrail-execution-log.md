# TestRail execution log — C29600 / C29632 recording fix — 2026-08-11

**Authorised scope: `update_case` on these two cases only.**
**Executed: 2 operations, 2 cases. 0 `add_case` · 0 `delete_case` · 0 section ops · 0 run writes ·
0 results logged · 0 Jira calls of any kind.**

Harness: `/tmp/testrail/tr.py` `update_case_verified()` — snapshots the full case, writes, re-GETs,
compares **every** field against the intended payload, and proves every field the pass did not intend
to change byte-identical (Standing Rule 50). **On any mismatch it raises and the batch stops.**
Executor for this pass: `/tmp/testrail/c29600_fix.py` (dry-run first, then `--apply`).

---

## 1. PRE-FLIGHT

| Check | Result |
|---|---|
| Shape check on both payloads, **before any network write** | **PASS both.** One provenance line · one automation marker · marker is the last line · blank line before it · line break after it · provenance is the last thing before the marker · zero raw markup · `refs` comma-free and ≤ 248 chars · preconditions, steps and the assertion body byte-identical to live |
| `refs` length vs TestRail's 248-char per-comma-entry pattern limit | C29600 **246** · C29632 **212**. Both comma-free, so the declared comma normalisation is a no-op |
| **Markup census BEFORE**, all 119 Filters cases under group 4110 | **0 of 119** carry raw markup (`evidence/markup-census-BEFORE.json`) |
| Run 352 snapshot BEFORE | `include_all` **false** · **114** tests · **473** result records · counters 65 P / 7 F / 0 B / 42 U (`evidence/run352.BEFORE.json`) |
| Both cases present in run 352? | **Yes, both** — which is why the run had to be proven untouched by content afterwards |
| Sections enumerated with paging | 626 sections read in pages of 250; group 4110 subtree walked to **19** sections (the unpaged call silently returns 250 and finds zero Filters sections — playbook §J) |

---

## 2. THE TWO WRITES

| # | Op | Case | Section | **`custom_atmstatus`** | `custom_automation_type` | Fields sent | HTTP | Byte-level verification |
|---|---|---|---|---|---|---|---|---|
| 1 | `update_case` | **C29600** [link](https://shopview.testrail.io/index.php?/cases/view/29600) | 4117 | **3 — AUTOMATED** (unchanged 3 → 3) | 0 (unchanged) | `custom_preconds`, `custom_steps`, `custom_expected`, `refs` | **200** | **30 fields compared, 4 intended, 0 mismatch, 0 collateral change** |
| 2 | `update_case` | **C29632** [link](https://shopview.testrail.io/index.php?/cases/view/29632) | 4124 (API) | **1** (unchanged 1 → 1) | 0 (unchanged) | `custom_preconds`, `custom_steps`, `custom_expected`, `refs` | **200** | **30 fields compared, 4 intended, 0 mismatch, 0 collateral change** |

**All three text fields were sent explicitly on both payloads**, because `update_case` re-renders any
text field omitted from the payload through its HTML pipeline (playbook §J). `custom_preconds` and
`custom_steps` were sent **byte-identical to their live values** and came back byte-identical.

**Fields that moved on each case, excluding `updated_on` / `updated_by`: `custom_expected` and `refs`.
Nothing else, on either case.**

---

## 3. ⚠️ A CORRECTION TO THE BRIEF, RECORDED RATHER THAN GLOSSED (Standing Rule 12)

**The brief states: *"Both cases are flagged Automated in TestRail. `custom_atmstatus = 3`."***

**Read live before the write, that is true of C29600 and NOT true of C29632:**

| Case | `custom_atmstatus` live | Meaning |
|---|---|---|
| **C29600** | **3** | **AUTOMATED** — the brief is correct |
| **C29632** | **1** | **NOT automated.** It carries the text marker `AUTOMATION: READY`, i.e. it is *queued* for automation |

`build/filters/c29600-sourcing-2026-08-11/FINDINGS.md` §7c already recorded this correctly
(*"C29632 is `AUTOMATION: READY`, so it is queued for automation rather than automated"*); the brief's
summary of it was wrong.

**This changes nothing about what was done or what is owed.** Telling Vlad is still right — one case
is genuinely automated and the other is queued for him — and the safety argument is identical for
both, because no assertion moved on either. It is recorded because a wrong fact left standing in a log
is how the next session re-derives it.

---

## 4. POST-WRITE PROOFS

### 4a. The assertions did not move — the proof Vlad is owed

| Check | C29600 | C29632 |
|---|---|---|
| `title` byte-identical | **YES** | **YES** |
| `custom_preconds` byte-identical | **YES** | **YES** |
| `custom_steps` byte-identical | **YES** | **YES** |
| **Assertion body byte-identical** | **YES** (107 chars) | **YES** (305 chars) |
| `custom_atmstatus` | 3 → **3** | 1 → **1** |
| `custom_automation_type` | 0 → **0** | 0 → **0** |
| Fields that moved (excl. `updated_on`/`updated_by`) | `custom_expected`, `refs` | `custom_expected`, `refs` |

### 4b. Provenance and marker integrity, read back live

| Case | Provenance lines | Automation markers | Marker is last line |
|---|---|---|---|
| C29600 | **1** | **1** | **YES** |
| C29632 | **1** | **1** | **YES** |

### 4c. Markup census AFTER

**0 of 119 Filters cases carry raw markup** (`evidence/markup-census-AFTER.json`), and the case count
is **119 → 119** — no case added, none deleted.

**HONEST LIMIT, and it is the reason the census was run at both ends: TestRail has been observed to
re-render case text into HTML hours after a write without moving `updated_on`.** So this zero is a
**point-in-time measurement taken immediately after the write**, not a durable guarantee. The next
Filters pass owes a fresh census; it cannot inherit this one.

### 4d. Run 352 — Ahtasham's run — PROVEN UNTOUCHED BY CONTENT

| Check | Before | After | Verdict |
|---|---|---|---|
| `include_all` | false | false | unchanged |
| Tests | 114 | 114 | unchanged |
| Result records | 473 | 473 | unchanged |
| `case_id` sets equal **both directions** | — | — | **YES / YES** |
| `test_id` sets equal **both directions** | — | — | **YES / YES** |
| Every prior result present **BY ID** | — | — | **YES, 0 missing** |
| New results during the write window | — | — | **0** |
| **Graded / non-echo field changes across all 473 prior results** | — | — | **0** |
| Counters P / F / B / U / Retest | 65 / 7 / 0 / 42 / 0 | 65 / 7 / 0 / 42 / 0 | unchanged |

**The only field that moved anywhere in the run is `case_refs`, on 12 result records — and those 12
trace to exactly `{29600, 29632}`, the two cases whose `refs` we edited.** That is the **declared
read-time echo**, playbook §J DECLARED NORMALISATION #2b: a result record's `case_refs` is filled in
at read time from the case as it stands now, so editing a case's `refs` makes its historical result
records read back differently **with no run write whatsoever**. Asserted explicitly rather than waved
through, per Rule 50's honest-caveat clause.

**Untouched was proven BY CONTENT, never by `updated_on`.**

---

## 5. EVIDENCE FILES

| File | What it holds |
|---|---|
| `evidence/C29600.before.json` / `.after.json` | full case bodies either side of the write |
| `evidence/C29632.before.json` / `.after.json` | ditto |
| `evidence/C29600.FINAL-expected.txt` / `-refs.txt` | the live text re-read after all proofs |
| `evidence/C29632.FINAL-expected.txt` / `-refs.txt` | ditto |
| `evidence/run352.BEFORE.json` | run record, 114 tests, 473 results |
| `evidence/markup-census-BEFORE.json` / `-AFTER.json` | 0 of 119 at both ends |
| `evidence/write-log.json` | per-op HTTP status, verification line, `atmstatus`, refs before/after |

Additional snapshots written by the harness to `/tmp/testrail/snapshots/C29600.*.json` and
`C29632.*.json` (ephemeral — `/tmp` is not durable).

---

## OUTSTANDING — what I need from you

1. **A call on when Vlad is told.** `FOR-VLAD.md` is written and ready. **C29600 is flagged AUTOMATED
   in TestRail (`custom_atmstatus = 3`)**, so under your ruling today he is owed the message; you said
   you wanted to be the one who decides when he gets it. **Nothing an automated check evaluates
   changed** — that is the whole content of the message.
2. **Your go-ahead to send Branko's sheet.** The new row is **item 7 of Section 3** on
   `build/filters/questions-2026-08-06/…_Friendly-Version_2026-08-06.xlsx` (+ `.md`), regenerated from
   the generator. **Not sent** — your standing instruction is that nothing goes to a PO until our own
   work is done.
3. **The Rule 30 / Rule 57 question you already hold** — does a technical design carry PRD-level
   authority on product behaviour, or does *"informs but never overrules"* still hold? **It now governs
   eleven cases, not nine:** the nine in class C-3 of `build/unsourced-cases-2026-08-11/CANDIDATES.md`
   plus C29600 and C29632. Nothing is held on it today, because the specification here is **silent
   rather than contradictory**.
4. **A one-row correction owed to our own record, flagged not rewritten:**
   `build/unsourced-cases-2026-08-11/CANDIDATES.md` states C29600 is already on Branko's sheet. **It
   was not** — zero hits across both markdown files, the README and every XML part of both workbooks.
   Rewriting another pass's recorded verdict is not ours to do (Rules 33 and 44).
